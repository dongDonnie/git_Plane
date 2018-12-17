const GlobalVar = require("globalvar");
const UIBase = require("uibase");
const Defines = require('BattleDefines');
const BattleManager = require('BattleManager');
const EventMsgID = require("eventmsgid")
const GameServerProto = require("GameServerProto");
const md5 = require("md5");
const weChatAPI = require("weChatAPI");

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
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            weChatAPI.shareNormal(116, function () {
                GlobalVar.handlerManager().endlessHandler.sendEndlessChargeRewardReq();
            });
        }else{
            GlobalVar.handlerManager().endlessHandler.sendEndlessChargeRewardReq();
        }
    },

    getEndlessChargeData: function (event) {
        if (event.ErrCode != GameServerProto.PTERR_SUCCESS){
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        BattleManager.getInstance().dashMode = 1;
        BattleManager.getInstance().isOpenDash = true;
        BattleManager.getInstance().managers[Defines.MgrType.HERO].openDash(-1);
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