
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

        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_ACHIEVE_DATA_ACK, self._recvAchieveDataAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_ACHIEVE_REWARD_ACK, self._recvAchieveRewardAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_ACHIEVE_NTF, self._recvAchieveNtf, self);
    },

    _recvAchieveDataAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }

        GlobalVar.me().achieveData.setAchieveData(msg.data);
    },
    sendGetAchieveDataReq: function (reserved) {
        reserved = reserved ? reserved : 1;
        let msg = {
            Reserved: reserved,
        };
        self.sendMsg(GameServerProto.GMID_ACHIEVE_DATA_REQ, msg);
    },

    _recvAchieveRewardAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }

        GlobalVar.me().achieveData.setAchieveRewardData(msg.data);
    },

    sendAchieveRewardReq: function (sid) {
        let msg = {
            SID: sid,
        };
        self.sendMsg(GameServerProto.GMID_ACHIEVE_REWARD_REQ, msg);
    },

    _recvAchieveNtf: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }

        GlobalVar.me().achieveData.setAchieveNtf(msg.data);
    },
});
