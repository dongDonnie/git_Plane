const GlobalVar = require("globalvar");
const UIBase = require("uibase");
const SceneDefines = require("scenedefines");
const GameServerProto = require("GameServerProto");
const WndTypeDefine = require("wndtypedefine");

cc.Class({
    extends: UIBase,

    properties: {
        nodeAccountList: {
            default: [],
            type: [cc.Node],
        },
        nodeArenaFailed: {
            default: null,
            type: cc.Node,
        },
        nodeArenaSuccess: {
            default: null,
            type: cc.Node,
        },
        labelOldRank: {
            default: null,
            type: cc.Label,
        },
        labelNewRank: {
            default: null,
            type: cc.Label,
        },
        labelSuccessGetPoint: {
            default: null,
            type: cc.Label,
        },
        labelFailGetPoint: {
            default: null,
            type: cc.Label,
        },
    },

    onLoad: function () {
        this.node.getComponent(cc.Widget).updateAlignment();
        this.animeStartParam(0, 0);
        this.setEndNode();
    },

    animeStartParam: function (paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;
    },

    animePlayCallBack: function (name) {
        if (name == "Enter") {

        }
    },

    touchEnd: function (data) {
        GlobalVar.sceneManager().gotoScene(SceneDefines.MAIN_STATE);
    },

    setEndNode: function () {
        this.node.getChildByName("btnEnd").active = true;
        let challengeData = GlobalVar.me().arenaData.getArenaChallengeData();
        let index = challengeData.ChallengeResult - 1;
        let spriteTip = this.nodeAccountList[index].getChildByName("spriteContinueTip")
        let spriteLight = this.nodeAccountList[index].getChildByName("spriteBackLight");
        spriteLight.runAction(cc.repeatForever(cc.rotateBy(8, 360)));
        spriteTip.active = true;
        spriteTip.runAction(cc.repeatForever(cc.sequence(cc.fadeIn(0.7), cc.fadeOut(0.7))));
        if (index == 0) {
            this.nodeAccountList[0].active = true;
            this.nodeAccountList[1].active = false;
            //GlobalVar.soundManager().playEffect('cdnRes/audio/battle/effect/battle_lose');
            GlobalVar.soundManager().setBGMVolume(0.5);
            GlobalVar.soundManager().playBGM('cdnRes/audio/battle/effect/battle_win', false, function () {
                GlobalVar.soundManager().setBGMVolume(1);
            })
            this.initSuccessWnd(challengeData.OldRanking, challengeData.NewRanking); //需要传数据
        } else if (index == 1) {
            this.nodeAccountList[0].active = false;
            this.nodeAccountList[1].active = true;
            //GlobalVar.soundManager().playEffect('cdnRes/audio/battle/effect/battle_win');
            GlobalVar.soundManager().setBGMVolume(0.5);
            GlobalVar.soundManager().playBGM('cdnRes/audio/battle/effect/battle_lose', false, function () {
                GlobalVar.soundManager().setBGMVolume(1);
            })
            this.initFailWnd(); //需要传数据
        } else {
            this.nodeAccountList[0].active = false;
            this.nodeAccountList[1].active = false;
        }
    },

    initSuccessWnd: function (oldRank, newRank) {
        // 需要数据
        this.labelOldRank.string = oldRank;
        this.labelNewRank.string = newRank;
        // let challengeData = GlobalVar.me().arenaData.getArenaChallengeData();
        // this.labelSuccessGetPoint.string = challengeData.PointsReward;
        this.labelSuccessGetPoint.string = GameServerProto.PT_ARENA_CHALLENGE_WIN_POINTS;
    },

    initFailWnd: function () {
        this.labelFailGetPoint.stirng = GameServerProto.PT_ARENA_CHALLENGE_LOSE_POINTS;
    },

    onBtnGoToLevelUpEquip: function () {
        GlobalVar.windowManager().record = WndTypeDefine.WindowType.E_DT_NORMALIMPROVEMENT_WND;
        GlobalVar.sceneManager().gotoScene(SceneDefines.MAIN_STATE);
    },

    onBtnGoToLevelUpGuaZai: function () {
        GlobalVar.windowManager().record = WndTypeDefine.WindowType.E_DT_GUAZAIMAIN_WND;
        GlobalVar.sceneManager().gotoScene(SceneDefines.MAIN_STATE);
    },

    onBtnGoToLevelUpPlane: function () {
        GlobalVar.windowManager().record = WndTypeDefine.WindowType.E_DT_NORMALPLANE_WND;
        GlobalVar.sceneManager().gotoScene(SceneDefines.MAIN_STATE);
    },

    onDestroy: function () {
        GlobalVar.eventManager().removeListenerWithTarget(this);
    },
});