
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
        // handlerMgr.setKey(GameServerProto.GMID_NOTICE_ACK,GameServerProto.GMID_NOTICE_REQ);
        // handlerMgr.setKey(GameServerProto.GMID_FULI_CZ_DATA_ACK,GameServerProto.GMID_FULI_CZ_DATA_REQ);
        // handlerMgr.setKey(GameServerProto.GMID_FULI_CZ_BUY_ACK,GameServerProto.GMID_FULI_CZ_BUY_REQ);

        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_FULI_CZ_DATA_ACK, self._recvFuliFeedbackData, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_FULI_CZ_BUY_ACK, self._recvFuliBuyAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_FULI_CZ_ACK, self._recvFuliCZSCAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_FULI_CZ_NTF, self._recvFuliCZNtf, self);
    },

    _recvFuliFeedbackData: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }

        GlobalVar.me().feedbackData.setFuliFeedbackData(msg.data);
    },

    sendGetFeedbackDataReq: function(reserved){
        reserved = reserved?reserved:1;
        let msg = {
            Reserved: reserved,
        }
        self.sendMsg(GameServerProto.GMID_FULI_CZ_DATA_REQ, msg);
    },

    _recvFuliBuyAck: function(msgId, msg){
        if (typeof msg != "object") {
            return;
        }

        GlobalVar.me().feedbackData.saveFuliBuyData(msg.data);
    },

    sendBuyFuliFeedbackReq: function(feedbackID, free, adCount){
        let msg = {
            ID: feedbackID,
            Free: free||0,
            AdCount: adCount||0,
        };

        self.sendMsg(GameServerProto.GMID_FULI_CZ_BUY_REQ, msg);
    },

    _recvFuliCZSCAck: function(msgId, msg){
        if (typeof msg != "object") {
            return;
        }

        GlobalVar.me().feedbackData.saveFuliSCData(msg.data);
    },

    sendGetFuliSCReq: function(isFree, ticket){
        let msg = {
            Free: isFree||0,
            Ticket: ticket||"",
        };

        self.sendMsg(GameServerProto.GMID_FULI_CZ_REQ, msg);
    },

    _recvFuliCZNtf: function(msgId, msg){
        if (typeof msg != "object") {
            return;
        }

        GlobalVar.me().feedbackData.setFuliFlag(msg.data);
    },
});
