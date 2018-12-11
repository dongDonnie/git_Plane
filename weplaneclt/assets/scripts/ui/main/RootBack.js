const ResMapping = require("resmapping");
const ResManager = require("ResManager");
const UIBase = require("uibase");

cc.Class({
    extends: UIBase,

    properties: {
        RootBack: {
            default: null,
            type: cc.Button
        },
        Background: {
            default: null,
            type: cc.Sprite
        },
    },

    onLoad: function () {

    },

    setBackground:function(bgName){
        // var self=this;
        // ResManager.getInstance().loadRes(ResMapping.ResType.SpriteFrame, "ui/common/" + bgName + ".png", function (frame) {
        //     if (frame != null) {
        //         self.Background.spriteFrame = frame;
        //     }
        // });
    },

    touchRoot: function () {
        // cc.log("touchRoot");
    },

    enter: function (isRefresh) {
        if (isRefresh) {
            
        } else {
            
        }

    },

    escape: function (isRefresh) {
        if (isRefresh) {
            
        } else {
            
        }
    },    
});
