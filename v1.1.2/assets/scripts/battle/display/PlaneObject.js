const CoreObject = require('CoreObject');

cc.Class({
    extends: CoreObject,

    properties: {
        _displayLoop: {
            default: false,
            visible: false
        },
        ready: {
            default: null,
            visible: false
        },
    },

    onLoad: function () {
        this._super();
        // this._setMix('daiji', 'bianxing_1');

        var self = this;
        if(this.spine!=null){
            this.spine.setCompleteListener((trackEntry, loopCount) => {
                var animationName = trackEntry.animation ? trackEntry.animation.name : "";
                if (self._displayLoop == 2) {
                    if (animationName === 'daiji') {
                        self.transform();
                    } else if (animationName === 'putong') {
                        self.crazyStart();
                    } else if (animationName === 'BaoZou') {
                        self.crazyEnd();
                    }
                } else if (self._displayLoop == 3) {
                    if (animationName === 'daiji') {
                        self.transform();
                    }
                } else {
                    if (animationName === 'bianxing_1') {
                        if (!!self.ready) {
                            self.ready();
                            self.ready = null;
                        }
                    }
                }
            });
        }
        if (this.dragonBone != null && this.dbArmature != null) {
            this.dragonBone.addEventListener(dragonBones.EventObject.COMPLETE, function(event){
                if (event.type === dragonBones.EventObject.COMPLETE) {
                    var animationName = event.animationState.name
                    if (self._displayLoop == 2) {
                        if (animationName === 'daiji') {
                            self.dbArmature.animation.play('bianxing_1', 1);
                        } else if (animationName === 'bianxing_1') {
                            self.dbArmature.animation.play('putong', 1);
                        } else if (animationName === 'putong') {
                            self.dbArmature.animation.play('BaoZou_Start', 1);
                        } else if (animationName === 'BaoZou_Start') {
                            self.dbArmature.animation.play('BaoZou', 1);
                        }else if (animationName === 'BaoZou') {
                            self.dbArmature.animation.play('BaoZou_End', 1);
                        }else if (animationName === 'BaoZou_End') {
                            self.dbArmature.animation.play('putong', 1);
                        }
                    } else if (self._displayLoop == 3) {
                        if (animationName === 'daiji') {
                            self.dbArmature.animation.play('bianxing_1', 1);
                        }else if (animationName === 'bianxing_1'){
                            self.dbArmature.animation.play('putong', 0);
                        }
                    } else {
                        if (animationName === 'bianxing_1') {
                            self.dbArmature.animation.play('putong', 0);
                            if (!!self.ready) {
                                self.ready();
                                self.ready = null;
                            }
                        }else if (animationName === 'BaoZou_Start'){
                            self.dbArmature.animation.play('BaoZou', 0);
                        }else if (animationName==='BaoZou_End'){
                            self.dbArmature.animation.play('putong', 0);
                        }
                    }
                }
            });
        }

        this._hasStop = false;
    },

    update: function (dt) {
        this._super(dt);
    },

    setDisPlayLoop(displayLoop) {
        this._displayLoop = typeof displayLoop !== 'undefined' ? displayLoop : 0;
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
            this.spine.setAnimation(0, 'daiji', true);
        }
        if (this.dragonBone != null && this.dbArmature != null){
            this.dbArmature.animation.play('daiji', 0);
        }
        this._hasStop = false;
    },

    transform(callback) {
        if(this.spine!=null){
            this.spine.setAnimation(0, 'bianxing_1', false);
            this.spine.addAnimation(0, 'putong', true, 0);
        }
        if (this.dragonBone != null && this.dbArmature != null){
            this.dbArmature.animation.play('bianxing_1', 1);
        }
        this._hasStop = false;
        if (!!callback) {
            this.ready = callback;
        }
    },

    normal() {
        if(this.spine!=null){
            this.spine.setAnimation(0, 'putong', true);
        }
        if (this.dragonBone != null && this.dbArmature != null){
            this.dbArmature.animation.play('putong', 0);
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
            this.spine.addAnimation(0, 'putong', true, 0);
        }else if(this.dragonBone != null && this.dbArmature != null){
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