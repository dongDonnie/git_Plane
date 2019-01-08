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
const config = require("config");
const weChatAPI = require("weChatAPI");
const qqPlayAPI = require("qqPlayAPI");
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

GlobalVar.getPlatformApi = function () {
    let platformApi = null;
    if (cc.sys.platform == cc.sys.WECHAT_GAME){
        platformApi = weChatAPI || require("weChatAPI");
    }else if (window && window["wywGameId"]=="5469"){
        platformApi = qqPlayAPI || require("qqPlayAPI");
    }
    if (cc.isValid(platformApi)){
        return platformApi;
    }
    return null;
},

GlobalVar.IosRechargeLock = true;
GlobalVar.androidRechargeLock = false;
GlobalVar.srcSwitch = function () {
    if (cc.sys.platform == cc.sys.WECHAT_GAME){
        if (GlobalVar.isIOS){
            return GlobalVar.IosRechargeLock;
        }else if (GlobalVar.isAndroid){
            return GlobalVar.androidRechargeLock;
        }
    }else if (window && window["wywGameId"]=="5469"){
        return true;
    }
    return false;
},
GlobalVar.shareControl = 0;
GlobalVar.getShareControl = function () {
    return GlobalVar.shareControl;
},
GlobalVar.shareOpen = false;
GlobalVar.getShareSwitch = function () {
    if (cc.sys.platform == cc.sys.WECHAT_GAME){
        return GlobalVar.shareOpen;
    }else if (window && window["wywGameId"]=="5469"){
        return false;
    }
    return true;
},
GlobalVar.videoAdOpen = false;
GlobalVar.getVideoAdSwitch = function () {
    if (cc.sys.platform == cc.sys.WECHAT_GAME){
        return GlobalVar.videoAdOpen;
    }else if (window && window["wywGameId"]=="5469"){
        return true;
    }
    return false;
},

GlobalVar.bannerOpen = true;
GlobalVar.getBannerSwitch = function () {
    if (cc.sys.platform == cc.sys.WECHAT_GAME){
        return GlobalVar.bannerOpen;
    }else if (window && window["wywGameId"]=="5469"){
        return true;
    }else{
        return false;
    }
},
GlobalVar.getNeedGuide = function () {
    return config.NEED_GUIDE;
},
GlobalVar.configGMSwitch = function () {
    return config.GM_SWITCH;
},

GlobalVar.firstTimeLaunch = true;
GlobalVar.showAuthorization = true;

GlobalVar.cleanAllMgr = function () {
    // ResManager.getInstance().clearCache();
    Soundmanager.getInstance().clearSoundMgr();
    WindowManager.getInstance().resetView();
    GameTimer.getInstance().delAllTimer();
    Me.destroyInstance();
};

GlobalVar.tblApi = new TblApi;
GlobalVar.messageDispatcher = new MessageDispatcher;
GlobalVar.comMsg = new ComMsg;
GlobalVar.serverTime = new ServerTime;