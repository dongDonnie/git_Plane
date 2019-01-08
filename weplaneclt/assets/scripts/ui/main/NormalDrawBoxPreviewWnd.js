
const RootBase = require("RootBase");
const WindowManager = require("windowmgr");
const GlobalVar = require('globalvar')
const WndTypeDefine = require("wndtypedefine");
const GameServerProto = require("GameServerProto");
const GlobalFunc = require('GlobalFunctions');
const weChatAPI = require("weChatAPI");

cc.Class({
    extends: RootBase,

    properties: {
        itemMustScorll: {
            default: null,
            type: cc.ScrollView,
        },
        itemProbScroll: {
            default: null,
            type: cc.ScrollView,
        },
        itemModel: {
            default: null,
            type: cc.Node,
        },
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMALDRAW_PREVIEW_WND;

        this.animeStartParam(0, 0);
        this.itemMustIDVec = [];
        this.itemProbIDVec = [];
        this.canClose = false;
    },

    animeStartParam(paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            WindowManager.getInstance().popView(false, null, false, false);
        } else if (name == "Enter") {
            this._super("Enter");
            this.initNormalDrawBoxPreviewWnd();
        }
    },

    setItemShowVec: function (itemMustIDVec, itemProbIDVec) {
        this.itemMustIDVec = itemMustIDVec;
        this.itemProbIDVec = itemProbIDVec;
    },

    initNormalDrawBoxPreviewWnd: function () {
        let self = this;
        this.itemMustScorll.loopScroll.releaseViewItems();
        this.itemMustScorll.loopScroll.setTotalNum(this.itemMustIDVec.length);
        this.itemMustScorll.loopScroll.setGapDisX(12);
        this.itemMustScorll.loopScroll.setCreateModel(this.itemModel);
        this.itemMustScorll.loopScroll.registerUpdateItemFunc(function(model, index){
            let itemData = model.getChildByName("ItemObject").getComponent("ItemObject").updateItem(self.itemMustIDVec[index]);
            let labelName = model.getChildByName("labelName").getComponent(cc.Label)
            labelName.string = itemData.strName;
            labelName.node.color = GlobalFunc.getCCColorByQuality(itemData.wQuality);
            model.getChildByName("ItemObject").getComponent("ItemObject").setClick(true, 2);
        });
        this.itemMustScorll.loopScroll.registerCompleteFunc(function(){
            self.canClose = true;
        })
        this.itemMustScorll.loopScroll.resetView();

        this.itemProbScroll.loopScroll.releaseViewItems();
        this.itemProbScroll.loopScroll.setTotalNum(this.itemProbIDVec.length);
        this.itemProbScroll.loopScroll.setColNum(4);
        this.itemProbScroll.loopScroll.setGapDisX(24);
        this.itemProbScroll.loopScroll.setCreateModel(this.itemModel);
        this.itemProbScroll.loopScroll.registerUpdateItemFunc(function(model, index){
            let itemData = model.getChildByName("ItemObject").getComponent("ItemObject").updateItem(self.itemProbIDVec[index]);
            let labelName = model.getChildByName("labelName").getComponent(cc.Label)
            labelName.string = itemData.strName;
            labelName.node.color = GlobalFunc.getCCColorByQuality(itemData.wQuality);
            model.getChildByName("ItemObject").getComponent("ItemObject").setClick(true, 2);
        });
        this.itemProbScroll.loopScroll.registerCompleteFunc(function(){
            self.canClose = true;
        })
        this.itemProbScroll.loopScroll.resetView();
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
        if(!!this.canClose){
            this.itemMustScorll.loopScroll.releaseViewItems();
            this.itemProbScroll.loopScroll.releaseViewItems();
            this._super();
        }
    },

});
