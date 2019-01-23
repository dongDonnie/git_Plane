const RootBase = require("RootBase");
const WindowManager = require("windowmgr");
const WndTypeDefine = require("wndtypedefine");
const GlobalVar = require('globalvar')
const GlobalFunc = require('GlobalFunctions')
const CommonWnd = require("CommonWnd");

const MODE_GET_DRAW_ITEM = 1;

cc.Class({
    extends: RootBase,

    properties: {
        spriteBackLight: {
            default: null,
            type: cc.Sprite
        },
        layoutItemContent: {
            default: null,
            type: cc.Node
        },
        itemModel: {
            default: null,
            type: cc.Node,
        },
        itemStack: [],
        nodeOpenSystem: {
            default: null,
            type: cc.Node
        },
        openModel: {
            default: null,
            type: cc.Node
        },
        btnContinue: {
            default: null,
            type: cc.Node
        }
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_LEVEL_UP_WND;
        

        this.spriteBackLight.node.runAction(cc.repeatForever(cc.rotateBy(8, 360)));
        this.btnContinue.getChildByName("spriteContinue").runAction(cc.repeatForever(cc.sequence(cc.fadeOut(0.7),cc.fadeIn(0.7))))
        this.animeStartParam(0, 0);
    },

    animeStartParam(paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;
    },

    initLevelUpWnd: function (levelUpData) {
        this.layoutItemContent.removeAllChildren();
        let count = 0;
        // //钻石
        // if (levelUpData.DiamondReward !== 0) {
        //     count += 1;
        //     let itemData = {}
        //     itemData.ItemID = 3;
        //     itemData.Count = levelUpData.DiamondReward;
        //     this.addItem(itemData);
        // }
        //金币
        if (levelUpData.GoldReward !== 0) {
            count += 1;
            let itemData = {}
            itemData.ItemID = 1;
            itemData.Count = levelUpData.GoldReward;
            this.addItem(itemData);
        }
        //体力
        if (levelUpData.SpReward !== 0) {
            count += 1;
            let itemData = {}
            itemData.ItemID = 15; //体力的ID
            itemData.Count = levelUpData.SpReward;
            this.addItem(itemData);
        }
        let layout = this.layoutItemContent.getComponent(cc.Layout);
        if (count == 1) {
            layout.paddingLeft = 260;
            layout.paddingRight = 260;
        } else if (count == 2) {
            layout.paddingLeft = 170;
            layout.paddingRight = 170;
            layout.spacingX = 100;
        } else if (count == 3) {
            layout.paddingLeft = 115;
            layout.paddingRight = 115;
            layout.spacingX = 50;
        }
        layout.updateLayout();

        let spriteTipBg = this.node.getChildByName("nodeLevelUp").getChildByName("spriteTipBg")
        let labelLevelBefore = spriteTipBg.getChildByName("labelLevelBefore").getComponent(cc.Label);
        let labelLevelCur = spriteTipBg.getChildByName("labelLevelCur").getComponent(cc.Label);
        labelLevelBefore.string = levelUpData.LevelOld;
        labelLevelCur.string = levelUpData.LevelCur;
        this.levelOld = levelUpData.LevelOld;
        this.nodeOpenSystem.removeAllChildren();
    },

    addItem: function (data, mode) {
        let item = cc.instantiate(this.itemModel);
        item.opacity = 255;
        item.active = true;
        item.parent = this.layoutItemContent;
        let itemData = null;
        if (data.Count == 1){
            data.Count = -1;
        }
        if (data.ItemID) {
            itemData = item.getChildByName("ItemObject").getComponent("ItemObject").updateItem(data.ItemID, data.Count);
        } else if (data.wItemID) {
            itemData = item.getChildByName("ItemObject").getComponent("ItemObject").updateItem(data.wItemID, data.nCount)
        }
        if (mode == MODE_GET_DRAW_ITEM) {
            item.getChildByName("labelItemName").getComponent(cc.Label).string = "";
        }else{
            item.getChildByName("labelItemName").getComponent(cc.Label).string = itemData.strName;
        }
        item.getChildByName("labelItemName").color = GlobalFunc.getCCColorByQuality(itemData.wQuality);
        return item;
    },

    update: function(){

    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            var self = this;
            WindowManager.getInstance().popView(false, function () {
                // let level = GlobalVar.me().getLevel();
                // let limitLevel = GlobalVar.tblApi.getDataBySingleKey('TblSystem', 24).wOpenLevel;
                // let sweep = GlobalVar.tblApi.getDataBySingleKey('TblSystem', 31).wOpenLevel;
                // if (level >= limitLevel && self.levelOld < limitLevel) {
                //     require('Guide').getInstance().guideToEndless();
                // }
                // // else if (level >= sweep && self.levelOld < sweep) { 
                // //     require('Guide').getInstance().guideToSweep();
                // else{
                //     WindowManager.getInstance().resumeView();
                // }
                WindowManager.getInstance().resumeView();
            }, false);
            this.getNodeByName('btnNode').active = false;
            this.btnContinue.active = false;
        } else if (name == "Enter") {
            this._super("Enter");
            var self = this;
            GlobalVar.me().setLevelUpFlag();
            this.openNewFunction();
            cc.find('Canvas/UINode/UIMain').getComponent('UIMain').showDeskIcon();

            if (GlobalVar.getShareSwitch() && GlobalVar.me().getLevel() > 5) {
                this.btnContinue.active = false;
                this.getNodeByName('btnNode').active = true;
                this.getNodeByName('btnRecvText').active = false;
                setTimeout(() => {
                    self.getNodeByName('btnRecvText').active = true;
                }, 1000);
            } else {
                this.btnContinue.active = true;
                this.getNodeByName('btnNode').active = false;
            }
        }
    },

    openNewFunction: function () { 
        let level = GlobalVar.me().getLevel();
        let tblSystem = GlobalVar.tblApi.getData('TblSystem');
        let systems = [];
        for (let key in tblSystem) {
            if (tblSystem[key].wOpenLevel != 1 && tblSystem[key].wOpenLevel != 999 && tblSystem[key].byLevelUpShow == 1) {
                systems.push(tblSystem[key]);
            }
        }
        let systemNum = 0;
        for (let i = 0; i < systems.length; i++){
            if (level >= systems[i].wOpenLevel && this.levelOld < systems[i].wOpenLevel && systemNum < 2) {
                let model = cc.instantiate(this.openModel);
                model.active = true;
                model.getChildByName('labelOpenTecName').getComponent(cc.Label).string = systems[i].strName+' 开启';
                model.getChildByName('labelOpenTecDesc').getComponent(cc.Label).string = systems[i].strLevelUpString;
                model.getChildByName('spriteOpenIcon').active = true;
                model.getChildByName('btnGo').active = false;
                this.nodeOpenSystem.addChild(model);
                systemNum++;
            }
        }

        // let chapterDataList = GlobalVar.tblApi.getDataBySingleKey('TblChapter', 1);
        // for (let i = 0; i < chapterDataList.length; i++){
        //     if (level >= chapterDataList[i].wOpenLv && this.levelOld < chapterDataList[i].wOpenLv) {
        //         let str = '第' + (i + 1) + '章  ' + chapterDataList[i].strChapterName + '  开启';
        //         let model = cc.instantiate(this.openModel);
        //         model.active = true;
        //         model.getChildByName('labelOpenTecName').getComponent(cc.Label).string = "主线关卡";
        //         model.getChildByName('labelOpenTecDesc').getComponent(cc.Label).string = str;
        //         model.getChildByName('spriteOpenIcon').active = false;
        //         model.getChildByName('btnGo').active = true;
        //         this.nodeOpenSystem.addChild(model);
        //     }
        // }
    },

    onBtnDoubleReward: function () {
        let platformApi = GlobalVar.getPlatformApi();
        let self = this;
        this.watchVideo = false;
        if (platformApi) {
            platformApi.showRewardedVideoAd(236, function () {
                GlobalVar.handlerManager().meHandler.sendDoubleReward(self.levelOld);
                self.watchVideo = true;
                self.btnContinue.active = true;
                self.getNodeByName('btnNode').active = false;
            }, function () {
                platformApi.shareNormal(136, function () {
                    GlobalVar.handlerManager().meHandler.sendDoubleReward(self.levelOld);
                    self.watchVideo = true;
                    self.btnContinue.active = true;
                    self.getNodeByName('btnNode').active = false;
                });
            })
        } else {
            GlobalVar.handlerManager().meHandler.sendDoubleReward(self.levelOld);
            this.watchVideo = true;
            this.btnContinue.active = true;
            this.getNodeByName('btnNode').active = false;
        }
    },

    goToChapterView: function () {
        CommonWnd.showQuestList();
    },

    showBannnerCallback: function (bannerHeight) {
        let spriteTip = this.btnContinue.getChildByName("spriteContinue");
        if (cc.sys.platform == cc.sys.WECHAT_GAME){
            let winHeight = cc.winSize.height;
            let screenHeight = wx.getSystemInfoSync().screenHeight;
            spriteTip.y = -(winHeight / 2 - bannerHeight / screenHeight * winHeight);
            cc.log('btnNodeY', -(winHeight / 2 - bannerHeight / screenHeight * winHeight));
            this.getNodeByName('btnNode').y = -(winHeight / 2 - bannerHeight / screenHeight * winHeight);
        }else{
            spriteTip.y = -330;
            this.getNodeByName('btnNode').y = -330;
        }
    },

    enter: function (isRefresh) {
        let self = this;
        if (GlobalVar.getShareSwitch() && GlobalVar.me().getLevel() > 5 && !this.watchVideo) {
            this.btnContinue.active = false;
            this.getNodeByName('btnNode').active = true;
            this.getNodeByName('btnRecvText').active = false;
            setTimeout(() => {
                self.getNodeByName('btnRecvText').active = true;
            }, 1000);
        }
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
        // this.getNodeByName('btnNode').active = false;
        // this.btnContinue.active = false;
    },

    onBtnRecv: function () {
        this.close();
    },

});