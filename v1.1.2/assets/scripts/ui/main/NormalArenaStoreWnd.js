
const RootBase = require("RootBase");
const WindowManager = require("windowmgr");
const GlobalVar = require('globalvar')
const WndTypeDefine = require("wndtypedefine");
const GameServerProto = require("GameServerProto");
const EventMsgID = require("eventmsgid");
const CommonWnd = require("CommonWnd");
const i18n = require('LanguageData');
const GlobalFunc = require('GlobalFunctions');

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
        labelRefreshTimes: {
            default: null,
            type: cc.Label,
        },
        labelCardCost: {
            default: null,
            type: cc.Label,
        },
        labelDiamondCost: {
            default: null,
            type: cc.Label,
        },
        labelPoint: {
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
        nodeCardCost: {
            default: null,
            type: cc.Node,
        },
        nodeDiamondCost: {
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
        this.scheduleHandler = -1;
        this.refreshPlan = null;
    },
    start: function () {

        let refresh = GlobalVar.tblApi.getDataBySingleKey('TblStoreLevel', GameServerProto.PT_STORE_ARENA);
        let refreshType;
        for (let i = 0; i < refresh.length; i++) {
            if (GlobalVar.me().level >= refresh[i].wMinLevel && GlobalVar.me().level <= refresh[i].wMaxLevel)
                refreshType = refresh[i];
        }
        this.refreshPlan = GlobalVar.tblApi.getDataByMultiKey('TblRefresh', refreshType.wRefreshType, 0);
        this.initCostNode();
    },

    animeStartParam(paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;

        if (paramOpacity == 0 || paramOpacity == 255){
            this.node.getChildByName("nodeTabs").active = false;
            this.node.getChildByName("nodeRefresh").active = false;
        }
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            GlobalVar.eventManager().removeListenerWithTarget(this);
            WindowManager.getInstance().popView(false, null, false, false);
        } else if (name == "Enter") {
            this._super("Enter");
            this.registerEvent();
            this.node.getChildByName("nodeTabs").active = true;
            this.node.getChildByName("nodeRefresh").active = true;
            this.initLoopScroll();
        }
    },

    registerEvent: function () {
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_RANK_STORE_DATA, this.getRankStoreData, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_RANK_STORE_BUY_DATA, this.getRankStoreBuyData, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_ARENA_STORE_DATA, this.getArenaStoreData, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_ARENA_STORE_BUY_DATA, this.getArenaStoreBuyData, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_ARENA_STORE_REFRESH_DATA, this.getArenaRefreshData, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_ARENA_POINT_CHANGE_DATA, this.getArenaPointChangeData, this);
    },

    initArenaStoreWnd: function () {
        if (this.curIndex == TAB_POINT_STORE) {
            this.pointScroll.node.active = true;
            this.rankScroll.loopScroll.releaseViewItems();
            this.rankScroll.node.active = false;
            this.nodeRefresh.active = true;
            this.nodeRankingTip.active = false;
        } else {
            this.pointScroll.loopScroll.releaseViewItems();
            this.pointScroll.node.active = false;
            this.rankScroll.node.active = true;
            this.nodeRefresh.active = false;
            this.nodeRankingTip.active = true;
        }
    },
    initCostNode: function () {
        if (!this.refreshPlan || !(GlobalVar.me().arenaData.arenaStoreRefreshTimes>=0)){
            return;
        }
        let refreshPlan = this.refreshPlan;

        let refreshCardCount = GlobalVar.me().bagData.getItemCountById(refreshPlan.oVecCost1[0].wItemID);
        if (GlobalVar.me().bagData.getItemCountById(refreshPlan.oVecCost1[0].wItemID) > 0) {
            this.nodeCardCost.active = true;
            this.nodeDiamondCost.active = false;
            this.labelCardCost.string = refreshCardCount + "/" + refreshPlan.oVecCost1[0].nCount;
        } else {
            this.nodeCardCost.active = false;
            this.nodeDiamondCost.active = true;
            this.labelDiamondCost.string = refreshPlan.oVecCost2[0].nCount;
        }

        this.labelRefreshTimes.string = i18n.t("label.4001016").replace("%times", GlobalVar.me().arenaData.arenaStoreRefreshTimes);
    },

    getRankStoreData: function (event) {
        if (event.ErrCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        this.initArenaStoreWnd();
        this.setTabsColor();
        this.initLoopScroll();
        this.initPointLabel();
        this.initCostNode();
    },    
    getRankStoreBuyData: function (event) {
        if (event.ErrCode != GameServerProto.PTERR_SUCCESS){
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        this.refreshLoopScroll();
        CommonWnd.showTreasureExploit(event.ItemShow);
    },
    getArenaStoreData: function (event) {
        if (this.curIndex != TAB_POINT_STORE){
            return;
        }

        if (event.ErrCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        
        this.pointScroll.loopScroll.releaseViewItems();
        this.initLoopScroll();
        this.initCostNode();
    },
    getArenaStoreBuyData: function (event) {
        if (event.ErrCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        this.refreshLoopScroll();
        let buyItem = GlobalVar.me().arenaData.arenaStoreData[event.ID]
        let item = [{ItemID: buyItem.ItemID, Count: buyItem.Count}]
        CommonWnd.showTreasureExploit(item);
    },
    getArenaRefreshData: function (event) {
        if (event.ErrCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        this.initLoopScroll();
        this.initCostNode();
    },

    getArenaPointChangeData: function (event) {
        this.initPointLabel();
    },

    initLoopScroll: function () {
        let self = this;
        if (this.curIndex == TAB_POINT_STORE) {
            let storeData = GlobalVar.me().arenaData.arenaStoreData;
            if (!storeData){
                GlobalVar.handlerManager().arenaHandler.sendArenaStoreReq();
                return;
            }
            this.pointScroll.loopScroll.setTotalNum(parseInt(storeData.length / 2));
            // this.pointScroll.loopScroll.setColNum(2);
            this.pointScroll.loopScroll.setCreateModel(this.nodePurchaseModel1);
            this.pointScroll.loopScroll.setCreateInterval(150);
            this.pointScroll.loopScroll.saveCreatedModel(this.pointScroll.content.children);
            this.pointScroll.loopScroll.registerUpdateItemFunc(function(model, index){
                self.updateArenaStoreModel(model.getChildByName("nodeLeft"), storeData[index*2]);
                self.updateArenaStoreModel(model.getChildByName("nodeRight"), storeData[index*2 + 1]);
                model.getChildByName("nodeLeft").getChildByName("btnPurchase").getComponent(cc.Button).clickEvents[0].customEventData = index*2 + "." + storeData[index*2].Type;
                model.getChildByName("nodeRight").getChildByName("btnPurchase").getComponent(cc.Button).clickEvents[0].customEventData = (index*2 + 1) + "." + storeData[index*2 + 1].Type;
            });
            this.pointScroll.loopScroll.setPlayAni(function (model, index, targetX, targetY, callback) {
                self.playPointStoreModelAni(model, index, targetX, targetY, callback);
            })
            this.pointScroll.loopScroll.resetView();
            this.pointScroll.scrollToTop();
        } else {
            let storeData = null;
            if (this.curIndex == TAB_RANK_STORE) {
                storeData = GlobalVar.tblApi.getDataBySingleKey("TblRankStore", GameServerProto.PT_STORE_ARENA_RANK_STOREID1);
            } else if (this.curIndex == TAB_RANK_REWARD) {
                storeData = GlobalVar.tblApi.getDataBySingleKey("TblRankStore", GameServerProto.PT_STORE_ARENA_RANK_STOREID2);
            }
            
            this.rankScroll.loopScroll.releaseViewItems();
            let sortData = this.sortRankStoreData(storeData, this.curIndex);
            this.rankScroll.loopScroll.setTotalNum(sortData.length);
            this.rankScroll.loopScroll.setCreateModel(this.nodePurchaseModel2);
            this.rankScroll.loopScroll.saveCreatedModel(this.rankScroll.content.children);
            this.rankScroll.loopScroll.registerUpdateItemFunc(function (model, index) {
                self.updateRankStoreModel(model, sortData[index]);
            });
            this.rankScroll.loopScroll.setPlayAni(function (model, index, targetX, targetY, callback) {
                self.playRankStoreModelAni(model, index, targetX, targetY, callback);
            });
            this.rankScroll.loopScroll.resetView();
            this.rankScroll.scrollToTop();
        }
    },
    refreshLoopScroll: function () {
        let self = this;
        if (this.curIndex == TAB_POINT_STORE) {
            let storeData = GlobalVar.me().arenaData.arenaStoreData;
            if (!storeData){
                GlobalVar.handlerManager().arenaHandler.sendArenaStoreReq();
                return;
            }
            this.pointScroll.loopScroll.setTotalNum(storeData.length);
            this.pointScroll.loopScroll.registerUpdateItemFunc(function(model, index){
                self.updateArenaStoreModel(model.getChildByName("nodeLeft"), storeData[index*2]);
                self.updateArenaStoreModel(model.getChildByName("nodeRight"), storeData[index*2 + 1]);
                model.getChildByName("nodeLeft").getChildByName("btnPurchase").getComponent(cc.Button).clickEvents[0].customEventData = index*2 + "." + storeData[index*2].Type;
                model.getChildByName("nodeRight").getChildByName("btnPurchase").getComponent(cc.Button).clickEvents[0].customEventData = (index*2 + 1) + "." + storeData[index*2 + 1].Type;
            });
            this.pointScroll.loopScroll.refreshViewItem();
        }else{
            this.rankScroll.loopScroll.refreshViewItem();
        }
    },

    updateArenaStoreModel: function (model, data) {
        // model.x = 0;
        let itemData = model.getChildByName("ItemObject").getComponent("ItemObject").updateItem(data.ItemID, data.Count);
        model.getChildByName("ItemObject").getComponent("ItemObject").setClick(true, 2);
        model.getChildByName("labelPointCost").getComponent(cc.Label).string = data.Cost;
        model.getChildByName("labelName").getComponent(cc.Label).string = itemData.strName;
        model.getChildByName("labelName").color = GlobalFunc.getCCColorByQuality(itemData.wQuality);

        if (data.State == 0) {
            model.getChildByName("btnPurchase").active = false;
            model.getChildByName("spriteAlreadBuy").active = true;
            model.getChildByName("spriteIcon").active = false;
            model.getChildByName("labelPointCost").active = false;
        }else{
            if (data.Type == GameServerProto.PT_MONEY_FREE){
                model.getChildByName("spriteIcon").active = false;
                model.getChildByName("labelPointCost").active = false;
                if (GlobalVar.getShareSwitch()){
                    model.getChildByName("btnPurchase").getChildByName("spriteVideo").active = true;
                    model.getChildByName("btnPurchase").getComponent("ButtonObject").setText("  " + i18n.t('label.4000328'));
                }else{
                    model.getChildByName("btnPurchase").getChildByName("spriteVideo").active = false;
                    model.getChildByName("btnPurchase").getComponent("ButtonObject").setText(i18n.t('label.4000241'));
                }
            }else{
                model.getChildByName("btnPurchase").getChildByName("spriteVideo").active = false;
                model.getChildByName("btnPurchase").getComponent("ButtonObject").setText(i18n.t('label.4000214'));
                model.getChildByName("spriteIcon").active = true;
                model.getChildByName("labelPointCost").active = true;
            }

            model.getChildByName("btnPurchase").active = true;
            model.getChildByName("spriteAlreadBuy").active = false;
        }
    },
    playPointStoreModelAni: function (model, index, targetX, targetY, callback) {
        let nodeLeft = model.getChildByName("nodeLeft");
        let nodeRight = model.getChildByName("nodeRight");
        nodeLeft.stopAllActions();
        nodeRight.stopAllActions();
        model.y = targetY;
        model.x = targetX;
        nodeLeft.x = -1000;
        nodeRight.x = 1000;
        nodeLeft.runAction(cc.sequence(cc.moveTo(0.25, -136, 0), cc.callFunc(()=>{
            callback && callback();
        })))
        nodeRight.runAction(cc.moveTo(0.25, 136, 0));
    },
    updateRankStoreModel: function (model, data) {
        // model.x = 0;
        let itemData = model.getChildByName("ItemObject").getComponent("ItemObject").updateItem(data.oVecGoods[0].wItemID, data.oVecGoods[0].nCount);
        model.getChildByName("ItemObject").getComponent("ItemObject").setClick(true, 2);
        model.getChildByName("labelPointCost").getComponent(cc.Label).string = data.oVecPrice[0].nCount;
        model.getChildByName("labelName").getComponent(cc.Label).string = itemData.strName;
        model.getChildByName("labelName").color = GlobalFunc.getCCColorByQuality(itemData.wQuality);

        let maxTimes = this.getMaxBuyTimes(data.oVecPurchaseNum);
        let curTimes = this.getCurBuyTimesByID(data.wStoreID, data.wID);
        if (data.wStoreID == GameServerProto.PT_STORE_ARENA_RANK_STOREID2 || GlobalVar.me().arenaData.getPlayerRanking() > data.wNeedRank) {
            model.getChildByName("labelTip").getComponent(cc.Label).string = i18n.t('label.4001013').replace("%rank", data.wNeedRank);
        } else {
            model.getChildByName("labelTip").getComponent(cc.Label).string = i18n.t('label.4001014').replace("%times", maxTimes - curTimes);
        }

        model.getChildByName("btnPurchase").getComponent(cc.Button).clickEvents[0].customEventData = data.wStoreID + "." + data.wID + "." + (maxTimes - curTimes);
        if ((data.wStoreID == GameServerProto.PT_STORE_ARENA_RANK_STOREID2 || GlobalVar.srcSwitch()) && (maxTimes - curTimes) == 0){
            model.getChildByName("btnPurchase").getComponent(cc.Button).interactable = false;
            model.getChildByName("btnPurchase").getComponent("ButtonObject").setText("已购买");
        }else{
            model.getChildByName("btnPurchase").getComponent(cc.Button).interactable = true;
            model.getChildByName("btnPurchase").getComponent("ButtonObject").setText("购买");
        }
    },
    playRankStoreModelAni: function (model, index, targetX, targetY, callback) {
        model.stopAllActions();
        model.y = targetY;
        model.x = -1000;
        model.runAction(cc.sequence(cc.delayTime(index * 0.1), cc.moveTo(0.15, targetX, targetY), cc.callFunc(()=>{
            callback && callback();
        })));
    },

    onStoreBtnPurchase(event, customEventData) {
        let arr = customEventData.split('.');
        let id = arr[0];
        let type = arr[1];
        let platformApi = GlobalVar.getPlatformApi();
        if (!platformApi || !GlobalVar.getShareSwitch() || type != GameServerProto.PT_MONEY_FREE){
            GlobalVar.handlerManager().arenaHandler.sendArenaStoreBuyReq(id);
        }else if (platformApi){
            platformApi.showRewardedVideoAd(235, function () {
                GlobalVar.handlerManager().arenaHandler.sendArenaStoreBuyReq(id);
            }, null, false);
        }
    },

    sortRankStoreData: function (data, storeID) {
        let arr = [];
        let self = this;
        function compare() {
            return function (a, b) {
                if (storeID == GameServerProto.PT_STORE_ARENA_RANK_STOREID2){
                    let aCurTimes = self.getCurBuyTimesByID(storeID, a.wID);
                    let bCurTimes = self.getCurBuyTimesByID(storeID, b.wID);
                    if (aCurTimes != bCurTimes){
                        return aCurTimes - bCurTimes;
                    }
                }
                if (a.wNeedRank != b.wNeedRank) {
                    return -(a.wNeedRank - b.wNeedRank);
                }
                return 0;
            }
        }

        for (let key in data) {
            arr.push(data[key]);
        }

        arr.sort(compare());

        return arr;
    },

    getMaxBuyTimes: function (oVecPurchaseNum) {
        let index = 0;
        while (oVecPurchaseNum[index] && GlobalVar.me().vipLevel >= oVecPurchaseNum[index].byVIP) {
            index += 1;
        }
        return oVecPurchaseNum[index - 1].wLimit;
    },
    getCurBuyTimesByID: function (storeID, itemID) {
        let purchaseData = null;
        if (storeID == GameServerProto.PT_STORE_ARENA_RANK_STOREID1) {
            purchaseData = GlobalVar.me().arenaData.rankStoreData;
        } else if (storeID == GameServerProto.PT_STORE_ARENA_RANK_STOREID2) {
            purchaseData = GlobalVar.me().arenaData.rankRewardData;
        }
        purchaseData = purchaseData || [];
        for (let i = 0; i < purchaseData.length; i++) {
            if (purchaseData[i].ID == itemID) {
                return purchaseData[i].BuyTimes;
            }
        }
        return 0;
    },
    onRankStoreBtnPurchase: function (_, customEventData) {
        let arr = customEventData.split('.');
        let sotreID = arr[0];
        let id = arr[1];
        let leftBuyTimes = arr[2];

        if (leftBuyTimes == 1){
            GlobalVar.handlerManager().arenaHandler.sendRankStoreBuyReq(sotreID, id, 1);
            return;
        }else if (leftBuyTimes == 0){
            // console.log(i18n.t("label.4001015"));
            CommonWnd.showMessage(null, CommonWnd.bothConfirmAndCancel, i18n.t('label.4000216'), i18n.t('label.4001022'), null, function () {
                CommonWnd.showRechargeWnd()
            });
            return;
        }
        let data = GlobalVar.tblApi.getDataBySingleKey("TblRankStore", sotreID)[id - 1];
        let costArray = [{ id: GameServerProto.PT_ITEMID_ARENA_POINT, num: data.oVecPrice[0].nCount }];
        let getArray = [{ id: data.oVecGoods[0].wItemID, num: data.oVecGoods[0].nCount }];
        let selectCallback = function (count) {
            return data.oVecPrice[0].nCount * count;
        }
        let confirmCallback = function (count) {
            GlobalVar.handlerManager().arenaHandler.sendRankStoreBuyReq(sotreID, id, count);
        }
        let selectItemData = GlobalVar.tblApi.getDataBySingleKey('TblItem', data.oVecGoods[0].wItemID);
        if (!selectItemData){
            console.log("道具不存在");
            return;
        }
        CommonWnd.showPurchaseWnd(getArray, leftBuyTimes, costArray, "购买", "购买商品", confirmCallback, null, selectCallback);
    },

    setTabsColor: function (index) {
        if (index == undefined || index < 0 || index >= this.nodeTabs.length) {
            index = this.curIndex;
        }
        this.curIndex = index;
        for (let i = 0; i < this.nodeTabs.childrenCount; i++) {
            if (index == i) {
                this.nodeTabs.children[i].getComponent("RemoteSprite").setFrame(1);
            } else {
                this.nodeTabs.children[i].getComponent("RemoteSprite").setFrame(0);
            }
        }
    },
    clickTab: function (event, index) {
        if (this.curIndex == index) {
            return;
        }
        if (index == TAB_RANK_STORE) {
            if (!GlobalVar.me().arenaData.rankStoreData) {
                this.curIndex = index;
                GlobalVar.handlerManager().arenaHandler.sendRankStoreDataReq(GameServerProto.PT_STORE_ARENA_RANK_STOREID1);
                return;
            }
        } else if (index == TAB_RANK_REWARD) {
            if (!GlobalVar.me().arenaData.rankRewardData) {
                this.curIndex = index;
                GlobalVar.handlerManager().arenaHandler.sendRankStoreDataReq(GameServerProto.PT_STORE_ARENA_RANK_STOREID2);
                return;
            }
        }
        this.setTabsColor(index);
        this.initArenaStoreWnd();
        this.initLoopScroll();
    },

    onBtnRefreshStore: function () {
        let refreshLimitTimes = GlobalVar.tblApi.getDataBySingleKey('TblVipRight', GlobalVar.me().vipLevel).wStoreRefreshLimit;

        if (GlobalVar.me().arenaData.arenaStoreRefreshTimes >= refreshLimitTimes){
            GlobalVar.comMsg.showMsg("今日刷新次数用尽(" + refreshLimitTimes + "次)");
            return;
        }

        let refreshPlan = this.refreshPlan;

        if (GlobalVar.me().bagData.getItemCountById(refreshPlan.oVecCost1[0].wItemID) < refreshPlan.oVecCost1[0].nCount) {
            if (GlobalVar.me().bagData.getItemCountById(refreshPlan.oVecCost2[0].wItemID) < refreshPlan.oVecCost2[0].nCount) {
                // GlobalVar.comMsg.showMsg("钻石不足");
                CommonWnd.showNormalFreeGetWnd(GameServerProto.PTERR_DIAMOND_LACK);
                return;
            }
        }
        GlobalVar.handlerManager().arenaHandler.sendArenaStoreRefreshReq(GameServerProto.PT_STORE_ARENA);
    },

    showRefreshTime: function () {
        if (GlobalVar.me().arenaData.arenaExpires == 0){
            return;
        }
        let leftRefreshTime = GlobalVar.me().arenaData.arenaExpires - GlobalVar.me().serverTime;
        if (leftRefreshTime < 0/* && this.refreshComplete*/){
            GlobalVar.handlerManager().arenaHandler.sendRankStoreDataReq(GameServerProto.PT_STORE_ARENA);
            // this.refreshComplete = false;
            return;
        }
        var hours = parseInt(leftRefreshTime / 3600);
        leftRefreshTime = leftRefreshTime % 3600;
        var mins = parseInt(leftRefreshTime / 60) % 60;
        var secs = leftRefreshTime % 60;
        this.labelRefreshLeftTime.string = (hours < 10 ? "0" + hours : hours) + ":" + (mins < 10 ? "0" + mins : mins) + ":" + (secs < 10 ? "0" + secs : secs);
    },

    initPointLabel: function () {
        this.labelPoint.string = GlobalVar.me().arenaData.getPlayerPoints();
    },

    enter: function (isRefresh) {
        if (this.scheduleHandler == -1){
            this.scheduleHandler = GlobalVar.gameTimer().startTimer(this.showRefreshTime.bind(this), 1);
            this.showRefreshTime();
        }

        if (isRefresh) {
            this._super(true);
            this.setTabsColor(0);
            this.initPointLabel();
            this.initCostNode();
            this.initArenaStoreWnd();
        } else {
            this._super(false);
        }
    },

    escape: function (isRefresh) {
        if (this.scheduleHandler != -1) {
            GlobalVar.gameTimer().delTimer(this.scheduleHandler);
            this.scheduleHandler = -1;
        }
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
