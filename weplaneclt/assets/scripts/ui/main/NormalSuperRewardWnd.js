const GlobalVar = require("globalvar");
const WindowManager = require("windowmgr");
const WndTypeDefine = require("wndtypedefine");
const RootBase = require("RootBase");
const EventMsgID = require("eventmsgid");
const GameServerProto = require("GameServerProto");
const CommonWnd = require("CommonWnd");
const StoreageData = require("storagedata");

cc.Class({
    extends: RootBase,

    properties: {
        nodeTips: {
            default: null,
            type: cc.Node,
        },
        nodeItems: {
            default: null,
            type: cc.Node,
        },
        btnRecv: {
            default: null,
            type: cc.Button,
        },
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_SUPER_REWARD_WND;
        this.animeStartParam(0, 0);
    },

    onDestroy() {
        this._super();
    },

    animeStartParam(paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;

        if (paramOpacity == 0 || paramOpacity == 255) {
            this.nodeTips.active = false;
            this.nodeItems.active = false;
        }
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            let platformApi = GlobalVar.getPlatformApi();
            if (platformApi) {
                platformApi.setOffShowListener(this.refreshWnd.bind(this));
            }
            GlobalVar.eventManager().removeListenerWithTarget(this);
            WindowManager.getInstance().popView();
        } else if (name == "Enter") {
            this._super("Enter");
            let platformApi = GlobalVar.getPlatformApi();
            if (platformApi) {
                platformApi.setOnShowListener(this.refreshWnd.bind(this));
            }
            GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_SUPER_REWARD_DATA, this.getSuperRewardData, this);

            this.initSuperRewardWnd();
        }
    },

    refreshWnd: function (res) {
        if (parseInt(res.scene) == 1104) {
            StoreageData.setShareTimesWithKey("superReward", 0);
            this.initSuperRewardWnd();
        }
    },

    initSuperRewardWnd: function () {
        if (cc.isValid(this.nodeTips)) {
            this.nodeTips.active = true;
        }
        if (cc.isValid(this.nodeItems)) {
            this.nodeItems.active = true;
            this.nodeItems.children[0].getComponent("ItemObject").updateItem(1, 88888);
            this.nodeItems.children[0].getComponent("ItemObject").setClick(true, 2);
            this.nodeItems.children[1].getComponent("ItemObject").updateItem(3, 30),
                this.nodeItems.children[1].getComponent("ItemObject").setClick(true, 2);
            this.nodeItems.children[2].getComponent("ItemObject").updateItem(502, 5);
            this.nodeItems.children[2].getComponent("ItemObject").setClick(true, 2);
        }
        if (cc.isValid(this.btnRecv)) {
            this.btnRecv.interactable = !!StoreageData.getShareTimesWithKey("superReward", 0);
        }
    },

    getSuperRewardData: function (event) {
        if (event.ErrCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        CommonWnd.showTreasureExploit(event.Item);

        this.btnRecv.interactable = false;
    },

    onBtnRecv: function () {
        GlobalVar.handlerManager().shareHandler.sendSuperRewardReq();
    },

    onBtnClose: function () {
        this.close();
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

});