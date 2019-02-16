/**
 * 处理与公告相关的信息，讲其转换为数据
 */

const GlobalVar = require('globalvar');
const EventMsgID = require("eventmsgid");
var GameServerProto = require("GameServerProto");

var self = null;
var achieveData = cc.Class({

    properties: {
        data: null,
    },
    ctor: function() {
        self = this;
        self.token = "";
        self.data = {};
    },
    setAchieveData: function(data){
        self.data = data;
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_ACHIEVE_DATA, data);
    },

    setAchieveRewardData: function (data) {
        
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_ACHIEVE_REWARD, data);
    },

    setAchieveNtf: function (data) {
        
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_ACHIEVE_NTF, data);
    },

    getAchieveStepBySid: function (sid) {
        let achieveData = self.data.Achieve;
        for (let i = 0; i < achieveData.length; i++){
            if (achieveData[i].SID == sid){
                return achieveData[i].Step;
            }
        }
        return -1;
    },

    getCurStep: function (id) {
        return self.data.RewardDiamond;
    },

    getAchieveValueBySid: function (sid) {
        let achieveData = self.data.Achieve;
        for (let i = 0; i < achieveData.length; i++){
            if (achieveData[i].SID == sid){
                return achieveData[i].Var;
            }
        }
        return -1;
    },
});

module.exports = achieveData;