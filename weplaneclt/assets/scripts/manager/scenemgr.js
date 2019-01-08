const SceneDefines = require("scenedefines")
const ResMapping = require("resmapping")
const GlobalVar = require('globalvar')

var SceneManager = cc.Class({
    extends: cc.Component,
    ctor: function () {

        this.currentScene = -1;
        this.nextScene = -1;
        this.lastScene = -1;
        this.curScene = null;

        //是否是刚开始启动游戏
        this.firstEnter = true;
    },

    statics: {
        instance: null,
        getInstance: function () {
            if (SceneManager.instance == null) {
                SceneManager.instance = new SceneManager();
            }
            return SceneManager.instance;
        },
        destroyInstance() {
            if (SceneManager.instance != null) {
                delete SceneManager.instance;
                SceneManager.instance = null;
            }
        }
    },

    gotoScene: function (nextScene) {
        if (nextScene === this.currentScene || nextScene === this.nextScene) {
            return;
        }

        let platformApi = GlobalVar.getPlatformApi();
        if (cc.isValid(platformApi)) {
            platformApi.hideBannerAdNew();
        }

        this.nextScene = nextScene;

        if (nextScene === SceneDefines.BATTLE_STATE) {
            GlobalVar.windowManager().pauseView();
        }

        if (this.currentScene !== SceneDefines.LOADING_STATE) {
            this.lastScene = this.currentScene;
        }

        if (nextScene === SceneDefines.MAIN_STATE || nextScene === SceneDefines.BATTLE_STATE) {
            nextScene = SceneDefines.LOADING_STATE;
        }
        this.directGotoScene(nextScene);

    },

    directGotoScene: function (nextScene) {
        let sceneName = this.getSceneName(nextScene);
        if (sceneName !== "") {
            var self = this;
            //cc.director.preloadScene(sceneName, function () {
            cc.director.loadScene(sceneName);
            self.curScene = cc.director.getScene();
            self.currentScene = nextScene;

            // cc.log("切换到： " + sceneName + " 场景成功!")
            //});
        } else {
            // cc.error("switch scene wrong");
        }
    },

    getSceneName: function (sceneType) {
        let sceneName = "";
        if (sceneType === SceneDefines.LOADING_STATE) {
            sceneName = "LoadingScene";
        } else if (sceneType === SceneDefines.LOGIN_STATE) {
            sceneName = "LoginScene";
        } else if (sceneType == SceneDefines.CREATEROLE_STATE) {
            sceneName = "createrole";
        } else if (sceneType === SceneDefines.MAIN_STATE) {
            sceneName = "MainScene";
        } else if (sceneType === SceneDefines.INIT_STATE) {
            sceneName = "InitScene";
        } else if (sceneType === SceneDefines.BATTLE_STATE) {
            sceneName = "BattleScene";
        }
        return sceneName;
    },

    startUp: function () {
        this.gotoScene(SceneDefines.LOGIN_STATE);
    },

    resetOpen: function () {
        //this.gotoScene(SceneDefines.LOGIN_STATE);
        // if(this.currentScene==SceneDefines.INIT_STATE){
        //     this.gotoScene(SceneDefines.LOGIN_STATE);
        // }else if(this.currentScene==SceneDefines.LOGIN_STATE){
        //     this.gotoScene(SceneDefines.INIT_STATE);
        // }
        //
    },

    getCurrentScene: function () {
        return this.curScene;
    },

    getCurrentSceneType: function () {
        return this.currentScene;
    },

    getLastSceneType: function () {
        return this.lastScene;
    },

});