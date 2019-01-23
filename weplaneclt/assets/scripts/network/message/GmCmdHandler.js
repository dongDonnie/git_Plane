var HandlerBase = require("handlerbase")

cc.Class({
    extends: HandlerBase,

    ctor: function() {

    },

    initHandler: function(handlerMgr) {
        this.handlerMgr = handlerMgr;

    },

    _recvStoreAck: function(msgId, msg) {
        if (typeof msg != "object") { 
            return; 
        }

    },

    sendReq: function(Req,msg) {

        this.sendMsg(Req, msg);
    }
});