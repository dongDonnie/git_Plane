
var HandlerBase = require("handlerbase");
var GlobalVar = require('globalvar');
const GameServerProto = require("GameServerProto");

var self = null;
cc.Class({
    extends: HandlerBase,

    ctor: function () {
        self = this;
    },

    initHandler: function (handlerMgr) {

        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_AMS_LIST_ACK, self._recvActiveListAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_AMS_DATA_ACK, self._recvActiveDataAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_AMS_JOIN_ACK, self._recvActiveJoinResultAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_AMS_FEN_ACK, self._recvActiveFenResultAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_AMS_NTF, self._recvActiveNtf, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_AMS_ACT_NTF, self._recvActiveActNtf, self);

        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_AMS_TYPE_ACTID_ACK, self._recvActiveTypeActIdAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_AMS_TREASURY_ACK, self._recvActiveTreasuryAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_AMS_VAST_ACK, self._recvActiveVastAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_AMS_RANK_ACK, self._recvActiveRankResultAck, self);
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


    _recvActiveTypeActIdAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().activeData.setActiveTypeActIdData(msg.data);
    },

    sendActiveTypeActIdReq: function () {
        let msg = {
            Reserved: 0
        };
        self.sendMsg(GameServerProto.GMID_AMS_TYPE_ACTID_REQ, msg);
    },

    _recvActiveTreasuryAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().activeData.setActiveTreasuryData(msg.data);
    },

    sendActiveTreasuryReq: function (actid, id) {
        let msg = {
            Actid: actid,
            ID: id,
        };
        self.sendMsg(GameServerProto.GMID_AMS_TREASURY_REQ, msg);
    },

    _recvActiveVastAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().activeData.setActiveVastData(msg.data);
    },

    sendActiveVastReq: function (actid, num) {
        let msg = {
            Actid: actid,
            Num: num,
        };
        self.sendMsg(GameServerProto.GMID_AMS_VAST_REQ, msg);
    },

    _recvActiveRankResultAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }

        GlobalVar.me().activeData.setActiveRankResultData(msg.data);
    },

    sendActiveRankReq: function (actid, type) {
        let msg = {
            Actid: actid,
            Type: type,
        };

        self.sendMsg(GameServerProto.GMID_AMS_RANK_REQ, msg);
    },

});
