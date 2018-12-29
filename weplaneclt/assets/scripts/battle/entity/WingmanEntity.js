const Defines = require('BattleDefines');
const PartEntity = require('PartEntity');

cc.Class({
    extends: PartEntity,

    ctor: function () {
        this.objectType = Defines.ObjectType.OBJ_WINGMAN;

        this.prop[Defines.PropName.Life] = 10;
        this.prop[Defines.PropName.Attack] = 1;
        this.prop[Defines.PropName.Defense] = 1;
        this.prop[Defines.PropName.CriticalRate] = 0;
        this.prop[Defines.PropName.CriticalDamage] = this.prop[Defines.PropName.Attack] * 2;
        this.prop[Defines.PropName.SkillAttack] = this.prop[Defines.PropName.Attack] * 4;

        this.lv = 1;

        this.hp = this.maxHp = this.prop[Defines.PropName.Life];

        this.reachTime = 0.1;

        this.heroManager = require('HeroManager').getInstance();
    },

    reset: function () {
        this._super();
        this.lv = 1;
        this.hp = this.maxHp = this.prop[Defines.PropName.Life];
    },

    newPart: function (objectName, objectType, objectClass, showType, side, pos) {
        this._super(objectName, objectType, objectClass, showType, side, pos)

        let heightPercent = -0.1;
        let widthPlus = 90;
        if (pos == 0) {
            heightPercent = -0.2;
            widthPlus = 95;
        } else if (pos == 1) {
            heightPercent = -0.1;
            widthPlus = 110;
        }

        if (side == -1) {
            this.setPosition(0.5 * cc.view.getDesignResolutionSize().width - widthPlus, heightPercent * cc.winSize.height);
            this.setScale(-1, 1);
        } else if (side == 1) {
            this.setPosition(0.5 * cc.view.getDesignResolutionSize().width + widthPlus, heightPercent * cc.winSize.height);
        } else {
            this.setPosition(0.5 * cc.view.getDesignResolutionSize().width, heightPercent * cc.winSize.height);
        }

    },

    chaseFighter: function (dt, endMode) {
        let chasePos = this.heroManager.planeEntity.getPosition();
        if (this.side == -1 && this.pos == 0) {
            chasePos = chasePos.add(cc.v3(-95, -80));
        } else if (this.side == 1 && this.pos == 0) {
            chasePos = chasePos.add(cc.v3(95, -80));
        } else if (this.side == -1 && this.pos == 1) {
            chasePos = chasePos.add(cc.v3(-110, 60));
        } else if (this.side == 1 && this.pos == 1) {
            chasePos = chasePos.add(cc.v3(110, 60));
        }
        let pos = this.getPosition();
        let distance = pos.sub(chasePos).mag();
        if (distance > 0) {
            if (distance <= 1) {
                this.setPosition(chasePos);
            } else {
                let vecS = chasePos.sub(this.getPosition());
                let v0 = vecS.mag() / this.reachTime;
                let v = (vecS.normalize()).mul(v0 * dt);
                this.setPosition(this.getPosition().add(v));
            }
        }
        endMode = typeof endMode !== 'undefined' ? endMode : false;
        if (endMode) {
            this.setPosition(chasePos);
        }
    },

    update(dt) {
        this._super(dt);
        this.chaseFighter(dt);

        if (this.showType == 1) {
            if (this.lastSkillTime <= 0) {
                if (this.partData.skillIDs.length == 1) {
                    this.useNormalBullet();
                } else {
                    if (this.state == 2) {
                        this.useSuperBullet();
                    } else {
                        this.useNormalBullet();
                    }
                }
            }
            this.lastSkillTime -= dt;
        }
    },

    hitWithDamage(dmg) {

    }
});