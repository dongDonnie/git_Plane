/**
 * drawData类用于将接收到的抽卡消息转换为数据
 */

const GlobalVar = require('globalvar');
const EventMsgID = require("eventmsgid");
const GameServerProto = require("GameServerProto");

var self = null;
var DrawData = cc.Class({

    properties: {
        data: null,
    },

    ctor: function () {
        self = this;
        self.token = "";
        self.data = {};
        self.oneFreeDrawCount = 0;
        self.goldMiningTimes = 0;
        self.goldMiningRewards = [];
        self.nextFreeTime = 0;
        self.reduceCount = 0;
    },

    setTreasureData: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            self.data.richTreasureData = data;
            self.goldMiningTimes = data.GoldMiningTimes;
            self.goldMiningRewards = data.GoldMiningRewards;
            self.oneFreeDrawCount = data.OneFreeCount;
            self.nextFreeTime = data.NextFreeTime;
            self.reduceCount = data.ReduceCount;
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_RICHTREASURE_RESULT, data);
    },

    getOneFreeCount: function () {
        return self.oneFreeDrawCount;
    },

    getFreeReduceCount: function () {
        return self.reduceCount;
    },

    getNextFreeTime: function () {
        return self.nextFreeTime;
    },

    setTreasureTimeReduceData: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            self.nextFreeTime = data.NextFreeTime;
            self.reduceCount = data.ReduceCount;
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_TREASURE_REDUCE_TIME_RESULT, data);
    },

    showTrasureMiningResult: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            self.data.trasureMining = data;
            self.goldMiningTimes = data.MiningTimes || self.goldMiningTimes;
            self.oneFreeDrawCount = data.OneFreeCount;
            self.nextFreeTime = data.NextFreeTime;
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_TREASURE_MINING_RESULT, data);
    },

    showMiningRewardResult: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            self.goldMiningRewards = data.GoldMiningRewards;
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_TREASURE_MINING_REWARD_RESULT, data);
    },

    getGoldMiningRewards: function () {
        return self.goldMiningRewards;
    },

    getGoldMiningTimes: function () {
        return self.goldMiningTimes;
    },

});

module.exports = DrawData;
