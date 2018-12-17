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
        spriteBackLight: {
            default: null,
            type: cc.Sprite
        },
        layoutItemContent: {
            default: null,
            type: cc.Node
        },
        itemModel: {
            default: null,
            type: cc.Node,
        },
        itemStack: [],
    },

    onLoad: function () {
        this._super();
        i18n.init('zh');
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_LEVEL_UP_WND;
        

        this.spriteBackLight.node.runAction(cc.repeatForever(cc.rotateBy(8, 360)));
        this.animeStartParam(0, 0);
    },

    animeStartParam(paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;
    },

    initLevelUpWnd: function (levelUpData) {
        this.layoutItemContent.removeAllChildren();
        let count = 0;
        // //钻石
        // if (levelUpData.DiamondReward !== 0) {
        //     count += 1;
        //     let itemData = {}
        //     itemData.ItemID = 3;
        //     itemData.Count = levelUpData.DiamondReward;
        //     this.addItem(itemData);
        // }
        //金币
        if (levelUpData.GoldReward !== 0) {
            count += 1;
            let itemData = {}
            itemData.ItemID = 1;
            itemData.Count = levelUpData.GoldReward;
            this.addItem(itemData);
        }
        //体力
        if (levelUpData.SpReward !== 0) {
            count += 1;
            let itemData = {}
            itemData.ItemID = 15; //体力的ID
            itemData.Count = levelUpData.SpReward;
            this.addItem(itemData);
        }
        let layout = this.layoutItemContent.getComponent(cc.Layout);
        if (count == 1) {
            layout.paddingLeft = 260;
            layout.paddingRight = 260;
        } else if (count == 2) {
            layout.paddingLeft = 170;
            layout.paddingRight = 170;
            layout.spacingX = 100;
        } else if (count == 3) {
            layout.paddingLeft = 115;
            layout.paddingRight = 115;
            layout.spacingX = 50;
        }
        layout.updateLayout();

        let spriteTipBg = this.node.getChildByName("nodeLevelUp").getChildByName("spriteTipBg")
        let labelLevelBefore = spriteTipBg.getChildByName("labelLevelBefore").getComponent(cc.Label);
        let labelLevelCur = spriteTipBg.getChildByName("labelLevelCur").getComponent(cc.Label);
        labelLevelBefore.string = levelUpData.LevelOld;
        labelLevelCur.string = levelUpData.LevelCur;
        this.levelOld = levelUpData.LevelOld;
    },

    addItem: function (data, mode) {
        let item = cc.instantiate(this.itemModel);
        item.opacity = 255;
        item.active = true;
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

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            var self = this;
            WindowManager.getInstance().popView(false, function () {
                let limitLevel = GlobalVar.tblApi.getDataBySingleKey('TblSystem', 24).wOpenLevel;
                if (GlobalVar.me().getLevel() >= limitLevel && self.levelOld < limitLevel) {
                    require('Guide').getInstance().guideToEndless();
                }else{
                    WindowManager.getInstance().resumeView();
                }
            }, false);
        } else if (name == "Enter") {
            this._super("Enter");
            GlobalVar.me().setLevelUpFlag();
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

    onBtnRecv: function () {
        this.close();
    },

});