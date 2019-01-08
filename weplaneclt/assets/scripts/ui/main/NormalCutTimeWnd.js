const GlobalVar = require("globalvar");
const WindowManager = require("windowmgr");
const WndTypeDefine = require("wndtypedefine");
const RootBase = require("RootBase");
const i18n = require('LanguageData');
const GlobalFunc = require('GlobalFunctions');
const EventMsgID = require("eventmsgid");
const weChatAPI = require("weChatAPI");
const GameServerProto = require("GameServerProto");
const CommonWnd = require("CommonWnd");
const StoreageData = require("storagedata");

cc.Class({
    extends: RootBase,

    properties: {
        btnVideo: {
            default: null,
            type: cc.Button,
        },
        labelLeftTime: {
            default: null,
            type: cc.Label,
        },
        labelHasTimes: {
            default: null,
            type: cc.Label,
        }
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_CUT_TIME_WND;
        this.animeStartParam(0, 0);

        this.countDownTimerID = -1;
    },

    animeStartParam(paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            if (this.countDownTimerID != -1){
                GlobalVar.gameTimer().delTimer(this.countDownTimerID)
                this.countDownTimerID = -1;
            }

            GlobalVar.eventManager().removeListenerWithTarget(this);
            WindowManager.getInstance().popView(false, null, false, false);
        } else if (name == "Enter") {
            this._super("Enter");
            this.registerEvent();
        }
    },

    setCountDown: function () {
        if (this.countDownTimerID == -1){
            let self = this;
            this.countDownTimerID = GlobalVar.gameTimer().startTimer(function () {
                self.showFreeDrawTime();
            }, 1);
            this.showFreeDrawTime();
        }
    },

    showFreeDrawTime: function () {
        let nextFreeTime = GlobalVar.me().drawData.getNextFreeTime();
        if (nextFreeTime <= GlobalVar.me().serverTime){
            this.labelLeftTime.active = false;
        }else{
            let leftTime = nextFreeTime - GlobalVar.me().serverTime;
            let hour = parseInt(leftTime/3600);
            let min = parseInt((leftTime - hour*3600)/60);
            let sec = parseInt(leftTime - hour*3600 - min*60);
            if (hour){
                this.labelLeftTime.string = i18n.t('label.4000323').replace('%hour', hour).replace('%min', min);
            }else{
                this.labelLeftTime.string = i18n.t('label.4000324').replace('%min', min).replace('%sec', sec);
            }
            // this.labelLeftTime.string = i18n.t('label.4000326').replace('%hour', hour).replace('%min', min).replace('%sec', sec);
            this.labelLeftTime.active = true;
        }
    },


    initCutTimeWnd: function (title, text, drawMode, ticketsEnough, diamondEnough, pFunCloseCallback, pFunConfirmCallback, pFunCancelCallback) {
        let maxTimes = 2;
        let curTimes = GlobalVar.me().drawData.getFreeReduceCount();
        this.labelHasTimes.string = i18n.t('label.4000306').replace('%left', maxTimes - curTimes).replace('%max', maxTimes);
        this.setCountDown();
    },

    registerEvent: function () {
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_TREASURE_REDUCE_TIME_RESULT, this.getReduceTimeResult, this);
    },
    getReduceTimeResult: function (event) {
        if (event.ErrCode != GameServerProto.PTERR_SUCCESS){
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        GlobalVar.comMsg.showMsg("免费等待时间减少8小时");
        this.initCutTimeWnd();
    },

    onBtnVideo: function () {
        let maxTimes = 2;
        let curTimes = GlobalVar.me().drawData.getFreeReduceCount();
        if (curTimes >= maxTimes){
            GlobalVar.comMsg.showMsg(i18n.t('label.4000313'));
        }else{
            let platformApi = GlobalVar.getPlatformApi();
            if (platformApi){
                platformApi.showRewardedVideoAd(function () {
                    GlobalVar.handlerManager().drawHandler.sendTreasureTimeReduceReq();
                }, function () {
                    platformApi.shareNormal(0, function () {
                        GlobalVar.handlerManager().drawHandler.sendTreasureTimeReduceReq();
                    })
                });
            }else if (GlobalVar.configGMSwitch()){
                GlobalVar.handlerManager().drawHandler.sendTreasureTimeReduceReq();
            }
        }
    },

    enter: function (isRefresh) {
        this.initCutTimeWnd();
        if (isRefresh) {
            this._super(true);
        } else {
            this._super(false);
        }
    },

    escape: function (isRefresh) {
        if (isRefresh) {
            this._super(true);
        } else {
            this._super(false);
        }
    },

    onDestroy: function () {
        GlobalVar.eventManager().removeListenerWithTarget(this);
        if (this.countDownTimerID != -1){
            GlobalVar.gameTimer().delTimer(this.countDownTimerID)
            this.countDownTimerID = -1;
        }
    },

});