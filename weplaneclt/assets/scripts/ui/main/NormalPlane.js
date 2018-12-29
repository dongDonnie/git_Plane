const GlobalVar = require("globalvar");
const EventMsgID = require("eventmsgid");
const WindowManager = require("windowmgr");
const RootBase = require("RootBase");
const WndTypeDefine = require("wndtypedefine");
const CommonWnd = require("CommonWnd");
const i18n = require('LanguageData');
const GlobalFunc = require('GlobalFunctions');
const BattleManager = require('BattleManager');
const GameServerProto = require("GameServerProto");

cc.Class({
    extends: RootBase,

    properties: {
        widgetBottom: {
            default: null,
            type: cc.Widget,
        },
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
        hangarScroll: {
            default: null,
            type: cc.Node,
        },
        nodeActive: {
            default: null,
            type: cc.Node,
        },
        hotActive: {
            default: null,
            type: cc.Node,
        },
        labelConfitionData: {
            default: null,
            type: cc.Label,
        },
        labelOwn: {
            default: null,
            type: cc.Label,
        },
        nodeOwn: {
            default: null,
            type: cc.Node,
        },
        labelNeed: {
            default: null,
            type: cc.Label,
        },
        nodeAdvance: {
            default: null,
            type: cc.Node,
        },
        hotAdvance: {
            default: null,
            type: cc.Node,
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
        nodeStandingBy: {
            default: null,
            type: cc.Node,
        },
        itemObject: {
            default: null,
            type: cc.Node
        },
        barPiecePercent: {
            default: null,
            type: cc.ProgressBar
        },
        memberID: {
            default: 710,
            visible: false
        },
        planeNode: {
            default: null,
            type: cc.Node,
        },
        widgetPlaneNode: {
            default: null,
            type: cc.Widget,
        },
        isFirstIn: {
            default: true,
            visible: false
        },
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMALPLANE_WND;
        this.animeStartParam(0);
        if (GlobalFunc.isAllScreen()) {
            this.fixView();
        }
    },

    fixView: function () {
        this.widgetBottom.bottom += 50;
        this.widgetBottom.updateAlignment();
        this.widgetPlaneNode.updateAlignment();
    },

    fixFighter: function () {
        let top = this.node.getChildByName("spriteTop");
        let bottom = this.node.getChildByName("spriteBottom");
        let centerHeight = (top.y - top.getContentSize().height / 2) - (bottom.y + bottom.getContentSize().height / 2);
        this.planeNode.setContentSize(this.planeNode.getContentSize().width, centerHeight + 120);
        this.widgetPlaneNode.bottom += 50;
        this.widgetPlaneNode.updateAlignment();
    },

    animeStartParam(num) {
        this.node.opacity = num;
        this.planeNode.active = false;
        if (num == 0 || num == 255) {
            this.hangarScroll.active = false;
        }
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            GlobalVar.eventManager().removeListenerWithTarget(this);
            this.hangarScroll.getComponent("SpecialScroll").cleanAllFighter();
            if (!this.deleteMode) {
                var self = this;
                WindowManager.getInstance().insertView(WndTypeDefine.WindowType.E_DT_NORMALEQUIPMENT_WND, WndTypeDefine.WindowType.E_DT_NORMALROOT_WND, function (wnd, name, type) {
                    let member = GlobalVar.me().memberData.getMemberByID(self.memberID);
                    wnd.getComponent(type).updataFighter(member.MemberID, member.Quality, member.Level);
                }, true, false);
            } else {
                let uiNode = cc.find("Canvas/UINode");
                BattleManager.getInstance().quitOutSide();
                BattleManager.getInstance().startOutside(uiNode.getChildByName('UIMain').getChildByName('nodeBottom').getChildByName('planeNode'), GlobalVar.me().memberData.getStandingByFighterID(), true);
            }
        } else if (name == "Enter") {
            this._super("Enter");
            this.deleteMode = false;
            GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_MEMBER_STANDINGBY_NTF, this.onSetFighter, this);
            GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_MEMBER_ACTIVE_NTF, this.onActiveFighter, this);
            if (GlobalFunc.isAllScreen() && !this.fixViewComplete) {
                this.fixViewComplete = true;
                this.fixFighter();
            }

            let memberData = GlobalVar.tblApi.getData('TblMember');
            let count = 0;
            for (let i in memberData) {
                if (memberData[i].byGetType == 1) {
                    count += 1;
                }
            }
            this.hangarScroll.getComponent("SpecialScroll").initHangar(count);
            this.hangarScroll.active = true;

            //this.planeNode.active = true;
            let id = GlobalVar.me().memberData.getStandingByFighterID();
            let member = GlobalVar.me().memberData.getMemberByID(id);
            this.updataFighter(member.MemberID, member.Quality, member.Level);
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

    updataFighter: function (id, quality, level) {
        this.memberID = id;
        let fighterData = GlobalVar.tblApi.getDataBySingleKey('TblMember', id);
        let key = id + '_' + quality;
        let qualityData = GlobalVar.tblApi.getDataBySingleKey('TblMemberQuality', key);
        this.setFighterQuality(fighterData.stPingJia.byStarNum);
        this.setFighterName(fighterData.strName + ' ' + qualityData.strQualityDisplay);
        this.setFighterLevel(level);

        let member = GlobalVar.me().memberData.getMemberByID(id);
        if (member == null) {
            this.setFighterNameColorByQuality(0);
            this.nodeActive.active = true;
            this.nodeAdvance.active = false;
            this.nodeStandingBy.active = false;
            this.updateActiveCondition(fighterData.byGetType, fighterData.wGetPieceID, fighterData.nGetPieceNumber);
            this.hotActive.active = !!GlobalVar.me().memberData.unLockHotFlag[id];
        } else {
            this.setFighterNameColorByQuality(quality);
            this.nodeActive.active = false;
            this.nodeAdvance.active = true;
            this.nodeStandingBy.active = true;
            this.updateState();
            this.updateAdvanceProp(id);
            this.hotAdvance.active = !!(GlobalVar.me().memberData.qualityUpHotFlag[id] || GlobalVar.me().memberData.levelUpHotFlag[id]);
        }

        BattleManager.getInstance().quitOutSide();
        BattleManager.getInstance().startOutside(this.planeNode, id);
    },

    updateAdvanceProp: function (id) {
        let memberProps = GlobalVar.me().memberData.getMemberPropByMemberID(id);
        for (let i in memberProps) {
            if (parseInt(i) == GameServerProto.PTPROP_HP) {
                this.labelLifeNumber.string = memberProps[i];
            } else if (parseInt(i) == GameServerProto.PTPROP_Attack) {
                this.labelAttackNumber.string = memberProps[i];
            } else if (parseInt(i) == GameServerProto.PTPROP_Defence) {
                this.labelDefenceNumber.string = memberProps[i];
            }
        }
    },

    updateActiveCondition: function (type, id, need) {
        type = typeof type !== 'undefined' ? type : 1;
        id = typeof id !== 'undefined' ? id : 710;
        need = typeof need !== 'undefined' ? need : 1;
        if (type == 1) {
            this.itemObject.getComponent("ItemObject").updateItem(id);
            this.itemObject.getComponent("ItemObject").setClick(true, 0);
            this.labelConfitionData.string = GlobalVar.tblApi.getDataBySingleKey('TblItem', id).strName + '*' + need; //i18n.t("item." + id) + '*' + need;
            let own = GlobalVar.me().bagData.getItemCountById(id);
            this.labelOwn.string = own;
            let color = null;
            if (own < need) {
                color = GlobalFunc.getSystemColor(5);
            } else {
                color = GlobalFunc.getSystemColor(1);
            }
            this.nodeOwn.color = color;
            this.labelNeed.string = need;
            this.barPiecePercent.progress = own / need;
        }
    },

    updateState: function () {
        if (this.memberID == GlobalVar.me().memberData.getStandingByFighterID()) {
            this.nodeStandingBy.getChildByName("btnoStandingBy").active = false;
            this.nodeStandingBy.getChildByName("spriteComplete").active = true;
        } else {
            this.nodeStandingBy.getChildByName("btnoStandingBy").active = true;
            this.nodeStandingBy.getChildByName("spriteComplete").active = false;
        }
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

    selectFighter: function (event, data) {
        let member = GlobalVar.me().memberData.getMemberByID(data);
        if (data == this.memberID) {
            return;
        }
        if (member != null) {
            this.updataFighter(member.MemberID, member.Quality, member.Level);
        } else {
            this.updataFighter(data, 100, 1);
        }
    },

    advanceFighter: function () {
        this.deleteMode = false;
        this.animePlay(0);
    },

    activeFighter: function () {
        GlobalVar.handlerManager().memberHandler.sendMemberActiveReq(this.memberID);
    },

    onActiveFighter: function (msg) {
        if (msg.data.ErrCode == 66) {
            let self = this;
            let item = self.itemObject.getComponent("ItemObject");
            CommonWnd.showItemGetWay(item.itemID, item.getLabelNumberData(), item.getSlot());
            return;
        }
        if (msg.data.ErrCode == 0) {
            // CommonWnd.showMessage(null, CommonWnd.oneConfirm, i18n.t('label.4000216'), i18n.t('label.4000224'));
            CommonWnd.showGetNewRareItemWnd(this.memberID, 0, 2, function () {
                WindowManager.getInstance().popView(false, null, false);
            });
        }
        if (msg.data.ErrCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(msg.data.ErrCode);
            return;
        }
        let member = GlobalVar.me().memberData.getMemberByID(this.memberID);
        this.updataFighter(member.MemberID, member.Quality, member.Level);
        this.hangarScroll.getComponent("SpecialScroll").updateFighter();
    },

    setFighter: function () {
        let conf = GlobalVar.me().memberData.getStandingByFighterConf();
        GlobalVar.handlerManager().memberHandler.sendStandingByReq(this.memberID, conf.MixMember1ID, conf.MixMember2ID, conf.MixMember3ID, conf.MixMember4ID, conf.MysteryID);
    },

    onSetFighter: function (msg) {
        if (msg.data.ErrCode == GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.showMsg("出战成功");
        }
        this.updateState();
        this.hangarScroll.getComponent("SpecialScroll").updateFighter();
    },
});