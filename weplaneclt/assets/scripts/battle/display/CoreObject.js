const Defines = require('BattleDefines');
const ShaderDefines = require('ShaderDefines');
const ShaderManager = require('ShaderManager');

var CoreObject = cc.Class({
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
        dbArmatureCallback: {
            default: null,
            visible: false
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
        _color: cc.color(),
        _start: 0,
        _material: null,
        _shader: 114,
        _shaderOpen: false,
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
        if (this.dragonBone != null && this.dbArmature != null) {
            this.dbArmature.animation.play();
        }
    },

    update: function (dt) {
        if (this.dragonBone != null) {
            if (cc.isValid(this._material) && !!this._shaderOpen) {
                this._setShaderColor();
                this._setShaderTime(dt);
            }
        }
    },

    openShader(open) {
        if (this.dragonBone != null) {
            if (!!open) {
                this._shaderOpen = true;
                this._applyShader();
            } else {
                this._shaderOpen = false;
            }
        }
    },

    _applyShader() {
        if(!!this._material){
            return;
        }
        let shader = this._shader;
        let material = ShaderManager.useShaderDB(this.dragonBone, shader);
        this._material = material;
        this._start = 0;
        let clr = this._color;
        clr.setR(255), clr.setG(255), clr.setB(255), clr.setA(255);
        if (!material) return;
        switch (shader) {
            case ShaderDefines.ShaderType.Blur:
            case ShaderDefines.ShaderType.GaussBlur:
                material.setNum(0.03); //0-0.1
                break;
            default:
                break;
        }
        this._setShaderColor();
    },

    _setShaderColor() {
        let node = this.node;
        let c0 = node.color;
        let c1 = this._color;
        let r = c0.getR(),
            g = c0.getG(),
            b = c0.getB(),
            a = node.opacity;
        let f = !1;
        if (c1.getR() !== r) {
            c1.setR(r);
            f = !0;
        }
        if (c1.getG() !== g) {
            c1.setG(g);
            f = !0;
        }
        if (c1.getB() !== b) {
            c1.setB(b);
            f = !0;
        }
        if (c1.getA() !== a) {
            c1.setA(a);
            f = !0;
        }
        f && this._material.setColor(r / 255, g / 255, b / 255, a / 255);
    },

    _setShaderTime(dt) {
        if (this._shader >= ShaderDefines.ShaderType.Fluxay) {
            let start = this._start;
            if (start > 65535) start = 0;
            start += dt;
            this._material.setTime(start);
            this._start = start;
        }
    }

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