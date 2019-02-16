var HandlerBase = require("handlerbase")
var GlobalVar = require('globalvar')
var GameServerProto = require("GameServerProto");

var self = null;
cc.Class({
    extends: HandlerBase,

    ctor: function() {
        self = this;
    },

    initHandler: function(handlerMgr) {
        this.handlerMgr = handlerMgr;

        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_FULI_GIFT_DATA_ACK, self._recvLimitStoreAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_FULI_GIFT_BUY_ACK, self._recvLimitStoreBuyAck, self);
    },

    _recvLimitStoreAck: function(msgId, msg) {
        if (typeof msg != "object") { 
            return; 
        }

        GlobalVar.me().limitStoreData.saveData(msgId,msg);
    },

    _recvLimitStoreBuyAck: function(msgId, msg) {
        if (typeof msg != "object") { 
            return; 
        }

        GlobalVar.me().limitStoreData.saveBuyData(msgId,msg);
    },

    sendReq: function(req,msg) {

        this.sendMsg(req, msg);
    }
});

