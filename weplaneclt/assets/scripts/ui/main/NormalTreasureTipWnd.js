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
        btnPurchase: {
            default: null,
            type: cc.Button,
        },
        btnCancel: {
            default: null,
            type: cc.Button,
        },
        btnReduce: {
            default: null,
            type: cc.Button,
        },
        btnFreeDraw: {
            default: null,
            type: cc.Button,
        },
        labelLeftTime: {
            default: null,
            type: cc.Label,
        },
        nodeCutTime: {
            default: null,
            type: cc.Node,
        },
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_TREASURE_TIP_WND;
        this.animeStartParam(0, 0);

        this._closeCallback = null;
        this._confirmCallback = null;
        this._cancelCallback = null;
        this._clickIndex = -1;
        
        this.countDownTimerID = -1;
        this.showFree = false;

        if (!GlobalVar.getShareSwitch()){
            this.nodeCutTime.getChildByName("btnCutTime").active = false;
        }
    },

    animeStartParam(paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            
            this.showFree = false;
            if (this.countDownTimerID != -1){
                GlobalVar.gameTimer().delTimer(this.countDownTimerID)
                this.countDownTimerID = -1;
            }

            let callback = null;
            if (this._clickIndex == 1){
                callback = this._cancelCallback
            }else if (this._clickIndex == 0){
                callback = this._confirmCallback;
            }else if (this._clickIndex == 2){
                callback = this._closeCallback;
            }else if (this._clickIndex == 3){

            }else if (this._clickIndex == 4){
                callback = function () {
                    let nextFreeTime = GlobalVar.me().drawData.getNextFreeTime();
                    if (nextFreeTime<= GlobalVar.me().serverTime){
                        GlobalVar.handlerManager().drawHandler.sendSingleDrawReq(1);
                    }
                };
            }
            GlobalVar.eventManager().removeListenerWithTarget(this);
            WindowManager.getInstance().popView(false, function(){
                callback && callback();
            }, false);
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
            this.nodeCutTime.active = false;
            this.btnFreeDraw.node.active = true;
        }else{
            this.nodeCutTime.active = this.showFree;
            this.btnFreeDraw.node.active = false;
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
        }
    },


    initTreasureTipWnd: function (title, text, drawMode, ticketsEnough, diamondEnough, pFunCloseCallback, pFunConfirmCallback, pFunCancelCallback) {
        this.node.getChildByName("labelTitle").getComponent(cc.Label).string = title;
        this.node.getChildByName("labelText").getComponent(cc.Label).string = text;

        let diamond = this.node.getChildByName("spriteDiamond");
        let diamondCost = diamond.getChildByName("labelDiamondCost");
        let ticket = this.node.getChildByName("spriteTicket");
        let ticketCost = ticket.getChildByName("labelTicketCost");
        if (ticketsEnough) {
            // ticket.getComponent("RemoteSprite").setFrame(1);
            diamond.active = false;
        } else {
            if (diamondEnough) {
                diamondCost.color = new cc.color(255, 255, 255);
            } else {
                diamondCost.color = new cc.color(255, 0, 0);
                // pFunConfirmCallback = function () {
                    // GlobalVar.comMsg.showMsg(i18n.t('label.4000221'));
                    // pFunConfirmCallback();
                    // pFunCancelCallback();
                // };
            }
        }
        if (drawMode === 1) {
            this.showFree = true;
            diamondCost.getComponent(cc.Label).string = 188;
            ticketCost.getComponent(cc.Label).string = 1;
        } else if (drawMode === 10) {
            diamondCost.getComponent(cc.Label).string = 1680;
            ticketCost.getComponent(cc.Label).string = 10;
        }

        this._closeCallback = pFunCloseCallback;
        this._confirmCallback = pFunConfirmCallback;
        this._cancelCallback = pFunCancelCallback;
    },

    registerEvent: function () {
        // GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_ENDLESS_GET_BUY_POWERPOINT_DATA, this.getBuyPowerPointResult, this);
    },

    onBtnConfirm: function (event, index) {
        this._clickIndex = parseInt(index);
        this.close()
    },
    onBtnCancel: function (event, index) {
        this._clickIndex = parseInt(index);
        this.close();
    },
    onBtnCutTime: function (event, index) {
        this._clickIndex = parseInt(index);
        CommonWnd.showCutTimeWnd();
    },
    onBtnFreeDraw: function (event, index) {
        this._clickIndex = parseInt(index);
        this.close();
    },

    onBtnClose: function(event, index){
        this._clickIndex = parseInt(index);
        this.close();
    },

    enter: function (isRefresh) {
        this.setCountDown();
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