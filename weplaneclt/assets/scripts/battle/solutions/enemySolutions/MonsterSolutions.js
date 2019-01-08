const MonsterEntity = require('MonsterEntity')
const Defines = require('BattleDefines')
const EntityManager = require('EntityManager')
const MonsterMapping = require('MonsterMapping')
const BattleManager = require('BattleManager')

const MonsterSolutions = cc.Class({
    properties: {
    },
    statics: {
        solution_1: function (info, speed, angle, speedacc, angleacc, SpfixDirection, Rotation) {
            //直线
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            entity.setBaseAngle(-Rotation);
            entity.setTimerHandler(function (idx) {
                if (idx == 0) {
                    if (SpfixDirection == 0) {
                        this.setSpeed(ai.speedTransfer(speed, angle), false);
                        this.setSpeedAcc(ai.speedTransfer(speedacc, angleacc));
                    }
                    if (SpfixDirection == 1) {
                        this.setSpeed(ai.speedTransfer(speed, angle), true);
                        this.setSpeedAcc(ai.speedTransfer(speedacc, angleacc));
                    }
                }
            });
            entity.setTimer(0, 0, 1, 0);
            return entity;
        },
        solution_2: function (info, speed, angle, speedacc, angleacc, delay, amplitude, cycle, fi, moveDirection, Hspeed, HspeedAcc, fixDirection, Hdelay, autoskilldelay, scale) {
            //简谐运动
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            if (typeof scale !== 'undefined') {
                entity.setScale(1, -1);
            }
            entity.setTimerHandler(function (idx) {
                if (idx == 0) {
                    this.setSpeed(ai.speedTransfer(speed, angle));
                    this.setSpeedAcc(ai.speedTransfer(speedacc, angleacc));
                    this.setTimer(1, delay, 1, 0);
                }
                if (idx == 1) {
                    this.setSpeed(ai.speedTransfer(0, angle));
                    this.setSpeedAcc(ai.speedTransfer(0, angleacc));
                    this.setTimer(2, Hdelay, 1, 0);
                }
                if (idx == 2) {
                    this.simpleHarmonic(amplitude, cycle, fi, moveDirection, Hspeed, HspeedAcc, fixDirection)
                    this.setMovementType(5);
                    this.setTimer(3, autoskilldelay, 1, 0);
                }
                if (idx == 3) {
                    ai.autoUseSkill(this, true);
                }
            });
            entity.setTimer(0, 0, 1, 0);
            return entity;
        },
        solution_3: function (info, destination, time, overDes, fixDirection, autoskilldelay, scale) {
            //直线并悬停
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            if (typeof scale !== 'undefined') {
                entity.setScale(1, -1);
            }
            entity.setTimerHandler(function (idx) {
                if (idx == 0) {
                    this.shiftToStandby(destination, time, overDes, fixDirection);
                    this.setMovementType(4);
                }
                if (idx == 1) {
                    ai.autoUseSkill(this, true);
                }
                if (idx == 2) {
                    this.simpleHarmonic(22, 2, -90, cc.v3(1, 0), cc.v3(0, 0), cc.v3(0, 0), 0)
                    this.setMovementType(5);
                }
            });
            entity.setTimer(0, 0, 1, 0);
            if (typeof autoskilldelay !== 'undefined') {
                entity.setTimer(1, time + 0.25, 1, 0);
            }
            entity.setTimer(2, time + 0.25, 1, 0);
            return entity;
        },
        // solution_4: function (info, speed, angle, speedacc, angleacc, r, sita, rspeed, rspeedacc, omega, omegaacc, fixDirection, autoskilldelay,scale) {
        //     //圆延直线轨迹
        //     let ai = require('AIInterface');
        //     let entity = ai.createMonster(info);
        //     if (typeof scale !== 'undefined') {
        //         entity.setScale(1,-1);
        //     }
        //     entity.setTimerHandler(function (idx) {
        //         if (idx == 0) {
        //             this.setObjectAutoCircle(r, sita, rspeed, rspeedacc, omega, omegaacc, fixDirection);
        //             this.setSpeed(ai.speedTransfer(speed, angle));
        //             this.setSpeedAcc(ai.speedTransfer(speedacc, angleacc));
        //         }
        //         if (idx == 1) {
        //             ai.autoUseSkill(this,true);
        //         }
        //     });
        //     entity.setTimer(0, 0, 1, 0);
        //     if (typeof autoskilldelay !== 'undefined') {
        //         entity.setTimer(1, autoskilldelay, 1, 0);
        //     }
        //     return entity;
        // },
        solution_5: function (info, speed, speedacc, pos_1, pos_2, pos_3, fixDirection, autoskilldelay, scale) {
            //3点式bezier曲线
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            if (typeof scale !== 'undefined') {
                entity.setScale(1, -1);
            }
            let vec_1 = ai.posTransfer(pos_1);
            let vec_2 = ai.posTransfer(pos_1.add(pos_2));
            let vec_3 = ai.posTransfer(pos_1.add(pos_3));
            entity.setTimerHandler(function (idx) {
                if (idx == 0) {
                    let posData = [vec_1, vec_2, vec_3];
                    this.setBezier(posData, speed, speedacc, fixDirection);
                    this.setMovementType(2);
                }
                if (idx == 1) {
                    ai.autoUseSkill(this, true);
                }
            });
            entity.setTimer(0, 0, 1, 0);
            if (typeof autoskilldelay !== 'undefined') {
                entity.setTimer(1, autoskilldelay, 1, 0);
            }
            return entity;
        },
        solution_6: function (info, speed, speedacc, pos_1, pos_2, pos_3, pos_4, fixDirection, autoskilldelay, scale) {
            //4点式bezier曲线
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            if (typeof scale !== 'undefined') {
                entity.setScale(1, -1);
            }
            let vec_1 = ai.posTransfer(pos_1);
            let vec_2 = ai.posTransfer(pos_1.add(pos_2));
            let vec_3 = ai.posTransfer(pos_1.add(pos_3));
            let vec_4 = ai.posTransfer(pos_1.add(pos_4));
            entity.setTimerHandler(function (idx) {
                if (idx == 0) {
                    let posData = [vec_1, vec_2, vec_3, vec_4];
                    this.setBezier(posData, speed, speedacc, fixDirection);
                    this.setMovementType(2);
                }
                if (idx == 1) {
                    ai.autoUseSkill(this, true);
                }
            });
            entity.setTimer(0, 0, 1, 0);
            if (typeof autoskilldelay !== 'undefined') {
                entity.setTimer(1, autoskilldelay, 1, 0);
            }
            return entity;
        },
        solution_7: function (info, speed, speedacc, pos_1, pos_2, pos_3, pos_4, pos_5, fixDirection, autoskilldelay, scale) {
            //5点式bezier曲线
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            if (typeof scale !== 'undefined') {
                entity.setScale(1, -1);
            }
            let vec_1 = ai.posTransfer(pos_1);
            let vec_2 = ai.posTransfer(pos_1.add(pos_2));
            let vec_3 = ai.posTransfer(pos_1.add(pos_3));
            let vec_4 = ai.posTransfer(pos_1.add(pos_4));
            let vec_5 = ai.posTransfer(pos_1.add(pos_5));
            entity.setTimerHandler(function (idx) {
                if (idx == 0) {
                    let posData = [vec_1, vec_2, vec_3, vec_4, vec_5];
                    this.setBezier(posData, speed, speedacc, fixDirection);
                    this.setMovementType(2);
                }
                if (idx == 1) {
                    ai.autoUseSkill(this, true);
                }
            });
            entity.setTimer(0, 0, 1, 0);
            if (typeof autoskilldelay !== 'undefined') {
                entity.setTimer(1, autoskilldelay, 1, 0);
            }
            return entity;
        },
        solution_8: function (info, runtime, autoskilldelay, scale) {
            //渐隐出现-上下摆动
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            if (typeof scale !== 'undefined') {
                entity.setScale(1, -1);
            }
            entity.opacity = (0);
            entity.setTimerHandler(function (idx) {
                if (idx == 0) {
                    this.setCollisionSwitch(false);
                    this.runOpacity(255, runtime);
                    this.setTimer(1, runtime, 1, 0);
                }
                if (idx == 1) {
                    this.simpleHarmonic(10, 2, -90, cc.v3(1, 0), cc.v3(0, 0), cc.v3(0, 0), 0)
                    this.setMovementType(5);
                    this.setCollisionSwitch(true);
                    if (typeof autoskilldelay !== 'undefined') {
                        this.setTimer(2, autoskilldelay, 1, 0);
                    }
                }
                if (idx == 2) {
                    ai.autoUseSkill(this, true);
                }
            });
            entity.setTimer(0, 0, 1, 0);
            return entity;
        },
        solution_9: function (info, speed, speedacc, pos_1, pos_2, pos_3, pos_4, pos_5, pos_6, pos_7, pos_8, pos_9, pos_10, pos_11, fixDirection, autoskilldelay, scale) {
            //11点式bezier曲线
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            if (typeof scale !== 'undefined') {
                entity.setScale(1, -1);
            }
            let vec_1 = ai.posTransfer(pos_1);
            let vec_2 = ai.posTransfer(pos_1.add(pos_2));
            let vec_3 = ai.posTransfer(pos_1.add(pos_3));
            let vec_4 = ai.posTransfer(pos_1.add(pos_4));
            let vec_5 = ai.posTransfer(pos_1.add(pos_5));
            let vec_6 = ai.posTransfer(pos_1.add(pos_6));
            let vec_7 = ai.posTransfer(pos_1.add(pos_7));
            let vec_8 = ai.posTransfer(pos_1.add(pos_8));
            let vec_9 = ai.posTransfer(pos_1.add(pos_9));
            let vec_10 = ai.posTransfer(pos_1.add(pos_10));
            let vec_11 = ai.posTransfer(pos_1.add(pos_11));
            entity.setTimerHandler(function (idx) {
                if (idx == 0) {
                    let posData = [vec_1, vec_2, vec_3, vec_4, vec_5, vec_6, vec_7, vec_8, vec_9, vec_10, vec_11];
                    this.setBezier(posData, speed, speedacc, fixDirection);
                    this.setMovementType(2);
                }
                if (idx == 1) {
                    ai.autoUseSkill(this, true);
                }
            });
            entity.setTimer(0, 0, 1, 0);
            if (typeof autoskilldelay !== 'undefined') {
                entity.setTimer(1, autoskilldelay, 1, 0);
            }
            return entity;
        },
        solution_10: function (info, speed, speedacc, pos_1, pos_2, pos_3, pos_4, pos_5, pos_6, fixDirection, autoskilldelay, scale) {
            //6点式bezier曲线
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            if (typeof scale !== 'undefined') {
                entity.setScale(1, -1);
            }
            let vec_1 = ai.posTransfer(pos_1);
            let vec_2 = ai.posTransfer(pos_1.add(pos_2));
            let vec_3 = ai.posTransfer(pos_1.add(pos_3));
            let vec_4 = ai.posTransfer(pos_1.add(pos_4));
            let vec_5 = ai.posTransfer(pos_1.add(pos_5));
            let vec_6 = ai.posTransfer(pos_1.add(pos_6));
            entity.setTimerHandler(function (idx) {
                if (idx == 0) {
                    let posData = [vec_1, vec_2, vec_3, vec_4, vec_5, vec_6];
                    this.setBezier(posData, speed, speedacc, fixDirection);
                    this.setMovementType(2);
                }
                if (idx == 1) {
                    ai.autoUseSkill(this, true);
                }
            });
            entity.setTimer(0, 0, 1, 0);
            if (typeof autoskilldelay !== 'undefined') {
                entity.setTimer(1, autoskilldelay, 1, 0);
            }
            return entity;
        },
        solution_11: function (info, speed, speedacc, pos_1, pos_2, pos_3, fixDirection, autoskilldelay, scale) {
            //3点式bezier曲线——悬停摆动
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            if (typeof scale !== 'undefined') {
                entity.setScale(1, -1);
            }
            let vec_1 = ai.posTransfer(pos_1);
            let vec_2 = ai.posTransfer(pos_1.add(pos_2));
            let vec_3 = ai.posTransfer(pos_1.add(pos_3));
            entity.setTimerHandler(function (idx) {
                if (idx == 0) {
                    let posData = [vec_1, vec_2, vec_3];
                    this.setBezier(posData, speed, speedacc, fixDirection);
                    this.setMovementType(2);
                }
                if (idx == 1) {
                    ai.autoUseSkill(this, true);
                }
                if (idx == 2) {
                    this.simpleHarmonic(10, 2, -90, cc.v3(1, 0), cc.v3(0, 0), cc.v3(0, 0), 0)
                    this.setMovementType(5);
                    if (typeof autoskilldelay !== 'undefined') {
                        this.setTimer(1, autoskilldelay, 1, 0);
                    }
                }
                if (idx == 3) {
                    let p = this.getBezierIsEnd()
                    if (p == true) {
                        this.setTimer(2, 0, 1, 0);
                        this.delTimer(3);
                    }
                }
            });
            entity.setTimer(0, 0, 1, 0);
            entity.setTimer(3, 0.016, 9999, 1);
            return entity;
        },
        solution_12: function (info, speed, speedacc, pos_1, pos_2, pos_3, pos_4, pos_5, pos_6, fixDirection, autoskilldelay, scale) {
            //6点式bezier曲线——悬停摆动
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            if (typeof scale !== 'undefined') {
                entity.setScale(1, -1);
            }
            let vec_1 = ai.posTransfer(pos_1);
            let vec_2 = ai.posTransfer(pos_1.add(pos_2));
            let vec_3 = ai.posTransfer(pos_1.add(pos_3));
            let vec_4 = ai.posTransfer(pos_1.add(pos_4));
            let vec_5 = ai.posTransfer(pos_1.add(pos_5));
            let vec_6 = ai.posTransfer(pos_1.add(pos_6));
            entity.setTimerHandler(function (idx) {
                if (idx == 0) {
                    let posData = [vec_1, vec_2, vec_3, vec_4, vec_5, vec_6];
                    this.setBezier(posData, speed, speedacc, fixDirection);
                    this.setMovementType(2);
                }
                if (idx == 1) {
                    ai.autoUseSkill(this, true);
                }
                if (idx == 2) {
                    this.simpleHarmonic(10, 2, -90, cc.v3(1, 0), cc.v3(0, 0), cc.v3(0, 0), 0)
                    this.setMovementType(5);
                    if (typeof autoskilldelay !== 'undefined') {
                        this.setTimer(1, autoskilldelay, 1, 0);
                    }
                }
                if (idx == 3) {
                    let p = this.getBezierIsEnd()
                    if (p == true) {
                        this.setTimer(2, 0, 1, 0);
                        this.delTimer(3);
                    }
                }
            });
            entity.setTimer(0, 0, 1, 0);
            entity.setTimer(3, 0.016, 9999, 1);
            return entity;
        },
        solution_13: function (info, speed, speedacc, pos_1, pos_2, pos_3, pos_4, fixDirection, autoskilldelay, scale) {
            //4点式bezier曲线——悬停摆动
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            if (typeof scale !== 'undefined') {
                entity.setScale(1, -1);
            }
            let vec_1 = ai.posTransfer(pos_1);
            let vec_2 = ai.posTransfer(pos_1.add(pos_2));
            let vec_3 = ai.posTransfer(pos_1.add(pos_3));
            let vec_4 = ai.posTransfer(pos_1.add(pos_4));
            entity.setTimerHandler(function (idx) {
                if (idx == 0) {
                    let posData = [vec_1, vec_2, vec_3, vec_4];
                    this.setBezier(posData, speed, speedacc, fixDirection);
                    this.setMovementType(2);
                }
                if (idx == 1) {
                    ai.autoUseSkill(this, true);
                }
                if (idx == 2) {
                    this.simpleHarmonic(10, 2, -90, cc.v3(1, 0), cc.v3(0, 0), cc.v3(0, 0), 0)
                    this.setMovementType(5);
                    if (typeof autoskilldelay !== 'undefined') {
                        this.setTimer(1, autoskilldelay, 1, 0);
                    }
                }
                if (idx == 3) {
                    let p = this.getBezierIsEnd()
                    if (p == true) {
                        this.setTimer(2, 0, 1, 0);
                        this.delTimer(3);
                    }
                }
            });
            entity.setTimer(0, 0, 1, 0);
            entity.setTimer(3, 0.016, 9999, 1);
            return entity;
        },
        solution_14: function (info, destination, time, overDes, LfixDirection, autoskilldelay, r, angle, omega, omegaAcc, rSpeed, rSpeedAcc, CfixDirection, scale) {
            //直线——圆
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            if (typeof scale !== 'undefined') {
                entity.setScale(1, -1);
            }
            entity.setTimerHandler(function (idx) {
                if (idx == 0) {
                    this.shiftToStandby(destination, time, overDes, LfixDirection);
                    this.setMovementType(4);
                }
                if (idx == 1) {
                    ai.autoUseSkill(this, true);
                }
                if (idx == 2) {
                    let pos = this.getPosition();
                    let circlePos = pos.add(ai.speedTransfer(r, angle))
                    let R = pos.sub(circlePos);
                    this.setEntityAutoCircle(circlePos, R, omega, omegaAcc, rSpeed, rSpeedAcc, CfixDirection);
                    this.setMovementType(1);
                    if (typeof autoskilldelay !== 'undefined') {
                        this.setTimer(1, autoskilldelay, 1, 0);
                    }
                }
            });
            entity.setTimer(0, 0, 1, 0);
            entity.setTimer(2, time + 0.5, 1, 0);
            return entity;
        },
        solution_15: function (info, runtime, autoskilldelay, r, angle, omega, omegaAcc, rSpeed, rSpeedAcc, CfixDirection, scale) {
            //闪烁——圆
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            if (typeof scale !== 'undefined') {
                entity.setScale(1, -1);
            }
            entity.opacity = (0);
            entity.setTimerHandler(function (idx) {
                if (idx == 0) {
                    this.setCollisionSwitch(false);
                    this.runOpacity(255, runtime);
                    this.setTimer(3, runtime, 1, 0);
                }
                if (idx == 1) {
                    ai.autoUseSkill(this, true);
                }
                if (idx == 2) {
                    let pos = this.getPosition();
                    let circlePos = pos.add(ai.speedTransfer(r, angle))
                    let R = pos.sub(circlePos);
                    this.setEntityAutoCircle(circlePos, R, omega, omegaAcc, rSpeed, rSpeedAcc, CfixDirection);
                    this.setMovementType(1);
                }
                if (idx == 3) {
                    this.setCollisionSwitch(true);
                    this.setTimer(2, 0.5, 1, 0);
                    if (typeof autoskilldelay !== 'undefined') {
                        this.setTimer(1, autoskilldelay, 1, 0);
                    }
                }
            });
            entity.setTimer(0, 0, 1, 0);
            return entity;
        },
        solution_16: function (info, speed, speedacc, angleacc, SpfixDirection, autoskilldelay, scale) {
            //朝向飞机（一次）
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            if (typeof scale !== 'undefined') {
                entity.setScale(1, -1);
            }
            let pos = entity.getPosition();
            let angle = -90;
            let hero = ai.getHero();
            if (hero == null) {
            } else {
                angle = ai.getAngle(pos, hero.getPosition());
            }
            entity.setTimerHandler(function (idx) {
                if (idx == 0) {
                    if (SpfixDirection == 0) {
                        this.setSpeed(ai.speedTransfer(speed, angle), false);
                        this.setSpeedAcc(ai.speedTransfer(speedacc, angleacc));
                    }
                    if (SpfixDirection == 1) {
                        this.setSpeed(ai.speedTransfer(speed, angle), true);
                        this.setSpeedAcc(ai.speedTransfer(speedacc, angleacc));
                    }
                }
                if (idx == 1) {
                    ai.autoUseSkill(this, true);
                }
            });
            entity.setTimer(0, 0, 1, 0);
            if (typeof autoskilldelay !== 'undefined') {
                entity.setTimer(1, autoskilldelay, 1, 0);
            }
            return entity;
        },
        solution_17: function (info, speed, angle, speedacc, angleacc, direction, posPlus, movetime, movespeed) {
            //导弹怪
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            let dstpos = entity.getPosition();
            entity.setOpacity(0);
            entity.addInvincibleTime(9999);
            entity.setImmediatelyKill(2);
            //setImmediatelyKill（1——即死；2——50%）
            entity.setDropCrystal(false);
            entity.setCollisionSwitch(false);
            entity.setDropCount(false);
            let hero = ai.getHero();
            if (hero == null) {
            }
            else {
                dstpos = hero.getPosition();
            }
            entity.addEnemyIncoming(direction, posPlus, movetime, movespeed, dstpos, 2.3, function (pos) {
                entity.setPosition(pos);
                entity.addMotionStreak('huoyan_jin', true, cc.v3(0, -40));
                entity.setBaseAngle(angle - 90);
                entity.setOpacity(255);
                entity.setCollisionSwitch(true);
                entity.setSpeed(ai.speedTransfer(speed, angle), true);
                entity.setSpeedAcc(ai.speedTransfer(speedacc, angleacc));
            })
            return entity;
        },
        solution_18: function (info, skills) {
            //M_C_SYC  
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            let pos_1 = info.pos;
            let vec_1 = ai.posTransfer(pos_1);
            let vec_2 = ai.posTransfer(pos_1.add(cc.v3(-0.3125, 0.264)));
            let vec_3 = ai.posTransfer(pos_1.add(cc.v3(-0.3125, 0.96)));
            let vec_4 = ai.posTransfer(pos_1.add(cc.v3(0, 0.8)));
            entity.setTimerHandler(function (idx) {
                if (idx == 0) {
                    this.setCollisionSwitch(false);
                    ai.setMonsterLoopAction(this, 'start_1');
                    let posData = [vec_1, vec_2, vec_3, vec_4];
                    this.setBezier(posData, 1000, 0, 0);
                    this.setMovementType(2);
                }
                if (idx == 1) {
                    this.setCollisionSwitch(true);
                    this.simpleHarmonic(10, 2, -90, cc.v3(1, 0), cc.v3(0, 0), cc.v3(15, 15), 0)
                    this.setMovementType(5);
                    this.setTimer(2, 2, 1, 0);
                }
                if (idx == 2) {
                    this.simpleHarmonic(10, 2, -90, cc.v3(1, 0), cc.v3(30, 30), cc.v3(-15, -15), 0)
                    this.setMovementType(5);
                    this.setTimer(3, 2, 1, 0);
                }
                if (idx == 3) {
                    this.simpleHarmonic(10, 2, -90, cc.v3(1, 0), cc.v3(0, 0), cc.v3(-15, 15), 0)
                    this.setMovementType(5);
                    this.setTimer(4, 2, 1, 0);
                }
                if (idx == 4) {
                    this.simpleHarmonic(10, 2, -90, cc.v3(1, 0), cc.v3(-30, 30), cc.v3(15, -15), 0)
                    this.setMovementType(5);
                    this.setTimer(5, 2, 1, 0);
                }
                if (idx == 5) {
                    this.simpleHarmonic(10, 2, -90, cc.v3(1, 0), cc.v3(0, 0), cc.v3(-15, -15), 0)
                    this.setMovementType(5);
                    this.setTimer(6, 2, 1, 0);
                }
                if (idx == 6) {
                    this.simpleHarmonic(10, 2, -90, cc.v3(1, 0), cc.v3(-30, -30), cc.v3(15, 15), 0)
                    this.setMovementType(5);
                    this.setTimer(7, 2, 1, 0);
                }
                if (idx == 7) {
                    this.simpleHarmonic(10, 2, -90, cc.v3(1, 0), cc.v3(0, 0), cc.v3(15, -15), 0)
                    this.setMovementType(5);
                    this.setTimer(8, 2, 1, 0);
                }
                if (idx == 8) {
                    this.simpleHarmonic(10, 2, -90, cc.v3(1, 0), cc.v3(30, -30), cc.v3(-15, 15), 0)
                    this.setMovementType(5);
                    this.setTimer(1, 2, 1, 0);
                }
                if (idx == 9) {
                    let p = this.getBezierIsEnd();
                    if (p == true) {
                        this.setTimer(1, 0, 1, 0);
                        this.setTimer(10, 1, 1, 0);
                        this.delTimer(9);
                    }
                }
                if (idx == 10) {
                    ai.playAction(this, 'attack_1')
                    this.setTimer(11, 0.5, 1, 0);
                }
                if (idx == 11) {
                    ai.useSkill(this, 809);
                    this.setTimer(17, 2, 1, 0);
                }
                if (idx == 17) {
                    ai.playAction(this, 'attack_1')
                    this.setTimer(12, 0.5, 1, 0);
                }
                if (idx == 12) {
                    ai.useSkill(this, 810);
                    this.setTimer(13, 2, 1, 0);
                }
                if (idx == 13) {
                    ai.useSkill(this, 811);
                    this.setTimer(14, 2, 1, 0);
                }
                if (idx == 14) {
                    ai.useSkill(this, 966);
                    this.setTimer(15, 12, 1, 0);
                }
                if (idx == 15) {
                    this.setTimer(16, 0.5, 12, 1);
                    this.setTimer(11, 8, 1, 0);
                }
                if (idx == 16) {
                    ai.useSkill(this, 813);
                }

            });
            entity.setTimer(0, 0, 1, 0);
            entity.setTimer(9, 0.016, 9999, 1);
            return entity;
        },
        solution_19: function (info, skills) {
            //R_hjzj
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            entity.setTimerHandler(function (idx) {
                if (idx == 0) {
                    let destination = ai.posTransfer(cc.v3(0.5, 0.75));
                    this.shiftToStandby(destination, 1.5, 30, 0);
                    this.setMovementType(4);
                    this.setDefend(true);
                    this.setTimer(10, 2.5, 1, 0);
                }
                if (idx == 1) {
                    let pos = this.getPosition();
                    let circlePos = pos.add(ai.speedTransfer(30, 90))
                    let R = pos.sub(circlePos);
                    this.setEntityAutoCircle(circlePos, R, 90, 0, 0, 0, 0);
                    this.setMovementType(1);
                    this.setTimer(12, 2, 1, 0);
                }
                if (idx == 2) {
                    let pos = this.getPosition();
                    let circlePos = pos.add(ai.speedTransfer(30, 90))
                    let R = pos.sub(circlePos);
                    this.setEntityAutoCircle(circlePos, R, 90, 0, 0, 0, 0);
                    this.setMovementType(1);
                    this.setTimer(10, 4, 1, 0);
                }
                if (idx == 9) {
                    ai.autoUseSkill(this, true);
                    this.setDefend(false);
                }
                if (idx == 10) {
                    let destination = ai.posTransfer(cc.v3(0.2, 0.8));
                    this.shiftToStandby(destination, 1.5, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(11, 2.5, 1, 0);
                }
                if (idx == 11) {
                    let destination = ai.posTransfer(cc.v3(0.55, 0.8));
                    this.shiftToStandby(destination, 1.5, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(1, 2.5, 1, 0);
                }
                if (idx == 12) {
                    let destination = ai.posTransfer(cc.v3(0.8, 0.8));
                    this.shiftToStandby(destination, 1.5, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(13, 2.5, 1, 0);
                }
                if (idx == 13) {
                    let destination = ai.posTransfer(cc.v3(0.5, 0.8));
                    this.shiftToStandby(destination, 1.5, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(2, 2.5, 1, 0);
                }
            });
            entity.setTimer(0, 0, 1, 0);
            entity.setTimer(9, 2, 1, 0);
            return entity;
        },
        solution_20: function (info, skills) {
            //M_R_SB_05
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            var cb = function (actName) {
                if (actName == 'start_2') {
                    entity.setTimer(11, 0, 1, 0);
                }
                else if (actName == 'attack_1') {
                    entity.setTimer(14, 2, 1, 0);
                }
            }
            entity.setTimerHandler(function (idx) {
                if (idx == 0) {
                    ai.setMonsterLoopAction(this, 'start_1')
                    let destination = ai.posTransfer(cc.v3(0.5, 0.72));
                    this.shiftToStandby(destination, 1.5, 30, 0);
                    this.setMovementType(4);
                    this.setDefend(true);
                    this.setTimer(1, 1.5, 1, 0);
                }
                if (idx == 1) {
                    this.setDefend(false);
                    ai.playAction(this, 'daiji_1')
                    this.setTimer(2, 1, 1, 0);
                }
                if (idx == 2) {
                    ai.useSkill(this, 837);
                    this.setTimer(3, 2, 1, 0);
                }
                if (idx == 3) {
                    ai.useSkill(this, 838);
                    this.setTimer(4, 2, 1, 0);
                }
                if (idx == 4) {
                    ai.useSkill(this, 839);
                    this.simpleHarmonic(50, 4, 90, cc.v3(0, 1), cc.v3(0, -30), cc.v3(0, 0), 0)
                    this.setMovementType(5);
                    this.setTimer(5, 3, 1, 0);
                }
                if (idx == 5) {
                    ai.useSkill(this, 843);
                    this.setTimer(6, 1, 1, 0);
                }
                if (idx == 6) {
                    this.simpleHarmonic(200, 8, 90, cc.v3(0, 1), cc.v3(0, 0), cc.v3(0, 0), 0)
                    this.setMovementType(5);
                    this.setTimer(7, 6, 1, 0);
                }
                if (idx == 7) {
                    let destination = ai.posTransfer(cc.v3(0.5, 0.75));
                    this.shiftToStandby(destination, 1.5, 30, 0);
                    this.setMovementType(4);
                    ai.useSkill(this, 841);
                    this.setTimer(8, 2.5, 1, 0);
                }
                if (idx == 8) {
                    ai.useSkill(this, 842);
                    this.setTimer(2, 4, 1, 0);
                }
                if (idx == 9) {
                    let destination = ai.posTransfer(cc.v3(0.5, 0.75));
                    this.shiftToStandby(destination, 1.5, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(10, 1.5, 1, 0);
                }
                if (idx == 10) {
                    ai.setMonsterLoopAction(this, 'daiji_2')
                    ai.playAction(this, 'start_2', 1, cb);
                    this.setDefend(true);
                }
                if (idx == 11) {
                    this.setDefend(false);
                    ai.useSkill(this, 844);
                    this.setTimer(12, 2, 1, 0);
                }
                if (idx == 12) {
                    ai.useSkill(this, 840);
                    this.setTimer(13, 2, 1, 0);
                }
                if (idx == 13) {
                    ai.playAction(this, 'attack_1', 1, cb);
                    ai.useSkill(this, 839);
                }
                if (idx == 14) {
                    ai.useSkill(this, 845);
                    this.setTimer(15, 2, 1, 0);
                }
                if (idx == 15) {
                    let destination = ai.posTransfer(cc.v3(0.3, 0.6));
                    this.shiftToStandby(destination, 1.5, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(16, 1.5, 1, 0);
                }
                if (idx == 16) {
                    ai.useSkill(this, 837);
                    this.setTimer(17, 2, 1, 0);
                }
                if (idx == 17) {
                    let destination = ai.posTransfer(cc.v3(0.7, 0.8));
                    this.shiftToStandby(destination, 1.5, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(18, 1.5, 1, 0);
                }
                if (idx == 18) {
                    ai.playAction(this, 'attack_1', 1, null);
                    ai.useSkill(this, 846);
                    this.setTimer(19, 9, 1, 0);
                }
                if (idx == 19) {
                    let destination = ai.posTransfer(cc.v3(0.5, 0.85));
                    this.shiftToStandby(destination, 1.5, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(20, 1.5, 1, 0);
                }
                if (idx == 20) {
                    ai.useSkill(this, 838);
                    this.setTimer(21, 2, 1, 0);
                }
                if (idx == 21) {
                    let destination = ai.posTransfer(cc.v3(0.5, 0.75));
                    this.shiftToStandby(destination, 1.5, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(22, 1.5, 1, 0);
                }
                if (idx == 22) {
                    ai.useSkill(this, 93);
                    this.setTimer(11, 1, 1, 0);
                }
                if (idx == 23) {
                    let hp = this.getCurHpPer();
                    if (hp < 50) {
                        this.setTimer(9, 0, 1, 0);
                        for (let i = 2; i < 9; i++) {
                            this.delTimer(i);
                        }
                        this.delTimer(23);
                    }
                }
            });
            entity.setTimer(0, 0, 1, 0);
            entity.setTimer(23, 0.016, 9999, 0);
            return entity;
        },
        solution_21: function (info, skills) {
            //M_C_SB_01
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            entity.setCollisionSwitch(false);
            entity.setTimerHandler(function (idx) {
                if (idx == 0) {
                    this.simpleHarmonic(250, 4, 90, cc.v3(1, 0), cc.v3(0, 0), cc.v3(0, 0), 0)
                    this.setMovementType(5);
                    this.runScale(0.9, 2);
                    this.setTimer(1, 2, 1, 0);
                }
                if (idx == 1) {
                    this.setCollisionSwitch(true);
                    let pos = this.getPosition();
                    let circlePos = pos.add(ai.speedTransfer(30, -90))
                    let R = pos.sub(circlePos);
                    this.setEntityAutoCircle(circlePos, R, 90, 0, 0, 0, 0);
                    this.setMovementType(1);
                    this.setTimer(2, 4, 1, 0);
                }
                if (idx == 2) {
                    ai.setMonsterLoopAction(this, 'start');
                    ai.playAction(this, 'attack2');
                    this.setTimer(3, 0.5, 1, 0);
                }
                if (idx == 3) {
                    ai.useSkill(this, 820);
                    this.setTimer(4, 3, 1, 0);
                }
                if (idx == 4) {
                    ai.playAction(this, 'attack2');
                    this.setTimer(5, 1.5, 1, 0);
                }
                if (idx == 5) {
                    ai.useSkill(this, 821);
                    this.setTimer(6, 2, 1, 0);
                }
                if (idx == 6) {
                    let destination = ai.posTransfer(cc.v3(0.5, 0.5));
                    this.shiftToStandby(destination, 1.5, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(7, 2.2, 1, 0);
                }
                if (idx == 7) {
                    ai.playAction(this, 'attack1', 2);
                    ai.useSkill(this, 822);
                    this.setTimer(8, 4, 1, 0);
                }
                if (idx == 8) {
                    let destination = ai.posTransfer(cc.v3(0.5, 0.7));
                    this.shiftToStandby(destination, 1.5, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(9, 1.5, 1, 0);
                }
                if (idx == 9) {
                    this.setTimer(1, 0, 1, 0);
                }
            });
            entity.setTimer(0, 2, 1, 0);
            return entity;
        },
        solution_22: function (info, skills) {
            //M_C_XYLZ
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            entity.opacity = (0);
            entity.setTimerHandler(function (idx) {
                if (idx == 0) {
                    this.setCollisionSwitch(false);
                    ai.setMonsterLoopAction(this, 'start_1');
                    this.runOpacity(255, 2);
                    this.setTimer(1, 2, 1, 0);
                }
                if (idx == 1) {
                    this.setCollisionSwitch(true);
                    ai.playAction(this, 'attack_3');
                    this.setTimer(2, 0, 1, 0);
                }
                if (idx == 2) {
                    ai.useSkill(this, 869);
                    this.setTimer(3, 1, 1, 0);
                }
                if (idx == 3) {
                    let destination = ai.posTransfer(cc.v3(0.8, 0.6));
                    this.shiftToStandby(destination, 1.5, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(4, 1.5, 1, 0);
                }
                if (idx == 4) {
                    ai.playAction(this, 'attack_1');
                    this.setTimer(5, 0, 1, 0);
                }
                if (idx == 5) {
                    ai.useSkill(this, 826);
                    this.setTimer(6, 1, 1, 0);
                }
                if (idx == 6) {
                    let destination = ai.posTransfer(cc.v3(0.2, 0.8));
                    this.shiftToStandby(destination, 1.5, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(7, 1.5, 1, 0);
                }
                if (idx == 7) {
                    ai.playAction(this, 'attack_2');
                    this.setTimer(8, 0.5, 1, 0);
                }
                if (idx == 8) {
                    ai.useSkill(this, 827);
                    this.setTimer(9, 1, 1, 0);
                }
                if (idx == 9) {
                    let destination = ai.posTransfer(cc.v3(0.5, 0.8));
                    this.shiftToStandby(destination, 1.5, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(10, 1.5, 1, 0);
                }
                if (idx == 10) {
                    ai.playAction(this, 'attack_4', 2);
                    this.setTimer(11, 0.7, 1, 0);
                }
                if (idx == 11) {
                    ai.useSkill(this, 825);
                    this.setTimer(1, 4, 1, 0);
                }
            });
            entity.setTimer(0, 0, 1, 0);
            return entity;
        },
        solution_23: function (info, skills) {
            //M_R_B_03
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            entity.setHold(true);
            var cb = function (actName) {
                if (actName == 'bianxing') {
                    entity.setTimer(2, 0, 1, 0);
                }
                if (actName == 'gongji_1_start') {
                    entity.setTimer(10, 0, 1, 0);
                }
                if (actName == 'gongji_1_end') {
                    entity.setTimer(16, 0, 1, 0);
                }
            }
            entity.setTimerHandler(function (idx) {
                if (idx == 0) {
                    this.setDefend(true);
                    let destination = ai.posTransfer(cc.v3(0.5, 0.65));
                    this.shiftToStandby(destination, 4, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(1, 4, 1, 0);
                }
                if (idx == 1) {
                    ai.playAction(this, 'bianxing', 1, cb);
                    this.setTimer(3, 0, 1, 0);
                }
                if (idx == 2) {
                    this.setDefend(false);
                    ai.playAction(this, 'daiji', 0);
                }
                if (idx == 3) {
                    let pos = this.getPosition();
                    let circlePos = pos.add(ai.speedTransfer(30, 90))
                    let R = pos.sub(circlePos);
                    this.setEntityAutoCircle(circlePos, R, 90, 0, 0, 0, 0);
                    this.setMovementType(1);
                    this.setTimer(4, 1, 1, 0);
                }
                if (idx == 4) {
                    ai.useSkill(this, 829);
                    this.setTimer(17, 1, 1, 0);
                }
                if (idx == 17) {
                    ai.useSkill(this, 835);
                    this.setTimer(5, 1, 1, 0);
                }
                if (idx == 5) {
                    ai.useSkill(this, 832)
                    this.simpleHarmonic(250, 8, 90, cc.v3(0, 1), cc.v3(0, 0), cc.v3(0, 0), 0)
                    this.setMovementType(5);
                    this.setTimer(6, 6, 1, 0);
                }
                if (idx == 6) {
                    ai.useSkill(this, 831);
                    this.setTimer(7, 9, 1, 0);
                }
                if (idx == 7) {
                    this.setSpeed(cc.v3(0, 0));
                    this.setMovementType(0);
                    ai.useSkill(this, 833);
                    ai.useSkill(this, 834);
                    this.setTimer(8, 2, 1, 0);
                }
                if (idx == 8) {
                    let destination = ai.posTransfer(cc.v3(0.5, 0.65));
                    this.shiftToStandby(destination, 1.5, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(9, 1.5, 1, 0);
                }
                if (idx == 9) {
                    ai.playAction(this, 'gongji_1_start', 1, cb);
                    this.setDefend(true);
                }
                if (idx == 10) {
                    ai.playAction(this, 'gongji_1_loop', 0);
                    this.setTimer(11, 1, 1, 0);
                }
                if (idx == 11) {
                    ai.useSkill(this, 830);
                    let destination = ai.posTransfer(cc.v3(0.5, 1.4));
                    this.shiftToStandby(destination, 4, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(12, 4, 1, 0);
                }
                if (idx == 12) {
                    this.setShow(false);
                    let hero = ai.getHero();
                    if (hero == null) {
                        this.setPosition(ai.posTransfer(cc.v3(0.5, 1.4)));
                        let destination = ai.posTransfer(cc.v3(0.5, -0.4));
                        this.shiftToStandby(destination, 4, 30, 0);
                        this.setMovementType(4);
                    } else {
                        let HeroPos = hero.getPosition();
                        this.setPosition(ai.posTransfer(cc.v3(HeroPos.x / 640, 1.4)));
                        let destination = ai.posTransfer(cc.v3(HeroPos.x / 640, -0.4));
                        this.shiftToStandby(destination, 4, 30, 0);
                        this.setMovementType(4);
                    }
                    this.setTimer(13, 4, 1, 0);
                }
                if (idx == 13) {
                    this.setShow(false);
                    let hero = ai.getHero();
                    if (hero == null) {
                        this.setBaseAngle(180);
                        this.setPosition(ai.posTransfer(cc.v3(0.5, -0.4)));
                        let destination = ai.posTransfer(cc.v3(0.5, 1.4));
                        this.shiftToStandby(destination, 4, 30, 0);
                        this.setMovementType(4);
                    } else {
                        let HeroPos = hero.getPosition();
                        this.setBaseAngle(180);
                        this.setPosition(ai.posTransfer(cc.v3(HeroPos.x / 640, -0.4)));
                        let destination = ai.posTransfer(cc.v3(HeroPos.x / 640, 1.4));
                        this.shiftToStandby(destination, 4, 30, 0);
                        this.setMovementType(4);
                    }
                    this.setTimer(14, 4, 1, 0);
                }
                if (idx == 14) {
                    this.setShow(false);
                    this.setBaseAngle(0);
                    this.setPosition(ai.posTransfer(cc.v3(0.5, 1.4)));
                    let destination = ai.posTransfer(cc.v3(0.5, 0.65));
                    this.shiftToStandby(destination, 4, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(15, 4, 1, 0);
                }
                if (idx == 15) {
                    ai.playAction(this, 'gongji_1_end', 1, cb);
                }
                if (idx == 16) {
                    this.setDefend(false);
                    ai.playAction(this, 'daiji', 0);
                    this.setTimer(3, 0, 1, 0);
                }
            });
            entity.setTimer(0, 0, 1, 0);
            return entity;
        },
        solution_24: function (info, skills) {
            //sanjiaozhanji
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            var cb = function (actName) {
                if (actName == 'bianxing_1') {
                    entity.setTimer(2, 0, 1, 0);
                }
                if (actName == 'bianxing_2') {
                    entity.setTimer(7, 0, 1, 0);
                }
            }
            entity.opacity = (0);
            entity.setTimerHandler(function (idx) {
                if (idx == 0) {
                    this.setCollisionSwitch(false);
                    this.runOpacity(255, 2);
                    this.setTimer(1, 2, 1, 0);
                }
                if (idx == 1) {
                    ai.playAction(this, 'bianxing_1', 1, cb);
                }
                if (idx == 2) {
                    this.setCollisionSwitch(true);
                    ai.playAction(this, 'putong', 0);
                    this.setTimer(3, 1, 1, 0);
                }
                if (idx == 3) {
                    ai.useSkill(this, 864);
                    this.setTimer(4, 2, 1, 0);
                }
                if (idx == 4) {
                    ai.useSkill(this, 25);
                    this.setTimer(12, 1.5, 1, 0);
                }
                if(idx == 12){
                    ai.useSkill(this, 864);
                    this.setTimer(13, 2, 1, 0);
                }
                if(idx == 13){
                    ai.useSkill(this, 25);
                    this.setTimer(5, 1.5, 1, 0);
                }
                if (idx == 5) {
                    this.runOpacity(0, 1);
                    this.setCollisionSwitch(false);
                    let monsterInfo_1 = {
                        mId: 1471,
                        lv: this.lv,
                        pos: cc.v3(this.getPosition().x / cc.winSize.width, this.getPosition().y / cc.winSize.height),
                    };
                    let monsterInfo_2 = {
                        mId: 1472,
                        lv: this.lv,
                        pos: cc.v3(this.getPosition().x / cc.winSize.width, this.getPosition().y / cc.winSize.height),
                    };
                    MonsterSolutions.solution_34(monsterInfo_1);
                    MonsterSolutions.solution_35(monsterInfo_2);
                    this.setTimer(10, 1, 1, 0)
                }
                if (idx == 10) {
                    this.setActive(false);
                    this.setTimer(11, 5.5, 1, 0);
                }
                if (idx == 11) {
                    this.setActive(true);
                    this.runOpacity(255, 0.5);
                    this.setTimer(6, 1.5, 1, 0);
                }
                if (idx == 6) {
                    this.setCollisionSwitch(true);
                    ai.playAction(this, 'bianxing_2', 1, cb);
                    this.setDefend(true);
                    ai.useSkill(this, 25);
                }
                if (idx == 7) {
                    this.setDefend(false);
                    ai.playAction(this, 'daiji', 0);
                    this.setTimer(8, 2, 1, 0);
                }
                if (idx == 8) {
                    ai.useSkill(this, 868);
                    this.setTimer(9, 2, 1, 0);
                }
                if (idx == 9) {
                    ai.useSkill(this, 865);
                    this.setTimer(1, 1, 1, 0);
                }
            });
            entity.setTimer(0, 0, 1, 0);
            return entity;
        },

        solution_25: function (info, skills) {
            //renzuboss
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            var cb = function (actName) {
                if (actName == 'bianxing') {
                    entity.setTimer(27, 0, 1, 0);
                }
            }
            entity.setTimerHandler(function (idx) {
                if (idx == 0) {
                    this.setDefend(true);
                    let destination = ai.posTransfer(cc.v3(0.5, 0.65));
                    this.shiftToStandby(destination, 1.5, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(1, 1.5, 1, 0);
                }
                if (idx == 1) {
                    this.setDefend(false);
                    ai.playAction(this, 'idle1', 0);
                    this.setTimer(2, 2, 1, 0);
                }
                if (idx == 2) {
                    this.simpleHarmonic(250, 8, 90, cc.v3(0, -1), cc.v3(0, 0), cc.v3(0, 0), 0)
                    this.setMovementType(5);
                    this.setTimer(3, 2, 1, 0);
                }
                if (idx == 3) {
                    ai.useSkill(this, 75);
                    this.setTimer(4, 2, 1, 0);
                }
                if (idx == 4) {
                    let destination = ai.posTransfer(cc.v3(0.5, 0.75));
                    this.shiftToStandby(destination, 1.5, 10, 0);
                    this.setMovementType(4);
                    this.setTimer(5, 1.5, 1, 0);
                }
                if (idx == 5) {
                    ai.useSkill(this, 856);
                    this.simpleHarmonic(250, 2, 90, cc.v3(0, -1), cc.v3(0, 0), cc.v3(0, 0), 0)
                    this.setMovementType(5);
                    this.setTimer(6, 4, 1, 0);
                }
                if (idx == 6) {
                    ai.useSkill(this, 857);
                    this.setTimer(7, 1, 1, 0);
                }
                if (idx == 7) {
                    let destination = ai.posTransfer(cc.v3(0.5, 0.65));
                    this.shiftToStandby(destination, 1.5, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(8, 1.5, 1, 0);
                }
                if (idx == 8) {
                    ai.useSkill(this, 858);
                    this.setTimer(9, 2, 1, 0);
                }
                if (idx == 9) {
                    let destination = ai.posTransfer(cc.v3(0.5, 0.75));
                    this.shiftToStandby(destination, 1.5, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(10, 2, 1, 0);
                }
                if (idx == 10) {
                    ai.useSkill(this, 859);
                    this.setTimer(11, 1, 1, 0);
                }
                if (idx == 11) {
                    let destination = ai.posTransfer(cc.v3(0.25, 0.65));
                    this.shiftToStandby(destination, 1.5, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(12, 1.5, 1, 0);
                }
                if (idx == 12) {
                    ai.useSkill(this, 33);
                    ai.useSkill(this, 28);
                    let pos = this.getPosition();
                    let circlePos = pos.add(ai.speedTransfer(20, 90))
                    let R = pos.sub(circlePos);
                    this.setEntityAutoCircle(circlePos, R, 90, 0, 0, 0, 0);
                    this.setMovementType(1);
                    this.setTimer(13, 1, 1, 0);
                }
                if (idx == 13) {
                    let destination = ai.posTransfer(cc.v3(0.75, 0.65));
                    this.shiftToStandby(destination, 1.5, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(14, 1.5, 1, 0);
                }
                if (idx == 14) {
                    ai.useSkill(this, 43);
                    this.simpleHarmonic(50, 2, 90, cc.v3(0, -1), cc.v3(0, 0), cc.v3(0, 0), 0)
                    this.setMovementType(5);
                    this.setTimer(15, 1, 1, 0);
                }
                if (idx == 15) {
                    let destination = ai.posTransfer(cc.v3(0.25, 0.6));
                    this.shiftToStandby(destination, 1.5, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(16, 1.5, 1, 0);
                }
                if (idx == 16) {
                    ai.useSkill(this, 33);
                    ai.useSkill(this, 28);
                    let pos = this.getPosition();
                    let circlePos = pos.add(ai.speedTransfer(20, 90))
                    let R = pos.sub(circlePos);
                    this.setEntityAutoCircle(circlePos, R, 90, 0, 0, 0, 0);
                    this.setMovementType(1);
                    this.setTimer(17, 1, 1, 0);
                }
                if (idx == 17) {
                    let destination = ai.posTransfer(cc.v3(0.75, 0.7));
                    this.shiftToStandby(destination, 1.5, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(18, 1.5, 1, 0);
                }
                if (idx == 18) {
                    ai.useSkill(this, 53);
                    this.simpleHarmonic(50, 2, 90, cc.v3(0, -1), cc.v3(0, 0), cc.v3(0, 0), 0)
                    this.setMovementType(5);
                    this.setTimer(19, 1, 1, 0);
                }
                if (idx == 19) {
                    let destination = ai.posTransfer(cc.v3(0.5, 0.65));
                    this.shiftToStandby(destination, 1.5, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(20, 1.5, 1, 0);
                }
                if (idx == 20) {
                    ai.useSkill(this, 75);
                    this.simpleHarmonic(50, 2, 90, cc.v3(0, -1), cc.v3(0, 0), cc.v3(0, 0), 0)
                    this.setMovementType(5);
                    this.setTimer(21, 2, 1, 0);
                }
                if (idx == 21) {
                    ai.useSkill(this, 856);
                    this.setTimer(22, 4, 1, 0);
                }
                if (idx == 22) {
                    ai.useSkill(this, 855);
                    this.setTimer(23, 2, 1, 0);
                }
                if (idx == 23) {
                    ai.useSkill(this, 43);
                    this.setTimer(2, 4, 1, 0);
                }
                if (idx == 24) {
                    let hp = this.getCurHpPer();
                    if (hp < 50) {
                        this.setTimer(25, 0, 1, 0);
                        this.delTimer(24);
                        for (let i = 2; i < 24; i++) {
                            this.delTimer(i);
                        }
                    }
                }
                if (idx == 25) {
                    this.setDefend(true);
                    let destination = ai.posTransfer(cc.v3(0.5, 0.65));
                    this.shiftToStandby(destination, 3, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(26, 4, 1, 0);
                }
                if (idx == 26) {
                    ai.setMonsterLoopAction(this,'idle2');
                    ai.playAction(this, 'bianxing', 1, cb);
                    this.setDefend(true);
                }
                if (idx == 27) {
                    //ai.playAction(this, 'idle2', 0);
                    this.setDefend(false);
                    ai.useSkill(this, 857);
                    this.simpleHarmonic(250, 4, 90, cc.v3(0, -1), cc.v3(0, 0), cc.v3(0, 0), 0)
                    this.setMovementType(5);
                    this.setTimer(28, 1.5, 1, 0);
                }
                if (idx == 28) {
                    this.setSpeed(cc.v3(0, 0));
                    this.setMovementType(0);
                    this.setTimer(29, 1, 1, 0);
                }
                if (idx == 29) {
                    ai.playAction(this, 'attack');
                    ai.useSkill(this, 31);
                    let destination = ai.posTransfer(cc.v3(0.4, 0.65));
                    this.shiftToStandby(destination, 1.5, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(30, 1.5, 1, 0);
                }
                if (idx == 30) {
                    let destination = ai.posTransfer(cc.v3(0.6, 0.55));
                    this.shiftToStandby(destination, 1.5, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(31, 1.5, 1, 0);
                }
                if (idx == 31) {
                    let destination = ai.posTransfer(cc.v3(0.8, 0.75));
                    this.shiftToStandby(destination, 1.5, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(32, 1.5, 1, 0);
                }
                if (idx == 32) {
                    ai.useSkill(this, 859);
                    let destination = ai.posTransfer(cc.v3(0.5, 0.65));
                    this.shiftToStandby(destination, 1.5, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(33, 1.5, 1, 0);
                }
                if (idx == 33) {
                    let pos = this.getPosition();
                    let circlePos = pos.add(ai.speedTransfer(30, 90))
                    let R = pos.sub(circlePos);
                    this.setEntityAutoCircle(circlePos, R, 90, 0, 0, 0, 0);
                    this.setMovementType(1);
                    this.setTimer(34, 1, 1, 0);
                }
                if (idx == 34) {
                    ai.useSkill(this, 39);
                    this.setTimer(35, 5, 1, 0);
                }
                if (idx == 35) {
                    let destination = ai.posTransfer(cc.v3(0.5, 0.75));
                    this.shiftToStandby(destination, 1.5, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(36, 1.5, 1, 0);
                }
                if (idx == 36) {
                    ai.useSkill(this, 861);
                    ai.playAction(this, 'attack');
                    let destination = ai.posTransfer(cc.v3(0.5, 0.65));
                    this.shiftToStandby(destination, 1.5, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(37, 1.5, 1, 0);
                }
                if (idx == 37) {
                    ai.useSkill(this, 862);
                    this.setTimer(38, 1, 1, 0);
                }
                if (idx == 38) {
                    this.simpleHarmonic(250, 8, 90, cc.v3(0, -1), cc.v3(0, 0), cc.v3(0, 0), 0)
                    this.setMovementType(5);
                    this.setTimer(39, 2, 1, 0);
                }
                if (idx == 39) {
                    ai.useSkill(this, 856);
                    this.setTimer(28, 4, 1, 0);
                }
            });
            entity.setTimer(0, 0, 1, 0);
            entity.setTimer(24, 0.016, 9999, 1);
            return entity;
        },
        solution_26: function (info, skills) {
            //M_R_SB_07
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            var cb = function (actName) {
                if (actName == 'bianxing_2') {
                    entity.setTimer(17, 0, 1, 0);
                }
            }
            entity.setTimerHandler(function (idx) {
                if (idx == 0) {
                    this.setDefend(true);
                    let destination = ai.posTransfer(cc.v3(0.5, 0.64));
                    this.shiftToStandby(destination, 3, 50, 0);
                    this.setMovementType(4);
                    this.setTimer(1, 3, 1, 0);
                }
                if (idx == 1) {
                    this.setDefend(false);
                    this.setTimer(28, 4, 9999, 1);
                }
                if (idx == 28) {
                    ai.useSkill(this, 801);
                }
                if (idx == 2) {
                    let hp = this.getCurHpPer();
                    if (hp < 80) {
                        this.setTimer(3, 0, 1, 0);
                        this.delTimer(2);
                        this.delTimer(28);
                    }
                }
                if (idx == 3) {
                    this.setDefend(true);
                    let destination = ai.posTransfer(cc.v3(0.5, 0.7));
                    this.shiftToStandby(destination, 1.5, 50, 0);
                    this.setMovementType(4);
                    this.setTimer(4, 1.5, 1, 0);
                }
                if (idx == 4) {
                    this.setDefend(false);
                    this.setTimer(5, 1, 1, 0);
                }
                if (idx == 5) {
                    let destination = ai.posTransfer(cc.v3(0.3, 0.75));
                    this.shiftToStandby(destination, 1.5, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(6, 1.5, 1, 0);
                }
                if (idx == 6) {
                    let pos = this.getPosition();
                    let circlePos = pos.add(ai.speedTransfer(15, 90))
                    let R = pos.sub(circlePos);
                    this.setEntityAutoCircle(circlePos, R, 90, 0, 0, 0, 0);
                    this.setMovementType(1);
                    ai.useSkill(this, 801);
                    ai.useSkill(this, 802);
                    this.setTimer(7, 4, 1, 0);
                }
                if (idx == 7) {
                    let destination = ai.posTransfer(cc.v3(0.5, 0.65));
                    this.shiftToStandby(destination, 1.5, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(8, 1.5, 1, 0);
                }
                if (idx == 8) {
                    let pos = this.getPosition();
                    let circlePos = pos.add(ai.speedTransfer(15, 90))
                    let R = pos.sub(circlePos);
                    this.setEntityAutoCircle(circlePos, R, 90, 0, 0, 0, 0);
                    this.setMovementType(1);
                    ai.useSkill(this, 802);
                    this.setTimer(9, 4, 1, 0);
                }
                if (idx == 9) {
                    let destination = ai.posTransfer(cc.v3(0.7, 0.75));
                    this.shiftToStandby(destination, 1.5, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(10, 1.5, 1, 0);
                }
                if (idx == 10) {
                    let pos = this.getPosition();
                    let circlePos = pos.add(ai.speedTransfer(15, 90))
                    let R = pos.sub(circlePos);
                    this.setEntityAutoCircle(circlePos, R, 90, 0, 0, 0, 0);
                    this.setMovementType(1);
                    ai.useSkill(this, 803);
                    this.setTimer(11, 3, 1, 0);
                }
                if (idx == 11) {
                    let destination = ai.posTransfer(cc.v3(0.5, 0.8));
                    this.shiftToStandby(destination, 1.5, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(12, 1.5, 1, 0);
                }
                if (idx == 12) {
                    let pos = this.getPosition();
                    let circlePos = pos.add(ai.speedTransfer(15, 90))
                    let R = pos.sub(circlePos);
                    this.setEntityAutoCircle(circlePos, R, 90, 0, 0, 0, 0);
                    this.setMovementType(1);
                    this.setTimer(13, 3, 2, 0);
                    this.setTimer(5, 7, 1, 0);
                }
                if (idx == 13) {
                    ai.useSkill(this, 803);
                }
                if (idx == 14) {
                    let hp = this.getCurHpPer();
                    if (hp < 50) {
                        this.setTimer(15, 0, 1, 0);
                        this.delTimer(14);
                        for (let i = 3; i < 14; i++) {
                            this.delTimer(i);
                        }
                    }
                }
                if (idx == 15) {
                    this.setDefend(true);
                    let destination = ai.posTransfer(cc.v3(0.5, 0.65));
                    this.shiftToStandby(destination, 1.5, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(16, 1.5, 1, 0);
                }
                if (idx == 16) {
                    ai.playAction(this, 'bianxing_2', 1, cb);
                }
                if (idx == 17) {
                    this.setDefend(false);
                    ai.playAction(this, 'idle_3', 0);
                    this.setTimer(18, 3, 1, 0);
                }
                if (idx == 18) {
                    ai.useSkill(this, 804);
                    this.setTimer(19, 7, 1, 0);
                }
                if (idx == 19) {
                    ai.useSkill(this, 805)
                    this.setTimer(22, 0, 1, 0);
                    this.setTimer(20, 5, 1, 0);
                }
                if (idx == 20) {
                    ai.useSkill(this, 806);
                    this.setTimer(21, 2, 1, 0);
                }
                if (idx == 21) {
                    ai.useSkill(this, 807);
                    this.setTimer(18, 4, 1, 0);
                }
                if (idx == 22) {
                    let pos = this.getPosition();
                    let circlePos = pos.add(ai.speedTransfer(30, 90))
                    let R = pos.sub(circlePos);
                    this.setEntityAutoCircle(circlePos, R, 90, 0, 0, 0, 0);
                    this.setMovementType(1);
                }
                if (idx == 23) {
                    let hp = this.getCurHpPer();
                    if (hp < 20) {
                        this.setTimer(24, 0, 1, 0);
                        this.delTimer(23);
                        for (let i = 15; i < 23; i++) {
                            this.delTimer(i);
                        }
                    }
                }
                if (idx == 24) {
                    this.setDefend(true);
                    let destination = ai.posTransfer(cc.v3(0.5, 0.65));
                    this.shiftToStandby(destination, 1, 5, 0);
                    this.setMovementType(4);
                    this.setTimer(25, 1.5, 1, 0);
                }
                if (idx == 25) {
                    ai.playAction(this, 'idle_2', 0);
                    this.setDefend(false);
                    this.runScale(0.5, 0.5);
                    let destination = ai.posTransfer(cc.v3(cc.v3(0.2 + 0.6 * Math.random(), 0.5 + 0.3 * Math.random())));
                    this.shiftToStandby(destination, 1, 5, 0);
                    this.setMovementType(4);
                    this.setTimer(26, 1, 9999, 0);
                    this.setTimer(27, 3.5, 1, 0);
                }
                if (idx == 26) {
                    let destination = ai.posTransfer(cc.v3(cc.v3(0.2 + 0.6 * Math.random(), 0.5 + 0.3 * Math.random())));
                    this.shiftToStandby(destination, 1, 5, 0);
                    this.setMovementType(4);
                }
                if (idx == 27) {
                    ai.useSkill(this, 808);
                }
            });
            entity.setTimer(0, 0, 1, 0);
            entity.setTimer(2, 0.016, 9999, 1);
            entity.setTimer(14, 0.016, 9999, 1);
            entity.setTimer(23, 0.016, 9999, 1);
            return entity;
        },
        solution_27: function (info, skills) {
            //M_C_J_D_01
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            entity.opacity = (0);
            entity.setTimerHandler(function (idx) {
                if (idx == 0) {
                    ai.setMonsterLoopAction(this, 'start');
                    this.runOpacity(255, 2);
                    this.setCollisionSwitch(false);
                    this.setTimer(1, 2, 1, 0);
                }
                if (idx == 1) {
                    this.setCollisionSwitch(true);
                    this.setTimer(2, 1, 1, 0);
                }
                if (idx == 2) {
                    this.setTimer(3, 0.8, 3, 1);
                    this.setTimer(4, 4, 1, 0);
                }
                if (idx == 3) {
                    ai.useSkill(this, 814);
                }
                if (idx == 4) {
                    this.setTimer(5, 0.5, 4, 1);
                    this.setTimer(6, 1, 1, 1);
                }
                if (idx == 5) {
                    ai.useSkill(this, 815);
                }
                if (idx == 6) {
                    ai.useSkill(this, 816);
                    ai.playAction(this, 'attack');
                    this.setTimer(7, 4, 1, 0);
                }
                if (idx == 7) {
                    this.setTimer(8, 1, 3, 1);
                    this.setTimer(9, 4, 1, 0);
                }
                if (idx == 8) {
                    ai.useSkill(this, 817);
                }
                if (idx == 9) {
                    this.setTimer(10, 0.5, 4, 1);
                    this.setTimer(11, 4, 1, 0);
                }
                if (idx == 10) {
                    ai.useSkill(this, 815);
                }
                if (idx == 11) {
                    ai.useSkill(this, 816);
                    ai.playAction(this, 'attack');
                    this.setTimer(2, 4, 1, 0);
                }
            });
            entity.setTimer(0, 0, 1, 0);
            return entity;
        },
        solution_28: function (info, skills) {
            //zhishenfeiji
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            var cb = function (actName) {
                if (actName == 'bianxing') {
                    entity.setTimer(2, 0, 1, 0);
                }
            }
            entity.setTimerHandler(function (idx) {
                if (idx == 0) {
                    this.setDefend(true);
                    let destination = ai.posTransfer(cc.v3(0.5, 0.7));
                    this.shiftToStandby(destination, 1.5, 0, 0);
                    this.setMovementType(4);
                    this.setTimer(1, 1.5, 1, 0);
                }
                if (idx == 1) {
                    ai.playAction(this, 'bianxing', 1, cb);
                }
                if (idx == 2) {
                    this.setDefend(false);
                    ai.playAction(this, 'idle', 0);
                    let destination = ai.posTransfer(cc.v3(0.2, 0.7));
                    this.shiftToStandby(destination, 3, 0, 0);
                    this.setMovementType(4);
                    this.setTimer(3, 4, 1, 0);
                    this.setTimer(10, 3, 1, 0);
                }
                if (idx == 3) {
                    let destination = ai.posTransfer(cc.v3(0.4, 0.7));
                    this.shiftToStandby(destination, 2.5, 0, 0);
                    this.setMovementType(4);
                    this.setTimer(4, 3.5, 1, 0);
                }
                if (idx == 4) {
                    let destination = ai.posTransfer(cc.v3(0.8, 0.7));
                    this.shiftToStandby(destination, 4, 0, 0);
                    this.setMovementType(4);
                    this.setTimer(5, 5, 1, 0);
                }
                if (idx == 5) {
                    let destination = ai.posTransfer(cc.v3(0.9, 0.7));
                    this.shiftToStandby(destination, 1, 0, 0);
                    this.setMovementType(4);
                    this.setTimer(6, 1, 1, 0);
                }
                if (idx == 6) {
                    let destination = ai.posTransfer(cc.v3(0.75, 0.7));
                    this.shiftToStandby(destination, 1.5, 0, 0);
                    this.setMovementType(4);
                    this.setTimer(7, 2.5, 1, 0);
                }
                if (idx == 7) {
                    let destination = ai.posTransfer(cc.v3(0.25, 0.7));
                    this.shiftToStandby(destination, 4, 0, 0);
                    this.setMovementType(4);
                    this.setTimer(8, 5, 1, 0);
                }
                if (idx == 8) {
                    let destination = ai.posTransfer(cc.v3(0.1, 0.7));
                    this.shiftToStandby(destination, 1.5, 0, 0);
                    this.setMovementType(4);
                    this.setTimer(9, 1.5, 1, 0);
                }
                if (idx == 9) {
                    let destination = ai.posTransfer(cc.v3(0.2, 0.7));
                    this.shiftToStandby(destination, 1, 0, 0);
                    this.setMovementType(4);
                    this.setTimer(3, 2, 1, 0);
                }
                if (idx == 10) {
                    ai.autoUseSkill(this, true);
                }
            });
            entity.setTimer(0, 0, 1, 0);
            return entity;
        },
        solution_29: function (info, skills) {
            //M_C_M_03
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            var cb = function (actName) {
                if (actName == 'attack') {
                    entity.setTimer(2, 0, 1, 0);
                }
            }
            let num = 0;
            entity.setTimerHandler(function (idx) {
                if (idx == 0) {
                    this.setDefend(true);
                    ai.setMonsterLoopAction(this, 'start');
                    let destination = ai.posTransfer(cc.v3(0.5, 0.72));
                    this.shiftToStandby(destination, 1, 15, 0);
                    this.setMovementType(4);
                    this.setTimer(1, 1, 1, 0);
                }
                if (idx == 1) {
                    this.setDefend(false);
                    ai.playAction(this, 'attack', 1, cb);
                }
                if (idx == 2) {
                    ai.useSkill(this, 21);
                    this.setTimer(3, 2, 1, 0);
                }
                if (idx == 3) {
                    ai.useSkill(this, 31);
                    this.setTimer(4, 2, 1, 0);
                }
                if (idx == 4) {
                    ai.playAction(this, 'attack');
                    ai.useSkill(this, 41);
                    ai.useSkill(this, 51);
                    this.setTimer(5, 2, 1, 0);
                }
                if (idx == 5) {
                    ai.useSkill(this, 21);
                    this.setTimer(6, 2, 1, 0);
                }
                if (idx == 6) {
                    ai.useSkill(this, 61);
                    this.setTimer(7, 2, 1, 0);
                }
                if (idx == 7) {
                    num += 1;
                    if (num % 2 == 0) {
                        let destination = ai.posTransfer(cc.v3(0.25, 0.75));
                        this.shiftToStandby(destination, 2.5, 0, 0);
                        this.setMovementType(4);
                        this.setTimer(10, 2.5, 1, 0);
                    }
                    else {
                        let destination = ai.posTransfer(cc.v3(0.75, 0.75));
                        this.shiftToStandby(destination, 2.5, 0, 0);
                        this.setMovementType(4);
                        this.setTimer(8, 2.5, 1, 0);
                    }
                }
                if (idx == 8) {
                    ai.useSkill(this, 31);
                    ai.useSkill(this, 41);
                    this.setTimer(9, 2, 1, 0);
                }
                if (idx == 9) {
                    let destination = ai.posTransfer(cc.v3(0.9, 0.75));
                    this.shiftToStandby(destination, 2, 0, 0);
                    this.setMovementType(4);
                    this.setTimer(12, 1, 1, 0);
                }
                if (idx == 10) {
                    ai.useSkill(this, 31);
                    ai.useSkill(this, 41);
                    this.setTimer(11, 2, 1, 0);
                }
                if (idx == 11) {
                    let destination = ai.posTransfer(cc.v3(0.1, 0.75));
                    this.shiftToStandby(destination, 2, 0, 0);
                    this.setMovementType(4);
                    this.setTimer(12, 1, 1, 0);
                }
                if (idx == 12) {
                    let destination = ai.posTransfer(cc.v3(0.5, 0.75));
                    this.shiftToStandby(destination, 1, 15, 0);
                    this.setMovementType(4);
                    this.setTimer(1, 1, 1, 0);
                }
            });
            entity.setTimer(0, 0, 1, 0);
            return entity;
        },
        solution_30: function (info, skills) {
            //M_C_RMGY
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            entity.setTimerHandler(function (idx) {
                if (idx == 0) {
                    ai.setMonsterLoopAction(this,'start_1');
                    this.setDefend(true);
                    let destination = ai.posTransfer(cc.v3(0.5, 0.734));
                    this.shiftToStandby(destination, 1.5, 15, 0);
                    this.setMovementType(4);
                    this.setTimer(1, 1.5, 1, 0);
                }
                if (idx == 1) {
                    this.setDefend(false);
                    let pos = this.getPosition();
                    let circlePos = pos.add(ai.speedTransfer(30, 90))
                    let R = pos.sub(circlePos);
                    this.setEntityAutoCircle(circlePos, R, 90, 0, 0, 0, 0);
                    this.setMovementType(1);
                    this.setTimer(2, 1, 1, 0);
                }
                if (idx == 2) {
                    ai.playAction(this, 'attack_2');
                    ai.useSkill(this, 818);
                    this.setTimer(3, 2, 1, 0);
                }
                if (idx == 3) {
                    ai.playAction(this, 'attack_1');
                    ai.useSkill(this, 819)
                    this.setTimer(2, 3, 1, 0);
                }
            });
            entity.setTimer(0, 0, 1, 0);
            return entity;
        },
        solution_31: function (info, skills) {
            //M_R_SB_01
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            entity.setHold(true);
            let n = 0;
            let num = 0;
            entity.ctrlValue[0] = 876;
            entity.ctrlValue[1] = 874;
            entity.ctrlValue[2] = 875;
            var cb = function (actName) {
                if (actName == 'bianxing_1') {
                    entity.setTimer(2, 0, 1, 0);
                }
                if (actName == 'bianxing_2') {
                    entity.setTimer(19, 0, 1, 0);
                }
                if (actName == 'gongji_2_end') {
                    entity.setTimer(33, 0, 1, 0);
                }
                if (actName == 'bianxing_3') {
                    entity.setTimer(41, 0, 1, 0);
                }
            }
            entity.setTimerHandler(function (idx) {
                if (idx == 0) {
                    this.setDefend(true);
                    let destination = ai.posTransfer(cc.v3(0.5, 0.75));
                    this.shiftToStandby(destination, 3, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(1, 3, 1, 0);
                }
                if (idx == 1) {
                    ai.setMonsterLoopAction(this, 'daiji_01');
                    ai.playAction(this, 'bianxing_1', 1, cb);
                }
                if (idx == 2) {
                    //ai.playAction(this, 'daiji_01', 0);
                    this.setTimer(3, 1, 1, 0);
                }
                if (idx == 3) {
                    this.setDefend(false);
                    let destination = ai.posTransfer(cc.v3(0.25, 0.8));
                    this.shiftToStandby(destination, 1.5, 15, 0);
                    this.setMovementType(4);
                    this.setTimer(4, 1.5, 1, 0);
                }
                if (idx == 4) {
                    ai.useSkill(this, 870);
                    let pos = this.getPosition();
                    let circlePos = pos.add(ai.speedTransfer(15, 90))
                    let R = pos.sub(circlePos);
                    this.setEntityAutoCircle(circlePos, R, 90, 0, 0, 0, 0);
                    this.setMovementType(1);
                    this.setTimer(5, 2, 1, 0);
                }
                if (idx == 5) {
                    let destination = ai.posTransfer(cc.v3(0.75, 0.7));
                    this.shiftToStandby(destination, 1.5, 15, 0);
                    this.setMovementType(4);
                    this.setTimer(6, 1.5, 1, 0);
                }
                if (idx == 6) {
                    let pos = this.getPosition();
                    let circlePos = pos.add(ai.speedTransfer(15, 90))
                    let R = pos.sub(circlePos);
                    this.setEntityAutoCircle(circlePos, R, 90, 0, 0, 0, 0);
                    this.setMovementType(1);
                    this.setTimer(7, 0.5, 3, 1);
                    this.setTimer(8, 2, 1, 0);
                }
                if (idx == 7) {
                    ai.useSkill(this, 871);
                }
                if (idx == 8) {
                    let destination = ai.posTransfer(cc.v3(0.25, 0.65));
                    this.shiftToStandby(destination, 1.5, 15, 0);
                    this.setMovementType(4);
                    this.setTimer(9, 1.5, 1, 0);
                }
                if (idx == 9) {
                    ai.useSkill(this, 870);
                    let pos = this.getPosition();
                    let circlePos = pos.add(ai.speedTransfer(15, 90))
                    let R = pos.sub(circlePos);
                    this.setEntityAutoCircle(circlePos, R, 90, 0, 0, 0, 0);
                    this.setMovementType(1);
                    this.setTimer(10, 2, 1, 0);
                }
                if (idx == 10) {
                    let destination = ai.posTransfer(cc.v3(0.75, 0.8));
                    this.shiftToStandby(destination, 1.5, 15, 0);
                    this.setMovementType(4);
                    this.setTimer(11, 1.5, 1, 0);
                }
                if (idx == 11) {
                    let pos = this.getPosition();
                    let circlePos = pos.add(ai.speedTransfer(15, 90))
                    let R = pos.sub(circlePos);
                    this.setEntityAutoCircle(circlePos, R, 90, 0, 0, 0, 0);
                    this.setMovementType(1);
                    this.setTimer(12, 0.5, 3, 1);
                    this.setTimer(13, 2, 1, 0);
                }
                if (idx == 12) {
                    ai.useSkill(this, 871);
                }
                if (idx == 13) {
                    let destination = ai.posTransfer(cc.v3(0.5, 0.7));
                    this.shiftToStandby(destination, 1.5, 15, 0);
                    this.setMovementType(4);
                    this.setTimer(14, 1.5, 1, 0);
                }
                if (idx == 14) {
                    ai.useSkill(this, 872);
                    let pos = this.getPosition();
                    let circlePos = pos.add(ai.speedTransfer(60, 90))
                    let R = pos.sub(circlePos);
                    this.setEntityAutoCircle(circlePos, R, 90, 0, 0, 0, 0);
                    this.setMovementType(1);
                    this.setTimer(15, 3, 1, 0);
                }
                if (idx == 15) {
                    ai.useSkill(this, 873);
                    this.setTimer(3, 2, 1, 0);
                }
                if (idx == 16) {
                    let hp = this.getCurHpPer();
                    if (hp < 70) {
                        this.setTimer(17, 0, 1, 0);
                        this.delTimer(16);
                        for (let i = 3; i < 16; i++) {
                            this.delTimer(i);
                        }
                    }
                }
                if (idx == 17) {
                    this.setDefend(true);
                    let destination = ai.posTransfer(cc.v3(0.5, 0.7));
                    this.shiftToStandby(destination, 1.5, 15, 0);
                    this.setMovementType(4);
                    this.setTimer(18, 1.5, 1, 0);
                }
                if (idx == 18) {
                    ai.setMonsterLoopAction(this, 'daiji_02');
                    ai.playAction(this, 'bianxing_2', 1, cb);
                }
                if (idx == 19) {
                    //ai.playAction(this, 'daiji_02', 0);
                    this.setDefend(false);
                    let destination = ai.posTransfer(cc.v3(0.25, 0.75));
                    this.shiftToStandby(destination, 1.5, 15, 0);
                    this.setMovementType(4);
                    this.setTimer(21, 1.5, 1, 0);
                }
                if (idx == 21) {
                    ai.useSkill(this, 874);
                    let pos = this.getPosition();
                    let circlePos = pos.add(ai.speedTransfer(15, 90));
                    let R = pos.sub(circlePos);
                    this.setEntityAutoCircle(circlePos, R, 90, 0, 0, 0, 0);
                    this.setMovementType(1);
                    this.setTimer(22, 2, 1, 0);
                }
                if (idx == 22) {
                    ai.useSkill(this, 875);
                    let destination = ai.posTransfer(cc.v3(0.6, 0.75));
                    this.shiftToStandby(destination, 1.5, 15, 0);
                    this.setMovementType(4);
                    this.setTimer(23, 1.5, 1, 0);
                }
                if (idx == 23) {
                    ai.useSkill(this, 876);
                    let pos = this.getPosition();
                    let circlePos = pos.add(ai.speedTransfer(15, 90));
                    let R = pos.sub(circlePos);
                    this.setEntityAutoCircle(circlePos, R, 90, 0, 0, 0, 0);
                    this.setMovementType(1);
                    this.setTimer(24, 2, 1, 0);
                }
                if (idx == 24) {
                    let destination = ai.posTransfer(cc.v3(0.4, 0.7));
                    this.shiftToStandby(destination, 1.5, 15, 0);
                    this.setMovementType(4);
                    this.setTimer(25, 1.5, 1, 0);
                }
                if (idx == 25) {
                    ai.useSkill(this, 876);
                    let pos = this.getPosition();
                    let circlePos = pos.add(ai.speedTransfer(15, 90));
                    let R = pos.sub(circlePos);
                    this.setEntityAutoCircle(circlePos, R, 90, 0, 0, 0, 0);
                    this.setMovementType(1);
                    this.setTimer(26, 2, 1, 0);
                }
                if (idx == 26) {
                    let destination = ai.posTransfer(cc.v3(0.5, 0.75));
                    this.shiftToStandby(destination, 4, 15, 0);
                    this.setMovementType(4);
                    this.setTimer(27, 4.5, 1, 0);
                }
                if (idx == 27) {
                    this.simpleHarmonic(100, 2, 90, cc.v3(1, 0), cc.v3(0, 0), cc.v3(0, 0), 0)
                    this.setMovementType(5);
                    this.setTimer(28, 0.5, 1, 0);
                }
                if (idx == 28) {
                    ai.playAction(this, 'gongji_2_start', 0);
                    ai.useSkill(this, 877);
                    this.setTimer(29, 1, 1, 0);
                }
                if (idx == 29) {
                    ai.useSkill(this, 878);
                    this.setTimer(30, 1, 1, 0);
                }
                if (idx == 30) {
                    ai.useSkill(this, 877);
                    this.setTimer(31, 2, 1, 0);
                }
                if (idx == 31) {
                    let destination = ai.posTransfer(cc.v3(0.5, 0.75));
                    this.shiftToStandby(destination, 1, 0, 0);
                    this.setMovementType(4);
                    this.setTimer(32, 1, 1, 0);
                }
                if (idx == 32) {
                    ai.playAction(this, 'gongji_2_end', 1, cb);
                }
                if (idx == 33) {
                    //ai.playAction(this, 'daiji_02', 0);
                    ai.useSkill(this, 879);
                    ai.useSkill(this, 880)
                    this.setEntitySelfCircle(6, 0);
                    let destination = ai.posTransfer(cc.v3(0.5, 0.8));
                    this.shiftToStandby(destination, 3, 0, 0);
                    this.setMovementType(4);
                    this.setTimer(34, 4, 1, 0);
                }
                if (idx == 34) {
                    this.resetEntitySelfCircle();
                    this.setBaseAngle(0);
                    ai.useSkill(this, 881);
                    ai.useSkill(this, 882);
                    this.setTimer(35, 1, 1, 0);
                }
                if (idx == 35) {
                    let destination = ai.posTransfer(cc.v3(0.5, 0.75));
                    this.shiftToStandby(destination, 3, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(36, 3, 1, 0);
                }
                if (idx == 36) {
                    ai.useSkill(this, 883);
                    this.setTimer(37, 5, 1, 0);
                }
                if (idx == 37) {
                    ai.useSkill(this, 884);
                    let pos = this.getPosition();
                    let circlePos = pos.add(ai.speedTransfer(50, 90));
                    let R = pos.sub(circlePos);
                    this.setEntityAutoCircle(circlePos, R, 90, 0, 0, 0, 0);
                    this.setMovementType(1);
                    this.setTimer(19, 5, 1, 0);
                }
                if (idx == 38) {
                    let hp = this.getCurHpPer();
                    if (hp < 30) {
                        this.setTimer(39, 0, 1, 0);
                        this.delTimer(38);
                        this.delTimer(19);
                        for (let i = 21; i < 38; i++) {
                            this.delTimer(i);
                        }
                    }
                }
                if (idx == 39) {
                    this.setDefend(true);
                    this.resetEntitySelfCircle();
                    this.setBaseAngle(0);
                    let destination = ai.posTransfer(cc.v3(0.5, 0.75));
                    this.shiftToStandby(destination, 1.5, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(40, 1.5, 1, 0);
                }
                if (idx == 40) {
                    ai.setMonsterLoopAction(this, 'daiji_03');
                    ai.playAction(this, 'bianxing_3', 1, cb);
                }
                if (idx == 41) {
                    //ai.playAction(this, 'daiji_03', 0);
                    this.setDefend(false);
                    this.setTimer(42, 2, 1, 0);
                }
                if (idx == 42) {
                    let pos = this.getPosition();
                    let circlePos = pos.add(ai.speedTransfer(50, 90));
                    let R = pos.sub(circlePos);
                    this.setEntityAutoCircle(circlePos, R, 90, 0, 0, 0, 0);
                    this.setMovementType(1);
                    this.setTimer(43, 1.5, 3, 0);
                    this.setTimer(44, 5, 1, 0);
                }
                if (idx == 43) {
                    ai.useSkill(this, this.ctrlValue[n]);
                    n += 1;
                    if (n > 2) {
                        n = 0;
                    }
                }
                if (idx == 44) {
                    this.setTimer(45, 1, 4, 0);
                    this.setTimer(20, 5, 1, 0);
                    this.setTimer(48, 11, 1, 0);
                }
                if (idx == 45) {
                    this.setSpeed(cc.v3(0, 0));
                    this.setMovementType(0);
                    this.setPosition(ai.posTransfer(cc.v3(0.25 + 0.5 * Math.random(), 0.5 + 0.3 * Math.random())));
                    ai.useSkill(this, 885);
                    ai.useSkill(this, 886);
                    this.opacity = (255);
                    this.runOpacity(0, 1);
                }
                if (idx == 20) {
                    this.setTimer(46, 3, 2, 1);
                }
                if (idx == 46) {
                    this.setShow(false);
                    this.opacity = (255);
                    ai.playAction(this, 'gongji_3_loop', 0);
                    num += 1;
                    if (num % 2 !== 0) {
                        this.setPosition(ai.posTransfer(cc.v3(-0.2, 1.2)));
                        let destination = ai.posTransfer(cc.v3(1.2, -0.2));
                        this.shiftToStandby(destination, 3, 0, 1);
                        this.setMovementType(4);
                        this.setTimer(47, 0.4, 2, 0);
                    }
                    if (num % 2 == 0) {
                        this.setPosition(ai.posTransfer(cc.v3(1.2, 1.2)));
                        let destination = ai.posTransfer(cc.v3(-0.2, -0.2));
                        this.shiftToStandby(destination, 3, 0, 1);
                        this.setMovementType(4);
                        this.setTimer(47, 0.4, 2, 0);
                    }
                    if (num > 1) {
                        num = 0;
                    }
                }
                if (idx == 47) {
                    ai.useSkill(this, 887);
                }
                if (idx == 48) {
                    ai.playAction(this, 'gongji_3_end', 1);
                    this.setBaseAngle(0);
                    this.setPosition(ai.posTransfer(cc.v3(0.5, 1.1)));
                    this.setShow(false);
                    let destination = ai.posTransfer(cc.v3(0.5, 0.75));
                    this.shiftToStandby(destination, 1.5, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(49, 1.5, 1, 0);
                }
                if (idx == 49) {
                    //ai.playAction(this, 'daiji_03', 0);
                    ai.useSkill(this, 888);
                    this.simpleHarmonic(100, 8, 90, cc.v3(0, 1), cc.v3(0, 0), cc.v3(0, 0), 0)
                    this.setMovementType(5);
                    this.setTimer(42, 3, 1, 0);
                }
            });
            entity.setTimer(0, 0, 1, 0);
            entity.setTimer(16, 0.016, 9999, 0);
            entity.setTimer(38, 0.016, 9999, 0);
            return entity;
        },
        solution_32: function (info, skills) {
            //M_C_BOSS
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            entity.setHold(true);
            var cb = function (actName) {
                if (actName == 'bs_1') {
                    entity.setTimer(11, 0, 1, 0);
                }
                if (actName == 'bs_2') {
                    entity.setTimer(22, 0, 1, 0);
                }
            }
            entity.setTimerHandler(function (idx) {
                if (idx == 0) {
                    this.setCollisionSwitch(false);
                    let pos_1 = info.pos;
                    let vec_0 = ai.posTransfer(pos_1);
                    let vec_1 = ai.posTransfer(pos_1.add(cc.v3(0.3, 0.4)));
                    let vec_2 = ai.posTransfer(pos_1.add(cc.v3(0.3, 1.2)));
                    let vec_3 = ai.posTransfer(pos_1.add(cc.v3(0, 1.2)));
                    let vec_4 = ai.posTransfer(pos_1.add(cc.v3(-0.3, 1.1)));
                    let vec_5 = ai.posTransfer(pos_1.add(cc.v3(-0.15, 0.7)));
                    let vec_6 = ai.posTransfer(pos_1.add(cc.v3(0, 0.9)));
                    let posData = [vec_0, vec_1, vec_2, vec_3, vec_4, vec_5, vec_6];
                    this.setBezier(posData, 1000, 0, 0);
                    this.setMovementType(2);
                }
                if (idx == 1) {
                    let p = this.getBezierIsEnd()
                    if (p == true) {
                        this.setTimer(2, 0, 1, 0);
                        this.delTimer(1);
                    }
                }
                if (idx == 2) {
                    ai.useSkill(this, 898);
                    this.setSpeed(cc.v3(0, 0));
                    this.setMovementType(0);
                    this.setCollisionSwitch(true);
                    this.setTimer(3, 3, 1, 0);
                }
                if (idx == 3) {
                    ai.useSkill(this, 889);
                    let destination = ai.posTransfer(cc.v3(0.65, 0.6));
                    this.shiftToStandby(destination, 1.5, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(4, 2.5, 1, 0);
                }
                if (idx == 4) {
                    ai.useSkill(this, 890);
                    let destination = ai.posTransfer(cc.v3(0.5, 0.75));
                    this.shiftToStandby(destination, 1.5, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(5, 2.5, 1, 0);
                }
                if (idx == 5) {
                    ai.useSkill(this, 899);
                    let destination = ai.posTransfer(cc.v3(0.25, 0.6));
                    this.shiftToStandby(destination, 1.5, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(6, 2, 1, 0);
                }
                if (idx == 6) {
                    ai.useSkill(this, 889);
                    let destination = ai.posTransfer(cc.v3(0.65, 0.6));
                    this.shiftToStandby(destination, 1.5, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(7, 2.5, 1, 0);
                }
                if (idx == 7) {
                    ai.useSkill(this, 890);
                    let destination = ai.posTransfer(cc.v3(0.5, 0.75));
                    this.shiftToStandby(destination, 1.5, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(3, 2.5, 1, 0);
                }
                if (idx == 8) {
                    let hp = this.getCurHpPer();
                    if (hp < 80) {
                        this.setTimer(9, 0, 1, 0);
                        this.delTimer(8);
                        for (let i = 3; i < 8; i++) {
                            this.delTimer(i);
                        }
                    }
                }
                if (idx == 9) {
                    this.setDefend(true);
                    let destination = ai.posTransfer(cc.v3(0.5, 0.75));
                    this.shiftToStandby(destination, 1.5, 30, 0);
                    this.setMovementType(4);
                    ai.useSkill(this, 891);
                    this.setTimer(10, 2.5, 1, 0);
                }
                if (idx == 10) {
                    ai.playAction(this, 'bs_1', 1, cb);
                    ai.useSkill(this, 892);
                    this.setTimer(12, 0.5, 1, 0);
                }
                if (idx == 11) {
                    this.setDefend(false);
                    ai.setMonsterLoopAction(this, 'start_2');
                    ai.playAction(this, 'start_2', 0);
                    this.setTimer(13, 1, 1, 0);
                }
                if (idx == 12) {
                    ai.useSkill(this, 893);
                }
                if (idx == 13) {
                    ai.useSkill(this, 894);
                    let destination = ai.posTransfer(cc.v3(0.85, 0.75));
                    this.shiftToStandby(destination, 1.5, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(14, 2.5, 1, 0);
                }
                if (idx == 14) {
                    ai.useSkill(this, 895);
                    let destination = ai.posTransfer(cc.v3(0.3, 0.7));
                    this.shiftToStandby(destination, 1.5, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(15, 2.5, 1, 0);
                }
                if (idx == 15) {
                    ai.useSkill(this, 896);
                    let destination = ai.posTransfer(cc.v3(0.5, 0.8));
                    this.shiftToStandby(destination, 1, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(16, 1, 1, 0);
                }
                if (idx == 16) {
                    ai.playAction(this, 'attack_1');
                    ai.useSkill(this, 897);
                    this.setTimer(17, 1.5, 1, 0);
                }
                if (idx == 17) {
                    let destination = ai.posTransfer(cc.v3(0.5, 0.6));
                    this.shiftToStandby(destination, 1, 10, 0);
                    this.setMovementType(4);
                    this.setTimer(18, 1, 1, 0);
                }
                if (idx == 18) {
                    ai.playAction(this, 'attack_1');
                    ai.useSkill(this, 897);
                    this.setTimer(19, 1, 1, 0);
                }
                if (idx == 19) {
                    let destination = ai.posTransfer(cc.v3(0.5, 1.3));
                    this.shiftToStandby(destination, 1, 0, 0);
                    this.setMovementType(4);
                    this.setTimer(20, 2.5, 1, 0);
                    this.setTimer(31, 1, 1, 0);
                }
                if (idx == 20) {
                    let pos_1 = cc.v3(0.5, -0.3);
                    this.setPosition(pos_1);
                    let vec_0 = ai.posTransfer(pos_1);
                    let vec_1 = ai.posTransfer(pos_1.add(cc.v3(-0.3, 0.4)));
                    let vec_2 = ai.posTransfer(pos_1.add(cc.v3(-0.3, 1.2)));
                    let vec_3 = ai.posTransfer(pos_1.add(cc.v3(-0, 1.2)));
                    let vec_4 = ai.posTransfer(pos_1.add(cc.v3(0.3, 1.1)));
                    let vec_5 = ai.posTransfer(pos_1.add(cc.v3(0.15, 0.7)));
                    let vec_6 = ai.posTransfer(pos_1.add(cc.v3(0, 1)));
                    let posData = [vec_0, vec_1, vec_2, vec_3, vec_4, vec_5, vec_6];
                    this.setBezier(posData, 1000, 0, 0);
                    this.setMovementType(2);
                    this.setTimer(30, 0.016, 9999, 0);
                }
                if (idx == 30) {
                    let p = this.getBezierIsEnd()
                    if (p == true) {
                        this.setSpeed(cc.v3(0, 0));
                        this.setMovementType(0);
                        this.setTimer(21, 1, 1, 0);
                        this.delTimer(30);
                    }
                }
                if (idx == 21) {
                    this.setDefend(true);
                    ai.playAction(this, 'bs_2', 1, cb);
                    ai.useSkill(this, 890);
                    let destination = ai.posTransfer(cc.v3(0.5, 0.75));
                    this.shiftToStandby(destination, 1, 0, 0);
                    this.setMovementType(4);
                }
                if (idx == 22) {
                    this.setDefend(false);
                    ai.setMonsterLoopAction(this, 'start_3');
                    ai.playAction(this, 'start_3', 0);
                    ai.useSkill(this, 900);
                    this.setTimer(23, 2, 1, 0);
                }
                if (idx == 23) {
                    ai.useSkill(this, 895);
                    let destination = ai.posTransfer(cc.v3(0.25, 0.6));
                    this.shiftToStandby(destination, 1, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(24, 2, 1, 0);
                }
                if (idx == 24) {
                    ai.useSkill(this, 890);
                    let destination = ai.posTransfer(cc.v3(0.75, 0.6));
                    this.shiftToStandby(destination, 1.5, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(25, 2.5, 1, 0);
                }
                if (idx == 25) {
                    ai.useSkill(this, 901);
                    let destination = ai.posTransfer(cc.v3(0.7, 0.75));
                    this.shiftToStandby(destination, 1.5, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(26, 1.7, 1, 0);
                }
                if (idx == 26) {
                    let destination = ai.posTransfer(cc.v3(0.5, 0.6));
                    this.shiftToStandby(destination, 1, 10, 0);
                    this.setMovementType(4);
                    this.setTimer(27, 1.2, 1, 0);
                }
                if (idx == 27) {
                    ai.useSkill(this, 902);
                    let destination = ai.posTransfer(cc.v3(0.5, 0.75));
                    this.shiftToStandby(destination, 1, 10, 0);
                    this.setMovementType(4);
                    this.setTimer(28, 1, 1, 0);
                }
                if (idx == 28) {
                    ai.setMonsterLoopAction(this, 'attack_3');
                    ai.playAction(this, 'attack_3', 0);
                    this.setTimer(29, 1.5, 9999, 0);
                }
                if (idx == 29) {
                    ai.useSkill(this, 901);
                    let monsterInfo = {
                        mId: 958,
                        lv: this.lv,
                        pos: cc.v3(this.getPosition().x / cc.winSize.width, this.getPosition().y / cc.winSize.height),
                    };
                    MonsterSolutions.solution_33(monsterInfo);
                }
                if (idx == 31) {
                    this.setShow(false);
                }
            });
            entity.setTimer(0, 0, 1, 0);
            entity.setTimer(1, 0.016, 9999, 0);
            entity.setTimer(8, 0.016, 9999, 0);
            return entity;
        },
        solution_33: function (monsterInfo) {
            //M_C_BOSS召唤小怪
            let ai = require('AIInterface');
            let entity_1 = ai.createMonster(monsterInfo);
            entity_1.setIsKill(false);
            entity_1.setDropCrystal(false);
            entity_1.setDeathShock(false);
            entity_1.setDropBuff(false);
            entity_1.runScale(1, 1);
            entity_1.setTimerHandler(function (idx) {
                if (idx == 0) {
                    ai.setMonsterLoopAction(this, 'start_1');
                    let destination = ai.posTransfer(cc.v3(0.2 + Math.random() * 0.6, 0.5 + Math.random() * 0.3));
                    this.shiftToStandby(destination, 3, 10, 0);
                    this.setMovementType(4);
                    this.setTimer(1, 3, 1, 0);
                }
                if (idx == 1) {
                    ai.playAction(this, 'attack_1');
                    ai.useSkill(this, 903);
                    this.setTimer(2, 4, 1, 0);
                }
                if (idx == 2) {
                    this.setDeathType(0);
                    ai.releaseEntity(this);
                }
            });
            entity_1.setTimer(0, 0, 1, 0);
            return entity_1;
        },
        solution_34: function (info, skills) {
            let ai = require('AIInterface');
            let entity_1 = ai.createMonster(info);
            var cb = function (actName) {
                if (actName == 'bianxing_1') {
                    entity_1.setTimer(4, 0, 1, 0);
                }
                if (actName == 'bianxing_2') {
                    entity_1.setTimer(11, 0, 1, 0);
                }
            }
            entity_1.addInvincibleTime(9999);
            entity_1.setIsKill(false);
            entity_1.setDropCrystal(false);
            entity_1.setDeathShock(false);
            entity_1.setDeathType(0);
            entity_1.setCloseDeathBomb(true);
            entity_1.setDropBuff(false);
            entity_1.setTimerHandler(function (idx) {
                if (idx == 0) {
                    this.setCollisionSwitch(false);
                    this.runOpacity(0, 0.5);
                    this.setTimer(1, 0.5, 1, 0);
                }
                if (idx == 1) {
                    this.setCollisionSwitch(true);
                    let pos = this.getPosition();
                    this.setPosition(pos.add(cc.v3(-80, 0)));
                    this.opacity = (255);
                    this.setTimer(2, 0.1, 1, 0);
                }
                if (idx == 2) {
                    this.runOpacity(0, 0.5);
                    this.setTimer(3, 0.5, 1, 0);
                }
                if (idx == 3) {
                    let pos = this.getPosition();
                    this.setPosition(pos.add(cc.v3(-80, 0)));
                    this.opacity = (255);
                    ai.playAction(this, 'bianxing_1', 1, cb);
                }
                if (idx == 4) {
                    ai.useSkill(this, 866);
                    ai.playAction(this, 'putong', 0);
                    this.setTimer(5, 2, 1, 0);
                }
                if (idx == 5) {
                    ai.useSkill(this, 867);
                    this.setTimer(7, 2, 1, 0);
                }
                if (idx == 7) {
                    this.runOpacity(0, 0.5);
                    this.setTimer(8, 0.5, 1, 0);
                }
                if (idx == 8) {
                    let pos = this.getPosition();
                    this.setPosition(pos.add(cc.v3(80, 0)));
                    this.opacity = (255);
                    this.setTimer(9, 0.1, 1, 0);
                }
                if (idx == 9) {
                    this.runOpacity(0, 0.5);
                    this.setTimer(10, 0.5, 1, 0);
                }
                if (idx == 10) {
                    let pos = this.getPosition();
                    this.setPosition(pos.add(cc.v3(80, 0)));
                    this.opacity = (255);
                    ai.playAction(this, 'bianxing_2', 1, cb)
                }
                if (idx == 11) {
                    ai.playAction(this, 'daiji', 0);
                    this.runOpacity(0, 0.5);
                    this.setTimer(12, 0.5, 1, 0);
                }
                if (idx == 12) {
                    ai.releaseEntity(this);
                }
            });
            entity_1.setTimer(0, 0, 1, 0);
            return entity_1;
        },
        solution_35: function (info, skills) {
            let ai = require('AIInterface');
            let entity_2 = ai.createMonster(info);
            var cb = function (actName) {
                if (actName == 'bianxing_1') {
                    entity_2.setTimer(4, 0, 1, 0);
                }
                if (actName == 'bianxing_2') {
                    entity_2.setTimer(11, 0, 1, 0);
                }
            }
            entity_2.setIsKill(false);
            entity_2.setDropCrystal(false);
            entity_2.setDeathShock(false);
            entity_2.setDeathType(0);
            entity_2.setCloseDeathBomb(true);
            entity_2.setDropBuff(false);
            entity_2.addInvincibleTime(9999);
            entity_2.setTimerHandler(function (idx) {
                if (idx == 0) {
                    this.setCollisionSwitch(false);
                    this.runOpacity(0, 0.5);
                    this.setTimer(1, 0.5, 1, 0);
                }
                if (idx == 1) {
                    this.setCollisionSwitch(true);
                    let pos = this.getPosition();
                    this.setPosition(pos.add(cc.v3(80, 0)));
                    this.opacity = (255);
                    this.setTimer(2, 0.1, 1, 0);
                }
                if (idx == 2) {
                    this.runOpacity(0, 0.5);
                    this.setTimer(3, 0.5, 1, 0);
                }
                if (idx == 3) {
                    let pos = this.getPosition();
                    this.setPosition(pos.add(cc.v3(80, 0)));
                    this.opacity = (255);
                    ai.playAction(this, 'bianxing_1', 1, cb);
                }
                if (idx == 4) {
                    ai.useSkill(this, 865);
                    ai.playAction(this, 'putong', 0);
                    this.setTimer(5, 2, 1, 0);
                }
                if (idx == 5) {
                    ai.useSkill(this, 866);
                    this.setTimer(7, 2, 1, 0);
                }
                if (idx == 7) {
                    this.runOpacity(0, 0.5);
                    this.setTimer(8, 0.5, 1, 0);
                }
                if (idx == 8) {
                    let pos = this.getPosition();
                    this.setPosition(pos.add(cc.v3(-80, 0)));
                    this.opacity = (255);
                    this.setTimer(9, 0.1, 1, 0);
                }
                if (idx == 9) {
                    this.runOpacity(0, 0.5);
                    this.setTimer(10, 0.5, 1, 0);
                }
                if (idx == 10) {
                    let pos = this.getPosition();
                    this.setPosition(pos.add(cc.v3(-80, 0)));
                    this.opacity = (255);
                    ai.playAction(this, 'bianxing_2', 1, cb)
                }
                if (idx == 11) {
                    ai.playAction(this, 'daiji', 0);
                    this.runOpacity(0, 0.5);
                    this.setTimer(12, 0.5, 1, 0);
                }
                if (idx == 12) {
                    ai.releaseEntity(this);
                }
            });
            entity_2.setTimer(0, 0, 1, 0);
            return entity_2;
        },
        solution_36: function (info, skills) {
            //M_C_RXBOSS
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            var cb = function (actName) {
                if (actName == 'bs_1') {
                    entity.setTimer(16, 0.5, 1, 0);
                }
            }
            entity.opacity = (0);
            entity.setTimerHandler(function (idx) {
                if (idx == 0) {
                    this.runOpacity(255, 2);
                    ai.setMonsterLoopAction(this, 'start_3');
                    this.setCollisionSwitch(false);
                    this.setTimer(1, 2, 1, 0);
                }
                if (idx == 1) {
                    this.setCollisionSwitch(true);
                    let destination = ai.posTransfer(cc.v3(0.65, 0.65));
                    this.shiftToStandby(destination, 1.5, 5, 0);
                    this.setMovementType(4);
                    this.setTimer(2, 1.5, 1, 0);
                }
                if (idx == 2) {
                    ai.playAction(this, 'attack_5');
                    this.setTimer(3, 0.2, 1, 0);
                }
                if (idx == 3) {
                    this.setTimer(4, 0.5, 2, 0);
                    this.setTimer(5, 1, 1, 0);
                }
                if (idx == 4) {
                    ai.useSkill(this, 905);
                }
                if (idx == 5) {
                    let destination = ai.posTransfer(cc.v3(0.5, 0.55));
                    this.shiftToStandby(destination, 1.5, 5, 0);
                    this.setMovementType(4);
                    this.setTimer(6, 1.5, 1, 0);
                }
                if (idx == 6) {
                    ai.playAction(this, 'attack_5');
                    ai.useSkill(this, 906);
                    this.setTimer(7, 1, 1, 0);
                }
                if (idx == 7) {
                    let destination = ai.posTransfer(cc.v3(0.8, 0.8));
                    this.shiftToStandby(destination, 1, 5, 0);
                    this.setMovementType(4);
                    this.setTimer(8, 1, 1, 0);
                }
                if (idx == 8) {
                    ai.playAction(this, 'attack_5');
                    this.setTimer(9, 0.2, 1, 0);
                }
                if (idx == 9) {
                    this.setTimer(4, 0.5, 2, 0);
                    this.setTimer(10, 1, 1, 0);
                }
                if (idx == 10) {
                    let destination = ai.posTransfer(cc.v3(0.5, 0.7));
                    this.shiftToStandby(destination, 1.5, 5, 0);
                    this.setMovementType(4);
                    this.setTimer(11, 1.5, 1, 0);
                }
                if (idx == 11) {
                    this.setTimer(12, 1, 4, 0);
                    this.setTimer(13, 4, 1, 0);
                    this.setTimer(14, 1, 3, 0);
                }
                if (idx == 12) {
                    let destination = ai.posTransfer(cc.v3(0.25 + Math.random() * 0.5, 0.4 + Math.random() * 0.3));
                    this.shiftToStandby(destination, 0.5, 5, 0);
                    this.setMovementType(4);
                }
                if (idx == 13) {
                    let destination = ai.posTransfer(cc.v3(0.5, 0.7));
                    this.shiftToStandby(destination, 0.5, 5, 0);
                    this.setMovementType(4);
                    this.setTimer(15, 0.5, 1, 0);
                }
                if (idx == 14) {
                    ai.playAction(this, 'attack_5');
                    ai.useSkill(this, 906);
                }
                if (idx == 15) {
                    ai.setMonsterLoopAction(this, 'start_2');
                    ai.playAction(this, 'bs_1', 1, cb);
                    this.setDefend(true);
                }
                if (idx == 16) {
                    this.setDefend(false);
                    let destination = ai.posTransfer(cc.v3(0.5, 0.8));
                    this.shiftToStandby(destination, 1.5, 5, 0);
                    this.setMovementType(4);
                    this.setTimer(17, 1.5, 1, 0);
                }
                if (idx == 17) {
                    ai.playAction(this, 'attack_4');
                    this.setTimer(18, 0.5, 1, 0);
                    this.setTimer(19, 1.5, 1, 0);
                }
                if (idx == 18) {
                    ai.useSkill(this, 907);
                }
                if (idx == 19) {
                    let destination = ai.posTransfer(cc.v3(0.5, 0.55));
                    this.shiftToStandby(destination, 1, 5, 0);
                    this.setMovementType(4);
                    this.setTimer(20, 1, 1, 0);
                }
                if (idx == 20) {
                    ai.playAction(this, 'attack_3');
                    ai.useSkill(this, 908)
                    this.setTimer(21, 1, 1, 0);
                }
                if (idx == 21) {
                    let destination = ai.posTransfer(cc.v3(0.5, 0.75));
                    this.shiftToStandby(destination, 1, 10, 0);
                    this.setMovementType(4);
                    this.setTimer(22, 1.5, 1, 0);
                }
                if (idx == 22) {
                    ai.playAction(this, 'attack_4');
                    this.runScale(1.6, 1);
                    this.setTimer(23, 1, 1, 0);
                }
                if (idx == 23) {
                    this.runScale(1.125, 1);
                    //ai.useSkill(this,907);
                    let Info_1 = {
                        mId: 1487,
                        lv: this.lv,
                        pos: cc.v3(0.25, 0.6),
                    };
                    let Info_2 = {
                        mId: 1488,
                        lv: this.lv,
                        pos: cc.v3(0.75, 0.6),
                    };
                    let entity37 = MonsterSolutions.solution_37(Info_1);
                    let entity38 = MonsterSolutions.solution_38(Info_2);

                    this.setWatch(function (e) {
                        if (e.isDead == true) {
                            return true;
                        }
                        return false;
                    });
                    this.setInspector(entity37, function (r, e) {
                        ai.releaseEntity(e);
                    });
                    this.setInspector(entity38, function (r, e) {
                        ai.releaseEntity(e);
                    });

                    this.setTimer(24, 10, 1, 0);
                }
                if (idx == 24) {
                    let destination = ai.posTransfer(cc.v3(0.3, 0.6));
                    this.shiftToStandby(destination, 1, 5, 0);
                    this.setMovementType(4);
                    this.setTimer(25, 1, 1, 0);
                }
                if (idx == 25) {
                    ai.playAction(this, 'attack_3');
                    ai.useSkill(this, 908)
                    this.setTimer(26, 1, 1, 0);
                }
                if (idx == 26) {
                    let destination = ai.posTransfer(cc.v3(0.5, 0.75));
                    this.shiftToStandby(destination, 1.5, 5, 0);
                    this.setMovementType(4);
                    this.setTimer(27, 1.5, 1, 0);
                }
                if (idx == 27) {
                    ai.playAction(this, 'attack_3');
                    ai.useSkill(this, 908)
                    this.setTimer(28, 1, 1, 0);
                }
                if (idx == 28) {
                    let destination = ai.posTransfer(cc.v3(0.25, 0.75));
                    this.shiftToStandby(destination, 1, 5, 0);
                    this.setMovementType(4);
                    this.setTimer(29, 1, 1, 0);
                }
                if (idx == 29) {
                    ai.playAction(this, 'attack_3');
                    ai.useSkill(this, 908)
                    this.setTimer(30, 1, 1, 0);
                }
                if (idx == 30) {
                    let destination = ai.posTransfer(cc.v3(0.8, 0.55));
                    this.shiftToStandby(destination, 1, 5, 0);
                    this.setMovementType(4);
                    this.setTimer(31, 1, 1, 0);
                }
                if (idx == 31) {
                    ai.playAction(this, 'attack_3');
                    ai.useSkill(this, 908)
                    this.setTimer(32, 1, 1, 0);
                }
                if (idx == 32) {
                    let destination = ai.posTransfer(cc.v3(0.5, 0.75));
                    this.shiftToStandby(destination, 1, 5, 0);
                    this.setMovementType(4);
                    this.setTimer(33, 1.5, 1, 0);
                }
                if (idx == 33) {
                    ai.playAction(this, 'attack_4');
                    this.setTimer(34, 0.5, 1, 0);
                }
                if (idx == 34) {
                    ai.useSkill(this, 907);
                    this.setTimer(35, 4, 1, 0);
                }
                if (idx == 35) {
                    let destination = ai.posTransfer(cc.v3(0.5, 0.65));
                    this.shiftToStandby(destination, 1, 5, 0);
                    this.setMovementType(4);
                    this.setTimer(36, 1.5, 1, 0);
                }
                if (idx == 36) {
                    ai.setMonsterLoopAction(this, 'start_1');
                    ai.playAction(this, 'bs_2');
                    ai.useSkill(this, 910);
                    this.setTimer(37, 3, 1, 0);
                }
                if (idx == 37) {
                    ai.playAction(this, 'attack_2');
                    this.setTimer(38, 0.5, 2, 0);
                    this.setTimer(39, 1, 1, 0);
                }
                if (idx == 38) {
                    ai.useSkill(this, 911);
                }
                if (idx == 39) {
                    let destination = ai.posTransfer(cc.v3(0.5, 0.6));
                    this.shiftToStandby(destination, 1, 5, 0);
                    this.setMovementType(4);
                    this.setTimer(40, 1.5, 1, 0);
                }
                if (idx == 40) {
                    ai.playAction(this, 'attack_1', 4);
                    this.setTimer(41, 0, 1, 0);
                }
                if (idx == 41) {
                    let Info_1 = {
                        mId: 1487,
                        lv: this.lv,
                        pos: cc.v3(0.25, 0.6),
                    };
                    let Info_2 = {
                        mId: 1488,
                        lv: this.lv,
                        pos: cc.v3(0.75, 0.6),
                    };
                    let entity37 = MonsterSolutions.solution_37(Info_1);
                    let entity38 = MonsterSolutions.solution_38(Info_2);

                    this.setInspector(entity37, function (r, e) {
                        ai.releaseEntity(e);
                    });
                    this.setInspector(entity38, function (r, e) {
                        ai.releaseEntity(e);
                    });

                    ai.useSkill(this, 912);
                    ai.useSkill(this, 913);
                    this.setTimer(42, 10, 1, 0);
                }
                if (idx == 42) {
                    let destination = ai.posTransfer(cc.v3(0.5, 0.75));
                    this.shiftToStandby(destination, 1, 5, 0);
                    this.setMovementType(4);
                    this.setTimer(43, 1, 1, 0);
                }
                if (idx == 43) {
                    ai.playAction(this, 'attack_2');
                    ai.useSkill(this, 908);
                    this.setTimer(44, 2, 3, 0);
                    this.setTimer(45, 2.5, 1, 0);
                    this.setTimer(47, 9, 1, 0);
                }
                if (idx == 44) {
                    let destination = ai.posTransfer(cc.v3(0.2 + Math.random() * 0.6, 0.3 + Math.random() * 0.5));
                    this.shiftToStandby(destination, 0.5, 5, 0);
                    this.setMovementType(4);
                }
                if (idx == 45) {
                    this.setTimer(46, 2, 3, 1);
                }
                if (idx == 46) {
                    ai.playAction(this, 'attack_2');
                    ai.useSkill(this, 908);
                }
                if (idx == 47) {
                    let destination = ai.posTransfer(cc.v3(0.5, 0.75));
                    this.shiftToStandby(destination, 1, 5, 0);
                    this.setMovementType(4);
                    this.setTimer(48, 1, 1, 0);
                }
                if (idx == 48) {
                    ai.playAction(this, 'attack_1');
                    this.setTimer(49, 0.5, 1, 0);
                }
                if (idx == 49) {
                    ai.useSkill(this, 912);
                    this.setTimer(43, 3, 1, 0);
                }
            });
            entity.setTimer(0, 0, 1, 0);
            return entity;
        },
        solution_37: function (info, skills) {
            //M_C_RXBOSS分身左
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            entity.setIsKill(false);
            entity.setDropCrystal(false);
            entity.setDeathShock(false);
            entity.setDeathType(0);
            entity.setCloseDeathBomb(true);
            entity.setDropBuff(false);
            entity.addInvincibleTime(9999);
            entity.opacity = (0);
            entity.setTimerHandler(function (idx) {
                if (idx == 0) {
                    ai.setMonsterLoopAction(this, 'start_3');
                    this.setCollisionSwitch(false);
                    this.runOpacity(255, 2)
                    this.setTimer(1, 2, 1, 0);
                }
                if (idx == 1) {
                    this.setCollisionSwitch(true);
                    let destination = ai.posTransfer(cc.v3(0.25, 0.75));
                    this.shiftToStandby(destination, 1, 10, 0);
                    this.setMovementType(4);
                    this.setTimer(2, 1, 1, 0);
                }
                if (idx == 2) {
                    ai.playAction(this, 'attack_5');
                    ai.useSkill(this, 909);
                    this.setTimer(3, 1, 1, 0);
                }
                if (idx == 3) {
                    let destination = ai.posTransfer(cc.v3(0.75, 0.6));
                    this.shiftToStandby(destination, 1, 10, 0);
                    this.setMovementType(4);
                    this.setTimer(4, 1, 1, 0);
                }
                if (idx == 4) {
                    ai.playAction(this, 'attack_5');
                    ai.useSkill(this, 909);
                    this.setTimer(5, 1, 1, 0);
                }
                if (idx == 5) {
                    let destination = ai.posTransfer(cc.v3(0.75, 0.75));
                    this.shiftToStandby(destination, 1, 10, 0);
                    this.setMovementType(4);
                    this.setTimer(6, 1, 1, 0);
                }
                if (idx == 6) {
                    ai.playAction(this, 'attack_5');
                    ai.useSkill(this, 909);
                    this.setTimer(7, 1, 1, 0);
                }
                if (idx == 7) {
                    let destination = ai.posTransfer(cc.v3(0.25, 0.6));
                    this.shiftToStandby(destination, 1, 10, 0);
                    this.setMovementType(4);
                    this.setTimer(8, 1, 1, 0);
                }
                if (idx == 8) {
                    ai.playAction(this, 'attack_5');
                    ai.useSkill(this, 909);
                    this.setTimer(9, 1, 1, 0);
                }
                if (idx == 9) {
                    let destination = ai.posTransfer(cc.v3(0.25, 0.75));
                    this.shiftToStandby(destination, 1, 10, 0);
                    this.setMovementType(4);
                    this.setTimer(10, 1, 1, 0);
                }
                if (idx == 10) {
                    ai.playAction(this, 'attack_5');
                    ai.useSkill(this, 909);
                    this.setTimer(11, 1, 1, 0);
                }
                if (idx == 11) {
                    this.runOpacity(0, 2);
                    this.setTimer(12, 2, 1, 0);
                }
                if (idx == 12) {
                    //this.setActive()
                    ai.releaseEntity(this);
                }
            });
            entity.setTimer(0, 0, 1, 0);
            return entity;
        },
        solution_38: function (info, skills) {
            //M_C_RXBOSS分身右
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            entity.setIsKill(false);
            entity.setDropCrystal(false);
            entity.setDeathShock(false);
            entity.setDeathType(0);
            entity.setCloseDeathBomb(true);
            entity.setDropBuff(false);
            entity.addInvincibleTime(9999);
            entity.opacity = (0);
            entity.setTimerHandler(function (idx) {
                if (idx == 0) {
                    ai.setMonsterLoopAction(this, 'start_3');
                    this.setCollisionSwitch(false);
                    this.runOpacity(255, 2)
                    this.setTimer(1, 2, 1, 0);
                }
                if (idx == 1) {
                    this.setCollisionSwitch(true);
                    let destination = ai.posTransfer(cc.v3(0.75, 0.75));
                    this.shiftToStandby(destination, 1, 10, 0);
                    this.setMovementType(4);
                    this.setTimer(2, 1, 1, 0);
                }
                if (idx == 2) {
                    ai.playAction(this, 'attack_5');
                    ai.useSkill(this, 909);
                    this.setTimer(3, 1, 1, 0);
                }
                if (idx == 3) {
                    let destination = ai.posTransfer(cc.v3(0.25, 0.6));
                    this.shiftToStandby(destination, 1, 10, 0);
                    this.setMovementType(4);
                    this.setTimer(4, 1, 1, 0);
                }
                if (idx == 4) {
                    ai.playAction(this, 'attack_5');
                    ai.useSkill(this, 909);
                    this.setTimer(5, 1, 1, 0);
                }
                if (idx == 5) {
                    let destination = ai.posTransfer(cc.v3(0.25, 0.75));
                    this.shiftToStandby(destination, 1, 10, 0);
                    this.setMovementType(4);
                    this.setTimer(6, 1, 1, 0);
                }
                if (idx == 6) {
                    ai.playAction(this, 'attack_5');
                    ai.useSkill(this, 909);
                    this.setTimer(7, 1, 1, 0);
                }
                if (idx == 7) {
                    let destination = ai.posTransfer(cc.v3(0.75, 0.6));
                    this.shiftToStandby(destination, 1, 10, 0);
                    this.setMovementType(4);
                    this.setTimer(8, 1, 1, 0);
                }
                if (idx == 8) {
                    ai.playAction(this, 'attack_5');
                    ai.useSkill(this, 909);
                    this.setTimer(9, 1, 1, 0);
                }
                if (idx == 9) {
                    let destination = ai.posTransfer(cc.v3(0.75, 0.75));
                    this.shiftToStandby(destination, 1, 10, 0);
                    this.setMovementType(4);
                    this.setTimer(10, 1, 1, 0);
                }
                if (idx == 10) {
                    ai.playAction(this, 'attack_5');
                    ai.useSkill(this, 909);
                    this.setTimer(11, 1, 1, 0);
                }
                if (idx == 11) {
                    this.runOpacity(0, 2);
                    this.setTimer(12, 2, 1, 0);
                }
                if (idx == 12) {
                    //this.setActive()
                    ai.releaseEntity(this);
                }
            });
            entity.setTimer(0, 0, 1, 0);
            return entity;
        },
        solution_39: function (info, skills) {
            //M_C_SB_04_A
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            entity.setZ(5);
            entity.opacity = (0);
            entity.setScale(1, cc.winSize.height / 1000);
            let Info_1 = {
                mId: 1587,
                lv: entity.lv,
                pos: cc.v3(0.5, 0.5),
            };
            entity.setTimerHandler(function (idx) {
                if (idx == 0) {
                    this.setCollisionSwitch(false);
                    this.runOpacity(255, 2);
                }
                if (idx == 1) {
                    this.setCollisionSwitch(true);
                    ai.useSkill(this, 919);
                    this.setTimer(2, 5, 1, 0);
                }
                if (idx == 2) {
                    ai.useSkill(this, 920);
                    this.setTimer(1, 5, 1, 0);
                }
                if (idx == 3) {
                    this.setTimer(4, 5, 9999, 0);
                }
                if (idx == 4) {
                    this.setTimer(5, 0.8, 5, 0);
                    this.setTimer(6, 1.5, 3, 0);
                }
                if (idx == 5) {
                    let Info_2 = {
                        mId: 1588,
                        lv: this.lv,
                        pos: cc.v3(Math.random() * 0.6 + 0.2, 1.144),
                    };
                    MonsterSolutions.solution_41(Info_2);
                }
                if (idx == 6) {
                    ai.useSkill(this, 921);
                }
                if (idx == 7) {
                    for (let i = 1; i < 7; ++i) {
                        this.delTimer(i);
                    }
                    this.setTimer(8, 2, 1, 0);
                }
                if (idx == 8) {
                    ai.playAction(this, 'attack', 0);
                    ai.useSkill(this, 923);
                    //ai.useSkill(this,924);
                    let vec_1 = ai.posTransfer(cc.v3(0.1 + Math.random() * 0.3, 0.2 * Math.random()));
                    let vec_2 = ai.posTransfer(cc.v3(0.1 + Math.random() * 0.3, 0.2 + 0.2 * Math.random()));
                    let vec_3 = ai.posTransfer(cc.v3(0.1 + Math.random() * 0.3, 0.4 + 0.2 * Math.random()));
                    let vec_4 = ai.posTransfer(cc.v3(0.1 + Math.random() * 0.3, 0.6 + 2 * Math.random()));
                    let vec_5 = ai.posTransfer(cc.v3(0.1 + Math.random() * 0.3, 0.8 + 2 * Math.random()));
                    let pos_1 = ai.posTransfer(cc.v3(0.9 - Math.random() * 0.3, 1 - 0.2 * Math.random()));
                    let pos_2 = ai.posTransfer(cc.v3(0.9 - Math.random() * 0.3, 0.8 - 0.2 * Math.random()));
                    let pos_3 = ai.posTransfer(cc.v3(0.9 - Math.random() * 0.3, 0.6 - 0.2 * Math.random()));
                    let pos_4 = ai.posTransfer(cc.v3(0.9 - Math.random() * 0.3, 0.4 - 2 * Math.random()));
                    let pos_5 = ai.posTransfer(cc.v3(0.9 - Math.random() * 0.3, 0.2 - 2 * Math.random()));
                    BattleManager.getInstance().screenBomb(1, [vec_1, vec_2, vec_3, vec_4, vec_5], 1);
                    BattleManager.getInstance().screenBomb(1, [pos_1, pos_2, pos_3, pos_4, pos_5], 1);
                    this.setTimer(9, 3, 1, 0);
                    this.setTimer(21, 1, 1, 0);
                }
                if (idx == 21) {
                    let vec_1 = ai.posTransfer(cc.v3(0.9 - Math.random() * 0.3, 0.2 * Math.random()));
                    let vec_2 = ai.posTransfer(cc.v3(0.9 - Math.random() * 0.3, 0.2 + 0.2 * Math.random()));
                    let vec_3 = ai.posTransfer(cc.v3(0.9 - Math.random() * 0.3, 0.4 + 0.2 * Math.random()));
                    let vec_4 = ai.posTransfer(cc.v3(0.9 - Math.random() * 0.3, 0.6 + 2 * Math.random()));
                    let vec_5 = ai.posTransfer(cc.v3(0.9 - Math.random() * 0.3, 0.8 + 2 * Math.random()));
                    let pos_1 = ai.posTransfer(cc.v3(0.1 + Math.random() * 0.3, 1 - 0.2 * Math.random()));
                    let pos_2 = ai.posTransfer(cc.v3(0.1 + Math.random() * 0.3, 0.8 - 0.2 * Math.random()));
                    let pos_3 = ai.posTransfer(cc.v3(0.1 + Math.random() * 0.3, 0.6 - 0.2 * Math.random()));
                    let pos_4 = ai.posTransfer(cc.v3(0.1 + Math.random() * 0.3, 0.4 - 2 * Math.random()));
                    let pos_5 = ai.posTransfer(cc.v3(0.1 + Math.random() * 0.3, 0.2 - 2 * Math.random()));
                    BattleManager.getInstance().screenBomb(1, [vec_1, vec_2, vec_3, vec_4, vec_5], 1);
                    BattleManager.getInstance().screenBomb(1, [pos_1, pos_2, pos_3, pos_4, pos_5], 1);
                }
                if (idx == 9) {
                    ai.useSkill(this, 925);
                    this.setTimer(10, 4, 1, 0);
                }
                if (idx == 10) {
                    ai.useSkill(this, 925);
                    this.setTimer(11, 5, 1, 0);
                }
                if (idx == 11) {
                    ai.useSkill(this, 926);
                    this.setTimer(12, 2, 1, 0);
                }
                if (idx == 12) {
                    ai.useSkill(this, 927);
                    this.setTimer(13, 4.5, 1, 0);
                }
                if (idx == 13) {
                    BattleManager.getInstance().screenShake(1);
                    this.setTimer(14, 5.5, 1, 0);
                }
                if (idx == 14) {
                    //ai.useSkill(this,928);
                    let vec_1 = ai.posTransfer(cc.v3(0.3, 0.4));
                    let vec_2 = ai.posTransfer(cc.v3(0.8, 0.5));
                    BattleManager.getInstance().screenBomb(0, [vec_2, vec_1, vec_2], 2);
                    this.setTimer(15, 1, 7, 1);
                    this.setTimer(16, 2, 1, 0);
                }
                if (idx == 15) {
                    BattleManager.getInstance().screenShake(1);
                }
                if (idx == 16) {
                    ai.useSkill(this, 929);
                    this.setTimer(17, 5, 1, 0);
                }
                if (idx == 17) {
                    ai.playAction(this, 'start', 0);
                    this.setTimer(18, 1, 1, 0);
                }
                if (idx == 18) {
                    ai.useSkill(this, 930);
                    this.setTimer(19, 2, 1, 0);
                }
                if (idx == 19) {
                    ai.useSkill(this, 931);
                    this.setTimer(9, 4, 1, 0);
                }
                if (idx == 20) {
                    let entity40 = MonsterSolutions.solution_40(Info_1);
                    this.setWatch(function (e) {
                        let hp = e.getCurHpPer();
                        if (hp < 50) {
                            return 1;
                        }
                        if (e.isDead == true) {
                            return 2;
                        }
                        return false;
                    }, function (result, e) {
                        switch (result) {
                            case 1:
                                e.setTimer(7, 0, 1, 0);
                                break;
                        }
                        return 9;
                    });
                    this.setInspector(entity40, function (result, e) {
                        switch (result) {
                            case 1:
                                entity40.setTimer(1, 0, 1, 0);
                                break;
                            case 2:
                                ai.releaseEntity(e);
                                break;
                        }
                    });
                }
            });
            entity.setTimer(0, 1, 1, 1);
            entity.setTimer(20, 0, 1, 0);
            entity.setTimer(1, 3, 1, 0);
            entity.setTimer(3, 9, 1, 0);
            return entity;
        },
        solution_40: function (info, skills) {
            //M_C_SB_04_B
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            entity.setScale(1, cc.winSize.height / 1000);
            entity.setIsKill(false);
            entity.setDropCrystal(false);
            entity.setDeathShock(false);
            entity.setDeathType(0);
            entity.setCloseDeathBomb(true);
            entity.setDropBuff(false);
            entity.setCollisionSwitch(false);
            entity.opacity = (0);
            entity.setTimerHandler(function (idx) {
                if (idx == 0) {
                    this.runOpacity(255, 2);
                }
                if (idx == 1) {
                    ai.playAction(this, 'attack', 0);
                    this.setTimer(2, 4, 1, 0);
                }
                if (idx == 2) {
                    this.runOpacity(0, 1);
                    this.setTimer(3, 1, 1, 0);
                }
                if (idx == 3) {
                    ai.releaseEntity(this);
                }
            });
            entity.setTimer(0, 1, 1, 1);
            return entity;
        },
        solution_41: function (info, skills) {
            //召唤自爆怪
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            entity.setIsKill(false);
            entity.setDropCrystal(false);
            entity.setDeathShock(false);
            entity.setDropBuff(false);
            var cb = function (actName) {
                if (actName == 'attack_2') {
                    entity.setTimer(2, 0, 1, 0);
                    entity.setTimer(3, 0.1, 1, 0);
                }
            }
            entity.setTimerHandler(function (idx) {
                if (idx == 0) {
                    let destination = ai.posTransfer(info.pos.add(cc.v3(0, -0.644 + Math.random() * 0.2)));
                    this.shiftToStandby(destination, 1, 0, 0);
                    this.setMovementType(4);
                    this.setTimer(1, 2, 1, 0);
                }
                if (idx == 1) {
                    ai.playAction(this, 'attack_2', 1, cb);
                }
                if (idx == 2) {
                    ai.useSkill(this, 922);
                }
                if (idx == 3) {
                    ai.playAction(this, 'start_1', 0);
                    ai.releaseEntity(this);
                }
            });
            entity.setTimer(0, 0, 1, 0);
            return entity;
        },
        solution_42: function (info, skills) {
            //宝箱飞机
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            var cb = function (actName) {
                if (actName == 'bianxing_1') {
                    entity.setTimer(2, 0, 1, 0);
                }
                if (actName == 'gongji_1_fire') {
                    entity.setTimer(2, 0, 1, 0);
                }
            }
            entity.setTimerHandler(function (idx) {
                if (idx == 0) {
                    this.setDefend(true);
                    let destination = ai.posTransfer(cc.v3(0.5, 0.7));
                    this.shiftToStandby(destination, 2, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(1, 2, 1, 0);
                }
                if (idx == 1) {
                    ai.setMonsterLoopAction(this, 'daiji_01');
                    ai.playAction(this, 'bianxing_1', 1, cb)
                }
                if (idx == 2) {
                    this.setDefend(false);
                    let destination = ai.posTransfer(cc.v3(0.2 + 0.6 * Math.random(), 0.5 + Math.random() * 0.3));
                    this.shiftToStandby(destination, 1.5, 10, 0);
                    this.setMovementType(4);
                    this.setTimer(3, 1.5, 1, 0);
                }
                if (idx == 3) {
                    ai.playAction(this, 'gongji_1_fire', 2, cb);
                }
            });
            entity.setTimer(0, 0, 1, 0);
            return entity;
        },
        solution_43: function (info, skills) {
            //M_C_LDWH
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            entity.setTimerHandler(function (idx) {
                if (idx == 0) {
                    ai.setMonsterLoopAction(this,'start_1');
                    this.setDefend(true);
                    let destination = ai.posTransfer(cc.v3(0.5,0.65));
                    this.shiftToStandby(destination, 2, 30, 0);
                    this.setMovementType(4);
                    this.setTimer(1,2,1,0);
                    this.setTimer(9,3,1,0);
                }
                if (idx == 1) {
                    this.setDefend(false);
                    this.simpleHarmonic(10, 2, -90, cc.v3(1, 0), cc.v3(0, 0), cc.v3(15, 15), 0)
                    this.setMovementType(5);
                    this.setTimer(2, 2, 1, 0);
                }
                if (idx == 2) {
                    this.simpleHarmonic(10, 2, -90, cc.v3(1, 0), cc.v3(30, 30), cc.v3(-15, -15), 0)
                    this.setMovementType(5);
                    this.setTimer(3, 2, 1, 0);
                }
                if (idx == 3) {
                    this.simpleHarmonic(10, 2, -90, cc.v3(1, 0), cc.v3(0, 0), cc.v3(-15, 15), 0)
                    this.setMovementType(5);
                    this.setTimer(4, 2, 1, 0);
                }
                if (idx == 4) {
                    this.simpleHarmonic(10, 2, -90, cc.v3(1, 0), cc.v3(-30, 30), cc.v3(15, -15), 0)
                    this.setMovementType(5);
                    this.setTimer(5, 2, 1, 0);
                }
                if (idx == 5) {
                    this.simpleHarmonic(10, 2, -90, cc.v3(1, 0), cc.v3(0, 0), cc.v3(-15, -15), 0)
                    this.setMovementType(5);
                    this.setTimer(6, 2, 1, 0);
                }
                if (idx == 6) {
                    this.simpleHarmonic(10, 2, -90, cc.v3(1, 0), cc.v3(-30, -30), cc.v3(15, 15), 0)
                    this.setMovementType(5);
                    this.setTimer(7, 2, 1, 0);
                }
                if (idx == 7) {
                    this.simpleHarmonic(10, 2, -90, cc.v3(1, 0), cc.v3(0, 0), cc.v3(15, -15), 0)
                    this.setMovementType(5);
                    this.setTimer(8, 2, 1, 0);
                }
                if (idx == 8) {
                    this.simpleHarmonic(10, 2, -90, cc.v3(1, 0), cc.v3(30, -30), cc.v3(-15, 15), 0)
                    this.setMovementType(5);
                    this.setTimer(1, 2, 1, 0);
                }
                if (idx == 9) {
                    ai.playAction(this, 'attack_1')
                    this.setTimer(10, 1, 1, 0);
                }
                if (idx == 10) {
                    ai.useSkill(this, 658);
                    this.setTimer(11, 2, 1, 0);
                }
                if (idx == 11) {
                    ai.playAction(this, 'animation1')
                    this.setTimer(12, 0.5, 1, 0);
                }
                if (idx == 12) {
                    ai.useSkill(this, 659);
                    this.setTimer(13, 2, 1, 0);
                }
                if (idx == 13) {
                    ai.playAction(this, 'animation2')
                    this.setTimer(14, 0.5, 1, 0);
                }
                if (idx == 14) {
                    ai.useSkill(this, 660);
                    this.setTimer(15, 2, 1, 0);
                }
                if (idx == 15) {
                    ai.playAction(this, 'attack_1')
                    this.setTimer(16, 1, 1, 0);
                }
                if (idx == 16) {
                    ai.useSkill(this, 71);
                    this.setTimer(9, 2, 1, 0);
                }
            });
            entity.setTimer(0, 0, 1, 0);
            entity.setTimer(9,3,1,0);
            return entity;
        },
        solution_61: function (info, runtime, autoskilldelay) {
            //渐隐出现——左右摆动
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            entity.opacity = (0);
            entity.setTimerHandler(function (idx) {
                if (idx == 0) {
                    this.setCollisionSwitch(false);
                    this.runOpacity(255, runtime);
                    this.setTimer(1, runtime, 1, 0);
                }
                if (idx == 1) {
                    this.setCollisionSwitch(true);
                    if (typeof autoskilldelay !== 'undefined') {
                        this.setTimer(2, autoskilldelay, 1, 0);
                    }
                }
                if (idx == 2) {
                    ai.autoUseSkill(this, true);
                    this.simpleHarmonic(40, 8, 90, cc.v3(0, 1), cc.v3(0, 0), cc.v3(0, 0), 0)
                    this.setMovementType(5);
                }
            });
            entity.setTimer(0, 0, 1, 0);
            return entity;
        },
        solution_62: function (info, runtime_1, runtime_2, autoskilldelay, cd, count) {
            //出现-消失
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            entity.opacity = (0);
            entity.setCollisionSwitch(false);
            entity.setDropCrystal(false);
            entity.setDropCount(false);
            entity.setDeathShock(false);
            entity.setCloseDeathBomb(true);
            entity.setDropBuff(false);
            let arr = entity.getMonsterSkills();
            entity.setTimerHandler(function (idx) {
                if (idx == 0) {
                    ai.playAction(this, 'start_1', 0);
                    ai.stopAction(this);
                    this.runOpacity(255, runtime_1);
                    this.setTimer(1, runtime_1, 1, 0);
                }
                if (idx == 1) {
                    this.runOpacity(0, runtime_2);
                    this.setTimer(3, runtime_2 + 1, 1, 0);
                }
                if (idx == 2) {
                    this.setTimer(4, cd, count, 0);
                }
                if (idx == 3) {
                    ai.releaseEntity(this);
                }
                if (idx == 4) {
                    ai.useSkill(this, arr[0]);
                }
            });
            entity.setTimer(0, 0.1, 1, 0);
            entity.setTimer(2, autoskilldelay, 1, 0);
            return entity;
        },
        solution_63: function (info, runtime, autoskilldelay) {
            //渐隐出现
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            entity.opacity = (0);
            entity.setTimerHandler(function (idx) {
                if (idx == 0) {
                    this.setCollisionSwitch(false);
                    this.runOpacity(255, runtime);
                    this.setTimer(1, runtime, 1, 0);
                }
                if (idx == 1) {
                    this.setCollisionSwitch(true);
                    if (typeof autoskilldelay !== 'undefined') {
                        this.setTimer(2, autoskilldelay, 1, 0);
                    }
                }
                if (idx == 2) {
                    ai.autoUseSkill(this, true);
                }
            });
            entity.setTimer(0, 0, 1, 0);
            return entity;
        },
        solution_64: function (info, speed, angle, speedacc, angleacc, SpfixDirection, om) {
            //陨石
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            if (typeof om !== 'undefined') {
                entity.setEntitySelfCircle(om, 0);
            }
            entity.setDropCrystal(false);
            entity.setDropCount(false);
            entity.setDropBuff(false);
            entity.setTimerHandler(function (idx) {
                if (idx == 0) {
                    if (SpfixDirection == 0) {
                        this.setSpeed(ai.speedTransfer(speed, angle), false);
                        this.setSpeedAcc(ai.speedTransfer(speedacc, angleacc));
                    }
                    if (SpfixDirection == 1) {
                        this.setSpeed(ai.speedTransfer(speed, angle), true);
                        this.setSpeedAcc(ai.speedTransfer(speedacc, angleacc));
                    }
                }
            });
            entity.setTimer(0, 0, 1, 0);
            return entity;
        },
        solution_65: function (info, Scale, D) {
            //放大
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            let x = 0;
            let y = 0;
            let pos = cc.v3(0, 0);
            entity.setTimerHandler(function (idx) {
                if (idx == 0) {
                    this.setCollisionSwitch(false);
                    this.simpleHarmonic(100, 4, 90, cc.v3(1, 0), cc.v3(0, 0), cc.v3(0, 0), 0)
                    this.setMovementType(5);
                    this.runScale(Scale, 2);
                    this.setTimer(1, 2, 1, 0);
                }
                if (idx == 1) {
                    this.setCollisionSwitch(true);
                    pos = this.getPosition();
                    ai.autoUseSkill(this, true);
                    this.setTimer(2, 1, 1, 0);
                }
                if (idx == 2) {
                    x = pos.x - D + Math.random() * D * 2;
                    y = pos.y - D + Math.random() * D * 2;
                    let destination = cc.v3(x, y);
                    this.shiftToStandby(destination, 4, 5, 0);
                    this.setMovementType(4);
                    this.setTimer(3, 4, 1, 0);
                }
                if (idx == 3) {
                    this.setSpeed(cc.v3(0, 0));
                    this.setMovementType(0);
                    this.setTimer(2, 0.5, 1, 0);
                }
            });
            entity.setTimer(0, 0, 1, 0);
            return entity;
        },
        solution_66: function (info, skills) {
            //导弹怪_向右
            return MonsterSolutions.solution_17(info, 1400, 0, 0, 0, cc.v3(1, 0), cc.v3(0, 0));
        },
        solution_67: function (info, skills) {
            //导弹怪_向左
            return MonsterSolutions.solution_17(info, 1400, 180, 0, 0, cc.v3(-1, 0), cc.v3(0, 0));
        },
        solution_68: function (info, skills) {
            //排行怪——向下d
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            entity.setDropCrystal(false);
            entity.setDropCount(false);
            entity.setDeathShock(false);
            entity.setDropBuff(false);
            entity.setImmediatelyKill(3);
            entity.setSpeed(ai.speedTransfer(300, -90), false);
            return entity;
        },
        solution_69: function (info, skills) {
            //导弹怪_向下
            return MonsterSolutions.solution_17(info, 1400, -90, 0, 0, cc.v3(0, -1), cc.v3(0, 0));
        },
        //70-   关卡ai
        solution_70: function (info, skills) {
            return MonsterSolutions.solution_1(info, 300, 0, 0, 0, 1);
        },
        solution_71: function (info, skills) {
            return MonsterSolutions.solution_1(info, 300, 180, 0, 0, 1);
        },
        solution_72: function (info, skills) {
            return MonsterSolutions.solution_1(info, 300, -90, 0, -90, 1);
        },
        solution_73: function (info, skills) {
            return MonsterSolutions.solution_1(info, 300, 0, 75, 180, 0, 180);
        },
        solution_74: function (info, skills) {
            return MonsterSolutions.solution_1(info, 300, 180, 75, 0, 0, 180);
        },
        solution_75: function (info, skills) {
            return MonsterSolutions.solution_1(info, 300, 30, 0, 0, 1);
        },
        solution_76: function (info, skills) {
            return MonsterSolutions.solution_1(info, 300, 150, 0, 0, 1);
        },
        solution_77: function (info, skills) {
            return MonsterSolutions.solution_1(info, 300, -30, 0, 0, 1);
        },
        solution_78: function (info, skills) {
            return MonsterSolutions.solution_1(info, 300, -150, 0, 0, 1);
        },
        solution_79: function (info, skills) {
            return MonsterSolutions.solution_1(info, 300, -45, 0, 0, 1);
        },
        solution_80: function (info, skills) {
            return MonsterSolutions.solution_1(info, 300, -135, 0, 0, 1);
        },
        solution_81: function (info, skills) {
            return MonsterSolutions.solution_1(info, 300, 45, 0, 0, 1);
        },
        solution_82: function (info, skills) {
            return MonsterSolutions.solution_1(info, 300, 135, 0, 0, 1);
        },
        solution_83: function (info, skills) {
            let pos = info.pos;
            return MonsterSolutions.solution_5(info, 300, 0, pos, cc.v3(1, 0), cc.v3(1, 0.5), 1, 1);
        },
        solution_84: function (info, skills) {
            let pos = info.pos;
            return MonsterSolutions.solution_5(info, 300, 0, pos, cc.v3(-1, 0), cc.v3(-1, 0.5), 1, 1);
        },
        solution_85: function (info, skills) {
            let pos = info.pos;
            return MonsterSolutions.solution_5(info, 300, 0, pos, cc.v3(1, 0), cc.v3(1, -0.5), 1, 1);
        },
        solution_86: function (info, skills) {
            let pos = info.pos;
            return MonsterSolutions.solution_5(info, 300, 0, pos, cc.v3(-1, 0), cc.v3(-1, -0.5), 1, 1);
        },
        solution_87: function (info, skills) {
            let ai = require('AIInterface');
            let vec = ai.posTransfer(info.pos.add(cc.v3(0.5, 0)));
            return MonsterSolutions.solution_3(info, vec, 3.1, 100, 0, 3);
        },
        solution_88: function (info, skills) {
            let ai = require('AIInterface');
            let vec = ai.posTransfer(info.pos.add(cc.v3(-0.5, 0)));
            return MonsterSolutions.solution_3(info, vec, 3.1, 100, 0, 3);
        },
        solution_89: function (info, skills) {
            let ai = require('AIInterface');
            let vec = ai.posTransfer(info.pos.add(cc.v3(0, -0.5)));
            return MonsterSolutions.solution_3(info, vec, 3.1, 100, 0, 3);
        },
        solution_90: function (info, skills) {
            let ai = require('AIInterface');
            let vec = ai.posTransfer(info.pos);
            let pos = vec.add(ai.speedTransfer(400, 30));
            return MonsterSolutions.solution_3(info, pos, 2, 50, 0, 3);
        },
        solution_91: function (info, skills) {
            let ai = require('AIInterface');
            let vec = ai.posTransfer(info.pos);
            let pos = vec.add(ai.speedTransfer(400, 150));
            return MonsterSolutions.solution_3(info, pos, 2, 50, 0, 3);
        },
        solution_92: function (info, skills) {
            let ai = require('AIInterface');
            let vec = ai.posTransfer(info.pos);
            let pos = vec.add(ai.speedTransfer(400, -30));
            return MonsterSolutions.solution_3(info, pos, 2, 50, 0, 3);
        },
        solution_93: function (info, skills) {
            let ai = require('AIInterface');
            let vec = ai.posTransfer(info.pos);
            let pos = vec.add(ai.speedTransfer(400, -150));
            return MonsterSolutions.solution_3(info, pos, 2, 50, 0, 3);
        },
        solution_94: function (info, skills) {
            let ai = require('AIInterface');
            let vec = ai.posTransfer(info.pos);
            let pos = vec.add(ai.speedTransfer(500, -45));
            return MonsterSolutions.solution_3(info, pos, 2, 50, 0, 3);
        },
        solution_95: function (info, skills) {
            let ai = require('AIInterface');
            let vec = ai.posTransfer(info.pos);
            let pos = vec.add(ai.speedTransfer(500, -135));
            return MonsterSolutions.solution_3(info, pos, 2, 50, 0, 3);
        },
        solution_96: function (info, skills) {
            let ai = require('AIInterface');
            let vec = ai.posTransfer(info.pos);
            let pos = vec.add(ai.speedTransfer(500, 45));
            return MonsterSolutions.solution_3(info, pos, 2, 50, 0, 3);
        },
        solution_97: function (info, skills) {
            let ai = require('AIInterface');
            let vec = ai.posTransfer(info.pos);
            let pos = vec.add(ai.speedTransfer(500, 135));
            return MonsterSolutions.solution_3(info, pos, 2, 50, 0, 3);
        },
        solution_98: function (info, skills) {
            return MonsterSolutions.solution_8(info, 1, 1);
        },
        solution_99: function (info, skills) {
            return MonsterSolutions.solution_2(info, 300, 0, 0, 0, 1, 50, 4, 90, cc.v3(0, 1), cc.v3(0, 0), cc.v3(0, 0), 0, 0.5, 1);
        },
        solution_100: function (info, skills) {
            return MonsterSolutions.solution_2(info, 300, 180, 0, 0, 1, 50, 4, 90, cc.v3(0, -1), cc.v3(0, 0), cc.v3(0, 0), 0, 0.5, 1);
        },
        solution_101: function (info, skills) {
            return MonsterSolutions.solution_2(info, 300, -90, 0, 0, 2, 50, 4, 90, cc.v3(0, 1), cc.v3(0, 0), cc.v3(0, 0), 0, 0.5, 1);
        },
        solution_102: function (info, skills) {
            return MonsterSolutions.solution_2(info, 300, 30, 0, 0, 1.3, 50, 4, 90, cc.v3(0, 1), cc.v3(0, 0), cc.v3(0, 0), 0, 0.5, 1);
        },
        solution_103: function (info, skills) {
            return MonsterSolutions.solution_2(info, 300, 150, 0, 0, 1.3, 50, 4, 90, cc.v3(0, 1), cc.v3(0, 0), cc.v3(0, 0), 0, 0.5, 1);
        },
        solution_104: function (info, skills) {
            return MonsterSolutions.solution_2(info, 300, -30, 0, 0, 1.3, 50, 4, 90, cc.v3(0, 1), cc.v3(0, 0), cc.v3(0, 0), 0, 0.5, 1);
        },
        solution_105: function (info, skills) {
            return MonsterSolutions.solution_2(info, 300, -150, 0, 0, 1.3, 50, 4, 90, cc.v3(0, 1), cc.v3(0, 0), cc.v3(0, 0), 0, 0.5, 1);
        },
        solution_106: function (info, skills) {
            return MonsterSolutions.solution_2(info, 300, -45, 0, 0, 1.5, 50, 4, 90, cc.v3(0, 1), cc.v3(0, 0), cc.v3(0, 0), 0, 0.5, 1);
        },
        solution_107: function (info, skills) {
            return MonsterSolutions.solution_2(info, 300, -135, 0, 0, 1.5, 50, 4, 90, cc.v3(0, 1), cc.v3(0, 0), cc.v3(0, 0), 0, 0.5, 1);
        },
        solution_108: function (info, skills) {
            return MonsterSolutions.solution_2(info, 300, 45, 0, 0, 1.5, 50, 4, 90, cc.v3(0, 1), cc.v3(0, 0), cc.v3(0, 0), 0, 0.5, 1);
        },
        solution_109: function (info, skills) {
            return MonsterSolutions.solution_2(info, 300, 135, 0, 0, 1.5, 50, 4, 90, cc.v3(0, 1), cc.v3(0, 0), cc.v3(0, 0), 0, 0.5, 1);
        },
        solution_110: function (info, skills) {
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            let pos = entity.getPosition();
            entity.opacity = (0);
            entity.runOpacity(255, 1);
            entity.setCollisionSwitch(false);
            entity.setTimerHandler(function (idx) {
                if (idx == 0) {
                    this.setCollisionSwitch(true);
                }
                if (idx == 1) {
                    ai.autoUseSkill(this, true);
                    if (pos.x < 320) {
                        this.simpleHarmonic(100, 8, 90, cc.v3(0, 1), cc.v3(0, 0), cc.v3(0, 0), 0)
                        this.setMovementType(5);
                    }
                    if (pos.x > 320) {
                        this.simpleHarmonic(100, 8, 90, cc.v3(0, -1), cc.v3(0, 0), cc.v3(0, 0), 0)
                        this.setMovementType(5); 
                    }
                }
            });
            entity.setTimer(0, 1, 1, 0);
            entity.setTimer(1, 2, 1, 0);
            return entity;
        },
        solution_111: function (info, skills) {
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            let pos = entity.getPosition();
            entity.opacity = (0);
            entity.runOpacity(255, 1);
            entity.setCollisionSwitch(false);
            entity.setTimerHandler(function (idx) {
                if (idx == 0) {
                    this.setCollisionSwitch(true);
                }
                if (idx == 1) {
                    ai.autoUseSkill(this, true);
                    this.setEntityAutoCircle(cc.v3(320, 800), pos.sub(cc.v3(320, 800)), 90, 0, 0, 0, 0);
                    this.setMovementType(1);
                }
            });
            entity.setTimer(0, 1, 1, 0);
            entity.setTimer(1, 2, 1, 0);
            return entity;
        },
        solution_112: function (info, skills) {
            //原地测试弹幕
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            return entity;
        },
        solution_113: function (info, skills) {
            let pos = info.pos;
            return MonsterSolutions.solution_6(info, 450, 0, pos, cc.v3(0.2031, -0.3521), cc.v3(0.8906, -0.3521), cc.v3(1.0938, 0), 1, 1);
        },
        solution_114: function (info, skills) {
            let pos = info.pos;
            return MonsterSolutions.solution_6(info, 450, 0, pos, cc.v3(-0.2031, -0.3521), cc.v3(-0.8906, -0.3521), cc.v3(-1.0938, 0), 1, 1);
        },
        solution_115: function (info, skills) {
            let pos = info.pos;
            return MonsterSolutions.solution_10(info, 450, 0, pos, cc.v3(-0.8312, -0.1601), cc.v3(-0.6006, -0.5408), cc.v3(0.2413, -0.3867), cc.v3(0.5094, -0.8399), cc.v3(-0.3486, -1), 1, 1);
        },
        solution_116: function (info, skills) {
            let pos = info.pos;
            return MonsterSolutions.solution_10(info, 450, 0, pos, cc.v3(0.8312, -0.1601), cc.v3(0.6006, -0.5408), cc.v3(-0.2413, -0.3867), cc.v3(-0.5094, -0.8399), cc.v3(0.3486, -1), 1, 1);
        },
        solution_117: function (info, skills) {
            let pos = info.pos;
            return MonsterSolutions.solution_7(info, 450, 0, pos, cc.v3(0.362, 0.3266), cc.v3(0.4847, -0.5375), cc.v3(0.5368, 0.3318), cc.v3(1, 0), 0, 1);
        },
        solution_118: function (info, skills) {
            let pos = info.pos;
            return MonsterSolutions.solution_7(info, 450, 0, pos, cc.v3(-0.362, 0.3266), cc.v3(-0.4847, -0.5375), cc.v3(-0.5368, 0.3318), cc.v3(-1, 0), 0, 1);
        },
        solution_119: function (info, skills) {
            let pos = info.pos;
            return MonsterSolutions.solution_10(info, 450, 0, pos, cc.v3(-0.0615, -0.5677), cc.v3(0.5654, -0.0975), cc.v3(1.0654, -0.2817), cc.v3(-0.35, -0.7454), cc.v3(1, -0.8494), 1, 1);
        },
        solution_120: function (info, skills) {
            let pos = info.pos;
            return MonsterSolutions.solution_10(info, 450, 0, pos, cc.v3(0.0615, -0.5677), cc.v3(-0.5654, -0.0975), cc.v3(-1.0654, -0.2817), cc.v3(0.35, -0.7454), cc.v3(-1, -0.8494), 1, 1);
        },
        solution_121: function (info, skills) {
            let pos = info.pos;
            return MonsterSolutions.solution_9(info, 450, 0, pos, cc.v3(0.5023, -0.0026), cc.v3(0.9862, 0.0441), cc.v3(1.2074, 0.2856), cc.v3(0.9493, 0.4907), cc.v3(0.318, 0.5504), cc.v3(-0.0968, 0.3505), cc.v3(0.1843, 0.244), cc.v3(-0.0369, 0.0441), cc.v3(0.5023, 0), cc.v3(1, -0.0026), 1, 1);
        },
        solution_122: function (info, skills) {
            let pos = info.pos;
            return MonsterSolutions.solution_9(info, 450, 0, pos, cc.v3(-0.4977, 0.0026), cc.v3(-1.039, 0.0467), cc.v3(-0.8157, 0.2466), cc.v3(-1.0968, 0.3531), cc.v3(-0.682, 0.553), cc.v3(-0.0507, 0.4933), cc.v3(0.2074, 0.2882), cc.v3(-0.0138, 0.0467), cc.v3(-0.4977, 0), cc.v3(-1, 0.0026), 1, 1);
        },
        solution_123: function (info, skills) {
            let pos = info.pos;
            return MonsterSolutions.solution_12(info, 450, 0, pos, cc.v3(1.3469, 0.0018), cc.v3(1.3469, 0.4525), cc.v3(1.0188, 0.6585), cc.v3(0.7656, 0.4507), cc.v3(0.9375, 0.2835), 0, 0.5);
        },
        solution_124: function (info, skills) {
            let pos = info.pos;
            return MonsterSolutions.solution_12(info, 450, 0, pos, cc.v3(-1.3469, 0.0018), cc.v3(-1.3469, 0.4525), cc.v3(-1.0188, 0.6585), cc.v3(-0.7656, 0.4507), cc.v3(-0.9375, 0.2835), 0, 0.5);
        },
        solution_125: function (info, skills) {
            let pos = info.pos;
            return MonsterSolutions.solution_13(info, 350, 0, pos, cc.v3(1.1906, 0.3715), cc.v3(0.05, 0.3724), cc.v3(0.3828, 0.2289), 0, 0.5);
        },
        solution_126: function (info, skills) {
            let pos = info.pos;
            return MonsterSolutions.solution_13(info, 350, 0, pos, cc.v3(-1.1906, 0.3715), cc.v3(-0.05, 0.3724), cc.v3(-0.3828, 0.2289), 0, 0.5);
        },
        solution_127: function (info, skills) {
            let pos = info.pos;
            return MonsterSolutions.solution_11(info, 350, 0, pos, cc.v3(0.3906, 0), cc.v3(0.3906, 0.132), 0, 0.5);
        },
        solution_128: function (info, skills) {
            let pos = info.pos;
            return MonsterSolutions.solution_11(info, 350, 0, pos, cc.v3(-0.3906, 0), cc.v3(-0.3906, 0.132), 0, 0.5);
        },
        solution_129: function (info, skills) {
            let pos = info.pos;
            return MonsterSolutions.solution_11(info, 450, 0, pos, cc.v3(0.9219, 0), cc.v3(0.9219, 0.1849), 0, 0.5);
        },
        solution_130: function (info, skills) {
            let pos = info.pos;
            return MonsterSolutions.solution_11(info, 450, 0, pos, cc.v3(-0.9219, 0), cc.v3(-0.9219, 0.1849), 0, 0.5);
        },
        solution_131: function (info, skills) {
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            let pos_1 = info.pos;
            let vec_1 = ai.posTransfer(pos_1);
            let vec_2 = ai.posTransfer(pos_1.add(cc.v3(0.1953, -0.184)));
            let vec_3 = ai.posTransfer(pos_1.add(cc.v3(0.4672, -0.184)));
            entity.setBaseAngle(130);
            entity.setTimerHandler(function (idx) {
                if (idx == 0) {
                    let posData = [vec_1, vec_2, vec_3];
                    this.setBezier(posData, 250, 0, 3);
                    this.setMovementType(2);
                }
                if (idx == 1) {
                    ai.autoUseSkill(this, true);
                }
                if (idx == 3) {
                    this.simpleHarmonic(10, 2, -90, cc.v3(1, 0), cc.v3(0, 0), cc.v3(0, 0), 0)
                    this.setMovementType(5);
                }
                if (idx == 4) {
                    let p = this.getBezierIsEnd()
                    if (p == true) {
                        this.setTimer(3, 0, 1, 0);
                        this.setTimer(1,0,1,0);
                        this.delTimer(4);
                    }
                }
            });
            entity.setTimer(0, 0, 1, 0);
            entity.setTimer(4, 0.016, 9999, 1);
            return entity;
        },
        solution_132: function (info, skills) {
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            let pos_1 = info.pos;
            let vec_1 = ai.posTransfer(pos_1);
            let vec_2 = ai.posTransfer(pos_1.add(cc.v3(-0.1953, -0.184)));
            let vec_3 = ai.posTransfer(pos_1.add(cc.v3(-0.4672, -0.184)));
            entity.setBaseAngle(-130);
            entity.setTimerHandler(function (idx) {
                if (idx == 0) {
                    let posData = [vec_1, vec_2, vec_3];
                    this.setBezier(posData, 250, 0, 2);
                    this.setMovementType(2);
                }
                if (idx == 1) {
                    ai.autoUseSkill(this, true);
                }
                if (idx == 3) {
                    this.simpleHarmonic(10, 2, -90, cc.v3(1, 0), cc.v3(0, 0), cc.v3(0, 0), 0)
                    this.setMovementType(5);
                }
                if (idx == 4) {
                    let p = this.getBezierIsEnd()
                    if (p == true) {
                        this.setTimer(1, 1, 1, 0);
                        this.setTimer(3, 0, 1, 0);
                        this.delTimer(4);
                    }
                }
            });
            entity.setTimer(0, 0, 1, 0);
            entity.setTimer(4, 0.016, 9999, 1);
            return entity;
        },
        solution_133: function (info, skills) {
            let pos = info.pos;
            return MonsterSolutions.solution_11(info, 300, 0, pos, cc.v3(0.3906, 0), cc.v3(0.3906, -0.132), 1, 0.5);
        },
        solution_134: function (info, skills) {
            let pos = info.pos;
            return MonsterSolutions.solution_11(info, 300, 0, pos, cc.v3(-0.3906, 0), cc.v3(-0.3906, -0.132), 1, 0.5);
        },
        solution_135: function (info, skills) {
            let pos = info.pos;
            return MonsterSolutions.solution_11(info, 450, 0, pos, cc.v3(0.9219, 0), cc.v3(0.9219, -0.1849), 1, 0.5);
        },
        solution_136: function (info, skills) {
            let pos = info.pos;
            return MonsterSolutions.solution_11(info, 450, 0, pos, cc.v3(-0.9219, 0), cc.v3(-0.9219, -0.1849), 1, 0.5);
        },
        solution_137: function (info, skills) {
            let ai = require('AIInterface');
            let vec = ai.posTransfer(info.pos.add(cc.v3(0.9688, 0)));
            return MonsterSolutions.solution_3(info, vec, 3.6, 60, 0, 3);
        },
        solution_138: function (info, skills) {
            let ai = require('AIInterface');
            let vec = ai.posTransfer(info.pos.add(cc.v3(-0.9688, 0)));
            return MonsterSolutions.solution_3(info, vec, 3.6, 60, 0, 3);
        },
        solution_139: function (info, skills) {
            let ai = require('AIInterface');
            let vec = ai.posTransfer(info.pos.add(cc.v3(0.5, 0)));
            return MonsterSolutions.solution_3(info, vec, 3.1, 60, 0, 3);
        },
        solution_140: function (info, skills) {
            let ai = require('AIInterface');
            let vec = ai.posTransfer(info.pos.add(cc.v3(-0.5, 0)));
            return MonsterSolutions.solution_3(info, vec, 3.1, 60, 0, 3);
        },
        solution_141: function (info, skills) {
            let ai = require('AIInterface');
            let vec = ai.posTransfer(info.pos.add(cc.v3(0, -0.6162)));
            return MonsterSolutions.solution_3(info, vec, 3.6, 60, 0, 3);
        },
        solution_142: function (info, skills) {
            let ai = require('AIInterface');
            let vec = ai.posTransfer(info.pos.add(cc.v3(0, -0.3521)));
            return MonsterSolutions.solution_3(info, vec, 3.1, 60, 0, 3);
        },
        solution_143: function (info, skills) {
            let ai = require('AIInterface');
            let vec = ai.posTransfer(info.pos.add(cc.v3(0.9688, 0.2729)));
            return MonsterSolutions.solution_3(info, vec, 3.6, 100, 0, 3);
        },
        solution_144: function (info, skills) {
            let ai = require('AIInterface');
            let vec = ai.posTransfer(info.pos.add(cc.v3(-0.9688, 0.2729)));
            return MonsterSolutions.solution_3(info, vec, 3.6, 100, 0, 3);
        },
        solution_145: function (info, skills) {
            let ai = require('AIInterface');
            let vec = ai.posTransfer(info.pos.add(cc.v3(0.5, 0.1408)));
            return MonsterSolutions.solution_3(info, vec, 3.1, 100, 0, 3);
        },
        solution_146: function (info, skills) {
            let ai = require('AIInterface');
            let vec = ai.posTransfer(info.pos.add(cc.v3(-0.5, 0.1408)));
            return MonsterSolutions.solution_3(info, vec, 3.1, 100, 0, 3);
        },
        solution_147: function (info, skills) {
            let ai = require('AIInterface');
            let vec = ai.posTransfer(info.pos.add(cc.v3(0.9688, -0.2729)));
            return MonsterSolutions.solution_3(info, vec, 3.6, 100, 0, 3);
        },
        solution_148: function (info, skills) {
            let ai = require('AIInterface');
            let vec = ai.posTransfer(info.pos.add(cc.v3(-0.9688, -0.2729)));
            return MonsterSolutions.solution_3(info, vec, 3.6, 100, 0, 3);
        },
        solution_149: function (info, skills) {
            let ai = require('AIInterface');
            let vec = ai.posTransfer(info.pos.add(cc.v3(0.5, -0.1409)));
            return MonsterSolutions.solution_3(info, vec, 3.1, 100, 0, 3);
        },
        solution_150: function (info, skills) {
            let ai = require('AIInterface');
            let vec = ai.posTransfer(info.pos.add(cc.v3(-0.5, -0.1409)));
            return MonsterSolutions.solution_3(info, vec, 3.1, 100, 0, 3);
        },
        solution_151: function (info, skills) {
            let ai = require('AIInterface');
            let vec = ai.posTransfer(info.pos.add(cc.v3(0.4688, 0)));
            return MonsterSolutions.solution_14(info, vec, 2, 50, 0, 3, 150, 0, -90, 0, 0, 0, 0);
        },
        solution_152: function (info, skills) {
            let ai = require('AIInterface');
            let vec = ai.posTransfer(info.pos.add(cc.v3(-0.4688, 0)));
            return MonsterSolutions.solution_14(info, vec, 2, 50, 0, 3, 150, 0, 90, 0, 0, 0, 0);
        },
        solution_153: function (info, skills) {
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            entity.setTimerHandler(function (idx) {
                if (idx == 0) {
                    this.setSpeed(cc.v3(0, -250), false);
                }
                if (idx == 1) {
                    this.setSpeed(ai.speedTransfer(250, -130), false);
                }
                if (idx == 2) {
                    this.setSpeed(cc.v3(0, 0), false);
                }
                if (idx == 3) {
                    ai.autoUseSkill(this, true);
                }
                if (idx == 4) {
                    this.simpleHarmonic(10, 2, -90, cc.v3(1, 0), cc.v3(0, 0), cc.v3(0, 0), 0)
                    this.setMovementType(5);
                }
            });
            entity.setTimer(0, 0, 1, 0);
            entity.setTimer(1, 1, 1, 0);
            entity.setTimer(2, 2, 1, 0);
            entity.setTimer(3, 2.5, 1, 0);
            entity.setTimer(4, 2.5, 1, 0);
            return entity;
        },
        solution_154: function (info, skills) {
            let ai = require('AIInterface');
            let entity = ai.createMonster(info);
            entity.setTimerHandler(function (idx) {
                if (idx == 0) {
                    this.setSpeed(cc.v3(0, -250), false);
                }
                if (idx == 1) {
                    this.setSpeed(ai.speedTransfer(250, -50), false);
                }
                if (idx == 2) {
                    this.setSpeed(cc.v3(0, 0), false);
                }
                if (idx == 3) {
                    ai.autoUseSkill(this, true);
                }
                if (idx == 4) {
                    this.simpleHarmonic(10, 2, -90, cc.v3(1, 0), cc.v3(0, 0), cc.v3(0, 0), 0)
                    this.setMovementType(5);
                }
            });
            entity.setTimer(0, 0, 1, 0);
            entity.setTimer(1, 1, 1, 0);
            entity.setTimer(2, 2, 1, 0);
            entity.setTimer(3, 2.5, 1, 0);
            entity.setTimer(4, 2.5, 1, 0);
            return entity;
        },
        solution_155: function (info, skills) {
            let ai = require('AIInterface');
            return MonsterSolutions.solution_15(info, 2, 0, 150, -90, 90, 0, 0, 0, 0);
        },
        solution_156: function (info, skills) {
            let ai = require('AIInterface');
            return MonsterSolutions.solution_15(info, 2, 0, 150, -90, -90, 0, 0, 0, 0);
        },
        solution_157: function (info, skills) {
            return MonsterSolutions.solution_16(info, 400, 250, 0, 1);
        },
        solution_158: function (info, skills) {
            return MonsterSolutions.solution_1(info, 230, -90, 0, -90, 0);
        },
        solution_159: function (info, skills) {
            return MonsterSolutions.solution_65(info, 1, 80);
        },
        solution_160: function (info, skills) {
            return MonsterSolutions.solution_65(info, 1.3, 80);
        },
        solution_161: function (info, skills) {
            return MonsterSolutions.solution_65(info, 1.4, 80);
        },
        solution_162: function (info, skills) {
            return MonsterSolutions.solution_65(info, 1.5, 80);
        },
        solution_163: function (info, skills) {
            let pos = info.pos;
            return MonsterSolutions.solution_5(info, 350, 0, pos, cc.v3(0.625, 0.3521), cc.v3(1.25, 0), 1, 1);
        },
        solution_164: function (info, skills) {
            let pos = info.pos;
            return MonsterSolutions.solution_5(info, 350, 0, pos, cc.v3(-0.625, 0.3521), cc.v3(-1.25, 0), 1, 1);
        },
        solution_165: function (info, skills) {
            let pos = info.pos;
            return MonsterSolutions.solution_5(info, 350, 0, pos, cc.v3(0.625, -0.3521), cc.v3(1.25, 0), 1, 1);
        },
        solution_166: function (info, skills) {
            let pos = info.pos;
            return MonsterSolutions.solution_5(info, 350, 0, pos, cc.v3(-0.625, -0.3521), cc.v3(-1.25, 0), 1, 1);
        },
        solution_167: function (info, skills) {
            return MonsterSolutions.solution_1(info, 300, 0, 0, 0, 0, -90);
        },
        solution_168: function (info, skills) {
            return MonsterSolutions.solution_1(info, 300, -180, 0, 0, 0, 90);
        },
        solution_169: function (info, skills) {
            return MonsterSolutions.solution_64(info, 250, -90, 0, -90, 0, 1);
        },
        solution_170: function (info, skills) {
            let pos = info.pos;
            return MonsterSolutions.solution_5(info, 420, 0, pos, cc.v3(0.92, 0), cc.v3(0.92, -0.6), 1, 1);
        },
        solution_171: function (info, skills) {
            let pos = info.pos;
            return MonsterSolutions.solution_5(info, 420, 0, pos, cc.v3(-0.92, 0), cc.v3(-0.92, -0.6), 1, 1);
        },
        solution_172: function (info, skills) {
            //导弹怪_向下追踪
            return MonsterSolutions.solution_17(info, 1400, -90, 0, 0, cc.v3(0, -1), cc.v3(0, 0), 1, 300);
        },
        solution_173: function (info, skills) {
            //导弹怪_向上
            return MonsterSolutions.solution_17(info, 1400, 90, 0, 0, cc.v3(0, 1), cc.v3(0, 0));
        },
        solution_174: function (info, skills) {
            //导弹怪_向上追踪
            return MonsterSolutions.solution_17(info, 1400, 90, 0, 0, cc.v3(0, 1), cc.v3(0, 0), 1, 150);
        },
        solution_175: function (info, skills) {
            //导弹怪_左斜向上
            return MonsterSolutions.solution_17(info, 1400, 60, 0, 0, cc.v3(1, 1.717), cc.v3(0, 0));
        },
        solution_176: function (info, skills) {
            //导弹怪_右斜向上
            return MonsterSolutions.solution_17(info, 1400, 120, 0, 0, cc.v3(-1, 1.717), cc.v3(0, 0));
        },
        solution_177: function (info, skills) {
            //导弹怪_左斜向下
            return MonsterSolutions.solution_17(info, 1400, -60, 0, 0, cc.v3(1, -1.717), cc.v3(0, 0));
        },
        solution_178: function (info, skills) {
            //导弹怪_右斜向下
            return MonsterSolutions.solution_17(info, 1400, -120, 0, 0, cc.v3(-1, -1.717), cc.v3(0, 0));
        },
        solution_179: function (info, skills) {
            //不转动陨石
            return MonsterSolutions.solution_64(info, 250, -90, 0, -90, 0, 1);
        },

        solution_200: function (info, skills) {
            //魔灵小怪1
            return MonsterSolutions.solution_63(info, 2, 1);
        },
        solution_201: function (info, skills) {
            //吸血鬼浮现1
            return MonsterSolutions.solution_62(info, 2, 2, 0.5, 0.5, 2);
        },
        solution_202: function (info, skills) {
            //吸血鬼浮现2
            return MonsterSolutions.solution_62(info, 2, 2, 1, 0, 1);
        },
        solution_203: function (info, skills) {
            //魔灵小怪2
            return MonsterSolutions.solution_61(info, 2, 1);
        },
    },
})