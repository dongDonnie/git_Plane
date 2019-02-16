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
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_REWARD_CENTER_NTF, self._recvRewardCenterNtf, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_REWARD_CENTER_GETREWARD_ACK, self._recvGetRewardAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_REWARD_CENTER_ALLREWARD_ACK, self._recvAllRewardAck, self);
    },

    sendRewardCenterReq: function () {
        let msg = {
            Reserved: 0,
        };
        self.sendMsg(GameServerProto.GMID_REWARD_CENTER_REQ, msg);
    },

    _recvRewardCenterNtf: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().rewardCenterData.setRewardCenterNtf(msg.data);
    },

    sendGetRewardReq: function (seq) {
        let msg = {
            Seq: seq
        }
        self.sendMsg(GameServerProto.GMID_REWARD_CENTER_GETREWARD_REQ, msg);
    },

    _recvGetRewardAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().rewardCenterData.setGetRewardAck(msg.data);
    },

    sendAllRewardReq: function () {
        let msg = {
            Reserved: 0
        }
        self.sendMsg(GameServerProto.GMID_REWARD_CENTER_ALLREWARD_REQ, msg);
    },

    _recvAllRewardAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().rewardCenterData.setAllRewardAck(msg.data);
    },
});
