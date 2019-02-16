/**
 * 处理与公告相关的信息，讲其转换为数据
 */

const GlobalVar = require('globalvar');
const EventMsgID = require("eventmsgid");
const GameServerProto = require("GameServerProto");


var self = null;
var shareData = cc.Class({

    properties: {
        data: null,
    },
    ctor: function () {
        self = this;
        self.token = "";
        self.data = {};
    },
    setData: function (data) {
        self.data = data;
        // GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GETDAILY_DATA, data.ErrCode);
        // self.FuliShareRecommand = StoreageData.getFuliShareState("recommand");
        // self.FuliShareDaily = StoreageData.getFuliShareState("shareDaily");
        // self.FuliShareMemberTestPlay = StoreageData.getFuliShareState("shareMemberTestPlay");
    },

    getFreeGoldCount: function () {
        return self.data.FreeGoldCount;
    },

    getFreeDiamondCount: function () {
        return self.data.FreeDiamondCount;
    },

    getShareRecommandState: function () {
        return self.data.FuliRecommend;
    },

    getShareDailyState: function () {
        return self.data.FuliDaily;
    },

    getShareMemberTestPlay: function () {
        return self.data.FuliMemberTestPlay;
    },
    getSuperRewardState: function () {
        return self.data.SuperFuli;
    },
    getInviteGiftBagState: function () {
        return self.data.InviteGiftBag;
    },
    getFreeJinHuaCount: function () {
        return self.data.JinHuaCount;
    },

    setFreeGoldCount: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS) {
            self.data.FreeGoldCount = data.FreeGoldCount;
            console.log("setGold", data.Gold);
            GlobalVar.me().setGold(data.Gold);
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_FREE_GOLD, data);
    },

    setFreeDiamondCount: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS) {
            self.data.FreeDiamondCount = data.FreeDiamondCount;
            console.log("setDiamond", data.Diamond);
            GlobalVar.me().setDiamond(data.Diamond);
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_FREE_DIAMOND, data);
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_FREE_DIAMOND_FLAG_CHANGE);
    },

    setRecommandData: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS) {
            self.data.FuliRecommend = data.FuliShareRecommand;
            // StoreageData.setFuliShareState("recommand");
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_RECOMMAND_DATA, data);
    },

    setMemberTestPlayData: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS) {
            self.data.FuliMemberTestPlay = data.FuliShareMemberTestPlay;
            // StoreageData.setFuliShareState("shareMemberTestPlay");
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_MEMBERTESTPLAY_DATA, data);
    },

    setShareDailyData: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS) {
            self.data.FuliDaily = data.FuliShareDaily;
            // StoreageData.setFuliShareState("shareDaily");
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_SHARE_DAILY_DATA, data);
    },

    setSuperRewardData: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS) {
            self.data.SuperFuli = data.SuperFuli;
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_SUPER_REWARD_DATA, data);
    },

    setInviteGiftBagData: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS) {
            self.data.InviteGiftBag = data.InviteGiftBag;
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_INVITE_REWARD_DATA, data);
    },

    setGuazaiJinHuaData: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS) {
            self.data.JinHuaCount = data.JinHuaCount;
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_JINHUA_REWARD_DATA, data);
    }
});

module.exports = shareData;