
const GlobalVar = require('globalvar');
const EventMsgID = require("eventmsgid");
const GameServerProto = require("GameServerProto");

var self = null;
var boxRewardData = cc.Class({

    properties: {
        data: null,
    },

    ctor: function() {
        self = this;
    },

    setJumpToBoxRewardData: function(data){
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_BOX_REWARD_GET,data.ItemGet);
            GlobalVar.me().fuLiGCBag.HeZiReward = data.HeZiReward;                        
        }
        else {
            GlobalVar.comMsg.errorWarning(data.ErrCode);
        }
    },
});

module.exports = boxRewardData;