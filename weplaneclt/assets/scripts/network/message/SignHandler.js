var HandlerBase = require("handlerbase")
var GlobalVar = require('globalvar')
var EventMsgID = require("eventmsgid")
var GameServerProto = require("GameServerProto");

var self = null;
cc.Class({
    extends: HandlerBase,

    ctor: function () {
        self = this;
        self.autoOpen = false;
    },

    initHandler: function (handlerMgr) {
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_SIGNIN_DATA_ACK, self._recvSignDataAck, self);  // 数据
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_SIGNIN_ACK, self._recvSignAck, self);  // 签到
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_SIGNIN_HEAP_ACK, self._recvSignHeapAck, self);  // 连续登陆奖励
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_SIGNIN_NTF, self._recvSignNtf, self);  // 红点
    },

    _recvSignDataAck: function (msgId, msg) {
        if (typeof msg != "object") {
            self.autoOpen = false;
            return;
        }
        // console.log('<<< get sign data ack', msg);
        GlobalVar.me().signData.setData(msg.data, self.autoOpen);
        self.autoOpen = false;
    },

    sendGetSignDataReq: function (reserved, autoOpen = false) {
        self.autoOpen = autoOpen;
        reserved = reserved ? reserved : 1;
        let msg = {
            Reserved: reserved,
        };
        self.sendMsg(GameServerProto.GMID_SIGNIN_DATA_REQ, msg);
    },

    _recvSignAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().signData.setSignResultData(msg.data);
    },

    sendSignReq: function (day = 0, doubleGetFlag = 0) {
        let msg = {
            Day: day,
            DoubleGetFlag: doubleGetFlag
        };
        self.sendMsg(GameServerProto.GMID_SIGNIN_REQ, msg);
    },

    _recvSignHeapAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().signData.setSignHeapResultData(msg.data);
    },

    sendSignHeapReq: function (day = 0) {
        let msg = {
            Day: day,
        };
        self.sendMsg(GameServerProto.GMID_SIGNIN_HEAP_REQ, msg);
    },

    _recvSignNtf: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().signData.setSignFlagNtf(msg.data);
    },
});
