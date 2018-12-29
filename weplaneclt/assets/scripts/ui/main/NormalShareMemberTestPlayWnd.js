const GlobalVar = require("globalvar");
const WindowManager = require("windowmgr");
const WndTypeDefine = require("wndtypedefine");
const RootBase = require("RootBase");
const weChatAPI = require("weChatAPI");
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
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_SHARETESTPLAY_WND;
        this.animeStartParam(0, 0);

        this._callback = null;
        this.memberID = 0;
        // this.nodePlane.setScale(1.2);
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
            let self = this;
            WindowManager.getInstance().popView(false, function () {
                self._callback && self._callback();
                self._callback = null;
            }, false);
        } else if (name == "Enter") {
            this._super("Enter");
            if (GlobalVar.getBannerSwitch()){
                weChatAPI.justHideBanner();
            }
            this.setPlane();
        }
    },

    onBtnShare: function (event) {
        let self = this;
        if (cc.sys.platform == cc.sys.WECHAT_GAME){
            weChatAPI.shareNormal(118, function () {
                GlobalVar.me().shareData.testPlayMemberID = self.memberID;
                self.close();
            })
        } else if (window && window["wywGameId"]=="5469"){

        } else{
            GlobalVar.me().shareData.testPlayMemberID = self.memberID;
            self.close();
        }
    },

    onBtnClose: function(){
        // BattleManager.getInstance().quitOutSide();
        this.nodePlane.removeAllChildren();
        this.planeEntity = null;
        GlobalVar.me().shareData.testPlayMemberID = 0;
        this.close();
    },

    setPlane: function () {
        let self = this;
        if (this.memberID == -1 || this.memberID == 0){
            return;
        }

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

    setTestPlayMemberID: function (memberID) {
        this.memberID = memberID;
    },

    setCallback: function (callback) {
        this._callback = callback || null;
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