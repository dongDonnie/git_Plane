const RootBase = require("RootBase");
const WindowManager = require("windowmgr");
const GlobalVar = require('globalvar')
const WndTypeDefine = require("wndtypedefine");
const EventMsgID = require("eventmsgid");
const GameServerProto = require("GameServerProto");
const CommonWnd = require("CommonWnd");
const i18n = require('LanguageData');
const GlobalFunc = require('GlobalFunctions');
const weChatAPI = require("weChatAPI");
const qqPlayAPI = require("qqPlayAPI");

cc.Class({
    extends: RootBase,

    properties: {
        labelDayNum: {
            default: null,
            type: cc.Label,
        },
        nodeBox: {
            default: null,
            type: cc.Node,
        },
        progressBar: {
            default: null,
            type: cc.ProgressBar
        },
        dayScroll: {
            default: null,
            type: cc.ScrollView,
        },
        nodeDayModel: {
            default: null,
            type: cc.Node,
        },
        nodeStrut: {
            default: null,
            type: cc.Node,
        },
        nodeTip: {
            default: null,
            type: cc.Node,
        }
    },

    onLoad: function () {
        this._super();
        i18n.init('zh');
        this.animeStartParam(0, 0);
        this.canClose = true;
        this.isFirstIn = true;

        this.signDatas = GlobalVar.tblApi.getData('TblSignin');
        this.plan = GlobalVar.me().signData.getPlan();
        this.rewardBoxData = this.getHeapRewardList();
        this.nodeTip.active = false;
        this.nodeStrut.parent.active = false;
        // console.log('<<<<< sign datas:', this.signDatas, this.plan, this.rewardBoxData);

        // 初始化累计登陆宝箱位置
        this.initBoxPosition();
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
            this.doubleFlag = true;
            GlobalVar.me().signData.setDoubleFlag(this.doubleFlag);
            this.registerEvent();
            this.initSignWnd();
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
        this.canClose && this.close();
    },

    close: function () {
        this.dayScroll.loopScroll.releaseViewItems();
        this._super();
    },

    registerEvent: function () {
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_SIGN_RESULT, this.showSignReward, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_SIGN_HEAP_RESULT, this.showSignHeapReward, this);
    },

    initSignWnd: function () {
        // 初始化累计天数宝箱列表
        this.initActiveBoxList();
        
        //初始化累计天数进度条
        this.initActiveBar();

        //初始化奖励详情
        this.initSignContent();

        // 更新炫耀单选框显示
        this.updateStrutShow();

        // iOS隐藏贵族提示
        // this.nodeTip.active = GlobalFunc.iosOrAndr() != 1;
        this.nodeTip.active = !GlobalVar.srcSwitch();
        this.nodeStrut.parent.active = GlobalVar.me().vipLevel < 3;
    },

    initBoxPosition: function () {
        let boxList = this.nodeBox.children;
        for (let i = 0; i < this.rewardBoxData.length; i++) {
            let box = boxList[i];
            let destDay = this.rewardBoxData[i].heapDay;
            box.x = Math.floor(-285 + destDay / 7 * 205 / (3 / 7));
        }
    },

    initActiveBoxList: function() {
        let signedDay = GlobalVar.me().signData.getSignedDayNum();
        this.labelDayNum.string = signedDay + '天';
        let boxList = this.nodeBox.children;
        for (let i = 0; i < this.rewardBoxData.length; i++) {
            let box = boxList[i];
            box.idx = i;
            let destDay = this.rewardBoxData[i].heapDay;
            let rewardCount = this.rewardBoxData[i].rewardData[0].nCount;
            box.getChildByName("labelActiveRequire").getComponent(cc.Label).string = destDay + "天" + rewardCount + '钻';
            if (GlobalVar.me().signData.isHeapRewardReceived(destDay)) {
                box.getChildByName("btnRewardBox").getComponent("RemoteSprite").setFrame(2);
                box.getChildByName("btnRewardBox").getChildByName("spriteHot").active = false;
            } else if (signedDay >= destDay) {
                box.getChildByName("btnRewardBox").getComponent("RemoteSprite").setFrame(1);
                box.getChildByName("btnRewardBox").getChildByName("spriteHot").active = true;
            } else {
                box.getChildByName("btnRewardBox").getComponent("RemoteSprite").setFrame(0);
                box.getChildByName("btnRewardBox").getChildByName("spriteHot").active = false;
            }
        }
    },

    initActiveBar: function () {
        let curPercent = this.progressBar.progress;
        let percent = GlobalVar.me().signData.getSignedDayNum() / 7;
        if (cc.game.renderType != cc.game.RENDER_TYPE_WEBGL) {
            this.progressBar.progress = percent;
        } else {
            if (curPercent<=percent){
                this.progressBar.node.runAction(cc.progressLoading(0.3, curPercent, percent));
            }else{
                this.progressBar.node.runAction(cc.progressLoading(0.3, 0, percent));
            }
        }
    },

    initSignContent: function () {
        if (this.signDatas) {
            let self = this;
            self.canClose = false;
            if (this.isFirstIn) {
                this.isFirstIn = false;
                this.dayScroll.loopScroll.setTotalNum(7);
                this.dayScroll.loopScroll.setCreateModel(this.nodeDayModel);
                this.dayScroll.loopScroll.saveCreatedModel(this.dayScroll.content.children);
                this.dayScroll.loopScroll.registerUpdateItemFunc(function (item, index) {
                    item.getComponent("SignObject").updateDayInfo(self.getSigninDayInfo(index + 1));
                });
                this.dayScroll.loopScroll.registerCompleteFunc(function () {
                    self.canClose = true;
                });
                this.dayScroll.loopScroll.resetView();
            } else {
                this.dayScroll.scrollToTop(0);
                this.dayScroll.loopScroll.setTotalNum(7);
                this.dayScroll.loopScroll.registerUpdateItemFunc(function (item, index) {
                    item.getComponent("SignObject").updateDayInfo(self.getSigninDayInfo(index + 1));
                });
                this.dayScroll.loopScroll.initParameter();
                this.dayScroll.loopScroll.resetView();
            }
        }
    },

    updateStrutShow: function () {
        let idx = this.doubleFlag ? 0 : 1;
        this.nodeStrut.getComponent("RemoteSprite").setFrame(idx);
        GlobalVar.me().signData.setDoubleFlag(this.doubleFlag);
    },

    showSignReward: function (event) {
        if (event.ErrCode && event.ErrCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        CommonWnd.showTreasureExploit(event.Item);
        this.initActiveBoxList();
        this.initActiveBar();
        this.initSignContent();
    },

    showSignHeapReward: function (event) {
        if (event.ErrCode && event.ErrCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        CommonWnd.showTreasureExploit(event.Item);
        this.initActiveBoxList();
    },

    onHeapRewardBoxClick: function (event) {
        let boxIdx = event.target.parent.idx;
        let destDay = this.rewardBoxData[boxIdx].heapDay;
        let condition = GlobalVar.me().signData.getSignedDayNum() >= destDay;
        if (!condition) {  // 未达到条件
            GlobalVar.comMsg.showMsg(i18n.t('label.4000601'));
        } else if (GlobalVar.me().signData.isHeapRewardReceived(destDay)) {  // 已领取
            GlobalVar.comMsg.showMsg(i18n.t('label.4000602'));
        } else {  // 未领取
            let platformApi = GlobalVar.getPlatformApi();
            if (platformApi) {
                if (this.meetVipCondition(this.rewardBoxData[boxIdx].vipLimit)) {  // 满足vip条件
                    GlobalVar.handlerManager().signHandler.sendSignHeapReq(destDay);
                } else {  // 看视频
                    platformApi.showRewardedVideoAd(227, function () {
                        GlobalVar.handlerManager().signHandler.sendSignHeapReq(destDay);
                    },function () {
                        platformApi.shareNormal(127, function () {
                            GlobalVar.handlerManager().signHandler.sendSignHeapReq(destDay);
                        });
                    });
                    // self.nodeBlock.enabled = true;
                    // setTimeout(function () {
                    //     self.nodeBlock.enabled = false;
                    // }, 1500);
                }
            } else {
                GlobalVar.handlerManager().signHandler.sendSignHeapReq(destDay);
            }
        }
    },

    getHeapRewardList: function () {
        let list = [];
        for (let i = 1; i <= 7; i++) {
            let info = this.getSigninDayInfo(i);
            if (info.oVecHeapReward.length > 0) {
                list.push({
                    heapDay: info.byDay,
                    rewardData: info.oVecHeapReward,
                    vipLimit: info.byVIPLevel
                });
            }
        }
        return list;
    },

    getSigninDayInfo: function (day) {
        let key = this.plan + '_' + day;
        return this.signDatas[key];
    },

    toggleStrut: function () {
        this.doubleFlag = !this.doubleFlag;
        this.updateStrutShow();
    },

    meetVipCondition: function (cond) {
        if (GlobalFunc.iosOrAndr() == 1) {  // iOS无贵族
            return false;
        } else {
            return GlobalVar.me().vipLevel >= cond;
        }
    }

});
