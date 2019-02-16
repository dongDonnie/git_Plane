const RootBase = require("RootBase");
const WindowManager = require("windowmgr");
const GlobalVar = require("globalvar");
const EventMsgId = require("eventmsgid");
const GameServerProto = require("GameServerProto");
const GlobalFunctions = require("GlobalFunctions");
const CommonWnd = require("CommonWnd");
const WndTypeDefine = require("wndtypedefine");

// const GUAZAI_SMELTER = "cdnRes/audio/main/effect/lingquxiaoshi";
const GUAZAI_REBORN = "cdnRes/audio/main/effect/ronglu-chongsheng";

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
        this.guazaiSmeltSlot = [-1, -1, -1, -1];
        this.smeltPosClicked = 0;
        this.smeltQuality = 0;
        this.vecSelectedItem = [];
        this.vecSelectedItemSlot = [];
        this.vecSelectedItemNode = [];
    },

    initData: function () {
        this.guazaiSmeltSlot = [-1, -1, -1, -1];
        this.smeltPosClicked = 0;
        this.smeltQuality = 0;
        this.vecSelectedItem = [];
        this.vecSelectedItemSlot = [];
        this.vecSelectedItemNode = [];
        this.tag = 0;
        this.rebirthLock = false;
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_GUAZAISMELTER_WND;
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
        } else if (name == "Enter") {
            this._super("Enter");
            GlobalVar.eventManager().addEventListener(EventMsgId.EVENT_GUAZAI_SMELTER_NTF, this.composeBack, this);
            GlobalVar.eventManager().addEventListener(EventMsgId.EVENT_GUAZAI_REBIRTH_ACK, this.onGuazaiRebirthCallback, this);
            this.initData();
            // this.onChkboxChangedCallback(null, 'Melt');
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

    onBtnGuazaiAddTouchedCallback: function (event, customData) {
        this.smeltPosClicked = parseInt(customData);
        let self = this;
        var chooseingCallback = function (data) {
            self.guazaiSmeltItemAdd(data);
        }
        let selectCallback = function (item) {
            if (self.judgeGuazaiState(item)) {
                let idx = self.guazaiSmeltSlot.indexOf(item.Slot);  //已经添加过的挂载不显示
                if (idx < 0)
                    return true;
            }
            return false;
        }
        CommonWnd.showItemBag(GameServerProto.PT_ITEMTYPE_GUAZAI, selectCallback, chooseingCallback, this, 0);
    },

    judgeGuazaiState: function (item) {    //返回true为可熔炼，返回false为可重生
        let guazaiData = GlobalVar.tblApi.getDataBySingleKey('TblGuaZai', item.ItemID);
        if (guazaiData.wQuality % 100 == 0 && item.GuaZai.Level == 1 && item.GuaZai.Exp == 0)
            return true;
        return false;
    },

    guazaiSmeltItemAdd: function (slot) {
        let pos = this.smeltPosClicked;
        let guazai = GlobalVar.me().bagData.getItemBySlot(slot);
        let item = GlobalVar.tblApi.getDataBySingleKey('TblItem', guazai.ItemID);
        if (!GlobalVar.tblApi.getDataBySingleKey('TblGuaZaiHeCheng', item.wQuality)) {
            GlobalVar.comMsg.showMsg('暂不支持紫色及以上挂载合成');
            return;
        }

        let smelters = this.getSmelterNum();
        if (this.smeltQuality != 0 && this.smeltQuality != item.wQuality && (smelters > 1 || this.guazaiSmeltSlot[pos - 1] == -1)) {
            GlobalVar.comMsg.showMsg("不同品质的挂载不能熔炼");
            return;
        } else {
            this.guazaiSmeltSlot[pos - 1] = slot;
            this.smeltQuality = item.wQuality;
        }
        this.updateSmeltPanel();
    },

    getSmelterNum: function () {
        let smelters = 0;
        for (let i = 0; i < this.guazaiSmeltSlot.length; i++) {
            let smelter = this.guazaiSmeltSlot[i];
            if (smelter != -1) {
                smelters++;
            }
        }
        return smelters;
    },

    updateSmeltPanel: function () {
        let smelters = this.getSmelterNum();
        for (let j = 0; j < this.guazaiSmeltSlot.length; j++) {
            let slot = this.guazaiSmeltSlot[j];
            if (slot == -1) continue;

            let node = this.getNodeByName("nodeItem" + (j + 1));
            let item = node.getChildByName("nodeAdd").getChildByName("ItemObject");
            let guazai = GlobalVar.me().bagData.getItemBySlot(slot);
            if (guazai) {
                this.seekNodeByName(node, "imgPlus").active = false;
                if (!item) {
                    let itemObject = cc.instantiate(this.itemPrefab);
                    itemObject.getComponent("ItemObject").updateItem(guazai.ItemID, 1, guazai.GuaZai.Level);
                    node.getChildByName("nodeAdd").addChild(itemObject);
                }
                else {
                    item.active = true;
                    item.getComponent("ItemObject").updateItem(guazai.ItemID, 1, guazai.GuaZai.Level);
                }
            } else {
                if (item) {
                    item.active = false;
                }
                this.seekNodeByName(node, "imgPlus").active = true;
            }
        }

        if (smelters == 4) {
            let guazaihecheng = GlobalVar.tblApi.getDataBySingleKey('TblGuaZaiHeCheng', this.smeltQuality);
            if (guazaihecheng) {
                this.getNodeByName('needItem').active = true;
                let path = 'cdnRes/itemicon/6/' + guazaihecheng.oVecCost[0].wItemID;
                this.getNodeByName('needItem').getComponent("RemoteSprite").loadFrameFromLocalRes(path);
            } else {
                this.getNodeByName('needItem').active = false;
            }
        }

        let nodeGetItem = this.getNodeByName("nodeGetItem");
        let itemGet = nodeGetItem.getChildByName("ItemObject");
        if (itemGet) {
            itemGet.active = false;
        }
        this.seekNodeByName(nodeGetItem, "nodeQuestion").active = true;
    },

    onQuickSmeltBtnTouchedCallback: function () {
        this.guazaiSmeltSlot = [-1, -1, -1, -1];
        let canSmelter = false;
        this.smeltQuality = 0;
        let n = 0;
        let allQuality = GlobalVar.tblApi.getData('TblGuaZaiHeCheng');
        for (let quality in allQuality) {
            let guazaiArray = this.getGuazaiArrayByQuality(quality);
            if (guazaiArray.length >= 4) {
                for (let i = 0; i < guazaiArray.length; i++) {
                    if (this.judgeGuazaiState(guazaiArray[i])) {
                        this.guazaiSmeltSlot[n] = guazaiArray[i].Slot;
                        n++;
                        if (this.getSmelterNum() == 4) {
                            this.smeltQuality = quality;
                            canSmelter = true;
                            break;
                        }
                    }
                }
                if (this.getSmelterNum() == 4) { 
                    break;
                } else {
                    this.guazaiSmeltSlot = [-1, -1, -1, -1];
                    canSmelter = false;
                    n = 0;
                }
            }
        }
        if (!canSmelter) {
            for (let i = 1; i <= 4; i++) {
                let node = this.getNodeByName("nodeItem" + i);
                let item = node.getChildByName("nodeAdd").getChildByName("ItemObject");
                if (item) {
                    item.active = false;
                }
                this.seekNodeByName(node, "imgPlus").active = true;
            }
            this.getNodeByName('needItem').active = false;
            GlobalVar.comMsg.showMsg('您目前可以熔炼的同品质挂载数量不足')
        }

        this.updateSmeltPanel();
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

    onBtnComposeTouchedCallback: function () {
        let smelters = this.getSmelterNum();
        if (smelters != 4) {
            GlobalVar.comMsg.showMsg("挂载数量不足");
            return;
        }
        let guazaihecheng = GlobalVar.tblApi.getDataBySingleKey('TblGuaZaiHeCheng', this.smeltQuality);
        let needItemCount = GlobalVar.me().bagData.getItemCountById(guazaihecheng.oVecCost[0].wItemID);
        if (needItemCount < guazaihecheng.oVecCost[0].nCount) {
            WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMALITEMGETWAY, function (wnd, name, type) {
                wnd.getComponent(type).updateInfo(guazaihecheng.oVecCost[0].wItemID, needItemCount, -1, -1);
            });
            return;
        }
        let msg = { BagSlot: this.guazaiSmeltSlot };
        GlobalVar.handlerManager().guazaiHandler.sendReq(GameServerProto.GMID_GUAZAI_HECHENG_REQ, msg);
    },

    composeBack: function (data) {
        let hechengGetItem = GlobalVar.me().guazaiData.getHechengGetItem();
        if (hechengGetItem[0]) {
            GlobalVar.soundManager().playEffect(GUAZAI_REBORN);
            let nodeGetItem = this.getNodeByName("nodeGetItem");
            let itemGet = nodeGetItem.getChildByName("ItemObject");
            let effect = this.getNodeByName("nodeMelt").getChildByName("nodeEffect");
            GlobalFunctions.playDragonBonesAnimation(effect, function () {
                effect.active = false;
                CommonWnd.showTreasureExploit(hechengGetItem);
            })
            if (!itemGet) {
                itemGet = cc.instantiate(this.itemPrefab);
                itemGet.getComponent("ItemObject").updateItem(hechengGetItem[0].ItemID);
                itemGet.getComponent("ItemObject").setClick(true, 0);
                nodeGetItem.addChild(itemGet);
            } else {
                itemGet.active = true;
                itemGet.getComponent("ItemObject").updateItem(hechengGetItem[0].ItemID);
                itemGet.getComponent("ItemObject").setClick(true, 0);
            }

            this.seekNodeByName(nodeGetItem, "nodeQuestion").active = false;
            this.guazaiSmeltSlot = [-1, -1, -1, -1];
            this.smeltQuality = 0;

            for (let i = 1; i <= 4; i++) {
                let node = this.getNodeByName("nodeItem" + i);
                node.getChildByName("btnoTouch").getComponent(cc.Button).clickEvents[0].customEventData = i;
                let item = node.getChildByName("nodeAdd").getChildByName("ItemObject");
                if (item) {
                    item.active = false;
                }
                this.seekNodeByName(node, "imgPlus").active = true;
            }
            this.getNodeByName('needItem').active = false;
        } else {
            let nodeGetItem = this.getNodeByName("nodeGetItem");
            let itemGet = nodeGetItem.getChildByName("ItemObject");
            if (itemGet) {
                itemGet.active = false;
            }
            this.seekNodeByName(nodeGetItem, "nodeQuestion").active = true;
        }
    },

    onChkboxChangedCallback: function (target, data) {
        this.getNodeByName("btnoGuazaiMelt").getComponent(cc.Button).interactable = true;
        this.getNodeByName("btnoGuazaireborn").getComponent(cc.Button).interactable = true;
        this.getNodeByName("btnoGuazai" + data).getComponent(cc.Button).interactable = false;
        if (data == 'Melt') {
            this.getNodeByName("nodeMelt").active = true;
            this.getNodeByName("nodeReborn").active = false;
            this.updateSmeltPanel();
        } else {
            this.getNodeByName("nodeMelt").active = false;
            this.getNodeByName("nodeReborn").active = true;
            this.onTagChangedCallback(null ,1);
        }
    },

    updateGuazaiReborn: function () {
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
        this.updateRebirthInfo();
    },

    showRebornListItem: function (item) {
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
        let diamondCost = 0;
        for (let i = 0; i < this.vecSelectedItem.length; i++) {
            let item = this.vecSelectedItem[i];
            //计算表里配置的返还物品
            let guazaiItem = GlobalVar.tblApi.getDataBySingleKey('TblGuaZai', item.ItemID);
            
            //计算消耗钻石
            diamondCost += guazaiItem.nRebirthCostDiamond;
        }
        this.getNodeByName('labelCost').getComponent(cc.Label).string = diamondCost;
        let msg = { BagSlot: this.vecSelectedItemSlot, IsShow: 1 }
        GlobalVar.handlerManager().guazaiHandler.sendReq(GameServerProto.GMID_GUAZAI_REBIRTH_REQ, msg);
    },

    onToggleTouchedCalback: function (target) {    //挂载重生界面给挂载打勾后的回调
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
            if (indexNode > -1) {
                this.vecSelectedItemNode.splice(indexNode, 1);
            }
        }
        // cc.log(this.vecSelectedItem);
        // cc.log(this.vecSelectedItemSlot);
        this.updateRebirthInfo();
    },

    onTagChangedCallback: function (target, data) {
        if (this.tag == data)
            return;
        this.tag = data;
        for (let i = 1; i < 5; i++) {
            this.getNodeByName("btnoTab" + i).getComponent(cc.Button).interactable = true;
            this.getNodeByName("btnoTab" + i).getChildByName("labelName").color = GlobalFunctions.getSystemColor(12);
        }
        this.getNodeByName("btnoTab" + data).getComponent(cc.Button).interactable = false;
        this.getNodeByName("btnoTab" + data).getChildByName("labelName").color = GlobalFunctions.getSystemColor(13);
        this.updateGuazaiReborn();
    },

    onGuazaiRebirthCallback: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_DIAMOND_LACK) {
            this.rebirthLock = false;
            CommonWnd.showNormalFreeGetWnd(GameServerProto.PTERR_DIAMOND_LACK);
            return;
        }
        if (data.ErrCode == GameServerProto.PTERR_SYSTEM_OPEN_LACK) {
            GlobalVar.comMsg.showMsg('等级不足，未开启该功能');
            return;
        }
        if (data.IsShow == 1) {
            this.updateGuazaiRebirthGetItemPanel(data.GetItems);
        } else {
            for (let i = 0; i < this.vecSelectedItemNode.length; i++) {
                let model = this.vecSelectedItemNode[i];
                let effect = model.getChildByName("nodeEffect");
                effect.active = true;
                let index = i;
                let self = this;
                GlobalFunctions.playDragonBonesAnimation(effect, function () {
                    effect.active = false;
                    if (index == 0) {
                        self.rebirthLock = false;
                        CommonWnd.showTreasureExploit(data.GetItems, 0, () => {
                            self.updateGuazaiReborn();
                            self.rebirthLock = false;
                        });
                    }
                })
            }
        }
    },

    updateGuazaiRebirthGetItemPanel: function (mapItem) {
        this.nodeGetItemSVContent.removeAllChildren();
        for (let i in mapItem) {
            let node = cc.instantiate(this.nodeItemGet);
            node.getChildByName("ItemObject").getComponent("ItemObject").updateItem(mapItem[i].ItemID);
            node.getChildByName("ItemObject").getComponent("ItemObject").setLabelNumberData(mapItem[i].Count, true);
            this.nodeGetItemSVContent.addChild(node);
        }
    },

    onRebirthBtnTouchedCallback: function () {
        if (this.rebirthLock) {
            return;
        }
        if (this.vecSelectedItemSlot.length <= 0)
            return;
        let msg = { BagSlot: this.vecSelectedItemSlot, IsShow: 0 }
        GlobalVar.handlerManager().guazaiHandler.sendReq(GameServerProto.GMID_GUAZAI_REBIRTH_REQ, msg);
        this.rebirthLock = true;
    },

    close: function () {
        // for (let i = 0; i < this.guazaiSmeltSlot.length; i++) {
        //     let node = this.getNodeByName("nodeItem" + (i + 1));
        //     let item = node.getChildByName("nodeAdd").getChildByName("ItemObject");
        //     if (item) {
        //         item.active = false;
        //     }
        //     this.seekNodeByName(node, "imgPlus").active = true;
        // }
        this.initData();
        // this.getNodeByName("nodeMelt").active = false;
        // this.getNodeByName("nodeReborn").active = false;
        // this.getNodeByName('needItem').active = false;
        this._super();
    },
});
