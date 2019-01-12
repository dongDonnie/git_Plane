const Defines = require('BattleDefines');
const GlobalVar = require('globalvar');
const ResMapping = require("resmapping");
const PartEntity = require('PartEntity');
const BattleManager = require('BattleManager');
const HeroManager = require('HeroManager');
const base64 = require("base64");

cc.Class({
    extends: PartEntity,

    ctor: function () {
        this.objectType = Defines.ObjectType.OBJ_HERO;

        this.prop[Defines.PropName.Life] = 10;
        this.prop[Defines.PropName.Attack] = 1;
        this.prop[Defines.PropName.Defense] = 1;
        this.prop[Defines.PropName.CriticalRate] = 0;
        this.prop[Defines.PropName.CriticalDamage] = this.prop[Defines.PropName.Attack] * 2;
        this.prop[Defines.PropName.PetAttack] = 1;
        this.prop[Defines.PropName.AssistAttack] = 1;
        this.prop[Defines.PropName.MissileAttack] = 1;
        this.prop[Defines.PropName.SkillAttack] = this.prop[Defines.PropName.Attack] * 4;
        this.prop[Defines.PropName.PetGrowPercent] = 0;
        this.prop[Defines.PropName.AssistGrowPercent] = 0;
        this.prop[Defines.PropName.MissileGrowPercent] = 0;
        this.prop[Defines.PropName.SkillGrowPercent] = 0;

        this.lv = 1;

        this.hp = this.maxHp = this.prop[Defines.PropName.Life];

        this.missleSwitch = false;
        this.missleSkillID = -1;
        this.missleSkillCD = -1;
        this.autoCurTime = 0;

        this.superSkillID = -1;

        this.barrier = null;
        this.barrierFade = false;

        this.accel = null;

        this.showReady = 0;

        this.heroManager = require('HeroManager').getInstance();
    },

    reset: function () {
        this._super();
        this.lv = 1;
        this.hp = this.maxHp = this.prop[Defines.PropName.Life];

        this.missleSwitch = false;
        this.missleSkillID = -1;
        this.missleSkillCD = -1;
        this.autoCurTime = 0;

        if (this.barrier != null && cc.isValid(this.barrier)) {
            this.barrier.destroy();
        }
        if (this.accel != null && cc.isValid(this.accel)) {
            this.accel.destroy();
        }

        this.showReady = 0;
    },

    setProp: function (id, props) {
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
        
        this.hp = this.maxHp = this.prop[Defines.PropName.Life] + this.prop[Defines.PropName.Defense] * 5;

        var member = GlobalVar.me().memberData.getMemberByID(id);
        if (member == null) {
            this.prop[Defines.PropName.Attack] *= 3;
            member = GlobalVar.me().memberData.getMemberByID(GlobalVar.me().memberData.getStandingByFighterConf().ChuZhanMemberID);
        }
        this.lv = member.Level;
    },

    newPart: function (objectName, objectType, objectClass, showType, side, pos) {
        this._super(objectName, objectType, objectClass, showType, side, pos)

        let index = objectName.lastIndexOf('_');
        let id = objectName.substring(index + 1, objectName.length);
        let memberData = GlobalVar.tblApi.getDataBySingleKey('TblMember', id);
        let skillIDs = [memberData.wSkillCommon, memberData.wSkillCommon + 1, memberData.wSkillCommon + 2, memberData.wSkillCommon + 3];
        this.setSkillIDs(skillIDs);

        this.setScale(memberData.dScale);

        if (!side) {
            this.setPosition(0.5 * cc.view.getDesignResolutionSize().width /*320*/ , -0.2 * cc.winSize.height);
        }
    },

    update: function (dt) {
        if (this.hp <= 0) {
            return;
        }

        this._super(dt);
        this.updateMissle(dt);

        if (this.protectTime <= 0 && this.barrier != null && cc.isValid(this.barrier)) {
            this.barrier.destroy();
            require('AIInterface').eliminateAllMonsterBullets(false, true);
        } else if (this.protectTime >= 0 && this.protectTime <= Defines.PROTECT_TIME * 0.25 && this.barrier != null && cc.isValid(this.barrier) && !this.barrierFade) {
            this.barrier.runAction(cc.sequence(cc.fadeOut(Defines.PROTECT_TIME * 0.25 * 0.4), cc.fadeIn(Defines.PROTECT_TIME * 0.25 * 0.4), cc.fadeOut(Defines.PROTECT_TIME * 0.25 * 0.2)));
            this.barrierFade = true;
        }

        if (this.dashTime <= 0 && this.accel != null && cc.isValid(this.accel)) {
            this.accel.destroy();
        }

        if (this.showType == 1) {
            if (this.showReady == 0) {
                if (this.part != null) {
                    var self = this;
                    this.part.transform(function () {
                        self.showReady = 2;
                        self.state = 1;
                    });
                    this.showReady = 1;
                    return;
                }
            }
            if (this.showReady != 2) {
                return;
            }
            if (this.lastSkillTime <= 0) {
                if (this.skillLevel <= this.partData.skillIDs.length - 2 || this.partData.skillIDs.length <= 1) {
                    if (this.lastCrazyCount <= 0) {
                        //this.skillLevelUp(1);
                        this.heroManager.skillLevelUp(1);
                        this.lastCrazyCount = Defines.DEMOCOUNT / this.lastSkillTime;
                    } else {
                        this.useNormalBullet();
                    }
                } else {
                    if (this.state == 2 && this.lastCrazyCount <= 0) {
                        //this.skillLevelDown(3);
                        this.heroManager.skillLevelDown(3);
                        this.lastCrazyCount = Defines.DEMOCOUNT / this.lastSkillTime;
                    } else {
                        this.useSuperBullet();
                    }
                }
                this.lastCrazyCount--;
            }
            this.lastSkillTime -= dt;
        }
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

    setSuperSkill: function (skillid) {
        this.superSkillID = typeof skillid !== 'undefined' ? skillid : -1;
    },

    getSuperSkill: function () {
        let tblSkill = GlobalVar.tblApi.getDataBySingleKey('TblBattleSkill', this.superSkillID);
        if (!tblSkill) {
            return -1;
        } else {
            return this.superSkillID;
        }
    },

    runHurtEffect() {
        this._super();
        BattleManager.getInstance().runHurtEffect();
    },

    pauseAction() {
        this._super();
        if (this.accel != null && cc.isValid(this.accel)) {
            this.accel.getComponent(cc.Animation).stop();
        }
        if (this.barrier != null && cc.isValid(this.barrier)) {
            this.barrier.getComponent(cc.Animation).stop();
        }
    },

    resumeAction() {
        this._super();
        if (this.accel != null && cc.isValid(this.accel)) {
            this.accel.getComponent(cc.Animation).play();
        }
        if (this.barrier != null && cc.isValid(this.barrier)) {
            this.barrier.getComponent(cc.Animation).play();
        }
    },

    addHP(plus) {
        GlobalVar.soundManager().playEffect('cdnRes/audio/battle/effect/blood_cure');
        this._super(plus);
        this.showGetBuffEffect(Defines.Assist.HP);
    },

    addProtectTime(time) {
        GlobalVar.soundManager().playEffect('cdnRes/audio/battle/effect/blood_cure');
        this._super(time);
        if (this.protectTime > 0) {
            this.showGetBuffEffect(Defines.Assist.PROTECT);
            if (this.barrier == null || !cc.isValid(this.barrier)) {
                var self = this;
                GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/battlemodel/prefab/effect/Shield', function (prefab) {
                    if (prefab != null) {
                        self.barrier = cc.instantiate(prefab);

                        if (!!self.partObject) {
                            let box = self.barrier.getComponent(cc.BoxCollider);
                            let s = Math.max(self.partObject.width / box.size.width, self.partObject.height / box.size.height);
                            self.barrier.setScale(s);
                        }

                        self.addChild(self.barrier, Defines.Z.BARRIER);
                    }
                });
            }
            if (this.barrier != null && cc.isValid(this.barrier)) {
                this.barrierFade = false;
                this.barrier.stopAllActions();
                this.barrier.opacity = 255;
            }
        }
    },

    addMagnetTime(time) {
        this._super(time);
    },

    addDashTime(time) {
        if (BattleManager.getInstance().isOpenDash || BattleManager.getInstance().forceDash) {
            if (time == -1) {
                if (this.accel == null || !cc.isValid(this.accel)) {
                    var self = this;
                    GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/battlemodel/prefab/effect/Accel', function (prefab) {
                        if (prefab != null) {
                            self.accel = cc.instantiate(prefab);
                            self.addChild(self.accel, Defines.Z.FIGHTER);
                        }
                    });
                }
            } else if (time == -2) {
                if (this.accel != null && cc.isValid(this.accel)) {
                    this.accel.destroy();
                }
            }
        } else {
            this._super(time);
            if (this.dashTime > 0) {
                if (this.accel == null || !cc.isValid(this.accel)) {
                    var self = this;
                    GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/battlemodel/prefab/effect/Accel', function (prefab) {
                        if (prefab != null) {
                            self.accel = cc.instantiate(prefab);
                            self.addChild(self.accel, Defines.Z.FIGHTER);
                        }
                    });
                }
                if (!BattleManager.getInstance().forceDash) {
                    BattleManager.getInstance().dashMode = 1;
                    BattleManager.getInstance().gameState = Defines.GameResult.DASHSTART;
                }
            } else {
                if (this.accel != null && cc.isValid(this.accel)) {
                    this.accel.destroy();
                }
            }
        }
    },

    updateDashTime(dt) {
        if (this.showType == 0 && this.dashTime > 0 && !BattleManager.getInstance().forceDash) {
            this.dashTime -= dt;
            if (this.dashTime < 0) {
                this.dashTime = 0;
            }
            if (this.dashTime == 0) {
                BattleManager.getInstance().dashMode = 3;
            }
        }
        if (this.showType == 0 && this.magnetTime > 0) {
            this.magnetTime -= dt;
            if (this.magnetTime < 0) {
                this.magnetTime = 0;
            }
        }
    },

    addChest(type) {
        this.showGetBuffEffect(type);
        BattleManager.getInstance().endlessGetChsetCount++;
        GlobalVar.soundManager().playEffect('cdnRes/audio/battle/effect/gold_bing');
    },

    addGold() {
        BattleManager.getInstance().endlessGoldCount++;
        let num = Number(base64.decode(BattleManager.getInstance().endlessScore));
        num += 1;
        BattleManager.getInstance().endlessScore = base64.encode(num.toString());
        //GlobalVar.soundManager().playEffect('cdnRes/audio/battle/effect/gold_bing');
    },

    addCrystal(score) {
        GlobalVar.soundManager().playEffect('cdnRes/audio/battle/effect/gold_bing');
        if (BattleManager.getInstance().isEndlessFlag) {
            let num = Number(base64.decode(BattleManager.getInstance().endlessScore));
            num += typeof score !== 'undefined' ? score : 1;
            BattleManager.getInstance().endlessScore = base64.encode(num.toString());
        }
    },

    hitWithDamage(dmg, immediately, param) {
        this._super(dmg, immediately, param);
        if (this.hp <= 0 && this.objectType == Defines.ObjectType.OBJ_HERO) {
            // if(BattleManager.getInstance().isEndlessFlag){
            //     BattleManager.getInstance().result = 2;
            // }
            // BattleManager.getInstance().gameState = Defines.GameResult.END;
            require('HeroManager').getInstance().selfDestroy();
        }
    },

    showGetBuffEffect: function (type) {
        if (this.getChildByName('8000') == null) {
            let prefab = GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/battlemodel/prefab/effect/GetBuff');
            if (prefab != null) {
                let getBuff = cc.instantiate(prefab);
                this.addChild(getBuff, 20, '8000');
                let pos = this.partObject.getPosition();
                pos.y -= 50;
                getBuff.setPosition(0, -pos.y);
                //let pos = this.partObject.getPosition().add(this.partObject.getChildByName("point").getPosition())
                //getBuff.setPosition(pos);
                //spine.setCompleteListener();
            }
        }
        if (this.getChildByName('8000') != null) {
            let animeName = '';
            if (type == Defines.Assist.WEAPON_UP) {
                animeName = "Tx_GetBuff_Sj";
            } else if (type == Defines.Assist.SUPER) {
                animeName = "Tx_GetBuff_Bz";
            } else if (type == Defines.Assist.PROTECT) {
                animeName = "Tx_GetBuff_Hd";
            } else if (type == Defines.Assist.HP) {
                animeName = "Tx_GetBuff_Hf";
            } else if (type == Defines.Assist.HP) {
                animeName = "Tx_GetBuff_Hf";
            } else if (type >= Defines.Assist.CHEST1 && type <= Defines.Assist.CHEST9) {
                animeName = "Tx_GetBuff_Bx";
            }
            if (animeName != '') {
                let getBuff = this.getChildByName('8000');
                let spine = getBuff.getComponent(sp.Skeleton);
                if (spine != null) {
                    spine.clearTrack(0);
                    spine.setAnimation(0, animeName, false);
                }
                let dragonbone = getBuff.getComponent(dragonBones.ArmatureDisplay);
                if (dragonbone != null) {
                    let dbArmature = dragonbone.armature();
                    dbArmature.animation.play(animeName, 1);
                }
            }
        }
    },

    selfDestroy: function (callback) {
        let size = cc.size(200, 200);
        let prefab = GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/battlemodel/prefab/effect/lBomb');
        if (prefab != null) {
            this.partObject.active = false;
            let Bomb = cc.instantiate(prefab);
            let s = Math.max(size.width / Bomb.width, size.height / Bomb.height);
            Bomb.setScale(s);
            this.addChild(Bomb, 8);
            Bomb.setPosition(this.partObject.getPosition());
            GlobalVar.soundManager().playEffect('cdnRes/audio/battle/effect/explode_boss');
        }

        if (this.skillLevel == 3) {
            require('BulletSolutions').solution_buff(Defines.Assist.SUPER, this.getPosition(), Math.floor(Math.random() * 360));
        } else {
            for (let i = 0; i < this.skillLevel; i++) {
                require('BulletSolutions').solution_buff(Defines.Assist.WEAPON_UP, this.getPosition(), Math.floor(Math.random() * 360));
            }
        }

        if (!!callback) {
            this.runAction(
                cc.sequence(
                    cc.delayTime(0.4),
                    cc.callFunc(callback),
                    cc.removeSelf(true),
                )
            );
        } else {
            this.runAction(
                cc.sequence(
                    cc.delayTime(0.4),
                    cc.removeSelf(true),
                )
            );
        }
    },
});