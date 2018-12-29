const GlobalVar = require("globalvar");
const UIBase = require("uibase");
const Defines = require('BattleDefines');
const BattleManager = require('BattleManager');
const EventMsgID = require("eventmsgid")
const GameServerProto = require("GameServerProto");
const weChatAPI = require("weChatAPI");
const i18n = require('LanguageData');

cc.Class({
    extends: UIBase,

    properties: {

    },

    onLoad: function () {

    },

    onBtnShare: function (event) {
        let self = this;
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            weChatAPI.shareNormal(111, function () {
                GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_ASSIST_SHARE_SUCCESS);
                self.onBtnClose();
            }, null, i18n.t('label.4000315'));
        } else if (window && window["wywGameId"]=="5469"){

        } else {
            GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_ASSIST_SHARE_SUCCESS);
            this.onBtnClose();
        }
    },

    onBtnClose: function (event) {
        BattleManager.getInstance().gameState = Defines.GameResult.PREPARE
        this.node.destroy();
    },

    // onEnable: function(){
    //     if (GlobalVar.getBannerSwitch() && !GlobalVar.getNeedGuide()){
    //         weChatAPI.showBannerAd();
    //     }
    // },

    // onDisable: function () {
    //     if (GlobalVar.getBannerSwitch()){
    //         weChatAPI.hideBannerAd();
    //     }
    // },

    onDestroy: function () {
        GlobalVar.eventManager().removeListenerWithTarget(this);
    },
});