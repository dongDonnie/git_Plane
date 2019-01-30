const RootBase = require("RootBase");
const WndTypeDefine = require("wndtypedefine");
const GlobalVar = require('globalvar')
const EventMsgID = require("eventmsgid");
const WindowManager = require("windowmgr");
const weChatAPI = require("weChatAPI");
const GlobalFunc = require('GlobalFunctions');

cc.Class({
    extends: RootBase,

    properties: {
        itemObjList: {
            default: [],
            type: [cc.Node],
        },
    },

    onLoad: function () {
        this._super();
        this.animeStartParam(0, 0);
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_BOX_REWARD_WND;
        this.initView();

        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            let platformApi = GlobalVar.getPlatformApi();
            this.onShowFunc = function (launchInfo) {
                if(typeof launchInfo.query.coinGiftOnly == "undefined") return;
                if (GlobalVar.me().fuLiGCBag.HeZiReward == 1) {
                    return;
                }
                if(launchInfo.query.coinGiftOnly == "coinGiftOnly1"){
                    GlobalVar.handlerManager().boxRewardHandler.sendBoxRewardReq(0);
                }
                else if(launchInfo.query.coinGiftOnly == "coinGiftOnly2"){
                    GlobalVar.handlerManager().boxRewardHandler.sendBoxRewardReq(1);
                }
            };
            platformApi.setOnShowListener(this.onShowFunc); 
        }   
    },

    animeStartParam(paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;
    },
    
    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");            
            let platformApi = GlobalVar.getPlatformApi();
            if (platformApi) {
                platformApi.setOffShowListener(this.onShowFunc);
            }        
            GlobalVar.eventManager().removeListenerWithTarget(this);
            WindowManager.getInstance().popView(false, null, false, false);
        } else if (name == "Enter") {
            this._super("Enter");
            this.registerEvent();
        }
    },    

    registerEvent: function () {
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_BOX_REWARD_GET, this.OnGetBoxReward, this);
    },

    initView:function() {
        let itemGet = [
            {ItemID:15,Count:30},
            {ItemID:1,Count:50000},
            {ItemID:503,Count:2},
        ];            

        for (let i = 0; i < this.itemObjList.length; i++) {
            this.itemObjList[i].getComponent("ItemObject").updateItem(itemGet[i].ItemID, itemGet[i].Count);
            this.itemObjList[i].getComponent("ItemObject").setClick(true, 2);
        }
    },

    update: function(){

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
    
    close: function () {
        this._super();
    },

    OnGetBoxReward:function() {
        // this.close();
    },

    OnCloseBtnClick:function() {
        this.close();
    },

    OnReceiveBtnClick:function() {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            if (GlobalVar.isAndroid) {
                //一天跳方块玩盒子 一天跳游戏开服宝                
                let dayPass = GlobalFunc.getDayPass();
                let jumpid = null;
                if (dayPass%2 == 1) {
                    jumpid = "wx845a2f34af2f4235"; // fangkuaiwan
                }
                else {
                    jumpid = "wxad87ab8811eda63d"; // 开服宝
                }
                let parm = "pages/main/main?coinGiftOnly=coinGiftOnly";
                weChatAPI.navigateToMiniProgram(jumpid, parm);
            }
        }
        else {
            // 直接领取
            GlobalVar.handlerManager().boxRewardHandler.sendBoxRewardReq(1);
        }
    },
});