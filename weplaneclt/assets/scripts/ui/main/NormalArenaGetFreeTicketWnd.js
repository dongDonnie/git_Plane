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
        labelCost: {
            default: null,
            type: cc.Label,
        },
        labelCurTicketCount: {
            default: null,
            type: cc.Label,
        },
        labelFreeGetCount: {
            default: null,
            type: cc.Label,
        },
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_ARENA_GET_FREE_TICKET_WND;
        this.animeStartParam(0, 0);

        // this.nodeItemObj.getComponent("ItemObject").updateItem(GameServerProto.PT_ITEMID_ARENA_CHALLENGE_TICKET, 5);
        this.labelCost.string = GameServerProto.PT_ARENA_CHALLENGE_TICKET_PRICE;

        if (!GlobalVar.getShareSwitch()){
            this.node.getChildByName("labelFreeGetCount").active = false;
            this.node.getChildByName("btnVideo").active = false;
            this.node.getChildByName("nodeBuy").x = 0;
        }
    },

    animeStartParam(paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            GlobalVar.eventManager().removeListenerWithTarget(this);
            WindowManager.getInstance().popView();
        } else if (name == "Enter") {
            this._super("Enter");
            this.registerEvent();
        }
    },

    registerEvent: function () {
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_ARENA_CHALLENGE_COUNT_FREE_GET_DATA, this.getArenaChallengeCountFreeGetData, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_ARENA_CHALLENGE_COUNT_BUY_DATA, this.getArenaChallengeCountBuyData, this);
    },
    initTicketCount: function () {
        this.labelCurTicketCount.string = GlobalVar.me().bagData.getItemCountById(GameServerProto.PT_ITEMID_ARENA_CHALLENGE_TICKET);
        let maxTimes = GlobalVar.tblApi.getDataBySingleKey('TblParam', GameServerProto.PTPARAM_ARENA_CHALLENGE_COUNT_FREE_BUY_LIMIT).dValue;
        let curTimes = GlobalVar.me().arenaData.getArenaFreeGetCount();
        this.labelFreeGetCount.string = (maxTimes - curTimes) + "/" + maxTimes;
    },

    getArenaChallengeCountBuyData: function (event) {
        if (event.ErrCode != GameServerProto.PTERR_SUCCESS){
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        GlobalVar.comMsg.showMsg("购买成功");
        this.initTicketCount();
    },
    getArenaChallengeCountFreeGetData: function (event) {
        if (event.ErrCode != GameServerProto.PTERR_SUCCESS){
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        GlobalVar.comMsg.showMsg("购买成功");
        this.initTicketCount();
    },

    onBtnVideo: function (event) {
        let maxTimes = GlobalVar.tblApi.getDataBySingleKey('TblParam', GameServerProto.PTPARAM_ARENA_CHALLENGE_COUNT_FREE_BUY_LIMIT).dValue;
        let curTimes = GlobalVar.me().arenaData.getArenaFreeGetCount();
        if (curTimes >= maxTimes){
            GlobalVar.comMsg.errorWarning(GameServerProto.PTERR_ARENA_CHALLENGE_COUNT_FREE_BUY_TIMES_GET_LIMIT);
            return;
        }
        let platformApi = GlobalVar.getPlatformApi();
        if (cc.isValid(platformApi)){
            platformApi.showRewardedVideoAd(228, function () {
                GlobalVar.handlerManager().arenaHandler.sendArenaChallengeCountFreeGetReq();
            });
        }else if (GlobalVar.configGMSwitch()){
           GlobalVar.handlerManager().arenaHandler.sendArenaChallengeCountFreeGetReq();
        }
    },

    onBtnPurchase: function (event) {
        if (GlobalVar.me().diamond < GameServerProto.PT_ARENA_CHALLENGE_TICKET_PRICE){
            CommonWnd.showNormalFreeGetWnd(GameServerProto.PTERR_DIAMOND_LACK);
            return;
        }
        GlobalVar.handlerManager().arenaHandler.sendArenaChallengeCountBuyReq(1);
    },

    onBtnClose: function(){
        this.close();
    },

    enter: function (isRefresh) {
        if (isRefresh) {
            this.initTicketCount();
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

    onDestroy: function () {

    },

});