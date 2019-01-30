const RootBase = require('RootBase');
const GlobalVar = require('globalvar');
const WndTypeDefine = require("wndtypedefine");
const EventMsgID = require("eventmsgid");
const WindowManager = require("windowmgr");
const CommonWnd = require("CommonWnd");
const GameServerProto = require("GameServerProto");

let self = null;
const Tab_Wingman = 0, Tab_Cast = 1, Tab_Missile = 2, Tab_Auxiliary = 3;

cc.Class({
    extends: RootBase,

    properties: {
        btnList: cc.Node,
        resNum: cc.Label,
        scroll: cc.ScrollView,
        hots: [cc.Node],
        item: cc.Node,
    },

    ctor: function () {
        self = this;
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_GUAZAICHIP_WND;

        this._tblArrs = [[], [], [], []];
        this.canClose = true;

        this.initTabData();
        this.animeStartParam(0, 0);
    },

    initTabData: function () {
        let tabObj = GlobalVar.tblApi.getData('TblGuaZaiCom');
        for (let key in tabObj) {
            let data = tabObj[key];
            let pos = data.byTab - 1;
            if (pos >= 0 && pos < self._tblArrs.length) {
                self._tblArrs[pos].push(data);
            }
        }
    },

    refresh: function () {
        this.refreshResCount();
        this.setTabSprite();
        this.refreshHots();
        this.refreshItems();
    },

    refreshResCount: function () {
        let resConut = GlobalVar.me().bagData.getItemCountById(39);
        this.resNum.string = resConut;
    },

    refreshHots: function () {
        for (let pos = 0; pos < this.hots.length; pos++) {
            this.hots[pos].active = GlobalVar.me().guazaiData.getComposeHotPointByPos(pos);
        }
    },

    clickTab: function (event, index) {
        index = parseInt(index);
        if (this.curIndex === index) {
            return;
        }
        this.curIndex = index;
        this.setTabSprite();
        this.refreshItems();
    },

    setTabSprite: function () {
        for (let i = 0; i < this.btnList.childrenCount; i++) {
            if (this.curIndex == i) {
                this.btnList.children[i].getComponent("RemoteSprite").setFrame(1);
            } else {
                this.btnList.children[i].getComponent("RemoteSprite").setFrame(0);
            }
        }
    },

    refreshItems: function () {
        let self = this;
        let datas = this._tblArrs[this.curIndex];
        this.canClose = false;
        this.scroll.loopScroll.releaseViewItems();
        this.scroll.loopScroll.setTotalNum(Math.ceil(datas.length));
        this.scroll.loopScroll.setCreateModel(self.item);
        this.scroll.loopScroll.saveCreatedModel(this.scroll.content.children);
        this.scroll.loopScroll.registerUpdateItemFunc(function (cell, index) {
            cell.getComponent('ChipComposeObject').show(datas[index]);
        });
        this.scroll.loopScroll.registerCompleteFunc(function () {
            self.canClose = true;
        });
        this.scroll.loopScroll.resetView();
    },

    animeStartParam: function (paramScale, paramOpacity) {
        this.node.setScale(paramScale);
        this.node.opacity = paramOpacity;
    },

    registerEvent: function () {
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GUAZAI_COMPOSE_ACK, this.composeAck, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_BAG_ADDITEM_NTF, this.refreshResCount, this);
    },

    composeAck: function (data) {
        if (data.ErrCode !== GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(data.ErrCode);
            return;
        }
        CommonWnd.showTreasureExploit(data.GetItems);
        this.refreshResCount();
        this.refreshHots();
        this.refreshItems();

    },

    onAddJinHua: function () {
        CommonWnd.showBuyJinhuaWnd();
    },

    animePlayCallBack: function (name) {
        if (name == "Escape") {
            this._super("Escape");
            GlobalVar.eventManager().removeListenerWithTarget(this);
            WindowManager.getInstance().popView();
        } else if (name == "Enter") {
            this._super("Enter");
            this.curIndex = Tab_Wingman;
            this.registerEvent();
            this.refresh();
        }
    },

    enter: function (isRefresh) {
        if (isRefresh) {
            this._super(true);
        } else {
            this._super(false);
            this.refreshHots();
            this.refreshItems();
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
        if (this.canClose) {
            this.scroll.loopScroll.releaseViewItems();
            this._super();
        }
    },

});
