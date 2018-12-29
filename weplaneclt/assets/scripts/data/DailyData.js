/**
 * 处理与公告相关的信息，讲其转换为数据
 */

const GlobalVar = require('globalvar');
const EventMsgID = require("eventmsgid");
var GameServerProto = require("GameServerProto");

var self = null;
var dailyData = cc.Class({

    properties: {
        data: null,
    },
    ctor: function() {
        self = this;
        self.token = "";
        self.data = {};
        self.newTaskData = {};
    },
    setData: function(data){
        self.data = data;
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GETDAILY_DATA, data.ErrCode);
    },
    setNewTaskData: function(data){
        self.newTaskData = data;
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_NEWTASK_NTF, data);
    },
    getDailyStepsByID(id){
        let dailys = self.data.Daily
        for(let i = 0; i< dailys.length; i++){
            if (dailys[i].ID == id){
                return dailys[i].Var;
            }
        }
    },
    getDailyStateByID(id){
        let dailys = self.data.Daily;
        for(let i = 0; i<dailys.length; i++){
            if (dailys[i].ID == id){
                return dailys[i].State;
            }
        }
    },
    getActive: function(){
        let active = self.data.Active;
        return active;
    },
    getNewTaskData: function(){
        return self.newTaskData;
    },
    isActiveRewardReceived: function(active){
        if (self.data.ActiveReward){
            let index = self.data.ActiveReward.indexOf(parseInt(active));
            if (index != -1){
                return true;
            }
        }
        return false;
    },
    setActiveRewardData: function(data){
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            self.data.ActiveReward = data.ActiveReward;
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GETDAILY_ACTIVE_REWARD, data);
    },
    setMisstionRewardData: function(data){
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            self.data.Daily = data.Daily;
            self.data.Active = data.Active;
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GETDAILY_REAWRD, data);
    },
    setNewTaskRewardData: function(data){
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            self.newTaskData = data.NewTaskBag;
            GlobalVar.me().bagData.updateItemDataByGMDT_ITEM_CHANGE(data.ItemChange);
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_NEWTASK_REWARD, data);
    },
    
    setDailyFlagNtf: function(data){
        GlobalVar.me().statFlags.DailyFlag = data.StatFlag;
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_DAILY_FLAG_CHANGE);
    },
});

module.exports = dailyData;