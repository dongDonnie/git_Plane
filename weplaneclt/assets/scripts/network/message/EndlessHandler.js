

var HandlerBase = require("handlerbase")
var GlobalVar = require('globalvar')
var EventMsgID = require("eventmsgid")
const GameServerProto = require("GameServerProto");

var self = null;

cc.Class({
    extends: HandlerBase,

    ctor: function () {
        self = this;
    },

    initHandler: function (handlerMgr) {
        // handlerMgr.setKey(GameServerProto.GMID_ENDLESS_BAG_ACK, GameServerProto.GMID_ENDLESS_BAG_REQ);
        // handlerMgr.setKey(GameServerProto.GMID_ENDLESS_RANKUP_ACK, GameServerProto.GMID_ENDLESS_RANKUP_REQ);
        // handlerMgr.setKey(GameServerProto.GMID_ENDLESS_STARTBATTLE_ACK, GameServerProto.GMID_ENDLESS_STARTBATTLE_REQ);
        // handlerMgr.setKey(GameServerProto.GMID_ENDLESS_ENDBATTLE_ACK, GameServerProto.GMID_ENDLESS_ENDBATTLE_REQ);
        // handlerMgr.setKey(GameServerProto.GMID_ENDLESS_QUITBATTLE_ACK, GameServerProto.GMID_ENDLESS_QUITBATTLE_REQ);
        // handlerMgr.setKey(GameServerProto.GMID_ENDLESS_BUYBLESS_ACK, GameServerProto.GMID_ENDLESS_BUYBLESS_REQ);
        // handlerMgr.setKey(GameServerProto.GMID_ENDLESS_BUYSTATUS_ACK, GameServerProto.GMID_ENDLESS_BUYSTATUS_REQ);
        // handlerMgr.setKey(GameServerProto.GMID_ENDLESS_BUY_POWERPOINT_ACK, GameServerProto.GMID_ENDLESS_BUY_POWERPOINT_REQ);

        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_ENDLESS_BAG_ACK, self._recvEndlessGetBagAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_ENDLESS_RANKUP_ACK, self._recvEndlessRankUpAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_ENDLESS_STARTBATTLE_ACK, self._recvEndlessStartBattleAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_ENDLESS_ENDBATTLE_ACK, self._recvEndlessEndBattleAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_ENDLESS_QUITBATTLE_ACK, self._recvEndlessQuitBattleAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_ENDLESS_BUYBLESS_ACK, self._recvEndlessBuyBlessAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_ENDLESS_BUYSTATUS_ACK, self._recvEndlessBuyStatusAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_ENDLESS_BUY_POWERPOINT_ACK, self._recvEndlessBuyPowerPointAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_ENDLESS_USESTATUS_ACK, self._recvEndlessUseStatusAck, self);
        //GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_ENDLESS_QHUP_ACK, self._recvEndlessQHUpAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_ENDLESS_RANKUP_ACK, self._recvEndlessRankUpAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_ENDLESS_GETGOLD_ACK, self._recvEndlessGetGoldAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_ENDLESS_POWERPOINT_NTF, self._recvEndlessPowerPointNtf, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_ENDLESS_CHARGE_REWARD_ACK, self._recvEndlessChargeRewardAck, self);
    },

    checkMsg(msg) {
        if (typeof msg != "object") {
            return false;
        }
        return true;
    },


    //////////////////////////////接受消息/////////////////////////////
    _recvEndlessGetBagAck: function (msgId, msg) {
        if (!self.checkMsg(msg)) return;

        GlobalVar.me().endlessData.saveEndlessBagData(msg.data);
    },

    _recvEndlessRankUpAck: function (msgId, msg) {
        if (!self.checkMsg(msg)) return;
    },

    _recvEndlessGetGoldAck: function (msgId, msg) {
        if (!self.checkMsg(msg)) return;

        GlobalVar.me().endlessData.saveGetGoldData(msg.data);
    },
    _recvEndlessPowerPointNtf: function (msgId, msg) {
        if (!self.checkMsg(msg)) return;

        GlobalVar.me().endlessData.saveEndlessPowerNtf(msg.data);
    },

    _recvEndlessStartBattleAck: function (msgId, msg) {
        if (!self.checkMsg(msg)) return;

        GlobalVar.me().endlessData.saveStartBattleData(msg.data);
    },

    _recvEndlessEndBattleAck: function (msgId, msg) {
        if (!self.checkMsg(msg)) return;

        GlobalVar.me().endlessData.setEndBattleData(msg.data);
    },

    _recvEndlessQuitBattleAck: function (msgId, msg) {
        if (!self.checkMsg(msg)) return;

        GlobalVar.me().endlessData.setQuitBattleData(msg.data);
    },

    _recvEndlessBuyBlessAck: function (msgId, msg) {
        if (!self.checkMsg(msg)) return;

        GlobalVar.me().endlessData.setBlessMsg(msg.data);
    },

    _recvEndlessBuyStatusAck: function (msgId, msg) {
        if (!self.checkMsg(msg)) return;

        GlobalVar.me().endlessData.setStatusCount(msg.data);
    },

    _recvEndlessUseStatusAck: function (msgId, msg) {
        if (!self.checkMsg(msg)) return;

        GlobalVar.me().endlessData.setUseStatus(msg.data);
    },

    _recvEndlessBuyPowerPointAck: function (msgId, msg) {
        if (!self.checkMsg(msg)) return;

        GlobalVar.me().endlessData.saveBuyPowerPointData(msg.data);
    },
    // _recvEndlessQHUpAck: function(msgId, msg){
    //     if (!self.checkMsg(msg)) return;

    //     GlobalVar.me().endlessData.setEndlessQHData(msg.data);
    // },
    _recvEndlessRankUpAck: function (msgId, msg) {
        if (!self.checkMsg(msg)) return;

        GlobalVar.me().endlessData.setEndlessRankData(msg.data);
    },

    _recvEndlessChargeRewardAck: function (msgId, msg) {
        if (!self.checkMsg(msg)) return;
        
        GlobalVar.me().endlessData.setEndlessChargeData(msg.data);
    },


    /////////////////////////////////发送消息////////////////////////////
    sendEndlessGetBagReq: function () {

        let reserved = 0;
        let msg = {
            Reserved: reserved,
        };

        self.sendMsg(GameServerProto.GMID_ENDLESS_BAG_REQ, msg);
    },

    sendEndlessRankUpReq: function () {

        let reserved = 0;
        let msg = {
            Reserved: reserved,
        };

        self.sendMsg(GameServerProto.GMID_ENDLESS_RANKUP_REQ, msg);
    },

    sendEndlessStartBattleReq: function () {

        let reserved = 0;
        let msg = {
            Reserved: reserved,
        };

        self.sendMsg(GameServerProto.GMID_ENDLESS_STARTBATTLE_REQ, msg);
    },

    sendEndlessEndBattleReq: function (score, bigRound, packageCount, token) {

        let msg = {
            Score: score,
            BigRound: bigRound,
            PackageCount: packageCount,
            Token: token,
        };

        self.sendMsg(GameServerProto.GMID_ENDLESS_ENDBATTLE_REQ, msg);
    },

    sendEndelssQuitBattleReq: function () {

        let reserved = 0;
        let msg = {
            Reserved: reserved,
        };

        self.sendMsg(GameServerProto.GMID_ENDLESS_QUITBATTLE_REQ, msg);
    },

    sendEndlessBuyBlessReq: function (free) {
        let msg = {
            Free: free || 0,
        };

        self.sendMsg(GameServerProto.GMID_ENDLESS_BUYBLESS_REQ, msg);
    },

    sendEndlessBuyStatusReq: function (statusID, free) {

        let msg = {
            StatusID: statusID,
            Free: free || 0,
        };

        self.sendMsg(GameServerProto.GMID_ENDLESS_BUYSTATUS_REQ, msg);
    },

    sendEndlessUseStatusReq: function (statusID) {

        let msg = {
            StatusID: statusID
        };

        self.sendMsg(GameServerProto.GMID_ENDLESS_USESTATUS_REQ, msg);
    },

    sendEndlessBuyPowerPointReq: function (free) {

        let msg = {
            Free: free || 0,
        };

        self.sendMsg(GameServerProto.GMID_ENDLESS_BUY_POWERPOINT_REQ, msg);
    },

    sendEndlessChanGetTaskReq: function () {

        let reserved = 0;
        let msg = {
            Reserved: reserved,
        };

        self.sendMsg(GameServerProto.GMID_ENDLESS_CHAN_GETTASK_REQ, msg);
    },

    sendEndlessChanGetRewardReq: function () {

        let reserved = 0;
        let msg = {
            Reserved: reserved,
        };

        self.sendMsg(GameServerProto.GMID_ENDLESS_CHAN_GETREWARD_REQ, msg);
    },

    sendEndlessChanRefreshTaskReq: function () {

        let reserved = 0;
        let msg = {
            Reserved: reserved,
        };

        self.sendMsg(GameServerProto.GMID_ENDLESS_CHAN_REFRESH_TASK_REQ, msg);
    },

    sendEndlessQHUpReq: function (reserved) {
        reserved = reserved || 0;
        let msg = {
            Reserved: reserved,
        };

        self.sendMsg(GameServerProto.GMID_ENDLESS_QHUP_REQ, msg);
    },

    sendEndlessGetGoldReq: function (getGold) {
        let msg = {
            GetGold: getGold || 0,
        };

        self.sendMsg(GameServerProto.GMID_ENDLESS_GETGOLD_REQ, msg);
    },

    sendEndlessChargeRewardReq: function (reserved) {

        let msg = {
            Reserved: reserved || 0,
        };

        self.sendMsg(GameServerProto.GMID_ENDLESS_CHARGE_REWARD_REQ, msg);
    },

});