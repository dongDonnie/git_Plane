//const Utils = require("utils");

var self = null;
var GameTimer = cc.Class({
    extends: cc.Component,


    ctor: function () {
        self = this;
        self.timerMgrList = {};
        let date = new Date();
        self._startTime = date.getTime();
        //self._startTime = Utils.getTimestamp();
    },

    statics: {
        instance: null,
        timerDynamicId: 1,
        getInstance: function() {
            if (GameTimer.instance == null) {
                GameTimer.instance = new GameTimer();
            }
            return GameTimer.instance;
        },
        destroyInstance: function() {
            if (GameTimer.instance != null) {
                delete GameTimer.instance;
                GameTimer.instance = null;
            }
        }
    },

    //创建一个定时器，每time秒执行一次
    startTimer: function (callback, time, delay) {
        delay = typeof delay !== 'undefined' ? delay : 0;
        self.schedule(callback, time, cc.macro.REPEAT_FOREVER, delay);
        //将定时器加入到集合统一管理
        GameTimer.timerDynamicId = GameTimer.timerDynamicId + 1;
        self.timerMgrList[GameTimer.timerDynamicId] = {
            id: GameTimer.timerDynamicId,
            callback: callback
        };
        return GameTimer.timerDynamicId;
    },
    
    //创建一个time秒后只执行一次的定时器
    startTimerOnce: function (callback, time) {
        self.scheduleOnce(callback, time);
        //将定时器加入到集合统一管理
        GameTimer.timerDynamicId = GameTimer.timerDynamicId + 1;
        self.timerMgrList[GameTimer.timerDynamicId] = {
            id: GameTimer.timerDynamicId,
            callback: callback
        };
        return GameTimer.timerDynamicId;
    },

    // 创建一个更灵活的定时器
    // time： 以秒为单位的时间间隔
    // repeat: 重复次数
    // delay: 延时多久后开始执行
    startTimerQuick: function (callback, time, repeat, delay) {
        self.scheduleOnce(callback, time, repeat, delay);
        //将定时器加入到集合统一管理
        GameTimer.timerDynamicId = GameTimer.timerDynamicId + 1;
        self.timerMgrList[timerDynamicId] = {
            id: GameTimer.timerDynamicId,
            callback: callback
        };
        return GameTimer.timerDynamicId;
    },

    //删除一个定时器
    delTimer: function (timerId) {
        if(timerId > 0) {
            let timer = self.timerMgrList[timerId];
            if(!!timer) {
                self.unschedule(timer.callback);
                delete self.timerMgrList[timerId];
            }
        }
    },

    //删除所有定时器
    delAllTimer: function () {
        for (let key in self.timerMgrList) {
            let timer = self.timerMgrList[key];
            if(!!timer) {
                self.unschedule(timer.callback);
            }
            delete self.timerMgrList[key];
        }
        self.timerMgrList = {};
        GameTimer.timerDynamicId = 0;
    },

    //得到游戏启动过去的时间ms
    getTimeFromStartup: function() {
        let date = new Date();
        return date.getTime() - self._startTime;
        //return Utils.getTimestamp() - self._startTime;
    },

    //得到时间戳
    getTime: function() {
        let data=new Data();
        return data.getTime();
        //return Utils.getTimestamp();
    },

});