const Defines = require('ShaderDefines');
const ShaderManager = require('ShaderManager')

cc.Class({
    extends: cc.Component,

    properties: {
        _color : cc.color(),
        _start : 0,
        _material: null,
        shader: {
            default: Defines.ShaderType.Normal,
            type: Defines.ShaderType,
            notify: function () {
                this._applyShader();
            }
        },
    },

    onLoad() {

    },

    start() {
        this.getComponent(cc.Sprite).setState(0);
        this._applyShader();
    },

    update(dt) {
        if (!this._material) return;
        this._setShaderColor();
        this._setShaderTime(dt);
    },

    _applyShader() {
        let shader = this.shader;
        let sprite = this.getComponent(cc.Sprite);
        let material = ShaderManager.useShader(sprite, shader);
        this._material = material;
        this._start = 0;
        let clr = this._color;
        clr.setR(255), clr.setG(255), clr.setB(255), clr.setA(255);
        if (!material) return;
        switch (shader) {
            case Defines.ShaderType.Blur:
            case Defines.ShaderType.GaussBlur:
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
        let r = c0.getR(), g = c0.getG(), b = c0.getB(), a = node.opacity;
        let f = !1;
        if (c1.getR() !== r) { c1.setR(r); f = !0; }
        if (c1.getG() !== g) { c1.setG(g); f = !0; }
        if (c1.getB() !== b) { c1.setB(b); f = !0; }
        if (c1.getA() !== a) { c1.setA(a); f = !0; }
        f && this._material.setColor(r / 255, g / 255, b / 255, a / 255);
    },

    _setShaderTime(dt) {
        if (this.shader >= Defines.ShaderType.Fluxay) {
            let start = this._start;
            if (start > 65535) start = 0;
            start += dt;
            this._material.setTime(start);
            this._start = start;
        }
    }
});