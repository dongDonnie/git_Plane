const RootBase = require("RootBase");
const WindowManager = require("windowmgr");
const GlobalVar = require("globalvar");
const EventMsgId = require("eventmsgid");
const GameServerProto = require("GameServerProto");
const GlobalFunctions = require("GlobalFunctions");
const CommonWnd = require("CommonWnd");
const WndTypeDefine = require("wndtypedefine");

const GOLD = 1;

// const GUAZAI_SMELTER = "cdnRes/audio/main/effect/lingquxiaoshi";
const GUAZAI_REBORN = "cdnRes/audio/main/effect/ronglu-chongsheng";

var self = null;

cc.Class({
    extends: RootBase,

    properties: {
        itemPrefab: {
            default: null,
            type: cc.Prefab
        },
        nodeImg1: {
            default: null,
            type: cc.Node
        },
        nodeImg2: {
            default: null,
            type: cc.Node
        },
        nodeImg3: {
            default: null,
            type: cc.Node
        },
        nodeImg4: {
            default: null,
            type: cc.Node
        },
        nodeSVContent: {
            default: null,
            type: cc.Node
        },
        nodeItem: {
            default: null,
            type: cc.Node
        },
        nodeGetItemSVContent: {
            default: null,
            type: cc.Node
        },
        nodeItemGet: {
            default: null,
            type: cc.Node
        },
    },

    ctor: function () {
        self = this;
        this.scheduleHandler = null;
        this.itemAddFlag = [0, 0, 0, 0];
        this.vecSelectedItemNode = [];
        this.vecSelectedItem = [];
        this.vecSelectedItemSlot = [];
        this.dirty = true;
        this.isSmeltComplete = false;
        this.isRebornComplete = false;
        this.chkbox = 0;
        this.tag = 1;
        this.tagChanged = true;
        this.guazaiSmeltSlot = [];
        this.guazaiSmeltPosToSlot = {};
        this.smeltPosClicked = 0;
        this.smeltQuality = 0;
        this.rebirthLock = false;
    },

    onLoad: function () {
        this._super();
        this.animeStartParam(0, 0);

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
            this.getNodeByName('needItem').active = false;
        } else if (name == "Enter") {
            this._super("Enter");
            GlobalVar.eventManager().addEventListener(EventMsgId.EVENT_GUAZAI_DIRTY_NTF, this.onGuazaiDirtyCallback, this);
            GlobalVar.eventManager().addEventListener(EventMsgId.EVENT_GUAZAI_REBIRTH_ACK, this.onGuazaiRebirthCallback, this);
            this.dirty = true;
            this.isSmeltComplete = false;
            this.isRebornComplete = false;
            this.tagChanged = true;
            this.guazaiSmeltSlot = [];
            this.rebirthLock = false;
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



    setString: function (lbl, text) {
        lbl.string = text;
    },

    setIcon: function (node, itemId, num) {
        if (node.children.length == 0) {
            let item = cc.instantiate(this.itemPrefab);
            item.getComponent("ItemObject").updateItem(itemId);
            if (num)
                item.getComponent("ItemObject").setLabelNumberData(num);
            node.addChild(item);
        } else {
            node.children[0].getComponent("ItemObject").updateItem(itemId);
            if (num) {
                node.children[0].getComponent("ItemObject").setLabelNumberData(num);
            }
        }
    },

    update: function (dt) {
        if (!this.dirty)
            return;
        this.dirty = false;
        if (this.chkbox == 0) {
            if (!this.isSmeltComplete) {
                this.updateGuazaiSmelt();
                // this.isSmeltComplete = true;
            } else {
                this.getNodeByName("nodeMelt").active = true;
                this.getNodeByName("nodeReborn").active = false;
            }
        } else {
            if (!this.isRebornComplete) {
                this.updateGuazaiReborn();
                this.isRebornComplete = true;
            } else {
                this.getNodeByName("nodeMelt").active = false;
                this.getNodeByName("nodeReborn").active = true;
            }
        }
    },

    onBtnGuazaiAddTouchedCallback: function (target, customData) {
        self.smeltPosClicked = customData;
        var chooseingCallback = function (data) {
            self.guazaiSmeltItemAdd(data);
        }
        let selectCallback = function (item) {
            if (this.judgeGuazaiState(item)) {
                let idx = this.guazaiSmeltSlot.indexOf(item.Slot);  //已经添加过的挂载不显示
                if (idx < 0)
                    return true;
            }
            return false;
        }
        CommonWnd.showItemBag(GameServerProto.PT_ITEMTYPE_GUAZAI, selectCallback, chooseingCallback, this, 0);
    },

    onTagChangedCallback: function (target, data) {
        // cc.log(this.tag);
        if (this.tag != data)
            this.tagChanged = true;
        this.tag = data;
        this.dirty = true;
        this.isRebornComplete = false;
        this.getNodeByName("btnoTab1").getComponent(cc.Button).interactable = true;
        this.getNodeByName("btnoTab2").getComponent(cc.Button).interactable = true;
        this.getNodeByName("btnoTab3").getComponent(cc.Button).interactable = true;
        this.getNodeByName("btnoTab4").getComponent(cc.Button).interactable = true;
        this.getNodeByName("btnoTab1").getChildByName("labelName").color = GlobalFunctions.getSystemColor(12);
        this.getNodeByName("btnoTab2").getChildByName("labelName").color = GlobalFunctions.getSystemColor(12);
        this.getNodeByName("btnoTab3").getChildByName("labelName").color = GlobalFunctions.getSystemColor(12);
        this.getNodeByName("btnoTab4").getChildByName("labelName").color = GlobalFunctions.getSystemColor(12);
        target.target.getComponent(cc.Button).interactable = false;
        target.target.getChildByName("labelName").color = GlobalFunctions.getSystemColor(13);

    },

    showRebornListItem: function (item) {
        // cc.log(item);
        let node = cc.instantiate(this.nodeItem);
        let guazai = GlobalVar.tblApi.getDataBySingleKey('TblGuaZai', item.ItemID);
        this.seekNodeByName(node, "ItemObject").getComponent("ItemObject").updateItem(item.ItemID, -1, item.GuaZai.Level);
        this.seekNodeByName(node, "lblName").getComponent(cc.Label).string = guazai.strName;
        let mapProps = GlobalVar.me().propData.getPropsByGuazaiItem(item);
        let combatPoint = GlobalVar.me().propData.getCombatPointByPropMap(mapProps);
        this.seekNodeByName(node, "lblScoreNum").getComponent(cc.Label).string = combatPoint;
        for (let i in mapProps) {
            switch (i) {
                case "1": this.seekNodeByName(node, "lblAttr1Num").getComponent(cc.Label).string = mapProps[i].Value;
                    break;
                case "4": this.seekNodeByName(node, "lblAttr3Num").getComponent(cc.Label).string = mapProps[i].Value;
                    break;
                default:
                    let attrName = GlobalVar.tblApi.getDataBySingleKey('TblPropName', i);
                    this.seekNodeByName(node, "lblAttr2Name").getComponent(cc.Label).string = attrName.strName;
                    this.seekNodeByName(node, "lblAttr2Num").getComponent(cc.Label).string = mapProps[i].Value;
                    break;
            }
        }
        node.newTag = item.Slot;
        this.nodeSVContent.addChild(node);
    },

    updateRebirthInfo: function () {
        // let returnGold = 0;
        let diamondCost = 0;
        let mapItemCount = {};
        for (let i = 0; i < this.vecSelectedItem.length; i++) {
            let item = this.vecSelectedItem[i];
            //计算表里配置的返还物品
            let guazaiItem = GlobalVar.tblApi.getDataBySingleKey('TblGuaZai', item.ItemID);
            // for (let j = 0; j < guazaiItem.oVecRebirthGetItem.length; j++) {
            //     if (mapItemCount[guazaiItem.oVecRebirthGetItem[j].wItemID])
            //         mapItemCount[guazaiItem.oVecRebirthGetItem[j].wItemID].Count += guazaiItem.oVecRebirthGetItem[j].nCount;
            //     else
            //         mapItemCount[guazaiItem.oVecRebirthGetItem[j].wItemID] = {
            //             ItemID: guazaiItem.oVecRebirthGetItem[j].wItemID,
            //             Count: guazaiItem.oVecRebirthGetItem[j].nCount
            //         }
            // }
            // // returnGold += guazaiItem.nReturnGold;
            // //计算表外配置返还物品
            // for (let j = 0; j < item.GuaZai.ReturnItem.length; j++) {
            //     if (mapItemCount[guazaiItem.oVecRebirthGetItem[j].ItemID])
            //         mapItemCount[guazaiItem.oVecRebirthGetItem[j].ItemID].Count += guazaiItem.oVecRebirthGetItem[j].Count;
            //     else
            //         mapItemCount[guazaiItem.oVecRebirthGetItem[j].ItemID] = {
            //             ItemID: guazaiItem.oVecRebirthGetItem[j].ItemID,
            //             Count: guazaiItem.oVecRebirthGetItem[j].Count
            //         }
            // }
            // //计算返还魔方
            // let guazaiExp = item.GuaZai.Exp;
            // let guazaiByPosition = GlobalVar.tblApi.getDataBySingleKey("TblGuaZai", item.ItemID).byPosition;
            // for (let i = 1; i<item.GuaZai.Level; i++){
            //     let levelUpData = GlobalVar.tblApi.getDataByMultiKey('TblGuaZaiLevel', guazaiByPosition, i);
            //     guazaiExp += levelUpData.nUpNeedEXP;
            // }
            // // let expMap = GlobalVar.tblApi.getDataByMut('TblGuaZaiLevel');
            // // for (let i in expMap) {
            // //     if (expMap[i].wLevel < item.GuaZai.Level)
            // //         guazaiExp += expMap[i].nUpNeedEXP;
            // // }
            // let expId = 27;
            // while (guazaiExp > 0 && expId >= 23) {
            //     let expItem = GlobalVar.tblApi.getDataBySingleKey('TblItem', expId);
            //     if (guazaiExp >= expItem.nResult) {
            //         if (mapItemCount[expId])
            //             mapItemCount[expId].Count += parseInt(guazaiExp / expItem.nResult);
            //         else
            //             mapItemCount[expId] = {
            //                 ItemID: expId,
            //                 Count: parseInt(guazaiExp / expItem.nResult)
            //             }
            //     }
            //     guazaiExp = guazaiExp % expItem.nResult;
            //     expId--;
            // }

            //计算消耗钻石
            diamondCost += guazaiItem.nRebirthCostDiamond;
        }
        this.getNodeByName('labelCost').getComponent(cc.Label).string = diamondCost;
        let msg = { BagSlot: this.vecSelectedItemSlot, IsShow: 1 }
        GlobalVar.handlerManager().guazaiHandler.sendReq(GameServerProto.GMID_GUAZAI_REBIRTH_REQ, msg);
        // this.updateGuazaiRebirthGetItemPanel(mapItemCount, returnGold, diamondCost);
        // this.updateGuazaiRebirthGetItemPanel(mapItemCount, diamondCost);
    },

    updateGuazaiSmelt: function () {
        this.getNodeByName("nodeMelt").active = true;
        this.getNodeByName("nodeReborn").active = false;
        let self = this;
        for (let i in this.guazaiSmeltPosToSlot) {
            let guazai = GlobalVar.me().bagData.getItemBySlot(this.guazaiSmeltPosToSlot[i]);
            if (guazai){
                let node = this.getNodeByName("nodeItem" + i);
                this.seekNodeByName(node, "imgPlus").active = false;
                let item = node.getChildByName("nodeAdd").getChildByName("ItemObject");
                if (!item) {
                    let itemObject = cc.instantiate(this.itemPrefab);
                    itemObject.getComponent("ItemObject").updateItem(guazai.ItemID, 1, guazai.GuaZai.Level);
                    // itemObject.getComponent("ItemObject").setClick(false);
                    node.getChildByName("nodeAdd").addChild(itemObject);
                }
                else {
                    item.active = true;
                    item.getComponent("ItemObject").updateItem(guazai.ItemID, 1, guazai.GuaZai.Level);
                    // item.getComponent("ItemObject").setClick(false);
                }
            }else{
                let node = this.getNodeByName("nodeItem" + i);
                let item = node.getChildByName("nodeAdd").getChildByName("ItemObject");
                if (item){
                    item.active = false;
                }
                this.seekNodeByName(node, "imgPlus").active = true;
            }
        }

        let hechengGetItem = GlobalVar.me().guazaiData.getHechengGetItem();
        if (hechengGetItem[0]){
            GlobalVar.soundManager().playEffect(GUAZAI_REBORN);
            let nodeGetItem = this.getNodeByName("nodeGetItem");
            let itemGet = nodeGetItem.getChildByName("ItemObject");
            let effect = this.getNodeByName("nodeMelt").getChildByName("nodeEffect");
            GlobalFunctions.playDragonBonesAnimation(effect, function () { 
                effect.active = false;
                CommonWnd.showTreasureExploit(hechengGetItem);
                self.isSmeltComplete = true;
            })
            // effect.active = true;
            // effect.getComponent(dragonBones.ArmatureDisplay).playAnimation("animation", 1);
            // effect.getComponent(dragonBones.ArmatureDisplay).addEventListener(dragonBones.EventObject.COMPLETE, event => {
            //     var animationName = event.animationState ? event.animationState.name : "";
            //     if (animationName == "animation") {
            //         effect.active = false;
            //         CommonWnd.showTreasureExploit(hechengGetItem);
            //         self.isSmeltComplete = true;
            //     }
            // });
            if (!itemGet){
                itemGet = cc.instantiate(this.itemPrefab);
                itemGet.getComponent("ItemObject").updateItem(hechengGetItem[0].ItemID);
                itemGet.getComponent("ItemObject").setClick(true, 0);
                nodeGetItem.addChild(itemGet);
            }else{
                itemGet.active = true;
                itemGet.getComponent("ItemObject").updateItem(hechengGetItem[0].ItemID);
                itemGet.getComponent("ItemObject").setClick(true, 0);
            }

            this.seekNodeByName(nodeGetItem, "nodeQuestion").active = false;
            this.guazaiSmeltPosToSlot = {};
            this.guazaiSmeltSlot = [];

            for(let i = 1; i<=4; i++){
                let node = this.getNodeByName("nodeItem" + i);
                node.getChildByName("btnoTouch").getComponent(cc.Button).clickEvents[0].customEventData = i;
                let item = node.getChildByName("nodeAdd").getChildByName("ItemObject");
                if (item){
                    item.active = false;
                }
                this.seekNodeByName(node, "imgPlus").active = true;
            }
        }else{
            let nodeGetItem = this.getNodeByName("nodeGetItem");
            let itemGet = nodeGetItem.getChildByName("ItemObject");
            if (itemGet){
                itemGet.active = false;
            }
            this.seekNodeByName(nodeGetItem, "nodeQuestion").active = true;
            this.isSmeltComplete = true;
        }
    },

    updateGuazaiReborn: function () {
        this.getNodeByName("nodeMelt").active = false;
        this.getNodeByName("nodeReborn").active = true;
        if (this.tagChanged) {
            this.vecSelectedItem = [];
            this.vecSelectedItemSlot = [];
            this.vecSelectedItemNode = [];
            let guazaiArray = GlobalVar.me().bagData.getItemVecByType(GameServerProto.PT_ITEMTYPE_GUAZAI);
            this.nodeSVContent.removeAllChildren();
            for (let i = 0; i < guazaiArray.length; i++) {
                let guazai = GlobalVar.tblApi.getDataBySingleKey('TblGuaZai', guazaiArray[i].ItemID);
                if (guazai.byPosition == this.tag && !this.judgeGuazaiState(guazaiArray[i]))
                    this.showRebornListItem(guazaiArray[i]);
            }
        }
        this.updateRebirthInfo();
    },

    onChkboxChangedCallback: function (target, data) {
        this.getNodeByName("btnoGuazaiMelt").getComponent(cc.Button).interactable = true;
        this.getNodeByName("btnoGuazaireborn").getComponent(cc.Button).interactable = true;
        target.target.getComponent(cc.Button).interactable = false;
        this.chkbox = data - 1;
        this.dirty = true;
    },

    onToggleTouchedCalback: function (target) {    //挂载重生界面给挂载打勾后的回调
        // cc.log(target.isChecked);
        let model = target.target.getParent().getParent().getParent();
        let slot = model.newTag;
        let item = GlobalVar.me().bagData.getItemBySlot(slot);
        // cc.log(model);
        if (target.isChecked == true) {
            this.vecSelectedItemSlot.push(slot);
            this.vecSelectedItem.push(item);
            this.vecSelectedItemNode.push(model);
        }
        else {
            let index = this.vecSelectedItemSlot.indexOf(slot);
            if (index > -1)
                this.vecSelectedItemSlot.splice(index, 1);
            let indexItem = this.vecSelectedItem.indexOf(item);
            if (indexItem > -1)
                this.vecSelectedItem.splice(indexItem, 1);
            let indexNode = this.vecSelectedItemNode.indexOf(model);
            if (indexNode > -1){
                this.vecSelectedItemNode.splice(indexNode, 1);
            }
        }
        // cc.log(this.vecSelectedItem);
        // cc.log(this.vecSelectedItemSlot);
        this.updateRebirthInfo();
    },

    updateGuazaiRebirthGetItemPanel: function (mapItem) {
    // updateGuazaiRebirthGetItemPanel: function (mapItem, gold, diamond) {
        // cc.log(mapItem);
        // let nodeGold = this.getNodeByName("nodeGold").getChildByName("ItemObject");
        // nodeGold.getComponent("ItemObject").updateItem(GOLD);
        // nodeGold.getComponent("ItemObject").setSpriteEdgeVisible(false);
        // nodeGold.getComponent("ItemObject").setClick(false);
        // this.getNodeByName("lblCostNum").getComponent(cc.Label).string = gold;
        // this.getNodeByName('labelCost').getComponent(cc.Label).string = diamond;
        this.nodeGetItemSVContent.removeAllChildren();
        for (let i in mapItem) {
            // let item = GlobalVar.tblApi.getDataBySingleKey('TblItem', mapItem[i].ItemID);
            // while (mapItem[i].Count) {
                let node = cc.instantiate(this.nodeItemGet);
                // cc.log(mapItem[i].Count);
                // let count = mapItem[i].Count > item.wOverlap ? item.wOverlap : mapItem[i].Count;
                node.getChildByName("ItemObject").getComponent("ItemObject").updateItem(mapItem[i].ItemID);
                node.getChildByName("ItemObject").getComponent("ItemObject").setLabelNumberData(mapItem[i].Count, true);
                // mapItem[i].Count -= count;
                this.nodeGetItemSVContent.addChild(node);
            // }
        }
    },

    judgeGuazaiState: function (item) {    //返回true为可熔炼，返回false为可重生
        let guazaiData = GlobalVar.tblApi.getDataBySingleKey('TblGuaZai', item.ItemID);
        if (guazaiData.wQuality % 100 == 0 && item.GuaZai.Level == 1 && item.GuaZai.Exp == 0)
            return true;
        return false;
    },

    onRebirthBtnTouchedCallback: function () {
        if (this.rebirthLock){
            return;
        }
        if (this.vecSelectedItemSlot.length <= 0)
            return;
        let msg = { BagSlot: this.vecSelectedItemSlot, IsShow: 0}
        GlobalVar.handlerManager().guazaiHandler.sendReq(GameServerProto.GMID_GUAZAI_REBIRTH_REQ, msg);
        this.rebirthLock = true;
        let self = this;
        this.schedule(function () {
            self.rebirthLock = false;
        }, 3);
    },

    guazaiSmeltItemAdd: function (slot) {
        let pos = self.smeltPosClicked;
        let node = self.getNodeByName("nodeItem" + Math.abs(pos).toString());
        let guazai = GlobalVar.me().bagData.getItemBySlot(slot);
        let item = GlobalVar.tblApi.getDataBySingleKey('TblItem', guazai.ItemID);
        if (!GlobalVar.tblApi.getDataBySingleKey('TblGuaZaiHeCheng', item.wQuality)) {
            GlobalVar.comMsg.showMsg('暂不支持紫色及以上挂载合成');
            return;
        }
        if (self.guazaiSmeltSlot.length == 0) {    //没加入任何一种挂载，此时可以随便加
            self.guazaiSmeltSlot.push(slot);
            self.guazaiSmeltPosToSlot[pos] = slot;
            node.getChildByName("btnoTouch").getComponent(cc.Button).clickEvents[0].customEventData = -pos;   //用负号来标记当前位置是否已经添加挂载，已经添加的不可脱，可换
            self.smeltQuality = item.wQuality;
            // cc.log(item);
        }
        else if (self.guazaiSmeltSlot.length == 1 && pos < 0) {  //已经加入一种挂载，但须更换那个挂载，此时也可以随便换
            self.guazaiSmeltPosToSlot[-pos] = slot;
            self.guazaiSmeltSlot[0] = slot;
            self.smeltQuality = item.wQuality;
        }
        else {      //已加入一个时继续增加或加入多余一个时更换已加入的
            if (self.smeltQuality != item.wQuality) {  //品质不一样，不能放入
                GlobalVar.comMsg.showMsg("不同品质的挂载不能熔炼");
                return;
            }
            if (pos < 0) {  //更换
                let idx = self.guazaiSmeltSlot.indexOf(self.guazaiSmeltPosToSlot[-pos]);
                self.guazaiSmeltSlot[idx] = slot;
                self.guazaiSmeltPosToSlot[-pos] = slot;
            }
            else { //继续增加
                self.guazaiSmeltSlot.push(slot);
                self.guazaiSmeltPosToSlot[pos] = slot;
                node.getChildByName("btnoTouch").getComponent(cc.Button).clickEvents[0].customEventData = -pos;
            }
        }
        self.dirty = true;
        self.isSmeltComplete = false;
        // cc.log(self.guazaiSmeltPosToSlot);
        
        if (this.guazaiSmeltSlot.length == 4) {
            let guazaihecheng = GlobalVar.tblApi.getDataBySingleKey('TblGuaZaiHeCheng', self.smeltQuality);
            if (guazaihecheng) {
                this.getNodeByName('needItem').active = true;
                let path = 'cdnRes/itemicon/6/' + guazaihecheng.oVecCost[0].wItemID;
                this.getNodeByName('needItem').getComponent("RemoteSprite").loadFrameFromLocalRes(path);
            } else {
                this.getNodeByName('needItem').active = false;
            }
        }
    },

    onBtnComposeTouchedCallback: function () {
        if (this.guazaiSmeltSlot.length != 4) {
            GlobalVar.comMsg.showMsg("挂载数量不足");
            return;
        }
        if (!this.isSmeltComplete){
            return;
        }
        let guazaihecheng = GlobalVar.tblApi.getDataBySingleKey('TblGuaZaiHeCheng', this.smeltQuality);
        let needItemCount = GlobalVar.me().bagData.getItemCountById(guazaihecheng.oVecCost[0].wItemID);
        if (needItemCount < guazaihecheng.oVecCost[0].nCount) {
            WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMALITEMGETWAY, function (wnd, name, type) {
                // wnd.getComponent(type).updateInfo(self.itemID, self.getLabelNumberData(), 0, self.getSlot());
                wnd.getComponent(type).updateInfo(guazaihecheng.oVecCost[0].wItemID, needItemCount, -1, -1);
            });
            return;
        }
        let msg = { BagSlot: this.guazaiSmeltSlot };
        GlobalVar.handlerManager().guazaiHandler.sendReq(GameServerProto.GMID_GUAZAI_HECHENG_REQ, msg);
    },

    onQuickSmeltBtnTouchedCallback: function () {
        if (!this.isSmeltComplete){
            return;
        }
        this.guazaiSmeltSlot = [];
        this.guazaiSmeltPosToSlot = {};
        let canSmelter = false;
        this.smeltQuality = 0;
        let allQuality = GlobalVar.tblApi.getData('TblGuaZaiHeCheng');
        for (let quality in allQuality) {
            let guazaiArray = this.getGuazaiArrayByQuality(quality);
            if (guazaiArray.length >= 4) {
                for (let i = 0; i < 4; i++) {
                    this.guazaiSmeltSlot.push(guazaiArray[i].Slot);
                    this.guazaiSmeltPosToSlot[i + 1] = guazaiArray[i].Slot;
                }
                this.smeltQuality = quality;
                canSmelter = true;
                break;
            }
        }
        // for (let quality = 100; quality < 600; quality += 100) {
        //     let guazaiArray = this.getGuazaiArrayByQuality(quality);
        //     if (guazaiArray.length >= 4) {
        //         for (let i = 0; i < 4; i++) {
        //             this.guazaiSmeltSlot.push(guazaiArray[i].Slot);
        //             this.guazaiSmeltPosToSlot[i + 1] = guazaiArray[i].Slot;
        //         }
        //         this.smeltQuality = quality;
        //         canSmelter = true;
        //         break;
        //     }
        // }
        if (!canSmelter) {
            for (let i = 1; i <= 4; i++) {
                let node = this.getNodeByName("nodeItem" + i);
                node.getChildByName("btnoTouch").getComponent(cc.Button).clickEvents[0].customEventData = i;
                let item = node.getChildByName("nodeAdd").getChildByName("ItemObject");
                if (item) {
                    item.active = false;
                }
                this.seekNodeByName(node, "imgPlus").active = true;
            }
            GlobalVar.comMsg.showMsg('您目前可以熔炼的同品质挂载数量不足')
        }
        this.dirty = true;
        this.isSmeltComplete = false;

        let guazaihecheng = GlobalVar.tblApi.getDataBySingleKey('TblGuaZaiHeCheng', this.smeltQuality);
        if (guazaihecheng) {
            this.getNodeByName('needItem').active = true;
            let path = 'cdnRes/itemicon/6/' + guazaihecheng.oVecCost[0].wItemID;
            this.getNodeByName('needItem').getComponent("RemoteSprite").loadFrameFromLocalRes(path);
        } else {
            this.getNodeByName('needItem').active = false;
        }
    },

    getGuazaiArrayByQuality: function (quality) {
        let guazaiArray = [];
        let array = GlobalVar.me().bagData.getItemVecByType(GameServerProto.PT_ITEMTYPE_GUAZAI);
        let fnc = function (item) {
            let guazai = GlobalVar.tblApi.getDataBySingleKey('TblItem', item.ItemID);
            if (guazai.wQuality == quality)
                guazaiArray.push(item);
        }
        array.forEach(fnc);
        return guazaiArray;
    },

    onGuazaiRebirthCallback: function (data) {
        // cc.log(data);
        // let items = [];
        // for (let i = 0; i < data.GetItems.length; i++) {
        //     items.push(data.GetItems[i]);
        // }

        // this.dirty = true;
        // this.isSmeltComplete = false;
        // this.isRebornComplete = false;
        if (data.IsShow == 0){
            for (let i = 0; i<this.vecSelectedItemNode.length; i++){
                let model = this.vecSelectedItemNode[i];
                let effect = model.getChildByName("nodeEffect");
                effect.active = true;
                let index = i;
                let self = this;
                GlobalFunctions.playDragonBonesAnimation(effect, function () {
                    effect.active = false;
                    if (index == 0) {
                        self.dirty = true;
                        self.isSmeltComplete = false;
                        self.isRebornComplete = false;

                        self.rebirthLock = false;
                        CommonWnd.showTreasureExploit(data.GetItems);
                    }
                })
                // effect.getComponent(dragonBones.ArmatureDisplay).playAnimation("animation", 1);
                // effect.getComponent(dragonBones.ArmatureDisplay).addEventListener(dragonBones.EventObject.COMPLETE, event => {
                //     var animationName = event.animationState ? event.animationState.name : "";
                //     if (animationName == "animation") {
                //         effect.active = false;
                //         if (index == 0){
                //             self.dirty = true;
                //             self.isSmeltComplete = false;
                //             self.isRebornComplete = false;
                            
                //             self.rebirthLock = false;
                //             CommonWnd.showTreasureExploit(data.GetItems);
                //         }
                //     }
                // });
            }
        }else if (data.IsShow == 1){
            this.updateGuazaiRebirthGetItemPanel(data.GetItems);
        }

    },

    onGuazaiDirtyCallback: function () {
        this.dirty = true;
        this.isSmeltComplete = false;
        this.isRebornComplete = false;
    },


    close: function () {
        
        for (let i in this.guazaiSmeltPosToSlot) {
            let node = this.getNodeByName("nodeItem" + i);
            let item = node.getChildByName("nodeAdd").getChildByName("ItemObject");
            if (item){
                item.active = false;
            }
            this.seekNodeByName(node, "imgPlus").active = true;
            node.getChildByName("btnoTouch").getComponent(cc.Button).clickEvents[0].customEventData = i;
        }
        for(let i = 1; i<=4; i++){
            let node = this.getNodeByName("nodeItem" + i);
            node.getChildByName("btnoTouch").getComponent(cc.Button).clickEvents[0].customEventData = i;
            let item = node.getChildByName("nodeAdd").getChildByName("ItemObject");
            if (item) {
                item.active = false;
            }
        }

        this.guazaiSmeltPosToSlot = {};
        // this.ctor();
        this._super();
    },
});
