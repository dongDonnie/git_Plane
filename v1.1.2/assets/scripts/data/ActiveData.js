
const GlobalVar = require('globalvar');
const EventMsgID = require("eventmsgid");
const GameServerProto = require("GameServerProto");

var self = null;
var actveData = cc.Class({

    properties: {
        data: null,
    },

    ctor: function() {
        self = this;
        self.token = "";
        self.activeList = {};
        self.activeData = {};
    },

    setActiveListData: function(data){
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            self.activeList[data.Type] = data.ActList;
            self.activeData = {};
            // for(let i = 0; i< self.activeList[data.Type].length; i++){
            //     GlobalVar.handlerManager().activeHandler.sendGetActiveDataReq(self.activeList[data.Type][i].Actid);
            // }
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GETACTIVE_LIST, data.ErrCode);
    },

    getActiveListDataByType: function(type){
        return self.activeList[type] || null;
    },

    setActiveData: function(data){
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            self.activeData[data.Act.Actid] = data;
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GETACTIVE_DATA, data);
    },

    getActiveDataByActID: function(actID){
        return self.activeData[actID] || null;
    },

    setActiveFenResultData: function(data){
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            if (!!data.ItemChange){
                GlobalVar.me().bagData.updateItemDataByGMDT_ITEM_CHANGE(data.ItemChange);
            }
            if (!self.activeData[data.Actid]){
                GlobalVar.handlerManager().activeHandler.sendGetActiveDataReq(data.Actid);
                return;
            }
            self.activeData[data.Actid].Join = data.Join;
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_ACTIVE_FEN_RESULT, data);
    },
    setActiveJoinResultData: function(data){
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            if (!!data.ItemChange){
                GlobalVar.me().bagData.updateItemDataByGMDT_ITEM_CHANGE(data.ItemChange);
            }
            if (!self.activeData[data.Actid]){
                GlobalVar.handlerManager().activeHandler.sendGetActiveDataReq(data.Actid);
                return;
            }
            self.activeData[data.Actid].Join = data.Join;
            GlobalVar.me().setDiamond(data.Diamond);
            GlobalVar.me().setGold(data.Gold);
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_ACTIVE_JOIN_RESULT, data);
    },


    setActiveFlagNtf: function(data){
        GlobalVar.me().statFlags.AMSFlag = data.StatFlag;
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_ACTIVE_FLAG_CHANGE);
    },

    setActiveActFlagNtf: function(data){
        let actData = self.getActiveDataByActID(data.Actid);
        if (!actData){
            return;
        }
        let actType = actData.Act.Type;
        let actList = self.getActiveListDataByType(actType);
        for(let i =0;i<actList.length; i++){
            if (actList[i].Actid == data.Actid){
                actList[i].StatFlag = data.StatFlag;
                GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_ACTIVE_ACT_FLAG_CHANGE, data);
                break;
            }
        }
    },

    setActiveTypeActIdData: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            for (let i = 0; i< data.ActidList.length; i++){
                self.activeList[data.ActidList[i].Type] = data.ActidList[i];
            }
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_ACTIVE_TYPE_ACT_ID_DATA, data);
    },

    setActiveTreasuryData: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            if (data.ItemChange.length > 0){
                GlobalVar.me().bagData.updateItemDataByGMDT_ITEM_CHANGE(data.ItemChange);
            }
            GlobalVar.me().setDiamond(data.Diamond);
            GlobalVar.me().setGold(data.Gold);

            if (!self.activeData[data.Actid]){
                GlobalVar.handlerManager().activeHandler.sendGetActiveDataReq(data.Actid);
                return;
            }
            self.activeData[data.Actid].Join = data.Join;
            self.activeData[data.Actid].Integral = data.Integral;
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_ACTIVE_TREASURY_DATA, data);
    },

    setActiveVastData: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            if (data.ItemChange.length > 0){
                GlobalVar.me().bagData.updateItemDataByGMDT_ITEM_CHANGE(data.ItemChange);
            }
            GlobalVar.me().setDiamond(data.Diamond);
            GlobalVar.me().setGold(data.Gold);
            
            if (!self.activeData[data.Actid]){
                GlobalVar.handlerManager().activeHandler.sendGetActiveDataReq(data.Actid);
                return;
            }
            self.activeData[data.Actid].TotalJoin = data.TotalJoin;
            self.activeData[data.Actid].TotalLimit = data.TotalLimit;
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_ACTIVE_VAST_DATA, data);
    },

    setActiveRankResultData: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS) {
            this.rankResultData = data;
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_ACTIVE_RANK_RESULT, data);
    },
});

module.exports = actveData;