/**
 * 处理与公告相关的信息，讲其转换为数据
 */

const GlobalVar = require('globalvar');
const EventMsgID = require("eventmsgid");

var self = null;
var noticeData = cc.Class({

    properties: {
        data: null,
    },

    ctor: function() {
        self = this;
        self.token = "";
        self.data = {};
        self.noticeCount = -1;
    },

    setData: function(data){
        self.data = data;

        self.noticeCount = data.Notice.length;
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_SHOW_NOTICE_LIST);
    },

    getNoticeData: function () {
        return self.data.Notice;
    },

    getNoticeCount: function () {
        return self.noticeCount;
    },


});

module.exports = noticeData;