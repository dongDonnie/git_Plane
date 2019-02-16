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

        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_MEMBER_EQUIP_PUTON_ACK, self.recvMemberEquipPutonAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_MEMBER_EQUIP_LEVELUP_ACK, self.recvMemberEquipLevelupAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_MEMBER_EQUIP_QUALITYUP_ACK, self.recvMemberEquipQualityupAck, self);

        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_MEMBER_SPECIAL_LEVELUP_ACK, self.recvMasteryLevelUpAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_MEMBER_SPECIAL_QUALITYUP_ACK, self.recvMasteryQualityUpAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_MEMBER_REBIRTH_ACK, self.recvRebirthAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_ITEM_YUANSHI_COMPOSE_ACK, self.recvYuanShiComposeAck, self);
    },

    sendMemberEquipQualityUpReq: function (memberID, pos, slots) {
        let msg = {
            MemberID: memberID,
            DstPos: pos,
            SrcPos: slots,
        }
        this.sendMsg(GameServerProto.GMID_MEMBER_EQUIP_QUALITYUP_REQ, msg);
    },

    recvMemberEquipQualityupAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().memberData.saveMemberEquipQualityUp(msg.data);
    },

    sendMemberEquipLevelupReq: function (memberID, pos, num) {
        let msg = {
            MemberID: memberID,
            EquipPos: pos,
            Num: num,
        }
        this.sendMsg(GameServerProto.GMID_MEMBER_EQUIP_LEVELUP_REQ, msg);
    },

    recvMemberEquipLevelupAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().memberData.saveMemberEquipLevelUp(msg.data);
    },

    sendMemberEquipPutonReq: function (slot, memberID, pos) {
        let msg = {
            BagSlot: slot,
            MemberID: memberID,
            EquipPos: pos,
        }
        this.sendMsg(GameServerProto.GMID_MEMBER_EQUIP_PUTON_REQ, msg);
    },

    sendYuanShiComposeReq: function (YuanShiID){
        let msg = {
            YuanShiID: YuanShiID
        };
        this.sendMsg(GameServerProto.GMID_ITEM_YUANSHI_COMPOSE_REQ, msg);
    },

    recvMemberEquipPutonAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().bagData.saveMemberEquipPuton(msg.data, GlobalVar.me().memberData.memberEquipSelectSlotInBag);
        GlobalVar.me().memberData.saveMemberEquipPuton(msg.data);
    },

    recvMemberPieceCrystalNtf: function (msgId, msg) {
        GlobalVar.me().memberData.saveMemberPieceCrystal(msgId, msg);
    },

    recvFreshAck: function (msgId, msg) {
        GlobalVar.me().memberData.saveRefreshData(msgId, msg);
    },

    recvBuyAck: function (msgId, msg) {
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
            Pos: pos,
            Num: num,
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
            Pos: pos,
        };
        this.sendMsg(GameServerProto.GMID_LEADEREQUIP_QUALITYUP_REQ, msg);
    },

    recvMemberPropNtf: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().propData.setPropDataNtf(msg);
    },

    sendPlayerPropReq: function (reserved) {
        reserved = reserved ? reserved : 1;
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

    sendMasteryLevelUpReq: function (msg) {
        self.sendMsg(GameServerProto.GMID_MEMBER_SPECIAL_LEVELUP_REQ, msg);
    },

    recvMasteryLevelUpAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().memberData.setMasteryLevelUpAck(msg.data);
    },

    sendMasteryQualityUpReq: function (msg) {
        self.sendMsg(GameServerProto.GMID_MEMBER_SPECIAL_QUALITYUP_REQ, msg);
    },

    recvMasteryQualityUpAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().memberData.setMasteryQualityUpAck(msg.data);
    },

    recvRebirthAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().memberData.setRebirthAck(msg.data);
    },

    recvYuanShiComposeAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().memberData.saveRoughComposeData(msg.data);
    },
});