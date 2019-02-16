const Defines = require('BattleDefines')
const BattleEndlessMode = require('BattleEndlessMode')
const BattleCampaignMode = require('BattleCampaignMode')
const BattleArenaMode = require('BattleArenaMode')

var ScenarioManager = cc.Class({
    statics: {
        instance: null,
        getInstance: function () {
            if (ScenarioManager.instance == null) {
                ScenarioManager.instance = new ScenarioManager();
            }
            return ScenarioManager.instance;
        },
        destroyInstance() {
            if (ScenarioManager.instance != null) {
                delete ScenarioManager.instance;
                ScenarioManager.instance = null;
            }
        }
    },

    properties: {

    },

    start(mgr) {
        this.battleManager = require('BattleManager').getInstance();
    },

    update(dt,count) {
        if (this.battleManager.isDemo) {
            return;
        }

        this.curTime += dt;
        this.interval += dt;

        if (this.battleManager.isEndlessFlag && !!this.battleEndlessMode) {
            this.battleEndlessMode.update(dt,count);
        }

        if (this.battleManager.isShowFlag && !!this.battleCampaignMode) {
            this.battleCampaignMode.update(dt);
        }

        if (this.battleManager.isCampaignFlag && !!this.battleCampaignMode && !this.end) {
            this.battleCampaignMode.update(dt);
            if (this.battleCampaignMode.step == 12) {
                this.end = true;
            }
        }

        if (this.battleManager.isArenaFlag && !!this.battleArenaMode) {
            this.battleArenaMode.update(dt);
        }

        this.comboKillCurTime += dt;
        if (this.comboKillCurTime >= this.comboKillHoldTime) {
            this.battleManager.comboKill = 0;
        }

        if (this.secondKill > 0) {
            this.secondKillTime += dt;
            if (this.secondKillTime >= 0.8) {
                this.secondKill = 0;
                this.secondKillTime = 0;
            }
        }
    },

    mapUpdate(dt){
        if (this.battleManager.isEndlessFlag && cc.isValid(this.battleEndlessMode)) {
            this.battleEndlessMode.mapUpdate(dt);
        }

        if (this.battleManager.isShowFlag && cc.isValid(this.battleCampaignMode)) {
            this.battleCampaignMode.mapUpdate(dt);
        }

        if (this.battleManager.isCampaignFlag && cc.isValid(this.battleCampaignMode) && !this.end) {
            this.battleCampaignMode.mapUpdate(dt);
        }
    },

    initScenario: function (mapName) {

        if (!!this.battleManager.isEndlessFlag) {
            this.battleEndlessMode = new BattleEndlessMode();
            this.battleEndlessMode.init(mapName);
        }

        if (!!this.battleManager.isShowFlag) {
            this.battleCampaignMode = new BattleCampaignMode();
            this.battleCampaignMode.init(mapName);
        }

        if (!!this.battleManager.isCampaignFlag) {
            this.battleCampaignMode = new BattleCampaignMode();
            this.battleCampaignMode.init(mapName);
        }

        if (!!this.battleManager.isArenaFlag) {
            this.battleArenaMode = new BattleArenaMode();
            this.battleArenaMode.init();
        }

        this.comboKillHoldTime = 1.6;
        this.comboKillCurTime = 0;
        this.secondKill = 0;
        this.secondKillTime = 0;

        this.end = false;
        return;
    },

    prime:function(bullet){
        if (this.battleManager.isArenaFlag && !!this.battleArenaMode) {
            this.battleArenaMode.primeBullet(bullet);
        }
    },

    getArenaPlane:function(side){
        if (this.battleManager.isArenaFlag && !!this.battleArenaMode) {
            return this.battleArenaMode.getPlane(side);
        }
        return null;
    },

    kill: function (entity) {
        if (entity.objectType != Defines.ObjectType.OBJ_MONSTER) {
            return;
        }

        if (entity.canDrop) {
            this.battleManager.comboKill++;
            if (this.battleManager.comboKill > 999) {
                this.battleManager.comboKill = 999;
            }

            this.secondKill++;
            if (this.secondKill >= 10) {
                this.battleManager.unDefeat(1);
                this.secondKill = 0;
                this.secondKillTime = 0;
            }

            if (this.battleManager.comboKill % 100 == 0 && this.battleManager.comboKill != 0) {
                this.battleManager.unDefeat(0);
            }
            this.comboKillCurTime = 0;
        }

        if (this.battleManager.isEndlessFlag && !!this.battleEndlessMode) {
            this.battleEndlessMode.kill(entity);
        }
        if (this.battleManager.isShowFlag && !!this.battleCampaignMode) {
            this.battleCampaignMode.kill(entity);
        }
        if (this.battleManager.isCampaignFlag && !!this.battleCampaignMode) {
            this.battleCampaignMode.kill(entity);
        }
    },

    tryDropItem: function (mode, entity) {
        if (this.battleManager.isEndlessFlag && !!this.battleEndlessMode) {
            this.battleEndlessMode.tryDropItem(mode, entity);
        }
    }
});