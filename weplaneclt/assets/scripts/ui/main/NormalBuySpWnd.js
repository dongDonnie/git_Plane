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
        labelLeftBuyTimes: {
            default: null,
            type: cc.Label,
        },
        labelLeftShareTimesTip: {
            default: null,
            type: cc.Label,
        },
        btnShare: {
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
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_BUY_SP_WND;
        this.animeStartParam(0, 0);
        this.shareCallBack = null;
        this.purchaseCallBack = null;
        this.closeCallBack = null;
        this.canOperata = true;

        if (!GlobalVar.getShareSwitch()){
            this.btnShare.node.active = false;
            this.btnPurchase.node.x = 0;
            this.labelLeftShareTimesTip.node.active = false;
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
            this.shareCallBack = null;
            this.purchaseCallBack = null;
            this.closeCallBack = null;
            GlobalVar.eventManager().removeListenerWithTarget(this);
            WindowManager.getInstance().popView(false, function () {
                
            }, false, false);
        } else if (name == "Enter") {
            this._super("Enter");
            this.registerEvent();
        }
    },

    registerEvent: function () {
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_BUY_SP_RESULT, this.getBuySpResult, this);
    },

    initBuySpWnd: function () {
        let title = i18n.t('label.4000230')
        let shareName = i18n.t("label.4000304");
        let purchaseName = i18n.t("label.4000214");
        let curTime = GlobalVar.me().spData.getSpFreeCount();
        let maxTime = GlobalVar.tblApi.getDataBySingleKey('TblParam', GameServerProto.PTPARAM_SP_FREE_GET_MAX).dValue;
        let leftShareTime = maxTime - curTime;
        let leftShareTimesTipStr = i18n.t("label.4000312").replace("%d", leftShareTime);

        let spData = GlobalVar.me().getSpData();
        let vipLevel = GlobalVar.me().getVipLevel();
        let buyTimes = spData.BuyTimes;
        let spBuyTblData = GlobalVar.tblApi.getDataBySingleKey("TblSpBuy", buyTimes + 1);
        let spBuyTimesLimit = GlobalVar.tblApi.getDataBySingleKey("TblSpVip", vipLevel).byBuySpTimes;
        let diamondCost = 0, leftBuyTimes = 0
        diamondCost = spBuyTblData.nDiamondCost;
        leftBuyTimes = spBuyTimesLimit - buyTimes;

        this.setTitle(title);
        this.setLeftShareTimesTip(leftShareTimesTipStr);
        this.setLeftShareTimes(leftShareTime);
        this.setLeftBuyTimes(leftBuyTimes);
        this.setGetSpCount(spBuyTblData.wGetSp);
        this.setDiamondCost(diamondCost);
        // this.setBtnEvent(shareCallBack, purchaseCallBack, closeCallBack);
        this.setShareText(shareName);
        this.setPurchaseText(purchaseName);
    },

    getBuySpResult: function (event) {
        this.canOperata = true;
        if (event.ErrCode && event.ErrCode !== GameServerProto.PTERR_SUCCESS) {
            if (event.ErrCode == GameServerProto.PTERR_DIAMOND_LACK){
                CommonWnd.showNormalFreeGetWnd(event.ErrCode);
            } else{
                GlobalVar.comMsg.errorWarning(event.ErrCode);
            }
        } else {
            GlobalVar.comMsg.showMsg(i18n.t('label.4000231'));
            this.initBuySpWnd();
        }
    },

    onBtnShareClick: function (event) {
        // if (cc.sys.platform !== cc.sys.WECHAT_GAME && !(window && window["wywGameId"]=="5469")){
        //     if (!!this.shareCallBack){
        //         this.shareCallBack();
        //     }
        //     // this.close();
        //     return;
        // }

        if (!this.canOperata){
            return;
        }

        this.canOperata = true;
        if (cc.sys.platform == cc.sys.WECHAT_GAME){
            // CommonWnd.showMessage(null, CommonWnd.oneConfirm, i18n.t('label.4000216'), i18n.t('label.4000317'));
            // setTimeout(() => {
            //     weChatAPI.shareNeedClick(121, function () {
            //         GlobalVar.handlerManager().spHandler.sendSpBuyReq(1);
            //     });
            // }, 1000);
            CommonWnd.showMessage(null, CommonWnd.oneConfirm, i18n.t('label.4000216'), i18n.t('label.4000317'), null, function () {
                weChatAPI.shareNeedClick(131, function () {
                    GlobalVar.handlerManager().spHandler.sendSpBuyReq(1);
                });
            });
        }else{
            let platformApi = GlobalVar.getPlatformApi();
            if (cc.isValid(platformApi)){
                platformApi.shareNormal(131, function () {
                    GlobalVar.handlerManager().spHandler.sendSpBuyReq(1);
                });
            }
        }
    },

    onBtnPurchaseClick: function (event) {
        // if (!!this.purchaseCallBack) {
        //     this.purchaseCallBack();
        // }

        if (!this.canOperata){
            return;
        }

        let spData = GlobalVar.me().getSpData();
        let vipLevel = GlobalVar.me().getVipLevel();
        let buyTimes = spData.BuyTimes;
        let spBuyTblData = GlobalVar.tblApi.getDataBySingleKey("TblSpBuy", buyTimes + 1);
        let spBuyTimesLimit = GlobalVar.tblApi.getDataBySingleKey("TblSpVip", vipLevel).byBuySpTimes;
        let diamondCost = 0, leftBuyTimes = 0
        diamondCost = spBuyTblData.nDiamondCost;
        leftBuyTimes = spBuyTimesLimit - buyTimes;

        if (leftBuyTimes <= 0) {
            GlobalVar.comMsg.showMsg(i18n.t('label.4000228'))
            return;
        }

        let userHaveDiamond = GlobalVar.me().getDiamond();

        if (userHaveDiamond < diamondCost) {
            // GlobalVar.comMsg.showMsg(i18n.t('label.4000221'))
            CommonWnd.showNormalFreeGetWnd(GameServerProto.PTERR_DIAMOND_LACK);
            return;
        }

        this.canOperata = true;
        GlobalVar.handlerManager().spHandler.sendSpBuyReq(0);
    },

    onBtnClose: function (event) {
        // if (!!this.closeCallBack) {
        //     this.closeCallBack();
        // }
        this.close();
    },

    setTitle: function (text) {
        if (typeof text !== 'undefined' && text != "") {
            this.labelTitle.string = text;
        }
    },

    setLeftShareTimesTip: function (text) {
        if (typeof text !== 'undefined' && text != "") {
            this.labelLeftShareTimesTip.string = text;
        }
    },

    setLeftBuyTimes: function (text) {
        if (text != undefined && text !== "") {
            this.labelLeftBuyTimes.string = text;
        }
    },

    setGetSpCount: function (text) {
        if (typeof text !== 'undefined' && text != "") {
            this.labelBuySpValue.string = text;
        }
    },

    setDiamondCost: function (text) {
        if (typeof text !== 'undefined' && text != "") {
            this.labelDiamondCost.string = text;
        } 
    },

    setLeftShareTimes: function (leftTimes) {
        if (leftTimes > 0) {
            this.btnShare.node.getComponent(cc.Button).interactable = true;
        } else {
            this.btnShare.node.getComponent(cc.Button).interactable = false;
        }
    },

    setBtnEvent: function (closeCallBack, shareCallBack, purchaseCallBack) {
        if (typeof closeCallBack !== 'undefined' && closeCallBack != null) {
            this.closeCallBack = closeCallBack;
        } else {
            this.closeCallBack = null;
        }

        if (typeof shareCallBack !== 'undefined' && shareCallBack != null) {
            this.shareCallBack = shareCallBack;
        } else {
            this.shareCallBack = null;
        }

        if (typeof purchaseCallBack !== 'undefined' && purchaseCallBack != null) {
            this.purchaseCallBack = purchaseCallBack;
        } else {
            this.purchaseCallBack = null;
        }
    },

    setShareText: function (text) {
        if (typeof text !== 'undefined' && text != "") {
            this.btnShare.setText(text);
        }
    },

    setPurchaseText: function (text) {
        if (typeof text !== 'undefined' && text != "") {
            this.btnPurchase.setText(text);
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