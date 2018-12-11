const RootBase = require("RootBase");
const WindowManager = require("windowmgr");
const StoreData = require("StoreData");
const GlobalVar = require("globalvar");
const EventMsgId = require("eventmsgid");
const GameServerProto = require("GameServerProto");
const GlobalFunctions = require("GlobalFunctions");
const CommonWnd = require("CommonWnd");

const DIAMOND_ID = 3;

var self = null;

cc.Class({
    extends: RootBase,

    properties: {
        main: {
            default: null,
            type: cc.Button
        },
        itemPrefab: {
            default: null,
            type: cc.Prefab
        },
        lblTitle: {
            default: null,
            type: cc.Label
        },
        nodeGoods: {
            default: null,
            type: cc.Node
        },
        imgBg: {
            default: null,
            type: cc.Sprite
        },
        lblName: {
            default: null,
            type: cc.Label
        },
        lblDescribe: {
            default: null,
            type: cc.Label
        },
        lblCostNum: {
            default: null,
            type: cc.Label
        },
        nodeCostIcon: {
            default: null,
            type: cc.Node
        },
        lblCanBuy: {
            default: null,
            type: cc.Label
        },
        lblCanBuyNum: {
            default: null,
            type: cc.Label
        },
        nodeSVContent: {
            default: null,
            type: cc.Node
        },

        dirty: true,
        refreshTimes: 0,
        itemArray: [],
        describe: "",
        type: 0,
        hasData: false,
        animeEnd: false,
        countTime: -1,
        firstTimeIn: true,
    },

    ctor: function () {
        self = this;
        this.scheduleHandler = null;
        this.itemList = [];
    },

    touchMain: function () {
        // cc.log("touchMain");
    },

    onLoad: function () {
        this._super();
        this.nodeSVContent.removeAllChildren();
    },

    animeStartParam(paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            for (let i = 0; i< this.nodeSVContent.children.length; i++){
                this.nodeSVContent.children[i].x = -1000;
            }
            GlobalVar.eventManager().removeListenerWithTarget(this);
            WindowManager.getInstance().popView(false, null, false, false);
        } else if (name == "Enter") {
            this._super("Enter");
            GlobalVar.eventManager().addEventListener(EventMsgId.EVENT_LIMIT_STORE_DATA_NTF, this.onLimitStoreDataGet, this);
            GlobalVar.eventManager().addEventListener(EventMsgId.EVENT_LIMIT_STORE_BUY_NTF, this.onLimitStoreBuyDataGet, this);
            this.requestStoreData();
            //接到消息后再初始化窗口
            this.animeEnd = true;
            this.countTime = -1;
            this.canClose = false;
        }
    },

    requestStoreData: function(){
        let msg = {
            Type: this.storeType,
        };
        // cc.log("发送数据");
        GlobalVar.handlerManager().limitStoreHandler.sendReq(GameServerProto.GMID_FULI_GIFT_DATA_REQ, msg);
    },

    setString: function (lbl, text) {
        lbl.string = text;
    },

    setChildComponentStringByName: function (node, childName, text, color) {
        var label = node.getChildByName(childName).getComponent(cc.Label);
        label.string = text;
        if (color)
            label.color = color;

    },

    setIcon: function (node, itemId, num) {
        if (node.children.length == 0){
            let item = cc.instantiate(this.itemPrefab);
            item.getComponent("ItemObject").updateItem(itemId);
            if (num)
                item.getComponent("ItemObject").setLabelNumberData(num);
            node.addChild(item);
            item.getComponent("ItemObject").setClick(true, 2)
        }else{
            node.children[0].getComponent("ItemObject").updateItem(itemId);
            node.children[0].getComponent("ItemObject").setClick(true, 2)
            if (num > 1){
                node.children[0].getComponent("ItemObject").setLabelNumberData(num);
            }
        }

    },

    pop: function () {
        // cc.log("pop");
        WindowManager.getInstance().popView(false);
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
        if (!!this.scheduleHandler) {
            GlobalVar.gameTimer().delTimer(this.scheduleHandler);
            this.scheduleHandler = null;
        }
    },

    update: function (dt) {
        if (!this.dirty)
            return;
        if (!this.hasData)
            return;
        if (!this.animeEnd)
            return;
        if (this.countTime / 5 >= this.itemArray.length - 1)
            return;
        this.countTime++;
        if (this.firstTimeIn) {
            this.nodeSVContent.removeAllChildren();
            this.firstTimeIn = false;
        }
        if (this.countTime % 5 == 0)
            this.updateItemList(this.countTime / 5);
    },

    updateItemList: function (i) {
        let node = this.nodeSVContent.children[i];
        if (!node) {
            node = cc.instantiate(this.nodeGoods);
            node.x = 0;
            // node.runAction(cc.moveBy(0.2, 1000, 0));
            this.nodeSVContent.addChild(node);
            if (i == this.itemArray.length - 1){
                this.canClose = true;
            }
        }else{
            node.active = true;
            node.runAction(cc.moveTo(0.2, 0, 0));
            if (i == this.itemArray.length - 1){
                let self = this;
                this.scheduleOnce(()=>{
                    self.canClose = true;
                }, 0.2)
            }
        }
        this.setIcon(node.getChildByName("nodeGoodsIcon"), this.itemArray[i].stItems.wItemID, this.itemArray[i].stItems.nCount);
        this.setDiscount(node, this.itemArray[i]);
        this.setChildComponentStringByName(node, "lblName", this.itemArray[i].strName);
        this.setChildComponentStringByName(node, "lblDescribe", this.itemArray[i].strDesc);
        var bought = GlobalVar.me().limitStoreData.findFuliGiftById(this.itemArray[i].wID);
        var cost = GlobalVar.me().limitStoreData.getBuyCostNum(bought.Num + 1, bought.Num + 1, this.itemArray[i].oVecCost);
        this.setChildComponentStringByName(node, "lblCostNum", cost);
        this.setChildComponentStringByName(node, "lblCanBuyNum", this.itemArray[i].wLimit - bought.Num);
        if (this.itemArray[i].wLimit - bought.Num <= 0){
            node.getChildByName("btnoBuy").getComponent(cc.Button).interactable = false;
        }else{
            node.getChildByName("btnoBuy").getComponent(cc.Button).interactable = true;
        }
        node.getChildByName("btnoBuy").newTag = this.itemArray[i].wID;
        // this.itemList[this.itemArray[i].wID] = node.getChildByName("btnoBuy");
        this.setIcon(node.getChildByName("nodeCostIcon"), DIAMOND_ID);
        node.getChildByName("nodeCostIcon").getChildByName("ItemObject").getComponent("ItemObject").setSpriteEdgeVisible(false);
        // cc.log(this.nodeSVContent);
    },

    setDiscount: function (node, item) {
        var bought = GlobalVar.me().limitStoreData.findFuliGiftById(item.wID);
        var firstreward = node.getChildByName('firstreward');
        if (bought.Num >= item.wLimit) {
            firstreward.active = false;
            return;
        }
        for (let i = item.oVecDiscount.length - 1; i >= 0; i--) {
            if (bought.Num+1 >= item.oVecDiscount[i].byNum) {
                let discount = item.oVecDiscount[i].nCost / 10 + '折';
                firstreward.getChildByName('label').getComponent(cc.Label).string = discount;
                break;
            }
        }
    },
    
    setStoreType: function (type) {
        this.storeType = type;
        GlobalVar.me().limitStoreData.nowType = type;
        this.itemArray = GlobalVar.me().limitStoreData.typeMap[type];
        this.dirty = true;
    },

    onLimitStoreDataGet: function (data) {
        this.gift = data; //获取当日已经购买的次数
        this.hasData = true;
    },

    onBuyBtnTouched: function (event) {
        // cc.log(event);
        var id = event.target.newTag;
        GlobalVar.me().limitStoreData.limitStoreBuyId = id;
        var bought = GlobalVar.me().limitStoreData.findFuliGiftById(id);
        var item = self.getItemBuyId(id);
        var costArray = [];
        switch (item.byType) {
            case GameServerProto.PT_MONEY_DIAMOND:
                var itemcost = { id: DIAMOND_ID, num: 50 };
                costArray.push(itemcost);
                break;
            default:
                break;
        }
        let getArray = [];
        let itemGet = {id: item.stItems.wItemID, num: item.stItems.nCount};
        getArray.push(itemGet);

        var callback = function (end) {
            var id = GlobalVar.me().limitStoreData.limitStoreBuyId;
            var bought = GlobalVar.me().limitStoreData.findFuliGiftById(id);
            var item = GlobalVar.tblApi.getDataBySingleKey('TblFuLiGiftLimit', id);

            return GlobalVar.me().limitStoreData.getBuyCostNum(bought.Num + 1, bought.Num + end, item.oVecCost);
        }

        var confirmCallback = function (num) {
            let msg = {
                Type: GlobalVar.me().limitStoreData.nowType,
                ID: GlobalVar.me().limitStoreData.limitStoreBuyId,
                Num: num,
            }
            // cc.log(msg);
            GlobalVar.handlerManager().limitStoreHandler.sendReq(GameServerProto.GMID_FULI_GIFT_BUY_REQ, msg);
        }

        if (item.wLimit - bought.Num <= 0)
            return;

        let selectItemData = GlobalVar.tblApi.getDataBySingleKey('TblItem', item.stItems.wItemID);
        if (!selectItemData){
            return;
        }
        CommonWnd.showPurchaseWnd(getArray, item.wLimit - bought.Num, costArray, "购买", "购买商品", confirmCallback, null, callback);
    },

    getItemBuyId: function (id) {
        for (let i = 0; i < this.itemArray.length; i++) {
            if (id == this.itemArray[i].wID)
                return this.itemArray[i];
        }
        return null;
    },

    onLimitStoreBuyDataGet: function (event) {
        if (event.ErrCode != GameServerProto.PTERR_SUCCESS){
            if (event.ErrCode == GameServerProto.PTERR_DIAMOND_LACK){
                CommonWnd.showNormalFreeGetWnd(event.ErrCode);
            } else{
                GlobalVar.comMsg.errorWarning(event.ErrCode);
            }
            return;
        }


        CommonWnd.showTreasureExploit(event.Item);

        for (let j = 0; j < this.itemArray.length; j++)
        {
            this.updateItemList(j);
        }
    },

    close: function () {

        if (!this.canClose){
            return;
        }

        for (let i = 0; i< this.nodeSVContent.children.length; i++){
            this.nodeSVContent.children[i].active = false;
        }
        this._super();
    },

});


