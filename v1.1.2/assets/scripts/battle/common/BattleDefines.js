var BattleDefines = module.exports;

BattleDefines.PropName = cc.Enum({
    Life: 1,
    AoYiDuration: 2,
    Attack: 3,
    Defense: 4,
    CriticalDamage: 5,
    CriticalRate: 6,
    LifeAdd: 7,
    AttackAdd: 8,
    DefenseAdd: 9,
    Score: 10,
    PetAttack: 11,
    SkillAttack: 12,
    MissileAttack: 13,
    AssistAttack: 14,
    LifeGrow: 15,
    AttackGrow: 16,
    DefenseGrow: 17,
    PetGrowPercent: 18,
    SkillGrowPercent: 19,
    MissileGrowPercent: 20,
    AssistGrowPercent: 21,
    CollisionDamage: 22,
    Count: 23,
});

BattleDefines.Part = cc.Enum({
    Unknown: 0,
    Main: 1,
    Pet: 2,
    Assist: 3,
    Missile: 4,
    Skill: 5,
    Monster: 6,
    Count: 7,
});

BattleDefines.ObjectType = cc.Enum({
    OBJ_INVALID: 0,
    OBJ_HERO: 1,
    OBJ_MONSTER: 2,
    OBJ_BULLET: 3,
    OBJ_HERO_BULLET: 4,
    OBJ_MONSTER_BULLET: 5,
    OBJ_BUFF: 6,
    OBJ_OTHER: 7,
    OBJ_OPPONENT: 8,
    OBJ_FAKE: 9,
    OBJ_FAKE_HERO: 10,
    OBJ_FAKE_ENVIEONMENT: 11,
    OBJ_WINGMAN: 12,
    OBJ_ASSIST: 13,
    OBJ_EXECUTE: 14,
    OBJ_SUNDRIES: 15,
    OBJ_GOLD: 16,
    OBJ_SELF: 17,
    OBJ_RIVAL: 18,
    OBJ_SELF_GUAZAI: 19,
    OBJ_RIVAL_GUAZAI: 20,
    OBJ_FAKE_SELF: 21,
    OBJ_FAKE_RIVAL: 22,
    OBJ_SELF_BULLET: 23,
    OBJ_RIVAL_BULLET: 24,
});

BattleDefines.BulletType = cc.Enum({
    BULLET_MASTER: 0,
    BULLET_SLAVE: 1,
});

BattleDefines.MgrType = cc.Enum({
    FACTORY: 0,
    ENTITY: 1,
    HERO: 2,
    SCENARIO: 3,
});

BattleDefines.PoolType = cc.Enum({
    BULLET: 0,
    MONSTER: 1,
    BUFF: 2,
    PRODUCTLINE: 3,
    EXECUTE: 4,
    SUNDRIES: 5,
});

BattleDefines.MonsterType = cc.Enum({
    MT_NONE: 0,
    MT_WEAK: 1,
    MT_SMALL: 2,
    MT_CAPTAIN: 3,
    MT_ELITE: 4,
    MT_BOSS: 5,
    MT_SUPERBOSS: 6,
    MT_OBJECT: 7,
});

BattleDefines.CAMPAIGNTIMEOUT = 360;
BattleDefines.MAX_ENTITY_TIMER = 50;
BattleDefines.BATTLE_FPS = 60;
BattleDefines.BATTLE_FRAME_SECOND = 1.0 / 60.0;
BattleDefines.PI = 3.1415926;
BattleDefines.OUT_SIDE = 150;
BattleDefines.FORCE_DESTORY = 400;
BattleDefines.DEFAULT_INTERVAL = 3;
BattleDefines.INVINCIBLE_TIME = 1.6;
BattleDefines.PROTECT_TIME = 7.0;
BattleDefines.DASH_TIME = 8.0;
BattleDefines.MAX_COUNT = 99999999;
BattleDefines.SKILLCD = 5;
BattleDefines.ASSISTCD = 120;
BattleDefines.CRAZYCOUNT = 5;
BattleDefines.DEMOCOUNT = 3;
BattleDefines.FRIENDDURATION = 30.0;
BattleDefines.REVIVECOUNTCAMPAIGN = 3;
BattleDefines.REVIVECOUNTENDLESS = 2;

BattleDefines.GameResult = cc.Enum({
    NONE: 0,
    START: 1,
    READY: 2,
    RUNNING: 3,
    INTERRUPT: 4,
    PREPARE: 5,
    PAUSE: 6,
    RESUME: 7,
    END: 8,
    SUCCESS: 9,
    FAILED: 10,
    FLYOUT: 11,
    CARD: 12,
    DEADDELAY: 13,
    REVIVE: 14,
    WAITREVIVE: 15,
    RESTART: 16,
    DASHSTART: 17,
    DASH: 18,
    DASHEND: 19,
    DASHOPEN: 20,
    SHOW: 21,
    GETASSIST: 22,
    COUNT: 23,
});

BattleDefines.GroupStatus = cc.Enum({
    READY: 0,
    GEN: 1,
    PAUSE: 2,
    ING: 3,
    WAITTING: 4
});

BattleDefines.MsgID = cc.Enum({
    PLANE_IN_POSITION: "PLANE_IN_POSITION",
    GAME_RESULT: "GAME_RESULT"
});

BattleDefines.Z = cc.Enum({
    SUNDRIES: 3,
    RAY: 4,
    KILL: 5,
    MONSTER: 6,
    MONSTERHP: 7,
    FIGHTERBULLET: 8,
    FIGHTER: 9,
    BARRIER: 10,
    ASSISTBULLET: 11,
    ASSIST: 12,
    WINGMANBULLET: 13,
    WINGMAN: 14,
    MISSILE: 15,
    BUFF: 16,
    CHEST: 17,
    CRTSTAL: 18,
    MONSTERBULLET: 19,
    MONSTERBULLETCLEAR: 20,
    MONSTERBULLETHIT: 21,
    HEROBULLETHIT: 22,
    FLYDAMAGEMSG: 23,
    INVICIBLE: 24,
    EXECUTESHADOW: 25,
    EXECUTE: 26,
    BOMBER: 27,
    UNDEFEAT: 28,
    WARNING: 29,
});

BattleDefines.Assist = {
    WEAPON_UP: 10000,
    SUPER: 10001,
    PROTECT: 10002,
    HP: 10003,
    MP: 10004,
    MAGNET: 10005,
    DASH: 10006,
    GHOST: 10007,
    GREENSTONE: 20000,
    BLUESTONE: 20001,
    PURPERSTONE: 20002,
    GOLD: 30000,
    CHEST1: 30001,
    CHEST2: 30002,
    CHEST3: 30003,
    CHEST4: 30004,
    CHEST5: 30005,
    CHEST6: 30006,
    CHEST7: 30007,
    CHEST8: 30008,
    CHEST9: 30009,
    STONYSMALL: 40000,
    STONYMIDDLE: 40001,
    STONYBIG: 40002,
    WALLDARK: 40003,
    WALLNEBULA: 40004,
    WALLLIGHT: 40005,

    CONTINOUS_KILL_DURATION: 3, //连续击杀计算时间
    INSTANT_KILL_DURATION: 1.3, //瞬杀十人计算时间

    ////战斗掉落规则：走类正态分布，Boss房间内不掉落
    DROP_ITEM_LOWEST: 3, //掉落最低时间限制
    //武器升阶参数
    DROP_WEAPONUP_FIRST_MEAN: 5, //前三次掉落时间间隔期望
    DROP_WEAPONUP_FIRST_VAR: 2, //前三次掉落时间间隔标准差
    DROP_WEAPONUP_MEAN: 14,
    DROP_WEAPONUP_VAR: 3,
    //暴走S弹参数
    DROP_BAOZOU_MEAN: 28, //暴走S弹掉落间隔时间期望
    DROP_BAOZOU_VAR: 5, //标准差
    //保护盾
    DROP_PROTECTIVE_MEAN: 39,
    DROP_PROTECTIVE_VAR: 7,
    //回血
    DROP_HPCURE_MEAN: 43,
    DROP_HPCURE_VAR: 10,
    //MP恢复
    DROP_MP_MEAN: 36,
    DROP_MP_VAR: 6,
    //魂
    DROP_GHOST_MEAN: 4,
    DROP_GHOST_VAR: 3,

    ////Boss房间内掉落
    DROP_BOSSROOM_WEAPONUP_MEAN: 12,
    DROP_BOSSROOM_WEAPONUP_VAR: 0.01,

};