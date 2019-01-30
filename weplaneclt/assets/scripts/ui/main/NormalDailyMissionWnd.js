
const RootBase = require("RootBase");
const WindowManager = require("windowmgr");
const GlobalVar = require('globalvar')
const WndTypeDefine = require("wndtypedefine");
const EventMsgID = require("eventmsgid");
const GameServerProto = require("GameServerProto");
const CommonWnd = require("CommonWnd");
const i18n = require('LanguageData');
const GlobalFunc = require('GlobalFunctions');
const StoreageData = require("storagedata");

const TAB_NEWTASK = 0, TAB_DAILYMISSION = 1;
const BUTTON_INACTIVE = 0, BUTTON_ACTIVE = 1;

const AUDIO_COMMIT_MISSTION = 'cdnRes/audio/main/effect/zhihuiguan-zhuangbeihecheng';

cc.Class({
    extends: RootBase,

    properties: {
        nodeTabSprite: {
            default: [],
            type: [cc.Sprite],
        },
        nodeTabContent: {
            default: [],
            type: [cc.Node],
        },
        curTab: {
            default: TAB_DAILYMISSION,
            visible: false,
        },
        nodeDailyModel: {
            default: null,
            type: cc.Node,
        },
        nodeItemRewardModel: {
            default: null,
            type: cc.Node,
        },
        nodeQuestModel: {
            default: null,
            type: cc.Node,
        },
        completeQuestCount: {
            default: 0,
            visible: false,
        },
        dailyNotInit: {
            default: true,
            visible: false,
        },
        newTaskNotInit: {
            default: true,
            visible: false,
        },
        alreadSaveData: {
            default: false,
            visible: false,
        },
        dailyScroll: {
            default: null,
            type: cc.ScrollView,
        },
        labelCompleteQuestName: {
            default: null,
            type: cc.Label,
        },
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_DAILY_MISSION_WND;

        this.animeStartParam(0, 0);
        // this.onBtnTapClick();
        this.isFirstIn = true;
        this.nodeTabContent[TAB_DAILYMISSION].getChildByName("nodeRewards").active = false;
    },

    onDestroy: function(){
        GlobalVar.eventManager().removeListenerWithTarget(this);
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
            //接到消息后再初始化窗口
            this.recvLock = false;
            this.alreadSaveData = false;
            this.nodeTabContent[TAB_DAILYMISSION].getChildByName("nodeRewards").active = true;
            this.registerEvent();
            this.initDailyWnd();
            this.checkRedPoint();
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

    onBtnClose: function () {
        this.canClose && this.close()
    },

    close: function () {
        // if (this.nodeTabContent[TAB_DAILYMISSION].active){
        //     this.dailyScroll.loopScroll.releaseViewItems();
        // }
        // // this.nodeTabContent[TAB_DAILYMISSION].active = false;
        // this.nodeTabContent[TAB_DAILYMISSION].getChildByName("nodeRewards").active = false;
        // if (this.nodeTabContent[TAB_NEWTASK].active){
        //     this.nodeTabContent[TAB_NEWTASK].active = false
        // }
        if (this.curTab == TAB_DAILYMISSION){
            this.dailyScroll.loopScroll.releaseViewItems();
        }
        this.nodeTabContent[this.curTab].active = false;
        
        this._super();
    },

    registerEvent: function () {
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GETDAILY_DATA, this.setSaveData, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GETDAILY_REAWRD, this.showDailyReward, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GETDAILY_ACTIVE_REWARD, this.showDailyActiveReward, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_NEWTASK_REWARD, this.showNewTaskReward, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_DAILY_FLAG_CHANGE, this.setDailyFlag, this);
    },

    setDefaultTab: function (index) {
        if (typeof index == 'undefined'){
            index = TAB_DAILYMISSION;
        }
        this.setTABShowHide(index);
        this.curTab = index;
    },

    setSaveData: function () {
        this.alreadSaveData = true;
        this.initDailyWnd();
    },

    initDailyWnd: function () {
        // if (this.curTab == TAB_DAILYMISSION && this.dailyNotInit) {
        if (this.curTab == TAB_DAILYMISSION) {
            this.initDailyTab();
            this.dailyNotInit = false;
        } else if (this.curTab == TAB_NEWTASK) {
        // } else if (this.curTab == TAB_NEWTASK && this.newTaskNotInit) {
            this.initChallengeTab();
            this.newTaskNotInit = false;
        }
    },
    checkRedPoint: function (){
        // 挑战的红点
        let newTask = GlobalVar.me().dailyData.getNewTaskData();
        if (newTask) {
            let taskData = GlobalVar.tblApi.getDataBySingleKey('TblNewTask', newTask.TaskID);
            if (taskData) {
                let maxRate = taskData.nVar;
                let curRate = newTask.Var;
                if (curRate > maxRate){
                    curRate = maxRate;
                }
                this.node.getChildByName("btnChallenge").getChildByName("spriteHot").active = (curRate == maxRate);
            }
        }

        //今日任务的红点
        let flags = GlobalVar.me().statFlags;
        this.node.getChildByName("btnDaily").getChildByName("spriteHot").active = !!flags.DailyFlag;
    },
    setDailyFlag: function(event){
        let flags = GlobalVar.me().statFlags;
        this.node.getChildByName("btnDaily").getChildByName("spriteHot").active = !!flags.DailyFlag;
    },

    onBtnTapClick: function (event, index) {
        if (typeof index == 'undefined' || index < TAB_NEWTASK || index > TAB_DAILYMISSION) {
            index = TAB_DAILYMISSION;
        }
        if (this.curTab == index){
            return;
        }
        this.curTab = index;
        if (index == TAB_DAILYMISSION) {
            if (this.alreadSaveData) {
                this.initDailyWnd();
            } else {
                GlobalVar.handlerManager().dailyHandler.sendGetDailyDataReq();
            }
        }else{
            this.initDailyWnd();
        }

        this.setTABShowHide(index);
        // this.initDailyWnd();
    },

    setTABShowHide: function(index){
        //默认初始化日常任务选项卡
        for (let i = 0; i < this.nodeTabContent.length; i++) {
            if (i == index) {
                this.nodeTabContent[i].active = true;
                this.nodeTabSprite[i].setFrame(BUTTON_ACTIVE);
            } else {
                this.nodeTabContent[i].active = false;
                this.nodeTabSprite[i].setFrame(BUTTON_INACTIVE);
            }
        }
    },

    initChallengeTab: function () {
        let nodeChallenge = this.nodeTabContent[TAB_NEWTASK];
        // 获取新手引导的进度信息
        let newTaskRate = GlobalVar.me().dailyData.getNewTaskData();
        if (newTaskRate) {
            let taskData = GlobalVar.tblApi.getDataBySingleKey('TblNewTask', newTaskRate.TaskID);
            if (taskData) {
                nodeChallenge.getChildByName("labelMisstionDesc").getComponent(cc.Label).string = taskData.strName;
                nodeChallenge.getChildByName("labelMisstionDesc").opacity = 255;

                // 初始化进度
                let nodeRate = nodeChallenge.getChildByName("nodeRate");
                let maxRate = taskData.nVar;
                let curRate = newTaskRate.Var;
                if (taskData.byType == 9) {
                    maxRate -= 1;
                    curRate -= 1;
                }
                if (taskData.byType == 7 || taskData.byType == 9 || taskData.byType == 11) {
                    if (Math.floor(maxRate / 100) < Math.floor(curRate / 100)) {
                        curRate = maxRate = 1;
                    } else if (Math.floor(maxRate / 100) == Math.floor(curRate / 100)) {
                        maxRate = maxRate % 100;
                        curRate = curRate % 100;
                    } else {
                        maxRate = maxRate % 100;
                        curRate = 0;
                    }
                }
                if (curRate > maxRate) {
                    curRate = maxRate;
                }
                if (curRate == -1) return;
                if (curRate > maxRate) {
                    curRate = maxRate;
                }
                // 红点
                this.node.getChildByName("btnChallenge").getChildByName("spriteHot").active = (curRate == maxRate);

                // 按钮
                let platformApi = GlobalVar.getPlatformApi();
                if (curRate == maxRate) {
                    if (newTaskRate.TaskID % 3 == 0) {
                        nodeChallenge.getChildByName("btnRecv").active = false;
                        nodeChallenge.getChildByName("btnWatchVideo").active = true;
                        nodeChallenge.getChildByName("btnRecvText").active = true;
                        if (platformApi && !platformApi.canShowRewardVideo()) {
                            nodeChallenge.getChildByName('btnWatchVideo').getChildByName('videoIcon').getComponent('RemoteSprite').setFrame(1);
                        } else {
                            nodeChallenge.getChildByName('btnWatchVideo').getChildByName('videoIcon').getComponent('RemoteSprite').setFrame(0);
                        }
                    } else {
                        nodeChallenge.getChildByName("btnRecv").active = true;
                        nodeChallenge.getChildByName("btnWatchVideo").active = false;
                        nodeChallenge.getChildByName("btnRecvText").active = false;
                    }
                    nodeChallenge.getChildByName("btnGo").active = false;
                } else {
                    nodeChallenge.getChildByName("btnRecv").active = false;
                    nodeChallenge.getChildByName("btnGo").active = true;
                    nodeChallenge.getChildByName("btnRecvText").active = false;
                    nodeChallenge.getChildByName("btnWatchVideo").active = false;
                }
                nodeRate.opacity = 255;
                nodeRate.getChildByName("labelMaxRate").getComponent(cc.Label).string = maxRate;
                nodeRate.getChildByName("labelCurRate").getComponent(cc.Label).string = curRate;
                nodeRate.getComponent(cc.Layout).updateLayout();
                nodeRate.getComponent(cc.Widget).updateAlignment();
                // if (curRate < maxRate) {
                //     nodeRate.getChildByName("labelCurRate").color = cc.Color.RED;
                // } else {
                //     nodeRate.getChildByName("labelCurRate").color = cc.Color.WHITE;
                // }

                if (cc.game.renderType != cc.game.RENDER_TYPE_WEBGL) {
                    nodeChallenge.getChildByName("progressActiveBar").getComponent(cc.ProgressBar).progress = curRate / maxRate;
                } else {
                    let curProgress = nodeChallenge.getChildByName("progressActiveBar").getComponent(cc.ProgressBar).progress
                    if (curProgress <= curRate/maxRate){
                        nodeChallenge.getChildByName("progressActiveBar").runAction(cc.progressLoading(0.2, curProgress, curRate / maxRate));
                    }else{
                        nodeChallenge.getChildByName("progressActiveBar").runAction(cc.progressLoading(0.2, 0, curRate / maxRate));
                    }
                }
                // 初始化任务奖励
                let itemVecs = taskData.oVecReward;
                nodeChallenge.getChildByName("nodeReward").removeAllChildren();
                for (let i = 0; i < itemVecs.length; i++) {
                    let itemObj = cc.instantiate(this.nodeItemRewardModel);
                    itemObj.active = true;
                    nodeChallenge.getChildByName("nodeReward").addChild(itemObj);
                    let itemData = itemObj.getChildByName("ItemObject").getComponent("ItemObject").updateItem(itemVecs[i].wItemID, itemVecs[i].nCount);
                    itemObj.getChildByName("ItemObject").getComponent("ItemObject").setClick(true, 2);
                    itemObj.getChildByName("labelName").getComponent(cc.Label).string = itemData.strName;
                }
                nodeChallenge.getChildByName("nodeReward").getComponent(cc.Layout).updateLayout();
            }
        }

        this.canClose = true;
    },

    initDailyTab: function () {
        // console.log("initDailyTab");
        // 初始化日常任务列表
        // this.completeQuestCount = 0;
        // let nodeDaily = this.nodeTabContent[TAB_DAILYMISSION];
        // let content = nodeDaily.getChildByName("nodeMisstion").getChildByName("scrollviewDaily").getComponent(cc.ScrollView).content;
        // content.removeAllChildren();
        let dailyDatas = GlobalVar.tblApi.getData('TblDaily');
        // 把每日任务排序

        this.dailyDatas = this.sortDailyData(dailyDatas);

        // 初始化活跃度宝箱列表
        this.initActiveBoxList();

        //初始化活跃进度条
        this.initActiveBar();

        //初始化任务详情
        this.initDailyMisstion();
    },

    initDailyMisstion: function(){

        let showDataList = [];
        for(let i = 0; i<this.dailyDatas.length; i++){
            if (this.checkDelDaily(i) == false){
                showDataList.push(this.dailyDatas[i]);
            }
        }

        if (showDataList.length > 0){
            let self = this;
            self.canClose = false;
            if (this.isFirstIn){
                this.isFirstIn = false;
                this.dailyScroll.loopScroll.setTotalNum(showDataList.length);
                this.dailyScroll.loopScroll.setCreateModel(this.nodeDailyModel);
                this.dailyScroll.loopScroll.saveCreatedModel(this.dailyScroll.content.children);
                this.dailyScroll.loopScroll.registerUpdateItemFunc(function(daily, index){
                    // self.updateDaily(daily, showDataList[index]);
                    daily.getComponent("DailyObject").updateDaily(showDataList[index]);
                });
                this.dailyScroll.loopScroll.registerCompleteFunc(function(){
                    self.canClose = true;
                })
                this.dailyScroll.loopScroll.resetView();
            }else{
                this.dailyScroll.scrollToTop(0);
                this.dailyScroll.loopScroll.setTotalNum(showDataList.length);
                this.dailyScroll.loopScroll.registerUpdateItemFunc(function(daily, index){
                    daily.getComponent("DailyObject").updateDaily(showDataList[index]);
                });
                this.dailyScroll.loopScroll.initParameter();
                this.dailyScroll.loopScroll.resetView();
                // this.dailyScroll.loopScroll.refreshViewItem();
            }
        }else{
            this.canClose = true;
            let nodeDaily = this.nodeTabContent[TAB_DAILYMISSION];
            nodeDaily.getChildByName("nodeMisstion").active = false;
            nodeDaily.getChildByName("nodeComplete").active = true;
            let strTips = "关卡[%chapterID-%campaignID %campName]";
            let chapterID = GlobalVar.me().campData.getLastChapterID(GameServerProto.PT_CAMPTYPE_MAIN);
            let campaignIndex = (GlobalVar.me().campData.getLastCampaignID(GameServerProto.PT_CAMPTYPE_MAIN) - 1) % 10;
            strTips = strTips.replace("%chapterID", chapterID).replace("%campaignID", campaignIndex + 1);
            let campTblID = GlobalVar.tblApi.getDataBySingleKey('TblChapter', GameServerProto.PT_CAMPTYPE_MAIN)[chapterID - 1].oVecCampaigns[campaignIndex]
            let campName = GlobalVar.tblApi.getDataBySingleKey('TblCampaign', campTblID).strCampaignName;
            strTips = strTips.replace("%campName", campName);


            this.labelCompleteQuestName.string = strTips;
        }


        // self.canClose = true;

        // this.dailyScroll.node.y = this.dailyScroll.node.y - 200;
        // this.dailyScroll.node.runAction(cc.sequence(cc.moveBy(0.15, 0, 220), cc.moveBy(0.1, 0 , -20)));
    },

    initActiveBoxList: function(){
        // 初始化活跃度宝箱列表
        let nodeDaily = this.nodeTabContent[TAB_DAILYMISSION];
        let curActive = nodeDaily.getChildByName("labelActiveValue").getComponent(cc.Label).string = GlobalVar.me().dailyData.getActive();
        let rewardBoxData = GlobalVar.tblApi.getData('TblDailyActive');
        let boxList = nodeDaily.getChildByName("nodeRewards").getChildByName("nodeBoxes").children;
        let index = 0;
        for (let key in rewardBoxData) {
            let box = boxList[index];
            box.rewardData = rewardBoxData[key].oVecReward;
            box.getChildByName("labelActiveRequire").getComponent(cc.Label).string = rewardBoxData[key].nActive + "活跃";
            box.getChildByName("btnRewardBox").getComponent(cc.Button).clickEvents[0].customEventData = rewardBoxData[key].nActive;
            if (GlobalVar.me().dailyData.isActiveRewardReceived(key)) {
                box.getChildByName("btnRewardBox").getComponent("RemoteSprite").setFrame(2);
                box.getChildByName("btnRewardBox").getChildByName("spriteHot").active = false;
            } else if (curActive >= key) {
                box.getChildByName("btnRewardBox").getComponent("RemoteSprite").setFrame(1);
                box.getChildByName("btnRewardBox").getChildByName("spriteHot").active = true;
            } else {
                box.getChildByName("btnRewardBox").getComponent("RemoteSprite").setFrame(0);
                box.getChildByName("btnRewardBox").getChildByName("spriteHot").active = false;
            }
            index += 1;
        }
    },

    initActiveBar: function(){
        //初始化活跃进度条
        let nodeDaily = this.nodeTabContent[TAB_DAILYMISSION];
        let nodeRewards = nodeDaily.getChildByName("nodeRewards");
        let progressActive = nodeRewards.getChildByName("progressActiveBar");
        let rewardBoxData = GlobalVar.tblApi.getData('TblDailyActive');
        let rewardList = [];
        for (let key in rewardBoxData) {
            rewardList.push(rewardBoxData[key].nActive);
        }
        let curActive = GlobalVar.me().dailyData.getActive();


        if (curActive > 0 && curActive <= rewardList[0]) {
            curActive = curActive;
        }
        else if (curActive > rewardList[0] && curActive <= rewardList[1]) {
            curActive = (curActive - rewardList[0]) * 1.5 + rewardList[0];
        }
        else if (curActive > rewardList[1] && curActive <= rewardList[2]) {
            curActive = (curActive - rewardList[1]) * 0.6 + (rewardList[1] - rewardList[0]) * 1.5 + rewardList[0];
        }
        else if (curActive > rewardList[2] && curActive <= rewardList[3]) {
            curActive = (curActive - rewardList[2]) * 1.5 + (rewardList[2] - rewardList[1])*0.6 + (rewardList[1]-rewardList[0])*1.5 + rewardList[0];
        }
        let percent = curActive / rewardList[3];
        // console.log("!!!!!!!!!!!!!!!!!!!", percent);
        let curPercent = progressActive.getComponent(cc.ProgressBar).progress
        if (cc.game.renderType != cc.game.RENDER_TYPE_WEBGL) {
            progressActive.getComponent(cc.ProgressBar).progress = percent;
        } else {
            if (curPercent<=percent){
                progressActive.runAction(cc.progressLoading(0.3, curPercent, percent))
            }else{
                progressActive.runAction(cc.progressLoading(0.3, 0, percent))
            }
            // progressActive.getComponent(cc.ProgressBar).progress = percent;
        }
    },

    onActiveRewardBoxClick: function (event, active) {
        // 是否达到领取条件
        let condition = GlobalVar.me().dailyData.getActive() >= active;
        // 活跃宝箱的内容
        let rewardBoxData = event.target.parent.rewardData;

        let confirmText = "领取";
        
        let tblRewardBoxData = GlobalVar.tblApi.getData('TblDailyActive');
        let rewardBoxs = [];
        let rewardBoxIndex = 1;
        for (let i in tblRewardBoxData) {
            rewardBoxs.push(tblRewardBoxData[i]);
        }
        for (let i = 0; i < rewardBoxs.length; i++){
            if (rewardBoxs[i].nActive == active) {
                rewardBoxIndex = i + 1;
                break;
            }
        }
        // let rewardBoxIndex = 1;
        // for (let i in tblRewardBoxData){
        //     if (tblRewardBoxData[i].nActive != active){
        //         rewardBoxIndex += 1; 
        //     }else{
        //         break;
        //     }
        // }
        // if (rewardBoxIndex > 4){
        //     rewardBoxIndex = 1;
        // }
        // 点击领取发送事件
        let mode = 0;
        let confirm = function () {
            GlobalVar.handlerManager().dailyHandler.sendDailyActiveRewardReq(active);
        };

        let platformApi = GlobalVar.getPlatformApi();
        if (platformApi && GlobalVar.me().vipLevel < 3 && (platformApi.canShowRewardVideo() || GlobalVar.getShareControl() == 6)) {
            confirmText = i18n.t('label.4000328');
            mode = 2;
            confirm = function () {
                platformApi.showRewardedVideoAd(225, function () {
                    GlobalVar.handlerManager().dailyHandler.sendDailyActiveRewardReq(active);
                }, null, true, true);
            };
        } else if (platformApi && GlobalVar.me().vipLevel < 3 && !platformApi.canShowRewardVideo() && GlobalVar.getShareControl() == 1) {
            confirmText = i18n.t('label.4000304');
            mode = 1;
            confirm = function () {
                platformApi.shareNormal(125, function () {
                    GlobalVar.handlerManager().dailyHandler.sendDailyActiveRewardReq(active);
                })
            };
        }

        if (!GlobalVar.getShareSwitch()){
            confirm = function () {
                GlobalVar.handlerManager().dailyHandler.sendDailyActiveRewardReq(active);
            };
            mode = 0;
            confirmText = "领取";
        }


        if (GlobalVar.me().dailyData.isActiveRewardReceived(active)) {
            condition = false;
            mode = 0;
            confirmText = "已领取"
        }

        if (rewardBoxData) {
            CommonWnd.showRewardBoxWnd(null, mode, "活跃宝箱", condition, rewardBoxData, confirm, confirmText);
        }
    },

    sortDailyData: function (dailyDatas) {
        let arr = [];
        function compare(property1, property2) {
            return function (a, b) {
                // 按照是否完成排序
                if (a.wID == GameServerProto.PT_DAILY_TASK_AD){
                    return -1;
                }else if (b.wID == GameServerProto.PT_DAILY_TASK_AD){
                    return 1;
                }
                let value1 = a.wID == GameServerProto.PT_DAILY_TASK_VIP_EXP;
                let value2 = b.wID == GameServerProto.PT_DAILY_TASK_VIP_EXP;
                let aCurStep = 0;
                let aServerStep = GlobalVar.me().dailyData.getDailyStepsByID(a.wID);
                aServerStep && (aCurStep = aServerStep);
                a.nVar <= aCurStep && (value1 = value1 || true);
                let bCurStep = 0;
                let bServerStep = GlobalVar.me().dailyData.getDailyStepsByID(b.wID);
                bServerStep && (bCurStep = bServerStep);
                b.nVar <= bCurStep && (value2 = value2 || true);
                value1 = value1 ? 1 : 0;
                value2 = value2 ? 1 : 0;
                if (value1 != value2) {
                    return -(value1 - value2);
                }

                // 按照是否在可领取时间段内排序，目前只有午间晚间体力有规定时间
                let curTimeStamp = GlobalVar.me().serverTime;
                let curTime = GlobalVar.serverTime.getCurrentHHMMSS(curTimeStamp * 1000);
                let time = curTime[0] * 100 + curTime[1];
                let aInTime = 1
                let bInTime = 1;
                if (a.wID == GameServerProto.PT_DAILY_TASK_SP1 || a.wID == GameServerProto.PT_DAILY_TASK_SP2){
                    if (time > a.wEndTime || time < a.wStartTime) {
                        aInTime = 0;
                    }
                }
                if (b.wID == GameServerProto.PT_DAILY_TASK_SP1 || b.wID == GameServerProto.PT_DAILY_TASK_SP2){
                    if (time > b.wEndTime || time < b.wStartTime) {
                        bInTime = 0;
                    }
                }

                if (aInTime != bInTime){
                    return -(aInTime - bInTime);
                }


                let value3 = a[property1];
                let value4 = b[property1];
                if (value3 != value4) {
                    return value3 - value4;
                }
                // 在第一个属性相等的情况下比较第二个属性
                let value5 = a[property2];
                let value6 = b[property2];
                return value5 - value6;
            }
        }
        // 把Tbl表中读到的日常任务数据转化成数组
        for (let key in dailyDatas) {
            arr.push(dailyDatas[key]);
        }
        // 按照bySort和wID两个属性来排序
        arr.sort(compare("bySort", "wID"));
        return arr;
    },

    onDailyBtnRecvClick: function (event) {
        // let dailyData = event.target.parent.data;
        if (!this.recvLock){
            this.targetDailyNode = event.target.parent;
            this.targetDailyNode.getComponent("DailyObject").onDailyBtnRecvClick();
            this.recvLock = true;
            let self = this;
            setTimeout(() => {
                self.recvLock = false;
            }, 1000);
        }
        // console.log("RecvBtnClick")
        // GlobalVar.handlerManager().dailyHandler.sendDailyRewardReq(dailyData.wID);
    },
    onDailyBtnGoClick: function (event) {
        if (!this.recvLock){
            event.target.parent.getComponent("DailyObject").onDailyBtnGoClick();
         }
        // let dailyData = event.target.parent.data;
        // let windowID = dailyData.wWindowID;
        // console.log("goBtnClick = ", windowID);
        // this.goToWnd(windowID);
    },

    showDailyActiveReward: function (event) {
        if (event.ErrCode && event.ErrCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        CommonWnd.showTreasureExploit(event.Item);
        this.initActiveBoxList();
    },

    showDailyReward: function (event) {
        if (event.ErrCode && event.ErrCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            this.recvLock = false;
            return;
        }
        let self = this;

        // 播放音效
        GlobalVar.soundManager().setEffectVolume(0.5);
        GlobalVar.soundManager().playEffect(AUDIO_COMMIT_MISSTION, false, function(){
            GlobalVar.soundManager().setEffectVolume(1);
        });

        this.targetDailyNode.runAction(cc.fadeOut(0.3));
        let effect = this.targetDailyNode.getChildByName("nodeEffect");
        GlobalFunc.playDragonBonesAnimation(effect, function () { 
            effect.active = false;

            self.initActiveBoxList();
            self.initActiveBar();
            self.count = -1;
            self.complete = false;
            self.dailyCount = 0;

            self.initDailyMisstion();
            self.recvLock = false;
            CommonWnd.showTreasureExploit(event.Item);
        })
        // effect.active = true;
        // // effect.getComponent(dragonBones.ArmatureDisplay).stop();
        // effect.getComponent(dragonBones.ArmatureDisplay).playAnimation("animation", 1);
        // let self = this;
        // effect.getComponent(dragonBones.ArmatureDisplay).addEventListener(
        //     dragonBones.EventObject.COMPLETE, DBEvent => {
        //         effect.active = false;

        //         self.initActiveBoxList();
        //         self.initActiveBar();
        //         self.count = -1;
        //         self.complete = false;
        //         self.dailyCount = 0;
        
        //         self.initDailyMisstion();
        //         self.recvLock = false;
        //         CommonWnd.showTreasureExploit(event.Item);
        //     }
        // );
    },

    showNewTaskReward: function (event) {
        if (event.ErrCode && event.ErrCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        CommonWnd.showTreasureExploit(event.Item);
        this.initChallengeTab();
    },

    onNewTaskBtnRecvClick: function (event, customEventData) {
        let platformApi = GlobalVar.getPlatformApi();
        let newTaskRate = GlobalVar.me().dailyData.getNewTaskData();
        if (customEventData == 0) {
            GlobalVar.handlerManager().dailyHandler.sendNewTaskRewardReq(newTaskRate.TaskID);
        } else {
            if (platformApi && (platformApi.canShowRewardVideo() || GlobalVar.getShareControl() == 6)) {
                platformApi.showRewardedVideoAd(234, function () {
                    GlobalVar.handlerManager().dailyHandler.sendNewTaskRewardReq(newTaskRate.TaskID, 1);
                }, null, true, true);
            } else if (platformApi && !platformApi.canShowRewardVideo() && GlobalVar.getShareControl() == 1){
                platformApi.shareNormal(134, function () {
                    GlobalVar.handlerManager().dailyHandler.sendNewTaskRewardReq(newTaskRate.TaskID, 1);
                });
            } else {
                GlobalVar.handlerManager().dailyHandler.sendNewTaskRewardReq(newTaskRate.TaskID, 1);
            }
        }
    },
    onNewTaskBtnGoClick: function (event) {
        let newTaskRate = GlobalVar.me().dailyData.getNewTaskData();
        let taskData = GlobalVar.tblApi.getDataBySingleKey('TblNewTask', newTaskRate.TaskID);
        let windowID = taskData.wWindowID;
        // console.log("goBtnClick = ", windowID);
        this.goToWnd(null, windowID);
    },

    removeListennerAndBanner: function () {
        this.dailyScroll.loopScroll && this.dailyScroll.loopScroll.releaseViewItems();
        GlobalVar.eventManager().removeListenerWithTarget(this);
    },

    goToWnd: function (event, windowID) {
        switch (parseInt(windowID)) {
            case WndTypeDefine.WindowTypeID.E_DT_NORMALEQUIPMENT_WND:            //跳转至装备强化
                this.removeListennerAndBanner();
                WindowManager.getInstance().popView(false, function () {
                    WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMALIMPROVEMENT_WND, function (wnd, name, type) {
                        wnd.getComponent(type).selectEquipment(null, 1);
                    }, false, false);
                }, false, false);
                break;
            case WndTypeDefine.WindowTypeID.E_DT_NORMALPLANE_WND: 
                this.removeListennerAndBanner();
                WindowManager.getInstance().popView(false, function () {
                    WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMALPLANE_WND);
                }, false, false)
                break;
            case WndTypeDefine.WindowTypeID.E_DT_LIMIT_STORE_WND: 
                let systemData = GlobalVar.tblApi.getDataBySingleKey('TblSystem', GameServerProto.PT_SYSTEM_FULI_GIFT);
                if (systemData && GlobalVar.me().level < systemData.wOpenLevel) {
                    GlobalVar.comMsg.showMsg(i18n.t('label.4000258').replace("%d", systemData.wOpenLevel || 0).replace("%d", systemData.strName));
                    return;
                }
                this.removeListennerAndBanner();
                WindowManager.getInstance().popView(false, function () {
                    WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_LIMIT_STORE_WND, function (wnd, name, type) {
                        wnd.getComponent(type).setStoreType(1);
                    });
                }, false, false);
                break;
            case WndTypeDefine.WindowTypeID.E_DT_NORMAL_QUESTLIST_VIEW:          //跳转至关卡界面
                this.removeListennerAndBanner();
                WindowManager.getInstance().popView(false, function () {
                    CommonWnd.showQuestList();
                }, false, false);
                break;
            case WndTypeDefine.WindowTypeID.E_DT_NORMAL_RECHARGE_WND:           //弹出充值窗口
                this.removeListennerAndBanner();
                WindowManager.getInstance().popView(false, function () {
                    CommonWnd.showRechargeWnd();
                }, false, false);
                break;
            case WndTypeDefine.WindowTypeID.E_DT_NORMAL_SP_WND:                 //弹出购买体力窗口
                this.removeListennerAndBanner();
                WindowManager.getInstance().popView(false, function () {
                    CommonWnd.showBuySpWnd();
                }, false, false);
                break;
            case WndTypeDefine.WindowTypeID.E_DT_NORMAL_STORE_WND:              //弹出商店窗口
                this.removeListennerAndBanner();
                WindowManager.getInstance().popView(false, function () {
                    CommonWnd.showStoreWithParam(1);
                }, false, false);
                break;
            case WndTypeDefine.WindowTypeID.E_DT_NORMALDRAW_VIEW:               //弹出十连抽窗口
                this.removeListennerAndBanner();
                WindowManager.getInstance().popView(false, function () {
                    CommonWnd.showDrawView();
                }, false, false);
                break;
            case WndTypeDefine.WindowTypeID.E_DT_GUAZAIMAIN_WND:                //挂载首页
                this.removeListennerAndBanner();
                WindowManager.getInstance().popView(false, function () {
                    CommonWnd.showGuazai();
                }, false, false);
                break;
            case WndTypeDefine.WindowTypeID.E_DT_ENDLESS_CHALLENGE_VIEW:        //无尽挑战
                this.removeListennerAndBanner();
                WindowManager.getInstance().popView(false, function () {
                    CommonWnd.showEndlessView();
                }, false, false);
                break;
            case WndTypeDefine.WindowTypeID.E_DT_NORMAL_RICHTREASURE_WND:       //淘金
                this.removeListennerAndBanner();
                WindowManager.getInstance().popView(false, function () {
                    GlobalVar.handlerManager().drawHandler.sendTreasureData();
                }, false, false);
                break;
            default:
                break;
        }
    },

    checkDelDaily: function (index) {
        let data = this.dailyDatas[index];
        if (!data) return true;
        //当服务器发来的该任务的完成状态为0，意为已经领取，将该任务排除
        let state = GlobalVar.me().dailyData.getDailyStateByID(data.wID);
        if (state == 0) return true;
        //当该任务为领取体力的任务，而还未到时间的时候，将该任务移除
        // if (data.wID == GameServerProto.PT_DAILY_TASK_SP1 || data.wID == GameServerProto.PT_DAILY_TASK_SP2) {
        //     let curTimeStamp = GlobalVar.me().serverTime;
        //     let curTime = GlobalVar.serverTime.getCurrentHHMMSS(curTimeStamp * 1000);
        //     let time = curTime[0] * 100 + curTime[1];
        //     if (time > data.wEndTime || time < data.wStartTime) {
        //         return true;
        //     }
        // }
        //当玩家vip等级为0时，排除指定任务
        let vipLevel = GlobalVar.me().vipLevel;
        if (vipLevel == 0 && data.wID == GameServerProto.PT_DAILY_TASK_VIP) {
            return true;
        }
        //当视频或分享关闭时，观看视频任务不显示
        if (data.wID == GameServerProto.PT_DAILY_TASK_AD){
            return !GlobalVar.getShareSwitch() || !GlobalVar.getVideoAdSwitch();
            // return false;
        }
        //当该任务为月卡任务且IOS支付开关未开启时，排除任务
        if (data.wID == GameServerProto.PT_DAILY_TASK_HIGH_MONTHCARD || data.wID == GameServerProto.PT_DAILY_TASK_MONTHCARD || data.wID == GameServerProto.PT_DAILY_TASK_CZ){
            return GlobalVar.srcSwitch();
        }

        return false;
    }
});
