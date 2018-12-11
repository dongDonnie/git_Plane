
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
        // handlerMgr.setKey(GameServerProto.GMID_CAMP_BAG_ACK,GameServerProto.GMID_CAMP_BAG_REQ);
        // handlerMgr.setKey(GameServerProto.GMID_CAMP_CHAPTER_REWARD_ACK,GameServerProto.GMID_CAMP_CHAPTER_REWARD_REQ);
        // handlerMgr.setKey(GameServerProto.GMID_CAMP_SAODANG_ACK,GameServerProto.GMID_CAMP_SAODANG_REQ);
        // handlerMgr.setKey(GameServerProto.GMID_CAMP_BUYCOUNT_ACK,GameServerProto.GMID_CAMP_BUYCOUNT_REQ);

        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_CAMP_BAG_ACK, self._recvCampBagData, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_CAMP_CHAPTER_REWARD_ACK, self._recvCampChapterRewardAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_CAMP_SAODANG_ACK, self._recvSweepAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_CAMP_BUYCOUNT_ACK, self._recvCampBuyCountAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_CAMP_BEGIN_ACK, self._recvCampBeginAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_CAMP_RESULT_ACK, self._recvCampResultAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_CAMP_REVIVE_ACK, self._recvCampReviveAck, self);

        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_CAMP_CAMPACTIVE_NTF, self._recvCampActiveNtf, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_CAMP_CHAPTERACTIVE_NTF, self._recvChapterActiveNtf, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_CAMP_DRAWREWARD_ACK,self._recvDrawRewardAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_CAMP_FREEDRAW_ACK, self._recvFreeDrawAck, self);
        
    },

    sendDrawRewardReq:function(index){
        let msg = {
            Pos: index,
        };
        self.sendMsg(GameServerProto.GMID_CAMP_DRAWREWARD_REQ, msg);
    },

    _recvDrawRewardAck:function(msgId,msg){
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().campData.setRecvDrawRewardData(msg.data);
    },

    sendFreeDrawReq:function(reserved){
        let msg = {
            Reserved: reserved || 0,
        };
        self.sendMsg(GameServerProto.GMID_CAMP_FREEDRAW_REQ, msg);
    },
    _recvFreeDrawAck: function (msgId,msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().campData.setRecvFreeDrawData(msg.data);
    },

    _recvCampActiveNtf: function (msgId, msg){
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().campData.setRecvCampActiveNtf(msg.data);
    },
    _recvChapterActiveNtf: function (msgId, msg){
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().campData.setRecvChapterActiveNtf(msg.data);
    },

    _recvCampBeginAck:function(msgId,msg){
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().campData.setRecvCampBeginData(msg.data);
    },
    sendCampBeginReq:function(chapterID, campaignID){
        let msg = {
            Type: GameServerProto.PT_CAMPTYPE_MAIN,
            ChapterID: chapterID,
            CampaignID: campaignID,
        };
        self.sendMsg(GameServerProto.GMID_CAMP_BEGIN_REQ, msg);
    },

    _recvCampResultAck:function(msgId,msg){
        if (typeof msg != "object") {
            return;
        }
        // cc.log('_recvCampResultAck',msg);
        GlobalVar.me().campData.setRecvCampResultData(msg.data);
    },
    sendCampResultReq:function(result){
        if(result){
            let msg = {
                Result: GameServerProto.PT_CAMP_RESULT_WIN,
                Win:{
                    CrystalPer:10000,
                }
            };
            self.sendMsg(GameServerProto.GMID_CAMP_RESULT_REQ, msg);
        }else{
            let msg = {
                Result: GameServerProto.PT_CAMP_RESULT_LOSE,
            };
            self.sendMsg(GameServerProto.GMID_CAMP_RESULT_REQ, msg);
        }
    },

    _recvCampBagData: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().campData.saveData(msg.data);
    },

    sendGetCampBagReq: function (type) {
        let msg = {
            Type: type,
        }
        
        self.sendMsg(GameServerProto.GMID_CAMP_BAG_REQ, msg);
    },

    _recvSweepAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().campData.setSweepResultData(msg.data);
    },

    sendSweepReq: function(type, chapterID, campaignID){
        let msg = {
            Type: type,
            ChapterID: chapterID,
            CampaignID: campaignID,
        };
        self.sendMsg(GameServerProto.GMID_CAMP_SAODANG_REQ, msg);
    },

    _recvCampChapterRewardAck: function(msgId, msg){
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().campData.setRecvChapterRewardData(msg.data);
    },

    sendGetCampChapterRewardReq: function(campType, chapterID, pos) {
        let msg = {
            CampType: campType,
            ChapterID: chapterID,
            Pos: pos,
        };
        self.sendMsg(GameServerProto.GMID_CAMP_CHAPTER_REWARD_REQ, msg);
    },

    _recvCampBuyCountAck: function (msgId, msg){
        if (typeof msg != "object"){
            return;
        }
        GlobalVar.me().campData.setCampBuyCountData(msg.data);
    },

    sendCampBuyCountReq: function (campType, chapterID, campaignID){
        let msg = {
            CampType: campType,
            ChapterID: chapterID,
            CampaignID: campaignID,
        };

        self.sendMsg(GameServerProto.GMID_CAMP_BUYCOUNT_REQ, msg);
    },

    _recvCampReviveAck: function(msgId, msg){
        if (typeof msg != "object"){
            return;
        }
        GlobalVar.me().campData.setRecvCampReviveData(msg.data);
    },

    sendCampReviveReq: function(free){
        let dieCount = GlobalVar.me().campData.dieCount;
        let msg = {
            ReveiveTime: dieCount + 1,
            Free: free||0,
        };

        self.sendMsg(GameServerProto.GMID_CAMP_REVIVE_REQ, msg);
    },
});
