const WindowManager = require("windowmgr");
const WndTypeDefine = require("wndtypedefine");
const UIBase = require("uibase");
const GlobalFunc = require('GlobalFunctions');

cc.Class({
    extends: UIBase,

    properties: {
        MainView: {
            default: null,
            type: cc.Button
        },
        selfAnime: {
            default: null,
            type: cc.Animation
        },
        selfAnimeName: "",
        openType: 0,
        typeName: {
            default: "",
            visible: false,
        },
        deleteMode: {
            default: false,
            visible: false,
        }
    },

    onLoad: function () {
        this._super();
    },

    initRoot: function () {
        if (WindowManager.getInstance().findViewInStack(WndTypeDefine.WindowType.E_DT_NORMALROOT_WND) != "" || this.openType == 0) {
            this.animePlay(1);
        } else {
            var self = this;
            // WindowManager.getInstance().insertView(WndTypeDefine.WindowType.E_DT_ROOTBACK_WND, self.typeName, function (wnd, name, type) {
            //     WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMALROOT_WND, function (wnd, name, type) {
            //         wnd.getComponent(type).animePlay(1);
            //     }, false);
            // });
            WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMALROOT_WND, function (wnd, name, type) {
                WindowManager.getInstance().insertView(WndTypeDefine.WindowType.E_DT_ROOTBACK_WND, self.typeName, null, false);
                if (GlobalFunc.isAllScreen()) {
                    wnd.getComponent(type).animePlay(3);
                } else {
                    wnd.getComponent(type).animePlay(1);
                }

            }, false);
        }
    },

    needPopNormalRoot: function () {
        let rootBackIndex = WindowManager.getInstance().findViewIndex(WndTypeDefine.WindowType.E_DT_ROOTBACK_WND);
        let normalRootIndex = WindowManager.getInstance().findViewIndex(WndTypeDefine.WindowType.E_DT_NORMALROOT_WND);
        if (normalRootIndex - rootBackIndex <= 2) {
            return true;
        }
        return false;
    },

    animePlay: function (mode) {

        this.nodeBlock && (this.nodeBlock.enabled = true);
        if (this.selfAnimeName != "") {
            switch (mode) {
                case 0:
                    this.selfAnime.play("anime" + this.selfAnimeName + "Escape");
                    break;
                case 1:
                    this.selfAnime.play("anime" + this.selfAnimeName + "Enter");
                    break;
            }
        } else {
            switch (mode) {
                case 0:
                    this.animePlayCallBack("Escape");
                    break;
                case 1:
                    this.animePlayCallBack("Enter");
                    break;
            }
        }
    },

    animePlayCallBack(name) {
        this.nodeBlock && (this.nodeBlock.enabled = false);
        if (name == "Escape") {
            if (this.deleteMode) {
                if (!this.needPopNormalRoot()) {
                    WindowManager.getInstance().deleteView(this.typeName);
                    WindowManager.getInstance().getTopView().getComponent(WindowManager.getInstance().getTopViewType()).animePlay(1);
                } else {
                    if (this.openType == 1){
                        let uiNode = cc.find("Canvas/UINode");
                        if (uiNode != null) {
                            uiNode.active = true;
                        }
                    }
                }
            }
        } else if (name == "Enter") {
            if (this.openType == 1) {
                let uiNode = cc.find("Canvas/UINode");
                if (uiNode != null) {
                    uiNode.active = false;
                }
            }
        }
    },

    touchMain: function () {
        // cc.log("touchMain");
    },

    close: function () {
        if (this.openType != 0) {
            this.deleteMode = true;
            if (this.needPopNormalRoot()) {
                if (GlobalFunc.isAllScreen()) {
                    WindowManager.getInstance().findViewInWndNode(WndTypeDefine.WindowType.E_DT_NORMALROOT_WND).getComponent(WndTypeDefine.WindowType.E_DT_NORMALROOT_WND).animePlay(2);
                } else {
                    WindowManager.getInstance().findViewInWndNode(WndTypeDefine.WindowType.E_DT_NORMALROOT_WND).getComponent(WndTypeDefine.WindowType.E_DT_NORMALROOT_WND).animePlay(0);
                }

            }
        }
        this.animePlay(0);
    },

    enter: function (isRefresh) {
        if (isRefresh) {
            this.initRoot();
        } else {

        }
    },

    escape: function (isRefresh) {
        if (isRefresh) {

        } else {

        }
    },

});