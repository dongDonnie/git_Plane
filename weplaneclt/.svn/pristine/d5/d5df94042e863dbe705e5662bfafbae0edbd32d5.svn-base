/**
 * MailHandler是邮件相关信息的处理类
 * 负责接收邮件信息，发送领取附件删除邮件等信息
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
        // handlerMgr.setKey(GameServerProto.GMID_MAIL_GET_LIST_ACK,GameServerProto.GMID_MAIL_GET_LIST_REQ);
        // handlerMgr.setKey(GameServerProto.GMID_MAIL_READ_ACK,GameServerProto.GMID_MAIL_READ_REQ);

        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_MAIL_GET_LIST_ACK, self._recvGetMailListAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_MAIL_READ_ACK, self._recvMailReadAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_MAIL_RECEIVE_NTF, self._recvMailReceiveNtf, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_MAIL_DEL_NTF, self._recvMailDelNtf, self);
    },

    _recvGetMailListAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }

        GlobalVar.me().mailData.setMailData(msg.data);
    },
    sendGetMailListReq: function (reserved) {

        let msg = {
            Reserved: reserved,
        };

        self.sendMsg(GameServerProto.GMID_MAIL_GET_LIST_REQ, msg);
    },

    _recvMailReadAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }

        GlobalVar.me().mailData.saveMailRead(msg.data);
    },

    sendReadMailReq: function(mailId){
        let msg = {
            MailID: mailId,
        }
        
        self.sendMsg(GameServerProto.GMID_MAIL_READ_REQ, msg);
    },
    
    _recvMailReceiveNtf: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        
        GlobalVar.me().mailData.getNewMail(msg.data);
    },
    _recvMailDelNtf: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        
        GlobalVar.me().mailData.deleteMail(msg.data);
    },
});
