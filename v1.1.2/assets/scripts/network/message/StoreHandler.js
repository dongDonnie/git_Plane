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

        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_STORE_DATA_ACK, self._recvStoreAck, self);
        // GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_MIBAO_STORE_DATA_ACK, self._recvStoreAck, self); //原来飞机2的很多不同商店
        // GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_VIP_STORE_DATA_ACK, self._recvStoreAck, self);
        // GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_NUCLEAR_STORE_DATA_ACK, self._recvStoreAck, self);
        // GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_TOWER_FLOOR_STORE_DATA_ACK, self._recvStoreAck, self);
        // GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_RANK_STORE_DATA_ACK, self._recvStoreAck, self);
        // GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_DEVIL_STORE_DATA_ACK, self._recvStoreAck, self);

        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_STORE_BUY_ACK, self.recvBuyAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_STORE_REFRESH_ACK, self.recvRefreshAck, self);

        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_STORE_NTF, self.recvStoreNtf, self);
    },

    recvStoreNtf: function(msgId, msg){
        if (typeof msg != "object") { 
            return; 
        }

        GlobalVar.me().storeData.setStoreNtf(msg.data);
    },

    _recvStoreAck: function(msgId, msg) {
        if (typeof msg != "object") { 
            return; 
        }
        GlobalVar.me().storeData.saveData(msgId,msg);
    },

    recvBuyAck:function(msgId, msg){
        if (typeof msg != "object") { 
            return; 
        }
        GlobalVar.me().storeData.saveBuyData(msgId,msg);
    },

    recvRefreshAck:function(msgId,msg){
        if (typeof msg != "object") { 
            return; 
        }
        // cc.log("收到刷新回包");
        GlobalVar.me().storeData.saveRefreshData(msgId,msg);
    },

    sendReq: function(req,msg) {

        this.sendMsg(req, msg);
    }
});

