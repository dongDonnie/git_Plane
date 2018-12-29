/**
 * 处理邮件相关的信息，奖其转换为数据
 */

const GlobalVar = require('globalvar');
const EventMsgID = require("eventmsgid");
const GameServerProto = require("GameServerProto");

var self = null;
var mailData = cc.Class({

    properties: {
        data: null,
    },

    ctor: function () {
        self = this;
        self.token = "";
        self.data = {};
        self.mailList = {};
        self.notReadMailCount = -1;
    },

    setMailData: function (data) {
        // console.log("mailData:", data);
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            self.mailList = data.MailList;
        }
        self.checkNotReadMailCount();
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_REFRESH_MAIL_WND, data);
    },
    getMailData: function(){
        return self.mailList;
    },
    
    checkNotReadMailCount: function(){
        self.notReadMailCount = 0;
        let mailList = self.mailList;
        for (let i = 0; i< mailList.length; i++){
            if (mailList[i].ReadStatus != GameServerProto.PT_MAIL_HAVE_READ){
                self.notReadMailCount += 1;
            }
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_SET_MAIL_FLAG);
    },

    getNotReadMailCont: function(){
        return self.notReadMailCount;
    },

    saveMailRead: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            let mailID = data.MailID;
            let index = self.getMailIndexByID(mailID);
            if (self.mailList[index].Attachments.length == 0){
                self.mailList[index].ReadStatus = GameServerProto.PT_MAIL_HAVE_READ;
            }else{
                self.mailList.splice(index, 1);
            }
            self.checkNotReadMailCount();
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_REFRESH_MAIL_WND, data);
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_RECV_MAIL_REWARD, data);
    },

    getMailIndexByID: function(mailID){
        for(let i = 0; i<self.mailList.length; i++){
            if (self.mailList[i].MailID == mailID){
                return i;
            }
        }
        return -1;
    },

    getNewMail: function (data) {
        if (data.ErrCode != GameServerProto.PTERR_SUCCESS){
            self.mailList.push(data.Mail);
            self.checkNotReadMailCount();
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_REFRESH_MAIL_WND, data);
    },

    deleteMail: function (data) {
        if (data.ErrCode != GameServerProto.PTERR_SUCCESS){
            for(let i = 0; i<data.MailID.length; i++){
                let mailID = data.MailID[i];
                let index = self.getMailIndexByID(mailID);
                if (index != -1){
                    self.mailList.splice(index, 1);
                }
            }
            self.checkNotReadMailCount();
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_REFRESH_MAIL_WND, data);
    },
});

module.exports = mailData;