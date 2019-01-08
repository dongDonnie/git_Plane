
const xoff = 0;
const yoff = 15;
cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad: function () {
        this.reloadRemoteAd();
        this.pos = this.node.getPosition();
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
        this.node.stopAllActions();
        this.node.runAction(action);
    },
    createRemoteAd: function (update) {
        let adFrame = adc.getAdFrame(update);
        if (!adFrame.url) return -1;
        if (cc.sys.platform != cc.sys.WECHAT_GAME) return;
        const node = this.node;
        let self = this;
        if (node) {
            if (!node.getComponent(cc.Sprite)) node.addComponent(cc.Sprite);
            if (!node.getComponent(cc.Animation)) node.addComponent(cc.Animation);
            const sprite = node.getComponent(cc.Sprite);
            const url = adFrame.url;
            const size = adFrame.size;
            const dt = adFrame.dt;
            const len = adFrame.len;
            const appid = adFrame.id;
            const name = url;
            this._adFrame = adFrame;
            const cb = () => {
                const animationClip = adc.getRemoteClip(url, size, dt, len);
                const setClipWrapMode = (clip, mode) => {
                    clip.wrapMode = mode;
                }
                const setClipName = (clip, name) => (clip.name = name);
                setClipWrapMode(animationClip, cc.WrapMode.Loop);
                setClipName(animationClip, name);
                const ani = node.getComponent(cc.Animation);
                ani.getClips().map((e) => ani.removeClip(e));
                ani.addClip(animationClip);
                ani.play(name);
                this.walk();
                this.refreshRemoteAd();
            }
            if (typeof this.waitDel == "function") this.waitDel();
            this.waitDel = () => adc.unWait4Res(url, cb);
            adc.wait4Res(url, cb);
        }
    },

    remoteAdBtn: function (event, reject, result, path) {
        if (this._adFrame) {
            let _appid = this._adFrame['jmpid'];
            var parm = this._adFrame['parm'];
            parm = parm.indexOf('?') > 0 ? parm : parm + '?';
            parm = parm.indexOf('gender') > 0 ? parm : parm + '&gender=' + global.getGender();
            const share = this._adFrame['url'];
            console.log("_appid", _appid);
            if (!wxAd.wxBversionLess("2.2.0"))
                //do some thing;
                wx.navigateToMiniProgram({
                    appId: _appid,
                    path: parm,
                    success: result,
                    fail: (res) => {
                        console.log(res, _appid, res.errMsg.indexOf(_appid));
                        if (adc.checkLink(share) && res.errMsg.indexOf(_appid) > 0)
                            preview.previewUrlImage(share);
                    },
                });
            else if (adc.checkLink(share))
                preview.previewUrlImage(share);
        }
        this.reloadRemoteAd();
    },

    /*
     *{@force : Boolean 是否重新拉取}
     *  加载过程可能会有延迟
     */
    reloadRemoteAd: function (force) {
        this._show = true;
        let cb = () => {
            if (this.createRemoteAd(force) != -1) {//res is not ready yet. listen continue.
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
            let clips = this.node.getComponent(cc.Animation).getClips();
            this.node.getComponent(cc.Animation).play(clips[0].name);
        }
    },
    onDisable() {
        const ani = this.node.getComponent(cc.Animation)
        if (ani) ani.stop();
    },
    onDestroy() {
        this.unschedule(this.callback);
        if (this.waitDel) {
            this.waitDel();
            this.waitDel = null;
        }
        if (typeof this.clearRemoteAdCb == "function") {
            this.clearRemoteAdCb();
            this.clearRemoteAdCb = null;
        }
    },

    start() {

    },

    // update (dt) {},
});
