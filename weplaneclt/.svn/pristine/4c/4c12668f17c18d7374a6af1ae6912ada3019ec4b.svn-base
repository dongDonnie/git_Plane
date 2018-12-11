const CoreObject = require('CoreObject');

cc.Class({
    extends: CoreObject,

    properties: {
        _displayLoop: {
            default: false,
            visible: false
        },
    },

    onLoad: function () {
        this._super();

        var self = this;
        
        if(this.spine!=null){
            this.spine.setCompleteListener((trackEntry, loopCount) => {
                var animationName = trackEntry.animation ? trackEntry.animation.name : "";
                if (self._displayLoop) {
                    if (animationName === 'BaoZou') {
                        self.crazyEnd();
                    }
                }
                //cc.log("[track %s][animation %s] complete: %s", trackEntry.trackIndex, animationName, loopCount);
            });
        }
        if (this.dragonBone != null && this.dbArmature != null) {
            this.dragonBone.addEventListener(dragonBones.EventObject.COMPLETE, function(event){
                if (event.type === dragonBones.EventObject.COMPLETE) {
                    var animationName = event.animationState.name;
                    if (self._displayLoop){
                        if (animationName === 'BaoZou'){
                            self.dbArmature.animation.play('BaoZou_End', 1);
                        }else if (animationName === 'BaoZou_End') {
                            self.dbArmature.animation.play('xiaohuo', 0);
                        }
                    }else{
                        if (animationName === 'BaoZou_Start') {
                            self.dbArmature.animation.play('BaoZou', 0);
                        } else if (animationName === 'BaoZou_End') {
                            self.dbArmature.animation.play('xiaohuo', 0);
                        }
                    }
                }
            });
        }
        this._hasStop = false;
    },

    setDisPlayLoop(displayLoop) {
        displayLoop = typeof displayLoop !== 'undefined' ? displayLoop : false;
        this._displayLoop = displayLoop;
    },

    stop() {
        if (this.spine != null) {
            this.spine.clearTrack(0);
            this._hasStop = true;
            return true;
        }
        if (this.dragonBone != null && this.dbArmature != null) {
            this.dbArmature.animation.stop();
            this._hasStop = true;
            return true;
        }
        return false;
    },

    standingBy() {
        if(this.spine!=null){
            this.spine.setAnimation(0, 'xiaohuo', true);
        }
        if (this.dragonBone != null && this.dbArmature != null){
            this.dbArmature.animation.play('xiaohuo', 0);
        }
        this._hasStop = false;
    },

    transform() {
        this._hasStop = false;
    },

    normal() {
        if(this.spine!=null){
            this.spine.setAnimation(0, 'xiaohuo', true);
        }
        if (this.dragonBone != null && this.dbArmature != null){
            this.dbArmature.animation.play('xiaohuo', 0);
        }
        this._hasStop = false;
    },

    crazyStart() {
        if(this.spine!=null){
            this.spine.setAnimation(0, 'BaoZou_Start', false);
            this.spine.addAnimation(0, 'BaoZou', true, 0);
        }
        if (this.dragonBone != null && this.dbArmature != null){
            this.dbArmature.animation.play('BaoZou_Start', 1);
        }
        this._hasStop = false;
    },

    crazy() {
        if(this.spine!=null){
            this.spine.setAnimation(0, 'BaoZou', true);
        }
        if (this.dragonBone != null && this.dbArmature != null){
            this.dbArmature.animation.play('BaoZou', 0);
        }
        this._hasStop = false;
    },

    crazyEnd() {
        if(this.spine!=null){
            this.spine.setAnimation(0, 'BaoZou_End', false);
            this.spine.addAnimation(0, 'xiaohuo', true, 0);
        }
        if (this.dragonBone != null && this.dbArmature != null){
            this.dbArmature.animation.play('BaoZou_End', 1);
        }
        this._hasStop = false;
    },

    playAction(actName, loop) {
        loop = typeof loop !== 'undefined' ? loop : 1;
        if (this.findAction(actName) != null) {
            if(this.spine!=null){
                this.spine.setAnimation(0, actName, !loop);
            }
            if(this.dragonBone != null && this.dbArmature != null){
                this.dbArmature.animation.play(actName, !loop);
            }
            this._hasStop = false;
        }
    },

});