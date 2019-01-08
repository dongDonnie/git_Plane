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
        labelText: {
            default: null,
            type: cc.Label,
        },
        labelReviveLeftTime: {
            default: null,
            type: cc.Label,
        },
        labelDiamondCost: {
            default: null,
            type: cc.Label,
        },
    },

    onLoad: function () {
        this.waitForRevive = false;
        if (!GlobalVar.getShareSwitch()){
            this.node.getChildByName("spriteRevive").getChildByName("labelShareTip").active = false;
            this.node.getChildByName("spriteRevive").getChildByName("btnShare").active = false;
            this.node.getChildByName("spriteRevive").getChildByName("btnRevive").x = 0;
            this.node.getChildByName("spriteRevive").getChildByName("spriteDiamondIcon").x = -20;
            this.labelDiamondCost.node.x = -4;
        }else{
            this.node.getChildByName("spriteRevive").getChildByName("labelShareTip").active = true;
            this.node.getChildByName("spriteRevive").getChildByName("btnShare").active = true;
            this.node.getChildByName("spriteRevive").getChildByName("btnRevive").x = 120;
            this.node.getChildByName("spriteRevive").getChildByName("spriteDiamondIcon").x = 100;
            this.labelDiamondCost.node.x = 116;
        }

        this.node.getChildByName("spriteRevive").getChildByName("btnCount").active = BattleManager.getInstance().isEndlessFlag;
    },

    start: function () {
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_CAMP_REVIVE_ACK_RESULT, this.getReviveMsg, this);
        this.initWnd();
    },

    getReviveMsg: function (event) {
        if (event.ErrCode !== GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            this.waitForRevive = false;
            return;
        }
        this.waitForRevive = false;
        this.reviveMode = true;
        this.windowClose();
    },

    initWnd: function () {
        let curDieCount = GlobalVar.me().campData.getBattleDieCount();
        if (BattleManager.getInstance().isEndlessFlag){
            this.labelReviveLeftTime.string = Defines.REVIVECOUNTENDLESS - curDieCount;
        }else{
            this.labelReviveLeftTime.string = Defines.REVIVECOUNTCAMPAIGN - curDieCount;
        }
        this.labelDiamondCost.string = (curDieCount + 1) * 20;
    },

    onBtnShare: function (event) {
        // if (cc.sys.platform !== cc.sys.WECHAT_GAME && !(window && window["wywGameId"]=="5469")) {
        //     GlobalVar.comMsg.showMsg("非微信玩一玩平台不能分享");
        //     return;
        // }

        if (!this.waitForRevive) {
            this.waitForRevive = true;
            let self = this;

            let materialID = 0;
            if (BattleManager.getInstance().isEndlessFlag){
                materialID = 102;
            }else{
                materialID = 101;
            }

            let platformApi = GlobalVar.getPlatformApi();
            if (cc.isValid(platformApi)){
                platformApi.shareNormal(materialID, function () {
                    GlobalVar.handlerManager().campHandler.sendCampReviveReq(1);
                }, function () {
                    self.waitForRevive = false;
                });
            }else if (GlobalVar.configGMSwitch()){
                GlobalVar.handlerManager().campHandler.sendCampReviveReq(1);
            }
        }
    },

    onBtnRevive: function (event) {
        if (!this.waitForRevive) {
            this.waitForRevive = true;
            GlobalVar.handlerManager().campHandler.sendCampReviveReq();
        }
    },

    onBtnClose: function (event) {
        this.closeMode = true;
        this.windowClose();
    },

    windowClose: function () {
        if (this.reviveMode) {
            BattleManager.getInstance().gameState = Defines.GameResult.REVIVE;
            this.reviveMode = false;
        } else if (this.closeMode) {
            if (BattleManager.getInstance().isEndlessFlag) {
                BattleManager.getInstance().result = 2;
            } else {
                BattleManager.getInstance().result = 0;
            }
            BattleManager.getInstance().gameState = Defines.GameResult.END;
            this.closeMode = false;
        }
        this.node.destroy();
    },

    onDestroy: function () {
        GlobalVar.eventManager().removeListenerWithTarget(this);
    },
});