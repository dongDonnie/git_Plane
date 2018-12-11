/**
 * MainData类用于处理主城相关数据操作
 */

const GlobalVar = require('globalvar');
const EventMsgID = require("eventmsgid");

var self = null;
var MainData = cc.Class({

    properties: {
        data: null,
    },

    ctor: function () {
        self = this;
        self.token = "";
        self.data = {};
    },

    showDrawItemInfo: function (data) {
        // console.log("sumoonData");
        // cc.log('showDrawItemInfo：', data);
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_DRAW_INFO, data);
    },

    setReNameData: function (data) {
        
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_RENAME_ACK, data);
    },

});

module.exports = MainData;
