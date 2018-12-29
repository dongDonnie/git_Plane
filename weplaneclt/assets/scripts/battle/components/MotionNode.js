const GlobalVar = require('globalvar');
const ResMapping = require("resmapping");
cc.Class({
    extends: cc.Node,

    ctor: function () {
        //this.initMotion();
        this.tailPos = cc.v3(0, 0);
    },

    initMotion: function (res, tailPos, color, fadeTime, minSeg, stroke, fastMode) {
        var motion = null;
        res = typeof res !== 'undefined' ? res : 'huoyan_jin';
        if (this.getComponent(cc.MotionStreak) == null) {
            motion = this.addComponent(cc.MotionStreak);
            // cc.loader.loadRes('cdnRes/battlemodel/motionstreak/'+res, cc.Texture2D, function (err, tex) {
            //     if (err) {
            //         cc.error("LoadSpriteFrame err. " + 'cdnRes/battlemodel/motionstreak/'+res);
            //         return;
            //     }
            //     motion.texture=tex;
            //     //GlobalVar.resManager().addCache(ResMapping.ResType.Texture2D,'cdnRes/battle/'+res,tex);
            // });
            GlobalVar.resManager().loadRes(ResMapping.ResType.Texture2D, 'cdnRes/battlemodel/motionstreak/' + res, function (tex) {
                if (tex != null) {
                    motion.texture = tex;
                }
            });
        } else {
            motion = this.getComponent(cc.MotionStreak);
        }
        motion.fadeTime = typeof fadeTime !== 'undefined' ? fadeTime : 0.5;
        motion.minSeg = typeof minSeg !== 'undefined' ? minSeg : 1;
        motion.stroke = typeof stroke !== 'undefined' ? stroke : 30;
        motion.fastMode = typeof fastMode !== 'undefined' ? fastMode : false;
        motion.color = typeof color !== 'undefined' ? color : new cc.Color(255, 255, 255);
        this.tailPos = typeof tailPos !== 'undefined' ? tailPos : cc.v3(0, 0);
    },

    updatePosition: function (pos) {
        this.setPosition(pos);
    }
});