const SceneBase = require("scenebase");
const GlobalVar = require("globalvar");

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
        GlobalVar.windowManager().resumeView();
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

});