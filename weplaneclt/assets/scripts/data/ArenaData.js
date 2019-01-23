

const GlobalVar = require('globalvar');
const EventMsgID = require("eventmsgid");
var GameServerProto = require("GameServerProto");

var self = null;
var arenaData = cc.Class({

    properties: {
        data: null,
    },
    ctor: function() {
        self = this;
        self.token = "";
        self.data = {};
        self.arenaOpenData = null;
        self.arenaReportData = null;
        self.arenaTopListData = null;
        self.arenaLikeData = null;
        self.arenaChallengeData = null;
        self.likeClicks = 0;
        self.likeClicksLimit = 0;
        self.arenaStoreData = null;
        self.arenaStoreRefreshTimes = null;
        self.arenaExpires = null;
        self.rankStoreData = null;
        self.rankRewardData = null;
    },
    setData: function(data){
        self.data = data;
    },
    setArenaOpenData: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            self.arenaOpenData = data.OK;
        }
        self.setData(data);
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_ARENA_OPEN_DATA, data);
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_ARENA_DAY_REWARD_DATA, data);
    },
    setArenaReportData: function(data){
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            self.arenaReportData = data.OK;
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_ARENA_REPORT_DATA, data);
    },

    setArenaRankTopListData: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            self.arenaTopListData = data.OK;
            self.likeClicks = data.OK.LikeClicks;
            self.likeClicksLimit = data.OK.LikeClicksLimit;
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_ARENA_RANK_TIP_LIST_DATA, data);
    },

    setArenaLikeData: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            GlobalVar.me().setGold(data.OK.GoldCur);
            self.arenaLikeData = data.OK;
            self.likeClicks = data.OK.LikeClicks;
            self.likeClicksLimit = data.OK.LikeClicksLimit;
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_ARENA_LIKE_DATA, data);
    },

    setArenaChallengeData: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            self.arenaOpenData.FreeChallengeCount = data.OK.FreeChallengeCount;
            self.arenaOpenData.ChallengeCount = data.OK.ChallengeCount;
            self.arenaOpenData.ChallengeLimit = data.OK.ChallengeLimit;
            self.arenaOpenData.Points = data.OK.Points;
            self.arenaOpenData.Ranking = data.OK.NewRanking;
            GlobalVar.me().setDiamond(data.OK.DiamondCur);
            self.arenaChallengeData = data.OK;
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_ARENA_CHALLENGE_DATA, data);
    },

    setArenaChallengeCountBuyData: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            GlobalVar.me().setDiamond(data.OK.DiamondCur);
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_ARENA_CHALLENGE_COUNT_BUY_DATA, data);
    },

    setArenaPointChangeData: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            self.arenaOpenData.Points = data.OK.PointsCur;
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_ARENA_POINT_CHANGE_DATA, data);
    },

    setArenaDayRewardData: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            self.arenaOpenData.DayRewardGetFlags[data.Day - 1] = 1;
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_ARENA_DAY_REWARD_DATA, data);
    },

    setArenaSaoDangData: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            self.arenaOpenData.Ranking = data.OK.NewRanking;
            self.arenaOpenData.Points = data.OK.Points;
            self.arenaOpenData.ChallengeCount = data.OK.ChallengeCount;
            self.arenaOpenData.ChallengeLimit = data.OK.ChallengeLimit;
            self.arenaOpenData.FreeChallengeCount = data.OK.FreeChallengeCount;
            GlobalVar.me().setDiamond(data.OK.DiamondCur);
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_ARENA_SAODANG_DATA, data);
    },
    setArenaChallengeCountFreeGetData: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS) {
            self.arenaOpenData.FreeGetCount = data.FreeGetCount;
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_ARENA_CHALLENGE_COUNT_FREE_GET_DATA, data);
    },

    setArenaStoreData: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS && data.Type == GameServerProto.PT_STORE_ARENA){
            self.arenaStoreData = data.Items;
            self.arenaStoreRefreshTimes = data.RefreshTimes;
            self.arenaExpires = data.Expires;
        }
        // if (data.Type == GameServerProto.PT_STORE_ARENA){
            GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_ARENA_STORE_DATA, data);
        // }
    },
    setArenaStoreBuyData: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS && data.Type == GameServerProto.PT_STORE_ARENA){
            self.arenaStoreData[data.ID].State = data.State;
        }
        // if (data.Type == GameServerProto.PT_STORE_ARENA){
            GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_ARENA_STORE_BUY_DATA, data);
        // }
    },
    setArenaStoreRefreshData: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS && data.Type == GameServerProto.PT_STORE_ARENA){
            self.arenaStoreData = data.Items;
            self.arenaStoreRefreshTimes = data.RefreshTimes;
        }
        // if (data.Type == GameServerProto.PT_STORE_ARENA){
            GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_ARENA_STORE_REFRESH_DATA, data);
        // }
    },


    setRankStoreData: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            if (data.StoreID == GameServerProto.PT_STORE_ARENA_RANK_STOREID1){
                self.rankStoreData = data.Item;
            }else if (data.StoreID == GameServerProto.PT_STORE_ARENA_RANK_STOREID2){
                self.rankRewardData = data.Item;
            }
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_RANK_STORE_DATA, data);
    },
    setRanStoreBuyData: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            GlobalVar.me().setDiamond(data.Diamond);
            GlobalVar.me().setGold(data.Gold);
            GlobalVar.me().bagData.updateItemDataByGMDT_ITEM_CHANGE(data.ItemChange);

            let storeData = null;
            if (data.StoreID == GameServerProto.PT_STORE_ARENA_RANK_STOREID1){
                storeData = self.rankStoreData;
            }else if (data.StoreID == GameServerProto.PT_STORE_ARENA_RANK_STOREID2){
                storeData = self.rankRewardData;
            }

            let index = -1;
            for (let i = 0; i < storeData.length; i++){
                if (data.ID == storeData[i].ID){
                    index = i;
                    storeData[i].BuyTimes = data.BuyTimes;
                }
            }
            if (index == -1){
                storeData.push({ID: data.ID, BuyTimes: data.BuyTimes});
            }
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_RANK_STORE_BUY_DATA, data);
    },
    setArenaPointChangeData: function (data) {
        self.arenaOpenData.Points = data.PointsCur;
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_ARENA_POINT_CHANGE_DATA, data);
    },


    getArenaListData: function () {
        if (self.arenaOpenData){
            return self.arenaOpenData.ArenaList;
        }
    },
    getChallengeCount: function () {
        if (self.arenaOpenData){
            return self.arenaOpenData.ChallengeCount;
        }
    },
    getChallengeLimit: function () {
        if (self.arenaOpenData){
            return self.arenaOpenData.ChallengeLimit;
        }
    },
    getFreeChallengeCount: function () {
        if (self.arenaOpenData){
            return self.arenaOpenData.FreeChallengeCount;
        }
    },
    getPlayerPoints: function () {
        if (self.arenaOpenData){
            return self.arenaOpenData.Points;
        }
        return "";
    },
    getPlayerRanking: function () {
        if (self.arenaOpenData){
            return self.arenaOpenData.Ranking;
        }
        return "";
    },
    getDayRewardGetFlags: function () {
        if (self.arenaOpenData){
            return self.arenaOpenData.DayRewardGetFlags;
        }
    },
    getArenaRewardFlag: function () {
        if (self.arenaOpenData){
            let dayRewardGetFlags = self.arenaOpenData.DayRewardGetFlags;
            for (let i = 0; i< dayRewardGetFlags.length; i++){
                if (dayRewardGetFlags[i] == 0){
                    return true;
                }
            }
        }
        return false;
    },
    getRankingHistories: function () {
        if (self.arenaOpenData){
            return self.arenaOpenData.RankingHistories;
        }
    },

    getArenaReportData: function () {
        if (self.arenaReportData){
            return self.arenaReportData.ReportList;
        }
    },
    getArenaRankTopData: function () {
        if (self.arenaTopListData){
            return self.arenaTopListData.ArenaList;
        }
    },
    getArenaLikeClicks: function () {
        return self.likeClicks;
    },
    getArenaLikeClicksLimit: function () {
        return self.likeClicksLimit;
    },
    getArenaRankStoreData: function () {
        return self.rankStoreData;
    },
    getArenaFreeGetCount: function () {
        return self.arenaOpenData.FreeGetCount;
    },
    getArenaChallengeData: function () {
        return self.arenaChallengeData;
    },
});

module.exports = arenaData;