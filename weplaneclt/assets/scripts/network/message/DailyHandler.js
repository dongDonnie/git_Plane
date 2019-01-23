
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

        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_DAILY_DATA_ACK, self._recvDailyDataAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_DAILY_ACTIVE_REWARD_ACK, self._recvDailyActiveRewardAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_DAILY_REWARD_ACK, self._recvDailyRewardAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_DAILY_NTF, self._recvDailyNtf, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_NEW_TASK_GET_REWARD_ACK, self._recvNewTaskRewardAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_NEW_TASK_NTF, self._recvNewTaskNtf, self);
    },

    _recvDailyDataAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }

        GlobalVar.me().dailyData.setData(msg.data);
    },
    sendGetDailyDataReq: function (reserved) {
        reserved = reserved ? reserved : 1;
        let msg = {
            Reserved: reserved,
        };
        self.sendMsg(GameServerProto.GMID_DAILY_DATA_REQ, msg);
    },

    _recvDailyActiveRewardAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }

        GlobalVar.me().dailyData.setActiveRewardData(msg.data);
    },
    sendDailyActiveRewardReq: function (active) {
        active = active ? active : 0;
        let msg = {
            Active: active,
        };
        self.sendMsg(GameServerProto.GMID_DAILY_ACTIVE_REWARD_REQ, msg);
    },

    _recvDailyRewardAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }

        GlobalVar.me().dailyData.setMisstionRewardData(msg.data);
    },
    sendDailyRewardReq: function (id) {
        id = id ? id : 0
        let msg = {
            ID: id,
        };
        self.sendMsg(GameServerProto.GMID_DAILY_REWARD_REQ, msg);
    },

    _recvDailyNtf: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().dailyData.setDailyFlagNtf(msg.data);
    },

    _recvNewTaskRewardAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().dailyData.setNewTaskRewardData(msg.data);
    },
    sendNewTaskRewardReq: function (newTaskID, flag) {
        newTaskID = newTaskID ? newTaskID : 0
        let msg = {
            NewTaskID: newTaskID,
            DoubleFlag: flag || 0,
        };
        self.sendMsg(GameServerProto.GMID_NEW_TASK_GET_REWARD_REQ, msg);
    },

    _recvNewTaskNtf: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().dailyData.setNewTaskData(msg.data.NewTaskBag);
    },

    sendDailyADReq: function () {
        let msg = {
            Reserved: 0,
        }
        self.sendMsg(GameServerProto.GMID_DAILY_AD_REQ, msg);
    },
});
