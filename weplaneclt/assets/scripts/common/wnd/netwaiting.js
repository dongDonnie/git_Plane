const GlobalVar = require("globalvar");
const ResMapping = require("resmapping");
const SceneDefines = require("scenedefines");
const weChatAPI = require("weChatAPI");

var NetWaiting = cc.Class({
    ctor: function () {
        this.reconnect = false;
        this.reconnecting = null;
        this.wait = false;
        this.waiting = null;
    },

    statics: {
        instance: null,
        getInstance: function () {
            if (NetWaiting.instance == null) {
                NetWaiting.instance = new NetWaiting();
            }
            return NetWaiting.instance;
        },
        destroyInstance() {
            if (NetWaiting.instance != null) {
                delete NetWaiting.instance;
                NetWaiting.instance = null;
            }
        }
    },

    init: function () {
        var self = this;
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/prefab/Net/ReConnecting', function (prefab) {
                if (prefab != null) {
                    self.reconnecting = cc.instantiate(prefab);
                }
            });
        }
        // GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/prefab/Net/Waiting', function (prefab) {
        //     if (prefab != null) {
        //         self.waiting = cc.instantiate(prefab);
        //     }
        // });
        this.initWaiting();
    },

    initWaiting: function () {
        var self = this;
        GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/prefab/Net/Waiting', function (prefab) {
            if (prefab != null) {
                self.waiting = cc.instantiate(prefab);
            } else {
                if (cc.sys.platform === cc.sys.WECHAT_GAME) {
                    weChatAPI.showToast("请保持网络链接", true, false);
                }
                self.initWaiting();
            }
        });
    },

    release: function () {
        if (cc.isValid(this.reconnecting)) {
            this.reconnecting.destroy();
        }
        if (cc.isValid(this.waiting)) {
            this.waiting.destroy();
        }
    },

    showWaiting: function (show) {
        if (this.reconnect)
            return;
        show = typeof show !== 'undefined' ? show : true;
        if (show) {
            if (!!this.waiting && cc.isValid(this.waiting) && !this.wait) {
                let parentNode = cc.find("Canvas/NetNode");
                if (parentNode != null) {
                    parentNode.addChild(this.waiting);
                    this.wait = true;

                    if (GlobalVar.sceneManager().getCurrentSceneType() == SceneDefines.LOGIN_STATE) {
                        let uiserversel = cc.find("Canvas/UINode").getChildByName('UIServerSel');
                        if (cc.isValid(uiserversel)) {
                            if (!uiserversel.getComponent('UIServerSel').canSelect) {
                                uiserversel.getComponent('UIServerSel').canSelect = true;
                            }
                        }
                    }
                }
            }
        } else {
            if (!!this.waiting && cc.isValid(this.waiting) && this.wait) {
                this.waiting.getChildByName('Waiting').active = false;
                this.waiting.removeFromParent(false);
                this.wait = false;
            }
        }
    },

    showReconnect: function (show) {
        show = typeof show !== 'undefined' ? show : true;
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            if (GlobalVar.sceneManager().getCurrentSceneType() == SceneDefines.LOGIN_STATE) {
                weChatAPI.getNetWorkStatus(function (type) {
                    let uiNode = cc.find("Canvas/UINode");
                    if (type === 'none' || !cc.isValid(uiNode)) {
                        if (!this.reconnect) {
                            var self = this;
                            weChatAPI.showToast("网络状态异常, 请检查网络后点击确认重试", true, false, "确认", "取消", function () {
                                self.reconnect = false;
                                //cc.game.restart();
                                GlobalVar.sceneManager().reStart();
                            }, function () {
                                cc.game.end();
                            });
                            this.reconnect = true;
                        }
                    } else {
                        weChatAPI.showToast("服务器维护中", true, false);
                        uiNode.getChildByName('UIServerSel').getComponent('UIServerSel').canSelect = true;
                    }
                })
            } else if (GlobalVar.sceneManager().getCurrentSceneType() == SceneDefines.INIT_STATE) {
                weChatAPI.getNetWorkStatus(function (type) {
                    if (type === 'none') {
                        if (!this.reconnect) {
                            var self = this;
                            weChatAPI.showToast("没有网络链接, 请检查网络后重试", true, false, "确认", "取消", function () {
                                self.reconnect = false;
                                //cc.game.restart();
                                GlobalVar.sceneManager().reStart();
                            });
                            this.reconnect = true;
                        }
                    } else {
                        weChatAPI.showToast("服务器维护中", true, false);
                    }
                })
            } else {
                if (GlobalVar.sceneManager().getCurrentSceneType() != SceneDefines.LOADING_STATE) {
                    if (!this.reconnect) {
                        var self = this;
                        weChatAPI.showToast("亲爱的指挥官，超新星爆发导致通讯中断，是否尝试重连本部？", true, false, "确认", "取消", function () {
                            self.reconnect = false;
                            //cc.game.restart();
                            GlobalVar.sceneManager().reStart();
                        }, function () {
                            cc.game.end();
                        });
                    }
                    this.reconnect = true;
                }
            }
        } else {
            if (show) {
                if (!!this.reconnecting && cc.isValid(this.reconnecting) && !this.reconnect) {
                    if (GlobalVar.sceneManager().getCurrentSceneType() == SceneDefines.MAIN_STATE ||
                        GlobalVar.sceneManager().getCurrentSceneType() == SceneDefines.BATTLE_STATE) {
                        let parentNode = cc.find("Canvas/NetNode");
                        if (parentNode != null) {
                            parentNode.addChild(this.reconnecting);
                            this.reconnect = true;
                        }
                    } else if (GlobalVar.sceneManager().getCurrentSceneType() == SceneDefines.LOGIN_STATE) {
                        GlobalVar.comMsg.showMsg('服务器维护中');
                        cc.find("Canvas/UINode").getChildByName('UIServerSel').getComponent('UIServerSel').canSelect = true;
                    } else {
                        GlobalVar.sceneManager().startUp();
                    }
                } else {
                    GlobalVar.sceneManager().startUp();
                }
            } else {
                if (!!this.reconnecting && cc.isValid(this.reconnecting) && this.reconnect) {
                    this.reconnecting.removeFromParent(false);
                    this.reconnect = false;
                }
            }
        }

    },
});