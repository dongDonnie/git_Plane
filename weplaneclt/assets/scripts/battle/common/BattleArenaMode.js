const Defines = require('BattleDefines')
const GlobalVar = require('globalvar')
const ResMapping = require('resmapping')
const ArenaEntity = require('ArenaEntity');
const Mode = cc.Class({

    properties: {
        bulletId: 0,
        bulletNewList: [],
        bulletDeadList: [],
        bulletSelfBltList: [],
        bulletRivalBltList: [],
    },

    init() {
        this.battleManager = require('BattleManager').getInstance();
        this.poolManager = require('PoolManager').getInstance();
        let Collision = require('Collision');
        this.collision = new Collision();

        this.win = this.battleManager.battleMsg.ChallengeResult == 1 ? 1 : 0;

        this.selfPrepare = 0;
        this.rivalPrepare = 0;
        if (!this.win) {
            //lose
            let x1 = Math.ceil(Math.random() * 6) + 4;
            this.randSelf = [x1, x1 - 2, x1 - 4];
            let x2 = Math.ceil(Math.random() * 4) + 6;
            this.randRival = [x2, x2 - 2, x2 - 4];
        } else {
            //win
            let x1 = Math.ceil(Math.random() * 4) + 6;
            this.randSelf = [x1, x1 - 2, x1 - 4];
            let x2 = Math.ceil(Math.random() * 6) + 4;
            this.randRival = [x2, x2 - 2, x2 - 4];
        }

        this.startYourEngine = false;
    },

    prepare() {
        let uiNode = cc.find("Canvas/UINode");
        if (cc.isValid(uiNode)) {
            let ui = uiNode.getChildByName('UIBattleArena');
            if (cc.isValid(ui)) {
                if (cc.isValid(ui.getComponent('UIBattleArena'))) {
                    ui.getComponent('UIBattleArena').setBattleName(0, GlobalVar.me().getRoleName());
                    ui.getComponent('UIBattleArena').setSelfLevel(GlobalVar.me().getLevel());
                    ui.getComponent('UIBattleArena').setBattleName(1, this.battleManager.battleMsg.OpponentEquip.RoleName);
                    ui.getComponent('UIBattleArena').setRivalLevel(this.battleManager.battleMsg.OpponentEquip.Level);
                }
            }
        }

        var arena = this;

        let nodeBkg = new cc.Node();
        let sprite = nodeBkg.addComponent(cc.Sprite);
        sprite.spriteFrame = GlobalVar.resManager().loadRes(ResMapping.ResType.SpriteFrame, "cdnRes/battlemap/tk-e-ditu");
        nodeBkg.name = 'Map';
        nodeBkg.x = cc.winSize.width / 2;
        nodeBkg.y = cc.winSize.height / 2;
        this.battleManager.displayContainer.addChild(nodeBkg);

        let fix = GlobalVar.me().getCombatPoint() / this.battleManager.battleMsg.OpponentEquip.CombatPoint;
        let sPlus = 1;
        let rPlus = 1;
        if (fix >= 1) {
            sPlus = Math.floor(fix);
        } else {
            rPlus = Math.floor(1 / fix);
        }
        //self
        let memberID = GlobalVar.me().memberData.getStandingByFighterID();
        this.self = new ArenaEntity();
        this.self.newPart('Fighter/Fighter_' + memberID, Defines.ObjectType.OBJ_SELF, 'PlaneObject');
        this.self.setProp(GlobalVar.me().level, GlobalVar.me().propData.getProps(), sPlus);
        this.battleManager.arenaSelfDisplay.addChild(this.self, Defines.Z.FIGHTER);

        for (let index in GlobalVar.me().guazaiData.guazaiWear) {
            let wear = GlobalVar.me().guazaiData.getGuazaiBySlot(index);
            if (typeof wear === 'undefined') {
                continue;
            }
            this.self.newGuazai(Number(index), wear.ItemID, this.battleManager.arenaSelfDisplay);
        }

        this.self.flyIntoScreen(1, function () {
            let prefab = GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/battlemodel/prefab/effect/Barrier');
            if (prefab != null) {
                arena.selfBarrier = cc.instantiate(prefab);
                arena.battleManager.arenaSelfDisplay.addChild(arena.selfBarrier, Defines.Z.BARRIER);
                arena.selfBarrier.setPosition(arena.self.getPosition());
                arena.selfBarrier.opacity = 0;
                arena.selfBarrier.runAction(cc.fadeIn(0.5));
                let pos = arena.selfBarrier.getPosition();
                let box = arena.selfBarrier.getComponent(cc.BoxCollider);
                let rect = cc.rect((pos.x + box.offset.x - box.size.width * 0.25), (pos.y + box.offset.y - box.size.height * 0.25), box.size.width * 0.5, box.size.height * 0.5);
                arena.self.setEdge(rect);
                arena.selfPrepare = 1;
            }
        });

        //rival
        this.rival = new ArenaEntity();
        this.rival.newPart('Fighter/Fighter_' + this.battleManager.battleMsg.OpponentEquip.MemberID, Defines.ObjectType.OBJ_RIVAL, 'PlaneObject');
        this.rival.setProp(GlobalVar.me().level, GlobalVar.me().propData.getProps(), rPlus);
        this.battleManager.arenaRivalDisplay.addChild(this.rival, Defines.Z.FIGHTER);

        for (let i in this.battleManager.battleMsg.OpponentEquip.GuaZaiItemID) {
            let id = this.battleManager.battleMsg.OpponentEquip.GuaZaiItemID[i];
            if (id == 0) {
                continue;
            }
            this.rival.newGuazai(Number(i) + 1, id, this.battleManager.arenaRivalDisplay);
        }

        this.rival.flyIntoScreen(1, function () {
            let prefab = GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/battlemodel/prefab/effect/Barrier');
            if (prefab != null) {
                arena.rivalBarrier = cc.instantiate(prefab);
                arena.battleManager.arenaRivalDisplay.addChild(arena.rivalBarrier, Defines.Z.BARRIER);
                arena.rivalBarrier.setPosition(arena.rival.getPosition());
                arena.rivalBarrier.opacity = 0;
                arena.rivalBarrier.runAction(cc.fadeIn(0.5));
                let pos = arena.rivalBarrier.getPosition();
                let box = arena.rivalBarrier.getComponent(cc.BoxCollider);
                let rect = cc.rect((pos.x + box.offset.x - box.size.width * 0.25), (pos.y + box.offset.y - box.size.height * 0.25), box.size.width * 0.5, box.size.height * 0.5);
                arena.rival.setEdge(rect);
                arena.rivalPrepare = 1;
            }
        });

        this.battleManager.gameState = Defines.GameResult.START;
    },

    update(dt) {
        if (!this.startYourEngine) {
            this.startYourEngine = true;
            this.prepare();
            return;
        }

        if (this.battleManager.gameState == Defines.GameResult.START) {
            if (this.selfPrepare == 1 && this.rivalPrepare == 1) {
                this.battleManager.gameState = Defines.GameResult.PREPARE;
            }
        } else if (this.battleManager.gameState == Defines.GameResult.READY) {
            var arena = this;
            this.self.fire(1, function () {
                arena.selfPrepare = 2;
            })
            this.rival.fire(1, function () {
                arena.rivalPrepare = 2;
            })
            let uiNode = cc.find("Canvas/UINode");
            if (cc.isValid(uiNode)) {
                let ui = uiNode.getChildByName('UIBattleArena');
                if (cc.isValid(ui)) {
                    if (cc.isValid(ui.getComponent('UIBattleArena'))) {
                        ui.getComponent('UIBattleArena').playStart();
                    }
                }
            }
            this.battleManager.gameState = Defines.GameResult.SHOW;
        } else if (this.battleManager.gameState == Defines.GameResult.SHOW) {
            if (this.selfPrepare == 2 && this.rivalPrepare == 2) {
                let uiNode = cc.find("Canvas/UINode");
                if (cc.isValid(uiNode)) {
                    let ui = uiNode.getChildByName('UIBattleArena');
                    if (cc.isValid(ui)) {
                        if (cc.isValid(ui.getComponent('UIBattleArena'))) {
                            ui.getComponent('UIBattleArena').playAutoBattle();
                        }
                    }
                }
                this.selfBarrier.getComponent(cc.Animation).play();
                this.rivalBarrier.getComponent(cc.Animation).play();
                this.battleManager.gameState = Defines.GameResult.RUNNING;
            }
        } else if (this.battleManager.gameState == Defines.GameResult.RUNNING) {
            this.updateCollision();
        } else if (this.battleManager.gameState == Defines.GameResult.PAUSE) {
            if (this.bulletDeadList.length == 0 &&
                this.bulletSelfBltList.length == 0 &&
                this.bulletRivalBltList.length == 0 &&
                (this.battleManager.arenaSelfDisplay.children.length == 0 || this.battleManager.arenaRivalDisplay.children.length == 0)) {
                if (!this.win) {
                    this.battleManager.gameState = Defines.GameResult.FLYOUT;
                } else {
                    this.battleManager.gameState = Defines.GameResult.SUCCESS;
                }
            }
        } else if (this.battleManager.gameState == Defines.GameResult.FLYOUT) {
            var self = this;
            if (!this.win) {
                this.rival.flyOutOffScreen(function () {
                    self.battleManager.gameState = Defines.GameResult.END;
                });
            } else {
                this.self.flyOutOffScreen(function () {
                    self.battleManager.gameState = Defines.GameResult.END;
                })
            }
            this.battleManager.gameState = Defines.GameResult.NONE;
        } else if (this.battleManager.gameState == Defines.GameResult.INTERRUPT) {
            if (!this.win) {
                this.self.hitWithDamage(this.self.maxHp);
                let per = Math.random();
                this.rival.hitWithDamage(this.rival.hp * (per > 0 ? per : 0.1));
            } else {
                let per = Math.random();
                this.self.hitWithDamage(this.self.hp * (per > 0 ? per : 0.1));
                this.rival.hitWithDamage(this.rival.maxHp);
            }
            this.gameEnd();
        }

        this.updateNewList(dt);
        this.updateBltList(dt);
        this.updateDeadList(dt);
        if (cc.isValid(this.self)) {
            this.self.update(dt);
        }
        if (cc.isValid(this.rival)) {
            this.rival.update(dt);
        }
    },

    updateCollision() {
        if (cc.isValid(this.selfBarrier)) {
            let sCollider = this.selfBarrier.getComponent(cc.BoxCollider);

            let a = this.collision.updateCollider(sCollider);

            for (let rBullet of this.bulletRivalBltList) {
                if (rBullet.objectType != Defines.ObjectType.OBJ_RIVAL_BULLET ||
                    rBullet.baseObject == null ||
                    rBullet.isDead ||
                    !!rBullet.isDodge) {
                    continue;
                }

                let bCollider = rBullet.getCollider();
                let b = this.collision.updateCollider(bCollider);
                if (this.collision.Intersects(a, b)) {
                    this.arenaCollision(rBullet, this.self);
                    //break;
                }

            }
        }

        if (cc.isValid(this.rivalBarrier)) {
            let rCollider = this.rivalBarrier.getComponent(cc.BoxCollider);

            let a = this.collision.updateCollider(rCollider);

            for (let sBullet of this.bulletSelfBltList) {
                if (sBullet.objectType != Defines.ObjectType.OBJ_SELF_BULLET ||
                    sBullet.baseObject == null ||
                    sBullet.isDead ||
                    !!sBullet.isDodge) {
                    continue;
                }

                let bCollider = sBullet.getCollider();
                let b = this.collision.updateCollider(bCollider);
                if (this.collision.Intersects(a, b)) {
                    this.arenaCollision(sBullet, this.rival);
                    //break;
                }

            }
        }
    },

    arenaCollision(objA, objB) {
        if (objA.objectType == Defines.ObjectType.OBJ_SELF_BULLET) {

            if (objB.objectType == Defines.ObjectType.OBJ_RIVAL) {
                this.collisionRivalWithBullet(objB, objA);
            }

        } else if (objA.objectType == Defines.ObjectType.OBJ_RIVAL_BULLET) {

            if (objB.objectType == Defines.ObjectType.OBJ_SELF) {
                this.collisionSelfWithBullet(objB, objA);
            }

        }
    },

    collisionSelfWithBullet(fighter, bullet) {
        //bullet.isDead = true;
        let pos = this.battleManager.arenaRivalDisplay.convertToNodeSpaceAR(cc.v2(this.selfBarrier.getPosition()));
        let collider = this.selfBarrier.getComponent(cc.BoxCollider);
        if (cc.isValid(collider)) {
            bullet.disappearAnime = true;
            let offset = cc.v3(collider.offset.mul(-1));
            let size = collider.size;
            let r = Math.min(size.width / 2, size.height / 2);
            let posP = pos.add(offset);
            let posB = bullet.getPosition();
            let v = posB.sub(posP);
            let angle = Math.atan2(v.y, v.x) * 180 / Math.PI;
            let x1 = posP.x + r * Math.cos(angle * Math.PI / 180);
            let y1 = posP.y + r * Math.sin(angle * Math.PI / 180);
            bullet.disappearPos = cc.v3(x1, y1);
        }
        this.hitWithDamage(fighter, bullet);
    },

    collisionRivalWithBullet(fighter, bullet) {
        //bullet.isDead = true;
        let pos = cc.v2(this.rivalBarrier.getPosition());
        let collider = this.rivalBarrier.getComponent(cc.BoxCollider);
        if (cc.isValid(collider)) {
            bullet.disappearAnime = true;
            let offset = cc.v3(collider.offset);
            let size = collider.size;
            let r = Math.min(size.width / 2, size.height / 2);
            let posP = pos.add(offset);
            let posB = this.battleManager.arenaRivalDisplay.convertToNodeSpaceAR(cc.v2(bullet.getPosition()));
            let v = posB.sub(posP);
            let angle = Math.atan2(v.y, v.x) * 180 / Math.PI;
            let x1 = posP.x + r * Math.cos(angle * Math.PI / 180);
            let y1 = posP.y + r * Math.sin(angle * Math.PI / 180);
            bullet.disappearPos = cc.v3(x1, y1);
        }
        this.hitWithDamage(fighter, bullet);
    },

    hitWithDamage(fighter, bullet) {
        let dmgMsg = this.battleControl(fighter, bullet);
        if (!!dmgMsg.dodge) {
            bullet.isDodge = true;
        } else {
            bullet.isDead = true;
        }
        if (this.win) {
            if (fighter.objectType == Defines.ObjectType.OBJ_SELF &&
                dmgMsg.dmg >= fighter.hp) {
                dmgMsg.dmg = 0;
            }
        } else {
            if (fighter.objectType == Defines.ObjectType.OBJ_RIVAL &&
                dmgMsg.dmg >= fighter.hp) {
                dmgMsg.dmg = 0;
            }
        }
        fighter.hitWithDamage(dmgMsg.dmg);
        fighter.flyDamageMsg(dmgMsg.dmg, dmgMsg.critical, dmgMsg.dodge, dmgMsg.immediately, dmgMsg.position);
        if (fighter.hp == 0) {
            this.gameEnd();
        }
    },

    gameEnd() {
        for (let bullet of this.bulletSelfBltList) {
            bullet.isDead = true;
        }
        for (let bullet of this.bulletRivalBltList) {
            bullet.isDead = true;
        }
        let uiNode = cc.find("Canvas/UINode");
        if (cc.isValid(uiNode)) {
            let ui = uiNode.getChildByName('UIBattleArena');
            if (cc.isValid(ui)) {
                if (cc.isValid(ui.getComponent('UIBattleArena'))) {
                    ui.getComponent('UIBattleArena').playAutoBattle(false);
                }
            }
        }
        this.selfBarrier.getComponent(cc.Animation).stop();
        this.rivalBarrier.getComponent(cc.Animation).stop();
        this.selfBarrier.runAction(cc.sequence(cc.fadeOut(0.5), cc.removeSelf(true)));
        this.rivalBarrier.runAction(cc.sequence(cc.fadeOut(0.5), cc.removeSelf(true)));
        this.self.fireSwitch();
        this.rival.fireSwitch();
        this.battleManager.gameState = Defines.GameResult.PAUSE;
    },

    battleControl(fighter, bullet) {
        let dmgMsg = null;
        let damage = 0;
        if (bullet.dmgMsg != null) {
            damage = bullet.dmgMsg.dmg;
        }
        let per = fighter.hp / fighter.maxHp;
        if (fighter.objectType == Defines.ObjectType.OBJ_SELF) {
            dmgMsg = this.theDestinyByDice(0, damage);
            dmgMsg.position = bullet.getPosition();
            if (!this.win) {
                if (per <= 0.5) {
                    dmgMsg.dmg *= (1 + Math.random());
                }
                dmgMsg.dmg = Math.ceil(dmgMsg.dmg);
            } else {
                if (per <= 0.05) {
                    dmgMsg.dmg = 0;
                } else if (per <= 0.2) {
                    dmgMsg.dmg *= per;
                } else if (per <= 0.4) {
                    dmgMsg.dmg *= Math.random();
                }
                dmgMsg.dmg = Math.floor(dmgMsg.dmg);
            }
        } else if (fighter.objectType == Defines.ObjectType.OBJ_RIVAL) {
            dmgMsg = this.theDestinyByDice(1, damage);
            dmgMsg.position = this.battleManager.arenaRivalDisplay.convertToNodeSpaceAR(cc.v2(bullet.getPosition()));
            if (!this.win) {
                if (per <= 0.05) {
                    dmgMsg.dmg = 0;
                } else if (per <= 0.2) {
                    dmgMsg.dmg *= per;
                } else if (per <= 0.4) {
                    dmgMsg.dmg *= Math.random();
                }
                dmgMsg.dmg = Math.floor(dmgMsg.dmg);
            } else {
                if (per <= 0.5) {
                    dmgMsg.dmg *= (1 + Math.random());
                }
                dmgMsg.dmg = Math.ceil(dmgMsg.dmg);
            }
        }

        return dmgMsg;
    },

    theDestinyByDice(side, dmg) {
        let dmgMsg = {
            dmg: dmg || 0,
            critical: false,
            dodge: false,
            immediately: false,
            position: cc.v2(0, 0),
        };
        let dice1 = Math.ceil(Math.random() * 10);
        let dice2 = Math.ceil(Math.random() * 10);
        if (!side) {
            for (let index in this.randSelf) {
                if (dice1 >= this.randSelf[index]) {
                    if (index == 0) {
                        dmgMsg.dmg *= (1.5 + dice1 / 10);
                    } else if (index == 1) {
                        dmgMsg.dmg *= (1 + dice1 / 10);
                    } else if (index == 2) {
                        dmgMsg.dmg *= (dice1 / 10);
                    }
                    break;
                }
            }
            for (let index in this.randRival) {
                if (dice2 >= this.randRival[index]) {
                    if (index == 0) {
                        dmgMsg.dmg *= (dice2 / 10);
                    } else if (index == 1) {
                        dmgMsg.dmg *= (1 + dice2 / 10);
                    } else if (index == 2) {
                        dmgMsg.dmg *= (1.5 + dice2 / 10);
                    }
                    break;
                }
            }
            if (dice1 == dice2) {
                dmgMsg.critical = true;
                dmgMsg.immediately = true;
                if (dice2 > 5) {
                    dmgMsg.dmg *= (1 + dice2 / 10);
                } else {
                    if (Math.random() > 0.4) {
                        dmgMsg.dodge = true;
                        dmgMsg.dmg /= dice2;
                    } else {
                        dmgMsg.dodge = false;
                        dmgMsg.dmg = 0;
                    }
                }
            } else {
                dmgMsg.critical = false;
                dmgMsg.immediately = false;
            }
        } else {
            for (let index in this.randRival) {
                if (dice1 >= this.randRival[index]) {
                    if (index == 0) {
                        dmgMsg.dmg *= (1.5 + dice1 / 10);
                    } else if (index == 1) {
                        dmgMsg.dmg *= (1 + dice1 / 10);
                    } else if (index == 2) {
                        dmgMsg.dmg *= (dice1 / 10);
                    }
                    break;
                }
            }
            for (let index in this.randSelf) {
                if (dice2 >= this.randSelf[index]) {
                    if (index == 0) {
                        dmgMsg.dmg *= (dice2 / 10);
                    } else if (index == 1) {
                        dmgMsg.dmg *= (1 + dice2 / 10);
                    } else if (index == 2) {
                        dmgMsg.dmg *= (1.5 + dice2 / 10);
                    }
                    break;
                }
            }
            if (dice1 == dice2) {
                dmgMsg.critical = true;
                dmgMsg.immediately = true;
                if (dice2 > 5) {
                    dmgMsg.dmg *= (1 + dice2 / 10);
                } else {
                    if (Math.random() > 0.4) {
                        dmgMsg.dodge = true;
                        dmgMsg.dmg /= dice2;
                    } else {
                        dmgMsg.dodge = false;
                        dmgMsg.dmg = 0;
                    }
                }
            } else {
                dmgMsg.critical = false;
                dmgMsg.immediately = false;
            }
        }
        return dmgMsg;
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
            this.battleManager.arenaSelfDisplay.addChild(bullet, z);

        } else if (bullet.objectType == Defines.ObjectType.OBJ_RIVAL_BULLET) {

            z = bullet.newObject();
            this.bulletRivalBltList.push(bullet);
            this.battleManager.arenaRivalDisplay.addChild(bullet, z);

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
            this.battleManager.arenaSelfDisplay.removeChild(bullet);

        } else if (bullet.objectType == Defines.ObjectType.OBJ_RIVAL_BULLET) {

            for (let j = 0; j < this.bulletRivalBltList.length; ++j) {
                if (bullet == this.bulletRivalBltList[j]) {
                    this.bulletRivalBltList.splice(j, 1);
                    this.poolManager.putEntity(Defines.PoolType.BULLET, bullet);
                    break;
                }
            }
            this.battleManager.arenaRivalDisplay.removeChild(bullet);

        }
        bullet.reset();
    },

    primeBullet: function (bullet) {
        this.bulletNewList.push(bullet);
        bullet.entityId = this.getBulletId();
    },

    getPlane: function (side) {
        side = typeof side !== 'undefined' ? side : 0;
        if (!side) {
            return this.self;
        } else {
            return this.rival;
        }
    },
});