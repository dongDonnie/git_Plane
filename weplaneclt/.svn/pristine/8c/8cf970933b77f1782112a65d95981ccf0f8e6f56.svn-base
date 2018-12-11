const Defines = require('BattleDefines');
const UIBase = require("uibase");
const GlobalVar = require("globalvar");
const SceneDefines = require("scenedefines");

var UIBattlePause = cc.Class({
    extends: UIBase,

    properties: {

    },

    onLoad: function () {
        this.battleManager = require('BattleManager').getInstance();
        require('Guide').getInstance().showQuit(this);
        if (!require('config').GM_SWITCH) {
            this.node.getChildByName('btnGM').active = false;
        }
        if (this.battleManager.isEndlessFlag) {
            this.node.getChildByName('btnoGiveUp').getComponent('ButtonObject').textLabel = '直接结算';
        }
    },

    clickGiveUp: function () {
        if (this.battleManager.isEndlessFlag) {
            this.battleManager.result = 2;
            this.battleManager.gameState = Defines.GameResult.END;
            this.node.destroy();
        } else {
            //this.battleManager.result = 0;
            GlobalVar.handlerManager().campHandler.sendCampResultReq(0);
            GlobalVar.sceneManager().gotoScene(SceneDefines.MAIN_STATE);
        }
        //this.battleManager.gameState = Defines.GameResult.END;
        //this.node.destroy();
    },

    clickToBeContinue: function () {
        this.battleManager.gameState = Defines.GameResult.PREPARE;
        this.node.destroy();
    },

    clickGM: function () {
        this.battleManager.result = 1;
        this.battleManager.gameState = Defines.GameResult.END;
        this.node.destroy();
    },

});