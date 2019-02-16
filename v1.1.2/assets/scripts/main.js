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
        this.timeoutID = -1;

        // 判断操作系统
        GlobalVar.isAndroid = cc.sys.os == cc.sys.OS_ANDROID;
        GlobalVar.isIOS = cc.sys.os == cc.sys.OS_IOS;
        // 判断运行平台
        GlobalVar.isWanbaPlat = typeof urlParams == "undefined" ? false : true;
        GlobalVar.isWechatPlat = cc.sys.platform == cc.sys.WECHAT_GAME;
        GlobalVar.isQQPlayPlat = !!(window && window["wywGameId"] == "5469");
        // 我们的PC端测试用
        GlobalVar.isDebug = cc.sys.platform == cc.sys.DESKTOP_BROWSER;
        
        let self = this;

        if (GlobalVar.isWechatPlat) {
            WXDownloader.clearDownLoadList();
        }

        GlobalVar.resManager().clearCache();
        GlobalVar.sceneManager().reset();
        GlobalVar.sceneManager().setCurrentSceneType(SceneDefines.INIT_STATE);
        GlobalVar.windowManager().clearRecordView();
        GlobalVar.cleanAllMgr();

        if (!!require("storagedata").getClearCache()) {
            if (GlobalVar.isWechatPlat) {
                weChatAPI.loadingClearCache(function () {
                    cc.game.restart();
                });
            }
            this.clearCache = true;
        } else {
            if (GlobalVar.isWechatPlat) {
                weChatAPI.updateVersion();
            }

            this.loadingBar.node.runAction(cc.progressLoading(4, 0, 1, null, function (per) {
                self.loadingBar.node.getChildByName("spriteLight").x = self.loadingBar.barSprite.node.width * per;
            }));
            this.loadingBarFade.node.runAction(cc.progressLoading(4, 0, 0.8, null, function (per) {
                self.loadingBarFade.node.getChildByName("spriteLight").x = self.loadingBarFade.barSprite.node.width * per;
                self.loadingBar.node.parent.getChildByName("labelProgressPercent").getComponent(cc.Label).string = Math.floor((per * 100)) + "%";
            }));

            GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_NEED_CREATE_ROLE, this.createRoll, this);
            GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_LOGIN_DATA_NTF, this.getLoginData, this);
            GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_ENTER_GAME, this.replaceSceneToMain, this);
            GlobalVar.isFirstTimesLoading = true;
        }

        if (GlobalVar.isWanbaPlat){
            this.node.getChildByName("labelGMQQ").active = true;
        }
    },

    start() {
        //weChatAPI.setFramesPerSecond(60);
        let platformApi = GlobalVar.getPlatformApi();
        if (platformApi){
            platformApi.deviceKeepScreenOn();
        }
        if (GlobalVar.isWechatPlat) {
            weChatAPI.netWorkStatusChange(function () {
                if (GlobalVar.sceneManager().getCurrentSceneType() != SceneDefines.INIT_STATE) {
                    GlobalVar.networkManager().checkConnection();
                }
            });
        }

        //i18n.init('zh');
        let self = this;

        if (this.clearCache) {
            return;
        }

        GlobalVar.tblApi.init(function (complete) {
            let platformApi = GlobalVar.getPlatformApi();
            if (complete) {
                GlobalVar.resManager().setPreLoadHero();
                //拉取服务器列表
                if (GlobalVar.isWechatPlat) {
                    platformApi.getNetWorkStatus(function (type) {
                        if (type === 'none') {
                            platformApi.showToast("没有网络链接, 是否重试", true, true, "确认", "取消", function () {
                                cc.director.loadScene('InitScene');
                            }, function () {
                                cc.game.end();
                            })
                        } else {
                            self.login();
                        }
                    })
                } else if (GlobalVar.isWanbaPlat){
                    platformApi.getNetWorkStatus(function (type) {
                        if (type === '-1') {
                            platformApi.showToast("没有网络链接, 是否重试", true, true, "确认", "取消", function () {
                                cc.director.loadScene('InitScene');
                            }, function () {
                                cc.game.end();
                            })
                        } else {
                            self.login();
                        }
                    })
                } else {
                    GlobalVar.sceneManager().startUp();
                }
            } else {
                if (platformApi) {
                    platformApi.showToast("没有网络链接, 是否重试", true, true, "确认", "取消", function () {
                        //cc.game.restart();
                        cc.director.loadScene('InitScene');
                    }, function () {
                        cc.game.end();
                    })
                } else {
                    //cc.game.restart();
                    cc.director.loadScene('InitScene');
                }
            }
        });

        // GlobalVar.tblApi.init(function () {
        //     GlobalVar.sceneManager().startUp();
        // });
    },

    login: function () {
        let self = this;
        let platformApi = GlobalVar.getPlatformApi();
        if (platformApi) {
            self.timeoutID = setTimeout(function () {
                platformApi.showToast("网络链接超时, 是否重试", true, true, "确认", "取消", function () {
                    //cc.game.restart();
                    cc.director.loadScene('InitScene');
                }, function () {
                    //cc.game.end();
                })
            }, 20000);

            platformApi.login(function (userData) {
                clearTimeout(self.timeoutID);

                GlobalVar.me().loginData.setLoginReqDataAccount(userData.user_id);
                userData.ticket && GlobalVar.me().loginData.setLoginReqDataSdkTicket(userData.ticket);
                GlobalVar.me().loginData.setLoginReqDataAvatar(userData.avatar);
                GlobalVar.me().loginData.setLoginReqDataCityFlag(userData.cityFlag);

                platformApi.getShareConfig();

                if (GlobalVar.isWechatPlat) {
                    let launchInfo = wx.getLaunchOptionsSync();
                    if (launchInfo.query.materialID >= 0) {
                        platformApi.reportClickMaterial(launchInfo.query.materialID);
                    }
                    if (launchInfo.query['vpnaFlag'] == 1) {
                        GlobalVar.isFromOfficialAccount = true;
                    }
                }
                console.log("get data for login, userID:" + userData.user_id + " ticket:" + userData.ticket + " avatar:" + userData.avatar);

                self.timeoutID = setTimeout(function () {
                    platformApi.showToast("网络链接超时, 是否重试", true, true, "确认", "取消", function () {
                        //cc.game.restart();
                        cc.director.loadScene('InitScene');
                    }, function () {
                        //cc.game.end();
                    })
                }, 20000);
                platformApi.getMyServer(GlobalVar.tblApi.getData('TblVersion')[1].strVersion, GlobalVar.me().loginData.getLoginReqDataAccount(), function (data) {
                    clearTimeout(self.timeoutID);
                    let serverData = null;
                    if (data.ret == 0) {
                        serverData = data.my;
                    } else {
                        let platformApi = GlobalVar.getPlatformApi();
                        if (GlobalVar.isWechatPlat) {
                            platformApi.getNetWorkStatus(function (type) {
                                if (type === 'none') {
                                    if (!GlobalVar.netWaiting().reconnect) {
                                        platformApi.showToast("网络状态异常", true, false);
                                        //cc.game.restart();
                                        cc.director.loadScene('InitScene');
                                    }
                                } else {
                                    GlobalVar.sceneManager().startUp();
                                }
                            })
                        } else if (GlobalVar.isWanbaPlat) {
                            platformApi.getNetWorkStatus(function (type) {
                                if (type === '-1') {
                                    if (!GlobalVar.netWaiting().reconnect) {
                                        platformApi.showToast("网络状态异常", true, false);
                                        //cc.game.restart();
                                        cc.director.loadScene('InitScene');
                                    }
                                } else {
                                    GlobalVar.sceneManager().startUp();
                                }
                            })
                        } else {
                            GlobalVar.sceneManager().startUp();
                        }
                        return;
                    }

                    GlobalVar.me().loginData.setLoginReqDataServerID(serverData.server_id);
                    GlobalVar.me().loginData.setLoginReqDataServerName(serverData.name);
                    // console.log("连接的服务器地址为：", serverData.socket_domain, "  连接的端口为：", serverData.socket_port);
                    GlobalVar.networkManager().connectToServer(serverData.socket_domain, serverData.socket_port, function () {
                        if (GlobalVar.isWanbaPlat){
                            GlobalVar.handlerManager().loginHandler.sendLoginReqByWanba(
                                GlobalVar.me().loginData.getLoginReqDataServerID(),
                                GlobalVar.me().loginData.getLoginReqDataAvatar());
                        }else{
                            GlobalVar.handlerManager().loginHandler.sendLoginReq(
                                GlobalVar.me().loginData.getLoginReqDataAccount(),
                                GlobalVar.me().loginData.getLoginReqDataSdkTicket(),
                                GlobalVar.me().loginData.getLoginReqDataServerID(),
                                GlobalVar.me().loginData.getLoginReqDataAvatar());
                        }
                    });
                }, function (data) {
                    clearTimeout(self.timeoutID);
                    platformApi.showToast("服务器维护中, 是否重试", true, true, "确认", "取消", function () {
                        //cc.game.restart();
                        cc.director.loadScene('InitScene');
                    }, function () {
                        cc.game.end();
                    })
                });
            })
        }
    },

    update() {

    },

    createRoll: function () {
        let platformApi = GlobalVar.getPlatformApi();
        if (platformApi) {
            platformApi.createRoll(function (nickName, avatar) {
                // console.log("发送创建角色消息, nickName:" + nickName + "  avatar:" + avatar);
                platformApi.judgeInvite();
                GlobalVar.handlerManager().loginHandler.sendCreateRollReq(nickName || "", avatar || "");
                GlobalVar.me().loginData.setLoginReqDataAvatar(avatar);
            })
        }
    },

    getLoginData: function (event) {
        if (event.data.ErrCode !== 0) {
            var self = this;
            let platformApi = GlobalVar.getPlatformApi();
            if (GlobalVar.isWechatPlat) {
                platformApi.getNetWorkStatus(function (type) {
                    if (type === 'none') {
                        if (!GlobalVar.netWaiting().reconnect) {
                            platformApi.showToast("网络状态异常", true, false);
                            //cc.game.restart();
                            cc.director.loadScene('InitScene');
                        }
                    } else {
                        let errStr = GlobalVar.tblApi.getDataBySingleKey('TblErrString', event.data.ErrCode);
                        if (cc.isValid(errStr)) {
                            platformApi.showToast(errStr.strString, true, false);
                        } else {
                            platformApi.showToast('服务器连接异常', true, false);
                        }
                        GlobalVar.sceneManager().startUp();
                    }
                })
            }else if (GlobalVar.isWanbaPlat){
                platformApi.getNetWorkStatus(function (type) {
                    if (type === '-1') {
                        if (!GlobalVar.netWaiting().reconnect) {
                            platformApi.showToast("网络状态异常", true, false);
                            //cc.game.restart();
                            cc.director.loadScene('InitScene');
                        }
                    } else {
                        let errStr = GlobalVar.tblApi.getDataBySingleKey('TblErrString', event.data.ErrCode);
                        if (cc.isValid(errStr)) {
                            platformApi.showToast(errStr.strString, true, false);
                        } else {
                            platformApi.showToast('服务器连接异常', true, false);
                        }
                        GlobalVar.sceneManager().startUp();
                    }
                })
            }
            return;
        }

    },

    replaceSceneToMain: function (event) {
        GlobalVar.me().setServerTime(event.data.ServerTime);
        GlobalVar.me().updatePlayerDataByGMDT_PLAYER(event.data.Player);

        let platformApi = GlobalVar.getPlatformApi();
        if (platformApi) {
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
                        break;
                    case 6:
                        GlobalVar.shareOpen = true;
                        GlobalVar.videoAdOpen = true;
                        break;
                    default:
                        break;
                }
                console.log("get shareSwitchSetting:", state);
            })
        }

        GlobalVar.handlerManager().noticeHandler.sendGetNoticeReq();
        GlobalVar.handlerManager().drawHandler.sendTreasureData();
        // GlobalVar.handlerManager().activeHandler.sendActiveTypeActIdReq();

        if (GlobalVar.me().loginData.getLoginReqDataServerID()) {
            let platformApi = GlobalVar.getPlatformApi();
            if (platformApi) {
                platformApi.reportServerLogin(GlobalVar.me().loginData.getLoginReqDataAccount(), GlobalVar.me().loginData.getLoginReqDataServerID(), GlobalVar.me().serverTime * 100);
            }
        }

        if (GlobalVar.isWechatPlat || GlobalVar.isQQPlayPlat || GlobalVar.isWanbaPlat) {
            GlobalVar.sceneManager().gotoScene(SceneDefines.MAIN_STATE);
        } else {
            GlobalVar.sceneManager().startUp();
        }
    },

    startUp: function () {
        GlobalVar.sceneManager().startUp();
    },

    onDestroy: function () {
        if (this.timeoutID != -1) {
            clearTimeout(this.timeoutID);
        }
        GlobalVar.eventManager().removeListenerWithTarget(this);
    },
});