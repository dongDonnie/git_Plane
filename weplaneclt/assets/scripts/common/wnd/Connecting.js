const GlobalVar = require("globalvar")
const SceneDefines = require('scenedefines')
const BattleManager = require('BattleManager')
const i18n = require('LanguageData')
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
            //GlobalVar.comMsg.showMsg(i18n.t('label.4000005'));
            this.node.getChildByName('Reconnect').getChildByName('labelMessage').getComponent(cc.Label).string = i18n.t('label.4000005');
            this.node.getChildByName('Reconnect').getChildByName('btnoConfirm').getComponent(cc.Button).interactable = false;
            this.node.getChildByName('Reconnect').getChildByName('btnoCancel').getComponent(cc.Button).interactable = false;
            if (GlobalVar.sceneManager().getCurrentSceneType() !== SceneDefines.LOGIN_STATE) {
                if ((cc.sys.platform === cc.sys.WECHAT_GAME || (window && window["wywGameId"]=="5469")) && GlobalVar.sceneManager().firstEnter) {
                    cc.game.restart();
                    GlobalVar.sceneManager().firstEnter = false;
                } else {
                    GlobalVar.sceneManager().gotoScene(SceneDefines.LOGIN_STATE);

                }
                GlobalVar.netWaiting().reconnect = false;
            } else {
                cc.game.restart();
            }
        } else {
            cc.game.end();
        }
    }
});