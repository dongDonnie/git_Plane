
const UIBase = require("uibase");
const GlobalVar = require('globalvar')
const EventMsgID = require("eventmsgid");
const GameServerProto = require("GameServerProto");
const SceneDefines = require("scenedefines");
const weChatAPI = require("weChatAPI");
const i18n = require('LanguageData');

const RECV_CUR_REWARD = 0, RECV_ALL_REWARD = 1, RECV_ALL_REWARD_VIP = 2;
const RECV_ALL_NEED_VIP_LEVEL = 2;

cc.Class({
    extends: UIBase,

    properties: {
        spriteNodeList: {
            default: [],
            type: [cc.Node],
        },
        maxDrawCount: 0,
        curDrawCount: 0,
        cardDrawState: [],
        canDrawCard: false,
        gameEndData: null,
    },

    onLoad: function () {
        this.maxDrawCount = 0;
        this.curDrawCount = 0;
        this.canDrawCard = false;
        this.cardDrawState = [];
        this.gameEndData = {};
        this.canClickedRecvBtn = false;

        let nodeButton = this.node.getChildByName("nodeBottom").getChildByName("nodeButton");
        nodeButton.getChildByName("firstplay").active = false;
        if (!GlobalVar.srcSwitch()) {
            if (GlobalVar.me().campData.firstTimePlay) {
                // nodeButton.getChildByName("firstplay").active = true;
                if (GlobalVar.me().vipLevel >= RECV_ALL_NEED_VIP_LEVEL) {
                    nodeButton.getChildByName("nodeShare").active = false;
                    nodeButton.getChildByName("nodeVip").x = 0;
                    nodeButton.getChildByName("nodeVip").active = true;
                    nodeButton.getChildByName("btnRecv").active = false;
                    nodeButton.getChildByName("btnRecvNew").active = false;
                }else if (GlobalVar.getShareSwitch()) {
                    nodeButton.getChildByName("nodeShare").x = -150
                    nodeButton.getChildByName("nodeShare").active = true;
                    nodeButton.getChildByName("nodeVip").x = 150;
                    nodeButton.getChildByName("nodeVip").active = true;
                    nodeButton.getChildByName("btnRecv").active = false;
                    nodeButton.getChildByName("btnRecvNew").active = true;
                } else {
                    nodeButton.getChildByName("nodeShare").active = false;
                    nodeButton.getChildByName("nodeVip").x = 0;
                    nodeButton.getChildByName("nodeVip").active = true;
                    nodeButton.getChildByName("btnRecv").active = false;
                    nodeButton.getChildByName("btnRecvNew").active = true;
                }
            } else {
                nodeButton.getChildByName("nodeShare").active = false;
                nodeButton.getChildByName("nodeVip").active = false;
                nodeButton.getChildByName("btnRecv").active = true;
                nodeButton.getChildByName("btnRecvNew").active = false;
            }
        } else if (GlobalVar.getShareSwitch() && GlobalVar.me().campData.firstTimePlay) {
            // nodeButton.getChildByName("firstplay").active = true;
            nodeButton.getChildByName("nodeShare").x = 0;
            nodeButton.getChildByName("nodeShare").active = true;
            nodeButton.getChildByName("nodeVip").active = false;
            nodeButton.getChildByName("btnRecv").active = false;
            nodeButton.getChildByName("btnRecvNew").active = true;
        }else{
            nodeButton.getChildByName("nodeShare").active = false;
            nodeButton.getChildByName("nodeVip").active = false;
            nodeButton.getChildByName("btnRecv").active = true;
            nodeButton.getChildByName("btnRecvNew").active = false;
        }
    },

    start:function(){
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_CAMP_DRAWREWARD_NTF, this.getDrawCardNtf, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_CAMP_FREEDRAW_NTF, this.getFreeDrawCardNtf, this);
        this.node.getChildByName("nodeBottom").getChildByName("nodeButton").active = false;
        this.initCardRewardView();
        require('Guide').getInstance().showRecv(this);
    },

    onDestroy: function () {
        GlobalVar.eventManager().removeListenerWithTarget(this);
    },

    touchEnd:function(event, index){
        if (!!this.canQuitUIBattleCard && !this.canClickedRecvBtn){
            if (index == RECV_CUR_REWARD){
                this.canClickedRecvBtn = true;
                let labelTip = this.node.getChildByName("nodeBottom").getChildByName("labelDrawCardTip");
                labelTip.active = false;
                GlobalVar.sceneManager().gotoScene(SceneDefines.MAIN_STATE);
            } else if (index == RECV_ALL_REWARD){
                let self = this;
                let platformApi = GlobalVar.getPlatformApi();
                if (cc.isValid(platformApi)){
                    platformApi.shareNormal(106, function() {
                        self.canClickedRecvBtn = true;
                        // console.log("发送freedraw消息");
                        GlobalVar.handlerManager().campHandler.sendFreeDrawReq();
                    });
                }else if (GlobalVar.configGMSwitch()){
                    self.canClickedRecvBtn = true;
                    // console.log("发送freedraw消息");
                    GlobalVar.handlerManager().campHandler.sendFreeDrawReq();
                }
            } else if (index == RECV_ALL_REWARD_VIP){
                if (GlobalVar.me().vipLevel >= RECV_ALL_NEED_VIP_LEVEL){
                    this.canClickedRecvBtn = true;
                    GlobalVar.handlerManager().campHandler.sendFreeDrawReq();
                }else{
                    let str = i18n.t('label.4000506')
                    str = str.replace("%count", GlobalVar.tblApi.getDataBySingleKey('TblVipRight', RECV_ALL_NEED_VIP_LEVEL).nRecharge / 10);
                    str = str.replace("%level", RECV_ALL_NEED_VIP_LEVEL);
                    GlobalVar.comMsg.showMsg(str);
                }
            }
        }else{
            this.touchRandomCard();
        }
    },
    
    touchRandomCard: function () {
        this.clickCardSprite(null, Math.floor(Math.random() * 6));
    },

    initCardRewardView: function () {
        let MAX_CARD_COUNT = 6;
        for (let i = 1;i<MAX_CARD_COUNT;i++){
            this.spriteNodeList[i] = cc.instantiate(this.spriteNodeList[0]);
            this.node.getChildByName("nodeCenter").addChild(this.spriteNodeList[i]);
            this.spriteNodeList[i].getComponent(cc.Button).clickEvents[0].customEventData = i;
        }

        let gameEndData = GlobalVar.me().campData.getGameEndData().Win;
        let cardData = gameEndData.DrawItem;
        this.maxDrawCount = gameEndData.Star == 3?2:1;

        let labelTip = this.node.getChildByName("nodeBottom").getChildByName("labelDrawCardTip");
        labelTip.getComponent(cc.Label).string = gameEndData.Star == 3?"满星通关，可翻牌两次":"可翻牌一次";
        labelTip.runAction(cc.repeatForever(cc.sequence(cc.fadeIn(0.7), cc.fadeOut(0.7))));
        
        for (let i = 0; i < this.spriteNodeList.length; i++) {
            this.cardDrawState[i] = false;
            let itemData = this.spriteNodeList[i].getChildByName("ItemObject").getComponent("ItemObject").updateItem(cardData[i].ItemID, cardData[i].Count);
            this.spriteNodeList[i].getChildByName("ItemObject").getComponent("ItemObject").setClick(false);
            this.spriteNodeList[i].getChildByName("labelItemName").getComponent(cc.Label).string = itemData.strName;
        }
        this.canDrawCard = true;
    },

    clickCardSprite: function (event, index) {
        if (this.canDrawCard && this.curDrawCount < this.maxDrawCount && !this.cardDrawState[index]) {
            this.canDrawCard = false;
            this.clickIndex = index;
            // 发送消息
            // 接收到消息后再执行this.getDrawCardNtf();
            GlobalVar.handlerManager().campHandler.sendDrawRewardReq(index);
        }
    },

    getDrawCardNtf: function (data) {
        if (data.ErrCode != GameServerProto.PTERR_SUCCESS){
            GlobalVar.comMsg.errorWarning(data.ErrCode);
            setTimeout(() => {
                GlobalVar.sceneManager().gotoScene(SceneDefines.MAIN_STATE);
            }, 1500);
            return;
        }
        this.curDrawCount = data.OK.DrawCount;

        if (this.curDrawCount < this.maxDrawCount){
            GlobalVar.soundManager().playEffect('cdnRes/audio/battle/effect/turn_card');
            let self = this;
            let scale1 = cc.scaleTo(0.25, 0, 1);
            let index = self.clickIndex;
            let callFun = cc.callFunc(() => {
                self.spriteNodeList[index].getChildByName("spriteCard").getComponent("RemoteSprite").setFrame(0);
                self.spriteNodeList[index].getChildByName("ItemObject").active = true;
                self.spriteNodeList[index].getChildByName("labelItemName").active = true;
            })
            let scale2 = cc.scaleTo(0.25, 1, 1);
            this.spriteNodeList[index].runAction(cc.sequence(scale1, callFun, scale2));
            this.canDrawCard = true;
            this.cardDrawState[index] = true;
        } else if (this.curDrawCount == this.maxDrawCount){
            GlobalVar.soundManager().playEffect('cdnRes/audio/battle/effect/turn_card');
            let self = this;
            for (let i = 0; i < this.cardDrawState.length; i++) {
                let index = i;
                if (index == this.clickIndex){
                    let scale1 = cc.scaleTo(0.25, 0, 1);
                    let callFun = cc.callFunc(() => {
                        self.spriteNodeList[index].getChildByName("spriteCard").getComponent("RemoteSprite").setFrame(0)
                        self.spriteNodeList[index].getChildByName("ItemObject").active = true;
                        self.spriteNodeList[index].getChildByName("labelItemName").active = true;
                    });
                    let scale2 = cc.scaleTo(0.25, 1, 1);
                    this.spriteNodeList[index].runAction(cc.sequence(scale1, callFun, scale2));
                    this.cardDrawState[index] = true;
                }else if (!this.cardDrawState[index]){
                    let scale1 = cc.scaleTo(0.25, 0, 1);
                    let callFun = cc.callFunc(() => {
                        self.spriteNodeList[index].getChildByName("spriteCard").getComponent("RemoteSprite").setFrame(1)
                        self.spriteNodeList[index].getChildByName("ItemObject").active = true;
                        self.spriteNodeList[index].getChildByName("labelItemName").active = true;
                    });
                    let scale2 = cc.scaleTo(0.25, 1, 1);
                    let delay = cc.delayTime(0.5);
                    this.spriteNodeList[index].runAction(cc.sequence(delay, scale1, callFun, scale2));
                }
            }

            this.canQuitUIBattleCard = true;
            this.node.getChildByName("nodeBottom").getChildByName("nodeButton").active = true;
            this.node.getChildByName("nodeBottom").getChildByName("labelDrawCardTip").active = false;
        }
    },

    getFreeDrawCardNtf: function (data) {
        // let repeatTimes = 5;
        // let curReapeatTime = 0;
        console.log("收到freedraw消息");
        let self = this;
        for (let i = 0; i < this.cardDrawState.length; i++) {
            let index = i;
            if (!this.cardDrawState[index]){
                let scale1 = cc.scaleTo(0.25, 0, 1);
                let callFun = cc.callFunc(() => {
                    self.spriteNodeList[index].getChildByName("spriteCard").getComponent("RemoteSprite").setFrame(0)
                });
                // let callFun2 = cc.callFunc(()=>{
                //     self.spriteNodeList[index].getChildByName("spriteCard").getComponent("RemoteSprite").setFrame(2)
                //     self.spriteNodeList[index].getChildByName("ItemObject").active = false;
                //     self.spriteNodeList[index].getChildByName("labelItemName").active = false;
                // })
                let scale2 = cc.scaleTo(0.25, 1, 1);
                let delay = cc.delayTime(0.5);
                this.spriteNodeList[index].runAction(cc.sequence(delay, scale1, callFun, scale2).easing(cc.easeSineOut()));
            }
        }
        this.canClickedRecvBtn = false;
        let nodeButton = this.node.getChildByName("nodeBottom").getChildByName("nodeButton");
        nodeButton.getChildByName("nodeShare").active = false;
        nodeButton.getChildByName("nodeVip").active = false;
        nodeButton.getChildByName("btnRecvNew").active = false;
        nodeButton.getChildByName("btnRecv").active = true;
    },

});