const Defines = require('BattleDefines');

var CoreObject=cc.Class({
    extends: cc.Component,

    properties: {
        spine: {
            default: null,
            type: sp.Skeleton
        },
        dragonBone: {
            default: null,
            type: dragonBones.ArmatureDisplay
        },
        dbArmature: {
            default: null,
            visible: false
        },
        dbArmatureCallback:{
            default:null,
            visible:false
        },
        collider: {
            default: null,
            type: cc.BoxCollider
        },
        _hasStop: {
            default: false,
            visible: false
        },
        mixTime: 0.2,
        objectType: {
            default: Defines.ObjectType.OBJ_INVALID,
            visible: false
        },
        entity: {
            default: null,
            visible: false
        },
        defaultAction: {
            default: null,
            visible: false
        },
    },

    onLoad: function () {
        if (this.dragonBone != null) {
            this.dbArmature = this.dragonBone.armature();
        }
        //cc.director.getCollisionManager().enabled = true;
        //cc.director.getCollisionManager().enabledDebugDraw = true;
        //cc.director.getCollisionManager().enabledDrawBoundingBox = true;
    },

    // _setMix(anim1, anim2) {
    //     if (this.spine != null) {
    //         this.spine.setMix(anim1, anim2, this.mixTime);
    //         this.spine.setMix(anim2, anim1, this.mixTime);
    //     }
    // },

    // onCollisionEnter: function (other, self) {
    //     // cc.log(other);
    //     // cc.log(self);
    //     // this.node.color = cc.Color.RED;
    // },

    // onCollisionStay: function (other, self) {
    //     // console.log('on collision stay');
    //     //cc.log(other);
    //     //cc.log(self);
    // },

    // onCollisionExit: function () {
    //     //this.node.color = cc.Color.WHITE;
    // },

    setObjectType: function (type) {
        this.objectType = type;
    },

    setEntity: function (entity) {
        this.entity = entity;
    },

    getSpine: function () {
        return this.spine;
    },

    getDragonBone: function () {
        return this.dragonBone;
    },

    getDragonBoneArmature: function () {
        return this.dbArmature;
    },

    playAction(actName, loop, callback) {

    },

    findAction(actName) {
        if (this.spine != null) {
            return this.spine.findAnimation(actName);
        }
        if (this.dragonBone != null) {
            for (let armatureName of this.dragonBone.getArmatureNames()) {
                for (let animationName of this.dragonBone.getAnimationNames(armatureName)) {
                    if (animationName === actName) {
                        return animationName;
                    }
                }
            }
        }
        return null;
    },

    pauseAction() {
        if (this.spine != null) {
            this.spine.paused = true;
        }
        if (this.dragonBone != null && this.dbArmature != null) {
            this.dbArmature.animation.stop();
        }
    },

    resumeAction() {
        if (this.spine != null) {
            this.spine.paused = false;
        }
        if (this.dragonBone != null && this.dbArmature!=null) {
            this.dbArmature.animation.play();
        }
    },

    update: function (dt) {

    },

    // toggleDebugSlots() {
    //     if (this.spine != null) {
    //         this.spine.debugSlots = !this.spine.debugSlots;
    //     }
    // },

    // toggleDebugBones() {
    //     if (this.spine != null) {
    //         this.spine.debugBones = !this.spine.debugBones;
    //     }
    // },

    // toggleTimeScale() {
    //     if (this.spine != null) {
    //         if (this.spine.timeScale === 1.0) {
    //             this.spine.timeScale = 0.3;
    //         } else {
    //             this.spine.timeScale = 1.0;
    //         }
    //     }
    // },
});