
const RootBase = require("RootBase");
const WindowManager = require("windowmgr");
const GlobalVar = require('globalvar')
const WndTypeDefine = require("wndtypedefine");
const EventMsgID = require("eventmsgid");
const GameServerProto = require("GameServerProto");
const weChatAPI = require("weChatAPI");

cc.Class({
    extends: RootBase,

    properties: {
        mailScroll: {
            default: null,
            type: cc.ScrollView,
        },
        mailPrefab: {
            default: null,
            type: cc.Prefab,
        },
        notReadCount: {
            default: 0,
            visible: false,
        },
        mailList: [],
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMALMAIL_VIEW;

        this.content = this.mailScroll.content;
        this.animeStartParam(0, 0);
        this.canClose = false;
    },


    animeStartParam: function(paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;
        if (paramOpacity == 255){
            this.mailScroll.loopScroll.releaseViewItems();
        }
    },

    animePlayCallBack: function(name) {
        if (name == "Escape") {
            this._super("Escape");
            GlobalVar.eventManager().removeListenerWithTarget(this);
            WindowManager.getInstance().popView();
        } else if (name == "Enter") {
            this._super("Enter");
            this.registerEvent();
        }
    },

    registerEvent: function(){
            GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_REFRESH_MAIL_WND, this.initMailView, this);

            
            GlobalVar.handlerManager().mailHandler.sendGetMailListReq(GameServerProto.PT_MAIL_TYPE_SYS);
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
    
    initMailView: function(){
        let self = this;
        this.canClose = false;
        this.mailScroll.loopScroll.releaseViewItems();
        let mailData = GlobalVar.me().mailData.getMailData();
        let showMailList = this.sortMailData(mailData);
        this.mailScroll.loopScroll.setTotalNum(showMailList.length);
        this.mailScroll.loopScroll.setCreateModel(this.mailPrefab);
        this.mailScroll.loopScroll.registerUpdateItemFunc(function(mail, index){
            mail.getComponent("MailObject").updateMail(showMailList[index]);
        });
        this.mailScroll.loopScroll.registerCompleteFunc(function(){
            self.canClose = true;
        })
        this.mailScroll.loopScroll.resetView();

        if (showMailList.length == 0) {
            this.canClose = true;
        }
    },

    sortMailData: function (mailData) {
        let arr = [];
        function compare(property1, property2) {
            return function (a, b) {
                let value1 = a[property1];
                let value2 = b[property1];
                if (value1 != value2) {
                    return value1 - value2;
                } else {
                    // 在第一个属性相等的情况下比较第二个属性
                    let value3 = a[property2];
                    let value4 = b[property2];
                    return value4 - value3;
                }
            }
        }

        for (let key in mailData) {
            arr.push(mailData[key]);
        }

        arr.sort(compare("ReadStatus", "Time"));
        return arr;
    },

    onBtnRecvAllMail: function() {
        // console.log(this.mailList);
        for (let i in this.mailList) {
            let mail = this.mailList[i];
            let mailObj = mail.getComponent("MailObject");
            if (mailObj.getMailReadStatus() != GameServerProto.PT_MAIL_HAVE_READ) {
                GlobalVar.handlerManager().mailHandler.sendReadMailReq(mailObj.getMailID());
            }
        }
    },

    close: function () {
        if(!!this.canClose){
            this._super();
        }
    },
});
