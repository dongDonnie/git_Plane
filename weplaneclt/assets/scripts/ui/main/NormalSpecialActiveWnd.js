const SceneDefines = require("scenedefines");
const WindowManager = require("windowmgr");
const WndTypeDefine = require("wndtypedefine");
const RootBase = require("RootBase");
const GlobalVar = require('globalvar')
const EventMsgID = require("eventmsgid");
const CommonWnd = require("CommonWnd");
const GlobalFunc = require('GlobalFunctions');
const i18n = require('LanguageData');
const GameServerProto = require("GameServerProto");
const BattleManager = require('BattleManager');

var NormalArenaMainWnd = cc.Class({
    extends: RootBase,

    statics: {

    },

    properties: {
        itemPrefabs: {
            default: null,
            type: cc.Node
        },
        layoutMust: {
            default: null,
            type: cc.Node
        },
        layoutProb: {
            default: null,
            type: cc.Node
        },

    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_SPECIAL_ACTIVE_WND;
        this.animeStartParam(0);
        if (GlobalFunc.isAllScreen() && !this.fixViewComplete) {
            this.fixViewComplete = true;
            this.fixView();
        }
    },

    animeStartParam(num) {
        this.node.opacity = num;
        if (num == 0 || num == 255) {
            this.node.getChildByName("nodeTop").active = false;
            this.node.getChildByName("nodeBottom").active = false;
        }
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            GlobalVar.eventManager().removeListenerWithTarget(this);
            if (!this.deleteMode) {
                WindowManager.getInstance().insertView(WndTypeDefine.WindowType.E_DT_NORMAL_TREASURY_RANK_WND, WndTypeDefine.WindowType.E_DT_NORMALROOT_WND, null, true, false);
            } else if (this.deleteMode) {
                let uiNode = cc.find("Canvas/UINode");
                BattleManager.getInstance().quitOutSide();
                BattleManager.getInstance().startOutside(uiNode.getChildByName('UIMain').getChildByName('nodeBottom').getChildByName('planeNode'), GlobalVar.me().memberData.getStandingByFighterID(), true);
            }
        } else if (name == "Enter") {
            this._super("Enter");
            this.deleteMode = false;
            BattleManager.getInstance().quitOutSide();
            this.registerEvent();

            this.node.getChildByName("nodeTop").active = true;
            this.node.getChildByName("nodeBottom").active = true;
            this.initItemShow();
        }
    },

    registerEvent: function () {
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_ACTIVE_TREASURY_DATA, this.getActiveTreasuryData, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_ACTIVE_VAST_DATA, this.getActiveVastData, this);
    },

    setAcitveType: function (amsType) {
        this.activeType = amsType;
        if (this.activeType == GameServerProto.PT_AMS_ACT_TYPE_TREASURY){
            this.node.getChildByName("nodeTop").getChildByName("nodeTreasury").active = true;
            this.node.getChildByName("nodeTop").getChildByName("nodeVast").active = false;
            this.node.getChildByName("nodeBottom").getChildByName("nodeTreasury").active = true;
            this.node.getChildByName("nodeBottom").getChildByName("nodeVast").active = false;
            this.node.getChildByName("nodeCenter").getChildByName("nodeTreasury").active = true;
            this.node.getChildByName("nodeCenter").getChildByName("nodeVast").active = false;
        }else if (this.activeType == GameServerProto.PT_AMS_ACT_TYPE_VAST){
            this.node.getChildByName("nodeTop").getChildByName("nodeTreasury").active = false;
            this.node.getChildByName("nodeTop").getChildByName("nodeVast").active = true;
            this.node.getChildByName("nodeBottom").getChildByName("nodeTreasury").active = false;
            this.node.getChildByName("nodeBottom").getChildByName("nodeVast").active = true;
            this.node.getChildByName("nodeCenter").getChildByName("nodeTreasury").active = false;
            this.node.getChildByName("nodeCenter").getChildByName("nodeVast").active = true;
        }
    },

    initItemShow: function () {
        let activeID = GlobalVar.me().activeData.getActiveListDataByType(this.activeType).Actid;
        let activeData = GlobalVar.me().activeData.getActiveDataByActID(activeID);
        this.layoutProb.removeAllChildren();
        this.layoutMust.removeAllChildren();
        for (let i = 0; i < activeData.Act.OpCfg.Items.length; i++){
            let item = activeData.Act.OpCfg.Items[i];
            let itemObj = null;
            if (!this.layoutMust.children[i]) {
                itemObj = cc.instantiate(this.itemPrefabs);
                this.layoutMust.addChild(itemObj);
            } else {
                itemObj = this.layoutMust.children[i];
            }
            if (itemObj) {
                itemObj.active = true;
                itemObj.y = 0;
                itemObj.getChildByName('ItemObject').getComponent("ItemObject").updateItem(item.ItemID, item.Count);
                itemObj.getChildByName('ItemObject').getComponent("ItemObject").setClick(true, 2);
            }
        }

        for (let i = 0; i < activeData.Act.OpCfg.ItemProbs.length; i++) {
            let item = activeData.Act.OpCfg.ItemProbs[i];
            let itemObj = null;
            if (!this.layoutProb.children[i]) {
                itemObj = cc.instantiate(this.itemPrefabs);
                this.layoutProb.addChild(itemObj);
            } else {
                itemObj = this.layoutProb.children[i];
            }
            if (itemObj) {
                itemObj.active = true;
                itemObj.y = 0;
                itemObj.getChildByName('ItemObject').getComponent("ItemObject").updateItem(item.ItemID, item.Count);
                itemObj.getChildByName('ItemObject').getComponent("ItemObject").setClick(true, 2);
            }
        }
    },

    getActiveTreasuryData: function (event) {
        if (event.ErrCode != GameServerProto.PTERR_SUCCESS){
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
    },

    getActiveVastData: function (event) {
        if (event.ErrCode != GameServerProto.PTERR_SUCCESS){
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
    },

    getRankPanel: function () {
        // CommonWnd.showTreasuryRankWnd();
        this.deleteMode = false;
        this.animePlay(0);
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

    fixView: function () {
        let bottomWidget = this.node.getChildByName("nodeBottom").getComponent(cc.Widget);
        bottomWidget.bottom += 40;
        bottomWidget.updateAlignment();

        let centerWidget = this.node.getChildByName("nodeCenter").getComponent(cc.Widget);
        centerWidget.bottom += 60;
        centerWidget.updateAlignment();
    },

    close: function () {
        this._super()
    },

    onDestroy: function () {
        GlobalVar.eventManager().removeListenerWithTarget(this);
    },
});