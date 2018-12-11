var config = require('config')
var requestService = require('requestservice')
var serverTimeService = require("servertimeservice")
var GlobalVar = require("globalvar")
var EventMsgID = require("eventmsgid")
var GameServerProto = require("GameServerProto")
var ByteBuffer = require("bytebuffer");
const weChatAPI = require("weChatAPI")

var self = null;

const NetworkManager = cc.Class({

    statics: {
        instance: null,
        getInstance: function () {
            if (NetworkManager.instance == null) {
                NetworkManager.instance = new NetworkManager();
                NetworkManager.instance.registerEvent();
            }
            return NetworkManager.instance;
        },
        destroyInstance() {
            if (NetworkManager.instance != null) {
                NetworkManager.instance.unregisterEvent();
                delete NetworkManager.instance;
                NetworkManager.instance = null;
            }
        },
    },

    ctor() {
        self = this;

        this.socket = null;
        this.m_writeBuf = new ByteBuffer();
        this.m_readBuf = new ByteBuffer();

        this.connected = false;
        this.connectError = false;
        this.needReConnected = true;
        this.connectHostAddress = '';
        this.connectHostPort = 0;
        this.onConnectCallBack = null;

        this.hookHandler = null;

        this.updateTimeID = -1;
        this.heartBeatTimeID = -1;
        this.connectTimerID = -1;

        this.reconnectCount = 0;
        this.reconnectMaxCount = 3;
    },

    registerEvent() {
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_NETWORK_TIMEOUT, self._onNetworkTimeout, self);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_NETWORK_DEAD, self._onNetworkDead, self);
    },

    unregisterEvent() {
        GlobalVar.eventManager().removeListenerWithTarget(NetworkManager.instance);
    },

    init() {
        self.updateTimeID = GlobalVar.gameTimer().startTimer(function () {
            self.update();
        }, 1 / 60);
        self.heartBeatTimeID = GlobalVar.gameTimer().startTimer(function () {
            self.onHeartBeat();
        }, 10);
    },

    reset() {
        if (!!this.socket) {
            this.socket = null;
        }
        GlobalVar.gameTimer().delTimer(self.updateTimeID);
        GlobalVar.gameTimer().delTimer(self.heartBeatTimeID);
    },

    update() {
        requestService.getInstance().update();
        serverTimeService.getInstance().update();
    },

    onHeartBeat() {
        if (self.connected) {
            let msg = {
                Reply: 0,
                TimeStamp: 123,
                ServerTime: 456,
            }
            requestService.getInstance().addRequest(GameServerProto.GMID_PING, msg);
            //GlobalVar.handlerManager().meHandler.sendMsg(GameServerProto.GMID_PING, msg);
        }
    },

    connect(host, port) {
        if (!!this.socket) {
            return;
        }
        let url = (cc.sys.platform === cc.sys.WECHAT_GAME ? ('wss://' + host) : ('ws://' + host + ':' + port));

        //url='wss://weplane-s1.17fengyou.com/10005:443';
        this.reconnectCount++;

        this.socket = new WebSocket(url);
        this.socket.binaryType = 'arraybuffer';
        if (this.socket.readyState != 3) {
            this.reconnectCount = 0;
            this.socket.onopen = function (event) {
                console.log('socket open: ', event);
                GameServerProto.Init();
                self.connected = true;
                self.connectError=false;
                serverTimeService.getInstance(); //实例化服务器时间服务
                self.init();
                if (!!self.onConnectCallBack) {
                    self.onConnectCallBack();
                }
                requestService.getInstance().onLoginedGame();
            };
            this.socket.onclose = function (event) {
                console.log('socket close: ', event);
                if (self.connect) {
                    self.reset();
                }
                self.connected = false;
                requestService.getInstance().onDisconnected();
                if(self.needReConnected){
                    self.checkConnection();
                }
            };
            this.socket.onerror = function (event) {
                console.error('socket error: ', event);
                if (!self.connectError) {
                    GlobalVar.netWaiting().showWaiting(false);
                    GlobalVar.netWaiting().showReconnect(true);
                    self.reset();
                }
                self.connectError = true;
                self.connected = false;
                requestService.getInstance().onDisconnected();
            };
            this.socket.onmessage = function (event) {
                //console.log('socket message event: ', event);
                self.m_readBuf.clear();
                self.m_readBuf.append(event.data);
                self.m_readBuf.limit = self.m_readBuf.offset;
                self.m_readBuf.offset = 0;
                let msg = {};
                GameServerProto.Decode(self.m_readBuf, msg);
                if (!!self.hookHandler) {
                    self.hookHandler(msg.id, msg); //传递到requestService
                    GlobalVar.messageDispatcher.onNetMessage(msg.id, msg); //传递到分发器
                }
                //console.log('socket message data: ', msg);
            };
        } else {
            if (this.reconnectCount <= this.reconnectMaxCount) {
                this.checkConnection();
            }
        }
    },

    send(msg) {
        this.m_writeBuf.clear();
        if (GameServerProto.Encode(msg.id, msg.data, this.m_writeBuf) < 0) {
            return false;
        }
        this.m_writeBuf.limit = this.m_writeBuf.offset;
        this.m_writeBuf.offset = 0;

        if (!!this.socket) {
            this.socket.send(this.m_writeBuf.toArrayBuffer());
            return true;
        }

        return false;
    },

    showSocketState: function () {
        if (this.socket.readyState == 0) {
            //CONNECTING
            cc.log("The connection has not yet been established");
        } else if (this.socket.readyState == 1) {
            //OPEN
            cc.log("The WebSocket connection is established and communication is possible");
        } else if (this.socket.readyState == 2) {
            //CLOSING
            cc.log("The connection is going through the closing handshake");
        } else if (this.socket.readyState == 3) {
            //CLOSED
            cc.log("The connection has been closed or could not be opened");
        }
    },

    connectToServer(host, port, callback) {
        self.connectHostAddress = host;
        self.connectHostPort = port;
        if (!!callback) {
            this.onConnectCallBack = callback;
        }
        this.connect(host, port);
    },

    setOnConnectCallBack(callback) {
        if (!!callback) {
            this.onConnectCallBack = callback;
        }
    },

    setHookHandler(_hookHandler) {
        self.hookHandler = _hookHandler;
    },

    checkConnection() {
        if (self.connected) {
            return true;
        }

        if (!self.connected && self.connectTimerID == -1 && !self.connectError) {
            GlobalVar.netWaiting().showWaiting(true);
            this.connectTimerID = GlobalVar.gameTimer().startTimer(function () {
                if (!self.connected && !self.connectError) {
                    GlobalVar.gameTimer().delTimer(self.connectTimerID);
                    self.connectTimerID = -1;
                    GlobalVar.netWaiting().showWaiting(false);
                    self.connectToServer(self.connectHostAddress, self.connectHostPort);
                } else if (self.connectError) {
                    GlobalVar.gameTimer().delTimer(self.connectTimerID);
                    self.connectTimerID = -1;
                    GlobalVar.netWaiting().showWaiting(false);
                    GlobalVar.netWaiting().showReconnect(true);
                }
            }, 3);
            return false;
        }
        return false;
    },

    _onNetworkTimeout() {
        GlobalVar.netWaiting().showReconnect(true);
    },

    _onNetworkDead() {
        var isWaiting = requestService.getInstance().hasWaiting();

        if (isWaiting) {
            GlobalVar.netWaiting().showReconnect(true);
        } else {
            if (!!this.socket) {
                this.socket.onclose();
            }
        }
    }
});