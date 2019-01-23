const Defines = require('BattleDefines');
const GlobalVar = require('globalvar');
const ResMapping = require("resmapping");
const PartEntity = require('PartEntity');

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

        this.duration=-1;
        this.moveVec=cc.v3(0,0);

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

        this.duration=-1;
        this.moveVec=cc.v3(0,0);
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
        
        let member = GlobalVar.me().memberData.getMemberByID(id);
        this.lv = member.Level;
    },

    newPart: function (objectName, objectType, objectClass, showType, side, pos) {
        this._super(objectName, objectType, objectClass, showType, side, pos);

        let index = objectName.lastIndexOf('_');
        let id = objectName.substring(index + 1, objectName.length);
        let memberData = GlobalVar.tblApi.getDataBySingleKey('TblMember', id);
        let skillIDs = [memberData.wSkillCommon, memberData.wSkillCommon + 1, memberData.wSkillCommon + 2, memberData.wSkillCommon + 3];
        this.setSkillIDs(skillIDs);

        this.setScale(memberData.dScale);

        if (!side) {
            this.setPosition(Math.random()*(cc.view.getDesignResolutionSize().width-200)+100 , -0.2 * cc.winSize.height);
        }
    },

    update: function (dt) {
        if(this.duration>0){
            //this.duration-=dt;
            if(this.duration<0){
                this.duration=0;
                this.stopAllActions();
            }
            if(this.moveVec.x==0 && this.moveVec.y==0){
                this.moveVec=cc.v3(Math.random()*(cc.winSize.width-200)+100,Math.random()*cc.winSize.height*0.5);
                var self=this;
                this.runAction(
                    cc.sequence(
                        cc.moveTo(0.5,this.moveVec),
                        cc.delayTime(2),
                        cc.callFunc(function(){
                            self.moveVec=cc.v3(0,0);
                        })
                    )
                )
            }
        }else if(this.duration==0 && this.lastSkillTime<=0){
            require('AIInterface').eliminateBulletByOwner(this);
            this.duration=-1;
            var self=this;
            this.flyOutOffScreen(function(){
                self.selfDestroy();
            });
        }

        if(this.duration!=-1){
            this._super(dt);
            this.updateMissle(dt);
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

    setSkillLevel:function(level){
        this.skillLevel=typeof level !=='undefined'?((level>=0 && level<3)?level:0):0;
    },

    setDuration:function(duration){
        this.duration=typeof duration !=='undefined'?duration:Defines.FRIENDDURATION;
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

    addHP(plus) {
        //this._super(plus);
    },

    addProtectTime(time) {
        // this._super(time);
    },

    hitWithDamage(dmg, immediately) {
        //this._super(dmg, immediately);
    },

    showGetBuffEffect: function (type) {
        if (this.getChildByName('8000') == null) {
            let prefab = GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/battlemodel/prefab/effect/GetBuff');
            if (prefab != null) {
                let getBuff = cc.instantiate(prefab);
                this.addChild(getBuff, 20, '8000');
                let pos = this.partObject.getPosition()
                getBuff.setPosition(0, -pos.y);
            }
        }
        if (this.getChildByName('8000') != null) {
            let getBuff = this.getChildByName('8000');
            let spine = getBuff.getComponent(sp.Skeleton);
            let animeName = '';
            if (type == Defines.Assist.WEAPON_UP) {
                animeName = "Tx_GetBuff_Sj";
            } else if (type == Defines.Assist.SUPER) {
                animeName = "Tx_GetBuff_Bz";
            } else if (type == Defines.Assist.PROTECT) {
                animeName = "Tx_GetBuff_Hd";
            } else if (type == Defines.Assist.HP) {
                animeName = "Tx_GetBuff_Hf";
            }
            if (animeName != '') {
                spine.clearTrack(0);
                spine.setAnimation(0, animeName, false);
                spine.timeScale = 2;
            }
        }
    },
});