var HandlerBase = require("handlerbase");
var GlobalVar = require('globalvar');
var EventMsgID = require("eventmsgid");
var GameServerProto = require("GameServerProto");
const SceneDefines = require("scenedefines");

var self = null;
cc.Class({
    extends: HandlerBase,

    ctor: function () {
        self = this;
    },

    initHandler: function (handlerMgr) {
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_GOLD_CHANGE_NTF, self._recvGoldChangeNtf, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_DIAMOND_CHANGE_NTF, self._recvDiamondChangeNtf, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_COMBAT_POINT_NTF, self._recvCombatPointNtf, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_EXP_CHANGE_NTF, self._recvExpChangeNtf, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_PING, self._recvPing, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_KICK_PLAYER_NTF, self._recvKickPlayerNtf, self);
    },

    _recvKickPlayerNtf:function(msgId,msg){
        if (typeof msg != "object") {
            return;
        }
        
        GlobalVar.me().isKickedOut = true;
        GlobalVar.networkManager().needReConnected = false;
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_RETURNTO_LOGINSCENE);
    },

    _recvGoldChangeNtf: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }

        GlobalVar.me().setGold(msg.data.GoldCur);
    },

    _recvDiamondChangeNtf: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().setDiamond(msg.data.DiamondCur);
    },

    _recvCombatPointNtf: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().setCombatPoint(msg.data.CombatPoint);
    },

    _recvExpChangeNtf: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        
        if (msg.data.LevelUpFlag == true){
            GlobalVar.me().setLevelUpData(msg.data.LevelUp)
        }
        
        GlobalVar.me().setExpChange(msg.data.ExpUpdate);
    },

    _recvPing: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        // console.log("接收ping包");
        GlobalVar.me().setServerTime(msg.data.ServerTime);
    },
});
