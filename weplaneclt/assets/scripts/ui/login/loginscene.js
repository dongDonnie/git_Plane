const SceneDefines = require("scenedefines");
const SceneBase = require("scenebase");
const GlobalVar = require("globalvar")
const EventMsgID = require("eventmsgid")
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
        GlobalVar.windowManager().clearRecordView();

        this.sceneName="LoginScene";
        this.uiNode = cc.find("Canvas/UINode");
        this.registerEvent();
        this.openScene();
        
        GlobalVar.soundManager().playBGM("cdnRes/audio/main/music/logon");

        if (cc.sys.platform === cc.sys.WECHAT_GAME || (window && window["wywGameId"]=="5469")){
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
        
        let platformApi = GlobalVar.getPlatformApi();
        if (platformApi){
            platformApi.requestIosRechageLockState(GlobalVar.me().level, GlobalVar.me().combatPoint, GlobalVar.me().createTime, function (state) {
                GlobalVar.IosRechargeLock = !!state;
            });
            platformApi.requestShareOpenState(GlobalVar.tblApi.getData('TblVersion')[1].strVersion, function (state) {
                GlobalVar.shareOpen = !!parseInt(state.showyd);
                GlobalVar.shareControl = parseInt(state.showyd);
                GlobalVar.cityFlagSwitch = !!parseInt(state.cityFlag);
                switch (parseInt(state.showyd)) {
                    case 0:
                        GlobalVar.shareOpen = false;
                        GlobalVar.videoAdOpen = false;
                        break;
                    case 1:
                        GlobalVar.shareOpen = true;
                        GlobalVar.videoAdOpen = true;
                    case 6:
                        GlobalVar.shareOpen = true;
                        GlobalVar.videoAdOpen = true;
                    default:
                        break;
                }
                console.log("get shareSwitchSetting:", state);
            });
        }
        GlobalVar.handlerManager().noticeHandler.sendGetNoticeReq();
        GlobalVar.handlerManager().drawHandler.sendTreasureData();
        GlobalVar.handlerManager().activeHandler.sendActiveTypeActIdReq();
        if (GlobalVar.me().loginData.getLoginReqDataServerID()) {
            let platformApi = GlobalVar.getPlatformApi();
            if (platformApi){
                platformApi.reportServerLogin(GlobalVar.me().loginData.getLoginReqDataAccount(), GlobalVar.me().loginData.getLoginReqDataServerID(), GlobalVar.me().serverTime * 100);
            }
        }
        
        GlobalVar.sceneManager().gotoScene(SceneDefines.MAIN_STATE);
    },

});

