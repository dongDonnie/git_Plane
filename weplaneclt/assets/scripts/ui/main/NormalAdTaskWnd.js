const RootBase = require("RootBase");
const WndTypeDefine = require("wndtypedefine");
const GlobalVar = require("globalvar");
const GameServerProto = require("GameServerProto");

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
        if (this._taskData === null) {
            GlobalVar.me().adData.pullADTaskInfo();
        }
    },

    animeStartParam: function (paramScale, paramOpacity) {
        this.node.setScale(paramScale);
        this.node.opacity = paramOpacity;
        if (paramOpacity >= 255) {
            this.adTaskScroll.loopScroll.releaseViewItems();
        }
    },

    registerEvent: function () {
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_REFRESH_AD_TASK_DATA, this.updateAdTaskData, this);
    },

    updateAdTaskData: function () {
        this._taskData = GlobalVar.me().adData.getTaskData();
        this.refresh();
    },

    refresh: function () {
        if (this._taskData.length <= 0) return;
        
    },

    animePlayCallBack: function (name) {
        if (name == "Escape") {
            this._super("Escape");
            GlobalVar.eventManager().removeListenerWithTarget(this);
            WindowManager.getInstance().popView();
        } else if (name == "Enter") {
            this._super("Enter");
            this.registerEvent();
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
