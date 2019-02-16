const GlobalVar = require("globalvar");
const WindowManager = require("windowmgr");
const WndTypeDefine = require("wndtypedefine");
const RootBase = require("RootBase");
const GlobalFunc = require('GlobalFunctions');
const EventMsgID = require("eventmsgid");
const GameServerProto = require("GameServerProto");
const CommonWnd = require("CommonWnd");

cc.Class({
    extends: RootBase,

    properties: {
        labelGetGold: {
            default: null,
            type: cc.Label,
        },
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_RECOMMAND_WND;
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
            let recommandSuccess = this.recommandSuccess;
            WindowManager.getInstance().popView(false, function () {
                if (recommandSuccess){
                    let items = [];
                    let item = {};
                    item.ItemID = 1;
                    item.Count = GlobalFunc.getShareCanGetGold(GlobalVar.me().level) * 2;
                    items.push(item);
                    CommonWnd.showTreasureExploit(items);
                }
            });
        } else if (name == "Enter") {
            this._super("Enter");
            GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_RECOMMAND_DATA, this.getRecommandData, this);
            this.recommandSuccess = false;
        }
    },

    onBtnRecommand: function (event) {
        let platformApi = GlobalVar.getPlatformApi();
        if (platformApi){
            platformApi.shareNormal(120, function () {
                GlobalVar.handlerManager().shareHandler.sendRecomandReq();
            })
        }else if (GlobalVar.configGMSwitch()){
            GlobalVar.handlerManager().shareHandler.sendRecomandReq();
        }
    },

    onBtnClose: function(){
        this.close();
    },

    getRecommandData: function (event) {
        if (event.ErrCode != GameServerProto.PTERR_SUCCESS){
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        this.recommandSuccess = true;
        this.animePlay(0);
    },

    enter: function (isRefresh) {
        if (isRefresh) {
            this.labelGetGold.string = GlobalFunc.getShareCanGetGold(GlobalVar.me().level) * 2;
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