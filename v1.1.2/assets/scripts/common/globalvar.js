const GameTimer = require("GameTimer");
const SceneManager = require("scenemgr");
const WindowManager = require("windowmgr");
const ResManager = require("ResManager");
const Soundmanager = require("soundmgr");
const NetworkManager = require("networkmgr");
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
const StoreageData = require("storagedata");
//const qqPlayAPI = require("qqPlayAPI");
const wanbaAPI = require("wanbaAPI");

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
    if (GlobalVar.isWechatPlat){
        platformApi = weChatAPI || require("weChatAPI");
    }else if (GlobalVar.isQQPlayPlat){
        //platformApi = qqPlayAPI || require("qqPlayAPI");
    }else if (GlobalVar.isWanbaPlat) {
        platformApi = wanbaAPI || require("wanbaAPI");
    }
    if (cc.isValid(platformApi)){
        return platformApi;
    }
    return null;
},

GlobalVar.IosRechargeLock = true;
GlobalVar.androidRechargeLock = false;
GlobalVar.srcSwitch = function () {
    if (GlobalVar.isWechatPlat){
        if (GlobalVar.isIOS){
            return GlobalVar.IosRechargeLock;
        }else if (GlobalVar.isAndroid){
            return GlobalVar.androidRechargeLock;
        }
    }else if (GlobalVar.isQQPlayPlat){
        return true;
    } else if (GlobalVar.isWanbaPlat) {
        return false;
    }
},
GlobalVar.shareControl = 0;
GlobalVar.getShareControl = function () {
    if (GlobalVar.isWechatPlat){
        return GlobalVar.shareControl;
    }else if (GlobalVar.isQQPlayPlat){
        return 0;
    }else {
        return 1;
    }
},
GlobalVar.shareOpen = false;
GlobalVar.getShareSwitch = function () {
    if (GlobalVar.isWechatPlat){
        return GlobalVar.shareOpen;
    }else if (GlobalVar.isQQPlayPlat){
        return false;
    }
    return true;
},
GlobalVar.canShowShare = function () {
    return GlobalVar.getShareControl() == 1;
},
GlobalVar.cityFlagSwitch = false;
GlobalVar.getCityFlagSwitch = function () {
    if (GlobalVar.isWechatPlat){
        return GlobalVar.cityFlagSwitch;
    }else if (GlobalVar.isQQPlayPlat){
        return false;
    }
    return true;
},

GlobalVar.videoAdOpen = false;
GlobalVar.getVideoAdSwitch = function () {
    if (GlobalVar.isWechatPlat){
        return GlobalVar.videoAdOpen;
    }else if (GlobalVar.isQQPlayPlat){
        return true;
    }
    return false;
},
GlobalVar.canShowVideo = function (needDayLimit = false) {
    if (GlobalVar.isWanbaPlat){
        return false;
    }
    if (GlobalVar.getShareControl() == 6){
        return true;
    }
    if (!GlobalVar.getVideoAdSwitch()
    || StoreageData.getShareTimesWithKey("rewardedVideoLimit", 99)){
        return false;
    }
    let platformApi = GlobalVar.getPlatformApi();
    if (platformApi && needDayLimit && StoreageData.getShareTimesWithKey("todayVideoPlayTimes", 99) >= platformApi.shareSetting.todayVideoMax){
        return false;
    }
    return true;
},

GlobalVar.bannerOpen = true;
GlobalVar.getBannerSwitch = function () {
    if (GlobalVar.isWechatPlat){
        return GlobalVar.bannerOpen;
    }else if (GlobalVar.isQQPlayPlat){
        return true;
    }else if (GlobalVar.isWanbaPlat) {
        return false;
    }else {
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
GlobalVar.showSignView = false;

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
// 是否是从公众号进入游戏
GlobalVar.isFromOfficialAccount = false;