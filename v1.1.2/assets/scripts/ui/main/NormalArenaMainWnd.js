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
        challengeIndex: null,
    },

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
        this.timeoutId = -1;
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
                CommonWnd.showArenaRankingWnd();
            } else if (this.deleteMode) {
                GlobalVar.me().arenaData.setOldArenaList(null);
                let uiNode = cc.find("Canvas/UINode");
                BattleManager.getInstance().quitOutSide();
                BattleManager.getInstance().startOutside(uiNode.getChildByName('UIMain').getChildByName('nodeBottom').getChildByName('planeNode'), GlobalVar.me().memberData.getStandingByFighterID(), true);
            }
        } else if (name == "Enter") {
            this._super("Enter");
            let block = cc.find("Canvas/BlockNode");
            if (cc.isValid(block)) {
                block.active = true;
            }
            this.deleteMode = false;
            BattleManager.getInstance().quitOutSide();
            this.registerEvent();

            this.node.getChildByName("nodeTop").active = true;
            this.node.getChildByName("nodeBottom").active = true;

            this.initLoopScroll(function () {
                let block = cc.find("Canvas/BlockNode");
                if (cc.isValid(block)) {
                    block.active = false;
                }
                let challengeData = GlobalVar.me().arenaData.getArenaChallengeData();
                if (challengeData && challengeData.PointsReward > 0) {
                    CommonWnd.showTreasureExploit([{
                        ItemID: GameServerProto.PT_ITEMID_ARENA_POINT,
                        Count: challengeData.PointsReward,
                    }]);
                    GlobalVar.me().arenaData.arenaChallengeData = null;
                }
            });
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

    initLoopScroll: function (callback) {
        let self = this;
        let createLoop = function (list, complete) {
            let startIndex = 0;
            for (let key in list) {
                if (list[key].RoleID == GlobalVar.me().roleID) {
                    startIndex = key;
                    break;
                }
            }
            startIndex = startIndex > 3 ? startIndex - 3 : 0;
            if (startIndex >= list.length - 3) {
                startIndex = list.length - 6;
            }
            self.rankScroll.loopScroll.setStartIndex(startIndex);
            self.rankScroll.loopScroll.setTotalNum(list.length);
            self.rankScroll.loopScroll.setCreateInterval(0);
            self.rankScroll.loopScroll.setCreateModel(self.nodeRankModel);
            self.rankScroll.loopScroll.saveCreatedModel(self.rankScroll.content.children);
            self.rankScroll.loopScroll.registerUpdateItemFunc(function (model, index) {
                self.updateRank(model, list[index]);
                model.getChildByName("btnChallenge").getComponent(cc.Button).clickEvents[0].customEventData = index;
                model.getChildByName("btnSaoDangSingle").getComponent(cc.Button).clickEvents[0].customEventData = index + "." + 1;
                model.getChildByName("btnSaoDangMulti").getComponent(cc.Button).clickEvents[0].customEventData = index + "." + 5;
            });
            if (!!complete) {
                self.rankScroll.loopScroll.registerAllCompleteFunc(complete);
            }
            self.rankScroll.loopScroll.resetView();
        };

        let oldData = null; //GlobalVar.me().arenaData.getOldArenaList();
        let arenaListData = GlobalVar.me().arenaData.getArenaListData();
        if (oldData != null) {
            let oldIndex = -1;
            for (let key in oldData) {
                if (oldData[key].RoleID == GlobalVar.me().roleID) {
                    oldIndex = key;
                    break;
                }
            }
            let newIndex = -1;
            for (let key in arenaListData) {
                if (arenaListData[key].RoleID == GlobalVar.me().roleID) {
                    newIndex = key;
                    break;
                }
            }
            if (oldData[oldIndex].Ranking > arenaListData[newIndex].Ranking) {
                createLoop(oldData, function () {
                    let animeBack = self.node.getChildByName("spriteRankUpAnime");
                    animeBack.active = true;
                    let obj = null;
                    let origin = null;
                    let target = null;
                    for (let item of self.rankScroll.loopScroll.itemList) {
                        let str = item.getChildByName("spriteRank").getChildByName("labelRank").getComponent(cc.Label).string;
                        if (str == oldData[oldIndex].Ranking.toString()) {
                            origin = item;
                            obj = cc.instantiate(item);
                            self.updateRank(obj, oldData[oldIndex]);
                            obj.opacity = 0;
                            animeBack.addChild(obj);
                            GlobalFunc.converToOtherNodeSpaceAR(item, obj);
                        }
                        if (str == oldData[NormalArenaMainWnd.challengeIndex].Ranking.toString()) {
                            target = item;
                        }
                    }
                    let offset = self.rankScroll.getScrollOffset();
                    if (offset.y <= 0) {
                        let y = (obj.height + self.rankScroll.loopScroll.gapDisY) * (NormalArenaMainWnd.challengeIndex - oldIndex);
                        obj.runAction(cc.sequence(cc.fadeIn(0.2), cc.moveBy(0.2, cc.v2(0, -y)), cc.fadeOut(0.2), cc.removeSelf(true)));
                        animeBack.runAction(cc.sequence(cc.delayTime(0.6), cc.callFunc(function () {
                            createLoop(arenaListData);
                            GlobalVar.me().arenaData.setOldArenaList(arenaListData);
                            animeBack.active = false;
                            if (!!callback) {
                                callback();
                            }
                        })));
                    } else {
                        animeBack.runAction(cc.sequence(
                            cc.callFunc(function () {
                                obj.runAction(cc.fadeIn(0.2));
                            }),
                            cc.delayTime(0.2),
                            cc.callFunc(function () {
                                if (target != null) {
                                    let plus = target.getPosition().sub(origin.getPosition());
                                    self.rankScroll.scrollToOffset(cc.v2(offset.x, offset.y - plus.y), 0.2);
                                } else {
                                    self.rankScroll.scrollToOffset(cc.v2(offset.x, 0), 0.2);
                                }
                            }),
                            cc.delayTime(0.2),
                            cc.callFunc(function () {
                                if (target == null) {
                                    for (let item of self.rankScroll.loopScroll.itemList) {
                                        let str = item.getChildByName("spriteRank").getChildByName("labelRank").getComponent(cc.Label).string;
                                        if (str == oldData[NormalArenaMainWnd.challengeIndex].Ranking.toString()) {
                                            target = item;
                                            break;
                                        }
                                    }
                                }
                                let worldPos = target.parent.convertToWorldSpaceAR(target);
                                let nodePos = animeBack.convertToNodeSpaceAR(worldPos);
                                obj.runAction(cc.moveTo(0.2, nodePos));

                            }),
                            cc.delayTime(0.2),
                            cc.callFunc(function () {
                                obj.runAction(cc.sequence(cc.fadeOut(0.2), cc.removeSelf(true)));
                            }),
                            cc.delayTime(0.2),
                            cc.callFunc(function () {
                                NormalArenaMainWnd.challengeIndex = null;
                                createLoop(arenaListData);
                                GlobalVar.me().arenaData.setOldArenaList(arenaListData);
                                animeBack.active = false;
                                if (!!callback) {
                                    callback();
                                }
                            })
                        ));
                    }
                });
                return;
            }
        }
        createLoop(arenaListData, function () {
            if (!!callback) {
                callback();
            }
            //GlobalVar.me().arenaData.setOldArenaList(arenaListData);
        });
    },

    updateRank: function (model, data) {
        let rank = model.getChildByName("spriteRank");
        rank.getChildByName("labelRank").getComponent(cc.Label).string = data.Ranking;
        if (data.Ranking > 3 || data.Ranking < 1) {
            rank.getComponent("RemoteSprite").setFrame(0);
            rank.getChildByName("labelRank").active = true;
        } else {
            rank.getComponent("RemoteSprite").setFrame(data.Ranking);
            rank.getChildByName("labelRank").active = false;
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

            if (data.CombatPoint <= GlobalVar.me().combatPoint && data.Ranking > GlobalVar.me().arenaData.getPlayerRanking() && GlobalVar.me().arenaData.getPlayerRanking() <= 1000) {
                model.getChildByName("btnChallenge").active = false;
                model.getChildByName("btnSaoDangSingle").active = true;
                model.getChildByName("btnSaoDangMulti").active = true;
            } else {
                model.getChildByName("btnChallenge").active = true;
                model.getChildByName("btnSaoDangSingle").active = false;
                model.getChildByName("btnSaoDangMulti").active = false;
            }
        }
        model.getChildByName("labelPlayerName").getComponent(cc.Label).string = GlobalFunc.interceptStrNew(data.RoleName, 4, "...");
        model.getChildByName("labelPlayerLevel").getComponent(cc.Label).string = "等级" + data.Level;
        model.getChildByName("labelPlayerCombat").getComponent(cc.Label).string = data.CombatPoint;
        model.x = 0;
        let item = model.getChildByName("ItemObject").getComponent("ItemObject");
        if (data.Avatar == "") {
            item.updateItem(data.MemberID);
            item.setClick(false);
            item.setSpriteEdgeData(data.Quality < 100 ? data.Quality * 100 : data.Quality);
            item.setSpritePieceVisible(false);
        } else {
            item.setAllVisible(false);
            item.setClick(false);

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
        let block = cc.find("Canvas/BlockNode");
        if (cc.isValid(block)) {
            block.active = true;
            this.timeoutId = setTimeout(function () {
                let block = cc.find("Canvas/BlockNode");
                if (cc.isValid(block)) {
                    block.active = false;
                }
            }, 3000);
        }

        let challengeMode = GameServerProto.PT_ARENA_CHALLENGE_USE_TICKET;
        if (GlobalVar.me().arenaData.getFreeChallengeCount() > 0) {
            challengeMode = GameServerProto.PT_ARENA_CHALLENGE_USE_COUNT;
        } else if (GlobalVar.me().bagData.getItemCountById(GameServerProto.PT_ITEMID_ARENA_CHALLENGE_TICKET) > 0) {
            challengeMode = GameServerProto.PT_ARENA_CHALLENGE_USE_TICKET;
        } else {
            CommonWnd.showArenaGetFreeTicketWnd();
            return;
        }

        //NormalArenaMainWnd.challengeIndex = index;

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
        let challengeMode = GameServerProto.PT_ARENA_CHALLENGE_USE_TICKET;
        if (GlobalVar.me().arenaData.getFreeChallengeCount() > 0) {
            challengeMode = GameServerProto.PT_ARENA_CHALLENGE_USE_COUNT;
        } else if (GlobalVar.me().bagData.getItemCountById(GameServerProto.PT_ITEMID_ARENA_CHALLENGE_TICKET) > 0) {
            challengeMode = GameServerProto.PT_ARENA_CHALLENGE_USE_TICKET;
        } else if (!isSerial) {
            this._leftSaoDangCount = 0;
            this._getPoint = 0;
            CommonWnd.showArenaGetFreeTicketWnd();
            return;
        }

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
        clearTimeout(this.timeoutId);
        //BattleManager.getInstance().quitOutSide();
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
                nCount: getPoint,
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