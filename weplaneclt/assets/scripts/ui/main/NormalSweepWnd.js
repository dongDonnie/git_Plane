
const RootBase = require("RootBase");
const WindowManager = require("windowmgr");
const GlobalVar = require('globalvar')
const WndTypeDefine = require("wndtypedefine");
const EventMsgID = require("eventmsgid");
const GameServerProto = require("GameServerProto");
const i18n = require('LanguageData');
const CommonWnd = require("CommonWnd");
const BattleDefines = require('BattleDefines');
const weChatAPI = require("weChatAPI");

const AUDIO_SWEEP_QUEST = 'cdnRes/audio/main/effect/lingquxiaoshi';

var self = null;
cc.Class({
    extends: RootBase,

    properties: {
        sweepScroll: {
            default: null,
            type: cc.ScrollView,
        },
        sweepModel: {
            default: null,
            type: cc.Node,
        },
        labelQuestName: {
            default: null,
            type: cc.Label
        },
        labelLeft: {
            default: null,
            type: cc.Label
        },
        itemPrefab: {
            default: null,
            type: cc.Prefab,
        },
        leftSweepTimes: {
            default: 0,
            visible: false,
        },
        sweepList: [],
        isFirstSweep:{
            default: true,
            visible: false,
        }
    },

    onLoad: function () {
        this._super();
        i18n.init('zh');
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_SWEEP_WND;
        this.content = this.sweepScroll.content;
        this.animeStartParam(0, 0);
        self = this;
        this.targetDatas = [];
    },

    animeStartParam(paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            GlobalVar.eventManager().removeListenerWithTarget(this);
            WindowManager.getInstance().popView(false, null, false, false);
        } else if (name == "Enter") {
            this._super("Enter");
            GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_SWEEP_RESULT, this.refreshUI, this);
            GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_BUY_COUNT_RESULT, this.refreshData, this);
            this.sendSweepMsg();
            this.initSweepWnd();
        }
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

    initSweepWnd: function(){
        if (this.tblData){
            this.node.getChildByName("labelQuestName").getComponent(cc.Label).string = this.tblData.strCampaignName;
        }

        if (this.campData){
            this.setLeftTimesCount(this.campData.PlayCount);
        }
    },

    setLeftTimesCount: function(playCount){
        let vipLevel = GlobalVar.me().vipLevel
        let limtTimes = null;
        while (!limtTimes){
            limtTimes = this.tblData.oVecDailyLimit[vipLevel];            
            if (vipLevel< 0){
                // console.log("tbl error");
                this.setLeftTimesCount(0, 0);
                return;
            }
            vipLevel -= 1;
        }
        limtTimes = limtTimes.byCount;

        this.leftTimes = limtTimes - playCount;

        this.node.getChildByName("labelLeft").getComponent(cc.Label).string = this.leftTimes + "/" + limtTimes;

        this.refreshSweepBtn();
    },

    refreshData: function(event){
        if (event.ErrCode && event.ErrCode != GameServerProto.PTERR_SUCCESS){
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        this.campData = event.OK.Campaign;
        this.setLeftTimesCount(this.campData.PlayCount);
    },

    refreshUI: function(event){
        if (event.ErrCode && event.ErrCode != GameServerProto.PTERR_SUCCESS){
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            this.leftSweepTimes = 0;
            return;
        }
        // 播放音效
        // GlobalVar.soundManager().playEffect(AUDIO_SWEEP_QUEST);
        this.campData.PlayCount = event.OK.PlayCount;
        this.addSweepPrefabs(event.OK)
        this.setLeftTimesCount(event.OK.PlayCount);
    },
    
    refreshSweepBtn: function(){
        let btnSweepFive = this.node.getChildByName("btnFiveMore");
        let btnSweepOne = this.node.getChildByName("btnOneMore");
        if (this.leftTimes < 5){
            if (this.leftTimes == 0){
                btnSweepFive.getComponent("ButtonObject").setText("购买次数");
            }else{
                btnSweepFive.getComponent("ButtonObject").setText("扫荡" + this.leftTimes + "次");
            }
            btnSweepFive.getComponent(cc.Button).clickEvents[0].customEventData = this.leftTimes;
            btnSweepOne.getComponent(cc.Button).clickEvents[0].customEventData = this.leftTimes && 1;
        }else{
            btnSweepFive.getComponent("ButtonObject").setText("扫荡5次");
            btnSweepFive.getComponent(cc.Button).clickEvents[0].customEventData = 5;
            btnSweepOne.getComponent(cc.Button).clickEvents[0].customEventData = 1;
        }

    },

    addSweepPrefabs: function (data) {
        let i = this.content.children.length;
        let sweep = null;
        if (this.isFirstSweep){
            sweep = this.sweepModel;
            this.isFirstSweep = false;
        }else{
            sweep = cc.instantiate(this.sweepModel);
            this.content.addChild(sweep);
        }

        this.updateSweep(sweep, data);
        this.sweepList.push(sweep);
        let scroll = this.sweepScroll;

        let self = this;

        let scaleGetItem = function () {
            let layout = sweep.getChildByName("layoutGainItems");

            for (let i = 0; i< layout.children.length; i++){
                if (i != 0){
                    layout.children[i].runAction(cc.sequence(cc.scaleTo(0.2, 1.1), cc.scaleTo(0.2, 1)));
                }else{
                    layout.children[i].runAction(cc.sequence(cc.scaleTo(0.2, 1.1), cc.scaleTo(0.2, 1), cc.callFunc(()=>{
                        self.leftSweepTimes -= 1;
                        self.sendSweepMsg();
                    })))
                }
            }
        };

        sweep.x=(-1000);
        sweep.runAction(
            cc.sequence(
            cc.callFunc(() => {
                scroll.scrollToBottom(0.2);
        }), cc.moveBy(0.2, 1100), 
            cc.moveBy(0.1, -100),
            cc.callFunc(() => {
                scaleGetItem()
                // self.sendSweepMsg();
        })));



    },

    checkFullStarClear: function(){
        if (/*!this.campData.Played || */this.campData.Star != 3){   
            return false;
        }
        return true;
    },

    checkSpEnougn: function(){
        if (GlobalVar.me().getSpData().Sp < this.tblData.wSPCost){
            return false;
        }
        return true;
    },

    checkLeftTimesEnougn: function(){
        if (this.leftTimes < 1){
            return false;
        }
        return true;
    },

    onBtnSweep: function (event, count){

        if (this.leftSweepTimes !== 0) {
            return;
        }

        if (!this.checkFullStarClear()){
            GlobalVar.comMsg.errorWarning(GameServerProto.PTERR_CAMP_NOT_FULLSTAR);
            return;
        }

        if (!this.checkSpEnougn()){
            GlobalVar.comMsg.errorWarning(GameServerProto.PTERR_SP_LACK);
            CommonWnd.showBuySpWnd();
            return;
        }

        if (count == 0){
            this.onBtnResetTimes();
            return;
        }

        if (!this.checkLeftTimesEnougn()) {
            GlobalVar.comMsg.errorWarning(GameServerProto.PTERR_CAMP_DAILY_LIMIT);
            this.onBtnResetTimes();
            return;
        }

        this.leftSweepTimes += count;
        this.sendSweepMsg();
    },

    onBtnResetTimes: function () {
        let curBuyTimes = this.campData.BuyCount;
        let vipLevel = GlobalVar.me().vipLevel
        let buyTimesLimit = null;
        while (!buyTimesLimit){
            buyTimesLimit = this.tblData.oVecDailyBuyLimit[vipLevel];            
            if (vipLevel< 0){
                // console.log("tbl error");
                this.setLeftTimesCount(0, 0);
                return;
            }
            vipLevel -= 1;
        }
        buyTimesLimit = buyTimesLimit.byCount;

        if (curBuyTimes >= buyTimesLimit){
            GlobalVar.comMsg.errorWarning(GameServerProto.PTERR_CAMP_BUYCOUNT_LIMIT);
            return;
        }

        if (this.leftTimes && this.leftTimes>0){
            GlobalVar.comMsg.showMsg(i18n.t('label.4000251'));
            return;
        }
        

        // let typeID = this.tblData.byTypeID;
        // let chapterID = this.tblData.byChapterID;
        // let campaignID = this.tblData.wCampaignID;
        // let tipDesc = i18n.t('label.4000250');
        // tipDesc = tipDesc.replace('%d', curBuyTimes);
        // tipDesc = tipDesc.replace('%d', buyTimesLimit);

        // let diamondCost = GlobalVar.tblApi.getDataBySingleKey('TblCampBuy', curBuyTimes + 1);
        // if (diamondCost){
        //     diamondCost = diamondCost.nDiamond;
        // }else{
        //     // console.log("发生错误,钻石消费计算失败")
        //     return;
        // }

        // let diamondEnough = GlobalVar.me().diamond >= diamondCost;
        // let confirm = function () {
        //     if (diamondEnough){
        //         GlobalVar.handlerManager().campHandler.sendCampBuyCountReq(typeID, chapterID, campaignID);
        //     }else{
        //         CommonWnd.showNormalFreeGetWnd(GameServerProto.PTERR_DIAMOND_LACK);
        //     }
        // }


        // CommonWnd.showResetQuestTimesWnd(null, i18n.t('label.4000239'), tipDesc, diamondCost, null, confirm);
        CommonWnd.showResetQuestTimesWnd(this.campData, this.tblData);
    },

    setSweepTimes: function(times){
        this.leftSweepTimes = times;
    },

    setSweepCampInfo: function(data, tblData){
        this.chapterType = tblData.byTypeID;
        this.chapterID = tblData.byChapterID;
        this.campaignID = tblData.wCampaignID;
        this.campData = data;
        this.tblData = tblData;
    },

    sendSweepMsg() {
        if (this.leftSweepTimes > 0) {
            GlobalVar.handlerManager().campHandler.sendSweepReq(this.chapterType, this.chapterID, this.campaignID);
        }
    },

    // 要修改
    updateSweep: function (sweep, data) {
        sweep.data = data;
        sweep.opacity = 255;
        sweep.x=(0);
        // sweep.getChildByName("labelExpGain").getComponent(cc.Label).string = data.RewardExp;
        // sweep.getChildByName("labelGoldGain").getComponent(cc.Label).string = data.RewardGold;
        let layout = sweep.getChildByName("layoutGainItems");
        layout.removeAllChildren();
        for (let i = 0; i < data.RewardItem.length; i++) {
            let item = cc.instantiate(this.itemPrefab);
            item.getComponent("ItemObject").updateItem(data.RewardItem[i].ItemID, data.RewardItem[i].Count);
            // if (data.RewardItem[i].ItemID !== 1 && data.RewardItem[i].ItemID !== 2 && data.RewardItem[i].Count <=1){
                // item.getComponent("ItemObject").setAllVisible(false);
            // }
            item.getComponent("ItemObject").setClick(true, 2);
            item.y = -item.height;
            item.x = i * (item.width + 10);
            item.anchorX = 0;
            item.anchorY = 0;
            item.scale = 0;
            layout.addChild(item);
        }
        layout.getComponent(cc.Layout).updateLayout();
        if (layout.width > 560) {
            let scale = 560 / layout.width
            layout.setScale(scale);
        }
        let nodeRewardExp = {
            target: sweep.getChildByName("labelExpGain"),
            startScore: 0,
            targetScore: data.RewardExp,
        };
        this.targetDatas.push(nodeRewardExp);

        let nodeRewardGold = {
            target: sweep.getChildByName("labelGoldGain"),
            startScore: 0,
            targetScore: data.RewardGold,
        }
        this.targetDatas.push(nodeRewardGold);
    },

    close: function () {
        this.sweepScroll.content.removeAllChildren();
        this.targetDatas.splice(0);
        this._super();
    },

    update: function (dt) {
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

});
