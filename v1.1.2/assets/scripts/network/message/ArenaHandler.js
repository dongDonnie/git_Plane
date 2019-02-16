
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
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_ARENA_OPEN_ACK, self._recvArenaOpenAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_ARENA_REPORT_ACK, self._recvArenaReportAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_ARENA_RANK_TOP_LIST_ACK, self._recvArenaRankTopListAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_ARENA_LIKE_ACK, self._recvArenaLikeAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_ARENA_CHALLENGE_ACK, self._recvArenaChallengeAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_ARENA_POINTS_CHANGE_NTF, self._recvArenaPointChangeNtf, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_ARENA_DAY_REWARD_ACK, self._recvArenaDayRewardAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_ARENA_SAODANG_ACK, self._recvArenaSaoDangAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_ARENA_CHALLENGE_COUNT_BUY_ACK, self._recvArenaChallengeCountBuyAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_ARENA_CHALLENGE_COUNT_FREE_GET_ACK, self._recvArenaChallengeCountFreeGetAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_RANK_STORE_DATA_ACK, self._recvRankStoreDataAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_RANK_STORE_BUY_ACK, self._recvRankStoreBuyAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_ARENA_POINTS_CHANGE_NTF, self._recvArenaPointChangeNtf, self);
        // GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_STORE_DATA_ACK, self._recvArenaStoreAck, self);
        // GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_STORE_BUY_ACK, self._recvArenaStoreBuyAck, self);
        // GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_STORE_REFRESH_ACK, self._recvArenaStoreRefreshAck, self);
    },

    _recvArenaOpenAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().arenaData.setArenaOpenData(msg.data);
        // GlobalVar.me().dailyData.setData(msg.data);
    },
    sendArenaOpenReq: function (reserved) {
        reserved = reserved ? reserved : 1;
        let msg = {
            Reserved: reserved,
        };
        self.sendMsg(GameServerProto.GMID_ARENA_OPEN_REQ, msg);
    },

    _recvArenaReportAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().arenaData.setArenaReportData(msg.data);
    },
    sendArenaReportReq: function (reserved) {
        reserved = reserved ? reserved : 1;
        let msg = {
            Reserved: reserved,
        };
        self.sendMsg(GameServerProto.GMID_ARENA_REPORT_REQ, msg);
    },

    _recvArenaRankTopListAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().arenaData.setArenaRankTopListData(msg.data);
    },
    sendArenaRankTopListReq: function (reserved) {
        reserved = reserved ? reserved : 1;
        let msg = {
            Reserved: reserved,
        };
        self.sendMsg(GameServerProto.GMID_ARENA_RANK_TOP_LIST_REQ, msg);
    },

    _recvArenaLikeAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().arenaData.setArenaLikeData(msg.data);
    },
    sendArenaLikeReq: function (targetRoleID) {
        let msg = {
            TargetRoleID: targetRoleID,
        };
        self.sendMsg(GameServerProto.GMID_ARENA_LIKE_REQ, msg);
    },

    _recvArenaChallengeAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().arenaData.setArenaChallengeData(msg.data);
    },
    sendArenaChallengeReq: function (beChallengeRoleID, beChallengedRanking, challengeType) {
        let msg = {
            BeChallengedRoleID: beChallengeRoleID,
            BeChallengedRanking: beChallengedRanking,
            ChallengeType: challengeType,
        };
        self.sendMsg(GameServerProto.GMID_ARENA_CHALLENGE_REQ, msg);
    },

    _recvArenaChallengeCountBuyAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().arenaData.setArenaChallengeCountBuyData(msg.data);
    },
    sendArenaChallengeCountBuyReq: function (ticketCount) {
        let msg = {
            Reserved: 0,
            TicketCount: ticketCount,
        };
        self.sendMsg(GameServerProto.GMID_ARENA_CHALLENGE_COUNT_BUY_REQ, msg);
    },

    _recvArenaPointChangeNtf: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().arenaData.setArenaPointChangeData(msg.data);
    },

    _recvArenaDayRewardAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().arenaData.setArenaDayRewardData(msg.data);
    },
    sendArenaDayRewardReq: function (day, ranking) {
        let msg = {
            Day: day,
            Ranking: ranking,
        };
        self.sendMsg(GameServerProto.GMID_ARENA_DAY_REWARD_REQ, msg);
    },

    _recvArenaSaoDangAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().arenaData.setArenaSaoDangData(msg.data);
    },
    sendArenaSaoDangReq: function (beChallengedRanking, challengeType) {
        let msg = {
            BeChallengedRanking: beChallengedRanking,
            ChallengeType: challengeType,
        };
        self.sendMsg(GameServerProto.GMID_ARENA_SAODANG_REQ, msg);
    },

    _recvArenaChallengeCountFreeGetAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().arenaData.setArenaChallengeCountFreeGetData(msg.data);
    },
    sendArenaChallengeCountFreeGetReq: function () {
        let msg = {
            Reserved: 0,
        };
        self.sendMsg(GameServerProto.GMID_ARENA_CHALLENGE_COUNT_FREE_GET_REQ, msg);
    },

    _recvArenaStoreAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().arenaData.setArenaStoreData(msg.data);
    },
    sendArenaStoreReq: function () {
        let msg = {
            Type: GameServerProto.PT_STORE_ARENA,
        };
        self.sendMsg(GameServerProto.GMID_STORE_DATA_REQ, msg);
    },
    _recvArenaStoreBuyAck: function (msgId, msg) {
        if (typeof msg != "object"){
            return;
        }
        GlobalVar.me().arenaData.setArenaStoreBuyData(msg.data);
    },
    sendArenaStoreBuyReq: function (id) {
        let msg = {
            ID: id,
            Type: GameServerProto.PT_STORE_ARENA,
            Expires: GlobalVar.me().arenaData.arenaExpires || 0,
        };
        self.sendMsg(GameServerProto.GMID_STORE_BUY_REQ, msg);
    },

    _recvRankStoreDataAck: function (msgId, msg) {
        if (typeof msg != "object"){
            return;
        }
        GlobalVar.me().arenaData.setRankStoreData(msg.data);
    },
    sendRankStoreDataReq: function (storeID) {
        let msg = {
            StoreID: storeID,
        };
        self.sendMsg(GameServerProto.GMID_RANK_STORE_DATA_REQ, msg);
    },

    _recvRankStoreBuyAck: function (msgId, msg) {
        if (typeof msg != "object"){
            return;
        }
        GlobalVar.me().arenaData.setRanStoreBuyData(msg.data);
    },
    sendRankStoreBuyReq: function (storeID, id, num) {
        let msg = {
            StoreID: storeID,
            ID: id,
            Num: num,
        };
        self.sendMsg(GameServerProto.GMID_RANK_STORE_BUY_REQ, msg);
    },

    _recvArenaStoreRefreshAck: function (msgId, msg) {
        if (typeof msg != 'object'){
            return;
        }
        GlobalVar.me().arenaData.setArenaStoreRefreshData(msg.data);
    },
    sendArenaStoreRefreshReq: function (storeType) {
        let msg = {
            Type: GameServerProto.PT_STORE_ARENA,
        };
        self.sendMsg(GameServerProto.GMID_STORE_REFRESH_REQ, msg);
    },

    _recvArenaPointChangeNtf: function (msgId, msg) {
        if (typeof msg != 'object') {
            return;
        }
        GlobalVar.me().arenaData.setArenaPointChangeData(msg.data);
    },
});
