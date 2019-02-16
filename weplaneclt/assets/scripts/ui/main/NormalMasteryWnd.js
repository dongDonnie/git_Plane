const GlobalVar = require("globalvar");
const EventMsgID = require("eventmsgid");
const WindowManager = require("windowmgr");
const RootBase = require("RootBase");
const WndTypeDefine = require("wndtypedefine");
const CommonWnd = require("CommonWnd");
const i18n = require('LanguageData');
const GlobalFunc = require('GlobalFunctions');
const GameServerProto = require("GameServerProto");
const PlaneEntity = require('PlaneEntity');
const Defines = require('BattleDefines');
const BattleManager = require('BattleManager');

cc.Class({
    extends: RootBase,

    properties: {
        equipment: {
            default: [],
            type: cc.Node,
        },
        memberID: {
            default: 710,
            visible: false,
        },
        nodePlanet: {
            default: null,
            type: cc.Node
        },
        scrollContent: {
            default: null,
            type: cc.Node
        },
        totalPropNode: {
            default: [],
            type: cc.Node,
        }
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_MASTERY_WND;
        this.animeStartParam(0);
        if (GlobalFunc.isAllScreen() && !this.fixViewComplete) {
            this.fixViewComplete = true;
            this.fixView();
        }
    },

    fixView: function () {
        let bottomWidget = this.node.getChildByName("spriteBottom").getComponent(cc.Widget);
        bottomWidget.bottom += 80;
        bottomWidget.updateAlignment();
    },

    animeStartParam(num) {
        this.node.opacity = num;
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            GlobalVar.eventManager().removeListenerWithTarget(this);
            this.releaseConstData();
        } else if (name == "Enter") {
            this._super("Enter");
            this.deleteMode = false;
            this.registerEvent();
            this.getConstData();
            this.updatePanel();
        }
    },

    getConstData: function () {
        this.TblSpecial = GlobalVar.tblApi.getData('TblSpecial');
        this.TblSpecialLevel = GlobalVar.tblApi.getData('TblSpecialLevel');
        this.TblSpecialQuality = GlobalVar.tblApi.getData('TblSpecialQuality');

    },

    releaseConstData: function () {
        this.TblSpecial = null;
        this.TblSpecialLevel = null;
        this.TblSpecialQuality = null;

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

    registerEvent: function () {
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_MEMBER_SPECIAL_LEVELUP_ACK, this.onLevelUpCallBack, this);
    },

    updateFighter: function (member) {
        this.member = member;
        console.log(this.member);
        if (!this.planeEntity) {
            this.planeEntity = new PlaneEntity();
            this.planeEntity.newPart('Fighter/Fighter_' + member.MemberID, Defines.ObjectType.OBJ_HERO, 'PlaneObject', 3, 0, 0);
            this.planeEntity.setPosition(0, 0);
            this.nodePlanet.addChild(this.planeEntity);
            this.planeEntity.openShader(false);
        } else {
            this.nodePlanet.removeAllChildren();
            this.planeEntity = null;
            this.planeEntity = new PlaneEntity();
            this.planeEntity.newPart('Fighter/Fighter_' + member.MemberID, Defines.ObjectType.OBJ_HERO, 'PlaneObject', 3, 0, 0);
            this.planeEntity.setPosition(0, 0);
            this.nodePlanet.addChild(this.planeEntity);
            this.planeEntity.openShader(false);
        }
    },

    updatePanel: function () {
        for (let i = 0; i < 5; i++) {
            this.setMasteryItem(this.scrollContent.children[i], this.TblSpecial[i + 1]);
        }
        let totalProp = this.calcTotalProp();
        this.setLabelString(this.totalPropNode[0], totalProp.hp);
        this.setLabelString(this.totalPropNode[1], totalProp.attack);
        this.setLabelString(this.totalPropNode[2], totalProp.defence);
    },

    setMasteryItem: function (item, data) {
        this.setLabelString(item.getChildByName('labelMasteryName'), data.strName);
        item.getChildByName('ItemObject').getComponent('ItemObject').updateItem(1);
        item.getChildByName('btnoLevelUp').getComponent(cc.Button).clickEvents[0].customEventData = data.wID;
        let level = 1;
        let quality = 101;
        for (let i = 0; i < this.member.Special.length; i++) {
            if (data.wID == this.member.Special[i].ID) {
                level = this.member.Special[i].Level;
                quality = this.member.Special[i].Quality;
                break;
            }
        }
        
        if (this.member.Quality < data.wOpenLimit) {
            item.getChildByName('needItemIcon').active = false;
            item.getChildByName('needNum').active = false;
            item.getChildByName('ownerNum').active = false;
            item.getChildByName('btnoLevelUp').active = false;
            this.setLabelString(item.getChildByName('curLevel'), 0);
            this.setLabelString(item.getChildByName('addPro'), 0);
        } else {
            item.getChildByName('needItemIcon').active = true;
            item.getChildByName('needNum').active = true;
            item.getChildByName('ownerNum').active = true;
            item.getChildByName('btnoLevelUp').active = true;
            let levelItem = GlobalVar.me().bagData.getItemById(36);
            let qualityItem = GlobalVar.me().bagData.getItemById(93);
            


            this.setLabelString(item.getChildByName('curLevel'), level);
            let str = data.wID + '_' + level;
            let specialLevel = this.TblSpecialLevel[str];
            this.setLabelString(item.getChildByName('needNum'), specialLevel.oVecCost[0].nCount);
            this.setLabelString(item.getChildByName('ownerNum'), '/' + (levelItem ? levelItem.Count : 0));

            let nextLevel = this.TblSpecialLevel[data.wID + '_' + (level + 1)];
            let propname = '';
            if (nextLevel.oVecProp[0].wPropID == GameServerProto.PTPROP_HP) {
                propname = "生命";
            } else if (nextLevel.oVecProp[0].wPropID == GameServerProto.PTPROP_Attack) {
                propname = "攻击";
            } else if (nextLevel.oVecProp[0].wPropID == GameServerProto.PTPROP_Defence) {
                propname = "防御";
            }
            
            this.setLabelString(item.getChildByName('labelProName'), propname);
            this.setLabelString(item.getChildByName('addPro'), '+ ' + nextLevel.oVecProp[0].nAddValue);

            //突破
            
            if (nextLevel && nextLevel.wQualityID > quality) {
                this.qualityLevel = true;
                item.getChildByName('btnoLevelUp').getComponent('ButtonObject').setText('突破');
                item.getChildByName('needItemIcon').getComponent('RemoteSprite').setFrame(1);
                let prop = this.TblSpecialQuality[nextLevel.wQualityID];
                this.setLabelString(item.getChildByName('addPro'), '+ ' + prop.oVecProp[0].nAddValue);
                this.setLabelString(item.getChildByName('needNum'), prop.oVecUPCost[0].nCount);
                this.setLabelString(item.getChildByName('ownerNum'), '/' + (qualityItem ? qualityItem.Count : 0));
            } else {
                this.qualityLevel = false;
                item.getChildByName('btnoLevelUp').getComponent('ButtonObject').setText('升级');
                item.getChildByName('needItemIcon').getComponent('RemoteSprite').setFrame(0);
            }


            setTimeout(() => {
                item.getChildByName('ownerNum').x = item.getChildByName('needNum').x + 2 + item.getChildByName('needNum').width;
            }, 100);
        }
    },

    setLabelString:  function (node, str) {
        node.getComponent(cc.Label).string = str;
    },

    clickLevelUp: function (event, customEventData) {
        let msg = {
            MemberID: this.member.MemberID,
            SpecialID: customEventData
        }
        if (!this.qualityLevel)
            GlobalVar.handlerManager().memberHandler.sendMasteryLevelUpReq(msg);
        else
            GlobalVar.handlerManager().memberHandler.sendMasteryQualityUpReq(msg);
    },

    calcTotalProp: function () {
        let hp = 0;
        let attack = 0;
        let defence = 0;
        for (let i = 0; i < this.member.Special.length; i++) {
            let id = this.member.Special[i].ID;
            let level = this.member.Special[i].Level;
            let quality = this.member.Special[i].Quality;
            for (let j = 1; j <= level; j++) {
                let prop = this.TblSpecialLevel[id + '_' + j].oVecProp[0];
                if (GameServerProto.PTPROP_HP == prop.wPropID) {
                    hp += prop.nAddValue;
                } else if (GameServerProto.PTPROP_Attack == prop.wPropID) {
                    attack += prop.nAddValue;
                } else if (GameServerProto.PTPROP_Defence == prop.wPropID) {
                    defence += prop.nAddValue;
                }
            }
            for (let k = 101; k <= quality; k++) {
                let prop = this.TblSpecialQuality[k].oVecProp[0];
                if (GameServerProto.PTPROP_HP == prop.wPropID) {
                    hp += prop.nAddValue;
                } else if (GameServerProto.PTPROP_Attack == prop.wPropID) {
                    attack += prop.nAddValue;
                } else if (GameServerProto.PTPROP_Defence == prop.wPropID) {
                    defence += prop.nAddValue;
                }
            }
        }
        return { hp: hp, attack: attack, defence: defence };
    },

    clickFactoryBtn: function () {
        CommonWnd.showRoughFactory();
    },

    //请求回应处理
    onLevelUpCallBack: function (data) {
        if (data.ErrCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(data.ErrCode);
            return;
        }
        this.updatePanel();
    },
});