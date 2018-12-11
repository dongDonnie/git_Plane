
var GlobalVar = require("globalvar")
var EventMsgID = require("eventmsgid")
var NetRequest = require("netrequest")

var self = null;
var RequestService = cc.Class({
    statics: {
        instance: null,
        getInstance: function () {
            if (RequestService.instance == null) {
                RequestService.instance = new RequestService();
            }
            return RequestService.instance;
        },
        destroyInstance() {
            if (RequestService.instance != null) {
                delete RequestService.instance;
                RequestService.instance = null;
            }
        }
    },

    ctor: function () {
        self = this;
        self._requestList = [];
        self._cacheRequestList = [];
        GlobalVar.networkManager().setHookHandler(function (msgId, msg) {
            self._onNetReceiveEvent(msgId, msg);
        });
    },

    update: function () {
        if (GlobalVar.networkManager().connected) {
            //check timeout
            let timeout = false;
            let tick = Date.now();
            for (let key in self._requestList) {
                let request = self._requestList[key];
                if (request.isTimeout(tick)) {
                    timeout = true;
                    break;
                }
            }

            if (timeout) {
                GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_NETWORK_TIMEOUT, null, null);
            }
        }
    },

    hasRequestInQueue: function (id) {
        let finded = false;
        for (let i in self._requestList) {
            let request = self._requestList[i];
            let id2 = request.getId();
            if (id2 == id) {
                finded = true;
                break;
            }
        }

        return finded;
    },

    addRequest: function (id, msg) {
        let request = new NetRequest(id, msg);
        if (!GlobalVar.networkManager().connected) {
            self._addCacheRequest(request);
        } else {
            self._requestList.push(request);
        }

        self.sendAll();

        GlobalVar.networkManager().checkConnection();
    },

    sendAll: function () {
        if (!GlobalVar.networkManager().connected) {
            return false;
        }

        for (let i in self._requestList) {
            let request = self._requestList[i];
            if (!request.isSent()) {
                if(GlobalVar.networkManager().send(request.sendStandBy())){
                    request.sendComplete();
                }
            }
        }

        self._checkWaiting();
        return true;
    },

    _onNetReceiveEvent: function (msgId, content) {
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_NETWORK_ALIVE, null);
        for (let i = 0; i < self._requestList.length; i++) {
            let request = self._requestList[i];
            if (request.isSent()) {
                if (request.checkResponse(msgId)) {
                    self._requestList.splice(i, 1);
                    break;
                }
            }
        }

        self._checkWaiting();
    },

    _checkWaiting: function () {
        self._showLoading(self.hasWaiting());
    },

    hasWaiting: function () {
        let waiting = false;
        for (let i = 0; i < self._requestList.length; i++) {
            let request = self._requestList[i];
            if (request.isWaiting()) {
                let id = request.getId();
                waiting = true;
                break;
            }
        }

        return waiting;
    },

    _showLoading: function (b) {            
        GlobalVar.netWaiting().showWaiting(b);
    },

    _addCacheRequest: function (request) {
        let id = request.getId();
        self._cacheRequestList.push(request);
    },

    onDisconnected: function () {
        for (let i in self._requestList) {
            let request = self._requestList[i];
            if (!request.isSent()) {
                self._addCacheRequest(request);
            }
        }
        self._requestList = [];
        self._checkWaiting();
    },

    onLoginedGame: function () {
        for (let i in self._cacheRequestList) {
            let request = self._cacheRequestList[i];
            self._requestList.push(request);
        }
        self._cacheRequestList = [];

        self.sendAll();
    },

    clear: function () {
        self._requestList = [];
        self._cacheRequestList = [];
    }
});
