const SceneBase = require("scenebase")
var EventMsgID = require("eventmsgid")
var GlobalVar = require("globalvar")


var CreateRoleScene = cc.Class({
    extends: SceneBase,
    ctor: function () {
        
    },

    onLoad:function(){
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_ENTER_GAME, this._onEnterGame, this);
    },

    onDestroy:function(){
        this.releaseScene();
        GlobalVar.eventManager().removeListenerWithTarget(this);
    },

    _onEnterGame: function() {
        let SceneDefines = require("scenedefines")
        GlobalVar.sceneManager().gotoScene(SceneDefines.MAIN_STATE);
    }
});

