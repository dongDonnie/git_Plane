/**
 * DrawHandler是处理十连单抽等抽卡消息的处理类
 * 发送抽卡相关消息并监听相关消息
 * 接收到消息后，在drawData类数据落地
 */

var HandlerBase = require("handlerbase");
var GlobalVar = require('globalvar');
var EventMsgID = require("eventmsgid");
var GameServerProto = require("GameServerProto");

var self = null;
cc.Class({
    extends: HandlerBase,

    ctor: function () {
        self = this;
    },

    initHandler: function (handlerMgr) {
        // handlerMgr.setKey(GameServerProto.GMID_TREASURE_MINING_ACK,GameServerProto.GMID_TREASURE_MINING_REQ);
        
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_TREASURE_MINING_ACK, self._recvDrawAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_TREASURE_DATA_ACK, self._recvTreasureDataAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_TREASURE_GOLDMINING_REWARD_ACK, self._recvTreasureReasureAck, self);
    },

    _recvTreasureDataAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().drawData.setTreasureData(msg.data);
    },

    _recvDrawAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        // cc.log(msg.data);
        GlobalVar.me().drawData.showTrasureMiningResult(msg.data);
    },

    _recvTreasureReasureAck: function (msgId,msg) {
        if (typeof msg != 'object')
            return;
        // cc.log(msg);
        GlobalVar.me().drawData.showMiningRewardResult(msg.data);
    },

    sendTrasureReward: function (times) {
        let msg = {
            Times: times
        }
        self.sendMsg(GameServerProto.GMID_TREASURE_GOLDMINING_REWARD_REQ, msg);
    },

    sendTreasureData:function () {
        let msg = {
            Reserved: 0,
        };
        self.sendMsg(GameServerProto.GMID_TREASURE_DATA_REQ, msg);
    },

    sendSingleDrawReq: function (free) {
        let msg = {
            Type: GameServerProto.PT_TREASURE_WARM,
            Free: free || 0,
        };
        self.sendMsg(GameServerProto.GMID_TREASURE_MINING_REQ, msg);
    },

    sendGoldTreasure: function(){
        let msg = {
            Type: GameServerProto.PT_TREASURE_GOLD,
        };
        self.sendMsg(GameServerProto.GMID_TREASURE_MINING_REQ, msg);
    },

    sendTenDrawReq: function (free) {
        let msg = {
            Type : GameServerProto.PT_TREASURE_HOT,
            Free: free || 0,
        };
        self.sendMsg(GameServerProto.GMID_TREASURE_MINING_REQ, msg);
    },
});
