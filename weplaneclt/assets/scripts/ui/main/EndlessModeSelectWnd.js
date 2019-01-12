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
        this.canUpGrade = false;
    },

    animeStartParam(paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            this.modeScroll.loopScroll.releaseViewItems();
            WindowManager.getInstance().popView();
        } else if (name == "Enter") {
            this._super("Enter");
            let self = this;

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

            let curMaxScore = GlobalVar.me().endlessData.getHistoryMaxScore();
            let curRankLevel = GlobalVar.me().endlessData.getRankID();
            let endlessNextRankData = GlobalVar.tblApi.getDataBySingleKey('TblEndlessRank', curRankLevel + 1);
            if (!endlessNextRankData) {
                this.node.getChildByName('tips').active = false;
                this.node.getChildByName('btnoUpgrade').active = false;
                this.node.getChildByName('btnoNoUpgrade').active = false;
                this.canUpGrade = false;
            } else {
                let scoreReq = endlessNextRankData.nScoreReq;
                let levelReq = endlessNextRankData.wLevelReq;
    
                if (GlobalVar.me().level >= levelReq && curMaxScore >= scoreReq) {
                    this.node.getChildByName('tips').active = true;
                    this.node.getChildByName('btnoUpgrade').active = true;
                    this.node.getChildByName('btnoNoUpgrade').active = true;
                    let tip = this.node.getChildByName('tips').getChildByName('tipLabel').getComponent(cc.Label);
                    tip.string = "已达到晋级条件，是否晋级为" + endlessNextRankData.strRankName + "，\n并升级军衔宝箱";
                    this.canUpGrade = true;
                } else {
                    this.node.getChildByName('tips').active = false;
                    this.node.getChildByName('btnoUpgrade').active = false;
                    this.node.getChildByName('btnoNoUpgrade').active = false;
                    this.canUpGrade = false;
                }
            }
        }
    },

    updateMode: function(model, index){
        // model.getChildByName("spriteModeText").getComponent("RemoteSprite").setFrame(index);
        // model.getChildByName("btnoSelect").getComponent(cc.Button).clickEvents[0].customEventData = index;
        if (index > 5) {
            model.getChildByName("spriteIcon").y = 80;
        } else {
            model.getChildByName("spriteIcon").y = 70;
        }
        model.getChildByName("spriteIcon").getComponent("RemoteSprite").setFrame(index);
        model.getChildByName("labelLevelLimitDesc").active = true;
        model.getChildByName("spriteTextBg").active = true;
        model.getChildByName("labelDesc").active = true;
        let strDesc = "";
        let limitDesc = '';
        let endlessRankData = GlobalVar.tblApi.getDataBySingleKey('TblEndlessRank', index + 1);
        let scoreReq = endlessRankData.nScoreReq;
        let levelReq = endlessRankData.wLevelReq;
        let curMaxScore = GlobalVar.me().endlessData.getHistoryMaxScore();
        let curRankLevel = GlobalVar.me().endlessData.getRankID();
        limitDesc = i18n.t('label.4000265').replace("%level", levelReq);
        model.getChildByName("labelDesc").x = 56;
        if (curRankLevel == index + 1) { //当前军衔
            strDesc = i18n.t('label.4000260');
            limitDesc = '';
            model.getChildByName("labelDesc").x = 36;
            model.getChildByName('levelRequire').active = false;
            model.getChildByName('scoreRequire').active = false;
        } else if (curRankLevel > index + 1) { //已过军衔
            strDesc = i18n.t('label.4000261').replace("%d", scoreReq / 10000);
            model.getChildByName("labelLevelLimitDesc").active = false;
            model.getChildByName("labelDesc").active = false;
            model.getChildByName('levelRequire').active = false;
            model.getChildByName('scoreRequire').active = false;
            model.getChildByName("spriteTextBg").active = false;
        } else if (curRankLevel == index) { //下一阶军衔
            strDesc = i18n.t('label.4000261').replace("%d", scoreReq / 10000);
            model.getChildByName('levelRequire').active = true;
            model.getChildByName('scoreRequire').active = true;
            if (GlobalVar.me().level < levelReq) {
                model.getChildByName('levelRequire').getComponent('RemoteSprite').setFrame(1);
            } else {
                model.getChildByName('levelRequire').getComponent('RemoteSprite').setFrame(0);
            }

            if (curMaxScore < scoreReq) {
                model.getChildByName('scoreRequire').getComponent('RemoteSprite').setFrame(1);
            } else {
                model.getChildByName('scoreRequire').getComponent('RemoteSprite').setFrame(0);
            }
        } else { // 未达到军衔
            strDesc = i18n.t('label.4000261').replace("%d", scoreReq / 10000);
            model.getChildByName('levelRequire').active = false;
            model.getChildByName('scoreRequire').active = false;
        }

        model.getChildByName("labelDesc").getComponent(cc.Label).string = strDesc;
        model.getChildByName("labelLevelLimitDesc").getComponent(cc.Label).string = limitDesc;

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

    close: function () {
        this.node.getChildByName('tips').active = false;
        this.node.getChildByName('btnoUpgrade').active = false;
        this.node.getChildByName('btnoNoUpgrade').active = false;
        this._super();
    },

    onBtnUpGrade: function () {
        if (this.canUpGrade) {
            GlobalVar.handlerManager().endlessHandler.sendEndlessRankUpReq();
            GlobalVar.handlerManager().endlessHandler.sendEndlessGetBagReq();
        }
        this.close();
    },

    onBtnNoUpgrade: function () {
        this.close();
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