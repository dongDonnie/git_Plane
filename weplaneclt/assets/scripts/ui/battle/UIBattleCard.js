
const UIBase = require("uibase");
const GlobalVar = require('globalvar')
const EventMsgID = require("eventmsgid");
const GameServerProto = require("GameServerProto");
const SceneDefines = require("scenedefines");
const weChatAPI = require("weChatAPI");

const RECV_CUR_REWARD = 0, RECV_ALL_REWARD = 1;

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

        if (!GlobalVar.getShareSwitch()){
            this.node.getChildByName("nodeBottom").getChildByName("nodeButton").getChildByName("btnRecv").active = true;
            this.node.getChildByName("nodeBottom").getChildByName("nodeButton").getChildByName("btnRecvNew").active = false;
            this.node.getChildByName("nodeBottom").getChildByName("nodeButton").getChildByName("btnRecvAll").active = false;
            this.node.getChildByName("nodeBottom").getChildByName("nodeButton").getChildByName("label").active = false;
        }else{
            this.node.getChildByName("nodeBottom").getChildByName("nodeButton").getChildByName("btnRecvNew").active = true;
            this.node.getChildByName("nodeBottom").getChildByName("nodeButton").getChildByName("btnRecv").active = false;
            this.node.getChildByName("nodeBottom").getChildByName("nodeButton").getChildByName("btnRecvAll").active = true;
            this.node.getChildByName("nodeBottom").getChildByName("nodeButton").getChildByName("label").active = true;
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
                weChatAPI.shareNormal(106, function() {
                    self.canClickedRecvBtn = true;
                    // console.log("发送freedraw消息");
                    GlobalVar.handlerManager().campHandler.sendFreeDrawReq();
                });
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
        this.node.getChildByName("nodeBottom").getChildByName("nodeButton").getChildByName("btnRecv").x = 0;
        this.node.getChildByName("nodeBottom").getChildByName("nodeButton").getChildByName("btnRecvAll").active = false;
        this.node.getChildByName("nodeBottom").getChildByName("nodeButton").getChildByName("label").active = false;
        this.node.getChildByName("nodeBottom").getChildByName("nodeButton").getChildByName("btnRecvNew").active = false;
        this.node.getChildByName("nodeBottom").getChildByName("nodeButton").getChildByName("btnRecv").active = true;
    },

});