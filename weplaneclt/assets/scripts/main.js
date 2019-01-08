const GlobalVar = require("globalvar");
const weChatAPI = require("weChatAPI");
const i18n = require('LanguageData');
const EventMsgID = require("eventmsgid");
const SceneDefines = require("scenedefines");
const StoreageData = require("storagedata");
cc.Class({
    extends: cc.Component,

    properties: {
        nodeLogo: {
            default: null,
            type: cc.Node,
        },
        isJsonLoaded: {
            default: false,
            visible: false,
        },
        loadingBar: {
            default: null,
            type: cc.ProgressBar
        },
        loadingBarFade: {
            default: null,
            type: cc.ProgressBar,
        },
    },

    onLoad() {
        cc.game.setFrameRate(60);

        this.isGetServerListEnd = false;
        this.clearCache = false;
        if (cc.sys.platform == cc.sys.WECHAT_GAME){
            this.timeoutID = setTimeout(function () {
                weChatAPI.showToast("网络链接超时, 是否重试", true, true, "确认", "取消", function () {
                    cc.game.restart();
                }, function () {
                    //cc.game.end();
                })
            }, 20000);
        }


        GlobalVar.isAndroid = cc.sys.os == cc.sys.OS_ANDROID;
        GlobalVar.isIOS = cc.sys.os == cc.sys.OS_IOS;
        // GlobalVar.isIOS = true;
        let self = this;

        if (!!require("storagedata").getClearCache()) {
            if (cc.sys.platform == cc.sys.WECHAT_GAME){
                weChatAPI.loadingClearCache(function () {
                    cc.game.restart();
                });
            }
            this.clearCache = true;
        } else {
            if (cc.sys.platform == cc.sys.WECHAT_GAME){
                weChatAPI.updateVersion();
            }

            this.loadingBar.node.runAction(cc.progressLoading(1, 0, 1, null, function (per) {
                self.loadingBar.node.getChildByName("spriteLight").x = self.loadingBar.barSprite.node.width * per;
            }));
            this.loadingBarFade.node.runAction(cc.progressLoading(1, 0, 0.2, null, function (per) {
                self.loadingBarFade.node.getChildByName("spriteLight").x = self.loadingBarFade.barSprite.node.width * per;
                self.loadingBar.node.parent.getChildByName("labelProgressPercent").getComponent(cc.Label).string = Math.floor((per *100)) + "%";
            }));

            GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_NEED_CREATE_ROLE, this.createRoll, this);
            GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_LOGIN_DATA_NTF, this.getLoginData, this);
            GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_ENTER_GAME, this.replaceSceneToMain, this);
            GlobalVar.isFirstTimesLoading = true;
        }
    },

    start() {
        //weChatAPI.setFramesPerSecond(60);
        if (cc.sys.platform == cc.sys.WECHAT_GAME){
            weChatAPI.deviceKeepScreenOn();
            weChatAPI.netWorkStatusChange(function(){
                if(GlobalVar.sceneManager().getCurrentSceneType() == SceneDefines.INIT_STATE ||
                GlobalVar.sceneManager().getCurrentSceneType() == SceneDefines.LOGIN_STATE){
                    cc.game.restart();
                }else{
                    GlobalVar.networkManager().checkConnection();
                }
            });
        }

        i18n.init('zh');
        let self = this;

        //GlobalVar.netWaiting().init();
        if (this.clearCache) {
            return;
        }

        GlobalVar.tblApi.init(function () {
            GlobalVar.resManager().setPreLoadHero();
            //拉取服务器列表
            let platformApi = GlobalVar.getPlatformApi();
            if (platformApi){
                platformApi.login(function (user_id, ticket, avatar) {
                    GlobalVar.me().loginData.setLoginReqDataAccount(user_id);
                    GlobalVar.me().loginData.setLoginReqDataSdkTicket(ticket);
                    GlobalVar.me().loginData.setLoginReqDataAvatar(avatar);

                    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
                        let launchInfo = wx.getLaunchOptionsSync();
                        if (launchInfo.query.materialID >= 0) {
                            platformApi.reportClickMaterial(launchInfo.query.materialID);
                        }
                        if (launchInfo.scene == 1104){
                            StoreageData.setShareTimesWithKey("superReward", 0);
                        }
                    }
                    console.log("get data for login, userID:" + user_id + " ticket:" + ticket + " avatar:" + avatar);
                    platformApi.getMyServer(GlobalVar.tblApi.getData('TblVersion')[1].strVersion, GlobalVar.me().loginData.getLoginReqDataAccount(), function (data) {
                        // self.serverList = data.serverList;
                        // self.userData = data.userData;
                        let serverData = null;
                        if (data.ret == 0) {
                            serverData = data.my;
                        } else {
                            //GlobalVar.sceneManager().startUp();
                            self.startUp();
                            return;
                        }

                        GlobalVar.me().loginData.setLoginReqDataServerID(serverData.server_id);
                        GlobalVar.me().loginData.setLoginReqDataServerName(serverData.name);
                        // console.log("连接的服务器地址为：", serverData.socket_domain, "  连接的端口为：", serverData.socket_port);
                        GlobalVar.networkManager().connectToServer(serverData.socket_domain, serverData.socket_port, function () {
                            GlobalVar.handlerManager().loginHandler.sendLoginReq(
                                GlobalVar.me().loginData.getLoginReqDataAccount(),
                                GlobalVar.me().loginData.getLoginReqDataSdkTicket(),
                                GlobalVar.me().loginData.getLoginReqDataServerID(),
                                GlobalVar.me().loginData.getLoginReqDataAvatar());
                        });
                    }, function (data) {
                        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
                            platformApi.showToast("网络链接异常, 是否重试", true, true, "确认", "取消", function () {
                                cc.game.restart();
                            }, function () {
                                cc.game.end();
                            })
                        }else{
                            cc.game.restart();
                        }
                    });
                })
            } else {
                //GlobalVar.sceneManager().startUp();
                self.startUp();
            }

        });

        // GlobalVar.tblApi.init(function () {
        //     GlobalVar.sceneManager().startUp();
        // });
    },

    update() {

    },

    createRoll: function () {
        let platformApi = GlobalVar.getPlatformApi();
        if (platformApi){
            platformApi.createRoll(function (nickName, avatar) {
                // console.log("发送创建角色消息, nickName:" + nickName + "  avatar:" + avatar);
                GlobalVar.handlerManager().loginHandler.sendCreateRollReq(nickName || "", avatar || "");
                GlobalVar.me().loginData.setLoginReqDataAvatar(avatar);
            })
        }
    },

    getLoginData: function (event) {
        if (event.data.ErrCode !== 0) {
            // GlobalVar.networkManager().needReConnected = false;
            //GlobalVar.sceneManager().startUp();
            this.startUp();
            return;
        }

    },

    replaceSceneToMain: function (event) {
        GlobalVar.me().setServerTime(event.data.ServerTime);
        GlobalVar.me().updatePlayerDataByGMDT_PLAYER(event.data.Player);

        let platformApi = GlobalVar.getPlatformApi();
        if (platformApi){
            platformApi.requestIosRechageLockState(GlobalVar.me().level, GlobalVar.me().combatPoint, GlobalVar.me().creatTime, function (state) {
                GlobalVar.IosRechargeLock = !!state;
            });
            platformApi.requestShareOpenState(GlobalVar.tblApi.getData('TblVersion')[1].strVersion, function (state) {
                GlobalVar.shareOpen = !!parseInt(state);
                GlobalVar.shareControl = parseInt(state);
                switch (parseInt(state)) {
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
                console.log("get shareOpen:", state, GlobalVar.shareOpen);
            })
        }
        
        GlobalVar.handlerManager().noticeHandler.sendGetNoticeReq();
        GlobalVar.handlerManager().drawHandler.sendTreasureData();

        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            clearTimeout(this.timeoutID);
            GlobalVar.sceneManager().gotoScene(SceneDefines.MAIN_STATE);
        } else {
            //GlobalVar.sceneManager().startUp();
            this.startUp();
        }
    },

    startUp: function () {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            clearTimeout(this.timeoutID);
        }
        GlobalVar.sceneManager().startUp();
    },

    onDestroy: function () {
        GlobalVar.eventManager().removeListenerWithTarget(this);
    },
});