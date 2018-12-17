const Defines = require('BattleDefines')

var EntityManager = cc.Class({

    statics: {
        instance: null,
        getInstance: function () {
            if (EntityManager.instance == null) {
                EntityManager.instance = new EntityManager();
            }
            return EntityManager.instance;
        },
        destroyInstance() {
            if (EntityManager.instance != null) {
                delete EntityManager.instance;
                EntityManager.instance = null;
            }
        }
    },

    properties: {
        entityNewList: [],
        entityDeadList: [],
        entityMonBltList: [],
        entityHeroBltList: [],
        entityMonsterList: [],
        entityDeadMonsterList: [],
        entityBuffList: [],
        entityDeadBuffList: [],
        entityGoldList: [],
        entityDeadGoldList: [],
        entitySundriesList: [],
        entityDeadSundriesList: [],
        entityExecuteList: [],
        entityDeadExecuteList: [],
        entityId: 0,
        pauseDeadMonster: false,
    },

    start(mgr) {
        this.battleManager = require('BattleManager').getInstance();
        this.scenarioManager = require('ScenarioManager').getInstance();
        this.poolManager = require('PoolManager').getInstance();
    },

    update(dt, count) {

        this.updateNewList(dt);

        this.updateBltList(dt);

        this.updateMonsterList(dt, count);

        this.updateBuffList(dt);

        this.updateGoldList(dt, count);

        this.updateSundriesList(dt);

        this.updateExecuteList(dt);

        this.updateDeadList(dt);

    },

    updateDeadList(dt) {
        for (let i = 0; i < this.entityDeadList.length; i++) {
            this.deleteEntity(this.entityDeadList[i]);
        }
        this.entityDeadList.splice(0, this.entityDeadList.length);

        if (!this.pauseDeadMonster) {
            for (let j = 0; j < this.entityDeadMonsterList.length; j++) {
                this.deleteEntity(this.entityDeadMonsterList[j]);
            }
            this.entityDeadMonsterList.splice(0, this.entityDeadMonsterList.length);
        }

        for (let k = 0; k < this.entityDeadBuffList.length; k++) {
            this.deleteEntity(this.entityDeadBuffList[k]);
        }
        this.entityDeadBuffList.splice(0, this.entityDeadBuffList.length);

        for (let k = 0; k < this.entityDeadGoldList.length; k++) {
            this.deleteEntity(this.entityDeadGoldList[k]);
        }
        this.entityDeadGoldList.splice(0, this.entityDeadGoldList.length);

        for (let k = 0; k < this.entityDeadSundriesList.length; k++) {
            this.deleteEntity(this.entityDeadSundriesList[k]);
        }
        this.entityDeadSundriesList.splice(0, this.entityDeadSundriesList.length);

        for (let l = 0; l < this.entityDeadExecuteList.length; l++) {
            this.deleteEntity(this.entityDeadExecuteList[l]);
        }
        this.entityDeadExecuteList.splice(0, this.entityDeadExecuteList.length);
    },

    updateBltList(dt) {

        for (let entity of this.entityMonBltList) {
            if (entity.isDead) {
                this.entityDeadList.push(entity);
            } else {
                entity.update(dt);
            }
        }

        for (let entity of this.entityHeroBltList) {
            if (entity.isDead) {
                this.entityDeadList.push(entity);
            } else {
                entity.update(dt);
            }
        }

    },

    updateNewList(dt) {
        for (let i = 0; i < this.entityNewList.length; ++i) {
            this.newEntity(this.entityNewList[i]);
        }

        this.entityNewList.splice(0, this.entityNewList.length);
    },

    updateMonsterList(dt, count) {
        count = typeof count !== 'undefined' ? count : 0;
        for (let entity of this.entityMonsterList) {
            if (entity.isDead) {
                if (!this.pauseDeadMonster) {
                    this.entityDeadMonsterList.push(entity);
                    //this.scenarioManager.kill(entity);
                }
            } else {
                if (!count) {
                    entity.update(dt);
                } else {
                    for (let i = 0; i < count; i++) {
                        entity.update(dt);
                    }
                }
            }
        }
    },

    updateBuffList(dt) {
        for (let entity of this.entityBuffList) {
            if (entity.isDead) {
                this.entityDeadBuffList.push(entity);
            } else {
                entity.update(dt);
            }
        }
    },

    updateGoldList(dt, count) {
        count = typeof count !== 'undefined' ? count : 0;
        for (let entity of this.entityGoldList) {
            if (entity.isDead) {
                this.entityDeadGoldList.push(entity);
            } else {
                if (!count) {
                    entity.update(dt);
                } else {
                    for (let i = 0; i < count; i++) {
                        entity.update(dt);
                    }
                }
            }
        }
    },

    updateSundriesList(dt) {
        for (let entity of this.entitySundriesList) {
            if (entity.isDead) {
                this.entityDeadSundriesList.push(entity);
            } else {
                entity.update(dt);
            }
        }
    },

    updateExecuteList(dt) {
        for (let entity of this.entityExecuteList) {
            if (entity.isDead) {
                this.entityDeadExecuteList.push(entity);
            } else {
                entity.update(dt);
            }
        }
    },

    setPauseDeadMonster(pause) {
        this.pauseDeadMonster = typeof pause !== 'undefined' ? pause : false;
    },

    pauseEntity() {
        for (let entity of this.entityMonsterList) {
            entity.pauseAction();
        }
        for (let entity of this.entityMonBltList) {
            entity.pauseAction();
        }
        for (let entity of this.entityHeroBltList) {
            entity.pauseAction();
        }
        for (let entity of this.entityBuffList) {
            entity.pauseAction();
        }
        for (let entity of this.entityExecuteList) {
            entity.pauseAction();
        }
    },

    resumeEntity() {
        for (let entity of this.entityMonsterList) {
            entity.resumeAction();
        }
        for (let entity of this.entityMonBltList) {
            entity.resumeAction();
        }
        for (let entity of this.entityHeroBltList) {
            entity.resumeAction();
        }
        for (let entity of this.entityBuffList) {
            entity.resumeAction();
        }
        for (let entity of this.entityExecuteList) {
            entity.resumeAction();
        }
    },

    getEntityId: function () {
        let id = this.entityId;
        this.entityId++;
        return id;
    },

    newEntity: function (entity) {
        if (entity.isDead) {
            return;
        }

        //entity.entityId = this.getEntityId();

        let z = 0;
        if (entity.objectType == Defines.ObjectType.OBJ_HERO_BULLET) {

            z = entity.newObject();
            this.entityHeroBltList.push(entity);

        } else if (entity.objectType == Defines.ObjectType.OBJ_MONSTER_BULLET) {

            z = entity.newObject();
            this.entityMonBltList.push(entity);

        } else if (entity.objectType == Defines.ObjectType.OBJ_MONSTER) {

            z = entity.newObject();
            this.entityMonsterList.push(entity);

        } else if (entity.objectType == Defines.ObjectType.OBJ_BUFF) {

            z = entity.newObject();
            this.entityBuffList.push(entity);

        } else if (entity.objectType == Defines.ObjectType.OBJ_GOLD) {

            z = entity.newObject();
            this.entityGoldList.push(entity);

        } else if (entity.objectType == Defines.ObjectType.OBJ_SUNDRIES) {

            z = entity.newObject();
            this.entitySundriesList.push(entity);

        } else if (entity.objectType == Defines.ObjectType.OBJ_EXECUTE) {

            z = entity.newObject();
            this.entityExecuteList.push(entity);

        }

        if (z != -1) {
            this.battleManager.displayContainer.addChild(entity, z);
        }
    },

    deleteEntity: function (entity) {
        if (entity.objectType != Defines.ObjectType.OBJ_MONSTER) {
            entity.deleteObject();

            if (entity.objectType == Defines.ObjectType.OBJ_HERO_BULLET) {

                for (let j = 0; j < this.entityHeroBltList.length; ++j) {
                    if (entity == this.entityHeroBltList[j]) {
                        this.entityHeroBltList.splice(j, 1);
                        this.poolManager.putEntity(Defines.PoolType.BULLET, entity);
                        break;
                    }
                }

            } else if (entity.objectType == Defines.ObjectType.OBJ_MONSTER_BULLET) {

                for (let j = 0; j < this.entityMonBltList.length; ++j) {
                    if (entity == this.entityMonBltList[j]) {
                        this.entityMonBltList.splice(j, 1);
                        this.poolManager.putEntity(Defines.PoolType.BULLET, entity);
                        break;
                    }
                }

            } else if (entity.objectType == Defines.ObjectType.OBJ_BUFF) {

                for (let j = 0; j < this.entityBuffList.length; ++j) {
                    if (entity == this.entityBuffList[j]) {
                        this.entityBuffList.splice(j, 1);
                        this.poolManager.putEntity(Defines.PoolType.BUFF, entity);
                        break;
                    }
                }

            } else if (entity.objectType == Defines.ObjectType.OBJ_GOLD) {

                for (let j = 0; j < this.entityGoldList.length; ++j) {
                    if (entity == this.entityGoldList[j]) {
                        this.entityGoldList.splice(j, 1);
                        this.poolManager.putEntity(Defines.PoolType.BUFF, entity);
                        break;
                    }
                }

            } else if (entity.objectType == Defines.ObjectType.OBJ_SUNDRIES) {

                for (let j = 0; j < this.entitySundriesList.length; ++j) {
                    if (entity == this.entitySundriesList[j]) {
                        this.entitySundriesList.splice(j, 1);
                        this.poolManager.putEntity(Defines.PoolType.SUNDRIES, entity);
                        break;
                    }
                }

            } else if (entity.objectType == Defines.ObjectType.OBJ_EXECUTE) {

                for (let j = 0; j < this.entityExecuteList.length; ++j) {
                    if (entity == this.entityExecuteList[j]) {
                        this.entityExecuteList.splice(j, 1);
                        this.poolManager.putEntity(Defines.PoolType.EXECUTE, entity);
                        break;
                    }
                }

            }

            entity.reset();
            this.battleManager.displayContainer.removeChild(entity);
        } else {

            for (let j = 0; j < this.entityMonsterList.length; ++j) {
                if (entity == this.entityMonsterList[j]) {
                    this.entityMonsterList.splice(j, 1);
                    if (entity.clearBulletWhenDead) {
                        require('AIInterface').eliminateBulletByOwner(entity, true, false);
                    }
                    var self = this;
                    entity.deathMode(function (monster) {
                        monster.deleteObject();
                        if (!!monster.isKill) {
                            self.scenarioManager.kill(monster);
                        }
                        self.poolManager.putEntity(Defines.PoolType.MONSTER, monster);
                        monster.reset();
                        self.battleManager.displayContainer.removeChild(monster);
                    })
                    //this.scenarioManager.kill(entity);
                    //this.poolManager.putEntity(Defines.PoolType.MONSTER, entity);

                    break;
                }
            }

        }


    },

    deleteAllMonsters() {
        for (let entity of this.entityMonsterList) {
            entity.isDead = true;
        }
    },

    deleteAllMonsterBullets(disappearAnime) {
        for (let entity of this.entityMonBltList) {
            entity.isDead = true;
            entity.disappearAnime = typeof disappearAnime !== 'undefined' ? disappearAnime : false;
            if (entity.disappearAnime) {
                entity.disappearPos = entity.getPosition();
            }
        }
    },

    deleteAllHeroBullets() {
        for (let entity of this.entityHeroBltList) {
            entity.isDead = true;
        }
    },

    deleteBulletsByOwner(owner, needDisappearAnime) {
        if (typeof owner === 'undefined' || owner == null) {
            return;
        }

        if (owner.objectType == Defines.ObjectType.OBJ_HERO) {
            for (let entity of this.entityHeroBltList) {
                if (entity.owner.uuid == owner.uuid) {
                    entity.isDead = true;
                }
            }
        } else if (owner.objectType == Defines.ObjectType.OBJ_MONSTER) {
            for (let entity of this.entityMonBltList) {
                if (entity.owner.uuid == owner.uuid) {
                    entity.isDead = true;
                    if (needDisappearAnime) {
                        entity.disappearAnime = needDisappearAnime;
                        entity.disappearPos = entity.getPosition();
                    }
                }
            }
        }

    },
});