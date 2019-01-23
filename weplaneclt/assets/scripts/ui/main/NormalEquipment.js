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

const AUDIO_USE_EXP_ITEM = 'cdnRes/audio/main/effect/shengji';
const AUDIO_LEVEL_UP = 'cdnRes/audio/main/effect/shengjie';
const AUDIO_QUALITY_UP = 'cdnRes/audio/main/effect/wujinchongfeng';

cc.Class({
    extends: RootBase,

    properties: {
        spriteQuality: {
            default: null,
            type: cc.Sprite
        },
        labelName: {
            default: null,
            type: cc.Label
        },
        labelLevelNumber: {
            default: null,
            type: cc.Label
        },
        equipment: {
            default: [],
            type: cc.Node,
        },
        memberID: {
            default: 710,
            visible: false,
        },
        useExpItemID: {
            default: -1,
            visible: false,
        },
        progressAction: {
            default: false,
            visible: false,
        },
        canUpQuality: {
            default: false,
            visible: false,
        },
        effectShengjie: {
            default: null,
            type: sp.Skeleton,
        },

        curLevelUpInterval: 0.2,
        minInterval: 0.05,
        interval: 0,
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMALEQUIPMENT_WND;
        this.animeStartParam(0);
        if (GlobalFunc.isAllScreen() && !this.fixViewComplete) {
            this.fixViewComplete = true;
            this.fixView();
        }

        this.registerEventHandler();
    },

    start: function () {
        // this.initEquipmentView();
    },

    update: function (dt) {
        if (!!this.planeEntity) {
            this.planeEntity.update(dt);
        }
    },

    initEquipmentView: function () {

        let equips = GlobalVar.me().leaderData.getLeaderEquips();
        for (let i = 0; i < equips.length; i++) {
            let level = equips[i].Level;
            let quality = equips[i].Quality;
            let pos = equips[i].Pos;
            let leaderEquipData = GlobalVar.tblApi.getDataByMultiKey("TblLeaderEquip", pos, quality);
            // let id = leaderEquipData.wIcon
            // this.equipment[i].getComponent("ItemObject").updateItem(id, -1, level);
            let itemObj = this.equipment[i].getComponent("ItemObject");
            itemObj.setAllVisible(false);
            itemObj.setSpriteItemIconData(leaderEquipData.wIcon, leaderEquipData.byColor);
            itemObj.setSpriteEdgeData(leaderEquipData.byColor * 100);
            itemObj.setLabelNumberData(-1);
            itemObj.setLabelLevelData(level);
            itemObj.setClick(true, 10);
            itemObj.setLabelQualityNumberData(leaderEquipData.strName);
            this.equipment[i].getParent().getChildByName("labelName").getComponent(cc.Label).string = leaderEquipData.strName;
            // this.equipment[i].getComponent("ItemObject").setSpriteEdgeData(quality * 100);
            // this.equipment[i].getComponent("ItemObject").setSpriteQualityIconVisible(false);
            this.equipment[i].getParent().getChildByName("labelName").color = GlobalFunc.getSystemColor(leaderEquipData.byColor);

            this.updateHotPoint();
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
    },

    updatePlanePropValue(showPropGrow) {
        let lifeAccount = 0, atkAccount = 0, defAccount = 0;
        // let equips = GlobalVar.me().leaderData.getLeaderEquips();

        let addPropValue = function (value, propID, dCoe) {
            dCoe = dCoe ? dCoe : 1;
            switch (parseInt(propID)) {
                case GameServerProto.PTPROP_Attack:
                    atkAccount += Math.floor(value * dCoe);
                    break;
                case GameServerProto.PTPROP_Defence:
                    defAccount += Math.floor(value * dCoe);
                    break;
                case GameServerProto.PTPROP_HP:
                    lifeAccount += Math.floor(value * dCoe);
                    break;
                default:
                    break;
            }
        }

        // for (let i = 0; i < equips.length; i++) {
        //     let leaderEquipData = GlobalVar.tblApi.getDataByMultiKey("TblLeaderEquip", equips[i].Pos, equips[i].Quality);
        //     let propQuaData = leaderEquipData.oVecProp;
        //     for (let i = 0; i < propQuaData.length; i++) {
        //         addPropValue(propQuaData[i].nAddValue, propQuaData[i].wPropID);
        //     }

        //     let levelUpData = GlobalVar.tblApi.getDataBySingleKey('TblLeaderEquipLevel', equips[i].Level);
        //     let propLevelData = levelUpData.oVecProp[equips[i].Pos - 1]
        //     addPropValue(propLevelData.nAddValue, propLevelData.wPropID);
        //     // for (let i = 0; i < propLevelData.length; i++) {
        //         // addPropValue(propLevelData[i]);
        //     // }
        // }

        let leaderEquipProps = GlobalVar.me().leaderData.getLeaderEquipsProp();
        for (let i in leaderEquipProps) {
            addPropValue(leaderEquipProps[i], i)
        }

        let memberProps = GlobalVar.me().memberData.getMemberPropByMemberID(this.memberID);
        if (showPropGrow)
            memberProps = GlobalVar.me().memberData.calcMemberPropByMemberID(this.memberID);
        for (let i in memberProps) {
            addPropValue(memberProps[i], i);
        }

        // let member = GlobalVar.me().memberData.getMemberByID(this.memberID);
        // let qualityData = GlobalVar.tblApi.getDataByMultiKey('TblMemberQuality', member.MemberID, member.Quality);
        // let propQuaMemberData = qualityData.oVecPropAll;
        // for (let i = 0; i < propQuaMemberData.length; i++) {
        //     addPropValue(propQuaMemberData[i].nAddValue, propQuaMemberData[i].wPropID);
        // }

        // let levelData = GlobalVar.tblApi.getDataBySingleKey('TblMemberLevel', member.MemberID);
        // ///////////////新的计算方式
        // let index = 0;
        // if (member.Level > levelData[index].wLevelMax){
        //     index = 1;
        // }
        // let planePower = levelData[index].wPropVar1 * member.Level + levelData[index].wPropVar2;
        // atkAccount += Math.round(planePower/30);
        // defAccount += Math.round(planePower/30);
        // lifeAccount += Math.round(planePower/6);
        ////////////////旧的计算方式
        // let memberData = GlobalVar.tblApi.getDataBySingleKey('TblMember', member.MemberID);
        // let propmemberCode = memberData.oVecPropCoe;
        // let propLevMemberData = levelData.oVecPropAll;
        // for (let i = 0; i < propLevMemberData.length; i++) {
        //     addPropValue(propLevMemberData[i], propmemberCode[i].dCoe);
        // }
        ////////////////

        if (showPropGrow) {
            let dropUpAnime = function (nodePlus, nodeTarget, laterValue) {
                nodePlus.stopAllActions();
                nodePlus.setScale(0);
                nodePlus.opacity = 255;
                nodePlus.x = (nodeTarget.x + (1 - (nodeTarget.getAnchorPoint().x)) * nodeTarget.width)

                let beforeValue = parseInt(nodeTarget.getComponent(cc.Label).string)
                let between = laterValue - beforeValue;
                nodePlus.getComponent(cc.Label).string = "(+" + between + ")";
                nodePlus.runAction(cc.sequence(cc.scaleTo(0.2, 1, 1), cc.delayTime(0.5), cc.fadeOut(0.2), cc.callFunc(() => {
                    nodePlus.opacity = 1;
                    nodeTarget.getComponent(cc.Label).string = laterValue;
                }, this)))
            };

            dropUpAnime(this.getNodeByName("labelAttackPlus"), this.getNodeByName("labelAttack"), atkAccount);
            dropUpAnime(this.getNodeByName("labelDefencePlus"), this.getNodeByName("labelDefence"), defAccount);
            dropUpAnime(this.getNodeByName("labelLifePlus"), this.getNodeByName("labelLife"), lifeAccount);
        } else {
            this.getNodeByName("labelAttack").getComponent(cc.Label).string = atkAccount;
            this.getNodeByName("labelDefence").getComponent(cc.Label).string = defAccount;
            this.getNodeByName("labelLife").getComponent(cc.Label).string = lifeAccount;
        }
    },

    registerEventHandler: function () {
        let btnlv = this.getNodeByName("btnoLevelUp");
        btnlv.on('touchstart', this.startLevelUp.bind(this));
        btnlv.on('touchend', this.endLevelUp.bind(this));
        btnlv.on('touchcancel', this.cancelLevelUp.bind(this));

        var self = this;
        cc.game.on(cc.game.EVENT_HIDE, function (event) {
            // cc.log("切换后台", event);
            self.cancelLevelUp();
        });
        cc.game.on(cc.game.EVENT_SHOW, function (event) {
            // cc.log("切换前台", event);
        });
    },

    LOADING_ACTION_STYLE_SEQ_WITH_EASEOUT: function (duration, from, to, callback) {
        let lvTab = this.getNodeByName("spriteLevelUp");
        let bar = lvTab.getChildByName("barExpPercent");

        if (to <= from) {
            let action1 = cc.progressLoading(duration * (1 - from) / (1 - from + to), from, 1, callback);
            let action2 = cc.progressLoading(duration * to / (1 - from + to), 0, to, callback);
            bar.runAction(cc.sequence(action1, action2));
        } else {
            let action = cc.progressLoading(duration, from, to, callback);
            bar.runAction(action);
        }
    },

    // test: function () {
    //     // cc.log("$");
    //     let lvTab = this.getNodeByName("spriteLevelUp");
    //     let bar = lvTab.getChildByName("barExpPercent").getComponent(cc.ProgressBar);
    //     this.LOADING_ACTION_STYLE_SEQ_WITH_EASEOUT(0.2, bar.progress, 0.2);
    //     this.schedule(this.test5, 0.5);
    // },

    // test1: function () {
    //     // cc.log("&");
    //     this.unschedule(this.test5);
    // },

    // test2: function () {
    //     this.test4();
    // },

    // test4: function () {
    //     // cc.log("@@@@@@@@@@@@@@")
    // },

    test3: function (event, index) {
        this.deleteMode = false;
        if (typeof index !== 'undefined') {
            this.clickIndex = index;
            this.animePlay(0);
        }
    },

    // test5: function () {
    //     let lvTab = this.getNodeByName("spriteLevelUp");
    //     let bar = lvTab.getChildByName("barExpPercent").getComponent(cc.ProgressBar);
    //     //this.LOADING_ACTION_STYLE_SEQ_WITH_EASEOUT(0.3,bar.progress,Math.floor(Math.random()*10)/10);
    //     this.LOADING_ACTION_STYLE_SEQ_WITH_EASEOUT(0.2, bar.progress, 0.3);
    // },

    fixView: function () {
        let bottomWidget = this.node.getChildByName("spriteBottom").getComponent(cc.Widget);
        bottomWidget.bottom += 80;
        bottomWidget.updateAlignment();
    },

    animeStartParam(num, needRefreshEquip) {
        this.node.opacity = num;
        if (needRefreshEquip) {
            this.initEquipmentView();
        }
        //this.node.getChildByName("spriteBottom").getChildByName("spriteFighterChassis").getChildByName("spineFighter").active=false;

        if (num == 0 || num == 255) {
            this.node.getChildByName("nodeCenter").getChildByName("spriteBothsideBg").active = false;
            this.node.getChildByName("spriteBottom").getChildByName("spriteLevelUp").active = false;
            this.node.getChildByName("spriteBottom").getChildByName("spriteQualityUp").active = false;
        }
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            GlobalVar.eventManager().removeListenerWithTarget(this);
            if (!this.deleteMode) {
                var self = this;
                WindowManager.getInstance().insertView(WndTypeDefine.WindowType.E_DT_NORMALIMPROVEMENT_WND, WndTypeDefine.WindowType.E_DT_NORMALROOT_WND, function (wnd, name, type) {
                    //let member = GlobalVar.me().memberData.getMemberByID(self.memberID);
                    //wnd.getComponent(type).updataFighter(member.MemberID,member.Quality,member.Level);
                    // console.log("self = ", self);
                    // console.log("self.index = ", self.clickIndex);
                    wnd.getComponent(type).selectEquipment(null, self.clickIndex);
                }, true, false);
            } else {

            }
        } else if (name == "Enter") {
            this._super("Enter");
            this.deleteMode = false;
            //this.node.getChildByName("spriteBottom").getChildByName("spriteFighterChassis").getChildByName("spineFighter").active=true;
            GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_MEMBER_LEVELUP_NTF, this.onLevelUp, this);
            GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_MEMBER_QUALITYUP_NTF, this.onQualityUp, this);
            GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_BAG_ADDITEM_NTF, this.bagAddItem, this);
            GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_SWEEP_RESULT, this.bagAddItem, this);
            if (!this.planeEntity) {
                this.planeEntity = new PlaneEntity();
                this.planeEntity.newPart('Fighter/Fighter_' + this.memberID, Defines.ObjectType.OBJ_HERO, 'PlaneObject', 3, 0, 0);
                this.planeEntity.setPosition(0, 0);
                this.node.getChildByName("nodeCenter").getChildByName("nodePlanet").addChild(this.planeEntity);
                this.planeEntity.openShader(false);

                // let self = this;
                // this.runAction(cc.sequence(cc.delayTime(2), cc.callFunc(()=>{

                // })));
            } else {
                this.node.getChildByName("nodeCenter").getChildByName("nodePlanet").removeAllChildren();
                this.planeEntity = null;
                this.planeEntity = new PlaneEntity();
                this.planeEntity.newPart('Fighter/Fighter_' + this.memberID, Defines.ObjectType.OBJ_HERO, 'PlaneObject', 3, 0, 0);
                this.planeEntity.setPosition(0, 0);
                this.node.getChildByName("nodeCenter").getChildByName("nodePlanet").addChild(this.planeEntity);
                this.planeEntity.openShader(false);
            }

            this.node.getChildByName("nodeCenter").getChildByName("spriteBothsideBg").active = true;
            this.node.getChildByName("spriteBottom").getChildByName("spriteLevelUp").active = true;
            this.node.getChildByName("spriteBottom").getChildByName("spriteQualityUp").active = true;

            BattleManager.getInstance().quitOutSide();
        }
    },

    bagAddItem: function () {
        this.setLevelUp(this.useExpItemID, this.memberID);
        this.setQualityUp(this.memberID);
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

    updataFighter: function (id, quality, level) {
        this.memberID = id;
        var fighterData = GlobalVar.tblApi.getDataBySingleKey('TblMember', id);
        let key = id + '_' + quality;
        this.qualityData = GlobalVar.tblApi.getDataBySingleKey('TblMemberQuality', key);
        this.setFighterQuality(fighterData.stPingJia.byStarNum);
        this.setFighterName(fighterData.strName + ' ' + this.qualityData.strQualityDisplay);
        this.setFighterNameColorByQuality(quality);
        this.setFighterLevel(level);

        this.setLevelUp(this.useExpItemID, this.memberID);
        this.setQualityUp(this.memberID);
        let isLevelUp = GlobalVar.me().memberData.getIsLevelUp();
        let isPowerUp = isLevelUp || GlobalVar.me().memberData.getIsQualityUp();
        this.updatePlanePropValue(isPowerUp);
        if (isLevelUp) {
            // 播放音效
            GlobalVar.soundManager().playEffect(AUDIO_LEVEL_UP);
            GlobalVar.comMsg.showMsg("战机等级提升");
        }
        this.canUseExpItem = true;
    },

    setFighterQuality: function (quality) {
        let index = typeof quality !== 'undefined' ? quality - 1 : 0;
        this.spriteQuality.getComponent("RemoteSprite").setFrame(index);
    },

    setFighterName: function (name) {
        this.labelName.string = name;
    },
    setFighterNameColorByQuality: function (quality) {
        this.labelName.node.color = GlobalFunc.getCCColorByQuality(quality);
    },

    setFighterLevel: function (level) {
        this.labelLevelNumber.string = level;
    },

    setLevelUp: function (itemID, memberID) {
        let lvTab = this.getNodeByName("spriteLevelUp");
        let item = lvTab.getChildByName("nodeItem").getChildByName("ItemObject").getComponent("ItemObject");
        let count = GlobalVar.me().bagData.getItemCountById(itemID);
        if (typeof itemID !== 'undefined' && itemID != -1 && count != 0) {
            this.useExpItemID = itemID;
            // let count = GlobalVar.me().bagData.getItemCountById(itemID);
            item.updateItem(itemID, count);
        } else {
            let hasItem = false;
            for (let i = 504; i >= 501; i--) {
                count = GlobalVar.me().bagData.getItemCountById(i);
                if (count > 0) {
                    this.useExpItemID = i;
                    item.updateItem(i, count);
                    hasItem = true;
                    break;
                }
            }
            if (!hasItem) {
                this.useExpItemID = this.useExpItemID == -1 ? 501 : this.useExpItemID;
                item.updateItem(this.useExpItemID);
            }
        }

        if (item.getLabelNumberData() == 0) {
            item.setNodeAddVisible(true);
        } else {
            item.setNodeAddVisible(false);
        }

        /**
         * beforeLevel 标记升级前的等级，若升级后等级变动，应该让经验条动画有从1到0的变化
         */
        let beforeLevel = parseInt(lvTab.getChildByName("labelLevelNumber").getComponent(cc.Label).string);
        let beforeExpPercent = parseInt(lvTab.getChildByName("labelOwn").getComponent(cc.Label).string) / parseInt(lvTab.getChildByName("labelNeed").getComponent(cc.Label).string)
        let member = GlobalVar.me().memberData.getMemberByID(memberID);
        lvTab.getChildByName("labelLevelNumber").getComponent(cc.Label).string = member.Level;
        lvTab.getChildByName("labelOwn").getComponent(cc.Label).string = member.Exp;

        let levelUpNeedExp = GlobalVar.me().memberData.getMemberLevelUpNeedExpByMemberID(memberID);

        lvTab.getChildByName("labelNeed").getComponent(cc.Label).string = levelUpNeedExp;
        if (!this.progressAction) {
            lvTab.getChildByName("barExpPercent").getComponent(cc.ProgressBar).progress = member.Exp / levelUpNeedExp;
        } else {
            this.levelUpAction(this.curLevelUpInterval, beforeExpPercent, member.Exp / levelUpNeedExp, null, member.Level - beforeLevel);
            this.progressAction = false;
        }

        // let color = null;
        // if (member.Exp < levelUpNeedExp) {
        //     color = GlobalFunc.getSystemColor(5);
        // } else {
        //     color = GlobalFunc.getSystemColor(1);
        // }
        // lvTab.getChildByName("labelOwn").color = color;
        lvTab.getChildByName("btnoLevelUp").getChildByName("spriteHot").active = !!GlobalVar.me().memberData.levelUpHotFlag[memberID];


        let maxLevel = GameServerProto.PT_PLAYER_MAX_LEVEL * 2;
        if (member.Level == maxLevel) {
            lvTab.getChildByName("labelFullLevel").active = true;
            lvTab.getChildByName("labelCenter").getComponent(cc.Label).string = '';
            lvTab.getChildByName("labelOwn").getComponent(cc.Label).string = '';
            lvTab.getChildByName("labelNeed").getComponent(cc.Label).string = '';
            lvTab.getChildByName("barExpPercent").getComponent(cc.ProgressBar).progress = 1;
            this.levelUpAction(this.curLevelUpInterval, beforeExpPercent, 1, null, member.Level - beforeLevel);
        } else {
            lvTab.getChildByName("labelCenter").getComponent(cc.Label).string = '/';
            lvTab.getChildByName("labelFullLevel").active = false;
        }

        // if (member.Level > beforeLevel) {
        //     return true;
        // }
    },

    getChoosing: function (data) {
        // cc.log(data);
        this.setLevelUp(data, this.memberID);
    },

    setExp: function () {
        let showSelect = true;
        // let showSelect = true;
        for (let i = 501; i <= 504; i++) {
            let count = GlobalVar.me().bagData.getItemCountById(i)
            if (count > 0) {
                // showSelect = true;
                break;
            }
        }
        if (showSelect) {
            CommonWnd.showSelectExpTab(this.getChoosing, this);
        } else {
            let item = this.getNodeByName("spriteLevelUp").getChildByName("nodeItem").getChildByName("ItemObject").getComponent("ItemObject");
            CommonWnd.showItemGetWay(item.itemID, item.getLabelNumberData(), item.getSlot());
        }
    },

    setQualityUp: function (memberID) {
        let QuTab = this.getNodeByName("spriteQualityUp");
        let member = GlobalVar.me().memberData.getMemberByID(memberID);
        let key = memberID + '_' + member.Quality;
        let qualityData = GlobalVar.tblApi.getDataBySingleKey('TblMemberQuality', key);

        let item = QuTab.getChildByName("nodeItemQ").getChildByName("ItemObject").getComponent("ItemObject");
        item.updateItem(qualityData.wQualityUpPiece);
        item.setClick(true, 1);

        QuTab.getChildByName("labelQuality").getComponent(cc.Label).string = qualityData.strQualityDisplay;

        let own = GlobalVar.me().bagData.getItemCountById(qualityData.wQualityUpPiece);
        QuTab.getChildByName("labelOwn").getComponent(cc.Label).string = own;
        QuTab.getChildByName("labelNeed").getComponent(cc.Label).string = "/"+qualityData.nQualityUpNumber;
        QuTab.getChildByName("barPiecePercent").getComponent(cc.ProgressBar).progress = own / qualityData.nQualityUpNumber;
        this.canUpQuality = (own >= qualityData.nQualityUpNumber && qualityData.wQualityUpLevel <= GlobalVar.me().level);
        let color = null;
        if (own < qualityData.nQualityUpNumber) {
            color = GlobalFunc.getSystemColor(5);
        } else {
            color = GlobalFunc.getSystemColor(1);
        }
        QuTab.getChildByName("labelOwn").color = color;

        QuTab.getChildByName("btnoAdvance").getChildByName("spriteHot").active = !!GlobalVar.me().memberData.qualityUpHotFlag[memberID];

        if (qualityData.wQuality == 520) {
            QuTab.getChildByName("labelFullLevel").active = true;
            QuTab.getChildByName("labelOwn").getComponent(cc.Label).string = "";
            QuTab.getChildByName("barPiecePercent").getComponent(cc.ProgressBar).progress = 1;
            QuTab.getChildByName("labelNeed").getComponent(cc.Label).string = '';
            // QuTab.getChildByName("labelCenter").getComponent(cc.Label).string = '';
        } else {
            // QuTab.getChildByName("labelCenter").getComponent(cc.Label).string = '/';
            QuTab.getChildByName("labelFullLevel").active = false;
        }
    },

    levelUpAction: function (duration, from, to, callback, levelGap) {

        let bar = this.getNodeByName("spriteLevelUp").getChildByName("barExpPercent");
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

    ////////////////////////////////////////////////////////////////////////////////////////
    startLevelUp: function () {
        let netNode = cc.find("Canvas/NetNode");
        netNode.active = false;

        let count = GlobalVar.me().bagData.getItemCountById(this.useExpItemID);
        if (count == 0) {
            let item = this.getNodeByName("spriteLevelUp").getChildByName("nodeItem").getChildByName("ItemObject").getComponent("ItemObject");
            CommonWnd.showItemGetWay(item.itemID, item.getLabelNumberData(), item.getSlot());
            return;
        }
        this.levelUp();
        this.schedule(this.PressLevelUp, 0.01);
        // this.schedule(this.pressSendLevelUp, 0.3);
    },

    PressLevelUp: function (dt) {
        this.interval += dt;
        if (this.interval > this.curLevelUpInterval) {
            this.interval = 0;
            if (this.curLevelUpInterval > this.minInterval) {
                this.curLevelUpInterval -= 0.01;
            }else{
                this.curLevelUpInterval = this.minInterval;
            }
            this.pressSendLevelUp();
        }
    },

    endLevelUp: function () {
        // this.unschedule(this.pressSendLevelUp);
        this.unschedule(this.PressLevelUp);
        this.interval = 0;
        this.curLevelUpInterval = 0.2;

        let netNode = cc.find("Canvas/NetNode");
        netNode.active = true;
    },

    cancelLevelUp: function () {
        this.endLevelUp();
    },
    ////////////////////////////////////////////////////////////////////////////////////////////

    pressSendLevelUp: function () {
        this.levelUp();
    },

    levelUp: function () {
        if (!this.canUseExpItem) {
            setTimeout(() => {
                this.canUseExpItem = true;
            }, 2000);
            return;
        }
        this.canUseExpItem = false;
        let count = GlobalVar.me().bagData.getItemCountById(this.useExpItemID);
        if (count > 0) {
            GlobalVar.handlerManager().memberHandler.sendMemberLevelUpReq(this.memberID, this.useExpItemID);
        } else {
            this.endLevelUp();
            let item = this.getNodeByName("spriteLevelUp").getChildByName("nodeItem").getChildByName("ItemObject").getComponent("ItemObject");
            CommonWnd.showItemGetWay(item.itemID, item.getLabelNumberData(), item.getSlot());
        }
    },

    canUpLevel: function () {

    },

    onLevelUp: function (msg) {
        this.canUseExpItem = true;
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if (msg.data.ErrCode !== GameServerProto.PTERR_SUCCESS) {
            this.endLevelUp();
            if (msg.data.ErrCode == GameServerProto.PTERR_ITEM_LACK){
                let item = this.getNodeByName("spriteLevelUp").getChildByName("nodeItem").getChildByName("ItemObject").getComponent("ItemObject");
                CommonWnd.showItemGetWay(item.itemID, item.getLabelNumberData(), item.getSlot());
            }else{
                GlobalVar.comMsg.errorWarning(msg.data.ErrCode);
            }
            return;
        }
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // 播放音效
        GlobalVar.soundManager().playEffect(AUDIO_USE_EXP_ITEM);

        this.progressAction = true;
        let member = GlobalVar.me().memberData.getMemberByID(this.memberID);
        this.updataFighter(member.MemberID, member.Quality, member.Level);

        let effect = this.node.getChildByName("nodeCenter").getChildByName("nodeEffect");
        effect.active = true;
        // effect.getComponent(dragonBones.ArmatureDisplay).playAnimation("animation", 1);
        // let self = this;
        // effect.getComponent(dragonBones.ArmatureDisplay).addEventListener(dragonBones.EventObject.COMPLETE, event => {
        //     var animationName = event.animationState ? event.animationState.name : "";
        //     if (animationName == "animation") {
        //         effect.active = false;
        //     }
        // });
        effect.getComponent(sp.Skeleton).clearTracks();
        effect.getComponent(sp.Skeleton).setAnimation(0, "animation", false);
        effect.getComponent(sp.Skeleton).setCompleteListener(trackEntry => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            if (animationName == "animation") {
                effect.active = false;
            }
        })
    },

    qualityUp: function () {
        if (this.getCanUpQuality()) {
            this.qualityDataCur = this.qualityData;
            GlobalVar.handlerManager().memberHandler.sendMemberQualityUpReq(this.memberID);
        }
        else {
            if (this.qualityData.wQualityUpLevel > GlobalVar.me().level) {
                var tipdes = i18n.t('label.4000257').replace('%d', this.qualityData.wQualityUpLevel);
                tipdes = tipdes.replace('%d', GlobalVar.me().level)
                GlobalVar.comMsg.showMsg(tipdes);
            } else {
                GlobalVar.comMsg.showMsg(i18n.t('label.4000223'));
                let QuTab = this.getNodeByName("spriteQualityUp");
                let item = QuTab.getChildByName("nodeItemQ").getChildByName("ItemObject").getComponent("ItemObject");
                CommonWnd.showItemGetWay(item.itemID, item.getLabelNumberData(), item.getSlot());
            }
        }
    },

    getCanUpQuality: function () {
        return this.canUpQuality;
    },

    onQualityUp: function (msg) {
        if (msg.data.ErrCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(msg.data.ErrCode);
            return;
        }
        let self = this;
        // GlobalVar.comMsg.showMsg("战机品质提升");
        GlobalVar.soundManager().playEffect(AUDIO_QUALITY_UP);
        let member = GlobalVar.me().memberData.getMemberByID(this.memberID);
        this.updataFighter(member.MemberID, member.Quality, member.Level);

        var nodePlanet = this.node.getChildByName("nodeCenter").getChildByName("nodePlanet");
        nodePlanet.active = false;

        CommonWnd.showPlaneQualityUpWnd(self.qualityDataCur, self.qualityData, function () {
            nodePlanet.active = true;
        });
        // let effectFinish = function () {
        //     self.effectShengjie.node.active = false;
        //     CommonWnd.showPlaneQualityUpWnd(self.qualityDataCur, self.qualityData, function () {
        //         nodePlanet.active = true;
        //     });
        // }
        // this.effectShengjie.node.active = true;
        // this.effectShengjie.setAnimation(0, "animation", false);
        // GlobalFunc.playSpineAnimation(this.effectShengjie.node, effectFinish, false);
        
    },
});