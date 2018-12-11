const Defines = require('BattleDefines')
const BattleManager = require('BattleManager')

const BulletSolutions = cc.Class({
    statics: {
        solution_10000(entity, bulletIds, scale) {
            let ai = require('AIInterface');
            // let bullet = ai.createBullet(bulletIds[0], entity);
            // bullet.setPosition(entity.getPosition().add(cc.v3(-20, 0)));
            // let vec = ai.speedTransfer(20, 0);
            // // bullet.setAutoRotation(true);
            // bullet.aimAt(ai.getHero());
            // bullet.edgeCollision = false;
            // bullet.setSpeed(vec);
            // bullet.setTimer(0, 1, 1);
            // bullet.setTimerHandler(function(idx) {
            //     // let angle = ai.getAngle(ai.getHero().getPosition(), this.getPosition());
            //     let v = ai.speedTransfer(425, 0);
            //     this.setSpeed(v);
            //     this.stopAim();
            //     this.setAutoRotation(true);
            //     this.chaseHero(0.1, 99, 0.5);
            // }); 
            let bullet = ai.createBullet(bulletIds[2], entity);
            bullet.setPosition(entity.getPosition()); //.add(cc.v3(20, 0))
            let vec = ai.speedTransfer(20, 0);
            // bullet.aimAt(ai.getHero());
            bullet.edgeCollision = false;
            bullet.setSpeed(vec);
            bullet.setTimer(0, 1, 1);
            // bullet.runScale(3.0, 1.0);
            // bullet.opacity = (255);
            // bullet.runOpacity(127, 1.5);
            bullet.setTimerHandler(function (idx) {
                let angle = ai.getAngle(ai.getHero().getPosition(), this.getPosition());
                let v = ai.speedTransfer(500, 0);
                this.setSpeed(v);
                // this.stopAim();
                // this.setAutoRotation(true);
                this.setObjectSelfCircle(100);
                this.stopSelfRotation();
                this.chaseMissile(ai.getHero().getPosition(), 3, 0.5, 10);
            });
        },
        solution_999(entity, bulletIds, scale) {
            //空方案
        },
        solution_100000(entity, bulletIds) {
            //电浆炮I
            let ai = require('AIInterface');
            let fake = ai.createFake(entity, Defines.ObjectType.OBJ_EXECUTE);
            fake.setTimerHandler(function (idx) {
                if (idx == 0) {
                    BattleManager.getInstance().showShadow(true);
                }
                if (idx == 1) {
                    BulletSolutions.solution_100000_1(entity, ai.posTransfer(cc.v3(100/640, 0)), bulletIds[0]);
                }
                if (idx == 2) {
                    BulletSolutions.solution_100000_1(entity, ai.posTransfer(cc.v3(220/640, 0)), bulletIds[0]);
                }
                if (idx == 3) {
                    BulletSolutions.solution_100000_1(entity, ai.posTransfer(cc.v3(540/640, 0)), bulletIds[0]);
                }
                if (idx == 4) {
                    BulletSolutions.solution_100000_1(entity, ai.posTransfer(cc.v3(420/640, 0)), bulletIds[0]);
                    BattleManager.getInstance().showShadow(false);
                    ai.releaseEntity(this);
                }
            });
            fake.setTimer(0, 0, 1, 0);
            fake.setTimer(1, 0.2, 1, 0);
            fake.setTimer(2, 0.4, 1, 0);
            fake.setTimer(3, 0.6, 1, 0);
            fake.setTimer(4, 0.8, 1, 0);
        },
        solution_100000_1: function (entity, pos, bulletId,damageInterval,allScreenDamage) {
            let ai = require('AIInterface');
            let execute = ai.createExecute(bulletId, pos);
            execute.setDamageInterval(damageInterval);
            execute.setAllScreenDamage(allScreenDamage);
            ai.eliminateAllMonsterBullets(false, true);
        },
        solution_100001(entity, bulletIds) {
            //电浆炮II
            let ai = require('AIInterface');
            let fake = ai.createFake(entity, Defines.ObjectType.OBJ_EXECUTE);
            fake.setTimerHandler(function (idx) {
                if (idx == 0) {
                    BattleManager.getInstance().showShadow(true);
                }
                if (idx == 1) {
                    BulletSolutions.solution_100000_1(entity, ai.posTransfer(cc.v3(100/640, 0)), bulletIds[0]);
                }
                if (idx == 2) {
                    BulletSolutions.solution_100000_1(entity, ai.posTransfer(cc.v3(220/640, 0)), bulletIds[0]);
                }
                if (idx == 3) {
                    BulletSolutions.solution_100000_1(entity, ai.posTransfer(cc.v3(540/640, 0)), bulletIds[0]);
                }
                if (idx == 4) {
                    BulletSolutions.solution_100000_1(entity, ai.posTransfer(cc.v3(420/640, 0)), bulletIds[0]);
                }
                if (idx == 5) {
                    BulletSolutions.solution_100000_1(entity, ai.posTransfer(cc.v3(150/640, 0)), bulletIds[0]);
                    BulletSolutions.solution_100000_1(entity, ai.posTransfer(cc.v3(490/640, 0)), bulletIds[0]);
                    BattleManager.getInstance().showShadow(false);
                    ai.releaseEntity(this);
                }
            });
            fake.setTimer(0, 0, 1, 0);
            fake.setTimer(1, 0.2, 1, 0);
            fake.setTimer(2, 0.4, 1, 0);
            fake.setTimer(3, 0.6, 1, 0);
            fake.setTimer(4, 0.8, 1, 0);
            fake.setTimer(5, 1.2, 1, 0);
        },
        solution_100002(entity, bulletIds) {
            //电浆炮III
            let ai = require('AIInterface');
            let fake = ai.createFake(entity, Defines.ObjectType.OBJ_EXECUTE);
            fake.setTimerHandler(function (idx) {
                if (idx == 0) {
                    BattleManager.getInstance().showShadow(true);
                }
                if (idx == 1) {
                    BulletSolutions.solution_100000_1(entity, ai.posTransfer(cc.v3(220/640, 0)), bulletIds[0]);
                }
                if (idx == 2) {
                    BulletSolutions.solution_100000_1(entity, ai.posTransfer(cc.v3(420/640, 0)), bulletIds[0]);
                }
                if (idx == 3) {
                    BulletSolutions.solution_100002_1(entity, ai.posTransfer(cc.v3(640/640, 800/1136)), bulletIds[0], -95);
                    BulletSolutions.solution_100002_1(entity, ai.posTransfer(cc.v3(0, 800/1136)), bulletIds[0], 85);
                }
                if (idx == 4) {
                    BulletSolutions.solution_100002_1(entity, ai.posTransfer(cc.v3(0, 650/1136)), bulletIds[0], 90);
                    BulletSolutions.solution_100002_1(entity, ai.posTransfer(cc.v3(640, 650/1136)), bulletIds[0], -90);
                }
                if (idx == 5) {
                    BulletSolutions.solution_100002_1(entity, ai.posTransfer(cc.v3(0, 650/1136)), bulletIds[0], 140);
                    BulletSolutions.solution_100002_1(entity, ai.posTransfer(cc.v3(640/640, 650/1136)), bulletIds[0], -40);
                    BattleManager.getInstance().showShadow(false);
                    ai.releaseEntity(this);
                }
            });
            fake.setTimer(0, 0, 1, 0);
            fake.setTimer(1, 0.2, 1, 0);
            fake.setTimer(2, 0.4, 1, 0);
            fake.setTimer(3, 0.6, 1, 0);
            fake.setTimer(4, 1.0, 1, 0);
            fake.setTimer(5, 1.2, 1, 0);
        },
        solution_100002_1: function (entity, pos, bulletId, ro) {
            let ai = require('AIInterface');
            let execute = ai.createExecute(bulletId, pos);
            if (typeof ro !== 'undefined') {
                execute.setBaseAngle(-ro);
            }
            ai.eliminateAllMonsterBullets(false);
        },
        solution_100003(entity, bulletIds) {
            //电浆炮IV
            let ai = require('AIInterface');
            let fake = ai.createFake(entity, Defines.ObjectType.OBJ_EXECUTE);
            fake.ctrlValue[0] = 0;
            fake.ctrlValue[1] = 0;
            fake.ctrlValue[2] = 0;
            fake.setTimerHandler(function (idx) {
                if (idx == 0) {
                    BattleManager.getInstance().showShadow(true);
                }
                if (idx == 1) {
                    BulletSolutions.solution_100000_1(entity, ai.posTransfer(cc.v3((65 + this.ctrlValue[0] * 170)/640, 0)), bulletIds[0]);
                    this.ctrlValue[0] += 1;
                }
                if (idx == 2) {
                    BulletSolutions.solution_100000_1(entity, ai.posTransfer((cc.v3(640 - 65 - this.ctrlValue[1] * 170)/640, 0)), bulletIds[0]);
                    this.ctrlValue[1] += 1;
                }
                if (idx == 3) {
                    BulletSolutions.solution_100000_1(entity, ai.posTransfer((cc.v3(65 + this.ctrlValue[2] * 170)/640, 0)), bulletIds[0]);
                    this.ctrlValue[2] += 1;
                }
                if (idx == 4) {
                    this.setTimer(2, 0.1, 4, 1)
                }
                if (idx == 5) {
                    this.setTimer(3, 0.1, 4, 1)
                }
                if (idx == 6) {
                    BattleManager.getInstance().showShadow(false);
                    ai.releaseEntity(this);
                }
            });
            fake.setTimer(0, 0, 1, 0);
            fake.setTimer(1, 0.1, 4, 0);
            fake.setTimer(4, 0.5, 1, 0);
            fake.setTimer(5, 0.9, 1, 0);
            fake.setTimer(6, 1.7, 1, 0);
        },
        solution_100004(entity, bulletIds) {
            //电浆炮V
            let ai = require('AIInterface');
            let fake = ai.createFake(entity, Defines.ObjectType.OBJ_EXECUTE);
            fake.ctrlValue[0] = 0;
            fake.setTimerHandler(function (idx) {
                if (idx == 0) {
                    BattleManager.getInstance().showShadow(true);
                }
                if (idx == 1) {
                    BulletSolutions.solution_100000_1(entity, ai.posTransfer(cc.v3((70 + this.ctrlValue[0] * 100)/640, 0)), bulletIds[0]);
                    BulletSolutions.solution_100000_1(entity, ai.posTransfer(cc.v3((570 - this.ctrlValue[0] * 100)/640, 0)), bulletIds[0]);
                    BulletSolutions.solution_100000_1(entity, ai.posTransfer(cc.v3((70 + this.ctrlValue[0] * 100)/640, 0)), bulletIds[0]);
                    BulletSolutions.solution_100000_1(entity, ai.posTransfer(cc.v3((570 - this.ctrlValue[0] * 100)/640, 0)), bulletIds[0]);
                    BulletSolutions.solution_100000_1(entity, ai.posTransfer((cc.v3(70 + this.ctrlValue[0] * 100)/640, 0)), bulletIds[0]);
                    BulletSolutions.solution_100000_1(entity, ai.posTransfer((cc.v3(570 - this.ctrlValue[0] * 100)/640, 0)), bulletIds[0]);
                    this.ctrlValue[0] += 1;
                }
                if (idx == 2) {
                    BattleManager.getInstance().showShadow(false);
                    ai.releaseEntity(this);
                }
            });
            fake.setTimer(0, 0, 1, 0);
            fake.setTimer(1, 0.2, 6, 0);
            fake.setTimer(2, 1.2, 1, 0);
        },
        solution_100005(entity, bulletIds) {
            //冰I
            let ai = require('AIInterface');
            let fake = ai.createFake(entity, Defines.ObjectType.OBJ_EXECUTE);
            fake.setTimerHandler(function (idx) {
                if (idx == 0) {
                    BattleManager.getInstance().showShadow(true);
                }
                if (idx == 1) {
                    BulletSolutions.solution_100000_1(entity, ai.posTransfer((cc.v3(70 + Math.random() * 500)/640, (350 + Math.random() * 500)/1136)), bulletIds[0]);
                }
                if (idx == 2) {
                    BattleManager.getInstance().showShadow(false);
                    ai.releaseEntity(this);
                }
            });
            fake.setTimer(0, 0, 1, 0);
            fake.setTimer(1, 0.1, 6, 0);
            fake.setTimer(2, 0.8, 1, 0);
        },
        solution_100006(entity, bulletIds) {
            //冰II
            let ai = require('AIInterface');
            let fake = ai.createFake(entity, Defines.ObjectType.OBJ_EXECUTE);
            let n = 1;
            let m = 1;
            fake.setTimerHandler(function (idx) {
                if (idx == 0) {
                    BattleManager.getInstance().showShadow(true);
                }
                if (idx == 1) {
                    this.ctrlValue[n] = ai.posTransfer(cc.v3((70 + Math.random() * 500)/640, (350 + Math.random() * 500)/1136));
                    BulletSolutions.solution_100000_1(entity, this.ctrlValue[n], bulletIds[0]);
                    n += 1;
                }
                if (idx == 2) {
                    BulletSolutions.solution_100000_1(entity, this.ctrlValue[m], bulletIds[0]);
                    m += 1;
                }
                if (idx == 3) {
                    this.setTimer(2, 0.1, 6, 1);
                }
                if (idx == 4) {
                    BattleManager.getInstance().showShadow(false);
                    ai.releaseEntity(this);
                }
            });
            fake.setTimer(0, 0, 1, 0);
            fake.setTimer(1, 0.1, 6, 0);
            fake.setTimer(3, 0.7, 1, 0);
            fake.setTimer(4, 1.4, 1, 0);
        },
        solution_100007(entity, bulletIds) {
            //冰III
            let ai = require('AIInterface');
            let fake = ai.createFake(entity, Defines.ObjectType.OBJ_EXECUTE);
            fake.setTimerHandler(function (idx) {
                if (idx == 0) {
                    BattleManager.getInstance().showShadow(true);
                }
                if (idx == 1) {
                    BulletSolutions.solution_100000_1(entity, ai.posTransfer(cc.v3((70 + Math.random() * 500)/640, (250 + Math.random() * 650)/1136), bulletIds[0]));
                }
                if (idx == 2) {
                    BattleManager.getInstance().showShadow(false);
                    ai.releaseEntity(this);
                }
            });
            fake.setTimer(0, 0, 1, 0);
            fake.setTimer(1, 0.1, 12, 0);
            fake.setTimer(2, 1.4, 1, 0);
        },
        solution_100008(entity, bulletIds) {
            //冰IV
            let ai = require('AIInterface');
            let fake = ai.createFake(entity, Defines.ObjectType.OBJ_EXECUTE);
            let n = 0;
            fake.ctrlValue[0] = ai.posTransfer(cc.v3(70/640, 880/1136));
            fake.ctrlValue[1] = ai.posTransfer(cc.v3(320/640, 880/1136));
            fake.ctrlValue[2] = ai.posTransfer(cc.v3(570/640, 880/1136));
            fake.ctrlValue[3] = ai.posTransfer(cc.v3(570/640, 670/1136));
            fake.ctrlValue[4] = ai.posTransfer(cc.v3(570/640, 460/1136));
            fake.ctrlValue[5] = ai.posTransfer(cc.v3(570/640, 250/1136));
            fake.ctrlValue[6] = ai.posTransfer(cc.v3(320/640, 250/1136));
            fake.ctrlValue[7] = ai.posTransfer(cc.v3(70/640, 250/1136));
            fake.ctrlValue[8] = ai.posTransfer(cc.v3(70/640, 460/1136));
            fake.ctrlValue[9] = ai.posTransfer(cc.v3(70/640, 670/1136));
            fake.ctrlValue[10] = ai.posTransfer(cc.v3(320/640, 670/1136));
            fake.ctrlValue[11] = ai.posTransfer(cc.v3(320/640, 460/1136));
            fake.setTimerHandler(function (idx) {
                if (idx == 0) {
                    BattleManager.getInstance().showShadow(true);
                }
                if (idx == 1) {
                    BulletSolutions.solution_100000_1(entity, this.ctrlValue[n], bulletIds[0]);
                    n += 1;
                }
                if (idx == 2) {
                    BattleManager.getInstance().showShadow(false);
                    ai.releaseEntity(this);
                }
            });
            fake.setTimer(0, 0, 1, 0);
            fake.setTimer(1, 0.1, 12, 0);
            fake.setTimer(2, 1.4, 1, 0);
        },
        solution_100009(entity, bulletIds) {
            //冰V
            let ai = require('AIInterface');
            let fake = ai.createFake(entity, Defines.ObjectType.OBJ_EXECUTE);
            fake.setTimerHandler(function (idx) {
                if (idx == 0) {
                    BattleManager.getInstance().showShadow(true);
                }
                if (idx == 1) {
                    BulletSolutions.solution_100000_1(entity, ai.posTransfer((cc.v3(70 + Math.random() * 500)/640, (250 + Math.random() * 325)/1136)), bulletIds[0]);
                    BulletSolutions.solution_100000_1(entity, ai.posTransfer((cc.v3(70 + Math.random() * 500)/640, (575 + Math.random() * 325))/1136), bulletIds[0]);
                }
                if (idx == 2) {
                    BattleManager.getInstance().showShadow(false);
                    ai.releaseEntity(this);
                }
            });
            fake.setTimer(0, 0, 1, 0);
            fake.setTimer(1, 0.1, 10, 0);
            fake.setTimer(2, 1.2, 1, 0);
        },
        solution_100010(entity, bulletIds) {
            //火I
            let ai = require('AIInterface');
            let fake = ai.createFake(entity, Defines.ObjectType.OBJ_EXECUTE);
            let n = 0;
            fake.ctrlValue[0] = ai.posTransfer(cc.v3(70/640, 880/1136));
            fake.ctrlValue[1] = ai.posTransfer(cc.v3(500/640, 880/1136));
            fake.ctrlValue[2] = ai.posTransfer(cc.v3(140/640, 670/1136));
            fake.ctrlValue[3] = ai.posTransfer(cc.v3(570/640, 670/1136));
            fake.setTimerHandler(function (idx) {
                if (idx == 0) {
                    BattleManager.getInstance().showShadow(true);
                }
                if (idx == 1) {
                    BulletSolutions.solution_100000_1(entity, this.ctrlValue[n], bulletIds[0]);
                    n += 1;
                }
                if (idx == 2) {
                    BattleManager.getInstance().showShadow(false);
                    ai.releaseEntity(this);
                }
            });
            fake.setTimer(0, 0, 1, 0);
            fake.setTimer(1, 0.1, 4, 0);
            fake.setTimer(2, 0.6, 1, 0);
        },
        solution_100011(entity, bulletIds) {
            //火II
            let ai = require('AIInterface');
            let fake = ai.createFake(entity, Defines.ObjectType.OBJ_EXECUTE);
            let n = 0;
            fake.ctrlValue[0] = ai.posTransfer(cc.v3(70/640, 830/1136));
            fake.ctrlValue[1] = ai.posTransfer(cc.v3(320/640, 880/1136));
            fake.ctrlValue[2] = ai.posTransfer(cc.v3(570/640, 830/1136));
            fake.ctrlValue[3] = ai.posTransfer(cc.v3(90/640, 730/1136));
            fake.ctrlValue[4] = ai.posTransfer(cc.v3(340/640, 730/1136));
            fake.ctrlValue[5] = ai.posTransfer(cc.v3(590/640, 730/1136));
            fake.setTimerHandler(function (idx) {
                if (idx == 0) {
                    BattleManager.getInstance().showShadow(true);
                }
                if (idx == 1) {
                    BulletSolutions.solution_100000_1(entity, this.ctrlValue[n], bulletIds[0]);
                    n += 1;
                }
                if (idx == 2) {
                    BattleManager.getInstance().showShadow(false);
                    ai.releaseEntity(this);
                }
            });
            fake.setTimer(0, 0, 1, 0);
            fake.setTimer(1, 0.1, 6, 0);
            fake.setTimer(2, 0.8, 1, 0);
        },
        solution_100012(entity, bulletIds) {
            //火III
            let ai = require('AIInterface');
            let fake = ai.createFake(entity, Defines.ObjectType.OBJ_EXECUTE);
            fake.ctrlValue[0] = 0;
            fake.setTimerHandler(function (idx) {
                if (idx == 0) {
                    BattleManager.getInstance().showShadow(true);
                }
                if (idx == 1) {
                    for (let n = 0; n < 3; ++n) {
                        BulletSolutions.solution_100000_1(entity, ai.posTransfer(cc.v3((70 + n * 250)/640, (850 - 300 * this.ctrlValue[0])/1136)), bulletIds[0]);
                    }
                    this.ctrlValue[0] += 1;
                }
                if (idx == 2) {
                    BattleManager.getInstance().showShadow(false);
                    ai.releaseEntity(this);
                }
            });
            fake.setTimer(0, 0, 1, 0);
            fake.setTimer(1, 0.1, 3, 0);
            fake.setTimer(2, 0.5, 1, 0);
        },
        solution_100013(entity, bulletIds) {
            //火IV
            let ai = require('AIInterface');
            let fake = ai.createFake(entity, Defines.ObjectType.OBJ_EXECUTE);
            fake.ctrlValue[0] = 0;
            fake.setTimerHandler(function (idx) {
                if (idx == 0) {
                    BattleManager.getInstance().showShadow(true);
                }
                if (idx == 1) {
                    for (let n = 0; n < 3; ++n) {
                        BulletSolutions.solution_100000_1(entity, ai.posTransfer(cc.v3((70 + n * 250)/640, (900 - 250 * this.ctrlValue[0])/1136)), bulletIds[0]);
                    }
                    this.ctrlValue[0] += 1;
                }
                if (idx == 2) {
                    BattleManager.getInstance().showShadow(false);
                    ai.releaseEntity(this);
                }
            });
            fake.setTimer(0, 0, 1, 0);
            fake.setTimer(1, 0.1, 4, 0);
            fake.setTimer(2, 0.5, 1, 0);
        },
        solution_100014(entity, bulletIds) {
            //火V
            let ai = require('AIInterface');
            let fake = ai.createFake(entity, Defines.ObjectType.OBJ_EXECUTE);
            fake.setTimerHandler(function (idx) {
                if (idx == 0) {
                    BattleManager.getInstance().showShadow(true);
                }
                if (idx == 1) {
                    BulletSolutions.solution_100000_1(entity, ai.posTransfer(cc.v3((70 + Math.random() * 500)/640, (250 + Math.random() * 325)/1136)), bulletIds[0]);
                    BulletSolutions.solution_100000_1(entity, ai.posTransfer(cc.v3((70 + Math.random() * 500)/640, (575 + Math.random() * 325)/1136)), bulletIds[0]);
                }
                if (idx == 2) {
                    BattleManager.getInstance().showShadow(false);
                    ai.releaseEntity(this);
                }
            });
            fake.setTimer(0, 0, 1, 0);
            fake.setTimer(1, 0.1, 10, 0);
            fake.setTimer(2, 1.2, 1, 0);
        },
        solution_100015(entity, bulletIds, y) {
            //地毯式轰炸
            let ai = require('AIInterface');
            BulletSolutions.solution_100000_1(entity, ai.posTransfer(cc.v3(50/640, y/1136)), bulletIds[0],0.032,false);
            BulletSolutions.solution_100000_1(entity, ai.posTransfer(cc.v3((50 + 135 * 4)/640, y/1136)), bulletIds[0],0.032,false);
            BulletSolutions.solution_100000_1(entity, ai.posTransfer(cc.v3((50 + 135)/640, y/1136)), bulletIds[0],0.032,false);
            BulletSolutions.solution_100000_1(entity, ai.posTransfer(cc.v3((50 + 135 * 3)/640, y/1136)), bulletIds[0],0.032,false);
            BulletSolutions.solution_100000_1(entity, ai.posTransfer(cc.v3((50 + 135 * 2)/640, y/1136)), bulletIds[0],0.032,false);
        },
        //掉落AI
        solution_buff(buffId, pos, angle) {
            var ai = require('AIInterface');
            let buff = ai.createBuff(buffId, pos);
            angle = typeof angle !== 'undefined' ? angle : Math.random() * 60 - 120;
            buff.setSpeed(ai.speedTransfer(200, angle));
            buff.setTimer(0, Defines.BATTLE_FRAME_SECOND, Defines.MAX_COUNT);
            buff.setTimerHandler(function (idx) {
                let hero = ai.getHero();
                if (hero != null && cc.isValid(hero)) {
                    if (hero.hp > 0) {
                        let hPos = hero.getPosition();
                        let v = this.getPosition().sub(hPos);
                        let length = v.mag();
                        if (idx == 0) {
                            if (length < 35) {
                                this.chaseHero(this.getSpeed().mul(2), this.getSpeed().mul(2), 360, 0, 1);
                                this.setMovementType(3);
                                this.delTimer(0);
                                //this.setTimer(1, 0, 1, 0);
                            }
                        }
                    }
                }
            });
        },
        solution_map_buff(id, pos, speed) {
            var ai = require('AIInterface');
            let buff = ai.createBuff(id, pos, false);
            buff.setSpeed(speed);
            buff.setScanChase(ai.getHero(), 200, speed.mag() * 2);
        },
        solution_map_sundries(id, pos, target, hp) {
            var ai = require('AIInterface');
            let sundries = ai.createSundries(id, pos, target, hp);
            //sundries.setSpeed(speed);
        },
        solution_crystal_single: function (buffId, pos, angle, speed, omega, omegaacc) {
            var ai = require('AIInterface');
            let buff = ai.createBuff(buffId, pos, false, true);
            buff.setZ(Defines.Z.CRTSTAL);
            let lineSpeed = ai.speedTransfer(speed, angle)
            buff.setLine(lineSpeed, cc.v3(-lineSpeed.x / 10, -1000));
            buff.setEntitySelfCircle(omega, omegaacc);
            //buff.setTimer(0, Defines.BATTLE_FRAME_SECOND, Defines.MAX_COUNT);
            buff.setTimer(0, 0.5, 1, 0);
            buff.setTimerHandler(function (idx) {
                if (idx == 0) {
                    let v = ai.getHero().getPosition().sub(this.getPosition());
                    this.chaseHero(v.normalize().mul(3000), v.normalize().mul(3000), this.getEntitySelfCircleOmega(), this.getEntitySelfCircleOmegaAcc(), 1);
                    this.setMovementType(3);
                }
                // let v = this.getPosition().sub(ai.getHero().getPosition());
                // let length = v.mag();
                // if (idx == 0) {
                //     if (length < 200) {
                //         this.chaseHero(cc.pMult(this.getSpeed(), 2), cc.pMult(this.getSpeed(), 0.2), 360, 0, 1);
                //         this.setMovementType(3);
                //         this.delTimer(0);
                //     }
                // }
            });
        },
        solution_crystal: function (type, pos) {
            //2 2绿色1蓝色
            //3 2绿色2蓝色
            //4 2绿色2蓝色2紫色
            //5 8蓝色8紫色
            switch (type) {
                case 2:
                    BulletSolutions.solution_crystal_single(Defines.Assist.GREENSTONE, pos, 45 + (Math.random() - 0.5) * 20, 600 + (Math.random() - 0.5) * 10, 8, -0.5);
                    BulletSolutions.solution_crystal_single(Defines.Assist.BLUESTONE, pos, 90 + (Math.random() - 0.5) * 20, 600 + (Math.random() - 0.5) * 10, 8, -0.5);
                    BulletSolutions.solution_crystal_single(Defines.Assist.GREENSTONE, pos, 135 + (Math.random() - 0.5) * 20, 600 + (Math.random() - 0.5) * 10, -8, 0.5);
                    break;
                case 3:
                    for (let i = 0; i < 4; i++) {
                        let stone = Defines.Assist.GREENSTONE;
                        if (i > 1) {
                            stone = Defines.Assist.BLUESTONE;
                        }
                        let angle = Math.random() * 180;
                        let omega = 8;
                        BulletSolutions.solution_crystal_single(stone, pos, angle, 600 + (Math.random() - 0.5) * 10, angle > 90 ? omega : -omega, angle > 90 ? 0.5 : -0.5);
                    }
                    break;
                case 4:
                    let a = 10;
                    for (let i = 0; i < 6; i++) {
                        BulletSolutions.solution_crystal_single(Defines.Assist.BLUESTONE, pos, a, 600, 8, -0.5);
                        a += 60;
                    }
                    a = -10;
                    for (let i = 0; i < 6; i++) {
                        BulletSolutions.solution_crystal_single(Defines.Assist.PURPERSTONE, pos, a, 600, -8, 0.5);
                        a += 60;
                    }
                    break;
                    // for (let i = 0; i < 6; i++) {
                    //     let stone = Defines.Assist.GREENSTONE;
                    //     if (i > 3) {
                    //         stone = Defines.Assist.PURPERSTONE;
                    //     } else if (i > 1) {
                    //         stone = Defines.Assist.BLUESTONE;
                    //     }
                    //     let angle = Math.random() * 360;
                    //     let omega = 8;
                    //     BulletSolutions.solution_crystal_single(stone, pos, angle, 600 + (Math.random() - 0.5) * 10, angle > 90 ? omega : -omega, angle > 90 ? -0.5 : 0.5);
                    // }
                    // break;
                case 5:
                    let angle = 10;
                    for (let i = 0; i < 10; i++) {
                        BulletSolutions.solution_crystal_single(Defines.Assist.BLUESTONE, pos, angle, 600, 8, -0.5);
                        angle += 36;
                    }
                    angle = -10;
                    for (let i = 0; i < 10; i++) {
                        BulletSolutions.solution_crystal_single(Defines.Assist.PURPERSTONE, pos, angle, 600, -8, 0.5);
                        angle += 36;
                    }
                    break;
                case 6:
                    BulletSolutions.solution_crystal_single(Defines.Assist.BLUESTONE, pos, 90 + (Math.random() - 0.5) * 20, 600 + (Math.random() - 0.5) * 10, 8, -0.5);
                    BulletSolutions.solution_crystal_single(Defines.Assist.GREENSTONE, pos, 135 + (Math.random() - 0.5) * 20, 600 + (Math.random() - 0.5) * 10, -8, 0.5);
                    break;
            }
        },
        solution_1: function (entity, cd) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimer(0, 0.4, cd / 0.4, 1);
            bullet.setTimerHandler(function (idx) {
                let bullet = ai.createBullet(2, entity);
                bullet.setSpeed(cc.v3(0, 1800));
            });
            // bullet.setTimerHandler(function(idx) {
            //     //     BulletSolutions.solution_2(1000, this.ctrlValue[0]);
            //     //     BulletSolutions.solution_2(1000, -this.ctrlValue[0]);
            //     //     if (this.ctrlValue[1] < 50) {
            //     //         this.ctrlValue[0] += 1;
            //     //     } else {
            //     //         this.ctrlValue[0] -= 1;
            //     //     }
            //     //     this.ctrlValue[1] += 1;
            //     //     console.log('timer handler');
            //     if (idx == 1) {
            //         BulletSolutions.solution_3();
            //         // BulletSolutions.solution_2(450, 0);
            //     } else if (idx == 2) {
            //         ai.releaseEntity(this);
            //     }
            // });
            // //第四个参数一定会延迟1帧
            // bullet.setTimer(1, 0.5, 10, 1);
            // bullet.setTimer(2, 5.1, 1, 0);
            // bullet.ctrlValue[0] = 5;
            // bullet.ctrlValue[1] = 0;
            // console.log("solution_1 called");
        },
        solution_2: function (entity, cd) {
            let ai = require('AIInterface');
            // let bullet = ai.createBullet(2, entity);
            // let vec = ai.speedTransfer(speed, angle);
            // bullet.setAutoRotation(true);
            // bullet.edgeCollision = true;
            // bullet.setSpeed(vec);
            let bullet = ai.createBullet(entity);
        },
        solution_3: function (entity, cd) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimer(0, 0.1, cd / 0.1, 1);
            bullet.setTimerHandler(function (idx) {
                let bullet = ai.createBullet(1, entity);
                bullet.setSpeed(cc.v3(0, 2200));
            });
            // let bullet = ai.createBullet(1, entity);
            // bullet.setPosition(new cc.Vec2(ai.getHeroPosition().x, ai.getHeroPosition().y));
            // bullet.setSpeed(ai.speedTransfer(300, 180));
            // // bullet.setSpeed(new cc.Vec2(450, 450));
            // bullet.edgeCollision = false;
            // // bullet.edgeCollision = true;
            // // bullet.setCirclePos(new cc.Vec2(ai.getHeroPosition().x, ai.getHeroPosition().y + 125));
            // // bullet.setCircleRSpeed(5);
            // // bullet.setCircleRSpeedAcc(0);
            // // bullet.setCircleOmega(50);
            // // bullet.setCircleOmegaAcc(50);
            // // bullet.setCircleSpeed(ai.speedTransfer(10, 0));
            // // bullet.setCircleSpeedAcc(new cc.Vec2(0, 10)); 
            // // bullet.setMovementType(1);
            // bullet.setAutoRotation(true);//自动跟随角度旋转
            // bullet.setTimer(0, 20, 1, 0);
            // bullet.setTimerHandler(function(idx) {
            //     ai.releaseEntity(this);
            // });
        },
        //test
        solution_4: function (entity, cd) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimer(0, 0.05, cd / 0.05, 1);
            bullet.setTimerHandler(function (idx) {
                let bullet = ai.createBullet(1, entity);
                bullet.setSpeed(cc.v3(0, 2400));
            });
            // let bullet = ai.createFake(entity);
            // bullet.setTimerHandler(function(idx)
            // {
            //     if (idx == 1) {
            //         BulletSolutions.solution_5(entity,2000,180);
            //         BulletSolutions.solution_5(entity,2000,170);
            //         BulletSolutions.solution_5(entity,2000,190);
            //     } else if (idx ==2){
            //         ai.releaseEntity(this);
            //     }
            // });
            // bullet.setTimer(1,0.1,50,1);
            // bullet.setTimer(2,5.1,1,0);
        },
        //简单原点的子弹
        solution_5: function (entity, speed, angle, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            //let vec = ai.speedTransfer(speed, angle);
            //bullet.setSpeed(vec);
            bullet.setSpeed(ai.speedTransfer(speed, angle), true);
        },
        solution_6: function () {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    BulletSolutions.solution_5(entity, 2000, 180);
                    this.ctrlValue[0] += 1;
                    this.vec = ai.getHeroPosition();
                    bullet.setTimer(2, 0.03, 1, 0);
                }
                if (idx == 2) {
                    BulletSolutions.solution_7(entity, 2000, 177, this.vec.add(cc.v3(-15, 0)));
                    BulletSolutions.solution_7(entity, 2000, 183, this.vec.add(cc.v3(15, 0)));
                    if (this.ctrlValue[0] > 24) {
                        ai.releaseEntity(this);
                    }
                }
            });
            bullet.setTimer(1, 0.2, 25, 0);
        },
        // 从不同位置打出
        solution_7: function (entity, speed, angle, v, bulletId,om) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            let sp = ai.speedTransfer(speed, angle);
            bullet.setSpeed(sp, true);
            if (typeof om !== 'undefined') {
                bullet.setEntitySelfCircle(om,0);
            }
        },
        //solution 8 to solution 107 第一版本弹幕方案
        //通用小怪弹幕 solution 8 to solution 18 
        solution_8: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    BulletSolutions.solution_5(entity, 500, -90, bulletIds[0]);
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
        },
        solution_9: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    BulletSolutions.solution_5(entity, 500, -90, bulletIds[0]);
                    BulletSolutions.solution_5(entity, 500, -105, bulletIds[0]);
                    BulletSolutions.solution_5(entity, 500, -75, bulletIds[0]);
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
        },
        solution_10: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 500, -90, vec.add(cc.v3(-30, 0)), bulletIds[0]);
                    BulletSolutions.solution_7(entity, 500, -90, vec.add(cc.v3(30, 0)), bulletIds[0]);
                    BulletSolutions.solution_7(entity, 500, -90, vec.add(cc.v3(-30, -60)), bulletIds[0]);
                    BulletSolutions.solution_7(entity, 500, -90, vec.add(cc.v3(30, -60)), bulletIds[0]);
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
        },
        solution_11: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 500, -90, vec.add(cc.v3(-40, 0)), bulletIds[0]);
                    BulletSolutions.solution_7(entity, 500, -90, vec.add(cc.v3(40, 0)), bulletIds[0]);
                    BulletSolutions.solution_7(entity, 500, -90, vec.add(cc.v3(0, 0)), bulletIds[0]);
                    BulletSolutions.solution_7(entity, 500, -90, vec.add(cc.v3(25, -40)), bulletIds[0]);
                    BulletSolutions.solution_7(entity, 500, -90, vec.add(cc.v3(-25, -40)), bulletIds[0]);
                    BulletSolutions.solution_7(entity, 500, -90, vec.add(cc.v3(0, -80)), bulletIds[0]);
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
        },
        solution_12: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    BulletSolutions.solution_12_1(entity, 300, -360, -60, bulletIds[0]);
                    BulletSolutions.solution_12_1(entity, 300, -360, 60, bulletIds[0]);
                    BulletSolutions.solution_12_1(entity, 300, -360, 180, bulletIds[0]);
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
        },
        solution_12_1: function (entity, ctspeed, anglespeed, angle, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setObjectAutoCircle(30, angle, 0, 0, anglespeed, 0, 1);
            bullet.setLine(cc.v3(0, -ctspeed), cc.v3(0, 0));
        },
        solution_13: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    let hero = ai.getHero();
                    if (hero == null) {
                        BulletSolutions.solution_7(entity, 500, -90, vec.add(cc.v3(-20, 0)), bulletIds[0]);
                        BulletSolutions.solution_7(entity, 500, -90, vec.add(cc.v3(20, 0)), bulletIds[0]);
                    } else {
                        let h = hero.getPosition();
                        let angle = ai.getAngle(vec, h);
                        BulletSolutions.solution_13_1(entity, 500, angle, vec.add(ai.speedTransfer(20, angle - 90)), bulletIds[0]);
                        BulletSolutions.solution_13_1(entity, 500, angle, vec.add(ai.speedTransfer(20, angle + 90)), bulletIds[0]);
                        ai.releaseEntity(this);
                    }
                }
            });
            bullet.setTimer(1, 0, 1, 0);
        },
        solution_13_1: function (entity, speed, angle, v, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            let vec = ai.speedTransfer(speed, angle);
            bullet.setSpeed(vec, true);
        },
        solution_14: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                let vec = entity.getPosition();
                if (idx == 1) {
                    BulletSolutions.solution_14_1(entity, 500, -90, vec.add(cc.v3(20, -50)), 0.4, bulletIds[0]);
                    BulletSolutions.solution_14_1(entity, 500, -90, vec.add(cc.v3(-20, -50)), 0.4, bulletIds[0]);
                }
                if (idx == 2) {
                    BulletSolutions.solution_14_1(entity, 500, -90, vec.add(cc.v3(50, -40)), 0.2, bulletIds[0]);
                    BulletSolutions.solution_14_1(entity, 500, -90, vec.add(cc.v3(-50, -40)), 0.2, bulletIds[0]);
                }
                if (idx == 3) {
                    BulletSolutions.solution_14_1(entity, 500, -90, vec.add(cc.v3(80, -30)), 0, bulletIds[0]);
                    BulletSolutions.solution_14_1(entity, 500, -90, vec.add(cc.v3(-80, -30)), 0, bulletIds[0]);
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.2, 1, 0);
            bullet.setTimer(3, 0.4, 1, 0);
        },
        //延迟射出
        solution_14_1: function (entity, speed, angle, v, delayed, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setSpeed(ai.speedTransfer(speed, angle), true);
                }
            });
            bullet.setTimer(1, delayed, 1, 0);
        },
        solution_15: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    BulletSolutions.solution_15_1(entity, 500, -90, bulletIds[0]);
                }
                if (idx == 2) {
                    BulletSolutions.solution_15_1(entity, 500, -84, bulletIds[0]);
                    BulletSolutions.solution_15_1(entity, 500, -96, bulletIds[0]);
                }
                if (idx == 3) {
                    BulletSolutions.solution_15_1(entity, 500, -90, bulletIds[0]);
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
            bullet.setTimer(3, 0.2, 1, 0);
        },
        solution_15_1: function (entity, speed, angle, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            let vec = ai.speedTransfer(speed, angle, true);
            bullet.setSpeed(vec);
        },
        solution_16: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    BulletSolutions.solution_5(entity, 300, -90, bulletIds[0]);
                    BulletSolutions.solution_5(entity, 300, -60, bulletIds[0]);
                    BulletSolutions.solution_5(entity, 300, -120, bulletIds[0]);
                }
                if (idx == 2) {
                    BulletSolutions.solution_5(entity, 400, -75, bulletIds[0]);
                    BulletSolutions.solution_5(entity, 400, -105, bulletIds[0]);
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
        },
        solution_17: function (entity, bulletIds, scale, num) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            if (num == undefined) {
                num = 6;
            }
            bullet.setTimerHandler(function (idx) {
                let vec = entity.getPosition();
                if (idx == 1) {
                    for (let n = 0; n < num; ++n) {
                        let angle = 360 / num;
                        BulletSolutions.solution_17_1(entity, 200, 30 + n * angle, vec, bulletIds[0]);
                    }
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
        },
        solution_17_1: function (entity, speed, angle, pos, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(pos);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setSpeed(ai.speedTransfer(speed, angle), true);
                }
                if (idx == 2) {
                    this.setEntityAutoCircle(entity.getPosition(), this.getPosition().sub(entity.getPosition()), 360, 0, 0, 0, 1);
                    this.setMovementType(1);
                }
                if (idx == 3) {
                    let a = ai.getAngle(pos, this.getPosition()) + 90;
                    this.setSpeed(ai.speedTransfer(500, a), true);
                    this.setMovementType(0);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.4, 1, 0);
            bullet.setTimer(3, 0.8, 1, 0);
        },
        solution_18: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    BulletSolutions.solution_18_1(entity, 300, -90, bulletIds[0], bulletIds[1]);
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
        },
        solution_18_1: function (entity, speed, angle, bulletId, bulletId1) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            let sp = ai.speedTransfer(speed, angle);
            bullet.setSpeed(sp, true);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let v = this.getPosition();
                    ai.releaseEntity(this);
                    BulletSolutions.solution_7(entity, 500, 45, v, bulletId1);
                    BulletSolutions.solution_7(entity, 500, -45, v, bulletId1);
                    BulletSolutions.solution_7(entity, 500, 135, v, bulletId1);
                    BulletSolutions.solution_7(entity, 500, -135, v, bulletId1);
                }
            });
            bullet.setTimer(1, 1.5, 1, 0);
        },
        //队长怪弹幕方案19-39
        solution_19: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                let vec = entity.getPosition();
                if (idx == 1) {
                    BulletSolutions.solution_19_1(entity, 350, -73, vec.add(cc.v3(30, 0)), bulletIds[0]);
                    BulletSolutions.solution_19_1(entity, 350, -107, vec.add(cc.v3(-30, 0)), bulletIds[0]);
                }
                if (idx == 2) {
                    BulletSolutions.solution_19_1(entity, 425, -75, vec.add(cc.v3(30, 0)), bulletIds[0]);
                    BulletSolutions.solution_19_1(entity, 425, -105, vec.add(cc.v3(-30, 0)), bulletIds[0]);
                }
                if (idx == 3) {
                    BulletSolutions.solution_19_1(entity, 500, -77, vec.add(cc.v3(30, 0)), bulletIds[0]);
                    BulletSolutions.solution_19_1(entity, 500, -103, vec.add(cc.v3(-30, 0)), bulletIds[0]);
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
            bullet.setTimer(3, 0.2, 1, 0);
        },
        solution_19_1: function (entity, speed, angle, v, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            let vec = ai.speedTransfer(speed, angle);
            bullet.setSpeed(vec, true);
        },
        solution_20: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    BulletSolutions.solution_20_1(entity, 700, -80, bulletIds[0]);
                    BulletSolutions.solution_20_1(entity, 700, -90, bulletIds[0]);
                    BulletSolutions.solution_20_1(entity, 700, -100, bulletIds[0]);
                }
            });
            bullet.setTimer(1, 0.4, 2, 0);
        },
        solution_20_1: function (entity, speed, angle, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            let vec = ai.speedTransfer(speed, angle);
            bullet.setSpeed(vec, true);
        },
        //瞄准菱形子弹
        solution_21: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.ctrlValue[0] = this.ctrlValue[0] + 1;
                    let vec = entity.getPosition();
                    let hero = ai.getHero();
                    if (hero == null) {
                        if (this.ctrlValue[0] == 1 || this.ctrlValue[0] == 5) {
                            BulletSolutions.solution_7(entity, 300, -90, vec, bulletIds[0]);
                        }
                        if (this.ctrlValue[0] == 2 || this.ctrlValue[0] == 4) {
                            BulletSolutions.solution_7(entity, 300, -90 + 2, vec, bulletIds[0]);
                            BulletSolutions.solution_7(entity, 300, -90 - 2, vec, bulletIds[0]);
                        }
                        if (this.ctrlValue[0] == 3) {
                            BulletSolutions.solution_7(entity, 300, -90 + 4, vec, bulletIds[0]);
                            BulletSolutions.solution_7(entity, 300, -90 - 4, vec, bulletIds[0]);
                        }
                        if (this.ctrlValue[0] > 4) {
                            ai.releaseEntity(this);
                        }
                    } else {
                        let pos = hero.getPosition();
                        let angle = ai.getAngle(vec, pos);
                        if (this.ctrlValue[0] == 1 || this.ctrlValue[0] == 5) {
                            BulletSolutions.solution_21_1(entity, 300, angle, vec.add(ai.speedTransfer(0, angle - 90)), bulletIds[0]);
                        }
                        if (this.ctrlValue[0] == 2 || this.ctrlValue[0] == 4) {
                            BulletSolutions.solution_21_1(entity, 300, angle + 2, vec.add(ai.speedTransfer(0, angle - 90)), bulletIds[0]);
                            BulletSolutions.solution_21_1(entity, 300, angle - 2, vec.add(ai.speedTransfer(0, angle + 90)), bulletIds[0]);
                        }
                        if (this.ctrlValue[0] == 3) {
                            BulletSolutions.solution_21_1(entity, 300, angle + 4, vec.add(ai.speedTransfer(0, angle - 90)), bulletIds[0]);
                            BulletSolutions.solution_21_1(entity, 300, angle - 4, vec.add(ai.speedTransfer(0, angle + 90)), bulletIds[0]);
                        }
                        if (this.ctrlValue[0] > 4) {
                            ai.releaseEntity(this);
                        }
                    }
                }
            });
            bullet.setTimer(1, 0.08, 5, 0);
        },
        solution_21_1: function (entity, speed, angle, v, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            let vec = ai.speedTransfer(speed, angle);
            bullet.setSpeed(vec, true);
        },
        solution_22: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    BulletSolutions.solution_22_1(entity, 600, -87, bulletIds[0]);
                    BulletSolutions.solution_22_1(entity, 600, -93, bulletIds[0]);
                    bullet.setTimer(2, 0.05, 1, 0);
                }
                if (idx == 2) {
                    BulletSolutions.solution_22_1(entity, 600, -79, bulletIds[0]);
                    BulletSolutions.solution_22_1(entity, 600, -101, bulletIds[0]);
                    bullet.setTimer(3, 0.05, 1, 0);
                }
                if (idx == 3) {
                    BulletSolutions.solution_22_1(entity, 600, -109, bulletIds[0]);
                    BulletSolutions.solution_22_1(entity, 600, -71, bulletIds[0]);
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
        },
        solution_22_1: function (entity, speed, angle, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            let vec = ai.speedTransfer(speed, angle);
            bullet.setSpeed(vec, true);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    vec = ai.speedTransfer(250, angle);
                    this.setSpeed(vec, true);
                }
            });
            bullet.setTimer(1, 0.45, 1, 0);
        },
        solution_23: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let vec = entity.getPosition();
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    BulletSolutions.solution_23_1(entity, 600, -98, vec.add(cc.v3(40, 0)), bulletIds[0]);
                    BulletSolutions.solution_23_1(entity, 600, -94, vec.add(cc.v3(40, 0)), bulletIds[0]);
                    BulletSolutions.solution_23_1(entity, 600, -90, vec.add(cc.v3(40, 0)), bulletIds[0]);
                    BulletSolutions.solution_23_1(entity, 600, -86, vec.add(cc.v3(40, 0)), bulletIds[0]);
                    BulletSolutions.solution_23_1(entity, 600, -82, vec.add(cc.v3(40, 0)), bulletIds[0]);
                }
                if (idx == 2) {
                    BulletSolutions.solution_23_1(entity, 600, -98, vec.add(cc.v3(-40, 0)), bulletIds[1]);
                    BulletSolutions.solution_23_1(entity, 600, -94, vec.add(cc.v3(-40, 0)), bulletIds[1]);
                    BulletSolutions.solution_23_1(entity, 600, -90, vec.add(cc.v3(-40, 0)), bulletIds[1]);
                    BulletSolutions.solution_23_1(entity, 600, -86, vec.add(cc.v3(-40, 0)), bulletIds[1]);
                    BulletSolutions.solution_23_1(entity, 600, -82, vec.add(cc.v3(-40, 0)), bulletIds[1]);
                }
                if (idx == 3) {
                    BulletSolutions.solution_23_1(entity, 600, -98, vec.add(cc.v3(40, 0)), bulletIds[0]);
                    BulletSolutions.solution_23_1(entity, 600, -94, vec.add(cc.v3(40, 0)), bulletIds[0]);
                    BulletSolutions.solution_23_1(entity, 600, -90, vec.add(cc.v3(40, 0)), bulletIds[0]);
                    BulletSolutions.solution_23_1(entity, 600, -86, vec.add(cc.v3(40, 0)), bulletIds[0]);
                    BulletSolutions.solution_23_1(entity, 600, -82, vec.add(cc.v3(40, 0)), bulletIds[0]);
                }
                if (idx == 4) {
                    BulletSolutions.solution_23_1(entity, 600, -98, vec.add(cc.v3(-40, 0)), bulletIds[1]);
                    BulletSolutions.solution_23_1(entity, 600, -94, vec.add(cc.v3(-40, 0)), bulletIds[1]);
                    BulletSolutions.solution_23_1(entity, 600, -90, vec.add(cc.v3(-40, 0)), bulletIds[1]);
                    BulletSolutions.solution_23_1(entity, 600, -86, vec.add(cc.v3(-40, 0)), bulletIds[1]);
                    BulletSolutions.solution_23_1(entity, 600, -82, vec.add(cc.v3(-40, 0)), bulletIds[1]);
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.2, 1, 0);
            bullet.setTimer(3, 0.4, 1, 0);
            bullet.setTimer(4, 0.6, 1, 0);
        },
        solution_23_1: function (entity, speed, angle, v, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            let vec = ai.speedTransfer(speed, angle);
            bullet.setSpeed(vec, true);
        },
        solution_24: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let vec = entity.getPosition();
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    BulletSolutions.solution_24_1(entity, 300, 0, vec, 1, bulletIds[0]);
                    BulletSolutions.solution_24_1(entity, 300, 0, vec, 2, bulletIds[0]);
                    BulletSolutions.solution_24_1(entity, 300, 0, vec, 3, bulletIds[0]);
                    BulletSolutions.solution_24_1(entity, 300, 0, vec, 4, bulletIds[0]);
                    BulletSolutions.solution_24_1(entity, 300, -180, vec, 1, bulletIds[0]);
                    BulletSolutions.solution_24_1(entity, 300, -180, vec, 2, bulletIds[0]);
                    BulletSolutions.solution_24_1(entity, 300, -180, vec, 3, bulletIds[0]);
                    BulletSolutions.solution_24_1(entity, 300, -180, vec, 4, bulletIds[0]);
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
        },
        solution_24_1: function (entity, speed, angle, v, num, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            let vec = ai.speedTransfer(speed, angle);
            bullet.setPosition(v);
            bullet.setSpeed(vec);
            bullet.setObjectSelfCircle(6);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setSpeed(ai.speedTransfer(0, -90), true);
                    this.setTimer(2, 1.2, 1, 0);
                }
                if (idx == 2) {
                    this.setSpeed(ai.speedTransfer(400, -90), true);
                }
            });
            bullet.setTimer(1, 0.2 * num, 1, 0);
        },
        solution_25: function (entity, bulletIds, scale, num, r) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let vec = entity.getPosition();
            if (num == undefined) {
                num = 12;
            }
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    for (let n = 0; n < num; ++n) {
                        BulletSolutions.solution_25_1(entity, vec, n * (360 / num), bulletIds[0]);
                    }
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
        },
        solution_25_1: function (entity, v, a, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.runScale(1, 0.8);
            let r = ai.speedTransfer(40, a);
            bullet.setEntityAutoCircle(v, r, 480, 0, 80, 0, 1);
            bullet.setMovementType(1);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let hero = ai.getHero();
                    if (hero == null) {
                        this.setSpeed(ai.speedTransfer(250, -90), true);
                    } else {
                        let pos = hero.getPosition()
                        let angle = ai.getAngle(v, pos);
                        this.setSpeed(ai.speedTransfer(250, angle), true);
                        this.setMovementType(0);
                    }
                }
            });
            bullet.setTimer(1, 1, 1, 0);
        },
        solution_26: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_26_1(entity, 800, 10 * this.ctrlValue[0] - 90, vec.add(cc.v3(100, 0)), bulletIds[0]);
                    BulletSolutions.solution_26_1(entity, 800, -10 * this.ctrlValue[0] - 90, vec.add(cc.v3(-100, 0)), bulletIds[0]);
                    this.ctrlValue[0] += 1;
                    if (this.ctrlValue[0] > 2) {
                        ai.releaseEntity(this);
                    }
                }
            });
            bullet.setTimer(1, 0.15, 3, 0);
        },
        solution_26_1: function (entity, speed, angle, v, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            let vec = ai.speedTransfer(speed, angle);
            bullet.setSpeed(vec, true);
        },
        solution_27: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    for (let n = 0; n < 12; ++n) {
                        BulletSolutions.solution_27_1(entity, 520, 30 * n - 90, vec, bulletIds[0]);
                    }
                    this.ctrlValue[0] += 1;
                    if (this.ctrlValue[0] > 3) {
                        ai.releaseEntity(this);
                    }
                }
            });
            bullet.setTimer(1, 0.3, 4, 1);
        },
        solution_27_1: function (entity, speed, angle, v, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.setSpeed(ai.speedTransfer(speed, angle), true);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let r = this.getPosition().sub(entity.getPosition())
                    this.setEntityAutoCircle(v, r, 100, 0, 100, 0, 1);
                    this.setMovementType(1);
                    this.setTimer(2, 1, 1, 0);
                }
                if (idx == 2) {
                    let sp = this.getSpeed()
                    this.setSpeed(sp, true);
                    this.setMovementType(0);
                }
            });
            bullet.setTimer(1, 0.4, 1, 0);
        },
        solution_28: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            let vec = entity.getPosition();
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    BulletSolutions.solution_28_1(entity, vec.add(cc.v3(0, -200)), bulletIds[0], 2);
                }
                if (idx == 2) {
                    this.ctrlValue[0] += 1;
                    let angle_1 = ai.getAngle(vec.add(cc.v3(0, -200)), vec.add(cc.v3(30, 0)));
                    let angle_2 = ai.getAngle(vec.add(cc.v3(0, -200)), vec.add(cc.v3(-30, 0)));
                    //aFV(目标，发射点) 方向向量是目标-发射点
                    BulletSolutions.solution_28_2(entity, vec.add(cc.v3(30, 0)), -angle_2, bulletIds[0], 2);
                    BulletSolutions.solution_28_2(entity, vec.add(cc.v3(-30, 0)), -angle_1, bulletIds[0], 2);
                    if (this.ctrlValue[0] > 8) {
                        ai.releaseEntity(this);
                    }
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.2, 9, 0);
        },
        solution_28_1: function (entity, v, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.setObjectSelfCircle(4);
            bullet.runScale(3.6, 1.5);
            bullet.setSpeed(ai.speedTransfer(0, 0));
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let hero = ai.getHero();
                    if (hero == null) {
                        this.setSpeed(ai.speedTransfer(400, -90));
                    } else {
                        this.setSpeed(ai.speedTransfer(400, -90));
                        //this.chaseHero(0.02, 35, 0);
                        this.chaseTo(hero, this.getSpeed(), cc.v3(0, 0), 100, 10, 2, 0, 0.2);
                        this.setMovementType(3);
                        this.setTimer(2, 0.7, 1, 0);
                    }
                }
                if (idx == 2) {
                    let vec = this.getPosition();
                    ai.releaseEntity(this);
                    for (let n = 0; n < 6; ++n) {
                        BulletSolutions.solution_7(entity, 500, n * 60 + 30, vec, bulletId);
                    }
                }
            });
            bullet.setTimer(1, 2, 1, 0);
        },
        solution_28_2: function (entity, v, angle, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.setObjectSelfCircle(4);
            bullet.setSpeed(ai.speedTransfer(700, angle));
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.25, 1, 0);
        },
        solution_29: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let vec = entity.getPosition();
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    BulletSolutions.solution_29_1(entity, 700, -90, vec.add(cc.v3(-30, -100)), bulletIds[0]);
                    BulletSolutions.solution_29_1(entity, 700, -90, vec.add(cc.v3(0, -50)), bulletIds[0]);
                }
                if (idx == 2) {
                    BulletSolutions.solution_29_1(entity, 700, -80, vec.add(cc.v3(-30, -100)), bulletIds[0]);
                    BulletSolutions.solution_29_1(entity, 700, -80, vec.add(cc.v3(0, -50)), bulletIds[0]);
                }
                if (idx == 3) {
                    BulletSolutions.solution_29_1(entity, 700, 260, vec.add(cc.v3(-30, -100)), bulletIds[0]);
                    BulletSolutions.solution_29_1(entity, 700, 260, vec.add(cc.v3(0, -50)), bulletIds[0]);
                }
            });
            bullet.setTimer(1, 0.1, 1, 0);
            bullet.setTimer(2, 0.3, 1, 0);
            bullet.setTimer(3, 0.5, 1, 0);
        },
        solution_29_1: function (entity, speed, angle, v, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            let vec = ai.speedTransfer(speed, angle);
            bullet.setSpeed(vec, true);
        },
        solution_30: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let vec = entity.getPosition();
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.bullet1 = BulletSolutions.solution_30_1(entity, 600, vec, bulletIds[0]);
                } else if (idx == 2) {
                    BulletSolutions.solution_30_1(entity, 600, this.bullet1.getPosition(), bulletIds[0]);
                    this.bullet1 = null;
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.4, 1, 0);
            bullet.setTimer(2, 0.8, 1, 0);
        },
        solution_30_1: function (entity, speed, v, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.setObjectSelfCircle(6);
            bullet.setSpeed(ai.speedTransfer(speed, -90));
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setSpeed(ai.speedTransfer(0, 0));
                    this.setTimer(2, 0.5, 1, 0);
                }
                if (idx == 2) {
                    let vec = this.getPosition();
                    ai.releaseEntity(this);
                    let n = Math.random() * 5;
                    BulletSolutions.solution_zixuan(entity, 300, n * 30 - 90, vec, 6, bulletId); //自旋方案(速度，方向，位置，转速)
                    BulletSolutions.solution_zixuan(entity, 300, n * 30 + 90, vec, 6, bulletId);
                }
                if (idx == 3) {
                    this.runOpacity(0, 0.4);
                    this.setTimer(4, 0.4, 1, 0);
                }
                if (idx == 4) {
                    this.runOpacity(255, 0.4);
                }
            });
            bullet.setTimer(1, 0.3, 1, 0);
            bullet.setTimer(3, 0, 1, 0);
            return bullet;
        },
        //自旋方案
        solution_zixuan: function (entity, speed, angle, v, n, bulletId, sc) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.setObjectSelfCircle(n);
            bullet.setSpeed(ai.speedTransfer(speed, angle));
        },
        solution_31: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let vec = entity.getPosition();
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    BulletSolutions.solution_31_1(entity, 400, -88, vec.add(cc.v3(-50, -50)), bulletIds[0]);
                    BulletSolutions.solution_31_1(entity, 400, -92, vec.add(cc.v3(50, -50)), bulletIds[0]);
                } else if (idx == 2) {
                    BulletSolutions.solution_31_1(entity, 400, -90, vec.add(cc.v3(-50, -50)), bulletIds[0]);
                    BulletSolutions.solution_31_1(entity, 400, -90, vec.add(cc.v3(50, -50)), bulletIds[0]);
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
        },
        solution_31_1: function (entity, speed, angle, v, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            let vec = ai.speedTransfer(speed, angle);
            bullet.setSpeed(vec, true);
        },
        solution_32: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let vec = entity.getPosition();
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    BulletSolutions.solution_32_1(entity, 400, -86, vec.add(cc.v3(-50, -50)), bulletIds[0]);
                    BulletSolutions.solution_32_1(entity, 400, -94, vec.add(cc.v3(50, -50)), bulletIds[0]);
                } else if (idx == 2) {
                    BulletSolutions.solution_32_1(entity, 400, -90, vec.add(cc.v3(-50, -50)), bulletIds[0]);
                    BulletSolutions.solution_32_1(entity, 400, -90, vec.add(cc.v3(50, -50)), bulletIds[0]);
                } else if (idx == 3) {
                    BulletSolutions.solution_32_1(entity, 400, -94, vec.add(cc.v3(-50, -50)), bulletIds[0]);
                    BulletSolutions.solution_32_1(entity, 400, -86, vec.add(cc.v3(50, -50)), bulletIds[0]);
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
            bullet.setTimer(3, 0.2, 1, 0);
        },
        solution_32_1: function (entity, speed, angle, v, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            let vec = ai.speedTransfer(speed, angle);
            bullet.setSpeed(vec, true);
        },
        solution_33: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_33_1(entity, 400, -88, vec.add(cc.v3(-40, -50)), bulletIds[0]);
                    BulletSolutions.solution_33_1(entity, 400, -92, vec.add(cc.v3(40, -50)), bulletIds[0]);
                } else if (idx == 2) {
                    let vec = entity.getPosition();
                    this.ctrlValue[0] += 1;
                    BulletSolutions.solution_33_1(entity, 400, -90, vec.add(cc.v3(-80, -25)), bulletIds[1]);
                    BulletSolutions.solution_33_1(entity, 400, -90, vec.add(cc.v3(80, -25)), bulletIds[1]);
                    if (this.ctrlValue[0] > 3) {
                        ai.releaseEntity(this);
                    }
                } else if (idx == 3) {
                    bullet.setTimer(2, 0.6, 4, 1);
                }
            });
            bullet.setTimer(1, 0.6, 4, 1);
            bullet.setTimer(3, 0.3, 1, 0);
        },
        solution_33_1: function (entity, speed, angle, v, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            let vec = ai.speedTransfer(speed, angle);
            bullet.setSpeed(vec, true);
        },
        //公用按角度依次打出弹幕 solution_34
        solution_34: function (entity, bulletIds, scale, angle) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            if (angle == undefined) {
                angle = 25;
            }
            let n = 180 / angle + 1;
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    this.ctrlValue[0] += 1;
                    BulletSolutions.solution_34_1(entity, 200, this.ctrlValue[0] * angle - angle - 180, vec, bulletIds[0]);
                    if (this.ctrlValue[0] >= n) {
                        ai.releaseEntity(this);
                    }
                }
            });
            bullet.setTimer(1, 0.05, n, 0);
        },
        solution_34_1: function (entity, speed, angle, v, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            let vec = ai.speedTransfer(speed, angle);
            bullet.setSpeed(vec, true);
        },
        solution_35: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let vec = entity.getPosition().add(cc.v3(0, -50));
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    for (let n = 0; n < 9; ++n) {
                        let roundpos_1 = ai.speedTransfer(50, 40 * n);
                        BulletSolutions.solution_35_1(entity, vec, vec.add(roundpos_1), 40 * n - 90, bulletIds[0]);
                    }
                    for (let n = 0; n < 6; ++n) {
                        let roundpos_2 = ai.speedTransfer(25, 60 * n);
                        BulletSolutions.solution_35_2(entity, vec, vec.add(roundpos_2), 60 * n - 90, bulletIds[1]);
                    }
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
        },
        solution_35_1: function (entity, ct, pos, angle_1, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(pos);
            bullet.setObjectSelfCircle(2);
            ct = ct.add(cc.v3(0, 0));
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setObjectAutoCircle(50, angle_1, 0, 0, 180, 0, 1);
                    this.setSpeed(cc.v3(0, -340));
                    //向下
                }
                if (idx == 2) {
                    let vec = this.getSpeed();
                    let angle = ai.getAngle(vec, cc.v3(0, 0));
                    //向上
                    this.setMovementType(0);
                    this.setSpeed(ai.speedTransfer(300, angle));
                    this.setSpeedAcc(ai.speedTransfer(-300, angle));
                    this.setTimer(4, 5, 1, 0);
                }
                if (idx == 4) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 1, 1, 0);
        },
        solution_35_2: function (entity, ct, pos, angle_2, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(pos);
            bullet.setObjectSelfCircle(-2);
            ct = ct.add(cc.v3(0, 0));
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setObjectAutoCircle(50, angle_2, 0, 0, -240, 0, 1);
                    this.setSpeed(cc.v3(0, -340));
                }
                if (idx == 2) {
                    let vec = this.getSpeed();
                    let angle = ai.getAngle(vec, cc.v3(0, 0));
                    this.setSpeed(ai.speedTransfer(300, angle));
                    this.setSpeedAcc(ai.speedTransfer(-200, angle));
                    this.setTimer(4, 1.5, 1, 0);
                }
                if (idx == 4) {
                    this.setSpeedAcc(ai.speedTransfer(0, 0));
                    this.runOpacity(0, 2);
                    this.setTimer(5, 2, 1, 0);
                }
                if (idx == 5) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 1, 1, 0);
        },
        solution_36: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let vec = entity.getPosition();
            let speed = 500;
            let angle = 20;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let delay = 0;
                    BulletSolutions.solution_36_1(entity, speed, -angle - 90, vec, delay, bulletIds[0]);
                    BulletSolutions.solution_36_1(entity, speed, angle - 90, vec, delay, bulletIds[0]);
                    BulletSolutions.solution_36_1(entity, speed, angle / 2 - 90, vec, delay, bulletIds[0]);
                    BulletSolutions.solution_36_1(entity, speed, -angle / 2 - 90, vec, delay, bulletIds[0]);
                } else if (idx == 2) {
                    let delay = 0.15;
                    BulletSolutions.solution_36_1(entity, speed, angle / 4 - 90, vec, delay, bulletIds[0]);
                    BulletSolutions.solution_36_1(entity, speed, -angle / 4 - 90, vec, delay, bulletIds[0]);
                } else if (idx == 3) {
                    let delay = 0.3;
                    BulletSolutions.solution_36_1(entity, speed, -angle - 90, vec, delay, bulletIds[0]);
                    BulletSolutions.solution_36_1(entity, speed, angle - 90, vec, delay, bulletIds[0]);
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.15, 1, 0);
            bullet.setTimer(3, 0.3, 1, 0);
        },
        solution_36_1: function (entity, speed, angle, v, delay, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.setObjectSelfCircle(4);
            bullet.setSpeed(ai.speedTransfer(speed, angle));
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setSpeed(ai.speedTransfer(0, 0));
                    this.runOpacity(0, 1.5);
                    this.setTimer(2, 1.5, 1, 0);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 1.5 - delay, 1, 0);
        },
        solution_37: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    this.ctrlValue[0] += 1;
                    for (let n = 0; n < 8; ++n) {
                        BulletSolutions.solution_37_1(entity, vec, n * (360 / 8), bulletIds[0]);
                    }
                    if (this.ctrlValue[0] > 3) {
                        ai.releaseEntity(this);
                    }
                }
            });
            bullet.setTimer(1, 0.05, 4, 0);
        },
        solution_37_1: function (entity, ct, v, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(ct);
            bullet.setObjectAutoCircle(30, v, 0, 0, 360, 0, 1);
            let hero = ai.getHero();
            if (hero == null) {
                bullet.setSpeed(ai.speedTransfer(600, -90));
            } else {
                let pos = hero.getPosition();
                let angle = ai.getAngle(ct, pos);
                bullet.setSpeed(ai.speedTransfer(600, angle));
            }
        },
        solution_38: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    this.ctrlValue[0] += 1;
                    for (let n = 0; n < 3; ++n) {
                        BulletSolutions.solution_zixuan(entity, 600, -110 + n * 20, vec, 1, bulletIds[0])
                    }
                    if (this.ctrlValue[0] > 2) {
                        ai.releaseEntity(this);
                    }
                }
            });
            bullet.setTimer(1, 0.15, 3, 0);
        },
        solution_39: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let vec_1 = entity.getPosition().add(cc.v3(30, 0));
            let vec_2 = entity.getPosition().add(cc.v3(-30, 0));
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.ctrlValue[0] += 1;
                    let angle = 5;
                    for (let n = 0; n < 8; ++n) {
                        BulletSolutions.solution_39_1(entity, vec_1, n * (360 / 8), -angle - 90, bulletIds[0]);
                        BulletSolutions.solution_39_1(entity, vec_2, n * (360 / 8), angle - 90, bulletIds[0]);
                    }
                    if (this.ctrlValue[0] > 3) {
                        ai.releaseEntity(this);
                    }
                }
            });
            bullet.setTimer(1, 0, 1, 0);
        },
        solution_39_1: function (entity, ct, v, angle, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(ct);
            bullet.setObjectAutoCircle(15, v, 15, 0, 720, 0, 1);
            bullet.setSpeed(ai.speedTransfer(400, angle));
        },
        //精英怪弹幕方案 40 -67
        solution_40: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let vec = entity.getPosition();
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    BulletSolutions.solution_40_1(entity, vec, 200, -90, bulletIds[0]);
                    BulletSolutions.solution_40_1(entity, vec, 200, 90, bulletIds[0]);
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
        },
        solution_40_1: function (entity, v, speed, angle, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.setSpeed(ai.speedTransfer(speed, angle), true);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = this.getPosition();
                    ai.releaseEntity(this);
                    for (let n = 0; n < 20; ++n) {
                        BulletSolutions.solution_7(entity, 200, n * 18 + 9, vec, bulletId);
                    }
                }
            });
            bullet.setTimer(1, 1, 1, 0);
        },
        solution_41: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    this.ctrlValue[0] += 1;
                    for (let n = 0; n < 18; ++n) {
                        BulletSolutions.solution_41_1(entity, 300, n * 20 - 60, vec, bulletIds[0]);
                    }
                    if (this.ctrlValue[0] > 2) {
                        ai.releaseEntity(this);
                    }
                }
            });
            bullet.setTimer(1, 0.5, 3, 1);
        },
        solution_41_1: function (entity, speed, angle, v, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.setObjectSelfCircle(-8);
            bullet.setSpeed(ai.speedTransfer(speed, angle), true);
            bullet.setSpeedAcc(ai.speedTransfer(-150, angle));
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setSpeed(ai.speedTransfer(0, 0), true);
                    this.setTimer(2, 1, 1, 0);
                }
                if (idx == 2) {
                    this.setSpeedAcc(cc.v3(0, -200));
                    //可以跟踪 (以下) 
                    //let angle = ai.getAngle(v, ai.randMonster().getPosition());
                    //this.setSpeedAcc(ai.speedTransfer(-200, angle));
                }
            });
            bullet.setTimer(1, 1, 1, 0);
        },
        solution_42: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    for (let n = 0; n < 5; ++n) {
                        BulletSolutions.solution_42_1(entity, 250, n * 30 - 150, vec, 2.5, bulletIds[0]);
                    }
                    this.setTimer(2, 0.5, 1, 0);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    for (let n = 0; n < 4; ++n) {
                        BulletSolutions.solution_42_1(entity, 250, n * 30 - 135, vec, 2, bulletIds[1]);
                    }
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
        },
        solution_42_1: function (entity, speed, angle, v, t, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.setSpeed(ai.speedTransfer(speed, angle), true);
            bullet.setObjectSelfCircle(4);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setSpeed(ai.speedTransfer(0, 0), true);
                    this.setTimer(2, 0.5, 1, 0);
                }
                if (idx == 2) {
                    this.setTimer(3, 0.05, 4, 0);
                }
                if (idx == 3) {
                    let vec = this.getPosition();
                    if (this.ctrlValue[0] < 4) {
                        BulletSolutions.solution_42_2(entity, 100, this.ctrlValue[0] * 90 - 135, vec, bulletId);
                    }
                    this.ctrlValue[0] += 1;
                    if (this.ctrlValue[0] == 4) {
                        ai.releaseEntity(this);
                    }
                }
            });
            bullet.setTimer(1, t, 1, 0);
        },
        solution_42_2: function (entity, speed, angle, v, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.setSpeed(ai.speedTransfer(speed, angle), true);
            bullet.setSpeedAcc(ai.speedTransfer(-50, angle));
            bullet.setObjectSelfCircle(4);
            bullet.runOpacity(0, 2);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 2, 1, 0);
        },
        solution_43: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let speed = 325;
            let angle = 26;
            bullet.ctrlValue[0] = 3; //控制多少波
            bullet.ctrlValue[1] = 0; //记录是第几波
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setTimer(2, 0.7, this.ctrlValue[0], 1);
                } else if (idx == 2) {
                    let vec = entity.getPosition();
                    for (let n = 0; n < 7; ++n) {
                        BulletSolutions.solution_43_1(entity, speed, -78 + angle * n + this.ctrlValue[1] * 13, vec, 1, bulletIds[0]);
                        BulletSolutions.solution_43_1(entity, speed, -102 - angle * n + this.ctrlValue[1] * 13, vec, 1, bulletIds[0]);
                    }
                    this.setTimer(3, 0.1, 1, 0);
                } else if (idx == 3) {
                    let vec = entity.getPosition();
                    for (let n = 0; n < 7; ++n) {
                        BulletSolutions.solution_43_1(entity, speed, -80 + angle * n + this.ctrlValue[1] * 13, vec, 2, bulletIds[1]);
                        BulletSolutions.solution_43_1(entity, speed, -100 - angle * n + this.ctrlValue[1] * 13, vec, 2, bulletIds[1]);
                        BulletSolutions.solution_43_1(entity, speed, -76 + angle * n + this.ctrlValue[1] * 13, vec, 2, bulletIds[1]);
                        BulletSolutions.solution_43_1(entity, speed, -104 - angle * n + this.ctrlValue[1] * 13, vec, 2, bulletIds[1]);
                    }
                    this.setTimer(4, 0.1, 1, 0);
                } else if (idx == 4) {
                    let vec = entity.getPosition();
                    for (let n = 0; n < 7; ++n) {
                        BulletSolutions.solution_43_1(entity, speed, -82 + angle * n + this.ctrlValue[1] * 13, vec, 3, bulletIds[2]);
                        BulletSolutions.solution_43_1(entity, speed, -98 - angle * n + this.ctrlValue[1] * 13, vec, 3, bulletIds[2]);
                        BulletSolutions.solution_43_1(entity, speed, -74 + angle * n + this.ctrlValue[1] * 13, vec, 3, bulletIds[2]);
                        BulletSolutions.solution_43_1(entity, speed, -106 - angle * n + this.ctrlValue[1] * 13, vec, 3, bulletIds[2]);
                    }
                    this.setTimer(5, 0.1, 1, 0);
                } else if (idx == 5) {
                    let vec = entity.getPosition();
                    for (let n = 0; n < 7; ++n) {
                        BulletSolutions.solution_43_1(entity, speed, -84 + angle * n + this.ctrlValue[1] * 13, vec, 4, bulletIds[3]);
                        BulletSolutions.solution_43_1(entity, speed, -96 - angle * n + this.ctrlValue[1] * 13, vec, 4, bulletIds[3]);
                        BulletSolutions.solution_43_1(entity, speed, -72 + angle * n + this.ctrlValue[1] * 13, vec, 4, bulletIds[3]);
                        BulletSolutions.solution_43_1(entity, speed, -108 - angle * n + this.ctrlValue[1] * 13, vec, 4, bulletIds[3]);
                    }
                    this.ctrlValue[1] += 1;
                    if (this.ctrlValue[1] == this.ctrlValue[0]) {
                        ai.releaseEntity(this);
                    }
                }
            });
            bullet.setTimer(1, 0, 1, 0);
        },
        solution_43_1: function (entity, speed, angle, v, t, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.setSpeed(ai.speedTransfer(speed, angle), true);
            if (t == 2) {
                bullet.setSpeedAcc(ai.speedTransfer(-3, angle));
            } else if (t == 3) {
                bullet.setSpeedAcc(ai.speedTransfer(-6, angle));
            } else if (t == 4) {
                bullet.setSpeedAcc(ai.speedTransfer(-9, angle));
            }
        },
        solution_44: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let angle = 60;
            let speed = 300;
            bullet.ctrlValue[0] = 0;
            bullet.ctrlValue[1] = 3; //设定次数
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    for (let n = 0; n < 360 / angle; ++n) {
                        BulletSolutions.solution_7(entity, speed, angle * n - 90, vec, bulletIds[0]);
                    }
                    this.setTimer(2, 0.025, 1, 0);
                } else if (idx == 2) {
                    let vec = entity.getPosition();
                    for (let n = 0; n < 360 / angle; ++n) {
                        BulletSolutions.solution_7(entity, speed, angle * n - 100, vec, bulletIds[0]);
                    }
                    this.setTimer(3, 0.025, 1, 0);
                } else if (idx == 3) {
                    let vec = entity.getPosition();
                    for (let n = 0; n < 360 / angle; ++n) {
                        BulletSolutions.solution_7(entity, speed, angle * n - 110, vec, bulletIds[0]);
                    }
                    this.setTimer(4, 0.2, 1, 0);
                } else if (idx == 4) {
                    let vec = entity.getPosition();
                    for (let n = 0; n < 360 / angle; ++n) {
                        BulletSolutions.solution_7(entity, speed, angle * n - 90, vec, bulletIds[0]);
                    }
                    this.setTimer(5, 0.025, 1, 0);
                } else if (idx == 5) {
                    let vec = entity.getPosition();
                    for (let n = 0; n < 360 / angle; ++n) {
                        BulletSolutions.solution_7(entity, speed, angle * n - 80, vec, bulletIds[0]);
                    }
                    this.setTimer(6, 0.025, 1, 0);
                } else if (idx == 6) {
                    let vec = entity.getPosition();
                    for (let n = 0; n < 360 / angle; ++n) {
                        BulletSolutions.solution_7(entity, speed, angle * n - 70, vec, bulletIds[0]);
                    }
                    this.ctrlValue[1] += 1;
                    if (this.ctrlValue[0] == this.ctrlValue[1]) {
                        ai.releaseEntity(this);
                    }
                }
            });
            bullet.setTimer(1, 0.65, bullet.ctrlValue[1], 0);
        },
        solution_45: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let angle = 15;
            let speed = 500;
            bullet.ctrlValue[0] = 0;
            bullet.ctrlValue[1] = 8;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec_1 = entity.getPosition().add(cc.v3(-70, -80));
                    let vec_2 = entity.getPosition().add(cc.v3(70, -80));
                    BulletSolutions.solution_7(entity, speed, angle * (this.ctrlValue[0] - 3) - 90, vec_1, bulletIds[0]);
                    BulletSolutions.solution_7(entity, speed, angle * (3 - this.ctrlValue[0]) - 90, vec_2, bulletIds[0]);
                    this.ctrlValue[0] += 1;
                    if (this.ctrlValue[0] == this.ctrlValue[1]) {
                        ai.releaseEntity(this);
                    }
                }
            });
            bullet.setTimer(1, 0.2, bullet.ctrlValue[1], 0);
        },
        solution_46: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let angle = 12;
            let speed = 600;
            bullet.ctrlValue[0] = 0;
            bullet.ctrlValue[1] = 15;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, speed, angle * (this.ctrlValue[0] - 8) - 90, vec, bulletIds[0]);
                    BulletSolutions.solution_7(entity, speed, angle * (-this.ctrlValue[0] - 8) - 90, vec, bulletIds[0]);
                    BulletSolutions.solution_7(entity, speed, angle * (this.ctrlValue[0] - 18) - 90, vec, bulletIds[0]);
                    BulletSolutions.solution_7(entity, speed, angle * (-this.ctrlValue[0] - 18) - 90, vec, bulletIds[0]);
                    BulletSolutions.solution_7(entity, speed, angle * (this.ctrlValue[0] + 2) - 90, vec, bulletIds[0]);
                    BulletSolutions.solution_7(entity, speed, angle * (-this.ctrlValue[0] + 2) - 90, vec, bulletIds[0]);
                    this.ctrlValue[0] += 1;
                    if (this.ctrlValue[0] == this.ctrlValue[1]) {
                        ai.releaseEntity(this);
                    }
                }
            });
            bullet.setTimer(1, 0.1, bullet.ctrlValue[1], 0);
        },
        solution_47: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let angle = 12;
            let speed = 1000;
            bullet.ctrlValue[0] = 0;
            bullet.ctrlValue[1] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_47_1(entity, speed, angle * (this.ctrlValue[0] - 5) - 90, vec, bulletIds[0]);
                    this.ctrlValue[0] += 1;
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_47_1(entity, speed, angle * (-this.ctrlValue[1] + 5) - 90, vec, bulletIds[0]);
                    this.ctrlValue[1] += 1;
                }
                if (idx == 3) {
                    this.ctrlValue[0] = 0;
                    this.setTimer(1, 0.03, 10, 0);
                }
                if (idx == 4) {
                    this.ctrlValue[1] = 0;
                    this.setTimer(2, 0.03, 10, 0);
                }
                if (idx == 5) {
                    this.setTimer(4, 0.6, 3, 1);
                }
            });
            bullet.setTimer(3, 0.6, 3, 1);
            bullet.setTimer(5, 0.3, 1, 0);
        },
        solution_47_1: function (entity, speed, angle, v, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            let vec = ai.speedTransfer(speed, angle);
            bullet.setSpeed(vec, true);
            bullet.setObjectSelfCircle(1);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setSpeed(ai.speedTransfer(200, angle), true);
                    this.runScale(3, 4);
                }
            });
            bullet.setTimer(1, 0.4, 1, 0);
        },
        solution_48: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    this.ctrlValue[0] += 1;
                    let randvec = cc.v3(Math.random() * 640, vec.y + 80 - Math.random() * 30);
                    BulletSolutions.solution_48_1(entity, -100, -90, randvec, 200, bulletIds[0], bulletIds[1]);
                    if (this.ctrlValue[0] >= 20) {
                        ai.releaseEntity(this);
                    }
                }
            });
            bullet.setTimer(1, 0.5, 20, 1);
        },
        solution_48_1: function (entity, speed, angle, v, speedacc, bulletId, bulletId1) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            let vec = ai.speedTransfer(-speed, angle);
            bullet.setSpeed(vec, true);
            bullet.setSpeedAcc(ai.speedTransfer(speedacc, angle));
            bullet.opacity = (0);
            bullet.runOpacity(255, -speed / speedacc);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    if (Math.random() < 0.3) {
                        this.setTimer(2, Math.random(), 1, 0);
                    } else {
                        this.setTimer(3, 0.1, 1, 0);
                    }
                }
                if (idx == 2) {
                    for (let n = 0; n < 12; ++n) {
                        BulletSolutions.solution_7(entity, 300, 30 * n - 90, this.getPosition(), bulletId1);
                    }
                    ai.releaseEntity(this);
                }
                if (idx == 3) {
                    this.setSpeedAcc(ai.speedTransfer(0, angle));
                }
            });
            bullet.setTimer(1, 1.5, 1, 0);
        },
        solution_49: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.ctrlValue[1] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 400, -85 + 10 * this.ctrlValue[0], vec, bulletIds[0]);
                    BulletSolutions.solution_7(entity, 400, -95 - 10 * this.ctrlValue[0], vec, bulletIds[0]);
                    this.ctrlValue[0] += 1;
                    if (this.ctrlValue[0] >= 3) {
                        this.setTimer(2, 0.1, 1, 0);
                    }
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 400, -75, vec, bulletIds[0]);
                    BulletSolutions.solution_7(entity, 400, -105, vec, bulletIds[0]);
                    this.setTimer(3, 0.05, 1, 0);
                }
                if (idx == 3) {
                    this.setTimer(4, 0.05, 3, 0);
                }
                if (idx == 4) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 400, -85 + 10 * this.ctrlValue[1], vec, bulletIds[0]);
                    BulletSolutions.solution_7(entity, 400, -95 - 10 * this.ctrlValue[1], vec, bulletIds[0]);
                    this.ctrlValue[1] += 1;
                    if (this.ctrlValue[1] >= 3) {
                        ai.releaseEntity(this);
                    }
                }
            });
            bullet.setTimer(1, 0.05, 3, 0);
        },
        solution_50: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.angleMax = 60;
            bullet.angleMin = 5;
            bullet.angleStep = 5;
            bullet.angleCount = (bullet.angleMax - bullet.angleMin) / bullet.angleStep;
            bullet.ctrlValue[0] = 0;
            bullet.ctrlValue[1] = bullet.angleMax;
            bullet.ctrlValue[2] = 0;
            bullet.ctrlValue[3] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec_1 = entity.getPosition().add(cc.v3(-100, 0));
                    let vec_2 = entity.getPosition().add(cc.v3(100, 0));
                    let angle = this.ctrlValue[1];
                    BulletSolutions.solution_7(entity, 300, angle - 90, vec_1, bulletIds[0]);
                    BulletSolutions.solution_7(entity, 300, -angle - 90, vec_2, bulletIds[0]);
                    if (this.ctrlValue[0] == 0) {
                        angle -= this.angleStep;
                        this.ctrlValue[1] = angle;
                        if (angle < this.angleMin) {
                            this.ctrlValue[0] = 1;
                        }
                    } else {
                        angle += this.angleStep;
                        this.ctrlValue[1] = angle;
                        if (angle > this.angleMax) {
                            this.ctrlValue[0] = 0;
                        }
                    }
                } else if (idx == 2) {
                    let vec_1 = entity.getPosition().add(cc.v3(-100, 0));
                    let vec_2 = entity.getPosition().add(cc.v3(100, 0));
                    this.ctrlValue[3] += 1;
                    BulletSolutions.solution_7(entity, 400, -90, vec_1, bulletIds[1]);
                    BulletSolutions.solution_7(entity, 400, -140, vec_2, bulletIds[1]);
                    BulletSolutions.solution_7(entity, 400, -60, vec_1, bulletIds[1]);
                    BulletSolutions.solution_7(entity, 400, -120, vec_2, bulletIds[1]);
                    BulletSolutions.solution_7(entity, 400, -80, vec_1, bulletIds[1]);
                    BulletSolutions.solution_7(entity, 400, -100, vec_2, bulletIds[1]);
                    if (this.ctrlValue[3] == 5) {
                        ai.releaseEntity(this);
                    }
                } else if (idx == 3) {
                    let vec_1 = entity.getPosition().add(cc.v3(-100, 0));
                    let vec_2 = entity.getPosition().add(cc.v3(100, 0));
                    this.ctrlValue[2] += 1;
                    if (this.ctrlValue[2] % 2 == 0) {
                        BulletSolutions.solution_50_1(entity, 300, -80, vec_2, bulletIds[2], 0.7);
                        BulletSolutions.solution_50_1(entity, 300, -100, vec_1, bulletIds[2], 0.7);
                    } else {
                        BulletSolutions.solution_50_1(entity, 300, -85, vec_2, bulletIds[2], 0.7);
                        BulletSolutions.solution_50_1(entity, 300, -95, vec_1, bulletIds[2], 0.7);
                    }
                }
            });
            bullet.setTimer(1, 0.1, bullet.angleCount * 4, 0);
            bullet.setTimer(2, bullet.angleCount * 4 * 0.1 / 5, 5, 0);
            bullet.setTimer(3, 1, 4, 0);
        },
        solution_50_1: function (entity, speed, angle, v, bulletId, sc) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.ctrlValue[0] += 1;
                    BulletSolutions.solution_zixuan(entity, speed + this.ctrlValue[0] * 100, angle, v, 1, bulletId, sc);
                    if (this.ctrlValue[0] == 3) {
                        ai.releaseEntity(this);
                    }
                }
            });
            bullet.setTimer(1, 0.2, 3, 0);
        },
        solution_51: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    for (let n = 0; n < 12; ++n) {
                        let vec = entity.getPosition();
                        BulletSolutions.solution_7(entity, 300, 30 * n + 15 + this.ctrlValue[0] * 15 - 90, vec, bulletIds[0]);
                    }
                    this.setTimer(2, 0.05, 1, 0);
                }
                if (idx == 2) {
                    for (let n = 0; n < 12; ++n) {
                        let vec = entity.getPosition();
                        BulletSolutions.solution_7(entity, 300, 30 * n + 15 + 5 + this.ctrlValue[0] * 15 - 90, vec, bulletIds[0]);
                        BulletSolutions.solution_7(entity, 300, 30 * n + 15 - 5 + this.ctrlValue[0] * 15 - 90, vec, bulletIds[0]);
                    }
                    this.ctrlValue[0] += 1;
                    if (this.ctrlValue[0] == 3) {
                        ai.releaseEntity(this);
                    }
                }
            });
            bullet.setTimer(1, 0.5, 3, 1);
        },
        solution_52: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let vec_1 = entity.getPosition().add(cc.v3(-120, 0));
            let vec_2 = entity.getPosition().add(cc.v3(120, 0));
            let vec_3 = entity.getPosition().add(cc.v3(0, -60));
            let angle = 60;
            let speed = 200;
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    BulletSolutions.solution_52_1(entity, vec_2, -angle - 90, bulletIds[0]);
                    BulletSolutions.solution_52_1(entity, vec_1, angle - 90, bulletIds[0]);
                } else if (idx == 2) {
                    BulletSolutions.solution_52_2(entity, vec_3, bulletIds[1]);
                } else if (idx == 3) {
                    this.setTimer(4, 0.2, 9, 0);
                } else if (idx == 4) {
                    this.ctrlValue[0] += 1;
                    for (let n = 0; n < 6; ++n) {
                        BulletSolutions.solution_52_3(entity, vec_3, -30 + n * 12 - 90, this.ctrlValue[0], bulletIds[2]);
                    }
                    if (this.ctrlValue[0] >= 9) {
                        ai.releaseEntity(this);
                    }
                }
            });
            bullet.setTimer(1, 0.2, 10, 0);
            bullet.setTimer(2, 0.7, 1, 0);
            bullet.setTimer(3, 2.2, 1, 0);
        },
        solution_52_1: function (entity, v, angle, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.setObjectSelfCircle(1);
            bullet.setSpeed(ai.speedTransfer(200, angle), true);
            bullet.runOpacity(25, 0.7);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.7, 1, 0);
        },
        solution_52_2: function (entity, v, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.setObjectSelfCircle(1);
            bullet.opacity = (0);
            bullet.runOpacity(255, 0.5);
            bullet.runScale(2.5, 1.5)
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.runOpacity(0, 2.1);
                    this.runScale(0.25, 3);
                    this.setTimer(2, 3, 1, 0);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 2, 1, 0);
        },
        solution_52_3: function (entity, v, angle, n, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.setObjectSelfCircle(1);
            bullet.setSpeed(ai.speedTransfer(600, angle), true);
            bullet.setSpeedAcc(ai.speedTransfer(-200, angle));
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setSpeed(ai.speedTransfer(0, angle), true);
                    this.setSpeedAcc(ai.speedTransfer(0, angle));
                    this.setObjectSelfCircle(4);
                    this.runScale(1.2, 0.5);
                    this.setTimer(2, 0.5, 1, 0);
                }
                if (idx == 2) {
                    this.runOpacity(0, 1.6);
                    this.setTimer(3, 1.6, 1, 0);
                }
                if (idx == 3) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 2.1 - 0.2 * n, 1, 0);
        },
        solution_53: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let vec_1 = entity.getPosition().add(cc.v3(35, 0));
            let vec_2 = entity.getPosition().add(cc.v3(-35, 0));
            bullet.ctrlValue[0] = 0;
            bullet.ctrlValue[1] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_53_1(entity, vec_1, 30 - this.ctrlValue[0] * 15 - 90, bulletIds[0]);
                    BulletSolutions.solution_53_1(entity, vec_2, -30 + this.ctrlValue[0] * 15 - 90, bulletIds[0]);
                    BulletSolutions.solution_53_1(entity, vec, -90, bulletIds[1]);
                    this.ctrlValue[0] += 1;
                    this.ctrlValue[1] += 1;
                    if (this.ctrlValue[1] >= 6) {
                        ai.releaseEntity(this);
                    }
                } else if (idx == 2) {
                    this.setTimer(1, 0.05, 3, 0);
                    this.ctrlValue[0] = 1;
                }
            });
            bullet.setTimer(1, 0.05, 3, 0);
            bullet.setTimer(2, 0.25, 1, 0)
        },
        solution_53_1: function (entity, v, angle, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.setSpeed(ai.speedTransfer(500, angle), true);
            bullet.setSpeedAcc(ai.speedTransfer(600, angle));
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setSpeedAcc(cc.v3(0, 0));
                }
            });
            bullet.setTimer(1, 0.5, 1, 0);
        },
        solution_54: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let vec = entity.getPosition();
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    BulletSolutions.solution_zixuan(entity, 400, -100, vec, 0.5, bulletIds[0], 0.7);
                    BulletSolutions.solution_zixuan(entity, 400, -80, vec, 0.5, bulletIds[0], 0.7);
                } else if (idx == 2) {
                    BulletSolutions.solution_zixuan(entity, 400, -90, vec, 0.5, bulletIds[0], 0.7);
                } else if (idx == 3) {
                    BulletSolutions.solution_zixuan(entity, 400, -100, vec, 0.5, bulletIds[0], 0.7);
                    BulletSolutions.solution_zixuan(entity, 400, -80, vec, 0.5, bulletIds[0], 0.7);
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.15, 1, 0);
            bullet.setTimer(3, 0.3, 1, 0);
        },
        solution_55: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let vec = entity.getPosition();
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    for (let n = 0; n < 12; ++n) {
                        BulletSolutions.solution_7(entity, 300, 30 * n - 90, vec, bulletIds[0]);
                    }
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.1, 1, 0);
        },
        solution_56: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let vec = entity.getPosition().add(cc.v3(0, -150));
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    for (let n = 0; n < 3; ++n) {
                        BulletSolutions.solution_jiasu(entity, 200, 30 * (n - 1) - 90, vec, 500, 0.5, bulletIds[0]);
                    }
                }
                if (idx == 2) {
                    for (let n = 0; n < 4; ++n) {
                        BulletSolutions.solution_jiasu(entity, 200, -45 + 30 * n - 90, vec, 500, 0.5, bulletIds[0]);
                    }
                    ai.releaseEntity(this);
                }
                if (idx == 3) {
                    this.setTimer(2, 0.4, 1, 1);
                }
            });
            bullet.setTimer(1, 0.4, 1, 1);
            bullet.setTimer(3, 0.2, 1, 0);
        },
        // (怪物，速度，方向，位置，加速度，加速时间)
        solution_jiasu: function (entity, speed, angle, vec, speedacc, t, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(vec);
            bullet.setSpeed(ai.speedTransfer(speed, angle), true);
            bullet.setSpeedAcc(ai.speedTransfer(speedacc, angle));
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setSpeedAcc(cc.v3(0, 0));
                }
            });
            bullet.setTimer(1, t, 1, 0);
        },
        solution_57: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.ctrlValue[1] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec_1 = entity.getPosition().add(cc.v3(-50, -150));
                    let vec_2 = entity.getPosition().add(cc.v3(50, -150));
                    BulletSolutions.solution_7(entity, 500, 10 * (this.ctrlValue[0] - 1) - 90, vec_1, bulletIds[0]);
                    BulletSolutions.solution_7(entity, 500, -10 * (this.ctrlValue[0] - 1) - 90, vec_2, bulletIds[1]);
                    this.ctrlValue[0] += 1;
                    this.ctrlValue[1] += 1;
                } else if (idx == 2) {
                    this.ctrlValue[0] = 0;
                    this.setTimer(1, 0.04, 7, 0);
                    if (this.ctrlValue[1] == 14) {
                        ai.releaseEntity(this);
                    }
                }
            });
            bullet.setTimer(2, 0.3, 2, 1);
        },
        solution_58: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let vec_1 = entity.getPosition().add(cc.v3(50, -150));
            let vec_2 = entity.getPosition().add(cc.v3(-50, -150));
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    for (let n = 0; n < 4; ++n) {
                        BulletSolutions.solution_58_1(entity, vec_1.add(cc.v3(20 * n, 20 * n)), bulletIds[0]);
                        BulletSolutions.solution_58_1(entity, vec_2.add(cc.v3(-20 * n, 20 * n)), bulletIds[0]);
                    }
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
        },
        solution_58_1: function (entity, v, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            let hero = ai.getHero();
            if (hero == null) {
                bullet.setTimer(2, 0, 1, 0);
            } else {
                bullet.aimAt(hero, 10, 10);
                bullet.setTimer(1, 1.5, 1, 0);
            }
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.resetAim();
                    let pos = hero.getPosition();
                    let angle = ai.getAngle(this.getPosition(), pos);
                    this.setSpeed(ai.speedTransfer(500, angle), true);
                }
                if (idx == 2) {
                    this.setSpeed(cc.v3(0, -1));
                    this.setTimer(3, 1.5, 1, 0);
                }
                if (idx == 3) {
                    this.setSpeed(cc.v3(0, -500));
                }
            });
        },
        solution_59: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let speed = 400;
            let angle = 20;
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition().add(cc.v3(0, -100));
                    for (let n = 0; n < 2; ++n) {
                        BulletSolutions.solution_7(entity, speed, angle * -3 / 2 + 60 * n - 90, vec, bulletIds[0]);
                    }
                }
                if (idx == 2) {
                    let vec = entity.getPosition().add(cc.v3(0, -100));
                    for (let n = 0; n < 3; ++n) {
                        BulletSolutions.solution_7(entity, speed, -angle + angle * n - 90, vec, bulletIds[0]);
                    }
                    this.ctrlValue[0] += 1;
                    if (this.ctrlValue[0] == 3) {
                        ai.releaseEntity(this);
                    }
                }
                if (idx == 3) {
                    bullet.setTimer(2, 0.5, 3, 1);
                }
            });
            bullet.setTimer(1, 0.5, 3, 1);
            bullet.setTimer(3, 0.25, 1, 0);
        },
        solution_60: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            let vec = entity.getPosition();
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.ctrlValue[0] += 1;
                    if (this.ctrlValue[0] <= 3) {
                        BulletSolutions.solution_60_1(entity, vec.add(cc.v3((this.ctrlValue[0] - 4) * 10, -150 - this.ctrlValue[0] * 10)), this.ctrlValue[0], bulletIds[0]);
                    } else if (this.ctrlValue[0] >= 5) {
                        BulletSolutions.solution_60_1(entity, vec.add(cc.v3((this.ctrlValue[0] - 4) * 10, -150 - (8 - this.ctrlValue[0]) * 10)), this.ctrlValue[0], bulletIds[0]);
                    } else {
                        BulletSolutions.solution_60_1(entity, vec.add(cc.v3(0, -150 - 4 * 10)), this.ctrlValue[0], bulletIds[0]);
                    }
                    if (this.ctrlValue[0] == 7) {
                        ai.releaseEntity(this);
                    }
                }
            });
            bullet.setTimer(1, 0.1, 7, 0);
        },
        solution_60_1: function (entity, v, t, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            let angle = -90;
            if (t <= 3) {
                angle = (4 - t) * 5 - 90;
            } else if (t >= 5) {
                angle = -(t - 4) * 5 - 90;
            }
            bullet.setSpeed(ai.speedTransfer(2, angle));
            //bullet.setRotation(360); //设置子弹角度
            //let angle = bullet.getRotation();  //得到子弹当前角度
            bullet.opacity = (0);
            bullet.runOpacity(255, 0.1);
            bullet.setBaseAngle(180);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setSpeed(ai.speedTransfer(-800, angle));
                    this.setSpeedAcc(ai.speedTransfer(4000, angle));
                    this.setTimer(2, 1.5, 1, 0);
                } else if (idx == 2) {
                    this.setSpeedAcc(ai.speedTransfer(0, 0));
                }
                // else if (idx == 3) {
                //     this.setAutoRotation(false);
                // }
            });
            bullet.setTimer(1, 0.05 + 0.1 * (8 - t), 1, 0);
            //bullet.setTimer(3, 0.017, 1, 0);
        },
        solution_61: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let vec = entity.getPosition();
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    for (let n = 0; n < 9; ++n) {
                        BulletSolutions.solution_jiasu(entity, 200, 45 * n - 90, vec, 50, 5, bulletIds[0]);
                    }
                    for (let n = 0; n < 6; ++n) {
                        BulletSolutions.solution_jiasu(entity, 250, 60 * n - 90, vec, 60, 5, bulletIds[0]);
                    }
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.1, 1, 0);
        },
        solution_62: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let vec = entity.getPosition();
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.bulletpos = BulletSolutions.solution_62_1(entity, vec, bulletIds[1]);
                }
                if (idx == 2) {
                    vec = this.bulletpos.getPosition();
                    for (let i = 0; i < 3; ++i) {
                        for (let n = 0; n < 9; ++n) {
                            BulletSolutions.solution_zixuan(entity, 500 + i * 50, -60 + n * 15 - 90, vec, 1, bulletIds[0]);
                        }
                    }
                    this.bulletpos = null;
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.5, 1, 0);
        },
        solution_62_1: function (entity, v, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.setSpeed(ai.speedTransfer(500, -90), true);
            bullet.setObjectSelfCircle(4);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setTimer(2, 0.05, 6, 0);
                    this.setTimer(3, 0.31, 6, 0);
                } else if (idx == 2) {
                    this.opacity = (255);
                    this.setSpeed(cc.v3(0, 0), true);
                    this.runOpacity(0, 0.05);
                } else if (idx == 3) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.2, 1, 0);
            return bullet;
        },
        solution_63: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_63_1(entity, 300, 8 - 8 * this.ctrlValue[0] - 90, vec, bulletIds[0]);
                    this.ctrlValue[0] += 1;
                    if (this.ctrlValue[0] == 3) {
                        ai.releaseEntity(this);
                    }
                }
            });
            bullet.setTimer(1, 0.2, 3, 0);
        },
        solution_63_1: function (entity, speed, angle, vec, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(vec);
            bullet.setObjectSelfCircle(-4);
            bullet.setSpeed(ai.speedTransfer(speed, angle));
            bullet.setSpeedAcc(cc.v3(20, -100));
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setSpeedAcc(cc.v3(-20, 600));
                } else if (idx == 2) {
                    this.setSpeedAcc(cc.v3(0, 0));
                }
            });
            bullet.setTimer(1, 1.5, 1, 0);
            bullet.setTimer(2, 3.5, 1, 0);
        },
        solution_64: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec_1 = entity.getPosition().add(cc.v3(-70, 0));
                    let vec_2 = entity.getPosition().add(cc.v3(70, 0));
                    BulletSolutions.solution_7(entity, 200, -90, vec_1, bulletIds[0]);
                    BulletSolutions.solution_7(entity, 200, -90, vec_2, bulletIds[0]);
                }
                if (idx == 2) {
                    let vec_1 = entity.getPosition().add(cc.v3(-70, 0));
                    let vec_2 = entity.getPosition().add(cc.v3(70, 0));
                    if (this.ctrlValue[0] < 6) {
                        BulletSolutions.solution_7(entity, 200, 2 * this.ctrlValue[0] - 90, vec_1, bulletIds[0]);
                        BulletSolutions.solution_7(entity, 200, -2 * this.ctrlValue[0] - 90, vec_2, bulletIds[0]);
                    } else {
                        BulletSolutions.solution_7(entity, 200, 2 * (10 - this.ctrlValue[0]) - 90, vec_1, bulletIds[0]);
                        BulletSolutions.solution_7(entity, 200, -2 * (10 - this.ctrlValue[0]) - 90, vec_2, bulletIds[0]);
                    }
                    this.ctrlValue[0] += 1;
                    if (this.ctrlValue[0] >= 11) {
                        ai.releaseEntity(this);
                    }
                }
                if (idx == 3) {
                    this.setTimer(2, 0.15, 11, 0);
                }
            });
            bullet.setTimer(1, 0.15, 8, 0);
            bullet.setTimer(3, 1.2, 1, 0);
        },
        solution_65: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.ctrlValue[1] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    for (let n = 0; n < 12; ++n) {
                        let vec = entity.getPosition();
                        BulletSolutions.solution_65_1(entity, 1000, 30 * n, vec, bulletIds[0]);
                    }
                } else if (idx == 2) {
                    let vec = entity.getPosition();
                    let vec_1 = vec.add(ai.speedTransfer(150, 120 + this.ctrlValue[0] * 20 - 90));
                    let hero = ai.getHero();
                    if(hero == null){
                    }
                    else{
                        BulletSolutions.solution_65_1(entity, 2, ai.getAngle(vec, hero.getPosition()), vec_1, bulletIds[0]);
                    }
                    this.ctrlValue[0] += 1;
                } else if (idx == 3) {
                    this.setTimer(2, 0.1, 7, 0);
                } else if (idx == 4) {
                    let vec = entity.getPosition();
                    let vec_2 = vec.add(ai.speedTransfer(250, 120 + this.ctrlValue[1] * 20 - 90));
                    let hero = ai.getHero();
                    if(hero == null){
                    }
                    else{
                        BulletSolutions.solution_65_1(entity, 2, ai.getAngle(vec, hero.getPosition()), vec_2, bulletIds[0]);
                    }
                    this.ctrlValue[1] += 1;
                    if (this.ctrlValue[1] >= 7) {
                        ai.releaseEntity(this);
                    }
                } else if (idx == 5) {
                    this.setTimer(4, 0.1, 7, 0);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(3, 1, 1, 0);
            bullet.setTimer(5, 1.3, 1, 0);
        },
        solution_65_1: function (entity, speed, angle, vec, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(vec);
            bullet.setBaseAngle(-angle);
            bullet.setSpeed(ai.speedTransfer(speed, angle), true);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setSpeed(ai.speedTransfer(2, angle));
                    this.aimAt(ai.getHero(), 10, 10);
                } else if (idx == 2) {
                    let a = ai.getAngle(vec, ai.getHero().getPosition());
                    this.resetAim();
                    this.setSpeed(ai.speedTransfer(1000, a), true);
                }
            });
            bullet.setTimer(1, 0.2, 1, 0);
            bullet.setTimer(2, 2, 1, 0);
        },
        solution_66: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    for (let n = 0; n < 6; ++n) {
                        BulletSolutions.solution_7(entity, 700, 60 * n + this.ctrlValue[0] * 10 - 90, vec, bulletIds[0]);
                    }
                    this.ctrlValue[0] += 1;
                    if (this.ctrlValue[0] >= 8) {
                        this.setTimer(2, 0.3, 1, 0);
                    }
                } else if (idx == 2) {
                    this.ctrlValue[0] = 0;
                    this.setTimer(3, 0.025, 8, 0);
                } else if (idx == 3) {
                    let vec = entity.getPosition();
                    for (let n = 0; n < 6; ++n) {
                        BulletSolutions.solution_7(entity, 700, 20 - 60 * n - this.ctrlValue[0] * 10 - 90, vec, bulletIds[1]);
                    }
                    this.ctrlValue[0] += 1;
                    if (this.ctrlValue[0] >= 8) {
                        ai.releaseEntity(this);
                    }
                }
            });
            bullet.setTimer(1, 0.025, 8, 0);
        },
        solution_67: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let vec_1 = entity.getPosition().add(cc.v3(100, 0));
            let vec_2 = entity.getPosition().add(cc.v3(-100, 0));
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    this.ctrlValue[0] += 1;
                    for (let n = 0; n < 8; ++n) {
                        BulletSolutions.solution_37_1(entity, vec, n * (360 / 8), bulletIds[0]);
                        BulletSolutions.solution_37_1(entity, vec_1, n * (360 / 8), bulletIds[1]);
                        BulletSolutions.solution_37_1(entity, vec_2, n * (360 / 8), bulletIds[2]);
                    }
                    if (this.ctrlValue[0] > 7) {
                        ai.releaseEntity(this);
                    }
                }
            });
            bullet.setTimer(1, 0.05, 8, 0);
        },
        //BOSS怪弹幕方案 68-108
        solution_68: function (entity, bulletIds, scale, num) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let vec_1 = entity.getPosition().add(cc.v3(50, 0));
            let vec_2 = entity.getPosition().add(cc.v3(-50, 0));
            bullet.ctrlValue[4] = 1;
            if (num == undefined) {
                num = 9;
            }
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    for (let n = 0; n < num; ++n) {
                        let angle = 360 / num;
                        BulletSolutions.solution_68_1(entity, vec_1.add(ai.speedTransfer(60, n * angle + 40)), vec_1, bulletIds[0]);
                        BulletSolutions.solution_68_2(entity, vec_2.add(ai.speedTransfer(60, -(n * angle + 40))), vec_2, bulletIds[1]);
                    }
                }
                if (idx == 2) {
                    for (let n = 0; n < num; ++n) {
                        let angle = 360 / num;
                        BulletSolutions.solution_68_1(entity, vec_1.add(ai.speedTransfer(60, n * angle + 40 + 4)), vec_1, bulletIds[0]);
                        BulletSolutions.solution_68_2(entity, vec_2.add(ai.speedTransfer(60, -(n * angle + 40 + 4))), vec_2, bulletIds[1]);
                    }
                }
                if (idx == 3) {
                    for (let n = 0; n < num; ++n) {
                        let angle = 360 / num;
                        BulletSolutions.solution_68_1(entity, vec_1.add(ai.speedTransfer(60, n * angle + 40 + 8)), vec_1, bulletIds[0]);
                        BulletSolutions.solution_68_2(entity, vec_2.add(ai.speedTransfer(60, -(n * angle + 40 + 8))), vec_2, bulletIds[1]);
                    }
                }
                if (idx == 4) {
                    for (let n = 0; n < num; ++n) {
                        let angle = 360 / num;
                        BulletSolutions.solution_68_1(entity, vec_1.add(ai.speedTransfer(60, n * angle + 40 + 12)), vec_1, bulletIds[0]);
                        BulletSolutions.solution_68_2(entity, vec_2.add(ai.speedTransfer(60, -(n * angle + 40 + 12))), vec_2, bulletIds[1]);
                    }
                }
                if (idx == 5) {
                    this.ctrlValue[4] = this.ctrlValue[4] + 1;
                    for (let n = 0; n < num; ++n) {
                        let angle = 360 / num;
                        BulletSolutions.solution_68_1(entity, vec_1.add(ai.speedTransfer(60, n * angle + 40 + 16)), vec_1, bulletIds[0]);
                        BulletSolutions.solution_68_2(entity, vec_2.add(ai.speedTransfer(60, -(n * angle + 40 + 16))), vec_2, bulletIds[1]);
                    }
                }
                if (idx == 6) {
                    this.setTimer(2, 0.3, 2, 1);
                }
                if (idx == 7) {
                    this.setTimer(3, 0.3, 2, 1);
                }
                if (idx == 8) {
                    this.setTimer(4, 0.3, 2, 1);
                }
                if (idx == 9) {
                    this.setTimer(5, 0.3, 2, 1);
                    if (this.ctrlValue[4] > 1) {
                        ai.releaseEntity(this);
                    }
                }
            });
            bullet.setTimer(1, 0.3, 2, 0);
            bullet.setTimer(6, 0.35, 1, 0);
            bullet.setTimer(7, 0.4, 1, 0);
            bullet.setTimer(8, 0.45, 1, 0);
            bullet.setTimer(9, 0.5, 1, 0);
        },
        solution_68_1: function (entity, pos, pos_2, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(pos);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setMovementType(0);
                    let angle_2 = ai.getAngle(pos_2, this.getPosition()) + 90;
                    this.setSpeed(ai.speedTransfer(500, angle_2), true);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
        },
        solution_68_2: function (entity, pos, pos_2, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.opacity = (0);
            bullet.setPosition(pos);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setMovementType(0);
                    this.opacity = (255);
                    let angle_2 = ai.getAngle(pos_2, this.getPosition()) - 90;
                    this.setSpeed(ai.speedTransfer(500, angle_2), true);
                }
            });
            bullet.setTimer(1, 1.2, 1, 0);
        },
        solution_69: function (entity, bulletIds, scale, num) {
            let ai = require('AIInterface');
            let vec = entity.getPosition();
            let bullet = ai.createFake(entity);
            let vec_1 = vec.add(cc.v3(0, 100));
            bullet.ctrlValue[0] = 0;
            if (num == undefined) {
                num = 18;
            }
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.ctrlValue[0] = this.ctrlValue[0] + 1;
                    for (let n = 0; n < num; ++n) {
                        let angle = 360 / num;
                        BulletSolutions.solution_69_1(entity, 20 + n * angle - 90, vec_1.add(ai.speedTransfer(100, 20 + n * angle - 90)), bulletIds[0]);
                    }
                    if (this.ctrlValue[0] > 19) {
                        ai.releaseEntity(this);
                    }
                }
            });
            bullet.setTimer(1, 0.2, 20, 1);
        },
        solution_69_1: function (entity, angle, pos, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(pos);
            bullet.setMovementType(0);
            bullet.setSpeed(ai.speedTransfer(200, angle + 180), true);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setSpeed(ai.speedTransfer(1, angle + 180), true);
                }
                if (idx == 2) {
                    this.setSpeed(ai.speedTransfer(500, angle), true);
                }
            });
            bullet.setTimer(1, 0.5, 1, 0);
            bullet.setTimer(2, 5, 1, 0);
        },
        solution_70: function (entity, bulletIds, scale, num) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            if (num == undefined) {
                num = 6;
            }
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    for (let n = 0; n < num; ++n) {
                        let angle = 360 / num;
                        BulletSolutions.solution_70_1(entity, n * angle - 90, vec, bulletIds[0]);
                    }
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    for (let n = 0; n < num; ++n) {
                        let angle = 360 / num;
                        BulletSolutions.solution_70_1(entity, n * angle + 5 - 90, vec, bulletIds[0]);
                        BulletSolutions.solution_70_1(entity, n * angle - 5 - 90, vec, bulletIds[0]);
                    }
                }
                if (idx == 3) {
                    let vec = entity.getPosition();
                    for (let n = 0; n < num; ++n) {
                        let angle = 360 / num;
                        BulletSolutions.solution_70_1(entity, n * angle + 10 - 90, vec, bulletIds[0]);
                        BulletSolutions.solution_70_1(entity, n * angle - 10 - 90, vec, bulletIds[0]);
                    }
                }
                if (idx == 4) {
                    let vec = entity.getPosition();
                    for (let n = 0; n < num; ++n) {
                        let angle = 360 / num;
                        BulletSolutions.solution_70_1(entity, n * angle + 30 - 90, vec, bulletIds[1]);
                    }
                }
                if (idx == 5) {
                    let vec = entity.getPosition();
                    for (let n = 0; n < num; ++n) {
                        let angle = 360 / num;
                        BulletSolutions.solution_70_1(entity, n * angle + 5 + 30 - 90, vec, bulletIds[1]);
                        BulletSolutions.solution_70_1(entity, n * angle - 5 + 30 - 90, vec, bulletIds[1]);
                    }
                }
                if (idx == 6) {
                    let vec = entity.getPosition();
                    for (let n = 0; n < num; ++n) {
                        let angle = 360 / num;
                        BulletSolutions.solution_70_1(entity, n * angle + 10 + 30 - 90, vec, bulletIds[1]);
                        BulletSolutions.solution_70_1(entity, n * angle - 10 + 30 - 90, vec, bulletIds[1]);
                        ai.releaseEntity(this);
                    }
                }
            });
            bullet.setTimer(4, 0.5, 1, 0);
            bullet.setTimer(5, 0.6, 1, 0);
            bullet.setTimer(6, 0.7, 1, 0);
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
            bullet.setTimer(3, 0.2, 1, 0);
        },
        solution_70_1: function (entity, angle, pos, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(pos);
            bullet.setMovementType(0);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setSpeed(ai.speedTransfer(500, angle), true);
                }
                if (idx == 2) {
                    this.setSpeed(ai.speedTransfer(500, angle + 180), true);
                }
                if (idx == 3) {
                    this.setSpeed(ai.speedTransfer(500, angle), true);
                }
                if (idx == 4) {
                    this.setSpeed(ai.speedTransfer(500, angle + 180), true);
                }
                if (idx == 5) {
                    this.setSpeed(ai.speedTransfer(700, angle), true);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.5, 1, 0);
            bullet.setTimer(3, 1, 1, 0);
            bullet.setTimer(4, 1.3, 1, 0);
            bullet.setTimer(5, 1.6, 1, 0);
        },
        solution_71: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            let num = 8;
            let angle = 360 / num;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    let angle_1 = this.ctrlValue[0] * 10;
                    this.ctrlValue[0] = this.ctrlValue[0] + 1;
                    for (let n = 0; n < num; ++n) {
                        BulletSolutions.solution_71_1(entity, angle + 45 * n + angle_1 - 90, vec, bulletIds[0]);
                        BulletSolutions.solution_71_1(entity, angle + 45 * n - angle_1 - 90, vec, bulletIds[1]);
                    }
                    if (this.ctrlValue[0] > 35) {
                        ai.releaseEntity(this);
                    }
                }
            });
            bullet.setTimer(1, 0.17, 36, 1);
        },
        solution_71_1: function (entity, angle, pos, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(pos);
            bullet.setMovementType(0);
            bullet.setSpeed(ai.speedTransfer(200, angle), true);
        },
        solution_72: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.ctrlValue[1] = 0;
            bullet.ctrlValue[2] = 0;
            bullet.ctrlValue[3] = 0;
            let num = 6;
            let angle = 360 / num;
            bullet.setTimerHandler(function (idx) {
                let angle_1 = this.ctrlValue[0] * 5;
                let angle_2 = this.ctrlValue[1] * 5;
                let angle_3 = this.ctrlValue[2] * 5;
                let angle_4 = this.ctrlValue[3] * 5;
                if (idx == 1) {
                    let vec = entity.getPosition();
                    this.ctrlValue[0] = this.ctrlValue[0] + 1;
                    for (let n = 0; n < num; ++n) {
                        BulletSolutions.solution_72_1(entity, angle + 60 * n + angle_1 - 90, vec, bulletIds[0]);
                    }
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    this.ctrlValue[1] = this.ctrlValue[1] + 1;
                    for (let n = 0; n < num; ++n) {
                        BulletSolutions.solution_72_1(entity, 7.5 + angle + 60 * n - angle_2 - 90, vec, bulletIds[1]);
                    }
                }
                if (idx == 3) {
                    let vec = entity.getPosition();
                    this.ctrlValue[2] = this.ctrlValue[2] + 1;
                    for (let n = 0; n < num; ++n) {
                        BulletSolutions.solution_72_1(entity, angle + 60 * n + angle_3 - 90, vec, bulletIds[0]);
                    }
                }
                if (idx == 4) {
                    let vec = entity.getPosition();
                    this.ctrlValue[3] = this.ctrlValue[3] + 1;
                    for (let n = 0; n < num; ++n) {
                        BulletSolutions.solution_72_1(entity, 7.5 + angle + 60 * n - angle_4 - 90, vec, bulletIds[1]);
                    }
                    if (this.ctrlValue[3] > 9) {
                        ai.releaseEntity(this);
                    }
                }
                if (idx == 5) {
                    this.setTimer(1, 0.1, 10, 0);
                }
                if (idx == 6) {
                    this.setTimer(2, 0.1, 10, 0);
                }
                if (idx == 7) {
                    this.setTimer(3, 0.1, 10, 0);
                }
                if (idx == 8) {
                    this.setTimer(4, 0.1, 10, 0);
                }
            });
            bullet.setTimer(5, 0, 1, 1);
            bullet.setTimer(6, 1, 1, 0);
            bullet.setTimer(7, 2, 1, 0);
            bullet.setTimer(8, 3, 1, 0);
        },
        solution_72_1: function (entity, angle, pos, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(pos);
            bullet.setMovementType(0);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setSpeed(ai.speedTransfer(500, angle), true);
                }
                if (idx == 2) {
                    this.setSpeed(ai.speedTransfer(200, angle), true);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.8, 1, 0);
        },
        solution_73: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.ctrlValue[1] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_73_1(entity, -90, vec, bulletIds[0]);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    bullet.ctrlValue[0] += 1;
                    BulletSolutions.solution_73_1(entity, 10 + 10 * bullet.ctrlValue[0] - 90, vec, bulletIds[1]);
                    BulletSolutions.solution_73_1(entity, -10 - 10 * bullet.ctrlValue[0] - 90, vec, bulletIds[1]);
                }
                if (idx == 3) {
                    let vec = entity.getPosition();
                    this.ctrlValue[1] += 1;
                    BulletSolutions.solution_73_1(entity, 10 * bullet.ctrlValue[1] - 90, vec, bulletIds[1]);
                    BulletSolutions.solution_73_1(entity, -10 * bullet.ctrlValue[1] - 90, vec, bulletIds[1]);
                }
                if (idx == 4) {
                    this.setTimer(2, 0.2, 5, 1);
                }
                if (idx == 5) {
                    this.setTimer(3, 0.2, 6, 1);
                }
                if (this.ctrlValue[1] > 5) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 1);
            bullet.setTimer(4, 0.4, 1, 0);
            bullet.setTimer(5, 1, 1, 0);
        },
        solution_73_1: function (entity, angle, pos, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(pos);
            bullet.setMovementType(0);
            bullet.setSpeed(ai.speedTransfer(200, angle), true);
        },
        solution_74: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec_1 = entity.getPosition();
                    this.ctrlValue[0] += 1;
                    let angle = Math.random() * 90 - 45;
                    for (let n = 0; n < 3; ++n) {
                        BulletSolutions.solution_74_1(entity, vec_1, n * (360 / 3), angle - 90, bulletIds[0]);
                    }
                    if (this.ctrlValue[0] > 4) {
                        ai.releaseEntity(this);
                    }
                }
            });
            bullet.setTimer(1, 0.5, 5, 1);
        },
        solution_74_1: function (entity, ct, v, angle, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(ct);
            bullet.setEdgeCollision(2);
            //bullet.setObjectSelfCircle(-1);
            bullet.setObjectAutoCircle(20, v, 0, 0, 360, 0, 1);
            bullet.setSpeed(ai.speedTransfer(300, angle));
        },
        solution_75: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.ctrlValue[1] = 0;
            bullet.ctrlValue[2] = 0;
            bullet.ctrlValue[3] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    let vec_1 = vec.add(cc.v3(-100, 0));
                    let vec_2 = vec.add(cc.v3(100, 0));
                    this.ctrlValue[0] = this.ctrlValue[0] + 1;
                    let angle_1 = 20 * bullet.ctrlValue[0];
                    let angle_2 = -20 * bullet.ctrlValue[0];
                    BulletSolutions.solution_75_1(entity, 200, -20 + angle_1 - 90, vec_1.add(ai.speedTransfer(20, -20 + angle_1)), bulletIds[0]);
                    BulletSolutions.solution_75_2(entity, 200, 20 + angle_2 - 90, vec_2.add(ai.speedTransfer(20, -20 + angle_2)), bulletIds[0]);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    let vec_1 = vec.add(cc.v3(-100, 0));
                    let vec_2 = vec.add(cc.v3(100, 0));
                    this.ctrlValue[1] = this.ctrlValue[1] + 1;
                    let angle_1 = 20 * bullet.ctrlValue[1];
                    let angle_2 = -20 * bullet.ctrlValue[1];
                    BulletSolutions.solution_75_1(entity, 200, -20 + angle_1 - 90, vec_1.add(ai.speedTransfer(20, -20 + angle_1)), bulletIds[0]);
                    BulletSolutions.solution_75_2(entity, 200, 20 + angle_2 - 90, vec_2.add(ai.speedTransfer(20, -20 + angle_2)), bulletIds[0]);
                }
                if (idx == 3) {
                    let vec = entity.getPosition();
                    let vec_1 = vec.add(cc.v3(-100, 0));
                    let vec_2 = vec.add(cc.v3(100, 0));
                    this.ctrlValue[2] = this.ctrlValue[2] + 1;
                    let angle_1 = 20 * bullet.ctrlValue[2];
                    let angle_2 = -20 * bullet.ctrlValue[2];
                    BulletSolutions.solution_75_1(entity, 200, -20 + angle_1 - 90, vec_1.add(ai.speedTransfer(20, -20 + angle_1)), bulletIds[0]);
                    BulletSolutions.solution_75_2(entity, 200, 20 + angle_2 - 90, vec_2.add(ai.speedTransfer(20, -20 + angle_2)), bulletIds[0]);
                }
                if (idx == 4) {
                    let vec = entity.getPosition();
                    let vec_1 = vec.add(cc.v3(-100, 0));
                    let vec_2 = vec.add(cc.v3(100, 0));
                    this.ctrlValue[3] = this.ctrlValue[3] + 1;
                    let angle_1 = 20 * bullet.ctrlValue[3];
                    let angle_2 = -20 * bullet.ctrlValue[3];
                    BulletSolutions.solution_75_1(entity, 200, -20 + angle_1 - 90, vec_1.add(ai.speedTransfer(20, -20 + angle_1)), bulletIds[0]);
                    BulletSolutions.solution_75_2(entity, 200, 20 + angle_2 - 90, vec_2.add(ai.speedTransfer(20, -20 + angle_2)), bulletIds[0]);
                    if (this.ctrlValue[3] > 8) {
                        ai.releaseEntity(this);
                    }
                }
                if (idx == 5) {
                    this.setTimer(1, 0.2, 9, 1);
                }
                if (idx == 6) {
                    this.setTimer(2, 0.2, 9, 1);
                }
                if (idx == 7) {
                    this.setTimer(3, 0.2, 9, 1);
                }
                if (idx == 8) {
                    this.setTimer(4, 0.2, 9, 1);
                }
            });
            bullet.setTimer(5, 0, 1, 1);
            bullet.setTimer(6, 0.1, 1, 0);
            bullet.setTimer(7, 0.2, 1, 0);
            bullet.setTimer(8, 0.3, 1, 0);
        },
        solution_75_1: function (entity, speed, angle, pos, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(pos);
            bullet.setMovementType(0);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setSpeed(ai.speedTransfer(speed, angle), true);
                }
            });
            bullet.setTimer(1, 0, 1, 1);
        },
        solution_75_2: function (entity, speed, angle, pos, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(pos);
            bullet.setMovementType(0);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setSpeed(ai.speedTransfer(speed, angle), true);
                }
            });
            bullet.setTimer(1, 0, 1, 1);
        },
        solution_76: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let vec = cc.v3(0, 0);
            let vec_1 = cc.v3(0, 0);
            bullet.ctrlValue[0] = 0;
            let angle = -105;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.ctrlValue[0] = this.ctrlValue[0] + 1;
                    vec_1 = vec.add(cc.v3(Math.random() * 1000 + 150, 1140 + Math.random() * 50));
                    BulletSolutions.solution_76_1(entity, 300, angle, vec_1, bulletIds[0]);
                }
                if (this.ctrlValue[0] > 49) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.2, 50, 1);
        },
        solution_76_1: function (entity, speed, angle, pos, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(pos);
            bullet.setMovementType(0);
            bullet.setSpeed(ai.speedTransfer(speed, angle), true);
        },
        solution_77: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec_1 = entity.getPosition()
                    this.ctrlValue[0] += 1;
                    for (let n = 0; n < 36; ++n) {
                        BulletSolutions.solution_77_1(entity, vec_1.add(ai.speedTransfer(20, n * (360 / 36))), n * 10 + 5 - 90, bulletIds[0]);
                    }
                    if (this.ctrlValue[0] > 3) {
                        ai.releaseEntity(this);
                    }
                }
            });
            bullet.setTimer(1, 0.1, 4, 0);
        },
        solution_77_1: function (entity, v, angle, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.setMovementType(0);
            bullet.setSpeed(ai.speedTransfer(500, angle), true);
        },
        solution_78: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec_1 = entity.getPosition();
                    this.ctrlValue[0] += 1;
                    for (let n = 0; n < 12; ++n) {
                        BulletSolutions.solution_78_1(entity, vec_1.add(ai.speedTransfer(5, n * (360 / 12))), n * 30 - 90, bulletIds[0]);
                    }
                    if (this.ctrlValue[0] > 2) {
                        ai.releaseEntity(this);
                    }
                }
                if (idx == 2) {
                    let vec_1 = entity.getPosition();
                    for (let n = 0; n < 12; ++n) {
                        BulletSolutions.solution_78_1(entity, vec_1.add(ai.speedTransfer(5, n * (360 / 12))), n * 30 + 15 - 90, bulletIds[1]);
                    }
                }
                if (idx == 3) {
                    this.setTimer(1, 0.1, 3, 1);
                }
                if (idx == 4) {
                    this.setTimer(2, 0.1, 2, 1);
                }
            });
            bullet.setTimer(3, 0, 1, 1);
            bullet.setTimer(4, 0.05, 1, 0);
        },
        solution_78_1: function (entity, v, angle, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.setMovementType(0);
            bullet.setSpeed(ai.speedTransfer(500, angle), true);
        },
        solution_79: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec_1 = entity.getPosition();
                    for (let n = 0; n < 12; ++n) {
                        BulletSolutions.solution_79_1(entity, vec_1.add(ai.speedTransfer(5, n * (360 / 12))), n * 30 - 10 - 90, bulletIds[0]);
                    }
                }
                if (idx == 2) {
                    let vec_1 = entity.getPosition();
                    this.ctrlValue[0] += 1;
                    for (let n = 0; n < 6; ++n) {
                        BulletSolutions.solution_79_1(entity, vec_1.add(ai.speedTransfer(5, n * (360 / 6))), n * 60 + 55 - 10 - 90, bulletIds[1]);
                    }
                    if (this.ctrlValue[0] > 2) {
                        ai.releaseEntity(this);
                    }
                }
                if (idx == 3) {
                    this.setTimer(1, 0.1, 3, 1);
                }
                if (idx == 4) {
                    this.setTimer(2, 0.1, 3, 1);
                }
            });
            bullet.setTimer(3, 0, 1, 1);
            bullet.setTimer(4, 0.1, 1, 0);
        },
        solution_79_1: function (entity, v, angle, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.setMovementType(0);
            bullet.setSpeed(ai.speedTransfer(500, angle), true);
        },
        solution_80: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let vec_1 = entity.getPosition();
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    for (let n = 0; n < 4; ++n) {
                        BulletSolutions.solution_80_1(entity, vec_1, 300, n * 40 - 60 - 90, bulletIds[0]);
                    }
                }
                if (idx == 2) {
                    for (let n = 0; n < 3; ++n) {
                        BulletSolutions.solution_80_1(entity, vec_1, 400, n * 40 + -40 - 90, bulletIds[1]);
                    }
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0, 1, 0);
        },
        solution_80_1: function (entity, v, speed, angle, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.setMovementType(0);
            bullet.setSpeed(ai.speedTransfer(speed, angle), true);
        },
        solution_81: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let vec_1 = entity.getPosition();
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.ctrlValue[0] += 1;
                    for (let n = 0; n < 8; ++n) {
                        BulletSolutions.solution_81_1(entity, vec_1, n * (360 / 8), -90, bulletIds[0]);
                    }
                    if (this.ctrlValue[0] > 9) {
                        ai.releaseEntity(this);
                    }
                }
            });
            bullet.setTimer(1, 0.1, 10, 0);
        },
        solution_81_1: function (entity, ct, v, angle, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(ct);
            bullet.setObjectAutoCircle(100, v, -40, 0, 720, 0, 1);
            bullet.setSpeed(ai.speedTransfer(400, angle));
        },
        solution_82: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let vec_1 = entity.getPosition();
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    for (let m = 0; m < 6; ++m) {
                        for (let n = 0; n < 5; ++n) {
                            BulletSolutions.solution_82_1(entity, vec_1.add(ai.speedTransfer(60, n * (360 / 5))), n * 72 + 5 * m - 90, bulletIds[0]);
                        }
                    }
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 1);
        },
        solution_82_1: function (entity, v, angle, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.setMovementType(0);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setSpeed(ai.speedTransfer(400, angle + 180), true);
                }
                if (idx == 2) {
                    this.setSpeed(ai.speedTransfer(400, angle), true);
                }
                if (idx == 3) {
                    this.setSpeed(ai.speedTransfer(400, angle + 180), true);
                }
                if (idx == 4) {
                    this.setSpeed(ai.speedTransfer(400, angle), true);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.15, 1, 0);
            bullet.setTimer(3, 0.3, 1, 0);
            bullet.setTimer(4, 0.45, 1, 0);
        },
        solution_83: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let vec_1 = entity.getPosition();
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.ctrlValue[0] += 1;
                    let angle = -90;
                    for (let n = 0; n < 5; ++n) {
                        BulletSolutions.solution_83_1(entity, vec_1, 20 + 40 * n, 0, 180, angle, bulletIds[0]);
                        BulletSolutions.solution_83_1(entity, vec_1, 20 + 40 * n, -180, -180, angle, bulletIds[0]);
                    }
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
        },
        solution_83_1: function (entity, ct, l, v, om, angle, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(ct);
            bullet.setObjectAutoCircle(l, v, 0, 0, om, 0, 1);
            bullet.setSpeed(ai.speedTransfer(200, angle));
        },
        solution_84: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.ctrlValue[1] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec_1 = entity.getPosition();
                    this.ctrlValue[0] += 1;
                    for (let n = 0; n < 6; ++n) {
                        BulletSolutions.solution_84_1(entity, vec_1.add(ai.speedTransfer(5, n * (360 / 6))), n * 60 + 5 * this.ctrlValue[0] - 90, bulletIds[0]);
                    }
                }
                if (idx == 2) {
                    let vec_1 = entity.getPosition();
                    this.ctrlValue[1] += 1;
                    for (let n = 0; n < 6; ++n) {
                        BulletSolutions.solution_84_1(entity, vec_1.add(ai.speedTransfer(5, n * (360 / 6))), n * 60 + 10 + 5 * this.ctrlValue[1] - 90, bulletIds[0]);
                    }
                    if (this.ctrlValue[1] > 5) {
                        ai.releaseEntity(this);
                    }
                }
                if (idx == 3) {
                    this.setTimer(1, 0.5, 6, 1);
                }
                if (idx == 4) {
                    this.setTimer(2, 0.5, 6, 1);
                }
            });
            bullet.setTimer(3, 0, 1, 1);
            bullet.setTimer(4, 0.1, 1, 0);
        },
        solution_84_1: function (entity, v, angle, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.setMovementType(0);
            bullet.setSpeed(ai.speedTransfer(200, angle), true);
        },
        solution_85: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec_1 = entity.getPosition();
                    BulletSolutions.solution_85_1(entity, vec_1, -90, bulletIds[0]);
                }
                //第一轮直线三连
                if (idx == 2) {
                    let vec_1 = entity.getPosition();
                    BulletSolutions.solution_85_1(entity, vec_1.add(cc.v3(30, 0)), -90, bulletIds[2]); //第一轮直线三连右1
                    BulletSolutions.solution_85_1(entity, vec_1.add(cc.v3(-30, 0)), -90, bulletIds[2]); //第一轮直线三连左1
                    BulletSolutions.solution_85_1(entity, vec_1, 40 - 90, bulletIds[1]);
                    BulletSolutions.solution_85_1(entity, vec_1, -40 - 90, bulletIds[1]);
                    BulletSolutions.solution_85_1(entity, vec_1, 20 - 90, bulletIds[1]);
                    BulletSolutions.solution_85_1(entity, vec_1, -20 - 90, bulletIds[1]);
                }
                if (idx == 3) {
                    let vec_1 = entity.getPosition();
                    this.ctrlValue[0] += 1;
                    BulletSolutions.solution_85_1(entity, vec_1, -90, bulletIds[0]);
                    if (this.ctrlValue[0] > 2) {
                        ai.releaseEntity(this);
                    }
                    //第二轮直线三连
                }
                if (idx == 4) {
                    let vec_1 = entity.getPosition();
                    BulletSolutions.solution_85_1(entity, vec_1.add(cc.v3(30, 0)), -90, bulletIds[2]); //第二轮直线三连右1
                    BulletSolutions.solution_85_1(entity, vec_1.add(cc.v3(-30, 0)), -90, bulletIds[2]); //第二轮直线三连左1
                    BulletSolutions.solution_85_1(entity, vec_1.add(cc.v3(-60, 0)), 20 - 90, bulletIds[1]);
                    BulletSolutions.solution_85_1(entity, vec_1.add(cc.v3(60, 0)), -20 - 90, bulletIds[1]);
                    BulletSolutions.solution_85_1(entity, vec_1, 20 - 90, bulletIds[1]);
                    BulletSolutions.solution_85_1(entity, vec_1, -20 - 90, bulletIds[1]);
                }
                if (idx == 5) {
                    this.setTimer(3, 0.1, 3, 1);
                }
            });
            bullet.setTimer(1, 0.1, 3, 1);
            bullet.setTimer(2, 0.2, 1, 0);
            bullet.setTimer(4, 1.1, 1, 0);
            bullet.setTimer(5, 1, 1, 0);
        },
        solution_85_1: function (entity, v, angle, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.setMovementType(0);
            bullet.setSpeed(ai.speedTransfer(200, angle), true);
        },
        solution_86: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.ctrlValue[1] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec_1 = entity.getPosition();
                    this.ctrlValue[0] += 1;
                    BulletSolutions.solution_86_1(entity, vec_1.add(cc.v3(-50, 0)), -45 + 16 * this.ctrlValue[0] - 16 - 90, bulletIds[0]);
                }
                if (idx == 2) {
                    let vec_1 = entity.getPosition();
                    this.ctrlValue[1] += 1;
                    BulletSolutions.solution_86_1(entity, vec_1.add(cc.v3(50, 0)), 45 - 16 * this.ctrlValue[1] + 16 - 90, bulletIds[1]);
                    if (this.ctrlValue[1] > 5) {
                        ai.releaseEntity(this);
                    }
                }
                if (idx == 3) {
                    this.setTimer(2, 0.2, 6, 1);
                }
            });
            bullet.setTimer(1, 0.2, 6, 1);
            bullet.setTimer(3, 0.6, 1, 0);
        },
        solution_86_1: function (entity, v, angle, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.setMovementType(0);
            bullet.setSpeed(ai.speedTransfer(400, angle), true);
        },
        solution_87: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let vec_1 = entity.getPosition();
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.ctrlValue[0] += 1;
                    for (let n = 0; n < 4; n++) {
                        BulletSolutions.solution_87_1(entity, vec_1.add(cc.v3(0, -60 * this.ctrlValue[0])), 90 * n - 5 + 20 * this.ctrlValue[0] - 90, bulletIds[0]);
                        BulletSolutions.solution_87_1(entity, vec_1.add(cc.v3(0, -60 * this.ctrlValue[0])), 90 * n + 5 + 20 * this.ctrlValue[0] - 90, bulletIds[0]);
                    }
                    if (this.ctrlValue[0] > 5) {
                        ai.releaseEntity(this);
                    }
                }
            });
            bullet.setTimer(1, 0.3, 6, 1);
        },
        solution_87_1: function (entity, v, angle, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.setMovementType(0);
            bullet.setSpeed(ai.speedTransfer(150, angle), true);
        },
        solution_88: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let vec_1 = entity.getPosition();
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    BulletSolutions.solution_88_1(entity, vec_1, 100, 1 * 60 - 90, -90, bulletIds[0]);
                }
                if (idx == 2) {
                    BulletSolutions.solution_88_1(entity, vec_1, 100, 2 * 60 - 90, -90, bulletIds[0]);
                }
                if (idx == 3) {
                    BulletSolutions.solution_88_1(entity, vec_1, 100, 3 * 60 - 90, -90, bulletIds[0]);
                }
                if (idx == 4) {
                    BulletSolutions.solution_88_1(entity, vec_1, 100, 4 * 60 - 90, -90, bulletIds[0]);
                }
                if (idx == 5) {
                    BulletSolutions.solution_88_1(entity, vec_1, 100, 5 * 60 - 90, -90, bulletIds[0]);
                }
                if (idx == 6) {
                    BulletSolutions.solution_88_1(entity, vec_1, 100, 6 * 60 - 90, -90, bulletIds[0]);
                }
                if (idx == 13) {
                    BulletSolutions.solution_88_2(entity, vec_1, 150, 0 - 90, -90, bulletIds[1]);
                }
                if (idx == 7) {
                    this.setTimer(1, 0.03, 10, 1);
                }
                if (idx == 8) {
                    this.setTimer(2, 0.03, 10, 1);
                }
                if (idx == 9) {
                    this.setTimer(3, 0.03, 10, 1);
                }
                if (idx == 10) {
                    this.setTimer(4, 0.03, 10, 1);
                }
                if (idx == 11) {
                    this.setTimer(5, 0.03, 10, 1);
                }
                if (idx == 12) {
                    this.setTimer(6, 0.03, 10, 1);
                }
                if (idx == 14) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(13, 0.03, 25, 1);
            bullet.setTimer(7, 0, 1, 1);
            bullet.setTimer(8, 0.15, 1, 0);
            bullet.setTimer(9, 0.3, 1, 0);
            bullet.setTimer(10, 0.45, 1, 0);
            bullet.setTimer(11, 0.6, 1, 0);
            bullet.setTimer(12, 0.75, 1, 0);
            bullet.setTimer(14, 1.1, 1, 0);
        },
        solution_88_1: function (entity, ct, r, v, angle, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(ct);
            bullet.setObjectAutoCircle(r, v, -15, 0, 720, 0, 1);
            bullet.setSpeed(ai.speedTransfer(150, angle));
        },
        solution_88_2: function (entity, ct, r, v, angle, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(ct);
            bullet.setObjectAutoCircle(r, v, 60, 0, 360, 0, 1);
            bullet.setSpeed(ai.speedTransfer(150, angle));
        },
        solution_89: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec_1 = entity.getPosition();
                    for (let n = 0; n < 6; ++n) {
                        for (let m = 0; m < 5; ++m) {
                            BulletSolutions.solution_89_1(entity, vec_1, m * 7.5 - 15 + n * 60 - 90, bulletIds[0]);
                        }
                    }
                }
                if (idx == 2) {
                    let vec_1 = entity.getPosition();
                    this.ctrlValue[0] += 1;
                    for (let n = 0; n < 6; ++n) {
                        for (let m = 0; m < 5; ++m) {
                            BulletSolutions.solution_89_1(entity, vec_1, m * 7.5 - 15 + n * 60 + 30 - 90, bulletIds[1]);
                        }
                    }
                    if (this.ctrlValue[0] > 3) {
                        ai.releaseEntity(this);
                    }
                }
                if (idx == 3) {
                    this.setTimer(2, 0.2, 4, 1);
                }
            });
            bullet.setTimer(1, 0.2, 4, 1);
            bullet.setTimer(3, 0.1, 1, 0);
        },
        solution_89_1: function (entity, v, angle, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.setMovementType(0);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setSpeed(ai.speedTransfer(500, angle), true);
                }
                if (idx == 2) {
                    this.setSpeed(ai.speedTransfer(200, angle), true);
                }
            });
            bullet.setTimer(1, 0.5, 1, 1);
            bullet.setTimer(2, 0.5, 1, 0);
        },
        solution_90: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec_1 = entity.getPosition();
                    for (let n = 0; n < 12; ++n) {
                        BulletSolutions.solution_90_1(entity, vec_1, n * 30 - 15 - 3 - 90, bulletIds[0]);
                        BulletSolutions.solution_90_1(entity, vec_1, n * 30 - 15 + 3 - 90, bulletIds[0]);
                    }
                }
                if (idx == 2) {
                    let vec_1 = entity.getPosition();
                    for (let n = 0; n < 12; ++n) {
                        BulletSolutions.solution_90_1(entity, vec_1, n * 30 - 3 - 90, bulletIds[0]);
                        BulletSolutions.solution_90_1(entity, vec_1, n * 30 + 3 - 90, bulletIds[0]);
                    }
                }
                if (idx == 3) {
                    let vec_1 = entity.getPosition();
                    this.ctrlValue[0] += 1;
                    BulletSolutions.solution_90_2(entity, vec_1, -90, bulletIds[1]);
                    if (this.ctrlValue[0] > 5) {
                        ai.releaseEntity(this);
                    }
                }
            });
            bullet.setTimer(1, 0, 1, 1);
            bullet.setTimer(2, 0.1, 1, 0);
            bullet.setTimer(3, 0.1, 6, 0);
        },
        solution_90_1: function (entity, v, angle, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.setMovementType(0);
            bullet.setSpeed(ai.speedTransfer(500, angle), true);
        },
        solution_90_2: function (entity, v, angle, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.setMovementType(0);
            bullet.setSpeed(ai.speedTransfer(400, angle), true);
        },
        solution_91: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let vec_1 = cc.v3(0, 0);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    for (let n = 0; n < 6; ++n) {
                        BulletSolutions.solution_91_1(entity, vec_1.add(cc.v3(70 + n * 100, 1136)), -90, bulletIds[0]);
                    }
                }
                if (idx == 2) {
                    for (let n = 0; n < 7; ++n) {
                        BulletSolutions.solution_91_1(entity, vec_1.add(cc.v3(0, 68 + n * 200)), 0, bulletIds[0]);
                    }
                    for (let m = 0; m < 6; ++m) {
                        BulletSolutions.solution_91_1(entity, vec_1.add(cc.v3(640, 68 + m * 200 + 100)), -180, bulletIds[0]);
                    }
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 1);
            bullet.setTimer(2, 0, 1, 1);
        },
        solution_91_1: function (entity, v, angle, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.setMovementType(0);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setSpeed(ai.speedTransfer(5, angle), true);
                }
                if (idx == 2) {
                    this.setSpeed(ai.speedTransfer(500, angle), true);
                }
            });
            bullet.setTimer(1, 1, 1, 1);
            bullet.setTimer(2, 1, 1, 0);
        },
        solution_92: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec_1 = entity.getPosition();
                    for (let n = 0; n < 12; ++n) {
                        BulletSolutions.solution_92_2(entity, vec_1, n * 30 - 15 - 3 - 90, bulletIds[0]);
                        BulletSolutions.solution_92_1(entity, vec_1, n * 30 - 15 + 3 - 90, bulletIds[1]);
                    }
                }
                if (idx == 2) {
                    let vec_1 = entity.getPosition();
                    this.ctrlValue[0] += 1;
                    for (let n = 0; n < 12; ++n) {
                        BulletSolutions.solution_92_2(entity, vec_1, n * 30 - 3 - 90, bulletIds[0]);
                        BulletSolutions.solution_92_1(entity, vec_1, n * 30 + 3 - 90, bulletIds[1]);
                    }
                    if (this.ctrlValue[0] > 2) {
                        ai.releaseEntity(this);
                    }
                }
            });
            bullet.setTimer(1, 0.15, 3, 1);
            bullet.setTimer(2, 0.15, 3, 0);
        },
        solution_92_1: function (entity, v, angle, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.setMovementType(0);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setSpeed(ai.speedTransfer(500, angle), true);
                }
                if (idx == 2) {
                    this.setSpeed(ai.speedTransfer(200, angle - 40), true);
                }
            });
            bullet.setTimer(1, 0, 1, 1);
            bullet.setTimer(2, 0.6, 1, 0);
        },
        solution_92_2: function (entity, v, angle, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.setMovementType(0);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setSpeed(ai.speedTransfer(500, angle), true);
                }
                if (idx == 2) {
                    this.setSpeed(ai.speedTransfer(200, angle + 40), true);
                }
            });
            bullet.setTimer(1, 0, 1, 1);
            bullet.setTimer(2, 0.6, 1, 0);
        },
        solution_93: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let vec_1 = ai.posTransfer(cc.v3(10/640, 568/1136));
            let vec_2 = ai.posTransfer(cc.v3(630/640, 568/1136));
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                this.ctrlValue[0] += 1;
                if (idx == 1) {
                    for (let n = 0; n < 10; ++n) {
                        BulletSolutions.solution_93_1(entity, vec_1.add(ai.speedTransfer(100, -n * (360 / 18) - 90)), -n * (360 / 18) + 90, bulletIds[0]);
                        BulletSolutions.solution_93_1(entity, vec_2.add(ai.speedTransfer(100, n * (360 / 18) - 90)), n * (360 / 18) + 90, bulletIds[1]);
                    }
                    if (this.ctrlValue[0] > 4) {
                        ai.releaseEntity(this);
                    }
                }
            });
            bullet.setTimer(1, 0.2, 5, 1);
        },
        solution_93_1: function (entity, v, angle, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.setEdgeCollision(2);
            bullet.setMovementType(0);
            bullet.setSpeed(ai.speedTransfer(300, angle), true);
        },
        solution_94: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec_1 = entity.getPosition();
                    this.ctrlValue[0] += 1;
                    for (let n = 0; n < 3; ++n) {
                        BulletSolutions.solution_94_1(entity, vec_1, n * 120 + 15 * this.ctrlValue[0] - 15 - 90, bulletIds[0]);
                        BulletSolutions.solution_94_1(entity, vec_1, n * 120 - 15 * this.ctrlValue[0] + 15 - 90, bulletIds[1]);
                    }
                    if (this.ctrlValue[0] > 11) {
                        ai.releaseEntity(this);
                    }
                }
            });
            bullet.setTimer(1, 0.2, 12, 1);
        },
        solution_94_1: function (entity, v, angle, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.setMovementType(0);
            bullet.setSpeed(ai.speedTransfer(400, angle), true);
        },
        solution_95: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec_1 = entity.getPosition();
                    this.ctrlValue[0] += 1;
                    for (let n = 0; n < 3; ++n) {
                        BulletSolutions.solution_95_1(entity, vec_1, n * 120 + 1 * this.ctrlValue[0] - 1 - 9, bulletIds[0]);
                    }
                    if (this.ctrlValue[0] > 59) {
                        Ai.releaseEntity(this);
                    }
                }
                if (idx == 2) {
                    let vec_1 = entity.getPosition();
                    for (let m = 0; m < 8; ++m) {
                        BulletSolutions.solution_95_1(entity, vec_1, m * 45 + 22.5 - 90, bulletIds[1]);
                    }
                }
            });
            bullet.setTimer(1, 0.05, 50, 1);
            bullet.setTimer(2, 0.2, 10, 0);
        },
        solution_95_1: function (entity, v, angle, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.setMovementType(0);
            bullet.setSpeed(ai.speedTransfer(400, angle), true);
        },
        solution_96: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec_1 = entity.getPosition();
                    for (let n = 0; n < 12; ++n) {
                        BulletSolutions.solution_96_1(entity, vec_1, n * 30, -360, -550, bulletIds[0]);
                    }
                }
                if (idx == 2) {
                    let vec_1 = entity.getPosition();
                    for (let n = 0; n < 12; ++n) {
                        BulletSolutions.solution_96_2(entity, vec_1, n * 30, -360, -450, bulletIds[1]);
                    }
                }
                if (idx == 3) {
                    let vec_1 = entity.getPosition();
                    for (let n = 0; n < 12; ++n) {
                        BulletSolutions.solution_96_3(entity, vec_1, n * 30, -360, -350, bulletIds[2]);
                    }
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.5, 1, 0);
            bullet.setTimer(3, 1, 1, 0);
        },
        solution_96_2: function (entity, ct, v, oa, ca, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(ct);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setObjectAutoCircle(10, v, 450, ca, 360, oa, 1);
                }
                if (idx == 2) {
                    this.setObjectAutoCircleOmegaAcc(0);
                    this.getObjectAutoCircleRSpeedAcc(0);
                    this.setSpeed(ai.speedTransfer(200, -90));
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 1, 1, 0);
        },
        solution_96_3: function (entity, ct, v, oa, ca, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(ct);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setObjectAutoCircle(10, v, 350, ca, 360, oa, 1);
                }
                if (idx == 2) {
                    this.setObjectAutoCircleOmegaAcc(0);
                    this.getObjectAutoCircleRSpeedAcc(0);
                    this.setSpeed(ai.speedTransfer(200, -90));
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 1, 1, 0);
        },
        solution_96_1: function (entity, ct, v, oa, ca, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(ct);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setObjectAutoCircle(10, v, 550, ca, 360, oa, 1);
                }
                if (idx == 2) {
                    this.setObjectAutoCircleOmegaAcc(0);
                    this.getObjectAutoCircleRSpeedAcc(0);
                    this.setSpeed(ai.speedTransfer(200, -90));
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 1, 1, 0);
        },
        solution_97: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec_1 = entity.getPosition();
                    this.ctrlValue[0] += 1;
                    for (let n = 0; n < 12; ++n) {
                        let s = 600 - this.ctrlValue[0] * 30;
                        let a = n * 360 / 24 + 90 + 7.5;
                        BulletSolutions.solution_97_1(entity, vec_1, s, a - 90, bulletIds[0]);
                    }
                    if (this.ctrlValue[0] > 9) {
                        ai.releaseEntity(this);
                    }
                }
            });
            bullet.setTimer(1, 0.2, 10, 1);
        },
        solution_97_1: function (entity, v, speed, angle, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setMovementType(0);
                    this.setSpeed(ai.speedTransfer(speed, angle), true);
                    this.setSpeedAcc(ai.speedTransfer(speed, angle + 180));
                }
            });
            bullet.setTimer(1, 0, 1, 0);
        },
        solution_98: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec_1 = entity.getPosition();
                    for (let n = 0; n < 8; ++n) {
                        BulletSolutions.solution_98_1(entity, vec_1, 200, n * 45 - 90, bulletIds[0]);
                    }
                }
                if (idx == 2) {
                    let vec_1 = entity.getPosition();
                    for (let n = 0; n < 8; ++n) {
                        BulletSolutions.solution_98_1(entity, vec_1, 200, n * 45 - 7.5 - 90, bulletIds[0]);
                        BulletSolutions.solution_98_1(entity, vec_1, 200, n * 45 + 7.5 - 90, bulletIds[0]);
                    }
                }
                if (idx == 3) {
                    let vec_1 = entity.getPosition();
                    for (let n = 0; n < 24; ++n) {
                        BulletSolutions.solution_98_1(entity, vec_1, 200, n * 15 - 90, bulletIds[0]);
                    }
                }
                if (idx == 4) {
                    let vec_1 = entity.getPosition();
                    for (let n = 0; n < 24; ++n) {
                        BulletSolutions.solution_98_1(entity, vec_1, 200, n * 15 + 7.5 - 90, bulletIds[0]);
                    }
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 1);
            bullet.setTimer(2, 0.2, 1, 0);
            bullet.setTimer(3, 0.4, 1, 0);
            bullet.setTimer(4, 0.6, 1, 0);
        },
        solution_98_1: function (entity, v, speed, angle, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setMovementType(0);
                    this.setSpeed(ai.speedTransfer(speed, angle), true);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
        },
        solution_99: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let vec_1 = entity.getPosition();
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    for (let n = 0; n < 10; ++n) {
                        BulletSolutions.solution_99_1(entity, vec_1.add(cc.v3(-100 + n * 20, 100)), ai.getAngle(vec_1, vec_1.add(cc.v3(-100 + n * 20, 100))), bulletIds[0]);
                        BulletSolutions.solution_99_1(entity, vec_1.add(cc.v3(100 - n * 20, -100)), ai.getAngle(vec_1, vec_1.add(cc.v3(100 - n * 20, -100))), bulletIds[0]);
                        BulletSolutions.solution_99_1(entity, vec_1.add(cc.v3(100, 100 - n * 20)), ai.getAngle(vec_1, vec_1.add(cc.v3(100, 100 - n * 20))), bulletIds[0]);
                        BulletSolutions.solution_99_1(entity, vec_1.add(cc.v3(-100, -100 + n * 20)), ai.getAngle(vec_1, vec_1.add(cc.v3(-100, -100 + n * 20))), bulletIds[0]);
                    }
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 1);
        },
        solution_99_1: function (entity, v, angle, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.runScale(0.8, 1);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setMovementType(0);
                    this.setSpeed(ai.speedTransfer(1, angle), true);
                }
                if (idx == 2) {
                    this.setMovementType(0);
                    this.setSpeed(ai.speedTransfer(200, angle + 180), true);
                }
            });
            bullet.setTimer(1, 1, 1, 0);
            bullet.setTimer(2, 1, 1, 0);
        },
        solution_100: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let vec_1 = entity.getPosition();
            bullet.ctrlValue[0] = 0;
            bullet.ctrlValue[1] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.ctrlValue[0] += 1;
                    for (let n = 0; n < 6; ++n) {
                        BulletSolutions.solution_100_1(entity, vec_1.add(ai.speedTransfer(5, n * 60 + 10 * this.ctrlValue[0] - 10)), 300, n * 60 + 10 * this.ctrlValue[0] - 10 - 90, bulletIds[0]);
                    }
                }
                if (idx == 2) {
                    this.ctrlValue[1] += 1;
                    for (let n = 0; n < 6; ++n) {
                        BulletSolutions.solution_100_1(entity, vec_1.add(ai.speedTransfer(5, -n * 60 - 10 * this.ctrlValue[1] + 10)), 200, -n * 60 - 10 * this.ctrlValue[1] - 10 - 90, bulletIds[1]);
                    }
                    if (this.ctrlValue[1] > 5) {
                        ai.releaseEntity(this);
                    }
                }
            });
            bullet.setTimer(1, 0.2, 6, 1);
            bullet.setTimer(2, 0.2, 6, 0);
        },
        solution_100_1: function (entity, v, s, angle, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setMovementType(0);
                    this.setSpeed(ai.speedTransfer(s, angle), true);
                }
                if (idx == 2) {
                    this.setMovementType(0);
                    this.setSpeed(ai.speedTransfer(1, angle), true);
                }
                if (idx == 3) {
                    this.setMovementType(0);
                    this.setSpeed(ai.speedTransfer(300, angle), true);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 1, 1, 0);
            bullet.setTimer(3, 2.5, 1, 0)
        },
        solution_101: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let vec_1 = ai.posTransfer(cc.v3(220/640, 800/1136));
            let vec_2 = ai.posTransfer(cc.v3(420/640, 800/1136));
            let vec_3 = ai.posTransfer(cc.v3(280/640, 568/1136));
            let vec_4 = ai.posTransfer(cc.v3(360/640, 568/1136));
            let vec_5 = ai.posTransfer(cc.v3(50/640, 300/1136));
            let vec_6 = ai.posTransfer(cc.v3(590/640, 300/1136));
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    for (let n = 0; n < 8; ++n) {
                        BulletSolutions.solution_101_1(entity, vec_1.add(ai.speedTransfer(50, n * 45)), n * 45 - 90, bulletIds[0]);
                        BulletSolutions.solution_101_1(entity, vec_2.add(ai.speedTransfer(50, n * 45)), n * 45 - 90, bulletIds[0]);
                        BulletSolutions.solution_101_1(entity, vec_3.add(ai.speedTransfer(50, n * 45)), n * 45 - 90, bulletIds[0]);
                        BulletSolutions.solution_101_1(entity, vec_4.add(ai.speedTransfer(50, n * 45)), n * 45 - 90, bulletIds[0]);
                        BulletSolutions.solution_101_1(entity, vec_5.add(ai.speedTransfer(50, n * 45)), n * 45 - 90, bulletIds[0]);
                        BulletSolutions.solution_101_1(entity, vec_6.add(ai.speedTransfer(50, n * 45)), n * 45 - 90, bulletIds[0]);
                    }
                }
            });
            bullet.setTimer(1, 0, 1, 1);
        },
        solution_101_1: function (entity, v, angle, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.runScale(0.8, 0.8);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setMovementType(0);
                    this.setSpeed(ai.speedTransfer(1, angle), true);
                }
                if (idx == 2) {
                    this.setMovementType(0);
                    this.setSpeed(ai.speedTransfer(300, angle), true);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 1, 1, 0);
        },
        solution_102: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let vec_1 = entity.getPosition();
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    for (let n = 0; n < 6; ++n) {
                        BulletSolutions.solution_102_1(entity, vec_1.add(ai.speedTransfer(50, n * 60)), n * 60, bulletIds[0], bulletIds[1]);
                    }
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
        },
        solution_102_1: function (entity, v, angle, bulletId, bulletId_1) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.setMovementType(0);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setSpeed(ai.speedTransfer(200, angle), true);
                }
                if (idx == 2) {
                    for (let m = 0; m < 6; ++m) {
                        let vec_2 = this.getPosition();
                        BulletSolutions.solution_102_2(entity, vec_2.add(ai.speedTransfer(5, m * 30 - 90)), m * 30 - 180, bulletId_1);
                    }
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 1, 1, 0);
        },
        solution_102_2: function (entity, v, angle, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.setMovementType(0);
            bullet.setSpeed(ai.speedTransfer(200, angle), true);
        },
        solution_103: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.ctrlValue[1] = 0;
            bullet.ctrlValue[2] = 0;
            bullet.ctrlValue[3] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec_1 = entity.getPosition();
                    this.ctrlValue[0] += 1;
                    BulletSolutions.solution_103_1(entity, vec_1, 200, 7 * this.ctrlValue[0] - 180, bulletIds[0]);
                }
                if (idx == 2) {
                    let vec_1 = entity.getPosition();
                    this.ctrlValue[1] += 1;
                    BulletSolutions.solution_103_1(entity, vec_1, 250, 7 * this.ctrlValue[1] - 180, bulletIds[0]);
                }
                if (idx == 3) {
                    let vec_1 = entity.getPosition();
                    this.ctrlValue[2] += 1;
                    BulletSolutions.solution_103_1(entity, vec_1, 300, 7 * this.ctrlValue[2] - 180, bulletIds[0]);
                }
                if (idx == 4) {
                    let vec_1 = entity.getPosition();
                    this.ctrlValue[3] += 1;
                    BulletSolutions.solution_103_1(entity, vec_1, 350, 7 * this.ctrlValue[3] - 180, bulletIds[0]);
                    if (this.ctrlValue[3] > 99) {
                        ai.releaseEntity(this);
                    }
                }
                if (idx == 5) {
                    this.setTimer(2, 0.1, 100, 1);
                }
                if (idx == 6) {
                    this.setTimer(3, 0.1, 100, 1);
                }
                if (idx == 7) {
                    this.setTimer(4, 0.1, 100, 1);
                }
            });
            bullet.setTimer(1, 0.1, 100, 1);
            bullet.setTimer(5, 0.1, 1, 0);
            bullet.setTimer(6, 0.2, 1, 0);
            bullet.setTimer(7, 0.3, 1, 0);
        },
        solution_103_1: function (entity, v, s, angle, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.setMovementType(0);
            bullet.setSpeed(ai.speedTransfer(s, angle), true);
        },
        solution_104: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.ctrlValue[1] = 0;
            bullet.ctrlValue[2] = 0;
            bullet.ctrlValue[3] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec_1 = entity.getPosition();
                    this.ctrlValue[0] += 1;
                    for (let n = 0; n < 8; ++n) {
                        BulletSolutions.solution_104_1(entity, vec_1.add(ai.speedTransfer(5, n * 45 + 2 * this.ctrlValue[0] - 10 - 25)), 300, n * 45 + 2 * this.ctrlValue[0] - 10 - 25 - 90, bulletIds[0]);
                    }
                }
                if (idx == 2) {
                    let vec_1 = entity.getPosition();
                    this.ctrlValue[1] += 1;
                    for (let n = 0; n < 8; ++n) {
                        BulletSolutions.solution_104_1(entity, vec_1.add(ai.speedTransfer(5, n * 45 + 40 - 10 - 25 - 2 * this.ctrlValue[1])), 300, n * 45 + 40 - 10 - 25 - 2 * this.ctrlValue[1] - 90, bulletIds[0]);
                    }
                }
                if (idx == 3) {
                    let vec_1 = entity.getPosition();
                    this.ctrlValue[2] += 1;
                    for (let n = 0; n < 8; ++n) {
                        BulletSolutions.solution_104_1(entity, vec_1.add(ai.speedTransfer(5, n * 45 + 2 * this.ctrlValue[2] - 10 - 25)), 300, n * 45 + 2 * this.ctrlValue[2] - 10 - 25 - 90, bulletIds[0]);
                    }
                }
                if (idx == 4) {
                    let vec_1 = entity.getPosition();
                    this.ctrlValue[3] += 1;
                    for (let n = 0; n < 8; ++n) {
                        BulletSolutions.solution_104_1(entity, vec_1.add(ai.speedTransfer(5, n * 45 + 40 - 10 - 25 - 2 * this.ctrlValue[3])), 300, n * 45 + 40 - 10 - 25 - 2 * this.ctrlValue[3] - 90, bulletIds[0]);
                    }
                    if (this.ctrlValue[3] > 19) {
                        ai.releaseEntity(this);
                    }
                }
                if (idx == 5) {
                    this.setTimer(2, 0.05, 20, 1);
                }
                if (idx == 6) {
                    this.setTimer(3, 0.05, 20, 1);
                }
                if (idx == 7) {
                    this.setTimer(4, 0.05, 20, 1);
                }
            });
            bullet.setTimer(1, 0.05, 20, 1);
            bullet.setTimer(5, 0.95, 1, 0);
            bullet.setTimer(6, 1.9, 1, 0);
            bullet.setTimer(7, 2.85, 1, 0);
        },
        solution_104_1: function (entity, v, s, angle, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.setMovementType(0);
            bullet.setSpeed(ai.speedTransfer(s, angle), true);
        },
        solution_105: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec_1 = entity.getPosition()
                    this.ctrlValue[0] += 1;
                    for (let n = 0; n < 8; ++n) {
                        BulletSolutions.solution_105_1(entity, vec_1,vec_1.add(ai.speedTransfer(5,n * (360 / 8))), 60, bulletIds[0]);
                        BulletSolutions.solution_105_1(entity, vec_1,vec_1.add(ai.speedTransfer(5,n * (360 / 8))),-60, bulletIds[1]);
                    }
                    if (this.ctrlValue[0] > 4) {
                        ai.releaseEntity(this);
                    }
                }
            });
            bullet.setTimer(1, 1, 5, 1);
        },
        solution_105_1: function (entity, ct, v, om, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(ct);
            bullet.setEntitySelfCircle(8,0);
            bullet.setEntityAutoCircle(ct,v.sub(ct),om,0,150,0,0);
            bullet.setMovementType(1);
        },
        solution_106: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let vec_1 = entity.getPosition()
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.ctrlValue[0] += 1;
                    for (let n = 0; n < 12; ++n) {
                        let vec_2 = vec_1.add(ai.speedTransfer(200, this.ctrlValue[0] * 20));
                        BulletSolutions.solution_106_1(entity, vec_2, n * (360 / 12), 60, bulletIds[0]);
                    }
                    if (this.ctrlValue[0] > 17) {
                        ai.releaseEntity(this);
                    }
                }
            });
            bullet.setTimer(1, 0.1, 18, 1);
        },
        solution_106_1: function (entity, ct, v, om, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(ct);
            bullet.setObjectSelfCircle(10);
            bullet.setObjectAutoCircle(5, v, 50, 0, om, 0, 0);
        },
        solution_107: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let vec_1 = entity.getPosition()
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.ctrlValue[0] += 1;
                    for (let m = 0; m < 11; ++m) {
                        for (let n = 0; n < 12; ++n) {
                            let vec_2 = vec_1.add(ai.speedTransfer(150, m * 30 + 30 - 90));
                            BulletSolutions.solution_107_1(entity, vec_2.add(ai.speedTransfer(5, n * (360 / 12))), n * (360 / 12) - 90, bulletIds[0]);
                        }
                    }
                    if (this.ctrlValue[0] > 17) {
                        ai.releaseEntity(this);
                    }
                }
            });
            bullet.setTimer(1, 0, 1, 0);
        },
        solution_107_1: function (entity, v, angle, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.setMovementType(0);
            bullet.runScale(0.8, 0.8);
            bullet.setObjectSelfCircle(8);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setSpeed(ai.speedTransfer(30, angle), true);
                }
                if (idx == 2) {
                    this.setSpeed(ai.speedTransfer(150, angle), true);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 2, 1, 0);
        },
        solution_108: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let vec_1 = entity.getPosition()
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.ctrlValue[0] += 1;
                    for (let n = 0; n < 36; ++n) {
                        let vec_2 = vec_1.add(cc.v3(0, 100 + this.ctrlValue[0] * 10));
                        BulletSolutions.solution_108_1(entity, vec_2.add(ai.speedTransfer(10 + this.ctrlValue[0] * 7, n * (360 / 36))), n * (360 / 36) - 90, this.ctrlValue[0], bulletIds[0]);
                    }
                    if (this.ctrlValue[0] > 4) {
                        ai.releaseEntity(this);
                    }
                }
            });
            bullet.setTimer(1, 0.05, 10, 0);
        },
        solution_108_1: function (entity, v, angle, a, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.setMovementType(0);
            bullet.runScale(1, 0.7);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setSpeed(ai.speedTransfer(5, angle), true);
                }
                if (idx == 2) {
                    this.setSpeed(ai.speedTransfer(400, angle), true);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 2 - a * 0.1, 1, 0);
        },
        //solution_109 -   飞机弹幕方案
        solution_109: function (entity, bulletIds) {
            //曙光1阶  cd = 0.2s
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec, 2000, 180 - 90, bulletIds[0], 204);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(15 * 0.7, 0)), 2000, 177 - 90, bulletIds[1]);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-15 * 0.7, 0)), 2000, 183 - 90, bulletIds[1]);
                }
                if (idx == 3) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.02, 1, 0);
            bullet.setTimer(2, 0.05, 1, 0)
            bullet.setTimer(3, 0.1, 1, 0);
        },
        solution_109_1: function (entity, v, speed, angle, bt) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bt, entity);
            bullet.opacity = (204);
            bullet.setPosition(v.add(cc.v3(0, 50 * 0.7)));
            bullet.setMovementType(0);
            bullet.setSpeed(ai.speedTransfer(speed, angle), true)
        },
        //直线
        solution_110: function (entity, bulletIds) {
            //曙光2阶 cd = 0.15s
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec, 2000, 180 - 90, bulletIds[0]);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(15 * 0.7, 0)), 2000, 177 - 90, bulletIds[1]);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-15 * 0.7, 0)), 2000, 183 - 90, bulletIds[1]);
                }
                if (idx == 3) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.02, 1, 0);
            bullet.setTimer(2, 0.05, 1, 0)
            bullet.setTimer(3, 0.1, 1, 0);
        },
        solution_111: function (entity, bulletIds) {
            //曙光3阶  cd = 0.1s
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec, 2000, 180 - 90, bulletIds[0]);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(15 * 0.7, 0)), 2000, 177 - 90, bulletIds[1]);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-15 * 0.7, 0)), 2000, 183 - 90, bulletIds[1]);
                }
                if (idx == 3) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.02, 1, 0);
            bullet.setTimer(2, 0.05, 1, 0)
            bullet.setTimer(3, 0.1, 1, 0);
        },
        solution_112: function (entity, bulletIds) {
            //曙光暴走  cd = 0.5s
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec, 3000, 180 - 90, bulletIds[0], 204);
                    bullet.setTimer(2, 0.01, 1, 0);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(25 * 0.7, 0)), 3000, 170 - 90, bulletIds[1]);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-25 * 0.7, 0)), 3000, 190 - 90, bulletIds[1]);
                }
                if (idx == 3) {
                    this.setTimer(1, 0.05, 10, 0);
                }
                if (idx == 4) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(3, 0.02, 1, 0);
            bullet.setTimer(4, 0.7, 1, 0);
        },
        solution_113: function (entity, bulletIds) {
            //流浪者1阶  cd = 0.2s
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(0, 20)), 2000, 180 - 90, bulletIds[0]);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(30 * 0.7, 20)), 2000, 180 - 90, bulletIds[1]);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-30 * 0.7, 20)), 2000, 180 - 90, bulletIds[1]);
                }
                if (idx == 3) {
                    this.setTimer(1, 0.02, 1, 0);
                    this.setTimer(2, 0.1, 1, 0);
                }
                if (idx == 4) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(3, 0.02, 1, 0);
            bullet.setTimer(4, 0.2, 1, 0);
        },
        solution_114: function (entity, bulletIds) {
            //流浪者2阶  cd = 0.15s
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(0, 20)), 2000, 180 - 90, bulletIds[0]);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    this.ctrlValue[0] += 1;
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(30 * 0.7, 20)), 2000, 180 - this.ctrlValue[0] * 2 - 90, bulletIds[1]);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-30 * 0.7, 20)), 2000, 180 + this.ctrlValue[0] * 2 - 90, bulletIds[1]);
                }
                if (this.ctrlValue[0] > 4) {
                    this.ctrlValue[0] = 0;
                }
                if (idx == 3) {
                    this.setTimer(1, 0.02, 1, 0);
                    this.setTimer(2, 0.03, 5, 0);
                }
                if (idx == 4) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(3, 0.02, 1, 0);
            bullet.setTimer(4, 0.2, 1, 0);
        },
        solution_115: function (entity, bulletIds) {
            //流浪者3阶  cd = 0.1s
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(0, 20)), 2000, 180 - 90, bulletIds[0]);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    this.ctrlValue[0] += 1;
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(30 * 0.7, 20)), 2000, 180 - this.ctrlValue[0] * 2 - 90, bulletIds[1]);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-30 * 0.7, 20)), 2000, 180 + this.ctrlValue[0] * 2 - 90, bulletIds[1]);
                }
                if (this.ctrlValue[0] > 4) {
                    this.ctrlValue[0] = 0;
                }
                if (idx == 3) {
                    this.setTimer(1, 0.02, 1, 0);
                    this.setTimer(2, 0.02, 5, 0);
                }
                if (idx == 4) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(3, 0.02, 1, 0);
            bullet.setTimer(4, 0.15, 5, 0);
        },
        solution_116: function (entity, bulletIds) {
            //流浪者4阶  cd = 0.5s
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    this.ctrlValue[0] += 1;
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(0, 20)), 4000, 180 - 90, bulletIds[0], 0.6);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(0, 20)), 4000, 180 - this.ctrlValue[0] * 2 - 90, bulletIds[1]);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(0, 20)), 4000, 180 + this.ctrlValue[0] * 2 - 90, bulletIds[1]);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(80 * 0.7, 20)), 4000, 180 - this.ctrlValue[0] * 2 - 90, bulletIds[1]);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-80 * 0.7, 20)), 4000, 180 + this.ctrlValue[0] * 2 - 90, bulletIds[1]);
                }
                if (this.ctrlValue[0] > 4) {
                    this.ctrlValue[0] = 0;
                }
                if (idx == 2) {
                    this.setTimer(1, 0.05, 10, 0);
                }
                if (idx == 3) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(2, 0.02, 1, 0);
            bullet.setTimer(3, 0.6, 1, 0);
        },
        solution_117: function (entity, bulletIds) {
            //守护之翼1阶  cd = 0.2s
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec, 2000, 180 - 90, bulletIds[0], 1);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.02, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
        },
        solution_118: function (entity, bulletIds) {
            //守护之翼2阶  cd = 0.15s
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec, 2000, 180 - 90, bulletIds[0], 1);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.02, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
        },
        solution_119: function (entity, bulletIds) {
            //守护之翼3阶  cd = 0.1s
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec, 2000, 180 - 90, bulletIds[0], 1);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.02, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
        },
        solution_120: function (entity, bulletIds) {
            //守护之翼4阶  cd = 1s
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    this.ctrlValue[0] += 1;
                    BulletSolutions.solution_109_1(entity, vec, 3000, 180 - 90, bulletIds[0], 1);
                    BulletSolutions.solution_109_1(entity, vec, 3000, 180 + (10 - this.ctrlValue[0]) * 3 - 90, bulletIds[1], 1);
                    BulletSolutions.solution_109_1(entity, vec, 3000, 180 - (10 - this.ctrlValue[0]) * 3 - 90, bulletIds[2], 1);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.05, 20, 0);
            bullet.setTimer(1, 1.1, 20, 0);
        },
        solution_121: function (entity, bulletIds) {
            //疾风之刃1阶  cd = 0.2s
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(25 * 0.7, 20)), 1400, 175 - 90, bulletIds[0], 1);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-25 * 0.7, 20)), 1400, 185 - 90, bulletIds[1], 1);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.07, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
        },
        solution_122: function (entity, bulletIds) {
            //疾风之刃2阶  cd = 0.15s
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(0, 20)), 1800, 180 - 90, bulletIds[0], 1);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(25 * 0.7, 20)), 1800, 175 - 90, bulletIds[1], 1);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-25 * 0.7, 20)), 1800, 185 - 90, bulletIds[1], 1);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.08, 2, 0);
            bullet.setTimer(2, 0.2, 1, 0);
        },
        solution_123: function (entity, bulletIds) {
            //疾风之刃3阶  cd = 0.5s
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    this.ctrlValue[0] += 1;
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(0, 20)), 2000, 180 - 90, bulletIds[0], 0.7);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(25 * 0.7, 20)), 2000, 180 - 5 * this.ctrlValue[0] - 90, bulletIds[1], 1);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-25 * 0.7, 20)), 2000, 180 + 5 * this.ctrlValue[0] - 90, bulletIds[1], 1);
                    if (this.ctrlValue[0] > 4) {
                        this.ctrlValue[0] = 0;
                    }
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.05, 10, 0);
            bullet.setTimer(2, 0.6, 1, 0);
        },
        solution_124: function (entity, bulletIds) {
            //疾风之刃4阶  cd = 0.5s
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.ctrlValue[1] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    this.ctrlValue[0] += 1;
                    this.ctrlValue[1] += 1;
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(0, 20)), 2000, 180 - 90, bulletIds[0], 0.8);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(25 * 0.7, 20)), 2000, 180 - 5 * this.ctrlValue[0] - 90, bulletIds[1], 1);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-25 * 0.7, 20)), 2000, 180 + 5 * this.ctrlValue[0] - 90, bulletIds[2], 1);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(25 * 0.7, 20)), 2000, 180 - 10 * this.ctrlValue[1] - 90, bulletIds[3], 1);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-25 * 0.7, 20)), 2000, 180 + 10 * this.ctrlValue[1] - 90, bulletIds[4], 1);
                    if (this.ctrlValue[0] > 4) {
                        this.ctrlValue[0] = 0;
                    }
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.05, 10, 0);
            bullet.setTimer(1, 0.6, 1, 0);
        },
        solution_125: function (entity, bulletIds) {
            //风暴1阶  cd = 0.2s
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(8 * 0.7, 30)), 2000, 180 - 90, bulletIds[0], 0.8);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-8 * 0.7, 30)), 2000, 180 - 90, bulletIds[0], 0.8);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(40 * 0.7, 30)), 1200, 180 - 90, bulletIds[1], 1);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-40 * 0.7, 30)), 1200, 180 - 90, bulletIds[1], 1);
                }
                if (idx == 3) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.02, 1, 0);
            bullet.setTimer(2, 0.2, 1, 0);
            bullet.setTimer(3, 0.3, 1, 0);
        },
        solution_126: function (entity, bulletIds) {
            //风暴2阶  cd = 0.15s
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec, 2200, 180 - 90, bulletIds[0], 1);
                    bullet.setTimer(3, 0.03, 1, 0);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(40 * 0.7, 30)), 1400, 180 - 90, bulletIds[1], 1);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-40 * 0.7, 30)), 1400, 180 - 90, bulletIds[1], 1);
                }
                if (idx == 3) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(8 * 0.7, 30)), 2200, 180 - 90, bulletIds[2], 0.8);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-8 * 0.7, 30)), 2200, 180 - 90, bulletIds[2], 0.8);
                }
                if (idx == 4) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.02, 1, 0);
            bullet.setTimer(2, 0.18, 1, 0);
            bullet.setTimer(4, 0.2, 1, 0);
        },
        solution_127: function (entity, bulletIds) {
            //风暴3阶  cd = 0.1s
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec, 2400, 180 - 90, bulletIds[0], 1);
                    bullet.setTimer(3, 0.03, 1, 0);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(40 * 0.7, 30)), 1600, 180 - 90, bulletIds[1], 0.8);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-40 * 0.7, 30)), 1600, 180 - 90, bulletIds[1], 0.8);
                }
                if (idx == 3) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(16 * 0.7, 30)), 2400, 180 - 90, bulletIds[2], 0.4);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-16 * 0.7, 30)), 2400, 180 - 90, bulletIds[2], 0.4);
                }
                if (idx == 4) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.02, 1, 0);
            bullet.setTimer(2, 0.15, 1, 0);
            bullet.setTimer(4, 0.2, 1, 0);
        },
        solution_128: function (entity, bulletIds) {
            //风暴4阶  cd = 0.5s
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-30 * 0.7, 30)), 2000, 180 - 90, bulletIds[0], 1);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(8 * 0.7, 30)), 1600, 180 - 90, bulletIds[1], 0.8);
                }
                if (idx == 3) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-8 * 0.7, 30)), 2200, 180 - 90, bulletIds[1], 0.8);
                }
                if (idx == 4) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(70 * 0.7, 30)), 2000, 180 - 90, bulletIds[2], 0.7);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-70 * 0.7, 30)), 2000, 180 - 90, bulletIds[2], 0.7);
                }
                if (idx == 5) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(30 * 0.7, 30)), 2000, 180 - 90, bulletIds[0], 1);
                }
                if (idx == 6) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec, 2500, 180 - 90, bulletIds[3], 0.4);
                }
                if (idx == 7) {
                    this.setTimer(3, 0.1, 5, 0);
                }
                if (idx == 8) {
                    this.setTimer(5, 0.05, 10, 0);
                }
                if (idx == 9) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.05, 10, 0);
            bullet.setTimer(2, 0.1, 5, 0);
            bullet.setTimer(7, 0.05, 1, 0);
            bullet.setTimer(4, 0.1, 5, 0);
            bullet.setTimer(8, 0.05, 1, 0);
            bullet.setTimer(6, 0.05, 10, 0);
            bullet.setTimer(9, 0.6, 1, 0);
        },
        solution_129: function (entity, bulletIds) {
            //黄金魅影1阶  cd = 0.2s
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec, 2000, 180 - 90, bulletIds[0], 1.2);
                    this.setTimer(2, 0.02, 1, 0);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(35 * 0.7, 20)), 2000, 180 - 90, bulletIds[1], 0.6);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-35 * 0.7, 20)), 2000, 180 - 90, bulletIds[1], 0.6);
                }
                if (idx == 3) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.03, 1, 0);
            bullet.setTimer(3, 0.1, 1, 0);
        },
        solution_130: function (entity, bulletIds) {
            //黄金魅影2阶  cd = 0.15s
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec, 2300, 180 - 90, bulletIds[0], 1.2);
                    bullet.setTimer(2, 0.03, 1, 0);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(40 * 0.7, 20)), 2300, 180 - 90, bulletIds[1], 0.6);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-40 * 0.7, 20)), 2300, 180 - 90, bulletIds[1], 0.6);
                }
                if (idx == 3) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.03, 1, 0);
            bullet.setTimer(3, 0.2, 1, 0);
        },
        solution_131: function (entity, bulletIds) {
            //黄金魅影3阶  cd = 0.1s
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec, 2600, 180 - 90, bulletIds[0], 1.2);
                    this.setTimer(2, 0.03, 1, 0);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(50 * 0.7, 20)), 2600, 180 - 90, bulletIds[1], 0.5);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-50 * 0.7, 20)), 2600, 180 - 90, bulletIds[1], 0.5);
                }
                if (idx == 3) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.03, 1, 0);
            bullet.setTimer(3, 0.2, 1, 0);
        },
        solution_132: function (entity, bulletIds) {
            //黄金魅影4阶  cd = 0.5s
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec, 3000, 180 - 90, bulletIds[0], 1.2);
                    this.setTimer(2, 0.01, 1, 0);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec, 4000, 176 - 90, bulletIds[1], 0.6);
                    BulletSolutions.solution_109_1(entity, vec, 4000, 184 - 90, bulletIds[1], 0.6);
                    BulletSolutions.solution_109_1(entity, vec, 4000, 172 - 90, bulletIds[2], 1);
                    BulletSolutions.solution_109_1(entity, vec, 4000, 188 - 90, bulletIds[2], 1);
                    BulletSolutions.solution_109_1(entity, vec, 4000, 168 - 90, bulletIds[1], 0.6);
                    BulletSolutions.solution_109_1(entity, vec, 4000, 192 - 90, bulletIds[1], 0.6);
                }
                if (idx == 3) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.07, 7, 0);
            bullet.setTimer(3, 0.6, 1, 0);
        },
        solution_133: function (entity, bulletIds) {
            //紫电苍穹1阶  cd = 0.2s
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(0, 100)), 2000, 180 - 90, bulletIds[0], 0.6);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(20, 100)), 1600, 178 - 90, bulletIds[1], 1);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-20, 100)), 1600, 182 - 90, bulletIds[1], 1);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.02, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
        },
        solution_134: function (entity, bulletIds) {
            //紫电苍穹2阶  cd = 0.15s
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec, 2200, 180 - 90, bulletIds[0], 0.6);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(40, -5)), 1800, 175 - 90, bulletIds[0], 0.6);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-40, -5)), 1800, 185 - 90, bulletIds[0], 0.6);
                }
                if (idx == 3) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(25, 0)), 2200, 180 - 90, bulletIds[1], 1);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-25, 0)), 2200, 180 - 90, bulletIds[1], 1);
                }
                if (idx == 4) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.02, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
            bullet.setTimer(3, 0.085, 1, 0);
            bullet.setTimer(4, 0.2, 1, 0);
        },
        solution_135: function (entity, bulletIds) {
            //紫电苍穹3阶  cd = 0.5s
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(45, 0)), 2800, 180 - 90, bulletIds[0], 1);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-45, 0)), 2800, 180 - 90, bulletIds[0], 1);
                }
                if (idx == 2) {
                    this.setTimer(4, 0.1, 5, 0);
                }
                if (idx == 3) {
                    let vec = entity.getPosition();
                    bullet.ctrlValue[0] += 1;
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-60, 0)), 1600, 210 - 3 * this.ctrlValue[0] - 90, bulletIds[0], 1);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(60, 0)), 1600, 150 + 3 * this.ctrlValue[0] - 90, bulletIds[0], 1);
                    if (this.ctrlValue[0] > 9) {
                        this.ctrlValue[0] = 0;
                    }
                }
                if (idx == 4) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(15, 0)), 2800, 180 - 90, bulletIds[1], 0.6);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-15, 0)), 2800, 180 - 90, bulletIds[1], 0.6);
                }
                if (idx == 5) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.1, 5, 0);
            bullet.setTimer(2, 0.01, 1, 0);
            bullet.setTimer(3, 0.05, 10, 0);
            bullet.setTimer(5, 0.6, 1, 0);
        },
        solution_136: function (entity, bulletIds) {
            //紫电苍穹4阶  cd = 1s
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.ctrlValue[1] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(70, 0)), 1600, 182 - 90, bulletIds[0], 0.6);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-70, 0)), 1600, 178 - 90, bulletIds[0], 0.6);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(30, 0)), 2000, 181 - 90, bulletIds[1], 1);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-30, 0)), 2000, 179 - 90, bulletIds[1], 1);
                    BulletSolutions.solution_109_1(entity, vec, 2400, 180 - 90, 171, 0.6);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    bullet.ctrlValue[0] += 1;
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-70, 0)), 2000, 155 + 5 * this.ctrlValue[0] - 90, bulletIds[1], 1);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(70, 0)), 2000, 205 - 5 * this.ctrlValue[0] - 90, bulletIds[1], 1);
                    if (this.ctrlValue[0] > 9) {
                        this.setTimer(4, 0.05, 9, 0);
                    }
                }
                if (idx == 3) {
                    let vec = entity.getPosition();
                    for (let n = 0; n < 36; ++n) {
                        if (n % 2 == 0) {
                            BulletSolutions.solution_109_1(entity, vec.add(cc.v3(0, 100)), 1000, 180 - n * 10 - 90, bulletIds[0], 0.6);
                        } else {
                            BulletSolutions.solution_109_1(entity, vec.add(cc.v3(0, 100)), 1600, 180 - n * 10 - 90, bulletIds[1], 1);
                        }
                    }
                }
                if (idx == 4) {
                    let vec = entity.getPosition();
                    bullet.ctrlValue[1] += 1;
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-70, 0)), 2000, 205 - 5 * this.ctrlValue[1] - 90, bulletIds[1], 1);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(70, 0)), 2000, 155 + 5 * this.ctrlValue[1] - 90, bulletIds[1], 1);
                }
                if (idx == 5) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.05, 20, 0);
            bullet.setTimer(2, 0.05, 10, 0);
            bullet.setTimer(3, 0.475, 1, 0);
            bullet.setTimer(5, 1, 1, 0);
        },
        solution_137: function (entity, bulletIds) {
            //幻雪冰翼1阶  cd = 0.2s
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    this.ctrlValue[0] += 1;
                    if (this.ctrlValue[0] % 2 == 0) {
                        BulletSolutions.solution_109_1(entity, vec.add(cc.v3(40 * 0.7, 20)), 2000, 180 - 90, bulletIds[0], 1);
                        BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-40 * 0.7, 20)), 2000, 180 - 90, bulletIds[0], 1);
                    } else {
                        BulletSolutions.solution_109_1(entity, vec.add(cc.v3(60 * 0.7, 20)), 2000, 180 - 90, bulletIds[0], 1);
                        BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-60 * 0.7, 20)), 2000, 180 - 90, bulletIds[0], 1);
                    }
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.05, 4, 0);
            bullet.setTimer(2, 0.3, 1, 0);
        },
        solution_138: function (entity, bulletIds) {
            //幻雪冰翼2阶  cd = 0.2s
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.ctrlValue[1] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    this.ctrlValue[1] += 1;
                    BulletSolutions.solution_109_1(entity, vec, 2000 + this.ctrlValue[1] * 100, 180 - 90, bulletIds[0], 1);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    this.ctrlValue[0] += 1;
                    if (this.ctrlValue[0] % 2 == 0) {
                        BulletSolutions.solution_109_1(entity, vec.add(cc.v3(40 * 0.7, 20)), 2000, 180 - 90, bulletIds[0], 1);
                        BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-40 * 0.7, 20)), 2000, 180 - 90, bulletIds[0], 1);
                    } else {
                        BulletSolutions.solution_109_1(entity, vec.add(cc.v3(60 * 0.7, 20)), 2000, 180 - 90, bulletIds[0], 1);
                        BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-60 * 0.7, 20)), 2000, 180 - 90, bulletIds[0], 1);
                    }
                }
                if (idx == 3) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.04, 5, 0);
            bullet.setTimer(2, 0.05, 4, 0);
            bullet.setTimer(3, 0.3, 1, 0);
        },
        solution_139: function (entity, bulletIds) {
            //幻雪冰翼3阶  cd = 0.5s
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.ctrlValue[1] = 0;
            bullet.ctrlValue[2] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    this.ctrlValue[0] += 1;
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(60 * 0.7, 20)), 2000, 175 + 2 * this.ctrlValue[0] - 90, bulletIds[0], 1);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-60 * 0.7, 20)), 2000, 185 - 2 * this.ctrlValue[0] - 90, bulletIds[0], 1);
                    if (this.ctrlValue[0] > 4) {
                        this.setTimer(2, 0.05, 5, 0);
                    }
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    this.ctrlValue[1] += 1;
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(60 * 0.7, 20)), 2000, 185 - 2 * this.ctrlValue[1] - 90, bulletIds[0], 1);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-60 * 0.7, 20)), 2000, 175 + 2 * this.ctrlValue[1] - 90, bulletIds[0], 1);
                }
                if (idx == 3) {
                    let vec = entity.getPosition();
                    this.ctrlValue[2] += 1;
                    BulletSolutions.solution_109_1(entity, vec, 2300 + this.ctrlValue[2] * 100, 180 - 90, bulletIds[1], 1);
                    if (this.ctrlValue[2] > 4) {
                        this.ctrlValue[2] = 0;
                    }
                }
                if (idx == 4) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(70 * 0.7, 20)), 2000, 175 - 90, bulletIds[2], 1);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-70 * 0.7, 20)), 2000, 185 - 90, bulletIds[2], 1);
                }
                if (idx == 5) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.05, 5, 0);
            bullet.setTimer(3, 0.02, 25, 0);
            bullet.setTimer(4, 0.1, 5, 0);
            bullet.setTimer(5, 0.6, 1, 0);
        },
        solution_140: function (entity, bulletIds) {
            //幻雪冰翼4阶  cd = 1s
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.ctrlValue[2] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    this.ctrlValue[0] += 1;
                    BulletSolutions.solution_109_1(entity, vec, 2300 + this.ctrlValue[0] * 100, 180 - 90, bulletIds[0], 1);
                    if (this.ctrlValue[0] > 4) {
                        this.ctrlValue[0] = 0;
                    }
                }
                if (idx == 2) {
                    this.setTimer(3, 0.02, 50, 0);
                }
                if (idx == 3) {
                    let vec = entity.getPosition();
                    this.ctrlValue[1] += 1;
                    this.ctrlValue[2] += 1;
                    BulletSolutions.solution_140_2(entity, vec.add(cc.v3(40 * 0.7, -15)), 2000, 180 - 90, bulletIds[1], 1, this.ctrlValue[2]);
                    BulletSolutions.solution_140_1(entity, vec.add(cc.v3(-40 * 0.7, -15)), 2000, 180 - 90, bulletIds[1], 1, this.ctrlValue[2]);
                    if (this.ctrlValue[1] > 4) {
                        this.ctrlValue[1] = 0;
                    }
                    if (this.ctrlValue[2] > 9) {
                        this.ctrlValue[2] = 0;
                    }
                }
                if (idx == 4) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(70 * 0.7, -5)), 2000, 175 - 90, bulletIds[2], 1);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-70 * 0.7, -5)), 2000, 185 - 90, bulletIds[2], 1);
                }
                if (idx == 5) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.02, 50, 0);
            bullet.setTimer(2, 0.01, 1, 0);
            bullet.setTimer(4, 0.05, 20, 0);
            bullet.setTimer(5, 1.1, 1, 0);
        },
        solution_140_1: function (entity, pos, speed, angle, bulletId, sc, num) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.opacity = (204);
            bullet.setPosition(pos.add(cc.v3(0, 50)));
            bullet.setMovementType(0);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setSpeed(ai.speedTransfer(speed, 150 - 90), true);
                    this.setTimer(2, 0.04 + 0.004 * num, 1, 0);
                }
                if (idx == 2) {
                    this.setSpeed(ai.speedTransfer(speed, 210 - 90), true);
                    this.setTimer(1, 0.04 + 0.004 * num, 1, 0);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
        },
        solution_140_2: function (entity, pos, speed, angle, bulletId, sc, num) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.opacity = (204);
            bullet.setPosition(pos.add(cc.v3(0, 50)));
            bullet.setMovementType(0);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setSpeed(ai.speedTransfer(speed, 150 - 90), true);
                    this.setTimer(2, 0.04 + 0.004 * num, 1, 0);
                }
                if (idx == 2) {
                    this.setSpeed(ai.speedTransfer(speed, 210 - 90), true);
                    this.setTimer(1, 0.04 + 0.004 * num, 1, 0);
                }
            });
            bullet.setTimer(2, 0, 1, 0);
        },
        solution_141: function (entity, bulletIds) {
            //辉光彩翼1阶  cd = 0.2s
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(40 * 0.7, 50)), 1600, 180 - 90, bulletIds[0], 1);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-40 * 0.7, 50)), 1600, 180 - 90, bulletIds[0], 1);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(40 * 0.7, 50)), 1600, 175 - 90, bulletIds[1], 1);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-40 * 0.7, 50)), 1600, 185 - 90, bulletIds[1], 1);
                }
                if (idx == 3) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.05, 1, 0);
            bullet.setTimer(2, 0.15, 1, 0);
            bullet.setTimer(3, 0.2, 1, 0);
        },
        solution_142: function (entity, bulletIds) {
            //辉光彩翼2阶  cd = 1s
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                this.ctrlValue[0] += 1;
                if (idx == 1) {
                    let vec = entity.getPosition();
                    if (this.ctrlValue[0] < 4) {
                        BulletSolutions.solution_109_1(entity, vec.add(cc.v3(40 * 0.7 - 10 * this.ctrlValue[0], 50)), 2000, 180 - 90, bulletIds[0], 1);
                        BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-40 * 0.7 + 10 * this.ctrlValue[0], 50)), 2000, 180 - 90, bulletIds[0], 1);
                    } else {
                        BulletSolutions.solution_109_1(entity, vec.add(cc.v3(10 * 0.7 * (this.ctrlValue[0] - 5), 50)), 2000, 180 - 90, bulletIds[0], 1);
                        BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-10 * 0.7 * (this.ctrlValue[0] - 5), 50)), 2000, 180 - 90, bulletIds[0], 1);
                    }
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(40 * 0.7, 50)), 2000, 175 - 90, bulletIds[1], 1);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-40 * 0.7, 50)), 2000, 185 - 90, bulletIds[1], 1);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.1, 10, 0);
            bullet.setTimer(2, 1.1, 1, 0);
        },
        solution_143: function (entity, bulletIds) {
            //辉光彩翼3阶  cd = 1s
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                this.ctrlValue[0] += 1;
                if (idx == 1) {
                    let vec = entity.getPosition();
                    if (this.ctrlValue[0] < 4) {
                        BulletSolutions.solution_109_1(entity, vec.add(cc.v3(48 * 0.7 - 12 * this.ctrlValue[0], 50)), 2400, 180 - 90, bulletIds[0], 1);
                        BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-48 * 0.7 + 12 * this.ctrlValue[0], 50)), 2400, 180 - 90, bulletIds[0], 1);
                    } else {
                        BulletSolutions.solution_109_1(entity, vec.add(cc.v3(12 * 0.7 * (this.ctrlValue[0] - 5), 50)), 2400, 180 - 90, bulletIds[0], 1);
                        BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-12 * 0.7 * (this.ctrlValue[0] - 5), 50)), 2400, 180 - 90, bulletIds[0], 1);
                    }
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(40 * 0.7, 50)), 2400, 175 - 90, bulletIds[1], 1);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-40 * 0.7, 50)), 2400, 185 - 90, bulletIds[1], 1);
                    BulletSolutions.solution_143_1(entity, vec.add(cc.v3(0, 50 * 0.7)), 1000, 180 - 90, bulletIds[2], 1)
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.1, 10, 0);
            bullet.setTimer(2, 1.1, 1, 0);
        },
        solution_143_1: function (entity, pos, speed, angle, bulletId, sc) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.opacity = (204);
            bullet.setMovementType(0);
            bullet.setObjectSelfCircle(360);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setPosition(pos);
                    this.setSpeed(ai.speedTransfer(speed, angle), true);
                }
                if (idx == 2) {
                    let v = this.getPosition();
                    BulletSolutions.solution_109_1(entity, v, 1000, 180 - 90, 988, 1)
                    BulletSolutions.solution_109_1(entity, v, 1000, 170 - 90, 988, 1)
                    BulletSolutions.solution_109_1(entity, v, 1000, 190 - 90, 988, 1)
                }
                if (idx == 3) {
                    this.setSpeed(ai.speedTransfer(0, 180 - 90), true);
                    this.runOpacity(0, 0.4);
                    this.setTimer(5, 0.4, 1, 0);
                }
                if (idx == 4) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.6, 1, 0);
            bullet.setTimer(3, 0.6, 1, 0);
            bullet.setTimer(4, 1, 1, 0);
        },
        solution_144: function (entity, bulletIds) {
            //辉光彩翼4阶  cd = 1s
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                this.ctrlValue[0] += 1;
                if (idx == 1) {
                    let vec = entity.getPosition();
                    if (this.ctrlValue[0] < 4) {
                        BulletSolutions.solution_109_1(entity, vec.add(cc.v3(60 * 0.7 - 15 * this.ctrlValue[0], 50)), 2400, 180 - 90, bulletIds[0], 1);
                        BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-60 * 0.7 + 15 * this.ctrlValue[0], 50)), 2400, 180 - 90, bulletIds[0], 1);
                    } else {
                        BulletSolutions.solution_109_1(entity, vec.add(cc.v3(15 * 0.7 * (this.ctrlValue[0] - 5), 50)), 2400, 180 - 90, bulletIds[0], 1);
                        BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-15 * 0.7 * (this.ctrlValue[0] - 5), 50)), 2400, 180 - 90, bulletIds[0], 1);
                    }
                    BulletSolutions.solution_144_2(entity, vec.add(cc.v3(40 * 0.7, 50 * 0.7)), 2400, 175 - 90, bulletIds[1], 1);
                    BulletSolutions.solution_144_3(entity, vec.add(cc.v3(-40 * 0.7, 50 * 0.7)), 2400, 185 - 90, bulletIds[1], 1);
                    BulletSolutions.solution_144_1(entity, vec.add(cc.v3(0, 50 * 0.7)), 1000, 180 - 90, bulletIds[2], 1)
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.1, 10, 0);
            bullet.setTimer(2, 1.1, 1, 0);
        },
        solution_144_1: function (entity, pos, speed, angle, bulletId, sc) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.opacity = (204);
            bullet.setMovementType(0);
            bullet.setObjectSelfCircle(360);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setPosition(pos);
                    this.setSpeed(ai.speedTransfer(speed, angle), true);
                }
                if (idx == 2) {
                    let v = this.getPosition();
                    BulletSolutions.solution_109_1(entity, v, 1000, 180 - 90, 989, 1)
                    BulletSolutions.solution_109_1(entity, v, 1000, 173 - 90, 989, 1)
                    BulletSolutions.solution_109_1(entity, v, 1000, 187 - 90, 989, 1)
                    BulletSolutions.solution_109_1(entity, v, 1000, 165 - 90, 989, 1)
                    BulletSolutions.solution_109_1(entity, v, 1000, 195 - 90, 989, 1)
                }
                if (idx == 3) {
                    this.setSpeed(ai.speedTransfer(0, 180 - 90), true);
                    this.runOpacity(0, 0.4);
                    this.setTimer(5, 0.4, 1, 0);
                }
                if (idx == 4) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.6, 1, 0);
            bullet.setTimer(3, 0.6, 1, 0);
            bullet.setTimer(4, 1, 1, 0);
        },
        solution_144_2: function (entity, pos, speed, angle, bulletId, sc) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.opacity = (204);
            bullet.setMovementType(0);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setPosition(pos);
                    this.setSpeed(ai.speedTransfer(speed, angle), true);
                }
                if (idx == 2) {
                    let v = this.getPosition();
                    BulletSolutions.solution_109_1(entity, v, 2400, 170 - 90, 990, 1)
                    BulletSolutions.solution_109_1(entity, v, 2400, 165 - 90, 990, 1)
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.2, 1, 0);
        },
        solution_144_3: function (entity, pos, speed, angle, bulletId, sc) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.opacity = (204);
            bullet.setMovementType(0);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setPosition(pos);
                    this.setSpeed(ai.speedTransfer(speed, angle), true);
                }
                if (idx == 2) {
                    let v = this.getPosition();
                    BulletSolutions.solution_109_1(entity, v, 2400, 190 - 90, 990, 1)
                    BulletSolutions.solution_109_1(entity, v, 2400, 195 - 90, 990, 1)
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.2, 1, 0);
        },
        solution_145: function (entity, bulletIds) {
            //黑金战舰1阶  cd = 0.2s
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(0, 40)), 1400, 180 - 90, bulletIds[0]);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(55, -5)), 1400, 180 - 90, bulletIds[1]);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-55, -5)), 1400, 180 - 90, bulletIds[1]);
                }
                if (idx == 3) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.1, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
            bullet.setTimer(3, 0.2, 1, 0);
        },
        solution_146: function (entity, bulletIds) {
            //黑金战舰2阶  cd = 0.2s
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(0, 40)), 1800, 180 - 90, bulletIds[0]);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(0, 40)), 1800, 170 - 90, bulletIds[1]);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(0, 40)), 1800, 190 - 90, bulletIds[1]);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-55, -5)), 1800, 180 - 90, bulletIds[2]);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(55, -5)), 1800, 180 - 90, bulletIds[2]);
                }
                if (idx == 3) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.1, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
            bullet.setTimer(3, 0.2, 1, 0);
        },
        solution_147: function (entity, bulletIds) {
            //黑金战舰3阶  cd = 0.5s
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                this.ctrlValue[0] += 1;
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_147_1(entity, vec.add(cc.v3(0, 20)), 2200, 150 - 90, bulletIds[0]);
                    BulletSolutions.solution_147_2(entity, vec.add(cc.v3(0, 20)), 2200, 210 - 90, bulletIds[0]);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(0, 20)), 2200, 190 - 90, bulletIds[1]);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(0, 20)), 2200, 170 - 90, bulletIds[1]);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(0, 20)), 2200, 180 - 90, bulletIds[2]);
                    BulletSolutions.solution_147_3(entity, vec.add(cc.v3(0, 20)), 2200, 150 - 90, bulletIds[1], 1, this.ctrlValue[0]);
                    BulletSolutions.solution_147_4(entity, vec.add(cc.v3(0, 20)), 2200, 210 - 90, bulletIds[1], 1, this.ctrlValue[0]);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.1, 5, 0);
            bullet.setTimer(2, 0.6, 1, 0);
        },
        solution_147_1: function (entity, pos, speed, angle, bulletId, sc) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.opacity = (204);
            bullet.setPosition(pos.add(cc.v3(0, 50)));
            bullet.setBaseAngle(-30);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let posData = [this.getPosition(), this.getPosition().add(cc.v3(-200, 320)), this.getPosition().add(cc.v3(0, 640))];
                    this.setBezier(posData, speed, 0, 1);
                    this.setMovementType(2);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
        },
        solution_147_2: function (entity, pos, speed, angle, bulletId, sc) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.opacity = (204);
            bullet.setPosition(pos.add(cc.v3(0, 50)));
            bullet.setBaseAngle(30);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let posData = [this.getPosition(), this.getPosition().add(cc.v3(200, 320)), this.getPosition().add(cc.v3(0, 640))];
                    this.setBezier(posData, speed, 0, 1);
                    this.setMovementType(2);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
        },
        solution_147_3: function (entity, pos, speed, angle, bulletId, sc, num) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.opacity = (204);
            bullet.setPosition(pos.add(cc.v3(0, 50)));
            bullet.setBaseAngle(-30);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let posData = [this.getPosition(), this.getPosition().add(cc.v3(-200, 320)), this.getPosition().add(cc.v3(-30 * num, 640 + 60 * num))];
                    this.setBezier(posData, speed, 0, 1);
                    this.setMovementType(2);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
        },
        solution_147_4: function (entity, pos, speed, angle, bulletId, sc, num) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.opacity = (204);
            bullet.setPosition(pos.add(cc.v3(0, 50)));
            bullet.setBaseAngle(30);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let posData = [this.getPosition(), this.getPosition().add(cc.v3(200, 320)), this.getPosition().add(cc.v3(30 * num, 640 + 60 * num))];
                    this.setBezier(posData, speed, 0, 1);
                    this.setMovementType(2);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
        },
        solution_148: function (entity, bulletIds) {
            //黑金战舰4阶  cd = 1s
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                this.ctrlValue[0] += 1;
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_148_1(entity, vec.add(cc.v3(0, 20)), 2200, 170 - 90, bulletIds[0], 1, this.ctrlValue[0]);
                    BulletSolutions.solution_148_2(entity, vec.add(cc.v3(0, 20)), 2200, 190 - 90, bulletIds[0], 1, this.ctrlValue[0]);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(0, 20)), 2200, 190 - 90, bulletIds[1]);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(0, 20)), 2200, 170 - 90, bulletIds[1]);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(0, 20)), 2200, 180 - 90, bulletIds[2]);
                    BulletSolutions.solution_148_3(entity, vec.add(cc.v3(0, 20)), 2200, 170 - 90, bulletIds[1], 1, this.ctrlValue[0]);
                    BulletSolutions.solution_148_4(entity, vec.add(cc.v3(0, 20)), 2200, 190 - 90, bulletIds[1], 1, this.ctrlValue[0]);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.05, 20, 0);
            bullet.setTimer(2, 1.1, 1, 0);
        },
        solution_148_1: function (entity, pos, speed, angle, bulletId, sc, num) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.opacity = (204);
            bullet.setPosition(pos.add(cc.v3(0, 50)));
            bullet.setBaseAngle(30);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let v = this.getPosition().add(cc.v3(-20 * num, 640));
                    if (num > 9) {
                        v = this.getPosition().add(cc.v3(-200 + (num - 9) * 20, 640));
                    }
                    let posData = [this.getPosition(), this.getPosition().add(cc.v3(-200, 320)), v];
                    this.setBezier(posData, speed, 0, 1);
                    this.setMovementType(2);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
        },
        solution_148_2: function (entity, pos, speed, angle, bulletId, sc, num) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.opacity = (204);
            bullet.setPosition(pos.add(cc.v3(0, 50)));
            bullet.setBaseAngle(-30);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let v = this.getPosition().add(cc.v3(20 * num, 640));
                    if (num > 9) {
                        v = this.getPosition().add(cc.v3(200 - (num - 9) * 20, 640));
                    }
                    let posData = [this.getPosition(), this.getPosition().add(cc.v3(200, 320)), v];
                    this.setBezier(posData, speed, 0, 1);
                    this.setMovementType(2);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
        },
        solution_148_3: function (entity, pos, speed, angle, bulletId, sc, num) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.opacity = (204);
            bullet.setPosition(pos.add(cc.v3(0, 50)));
            bullet.setBaseAngle(-30);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let v = this.getPosition().add(cc.v3(0, 48 * num + 320));
                    if (num > 9) {
                        v = this.getPosition().add(cc.v3(0, 700 - 32 * (num - 9)));
                    }
                    let posData = [this.getPosition(), this.getPosition().add(cc.v3(-200, 320)), v];
                    this.setBezier(posData, speed, 0, 1);
                    this.setMovementType(2);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
        },
        solution_148_4: function (entity, pos, speed, angle, bulletId, sc, num) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.opacity = (204);
            bullet.setPosition(pos.add(cc.v3(0, 50)));
            bullet.setBaseAngle(30);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let v = this.getPosition().add(cc.v3(0, 48 * num + 320));
                    if (num > 9) {
                        v = this.getPosition().add(cc.v3(0, 700 - 32 * (num - 9)));
                    }
                    let posData = [this.getPosition(), this.getPosition().add(cc.v3(200, 320)), v];
                    this.setBezier(posData, speed, 0, 1);
                    this.setMovementType(2);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
        },
        solution_149: function (entity, bulletIds) {
            //青羽1阶  cd = 0.2s
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.ctrlValue[1] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.ctrlValue[0] += 1;
                    let vec = entity.getPosition();
                    let vec_1 = vec.add(cc.v3(50, 50));
                    BulletSolutions.solution_149_1(entity, vec_1, -45 * (this.ctrlValue[0] - 1) - 90, 1200, 180 - 90, bulletIds[0], 1);
                }
                if (idx == 2) {
                    this.setTimer(3, 0.025, 4, 0);
                }
                if (idx == 3) {
                    this.ctrlValue[1] += 1;
                    let vec = entity.getPosition();
                    let vec_2 = vec.add(cc.v3(-50, 50));
                    BulletSolutions.solution_149_2(entity, vec_2, 45 * (this.ctrlValue[1] - 1) - 90, 1200, 180 - 90, bulletIds[0], 1);
                }
                if (idx == 4) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.025, 4, 0);
            bullet.setTimer(2, 0.1, 1, 0);
            bullet.setTimer(4, 0.3, 1, 0);
        },
        solution_149_1: function (entity, pos, v, speed, angle, bulletId, sc) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.opacity = (204);
            bullet.setPosition(pos.add(cc.v3(0, 50)));
            bullet.setObjectAutoCircle(50, v, 0, 0, 360, 0, 1);
            bullet.setSpeed(ai.speedTransfer(speed, angle));
        },
        solution_149_2: function (entity, pos, v, speed, angle, bulletId, sc) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.opacity = (204);
            bullet.setPosition(pos.add(cc.v3(0, 50)));
            bullet.setObjectAutoCircle(50, v, 0, 0, -360, 0, 1);
            bullet.setSpeed(ai.speedTransfer(speed, angle));
        },
        solution_150: function (entity, bulletIds) {
            //青羽2阶  cd = 0.2s
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.ctrlValue[1] = 0;
            bullet.setTimerHandler(function (idx) {
                this.ctrlValue[0] += 1;
                this.ctrlValue[1] += 1;
                if (idx == 1) {
                    let vec = entity.getPosition();
                    let vec_1 = vec.add(cc.v3(50, 50));
                    let vec_2 = vec.add(cc.v3(-50, 50));
                    BulletSolutions.solution_150_1(entity, vec_1, -45 * this.ctrlValue[0] - 90, 1400, 180 - 90, bulletIds[0], 1);
                    BulletSolutions.solution_150_2(entity, vec_2, 45 * this.ctrlValue[1] - 90, 1400, 180 - 90, bulletIds[0], 1);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.025, 8, 0);
            bullet.setTimer(2, 0.3, 1, 0);
        },
        solution_150_1: function (entity, pos, v, speed, angle, bulletId, sc) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.opacity = (204);
            bullet.setPosition(pos.add(cc.v3(0, 25)));
            bullet.setObjectAutoCircle(50, v, 0, 0, -360, 0, 0);
            bullet.setSpeed(ai.speedTransfer(speed, angle), true);
        },
        solution_150_2: function (entity, pos, v, speed, angle, bulletId, sc) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.opacity = (204);
            bullet.setPosition(pos.add(cc.v3(0, 25)));
            bullet.setObjectAutoCircle(50, v, 0, 0, 360, 0, 0);
            bullet.setSpeed(ai.speedTransfer(speed, angle), true);
        },
        solution_151: function (entity, bulletIds) {
            //青羽3阶  cd = 0.5s
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.ctrlValue[1] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.ctrlValue[0] += 1;
                    this.ctrlValue[1] += 1;
                    let vec = entity.getPosition();
                    let vec_1 = vec.add(cc.v3(50, 50));
                    let vec_2 = vec.add(cc.v3(-50, 50));
                    BulletSolutions.solution_151_1(entity, vec_1, -45 * (this.ctrlValue[0] - 1) - 90, 1400, 180 - 90, bulletIds[0], 1);
                    BulletSolutions.solution_151_2(entity, vec_2, 45 * (this.ctrlValue[1] - 1) - 90, 1400, 180 - 90, bulletIds[0], 1);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec, 1600, 180 - 90, bulletIds[1], 0.8);
                }
                if (idx == 3) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_151_3(entity, vec, 1200, 145 - 90, bulletIds[2], 1);
                    BulletSolutions.solution_151_3(entity, vec.add(cc.v3(0, -40)), 1200, 145 - 90, bulletIds[1], 0.8);
                    BulletSolutions.solution_151_3(entity, vec.add(cc.v3(0, -80)), 1200, 145 - 90, bulletIds[1], 0.8);
                    BulletSolutions.solution_151_3(entity, vec, 1200, 215 - 90, bulletIds[2], 1);
                    BulletSolutions.solution_151_3(entity, vec.add(cc.v3(0, -40)), 1200, 215 - 90, bulletIds[1], 0.8);
                    BulletSolutions.solution_151_3(entity, vec.add(cc.v3(0, -80)), 1200, 215 - 90, bulletIds[1], 0.8);
                }
                if (idx == 4) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.031, 16, 0);
            bullet.setTimer(2, 0.1, 5, 0);
            bullet.setTimer(3, 0.25, 1, 0);
            bullet.setTimer(4, 0.6, 1, 0);
        },
        solution_151_1: function (entity, pos, v, speed, angle, bulletId, sc) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.opacity = (204);
            bullet.setPosition(pos.add(cc.v3(0, 25)));
            bullet.setObjectAutoCircle(50, v, 0, 0, -360, 0, 0);
            bullet.setSpeed(ai.speedTransfer(speed, angle), true);
        },
        solution_151_2: function (entity, pos, v, speed, angle, bulletId, sc, ct) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.opacity = (204);
            bullet.setPosition(pos.add(cc.v3(0, 25)));
            bullet.setObjectAutoCircle(50, v, 0, 0, 360, 0, 0);
            bullet.setSpeed(ai.speedTransfer(speed, angle), true);
        },
        solution_151_3: function (entity, pos, speed, angle, bulletId, sc) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.opacity = (204);
            bullet.setPosition(pos.add(cc.v3(0, 60)));
            bullet.setSpeed(ai.speedTransfer(speed, angle), true);
            bullet.setMovementType(0);
            bullet.setEdgeCollision(1);
        },
        solution_152: function (entity, bulletIds) {
            //青羽4阶  cd = 1s
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.ctrlValue[1] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.ctrlValue[0] += 1;
                    this.ctrlValue[1] += 1;
                    let vec = entity.getPosition();
                    let vec_1 = vec.add(cc.v3(50, 50));
                    let vec_2 = vec.add(cc.v3(-50, 50));
                    BulletSolutions.solution_152_1(entity, vec_1, -45 * this.ctrlValue[0] - 90, 2000, 180 - 90, bulletIds[0], 1.4);
                    BulletSolutions.solution_152_2(entity, vec_2, 45 * this.ctrlValue[1] - 90, 2000, 180 - 90, bulletIds[0], 1.4);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec, 2000, 180 - 90, bulletIds[1], 0.8);
                    BulletSolutions.solution_109_1(entity, vec, 2000, 175 - 90, bulletIds[1], 0.8);
                    BulletSolutions.solution_109_1(entity, vec, 2000, 185 - 90, bulletIds[1], 0.8);
                    BulletSolutions.solution_152_4(entity, vec.add(cc.v3(-250 + Math.random() * 500, -90 - Math.random() * 20)), Math.random() * 1000 + 1000, 180 - 90, bulletIds[1], 0.8);
                }
                if (idx == 3) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_152_3(entity, vec, 2000, 145 - 90, bulletIds[2], 1);
                    BulletSolutions.solution_152_3(entity, vec.add(cc.v3(0, -40)), 2000, 145 - 90, bulletIds[1], 0.8);
                    BulletSolutions.solution_152_3(entity, vec.add(cc.v3(0, -80)), 2000, 145 - 90, bulletIds[1], 0.8);
                    BulletSolutions.solution_152_3(entity, vec, 2000, 215 - 90, bulletIds[2], 1);
                    BulletSolutions.solution_152_3(entity, vec.add(cc.v3(0, -40)), 2000, 215 - 90, bulletIds[1], 0.8);
                    BulletSolutions.solution_152_3(entity, vec.add(cc.v3(0, -80)), 2000, 215 - 90, bulletIds[1], 0.8);
                }
                if (idx == 4) {
                    this.setTimer(3, 0.5, 1, 0);
                }
                if (idx == 5) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.025, 40, 0);
            bullet.setTimer(2, 0.1, 10, 0);
            bullet.setTimer(3, 0.25, 1, 0);
            bullet.setTimer(4, 0.25, 1, 0);
            bullet.setTimer(5, 1.1, 1, 0);
        },
        solution_152_1: function (entity, pos, v, speed, angle, bulletId, sc) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.opacity = (204);
            bullet.setPosition(pos.add(cc.v3(0, 25)));
            bullet.setObjectAutoCircle(50, v, 0, 0, -720, 0, 0);
            bullet.setSpeed(ai.speedTransfer(speed, angle), true);
        },
        solution_152_2: function (entity, pos, v, speed, angle, bulletId, sc) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.opacity = (204);
            bullet.setPosition(pos.add(cc.v3(0, 25)));
            bullet.setObjectAutoCircle(50, v, 0, 0, 720, 0, 0);
            bullet.setSpeed(ai.speedTransfer(speed, angle), true);
        },
        solution_152_3: function (entity, pos, speed, angle, bulletId, sc) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.opacity = (204);
            bullet.setPosition(pos.add(cc.v3(0, 60)));
            bullet.setSpeed(ai.speedTransfer(speed, angle), true);
            bullet.setMovementType(0);
            bullet.setEdgeCollision(1);
        },
        solution_152_4: function (entity, pos, speed, angle, bulletId, sc) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(pos);
            bullet.setMovementType(0);
            let n = Math.random() * 0.5;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.opacity = (0);
                    this.setSpeed(ai.speedTransfer(10, 180 - 90), true);
                    this.runOpacity(204, n)
                }
                if (idx == 2) {
                    this.setSpeed(ai.speedTransfer(speed, angle), true);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, n, 1, 0);
        },
        solution_153: function (entity, bulletIds) {
            //涤罪之焰1阶  cd = 0.2s
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(40 * 0.7, 0)), 1600, 180 - 90, bulletIds[0], 1);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-40 * 0.7, 0)), 1600, 180 - 90, bulletIds[0], 1);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(40 * 0.7, 0)), 1600, 175 - 90, bulletIds[0], 1);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-40 * 0.7, 0)), 1600, 185 - 90, bulletIds[0], 1);
                }
                if (idx == 3) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec, 2000, 180 - 90, bulletIds[1], 1);
                }
                if (idx == 4) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.05, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
            bullet.setTimer(3, 0.01, 1, 0);
            bullet.setTimer(4, 0.2, 1, 0);
        },
        solution_154: function (entity, bulletIds) {
            //涤罪之焰2阶  cd = 0.2s
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(40 * 0.7, 0)), 1800, 180 - 90, bulletIds[0], 1);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-40 * 0.7, 0)), 1800, 180 - 90, bulletIds[0], 1);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(40 * 0.7, 0)), 1800, 175 - 90, bulletIds[1], 1);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-40 * 0.7, 0)), 1800, 175 - 90, bulletIds[1], 1);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-40 * 0.7, 0)), 1800, 185 - 90, bulletIds[1], 1);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(40 * 0.7, 0)), 1800, 185 - 90, bulletIds[1], 1);
                }
                if (idx == 3) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec, 2000, 180 - 90, bulletIds[0], 1);
                }
                if (idx == 4) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.05, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
            bullet.setTimer(3, 0.01, 1, 0);
            bullet.setTimer(4, 0.2, 1, 0);
        },
        solution_155: function (entity, bulletIds) {
            //涤罪之焰3阶  cd = 0.5s
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-40 * 0.7, 0)), 2200, 175 - 90, bulletIds[0], 1);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(40 * 0.7, 0)), 2200, 185 - 90, bulletIds[0], 1);
                }
                if (idx == 2) {
                    this.setTimer(1, 0.1, 4, 0);
                }
                if (idx == 3) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(40 * 0.7, 0)), 2000, 170 - 90, bulletIds[1], 1);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(40 * 0.7, 0)), 2000, 180 - 90, bulletIds[1], 1);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-40 * 0.7, 0)), 2000, 190 - 90, bulletIds[1], 1);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-40 * 0.7, 0)), 2000, 180 - 90, bulletIds[1], 1);
                }
                if (idx == 4) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec, 2000, 185 - this.ctrlValue[0] - 90, bulletIds[1], 1);
                    BulletSolutions.solution_109_1(entity, vec, 2000, 175 + this.ctrlValue[0] - 90, bulletIds[1], 1);
                    BulletSolutions.solution_109_1(entity, vec, 2000, 190 - this.ctrlValue[0] * 2 - 90, bulletIds[1], 1);
                    BulletSolutions.solution_109_1(entity, vec, 2000, 170 + this.ctrlValue[0] * 2 - 90, bulletIds[1], 1);
                    BulletSolutions.solution_109_1(entity, vec, 2200, 180 - 90, bulletIds[0], 1);
                    this.ctrlValue[0] += 1;
                }
                if (idx == 5) {
                    ai.releaseEntity(this);
                }
            });
            //
            bullet.setTimer(1, 0.05, 1, 0);
            bullet.setTimer(2, 0.05, 1, 0);
            bullet.setTimer(3, 0.1, 5, 0);
            bullet.setTimer(4, 0.05, 10, 0);
            bullet.setTimer(5, 0.6, 1, 0);
        },
        solution_156: function (entity, bulletIds) {
            //涤罪之焰4阶  cd = 1s
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.ctrlValue[1] = 0;
            bullet.ctrlValue[2] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(40 * 0.7, 0)), 2400, 170 - this.ctrlValue[0] - 90, bulletIds[0], 1);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(40 * 0.7, 0)), 2400, 180 - this.ctrlValue[0] - 90, bulletIds[0], 1);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-40 * 0.7, 0)), 2400, 190 + this.ctrlValue[0] - 90, bulletIds[0], 1);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-40 * 0.7, 0)), 2400, 180 + this.ctrlValue[0] - 90, bulletIds[0], 1);
                    this.ctrlValue[0] += 1;
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    if (this.ctrlValue[1] < 10) {
                        BulletSolutions.solution_109_1(entity, vec, 2400, 185 - this.ctrlValue[1] - 90, bulletIds[0], 1);
                        BulletSolutions.solution_109_1(entity, vec, 2400, 175 + this.ctrlValue[1] - 90, bulletIds[0], 1);
                        BulletSolutions.solution_109_1(entity, vec, 2400, 190 - this.ctrlValue[1] * 2 - 90, bulletIds[0], 1);
                        BulletSolutions.solution_109_1(entity, vec, 2400, 170 + this.ctrlValue[1] * 2 - 90, bulletIds[0], 1);
                        BulletSolutions.solution_109_1(entity, vec, 2600, 180 - 90, bulletIds[1], 1);
                    } else {
                        let n = 20 - this.ctrlValue[1];
                        BulletSolutions.solution_109_1(entity, vec, 2400, 185 - n - 90, bulletIds[0], 1);
                        BulletSolutions.solution_109_1(entity, vec, 2400, 175 + n - 90, bulletIds[0], 1);
                        BulletSolutions.solution_109_1(entity, vec, 2400, 190 - n * 2 - 90, bulletIds[0], 1);
                        BulletSolutions.solution_109_1(entity, vec, 2400, 170 + n * 2 - 90, bulletIds[0], 1);
                        BulletSolutions.solution_109_1(entity, vec, 2600, 180 - 90, bulletIds[1], 1);
                    }
                    this.ctrlValue[1] += 1;
                }
                if (idx == 3) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(40 * 0.7, 0)), 2200, 175 - this.ctrlValue[2] - 90, bulletIds[1], 1);
                    BulletSolutions.solution_109_1(entity, vec.add(cc.v3(-40 * 0.7, 0)), 2200, 185 + this.ctrlValue[2] - 90, bulletIds[1], 1);
                    this.ctrlValue[2] += 1;
                }
                if (idx == 4) {
                    this.setTimer(3, 0.1, 9, 0);
                }
                if (idx == 5) {
                    let vec = entity.getPosition();
                    let vec_1 = vec.add(cc.v3(0, 50));
                    for (let n = 0; n < 12; ++n) {
                        BulletSolutions.solution_156_1(entity, vec_1, vec_1.add(ai.speedTransfer(200, n * 30)), 10, n * 30, bulletIds[2], 1);
                    }
                }
                if (idx == 6) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.1, 10, 0);
            bullet.setTimer(2, 0.05, 20, 0);
            bullet.setTimer(3, 0.05, 1, 0);
            bullet.setTimer(4, 0.05, 1, 0);
            bullet.setTimer(5, 0, 1, 0);
            bullet.setTimer(6, 1.1, 1, 0);
        },
        solution_156_1: function (entity, ct, pos, speed, angle, bulletId, sc) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setEntityAutoCircle(ct, pos.sub(ct), 180, 0, 0, 0, 0, true, entity);
            bullet.setMovementType(1);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.runOpacity(0, 0.5);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.5, 1, 0);
            bullet.setTimer(2, 1, 1, 0);
        },
        //挂载方案 157 -    
        solution_157: function (entity, bulletIds, cd) {
            //30261
            //刀锋利刃I +0 +1 L&R
            //刀锋利刃II +0 +1 L&R
            //刀锋利刃III +0 +1 L&R
            //刀锋利刃IV +0 +1 L&R
            //刀锋利刃V +0 +1 L&R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1500, 180 - 90, vec, bulletIds[0],6);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.1, 1, 0);
            bullet.setTimer(2, 0.2, 1, 0);
        },
        solution_158: function (entity, bulletIds, cd) {
            //30270
            //刀锋利刃I +0 +1 暴走L&R
            //刀锋利刃II +0 +1 暴走L&R
            //刀锋利刃III +0 +1 暴走L&R
            //刀锋利刃IV +0 +1 暴走L&R
            //刀锋利刃V +0 +1 暴走L&R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_158_1(entity, 1800, 180 - 90, vec, bulletIds[0], 1, 6);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.1, 1, 0);
            bullet.setTimer(2, 0.2, 1, 0);
        },
        solution_158_1: function (entity, speed, angle, pos, bulletId, sc, om) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(pos);
            bullet.setMovementType(0);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setSpeed(ai.speedTransfer(1, angle), true);
                    this.setObjectSelfCircle(-10);
                }
                if (idx == 2) {
                    this.setSpeed(ai.speedTransfer(speed, angle), true);
                    this.setObjectSelfCircle(om);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
        },
        solution_159: function (entity, bulletIds, cd) {
            //30265
            //刀锋利刃I +2 +3 L&R
            //刀锋利刃II +2 +3 L&R
            //刀锋利刃III +2 +3 L&R
            //刀锋利刃IV +2 +3 L&R
            //刀锋利刃V +2 +3 L&R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1500, 177 - 90, vec.add(cc.v3(-20, 0)), bulletIds[0], 6);
                    BulletSolutions.solution_7(entity, 1500, 183 - 90, vec.add(cc.v3(20, 0)), bulletIds[0], -6);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.1, 1, 0);
            bullet.setTimer(2, 0.2, 1, 0);
        },
        solution_160: function (entity, bulletIds, cd) {
            //30272
            //刀锋利刃I +2 +3 暴走L&R
            //刀锋利刃II +2 +3 暴走L&R
            //刀锋利刃III +2 +3 暴走L&R
            //刀锋利刃IV +2 +3 暴走L&R
            //刀锋利刃V +2 +3 暴走L&R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_160_1(entity, 1800, 180 - 90, vec, bulletIds[0], bulletIds[1], 6);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.1, 1, 0);
            bullet.setTimer(2, 0.4, 1, 0);
        },
        solution_160_1: function (entity, speed, angle, pos, bulletId_0, bulletId_1, om) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId_0, entity);
            bullet.setPosition(pos);
            bullet.setMovementType(0);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setSpeed(ai.speedTransfer(1, angle), true);
                    this.setObjectSelfCircle(-10);
                }
                if (idx == 2) {
                    this.setSpeed(ai.speedTransfer(speed, angle), true);
                    this.setObjectSelfCircle(om);
                }
                if (idx == 3) {
                    let pos_1 = this.getPosition();
                    BulletSolutions.solution_7(entity, speed, 170 - 90, pos_1, bulletId_1, om);
                    BulletSolutions.solution_7(entity, speed, 190 - 90, pos_1, bulletId_1, om);
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
            bullet.setTimer(3, 0.2, 1, 0);
        },
        solution_161: function (entity, bulletIds, cd) {
            //30266 = 30267
            //刀锋利刃I +4 L&R
            //刀锋利刃II +4 +5 +6 L&R
            //刀锋利刃III +4 +5 +6 +7 L&R
            //刀锋利刃IV +4 +5 +6 +7 L&R
            //刀锋利刃V +4 +5 +6 +7 L&R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1500, 177 - 90, vec.add(cc.v3(-20, 0)), bulletIds[0], 6);
                    BulletSolutions.solution_7(entity, 1500, 183 - 90, vec.add(cc.v3(20, 0)), bulletIds[0], -6);
                    BulletSolutions.solution_7(entity, 1500, 180 - 90, vec, bulletIds[0], 1);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.1, 1, 0);
            bullet.setTimer(2, 0.2, 1, 0);
        },
        solution_162: function (entity, bulletIds, cd) {
            //30274
            //刀锋利刃I +4
            //刀锋利刃II +4 +5 暴走L&R
            //刀锋利刃III +4 +5 暴走L&R
            //刀锋利刃IV +4 +5 暴走L&R
            //刀锋利刃V +4 +5 暴走L&R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_162_1(entity, 1800, 180 - 90, vec, bulletIds[0], bulletIds[1], 6);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.1, 1, 0);
            bullet.setTimer(2, 0.4, 1, 0);
        },
        solution_162_1: function (entity, speed, angle, pos, bulletId_1, bulletId_2, om) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId_1, entity);
            bullet.setPosition(pos);
            bullet.setMovementType(0);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setSpeed(ai.speedTransfer(1, angle), true);
                    this.setObjectSelfCircle(-10);
                }
                if (idx == 2) {
                    this.setSpeed(ai.speedTransfer(speed, angle), true);
                    this.setObjectSelfCircle(om);
                }
                if (idx == 3) {
                    let pos_1 = this.getPosition();
                    BulletSolutions.solution_7(entity, speed, 160 - 90, pos_1, bulletId_2,  om);
                    BulletSolutions.solution_7(entity, speed, 180 - 90, pos_1, bulletId_2,  om);
                    BulletSolutions.solution_7(entity, speed, 200 - 90, pos_1, bulletId_2,  om);
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
            bullet.setTimer(3, 0.2, 1, 0);
        },
        solution_163: function (entity, bulletIds, cd) {
            //30276
            //刀锋利刃II +6 暴走L&R
            //刀锋利刃III +6 +7 暴走L&R
            //刀锋利刃IV +6 +7 暴走L&R
            //刀锋利刃V +6 +7 暴走L&R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_163_1(entity, 1800, 170 - 90, vec, bulletIds[0], bulletIds[1], 6);
                    BulletSolutions.solution_163_1(entity, 1800, 190 - 90, vec, bulletIds[0], bulletIds[1], 6);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.1, 1, 0);
            bullet.setTimer(2, 0.4, 1, 0);
        },
        solution_163_1: function (entity, speed, angle, pos, bulletId_1, bulletId_2,  om) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId_1, entity);
            bullet.setPosition(pos);
            bullet.setMovementType(0);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setSpeed(ai.speedTransfer(1, angle), true);
                    this.setObjectSelfCircle(-10);
                }
                if (idx == 2) {
                    this.setSpeed(ai.speedTransfer(speed, angle), true);
                    this.setObjectSelfCircle(om);
                }
                if (idx == 3) {
                    let pos_1 = this.getPosition();
                    BulletSolutions.solution_7(entity, speed, 170 - 90, pos_1, bulletId_2,  om);
                    BulletSolutions.solution_7(entity, speed, 190 - 90, pos_1, bulletId_2,  om);
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
            bullet.setTimer(3, 0.2, 1, 0);
        },
        solution_164: function (entity, bulletIds, cd) {
            //30268
            //刀锋利刃III +8 L&R
            //刀锋利刃IV +8 +9 L&R
            //刀锋利刃V +8 +9 L&R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1500, 177 - 90, vec.add(cc.v3(-20, 0)), bulletIds[0], 6);
                    BulletSolutions.solution_7(entity, 1500, 183 - 90, vec.add(cc.v3(20, 0)), bulletIds[0], -6);
                    BulletSolutions.solution_7(entity, 1500, 174 - 90, vec.add(cc.v3(-20, 0)), bulletIds[0], 6);
                    BulletSolutions.solution_7(entity, 1500, 186 - 90, vec.add(cc.v3(20, 0)), bulletIds[0], -6);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.1, 1, 0);
            bullet.setTimer(2, 0.2, 1, 0);
        },
        solution_165: function (entity, bulletIds, cd) {
            //30278
            //刀锋利刃III +8 暴走L&R
            //刀锋利刃IV +8 +9 暴走L&R
            //刀锋利刃V +8 +9 暴走L&R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_165_1(entity, 1800, 160 - 90, vec, bulletIds[0], bulletIds[1], 1, 6);
                    BulletSolutions.solution_165_1(entity, 1800, 200 - 90, vec, bulletIds[0], bulletIds[1], 1, 6);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.1, 1, 0);
            bullet.setTimer(2, 0.4, 1, 0);
        },
        solution_165_1: function (entity, speed, angle, pos, bulletId_1, bulletId_2, sc, om) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId_1, entity);
            bullet.setPosition(pos);
            bullet.setMovementType(0);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setSpeed(ai.speedTransfer(1, angle), true);
                    this.setObjectSelfCircle(-10);
                }
                if (idx == 2) {
                    this.setSpeed(ai.speedTransfer(speed, angle), true);
                    this.setObjectSelfCircle(om);
                }
                if (idx == 3) {
                    let pos_1 = this.getPosition();
                    BulletSolutions.solution_165_2(entity, speed, 170 - 90, pos_1, bulletId_2, sc, om);
                    BulletSolutions.solution_165_2(entity, speed, 190 - 90, pos_1, bulletId_2, sc, om);
                    BulletSolutions.solution_165_2(entity, speed, 180 - 90, pos_1, bulletId_2, sc, om);
                    this.runScale(1.8, 0.3);
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
            bullet.setTimer(3, 0.2, 1, 0);
        },
        solution_165_2: function (entity, speed, angle, v, bulletId, sc, om) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            let vec = ai.speedTransfer(speed, angle);
            bullet.setSpeed(vec, true);
            if (typeof om !== 'undefined') {
                bullet.setObjectSelfCircle(om);
            }
            bullet.runScale(1.8, 0.3);
        },
        solution_166: function (entity, bulletIds, cd) {
            //30269
            //刀锋利刃IV +10 L&R
            //刀锋利刃V +10 +11 +12 L&R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1500, 177 - 90, vec.add(cc.v3(-20, 0)), bulletIds[0], 6);
                    BulletSolutions.solution_7(entity, 1500, 183 - 90, vec.add(cc.v3(20, 0)), bulletIds[0], -6);
                    BulletSolutions.solution_7(entity, 1500, 174 - 90, vec.add(cc.v3(-20, 0)), bulletIds[0], 6);
                    BulletSolutions.solution_7(entity, 1500, 186 - 90, vec.add(cc.v3(20, 0)), bulletIds[0], -6);
                    BulletSolutions.solution_7(entity, 1500, 180 - 90, vec, bulletIds[0], -6);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.1, 1, 0);
            bullet.setTimer(2, 0.2, 1, 0);
        },
        solution_167: function (entity, bulletIds, cd) {
            //30281
            //刀锋利刃V +10 +11 +12 暴走L&R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_167_1(entity, 1800, 170 - 90, vec, bulletIds[0], bulletIds[1], 1, 6);
                    BulletSolutions.solution_167_1(entity, 1800, 190 - 90, vec, bulletIds[0], bulletIds[1], 1, 6);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.1, 1, 0);
            bullet.setTimer(2, 0.4, 1, 0);
        },
        solution_167_1: function (entity, speed, angle, pos, bulletId_1, bulletId_2, sc, om) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId_1, entity);
            bullet.setPosition(pos);
            bullet.setMovementType(0);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setSpeed(ai.speedTransfer(1, angle), true);
                    this.setObjectSelfCircle(-10);
                }
                if (idx == 2) {
                    this.setSpeed(ai.speedTransfer(speed, angle), true);
                    this.setObjectSelfCircle(om);
                }
                if (idx == 3) {
                    let pos_1 = this.getPosition();
                    BulletSolutions.solution_167_2(entity, speed, 170 - 90, pos_1, bulletId_2, sc, om);
                    BulletSolutions.solution_167_2(entity, speed, 190 - 90, pos_1, bulletId_2, sc, om);
                    BulletSolutions.solution_167_2(entity, speed, 180 - 90, pos_1, bulletId_2, sc, om);
                    this.runScale(1.8, 0.3);
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
            bullet.setTimer(3, 0.16, 1, 0);
        },
        solution_167_2: function (entity, speed, angle, v, bulletId, sc, om) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            let vec = ai.speedTransfer(speed, angle);
            bullet.setSpeed(vec, true);
            if (typeof om !== 'undefined') {
                bullet.setObjectSelfCircle(om);
            }
            bullet.runScale(1.8, 0.3);
        },
        solution_168: function (entity, bulletIds, cd) {
            //30309
            //黑夜行者I +0 +1 L
            //黑夜行者II +0 +1 L
            //黑夜行者III +0 +1 L
            //黑夜行者IV +0 +1 L
            //黑夜行者V +0 +1 L
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1500, 175 - 90 + 10), vec, bulletIds[0], 1, 0, 15, 0, 0, 0, 630, 0);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.05, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
        },
        solution_168_1: function (entity, speed, v, bulletId, sc, om, r, angle, rspeed, rspeedacc, omega, omegaacc) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            if (typeof om !== 'undefined') {
                bullet.setObjectSelfCircle(om);
            }
            bullet.setPosition(v);
            bullet.setSpeed(speed);
            bullet.setObjectAutoCircle(r, angle, rspeed, rspeedacc, omega, omegaacc);
        },
        solution_169: function (entity, bulletIds, cd) {
            //30323
            //黑夜行者I +0 +1 暴走L
            //黑夜行者II +0 +1 暴走L
            //黑夜行者III +0 +1 暴走L
            //黑夜行者IV +0 +1 暴走L
            //黑夜行者V +0 +1 暴走L
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1200, 180 - 90, vec, bulletIds[0]);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1800, 175 - 90 + 10), vec, bulletIds[0], 1, 0, 30, 0, 0, 0, 810, 0);
                }
                if (idx == 3) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.02, 1, 0);
            bullet.setTimer(2, 0.07, 1, 0);
            bullet.setTimer(3, 0.1, 1, 0);
        },
        solution_170: function (entity, bulletIds, cd) {
            //30316
            //黑夜行者I +0 +1 R
            //黑夜行者II +0 +1 R
            //黑夜行者III +0 +1 R
            //黑夜行者IV +0 +1 R
            //黑夜行者V +0 +1 R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1500, 185 - 90 - 10), vec, bulletIds[0], 1, 0, 15, 0, 0, 0, -630, 0);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.05, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
        },
        solution_171: function (entity, bulletIds, cd) {
            //30330
            //黑夜行者I +0 +1 暴走R
            //黑夜行者II +0 +1 暴走R
            //黑夜行者III +0 +1 暴走R
            //黑夜行者IV +0 +1 暴走R
            //黑夜行者V +0 +1 暴走R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1200, 180 - 90, vec, bulletIds[0]);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1800, 185 - 90 - 10), vec, bulletIds[0], 1, 0, 30, 0, 0, 0, -810, 0);
                }
                if (idx == 3) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.02, 1, 0);
            bullet.setTimer(2, 0.07, 1, 0);
            bullet.setTimer(3, 0.1, 1, 0);
        },
        solution_172: function (entity, bulletIds, cd) {
            //30311
            //黑夜行者I +2 +3 L
            //黑夜行者II +2 +3 L
            //黑夜行者III +2 +3 L
            //黑夜行者IV +2 +3 L
            //黑夜行者V +2 +3 L
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1500, 175 - 90 + 10), vec, bulletIds[0], 1, 0, 15, 0, 0, 0, 630, 0);
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1500, 175 - 90 + 10), vec, bulletIds[0], 1, 0, 15, 180, 0, 0, 630, 0);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.05, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
        },
        solution_173: function (entity, bulletIds, cd) {
            //30325
            //黑夜行者I +2 +3 暴走L
            //黑夜行者II +2 +3 暴走L
            //黑夜行者III +2 +3 暴走L
            //黑夜行者IV +2 +3 暴走L
            //黑夜行者V +2 +3 暴走L
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1200, 180 - 90, vec, bulletIds[0]);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1800, 175 - 90 + 10), vec, bulletIds[0], 1, 0, 30, 0, 0, 0, 810, 0);
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1800, 175 - 90 + 10), vec, bulletIds[0], 1, 0, 30, 180, 0, 0, 810, 0);
                }
                if (idx == 3) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.02, 1, 0);
            bullet.setTimer(2, 0.07, 1, 0);
            bullet.setTimer(3, 0.1, 1, 0);
        },
        solution_174: function (entity, bulletIds, cd) {
            //30318
            //黑夜行者I +2 +3 R
            //黑夜行者II +2 +3 R
            //黑夜行者III +2 +3 R
            //黑夜行者IV +2 +3 R
            //黑夜行者V +2 +3 R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1500, 185 - 90 - 10), vec, bulletIds[0], 1, 0, 15, 0, 0, 0, -630, 0);
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1500, 185 - 90 - 10), vec, bulletIds[0], 1, 0, 15, 180, 0, 0, -630, 0);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.05, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
        },
        solution_175: function (entity, bulletIds, cd) {
            //30332
            //黑夜行者I +2 +3 暴走R
            //黑夜行者II +2 +3 暴走R
            //黑夜行者III +2 +3 暴走R
            //黑夜行者IV +2 +3 暴走R
            //黑夜行者V +2 +3 暴走R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1200, 180 - 90, vec, bulletIds[0]);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1800, 185 - 90 - 10), vec, bulletIds[0], 1, 0, 30, 0, 0, 0, -810, 0);
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1800, 185 - 90 - 10), vec, bulletIds[0], 1, 0, 30, 180, 0, 0, -810, 0);
                }
                if (idx == 3) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.02, 1, 0);
            bullet.setTimer(2, 0.07, 1, 0);
            bullet.setTimer(3, 0.1, 1, 0);
        },
        solution_176: function (entity, bulletIds, cd) {
            //30312 = 30313
            //黑夜行者I +4 L
            //黑夜行者II +4 +5 +6 L
            //黑夜行者III +4 +5 +6 +7 L
            //黑夜行者IV +4 +5 +6 +7 L
            //黑夜行者V +4 +5 +6 +7 L
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1500, 175 - 90 + 10), vec, bulletIds[0], 1, 0, 30, 0, 0, 0, 630, 0);
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1500, 175 - 90 + 10), vec, bulletIds[0], 1, 0, 30, 120, 0, 0, 630, 0);
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1500, 175 - 90 + 10), vec, bulletIds[0], 1, 0, 30, 240, 0, 0, 630, 0);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.05, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
        },
        solution_177: function (entity, bulletIds, cd) {
            //30326
            //黑夜行者I +4 暴走L
            //黑夜行者II +4 +5 暴走L
            //黑夜行者III +4 +5 暴走L
            //黑夜行者IV +4 +5 暴走L
            //黑夜行者V +4 +5 暴走L
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1200, 180 - 90, vec, bulletIds[0]);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1800, 175 - 90 + 10), vec, bulletIds[0], 1, 0, 40, 0, 0, 0, 810, 0);
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1800, 175 - 90 + 10), vec, bulletIds[0], 1, 0, 40, 120, 0, 0, 810, 0);
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1800, 175 - 90 + 10), vec, bulletIds[0], 1, 0, 40, 240, 0, 0, 810, 0);
                }
                if (idx == 3) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.02, 1, 0);
            bullet.setTimer(2, 0.07, 1, 0);
            bullet.setTimer(3, 0.1, 1, 0);
        },
        solution_178: function (entity, bulletIds, cd) {
            //30319 = 30320
            //黑夜行者I +4 R
            //黑夜行者II +4 +5 +6 R
            //黑夜行者III +4 +5 +6 +7 R
            //黑夜行者IV +4 +5 +6 +7 R
            //黑夜行者V +4 +5 +6 +7 R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1500, 185 - 90 - 10), vec, bulletIds[0], 1, 0, 30, 0, 0, 0, -630, 0);
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1500, 185 - 90 - 10), vec, bulletIds[0], 1, 0, 30, 120, 0, 0, -630, 0);
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1500, 185 - 90 - 10), vec, bulletIds[0], 1, 0, 30, 240, 0, 0, -630, 0);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.05, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
        },
        solution_179: function (entity, bulletIds, cd) {
            //30333
            //黑夜行者I +4 暴走R
            //黑夜行者II +4 +5 暴走R
            //黑夜行者III +4 +5 暴走R
            //黑夜行者IV +4 +5 暴走R
            //黑夜行者V +4 +5 暴走R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1200, 180 - 90, vec, bulletIds[0]);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1800, 185 - 90 - 10), vec, bulletIds[0], 1, 0, 40, 0, 0, 0, -810, 0);
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1800, 185 - 90 - 10), vec, bulletIds[0], 1, 0, 40, 120, 0, 0, -810, 0);
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1800, 185 - 90 - 10), vec, bulletIds[0], 1, 0, 40, 240, 0, 0, -810, 0);
                }
                if (idx == 3) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.02, 1, 0);
            bullet.setTimer(2, 0.07, 1, 0);
            bullet.setTimer(3, 0.1, 1, 0);
        },
        solution_180: function (entity, bulletIds, cd) {
            //30327
            //黑夜行者II +6 暴走L
            //黑夜行者III +6 +7 暴走L
            //黑夜行者IV +6 +7 暴走L
            //黑夜行者V +6 +7 暴走L
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1200, 180 - 90, vec, bulletIds[0]);
                    BulletSolutions.solution_7(entity, 1800, 180 - 90, vec, bulletIds[0]);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1800, 175 - 90 + 10), vec, bulletIds[0], 1, 0, 40, 0, 0, 0, 810, 0);
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1800, 175 - 90 + 10), vec, bulletIds[0], 1, 0, 40, 120, 0, 0, 810, 0);
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1800, 175 - 90 + 10), vec, bulletIds[0], 1, 0, 40, 240, 0, 0, 810, 0);
                }
                if (idx == 3) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.02, 1, 0);
            bullet.setTimer(2, 0.07, 1, 0);
            bullet.setTimer(3, 0.1, 1, 0);
        },
        solution_181: function (entity, bulletIds, cd) {
            //30334
            //黑夜行者II +6 暴走R
            //黑夜行者III +6 +7 暴走R
            //黑夜行者IV +6 +7 暴走R
            //黑夜行者V +6 +7 暴走R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1200, 180 - 90, vec, bulletIds[0]);
                    BulletSolutions.solution_7(entity, 1800, 180 - 90, vec, bulletIds[0]);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1800, 185 - 90 - 10), vec, bulletIds[0], 1, 0, 40, 0, 0, 0, -810, 0);
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1800, 185 - 90 - 10), vec, bulletIds[0], 1, 0, 40, 120, 0, 0, -810, 0);
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1800, 185 - 90 - 10), vec, bulletIds[0], 1, 0, 40, 240, 0, 0, -810, 0);
                }
                if (idx == 3) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.02, 1, 0);
            bullet.setTimer(2, 0.07, 1, 0);
            bullet.setTimer(3, 0.1, 1, 0);
        },
        solution_182: function (entity, bulletIds, cd) {
            //30314 = 30315
            //黑夜行者III +8 L
            //黑夜行者IV +8 +9 +10 L
            //黑夜行者V +8 +9 +10 +11 L
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1500, 175 - 90 + 10), vec, bulletIds[0], 1, 0, 40, 0, 0, 0, 630, 0);
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1500, 175 - 90 + 10), vec, bulletIds[0], 1, 0, 40, 90, 0, 0, 630, 0);
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1500, 175 - 90 + 10), vec, bulletIds[0], 1, 0, 40, 180, 0, 0, 630, 0);
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1500, 175 - 90 + 10), vec, bulletIds[0], 1, 0, 40, 270, 0, 0, 630, 0);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.05, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
        },
        solution_183: function (entity, bulletIds, cd) {
            //30328
            //黑夜行者III +8 暴走L
            //黑夜行者IV +8 +9 暴走L
            //黑夜行者V +8 +9 暴走L
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1200, 180 - 90, vec, bulletIds[0]);
                    BulletSolutions.solution_7(entity, 1800, 180 - 90, vec, bulletIds[0]);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1800, 175 - 90 + 10), vec, bulletIds[0], 1, 0, 40, 0, 0, 0, 810, 0);
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1800, 175 - 90 + 10), vec, bulletIds[0], 1, 0, 40, 90, 0, 0, 810, 0);
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1800, 175 - 90 + 10), vec, bulletIds[0], 1, 0, 40, 180, 0, 0, 810, 0);
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1800, 175 - 90 + 10), vec, bulletIds[0], 1, 0, 40, 270, 0, 0, 810, 0);
                }
                if (idx == 3) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.02, 1, 0);
            bullet.setTimer(2, 0.07, 1, 0);
            bullet.setTimer(3, 0.1, 1, 0);
        },
        solution_184: function (entity, bulletIds, cd) {
            //30321 = 30322
            //黑夜行者III +8 R
            //黑夜行者IV +8 +9 +10 R
            //黑夜行者V +8 +9 +10 +11 + 12 R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1500, 185 - 90 - 10), vec, bulletIds[0], 1, 0, 40, 0, 0, 0, -630, 0);
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1500, 185 - 90 - 10), vec, bulletIds[0], 1, 0, 40, 90, 0, 0, -630, 0);
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1500, 185 - 90 - 10), vec, bulletIds[0], 1, 0, 40, 180, 0, 0, -630, 0);
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1500, 185 - 90 - 10), vec, bulletIds[0], 1, 0, 40, 270, 0, 0, -630, 0);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.05, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
        },
        solution_185: function (entity, bulletIds, cd) {
            //30335
            //黑夜行者III +8 暴走R
            //黑夜行者IV +8 +9 暴走R
            //黑夜行者V +8 +9 暴走R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1200, 180 - 90, vec, bulletIds[0]);
                    BulletSolutions.solution_7(entity, 1800, 180 - 90, vec, bulletIds[0]);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1800, 185 - 90 - 10), vec, bulletIds[0], 1, 0, 40, 0, 0, 0, -810, 0);
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1800, 185 - 90 - 10), vec, bulletIds[0], 1, 0, 40, 90, 0, 0, -810, 0);
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1800, 185 - 90 - 10), vec, bulletIds[0], 1, 0, 40, 180, 0, 0, -810, 0);
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1800, 185 - 90 - 10), vec, bulletIds[0], 1, 0, 40, 270, 0, 0, -810, 0);
                }
                if (idx == 3) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.02, 1, 0);
            bullet.setTimer(2, 0.07, 1, 0);
            bullet.setTimer(3, 0.1, 1, 0);
        },
        solution_186: function (entity, bulletIds, cd) {
            //30329
            //黑夜行者IV +10 暴走L
            //黑夜行者IV +10 +11 +12 暴走L
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1200, 180 - 90, vec, bulletIds[0]);
                    BulletSolutions.solution_7(entity, 1800, 180 - 90, vec, bulletIds[0]);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1800, 175 - 90 + 10), vec, bulletIds[0], 1, 0, 60, 0, 0, 0, 810, 0);
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1800, 175 - 90 + 10), vec, bulletIds[0], 1, 0, 60, 60, 0, 0, 810, 0);
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1800, 175 - 90 + 10), vec, bulletIds[0], 1, 0, 60, 120, 0, 0, 810, 0);
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1800, 175 - 90 + 10), vec, bulletIds[0], 1, 0, 60, 180, 0, 0, 810, 0);
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1800, 175 - 90 + 10), vec, bulletIds[0], 1, 0, 60, 240, 0, 0, 810, 0);
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1800, 175 - 90 + 10), vec, bulletIds[0], 1, 0, 60, 300, 0, 0, 810, 0);
                }
                if (idx == 3) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.02, 1, 0);
            bullet.setTimer(2, 0.07, 1, 0);
            bullet.setTimer(3, 0.1, 1, 0);
        },
        solution_187: function (entity, bulletIds, cd) {
            //30336
            //黑夜行者IV +10 暴走R
            //黑夜行者V +10 +11 +12 暴走R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1200, 180 - 90, vec, bulletIds[0]);
                    BulletSolutions.solution_7(entity, 1800, 180 - 90, vec, bulletIds[0]);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1800, 185 - 90 - 10), vec, bulletIds[0], 1, 0, 60, 0, 0, 0, -810, 0);
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1800, 185 - 90 - 10), vec, bulletIds[0], 1, 0, 60, 60, 0, 0, -810, 0);
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1800, 185 - 90 - 10), vec, bulletIds[0], 1, 0, 60, 120, 0, 0, -810, 0);
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1800, 185 - 90 - 10), vec, bulletIds[0], 1, 0, 60, 180, 0, 0, -810, 0);
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1800, 185 - 90 - 10), vec, bulletIds[0], 1, 0, 60, 240, 0, 0, -810, 0);
                    BulletSolutions.solution_168_1(entity, ai.speedTransfer(1800, 185 - 90 - 10), vec, bulletIds[0], 1, 0, 60, 300, 0, 0, -810, 0);
                }
                if (idx == 3) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.02, 1, 0);
            bullet.setTimer(2, 0.07, 1, 0);
            bullet.setTimer(3, 0.1, 1, 0);
        },
        solution_188: function (entity, bulletIds, cd) {
            //30283 = 30290
            //毁灭冲锋I +0 +1 L&R
            //毁灭冲锋II +0 +1 L&R
            //毁灭冲锋III +0 +1 L&R
            //毁灭冲锋IV +0 +1 L&R
            //毁灭冲锋V +0 +1 L&R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1500, 180 - 90, vec, bulletIds[0]);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
        },
        solution_189: function (entity, bulletIds, cd) {
            //30296
            //毁灭冲锋I +0 +1 暴走L
            //毁灭冲锋II +0 +1 暴走L
            //毁灭冲锋III +0 +1 暴走L
            //毁灭冲锋IV +0 +1 暴走L
            //毁灭冲锋V +0 +1 暴走L
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1800, 183 - 90, vec, bulletIds[0]);
                    BulletSolutions.solution_189_1(entity, 1800, 187 - 90 - 14, vec, bulletIds[0]);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
        },
        solution_189_1: function (entity, speed, angle, v, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            // if (typeof om !== 'undefined') {
            //     bullet.setObjectSelfCircle(om);
            // }
            bullet.setPosition(v);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let v_1 = v.add(cc.v3(-100, 30));
                    let v_2 = v.add(cc.v3(-100, 100));
                    let posData = [v, v_1, v_2];
                    this.setBezier(posData, speed, 0, 1);
                    this.setMovementType(2);
                }
                if (idx == 2) {
                    this.setSpeed(ai.speedTransfer(speed, angle), true);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
        },
        solution_190: function (entity, bulletIds, cd) {
            //30303
            //毁灭冲锋I +0 +1 暴走R
            //毁灭冲锋II +0 +1 暴走R
            //毁灭冲锋III +0 +1 暴走R
            //毁灭冲锋IV +0 +1 暴走R
            //毁灭冲锋V +0 +1 暴走R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1800, 177 - 90, vec, bulletIds[0]);
                    BulletSolutions.solution_190_1(entity, 1800, 173 - 90 + 14, vec, bulletIds[0]);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
        },
        solution_190_1: function (entity, speed, angle, v, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            // if (typeof om !== 'undefined') {
            //     bullet.setObjectSelfCircle(om);
            // }
            bullet.setPosition(v);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let v_1 = v.add(cc.v3(100, 30));
                    let v_2 = v.add(cc.v3(100, 100));
                    let posData = [v, v_1, v_2];
                    this.setBezier(posData, speed, 0, 1);
                    this.setMovementType(2);
                }
                if (idx == 2) {
                    this.setSpeed(ai.speedTransfer(speed, angle), true);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
        },
        solution_191: function (entity, bulletIds, cd) {
            //30285
            //毁灭冲锋I +2 +3 L
            //毁灭冲锋II +2 +3 L
            //毁灭冲锋III +2 +3 L
            //毁灭冲锋IV +2 +3 L
            //毁灭冲锋V +2 +3 L
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1500, 175 - 90 + 10, vec, bulletIds[0]);
                    BulletSolutions.solution_7(entity, 1500, 180 - 90, vec, bulletIds[0]);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
        },
        solution_192: function (entity, bulletIds, cd) {
            //30298
            //毁灭冲锋I +2 +3 暴走L
            //毁灭冲锋II +2 +3 暴走L
            //毁灭冲锋III +2 +3 暴走L
            //毁灭冲锋IV +2 +3 暴走L
            //毁灭冲锋V +2 +3 暴走L
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1800, 183 - 90 - 6, vec, bulletIds[0]);
                    BulletSolutions.solution_189_1(entity, 2000, 187 - 90 - 14, vec, bulletIds[0]);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 2000, 177 - 90 + 6, vec, bulletIds[0]);
                }
                if (idx == 3) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
            bullet.setTimer(3, 0.2, 1, 0);
        },
        solution_193: function (entity, bulletIds, cd) {
            //30291
            //毁灭冲锋I +2 +3 R
            //毁灭冲锋II +2 +3 R
            //毁灭冲锋III +2 +3 R
            //毁灭冲锋IV +2 +3 R
            //毁灭冲锋V +2 +3 R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1500, 185 - 90 - 10, vec, bulletIds[0]);
                    BulletSolutions.solution_7(entity, 1500, 180 - 90, vec, bulletIds[0]);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
        },
        solution_194: function (entity, bulletIds, cd) {
            //30304
            //毁灭冲锋I +2 +3 暴走R
            //毁灭冲锋II +2 +3 暴走R
            //毁灭冲锋III +2 +3 暴走R
            //毁灭冲锋IV +2 +3 暴走R
            //毁灭冲锋V +2 +3 暴走R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1800, 177 - 90 + 6, vec, bulletIds[0]);
                    BulletSolutions.solution_190_1(entity, 2000, 173 - 90 + 14, vec, bulletIds[0]);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 2000, 183 - 90 - 6, vec, bulletIds[0]);
                }
                if (idx == 3) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
            bullet.setTimer(3, 0.2, 1, 0);
        },
        solution_195: function (entity, bulletIds, cd) {
            //30286
            //毁灭冲锋I +4 L
            //毁灭冲锋II +4 +5 L
            //毁灭冲锋III +4 +5 L
            //毁灭冲锋IV +4 +5 L
            //毁灭冲锋V +4 +5 L
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 2000, 175 - 90 + 10, vec, bulletIds[0]);
                    BulletSolutions.solution_7(entity, 2000, 180 - 90, vec, bulletIds[0]);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
        },
        solution_196: function (entity, bulletIds, cd) {
            //30299
            //毁灭冲锋I +4 暴走L
            //毁灭冲锋II +4 +5 暴走L
            //毁灭冲锋III +4 +5 暴走L
            //毁灭冲锋IV +4 +5 暴走L
            //毁灭冲锋V +4 +5 暴走L
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 2200, 183 - 90 - 6, vec, bulletIds[0]);
                    BulletSolutions.solution_189_1(entity, 2200, 187 - 90 - 14, vec, bulletIds[0]);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 2200, 177 - 90 + 6, vec, bulletIds[0]);
                    BulletSolutions.solution_196_1(entity, 2200, 181 - 90 - 2, vec, bulletIds[0]);
                }
                if (idx == 3) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
            bullet.setTimer(3, 0.2, 1, 0);
        },
        solution_196_1: function (entity, speed, angle, v, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            // if (typeof om !== 'undefined') {
            //     bullet.setObjectSelfCircle(om);
            // }
            bullet.setPosition(v);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let v_1 = v.add(cc.v3(-80, 0));
                    let v_2 = v.add(cc.v3(-120, 90));
                    let posData = [v, v_1, v_2];
                    this.setBezier(posData, speed, 0, 1);
                    this.setMovementType(2);
                }
                if (idx == 2) {
                    this.setSpeed(ai.speedTransfer(speed, angle), true);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
        },
        solution_197: function (entity, bulletIds, cd) {
            //30292
            //毁灭冲锋I +4 R
            //毁灭冲锋II +4 +5 R
            //毁灭冲锋III +4 +5 R
            //毁灭冲锋IV +4 +5 R
            //毁灭冲锋V +4 +5 R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 2000, 185 - 90 - 10, vec, bulletIds[0]);
                    BulletSolutions.solution_7(entity, 2000, 180 - 90, vec, bulletIds[0]);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
        },
        solution_198: function (entity, bulletIds, cd) {
            //30305
            //毁灭冲锋I +4 暴走R
            //毁灭冲锋II +4 +5 暴走R
            //毁灭冲锋III +4 +5 暴走R
            //毁灭冲锋IV +4 +5 暴走R
            //毁灭冲锋V +4 +5 暴走R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 2200, 177 - 90 + 6, vec, bulletIds[0]);
                    BulletSolutions.solution_190_1(entity, 2200, 173 - 90 + 14, vec, bulletIds[0]);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 2200, 183 - 90 - 6, vec, bulletIds[0]);
                    BulletSolutions.solution_198_1(entity, 2200, 179 - 90 + 2, vec, bulletIds[0]);
                }
                if (idx == 3) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
            bullet.setTimer(3, 0.2, 1, 0);
        },
        solution_198_1: function (entity, speed, angle, v, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            // if (typeof om !== 'undefined') {
            //     bullet.setObjectSelfCircle(om);
            // }
            bullet.setPosition(v);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let v_1 = v.add(cc.v3(80, 0));
                    let v_2 = v.add(cc.v3(120, 90));
                    let posData = [v, v_1, v_2];
                    this.setBezier(posData, speed, 0, 1);
                    this.setMovementType(2);
                }
                if (idx == 2) {
                    this.setSpeed(ai.speedTransfer(speed, angle), true);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
        },
        solution_199: function (entity, bulletIds, cd) {
            //30287
            //毁灭冲锋II +6 L
            //毁灭冲锋III +6 +7 L
            //毁灭冲锋IV +6 +7 L
            //毁灭冲锋V +6 +7 L
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_199_1(entity, 2000, 175 - 90 + 10, vec, bulletIds[0]);
                    BulletSolutions.solution_199_1(entity, 2000, 180 - 90, vec, bulletIds[0]);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
        },
        solution_199_1: function (entity, speed, angle, v, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            let vec = ai.speedTransfer(speed, angle);
            bullet.setSpeed(vec, true);
            // if (typeof om !== 'undefined') {
            //     bullet.setObjectSelfCircle(om);
            // }
            bullet.runScale(1.3, 0.3);
        },
        solution_200: function (entity, bulletIds, cd) {
            //30300
            //毁灭冲锋II +6 暴走L
            //毁灭冲锋III +6 +7 暴走L
            //毁灭冲锋IV +6 +7 暴走L
            //毁灭冲锋V +6 +7 暴走L
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 2500, 183 - 90 - 6, vec, bulletIds[0]);
                    BulletSolutions.solution_7(entity, 2500, 190 - 90 - 20, vec, bulletIds[0]);
                    BulletSolutions.solution_189_1(entity, 2500, 187 - 90 - 14, vec, bulletIds[0]);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 2500, 177 - 90 + 6, vec, bulletIds[0]);
                    BulletSolutions.solution_196_1(entity, 2500, 181 - 90 - 2, vec, bulletIds[0]);
                }
                if (idx == 3) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
            bullet.setTimer(3, 0.2, 1, 0);
        },
        solution_201: function (entity, bulletIds, cd) {
            //30293
            //毁灭冲锋II +6 R
            //毁灭冲锋III +6 +7 R
            //毁灭冲锋IV +6 +7 R
            //毁灭冲锋V +6 +7 R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_199_1(entity, 2000, 185 - 90 - 10, vec, bulletIds[0]);
                    BulletSolutions.solution_199_1(entity, 2000, 180 - 90, vec, bulletIds[0]);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
        },
        solution_202: function (entity, bulletIds, cd) {
            //30306
            //毁灭冲锋II +6 暴走R
            //毁灭冲锋III +6 +7 暴走R
            //毁灭冲锋IV +6 +7 暴走R
            //毁灭冲锋V +6 +7 暴走R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 2500, 177 - 90 + 6, vec, bulletIds[0]);
                    BulletSolutions.solution_7(entity, 2500, 170 - 90 + 20, vec, bulletIds[0]);
                    BulletSolutions.solution_190_1(entity, 2500, 173 - 90 + 14, vec, bulletIds[0]);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 2500, 183 - 90 - 6, vec, bulletIds[0]);
                    BulletSolutions.solution_198_1(entity, 2500, 179 - 90 + 2, vec, bulletIds[0]);
                }
                if (idx == 3) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
            bullet.setTimer(3, 0.2, 1, 0);
        },
        solution_203: function (entity, bulletIds, cd) {
            //30288 = 30289
            //毁灭冲锋III +8 L
            //毁灭冲锋IV +8 +9 +10 L
            //毁灭冲锋V +8 +9 +10 +11 +12 L
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_199_1(entity, 2000, 175 - 90 + 10, vec, bulletIds[0]);
                    BulletSolutions.solution_199_1(entity, 2000, 180 - 90, vec, bulletIds[0]);
                    BulletSolutions.solution_199_1(entity, 2000, 170 - 90 + 20, vec, bulletIds[0]);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
        },
        solution_204: function (entity, bulletIds, cd) {
            //30301
            //毁灭冲锋III +8 暴走L
            //毁灭冲锋IV +8 +9 暴走L
            //毁灭冲锋V +8 +9 暴走L
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 2800, 183 - 90 - 6, vec, bulletIds[0]);
                    BulletSolutions.solution_7(entity, 2800, 190 - 90 - 20, vec, bulletIds[0]);
                    BulletSolutions.solution_189_1(entity, 2500, 187 - 90 - 14, vec, bulletIds[0]);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 2800, 177 - 90 + 6, vec, bulletIds[0]);
                    BulletSolutions.solution_7(entity, 2800, 170 - 90 + 20, vec, bulletIds[0]);
                    BulletSolutions.solution_196_1(entity, 2800, 181 - 90 - 2, vec, bulletIds[0]);
                }
                if (idx == 3) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
            bullet.setTimer(3, 0.2, 1, 0);
        },
        solution_205: function (entity, bulletIds, cd) {
            //30294 = 30295
            //毁灭冲锋III +8 R
            //毁灭冲锋IV +8 +9 +10 R
            //毁灭冲锋V +8 +9 +10 +11 +12 R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_199_1(entity, 2000, 185 - 90 - 10, vec, bulletIds[0]);
                    BulletSolutions.solution_199_1(entity, 2000, 180 - 90, vec, bulletIds[0]);
                    BulletSolutions.solution_199_1(entity, 2000, 190 - 90 - 20, vec, bulletIds[0]);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
        },
        solution_206: function (entity, bulletIds, cd) {
            //30307
            //毁灭冲锋III +8 暴走R
            //毁灭冲锋IV +8 +9 暴走R
            //毁灭冲锋V +8 +9 暴走R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 2500, 177 - 90 + 6, vec, bulletIds[0]);
                    BulletSolutions.solution_7(entity, 2500, 170 - 90 + 20, vec, bulletIds[0]);
                    BulletSolutions.solution_190_1(entity, 2500, 173 - 90 + 14, vec, bulletIds[0]);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 2500, 183 - 90 - 6, vec, bulletIds[0]);
                    BulletSolutions.solution_7(entity, 2500, 190 - 90 - 20, vec, bulletIds[0]);
                    BulletSolutions.solution_198_1(entity, 2500, 179 - 90 + 2, vec, bulletIds[0]);
                }
                if (idx == 3) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
            bullet.setTimer(3, 0.2, 1, 0);
        },
        solution_207: function (entity, bulletIds, cd) {
            //30302
            //毁灭冲锋IV +10 暴走L
            //毁灭冲锋V +10 +11 +12 暴走L
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 3000, 183 - 90 - 6, vec, bulletIds[0]);
                    BulletSolutions.solution_7(entity, 3000, 190 - 90 - 20, vec, bulletIds[0]);
                    BulletSolutions.solution_189_1(entity, 3000, 187 - 90 - 14, vec, bulletIds[0]);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 3000, 177 - 90 + 6, vec, bulletIds[0]);
                    BulletSolutions.solution_7(entity, 3000, 170 - 90 + 20, vec, bulletIds[0]);
                    BulletSolutions.solution_196_1(entity, 3000, 181 - 90 - 2, vec, bulletIds[0]);
                }
                if (idx == 3) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.08, 1, 0);
            bullet.setTimer(3, 0.2, 1, 0);
        },
        solution_208: function (entity, bulletIds, cd) {
            //30308
            //毁灭冲锋IV +10 暴走R
            //毁灭冲锋V +10 +11 +12 暴走R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 3000, 177 - 90 + 6, vec, bulletIds[0]);
                    BulletSolutions.solution_7(entity, 3000, 170 - 90 + 20, vec, bulletIds[0]);
                    BulletSolutions.solution_190_1(entity, 3000, 173 - 90 + 14, vec, bulletIds[0]);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 3000, 183 - 90 - 6, vec, bulletIds[0]);
                    BulletSolutions.solution_7(entity, 3000, 190 - 90 - 20, vec, bulletIds[0]);
                    BulletSolutions.solution_198_1(entity, 3000, 179 - 90 + 2, vec, bulletIds[0]);
                }
                if (idx == 3) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.08, 1, 0);
            bullet.setTimer(3, 0.2, 1, 0);
        },
        //辅机 209-251
        solution_209: function (entity, bulletIds, cd) {
            //30362 = 30368
            //烈焰打击I +0 +1 L&R
            //烈焰打击II +0 +1 L&R
            //烈焰打击III +0 +1 L&R
            //烈焰打击IV +0 +1 L&R
            //烈焰打击V +0 +1 L&R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1900, 180 - 90, vec, bulletIds[0]);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.4, 2, 0);
            bullet.setTimer(2, 0.9, 1, 0);
        },
        solution_210: function (entity, bulletIds, cd) {
            //30363 = 30369
            //烈焰打击I +2 +3 L&R
            //烈焰打击II +2 +3 L&R
            //烈焰打击III +2 +3 L&R
            //烈焰打击IV +2 +3 L&R
            //烈焰打击V +2 +3 L&R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1900, 180 - 90, vec.add(cc.v3(18, 0)), bulletIds[0]);
                    BulletSolutions.solution_7(entity, 1900, 180 - 90, vec.add(cc.v3(-18, 0)), bulletIds[0]);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.4, 2, 0);
            bullet.setTimer(2, 0.9, 1, 0);
        },
        solution_211: function (entity, bulletIds, cd) {
            //30364
            //烈焰打击I +4 L
            //烈焰打击II +4 +5 L
            //烈焰打击III +4 +5 L
            //烈焰打击IV +4 +5 L
            //烈焰打击V +4 +5 L
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1900, 200 - 90 - 40, vec, bulletIds[0]);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1900, 190 - 90 - 20, vec, bulletIds[0]);
                }
                if (idx == 3) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1900, 180 - 90, vec, bulletIds[0]);
                }
                if (idx == 4) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.2, 1, 0);
            bullet.setTimer(2, 0.4, 1, 0);
            bullet.setTimer(3, 0.6, 1, 0);
            bullet.setTimer(4, 0.8, 1, 0);
        },
        solution_212: function (entity, bulletIds, cd) {
            //30370
            //烈焰打击I +4 R
            //烈焰打击II +4 +5 R
            //烈焰打击III +4 +5 R
            //烈焰打击IV +4 +5 R
            //烈焰打击V +4 +5 R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1900, 160 - 90 + 40, vec, bulletIds[0]);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1900, 170 - 90 + 20, vec, bulletIds[0]);
                }
                if (idx == 3) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1900, 180 - 90, vec, bulletIds[0]);
                }
                if (idx == 4) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.2, 1, 0);
            bullet.setTimer(2, 0.4, 1, 0);
            bullet.setTimer(3, 0.6, 1, 0);
            bullet.setTimer(4, 0.8, 1, 0);
        },
        solution_213: function (entity, bulletIds, cd) {
            //30365
            //烈焰打击II +6 L
            //烈焰打击III +6 +7 L
            //烈焰打击IV +6 +7 L
            //烈焰打击V +6 +7 L
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1900, 200 - 90 - 40, vec, bulletIds[0]);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1900, 190 - 90 - 20, vec.add(cc.v3(18, 0)), bulletIds[0]);
                    BulletSolutions.solution_7(entity, 1900, 190 - 90 - 20, vec.add(cc.v3(-18, 0)), bulletIds[0]);
                }
                if (idx == 3) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1900, 180 - 90, vec, bulletIds[0]);
                }
                if (idx == 4) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.2, 1, 0);
            bullet.setTimer(2, 0.4, 1, 0);
            bullet.setTimer(3, 0.6, 1, 0);
            bullet.setTimer(4, 0.8, 1, 0);
        },
        solution_214: function (entity, bulletIds, cd) {
            //30371
            //烈焰打击II +6 R
            //烈焰打击III +6 +7 R
            //烈焰打击IV +6 +7 R
            //烈焰打击V +6 +7 R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1900, 160 - 90 + 40, vec, bulletIds[0]);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1900, 170 - 90 + 20, vec.add(cc.v3(18, 0)), bulletIds[0]);
                    BulletSolutions.solution_7(entity, 1900, 170 - 90 + 20, vec.add(cc.v3(-18, 0)), bulletIds[0]);
                }
                if (idx == 3) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1900, 180 - 90, vec, bulletIds[0]);
                }
                if (idx == 4) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.2, 1, 0);
            bullet.setTimer(2, 0.4, 1, 0);
            bullet.setTimer(3, 0.6, 1, 0);
            bullet.setTimer(4, 0.8, 1, 0);
        },
        solution_215: function (entity, bulletIds, cd) {
            //30366
            //烈焰打击III +8 L
            //烈焰打击IV +8 +9 L
            //烈焰打击V +8 +9 L
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1900, 200 - 90 - 40, vec.add(cc.v3(18, 0)), bulletIds[0]);
                    BulletSolutions.solution_7(entity, 1900, 200 - 90 - 40, vec.add(cc.v3(-18, 0)), bulletIds[0]);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1900, 190 - 90 - 20, vec.add(cc.v3(18, 0)), bulletIds[0]);
                    BulletSolutions.solution_7(entity, 1900, 190 - 90 - 20, vec.add(cc.v3(-18, 0)), bulletIds[0]);
                }
                if (idx == 3) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1900, 180 - 90, vec.add(cc.v3(18, 0)), bulletIds[0]);
                    BulletSolutions.solution_7(entity, 1900, 180 - 90, vec.add(cc.v3(-18, 0)), bulletIds[0]);
                }
                if (idx == 4) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.2, 1, 0);
            bullet.setTimer(2, 0.4, 1, 0);
            bullet.setTimer(3, 0.6, 1, 0);
            bullet.setTimer(4, 0.8, 1, 0);
        },
        solution_216: function (entity, bulletIds, cd) {
            //30372
            //烈焰打击III +8 R
            //烈焰打击IV +8 +9 R
            //烈焰打击V +8 +9 R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1900, 160 - 90 + 40, vec.add(cc.v3(18, 0)), bulletIds[0]);
                    BulletSolutions.solution_7(entity, 1900, 160 - 90 + 40, vec.add(cc.v3(-18, 0)), bulletIds[0]);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1900, 170 - 90 + 20, vec.add(cc.v3(18, 0)), bulletIds[0]);
                    BulletSolutions.solution_7(entity, 1900, 170 - 90 + 20, vec.add(cc.v3(-18, 0)), bulletIds[0]);
                }
                if (idx == 3) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1900, 180 - 90, vec.add(cc.v3(18, 0)), bulletIds[0]);
                    BulletSolutions.solution_7(entity, 1900, 180 - 90, vec.add(cc.v3(-18, 0)), bulletIds[0]);
                }
                if (idx == 4) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.2, 1, 0);
            bullet.setTimer(2, 0.4, 1, 0);
            bullet.setTimer(3, 0.6, 1, 0);
            bullet.setTimer(4, 0.8, 1, 0);
        },
        solution_217: function (entity, bulletIds, cd) {
            //30367
            //烈焰打击IV +10 L
            //烈焰打击IV +10 +11 +12 L
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1900, 200 - 90 - 40, vec.add(cc.v3(18, 0)), bulletIds[0]);
                    BulletSolutions.solution_7(entity, 1900, 200 - 90 - 40, vec.add(cc.v3(-18, 0)), bulletIds[0]);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1900, 190 - 90 - 20, vec.add(cc.v3(18, 0)), bulletIds[0]);
                    BulletSolutions.solution_7(entity, 1900, 190 - 90 - 20, vec.add(cc.v3(-18, 0)), bulletIds[0]);
                }
                if (idx == 3) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1900, 180 - 90, vec.add(cc.v3(18, 0)), bulletIds[0]);
                    BulletSolutions.solution_7(entity, 1900, 180 - 90, vec.add(cc.v3(-18, 0)), bulletIds[0]);
                }
                if (idx == 4) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.1, 2, 0);
            bullet.setTimer(2, 0.3, 2, 0);
            bullet.setTimer(3, 0.5, 2, 0);
            bullet.setTimer(4, 1.1, 1, 0);
        },
        solution_218: function (entity, bulletIds, cd) {
            //30373
            //烈焰打击IV +10 R
            //烈焰打击IV +10 +11 +12 R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1900, 160 - 90 + 40, vec.add(cc.v3(18, 0)), bulletIds[0]);
                    BulletSolutions.solution_7(entity, 1900, 160 - 90 + 40, vec.add(cc.v3(-18, 0)), bulletIds[0]);
                }
                if (idx == 2) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1900, 170 - 90 + 20, vec.add(cc.v3(18, 0)), bulletIds[0]);
                    BulletSolutions.solution_7(entity, 1900, 170 - 90 + 20, vec.add(cc.v3(-18, 0)), bulletIds[0]);
                }
                if (idx == 3) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1900, 180 - 90, vec.add(cc.v3(18, 0)), bulletIds[0]);
                    BulletSolutions.solution_7(entity, 1900, 180 - 90, vec.add(cc.v3(-18, 0)), bulletIds[0]);
                }
                if (idx == 4) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.1, 2, 0);
            bullet.setTimer(2, 0.3, 2, 0);
            bullet.setTimer(3, 0.5, 2, 0);
            bullet.setTimer(4, 1.1, 1, 0);
        },
        solution_219: function (entity, bulletIds, cd) {
            //30350
            //守望先锋I +0 +1 L
            //守望先锋II +0 +1 L
            //守望先锋III +0 +1 L.
            //守望先锋IV +0 +1 L
            //守望先锋V +0 +1 L
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1500, 200 - 90 - 40, vec, bulletIds[0]);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.1, 1, 0);
            bullet.setTimer(2, 0.8, 1, 0);
        },
        solution_220: function (entity, bulletIds, cd) {
            //30356
            //守望先锋I +0 +1 R
            //守望先锋II +0 +1 R
            //守望先锋III +0 +1 R
            //守望先锋IV +0 +1 R
            //守望先锋V +0 +1 R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1500, 160 - 90 + 40, vec, bulletIds[0]);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.1, 1, 0);
            bullet.setTimer(2, 0.8, 1, 0);
        },
        solution_221: function (entity, bulletIds, cd) {
            //30351
            //守望先锋I +2 +3 L
            //守望先锋II +2 +3 L
            //守望先锋III +2 +3 L
            //守望先锋IV +2 +3 L
            //守望先锋V +2 +3 L
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1500, 200 - 90 - 40, vec, bulletIds[0]);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.3, 2, 0);
            bullet.setTimer(2, 0.8, 1, 0);
        },
        solution_222: function (entity, bulletIds, cd) {
            //30357
            //守望先锋I +2 +3 R
            //守望先锋II +2 +3 R
            //守望先锋III +2 +3 R
            //守望先锋IV +2 +3 R
            //守望先锋V +2 +3 R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1500, 160 - 90 + 40, vec, bulletIds[0]);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.3, 2, 0);
            bullet.setTimer(2, 0.8, 1, 0);
        },
        solution_223: function (entity, bulletIds, cd) {
            //30352
            //守望先锋I +4 L
            //守望先锋II +4 +5 L
            //守望先锋III +4 +5 L
            //守望先锋IV +4 +5 L
            //守望先锋V +4 +5 L
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 2500, 200 - 2 * this.ctrlValue[0] - 90 - 40, vec, bulletIds[0]);
                    this.ctrlValue[0] += 1;
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.08, 5, 0);
            bullet.setTimer(2, 0.8, 1, 0);
        },
        solution_224: function (entity, bulletIds, cd) {
            //30358
            //守望先锋I +4 R
            //守望先锋II +4 +5 R
            //守望先锋III +4 +5 R
            //守望先锋IV +4 +5 R
            //守望先锋V +4 +5 R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 2500, 160 + 2 * this.ctrlValue[0] - 90 + 40, vec, bulletIds[0]);
                    this.ctrlValue[0] += 1;
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.08, 5, 0);
            bullet.setTimer(2, 0.8, 1, 0);
        },
        solution_225: function (entity, bulletIds, cd) {
            //30353
            //守望先锋II +6 L
            //守望先锋III +6 +7 L
            //守望先锋IV +6 +7 L
            //守望先锋V +6 +7 L
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 2500, 200 - 3 * this.ctrlValue[0] - 90 - 40, vec, bulletIds[0]);
                    this.ctrlValue[0] += 1;
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.08, 6, 0);
            bullet.setTimer(2, 0.8, 1, 0);
        },
        solution_226: function (entity, bulletIds) {
            //30359
            //守望先锋II +6 R
            //守望先锋III +6 +7 R
            //守望先锋IV +6 +7 R
            //守望先锋V +6 +7 R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 2500, 160 + 3 * this.ctrlValue[0] - 90 + 40, vec, bulletIds[0]);
                    this.ctrlValue[0] += 1;
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.08, 6, 0);
            bullet.setTimer(2, 0.8, 1, 0);
        },
        solution_227: function (entity, bulletIds) {
            //30354
            //守望先锋III +8 L
            //守望先锋IV +8 +9 L
            //守望先锋V +8 +9 L
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 2800, 200 - 3 * this.ctrlValue[0] - 90 - 40, vec, bulletIds[0]);
                    this.ctrlValue[0] += 1;
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.08, 10, 0);
            bullet.setTimer(2, 0.9, 1, 0);
        },
        solution_228: function (entity, bulletIds) {
            //30360
            //守望先锋III +8 R
            //守望先锋IV +8 +9 R
            //守望先锋V +8 +9 R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 2800, 160 + 3 * this.ctrlValue[0] - 90 + 40, vec, bulletIds[0]);
                    this.ctrlValue[0] += 1;
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.08, 10, 0);
            bullet.setTimer(2, 0.9, 1, 0);
        },
        solution_229: function (entity, bulletIds) {
            //30355
            //守望先锋IV +10 L
            //守望先锋V +10 +11 +12 L
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 3000, 200 - 2 * this.ctrlValue[0] - 90 - 40, vec, bulletIds[0]);
                    this.ctrlValue[0] += 1;
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.05, 16, 0);
            bullet.setTimer(2, 0.9, 1, 0);
        },
        solution_230: function (entity, bulletIds) {
            //30361
            //守望先锋IV +10 R
            //守望先锋V +10 +11 +12 R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 3000, 160 + 2 * this.ctrlValue[0] - 90 + 40, vec, bulletIds[0]);
                    this.ctrlValue[0] += 1;
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.05, 16, 0);
            bullet.setTimer(2, 0.9, 1, 0);
        },
        solution_231: function (entity, bulletIds) {
            //30337
            //旋转游侠I +0 +1 L
            //旋转游侠II +0 +1 L
            //旋转游侠III +0 +1 L
            //旋转游侠IV +0 +1 L
            //旋转游侠V +0 +1 L
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1300, 180 + 1 * this.ctrlValue[0] - 90, vec, bulletIds[0]);
                    this.ctrlValue[0] += 1;
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.2, 4, 0);
            bullet.setTimer(2, 0.9, 1, 0);
        },
        solution_232: function (entity, bulletIds) {
            //30344
            //旋转游侠I +0 +1 R
            //旋转游侠II +0 +1 R
            //旋转游侠III +0 +1 R
            //旋转游侠IV +0 +1 R
            //旋转游侠V +0 +1 R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1300, 180 - 1 * this.ctrlValue[0] - 90, vec, bulletIds[0]);
                    this.ctrlValue[0] += 1;
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.2, 4, 0);
            bullet.setTimer(2, 0.9, 1, 0);
        },
        solution_233: function (entity, bulletIds) {
            //30339
            //旋转游侠I +2 +3 L
            //旋转游侠II +2 +3 L
            //旋转游侠III +2 +3 L
            //旋转游侠IV +2 +3 L
            //旋转游侠V +2 +3 L
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1300, 185 + 1 * this.ctrlValue[0] - 90 - 10, vec, bulletIds[0]);
                    this.ctrlValue[0] += 1;
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.16, 5, 0);
            bullet.setTimer(2, 0.9, 1, 0);
        },
        solution_234: function (entity, bulletIds) {
            //30345
            //旋转游侠I +2 +3 R
            //旋转游侠II +2 +3 R
            //旋转游侠III +2 +3 R
            //旋转游侠IV +2 +3 R
            //旋转游侠V +2 +3 R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1300, 175 - 1 * this.ctrlValue[0] - 90 + 10, vec, bulletIds[0]);
                    this.ctrlValue[0] += 1;
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.16, 5, 0);
            bullet.setTimer(2, 0.9, 1, 0);
        },
        solution_235: function (entity, bulletIds) {
            //30340
            //旋转游侠I +4 L
            //旋转游侠II +4 +5 L
            //旋转游侠III +4 +5 L
            //旋转游侠IV +4 +5 L
            //旋转游侠V +4 +5 L
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1500, 185 + 2 * this.ctrlValue[0] - 90 - 10, vec, bulletIds[0]);
                    this.ctrlValue[0] += 1;
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.11, 7, 0);
            bullet.setTimer(2, 0.9, 1, 0);
        },
        solution_236: function (entity, bulletIds) {
            //30346
            //旋转游侠I +4 R
            //旋转游侠II +4 +5 R
            //旋转游侠III +4 +5 R
            //旋转游侠IV +4 +5 R
            //旋转游侠V +4 +5 R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1500, 175 - 2 * this.ctrlValue[0] - 90 + 10, vec, bulletIds[0]);
                    this.ctrlValue[0] += 1;
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.11, 7, 0);
            bullet.setTimer(2, 0.9, 1, 0);
        },
        solution_237: function (entity, bulletIds) {
            //30341
            //旋转游侠II +6 L
            //旋转游侠III +6 +7 L
            //旋转游侠IV +6 +7 L
            //旋转游侠V +6 +7 L
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1800, 192 + 2 * this.ctrlValue[0] - 90 - 24, vec, bulletIds[0]);
                    this.ctrlValue[0] += 1;
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.1, 8, 0);
            bullet.setTimer(2, 0.9, 1, 0);
        },
        solution_238: function (entity, bulletIds) {
            //30347
            //旋转游侠II +6 R
            //旋转游侠III +6 +7 R
            //旋转游侠IV +6 +7 R
            //旋转游侠V +6 +7 R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 1800, 168 - 2 * this.ctrlValue[0] - 90 + 24, vec, bulletIds[0]);
                    this.ctrlValue[0] += 1;
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.1, 8, 0);
            bullet.setTimer(2, 0.9, 1, 0);
        },
        solution_239: function (entity, bulletIds) {
            //30342
            //旋转游侠III +8 L
            //旋转游侠IV +8 +9 L
            //旋转游侠V +8 +9 L
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 2000, 195 + 3 * this.ctrlValue[0] - 90 - 30, vec, bulletIds[0]);
                    this.ctrlValue[0] += 1;
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.08, 10, 0);
            bullet.setTimer(2, 0.9, 1, 0);
        },
        solution_240: function (entity, bulletIds) {
            //30348
            //旋转游侠III +8 R
            //旋转游侠IV +8 +9 R
            //旋转游侠V +8 +9 R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 2000, 165 - 3 * this.ctrlValue[0] - 90 + 30, vec, bulletIds[0]);
                    this.ctrlValue[0] += 1;
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.08, 10, 0);
            bullet.setTimer(2, 0.9, 1, 0);
        },
        solution_241: function (entity, bulletIds) {
            //30343
            //旋转游侠IV +10 L
            //旋转游侠V +10 +11 +12 L
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 2000, 204 + 3 * this.ctrlValue[0] - 90 - 48, vec, bulletIds[0]);
                    this.ctrlValue[0] += 1;
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.05, 16, 0);
            bullet.setTimer(2, 0.9, 1, 0);
        },
        solution_242: function (entity, bulletIds) {
            //30349
            //旋转游侠IV +10 R
            //旋转游侠V +10 +11 +12 R
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_7(entity, 2000, 156 - 3 * this.ctrlValue[0] - 90 + 48, vec, bulletIds[0]);
                    this.ctrlValue[0] += 1;
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.05, 16, 0);
            bullet.setTimer(2, 0.9, 1, 0);
        },
        //飞弹 243 - 
        solution_243: function (entity, v, s_1, c_1, s_2, c_2, bulletId, res) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setZ(Defines.Z.MISSILE);
            bullet.addMotionStreak(res);
            bullet.setPosition(v);
            bullet.setSpeed(cc.v3(800 * s_1, 800 * c_1));
            bullet.setSpeedAcc(cc.v3(1500 * s_2, 1500 * c_2));
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    if (this.getSpeed().x >= 0) {
                        this.delTimer(1);
                        this.setSpeedAcc(cc.v3(0, 1400));
                        this.setTimer(2, 0.5, 1, 0);
                    }
                } else if (idx == 2) {
                    let monster = ai.randMonster();
                    let sp = this.getSpeed();
                    if (monster == null) {
                        this.setSpeed(sp);
                    } else {
                        if (monster.getCollisionSwitch() && monster.getShow()) {
                            this.chaseTo(monster, this.getSpeed(), cc.v3(0, 0), 100, 10, 2, 0, 0.2);
                            this.setMovementType(3);
                        }
                    }
                }
            });
            bullet.setTimer(1, 0.03, 9999, 0);
        },
        solution_244: function (entity, v, s_1, c_1, s_2, c_2, bulletId, res) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setZ(Defines.Z.MISSILE);
            bullet.addMotionStreak(res);
            bullet.setPosition(v);
            bullet.setSpeed(cc.v3(800 * s_1, 800 * c_1));
            bullet.setSpeedAcc(cc.v3(1500 * s_2, 1500 * c_2));
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    if (this.getSpeed().x <= 0) {
                        this.delTimer(1);
                        this.setSpeedAcc(cc.v3(0, 1400));
                        this.setTimer(2, 0.5, 1, 0);
                    }
                } else if (idx == 2) {
                    let monster = ai.randMonster();
                    let sp = this.getSpeed();
                    if (monster == null) {
                        this.setSpeed(sp);
                    } else {
                        if (monster.getCollisionSwitch() && monster.getShow()) {
                            this.chaseTo(monster, this.getSpeed(), cc.v3(0, 0), 100, 10, 2, 0, 0.2);
                            this.setMovementType(3);
                        }
                    }
                }
            });
            bullet.setTimer(1, 0.03, 9999, 0);
        },
        solution_245: function (entity, bulletIds) {
            //30380 = 30381
            //寒冰导弹I +0 +1 +2 +3
            //寒冰导弹II +0 +1 +2 +3
            //寒冰导弹III +0 +1 +2 +3
            //寒冰导弹IV +0 +1 +2 +3
            //寒冰导弹V +0 +1 +2 +3
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_243(entity, vec, -0.2588, -0.9659, 0.2588, 0.9659, bulletIds[0], 'huoyan_lv');
                    BulletSolutions.solution_244(entity, vec, 0.2588, -0.9659, -0.2588, 0.9659, bulletIds[0], 'huoyan_lv');
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.03, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
        },
        solution_257: function (entity, bulletIds) {
            //30380 = 30381
            //寒冰导弹I +0 +1 +2 +3
            //寒冰导弹II +0 +1 +2 +3
            //寒冰导弹III +0 +1 +2 +3
            //寒冰导弹IV +0 +1 +2 +3
            //寒冰导弹V +0 +1 +2 +3
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_243(entity, vec, -0.2588, -0.9659, 0.2588, 0.9659, bulletIds[0], 'huoyan_lan');
                    BulletSolutions.solution_244(entity, vec, 0.2588, -0.9659, -0.2588, 0.9659, bulletIds[0], 'huoyan_lan');
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.03, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
        },
        solution_258: function (entity, bulletIds) {
            //30380 = 30381
            //寒冰导弹I +0 +1 +2 +3
            //寒冰导弹II +0 +1 +2 +3
            //寒冰导弹III +0 +1 +2 +3
            //寒冰导弹IV +0 +1 +2 +3
            //寒冰导弹V +0 +1 +2 +3
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_243(entity, vec, -0.2588, -0.9659, 0.2588, 0.9659, bulletIds[0], 'huoyan_zi');
                    BulletSolutions.solution_244(entity, vec, 0.2588, -0.9659, -0.2588, 0.9659, bulletIds[0], 'huoyan_zi');
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.03, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
        },
        solution_259: function (entity, bulletIds) {
            //30380 = 30381
            //寒冰导弹I +0 +1 +2 +3
            //寒冰导弹II +0 +1 +2 +3
            //寒冰导弹III +0 +1 +2 +3
            //寒冰导弹IV +0 +1 +2 +3
            //寒冰导弹V +0 +1 +2 +3
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_243(entity, vec, -0.2588, -0.9659, 0.2588, 0.9659, bulletIds[0], 'huoyan');
                    BulletSolutions.solution_244(entity, vec, 0.2588, -0.9659, -0.2588, 0.9659, bulletIds[0], 'huoyan');
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.03, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
        },
        solution_246: function (entity, bulletIds) {
            //30382 = 30383
            //寒冰导弹I +4
            //寒冰导弹II +4 +5 +6
            //寒冰导弹III +4 +5 +6 +7
            //寒冰导弹IV +4 +5 +6 +7
            //寒冰导弹V +4 +5 +6 +7
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_243(entity, vec, -0.2588, -0.9659, 0.2588, 0.9659, bulletIds[0], 'huoyan_lv');
                    BulletSolutions.solution_244(entity, vec, 0.2588, -0.9659, -0.2588, 0.9659, bulletIds[0], 'huoyan_lv');
                    BulletSolutions.solution_243(entity, vec, -0.707, -0.707, 0.707, 0.707, bulletIds[0], 'huoyan_lv');
                    BulletSolutions.solution_244(entity, vec, 0.707, -0.707, -0.707, 0.707, bulletIds[0], 'huoyan_lv');
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.03, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
        },
        solution_260: function (entity, bulletIds) {
            //30382 = 30383
            //寒冰导弹I +4
            //寒冰导弹II +4 +5 +6
            //寒冰导弹III +4 +5 +6 +7
            //寒冰导弹IV +4 +5 +6 +7
            //寒冰导弹V +4 +5 +6 +7
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_243(entity, vec, -0.2588, -0.9659, 0.2588, 0.9659, bulletIds[0], 'huoyan_lan');
                    BulletSolutions.solution_244(entity, vec, 0.2588, -0.9659, -0.2588, 0.9659, bulletIds[0], 'huoyan_lan');
                    BulletSolutions.solution_243(entity, vec, -0.707, -0.707, 0.707, 0.707, bulletIds[0], 'huoyan_lan');
                    BulletSolutions.solution_244(entity, vec, 0.707, -0.707, -0.707, 0.707, bulletIds[0], 'huoyan_lan');
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.03, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
        },
        solution_261: function (entity, bulletIds) {
            //30382 = 30383
            //寒冰导弹I +4
            //寒冰导弹II +4 +5 +6
            //寒冰导弹III +4 +5 +6 +7
            //寒冰导弹IV +4 +5 +6 +7
            //寒冰导弹V +4 +5 +6 +7
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_243(entity, vec, -0.2588, -0.9659, 0.2588, 0.9659, bulletIds[0], 'huoyan_zi');
                    BulletSolutions.solution_244(entity, vec, 0.2588, -0.9659, -0.2588, 0.9659, bulletIds[0], 'huoyan_zi');
                    BulletSolutions.solution_243(entity, vec, -0.707, -0.707, 0.707, 0.707, bulletIds[0], 'huoyan_zi');
                    BulletSolutions.solution_244(entity, vec, 0.707, -0.707, -0.707, 0.707, bulletIds[0], 'huoyan_zi');
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.03, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
        },
        solution_262: function (entity, bulletIds) {
            //30382 = 30383
            //寒冰导弹I +4
            //寒冰导弹II +4 +5 +6
            //寒冰导弹III +4 +5 +6 +7
            //寒冰导弹IV +4 +5 +6 +7
            //寒冰导弹V +4 +5 +6 +7
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_243(entity, vec, -0.2588, -0.9659, 0.2588, 0.9659, bulletIds[0], 'huoyan');
                    BulletSolutions.solution_244(entity, vec, 0.2588, -0.9659, -0.2588, 0.9659, bulletIds[0], 'huoyan');
                    BulletSolutions.solution_243(entity, vec, -0.707, -0.707, 0.707, 0.707, bulletIds[0], 'huoyan');
                    BulletSolutions.solution_244(entity, vec, 0.707, -0.707, -0.707, 0.707, bulletIds[0], 'huoyan');
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.03, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
        },
        solution_247: function (entity, bulletIds) {
            //30384 = 30385
            //寒冰导弹III +8
            //寒冰导弹IV +8 +9 +10
            //寒冰导弹V +8 +9 +10 +11 +12
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_243(entity, vec, -0.2588, -0.9659, 0.2588, 0.9659, bulletIds[0], 'huoyan_zi');
                    BulletSolutions.solution_244(entity, vec, 0.2588, -0.9659, -0.2588, 0.9659, bulletIds[0], 'huoyan_zi');
                    BulletSolutions.solution_243(entity, vec, -0.707, -0.707, 0.707, 0.707, bulletIds[0], 'huoyan_zi');
                    BulletSolutions.solution_244(entity, vec, 0.707, -0.707, -0.707, 0.707, bulletIds[0], 'huoyan_zi');
                    BulletSolutions.solution_243(entity, vec, -0.9659, -0.2588, 0.9659, 0.2588, bulletIds[0], 'huoyan_zi');
                    BulletSolutions.solution_244(entity, vec, 0.9659, -0.2588, -0.9659, 0.2588, bulletIds[0], 'huoyan_zi');
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.03, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
        },
        solution_263: function (entity, bulletIds) {
            //30384 = 30385
            //寒冰导弹III +8
            //寒冰导弹IV +8 +9 +10
            //寒冰导弹V +8 +9 +10 +11 +12
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_243(entity, vec, -0.2588, -0.9659, 0.2588, 0.9659, bulletIds[0], 'huoyan');
                    BulletSolutions.solution_244(entity, vec, 0.2588, -0.9659, -0.2588, 0.9659, bulletIds[0], 'huoyan');
                    BulletSolutions.solution_243(entity, vec, -0.707, -0.707, 0.707, 0.707, bulletIds[0], 'huoyan');
                    BulletSolutions.solution_244(entity, vec, 0.707, -0.707, -0.707, 0.707, bulletIds[0], 'huoyan');
                    BulletSolutions.solution_243(entity, vec, -0.9659, -0.2588, 0.9659, 0.2588, bulletIds[0], 'huoyan');
                    BulletSolutions.solution_244(entity, vec, 0.9659, -0.2588, -0.9659, 0.2588, bulletIds[0], 'huoyan');
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.03, 1, 0);
            bullet.setTimer(2, 0.1, 1, 0);
        },
        solution_248: function (entity, v, speed, T, t, bulletId, sc, om) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setZ(Defines.Z.MISSILE);
            if (typeof om !== 'undefined') {
                bullet.setObjectSelfCircle(om);
            }
            bullet.setPosition(v);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setSpeed(cc.v3(speed / T, 0));
                    this.setTimer(2, T, 1, 0);
                }
                if (idx == 2) {
                    this.setSpeed(cc.v3(0, 0));
                    this.setTimer(3, t, 1, 0);
                }
                if (idx == 3) {
                    this.setSpeed(cc.v3(0, 500));
                    this.setSpeedAcc(cc.v3(0, 1400));
                }
            });
            bullet.setTimer(1, 0.1, 1, 0);
        },
        solution_249: function (entity, bulletIds) {
            //30398
            //磁力漩涡I +0 +1
            //磁力漩涡II +0 +1
            //磁力漩涡III +0 +1
            //磁力漩涡IV +0 +1
            //磁力漩涡V +0 +1
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_248(entity, vec, -50, 0.2, 0.3, bulletIds[0], 1);
                    BulletSolutions.solution_248(entity, vec, 50, 0.2, 0.3, bulletIds[0], 1);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.1, 1, 0);
            bullet.setTimer(2, 0.2, 1, 0);
        },
        solution_250: function (entity, bulletIds) {
            //30399 = 30402
            //磁力漩涡I +2 +3 +4
            //磁力漩涡II +2 +3 +4 +5
            //磁力漩涡III +2 +3 +4 +5
            //磁力漩涡IV +2 +3 +4 +5
            //磁力漩涡V +2 +3 +4 +5
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_248(entity, vec, -50, 0.2, 0.3, bulletIds[0], 1);
                    BulletSolutions.solution_248(entity, vec, 50, 0.2, 0.3, bulletIds[0], 1);
                    BulletSolutions.solution_248(entity, vec, -100, 0.3, 0.4, bulletIds[0], 1);
                    BulletSolutions.solution_248(entity, vec, 100, 0.3, 0.4, bulletIds[0], 1);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.1, 1, 0);
            bullet.setTimer(2, 0.2, 1, 0);
        },
        solution_251: function (entity, bulletIds) {
            //30403 = 30404
            //磁力漩涡II +6
            //磁力漩涡III +6 +7 +8
            //磁力漩涡IV +6 +7 +8 +9
            //磁力漩涡V +6 +7 +8 +9
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_248(entity, vec, -50, 0.2, 0.3, bulletIds[0], 1);
                    BulletSolutions.solution_248(entity, vec, 50, 0.2, 0.3, bulletIds[0], 1);
                    BulletSolutions.solution_248(entity, vec, -100, 0.3, 0.4, bulletIds[0], 1);
                    BulletSolutions.solution_248(entity, vec, 100, 0.3, 0.4, bulletIds[0], 1);
                    BulletSolutions.solution_248(entity, vec, -150, 0.4, 0.5, bulletIds[0], 1);
                    BulletSolutions.solution_248(entity, vec, 150, 0.4, 0.5, bulletIds[0], 1);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.1, 1, 0);
            bullet.setTimer(2, 0.2, 1, 0);
        },
        solution_252: function (entity, bulletIds) {
            //30405
            //磁力漩涡IV +10
            //磁力漩涡V +10 +11 +12
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_248(entity, vec, -50, 0.2, 0.3, bulletIds[0], 1);
                    BulletSolutions.solution_248(entity, vec, 50, 0.2, 0.3, bulletIds[0], 1);
                    BulletSolutions.solution_248(entity, vec, -100, 0.3, 0.4, bulletIds[0], 1);
                    BulletSolutions.solution_248(entity, vec, 100, 0.3, 0.4, bulletIds[0], 1);
                    BulletSolutions.solution_248(entity, vec, -150, 0.4, 0.5, bulletIds[0], 1);
                    BulletSolutions.solution_248(entity, vec, 150, 0.4, 0.5, bulletIds[0], 1);
                    BulletSolutions.solution_248(entity, vec, -200, 0.5, 0.6, bulletIds[0], 1);
                    BulletSolutions.solution_248(entity, vec, 200, 0.5, 0.6, bulletIds[0], 1);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.1, 1, 0);
            bullet.setTimer(2, 0.2, 1, 0);
        },
        solution_253: function (entity, v, angle_1, angle_2, num, bulletId, sc, om) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setZ(Defines.Z.MISSILE);
            if (typeof om !== 'undefined') {
                bullet.setEntitySelfCircle(om,0);
            }
            bullet.setPosition(v);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setSpeed(ai.speedTransfer(150 / 0.3, angle_1));
                    this.setTimer(2, 0.3, 1, 0)
                }
                if (idx == 2) {
                    this.setSpeed(cc.v3(0, 0));
                    this.setTimer(3, 0.3 * 1.5 + (6 - num) * 0.08, 1, 0);
                }
                if (idx == 3) {
                    this.setSpeed(ai.speedTransfer(1500, angle_2));
                }
            });
            bullet.setTimer(1, 0, 1, 0);
        },
        solution_254: function (entity, bulletIds) {
            //30386
            //饮血刃碟I +0 +1
            //饮血刃碟II +0 +1
            //饮血刃碟III +0 +1
            //饮血刃碟IV +0 +1
            //饮血刃碟V +0 +1
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let n = 3;
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_253(entity, vec, -60 + (this.ctrlValue[0] - 3) * 60 - 90, 215 + (this.ctrlValue[0] - 3) * 20 - 90, this.ctrlValue[0], bulletIds[0], 1, 6);
                    this.ctrlValue[0] += 1;
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.08, n, 0);
            bullet.setTimer(2, 0.08 * (n + 1), 1, 0);
        },
        solution_255: function (entity, bulletIds) {
            //30388 = 30390
            //饮血刃碟I +2 +3 +4
            //饮血刃碟II +2 +3 +4 +5
            //饮血刃碟III +2 +3 +4 +5
            //饮血刃碟IV +2 +3 +4 +5
            //饮血刃碟V +2 +3 +4 +5
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let n = 5;
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_253(entity, vec, 216 + (this.ctrlValue[0] - 3) * 36 - 90, 190 + (this.ctrlValue[0] - 3) * 12 - 90, this.ctrlValue[0], bulletIds[0], 1, 6);
                    this.ctrlValue[0] += 1;
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.08, n, 0);
            bullet.setTimer(2, 0.08 * (n + 1), 1, 0);
        },
        solution_256: function (entity, bulletIds) {
            //30392 = 30394 = 30396
            //饮血刃碟II +6
            //饮血刃碟III +6 +7 +8
            //饮血刃碟IV +6 +7 +8 +9 +10
            //饮血刃碟V +6 +7 +8 +9 +10 +11 +12
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let n = 7;
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_253(entity, vec, 180 + (this.ctrlValue[0] - 3) * 15 - 90, 180 + (this.ctrlValue[0] - 3) * 5 - 90, this.ctrlValue[0], bulletIds[0], 1, 6);
                    this.ctrlValue[0] += 1;
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.08, n, 0);
            bullet.setTimer(2, 0.08 * (n + 1), 1, 0);
        },
        solution_300:function(entity,bulletIds){
            //法阵
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec = entity.getPosition();
                    BulletSolutions.solution_300_1(entity, vec,bulletIds[0]);
                    BulletSolutions.solution_300_2(entity, vec,bulletIds[0]);
                    this.setTimer(2,3,1,0);
                }
                if (idx == 2) {
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
        },
        solution_300_1: function (entity,vec,bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(vec);
            bullet.setEntitySelfCircle(6,0);
            bullet.setTimerHandler(function (idx) {
                if(idx == 0){
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(0,2.5,1,0);
        },
        solution_300_2: function (entity,vec,bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(vec);
            bullet.setEntitySelfCircle(-6,0);
            bullet.setTimerHandler(function (idx) {
                if(idx == 0){
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(0,2.5,1,0);
        },
        solution_301: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let vec = entity.getPosition();
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    for (let n = 0; n < 12; ++n) {
                        BulletSolutions.solution_301_1(entity, 300, 30 * n - 90, vec, bulletIds[0],6);
                    }
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.5, 5, 0);
        },
        solution_301_1: function (entity, speed, angle, v, bulletId, om) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            let sp = ai.speedTransfer(speed, angle);
            bullet.setSpeed(sp, true);
            if (typeof om !== 'undefined') {
                bullet.setEntitySelfCircle(om,0);
            }
        },
        solution_302: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.ctrlValue[1] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec_1 = entity.getPosition();
                    this.ctrlValue[0] += 1;
                    BulletSolutions.solution_302_1(entity, vec_1.add(cc.v3(-50, 0)), -45 + 16 * this.ctrlValue[0] - 16 - 90, bulletIds[0],6);
                }
                if (idx == 2) {
                    let vec_1 = entity.getPosition();
                    this.ctrlValue[1] += 1;
                    BulletSolutions.solution_302_1(entity, vec_1.add(cc.v3(50, 0)), 45 - 16 * this.ctrlValue[1] + 16 - 90, bulletIds[1],-6);
                    if (this.ctrlValue[1] > 5) {
                        ai.releaseEntity(this);
                    }
                }
                if (idx == 3) {
                    this.setTimer(2, 0.2, 6, 1);
                }
            });
            bullet.setTimer(1, 0.2, 6, 1);
            bullet.setTimer(3, 0.6, 1, 0);
        },
        solution_302_1: function (entity, v, angle, bulletId,om) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.setMovementType(0);
            bullet.setSpeed(ai.speedTransfer(400, angle), true);
            if (typeof om !== 'undefined') {
                bullet.setEntitySelfCircle(om,0);
            }
        },
        solution_303: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec_1 = entity.getPosition();
                    for(let n = 0;n < 3; ++n){
                        BulletSolutions.solution_303_1(entity, vec_1, n * (360 / 3), -135, bulletIds[0]);
                        BulletSolutions.solution_303_1(entity, vec_1, n * (360 / 3), -45, bulletIds[0]);
                    }
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.5, 1, 0);
        },
        solution_303_1: function (entity, ct, v, angle, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(ct);
            bullet.setEdgeCollision(2);
            bullet.setObjectAutoCircle(20, v, 0, 0, 360, 0, 1);
            bullet.setSpeed(ai.speedTransfer(400, angle));
        },
        solution_304: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let vec = entity.getPosition();
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    for (let n = 0; n < 12; ++n) {
                        BulletSolutions.solution_7(entity, 300, 30 * n - 90, vec, bulletIds[0]);
                    }
                }
                if(idx == 2){
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.7, 3, 1);
            bullet.setTimer(2,2.5,1,0);
        },
        solution_305: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let vec = entity.getPosition();
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec_1 = entity.getPosition().add(cc.v3(-30,0));
                    let vec_2 = entity.getPosition().add(cc.v3(30,0));
                    let hero = ai.getHero();
                    if(hero == null){
                    }
                    else{
                        BulletSolutions.solution_305_1(entity,400, vec_1,ai.getAngle(vec, hero.getPosition()), bulletIds[0],6);
                        BulletSolutions.solution_305_1(entity,400, vec_2,ai.getAngle(vec, hero.getPosition()), bulletIds[0],6);
                    }
                }
                if(idx == 2){
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.1, 3, 0);
            bullet.setTimer(5, 0.5, 1, 0);
        },
        solution_305_1: function (entity, speed, v,angle, bulletId,om) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            let sp = ai.speedTransfer(speed, angle);
            bullet.setSpeed(sp, true);
            if (typeof om !== 'undefined') {
                bullet.setEntitySelfCircle(om,0);
            }
        },
        solution_306: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let vec_1 = ai.posTransfer(cc.v3(0.3,0.4));
            let vec_2 = ai.posTransfer(cc.v3(0.8,0.5));
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    for (let n = 0; n < 5; ++n) {
                        BulletSolutions.solution_7(entity, 300, 360/5*n, vec_1, bulletIds[0]);
                    }
                }
                if(idx == 2){
                    for (let n = 0; n < 5; ++n) {
                        BulletSolutions.solution_7(entity, 300, 360/5*n, vec_2, bulletIds[0]);
                    }
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.5, 1, 0);
        },
        // solution_307(entity, bulletIds) {
        //     //
        //     let ai = require('AIInterface');
        //     let fake = ai.createFake(entity, Defines.ObjectType.OBJ_EXECUTE);
        //     fake.ctrlValue[0] = 0;
        //     fake.ctrlValue[1] = 0;
        //     fake.setTimerHandler(function (idx) {
        //         if (idx == 0) {
        //             let vec_1 = ai.posTransfer(cc.v3(0.1+Math.random()*0.3,0.2*this.ctrlValue[0]+0.2*Math.random()));
        //             let vec_2 = ai.posTransfer(cc.v3(0.9-Math.random()*0.3,1-0.2*this.ctrlValue[0]-0.2*Math.random()));
        //             BulletSolutions.solution_307_1(entity, vec_1,bulletIds[0]);
        //             BulletSolutions.solution_307_1(entity, vec_2,bulletIds[0]);
        //             this.ctrlValue[0] += 1;
        //         }
        //         if(idx == 1){
        //             this.setTimer(2,0.2,5,0);
        //         }
        //         if(idx == 2){
        //             let vec_1 = ai.posTransfer(cc.v3(0.9-Math.random()*0.3,0.2*this.ctrlValue[1]+0.2*Math.random()));
        //             let vec_2 = ai.posTransfer(cc.v3(0.1+Math.random()*0.3,1-0.2*this.ctrlValue[1]-0.2*Math.random()));
        //             BulletSolutions.solution_307_1(entity, vec_1,bulletIds[0]);
        //             BulletSolutions.solution_307_1(entity, vec_2,bulletIds[0]);
        //             this.ctrlValue[1] += 1;
        //         }
        //         if(idx == 3){
        //             ai.releaseEntity(this);
        //         }
        //     });
        //     fake.setTimer(0, 0.2, 5, 0);
        //     fake.setTimer(1, 1, 1, 0);
        //     fake.setTimer(2,1.5,1,0);
        // },
        // solution_307_1: function (entity, pos, bulletId) {
        //     let ai = require('AIInterface');
        //     let execute = ai.createExecute(bulletId, pos);
        // },
        solution_308: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.ctrlValue[0] = 0;
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec_1 = entity.getPosition();
                    this.ctrlValue[0] += 1;
                    for (let n = 0; n < 4; ++n) {
                        BulletSolutions.solution_308_1(entity, vec_1, n * 90 - 1 * this.ctrlValue[0] + 1, bulletIds[0]);
                    }
                }
                if(idx == 2){
                    let vec_1 = entity.getPosition();
                    for (let n = 0; n < 4; ++n) {
                        BulletSolutions.solution_308_1(entity, vec_1, n * 90 + 45, bulletIds[1]);
                    }
                }
                if(idx == 3){
                    let vec_1 = entity.getPosition();
                    for (let n = 0; n < 4; ++n) {
                        BulletSolutions.solution_308_1(entity, vec_1, n * 90, bulletIds[1]);
                    }
                }
                if(idx == 4){
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0.1, 91, 1);
            bullet.setTimer(2, 0, 1, 0);
            bullet.setTimer(3, 4.5, 1, 0);
            bullet.setTimer(4,5,1,0);
        },
        solution_308_1: function (entity, v, angle, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.setMovementType(0);
            bullet.setSpeed(ai.speedTransfer(400, angle), true);
        },
        // solution_309(entity, bulletIds) {
        //     //
        //     let ai = require('AIInterface');
        //     let fake = ai.createFake(entity, Defines.ObjectType.OBJ_EXECUTE);
        //     let vec_1 = ai.posTransfer(cc.v3(0.3,0.4));
        //     let vec_2 = ai.posTransfer(cc.v3(0.8,0.5));
        //     fake.setTimerHandler(function (idx) {
        //         if (idx == 0) {
        //             BulletSolutions.solution_307_1(entity, vec_2,bulletIds[0]);
        //         }
        //         if(idx == 1){
        //             BulletSolutions.solution_307_1(entity, vec_1,bulletIds[0]);
        //         }
        //         if(idx == 2){;
        //             BulletSolutions.solution_307_1(entity, vec_2,bulletIds[0]);
        //         }
        //         if(idx == 3){
        //             ai.releaseEntity(this);
        //         }
        //     });
        //     fake.setTimer(0, 0, 1, 0);
        //     fake.setTimer(1, 1, 1, 0);
        //     fake.setTimer(2,2,1,0);
        //     fake.setTimer(3,3,1,0);
        // },
        solution_310: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let vec_1 = ai.posTransfer(cc.v3(0.3,0.4));
            let vec_2 = ai.posTransfer(cc.v3(0.8,0.5));
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    for (let n = 0; n < 5; ++n) {
                        BulletSolutions.solution_7(entity, 300, 360/5*n, vec_2, bulletIds[0]);
                    }
                }
                if(idx == 2){
                    for (let n = 0; n < 5; ++n) {
                        BulletSolutions.solution_7(entity, 300, 360/5*n, vec_1, bulletIds[0]);
                    }
                }
                if(idx == 3){
                    for (let n = 0; n < 5; ++n) {
                        BulletSolutions.solution_7(entity, 300, 360/5*n, vec_2, bulletIds[0]);
                    }
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.5, 1, 0);
            bullet.setTimer(3, 1, 1, 0);
        },
        solution_311: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    let vec_1 = ai.posTransfer(cc.v3(0.4,0.8));
                    let vec_2 = ai.posTransfer(cc.v3(0.6,0.8));
                    for (let n = 0; n < 5; ++n) {
                        BulletSolutions.solution_7(entity, 300, 360/5*n, vec_1, bulletIds[0]);
                        BulletSolutions.solution_7(entity, 300, 360/5*n, vec_2, bulletIds[0]);
                    }
                }
                if(idx == 2){
                    let vec_1 = ai.posTransfer(cc.v3(0.4,0.6));
                    let vec_2 = ai.posTransfer(cc.v3(0.6,0.6));
                    for (let n = 0; n < 5; ++n) {
                        BulletSolutions.solution_7(entity, 300, 360/5*n, vec_1, bulletIds[0]);
                        BulletSolutions.solution_7(entity, 300, 360/5*n, vec_2, bulletIds[0]);
                    }
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 0.5, 1, 0);
        },
        solution_312: function (entity, bulletIds, scale) {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            let vec_1 = entity.getPosition();
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    BulletSolutions.solution_312_1(entity, vec_1, -90, bulletIds[0], bulletIds[1]);
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
        },
        solution_312_1: function (entity, v, angle, bulletId, bulletId_1) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.setMovementType(0);
            bullet.setTimerHandler(function (idx) {
                if (idx == 1) {
                    this.setSpeed(ai.speedTransfer(300, angle), true);
                }
                if (idx == 2) {
                    let vec_2 = this.getPosition();
                    BulletSolutions.solution_312_2(entity, vec_2, -15, bulletId_1);
                    BulletSolutions.solution_312_2(entity, vec_2, -60, bulletId_1);
                    BulletSolutions.solution_312_2(entity, vec_2, -120, bulletId_1);
                    BulletSolutions.solution_312_2(entity, vec_2, -165, bulletId_1);
                    ai.releaseEntity(this);
                }
            });
            bullet.setTimer(1, 0, 1, 0);
            bullet.setTimer(2, 1, 1, 0);
        },
        solution_312_2: function (entity, v, angle, bulletId) {
            let ai = require('AIInterface');
            let bullet = ai.createBullet(bulletId, entity);
            bullet.setPosition(v);
            bullet.setMovementType(0);
            bullet.setSpeed(ai.speedTransfer(250, angle), true);
        },
        solution_10001() {
            let ai = require('AIInterface');
            let bullet = ai.createFake(entity);
            bullet.setTimer(0, 0, 1);
            bullet.setTimerHandler(function (idx) {
                let bullets = [1, 1, 1, 1, 1];
                BulletSolutions.solution_12(ai.getHero(), bullets, 1);
                //ai.releaseEntity(this);
            });
        },
    }
});

module.exports = BulletSolutions;