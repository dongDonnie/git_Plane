const SceneDefines = require("scenedefines");
const SceneBase = require("scenebase");
const GlobalVar = require("globalvar")
const EventMsgID = require("eventmsgid")
const weChatAPI = require("weChatAPI");
const GameServerProto = require("GameServerProto");

var LoginScene = cc.Class({
    extends: SceneBase,

    ctor: function() {
        this.uiNode = null;
    },

    properties: {
        login:{
            default:null,
            type:cc.Node
        },
        server:{
            default:null,
            type:cc.Node
        }
    },

    onLoad: function () {
        GlobalVar.netWaiting().init();

        this.sceneName="LoginScene";
        this.uiNode = cc.find("Canvas/UINode");
        this.registerEvent();
        this.openScene();
        
        GlobalVar.soundManager().playBGM("cdnRes/audio/main/music/logon");

        if (cc.sys.platform === cc.sys.WECHAT_GAME){
            //this.loadPrefab("UIServerSel");
        }else{
            //this.loadPrefab("UILogin");
            this.login.active=true;
            this.server.active=false;
        }
    },

    registerEvent() {
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_ENTER_GAME, this.replaceSceneToMain, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_LOGIN_DATA_NTF, this.onLoginDataEvent, this);
    },

    onDestroy() {
        this.releaseScene();
        GlobalVar.eventManager().removeListenerWithTarget(this);
    },

    onLoginDataEvent: function (event) {
        if (event.data.ErrCode !== GameServerProto.PTERR_SUCCESS){
            GlobalVar.comMsg.errorWarning(event.data.ErrCode);
        }
    },

    replaceSceneToMain(evt) {
        // console.log("登陆消息：", evt);
        GlobalVar.me().setServerTime(evt.data.ServerTime);
        GlobalVar.me().updatePlayerDataByGMDT_PLAYER(evt.data.Player);
        
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            weChatAPI.requestIosRechageLockState(GlobalVar.me().level, GlobalVar.me().combatPoint, GlobalVar.me().creatTime, function (state) {
                GlobalVar.IosRechargeLock = !!state;
            });
            weChatAPI.requestShareOpenState(GlobalVar.tblApi.getData('TblVersion')[1].strVersion, function (state) {
                GlobalVar.shareOpen = !!parseInt(state);
                console.log("get shareOpen:", state, GlobalVar.shareOpen);
            })
        }
        GlobalVar.handlerManager().noticeHandler.sendGetNoticeReq();
        GlobalVar.handlerManager().drawHandler.sendTreasureData();
        GlobalVar.sceneManager().gotoScene(SceneDefines.MAIN_STATE);
    },

});

