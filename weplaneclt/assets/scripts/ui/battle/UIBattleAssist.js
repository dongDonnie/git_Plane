const GlobalVar = require("globalvar");
const UIBase = require("uibase");
const Defines = require('BattleDefines');
const BattleManager = require('BattleManager');
const EventMsgID = require("eventmsgid")
const i18n = require('LanguageData');

cc.Class({
    extends: UIBase,

    properties: {

    },

    onLoad: function () {

    },

    onBtnShare: function (event) {
        let self = this;

        let platformApi = GlobalVar.getPlatformApi();
        if (platformApi){
            platformApi.shareNormal(105, function () {
                GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_ASSIST_SHARE_SUCCESS);
                self.onBtnClose();
            }, null, i18n.t('label.4000315'));
        }else if (GlobalVar.configGMSwitch()){
            GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_ASSIST_SHARE_SUCCESS);
            this.onBtnClose();
        }
    },

    onBtnClose: function (event) {
        BattleManager.getInstance().gameState = Defines.GameResult.PREPARE
        this.node.destroy();
    },

    onDestroy: function () {
        GlobalVar.eventManager().removeListenerWithTarget(this);
    },
});