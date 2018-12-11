/**
 * NoticeHandler是处理公告消息的处理类
 * 负责执行发送申请公告或接收公告消息等操作
 */

var HandlerBase = require("handlerbase")
var GlobalVar = require('globalvar')
var EventMsgID = require("eventmsgid")
var GameServerProto = require("GameServerProto");

var self = null;
cc.Class({
    extends: HandlerBase,

    ctor: function () {
        self = this;
    },

    initHandler: function (handlerMgr) {
        // handlerMgr.setKey(GameServerProto.GMID_NOTICE_ACK,GameServerProto.GMID_NOTICE_REQ);
        // handlerMgr.setKey(GameServerProto.GMID_NOTICE_SCROLL_ACK,GameServerProto.GMID_NOTICE_SCROLL_REQ);

        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_NOTICE_ACK, self._recvNoticeAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_NOTICE_SCROLL_ACK, self._recvNoticeScrollAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_NOTICE_CHANGE_NTF, self._recvNoticeChangeNtf, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_NOTICE_SCROLL_NTF, self._recvNoticeScrollNtf, self);
    },

    _recvNoticeAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        
        GlobalVar.me().noticeData.setData(msg.data);
    },

    _recvNoticeScrollAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        
    },

    _recvNoticeChangeNtf: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        
    },

    _recvNoticeScrollNtf: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        
    },

    sendGetNoticeReq: function (reserved) {

        let msg = {
            Reserved: reserved || 0,
        };

        self.sendMsg(GameServerProto.GMID_NOTICE_REQ, msg);
    },

    sendNoticeScrollReq: function(mailId){
        let msg = {
            Reserved: mailId,
        }
        
        self.sendMsg(GameServerProto.GMID_NOTICE_SCROLL_REQ, msg);
    },
});
