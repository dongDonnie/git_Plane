
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

        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_GET_FREE_DIAMOND_ACK, self._recvGetFreeDiamondAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_GET_FREE_GOLD_ACK, self._recvGetFreeGoldAck, self);
    },

    _recvGetFreeDiamondAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }

        GlobalVar.me().shareData.setFreeDiamondCount(msg.data);
    },
    _recvGetFreeGoldAck: function (msgId, msg) {
        if (typeof msg != "object"){
            return;
        }

        GlobalVar.me().shareData.setFreeGoldCount(msg.data);
    },

    sendGetFreeDiamondReq: function (reserved) {
        reserved = reserved ? reserved : 1;
        let msg = {
            Reserved: reserved,
        };
        self.sendMsg(GameServerProto.GMID_GET_FREE_DIAMOND_REQ, msg);
    },

    sendGetFreeGoldReq: function (reserved) {
        reserved = reserved ? reserved : 1;
        let msg = {
            Reserved: reserved,
        };
        self.sendMsg(GameServerProto.GMID_GET_FREE_GOLD_REQ, msg);
    },



});
