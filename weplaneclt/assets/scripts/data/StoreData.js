

/*struct StoreData{
    refreshTimes                                        已刷新次数，不能刷新的商店就为null
    refreshCost {itemId,num}                            刷新所需物品，该结构体里包含，消耗物品id和数量
    time                                                距离下次自动刷新的时间
    msgId                                               所收到回包的id根据这个确定刷新按钮，购买按钮的监听事件
    itemArray[item{itemId,num,state,costId,costNum}]    物品数组，里面包含item，item结构里有itemId,数量，是否被购买，消耗道具的Id,数量
    describe                                            下次刷新时间前面的那个label里的内容，默认为下次刷新时间
    serverTime                                          服务器时间
}
*/

// 整个data做的事情就是把从服务器拉到的数据整合，形成一个统一的结构体，方便ui层面做统一使用，扩展

const GameServerProto = require("GameServerProto");
const GlobalVar = require("globalvar");
const EventMsgID = require("eventmsgid");
const CommonWnd = require("CommonWnd");


const GOLD_ID = 1;
const DIAMOND_ID = 3;

var StoreData = cc.Class({
    ctor: function () {

        this.resetData();
    },

    resetData: function () {
        this.storeData = {};
        this.storeBuyData = {};
        this.storeRefreshData = {};
        this.storeRefreshData.itemArray=[];
        //this.storeData.refreshTime = 0;
        this.storeData.itemArray = [];
        this.storeData.msgId = 0;
        this.storeData.refreshCost = {};
        this.storeData.describe = "下次刷新时间";
        this.storeData.serverTime = 0;
    },

    // setStoreData: function (param) {
    //     switch (param) {
    //         case GameServerProto.PT_STORE_NORMAL:

    //             break;

    //         case GameServerProto.PT_STORE_BLACK:

    //             break;

    //         case GameServerProto.PT_STORE_TENDER:

    //             break;

    //         case GameServerProto.PT_STORE_ARENA:

    //             break;

    //         case GameServerProto.PT_STORE_MEMBER:

    //             break;

    //         case GameServerProto.PT_STORE_BOSSTOWER:

    //             break;

    //         case GameServerProto.PT_STORE_NUCLEAR:

    //             break;

    //         case GameServerProto.PT_STORE_TOWER_FLOOR:

    //             break;

    //         case GameServerProto.PT_STORE_NEBULA:

    //             break;

    //         case GameServerProto.PT_STORE_WAR:

    //             break;

    //         case GameServerProto.PT_STORE_MIBAO:

    //             break;

    //         case GameServerProto.PT_STORE_VIP:

    //             break;
    //     }
    // },
    
    // 根据msgID的不同对收到的ack数据分类，方便扩展成各种商店
    saveData: function (msgId, data) {         
        if (data.data.ErrCode !== GameServerProto.PTERR_SUCCESS){
            GlobalVar.comMsg.errorWarning(data.data.ErrCode);
            return;
        }

        if (msgId == GameServerProto.GMID_STORE_DATA_ACK) {
            if (data.data.Type == GameServerProto.PT_STORE_NORMAL) {
                this.setDataByGMID_STORE_DATA_ACK(msgId, data.data);
            } else if (data.data.Type == GameServerProto.PT_STORE_MEMBER) {
                this.storeData.type = GameServerProto.PT_STORE_MEMBER;
                GlobalVar.handlerManager().memberHandler.recvMemberStoreData(msgId, data);
                return
            } else if (data.data.Type == GameServerProto.PT_STORE_ARENA) {
                this.storeData.type = GameServerProto.PT_STORE_ARENA;
                GlobalVar.handlerManager().arenaHandler._recvArenaStoreAck(msgId, data);
                return;
            }
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_STORE_DATA_NTF, this.storeData);
        // switch (msgId) {
        //     case GameServerProto.GMID_STORE_DATA_ACK:
        //         this.setDataByGMID_STORE_DATA_ACK(msgId, data.data);
        //         break;

        //     case GameServerProto.GMID_STORE_REFRESH_ACK:
        //         break;
        //     default: break;
        // }
        // GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_STORE_DATA_NTF, this.storeData);
    },

    saveBuyData: function (msgId, data) {
        if (data.data.ErrCode !== GameServerProto.PTERR_SUCCESS)
        {
            if (data.data.ErrCode == GameServerProto.PTERR_DIAMOND_LACK){
                CommonWnd.showNormalFreeGetWnd(data.data.ErrCode);
            } else if (data.data.ErrCode == GameServerProto.PTERR_PIECE_CRYSTAL_LACK) { 
                GlobalVar.handlerManager().memberHandler.recvBuyAck(msgId, data);
            }else{
                GlobalVar.comMsg.errorWarning(data.data.ErrCode);
            }
            return;
        }

        if (msgId == GameServerProto.GMID_STORE_BUY_ACK) {
            if (data.data.Type == GameServerProto.PT_STORE_NORMAL) {
                this.setDataByGMID_STORE_BUY_ACK(msgId, data.data);
            } else if (data.data.Type == GameServerProto.PT_STORE_MEMBER) {
                GlobalVar.handlerManager().memberHandler.recvBuyAck(msgId, data);
                return;
            } else if (data.data.Type == GameServerProto.PT_STORE_ARENA) {
                this.storeData.type = GameServerProto.PT_STORE_ARENA;
                GlobalVar.handlerManager().arenaHandler._recvArenaStoreBuyAck(msgId, data);
                return;
            }
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_STORE_BUY_NTF, this.storeBuyData);
    },

    saveRefreshData: function (msgId, data) {
        if (data.data.ErrCode !== GameServerProto.PTERR_SUCCESS)
        {
            if (data.data.ErrCode == GameServerProto.PTERR_DIAMOND_LACK){
                CommonWnd.showNormalFreeGetWnd(data.data.ErrCode);
            }else {
                GlobalVar.comMsg.errorWarning(data.data.ErrCode);
            }
            return;
        }
        if (data.data.Type == GameServerProto.PT_STORE_MEMBER) {
            GlobalVar.handlerManager().memberHandler.recvFreshAck(msgId, data);
            return;
        }else if (data.data.Type == GameServerProto.PT_STORE_ARENA) {
            GlobalVar.handlerManager().arenaHandler._recvArenaStoreRefreshAck(msgId, data);
            return;
        }
        var ack=data.data;
        // cc.log("存储刷新数据");
        this.storeRefreshData.refreshTimes=ack.RefreshTimes;
        this.storeRefreshData.itemArray=[];
        for (let i = 0; i < ack.Items.length; i++) {
            var item = {};
            item.itemId = ack.Items[i].ItemID;
            item.num = ack.Items[i].Count;
            item.state = ack.Items[i].State;

            item.costNum = ack.Items[i].Cost;
            item.costType = ack.Items[i].Type;
            switch (ack.Items[i].Type) {
                case GameServerProto.PT_MONEY_GOLD:
                    item.costId = GOLD_ID;
                    break;

                case GameServerProto.PT_MONEY_DIAMOND:
                    item.costId = DIAMOND_ID;
                    break;

                default:
                    break;
            }
            this.storeRefreshData.itemArray.push(item);
        }
        // cc.log(this.storeRefreshData);
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_STORE_REFRESH_NTF, this.storeRefreshData);
    },

    setDataByGMID_STORE_DATA_ACK: function (msgId, ack) {

        this.storeData.refreshTimes = ack.RefreshTimes;
        this.storeData.time = ack.Expires;
        this.storeData.msgId = msgId;
        this.storeData.serverTime = ack.ServerTime;
        this.storeData.refreshCost.itemId = 1;
        this.storeData.refreshCost.num = 1;
        this.storeData.itemArray = [];
        this.storeData.type = ack.Type;
        for (let i = 0; i < ack.Items.length; i++) {
            var item = {};
            item.itemId = ack.Items[i].ItemID;
            item.num = ack.Items[i].Count;
            item.state = ack.Items[i].State;

            item.costNum = ack.Items[i].Cost;
            item.costType = ack.Items[i].Type;
            switch (ack.Items[i].Type) {
                case GameServerProto.PT_MONEY_GOLD:
                    item.costId = GOLD_ID;
                    break;

                case GameServerProto.PT_MONEY_DIAMOND:
                    item.costId = DIAMOND_ID;
                    break;

                default:
                    break;
            }
            this.storeData.itemArray.push(item);
        }

    },

    setDataByGMID_STORE_BUY_ACK: function (msgId, ack) {
        this.storeBuyData.id = ack.ID;
        this.storeBuyData.states = ack.State;
        this.storeBuyData.type = ack.Type;

    },

    // setDataByGMID_STORE_REFRESH_ACK:function(msgId,ack){
    //     this.storeData.type=ack.Type;
    //     this.refreshTimes=ack.RefreshTimes;

    //     for (let i = 0; i < ack.Items.length; i++) {
    //         var item = {};
    //         item.itemId = ack.Items[i].ItemID;
    //         item.num = ack.Items[i].Count;
    //         item.state = ack.Items[i].State;

    //         item.costNum = ack.Items[i].Cost;
    //         switch (ack.Items[i].Type) {
    //             case GameServerProto.PT_MONEY_GOLD:
    //                 item.costId = GOLD_ID;
    //                 break;

    //             case GameServerProto.PT_MONEY_DIAMOND:
    //                 item.costId = DIAMOND_ID;
    //                 break;

    //             default:
    //                 break;
    //         }
    //         this.storeData.itemArray.push(item);
    //     }
    // },

    getStoreRefreshData: function () {



    },

    getRefreshCostPlan: function () {
        var refresh = GlobalVar.tblApi.getDataBySingleKey('TblStoreLevel', this.storeData.type);
        var refreshType;
        for (let i = 0; i < refresh.length; i++) {
            if (GlobalVar.me().level >= refresh[i].wMinLevel && GlobalVar.me().level <= refresh[i].wMaxLevel)
                refreshType = refresh[i];
        }
        var refreshPlan = GlobalVar.tblApi.getDataByMultiKey('TblRefresh', refreshType.wRefreshType, 0);
        return refreshPlan;
    },

    setStoreNtf: function(data){
        if (data.Type == GameServerProto.PT_STORE_NORMAL){
            GlobalVar.me().statFlags.StoreNormalFlag = data.StatFlag;
            GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_STORE_NORMAL_FLAG_CHANGE);
        }
    },

});

module.exports = StoreData;