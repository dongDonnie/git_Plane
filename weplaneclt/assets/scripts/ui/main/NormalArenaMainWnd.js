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
        nodeRewardHotPoint: {
            default: null,
            type: cc.Node,
        },
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_ARENA_MAIN_WND;
        this.animeStartParam(0);
        if (GlobalFunc.isAllScreen() && !this.fixViewComplete) {
            this.fixViewComplete = true;
            this.fixView();
        }
        this._leftSaoDangCount = 0;
        this._getPoint = 0;
        this.isFirstIn = true;
    },

    animeStartParam(num) {
        this.node.opacity = num;
        if (num = 0) {
            this.node.setA(0);
        }

        if (num == 0 || num == 255){
            this.node.getChildByName("nodeTop").active = false;
            this.node.getChildByName("nodeBottom").active = false;
        }
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            GlobalVar.eventManager().removeListenerWithTarget(this);
            if (!this.deleteMode) {
                CommonWnd.showArenaRankingWnd();
            } else if (this.deleteMode) {
                let uiNode = cc.find("Canvas/UINode");
                BattleManager.getInstance().quitOutSide();
                BattleManager.getInstance().startOutside(uiNode.getChildByName('UIMain').getChildByName('nodeBottom').getChildByName('planeNode'), GlobalVar.me().memberData.getStandingByFighterID(), true);
            }
        } else if (name == "Enter") {
            this._super("Enter");
            let challengeData = GlobalVar.me().arenaData.getArenaChallengeData();
            if (challengeData && challengeData.DiamondReward > 0) {
                let uiNode = cc.find("Canvas/UINode");
                if (cc.isValid(uiNode)) {
                    uiNode.active = true;
                }
            }
            this.deleteMode = false;
            BattleManager.getInstance().quitOutSide();
            this.registerEvent();
            
            this.node.getChildByName("nodeTop").active = true;
            this.node.getChildByName("nodeBottom").active = true;

            this.initLoopScroll();
            
            if (challengeData && challengeData.DiamondReward > 0) {
                CommonWnd.showTreasureExploit([{
                    ItemID: 3,
                    Count: challengeData.DiamondReward
                }])
                GlobalVar.me().arenaData.arenaChallengeData = null;
            }
        }
    },

    registerEvent: function () {
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_ARENA_CHALLENGE_DATA, this.getArenaChallengeData, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_ARENA_SAODANG_DATA, this.getArenaSaoDangData, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_ARENA_REPORT_DATA, this.getArenaReportData, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_ARENA_RANK_TIP_LIST_DATA, this.getArenaRankTopListData, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_ARENA_STORE_DATA, this.getArenaStoreData, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_ARENA_POINT_CHANGE_DATA, this.getArenaPointChangeData, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_ARENA_CHALLENGE_COUNT_FREE_GET_DATA, this.getArenaChallengeCountFreeGetData, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_ARENA_CHALLENGE_COUNT_BUY_DATA, this.getArenaChallengeCountBuyData, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_ARENA_DAY_REWARD_DATA, this.getArenaDayRewardData, this);
    },

    initArenaMainWnd: function () {
        this.labelMyRank.string = GlobalVar.me().arenaData.getPlayerRanking();
        this.labelMyPoint.string = GlobalVar.me().arenaData.getPlayerPoints();
        let maxTimes = GlobalVar.me().arenaData.getChallengeLimit();
        let curTimes = GlobalVar.me().arenaData.getChallengeCount();
        this.labelLeftTimes.string = (maxTimes - curTimes) + "/" + maxTimes;
        this.labelFreeTimes.string = i18n.t('label.4001001').replace("%free", GlobalVar.me().arenaData.getFreeChallengeCount());
        this.labelTicketCount.string = GlobalVar.me().bagData.getItemCountById(GameServerProto.PT_ITEMID_ARENA_CHALLENGE_TICKET);

        this.nodeRewardHotPoint.active = GlobalVar.me().arenaData.getArenaRewardFlag();
    },

    initLoopScroll: function () {
        let self = this;
        let arenaListData = GlobalVar.me().arenaData.getArenaListData();
        this.rankScroll.loopScroll.setTotalNum(arenaListData.length);
        this.rankScroll.loopScroll.setCreateInterval(0);
        this.rankScroll.loopScroll.setCreateModel(this.nodeRankModel);
        this.rankScroll.loopScroll.saveCreatedModel(this.rankScroll.content.children);
        this.rankScroll.loopScroll.registerUpdateItemFunc(function(model, index){
            self.updateRank(model, arenaListData[index]);
            model.getChildByName("btnChallenge").getComponent(cc.Button).clickEvents[0].customEventData = index;
            model.getChildByName("btnSaoDangSingle").getComponent(cc.Button).clickEvents[0].customEventData = index + "." + 1;
            model.getChildByName("btnSaoDangMulti").getComponent(cc.Button).clickEvents[0].customEventData = index + "." + 5;
        });
        this.rankScroll.loopScroll.resetView();
        this.rankScroll.scrollToTop();
    },

    updateRank: function (model, data) {
        if (data.Ranking > 3 || data.Ranking < 1) {
            model.getChildByName("spriteRank").getComponent("RemoteSprite").setFrame(0);
            model.getChildByName("spriteRank").getChildByName("labelRank").getComponent(cc.Label).string = data.Ranking;
            model.getChildByName("spriteRank").getChildByName("labelRank").active = true;
        } else {
            model.getChildByName("spriteRank").getComponent("RemoteSprite").setFrame(data.Ranking);
            model.getChildByName("spriteRank").getChildByName("labelRank").active = false;
        }

        if (data.RoleID == GlobalVar.me().roleID) {
            model.getChildByName("spriteBg").active = false;
            model.getChildByName("spriteBgSelect").active = true;
            model.getChildByName("btnChallenge").active = false;
            model.getChildByName("btnSaoDangSingle").active = false;
            model.getChildByName("btnSaoDangMulti").active = false;
        } else {
            model.getChildByName("spriteBg").active = true;
            model.getChildByName("spriteBgSelect").active = false;

            if (data.CombatPoint <= GlobalVar.me().combatPoint && data.Ranking > GlobalVar.me().arenaData.getPlayerRanking() && GlobalVar.me().arenaData.getPlayerRanking() <= 1000){
                model.getChildByName("btnChallenge").active = false;
                model.getChildByName("btnSaoDangSingle").active = true;
                model.getChildByName("btnSaoDangMulti").active = true;
            } else {
                model.getChildByName("btnChallenge").active = true;
                model.getChildByName("btnSaoDangSingle").active = false;
                model.getChildByName("btnSaoDangMulti").active = false;
            }
        }
        model.getChildByName("labelPlayerName").getComponent(cc.Label).string = GlobalFunc.interceptStr(data.RoleName, 8, "...");
        model.getChildByName("labelPlayerLevel").getComponent(cc.Label).string = "等级" + data.Level;
        model.getChildByName("labelPlayerCombat").getComponent(cc.Label).string = data.CombatPoint;
        model.x = 0;
        if (data.Avatar == "") {
            model.getChildByName("ItemObject").getComponent("ItemObject").updateItem(data.MemberID);
            model.getChildByName("ItemObject").getComponent("ItemObject").setSpriteEdgeData(data.Quality < 100 ? data.Quality * 100 : data.Quality);
            model.getChildByName("ItemObject").getComponent("ItemObject").setSpritePieceVisible(false);
        } else {
            model.getChildByName("ItemObject").getComponent("ItemObject").setAllVisible(false);

            cc.loader.load({
                url: data.Avatar,
                type: 'png'
            }, function (err, tex) {
                if (err) {
                    cc.error("LoadURLSpriteFrame err." + data.Avatar);
                }
                let spriteFrame = new cc.SpriteFrame(tex);
                model.getChildByName("ItemObject").getChildByName("spriteItemIcon").getComponent("RemoteSprite").spriteFrame = spriteFrame;
            })
        }
        // model.getChildByName("btnChallenge").getComponent(cc.Button).clickEvents[0].customEventData = data.Ranking;
    },


    btnChallengeClick: function (event, index) {
        let challengeMode = GlobalVar.me().arenaData.getFreeChallengeCount() > 0 ? GameServerProto.PT_ARENA_CHALLENGE_USE_COUNT : GameServerProto.PT_ARENA_CHALLENGE_USE_TICKET;
        let arenaListData = GlobalVar.me().arenaData.getArenaListData();
        GlobalVar.handlerManager().arenaHandler.sendArenaChallengeReq(arenaListData[index].RoleID, arenaListData[index].Ranking, challengeMode);
    },
    btnSaoDangClick: function (event, customEventData, isSerial) {
        if (this._leftSaoDangCount > 0 && !isSerial) {
            return;
        }
        let arr = customEventData.split(".");
        let index = arr[0];
        let count = arr[1];
        this._index = index;
        this._leftSaoDangCount = count;
        let challengeMode = GlobalVar.me().arenaData.getFreeChallengeCount() > 0 ? GameServerProto.PT_ARENA_CHALLENGE_USE_COUNT : GameServerProto.PT_ARENA_CHALLENGE_USE_TICKET;
        let arenaListData = GlobalVar.me().arenaData.getArenaListData();
        GlobalVar.handlerManager().arenaHandler.sendArenaSaoDangReq(arenaListData[index].Ranking, challengeMode);
    },
    btnTicketPlusClick: function (event) {
        CommonWnd.showArenaGetFreeTicketWnd();
    },
    btnRewardClick: function (event) {
        CommonWnd.showArenaRewardWnd();
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
    btnPlayTipClick: function (event) {
        CommonWnd.showArenaPlayTipWnd();
    },

    getArenaChallengeData: function (event) {
        if (event.ErrCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        BattleManager.getInstance().quitOutSide();
        BattleManager.getInstance().isArenaFlag = true;
        BattleManager.getInstance().setCampName('CampDemo');
        BattleManager.getInstance().setMusic('audio/battle/music/Boss_Room');
        BattleManager.getInstance().setBattleMsg(event.OK);
        GlobalVar.sceneManager().gotoScene(SceneDefines.BATTLE_STATE);
        // let challengeResult = event.OK.ChallengeResult;
        // GlobalVar.comMsg.showMsg(challengeResult == 1?("挑战胜利, 获得荣誉点" + GameServerProto.PT_ARENA_CHALLENGE_WIN_POINTS):("挑战失败, 获得荣誉点" + GameServerProto.PT_ARENA_CHALLENGE_LOSE_POINTS));
        // this.initArenaMainWnd();
    },
    getArenaSaoDangData: function (event) {
        if (event.ErrCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            this.showGetPointWnd();
            return;
        }
        this._leftSaoDangCount--;
        this._getPoint += GameServerProto.PT_ARENA_CHALLENGE_WIN_POINTS;
        if (this._leftSaoDangCount > 0) {
            this.btnSaoDangClick(null, this._index + "." + this._leftSaoDangCount, true);
        } else {
            this.showGetPointWnd();
        }
    },
    getArenaReportData: function (event) {
        if (event.ErrCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        CommonWnd.showArenaReportWnd();
    },
    getArenaRankTopListData: function (event) {
        if (event.ErrCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        // CommonWnd.showArenaRankingWnd();
        this.rankScroll.loopScroll.releaseViewItems();
        this.animePlay(0);
    },
    getArenaStoreData: function (event) {
        let index = WindowManager.getInstance().findViewIndex(WndTypeDefine.WindowType.E_DT_NORMAL_ARENA_STORE_WND);
        if (index != -1) {
            return;
        }
        if (event.ErrCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        CommonWnd.showArenaStoreWnd();
    },
    getArenaPointChangeData: function (event) {
        this.labelMyPoint.string = GlobalVar.me().arenaData.getPlayerPoints();
    },
    getArenaChallengeCountFreeGetData: function (event) {
        if (event.ErrCode == GameServerProto.PTERR_SUCCESS) {
            this.labelTicketCount.string = GlobalVar.me().bagData.getItemCountById(GameServerProto.PT_ITEMID_ARENA_CHALLENGE_TICKET);
        }
    },
    getArenaChallengeCountBuyData: function (event) {
        if (event.ErrCode == GameServerProto.PTERR_SUCCESS) {
            this.labelTicketCount.string = GlobalVar.me().bagData.getItemCountById(GameServerProto.PT_ITEMID_ARENA_CHALLENGE_TICKET);
        }
    },
    getArenaDayRewardData: function (event) {
        if (event.ErrCode == GameServerProto.PTERR_SUCCESS) {
            this.nodeRewardHotPoint.active = GlobalVar.me().arenaData.getArenaRewardFlag();
        }
    },


    showGetPointWnd: function () {
        if (this._getPoint > 0) {
            let getPoint = this._getPoint;
            let items = [{
                wItemID: GameServerProto.PT_ITEMID_ARENA_POINT,
                nCount: getPoint
            }];
            CommonWnd.showTreasureExploit(items);
        }
        this._leftSaoDangCount = 0;
        this._getPoint = 0;
        this.initArenaMainWnd();
    },

    enter: function (isRefresh) {
        if (isRefresh) {
            this._super(true);
            this.initArenaMainWnd();
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
        this.rankScroll.loopScroll.releaseViewItems();
        this._super()
    },

    onDestroy: function () {
        GlobalVar.eventManager().removeListenerWithTarget(this);
    },
});