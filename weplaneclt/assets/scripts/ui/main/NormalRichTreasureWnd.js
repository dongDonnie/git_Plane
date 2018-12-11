const RootBase = require("RootBase");
const GlobalVar = require('globalvar');
const WindowManager = require("windowmgr");
const EventMsgID = require("eventmsgid");
const GameServerProto = require("GameServerProto");
const CommonWnd = require("CommonWnd");
const i18n = require('LanguageData');


const TREAURE_GOLD = "cdnRes/audio/main/effect/kaicai";

var self = null;
cc.Class({
    extends: RootBase,

    properties: {
        labelCount: cc.Label,
        costDiamond: cc.Label,
        progressBar: cc.ProgressBar,
        rewardBoxs: [cc.Node],
    },

    ctor: function () {
        self = this;
    },

    onLoad() {
        this._super();
        this.animeStartParam(0, 0);
    },

    animeStartParam(paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;

        let spriteTip = this.node.getChildByName("spriteContinueTip");
        spriteTip.runAction(cc.repeatForever(cc.sequence(cc.fadeIn(0.7), cc.fadeOut(0.7))));
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            GlobalVar.eventManager().removeListenerWithTarget(this);
            WindowManager.getInstance().popView(false, null, false, false);
        } else if (name == "Enter") {
            this._super("Enter");
            var goldRewardTimes = GlobalVar.tblApi.getData('TblTreasureGoldReward');
            this.times = [];
            for (let i in goldRewardTimes) {
                this.times.push(goldRewardTimes[i].byTimes);
            }
            GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_TREASURE_MINING_RESULT, this.showTreasureMiningResult, this);
            GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_TREASURE_MINING_REWARD_RESULT, this.showMiningRewardResult, this);
            this.showSurplusTimes();
        }
    },

    showMiningRewardResult: function (data) { //领取奖励的结果
        if (data.ErrCode && data.ErrCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(data.ErrCode);
            return;
        }
        let item = [GlobalVar.tblApi.getDataBySingleKey('TblTreasureGoldReward', this.times[this.clickBtn]).stItem];
        CommonWnd.showTreasureExploit(item);
        this.initBoxStatus();
    },

    initBoxStatus: function () {
        let goldMiningRewards = GlobalVar.me().drawData.getGoldMiningRewards();
        let goldMiningTimes = GlobalVar.me().drawData.getGoldMiningTimes();
        this.boxStatus = [0, 0, 0];  //0: 不能领取  1: 能领取  2: 已领取

        for (let i = 0; i < 3; i++){
            if (goldMiningTimes >= this.times[i]) {
                this.boxStatus[i] = 1;
            }
        }

        for (let k = 0; k < goldMiningRewards.length; k++) {
            if (goldMiningRewards[k] == this.times[0]) this.boxStatus[0] = 2;
            if (goldMiningRewards[k] == this.times[1]) this.boxStatus[1] = 2;
            if (goldMiningRewards[k] == this.times[2]) this.boxStatus[2] = 2;
        }
        // cc.log(this.boxStatus);
        for (let i = 0; i < this.boxStatus.length; i++) {
            this.rewardBoxs[i].getComponent("RemoteSprite").setFrame(this.boxStatus[i]);
            this.rewardBoxs[i].getChildByName("spriteHot").active = this.boxStatus[i] == 1 ? true : false;
        }
    },

    showTreasureMiningResult: function (data) { //开采结果
        if (data.ErrCode && data.ErrCode != GameServerProto.PTERR_SUCCESS) {
            if (data.ErrCode == GameServerProto.PTERR_DIAMOND_LACK) {
                CommonWnd.showNormalFreeGetWnd(data.ErrCode);
            } else {
                GlobalVar.comMsg.errorWarning(data.ErrCode);
            }
            return;
        }
        GlobalVar.soundManager().playEffect(TREAURE_GOLD);
        GlobalVar.comMsg.pushMsg(data.Item[0].Count, data.Crit);
        this.changeCanClickTimes(data.MiningTimes);
        this.initBoxStatus();
    },

    showSurplusTimes: function () { //显示剩余开采次数
        var data = GlobalVar.me().drawData.data.richTreasureData;
        if (data.ErrCode && data.ErrCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(data.ErrCode);
            return;
        }
        this.changeCanClickTimes(data.GoldMiningTimes);
        this.initBoxStatus();
    },

    changeCanClickTimes: function (miningTimes) {
        var vipLevel = GlobalVar.me().getVipLevel();
        var getTimesFromTblall = GlobalVar.tblApi.getDataBySingleKey('TblTreasureGoldVIP', vipLevel).wTimes;
        this.labelCount.string = getTimesFromTblall - miningTimes;
        this.costDiamond.string = GlobalVar.tblApi.getDataBySingleKey('TblTreasureGold', (miningTimes + 1)).nDiamond;
        this.progressBar.progress = miningTimes / this.times[2];
    },

    onMiningBtnClick: function () { //开采金矿
        GlobalVar.handlerManager().drawHandler.sendGoldTreasure();
        let netNode = cc.find("Canvas/NetNode");
        netNode.active = false;
    },

    onRewardBoxBtnClick: function (event, times) { //领取开采奖励
        let netNode = cc.find("Canvas/NetNode");
        let confirm = function () {
            self.clickBtn = times;
            GlobalVar.handlerManager().drawHandler.sendTrasureReward(this.times[times]);
            netNode.active = false;
        }.bind(this);
        let num = times;
        let confirmText = this.boxStatus[num] == 2 ? "已领取" :"领取";
        let condition = this.boxStatus[num] == 1 ? true : false;
        let content = [GlobalVar.tblApi.getDataBySingleKey('TblTreasureGoldReward', this.times[times]).stItem];
        CommonWnd.showRewardBoxWnd(null, i18n.t('label.4000255'), condition, content, null, confirm, null, confirmText);
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

});
