
const RootBase = require("RootBase");
const WindowManager = require("windowmgr");
const GlobalVar = require('globalvar')
const WndTypeDefine = require("wndtypedefine");
const GameServerProto = require("GameServerProto");
const CommonWnd = require("CommonWnd")
const EventMsgID = require("eventmsgid");

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
    },

    animeStartParam(paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            WindowManager.getInstance().popView();
        } else if (name == "Enter") {
            this._super("Enter");
            GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_SHOW_NOTICE_LIST, this.onRecvNoticeAck, this);
        }
    },

    enter: function (isRefresh) {
        if (isRefresh) {
            this.initSettingWindow()
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

    initSettingWindow: function () {
        this.labelUserAccount.string = GlobalVar.me().roleID;
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
    },

    onRecvNoticeAck: function () {
        let noticeCount = GlobalVar.me().noticeData.getNoticeCount();
        if (noticeCount> 0){
            CommonWnd.showNoticeWnd();
        }else{
            GlobalVar.comMsg.showMsg("暂无公告");
        }
    },
});
