var MonitorProtocal = require("monitorprotocal")

var NetRequest = cc.Class({
    statics: {
        TIMEOUT: 20000,
    },

    __ctor__: function(id, msg) {
        this._id = id;
        this._msg = msg;
        this._sent = false;                                //是否已经发送
        this._reponseId = MonitorProtocal[id] || 0;        //响应的msgId, 只有monitor的协议,这个字段才有意义
        this._responsed = false;                           //是否已经得到响应, 只有monitor的协议,这个字段才有意义
        this._sendTime = 0;
    },

    isSent: function() {
        return this._sent;
    },

    sendStandBy: function() {
		let msg = {};
		msg.id = this._id;
		msg.data = this._msg;
        return msg;
        // this._sendTime = Date.now();
        // this._sent = true;
    },

    sendComplete:function(){
        this._sendTime = Date.now();
        this._sent = true;
    },

    checkResponse: function(responseId) {
        if (this._responsed) {
            return false;
        }
        if (this._reponseId == responseId) {
            this._responsed = true;
        }
        return this._responsed;
    },

    getId: function() {
        return this._id;
    },

    getResponseMsgId: function() {
        return this._reponseId;
    },

    isWaiting: function() {
        if (this._reponseId == 0) {
            return false;
        }
        if (this._sent) {
            return !this._responsed;
        } else {
            return false;
        }
    },

    isTimeout: function(now) {
        if (this._reponseId == 0) {
            return false;
        }
        if (this._responsed) {
            return false;
        }

        if (NetRequest.TIMEOUT <= now - this._sendTime) {
            return true;
        }
        return false;
    }

});

module.exports = NetRequest;
