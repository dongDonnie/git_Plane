var HandlerBase = require("handlerbase")
var GlobalVar = require('globalvar')
var EventMsgID = require("eventmsgid")
var GameServerProto = require("GameServerProto");
const me = require("me");

var self = null;
cc.Class({
    extends: HandlerBase,

    ctor: function () {
        self = this;
    },

    initHandler: function (handlerMgr) {
        this.handlerMgr = handlerMgr;
        // handlerMgr.setKey(GameServerProto.GMID_BIG_LOGIN_ACK, GameServerProto.GMID_BIG_LOGIN_REQ);
        // handlerMgr.setKey(GameServerProto.GMID_CREATE_ROLE_ACK, GameServerProto.GMID_CREATE_ROLE_REQ);
        // handlerMgr.setKey(GameServerProto.GMID_CREATE_ROLE_ACK, GameServerProto.GMID_CREATE_ROLE_REQ);

        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_BIG_LOGIN_ACK, self._recvLoginAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_CREATE_ROLE_NTF, self._needCreateRoleNTF, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_CREATE_ROLE_ACK, self._recvCreateRoleAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_ENTERGAME_NTF, self._enterGame, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_LOGOUT_ACK, self._recvLogOutAck, self);
    },

    _recvLoginAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }

        // console.log("Login data recieve!!!");

        GlobalVar.me().loginData.saveData(msg);
    },

    _recvCreateRoleAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }

        if (msg.data.ErrCode !== GameServerProto.PTERR_SUCCESS) {
            // console.log("创建角色的ACK错误码非零,值为" + msg.data.ErrCode);
        } else {
            // console.log("创建角色ACK错误码为零");
        }
    },

    _recvLogOutAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        console.log("登出消息：", msg);
    },

    _needCreateRoleNTF: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }

        // console.log("need create role NTF msg recieve!");
        GlobalVar.me().loginData.createRole(msg);
    },

    _enterGame: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        
        GlobalVar.me().loginData.enterGameMain(msg);
    },

    sendLoginReq: function (userID, ticket, serverID, avatar) {
        // {
        //     username: String  用户名
        //     loginuid: String  测试登录方式uid
        //     avatarUrl: String 头像地址
        //     city: String      来自地
        //     token: String     我们自己的登录Token
        //     code: String      微信的登录凭证
        // }
        // 约定不修改服务器存储的用户头像
        avatar && (avatar = avatar.trim());
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            
            let plat = "android";
            if (cc.sys.os == cc.sys.OS_IOS){
                plat = "ios";
            }else if (cc.sys.os == cc.sys.OS_ANDROID){
                plat = "android";
            }
            let msg = {
                ProgVer: 100,
                ResVer: GlobalVar.tblApi.getData('TblVersion')[1].strVersion,
                Account: userID,
                Password: "123",
                DeviceID: "33223",
                LoginType: GameServerProto.PT_LOGINTYPE_SDK,
                SDKData: {
                    SdkTicket: ticket,
                    BoundleID: "",
                    AdID: "",
                    ServerID: serverID,
                    Avatar: avatar,
                    Plat: plat,
                },
            };
            // console.log("发送的登陆申请消息为: ", msg);
            this.sendMsg(GameServerProto.GMID_BIG_LOGIN_REQ, msg);
        } else {
            let msg = {
                ProgVer: 100,
                ResVer: GlobalVar.tblApi.getData('TblVersion')[1].strVersion,
                Account: userID,
                Password: "123",
                DeviceID: "33223",
                LoginType: GameServerProto.PT_LOGINTYPE_NORMAL,
                UUZUData: {},
            };
            this.sendMsg(GameServerProto.GMID_BIG_LOGIN_REQ, msg);
        }

        GlobalVar.me().loginData.saveLoginReq(userID, ticket, serverID, avatar);
    },

    sendCreateRollReq: function (RoleName, avatar) {

        // 约定不修改服务器存储的用户头像
        avatar && (avatar = avatar.trim());
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            let msg = {
                Icon: 40000,
                Avatar: avatar || "",
                MemberID: 40000,
                RoleName: RoleName || "",
            }
            // console.log("发送的创建角色申请消息为: ", msg);
            this.sendMsg(GameServerProto.GMID_CREATE_ROLE_REQ, msg);
        }else{
            let msg = {
                Icon: 40000,
                Avatar: "4",
                MemberID: 40000,
                RoleName: RoleName,
            };
            this.sendMsg(GameServerProto.GMID_CREATE_ROLE_REQ, msg);
        }

    },

    sendLogOutReq: function () {
        let msg = {
            Reserved: 0,
        };

        this.sendMsg(GameServerProto.GMID_LOGOUT_REQ, msg);
    },
});