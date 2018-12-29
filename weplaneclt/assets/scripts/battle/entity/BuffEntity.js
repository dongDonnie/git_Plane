const Defines = require('BattleDefines')
const GlobalVar = require('globalvar')
const ResMapping = require("resmapping")
const BaseEntity = require('BaseEntity')
const BattleManager = require('BattleManager')

cc.Class({
    extends: BaseEntity,

    properties: {

    },

    ctor() {
        this.battleManager = BattleManager.getInstance();
    },

    reset() {
        this._super();
        this.resetScanChase();
    },

    resetScanChase: function () {
        this.atrb.scanChase = {};

        this.atrb.scanChase.target = null;
        this.atrb.scanChase.chaseDistance = 0;
        this.atrb.scanChase.chaseSpeed = 0;
        this.atrb.scanChase.status = 0;
    },

    newObject() {
        this.baseObject = this.poolManager.getInstance().getObject(Defines.PoolType.BUFF, this.objectName);
        if (this.objectName == 'SpriteBuff') {
            let resName = "";
            if (this.objectID == Defines.Assist.GREENSTONE) {
                resName = "cdnRes/battle/stone_01";
            } else if (this.objectID == Defines.Assist.BLUESTONE) {
                resName = "cdnRes/battle/stone_02";
            } else if (this.objectID == Defines.Assist.PURPERSTONE) {
                resName = "cdnRes/battle/stone_03";
            } else if (this.objectID == Defines.Assist.GOLD) {
                resName = "cdnRes/battle/gold";
            } else if (this.objectID == Defines.Assist.CHEST1) {
                resName = "cdnRes/battle/treasure_box_1";
            } else if (this.objectID == Defines.Assist.CHEST2) {
                resName = "cdnRes/battle/treasure_box_2";
            } else if (this.objectID == Defines.Assist.CHEST3) {
                resName = "cdnRes/battle/treasure_box_3";
            } else if (this.objectID == Defines.Assist.CHEST4) {
                resName = "cdnRes/battle/treasure_box_4";
            } else if (this.objectID == Defines.Assist.CHEST5) {
                resName = "cdnRes/battle/treasure_box_5";
            } else if (this.objectID == Defines.Assist.CHEST6) {
                resName = "cdnRes/battle/treasure_box_6";
            } else {
                resName = "cdnRes/battle/gold";
            }

            if (this.baseObject == null) {
                this.baseObject = new cc.Node();
                let sp = this.baseObject.addComponent(cc.Sprite);
                let collider = this.baseObject.addComponent(cc.BoxCollider);
                sp.spriteFrame = GlobalVar.resManager().loadRes(ResMapping.ResType.SpriteFrame, resName);
                collider.size = this.baseObject.getContentSize();
            } else {
                let sp = this.baseObject.getComponent(cc.Sprite);
                let collider = this.baseObject.getComponent(cc.BoxCollider);
                sp.spriteFrame = GlobalVar.resManager().loadRes(ResMapping.ResType.SpriteFrame, resName);
                collider.size = this.baseObject.getContentSize();
            }
        } else {
            if (this.baseObject == null) {
                let prefab = GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/battlemodel/prefab/effect/' + this.objectName);
                if (prefab != null) {
                    this.baseObject = cc.instantiate(prefab);
                }else{
                    this.isShow = true;
                    this.isDead = true;
                }
            }
        }

        if(this.baseObject != null){
            this.addChild(this.baseObject, 1);
        }
        
        if (this.objectID == Defines.Assist.GOLD) {
            this.setScale(0.7);
        } else {
            this.setScale(1);
        }
        let z = this._super();
        return z;
    },

    pauseAction() {
        if (this.baseObject != null) {
            if(this.baseObject.getComponent(cc.Animation) != null){
                let anime = this.baseObject.getComponent(cc.Animation);
                anime.stop();
            }
        }
    },

    resumeAction() {
        if (this.baseObject != null) {
            if(this.baseObject.getComponent(cc.Animation) != null){
                let anime = this.baseObject.getComponent(cc.Animation);
                anime.play();
            }
        }
    },

    checkOut: function (dt) {
        let pos = this.getPosition();
        let size = this.battleManager.displayContainer.getContentSize();

        if (this.battleManager.allScreen) {
            size.height -= 130;
        } else {
            size.height -= 47;
        }

        if (this.isShow) {
            if (pos.y > size.height + Defines.OUT_SIDE || pos.x < -Defines.OUT_SIDE || pos.y < -Defines.OUT_SIDE || pos.x > size.width + Defines.OUT_SIDE) {
                this.isDead = true;
            }
        } else {
            if (pos.y < size.height && pos.x > 0 && pos.y > 0 && pos.x < size.width) {
                this.isShow = true;
            }
            if (pos.y > size.height + Defines.FORCE_DESTORY || pos.y < -Defines.FORCE_DESTORY || pos.x > size.width + Defines.FORCE_DESTORY || pos.x < -Defines.FORCE_DESTORY) {
                if (this.objectType != Defines.ObjectType.OBJ_GOLD){
                    this.isShow = true;
                    this.isDead = true;
                }
            }
        }
    },

    update: function (dt) {
        this._super(dt);

        this.updateScanChase(dt);
    },

    updateScanChase: function (dt) {
        if (this.atrb.scanChase.target != null && cc.isValid(this.atrb.scanChase.target)) {

            if (this.atrb.scanChase.status == 0) {
                let pos = this.getPosition();
                if (this.atrb.scanChase.target.getPosition().sub(pos).mag() <= this.atrb.scanChase.chaseDistance) {
                    this.setMovementType(-1);
                    this.atrb.scanChase.status = 1;
                }
                this.setPosition(pos);
            } else if (this.atrb.scanChase.status == 1) {
                let pos = this.getPosition();
                let v = this.atrb.scanChase.target.getPosition().sub(pos).normalize().mul(this.atrb.scanChase.chaseSpeed);
                pos.x += v.x * dt;
                pos.y += v.y * dt;
                if (this.atrb.scanChase.target.getPosition().sub(pos).mag() <= this.atrb.scanChase.chaseDistance * 0.2) {
                    this.atrb.scanChase.status = 2;
                    this.battleManager.collision.collisionHeroWithBuff(this, this.atrb.scanChase.target);
                }
                this.setPosition(pos);
            }

        }
    },

    setScanChase: function (target, distance, speed) {
        if (target != null) {
            this.atrb.scanChase.target = target;
            this.atrb.scanChase.chaseDistance = typeof distance !== 'undefined' ? distance : 0;
            this.atrb.scanChase.chaseSpeed = typeof speed !== 'undefined' ? speed : 1;
            this.atrb.scanChase.status = 0;
        }
    },
});