const WindowManager = require("windowmgr");
const WndTypeDefine = require("wndtypedefine");
const RootBase = require("RootBase");
var GlobalVar = require('globalvar');
const GameServerProto = require("GameServerProto");
const CommonWnd = require("CommonWnd");
const i18n = require('LanguageData');
const EventMsgID = require("eventmsgid");

cc.Class({
    extends: RootBase,

    properties: {
        rewardModel: {
            default: null,
            type: cc.Node
        },
        itemObj: {
            default: null,
            type:cc.Node
        },
        scroll: {
            default: null,
            type: cc.Node,
        }
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_REWARD_CENTER_WND;
        this.animeStartParam(0, 0);
    },

    animeStartParam(paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            WindowManager.getInstance().popView(false, null, false, false);
        } else if (name == "Enter") {
            this._super("Enter");
            this.registerEvent();
            this.initPanel();
        }
    },

    registerEvent: function () {
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_REWARD_CENTER_DATA, this.initPanel, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_REWARD_RESULT, this.getRewardResult, this);
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

    getRewardResult: function (data) {
        if (data.ErrCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(data.ErrCode);
            return
        }
        data = data.OK ? data.OK : data;
        data.Items.length > 0 && CommonWnd.showTreasureExploit(data.Items);
    },

    initPanel: function () {
        let rewardData = GlobalVar.me().rewardCenterData.data;
        let self = this;
        this.initScroll(this.scroll, this.rewardModel, function (grid, index) {
            let reward = rewardData.Reward[index];
            grid.active = true;
            let str = i18n.t('label.' + (4003000 + reward.Type)).replace("%d", reward.Param1);
            grid.getChildByName('rewardType').getComponent(cc.Label).string = str;
            grid.getChildByName('btnRecv').getComponent(cc.Button).clickEvents[0].customEventData = reward.Seq;
            let scrollNode = grid.getChildByName('scrollView');
            self.initScroll(scrollNode, self.itemObj, function (item, ind) {
                let itemData = reward.Items[ind];
                item.active = true;
                item.getComponent("ItemObject").updateItem(itemData.ItemID);
                item.getComponent("ItemObject").setLabelNumberData(itemData.Count);
            }, reward.Items.length)
        }, rewardData.Reward.length)
    },

    initScroll: function (scrollNode, itemPrefab, updateItem, counts) {
        let scroll = scrollNode.getComponent(cc.ScrollView);
        scroll.loopScroll.releaseViewItems();
        scroll.loopScroll.setTotalNum(counts);
        scroll.loopScroll.setCreateModel(itemPrefab);
        scroll.loopScroll.registerUpdateItemFunc(function (grid, index) {
            updateItem(grid, index);
        });
        scroll.loopScroll.resetView();
    },

    clickGetReward: function (event, customData) {
        GlobalVar.handlerManager().rewardCenterHandler.sendGetRewardReq(customData);
    },

    clickAllReward: function () {
        GlobalVar.handlerManager().rewardCenterHandler.sendAllRewardReq();
    },
});