const RootBase = require("RootBase");
const WindowManager = require("windowmgr");
const WndTypeDefine = require("wndtypedefine");
const GlobalVar = require('globalvar')
const EventMsgID = require("eventmsgid");
const CommonWnd = require("CommonWnd");
const GlobalFunc = require('GlobalFunctions');
const i18n = require('LanguageData');
const GameServerProto = require("GameServerProto");

cc.Class({
    extends: RootBase,

    properties: {
        curSpaceNode: {
            default: null,
            type: cc.Node
        },
        nextSpaceNode: {
            default: null,
            type: cc.Node
        },
        curSpaceName:{
            default: null,
            type: cc.Label
        },
        nextSpaceName:{
            default: null,
            type: cc.Label
        },
        curCondition:{
            default: null,
            type: cc.Label
        },
        nextCondition:{
            default: null,
            type: cc.Label
        },
        curBaseDrop:{
            default: [],
            type: [cc.Label],
        },
        nextBaseDrop:{
            default: [],
            type: [cc.Label],
        },
        curScrollView:{
            default: null,
            type: cc.Node
        },
        nextScrollView:{
            default: null,
            type: cc.Node
        },
        btnUpgrade:{
            default:null,
            type:cc.Node
        },
        itemModel:{
            default:null,
            type:cc.Node
        },
        curSpaceFlag:{
            default:null,
            type:cc.Node
        },
    },

    onLoad: function () {
        this._super();
        this.animeStartParam(1, 255);
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_SPACE_EXPLORE_AREA_WND;
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
            this.registerEvent();
            this.updateView();
        }
    },

    registerEvent: function () {
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_EXPLORE_DATA_GET, this.OnUpgradeArea, this);
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
    
    updateView:function() {
        let curAreaId = GlobalVar.me().spaceExploreData.getCurAreaId();

        let nextAreaId = curAreaId+1;

        let nextAreaData = GlobalVar.tblApi.getDataBySingleKey("TblExplore",nextAreaId);

        if (nextAreaData == null) {
            this.nextSpaceNode.active = false;
            this.node.height = 480;
            this.curSpaceNode.y = -25;
        }
        else {
            this.nextSpaceNode.active = true;
            this.node.height = 890;
            this.curSpaceNode.y = 180;
            /*刷新下一区域信息 */
            // 区域名称
            this.nextSpaceName.string = nextAreaData.strName;

            // 解锁条件
            let chapter = Math.ceil(nextAreaData.wCampaignID/10);
            let campaign = nextAreaData.wCampaignID%10 == 0 ? 10 : nextAreaData.wCampaignID%10;
            this.nextCondition.string = i18n.t('label.4004002').replace('%chapter',chapter).replace('%campaign', campaign);

            // 基础掉落
            this.nextBaseDrop[0].string = nextAreaData.wXingBi;
            this.nextBaseDrop[1].string = nextAreaData.wExp;

            // 概率掉落
            let dropList = nextAreaData.oVecShowPackage;
            this.refreshScrollView(dropList,this.nextScrollView);            

            // // 刷新升级区域按钮的状态
            // if (GlobalVar.me().campData.getLastCampaignID(GameServerProto.PT_CAMPTYPE_MAIN) <= nextAreaData.wCampaignID) {
            //     this.btnUpgrade.getComponent(cc.Button).interactable = false;
            // }
            // else {
            //     this.btnUpgrade.getComponent(cc.Button).interactable = true;
            // }
        }

        /*刷新当前区域信息 */
        // 区域名称
        let curAreaData = GlobalVar.tblApi.getDataBySingleKey("TblExplore",curAreaId);
        this.curSpaceName.string = curAreaData.strName;

        // 解锁条件
        let chapter = Math.ceil(curAreaData.wCampaignID/10);
        let campaign = curAreaData.wCampaignID%10 == 0 ? 10 : curAreaData.wCampaignID%10;;
        this.curCondition.string = i18n.t('label.4004002').replace('%chapter',chapter).replace('%campaign', campaign);

        // 基础掉落
        this.curBaseDrop[0].string = curAreaData.wXingBi;
        this.curBaseDrop[1].string = curAreaData.wExp;

        // 概率掉落
        let dropList = curAreaData.oVecShowPackage;
        this.refreshScrollView(dropList,this.curScrollView);
    },

    refreshScrollView:function(itemList,scrollView) {
        let _scrollView = scrollView.getComponent(cc.ScrollView);
        _scrollView.loopScroll.setTotalNum(itemList.length);
        _scrollView.loopScroll.setCreateModel(this.itemModel);
        _scrollView.loopScroll.saveCreatedModel(_scrollView.content.children);
        _scrollView.loopScroll.registerUpdateItemFunc(function (item, index) {
            item.getComponent("ItemObject").updateItem(itemList[index].wItemID, itemList[index].nCount);
            item.getComponent("ItemObject").setClick(true, 2);
        });
        _scrollView.loopScroll.resetView();
    },

    onClickUpgradeBtn:function() {
        GlobalVar.handlerManager().spaceExploreHandler.sendSelectAreaReq();
    },

    OnUpgradeArea:function() {
        let self = this;
        this.curSpaceFlag.active = false;
        this.curSpaceFlag.setScale(3);
        this.btnUpgrade.active = false;

        this.curSpaceNode.getChildByName("contentNode").runAction(cc.sequence(cc.scaleTo(0.2,0),cc.callFunc(function() {
            self.curSpaceNode.getChildByName("contentNode").setScale(1);
            self.curSpaceFlag.active = true;
            self.curSpaceFlag.runAction(cc.scaleTo(0.3,1));
            self.updateView();
        })));
        this.nextSpaceNode.getChildByName("contentNode").runAction(cc.sequence(cc.moveBy(0.2,0,342),cc.callFunc(function() {
            self.btnUpgrade.active = true;
            self.nextSpaceNode.getChildByName("contentNode").y = 37;
        })));
    },

    onClickCloseBtn:function() {
        this.close();
    },

});