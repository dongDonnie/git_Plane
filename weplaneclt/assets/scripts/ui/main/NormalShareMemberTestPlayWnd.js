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
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_SHARETESTPLAY_WND;
        this.animeStartParam(0, 0);

        this._callback = null;
        this.memberID = 0;
    },

    animeStartParam(paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            GlobalVar.eventManager().removeListenerWithTarget(this);
            let self = this;
            WindowManager.getInstance().popView(false, function () {
                self._callback && self._callback();
                self._callback = null;
            }, false);
        } else if (name == "Enter") {
            this._super("Enter");
            this.randomPlane();
            
        }
    },

    onBtnShare: function (event) {
        let self = this;
        if (cc.sys.platform == cc.sys.WECHAT_GAME){
            weChatAPI.shareNormal(118, function () {
                GlobalVar.me().shareData.testPlayMemberID = self.memberID;
                self.close();
            })
        }else{
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

    randomPlane: function () {
        let totalMemberData = GlobalVar.tblApi.getData('TblMember');
        let ids = [];
        for (let i in totalMemberData){
            if (totalMemberData[i].byGetType == 1){
                ids.push(parseInt(i));
            }
        }

        for (let i = 0; i<ids.length;i++){
            let memberData = GlobalVar.me().memberData.getMemberByID(ids[i]);
            if (memberData){
                ids.splice(i, 1);
                i -= 1;
            }
        }

        let randomID = ids[parseInt(Math.random() * ids.length)];
        this.memberID = randomID;

        let self = this;
        GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/battlemodel/prefab/Fighter/Fighter_' + randomID, function(){
            if (!self.planeEntity) {
                self.planeEntity = new PlaneEntity();
                self.planeEntity.newPart('Fighter/Fighter_' + self.memberID, Defines.ObjectType.OBJ_HERO, 'PlaneObject', 3, 0, 0);
                self.planeEntity.setPosition(0, 0);
                self.nodePlane.addChild(self.planeEntity);
                self.planeEntity.part.transform();
            }
        });
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