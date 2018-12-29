const RootBase = require("RootBase");
const WindowManager = require("windowmgr");
const StoreData = require("StoreData");
const GlobalVar = require("globalvar");
const EventMsgId = require("eventmsgid");
const GameServerProto = require("GameServerProto");
const GlobalFunctions = require("GlobalFunctions");
const CommonWnd = require("CommonWnd");
const WndTypeDefine = require("wndtypedefine");
const weChatAPI = require("weChatAPI");

const AUDIO_LEVEL_UP = 'cdnRes/audio/main/effect/shengji';
const AUDIO_QUALITY_UP = 'cdnRes/audio/main/effect/shengjie2'

var self = null;

cc.Class({
    extends: RootBase,

    properties: {
        itemPrefab: {
            default: null,
            type: cc.Prefab
        },
        expProgressBar: {
            default: null,
            type: cc.ProgressBar
        }
    },

    ctor: function () {
        self = this;
        this.scheduleHandler = null;
        this.chkbox = 0;
    },

    touchMain: function () {
        // cc.log("touchMain");
    },

    onLoad: function () {
        this._super();
        // GlobalVar.eventManager().addEventListener(EventMsgId.EVENT_GUAZAI_CHANGE_NTF, this.onGuazaiChangedCallback, this);
        // GlobalVar.eventManager().addEventListener(EventMsgId.EVENT_GUAZAI_LVUP_NTF, this.onGuazaiLvUpCallback, this);

        this.animeStartParam(0, 0);
        for (let i = 1; i < 6; i++) {
            self.getNodeByName('ItemObject' + i).on('touchstart', self.touchStart, self);
            self.getNodeByName('ItemObject' + i).on('touchend', self.touchEnd, self);
            self.getNodeByName('ItemObject' + i).on('touchcancel', self.touchCancel, self);
        }
    },

    touchStart: function (event) {
        let netNode = cc.find("Canvas/NetNode");
        netNode.active = false;

        self.press = false;
        self.lastItem = false;
        var itemObject = event.target.getComponent("ItemObject");
        if (itemObject.getLabelNumberData() <= 0) {
            return;
        }
        if (itemObject.getLabelNumberData() == 1) self.lastItem = true;
        GlobalVar.gameTimer().delTimer(self.itemTimeHandler);

        self.expBottleTouched(null, itemObject.itemID);
        self.durTime = 0;
        self.curTime = 0.15;
        var canSend = function () {
            var itemObject = event.target.getComponent("ItemObject");
            if (itemObject.getLabelNumberData() <= 0) {
                GlobalVar.gameTimer().delTimer(self.itemTimeHandler);
            }
            self.expBottleTouched(null, itemObject.itemID);
        }
        
        self.itemTimeHandler = GlobalVar.gameTimer().startTimer(function () {
            self.durTime += 0.01;
            if (self.durTime > self.curTime) {
                self.durTime = 0;
                if (self.curTime > 0.05) {
                    self.curTime -= 0.01;
                }
                self.press = true;
                canSend();
            }
        }, 0.01)
    },

    touchEnd: function (event) {
        if (!self.press) {
            var itemObject = event.target.getComponent("ItemObject");
            if (itemObject.getLabelNumberData() <= 0 && !self.lastItem) {
                WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMALITEMGETWAY, function (wnd, name, type) {
                    wnd.getComponent(type).updateInfo(itemObject.itemID, itemObject.getLabelNumberData(), 0, -1);
                });
            }
        }
        GlobalVar.gameTimer().delTimer(self.itemTimeHandler);
        let netNode = cc.find("Canvas/NetNode");
        netNode.active = true;
    },

    touchCancel: function (event) {
        GlobalVar.gameTimer().delTimer(self.itemTimeHandler);
        let netNode = cc.find("Canvas/NetNode");
        netNode.active = true;
    },

    animeStartParam(paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;

        if (paramOpacity == 0 || paramOpacity == 255){
            this.node.getChildByName("imgbg").getChildByName("nodeBottom").active = false;
        }
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            if (GlobalVar.getBannerSwitch()){
                weChatAPI.justShowBanner();
            }
            GlobalVar.eventManager().removeListenerWithTarget(this);
            WindowManager.getInstance().popView(false, null, false, false);
        } else if (name == "Enter") {
            this._super("Enter");
            if (GlobalVar.getBannerSwitch()){
                weChatAPI.justHideBanner();
            }
            this.registerEvent();
            
            this.node.getChildByName("imgbg").getChildByName("nodeBottom").active = true;
        }
    },

    registerEvent: function (){
        GlobalVar.eventManager().addEventListener(EventMsgId.EVENT_GUAZAI_DIRTY_NTF, this.onGuazaiDirtyCallback, this);
        GlobalVar.eventManager().addEventListener(EventMsgId.EVENT_GUAZAI_QUALITY_UP, this.playGuazaiQualityUpEffect, this);
        GlobalVar.eventManager().addEventListener(EventMsgId.EVENT_GUAZAI_LEVEL_UP, this.playGuazaiUseItemEffect, this);
        GlobalVar.eventManager().addEventListener(EventMsgId.EVENT_BAG_ADDITEM_NTF, this.bagAddItem, this);
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

    update: function (dt) {
        if (!this.dirty)
            return;
        this.setParam(GlobalVar.me().guazaiData.getCurPosGuazai());
        this.beforeLevel = this.guazai.GuaZai.Level;
        this.dirty = false;
        this.updateTopPanel();
        this.updateHotPoint();

        let lblLvNum2 = this.getNodeByName("lblLvNum2");

        if (this.chkbox) {
            this.updateQualityUpPanel();
            var qlevel = this.guazaiProp.strQualityDisplay == '' ? 0 : parseInt(this.guazaiProp.strQualityDisplay);
            lblLvNum2.getComponent(cc.Label).string = qlevel;
            if (this.guazaiProp.wNextItemID == 0) {
                this.getNodeByName("lblLvNum3").getComponent(cc.Label).string = 'Max';
                this.getNodeByName('lblLvNum3').color = new cc.color(255, 73, 43, 255);
            } else {
                this.getNodeByName("lblLvNum3").getComponent(cc.Label).string = qlevel + 1;
                this.getNodeByName('lblLvNum3').color = new cc.color(178, 211, 255);
            }
        }
        else {
            this.updateLvlUpPanel();
            lblLvNum2.getComponent(cc.Label).string = this.guazai.GuaZai.Level;

            this.getNodeByName("lblLvNum3").getComponent(cc.Label).string = this.beforeLevel == 200 ? "Max" : this.guazaiNext.GuaZai.Level;
            this.getNodeByName('lblLvNum3').color = this.beforeLevel == 200 ? new cc.color(255, 73, 43, 255) : new cc.color(178, 211, 255);
        }

        this.updateAttrPanel(this.getNodeByName("nodeAttrOld"), 0);
        this.updateAttrPanel(this.getNodeByName("nodeAttrNew"), 1);
    },

    updateHotPoint: function(){
        let position = GlobalVar.tblApi.getDataBySingleKey('TblGuaZai', this.guazai.ItemID).byPosition;
        this.getNodeByName("btnoChange").getChildByName("spriteHot").active = GlobalVar.me().guazaiData.wearHotFlag[position - 1];
        this.getNodeByName("btnoShengji").getChildByName("spriteHot").active = GlobalVar.me().guazaiData.levelUpHotFlag[position - 1];
        this.getNodeByName("btnoShengjie").getChildByName("spriteHot").active = GlobalVar.me().guazaiData.qualityUpHotFlag[position - 1];
        this.getNodeByName("btnoQualityUp").getChildByName("spriteHot").active = GlobalVar.me().guazaiData.qualityUpHotFlag[position - 1];
    },

    setString: function (lbl, text) {
        lbl.string = text;
    },

    setIcon: function (node, itemId, num) {
        if (node.children.length == 0){
            let item = cc.instantiate(this.itemPrefab);
            item.getComponent("ItemObject").updateItem(itemId);
            if (num)
                item.getComponent("ItemObject").setLabelNumberData(num);
            node.addChild(item);
        }else{
            node.children[0].getComponent("ItemObject").updateItem(itemId);
            if (num){
                node.children[0].getComponent("ItemObject").setLabelNumberData(num);
            }
        }

    },

    setParam: function (item) {
        this.dirty = true;
        this.guazai = item;
        this.mapProps = GlobalVar.me().propData.getPropsByGuazaiItem(this.guazai);
        this.guazaiNext = JSON.parse(JSON.stringify(this.guazai));
        let maxLevel = GameServerProto.PT_PLAYER_MAX_LEVEL * 2;
        this.guazaiNext.GuaZai.Level = this.guazaiNext.GuaZai.Level + 1 > maxLevel ? maxLevel : this.guazaiNext.GuaZai.Level + 1;
        this.mapPropsNext = GlobalVar.me().propData.getPropsByGuazaiItem(this.guazaiNext);
        if (this.chkbox) {
            let nextQualityLevel = JSON.parse(JSON.stringify(this.guazai));
            this.guazaiProp = GlobalVar.tblApi.getDataBySingleKey('TblGuaZai', nextQualityLevel.ItemID);
            if (this.guazaiProp.wNextItemID != 0) {
                nextQualityLevel.ItemID = this.guazaiProp.wNextItemID;
                this.mapPropsNext = GlobalVar.me().propData.getPropsByGuazaiItem(nextQualityLevel);
            }
        }
    },

    updateTopPanel: function () {
        let icon = this.getNodeByName("nodeIcon");
        if (icon.children.length == 0){
            let item = cc.instantiate(this.itemPrefab);
            item.getComponent("ItemObject").updateItem(this.guazai.ItemID, -1, this.guazai.GuaZai.Level);
            icon.addChild(item);
        }else{
            icon.children[0].getComponent("ItemObject").updateItem(this.guazai.ItemID, -1, this.guazai.GuaZai.Level);
        }

        let guazaiItem = GlobalVar.tblApi.getDataBySingleKey('TblGuaZai', this.guazai.ItemID);
        this.getNodeByName("lblLvNum1").getComponent(cc.Label).string = this.guazai.GuaZai.Level;
        this.getNodeByName("lblName").getComponent(cc.Label).string = guazaiItem.strName;
        let node = this.getNodeByName("imgAttr");
        this.updateAttrPanel(node, 0);
    },

    updateAttrPanel: function (node, next) {
        let mapProps = {};
        if (next) {
            mapProps = this.mapPropsNext;
        }
        else {
            mapProps = this.mapProps;
        }

        for (let i in mapProps) {
            switch (i) {
                case "1":
                    node.getChildByName("lblAttr1Num").getComponent(cc.Label).string = mapProps[i].Value;
                    break;
                case "4": node.getChildByName("lblAttr3Num").getComponent(cc.Label).string = mapProps[i].Value;
                    break;
                default:
                    let attrName = GlobalVar.tblApi.getDataBySingleKey('TblPropName', i);
                    node.getChildByName("lblAttr2Name").getComponent(cc.Label).string = attrName.strName;
                    node.getChildByName("lblAttr2Num").getComponent(cc.Label).string = mapProps[i].Value;
                    break;
            }
        }
        if (next == 1) {
            var setPanel = function (bool) { 
                if (bool) {
                    node.getChildByName("lblAttr1Num").getComponent(cc.Label).string = 'Max';
                    node.getChildByName("lblAttr2Num").getComponent(cc.Label).string = 'Max';
                    node.getChildByName("lblAttr3Num").getComponent(cc.Label).string = 'Max';
                    node.getChildByName('nodeArrow1').active = false;
                    node.getChildByName('nodeArrow2').active = false;
                    node.getChildByName('nodeArrow3').active = false;
                    node.getChildByName("lblAttr1Num").color = new cc.color(255, 73, 43);
                    node.getChildByName("lblAttr2Num").color = new cc.color(255, 73, 43);
                    node.getChildByName("lblAttr3Num").color = new cc.color(255, 73, 43);
                } else {
                    node.getChildByName('nodeArrow1').active = true;
                    node.getChildByName('nodeArrow2').active = true;
                    node.getChildByName('nodeArrow3').active = true;
                    node.getChildByName("lblAttr1Num").color = new cc.color(178, 211, 255);
                    node.getChildByName("lblAttr2Num").color = new cc.color(178, 211, 255);
                    node.getChildByName("lblAttr3Num").color = new cc.color(178, 211, 255);
                }
            }
            if (!this.chkbox) {
                setPanel(this.beforeLevel == 200);
            } else {
                setPanel(this.guazaiProp.wNextItemID == 0);
            }
        }
    },

    updateQualityUpPanel: function () {
        this.getNodeByName("lblDes").getComponent(cc.Label).string = "挂载升阶";
        let guazaiItem = GlobalVar.tblApi.getDataBySingleKey('TblGuaZai', this.guazai.ItemID);
        this.getNodeByName("nodeShengji").active = false;
        this.getNodeByName("nodeShengjie").active = true;
        // cc.log(guazaiItem);
        if (!guazaiItem.oVecQualityUpNeed[0]) {
            this.getNodeByName("nodeShengjie").active = false;
            return;
        }
        this.setIcon(this.getNodeByName("nodeCostIcon"), guazaiItem.oVecQualityUpNeed[0].wItemID);
        // this.setIcon(this.getNodeByName("nodeCostGoldIcon"), guazaiItem.oVecQualityUpNeed[1].wItemID);
        // this.getNodeByName("nodeCostGoldIcon").getChildByName("ItemObject").getComponent("ItemObject").setSpriteEdgeVisible(false);
        // this.getNodeByName("nodeCostGoldIcon").getChildByName("ItemObject").getComponent("ItemObject").setClick(false);
        this.getNodeByName("lblCostName").getComponent(cc.Label).string = guazaiItem.strName;
        // this.getNodeByName("lblGoldCostNum").getComponent(cc.Label).string = guazaiItem.oVecQualityUpNeed[1].nCount;
        let costNum = guazaiItem.oVecQualityUpNeed[0].nCount;
        let haveNum = GlobalVar.me().bagData.getGuazaiQualityUpMaterialCount(guazaiItem.oVecQualityUpNeed[0].wItemID);

        this.getNodeByName("lblHaveNum").getComponent(cc.RichText).string = "<color=" + (haveNum >= costNum ? "#ffffff" : "#ff0000") + ">" + haveNum + "</c><color=" + "#ffffff" + ">/" + costNum + "</color>";
    },

    updateLvlUpPanel: function () {
        this.getNodeByName("lblDes").getComponent(cc.Label).string = "挂载升级";
        this.getNodeByName("nodeShengjie").active = false;
        this.getNodeByName("nodeShengji").active = true;
        let lvlExp = GlobalVar.tblApi.getDataByMultiKey('TblGuaZaiLevel', this.guazai.Slot, this.guazai.GuaZai.Level).nUpNeedEXP;
        this.expProgressBar.progress = this.guazai.GuaZai.Level == 200 ? 1 : this.guazai.GuaZai.Exp / lvlExp;

        this.getNodeByName("ItemObject1").getComponent("ItemObject").updateItem(23, GlobalVar.me().bagData.getItemCountById(23));
        this.getNodeByName("ItemObject2").getComponent("ItemObject").updateItem(24, GlobalVar.me().bagData.getItemCountById(24));
        this.getNodeByName("ItemObject3").getComponent("ItemObject").updateItem(25, GlobalVar.me().bagData.getItemCountById(25));
        this.getNodeByName("ItemObject4").getComponent("ItemObject").updateItem(26, GlobalVar.me().bagData.getItemCountById(26));
        this.getNodeByName("ItemObject5").getComponent("ItemObject").updateItem(27, GlobalVar.me().bagData.getItemCountById(27));
        for(let i = 1; i<=5; i++){
            let itemID = i+22;
            let itemCount = GlobalVar.me().bagData.getItemCountById(itemID);
            let itemNode = this.getNodeByName("ItemObject" + i);
            itemNode.getComponent("ItemObject").updateItem(itemID, itemCount);
            if (itemCount > 0){
                let effect = itemNode.getChildByName("nodeEffect");
                effect.active = true;
            }else{
                let effect = itemNode.getChildByName("nodeEffect");
                effect.active = false;
            }
        }
    },

    expBottleTouched: function (target, data) {
        if (GlobalVar.me().bagData.getItemCountById(data) <= 0)
            return;
        let GMDT_ITEM_COUNT = {
            ItemID: parseInt(data),
            Count: 1,
        }
        let msg = {
            GuaZaiPos: this.guazai.Slot,
            SrcItem: [GMDT_ITEM_COUNT]
        }
        // cc.log(msg);
        GlobalVar.handlerManager().guazaiHandler.sendReq(GameServerProto.GMID_GUAZAI_LEVELUP_REQ, msg);
    },

    onChkboxTouchedCallback: function (target, data) {
        this.getNodeByName("btnoShengjie").getComponent(cc.Button).interactable = true;
        this.getNodeByName("btnoShengji").getComponent(cc.Button).interactable = true;
        target.target.getComponent(cc.Button).interactable = false;
        this.chkbox = parseInt(data) - 1;
        this.dirty = true;
    },

    onQualityUpBtnTouchedCallback: function () {
        let guazaiItem = GlobalVar.tblApi.getDataBySingleKey('TblGuaZai', this.guazai.ItemID);
        let count = guazaiItem.oVecQualityUpNeed[0].nCount;
        let guazaiSlotArray = GlobalVar.me().bagData.getGuazaiQualityUpMaterialSlot(guazaiItem.oVecQualityUpNeed[0].wItemID);

        if (guazaiSlotArray.length < count) {
            GlobalVar.comMsg.showMsg("升阶材料不足");
            WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMALITEMGETWAY, function (wnd, name, type) {
                wnd.getComponent(type).updateInfo(guazaiItem.oVecQualityUpNeed[0].wItemID, guazaiSlotArray.length, 0, -1);
            });
            return;
        }
        // if (GlobalVar.me().gold < guazaiItem.oVecQualityUpNeed[1].nCount) {
        //     GlobalVar.comMsg.showMsg("金币不足");
        //     return;
        // }



        let msg = {
            GuaZaiPos: this.guazai.Slot,
            SrcPos: guazaiSlotArray.splice(0, count)
        }
        GlobalVar.handlerManager().guazaiHandler.sendReq(GameServerProto.GMID_GUAZAI_QUALITYUP_REQ, msg);
    },

    onBtnChangeTouched: function () {
        let selectFunc = function (item) {
            let guazai = GlobalVar.tblApi.getDataBySingleKey('TblGuaZai', item.ItemID);
            if (guazai.byPosition == GlobalVar.me().guazaiData.guazaiSelectPos)
                return true;
            return false;
        }

        let chooseingCallback = function (data) {
            let msg = {
                GuaZaiPos: GlobalVar.me().guazaiData.guazaiSelectPos,
                BagSlot: data
            }
            GlobalVar.handlerManager().guazaiHandler.sendReq(GameServerProto.GMID_GUAZAI_PUTON_REQ, msg);
        }
        CommonWnd.showItemBag(GameServerProto.PT_ITEMTYPE_GUAZAI, selectFunc, chooseingCallback, this, 0);
    },

    onGuazaiDirtyCallback: function (ack) {
        this.dirty = true;
    },

    playGuazaiQualityUpEffect: function () {
        GlobalVar.soundManager().playEffect(AUDIO_QUALITY_UP);
        let effect = this.node.getChildByName("imgbg").getChildByName("nodeQualityUpEffect");
        effect.active = true;
        effect.getComponent(sp.Skeleton).clearTracks();
        effect.getComponent(sp.Skeleton).setAnimation(0, "animation", false);
        effect.getComponent(sp.Skeleton).setCompleteListener(trackEntry => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            if (animationName == "animation") {
                effect.active = false;
            }
        })
    },

    playGuazaiUseItemEffect: function (event) {
        GlobalVar.soundManager().playEffect(AUDIO_LEVEL_UP);
        if (event.levelUpFlag) {
            let self = this;
            let effect = this.node.getChildByName("imgbg").getChildByName("nodeUseExpItemEffect");
            GlobalFunctions.playDragonBonesAnimation(effect, function () { 
                effect.active = false;
                let levelUpEffect = self.node.getChildByName("imgbg").getChildByName("nodeLevelUpEffect");
                levelUpEffect.active = true;
                GlobalFunctions.playDragonBonesAnimation(levelUpEffect, function () { 
                    levelUpEffect.active = false;
                })
            })
            
        }
    },

    bagAddItem: function (data) {
        this.updateLvlUpPanel();
    },
});
