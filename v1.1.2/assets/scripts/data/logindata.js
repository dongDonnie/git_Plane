const GlobalVar = require('globalvar');
const EventMsgID = require("eventmsgid");

var self = null;
var LoginData = cc.Class({

    properties: {
        data: null,
    },

    ctor: function () {
        self = this;
        self.token = "";
        self.data = {};
        self.loginReqData = {};
        self.loginReqData.account = null;
        self.loginReqData.sdkTicket = null;
        self.loginReqData.serverID = null;
        self.loginReqData.serverName = null;
        self.loginReqData.avatar = null;
        self.loginReqData.cityFlag = null;
    },

    saveLoginReq: function (userID, ticket, serverID, avatar) {
        this.setLoginReqDataAccount(userID);
        this.setLoginReqDataSdkTicket(ticket);
        this.setLoginReqDataServerID(serverID);
        this.setLoginReqDataAvatar(avatar);
    },
    setLoginReqDataAccount: function (userID) {
        self.loginReqData.account = typeof userID !== 'undefined' ? userID : null;
    },
    getLoginReqDataAccount:function(){
        return this.loginReqData.account;
    },
    setLoginReqDataSdkTicket: function (ticket) {
        self.loginReqData.sdkTicket = typeof ticket !== 'undefined' ? ticket : null;
    },
    getLoginReqDataSdkTicket:function(){
        return this.loginReqData.sdkTicket;
    },
    setLoginReqDataServerID: function (serverID) {
        self.loginReqData.serverID = typeof serverID !== 'undefined' ? serverID : null;
    },
    getLoginReqDataServerID:function(){
        return this.loginReqData.serverID;
    },
    setLoginReqDataAvatar: function (avatar) {
        self.loginReqData.avatar = typeof avatar !== 'undefined' ? avatar : null;
    },
    getLoginReqDataAvatar:function(){
        return this.loginReqData.avatar;
    },
    setLoginReqDataServerName: function (serverName) {
        self.loginReqData.serverName = typeof serverName !== 'undefined' ? serverName : null;
    },
    getLoginReqDataServerName: function () {
        return this.loginReqData.serverName;
    },
    setLoginReqDataCityFlag: function (cityFlag) {
        self.loginReqData.cityFlag = cityFlag;
    },
    getLoginReqDataCityFlag: function () {
        return this.loginReqData.cityFlag;
    },

    saveData: function (data) {
        self.data = data;
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_LOGIN_DATA_NTF, data);
    },

    createRole: function (data) {
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_NEED_CREATE_ROLE, data);
    },

    enterGameMain: function (data) {
        // console.log("登陆消息", data);
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_ENTER_GAME, data);
    },
});

module.exports = LoginData;