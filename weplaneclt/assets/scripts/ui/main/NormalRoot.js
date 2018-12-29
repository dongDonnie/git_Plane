const UIBase = require("uibase");
const WindowManager = require("windowmgr");
const WndTypeDefine = require("wndtypedefine");
const GlobalFunc = require('GlobalFunctions');
const GlobalVar = require('globalvar')
const EventMsgID = require("eventmsgid");
const CommonWnd = require("CommonWnd");
const i18n = require('LanguageData');
const GameServerProto = require("GameServerProto");

cc.Class({
    extends: UIBase,

    properties: {
        labelAtlasPower: {
            default: null,
            type: cc.Label
        },
        labelAtlasGold: {
            default: null,
            type: cc.Label
        },
        labelAtlasEnergy: {
            default: null,
            type: cc.Label
        },
        labelAtlasDiamond: {
            default: null,
            type: cc.Label
        },
        spriteTop: {
            default: null,
            type: cc.Node
        },
        spriteBottom: {
            default: null,
            type: cc.Node
        },
        normalRoot: {
            default: null,
            type: cc.Animation
        },
        typeName: {
            default: WndTypeDefine.WindowType.E_DT_NORMALROOT_WND,
            visible: false,
        },
        curWnd: {
            default: "",
            visible: false,
        },

        btnReturn: {
            default: null,
            type: cc.Button,
        },
    },

    onLoad: function () {
        this._super();
        i18n.init('zh');
        this.animeStartParam(0);
        if (!GlobalFunc.isAllScreen() && !this.fixViewComplete) {
            this.fixViewComplete = true;
            this.fixView();
        }
        let self = this;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,function(event){
            if (event.keyCode == 81){
                self.onBtnReturn();
            }
        },this);
    },

    fixView: function () {
        let bottomWidget = this.node.getChildByName("nodeBottom").getComponent(cc.Widget);
        bottomWidget.bottom = -0.5 * this.node.getChildByName("nodeBottom").getContentSize().height;
        bottomWidget.updateAlignment();
    },

    animeStartParam(num) {
        this.spriteTop.opacity = num;
        this.spriteBottom.opacity = num;
    },

    animePlay(mode) {
        switch (mode) {
            case 0:
                this.normalRoot.play("animeNormalRootClose");
                break;
            case 1:
                this.normalRoot.play("animeNormalRootOpen");
                break;
            case 2:
                this.normalRoot.play("animeNormalRootCloseAllScreen");
                break;
            case 3:
                this.normalRoot.play("animeNormalRootOpenAllScreen");
                break;
        }
    },

    animePlayCallBack(name) {
        if (name == "animeNormalRootClose" || name == "animeNormalRootCloseAllScreen") {
            GlobalVar.eventManager().removeListenerWithTarget(this);
            WindowManager.getInstance().popToTargetView(WndTypeDefine.WindowType.E_DT_MASKBACK_WND);
        } else if (name == "animeNormalRootOpen" || name == "animeNormalRootOpenAllScreen") {
            this.registerEvent();
            let type = WindowManager.getInstance().getTopViewType();
            let com = WindowManager.getInstance().getTopView().getComponent(type);
            let windowMgr = WindowManager.getInstance();
            windowMgr.getTopView().getComponent(WindowManager.getInstance().getTopViewType()).animePlay(1);
        }
    },

    initNormalRoot: function () {
        this.setCombatPoint(GlobalVar.me().getCombatPoint());
        this.setGold(GlobalVar.me().getGold());
        this.setDiamond(GlobalVar.me().getDiamond());
        this.setEnergy(GlobalVar.me().getSpData(), GlobalVar.me().getVipLevel());
        // let spData = GlobalVar.me().getSpData();
        // this.setEnergy(spData.Sp, spData.SpBack);
    },
    registerEvent: function () {
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GOLD_NTF, this.updateGold, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_DIAMOND_NTF, this.updateDiamond, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_SPCHANGE_NTF, this.updateSp, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_COMBATPOINT_CHANGE_NTF, this.updateCombatPoint, this);
        // GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_RICHTREASURE_RESULT, this.richTreasureMsgRecv, this);
    },

    updateGold: function(){
        this.setGold(GlobalVar.me().getGold());
    },

    updateDiamond: function(){
        this.setDiamond(GlobalVar.me().getDiamond());
    },
    updateSp: function(){
        this.setEnergy(GlobalVar.me().getSpData(), GlobalVar.me().getVipLevel());
    },
    updateCombatPoint: function(data){
        this.setCombatPoint(GlobalVar.me().getCombatPoint() || 0);
        if (data.combatUpflag) {
            GlobalVar.comMsg.showCombatPoint(data.delta, data.combatPoint, data.lastCombatPoint);
        }
    },

    setCombatPoint: function (num) {
        if (num > 9999999) {
            if (num > 9999999999){
                num = 9999999999;
            }
            num = Math.floor(num / 10000);
            num += ";<";
            if (!this.labelAtlasPower.node.oldPos) {
                this.labelAtlasPower.node.oldPos = this.labelAtlasPower.node.position;
            }
            this.labelAtlasPower.node.x=(this.labelAtlasPower.node.oldPos.x + 16);
        } else {
            if (this.labelAtlasPower.node.oldPos) {
                this.labelAtlasPower.node.x=(this.labelAtlasPower.node.oldPos.x);
            }
        }
        this.labelAtlasPower.string = num;
    },

    setGold: function (num) {
        if (num > 999999) {
            if (num > 999999999){
                num = 999999999;
            }
            num = Math.floor(num / 10000);
            num += ";<";
            if (!this.labelAtlasGold.node.oldPos) {
                this.labelAtlasGold.node.oldPos = this.labelAtlasGold.node.position;
            }
            this.labelAtlasGold.node.x=(this.labelAtlasGold.node.oldPos.x + 16);
        } else {
            if (this.labelAtlasGold.node.oldPos) {
                this.labelAtlasGold.node.x=(this.labelAtlasGold.node.oldPos.x);
            }
        }
        this.labelAtlasGold.string = num;
    },

    setDiamond: function (num) {
        if (num > 999999) {
            if (num > 999999999){
                num = 999999999;
            }
            num = Math.floor(num / 10000);
            num += ";<";
            if (!this.labelAtlasDiamond.node.oldPos) {
                this.labelAtlasDiamond.node.oldPos = this.labelAtlasDiamond.node.position;
            }
            this.labelAtlasDiamond.node.x=(this.labelAtlasDiamond.node.oldPos.x + 16);
        } else {
            if (this.labelAtlasDiamond.node.oldPos) {
                this.labelAtlasDiamond.node.x=(this.labelAtlasDiamond.node.oldPos.x);
            }
        }
        this.labelAtlasDiamond.string = num;
    },

    // setEnergy: function (cur, max) {
    setEnergy: function (spData, vipLevel) {
        // this.labelAtlasEnergy.string = cur + "/" + max;

        let spLimit = GlobalVar.tblApi.getDataBySingleKey("TblSpVip", vipLevel).wSpLimit;
        this.labelAtlasEnergy.string = (spData.Sp>9999?9999:spData.Sp) + "/" + spLimit;
    },

    setShowPowerHideEnergyChange: function (state) {
        //
        this.labelAtlasPower.node.parent.active = state;
        this.labelAtlasEnergy.node.parent.active = !state;
    },

    onBtnBuySp: function(){
        CommonWnd.showBuySpWnd();
    },

    onBtnBuyGold: function(){

    },

    onBtnBuyDiamond: function(){
        // CommonWnd.showRechargeWnd();
        CommonWnd.showNormalFreeGetWnd(GameServerProto.PTERR_DIAMOND_LACK, null, null, null, null, true);
    },

    onBtnReturn: function(){
        let viewNode = WindowManager.getInstance().getTopView();
        if (!viewNode){
            WindowManager.getInstance().popToRoot();
            return;
        }
        let view = viewNode.getComponent(WindowManager.getInstance().getTopViewType());
        if(!view){
            WindowManager.getInstance().popToRoot();
            return;
        }
        if(typeof view.onBtnClose == 'function'){
            view.onBtnClose();
        }else{
            view.close();
        }
    },

    // richTreasureMsgRecv: function (data) {
    //     if (data.ErrCode != GameServerProto.PTERR_SUCCESS) {
    //         GlobalVar.comMsg.errorWarning(data.ErrCode);
    //         return;
    //     }
    //     CommonWnd.showRichTreasureWnd();
    // },

    onRichTreasureBtnClick: function (event) {
        // CommonWnd.showRichTreasureWnd();
        GlobalVar.handlerManager().drawHandler.sendTreasureData();
    },

    enter: function (isRefresh) {
        if (isRefresh) {
            this.initNormalRoot();
            if (WindowManager.getInstance().getTopViewTypeName() == WndTypeDefine.WindowType.E_DT_NORMAL_QUESTLIST_VIEW
            || WindowManager.getInstance().getTopViewTypeName() == WndTypeDefine.WindowType.E_DT_NORMALBAG) {
                this.setShowPowerHideEnergyChange(false);
            }else{
                this.setShowPowerHideEnergyChange(true);
            }
        } else {
            
        }
    },

    escape: function (isRefresh) {
        if (isRefresh) {

        } else {

        }
    },

    onDestroy: function () {
        GlobalVar.eventManager().removeListenerWithTarget(this);
    },
});