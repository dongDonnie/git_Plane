
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
const weChatAPI = require("weChatAPI");

cc.Class({
    extends: RootBase,

    properties: {
        nodeRankModel: {
            default: null,
            type: cc.Node,
        },
        rankScroll: {
            default: null,
            type: cc.ScrollView,
        },
        labelMyRank: {
            default: null,
            type: cc.Label,
        },
        labelMyPoint: {
            default: null,
            type: cc.Label,
        },
        labelLeftTimes: {
            default: null,
            type: cc.Label,
        },
        labelFreeTimes: {
            default: null,
            type: cc.Label,
        },
        labelTicketCount: {
            default: null,
            type: cc.Label,
        },

    },

    onLoad: function () {
        this._super();
        i18n.init('zh');
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_ARENA_MAIN_WND;
        this.animeStartParam(0);
        if (GlobalFunc.isAllScreen() && !this.fixViewComplete) {
            this.fixViewComplete = true;
            this.fixView();
        }

        this.isFirstIn = true;
        this.initArenaMainWnd();
    },

    animeStartParam(num) {
        this.node.opacity = num;
        if (num = 0){
            this.node.setA(0);
        }
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            // this.node.getChildByName("nodeBlock").active = true;
            GlobalVar.eventManager().removeListenerWithTarget(this);
            if (!this.deleteMode) {
                CommonWnd.showArenaRankingWnd();
            }else if (this.deleteMode) {
                let uiNode = cc.find("Canvas/UINode");
                BattleManager.getInstance().quitOutSide();
                BattleManager.getInstance().startOutside(uiNode.getChildByName('UIMain').getChildByName('nodeBottom').getChildByName('planeNode'),GlobalVar.me().memberData.getStandingByFighterID(),true);
            }
        } else if (name == "Enter") {
            this._super("Enter")
            this.deleteMode = false;
            this.registerEvent();
            if (WindowManager.getInstance().findViewIndex(WndTypeDefine.WindowType.E_DT_GUAZAIMAIN_WND) == -1) {
                BattleManager.getInstance().quitOutSide();
            }
            this.initLoopScroll();
        }
    },

    registerEvent: function () {
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_ARENA_CHALLENGE_DATA, this.getArenaChallengeData, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_ARENA_SAODANG_DATA, this.getArenaSaoDangData, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_ARENA_REPORT_DATA, this.getArenaReportData, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_ARENA_RANK_TIP_LIST_DATA, this.getArenaRankTopListData, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_ARENA_STORE_DATA, this.getArenaStoreData, this);
    },

    initArenaMainWnd: function () {
        this.labelMyRank.string = GlobalVar.me().arenaData.getPlayerRanking();
        this.labelMyPoint.string = GlobalVar.me().arenaData.getPlayerPoints();
        let maxTimes = GlobalVar.me().arenaData.getChallengeLimit();
        let curTimes = GlobalVar.me().arenaData.getChallengeCount();
        this.labelLeftTimes.string = (maxTimes - curTimes) + "/" + maxTimes;
        this.labelFreeTimes.string = i18n.t('label.4001001').replace("%free", GlobalVar.me().arenaData.getFreeChallengeCount());
        this.labelTicketCount.string = GlobalVar.me().bagData.getItemCountById(GameServerProto.PT_ITEMID_ARENA_CHALLENGE_TICKET);
    },

    initLoopScroll: function () {
        let self = this;
        let arenaListData = GlobalVar.me().arenaData.getArenaListData();
        this.rankScroll.loopScroll.setTotalNum(arenaListData.length);
        this.rankScroll.loopScroll.setCreateInterval(0);
        this.rankScroll.loopScroll.setCreateModel(this.nodeRankModel);
        this.rankScroll.loopScroll.registerUpdateItemFunc(function(model, index){
            self.updateRank(model, arenaListData[index]);
            model.getChildByName("btnChallenge").getComponent(cc.Button).clickEvents[0].customEventData = index;
        });
        this.rankScroll.loopScroll.resetView();
        this.rankScroll.scrollToTop();
    },

    updateRank: function (model, data) {
        if (data.Ranking > 3 || data.Ranking < 1){
            model.getChildByName("spriteRank").getComponent("RemoteSprite").setFrame(0);
            model.getChildByName("spriteRank").getChildByName("labelRank").getComponent(cc.Label).string = data.Ranking;
            model.getChildByName("spriteRank").getChildByName("labelRank").active = true;
        }else{
            model.getChildByName("spriteRank").getComponent("RemoteSprite").setFrame(data.Ranking);
            model.getChildByName("spriteRank").getChildByName("labelRank").active = false;
        }

        if (data.RoleID == GlobalVar.me().roleID){
            model.getChildByName("spriteBg").active = false;
            model.getChildByName("spriteBgSelect").active = true;
            model.getChildByName("btnChallenge").active = false;
            model.getChildByName("btnSaoDangSingle").active = false;
            model.getChildByName("btnSaoDangMulti").active = false;
        }else{
            model.getChildByName("spriteBg").active = true;
            model.getChildByName("spriteBgSelect").active = false;

            if (data.CombatPoint <= GlobalVar.me().combatPoint && data.Ranking > GlobalVar.me().arenaData.getPlayerRanking()){
                model.getChildByName("btnChallenge").active =false;
                model.getChildByName("btnSaoDangSingle").active = true;
                model.getChildByName("btnSaoDangMulti").active = true;
            }else{
                model.getChildByName("btnChallenge").active = true;
                model.getChildByName("btnSaoDangSingle").active = false;
                model.getChildByName("btnSaoDangMulti").active = false;
            }
        }
        model.getChildByName("labelPlayerName").getComponent(cc.Label).string = GlobalFunc.interceptStr(data.RoleName, 12, "...");
        model.getChildByName("labelPlayerLevel").getComponent(cc.Label).string = "等级" + data.Level;
        model.getChildByName("labelPlayerCombat").getComponent(cc.Label).string = data.CombatPoint;
        model.x = 0;
        if (data.Avatar == ""){
            model.getChildByName("ItemObject").getComponent("ItemObject").updateItem(data.MemberID);
            model.getChildByName("ItemObject").getComponent("ItemObject").setSpriteEdgeData(data.Quality * 100);
        }else{
            model.getChildByName("ItemObject").getComponent("ItemObject").setAllVisible(false);
        }
        // model.getChildByName("btnChallenge").getComponent(cc.Button).clickEvents[0].customEventData = data.Ranking;
    },


    btnChallengeClick: function (event, index) {
        let challengeMode = GlobalVar.me().arenaData.getFreeChallengeCount() > 0?GameServerProto.PT_ARENA_CHALLENGE_USE_COUNT:GameServerProto.PT_ARENA_CHALLENGE_USE_TICKET;
        let arenaListData = GlobalVar.me().arenaData.getArenaListData();
        GlobalVar.handlerManager().arenaHandler.sendArenaChallengeReq(arenaListData[index].RoleID, arenaListData[index].Ranking, challengeMode);
    },
    btnSaoDangClick: function (event, count) {
        this._leftSaoDangCount = count;
        let challengeMode = GlobalVar.me().arenaData.getFreeChallengeCount() > 0?GameServerProto.PT_ARENA_CHALLENGE_USE_COUNT:GameServerProto.PT_ARENA_CHALLENGE_USE_TICKET;
        let arenaListData = GlobalVar.me().arenaData.getArenaListData();
        GlobalVar.handlerManager().arenaHandler.sendArenaSaoDangReq(arenaListData[index].Ranking, challengeMode);
    },
    btnTicketPlusClick: function (event) {
        
    },
    btnRewardClick: function (event) {
        
    },
    btnRankingClick: function (event) {
        GlobalVar.handlerManager().arenaHandler.sendArenaRankTopListReq();
    },
    btnStoreClick: function (event) {
        GlobalVar.handlerManager().arenaHandler.sendArenaStoreReq();
    },
    btnReportClick: function (event) {
        GlobalVar.handlerManager().arenaHandler.sendArenaReportReq();
    },

    getArenaChallengeData: function (event) {
        if (event.ErrCode != GameServerProto.PTERR_SUCCESS){
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        let challengeResult = event.OK.ChallengeResult;
        GlobalVar.comMsg.showMsg(challengeResult == 1?"挑战胜利":"挑战失败");
        this.initArenaMainWnd();
    },
    getArenaSaoDangData: function (event) {
        if (event.ErrCode != GameServerProto.PTERR_SUCCESS){
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
    },
    getArenaReportData: function (event) {
        if (event.ErrCode != GameServerProto.PTERR_SUCCESS){
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        CommonWnd.showArenaReportWnd();
    },
    getArenaRankTopListData: function (event) {
        if (event.ErrCode != GameServerProto.PTERR_SUCCESS){
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        // CommonWnd.showArenaRankingWnd();
        this.animePlay(0);
    },
    getArenaStoreData: function (event) {
        if (event.ErrCode != GameServerProto.PTERR_SUCCESS){
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        CommonWnd.showArenaStoreWnd();
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
        // console.log("fix the allscreen");
        // let bottomWidget = this.node.getChildByName("nodeBottom").getComponent(cc.Widget);
        // bottomWidget.bottom += 60;
        // bottomWidget.updateAlignment();
        // let centerWidget = this.node.getChildByName("nodeCenter").getComponent(cc.Widget);
        // centerWidget.top += 150;
        // centerWidget.updateAlignment();
        // let bgWidget = this.node.getChildByName("spriteDrawBg").getComponent(cc.Widget);
        // bgWidget.top = 0;
        // bgWidget.updateAlignment();
    },

    close: function () {
        this.rankScroll.loopScroll.releaseViewItems();
        this._super()
    },

    onDestroy: function () {
        GlobalVar.eventManager().removeListenerWithTarget(this);
    },
});