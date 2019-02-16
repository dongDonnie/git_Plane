const RootBase = require("RootBase");
const WindowManager = require("windowmgr");
const WndTypeDefine = require("wndtypedefine");
const GlobalVar = require('globalvar')
const GlobalFunc = require('GlobalFunctions')
const i18n = require('LanguageData');
const CommonWnd = require("CommonWnd");

cc.Class({
    extends: RootBase,

    properties: {
        labelBeforeMixLevel: {
            default: null,
            type: cc.Label,
        },
        labelCurMixLevel: {
            default: null,
            type: cc.Label,
        },
        labelBeforeComabt: {
            default: null,
            type: cc.Label,
        },
        labelCurComabt: {
            default: null,
            type: cc.Label,
        },
        labelBeforeHp: {
            default: null,
            type: cc.Label,
        },
        labelCurHp: {
            default: null,
            type: cc.Label,
        },
        labelBeforeAtk: {
            default: null,
            type: cc.Label,
        },
        labelCurAtk: {
            default: null,
            type: cc.Label,
        },
        labelBeforeDef: {
            default: null,
            type: cc.Label,
        },
        labelCurDef: {
            default: null,
            type: cc.Label,
        },
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_MIXLEVEL_UP_WND;

        this.node.getChildByName("spriteContinue").runAction(cc.repeatForever(cc.sequence(cc.fadeOut(0.7),cc.fadeIn(0.7))))
        this.animeStartParam(0, 0);
    },

    animeStartParam(paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            WindowManager.getInstance().popView();
            // WindowManager.getInstance().popView(false, function () {
            //     WindowManager.getInstance().resumeView();
            // }, false);
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

    initMixLevelUpWnd: function (data) {
        this.labelBeforeMixLevel.string = '合体科技' + data.mixLevelBefore + '级';
        this.labelCurMixLevel.string = '合体科技' + data.mixLevelCur + '级';

        this.labelBeforeComabt.string = data.sumCombatBefore;
        this.labelCurComabt.string = data.sumCombatCur;

        this.labelBeforeHp.string = data.hpNumBefore;
        this.labelCurHp.string = data.hpNumCur;

        this.labelBeforeAtk.string = data.atkNumBefore;
        this.labelCurAtk.string = data.atkNumCur;

        this.labelBeforeDef.string = data.defNumBefore;
        this.labelCurDef.string = data.defNumCur;
    },

    onBtnRecv: function () {
        this.close();
    },
});
