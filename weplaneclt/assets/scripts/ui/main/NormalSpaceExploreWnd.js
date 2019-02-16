const WindowManager = require("windowmgr");
const WndTypeDefine = require("wndtypedefine");
const RootBase = require("RootBase");
const GlobalVar = require('globalvar')
const EventMsgID = require("eventmsgid");
const GameServerProto = require("GameServerProto");
const CommonWnd = require("CommonWnd");
const BattleManager = require('BattleManager');
const SceneDefines = require("scenedefines");
const GlobalFunc = require('GlobalFunctions');
const i18n = require('LanguageData');

const limitStoreGiftId = 22;

cc.Class({
    extends: RootBase,

    properties: {
        effectNode: {
            default: null,
            type: cc.Node,
        },
        countLabel: {
            default: null,
            type: cc.Label,
        },
        recoverTimeLabel: {
            default: null,
            type: cc.Label,
        },
        spacenameLabel: {
            default: null,
            type: cc.Label,
        },        
        treasureTimeLabel: {
            default: null,
            type: cc.Label,
        },
        boxproLabel: {
            default: null,
            type: cc.RichText,
        },
        markflagSp: {
            default: null,
            type: cc.Node,
        },
        treasureNode: {
            default:null,
            type:cc.Node,
        }
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_SPACE_EXPLORE_WND;
        this.animeStartParam(0);

        this.initView();

        if (GlobalFunc.isAllScreen() && !this.fixViewComplete) {
            this.fixViewComplete = true;
            this.fixView();
        }
    },

    fixView:function() {},

    animeStartParam(num) {
        this.node.opacity = num;
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");

            GlobalVar.eventManager().removeListenerWithTarget(this);
        } else if (name == "Enter") {
            this._super("Enter");
            this.registerEvent();

            // 请求空间探索的数据
            GlobalVar.handlerManager().spaceExploreHandler.sendExploreDataReq();
        }
    },

    registerEvent: function () {
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_EXPLORE_DATA_GET, this.updateView, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_LIMIT_STORE_DATA_NTF, this.onLimitStoreDataGet, this);
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

    onDestroy: function () {
        GlobalVar.eventManager().removeListenerWithTarget(this);
    },

    initView:function() {
        this.effectNode.active = false;

        this.markflagSp.active = false;

        this.treasureNode.active = false;

        this.vipLevel = GlobalVar.me().vipLevel;
    },

    onClickToggleBtn:function() {
        if ( this.vipLevel< 5) {
            this.markflagSp.active = false;
            GlobalVar.comMsg.showMsg(i18n.t('label.4004001'));
            return;
        }
        this.markflagSp.active = !this.markflagSp.active;
    },

    updateView:function() {
        let exploreData = GlobalVar.me().spaceExploreData.getExploreData();
        let exploreTbl = GlobalVar.tblApi.getDataBySingleKey('TblExplore', exploreData.AreaID);
        if (exploreData == null) {
            return;
        }
        // 探索次数
        let maxCount = GlobalVar.tblApi.getDataBySingleKey('TblVipRight', this.vipLevel).wExploreNaiLiMax;
        this.countLabel.string = exploreData.NaiLi + "/" + maxCount;

        // 恢复时间
        this.recoverTime = exploreData.RecoverTime;
        let recoverTimeStr = this.getLeftTime(this.recoverTime - GlobalVar.me().serverTime, false);
        this.isFull = false;
        if (exploreData.NaiLi == maxCount) {
            this.isFull = true;
        }
        recoverTimeStr = "00:00";
        this.recoverTimeLabel.string = recoverTimeStr;

        // 探索区域名称
        this.spacenameLabel.string = exploreTbl.strName;

        // 宝箱进度
        this.boxproLabel.string = "<color=#42C7FE>进度 </c><color=#ABCAF5>"+exploreData.Progress+"/"+exploreTbl.wRewardProgress+"</color>";
    },

    getLeftTime:function(leftTime,isNeedHour) {
        let leftTimeStr = "00:00";
        if (isNeedHour) {
            leftTimeStr = "00:00:00";
        }
        if (leftTime > 0) {
            var hours = parseInt(leftTime / 3600);
            leftTime = leftTime % 3600;
            var mins = parseInt(leftTime / 60) % 60;
            var secs = parseInt(leftTime % 60);
            leftTimeStr = (mins < 10 ? "0" + mins : mins) + ":" + (secs < 10 ? "0" + secs : secs);
            if (isNeedHour) {                
                leftTimeStr = (hours < 10 ? "0" + hours : hours) + ":" + (mins < 10 ? "0" + mins : mins) + ":" + (secs < 10 ? "0" + secs : secs);
            }
        }
        return leftTimeStr;
    },

    onLimitStoreDataGet:function() {
        let curTime = GlobalVar.me().limitStoreData.findFuliGiftById(limitStoreGiftId).Num;
        let item = GlobalVar.tblApi.getDataBySingleKey('TblFuLiGiftLimit', limitStoreGiftId);
        let maxTime = item.wLimit;
        let diamondCost = GlobalVar.me().limitStoreData.getBuyCostNum(curTime + 1, curTime + 1, item.oVecCost);
        let remainBuyTimes = maxTime - curTime;

        CommonWnd.showPurchaseWnd([{id:5200, num:1}], remainBuyTimes,[{id:3, num:diamondCost}], "购买", "购买商品", null, null, null);                
    },

    // 探索
    onClickExploreBtn:function() {
        if (GlobalVar.me().spaceExploreData.getExploreCount() == 0) {
            let powerCount = GlobalVar.me().bagData.getItemCountById(limitStoreGiftId);
            if (powerCount == 0) {
                // 没有能量瓶显示购买界面

                // 请求限时商店数据
                let msg = {
                    Type: GameServerProto.PT_FULI_TYPE_LIMIT_GIFT,
                };
                // cc.log("发送数据");
                GlobalVar.handlerManager().limitStoreHandler.sendReq(GameServerProto.GMID_FULI_GIFT_DATA_REQ, msg);
            }            
            else {
                // 显示使用界面
            }
        }
        else {
            // 探索
            this.effectNode.stopAllActions();
            this.effectNode.active = true;
            this.effectNode.opacity = 80;
            this.effectNode.setScale(1);
            let action = cc.sequence(cc.scaleTo(0.7,1.1),cc.fadeOut(0.3));
            this.effectNode.runAction(action);
        }
    },

    onClickUpgradeBtn:function() {        
        CommonWnd.showSpaceAreaWnd();
    },

    onClickTreasureBtn:function() {},

    onClickBoxBtn:function() {},

    onClickCaveBtn:function() {},

    update() {
        if (!this.isFull) {
            // 恢复时间
            this.recoverTimeLabel.string = this.getLeftTime(this.recoverTime - GlobalVar.me().serverTime, false);            
        }
    },
});