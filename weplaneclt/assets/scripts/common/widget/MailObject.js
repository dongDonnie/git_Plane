

const UIBase = require("uibase");
const WindowManager = require("windowmgr");
const WndTypeDefine = require("wndtypedefine");
const GlobalVar = require('globalvar');


var MailObject = cc.Class({
    extends: UIBase,

    properties: {
        nodeObject: {
            default: null,
            type: cc.Node,
        },
        spriteStateBg: {
            default: null,
            type: cc.Sprite,
        },
        spriteStateIcon: {
            default: null,
            type: cc.Sprite,
        },
        labelTitle: {
            default: null,
            type: cc.Label,
        },
        labelLeftTime: {
            default: null,
            type: cc.Label,
        },
        spriteRedPointTip: {
            default: null,
            type: cc.Sprite,
        },

    },

    onLoad() {

    },

    updateMail: function (data) {
        this.data = data;
        // this.mailID      = data.MailID;     //UINT64
        // this.type        = data.Type;       //UINT8
        // this.subject     = data.Subject;    //string
        // this.iconID      = data.IconID;     //UINT16
        // this.senderID    = data.SenderID;   //UINT64
        // this.content     = data.Content;    //string
        // this.time        = data.Time;       //UINT32
        // this.attachments = data.Attachments;//vector  mailAttachments = {ItemID,ItemCount}
        // this.readStatus  = data.ReadStatus; //UINT8

        this.setMailState();
        this.setMailTitle(this.data.Subject);
        this.setMailLeftTime(this.data.Time);
    },

    setMailState: function () {
        let state = this.data.ReadStatus;
        let MAIL_NOT_READ = 0, MAIL_READED = 1;
        if (state === MAIL_READED) {
            this.spriteStateBg.setFrame(MAIL_READED);
            this.spriteStateIcon.setFrame(MAIL_READED);
            this.spriteRedPointTip.node.active = false;
        } else {
            this.spriteStateBg.setFrame(MAIL_NOT_READ);
            this.spriteStateIcon.setFrame(MAIL_NOT_READ);
            this.spriteRedPointTip.node.active = true;
        }
    },

    setMailTitle: function (title) {
        this.labelTitle.string = title;
    },

    setMailLeftTime: function (leftTime) {
        // let curTime = Math.round(new Date().getTime() / 1000);
        let time = GlobalVar.me().serverTime - leftTime;
        var day = Math.floor(time / 86400);
        var hour = Math.floor(time % 86400 / 3600);
        var minute = Math.floor(time % 86400 % 3600 / 60);
        var second = Math.floor(time % 86400 % 3600 % 60);
        // this.labelLeftTime.string = leftTime;
        if (day !== 0) {
            this.labelLeftTime.string = day + "天前";
        } else if (hour !== 0) {
            this.labelLeftTime.string = hour + "小时前";
        }
        else if (minute !== 0) {
            this.labelLeftTime.string = minute + "分钟前";
        } else {
            this.labelLeftTime.string = second + "秒前";
        }
    },

    getMailID: function () {
        return this.data.MailID;
    },
    getMailType: function () {
        return this.data.Type;
    },
    getMailSubject: function () {
        return this.data.Subject;
    },
    getMailIconID: function () {
        return this.data.IconID;
    },
    getMailSenderID: function () {
        return this.data.SenderID;
    },
    getMailContent: function () {
        return this.data.Content;
    },
    getMailTime: function () {
        return this.data.Time;
    },
    getMailAttachments: function () {
        return this.data.Attachments;
    },
    getMailReadStatus: function () {
        return this.data.ReadStatus;
    },

    onMainClicked: function () {
        let self = this;
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_DETAILMAIL_VIEW, function (wnd, name, type) {
            wnd.getComponent(type).updateMailDetail(self.data);
        });
    },

});