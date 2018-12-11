const RootBase = require("RootBase");
const WindowManager = require("windowmgr");
const WndTypeDefine = require("wndtypedefine");
const GlobalVar = require('globalvar')
const EventMsgID = require("eventmsgid");
const GlobalFunc = require('GlobalFunctions')
const i18n = require('LanguageData');


const MODE_GET_BUY_ITEM = 0;
const MODE_GET_DRAW_ITEM = 1;
const MODE_GET_NEW_PLANE_OR_GUAZAI = 2;
cc.Class({
    extends: RootBase,

    properties: {
        spriteNode: cc.Node,
        labalItemName: cc.Label,
    },

    onLoad: function () {
        this._super();
        i18n.init('zh');
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_GET_NEW_ITEM_WND;
        

        this.animeStartParam(0, 0);

        if (GlobalFunc.isAllScreen() && !this.fixViewComplete) {
            this.fixViewComplete = true;
            this.fixView();
        }
    },
    fixView: function () {
        let nodeNewRareItem = this.node.getChildByName("nodeNewRareItem");
        nodeNewRareItem.getChildByName('nodetop').y += 80;
        nodeNewRareItem.getChildByName('spriteNode').y += 40;
    },

    animeStartParam(paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;
    },

    initNewRareItemWnd: function (itemID, mode, showType, callback) {
        this.RecvCallback = callback == null ? this.shareFunction : callback;
        this.spriteNode.removeAllChildren();
        let nodeNewRareItem = this.node.getChildByName("nodeNewRareItem");
        // let btnClose = nodeNewRareItem.getChildByName('nodetop').getChildByName("btnClose");
        // btnClose.opacity = 0;
        // btnClose.runAction(cc.sequence(cc.delayTime(2), cc.fadeIn(0)));
        let NEW_MEMBER = 0, NEW_GUAZAI = 1;
        if (mode == NEW_MEMBER) {
            nodeNewRareItem.getChildByName('nodetop').getChildByName("spriteNewMember").active = true;
            nodeNewRareItem.getChildByName('nodetop').getChildByName("spriteNewGuazai").active = false;
            this.addPlane(itemID, showType);
        } else if (mode == NEW_GUAZAI) {
            nodeNewRareItem.getChildByName('nodetop').getChildByName("spriteNewMember").active = false;
            nodeNewRareItem.getChildByName('nodetop').getChildByName("spriteNewGuazai").active = true;
        }
    },

    addPlane: function (id, showType) {
        showType = showType ? showType : 3;
        let PlaneEntity = require('PlaneEntity');
        let planeEntity = new PlaneEntity();
        planeEntity.newPart('Fighter/Fighter_' + id, 1, 'PlaneObject', showType, 0, 0);
        this.spriteNode.addChild(planeEntity);
        planeEntity.part.transform();
        let fighterData = GlobalVar.tblApi.getDataBySingleKey('TblMember', id);
        this.labalItemName.string = fighterData.strName;
    },

    addItem: function (data, mode) {
        let item = null;
        if (this.layoutItemContent.children.length == 0) {
            item = this.itemModel;
        } else {
            item = cc.instantiate(this.itemModel);
        }
        item.opacity = 255;
        item.parent = this.layoutItemContent;
        let itemData = null;
        if (data.Count == 1){
            data.Count = -1;
        }
        if (data.ItemID) {
            itemData = item.getChildByName("ItemObject").getComponent("ItemObject").updateItem(data.ItemID, data.Count);
        } else if (data.wItemID) {
            itemData = item.getChildByName("ItemObject").getComponent("ItemObject").updateItem(data.wItemID, data.nCount)
        }
        if (mode == MODE_GET_DRAW_ITEM) {
            item.getChildByName("labelItemName").getComponent(cc.Label).string = "";
        }else{
            item.getChildByName("labelItemName").getComponent(cc.Label).string = itemData.strName;
        }
        item.getChildByName("labelItemName").color = GlobalFunc.getCCColorByQuality(itemData.wQuality);
        return item;
    },

    sliceItemData: function(itemDatas){
        for (let i = 0; i< itemDatas.length; i++){
            let data = itemDatas[i];
            let itemID = data.ItemID || data.wItemID;
            let tblData = GlobalVar.tblApi.getDataBySingleKey('TblItem', itemID);
            let itemCount = data.Count || data.nCount;
            let overLap = tblData.wOverlap;
            if (itemCount > overLap){
                let sliceCount = Math.floor(itemCount/overLap);
                let sliceLeft = (itemCount % overLap);
                let newArr = [];
                for (let j = 0; j<sliceCount;j++){
                    let newItem = [];
                    newItem.ItemID = itemID;
                    newItem.Count = overLap;
                    newArr.push(newItem);
                }
                if (sliceLeft != 0){
                    let newItem = [];
                    newItem.ItemID = itemID;
                    newItem.Count = overLap;
                    newArr.push(newItem);
                }
                let length = newArr.length;
                itemDatas.splice(i, 1);
                newArr.unshift(i, 0);
                Array.prototype.splice.apply(itemDatas, newArr);
                i += length-1;
            }
        }
    },

    update: function(){

    },

    clickBtnRecv: function () {
        this.RecvCallback();
    },

    shareFunction: function () {
        
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            WindowManager.getInstance().popView(false, null, false);
        } else if (name == "Enter") {
            this._super("Enter");
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

});