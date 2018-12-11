var EventMsgID = require("eventmsgid")
var GlobalVar = require("globalvar")
const FRAMES_TTL = 300 * 60     //每x帧一次同步服务器时间

var ServerTimeService = cc.Class({
    statics: {
        instance: null,
        getInstance: function() {
            if (ServerTimeService.instance == null) {
                ServerTimeService.instance = new ServerTimeService();
            }
            return ServerTimeService.instance;
        }
    },

    ctor: function(){
        this.started = false;

        this._calibrationTimestamp = 0;
        this._localTimestamp = 0;
        this._lastSendFrameTTL = 0;
        
        //login_ack, entergame_ack, ping_ack中带有时间戳，需要校准时间
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_LOGIN_UPDATE, this._calibration, this);
    },

    setServerTimestamp: function(tServerTimestamp) {
	    this._calibrationTimestamp = tServerTimestamp;
	    this._localTimestamp = this.getCurTimestamp() / 1000;
    },

    getCurServerTimestamp: function() {
	    return this._calibrationTimestamp + this.getCurTimestamp()/1000 - this._localTimestamp;
    },

    getCurTimestamp: function() {
        return new Date().getTime();		//自1970年1月1号以来过去的毫秒数
    },

    _calibration: function(data) {
        if (!!!data || typeof data != "object") {
            return;
        }

        if (!!data.timestamp) {
            this.setServerTimestamp(data.timestamp);
            GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_SVRTIME_CHANGE, null);
        }
    },

    start: function() {
        this.started = true;
    },

    stop: function() {
        this.started = false;
    },

    update: function() {
        if (this.started == false) return;
        if (this._lastSendFrameTTL <= 0) {
            this._sendGetServerTime();
        }

        this._lastSendFrameTTL--;
    },

    _sendGetServerTime: function() {
        GlobalVar.handlerManager().coreHandler.sendGetServerTime();
        this._lastSendFrameTTL = FRAMES_TTL;
    }
});

module.exports = ServerTimeService;
