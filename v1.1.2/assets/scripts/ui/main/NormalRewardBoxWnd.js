const WindowManager = require("windowmgr");
const WndTypeDefine = require("wndtypedefine");
const RootBase = require("RootBase");
const GlobalVar = require('globalvar')
const GlobalFunc = require('GlobalFunctions');

cc.Class({
    extends: RootBase,

    properties: {
        labelTitle: {
            default: null,
            type: cc.Label
        },
        nodeItem: {
            default: null,
            type: cc.Node
        },
        nodeLayout: {
            default: null,
            type: cc.Node
        }
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_REWARD_BOX_WND;
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

        }
    },

    close: function () {
        if(!!this.closeCallback)
            this.closeCallback();
        this._super();
    },

    confirm: function () {
        this.animePlay(0);
        if (this.confirmCallBack) {
            this.confirmCallBack();
        }
        let block = cc.find("Canvas/BlockNode");
        if (cc.isValid(block)) {
            block.active = false;
        }
        WindowManager.getInstance().popView(false, null, false, false);
    },

    initPanel: function (mode, title, condition, vecItems, pFunConfirmCallback, confirmName, pFunCloseCallback) {
        this.setTitle(title);
        this.setBtnEvent(pFunConfirmCallback, pFunCloseCallback);
        this.node.getChildByName("btnConfirm").getComponent(cc.Button).interactable = condition;
        this.nodeLayout.removeAllChildren();
        for (let i = 0; i < vecItems.length; i++) {
            let nodeItem = cc.instantiate(this.nodeItem);
            let item = nodeItem.getChildByName("ItemObject").getComponent("ItemObject");
            let itemData = item.updateItem(vecItems[i].wItemID, vecItems[i].nCount);
            item.setClick(true, 2);
            nodeItem.getChildByName("labelName").getComponent(cc.Label).string = itemData.strName;
            nodeItem.getChildByName("labelName").color = GlobalFunc.getCCColorByQuality(itemData.wQuality);
            this.nodeLayout.addChild(nodeItem);
        }
        if (mode) {
            confirmName = "  " + confirmName;
        }
        this.setConfirmText(confirmName);
        this.setBtnMode(mode);
        if (mode == 0) {
            this.node.getChildByName('tips').active = false;
        } else {
            this.node.getChildByName('tips').active = !GlobalVar.srcSwitch();
        }
    },

    setBtnMode: function (mode) {
        let confirm = this.node.getChildByName("btnConfirm");
        let spriteVideo = confirm.getChildByName("spriteVideo");
        let spriteShare = confirm.getChildByName("spriteShare");
        if (mode == 1) {
            spriteVideo.active = false;
            spriteShare.active = true;
        } else if (mode == 2) {
            spriteVideo.active = true;
            spriteShare.active = false;
        } else {
            spriteVideo.active = false;
            spriteShare.active = false;
        }
    },

    setTitle: function (text) {
        if (typeof text !== 'undefined' && text != "") {
            this.labelTitle.string = text;
        }
    },

    setConfirmText: function (text) {
        this.node.getChildByName("btnConfirm").getComponent("ButtonObject").setText(text);
    },

    setBtnEvent: function (confirmCallBack, closeCallback) {
        if (typeof confirmCallBack !== 'undefined' && confirmCallBack != null) {
            this.confirmCallBack = confirmCallBack;
        } else {
            this.confirmCallBack = null;
        }

        if (typeof closeCallback !== 'undefined' && closeCallback != null) {
            this.closeCallback = closeCallback;
        } else {
            this.closeCallback = null;
        }
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