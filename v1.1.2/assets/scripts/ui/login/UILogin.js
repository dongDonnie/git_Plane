const UIBase = require("uibase");
const GlobalVar = require("globalvar");
const EventMsgID = require("eventmsgid");

var UILogin = cc.Class({
    extends: UIBase,

    properties: {
        btnBegin: {
            default: null,
            type: cc.Button,
        },
        btnLogin: {
            default: null,
            type: cc.Button,
        },
        btnMain: {
            default: null,
            type: cc.Button,
        },
        editboxAccount: {
            default: null,
            type: cc.EditBox,
        },
    },

    onLoad: function () {
        console.log("UILOGIN  onLoad!!!!!!");
        GlobalVar.cleanAllMgr();
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_NEED_CREATE_ROLE, this.onBtnLoginClick, this);
        GlobalVar.networkManager().connectToServer('192.168.2.251', 9908, function () {
            let userID = GlobalVar.me().loginData.getLoginReqDataAccount();
            if (userID != null) {
                GlobalVar.handlerManager().loginHandler.sendLoginReq(userID);
            }
        });
    },

    start: function () {
        GlobalVar.resManager().setPreLoadHero();
    },

    onDestroy: function () {
        GlobalVar.eventManager().removeListenerWithTarget(this);
    },

    onSendBigLogin: function () {
        if (this.editboxAccount.string === "") {
            // console.log("名字不能为空");
            return;
        }
        let userID = this.editboxAccount.string;
        GlobalVar.handlerManager().loginHandler.sendLoginReq(userID);
    },

    onBtnLoginClick: function () {
        let roleName = this.editboxAccount.string;
        // cc.log("roleName: " + roleName);
        GlobalVar.handlerManager().loginHandler.sendCreateRollReq(roleName);
    },

    onBtnGotoMainClick: function () {
        GlobalVar.handlerManager().loginHandler.sendLoginReq("adminwq");
        //SceneManger.getInstance().gotoScene(SceneDefines.MAIN_STATE);
    },

})