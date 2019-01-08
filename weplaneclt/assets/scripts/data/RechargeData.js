
const GlobalVar = require('globalvar');
const EventMsgID = require("eventmsgid");
const GameServerProto = require("GameServerProto");

var self = null;
var rechargeData = cc.Class({

    properties: {
        data: null,
    },

    ctor: function() {
        self = this;
        self.token = "";
        self.data = {};
        self.canGetRewardHotFlag = false;
    },

    setData: function(data){
        if (!data){
            return;
        }
        self.data = data;
        GlobalVar.me().setVoucher(data.Bag.RcgVoucher);
        // GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_RCGBAG_RESULT, data);
        self.updateCanGetRewardHotFlag();
    },

    updateCanGetRewardHotFlag: function () {
        let vipPackage = self.data.Bag.VipPackage;
        let curVipLevel = GlobalVar.me().vipLevel;
        self.canGetRewardHotFlag = false;
        for (let i = 1; i <= curVipLevel; i++){
            if (vipPackage.indexOf(i) == -1){
                self.canGetRewardHotFlag = true;
            }
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_VIP_REWARD_FLAG_CHANGE);
    },

    getCanGetRewardHotFlag: function () {
        return self.canGetRewardHotFlag;
    },

    getData: function(){
        return self.data;
    },

    getRechargeCountByRechargeID: function (rechargeID) {
        let rcgRecord = self.data.Bag.RcgRecord;
        for(let i = 0; i< rcgRecord.length; i++){
            if (rcgRecord[i].RechargeID == rechargeID){
                return rcgRecord[i].Count;
            }
        }
        return 0;
    },

    getRechargeDataIndex: function (rechargeID) {
        let rcgRecord = self.data.Bag.RcgRecord;
        for(let i = 0; i< rcgRecord.length; i++){
            if (rcgRecord[i].RechargeID == rechargeID){
                return i;
            }
        }
        return -1;
    },

    getTimeCardLeftDayByID: function (rechargeID) {
        let timeCardData = self.data.Bag.TimeCard;
        let expireTime = -1;
        let leftDay = -1;
        for (let i = 0; i< timeCardData.length; i++){
            if (timeCardData[i].ID == rechargeID){
                expireTime = timeCardData[i].ExpireTime;
                break;
            }
        }
        if (expireTime != -1){
            // let todayTime = new Date().setHours(5, 0, 0, 0);

            let curTimeStamp = GlobalVar.me().serverTime;
            let curTime = new Date(curTimeStamp*1000 - GameServerProto.PT_DAYPASS_CLOCKTIME*1000);
            let crossTime = (curTime.getHours()*3600 + curTime.getMinutes()*60 + curTime.getSeconds())
            let todayZeroTime = (curTimeStamp - GameServerProto.PT_DAYPASS_CLOCKTIME) - crossTime;
            let todayTime = todayZeroTime + GameServerProto.PT_DAYPASS_CLOCKTIME;

            let leftTime = expireTime - todayTime;
            leftDay = leftTime/(3600*24);
        }

        return leftDay;
    },

    getTimeCardDrawToday: function (rechargeID) {
        let timeCardData = self.data.Bag.TimeCard;
        for (let i = 0; i< timeCardData.length; i++){
            if (timeCardData[i].ID == rechargeID){
                return timeCardData[i].DrawToday;
            }
        }
        return -1;
    },

    setRechargeResult: function(data){
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            GlobalVar.me().setVoucher(data.OK.RcgVoucher);
            GlobalVar.me().setDiamond(data.OK.DiamondCur);
            GlobalVar.me().diamondCz = data.OK.DiamondCZ;
            GlobalVar.me().vipExp = data.OK.VipExp;
            if (GlobalVar.me().vipLevel != data.OK.Vip){
                GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_SPCHANGE_NTF);
            }
            GlobalVar.me().vipLevel = data.OK.Vip;
            self.data.Bag.DiamondCZ = data.OK.DiamondCZ;
            self.data.Bag.TimeCard = data.OK.TimeCard;
            let index = self.getRechargeDataIndex(data.OK.RcgRecord.RechargeID);
            if (index == -1){
                self.data.Bag.RcgRecord.push({
                    RechargeID:data.OK.RcgRecord.RechargeID,
                    Count: data.OK.RcgRecord.Count,
                });
            }else{
                self.data.Bag.RcgRecord[index].Count = data.OK.RcgRecord.Count;
            }
        }
        self.updateCanGetRewardHotFlag();
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_RECHARGE_RESULT, data);
        // self.setData(data.OK);
    },

    setVoucherResult: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            GlobalVar.me().setVoucher(data.Voucher);
            GlobalVar.me().setDiamond(data.Diamond);
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_VOUCHER_RESULT, data);
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_FULICZ_FLAG_CHANGE);
        // self.setData(data.OK);
    },

    setVipPackageData: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            self.data.Bag.VipPackage = data.OK.VipPackage;
            self.updateCanGetRewardHotFlag();
            GlobalVar.me().bagData.updateItemDataByGMDT_ITEM_CHANGE(data.OK.ItemChange);
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_VIP_PACKAGEDATA, data);
    },

    getVipPackageData: function () {
        return self.data.Bag.VipPackage; 
    },
});

module.exports = rechargeData;