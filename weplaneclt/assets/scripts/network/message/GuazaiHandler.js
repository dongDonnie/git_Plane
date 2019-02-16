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

        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_GUAZAI_PUTON_ACK, self._recvPutOnAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_GUAZAI_LEVELUP_ACK, self._recvLvUpAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_GUAZAI_QUALITYUP_ACK, self._recvQaUpAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_GUAZAI_HECHENG_ACK, self._recvCpsAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_GUAZAI_SPLIT_ACK, self._recvSplitAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_GUAZAI_REBIRTH_ACK, self._recvRebirthAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_GUAZAI_COMPOSE_ACK, self._recvComposeAck, self);
    },

    _recvPutOnAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }

        GlobalVar.me().guazaiData.savePutOnData(msg);
    },

    sendReq: function (req, msg) {

        this.sendMsg(req, msg);
    },

    _recvLvUpAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().guazaiData.saveLvUpData(msg);
    },

    _recvQaUpAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().guazaiData.saveQaUpData(msg);
    },

    _recvCpsAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().guazaiData.saveCpsData(msg);
    },

    _recvSplitAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().guazaiData.saveSplitData(msg);
    },

    _recvRebirthAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().guazaiData.saveRebirthData(msg);
    },

    _recvComposeAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().guazaiData.saveComposeData(msg);
    },
});

