const GlobalVar = require("globalvar");
const UIBase = require("uibase");
const Defines = require('BattleDefines');


const AUDIO_COUNT_EFFECT = 'cdnRes/audio/main/effect/pause';

cc.Class({
    extends: UIBase,

    properties: {
        
    },

    onLoad: function () {
        this.battleManager = require('BattleManager').getInstance();
    },

    countdown:function(){
        this.battleManager.gameState = Defines.GameResult.RESUME;
        this.node.destroy();
    },

    playCountEffect: function () {
        GlobalVar.soundManager().playEffect(AUDIO_COUNT_EFFECT);
    },

});