const GlobalVar = require("globalvar");
const RootBase = require("RootBase");
const WindowManager = require("windowmgr");
var EventMsgID = require("eventmsgid")
const CommonWnd = require("CommonWnd");

cc.Class({
    extends: RootBase,

    properties: {
        lblCountNum: cc.Label,
        lblCostNum: cc.Label,
        lblStampCur: cc.Label,
        btnArray:[cc.Node],
    },

    onLoad: function () {
        this._super();
        this.animeStartParam(0, 0);
        this.closeShowGet = null;
    },

    animeStartParam(paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            GlobalVar.eventManager().removeListenerWithTarget(this);

            let self = this;
            WindowManager.getInstance().popView(false, function () {
                if (!!self.closeShowGet){
                    self.closeShowGet();
                    self.closeShowGet = null;
                }
            }, false, false);

        } else if (name == "Enter") {
            this._super("Enter");
            this.maxCount = GlobalVar.me().getVoucher();
            this.lblStampCur.string = this.maxCount;
            this.lblCostNum.string = this.maxCount;
            this.lblCountNum.string = this.maxCount;
            this.registerEvent();
        }
    },

    registerEvent: function () {
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_VOUCHER_RESULT, this.showVoucherResult, this);
        for (let i = 0; i < 4; i++) {
            this.btnArray[i].on('touchstart', this.touchStart, this);
            this.btnArray[i].on('touchend', this.touchCancel, this);
            this.btnArray[i].on('touchcancel', this.touchCancel, this);
        }
    },

    touchStart: function (event) {
        var btnName = event.target.name;
        var self = this;

        self.durTime = 0;
        self.curTime = 2;
        self.timeHandler = GlobalVar.gameTimer().startTimer(function () {
            self.durTime += 0.15;
            if (self.durTime > self.curTime) {
                self.durTime = 0;
                if (self.curTime > 0.6) {
                    self.curTime -= 0.1;
                }
                if (btnName == 'btnPlusTen')
                    self.onBtnPlusTenTouched();
                else if (btnName == 'btnPlus')
                    self.onBtnPlusTouched();
                else if (btnName == 'btnMinusTen')
                    self.onBtnMinusTenTouched();
                else if (btnName == 'btnMinus')
                    self.onBtnMinusTouched();
            }
        }, 0.01)
    },

    touchCancel: function () {
        GlobalVar.gameTimer().delTimer(this.timeHandler);
    },

    enter: function (isRefresh) {
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

    confirm: function () {
        GlobalVar.handlerManager().rechargeHandler.sendVoucherReq(this.lblCostNum.string);
        this.close();
    },

    cancel: function () {
        this.close();
    },

    onBtnPlusTouched: function () {
        var num = parseInt(this.lblCountNum.string);
        if (num >= this.maxCount)
            return;
        num++;
        this.lblCostNum.string = num;
        this.lblCountNum.string = num;
    },

    onBtnPlusTenTouched: function () {
        var num = parseInt(this.lblCountNum.string);
        num += 10;
        if (num >= this.maxCount)
            num = this.maxCount;

        this.lblCostNum.string = num;
        this.lblCountNum.string = num;
    },

    onBtnPlusMaxTouched: function () {
        this.lblCostNum.string = this.maxCount;
        this.lblCountNum.string = this.maxCount;
    },

    onBtnMinusTouched: function () {
        var num = parseInt(this.lblCountNum.string);
        if (num <= 1)
            return;
        num--;
        this.lblCostNum.string = num;
        this.lblCountNum.string = num;
    },

    onBtnMinusTenTouched: function () {
        var num = parseInt(this.lblCountNum.string);
        num -= 10;
        if (num <= 1)
            num = 1;
        this.lblCostNum.string = num;
        this.lblCountNum.string = num;
    },

    showVoucherResult: function (data) {
        if (data.ErrCode != 0) {
            GlobalVar.comMsg.errorWarning(data.ErrCode);
            return;
        }
        let getDiamonCout = parseInt(this.lblCostNum.string);
        this.closeShowGet = function () {
            var item = [{ ItemID: 3, Count:getDiamonCout}]
            CommonWnd.showTreasureExploit(item);
        }
    },
});
