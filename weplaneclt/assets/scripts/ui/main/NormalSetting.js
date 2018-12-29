
const RootBase = require("RootBase");
const WindowManager = require("windowmgr");
const GlobalVar = require('globalvar')
const WndTypeDefine = require("wndtypedefine");
const GameServerProto = require("GameServerProto");
const CommonWnd = require("CommonWnd")
const EventMsgID = require("eventmsgid");
const config = require("config");
const SceneDefines = require('scenedefines')
const BattleManager = require('BattleManager')
const weChatAPI = require("weChatAPI");

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
        btnFeedback: {
            default: null,
            type: cc.Button,
        },
        editBoxGiftCard: {
            default: null,
            type: cc.EditBox,
        },
        effectIsOn: true,
        bgmIsOn: true,
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMALSETTING;
        this.labelVersion.string = GlobalVar.tblApi.getData('TblVersion')[1].strVersion;
        this.animeStartParam(0, 0);
        this.clickGMTimes = 0;
    },

    animeStartParam(paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");            
            if (GlobalVar.getBannerSwitch()){
                weChatAPI.hideBannerAd();
            }
            WindowManager.getInstance().popView();
            if (this.feedbackButton) {
                this.feedbackButton.destroy();
                this.feedbackButton = null;
            }
        } else if (name == "Enter") {
            this._super("Enter");
            if (GlobalVar.getBannerSwitch() && !GlobalVar.getNeedGuide()){
                weChatAPI.showBannerAd();
            }
            GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_SHOW_NOTICE_LIST, this.onRecvNoticeAck, this);
            this.clickGMTimes = 0;
            this.createFeedbackBtn(this.btnFeedback.node);
        }
    },

    enter: function (isRefresh) {
        if (isRefresh) {
            this.initSettingWindow()
            this._super(true);
        } else {
            this._super(false);
            this.createFeedbackBtn(this.btnFeedback.node);
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
        this.effectIsOn = GlobalVar.soundManager().getEffectOnOff();
        this.bgmIsOn = GlobalVar.soundManager().getBgmOnOff();
        this.setBtnEffectState();
        this.setBtnBgmState();
    },

    setBtnEffectState: function () {
        let SWITCH_ON = 1, SWITCH_OFF = 0;
        let spriteEffect = this.btnEffectOnOff.node.getComponent("RemoteSprite");
        this.effectIsOn ? spriteEffect.setFrame(SWITCH_ON) : spriteEffect.setFrame(SWITCH_OFF);
    },

    setBtnBgmState: function () {
        let SWITCH_ON = 1, SWITCH_OFF = 0;
        let spriteBgm = this.btnBgmOnOff.node.getComponent("RemoteSprite");
        this.bgmIsOn ? spriteBgm.setFrame(SWITCH_ON) : spriteBgm.setFrame(SWITCH_OFF)

        // this.bgmClickTimes = this.bgmClickTimes + 1 || 1;
        // if (this.bgmClickTimes > 10){
        //     GlobalVar.bannerOpen = true;
        //     console.log("banner已开启");
        // }
    },

    onBtnEffectOnOff: function (event) {
        GlobalVar.soundManager().setEffectOnOff(this.effectIsOn = !this.effectIsOn);
        this.setBtnEffectState();
        // console.log("Effect checked:" + this.effectIsOn);
    },

    onBtnBgmOnOff: function (event) {
        GlobalVar.soundManager().setBgmOnOff(this.bgmIsOn = !this.bgmIsOn,true);
        this.setBtnBgmState();
        // console.log("Bgm checked:" + this.bgmIsOn);
    },

    onBtnConfirm: function () {
        let code = this.editBoxGiftCard.string;
        if (code == ""){
            GlobalVar.comMsg.showMsg("激活码不能为空!");
            return;
        }
        GlobalVar.handlerManager().mainHandler.sendGiftCardSeq(code);
    },

    onBtnNotice: function () {
        GlobalVar.handlerManager().noticeHandler.sendGetNoticeReq();
        if (this.feedbackButton) {
            this.feedbackButton.destroy();
            this.feedbackButton = null;
        }
    },

    onBtnQuit: function () {
        GlobalVar.handlerManager().loginHandler.sendLogOutReq();
        BattleManager.getInstance().quitOutSide();
        // GlobalVar.netWaiting().reconnect = false;
        // GlobalVar.networkManager().socket.onclose();
        GlobalVar.sceneManager().gotoScene(SceneDefines.LOGIN_STATE);
        if (this.feedbackButton) {
            this.feedbackButton.destroy();
            this.feedbackButton = null;
        }
    },

    onRecvNoticeAck: function () {
        let noticeCount = GlobalVar.me().noticeData.getNoticeCount();
        let self = this;
        if (noticeCount > 0) {
            CommonWnd.showNoticeWnd();
        }else{
            GlobalVar.comMsg.showMsg("暂无公告");
            this.createFeedbackBtn(this.btnFeedback.node);
        }
    },

    onBtnFeedback: function () {
        
    },

    onClickOpenGM: function (event, index) {
        // return;
        if (Math.abs(this.clickGMTimes % 2) == index){
            if (!config.GM_SWITCH){
                this.clickGMTimes++;
            }else{
                this.clickGMTimes--;
            }
            console.log("clickTimes:", this.clickGMTimes);
        }else{
            // this.clickGMTimes = 0;
        }

        if (this.clickGMTimes == 10){
            config.GM_SWITCH = true;
            this.clickGMTimes = 0;
            // GlobalVar.comMsg.showMsg("开启GM模式");
            GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GM_SWITCH_CHANGE);
        }else if (this.clickGMTimes == -10){
            config.GM_SWITCH = false;
            this.clickGMTimes = 0;
            // GlobalVar.comMsg.showMsg("关闭GM模式");
            GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GM_SWITCH_CHANGE);
        }
    },

    createFeedbackBtn(btnNode) {
        if (cc.sys.platform != cc.sys.WECHAT_GAME) {
            return;
        }
        let self = this;
        let createBtn = function () {
            let btnSize = cc.size(btnNode.width, btnNode.height);
            let frameSize = cc.view.getFrameSize();
            // console.log("winSize: ",winSize);
            // console.log("frameSize: ",frameSize);
            let worldPos = btnNode.parent.convertToWorldSpaceAR(btnNode.position);
            let viewPos = self.node.parent.convertToNodeSpaceAR(worldPos);
            // console.log('viewPos: ', viewPos);
            let left = (cc.winSize.width * 0.5 + viewPos.x - btnSize.width * 0.5) / cc.winSize.width * frameSize.width;
            let top = (cc.winSize.height * 0.5 - viewPos.y - btnSize.height * 0.5) / cc.winSize.height * frameSize.height;
            let width = btnSize.width / cc.winSize.width * frameSize.width;
            let height = btnSize.height / cc.winSize.height * frameSize.height;
            // console.log("button pos: ", cc.v3(left, top));
            // console.log("button size: ", cc.size(width, height));


            self.feedbackButton = wx.createFeedbackButton({
                type: 'text',
                text: '',
                style: {
                    left: left,
                    top: top,
                    width: width,
                    height: height,
                    lineHeight: 0,
                    backgroundColor: '',
                    color: '#ffffff',
                    textAlign: 'center',
                    fontSize: 16,
                    borderRadius: 4
                }
            })
        }

        createBtn();
    },
});
