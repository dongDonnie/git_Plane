
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

        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_FULI_GC_SUPER_INDUCE_ACK, self._recvSuperInduceAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_FULI_GC_SUPER_INDUCE_GET_ACK, self._recvSuperInduceGetAck, self);
    },

    _recvSuperInduceAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().bannerYdData.setRewardData(msg.data);
    },

    _recvSuperInduceGetAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().bannerYdData.setSuperInduceCount(msg.data);
    },

    sendSuperInduceReq: function() {
        let msg = {
            Reserved: 0,
        };
        self.sendMsg(GameServerProto.GMID_FULI_GC_SUPER_INDUCE_REQ, msg);
    },

    sendSuperInduceGetReq: function (doubleFlag) {
        let msg = {
            DoubleGetFlag: doubleFlag,
        };
        self.sendMsg(GameServerProto.GMID_FULI_GC_SUPER_INDUCE_GET_REQ, msg);
    },

});
