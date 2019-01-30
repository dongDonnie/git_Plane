
const RootBase = require("RootBase");
const WindowManager = require("windowmgr");
const GlobalVar = require('globalvar')
const WndTypeDefine = require("wndtypedefine");
const GameServerProto = require("GameServerProto");
const i18n = require('LanguageData');
const EventMsgID = require("eventmsgid");
const CommonWnd = require("CommonWnd");
const TAB_REWARD = 1, TAB_RULE = 0;

cc.Class({
    extends: RootBase,

    properties: {
        labelMyRank: {
            default: null,
            type: cc.Label,
        },
        labelWinRate: {
            default: null,
            type: cc.Label,
        },
        labelWinRound: {
            default: null,
            type: cc.Label,
        },
        labelCurReward: {
            default: null,
            type: cc.Label,
        },
        labelNextReward: {
            default: null,
            type: cc.Label,
        },
        labelRewardTip: {
            default: null,
            type: cc.Label,
        },
        nodeTabs: {
            default: null,
            type: cc.Node,
        },
        nodeRuleModel: {
            default: null,
            type: cc.Node,
        },
        nodeRewardModel: {
            default: null,
            type: cc.Node,
        },
        nodeRule: {
            default: null,
            type: cc.Node,
        },
        nodeReward: {
            default: null,
            type: cc.Node,
        },
        itemPrefabs: {
            default: null,
            type: cc.Prefab,
        },
        ruleScroll: {
            default: null,
            type: cc.ScrollView,
        },
        rewardScroll: {
            default: null,
            type: cc.ScrollView,
        },
        nodeCurReward: {
            default: null,
            type: cc.Node,
        },
        nodeNextReward: {
            default: null,
            type: cc.Node,
        },
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_ARENA_REWARD_WND;
        this.animeStartParam(0, 0);
        this.curIndex = 0;
        this.ruleInitComplete = false;
        // this.reportScorll.loopScroll.releaseViewItems();
    },

    start: function () {
        // this.initArenaRewardWnd();
    },

    animeStartParam(paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;
        if (paramOpacity == 0 || paramOpacity == 255){
            this.node.getChildByName("nodeTabs").active = false;
        }
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            GlobalVar.eventManager().removeListenerWithTarget(this);
            WindowManager.getInstance().popView(false, null, false, false);
        } else if (name == "Enter") {
            this._super("Enter");
            this.registerEvent();
            this.node.getChildByName("nodeTabs").active = true;
            this.initLoopScroll();
        }
    },

    registerEvent: function () {
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_ARENA_DAY_REWARD_DATA, this.getArenaDayRewardData, this);
    },

    initLoopScroll: function () {
        let self = this;
        if (this.curIndex == TAB_REWARD) {
            let rewardRankData = GlobalVar.me().arenaData.arenaOpenData.RankingHistories;
            let dayRewardGetFlags = GlobalVar.me().arenaData.arenaOpenData.DayRewardGetFlags;
            let sortData = this.srotRewardData(rewardRankData, dayRewardGetFlags);
            if (sortData.length == 0){
                this.labelRewardTip.node.active = true;
                return;
            }
            this.labelRewardTip.node.active = false;

            this.rewardScroll.loopScroll.setTotalNum(sortData.length);
            this.rewardScroll.loopScroll.setCreateModel(this.nodeRewardModel);
            this.rewardScroll.loopScroll.saveCreatedModel(this.rewardScroll.content.children);
            this.rewardScroll.loopScroll.registerUpdateItemFunc(function (model, index) {
                self.updateRewardModel(model, sortData[index], dayRewardGetFlags[index]);
                model.getChildByName("btnRecv").getComponent(cc.Button).clickEvents[0].customEventData = (index + 1) + "." + sortData[index];
            });
            this.rewardScroll.loopScroll.resetView();
            this.rewardScroll.scrollToTop();
        } else if (this.curIndex == TAB_RULE && !this.ruleInitComplete) {
            let rewardData = GlobalVar.tblApi.getData('TblArenaReward');
            let arrData = [];
            for (let i in rewardData) {
                arrData.push(rewardData[i]);
            }

            this.ruleScroll.loopScroll.setTotalNum(arrData.length);
            this.ruleScroll.loopScroll.setCreateModel(this.nodeRuleModel);
            this.rewardScroll.loopScroll.saveCreatedModel(this.rewardScroll.content.children);
            this.ruleScroll.loopScroll.registerUpdateItemFunc(function (model, index) {
                self.updateRuleModel(model, arrData[index]);
            });
            this.ruleScroll.loopScroll.resetView();
            this.ruleScroll.scrollToTop();
            this.ruleInitComplete = true;
        }
    },

    srotRewardData: function (rewardRankData, dayRewardGetFlags) {
        let arr = [];
        for (let i in rewardRankData) {
            if (dayRewardGetFlags[i] != 2) {
                arr.push(rewardRankData[i]);
            }
        }
        return arr;
    },

    updateRewardModel: function (model, rank, dayFlags) {
        model.getChildByName("labelRankInterval").getComponent(cc.Label).string = i18n.t('label.4001017').replace("%rank", rank);
        if (dayFlags == 0) {
            model.getChildByName("btnRecv").active = true;
            model.getChildByName("spriteAlreadyGet").active = false;
        } else if (dayFlags == 1) {
            model.getChildByName("btnRecv").active = false;
            model.getChildByName("spriteAlreadyGet").active = true;
        } else {
            console.log("代码逻辑错误！");
        }

        let rewardData = GlobalVar.tblApi.getData('TblArenaReward');
        let curIntervalReward = null;
        for (let i in rewardData) {
            if (rank >= rewardData[i].dwMinRank && rank <= rewardData[i].dwMaxRank) {
                curIntervalReward = rewardData[i].oVecDayReward;
            }
        }
        let layout = model.getChildByName("nodeRewardList");
        for (let i = 0; i < curIntervalReward.length; i++) {
            let itemObj = null;
            if (!layout.children[i]) {
                itemObj = cc.instantiate(this.itemPrefabs);
                layout.addChild(itemObj);
            } else {
                itemObj = layout.children[i];
                itemObj.active = true;
            }
            if (itemObj) {
                itemObj.getComponent("ItemObject").updateItem(curIntervalReward[i].wItemID, curIntervalReward[i].nCount);
                itemObj.getComponent("ItemObject").setClick(true, 2);
            }
        }
        for (let i = curIntervalReward.length; i < layout.childCount; i++) {
            if (layout.children[i]) {
                layout.children[i].active = false;
            }
        }
    },

    updateRuleModel: function (model, data) {
        model.getChildByName("spriteRank").active = false;
        model.getChildByName("labelRankInterval").active = true;
        if (data.dwMaxRank == data.dwMinRank) {
            if (data.dwMaxRank >= 1 && data.dwMaxRank <= 3) {
                model.getChildByName("spriteRank").active = true;
                model.getChildByName("labelRankInterval").active = false;
                model.getChildByName("spriteRank").getComponent("RemoteSprite").setFrame(data.dwMaxRank - 1);
            } else {
                model.getChildByName("labelRankInterval").getComponent(cc.Label).string = i18n.t('label.4001018').replace("%rank", data.dwMaxRank);
            }
        } else {
            if (data.byID == GlobalVar.tblApi.getLength('TblArenaReward')) {
                model.getChildByName("labelRankInterval").getComponent(cc.Label).string = i18n.t('label.4001020').replace("%minRank", data.dwMinRank);
            } else {
                model.getChildByName("labelRankInterval").getComponent(cc.Label).string = i18n.t('label.4001019').replace("%minRank", data.dwMinRank).replace("%maxRank", data.dwMaxRank);
            }
        }

        let curIntervalReward = data.oVecDayReward;
        let layout = model.getChildByName("nodeRewardList");
        for (let i = 0; i < curIntervalReward.length; i++) {
            let itemObj = null;
            if (!layout.children[i]) {
                itemObj = cc.instantiate(this.itemPrefabs);
                layout.addChild(itemObj);
            } else {
                itemObj = layout.children[i];
                itemObj.active = true;
            }
            if (itemObj) {
                itemObj.getComponent("ItemObject").updateItem(curIntervalReward[i].wItemID, curIntervalReward[i].nCount);
                itemObj.getComponent("ItemObject").setClick(true, 2);
            }
        }
        for (let i = curIntervalReward.length; i < layout.childCount; i++) {
            if (layout.children[i]) {
                layout.children[i].active = false;
            }
        }
    },

    initArenaRewardWnd: function () {
        let myRank = GlobalVar.me().arenaData.getPlayerRanking();
        this.labelMyRank.string = myRank;
        let totalWin = GlobalVar.me().arenaData.arenaOpenData.TotalWin;
        let totalLose = GlobalVar.me().arenaData.arenaOpenData.TotalLose;
        if (totalLose + totalWin == 0){
            this.labelWinRate.string = "0%";
        }else{
            this.labelWinRate.string = parseInt(100 * totalWin / (totalLose + totalWin)) + "%";
        }
        this.labelWinRound.string = totalWin + "/" + totalLose;

        if (this.curIndex == TAB_REWARD) {
            this.nodeReward.active = true;
            this.nodeRule.active = false;
        } else if (this.curIndex == TAB_RULE) {
            this.nodeReward.active = false;
            this.nodeRule.active = true;

            // if (!this.ruleInitComplete) {
                let curIntervalReward = null, nextIntervalReward = null;
                let nextIntervalMinRank = 0;
                let rewardData = GlobalVar.tblApi.getData('TblArenaReward');
                for (let i in rewardData) {
                    if (myRank >= rewardData[i].dwMinRank && myRank <= rewardData[i].dwMaxRank) {
                        curIntervalReward = rewardData[i].oVecDayReward;
                        break;
                    }
                    nextIntervalReward = rewardData[i].oVecDayReward;
                    nextIntervalMinRank = rewardData[i].dwMinRank;
                }

                let widthLimit = 240;
                if (!nextIntervalReward) {
                    this.labelNextReward.node.active = false;
                    this.nodeNextReward.active = false;
                    this.nodeCurReward.x = -70;
                    this.labelCurReward.node.x = 0;
                    widthLimit *= 2;
                } else {
                    this.labelNextReward.node.active = true;
                    this.nodeNextReward.active = true;
                    this.labelCurReward.node.x = -248;
                    this.nodeCurReward.x = -140;
                    this.labelNextReward.string = i18n.t('label.4001021').replace("%gap", myRank - nextIntervalMinRank);
                }

                for (let i = 0; i < curIntervalReward.length; i++) {
                    let itemObj = null;
                    if (!this.nodeCurReward.children[i]) {
                        itemObj = cc.instantiate(this.itemPrefabs);
                        this.nodeCurReward.addChild(itemObj);
                    } else {
                        itemObj = this.nodeCurReward.children[i];
                        itemObj.active = true;
                    }
                    if (itemObj) {
                        itemObj.getComponent("ItemObject").updateItem(curIntervalReward[i].wItemID, curIntervalReward[i].nCount);
                        itemObj.getComponent("ItemObject").setClick(true, 2);
                    }
                }
                for (let i = curIntervalReward.length; i < this.nodeCurReward.childCount; i++) {
                    if (this.nodeCurReward.children[i]) {
                        this.nodeCurReward.children[i].active = false;
                    }
                }

                if (nextIntervalReward){
                    for (let i = 0; i < nextIntervalReward.length; i++) {
                        let itemObj = null;
                        if (!this.nodeNextReward.children[i]) {
                            itemObj = cc.instantiate(this.itemPrefabs);
                            this.nodeNextReward.addChild(itemObj);
                        } else {
                            itemObj = this.nodeNextReward.children[i];
                            itemObj.active = true;
                        }
                        if (itemObj) {
                            itemObj.getComponent("ItemObject").updateItem(nextIntervalReward[i].wItemID, nextIntervalReward[i].nCount);
                            itemObj.getComponent("ItemObject").setClick(true, 2);
                        }
                    }
                    for (let i = curIntervalReward.length; i < this.nodeNextReward.childCount; i++) {
                        if (this.nodeNextReward.children[i]) {
                            this.nodeNextReward.children[i].active = false;
                        }
                    }
                }

                this.nodeCurReward.getComponent(cc.Layout).updateLayout();
                this.nodeNextReward.getComponent(cc.Layout).updateLayout();
                if (this.nodeCurReward.width > widthLimit){
                    this.nodeCurReward.scale = widthLimit/this.nodeCurReward.width;
                }else{
                    this.nodeCurReward.scale = 1;
                }
                if (this.nodeNextReward.width > widthLimit){
                    this.nodeNextReward.scale = widthLimit/this.nodeNextReward.width;
                }else{
                    this.nodeNextReward.scale = 1;
                }
            // }
        }
    },

    clickTab: function (event, index) {
        if (this.curIndex == index) {
            return;
        }
        this.setTabsColor(index);
        this.initArenaRewardWnd();
        this.initLoopScroll();
    },

    setTabsColor: function (index) {
        if (index == undefined || index < 0 || index >= this.nodeTabs.length) {
            index = this.curIndex;
        }
        this.curIndex = index;
        for (let i = 0; i < this.nodeTabs.childrenCount; i++) {
            if (index == i) {
                this.nodeTabs.children[i].getComponent("RemoteSprite").setFrame(1);
            } else {
                this.nodeTabs.children[i].getComponent("RemoteSprite").setFrame(0);
            }
        }
    },

    onRecvBtnClick: function (event, customEventData) {
        let arr = customEventData.split('.');
        let day = arr[0];
        let rank = arr[1];
        GlobalVar.handlerManager().arenaHandler.sendArenaDayRewardReq(day, rank);
    },

    getArenaDayRewardData: function (event) {
        if (event.ErrCode != GameServerProto.PTERR_SUCCESS){
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        this.initLoopScroll();
        CommonWnd.showTreasureExploit(event.OK.RewardItem);
    },

    enter: function (isRefresh) {
        if (isRefresh) {
            this._super(true);
            this.setTabsColor(TAB_REWARD);
            this.initArenaRewardWnd();
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

    close: function () {
        this.rewardScroll.loopScroll.releaseViewItems();
        // this.ruleScroll.loopScroll.releaseViewItems();
        this.nodeRule.active = false;
        // this.ruleInitComplete = false;
        this._super();
    },

});
