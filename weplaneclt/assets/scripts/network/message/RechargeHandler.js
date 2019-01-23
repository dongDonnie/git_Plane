
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

        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_RCG_ACK, self._recvRcgAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_RCG_BAG_ACK, self._recvRcgBagAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_VOUCHER_EXCHANGE_ACK, self._recvExchangeAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_VIP_PACKAGE_GET_ACK, self._recvVipPackageGetAck, self);
    },

    _recvRcgAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }

        if (msg.data.ErrCode != GameServerProto.PTERR_SUCCESS){
            GlobalVar.me().setDiamond(msg.data.OK.DiamondCur);
        }
        GlobalVar.me().rechargeData.setRechargeResult(msg.data);
    },

    sendRcgReq: function(rechargeID){
        let msg = {
            RechargeID: rechargeID,
        }
        
        self.sendMsg(GameServerProto.GMID_RCG_REQ, msg);
    },

    _recvRcgBagAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }

        GlobalVar.me().rechargeData.setData(msg.data);
    },

    sendRcgBagReq: function (reserv) {
        let msg = {
            Reserved: 0,
        }
        self.sendMsg(GameServerProto.GMID_RCG_BAG_REQ,msg);
    },

    sendVoucherReq: function (num) {
        let msg = {
            Num: num,
        }
        self.sendMsg(GameServerProto.GMID_VOUCHER_EXCHANGE_REQ, msg);
    },

    _recvExchangeAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().rechargeData.setVoucherResult(msg.data);
    },

    sendVipPackageGetReq: function (vipLevel) {
        let msg = {
            Vip: vipLevel,
        }
        self.sendMsg(GameServerProto.GMID_VIP_PACKAGE_GET_REQ, msg);
    },
    _recvVipPackageGetAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().rechargeData.setVipPackageData(msg.data);
    },
});
