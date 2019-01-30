

const UIBase = require("uibase");
const GameServerProto = require("GameServerProto");
const GlobalVar = require('globalvar')
const WndTypeDefine = require("wndtypedefine");
const CommonWnd = require("CommonWnd");
const WindowManager = require("windowmgr");
const i18n = require('LanguageData');
const StoreageData = require("storagedata");


var DailyObject = cc.Class({
    extends: UIBase,

    properties: {
        itemIcon: {
            default: null,
            type: cc.Sprite,
        },
        labelName: {
            default: null,
            type: cc.Label,
        },
        labelDesc: {
            default: null,
            type: cc.Label,
        },
        labelReward: {
            default: null,
            type: cc.Label
        },
        btnRecv: {
            default: null,
            type: cc.Button,
        },
        btnGo: {
            default: null,
            type: cc.Button,
        },
        spineEffect: {
            default: null,
            type: sp.Skeleton,
        },
        nodeRequire: {
            default: null,
            type: cc.Node,
        },
        labelCurRate: {
            default: null,
            type: cc.Label,
        },
        labelGoalRate: {
            default: null,
            type: cc.Label,
        },
        data: {
            default: null,
            visible: false,
        },
    },

    onLoad() {
        
    },

    updateDaily: function (data) {
        // this.startTime = new Date().getTime();
        // console.log("updateDaily startTime:", this.startTime);
        this.data = data;
        this.node.opacity = 255;
        //日常任务的标题
        this.labelName.string = data.strName;

        //日常任务的内容显示
        switch (data.wID) {
            case GameServerProto.PT_DAILY_TASK_MONTHCARD:         //月卡任务显示内容还需要修改
                this.labelDesc.string = data.strContent;
                break;
            case GameServerProto.PT_DAILY_TASK_WEEKCARD:
                this.labelDesc.string = data.strContent;
                break;
            default:
                this.labelDesc.string = data.strContent;
                break;
        }

        let path = 'cdnRes/itemicon/99/'+data.wIcon;
        this.itemIcon.node.getComponent("RemoteSprite").loadFrameFromLocalRes(path);
        // this.itemIcon.setClick(true);
        // this.itemIcon.setSpriteEdgeVisible(false);
        // console.log("updateDaily updateReward start:", new Date().getTime());
        //日常任务的奖励显示
        let vipLevel = GlobalVar.me().vipLevel;
        let RewardVec = GlobalVar.tblApi.getDataBySingleKey('TblDailyVIP', vipLevel).oVecReward;
        let activeCount = 0;
        for (let i = 0; i < data.oVecActive.length; i++) {
            let playerLevel = GlobalVar.me().level;
            if (playerLevel <= data.oVecActive[i].wLevel)
                activeCount += data.oVecActive[i].nActive;
        }
        this.labelReward.string = "";
        switch (data.wID) {
            case GameServerProto.PT_DAILY_TASK_VIP:
                for (let i = 0; i < RewardVec.length; i++) {
                    let itemName = GlobalVar.tblApi.getDataBySingleKey('TblItem', RewardVec[i].wItemID).strName;
                    let itemCount = RewardVec[i].nCount;
                    this.labelReward.string += itemName + "*" + itemCount + "  ";
                }
                break;
            case GameServerProto.PT_DAILY_TASK_VIP_EXP:
                let VipExpID = 13;
                let reward = GlobalVar.tblApi.getDataBySingleKey('TblDailyVIP', vipLevel);
                let vipItemData = GlobalVar.tblApi.getDataBySingleKey('TblItem', VipExpID);
                let itemName = vipItemData.strName;
                this.labelReward.string = itemName + "*" + reward.nVIPExp;
                break;
            default:
                for (let i = 0; i < data.oVecReward.length; i++) {
                    let itemName = GlobalVar.tblApi.getDataBySingleKey('TblItem', data.oVecReward[i].wItemID).strName;
                    let itemCount = data.oVecReward[i].nCount;
                    this.labelReward.string += itemName + "*" + itemCount + "  ";
                }
                break;
        }
        if (activeCount != 0) {
            this.labelReward.string += "活跃" + "*" + activeCount + "  ";
        }
        // console.log("updateDaily complete state start:", new Date().getTime());
        // if (data.wID == GameServerProto.PT_DAILY_TASK_SP1 || data.wID == GameServerProto.PT_DAILY_TASK_SP2) {
        //     let curTimeStamp = GlobalVar.me().serverTime;
        //     let curTime = GlobalVar.serverTime.getCurrentHHMMSS(curTimeStamp * 1000);
        //     let time = curTime[0] * 100 + curTime[1];
        //     if (time > data.wEndTime || time < data.wStartTime) {
        //         return true;
        //     }
        // }
        // ///////////////////
        // 日常任务的完成状态显示
        this.btnRecv.node.getComponent("ButtonObject").setText(i18n.t('label.4000241'));
        this.btnRecv.node.getComponent("ButtonObject").fontSize = 28;
        this.btnGo.node.getComponent("ButtonObject").fontSize = 28;
        this.btnRecv.node.getChildByName("spriteVideo").active = false;
        this.btnRecv.node.getChildByName("spriteShare").active = false;
        this.btnGo.node.getChildByName("spriteVideo").active = false;
        this.btnGo.node.getChildByName("spriteShare").active = false;
        if (data.wID == GameServerProto.PT_DAILY_TASK_VIP_EXP) {
            this.btnGo.node.active = false;
            this.btnRecv.node.active = true;
            this.btnRecv.interactable = true;
            this.nodeRequire.active = false;
        } else if (data.wID == GameServerProto.PT_DAILY_TASK_SP1 || data.wID == GameServerProto.PT_DAILY_TASK_SP2){
            let curTimeStamp = GlobalVar.me().serverTime;
            let curTime = GlobalVar.serverTime.getCurrentHHMMSS(curTimeStamp * 1000);
            let time = curTime[0] * 100 + curTime[1];            
            if (time > data.wEndTime || time < data.wStartTime) {
                this.btnRecv.interactable = false;
            }else{
                this.btnRecv.interactable = true;
            }
            if (GlobalVar.getShareSwitch() && GlobalVar.getShareControl() != 6){
                this.btnRecv.node.getComponent("ButtonObject").fontSize = 24;
                this.btnRecv.node.getComponent("ButtonObject").setText("  " + i18n.t('label.4000304'));
                this.btnRecv.node.getChildByName("spriteShare").active = true;
            }else if (GlobalVar.getVideoAdSwitch()){
                this.btnRecv.node.getComponent("ButtonObject").fontSize = 24;
                this.btnRecv.node.getComponent("ButtonObject").setText("  " + i18n.t('label.4000328'));
                this.btnRecv.node.getChildByName("spriteVideo").active = true;
            }
            this.btnGo.node.active = false;
            this.btnRecv.node.active = true;
            this.nodeRequire.active = false;
        } else {
            let curStep = 0;
            let serverStep = GlobalVar.me().dailyData.getDailyStepsByID(data.wID);
            if (serverStep) {
                curStep = serverStep;
            }

            if (data.wID == GameServerProto.PT_DAILY_TASK_AD){
                this.btnGo.node.getComponent("RemoteSprite").setFrame(0);
                this.btnGo.node.getComponent("ButtonObject").fontSize = 24;
                if (!StoreageData.getShareTimesWithKey("rewardedVideoLimit", 99) || GlobalVar.getShareControl() == 6){
                    this.btnGo.node.getComponent("ButtonObject").setText("  " + i18n.t('label.4000328'));
                    this.btnGo.node.getChildByName("spriteVideo").active = true;
                }else {
                    this.btnGo.node.getComponent("ButtonObject").setText("  " + i18n.t('label.4000304'));
                    this.btnGo.node.getChildByName("spriteShare").active = true;
                }
            }else{
                this.btnGo.node.getComponent("RemoteSprite").setFrame(1);
                this.btnGo.node.getComponent("ButtonObject").setText("前往");
            }

            if (data.nVar <= curStep) {
                this.btnGo.node.active = false;
                this.btnRecv.node.active = true;
                this.btnRecv.interactable = true;

                this.nodeRequire.active = false;
                this.btnRecv.node.y = 0;
            } else if (data.nVar != 1 && data.nVar != 0) {
                this.btnRecv.node.active = false;
                this.btnGo.node.active = true;

                this.nodeRequire.active = true;
                this.btnGo.node.y = -16;

                this.labelCurRate.string = curStep;
                this.labelGoalRate.string = data.nVar;
            } else {
                this.btnRecv.node.active = false;
                this.btnGo.node.active = true;
                this.nodeRequire.active = false;
                this.btnGo.node.y = 0;
            }
        }
        // this.node.x = 0;
        // daily.y = daily.y - 100;
        // this.node.active = true;
        // daily.opacity = 255;
        // daily.runAction(cc.sequence(cc.moveBy(0.1, 0, 110), cc.moveBy(0.05, 0, -10)));
        // console.log("updateDaily finish", new Date().getTime());
        // console.log("updateDaily cost time:", new Date().getTime() - this.startTime);
    },

    onDailyBtnRecvClick: function (event) {
        let data = this.data;
        // console.log("RecvBtnClick")
        if (GlobalVar.getShareSwitch() && (data.wID == GameServerProto.PT_DAILY_TASK_SP1 || data.wID == GameServerProto.PT_DAILY_TASK_SP2)){
            let platformApi = GlobalVar.getPlatformApi();
            if (platformApi && GlobalVar.getShareControl() == 1){
                platformApi.shareNormal(121, function(){
                    GlobalVar.handlerManager().dailyHandler.sendDailyRewardReq(data.wID);
                });
            } else if (platformApi && GlobalVar.getShareControl() == 6){
                platformApi.showRewardedVideoAd(221, function () {
                    GlobalVar.handlerManager().dailyHandler.sendDailyRewardReq(data.wID);
                });
            } else if (GlobalVar.configGMSwitch()){
                GlobalVar.handlerManager().dailyHandler.sendDailyRewardReq(data.wID);
            }
        }else{
            GlobalVar.handlerManager().dailyHandler.sendDailyRewardReq(data.wID);
        }
    },
    onDailyBtnGoClick: function (event) {
        let data = this.data;
        let windowID = data.wWindowID;
        console.log("goBtnClick = ", windowID);
        if (data.wID == GameServerProto.PT_DAILY_TASK_AD){
            let platformApi = GlobalVar.getPlatformApi();
            if (platformApi && (platformApi.canShowRewardVideo() || GlobalVar.getShareControl() == 6)){
                platformApi.showRewardedVideoAd(230, function(){
                    GlobalVar.handlerManager().dailyHandler.sendDailyADReq();
                });
            } else if (platformApi && GlobalVar.getShareControl() == 1){
                platformApi.shareNormal(130, function(){
                    GlobalVar.handlerManager().dailyHandler.sendDailyADReq();
                });
            } else if (GlobalVar.configGMSwitch()){
                GlobalVar.handlerManager().dailyHandler.sendDailyADReq();
            }
        }else{
            this.goToWnd(windowID);
        }
    },
    removeListennerAndBanner: function () {
        let wndType = WndTypeDefine.WindowType.E_DT_NORMAL_DAILY_MISSION_WND;
        let dailyMissionNode = WindowManager.getInstance().findViewInWndNode(wndType);
        dailyMissionNode && GlobalVar.eventManager().removeListenerWithTarget(dailyMissionNode.getComponent(wndType));
        dailyMissionNode.getComponent(wndType).dailyScroll.loopScroll.releaseViewItems();

    },

    goToWnd: function (windowID) {
        switch (windowID) {
            case WndTypeDefine.WindowTypeID.E_DT_NORMALEQUIPMENT_WND:            //跳转至装备强化
                this.removeListennerAndBanner();
                WindowManager.getInstance().popView(false, function () {
                    WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMALIMPROVEMENT_WND, function (wnd, name, type) {
                        wnd.getComponent(type).selectEquipment(null, 1);
                    }, true, false);
                }, false, false);
                break;
            case WndTypeDefine.WindowTypeID.E_DT_NORMAL_QUESTLIST_VIEW:          //跳转至关卡界面
                this.removeListennerAndBanner();
                WindowManager.getInstance().popView(false, function () {
                    CommonWnd.showQuestList();
                }, false, false);
                break;
            case WndTypeDefine.WindowTypeID.E_DT_LIMIT_STORE_WND: 
                let limitSystemData = GlobalVar.tblApi.getDataBySingleKey('TblSystem', GameServerProto.PT_SYSTEM_FULI_GIFT);
                if (limitSystemData && GlobalVar.me().level < limitSystemData.wOpenLevel) {
                    GlobalVar.comMsg.showMsg(i18n.t('label.4000258').replace("%d", limitSystemData.wOpenLevel || 0).replace("%d", limitSystemData.strName));
                    return;
                }
                this.removeListennerAndBanner();
                WindowManager.getInstance().popView(false, function () {
                    WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_LIMIT_STORE_WND, function (wnd, name, type) {
                        wnd.getComponent(type).setStoreType(1);
                    });
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
                let systemData = GlobalVar.tblApi.getDataBySingleKey('TblSystem', GameServerProto.PT_SYSTEM_STORE);
                if (systemData && GlobalVar.me().level < systemData.wOpenLevel) {
                    GlobalVar.comMsg.showMsg(i18n.t('label.4000258').replace("%d", systemData.wOpenLevel || 0).replace("%d", systemData.strName));
                    return;
                }

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
                let endlessSystemData = GlobalVar.tblApi.getDataBySingleKey('TblSystem', GameServerProto.PT_SYSTEM_ENDLESS);
                if (GlobalVar.me().level < endlessSystemData.wOpenLevel){
                    GlobalVar.comMsg.showMsg(i18n.t('label.4000258').replace("%d", endlessSystemData.wOpenLevel).replace("%d", endlessSystemData.strName));
                    return;
                }

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

});