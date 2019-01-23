
const GlobalVar = require('globalvar');
const EventMsgID = require("eventmsgid");
const GameServerProto = require("GameServerProto");

var self = null;
var followRewardData = cc.Class({

    properties: {
        data: null,
    },

    ctor: function() {
        self = this;
    },

    setFollowRewardData: function(data){
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_FOLLOW_REWARD_GET,data.ItemGet);
            GlobalVar.me().fuLiGCBag.OfficialAccountDraingetFlag = data.OfficialAccountDraingetFlag;
        }
        else {
            GlobalVar.comMsg.errorWarning(data.ErrCode);
        }
    },
});

module.exports = followRewardData;