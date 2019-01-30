const WndTypeDefine = require("wndtypedefine");
const RootBase = require("RootBase");
const GlobalVar = require('globalvar')
const EventMsgID = require("eventmsgid");
const i18n = require('LanguageData');
const CommonWnd = require("CommonWnd");
const ButtonObject = require("ButtonObject");
const GameServerProto = require("GameServerProto");
const weChatAPI = require("weChatAPI");
const WindowManager = require("windowmgr");

const limitStoreGiftId = 201;
cc.Class({
    extends: RootBase,

    properties: {
        labelTitle: {
            default: null,
            type: cc.Label,
        },
        labelBuySpValue: {
            default: null,
            type: cc.Label,
        },
        labelDiamondCost: {
            default: null,
            type: cc.Label,
        },
        labelRemainBuyTimes: {
            default: null,
            type: cc.Label,
        },
        labelLeftVideoTimesTip: {
            default: null,
            type: cc.Label,
        },
        btnVideo: {
            default: null,
            type: ButtonObject,
        },
        btnPurchase: {
            default: null,
            type: ButtonObject,
        },
        btnClose: {
            default: null,
            type: ButtonObject,
        },
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_BUY_JINHUA_WND;
        this.animeStartParam(0, 0);

        this.canOperata = true;
        this.diamondCost = 0;
        this.remainBuyTimes = 0;

        if (!GlobalVar.getVideoAdSwitch()) {
            this.btnVideo.node.active = false;
            this.btnPurchase.node.x = 0;
            this.labelLeftVideoTimesTip.node.active = false;
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
            WindowManager.getInstance().popView(false, function () {

            }, false, false);
        } else if (name == "Enter") {
            this._super("Enter");
            this.registerEvent();
        }
    },

    registerEvent: function () {
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_JINHUA_REWARD_DATA, this.freeGetJinHua, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_LIMIT_STORE_BUY_NTF, this.buyGetJinHua, this);
    },

    freeGetJinHua: function (event) {
        if (event.ErrCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        };
        CommonWnd.showTreasureExploit(event.Item);
        this.initFreeTimes();
    },

    buyGetJinHua: function (event) {
        if (event.ErrCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        };
        CommonWnd.showTreasureExploit(event.Item);
        this.initBuyJinHuaWnd();
    },

    initBuyJinHuaWnd: function () {
        let curTime = GlobalVar.me().limitStoreData.findFuliGiftById(limitStoreGiftId).Num;
        let item = GlobalVar.tblApi.getDataBySingleKey('TblFuLiGiftLimit', limitStoreGiftId);
        let maxTime = item.wLimit;
        this.diamondCost = GlobalVar.me().limitStoreData.getBuyCostNum(curTime + 1, curTime + 1, item.oVecCost);
        this.remainBuyTimes = maxTime - curTime;
        this.labelDiamondCost.string = this.diamondCost;
        this.labelRemainBuyTimes.string = this.remainBuyTimes;
    },

    initFreeTimes: function () {
        let freeMax = GlobalVar.tblApi.getDataBySingleKey('TblParam', GameServerProto.PTPARAM_FULI_SHARE_GUAZAI_JINHUA_LIMIT).dValue;
        let freeTimes = GlobalVar.me().shareData.getFreeJinHuaCount();
        let remainTimes = freeMax > freeTimes ? freeMax - freeTimes : 0;
        let leftVideoTimesTipStr = '观看视频还可免费获取' + remainTimes + '次';
        this.setLeftVideoTimesTip(leftVideoTimesTipStr);
        this.setLeftVideoTimes(remainTimes);
    },

    refreshJinHuaWndUI: function () {
        if (!GlobalVar.me().limitStoreData.getGiftData()) {
            GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_LIMIT_STORE_DATA_NTF, this.initBuyJinHuaWnd, this);
            this.requestStoreData();
        } else {
            this.initBuyJinHuaWnd();
        }
        this.initFreeTimes();
    },

    requestStoreData: function () {
        let msg = {
            Type: GameServerProto.PT_FULI_TYPE_LIMIT_GIFT,
        };
        // cc.log("发送数据");
        GlobalVar.handlerManager().limitStoreHandler.sendReq(GameServerProto.GMID_FULI_GIFT_DATA_REQ, msg);
    },

    onBtnVideoClick: function (event) {
        if (!this.canOperata) {
            return;
        }
        let platformApi = GlobalVar.getPlatformApi();
        let successCallback = () => {
            GlobalVar.handlerManager().shareHandler.sendGetFreeJinHuaReq();
        };
        if (platformApi) {
            // let failCallback = () => {
            //     if (GlobalVar.getShareControl() == 1){
            //         platformApi.shareNormal(132, successCallback);
            //     }else{
            //         GlobalVar.comMsg.showMsg(i18n.t('label.4000321'));
            //     }
            // }
            platformApi.showRewardedVideoAd(232, successCallback);
        } else {
            successCallback();
        }
    },

    onBtnPurchaseClick: function (event) {

        if (!this.canOperata) {
            return;
        }

        if (this.remainBuyTimes <= 0) {
            GlobalVar.comMsg.showMsg(i18n.t('label.4000228'))
            return;
        }

        let userHaveDiamond = GlobalVar.me().getDiamond();

        if (userHaveDiamond < this.diamondCost) {
            CommonWnd.showNormalFreeGetWnd(GameServerProto.PTERR_DIAMOND_LACK);
            return;
        }

        this.canOperata = true;

        let msg = {
            Type: GameServerProto.PT_FULI_TYPE_LIMIT_GIFT,
            ID: limitStoreGiftId,
            Num: 1,
            Free: 0,
        };
        GlobalVar.handlerManager().limitStoreHandler.sendReq(GameServerProto.GMID_FULI_GIFT_BUY_REQ, msg);
    },

    onBtnClose: function (event) {
        this.close();
    },

    setLeftVideoTimesTip: function (text) {
        if (typeof text !== 'undefined' && text != "") {
            this.labelLeftVideoTimesTip.string = text;
        }
    },

    setLeftVideoTimes: function (leftTimes) {
        if (leftTimes > 0) {
            this.btnVideo.node.getComponent(cc.Button).interactable = true;
        } else {
            this.btnVideo.node.getComponent(cc.Button).interactable = false;
        }
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