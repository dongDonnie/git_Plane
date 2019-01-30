const WndTypeDefine = require("wndtypedefine");
const RootBase = require("RootBase");
const GlobalVar = require('globalvar')
const i18n = require('LanguageData');
const CommonWnd = require("CommonWnd");
const GameServerProto = require("GameServerProto");
const WindowManager = require("windowmgr");
const StoreageData = require("storagedata");


cc.Class({
    extends: RootBase,

    properties: {
        labelResetDesc: {
            default: null,
            type: cc.Label,
        },
        labelDiamondCost: {
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
        btnPurchase: {
            default: null,
            type: cc.Button,
        },
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_QUEST_RESET_WND;
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
            WindowManager.getInstance().popView(false, function () {
                
            }, false, false);
        } else if (name == "Enter") {
            this._super("Enter");
            if (!GlobalVar.getShareSwitch()) {
                this.btnShare.node.active = false;
                this.btnVideo.node.active = false;
                this.btnPurchase.node.x = 0;
            } else {
                this.btnShare.node.active = !!StoreageData.getShareTimesWithKey("rewardedVideoLimit", 99) && GlobalVar.getShareControl() != 6;
                this.btnVideo.node.active = !StoreageData.getShareTimesWithKey("rewardedVideoLimit", 99) || GlobalVar.getShareControl() == 6;
            }
            this.registerEvent();
        }
    },

    registerEvent: function () {
        // GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_BUY_SP_RESULT, this.getBuySpResult, this);
    },

    initQuestResetWnd: function (campData, tblData) {
        this.campData = campData;
        this.tblData = tblData;
        let curBuyTimes = this.campData.BuyCount;
        let vipLevel = GlobalVar.me().vipLevel
        let buyTimesLimit = null;
        while (!buyTimesLimit) {
            buyTimesLimit = this.tblData.oVecDailyBuyLimit[vipLevel];
            if (vipLevel < 0) {
                // console.log("tbl error");
                // this.setLeftTimesCount(0, 0);
                return;
            }
            vipLevel -= 1;
        }
        // buyTimesLimit = buyTimesLimit.byCount;

        this.labelResetDesc.string = i18n.t('label.4000250').replace('%cur', curBuyTimes).replace('%max', buyTimesLimit.byCount - curBuyTimes);

        let diamondCost = GlobalVar.tblApi.getDataBySingleKey('TblCampBuy', curBuyTimes + 1);
        this.labelDiamondCost.string = diamondCost.nDiamond;
    },

    onBtnPurchaseClick: function (event) {
        let curBuyTimes = this.campData.BuyCount;
        if (GlobalVar.me().diamond >= GlobalVar.tblApi.getDataBySingleKey('TblCampBuy', curBuyTimes + 1).nDiamond){
            let typeID = this.tblData.byTypeID;
            let chapterID = this.tblData.byChapterID;
            let campaignID = this.tblData.wCampaignID;
            GlobalVar.handlerManager().campHandler.sendCampBuyCountReq(typeID, chapterID, campaignID);
            this.close();
        }else{
            CommonWnd.showNormalFreeGetWnd(GameServerProto.PTERR_DIAMOND_LACK);
        }
    },

    onBtnShareClick: function (event) {
        let self = this;
        let platformApi = GlobalVar.getPlatformApi();
        if (cc.isValid(platformApi)){
            platformApi.shareNormal(123, function () {
                let typeID = self.tblData.byTypeID;
                let chapterID = self.tblData.byChapterID;
                let campaignID = self.tblData.wCampaignID;
                GlobalVar.handlerManager().campHandler.sendCampBuyCountReq(typeID, chapterID, campaignID, 1);
                self.close();
            }); 
        }else if (GlobalVar.configGMSwitch()){
            let typeID = self.tblData.byTypeID;
            let chapterID = self.tblData.byChapterID;
            let campaignID = self.tblData.wCampaignID;
            GlobalVar.handlerManager().campHandler.sendCampBuyCountReq(typeID, chapterID, campaignID, 1);
            self.close();
        }
    },

    onBtnVideoClick:function (event) {
        let self = this;
        let platformApi = GlobalVar.getPlatformApi();
        if (cc.isValid(platformApi)){
            platformApi.showRewardedVideoAd(223, function () {
                let typeID = self.tblData.byTypeID;
                let chapterID = self.tblData.byChapterID;
                let campaignID = self.tblData.wCampaignID;
                GlobalVar.handlerManager().campHandler.sendCampBuyCountReq(typeID, chapterID, campaignID, 1);
                self.close();
            });
        }else if (GlobalVar.configGMSwitch()){
            let typeID = self.tblData.byTypeID;
            let chapterID = self.tblData.byChapterID;
            let campaignID = self.tblData.wCampaignID;
            GlobalVar.handlerManager().campHandler.sendCampBuyCountReq(typeID, chapterID, campaignID, 1);
            self.close();
        }
    },

    onBtnClose: function (event) {
        this.close();
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