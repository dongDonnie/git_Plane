const Defines = require('BattleDefines');
const GlobalVar = require('globalvar');
const ResMapping = require("resmapping");
const MotionNode = require("MotionNode");

var BezierStatus = {
    NONE: 0,
    PROCESS: 1,
};


cc.Class({
    extends: cc.Node,

    properties: {
        isShow: false,
        isDead: false,
        owner: null,
        objectType: Defines.ObjectType.OBJ_INVALID,
        objectName: '',
        objectID: 0,
        baseObject: null,
        zOrder: 4,

        selfTimer: [],
        selfTimerHandler: null,
        selfInnerTimerHandler: null,
        activedTimerCount: 0,

        ctrlValue: {
            default: {}
        },
        entityId: 0,
        atrb: {
            default: {}
        },
        prop: null,
        maxHp: 0,
        hp: 0,
        lv: 1,

        motionNode: null,
        curtime: 0,
    },

    ctor: function () {
        this.battleManager = require('BattleManager').getInstance();
        this.heroManager = require('HeroManager').getInstance();
        this.poolManager = require('PoolManager');
        this.initEntity();
    },

    initEntity: function () {
        this.resetTimer();
        this.reset();
    },

    reset: function () {
        this.isShow = false;
        this.isDead = true;
        this.hold = false;
        this.owner = null;
        this.objectType = Defines.ObjectType.OBJ_INVALID;
        this.objectName = '';
        this.objectID = 0;
        this.baseObject = null;
        this.zOrder = 4;

        this.delAllTimer();
        this.selfTimerHandler = null;
        this.selfInnerTimerHandler = null;

        this.changeAnchor = false;

        this.atrb.movementType = 0;
        this.atrb.edgeCollision = 0;
        this.atrb.edgeCollisionWithoutBottom = false;

        this.atrb.scaleToLeftTime = 0;
        this.atrb.scaleToDelta = 0;
        this.atrb.opacityToLeftTime = 0;
        this.atrb.opacityToDelta = 0;

        this.opacity = 255;
        this.setScale(1);
        this.angle = 0;

        this.ctrlValue = {};

        this.motionNode = null;

        this.rayAnime = null;

        this.curtime = 0;

        this.setAnchorPoint(cc.v3(0.5, 0.5));
        this.setPosition(cc.v3(0, 0));

        this.resetProp();
        this.resetStuff();
        this.resetShiftStandby();
        this.resetSimpleHarmonic();
        this.resetEntityAutoCircle();
        this.resetEntitySelfCircle();
        this.resetObjectAutoCircle();
        this.resetObjectSelfCircle();
        this.resetBezier();
        this.resetLine();

        this.resetAim();
        this.resetChase();
        this.resetEntity();
    },

    //object
    setObjectData: function (type, id) {
        this.objectType = type;
        id = typeof id !== 'undefined' ? id : -1;
        if (id == -1) {
            return false;
        } else {
            this.objectID = id;
        }

        if (this.objectType == Defines.ObjectType.OBJ_HERO_BULLET) {
            let bulletData = GlobalVar.tblApi.getDataBySingleKey('TblBattleBullet', id);
            this.objectName = bulletData.strName;
        } else if (this.objectType == Defines.ObjectType.OBJ_MONSTER_BULLET) {
            let bulletData = GlobalVar.tblApi.getDataBySingleKey('TblBattleBullet', id);
            this.objectName = bulletData.strName;
        } else if (this.objectType == Defines.ObjectType.OBJ_MONSTER) {
            let monsterData = GlobalVar.tblApi.getDataBySingleKey('TblBattleMonster', id);
            this.objectName = monsterData.strName;
        } else if (this.objectType == Defines.ObjectType.OBJ_BUFF) {
            if (this.objectID == Defines.Assist.WEAPON_UP) {
                this.objectName = "WeaponUp";
            } else if (this.objectID == Defines.Assist.SUPER) {
                this.objectName = "Super";
            } else if (this.objectID == Defines.Assist.PROTECT) {
                this.objectName = "Protect";
            } else if (this.objectID == Defines.Assist.HP) {
                this.objectName = "Hp";
            } else if (this.objectID == Defines.Assist.MP) {
                this.objectName = "Mp";
            } else if (this.objectID == Defines.Assist.MAGNET) {
                this.objectName = "Magnet";
            } else if (this.objectID == Defines.Assist.DASH) {
                this.objectName = "Dash";
            } else {
                this.objectName = "SpriteBuff";
            }
        } else if (this.objectType == Defines.ObjectType.OBJ_GOLD) {
            this.objectName = "SpriteBuff";
        } else if (this.objectType == Defines.ObjectType.OBJ_EXECUTE) {
            let bulletData = GlobalVar.tblApi.getDataBySingleKey('TblBattleBullet', id);
            this.objectName = bulletData.strName;
        } else {
            return false;
        }
        return true;
    },

    newObject: function () {
        if (this.baseObject != null && !this.changeAnchor) {
            this.baseObject.setPosition(this.atrb.objectAutoRotato.pos);
            this.baseObject.angle = 0;
        }

        this.motionStreakCtrl(0);

        return this.zOrder;
    },

    deleteObject: function () {
        this.motionStreakCtrl(2);

        if (this.baseObject == null) {
            return;
        }

        if (this.objectType == Defines.ObjectType.OBJ_HERO_BULLET) {
            this.poolManager.getInstance().putObject(Defines.PoolType.BULLET, this.baseObject);
        } else if (this.objectType == Defines.ObjectType.OBJ_MONSTER_BULLET) {
            this.poolManager.getInstance().putObject(Defines.PoolType.BULLET, this.baseObject);
        } else if (this.objectType == Defines.ObjectType.OBJ_MONSTER) {
            this.poolManager.getInstance().putObject(Defines.PoolType.MONSTER, this.baseObject, this.objectName);
        } else if (this.objectType == Defines.ObjectType.OBJ_BUFF) {
            this.poolManager.getInstance().putObject(Defines.PoolType.BUFF, this.baseObject, this.objectName);
        } else if (this.objectType == Defines.ObjectType.OBJ_GOLD) {
            this.poolManager.getInstance().putObject(Defines.PoolType.BUFF, this.baseObject);
        } else if (this.objectType == Defines.ObjectType.OBJ_EXECUTE) {
            this.poolManager.getInstance().putObject(Defines.PoolType.EXECUTE, this.baseObject, this.objectName);
        } else if (this.objectType == Defines.ObjectType.OBJ_SUNDRIES) {
            this.poolManager.getInstance().putObject(Defines.PoolType.OBJ_SUNDRIES, this.baseObject);
        }
        this.removeChild(this.baseObject);

    },

    getObject: function () {
        if (this.baseObject != null) {
            if (this.objectType == Defines.ObjectType.OBJ_HERO_BULLET) {
                return this.baseObject.getComponent("BulletObject");
            } else if (this.objectType == Defines.ObjectType.OBJ_MONSTER_BULLET) {
                return this.baseObject.getComponent("BulletObject");
            } else if (this.objectType == Defines.ObjectType.OBJ_MONSTER) {
                return this.baseObject.getComponent("MonsterObject");
            } else if (this.objectType == Defines.ObjectType.OBJ_BUFF) {
                return this.baseObject.getComponent("BuffObject");
            } else {
                return null;
            }
        } else {
            return null;
        }
    },

    //reset
    resetTimer: function () {
        this.selfTimer.splice(0, this.selfTimer.length);
        for (let i = 0; i < Defines.MAX_ENTITY_TIMER; ++i) {
            let timer = {
                active: 0,
                delay: 0,
                expire: 0,
                counts: 0,
                firstrun: 0,
            };
            this.selfTimer.push(timer);
        }
    },

    resetProp: function () {
        this.prop = {};

        for (let i = 1; i < Defines.PropName.Count; ++i) {
            this.prop[i] = 0;
        }

        this.maxHp = this.hp = 0;

        this.lv = 1;
    },

    resetStuff: function (param) {
        param = typeof param !== 'undefined' ? param : 2;
        switch (param) {
            case 0:
                this.atrb.scaleToLeftTime = 0;
                this.atrb.scaleToDelta = 0;
                break;
            case 1:
                this.atrb.scaleToLeftTime = 0;
                this.atrb.scaleToDelta = 0;
                break;
            case 2:
            default:
                this.atrb.scaleToLeftTime = 0;
                this.atrb.scaleToDelta = 0;
                this.atrb.opacityToLeftTime = 0;
                this.atrb.opacityToDelta = 0;
                break;
        }
    },

    resetShiftStandby: function () {
        this.atrb.shiftStandby = {};

        this.atrb.shiftStandby.state = 0;
        this.atrb.shiftStandby.dst = cc.v3(0, 0);
        this.atrb.shiftStandby.time = 0;
        this.atrb.shiftStandby.speed = 0;
        this.atrb.shiftStandby.speedAcc = 0;
        this.atrb.shiftStandby.fixDirection = false;
        this.atrb.shiftStandby.path = cc.v3(0, 0);
        this.atrb.shiftStandby.length = 0;
        this.atrb.shiftStandby.curLength = 0;
        this.atrb.shiftStandby.curTime = 0;
        this.atrb.shiftStandby.origin = cc.v3(0, 0);

        this.atrb.shiftStandby.stepone = 0.25;
        this.atrb.shiftStandby.steptwo = 0.25;
        this.atrb.shiftStandby.stepthree = 0.25;
        this.atrb.shiftStandby.stepfour = 0.25;

        this.atrb.shiftStandby.overDes = 0;
    },

    resetSimpleHarmonic: function () {
        this.atrb.simpleHarmonic = {};

        this.atrb.simpleHarmonic.amplitude = 0;
        this.atrb.simpleHarmonic.cycle = 1;
        this.atrb.simpleHarmonic.fi = 0;
        this.atrb.simpleHarmonic.moveDirection = cc.v3(0, 0);
        this.atrb.simpleHarmonic.speed = cc.v3(0, 0);
        this.atrb.simpleHarmonic.speedAcc = cc.v3(0, 0);
        this.atrb.simpleHarmonic.origin = cc.v3(0, 0);
        this.atrb.simpleHarmonic.curTime = 0;
        this.atrb.simpleHarmonic.fixDirection = 0;
    },

    resetEntityAutoCircle: function () {
        this.atrb.entityAutoRotato = {};

        this.atrb.entityAutoRotato.pos = cc.v3(0, 0);
        this.atrb.entityAutoRotato.rSpeed = 0;
        this.atrb.entityAutoRotato.rSpeedAcc = 0;
        this.atrb.entityAutoRotato.omega = 0;
        this.atrb.entityAutoRotato.omegaAcc = 0;
        this.atrb.entityAutoRotato.sita = 0;
        this.atrb.entityAutoRotato.radius = 0;

        this.atrb.entityAutoRotato.fixDirection = false;

        this.atrb.entityAutoRotato.chase = false;
        this.atrb.entityAutoRotato.chaseTarget = null;
    },

    resetEntitySelfCircle: function () {
        this.atrb.entitySelfRotato = {};

        this.atrb.entitySelfRotato.omega = 0;
        this.atrb.entitySelfRotato.omegaAcc = 0;
    },

    resetObjectAutoCircle: function () {
        this.atrb.objectAutoRotato = {};

        this.atrb.objectAutoRotato.rSpeed = 0;
        this.atrb.objectAutoRotato.rSpeedAcc = 0;
        this.atrb.objectAutoRotato.omega = 0;
        this.atrb.objectAutoRotato.omegaAcc = 0;
        this.atrb.objectAutoRotato.sita = 0;
        this.atrb.objectAutoRotato.radius = 0;
        this.atrb.objectAutoRotato.pos = cc.v3(0, 0);

        this.atrb.objectAutoRotato.fixDirection = false;
    },

    resetObjectSelfCircle: function () {
        this.atrb.objectSelfRotato = {};

        this.atrb.objectSelfRotato.omega = 0;
        this.atrb.objectSelfRotato.omegaAcc = 0;
    },

    resetBezier: function () {
        this.atrb.bezier = {};

        this.atrb.bezier.status = BezierStatus.NONE;
        this.atrb.bezier.posData = [];
        this.atrb.bezier.speed = 0;
        this.atrb.bezier.speedAcc = 0;
        this.atrb.bezier.journey = 0;
        this.atrb.bezier.displacement = 0;

        this.atrb.bezier.duration = 0;
        this.atrb.bezier.curTime = 0;
        this.atrb.bezier.endMove = true;
        this.atrb.bezier.isEnd = false;

        this.atrb.bezier.fixDirection = 0;
    },

    resetLine: function () {
        this.atrb.line = {};

        this.atrb.line.speed = cc.v3(0, 0);
        this.atrb.line.speedAcc = cc.v3(0, 0);

        this.atrb.line.fixDirection = false;
    },

    resetAim: function () {
        this.atrb.aimAt = {};

        this.atrb.aimAt.target = null;
        this.atrb.aimAt.omega = 0;
        this.atrb.aimAt.omegaAcc = 0;

        this.atrb.aimAt.angle = 0;
    },

    resetChase: function () {
        this.atrb.chase = {};

        this.atrb.chase.target = null;
        this.atrb.chase.speed = cc.v3(0, 0);
        this.atrb.chase.speedAcc = cc.v3(0, 0);
        this.atrb.chase.omega = 0;
        this.atrb.chase.omegaAcc = 0;
        this.atrb.chase.mode = 0;

        this.atrb.chase.curTime = 0;
        this.atrb.chase.duration = 0;
        this.atrb.chase.status = 0;
        this.atrb.chase.delay = 0;
        this.atrb.chase.fixTime = 0;
        this.atrb.chase.fixCurTime = 0;
    },

    resetEntity: function () {
        if (this.baseObject != null) {
            this.setPosition(this.getPosition().add(this.baseObject.getPosition()));
            this.baseObject.setPosition(cc.v3(0, 0));
            this.setBaseAngle(this.baseObject.angle + this.getBaseAngle());
            this.baseObject.angle = 0;
        } else {
            this.setBaseAngle(0);
        }
    },

    //update
    updateLine: function (dt) {
        let pos = this.getPosition();
        let line = this.atrb.line;
        line.speed.x += line.speedAcc.x * dt;
        line.speed.y += line.speedAcc.y * dt;

        if (this.atrb.edgeCollision && this.isShow) {
            if (pos.x <= 0 || pos.x >= cc.winSize.width) {
                if (pos.x < 0) {
                    pos.x = 0;
                } else if (pos.x > cc.winSize.width) {
                    pos.x = cc.winSize.width;
                }
                line.speed.x = -line.speed.x;
                line.speedAcc.x = -line.speedAcc.x;
                --this.atrb.edgeCollision;
            } else if (pos.y <= 0 || pos.y >= cc.winSize.height) {
                if (pos.y < 0) {
                    pos.y = 0;
                } else if (pos.y > cc.winSize.height) {
                    pos.y = cc.winSize.height;
                }
                line.speed.y = -line.speed.y;
                line.speedAcc.y = -line.speedAcc.y;
                --this.atrb.edgeCollision;
            }
        }

        if (this.atrb.edgeCollisionWithoutBottom && this.isShow) {
            if (pos.x <= 0 || pos.x >= cc.winSize.width) {
                if (pos.x < 0) {
                    pos.x = 0;
                } else if (pos.x > cc.winSize.width) {
                    pos.x = cc.winSize.width;
                }
                line.speed.x = -line.speed.x;
                line.speedAcc.x = -line.speedAcc.x;
            } else if (pos.y >= cc.winSize.height) {
                pos.y = cc.winSize.height;
                line.speed.y = -line.speed.y;
                line.speedAcc.y = -line.speedAcc.y;
            }
        }

        if (line.fixDirection) {
            this.angle = Math.atan2(this.atrb.line.speed.y, this.atrb.line.speed.x) * 180 / Math.PI - 90;
        }

        pos.x += line.speed.x * dt;
        pos.y += line.speed.y * dt;
        this.setPosition(pos);
    },

    updateBezier: function (dt) {
        let bezier = this.atrb.bezier;
        if (bezier.status != BezierStatus.PROCESS) {
            return;
        }

        let pos = this.getPosition();

        if (bezier.duration != 0) {

            let t = bezier.curTime / bezier.duration;
            let newPos = this.getBezierPos(bezier.posData, t);

            let v = newPos.sub(pos);
            if (v.x != 0 && v.y != 0) {
                if (bezier.fixDirection == 1) {
                    this.angle = angle - 90;
                } else if (bezier.fixDirection == 2) {
                    this.angle = angle - 180;
                } else if (bezier.fixDirection == 3) {
                    this.angle = angle;
                }
            }

            if (bezier.duration - bezier.currTime <= 0) {
                bezier.status = BezierStatus.NONE;
                bezier.isEnd = true;
                if (bezier.endMove) {
                    this.setLine((v.normalize()).mul(bezier.speed), (v.normalize()).mul(bezier.speedAcc));
                    this.setMovementType(0);
                }
            }

            bezier.curTime += dt;

            pos.x = newPos.x;
            pos.y = newPos.y;

        } else {

            bezier.speed += bezier.speedAcc * dt;
            bezier.displacement += bezier.speed * dt;
            let t = bezier.displacement / bezier.journey;

            let newPos = this.getBezierPos(bezier.posData, t < 1 ? t : 1);

            let v = newPos.sub(pos);
            if (v.x != 0 && v.y != 0 && bezier.fixDirection) {
                let angle = Math.atan2(v.y, v.x) * 180 / Math.PI;
                if (bezier.fixDirection == 1) {
                    this.angle = angle - 90;
                } else if (bezier.fixDirection == 2) {
                    this.angle = angle - 180;
                } else if (bezier.fixDirection == 3) {
                    this.angle = angle;
                }
            }

            if (t >= 1) {
                bezier.status = BezierStatus.NONE;
                bezier.isEnd = true;
                if (bezier.endMove) {
                    this.setLine((v.normalize()).mul(bezier.speed), (v.normalize()).mul(bezier.speedAcc));
                    this.setMovementType(0);
                }
            }

            pos.x = newPos.x;
            pos.y = newPos.y;

        }

        this.setPosition(pos);
    },
    factorial: function (n) {
        if (n == 0) {
            return 1;
        } else {
            return n * this.factorial(n - 1);
        }
    },
    getBezierPos: function (posData, t) {
        let data = JSON.parse(JSON.stringify(posData));
        let n = data.length - 1;
        let x = 0;
        let y = 0;
        for (let i = 1; i <= data.length; i++) {
            x = x + data[i - 1].x * (this.factorial(data.length - 1) / (this.factorial(data.length - i) * this.factorial(i - 1))) * Math.pow(1 - t, data.length - i) * Math.pow(t, i - 1)
            y = y + data[i - 1].y * (this.factorial(data.length - 1) / (this.factorial(data.length - i) * this.factorial(i - 1))) * Math.pow(1 - t, data.length - i) * Math.pow(t, i - 1)
        }
        return cc.v3(x, y);
    },

    updateEntityAutoCircle: function (dt) {
        let entityAutoRotato = this.atrb.entityAutoRotato;
        entityAutoRotato.rSpeed += entityAutoRotato.rSpeedAcc * dt;
        entityAutoRotato.omega += entityAutoRotato.omegaAcc * dt;

        let rLength = entityAutoRotato.radius + entityAutoRotato.rSpeed * dt;
        let sita = entityAutoRotato.sita + (entityAutoRotato.omega * Math.PI) / 180 * dt;

        entityAutoRotato.sita = sita;
        entityAutoRotato.radius = rLength;

        if (entityAutoRotato.chase && entityAutoRotato.chaseTarget != null) {
            this.setEntityAutoCirclePos(entityAutoRotato.chaseTarget.getPosition());
        }

        let x = Math.cos(sita) * rLength + entityAutoRotato.pos.x;
        let y = Math.sin(sita) * rLength + entityAutoRotato.pos.y;

        let v = cc.v3(x, y).sub(this.getPosition());
        if (entityAutoRotato.fixDirection) {
            this.angle = Math.atan2(v.y, v.x) * 180 / Math.PI - 90;
        }
        this.setPosition(x, y);
    },

    updateEntitySelfCircle: function (dt) {
        let entitySelfRotato = this.atrb.entitySelfRotato;
        entitySelfRotato.omega += entitySelfRotato.omegaAcc * dt;
        this.angle -= entitySelfRotato.omega;
    },

    updateObjectAutoCircle: function (dt) {
        if (this.changeAnchor || this.baseObject == null) {
            return;
        }
        let objectAutoRotato = this.atrb.objectAutoRotato;

        objectAutoRotato.rSpeed += objectAutoRotato.rSpeedAcc * dt;
        objectAutoRotato.omega += objectAutoRotato.omegaAcc * dt;

        let rLength = objectAutoRotato.radius + objectAutoRotato.rSpeed * dt;
        let sita = objectAutoRotato.sita + (objectAutoRotato.omega * Math.PI) / 180 * dt;
        let x = Math.cos(sita) * rLength;
        let y = Math.sin(sita) * rLength;

        objectAutoRotato.sita = sita;
        objectAutoRotato.radius = rLength;

        let v = cc.v3(x, y).sub(this.baseObject.getPosition());
        if (objectAutoRotato.fixDirection) {
            this.baseObject.angle = Math.atan2(v.y, v.x) * 180 / Math.PI - 90;
        }

        this.baseObject.setPosition(x, y);
    },

    updateObjectSelfCircle: function (dt) {
        if (this.baseObject == null) {
            return;
        }

        let objectSelfRotato = this.atrb.objectSelfRotato;
        objectSelfRotato.omega += objectSelfRotato.omegaAcc * dt;
        this.baseObject.angle -= objectSelfRotato.omega;
    },

    updateChase: function (dt) {
        let chase = this.atrb.chase;

        if (chase.status == 0) {
            return;
        }

        chase.curTime += dt;
        if (chase.status == 1) {
            if (chase.delay > 0) {
                if (chase.curTime >= chase.delay) {
                    chase.status = 2;
                    chase.curTime = 0;
                }
            } else {
                chase.status = 2;
            }
        }
        if (chase.status == 2) {
            if (chase.duration < 0 && chase.duration != -100) {
                chase.status == 3;
            } else {
                if (chase.duration != -100) {
                    chase.duration -= dt;
                }
                if (chase.fixTime != 0) {
                    chase.fixCurTime += dt;
                    if (chase.fixCurTime >= chase.fixTime) {
                        chase.fixCurTime = 0;
                        this.fixChase(dt);
                    }
                } else {
                    this.fixChase(dt);
                }
            }
        }

        chase.speed.x += chase.speedAcc.x * dt;
        chase.speed.y += chase.speedAcc.y * dt;

        this.setPosition(this.getPosition().add(chase.speed.mul(dt)));

        if (chase.status == 3) {
            //this.setLine(chase.speed, chase.speedAcc);
            //this.setMovementType(0);
            //this.resetChase();
        }
    },
    fixChase(dt) {
        let chase = this.atrb.chase;
        //判断目标在速度方向哪一侧
        //P = ( x1, y1 )，Q = ( x2, y2 )
        //叉积：P×Q = x1*y2 - x2*y1
        //若 P × Q > 0 , 则P在Q的顺时针方向。
        //若 P × Q < 0 , 则P在Q的逆时针方向。

        if (chase.target == null) {
            chase.target = require('AIInterface').randMonster();
        } else {
            if (chase.target.objectType == Defines.ObjectType.OBJ_MONSTER && chase.target.isDead) {
                chase.target = require('AIInterface').randMonster();
            }
        }

        if (chase.target == null) {
            return;
        } else {
            if (!cc.isValid(chase.target)) {
                return;
            } else {
                if (typeof chase.target.isDead !== 'undefined') {
                    if (chase.target.isDead) {
                        return;
                    }
                }
            }
        }

        let v = chase.target.getPosition().sub(this.getPosition());

        if (chase.mode == 0) {
            let originAngle = Math.atan2(chase.speed.y, chase.speed.x) * 180 / Math.PI;
            let side = v.x * chase.speed.y - chase.speed.x * v.y > 0 ? true : false;

            if (side) {
                chase.omega = -Math.abs(chase.omega);
                chase.omegaAcc = -Math.abs(chase.omegaAcc);
            } else {
                chase.omega = Math.abs(chase.omega);
                chase.omegaAcc = Math.abs(chase.omegaAcc);
            }

            chase.omega += chase.omegaAcc * dt;
            originAngle += chase.omega * dt;

            let v_a = cc.v3(Math.cos(originAngle * Math.PI / 180), Math.sin(originAngle * Math.PI / 180));

            chase.speed = v_a.mul(chase.speed.mag());
            chase.speedAcc == v_a.mul(chase.speedAcc.mag());

            if (v.x != 0 && v.y != 0) {
                this.angle = Math.atan2(chase.speed.y, chase.speed.x) * 180 / Math.PI - 90;
            }
        } else if (chase.mode == 1) {
            chase.speed = (v.normalize()).mul(chase.speed.mag());
            chase.speedAcc = (v.normalize()).mul(chase.speedAcc.mag());
        }

    },

    updateShiftToStandby: function (dt) {
        let shiftStandby = this.atrb.shiftStandby;

        if (shiftStandby.state == 0) {
            return;
        }

        if (shiftStandby.fixDirection) {
            this.angle = Math.atan2(shiftStandby.path.y, shiftStandby.path.x) * 180 / Math.PI - 90;
        }

        shiftStandby.curTime += dt;

        let v0 = shiftStandby.speed;
        let a = shiftStandby.speedAcc;
        let t = shiftStandby.curTime;
        let vt = v0 + a * t;
        let length = 0;
        if (shiftStandby.state == 1 || shiftStandby.state == 3) {
            length = v0 * t + 0.5 * a * t * t;
        } else {
            length = v0 * t - 0.5 * a * t * t;
        }
        let vec = (shiftStandby.path.normalize()).mul(length);
        shiftStandby.curLength = length;

        this.setPosition(shiftStandby.origin.add(vec));

        if (shiftStandby.state == 1) {
            if (shiftStandby.curLength >= shiftStandby.length) {

                shiftStandby.origin = this.getPosition();
                //shiftStandby.path = shiftStandby.path.normalize().mul((shiftStandby.path.mag() + shiftStandby.overDes)*0.5);
                //shiftStandby.length = (shiftStandby.path.mag() + shiftStandby.overDes)*0.5;
                shiftStandby.curLength = 0;
                shiftStandby.curTime = 0;

                let t = shiftStandby.time * shiftStandby.steptwo;
                //shiftStandby.speedAcc = Math.ceil(shiftStandby.length * 2 / t / t);
                shiftStandby.speed = Math.ceil(vt);

                shiftStandby.state = 2;
            }
        } else if (shiftStandby.state == 2) {
            if (shiftStandby.curLength >= shiftStandby.length) {

                shiftStandby.origin = this.getPosition();
                shiftStandby.path = shiftStandby.dst.sub(this.getPosition());
                shiftStandby.length = Math.floor(shiftStandby.path.mag()) * 0.5;
                shiftStandby.curLength = 0;
                shiftStandby.curTime = 0;

                let t = shiftStandby.time * shiftStandby.stepthree;
                shiftStandby.speedAcc = Math.ceil(shiftStandby.length * 2 / t / t);
                shiftStandby.speed = 0;

                shiftStandby.state = 3;
            }
        } else if (shiftStandby.state == 3) {
            if (shiftStandby.curLength >= shiftStandby.length) {

                shiftStandby.origin = this.getPosition();
                shiftStandby.path = shiftStandby.dst.sub(this.getPosition());
                shiftStandby.length = Math.floor(shiftStandby.path.mag());
                shiftStandby.curLength = 0;
                shiftStandby.curTime = 0;

                let t = shiftStandby.time * shiftStandby.stepfour;
                //shiftStandby.speedAcc = Math.ceil(shiftStandby.length * 2 / t / t);
                shiftStandby.speed = Math.ceil(vt); //Math.ceil(shiftStandby.speedAcc * t);

                shiftStandby.state = 4;
            }
        } else if (shiftStandby.state == 4) {
            if (shiftStandby.curLength >= shiftStandby.length) {
                this.setPosition(shiftStandby.dst);
                this.resetShiftStandby();
            }
        }

    },

    updateSimpleHarmonic: function (dt) {
        let simpleHarmonic = this.atrb.simpleHarmonic;

        simpleHarmonic.curTime += dt;

        simpleHarmonic.speed.x += simpleHarmonic.speedAcc.x * dt;
        simpleHarmonic.speed.y += simpleHarmonic.speedAcc.y * dt;

        simpleHarmonic.origin.x += simpleHarmonic.speed.x * dt;
        simpleHarmonic.origin.y += simpleHarmonic.speed.y * dt;

        let plus = simpleHarmonic.amplitude * Math.cos(Math.PI * 2 / simpleHarmonic.cycle * simpleHarmonic.curTime + simpleHarmonic.fi * Math.PI / 180);

        let v = cc.v2(simpleHarmonic.moveDirection.x, simpleHarmonic.moveDirection.y);
        if (plus > 0) {
            v = ((v.rotate(-90 * Math.PI / 180)).normalize()).mul(Math.abs(plus));
        } else if (plus < 0) {
            v = ((v.rotate(90 * Math.PI / 180)).normalize()).mul(Math.abs(plus));
        }

        let pos = this.getPosition();
        let newPos = simpleHarmonic.origin.add(cc.v3(v.x, v.y, 0));

        if (simpleHarmonic.fixDirection == 1) {
            this.angle = Math.atan2(simpleHarmonic.speed.y, simpleHarmonic.speed.x) * 180 / Math.PI - 90;
        } else if (simpleHarmonic.fixDirection == 2) {
            let direction = newPos.sub(pos);
            this.angle = Math.atan2(direction.y, direction.x) * 180 / Math.PI - 90;
        }

        this.setPosition(newPos);
    },

    updateAim: function (dt) {
        let aimAt = this.atrb.aimAt;
        if (aimAt.target != null) {

            let v = aimAt.target.getPosition().sub(this.getPosition());

            let angle = Math.ceil((Math.atan2(v.y, v.x) * 180 / Math.PI - 90) % 360);
            if (angle < 0) {
                angle += 360;
            }
            if (aimAt.angle == angle) {
                return;
            }
            aimAt.angle = angle;

            let side = 0;
            if (Math.abs(this.angle - aimAt.angle) > 180) {
                side = 1;
            }

            if (side) {
                this.angle -= aimAt.omega;
                if (this.angle < 0) {
                    this.angle += 360;
                }
                if (this.angle < aimAt.angle) {
                    this.angle = aimAt.angle;
                }
            } else {
                this.angle += aimAt.omega;
                if (this.angle > aimAt.angle) {
                    this.angle = aimAt.angle;
                }
            }
        }
    },

    updateMove: function (dt) {
        if (this.atrb.movementType == 0) {
            this.updateLine(dt);
        } else if (this.atrb.movementType == 1) {
            this.updateEntityAutoCircle(dt);
        } else if (this.atrb.movementType == 2) {
            this.updateBezier(dt);
        } else if (this.atrb.movementType == 3) {
            this.updateChase(dt);
        } else if (this.atrb.movementType == 4) {
            this.updateShiftToStandby(dt);
        } else if (this.atrb.movementType == 5) {
            this.updateSimpleHarmonic(dt);
        }

        this.updateObjectAutoCircle(dt);
        this.updateObjectSelfCircle(dt);
        this.updateEntitySelfCircle(dt);
        this.updateAim(dt);

        this.motionStreakCtrl(1)
    },

    updateTimer: function () {
        if (!this.activedTimerCount) {
            return;
        }

        for (let idx = 0; idx < Defines.MAX_ENTITY_TIMER; idx++) {
            if (this.selfTimer[idx].active) {
                if (this.selfTimer[idx].firstrun != 0) {
                    --this.selfTimer[idx].counts;
                    this.selfTimerHandler(idx);
                    this.selfTimer[idx].firstrun = 0;

                    // if (idx >= 40) {
                    //     this.selfInnerTimerHandler(idx);
                    // }

                } else if (this.selfTimer[idx].expire <= this.battleManager.currentTime) {

                    --this.selfTimer[idx].counts;
                    if (this.selfTimer[idx].counts <= 0) {
                        this.selfTimer[idx].active = 0;
                        this.activedTimerCount--;
                    }

                    this.selfTimerHandler(idx);

                    // if (idx >= 40) {
                    //     this.selfInnerTimerHandler(idx);
                    // }

                    this.selfTimer[idx].expire += this.selfTimer[idx].delay;
                }
            }
        }
    },

    updateStuff(dt) {
        if (this.atrb.scaleToLeftTime > 0) {
            this.atrb.scaleToLeftTime -= dt;
            let sy = Math.abs(this.scaleY) + this.atrb.scaleToDelta;
            this.setScale(this.scaleX + this.atrb.scaleToDelta, this.scaleY < 0 ? -sy : sy);
        }
        if (this.atrb.opacityToLeftTime > 0) {
            this.atrb.opacityToLeftTime -= dt;
            this.opacity += this.atrb.opacityToDelta;
            this.opacity = Math.min(255, Math.max(0, this.opacity));
        }
    },

    checkOut: function (dt) {
        this.curtime += dt;
        let pos = this.getPosition();

        let size = this.battleManager.displayContainer.getContentSize()

        if (this.battleManager.allScreen) {
            size.height -= 130;
        } else {
            size.height -= 47;
        }

        if (this.isShow) {
            if (pos.y > size.height + Defines.OUT_SIDE || pos.x < -Defines.OUT_SIDE || pos.y < -Defines.OUT_SIDE || pos.x > size.width + Defines.OUT_SIDE) {
                if (!this.hold) {
                    this.isDead = true;
                } else {
                    this.isShow = false;
                }
            }
        } else {
            if (pos.y < size.height && pos.x > 0 && pos.y > 0 && pos.x < size.width) {
                this.isShow = true;
            }
            if (this.curtime >= 1.44) {
                this.isShow = true;
            }
            if (pos.y > size.height + Defines.FORCE_DESTORY || pos.y < -Defines.FORCE_DESTORY || pos.x > size.width + Defines.FORCE_DESTORY || pos.x < -Defines.FORCE_DESTORY) {
                if (!this.hold) {
                    this.isShow = true;
                    this.isDead = true;
                }
            }
        }
    },

    update: function (dt) {

        this.updateMove(dt);

        this.checkOut(dt);

        this.updateStuff(dt);

        this.updateTimer();

    },

    //API
    aimAt: function (target, omega, omegaAcc) {
        this.atrb.aimAt.target = target;
        this.atrb.aimAt.omega = Math.abs(omega);
        this.atrb.aimAt.omegaAcc = Math.abs(omegaAcc);
        this.angle = Math.ceil(this.angle % 360);
        if (this.angle < 0) {
            this.angle += 360;
        }
    },

    simpleHarmonic: function (amplitude, cycle, fi, moveDirection, speed, speedAcc, fixDirection) {
        this.atrb.simpleHarmonic.amplitude = typeof amplitude !== 'undefined' ? amplitude : 0;
        this.atrb.simpleHarmonic.cycle = typeof cycle !== 'undefined' ? (cycle > 0 ? cycle : 1) : 1;
        this.atrb.simpleHarmonic.fi = typeof fi !== 'undefined' ? fi : 0;
        this.atrb.simpleHarmonic.moveDirection = typeof moveDirection !== 'undefined' ? moveDirection : cc.v3(0, 0);
        this.atrb.simpleHarmonic.speed = typeof speed !== 'undefined' ? speed : cc.v3(0, 0);
        this.atrb.simpleHarmonic.speedAcc = typeof speedAcc !== 'undefined' ? speedAcc : cc.v3(0, 0);
        this.atrb.simpleHarmonic.origin = this.getPosition();
        this.atrb.simpleHarmonic.curTime = 0;
        this.atrb.simpleHarmonic.fixDirection = typeof fixDirection !== 'undefined' ? fixDirection : 0;
    },

    shiftToStandby: function (destination, time, overDes, fixDirection) {
        this.atrb.shiftStandby.dst = typeof destination !== 'undefined' ? destination : this.getPosition();
        this.atrb.shiftStandby.time = typeof time !== 'undefined' ? time : 0;
        this.atrb.shiftStandby.overDes = typeof overDes !== 'undefined' ? overDes : 50;
        this.atrb.shiftStandby.fixDirection = typeof fixDirection !== 'undefined' ? fixDirection : false;

        this.atrb.shiftStandby.origin = this.getPosition();
        this.atrb.shiftStandby.path = this.atrb.shiftStandby.dst.sub(this.getPosition());
        this.atrb.shiftStandby.length = (this.atrb.shiftStandby.path.mag() + this.atrb.shiftStandby.overDes) * 0.5;
        this.atrb.shiftStandby.curLength = 0;
        this.atrb.shiftStandby.curTime = 0;

        this.atrb.shiftStandby.speed = 0;

        //this.atrb.shiftStandby.stepone = 0.5;
        //this.atrb.shiftStandby.steptwo = 1 - this.atrb.shiftStandby.stepone;

        let t = this.atrb.shiftStandby.time * this.atrb.shiftStandby.stepone;
        //this.atrb.shiftStandby.speedAcc = (this.atrb.shiftStandby.length - this.atrb.shiftStandby.speed * t)*2 / (t * t);
        this.atrb.shiftStandby.speedAcc = this.atrb.shiftStandby.length * 2 / t / t;

        this.atrb.shiftStandby.state = 1;
    },

    chaseTo: function (target, speed, speedAcc, omega, omegaAcc, duration, fixTime, delay, chaseMode) {
        if (target != null) {
            this.atrb.chase.target = target;
            this.atrb.chase.status = 1;
            this.atrb.chase.speed = typeof speed !== 'undefined' ? speed : cc.v3(0, 0);
            this.atrb.chase.speedAcc = typeof speedAcc !== 'undefined' ? speedAcc : cc.v3(0, 0);
            this.atrb.chase.omega = typeof omega !== 'undefined' ? omega : 0;
            this.atrb.chase.omegaAcc = typeof omegaAcc !== 'undefined' ? omegaAcc : 0;
            this.atrb.chase.duration = typeof duration !== 'undefined' ? duration : -100;
            this.atrb.chase.delay = typeof delay !== 'undefined' ? delay : 0;
            this.atrb.chase.fixTime = typeof fixTime !== 'undefined' ? fixTime : 0;
            this.atrb.chase.mode = typeof chaseMode !== 'undefined' ? chaseMode : 0;
        }
    },
    chaseHero: function (speed, speedAcc, omega, omegaAcc, chaseMode) {
        this.chaseTo(this.heroManager.planeEntity, speed, speedAcc, omega, omegaAcc, -100, 0, 0, chaseMode);
    },

    setEntityAutoCirclePos: function (pos) {
        this.atrb.entityAutoRotato.pos = typeof pos !== 'undefined' ? pos : cc.v3(0, 0);
    },
    getEntityAutoCirclePos: function () {
        return this.atrb.entityAutoRotato.pos;
    },
    setEntityAutoCircleRadius: function (v) {
        v = typeof v !== 'undefined' ? v : cc.v3(0, 0);
        let pos = v.add(this.atrb.entityAutoRotato.pos);
        this.atrb.entityAutoRotato.radius = v.mag();
        this.atrb.entityAutoRotato.sita = Math.atan2(v.y, v.x);
        this.setPosition(pos);
    },
    getEntityAutoCircleRadius: function () {
        return this.atrb.entityAutoRotato.radius;
    },
    setEntityAutoCircleRSpeed: function (rSpeed) {
        this.atrb.entityAutoRotato.rSpeed = rSpeed;
    },
    getEntityAutoCircleRSpeed: function () {
        return this.atrb.entityAutoRotato.rSpeed;
    },
    setEntityAutoCircleRSpeedAcc: function (rSpeedAcc) {
        this.atrb.entityAutoRotato.rSpeedAcc = rSpeedAcc;
    },
    getEntityAutoCircleRSpeedAcc: function () {
        return this.atrb.entityAutoRotato.rSpeedAcc;
    },
    setEntityAutoCircleOmega: function (omega) {
        this.atrb.entityAutoRotato.omega = typeof omega !== 'undefined' ? omega : 0;
    },
    getEntityAutoCircleOmega: function () {
        return this.atrb.entityAutoRotato.omega;
    },
    setEntityAutoCircleOmegaAcc: function (omegaAcc) {
        this.atrb.entityAutoRotato.omegaAcc = typeof omegaAcc !== 'undefined' ? omegaAcc : 0;
    },
    getEntityAutoCircleOmegaAcc: function () {
        return this.atrb.entityAutoRotato.omegaAcc;
    },
    setEntityAutoCircleFixDirection: function (fixDirection) {
        this.atrb.entityAutoRotato.fixDirection = typeof fixDirection !== 'undefined' ? fixDirection : false;
    },
    getEntityAutoCircleFixDirection: function () {
        return this.atrb.entityAutoRotato.fixDirection;
    },
    setEntityAutoCircleChase: function (chase, target) {
        this.atrb.entityAutoRotato.chase = typeof chase !== 'undefined' ? chase : false;
        if (this.atrb.entityAutoRotato.chase && typeof target !== 'undefined' && target != null) {
            this.atrb.entityAutoRotato.chaseTarget = target;
        } else {
            this.atrb.entityAutoRotato.chaseTarget = null;
        }
    },
    setEntityAutoCircle: function (circlePos, pos, omega, omegaAcc, rSpeed, rSpeedAcc, fixDirection, chase, chaseTarget) {
        this.setEntityAutoCirclePos(circlePos);
        this.setEntityAutoCircleRadius(pos);
        this.setEntityAutoCircleOmega(omega);
        this.setEntityAutoCircleOmegaAcc(omegaAcc);
        this.setEntityAutoCircleRSpeed(rSpeed);
        this.setEntityAutoCircleRSpeedAcc(rSpeedAcc);
        this.setEntityAutoCircleFixDirection(fixDirection);
        this.setEntityAutoCircleChase(chase, chaseTarget);
    },

    setEntitySelfCircleOmega: function (omega) {
        this.atrb.entitySelfRotato.omega = typeof omega !== 'undefined' ? omega : 0;
    },
    getEntitySelfCircleOmega: function () {
        return this.atrb.entitySelfRotato.omega;
    },
    setEntitySelfCircleOmegaAcc: function (omegaAcc) {
        this.atrb.entitySelfRotato.omegaAcc = typeof omegaAcc !== 'undefined' ? omegaAcc : 0;
    },
    getEntitySelfCircleOmegaAcc: function () {
        return this.atrb.entitySelfRotato.omegaAcc;
    },
    setEntitySelfCircle: function (omega, omegaAcc) {
        this.setEntitySelfCircleOmega(omega);
        this.setEntitySelfCircleOmegaAcc(omegaAcc);
    },

    setObjectAutoCircleRSpeed: function (rSpeed) {
        this.atrb.objectAutoRotato.rSpeed = typeof rSpeed !== 'undefined' ? rSpeed : 0;
    },
    getObjectAutoCircleRSpeed: function () {
        return this.atrb.objectAutoRotato.rSpeed;
    },
    setObjectAutoCircleRSpeedAcc: function (rSpeedAcc) {
        this.atrb.objectAutoRotato.rSpeedAcc = typeof rSpeedAcc !== 'undefined' ? rSpeedAcc : 0;
    },
    getObjectAutoCircleRSpeedAcc: function () {
        return this.atrb.objectAutoRotato.rSpeedAcc;
    },
    setObjectAutoCircleOmega: function (omega) {
        this.atrb.objectAutoRotato.omega = typeof omega !== 'undefined' ? omega : 0;
    },
    getObjectAutoCircleOmega: function () {
        return this.atrb.objectAutoRotato.omega;
    },
    setObjectAutoCircleOmegaAcc: function (omegaAcc) {
        this.atrb.objectAutoRotato.omegaAcc = typeof omegaAcc !== 'undefined' ? omegaAcc : 0;
    },
    getObjectAutoCircleOmegaAcc: function () {
        return this.atrb.objectAutoRotato.omegaAcc;
    },
    setObjectAutoCircleRadius: function (radius, angle) {
        angle = typeof angle !== 'undefined' ? angle * Math.PI / 180 : 0;
        this.atrb.objectAutoRotato.radius = typeof radius !== 'undefined' ? radius : 0;
        let v = cc.v3(Math.cos(angle), Math.sin(angle));
        this.atrb.objectAutoRotato.pos = v.mul(radius);
        this.atrb.objectAutoRotato.sita = angle;
    },
    getObjectAutoCircleRadius: function () {
        return this.atrb.objectAutoRotato.radius;
    },
    setObjectAutoCircleFixDirection: function (fixDirection) {
        this.atrb.objectAutoRotato.fixDirection = typeof fixDirection !== 'undefined' ? fixDirection : false;
    },
    getObjectAutoCircleFixDirection: function () {
        return this.atrb.objectAutoRotato.fixDirection;
    },
    setObjectAutoCircle: function (radius, angle, rSpeed, rSpeedAcc, omega, omegaAcc, fixDirection) {
        this.setObjectAutoCircleRadius(radius, angle);
        this.setObjectAutoCircleRSpeed(rSpeed);
        this.setObjectAutoCircleRSpeedAcc(rSpeedAcc);
        this.setObjectAutoCircleOmega(omega);
        this.setObjectAutoCircleOmegaAcc(omegaAcc);
        this.setObjectAutoCircleFixDirection(fixDirection);
    },

    setObjectSelfCircleOmega: function (omega) {
        this.atrb.objectSelfRotato.omega = typeof omega !== 'undefined' ? omega : 0;
    },
    getObjectSelfCircleOmega: function () {
        return this.atrb.objectSelfRotato.omega;
    },
    setObjectSelfCircleOmegaAcc: function (omegaAcc) {
        this.atrb.objectSelfRotato.omegaAcc = typeof omegaAcc !== 'undefined' ? omegaAcc : 0;
    },
    getObjectSelfCircleOmegaAcc: function () {
        return this.atrb.objectSelfRotato.omegaAcc;
    },
    setObjectSelfCircle: function (omega, omegaAcc) {
        this.setObjectSelfCircleOmega(omega);
        this.setObjectSelfCircleOmegaAcc(omegaAcc);
    },

    setSpeed: function (v, fixDirection) {
        this.atrb.line.speed = typeof v !== 'undefined' ? v : cc.v3(0, 0);
        this.atrb.line.fixDirection = typeof fixDirection !== 'undefined' ? fixDirection : false;

        if (this.atrb.line.fixDirection) {
            this.angle = Math.atan2(this.atrb.line.speed.y, this.atrb.line.speed.x) * 180 / Math.PI - 90;
        }
    },
    getSpeed: function () {
        return this.atrb.line.speed;
    },
    setSpeedAcc: function (acc) {
        this.atrb.line.speedAcc = typeof acc !== 'undefined' ? acc : cc.v3(0, 0);
    },
    getSpeedAcc: function () {
        return this.atrb.line.speedAcc;
    },
    setLine: function (speed, speedAcc, fixDirection) {
        this.setSpeed(speed, fixDirection);
        this.setSpeedAcc(speedAcc);
    },

    setBezier: function (arrayPoints, speed, speedAcc, fixDirection, duration, endMove) {
        let bezier = this.atrb.bezier;

        if (arrayPoints.length > 1) {
            bezier.posData = arrayPoints;
            for (let i = 0; i < bezier.posData.length - 1; i++) {
                let v = bezier.posData[i + 1].sub(bezier.posData[i]);
                bezier.journey += v.mag();
            }
            bezier.displacement = 0;
            bezier.speed = typeof speed !== 'undefined' ? speed : 0;
            bezier.speedAcc = typeof speedAcc !== 'undefined' ? speedAcc : 0;
            bezier.fixDirection = typeof fixDirection !== 'undefined' ? fixDirection : 1;
            bezier.duration = typeof duration !== 'undefined' ? duration : 0;
            bezier.endMove = typeof endMove !== 'undefined' ? endMove : true;
            bezier.curTime = 0;
            bezier.isEnd = false;
            bezier.status = BezierStatus.PROCESS;
        }
    },
    getBezierIsEnd: function () {
        return this.atrb.bezier.isEnd;
    },

    setMovementType: function (movementType) {
        this.atrb.movementType = typeof movementType !== 'undefined' ? movementType : 0;
    },

    //other
    setObjcetPosition: function (radius, angle) {
        setObjectAutoCircleRadius(radius, angle);
    },
    getObjectPosition: function () {
        if (this.baseObject != null) {
            return this.baseObject.getPosition();
        } else {
            return cc.v3(0, 0);
        }
    },

    setObjectAngle: function (angle) {
        if (this.baseObject != null) {
            this.baseObject.angle = angle;
        }
    },
    getObjectAngle: function () {
        if (this.baseObject != null) {
            return this.baseObject.angle;
        } else {
            return 0;
        }
    },

    setZ: function (z) {
        this.zOrder = typeof z !== 'undefined' ? z : 4;
    },
    getZ: function () {
        return this.zOrder;
    },

    setBaseAngle: function (angle) {
        this.angle = typeof angle !== 'undefined' ? angle : 0;
    },
    getBaseAngle: function () {
        return this.angle;
    },

    setOpacity: function (o) {
        this.opacity = typeof o !== 'undefined' ? o : 255;
    },
    getOpacity: function () {
        return this.opacity;
    },

    setActive: function (a) {
        this.active = typeof a !== 'undefined' ? a : true;
    },
    getActive: function () {
        return this.active;
    },
    setHold: function (hold) {
        this.hold = typeof hold !== 'undefined' ? hold : false;
    },
    getHold: function () {
        return this.hold;
    },
    setAnchor: function (x, y) {
        if (this.baseObject == null) {
            return;
        }
        this.changeAnchor = true;
        this.baseObject.setPosition(x, y);
    },
    getAnchor: function () {
        if (this.baseObject == null) {
            return null;
        }
        return this.baseObject.getPosition();
    },

    setEdgeCollision: function (num) {
        this.atrb.edgeCollision = typeof num !== 'undefined' ? num : 0;
    },

    setEdgeCollisionWithoutBottom: function (open) {
        this.atrb.edgeCollisionWithoutBottom = typeof open !== 'undefined' ? open : false;
    },

    runScale: function (st, time, curScale) {
        // curScale=typeof curScale!=='undefined'?curScale:false;
        // let obj = null;
        // if (this.objectType == Defines.ObjectType.OBJ_MONSTER) {
        //     obj = GlobalVar.tblApi.getDataBySingleKey('TblBattleMonster', this.objectID);
        // } else {
        //     obj = GlobalVar.tblApi.getDataBySingleKey('TblBattleBullet', this.objectID);
        // }
        // if (!obj) {
        //     return;
        // }
        // let origin=obj.dScale;
        // if(curScale){
        //     origin=this.scaleX;
        // }
        this.atrb.scaleToDelta = (st - this.scaleX) / (time / Defines.BATTLE_FRAME_SECOND);
        this.atrb.scaleToLeftTime = time;
    },
    runOpacity: function (ot, time) {
        this.atrb.opacityToDelta = (ot - this.opacity) / (time / Defines.BATTLE_FRAME_SECOND);
        this.atrb.opacityToLeftTime = time;
    },

    useSkill: function (skillId) {
        let tblSkill = GlobalVar.tblApi.getDataBySingleKey('TblBattleSkill', skillId);
        if (!tblSkill) {
            return;
        }

        let func = require('BulletMapping').getSolution(tblSkill.dwSolution);
        if (func) {
            func(this, tblSkill.oVecBulletIDs, tblSkill.scale);
        }
    },

    hitWithDamage: function (dmg) {
        if (this.hp > dmg) {
            this.hp -= dmg;
        } else {
            this.hp = 0;
            this.isDead = true;
        }
    },

    getCollider: function () {
        if (this.baseObject != null) {
            if (this.baseObject.getComponent(cc.BoxCollider) != null) {
                return this.baseObject.getComponent(cc.BoxCollider);
            }
        }
        return null;
    },

    addMotionStreak: function (res, addTail, tailPos, color, fadeTime, minSeg, stroke, fastMode) {
        if (this.motionNode == null) {
            this.motionNode = new MotionNode();
            this.motionNode.initMotion(res, tailPos, color, fadeTime, minSeg, stroke, fastMode);
            addTail = typeof addTail !== 'undefined' ? addTail : false;
            if (this.getChildByName('1001') == null && addTail) {
                let tail = new cc.Node();
                this.addChild(tail, 0, '1001');
                tail.setPosition(this.motionNode.tailPos);
                this.battleManager.displayContainer.addChild(this.motionNode, this.zOrder - 1);
            }
        }
    },

    //MotionStreak
    motionStreakCtrl: function (mode) {
        if (this.motionNode != null && cc.isValid(this.motionNode) && this.baseObject != null) {
            if (mode == 0) {
                //create
                if (this.getChildByName('1001') == null) {
                    let tail = new cc.Node();
                    this.addChild(tail, 0, '1001');
                    tail.setPosition(this.motionNode.tailPos);
                    this.battleManager.displayContainer.addChild(this.motionNode, this.zOrder - 1);
                }
            } else if (mode == 1) {
                //update
                if (this.getChildByName('1001') != null) {
                    let pos1 = this.convertToWorldSpace(this.getChildByName('1001').getPosition());
                    let pos = this.battleManager.displayContainer.convertToNodeSpace(pos1);
                    this.motionNode.updatePosition(pos);
                }
            } else if (mode == 2) {
                //destroy
                this.motionNode.destroy();
                if (this.getChildByName('1001') != null) {
                    this.getChildByName('1001').destroy();
                }
            }
        }
    },

    addEnemyIncoming: function (direction, posPlus, movetime, movespeed, dstpos, delay, callback) {
        direction = typeof direction !== 'undefined' ? direction : cc.v3(0, -1);
        posPlus = typeof posPlus !== 'undefined' ? posPlus : cc.v3(0, 0);
        delay = typeof delay !== 'undefined' ? delay : 0;
        movetime = typeof movetime !== 'undefined' ? movetime : 0;
        movespeed = typeof movespeed !== 'undefined' ? movespeed : 0;
        dstpos = typeof dstpos !== 'undefined' ? dstpos : this.getPosition().add(posPlus);

        var self = this;
        this.battleManager.addEnemyIncoming(direction, this.getPosition().add(posPlus), movetime, movespeed, dstpos, delay, callback, function (ray) {
            self.rayAnime = ray;
        });
    },

    pauseAction() {

    },

    resumeAction() {

    },

    //Timer
    setTimer: function (index, delay, count, firstrun) {
        if (index >= Defines.MAX_ENTITY_TIMER || this.selfTimer[index].active == 1) {
            return;
        }

        let timer = this.selfTimer[index];
        timer.active = 1;
        timer.delay = delay;
        timer.expire = this.battleManager.currentTime + delay;
        timer.counts = count;
        if (typeof firstrun === 'undefined') {
            timer.firstrun = 0;
        } else {
            timer.firstrun = firstrun;
        }

        this.activedTimerCount++;
    },
    setTimerHandler: function (handler) {
        this.selfTimerHandler = handler;
    },
    setInnerTimerHandler(handler) {
        this.selfInnerTimerHandler = handler;
    },
    delTimer: function (index) {
        if (!!this.selfTimer[index].active) {
            this.selfTimer[index].active = 0;
            this.activedTimerCount--;
        }
    },
    delAllTimer: function () {
        for (let i = 0; i < Defines.MAX_ENTITY_TIMER; ++i) {
            this.selfTimer[i].active = 0;
        }

        this.activedTimerCount = 0;
        this.selfTimerHandler = null;
        this.selfInnerTimerHandler = null;
    },

});