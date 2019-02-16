
const RootBase = require("RootBase");
const WindowManager = require("windowmgr");
const GlobalVar = require('globalvar')
const WndTypeDefine = require("wndtypedefine");

cc.Class({
    extends: RootBase,

    properties: {

    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_ARENA_PLAY_TIP_WND;
        this.animeStartParam(0);
    },


    animeStartParam: function(paramScale) {
        this.node.scaleY = paramScale;
    },

    animePlayCallBack: function(name) {
        if (name == "Escape") {
            this._super("Escape");
            GlobalVar.eventManager().removeListenerWithTarget(this);
            WindowManager.getInstance().popView();
        } else if (name == "Enter") {
            this._super("Enter");
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

    close: function () {
        this._super();
    },
});
