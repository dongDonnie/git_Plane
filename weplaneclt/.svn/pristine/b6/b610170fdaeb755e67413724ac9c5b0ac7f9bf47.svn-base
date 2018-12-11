var HandlerBase = require("handlerbase")
var GlobalVar = require('globalvar')
var EventMsgID = require("eventmsgid")
var GameServerProto = require("GameServerProto");

var self = null;
cc.Class({
    extends: HandlerBase,

    ctor: function () {
        self = this;
    },

    initHandler: function (handlerMgr) {
        this.handlerMgr = handlerMgr;
        // handlerMgr.setKey(GameServerProto.GMID_GUAZAI_PUTON_ACK,GameServerProto.GMID_GUAZAI_PUTON_REQ);
        // handlerMgr.setKey(GameServerProto.GMID_GUAZAI_LEVELUP_ACK,GameServerProto.GMID_GUAZAI_LEVELUP_REQ);
        // handlerMgr.setKey(GameServerProto.GMID_GUAZAI_QUALITYUP_ACK,GameServerProto.GMID_GUAZAI_QUALITYUP_REQ);
        // handlerMgr.setKey(GameServerProto.GMID_GUAZAI_HECHENG_ACK,GameServerProto.GMID_GUAZAI_HECHENG_REQ);
        // handlerMgr.setKey(GameServerProto.GMID_GUAZAI_REBIRTH_ACK,GameServerProto.GMID_GUAZAI_REBIRTH_REQ);

        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_GUAZAI_PUTON_ACK, self._recvPutOnAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_GUAZAI_LEVELUP_ACK, self._recvLvUpAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_GUAZAI_QUALITYUP_ACK, self._recvQaUpAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_GUAZAI_HECHENG_ACK, self._recvCpsAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_GUAZAI_REBIRTH_ACK, self._recvRebirthAck, self);
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

    _recvCpsAck:function(msgId,msg){
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().guazaiData.saveCpsData(msg);
    },

    _recvRebirthAck:function(msgId,msg){
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().guazaiData.saveRebirthData(msg);
    }
});

