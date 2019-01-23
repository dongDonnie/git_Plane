/**
 * AdHandler是抽屉广告/积分墙 /gif悬浮广告的相关信息的处理类
 */

var HandlerBase = require("handlerbase")
var GlobalVar = require('globalvar')
var GameServerProto = require("GameServerProto");

var self = null;
cc.Class({
    extends: HandlerBase,

    ctor: function () {
        self = this;
    },

    initHandler: function (handlerMgr) {
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_FULI_GC_TESTPLAY_REWARD_ACK, self._recvGetTestPlayRewardAck, self);
    },

    _recvGetTestPlayRewardAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().adData.setAdRewardAck(msg.data);
    },

    sendTestPlayRewardReq: function (id) {

        let msg = {
            ID: id,
        };

        self.sendMsg(GameServerProto.GMID_FULI_GC_TESTPLAY_REWARD_REQ, msg);
    },
});
