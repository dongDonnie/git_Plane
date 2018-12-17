const WindowManager = require("windowmgr");
const WndTypeDefine = require("wndtypedefine");
const RootBase = require("RootBase");
const GlobalVar = require('globalvar')
const EventMsgID = require("eventmsgid");
const GameServerProto = require("GameServerProto");
const CommonWnd = require("CommonWnd");
const BattleManager = require('BattleManager');
const SceneDefines = require("scenedefines");
const GlobalFunc = require('GlobalFunctions');
const i18n = require('LanguageData');
const weChatAPI = require("weChatAPI");

const MODE_COLOR = [
    [125, 255, 94],
    [125, 255, 94],
    [17, 203, 255],
    [236, 82, 255],
    [251, 209, 60],
    [255, 73, 43],
    [255, 233, 43],
]


cc.Class({
    extends: RootBase,

    properties: {
        plusModel: {
            default: null,
            type: cc.Node,
        },
        plusScroll: {
            default: null,
            type: cc.ScrollView,
        },
        labelHistoryHighestScore: {
            default: null,
            type: cc.Label,
        },
        labelWeekHighestScore: {
            default: null,
            type: cc.Label,
        },
        labelBlessEffectName: {
            default: null,
            type: cc.Label,
        },
        btnYellowAnime: {
            default: null,
            type: cc.Node,
        },
        btnOrangeAnime: {
            default: null,
            type: cc.Node,
        },
        plusList: [],
        endlessRankID: null,
    },

    onLoad: function () {
        this._super();
        i18n.init('zh');
        this.canBuyBless = true;
        this.typeName = WndTypeDefine.WindowType.E_DT_ENDLESS_CHALLENGE_VIEW;
        this.content = this.plusScroll.content; 
        this.animeStartParam(0);        
        if (GlobalFunc.isAllScreen() && !this.fixViewComplete) {
            this.fixViewComplete = true;
            this.fixView();
        }

        this.addPrefabsText();

        this.countDownTimerID = -1;

        this.btnGameStart = this.node.getChildByName("nodeBottom").getChildByName("btnGameStart");

        this.bShowUseRewardTip = false;
    },

    animeStartParam(num) {
        this.node.opacity = num;

        if (num == 0 || num == 255){
            this.node.getChildByName("nodeTop").active = false;
            this.node.getChildByName("nodeCenter").active = false;
            this.node.getChildByName("nodeBottom").active = false;
        }
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            GlobalVar.eventManager().removeListenerWithTarget(this);
            if (this.countDownTimerID != -1){
                GlobalVar.gameTimer().delTimer(this.countDownTimerID)
                this.countDownTimerID = -1;
            }
            if (this.bShowUseRewardTip){
                this.bShowUseRewardTip = false;
                CommonWnd.showItemBag(-1, null, null, null, 1);
            }else if (!this.deleteMode) {
                let TYPE_RANKING_QUEST = 0, TYPE_RANKING_ENDLESS = 1;
                WindowManager.getInstance().insertView(WndTypeDefine.WindowType.E_DT_RANKINGLIST_VIEW, WndTypeDefine.WindowType.E_DT_NORMALROOT_WND, function (wnd, name, type) {
                    wnd.getComponent(type).setRankingType(TYPE_RANKING_ENDLESS);
                }, true, false);
            } else {
                let uiNode = cc.find("Canvas/UINode");
                
                BattleManager.getInstance().quitOutSide();
                BattleManager.getInstance().startOutside(uiNode.getChildByName('UIMain').getChildByName('nodeBottom').getChildByName('planeNode'),GlobalVar.me().memberData.getStandingByFighterID(),true);
            }
            this.bShowUseRewardTip = false;
        } else if (name == "Enter") {
            this._super("Enter");
            this.deleteMode = false;
            BattleManager.getInstance().quitOutSide();
            this.deleteMode = false;
            this.registerEvent();


            // let curMode = GlobalVar.me().endlessData.getEndlessMode();
            // let labelCurMode = this.node.getChildByName("nodeCenter").getChildByName("labelCurMode");
            // labelCurMode.color = new cc.Color(MODE_COLOR[curMode][0], MODE_COLOR[curMode][1], MODE_COLOR[curMode][2]);
            // labelCurMode.getComponent(cc.Label).string = i18n.t('endlessModeText.' + curMode);

            
            this.node.getChildByName("nodeTop").active = true;
            this.node.getChildByName("nodeCenter").active = true;
            this.node.getChildByName("nodeBottom").active = true;


            if (this.bShowUseRewardTip){
                this.showRewardTip();
            }
        }
    },

    registerEvent: function(){
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_ENDLESS_DATA, this.initEndlessView, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_SHOW_BLESS, this.showBlessDesc, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_SETSTATUS_COUNT, this.setStatusCount, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_ENDLESS_START_BATTLE, this.startEndlessBattle, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_ENDLESS_RANK_UP_NTF, this.getRankUpResult, this);
        GlobalVar.handlerManager().endlessHandler.sendEndlessGetBagReq();
    },

    judgeHaveRewardBox: function () {
        if (GlobalVar.me().endlessData.getChestFlag){
            GlobalVar.me().endlessData.getChestFlag = false;
            this.bShowUseRewardTip = true;
        }
    },

    showRewardTip: function (data) {
        let self = this;
        CommonWnd.showMessage(null, CommonWnd.bothConfirmAndCancel, i18n.t('label.4000216'), i18n.t('label.4000264'), function(){
            self.bShowUseRewardTip = false;
        }, function(){
            self.animePlay(0);
        }, function () {
            self.bShowUseRewardTip = false;
        });
    },

    setCountDown: function () {
        let lastPowerTime = GlobalVar.me().endlessData.getEndlesslastPowerTime();
        let labelCountDown = this.node.getChildByName("nodeCenter").getChildByName("labelGetChestLeftTIme").getComponent(cc.Label)
        if (lastPowerTime == 0){
            labelCountDown.node.active = false;
            labelCountDown.string = "00:00";
            return;
        }
        labelCountDown.node.active = true;
        let countDownFunc = function () {
            let curTime = GlobalVar.me().serverTime;
            let leftAddTime = 3600 - (curTime - lastPowerTime);
            let leftMinute = parseInt(leftAddTime/60);
            let leftSecond = leftAddTime - leftMinute * 60;
            if (leftMinute.toString().length == 1) leftMinute = "0" + leftMinute;
            if (leftSecond.toString().length == 1) leftSecond = "0" + leftSecond;
            labelCountDown.string = leftMinute + ":" + leftSecond;      
        };
        countDownFunc();
        this.countDownTimerID = GlobalVar.gameTimer().startTimer(function () {
            countDownFunc();
        }, 1);
    },

    enter: function (isRefresh) {
        if (isRefresh) {
            this._super(true);
        } else {
            this._super(false);
        }
    },

    escape: function (isRefresh) {
        if (isRefresh) {
            this._super(true);
        } else {
            this._super(false);
        }
    },

    fixView: function () {
        let bottomWidget = this.node.getChildByName("nodeBottom").getComponent(cc.Widget);
        bottomWidget.bottom += 80;
        bottomWidget.updateAlignment();

        let centerWidget = this.node.getChildByName("nodeCenter").getComponent(cc.Widget);
        centerWidget.bottom += 100;
        centerWidget.updateAlignment();
    },

    addPrefabsText: function () {

        let plusDataList = GlobalVar.tblApi.getData('TblEndlessStatus');
        let length = GlobalVar.tblApi.getLength("TblEndlessStatus");
        
        for (let i = 1; i <= length; i++) { // 遍历表，用表中数据初始化加成列表
            let plusData = plusDataList[i]
            if (!plusData) break;  //分数加成的ID和其他加成的ID有间断，在ID不存在时打断循环，避免在列表中加入分数加成的EndlessPlusObject

            let plus = cc.instantiate(this.plusModel);
            this.content.addChild(plus);
            this.updatePlus(plus, plusData);
            // this.plusList.push(plus);
            this.plusList[plusData.byStatusID] = plus;

            
            if (!GlobalVar.getShareSwitch()){
                // plus.getChildByName("btnShare").active = true;
                // plus.getChildByName("nodeBuy").x -= 30;
                // plus.getChildByName("nodeBuy").width = 110;
                plus.getChildByName("nodeBuy").active = true;
                plus.getChildByName("btnShare").active = false;
            }else{
                plus.getChildByName("nodeBuy").active = false;
                plus.getChildByName("btnShare").active = true;
                plus.getChildByName("btnShare").y = 0;
            }
        }

        // this.setBlessPlusObject();
    },

    updatePlus(plus, data){
        plus.data = data;
        plus.opacity = 255;
        plus.x = 0;
        let icon = plus.getChildByName("ItemObject").getChildByName("spriteItemIcon").getComponent("RemoteSprite");
        if (data.byIcon != 1){
            // console.log("data.byIcon = ", data.byIcon);
            icon.setFrame(data.byIcon - 52);
        }

        plus.getChildByName("labelPlusName").getComponent(cc.Label).string = data.strStatusName
        plus.getChildByName("labelPlusDesc").getComponent(cc.Label).string = data.strDesc
        let nodeContent = plus.getChildByName("nodeBuy").getChildByName("nodeContent");
        nodeContent.getChildByName("spriteCostIcon").getComponent("RemoteSprite").setFrame(data.stCost.byType - 1)
        nodeContent.getChildByName("labelCost").getComponent(cc.Label).string = data.stCost.nCost

        let btnPurchase = plus.getChildByName("nodeBuy").getChildByName("btnPurchase");
        let nodeEffect = btnPurchase.getChildByName("nodeEffect");
        // nodeEffect.scaleX = btnPurchase.width

    },

    setBlessPlusObject: function(){
        let BLESS_ID = 1
        let plus = this.plusList[BLESS_ID];
        let data = plus.data;
        if (data.byStatusID === BLESS_ID){ 
            plus.getChildByName("btnShare").active = true;
            plus.getChildByName("nodeBuy").x -= 30;
            plus.getChildByName("nodeBuy").width = 110;
            // plus.getChildByName("nodeBuy").getComponent(cc.Widget).updateAlignment();
        }
    },

    setPlusCount(plus, count){
        if (!plus) return;
        plus.getChildByName("spriteCountBg").getChildByName("labelCount").getComponent(cc.Label).string = count;
        plus.getChildByName("spriteCountBg").active = true;
    },

    onChangeModeBtnClick: function(event){
        let labelCurMode = this.node.getChildByName("nodeCenter").getChildByName("labelCurMode");

        let self = this;
        let choosingCallBack = function(index){
            labelCurMode.color = new cc.Color(MODE_COLOR[index][0], MODE_COLOR[index][1], MODE_COLOR[index][2]);
            labelCurMode.getComponent(cc.Label).string = i18n.t('endlessModeText.' + index);
            GlobalVar.me().endlessData.setEndlessMode(index);
        };
        
        CommonWnd.showEndlessModeSelectWnd(choosingCallBack);
    },

    onBuyButtonClick: function(event){
        let btnBuy = event.target;
        let plus = btnBuy.parent.parent;


        let userHave = -1;
        if (plus.data.stCost.byType === 1) {
            userHave = GlobalVar.me().getGold();
        } else if (plus.data.stCost.byType === 2) {
            userHave = GlobalVar.me().getDiamond();
        }

        if (userHave < plus.data.stCost.nCost) {
            if (plus.data.stCost.byType === 2){
                CommonWnd.showNormalFreeGetWnd(GameServerProto.PTERR_DIAMOND_LACK);
            }else if (plus.data.stCost.byType === 1){
                CommonWnd.showNormalFreeGetWnd(GameServerProto.PTERR_GOLD_LACK);
            }
            return;
        }

        let BLESS_ID = 1;
        if (plus.data.byStatusID === BLESS_ID) {
            if (!this.canBuyBless) {
                return;
            }
            GlobalVar.handlerManager().endlessHandler.sendEndlessBuyBlessReq();
            this.canBuyBless = false;
        } else {
            GlobalVar.handlerManager().endlessHandler.sendEndlessBuyStatusReq(plus.data.byStatusID);
        }
    },

    onShareButtonClick: function (event) {
        let btnShare = event.target;
        let plus = btnShare.parent;

        let BLESS_ID = 1;
        if (plus.data.byStatusID === BLESS_ID){
            if (!this.canBuyBless) {
                return;
            }
            let self = this;
            weChatAPI.shareNormal(plus.data.byStatusID + 107, function () {
                self.canBuyBless = false;
                GlobalVar.handlerManager().endlessHandler.sendEndlessBuyBlessReq(1);
            });
        } else{
            weChatAPI.shareNormal(plus.data.byStatusID + 107, function () {
                GlobalVar.handlerManager().endlessHandler.sendEndlessBuyStatusReq(plus.data.byStatusID, 1);
            });
        }
    },

    initEndlessView: function (msg) {

        let rankID = GlobalVar.me().endlessData.getRankID();
        let labelCurMode = this.node.getChildByName("nodeCenter").getChildByName("labelCurMode");
        labelCurMode.color = new cc.Color(MODE_COLOR[rankID - 1][0], MODE_COLOR[rankID - 1][1], MODE_COLOR[rankID - 1][2]);
        labelCurMode.getComponent(cc.Label).string = i18n.t('endlessModeText.' + (rankID - 1));
        

        let data = msg.Bag;
        this.labelHistoryHighestScore.string = data.HistoryMaxScore;  //设置历史最高分和本周最高分显示
        this.labelWeekHighestScore.string = data.WeekMaxScore;
        let tbldata = GlobalVar.tblApi.getDataBySingleKey('TblEndlessStatus', data.BlessStatusID);

        if (!!tbldata){   //当祝福存在时，显示祝福内容，否则隐藏
            this.labelBlessEffectName.string = tbldata.strStatusName;
        }else{
            this.labelBlessEffectName.node.active = false;
        }

        // 隐藏祝福的数量显示
        let BLESS_ID = 1;
        let plusBless = this.plusList[BLESS_ID];

        plusBless.getChildByName("spriteCountBg").active = false;


        // hasPlusFlag用来存储所有加成的是否存在的标记
        let hasPlusFlag = new Array();
        for (let i in this.plusList){
            hasPlusFlag[i] = false;
        }

        // 遍历服务器数据，给存在数量的加成设置数量并标记存在
        for (let i = 0; i < data.Status.length; i++) {
            let plusData = data.Status[i];
            let plusID = plusData.StatusID;
            let plus = this.plusList[plusID];

            this.setPlusCount(plus, plusData.StatusCount)
            
            hasPlusFlag[plusID] = true;
        }

        //不存在的加成则设置数量隐藏
        for (let i in hasPlusFlag){
            if(!hasPlusFlag[i]){
                let plus = this.plusList[i]
                if(!!plus){
                    let nodeCount = plus.getChildByName("spriteCountBg")
                    nodeCount.active = false;
                }
            }
        }

        // 设置宝箱数量
        let rewardCountMax = GlobalVar.tblApi.getDataBySingleKey('TblParam', GameServerProto.PTPARAM_ENDLESS_POWERPOINT_MAX).dValue;
        this.node.getChildByName("nodeCenter").getChildByName("labelRate").getComponent(cc.Label).string = data.PowerPoint + "/" + rewardCountMax;

        this.endlessRankID = GlobalVar.me().endlessData.getRankID();

        // let spriteBoxIcon = this.node.getChildByName("nodeCenter").getChildByName("spriteBoxIcon");
        // spriteBoxIcon.getComponent("RemoteSprite").setFrame(rewardData.wRewardItem - 5001);
        let rewardData = GlobalVar.tblApi.getDataBySingleKey('TblEndlessRank', this.endlessRankID);
        let itemObj = this.node.getChildByName("nodeCenter").getChildByName("ItemBoxIcon").getComponent("ItemObject");
        itemObj.updateItem(rewardData.wRewardItem);
        itemObj.setSpriteEdgeVisible(false);

        
        this.setCountDown();
    },

    showBlessDesc: function (event) {
        if (event.ErrCode !== GameServerProto.PTERR_SUCCESS) {
            this.canBuyBless = true;
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        let tbldata = GlobalVar.tblApi.getDataBySingleKey('TblEndlessStatus', event.OK.StatusID);
        // 显示祝福的名称
        let self = this;

        let effectText = this.node.getChildByName("nodeCenter").getChildByName("nodeEffect");
        GlobalFunc.playDragonBonesAnimation(effectText, function () { 
            effectText.active = false;
            self.labelBlessEffectName.string = tbldata.strStatusName;
            self.labelBlessEffectName.node.active = true;
            self.canBuyBless = true;
        })
        // effectText.active = true;
        // // effectText.getComponent(dragonBones.ArmatureDisplay).clearTracks();
        // effectText.getComponent(dragonBones.ArmatureDisplay).playAnimation("animation", 1);
        // let self = this;
        // effectText.getComponent(dragonBones.ArmatureDisplay).addEventListener(dragonBones.EventObject.COMPLETE, event => {
        //     effectText.active = false;
        //     self.labelBlessEffectName.string = tbldata.strStatusName;
        //     self.labelBlessEffectName.node.active = true;
        //     self.canBuyBless = true;
        // });

        let BLESS_ID = 1;
        let effect = this.plusList[BLESS_ID].getChildByName("ItemObject").getChildByName("nodeEffect").getComponent(sp.Skeleton);
        effect.clearTracks();
        effect.node.active = true;
        effect.setAnimation(0, "animation", false);
        effect.setCompleteListener(trackEntry => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            if (animationName == "animation") {
                effect.node.active = false;
            }
        });
    },

    setStatusCount: function (event) {
        if (event.ErrCode !== GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        let plusID = event.OK.Status.StatusID;
        let plus = this.plusList[plusID];
        // 购买加成后，改变加成的显示数量
        let nodeCount = plus.getChildByName("spriteCountBg")
        nodeCount.active = true;
        let count = event.OK.Status.StatusCount;

        this.setPlusCount(plus, count);

        GlobalVar.me().setGold(event.OK.GoldCur);
        GlobalVar.me().setDiamond(event.OK.DiamondCur);

        let effect = plus.getChildByName("ItemObject").getChildByName("nodeEffect").getComponent(sp.Skeleton);
        effect.clearTracks();
        effect.node.active = true;
        effect.setAnimation(0, "animation", false);
        effect.setCompleteListener(trackEntry => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            if (animationName == "animation") {
                effect.node.active = false;
            }
        });
    },

    startEndlessBattle: function (event) {
        if (event.ErrCode !== GameServerProto.PTERR_SUCCESS){
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            let blockNode=cc.find("Canvas/BlockNode");
            blockNode.active=false;
            return;
        }

        let data = event.OK;

        // hasPlusFlag用来存储所有加成的是否存在的标记
        let hasPlusFlag = new Array();
        for (let i =0;i<this.plusList.length;i++){
            hasPlusFlag.push(false);
        }

        // 遍历服务器数据，给存在数量的加成设置数量并标记存在
        for (let i = 0; i < data.BagStatus.length; i++) {
            let plusData = data.BagStatus[i];
            let plusID = plusData.StatusID;
            let plus = this.plusList[plusID];
            this.setPlusCount(plus, plusData.StatusCount)
            hasPlusFlag[plusID] = true;
        }

        //不存在的加成则设置数量隐藏
        for (let i = 0;i<hasPlusFlag.length;i++){
            if(!hasPlusFlag[i]){
                let plus = this.plusList[i]
                if(!!plus){
                    let nodeCount = plus.getChildByName("spriteCountBg")
                    nodeCount.active = false;
                }
            }
        }

        this.labelBlessEffectName.node.active = false;

        this.btnOrangeAnime.active = false;
        this.btnYellowAnime.active = true;
        this.btnYellowAnime.getComponent(cc.Animation).play();
        this.btnYellowAnime.getComponent("BtnAnime").setCallBack(function () {
            BattleManager.getInstance().setBattleMsg(event.OK);
            BattleManager.getInstance().isEndlessFlag = true;
            BattleManager.getInstance().setCampName('CampEndless');
            BattleManager.getInstance().setMusic('audio/battle/music/battle_bk0');
            BattleManager.getInstance().setAnotherFighter();
            GlobalVar.sceneManager().gotoScene(SceneDefines.BATTLE_STATE);
        })
        GlobalVar.soundManager().playEffect('cdnRes/audio/main/effect/click_gobattle');
        // BattleManager.getInstance().setBattleMsg(event.OK);
        // BattleManager.getInstance().isEndlessFlag = true;
        // BattleManager.getInstance().setCampName('CampEndless');
        // BattleManager.getInstance().setMusic('audio/battle/music/battle_bk0');
        // GlobalVar.sceneManager().gotoScene(SceneDefines.BATTLE_STATE);
    },

    getRankUpResult: function (event){
        this.endlessRankID = GlobalVar.me().endlessData.getRankID();

        // let spriteBoxIcon = this.node.getChildByName("nodeCenter").getChildByName("spriteBoxIcon");
        // let rewardData = GlobalVar.tblApi.getDataBySingleKey('TblEndlessRank', this.endlessRankID);
        // spriteBoxIcon.getComponent("RemoteSprite").setFrame(rewardData.wRewardItem - 5001);
    },

    onBtnGameStart: function () {
        //GlobalVar.comMsg.showMsg("调整中");
        let blockNode=cc.find("Canvas/BlockNode");
        blockNode.active=true;
        GlobalVar.handlerManager().endlessHandler.sendEndlessStartBattleReq();
        // let action = cc.sequence(cc.moveBy(0.2, 200, 0), cc.moveBy(0.4, -400, 0), cc.moveBy(0.2, 200, 0))
        // let newAction = cc.delayTime(0.1);
        // for (let i = 0; i< 5; i++){
        //     newAction = cc.sequence(newAction, action);
        // }
        // this.btnGameStart.runAction(newAction.easing(cc.easeOut(3.0)));
    },

    onBtnShowRanking: function () {
        this.animePlay(0);
    },

    onDestroy: function () {
        GlobalVar.eventManager().removeListenerWithTarget(this);
        if (this.countDownTimerID != -1){
            GlobalVar.gameTimer().delTimer(this.countDownTimerID)
            this.countDownTimerID = -1;
        }
    },
});