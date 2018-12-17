const Defines = require('BattleDefines')
const GlobalVar = require("globalvar")
const HeroManager = require('HeroManager');
const ProductLine = require('ProductLine')
const BulletEntity = require('BulletEntity')
const MonsterEntity = require('MonsterEntity')
const BuffEntity = require('BuffEntity')
const ExecuteEntity = require('ExecuteEntity')
const SundriesEntity = require('SundriesEntity')

var Factory = cc.Class({
    statics: {
        instance: null,
        getInstance: function () {
            if (Factory.instance == null) {
                Factory.instance = new Factory();
            }
            return Factory.instance;
        },
        destroyInstance() {
            if (Factory.instance != null) {
                delete Factory.instance;
                Factory.instance = null;
            }
        }
    },

    properties: {
        lineList: [],
        newList: [],
        deadList: [],
        lineID: 0,
    },

    start(mgr) {
        this.poolManager = require('PoolManager');
        this.battleManager = require('BattleManager');
    },

    update(dt) {
        this.updateNewList(dt);
        this.updateLineList(dt);
        this.updateDeadList(dt);
    },

    updateNewList(dt) {
        for (let i = 0; i < this.newList.length; ++i) {
            this.newLine(this.newList[i]);
        }
        this.newList.splice(0, this.newList.length);
    },

    updateDeadList(dt) {
        for (let i = 0; i < this.deadList.length; ++i) {
            this.deleteLine(this.deadList[i]);
        }
        this.deadList.splice(0, this.deadList.length);
    },

    updateLineList(dt) {
        for (let e of this.lineList) {
            if (e.isDead) {
                this.deadList.push(e);
            } else {
                e.update(dt);
            }
        }
    },

    getLineID: function () {
        let id = this.lineID;
        this.lineID++;
        return id;
    },

    newLine: function (line) {
        if (line.isDead) {
            return;
        }
        line.lineID = this.getLineID();
        this.lineList.push(line);
    },

    deleteLine: function (line) {
        for (let j = 0; j < this.lineList.length; ++j) {
            if (line == this.lineList[j]) {
                this.lineList.splice(j, 1);
                this.poolManager.getInstance().putProductLine(Defines.PoolType.PRODUCTLINE, line);
                break;
            }
        }
    },

    shutdownByCustomer: function (customer) {
        for (let e of this.lineList) {
            if (e.customer != null) {
                if (e.customer.uuid == customer.uuid) {
                    e.isDead = true;
                }
            }
        }
    },

    shutdownByLineType: function (lineType) {
        for (let e of this.lineList) {
            if (e.lineType == lineType) {
                e.isDead = true;
            }
        }
    },

    isAllFakeHeroClear: function () {
        for (let e of this.lineList) {
            if (e.lineType == Defines.ObjectType.OBJ_FAKE_HERO) {
                return false
            }
        }
        return true;
    },

    produceFake: function (customer, type) {
        if (typeof customer === 'undefined' || customer == null) {
            return null;
        }

        let line = this.poolManager.getInstance().getProductLine();
        if (!line) {
            line = new ProductLine();
        }

        if (customer.objectType == Defines.ObjectType.OBJ_HERO ||
            customer.objectType == Defines.ObjectType.OBJ_WINGMAN ||
            customer.objectType == Defines.ObjectType.OBJ_ASSIST) {
            line.lineType = Defines.ObjectType.OBJ_FAKE_HERO;
        } else {
            line.lineType = Defines.ObjectType.OBJ_FAKE;
        }
        line.customer = customer;

        if (typeof type !== 'undefined') {
            line.lineType = type;
            if (line.lineType == Defines.ObjectType.OBJ_EXECUTE) {
                line.customer = null;
            }
        }

        this.newList.push(line);
        return line;
    },

    bulletDamage: function (atkProp, atkLevel, part, skilllevel) {
        let dps = 0;
        let criticalStrike = false;

        switch (part) {
            case Defines.Part.Unknown:
                dps = atkProp[Defines.PropName.Attack];
                break;
            case Defines.Part.Main:
                let criticalVal = 1;
                if (typeof atkProp[Defines.PropName.CriticalRate] !== 'undefined') {
                    criticalVal = 0.4 * (atkProp[Defines.PropName.CriticalRate] / (atkProp[Defines.PropName.CriticalRate] + atkLevel * 50 + 500));
                }
                if (Math.random() < criticalVal) {
                    criticalStrike = true;
                    dps = atkProp[Defines.PropName.Attack] + atkProp[Defines.PropName.CriticalDamage] * 1.5;
                } else {
                    dps = atkProp[Defines.PropName.Attack];
                }
                if (typeof skilllevel !== 'undefined') {
                    switch (skilllevel) {
                        case 0:
                            dps *= 25;
                            break;
                        case 1:
                            dps *= 32;
                            break;
                        case 2:
                            dps *= 40;
                            break;
                        case 3:
                            dps *= 55;
                            break;
                    }
                }
                dps *= (Math.random() * 0.1 + 0.95);
                break;
            case Defines.Part.Monster:
                dps = atkProp[Defines.PropName.Attack];
                break;
            case Defines.Part.Pet:
                dps = (0.2 + (atkProp[Defines.PropName.PetAttack] + 100) / (atkProp[Defines.PropName.PetAttack] + 100 + atkLevel * 30)) * atkProp[Defines.PropName.Attack];
                if (typeof skilllevel !== 'undefined') {
                    switch (skilllevel) {
                        case 0:
                        case 1:
                        case 2:
                            dps *= 30;
                            break;
                        case 3:
                            dps *= 75;
                            break;
                    }
                }
                break;
            case Defines.Part.Assist:
                dps = (0.2 + (atkProp[Defines.PropName.AssistAttack] + 100) / (atkProp[Defines.PropName.AssistAttack] + 100 + atkLevel * 30)) * atkProp[Defines.PropName.Attack];
                dps *= 30;
                break;
            case Defines.Part.Skill:
                dps = (0.2 + (atkProp[Defines.PropName.SkillAttack] + 100) / (atkProp[Defines.PropName.SkillAttack] + 100 + atkLevel * 30)) * atkProp[Defines.PropName.Attack] * 50;
                //dps *= 80;
                break;
            case Defines.Part.Missile:
                dps = (0.2 + (atkProp[Defines.PropName.MissileAttack] + 100) / (atkProp[Defines.PropName.MissileAttack] + 100 + atkLevel * 30)) * atkProp[Defines.PropName.Attack];
                dps *= 50;
                break;
        }

        dps*=this.battleManager.getInstance().damagePlus;

        return {
            dmg: Math.ceil(dps),
            critical: criticalStrike
        };
    },

    produceBullet: function (id, owner, pos_plus) {
        if (typeof id === 'undefined' || typeof owner === 'undefined') {
            return null;
        }

        let tblBullet = GlobalVar.tblApi.getDataBySingleKey('TblBattleBullet', id);
        if (tblBullet == null) {
            return null;
        }

        let bullet = this.poolManager.getInstance().getEntity(Defines.PoolType.BULLET);
        if (!bullet) {
            bullet = new BulletEntity();
        }

        bullet.owner = owner;
        let type = Defines.ObjectType.OBJ_INVALID;
        if (owner.objectType == Defines.ObjectType.OBJ_HERO ||
            owner.objectType == Defines.ObjectType.OBJ_WINGMAN ||
            owner.objectType == Defines.ObjectType.OBJ_ASSIST) {
            type = Defines.ObjectType.OBJ_HERO_BULLET;
            if (owner.objectType == Defines.ObjectType.OBJ_HERO) {
                bullet.setZ(Defines.Z.FIGHTERBULLET);
            } else if (owner.objectType == Defines.ObjectType.OBJ_WINGMAN) {
                bullet.setZ(Defines.Z.WINGMANBULLET);
                bullet.owner = HeroManager.getInstance().planeEntity != null ? HeroManager.getInstance().planeEntity : owner;
            } else if (owner.objectType == Defines.ObjectType.OBJ_ASSIST) {
                bullet.setZ(Defines.Z.ASSISTBULLET);
                bullet.owner = HeroManager.getInstance().planeEntity != null ? HeroManager.getInstance().planeEntity : owner;
            }
        } else if (owner.objectType == Defines.ObjectType.OBJ_MONSTER) {
            type = Defines.ObjectType.OBJ_MONSTER_BULLET;
            bullet.setZ(Defines.Z.MONSTERBULLET);
        }

        bullet.setObjectData(type, id);
        //bullet.newObject();
        bullet.isDead = false;
        if (typeof owner !== 'undefined' && owner != null) {
            bullet.prop = bullet.owner.prop;
            if (type == Defines.ObjectType.OBJ_MONSTER_BULLET) {
                bullet.lv = owner.lv;
            } else {
                bullet.lv = GlobalVar.me().getLevel();
            }
            bullet.dmgMsg = this.bulletDamage(bullet.prop, bullet.lv, tblBullet.dwPart, owner.skillLevel);
            bullet.dmgMsg.dmg *= tblBullet.dDamageCoefficient;
            bullet.dmgMsg.dmg = Math.ceil(bullet.dmgMsg.dmg);
        }

        pos_plus = typeof pos_plus !== 'undefined' ? pos_plus : cc.v3(0, 0);
        let pos = owner.getPosition().add(pos_plus);
        bullet.setPosition(pos);

        return bullet;
    },

    produceMonster: function (info) {

        let tblMonster = GlobalVar.tblApi.getDataBySingleKey('TblBattleMonster', info.mId);

        if (tblMonster == null) {
            return null;
        }

        let monster = this.poolManager.getInstance().getEntity(Defines.PoolType.MONSTER, tblMonster.strName);
        if (!monster) {
            monster = new MonsterEntity();
        }

        monster.setObjectData(Defines.ObjectType.OBJ_MONSTER, info.mId)
        monster.setMonster(info.mId, info.lv);
        //monster.newObject();
        monster.isDead = false;

        let designSize = cc.view.getDesignResolutionSize();
        let pos = cc.v3(0, 0);

        if (info.pos.x >= 0 && info.pos.x <= 1) {
            pos.x = cc.winSize.width * info.pos.x;
        } else {
            if (info.pos.x > 1) {
                pos.x = cc.winSize.width + designSize.width * (info.pos.x - 1);
            } else {
                pos.x = designSize.width * info.pos.x;
            }
        }

        if (info.pos.y >= 0 && info.pos.y <= 1) {
            pos.y = cc.winSize.height * info.pos.y;
        } else {
            if (info.pos.y > 1) {
                pos.y = cc.winSize.height + designSize.height * (info.pos.y - 1);
            } else {
                pos.y = designSize.height * info.pos.y;
            }
        }

        monster.setPosition(pos);
        monster.setZ(Defines.Z.MONSTER);

        return monster;
    },

    produceBuff: function (id, pos, elastic, drop) {
        elastic = typeof elastic !== 'undefined' ? elastic : true;
        drop = typeof drop !== 'undefined' ? drop : false;
        let buff = this.poolManager.getInstance().getEntity(Defines.PoolType.BUFF);
        if (!buff) {
            buff = new BuffEntity();
        }

        if (id != Defines.Assist.GOLD) {
            buff.objectType = Defines.ObjectType.OBJ_BUFF;
        } else {
            buff.objectType = Defines.ObjectType.OBJ_GOLD;
        }

        buff.setObjectData(buff.objectType, id);
        //buff.newObject();

        buff.isDead = false;
        if (elastic) {
            buff.setEdgeCollision(Defines.MAX_COUNT);
        } else {
            buff.setEdgeCollisionWithoutBottom(drop);
        }

        buff.setPosition(pos);
        buff.setZ(Defines.Z.BUFF);

        return buff;
    },

    produceSundries: function (id, pos, target, hp) {
        if (!target) {
            return;
        }
        hp = typeof hp !== 'undefined' ? hp : 0;
        let sundries = this.poolManager.getInstance().getEntity(Defines.PoolType.OBJ_SUNDRIES);
        if (!sundries) {
            sundries = new SundriesEntity();
        }

        sundries.objectType = Defines.ObjectType.OBJ_SUNDRIES;
        sundries.setObject(id);
        sundries.setHp(hp);
        sundries.isDead = false;

        if (!!target) {
            target.addChild(sundries);
            sundries.setPosition(pos);
        }
        //sundries.setZ(Defines.Z.SUNDRIES);
        sundries.setZ(-1);

        return sundries;
    },

    produceExecute: function (id, pos) {
        if (typeof id === 'undefined') {
            return null;
        }

        let tblBullet = GlobalVar.tblApi.getDataBySingleKey('TblBattleBullet', id);
        if (tblBullet == null) {
            return null;
        }

        let execute = this.poolManager.getInstance().getEntity(Defines.PoolType.EXECUTE);
        if (!execute) {
            execute = new ExecuteEntity();
        }

        execute.setObjectData(Defines.ObjectType.OBJ_EXECUTE, id);
        execute.isDead = false;

        execute.dmgMsg = this.bulletDamage(HeroManager.getInstance().planeEntity.prop, GlobalVar.me().getLevel(), tblBullet.dwPart);

        execute.setPosition(pos);
        execute.setZ(Defines.Z.EXECUTE);

        return execute;
    },
});