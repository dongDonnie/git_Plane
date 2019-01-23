
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
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_FULI_GC_HEZI_REWARD_ACK, self._recvBoxRewardAck, self);
    },

    _recvBoxRewardAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().boxRewardData.setJumpToBoxRewardData(msg.data);
    },

    sendBoxRewardReq: function(isDouble) {
        let msg = {
            DoubleGetFlag: isDouble,
        };
        self.sendMsg(GameServerProto.GMID_FULI_GC_HEZI_REWARD_REQ, msg);
    },
});
