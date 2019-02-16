/**
 * 处理与公告相关的信息，讲其转换为数据
 */

const GlobalVar = require('globalvar');
const EventMsgID = require("eventmsgid");
var GameServerProto = require("GameServerProto");

var self = null;
var mainTaskData = cc.Class({

    properties: {
        data: null,
    },
    ctor: function() {
        self = this;
        self.token = "";
        self.data = {};
    },

    setMainTaskData: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            self.data = data;
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_MAINTASK_DATA, data);
    },
    getMainTaskProgress: function () {
        return self.data.Progress;
    },
    getMainTaskData: function () {
        return self.data.MainTask || null;
    },
    getMainTaskRewardIndex: function () {
        return self.data.Index || 1;
    },
    getTaskCurValueByType: function (taskType) {
        for (let i = 0; i < self.data.MainTask.length||0; i++){
            if (self.data.MainTask[i].Type == taskType){
                return self.data.MainTask[i].Var;
            }
        }
        return 0;
    },

    setMainTaskGetData: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            self.data.Index = data.Index;
            self.data.Progress = data.Progress;
            self.data.MainTask = data.MainTask;
            // data.Honor 暂时没用到
            GlobalVar.me().bagData.updateItemDataByGMDT_ITEM_CHANGE(data.ItemChange);
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_MAINTASK_GET_DATA, data);
    },

    setMainTaskRewardData: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            self.data.Index = data.Index;
            self.data.Progress = data.Progress;
            GlobalVar.me().bagData.updateItemDataByGMDT_ITEM_CHANGE(data.ItemChange);
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_MAINTASK_REWARD_DATA, data);
    },

    setMainTaskFlagNtf: function (data) {
        GlobalVar.me().statFlags.MainTaskFlag = data.StatFlag;
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_MAINTASK_FLAG_CHANGE);
    },
});

module.exports = mainTaskData;