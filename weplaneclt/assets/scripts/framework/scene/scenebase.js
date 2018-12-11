const GlobalVar = require("globalvar");
const ResMapping = require("resmapping");
const weChatAPI = require("weChatAPI");
const BattleManager = require('BattleManager');
const BattleDefines = require('BattleDefines');
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

    openScene:function(){
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.onShow(this.showEvent);
            wx.onHide(this.hideEvent);
        }
    },

    showEvent:function(res){
        GlobalVar.soundManager().resumeBGM();
        if (cc.sys.platform === cc.sys.WECHAT_GAME){
            weChatAPI.deviceKeepScreenOn();
        }
    },

    hideEvent:function(){
        GlobalVar.soundManager().pauseBGM();
        if(BattleManager.getInstance().gameState==BattleDefines.GameResult.RUNNING){
            BattleManager.getInstance().gameState = BattleDefines.GameResult.INTERRUPT;
        }
    },

    releaseScene: function () {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.offShow(this.showEvent);
            wx.offHide(this.hideEvent);
        }
    },

    loadPrefab: function (prefabName,callback) {
        if(this.sceneName==""){
            return;
        }
        var self = this;
        GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, "cdnRes/prefab/" + this.sceneName + "/" + prefabName, function (prefab) {
            if (prefab != null) {
                var uiInterface = cc.instantiate(prefab);
                self.uiNode.addChild(uiInterface, 0, prefabName);
                if(!!callback){
                    callback();
                }
            } else {
                // cc.log("load prefab failed!");
            }
        });
    },

});