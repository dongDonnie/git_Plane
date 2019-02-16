const ResMapping = require("resmapping");
const GlobalVar = require("globalvar");
const StoreageData = require("storagedata");

var SoundManager = cc.Class({

    properties: {

    },

    ctor: function () {
        this.currentBGM = null;
        this.currentEffect = null;
        this.bgmVolume = 1;
        this.effectVolume = 1;
        this.tempBGM = {};
        this.tempBGM.name = '';
        this.tempBGM.loop = false;
        this.tempBGM.callback = null;
        this.bPlayBGM = StoreageData.getBgmOnOff() === "off" ? false : true;
        this.bPlayEffect = StoreageData.getEffectOnOff() === "off" ? false : true;
        this.curEffectName = '';
    },

    clearSoundMgr: function () {
        this.currentBGM = null;
        this.currentEffect = null;
        this.bgmVolume = 1;
        this.effectVolume = 1;
        this.tempBGM = {};
        this.tempBGM.name = '';
        this.tempBGM.loop = false;
        this.tempBGM.callback = null;
        this.bPlayBGM = StoreageData.getBgmOnOff() === "off" ? false : true;
        this.bPlayEffect = StoreageData.getEffectOnOff() === "off" ? false : true;
        this.curEffectName = '';
    },

    statics: {
        instance: null,
        getInstance: function () {
            if (SoundManager.instance == null) {
                SoundManager.instance = new SoundManager();
            }
            return SoundManager.instance;
        },
        destroyInstance() {
            if (SoundManager.instance != null) {
                delete SoundManager.instance;
                SoundManager.instance = null;
            }
        }
    },

    setBgmOnOff(bBgmOnOff) {
        this.bPlayBGM = typeof bBgmOnOff !== 'undefined' ? bBgmOnOff : true;
        this.bPlayBGM = this.bPlayBGM == "off"?false:true;
        StoreageData.setBgmOnOff(bBgmOnOff);
        if (!this.bPlayBGM) {
            this.stopBGM();
        } else {
            this.playBGM(this.tempBGM.name, this.tempBGM.loop, this.tempBGM.callback);
        }
    },

    setEffectOnOff(bEffectOnOff) {
        this.bPlayEffect = typeof bEffectOnOff !== 'undefined' ? bEffectOnOff : true;
        this.bPlayEffect = this.bPlayEffect == "off"?false:true;
        StoreageData.setEffectOnOff(bEffectOnOff);
    },

    getBgmOnOff() {
        return this.bPlayBGM;
    },
    getEffectOnOff() {
        return this.bPlayEffect;
    },

    playBGM(name, loop, callback) {
        loop = typeof loop !== 'undefined' ? loop : true;
        this.stopBGM();
        this.tempBGM.name = name;
        this.tempBGM.loop = loop;
        this.tempBGM.callback = callback;
        this.playAudio('BGM', name, loop, this.bgmVolume, callback);
    },

    stopBGM() {
        if (this.currentBGM != null) {
            cc.audioEngine.stop(this.currentBGM);
            this.currentBGM = null;
        }
    },

    pauseBGM() {
        if (this.currentBGM != null) {
            cc.audioEngine.pause(this.currentBGM);
        }
    },

    resumeBGM() {
        if (this.currentBGM != null) {
            cc.audioEngine.resume(this.currentBGM);
        }
    },

    playEffect(name, callback) {
        //if(this.curEffectName==name && name=='gold_bing'){
        //this.stopEffect();
        //}
        this.playAudio('EFFECT', name, false, this.effectVolume, callback);
    },

    stopEffect() {
        if (this.currentEffect != null) {
            cc.audioEngine.stop(this.currentEffect);
            this.currentEffect = null;
        }
    },

    stopAll() {
        cc.audioEngine.stopAll();
    },

    setBGMVolume(volume) {
        this.bgmVolume = typeof volume !== 'undefined' ? volume : this.bgmVolume;
        if (this.currentBGM != null) {
            cc.audioEngine.setVolume(this.currentBGM, this.bgmVolume);
        }
    },

    setEffectVolume(volume) {
        this.effectVolume = typeof volume !== 'undefined' ? volume : this.effectVolume;
        if (this.currentEffect != null) {
            cc.audioEngine.setVolume(this.currentEffect, this.effectVolume);
        }
    },

    setAudioVolume(volume) {
        this.setBGMVolume(volume);
        this.setEffectVolume(volume);
    },

    playAudio(type, path, loop, volume, callback) {
        if (path == '') {
            return;
        }
        var self = this;
        GlobalVar.resManager().loadRes(ResMapping.ResType.AudioClip, path, function (clip) {
            if (clip != null) {
                self.play(type, clip, loop, volume, callback, path);
            }
        });
    },

    play(type, clip, loop, volume, callback, name) {
        if (!this.checkSwitch(type)) {
            // cc.log("switch off, play " + type + "failed");
            return;
        }
        let audioIndex = cc.audioEngine.play(clip, loop, volume);
        cc.audioEngine.setFinishCallback(audioIndex, function () {
            if (!!callback) {
                callback();
            }
        });
        if (type == 'BGM') {
            this.currentBGM = audioIndex;
        } else if (type == 'EFFECT') {
            this.currentEffect = audioIndex;
            this.curEffectName = name;
        }
    },

    checkSwitch(type) {
        if (type == 'BGM') {
            if (this.bPlayBGM) {
                return true;
            }
        } else if (type == 'EFFECT') {
            if (this.bPlayEffect) {
                return true;
            }
        }
        return false;
    },
});