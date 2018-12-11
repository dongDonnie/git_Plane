var HandlerBase = require("handlerbase")
var GlobalVar = require('globalvar')
var EventMsgID = require("eventmsgid")
var GameServerProto = require("GameServerProto");

var self = null;
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