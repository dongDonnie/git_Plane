const GameTimer = require("GameTimer");
const SceneManager = require("scenemgr");
const WindowManager = require("windowmgr");
const ResManager = require("ResManager");
const Soundmanager = require("soundmgr");
const NetworkManager = require("networkmgr");
const DoTweenManager = require('dotweenmanager');
const EventManager = require('eventmanager');
const HandlerManager = require('handlermanager');
const Me = require('me');
const MessageDispatcher = require('messagedispatcher');
const ComMsg = require("ComMsg");
const ServerTime = require("servertime");
const TblApi = require("tblapi");
const NetWaiting=require("netwaiting");
var requestService = require('requestservice')

var GlobalVar = module.exports;

GlobalVar.gameTimer = function () {
    return GameTimer.getInstance();
},

GlobalVar.resManager = function () {
    return ResManager.getInstance();
},

GlobalVar.networkManager = function () {
    return NetworkManager.getInstance();
},

GlobalVar.soundManager = function () {
    return Soundmanager.getInstance();
},

GlobalVar.sceneManager = function () {
    return SceneManager.getInstance();
},

GlobalVar.windowManager = function () {
    return WindowManager.getInstance();
},

GlobalVar.doTweenManager = function () {
    return DoTweenManager.getInstance();
},

GlobalVar.eventManager = function () {
    return EventManager.getInstance();
},

GlobalVar.handlerManager = function () {
    return HandlerManager.getInstance();
},

GlobalVar.me = function () {
    return Me.getInstance();
},

GlobalVar.netWaiting = function(){
    return NetWaiting.getInstance();
},

GlobalVar.IosRechargeLock = true;
GlobalVar.androidRechargeLock = false;
GlobalVar.srcSwitch = function () {
    if (GlobalVar.isIOS){
        return GlobalVar.IosRechargeLock;
    }else if (GlobalVar.isAndroid){
        return GlobalVar.androidRechargeLock;
    }
    return false;
},
GlobalVar.shareOpen = false;
GlobalVar.getShareSwitch = function () {
    if (cc.sys.platform == cc.sys.WECHAT_GAME){
        return GlobalVar.shareOpen;
    }
    return true;
},
GlobalVar.videoAdOpen = false;
GlobalVar.getVideoAdSwitch = function () {
    if (cc.sys.platform == cc.sys.WECHAT_GAME){
        return GlobalVar.videoAdOpen;
    }
    return false;
},


GlobalVar.showAuthorization = true;

GlobalVar.cleanAllMgr = function () {
    Soundmanager.getInstance().clearSoundMgr();
    WindowManager.getInstance().clearWindowMgr();
    Me.destroyInstance();
};

GlobalVar.tblApi = new TblApi;
GlobalVar.messageDispatcher = new MessageDispatcher;
GlobalVar.comMsg = new ComMsg;
GlobalVar.serverTime = new ServerTime;