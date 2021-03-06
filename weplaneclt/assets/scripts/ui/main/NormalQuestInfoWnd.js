const RootBase = require("RootBase");
const WindowManager = require("windowmgr");
const GlobalVar = require('globalvar')
const WndTypeDefine = require("wndtypedefine");
const EventMsgID = require("eventmsgid");
const GameServerProto = require("GameServerProto");
const CommonWnd = require("CommonWnd");
const i18n = require('LanguageData');
const BattleManager = require('BattleManager');
const SceneDefines = require("scenedefines");
const config = require("config");

cc.Class({
    extends: RootBase,

    properties: {
        nodeQuestInfo: {
            default: null,
            type: cc.Node,
        },
        labelTitle: {
            default: null,
            type: cc.Label,
        },
        scrollTrophyView: {
            default: null,
            type: cc.ScrollView,
        },
        itemPrefab: {
            default: null,
            type: cc.Node,
        },
        spriteBG: {
            default: null,
            type: cc.Node,
        },
        spriteBossBack: {
            default: null,
            type: cc.Sprite,
        },
        spriteBossImg: {
            default: null,
            type: cc.Sprite,
        },
        spriteTextWarning: {
            default: null,
            type: cc.Sprite,
        },
        nodeBtnClose: {
            default: null,
            type: cc.Node,
        },
        btnStartBattle: {
            default: null,
            type: cc.Button,
        },
        btnYellowAnime: {
            default: null,
            type: cc.Node,
        },
        btnOrangeAnime: {
            default: null,
            type: cc.Node,
        },
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_QUESTINFO_WND;

        this.content = this.scrollTrophyView.content;

        this.animeStartParam(0);

    },

    animeStartParam(paramScaleY) {
        this.node.scaleY = paramScaleY;
        this.node.opacity = 255;

        if (paramScaleY == 0 || paramScaleY == 1){
            this.content.removeAllChildren();
            this.nodeQuestInfo.active = false;
        }
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            GlobalVar.eventManager().removeListenerWithTarget(this);
            WindowManager.getInstance().popView(false, null, false, false);
        } else if (name == "Enter") {
            this._super("Enter");
            this.registerEvents(); // 注册监听
            if (this.tblData) {
                this.setQuestTropyh(this.tblData, this.campData);
            }
            this.nodeQuestInfo.active = true;

            let hasBoss = (this.tblData.wIconID - 1) === 0 ? false : true;
            let platformApi = GlobalVar.getPlatformApi();
            if (platformApi && hasBoss) {
                platformApi.hideBannerAdNew();
            }
        }
    },

    enter: function (isRefresh) {
        this.nodeQuestInfo.getChildByName("btnSnedGMComplete").active = config.GM_SWITCH;
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

    registerEvents: function () {
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_CAMP_BEGIN_NTF, this.onGameStartNTF, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_SWEEP_RESULT, this.refreshUI, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_BUY_COUNT_RESULT, this.refreshData, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_CAMP_RESULT_NTF, this.getCampResult, this);
    },

    setQuestTropyh: function (tropyhData, campData) {

        this.content.removeAllChildren();
        if (campData.Star == 0) {
            for (let i = 0; i < tropyhData.oVecFirstRewardDiaplay.length; i++) {
                let id = tropyhData.oVecFirstRewardDiaplay[i];
                let item = cc.instantiate(this.itemPrefab);
                item.getComponent("ItemObject").updateItem(id);
                item.getComponent("ItemObject").setClick(true, 2);
                this.content.addChild(item);
                item.active = true;
                item.getChildByName('firstreward').active = true;
            }
        }
        for (let i = 0; i < tropyhData.oVecRewardDiaplay.length; i++) {
            let id = tropyhData.oVecRewardDiaplay[i];
            let item = cc.instantiate(this.itemPrefab);
            item.getComponent("ItemObject").updateItem(id);
            item.getComponent("ItemObject").setClick(true, 2);
            this.content.addChild(item);
            item.active = true;
        }
        this.scrollTrophyView.scrollToLeft();
    },

    initQuestInfoWithData: function (data, tblData) {
        this.tblData = tblData
        this.campData = data;

        let hasBoss = (tblData.wIconID - 1) === 0 ? false : true;
        if (hasBoss) {
            this.spriteBG.height = 780;
            this.spriteBossBack.node.active = true;
            this.spriteBossImg.node.active = true;
            this.spriteTextWarning.node.active = true;
        } else {
            this.spriteBG.height = 550;
            this.spriteBossBack.node.active = false;
            this.spriteBossImg.node.active = false;
            this.spriteTextWarning.node.active = false;
        }
        this.nodeQuestInfo.getComponent(cc.Widget).updateAlignment();
        this.nodeBtnClose.getComponent(cc.Widget).updateAlignment();
        this.labelTitle.getComponent(cc.Widget).updateAlignment();

        this.setTitle(tblData.strCampaignName);
        this.setCombatRequire(tblData.nFightingLeast);
        this.setSpCost(tblData.wSPCost);
        this.setExpGain(tblData.nRewardExp);
        this.setGoldGain(tblData.nRewardGold);
        this.setLeftTimesCount(data.PlayCount);
    },

    refreshUI: function (event) {
        if (event.ErrCode && event.ErrCode != GameServerProto.PTERR_SUCCESS) {
            return;
        }
        this.campData.PlayCount = event.OK.PlayCount;

        this.setLeftTimesCount(event.OK.PlayCount);
    },

    refreshData: function (event) {
        if (event.ErrCode && event.ErrCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        this.campData = event.OK.Campaign;
        this.setLeftTimesCount(this.campData.PlayCount);
    },

    setTitle: function (title) {
        this.labelTitle.string = title;
    },

    setCombatRequire: function (combatPoint) {
        this.nodeQuestInfo.getChildByName("labelCombatPointRequire").getComponent(cc.Label).string = combatPoint;
    },

    setSpCost: function (cost) {
        this.nodeQuestInfo.getChildByName("labelSpCost").getComponent(cc.Label).string = cost;
    },

    setLeftTimesCount: function (playCount) {
        let vipLevel = GlobalVar.me().vipLevel
        let limtTimes = null;
        while (!limtTimes) {
            limtTimes = this.tblData.oVecDailyLimit[vipLevel];
            if (vipLevel < 0) {
                // console.log("tbl error");
                // this.setLeftTimesCount(0, 0);
                return;
            }
            vipLevel -= 1;
        }
        limtTimes = limtTimes.byCount;

        this.leftTimes = limtTimes - playCount

        this.nodeQuestInfo.getChildByName("labelLeftTimes").getComponent(cc.Label).string = this.leftTimes + "/" + limtTimes; //test

        this.refreshSweepBtn();
    },

    refreshSweepBtn() {
        let btnSweepFive = this.nodeQuestInfo.getChildByName("btnSweepFive");
        let btnSweepOne = this.nodeQuestInfo.getChildByName("btnSweepOne");
        if (this.leftTimes < 5) {
            if (this.leftTimes == 0) {
                btnSweepFive.getComponent("ButtonObject").setText("购买次数");
            } else {
                btnSweepFive.getComponent("ButtonObject").setText("扫荡" + this.leftTimes + "次");
            }
            btnSweepFive.getComponent(cc.Button).clickEvents[0].customEventData = this.leftTimes;
            btnSweepOne.getComponent(cc.Button).clickEvents[0].customEventData = this.leftTimes && 1;
        } else {
            btnSweepFive.getComponent("ButtonObject").setText("扫荡5次");
            btnSweepFive.getComponent(cc.Button).clickEvents[0].customEventData = 5;
            btnSweepOne.getComponent(cc.Button).clickEvents[0].customEventData = 1;
        }
    },

    setExpGain: function (expGain) {
        this.nodeQuestInfo.getChildByName("labelExpGain").getComponent(cc.Label).string = expGain;
    },

    setGoldGain: function (goldGain) {
        this.nodeQuestInfo.getChildByName("labelGoldGain").getComponent(cc.Label).string = goldGain;
    },

    checkFullStarClear: function () {
        if ( /*!this.campData.Played || */ this.campData.Star != 3) {
            return false;
        }
        return true;
    },

    checkSpEnougn: function () {
        if (GlobalVar.me().getSpData().Sp < this.tblData.wSPCost) {
            return false;
        }
        return true;
    },

    checkLeftTimesEnougn: function () {
        if (this.leftTimes < 1) {
            return false;
        }
        return true;
    },

    checkCombatEnough: function () {
        if (!this.checkFullStarClear() && GlobalVar.me().combatPoint * 1.3 < this.tblData.nFightingLeast){
            return false;
        }
        return true;
        // if (GlobalVar.me().combatPoint < this.tblData.nFightingLeast) {
        //     return false;
        // }
        // return true;
    },

    checkLevelEnough: function () {
        if (GlobalVar.me().level < GlobalVar.tblApi.getDataBySingleKey('TblSystem', GameServerProto.PT_SYSTEM_SAODANG).wOpenLevel) {
            return false;
        }
        return true;
    },

    close:function(){
        if(!this.btnStartBattle.interactable){
            return;
        }
        this.content.removeAllChildren();
        this._super();
    },

    onBtnSweep: function (event, count) {

        if(!this.btnStartBattle.interactable){
            return;
        }

        if (!this.checkLevelEnough()) {
            GlobalVar.comMsg.showMsg("十级开启扫荡系统");
            return;
        }
        // 战力限制
        // if (!this.checkCombatEnough()) {
        //     GlobalVar.comMsg.errorWarning(GameServerProto.PTERR_COMBAT_POINT_LOW);
        //     return;
        // }

        if (!this.checkFullStarClear()) {
            GlobalVar.comMsg.errorWarning(GameServerProto.PTERR_CAMP_NOT_FULLSTAR);
            return;
        }

        if (count == 0) {
            this.onBtnResetTimes();
            return;
        }

        if (!this.checkLeftTimesEnougn()) {
            GlobalVar.comMsg.errorWarning(GameServerProto.PTERR_CAMP_DAILY_LIMIT);
            this.onBtnResetTimes();
            return;
        }

        if (!this.checkSpEnougn()) {
            GlobalVar.comMsg.errorWarning(GameServerProto.PTERR_SP_LACK);
            CommonWnd.showBuySpWnd();
            return;
        }

        if (this.tblData) {
            CommonWnd.showSweepWnd(count, this.campData, this.tblData);
        }
    },

    onBtnResetTimes: function () {
        if(!this.btnStartBattle.interactable){
            return;
        }

        let curBuyTimes = this.campData.BuyCount;
        let vipLevel = GlobalVar.me().vipLevel
        let buyTimesLimit = null;
        while (!buyTimesLimit) {
            buyTimesLimit = this.tblData.oVecDailyBuyLimit[vipLevel];
            if (vipLevel < 0) {
                // console.log("tbl error");
                // this.setLeftTimesCount(0, 0);
                return;
            }
            vipLevel -= 1;
        }
        buyTimesLimit = buyTimesLimit.byCount;

        if (curBuyTimes >= buyTimesLimit) {
            this.node.runAction(cc.sequence(cc.delayTime(0.2), cc.callFunc(() => {
                GlobalVar.comMsg.errorWarning(GameServerProto.PTERR_CAMP_BUYCOUNT_LIMIT);
            })))
            return;
        }

        if (this.leftTimes && this.leftTimes > 0) {
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
        // if (diamondCost) {
        //     diamondCost = diamondCost.nDiamond;
        // } else {
        //     // console.log("发生错误,钻石消费计算失败")
        //     return;
        // }
        // let diamondEnough = GlobalVar.me().diamond >= diamondCost;
        // let confirm = function () {
        //     if (diamondEnough) {
        //         GlobalVar.handlerManager().campHandler.sendCampBuyCountReq(typeID, chapterID, campaignID);
        //     } else {
        //         CommonWnd.showNormalFreeGetWnd(GameServerProto.PTERR_DIAMOND_LACK);
        //     }
        // }
        // CommonWnd.showResetQuestTimesWnd(null, i18n.t('label.4000239'), tipDesc, diamondCost, null, confirm);
        CommonWnd.showResetQuestTimesWnd(this.campData, this.tblData);
    },

    onBtnGameStart: function () {
        console.log("onBtnGameStart")

        if (!this.checkSpEnougn()) {
            GlobalVar.comMsg.errorWarning(GameServerProto.PTERR_SP_LACK);
            CommonWnd.showBuySpWnd();
            return;
        }

        if (!this.checkLeftTimesEnougn()) {
            GlobalVar.comMsg.errorWarning(GameServerProto.PTERR_CAMP_DAILY_LIMIT);
            this.onBtnResetTimes();
            return;
        }

        let self = this;

        let tryGetTestMember = function () {
            GlobalVar.me().shareData.testPlayMemberID = 0;
            let testPlayMemberID = -1;
            let random = Math.random();
            console.log(random);
            if (!config.NEED_GUIDE && self.campData.Played == 0 && GlobalVar.getShareSwitch()) {
                if (self.tblData.wIconID == 1 && random > 0.5) {
                    GlobalVar.handlerManager().campHandler.sendCampBeginReq(self.tblData.byChapterID, self.tblData.wCampaignID);
                    return;
                }else {
                    let totalMemberData = GlobalVar.tblApi.getData('TblMember');
                    let ids = [];
                    for (let i in totalMemberData) {
                        if (totalMemberData[i].byGetType == 1 && totalMemberData[i].stPingJia.byStarNum >= 3 && totalMemberData[i].dTestPlayUp > 0) {
                            ids.push(parseInt(i));
                        }
                    }
                    let highestStar = 0;
                    for (let i = 0; i < ids.length; i++) {
                        let memberData = GlobalVar.me().memberData.getMemberByID(ids[i]);
                        if (memberData || GlobalVar.me().memberData.unLockHotFlag[ids[i]]) {
                            if (highestStar < totalMemberData[ids[i]].stPingJia.byStarNum) {
                                highestStar = totalMemberData[ids[i]].stPingJia.byStarNum;
                            }
                            ids.splice(i, 1);
                            i -= 1;
                        }
                    }
                    for (let i = 0; i < ids.length; i++) {
                        if (totalMemberData[ids[i]].stPingJia.byStarNum <= highestStar) {
                            ids.splice(i, 1);
                            i -= 1;
                        }
                    }

                    let randomID = ids[parseInt(Math.random() * ids.length)] || -1;
                    testPlayMemberID = randomID;
                }
            }
            
            if (testPlayMemberID != -1) {
                CommonWnd.showShareMemberTestPlayWnd(testPlayMemberID, function () {
                    GlobalVar.handlerManager().campHandler.sendCampBeginReq(self.tblData.byChapterID, self.tblData.wCampaignID);
                }, function () {
                    GlobalVar.handlerManager().campHandler.sendCampBeginReq(self.tblData.byChapterID, self.tblData.wCampaignID);
                });
            } else {
                GlobalVar.handlerManager().campHandler.sendCampBeginReq(self.tblData.byChapterID, self.tblData.wCampaignID);
            }
        }

        if (this.checkCombatEnough()){
            this.btnStartBattle.interactable = false;
            tryGetTestMember();
        }else{
            CommonWnd.showCombatSuppressWnd(GlobalVar.me().combatPoint, self.tblData.nFightingLeast,
                function () {
                    self.btnStartBattle.interactable = false;
                    tryGetTestMember()
                    // GlobalVar.handlerManager().campHandler.sendCampBeginReq(self.tblData.byChapterID, self.tblData.wCampaignID);
                }, function () {
                    WindowManager.getInstance().popToRoot(false, function () {
                        CommonWnd.showNormalEquipment(GlobalVar.me().memberData.getStandingByFighterID());
                    });
                })
        }

        // GlobalVar.handlerManager().campHandler.sendCampBeginReq(this.tblData.byChapterID, this.tblData.wCampaignID)

        // BattleManager.getInstance().isCampaignFlag = true;
        // BattleManager.getInstance().setNormalCampaign(this.tblData.wCampaignID);
        // GlobalVar.sceneManager().gotoScene(SceneDefines.BATTLE_STATE);
    },

    onGameStartNTF: function (msg) {
        cc.log('onGameStartNTF', msg);
        if (msg.ErrCode == GameServerProto.PTERR_SUCCESS && typeof msg.OK !== 'undefined') {

            if (this.btnStartBattle.interactable){
                GlobalVar.handlerManager().campHandler.sendCampResultReq(1);
                return;
            }
            
            if (GlobalVar.me().shareData.testPlayMemberID){
                GlobalVar.me().memberData.setOneTimeChuZhanMemberID(GlobalVar.me().shareData.testPlayMemberID);
            }

            GlobalVar.me().campData.firstTimePlay = GlobalVar.me().campData.getCampaignData(this.tblData.byTypeID, this.tblData.byChapterID, this.tblData.wCampaignID).Star == 0;

            var self=this;
            this.btnOrangeAnime.active = false;
            this.btnYellowAnime.active = true;
            this.btnYellowAnime.getComponent(cc.Animation).play();
            this.btnYellowAnime.getComponent("BtnAnime").setCallBack(function(){
                GlobalVar.me().oldLastChapterID = GlobalVar.me().campData.getLastChapterID(self.tblData.byTypeID);
                GlobalVar.me().defaultCurChapterID = self.tblData.byChapterID;
                BattleManager.getInstance().setBattleMsg(msg.OK);
                BattleManager.getInstance().isCampaignFlag = true;
                BattleManager.getInstance().setNormalCampaign(self.tblData.wCampaignID);
                BattleManager.getInstance().setMusic(self.tblData.strBkMusic);
                GlobalVar.sceneManager().gotoScene(SceneDefines.BATTLE_STATE);
            })
            GlobalVar.soundManager().playEffect('cdnRes/audio/main/effect/click_gobattle');
        } else {
            GlobalVar.comMsg.errorWarning(msg.ErrCode);
            this.btnStartBattle.interactable = true;
            // cc.log('battle err! ' + msg.ErrCode);
        }
    },

    onBtnSendGMComplete: function () {
        // let commond = "ac " + this.tblData.byChapterID + " " + ((this.tblData.wCampaignID - 1)%10 + 1);
        // var param = commond.split(" ");
        // // cc.log(param);
        // let msg = {
        //     Params: [],
        // };
        // // msg.Params.Param=param;
        // for (let i = 0; i < param.length; i++) {
        //     let p = {
        //         Param: param[i]
        //     };
        //     msg.Params.push(p);
        // }
        // GlobalVar.handlerManager().gmCmdHandler.sendReq(GameServerProto.GMID_GMCMD_REQ, msg);
        if (!this.checkSpEnougn()) {
            GlobalVar.comMsg.errorWarning(GameServerProto.PTERR_SP_LACK);
            CommonWnd.showBuySpWnd();
            return;
        }

        if (!this.checkLeftTimesEnougn()) {
            GlobalVar.comMsg.errorWarning(GameServerProto.PTERR_CAMP_DAILY_LIMIT);
            this.onBtnResetTimes();
            return;
        }
        
        GlobalVar.handlerManager().campHandler.sendCampBeginReq(this.tblData.byChapterID, this.tblData.wCampaignID);
    },
    getCampResult: function (event) {
        if (event.ErrCode != GameServerProto.PTERR_SUCCESS){
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        GlobalVar.handlerManager().campHandler.sendGetCampBagReq(this.tblData.byTypeID);
        GlobalVar.comMsg.showMsg("3星通关关卡"+this.tblData.byChapterID+"-"+((this.tblData.wCampaignID - 1)%10 + 1));
        let getItems = [];
        let winData = event.OK.Win;
        for(let i = 0; i< winData.RewardItem.length; i++){
            getItems.push(winData.RewardItem[i]);
        }
        if (winData.FirstRewardFlag){
            for(let i = 0; i< winData.FirstReward.RewardItem.length; i++){
                getItems.push(winData.FirstReward.RewardItem[i]);
            }
        }
        CommonWnd.showTreasureExploit(getItems);
        // this.close();
    },

    onDestroy: function () {
        GlobalVar.eventManager().removeListenerWithTarget(this);
    },
});