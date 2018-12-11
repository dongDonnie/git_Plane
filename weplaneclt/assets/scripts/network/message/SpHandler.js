
var HandlerBase = require("handlerbase");
var GlobalVar = require('globalvar');
var EventMsgID = require("eventmsgid");
var GameServerProto = require("GameServerProto");

var self = null;
cc.Class({
    extends: HandlerBase,

    ctor: function () {
        self = this;
    },

    initHandler: function (handlerMgr) {
        // handlerMgr.setKey(GameServerProto.GMID_SP_BUY_REQ,GameServerProto.GMID_SP_BUY_ACK);
        
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_SP_BUY_ACK, self._recvSpBuyAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_SP_CHANGE_NTF, self._recvSpChangeNtf, self);
    },

    _recvSpChangeNtf: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        
        GlobalVar.me().spData.setSpChange(msg.data);
    },

    _recvSpBuyAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        
        GlobalVar.me().spData.setSpBuy(msg.data);
    },  
      
    sendSpBuyReq: function (free) {
        let msg = {
            Free : free||0,
        };
        self.sendMsg(GameServerProto.GMID_SP_BUY_REQ, msg);
    },
});
