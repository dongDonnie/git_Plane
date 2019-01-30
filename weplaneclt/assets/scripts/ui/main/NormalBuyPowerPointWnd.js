const GlobalVar = require("globalvar");
const WindowManager = require("windowmgr");
const WndTypeDefine = require("wndtypedefine");
const RootBase = require("RootBase");
const i18n = require('LanguageData');
const EventMsgID = require("eventmsgid");
const GameServerProto = require("GameServerProto");
const CommonWnd = require("CommonWnd");
const StoreageData = require("storagedata");

cc.Class({
    extends: RootBase,

    properties: {
        nodePowerPoint: {
            default: null,
            type: cc.Node,
        },
        labelLeftTimes: {
            default: null,
            type: cc.Label,
        },
        btnShare: {
            default: null,
            type: cc.Button,
        },
        btnVideo: {
            default: null,
            type: cc.Button,
        },
        nodeBuy: {
            default: null,
            type: cc.Node,
        },
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_BUY_POWER_POIN_WND;
        this.animeStartParam(0, 0);

        let rewardData = GlobalVar.tblApi.getDataBySingleKey('TblEndlessRank', GlobalVar.me().endlessData.getRankID());
        let itemObj = this.nodePowerPoint.getComponent("ItemObject");
        itemObj.updateItem(rewardData.wRewardItem);
        itemObj.setSpriteEdgeVisible(false);
        
        this.countDownTimerID = -1;
    },

    animeStartParam(paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");

            if (this.countDownTimerID != -1){
                GlobalVar.gameTimer().delTimer(this.countDownTimerID)
                this.countDownTimerID = -1;
            }

            GlobalVar.eventManager().removeListenerWithTarget(this);
            WindowManager.getInstance().popView();
        } else if (name == "Enter") {
            this._super("Enter");
            this.registerEvent();
        }
    },

    setCountDown: function () {
        if (this.countDownTimerID == -1){
            let self = this;
            this.countDownTimerID = GlobalVar.gameTimer().startTimer(this.showFreeDrawTime.bind(this), 1);
            this.showFreeDrawTime();
        }
    },

    showFreeDrawTime: function () {
        let lastPowerTime = GlobalVar.me().endlessData.getEndlesslastPowerTime()
        let curTime = GlobalVar.me().serverTime;
        let nodeNextTime = this.node.getChildByName("nodeNextTime");
        let defaultMax = GlobalVar.tblApi.getDataBySingleKey('TblParam', GameServerProto.PTPARAM_ENDLESS_POWERPOINT_MAX).dValue;
        let vipLevelMax = GlobalVar.tblApi.getDataBySingleKey('TblVipRight', GlobalVar.me().vipLevel).byVipPowerPoint
        let rewardCountMax = defaultMax + vipLevelMax;
        this.node.getChildByName("nodeLabelCur").getComponent(cc.Label).string = GlobalVar.me().endlessData.bagData.PowerPoint;
        this.node.getChildByName("nodeLabelMax").getComponent(cc.Label).string = "/" + rewardCountMax;
        if (lastPowerTime == 0){
            nodeNextTime.active = false;
        }else{
            nodeNextTime.active = true;
            let timeInterval = GlobalVar.tblApi.getDataBySingleKey('TblVipRight', GlobalVar.me().vipLevel).dwEndlessPowerPointInterval;
            let leftAddTime = timeInterval - (curTime - lastPowerTime);
            let hour = parseInt(leftAddTime/3600);
            let min = parseInt((leftAddTime - hour*3600)/60);
            if (min.toString().length == 1) min = "0" + min;
            // if (hour){
            //     nodeNextTime.getChildByName("labelTimeTipHour").getComponent(cc.Label).string = hour;
            //     nodeNextTime.getChildByName("labelTimeTipMin").getComponent(cc.Label).string = min;
                // this.labelLeftTime.string = i18n.t('label.4000323').replace('%hour', hour).replace('%min', min);
            // }else{
            nodeNextTime.getChildByName("labelTimeTipHour").getComponent(cc.Label).string = hour;
            nodeNextTime.getChildByName("labelTimeTipMin").getComponent(cc.Label).string = min;
                // this.labelLeftTime.string = i18n.t('label.4000324').replace('%min', min).replace('%sec', sec);
            // }
            // this.labelLeftTime.string = i18n.t('label.4000326').replace('%hour', hour).replace('%min', min).replace('%sec', sec);
        }
    },


    initBuyPowerPointWnd: function () {
        let maxTimes = GlobalVar.tblApi.getDataBySingleKey('TblVipRight', GlobalVar.me().vipLevel).byEndlessBuyPowerPoint;
        let curTimes = GlobalVar.me().endlessData.getBuyPowerPointCount();
        this.labelLeftTimes.string = i18n.t('label.4000327').replace("%left", maxTimes - curTimes).replace("%max", maxTimes);

        if (GlobalVar.getShareSwitch()){
            this.btnVideo.node.active = !StoreageData.getShareTimesWithKey("rewardedVideoLimit", 99) || GlobalVar.getShareControl() == 6;
            this.btnShare.node.active = !!StoreageData.getShareTimesWithKey("rewardedVideoLimit", 99) && GlobalVar.getShareControl() != 6;
            // this.btnVideo.node.active = true;
            // this.btnShare.node.active = false;
            this.nodeBuy.x = -126;
            this.nodeBuy.active = true;
        }else{
            this.btnVideo.node.active = false;
            this.btnShare.node.active = false;
            this.nodeBuy.x = 0;
            this.nodeBuy.active = true;
        }

        let buyData = GlobalVar.tblApi.getDataBySingleKey('TblEndlessBuyPpt', curTimes + 1);
        this.node.getChildByName('nodeBuy').getChildByName("labelCost").getComponent(cc.Label).string = buyData?buyData.nDiamondCost:"-";

        
        this.setCountDown();
    },

    registerEvent: function () {
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_ENDLESS_GET_BUY_POWERPOINT_DATA, this.getBuyPowerPointResult, this);
    },

    getBuyPowerPointResult: function (event) {
        if (event.ErrCode != GameServerProto.PTERR_SUCCESS){
            // GlobalVar.comMsg.errorWarning(event.ErrCode);
            if (event.ErrCode == GameServerProto.PTERR_DIAMOND_LACK) {
                CommonWnd.showNormalFreeGetWnd(event.ErrCode);
            }
            return;
        }
        GlobalVar.comMsg.showMsg("购买成功");
        this.initBuyPowerPointWnd();
    },

    onBtnShare: function (event) {
        let platformApi = GlobalVar.getPlatformApi();
        if (cc.isValid(platformApi)){
            platformApi.shareNormal(129, function () {
                GlobalVar.handlerManager().endlessHandler.sendEndlessBuyPowerPointReq(1);
            })
        }else if (GlobalVar.configGMSwitch()){
            GlobalVar.handlerManager().endlessHandler.sendEndlessBuyPowerPointReq(1);
        }
    },

    onBtnVideo: function (event) {
        let maxTimes = GlobalVar.tblApi.getDataBySingleKey('TblVipRight', GlobalVar.me().vipLevel).byEndlessBuyPowerPoint;
        let curTimes = GlobalVar.me().endlessData.getBuyPowerPointCount();

        if (curTimes >= maxTimes){
            GlobalVar.comMsg.showMsg(i18n.t('label.4000313'));
            return;
        }

        let defaultMax = GlobalVar.tblApi.getDataBySingleKey('TblParam', GameServerProto.PTPARAM_ENDLESS_POWERPOINT_MAX).dValue;
        let vipLevelMax = GlobalVar.tblApi.getDataBySingleKey('TblVipRight', GlobalVar.me().vipLevel).byVipPowerPoint
        let rewardCountMax = defaultMax + vipLevelMax;
        let curBoxCount = GlobalVar.me().endlessData.bagData.PowerPoint;

        if (rewardCountMax - curBoxCount == 1){
            GlobalVar.comMsg.showMsg(i18n.t('label.4000322'));
            return;
        }

        let platformApi = GlobalVar.getPlatformApi();
        if (cc.isValid(platformApi)){
            platformApi.showRewardedVideoAd(229, function () {
                GlobalVar.handlerManager().endlessHandler.sendEndlessBuyPowerPointReq(1);
            });
        }else if (GlobalVar.configGMSwitch()){
           GlobalVar.handlerManager().endlessHandler.sendEndlessBuyPowerPointReq(1);
        }
    },

    onBtnPurchase: function (event) {
        let maxTimes = GlobalVar.tblApi.getDataBySingleKey('TblVipRight', GlobalVar.me().vipLevel).byEndlessBuyPowerPoint;
        let curTimes = GlobalVar.me().endlessData.getBuyPowerPointCount();

        let defaultMax = GlobalVar.tblApi.getDataBySingleKey('TblParam', GameServerProto.PTPARAM_ENDLESS_POWERPOINT_MAX).dValue;
        let vipLevelMax = GlobalVar.tblApi.getDataBySingleKey('TblVipRight', GlobalVar.me().vipLevel).byVipPowerPoint
        let rewardCountMax = defaultMax + vipLevelMax;
        let curBoxCount = GlobalVar.me().endlessData.bagData.PowerPoint;

        if (curTimes < maxTimes){
            if (rewardCountMax - curBoxCount == 1){
                GlobalVar.comMsg.showMsg(i18n.t('label.4000322'));
            }else{
                GlobalVar.handlerManager().endlessHandler.sendEndlessBuyPowerPointReq();
            }
        }else{
            GlobalVar.comMsg.showMsg(i18n.t('label.4000313'));
        }
    },

    onBtnClose: function(){
        this.close();
    },

    enter: function (isRefresh) {
        this.initBuyPowerPointWnd();
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

    onDestroy: function () {
        GlobalVar.eventManager().removeListenerWithTarget(this);
        if (this.countDownTimerID != -1){
            GlobalVar.gameTimer().delTimer(this.countDownTimerID)
            this.countDownTimerID = -1;
        }
    },

});