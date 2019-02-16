const weChatAPI = require("weChatAPI");
const GlobalVar = require('globalvar');
const GlobalFunc = require('GlobalFunctions');
const EventMsgID = require("eventmsgid");

const xoff = 0;
const yoff = 15;

cc.Class({
    extends: cc.Component,

    properties: {
        frameNode: cc.Node
    },

    onLoad: function () {
        if (cc.sys.platform != cc.sys.WECHAT_GAME) {
            this.node.active = false;
            return;
        };
        this.pos = this.node.getPosition();
        this._adFrame = null;
    },

    start: function () {
        this._adFrameData = {}; //{url: SpriteFrame}
        this._ani = this.frameNode.getComponent(cc.Animation);

        this.setOpacity(0);
        this.refresh();
    },

    setOpacity: function (parmOpacity) {
        this.node.opacity = parmOpacity;
        if (parmOpacity >= 255) {
            this.node.getComponent(cc.Button).interactable = true;
        } else if (parmOpacity <= 0) {
            this.node.getComponent(cc.Button).interactable = false;
        }
    },

    onEnable: function () {
        this.registerEvent();
    },

    onDisable: function () {
        GlobalVar.eventManager().removeListenerWithTarget(this);
    },

    registerEvent: function () {
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_REFRESH_AD_SP_DATA, this.refresh, this);
    },

    refresh() {
        this._adFrame = GlobalVar.me().adData.getRemoteSpFrameAd();
        if (this._adFrame === null) {
            GlobalVar.me().adData.pullAdFramesInfo();
            return;
        }
        let url = this._adFrame.url;
        let size = this._adFrame.size;
        let dt = this._adFrame.dt;
        let len = this._adFrame.len;
        let self = this;
        let successCB = (animationClip) => {
            animationClip.wrapMode = cc.WrapMode.Loop;
            animationClip.name = url;
            self._ani.getClips().map((e) => {
                self._ani.removeClip(e);
            });
            self._ani.addClip(animationClip);
            self._ani.play(url);
            self.walk();
            self.setOpacity(255);
        };

        this.createRemoteFrames(url, size, dt, len, successCB);
    },

    createRemoteFrames: function (url, size, dt, len, successCB) {
        let self = this;
        cc.loader.load(url, function (err, tex) {
            if (err) {
                cc.error("AdRomoteSp LoadURLSpriteFrame err, url:" + url);
            }
            let spriteFrame = new cc.SpriteFrame(tex);
            let rects = self.splitRect(spriteFrame.getRect(), size);
            let temps = rects.map((rect) => {
                let sf = spriteFrame.clone();
                sf.setRect(rect);
                return sf;
            });
            let frames = temps.slice(0, len);
            let animationClip = cc.AnimationClip.createWithSpriteFrames(frames, dt);
            successCB(animationClip);
        });
    },

    splitRect: function (rect, size) {
        let c = size[0];//列数
        let r = size[1];//行数
        let dx = rect.width / c;
        let dy = rect.height / r;
        let ox = rect.x;
        let oy = rect.y;
        let split = (x, y) => new cc.rect(ox + dx * x, oy + dy * (r - y - 1), dx, dy);
        let list = new Array();
        for (let i = 0; i < r; i++) {
            for (let j = 0; j < c; j++) {
                list = list.concat(split(j, i));
            }
        }
        console.log('AdRomoteSp list:', list)
        return list;
    },

    walk: function () {
        let action = cc.repeatForever(
            cc.sequence(
                cc.delayTime(0.2),
                cc.moveBy(0.1, cc.v2(xoff, yoff)),
                cc.moveBy(0.1, cc.v2(-xoff, -yoff)),
                cc.moveBy(0.1, cc.v2(xoff, yoff)),
                cc.moveBy(0.1, cc.v2(-xoff, -yoff)),
                cc.delayTime(1.5),
            ));
        this.frameNode.stopAllActions();
        this.frameNode.runAction(action);
    },

    clickBtn: function (event, reject, result, path) {
        if (this._adFrame) {
            let _appid = this._adFrame['jmpid'];
            let parm = this._adFrame['parm'];
            parm = parm.indexOf('?') > 0 ? parm : parm + '?';
            parm = parm.indexOf('gender') > 0 ? parm : parm + '&gender=' + GlobalFunc.getGender();
            let share = this._adFrame['url'];
            if (!weChatAPI.wxBversionLess("2.2.0")) {
                wx.navigateToMiniProgram({
                    appId: _appid,
                    path: parm,
                    success: result,
                    fail: (res) => {
                        console.log(res, _appid, res.errMsg.indexOf(_appid));
                        if (GlobalFunc.checkLink(share) && res.errMsg.indexOf(_appid) > 0) {
                            weChatAPI.previewUrlImage(share);
                        }
                    },
                });
            } else if (GlobalFunc.checkLink(share)) {
                weChatAPI.previewUrlImage(share);
            }
        }
        this.refresh();
    },

    reloadRemoteAd: function () {
        this._show = true;
        let cb = () => {
            if (this.createRemoteAd() != -1) {//res is not ready yet. listen continue.
                adc.unWait4ResAny(cb);
                if (typeof this.clearRemoteAdCb == "function") this.clearRemoteAdCb();
            }
        }
        if (typeof this.clearRemoteAdCb == "function") this.clearRemoteAdCb();
        this.clearRemoteAdCb = () => adc.unWait4ResAny(cb);

        adc.wait4ResAny(cb);
    },

    showRemoteAd() {
        this._show = true;
        this.refreshRemoteAd();
    },

    hideRemoteAd() {
        this._show = false;
        this.refreshRemoteAd();
    },

    refreshRemoteAd() {
        const old = this.node.active;
        this.node.active = this._show;
        if (!old && this._show) {
            let clips = this._ani.getClips();
            this._ani.play(clips[0].name);
        }
    },
});
