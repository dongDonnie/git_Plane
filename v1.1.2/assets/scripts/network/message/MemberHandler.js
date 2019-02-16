var HandlerBase = require("handlerbase");
var GlobalVar = require('globalvar');
var GameServerProto = require("GameServerProto");

var self = null;
cc.Class({
    extends: HandlerBase,

    ctor: function () {
        self = this;
    },

    initHandler: function (handlerMgr) {
        this.handlerMgr = handlerMgr;


        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_MEMBER_ACTIVE_ACK, self.recvMemberActiveAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_SAVE_CHUZHAN_CONF_ACK, self.recvStandingByAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_MEMBER_LEVELUP_ACK, self.recvMemberLevelUpAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_MEMBER_QUALITYUP_ACK, self.recvMemberQualityUpAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_LEADEREQUIP_LEVELUP_ACK, self.recvLeaderEquipLevelUpAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_LEADEREQUIP_QUALITYUP_ACK, self.recvLeaderEquipQualityUpAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_PLAYER_PROP_NTF, self.recvMemberPropNtf, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_PLAYER_PROP_ACK, self.recvMemberPropNtf, self);

        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_MEMBER_PIECE_DATA_ACK, self.recvMemberPieceDataAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_MEMBER_PIECE_BREAK_ACK, self.recvMemberPieceBreakAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_MEMBER_PIECE_CRYSTAL_NTF, self.recvMemberPieceCrystalNtf, self);

        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_CHUZHAN_DATA_ACK, self.recvMixDriveDataAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_CHUZHAN_MIX_LEVEL_NTF, self.recvMixLevelNtf, self);
    },

    recvMemberPieceCrystalNtf: function (msgId, msg) {
        GlobalVar.me().memberData.saveMemberPieceCrystal(msgId, msg);
    },

    recvFreshAck: function (msgId, msg) {
        GlobalVar.me().memberData.saveRefreshData(msgId, msg);
    },

    recvBuyAck:  function (msgId, msg) {
        GlobalVar.me().memberData.saveBuyData(msgId, msg);
    },

    recvMemberPieceBreakAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().memberData.savePieceBreakData(msgId, msg);
    },

    recvMemberPieceDataAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().memberData.saveMemberPieceData(msg);
    },

    sendMemberPieceDataReq: function () {
        let msg = {
            Reserved: 0,
        }
        this.sendMsg(GameServerProto.GMID_MEMBER_PIECE_DATA_REQ, msg);
    },

    recvMemberActiveAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().memberData.saveActiveData(msg);
    },

    sendMemberActiveReq: function (memberID) {
        let msg = {
            MemberID: memberID,
        }
        this.sendMsg(GameServerProto.GMID_MEMBER_ACTIVE_REQ, msg);
    },

    recvStandingByAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().memberData.saveStandingByData(msg);
    },

    sendStandingByReq: function (memberID, mix1ID, mix2ID, mix3ID, mix4ID, mysteryID) {
        let msg = {
            ChuZhan: {
                ChuZhanMemberID: memberID,
                MixMember1ID: mix1ID,
                MixMember2ID: mix2ID,
                MixMember3ID: mix3ID,
                MixMember4ID: mix4ID,
                MysteryID: mysteryID,
            }
        }
        this.sendMsg(GameServerProto.GMID_SAVE_CHUZHAN_CONF_REQ, msg);
    },

    recvMemberLevelUpAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().memberData.saveLevelUpData(msg);
    },

    sendMemberLevelUpReq: function (memberID, itemID, count) {
        let msg = {
            MemberID: memberID,
            ItemID: itemID,
            Count: count,
        }
        this.sendMsg(GameServerProto.GMID_MEMBER_LEVELUP_REQ, msg);
    },

    recvMemberQualityUpAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().memberData.saveQualityUpData(msg);
    },

    sendMemberQualityUpReq: function (memberID) {
        let msg = {
            MemberID: memberID,
        }
        this.sendMsg(GameServerProto.GMID_MEMBER_QUALITYUP_REQ, msg);
    },

    recvLeaderEquipLevelUpAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().leaderData.saveLeaderEquipLevelUpData(msg);
    },
    sendLeaderEquipLevelUpReq: function (pos, num) {
        let msg = {
            Pos : pos,
            Num : num,
        };
        this.sendMsg(GameServerProto.GMID_LEADEREQUIP_LEVELUP_REQ, msg);
    },

    recvLeaderEquipQualityUpAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().leaderData.saveLeaderEquipQualityUpData(msg);
    },
    sendLeaderEquipQualityUpReq: function (pos) {
        let msg = {
            Pos : pos,
        };
        this.sendMsg(GameServerProto.GMID_LEADEREQUIP_QUALITYUP_REQ, msg);
    },

    recvMemberPropNtf: function(msgId, msg){
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().propData.setPropDataNtf(msg);
    },

    sendPlayerPropReq: function(reserved){
        reserved = reserved?reserved:1;
        let msg = {
            Reserved: reserved,
        };
        this.sendMsg(GameServerProto.GMID_PLAYER_PROP_REQ, msg);
    },

    sendPieceBreakReq: function (msgId, msg) {
        this.sendMsg(msgId, msg);
    },

    recvMemberStoreData: function (msgId, msg) {
        GlobalVar.me().memberData.saveMemberStoreData(msg);
    },

    recvMixDriveDataAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().memberData.setMixDriveData(msg.data);
    },

    sendGetMixDriveDataReq: function (reserved) {
        reserved = reserved ? reserved : 1;
        let msg = {
            Reserved: reserved,
        };
        self.sendMsg(GameServerProto.GMID_CHUZHAN_DATA_REQ, msg);
    },

    recvMixLevelNtf: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().memberData.setMixDriveLevelNtf(msg.data);
    },
});