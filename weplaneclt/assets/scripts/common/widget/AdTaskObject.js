const GlobalVar = require("globalvar");
const weChatAPI = require('weChatAPI');
const GameServerProto = require("GameServerProto");
const EventMsgID = require("eventmsgid");

cc.Class({
    extends: cc.Component,

    properties: {
        icon: cc.Sprite,
        title: cc.Label,
        desc: cc.Label,
        rewardNum: cc.Label,
        btnTry: cc.Node,
        btnStart: cc.Node,
        btnReceive: cc.Node,

        rewardBefore: cc.Node,
        rewardNo: cc.Node,
    },

    onLoad: function () {
        this.rewardNum.string = '+' + GlobalVar.tblApi.getDataBySingleKey('TblParam', GameServerProto.PTPARAM_FULI_GC_TESTPLAY_REWARD_DIAMOND).dValue;
    },

    onEnable: function () {
        this.registerEvent();
    },

    onDisable: function () {
        GlobalVar.eventManager().removeListenerWithTarget(this);
    },

    registerEvent: function () {
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_REFRESH_AD_TASK_REWARD_DATA, this.refreshState, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_REFRESH_AD_TASK_COMPLETE_DATA, this.refreshState, this);
    },

    show: function (task) {
        let self = this;
        this._task = task;
        cc.loader.load(task.icon, (err, texture) => {
            if (err) {
                console.log('AdTaskObject icon load fail, url:', task.icon);
            } else {
                self.icon.spriteFrame = new cc.SpriteFrame(texture);
            }
        });
        this.title.string = task.name;
        this.desc.string = task.desc;
        this.refreshState();
    },

    refreshState: function () {
        if (GlobalVar.me().adData.hasRewardTask(this._task.tskid)) {
            this.stateStart();
        } else if (GlobalVar.me().adData.hasCompleteTask(this._task.tskid)) {
            this.stateReceive();
        } else {
            this.stateTry();
        }
    },

    stateTry: function () {
        this.btnTry.active = true;
        this.btnStart.active = false;
        this.btnReceive.active = false;

        this.rewardBefore.active = false;
        this.rewardNo.active = true;
    },

    stateStart: function () {
        this.btnTry.active = false;
        this.btnStart.active = true;
        this.btnReceive.active = false;

        this.rewardBefore.active = true;
        this.rewardNo.active = false;
    },

    stateReceive: function () {
        this.btnTry.active = false;
        this.btnStart.active = false;
        this.btnReceive.active = true;

        this.rewardBefore.active = false;
        this.rewardNo.active = true;
    },

    goToMiniProgram: function (successCB, failCB, completeCB) {
        let appid = this._task.jmpid;
        let parm = this._task.parm;
        let tskid = this._task.tskid;
        let url = this._task.taskCodeUrl;
        if (appid) {
            weChatAPI.taskGoToMiniProgram(appid, parm, tskid, successCB, failCB, completeCB);
        } else {
            weChatAPI.previewUrlImage(url, successCB, failCB, completeCB);
        }
    },

    onTry: function () {
        let needTryTime = !this._task.taskSec ? GlobalVar.me().adData.getTaskDefaultSec() : parseInt(this._task.taskSec);
        let timeStamp = new Date().getTime();
        let successCB = () => {
            let showCB = () => {
                let nowTime = new Date().getTime();
                if ((nowTime - timeStamp) / 1000 >= needTryTime) {
                    GlobalVar.me().adData.addCompleteTask(this._task.tskid);
                } else {
                    wx.showModal({
                        title: "提示",
                        content: "体验时间不足"
                    });
                }
                wx.offShow(showCB);
            };
            wx.onShow(showCB);
        };
        let failCB = () => { };
        let completeCB = () => { };
        this.goToMiniProgram(successCB, failCB, completeCB);
    },

    onStart: function () {
        let successCB = () => { };
        let failCB = () => { };
        let completeCB = () => { };
        this.goToMiniProgram(successCB, failCB, completeCB);
    },

    onReceive: function () {
        GlobalVar.handlerManager().adHandler.sendTestPlayRewardReq(this._task.tskid);
    },

});
