const GlobalVar = require("globalvar");
const weChatAPI = require("weChatAPI");
const i18n = require('LanguageData');
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
        isLogoFadedIn: {
            default: false,
            visible: false,
        },
        loadingBar: {
            default: null,
            type: cc.ProgressBar
        },
    },

    onLoad() {
        cc.game.setFrameRate(60);

        this.isJsonLoaded = false;
        this.isLoadingEnd = false;

        GlobalVar.isAndroid = cc.sys.os == cc.sys.OS_ANDROID;
        GlobalVar.isIOS = cc.sys.os == cc.sys.OS_IOS;
        // GlobalVar.isIOS = true;
        let self = this;

        let action = cc.sequence(cc.progressLoading(3, 0, 1, null, function (per) {
            self.loadingBar.node.getChildByName("spriteLight").x = self.loadingBar.totalLength * per;
        }), cc.callFunc(()=>{
            self.isLoadingEnd = true;
        }));
        this.loadingBar.node.runAction(action);
    },

    start() {
        //weChatAPI.setFramesPerSecond(60);
        weChatAPI.deviceKeepScreenOn();

        i18n.init('zh');
        let self = this;

        //GlobalVar.netWaiting().init();

        GlobalVar.tblApi.init(function () {
            self.isJsonLoaded = true;

            if (!self.isLoadingEnd){
                self.loadingBar.node.stopAllActions();

                let action = cc.sequence(cc.progressLoading(0.2, self.loadingBar.progress, 1, null, function (per) {
                    self.loadingBar.node.getChildByName("spriteLight").x = self.loadingBar.totalLength * per;
                }), cc.callFunc(()=>{
                    self.isLoadingEnd = true;
                }));


                self.loadingBar.node.runAction(action)
            }
        });

        if (cc.sys.platform == cc.sys.WECHAT_GAME){
            let launchInfo = wx.getLaunchOptionsSync();
            if (launchInfo.query.materialID >= 0){
                weChatAPI.reportClickMaterial(launchInfo.query.materialID);
            }
        }

        // GlobalVar.tblApi.init(function () {
        //     GlobalVar.sceneManager().startUp();
        // });
    },

    update() {
        let self = this;
        if (this.isJsonLoaded && this.isLoadingEnd){
            this.isJsonLoaded = false;
            this.isLoadingEnd = false;
            GlobalVar.sceneManager().startUp();
        }
    },
});
