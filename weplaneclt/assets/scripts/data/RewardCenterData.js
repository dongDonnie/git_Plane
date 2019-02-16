const EventMsgID = require("eventmsgid");
const GlobalVar = require('globalvar');
const GameServerProto = require("GameServerProto");

var self = null;

var RewardCenterData = cc.Class({

    properties: {
        
    },

    ctor: function () {
        self = this;
        self.data = null;
    },

    setRewardCenterNtf: function (data) {
        self.data = data;
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_REWARD_CENTER_DATA, data);
    },

    setGetRewardAck: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS) {
            for (let i = 0; i < self.data.Reward.length; i++) {
                if (self.data.Reward[i].Seq == data.OK.Seq) {
                    self.data.Reward.splice(i, 1);
                }
            }
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_REWARD_RESULT, data);
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_REWARD_CENTER_DATA, self.data);
    },

    setAllRewardAck: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS) {
            self.data.Reward = [];
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_REWARD_RESULT, data);
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_REWARD_CENTER_DATA, self.data);
    },
});

module.exports = RewardCenterData;