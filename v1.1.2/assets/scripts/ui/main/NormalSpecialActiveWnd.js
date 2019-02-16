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

var NormalSpecialActiveWnd = cc.Class({
    extends: RootBase,

    statics: {

    },

    properties: {
        labelRecharged: {
            default: null,
            type: cc.Label,
        },
        labelRecvLeftTimes: {
            default: null,
            type: cc.Label,
        },
        labelLeftTime: {
            default: null,
            type: cc.Label,
        },
        labelMust: {
            default: null,
            type: cc.Label,
        },
        labelVastValueTip: {
            default: null,
            type: cc.Label,
        },
        nodeLayoutProb: {
            default: null,
            type: cc.Node,
        },
        nodeLayoutMust: {
            default: null,
            type: cc.Node,
        },
        nodeItemModel: {
            default: null,
            type: cc.Node,
        },
        nodeGoalModel: {
            default: null,
            type: cc.Node,
        },
        nodeVastProgress: {
            default: null,
            type: cc.Node,
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
        this.countDownTimerID = -1;
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
            if (this.countDownTimerID != -1) {
                GlobalVar.gameTimer().delTimer(this.countDownTimerID)
                this.countDownTimerID = -1;
            }

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
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_ACTIVE_RANK_RESULT, this.getActiveRankResult, this);
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
            // this.node.getChildByName("nodeCenter").getChildByName("nodeRanking").active = true;
        }else if (this.activeType == GameServerProto.PT_AMS_ACT_TYPE_VAST){
            this.node.getChildByName("nodeTop").getChildByName("nodeTreasury").active = false;
            this.node.getChildByName("nodeTop").getChildByName("nodeVast").active = true;
            this.node.getChildByName("nodeBottom").getChildByName("nodeTreasury").active = false;
            this.node.getChildByName("nodeBottom").getChildByName("nodeVast").active = true;
            this.node.getChildByName("nodeCenter").getChildByName("nodeTreasury").active = false;
            this.node.getChildByName("nodeCenter").getChildByName("nodeVast").active = true;
            // this.node.getChildByName("nodeCenter").getChildByName("nodeRanking").active = false;
        }
    },

    initSpecialActiveWnd: function () {
        let activeID = GlobalVar.me().activeData.getActiveListDataByType(this.activeType).Actid;
        let activeData = GlobalVar.me().activeData.getActiveDataByActID(activeID);
        if (this.activeType == GameServerProto.PT_AMS_ACT_TYPE_TREASURY) {
            this.node.getChildByName("nodeTop").getChildByName("nodeTreasury").getChildByName("labelScore").getComponent(cc.Label).string = activeData.Integral;
            this.node.getChildByName("nodeCenter").getChildByName("nodeTreasury").getChildByName("labelSinglePrice").getComponent(cc.Label).string = activeData.Act.CostCfg[0].Items[0].Count;
            this.node.getChildByName("nodeCenter").getChildByName("nodeTreasury").getChildByName("labelMultiPrice").getComponent(cc.Label).string = activeData.Act.CostCfg[1].Items[0].Count;
            this.setCountDown();
        } else if (this.activeType == GameServerProto.PT_AMS_ACT_TYPE_VAST) {

            this.labelRecharged.string = activeData.RuleVar + "元";
            this.labelRecvLeftTimes.string = i18n.t('label.4002003').replace("%times", activeData.TotalLimit - activeData.TotalJoin);
            this.labelVastValueTip.string = i18n.t('label.4002001').replace("%price", activeData.Act.OpCfg.VastVar);

            let btnRecvMulti = this.node.getChildByName("nodeCenter").getChildByName("nodeVast").getChildByName("btnRecvMulti");
            let multiTimes = activeData.TotalLimit - activeData.TotalJoin >= 10 ? 10 : activeData.TotalLimit - activeData.TotalJoin;
            multiTimes = multiTimes < 1 ? 1 : multiTimes;
            btnRecvMulti.getComponent(cc.Button).clickEvents[0].customEventData = multiTimes;
            btnRecvMulti.getComponent("ButtonObject").setText(i18n.t('label.4002004').replace("%times", multiTimes));

            this.setVastRewardProgress();
            this.setCountDown();
        }
    },

    setCountDown: function () {
        if (this.countDownTimerID != -1) {
            return;
        }
        let activeID = GlobalVar.me().activeData.getActiveListDataByType(this.activeType).Actid;
        let activeData = GlobalVar.me().activeData.getActiveDataByActID(activeID);
        let endTime = activeData.Act.EndTime;
        let self = this;
        if (endTime - GlobalVar.me().serverTime <= 0) {
            return;
        }
        let labelLeftTime = null;
        if (this.activeType == GameServerProto.PT_AMS_ACT_TYPE_TREASURY) {
            labelLeftTime = this.node.getChildByName("nodeBottom").getChildByName("nodeTreasury").getChildByName("labelLeftTime").getComponent(cc.Label);
        }else if (this.activeType == GameServerProto.PT_AMS_ACT_TYPE_VAST) {
            labelLeftTime = this.labelLeftTime;
        }
        let countDownFunc = function () {
            let activeID = GlobalVar.me().activeData.getActiveListDataByType(self.activeType).Actid;
            let activeData = GlobalVar.me().activeData.getActiveDataByActID(activeID);
            let endTime = activeData.Act.EndTime;
            let leftTime = endTime - GlobalVar.me().serverTime;
            let day = parseInt(leftTime / 86400);
            let hour = parseInt(leftTime % 86400 /3600);
            let min = parseInt(leftTime % 3600 / 60);
            labelLeftTime.string = day + "天" + hour + "时" + min + "分";

            if (leftTime <= 0) {
                GlobalVar.gameTimer().delTimer(self.countDownTimerID);
                GlobalVar.handlerManager().activeHandler.sendActiveTypeActIdReq();
            }
        };
        this.countDownTimerID = GlobalVar.gameTimer().startTimer(function () {
            countDownFunc();
        }, 1);
        countDownFunc();
    },

    setVastRewardProgress: function () {
        let activeID = GlobalVar.me().activeData.getActiveListDataByType(this.activeType).Actid;
        let activeData = GlobalVar.me().activeData.getActiveDataByActID(activeID);
        let vastCfg = activeData.Act.OpCfg.VastCfg;

        let progressLength = 80 * (vastCfg.length * 2 + 1) - 10;
        progressLength = progressLength < 560 ? 560 : progressLength;
        this.nodeVastProgress.width = progressLength;
        this.nodeVastProgress.getChildByName("bar").width = progressLength - 9;
        this.nodeVastProgress.getChildByName("nodeGoals").removeAllChildren();
        let index = 0;
        for (let i = 0; i < vastCfg.length; i++){
            let model = cc.instantiate(this.nodeGoalModel);
            model.y = 0;
            model.x = 80 * (i * 2 + 1) + 40;
            this.nodeVastProgress.getChildByName("nodeGoals").addChild(model);
            model.getChildByName("labelRechargeGold").getComponent(cc.Label).string = i18n.t('label.4002005').replace("%price", vastCfg[i].Var);

            if (activeData.RuleVar >= vastCfg[i].Var){
                index = i + 1;
                model.getChildByName("spriteCircle").getComponent("RemoteSprite").setFrame(1);
                model.getChildByName("labelTimes").color = cc.color(255, 207, 84);
                model.getChildByName("labelTimes").getComponent(cc.Label).string = i18n.t('label.4000333');
            }else{
                model.getChildByName("spriteCircle").getComponent("RemoteSprite").setFrame(0);
                model.getChildByName("labelTimes").color = cc.color(197, 231, 253);
                model.getChildByName("labelTimes").getComponent(cc.Label).string = vastCfg[i].Times + "次";
            }
        }

        let progress = 0;
        if (index == 0){
            progress = (activeData.RuleVar/(vastCfg[index].Var) * 86)/progressLength;
        }else if (index == vastCfg.length){
            progress = 1;
        }else{
            progress = (index * 160 + 6 + (activeData.RuleVar - vastCfg[index - 1].Var)/(vastCfg[index].Var - vastCfg[index - 1].Var) * 86)/progressLength;
        }

        this.nodeVastProgress.getComponent(cc.ProgressBar).progress = progress;
    },

    initItemShow: function () {
        let activeID = GlobalVar.me().activeData.getActiveListDataByType(this.activeType).Actid;
        let activeData = GlobalVar.me().activeData.getActiveDataByActID(activeID);
        let itemProbs = activeData.Act.OpCfg.ItemProbs;
        let itemMusts = activeData.Act.OpCfg.Items;

        for (let i = 0; i< itemProbs.length; i++){
            let model = null;
            if (this.nodeLayoutProb.children[i]){
                model = this.nodeLayoutProb.children[i];
            }else{
                model = cc.instantiate(this.nodeItemModel);
                this.nodeLayoutProb.addChild(model);
            }
            model.y = 0;
            model.getChildByName("ItemObject").getComponent("ItemObject").updateItem(itemProbs[i].ItemID, itemProbs[i].Count);
            model.getChildByName("ItemObject").getComponent("ItemObject").setClick(true, 2);
            model.getChildByName("labelValue").active = true;
            model.getChildByName("labelValue").getComponent(cc.Label).string = i18n.t('label.4002006').replace("%value", itemProbs[i].Price);
        }
        let totalValue = 0;
        for (let i = 0; i< itemMusts.length; i++){
            let model = null;
            if (this.nodeLayoutMust.children[i]){
                model = this.nodeLayoutMust.children[i];
            }else{
                model = cc.instantiate(this.nodeItemModel);
                this.nodeLayoutMust.addChild(model);
            }
            model.y = 0;
            model.getChildByName("ItemObject").getComponent("ItemObject").updateItem(itemMusts[i].ItemID, itemMusts[i].Count);
            model.getChildByName("ItemObject").getComponent("ItemObject").setClick(true, 2);
            model.getChildByName("labelValue").active = false;
            // model.getChildByName("labelValue").getComponent(cc.Label).string = i18n.t('label.4002006').replace("%value", itemMusts[i].Price);
            totalValue += itemMusts[i].Price;
        }
        this.labelMust.string = i18n.t('label.4002002').replace("%value", totalValue);
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
        CommonWnd.showTreasureExploit(event.Item);
        this.initSpecialActiveWnd();
    },

    getActiveRankResult: function (event) {
        if (event.ErrCode != GameServerProto.PTERR_SUCCESS){
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }

        this.deleteMode = false;
        this.nodeLayoutMust.removeAllChildren();
        this.nodeLayoutProb.removeAllChildren();
        this.animePlay(0);
    },

    getActiveTreasuryData: function (event) {
        if (event.ErrCode != GameServerProto.PTERR_SUCCESS){
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        CommonWnd.showTreasureExploit(event.Item);
        this.initSpecialActiveWnd();
    },

    getRankPanel: function () {
        // CommonWnd.showTreasuryRankWnd();
        // if (event && event.ErrCode != GameServerProto.PTERR_SUCCESS){
        //     GlobalVar.comMsg.errorWarning(event.ErrCode);
        //     return;
        // }
        let act = GlobalVar.me().activeData.getActiveListDataByType(GameServerProto.PT_AMS_ACT_TYPE_TREASURY);
        GlobalVar.handlerManager().activeHandler.sendActiveRankReq(act.Actid, GameServerProto.PT_AMS_RANK_ALL);
    },

    onBtnVastJoin: function (event, num) {
        let activeID = GlobalVar.me().activeData.getActiveListDataByType(this.activeType).Actid;
        GlobalVar.handlerManager().activeHandler.sendActiveVastReq(activeID, num);
    },

    onBtnTreasuryJoin: function (event, id) {
        let activeID = GlobalVar.me().activeData.getActiveListDataByType(this.activeType).Actid;
        GlobalVar.handlerManager().activeHandler.sendActiveTreasuryReq(activeID, id);
    },

    enter: function (isRefresh) {
        if (isRefresh) {
            this.initSpecialActiveWnd();
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
        this.nodeLayoutMust.removeAllChildren();
        this.nodeLayoutProb.removeAllChildren();
        this._super()
    },

    onDestroy: function () {
        GlobalVar.eventManager().removeListenerWithTarget(this);
        if (this.countDownTimerID != -1) {
            GlobalVar.gameTimer().delTimer(this.countDownTimerID)
            this.countDownTimerID = -1;
        }
    },
});