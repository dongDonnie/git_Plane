const Defines = require('BattleDefines')
const GlobalVar = require("globalvar")
const BattleManager = require('BattleManager')
const EntityManager = require('EntityManager')

cc.Class({
    statics: {

    },

    properties: {

    },

    ctor() {
        this.heroManager = require('HeroManager').getInstance();
    },

    update(dt) {

        let heroManager = this.heroManager;

        let heroBltList = EntityManager.getInstance().entityHeroBltList;
        let executeList = EntityManager.getInstance().entityExecuteList;
        let monsterList = EntityManager.getInstance().entityMonsterList;
        let monsterBltList = EntityManager.getInstance().entityMonBltList;
        let buffList = EntityManager.getInstance().entityBuffList;
        let sundriesList = EntityManager.getInstance().entitySundriesList;

        for (let exe of executeList) {
            if (exe.objectType != Defines.ObjectType.OBJ_EXECUTE ||
                exe.baseObject == null ||
                exe.isDead) {
                continue;
            }

            let eCollider = exe.getCollider();
            let a = this.updateCollider(eCollider);

            for (let monster of monsterList) {
                if (monster.objectType != Defines.ObjectType.OBJ_MONSTER ||
                    monster.baseObject == null ||
                    monster.isDead ||
                    monster.damageFromExecuteInterval > 0) {
                    continue;
                }

                let mCollider = monster.getCollider();
                let b = this.updateCollider(mCollider);

                if (this.Intersects(a, b)) {
                    this.collision(exe, monster);
                    break;
                }
            }
        }

        for (let blt of heroBltList) {
            if (blt.objectType != Defines.ObjectType.OBJ_HERO_BULLET ||
                blt.baseObject == null ||
                blt.isDead) {
                continue;
            }

            let bCollider = blt.getCollider();
            let a = this.updateCollider(bCollider);

            for (let sundries of sundriesList) {
                if (sundries.objectType != Defines.ObjectType.OBJ_SUNDRIES ||
                    sundries.baseObject == null || !sundries.collisionSwitch ||
                    sundries.isDead || !sundries.isShow) {
                    continue;
                }

                let mSundries = sundries.getCollider();
                let b = this.updateCollider(mSundries);

                if (this.Intersects(a, b)) {
                    this.collision(blt, sundries);
                    break;
                }
            }

            let collided = false;
            for (let monster of monsterList) {
                if (monster.objectType != Defines.ObjectType.OBJ_MONSTER ||
                    monster.baseObject == null ||
                    monster.isDead) {
                    continue;
                }

                let mCollider = monster.getCollider();
                let b = this.updateCollider(mCollider);

                if (this.Intersects(a, b)) {
                    this.collision(blt, monster);
                    collided = true;
                    break;
                }
            }

            // if (!collided) {
            //     for (let monsterBlt of monsterBltList) {
            //         if (monsterBlt.objectType != Defines.ObjectType.OBJ_MONSTER_BULLET ||
            //             monsterBlt.baseObject == null ||
            //             monsterBlt.isDead) {
            //             continue;
            //         }

            //         if (monsterBlt.checkPointInNode(bPos)) {
            //             this.collision(blt, monsterBlt);
            //             break;
            //         }
            //     }
            // }
        }

        if (!!heroManager.planeEntity && cc.isValid(heroManager.planeEntity)) {

            if (heroManager.planeEntity.hp <= 0) {
                return;
            }

            let pCollider = null;
            let originCollider = null;
            if (heroManager.planeEntity.barrier != null && cc.isValid(heroManager.planeEntity.barrier) && heroManager.planeEntity.protectTime > 0) {
                pCollider = heroManager.planeEntity.barrier.getComponent(cc.BoxCollider);
                originCollider = heroManager.planeEntity.getCollider();
            } else {
                pCollider = heroManager.planeEntity.getCollider();
            }

            let a = this.updateCollider(pCollider);

            let c = null;
            if (originCollider != null) {
                c = this.updateCollider(originCollider);
            }

            for (let buff of buffList) {
                if (buff.objectType != Defines.ObjectType.OBJ_BUFF ||
                    !cc.isValid(buff.baseObject) ||
                    buff.isDead) {
                    continue;
                }

                let mBuff = buff.getCollider();
                let b = this.updateCollider(mBuff);

                if (c != null) {
                    if (this.Intersects(c, b)) {
                        this.collision(buff, heroManager.planeEntity);
                        break;
                    }
                } else {
                    if (this.Intersects(a, b)) {
                        this.collision(buff, heroManager.planeEntity);
                        break;
                    }
                }
            }

            if (sundriesList.length > 0) {
                for (let sundries of sundriesList) {
                    if (sundries.objectType != Defines.ObjectType.OBJ_SUNDRIES ||
                        sundries.baseObject == null ||
                        sundries.isDead) {
                        continue;
                    }

                    let mSundries = sundries.getCollider();
                    let b = this.updateCollider(mSundries);

                    if (this.Intersects(a, b)) {
                        this.collision(sundries, heroManager.planeEntity);
                        break;
                    }
                }
            } else {
                let collided = false;
                for (let monster of monsterList) {
                    if (monster.objectType != Defines.ObjectType.OBJ_MONSTER ||
                        monster.baseObject == null ||
                        monster.isDead) {
                        continue;
                    }

                    let mCollider = monster.getCollider();
                    let b = this.updateCollider(mCollider);

                    if (this.Intersects(a, b)) {
                        this.collision(monster, heroManager.planeEntity);
                        collided = true;
                        break;
                    }
                }

                if (!collided) {
                    for (let blt of monsterBltList) {
                        if (blt.objectType != Defines.ObjectType.OBJ_MONSTER_BULLET ||
                            blt.baseObject == null ||
                            blt.isDead) {
                            continue;
                        }

                        let bCollider = blt.getCollider();
                        let b = this.updateCollider(bCollider);

                        if (this.Intersects(a, b)) {
                            this.collision(blt, heroManager.planeEntity);
                            break;
                        }
                    }
                }
            }
        }
    },

    obbApplyMatrix: function (rect, mat4, out_bl, out_tl, out_tr, out_br) {
        var x = rect.x;
        var y = rect.y;
        var width = rect.width;
        var height = rect.height;

        var m00 = mat4.m00,
            m01 = mat4.m01,
            m04 = mat4.m04,
            m05 = mat4.m05;
        var m12 = mat4.m12,
            m13 = mat4.m13;

        var tx = m00 * x + m04 * y + m12;
        var ty = m01 * x + m05 * y + m13;
        var xa = m00 * width;
        var xb = m01 * width;
        var yc = m04 * height;
        var yd = m05 * height;

        out_tl.x = tx;
        out_tl.y = ty;
        out_tr.x = xa + tx;
        out_tr.y = xb + ty;
        out_bl.x = yc + tx;
        out_bl.y = yd + ty;
        out_br.x = xa + yc + tx;
        out_br.y = xb + yd + ty;
    },

    updateCollider: function (collider) {
        let offset = collider.offset;
        let world = collider.world;
        let aabb = world.aabb;

        let m = world.matrix;
        collider.node.getWorldMatrix(m);
        let size = collider.size;

        aabb.x = offset.x - size.width / 2;
        aabb.y = offset.y - size.height / 2;
        aabb.width = size.width;
        aabb.height = size.height;

        let wps = world.points;
        let wp0 = wps[0];
        let wp1 = wps[1];
        let wp2 = wps[2];
        let wp3 = wps[3];
        this.obbApplyMatrix(aabb, m, wp0, wp1, wp2, wp3);

        let colliderPoint = [wp0, wp1, wp2, wp3];
        return colliderPoint;
        // let tempRect = cc.rect();

        // let offset = collider.offset;
        // let world = collider.world;

        // let t = world.transform = collider.node.getNodeToWorldTransformAR();

        // let size = collider.size;

        // tempRect.x = offset.x - size.width / 2;
        // tempRect.y = offset.y - size.height / 2;
        // tempRect.width = size.width;
        // tempRect.height = size.height;

        // let wps = world.points;
        // let wp0 = wps[0];
        // let wp1 = wps[1];
        // let wp2 = wps[2];
        // let wp3 = wps[3];
        // cc.obbApplyAffineTransform(tempRect, t, wp0, wp1, wp2, wp3);

        // let colliderPoint = [wp0, wp1, wp2, wp3];
        //return colliderPoint;
    },

    Intersects(a, b) {
        let axis = [];

        axis[0] = a[1].sub(a[0]);
        axis[1] = a[2].sub(a[1]);
        axis[2] = b[1].sub(b[0]);
        axis[3] = b[2].sub(b[1]);

        for (let i = 0; i < axis.length; i++) {
            let min_a = 999999;
            let max_a = -999999;
            let min_b = 999999;
            let max_b = -999999;
            for (let j = 0; j < axis.length; j++) {
                let vec_a = axis[i].x * a[j].x + axis[i].y * a[j].y;
                let vec_b = axis[i].x * b[j].x + axis[i].y * b[j].y;
                if (vec_a < min_a) min_a = vec_a;
                if (vec_a > max_a) max_a = vec_a;
                if (vec_b < min_b) min_b = vec_b;
                if (vec_b > max_b) max_b = vec_b;
            }

            if (!(min_b <= max_a && max_b >= min_a))
                return false;
        }
        return true;
    },

    InSide(touchPoint, colliderPoint) {
        let A_Path0 = colliderPoint[1].sub(colliderPoint[0]);
        let A_Path1 = colliderPoint[2].sub(colliderPoint[1]);
        let A_Path2 = colliderPoint[3].sub(colliderPoint[2]);
        let A_Path3 = colliderPoint[0].sub(colliderPoint[3]);
        let touch_Path0 = touchPoint.sub(colliderPoint[0]);
        let touch_Path1 = touchPoint.sub(colliderPoint[1]);
        let touch_Path2 = touchPoint.sub(colliderPoint[2]);
        let touch_Path3 = touchPoint.sub(colliderPoint[3]);

        let a0 = A_Path0.x * touch_Path0.y - A_Path0.y * touch_Path0.x;
        let a1 = A_Path1.x * touch_Path1.y - A_Path1.y * touch_Path1.x;
        let a2 = A_Path2.x * touch_Path2.y - A_Path2.y * touch_Path2.x;
        let a3 = A_Path3.x * touch_Path3.y - A_Path3.y * touch_Path3.x;
        if (a0 > 0 && a1 > 0 && a2 > 0 && a3 > 0) {
            return true;
        }
        return false;
    },

    collision(objA, objB) {

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

        } else if (objA.objectType == Defines.ObjectType.OBJ_HERO) {

            if (objB.objectType == Defines.ObjectType.OBJ_MONSTER) {
                this.collisionHeroWithMonster(objA, objB);
            } else if (objB.objectType == Defines.ObjectType.OBJ_MONSTER_BULLET) {
                this.collisionHeroWithBullet(objA, objB);
            } else if (objB.objectType == Defines.ObjectType.OBJ_BUFF) {
                this.collisionHeroWithBuff(objB, objA);
            } else if (objB.objectType == Defines.ObjectType.OBJ_GOLD) {
                this.collisionHeroWithBuff(objB, objA);
            } else if (objB.objectType == Defines.ObjectType.OBJ_SUNDRIES) {
                this.collisionHeroWithSundries(objB, objA);
            }

        } else if (objA.objectType == Defines.ObjectType.OBJ_HERO_BULLET) {

            if (objB.objectType == Defines.ObjectType.OBJ_MONSTER) {
                this.collisionMonsterWithBullet(objB, objA);
            } else if (objB.objectType == Defines.ObjectType.OBJ_MONSTER_BULLET) {
                this.collisionHeroBulletWithMonsterBullet(objA, objB);
            } else if (objB.objectType == Defines.ObjectType.OBJ_SUNDRIES) {
                this.collisionSundriesWithHeroBullet(objB, objA);
            }

        } else if (objA.objectType == Defines.ObjectType.OBJ_BUFF) {

            if (objB.objectType == Defines.ObjectType.OBJ_HERO) {
                this.collisionHeroWithBuff(objA, objB);
            }

        } else if (objA.objectType == Defines.ObjectType.OBJ_GOLD) {

            if (objB.objectType == Defines.ObjectType.OBJ_HERO) {
                this.collisionHeroWithBuff(objA, objB);
            }

        } else if (objA.objectType == Defines.ObjectType.OBJ_SUNDRIES) {

            if (objB.objectType == Defines.ObjectType.OBJ_HERO) {
                this.collisionHeroWithSundries(objA, objB);
            } else if (objB.objectType == Defines.ObjectType.OBJ_HERO_BULLET) {
                this.collisionSundriesWithHeroBullet(objA, objB);
            }

        } else if (objA.objectType == Defines.ObjectType.OBJ_EXECUTE) {

            if (objB.objectType == Defines.ObjectType.OBJ_MONSTER) {
                this.collisionMonsterWithHeroSkill(objA, objB);
            }

        }
    },

    collisionHeroWithBuff(buff, hero) {
        buff.isDead = true;
        if (buff.objectID == Defines.Assist.WEAPON_UP) {
            GlobalVar.soundManager().playEffect('cdnRes/audio/battle/effect/weapon_up');
            this.heroManager.skillLevelUp(1);
        } else if (buff.objectID == Defines.Assist.SUPER) {
            GlobalVar.soundManager().playEffect('cdnRes/audio/battle/effect/weapon_up');
            this.heroManager.skillLevelUp(3);
        } else if (buff.objectID == Defines.Assist.PROTECT) {
            hero.addProtectTime(Defines.PROTECT_TIME);
        } else if (buff.objectID == Defines.Assist.HP) {
            hero.addHP();
        } else if (buff.objectID == Defines.Assist.MP) {

        } else if (buff.objectID == Defines.Assist.DASH) {
            hero.addDashTime(Defines.DASH_TIME);
        } else if (buff.objectID == Defines.Assist.GHOST) {

        } else if (buff.objectID == Defines.Assist.GREENSTONE) {
            hero.addCrystal(1);
        } else if (buff.objectID == Defines.Assist.BLUESTONE) {
            hero.addCrystal(2);
        } else if (buff.objectID == Defines.Assist.PURPERSTONE) {
            hero.addCrystal(3);
        } else if (buff.objectID == Defines.Assist.GOLD) {
            hero.addGold(buff.objectID);
        } else if (buff.objectID >= Defines.Assist.CHEST1 && buff.objectID <= Defines.Assist.CHEST6) {
            hero.addChest(buff.objectID);
        }
    },

    collisionHeroWithSundries(sundries, hero) {
        if (sundries.collisionSwitch == false || sundries.isShow == false || !this.heroManager.controllable) {
            return;
        }

        hero.hitWithDamage(hero.maxHp * 0.1);
    },

    collisionSundriesWithHeroBullet(sundries, bullet) {
        if (sundries.collisionSwitch == false || sundries.isShow == false) {
            return;
        }

        let dmgMsg = {
            dmg: 0,
        };
        if (bullet.dmgMsg != null) {
            dmgMsg = bullet.dmgMsg;
        }
        dmgMsg.pos = sundries.getPosition();

        sundries.hitWithDamage(dmgMsg.dmg);
        bullet.isDead = true;

        return dmgMsg;
    },

    collisionHeroWithMonster(hero, monster) {
        if (monster.collisionSwitch == false || !this.heroManager.controllable) {
            return;
        }
        let dmg = 0;
        let level = 1;
        if (BattleManager.getInstance().isEndlessFlag) {
            level = 1;
        } else if (BattleManager.getInstance().isCampaignFlag) {
            level = 2;
        }
        let tblLvMonster = GlobalVar.tblApi.getDataByMultiKey('TblBattleLevelMonster', level, monster.lv);
        if (monster.tbl.dwType <= 4) {
            dmg = tblLvMonster.dwCollisionParam1;
        } else {
            dmg = tblLvMonster.dwCollisionParam2;
        }

        dmg *= monster.attackSuppress;
        dmg = Math.ceil(dmg);
        hero.hitWithDamage(dmg, monster.immediatelyKill);
    },

    collisionHeroWithBullet(hero, bullet) {
        if (!bullet.owner || !this.heroManager.controllable) {
            return 0;
        }

        let dmgMsg = {
            dmg: 0,
        };
        if (bullet.dmgMsg != null) {
            dmgMsg = bullet.dmgMsg;
        }
        hero.hitWithDamage(dmgMsg.dmg);
        bullet.isDead = true;
        if (hero.protectTime > 0 && hero.barrier != null && cc.isValid(hero.barrier)) {
            bullet.disappearAnime = true;
            let collider = hero.barrier.getComponent(cc.BoxCollider);
            let offset = collider.offset;
            let size = collider.size;
            let r = Math.min(size.width / 2, size.height / 2);
            let posH = hero.getPosition();
            let posB = bullet.getPosition();
            let posBO = bullet.baseObject != null ? bullet.baseObject.getPosition() : cc.v3(0, 0);
            let v = posBO.add(posB).sub(posH);
            let angle = Math.atan2(v.y, v.x) * 180 / Math.PI;
            let x1 = posH.x + offset.x + r * Math.cos(angle * Math.PI / 180);
            let y1 = posH.y + offset.y + r * Math.sin(angle * Math.PI / 180);
            bullet.disappearPos = cc.v3(x1, y1);
        }

        return dmgMsg;
    },

    collisionMonsterWithBullet(monster, bullet) {
        if (monster.collisionSwitch == false || monster.isShow == false) {
            return;
        }

        let dmgMsg = {
            dmg: 0,
        };
        if (bullet.dmgMsg != null) {
            dmgMsg = bullet.dmgMsg;
            dmgMsg.dmg *= monster.defendSuppress;
            dmgMsg.dmg = Math.ceil(dmgMsg.dmg);
        }
        dmgMsg.pos = monster.getPosition();

        dmgMsg.dmg = monster.hitWithDamage(dmgMsg.dmg);
        bullet.isDead = true;
        bullet.disappearAnime = true;
        let offset = cc.v3(monster.getCollider().offset);
        let size = monster.getCollider().size;
        let r = Math.min(size.width / 2, size.height / 2);
        let posM = monster.getPosition();
        if (monster.baseObject != null && cc.isValid(monster.baseObject)) {
            let posBM = monster.baseObject.getPosition();
            posM = posM.add(posBM).add(offset);
        }
        let posB = bullet.getPosition();
        let v = posB.sub(posM);
        let angle = Math.atan2(v.y, v.x) * 180 / Math.PI;
        let x1 = posM.x + r * Math.cos(angle * Math.PI / 180);
        let y1 = posM.y + r * Math.sin(angle * Math.PI / 180);
        bullet.disappearPos = cc.v3(x1, y1);
        monster.flyDamageMsg(dmgMsg.dmg, dmgMsg.critical, dmgMsg.pos, false);

        return dmgMsg;
    },

    collisionHeroBulletWithMonsterBullet(hbullet, mbullet) {
        let tblBullet = GlobalVar.tblApi.getDataBySingleKey('TblBattleBullet', hbullet.objectID);
        let part = Defines.Part.Unknown;
        if (tblBullet) {
            part = tblBullet.dwPart;
        }

        let dmgMsg = 0;
        dmgMsg.pos = mbullet.getPosition();

        BattleManager.getInstance().flyDamageMsg(dmgMsg.dmg, dmgMsg.critical, dmgMsg.pos, false);

        hbullet.isDead = true;

        return dmgMsg;
    },

    collisionMonsterWithHeroSkill(execute, monster) {
        if (monster.collisionSwitch == false || monster.isShow == false) {
            return;
        }

        let dmgMsg = {
            dmg: 0,
        };
        if (execute.dmgMsg != null) {
            dmgMsg = execute.dmgMsg;
            dmgMsg.dmg *= monster.defendSuppress;
            dmgMsg.dmg = Math.ceil(dmgMsg.dmg);
        }
        dmgMsg.pos = monster.getPosition();
        dmgMsg.dmg = monster.hitWithDamage(dmgMsg.dmg, true);
        if (dmgMsg.dmg >= 0) {
            monster.flyDamageMsg(dmgMsg.dmg, dmgMsg.critical, dmgMsg.pos, true, true);
        }
        if (monster.isDead) {
            monster.setClearBulletWhenDead(true);
        }
        return dmgMsg;
    },

    collisionMonsterWithDash(monster) {
        if (monster.collisionSwitch == false || monster.isShow == false) {
            return;
        }

        let damage = 0;
        let critical = false;
        if (monster.tbl.dwType == 4 || monster.tbl.dwType == 5) {
            let rand = Math.random() * 3 / 10;
            damage = monster.maxHp * (rand);
            if (rand >= 0.2) {
                critical = true;
            }
        } else if (monster.tbl.dwType == 2 || monster.tbl.dwType == 3) {
            let rand = Math.random() * 5 / 10;
            damage = monster.maxHp * (rand);
            if (rand >= 0.25) {
                critical = true;
            }
        } else {
            damage = monster.maxHp;
        }

        let dmgMsg = {
            dmg: Math.floor(damage),
        };

        dmgMsg.pos = monster.getPosition();
        dmgMsg.dmg = monster.hitWithDamage(dmgMsg.dmg);
        dmgMsg.critical = critical;
        if (dmgMsg.dmg > 0) {
            monster.flyDamageMsg(dmgMsg.dmg, dmgMsg.critical, dmgMsg.pos, true, true);
        }
        if (monster.isDead) {
            monster.setClearBulletWhenDead(true);
        }
        return dmgMsg;
    },

})