const GlobalVar = require("globalvar");
const WindowManager = require("windowmgr");
const WndTypeDefine = require("wndtypedefine");
const RootBase = require("RootBase");
const i18n = require('LanguageData');
const GlobalFunc = require('GlobalFunctions');
const EventMsgID = require("eventmsgid");
const weChatAPI = require("weChatAPI");
const GameServerProto = require("GameServerProto");
const CommonWnd = require("CommonWnd");
const StoreageData = require("storagedata");
const BattleManager = require('BattleManager');
const PlaneEntity = require('PlaneEntity');
const Defines = require('BattleDefines');
const ResMapping = require("resmapping");

cc.Class({
    extends: RootBase,

    properties: {
        nodePlane: {
            default: null,
            type: cc.Node,
        },
        btnShare: {
            default: null,
            type: cc.Button,
        },
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_SHARETESTPLAYFINISH_WND;
        this.animeStartParam(0, 0);

        
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
            GlobalVar.eventManager().removeListenerWithTarget(this);
            WindowManager.getInstance().popView(false, function () {

            }, false);
        } else if (name == "Enter") {
            this._super("Enter");
            if (GlobalVar.getBannerSwitch()){
                weChatAPI.justHideBanner();
            }
            this.memberID = GlobalVar.me().shareData.testPlayMemberID;
            GlobalVar.me().shareData.testPlayMemberID = 0;
            this.showTestPlayPlane();
            GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_MEMBERTESTPLAY_DATA, this.getTestPlayData, this);
            this.btnShare.interactable = true;
        }
    },

    showTestPlayPlane: function () {
        let self = this;
        GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/battlemodel/prefab/Fighter/Fighter_' + this.memberID, function(){
            if (!self.planeEntity) {
                self.planeEntity = new PlaneEntity();
                self.planeEntity.newPart('Fighter/Fighter_' + self.memberID, Defines.ObjectType.OBJ_HERO, 'PlaneObject', 3, 0, 0);
                self.planeEntity.setPosition(0, 0);
                self.nodePlane.addChild(self.planeEntity);
                self.planeEntity.part.transform();
            }
        });
    },

    getTestPlayData: function (event) {
        if (event.ErrCode != GameServerProto.PTERR_SUCCESS){
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }

        if (event.Item.length > 0){
            CommonWnd.showTreasureExploit(event.Item);
        }
    },

    onBtnShare: function (event) {
        let self = this;
        if (cc.sys.platform == cc.sys.WECHAT_GAME){
            weChatAPI.shareNormal(119, function () {
                GlobalVar.handlerManager().shareHandler.sendMemberTestPlayReq(self.memberID);
                self.btnShare.interactable = false;
            })
        } else if (window && window["wywGameId"]=="5469"){

        } else{
            GlobalVar.handlerManager().shareHandler.sendMemberTestPlayReq(this.memberID);
            this.btnShare.interactable = false;
        }
    },

    onBtnClose: function(){
        // BattleManager.getInstance().quitOutSide();
        this.nodePlane.removeAllChildren();
        this.planeEntity = null;
        this.close();
    },

    onBtnGetWay: function () {
        if (GlobalVar.getBannerSwitch()){
            weChatAPI.hideBannerAd();
        }
        GlobalVar.eventManager().removeListenerWithTarget(this);
        WindowManager.getInstance().popView(false, function () {
            CommonWnd.showDrawView();
        }, false, false);
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

});