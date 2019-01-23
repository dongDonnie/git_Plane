const GlobalVar = require("globalvar");
const WindowManager = require("windowmgr");
const WndTypeDefine = require("wndtypedefine");
const RootBase = require("RootBase");
const EventMsgID = require("eventmsgid");
const GameServerProto = require("GameServerProto");
const CommonWnd = require("CommonWnd");

cc.Class({
    extends: RootBase,

    properties: {
        rewardScorll: {
            default: null,
            type: cc.ScrollView,
        },
        itemModel: {
            default: null,
            type: cc.Node,
        },
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_SHAREDIALY_WND;
        this.animeStartParam(0, 0);
    },

    animeStartParam(paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            GlobalVar.eventManager().removeListenerWithTarget(this);
            let shareSuccess = this.shareSuccess;
            let self = this;
            WindowManager.getInstance().popView(false, function () {
                if (shareSuccess){
                    if (self.getItem.length > 0){
                        CommonWnd.showTreasureExploit(self.getItem);
                    }
                }
            }, false);
        } else if (name == "Enter") {
            this._super("Enter");
            GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_SHARE_DAILY_DATA, this.getShareDailyData, this);
            this.shareSuccess = false;
            // this.initRewards();
        }
    },

    initRewards: function () {
        let rewardItems = [
            { ItemID: 1, Count: 1000},
            { ItemID: 26, Count: 1},
            { ItemID: 701, Count: 1},
        ];

        for (let i = 0; i < rewardItems.length; i++){
            let item = cc.instantiate(this.itemModel);
            item.y = -60;
            this.rewardScorll.content.addChild(item);
            item.getChildByName("ItemObject").getComponent("ItemObject").updateItem(rewardItems[i].ItemID, rewardItems[i].Count);
        }
    },

    onBtnShare: function (event) {

        let platformApi = GlobalVar.getPlatformApi();
        if (cc.isValid(platformApi)){
            platformApi.shareNormal(117, function () {
                GlobalVar.handlerManager().shareHandler.sendShareDailyReq();
            })
        }else if (GlobalVar.configGMSwitch()){
            GlobalVar.handlerManager().shareHandler.sendShareDailyReq();
        }
    },

    onBtnClose: function(){
        this.rewardScorll.content.removeAllChildren();
        this.close();
    },

    getShareDailyData: function (event) {
        if (event.ErrCode != GameServerProto.PTERR_SUCCESS){
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        this.shareSuccess = true;
        this.getItem = event.Item;
        this.animePlay(0);
    },

    enter: function (isRefresh) {
        if (isRefresh) {
            this._super(true);
        } else {
            this._super(false);
        }
    },

    escape: function (isRefresh) {
        if (isRefresh) {
            this._super(true);
        } else {
            this._super(false);
        }
    },

});