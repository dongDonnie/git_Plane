
var HandlerBase = require("handlerbase");
var GlobalVar = require('globalvar');
const GameServerProto = require("GameServerProto");

var self = null;
cc.Class({
    extends: HandlerBase,

    ctor: function () {
        self = this;
    },

    initHandler: function (handlerMgr) {
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_FULI_GC_OFFICIALACCOUNT_DRAINAGE_ACK, self._recvOfficeAccountAck, self);
    },

    _recvOfficeAccountAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().followRewardData.setFollowRewardData(msg.data);
    },

    sendOfficeAccountReq: function() {
        let msg = {
            Reserved: 0,
        };
        self.sendMsg(GameServerProto.GMID_FULI_GC_OFFICIALACCOUNT_DRAINAGE_REQ, msg);
    },
});
