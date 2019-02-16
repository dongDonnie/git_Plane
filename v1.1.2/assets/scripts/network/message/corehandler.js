var HandlerBase = require("handlerbase")

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
