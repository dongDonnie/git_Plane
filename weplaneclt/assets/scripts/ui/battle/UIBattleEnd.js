const GlobalVar = require("globalvar");
const UIBase = require("uibase");
const SceneDefines = require("scenedefines");
const BattleDefines = require('BattleDefines');
const BattleManager = require('BattleManager');
const EventMsgID = require("eventmsgid")
const GameServerProto = require("GameServerProto");
const md5 = require("md5");
const weChatAPI = require("weChatAPI");

const ENDLESS_STATUS_SCORE_PLUS_5 = 9;
const ENDLESS_STATUS_SCORE_PLUS_10 = 10;
const ENDLESS_STATUS_SCORE_PLUS_15 = 11;
const ENDLESS_STATUS_GOLD_DOUBLE = 5;

cc.Class({
    extends: UIBase,

    properties: {
        nodeAccountList: {
            default: [],
            type: cc.Node,
        },
        itemModel: {
            default: null,
            type: cc.Node,
        },
        canQuitUIEnd: {
            default: false,
            visible: false,
        },
        targetDatas: {
            type: [cc.Node],
            default: [],
            visible: false,
        },
        btnRecvGold: {
            default: null,
            type: cc.Button,
        },
        btnRecvShare: {
            default: null,
            type: cc.Button,
        },
        labelGetGold: {
            default: null,
            type: cc.Label,
        },
        labelTenGetGold: {
            default: null,
            type: cc.Label,
        },
        labelScoreAdd: {
            default: null,
            type: cc.Label,
        },
        nodeGetItem: {
            default: null,
            type: cc.Node,
        },
    },

    onLoad: function () {
        this.node.getComponent(cc.Widget).updateAlignment();
        this.animeStartParam(0, 0);
        this.setEndNode();
        GlobalVar.me().memberData.setOneTimeChuZhanMemberID();
    },

    animeStartParam: function (paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;
    },

    animePlayCallBack: function (name) {
        if (name == "Enter") {
            // GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_CAMP_RESULT_NTF, this.onTouchEnd, this);
            // GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_ENDLESS_RESULT_NTF, this.onTouchEnd, this);
            GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_CAMP_RESULT_NTF, this.initBattleSuccessUI, this);
            GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_ENDLESS_RESULT_NTF, this.initEndlessEndUI, this);
            this.sendBattleEndMsg();
        }
    },

    touchEnd: function (data) {
        if (this.canQuitUIEnd) {
            this.node.destroy();
            if (this.nodeAccountList[1].active) {
                BattleManager.getInstance().gameState = BattleDefines.GameResult.CARD
            } else {
                GlobalVar.sceneManager().gotoScene(SceneDefines.MAIN_STATE);
            }
        }
    },

    sendBattleEndMsg: function () {
        if (this.nodeAccountList[1].active) {
            GlobalVar.handlerManager().campHandler.sendCampResultReq(1);
        } else if (this.nodeAccountList[0].active) {
            GlobalVar.handlerManager().campHandler.sendCampResultReq(0);
        } else if (this.nodeAccountList[2].active) {
            let bmgr = BattleManager.getInstance();
            let battleMsg = bmgr.battleMsg;
            let endlessScore = bmgr.endlessScore;
            if (bmgr.battleMsg.BattleBlessStatusID == ENDLESS_STATUS_SCORE_PLUS_5){
                endlessScore = parseInt(endlessScore * 1.05);
            }else if (bmgr.battleMsg.BattleBlessStatusID == ENDLESS_STATUS_SCORE_PLUS_10){
                endlessScore = parseInt(endlessScore * 1.1);
            }else if (bmgr.battleMsg.BattleBlessStatusID == ENDLESS_STATUS_SCORE_PLUS_15){
                endlessScore = parseInt(endlessScore * 1.15);
            }
            let tokenStr = "%d:%d:%d:%d:%d#cdss0dfsd35Cs"; //m_stStat.m_dwSeed, m_stStat.m_byBlessStatusID, m_stStat.m_byDieCount, rstReq.m_nScore, rstReq.m_byPackageCount);
            tokenStr = tokenStr.replace("%d", GlobalVar.me().endlessData.getSeed()).replace("%d", battleMsg.BattleBlessStatusID).replace("%d", GlobalVar.me().campData.getBattleDieCount()).replace("%d", endlessScore).replace("%d", bmgr.endlessGetChsetCount)
            let token = md5.MD5(tokenStr);
            GlobalVar.handlerManager().endlessHandler.sendEndlessEndBattleReq(endlessScore, 0, bmgr.endlessGetChsetCount, token);
            if (cc.sys.platform == cc.sys.WECHAT_GAME) {
                let historyMaxScore = GlobalVar.me().endlessData.getHistoryMaxScore();
                console.log("my history max score:", historyMaxScore, "  cur round score: ", endlessScore);
                if (endlessScore >= historyMaxScore) {
                    weChatAPI.submitUserData("score", endlessScore);
                }
            }
            let rankID = GlobalVar.me().endlessData.getRankID();
            if (rankID == 0){
                rankID = 1;
            }
            let nextModeData = GlobalVar.tblApi.getDataBySingleKey('TblEndlessRank', rankID + 1);
            if (nextModeData && endlessScore >= nextModeData.nScoreReq){
                GlobalVar.handlerManager().endlessHandler.sendEndlessRankUpReq();
            }

            if (bmgr.endlessGetChsetCount > 0){
                GlobalVar.me().endlessData.getChestFlag = true;
            }
        }
    },

    onTouchEnd: function () {
        // cc.log('battleend');

        GlobalVar.sceneManager().gotoScene(SceneDefines.MAIN_STATE);
    },

    setEndNode: function () {
        let data = null;
        this.node.getChildByName("btnEnd").active = true;
        let index = BattleManager.getInstance().result;
        let spriteTip = this.nodeAccountList[index].getChildByName("spriteContinueTip")
        spriteTip.active = true;
        spriteTip.runAction(cc.repeatForever(cc.sequence(cc.fadeIn(0.7), cc.fadeOut(0.7))));
        if (index == 0) {
            this.nodeAccountList[0].active = true;
            this.nodeAccountList[1].active = false;
            this.nodeAccountList[2].active = false;
            //GlobalVar.soundManager().playEffect('cdnRes/audio/battle/effect/battle_lose');
            GlobalVar.soundManager().setBGMVolume(0.5);
            GlobalVar.soundManager().playBGM('cdnRes/audio/battle/effect/battle_lose',false,function(){
                GlobalVar.soundManager().setBGMVolume(1);
            })
        } else if (index == 1) {
            this.nodeAccountList[0].active = false;
            this.nodeAccountList[1].active = true;
            this.nodeAccountList[2].active = false;
            //GlobalVar.soundManager().playEffect('cdnRes/audio/battle/effect/battle_win');
            GlobalVar.soundManager().setBGMVolume(0.5);
            GlobalVar.soundManager().playBGM('cdnRes/audio/battle/effect/battle_win',false,function(){
                GlobalVar.soundManager().setBGMVolume(1);
            })
        } else if (index == 2) {
            this.nodeAccountList[0].active = false;
            this.nodeAccountList[1].active = false;
            this.nodeAccountList[2].active = true;
            this.node.getChildByName("btnEnd").active = false;
            //GlobalVar.soundManager().playEffect('cdnRes/audio/battle/effect/battle_win');
            GlobalVar.soundManager().setBGMVolume(0.5);
            GlobalVar.soundManager().playBGM('cdnRes/audio/battle/effect/battle_win',false,function(){
                GlobalVar.soundManager().setBGMVolume(1);
            })
            this.initEndlessEndUINew();
        } else {
            this.nodeAccountList[0].active = false;
            this.nodeAccountList[1].active = false;
            this.nodeAccountList[2].active = false;
        }
    },

    initBattleFailUI: function (event) {
        // console.log("initBattleFailUI data = ", event);
        this.canQuitUIEnd = true;
        GlobalVar.sceneManager().gotoScene(SceneDefines.MAIN_STATE);
    },

    initBattleSuccessUI: function (event) {
        // console.log("initBattleSuccessUI data = ", event);
        if (event.ErrCode == GameServerProto.PTERR_SUCCESS) {
            if (event.OK.Result == 1) {
                let winData = event.OK.Win;
                let nodeBattleWin = this.nodeAccountList[1];
                let stars = nodeBattleWin.getChildByName("spriteClearingBg").children;
                for (let i = 0; i < stars.length; i++) {
                    if ((i + 1) <= winData.Star) {
                        stars[i].runAction(cc.sequence(cc.delayTime(0.3 * (i + 1)), cc.callFunc(() => {
                            stars[i].setScale(2);
                            stars[i].getChildByName("spriteStarGet").active = true;
                            GlobalVar.soundManager().playEffect('cdnRes/audio/battle/effect/battle_end_getstar');
                            stars[i].runAction(cc.sequence(cc.scaleTo(0.15, 1), cc.callFunc(()=>{
                            })));
                        })))
                    }
                }
                let spriteObtainBg = nodeBattleWin.getChildByName("spriteObtainBg");

                let getExp = winData.RewardExp;
                let getGold = winData.RewardGold;
                if (winData.FirstRewardFlag){
                    getExp += winData.FirstReward.RewardExp;
                    getGold += winData.FirstReward.RewardGold;
                }
                let nodeRewardExp = {
                    target: spriteObtainBg.getChildByName("spriteExp").getChildByName("labelExpData"),
                    startScore: 0,
                    targetScore: getExp,
                };
                this.targetDatas.push(nodeRewardExp);
                let nodeRewardGold = {
                    target: spriteObtainBg.getChildByName("spriteGold").getChildByName("labelGoldData"),
                    startScore: 0,
                    targetScore: getGold,
                };
                this.targetDatas.push(nodeRewardGold);

                spriteObtainBg.getChildByName("labelLevel").getChildByName("labelLevelData").getComponent(cc.Label).string = GlobalVar.me().level;
                spriteObtainBg.getChildByName("labelLevel").getChildByName("labelLevelData").active = true;
                // spriteObtainBg.getChildByName("spriteExp").getChildByName("labelExpData").getComponent(cc.Label).string = winData.RewardExp;
                // spriteObtainBg.getChildByName("spriteGold").getChildByName("labelGoldData").getComponent(cc.Label).string = winData.RewardGold;

                if (winData.FirstRewardFlag){
                    for(let i = 0; i< winData.FirstReward.RewardItem.length; i++){
                        let item = cc.instantiate(this.itemModel);
                        item.opacity = 255;
                        this.nodeGetItem.addChild(item);
                        item.getComponent("ItemObject").updateItem(winData.FirstReward.RewardItem[i].ItemID, winData.FirstReward.RewardItem[i].Count);
                        item.getChildByName('firstreward').active = true;
                    }
                }
                for(let i = 0; i< winData.RewardItem.length; i++){
                    let item = cc.instantiate(this.itemModel);
                    item.opacity = 255;
                    this.nodeGetItem.addChild(item);
                    item.getComponent("ItemObject").updateItem(winData.RewardItem[i].ItemID, winData.RewardItem[i].Count);
                    item.getChildByName('firstreward').active = false;
                }

                this.nodeGetItem.getComponent(cc.Layout).updateLayout();    
            }
        } else {
            GlobalVar.comMsg.errorWarning(event.ErrCode);
        }
        this.canQuitUIEnd = true;
    },


    initEndlessEndUI: function (event) {
        // console.log("initEndlessEndUI data = ", event);
        this.canQuitUIEnd = true;
        if (event.ErrCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
    },

    initEndlessEndUINew: function () {
        let nodeEndless = this.nodeAccountList[2];
        if (!GlobalVar.getShareSwitch()){
            nodeEndless.getChildByName("nodeRecvGold").active = false;
            nodeEndless.getChildByName("spriteContinueTip").active = true;
            this.node.getChildByName("btnEnd").active = true;
        }else {
            nodeEndless.getChildByName("nodeRecvGold").active = true;
            nodeEndless.getChildByName("spriteContinueTip").active = false;
            this.node.getChildByName("btnEnd").active = false;
        }

        let rewardData = GlobalVar.tblApi.getDataBySingleKey('TblEndlessRank', GlobalVar.me().endlessData.getRankID());
        let itemObj = nodeEndless.getChildByName("spriteHintBg").getChildByName("spriteTreasureBoxBg").getChildByName("ItemBox").getComponent("ItemObject");
        itemObj.updateItem(rewardData.wRewardItem);
        itemObj.setSpriteEdgeVisible(false);

        let bmgr = BattleManager.getInstance();
        let obtainScore = bmgr.endlessScore;
        let historyMaxScore = GlobalVar.me().endlessData.getHistoryMaxScore();
        let weekMaxScore = GlobalVar.me().endlessData.getWeekMaxScore();
        if (bmgr.battleMsg.BattleBlessStatusID == ENDLESS_STATUS_SCORE_PLUS_5){
            obtainScore = parseInt(obtainScore * 1.05);
            this.labelScoreAdd.string = "5%";
        }else if (bmgr.battleMsg.BattleBlessStatusID == ENDLESS_STATUS_SCORE_PLUS_10){
            obtainScore = parseInt(obtainScore * 1.1);
            this.labelScoreAdd.string = "10%";
        }else if (bmgr.battleMsg.BattleBlessStatusID == ENDLESS_STATUS_SCORE_PLUS_15){
            obtainScore = parseInt(obtainScore * 1.15);
            this.labelScoreAdd.string = "15%";
        }

        let nodeScoreObtain = {
            target: nodeEndless.getChildByName("spriteClearingBg").getChildByName("labelObtainScore"),
            startScore: 0,
            targetScore: obtainScore,
        };
        this.targetDatas.push(nodeScoreObtain);
        let nodeHistoryScore = {
            target: nodeEndless.getChildByName("spriteHintBg").getChildByName("nodeScore").getChildByName("labelRecordScore"),
            startScore: 0,
            targetScore: historyMaxScore > obtainScore ? historyMaxScore : obtainScore,
        };
        this.targetDatas.push(nodeHistoryScore);
        let nodeChest = {
            target: nodeEndless.getChildByName("spriteHintBg").getChildByName("labelChest").getChildByName("labelTreasureBoxCount"),
            startScore: 0,
            targetScore: bmgr.endlessGetChsetCount,
        };
        this.targetDatas.push(nodeChest);

        if (obtainScore >= weekMaxScore) {
            nodeEndless.getChildByName("spriteHintBg").getChildByName("spriteWeeklySign").active = true;
        } else {
            nodeEndless.getChildByName("spriteHintBg").getChildByName("spriteWeeklySign").active = false;
        }


        if (!GlobalVar.getShareSwitch()){
            nodeEndless.getChildByName("nodeRecvGold").active = false;
            nodeEndless.getChildByName("spriteContinueTip").active = true;
            this.node.getChildByName("btnEnd").active = true;
            return;
        }else{

        }

        let NORMAL_GET = 0, TEN_GET = 1;

        let todayMaxGold = GlobalVar.tblApi.getDataBySingleKey('TblParam', GameServerProto.PTPARAM_ENDLESS_GOLD_DAYMAX).dValue;
        
        let todayCanGetGold = todayMaxGold - GlobalVar.me().endlessData.getTodayGold();
        if (todayCanGetGold > 0){
            nodeEndless.getChildByName("nodeRecvGold").active = true;
            nodeEndless.getChildByName("spriteContinueTip").active = false;
            this.labelGetGold.string = this.getCanGetGold(obtainScore, NORMAL_GET);
            this.labelTenGetGold.string = this.getCanGetGold(obtainScore, TEN_GET);
        }else{
            nodeEndless.getChildByName("nodeRecvGold").active = false;
            nodeEndless.getChildByName("spriteContinueTip").active = true;
            this.node.getChildByName("btnEnd").active = true;
        }
    },

    getCanGetGold: function (score, mode) {
        let NORMAL_GET = 0, TEN_GET = 1;
        let maxGold = GlobalVar.tblApi.getDataBySingleKey('TblParam', GameServerProto.PTPARAM_ENDLESS_GOLD_DAYMAX).dValue;
        let getGold = parseInt((1000 * score) / (score + 120000));
        let todayCanGetGold = maxGold - GlobalVar.me().endlessData.getTodayGold();
        getGold = getGold * 5;
        let bmgr = BattleManager.getInstance();
        for (let i = 0; i< bmgr.battleMsg.BattleStatus.length; i++){
            if (bmgr.battleMsg.BattleStatus[i].StatusID == ENDLESS_STATUS_GOLD_DOUBLE){
                getGold *= 2;
            }
        }
        getGold = getGold > todayCanGetGold ? todayCanGetGold : getGold;
        getGold = getGold > 10000 ? 10000 : getGold;
        if (mode == NORMAL_GET) {
            getGold = parseInt(getGold/5);
        }
        return getGold;
    },

    onRecvGoldBtnClick: function (event, index) {
        if (this.alreadRecvGoldBtnClick){
            return;
        }
        let self = this;
        let NORMAL_GET = 0, TEN_GET = 1;
        let getGold = 0;
        if (index == NORMAL_GET){
            this.alreadRecvGoldBtnClick = true;
            getGold = parseInt(this.labelGetGold.string);
            GlobalVar.handlerManager().endlessHandler.sendEndlessGetGoldReq(getGold);
            setTimeout(() => {
                GlobalVar.sceneManager().gotoScene(SceneDefines.MAIN_STATE);
            }, 1000);
        }else{
            getGold = parseInt(this.labelTenGetGold.string);

            let nodeEndless = this.nodeAccountList[2];
            if (cc.sys.platform == cc.sys.WECHAT_GAME){
                weChatAPI.shareNormal(107, function () {
                    self.alreadRecvGoldBtnClick = true;
                    nodeEndless.getChildByName("nodeRecvGold").active = false;
                    nodeEndless.getChildByName("nodeGet").getChildByName("labelGetValue").getComponent(cc.Label).string = getGold;
                    nodeEndless.getChildByName("nodeGet").active = true;
                    nodeEndless.getChildByName("spriteContinueTip").active = true;
                    self.node.getChildByName("btnEnd").active = true;
                    GlobalVar.handlerManager().endlessHandler.sendEndlessGetGoldReq(getGold);
                    // GlobalVar.sceneManager().gotoScene(SceneDefines.MAIN_STATE);
                });
            }else{
                this.alreadRecvGoldBtnClick = true;
                nodeEndless.getChildByName("nodeRecvGold").active = false;
                nodeEndless.getChildByName("nodeGet").getChildByName("labelGetValue").getComponent(cc.Label).string = getGold;
                nodeEndless.getChildByName("nodeGet").active = true;
                nodeEndless.getChildByName("spriteContinueTip").active = true;
                this.node.getChildByName("btnEnd").active = true;
                GlobalVar.handlerManager().endlessHandler.sendEndlessGetGoldReq(getGold);
            }

        }
    },

    update(dt) {
        for (let i = 0; i < this.targetDatas.length; i++) {
            // this.updateScore(this.targetDatas[i].target, this.targetDatas[i].startScore, this.targetDatas[i].targetScore);
            this.updateScore(this.targetDatas[i]);
        }
    },

    updateScore: function (targetData) {

        if (typeof targetData.plusScore == 'undefined') {
            targetData.plusScore = Math.ceil((targetData.targetScore - targetData.startScore) / (1 / BattleDefines.BATTLE_FRAME_SECOND));
            targetData.curScore = 0;
        }

        if (targetData.plusScore != 0) {
            targetData.curScore += targetData.plusScore;
            if (targetData.curScore >= targetData.targetScore) {
                targetData.curScore = targetData.targetScore;
                targetData.plusScore = 0;
            }
            targetData.target.getComponent(cc.Label).string = targetData.curScore;
        }
    },

    onDestroy: function () {
        GlobalVar.eventManager().removeListenerWithTarget(this);
    },
});