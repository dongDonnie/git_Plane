const RootBase = require("RootBase");
const WindowManager = require("windowmgr");
const WndTypeDefine = require("wndtypedefine");
const GlobalVar = require('globalvar')
const EventMsgID = require("eventmsgid");
const CommonWnd = require("CommonWnd");
const GlobalFunc = require('GlobalFunctions');
const i18n = require('LanguageData');

cc.Class({
    extends: RootBase,

    properties: {
        treasureNode: {
            default: null,
            type: cc.Node
        },
        openNode: {
            default: null,
            type: cc.Node
        },
        cellNode: {
            default: null,
            type: cc.Node
        },
        spriteBackLight: {
            default: null,
            type: cc.Node,
        },
        spriteItemBg: {
            default:null,
            type:cc.Node,
        },
        itemObj: {
            default: null,
            type: cc.Node,
        },
        itemNameLabel: {
            default:null,
            type:cc.Label,
        }
    },

    onLoad: function () {
        this._super();
        this.animeStartParam(1, 255);
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_BANNER_YD_WND;
        
        this.spriteBackLight.runAction(cc.repeatForever(cc.rotateBy(8, 360)));

        this.canvasNode = cc.find("Canvas");
        
        this.treasureNode.getChildByName("btnNode").getComponent(cc.Widget).target = this.canvasNode;
        this.openNode.getChildByName("btnNode").getComponent(cc.Widget).target = this.canvasNode;

        if (GlobalFunc.isAllScreen()) {
            this.openNode.getChildByName("btnNode").getComponent(cc.Widget).bottom = this.canvasNode.height/2 + 30;
        }


        // 请求超级诱导的奖励
        GlobalVar.handlerManager().bannerYdHandler.sendSuperInduceReq();
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
                platformApi.hideBannerAdNew();
            }
            let self = this;
            GlobalVar.eventManager().removeListenerWithTarget(this);
            WindowManager.getInstance().popView(false, function () {
                CommonWnd.showQuestList();
            }, false, false);
        } else if (name == "Enter") {
            this._super("Enter");
            this.showBannerYd();
            this.registerEvent();
        }
    },

    registerEvent: function () {
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_SUPER_INDUCE_GET, this.OnGetSuperInduceReward, this);
    },
    
    OnGetSuperInduceReward:function(data) {
        let itemData = GlobalVar.tblApi.getDataBySingleKey('TblItem', data[0].ItemID);
        GlobalVar.comMsg.showMsg(i18n.t('label.4000702').replace('%count', data[0].Count).replace('%name', itemData.strName));
        this.close();
    },

    showBannerYd: function () {
        this.treasureNode.active = true;
        this.openNode.active = false;

        for (let i = 0; i < this.cellNode.childrenCount; i++) {
            this.cellNode.children[i].active = false;
        }
        this.clickTimes = 0;
        this.startTimestamp = 0;
        this.endTimestamp = 0;
        this.randomTimes = Math.ceil(Math.random()*(5-2))+2;
    },

    OnClickOpenBtn:function() {
        this.cellNode.children[this.clickTimes].active = true;
        if (this.clickTimes == 0) {            
            this.scheduleOnce(this.timeEndCallback, 5);
            this.startTimestamp = Date.now();
        }

        this.clickTimes ++ ;
        if (this.clickTimes == this.randomTimes) {
            this.endTimestamp = Date.now();
            if (this.startTimestamp) {
                if (this.endTimestamp - this.startTimestamp < 333 * (this.clickTimes-1)) {
                    this.showRewardNode();
                }
                else {
                    this.showNoReward();
                }
            }
        }
    },

    showRewardNode: function() {
        this.unschedule(this.timeEndCallback);

        this.treasureNode.active = false;
        let itemList =  GlobalVar.me().bannerYdData.getRewardData();
        if (itemList.length > 0) {
            let platformApi = GlobalVar.getPlatformApi();
            if (platformApi) {
                platformApi.showBannerAdNew();
            }
            this.openNode.active = true;
            this.spriteItemBg.runAction(cc.moveTo(0.2,0,60));

            this.itemList =  GlobalVar.me().bannerYdData.getRewardData();
            this.itemObj.getComponent("ItemObject").updateItem(this.itemList[0].ItemID, this.itemList[0].Count);
            let itemData = GlobalVar.tblApi.getDataBySingleKey('TblItem', this.itemList[0].ItemID);
            this.itemNameLabel.string = itemData.strName;
        }
        else {
            WindowManager.getInstance().popView(false, function () {
                GlobalVar.comMsg.showMsg(i18n.t('label.4000701'));
            });
        }
    },

    timeEndCallback: function() {
        this.showNoReward();
    },

    showNoReward: function() {
        this.unschedule(this.timeEndCallback);
        WindowManager.getInstance().popView(false, function () {
            GlobalVar.comMsg.showMsg(i18n.t('label.4000703'));
        });
    },

    onBtnRecv: function () {
        GlobalVar.handlerManager().bannerYdHandler.sendSuperInduceGetReq(0);
    },

    onBtnDouble:function() {
        let platformApi = GlobalVar.getPlatformApi();
        if (platformApi) {
            platformApi.showRewardedVideoAd(224,
                function() {
                    GlobalVar.handlerManager().bannerYdHandler.sendSuperInduceGetReq(1);
                },
                function() {
                    platformApi.shareNormal(124, function () {
                        GlobalVar.handlerManager().bannerYdHandler.sendSuperInduceGetReq(1);
                    })
                }
            );
        }
        else {
            GlobalVar.handlerManager().bannerYdHandler.sendSuperInduceGetReq(1);
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

    // showBannnerCallback: function (bannerHeight) {
    //     if (cc.sys.platform == cc.sys.WECHAT_GAME){
    //         let winHeight = cc.winSize.height;
    //         let screenHeight = wx.getSystemInfoSync().screenHeight;

    //         this.openNode.getChildByName("btnNode").getComponent(cc.Widget).bottom = winHeight/2 - bannerHeight / screenHeight * winHeight;
    //     }
    // },

});