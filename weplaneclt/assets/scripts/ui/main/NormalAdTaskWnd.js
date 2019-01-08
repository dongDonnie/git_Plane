const RootBase = require("RootBase");
const WndTypeDefine = require("wndtypedefine");

cc.Class({
    extends: RootBase,

    properties: {
        adTaskScroll: {
            default: null,
            type: cc.ScrollView,
        },
        adTaskPrefab: {
            default: null,
            type: cc.Prefab,
        },
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_AD_TASK_WND;

        this.initUI(0, 0);
    },

    initUI: function (paramScale, paramOpacity) {
        this.node.setScale(paramScale);
        this.node.opacity = paramOpacity;
        if (paramOpacity == 255) {
            this.adTaskScroll.loopScroll.releaseViewItems();
        }
    },

    // update (dt) {},
});
