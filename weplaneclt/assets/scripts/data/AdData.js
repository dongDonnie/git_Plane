/**
 * 处理广告相关的数据(积分墙，抽屉广告和gif悬浮广告)
 */
const weChatAPI = require("weChatAPI");
const EventMsgID = require("eventmsgid");
const GlobalVar = require('globalvar');
const GameServerProto = require("GameServerProto");
const CommonWnd = require("CommonWnd");

var self = null;

var AdData = cc.Class({

    properties: {
        data: null,
    },

    ctor: function () {
        self = this;
        self.data = {};
        self._framesAd = [];  //悬浮广告
        self._bigFramesAd = []; // 大的序列帧动画
        self._frameIdx = 0;
        self._spriteFrameMap = {};//key:url, value: cc.spriteFrame
        self._resFileMap = null;
        self._adexp = null;    // 抽屉广告

        self._taskData = null; // 积分墙广告
        self._taskComplete = [];
        self._taskReward = [];
        self._taskHotFlag = false;
        self.taskSec = 30; //游戏试玩默认时间
    },

    getTaskDefaultSec: function () {
        return self.taskSec;
    },

    setAdTaskRewardData: function (data) {
        if (data && data.TestPlayReward) {
            self._taskReward = data.TestPlayReward;
        }
    },

    setAdExpData: function (data) {
        self._adexp = data;
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_REFRESH_AD_EXP_DATA, data);
    },

    pullInfo: function () {
        self.pullAdExpInfo();
        self.pullAdFramesInfo();
        self.pullADTaskInfo();
        self.pullADTaskCompleteInfo();
    },

    getAdExpInfo: function () {
        return self._adexp;
    },

    pullAdExpInfo: function () {
        let successCallback = (data) => {
            console.log("getAdexpInfo success data:", data);
            if (data && data.adexpList) {
                self.setAdExpData(data.adexpList);
            }
        }
        let failCallback = (res) => {
            console.log('getAdexpInfo fail:', res);
        }
        weChatAPI.pullAdcExpInfo(successCallback, failCallback);
    },

    getRemoteSpFrameAd: function () {
        let ans = null;
        let len = self._framesAd.length;
        if (len > 0) {
            let idx = self._frameIdx % len;
            ans = self._framesAd[idx];
            self._frameIdx += 1;
        }
        return ans;
    },

    pullAdFramesInfo: function () {
        let successCallback = (data) => {
            console.log("getAdFramesInfo success data:", data);
            if (data) {
                if (Array.isArray(data.adFrames)) {
                    self.setAdFrames(data.adFrames);
                }
                if (Array.isArray(data.adSequences)) {
                    self.setAdFramesBig(data.adSequences);
                }
            }
        }
        let failCallback = (res) => {
            console.log('getAdFramesInfo fail:', res);
        }
        weChatAPI.pullAdcFrameInfo(successCallback, failCallback);
    },

    setAdFrames: function (data) {
        self._framesAd = data;
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_REFRESH_AD_SP_DATA, data);
    },

    setAdFramesBig: function (data) {
        self._bigFramesAd = data;
    },

    setTaskData: function (data) {
        data.forEach((child) => {
            if (child.tskid) {
                child.tskid = parseInt(child.tskid);
            }
        });
        self._taskData = data;
        self.refreshTaskHotFlag();
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_REFRESH_AD_TASK_DATA, data);
    },

    getTaskData: function (data) {
        return self._taskData;
    },

    pullADTaskInfo: function () {
        let successCallback = (data) => {
            console.log("getADTaskInfo success data:", data);
            if (data && data.taskList) {
                self.setTaskData(data.taskList);
            }
        }
        let failCallback = (res) => {
            console.log('getADTaskInfo fail res:', res);
        }
        weChatAPI.pullAdcTaskInfo(successCallback, failCallback);
    },

    pullADTaskCompleteInfo: function () {
        let successCallback = (data) => {
            console.log("getADTaskCompleteInfo success data:", data);
            if (data && data.tskList) {
                self.setCompleteTask(data.tskList);
            }
        };
        let failCallback = () => {
            console.log('getADTaskCompleteInfo fail res:', res);
        };
        weChatAPI.pullAdcTaskCompleteList(successCallback, failCallback);
    },

    setCompleteTask: function (data) {
        for (let i = 0; i < data.length; i++) {
            data[i] = parseInt(data[i]);
        }
        self._taskComplete = data;
    },

    addCompleteTask: function (id) {
        let successCallback = () => {
            self._taskComplete.push(id);
            console.log("addCompleteTask success id:", id);
            GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_REFRESH_AD_TASK_COMPLETE_DATA, id);
        }
        let failCallback = (res) => {
            console.log('addCompleteTask fail res:', res);
        }
        weChatAPI.pushAdcTaskCompleteInfo(id, successCallback, failCallback);
    },

    hasCompleteTask: function (id) {
        return self._taskComplete.indexOf(id) != -1;
    },

    setAdRewardAck: function (data) {
        if (data.ErrCode === GameServerProto.PTERR_SUCCESS) {
            if (data.GetDiamond > 0) {
                let shareGetItem = [
                    {
                        wItemID: GameServerProto.PT_ITEMID_DIAMOND_1,
                        nCount: data.GetDiamond,
                    }
                ];
                CommonWnd.showTreasureExploit(shareGetItem);
            }
            this.setRewardTask(data.TestPlayReward);
        } else {
            console.log('setAdReward ERROR, errCode:', data.ErrCode);
        }
    },

    setRewardTask: function (data) {
        self._taskReward = data;
        self.refreshTaskHotFlag();
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_REFRESH_AD_TASK_REWARD_DATA, data);
    },

    hasRewardTask: function (id) {
        return self._taskReward.indexOf(id) != -1;
    },

    refreshTaskHotFlag: function () {
        self._taskHotFlag = false;
        if (self._taskData) {
            if (self._taskData.length > 0) {
                for (let i = 0; i < self._taskData.length; i++) {
                    let id = self._taskData[i].tskid;
                    if (!self.hasRewardTask(id)) {
                        self._taskHotFlag = true;
                        break;
                    }
                }
            } else {
                self._taskHotFlag = true;
            }
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_REFRESH_AD_TASK_HOT_FLAG, self._taskHotFlag);
    },

    getTaskHotFlag: function () {
        return self._taskHotFlag;
    }

});

module.exports = AdData;