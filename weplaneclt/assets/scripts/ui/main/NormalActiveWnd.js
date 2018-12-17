
const RootBase = require("RootBase");
const WindowManager = require("windowmgr");
const GlobalVar = require('globalvar')
const WndTypeDefine = require("wndtypedefine");
const EventMsgID = require("eventmsgid");
const GameServerProto = require("GameServerProto");
const i18n = require('LanguageData');
const CommonWnd = require("CommonWnd");
const RemoteSprite = require("RemoteSprite");
const ResMapping = require("resmapping");
const StoreageData = require("storagedata");
const weChatAPI = require("weChatAPI");
const INIT_COUNT = 5;

var self = null;
cc.Class({
    extends: RootBase,

    properties: {
        activeList: {
            default: null,
            visible: false,
        },
        activeTabModel: {
            default: null,
            type: cc.Node,
        },
        curActiveIndex: {
            default: 0,
            visible: false,
        },
        activeContents: {
            default: [],
            type: [cc.Node],
        },
        itemPrefab: {
            default: null,
            type: cc.Prefab,
        },
    },

    onLoad: function () {
        this._super();
        i18n.init('zh');
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_ACTIVE_WND;
        this.animeStartParam(0, 0);
        this.curActiveIndex = 0;
        this.activeTabs = [];
        this.canClickTab = false;
        this.contentIndex = 0;
        this.isFirstIn = true;
    },

    animeStartParam: function (paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;
    },

    animePlayCallBack: function (name) {
        if (name == "Escape") {
            this._super("Escape");
            GlobalVar.eventManager().removeListenerWithTarget(this);
            WindowManager.getInstance().popView(false, null, false, false);
        } else if (name == "Enter") {
            this._super("Enter");
            this.registerEvent();
            this.initActiveWnd();
        }
    },

    registerEvent: function () {
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GETACTIVE_DATA, this.recvGetDataMsg, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_ACTIVE_ACT_FLAG_CHANGE, this.recvActiveFlagChange, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_ACTIVE_FEN_RESULT, this.recvActiveFenResult, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_ACTIVE_JOIN_RESULT, this.recvActiveJoinResult, this);
    },

    initActiveWnd: function () {
        this.activeTabScroll = this.node.getChildByName("scrollActiveTab").getComponent(cc.ScrollView);
        this.activeTabScroll.node.active = true;
        if (this.isFirstIn) {
            this.curActiveIndex = 0;
            this.contentIndex = 0;
            this.activeTabs = [];
            // this.isFirstIn = false;
            this.activeList = GlobalVar.me().activeData.getActiveListDataByType(GameServerProto.PT_AMS_ACT_TYPE_NORMAL);
            this.activeTabContent = this.activeTabScroll.content;
            this.activeTabContent.removeAllChildren();
            if (this.activeList.length != 0) {
                this.addActiveTab(0);
            }
            this.activeTabContent.getComponent(cc.Layout).updateLayout();
        } else {
            this.activeTabScroll.scrollToLeft();
            this.curActiveIndex = 0;
            this.contentIndex = 0;
            this.activeTabs = [];
            for (let i = 0; i < this.activeTabs.length; i++) {
                if (this.curActiveIndex == i) {
                    this.activeTabs[i].getChildByName("spriteBg").getChildByName("spriteSelectBorder").active = true;
                } else {
                    this.activeTabs[i].getChildByName("spriteBg").getChildByName("spriteSelectBorder").active = false;
                }
            }
            this.refreshActiveInfo();
        }
    },

    addActiveTab: function (index) {
        let data = this.activeList[index];
        if (data) {
            let activeTab = cc.instantiate(this.activeTabModel);
            this.updateActiveTab(activeTab, data);
            this.activeTabContent.addChild(activeTab);
            this.activeTabContent.getComponent(cc.Layout).updateLayout();
            activeTab.getChildByName("spriteBg").getComponent(cc.Button).clickEvents[0].customEventData = index;
            this.activeTabs.push(activeTab);
            if (index == 0) {
                activeTab.getChildByName("spriteBg").getChildByName("spriteSelectBorder").active = true;
            } else {
                activeTab.getChildByName("spriteBg").getChildByName("spriteSelectBorder").active = false;
            }
            // activeTab.setScale(0);
            let self = this;
            // activeTab.runAction(cc.sequence(cc.spawn(cc.scaleTo(0.05, 1), cc.fadeIn(0.05)), cc.callFunc(() => {
            self.addActiveTab(index + 1);

            let path = "cdnRes/active/" + data.NameImg;
            GlobalVar.resManager().loadRes(ResMapping.ResType.SpriteFrame, path, function (frame) {
                activeTab.getChildByName("spriteBg").getComponent("RemoteSprite").spriteFrame = frame;
            });
            // })))
        } else {
            this.refreshActiveInfo();
        }
    },

    updateActiveTab: function (activeTab, data) {
        activeTab.data = data;
        activeTab.getChildByName("spriteTextBg").getChildByName("labelName").getComponent(cc.Label).string = data.Name;
        activeTab.getChildByName("spriteHot").active = !!data.StatFlag;
    },
    onAcitveTabClick: function (event, index) {
        if (!this.canClickTab) {
            return;
        }
        if (this.curActiveIndex == index) {
            return;
        }
        this.canClickTab = false;
        for (let i = 0; i < this.activeTabs.length; i++) {
            if (index == i) {
                this.activeTabs[i].getChildByName("spriteBg").getChildByName("spriteSelectBorder").active = true;
            } else {
                this.activeTabs[i].getChildByName("spriteBg").getChildByName("spriteSelectBorder").active = false;
            }
        }
        this.refreshActiveInfo(index);
    },

    refreshActiveInfo: function (index) {
        index = typeof index !== 'undefined' ? index : this.curActiveIndex;
        this.curActiveIndex = index;
        let data = GlobalVar.me().activeData.getActiveDataByActID(this.activeList[index].Actid);

        if (!data) {
            // console.log("can not find data, request the data whitch actid = ", this.activeList[index].Actid);
            GlobalVar.handlerManager().activeHandler.sendGetActiveDataReq(this.activeList[index].Actid);
            return;
        } else {
            // console.log("I get the data！", data);
            let nodeActiveInfo = this.node.getChildByName("nodeActiveContent").getChildByName("nodeActiveInfo")
            nodeActiveInfo.getChildByName("labelActiveDesc").getComponent(cc.Label).string = data.Act.Desc;
            nodeActiveInfo.getChildByName("labelStartTime").getComponent(cc.Label).string = GlobalVar.serverTime.getTimeStringForActive(data.Act.StartTime * 1000);
            nodeActiveInfo.getChildByName("labelEndTime").getComponent(cc.Label).string = GlobalVar.serverTime.getTimeStringForActive(data.Act.EndTime * 1000);
            // nodeActiveInfo.setScale(0);
            nodeActiveInfo.opacity = 255;
            nodeActiveInfo.active = true;
            let self = this;
            // nodeActiveInfo.runAction(cc.sequence(cc.scaleTo(0.15, 1.1), cc.scaleTo(0.05, 1), cc.callFunc(() => {
            self.refreshActiveContent(data);
            // })));
        }
    },

    refreshActiveContent: function (data) {

        if (this.contentIndex != 0) {
            let self = this;
            let index = self.contentIndex - 1
            // this.activeContents[this.contentIndex - 1].runAction(cc.sequence(cc.scaleTo(0.05, 1.1), cc.scaleTo(0.15, 0), cc.callFunc(() => {
            self.activeContents[index].active = false;
            self["clearContentType" + self.contentIndex]();
            self.contentIndex = 0;
            self.refreshActiveContent(data);
            // })));
            return;
        }

        // lottery抽奖  //seLott必得可得 //fen 兑换、free为领取
        if (data.Act.OpCfg.Op == "lottery") {
            this.contentIndex = 3;
        } else if (data.Act.OpCfg.Op == "seLott") {
            this.contentIndex = 4;
        } else if (data.Act.OpCfg.Op == "fen") {
            if (data.Act.Cost == GameServerProto.PT_AMS_ACT_COST_FREE) {
                this.contentIndex = 2;
            } else {
                this.contentIndex = 1;
            }
        } else if (data.Act.OpCfg.Op == "send") {
            this.canClickTab = true;
        } else {
            this.canClickTab = true;
        }

        if (this.contentIndex != 0) {
            let self = this;
            this.activeContents[this.contentIndex - 1].active = true;
            // this.activeContents[this.contentIndex - 1].runAction(cc.sequence(cc.scaleTo(0.1, 1.1), cc.scaleTo(0.05, 1), cc.callFunc(() => {
            self["refreshContentType" + self.contentIndex](data);
            // })));
        }
    },
    //初始化Type1的活动窗口
    refreshContentType1: function (data) {
        let nodeActiveContent = this.node.getChildByName("nodeActiveContent");
        let nodeContent = nodeActiveContent.getChildByName("nodeType1");

        let updateModel = function (model, index) {
            // model.active = true;
            model.x = 0;
            let fenCfg = data.Act.OpCfg.FenCfg[index];
            let costCfg = data.Act.CostCfg[index];
            let joinData = null;
            for (let i = 0; i < data.Join.length; i++) {
                if (data.Join[i].ID == index) {
                    joinData = data.Join[i];
                }
            }
            let nodeItemEqualNeed = model.getChildByName("nodeItemEqualNeed");
            let nodeItemEqualGet = model.getChildByName("nodeItemEqualGet");
            nodeItemEqualNeed.getComponent("ItemObject").updateItem(costCfg.Items[0].ItemID, costCfg.Items[0].Count);
            nodeItemEqualNeed.getComponent("ItemObject").setClick(true, 2);
            nodeItemEqualGet.getComponent("ItemObject").updateItem(fenCfg.Items[0].ItemID, fenCfg.Items[0].Count);
            nodeItemEqualGet.getComponent("ItemObject").setClick(true, 2);
            let joinTimes = 0;
            if (joinData && joinData.Join) {
                joinTimes = joinData.Join;
            }
            let limitTimes = fenCfg.LimitNum || data.Act.LimitNum
            model.getChildByName("labelLeftTimes").getComponent(cc.Label).string = "今日还可兑换%d次".replace("%d", limitTimes - joinTimes);
            if (limitTimes - joinTimes <= 0) {
                model.getChildByName("btnExchange").getComponent(cc.Button).interactable = false;
            } else {
                model.getChildByName("btnExchange").getComponent(cc.Button).interactable = true;
            }
            model.data = {
                actid: data.Act.Actid,
                id: index,
                num: 1,
            }
        };


        let self = this;
        let scrollview = nodeContent.getChildByName("scrollContent").getComponent(cc.ScrollView);
        let nodeModel = nodeContent.getChildByName("nodeModel");
        let content = scrollview.content;
        let dataLength = data.Act.OpCfg.FenCfg.length;
        scrollview.loopScroll.setTotalNum(dataLength);
        scrollview.loopScroll.setCreateInterval(0);
        scrollview.loopScroll.setCreateModel(nodeModel);
        scrollview.loopScroll.saveCreatedModel(content.children);
        scrollview.loopScroll.registerUpdateItemFunc(function (daily, index) {
            updateModel(daily, index);
        });
        scrollview.loopScroll.registerCompleteFunc(function () {
            self.canClickTab = true;
        })
        scrollview.loopScroll.resetView();
        // scrollview.node.y = scrollview.node.y - 200;
        // scrollview.node.runAction(cc.sequence(cc.moveBy(0.15, 0, 220), cc.moveBy(0.1, 0 , -20)));
    },
    //清理Type1的活动窗口
    clearContentType1: function () {
        let nodeActiveContent = this.node.getChildByName("nodeActiveContent");
        let nodeContent = nodeActiveContent.getChildByName("nodeType1");
        let scrollview = nodeContent.getChildByName("scrollContent").getComponent(cc.ScrollView);
        scrollview.loopScroll.releaseViewItems();
        let content = scrollview.content;
        content.getComponent(cc.Widget).updateAlignment();
    },
    //初始化Type2的活动窗口
    refreshContentType2: function (data) {
        let nodeActiveContent = this.node.getChildByName("nodeActiveContent");
        let nodeContent = nodeActiveContent.getChildByName("nodeType2");

        let updateModel = function (model, index) {
            // model.active = true;
            model.opacity = 255;
            model.x = 0;
            let modelData = data.Act.OpCfg.FenCfg[index];
            let ruleCfg = data.Act.RuleCfg[index];
            let joinData = null;
            for (let i = 0; i < data.Join.length; i++) {
                if (data.Join[i].ID == index) {
                    joinData = data.Join[i];
                }
            }

            // let joinData = data.Join[index];
            let nodeRewards = model.getChildByName("nodeRewards");

            let labelRequire = model.getChildByName("labelRequire");
            let requireData = GlobalVar.tblApi.getDataBySingleKey('TblAMSRule', ruleCfg.RuleList[0].RuleID);
            let requireStr = requireData.strRuleName.replace("{0}", ruleCfg.RuleList[0].Compare.replace(">=", "达到").replace("==", "").replace("<=", "小于") + ruleCfg.RuleList[0].Var);
            labelRequire.getComponent(cc.Label).string = requireStr;

            model.getChildByName("btnRecv").active = true;
            if (joinData && joinData.Join >= (modelData.LimitNum || data.Act.LimitNum)) {
                let btnRecv = model.getChildByName("btnRecv");
                btnRecv.getComponent("ButtonObject").setText("已参与");
                btnRecv.getComponent(cc.Button).interactable = false;
            } else {
                let btnRecv = model.getChildByName("btnRecv");
                btnRecv.getComponent("ButtonObject").setText("领取");
                btnRecv.getComponent(cc.Button).interactable = true;
            }

            let itemModel = nodeRewards.getChildByName("nodeItem");
            nodeRewards.removeAllChildren();
            for (let i = 0; i < modelData.Items.length; i++) {
                let item = cc.instantiate(itemModel);
                item.active = true;
                item.getComponent("ItemObject").updateItem(modelData.Items[i].ItemID, modelData.Items[i].Count);
                item.getComponent("ItemObject").setClick(true, 2);
                nodeRewards.addChild(item);
            }
            nodeRewards.getComponent(cc.Layout).updateLayout();

            model.data = {
                actid: data.Act.Actid,
                id: index,
                num: 1,
            }
        };


        let self = this;
        let scrollview = nodeContent.getChildByName("scrollContent").getComponent(cc.ScrollView);
        let nodeModel = nodeContent.getChildByName("nodeModel");
        let content = scrollview.content
        let dataLength = data.Act.OpCfg.FenCfg.length;
        scrollview.loopScroll.setTotalNum(dataLength);
        scrollview.loopScroll.setCreateInterval(0);
        scrollview.loopScroll.setCreateModel(nodeModel);
        scrollview.loopScroll.saveCreatedModel(content.children);
        scrollview.loopScroll.registerUpdateItemFunc(function (daily, index) {
            updateModel(daily, index);
        });
        scrollview.loopScroll.registerCompleteFunc(function () {
            self.canClickTab = true;
        })
        scrollview.loopScroll.resetView();
        // scrollview.node.y = scrollview.node.y - 200;
        // scrollview.node.runAction(cc.sequence(cc.moveBy(0.15, 0, 220), cc.moveBy(0.1, 0 , -20)));
    },
    //清理Type2的活动窗口
    clearContentType2: function () {
        let nodeActiveContent = this.node.getChildByName("nodeActiveContent");
        let nodeContent = nodeActiveContent.getChildByName("nodeType2");
        let scrollview = nodeContent.getChildByName("scrollContent").getComponent(cc.ScrollView);
        scrollview.loopScroll.releaseViewItems();
        let content = scrollview.content;
        content.getComponent(cc.Widget).updateAlignment();
    },
    //初始化Type3的活动窗口 //环形抽奖界面
    refreshContentType3: function (data) {
        let nodeActiveContent = this.node.getChildByName("nodeActiveContent");
        let nodeContent = nodeActiveContent.getChildByName("nodeType3");
        let nodeReawrds = nodeContent.getChildByName("nodeRewards");
        let nodeBtn = nodeContent.getChildByName("nodeBtn");
        let nodeInvite = nodeContent.getChildByName("nodeInvite");
        let opCfg = data.Act.OpCfg;
        let itemProbs = opCfg.ItemProbs;
        let ruleCfg = data.Act.RuleCfg;
        let curJoinTime = 0
        curJoinTime = data.Join[0] ? data.Join[0].Join : 0;
        let isInvite = false, isShare = false, isAD = false, isShareComplete = false, isFree = false;

        //判断是不是分享或邀请活动
        let rule = ruleCfg[0].RuleList[0];
        nodeBtn.getChildByName("labelShare").active = false;
        if (rule) {
            if (rule.RuleID == GameServerProto.PT_AMS_RULEID_INVITE) {
                isInvite = true;
                nodeReawrds.children[4] && (nodeReawrds.children[4].y = 53);
                nodeReawrds.children[5] && (nodeReawrds.children[5].y = -79);
                nodeReawrds.children[6] && (nodeReawrds.children[6].y = -79);
                nodeReawrds.children[7] && (nodeReawrds.children[7].y = -79);
                nodeReawrds.children[8] && (nodeReawrds.children[8].y = -79);
                nodeReawrds.children[9] && (nodeReawrds.children[9].y = 53);
                nodeBtn.y = 41;
                nodeInvite.active = true;
            } else {
                nodeInvite.active = false;
                nodeReawrds.children[4] && (nodeReawrds.children[4].y = 13);
                nodeReawrds.children[5] && (nodeReawrds.children[5].y = -158);
                nodeReawrds.children[6] && (nodeReawrds.children[6].y = -158);
                nodeReawrds.children[7] && (nodeReawrds.children[7].y = -158);
                nodeReawrds.children[8] && (nodeReawrds.children[8].y = -158);
                nodeReawrds.children[9] && (nodeReawrds.children[9].y = 13);
                nodeBtn.y = 0;

                if (rule.RuleID == GameServerProto.PT_AMS_RULEID_SHARE) {
                    isShare = true;
                    nodeBtn.getChildByName("labelShare").active = true;

                    let curStep = StoreageData.getShareTimesWithKey(data.Act.Actid, data.Act.Limit, data.Act.EndTime);
                    curStep = curStep > rule.Var * (curJoinTime + 1) ? rule.Var * (curJoinTime + 1): curStep;
                    // curStep = curStep > data.Act.LimitNum ? data.Act.LimitNum : curStep;
                    console.log("curStep:", curStep, "  rule.Var:", rule.Var, "  curJoinTime:", curJoinTime);
                    // if (curStep == rule.Var * (curJoinTime + 1)) {
                    if (curStep >= rule.Var * (curJoinTime + 1)) {
                        isShareComplete = true;
                    }

                    let str = i18n.t('label.4000307');
                    // str = str.replace("%max", rule.Var * (curJoinTime + 1));
                    str = str.replace("%max", data.Act.LimitNum * rule.Var);
                    str = str.replace("%cur", curStep);
                    nodeBtn.getChildByName("labelShare").getComponent(cc.Label).string = str;
                    nodeBtn.getChildByName("labelShare").active = (rule.Var > 1)
                } else if (rule.RuleID == GameServerProto.PT_AMS_RULEID_AD) {
                    isAD = true;
                } else {

                }
            }
        }

        // 抽奖消耗
        let nodeCost = nodeBtn.getChildByName("nodeCost");
        if (data.Act.Cost == GameServerProto.PT_AMS_ACT_COST_FREE || isInvite) {
            nodeCost.active = false;
            isFree = true;
        } else {
            nodeCost.active = true;
            let costItem = data.Act.CostCfg[0].Items[0];
            if (costItem.ItemID == 3) {
                nodeCost.getChildByName("spriteCostIcon").getComponent("RemoteSprite").setFrame(0);
            } else if (costItem.ItemID == 2 || costItem.ItemID == 1) {
                nodeCost.getChildByName("spriteCostIcon").getComponent("RemoteSprite").setFrame(1);
            }

            if (costItem.ItemID == 2) {
                nodeCost.getChildByName("labelCost").getComponent(cc.Label).string = costItem.Count * 10000;
            } else {
                nodeCost.getChildByName("labelCost").getComponent(cc.Label).string = costItem.Count;
            }
        } 

        // 抽奖提示
        if (data.Join[0] && data.Join[0].Join >= data.Act.LimitNum) {
            nodeBtn.getChildByName("btnPurchase").getComponent(cc.Button).interactable = false
            nodeBtn.getChildByName("btnPurchase").getComponent("ButtonObject").setText("已参与")
        } else {
            nodeBtn.getChildByName("btnPurchase").getComponent(cc.Button).interactable = true
            let btnText = "购 买";
            (isFree || isShareComplete) && (btnText = "抽 奖");
            isShare && !isShareComplete && (btnText = "分享到群");
            isAD && (btnText = "  观看视频");
            nodeBtn.getChildByName("btnPurchase").getComponent("ButtonObject").setText(btnText);
        }
        nodeBtn.getChildByName("labelJoin").getComponent(cc.Label).string = i18n.t('label.4000401').replace("%d", data.Act.LimitNum - curJoinTime);
        // nodeBtn.setScale(0);
        // nodeBtn.runAction(cc.sequence(cc.scaleTo(0.15, 1.1), cc.scaleTo(0.05, 1)));


        // 添加物品展示
        let self = this;
        let addItem = function (index) {
            let item = nodeReawrds.getChildByName("ItemObject" + (index + 1));
            if (!itemProbs[index]) {
                nodeBtn.active = true;
                self.canClickTab = true;
                return;
            }
            item.getComponent("ItemObject").updateItem(itemProbs[index].ItemID, itemProbs[index].Count);
            item.getComponent("ItemObject").setClick(true, 2);
            // item.setScale(0);
            item.active = true;
            // item.runAction(cc.sequence(cc.scaleTo(0.05, 1.1), cc.scaleTo(0.02, 1), cc.callFunc(() => {
            addItem(index + 1);
            // })));
        }

        addItem(0);

    },
    //清理Type3的活动窗口
    clearContentType3: function () {
        let nodeActiveContent = this.node.getChildByName("nodeActiveContent");
        let nodeContent = nodeActiveContent.getChildByName("nodeType3");
        let nodeReawrds = nodeContent.getChildByName("nodeRewards");
        for (let i = 1; i <= 10; i++) {
            let item = nodeReawrds.getChildByName("ItemObject" + i);
            if (item) {
                item.active = false;
            }
        }
        nodeContent.getChildByName("nodeBtn").active = false;
    },
    //初始化Type4的活动窗口 //必得可得抽奖界面
    refreshContentType4: function (data) {
        // console.log("refreshType4 data: ", data);
        let nodeActiveContent = this.node.getChildByName("nodeActiveContent");
        let nodeContent = nodeActiveContent.getChildByName("nodeType4");
        let nodeBuy = nodeContent.getChildByName("nodeBuy");
        let ruleCfg = data.Act.RuleCfg;
        let curJoinTime = 0
        curJoinTime = data.Join[0] ? data.Join[0].Join : 0;
        let isInvite = false, isShare = false, isAD = false, isShareComplete = false, isFree = false;

        //判断是不是分享或邀请活动
        let rule = ruleCfg[0].RuleList[0];
        nodeBuy.getChildByName("labelShare").active = false;
        if (rule) {
            if (rule.RuleID == GameServerProto.PT_AMS_RULEID_INVITE) {
                isInvite = true;
            } else {
                if (rule.RuleID == GameServerProto.PT_AMS_RULEID_SHARE) {
                    isShare = true;
                    nodeBuy.getChildByName("labelShare").active = true;

                    let curStep = StoreageData.getShareTimesWithKey(data.Act.Actid, data.Act.Limit, data.Act.EndTime);
                    curStep = curStep > rule.Var * (curJoinTime + 1) ? rule.Var * (curJoinTime + 1) : curStep;
                    console.log("curStep:", curStep, "  rule.Var:", rule.Var, "  curJoinTime:", curJoinTime);
                    if (curStep >= rule.Var * (curJoinTime + 1)) {
                        isShareComplete = true;
                    }
                    let str = i18n.t('label.4000307');
                    // str = str.replace("%max", rule.Var * (curJoinTime + 1));
                    str = str.replace("%max", data.Act.LimitNum * rule.Var);
                    str = str.replace("%cur", curStep);
                    nodeBuy.getChildByName("labelShare").getComponent(cc.Label).string = str;
                    nodeBuy.getChildByName("labelShare").active = (rule.Var > 1)
                } else if (rule.RuleID == GameServerProto.PT_AMS_RULEID_AD) {
                    isAD = true;
                }
            }
        }

        // 抽奖消耗
        let nodeCost = nodeBuy.getChildByName("nodeCost");
        if (data.Act.Cost == GameServerProto.PT_AMS_ACT_COST_FREE) {
            nodeCost.active = false;
            isFree = true;
        } else {
            nodeCost.active = true;
            let costItem = data.Act.CostCfg[0].Items[0];
            if (costItem.ItemID == 3) {
                nodeCost.getChildByName("spriteCostIcon").getComponent("RemoteSprite").setFrame(0);
            } else if (costItem.ItemID == 2 || costItem.ItemID == 1) {
                nodeCost.getChildByName("spriteCostIcon").getComponent("RemoteSprite").setFrame(1);
            }

            if (costItem.ItemID == 2) {
                nodeCost.getChildByName("labelCostValue").getComponent(cc.Label).string = costItem.Count * 10000;
            } else {
                nodeCost.getChildByName("labelCostValue").getComponent(cc.Label).string = costItem.Count;
            }
        }

        // 抽奖提示
        if (data.Join[0] && data.Join[0].Join >= data.Act.LimitNum) {
            nodeBuy.getChildByName("btnPurchase").getComponent(cc.Button).interactable = false
            nodeBuy.getChildByName("btnPurchase").getComponent("ButtonObject").setText("已参与");
        } else {
            nodeBuy.getChildByName("btnPurchase").getComponent(cc.Button).interactable = true;
            let btnText = "购 买";
            (isFree || isShareComplete) && (btnText = "抽 奖");
            isShare && !isShareComplete && (btnText = "分享到群");
            isAD && (btnText = "  观看视频");
            nodeBuy.getChildByName("btnPurchase").getComponent("ButtonObject").setText(btnText);
        }

        nodeBuy.getChildByName("labelJoin").getComponent(cc.Label).string = i18n.t('label.4000401').replace("%d", data.Act.LimitNum - curJoinTime);

        // 奖品展示
        let opCfg = data.Act.OpCfg;
        let itemMusts = opCfg.Items;
        let itemProbs = opCfg.ItemProbs;
        let itemModel = nodeContent.getChildByName("itemModel");
        let nodeItemMustGet = nodeContent.getChildByName("nodeItemMustGet");
        let nodeItemProbGet = nodeContent.getChildByName("nodeItemProbGet");
        nodeItemMustGet.removeAllChildren();
        nodeItemProbGet.removeAllChildren();
        let self = this;
        let addProbItem = function (index) {
            let itemData = itemProbs[index];
            if (!itemData) {
                // nodeBuy.setScale(0);
                nodeBuy.active = true;
                // nodeBuy.runAction(cc.sequence(cc.scaleTo(0.15, 1.1), cc.scaleTo(0.05, 1)));
                self.canClickTab = true;
                return;
            }
            let item = cc.instantiate(itemModel);
            item.getComponent("ItemObject").updateItem(itemData.ItemID, itemData.Count);
            item.getComponent("ItemObject").setClick(true, 2);
            // item.setScale(0);
            item.active = true;
            item.y = 0;
            nodeItemProbGet.addChild(item);
            nodeItemProbGet.getComponent(cc.Layout).updateLayout();
            // item.runAction(cc.sequence(cc.scaleTo(0.1, 1.1), cc.scaleTo(0.05, 1), cc.callFunc(() => {
            nodeItemProbGet.getComponent(cc.Layout).updateLayout();
            addProbItem(index + 1);
            // })));
        };
        let addMustItem = function (index) {
            let itemData = itemMusts[index];
            if (!itemData) {
                addProbItem(0);
                return;
            }
            let item = cc.instantiate(itemModel);
            item.getComponent("ItemObject").updateItem(itemData.ItemID, itemData.Count);
            item.getComponent("ItemObject").setClick(true, 2);
            // item.setScale(0);
            item.active = true;
            item.y = 0;
            nodeItemMustGet.addChild(item);
            nodeItemMustGet.getComponent(cc.Layout).updateLayout();
            // item.runAction(cc.sequence(cc.scaleTo(0.1, 1.1), cc.scaleTo(0.05, 1), cc.callFunc(() => {
            nodeItemMustGet.getComponent(cc.Layout).updateLayout();
            addMustItem(index + 1);
            // })));
        };

        addMustItem(0);
    },
    //清理Type4的活动窗口
    clearContentType4: function () {
        let nodeActiveContent = this.node.getChildByName("nodeActiveContent");
        let nodeContent = nodeActiveContent.getChildByName("nodeType4");
        let nodeItemMustGet = nodeContent.getChildByName("nodeItemMustGet");
        let nodeItemProbGet = nodeContent.getChildByName("nodeItemProbGet");
        nodeItemMustGet.removeAllChildren();
        nodeItemProbGet.removeAllChildren();


        let nodeBuy = nodeContent.getChildByName("nodeBuy");
        nodeBuy.active = false;
    },

    onBtnTabArrowClick: function (event, dir) {
        if (dir < 0) {
            this.node.getChildByName("scrollActiveTab").getComponent(cc.ScrollView).scrollToLeft(0.3);
        } else if (dir > 0) {
            this.node.getChildByName("scrollActiveTab").getComponent(cc.ScrollView).scrollToRight(0.3);
        }
    },
    //活动类型为Type2的领取按钮点击事件
    onActiveRecvBtnClick: function (event) {
        let btn = event.target;
        let data = btn.parent.data;
        GlobalVar.handlerManager().activeHandler.sendActiveFenReq(data.actid, data.id, data.num);
    },
    //活动类型为Type1的兑换按钮点击事件
    onActiveExchangeBtnClick: function (event) {
        // let btn = event.target;
        // let data = btn.parent.data;
        // GlobalVar.handlerManager().activeHandler.sendActiveFenReq(data.actid, data.id, data.num);
        let btn = event.target;
        let actid = btn.parent.data.actid;
        let activeData = GlobalVar.me().activeData.getActiveDataByActID(actid);

        let index = btn.parent.data.id;
        let fenData = activeData.Act.OpCfg.FenCfg[index];
        let joinTimes = 0;
        let joinData = null;
        for (let i = 0; i < activeData.Join.length; i++) {
            if (activeData.Join[i].ID == index) {
                joinData = activeData.Join[i];
            }
        }
        if (joinData && joinData.Join) {
            joinTimes = joinData.Join;
        }
        let limitTimes = fenData.LimitNum || activeData.Act.LimitNum

        let costData = activeData.Act.CostCfg[index];

        let costArray = [];
        let itemcost = { id: costData.Items[0].ItemID, num: costData.Items[0].Count };
        costArray.push(itemcost);

        let getArray = [];
        let itemGet = { id: fenData.Items[0].ItemID, num: fenData.Items[0].Count };
        getArray.push(itemGet);

        let self = this;
        let confirmCallback = function () {
            GlobalVar.handlerManager().activeHandler.sendActiveFenReq(btn.parent.data.actid, btn.parent.data.id, self.buyCount);
        }
        self.buyCount = 0;
        let callback = function (count) {
            self.buyCount = parseInt(count);
            return parseInt(count) * costData.Items[0].Count;
        }
        CommonWnd.showPurchaseWnd(getArray, limitTimes - joinTimes, costArray, "兑换", "兑换道具", confirmCallback, null, callback);
    },
    //3
    onActiveLotteryBtnClick: function (event) {
        let curTabActID = this.activeList[this.curActiveIndex].Actid;
        let data = GlobalVar.me().activeData.getActiveDataByActID(curTabActID);
        let ruleCfg = data.Act.RuleCfg;
        let rule = ruleCfg[0] && ruleCfg[0].RuleList[0];
        let self = this;

        let curJoinTime = 0;
        curJoinTime = data.Join[0] ? data.Join[0].Join : 0;
        if (rule && rule.RuleID == GameServerProto.PT_AMS_RULEID_SHARE) {
            let curStep = StoreageData.getShareTimesWithKey(data.Act.Actid, data.Act.Limit, data.Act.EndTime);
            if (curStep >= rule.Var * (curJoinTime + 1)) {
                console.log("sendActiceJoinReq:  ", "curStep:", curStep, "  rule.Var:", rule.Var, "  curJoinTime:", curJoinTime);
                GlobalVar.handlerManager().activeHandler.sendActiveJoinReq(curTabActID);
            } else {
                let shareSuccessFunc = function () {
                    curStep = StoreageData.setShareTimesWithKey(data.Act.Actid, data.Act.Limit, data.Act.EndTime);
                    if (curStep >= rule.Var * (curJoinTime + 1)) {
                        console.log("sendActiceJoinReq:  ", "curStep:", curStep, "  rule.Var:", rule.Var, "  curJoinTime:", curJoinTime);
                        GlobalVar.handlerManager().activeHandler.sendActiveJoinReq(curTabActID);
                    } else {
                        self.refreshActiveContent(data);
                    }
                };
                if (rule.Param == 0) {
                    weChatAPI.shareNormal(113, shareSuccessFunc);
                } else {
                    weChatAPI.shareNeedClick(113, shareSuccessFunc, null, i18n.t('label.4000311'));
                }
            }
        } else {
            GlobalVar.handlerManager().activeHandler.sendActiveJoinReq(curTabActID);
        }
    },
    //4
    onActiveSeLottBtnClick: function (event) {
        let curTabActID = this.activeList[this.curActiveIndex].Actid;
        let data = GlobalVar.me().activeData.getActiveDataByActID(curTabActID);
        let ruleCfg = data.Act.RuleCfg;
        let rule = ruleCfg[0] && ruleCfg[0].RuleList[0];
        let self = this;

        let curJoinTime = 0;
        curJoinTime = data.Join[0] ? data.Join[0].Join : 0;
        if (rule && rule.RuleID == GameServerProto.PT_AMS_RULEID_SHARE) {
            let curStep = StoreageData.getShareTimesWithKey(data.Act.Actid, data.Act.Limit, data.Act.EndTime);
            if (curStep >= rule.Var * (curJoinTime + 1)) {
                GlobalVar.handlerManager().activeHandler.sendActiveJoinReq(curTabActID);
            } else {
                let shareSuccessFunc = function () {
                    curStep = StoreageData.setShareTimesWithKey(data.Act.Actid, data.Act.Limit, data.Act.EndTime);
                    if (curStep >= rule.Var * (curJoinTime + 1)) {
                        GlobalVar.handlerManager().activeHandler.sendActiveJoinReq(curTabActID);
                    } else {
                        self.refreshActiveContent(data);
                    }
                };
                if (rule.Param == 0) {
                    weChatAPI.shareNormal(113, shareSuccessFunc);
                } else {
                    weChatAPI.shareNeedClick(113, shareSuccessFunc, null, i18n.t('label.4000311'));
                }
            }
        } else {
            GlobalVar.handlerManager().activeHandler.sendActiveJoinReq(curTabActID);
        }
    },

    recvActiveFlagChange: function (event) {
        for (let i = 0; i < this.activeTabs.length; i++) {
            if (this.activeTabs[i].data.Actid == event.Actid) {
                this.activeTabs[i].getChildByName("spriteHot").active = !!event.StatFlag;
            }
        }
    },
    recvActiveFenResult: function (event) {
        if (event.ErrCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        CommonWnd.showTreasureExploit(event.Item)
        let nodeActiveContent = this.node.getChildByName("nodeActiveContent");
        let nodeContent = nodeActiveContent.getChildByName("nodeType" + this.contentIndex);
        let scrollview = nodeContent.getChildByName("scrollContent").getComponent(cc.ScrollView);
        scrollview.loopScroll.refreshViewItem();
    },
    recvActiveJoinResult: function (event) {
        if (event.ErrCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        CommonWnd.showTreasureExploit(event.Item)
        let self = this;
        let data = GlobalVar.me().activeData.getActiveDataByActID(this.activeList[this.curActiveIndex].Actid)
        // this.activeContents[this.contentIndex - 1].runAction(cc.sequence(cc.scaleTo(0.1, 1.1), cc.scaleTo(0.05, 1), cc.callFunc(() => {
            self["refreshContentType" + self.contentIndex](data);
        // })));
    },
    recvGetDataMsg: function (event) {
        if (event.ErrCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(event.ErrCode);
        }
        let curTabActID = this.activeList[this.curActiveIndex].Actid;
        if (event.Act.Actid == curTabActID) {
            this.refreshActiveInfo(this.curActiveIndex);
        }
    },

    enter: function (isRefresh) {
        if (isRefresh) {
            for (let i = 0; i < this.activeContents.length; i++) {
                this.activeContents[i].active = false;
            }
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

    close: function (data) {
        if (this.contentIndex != 0) {
            this["clearContentType" + this.contentIndex]();
            this.contentIndex = 0;
        }
        this.node.getChildByName("nodeActiveContent").getChildByName("nodeActiveInfo").active = false;
        this.node.getChildByName("scrollActiveTab").active = false;
        this._super();
    },
});
