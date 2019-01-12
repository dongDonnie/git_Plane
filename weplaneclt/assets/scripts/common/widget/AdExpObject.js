const UIBase = require("uibase");
const weChatAPI = require("weChatAPI");
const GlobalFunc = require('GlobalFunctions');

var AdExpObject = cc.Class({
    extends: UIBase,

    properties: {
        icons: [cc.Node],
        sprites: [cc.Sprite],
        names: [cc.Label],
    },

    onLoad: function () {
        // this.clearWait = [];
    },

    show: function (infos) {
        let self = this;
        this._data = infos;
        // this.unWait4Res();
        console.log('AdExpObject infos:', infos);
        this.icons.map((icon, idx) => {
            let info = infos[idx];
            if (!info) {
                icon.active = false;
                return;
            }
            self.names[idx].string = info.name;
            cc.loader.load(info.icon, function (err, tex) {
                if (err) {
                    cc.error("AdExpObject LoadURLSpriteFrame err, url:" + info.icon);
                }
                let spriteFrame = new cc.SpriteFrame(tex);
                self.sprites[idx].spriteFrame = spriteFrame;
            });
            // let cb = () => {
            // let spriteFrame = AdData.getSpriteFrame(info.icon)
            // this.sprites[idx].spriteFrame = spriteFrame;
            // AdData.unWait4Res(info.icon, cb);
            // }
            // AdData.wait4Res(info.icon, cb);
            // this.clearWait[idx] = () => { AdData.unWait4Res(info.icon, cb); this.clearWait[idx] = null; }
        })
    },

    // unWait4Res: function () {
    //     this.clearWait.map((unwait) => typeof unwait == "function" ? unwait() : null)
    //     this.clearWait = [];
    // },

    onStartGame: function (event, idx) {
        let data = this._data[idx];
        let appid = data ? data['jmpid'] : undefined;
        let parm = data ? data['parm'] : undefined;
        parm = parm ? parm.indexOf('?') > 0 ? parm : parm + '?' : undefined;
        parm = parm ? parm.indexOf('gender') > 0 ? parm : parm + '&gender=' + GlobalFunc.getGender() : undefined;
        let url = data ? data['share'] : undefined;
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            console.log("AdExpObject click index of adexp", data);
            if (appid && !weChatAPI.wxBversionLess("2.2.0")) {
                wx.navigateToMiniProgram({
                    appId: appid,
                    path: parm,
                    success: (res) => { },
                    fail: (res) => {
                        if (GlobalFunc.checkLink(url) && res.errMsg.indexOf(appid) > 0) weChatAPI.previewUrlImage(url);
                    }
                });
            } else if (GlobalFunc.checkLink(url)) {
                weChatAPI.previewUrlImage(url)
            };
        }
        // else if (appid && cc.sys.platform == cc.sys.QQ_PLAY) {
        //     qqplay.skipGame(Number(appid), parm);
        //     console.log(appid, parm);
        // }
    },
    onDetail: function (event, idx) {
        const data = this._data[idx];
        const url = data ? data.url : null;
        if (GlobalFunc.checkLink(url)) {
            weChatAPI.previewUrlImage(url);
        }
    },

    // onDestroy: function () {
    //     this.unWait4Res();
    // },
});
