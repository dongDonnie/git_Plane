var HandlerBase = require("handlerbase")
var GlobalVar = require('globalvar')
var GameServerProto = require("GameServerProto");

var self = null;
cc.Class({
    extends: HandlerBase,

    ctor: function () {
        self = this;
    },

    initHandler: function (handlerMgr) {
        this.handlerMgr = handlerMgr;
        
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_ITEMBAG_UNLOCK_ACK, self.recvBagUnlockAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_ITEM_SELL_ACK, self.recvItemSellAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_BAG_ITEM_CHANGE_NTF, self.recvBagItemChangeNtf, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_ITEM_USE_ACK, self.recvItemUseAck, self);
    },

    recvBagUnlockAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().bagData.saveBagUnlock(msg);
    },
    sendBagUnlockReq: function () {
        let msg = {

        }
        this.sendMsg(GameServerProto.GMID_ITEMBAG_UNLOCK_REQ, msg);
    },

    recvItemSellAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().bagData.saveItemSell(msg);
    },

    sendItemSellReq: function (slot, count) {
        let msg = {
            Items: [],
        }
        let index = { Slot: slot, Count: count };
        msg.Items.push(index);
        this.sendMsg(GameServerProto.GMID_ITEM_SELL_REQ, msg);
    },

    recvBagItemChangeNtf: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().bagData.saveItemChange(msg.data);
    },

    sendItemUseReq: function (slot, count, param1) {
        let msg = {
            Slot: slot,
            Count: count,
            Param1: param1,
        };
        this.sendMsg(GameServerProto.GMID_ITEM_USE_REQ, msg);
    },
    recvItemUseAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().bagData.saveItemUseData(msg.data);
    },

});