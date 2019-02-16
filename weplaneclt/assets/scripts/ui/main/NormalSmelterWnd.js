
const RootBase = require("RootBase");
const WindowManager = require("windowmgr");
const GlobalVar = require('globalvar')
const WndTypeDefine = require("wndtypedefine");
const EventMsgID = require("eventmsgid");
const GameServerProto = require("GameServerProto");
const i18n = require('LanguageData');
const CommonWnd = require("CommonWnd");
const GlobalFunc = require('GlobalFunctions');

cc.Class({
    extends: RootBase,

    properties: {
        panels: {
            default: [],
            type: cc.Node
        },
        funcPanels: {
            default: [],
            type: cc.Node
        },
        nodeItem: {
            default: null,
            type: cc.Node
        },
        itemObj: {
            default: null,
            type: cc.Node
        },
        bottomPanel: {
            default: null,
            type: cc.Node
        }
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_SMELTER_WND;

    },

    animeStartParam: function (paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;
    },

    close: function () {
        this.closeWnd = true;
        this.node.getChildByName('nodeMain').active = false;
        this.node.getChildByName('nodeChkbox').active = false;
        this.changePanel(null, 0);
        this.releaseConstData();
        this._super();
    },

    animePlayCallBack: function (name) {
        if (name == "Escape") {
            this._super("Escape");
            GlobalVar.eventManager().removeListenerWithTarget(this);
            WindowManager.getInstance().popView(false, null, false, false);
        } else if (name == "Enter") {
            this._super("Enter");
            this.initConstData();
            this.registerEvent();
            this.initData();
            this.changePanel(null, 0);
            this.node.getChildByName('nodeMain').active = true;
            this.node.getChildByName('nodeChkbox').active = true;
        }
    },

    releaseConstData: function () {
        this.TblItem = null;
        this.TblGuaZai = null;
        this.TblPropName = null;
        this.TblMemberEquip = null;
        this.TblMember = null;
    },

    initConstData: function () {
        this.TblItem = GlobalVar.tblApi.getData('TblItem');
        this.TblGuaZai = GlobalVar.tblApi.getData('TblGuaZai');
        this.TblPropName = GlobalVar.tblApi.getData('TblPropName');
        this.TblMemberEquip = GlobalVar.tblApi.getData('TblMemberEquip');
        this.TblMember = GlobalVar.tblApi.getData('TblMember');
    },

    initData: function () {
        this.closeWnd = false;
        this.curPanel = -1;
        this.curTab = -1;
        this.vecSelectedItem = [];
        this.vecSelectedItemSlot = [];

    },

    registerEvent: function () {
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GUAZAI_MELT_ACK, this.onGuazaiMeltCallback, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GUAZAI_REBIRTH_ACK, this.onGuazaiRebirthCallback, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_MEMBER_REBIRTH_ACK, this.onMemberRebirthCallback, this);
    },

    //切换一级菜单
    changePanel: function (event, customData) {
        customData = parseInt(customData);
        if (this.curPanel == customData) return;
        this.curPanel = customData;
        this.curTab = -1;
        for (let i = 0; i < this.panels.length; i++) {
            this.panels[i].getComponent('RemoteSprite').setFrame(0);
            this.funcPanels[i].active = false;
        }
        this.panels[customData].getComponent('RemoteSprite').setFrame(1);
        this.funcPanels[customData].active = true;
        this.changeTab(null, 0);

        let bottom = cc.find('nodeMain/nodeBottom', this.node);
        if (customData == 0 || customData == 2) {
            bottom.getChildByName('nodeCost').active = false;
            bottom.getChildByName('btnoReborn').getComponent('ButtonObject').setText('分解');
        } else {
            bottom.getChildByName('nodeCost').active = true;
            bottom.getChildByName('btnoReborn').getComponent('ButtonObject').setText('重生');
        }
    },

    //切换二级菜单
    changeTab: function (event, customData) {
        customData = parseInt(customData);
        if (this.curTab == customData) return;
        if (this.curPanel == -1) this.curPanel = 0;
        this.curTab = customData;
        let tabs = this.funcPanels[this.curPanel].getChildByName('tabLayout');
        for (let i = 0; i < tabs.childrenCount; i++) {
            tabs.children[i].getComponent('RemoteSprite').setFrame(0);
        }
        tabs.children[customData].getComponent('RemoteSprite').setFrame(1);

        // let scrollContent = this.funcPanels[this.curPanel].getChildByName('SVItem').getComponent(cc.ScrollView).content;
        // scrollContent.removeAllChildren();
        // this.bottomPanel.getChildByName('SVGetItem').getComponent(cc.ScrollView).content.removeAllChildren();
        
        this.refreshPanel();
    },

    refreshPanel: function () {
        switch (this.curPanel) {
            case 0:
                this.updateRoughMelt();
                break;
            case 1:
                this.updateRoughRebirth();
                break;
            case 2:
                this.updateGuazaiMelt();
                break;
            case 3:
                this.updateGuazaiRebirth();
                break;
            case 4:
                this.updateMemberRebirth();
                break;
            default:
                break;
        }
    },

    chooseItem: function (event) {
        if (this.curPanel == 4 && this.vecSelectedItem.length > 0) {
            if (this.vecSelectedItem[0].MemberID != event.target.slot.MemberID) {
                GlobalVar.comMsg.showMsg('每次只能重生一架');
                return;
            }
        }
        let checkmark = event.target.getChildByName('checkmark');
        checkmark.active = !checkmark.active;

        if (this.curPanel != 4) {
            let slot = event.target.slot;
            let item = GlobalVar.me().bagData.getItemBySlot(slot);
            if (checkmark.active == true) {
                this.vecSelectedItem.push(item);
                this.vecSelectedItemSlot.push(slot);
            } else {
                let index = this.vecSelectedItemSlot.indexOf(slot);
                if (index > -1)
                    this.vecSelectedItemSlot.splice(index, 1);
                let indexItem = this.vecSelectedItem.indexOf(item);
                if (indexItem > -1)
                    this.vecSelectedItem.splice(indexItem, 1);
            }
        } else {
            let item = event.target.slot;
            if (checkmark.active == true) {
                this.vecSelectedItem.push(item);
            } else {
                this.vecSelectedItem = [];
            }
        }

        this.calcGetItem();
    },

    calcGetItem: function () {
        if (this.curPanel == 0) {
            let msg = { BagSlot: this.vecSelectedItemSlot, IsShow: 1 }
            GlobalVar.handlerManager().guazaiHandler.sendReq(GameServerProto.GMID_MEMBER_EQUIP_SPLIT_REQ, msg);
        } else if (this.curPanel == 1) {
            let diamondCost = 0;
            for (let i = 0; i < this.vecSelectedItem.length; i++) {
                let rough = this.TblMemberEquip[this.vecSelectedItem[i].ItemID];
            }
            this.getNodeByName('labelCost').getComponent(cc.Label).string = diamondCost;
            let msg = { BagSlot: this.vecSelectedItemSlot, IsShow: 1 }
            GlobalVar.handlerManager().guazaiHandler.sendReq(GameServerProto.GMID_MEMBER_EQUIP_REBIRTH_REQ, msg);
        } else if (this.curPanel == 2) {
            let msg = { BagSlot: this.vecSelectedItemSlot, IsShow: 1 }
            GlobalVar.handlerManager().guazaiHandler.sendReq(GameServerProto.GMID_GUAZAI_SPLIT_REQ, msg);
        } else if (this.curPanel == 3) {
            let diamondCost = 0;
            for (let i = 0; i < this.vecSelectedItem.length; i++) {
                let guazaiItem = this.TblGuaZai[this.vecSelectedItem[i].ItemID];
    
                //计算消耗钻石
                diamondCost += guazaiItem.nRebirthCostDiamond;
            }
            this.getNodeByName('labelCost').getComponent(cc.Label).string = diamondCost;
            let msg = { BagSlot: this.vecSelectedItemSlot, IsShow: 1 }
            GlobalVar.handlerManager().guazaiHandler.sendReq(GameServerProto.GMID_GUAZAI_REBIRTH_REQ, msg);
        } else if (this.curPanel == 4) {
            if (this.vecSelectedItem.length == 0) {
                this.getNodeByName('labelCost').getComponent(cc.Label).string = 0;
                this.bottomPanel.getChildByName('SVGetItem').getComponent(cc.ScrollView).content.removeAllChildren();
            } else {
                let member = this.TblMember[this.vecSelectedItem[0].MemberID];
                this.getNodeByName('labelCost').getComponent(cc.Label).string = member.nRebirthCostDiamond;
                let msg = { MemberID: this.vecSelectedItem[0].MemberID, IsShow: 1 }
                GlobalVar.handlerManager().memberHandler.sendMsg(GameServerProto.GMID_MEMBER_REBIRTH_REQ, msg);
            }
        }
    },

    initScroll: function (updateItem, counts) {
        let scroll = this.funcPanels[this.curPanel].getChildByName('SVItem').getComponent(cc.ScrollView);
        scroll.loopScroll.releaseViewItems();
        scroll.loopScroll.setTotalNum(counts);
        scroll.loopScroll.setCreateModel(this.nodeItem);
        scroll.loopScroll.registerUpdateItemFunc(function (grid, index) {
            updateItem(grid, index);
        });
        scroll.loopScroll.resetView();
    },

    updateRoughMelt: function () {
        this.vecSelectedItem = [];
        this.vecSelectedItemSlot = [];
        let scroll = this.funcPanels[this.curPanel].getChildByName('SVItem').getComponent(cc.ScrollView);
        scroll.loopScroll.releaseViewItems();
        this.bottomPanel.getChildByName('SVGetItem').getComponent(cc.ScrollView).content.removeAllChildren();
        this.getNodeByName('labelCost').getComponent(cc.Label).string = 0;
        if (this.closeWnd) return;

        let roughArray = GlobalVar.me().bagData.getItemVecByType(GameServerProto.PT_ITEMTYPE_MEMBER_EQUIP);
        roughArray.sort(function (a, b) {
            if (a.ItemID != b.ItemID) {
                return a.ItemID - b.ItemID;
            } else {
                return a.MemberEquip.Level - b.MemberEquip.Level;
            }
        })
        this.roughArr = [];
        for (let i = 0; i < roughArray.length; i++) {
            let rough = this.TblMemberEquip[roughArray[i].ItemID];
            if (rough.byEquipPos == (this.curTab + 1))
                this.roughArr.push(roughArray[i]);
        }
        let updateCallback = this.showRoughListItem.bind(this);
        this.initScroll(updateCallback, this.roughArr.length);


        let tabs = this.funcPanels[this.curPanel].getChildByName('tabLayout');
        for (let i = 0; i < tabs.childrenCount; i++) {
            let num = 0;
            for (let j = 0; j < roughArray.length; j++) {
                let rough = this.TblMemberEquip[roughArray[j].ItemID];
                if (rough.byEquipPos == (i + 1))
                    num++;
            }
            tabs.children[i].getChildByName('nodeNum').active = (num != 0);
            tabs.children[i].getChildByName('nodeNum').getChildByName('labelNum').getComponent(cc.Label).string = num;
            tabs.children[i].getChildByName('nodeNum').width = 10 + 10 * (num + '').length;
        }
    },

    updateRoughRebirth: function () {
        this.vecSelectedItem = [];
        this.vecSelectedItemSlot = [];
        let scroll = this.funcPanels[this.curPanel].getChildByName('SVItem').getComponent(cc.ScrollView);
        scroll.loopScroll.releaseViewItems();
        this.bottomPanel.getChildByName('SVGetItem').getComponent(cc.ScrollView).content.removeAllChildren();
        this.getNodeByName('labelCost').getComponent(cc.Label).string = 0;

        let roughArray = GlobalVar.me().bagData.getItemVecByType(GameServerProto.PT_ITEMTYPE_MEMBER_EQUIP);
        roughArray.sort(function (a, b) {
            if (a.ItemID != b.ItemID) {
                return a.ItemID - b.ItemID;
            } else {
                return a.MemberEquip.Level - b.MemberEquip.Level;
            }
        })
        this.roughArr = [];
        for (let i = 0; i < roughArray.length; i++) {
            let rough = this.TblMemberEquip[roughArray[i].ItemID];
            if (rough.byEquipPos == (this.curTab + 1) && (this.TblItem[roughArray[i].ItemID].wQuality % 100 != 0 || roughArray[i].MemberEquip.Level != 1))
                this.roughArr.push(roughArray[i]);
        }
        let updateCallback = this.showRoughListItem.bind(this);
        this.initScroll(updateCallback, this.roughArr.length);


        let tabs = this.funcPanels[this.curPanel].getChildByName('tabLayout');
        for (let i = 0; i < tabs.childrenCount; i++) {
            let num = 0;
            for (let j = 0; j < roughArray.length; j++) {
                let rough = this.TblMemberEquip[roughArray[j].ItemID];
                if (rough.byEquipPos == (i + 1) && (this.TblItem[roughArray[j].ItemID].wQuality % 100 != 0 || roughArray[j].MemberEquip.Level != 1))
                    num++;
            }
            tabs.children[i].getChildByName('nodeNum').active = (num != 0);
            tabs.children[i].getChildByName('nodeNum').getChildByName('labelNum').getComponent(cc.Label).string = num;
            tabs.children[i].getChildByName('nodeNum').width = 10 + 10 * (num + '').length;
        }
    },

    updateGuazaiMelt: function () {
        this.vecSelectedItem = [];
        this.vecSelectedItemSlot = [];
        let scroll = this.funcPanels[this.curPanel].getChildByName('SVItem').getComponent(cc.ScrollView);
        scroll.loopScroll.releaseViewItems();
        this.bottomPanel.getChildByName('SVGetItem').getComponent(cc.ScrollView).content.removeAllChildren();
        this.getNodeByName('labelCoin').getComponent(cc.Label).string = 0;

        let guazaiArray = GlobalVar.me().bagData.getItemVecByType(GameServerProto.PT_ITEMTYPE_GUAZAI);
        guazaiArray.sort(function (a, b) {
            if (a.ItemID != b.ItemID) {
                return a.ItemID - b.ItemID;
            } else {
                return a.GuaZai.Level - b.GuaZai.Level;
            }
        })
        this.guazaiArr = [];
        for (let i = 0; i < guazaiArray.length; i++) {
            let guazai = this.TblGuaZai[guazaiArray[i].ItemID];
            if (guazai.byPosition == (this.curTab + 1))
                this.guazaiArr.push(guazaiArray[i]);
        }
        let updateCallback = this.showGuazaiListItem.bind(this);
        this.initScroll(updateCallback, this.guazaiArr.length);


        let tabs = this.funcPanels[this.curPanel].getChildByName('tabLayout');
        for (let i = 0; i < tabs.childrenCount; i++) {
            let num = 0;
            for (let j = 0; j < guazaiArray.length; j++) {
                let guazai = this.TblGuaZai[guazaiArray[j].ItemID];
                if (guazai.byPosition == (i + 1))
                    num++;
            }
            tabs.children[i].getChildByName('nodeNum').active = (num != 0);
            tabs.children[i].getChildByName('nodeNum').getChildByName('labelNum').getComponent(cc.Label).string = num;
            tabs.children[i].getChildByName('nodeNum').width = 10 + 10 * (num + '').length;
        }
    },

    updateGuazaiRebirth: function () {
        this.vecSelectedItem = [];
        this.vecSelectedItemSlot = [];
        let scroll = this.funcPanels[this.curPanel].getChildByName('SVItem').getComponent(cc.ScrollView);
        scroll.loopScroll.releaseViewItems();
        this.bottomPanel.getChildByName('SVGetItem').getComponent(cc.ScrollView).content.removeAllChildren();
        this.getNodeByName('labelCost').getComponent(cc.Label).string = 0;

        let guazaiArray = GlobalVar.me().bagData.getItemVecByType(GameServerProto.PT_ITEMTYPE_GUAZAI);
        guazaiArray.sort(function (a, b) {
            if (a.ItemID != b.ItemID) {
                return a.ItemID - b.ItemID;
            } else {
                return a.GuaZai.Level - b.GuaZai.Level;
            }
        })
        this.guazaiArr = [];
        for (let i = 0; i < guazaiArray.length; i++) {
            let guazai = this.TblGuaZai[guazaiArray[i].ItemID];
            if (guazai.byPosition == (this.curTab + 1) && (guazai.wQuality % 100 != 0 || guazaiArray[i].GuaZai.Level != 1 || guazaiArray[i].GuaZai.Exp != 0))
                this.guazaiArr.push(guazaiArray[i]);
        }
        let updateCallback = this.showGuazaiListItem.bind(this);
        this.initScroll(updateCallback, this.guazaiArr.length);


        let tabs = this.funcPanels[this.curPanel].getChildByName('tabLayout');
        for (let i = 0; i < tabs.childrenCount; i++) {
            let num = 0;
            for (let j = 0; j < guazaiArray.length; j++) {
                let guazai = this.TblGuaZai[guazaiArray[j].ItemID];
                if (guazai.byPosition == (i + 1) && (guazai.wQuality % 100 != 0 || guazaiArray[j].GuaZai.Level != 1 || guazaiArray[j].GuaZai.Exp != 0))
                    num++;
            }
            tabs.children[i].getChildByName('nodeNum').active = (num != 0);
            tabs.children[i].getChildByName('nodeNum').getChildByName('labelNum').getComponent(cc.Label).string = num;
            tabs.children[i].getChildByName('nodeNum').width = 10 + 10 * (num + '').length;
        }
    },

    updateMemberRebirth: function () {
        this.vecSelectedItem = [];
        this.vecSelectedItemSlot = [];
        let scroll = this.funcPanels[this.curPanel].getChildByName('SVItem').getComponent(cc.ScrollView);
        scroll.loopScroll.releaseViewItems();
        this.bottomPanel.getChildByName('SVGetItem').getComponent(cc.ScrollView).content.removeAllChildren();
        this.getNodeByName('labelCost').getComponent(cc.Label).string = 0;

        this.memberArray = JSON.parse(JSON.stringify(GlobalVar.me().memberData.memberData));
        let id = GlobalVar.me().memberData.getStandingByFighterID();
        for (let i = 0; i < this.memberArray.length; i++) {
            if (this.memberArray[i].MemberID == id || (this.memberArray[i].Quality == 100 && this.memberArray[i].Level == 1)) {
                this.memberArray.splice(i, 1);
                i--;
            }
        }
        let updateCallback = this.showMemberListItem.bind(this);
        this.initScroll(updateCallback, this.memberArray.length);
    },

    showRoughListItem: function (grid, index) {
        let item = this.roughArr[index];
        let rough = this.TblMemberEquip[item.ItemID];
        grid.active = true;
        grid.getChildByName('ItemObject').getComponent("ItemObject").updateItem(item.ItemID);
        grid.getChildByName('lblName').getComponent(cc.Label).string = rough.strEquipName;
        grid.getChildByName('lblName').color = GlobalFunc.getCCColorByQuality(this.TblItem[item.ItemID].wQuality);
        grid.getChildByName('checkmark').active = false;
        for (let i = 0; i < this.vecSelectedItemSlot.length; i++){
            if (this.vecSelectedItemSlot[i] == item.Slot) {
                grid.getChildByName('checkmark').active = true;
            }
        }
        grid.slot = item.Slot;
    },

    showGuazaiListItem: function (grid, index) {
        let item = this.guazaiArr[index];
        let guazai = this.TblGuaZai[item.ItemID];
        
        grid.active = true;
        grid.getChildByName('checkmark').active = false;
        for (let i = 0; i < this.vecSelectedItemSlot.length; i++) {
            if (this.vecSelectedItemSlot[i] == item.Slot) {
                grid.getChildByName('checkmark').active = true;
            }
        }
        grid.getChildByName('ItemObject').getComponent("ItemObject").updateItem(item.ItemID, item.GuaZai.Level);
        grid.getChildByName('lblName').getComponent(cc.Label).string = guazai.strName;
        grid.getChildByName('lblName').color = GlobalFunc.getCCColorByQuality(guazai.wQuality);
        let mapProps = GlobalVar.me().propData.getPropsByGuazaiItem(item);
        let combatPoint = GlobalVar.me().propData.getCombatPointByPropMap(mapProps);
        grid.getChildByName('nodeScore').getChildByName('lblScoreNum').getComponent(cc.Label).string = combatPoint;
        for (let i in mapProps) {
            switch (i) {
                case "1": grid.getChildByName('lblAttr1Num').getComponent(cc.Label).string = mapProps[i].Value;
                    break;
                case "4": grid.getChildByName('lblAttr3Num').getComponent(cc.Label).string = mapProps[i].Value;
                    break;
                default:
                    let attrName = this.TblPropName[i];
                    grid.getChildByName('lblAttr2Name').getComponent(cc.Label).string = attrName.strName;
                    grid.getChildByName('lblAttr2Num').getComponent(cc.Label).string = mapProps[i].Value;
                    break;
            }
        }
        grid.slot = item.Slot;
    },

    showMemberListItem: function (grid, index) {
        let item = this.memberArray[index];
        let member = this.TblMember[item.MemberID];
        grid.active = true;
        grid.getChildByName('checkmark').active = false;
        for (let i = 0; i < this.vecSelectedItem.length; i++) {
            if (this.vecSelectedItem[i].MemberID == item.MemberID) {
                grid.getChildByName('checkmark').active = true;
            }
        }
        grid.getChildByName('ItemObject').getComponent("ItemObject").updateItem(item.MemberID);
        grid.getChildByName('lblName').getComponent(cc.Label).string = member.strName;
        grid.getChildByName('lblName').color = GlobalFunc.getCCColorByQuality(member.wQuality);
        grid.getChildByName('nodeScore').getChildByName('lblScoreNum').getComponent(cc.Label).string = item.Combat;
        let memberProps = GlobalVar.me().memberData.getMemberPropByMemberID(item.MemberID);
        for (let i in memberProps) {
            if (parseInt(i) == GameServerProto.PTPROP_HP) {
                grid.getChildByName('lblAttr1Num').getComponent(cc.Label).string = memberProps[i];
            } else if (parseInt(i) == GameServerProto.PTPROP_Attack) {
                grid.getChildByName('lblAttr2Name').getComponent(cc.Label).string = '攻击';
                grid.getChildByName('lblAttr2Num').getComponent(cc.Label).string = memberProps[i];
            } else if (parseInt(i) == GameServerProto.PTPROP_Defence) {
                grid.getChildByName('lblAttr3Num').getComponent(cc.Label).string = memberProps[i];
            }
        }

        grid.slot = item;
    },

    updateBottomPanel: function (items) {
        let content = this.bottomPanel.getChildByName('SVGetItem').getComponent(cc.ScrollView).content;
        content.removeAllChildren();
        for (let i = 0; i < items.length; i++) {
            if (items[i].ItemID != 1) {
                let node = cc.instantiate(this.itemObj);
                node.active = true;
                node.y = 0;
                node.getComponent("ItemObject").updateItem(items[i].ItemID);
                node.getComponent("ItemObject").setLabelNumberData(items[i].Count, true);
                content.addChild(node);
            }
        }
    },

    clickBtn: function () {
        let self = this;
        if (this.vecSelectedItem.length <= 0) {
            GlobalVar.comMsg.showMsg('请选择要拆分的装备');
            return;
        }
        if (this.curPanel == 0) {
            
        } else if (this.curPanel == 1) {
            
        } else if (this.curPanel == 2) {
            let msg = { BagSlot: this.vecSelectedItemSlot, IsShow: 0 }
            GlobalVar.handlerManager().guazaiHandler.sendReq(GameServerProto.GMID_GUAZAI_SPLIT_REQ, msg);
        } else if (this.curPanel == 3) {
            let msg = { BagSlot: this.vecSelectedItemSlot, IsShow: 0 }
            GlobalVar.handlerManager().guazaiHandler.sendReq(GameServerProto.GMID_GUAZAI_REBIRTH_REQ, msg);
        } else if (this.curPanel == 4) {
            CommonWnd.showMessage(null, CommonWnd.bothConfirmAndCancel, i18n.t('label.4000216'), i18n.t('label.4000271'), null, function () {
                let msg = { MemberID: self.vecSelectedItem[0].MemberID, IsShow: 0 }
                GlobalVar.handlerManager().memberHandler.sendMsg(GameServerProto.GMID_MEMBER_REBIRTH_REQ, msg);
            })
        }
    },


    //请求回应处理
    onGuazaiMeltCallback: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SYSTEM_OPEN_LACK) {
            GlobalVar.comMsg.showMsg('等级不足，未开启该功能');
            return;
        } else if (data.ErrCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(data.ErrCode);
            return;
        }
        if (data.IsShow == 1) {
            let gold = 0;
            for (let i = 0; i < data.GetItems.length; i++) { 
                if (data.GetItems[i].ItemID == 1) {
                    gold = data.GetItems[i].Count;
                }
            }
            this.getNodeByName('labelCoin').getComponent(cc.Label).string = gold;
            this.updateBottomPanel(data.GetItems);
        } else {
            this.refreshPanel();
            CommonWnd.showTreasureExploit(data.GetItems);
        }
    },

    onGuazaiRebirthCallback: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_DIAMOND_LACK) {
            CommonWnd.showNormalFreeGetWnd(GameServerProto.PTERR_DIAMOND_LACK);
            return;
        } else if (data.ErrCode == GameServerProto.PTERR_SYSTEM_OPEN_LACK) {
            GlobalVar.comMsg.showMsg('等级不足，未开启该功能');
            return;
        } else if (data.ErrCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(data.ErrCode);
            return;
        }
        if (data.IsShow == 1) {
            this.updateBottomPanel(data.GetItems);
        } else {
            this.refreshPanel();
            CommonWnd.showTreasureExploit(data.GetItems);
        }
    },

    onMemberRebirthCallback: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_DIAMOND_LACK) {
            CommonWnd.showNormalFreeGetWnd(GameServerProto.PTERR_DIAMOND_LACK);
            return;
        } else if (data.ErrCode == GameServerProto.PTERR_SYSTEM_OPEN_LACK) {
            GlobalVar.comMsg.showMsg('等级不足，未开启该功能');
            return;
        } else if (data.ErrCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(data.ErrCode);
            return;
        }
        if (data.IsShow == 1) {
            let gold = 0;
            for (let i = 0; i < data.GetItems.length; i++) {
                if (data.GetItems[i].ItemID == 1) {
                    gold = data.GetItems[i].Count;
                }
            }
            this.getNodeByName('labelCoin').getComponent(cc.Label).string = gold;
            this.updateBottomPanel(data.GetItems);
        } else {
            this.refreshPanel();
            CommonWnd.showTreasureExploit(data.GetItems);
        }
    },
});
