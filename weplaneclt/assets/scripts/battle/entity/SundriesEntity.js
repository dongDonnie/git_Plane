const Defines = require('BattleDefines')
const GlobalVar = require('globalvar')
const ResMapping = require("resmapping")
const BaseEntity = require('BaseEntity')
const BattleManager = require('BattleManager')

cc.Class({
    extends: BaseEntity,

    properties: {
        collisionSwitch: false,
        invicible: true,
        monsterHpBar: null,
    },

    ctor() {

    },

    initEntity() {
        this._super();
        this.hp = 0;
        this.maxHp = 0;
        this.collisionSwitch = false;
        this.invicible = true;
        this.setMonsterHpBar();
    },

    reset() {
        this._super();
    },

    setHp(hp) {
        this.hp = this.maxHp = typeof hp !== 'undefined' ? hp : 0;
    },

    setObject(id) {
        this.objectID = id;
    },

    newObject() {
        let resName = "";

        if (this.objectID == Defines.Assist.WALLDARK) {
            resName = "cdnRes/battle/battle_wall_dark";
        } else if (this.objectID == Defines.Assist.WALLNEBULA) {
            resName = "cdnRes/battle/battle_wall_nebula";
        } else if (this.objectID == Defines.Assist.WALLLIGHT) {
            resName = "cdnRes/battle/battle_wall_light";
        } else {
            resName = "cdnRes/battle/battle_wall_dark";
        }

        this.baseObject = this.poolManager.getInstance().getObject(Defines.PoolType.OBJ_SUNDRIES);
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
        this.addChild(this.baseObject, 1);

        if (this.objectID == Defines.Assist.WALLDARK || this.objectID == Defines.Assist.WALLNEBULA || this.objectID == Defines.Assist.WALLLIGHT) {
            this.setScale(0.806);
        } else {
            this.setScale(1);
        }

        if (this.baseObject != null && this.monsterHpBar != null) {
            let size = this.getCollider().size;
            let offset = this.getCollider().offset;
            let bar = this.monsterHpBar.getChildByName("bar");
            if (size.width * 0.94 < bar.getContentSize().width) {
                bar.setContentSize(size.width * 0.94, bar.getContentSize().height);
                this.monsterHpBar.setContentSize(size.width, this.monsterHpBar.getContentSize().height);
            }
            bar.x = (-0.5 * bar.getContentSize().width);
            this.monsterHpBar.setPosition(0, offset.y - 0.5 * size.height);
            this.monsterHpBar.getComponent(cc.ProgressBar).progress = 1;
            //this.monsterHpBar.active=true;
        }

        let z = this._super();
        return z;
    },

    checkOut: function (dt) {
        // let target = this.getParent();
        // if (!!target) {
        //     let pos = this.getPosition().add(target.getPosition());
        //     let size = BattleManager.getInstance().displayContainer.getContentSize();

        //     if (BattleManager.getInstance().allScreen) {
        //         size.height -= 130;
        //     } else {
        //         size.height -= 47;
        //     }

        //     if (this.isShow) {
        //         if (pos.y >= size.height + this.getContentSize().height*0.5 || pos.y <= -this.getContentSize().height*0.5) {
        //             this.isDead = true;
        //         }
        //     } else {
        //         if (pos.y <= size.height && pos.y >= 0) {
        //             this.isShow = true;
        //             this.setCollisionSwitch(true);
        //         }
        //     }
        // } else {
        //     this.isShow = true;
        //     this.isDead = true;
        // }
        let pos = this.getPosition();
        let size = BattleManager.getInstance().displayContainer.getContentSize();

        if (BattleManager.getInstance().allScreen) {
            size.height -= 130;
        } else {
            size.height -= 47;
        }

        if (this.isShow) {
            if (pos.y > size.height + Defines.OUT_SIDE || pos.x < -Defines.OUT_SIDE || pos.y < -Defines.OUT_SIDE || pos.x > size.width + Defines.OUT_SIDE) {
                this.isDead = true;
            }
        } else {
            if (pos.y <= size.height && pos.y >= 0) {
                this.isShow = true;
                this.setCollisionSwitch(true);
            }
        }
    },

    setCollisionSwitch: function (open) {
        this.collisionSwitch = typeof open !== 'undefined' ? open : true;
    },

    getCollisionSwitch: function () {
        return this.collisionSwitch;
    },

    setInvicible: function (open) {
        this.invicible = typeof open !== 'undefined' ? open : true;
    },

    getInvicible: function () {
        return this.invicible;
    },

    setMonsterHpBar: function () {
        if (this.monsterHpBar == null) {
            let prefab = GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/battlemodel/prefab/effect/MonsterHp');
            if (prefab != null) {
                this.monsterHpBar = cc.instantiate(prefab);
                this.addChild(this.monsterHpBar, 3);
                this.monsterHpBar.active = false;
            }
        }
    },

    hitWithDamage: function (dmg) {
        if (!this.invicible) {
            // this._super(dmg);
            // if (this.hp < this.maxHp && this.monsterHpBar != null) {
            //     this.monsterHpBar.active = true;
            //     let percent = this.hp / this.maxHp;
            //     this.monsterHpBar.getComponent(cc.ProgressBar).progress = percent;
            // }
        }
    },
});