const UIBase = require("uibase");
const WindowManager = require("windowmgr");
const StoreData = require("StoreData");
const GlobalVar = require("globalvar");
const EventMsgId = require("eventmsgid");
const GameServerProto = require("GameServerProto");
const GlobalFunctions = require("GlobalFunctions");
const RootBase = require("RootBase");
const weChatAPI = require("weChatAPI");
const CommonWnd = require("CommonWnd");


cc.Class({
    extends: RootBase,

    properties: {
        toggles: {
            default: [],
            type: cc.Node
        },
        funcPanel: {
            default: [],
            type: cc.Node
        },
        itemPrefab: {
            default: [],
            type: cc.Node
        },
    },

    ctor: function () {
        
    },

    onLoad: function () {
        this._super();
        this.animeStartParam(0, 0);
    },

    animeStartParam(paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;
    },

    updateItems: function (node, item1, item2, index) {    //更新icon
        // console.log(item1);
        var node1 = node.getChildByName("ShopGoods1");
        var itemLeft = GlobalVar.tblApi.getDataBySingleKey('TblItem', item1.itemId);
        this.setString(node1.getChildByName("lblShopGoods1").getComponent(cc.Label), itemLeft.strName);
        node1.getChildByName("lblShopGoods1").color = GlobalFunctions.getCCColorByQuality(itemLeft.wQuality);
        this.setString(node1.getChildByName("lblCostCount1").getComponent(cc.Label), item1.costNum);
        this.setIcon(node1.getChildByName("nodeShopGoods1"), itemLeft.wItemID, item1.num);
        this.setIcon(node1.getChildByName("nodeCostIcon1"), item1.costId);
        node1.getChildByName("nodeCostIcon1").getChildByName("ItemObject").getComponent("ItemObject").setSpriteEdgeVisible(false);
        if (item1.state == 0) {
            node1.getChildByName("btno_Buy1").active = false;
            node1.getChildByName("spriteAlreadBuy").active = true;
        }else{
            node1.getChildByName("btno_Buy1").active = true;
            node1.getChildByName("spriteAlreadBuy").active = false;
        }
        var node2 = node.getChildByName("ShopGoods2");
        var itemRight = GlobalVar.tblApi.getDataBySingleKey('TblItem', item2.itemId);
        this.setString(node2.getChildByName("lblShopGoods2").getComponent(cc.Label), itemRight.strName);
        node2.getChildByName("lblShopGoods2").color = GlobalFunctions.getCCColorByQuality(itemRight.wQuality);
        this.setString(node2.getChildByName("lblCostCount2").getComponent(cc.Label), item2.costNum);
        this.setIcon(node2.getChildByName("nodeShopGoods2"), itemRight.wItemID, item2.num);
        this.setIcon(node2.getChildByName("nodeCostIcon2"), item2.costId);
        node2.getChildByName("nodeCostIcon2").getChildByName("ItemObject").getComponent("ItemObject").setSpriteEdgeVisible(false);
        if (item2.state == 0) {
            node2.getChildByName("btno_Buy2").active = false;
            node2.getChildByName("spriteAlreadBuy").active = true;
        }else{
            node2.getChildByName("btno_Buy2").active = true;
            node2.getChildByName("spriteAlreadBuy").active = false;
        }
        this.itemNodeArray.push(node1);
        this.itemNodeArray.push(node2);
    },

    onDestroy: function () {
        // GlobalVar.gameTimer().delTimer(this.scheduleHandler);
    },

    enter: function (isRefresh) {
        // this.scheduleHandler = GlobalVar.gameTimer().startTimer(function () {
        //     self.updateRefreshTime();
        // }, 1);

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

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            GlobalVar.eventManager().removeListenerWithTarget(this);
            WindowManager.getInstance().popView(false, null, false);
        } else if (name == "Enter") {
            this._super("Enter");
            this.registerEvents();
            this.curIndex = -1;
            this.changePanel(null, 0);
            this.getConstData();
        }
    },

    getConstData: function () {
        this.TblMemberPieceCrystal = GlobalVar.tblApi.getData('TblMemberPieceCrystal');
        this.allMembers = GlobalVar.tblApi.getData('TblMember');
    },

    registerEvents: function(){
        GlobalVar.eventManager().addEventListener(EventMsgId.EVENT_MEMBER_STORE_RESULT, this.memberStoreBack, this);


        // let msg = {

        // }
        // GlobalVar.handlerManager().storeHandler.sendReq();
    },

    memberStoreBack: function (data) {
        if (data.ErrCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(event.ErrCode);
        } else {
            this.pieces = data.Piece;
            this.freshBreakPanel();
        }
    },

    setIcon: function (node, itemId, num) {
        let item = node.getChildByName("ItemObject");
        if (!item) {
            item = cc.instantiate(this.itemPrefab);
            node.addChild(item);
        }
        item.getComponent("ItemObject").updateItem(itemId);
        if (num)
            item.getComponent("ItemObject").setLabelNumberData(num);
            
        item.getComponent("ItemObject").setClick(true, 2)
    },

    setRefreshTime: function () {
        if (GlobalVar.networkManager().connectError) {
            return;
        }
        var leftTime = this.time - this.serverTime;
        // if (leftTime < 0)
        if (leftTime < 0 && this.refreshComplete){
            this.requestStoreData();
            this.hasData = false;
            this.refreshComplete = false;
        }
        var hours = parseInt(leftTime / 3600);
        leftTime = leftTime % 3600;
        var mins = parseInt(leftTime / 60) % 60;
        var secs = leftTime % 60;
        this.lblTime.string = (hours < 10 ? "0" + hours : hours) + ":" + (mins < 10 ? "0" + mins : mins) + ":" + (secs < 10 ? "0" + secs : secs);
    },

    updateStorePanel: function (grid, index) {
        console.log("index" + index);
    },

    updateBreakPanel: function (grid, index) {
        grid.active = true;
        let item = this.pieces[index];
        this.setIcon(grid, item.ItemID, item.Count);
        let mem = this.TblMemberPieceCrystal[item.ItemID];
        grid.getChildByName('lblCostCount').getComponent(cc.Label).string = mem.nCrystal;
        grid.getChildByName('lblItemName').getComponent(cc.Label).string = this.allMembers[item.ItemID].strName + '碎片';

    },

    freshStorePanel: function () {
        let scrollNode = this.funcPanel[0].getChildByName('scrollView');
        let updateCallback = this.updateStorePanel.bind(this);
        this.initScroll(scrollNode, this.itemPrefab[0], updateCallback, 8, 2);
    },

    freshBreakPanel: function () {
        let scrollNode = this.funcPanel[1].getChildByName('scrollView');
        let updateCallback = this.updateBreakPanel.bind(this);
        this.initScroll(scrollNode, this.itemPrefab[1], updateCallback, this.pieces.length, 1);
    },

    changePanel: function (event, customData) {
        if (this.curIndex == customData) return;
        this.curIndex = customData;
        for (let i = 0; i < this.toggles.length; i++){
            this.toggles[i].getComponent('RemoteSprite').setFrame(0);
            this.funcPanel[i].active = false;
        }
        this.toggles[customData].getComponent('RemoteSprite').setFrame(1);
        this.funcPanel[customData].active = true;

        if (customData == 0) {

            this.freshStorePanel();
        } else if (customData == 1) {
            GlobalVar.handlerManager().memberHandler.sendMemberPieceDataReq();
        }
    },

    initScroll: function (scrollNode, itemPrefab, updateItem, counts, colNum) {
        let scroll = scrollNode.getComponent(cc.ScrollView);
        scroll.loopScroll.releaseViewItems();
        scroll.loopScroll.setTotalNum(counts);
        scroll.loopScroll.setColNum(colNum);
        scroll.loopScroll.setGapDisX(10);
        scroll.loopScroll.setGapDisY(10);
        scroll.loopScroll.setCreateModel(itemPrefab);
        scroll.loopScroll.registerUpdateItemFunc(function (grid, index) {
            updateItem(grid, index);
        });
        scroll.loopScroll.registerCompleteFunc(function () { })
        scroll.loopScroll.resetView();
    },

    onBtnBreak: function () {
        
    },

});