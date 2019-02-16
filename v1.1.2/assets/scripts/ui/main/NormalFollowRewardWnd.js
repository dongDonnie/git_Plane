const RootBase = require("RootBase");
const WndTypeDefine = require("wndtypedefine");
const GlobalVar = require('globalvar')
const WindowManager = require("windowmgr");

cc.Class({
    extends: RootBase,

    properties: {
        itemObj: {
            default: null,
            type: cc.Node
        },
    },

    onLoad: function () {
        this._super();
        this.animeStartParam(0, 0);
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_FOLLOW_REWARD_WND;
        this.initView();
    },

    animeStartParam(paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;
    },

    OnCloseBtnClick:function() {
        this.close();
    },
    
    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            WindowManager.getInstance().popView(false, null, false, false);
        } else if (name == "Enter") {
            this._super("Enter");
        }
    },

    initView:function() {
        let itemList = [
            {ItemID:3,Count:50},
            {ItemID:27,Count:3},
            {ItemID:1,Count:88888},
        ];
        for (let i = 0; i < 3; i++) {
            this.itemObj.children[i].getComponent("ItemObject").updateItem(itemList[i].ItemID, itemList[i].Count);
            this.itemObj.children[i].getComponent("ItemObject").setClick(true, 2);
            let itemData = GlobalVar.tblApi.getDataBySingleKey('TblItem', itemList[i].ItemID);
            this.itemObj.children[i].getChildByName("labelName").getComponent(cc.Label).string = itemData.strName;
        }
    },

    update: function(){

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
    
    close: function () {
        this._super();
    },
});