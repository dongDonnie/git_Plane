const GlobalVar = require("globalvar");
const EventMsgID = require("eventmsgid");
const WindowManager = require("windowmgr");
const RootBase = require("RootBase");
const WndTypeDefine = require("wndtypedefine");
const CommonWnd = require("CommonWnd");
const i18n = require('LanguageData');
const GlobalFunc = require('GlobalFunctions');
const GameServerProto = require("GameServerProto");
const BattleManager = require("BattleManager");
const ResMapping = require("resmapping");
const config = require('config');

const AUDIO_LEVEL_UP = 'cdnRes/audio/main/effect/shengji';
const AUDIO_QUALITY_UP = 'cdnRes/audio/main/effect/wujinchongfeng'
const AUDIO_QUALITY_UP2 = 'cdnRes/audio/main/effect/shengjie2'

cc.Class({
    extends: RootBase,

    properties: {
        equipment: {
            default: [],
            type: cc.Node,
        },
        scrollEquiptView: {
            default: null,
            type: cc.ScrollView,
        },
        spriteOperaTypeList: {
            default: [],
            type: [cc.Sprite]
        },
        nodeOperateAttributeChange: {
            default: [],
            type: [cc.Node],
        },
        nodeOperateConfirm: {
            default: [],
            type: [cc.Node],
        },
        spriteEquip: {
            default: [],
            type: [cc.Sprite]
        },
        curOperaType: {
            default: 0,
            visible: false,
        },
        curEquipLevel: {
            default: -1,
            visible: false,
        },
        index: {
            default: 1,
            visible: false,
        },
        canQuilityUp: {
            default: false,
            visible: false,
        },
        canOperata: {
            default: false,
            visible: false,
        },
        nodeSlip: {
            default: null,
            type: cc.Node,
        },
        effectUI: {
            default: null,
            type: cc.Node,
        }
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMALIMPROVEMENT_WND;
        this.animeStartParam(0);
        if (GlobalFunc.isAllScreen() && !this.fixViewComplete) {
            this.fixViewComplete = true;
            this.fixView();
        }
        this.index = 1;
        this.initImprovementView();

        this.setOperate();

        // this.shaderStartTime=Date.now();
    },

    update: function (dt) {
        //let time = (Date.now() - this.shaderStartTime) / 1000;
        //ShaderUtils.setShader(this.spriteEquip[0], "white", time);
    },

    registerEvents: function () {
        this.nodeSlip.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.nodeSlip.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.nodeSlip.on(cc.Node.EventType.TOUCH_END, this.changeEquip, this);
        this.nodeSlip.on(cc.Node.EventType.TOUCH_CANCEL, this.changeEquip, this);

        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_LEADEREQUIP_LEVELUP, this.onLevelUp, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_LEADEREQUIP_QUALITYUP, this.onQualityUp, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_BAG_ADDITEM_NTF, this.bagAddItem, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_SWEEP_RESULT, this.refreshUI, this);
    },

    touchStart: function () {
        if (this.clickDouble()) return;
        this.touchstart = true;
    },

    touchMove: function (event) {
        let self = this;
        if (!this.touchstart) return;
        let touch = event.touch;
        let deltaMove = touch.getLocation().sub(touch.getStartLocation());
        let width = this.nodeSlip.width / 4;
        let disX = Math.abs(deltaMove.x) > width ? width : Math.abs(deltaMove.x);
        // cc.log(disX);
        let scale = (Math.abs(deltaMove.x) / width) / 2;
        this.spriteEquip[0].node.x = deltaMove.x;
        this.spriteEquip[0].node.scale = (1 - scale) < 0 ? 0 : (1 - scale);
        let dir = deltaMove.x < 0 ? 1 : -1;
        this.setNodeIcon(dir);
        this.spriteEquip[1].node.x = dir * this.nodeSlip.width / 2 + deltaMove.x;
        this.spriteEquip[1].node.scale = scale > 1 ? 1 : scale;
    },

    changeEquip: function (event) {
        var self = this;
        if (!this.touchstart) return;
        this.touchstart = false;
        let touch = event.touch;
        let deltaMove = touch.getLocation().sub(touch.getStartLocation());
        let disX = deltaMove.x;
        // let anchorX = disX < 0 ? 0 : 1;

        if (disX > this.nodeSlip.width / 4) {
            this.selectEquipment(null, this.index - 1);
            self.spriteEquip[0].node.x = self.spriteEquip[1].node.x;
            self.spriteEquip[0].node.scale = self.spriteEquip[1].node.scale;
        } else if (disX < -this.nodeSlip.width / 4) {
            this.selectEquipment(null, this.index + 1);
            self.spriteEquip[0].node.x = self.spriteEquip[1].node.x;
            self.spriteEquip[0].node.scale = self.spriteEquip[1].node.scale;
        }
        let nodeY = self.spriteEquip[0].node.y;
        let spawnIn = cc.spawn(cc.moveTo(0.2, cc.v2(15, nodeY)), cc.scaleTo(0.2, 1));
        self.spriteEquip[0].node.runAction(spawnIn);
        self.spriteEquip[1].node.scale = 0;
        self.spriteEquip[1].node.getComponent(cc.Sprite).spriteFrame = null;
    },

    setNodeIcon: function (dir) {
        let self = this;
        let index = self.index - 1 + dir;
        index = index == -1 ? 5 : index;
        index = index == 6 ? 0 : index;
        let equips = GlobalVar.me().leaderData.getLeaderEquips();
        let equipData = GlobalVar.tblApi.getDataByMultiKey("TblLeaderEquip", equips[index].Pos, equips[index].Quality);
        let iconIndex = equipData.wIcon / 10 % 10 + 1;
        GlobalVar.resManager().loadRes(ResMapping.ResType.SpriteFrame, 'cdnRes/itemiconBig/' + iconIndex + '/' + equipData.wIcon, function (frame) {
            if(!cc.isValid(self.spriteEquip[1])){
                return;
            }
            self.spriteEquip[1].node.getComponent(cc.Sprite).spriteFrame = frame;
        });
    },

    clickDouble: function () {
        let nowTime = (new Date()).getTime();
        if (this._debugLastClickTime == undefined) {
            this._debugLastClickTime = nowTime;
            this._clickDebugCount = 1;
        } else {
            if (nowTime - this._debugLastClickTime > 500) {
                this._debugLastClickTime = nowTime;
                this._clickDebugCount = 1;
            } else if (++this._clickDebugCount >= 1) {
                this._clickDebugCount = 0;
                return true;
            }
            this._debugLastClickTime = nowTime;
        }
        return false;
    },

    playAction: function (event, dir) {
        var self = this;
        if (this.clickDouble()) return;
        dir = parseInt(dir);
        this.setNodeIcon(dir);

        let nodeY = self.spriteEquip[0].node.y;
        let spawnOut = cc.spawn(cc.moveTo(0.2, cc.v2(-self.nodeSlip.width / 2 * dir, nodeY)), cc.scaleTo(0.2, 0));
        let spawnIn = cc.spawn(cc.moveTo(0.2, cc.v2(15, nodeY)), cc.scaleTo(0.2, 1));
        let func1 = cc.callFunc(function () {
            self.spriteEquip[0].node.x = 15;
            self.spriteEquip[0].node.scale = 1;
            self.selectEquipment(null, self.index + dir);
        });

        let seq0 = cc.sequence(spawnOut, func1);
        self.spriteEquip[0].node.runAction(seq0);

        let func3 = cc.callFunc(function () {
            self.spriteEquip[1].node.x = self.nodeSlip.width / 2 * dir;
        })
        let func4 = cc.callFunc(function () {
            self.spriteEquip[1].node.scale = 0;
            self.spriteEquip[1].node.getComponent(cc.Sprite).spriteFrame = null;
        })
        let seq1 = cc.sequence(func3, spawnIn, func4);
        self.spriteEquip[1].node.runAction(seq1);


    },

    initImprovementView: function () {
        this.canOperata = true;
        let equips = GlobalVar.me().leaderData.getLeaderEquips();
        for (let i = 0; i < equips.length; i++) {
            let level = equips[i].Level;
            let quality = equips[i].Quality;
            let pos = equips[i].Pos;
            let leaderEquipData = GlobalVar.tblApi.getDataByMultiKey("TblLeaderEquip", pos, quality);
            let itemObj = this.equipment[i].getComponent("ItemObject");
            // itemObj.updateItem(id, -1, level);
            itemObj.setAllVisible(false);
            itemObj.setSpriteItemIconData(leaderEquipData.wIcon, leaderEquipData.byColor);
            itemObj.setSpriteEdgeData(leaderEquipData.byColor * 100);
            itemObj.setLabelNumberData(-1);
            itemObj.setLabelLevelData(level);
            itemObj.setClick(true, 10);
            itemObj.setLabelQualityNumberData(leaderEquipData.strName);
            // this.equipment[i].getComponent("ItemObject").setSpriteEdgeData(quality * 100);
        }
    },

    updateHotPoint: function () {
        let canUpQuality = GlobalVar.me().leaderData.qualityUpHotFlag;
        let canUpLevel = GlobalVar.me().leaderData.levelUpHotFlag
        for (let i = 0; i < this.equipment.length; i++) {

            if (canUpQuality[i]) {
                this.equipment[i].getComponent("ItemObject").setSpriteHotPointData(1);
            } else if (canUpLevel[i]) {
                this.equipment[i].getComponent("ItemObject").setSpriteHotPointData(0);
            } else {
                this.equipment[i].getComponent("ItemObject").setSpriteHotPointData(-1);
            }
        }

        this.node.getChildByName("nodeCenter").getChildByName("btnoAdvance").getChildByName("spriteHot").active = !!canUpQuality[this.index - 1];
        this.node.getChildByName("nodeCenter").getChildByName("btnoLevelUp").getChildByName("spriteHot").active = !!canUpLevel[this.index - 1];
    },

    fixView: function () {
        let bgWidget = this.node.getChildByName("spriteBg").getComponent(cc.Widget);
        bgWidget.top += 100;
        bgWidget.updateAlignment();
        let centerWidget = this.node.getChildByName("nodeCenter").getComponent(cc.Widget);
        centerWidget.top += 100;
        centerWidget.updateAlignment();
        let bottomWidget = this.node.getChildByName("nodeBottom").getComponent(cc.Widget);
        bottomWidget.bottom += 50;
        bottomWidget.updateAlignment();
        let topWidget = this.node.getChildByName("spriteTop").getComponent(cc.Widget);
        topWidget.top += 30;
        topWidget.updateAlignment();
    },

    animeStartParam(num) {
        this.node.opacity = num;

        if (num == 0 || num == 255) {
            this.node.getChildByName("spriteTop").active = false;
            this.node.getChildByName("nodeCenter").active = false;
            this.node.getChildByName("nodeBottom").active = false;
        }
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            GlobalVar.eventManager().removeListenerWithTarget(this);
            if (!this.deleteMode) {} else {
                let uiNode = cc.find("Canvas/UINode");
                if (WindowManager.getInstance().findViewIndex(WndTypeDefine.WindowType.E_DT_NORMALPLANE_WND) == -1) {
                    BattleManager.getInstance().quitOutSide();
                    BattleManager.getInstance().startOutside(uiNode.getChildByName('UIMain').getChildByName('nodeBottom').getChildByName('planeNode'), GlobalVar.me().memberData.getStandingByFighterID(), true);
                }
            }
        } else if (name == "Enter") {
            this._super("Enter");
            this.registerEvents();
            this.deleteMode = false;
            this.spriteEquip[0].node.active = true;
            if (WindowManager.getInstance().findViewIndex(WndTypeDefine.WindowType.E_DT_NORMALPLANE_WND) == -1) {
                BattleManager.getInstance().quitOutSide();
            }

            if (GlobalVar.srcSwitch()) {
                this.getNodeByName('vipTip').active = false;
            }

            this.node.getChildByName("spriteTop").active = true;
            this.node.getChildByName("nodeCenter").active = true;
            this.node.getChildByName("nodeBottom").active = true;
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

    initParam() {
        let index = this.index - 1;
        let equips = GlobalVar.me().leaderData.getLeaderEquips();
        let equipData = GlobalVar.tblApi.getDataByMultiKey("TblLeaderEquip", equips[index].Pos, equips[index].Quality);

        let nodeCenter = this.node.getChildByName("nodeCenter");
        let labelEquiptName = nodeCenter.getChildByName("spriteNameBg").getChildByName("labelName");
        labelEquiptName.getComponent(cc.Label).string = equipData.strName;
        labelEquiptName.color = GlobalFunc.getSystemColor(equipData.byColor);

        let nodeIcon = nodeCenter.getChildByName("nodeIcon");
        let iconIndex = equipData.wIcon / 10 % 10 + 1;
        GlobalVar.resManager().loadRes(ResMapping.ResType.SpriteFrame, 'cdnRes/itemiconBig/' + iconIndex + '/' + equipData.wIcon, function (frame) {
            if (cc.isValid(nodeIcon) && frame != null) {
                nodeIcon.getComponent(cc.Sprite).spriteFrame = frame;
            }
        });

        if (this.curOperaType == 0)
            this.initLevelUp();
        else
            this.initQualityUp();
    },

    getLabel(parent, name) {
        return this.seekNodeByName(parent, name).getComponent(cc.Label);
    },

    initLevelUp: function () {
        let levelUpInterface = this.nodeOperateAttributeChange[0];
        let labelLevelNumberBefore = this.getLabel(levelUpInterface, "labelLevelNumberBefore");
        let labelLevelNumberAfter = this.getLabel(levelUpInterface, "labelLevelNumberAfter");
        let labelAttributeNumberBefore = this.getLabel(levelUpInterface, "labelAttributeNumberBefore");
        let labelAttributeNumberAftere = this.getLabel(levelUpInterface, "labelAttributeNumberAfter");
        let labelAttributeBefore = this.getLabel(levelUpInterface, "labelAttributeBefore");
        let labelAttributeAfter = this.getLabel(levelUpInterface, "labelAttributeAfter");

        let LevelUpConfirm = this.nodeOperateConfirm[0];

        let labelLevelUpOneNeedGold = this.seekNodeByName(LevelUpConfirm, "labelLevelUpOne").getComponent(cc.Label);
        let labelLevelUpFiveNeedGold = this.seekNodeByName(LevelUpConfirm, "labelLevelUpFive").getComponent(cc.Label);

        let levelUpNeedGold = 0;
        let levelUpOneNeedGold = 0;
        let index = this.index - 1;
        let equips = GlobalVar.me().leaderData.getLeaderEquips();
        let leaderEquipData = GlobalVar.tblApi.getDataByMultiKey("TblLeaderEquip", equips[index].Pos, equips[index].Quality);

        let maxLevel = GameServerProto.PT_PLAYER_MAX_LEVEL * 2;
        let levelLimit = GlobalVar.me().level * 2;

        let canUplevel = 5;
        if (equips[index].Level + canUplevel > levelLimit) {
            canUplevel = levelLimit - equips[index].Level;
        }

        if (canUplevel == 0 && equips[index].Level != maxLevel) {
            var levelUpData = GlobalVar.tblApi.getDataBySingleKey('TblLeaderEquipLevel', equips[index].Level + 1);
            levelUpNeedGold = levelUpData.oVecGoldCost[equips[index].Pos - 1];
            labelLevelUpOneNeedGold.string = levelUpNeedGold;
            labelLevelUpFiveNeedGold.string = levelUpNeedGold;
        }

        canUplevel = canUplevel == 0 ? 1 : canUplevel;

        for (let i = 0; i < canUplevel; i++) {
            if (equips[index].Level == levelLimit) {
                canUplevel = 1;
                break;
            }
            var levelUpData = GlobalVar.tblApi.getDataBySingleKey('TblLeaderEquipLevel', equips[index].Level + i);
            levelUpNeedGold = levelUpNeedGold + levelUpData.oVecGoldCost[equips[index].Pos - 1];
            levelUpOneNeedGold = i == 0 ? levelUpNeedGold : levelUpOneNeedGold;
            labelLevelUpOneNeedGold.string = levelUpOneNeedGold;
            labelLevelUpFiveNeedGold.string = levelUpNeedGold;
            if (levelUpNeedGold > GlobalVar.me().gold) {
                canUplevel = canUplevel < i ? canUplevel : i;
                if (canUplevel != 0)
                    labelLevelUpFiveNeedGold.string = levelUpNeedGold - levelUpData.oVecGoldCost[equips[index].Pos - 1];
                break;
            }
        }
        canUplevel = canUplevel == 0 ? 1 : canUplevel;

        for (let i = 0; i < canUplevel; i++) {
            var levelUpData = GlobalVar.tblApi.getDataBySingleKey('TblLeaderEquipLevel', equips[index].Level + i);
            if (i == 0) {
                let beforeLevelAttribute = levelUpData.oVecProp[equips[index].Pos - 1];
                let propData = GlobalVar.tblApi.getDataBySingleKey('TblPropName', beforeLevelAttribute.wPropID);
                labelAttributeNumberBefore.string = beforeLevelAttribute.nAddValue + leaderEquipData.oVecProp[0].nAddValue;
                labelAttributeBefore.string = labelAttributeAfter.string = propData.strName;
            }
            if (i == 1 || canUplevel == 1) {
                let afterLevelAttribute = levelUpData.oVecProp[equips[index].Pos - 1];
                labelAttributeNumberAftere.string = afterLevelAttribute.nAddValue + leaderEquipData.oVecProp[0].nAddValue;
            }
        }
        let btnLevelUpFive = LevelUpConfirm.getChildByName("btnLevelUpFive");
        btnLevelUpFive.getComponent(cc.Button).clickEvents[0].customEventData = canUplevel;
        btnLevelUpFive.getComponent("ButtonObject").setText(i18n.t('label.4000256').replace("%d", canUplevel));
        this.curEquipLevel = equips[this.index - 1].Level;
        labelLevelNumberBefore.string = equips[index].Level + "/" + levelLimit;
        labelLevelNumberAfter.string = (equips[index].Level + 1) > levelLimit ? (levelLimit + "/" + levelLimit) : equips[index].Level + 1 + "/" + levelLimit;

        let hasMaxLevelFunc = function (bool) {
            levelUpInterface.getChildByName('labelAttributeAfter').active = !bool;
            levelUpInterface.getChildByName('labelLevelAfter').active = !bool;
            levelUpInterface.getChildByName('spriteArrow').active = !bool;
            levelUpInterface.getChildByName('labelLevelBefore').x = bool ? -50 : -170;
            levelUpInterface.getChildByName('labelAttributeBefore').x = bool ? -50 : -170;
            LevelUpConfirm.active = !bool;
        }

        if (equips[index].Level == maxLevel) {
            hasMaxLevelFunc(true);
        } else {
            hasMaxLevelFunc(false);
        }
    },

    initQualityUp: function () {
        let itemData = this.data;

        let advanceInterface = this.nodeOperateAttributeChange[1];
        let labelNameBefore = this.getLabel(advanceInterface, "labelNameBefore");
        let labelNameAfter = this.getLabel(advanceInterface, "labelNameAfter");
        let labelAttributeBefore = this.getLabel(advanceInterface, "labelAttributeBefore");
        let labelAttributeAfter = this.getLabel(advanceInterface, "labelAttributeAfter");
        let labelAttributeNumberBefore = this.getLabel(advanceInterface, "labelAttributeNumberBefore");
        let labelAttributeNumberAfter = this.getLabel(advanceInterface, "labelAttributeNumberAfter");

        let qualityUpConfirm = this.nodeOperateConfirm[1];
        let materialModel = qualityUpConfirm.getChildByName("nodeMaterialModel");
        let layerContent = qualityUpConfirm.getChildByName("layoutMaterials");
        layerContent.removeAllChildren();

        let index = this.index - 1;
        let equips = GlobalVar.me().leaderData.getLeaderEquips();
        let leaderEquipData = GlobalVar.tblApi.getDataByMultiKey("TblLeaderEquip", equips[index].Pos, equips[index].Quality);
        let leaderEquipDataAfter = GlobalVar.tblApi.getDataByMultiKey("TblLeaderEquip", equips[index].Pos, equips[index].Quality + 1);

        // let itemDataAfterId = leaderEquipDataAfter.wIcon;
        // let itemDataAfter = GlobalVar.tblApi.getDataBySingleKey("TblItem", itemDataAfterId);
        let equipUpCost = leaderEquipData.oVecUpCost;
        this.canQuilityUp = true;
        for (let i = 0; i < equipUpCost.length; i++) {
            let material = cc.instantiate(materialModel);
            let itemObject = material.getChildByName("ItemObject").getComponent("ItemObject");
            itemObject.updateItem(equipUpCost[i].wItemID);
            itemObject.setClick(true, 1);

            let richTextCount = material.getChildByName("richTextCount").getComponent(cc.RichText);
            let strCount = ""
            let itemCount = GlobalVar.me().bagData.getItemCountById(equipUpCost[i].wItemID);
            if (itemCount < equipUpCost[i].nCount) {
                strCount += "<color=red>" + itemCount + "</c>"
                this.canQuilityUp = false;
            } else {
                strCount += "<color=green>" + itemCount + "</c>"
            }
            strCount += ""
            strCount += "<color=white>/</c>"
            strCount += "<color=green>" + equipUpCost[i].nCount + "</c>"
            richTextCount.string = strCount;

            layerContent.addChild(material);
            material.active = true;
        }

        labelNameBefore.node.color = GlobalFunc.getSystemColor(leaderEquipData.byColor);
        labelNameBefore.string = leaderEquipData.strName;
        ///当前装备只有一种属性,所以这么写
        let levelUpData = GlobalVar.tblApi.getDataBySingleKey('TblLeaderEquipLevel', equips[index].Level);
        labelAttributeBefore.string = labelAttributeAfter.string = GlobalVar.tblApi.getDataBySingleKey("TblPropName", leaderEquipData.oVecProp[0].wPropID).strName;
        labelAttributeNumberBefore.string = leaderEquipData.oVecProp[0].nAddValue + levelUpData.oVecProp[equips[index].Pos - 1].nAddValue;


        let hasMaxLevelFunc = function (bool) {
            advanceInterface.getChildByName('labelNameAfter').active = !bool;
            advanceInterface.getChildByName('labelAttributeAfter').active = !bool;
            advanceInterface.getChildByName('spriteArrow').active = !bool;
            advanceInterface.getChildByName('labelNameBefore').x = bool ? 0 : -140;
            advanceInterface.getChildByName('labelAttributeBefore').x = bool ? -20 : -150;
            qualityUpConfirm.active = !bool;
        }

        if (!leaderEquipDataAfter) {
            // console.log("装备已经达到最高品阶");
            // this.canQuilityUp = false;
            // labelAttributeAfter.string = ""
            // labelAttributeNumberAfter.string = ""
            // labelNameAfter.string = ""
            hasMaxLevelFunc(true);
        } else {
            // advanceInterface.getChildByName("spriteArrow").active = true;
            hasMaxLevelFunc(false);
            // labelAttributeAfter.string = GlobalVar.tblApi.getDataBySingleKey("TblPropName", leaderEquipDataAfter.oVecProp[0].wPropID).strName;
            labelAttributeNumberAfter.string = leaderEquipDataAfter.oVecProp[0].nAddValue + levelUpData.oVecProp[equips[index].Pos - 1].nAddValue;
            labelNameAfter.node.color = GlobalFunc.getSystemColor(leaderEquipDataAfter.byColor);
            labelNameAfter.string = leaderEquipDataAfter.strName;

            // labelNameBefore.node.color = GlobalFunc.getCCColorByQuality(itemData.wQuality);
            // labelNameBefore.string = itemData.strName;
            // labelNameAfter.node.color = GlobalFunc.getCCColorByQuality(itemDataAfter.wQuality);
            // labelNameAfter.string = itemDataAfter.strName;
        }
    },

    selectEquipment: function (event, index) {
        index = parseInt(index);
        // if (index < 1 || index > this.equipment.length) return;
        index = index == 0 ? 6 : index;
        index = index == 7 ? 1 : index;
        this.index = index;
        for (let i = 0; i < this.equipment.length; i++) {
            if (i != index - 1) {
                this.equipment[i].getComponent("ItemObject").setSpriteChoosingVisible(false);
            } else {
                this.equipment[i].getComponent("ItemObject").setSpriteChoosingVisible(true);
                this.initParam();
            }
        }
        if (index < 4) {
            this.scrollEquiptView.scrollToLeft(0.5);
        } else {
            this.scrollEquiptView.scrollToRight(0.5);
        }
        this.updateHotPoint();
    },

    setInitSelected: function (index) {
        if (this.index != -1) return;
        index = parseInt(index);
        this.index = index;
        let item = this.equipment[index - 1].getComponent("ItemObject");
        if (index > 3) {
            //this.scrollEquiptView.scrollToPercentHorizontal(1, 0.01);
            this.scrollEquiptView.scrollToRight(0.5);
        }
        item.setSpriteChoosingVisible(true);
        this.initParam()

        this.updateHotPoint();
    },

    onBtnOperaType: function (event, type) {
        type = parseInt(type);
        if (this.curOperaType === type) {
            return;
        } else {
            this.curOperaType = type;
            for (let i = 0; i < this.spriteOperaTypeList.length; i++) {
                if (i === type) {
                    this.spriteOperaTypeList[i].setFrame(1)
                    this.setOperate();
                } else {
                    this.spriteOperaTypeList[i].setFrame(0);
                }
            }
        }
    },

    setOperate: function () {
        for (let i = 0; i < this.nodeOperateAttributeChange.length; i++) {
            if (i === this.curOperaType) {
                this.nodeOperateAttributeChange[i].active = true;
            } else {
                this.nodeOperateAttributeChange[i].active = false;
            }
        }

        for (let i = 0; i < this.nodeOperateConfirm.length; i++) {
            if (i === this.curOperaType) {
                this.nodeOperateConfirm[i].active = true;
            } else {
                this.nodeOperateConfirm[i].active = false;
            }
        }

        if (this.curOperaType == 0)
            this.initLevelUp();
        else
            this.initQualityUp();
    },

    reBackOperateSwitch: function () {
        this.canOperata = true;
    },

    onBtnLevelUp: function (event, count) {
        if (!this.canOperata) return;
        this.canOperata = false;
        this.unschedule(this.canOperataReset);
        this.scheduleOnce(this.canOperataReset, 2);
        count = parseInt(count);
        let LevelUpConfirm = this.nodeOperateConfirm[0];
        let labelLevelUpOneNeedGold = this.seekNodeByName(LevelUpConfirm, "labelLevelUpOne").getComponent(cc.Label);
        let labelLevelUpFiveNeedGold = this.seekNodeByName(LevelUpConfirm, "labelLevelUpFive").getComponent(cc.Label);
        let needGold = -1;
        if (count == 1) {
            needGold = parseInt(labelLevelUpOneNeedGold.string);
        } else {
            needGold = parseInt(labelLevelUpFiveNeedGold.string);
        }

        if (needGold === -1) {
            // console.log("需求金币数异常");
            this.canOperata = true;
            return;
        }

        let userHaveGold = GlobalVar.me().getGold();
        if (userHaveGold < needGold) {
            // GlobalVar.comMsg.showMsg(i18n.t('label.4000227'));
            CommonWnd.showNormalFreeGetWnd(GameServerProto.PTERR_GOLD_LACK);
            this.canOperata = true;
            return;
        }

        let levelLimit = GlobalVar.me().level * 2;
        let equips = GlobalVar.me().leaderData.getLeaderEquips();
        let curLevel = equips[this.index - 1].Level;
        if (curLevel == levelLimit) {
            GlobalVar.comMsg.errorWarning(GameServerProto.PTERR_LEADEREQUIP_LEVEL_MAX);
            this.canOperata = true;
            return;
        }

        this.levelUp(count);
    },

    onBtnQualityUp: function () {
        // this.spriteEquip[0].node.active = false;
        // let self = this;
        // CommonWnd.showEquipQualityUpWnd(8100, 8110, "银鳞胸甲+99", 1, function () {
        //     self.spriteEquip[0].node.active = true;
        // });
        // return;


        if (!this.canOperata) return;
        this.canOperata = false;
        this.unschedule(this.canOperataReset);
        this.scheduleOnce(this.canOperataReset, 2);
        if (!this.canQuilityUp) {
            GlobalVar.comMsg.showMsg(i18n.t('label.4000235'));
            this.canOperata = true;
            return;
        }

        this.qualityUp();
    },

    onBlackBackClick: function () {
        if (this.canCloseBlackBack) {
            this.node.getChildByName("spriteBlackBack").active = false;
        }
    },

    canOperataReset: function (dt) {
        this.canOperata = true;
    },

    onLevelUp: function (event) {
        this.canOperata = true;
        if (event.ErrCode && event.ErrCode !== GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        // 播放音效
        GlobalVar.soundManager().playEffect(AUDIO_LEVEL_UP);

        // console.log("onLevelUpEvent = ", event);
        if (event.Equip.Level - this.curEquipLevel !== this.count) {
            GlobalVar.comMsg.showMsg(i18n.t('label.4000236').replace('%d', (event.Equip.Level - this.curEquipLevel)));
        } else {
            GlobalVar.comMsg.showMsg(i18n.t('label.4000237').replace('%d', (event.Equip.Level - this.curEquipLevel)));
        }
        let leaderEquipData = GlobalVar.tblApi.getDataByMultiKey("TblLeaderEquip", event.Equip.Pos, event.Equip.Quality);
        let itemObj = this.equipment[event.Equip.Pos - 1].getComponent("ItemObject");
        itemObj.setSpriteItemIconData(leaderEquipData.wIcon, leaderEquipData.byColor);
        itemObj.setSpriteEdgeData(leaderEquipData.byColor * 100);
        itemObj.setLabelLevelData(event.Equip.Level);
        itemObj.setLabelQualityNumberData(leaderEquipData.strName);

        // item.updateItem(leaderEquipData.wIcon, -1, event.Equip.Level);
        // item.setSpriteQualityIconVisible(false);
        // item.setSpriteEdgeData(event.Equip.Quality * 100);
        // itemObj.setSpriteChoosingVisible(true);

        this.updateHotPoint();

        this.initParam();

        let effect = this.node.getChildByName("nodeCenter").getChildByName("nodeEffect");
        effect.active = true;
        effect.getComponent(sp.Skeleton).clearTracks();
        effect.getComponent(sp.Skeleton).setAnimation(0, "animation", false);
        let self = this;
        effect.getComponent(sp.Skeleton).setCompleteListener(trackEntry => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            if (animationName == "animation") {
                effect.active = false;
            }
        });
    },

    onQualityUp: function (event) {
        this.canOperata = true;
        if (event.ErrCode && event.ErrCode !== GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        // 播放音效
        GlobalVar.soundManager().playEffect(AUDIO_QUALITY_UP);

        let leaderEquipDataBefore = GlobalVar.tblApi.getDataByMultiKey("TblLeaderEquip", event.Equip.Pos, event.Equip.Quality - 1);
        let beforeItemIcon = leaderEquipDataBefore.wIcon;

        // GlobalVar.comMsg.showMsg(i18n.t('label.4000238'));
        // console.log("onQualityUpEvent = ", event)

        let leaderEquipData = GlobalVar.tblApi.getDataByMultiKey("TblLeaderEquip", event.Equip.Pos, event.Equip.Quality);
        let itemObj = this.equipment[event.Equip.Pos - 1].getComponent("ItemObject")
        // item.updateItem(leaderEquipData.wIcon, -1, event.Equip.Level);
        itemObj.setSpriteItemIconData(leaderEquipData.wIcon, leaderEquipData.byColor);
        itemObj.setSpriteEdgeData(leaderEquipData.byColor * 100);
        itemObj.setLabelLevelData(event.Equip.Level);
        itemObj.setLabelQualityNumberData(leaderEquipData.strName);
        let afterItemIcon = leaderEquipData.wIcon;

        this.spriteEquip[0].node.active = false;
        let self = this;

        CommonWnd.showEquipQualityUpWnd(beforeItemIcon, afterItemIcon, leaderEquipDataBefore.strName, leaderEquipData.strName, leaderEquipDataBefore.byColor, leaderEquipData.byColor, function () {
            self.spriteEquip[0].node.active = true;
        });
        // let addValue = self.effectUI.getChildByName('addValuebg');
        // addValue.getChildByName('labelAddValuebefore').getComponent(cc.Label).string = leaderEquipDataBefore.strName;
        // addValue.getChildByName('labelAddValue').getComponent(cc.Label).string = leaderEquipData.strName;
        // addValue.getChildByName('labelAddValuebefore').color = GlobalFunc.getSystemColor(leaderEquipDataBefore.byColor);
        // addValue.getChildByName('labelAddValue').color = GlobalFunc.getSystemColor(leaderEquipData.byColor);
        // let equipSprite = self.effectUI.getChildByName('nodeEquip');
        // let index = beforeItemIcon / 10 % 10 + 1;
        // GlobalVar.resManager().loadRes(ResMapping.ResType.SpriteFrame, 'cdnRes/itemiconBig/' + index + '/' + beforeItemIcon, function (frame) {
        //     equipSprite.getComponent(cc.Sprite).spriteFrame = frame;
        //     self.playEffect(afterItemIcon);
        // });

        this.updateHotPoint();

        this.initParam();
    },

    playEffect: function (afterItemIcon) {
        let self = this;
        self.effectUI.active = true;
        let effect0 = self.effectUI.getChildByName('effectNode').getComponent(sp.Skeleton);
        let effect1 = self.effectUI.getChildByName('nodeEffectFront').getComponent(dragonBones.ArmatureDisplay);
        let effect2 = self.effectUI.getChildByName('nodeEffectBack').getComponent(dragonBones.ArmatureDisplay);
        let equipSprite = self.effectUI.getChildByName('nodeEquip');
        let labelTip = self.effectUI.getChildByName('labelTip');
        let spriteContinue = self.effectUI.getChildByName('spriteContinue');
        let addValue = self.effectUI.getChildByName('addValuebg');
        let showTextAnime = function () {
            spriteContinue.active = true;
            spriteContinue.runAction(cc.repeatForever(cc.sequence(cc.fadeIn(0.7), cc.fadeOut(0.7))));
            effect2.armature().animation.stop();
            GlobalVar.soundManager().playEffect(AUDIO_QUALITY_UP2);

            labelTip.active = true;
            labelTip.scale = 0;
            labelTip.runAction(cc.spawn(cc.scaleTo(0.2, 1), cc.moveBy(0.2, 0, 250)));
            addValue.active = true;
            addValue.scale = 0;
            addValue.runAction(cc.sequence(cc.spawn(cc.scaleTo(0.2, 1), cc.moveBy(0.2, 0, -95)), cc.callFunc(() => {
                self.canClose = true;
            })));
        }
        let effect1Finish = function () {
            effect1.node.active = false;
        };
        let effectFinish = function () {
            effect0.node.active = false;
            GlobalFunc.playDragonBonesAnimation(effect1.node, effect1Finish);
            let callfunc = cc.callFunc(() => {
                let index = afterItemIcon / 10 % 10 + 1;
                GlobalVar.resManager().loadRes(ResMapping.ResType.SpriteFrame, 'cdnRes/itemiconBig/' + index + '/' + afterItemIcon, function (frame) {
                    if(!cc.isValid(equipSprite)){
                        return;
                    }
                    equipSprite.getComponent(cc.Sprite).spriteFrame = frame;
                    GlobalFunc.playDragonBonesAnimation(effect2.node, null);

                    self.scheduleOnce(() => {
                        showTextAnime();
                    }, 1.8);
                });
            })
            let seq = cc.sequence(cc.scaleTo(0.7, 0.5), callfunc, cc.scaleTo(0.25, 2), cc.scaleTo(0.2, 1))
            equipSprite.runAction(seq);
        }
        effect0.node.active = true;
        effect0.setAnimation(0, "animation", false);
        GlobalFunc.playSpineAnimation(effect0.node, effectFinish, false);
    },

    clickMaskClose: function () {
        if (this.canClose) {
            this.effectUI.active = false;
            GlobalVar.me().propData.getShowCombatLate();
            if (config.NEED_GUIDE) {
                require('Guide').getInstance().doNextStep();
            }
        }
    },

    bagAddItem: function (data) {
        if (this.curOperaType)
            this.initQualityUp();
    },

    refreshUI: function () {
        this.initQualityUp();
    },

    close: function () {
        this.spriteEquip[0].node.active = false;
        this._super();
    },

    levelUp: function (count) {
        this.count = count;
        GlobalVar.handlerManager().memberHandler.sendLeaderEquipLevelUpReq(this.index, count);
    },

    qualityUp: function () {
        GlobalVar.handlerManager().memberHandler.sendLeaderEquipQualityUpReq(this.index);
    },
});