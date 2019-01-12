
const RootBase = require("RootBase");
const WindowManager = require("windowmgr");
const GlobalVar = require('globalvar')
const WndTypeDefine = require("wndtypedefine");
const GameServerProto = require("GameServerProto");
const EventMsgID = require("eventmsgid");
const weChatAPI = require("weChatAPI");
const i18n = require('LanguageData');

const TAB_POINT_STORE = 0, TAB_RANK_STORE = 1, TAB_RANK_REWARD = 2;

cc.Class({
    extends: RootBase,

    properties: {
        nodeTabs: {
            default: null,
            type: cc.Node,
        },
        pointScroll: {
            default: null,
            type: cc.ScrollView,
        },
        rankScroll: {
            default: null,
            type: cc.ScrollView,
        },
        nodeRefresh: {
            default: null,
            type: cc.Node,
        },
        nodeRankingTip: {
            default: null,
            type: cc.Node,
        },
        labelRefreshLeftTime: {
            default: null,
            type: cc.Label,
        },
        labelRefreshCrad: {
            default: null,
            type: cc.Label,
        },
        nodePurchaseModel1: {
            default: null,
            type: cc.Node,
        },
        nodePurchaseModel2: {
            default: null,
            type: cc.Node,
        },
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_ARENA_STORE_WND;
        this.animeStartParam(0, 0);
        // this.reportScorll.loopScroll.releaseViewItems();
        this.tblRankStoreData = null;
        this.tblRankRewardData = null;
        this.curIndex = 0;
        let 啊 = 3;
        console.log("啊啊啊啊啊啊啊啊啊啊啊",啊);
    },
    start: function () {
        this.initArenaStoreWnd();
    },

    animeStartParam(paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            GlobalVar.eventManager().removeListenerWithTarget(this);
            WindowManager.getInstance().popView(false, null, false, false);
        } else if (name == "Enter") {
            this._super("Enter");
            this.registerEvent();
            this.initLoopScroll();
        }
    },

    registerEvent: function () {
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_RANK_STORE_DATA, this.getRankStoreData, this);
    },

    initArenaStoreWnd: function () {
        if (this.curIndex == TAB_POINT_STORE){
            this.pointScroll.node.active = true;
            this.rankScroll.loopScroll.releaseViewItems();
            this.rankScroll.node.active = false;
            this.nodeRefresh.active = true;
            this.nodeRankingTip.active = false;
        }else{
            this.pointScroll.loopScroll.releaseViewItems();
            this.pointScroll.node.active = false;
            this.rankScroll.node.active = true;
            this.nodeRefresh.active = false;
            this.nodeRankingTip.active = true;
        }
    },

    getRankStoreData: function (event) {
        if (event && event.ErrCode != GameServerProto.PTERR_SUCCESS){
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        this.initArenaStoreWnd();
        this.setTabsColor();
        this.initLoopScroll();
    },

    initLoopScroll: function () {
        let self = this;
        if (this.curIndex == TAB_POINT_STORE){
            let storeData = GlobalVar.me().arenaData.arenaStoreData;
            this.pointScroll.loopScroll.setTotalNum(storeData.length);
            this.pointScroll.loopScroll.setColNum(2);
            this.pointScroll.loopScroll.setCreateModel(this.nodePurchaseModel1);
            this.pointScroll.loopScroll.registerUpdateItemFunc(function(model, index){
                self.updateArenaStoreModel(model, storeData[index]);
                model.getChildByName("btnPurchase").getComponent(cc.Button).clickEvents[0].customEventData = index;
            });
            this.pointScroll.loopScroll.resetView();
            this.pointScroll.scrollToTop();
        }else{
            let storeData = null, purchaseData = null;
            if (this.curIndex == TAB_RANK_STORE){
                storeData = GlobalVar.tblApi.getDataBySingleKey("TblRankStore", GameServerProto.PT_STORE_ARENA_RANK_STOREID1);
                purchaseData = GlobalVar.me().arenaData.rankStoreData;
            }else if (this.curIndex == TAB_RANK_REWARD){
                storeData = GlobalVar.tblApi.getDataBySingleKey("TblRankStore", GameServerProto.PT_STORE_ARENA_RANK_STOREID2);
                purchaseData = GlobalVar.me().arenaData.rankReWardData;
            }

            this.rankScroll.loopScroll.setTotalNum(storeData.length);
            this.rankScroll.loopScroll.setCreateModel(this.nodePurchaseModel2);
            this.rankScroll.loopScroll.registerUpdateItemFunc(function (model, index) {
                self.updateRankStoreModel(model, storeData[index], purchaseData);
            })
            this.rankScroll.loopScroll.resetView();
            this.rankScroll.scrollToTop();
        }
    },
    updateArenaStoreModel: function (model, data, purchaseData) {
        // model.x = 0;
        let itemData = model.getChildByName("ItemObject").getComponent("ItemObject").updateItem(data.ItemID, data.Count);
        model.getChildByName("ItemObject").getComponent("ItemObject").setClick(true, 2);
        model.getChildByName("labelPointCost").getComponent(cc.Label).string = data.Cost;
        model.getChildByName("labelName").getComponent(cc.Label).string = itemData.strName;
        if (data.wStoreID == GameServerProto.PT_STORE_ARENA_RANK_STOREID1){
            
        }else if (data.wStoreID == GameServerProto.PT_STORE_ARENA_RANK_STOREID2){
            
        }
    },
    onBtnPurchase(event, id){
        if (this.index == TAB_POINT_STORE){

        }else{

        }
    },

    updateRankStoreModel: function (model, data) {
        // model.x = 0;
        let itemData = model.getChildByName("ItemObject").getComponent("ItemObject").updateItem(data.oVecGoods[0].wItemID, data.oVecGoods[0].nCount);
        model.getChildByName("ItemObject").getComponent("ItemObject").setClick(true, 2);
        model.getChildByName("labelPointCost").getComponent(cc.Label).string = data.oVecPrice[0].nCount;
        model.getChildByName("labelName").getComponent(cc.Label).string = itemData.strName;
        let storeData = null;
    },

    setTabsColor: function (index) {
        if (index == undefined || index < 0 || index >=  this.nodeTabs.length){
            index = this.curIndex;
        }
        this.curIndex = index;
        for (let i = 0; i<this.nodeTabs.childrenCount; i++){
            if (index == i){
                this.nodeTabs.children[i].getComponent("RemoteSprite").setFrame(1);
            }else{
                this.nodeTabs.children[i].getComponent("RemoteSprite").setFrame(0);
            }
        }
    },
    clickTab: function (event, index) {
        if (this.curIndex == index){
            return;
        }
        if (index == TAB_RANK_STORE){
            if (!GlobalVar.me().arenaData.rankStoreData){
                this.curIndex = index;
                GlobalVar.handlerManager().arenaHandler.sendRankStoreDataReq(GameServerProto.PT_STORE_ARENA_RANK_STOREID1);
                return;
            }
        }else if (index == TAB_RANK_REWARD){
            if (!GlobalVar.me().arenaData.rankReWardData){
                this.curIndex = index;
                GlobalVar.handlerManager().arenaHandler.sendRankStoreDataReq(GameServerProto.PT_STORE_ARENA_RANK_STOREID2);
                return;
            }
        }
        this.setTabsColor(index);
        this.initArenaStoreWnd();
        this.initLoopScroll();
    },

    enter: function (isRefresh) {
        this.setTabsColor();
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
        this.pointScroll.loopScroll.releaseViewItems();
        this.rankScroll.loopScroll.releaseViewItems();
        this._super();
    },

});
