const SceneBase = require("scenebase");
const GlobalVar = require("globalvar");
const RemoteSprite = require("RemoteSprite");
const SceneDefines = require('scenedefines');
const ResMapping = require("resmapping");
const weChatAPI = require("weChatAPI");
const i18n = require('LanguageData');

var LoadingState = {
    E_PREPARE: 0,
    E_PROGRESS: 1,
    E_SCENE: 2,
    E_START_LOADING_THREAD: 3,
    E_LOADING: 4,
    E_WAITING: 5,
    E_FINISH: 6,
};

var LoadingScene = cc.Class({
    extends: SceneBase,

    properties: {
        loadingBar: {
            default: null,
            type: cc.ProgressBar
        },
        labelTip: {
            default: null,
            type: cc.Label,
        },
        spriteChara: {
            default: null,
            type: RemoteSprite,
        },
        labelProgressPercent: {
            default: null,
            type: cc.Label
        },
        spriteBg: {
            default: null,
            type: cc.Sprite,
        },
        loadingBarFade: {
            default: null,
            type: cc.ProgressBar,
        },
    },

    statics: {

    },

    ctor: function () {
        this.loadingState = LoadingState.E_WAITING;
        this.totalCount = 0;
        this.curCount = 0;
        this.bgmComplete = 0;
        this.sceneComplete = 0;
        this.loadComplete = 0;
        this.timeoutID = -1;
    },

    onLoad: function () {
        this.openScene();
        GlobalVar.windowManager().releaseView();
        GlobalVar.resManager().clearCache();
        GlobalVar.netWaiting().release();

        var self = this;
        GlobalVar.resManager().loadRes(ResMapping.ResType.AudioClip, "cdnRes/audio/main/effect/loading", function (clip) {
            //if(clip==null){
            self.bgmComplete = -1;
            //}
            self.loadingState = LoadingState.E_PREPARE;
        }, function () {
            self.loadingState = LoadingState.E_PREPARE;
            self.bgmComplete = -1;
        });

        this.loadingState === LoadingState.E_WAITING

        this.firstLoading = GlobalVar.isFirstTimesLoading;
        GlobalVar.isFirstTimesLoading = false;

        if (this.firstLoading) {
            // this.loadingBar.progress = 0.2;
            this.loadingBar.node.y = -360;
            this.loadingBarFade.node.y = -325;
            this.spriteBg.node.getComponent("RemoteSprite").setFrame(0);
            // this.spriteBg.node.anchorY = 0.5;
            // this.spriteBg.node.Y = 0;
            // this.spriteBg.node.getComponent(cc.Widget).bottom = -132;
            this.loadingBar.node.parent.getChildByName("spriteTipBg").active = false;
            this.loadingBar.node.parent.getChildByName("spriteTipText").active = false;
            this.loadingBar.node.parent.getChildByName("labelTip").active = false;
            this.loadingBar.node.parent.getChildByName("spriteChara").active = false;
            this.loadingBar.node.parent.getChildByName("labelLoadingTips").y = -290;
            this.loadingBar.node.parent.getChildByName("labelProgressPercent").y = -290;
            this.loadingBar.node.parent.getChildByName("spriteFang").active = true;
            this.loadingBarFade.node.active = true;
            this.loadingBarFade.progress = 0.8;
        }
    },

    start: function () {
        let tipsCount = GlobalVar.tblApi.getLength('TblTips');
        let randomTipsIndex = Math.floor(Math.random() * tipsCount) + 1;
        let spriteCount = this.spriteChara.frameList.length;
        let randomCharaIndex = Math.floor(Math.random() * spriteCount);
        this.labelTip.string = GlobalVar.tblApi.getDataBySingleKey('TblTips', randomTipsIndex).strString;
        this.spriteChara.setFrame(randomCharaIndex);
    },

    onDestroy() {
        if (this.timeoutID != -1) {
            clearTimeout(this.timeoutID);
        }
        this.releaseScene();
    },

    update: function (dt) {
        if (this.loadingState === LoadingState.E_WAITING) {

        } else if (this.loadingState === LoadingState.E_SCENE) {

            if (this.sceneComplete == 0) {
                this.loadingState = LoadingState.E_FINISH;
            }

        } else if (this.loadingState === LoadingState.E_PREPARE) {

            this.loadingState = LoadingState.E_LOADING;

        } else if (this.loadingState === LoadingState.E_PROGRESS) {

            if (!!this.loadComplete) {
                if (GlobalVar.resManager().checkPreLoadComplete()) {
                    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
                        var self = this;
                        this.timeoutID = setTimeout(function () {
                            weChatAPI.showToast("网络链接超时, 是否重试", true, true, "确认", "取消", function () {
                                cc.director.loadScene('LoadingScene');
                            }, function () {
                                //cc.game.end();
                            })
                        }, 10000);
                    }
                    this.loadingState = LoadingState.E_SCENE;
                } else {
                    this.loadingState = LoadingState.E_WAITING;
                    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
                        if (!GlobalVar.networkManager().connected) {
                            weChatAPI.showToast("亲爱的指挥官，超新星爆发导致通讯中断，是否尝试重连本部？", true, false, "确认", "取消", function () {
                                GlobalVar.sceneManager().reStart();
                            });
                        } else {
                            weChatAPI.getNetWorkStatus(function (type) {
                                if (type === 'none') {
                                    weChatAPI.showToast("无网络链接", true, false, "确认", "取消", function () {
                                        GlobalVar.sceneManager().reStart();
                                    });
                                } else {
                                    weChatAPI.showToast("读取资源失败, 点击确认重试", true, false, "确认", "取消", function () {
                                        cc.director.loadScene('LoadingScene');
                                    });
                                }
                            })
                        }
                    } else {
                        cc.director.loadScene('LoadingScene');
                    }
                }
            }

        } else if (this.loadingState === LoadingState.E_LOADING) {

            this.loadingState = LoadingState.E_PROGRESS;

            if (this.bgmComplete > 0) {
                return;
            }

            if (this.bgmComplete != -1) {
                this.bgmComplete = 1;
            }

            GlobalVar.netWaiting().init();

            let next = GlobalVar.sceneManager().nextScene;

            this.curCount = 0;
            this.totalCount = GlobalVar.resManager().setPreLoad(next);
            GlobalVar.resManager().totalPreLoad(this.finishCallback.bind(this));

            var self = this;
            // if (next == SceneDefines.MAIN_STATE) {
            //     this.sceneComplete = 1;
            //     cc.director.preloadScene("MainScene", function () {
            //         self.sceneComplete = 0;
            //     });
            // } else if (next == SceneDefines.BATTLE_STATE) {
            //     this.sceneComplete = 1;
            //     cc.director.preloadScene("BattleScene", function () {
            //         self.sceneComplete = 0;
            //     });
            // }

            if (this.totalCount == 0) {
                this.loadingBar.progress = 1;
                this.loadingState = LoadingState.E_FINISH;
            } else {
                let action = cc.progressLoading(3, /*0*/ this.loadingBar.progress, 1, null, function (per) {
                    self.loadingBar.node.getChildByName("spriteLight").x = self.loadingBar.barSprite.node.width * per;
                    if (self.firstLoading) {
                        self.labelProgressPercent.string = Math.floor(per * 20 + 80) + "%";
                    } else {
                        self.labelProgressPercent.string = Math.floor(per * 100) + "%";
                    }
                });
                this.loadingBar.node.runAction(action);
                if (this.firstLoading) {
                    let actionFade = cc.progressLoading(3, this.loadingBarFade.progress, 1, null, function (per) {
                        self.loadingBarFade.node.getChildByName("spriteLight").x = self.loadingBarFade.barSprite.node.width * per;
                    })
                    this.loadingBarFade.node.runAction(actionFade);
                }
            }

            var self = this;
            GlobalVar.soundManager().playEffect("cdnRes/audio/main/effect/loading", function () {
                if (self.bgmComplete != -1) {
                    self.bgmComplete = 2;
                }
            });

        } else if (this.loadingState === LoadingState.E_FINISH) {
            cc.log("loading finish");
            if (this.bgmComplete == 2 || this.bgmComplete == -1) {
                this.loadingState = LoadingState.E_WAITING;
                this.releaseScene();
                let nextSceneState = GlobalVar.sceneManager().nextScene;
                GlobalVar.sceneManager().directGotoScene(nextSceneState);
            }

        } else {

            this.loadingState = LoadingState.E_WAITING;

        }
    },

    finishCallback: function (obj, type, path) {
        this.curCount++;
        if (this.loadingState === LoadingState.E_FINISH || !cc.isValid(this.loadingBar) || !!this.loadComplete) {
            return;
        }
        var self = this;
        if (!cc.isValid(obj)) {
            GlobalVar.comMsg.showMsg(i18n.t('label.4000000'));
        }

        let percent = 0;
        if (this.totalCount == 0) {
            percent = 1;
        } else {
            percent = this.curCount / this.totalCount;
            if (percent * 100 % 10 >= 5) {
                percent = Math.ceil(percent * 10) / 10;
            }
            if (this.loadingBar.progress > percent) {
                percent = Math.ceil(this.loadingBar.progress * 10) / 10;
            }
            if (GlobalVar.sceneManager().nextScene == SceneDefines.MAIN_STATE) {
                if (obj != null && type == ResMapping.ResType.Prefab && path.indexOf('cdnRes/prefab/Windows/') != -1) {
                    GlobalVar.windowManager().preLoadView(obj, path);
                }
            }
        }

        if (this.loadingBar.progress >= 1) {
            if (self.curCount >= self.totalCount && self.loadingState === LoadingState.E_PROGRESS) {
                self.loadComplete = 1;
            }
        } else {
            let action = cc.progressLoading(3, this.loadingBar.progress, percent <= 1 ? percent : 1, function () {
                if (self.curCount >= self.totalCount && self.loadingState === LoadingState.E_PROGRESS) {
                    self.loadComplete = 1;
                }
            }, function (per) {
                self.loadingBar.node.getChildByName("spriteLight").x = self.loadingBar.barSprite.node.width * per;
                if (self.firstLoading) {
                    self.labelProgressPercent.string = Math.floor(per * 20 + 80) + "%";
                } else {
                    self.labelProgressPercent.string = Math.floor(per * 100) + "%";
                }
            });
            this.loadingBar.node.runAction(action);
        }

        let percentFade = percent * 0.2 + 0.8;
        if (this.firstLoading) {
            let actionFade = cc.progressLoading(3, this.loadingBarFade.progress, percentFade <= 1 ? percentFade : 1, null, function (per) {
                self.loadingBarFade.node.getChildByName("spriteLight").x = self.loadingBar.barSprite.node.width * per;
            });
            this.loadingBarFade.node.runAction(actionFade);
        }
    },

});