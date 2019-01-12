
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
        labelMyRank: {
            default: null,
            type: cc.Label,
        },
        labelMyPoint: {
            default: null,
            type: cc.Label,
        },
        labelMyLike: {
            default: null,
            type: cc.Label
        },
        nodeRankModel: {
            default: null,
            type: cc.Node,
        },
        rankScroll: {
            default: null,
            type: cc.ScrollView,
        },
        labelTodayLimit: {
            default: null,
            type: cc.Label,
        },
    },

    onLoad: function () {
        this._super();
        i18n.init('zh');
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_ARENA_RANKING_WND;
        this.animeStartParam(0);
        if (GlobalFunc.isAllScreen() && !this.fixViewComplete) {
            this.fixViewComplete = true;
            this.fixView();
        }

        this.isFirstIn = true;
        this.initArenaRankingWnd();
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
        } else if (name == "Enter") {
            this._super("Enter")
            this.registerEvent();
            this.initLoopScroll();
        }
    },

    registerEvent: function () {
        // GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_ARENA_CHALLENGE_DATA, this.getArenaChallengeData, this);
        // GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_ARENA_SAODANG_DATA, this.getArenaSaoDangData, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_ARENA_LIKE_DATA, this.getArenaLikeData, this);
    },

    initArenaRankingWnd: function () {
        let arenaTopListData = GlobalVar.me().arenaData.arenaTopListData;
        this.labelMyRank.string = arenaTopListData.Ranking;
        this.labelMyPoint.string = arenaTopListData.Points;
        this.labelMyLike.string = arenaTopListData.Likes;

        let curTimes = GlobalVar.me().arenaData.getArenaLikeClicks();
        let maxTimes = GlobalVar.me().arenaData.getArenaLikeClicksLimit();
        this.labelTodayLimit.string = (maxTimes - curTimes) + "/" + maxTimes;
    },

    initLoopScroll: function () {
        let self = this;
        let arenaListData = GlobalVar.me().arenaData.getArenaRankTopData();
        this.rankScroll.loopScroll.setTotalNum(arenaListData.length);
        this.rankScroll.loopScroll.setCreateInterval(0);
        this.rankScroll.loopScroll.setCreateModel(this.nodeRankModel);
        this.rankScroll.loopScroll.registerUpdateItemFunc(function(model, index){
            self.updateRank(model, arenaListData[index]);
            model.getChildByName("btnLike").getComponent(cc.Button).clickEvents[0].customEventData = index;
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

        model.getChildByName("labelPlayerLikesCount").getComponent(cc.Label).string = data.Likes;
    },


    btnLikeClick: function (event, index) {
        this.clickIndex = index;
        let arenaListData = GlobalVar.me().arenaData.getArenaRankTopData();
        GlobalVar.handlerManager().arenaHandler.sendArenaLikeReq(arenaListData[index].RoleID);
    },

    getArenaLikeData: function (event) {
        if (event.ErrCode != GameServerProto.PTERR_SUCCESS){
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        GlobalVar.comMsg.showMsg("点赞成功，获得金币" + event.OK.GoldReward);
        this.initArenaRankingWnd();

        let arenaListData = GlobalVar.me().arenaData.getArenaRankTopData();
        this.clickIndex >= 0 && (arenaListData[this.clickIndex].Likes += 1);
        this.rankScroll.loopScroll.refreshViewItem();
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