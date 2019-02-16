const GlobalVar = require("globalvar");
const WindowManager = require("windowmgr");
const WndTypeDefine = require("wndtypedefine");
const RootBase = require("RootBase");
const BattleManager = require('BattleManager');
const StoreageData = require("storagedata");

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
            BattleManager.getInstance().quitOutSide();
            GlobalVar.eventManager().removeListenerWithTarget(this);
            let self = this;
            WindowManager.getInstance().popView(false, function () {
                if (GlobalVar.me().shareData.testPlayMemberID == 0) {
                    self.closeCallback && self.closeCallback();
                } else {
                    self._callback && self._callback();
                }
            }, false);
        } else if (name == "Enter") {
            this._super("Enter");
            this.setPlane();

            let platformApi = GlobalVar.getPlatformApi();
            if (platformApi && GlobalVar.canShowVideo()) {
                this.getNodeByName('videoIcon').getComponent('RemoteSprite').setFrame(0);
            } else {
                this.getNodeByName('videoIcon').getComponent('RemoteSprite').setFrame(1);
            }
        }
    },

    onBtnShare: function (event) {
        let self = this;
        let platformApi = GlobalVar.getPlatformApi();
        if (platformApi){
            platformApi.showRewardedVideoAd(218, function () {
                GlobalVar.me().shareData.testPlayMemberID = self.memberID;
                self.close();
            }, null, true, true);
        } else if (GlobalVar.configGMSwitch()){
            GlobalVar.me().shareData.testPlayMemberID = self.memberID;
            self.close();
        }
    },

    onBtnClose: function(){
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

        BattleManager.getInstance().quitOutSide();
        BattleManager.getInstance().startOutside(this.nodePlane, this.memberID, true, null);
        // GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/battlemodel/prefab/Fighter/Fighter_' + this.memberID, function(){
        //     if (!self.planeEntity) {
        //         self.planeEntity = new PlaneEntity();
        //         self.planeEntity.newPart('Fighter/Fighter_' + self.memberID, Defines.ObjectType.OBJ_HERO, 'PlaneObject', 3, 0, 0);
        //         self.planeEntity.setPosition(0, 0);
        //         self.nodePlane.addChild(self.planeEntity);
        //         self.planeEntity.part.transform();
        //     }
        // });
    },

    setTestPlayMemberID: function (memberID) {
        this.memberID = memberID;
        GlobalVar.me().shareData.testPlayMemberID = 0;
    },

    setCallback: function (callback, closeCallback) {
        this._callback = callback || null;
        this.closeCallback = closeCallback || null;
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