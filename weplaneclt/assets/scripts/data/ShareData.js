/**
 * 处理与公告相关的信息，讲其转换为数据
 */

const GlobalVar = require('globalvar');
const EventMsgID = require("eventmsgid");
var GameServerProto = require("GameServerProto");

var self = null;
var shareData = cc.Class({

    properties: {
        data: null,
    },
    ctor: function() {
        self = this;
        self.token = "";
        self.data = {};
    },
    setData: function(data){
        self.data = data;
        // GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GETDAILY_DATA, data.ErrCode);
    },

    getFreeGoldCount: function () {
        return self.data.FreeGoldCount;
    },

    getFreeDiamondCount: function () {
        return self.data.FreeDiamondCount;
    },

    setFreeGoldCount: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            self.data.FreeGoldCount = data.FreeGoldCount;
            console.log("setGold", data.Gold);
            GlobalVar.me().setGold(data.Gold);
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_FREE_GOLD, data);
    },

    setFreeDiamondCount: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            self.data.FreeDiamondCount = data.FreeDiamondCount;
            console.log("setDiamond", data.Diamond);
            GlobalVar.me().setDiamond(data.Diamond);
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_FREE_DIAMOND, data);
    },

});

module.exports = shareData;