const GameServerProto = require("GameServerProto");
const GlobalVar = require("globalvar");
const EventMsgId = require("eventmsgid");

const GOLD_ID = 1;
const DIAMOND_ID = 3;

var LimitStoreData = cc.Class({
    ctor: function () {
        this.typeMap = { 1: [], 2: [], 3: [] };
        this.buyAck = {};
        this.limitStoreBuyId = 0;
        this.nowType = 0;
        this.initData();
    },

    initData: function () {
        var totalData = GlobalVar.tblApi.getData('TblFuLiGiftLimit');
        for (var i in totalData)
            this.typeMap[totalData[i].byShowType].push(totalData[i]);
    },

    saveData: function (msgId, msg) {

        this.gift = msg.data.Gift;   //当日已经购买过的信息
        GlobalVar.eventManager().dispatchEvent(EventMsgId.EVENT_LIMIT_STORE_DATA_NTF, this.gift);
    },

    saveBuyData: function (msgId, msg) {
        if (msg.data.ErrCode == GameServerProto.PTERR_SUCCESS) {
            this.buyAck = msg.data;
            this.gift = msg.data.Gift;
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgId.EVENT_LIMIT_STORE_DATA_NTF, this.gift);
        GlobalVar.eventManager().dispatchEvent(EventMsgId.EVENT_LIMIT_STORE_BUY_NTF, msg.data);
    },

    findFuliGiftById: function (id) {   //找到已经购买过的信息
        var item = {};
        item.ID = id;
        item.Num = 0;
        for (let i = 0; i < this.gift.length; i++) {
            if (id == this.gift[i].ID)
                return this.gift[i];
        }
        return item;
    },

    getBuyCostNum: function (startNum, endNum, vecCost) {    //获取消耗数目，因为越买消耗的越多
        var cost = 0;
        for (let i = startNum; i <= endNum; i++) {
            var costOnce = 0;
            for (let j = 0; j < vecCost.length; j++) {
                if (i >= vecCost[j].byNum)
                    costOnce = vecCost[j].nCost;
                else
                    break;
            }
            cost += costOnce;
        }
        return cost;
    },
});

module.exports = LimitStoreData;