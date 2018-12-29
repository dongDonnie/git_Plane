const SceneBase = require("scenebase");
const GlobalVar = require("globalvar");
const RemoteSprite = require("RemoteSprite");
const SceneDefines = require('scenedefines');
const ResMapping = require("resmapping");
const weChatAPI = require("weChatAPI");

var LoadingState = {
    E_PREPARE: 0,
    E_RELEASE_MAIN_CACHE: 1,
    E_RELEASE_OTHER_CACHE: 2,
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
        this.bgmComplete = 0;
        this.sceneComplete = 0;
    },

    onLoad: function () {
        this.openScene();
        GlobalVar.windowManager().releaseView();
        GlobalVar.resManager().clearCache();
        GlobalVar.netWaiting().release();
        if (GlobalVar.getBannerSwitch()) {
            weChatAPI.cleanBannerCount();
            weChatAPI.hideBannerAd();
        }

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
            this.loadingBarFade.progress = 0.2;
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
        this.releaseScene();
    },

    update: function (dt) {
        if (this.loadingState === LoadingState.E_WAITING) {

        } else if (this.loadingState === LoadingState.E_PREPARE) {
            //let nextSceneState = GlobalVar.sceneManager().nextScene;
            this.loadingState = LoadingState.E_LOADING;

        } else if (this.loadingState === LoadingState.E_RELEASE_MAIN_CACHE) {

            this.loadingState = LoadingState.E_RELEASE_OTHER_CACHE;

        } else if (this.loadingState === LoadingState.E_RELEASE_OTHER_CACHE) {

            this.loadingState = LoadingState.E_START_LOADING_THREAD;

        } else if (this.loadingState === LoadingState.E_START_LOADING_THREAD) {

            this.loadingState = LoadingState.E_LOADING;

        } else if (this.loadingState === LoadingState.E_LOADING) {

            this.loadingState = LoadingState.E_WAITING;

            if (this.bgmComplete > 0) {
                return;
            }

            if (this.bgmComplete != -1) {
                this.bgmComplete = 1;
            }

            GlobalVar.netWaiting().init();

            let next = GlobalVar.sceneManager().nextScene;

            this.totalCount = GlobalVar.resManager().setPreLoad(next, this.finishCallback.bind(this));
            GlobalVar.resManager().totalPreLoad(next);

            if (next == SceneDefines.MAIN_STATE) {
                var self = this;
                cc.director.preloadScene("MainScene");
                // if (cc.sys.platform === cc.sys.WECHAT_GAME && GlobalVar.sceneManager().firstEnter) {
                //     this.sceneComplete++;
                //     cc.director.preloadScene("LoginScene", function () {
                //         self.sceneComplete--;
                //     });
                //     GlobalVar.sceneManager().firstEnter = false;
                // }
                GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/prefab/Windows/NormalPlane');
                GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/prefab/Windows/GuazaiMain');
                GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/prefab/Windows/NormalImprovement');
                GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/prefab/Windows/NormalBag');
                GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/prefab/Windows/NormalDrawView');
            } else if (next == SceneDefines.BATTLE_STATE) {
                GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/prefab/BattleScene/UIBattlePause');
                GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/prefab/BattleScene/UIBattleEnd');
                GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/prefab/BattleScene/UIBattleCount');
                GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/prefab/BattleScene/UIBattleCard');
                GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/prefab/BattleScene/UIBattleCharge');
                GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/prefab/BattleScene/UIBattleRevive');
                GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/prefab/BattleScene/UIBattleAssist');
                cc.director.preloadScene("BattleScene");
                // cc.director.preloadScene("BattleScene",this.finishCallback(++GlobalVar.resManager().loadStep));
                // this.totalCount++;
            }

            if (this.totalCount == 0) {
                this.loadingBar.progress = 1;
                this.loadingState = LoadingState.E_FINISH;
            } else {
                var self = this;
                let action = cc.progressLoading(2, /*0*/ this.loadingBar.progress, 1, null, function (per) {
                    self.loadingBar.node.getChildByName("spriteLight").x = self.loadingBar.barSprite.node.width * per;
                    if (self.firstLoading) {
                        self.labelProgressPercent.string = Math.floor(per * 80 + 20) + "%";
                    } else {
                        self.labelProgressPercent.string = Math.floor(per * 100) + "%";
                    }
                });
                this.loadingBar.node.runAction(action);
                if (this.firstLoading) {
                    let actionFade = cc.progressLoading(2, this.loadingBarFade.progress, 1, null, function (per) {
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

    finishCallback: function (step, obj, type, path) {
        if (this.loadingState == LoadingState.E_FINISH) {
            return;
        }
        var self = this;
        let percent = 0;
        if (this.totalCount == 0) {
            percent = 1;
        } else {
            percent = (step + 1) / this.totalCount;
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
        let percentFade = percent * 0.8 + 0.2;
        let action = cc.progressLoading(2, this.loadingBar.progress, percent <= 1 ? percent : 1, function () {
            if (percent >= 1) {
                if ((step == -1 || step >= self.totalCount) && self.loadingState !== LoadingState.E_FINISH && self.sceneComplete <= 0) {
                    self.loadingState = LoadingState.E_FINISH;
                }
            }
        }, function (per) {
            self.loadingBar.node.getChildByName("spriteLight").x = self.loadingBar.barSprite.node.width * per;
            if (self.firstLoading) {
                self.labelProgressPercent.string = Math.floor(per * 80 + 20) + "%";
            } else {
                self.labelProgressPercent.string = Math.floor(per * 100) + "%";
            }
        });
        this.loadingBar.node.runAction(action);

        if (this.firstLoading) {
            let actionFade = cc.progressLoading(2, this.loadingBarFade.progress, percentFade <= 1 ? percentFade : 1, null, function (per) {
                self.loadingBarFade.node.getChildByName("spriteLight").x = self.loadingBar.barSprite.node.width * per;
            });
            this.loadingBarFade.node.runAction(actionFade);
        }
    },

});