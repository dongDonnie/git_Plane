var HandlerBase = require("handlerbase")
var GlobalVar = require('globalvar')
var GameServerProto = require("GameServerProto");

var self = null;
cc.Class({
    extends: HandlerBase,

    ctor: function () {
        self = this;
    },

    initHandler: function (handlerMgr) {
        this.handlerMgr = handlerMgr;

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
        console.log("enterGame消息：", msg);
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
        if (GlobalVar.isWechatPlat || GlobalVar.isQQPlayPlat) {
            console.log("进入sendLoginReq方法");
            let plat = "android";
            if (cc.sys.os == cc.sys.OS_IOS){
                plat = "ios";
            }else if (cc.sys.os == cc.sys.OS_ANDROID){
                plat = "android";
            }
            let msg = {
                ProgVer: GameServerProto.PT_SERVER_VERSION,
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
            console.log("发送的登陆申请消息为: ", msg);
            this.sendMsg(GameServerProto.GMID_BIG_LOGIN_REQ, msg);
            console.log("发送完毕: ", msg);
        } else {
            let msg = {
                ProgVer: GameServerProto.PT_SERVER_VERSION,
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

    sendLoginReqByWanba: function (serverID, avatar) {
        if (GlobalVar.isWanbaPlat){
            let plat = "android";
            if (cc.sys.os == cc.sys.OS_IOS){
                plat = "ios";
            }else if (cc.sys.os == cc.sys.OS_ANDROID){
                plat = "android";
            }
            let msg = {
                ProgVer: GameServerProto.PT_SERVER_VERSION,
                ResVer: GlobalVar.tblApi.getData('TblVersion')[1].strVersion,
                Account: urlParams["cmgePlayerId"],
                Password: "123",
                DeviceID: "33223",
                LoginType: GameServerProto.PT_LOGINTYPE_H5SDK,
                H5SDKData: {
                    game_id: urlParams["gameUID"],
                    op_id: urlParams["opid"],
                    user_id: urlParams["cmgePlayerId"],
                    login_ip: urlParams["loginIP"],
                    login_time: urlParams["loginTime"],
                    sign: urlParams["sign"],
                    ServerID: serverID,
                    Avatar: avatar,
                    Plat: plat,
                },
            };
            console.log("发送的登陆申请消息为: ", msg);
            this.sendMsg(GameServerProto.GMID_BIG_LOGIN_REQ, msg);
            console.log("发送完毕: ", msg);
        }
    },

    sendCreateRollReq: function (RoleName, avatar) {

        // 约定不修改服务器存储的用户头像
        avatar && (avatar = avatar.trim());
        if (GlobalVar.isWechatPlat || GlobalVar.isQQPlayPlat || GlobalVar.isWanbaPlat) {
            let fromOpenID = "";
            if (GlobalVar.isWechatPlat) {
                let launchInfo = wx.getLaunchOptionsSync();
                fromOpenID = launchInfo.query.from_openid || "";
            }
            let msg = {
                Icon: 40000,
                Avatar: avatar || "",
                MemberID: 40000,
                RoleName: RoleName || "",
                FromOpenid: fromOpenID,
            }
            console.log("发送的创建角色申请消息为: ", msg);
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

    // 通过sdk的方式登陆，不同平台获取玩家数据方式不同
    loginWithSdk: function (successCallback) {
        if (GlobalVar.isWanbaPlat){
            this.loginByWanBa(successCallback);
        }else if (GlobalVar.isWechatPlat) {
            // this.loginByWechat(successCallback);
        }else if (GlobalVar.isQQPlayPlat) {
            // this.loginByQQPlay(successCallback);
        }
    },

    // 玩吧的登陆方式
    loginByWanBa: function (successCallback) {
        cmgeH5GameSDK.WanBaGetInfo(function (data) {
            if (data.errorCode == 0){
                successCallback({
                    user_id: urlParams["cmgePlayerId"],
                    avatar: data.info.figureurl,
                    cityFlag: 0,
                    // cityFlag: data.info.city,
                })
            }else{
                console.log("loginByWanBa获取用户数据错误，errMsg:", data.errorMessage)
            }
        })
    },

    // 微信的登陆方式
    // loginByWechat: function () {

    // },

    // 玩一玩的登录方式
    // loginByQQPlay: function () {
        
    // },

    // 通过sdk的方式创建角色, 不同平台获取玩家数据方式不一样
    createRoleWithSdk: function (successCallback) {
        if (GlobalVar.isWanbaPlat){
            this.createRoleByWanBa(successCallback)
        }else if (GlobalVar.isWechatPlat){

        }
    },

    // 玩吧的创角方式
    createRoleByWanBa: function (successCallback) {
        cmgeH5GameSDK.WanBaGetInfo(function (data) {
            if (data.errorCode == 0){
                successCallback(
                    data.info.nickname,
                    data.info.figureurl,
                );
            }else{
                console.log("createRoleByWanBa获取用户数据错误，errMsg:", data.errorMessage)
            }
        })
    },
});