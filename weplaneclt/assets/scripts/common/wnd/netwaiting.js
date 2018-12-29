const GlobalVar = require("globalvar");
const ResMapping = require("resmapping");
const SceneDefines = require("scenedefines");
const i18n = require('LanguageData');

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
        GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/prefab/Net/ReConnecting', function (prefab) {
            if (prefab != null) {
                self.reconnecting = cc.instantiate(prefab);
            }
        });
        GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/prefab/Net/Waiting', function (prefab) {
            if (prefab != null) {
                self.waiting = cc.instantiate(prefab);
            }
        });
    },

    release: function () {
        this.reconnecting && this.reconnecting.destroy();
        this.waiting && this.waiting.destroy();
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
                    GlobalVar.comMsg.showMsg(i18n.t('label.4000001'));
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
    },
});