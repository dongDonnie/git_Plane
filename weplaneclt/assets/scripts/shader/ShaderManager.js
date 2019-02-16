const ShaderDefines = require('ShaderDefines');
const ShaderLab = require("ShaderLab");
const ShaderMaterial = require("ShaderMaterial");

module.exports = {
    useShader(sprite, shader) {
        if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
            console.warn('Shader not surpport for canvas');
            return;
        }
        if (!cc.isValid(sprite) || sprite.getState() === shader) {
            return;
        }
        if (shader > ShaderDefines.ShaderType.Gray) {
            let name = ShaderDefines.ShaderType[shader];
            let lab = ShaderLab[name];
            if (!lab) {
                console.warn('Shader not defined', name);
                return;
            }
            cc.dynamicAtlasManager.enabled = false;
            let material = new ShaderMaterial();
            material.init(name, lab.vert, lab.frag, lab.defines || []);
            let texture = sprite.spriteFrame.getTexture();
            material.setTexture(texture);
            material.updateHash();
            sprite._material = material;
            sprite._renderData._material = material;
            sprite._state = shader;
            return material;
        } else {
            sprite.setState(shader);
        }
    },

    useShaderDB(drangonbone, shader) {
        if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
            console.warn('Shader not surpport for canvas');
            return;
        }
        if (!cc.isValid(drangonbone)) {
            return;
        }
        let name = ShaderDefines.ShaderType[shader];
        let lab = ShaderLab[name];
        if (!lab) {
            console.warn('Shader not defined', name);
            return;
        }
        cc.dynamicAtlasManager.enabled = false;
        let material = new ShaderMaterial();
        material.init(name, lab.vert, lab.frag, lab.defines || []);
        let texture = drangonbone.dragonAtlasAsset._texture;
        material.setTexture(texture);
        material.updateHash();
        drangonbone._material = material;
        //drangonbone._renderData.material = material;
        return material;
    }

};