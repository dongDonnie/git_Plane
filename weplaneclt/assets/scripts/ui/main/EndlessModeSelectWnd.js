const GlobalVar = require("globalvar");
const WindowManager = require("windowmgr");
const WndTypeDefine = require("wndtypedefine");
const RootBase = require("RootBase");
const i18n = require('LanguageData');
const GlobalFunc = require('GlobalFunctions');
const weChatAPI = require("weChatAPI");

cc.Class({
    extends: RootBase,

    properties: {
        choosingCallback:{
            default:null,
            visible:false,
        },
        modeScroll: {
            default: null,
            type: cc.ScrollView,
        },
        modeModel: {
            default: null,
            type: cc.Node,
        },
        labelTip: {
            default: null,
            type: cc.Label,
        },
        itemNextBox: {
            default: null,
            type: cc.Node,
        },
        itemCurBox: {
            default: null,
            type: cc.Node,
        },
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_ENDLESS_MODE_SELECT_WND;
        this.animeStartParam(0, 0);
        this.isFirstIn = true;
        this.choosingCallback = null;
    },

    animeStartParam(paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            if (GlobalVar.getBannerSwitch()){
                weChatAPI.justShowBanner();
            }
            this.modeScroll.loopScroll.releaseViewItems();
            WindowManager.getInstance().popView();
        } else if (name == "Enter") {
            this._super("Enter");
            let self = this;
            if (GlobalVar.getBannerSwitch()){
                weChatAPI.justHideBanner();
            }
            if (this.isFirstIn){
                this.isFirstIn = false;

                this.endlessRankID = GlobalVar.me().endlessData.getRankID();

                let modeDataLength = GlobalVar.tblApi.getLength('TblEndlessRank');
                let startIndex = 0;
                this.modeScroll.loopScroll.setTotalNum(modeDataLength);
                this.modeScroll.loopScroll.setGapDisX(15);
                this.modeScroll.loopScroll.setStartIndex(startIndex);
                this.modeScroll.loopScroll.setCreateModel(this.modeModel);
                this.modeScroll.loopScroll.saveCreatedModel(this.modeScroll.content.children);
                this.modeScroll.loopScroll.registerUpdateItemFunc(function(model, index){
                    self.updateMode(model, index);
                });
                this.modeScroll.loopScroll.registerCompleteFunc(function(){
                    self.canClose = true;
                })
                this.modeScroll.loopScroll.resetView();

                // let rankID = GlobalVar.me().endlessData.getRankID();
                // if (rankID == 0){
                //     rankID = 1;
                // }
                // let nextModeData = GlobalVar.tblApi.getDataBySingleKey('TblEndlessRank', rankID + 1);
                // if (nextModeData){
                //     this.labelTip.string = i18n.t('label.4000259').replace("%d", nextModeData.nScoreReq);
                //     this.itemNextBox.getComponent("ItemObject").updateItem(nextModeData.wRewardItem);
                //     this.itemNextBox.getComponent("ItemObject").setSpriteEdgeVisible(false);
                //     this.itemNextBox.opacity = 255;
                //     this.labelTip.node.opacity = 255;
                // }else{
                //     this.itemNextBox.opacity = 0;
                //     this.labelTip.node.opacity = 0;
                // }
                // let curModeData = GlobalVar.tblApi.getDataBySingleKey('TblEndlessRank', rankID);
                // this.itemCurBox.getComponent("ItemObject").updateItem(curModeData.wRewardItem);
                // this.itemCurBox.getComponent("ItemObject").setSpriteEdgeVisible(false);
                // this.itemCurBox.opacity = 255;
                // this.node.getChildByName("label").opacity = 255;
            }else{
                this.modeScroll.loopScroll.resetView();
                this.endlessRankID = GlobalVar.me().endlessData.getRankID();
            }
        }
    },

    updateMode: function(model, index){
        model.getChildByName("spriteIcon").getComponent("RemoteSprite").setFrame(index);
        model.getChildByName("spriteModeText").getComponent("RemoteSprite").setFrame(index);
        model.getChildByName("labelLevelLimitDesc").active = false;
        // model.getChildByName("btnoSelect").getComponent(cc.Button).clickEvents[0].customEventData = index;
        let strDesc = "";
        let endlessRankData = GlobalVar.tblApi.getDataBySingleKey('TblEndlessRank', index + 1);
        let scoreReq = endlessRankData.nScoreReq;
        let levelReq = endlessRankData.wLevelReq;
        if (GlobalVar.me().endlessData.getRankID() == index + 1){
            strDesc = i18n.t('label.4000260');
            // model.getChildByName("labelDesc").color = cc.color(255, 166, 51);
            model.getChildByName("spriteTextBg").active = true;
        }else if (scoreReq != 0 && index >= GlobalVar.me().endlessData.getRankID()){
            strDesc = i18n.t('label.4000261').replace("%d", scoreReq/10000);
            // model.getChildByName("labelDesc").color = cc.color(255, 166, 51);
            model.getChildByName("spriteTextBg").active = true;
            if (GlobalVar.me().level < levelReq){
                model.getChildByName("labelLevelLimitDesc").getComponent(cc.Label).string = i18n.t('label.4000265').replace("%level", levelReq);
                model.getChildByName("labelLevelLimitDesc").active = true;
            }
        }else{
            model.getChildByName("spriteTextBg").active = false;
        }
        model.getChildByName("labelDesc").getComponent(cc.Label).string = strDesc;
        // let rankID = GlobalVar.me().endlessData.getRankID();
        // if (rankID<index + 1){
        //     model.getChildByName("btnoSelect").getComponent(cc.Button).interactable = false;
        // }else{
        //     model.getChildByName("btnoSelect").getComponent(cc.Button).interactable = true;
        // }
        let modeData = GlobalVar.tblApi.getDataBySingleKey('TblEndlessRank', index + 1);
        model.getChildByName("itemRankBox").getComponent("ItemObject").updateItem(modeData.wRewardItem);
        model.getChildByName("itemRankBox").getComponent("ItemObject").setSpriteEdgeVisible(false);
        model.getChildByName("itemRankBox").opacity = 255;
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

    onBtnSelectMode: function(event, index){
        if (!!this.choosingCallback){
            this.choosingCallback(index);
        }
        this.close();
    },

    setChoosingCallback:function(choosingCallback){
        if(!!choosingCallback){
            this.choosingCallback=choosingCallback;
        }
    },
});