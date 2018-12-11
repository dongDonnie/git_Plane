const GlobalVar = require("globalvar")
const SceneDefines = require('scenedefines')
const BattleManager = require('BattleManager')
var Connecting = cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        
    },

    start(){
        
    },

    btnClick: function (event, data) {
        if (data == 1) {
            if(GlobalVar.sceneManager().getCurrentSceneType()!==SceneDefines.LOGIN_STATE){
                BattleManager.getInstance().quitOutSide();
                GlobalVar.sceneManager().gotoScene(SceneDefines.LOGIN_STATE);
                GlobalVar.netWaiting().reconnect=false;
            }
        } else {
            cc.log("Reconnect: cancel btn pressed.");
        }
    }
});