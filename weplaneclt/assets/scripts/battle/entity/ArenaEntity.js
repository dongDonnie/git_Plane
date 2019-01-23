const Defines = require('BattleDefines');
const GlobalVar = require('globalvar');
const ResMapping = require("resmapping");
const BattleManager = require('BattleManager');
const BM = require('BulletMapping');
const ArenaGuazaiEntity = require('ArenaGuazaiEntity');

cc.Class({
    extends: cc.Node,

    ctor: function () {
        this.objectName = '';
        this.objectType = Defines.ObjectType.OBJ_INVALID;
        this.partObject = null;
        this.part = null;

        this.prop = [];
        for (let i = Defines.PropName.Life; i < Defines.PropName.Count; ++i) {
            this.prop.push(0);
        }

        this.lv = 1;

        this.hp = this.maxHp = this.prop[Defines.PropName.Life];

        this.state = 0;

        this.skillID = -1;
        this.lastSkillTime = 0;
        this.skillCD = Defines.SKILLCD;

        this.missleSwitch = false;
        this.missleSkillID = -1;
        this.missleSkillCD = -1;
        this.autoCurTime = 0;

        this.openFire = false;

        this.lineSpeed = cc.v3(0, 0);
        this.rect = cc.rect(0, 0, cc.winSize.width, cc.winSize.height);

        this.flyCurTime = 0;
        this.flyMsgTime1 = 0;
        this.flyMsgTime2 = 0;
        this.flyMsgTime3 = 0;

        this.wingmanEntity = [];
        this.assistEntity = [];
    },

    reset: function () {
        this.lv = 1;
        this.hp = this.maxHp = this.prop[Defines.PropName.Life];
        this.state = 0;
        this.skillID = -1;
        this.lastSkillTime = 0;
        this.skillCD = 5;
        this.missleSwitch = false;
        this.missleSkillID = -1;
        this.missleSkillCD = -1;
        this.autoCurTime = 0;
        this.openFire = false;
        this.lineSpeed = cc.v3(0, 0);
        this.rect = cc.rect(0, 0, cc.winSize.width, cc.winSize.height);
        this.flyCurTime = 0;
        this.flyMsgTime1 = 0;
        this.flyMsgTime2 = 0;
        this.flyMsgTime3 = 0;
        for (let i = 0; i < 2; i++) {
            if (cc.isValid(this.assistEntity[i])) {
                this.assistEntity[i].destroy();
            }
            if (cc.isValid(this.wingmanEntity[i])) {
                this.wingmanEntity[i].destroy();
            }
        }
        this.assistEntity.splice(0, this.assistEntity.length);
        this.wingmanEntity.splice(0, this.wingmanEntity.length);
    },

    getPart: function () {
        return this.part;
    },

    newPart: function (objectName, objectType, objectClass) {
        this.objectName = typeof objectName !== 'undefined' ? objectName : '';
        this.objectType = typeof objectType !== 'undefined' ? objectType : Defines.ObjectType.OBJ_INVALID;
        this.objectClass = typeof objectClass !== 'undefined' ? objectClass : '';

        if (this.objectName == '' || this.objectType == Defines.ObjectType.OBJ_INVALID) {
            return false;
        }

        let index = objectName.lastIndexOf('_');
        let id = objectName.substring(index + 1, objectName.length);
        let memberData = GlobalVar.tblApi.getDataBySingleKey('TblMember', id);
        this.setSkill(memberData.wSkillCommon + 3);

        let prefab = GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/battlemodel/prefab/' + objectName);
        if (prefab != null) {
            this.partObject = cc.instantiate(prefab);
            this.part = this.partObject.getComponent(this.objectClass);
            this.part.setObjectType(this.objectType);
            this.addChild(this.partObject);
            let index = objectName.lastIndexOf('_');
            let id = objectName.substring(index + 1, objectName.length);
            if (id == '720') {
                this.partObject.setPosition(cc.v3(0, 20));
            }
            if (id == '740') {
                this.partObject.setPosition(cc.v3(0, 20));
            }
            this.addMotionStreak('huoyan');
            this.setPosition(0.5 * cc.view.getDesignResolutionSize().width, -0.2 * cc.winSize.height);
        } else {
            return false;
        }
        return true;
    },

    newGuazai: function (index, id, dc) {
        let type = Defines.ObjectType.OBJ_INVALID;
        if (this.objectType == Defines.ObjectType.OBJ_SELF) {
            type = Defines.ObjectType.OBJ_SELF_GUAZAI;
        } else if (this.objectType == Defines.ObjectType.OBJ_RIVAL) {
            type = Defines.ObjectType.OBJ_RIVAL_GUAZAI;
        } else {
            return;
        }

        let data = GlobalVar.tblApi.getDataBySingleKey("TblGuaZai", id);
        switch (index) {
            case 1:
                let wingLeft = new ArenaGuazaiEntity();
                wingLeft.newPart('Wingman/' + data.strModel, type, 'WingmanObject', -1, 0, 1, this);
                wingLeft.setSkill(data.wSkillID + 1);
                dc.addChild(wingLeft, Defines.Z.WINGMAN);
                this.wingmanEntity.push(wingLeft);

                let wingRight = new ArenaGuazaiEntity();
                wingRight.newPart('Wingman/' + data.strModel, type, 'WingmanObject', 1, 0, 1, this);
                wingRight.setSkill(data.wSkillID + 3);
                dc.addChild(wingRight, Defines.Z.WINGMAN);
                this.wingmanEntity.push(wingRight);
                //this.prop[Defines.PropName.PetAttack] = guazaiProp[Defines.PropName.PetAttack];
                break;
            case 2:
                break;
            case 3:
                this.setMissle(true, data.wSkillID);
                //this.prop[Defines.PropName.MissileAttack] = guazaiProp[Defines.PropName.MissileAttack];
                break;
            case 4:
                let assistLeft = new ArenaGuazaiEntity();
                assistLeft.newPart(data.strModel, type, '', -1, 1, 2, this);
                assistLeft.setSkill(data.wSkillID);
                dc.addChild(assistLeft, Defines.Z.ASSIST);
                this.assistEntity.push(assistLeft);
                assistLeft.setScale(-0.6, 0.6);

                let assistRight = new ArenaGuazaiEntity();
                assistRight.newPart(data.strModel, type, '', 1, 1, 2, this);
                assistRight.setSkill(data.wSkillID + 1);
                dc.addChild(assistRight, Defines.Z.ASSIST);
                this.assistEntity.push(assistRight);
                assistRight.setScale(0.6, 0.6);
                //this.prop[Defines.PropName.AssistAttack] = guazaiProp[Defines.PropName.AssistAttack];
                break;
        }

    },

    setProp: function (lv, props) {
        for (let i = 0; i < props.length; i++) {
            if (typeof props[i] === 'undefined') {
                continue;
            }
            switch (props[i].ID) {
                case 1:
                    this.prop[Defines.PropName.Life] = props[i].Value;
                    break;
                case 3:
                    this.prop[Defines.PropName.Attack] = props[i].Value;
                    break;
                case 4:
                    this.prop[Defines.PropName.Defense] = props[i].Value;
                    break;
                case 5:
                    this.prop[Defines.PropName.CriticalDamage] = props[i].Value;
                    break;
                case 6:
                    this.prop[Defines.PropName.CriticalRate] = props[i].Value;
                    break;
                case 11:
                    this.prop[Defines.PropName.PetAttack] = props[i].Value;
                    break;
                case 12:
                    this.prop[Defines.PropName.SkillAttack] = props[i].Value;
                    break;
                case 13:
                    this.prop[Defines.PropName.MissileAttack] = props[i].Value;
                    break;
                case 14:
                    this.prop[Defines.PropName.AssistAttack] = props[i].Value;
                    break;
                case 15:
                    this.prop[Defines.PropName.LifeGrow] = props[i].Value;
                    break;
                case 16:
                    this.prop[Defines.PropName.AttackGrow] = props[i].Value;
                    break;
                case 17:
                    this.prop[Defines.PropName.DefenseGrow] = props[i].Value;
                    break;
            }
        }

        this.prop[Defines.PropName.Life] *= (1.0 + this.prop[Defines.PropName.LifeGrow] / 10000.0);
        this.prop[Defines.PropName.Attack] *= (1.0 + this.prop[Defines.PropName.AttackGrow] / 10000.0);
        this.prop[Defines.PropName.Defense] *= (1.0 + this.prop[Defines.PropName.DefenseGrow] / 10000.0);

        this.hp = this.maxHp = (this.prop[Defines.PropName.Life] + this.prop[Defines.PropName.Defense] * 5) * 3;

        this.lv = lv;
    },

    fire(delay, callback) {
        GlobalVar.soundManager().playEffect('cdnRes/audio/battle/effect/baozou');
        var self = this;
        this.runAction(
            cc.sequence(
                cc.callFunc(function () {
                    self.part.crazyStart();
                    for (let i = 0; i < 2; i++) {
                        if (cc.isValid(self.wingmanEntity[i])) {
                            self.wingmanEntity[i].part.crazyStart();
                        }
                    }
                }),
                cc.delayTime(delay),
                cc.callFunc(function () {
                    self.fireSwitch(true);
                    if (!!callback) {
                        callback();
                    }
                })
            )
        );
    },

    fireSwitch(open) {
        this.openFire = typeof open !== 'undefined' ? open : false;
        for (let i = 0; i < 2; i++) {
            if (cc.isValid(this.assistEntity[i])) {
                this.assistEntity[i].fireSwitch(this.openFire);
            }
            if (cc.isValid(this.wingmanEntity[i])) {
                this.wingmanEntity[i].fireSwitch(this.openFire);
            }
        }
    },

    hitWithDamage(dmg) {
        if (this.hp > dmg) {
            this.hp -= dmg;
        } else {
            this.hp = 0;
            this.selfDestroy();
        }
    },

    setSkill(id) {
        this.skillID = typeof id !== 'undefined' ? id : -1;
    },

    useSkill(id) {
        let tblSkill = GlobalVar.tblApi.getDataBySingleKey('TblBattleSkill', id);
        if (!!tblSkill) {
            let func = BM.getSolution(tblSkill.dwSolution);
            if (!!func) {
                func(this, tblSkill.oVecBulletIDs);
                return tblSkill.dCD;
            } else {
                return -1;
            }
        }
        return -1;
    },

    updateSuperBullet(dt) {
        if (this.lastSkillTime <= 0) {
            this.useSuperBullet();
        } else {
            this.lastSkillTime -= dt;
        }
    },

    useSuperBullet() {
        this.state = 2;
        if (this.skillID != -1) {
            let cd = this.useSkill(this.skillID);
            if (cd != -1) {
                this.lastSkillTime = this.skillCD = cd;
            }
            return cd;
        }
        return -1;
    },

    updateMissle: function (dt) {
        if (this.missleSwitch) {
            this.autoCurTime += dt;
            if (this.autoCurTime >= this.missleSkillCD && this.missleSkillCD > 0) {
                this.autoCurTime = 0;
                if (this.missleSkillID != -1) {
                    this.useSkill(this.missleSkillID);
                }
            }
        }
    },

    setMissle: function (open, skillid) {
        this.missleSwitch = typeof open !== 'undefined' ? open : false;
        this.missleSkillID = typeof skillid !== 'undefined' ? skillid : -1;

        if (this.missleSwitch && this.missleSkillID != -1) {
            let tblSkill = GlobalVar.tblApi.getDataBySingleKey('TblBattleSkill', this.missleSkillID);
            if (!tblSkill) {
                this.missleSkillCD = -1;
            } else {
                this.missleSkillCD = tblSkill.dCD;
            }
        } else {
            this.missleSkillCD = -1;
        }
        this.autoCurTime = 0;
    },

    addMotionStreak: function (res, color, fadeTime, minSeg, stroke, fastMode) {
        res = typeof res !== 'undefined' ? res : 'huoyan';
        let motionNode = this.addComponent(cc.MotionStreak);
        GlobalVar.resManager().loadRes(ResMapping.ResType.Texture2D, 'cdnRes/battlemodel/motionstreak/' + res, function (tex) {
            if (tex != null) {
                motionNode.texture = tex;
            }
        });
        motionNode.fadeTime = typeof fadeTime !== 'undefined' ? fadeTime : 0.5;
        motionNode.minSeg = typeof minSeg !== 'undefined' ? minSeg : 1;
        motionNode.stroke = typeof stroke !== 'undefined' ? stroke : 30;
        motionNode.fastMode = typeof fastMode !== 'undefined' ? fastMode : false;
        motionNode.color = typeof color !== 'undefined' ? color : new cc.Color(255, 255, 255);
    },

    flyIntoScreen(delay, callback) {
        GlobalVar.soundManager().playEffect('cdnRes/audio/battle/effect/leave_battle');
        var self = this;
        if (!!callback && !!delay) {
            this.runAction(
                cc.sequence(
                    cc.moveBy(1.0, cc.v3(0, 0.35 * cc.winSize.height)),
                    cc.callFunc(function () {
                        self.removeComponent(cc.MotionStreak);
                        self.part.transform();
                    }),
                    cc.delayTime(delay),
                    cc.callFunc(callback)
                )
            );
        } else {
            this.runAction(
                cc.sequence(
                    cc.moveBy(1.0, cc.v3(0, 0.35 * cc.winSize.height)),
                    cc.callFunc(function () {
                        self.removeComponent(cc.MotionStreak);
                        self.part.transform();
                    })
                )
            );
        }
    },

    flyOutOffScreen(callback) {
        this.part.crazyEnd();
        for (let i = 0; i < 2; i++) {
            if (cc.isValid(this.wingmanEntity[i])) {
                this.wingmanEntity[i].part.crazyEnd();
            }
        }
        this.addMotionStreak('huoyan');
        GlobalVar.soundManager().playEffect('cdnRes/audio/battle/effect/leave_battle');
        if (!!callback) {
            this.runAction(
                cc.sequence(
                    cc.delayTime(0.6),
                    cc.moveBy(1, cc.v3(0, cc.winSize.height * 1.2)),
                    cc.callFunc(callback)
                )
            );
        } else {
            this.runAction(
                cc.sequence(
                    cc.delayTime(0.6),
                    cc.moveBy(1, cc.v3(0, cc.winSize.height * 1.2)),
                )
            );
        }
    },

    selfDestroy() {
        this.runAction(
            cc.sequence(
                cc.fadeOut(0.5),
                cc.removeSelf(true),
            )
        );
        for (let i = 0; i < 2; i++) {
            if (cc.isValid(this.assistEntity[i])) {
                this.assistEntity[i].runAction(
                    cc.sequence(
                        cc.fadeOut(0.5),
                        cc.removeSelf(true),
                    )
                );
            }
            if (cc.isValid(this.wingmanEntity[i])) {
                this.wingmanEntity[i].runAction(
                    cc.sequence(
                        cc.fadeOut(0.5),
                        cc.removeSelf(true),
                    )
                );
            }
        }
    },

    setEdge(rect) {
        this.rect = typeof rect !== 'undefined' ? rect : this.rect;
    },

    randSpeed() {
        let x = Math.random() > 0.5 ? 0 : 100;
        let y = Math.random() > 0.5 ? 0 : 100;
        x *= Math.random() > 0.5 ? 1 : -1;
        y *= Math.random() > 0.5 ? 1 : -1;
        this.lineSpeed = cc.v3(x, y);
    },

    updateMove(dt) {
        if (this.lineSpeed.x == 0 && this.lineSpeed.y == 0) {
            this.randSpeed();
        } else {
            let pos = this.getPosition();
            pos.x += this.lineSpeed.x * dt;
            pos.y += this.lineSpeed.y * dt;
            if (pos.x <= this.rect.x ||
                pos.x >= this.rect.x + this.rect.width ||
                pos.y <= this.rect.y ||
                pos.y >= this.rect.y + this.rect.height) {
                if (pos.x <= this.rect.x) {
                    pos.x = this.rect.x;
                } else if (pos.x >= this.rect.x + this.rect.width) {
                    pos.x = this.rect.x + this.rect.width;
                }
                if (pos.y <= this.rect.y) {
                    pos.y = this.rect.y;
                } else if (pos.y >= this.rect.y + this.rect.height) {
                    pos.y = this.rect.y + this.rect.height;
                }
                this.randSpeed();
            }
            this.setPosition(pos);
        }
    },

    update(dt) {
        if (!!this.openFire) {
            this.updateMove(dt);
            this.updateSuperBullet(dt);
            this.updateMissle(dt);
            this.flyCurTime += dt;
        }
        for (let i = 0; i < 2; i++) {
            if (cc.isValid(this.assistEntity[i])) {
                this.assistEntity[i].update(dt);
            }
            if (cc.isValid(this.wingmanEntity[i])) {
                this.wingmanEntity[i].update(dt);
            }
        }
    },

    flyDamageMsg(dmg, critical, dodge, immediately, pos) {
        if (!!dodge) {
            if (this.flyCurTime - this.flyMsgTime3 >= 0.3 || immediately) {
                var self = this;
                GlobalVar.resManager().loadRes(ResMapping.ResType.SpriteFrame, 'cdnRes/battle/_text_miss', function (frame) {
                    if (frame != null) {
                        let node = new cc.Node();
                        let sp = node.addComponent(cc.Sprite);
                        sp.spriteFrame = frame;
                        node.scale = 1.0;
                        node.opacity = 230;
                        node.angle = 180;
                        node.setPosition(pos);
                        BattleManager.getInstance().arenaRivalDisplay.addChild(node, Defines.Z.FLYDAMAGEMSG);
                        self.flyFadeAction(node, critical, immediately);
                    }
                });
            }
            if (!immediately) {
                this.flyMsgTime3 = this.flyCurTime;
            }
        } else if (dmg == 0) {
            if (this.flyCurTime - this.flyMsgTime1 >= 0.3 || immediately) {
                var self = this;
                GlobalVar.resManager().loadRes(ResMapping.ResType.SpriteFrame, 'cdnRes/battle/_text_resist', function (frame) {
                    if (frame != null) {
                        let node = new cc.Node();
                        let sp = node.addComponent(cc.Sprite);
                        sp.spriteFrame = frame;
                        node.scale = 1.0;
                        node.opacity = 230;
                        node.angle = 180;
                        node.setPosition(pos);
                        BattleManager.getInstance().arenaRivalDisplay.addChild(node, Defines.Z.FLYDAMAGEMSG);
                        self.flyFadeAction(node, critical, immediately);
                    }
                });
                if (!immediately) {
                    this.flyMsgTime1 = this.flyCurTime;
                }
            }
        } else if (!!critical) {
            if (this.flyCurTime - this.flyMsgTime2 >= 0.3 || immediately) {
                var self = this;
                GlobalVar.resManager().loadRes(ResMapping.ResType.SpriteFrame, 'cdnRes/battle/_text_baoji', function (frame) {
                    if (frame != null) {
                        let node = new cc.Node();
                        let sp = node.addComponent(cc.Sprite);
                        sp.spriteFrame = frame;
                        node.scale = 1.0;
                        node.opacity = 230;
                        node.angle = 180;
                        node.setPosition(pos);
                        BattleManager.getInstance().arenaRivalDisplay.addChild(node, Defines.Z.FLYDAMAGEMSG);
                        self.flyFadeAction(node, critical, immediately);
                    }
                });
            }
            if (!immediately) {
                this.flyMsgTime2 = this.flyCurTime;
            }
        }
    },

    flyFadeAction(node, critical, big) {
        let oldPos = node.getPosition();

        let exScale = 1.2;

        if (big) {
            exScale = 1.5;
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

        let move = cc.moveTo(0.6, oldPos.sub(cc.v3(20, 50)));
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

    getCollisionSwitch: function (open) {
        return true;
    },

    getShow: function () {
        return true;
    },
});