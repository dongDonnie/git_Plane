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
        this.battleManager=BattleManager.getInstance();
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

    setBuff(dropId) {
        this.objectID = dropId;
    },

    newObject() {
        let resName = "";
        if (this.objectID == Defines.Assist.WEAPON_UP) {
            resName = "cdnRes/battle/battle_buff_1";
        } else if (this.objectID == Defines.Assist.SUPER) {
            resName = "cdnRes/battle/battle_buff_5";
        } else if (this.objectID == Defines.Assist.PROTECT) {
            resName = "cdnRes/battle/battle_buff_3";
        } else if (this.objectID == Defines.Assist.HP) {
            resName = "cdnRes/battle/battle_buff_2";
        } else if (this.objectID == Defines.Assist.GREENSTONE) {
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
            resName = "cdnRes/battle/battle_buff_4";
        }

        this.baseObject = this.poolManager.getInstance().getObject(Defines.PoolType.BUFF);
        if (this.baseObject == null) {
            this.baseObject = new cc.Node();
            let sp = this.baseObject.addComponent(cc.Sprite);
            let collider = this.baseObject.addComponent(cc.BoxCollider)
            sp.spriteFrame = GlobalVar.resManager().loadRes(ResMapping.ResType.SpriteFrame, resName);
            if (this.objectID <= Defines.Assist.GHOST) {
                collider.offset = cc.v3(0, 20);
                collider.size = cc.size(90, 90);
            } else {
                collider.size = this.baseObject.getContentSize();
            }
        } else {
            let sp = this.baseObject.getComponent(cc.Sprite);
            let collider = this.baseObject.getComponent(cc.BoxCollider)
            sp.spriteFrame = GlobalVar.resManager().loadRes(ResMapping.ResType.SpriteFrame, resName);
            if (this.objectID <= Defines.Assist.GHOST) {
                collider.offset = cc.v3(0, 20);
                collider.size = cc.size(90, 90);
            } else {
                collider.size = this.baseObject.getContentSize();
            }
        }
        this.addChild(this.baseObject, 1);
        if (this.objectID == Defines.Assist.GOLD) {
            this.setScale(0.7);
        } else {
            this.setScale(1);
        }
        let z = this._super();
        return z;
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
                let v=this.atrb.scanChase.target.getPosition().sub(pos).normalize().mul(this.atrb.scanChase.chaseSpeed);
                pos.x += v.x * dt;
                pos.y += v.y * dt;
                if (this.atrb.scanChase.target.getPosition().sub(pos).mag() <= this.atrb.scanChase.chaseDistance * 0.2) {
                    this.atrb.scanChase.status = 2;
                    this.battleManager.collision.collisionHeroWithBuff(this);
                    //GlobalVar.soundManager().playEffect('cdnRes/audio/battle/effect/gold_bing');
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