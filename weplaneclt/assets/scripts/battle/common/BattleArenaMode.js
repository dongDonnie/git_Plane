const Defines = require('BattleDefines')
const GlobalVar = require('globalvar')
const Mode = cc.Class({

    properties: {
        bulletId: 0,
        bulletNewList: [],
        bulletDeadList: [],
        bulletSelfBltList: [],
        bulletRivalBltList: [],
    },

    init () {
        this.battleManager = require('BattleManager').getInstance();
        let Collision = require('Collision');
        this.collision = new Collision();
    },

    update (dt) {
        this.updateNewList(dt);

        this.updateBltList(dt);

        this.updateDeadList(dt);
    },

    updateCollision(){
        for (let sBullet of this.bulletSelfBltList) {
            if (sBullet.objectType != Defines.ObjectType.OBJ_SELF_BULLET ||
                sBullet.baseObject == null ||
                sBullet.isDead) {
                continue;
            }

            let bCollider = sBullet.getCollider();
            let a = this.updateCollider(bCollider);

            for (let monster of monsterList) {
                if (monster.objectType != Defines.ObjectType.OBJ_MONSTER ||
                    monster.baseObject == null ||
                    monster.isDead ||
                    monster.damageFromExecuteInterval > 0) {
                    continue;
                }

                let mCollider = monster.getCollider();
                let b = this.updateCollider(mCollider);

                if (this.collision.Intersects(a, b)) {
                    this.collision(exe, monster);
                    break;
                }
            }
        }
    },

    collision(objA, objB){
        if (objA.objectType == Defines.ObjectType.OBJ_MONSTER) {

            if (objB.objectType == Defines.ObjectType.OBJ_HERO) {
                this.collisionHeroWithMonster(objB, objA);
            } else if (objB.objectType == Defines.ObjectType.OBJ_HERO_BULLET) {
                this.collisionMonsterWithBullet(objA, objB);
            } else if (objB.objectType == Defines.ObjectType.OBJ_EXECUTE) {
                this.collisionMonsterWithHeroSkill(objB, objA);
            }

        } else if (objA.objectType == Defines.ObjectType.OBJ_MONSTER_BULLET) {

            if (objB.objectType == Defines.ObjectType.OBJ_HERO) {
                this.collisionHeroWithBullet(objB, objA);
            } else if (objB.objectType == Defines.ObjectType.OBJ_HERO_BULLET) {
                this.collisionHeroBulletWithMonsterBullet(objB, objA);
            }

        }
    },

    updateBltList(dt) {

        for (let bullet of this.bulletSelfBltList) {
            if (bullet.isDead) {
                this.bulletDeadList.push(bullet);
            } else {
                bullet.update(dt);
            }
        }

        for (let bullet of this.bulletRivalBltList) {
            if (bullet.isDead) {
                this.bulletDeadList.push(bullet);
            } else {
                bullet.update(dt);
            }
        }

    },

    updateNewList(dt) {
        for (let i = 0; i < this.bulletNewList.length; ++i) {
            this.newBullet(this.bulletNewList[i]);
        }

        this.bulletNewList.splice(0, this.bulletNewList.length);
    },

    updateDeadList(dt) {
        for (let i = 0; i < this.bulletDeadList.length; i++) {
            this.deleteBullet(this.bulletDeadList[i]);
        }
        this.bulletDeadList.splice(0, this.bulletDeadList.length);
    },

    getBulletId: function () {
        let id = this.bulletId;
        this.bulletId++;
        return id;
    },

    newBullet: function (bullet) {
        if (bullet.isDead) {
            return;
        }

        let z = 0;
        if (bullet.objectType == Defines.ObjectType.OBJ_SELF_BULLET) {

            z = bullet.newObject();
            this.bulletSelfBltList.push(bullet);
            this.battleManager.displayContainer.addChild(bullet, z);

        } else if (bullet.objectType == Defines.ObjectType.OBJ_RIVAL_BULLET) {

            z = bullet.newObject();
            this.bulletRivalBltList.push(bullet);
            this.battleManager.displayContainer.addChild(bullet, z);

        }
        
    },

    deleteBullet: function (bullet) {
        bullet.deleteObject();
        if (bullet.objectType == Defines.ObjectType.OBJ_SELF_BULLET) {

            for (let j = 0; j < this.bulletSelfBltList.length; ++j) {
                if (bullet == this.bulletSelfBltList[j]) {
                    this.bulletSelfBltList.splice(j, 1);
                    this.poolManager.putEntity(Defines.PoolType.BULLET, bullet);
                    break;
                }
            }
            this.battleManager.displayContainer.removeChild(bullet);

        } else if (bullet.objectType == Defines.ObjectType.OBJ_RIVAL_BULLET) {

            for (let j = 0; j < this.bulletRivalBltList.length; ++j) {
                if (bullet == this.bulletRivalBltList[j]) {
                    this.bulletRivalBltList.splice(j, 1);
                    this.poolManager.putEntity(Defines.PoolType.BULLET, bullet);
                    break;
                }
            }
            this.battleManager.displayContainer.removeChild(bullet);

        }
        bullet.reset();
    },

    primeBullet:function(bullet){
        this.entityNewList.push(bullet);
        bullet.entityId = this.getBulletId();
    },
});
