var HandlerBase = require("handlerbase")
var GlobalVar = require('globalvar')
var EventMsgID = require("eventmsgid")
var Config = require('config')

cc.Class({
    extends: HandlerBase,

    ctor: function() {
        
    },

    initHandler: function(handlerMgr) {
        this.handlerMgr = handlerMgr;
    },

    sendKeepAlive: function() {
    },

});
