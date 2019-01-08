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
        btnShare: {
            default: null,
            type: cc.Button,
        },
    },

    onLoad: function () {

    },

    start: function () {
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_ENDLESS_GET_CHARGE_DATA, this.getEndlessChargeData, this);
    },

    onBtnShare: function (event) {
        let self = this;
        let platformApi = GlobalVar.getPlatformApi();
        if (cc.isValid(platformApi)){
            platformApi.shareNormal(116, function () {
                // GlobalVar.handlerManager().endlessHandler.sendEndlessChargeRewardReq();
                BattleManager.getInstance().dashMode = 1;
                BattleManager.getInstance().isOpenDash = true;
                BattleManager.getInstance().managers[Defines.MgrType.HERO].openDash(-1);
                BattleManager.getInstance().managers[Defines.MgrType.SCENARIO].battleEndlessMode.setRushRank(true);
                BattleManager.getInstance().gameState = Defines.GameResult.RESUME;
                self.node.destroy();
            });
        }else if (GlobalVar.configGMSwitch()){
            // GlobalVar.handlerManager().endlessHandler.sendEndlessChargeRewardReq();
        }
    },

    getEndlessChargeData: function (event) {
        if (event.ErrCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        BattleManager.getInstance().dashMode = 1;
        BattleManager.getInstance().isOpenDash = true;
        BattleManager.getInstance().managers[Defines.MgrType.HERO].openDash(-1);
        BattleManager.getInstance().managers[Defines.MgrType.SCENARIO].battleEndlessMode.setRushRank(true);
        BattleManager.getInstance().gameState = Defines.GameResult.RESUME;
        this.node.destroy();
    },

    onBtnClose: function (event) {
        BattleManager.getInstance().gameState = Defines.GameResult.RESUME;
        this.node.destroy();
    },

    onDestroy: function () {
        GlobalVar.eventManager().removeListenerWithTarget(this);
    },
});