const BaseEntity = require('BaseEntity')
const Defines = require('BattleDefines')
const BattleManager = require('BattleManager')
const ScenarioManager = require('ScenarioManager')
const ResMapping = require("resmapping")
const GlobalVar = require('globalvar')
const weChatAPI = require("weChatAPI")

cc.Class({
    extends: BaseEntity,

    properties: {
        monsterID: 0,

        automaticSkill: false,
        curSkillAciton: 1,
        autoCurTime: 0,

        invincibleTime: 0,
        collisionSwitch: true,
        dropCrystal: true,
        dropCount: true,
        deathShock: true,
        dropBuff: true,
        closeDeathBomb: false,
        canDrop: false,
        immediatelyKill: 0,
        clearBulletWhenDead: false,
        isKill: true,
        isDefend: false,

        monsterHpBar: null,

        deathType: 0,

        flyCurTime: 0,
        flyMsgTime1: 0,
        flyMsgTime2: 0,
        flyMsgTime3: 0,

        damageFromExecuteInterval: 0,
        damageFromExecuteIntervalSet: 0,

        inspector: [],
        watchCondition: null,
        watchEffect: null,
        selfEffect: null,

        attackSuppress: 1,
        defendSuppress: 1,
    },

    ctor() {
        //this.entityManager = require('EntityManager');
        //this.scenarioManager = require('ScenarioManager').getInstance();
        this.solution = require('BulletSolutions');
    },

    initEntity() {
        this._super();
    },

    reset: function () {
        this._super();
        this.monsterID = 0;
        this.lv = 0;
        this.tbl = null;
        this.curSkillAciton = 0;
        this.curSkillCD = -1;
        this.autoCurTime = 0;
        this.invincibleTime = 0;
        this.collisionSwitch = true;
        this.automaticSkill = false;
        this.dropCrystal = true;
        this.dropCount = true;
        this.deathShock = true;
        this.closeDeathBomb = false;
        this.dropBuff = true;
        this.canDrop = false;
        this.immediatelyKill = 0;
        this.clearBulletWhenDead = false;
        this.isKill = true;
        this.deathType = 0;
        this.flyCurTime = 0;
        this.flyMsgTime1 = 0;
        this.flyMsgTime2 = 0;
        this.flyMsgTime3 = 0;
        this.damageFromExecuteInterval = 0;
        this.damageFromExecuteIntervalSet = 0;
        this.inspector.splice(0, this.inspector.length);
        this.watchCondition = null;
        this.watchEffect = null;
        this.selfEffect = null;
        this.attackSuppress = 1;
        this.defendSuppress = 1;
        this.resetHover();
    },

    resetHover() {
        this.atrb.hover = {};
        this.atrb.hover.position = cc.v3(0, 0);
        this.atrb.hover.status = 0;
        this.atrb.hover.duration = 0;
        this.atrb.hover.range = 0;
        this.atrb.hover.ttl = 0;
    },

    update(dt) {
        this._super(dt);
        this.updateHover(dt);
        this.autoUseSkill(dt);
        this.updateMonsterHpBar();
        this.watch();

        if (this.invincibleTime > 0) {
            this.invincibleTime -= dt;
            if (this.invincibleTime < 0) {
                this.invincibleTime = 0;
            }
        }

        if (this.damageFromExecuteInterval > 0) {
            this.damageFromExecuteInterval -= dt;
            if (this.damageFromExecuteInterval < 0) {
                this.damageFromExecuteInterval = 0;
            }
        }

        this.flyCurTime += dt;
    },

    updateHover(dt) {
        if (this.atrb.hover.status == 1 && this.atrb.hover.ttl-- <= 0) {
            let v = 8 * this.atrb.hover.range / this.atrb.hover.duration;

            this.setSpeed(cc.v3(0, v));
            this.setSpeedAcc(cc.v3(0, -4 * v / this.atrb.hover.duration));
            this.atrb.hover.ttl = Math.floor(this.atrb.hover.duration / 2 * Defines.BATTLE_FPS + 0.5);
            this.atrb.hover.status = 2;

        } else if (this.atrb.hover.status == 2 && this.atrb.hover.ttl-- <= 0) {
            let v = 8 * this.atrb.hover.range / this.atrb.hover.duration;

            this.setSpeed(cc.v3(0, -v));
            this.setSpeedAcc(cc.v3(0, 4 * v / this.atrb.hover.duration));
            this.atrb.hover.ttl = Math.ceil(this.atrb.hover.duration / 2 * Defines.BATTLE_FPS - 0.5);
            this.atrb.hover.status = 1;
        }
    },

    hover(range, duration) {
        if (range < 5) {
            return;
        }

        this.atrb.hover.range = range;
        this.atrb.hover.position = this.getPosition();
        this.atrb.hover.status = 1;
        this.atrb.hover.duration = duration;

        let v = 8 * range / duration;
        this.setSpeed(cc.v3(0, -v));
        this.setSpeedAcc(cc.v3(0, 4 * v / duration));
        this.atrb.hover.ttl = Math.floor(duration / 2 * Defines.BATTLE_FPS + 0.5);
    },

    hoverStop() {
        this.atrb.hover.status = 0;
    },

    autoUseSkill(dt) {
        if (this.automaticSkill && !this.isDead) {
            this.autoCurTime += dt;
            if (this.autoCurTime >= this.curSkillCD && this.automaticSkill) {
                this.autoCurTime = 0;
                if (this.tbl.strAction != '') {
                    let actArray = this.tbl.strAction.split("|");
                    if (this.curSkillAciton < actArray.length) {
                        let ai = require('AIInterface');
                        let steps = actArray[this.curSkillAciton].split(";");
                        ai.setMonsterLoopAction(this, steps[0]);
                        ai.playAction(this, steps[1], false);
                    }
                }
                this.useSkill(this.tbl.oVecSkillIDs[this.curSkillAciton]);
                this.curSkillAciton++;
                if (this.curSkillAciton >= this.tbl.oVecSkillIDs.length) {
                    this.curSkillAciton = 0;
                }
                this.autoSkillSwitch(this.automaticSkill, false);
            }
        }
    },

    autoSkillSwitch(open, immediately) {
        open = typeof open !== 'undefined' ? open : false;
        immediately = typeof immediately !== 'undefined' ? immediately : true;
        this.automaticSkill = open;
        if (open) {
            let tblSkill = GlobalVar.tblApi.getDataBySingleKey('TblBattleSkill', this.tbl.oVecSkillIDs[this.curSkillAciton]);
            if (!tblSkill) {
                this.curSkillCD = -1;
            } else {
                this.curSkillCD = tblSkill.dCD;
            }
            if (immediately) {
                this.autoCurTime = this.curSkillCD;
            } else {
                this.autoCurTime = 0;
            }
        } else {
            this.autoCurTime = 0;
        }
    },

    hitWithDamage: function (dmg, isExecute, noSub) {
        noSub = typeof noSub !== 'undefined' ? noSub : true;
        if (this.invincibleTime <= 0) {
            if (!noSub) {
                if (this.tbl.dwType >= 4 && dmg > this.maxHp * 0.01) {
                    dmg = this.maxHp * 0.01;
                } else if (this.tbl.dwType == 3 && dmg > this.maxHp * 0.02) {
                    dmg = this.maxHp * 0.02;
                } else if (this.tbl.dwType == 2 && dmg > this.maxHp * 0.03) {
                    dmg = this.maxHp * 0.03;
                }
            }
            if (isExecute) {
                if (this.damageFromExecuteInterval == 0) {
                    this.damageFromExecuteInterval = this.damageFromExecuteIntervalSet;
                } else {
                    return -1;
                }
            }
            if (this.isDefend) {
                dmg *= 0.01;
            }
            dmg = Math.ceil(dmg);
            this._super(dmg);
            if (this.tbl.dwType == 2 || this.tbl.dwType == 3 || this.tbl.dwType == 6) {
                if (this.hp < this.maxHp && this.monsterHpBar != null && cc.isValid(this.monsterHpBar)) {
                    this.monsterHpBar.active = true;
                    let percent = this.hp / this.maxHp;
                    this.monsterHpBar.getComponent(cc.ProgressBar).progress = percent;
                }
            }
            if (BattleManager.getInstance().isEndlessFlag) {
                ScenarioManager.getInstance().tryDropItem(1, this);
            }
            if (this.hp <= 0) {
                if (this.heroManager.planeEntity.state == 2 || this.tbl.dwType == 4 || this.tbl.dwType == 5) {
                    this.clearBulletWhenDead = true;
                }
                if (this.dropCount) {
                    this.canDrop = true;
                }
            }
        } else {
            return 0;
        }
        return dmg;
    },

    setMonster(monsterID, lv) {
        this.monsterID = monsterID;
        this.lv = lv;
        this.tbl = GlobalVar.tblApi.getDataBySingleKey('TblBattleMonster', monsterID);

        let suppress = GlobalVar.tblApi.getData('TblBattleSuppress')

        let level = 1;
        if (BattleManager.getInstance().isEndlessFlag) {
            level = 1;
        } else if (BattleManager.getInstance().isCampaignFlag) {
            level = 2;
        }

        let tblLvMonster = GlobalVar.tblApi.getDataByMultiKey('TblBattleLevelMonster', level, this.lv);
        if (!tblLvMonster) {
            tblLvMonster = GlobalVar.tblApi.getDataByMultiKey('TblBattleLevelMonster', this.tbl.dwLevelMonsterID, level == 1 ? 150 : 300);
            this.lv = level == 1 ? 150 : 300;
        }
        if (!tblLvMonster) {
            tblLvMonster = GlobalVar.tblApi.getDataByMultiKey('TblBattleLevelMonster', this.tbl.dwLevelMonsterID, level == 1 ? 150 : 300);
            this.lv = level == 1 ? 150 : 300;
        }
        if (tblLvMonster) {
            let tblProp = null;
            switch (this.tbl.dwType) {
                case 1:
                    tblProp = tblLvMonster.oVecAttribute1;
                    break;
                case 2:
                    tblProp = tblLvMonster.oVecAttribute2;
                    break;
                case 3:
                    tblProp = tblLvMonster.oVecAttribute3;
                    break;
                case 4:
                    tblProp = tblLvMonster.oVecAttribute4;
                    break;
                case 5:
                    tblProp = tblLvMonster.oVecAttribute5;
                    break;
                case 6:
                    tblProp = tblLvMonster.oVecAttribute6;
                    break;
            }
            if (tblProp) {
                for (let p of tblProp) {
                    this.prop[p.wKey] = p.dValue;
                }
            }
            this.maxHp = this.hp = this.prop[Defines.PropName.Life];

            let monsterCombat = tblLvMonster.dwCombatPoint;
            let heroCombat = GlobalVar.me().getCombatPoint() || monsterCombat;
            let percent = heroCombat / monsterCombat;
            for (let key in suppress) {
                if (suppress[key].byID != level) {
                    continue;
                }
                if (percent >= suppress[key].dPercent) {
                    this.attackSuppress = suppress[key].dSuppress2;
                    this.defendSuppress = suppress[key].dSuppress;
                    break;
                }
            }

        }
        if (this.tbl.dwType == 4 || this.tbl.dwType == 5) {
            this.prop[Defines.PropName.CollisionDamage] = tblLvMonster.CollisionParam2;
            BattleManager.getInstance().setBossHpBar(this);
        } else {
            this.prop[Defines.PropName.CollisionDamage] = tblLvMonster.CollisionParam1;
        }

        this.setDeathType(this.tbl.byDeathMode);

        this.setScale(this.tbl.dScale, this.scaleY < 0 ? -this.tbl.dScale : this.tbl.dScale);
    },

    newObject() {
        this.baseObject = this.poolManager.getInstance().getObject(Defines.PoolType.MONSTER, this.objectName);
        if (this.baseObject == null) {
            var self = this;
            let loadObject = function (prefab) {
                if (prefab != null) {
                    self.baseObject = cc.instantiate(prefab);
                    self.addChild(self.baseObject, 1);
                    if (self.objectType == Defines.ObjectType.OBJ_MONSTER) {
                        self.baseObject.getComponent('MonsterObject').reset();
                    }
                    if (self.tbl.oVecAnchorsPos.length == 2) {
                        self.setAnchor(self.tbl.oVecAnchorsPos[0], self.tbl.oVecAnchorsPos[1]);
                    }
                    if (!self.changeAnchor) {
                        self.baseObject.setPosition(self.atrb.objectAutoRotato.pos);
                        self.baseObject.angle = 0;
                    }
                    self.baseObject.getComponent('MonsterObject').setTBL(self.tbl);
                } else {
                    self.isShow = true;
                    self.isDead = true;
                    self.deathShock = false;
                    self.closeDeathBomb = true;
                }
            }
            let prefab = GlobalVar.resManager().getCacheRes(ResMapping.ResType.Prefab, 'cdnRes/battlemodel/prefab/Monster/' + this.objectName);
            if (prefab != null) {
                loadObject(prefab);
            } else {
                GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/battlemodel/prefab/Monster/' + this.objectName, loadObject);
            }
        } else {
            this.addChild(this.baseObject, 1);
            if (this.objectType == Defines.ObjectType.OBJ_MONSTER) {
                this.baseObject.getComponent('MonsterObject').reset();
            }
            if (this.tbl.oVecAnchorsPos.length == 2) {
                this.setAnchor(this.tbl.oVecAnchorsPos[0], this.tbl.oVecAnchorsPos[1]);
            }
            if (!this.changeAnchor) {
                this.baseObject.setPosition(this.atrb.objectAutoRotato.pos);
                this.baseObject.angle = 0;
            }
            this.baseObject.getComponent('MonsterObject').setTBL(this.tbl);
        }

        if (this.tbl.dwType == 2 || this.tbl.dwType == 3 || this.tbl.dwType == 6) {
            this.setMonsterHpBar();
        }

        this.motionStreakCtrl(0);
        return this.zOrder;
    },

    deleteObject: function () {
        let size = this.getCollider().size;

        this._super();
        if (this.tbl.strDieEffect != '' && !this.closeDeathBomb) {
            let prefab = GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/battlemodel/prefab/effect/' + this.tbl.strDieEffect);
            if (prefab != null) {
                let Bomb = cc.instantiate(prefab);
                let bZ = Defines.Z.KILL;
                let max = 1.5;
                if (this.tbl.dwType >= 4 && this.tbl.dwType <= 5) {
                    max = 3;
                    bZ = Defines.Z.MONSTERBULLETCLEAR;
                }
                let s = Math.max(Math.max(size.width, size.height) / Math.min(Bomb.width, Bomb.height), max);
                Bomb.setScale(s);
                BattleManager.getInstance().displayContainer.addChild(Bomb, bZ);
                Bomb.runAction(cc.sequence(cc.delayTime(0.4), cc.removeSelf(true)));
                Bomb.setPosition(this.getPosition());

                if (this.tbl.dwType >= 4 && this.tbl.dwType <= 6) {
                    GlobalVar.soundManager().playEffect('cdnRes/audio/battle/effect/explode_boss');
                } else if (this.tbl.dwType == 3) {
                    GlobalVar.soundManager().playEffect('cdnRes/audio/battle/effect/explode_captain');
                } else if (this.tbl.dwType == 2) {
                    GlobalVar.soundManager().playEffect('cdnRes/audio/battle/effect/explode_elite');
                } else if (this.tbl.dwType == 1) {
                    GlobalVar.soundManager().playEffect('cdnRes/audio/battle/effect/explode_small');
                }
            }
        }

        if (this.tbl.dwType >= 2 && this.tbl.dwType <= 6 && this.dropCrystal && this.canDrop) {
            this.solution.solution_crystal(this.tbl.dwType, this.getPosition());
        }
        if (this.tbl.dwType >= 2 && this.tbl.dwType <= 6 && this.deathShock) {
            BattleManager.getInstance().screenShake(1);
            weChatAPI.deviceShock();
        }

        this.inspector.splice(0, this.inspector.length);
        this.watchCondition = null;
        this.watchEffect = null;
        this.selfEffect = null;

        this.zIndex = 0;
    },

    flyDamageMsg(dmg, critical, pos, big, immediately) {
        immediately = typeof immediately !== 'undefined' ? immediately : false;
        if (dmg == 0) {
            if (this.flyCurTime - this.flyMsgTime1 >= 0.1 || immediately) {
                var self = this;
                GlobalVar.resManager().loadRes(ResMapping.ResType.SpriteFrame, 'cdnRes/battle/_text_resist', function (frame) {
                    if (frame != null) {
                        let node = new cc.Node();
                        let sp = node.addComponent(cc.Sprite);
                        sp.spriteFrame = frame;
                        node.scale = 1.0;
                        node.opacity = 230;
                        node.setPosition(pos);
                        BattleManager.getInstance().displayContainer.addChild(node, Defines.Z.FLYDAMAGEMSG);
                        self.flyFadeAction(node, critical, big);
                    }
                });
                if (!immediately) {
                    this.flyMsgTime1 = this.flyCurTime;
                }
            }
        } else {
            if (critical) {
                if (this.flyCurTime - this.flyMsgTime3 >= 0.1 || immediately) {
                    var self = this;
                    GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/battlemodel/prefab/effect/FlyDamageMsgCritical', function (prefab) {
                        if (prefab != null) {
                            let node = cc.instantiate(prefab);
                            let lbl = node.getComponent(cc.Label);
                            lbl.string = dmg;
                            node.setPosition(pos);
                            BattleManager.getInstance().displayContainer.addChild(node, Defines.Z.FLYDAMAGEMSG);
                            self.flyFadeAction(node, critical, big);
                        }
                    });
                }
                if (!immediately) {
                    this.flyMsgTime3 = this.flyCurTime;
                }
            } else {
                if (this.flyCurTime - this.flyMsgTime2 >= 0.1 || immediately) {
                    var self = this;
                    GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/battlemodel/prefab/effect/FlyDamageMsg', function (prefab) {
                        if (prefab != null) {
                            let node = cc.instantiate(prefab);
                            let lbl = node.getComponent(cc.Label);
                            lbl.string = dmg;
                            node.setPosition(pos);
                            BattleManager.getInstance().displayContainer.addChild(node, Defines.Z.FLYDAMAGEMSG);
                            self.flyFadeAction(node, critical, big);
                        }
                    });
                    if (!immediately) {
                        this.flyMsgTime2 = this.flyCurTime;
                    }
                }
            }


        }
    },

    flyFadeAction(node, critical, big) {
        let oldPos = node.getPosition();

        let exScale = 1.6;

        if (big) {
            exScale = 2.1;
        }

        if (critical) {
            node.scale = 0.0;
        } else {
            node.scale = exScale;
        }

        let scaleLarge = cc.scaleTo(0.1 * exScale, 2.5 * exScale);
        let scaleSmall = cc.scaleTo(0.08 * exScale, 0.5 * exScale);
        let scaleBack = cc.scaleTo(0.08 * exScale, exScale);
        let seq = cc.sequence(scaleLarge, scaleSmall, scaleBack);

        let move = cc.moveTo(0.6, oldPos.add(cc.v3(20, 50)));
        let fadeOut = cc.fadeOut(0.6);
        let spawn = cc.spawn(move, fadeOut);

        let tSeq = null;
        if (critical) {
            tSeq = cc.sequence(seq, spawn);
        } else {
            tSeq = spawn;
        }
        node.runAction(cc.sequence(tSeq, cc.removeSelf(true)));
    },


    deathMode: function (callback) {
        this.watch();
        //this.pauseAction();
        if (this.monsterHpBar != null && cc.isValid(this.monsterHpBar)) {
            this.monsterHpBar.zIndex = 0;
            this.monsterHpBar.destroy();
        }
        this.collisionSwitch = false;
        switch (this.deathType) {
            case 0:
                if (!!callback) {
                    callback(this);
                }
                break;
            case 1:
                this.createBombAnime(this.getPosition(), callback);
                break;
            case 2:
                if (!!callback) {
                    this.createRotatoScaleAnime(callback);
                }
                break;
        }
    },

    createBombAnime: function (pos, callback) {
        BattleManager.getInstance().endGameAnimeCount = 0;
        let size = BattleManager.getInstance().displayContainer.getContentSize();
        pos = typeof pos !== 'undefined' ? pos : cc.v3(0.5 * size.width, 0.5 * size.height);
        var self = this;
        GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/battlemodel/prefab/effect/lBomb', function (prefab) {
            if (prefab != null) {
                let bomb = cc.instantiate(prefab);
                BattleManager.getInstance().displayContainer.addChild(bomb, Defines.Z.MONSTERBULLETCLEAR);
                bomb.setPosition(pos);
                bomb.runAction(cc.sequence(cc.delayTime(0.4), cc.removeSelf(true)));
                let array = [];
                for (let i = 0; i < Math.ceil(Math.random() * 5) + 8; i++) {
                    array.push(pos.add(cc.v3((Math.random() - 0.5) * 200, (Math.random() - 0.5) * 200)));
                }
                BattleManager.getInstance().screenBomb(0, array, 1.5, function () {
                    if (!!callback) {
                        callback(self);
                    }
                    BattleManager.getInstance().endGameAnimeCount--;
                })
            }
        });
    },
    createRotatoScaleAnime: function (callback) {
        var action = cc.spawn(cc.scaleTo(1, 0.8), cc.rotateBy(1, 720));
        var self = this;
        this.runAction(cc.sequence(action, cc.callFunc(function () {
            callback(self);
        })));
    },

    pauseAction() {
        this.pauseAllActions();
        if (this.baseObject != null) {
            this.baseObject.getComponent('CoreObject').pauseAction();
            if (this.rayAnime != null && cc.isValid(this.rayAnime)) {
                this.rayAnime.pauseAllActions();
            }
        }
    },

    resumeAction() {
        this.resumeAllActions();
        if (this.baseObject != null) {
            this.baseObject.getComponent('CoreObject').resumeAction();
            if (this.rayAnime != null && cc.isValid(this.rayAnime)) {
                this.rayAnime.resumeAllActions();
            }
        }
    },

    setMonsterHpBar: function () {
        if (this.monsterHpBar == null || !cc.isValid(this.monsterHpBar)) {
            var self = this;
            GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/battlemodel/prefab/effect/MonsterHp', function (prefab) {
                if (prefab != null) {
                    self.monsterHpBar = cc.instantiate(prefab);
                    BattleManager.getInstance().displayContainer.addChild(self.monsterHpBar, Defines.Z.MONSTERHP);
                    self.monsterHpBar.active = false;
                    self.updateMonsterHpBar();
                }
            });
        }
    },

    updateMonsterHpBar: function () {
        if (this.monsterHpBar != null && cc.isValid(this.monsterHpBar) && this.getCollider() != null) {
            let offset = this.getCollider().offset;
            let size = this.getCollider().size;
            let pos = this.getPosition().add(cc.v3(0, this.baseObject.getPosition().y - 0.6 * size.height).mul(this.scale));
            this.monsterHpBar.setPosition(pos);
        }
    },

    checkOut: function (dt) {
        this.curtime += dt;
        let pos = this.getPosition();

        let size = BattleManager.getInstance().displayContainer.getContentSize()

        if (BattleManager.getInstance().allScreen) {
            size.height -= 130;
        } else {
            size.height -= 47;
        }

        if (this.isShow) {
            if (pos.y > size.height + Defines.OUT_SIDE || pos.x < -Defines.OUT_SIDE || pos.y < -Defines.OUT_SIDE || pos.x > size.width + Defines.OUT_SIDE) {
                if (!this.hold) {
                    this.isDead = true;
                    this.deathShock = false;
                    this.closeDeathBomb = true;
                } else {
                    this.isShow = false;
                }
            }
        } else {
            if (pos.y < size.height && pos.x > 0 && pos.y > 0 && pos.x < size.width) {
                this.isShow = true;
            }
            if (this.curtime >= 1.44) {
                this.isShow = true;
            }
            if (pos.y > size.height + Defines.FORCE_DESTORY || pos.y < -Defines.FORCE_DESTORY || pos.x > size.width + Defines.FORCE_DESTORY || pos.x < -Defines.FORCE_DESTORY) {
                if (!this.hold) {
                    this.isShow = true;
                    this.isDead = true;
                    this.deathShock = false;
                    this.closeDeathBomb = true;
                }
            }
        }
    },

    watch: function () {
        if (!!this.watchCondition) {
            let result = this.watchCondition(this);
            let cancel = 0;
            if (!!result) {
                for (let entity of this.inspector) {
                    if (cc.isValid(entity)) {
                        if (!!entity.watchEffect && !entity.isDead) {
                            entity.watchEffect(result, entity);
                        }
                    }
                }
                if (!!this.selfEffect) {
                    cancel = this.selfEffect(result, this);
                }
            }
            if (cancel) {
                this.watchCondition = null;
            }
        }
    },

    setWatch: function (condition, selfEffect) {
        this.watchCondition = typeof condition !== 'undefined' ? condition : null;
        this.selfEffect = typeof selfEffect !== 'undefined' ? selfEffect : null;
    },
    setInspector: function (entity, entityEffect) {
        if (typeof entity !== 'undefined') {
            this.inspector.push(entity);
            entity.watchEffect = typeof entityEffect !== 'undefined' ? entityEffect : null;
        }
    },
    popInspector: function (entity) {
        if (typeof entity !== 'undefined') {
            for (let i = 0; i < this.inspector.length; i++) {
                if (this.inspector[i].uuid == entity.uuid) {
                    this.inspector.splice(i, 1);
                    break;
                }
            }
        }
    },

    setCollisionSwitch: function (open) {
        this.collisionSwitch = typeof open !== 'undefined' ? open : true;
    },

    getCollisionSwitch: function (open) {
        return this.collisionSwitch;
    },

    setShow: function (show) {
        this.isShow = typeof show !== 'undefined' ? show : true;
    },
    getShow: function () {
        return this.isShow;
    },

    getMonsterSkills: function () {
        if (!!this.tbl) {
            return this.tbl.oVecSkillIDs;
        }
        return null;
    },

    addInvincibleTime: function (second) {
        this.invincibleTime = typeof second !== 'undefined' ? second : 0;
    },

    getCurHpPer: function () {
        if (this.maxHp != 0) {
            return Math.floor(this.hp / this.maxHp * 100);
        } else {
            return 0;
        }
    },

    setDropCrystal: function (drop) {
        this.dropCrystal = typeof drop !== 'undefined' ? drop : true;
    },
    getDropCrystal: function () {
        return this.dropCrystal;
    },

    setDropCount: function (drop) {
        this.dropCount = typeof drop !== 'undefined' ? drop : true;
    },
    getDropCount: function () {
        return this.dropCount;
    },

    setDeathShock: function (shock) {
        this.deathShock = typeof shock !== 'undefined' ? shock : true;
    },
    getDeathShock: function () {
        return this.deathShock;
    },

    setDropBuff: function (drop) {
        this.dropBuff = typeof drop !== 'undefined' ? drop : true;
    },
    getDropBuff: function () {
        return this.dropBuff;
    },

    setCloseDeathBomb: function (close) {
        this.closeDeathBomb = typeof close !== 'undefined' ? close : false;
    },
    getCloseDeathBomb: function () {
        return this.closeDeathBomb;
    },

    setImmediatelyKill: function (kill) {
        this.immediatelyKill = typeof kill !== 'undefined' ? kill : 0;
    },
    getImmediatelyKill: function () {
        return this.immediatelyKill;
    },

    setClearBulletWhenDead: function (clear) {
        this.clearBulletWhenDead = typeof clear !== 'undefined' ? clear : false;
    },
    getClearBulletWHenDead: function () {
        return this.clearBulletWhenDead;
    },

    setDeathType: function (type) {
        this.deathType = typeof type !== 'undefined' ? type : 0;
    },
    getDeathType: function () {
        return this.deathType;
    },

    setIsKill: function (not) {
        this.isKill = typeof not !== 'undefined' ? not : true;
    },

    setDefend: function (d) {
        this.isDefend = typeof d !== 'undefined' ? d : false;
    },
    getDefend: function () {
        return this.isDefend;
    },

    setDamageFromExecuteIntervalSet: function (interval) {
        if (this.damageFromExecuteIntervalSet == 0) {
            this.damageFromExecuteIntervalSet = typeof interval !== 'undefined' ? interval : 1;
        }
    },
    setDamageFromExecuteInterval: function (interval) {
        this.damageFromExecuteInterval = typeof interval !== 'undefined' ? interval : 0;
    },
});