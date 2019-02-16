const Defines = require('BattleDefines')
const GlobalVar = require('globalvar')
const ResMapping = require("resmapping")
const BaseEntity = require('BaseEntity')

cc.Class({
    extends: BaseEntity,

    properties: {
        dmgMsg: null,
        hasAllScreenDamage: true,
        damageInterval: 1,
    },

    ctor: function () {
        this.reset();
    },

    reset() {
        this._super();
        this.hasAllScreenDamage = true;
        this.damageInterval = 0.016;
    },

    newObject() {
        this.baseObject = this.poolManager.getInstance().getObject(Defines.PoolType.EXECUTE, this.objectName);
        if (this.baseObject == null) {
            var self = this;
            let loadObject = function (prefab) {
                if (prefab != null) {
                    self.baseObject = cc.instantiate(prefab);
                    self.addChild(self.baseObject, 1);
                    self.baseObject.getComponent("ExecuteObject").setEntity(self);
                    self.baseObject.getComponent("ExecuteObject").animePlay(0);
                    if (!self.changeAnchor) {
                        self.baseObject.setPosition(self.atrb.objectAutoRotato.pos);
                        self.baseObject.angle = 0;
                    }
                } else {
                    self.isDead = true;
                }
            }
            let prefab = GlobalVar.resManager().getCacheRes(ResMapping.ResType.Prefab, 'cdnRes/battlemodel/prefab/effect/' + this.objectName);
            if (prefab != null) {
                loadObject(prefab);
            } else {
                GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/battlemodel/prefab/effect/' + this.objectName, loadObject);
            }
        } else {
            this.addChild(this.baseObject, 1);
            this.baseObject.getComponent("ExecuteObject").setEntity(this);
            this.baseObject.getComponent("ExecuteObject").animePlay(0);
            if (!this.changeAnchor) {
                this.baseObject.setPosition(this.atrb.objectAutoRotato.pos);
                this.baseObject.angle = 0;
            }
        }

        let item = GlobalVar.tblApi.getDataBySingleKey('TblBattleBullet', this.objectID);
        if (!!item) {
            this.setScale(item.dScale);
        }

        this.motionStreakCtrl(0);
        return this.zOrder;
    },

    pauseAction() {
        if (this.baseObject != null) {
            this.baseObject.getComponent("ExecuteObject").animePlay(1);
        }
    },

    resumeAction() {
        if (this.baseObject != null) {
            this.baseObject.getComponent("ExecuteObject").animePlay(2);
        }
    },

    update(dt) {
        this._super(dt);
    },

    setAllScreenDamage: function (yes) {
        this.hasAllScreenDamage = typeof yes !== 'undefined' ? yes : true;
    },
    getAllScreenDamage: function () {
        return this.hasAllScreenDamage;
    },

    setDamageInterval: function (interval) {
        this.damageInterval = typeof interval !== 'undefined' ? interval : 0.1;
    },
    getDamageInterval: function () {
        return this.damageInterval;
    },

});