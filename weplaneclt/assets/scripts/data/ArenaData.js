

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
        self.rankStoreData = null;
        self.rankReWardData = null;
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

        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_ARENA_CHALLENGE_COUNT_FREE_GET_DATA, data);
    },

    setArenaStoreData: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS && data.Type == GameServerProto.PT_STORE_ARENA){
            self.arenaStoreData = data.Items;
            self.arenaStoreRefreshTimes = data.RefreshTimes;
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_ARENA_STORE_DATA, data);
    },
    setRankStoreData: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            if (data.StoreID == GameServerProto.PT_STORE_ARENA_RANK_STOREID1){
                self.rankStoreData = data.Item;
            }else if (data.StoreID == GameServerProto.PT_STORE_ARENA_RANK_STOREID2){
                self.rankReWardData = data.Item;
            }
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_RANK_STORE_DATA, data);
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
});

module.exports = arenaData;