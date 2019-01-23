const RootBase = require("RootBase");
const WndTypeDefine = require("wndtypedefine");
const GlobalVar = require("globalvar");
const GameServerProto = require("GameServerProto");
const EventMsgID = require("eventmsgid");
const WindowManager = require("windowmgr");

cc.Class({
    extends: RootBase,

    properties: {
        adTaskScroll: {
            default: null,
            type: cc.ScrollView,
        },
        adTaskPrefab: {
            default: null,
            type: cc.Prefab,
        },
        rewardNum: cc.Label,
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_AD_TASK_WND;
        this._rewardNum = GlobalVar.tblApi.getDataBySingleKey('TblParam', GameServerProto.PTPARAM_FULI_GC_TESTPLAY_REWARD_DIAMOND).dValue;
        this.animeStartParam(0, 0);
    },

    start: function () {
        this.rewardNum.string = '+' + this._rewardNum;
        this._taskData = GlobalVar.me().adData.getTaskData();
    },

    animeStartParam: function (paramScale, paramOpacity) {
        this.node.setScale(paramScale);
        this.node.opacity = paramOpacity;
    },

    registerEvent: function () {
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_REFRESH_AD_TASK_DATA, this.updateAdTaskData, this);
    },

    updateAdTaskData: function () {
        this._taskData = GlobalVar.me().adData.getTaskData();
        this.refresh();
    },

    refresh: function () {
        if (!this._taskData) return;
        let self = this;
        this.adTaskScroll.loopScroll.releaseViewItems();
        this.adTaskScroll.loopScroll.setTotalNum(Math.ceil(self._taskData.length));
        this.adTaskScroll.loopScroll.setCreateModel(self.adTaskPrefab);
        this.adTaskScroll.loopScroll.registerUpdateItemFunc(function (cell, index) {
            cell.getComponent('AdTaskObject').show(self._taskData[index]);
        });
        this.adTaskScroll.loopScroll.registerCompleteFunc(function () {

        });
        this.adTaskScroll.loopScroll.resetView();
    },

    animePlayCallBack: function (name) {
        if (name == "Escape") {
            this._super("Escape");
            GlobalVar.eventManager().removeListenerWithTarget(this);
            WindowManager.getInstance().popView();
        } else if (name == "Enter") {
            this._super("Enter");
            this.registerEvent();
            this.refresh();
        }
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

    close: function () {
        this._super();
    },

    // update (dt) {},
});
