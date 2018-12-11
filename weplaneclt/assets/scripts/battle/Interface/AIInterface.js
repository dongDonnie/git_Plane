const Defines = require('BattleDefines')
const EntityManager = require('EntityManager')
const BattleManager = require('BattleManager')
const Factory = require('Factory')

var AIInterface = cc.Class({
    statics: {

        createBullet: function (id, owner, pos_plus) {
            let bullet = Factory.getInstance().produceBullet(id, owner, pos_plus);
            EntityManager.getInstance().entityNewList.push(bullet);
            bullet.entityId = EntityManager.getInstance().getEntityId();
            return bullet;
        },

        createFake: function (entity, type) {
            let fake = Factory.getInstance().produceFake(entity, type);
            return fake;
        },

        createMonster: function (info) {
            let monster = Factory.getInstance().produceMonster(info);
            monster.entityId = EntityManager.getInstance().getEntityId();
            EntityManager.getInstance().entityNewList.push(monster);
            return monster;
        },

        createBuff: function (id, pos, elastic,drop) {
            let buff = Factory.getInstance().produceBuff(id, pos, elastic,drop);
            buff.entityId = EntityManager.getInstance().getEntityId();
            EntityManager.getInstance().newEntity(buff);
            //EntityManager.getInstance().entityNewList.push(buff);
            return buff;
        },

        createSundries: function (id, pos,target,hp) {
            let sundries = Factory.getInstance().produceSundries(id, pos,target,hp);
            sundries.entityId = EntityManager.getInstance().getEntityId();
            EntityManager.getInstance().newEntity(sundries);
            //EntityManager.getInstance().entityNewList.push(sundries);
            return sundries;
        },

        createExecute: function (id, pos) {
            let execute = Factory.getInstance().produceExecute(id, pos);
            EntityManager.getInstance().entityNewList.push(execute);
            execute.entityId = EntityManager.getInstance().getEntityId();
            return execute;
        },

        releaseEntity: function (entity) {
            entity.isDead = true;
        },

        eliminateAllMonsters() {
            EntityManager.getInstance().deleteAllMonsters();
        },

        eliminateAllHeroBullets(onlyDeleteLine) {
            onlyDeleteLine = typeof onlyDeleteLine !== 'undefined' ? onlyDeleteLine : true;
            Factory.getInstance().shutdownByLineType(Defines.ObjectType.OBJ_FAKE_HERO);
            if (!onlyDeleteLine) {
                EntityManager.getInstance().deleteAllHeroBullets();
            }
        },

        eliminateAllMonsterBullets(onlyDeleteLine, disappearAnime) {
            onlyDeleteLine = typeof onlyDeleteLine !== 'undefined' ? onlyDeleteLine : true;
            Factory.getInstance().shutdownByLineType(Defines.ObjectType.OBJ_FAKE);
            if (!onlyDeleteLine) {
                EntityManager.getInstance().deleteAllMonsterBullets(disappearAnime);
            }
        },

        eliminateBulletByOwner(owner, needDisappearAnime,onlyDeleteLine) {
            onlyDeleteLine = typeof onlyDeleteLine !== 'undefined' ? onlyDeleteLine : true;
            needDisappearAnime=typeof needDisappearAnime!=='undefined'?needDisappearAnime:true;
            Factory.getInstance().shutdownByCustomer(owner);
            if (!onlyDeleteLine) {
                EntityManager.getInstance().deleteBulletsByOwner(owner,needDisappearAnime);
            }
        },

        eliminateAllBullets(onlyDeleteLine) {
            this.eliminateAllHeroBullets(onlyDeleteLine);
            this.eliminateAllMonsterBullets(onlyDeleteLine);
        },

        useSuperSkill() {
            let hero = require('HeroManager').getInstance().planeEntity;
            let id = hero.getSuperSkill();
            if (id != -1) {
                let cd = hero.useSkill(id);
                return cd;
            } else {
                return -1;
            }
        },

        useSkill: function (entity, skillId) {
            if (entity.objectType == Defines.ObjectType.OBJ_MONSTER) {
                entity.useSkill(skillId);
            }
        },

        autoUseSkill: function (entity, open) {
            if (entity.objectType == Defines.ObjectType.OBJ_MONSTER) {
                entity.autoSkillSwitch(open);
            }
        },

        setMonsterLoopAction(entity, actName) {
            let obj = entity.getObject();
            if (obj != null) {
                return obj.setDefaultAction(actName);
            }
            return false;
        },

        playAction(entity, actName, loop, callback) {
            let obj = entity.getObject();
            if (obj != null) {
                return obj.playAction(actName, loop, callback);
            }
            return null;
        },

        addAction:function(entity,actName,loop,callback){
            let obj = entity.getObject();
            if (obj != null) {
                return obj.playAction(actName, loop, callback);
            }
            return null;
        },

        findAction(entity, name) {
            if (typeof entity !== 'undefined' && entity != null) {
                let obj = entity.getObject();
                if (obj != null) {
                    return obj.findAction(name);
                }
                return null;
            }
            return null;
        },

        stopAction(entity){
            let obj = entity.getObject();
            if (obj != null) {
                return obj.stop();
            }
            return false;
        },

        getHero() {
            return require('HeroManager').getInstance().planeEntity;
        },

        randMonster() {
            let length = EntityManager.getInstance().entityMonsterList.length;
            if (length == 0) {
                return null;
            }
            let idx = Math.floor(Math.random() * length);
            return EntityManager.getInstance().entityMonsterList[idx];
        },

        getHeroPosition() {
            return require('HeroManager').getInstance().planeEntity.getPosition();
        },

        speedTransfer(speed, angle) {
            speed = typeof speed !== 'undefined' ? speed : 0;
            angle = typeof angle !== 'undefined' ? angle : 0;
            let v=cc.v3(Math.cos(angle * Math.PI / 180),Math.sin(angle * Math.PI / 180));
            return v.mul(speed);
        },

        getAngle(origin, target) {
            target = typeof target !== 'undefined' ? target : cc.v3(0, 0);
            origin = typeof origin !== 'undefined' ? origin : cc.v3(0, 0);
            let v = target.sub(origin);
            return Math.atan2(v.y,v.x) * 180 / Math.PI;
        },

        posTransfer(pospercent) {
            let designSize = cc.view.getDesignResolutionSize();
            let pos = cc.v3(0, 0);

            if (pospercent.x >= 0 && pospercent.x <= 1) {
                pos.x = cc.winSize.width * pospercent.x;
            } else {
                if (pospercent.x > 1) {
                    pos.x = cc.winSize.width + designSize.width * (pospercent.x - 1);
                } else {
                    pos.x = designSize.width * pospercent.x;
                }
            }

            if (pospercent.y >= 0 && pospercent.y <= 1) {
                pos.y = cc.winSize.height * pospercent.y;
            } else {
                if (pospercent.y > 1) {
                    pos.y = cc.winSize.height + designSize.height * (pospercent.y - 1);
                } else {
                    pos.y = designSize.height * pospercent.y;
                }
            }

            return pos;
        },

        splitStringPos:function(pos){
            let p = pos.split(',');
            let v = cc.v3(Number(p[0]), Number(p[1]));
            return this.posTransfer(v);
        },

        allBuffChaseToHero:function(){
            let pos=require('HeroManager').getInstance().planeEntity.getPosition();
            for (let entity of EntityManager.getInstance().entityBuffList){
                entity.chaseHero(pos.sub(entity.getPosition()).mul(2), pos.sub(entity.getPosition()).mul(2), 0, 0, 1);
                entity.setMovementType(3);
            }
        },

        getDisPlayContentSize:function(){
            let battleManager=require('BattleManager').getInstance();
            if(typeof battleManager.displayContainer !=='undefined' && battleManager.displayContainer!=null){
                let size=battleManager.displayContainer.getContentSize();
                if (battleManager.allScreen) {
                    size.height -= 130;
                } else {
                    size.height -= 47;
                }

                return size;
            }
            return cc.size(0,0);
        },
    },

});