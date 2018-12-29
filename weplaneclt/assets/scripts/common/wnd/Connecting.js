const GlobalVar = require("globalvar")
const SceneDefines = require('scenedefines')
const BattleManager = require('BattleManager')
var Connecting = cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {

    },

    start() {

    },

    btnClick: function (event, data) {
        BattleManager.getInstance().quitOutSide();
        if (data == 1) {
            if (GlobalVar.sceneManager().getCurrentSceneType() !== SceneDefines.LOGIN_STATE) {
                if (cc.sys.platform === cc.sys.WECHAT_GAME && GlobalVar.sceneManager().firstEnter) {
                    cc.game.restart();
                    GlobalVar.sceneManager().firstEnter = false;
                }else{
                    GlobalVar.sceneManager().gotoScene(SceneDefines.LOGIN_STATE);
                }
                GlobalVar.netWaiting().reconnect = false;
            }else{
                cc.game.restart();
            }
        } else {
            cc.game.end();
        }
    }
});