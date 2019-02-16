const UIBase = require("uibase");
const GlobalVar = require("globalvar");
const SceneDefines = require("scenedefines");
const BattleManager = require('BattleManager');
const EventMsgID = require("eventmsgid");
const CommonWnd = require("CommonWnd");
const GameServerProto = require("GameServerProto");
const i18n = require('LanguageData');
const weChatAPI = require("weChatAPI");
const GlobalFunc = require('GlobalFunctions');
const config = require("config");
const StoreageData = require("storagedata");

var UIMain = cc.Class({
    extends: UIBase,

    properties: {
        edbxGMCMD: {
            default: null,
            type: cc.EditBox
        },
    },

    onLoad: function () {
        this._super();
        this.initUIMain();
        this.registerEvent();
        this.checkFlagSetHotPoint();
        this.getVoucher();
        this.updateExpBar();
        this.judgeLevelUp();
        this.setMode();
        this.onShowFunc = null;

        if (!GlobalFunc.isAllScreen() && !this.fixViewComplete) {
            this.fixViewComplete = true;
            this.fixView();
        }
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            if (GlobalVar.firstTimeLaunch) {
                // this.checkInvite();
                this.reportMaterialClick();
                this.listenOfficeAccountJump();
                weChatAPI.setWithShareTicket(true);
                weChatAPI.getMaterials(function (data) {
                    console.log("Materials:", data);
                    wx.showShareMenu();
                    wx.onShareAppMessage(res => {
                        if (res.from === 'button') {
                            console.log("来自页面内转发按钮");
                            console.log(res.target);
                        } else {
                            console.log("来自右上角转发菜单")
                        }
                        weChatAPI.reportShareMaterial(101);
                        let str = "materialID=" + 101;
                        str += "&uid=" + GlobalVar.me().loginData.getLoginReqDataAccount();
                        str += "&from_openid=" + GlobalVar.me().loginData.getLoginReqDataAccount();
                        return {
                            title: data[101][0].content,
                            //   path: '',
                            imageUrl: data[101][0].cdnurl,
                            query: str,
                        }
                    })
                });
                weChatAPI.createRewardedVideoAd();
                weChatAPI.createBannerAdList();
            }

            if (GlobalVar.me().roleID == GlobalVar.me().roleName) {
                weChatAPI.getUserInfo(function (userInfo) {
                    GlobalVar.me().roleName = userInfo.nickName;
                    GlobalVar.me().loginData.setLoginReqDataAvatar(userInfo.avatarUrl);
                    GlobalVar.handlerManager().mainHandler.sendReNameReq(GlobalVar.me().roleID, userInfo.nickName, userInfo.avatarUrl);
                })
            }

            GlobalVar.me().adData.pullInfo();
        } else if (window && window["wywGameId"] == "5469") {
            // this.reportMaterialClick();
            qqPlayAPI.getMaterials(function (data) {
                console.log("拉取到的文案:", data);
            });
            this.getNodeByName("btnoMoreFunGame").active = false;
        }

        let nodeFeed = this.getNodeByName("btnoRecharge");
        let nodefirst = this.getNodeByName("btnoFirstCharge");
        if (!GlobalVar.srcSwitch()) {
            nodeFeed.active = true;
            nodefirst.active = true;
        } else {
            nodeFeed.active = false;
            nodefirst.active = false;
        }
        if (!GlobalVar.getShareSwitch()) {
            this.getNodeByName('btnoFreeDiamond').active = false;
            this.getNodeByName('btnoShareDaily').active = false;
        }
        
    },

    fixView: function () {
        let bottomWidget = this.node.getChildByName("nodeBottom").getComponent(cc.Widget);
        bottomWidget.bottom = -0.5 * this.getNodeByName("spriteBottom").getContentSize().height;
        bottomWidget.updateAlignment();

        let topWidget = this.node.getChildByName("imgTopBg").getComponent(cc.Widget);
        topWidget.top = -1 * this.getNodeByName("spriteTop").getContentSize().height;
        topWidget.updateAlignment();

        this.getNodeByName("planeNode").getComponent(cc.Widget).updateAlignment();

        let planetWidget = this.getNodeByName('imgPlanet').getComponent(cc.Widget);
        planetWidget.top = 250;
        planetWidget.updateAlignment();
    },

    start: function () {
        StoreageData.setShareTimesWithKey("shareDailyLimit", 1)
        let block = cc.find("Canvas/BlockNode");
        if (cc.isValid(block)) {
            block.active = true;
        }
        let self = this;
        BattleManager.getInstance().quitOutSide();
        BattleManager.getInstance().startOutside(this.getNodeByName("planeNode"), GlobalVar.me().memberData.getStandingByFighterID(), true, function () {
            if (cc.isValid(block)) {
                block.active = false;
            }
        });
        require('Guide').getInstance().enter(this.showDeskIcon.bind(this));

        GlobalVar.handlerManager().campHandler.sendGetCampBagReq(GameServerProto.PT_CAMPTYPE_MAIN);
        GlobalVar.handlerManager().rewardCenterHandler.sendRewardCenterReq();
        GlobalVar.handlerManager().limitTimeBoxHandler.sendGetLtbDataReq();

        this.showLaunchWindow();
        this.showDeskIcon();
    },

    showLaunchWindow: function () {
        if (config.NEED_GUIDE) {
            return;
        }
        let isShowNotice = false;
        let isShowShareDaily = false;
        let isShowInviteReward = false;

        if (!GlobalVar.me().alreadedShowNotice) {
            let noticeCount = GlobalVar.me().noticeData.getNoticeCount();
            GlobalVar.me().alreadedShowNotice = true;
            if (noticeCount > 0) {
                isShowNotice = true;
            }
        }
        if (!GlobalVar.me().shareData.getShareDailyState() && GlobalVar.getShareSwitch() && GlobalVar.me().level >= 7 &&
            StoreageData.getShareTimesWithKey("shareDailyLimit", 1) == 1 && GlobalVar.firstTimeLaunch) {
            isShowShareDaily = true;
            CommonWnd.showShareDailyWnd();
        }
        if (GlobalVar.getShareSwitch() && GlobalVar.getShareControl() == 1 && StoreageData.getShareTimesWithKey("firstTimeLaunchGame", 0) && GlobalVar.me().shareData.getInviteGiftBagState() < (GlobalVar.tblApi.getLength("TblFuliInvite")) && GlobalVar.firstTimeLaunch) {
            isShowInviteReward = true;
        } else if (!StoreageData.getShareTimesWithKey("firstTimeLaunchGame", 0)) {
            StoreageData.setShareTimesWithKey("firstTimeLaunchGame", 0);
        }

        if (isShowNotice) {
            if (isShowShareDaily) {
                if (isShowInviteReward) {
                    CommonWnd.showNoticeWnd(function () {
                        CommonWnd.showShareDailyWnd(function () {
                            CommonWnd.showInviteRewardWnd();
                        });
                    });
                } else {
                    CommonWnd.showNoticeWnd(function () {
                        CommonWnd.showShareDailyWnd();
                    });
                }
            } else if (isShowInviteReward) {
                CommonWnd.showNoticeWnd(function () {
                    CommonWnd.showInviteRewardWnd();
                });
            } else {
                CommonWnd.showNoticeWnd();
            }
        } else if (isShowShareDaily) {
            if (isShowInviteReward) {
                CommonWnd.showShareDailyWnd(function () {
                    CommonWnd.showInviteRewardWnd();
                });
            } else {
                CommonWnd.showShareDailyWnd();
            }
        } else if (isShowInviteReward) {
            CommonWnd.showInviteRewardWnd();
        }

        setTimeout(() => {
            let block = cc.find("Canvas/BlockNode");
            if (cc.isValid(block)) {
                block.active = false;
            }
        }, 500);

        // 请求公众号奖励
        if (GlobalVar.isFromOfficialAccount) {
            if (GlobalVar.me().getLevel() >= 4 && GlobalVar.me().fuLiGCBag.OfficialAccountDraingetFlag == 0 && GlobalVar.getShareSwitch()) {
                GlobalVar.handlerManager().followRewardHandler.sendOfficeAccountReq();
            }
        }

        GlobalVar.firstTimeLaunch = false;
    },

    update: function (dt) {

    },

    registerEvent: function () {
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GOLD_NTF, this.updateGold, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_DIAMOND_NTF, this.updateDiamond, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_SPCHANGE_NTF, this.updateSp, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_COMBATPOINT_CHANGE_NTF, this.updateCombatPoint, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_LEVELUP_NTF, this.showPlayerLevelUpWnd, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_NEWTASK_REWARD, this.setNewTaskDesc, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_LOGIN_DATA_NTF, this.onLoginDataEvent, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GETDAILY_DATA, this.dailyMsgRecv, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GETACTIVE_LIST, this.activeMsgRecv, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_RICHTREASURE_RESULT, this.richTreasureMsgRecv, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_RETURNTO_LOGINSCENE, this.quitBattlePlane, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_RCGBAG_RESULT, this.rcgbagRecv, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_EXPCHANGE_NTF, this.updateExpBar, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_NEWTASK_NTF, this.updateNewTask, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_SHARE_DAILY_DATA, this.getShareDailyData, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_SUPER_REWARD_DATA, this.hideSuperFuliBtn, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_SIGN_DATA, this.signMsgRecv, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_LEVELUP_DOUBLE_REWARD, this.levelDoubleReward, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_REWARD_CENTER_DATA, this.rewardCenterBack, this);

        //RENAME
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_RENAME_ACK, this.getReNameData, this);

        //hotpoint
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_SET_MAIL_FLAG, this.setMailFlag, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_DAILY_FLAG_CHANGE, this.setDailyFlag, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_ACTIVE_FLAG_CHANGE, this.setActiveFlag, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_STORE_NORMAL_FLAG_CHANGE, this.setNormalStoreFlag, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GUAZAI_FLAG_CHANGE, this.setGuazaiFlag, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_EQUIPT_FLAG_CHANGE, this.setEquiptFlag, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_MEMBER_FLAG_CHANGE, this.setMemberFlag, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_THEBAG_FLAG_CHANGE, this.setBagFlag, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_FULICZ_FLAG_CHANGE, this.setFuliFlag, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_CAMP_FLAG_CHANGE, this.setCampFlag, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_VIP_REWARD_FLAG_CHANGE, this.setRechargeFlag, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_FREE_DIAMOND_FLAG_CHANGE, this.setFreeDiamondFlag, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_LIMIT_STORE_FLAG_CHANGE, this.setLimitStoreFlag, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_SIGN_FLAG_CHANGE, this.setSignFlag, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_TREASURE_FLAG_CHANGE, this.setTreasuryFlag, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_ARENA_DAY_REWARD_DATA, this.setArenaFlag, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_REFRESH_AD_TASK_HOT_FLAG, this.setAdTaskFlag, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_LTB_HOT_FLAG, this.setLtbFlag, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_MAINTASK_FLAG_CHANGE, this.setMainTaskFlag, this);
        

        //gm
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GM_SWITCH_CHANGE, this.setMode, this);

        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_ARENA_OPEN_DATA, this.getArenaOpenData, this);

        // 领取公众号奖励
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_FOLLOW_REWARD_GET, this.OnGetFollowReward, this);
        // 盒子跳转奖励        
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_BOX_REWARD_GET, this.OnGetBoxReward, this);
        // 邀请礼包奖励
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_INVITE_REWARD_DATA, this.onGetInviteRewardData, this);

        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GETACTIVE_DATA, this.getActiveData, this);

        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_LTB_DATA, this.resetLtbShow, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_LTB_REWARD, this.resetRewardLtbShow, this);
    },

    checkFlagSetHotPoint: function () {
        let flags = GlobalVar.me().statFlags;

        this.setActiveFlag();
        this.setDailyFlag();
        this.setNormalStoreFlag();
        this.setGuazaiFlag();
        this.setEquiptFlag();
        this.setMemberFlag();
        this.setBagFlag();
        this.setFuliFlag();
        this.setRechargeFlag();
        this.setFreeDiamondFlag();
        this.setLimitStoreFlag();
        this.setSignFlag();
        this.setTreasuryFlag();
        this.setMainTaskFlag();
        // 邮件要先获取邮件信息才可以判断是否有红点
        this.setMailFlag();

        this.setArenaFlag();
        this.setAdTaskFlag();
        this.setAdExpFlag();
        this.setLtbFlag();
    
    },

    judgeLevelUp: function () {
        if (!config.NEED_GUIDE) {
            GlobalVar.me().getLevelUpData();
        }
    },

    updateExpBar: function () {
        let level = GlobalVar.me().getLevel();
        let levelUpData = GlobalVar.tblApi.getDataBySingleKey('TblLevel', level);
        let levelUpNeedExp = levelUpData.dwExp;
        let exp = GlobalVar.me().getExp();
        let percent = exp / levelUpNeedExp;
        this.getNodeByName('ExpProgress').getComponent(cc.Sprite).fillRange = percent;
    },

    hideSuperFuliBtn: function () {
        let btnoSuperGift = this.getNodeByName("btnoSuperGift");
        btnoSuperGift && (btnoSuperGift.active = false);
    },

    getVoucher: function () {
        GlobalVar.handlerManager().rechargeHandler.sendRcgBagReq();
    },

    setFreeFuliFlag: function () {
        // let task = GlobalVar.me().adData.getTaskHotFlag();
        // let shareDaily = !GlobalVar.me().shareData.getShareDailyState() && GlobalVar.getShareSwitch() && GlobalVar.me().level >= 7;
        // let heZiDiamond = GlobalVar.isAndroid && GlobalVar.me().fuLiGCBag.HeZiDiamondReward == 0 && GlobalVar.me().level >= 4;
        // let account = GlobalVar.me().fuLiGCBag.OfficialAccountDraingetFlag == 0 && GlobalVar.me().level >= 4;
        // let superReward = !GlobalVar.me().shareData.getSuperRewardState();
        // let inviteGift = GlobalVar.isAndroid && GlobalVar.me().shareData.getInviteGiftBagState() < (GlobalVar.tblApi.getLength("TblFuliInvite"));
        // let flag = task || shareDaily || heZiDiamond || account || superReward || inviteGift;
        let drawer1 = this.getNodeByName('drawer1');
        let flag = false;
        for (let i = 0; i < drawer1.childrenCount; i++) {
            let child = drawer1.children[i];
            if (child.active && child.getChildByName('spriteHot').active) {
                flag = true;
                break;
            }
        }
        this.setFlagByNodeName("btnoFuli", flag && !config.NEED_GUIDE);
    },

    setTreasuryFlag: function () {
        let nextFreeTime = GlobalVar.me().drawData.getNextFreeTime();
        this.setFlagByNodeName("btnoTreasury", nextFreeTime <= GlobalVar.me().serverTime);
    },

    setFreeDiamondFlag: function (event) {
        let curTime = GlobalVar.me().shareData.getFreeDiamondCount();
        let maxTime = GlobalVar.tblApi.getDataBySingleKey('TblParam', GameServerProto.PTPARAM_RCG_FREE_DIAMOND_COUNT_MAX).dValue;
        this.setFlagByNodeName("btnoFreeDiamond", curTime < maxTime);
    },

    setGuazaiFlag: function (event) {
        //挂载的红点
        let flag = GlobalVar.me().guazaiData.getHotPointData();
        this.setFlagByNodeName("btnoGuazai", flag);
    },
    setEquiptFlag: function (event) {
        let flag = GlobalVar.me().leaderData.getHotPointData();
        this.setFlagByNodeName("btnoEquipment", flag);
    },
    setMemberFlag: function (event) {
        let flag = GlobalVar.me().memberData.getStandingByFighterHotPointData();
        this.setFlagByNodeName("btnoPlane", flag);
    },
    setBagFlag: function (event) {
        let flag = GlobalVar.me().bagData.getHotPointData();
        this.setFlagByNodeName("btnoBag", flag);
    },
    setMailFlag: function (event) {
        let notReadMailCount = GlobalVar.me().mailData.getNotReadMailCont();
        if (notReadMailCount == -1) {
            // 邮件要先获取邮件信息才可以判断是否有红点
            GlobalVar.handlerManager().mailHandler.sendGetMailListReq(GameServerProto.PT_MAIL_TYPE_SYS);
            return;
        }
        let flags = GlobalVar.me().statFlags;
        flags.MailStateFlag = notReadMailCount;
        this.setFlagByNodeName("btnoMail", flags.MailStateFlag);
    },
    setDailyFlag: function (event) {
        let flags = GlobalVar.me().statFlags;
        this.setFlagByNodeName("btnoDaily", flags.DailyFlag);
    },
    setMainTaskFlag: function (event) {
        let flags = GlobalVar.me().statFlags;
        this.setFlagByNodeName("btnoDaily", flags.MainTaskFlag);
    },
    setActiveFlag: function (event) {
        let flags = GlobalVar.me().statFlags;
        this.setFlagByNodeName("btnoActivity", flags.AMSFlag);
        this.getNodeByName('btnoActivity').getChildByName('effect').active = !!flags.AMSFlag;
    },
    setNormalStoreFlag: function (event) {
        let flags = GlobalVar.me().statFlags;
        this.setFlagByNodeName("btnoStore", flags.StoreNormalFlag);
    },
    setFuliFlag: function (event) {
        let flags = GlobalVar.me().statFlags;
        let flag = false;
        let diamondcz = GlobalVar.me().diamondCz;
        let dailyData = GlobalVar.me().feedbackData.data.Daily;
        if (!dailyData) {
            GlobalVar.handlerManager().feedbackHandler.sendGetFeedbackDataReq();
            return;
        }
        let feedbackDataList = GlobalVar.tblApi.getData('TblFuLiCZ');
        let length = GlobalVar.tblApi.getLength("TblFuLiCZ");
        let showData = [];
        for (let i = 1; i <= length; i++) {
            let feedbackData = feedbackDataList[i]
            if (!feedbackData || diamondcz < feedbackData.dwCondition) {
                break;
            }
            showData.push(feedbackData);
        }

        for (let i = 0; i < showData.length; i++) {
            if (dailyData.indexOf(showData[i].byID) == -1) {
                flag = true;
            }
        }
        this.setFlagByNodeName("btnoFirstCharge", flags.FuLiCZFlag || flag);
    },

    setCampFlag: function (data) {
        this.setFlagByNodeName("btnoCharpter", data.length > 0);
    },

    setRechargeFlag: function (event) {
        let flag = GlobalVar.me().rechargeData.getCanGetRewardHotFlag();
        this.setFlagByNodeName("btnoRecharge", flag);
    },

    setAdTaskFlag: function (event) {
        let flag = GlobalVar.me().adData.getTaskHotFlag();
        this.setFlagByNodeName("btnoAdTask", flag);
        this.setFreeFuliFlag();
    },

    setLtbFlag: function (event) {
        let flags = GlobalVar.me().statFlags;
        this.setFlagByNodeName("btnoLimitTimeBox", flags.FuliOnlineFlag);
        if(!!flags.FuliOnlineFlag) {
            let btnoLbx = this.getNodeByName("btnoLimitTimeBox");
            let lblCountDown = btnoLbx.getChildByName("lblcountdown");
            lblCountDown.active = false;
        }
    },

    setAdExpFlag: function () {
        let flag = GlobalVar.me().adData.getAdExpHotFlag();
        this.setFlagByNodeName('btnoAdExp', flag);
    },

    setLimitStoreFlag: function (event) {
        let flags = GlobalVar.me().statFlags;
        this.setFlagByNodeName("btnoLimitStore", flags.FuLiLimitGiftFlag);
    },

    setSignFlag: function (event) {
        let flags = GlobalVar.me().statFlags;
        this.setFlagByNodeName("btnoSign", flags.SigninFlag);

        if (flags.SigninFlag && GlobalVar.getShareSwitch()) {
            let btnoSign = this.getNodeByName("btnoSign");
            if (btnoSign && !btnoSign.active) {
                btnoSign.active = true;
            }
        }
    },

    setArenaFlag: function (event) {
        let flag = GlobalVar.me().arenaData.getArenaRewardFlag();
        this.setFlagByNodeName("btnoArena", flag);
    },

    setFlagByNodeName: function (nodeName, flag) {
        let node = this.getNodeByName(nodeName);
        if (!!node) {
            let spriteHot = node.getChildByName("spriteHot");
            if (!!spriteHot) {
                spriteHot.active = !!flag;
            } else {
                console.log("spriteHot is not exits");
            }
        } else {
            console.log(nodeName + "is not exits");
        }
        // this.getNodeByName(nodeName).getChildByName("spriteHot").active = !!flag;
    },

    quitBattlePlane: function () {
        BattleManager.getInstance().quitOutSide();
        GlobalVar.sceneManager().gotoScene(SceneDefines.LOGIN_STATE);
    },

    initUIMain: function () {
        this.setGold(GlobalVar.me().getGold());
        this.setDiamond(GlobalVar.me().getDiamond());

        this.setEnergy(GlobalVar.me().getSpData(), GlobalVar.me().getVipLevel());

        this.setRollName(GlobalVar.me().getRoleName() || "");
        this.setPlayerLevel(GlobalVar.me().getLevel() || 0);
        this.setPlayerCombat(GlobalVar.me().getCombatPoint() || 0);
        this.setPlayerAvatar(GlobalVar.me().loginData.getLoginReqDataAvatar());

        this.setNewTaskDesc(GlobalVar.me().dailyData.getNewTaskData(), GameServerProto.PT_NEW_TASK_TYPE_CAMP);
    },

    getReNameData: function (data) {
        if (data.ErrCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(data.ErrCode);
            return;
        }

        this.setPlayerAvatar(GlobalVar.me().loginData.getLoginReqDataAvatar());
        this.setRollName(GlobalVar.me().getRoleName() || "");
    },

    checkInvite: function () {
        weChatAPI.judgeInvite();
    },
    reportMaterialClick: function () {
        let platformApi = GlobalVar.getPlatformApi();
        if (platformApi) {
            if (!(cc.sys.platform == cc.sys.WECHAT_GAME)) {
                return;
            }
            this.onShowFunc = function (res) {
                console.log("主城上报文案点击:", res.query.materialID);
                if (res.query.materialID >= 0) {
                    platformApi.reportClickMaterial(res.query.materialID);
                }
            };
            platformApi.setOnShowListener(this.onShowFunc);
        }
    },
    // 监听是否是从公众号进入游戏的
    listenOfficeAccountJump: function () {
        let platformApi = GlobalVar.getPlatformApi();
        if (platformApi) {
            if (!(cc.sys.platform == cc.sys.WECHAT_GAME)) {
                return;
            }
            this.onOAShowFunc = function (launchInfo) {
                if (launchInfo.query['vpnaFlag'] == 1) {
                    if (GlobalVar.me().getLevel() >= 4 && GlobalVar.me().fuLiGCBag.OfficialAccountDraingetFlag == 0 && GlobalVar.getShareSwitch()) {
                        GlobalVar.handlerManager().followRewardHandler.sendOfficeAccountReq();
                    }
                }
            };
            platformApi.setOnShowListener(this.onOAShowFunc);
        }
    },

    showPlayerLevelUpWnd: function (event) {
        CommonWnd.showPlayerLevelUpWnd(event);
        this.setPlayerLevel(event.LevelCur);
    },

    levelDoubleReward: function (data) {
        let item = [
            {
                ItemID: 1,
                Count: data.GoldReward,
            },
            {
                ItemID: 15,
                Count: data.SpReward,
            }
        ]
        CommonWnd.showTreasureExploit(item);
    },

    updateGold: function () {
        this.setGold(GlobalVar.me().getGold());
    },

    updateDiamond: function () {
        this.setDiamond(GlobalVar.me().getDiamond());
    },
    updateSp: function () {
        this.setEnergy(GlobalVar.me().getSpData(), GlobalVar.me().getVipLevel());
    },
    updateCombatPoint: function (data) {
        this.setPlayerCombat(GlobalVar.me().getCombatPoint() || 0);
        if (data.combatUpflag) {
            GlobalVar.comMsg.showCombatPoint(data.delta, data.combatPoint, data.lastCombatPoint);
        }
    },

    setGold: function (num) {
        num = typeof num !== 'undefined' ? num : 0;
        let imgTopBg = this.node.getChildByName("imgTopBg");
        let lblGold = imgTopBg.getChildByName("nodeGold").getChildByName("lblGold").getComponent(cc.Label);
        if (num > 999999) {
            if (num > 999999999) {
                num = 999999999;
            }
            num = Math.floor(num / 10000);
            num += ";<";
            if (!lblGold.node.oldPos) {
                lblGold.node.oldPos = lblGold.node.position;
            }
            lblGold.node.x = (lblGold.node.oldPos.x + 13);
        } else {
            if (lblGold.node.oldPos) {
                lblGold.node.x = (lblGold.node.oldPos.x);
            }
        }
        lblGold.string = num;
    },

    setDiamond: function (num) {
        num = typeof num !== 'undefined' ? num : 0;
        let imgTopBg = this.node.getChildByName("imgTopBg");
        let lblDiamond = imgTopBg.getChildByName("nodeDiamond").getChildByName("lblDiamond").getComponent(cc.Label);
        if (num > 999999) {
            if (num > 999999999) {
                num = 999999999;
            }
            num = Math.floor(num / 10000);
            num += ";<";
            if (!lblDiamond.node.oldPos) {
                lblDiamond.node.oldPos = lblDiamond.node.position;
            }
            lblDiamond.node.x = (lblDiamond.node.oldPos.x + 13);
        } else {
            if (lblDiamond.node.oldPos) {
                lblDiamond.node.x = (lblDiamond.node.oldPos.x);
            }
        }
        lblDiamond.string = num;
    },

    setEnergy: function (spData, vipLevel) {
        spData.Sp = typeof spData.Sp !== 'undefined' ? spData.Sp : 0;
        let imgTopBg = this.node.getChildByName("imgTopBg");
        let lblSp = imgTopBg.getChildByName("nodeSp").getChildByName("lblSp").getComponent(cc.Label);
        // this.labelAtlasEnergy.string = cur + "/" + max;
        let spLimit = GlobalVar.tblApi.getDataBySingleKey("TblSpVip", vipLevel).wSpLimit;
        lblSp.string = (spData.Sp > 9999 ? 9999 : spData.Sp) + "/" + spLimit;
    },

    setPlayerCombat: function (combatPoint) {
        combatPoint = typeof combatPoint !== 'undefined' ? combatPoint : 0;
        let imgTopBg = this.node.getChildByName("imgTopBg");
        let lblCp = imgTopBg.getChildByName("lblCp").getComponent(cc.Label);
        lblCp.string = combatPoint;
    },

    setRollName: function (rollName) {
        var interceptStr = function (str, lens, strEnd) {
            if (str == null)
                return '';
            if (strEnd == undefined) strEnd = '';
            let len = 0;
            for (let i = 0; i < str.length; i++) {
                let c = str.charCodeAt(i);
                if (c >= 0 && c <= 128)
                    len++;
                else
                    len += 2;
                if (len > lens)
                    return str.substr(0, i) + strEnd;
            }
            return str;
        };
        let imgTopBg = this.node.getChildByName("imgTopBg");
        let lblName = imgTopBg.getChildByName("nodeUserInfo").getChildByName("lblName").getComponent(cc.Label);
        lblName.string = interceptStr(rollName, 6, '...');
    },

    setPlayerLevel: function (level) {
        let imgTopBg = this.node.getChildByName("imgTopBg");
        let lblLv = imgTopBg.getChildByName("nodeUserInfo").getChildByName("lblLv").getComponent(cc.Label);
        lblLv.string = i18n.t('label.4000229') + level;

        // let lblNameNode = imgTopBg.getChildByName("lblName")
        // lblLv.node.getComponent(cc.Widget).left = lblNameNode.width + 10;
        // lblLv.node.getComponent(cc.Widget).updateAlignment();
    },

    setPlayerAvatar: function (url) {
        if (cc.sys.platform !== cc.sys.WECHAT_GAME && !(window && window["wywGameId"] == "5469")) {
            return;
        }
        if (url == "") {
            return;
        }
        let imgTopBg = this.node.getChildByName("imgTopBg");
        let spriteAvatarImg = imgTopBg.getChildByName("spriteAvatarImg");
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            url = url + "?a=a.png";
        } else if (window && window["wywGameId"] == "5469") {
            url = "http://mwxsdk.phonecoolgame.com/avatar.php?s=" + encodeURIComponent(url);
            url = url + "?a=a.png";
            console.log("url:", url);
        }
        cc.loader.load({
            url: url,
            type: 'png'
        }, function (err, tex) {
            if (err) {
                cc.error("LoadURLSpriteFrame err." + url);
            }
            let spriteFrame = new cc.SpriteFrame(tex);
            spriteAvatarImg.getComponent("RemoteSprite").spriteFrame = spriteFrame;
        })
    },

    setNewTaskDesc: function (newTask, mode) {
        if (!newTask) {
            newTask = GlobalVar.me().dailyData.getNewTaskData();
        } else if (mode != 1) {
            newTask = newTask.NewTaskBag;
        }
        if (newTask) {
            let taskData = GlobalVar.tblApi.getDataBySingleKey('TblNewTask', newTask.TaskID);
            console.log("newTaskData:", taskData);
            if (taskData) {
                let btnoTask = this.node.getChildByName("nodeBottom").getChildByName("btnoTask")
                btnoTask.getChildByName("labelTaskName").getComponent(cc.Label).string = taskData.strName;
                let maxRate = taskData.nVar;
                let curRate = newTask.Var;
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
                if (parseInt(curRate) > 99999) {
                    curRate = parseInt(curRate / 10000) + "万";
                }
                if (parseInt(maxRate) > 99999) {
                    maxRate = parseInt(maxRate / 10000) + "万";
                }
                btnoTask.getChildByName("labelTaskRate").getComponent(cc.Label).string = "(" + curRate + "/" + maxRate + ")";

                this.setFlagByNodeName("btnoTask", curRate == maxRate);
            }
        }
    },

    updateNewTask: function (data) {
        this.setNewTaskDesc(data, GameServerProto.PT_NEW_TASK_TYPE_CAMP);
    },

    getShareDailyData: function (event) {
        if (event.ErrCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }

        let btnoShareDaily = this.getNodeByName("btnoShareDaily");
        btnoShareDaily && (btnoShareDaily.active = false);
    },

    onGetInviteRewardData: function (event) {
        if (event.ErrCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }

        if (GlobalVar.getShareSwitch() && GlobalVar.me().shareData.getInviteGiftBagState() >= (GlobalVar.tblApi.getLength("TblFuliInvite"))) {
            let btnoInvite = this.getNodeByName("btnoInvite");
            btnoInvite && (btnoInvite.active = false);
        }
    },

    onDestroy: function () {
        if (this.btnAuthorize) {
            this.btnAuthorize.destroy();
            this.btnAuthorize = null;
        }

        // 删除限时宝箱计时器
        if(!!this.ltbTimeHandler) {
            GlobalVar.gameTimer().delTimer(this.ltbTimeHandler);
            this.ltbTimeHandler = null;
        }
        // let platformApi = GlobalVar.getPlatformApi();
        // if (platformApi) {
        //     platformApi.setOffShowListener(this.onShowFunc);
        // }
        GlobalVar.eventManager().removeListenerWithTarget(this);
    },

    onPlaneClick: function (event) {
        CommonWnd.showNormalPlane();
    },

    onEquipClick: function (event) {
        CommonWnd.showImprovementView();
    },

    onLoginDataEvent: function (evt, data) {
        // cc.log("recv event " + evt);
        // console.log("recv event " + evt);
    },

    onSettingBtnClicked: function (event) {
        // CommonWnd.showSettingWnd();
        // this.onInviteBtnClick();
        CommonWnd.showSmelterWnd();
    },
    onArenaBtnClicked: function (event) {
        let arenaSystemData = GlobalVar.tblApi.getDataBySingleKey('TblSystem', GameServerProto.PT_SYSTEM_ARENA);
        if (GlobalVar.me().level < arenaSystemData.wOpenLevel) {
            GlobalVar.comMsg.showMsg(i18n.t('label.4000258').replace("%d", arenaSystemData.wOpenLevel).replace("%d", arenaSystemData.strName));
            return;
        }

        GlobalVar.handlerManager().arenaHandler.sendArenaOpenReq();
    },
    getArenaOpenData: function (event) {
        if (event.ErrCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        CommonWnd.showArenaMainWnd();
    },
    onInviteBtnClick: function (event) {
        if (GlobalVar.me().shareData.getInviteGiftBagState() >= (GlobalVar.tblApi.getLength("TblFuliInvite"))) {
            GlobalVar.comMsg.showMsg("已经领取");
        } else {
            CommonWnd.showInviteRewardWnd();
        }
    },

    onDailyBtnClick: function (event) {
        GlobalVar.handlerManager().dailyHandler.sendGetDailyDataReq();
    },
    dailyMsgRecv: function (errCode) {
        if (errCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(errCode);
            return;
        }
        CommonWnd.showDailyMissionWnd();
    },

    rcgbagRecv: function (data) {
        CommonWnd.showRechargeWnd();
    },

    richTreasureMsgRecv: function (data) {
        if (data.ErrCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(data.ErrCode);
            return;
        }
        CommonWnd.showRichTreasureWnd();
    },

    onNewTaskBtnClick: function (event) {
        let TAB_NEWTASK = 0;
        CommonWnd.showDailyMissionWnd(TAB_NEWTASK);
    },
    onRankingBtnClicked: function (event) {
        CommonWnd.showRankingView();
    },
    onMailBtnClick: function (event) {
        CommonWnd.showMailWnd();

        // let data = {
        //     combatUpflag: true,
        //     delta: 20000,
        //     combatPoint: 120000,
        //     lastCombatPoint: 100000
        // }
        // GlobalVar.comMsg.showCombatPoint(data.delta, data.combatPoint, data.lastCombatPoint);
    },
    onEndlessModeBtnClick: function (event) {
        let endlessSystemData = GlobalVar.tblApi.getDataBySingleKey('TblSystem', GameServerProto.PT_SYSTEM_ENDLESS);
        if (GlobalVar.me().level < endlessSystemData.wOpenLevel) {
            GlobalVar.comMsg.showMsg(i18n.t('label.4000258').replace("%d", endlessSystemData.wOpenLevel).replace("%d", endlessSystemData.strName));
            return;
        }

        CommonWnd.showEndlessView();
    },
    onChallengeBtnClick: function () {
        CommonWnd.showChallengeWnd();
    },
    onPlayerInfoBtnClick: function (event) {
        CommonWnd.showPlayerInfoWnd();
    },
    onBuySpBtnClick: function (event) {
        CommonWnd.showBuySpWnd();
    },

    onRichTreasureBtnClick: function (event) {
        // CommonWnd.showRichTreasureWnd();
        GlobalVar.handlerManager().drawHandler.sendTreasureData();
    },

    onFeedbackBtnClick: function (event) {
        CommonWnd.showFeedbackWnd();
    },

    onRechargeDiamondClick: function (event) {
        CommonWnd.showNormalFreeGetWnd(GameServerProto.PTERR_DIAMOND_LACK, null, null, null, null, true);
    },

    onRechargeBtnClick: function (event) {
        CommonWnd.showRechargeWnd();
        // CommonWnd.showNormalFreeGetWnd(GameServerProto.PTERR_DIAMOND_LACK, null, null, null, null, true);
    },

    onQuestListBtnClick: function (event) {
        CommonWnd.showQuestList();
    },
    onActiveBtnClick: function (event) {
        // GlobalVar.comMsg.showMsg("未完成");
        // return;
        GlobalVar.handlerManager().activeHandler.sendGetActiveListReq(GameServerProto.PT_AMS_ACT_TYPE_NORMAL, 0);
    },
    onShareDailyBtnClick: function (event) {
        CommonWnd.showShareDailyWnd();
    },
    onSuperGiftBtnClic: function (event) {
        CommonWnd.showSuperRewardWnd();
    },
    onSignBtnClick: function (event) {
        GlobalVar.handlerManager().signHandler.sendGetSignDataReq();
    },
    onFollowBtnClick: function (event) {
        CommonWnd.showFollowRewardWnd();
    },
    onNewPlayerBtnClick: function (event) {
        CommonWnd.showBoxRewardWnd();
    },
    signMsgRecv: function (errCode) {
        if (errCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(errCode);
            return;
        }
        CommonWnd.showSignWnd();
    },
    activeMsgRecv: function (errCode) {
        if (errCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(errCode);
            return;
        }
        CommonWnd.showActiveWnd();
    },

    onItemBagBtnClick: function (event) {
        CommonWnd.showItemBag(-1, null, null, null, 1);
    },

    onAdExpBtnClick: function (event) {
        CommonWnd.showAdExp();
        GlobalVar.me().adData.setAdExpHotFlag(false);
        this.setAdExpFlag();
    },

    onAdTaskBtnClick: function (event) {
        CommonWnd.showAdTask();
    },

    onGMIDSend: function () {
        if (this.edbxGMCMD.string == "") return;
        var param = this.edbxGMCMD.string.split(" ");
        // cc.log(param);
        let msg = {
            Params: [],
        };
        // msg.Params.Param=param;
        for (let i = 0; i < param.length; i++) {
            let p = {
                Param: param[i]
            };
            msg.Params.push(p);
        }
        GlobalVar.handlerManager().gmCmdHandler.sendReq(GameServerProto.GMID_GMCMD_REQ, msg);
    },

    onTreasuryBtnTouched: function () {
        CommonWnd.showDrawView();
    },

    onStoreBtnTouched: function () {
        let systemData = GlobalVar.tblApi.getDataBySingleKey('TblSystem', GameServerProto.PT_SYSTEM_STORE);
        if (systemData && GlobalVar.me().level < systemData.wOpenLevel) {
            GlobalVar.comMsg.showMsg(i18n.t('label.4000258').replace("%d", systemData.wOpenLevel || 0).replace("%d", systemData.strName));
            return;
        }
        CommonWnd.showStoreWithParam(1);
    },

    onLimitStoreBtnTouched: function () {
        let systemData = GlobalVar.tblApi.getDataBySingleKey('TblSystem', GameServerProto.PT_SYSTEM_FULI_GIFT);
        if (systemData && GlobalVar.me().level < systemData.wOpenLevel) {
            GlobalVar.comMsg.showMsg(i18n.t('label.4000258').replace("%d", systemData.wOpenLevel || 0).replace("%d", systemData.strName));
            return;
        }
        CommonWnd.showLimitStoreWithParam(1);
    },

    //限时宝箱
    onLimitTimeBoxBtnClick: function () {
        CommonWnd.showLimitTimeBox();
    },

    onGuazaiBtnTouched: function (event) {
        CommonWnd.showGuazai();
    },
    onBtnNewRateItemClick: function (event) {
        CommonWnd.showGetNewRareItemWnd(null, 0);
    },

    onBtnMoreGame: function (event) {
        if (cc.sys.platform != cc.sys.WECHAT_GAME) return;
        // const appid = "wx845a2f34af2f4235";
        // var parm = "pages/main/main";
        // let gender = 0;
        // weChatAPI.getUserInfo(function(userInfo){
        //     gender = userInfo.gender;
        // })
        // parm = parm.indexOf('?') > 0 ? parm : parm +'?';
        // parm = parm.indexOf('gender') > 0 ? parm : parm + '&gender='+ gender;

        // weChatAPI.navigateToMiniProgram(appid, parm);
        weChatAPI.requestGetMoreFunInfo(function (data) {
            console.log("moreInfo:", data);
            let moreGameInfo = data.moreInfoList;
            if (moreGameInfo.length == 0) {
                return;
            }
            let randomNum = parseInt(moreGameInfo.length * Math.random());
            let navigateData = moreGameInfo[randomNum];
            let appid = navigateData.key;
            let parm = navigateData.parm;
            let gender = 0;
            weChatAPI.getUserInfo(function (userInfo) {
                gender = userInfo.gender;
                parm = parm.indexOf('?') > 0 ? parm : parm + '?';
                parm = parm.indexOf('gender') > 0 ? parm : parm + '&gender=' + gender;
                weChatAPI.navigateToMiniProgram(appid, parm);
            }, function () {
                parm = parm.indexOf('?') > 0 ? parm : parm + '?';
                parm = parm.indexOf('gender') > 0 ? parm : parm + '&gender=' + gender;
                weChatAPI.navigateToMiniProgram(appid, parm);
            });
        });
    },

    onBtnFreeFuli: function () {
        let block = cc.find("Canvas/BlockNode");
        if (cc.isValid(block)) {
            block.active = true;
        }
        this.getNodeByName('drawer').active = true;
        let fuli = this.getNodeByName('btnoFuli');
        let drawer1 = this.getNodeByName('drawer1')
        let worldPos = fuli.parent.convertToWorldSpaceAR(fuli);
        let nodePos = drawer1.parent.convertToNodeSpaceAR(worldPos);
        drawer1.position = nodePos;
        drawer1.scale = new cc.Vec2(0, 0);
        let action1 = cc.moveTo(0.2, 0, 120);
        let action2 = cc.scaleTo(0.2, 1, 1);
        let action3 = cc.callFunc(() => {
            if (cc.isValid(block)) {
                block.active = false;
            }
        })
        let seq = cc.sequence(cc.spawn(action1, action2), action3);
        drawer1.runAction(seq);
    },

    onBtnTreasuryActive: function () {
        let treasuryAmsData = GlobalVar.me().activeData.getActiveListDataByType(GameServerProto.PT_AMS_ACT_TYPE_TREASURY);
        if (treasuryAmsData) {
            //     let data = GlobalVar.me().activeData.getActiveDataByActID(treasuryAmsData.Actid);
            //     if (!data){
            GlobalVar.handlerManager().activeHandler.sendGetActiveDataReq(treasuryAmsData.Actid);
            //     }else{
            //         CommonWnd.showSpecialActiveWnd(GameServerProto.PT_AMS_ACT_TYPE_TREASURY);
            //     }
        }
    },

    onBtnVastActive: function () {
        let vastAmsData = GlobalVar.me().activeData.getActiveListDataByType(GameServerProto.PT_AMS_ACT_TYPE_VAST);
        if (vastAmsData) {
            // let data = GlobalVar.me().activeData.getActiveDataByActID(vastAmsData.Actid);
            // if (!data){
            GlobalVar.handlerManager().activeHandler.sendGetActiveDataReq(vastAmsData.Actid);
            // }else{
            //     CommonWnd.showSpecialActiveWnd(GameServerProto.PT_AMS_ACT_TYPE_VAST);
            // }
        }
    },

    onBtnRewardCenter: function () {
        let rewardData = GlobalVar.me().rewardCenterData.data;
        if (!rewardData) {
            GlobalVar.handlerManager().rewardCenterHandler.sendRewardCenterReq();
        } else {
            CommonWnd.showRewardCenterWnd();
        }
    },

    rewardCenterBack: function (data) {
        if (data.Reward.length > 0) {
            // CommonWnd.showRewardCenterWnd();
            this.getNodeByName('btnoRewardCenter').active = true;
        } else {
            this.getNodeByName('btnoRewardCenter').active = false;
        }
    },

    getActiveData: function (event) {
        if (event.ErrCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        if (event.Act.Type == GameServerProto.PT_AMS_ACT_TYPE_TREASURY) {
            CommonWnd.showSpecialActiveWnd(GameServerProto.PT_AMS_ACT_TYPE_TREASURY);
        } else if (event.Act.Type == GameServerProto.PT_AMS_ACT_TYPE_VAST) {
            CommonWnd.showSpecialActiveWnd(GameServerProto.PT_AMS_ACT_TYPE_VAST);
        }
    },

    resetRewardLtbShow: function () {
        //console.log("领取完奖励后回调end");
        GlobalVar.me().statFlags.FuliOnlineFlag = false;
        this.resetLtbShow();
    },

    resetLtbShow: function () {
        let btnState = true; //今日宝箱是否领完
        let bagid = GlobalVar.me().limitTimeBoxData.Step;
        if(!!!bagid || bagid > GlobalVar.tblApi.getLength('TblFuliOnline')) {
            btnState = false;
        }
        let btnoLbx = this.getNodeByName("btnoLimitTimeBox");
        let lblCountDown = btnoLbx.getChildByName("lblcountdown");
        let lblCountDown_lbl = lblCountDown.getComponent(cc.Label);
        btnoLbx.active = true;
        // console.log("宝箱是否显示")
        // console.log(config.NEED_GUIDE)
        // console.log(btnState);
        let flags = GlobalVar.me().statFlags;
        if (!!config.NEED_GUIDE || btnState == false) {
            btnoLbx.active = false;
        }
        else if(!!!flags.FuliOnlineFlag) { 
            if(!!this.ltbTimeHandler) {
                GlobalVar.gameTimer().delTimer(this.ltbTimeHandler);
                this.ltbTimeHandler = null;
            }
            let timepass = GlobalVar.me().limitTimeBoxData.OnlineTime;
            let timeTarget = GlobalVar.tblApi.getDataBySingleKey('TblFuliOnline', bagid).dwCond;
            let time = timeTarget - timepass;

            if(time <= 0) { //可以领取
                lblCountDown.active = false;
            }
            else {
                lblCountDown.active = true;
                let timeStr = GlobalVar.serverTime.secondToString(time);
                lblCountDown_lbl.string = timeStr;
                this.countDownLimitBox = function () {
                    time = time - 1;
                    if(time == 0) {
                        lblCountDown.active = false;
                        GlobalVar.gameTimer().delTimer(this.ltbTimeHandler);
                        this.ltbTimeHandler = null;
                    }
                    else {
                        let timeStr = GlobalVar.serverTime.secondToString(time);
                        lblCountDown_lbl.string = timeStr;
                    }
                };
                this.ltbTimeHandler = GlobalVar.gameTimer().startTimer(this.countDownLimitBox, 1);
    
            }
        }

        
        this.setLtbFlag();
    },

    skipGuide: function () {
        config.NEED_GUIDE = false;
        cc.find('Canvas/GuideNode').active = false;
        this.showDeskIcon();
        this.resetLtbShow();
    },

    setMode: function () {
        // if (config.GM_SWITCH) {
        this.edbxGMCMD.node.active = config.GM_SWITCH;
        this.getNodeByName('btnSendGM').active = config.GM_SWITCH;
        // this.getNodeByName('btnoBattleDemo').active = true;
        // this.getNodeByName('btnoBattleEditor').active = config.GM_SWITCH;
        cc.find('Canvas/GuideNode/skip').active = config.GM_SWITCH;
        // }
    },

    showDeskIcon: function () {
        this.getNodeByName('btnoAdExp').active = !config.NEED_GUIDE;
        this.getNodeByName('AdFrame').active = !config.NEED_GUIDE;
        this.getNodeByName('btnoAdTask').active = !config.NEED_GUIDE;
        this.getNodeByName('btnoActivity').active = !config.NEED_GUIDE;
        this.getNodeByName('btnoArena').active = !config.NEED_GUIDE;

        this.getNodeByName('layout').active = !config.NEED_GUIDE;
        this.getNodeByName('layout1').active = !config.NEED_GUIDE;
        this.getNodeByName('layout2').active = !config.NEED_GUIDE;

        this.getNodeByName('btnoFuli').active = GlobalVar.getShareSwitch();

        let level = GlobalVar.me().level;
        let openLevel = GlobalVar.tblApi.getDataBySingleKey('TblSystem', GameServerProto.PT_SYSTEM_STORE).wOpenLevel;
        this.getNodeByName('btnoStore').active = level >= openLevel;
        openLevel = GlobalVar.tblApi.getDataBySingleKey('TblSystem', GameServerProto.PT_SYSTEM_FULI_GIFT).wOpenLevel;
        this.getNodeByName('btnoLimitStore').active = level >= openLevel;
        openLevel = GlobalVar.tblApi.getDataBySingleKey('TblSystem', 90).wOpenLevel;
        this.getNodeByName('btnoAdTask').active = level >= openLevel;

        let btnoShareDaily = this.getNodeByName("btnoShareDaily");
        if (!config.NEED_GUIDE && !GlobalVar.me().shareData.getShareDailyState() && GlobalVar.getShareSwitch() && GlobalVar.me().level >= 7) {
            btnoShareDaily && (btnoShareDaily.active = true);
        } else {
            btnoShareDaily && (btnoShareDaily.active = false);
        }

        let btnoSuperGift = this.getNodeByName("btnoSuperGift");
        if (!GlobalVar.me().shareData.getSuperRewardState()) {
            btnoSuperGift && (btnoSuperGift.active = true);
        } else {
            btnoSuperGift && (btnoSuperGift.active = false);
        }

        let signOpenLevel = GlobalVar.tblApi.getDataBySingleKey('TblSystem', GameServerProto.PT_SYSTEM_SIGNIN).wOpenLevel;
        let btnoSign = this.getNodeByName("btnoSign");
        if (GlobalVar.me().level >= signOpenLevel && GlobalVar.getShareSwitch()) {
            btnoSign && (btnoSign.active = true);
        } else {
            btnoSign && (btnoSign.active = false);
        }

        // 关注礼包
        let btnoFollow = this.getNodeByName("btnoFollow");
        if (GlobalVar.me().fuLiGCBag.OfficialAccountDraingetFlag == 0 && GlobalVar.me().getLevel() >= 4
            && weChatAPI.shareSetting.vpnaFlag == 1 && GlobalVar.getShareSwitch()) {

            btnoFollow && (btnoFollow.active = true);
        } else {
            btnoFollow && (btnoFollow.active = false);
        }
        // 每日补给
        let btnBoxReward = this.getNodeByName("btnoBoxReward");
        console.log("isAndroid = " + GlobalVar.isAndroid);
        if (GlobalVar.isAndroid && GlobalVar.me().getLevel() >= 4 && weChatAPI.shareSetting.heziFlag == 1 && GlobalVar.getShareSwitch()) {
            btnBoxReward && (btnBoxReward.active = true);
        }
        else {
            btnBoxReward.active = false;
        }
        // 红点
        let spriteHot = btnBoxReward.getChildByName("spriteHot");
        if (GlobalVar.me().fuLiGCBag.HeZiReward == 0) {
            spriteHot.active = true;
        }
        else {
            spriteHot.active = false;
        }

        //邀请礼包
        let btnNewPlayer1 = this.getNodeByName("btnoInvite");
        if (GlobalVar.getShareSwitch() && GlobalVar.me().shareData.getInviteGiftBagState() < (GlobalVar.tblApi.getLength("TblFuliInvite"))) {
            btnNewPlayer1 && (btnNewPlayer1.active = true);
        } else {
            btnNewPlayer1 && (btnNewPlayer1.active = false);
        }

        let treasuryAmsData = GlobalVar.me().activeData.getActiveListDataByType(GameServerProto.PT_AMS_ACT_TYPE_TREASURY);
        let btnoTreasureActive = this.getNodeByName("btnoTreasureActive");
        btnoTreasureActive.active = !!(treasuryAmsData && !config.NEED_GUIDE);
        let vastAmsData = GlobalVar.me().activeData.getActiveListDataByType(GameServerProto.PT_AMS_ACT_TYPE_VAST);
        let btnoVastActive = this.getNodeByName("btnoVastActive");
        btnoVastActive.active = !!(vastAmsData && !config.NEED_GUIDE)
        
        //限时宝箱
        //没过引导不显示新手宝箱
        let btnoLbx = this.getNodeByName("btnoLimitTimeBox");
        if (!!config.NEED_GUIDE) {
            btnoLbx.active = false;
        }

        this.setFreeFuliFlag();
    },

    closeDrawerPanel: function () {
        let self = this;
        let block = cc.find("Canvas/BlockNode");
        if (cc.isValid(block)) {
            block.active = true;
        }
        let fuli = this.getNodeByName('btnoFuli');
        let drawer1 = this.getNodeByName('drawer1')
        let worldPos = fuli.parent.convertToWorldSpaceAR(fuli);
        let nodePos = drawer1.parent.convertToNodeSpaceAR(worldPos);
        let action1 = cc.moveTo(0.2, nodePos.x, nodePos.y);
        let action2 = cc.scaleTo(0.2, 0, 0);
        let action3 = cc.callFunc(() => {
            self.getNodeByName('drawer').active = false;
            if (cc.isValid(block)) {
                block.active = false;
            }
        })
        let seq = cc.sequence(cc.spawn(action1, action2), action3);
        drawer1.runAction(seq);
    },

    OnGetFollowReward: function (data) {
        let btnoFollow = this.getNodeByName("btnoFollow");
        btnoFollow && (btnoFollow.active = false);

        CommonWnd.showTreasureExploit(data);
    },

    OnGetBoxReward: function (data) {
        let btnBoxReward = this.getNodeByName("btnoBoxReward");
        let spriteHot = btnBoxReward.getChildByName("spriteHot");
        spriteHot.active = false;

        CommonWnd.showTreasureExploit(data);
    },

    testMultipleWindow: function () {
        this.onShareDailyBtnClick()
        this.onInviteBtnClick()
        CommonWnd.showSignWnd();
    },
});