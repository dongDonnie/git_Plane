const RootBase = require("RootBase");
const WndTypeDefine = require("wndtypedefine");

cc.Class({
    extends: RootBase,

    properties: {
        MaskBack: {
            default: null,
            type: cc.Button
        },
        Background: {
            default: null,
            type: cc.Sprite
        },
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_MASKBACK_WND;
        //this.animeStartParam(0);
    },
    animeStartParam(num) {
        this.node.opacity = num;
    },
    touchMask: function () {
        // cc.log("touchMask");
    },

    enter: function (isRefresh) {
        this._super(!!isRefresh);
    },

    escape: function (isRefresh) {
        this._super(!!isRefresh);
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
        } else if (name == "Enter") {
            this._super("Enter")
        }
    },


});
