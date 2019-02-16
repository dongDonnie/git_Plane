const GlobalVar = require('globalvar');
const EventMsgID = require("eventmsgid");
var GameServerProto = require("GameServerProto");

var self = null;
cc.Class({

    properties: {
        data: null,
    },

    ctor: function () {
        self = this;
        self.token = "";
        self.data = {};
        self.doubleFlag = true;
        self.itemList = [];
    },

    setData: function (data, autoOpen) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS) {
            self.data = data;
        }
        if (autoOpen) {
            if (!this.isTodaySigned()) {
                GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_SIGN_DATA, data.ErrCode);
            }
        } else {
            GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_SIGN_DATA, data.ErrCode);
        }
    },

    setSignResultData: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS) {
            self.data.PassDay = data.PassDay;
            self.data.Plan = data.Plan;
            self.data.SigninState = data.SigninState;
            self.itemList = data.Item;  // ItemID, Count
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_SIGN_RESULT, data);
    },

    setSignHeapResultData: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS) {
            self.data.SigninState = data.SigninState;
            self.itemList = data.Item;  // ItemID, Count
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_SIGN_HEAP_RESULT, data);
    },

    setSignFlagNtf: function (data) {
        GlobalVar.me().statFlags.SigninFlag = data.StatFlag;
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_SIGN_FLAG_CHANGE, data);
    },

    isTodaySigned: function () {
        return this.isDaySigned(this.getToday());
    },

    isDaySigned: function (day) {
        if (self.data.SigninState && self.data.SigninState.length > 0) {
            return !!self.data.SigninState[day - 1].Signin;
        }
        return false;
    },

    isHeapRewardReceived: function (day) {
        if (self.data.SigninState && self.data.SigninState.length > 0) {
            return !!self.data.SigninState[day - 1].Heap;
        }
        return false;
    },

    getPlan: function () {
        return 1;
        return self.data.Plan ? self.data.Plan : 1;
    },

    // 获取今天
    getToday: function () {
        return this.getPassDay() + 1;
    },

    getPassDay: function () {
        return self.data.PassDay ? self.data.PassDay : 0;
    },

    // 获取已签到的天数
    getSignedDayNum: function () {
        let num = 0;
        if (self.data.SigninState) {
            for (let i = 0; i < self.data.SigninState.length; i++) {
                if (self.data.SigninState[i].Signin) num++;
            }
        }
        return num;
    },

    getSigninState: function () {
        return self.data.SigninState ? self.data.SigninState : [];
    },

    setDoubleFlag: function (flag) {
        self.doubleFlag = flag;
    },

    getDoubleFlag: function () {
        return self.doubleFlag;
    }
});
