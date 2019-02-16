const Defines = require('BattleDefines');
const GlobalVar = require('globalvar');
const ResMapping = require("resmapping");
const BM = require('BulletMapping');

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
        this.openFire = false;

        this.chaseTarget = null;
        this.reachTime = 0.1;
    },

    reset: function () {
        this.lv = 1;
        this.hp = this.maxHp = this.prop[Defines.PropName.Life];
        this.state = 0;
        this.skillID = -1;
        this.lastSkillTime = 0;
        this.skillCD = 5;
        this.openFire = false;
        this.chaseTarget = null;
        this.reachTime = 0.1;
    },

    newPart: function (objectName, objectType, objectClass, side, pos, mark, chaseTarget) {
        this.objectName = typeof objectName !== 'undefined' ? objectName : '';
        this.objectType = typeof objectType !== 'undefined' ? objectType : Defines.ObjectType.OBJ_INVALID;
        this.objectClass = typeof objectClass !== 'undefined' ? objectClass : '';
        this.side = typeof side !== 'undefined' ? side : 0;
        this.pos = typeof pos !== 'undefined' ? pos : 0;
        mark = typeof mark !== 'undefined' ? mark : 0;
        this.chaseTarget = cc.isValid(chaseTarget) ? chaseTarget : null;

        if (this.objectName == '' || this.objectType == Defines.ObjectType.OBJ_INVALID) {
            return false;
        }

        if (mark == 1) {
            let prefab = GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/battlemodel/prefab/' + objectName);
            if (prefab != null) {
                this.partObject = cc.instantiate(prefab);
                this.part = this.partObject.getComponent(this.objectClass);
                this.part.setObjectType(this.objectType);
                this.addChild(this.partObject);
            }
        } else if (mark == 2) {
            let itemData = GlobalVar.tblApi.getDataBySingleKey('TblItem', objectName);
            let path = '';
            if (itemData.byColor != 6) {
                path = 'cdnRes/itemicon/' + itemData.byType + '/' + itemData.byColor + '/' + objectName;
            } else {
                path = 'cdnRes/itemicon/' + itemData.byType + '/5/' + objectName;
            }
            this.partObject = new cc.Node();
            let sp = this.partObject.addComponent(cc.Sprite);
            sp.spriteFrame = GlobalVar.resManager().loadRes(ResMapping.ResType.SpriteFrame, path);
            this.addChild(this.partObject);
        }

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

        return false;
    },

    getPart() {
        return this.part;
    },

    fireSwitch(open) {
        this.openFire = typeof open !== 'undefined' ? open : false;
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

    updateSuperBullet(dt) {
        if (this.lastSkillTime <= 0) {
            this.useSuperBullet();
        } else {
            this.lastSkillTime -= dt;
        }
    },

    chaseFighter: function (dt, endMode) {
        let chasePos = this.chaseTarget.getPosition();
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
        this.chaseFighter(dt);
        if (!!this.openFire) {
            this.updateSuperBullet(dt);
        }
    },
});