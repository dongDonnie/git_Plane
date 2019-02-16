const RootBase = require("RootBase");
const WindowManager = require("windowmgr");
const GlobalVar = require("globalvar");
const EventMsgId = require("eventmsgid");
const GameServerProto = require("GameServerProto");
const GlobalFunctions = require("GlobalFunctions");
const CommonWnd = require("CommonWnd");
const WndTypeDefine = require("wndtypedefine");

const AUDIO_LEVEL_UP = 'cdnRes/audio/main/effect/shengji';
const AUDIO_QUALITY_UP = 'cdnRes/audio/main/effect/shengjie2'

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
        this.chkbox = 0;
    },

    setParam: function (item) {
        this.guazai = JSON.parse(JSON.stringify(item));
        this.chkbox = 0;
        this.wearPosition = GlobalVar.tblApi.getDataBySingleKey('TblGuaZai', this.guazai.ItemID).byPosition;
        this.mapProps = GlobalVar.me().propData.getPropsByGuazaiItem(this.guazai);
        this.guazaiNext = JSON.parse(JSON.stringify(item));
        let maxLevel = GameServerProto.PT_PLAYER_MAX_LEVEL * 2;
        this.guazaiNext.GuaZai.Level = this.guazaiNext.GuaZai.Level + 1 > maxLevel ? maxLevel : this.guazaiNext.GuaZai.Level + 1;
        this.mapPropsNext = GlobalVar.me().propData.getPropsByGuazaiItem(this.guazaiNext);

        this.getNodeByName("btnoShengjie").getComponent(cc.Button).interactable = true;
        this.getNodeByName("btnoShengji").getComponent(cc.Button).interactable = false;
        this.getNodeByName("nodeShengjie").active = false;
        this.getNodeByName("nodeShengji").active = true;
        this.updateTopPanel();
        this.updateHotPoint();
        this.updateAttrPanel(this.getNodeByName("nodeAttrOld"), 0);
        this.updateAttrPanel(this.getNodeByName("nodeAttrNew"), 1);
        this.updateLvlUpPanel();
    },

    onLoad: function () {
        this._super();

        this.typeName = WndTypeDefine.WindowType.E_DT_GUAZAIADVANCE_WND;
        this.animeStartParam(0, 0);
        this.oldLevel = GlobalVar.me().guazaiData.getCurPosGuazai().GuaZai.Level;
        this.oldExp = GlobalVar.me().guazaiData.getCurPosGuazai().GuaZai.Exp;
        for (let i = 1; i < 6; i++) {
            this.getNodeByName('ItemObject' + i).on('touchstart', this.touchStart.bind(this), this);
            this.getNodeByName('ItemObject' + i).on('touchend', this.touchEnd.bind(this), this);
            this.getNodeByName('ItemObject' + i).on('touchcancel', this.touchCancel.bind(this), this);
        }
    },

    touchStart: function (event) {
        let netNode = cc.find("Canvas/NetNode");
        netNode.active = false;

        this.press = false;
        this.lastItem = false;
        var itemObject = event.target.getComponent("ItemObject");
        if (itemObject.getBagNumberData() <= 0) {
            return;
        }
        if (itemObject.getBagNumberData() == 1) this.lastItem = true;
        this.unschedule(this.PressLevelUp);

        this.durTime = 0;
        this.curTime = 0.2;
        this.maxTime = 0.2;
        let self = this;
        this.expBottleTouched(null, itemObject.itemID);
        var canSend = function () {
            var itemObject = event.target.getComponent("ItemObject");
            if (itemObject.getBagNumberData() <= 0) {
                self.unschedule(self.PressLevelUp);
            }
            self.expBottleTouched(null, itemObject.itemID);
        }

        this.PressLevelUp =  function (dt) {
            self.durTime += dt;
            if (self.durTime > self.maxTime) {
                self.durTime = 0;
                if (self.curTime > 0.04) {
                    self.curTime -= 0.01;
                }
                self.press = true;
                canSend();
            }
        }
        
        this.schedule(this.PressLevelUp, 0.01);
    },

    touchEnd: function (event) {
        if (!this.press) {
            var itemObject = event.target.getComponent("ItemObject");
            if (itemObject.getBagNumberData() <= 0 && !this.lastItem) {
                WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMALITEMGETWAY, function (wnd, name, type) {
                    wnd.getComponent(type).updateInfo(itemObject.itemID, itemObject.getBagNumberData(), 0, -1);
                });
            }
        }
        this.unschedule(this.PressLevelUp);
        let netNode = cc.find("Canvas/NetNode");
        netNode.active = true;
    },

    touchCancel: function (event) {
        this.unschedule(this.PressLevelUp);
        let netNode = cc.find("Canvas/NetNode");
        netNode.active = true;
    },

    expBottleTouched: function (target, data) {
        if (GlobalVar.me().bagData.getItemCountById(data) <= 0)
            return;
        let count = GlobalVar.me().bagData.getItemCountById(data);
        let useCount = parseInt(this.maxTime * 100 / (this.curTime * 100));
        let num = useCount > count ? count : useCount;
        let GMDT_ITEM_COUNT = {
            ItemID: parseInt(data),
            Count: num,
        }
        let msg = {
            GuaZaiPos: this.guazai.Slot,
            SrcItem: [GMDT_ITEM_COUNT]
        }
        // cc.log(msg);
        GlobalVar.handlerManager().guazaiHandler.sendReq(GameServerProto.GMID_GUAZAI_LEVELUP_REQ, msg);
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
            GlobalVar.eventManager().removeListenerWithTarget(this);
            WindowManager.getInstance().popView(false, null, false, false);
        } else if (name == "Enter") {
            this._super("Enter");
            this.registerEvent();
            this.node.getChildByName("imgbg").getChildByName("nodeBottom").active = true;
        }
    },

    registerEvent: function (){
        GlobalVar.eventManager().addEventListener(EventMsgId.EVENT_GUAZAI_ADDEXP_NTF, this.onGuazaiAddexpNtf, this);
        GlobalVar.eventManager().addEventListener(EventMsgId.EVENT_GUAZAI_QUALITY_UP, this.playGuazaiQualityUpEffect, this);
        GlobalVar.eventManager().addEventListener(EventMsgId.EVENT_GUAZAI_LEVEL_UP, this.playGuazaiUseItemEffect, this);
        GlobalVar.eventManager().addEventListener(EventMsgId.EVENT_BAG_ADDITEM_NTF, this.bagAddItem, this);
        GlobalVar.eventManager().addEventListener(EventMsgId.EVENT_GUAZAI_PUTON_NTF, this.guazaiPutOnNtf, this);
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

    

    updateHotPoint: function(){
        this.getNodeByName("btnoChange").getChildByName("spriteHot").active = GlobalVar.me().guazaiData.wearHotFlag[this.wearPosition - 1];
        this.getNodeByName("btnoShengji").getChildByName("spriteHot").active = GlobalVar.me().guazaiData.levelUpHotFlag[this.wearPosition - 1];
        this.getNodeByName("btnoShengjie").getChildByName("spriteHot").active = GlobalVar.me().guazaiData.qualityUpHotFlag[this.wearPosition - 1];
        this.getNodeByName("btnoQualityUp").getChildByName("spriteHot").active = GlobalVar.me().guazaiData.qualityUpHotFlag[this.wearPosition - 1];
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
        let maxLevel = GameServerProto.PT_PLAYER_MAX_LEVEL * 2;

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
                setPanel(this.beforeLevel == maxLevel);
            } else {
                setPanel(this.guazaiProp.wNextItemID == 0);
            }
        }

        
        if (this.chkbox == 0) {
            this.getNodeByName("lblLvNum2").getComponent(cc.Label).string = this.guazai.GuaZai.Level;
            this.getNodeByName("lblLvNum3").getComponent(cc.Label).string = this.beforeLevel == maxLevel ? "Max" : this.guazaiNext.GuaZai.Level;
            this.getNodeByName('lblLvNum3').color = this.beforeLevel == maxLevel ? new cc.color(255, 73, 43, 255) : new cc.color(178, 211, 255);
        } else {
            var qlevel = this.guazaiProp.strQualityDisplay == '' ? 0 : parseInt(this.guazaiProp.strQualityDisplay);
            this.getNodeByName("lblLvNum2").getComponent(cc.Label).string = qlevel;
            if (this.guazaiProp.wNextItemID == 0) {
                this.getNodeByName("lblLvNum3").getComponent(cc.Label).string = 'Max';
                this.getNodeByName('lblLvNum3').color = new cc.color(255, 73, 43, 255);
            } else {
                this.getNodeByName("lblLvNum3").getComponent(cc.Label).string = qlevel + 1;
                this.getNodeByName('lblLvNum3').color = new cc.color(178, 211, 255);
            }
        }
    },

    updateQualityUpPanel: function () {
        this.getNodeByName("lblDes").getComponent(cc.Label).string = "挂载升阶";
        let guazaiItem = GlobalVar.tblApi.getDataBySingleKey('TblGuaZai', this.guazai.ItemID);
        this.updateHotPoint();
        // cc.log(guazaiItem);
        if (!guazaiItem.oVecQualityUpNeed[0]) {
            this.getNodeByName("nodeShengjie").active = false;
            return;
        }
        this.setIcon(this.getNodeByName("nodeCostIcon"), guazaiItem.oVecQualityUpNeed[0].wItemID);
        this.getNodeByName("lblCostName").getComponent(cc.Label).string = guazaiItem.strName;
        let costNum = guazaiItem.oVecQualityUpNeed[0].nCount;
        let haveNum = GlobalVar.me().bagData.getGuazaiQualityUpMaterialCount(guazaiItem.oVecQualityUpNeed[0].wItemID);

        this.getNodeByName("lblHaveNum").getComponent(cc.RichText).string = "<color=" + (haveNum >= costNum ? "#ffffff" : "#ff0000") + ">" + haveNum + "</c><color=" + "#ffffff" + ">/" + costNum + "</color>";
    },

    updateLvlUpPanel: function () {
        this.getNodeByName("lblDes").getComponent(cc.Label).string = "挂载升级";
        let lvlExp = GlobalVar.tblApi.getDataByMultiKey('TblGuaZaiLevel', this.guazai.Slot, this.guazai.GuaZai.Level).nUpNeedEXP;
        let maxLevel = GameServerProto.PT_PLAYER_MAX_LEVEL * 2;
        if (this.guazai.GuaZai.Level == maxLevel) {
            this.expProgressBar.progress = 1;
        } else {
            this.levelUpAction(0.2, this.oldExp / lvlExp, this.guazai.GuaZai.Exp / lvlExp, null, this.guazai.GuaZai.Level - this.oldLevel);
            this.oldLevel = this.guazai.GuaZai.Level;
            this.oldExp = this.guazai.GuaZai.Exp;
        }
        for(let i = 1; i<=5; i++){
            let itemID = i + 22;
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
        this.updateHotPoint();
        // this.getNodeByName("btnoShengji").getChildByName("spriteHot").active = GlobalVar.me().guazaiData.levelUpHotFlag[this.wearPosition - 1];
    },

    levelUpAction: function (duration, from, to, callback, levelGap) {

        let bar = this.expProgressBar.node;
        let cycle = levelGap - from + to;
        let cellInterval = duration / cycle;

        if (levelGap > 0) {
            let action1 = cc.progressLoading(cellInterval * (1 - from), from, 1, callback);
            let action2 = cc.progressLoading(cellInterval * to, 0, to, callback);
            if (levelGap > 1) {
                let actionCycle = cc.progressLoading(cellInterval, 0, 1, callback).repeat(levelGap - 1);
                bar.runAction(cc.sequence(action1, actionCycle, action2));
            } else {
                bar.runAction(cc.sequence(action1, action2));
            }
        } else {
            let action = cc.progressLoading(duration, from, to, callback);
            bar.runAction(action);
        }
    },

    

    onChkboxTouchedCallback: function (target, data) {
        this.getNodeByName("btnoShengjie").getComponent(cc.Button).interactable = true;
        this.getNodeByName("btnoShengji").getComponent(cc.Button).interactable = true;
        target.target.getComponent(cc.Button).interactable = false;
        this.chkbox = parseInt(data) - 1;

        if (this.chkbox == 0) {
            this.getNodeByName("nodeShengjie").active = false;
            this.getNodeByName("nodeShengji").active = true;
            this.mapPropsNext = GlobalVar.me().propData.getPropsByGuazaiItem(this.guazaiNext);
            this.updateLvlUpPanel();
        } else {
            this.getNodeByName("nodeShengjie").active = true;
            this.getNodeByName("nodeShengji").active = false;
            let nextQualityLevel = JSON.parse(JSON.stringify(this.guazai));
            this.guazaiProp = GlobalVar.tblApi.getDataBySingleKey('TblGuaZai', nextQualityLevel.ItemID);
            if (this.guazaiProp.wNextItemID != 0) {
                nextQualityLevel.ItemID = this.guazaiProp.wNextItemID;
                this.mapPropsNext = GlobalVar.me().propData.getPropsByGuazaiItem(nextQualityLevel);
            }
            this.updateQualityUpPanel();
        }
        this.updateAttrPanel(this.getNodeByName("nodeAttrNew"), 1);
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

    onGuazaiAddexpNtf: function (data) {
        this.guazai = data.GuaZai;
        this.updateLvlUpPanel();
    },

    playGuazaiQualityUpEffect: function (data) {
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

        this.guazai = data.GuaZai;
        let nextQualityLevel = JSON.parse(JSON.stringify(this.guazai));
        this.guazaiProp = GlobalVar.tblApi.getDataBySingleKey('TblGuaZai', nextQualityLevel.ItemID);
        if (this.guazaiProp.wNextItemID != 0) {
            nextQualityLevel.ItemID = this.guazaiProp.wNextItemID;
            this.mapPropsNext = GlobalVar.me().propData.getPropsByGuazaiItem(nextQualityLevel);
        }
        this.updateAttrPanel(this.getNodeByName("nodeAttrOld"), 0);
        this.updateAttrPanel(this.getNodeByName("nodeAttrNew"), 1);
        this.updateTopPanel();
        this.updateQualityUpPanel();
    },

    playGuazaiUseItemEffect: function (data) {
        this.guazai = data.GuaZai;
        if (data.GuaZai.levelUpFlag) {
            GlobalVar.soundManager().playEffect(AUDIO_LEVEL_UP);
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
            let maxLevel = GameServerProto.PT_PLAYER_MAX_LEVEL * 2;
            this.guazaiNext.GuaZai.Level = this.guazai.GuaZai.Level + 1 > maxLevel ? maxLevel : this.guazai.GuaZai.Level + 1;
            this.mapProps = GlobalVar.me().propData.getPropsByGuazaiItem(this.guazai);
            this.mapPropsNext = GlobalVar.me().propData.getPropsByGuazaiItem(this.guazaiNext);
            this.updateAttrPanel(this.getNodeByName("nodeAttrOld"), 0);
            this.updateAttrPanel(this.getNodeByName("nodeAttrNew"), 1);
            this.updateTopPanel();
        }
        this.updateLvlUpPanel();
    },

    guazaiPutOnNtf: function (data) {
        this.guazai = data.OnGuaZai;
        let maxLevel = GameServerProto.PT_PLAYER_MAX_LEVEL * 2;
        this.guazaiNext.GuaZai.Level = this.guazai.GuaZai.Level + 1 > maxLevel ? maxLevel : this.guazai.GuaZai.Level + 1;
        this.mapProps = GlobalVar.me().propData.getPropsByGuazaiItem(this.guazai);
        this.mapPropsNext = GlobalVar.me().propData.getPropsByGuazaiItem(this.guazaiNext);
        this.updateAttrPanel(this.getNodeByName("nodeAttrOld"), 0);
        this.updateAttrPanel(this.getNodeByName("nodeAttrNew"), 1);
        this.updateTopPanel();
        this.updateLvlUpPanel();
        this.updateQualityUpPanel();
        this.updateHotPoint();
    },

    bagAddItem: function (data) {
        // this.updateLvlUpPanel();

        for (let i = 1; i <= 5; i++) {
            let itemID = i + 22;
            let itemCount = GlobalVar.me().bagData.getItemCountById(itemID);
            let itemNode = this.getNodeByName("ItemObject" + i);
            itemNode.getComponent("ItemObject").updateItem(itemID, itemCount);
            if (itemCount > 0) {
                let effect = itemNode.getChildByName("nodeEffect");
                effect.active = true;
            } else {
                let effect = itemNode.getChildByName("nodeEffect");
                effect.active = false;
            }
        }
    },
});
