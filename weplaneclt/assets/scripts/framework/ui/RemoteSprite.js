var config = require('config');
const ResMapping = require("resmapping");
const ResManager = require("ResManager");
const weChatAPI = require("weChatAPI");

const resPath = cc.Class({
    name: 'resPath',
    properties: {
        local: cc.SpriteFrame,
        url: "",
    }
});

var RemoteSprite = cc.Class({
    extends: cc.Sprite,

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.renderers/Sprite',
        help: 'i18n:COMPONENT.help_url.sprite',
        inspector: 'packages://rSprite/rSpriteInspector.js',
    },

    ctor:function(){
        this.setFrame();
    },

    properties: {
        _defaultURL: "",
        defaultURL: {
            get: function () {
                return this._defaultURL;
            },
            set: function (value) {
                this._defaultURL = value;
            },
        },
        frameList: {
            default: [],
            type: resPath,
        },
    },

    onLoad() {
        //this.setFrame();
    },

    setFrame: function (index) {
        var self = this;
        if (0) {
            if (typeof index !== 'undefined') {
                if (this.frameList.length > 0 && index < this.frameList.length && index>=0) {
                    weChatAPI.pushURL(ResMapping.ResType.SpriteFrame, frameList[index].url, function (frame) {
                        // console.log("get frame");
                        self.spriteFrame = frame;
                    });
                }
            } else {
                if (this.defaultURL != "") {
                    weChatAPI.pushURL(ResMapping.ResType.SpriteFrame, this.defaultURL, function (frame) {
                        // console.log("get frame");
                        self.spriteFrame = frame;
                    });
                }
            }
        } else {
            index = typeof index !== 'undefined' ? (index > this.frameList.length || index < 0 ? 0 : index) : 0;
            if (this.frameList.length > 0 && index < this.frameList.length) {
                this.spriteFrame = this.frameList[index].local;
            }
        }
    },

    loadFrame:function(param){
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            this.loadFrameFromURL(param);
        }else{
            this.loadFrameFromLocalRes(param);
        }
    },

    loadFrameFromLocalRes: function (path) {
        var self = this;
        ResManager.getInstance().loadRes(ResMapping.ResType.SpriteFrame, path, function (frame) {
            if(cc.isValid(self)){
                self.spriteFrame = frame;
            }
        });
    },

    loadFrameFromURL: function (url) {
        var self = this;
        weChatAPI.pushURL(ResMapping.ResType.SpriteFrame, url, function (frame) {
            // console.log("get frame");
            self.spriteFrame = frame;
        });
    }
});

cc.RemoteSprite = module.exports = RemoteSprite;