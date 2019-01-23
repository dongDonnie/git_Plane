/**
 * 处理无尽相关的信息和数据
 */

const GlobalVar = require('globalvar');
const EventMsgID = require("eventmsgid");
const GameServerProto = require("GameServerProto");
const StoreageData = require("storagedata");

var self = null;
var EndlessData = cc.Class({

    properties: {
        data: null,
    },

    ctor: function () {
        self = this;
        self.token = "";
        self.bagData = {};
        self.startBattleData = null;
        self.curMode = -1;
        self.getChestFlag = false;
        self.rankWorldData = null;
    },

    setRankWorldData: function (data) {
        self.rankWorldData = data;
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_RANK_WORLD_DATA, data);
    },

    saveEndlessBagData: function (data) {
        // console.log("EndlessBagData:", data);
        self.bagData = data.Bag;
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_ENDLESS_DATA, data);
    },

    setBlessMsg: function (data) {
        // console.log("BlessData:", data);
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS) {
            // self.startBattleData = data.OK;
            self.bagData.BlessStatusID = data.OK.StatusID;
            GlobalVar.me().setGold(data.OK.GoldCur);
            GlobalVar.me().setDiamond(data.OK.DiamondCur);
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_SHOW_BLESS, data);
    },

    getBlessStatusID: function () {
        return self.bagData.BlessStatusID || -1;
    },
    getEndlessRewardCount: function () {
        return self.bagData.PowerPoint;
    },
    getEndlesslastPowerTime: function () {
        return self.bagData.LastPowerTime;
    },
    getEndlessChargeRewardTimes:function () {
        return self.bagData.TodayChargeReward;
    },
    getBuyPowerPointCount:function () {
        return self.bagData.BuyPowerPointCount;
    },

    setStatusCount: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS) {
            for(let i = 0; i< self.bagData.Status.length; i++){
                if (self.bagData.Status[i].StatusID == data.OK.Status.StatusID){
                    self.bagData.Status[i].StatusCount = data.OK.Status.StatusCount;
                }
            }
            GlobalVar.me().setGold(data.OK.GoldCur);
            GlobalVar.me().setDiamond(data.OK.DiamondCur);
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_SETSTATUS_COUNT, data);
    },
    getStatusCountByID: function (statusID) {
        if (!self.bagData.Status){
            return -1;
        }
        for(let i = 0; i< self.bagData.Status.length; i++){
            if (self.bagData.Status[i].StatusID == statusID){
                return self.bagData.Status[i].StatusCount
            }
        }

        return 0;
    },

    setUseStatus:function(data){
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS) {
            
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_ENDLESS_USESTATUS_NTF, data);
    },

    saveStartBattleData: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS) {
            self.startBattleData = data.OK;
            GlobalVar.me().campData.dieCount = 0;
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_ENDLESS_START_BATTLE, data);
    },

    setEndBattleData: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS) {
            GlobalVar.me().bagData.updateItemDataByGMDT_ITEM_CHANGE(data.OK.ItemChange);
        }
        
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_ENDLESS_RESULT_NTF, data);
    },

    setQuitBattleData: function (data) {
        // if (data.ErrCode == GameServerProto.PTERR_SUCCESS) {
        //     GlobalVar.me().bagData.updateItemDataByGMDT_ITEM_CHANGE(data.OK.ItemChange);
        // }
        // GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_ENDLESS_RESULT_NTF, data);
        // console.log("endless mode quit");
    },

    setEndlessQHData: function (data){
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS) {
            GlobalVar.me().bagData.updateItemDataByGMDT_ITEM_CHANGE(data.ItemChange);

            if (self.bagData){
                self.bagData.QH = data.QH;
            }
        }

        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_ENDLESS_QH_UP_NTF);
    },

    setEndlessRankData: function (data){
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS) {
            self.bagData.RankID = data.OK.RankID;
            self.bagData.ScoreCount = data.OK.ScoreCount;      
        }

        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_ENDLESS_RANK_UP_NTF);
    },

    setEndlessChargeData: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS) {
            self.bagData.TodayChargeReward = data.TodayChargeReward;
        }
        
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_ENDLESS_GET_CHARGE_DATA, data);
    },

    saveBuyPowerPointData: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS) {
            GlobalVar.me().setDiamond(data.OK.DiamondCur);
            self.bagData.LastPowerTime = data.OK.LastPowerTime;
            self.bagData.BuyPowerPointCount = data.OK.BuyCount;
            self.bagData.PowerPoint = data.OK.PowerPoint;
        }

        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_ENDLESS_GET_BUY_POWERPOINT_DATA, data);
    },

    saveGetGoldData: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS) {
            self.bagData.TodayGold = data.TodayGold;   
            GlobalVar.me().setGold(data.Gold);
        }
    },

    saveEndlessPowerNtf: function (data) {
        self.bagData.PowerPoint = data.PowerPoint;
        self.bagData.LastPowerTime = data.LastPowerTime;
        // GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_ENDLESS_POWER_POINT_CHANGE_NTF, data);
    },

    setEndlessMode: function (modeIndex) {
        self.curMode = modeIndex;
        StoreageData.setEndlessMode(modeIndex);
    },
    getEndlessMode: function () {
        if (self.curMode = -1){
            self.curMode = StoreageData.getEndlessMode();
        }
        return self.curMode;
    },

    getEndlessQH: function () {
        if (self.bagData && self.bagData.QH){
            return self.bagData.QH;
        }
        return null;
    },

    getRankID: function () {
        if (self.bagData && self.bagData.RankID){
            return self.bagData.RankID;
        }
    },

    getSeed: function () {
        if (self.startBattleData) {
            return self.startBattleData.Seed;
        }
        return null;
    },
    getHistoryMaxScore:function(){
        if (self.bagData) {
            return self.bagData.HistoryMaxScore;
        }
    },
    getWeekMaxScore: function(){
        if (self.bagData) {
            return self.bagData.WeekMaxScore;
        }
    },
    getTodayGold: function () {
        if (self.bagData) {
            return self.bagData.TodayGold;
        }
    },
});

module.exports = EndlessData;