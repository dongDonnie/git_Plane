const GlobalVar = require("globalvar");
const BattleDefines = require('BattleDefines');
const SceneDefines = require("scenedefines");
const SceneBase = require("scenebase");
const BattleManager = require('BattleManager');

var BattleScene = cc.Class({
    extends: SceneBase,
    ctor: function () {
        this.uiNode = null;
    },

    properties: {

    },

    onLoad: function () {
        //cc.game.on(cc.game.EVENT_HIDE, this.hide, this);
        //cc.game.on(cc.game.EVENT_SHOW, this.show, this);
        this.sceneName = "BattleScene";
        this.battleManager = BattleManager.getInstance();
        this.uiNode = cc.find("Canvas/UINode");
        this.openScene();
        if (!!this.battleManager.isArenaFlag) {
            this.battleManager.startArena(this.node, cc.find('Canvas/ArenaSelfNode'), cc.find('Canvas/ArenaRivalNode'), cc.find('Canvas/GameNode'));
        } else {
            this.battleManager.start(this.node, cc.find('Canvas/GameNode'));
        }

        if (this.battleManager.getMusic() != null) {
            GlobalVar.soundManager().playBGM("cdnRes/" + this.battleManager.getMusic());
        }
    },

    start: function () {
        if (!!this.battleManager.isArenaFlag) {
            var self = this;
            this.loadPrefab("UIBattleArena", function () {
                self.uiNode.getChildByName('UIBattle').active = false;
            });
            let asNode = cc.find('Canvas/ArenaSelfNode');
            let arNode = cc.find('Canvas/ArenaRivalNode');
            let pos = asNode.getPosition();
            arNode.width = asNode.width;
            arNode.height = asNode.height;
            arNode.angle = 180;
            arNode.setPosition(-pos.x, -pos.y);
        } else {
            //this.loadPrefab("UIBattle");
        }
    },

    onDestroy() {
        this.releaseScene();
    },

    update: function (dt) {
        if (!!this.battleManager.isArenaFlag) {
            this.battleManager.updateArena(dt);
            if (this.battleManager.gameState == BattleDefines.GameResult.PREPARE) {
                this.showCountWnd();
                this.battleManager.gameState = BattleDefines.GameResult.COUNT;
            } else if (this.battleManager.gameState == BattleDefines.GameResult.END) {
                this.showArenaEndWnd();
                this.battleManager.gameState = BattleDefines.GameResult.NONE;
            }
        } else {
            this.battleManager.update(dt);
            if (this.battleManager.gameState == BattleDefines.GameResult.INTERRUPT) {
                this.showPauseWnd();
                this.battleManager.gameState = BattleDefines.GameResult.PAUSE;
            } else if (this.battleManager.gameState == BattleDefines.GameResult.END) {
                this.showEndWnd();
                this.battleManager.gameState = BattleDefines.GameResult.NONE;
            } else if (this.battleManager.gameState == BattleDefines.GameResult.PREPARE) {
                this.showCountWnd();
                this.battleManager.gameState = BattleDefines.GameResult.PAUSE;
            } else if (this.battleManager.gameState == BattleDefines.GameResult.CARD) {
                this.showDrawRewardWnd();
                this.battleManager.gameState = BattleDefines.GameResult.NONE;
            } else if (this.battleManager.gameState == BattleDefines.GameResult.WAITREVIVE) {
                this.showReviveWnd();
                this.battleManager.gameState = BattleDefines.GameResult.PAUSE;
            } else if (this.battleManager.gameState == BattleDefines.GameResult.DASHOPEN) {
                this.showChargeWnd();
                this.battleManager.gameState = BattleDefines.GameResult.SHOW;
            } else if (this.battleManager.gameState == BattleDefines.GameResult.GETASSIST) {
                this.showGetAssistWnd();
                this.battleManager.gameState = BattleDefines.GameResult.PAUSE;
            }
        }
    },

    releaseScene: function () {
        this._super();
        this.battleManager.release();
        BattleManager.destroyInstance();
    },

    showPauseWnd() {
        this.loadPrefab("UIBattlePause");
    },

    showEndWnd() {
        if (!GlobalVar.me().isKickedOut) {
            this.loadPrefab("UIBattleEnd");
        } else {
            GlobalVar.sceneManager().gotoScene(SceneDefines.LOGIN_STATE);
        }
    },

    showCountWnd() {
        this.loadPrefab("UIBattleCount");
    },

    showDrawRewardWnd() {
        this.loadPrefab("UIBattleCard");
    },

    showReviveWnd() {
        this.loadPrefab("UIBattleRevive");
    },

    showChargeWnd() {
        this.loadPrefab("UIBattleCharge");
    },

    showGetAssistWnd() {
        this.loadPrefab("UIBattleAssist");
    },

    showArenaEndWnd() {
        this.loadPrefab("UIBattleArenaEnd");
    }
});