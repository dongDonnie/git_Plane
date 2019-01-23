const GlobalFunc = require('GlobalFunctions');
const UIBase = require("uibase");
const BattleDefines = require('BattleDefines');

cc.Class({
    extends: UIBase,

    ctor: function () {
        this.battleManager = require('BattleManager').getInstance();
        this.scenarioManager = require('ScenarioManager').getInstance();
    },

    properties: {
        widgetTop: {
            default: null,
            type: cc.Widget
        },
        nodeAutoBattle: {
            default: null,
            type: cc.Node
        },
        animeAutoBattle: {
            default: null,
            type: cc.Animation
        },
        nodeBattleStart: {
            default: null,
            type: cc.Node
        },
        animeBattleStart: {
            default: null,
            type: cc.Animation
        },
        barSelfHp: {
            default: null,
            type: cc.ProgressBar
        },
        barRivalHp: {
            default: null,
            type: cc.ProgressBar
        },
        labelSelfName: {
            default: null,
            type: cc.Label
        },
        labelSelfLevel: {
            default: null,
            type: cc.Label
        },
        labelRivalName: {
            default: null,
            type: cc.Label
        },
        labelRivalLevel: {
            default: null,
            type: cc.Label
        },
        btnoSkip: {
            default: null,
            type: cc.Button
        }
    },

    onLoad: function () {
        this.nodeAutoBattle.active = false;
        if (GlobalFunc.isAllScreen()) {
            this.widgetTop.top = 70;
            this.widgetTop.updateAlignment();
        } else {
            let topWidget = this.node.getChildByName("spriteTop").getComponent(cc.Widget);
            topWidget.top = -this.node.getChildByName("spriteTop").height;
            topWidget.updateAlignment();
        }
        this.btnoSkip.node.active = false;
    },

    start: function () {

    },

    update: function (dt) {
        this.updateSelfHp();
        this.updateRivalHp();
    },

    updateSelfHp: function () {
        let selfPlane = this.scenarioManager.getArenaPlane(0);
        if (this.barSelfHp && selfPlane) {
            if (selfPlane.maxHp != 0) {
                this.barSelfHp.getComponent(cc.ProgressBar).progress = selfPlane.hp / selfPlane.maxHp;
            } else {
                this.barSelfHp.getComponent(cc.ProgressBar).progress = 1;
            }
        }
    },

    updateRivalHp: function () {
        let rivalPlane = this.scenarioManager.getArenaPlane(1);
        if (this.barRivalHp && rivalPlane) {
            if (rivalPlane.maxHp != 0) {
                this.barRivalHp.getComponent(cc.ProgressBar).progress = rivalPlane.hp / rivalPlane.maxHp;
            } else {
                this.barRivalHp.getComponent(cc.ProgressBar).progress = 1;
            }
        }
    },

    onBtnSkip: function () {
        if (this.battleManager.gameState == BattleDefines.GameResult.RUNNING) {
            this.battleManager.gameState = BattleDefines.GameResult.INTERRUPT;
            this.btnoSkip.interactable = false;
        }
        //GlobalVar.sceneManager().gotoScene(SceneDefines.MAIN_STATE);
    },

    playAutoBattle: function (play) {
        play = typeof play !== 'undefined' ? play : true;
        if (play) {
            this.nodeAutoBattle.active = true;
            this.animeAutoBattle.play();
        } else {
            this.nodeAutoBattle.active = false;
            this.animeAutoBattle.stop();
        }
    },

    playStart: function (play) {
        play = typeof play !== 'undefined' ? play : true;
        if (play) {
            this.nodeBattleStart.active = true;
            this.animeBattleStart.play();
            this.btnoSkip.node.setPosition(this.btnoSkip.node.width, 0);
            this.btnoSkip.node.active = true;
            this.btnoSkip.node.runAction(cc.sequence(cc.delayTime(1), cc.moveBy(0.2, cc.v2(-this.btnoSkip.node.width, 0))));
        } else {
            this.nodeBattleStart.active = false;
            this.animeBattleStart.stop();
        }
    },

    setBattleName: function (side, name) {
        name = typeof name !== 'undefined' ? name : 'X';
        let en = true;
        for (let i = 0; i < name.length; i++) {
            let value = name.charCodeAt(i)
            if (!(value >= 65 && value <= 90 || value >= 97 && value <= 122)) {
                en = false;
                break;
            }
        }
        let len = 4;
        if (en) {
            len = 6;
        }
        let str = name;
        if (name.length > len) {
            str = name.substring(0, len);
            str += '...';
        }
        if (!side) {
            this.labelSelfName.string = str;
        } else {
            this.labelRivalName.string = str;
        }
    },
    setSelfLevel: function (level) {
        this.labelSelfLevel.string = typeof level !== 'undefined' ? level : 'O';
    },
    setRivalLevel: function (level) {
        this.labelRivalLevel.string = typeof level !== 'undefined' ? level : 'O';
    },
});