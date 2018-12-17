const GlobalVar = require("globalvar");
const weChatAPI = require("weChatAPI");
const i18n = require('LanguageData');
const EventMsgID = require("eventmsgid");
const SceneDefines = require("scenedefines");
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

        this.isJsonLoaded = false;
        this.isLoadingEnd = false;
        this.isGetServerListEnd = false;
        this.isLoginEnd = false;
        this.clearCache = false;

        GlobalVar.isAndroid = cc.sys.os == cc.sys.OS_ANDROID;
        GlobalVar.isIOS = cc.sys.os == cc.sys.OS_IOS;
        // GlobalVar.isIOS = true;
        let self = this;

        // let action = cc.sequence(cc.progressLoading(3, 0, 1, null, function (per) {
        //     self.loadingBar.node.getChildByName("spriteLight").x = self.loadingBar.barSprite.node.width * per;
        // }), cc.callFunc(()=>{
        //     self.isLoadingEnd = true;
        // }));
        if (!!require("storagedata").getClearCache()) {
            weChatAPI.loadingClearCache(function(){
                cc.game.restart();
            });
            this.clearCache = true;
        } else {
            weChatAPI.updateVersion();

            let action = cc.sequence(cc.progressLoading(3, 0, 1, null, function (per) {
                self.loadingBar.node.getChildByName("spriteLight").x = self.loadingBar.barSprite.node.width * per;
            }), cc.callFunc(() => {
                self.isLoadingEnd = true;
            }));
            this.loadingBar.node.runAction(action);

            let actionFade = cc.progressLoading(3, 0, 0.2, null, function (per) {
                self.loadingBarFade.node.getChildByName("spriteLight").x = self.loadingBarFade.barSprite.node.width * per;
            });
            this.loadingBarFade.node.runAction(actionFade);

            GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_NEED_CREATE_ROLE, this.createRoll, this);
            GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_LOGIN_DATA_NTF, this.getLoginData, this);
            GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_ENTER_GAME, this.replaceSceneToMain, this);
            GlobalVar.isFirstTimesLoading = true;
        }
    },

    start() {
        //weChatAPI.setFramesPerSecond(60);
        weChatAPI.deviceKeepScreenOn();

        i18n.init('zh');
        let self = this;

        //GlobalVar.netWaiting().init();
        if (this.clearCache) {
            return;
        }

        GlobalVar.tblApi.init(function () {
            self.isJsonLoaded = true;

            if (!self.isLoadingEnd) {
                self.loadingBar.node.stopAllActions();
                self.loadingBarFade.node.stopAllActions();

                let action = cc.sequence(cc.progressLoading(0.2, self.loadingBar.progress, 1, null, function (per) {
                    self.loadingBar.node.getChildByName("spriteLight").x = self.loadingBar.barSprite.node.width * per;
                }), cc.callFunc(() => {
                    self.isLoadingEnd = true;
                }));
                let actionFade = cc.progressLoading(0.2, self.loadingBarFade.progress, 0.2, null, function (per) {
                    self.loadingBarFade.node.getChildByName("spriteLight").x = self.loadingBarFade.barSprite.node.width * per;
                });


                self.loadingBar.node.runAction(action)
                self.loadingBarFade.node.runAction(actionFade);
            }

            GlobalVar.resManager().setPreLoadHero();

            //拉取服务器列表
            if (cc.sys.platform === cc.sys.WECHAT_GAME) {
                weChatAPI.login(function (user_id, ticket, avatar) {
                    GlobalVar.me().loginData.setLoginReqDataAccount(user_id);
                    GlobalVar.me().loginData.setLoginReqDataSdkTicket(ticket);
                    GlobalVar.me().loginData.setLoginReqDataAvatar(avatar);

                    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
                        let launchInfo = wx.getLaunchOptionsSync();
                        if (launchInfo.query.materialID >= 0) {
                            weChatAPI.reportClickMaterial(launchInfo.query.materialID);
                        }
                    }
                    // console.log("get data for login, userID:" + user_id + " ticket:" + ticket + " avatar:" + avatar);
                    weChatAPI.getMyServer(GlobalVar.tblApi.getData('TblVersion')[1].strVersion, GlobalVar.me().loginData.getLoginReqDataAccount(), function (data) {
                        // self.serverList = data.serverList;
                        // self.userData = data.userData;
                        let serverData = null;
                        if (data.ret == 0) {
                            serverData = data.my;
                        } else {
                            GlobalVar.sceneManager().startUp();
                        }

                        // let defaultServerID = null;
                        // let defaultServerIndex = -1;
                        // if (data.userData && data.userData.server) {
                        //     if (data.userData.server.length != 0) {
                        //         defaultServerID = data.userData.server[0];
                        //     }
                        // }

                        // for (let i = 0; i < data.serverList.length; i++) {
                        //     if (data.serverList[i].server_id == defaultServerID) {
                        //         defaultServerIndex = i;
                        //     }
                        // }

                        // if (!defaultServerID || defaultServerIndex == -1) {
                        //     defaultServerID = data.serverList[0].server_id;
                        //     defaultServerIndex = 0;
                        // }
                        // let serverData = data.serverList[defaultServerIndex];

                        GlobalVar.me().loginData.setLoginReqDataServerID(serverData.server_id);
                        // console.log("连接的服务器地址为：", serverData.socket_domain, "  连接的端口为：", serverData.socket_port);
                        GlobalVar.networkManager().connectToServer(serverData.socket_domain, serverData.socket_port, function () {
                            GlobalVar.handlerManager().loginHandler.sendLoginReq(
                                GlobalVar.me().loginData.getLoginReqDataAccount(),
                                GlobalVar.me().loginData.getLoginReqDataSdkTicket(),
                                GlobalVar.me().loginData.getLoginReqDataServerID(),
                                GlobalVar.me().loginData.getLoginReqDataAvatar());
                        });
                    });
                })
            } else {
                self.isLoginEnd = true;
            }

        });

        // GlobalVar.tblApi.init(function () {
        //     GlobalVar.sceneManager().startUp();
        // });
    },

    update() {
        let self = this;
        if (this.isJsonLoaded && this.isLoadingEnd && this.isLoginEnd) {
            this.isJsonLoaded = false;
            this.isLoadingEnd = false;
            this.isLoginEnd = false;
            if (cc.sys.platform == cc.sys.WECHAT_GAME) {
                GlobalVar.sceneManager().gotoScene(SceneDefines.MAIN_STATE);
            } else {
                GlobalVar.sceneManager().startUp();
            }
        }
    },

    createRoll: function () {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            weChatAPI.createRoll(function (nickName, avatar) {
                // console.log("发送创建角色消息, nickName:" + nickName + "  avatar:" + avatar);
                GlobalVar.handlerManager().loginHandler.sendCreateRollReq(nickName || "", avatar || "");
                GlobalVar.me().loginData.setLoginReqDataAvatar(avatar);
            })
        }
    },

    getLoginData: function (event) {
        if (event.data.ErrCode !== 0) {
            // GlobalVar.networkManager().needReConnected = false;
            GlobalVar.sceneManager().startUp();
            return;
        }

    },

    replaceSceneToMain: function (event) {
        GlobalVar.me().setServerTime(event.data.ServerTime);
        GlobalVar.me().updatePlayerDataByGMDT_PLAYER(event.data.Player);

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


        this.isLoginEnd = true;
    },


    onDestroy: function () {
        GlobalVar.eventManager().removeListenerWithTarget(this);
    },
});
