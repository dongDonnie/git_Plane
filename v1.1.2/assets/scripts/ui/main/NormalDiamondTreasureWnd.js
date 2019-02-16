const RootBase = require("RootBase");
const GlobalVar = require('globalvar');
const WindowManager = require("windowmgr");
const EventMsgID = require("eventmsgid");
const GameServerProto = require("GameServerProto");
const CommonWnd = require("CommonWnd");
const i18n = require('LanguageData');
const WndTypeDefine = require("wndtypedefine");
const StoreageData = require("storagedata");
const NOVIDEO_NEED_VIP_LEVEL = 1;

var self = null;
cc.Class({
    extends: RootBase,

    properties: {
        labelLeftTimesTip: {
            default: null,
            type: cc.Label,
        },
        labelVipTips: {
            default: null,
            type: cc.Label,
        },
        btnTreasure: {
            default: null,
            type: cc.Button,
        },
    },

    ctor: function () {
        self = this;
    },

    onLoad() {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_DIAMOND_TREASURE_WND;
        this.animeStartParam(0, 0);
    },

    animeStartParam(paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_DIAMOND_TREASURE_WND;

        let spriteTip = this.node.getChildByName("nodeBtn").getChildByName("spriteContinueTip");
        spriteTip.runAction(cc.repeatForever(cc.sequence(cc.fadeIn(0.7), cc.fadeOut(0.7))));
        spriteTip.active = false;
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            GlobalVar.eventManager().removeListenerWithTarget(this);
            WindowManager.getInstance().popView(false, null, false, false);
        } else if (name == "Enter") {
            this._super("Enter");
            let spriteTip = this.node.getChildByName("nodeBtn").getChildByName("spriteContinueTip");
            spriteTip.active = true;

            if (!GlobalVar.srcSwitch()) {
                this.getNodeByName('btnRecharge').active = true;
                this.labelVipTips.node.active = true;
            }
            this.registerEvent();
            this.initDiamondTreasureWnd();
        }
    },

    showBannnerCallback: function (bannerHeight) {
        let spriteTip = this.node.getChildByName("nodeBtn").getChildByName("spriteContinueTip");
        if (cc.sys.platform == cc.sys.WECHAT_GAME){
            let winHeight = cc.winSize.height;
            let screenHeight = wx.getSystemInfoSync().screenHeight;
            spriteTip.y = -(winHeight/2 - bannerHeight / screenHeight * winHeight);
            spriteTip.active = true;
        }else{
            spriteTip.y = -300;
            spriteTip.active = true;
        }
    },

    registerEvent: function () {
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_FREE_DIAMOND, this.getFreeDiamond, this);
    },

    getFreeDiamond: function (event) {
        if (event.ErrCode != GameServerProto.PTERR_SUCCESS){
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        this.initDiamondTreasureWnd();
        CommonWnd.showTreasureExploit(event.Item);
    },

    initDiamondTreasureWnd: function () {
        // 剩余次数状态
        let curTime = GlobalVar.me().shareData.getFreeDiamondCount();
        let maxTime = GlobalVar.tblApi.getDataBySingleKey('TblParam', GameServerProto.PTPARAM_RCG_FREE_DIAMOND_COUNT_MAX).dValue;
        this.labelLeftTimesTip.string = i18n.t('label.4000318').replace("%cur", maxTime - curTime).replace("%max", maxTime);

        if (GlobalVar.me().vipLevel >= NOVIDEO_NEED_VIP_LEVEL){
            // this.labelVipTips.node.color = cc.color(160, 160, 160);
            this.btnTreasure.node.getChildByName("spriteText").x = 0;
            this.btnTreasure.node.getChildByName("spriteVideo").active = false;
            this.btnTreasure.node.getChildByName("spriteShare").active = false;
        }else {
            this.labelVipTips.string = i18n.t('label.4000319').replace("%level", NOVIDEO_NEED_VIP_LEVEL);
            this.btnTreasure.node.getChildByName("spriteText").x = 16;
            this.btnTreasure.node.getChildByName("spriteVideo").active = GlobalVar.canShowVideo(true);
            this.btnTreasure.node.getChildByName("spriteShare").active = !GlobalVar.canShowVideo(true);
        }
        if (curTime < maxTime){
            this.btnTreasure.node.color = cc.color(255, 255, 255);
        }else{
            this.btnTreasure.node.color = cc.color(160, 160, 160);
        }
        // this.btnTreasure.interactable = curTime < maxTime;
    },

    onBtnTreasureDiamond: function () {
        let curTime = GlobalVar.me().shareData.getFreeDiamondCount();
        let maxTime = GlobalVar.tblApi.getDataBySingleKey('TblParam', GameServerProto.PTPARAM_RCG_FREE_DIAMOND_COUNT_MAX).dValue;
        if (curTime >= maxTime){
            GlobalVar.comMsg.errorWarning(GameServerProto.PTERR_RCG_FREE_DIAMOND_LACK);
            return;
        }
        
        if (GlobalVar.me().vipLevel >= NOVIDEO_NEED_VIP_LEVEL){
            GlobalVar.handlerManager().shareHandler.sendGetFreeDiamondReq();
        }else{
            let platformApi = GlobalVar.getPlatformApi();
            if (platformApi){
                // if (GlobalVar.canShowVideo()){
                    platformApi.showRewardedVideoAd(215, function () {
                        GlobalVar.handlerManager().shareHandler.sendGetFreeDiamondReq();
                    }, null, true, true);
                // }else{
                //     platformApi.shareNormal(115, function () {
                //         GlobalVar.handlerManager().shareHandler.sendGetFreeDiamondReq();
                //     }); 
                // }
            }else if (GlobalVar.configGMSwitch()){
                GlobalVar.handlerManager().shareHandler.sendGetFreeDiamondReq();
            }
        }
    },

    onBtnRecharge: function () {
        CommonWnd.showRechargeWnd();
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
