const GameServerProto = require("GameServerProto");
const GlobalVar = require("globalvar");
const EventMsgID = require("eventmsgid");


var LimitTimeBoxData = cc.Class({

    ctor: function () {
        this.OnlineTime = null;
        this.Step = null;
        this.Reward = null;
    },

    //设置限时宝箱的数据展示
    setLtbData: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS) {
            this.OnlineTime = data.OnlineTime;
            this.Step = data.Step + 1;
            GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_LTB_DATA, data);
        }   

    },

    updateLtbData: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS) {
            this.OnlineTime = data.OnlineTime;
            this.Step = data.Step + 1;
            this.Reward = data.ItemGet;
            console.log("领取完奖励后回调start");
            GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_LTB_REWARD, data);
        }  
    },

    setLtbFlagNtf: function (data) {

        GlobalVar.me().statFlags.FuliOnlineFlag = data.StatFlag;
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_LTB_HOT_FLAG, data);
        
    },


   
});

module.exports = LimitTimeBoxData;