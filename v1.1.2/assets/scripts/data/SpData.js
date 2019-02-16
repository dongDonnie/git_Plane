
const GlobalVar = require('globalvar');
const EventMsgID = require("eventmsgid");

var self = null;
var spData = cc.Class({

    properties: {
        data: null,
    },

    ctor: function() {
        self = this;
        self.token = "";
        self.data = {};
    },

    setData: function(data){
        if (!data){
            return;
        }
        for(let key in data){
            self.data[key] = data[key];
        }
    },

    getData: function(){
        return self.data;
    },
    getSpFreeCount: function () {
        return self.data.FreeCount;
    },

    setSpChange: function(data){
        self.setData(data);
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_SPCHANGE_NTF);
    },

    setSpBuy: function(data){
        if (data.ErrCode == 0){
            self.setData(data.OK);
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_SPCHANGE_NTF);
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_BUY_SP_RESULT, data);

    }
});

module.exports = spData;