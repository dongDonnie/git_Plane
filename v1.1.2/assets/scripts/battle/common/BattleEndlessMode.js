const Defines = require('BattleDefines')
const GlobalVar = require('globalvar')
const ResMapping = require('resmapping')
const base64 = require("base64")
const GameServerProto = require("GameServerProto")

let endlessStep = cc.Enum({
    GAMESTART: 0,
    WAVESTART: 1,
    CREATEMAP: 2,
    ENTERMAP: 3,
    SHIFTMAP: 4,
    WARNING: 5,
    GOLDSTART: 6,
    GOLDUPDATE: 7,
    GROUPSTART: 8,
    GROUPEND: 9,
    WAVEEND: 10,
    GAMEEND: 11,
    NONE: 12,
});
const Mode = cc.Class({
    properties: {

    },

    update(dt, count) {
        let frame = typeof count !== 'undefined' ? (count != 0 ? dt * count : dt) : dt;
        this.curTime += frame;
        for (let i in this.interval) {
            this.interval[i] += frame;
        }
        this.tryDropItem(0);
        switch (this.step) {
            case endlessStep.GAMESTART:
                this.step = endlessStep.WAVESTART;
                break;
            case endlessStep.WAVESTART:
                this.config = this.configList[this.curWave - 1];
                this.selectMode();
                if (this.nextWaveStartStep != endlessStep.WAVESTART) {
                    this.step = this.nextWaveStartStep;
                } else {
                    this.step = endlessStep.CREATEMAP;
                }
                break;
            case endlessStep.CREATEMAP:
                this.mapCreate();
                this.step = endlessStep.ENTERMAP;
                break;
            case endlessStep.ENTERMAP:
                if (this.mapTransfer(frame)) {
                    if (this.config.wRandomType == 3 || this.config.wRandomType == 4) {
                        this.step = endlessStep.WARNING;
                    } else {
                        this.step = endlessStep.SHIFTMAP;
                    }
                }
                break;
            case endlessStep.SHIFTMAP:
                if (this.mapShift(frame)) {
                    this.step = endlessStep.WARNING;
                }
                break;
            case endlessStep.WARNING:
                this.mapUpdate(frame);
                if (this.config.wWarning > 0) {
                    this.showAnime(this.config.wWarning);
                } else {
                    if (this.config.wRandomType == 3 || this.config.wRandomType == 4) {
                        this.step = endlessStep.GOLDSTART;
                    } else {
                        this.step = endlessStep.GROUPSTART;
                    }
                }
                break;
            case endlessStep.GOLDSTART:
                this.createGold();
                this.step = endlessStep.GOLDUPDATE;
                break;
            case endlessStep.GOLDUPDATE:
                this.updateGold(frame);
                if (this.checkGold()) {
                    if (this.config.wRandomType == 3 && !this.battleManager.isOpenDash) {
                        if (this.battleManager.managers[Defines.MgrType.HERO].planeEntity.dashTime > 0) {
                            this.battleManager.dashMode = 1;
                            this.battleManager.gameState = Defines.GameResult.DASHSTART;
                        } else {
                            this.battleManager.dashMode = 0;
                            this.battleManager.dashStep = 0;
                            this.battleManager.gameState = Defines.GameResult.RUNNING;
                            this.battleManager.managers[Defines.MgrType.HERO].openDash(-2);
                        }
                        this.battleManager.forceDash = false;
                    }
                    //this.battleManager.endlessScore += (this.endlessScore + (this.curWave - 1) * 500);
                    let num = Number(base64.decode(this.battleManager.endlessScore)) + (Number(base64.decode(this.endlessScore)) + (this.curWave - 1) * 500);
                    this.battleManager.endlessScore = base64.encode(num.toString());
                    this.step = endlessStep.WAVEEND;
                }
                break;
            case endlessStep.GROUPSTART:
                this.mapUpdate(frame);
                if (this.config.wRandomType == 1 ||
                    this.config.wRandomType == 2 ||
                    this.config.wRandomType == 5 ||
                    this.config.wRandomType == 6 ||
                    this.config.wRandomType == 7 ||
                    this.config.wRandomType == 8 ||
                    this.config.wRandomType == 9) {
                    if (this.updateWave(frame)) {
                        this.step = endlessStep.GROUPEND;
                    }
                }
                break;
            case endlessStep.GROUPEND:
                this.mapUpdate(frame);
                if (this.checkWave()) {
                    let killPercent = this.killRecord / this.waveControlList[this.waveControlList.length - 1].monsterKillList.length;
                    //this.battleManager.endlessScore += (this.endlessScore + Math.floor((this.curWave - 1) * 500 * killPercent + Math.random() * 10));
                    let num1 = Number(base64.decode(this.battleManager.endlessScore)) + (Number(base64.decode(this.endlessScore)) + Math.floor((this.curWave - 1) * 500 * killPercent + Math.random() * 10));
                    this.battleManager.endlessScore = base64.encode(num1.toString());
                    if (this.curWave % 5 == 0) {
                        for (let i = 1; i < this.totalWave / 5; i++) {
                            if (this.curWave == 5 * i) {
                                let num2 = Number(base64.decode(this.battleManager.endlessScore)) + (Number(base64.decode(this.endlessScore)) * 2 + (5 * (i - 1) + (5 * i - 1)) * 500) * 5 / 2
                                this.battleManager.endlessScore = base64.encode(num2.toString());
                                break;
                            }
                        }
                    }
                    this.killRecord = 0;
                    this.step = endlessStep.WAVEEND;
                    this.waveControlList.splice(0, this.waveControlList.length);
                }
                break;
            case endlessStep.WAVEEND:
                this.waveCount++;
                let forcechange = false;

                if (this.config.wIsBOSS == 1) {
                    if (this.battleManager.getMusic() != null) {
                        GlobalVar.soundManager().playBGM("cdnRes/" + this.battleManager.getMusic());
                    }
                }

                if (this.config.wRandomType == 2 || this.config.wRandomType == 7 || this.config.wRandomType == 8) {
                    this.defaultLv += 2;
                }
                this.curWave++;
                if (typeof this.configList[this.curWave - 1] === 'undefined') {
                    this.curWave = 1;
                    this.defaultLv += 2;
                    let numplus = Number(base64.decode(this.endlessScore)) + this.totalWave * 500;
                    this.endlessScore = base64.encode(numplus.toString());
                }

                if (this.battleManager.isOpenDash && this.battleManager.dashMode > 0 && this.battleManager.dashMode < 3 && this.defaultLv > this.rushRank) {
                    if (this.configList[this.curWave - 1].wRandomType == 3) {
                        this.battleManager.isOpenDash = false;
                    } else {
                        this.battleManager.dashMode = 3;
                    }

                    let minusScore = 0;
                    let totalScore = 0;
                    let baseScore = Number(base64.decode(this.endlessScore));
                    for (let m = 1; m <= 5; m++) {
                        minusScore += (baseScore + (m - 1) * 500);
                        if (m % 5 == 0) {
                            for (let i = 1; i < this.totalWave / 5; i++) {
                                if (m == 5 * i) {
                                    minusScore += (baseScore * 2 + (5 * (i - 1) + (5 * i - 1)) * 500) * 5 / 2;
                                    break;
                                }
                            }
                        }
                    }
                    for (let lv = 2; lv <= this.rushRank; lv += 2) {
                        for (let w = 1; w <= this.totalWave; w++) {
                            totalScore += (baseScore + (w - 1) * 500);
                            if (w % 5 == 0) {
                                for (let i = 1; i < this.totalWave / 5; i++) {
                                    if (w == 5 * i) {
                                        totalScore += (baseScore * 2 + (5 * (i - 1) + (5 * i - 1)) * 500) * 5 / 2;
                                        break;
                                    }
                                }
                                lv += 2;
                                if (lv >= this.rushRank) {
                                    break;
                                }
                            }
                        }
                        baseScore += this.totalWave * 500;
                    }

                    totalScore -= minusScore;
                    this.endlessScore = base64.encode(baseScore.toString());
                    let numtotal = Number(base64.decode(this.battleManager.endlessScore)) + totalScore;
                    this.battleManager.endlessScore = base64.encode(numtotal.toString());

                }

                if (this.configList[this.curWave - 1].wRandomType == 3 && !this.battleManager.isOpenDash) {
                    this.battleManager.forceDash = true;
                    this.battleManager.dashMode = 2;
                    this.battleManager.dashStep = 2;
                    this.battleManager.gameState = Defines.GameResult.DASH;
                    this.battleManager.managers[Defines.MgrType.HERO].openDash(-1);
                }
                this.nextWaveStartStep = this.mapChange(forcechange);
                this.step = endlessStep.WAVESTART;
                break;
            case endlessStep.GAMEEND:
                break;
            case endlessStep.NONE:
                this.mapUpdate(frame);
                break;
        }
    },

    init: function () {
        this.battleManager = require('BattleManager').getInstance();
        this.solution = require('BulletSolutions');
        this.data = require('CampEndless').data;

        this.actuallyChest = 0;
        if (GlobalVar.me().endlessData.getHistoryMaxScore() == 0) {
            this.actuallyChest = 3;
        }
        this.killCount = 0;
        this.curTime = 0;
        this.interval = []
        for (let t = 0; t < 7; t++) {
            this.interval.push(0);
        }
        this.animeIndex = 0;
        let endlessModeNum = GlobalVar.me().endlessData.getRankID();
        this.endlessMode = GlobalVar.tblApi.getDataBySingleKey('TblEndlessRank', endlessModeNum);
        //this.defaultLv = typeof this.endlessMode.nMonsterBasisGrade !== 'undefined' ? (this.endlessMode.nMonsterBasisGrade != 0 ? this.endlessMode.nMonsterBasisGrade : 2) : 2;
        this.defaultLv = 2;
        //let origin = typeof this.endlessMode.nMonsterBasisFraction !== 'undefined' ? (this.endlessMode.nMonsterBasisFraction != 0 ? this.endlessMode.nMonsterBasisFraction : 1000) : 1000;
        let origin = 1000;
        this.endlessScore = base64.encode(origin.toString());
        if(cc.isValid(this.endlessMode)){
            this.rushRank = typeof this.endlessMode.nRushRank !== 'undefined' ? this.endlessMode.nRushRank : 0;
        }else{
            this.rushRank = 0;
        }
        this.killRecord = 0;

        this.waveCount = 0;
        this.curWave = 1;
        this.step = endlessStep.GAMESTART;
        this.nextWaveStartStep = endlessStep.WAVESTART;
        this.config = null;
        this.configList = [];

        this.totalWave = 0;
        let tbl = GlobalVar.tblApi.getData('TblEndlessCampaign');
        for (let key in tbl) {
            this.configList.push(tbl[key]);
            this.totalWave++;
        }

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
            mapControl.mapOpacity = 0;
            mapControl.opacityTime = 0;
            mapControl.metal = [];
            mapControl.goldData = [];
            mapControl.goldDataIndex = [];
            this.mapControlList.push(mapControl);
        }

        this.waveControlList = [];
    },

    setRushRank: function (yes) {
        if (!!yes) {
            this.defaultLv = this.rushRank;
        } else {
            this.defaultLv = 2;
        }
    },

    mapCreate: function () {
        for (let controlIndex = 0; controlIndex < this.config.oVecMapID.length; controlIndex++) {
            let index = this.config.oVecMapID[controlIndex];
            let mapData = this.data.maps[index];

            let control = this.mapControlList[controlIndex];
            if (control.mapSpeed == -1) {
                control.mapSpeed = this.config.oVecSpeed[controlIndex];
            } else {
                if (control.mapSpeed != this.config.oVecSpeed[controlIndex]) {
                    control.speedAccTime = 1;
                    control.speedAcc = (this.config.oVecSpeed[controlIndex] - control.mapSpeed) / control.speedAccTime;
                } else {
                    control.speedAcc = 0;
                    control.speedAccTime = 0;
                }
            }
            if (control.mapScale == -1) {
                control.mapScale = this.config.oVecScale[controlIndex];
            } else {
                if (control.mapScale != this.config.oVecScale[controlIndex]) {
                    control.targetScale = this.config.oVecScale[controlIndex];
                    control.perScale = control.targetScale - control.mapScale;
                } else {
                    control.targetScale = control.mapScale;
                    control.perScale = 0;
                }
            }
            control.mapOpacity = 255; //this.config.MapOpacity[controlIndex] == 0 ? 255 : 0;
            control.opacityTime = 0; //this.config.MapOpacity[controlIndex];

            for (let mapIndex = 0; mapIndex < mapData.length; mapIndex++) {
                let nodeBkg = new cc.Node();
                let sprite = nodeBkg.addComponent(cc.Sprite);
                sprite.spriteFrame = GlobalVar.resManager().loadRes(ResMapping.ResType.SpriteFrame, "cdnRes/battlemap/" + mapData[mapIndex]);
                nodeBkg.name = mapData[mapIndex];
                nodeBkg.setScale(control.mapScale);
                nodeBkg.opacity = control.mapOpacity;
                nodeBkg.goldCreated = true;
                nodeBkg.x = (cc.winSize.width / 2);
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
    },
    mapUpdate: function (dt) {
        for (let controlIndex = 0; controlIndex < this.mapControlList.length; controlIndex++) {
            let control = this.mapControlList[controlIndex];
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
                    control.mapList[i].y = (posY);
                }
            }
            for (let i = 0; i < control.mapList.length; i++) {
                control.mapList[i].y = (control.mapList[i].y - control.mapSpeed * dt);
            }
        }
    },
    mapTransfer: function (dt) {
        let clear = true;
        for (let controlIndex = 0; controlIndex < this.mapControlList.length; controlIndex++) {
            let control = this.mapControlList[controlIndex];
            if (control.mapList.length == 0 && control.mapTransList.length == 0) {
                continue;
            }
            for (let i = 0; i < control.mapTransList.length; i++) {
                control.mapTransList[i].y = (control.mapTransList[i].y - control.mapSpeed * dt);
                if (control.mapTransList[i].y + 0.5 * control.mapTransList[i].getContentSize().height * control.mapTransList[i].scale <= 0) {
                    control.mapTransList[i].destroy();
                    control.mapTransList.splice(i, 1);
                    i = 0;
                }
            }
            if (control.mapTransList.length > 0) {
                clear = false;
            }

            if (!!control.stop) {
                continue;
            }

            if (control.loop) {
                for (let i = 0; i < control.mapList.length; i++) {
                    control.mapList[i].y -= control.mapSpeed * dt;
                }
            } else {
                let highest = control.mapList[control.mapList.length - 1];
                if (highest.y + 0.5 * highest.getContentSize().height * highest.scale - control.mapSpeed * dt <= this.battleManager.displayContainer.height) {
                    control.stop = true;
                } else {
                    for (let i = 0; i < control.mapList.length; i++) {
                        control.mapList[i].y -= control.mapSpeed * dt;
                    }
                }
            }
        }
        return clear;
    },
    mapChange: function (force) {
        let needchange = false;
        let needshift = false;
        let last = null;
        if (this.curWave - 2 < 0) {
            last = this.configList[this.configList.length - 1];
        } else {
            last = this.configList[this.curWave - 2];
        }
        let now = this.configList[this.curWave - 1];
        if (last != null) {
            if (last.oVecMapID.length != now.oVecMapID.length) {
                needchange = true;
            } else {
                let equal = true;
                for (let i = 0; i < now.oVecMapID.length; i++) {
                    if (last.oVecMapID[i] != now.oVecMapID[i]) {
                        equal = false;
                        break;
                    }
                }
                let speed = true;
                for (let j = 0; j < now.oVecSpeed.length; j++) {
                    if (last.oVecSpeed[j] != now.oVecSpeed[j]) {
                        speed = false;
                        break;
                    }
                }
                let scale = true;
                for (let l = 0; l < now.oVecScale.length; l++) {
                    if (last.oVecScale[l] != now.oVecScale[l]) {
                        scale = false;
                        break;
                    }
                }
                if (!equal) {
                    needchange = true;
                }
                if (!speed || !scale) {
                    needshift = true;
                }
            }
        }

        if (force) {
            needchange = force;
        }

        if (needchange) {
            for (let controlIndex = 0; controlIndex < this.mapControlList.length; controlIndex++) {
                let control = this.mapControlList[controlIndex];
                // for (let i = 0; i < control.mapList.length; i++) {
                //     for (let j = i + 1; j < control.mapList.length; j++) {
                //         if (control.mapList[i].y > control.mapList[j].y) {
                //             let temp = control.mapList[i];
                //             control.mapList[i] = control.mapList[j];
                //             control.mapList[j] = temp;
                //         }
                //     }
                // }
                control.mapList.sort(function (a, b) {
                    return a.y - b.y;
                });
                for (let i = 0; i < control.mapList.length; i++) {
                    control.mapTransList.push(control.mapList[i])
                }
                if (control.mapList.length > 0) {
                    control.mapList.splice(0, control.mapList.length);
                }
            }
            return endlessStep.CREATEMAP;
        } else {
            if (needshift) {
                for (let controlIndex = 0; controlIndex < now.oVecMapID.length; controlIndex++) {
                    let control = this.mapControlList[controlIndex];
                    if (control.mapSpeed == -1) {
                        control.mapSpeed = now.oVecSpeed[controlIndex];
                    } else {
                        if (control.mapSpeed != now.oVecSpeed[controlIndex]) {
                            control.speedAccTime = 1;
                            control.speedAcc = (now.oVecSpeed[controlIndex] - control.mapSpeed) / control.speedAccTime;
                        } else {
                            control.speedAcc = 0;
                            control.speedAccTime = 0;
                        }
                    }
                    if (control.mapScale == -1) {
                        control.mapScale = now.oVecScale[controlIndex];
                    } else {
                        if (control.mapScale != now.oVecScale[controlIndex]) {
                            control.targetScale = now.oVecScale[controlIndex];
                            control.perScale = control.targetScale - control.mapScale;
                        } else {
                            control.targetScale = control.mapScale;
                            control.perScale = 0;
                        }
                    }
                }
                return endlessStep.SHIFTMAP;
            } else {
                return endlessStep.WARNING;
            }
        }
    },
    mapShift: function (dt) {
        let sum = this.mapControlList.length;
        for (let mapControlIndex = 0; mapControlIndex < this.mapControlList.length; mapControlIndex++) {
            let control = this.mapControlList[mapControlIndex];
            if (control.mapList.length == 0) {
                sum--;
                continue;
            }
            // for (let i = 0; i < control.mapList.length; i++) {
            //     for (let j = i + 1; j < control.mapList.length; j++) {
            //         if (control.mapList[i].y > control.mapList[j].y) {
            //             let temp = control.mapList[i];
            //             control.mapList[i] = control.mapList[j];
            //             control.mapList[j] = temp;
            //         }
            //     }
            // }
            control.mapList.sort(function (a, b) {
                return a.y - b.y;
            });

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
            } else if (control.speedAccTime > 0) {
                control.mapSpeed += control.speedAcc * dt;
                control.speedAccTime -= dt;
                if (control.speedAccTime < 0) {
                    control.speedAccTime = 0;
                }
                for (let key in control.mapList) {
                    control.mapList[key].y = (control.mapList[key].y - control.mapSpeed * dt);
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
            } else {
                for (let key in control.mapList) {
                    control.mapList[key].y = (control.mapList[key].y - control.mapSpeed * dt);
                }
                sum--;
            }
        }

        return !sum;
    },

    selectMode: function () {
        switch (this.config.wRandomType) {
            case 1:
                if (this.config.wMode >= 0 && this.config.wMode < this.data.monstersNormal.length) {
                    this.createWave(this.data.monstersNormal[this.config.wMode]);
                } else {
                    this.createWave(this.data.monstersNormal[Math.floor(Math.random() * this.data.monstersNormal.length)]);
                }
                break;
            case 2:
                if (this.config.wMode >= 0 && this.config.wMode < this.data.monstersElite.length) {
                    this.createWave(this.data.monstersElite[this.config.wMode]);
                } else {
                    this.createWave(this.data.monstersElite[Math.floor(Math.random() * this.data.monstersElite.length)]);
                }
                break;
            case 3:
                if (this.config.wMode >= 0 && this.config.wMode < this.data.goldMode.length) {
                    this.setGoldMode(this.data.goldMode[this.config.wMode], true);
                } else {
                    this.setGoldMode(this.data.goldMode[Math.floor(Math.random() * this.data.goldMode.length)], true);
                }
                break;
            case 4:
                if (this.config.wMode >= 0 && this.config.wMode < this.data.dodgeMode.length) {
                    this.setGoldMode(this.data.dodgeMode[this.config.wMode], false);
                } else {
                    this.setGoldMode(this.data.dodgeMode[Math.floor(Math.random() * this.data.dodgeMode.length)], false);
                }
                break;
            case 5:
                if (this.config.wMode >= 0 && this.config.wMode < this.data.monstersLine.length) {
                    this.createWave(this.data.monstersLine[this.config.wMode]);
                } else {
                    this.createWave(this.data.monstersLine[Math.floor(Math.random() * this.data.monstersLine.length)]);
                }
                break;
            case 6:
                if (this.config.wMode >= 0 && this.config.wMode < this.data.monstersMissile.length) {
                    this.createWave(this.data.monstersMissile[this.config.wMode]);
                } else {
                    this.createWave(this.data.monstersMissile[Math.floor(Math.random() * this.data.monstersMissile.length)]);
                }
                break;
            case 7:
                if (this.config.wMode >= 0 && this.config.wMode < this.data.monstersBoss.length) {
                    this.createWave(this.data.monstersBoss[this.config.wMode]);
                } else {
                    this.createWave(this.data.monstersBoss[Math.floor(Math.random() * this.data.monstersBoss.length)]);
                }
                break;
            case 8:
                if (this.config.wMode >= 0 && this.config.wMode < this.data.monstersEilteBoss.length) {
                    this.createWave(this.data.monstersEilteBoss[this.config.wMode]);
                } else {
                    this.createWave(this.data.monstersEilteBoss[Math.floor(Math.random() * this.data.monstersEilteBoss.length)]);
                }
                break;
            case 9:
                if (this.config.wMode >= 0 && this.config.wMode < this.data.monstersChest.length) {
                    this.createWave(this.data.monstersChest[this.config.wMode]);
                } else {
                    this.createWave(this.data.monstersChest[Math.floor(Math.random() * this.data.monstersChest.length)]);
                }
                break;
        }
    },

    setGoldMode: function (modeID, goldordodge) {
        let goldModeData = null;
        if (goldordodge) {
            goldModeData = require('CampGold' + modeID).data;
        } else {
            goldModeData = require('CampDodge' + modeID).data;
        }
        this.mapControlList[goldModeData.layer].goldData.splice(0, this.mapControlList[goldModeData.layer].goldData.length);
        this.mapControlList[goldModeData.layer].goldDataIndex.splice(0, this.mapControlList[goldModeData.layer].goldDataIndex.length);
        for (let key in goldModeData.gold) {
            this.mapControlList[goldModeData.layer].goldData.push(goldModeData.gold[key]);
            this.mapControlList[goldModeData.layer].goldDataIndex.push(0);
        }
    },
    checkGold: function () {
        let over = true;
        for (let i = 0; i < this.mapControlList.length; i++) {
            let control = this.mapControlList[i];
            if (control.goldData.length > 0) {
                for (let mapIndex in control.mapList) {
                    if (control.goldDataIndex[mapIndex] < control.goldData[mapIndex].length) {
                        over = false;
                    }
                }
            }
        }

        if (over) {
            if (this.config.wRandomType == 3) {
                if (this.battleManager.managers[Defines.MgrType.ENTITY].entityGoldList.length != 0) {
                    over = false;
                }
            } else if (this.config.wRandomType == 4) {
                if (this.battleManager.managers[Defines.MgrType.ENTITY].entitySundriesList.length != 0) {
                    over = false;
                }
            }

            for (let i = 0; i < this.mapControlList.length; i++) {
                let control = this.mapControlList[i];
                if (control.goldData.length > 0) {
                    control.goldData.splice(0, control.goldData.length);
                    control.goldDataIndex.splice(0, control.goldDataIndex.length);
                }
            }
        }
        return over;
    },
    updateGold: function (dt) {
        for (let controlIndex = 0; controlIndex < this.mapControlList.length; controlIndex++) {
            let control = this.mapControlList[controlIndex];
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

                    if (control.goldData.length > 0) {
                        if (control.goldDataIndex[i] < control.goldData[i].length) {
                            control.mapList[i].goldCreated = false;
                        }
                    }
                }
            }
            for (let i = 0; i < control.mapList.length; i++) {
                control.mapList[i].y = (control.mapList[i].y - control.mapSpeed * dt);
            }

            if (control.goldData.length > 0) {
                for (let i = 0; i < control.mapList.length; i++) {
                    if (control.goldDataIndex[i] < control.goldData[i].length &&
                        control.mapList[i].y - 0.5 * control.mapList[i].getContentSize().height * control.mapList[i].scale <= cc.winSize.height &&
                        !control.mapList[i].goldCreated) {
                        let gold = control.goldData[i];
                        let index = control.goldDataIndex[i];
                        let map = control.mapList[i];
                        for (let key in gold[index]) {
                            if (this.config.wRandomType == 3) {
                                let size = map.getContentSize();
                                let curPos = cc.v3(map.x + size.width * (gold[index][key].posX - 0.5), map.y + size.height * (gold[index][key].posY - 0.5));
                                this.solution.solution_map_buff(gold[index][key].id, curPos, cc.v3(0, -control.mapSpeed));
                            } else if (this.config.wRandomType == 4) {
                                let size = map.getContentSize();
                                let curPos = cc.v3(map.x + size.width * (gold[index][key].posX - 0.5), map.y + size.height * (gold[index][key].posY - 0.5));
                                this.solution.solution_map_sundries(gold[index][key].id, curPos, cc.v3(0, -control.mapSpeed), gold[index][key].hp);
                            }
                        }
                        map.goldCreated = true;
                        control.goldDataIndex[i]++;
                    }
                }
            }
        }
    },
    createGold: function () {
        for (let mapControlIndex = 0; mapControlIndex < this.mapControlList.length; mapControlIndex++) {
            let control = this.mapControlList[mapControlIndex];
            if (control.goldData.length > 0) {
                control.mapList.sort(function (a, b) {
                    return a.y - b.y;
                });
                for (let i = 0; i < control.mapList.length; i++) {
                    control.mapList[i].goldCreated = true;
                }
            }
        }
    },

    createWave: function (data) {
        let waveControl = {};
        waveControl.data = data;
        if (typeof waveControl.data !== 'undefined') {
            waveControl.wait = waveControl.data.wait;
            waveControl.delay = waveControl.data.delay;
            waveControl.groups = [];
            for (let i = 0; i < waveControl.data.groups.length; i++) {
                let tblGroupData = GlobalVar.tblApi.getDataBySingleKey('TblBattleGroups', waveControl.data.groups[i]);
                waveControl.groups.push(tblGroupData);
            }
        }
        waveControl.curTime = 0;
        waveControl.monsterInterval = [];
        waveControl.monstersList = [];
        waveControl.monsterKillList = [];
        for (let j = 0; j < waveControl.groups.length; j++) {
            waveControl.monstersList.push(new Array());
            waveControl.monsterInterval.push(0);
        }
        this.waveControlList.push(waveControl);
    },
    updateWave: function (dt) {
        let clear = true;
        for (let i = 0; i < this.waveControlList.length; i++) {
            if (!this.createGroup(this.waveControlList[i], dt)) {
                clear = false;
            }
        }
        return clear;
    },
    checkWave: function () {
        let clear = true;
        for (let i = 0; i < this.waveControlList.length; i++) {
            let waveControl = this.waveControlList[i];
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
            waveControl.monsterInterval[groupIndex] += dt;
            if (waveControl.wait == 1 && groupIndex - 1 >= 0) {
                if (!(waveControl.monsterKillList.length >= waveControl.groups[groupIndex - 1].oVecMonsterIDs.length && waveControl.monstersList[groupIndex - 1].length == waveControl.groups[groupIndex - 1].oVecMonsterIDs.length)) {
                    clear = false;
                    break;
                }
            }
            if (waveControl.curTime >= waveControl.delay[groupIndex]) {
                if (waveControl.monstersList[groupIndex].length == waveControl.groups[groupIndex].oVecMonsterIDs.length) {
                    continue;
                }
                clear = false;
                for (let monsterIndex = waveControl.monstersList[groupIndex].length; monsterIndex < waveControl.groups[groupIndex].oVecMonsterIDs.length; monsterIndex++) {
                    if (waveControl.monsterInterval[groupIndex] >= waveControl.groups[groupIndex].oVecInterval[monsterIndex]) {
                        let entity = this.createGroupMonster(waveControl.groups[groupIndex].oVecMonsterIDs[monsterIndex], waveControl.groups[groupIndex].oVecPosition[monsterIndex]);
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
        if (entity.dropBuff && entity.canDrop) {
            this.tryDropItem(2, entity);
        }
        if (entity.canDrop) {
            this.killRecord++;
        }
        for (let i = 0; i < this.waveControlList.length; i++) {
            if (typeof this.waveControlList[i] !== 'undefined') {
                this.waveControlList[i].monsterKillList.push(entity);
            }
        }
    },
    tryDropItem: function (mode, entity) {
        if (this.config == null) {
            return;
        }
        let buffIds = [];
        let mapBuffCounts = this.battleManager.managers[Defines.MgrType.ENTITY].entityBuffList.length;
        switch (mode) {
            case 0:
                for (let key in this.config.oVecBuff) {
                    if (this.interval[key] >= this.config.oVecDropDuation[key]) {
                        if (this.config.oVecBuff[key] <= Defines.Assist.GHOST && mapBuffCounts < 5) {
                            buffIds.push(this.config.oVecBuff[key]);
                        }
                        this.interval[key] = 0;
                    }
                }
                for (let id of buffIds) {
                    let pos = cc.v3((Math.random() * (cc.winSize.width - 200)) + 100, cc.winSize.height - 20);
                    if (id <= Defines.Assist.GHOST) {
                        this.solution.solution_buff(id, pos);
                    } else {
                        this.solution.solution_crystal_single(id, pos, 90 + (Math.random() - 0.5) * 45, 600 + (Math.random() - 0.5) * 10, 8, -0.5);
                    }
                }
                break;
            case 1:
                for (let key in this.config.oVecDropBuff) {
                    if (Math.floor(Math.random() * 10000) <= this.config.oVecHitProb[key]) {
                        if (this.config.oVecDropBuff[key] <= Defines.Assist.GHOST) {
                            if (mapBuffCounts < 5) {
                                buffIds.push(this.config.oVecDropBuff[key]);
                            }
                        } else {
                            buffIds.push(this.config.oVecDropBuff[key]);
                        }
                    }
                }
                for (let id of buffIds) {
                    if (id <= Defines.Assist.GHOST) {
                        this.solution.solution_buff(id, entity.getPosition());
                    } else {
                        this.solution.solution_crystal_single(id, entity.getPosition(), 90 + (Math.random() - 0.5) * 45, 600 + (Math.random() - 0.5) * 10, 8, -0.5);
                    }
                }
                break;
            case 2:
                let chestPer = 0;
                for (let key in this.config.oVecDropBuff) {
                    if (this.config.oVecDropBuff[key] == Defines.Assist.GOLD) {
                        chestPer = this.config.oVecDropBuffProb[key];
                        if (this.actuallyChest > 0) {
                            chestPer = 10000;
                            this.actuallyChest--;
                        } else if (this.waveCount <= this.totalWave) {
                            chestPer = 7500;
                        }
                        continue;
                    }
                    if (Math.floor(Math.random() * 10000) <= this.config.oVecDropBuffProb[key]) {
                        if (this.config.oVecDropBuff[key] <= Defines.Assist.GHOST) {
                            if (mapBuffCounts < 5) {
                                buffIds.push(this.config.oVecDropBuff[key]);
                            }
                        } else {
                            buffIds.push(this.config.oVecDropBuff[key]);
                        }
                    }
                }
                let leftChest = Math.min(GlobalVar.me().endlessData.getEndlessRewardCount(), GlobalVar.tblApi.getDataBySingleKey('TblParam', GameServerProto.PTPARAM_ENDLESS_PACKAGE_DROP_MAX).dValue);
                if ((entity.tbl.dwType == 4 || entity.tbl.dwType == 5) &&
                    this.battleManager.endlessChestCount < leftChest &&
                    Math.floor(Math.random() * 10000) <= chestPer) {
                    this.battleManager.endlessChestCount++;
                    buffIds.push(this.endlessMode.wRewardItem % 5000 + 30000);
                }
                for (let id of buffIds) {
                    if (id <= Defines.Assist.GHOST || id > Defines.Assist.GOLD) {
                        this.solution.solution_buff(id, entity.getPosition());
                    } else {
                        this.solution.solution_crystal_single(id, entity.getPosition(), 90 + (Math.random() - 0.5) * 45, 600 + (Math.random() - 0.5) * 10, 8, -0.5);
                    }
                }
                break;
        }

    },

    showAnime: function (animeIndex) {
        this.animeIndex = animeIndex;
        var self = this;
        if (animeIndex == 1) {
            if (this.config.wIsBOSS == 1 && self.config.wRandomType != 3 && self.config.wRandomType != 4) {
                GlobalVar.soundManager().stopBGM();
            }
            this.battleManager.warning(function () {
                self.animeIndex = -1;
                if (self.config.wRandomType == 3 || self.config.wRandomType == 4) {
                    self.step = endlessStep.GOLDSTART;
                } else {
                    self.step = endlessStep.GROUPSTART;
                    if (self.config.wIsBOSS == 1) {
                        GlobalVar.soundManager().playBGM("cdnRes/audio/battle/music/Boss_Room");
                    }
                }
                //self.step = endlessStep.GROUPSTART;
            });
            this.step = endlessStep.NONE;
        } else {
            if (this.config.wRandomType == 3 || this.config.wRandomType == 4) {
                this.step = endlessStep.GOLDSTART;
            } else {
                this.step = endlessStep.GROUPSTART;
            }
            //this.step = endlessStep.GROUPSTART;
        }
    },
})