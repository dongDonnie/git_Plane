const GlobalVar = require("globalvar");
const EventMsgID = require("eventmsgid");
const WindowManager = require("windowmgr");
const RootBase = require("RootBase");
const WndTypeDefine = require("wndtypedefine");
const CommonWnd = require("CommonWnd");
const i18n = require('LanguageData');
const GlobalFunc = require('GlobalFunctions');
const GameServerProto = require("GameServerProto");
const BattleManager = require('BattleManager');

cc.Class({
    extends: RootBase,

    properties: {
        itemObject: {
            default: null,
            type: cc.Prefab
        },
    },

    onLoad: function () {
        this._super();
        i18n.init('zh');
        this.dirty = true;
        this.typeName = WndTypeDefine.WindowType.E_DT_GUAZAIMAIN_WND;

        if (GlobalFunc.isAllScreen() && !this.fixViewComplete) {
            this.fixViewComplete = true;
            this.fixView();
        }


        this.animeStartParam(0);
        let id = GlobalVar.me().memberData.getStandingByFighterID();
        let member = GlobalVar.me().memberData.getMemberByID(id);
        //this.getNodeByName("nodeSpine").active = false;
        // GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GUAZAI_CHANGE_NTF, this.onGuazaiChangedCallback, this);
    },

    start: function () {

    },

    fixView: function(){
        let bottomWidget = this.node.getChildByName("nodeBottom").getComponent(cc.Widget);
        bottomWidget.bottom += 25;
        bottomWidget.updateAlignment();
        // let planeWidget = this.node.getChildByName("planeNode").getComponent(cc.Widget);
        // planeWidget.bottom += 50;
        // planeWidget.updateAlignment();
    },

    animeStartParam(num) {
        this.node.opacity = num;

        if (num == 0 || num == 255){
            this.getNodeByName("nodeTouzhi").active = false;
            this.getNodeByName("nodeFeidan").active = false;
            this.getNodeByName("nodeliaoji").active = false;
            this.getNodeByName("nodeFuji").active = false;
            this.getNodeByName("imgAttr").active = false;
        }
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            if (!this.deleteMode) {
                CommonWnd.showDrawView();
            } else {
                let uiNode = cc.find("Canvas/UINode");
                BattleManager.getInstance().quitOutSide();
                BattleManager.getInstance().startOutside(uiNode.getChildByName('UIMain').getChildByName('nodeBottom').getChildByName('planeNode'), GlobalVar.me().memberData.getStandingByFighterID(), true);
            }
        } else if (name == "Enter") {
            this._super("Enter");
            //this.getNodeByName("nodeSpine").active = true;
            this.dirty = true;
            this.deleteMode = false;
            BattleManager.getInstance().quitOutSide();
            BattleManager.getInstance().startOutside(this.getNodeByName('planeNode'),GlobalVar.me().memberData.getStandingByFighterID(),true);
            GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GUAZAI_DIRTY_NTF, this.onGuazaiDirtyCallback, this);
            this.getNodeByName("nodeTouzhi").active = true;
            this.getNodeByName("nodeFeidan").active = true;
            this.getNodeByName("nodeliaoji").active = true;
            this.getNodeByName("nodeFuji").active = true;
            this.getNodeByName("imgAttr").active = true;
        }
    },

    enter: function (isRefresh) {
        if (isRefresh) {
            this._super(true);
        } else {
            this._super(false);
        }
        this.initWnd();
    },

    escape: function (isRefresh) {
        if (isRefresh) {
            this._super(true);
        } else {
            this._super(false);
        }
    },

    initWnd: function () {

    },

    update: function (dt) {
        if (!this.dirty)
            return;
        this.dirty = false;
        
        BattleManager.getInstance().quitOutSide();
        BattleManager.getInstance().startOutside(this.getNodeByName('planeNode'),GlobalVar.me().memberData.getStandingByFighterID(),true);
        
        let guazaiWearFlag = GlobalVar.me().guazaiData.wearHotFlag;
        let guazailevelUpHotFlag = GlobalVar.me().guazaiData.levelUpHotFlag;
        let guazaiQualityUpHotFlag = GlobalVar.me().guazaiData.qualityUpHotFlag;
        for (let i = 1; i<=4; i++) {
        // for (let i in GlobalVar.me().guazaiData.guazaiWear) {
            let node = null;
            switch (i) {
                case 1:
                    node = this.getNodeByName("nodeliaoji").getChildByName("nodeEquip");
                    break;
                case 2:
                    node = this.getNodeByName("nodeTouzhi").getChildByName("nodeEquip");
                    break;
                case 3:
                    node = this.getNodeByName("nodeFeidan").getChildByName("nodeEquip");
                    break;
                case 4:
                    node = this.getNodeByName("nodeFuji").getChildByName("nodeEquip");
                    break;
                default:
                    break;
            }
            if (node) {
                let guazai = GlobalVar.me().guazaiData.guazaiWear[i];
                let item = null;
                if (guazai && node.children.length == 0){
                    item = cc.instantiate(this.itemObject);
                    item.getComponent("ItemObject").updateItem(guazai.ItemID, -1, guazai.GuaZai.Level);
                    node.addChild(item);
                }else if (guazai) {
                    item = node.children[0];
                    item.getComponent("ItemObject").updateItem(guazai.ItemID, -1, guazai.GuaZai.Level);
                }
                if (guazaiWearFlag[parseInt(i) - 1]){
                    node.parent.getChildByName("spriteHot").active = true;
                }else{
                    node.parent.getChildByName("spriteHot").active = false;
                    if (guazaiQualityUpHotFlag[i-1] || guazailevelUpHotFlag[i-1]){
                        if (item){
                            item.getComponent("ItemObject").setSpriteHotPointData(0);
                        }
                    }else{
                        if (item){
                            item.getComponent("ItemObject").setSpriteHotPointData(-1);
                        }
                    }
                }
            }
        }
        this.setGuazaiPropsPanel();
    },

    onGuazaiBtnTouchedCallback: function (target, data) {
        // cc.log(GlobalVar.me().guazaiData.guazaiWear);
        GlobalVar.me().guazaiData.guazaiSelectPos = data;
        if (GlobalVar.me().guazaiData.guazaiWear[data]) {
            CommonWnd.showGuazaiAdvance(GlobalVar.me().guazaiData.guazaiWear[data]);
        } else {
            let selectFunc = function (item) {
                // cc.log(item);
                let guazai = GlobalVar.tblApi.getDataBySingleKey('TblGuaZai', item.ItemID);
                if (guazai.byPosition == GlobalVar.me().guazaiData.guazaiSelectPos)
                    return true;
                return false;
            }

            let chooseingCallback = function (data) {
                // cc.log("选中挂载在背包内的位置为");
                // cc.log(data);
                let msg = {
                    GuaZaiPos: GlobalVar.me().guazaiData.guazaiSelectPos,
                    BagSlot: data
                }
                GlobalVar.handlerManager().guazaiHandler.sendReq(GameServerProto.GMID_GUAZAI_PUTON_REQ, msg);
            }

            CommonWnd.showItemBag(GameServerProto.PT_ITEMTYPE_GUAZAI, selectFunc, chooseingCallback, this, 0);
        }
    },

    onGuazaiSmelterTouchedCallback: function () {
        CommonWnd.showGuazaiSmelter();
    },

    setGuazaiPropsPanel: function () {
        let guazaiProps = GlobalVar.me().propData.getGuazaiPropsMap();
        // cc.log(guazaiProps);
        if (guazaiProps[1])
            this.getNodeByName("lblHpNum").getComponent(cc.Label).string = guazaiProps[1].Value;
        else
            this.getNodeByName("lblHpNum").getComponent(cc.Label).string = 0;

        if (guazaiProps[4])
            this.getNodeByName("lblDfNum").getComponent(cc.Label).string = guazaiProps[4].Value;
        else
            this.getNodeByName("lblDfNum").getComponent(cc.Label).string = 0;

        if (guazaiProps[11])
            this.getNodeByName("lblLjAtkNum").getComponent(cc.Label).string = guazaiProps[11].Value;
        else
            this.getNodeByName("lblLjAtkNum").getComponent(cc.Label).string = 0;
        if (guazaiProps[12])
            this.getNodeByName("lblTzAtkNum").getComponent(cc.Label).string = guazaiProps[12].Value;
        else
            this.getNodeByName("lblTzAtkNum").getComponent(cc.Label).string = 0;
        if (guazaiProps[13])
            this.getNodeByName("lblFdAtkNum").getComponent(cc.Label).string = guazaiProps[13].Value;
        else
            this.getNodeByName("lblFdAtkNum").getComponent(cc.Label).string = 0;
        if (guazaiProps[14])
            this.getNodeByName("lblFjAtkNum").getComponent(cc.Label).string = guazaiProps[14].Value;
        else
            this.getNodeByName("lblFjAtkNum").getComponent(cc.Label).string = 0;
    },

    onGuazaiExploreBtnTouched: function () {
        // CommonWnd.showDrawView();
        this.animePlay(0);
    },

    onGuazaiDirtyCallback: function (ack) {        
        this.dirty = true;
    },
});