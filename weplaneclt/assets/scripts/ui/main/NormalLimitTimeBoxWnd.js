

const RootBase = require("RootBase");
const WindowManager = require("windowmgr");
const GlobalVar = require("globalvar");
const EventMsgID = require("eventmsgid");
const GameServerProto = require("GameServerProto");
const CommonWnd = require("CommonWnd");
const StoreageData = require("storagedata");

var self = null;
cc.Class({
    extends: RootBase,

    properties: {
        itemPrefab: {
            default: null,
            type: cc.Prefab
        },
        widgetNode1: {
            default: null,
            type: cc.Node
        },
        widgetNode2: {
            default: null,
            type: cc.Node
        },
        widgetNode3: {
            default: null,
            type: cc.Node
        },
        btnAdLingQu: {
            default: null,
            type: cc.Node
        },
        btnShareLingQu: {
            default: null,
            type: cc.Node
        },
        btnZhiJieLingQu: {
            default: null,
            type: cc.Node
        },
        lblCountDown: {
            default: null,
            type: cc.Node
        },
    },

    onLoad () {
        this._super();
        this.initNode();
    },

    ctor: function () {
        self = this;
        self.scheduleHandler = null;
        self.itemList = [];
    },

    animeStartParam(paramScale, paramOpacity) {
        self.node.setScale(paramScale, paramScale);
        self.node.opacity = paramOpacity;
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            self._super("Escape");
            if(!!self.timeHandler) {
                GlobalVar.gameTimer().delTimer(self.timeHandler);
                self.timeHandler = null;
            }
            GlobalVar.eventManager().removeListenerWithTarget(self);
            WindowManager.getInstance().popView(false, null, false, false);
            if(self.tanReward == true) {
                let rewardList = GlobalVar.me().limitTimeBoxData.Reward;
                if(!!rewardList) {
                    CommonWnd.showTreasureExploit(rewardList);
                }    
            }
        } else if (name == "Enter") {
            self._super("Enter");
            self.registerEvent();
            GlobalVar.handlerManager().limitTimeBoxHandler.sendGetLtbDataReq();
        }
    },

    registerEvent: function () {
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_LTB_DATA, self.initWillReward, self);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_LTB_REWARD, self.rewardGetCallBack, self);
    },

    pop: function () {
        WindowManager.getInstance().popView(false);
    },

    enter: function (isRefresh) {
        if (isRefresh) {
            self._super(true);
        } else {
            self._super(false);
        }
    },

    escape: function (isRefresh) {
        if (isRefresh) {
            self._super(true);
        } else {
            self._super(false);
        }
        if (!!self.scheduleHandler) {
            // GlobalVar.gameTimer().delTimer(self.scheduleHandler);
            // self.scheduleHandler = null;
        }
    },

    close: function () {
        self._super();
    },

    start () {

    },

    touchMain: function () {
        cc.log("限时礼包 touchMain");
    },

    initNode: function () {
        self.btnAdLingQu.active = false;
        self.btnShareLingQu.active = false;
        self.btnZhiJieLingQu.active = true;

        self.widgetNode1.active = false;
        self.widgetNode2.active = false;
        self.widgetNode3.active = false;
        self.lblCountDown.active = false;
    },

    changeLingBtn: function (type) {
        if(type == 0) { 
            self.btnAdLingQu.active = false;
            self.btnShareLingQu.active = false;
            self.btnZhiJieLingQu.active = false;
        }
        else if(type == 1) { //直接领取
            self.btnAdLingQu.active = false;
            self.btnShareLingQu.active = false;
            self.btnZhiJieLingQu.active = true;
        }
        else if(type == 2) { //分享领取
            self.btnAdLingQu.active = false;
            self.btnShareLingQu.active = true;
            self.btnZhiJieLingQu.active = false;
        }
        else if(type == 3) { //视频领取
            self.btnAdLingQu.active = true;
            self.btnShareLingQu.active = false;
            self.btnZhiJieLingQu.active = false;
        }
    },

    //my window
    initWillReward: function (data) {
        console.log("即将展示的限时数据信息是");
        console.log(data);
        // console.log("长度");
        // console.log(GlobalVar.tblApi.getLength('TblFuliOnline'));
        // console.log("当前服务器的时间戳");
        // console.log(GlobalVar.serverTime.getTime());
        self.lblCountDown_lbl = self.lblCountDown.getComponent(cc.Label);
        if(!!self.timeHandler) {
            GlobalVar.gameTimer().delTimer(self.timeHandler);
            self.timeHandler = null;
        }
        let bagid = GlobalVar.me().limitTimeBoxData.Step;
        if(!!!bagid || bagid > GlobalVar.tblApi.getLength('TblFuliOnline')) return;
        console.log("背包信息是", bagid);
        let bagRewardArray = GlobalVar.tblApi.getDataBySingleKey('TblFuliOnline', bagid).oVecReward;
        console.log(bagRewardArray);
        // let timeTarget = GlobalVar.me().limitTimeBoxData.OnlineTime;
        // let timeNow = GlobalVar.serverTime.getTime();
        // let time = timeTarget - timeNow;
        let timepass = GlobalVar.me().limitTimeBoxData.OnlineTime;
        let timeTarget = GlobalVar.tblApi.getDataBySingleKey('TblFuliOnline', bagid).dwCond;
        let time = timeTarget - timepass;
        let vipLevel = GlobalVar.me().getVipLevel();
        console.log("我的vip等级是", vipLevel);
        if(time <= 0) { //可以领取
            self.lblCountDown.active = false;
            vipLevel >= 3 ? (self.changeLingBtn(1)) : (self.changeLingBtn(2));
        }
        else {
            self.changeLingBtn(3);
            self.lblCountDown.active = true;
            let timeStr = GlobalVar.serverTime.secondToString(time);
            self.lblCountDown_lbl.string = timeStr;
            self.countDownLimitBox = function () {
                time = time - 1;
                if(time == 0) {
                    vipLevel >= 3 ? (self.changeLingBtn(1)) : (self.changeLingBtn(2));
                    self.lblCountDown.active = false;
                    GlobalVar.gameTimer().delTimer(self.timeHandler);
                    self.timeHandler = null;
                }
                else {
                    let timeStr = GlobalVar.serverTime.secondToString(time);
                    self.lblCountDown_lbl.string = timeStr;
                    // console.log("倒计时");
                    // console.log(timeStr);
                }

            };
            self.timeHandler = GlobalVar.gameTimer().startTimer(self.countDownLimitBox, 1);

        }
      
        let count = bagRewardArray.length > 3 ? 3 : (bagRewardArray.length);
        for(let i = 0; i < count; i++) {
            let itemid = bagRewardArray[i].wItemID;
            let num = bagRewardArray[i].nCount;
            let itemInfo = GlobalVar.tblApi.getDataBySingleKey('TblItem', itemid);
            console.log("道具信息");
            console.log(itemInfo);
            let prop = "widgetNode" + (i+1);
            self[prop].active = true;
            self[prop].destroyAllChildren();
            let item = cc.instantiate(self.itemPrefab);
            item.getComponent("ItemObject").updateItem(itemid);
            item.getComponent("ItemObject").setLabelNumberData(num);
            item.getComponent("ItemObject").setClick(true, 2);
            self[prop].addChild(item);
            // let lblname = self[prop].getChildByName("lblshow");
            // if(itemid <= 7) {
            //     lblname.getComponent(cc.Label).string = num;
            // }
            // else {
            //     lblname.getComponent(cc.Label).string = itemInfo.strName;
            // }
        }
    },

    rewardGetCallBack: function () {
       
        if(GlobalVar.me().limitTimeBoxData.Step == GlobalVar.tblApi.getLength('TblFuliOnline') + 1) { //已经领完所有奖励
            //关闭入口
            self.lblCountDown.active = false;
            self.changeLingBtn(0);
            self.close();
            self.tanReward = true;
        }
        else {
            let rewardList = GlobalVar.me().limitTimeBoxData.Reward;
            if(!!rewardList) {
                CommonWnd.showTreasureExploit(rewardList);
            }    
            //更新界面
            self.initWillReward();
        }


    },

    //看视频领取
    adLingQuCallBack: function () {
        let platformApi = GlobalVar.getPlatformApi();
        if(!!platformApi) {
            platformApi.showRewardedVideoAd(127, function () {
                GlobalVar.handlerManager().limitTimeBoxHandler.sendGetLtbRewardReq(1);
            });
        }
        else {
            GlobalVar.handlerManager().limitTimeBoxHandler.sendGetLtbRewardReq(1);
        }
    },

    //分享领取
    shareLingQuCallBack: function () {
        let platformApi = GlobalVar.getPlatformApi();
        if(!!platformApi) {
            platformApi.shareNormal(127, function () {
                GlobalVar.handlerManager().limitTimeBoxHandler.sendGetLtbRewardReq(0);
            });
        }
        else {
            GlobalVar.handlerManager().limitTimeBoxHandler.sendGetLtbRewardReq(0);
        }
    },
    
    //直接领取
    zhijieLingQuCallBack: function () {
        GlobalVar.handlerManager().limitTimeBoxHandler.sendGetLtbRewardReq(0);
    },




    // update (dt) {},
});
