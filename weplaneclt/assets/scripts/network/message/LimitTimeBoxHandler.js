var HandlerBase = require("handlerbase")
var GlobalVar = require('globalvar')
var GameServerProto = require("GameServerProto");

var self = null;
cc.Class({
    extends: HandlerBase,

    ctor: function() {
        self = this;
    },

    initHandler: function(handlerMgr) {
        this.handlerMgr = handlerMgr;
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_FULI_ONLINE_DATA_ACK, self._recvLtbDataAck, self);  //待领取物品
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_FULI_ONLINE_REWARD_ACK, self._recvLtbRewardAck, self);  //待领取物品
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_FULI_ONLINE_NTF, self._recvLtbNtf, self);  // 红点

        //
    },

    sendGetLtbDataReq: function () {
        let msg = {
            Reserved: 1,
        };
        self.sendMsg(GameServerProto.GMID_FULI_ONLINE_DATA_REQ, msg);
    },
    
    _recvLtbDataAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().limitTimeBoxData.setLtbData(msg.data);
    },

    sendGetLtbRewardReq: function (flag = 0) {
        let msg = {
            Flag: flag,
        };
        self.sendMsg(GameServerProto.GMID_FULI_ONLINE_REWARD_REQ, msg);
    },

    _recvLtbRewardAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().limitTimeBoxData.updateLtbData(msg.data);
    },

    _recvLtbNtf: function (msgId, msg) {
       
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().limitTimeBoxData.setLtbFlagNtf(msg.data);
    },

});

