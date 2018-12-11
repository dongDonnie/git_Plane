const GameServerProto = require("GameServerProto");

var self = null;
var HandlerManager = cc.Class({
    statics: {
        instance: null,
        getInstance: function () {
            if (HandlerManager.instance == null) {
                HandlerManager.instance = new HandlerManager();
            }
            return HandlerManager.instance;
        },
        destroyInstance() {
            if (HandlerManager.instance != null) {
                delete HandlerManager.instance;
                HandlerManager.instance = null;
            }
        },
    },


    ctor: function () {
        self = this;
        self._monitorProtocals = {};
        self._handlers = {};
        self.ackToReqMap = {};

        self._initHandlers();

    },

    _createHandler: function (handlerClass) {
        var __class = require(handlerClass);
        var handler = new __class;
        handler.initHandler(this);

        self._handlers[handlerClass] = handler;
        return handler;
    },

    _initHandlers: function () {
        self.loginHandler = self._createHandler("LoginHandler");
        self.coreHandler = self._createHandler("corehandler");
        self.storeHandler = self._createHandler("StoreHandler");

        self.bagHandler = self._createHandler("BagHandler");
        self.memberHandler=self._createHandler("MemberHandler");
        self.gmCmdHandler = self._createHandler("GmCmdHandler");
        self.limitStoreHandler = self._createHandler("LimitStoreHandler");
        self.guazaiHandler = self._createHandler("GuazaiHandler");
        
        self.mainHandler = self._createHandler("MainHandler");
        self.drawHandler = self._createHandler("DrawHandler")
        self.mailHandler = self._createHandler("MailHandler");
        self.noticeHandler = self._createHandler("NoticeHandler");
        self.endlessHandler = self._createHandler("EndlessHandler");
        self.meHandler = self._createHandler("meHandler");
        self.spHandler = self._createHandler("SpHandler");
        self.rechargeHandler = self._createHandler("RechargeHandler");
        self.feedbackHandler = self._createHandler("FeedbackHandler");
        self.campHandler = self._createHandler("CampHandler");
        self.dailyHandler = self._createHandler("DailyHandler");
        self.activeHandler = self._createHandler("ActiveHandler");
        self.shareHandler = self._createHandler("ShareHandler");
    },

    unInitHandlers: function () {
        for (var k in self._handlers) {
            var handler = self._handlers[k];
            handler.unInitHandler();
        }
    },

    clearHandlers: function () {
        var GlobalVar = require("globalvar")

        if (GlobalVar.messageDispatcher) {
            GlobalVar.messageDispatcher.clearMsg();
        }

        for (var k in self._handlers) {
            self[k] = null;
        }
        self._handlers = {};
    },

    setKey: function (ack, req) {
        // cc.log("ack"+ack);
        // cc.log("req"+req);
        self.ackToReqMap[ack] = req;
    },

    getKey: function (key) {
        if (self.ackToReqMap[key])
            return self.ackToReqMap[key];
        return null;
    },
});

module.exports = HandlerManager;