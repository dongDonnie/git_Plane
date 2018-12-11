const GlobalVar = require('globalvar')
const EntityManager = require('EntityManager')
const BattleManager = require('BattleManager')
const CoreObject = require('CoreObject')

cc.Class({
    extends: CoreObject,

    properties: {
        anime: {
            default: null,
            type: cc.Animation
        },
        selfEntity: {
            default: null,
            visible: false
        },
    },

    onLoad: function () {

    },

    setEntity: function (entity) {
        this.selfEntity = typeof entity !== 'undefined' ? entity : null;
    },

    animePlay: function (index) {
        switch (index) {
            case 0:
                this.anime.play();
                break;
            case 1:
                this.anime.pause();
                break;
            case 2:
                this.anime.resume();
                break;
        }
    },

    animePlayCallBack: function (name) {
        if (name == "Complete") {
            if (!!this.selfEntity) {
                this.selfEntity.isDead = true;
            }
        } else if (name == "Start") {
            GlobalVar.soundManager().playEffect('cdnRes/audio/battle/effect/explode_skill');
            for (let monster of EntityManager.getInstance().entityMonsterList){
                monster.setDamageFromExecuteIntervalSet(this.selfEntity.damageInterval);
            }
        } else if (name == "Process") {
            BattleManager.getInstance().screenShake();
            if(this.selfEntity.getAllScreenDamage()){
                let collision = BattleManager.getInstance().collision;
                for (let monster of EntityManager.getInstance().entityMonsterList) {
                    monster.setDamageFromExecuteInterval();
                    collision.collisionMonsterWithHeroSkill(this.selfEntity,monster);
                }
            }
        }
    }
});