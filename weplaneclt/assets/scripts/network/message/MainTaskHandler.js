
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

        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_MAINTASK_DATA_ACK, self._recvMainTaskDataAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_MAINTASK_GET_ACK, self._recvMainTaskGetAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_MAINTASK_REWARD_ACK, self._recvMainTaskRewardAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_MAINTASK_FLAG_NTF, self._recvMainTaskFlagNtf, self);
    },


    _recvMainTaskDataAck: function (msgId, msg) {
        if (typeof msg != "object"){
            return;
        }
        GlobalVar.me().mainTaskData.setMainTaskData(msg.data);
    },
    sendGetMainTaskDataReq: function () {
        let msg = {
            Reserved: 0,
        }
        self.sendMsg(GameServerProto.GMID_MAINTASK_DATA_REQ, msg);
    },

    _recvMainTaskGetAck: function (msgId, msg) {
        if (typeof msg != "object"){
            return;
        }
        GlobalVar.me().mainTaskData.setMainTaskGetData(msg.data);
    },
    sendGetMainTaskGetReq: function (taskType, taskID) {
        let msg = {
            TaskType: taskType,
            TaskID: taskID,
        };
        self.sendMsg(GameServerProto.GMID_MAINTASK_GET_REQ, msg);
    },

    _recvMainTaskRewardAck: function (msgId, msg) {
        if (typeof msg != "object"){
            return;
        }
        GlobalVar.me().mainTaskData.setMainTaskRewardData(msg.data);
    },
    sendGetMainTaskRewardReq: function () {
        let msg = {
            Reserved: 0,
        };
        self.sendMsg(GameServerProto.GMID_MAINTASK_REWARD_REQ, msg);
    },

    _recvMainTaskFlagNtf: function (msgId, msg) {
        if (typeof msg != "object"){
            return;
        }
        GlobalVar.me().mainTaskData.setMainTaskFlagNtf(msg.data);
    },
});
