const GlobalVar = require("globalvar");
const ResMapping = require("resmapping");
const BattleManager = require('BattleManager');
const BattleDefines = require('BattleDefines');
const i18n = require('LanguageData');
var SceneBase = cc.Class({
    extends: cc.Component,

    properties: {
        sceneName: {
            default: "",
            visible: false
        },
    },

    onLoad: function () {

    },

    openScene: function () {
        // let platformApi = GlobalVar.getPlatformApi();
        // if (platformApi) {
        //     platformApi.setOnShowListener(this.showEvent);
        //     platformApi.setOnHideListener(this.hideEvent);
        // }
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.onShow(this.showEvent);
            wx.onHide(this.hideEvent);
        }else if (window && window["wywGameId"]=="5469"){
            console.log("window:", window);
            // window["wywGameListener"]["enterBackCallback"] = function () {
            //     console.log("woowowowowow");
            // };
            // window["wywGameListener"]["enterForeCallback"] = function () {
            //     console.log("kakakakakakak");
            // };
            // window.Game.onEnterForeground(this.showEvent)
            // window.Game.onEnterBackground(this.hideEvent)
        }
    },

    showEvent: function (res) {
        GlobalVar.soundManager().resumeBGM();
        let platformApi = GlobalVar.getPlatformApi();
        if (platformApi) {
            platformApi.deviceKeepScreenOn();
        }
        GlobalVar.networkManager().checkConnection();
    },

    hideEvent: function () {
        GlobalVar.soundManager().pauseBGM();
        if (BattleManager.getInstance().gameState == BattleDefines.GameResult.RUNNING) {
            BattleManager.getInstance().gameState = BattleDefines.GameResult.INTERRUPT;
        }
    },

    releaseScene: function () {
        // let platformApi = GlobalVar.getPlatformApi();
        // if (platformApi) {
        //     platformApi.setOffShowListener(this.showEvent);
        //     platformApi.setOffHideListener(this.hideEvent);
        // }
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.offShow(this.showEvent);
            wx.offHide(this.hideEvent);
        }else if (window && window["wywGameId"]=="5469") {
            // window.Game.offEnterForeground(this.showEvent)
            // window.Game.offEnterBackground(this.hideEvent)
        }
    },

    loadPrefab: function (prefabName, callback) {
        if (this.sceneName == "") {
            return;
        }
        let block = cc.find("Canvas/BlockNode");
        if (cc.isValid(block)) {
            block.active = true;
        }
        var self = this;
        GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, "cdnRes/prefab/" + this.sceneName + "/" + prefabName, function (prefab) {
            if (prefab != null) {
                var uiInterface = cc.instantiate(prefab);
                self.uiNode.addChild(uiInterface, 0, prefabName);
                if (!!callback) {
                    callback();
                }
                if (cc.isValid(block)) {
                    block.active = false;
                }
            } else {
                GlobalVar.comMsg.showMsg(i18n.t('label.4000003'));
                self.reLoadPrefab(prefabName, callback);
            }
        });
    },

    reLoadPrefab: function (prefabName, callback) {
        var self = this;
        GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, "cdnRes/prefab/" + this.sceneName + "/" + prefabName, function (prefab) {
            if (prefab != null) {
                GlobalVar.comMsg.showMsg(i18n.t('label.4000004'));
                var uiInterface = cc.instantiate(prefab);
                self.uiNode.addChild(uiInterface, 0, prefabName);
                if (!!callback) {
                    callback();
                }
                let block = cc.find("Canvas/BlockNode");
                if(cc.isValid(block)){
                    block.active = false;
                }
            } else {
                self.reLoadPrefab(prefabName, callback);
            }
        });
    }

});