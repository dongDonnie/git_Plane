//var utils = require("utils")

var self = null;
var ServerTime = cc.Class({
    ctor: function () {
        self = this;
        self._zone = 8; // 默认服务器时区,北京时区
        self._diff = 0; // 客户端时区比服务器时区快了多少秒
        self._t = self.getCurrentTime(); // 时间戳
        self._lastSetTime = self.getCurrentTime(); // 最后一次setTime时, 本地时间点
    },

    getCurrentTime: function () {
        var date = new Date();
        return Math.floor(date.getTime() / 1000);
        //return Math.floor(utils.getTimestamp() /1000);
    },

    getTimeStringForActive: function (t) {
        let localdate = self.getDateObject(t);

        let month = localdate.getMonth().toString();
        let day = localdate.getDate().toString();
        let hour = localdate.getHours().toString();
        let minute = localdate.getMinutes().toString();
        month = parseInt(month) + 1
        if (month.length == 1) month = "0" + month;
        if (day.length == 1) day = "0" + day;
        if (hour.length == 1) hour = "0" + hour;
        if (minute.length == 1) minute = "0" + minute;

        return month + "-" + day + " " + hour + ":" + minute;
    },

    //计算本地时区比UTC0快了多少秒
    get_timezone: function () {
        var offset = (new Date()).getTimezoneOffset() * 60;
        return -offset;
    },

    setTime: function (t, zone) {
        self._t = t;
        self._zone = zone;
        self._lastSetTime = self.getCurrentTime();

        self._diff = self.get_timezone() - zone * 3600;
    },

    //获取当前的服务器时间戳
    getTime: function () {
        var elapsed = self.getCurrentTime() - self._lastSetTime;
        return self._t + elapsed;
    },

    getDateObject: function (t) {
        if (t == null) {
            t = self.getTime();
        }
        //需要根据时区计算
        var localdate = new Date(t - self._diff);

        return localdate;
    },

    //获取当前时间对应的服务器日期
    getDate: function (t) {

        var localdate = self.getDateObject(t);

        var year = localdate.getFullYear();
        var month = localdate.getMonth();
        var day = localdate.getDate();
        return year + "-" + month + "-" + day;
    },

    getLogicDateObject: function (t) {
        if (t == nil) {
            t = self.getTime();
        }
        //需要根据时区计算，并减去5小时
        var hour5 = 5 * 3600;
        var localdate = new Date(t - self._diff - hour5);

        return localdate;
    },

    //获取当前时间对应的服务器日期(5点跨天)
    getLogicDate: function (t) {

        var localdate = self.getLogicDateObject(t);

        var year = localdate.getFullYear();
        var month = localdate.getMonth();
        var day = localdate.getDate();
        return year + "-" + month + "-" + day;
    },

    //获取时间戳t对应的服务器时间的字符串
    getTimeString: function (t) {
        if (t == null) {
            t = self.getTime();
        }
        //需要根据时区计算
        var localdate = new Date(t - self._diff);

        var year = localdate.getFullYear();
        var month = localdate.getMonth();
        var day = localdate.getDate();
        var hour = localdate.getHours();
        var min = localdate.getMinutes();
        var sec = localdate.getSeconds();
        return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
    },

    //计算时间戳t还有多少秒
    //如果t已经过去了,那么返回负数
    getLeftSeconds: function (t) {
        var nowTime = self.getTime();
        return t - nowTime;
    },

    //计算时间戳t还有多少秒, 并返回一个时间字符串
    //如果t已经过去了,那么返回 "-"
    //不用天数计算
    getLeftSecondsString: function (t) {
        var values = self.getLeftTimeParts(t);
        var day = values[0],
            hour = values[1],
            minute = values[2],
            second = values[3];
        if ((day + hour + minute + second) == 0) {
            //结束了
            return "-";
        } else {
            hour = day * 24 + hour;
            return hour + ":" + minute + ":" + second;
        }
    },

    getLeftTimeParts: function (t) {
        var timeLeft = self.getLeftSeconds(t);
        if (timeLeft < 0) {
            return [0, 0, 0, 0];
        } else {
            var hour = (timeLeft - timeLeft % 3600) / 3600;
            var day = (hour - hour % 24) / 24;
            var minute = (timeLeft - hour * 3600 - timeLeft % 60) / 60;

            hour = hour % 24;
            var second = timeLeft % 60;

            return [day, hour, minute, second];
        }
    },

    //获取当前离24:00:00点的seconds
    getCurrentDayLeftSceonds: function () {
        var nowTime = self.getTime();
        var tab = new Date(nowTime);
        return 24 * 3600 - tab.getHours() * 3600 - tab.getMinutes() * 60 - tab.getSeconds();
    },

    //倒计时 秒->toString ,不含天数
    secondToString: function (t) {
        var hour = (t - t % 3600) / 3600;
        var minute = (t - hour * 3600 - t % 60) / 60;
        var second = t % 60;

        var text = "";

        if (hour < 10) {
            text = text + "0" + hour + ":";
        } else {
            text = text + hour + ":";
        }

        if (minute < 10) {
            text = text + "0" + minute + ":";
        } else {
            text = text + minute + ":";
        }

        if (second < 10) {
            text = text + "0" + second;
        } else {
            text = text + second;
        }
        return text;
    },

    getCurrentHHMMSS: function (t) {
        var localdate = self.getDateObject(t);

        var year = localdate.getFullYear();
        var month = localdate.getMonth();
        var day = localdate.getDate();
        var hour = localdate.getHours();
        var min = localdate.getMinutes();
        var sec = localdate.getSeconds();

        return [hour, min, sec];
    },

    //比较t跟今天零点相差的秒数, 如果是今天之前的t,那么返回负数
    secondsFromToday: function (t) {
        //首先需要知道今天的零点的那个t1
        var now = self.getTime();
        var date = self.getDateObject(now);
        //t1是今天0点
        var t1 = now - date.getHours() * 3600 - date.getMinutes() * 60 - date.getSeconds();
        return t - t1;
    },

    //该时间戳t是否在今天之前
    isBeforeToday: function (t) {
        var distance = self.secondsFromToday(t);

        if (distance < 0) {
            return true;
        }
        return false;
    },

    //比较t跟今天5点相差的秒数, 如果是今天5点之前的t,那么返回负数
    secondsFromLogicToday: function (t) {
        //首先需要知道今天的5点的那个t1
        var now = self.getTime();
        var date = self.getLogicDateObject(now);
        //t1是今天5点
        var t1 = now - date.getHours() * 3600 - date.getMinutes() * 60 - date.getSeconds();
        return t - t1;
    },

    //该时间戳t是否在今天(逻辑天，5点跨天)之前
    isBeforeLogicToday: function (t) {
        var distance = self.secondsFromLogicToday(t);

        if (distance < 0) {
            return true;
        }
        return false;
    }

});

module.exports = ServerTime;