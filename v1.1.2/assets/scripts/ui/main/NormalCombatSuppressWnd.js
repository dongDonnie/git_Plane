const WindowManager = require("windowmgr");
const WndTypeDefine = require("wndtypedefine");
const RootBase = require("RootBase");

cc.Class({
    extends: RootBase,

    properties: {
        curCombatlbl: cc.Label,
        needCombatlbl: cc.Label
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_COMBAT_SUPPRESS_WND;
        this.animeStartParam(0, 0);
    },

    animeStartParam(paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            WindowManager.getInstance().popView(false,null,false,false);
        } else if (name == "Enter") {
            this._super("Enter");
        }
    },

    initParam: function (curCombat, needCombat, confirmCallback, cancelCallback) {
        this.curCombatlbl.string = "当前战力："+curCombat;
        this.needCombatlbl.string = "推荐战力："+needCombat;
        this.confirmCallback = confirmCallback;
        this.cancelCallback = cancelCallback;
    },

    onBtnComfirm: function () {
        let self = this;
        if (!!this.confirmCallback) {
            WindowManager.getInstance().popView(false, () => {
                self.confirmCallback();
            },false,false);
        }
    },

    onBtnCancel: function () {
        if (!!this.cancelCallback) {
            this.cancelCallback();
        }
    },

    onBtnClose: function(){
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