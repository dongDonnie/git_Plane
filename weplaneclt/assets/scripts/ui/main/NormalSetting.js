const RootBase = require("RootBase");
const WindowManager = require("windowmgr");
const GlobalVar = require('globalvar')
const WndTypeDefine = require("wndtypedefine");
const CommonWnd = require("CommonWnd")
const EventMsgID = require("eventmsgid");
const config = require("config");
const SceneDefines = require('scenedefines')
const BattleManager = require('BattleManager')
const weChatAPI = require("weChatAPI");
const StoreageData = require("storagedata");

cc.Class({
    extends: RootBase,

    properties: {
        labelTitle: {
            default: null,
            type: cc.Label
        },
        labelVersion: {
            default: null,
            type: cc.Label,
        },
        labelUserAccount: {
            default: null,
            type: cc.Label,
        },
        labelServerName: {
            default: null,
            type: cc.Label,
        },
        btnConfirm: {
            default: null,
            type: cc.Button,
        },
        btnNotice: {
            default: null,
            type: cc.Button,
        },
        btnClose: {
            default: null,
            type: cc.Button,
        },
        btnEffectOnOff: {
            default: null,
            type: cc.Button,
        },
        btnBgmOnOff: {
            default: null,
            type: cc.Button,
        },
        btnVibrateOnOff: {
            default: null,
            type: cc.Button,
        },
        btnFeedback: {
            default: null,
            type: cc.Node,
        },
        editBoxGiftCard: {
            default: null,
            type: cc.EditBox,
        },
        effectIsOn: true,
        bgmIsOn: true,
        vibrateIsOn: true,
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMALSETTING;
        this.labelVersion.string = GlobalVar.tblApi.getData('TblVersion')[1].strVersion;
        this.animeStartParam(0, 0);
        this.clickGMTimes = 0;

        if (window && window["wywGameId"] == "5469") {
            this.btnNotice.node.x = 0;
            this.btnFeedback.node.active = false;
        }
    },

    animeStartParam(paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            WindowManager.getInstance().popView();
            if (!!this.feedbackButton) {
                this.feedbackButton.destroy();
                this.feedbackButton = null;
            }
        } else if (name == "Enter") {
            this._super("Enter");
            GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_SHOW_NOTICE_LIST, this.onRecvNoticeAck, this);
            this.clickGMTimes = 0;
            this.btnSize = cc.size(this.btnFeedback.width, this.btnFeedback.height);
            let btnWorldPos = this.btnFeedback.parent.convertToWorldSpaceAR(this.btnFeedback.position);
            this.viewPos = this.node.parent.convertToNodeSpaceAR(btnWorldPos);
            this.createFeedbackBtn();
        }
    },

    enter: function (isRefresh) {
        if (isRefresh) {
            this.initSettingWindow()
            this._super(true);
        } else {
            this._super(false);
            this.createFeedbackBtn();
        }
    },

    escape: function (isRefresh) {
        if (isRefresh) {
            this._super(true);
        } else {
            this._super(false);
        }
    },

    initSettingWindow: function () {
        this.labelUserAccount.string = GlobalVar.me().roleID;
        this.labelServerName.string = GlobalVar.me().loginData.getLoginReqDataServerName() || "";
        this.effectIsOn = GlobalVar.soundManager().getEffectOnOff() ? "on" : "off";
        this.bgmIsOn = GlobalVar.soundManager().getBgmOnOff() ? "on" : "off";
        this.vibrateIsOn = StoreageData.getVibrateSwitch();

        this.setBtnEffectState();
        this.setBtnBgmState();
        this.setBtnVibrateState();
    },

    setBtnEffectState: function () {
        let SWITCH_ON = 1,
            SWITCH_OFF = 0;
        let spriteEffect = this.btnEffectOnOff.node.getComponent("RemoteSprite");
        this.effectIsOn === "on" ? spriteEffect.setFrame(SWITCH_ON) : spriteEffect.setFrame(SWITCH_OFF);
    },

    setBtnBgmState: function () {
        let SWITCH_ON = 1,
            SWITCH_OFF = 0;
        let spriteBgm = this.btnBgmOnOff.node.getComponent("RemoteSprite");
        this.bgmIsOn === "on" ? spriteBgm.setFrame(SWITCH_ON) : spriteBgm.setFrame(SWITCH_OFF)

        // this.bgmClickTimes = this.bgmClickTimes + 1 || 1;
        // if (this.bgmClickTimes > 10){
        //     GlobalVar.bannerOpen = true;
        //     console.log("banner已开启");
        // }
    },
    setBtnVibrateState: function () {
        let SWITCH_ON = 1,
            SWITCH_OFF = 0;
        let spriteVibrate = this.btnVibrateOnOff.node.getComponent("RemoteSprite");
        this.vibrateIsOn === "on" ? spriteVibrate.setFrame(SWITCH_ON) : spriteVibrate.setFrame(SWITCH_OFF)
    },

    onBtnEffectOnOff: function (event) {
        this.effectIsOn = this.effectIsOn === "on" ? "off" : "on";
        GlobalVar.soundManager().setEffectOnOff(this.effectIsOn);
        this.setBtnEffectState();
        // console.log("Effect checked:" + this.effectIsOn);
    },

    onBtnBgmOnOff: function (event) {
        this.bgmIsOn = this.bgmIsOn === "on" ? "off" : "on";
        GlobalVar.soundManager().setBgmOnOff(this.bgmIsOn);
        this.setBtnBgmState();
        // console.log("Bgm checked:" + this.bgmIsOn);
    },
    onBtnVibrateOnOff: function (event) {
        this.vibrateIsOn = this.vibrateIsOn === "on" ? "off" : "on";
        StoreageData.setVibrateSwitch(this.vibrateIsOn);
        console.log("震动开关", StoreageData.getVibrateSwitch());
        this.setBtnVibrateState();
    },

    onBtnConfirm: function () {
        let code = this.editBoxGiftCard.string;
        if (code == "") {
            GlobalVar.comMsg.showMsg("激活码不能为空!");
            return;
        }
        GlobalVar.handlerManager().mainHandler.sendGiftCardSeq(code);
    },

    onBtnNotice: function () {
        GlobalVar.handlerManager().noticeHandler.sendGetNoticeReq();
        if (!!this.feedbackButton) {
            this.feedbackButton.destroy();
            this.feedbackButton = null;
        }
    },

    onBtnQuit: function () {
        BattleManager.getInstance().quitOutSide();
        GlobalVar.networkManager().needReConnected = false;
        GlobalVar.handlerManager().loginHandler.sendLogOutReq();
        if (!!this.feedbackButton) {
            this.feedbackButton.destroy();
            this.feedbackButton = null;
        }
        GlobalVar.sceneManager().gotoScene(SceneDefines.LOGIN_STATE);
    },

    onRecvNoticeAck: function () {
        let noticeCount = GlobalVar.me().noticeData.getNoticeCount();
        let self = this;
        if (noticeCount > 0) {
            CommonWnd.showNoticeWnd();
        } else {
            GlobalVar.comMsg.showMsg("暂无公告");
            this.createFeedbackBtn();
        }
    },

    onBtnFeedback: function () {

    },

    onClickOpenGM: function (event, index) {
        return;
        if (Math.abs(this.clickGMTimes % 2) == index) {
            if (!config.GM_SWITCH) {
                this.clickGMTimes++;
            } else {
                this.clickGMTimes--;
            }
            console.log("clickTimes:", this.clickGMTimes);
        } else {
            // this.clickGMTimes = 0;
        }
        if (this.clickGMTimes == 10) {
            config.GM_SWITCH = true;
            this.clickGMTimes = 0;
            // GlobalVar.comMsg.showMsg("开启GM模式");
            GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GM_SWITCH_CHANGE);
        } else if (this.clickGMTimes == -10) {
            config.GM_SWITCH = false;
            this.clickGMTimes = 0;
            // GlobalVar.comMsg.showMsg("关闭GM模式");
            GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GM_SWITCH_CHANGE);
        }
    },

    createFeedbackBtn() {
        if (cc.sys.platform != cc.sys.WECHAT_GAME) {
            return;
        }
        let self = this;
        let createBtn = function () {
            let btnSize = self.btnSize;
            let frameSize = cc.view.getFrameSize();

            let viewPos = self.viewPos;

            let left = (cc.winSize.width * 0.5 + viewPos.x - btnSize.width * 0.5) / cc.winSize.width * frameSize.width;
            let top = (cc.winSize.height * 0.5 - viewPos.y - btnSize.height * 0.5) / cc.winSize.height * frameSize.height;
            let width = btnSize.width / cc.winSize.width * frameSize.width;
            let height = btnSize.height / cc.winSize.height * frameSize.height;

            self.feedbackButton = weChatAPI.feedBack(left, top, width, height);
        }

        createBtn();
    },
});