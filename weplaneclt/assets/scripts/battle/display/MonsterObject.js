const CoreObject = require('CoreObject')

cc.Class({
    extends: CoreObject,

    properties: {
        tbl: {
            default: null,
            visible: false
        }
    },

    onLoad() {
        this._super();
        if (this.spine != null) {
            //this.spine.setStartListener(this._spineStartCallBack.bind(this));
            //this.spine.setCompleteListener(this._spineCompleteCallBack.bind(this));
        }
        if (this.dragonBone != null) {
            this.dragonBone.addEventListener(dragonBones.EventObject.COMPLETE, this._animationEventHandler, this);
        }
        this._hasStop = false;
    },

    setTBL(tbl) {
        this.tbl = typeof tbl !== 'undefined' ? tbl : null;

        if (!!this.tbl) {
            if (this.tbl.strBoxCollider != "") {
                this.actionCollider = {};
                let actionArray = this.tbl.strBoxCollider.split(";");
                for (let action of actionArray) {
                    let colliderArray = action.split("|");
                    this.actionCollider[colliderArray[0]] = {};
                    let p1 = colliderArray[1].split(",");
                    this.actionCollider[colliderArray[0]].cOffset = cc.v2(Number(p1[0]), Number(p1[1]));
                    let p2 = colliderArray[2].split(",");
                    this.actionCollider[colliderArray[0]].cSize = cc.size(Number(p2[0]), Number(p2[1]));
                }
            }
        }
    },

    stop() {
        if (this.spine != null) {
            this.spine.clearTrack(0);
            this._hasStop = true;
            return true;
        }
        if (this.dragonBone != null && this.dbArmature != null) {
            this.dbArmature.animation.stop();
            return true;
        }
        return false;
    },

    reset() {
        if (this.dragonBone != null && this.dbArmature != null) {
            this.dbArmature.animation.reset();
            this.dbArmature.animation.play(this.dragonBone.animationName, 0);
        }
    },

    playAction(actName, loop, callback) {
        if (this.spine != null) {
            if (this.findAction(actName) != null) {
                loop = typeof loop !== 'undefined' ? loop : 1;

                spine.setStartListener(trackEntry => {
                    var animationName = trackEntry.animation ? trackEntry.animation.name : "";
                    cc.log("[track %s][animation %s] start.", trackEntry.trackIndex, animationName);
                });

                this.spine.setCompleteListener((trackEntry, loopCount) => {
                    if (!!callback) {
                        var animationName = trackEntry.animation ? trackEntry.animation.name : "";
                        callback(animationName);
                    }
                });

                this.stop();
                if (loop > 1) {
                    for (let i = 0; i < loop; i++) {
                        this.spine.addAnimation(0, actName, !loop);
                    }
                } else {
                    this.spine.setAnimation(0, actName, !loop);
                }

                if (loop) {
                    if (this.defaultAction != null) {
                        this.spine.addAnimation(0, this.defaultAction, true, 0);
                    }
                }
                this._hasStop = false;
                return true;
            }
        }
        if (this.dragonBone != null && this.dbArmature != null) {
            if (this.findAction(actName) != null) {
                loop = typeof loop !== 'undefined' ? loop : 1;

                if (!!callback) {
                    this.dbArmatureCallback = callback;
                } else {
                    this.dbArmatureCallback = null;
                }

                this.dbArmature.animation.play(actName, loop);

                if(typeof this.actionCollider!=='undefined'){
                    if(typeof this.actionCollider[actName] !=='undefined'){
                        let box=this.getComponent(cc.BoxCollider);
                        box.offset.x=this.actionCollider[actName].cOffset.x;
                        box.offset.y=this.actionCollider[actName].cOffset.y;
                        box.size.width=this.actionCollider[actName].cSize.width;
                        box.size.height=this.actionCollider[actName].cSize.height;
                    }
                }
            }
            return true;
        }
        return false;
    },

    _animationEventHandler(event) {
        if (event.type === dragonBones.EventObject.COMPLETE) {
            if (!!this.dbArmatureCallback) {
                this.dbArmatureCallback(event.animationState.name);
            }
            if (this.defaultAction != null) {
                this.dbArmature.animation.play(this.defaultAction, 0);

                if(typeof this.actionCollider!=='undefined'){
                    if(typeof this.actionCollider[this.defaultAction] !=='undefined'){
                        let box=this.getComponent(cc.BoxCollider);
                        box.offset.x=this.actionCollider[this.defaultAction].cOffset.x;
                        box.offset.y=this.actionCollider[this.defaultAction].cOffset.y;
                        box.size.width=this.actionCollider[this.defaultAction].cSize.width;
                        box.size.height=this.actionCollider[this.defaultAction].cSize.height;
                    }
                }
            }
        }
    },

    _spineStartCallBack(trackEntry) {

    },
    _spineCompleteCallBack(trackEntry) {

    },

    setDefaultAction(actName) {
        if (this.findAction(actName) != null) {
            this.defaultAction = actName;
            return true;
        }
        return false;
    },

});