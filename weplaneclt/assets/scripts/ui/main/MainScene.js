const SceneBase = require("scenebase");
const GlobalVar = require("globalvar");
const config = require("config");

var MainScene = cc.Class({
    extends: SceneBase,

    ctor: function() {
        this.uiNode = null;
    },

    properties: {
        
    },

    onLoad: function () {
        this.sceneName="MainScene";
        this.uiNode = cc.find("Canvas/UINode");
        this.openScene();
        GlobalVar.soundManager().playBGM("cdnRes/audio/main/music/main_city");
        // this.loadPrefab("UIMain",function(){
        //     //GlobalVar.windowManager().resumeView();
        // });
        this.timeTick = 0; 
    },

    start(){
        if (!GlobalVar.me().levelUpFlag || config.NEED_GUIDE){
            GlobalVar.windowManager().resumeView();
        }
        // this.loadPrefab("UIMain",function(){
        //     GlobalVar.windowManager().resumeView();
        // });
    },

    onDestroy() {
        this.releaseScene();
    },

    update:function (dt) {
        // this.timeTick += 1;
        // if (this.timeTick == 1200){
        //     this.timeTick = 0;
        //     console.log(this);
        // }
    },

    clickMask: function (event) {
        // event.stopPropagation();
        cc.log("当前点击为：", event.target.name);
    },
});