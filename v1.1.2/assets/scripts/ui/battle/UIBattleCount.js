const GlobalVar = require("globalvar");
const UIBase = require("uibase");
const Defines = require('BattleDefines');


const AUDIO_COUNT_EFFECT = 'cdnRes/audio/main/effect/pause';

cc.Class({
    extends: UIBase,

    properties: {
        bg: {
            default: null,
            type: cc.Node
        }
    },

    onLoad: function () {
        this.battleManager = require('BattleManager').getInstance();
        if (!!this.battleManager.isArenaFlag) {
            this.bg.opacity = 0;
        }
    },

    countdown: function () {
        if (!!this.battleManager.isArenaFlag) {
            this.battleManager.gameState = Defines.GameResult.READY;
        } else {
            this.battleManager.gameState = Defines.GameResult.RESUME;
        }
        this.node.destroy();
    },

    playCountEffect: function () {
        GlobalVar.soundManager().playEffect(AUDIO_COUNT_EFFECT);
    },

});