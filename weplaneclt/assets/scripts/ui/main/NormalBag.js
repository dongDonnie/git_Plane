const GlobalVar = require("globalvar")
const EventMsgID = require("eventmsgid")
const WindowManager = require("windowmgr");
const RootBase = require("RootBase");
const WndTypeDefine = require("wndtypedefine");
const CommonWnd = require("CommonWnd");
const GlobalFunc = require('GlobalFunctions');
const i18n = require('LanguageData');
const BattleManager = require('BattleManager');
const GameServerProto = require("GameServerProto");

var self = null;
cc.Class({
    extends: RootBase,

    properties: {
        labelTitle: {
            default: null,
            type: cc.Label
        },
        btnClose: {
            default: null,
            type: cc.Button
        },
        labelSizeName: {
            default: null,
            type: cc.Label
        },
        labelSize: {
            default: null,
            type: cc.Label
        },
        btnAdd: {
            default: null,
            type: cc.Button
        },
        itemPrefab: {
            default: null,
            type: cc.Prefab
        },
        itemGrid: {
            default: null,
            type: cc.Node
        },
        bagScroll: {
            default: null,
            type: cc.ScrollView
        },
        showType: {
            default: -1,
            visible: false,
        },
        selectCallback: {
            default: null,
            visible: false,
        },
        choosingCallback: {
            default: null,
            visible: false,
        },
        gridCounts: {
            default: 0,
            visible: false,
        },
        bagData: [],
        gridStack: [],
    },

    onLoad: function () {
        this._super();
        i18n.init('zh');
        self = this;
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMALBAG;
        this.animeStartParam(0);

        if (!GlobalFunc.isAllScreen()) {
            // this.fixView();
        }
    },

    fixView: function () {
        let mainWidget = this.node.getComponent(cc.Widget);
        mainWidget.bottom -= 60;
        mainWidget.updateAlignment();
    },

    animeStartParam(num) {
        this.node.opacity = num;
    },

    chooseModeByOpenType: function (openType) {

        if (openType == 1) {
            this.getNodeByName("nodeType1").active = true;
            this.getNodeByName("nodeType2").active = false;
            let bagWidget = this.node.getComponent(cc.Widget);
            bagWidget.bottom = 90;
            if (!GlobalFunc.isAllScreen()) {
                bagWidget.bottom -= 35;
            }
            bagWidget.updateAlignment();
            let Widget = this.bagScroll.node.getComponent(cc.Widget);
            Widget.top = 40;
            Widget.bottom = 80;
            Widget.updateAlignment();
        }
        else {
            this.getNodeByName("nodeType2").active = true;
            this.getNodeByName("nodeType1").active = false;
            let bagWidget = this.node.getComponent(cc.Widget);
            bagWidget.bottom = 90;
            bagWidget.updateAlignment();
            let Widget = this.bagScroll.node.getComponent(cc.Widget);
            Widget.top = 258;
            Widget.bottom = 218;
            if (GlobalFunc.isAllScreen()) {
                Widget.top += 120;
                Widget.bottom += 120;
            }
            Widget.updateAlignment();
        }

    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            GlobalVar.eventManager().removeListenerWithTarget(this);
            if (!this.deleteMode) {
                WindowManager.getInstance().popView(false, null, false);
            } else {
                if (WindowManager.getInstance().findViewIndex(WndTypeDefine.WindowType.E_DT_GUAZAIMAIN_WND) == -1) {
                    let uiNode = cc.find("Canvas/UINode");
                    BattleManager.getInstance().quitOutSide();
                    BattleManager.getInstance().startOutside(uiNode.getChildByName('UIMain').getChildByName('nodeBottom').getChildByName('planeNode'), GlobalVar.me().memberData.getStandingByFighterID(), true);
                }
            }
        } else if (name == "Enter") {
            this._super("Enter");
            this.showBag(GlobalVar.me().bagData.getData(), true);
            this.deleteMode = false;
            this.canClose = false;
            GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_BAG_UNLOCK_NTF, this.onBagUnlockEvent, this);
            GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_ITEM_SELL_NTF, this.onItemSellEvent, this);
            GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_ITEM_USE_RESULT, this.getUseItemResult, this);
            if (WindowManager.getInstance().findViewIndex(WndTypeDefine.WindowType.E_DT_GUAZAIMAIN_WND) == -1) {
                BattleManager.getInstance().quitOutSide();
            }
        }
    },

    getUseItemResult: function (event) {
        if (event.ErrCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        this.showBag(GlobalVar.me().bagData.getData());
    },

    addSize: function () {
        let useDiamond = GlobalVar.tblApi.getDataBySingleKey('TblItemBagUnlock', this.gridCounts - 100 + 20);
        if (useDiamond != null) {
            let str = i18n.t('label.4000215').replace('%d', useDiamond.nDiamond);
            CommonWnd.showMessage(null, CommonWnd.bothConfirmAndCancel, i18n.t('label.4000214'), str, null, this.expandBagSize, null);
        } else {
            CommonWnd.showMessage(null, CommonWnd.oneConfirm, i18n.t('label.4000216'), i18n.t('label.4000217'));
        }
    },

    expandBagSize: function () {
        GlobalVar.handlerManager().bagHandler.sendBagUnlockReq();
    },

    onBagUnlockEvent: function (msg) {
        if (msg.data.ErrCode == 63) {
            CommonWnd.showMessage(null, CommonWnd.oneConfirm, i18n.t('label.4000216'), i18n.t('label.4000221'));
            return;
        }
        this.showBag(GlobalVar.me().bagData.getData(), true);
        GlobalVar.comMsg.showMsg(i18n.t('label.4000220'));
    },

    sellItem: function (slot, count) {
        let item = GlobalVar.me().bagData.getItemBySlot(slot);
        let itemData = GlobalVar.tblApi.getDataBySingleKey('TblItem', item.ItemID);
        this.sellItemGetGold = count * itemData.nSellPrice
        GlobalVar.handlerManager().bagHandler.sendItemSellReq(slot, count);
    },

    onItemSellEvent: function (msg) {
        if (msg.data.ItemChange.Items.length == 0) {
            CommonWnd.showMessage(null, CommonWnd.oneConfirm, i18n.t('label.4000216'), i18n.t('label.4000211'));
            return;
        }
        self.showBag(GlobalVar.me().bagData.getData(), true);
        CommonWnd.showMessage(null, CommonWnd.oneConfirm, i18n.t('label.4000216'), i18n.t('label.4000218').replace("%d", this.sellItemGetGold));
    },

    showBag: function (data, needScrollToTop) {
        this.closing = false;
        needScrollToTop = typeof needScrollToTop !== 'undefined' ? needScrollToTop : false;
        this.bagData = [];
        if (this.showType == -1) {
            // this.bagData = data.Items;
            for (let i = 0; i<data.Items.length; i++){
                if (data.Items[i].Type != GameServerProto.PT_ITEMTYPE_VALUE){
                    this.bagData.push(data.Items[i]);
                }
            }
            this.setSizeVisible(true);
            this.gridCounts = data.Unlock + 100;
            this.initBag(this.gridCounts);
            this.initItem();
            if (needScrollToTop) {
                this.bagScroll.scrollToTop();
            }
            let str = this.bagData.length + "/" + this.gridCounts;
            this.setSizeGrid(str);
        } else {
            for (let i = 0; i < data.Items.length; i++) {
                if (data.Items[i].Type == this.showType) {
                    if (!!this.selectCallback) {
                        if (this.selectCallback(data.Items[i])) {
                            this.bagData.push(data.Items[i]);
                        }
                    } else {
                        this.bagData.push(data.Items[i]);
                    }
                }
            }
            this.setSizeVisible(false);
            this.gridCounts = this.bagData.length <= 15 ? 15 : (parseInt(this.bagData.length / 5) * 5 + 5);
            this.initBag(this.gridCounts);
            this.initItem();
            if (needScrollToTop) {
                this.bagScroll.scrollToTop();
            }
        }
    },

    initItem: function () {
        // if (this.bagData.length == 0) {
        //     this.itemGrid.active = false;
        // } else {
        //     this.itemGrid.active = true;
        // }
        // let useFlag = GlobalVar.me().bagData.canUseItemHotFlag;
        // for (let i = 0; i < this.bagData.length; i++) {
        //     let item = this.addItem(this.bagData[i].ItemID, this.bagData[i].Count, this.bagData[i].Slot, this.bagData[i].Type, useFlag[i]);
        //     if (this.gridStack[i]) {
        //         this.gridStack[i].addChild(item);
        //     }
        // }
        this.addItem(0);
    },

    addItem: function (i) {
        if (!this.bagData[i] || this.closing) return;
        if (i >= this.gridStack.length) return;

        let item = null;
        if (this.gridStack[i].children[0]){
            item = this.gridStack[i].children[0];
        }else{
            item = cc.instantiate(this.itemPrefab);
        }

        if (this.bagData[i].Type == GameServerProto.PT_ITEMTYPE_GUAZAI){
            item.getComponent("ItemObject").updateItem(this.bagData[i].ItemID, this.bagData[i].Count, this.bagData[i].GuaZai.Level);
        }else{
            item.getComponent("ItemObject").updateItem(this.bagData[i].ItemID, this.bagData[i].Count);
        }

        if (!!this.choosingCallback) {
            item.getComponent("ItemObject").setClick(true, this.bagData[i].Type + 100, this.choosingCallback, this.close.bind(this));
        } else {
            item.getComponent("ItemObject").setClick(true, 0);
        }
        item.getComponent("ItemObject").setSlot(this.bagData[i].Slot);

        if (this.showType == GameServerProto.PT_ITEMTYPE_GUAZAI){

        }else{
            if (!!GlobalVar.me().bagData.canUseItemHotFlag[i]){
                item.getComponent("ItemObject").setSpriteHotPointData(1);
            }else{
                item.getComponent("ItemObject").setSpriteHotPointData(-1);
            }
        }


        if (this.gridStack[i].children[0]){
            this.addItem(i + 1);
        } else {
            if (this.gridStack[i]) {
                this.gridStack[i].addChild(item);
            }

            let self = this;
            this.node.runAction(cc.sequence(cc.delayTime(0.032), cc.callFunc(()=>{
                if (i + 1< self.bagData.length){
                    self.addItem(i + 1);
                }
            })))
        }
    },

    addItemByIndex: function (grid, index) {
        if (this.closing) return;

        if (!this.bagData[index]){
            if (grid.children[0]){
                grid.children[0].active = false;
            }

            return;
        }

        let item = null;
        if (grid.children[0]){
            item = grid.children[0];
            item.active = true;
        }else{
            item = cc.instantiate(this.itemPrefab);
            if (grid) {
                grid.addChild(item);
            }
        }
        if (this.bagData[index].Type == GameServerProto.PT_ITEMTYPE_GUAZAI){
            item.getComponent("ItemObject").updateItem(this.bagData[index].ItemID, this.bagData[index].Count, this.bagData[index].GuaZai.Level);
        }else{
            item.getComponent("ItemObject").updateItem(this.bagData[index].ItemID, this.bagData[index].Count);
        }
        if (!!this.choosingCallback) {
            item.getComponent("ItemObject").setClick(true, this.bagData[index].Type + 100, this.choosingCallback, this.close.bind(this));
        } else {
            item.getComponent("ItemObject").setClick(true, 0);
        }
        item.getComponent("ItemObject").setSlot(this.bagData[index].Slot);
        if (this.showType == GameServerProto.PT_ITEMTYPE_GUAZAI){
            
        }else{
            if (!!GlobalVar.me().bagData.canUseItemHotFlag[index]){
                item.getComponent("ItemObject").setSpriteHotPointData(1);
            }else{
                item.getComponent("ItemObject").setSpriteHotPointData(-1);
            }
        }

    },

    // addItem: function (index, id, num, slot, type, flag) {
    //     let item = cc.instantiate(this.itemPrefab);
    //     item.getComponent("ItemObject").updateItem(id, num);
    //     if (!!this.choosingCallback) {
    //         item.getComponent("ItemObject").setClick(true, type + 100, this.choosingCallback, this.close.bind(this));
    //     } else {
    //         item.getComponent("ItemObject").setClick(true, 0);
    //     }
    //     item.getComponent("ItemObject").setSlot(slot);
    //     if (!!flag){
    //         item.getComponent("ItemObject").setSpriteHotPointData(1);
    //     }
    //     if (this.gridStack[i]) {
    //         this.gridStack[i].addChild(item);
    //     }
    //     // this.runAction
    // },

    initBag: function (counts) {
        let self = this;
        this.bagScroll.loopScroll.releaseViewItems();
        this.bagScroll.loopScroll.setTotalNum(counts);
        this.bagScroll.loopScroll.setColNum(5);
        this.bagScroll.loopScroll.setGapDisX(20);
        this.bagScroll.loopScroll.setGapDisY(20);
        this.bagScroll.loopScroll.setCreateModel(this.itemGrid);
        this.bagScroll.loopScroll.registerUpdateItemFunc(function(grid, index){
            self.addItemByIndex(grid, index);
        });
        this.bagScroll.loopScroll.registerCompleteFunc(function(){
            self.canClose = true;
        })
        this.bagScroll.loopScroll.resetView();

        // for (let j = this.gridStack.length; j < counts; j++) {
        //     let grid = this.addGrid();
        //     this.gridStack.push(grid);
        // }

        // if (this.gridStack.length > this.bagData.length){
        //     for (let i = this.bagData.length; i< this.gridStack.length; i++){
        //         if (this.gridStack[i].children[0]){
        //             this.gridStack[i].children[0].destroy();
        //         }
        //     }
        // }
    },

    addGrid: function () {
        let grid = cc.instantiate(this.itemGrid);
        this.bagScroll.content.addChild(grid);
        return grid;
    },

    setTitle: function (text) {
        this.labelTitle.string = text;
    },

    setSizeName: function (text) {
        this.labelSizeName.string = text;
    },

    setSizeGrid: function (text) {
        this.labelSize.string = text;
    },

    setSizeVisible: function (visible) {
        visible = typeof visible !== 'undefined' ? visible : true;
        this.getNodeByName("spriteSize").active = visible;
    },

    setShowType: function (type, callback) {
        type = typeof type !== 'undefined' ? type : -1;
        this.showType = type;
        if (!!callback) {
            this.selectCallback = callback;
        }
    },

    setGridCallback: function (callback) {
        if (!!callback) {
            this.choosingCallback = callback;
        }
    },

    close: function(){
        if (!this.canClose){
            return;
        }
        this.closing = true;
        this.choosingCallback = null;
        this.selectCallback = null;
        // for (let i = 0; i<this.gridStack.length; i++){
        //     if (this.gridStack[i].children[0]){
        //         let item = this.gridStack[i].children[0];
        //         item.destroy();
        //     }
        // }
        // this.gridStack.splice(0);
        this.bagScroll.loopScroll.releaseViewItems();
        this._super();
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

});