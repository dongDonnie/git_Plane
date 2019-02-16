
const GlobalVar = require('globalvar');
const EventMsgID = require("eventmsgid");
var GameServerProto = require("GameServerProto");

var self = null;
var feedbackData = cc.Class({

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
    },

    setFuliFeedbackData: function(data){
        self.setData(data);
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_FULI_FEEDBACK_RESULT, data);
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_FULICZ_FLAG_CHANGE);
    },

    saveFuliBuyData: function(data){
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            self.data.Daily = data.Daily;
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_FULI_BUY_RESULT, data);
    },

    getFuliBuyStateByID: function(ID){
        for (let i = 0; i< self.data.Daily.length; i++){
            if (self.data.Daily[i] == ID){
                return true;
            }
        }
        return false;
        // if (self.data.Daily){
        //     return self.data.Daily;
        // }
    },

    saveFuliSCData: function(data){
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            self.data.Flag = true;
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_FULI_SC_RESULT, data);
    },

    getFuliSCFlag: function(){
        if (self.data.Flag){
            return self.data.Flag;
        }
    },

    setFuliFlag: function(data){
        GlobalVar.me().statFlags.FuLiCZFlag = data.StatFlag;
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_FULICZ_FLAG_CHANGE);
    }
});

module.exports = feedbackData;