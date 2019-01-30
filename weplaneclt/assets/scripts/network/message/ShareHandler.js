
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

        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_GET_FREE_DIAMOND_ACK, self._recvGetFreeDiamondAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_GET_FREE_GOLD_ACK, self._recvGetFreeGoldAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_FULI_SHARE_RECOMMAND_ACK, self._recvRecommandAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_FULI_SHARE_MEMBER_TESTPLAY_ACK, self._recvMemberTestPlayAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_FULI_SHARE_DAILY_ACK, self._recvShareDailyAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_FULI_SHARE_SUPERFULI_ACK, self._recvSuperRewardAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_FULI_SHARE_INVITE_GIFTBAG_ACK, self._recvInviteGiftBagAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_FULI_SHARE_GUAZAI_JINHUA_ACK, self._recvGuazaiJinHuaAck, self);
    },

    _recvGetFreeDiamondAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }

        GlobalVar.me().shareData.setFreeDiamondCount(msg.data);
    },
    _recvGetFreeGoldAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }

        GlobalVar.me().shareData.setFreeGoldCount(msg.data);
    },

    sendGetFreeDiamondReq: function (reserved) {
        reserved = reserved ? reserved : 1;
        let msg = {
            Reserved: reserved,
        };
        self.sendMsg(GameServerProto.GMID_GET_FREE_DIAMOND_REQ, msg);
    },

    sendGetFreeGoldReq: function (reserved) {
        reserved = reserved ? reserved : 1;
        let msg = {
            Reserved: reserved,
        };
        self.sendMsg(GameServerProto.GMID_GET_FREE_GOLD_REQ, msg);
    },


    _recvRecommandAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }

        GlobalVar.me().shareData.setRecommandData(msg.data);
    },
    sendRecomandReq: function (reserved) {
        reserved = reserved ? reserved : 1;
        let msg = {
            Reserved: reserved,
        };
        self.sendMsg(GameServerProto.GMID_FULI_SHARE_RECOMMAND_REQ, msg);
    },

    _recvMemberTestPlayAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }

        GlobalVar.me().shareData.setMemberTestPlayData(msg.data);
    },
    sendMemberTestPlayReq: function (memberID) {
        if (!memberID) {
            console.log("memberID error");
        }
        let msg = {
            MemberID: memberID,
        };
        self.sendMsg(GameServerProto.GMID_FULI_SHARE_MEMBER_TESTPLAY_REQ, msg);
    },

    _recvShareDailyAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }

        GlobalVar.me().shareData.setShareDailyData(msg.data);
    },
    sendShareDailyReq: function (reserved) {
        reserved = reserved ? reserved : 1;
        let msg = {
            Reserved: reserved,
        };
        self.sendMsg(GameServerProto.GMID_FULI_SHARE_DAILY_REQ, msg);
    },

    _recvSuperRewardAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }

        GlobalVar.me().shareData.setSuperRewardData(msg.data);
    },

    sendSuperRewardReq: function (reserved) {
        let msg = {
            Reserved: reserved || 0,
        };
        self.sendMsg(GameServerProto.GMID_FULI_SHARE_SUPERFULI_REQ, msg);
    },

    _recvInviteGiftBagAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }

        GlobalVar.me().shareData.setInviteGiftBagData(msg.data);
    },

    _recvGuazaiJinHuaAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }

        GlobalVar.me().shareData.setGuazaiJinHuaData(msg.data);
    },

    sendInviteGiftBagReq: function (ticket) {
        let msg = {
            Ticket: ticket,
        };
        self.sendMsg(GameServerProto.GMID_FULI_SHARE_INVITE_GIFTBAG_REQ, msg);
    },

    sendGetFreeJinHuaReq: function (reserved) {
        reserved = reserved ? reserved : 1;
        let msg = {
            Reserved: reserved,
        };
        self.sendMsg(GameServerProto.GMID_FULI_SHARE_GUAZAI_JINHUA_REQ, msg);
    },
});
