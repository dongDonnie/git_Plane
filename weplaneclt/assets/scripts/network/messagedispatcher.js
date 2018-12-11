var self = null;
var MessageDispatcher = cc.Class({
    ctor: function() {
        self = this;
        self._msgMap = {};
        self._connectFun = null;
        self._connectTarget = null;
    },

    bindMsg: function(msgId, fun, target) {
        if (typeof msgId != "number" || fun == null) { 
            console.error("[MessageDispatcher:bindMsg] param is invalid!");
            return;
        }

        self._msgMap[""+msgId] = {fun, target};
    },

    clearMsg: function() {
        self._msgMap = {};
        self._connectFun = null;
        self._connectTarget = null;
    },

    setConnectHandler: function(fun, target) {
        self._connectFun = fun;
        self._connectTarget = target;
    },

    onNetMessage: function(msgId, msg) {
        var idKey = "" + msgId;
        
        if (self._msgMap[idKey] != null) {
            var fun = self._msgMap[idKey].fun;
            var target = self._msgMap[idKey].target;

            if (fun != null && target != null) {
                fun.call(target, msgId, msg);
            } else if (fun != null) {
                fun(msgId, msg);
            }
        }
    },

    onConnectSuccess: function(connectIndex) {
        if (self._connectFun != null && self._connectTarget != null) {
            self._connectFun(self._connectTarget, 0, connectIndex);
        } else if (self._connectFun != null) {
            self._connectFun(0, connectIndex);
        }
    },

    onConnectFailed: function(connectIndex) {
        if (self._connectFun != null && self._connectTarget != null) {
            self._connectFun(self._connectTarget, 1, connectIndex);
        } else if (self._connectFun != null) {
            self._connectFun(1, connectIndex);
        }
    },

    onConnectBroken: function(connectIndex) {
        if (self._connectFun != null && self._connectTarget != null) {
            self._connectFun(self._connectTarget, 2, connectIndex);
        } else if (self._connectFun != null) {
            self._connectFun(2, connectIndex);
        }
    },

    onNetException: function(connectIndex) {
        if (self._connectFun != null && self._connectTarget != null) {
            self._connectFun(self._connectTarget, 3, connectIndex);
        } else if (self._connectFun != null) {
            self._connectFun(3, connectIndex);
        }
    }
});

module.exports = MessageDispatcher;