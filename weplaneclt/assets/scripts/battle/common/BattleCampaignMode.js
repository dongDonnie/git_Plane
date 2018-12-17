const Defines = require('BattleDefines')
const GlobalVar = require('globalvar')
const ResMapping = require('resmapping')

let campaignStep = cc.Enum({
    GAMESTART: 0,
    CREATEMAP: 1,
    CREATEENTITY: 2,
    ENTERMAP: 3,
    SHIFTMAP: 4,
    WARNING: 5,
    GROUPSTART: 6,
    GROUPEND: 7,
    WAVEEND: 8,
    GAMEEND: 9,
    ANIMETIME: 10,
    MAPEND: 11,
    NONE: 12,
});
const Mode = cc.Class({

    properties: {
        nextDropWeaponUpTime: 0,
        dropWeaponUpCounts: 0,
        nextDropBaozouTime: 0,
        nextDropProtectTime: 0,
        nextDropHPTime: 0,
        nextDropMPTime: 0,
        nextDropGhostTime: 0,
    },

    update(dt) {
        this.curTime += dt;
        switch (this.step) {
            case campaignStep.GAMESTART:
                this.step = campaignStep.CREATEMAP;
                break;
            case campaignStep.CREATEMAP:
                if (this.mapCreate()) {
                    this.step = campaignStep.ENTERMAP;
                } else {
                    this.step = campaignStep.WARNING;
                }
                break;
            case campaignStep.CREATEENTITY:

                break;
            case campaignStep.ENTERMAP:
                if (this.mapTransfer(dt)) {
                    this.step = campaignStep.SHIFTMAP;
                }
                break;
            case campaignStep.SHIFTMAP:
                if (this.mapShift(dt)) {
                    if (this.waveControlList[this.waveIndex].wave != null) {
                        this.step = campaignStep.WARNING;
                    } else {
                        this.step = campaignStep.WAVEEND;
                    }
                }
                break;
            case campaignStep.WARNING:
                this.mapUpdate(dt);
                if (this.showAnime()) {
                    this.step = campaignStep.ANIMETIME;
                } else {
                    this.step = campaignStep.GROUPSTART;
                }
                break;
            case campaignStep.GROUPSTART:
                this.mapUpdate(dt);
                if (this.updateWave(dt)) {
                    this.step = campaignStep.GROUPEND;
                }
                break;
            case campaignStep.GROUPEND:
                this.mapUpdate(dt);
                if (this.checkWave()) {
                    this.step = campaignStep.WAVEEND;
                }
                break;
            case campaignStep.WAVEEND:
                this.waveIndex++;
                if (this.waveIndex >= this.waveControlList.length) {
                    this.step = campaignStep.GAMEEND;
                } else {
                    if (this.inBossRoom == 1) {
                        if (this.battleManager.getMusic() != null) {
                            GlobalVar.soundManager().stopBGM();
                            GlobalVar.soundManager().playBGM("cdnRes/" + this.battleManager.getMusic());
                        }
                        this.inBossRoom = 0;
                    }
                    if (this.mapChange()) {
                        this.step = campaignStep.CREATEMAP;
                    } else {
                        this.step = campaignStep.WARNING;
                    }
                }
                break;
            case campaignStep.GAMEEND:
                this.mapUpdate(dt);
                this.endGame();
                this.setMapEnd();
                this.step = campaignStep.MAPEND;
                break;
            case campaignStep.ANIMETIME:
                this.mapUpdate(dt);
                break;
            case campaignStep.MAPEND:
                this.mapEnd(dt);
                break;
            case campaignStep.NONE:
                break;
        }

        if (this.step != campaignStep.MAPEND && this.step != campaignStep.NONE) {
            this.createExtra(dt);
            this.checkHint(dt);
        }
    },

    init: function (mapName) {
        if (mapName == "") {
            return false;
        }

        this.battleManager = require('BattleManager').getInstance();
        this.solution = require('BulletSolutions');

        this.data = require(mapName).data;

        this.curTime = 0;

        this.killdata = null

        this.killCount = 0;

        this.defaultLv = 1;

        this.animeIndex = 0;

        this.inBossRoom = 0;

        this.step = campaignStep.GAMESTART;

        this.rlt = 0;

        this.mapControlList = [];
        for (let i = 0; i < 5; i++) {
            let mapControl = {};
            mapControl.mapList = [];
            mapControl.mapTransList = [];
            mapControl.mapSpeed = -1;
            mapControl.speedAcc = 0;
            mapControl.speedAccTime = 0;
            mapControl.mapScale = 1;
            mapControl.targetScale = 1;
            mapControl.perScale = 0;
            mapControl.mapOpacity = 255;
            mapControl.opacityTime = 0;
            mapControl.loop = true;
            this.mapControlList.push(mapControl);
        }

        this.waveIndex = 0;
        this.waveControlList = [];

        for (let i = 0; i < this.data.monsterWaves.length; i++) {
            let single = this.data.monsterWaves[i];
            let waveControl = {};
            waveControl.curTime = 0;
            waveControl.wave = null;
            waveControl.maps = null;
            if (typeof single.wave !== 'undefined') {
                waveControl.wave = single.wave;
                waveControl.groupdata = single.wave.groups;
                waveControl.groups = [];
                for (let key in waveControl.groupdata) {
                    let tblGroupData = GlobalVar.tblApi.getDataBySingleKey('TblBattleGroups', waveControl.groupdata[key]);
                    waveControl.groups.push(tblGroupData);
                }
                waveControl.groupwait = single.wave.wait;
                waveControl.groupdelay = single.wave.delay;
                waveControl.groupanime = typeof single.wave.anime !== 'undefined' ? single.wave.anime : 0;
                waveControl.groupIsBoss = typeof single.wave.isBOSS !== 'undefined' ? single.wave.isBOSS : 0;
                waveControl.monsterInterval = [];
                waveControl.monstersList = [];
                waveControl.monsterKillList = [];
                for (let j = 0; j < waveControl.groups.length; j++) {
                    waveControl.monstersList.push(new Array());
                    waveControl.monsterInterval.push(0);
                }
            }
            if (typeof single.maps !== 'undefined') {
                waveControl.maps = single.maps;
                waveControl.mapIndex = single.maps.mapIndex;
                waveControl.mapSpeed = single.maps.mapSpeed;
                waveControl.mapScale = single.maps.mapScale;
                waveControl.mapLoop = single.maps.mapLoop;

            }
            this.waveControlList.push(waveControl);
        }

        this.extra = {};
        this.extra.exMark = 1;
        this.extra.groupdata = this.data.monsterExtra;
        this.extra.groups = [];
        this.extra.groupwait = 0;
        this.extra.groupdelay = [];
        this.extra.monstersList = [];
        this.extra.monsterKillList = [];
        this.extra.monsterInterval = [];
        for (let key in this.extra.groupdata) {
            let tblGroupData = GlobalVar.tblApi.getDataBySingleKey('TblBattleGroups', this.extra.groupdata[key]);
            this.extra.groups.push(tblGroupData);
            this.extra.groupdelay.push(0);
            this.extra.monstersList.push(new Array());
            this.extra.monsterInterval.push(0);
        }
        this.extra.groupIndex = -1;
        this.extra.open = -2;
        this.extra.groupCount = 0;
        this.extra.curTime = 0;

        this.extra.completeGroups = [];

        this.hintEvent = [];
        for (let i = 0; i < this.data.totalHint.length; i++) {
            let hint = {};
            hint.state = 0;
            hint.interval = 0;
            hint.eventKey = typeof this.data.totalHint[i].eventKey !== 'undefined' ? this.data.totalHint[i].eventKey : -1;
            hint.checkTime = this.data.totalHint[i].checkTime;
            hint.relation = this.data.totalHint[i].relation;
            hint.condition = this.data.totalHint[i].condition;
            hint.effect = this.data.totalHint[i].effect;
            this.hintEvent.push(hint);
        }

        this.nextDropWeaponUpTime = 0; //this.doGaussian(Defines.Assist.DROP_WEAPONUP_FIRST_MEAN, Defines.Assist.DROP_WEAPONUP_FIRST_VAR, true);
        this.nextDropBaozouTime = Defines.Assist.DROP_ITEM_LOWEST + this.doGaussian(Defines.Assist.DROP_BAOZOU_MEAN, Defines.Assist.DROP_BAOZOU_VAR, true);
        this.nextDropProtectTime = Defines.Assist.DROP_ITEM_LOWEST + this.doGaussian(Defines.Assist.DROP_PROTECTIVE_MEAN, Defines.Assist.DROP_PROTECTIVE_VAR, true);
        this.nextDropHPTime = Defines.Assist.DROP_ITEM_LOWEST + this.doGaussian(Defines.Assist.DROP_HPCURE_MEAN, Defines.Assist.DROP_HPCURE_VAR, true);
        this.nextDropMPTime = Defines.Assist.DROP_ITEM_LOWEST + this.doGaussian(Defines.Assist.DROP_MP_MEAN, Defines.Assist.DROP_MP_VAR, true);
        this.nextDropGhostTime = this.doGaussian(Defines.Assist.DROP_GHOST_MEAN, Defines.Assist.DROP_GHOST_VAR, true);
    },

    mapCreate: function () {
        let waveControl = this.waveControlList[this.waveIndex];
        if (waveControl.maps != null) {
            for (let controlIndex = 0; controlIndex < waveControl.mapIndex.length; controlIndex++) {
                let index = waveControl.mapIndex[controlIndex];
                let mapData = this.data.maps[index];

                let control = this.mapControlList[controlIndex];
                if (control.mapSpeed == -1) {
                    control.mapSpeed = waveControl.mapSpeed[controlIndex];
                } else {
                    if (control.mapSpeed != waveControl.mapSpeed[controlIndex]) {
                        control.speedAccTime = 1;
                        control.speedAcc = (waveControl.mapSpeed[controlIndex] - control.mapSpeed) / control.speedAccTime;
                    } else {
                        control.speedAcc = 0;
                        control.speedAccTime = 0;
                    }
                }
                if (control.mapScale == -1) {
                    control.mapScale = waveControl.mapScale[controlIndex];
                } else {
                    if (control.mapScale != waveControl.mapScale[controlIndex]) {
                        control.targetScale = waveControl.mapScale[controlIndex];
                        control.perScale = control.targetScale - control.mapScale;
                    } else {
                        control.targetScale = control.mapScale;
                        control.perScale = 0;
                    }
                }
                if (typeof waveControl.mapLoop !== 'undefined') {
                    control.loop = waveControl.mapLoop[controlIndex] == 0 ? false : true;
                } else {
                    control.loop = true;
                }

                for (let mapIndex = 0; mapIndex < mapData.length; mapIndex++) {
                    let nodeBkg = new cc.Node();
                    let sprite = nodeBkg.addComponent(cc.Sprite);
                    sprite.spriteFrame = GlobalVar.resManager().loadRes(ResMapping.ResType.SpriteFrame, "cdnRes/battlemap/" + mapData[mapIndex]);
                    nodeBkg.name = mapData[mapIndex];
                    nodeBkg.setScale(control.mapScale);
                    nodeBkg.opacity = control.mapOpacity;
                    nodeBkg.x = cc.winSize.width / 2;
                    if (control.mapList.length > 0) {
                        let last = control.mapList[control.mapList.length - 1];
                        nodeBkg.y = (last.y + 0.5 * last.getContentSize().height * last.scale + 0.5 * nodeBkg.getContentSize().height * nodeBkg.scale);
                    } else {
                        if (control.mapTransList.length > 0) {
                            let top = control.mapTransList[control.mapTransList.length - 1];
                            nodeBkg.y = (top.y + 0.5 * top.getContentSize().height * top.scale + 0.5 * nodeBkg.getContentSize().height * nodeBkg.scale);
                        } else {
                            nodeBkg.y = (0.5 * nodeBkg.getContentSize().height * nodeBkg.scale);
                        }
                    }
                    this.battleManager.displayContainer.addChild(nodeBkg, controlIndex - 999);
                    control.mapList.push(nodeBkg);
                }
            }
            return true;
        }
        return false;
    },
    setMapEnd: function () {
        let highest = null;
        for (let controlIndex = this.mapControlList.length - 1; controlIndex >= 0; controlIndex--) {
            let control = this.mapControlList[controlIndex];
            if (control.mapList.length == 0) {
                continue;
            }
            if (highest == null) {
                highest = control;
            }
            if (control.loop) {
                control.mapSpeed = highest.mapSpeed;
            }
        }
    },
    mapEnd: function (dt) {
        let highest = null;
        for (let controlIndex = this.mapControlList.length - 1; controlIndex >= 0; controlIndex--) {
            let control = this.mapControlList[controlIndex];
            if (control.mapList.length == 0) {
                continue;
            }
            if (highest == null) {
                highest = control;
            }
            if (highest != null) {
                if (!highest.loop) {
                    this.step = campaignStep.NONE;
                    break;
                }
            }
            for (let i = 0; i < control.mapList.length; i++) {
                let posY = control.mapList[i].y;
                if (posY + 0.5 * control.mapList[i].getContentSize().height * control.mapList[i].scale <= 0) {
                    let highest = 0;
                    let index = 0;
                    for (let j = 0; j < control.mapList.length; j++) {
                        if (control.mapList[j].y >= highest) {
                            highest = control.mapList[j].y;
                            index = j;
                        }
                    }
                    posY = control.mapList[index].y +
                        0.5 * control.mapList[index].getContentSize().height * control.mapList[index].scale +
                        0.5 * control.mapList[i].getContentSize().height * control.mapList[i].scale;
                    control.mapList[i].y = posY;
                }
            }
            if (control.loop) {
                for (let i = 0; i < control.mapList.length; i++) {
                    control.mapList[i].y = (control.mapList[i].y - control.mapSpeed * dt);
                }
                if (control.mapSpeed >= 10) {
                    control.mapSpeed -= 10;
                } else {
                    control.loop = false;
                }
            }
        }
    },

    mapUpdate: function (dt) {
        let highestControl = null;
        for (let controlIndex = this.mapControlList.length - 1; controlIndex >= 0; controlIndex--) {
            let control = this.mapControlList[controlIndex];
            if (control.mapList.length == 0) {
                continue;
            }
            if (control.loop) {
                for (let i = 0; i < control.mapList.length; i++) {
                    let posY = control.mapList[i].y;
                    if (posY + 0.5 * control.mapList[i].getContentSize().height * control.mapList[i].scale <= 0) {
                        let highest = 0;
                        let index = 0;
                        for (let j = 0; j < control.mapList.length; j++) {
                            if (control.mapList[j].y >= highest) {
                                highest = control.mapList[j].y;
                                index = j;
                            }
                        }
                        posY = control.mapList[index].y +
                            0.5 * control.mapList[index].getContentSize().height * control.mapList[index].scale +
                            0.5 * control.mapList[i].getContentSize().height * control.mapList[i].scale;
                        control.mapList[i].y = posY;
                    }
                }
                for (let i = 0; i < control.mapList.length; i++) {
                    control.mapList[i].y = control.mapList[i].y - control.mapSpeed * dt;
                }
            } else {
                if (highestControl == null) {
                    highestControl = control;
                }
                if (!!highestControl) {
                    if (!!highestControl.stop) {
                        break;
                    }
                }
                let highest = control.mapList[control.mapList.length - 1];
                if (highest.y + 0.5 * highest.getContentSize().height * highest.scale > cc.winSize.height) {
                    for (let i = 0; i < control.mapList.length; i++) {
                        control.mapList[i].y = (control.mapList[i].y - control.mapSpeed * dt);
                    }
                    // if (control.mapSpeed >= 300) {
                    //     control.mapSpeed-=1;
                    // }
                } else {
                    control.stop = true;
                }
            }
        }
    },
    mapTransfer: function (dt) {
        let clear = true;
        for (let controlIndex = 0; controlIndex < this.mapControlList.length; controlIndex++) {
            let control = this.mapControlList[controlIndex];
            let index = -1;
            for (let i = control.mapTransList.length - 1; i >= 0; i--) {
                control.mapTransList[i].y = (control.mapTransList[i].y - control.mapSpeed * dt);
                if (control.mapTransList[i].y + 0.5 * control.mapTransList[i].getContentSize().height * control.mapTransList[i].scale <= 0) {
                    index = i;
                }
            }
            if (index != -1) {
                control.mapTransList[index].destroy();
                control.mapTransList.splice(index, 1);
            }
            if (control.mapTransList.length > 0) {
                clear = false;
            }
            for (let i = 0; i < control.mapList.length; i++) {
                let posY = control.mapList[i].y;
                if (posY + 0.5 * control.mapList[i].getContentSize().height * control.mapList[i].scale <= 0) {
                    let highest = 0;
                    let index = 0;
                    for (let j = 0; j < control.mapList.length; j++) {
                        if (control.mapList[j].y >= highest) {
                            highest = control.mapList[j].y;
                            index = j;
                        }
                    }
                    posY = control.mapList[index].y +
                        0.5 * control.mapList[index].getContentSize().height * control.mapList[index].scale +
                        0.5 * control.mapList[i].getContentSize().height * control.mapList[i].scale;
                    control.mapList[i].y = posY;
                }
            }
            for (let i = 0; i < control.mapList.length; i++) {
                control.mapList[i].y = control.mapList[i].y - control.mapSpeed * dt;
            }
        }
        //this.mapUpdate(dt);
        return clear;
    },
    mapChange: function () {
        if (this.waveIndex < this.waveControlList.length) {
            let waveControl = this.waveControlList[this.waveIndex];
            if (waveControl.maps != null) {
                for (let controlIndex = 0; controlIndex < this.mapControlList.length; controlIndex++) {
                    let control = this.mapControlList[controlIndex];
                    for (let i = 0; i < control.mapList.length; i++) {
                        for (let j = i + 1; j < control.mapList.length; j++) {
                            if (control.mapList[i].y > control.mapList[j].y) {
                                let temp = control.mapList[i];
                                control.mapList[i] = control.mapList[j];
                                control.mapList[j] = temp;
                            }
                        }
                    }
                    for (let i = 0; i < control.mapList.length; i++) {
                        control.mapTransList.push(control.mapList[i])
                    }
                    if (control.mapList.length > 0) {
                        control.mapList.splice(0, control.mapList.length);
                    }
                }
                return true;
            }
        }
        return false;
    },
    mapShift: function (dt) {
        let sum = this.mapControlList.length;
        for (let mapControlIndex = 0; mapControlIndex < this.mapControlList.length; mapControlIndex++) {
            let control = this.mapControlList[mapControlIndex];
            if (control.mapList.length == 0 || !control.loop) {
                sum--;
                continue;
            }
            for (let i = 0; i < control.mapList.length; i++) {
                for (let j = i + 1; j < control.mapList.length; j++) {
                    if (control.mapList[i].y > control.mapList[j].y) {
                        let temp = control.mapList[i];
                        control.mapList[i] = control.mapList[j];
                        control.mapList[j] = temp;
                    }
                }
            }

            if (control.mapList[0].y + 0.5 * control.mapList[0].getContentSize().height * control.mapList[0].scale <= 0) {
                let newPosY = control.mapList[control.mapList.length - 1].y +
                    0.5 * control.mapList[control.mapList.length - 1].getContentSize().height * control.mapList[control.mapList.length - 1].scale +
                    0.5 * control.mapList[0].getContentSize().height * control.mapList[0].scale;
                control.mapList[0].y = (newPosY);
                let top = control.mapList.shift();
                control.mapList.push(top);
            }

            if (control.mapOpacity < 255) {
                control.mapOpacity += 255 / control.opacityTime * dt;
                if (control.mapOpacity > 255) {
                    control.mapOpacity = 255;
                }
                for (let key in control.mapList) {
                    control.mapList[key].y = (control.mapList[key].y - control.mapSpeed * dt);
                    control.mapList[key].opacity = control.mapOpacity;
                }
            } else if (control.mapScale != control.targetScale) {
                control.mapScale += control.perScale * dt;
                if (control.perScale > 0) {
                    if (control.mapScale > control.targetScale) {
                        control.mapScale = control.targetScale;
                    }
                } else {
                    if (control.mapScale < control.targetScale) {
                        control.mapScale = control.targetScale;
                    }
                }
                for (let i = 0; i < control.mapList.length; i++) {
                    control.mapList[i].setScale(control.mapScale);
                }
                let posY = control.mapList[0].y - control.mapSpeed * dt;
                if (posY - 0.5 * control.mapList[0].getContentSize().height * control.mapList[0].scale > 0) {
                    posY = 0.5 * control.mapList[0].getContentSize().height * control.mapList[0].scale
                }
                control.mapList[0].y = (posY);
                posY += 0.5 * control.mapList[0].getContentSize().height * control.mapList[0].scale;
                for (let index = 1; index < control.mapList.length; index++) {
                    control.mapList[index].y = (posY + 0.5 * control.mapList[index].getContentSize().height * control.mapList[index].scale);
                    posY = control.mapList[index].y + 0.5 * control.mapList[index].getContentSize().height * control.mapList[index].scale;
                }
            } else if (control.speedAccTime > 0) {
                control.mapSpeed += control.speedAcc * dt;
                control.speedAccTime -= dt;
                if (control.speedAccTime < 0) {
                    control.speedAccTime = 0;
                }
                for (let key in control.mapList) {
                    control.mapList[key].y = (control.mapList[key].y - control.mapSpeed * dt);
                }
            } else {
                for (let key in control.mapList) {
                    control.mapList[key].y = (control.mapList[key].y - control.mapSpeed * dt);
                }
                sum--;
            }
        }

        return !sum;
    },

    recordExtra: function (extra, delay) {
        this.extra.open = typeof extra !== 'undefined' ? extra : -2;
        delay = typeof delay !== 'undefined' ? delay : 0;
        if (this.extra.open == -1) {
            for (let key in this.data.monsterExtra) {
                this.extra.groupdelay[key] = delay;
            }
            this.extra.curTime = delay;
        } else {
            for (let key in this.data.monsterExtra) {
                this.extra.groupdelay[key] = 0;
            }
            this.extra.curTime = 0;
        }
    },
    selectExtra: function (choose) {
        if (this.extra.completeGroups.length == this.data.monsterExtra.length) {
            this.extra.completeGroups.splice(0, this.extra.completeGroups.length);
            return;
        }
        let randArray = [];
        for (let index in this.data.monsterExtra) {
            let alreadyCreate = false;
            for (let completeIndex in this.extra.completeGroups) {
                if (index == this.extra.completeGroups[completeIndex]) {
                    alreadyCreate = true;
                    break;
                }
            }
            if (!alreadyCreate) {
                randArray.push(index);
            }
        }
        if (choose == -1) {
            this.extra.groupIndex = randArray[Math.floor(Math.random() * randArray.length)];
        } else if (choose > 0) {
            if (choose < this.extra.groups.length) {
                for (let key in randArray) {
                    if (choose == randArray[key]) {
                        this.extra.groupIndex = randArray[key];
                        break;
                    }
                }
            }
            if (this.extra.groupIndex == -1) {
                this.extra.groupIndex = randArray[0];
            }
        } else {
            this.extra.groupIndex = randArray[0];
        }

        this.extra.completeGroups.push(this.extra.groupIndex);
    },
    createExtra: function (dt) {
        if (this.extra.groupIndex == -1 && this.extra.open != -2) {
            this.selectExtra(this.extra.open);
        }

        if (this.extra.groups.length > 0 && this.extra.groupIndex >= 0) {
            if (this.createGroup(this.extra, dt)) {
                this.extra.monsterKillList.splice(0, this.extra.monsterKillList.length);
                this.extra.monsterInterval[this.extra.groupIndex] = 0;
                this.extra.groupCount++;
                this.extra.groupIndex = -1;
                this.extra.curTime = 0;
            }
        }
    },

    updateWave: function (dt) {
        let clear = true;
        if (this.waveControlList[this.waveIndex].wave != null) {
            if (!this.createGroup(this.waveControlList[this.waveIndex], dt)) {
                clear = false;
            }
        }
        return clear;
    },
    checkWave: function () {
        let clear = true;
        let waveControl = this.waveControlList[this.waveIndex];
        if (waveControl.wave != null) {
            let sum = 0;
            for (let j = 0; j < waveControl.groups.length; j++) {
                sum += waveControl.groups[j].oVecMonsterIDs.length;
            }
            if (sum != waveControl.monsterKillList.length) {
                clear = false;
            }
        }
        return clear;
    },
    createGroup: function (waveControl, dt) {
        waveControl.curTime += dt;
        //waveControl.monsterInterval += dt;
        let clear = true;
        for (let groupIndex = 0; groupIndex < waveControl.groups.length; groupIndex++) {
            if (typeof waveControl.exMark !== 'undefined') {
                if (waveControl.groupIndex != groupIndex) {
                    continue;
                }
            }
            waveControl.monsterInterval[groupIndex] += dt;
            if (waveControl.groupwait == 1 && groupIndex - 1 >= 0) {
                if (!(waveControl.monsterKillList.length >= waveControl.groups[groupIndex - 1].oVecMonsterIDs.length && waveControl.monstersList[groupIndex - 1].length == waveControl.groups[groupIndex - 1].oVecMonsterIDs.length)) {
                    clear = false;
                    break;
                }
            }
            if (waveControl.curTime >= waveControl.groupdelay[groupIndex]) {
                if (waveControl.monstersList[groupIndex].length == waveControl.groups[groupIndex].oVecMonsterIDs.length) {
                    continue;
                }
                clear = false;
                for (let monsterIndex = waveControl.monstersList[groupIndex].length; monsterIndex < waveControl.groups[groupIndex].oVecMonsterIDs.length; monsterIndex++) {
                    if (waveControl.monsterInterval[groupIndex] >= waveControl.groups[groupIndex].oVecInterval[monsterIndex]) {
                        let entity = this.createGroupMonster(waveControl.groups[groupIndex].oVecMonsterIDs[monsterIndex], waveControl.groups[groupIndex].oVecPosition[monsterIndex]);
                        if (typeof waveControl.exMark !== 'undefined') {
                            entity.exMark = waveControl.exMark;
                        } else {
                            entity.exMark = 0;
                        }
                        waveControl.monstersList[groupIndex].push(entity);
                        waveControl.monsterInterval[groupIndex] = 0;
                    } else {
                        break;
                    }
                }
            } else {
                clear = false;
            }
        }
        return clear;
    },
    createGroupMonster(monsterId, pos) {
        let p = pos.split(',');
        let v = cc.v3(Number(p[0]), Number(p[1]));
        const monsterMapping = require('MonsterMapping');
        let tblMonster = GlobalVar.tblApi.getDataBySingleKey('TblBattleMonster', monsterId);
        if (!tblMonster) {
            return;
        }
        if (this.battleManager.isCampaignFlag) {
            let idx = this.battleManager.getCampName().substring(10);
            let campData = GlobalVar.tblApi.getDataBySingleKey('TblCampaign', idx);
            if (campData != null) {
                this.defaultLv = campData.wDefaultMonsterLv;
            }
        }
        let monsterInfo = {
            mId: monsterId,
            lv: this.defaultLv,
            pos: v,
        };
        let func = monsterMapping.getSolution(tblMonster.dwSolution);
        if (func) {
            let entity = func(monsterInfo, tblMonster.oVecSkillIDs);
            return entity;
        }
        return null;
    },
    kill: function (entity) {
        if (entity.objectType != Defines.ObjectType.OBJ_MONSTER) {
            return;
        }
        this.killCount++;
        this.killdata = entity;

        if (entity.dropBuff && entity.canDrop) {
            this.tryDropItemOnKilled(entity);
        }

        //this.tryDropItemOnKilled(entity);

        if (entity.exMark == 1) {
            this.extra.monsterKillList.push(entity);
        } else {
            this.waveControlList[this.waveIndex].monsterKillList.push(entity);
        }
    },
    doGaussian(mean, vr, upper) {
        let r = Math.random() * 100;
        let rlt = 0.0;
        if (upper == false) {
            rlt = mean + (r - 50) / 50 * vr;
            rlt = Math.min(Defines.Assist.DROP_ITEM_LOWEST, rlt);
        } else {
            rlt = mean + (100 - r) / 100 * vr / 2;
        }
        return rlt;
    },
    tryDropItemOnKilled(entity) {
        let buffIds = [];

        let curTime = this.battleManager.currentTime;

        if (this.battleManager.gameState != Defines.GameResult.RUNNING) {
            return;
        }

        if (entity.tbl == undefined || entity.tbl == null) {
            return;
        }

        if (entity.tbl.dwType == Defines.MonsterType.MT_ELITE) {
            return;
        }

        if (curTime >= this.nextDropWeaponUpTime) {
            buffIds.push(Defines.Assist.WEAPON_UP);

            ++this.dropWeaponUpCounts;

            if (this.dropWeaponUpCounts >= 3) {
                this.nextDropWeaponUpTime = curTime + this.doGaussian(Defines.Assist.DROP_WEAPONUP_MEAN, Defines.Assist.DROP_WEAPONUP_VAR);
            } else {
                this.nextDropWeaponUpTime = curTime + this.doGaussian(Defines.Assist.DROP_WEAPONUP_FIRST_MEAN, Defines.Assist.DROP_WEAPONUP_FIRST_VAR);
            }
        }

        if (curTime >= this.nextDropBaozouTime) {
            buffIds.push(Defines.Assist.SUPER);

            this.nextDropBaozouTime = curTime + this.doGaussian(Defines.Assist.DROP_BAOZOU_MEAN, Defines.Assist.DROP_BAOZOU_VAR, true);
        }

        if (curTime >= this.nextDropProtectTime) {
            buffIds.push(Defines.Assist.PROTECT);

            this.nextDropProtectTime = curTime + this.doGaussian(Defines.Assist.DROP_PROTECTIVE_MEAN, Defines.Assist.DROP_PROTECTIVE_VAR);
        }

        if (curTime >= this.nextDropHPTime) {
            buffIds.push(Defines.Assist.HP);

            this.nextDropHPTime = curTime + this.doGaussian(Defines.Assist.DROP_HPCURE_MEAN, Defines.Assist.DROP_HPCURE_VAR, true);
        }

        for (let id of buffIds) {
            this.solution.solution_buff(id, entity.getPosition());
        }
    },

    showAnime: function () {
        let waveControl = this.waveControlList[this.waveIndex];
        if (waveControl.wave != null) {
            if (typeof waveControl.wave.anime !== 'undefined') {
                if (typeof waveControl.wave.isBOSS !== 'undefined') {
                    this.inBossRoom = waveControl.wave.isBOSS;
                    if (this.inBossRoom == 1) {
                        GlobalVar.soundManager().stopBGM();
                    }
                }
                this.animeIndex = waveControl.wave.anime;
                var self = this;
                if (this.animeIndex == 1) {
                    this.battleManager.warning(function () {
                        self.animeIndex = -1;
                        self.step = campaignStep.GROUPSTART;
                        if (self.inBossRoom == 1) {
                            GlobalVar.soundManager().playBGM("cdnRes/audio/battle/music/Boss_Room");
                        }
                    });
                    return true;
                }
            }
        }
        return false;
    },

    checkHint: function (dt, eventKey) {
        for (let i = 0; i < this.hintEvent.length; i++) {
            let hint = this.hintEvent[i];
            let check = false;
            if (typeof eventKey !== "undefined") {
                if (hint.eventKey == eventKey) {
                    check = true;
                }
            } else {
                check = true;
            }
            if (!check || hint.state == 1) {
                continue;
            }
            hint.interval += dt;
            if (this.checkHintConditions(hint)) {
                this.setHintEffect(hint);
            }
        }
    },
    checkHintCondition: function (condition, hint) {
        if (typeof condition.wave !== 'undefined') {
            if (this.waveIndex == condition.wave.index && this.step == condition.wave.step) {
                return true;
            } else {
                return false;
            }
        } else if (typeof condition.killMonster !== 'undefined' && this.killData != null) {
            if (condition.killMonster == this.killData.dwID) {
                return true;
            } else {
                return false;
            }
        } else if (typeof condition.killCount !== 'undefined') {
            if (condition.killCount >= this.killCount) {
                return true;
            } else {
                return false;
            }
        } else if (typeof condition.duration !== 'undefined') {
            if (this.battleManager.currentTime >= condition.duration) {
                return true;
            } else {
                return false;
            }
        } else if (typeof condition.interval !== 'undefined') {
            if (hint.interval >= condition.interval) {
                hint.interval = 0;
                return true;
            } else {
                return false;
            }
        } else if (typeof condition.hint !== 'undefined') {
            if (condition.hint < this.hintEvent.length && condition.hint >= 0) {
                if (this.hintEvent[condition.hint].state == 1) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    checkHintConditions: function (hint) {

        let done = null;
        for (let condition of hint.condition) {
            if (done == null) {
                done = this.checkHintCondition(condition, hint);
            } else {
                if (hint.relation == '&&') {
                    done = done && this.checkHintCondition(condition, hint);
                } else if (hint.relation == '||') {
                    done = done || this.checkHintCondition(condition, hint);
                } else {
                    done = this.checkHintCondition(condition, hint);
                }
            }
        }
        return done;
    },
    setHintEffect: function (hint) {
        for (let effect of hint.effect) {
            if (typeof effect.extra !== 'undefined') {
                //this.selectExtra(effect.extra);
                this.recordExtra(effect.extra.open, effect.extra.delay);
            } else if (typeof effect.drop !== 'undefined') {
                let pos = cc.v3((Math.random() * (cc.winSize.width - 200)) + 100, cc.winSize.height - 20);
                this.solution.solution_buff(effect.drop, pos);
            } else if (typeof effect.result !== 'undefined') {
                this.step = campaignStep.GAMEEND;
            }
        }
        if (hint.checkTime > 0) {
            hint.checkTime--;
        }
        if (hint.checkTime == 0) {
            hint.state = 1;
        }
        this.killData = null;
    },

    endGame: function () {
        let ai = require('AIInterface');
        ai.eliminateAllMonsterBullets(false, true);
        ai.eliminateAllMonsters();
        this.battleManager.gameState = Defines.GameResult.COUNT;
    },
})