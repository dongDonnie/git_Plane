
var HandlerBase = require("handlerbase");
var GlobalVar = require('globalvar');
const GameServerProto = require("GameServerProto");

var self = null;
cc.Class({
    extends: HandlerBase,

    ctor: function () {
        self = this;
    },

    initHandler: function (handlerMgr) {
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_EXPLORE_DATA_ACK, self._recvExploreDataAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_EXPLORE_SELECT_AREA_ACK, self._recvExploreDataAck, self);

    },

    // 请求空间搜索相关数据
    _recvExploreDataAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().spaceExploreData.setExploreData(msg.data);
    },

    sendExploreDataReq: function() {
        let msg = {
            Reserved: 0,
        };
        self.sendMsg(GameServerProto.GMID_EXPLORE_DATA_REQ, msg);
    },

    // 提审搜索区域
    _recvSelectAreaAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().spaceExploreData.setExploreData(msg.data);
    },

    sendSelectAreaReq: function(areaId) {
        let msg = {
            SelectAreaID: areaId,
        };
        self.sendMsg(GameServerProto.GMID_EXPLORE_SELECT_AREA_REQ, msg);
    },

});
