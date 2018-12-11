
var HandlerBase = require("handlerbase");
var GlobalVar = require('globalvar');
var EventMsgID = require("eventmsgid");
const GameServerProto = require("GameServerProto");

var self = null;
cc.Class({
    extends: HandlerBase,

    ctor: function () {
        self = this;
    },

    initHandler: function (handlerMgr) {
        // handlerMgr.setKey(GameServerProto.GMID_SP_BUY_REQ,GameServerProto.GMID_SP_BUY_ACK);

        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_AMS_LIST_ACK, self._recvActiveListAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_AMS_DATA_ACK, self._recvActiveDataAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_AMS_JOIN_ACK, self._recvActiveJoinResultAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_AMS_FEN_ACK, self._recvActiveFenResultAck, self);

        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_AMS_NTF, self._recvActiveNtf, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_AMS_ACT_NTF, self._recvActiveActNtf, self);
    },

    _recvActiveNtf: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }

        GlobalVar.me().activeData.setActiveFlagNtf(msg.data);
    },

    _recvActiveActNtf: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().activeData.setActiveActFlagNtf(msg.data);
    },

    _recvActiveListAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().activeData.setActiveListData(msg.data);
    },

    sendGetActiveListReq: function (type, relatedActid) {
        let msg = {
            Type: type,
            RelatedActid: relatedActid,
        };
        self.sendMsg(GameServerProto.GMID_AMS_LIST_REQ, msg);
    },

    _recvActiveDataAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().activeData.setActiveData(msg.data);
    },

    sendGetActiveDataReq: function (actid) {
        let msg = {
            Actid: actid,
        };

        self.sendMsg(GameServerProto.GMID_AMS_DATA_REQ, msg);
    },

    _recvActiveJoinResultAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().activeData.setActiveJoinResultData(msg.data);
    },

    sendActiveJoinReq: function (actid) {
        let msg = {
            Actid: actid,
        }
        self.sendMsg(GameServerProto.GMID_AMS_JOIN_REQ, msg);
    },

    _recvActiveFenResultAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }

        GlobalVar.me().activeData.setActiveFenResultData(msg.data);
    },

    sendActiveFenReq: function (actid, id, num) {
        let msg = {
            Actid: actid,
            ID: id,
            Num: num,
        };

        self.sendMsg(GameServerProto.GMID_AMS_FEN_REQ, msg);
    },

});
