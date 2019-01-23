const RootBase = require("RootBase");
const WndTypeDefine = require("wndtypedefine");
const EventMsgID = require("eventmsgid");
const GlobalVar = require('globalvar');
const WindowManager = require("windowmgr");

const row = 4;
cc.Class({
    extends: RootBase,

    properties: {
        adExpScroll: {
            default: null,
            type: cc.ScrollView,
        },
        adExpPrefab: {
            default: null,
            type: cc.Prefab,
        },

        closeBtn: cc.Node,
    },

    onLoad: function () {
        this._super();

        this._listData = [];
        this._listData = GlobalVar.me().adData.getAdExpInfo();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_AD_EXP_WND;

        this._posX = this.node.x;
        this._posY = this.node.y;
        this.node.setPosition(-800, this._posY);
        this.animeStartParam(0);
    },

    registerEvent: function () {
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_REFRESH_AD_EXP_DATA, this.updateAdExpData, this);
    },

    start: function () {
        this.refresh();
    },

    updateAdExpData: function () {
        this._listData = GlobalVar.me().adData.getAdExpInfo();
        this.refresh();
    },

    refresh: function () {
        if (!this._listData || this._listData.length <= 0) return;
        let self = this;
        this.adExpScroll.loopScroll.releaseViewItems();
        this.adExpScroll.loopScroll.setTotalNum(Math.ceil(this._listData.length / row));
        this.adExpScroll.loopScroll.setCreateModel(this.adExpPrefab);
        this.adExpScroll.loopScroll.registerUpdateItemFunc(function (cell, index) {
            let offset = index * row;
            let infos = self._listData.slice(offset, offset + row);
            cell.getComponent('AdExpObject').show(infos);
        });
        this.adExpScroll.loopScroll.registerCompleteFunc(function () {

        });
        this.adExpScroll.loopScroll.resetView();
    },

    animeStartParam: function (paramOpacity) {
        this.node.opacity = paramOpacity;
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
});
