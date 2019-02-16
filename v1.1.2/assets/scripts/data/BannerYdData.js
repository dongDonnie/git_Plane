
const GlobalVar = require('globalvar');
const EventMsgID = require("eventmsgid");
const GameServerProto = require("GameServerProto");

var self = null;
var bannerYdData = cc.Class({

    properties: {
        data: null,
    },

    ctor: function() {
        self = this;
        self.rewardList = [];
    },

    setRewardData: function(data){
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            self.rewardList = data.ItemGet;
        }
    },

    getRewardData: function(type){
        return self.rewardList;
    },

    setSuperInduceCount:function(data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_SUPER_INDUCE_GET,data.ItemGet);
            GlobalVar.me().fuLiGCBag.SuperInduceCount = data.SuperInduceCount;
        }
    },
});

module.exports = bannerYdData;