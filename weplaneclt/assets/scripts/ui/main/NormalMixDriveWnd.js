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
        labelName: {
            default: null,
            type: cc.Label
        },
        nodePlanet: {
            default: null,
            type: cc.Node
        },
        nodeDrivers: {
            default: null,
            type: cc.Node
        },
        labelCombatPoint: {
            default: null,
            type: cc.Label
        },
        labelStrength: {
            default: null,
            type: cc.Label
        },
        labelLifeNumber: {
            default: null,
            type: cc.Label,
        },
        labelAttackNumber: {
            default: null,
            type: cc.Label,
        },
        labelDefenceNumber: {
            default: null,
            type: cc.Label,
        },
        memberID: {
            default: 710,
            visible: false,
        },
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_MIXDRIVE_WND;
        this.animeStartParam(0);
        if (GlobalFunc.isAllScreen() && !this.fixViewComplete) {
            this.fixViewComplete = true;
            this.fixView();
        }
    },

    update: function (dt) {
        if (!!this.planeEntity) {
            this.planeEntity.update(dt);
        }
    },

    fixView: function () {
        let bottomWidget = this.node.getChildByName("spriteBottom").getComponent(cc.Widget);
        bottomWidget.bottom += 20;
        bottomWidget.updateAlignment();
    },

    animeStartParam(num) {
        this.node.opacity = num;
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            GlobalVar.eventManager().removeListenerWithTarget(this);
            this.nodePlanet.removeAllChildren();
            this.planeEntity = null;
        } else if (name == "Enter") {
            this._super("Enter");
            this.deleteMode = false;
            this.mixLevelBefore = 1;
            this.sumCombatRawBefore = 0;

            // GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_MIXDRIVE_DATA, this.updateDriveCardShow, this);
            GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_MEMBER_STANDINGBY_NTF, this.onMixMemberChange, this);
            GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_MIXDRIVE_LEVEL_NTF, this.showMixLevelChangeView, this);

            if (!this.planeEntity) {
                this.planeEntity = new PlaneEntity();
                this.planeEntity.newPart('Fighter/Fighter_' + this.memberID, Defines.ObjectType.OBJ_HERO, 'PlaneObject', 3, 0, 0);
                this.planeEntity.setPosition(0, 0);
                this.nodePlanet.addChild(this.planeEntity);
                this.planeEntity.openShader(false);
            } else {
                this.nodePlanet.removeAllChildren();
                this.planeEntity = null;
                this.planeEntity = new PlaneEntity();
                this.planeEntity.newPart('Fighter/Fighter_' + this.memberID, Defines.ObjectType.OBJ_HERO, 'PlaneObject', 3, 0, 0);
                this.planeEntity.setPosition(0, 0);
                this.nodePlanet.addChild(this.planeEntity);
                this.planeEntity.openShader(false);
            }
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

    onMixMemberChange: function (msg) {
        this.mixLevelBefore = this.mixLevel ? this.mixLevel : 1;
        this.sumCombatBefore = this.labelCombatPoint.string;
        this.hpNumBefore = this.labelLifeNumber.string;
        this.atkNumBefore = this.labelAttackNumber.string;
        this.defNumBefore = this.labelDefenceNumber.string;
        this.updateDriveCardShow();
    },

    updateDriveCardShow: function () {
        this.sumCombatRaw = 0;
        let mixOpenData = GlobalVar.tblApi.getData('TblMix');
        for (let i = 0; i < 4; i++) {
            let driveCard = this.nodeDrivers.children[i];
            let lockNode = driveCard.getChildByName('lock');
            let unlockNode = driveCard.getChildByName('unlock');

            if (GlobalVar.me().level >= mixOpenData[i+1].wLevelReq) {
                lockNode.active = false;
                unlockNode.active = true;

                let mixMemberId = GlobalVar.me().memberData.getMixMemberIDByIndex(i);
                if (mixMemberId) {
                    unlockNode.getChildByName('labelDesc').active = false;
                    unlockNode.getChildByName('nodeItem').active = true;
                    let itemObj = cc.find('nodeItem/ItemObject', unlockNode).getComponent("ItemObject");
                    itemObj.updateItem(mixMemberId);
                    itemObj.setSpritePieceVisible(false);
                    itemObj.setClick(false);
                    let member = GlobalVar.me().memberData.getMemberByID(mixMemberId);
                    cc.find('nodeItem/labelCpValue', unlockNode).getComponent(cc.Label).string = member.Combat;
                    this.sumCombatRaw += member.Combat;
                } else {
                    unlockNode.getChildByName('labelDesc').active = true;
                    unlockNode.getChildByName('nodeItem').active = false;
                }
            } else {
                lockNode.active = true;
                unlockNode.active = false;
                lockNode.getChildByName('labelLimit').getComponent(cc.Label).string = mixOpenData[i+1].strTip;
            }
        }

        this.updateAdvanceProp();
    },

    showMixLevelChangeView: function (data) {
        this.updateAdvanceProp();
        if (data.MixLevel > this.mixLevelBefore) {
            setTimeout(() => {
                CommonWnd.showNormalMixLevelUpWnd({
                    mixLevelBefore: this.mixLevelBefore,
                    sumCombatBefore: this.sumCombatBefore,
                    hpNumBefore: this.hpNumBefore,
                    atkNumBefore: this.atkNumBefore,
                    defNumBefore: this.defNumBefore,
                    mixLevelCur: this.mixLevel,
                    sumCombatCur: this.labelCombatPoint.string,
                    hpNumCur: this.labelLifeNumber.string,
                    atkNumCur: this.labelAttackNumber.string,
                    defNumCur: this.labelDefenceNumber.string,
                });
            }, 350);
        }
    },

    updataFighter: function (id, quality) {
        this.memberID = id;
        var fighterData = GlobalVar.tblApi.getDataBySingleKey('TblMember', id);
        let key = id + '_' + quality;
        this.qualityData = GlobalVar.tblApi.getDataBySingleKey('TblMemberQuality', key);
        this.setFighterName(fighterData.strName);
        this.setFighterNameColorByQuality(quality);
    },

    setFighterName: function (name) {
        this.labelName.string = name;
    },

    setFighterNameColorByQuality: function (quality) {
        this.labelName.node.color = GlobalFunc.getCCColorByQuality(quality);
    },

    updateAdvanceProp: function () {
        this.mixLevel = GlobalVar.me().memberData.getMixLevel();
        let combatRate = GlobalVar.tblApi.getDataBySingleKey('TblMixMaster', this.mixLevel).nCombatConvert;
        let sumCombat = this.sumCombatRaw * combatRate / 10000;

        this.labelStrength.string = (combatRate / 100).toFixed(2) + '%';
        this.labelCombatPoint.string = sumCombat.toFixed(0);

        let mixPropData = GlobalVar.tblApi.getData('TblMixProp');
        this.labelLifeNumber.string = Math.floor(sumCombat / 100 * mixPropData[1].dPropPerCombat);
        this.labelAttackNumber.string = Math.floor(sumCombat / 100 * mixPropData[2].dPropPerCombat);
        this.labelDefenceNumber.string = Math.floor(sumCombat / 100 * mixPropData[3].dPropPerCombat);
    },

    onDriverCardClick: function (event, param) {
        CommonWnd.showNormalMixDriveListWnd(parseInt(param));
    },

    onMixDriveBtnClick: function () {
        CommonWnd.showNormalMixDriveTechWnd();
    }

});
