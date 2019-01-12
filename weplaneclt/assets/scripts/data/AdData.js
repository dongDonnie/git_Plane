/**
 * 处理广告相关的数据(积分墙，抽屉广告和gif悬浮广告)
 */
const weChatAPI = require("weChatAPI");
const StoreageData = require("storagedata");
const EventMsgID = require("eventmsgid");
const GlobalVar = require('globalvar');

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
    },

    setAdExpData: function (data) {
        self._adexp = data;
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_REFRESH_AD_EXP_DATA, data);
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
        self._taskData = data;
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

    pullADTaskRwdInfo: function () {
        let successCallback = (data) => {
            console.log("getADTaskInfo success data:", data);
            if (data && data.taskList) {
                self.setTaskData(data.taskList);
            }
        }
        let failCallback = (res) => {
            console.log('getADTaskInfo fail res:', res);
        }
    },

    setReceiveTask: function (data) {

    },

    setResFileMap: function (url, obj) {
        if (self._resFileMap === null) self.getResFile("");
        self._resFileMap[url] = obj;
        self.saveResFileMap();
    },

    saveResFileMap: function () {
        StoreageData.setResFileMap(StoredData.Type.ResFileMap, self._resFileMap);
    },

    getResFile: function (url) {
        if (self._resFileMap === null) {
            self._resFileMap = self.getStorageSync(StoredData.Type.ResFileMap);
            self._resFileMap = (self._resFileMap !== null) ? self._resFileMap : {};
        }
        return self._resFileMap[url] !== null ? self._resFileMap[url] : {};
    },

    getStorageSync: function (key) {
        let data = StoreageData.getResFileMap(key);
        if (data) return JSON.parse(data);
    },

    setSpriteFrameMap: function (key, val) {
        self._spriteFrameMap[key] = val;
    },

    getSpriteFrame: function (remoteUrl) {
        return self._spriteFrameMap[remoteUrl] ? self.spriteFrameMap[remoteUrl].clone() : null;
    },
});

module.exports = AdData;