const Defines = require('BattleDefines')

var AssistManager = cc.Class({
    statics: {
        instance: null,
        getInstance: function () {
            if (AssistManager.instance == null) {
                AssistManager.instance = new AssistManager();
            }
            return AssistManager.instance;
        },
        destroyInstance() {
            if (AssistManager.instance != null) {
                delete AssistManager.instance;
                AssistManager.instance = null;
            }
        }
    },

    properties: {
        
    },

    start(mgr) {
        this.battleManager = require('BattleManager').getInstance();
        this.heroManager = require('HeroManager').getInstance();
        this.scenarioManager = require('ScenarioManager').getInstance();
        this.solution = require('BulletSolutions');
    },

    update(dt) {
        
    }
});