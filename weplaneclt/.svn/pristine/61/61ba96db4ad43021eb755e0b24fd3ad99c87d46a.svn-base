
const RootBase = require("RootBase");
const WindowManager = require("windowmgr");
const GlobalVar = require('globalvar')
const WndTypeDefine = require("wndtypedefine");
const EventMsgID = require("eventmsgid");
const GameServerProto = require("GameServerProto");
const CommonWnd = require("CommonWnd");
const weChatAPI = require("weChatAPI");


cc.Class({
    extends: RootBase,

    properties: {
        feedbackScroll: {
            default: null,
            type: cc.ScrollView,
        },
        feedbackModel: {
            default: null,
            type: cc.Node,
        },
        labelInviteCount: {
            default: null,
            type: cc.Label,
        },
        nodeInvitedPeople: {
            default: null,
            type: cc.Node,
        }
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_FEEDBACK_WND;

        this.content = this.feedbackScroll.content;
        this.animeStartParam(0, 0);

        this.isFirstIn = true;
    },

    animeStartParam(paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            GlobalVar.eventManager().removeListenerWithTarget(this);
            WindowManager.getInstance().popView(false, null, false, false);
        } else if (name == "Enter") {
            this._super("Enter");
            this.registerEvent();
            this.node.getChildByName("nodeSCReward").active = true;

            let self = this;
            if (cc.sys.platform === cc.sys.WECHAT_GAME){
                weChatAPI.getInviteUserList("invite", function(data){
                    self.curInviteCount = data.total;
                    self.inviteTicket = data.ticket;
                    self.maxInviteCount = GlobalVar.tblApi.getDataBySingleKey('TblParam', GameServerProto.PTPARAM_FULI_CZ_INVITE_USER).dValue;
                    self.labelInviteCount.string = "（%d/%d）".replace("%d", data.total).replace("%d", self.maxInviteCount);
                    for (let i = 0; i< data.total; i++){
                        let url = data.list[i].avatar + "?a=a.png";
                        let index = i;
                        if (!self.nodeInvitedPeople.children[index]) return;
                        cc.loader.load(url, function (err, tex) {
                            if (err) {
                                cc.error("LoadURLSpriteFrame err." + url);
                                return;
                            }
                            let spriteFrame = new cc.SpriteFrame(tex);
                            self.nodeInvitedPeople.children[index].getComponent(cc.Sprite).spriteFrame = spriteFrame;
                        })
                    }
                });
            }
        }
    },

    registerEvent: function () {
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_FULI_BUY_RESULT, this.getFeedbackBuyResult, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_ITEM_USE_RESULT, this.getItemResult, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_FULI_SC_RESULT, this.getFuliSCResult, this);        
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_FULI_FEEDBACK_RESULT, this.saveFeedbackResult, this);
        GlobalVar.handlerManager().feedbackHandler.sendGetFeedbackDataReq();
    },

    enter: function (isRefresh) {
        if (isRefresh) {
            this._super(true);
        } else {
            this._super(false);
        }
    },

    escape: function (isRefresh) {
        if (isRefresh) {
            this._super(true);
        } else {
            this._super(false);
        }
    },

    initFuLiCZ: function () {
        let scID = 99;
        let scData = GlobalVar.tblApi.getDataBySingleKey('TblFuLiCZ', scID);
        this.node.getChildByName("labelSCPrice").getComponent(cc.Label).string = scData.nPrice
        let reward = scData.oVecItems;
        let scItemRewardChildren = this.node.getChildByName("nodeSCReward").children;
        for (let i = 0; i < reward.length; i++) {
            let itemObj = null;
            if (i == 0) {
                itemObj = scItemRewardChildren[0]
            } else {
                itemObj = cc.instantiate(scItemRewardChildren[0]);
                this.node.getChildByName("nodeSCReward").addChild(itemObj);
            }

            itemObj.opacity = 255;
            itemObj.getComponent("ItemObject").updateItem(reward[i].wItemID, reward[i].nCount);
            itemObj.getComponent("ItemObject").setClick(true, 2);
        }
    },

    updateFeedback: function (feedback, data) {
        feedback.data = data;
        feedback.x = 0;
        // feedback.active = true;
        // feedback.opacity = 255;
        feedback.x=(0);
        feedback.getChildByName("labelTitle").getComponent(cc.Label).string = data.strName;
        feedback.getChildByName("labelDesc").getComponent(cc.Label).string = data.strDesc;
        feedback.getChildByName("labelSpcePrice").getComponent(cc.Label).string = data.dwCondition;
        feedback.getChildByName("labelOriPrice").getComponent(cc.Label).string = data.nPrice;
        feedback.getChildByName("ItemObject").getComponent("ItemObject").updateItem(data.byID + 400);
        feedback.getChildByName("ItemObject").getComponent("ItemObject").setClick(true, 2);

        let dailyBuyState = GlobalVar.me().feedbackData.getFuliBuyStateByID(data.byID);
        // if (dailyBuyState && dailyBuyState[data.byID - 1]){
        if (dailyBuyState){
            feedback.getChildByName("btnBuy").active = false;
            feedback.getChildByName("spriteAlreadedGet").active = true;
        }else{
            feedback.getChildByName("btnBuy").active = true;
            feedback.getChildByName("spriteAlreadedGet").active = false;
        }
    },

    onFeedbackIconClick: function(event){
        let item = event.target;
        let feedback = item.parent;
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMALITEMINFO, function (wnd, name, type){
            wnd.getComponent(type).updateBoxInfo(item.getComponent("ItemObject").itemID, item.getComponent("ItemObject").itemData.wQuality, 0, "礼包详情", feedback.data);
        });
    },

    onBuyButtonClick: function (event, index) {
        let btnBuy = event.target;
        let feedback = btnBuy.parent;
        let buyId = index || feedback.data.byID;
        
        GlobalVar.handlerManager().feedbackHandler.sendBuyFuliFeedbackReq(buyId);
    },

    onRecvSCFuliBtnClick: function(event) {
        let isFree = 0, ticket = ""
        // if (this.curInviteCount >= this.maxInviteCount){
        //     isFree = 1;
        //     ticket = this.inviteTicket;
        // }
        // console.log("isFree:", isFree);
        // console.log("ticket:", ticket);
        GlobalVar.handlerManager().feedbackHandler.sendGetFuliSCReq(isFree, ticket);
    },

    saveFeedbackResult: function (event) {
        if (event.ErrCode && event.ErrCode !== GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }

        if (event.Flag){
            this.node.getChildByName("btnRecv").active = false;
            this.node.getChildByName("spriteAlreadedGet").active = true;     
        }else{
            this.node.getChildByName("btnRecv").active = true;
        }

        if (this.isFirstIn){
            this.isFirstIn = false;
            
            this.initFuLiCZ();

            let feedbackDataList = GlobalVar.tblApi.getData('TblFuLiCZ');
            let length = GlobalVar.tblApi.getLength("TblFuLiCZ");
            let showData = [];
            for (let i = 1; i <= length; i++) { // 遍历表，用表中数据初始化加成列表
                let feedbackData = feedbackDataList[i]
                if (!feedbackData) {
                    break;
                }
                showData.push(feedbackData);
            }

            let self = this;
            this.feedbackScroll.loopScroll.setTotalNum(showData.length);
            this.feedbackScroll.loopScroll.setCreateInterval(0);
            this.feedbackScroll.loopScroll.setCreateModel(this.feedbackModel);
            this.feedbackScroll.loopScroll.saveCreatedModel(this.content.children);
            this.feedbackScroll.loopScroll.registerUpdateItemFunc(function(feedback, index){
                self.updateFeedback(feedback, showData[index]);
            });
            this.feedbackScroll.loopScroll.registerCompleteFunc(function(){
                self.canClose = true;
            })
        }
        this.feedbackScroll.loopScroll.resetView();
    },

    getFeedbackBuyResult: function (event) {
        if (event.ErrCode && event.ErrCode !== GameServerProto.PTERR_SUCCESS) {
            if (event.ErrCode == GameServerProto.PTERR_FULI_NOT_COND){
                CommonWnd.showRechargeWnd();
            }else{
                GlobalVar.comMsg.errorWarning(event.ErrCode);
            }
            return;
        }

        this.feedbackScroll.loopScroll.refreshViewItem();
        let chest = event.Item[0];

        let confirm = function(){
            let itemData = GlobalVar.me().bagData.getItemById(chest.ItemID);
            GlobalVar.handlerManager().bagHandler.sendItemUseReq(itemData.Slot, itemData.Count, itemData.Type);
        };
        
        let scData = GlobalVar.tblApi.getDataBySingleKey('TblChest', chest.ItemID);
        let ovecItems = scData.oVecItems;
        CommonWnd.showRewardBoxWnd(null, "回馈宝箱", true, ovecItems, null, confirm, null, "领取");
    },

    getItemResult: function(event){
        if (event.ErrCode && event.ErrCode !== GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        CommonWnd.showTreasureExploit(event.GetItem);
    },

    getFuliSCResult: function(event) {
        if (event.ErrCode && event.ErrCode !== GameServerProto.PTERR_SUCCESS) {
            if (event.ErrCode == GameServerProto.PTERR_FULI_NOT_CZ){
                CommonWnd.showRechargeWnd();
            }else{
                GlobalVar.comMsg.errorWarning(event.ErrCode);
            }
            return;
        }

        this.node.getChildByName("btnRecv").active = false;
        this.node.getChildByName("spriteAlreadedGet").active = true;     
        CommonWnd.showTreasureExploit(event.Item);
    },


    onInvitedBtnClick: function(event) {
        if (cc.sys.platform === cc.sys.WECHAT_GAME){
            let param = {};
            param.fromServerID = GlobalVar.me().loginData.getLoginReqDataServerID();
            param.fromOpenID = GlobalVar.me().loginData.getLoginReqDataAccount();
            param.fromBtn = "invite";
            weChatAPI.shareInvite(1, param);
        }
    },

    onBtnClose: function(event){
        if(!!this.canClose){
            this.feedbackScroll.loopScroll.releaseViewItems();
            this.node.getChildByName("nodeSCReward").active = false;
            this.close();
        }
    },
});
