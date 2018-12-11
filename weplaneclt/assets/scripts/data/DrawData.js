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
    },

    showDrawItemInfo: function (data) {
        // console.log("sumoonData");
        // cc.log('showDrawItemInfo：', data);
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_DRAW_INFO, data);
    },

    setTreasureData: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            self.data.richTreasureData = data;
            self.goldMiningTimes = data.GoldMiningTimes;
            self.goldMiningRewards = data.GoldMiningRewards;
            self.oneFreeDrawCount = data.OneFreeCount;
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_RICHTREASURE_RESULT, data);
    },

    getOneFreeCount: function () {
        return self.oneFreeDrawCount;
    },

    showTrasureMiningResult: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            self.data.trasureMining = data;
            self.goldMiningTimes = data.MiningTimes || self.goldMiningTimes;
            self.oneFreeDrawCount = data.OneFreeCount;
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
