const GlobalVar = require("globalvar");
const WindowManager = require("windowmgr");
const WndTypeDefine = require("wndtypedefine");
const RootBase = require("RootBase");
const i18n = require('LanguageData');
const GameServerProto = require("GameServerProto");
const CommonWnd = require("CommonWnd");
const EventMsgID = require("eventmsgid");
const ResMapping = require('resmapping')

cc.Class({
    extends: RootBase,

    properties: {
        nodeInvitedPeople: {
            default: [],
            type: [cc.Sprite],
        },
        labelLeftTip: {
            default: null,
            type: cc.Label,
        },
        btnShare: {
            default: null,
            type: cc.Button,
        },
        labelRewardPrice: {
            default: null,
            type: cc.Label,
        },
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_INVITE_REWARD_WND;
        this.animeStartParam(0, 0);

        this.curInviteCount = null;
        this.inviteTicket = null;
        this.maxInviteCount = null;
        this.initRecvRewardFinish = false;
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
            // this.initRecvRewardFinish = false;
        }
    },

    registerEvent: function () {
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_INVITE_REWARD_DATA, this.getInviteRewardData, this);
    },

    initItemShow: function (data) {
        let itemDatas = null;
        let inviteRewardData = GlobalVar.tblApi.getDataBySingleKey("TblFuliInvite", GlobalVar.me().shareData.getInviteGiftBagState() + 1);
        itemDatas = inviteRewardData && inviteRewardData.oVecItems;
        if (itemDatas){
            for (let i = 0; i < 3; i++){
                if (itemDatas[i]){
                    this.node.getChildByName("nodeItemReward").getChildByName("ItemObject" + (i+1)).active = true;
                    this.node.getChildByName("nodeItemReward").getChildByName("ItemObject" + (i+1)).getComponent("ItemObject").updateItem(itemDatas[i].wItemID, itemDatas[i].nCount);
                    this.node.getChildByName("nodeItemReward").getChildByName("ItemObject" + (i+1)).getComponent("ItemObject").setClick(true, 2);
                }else{
                    this.node.getChildByName("nodeItemReward").getChildByName("ItemObject" + (i+1)).active = false;
                }
            }
            this.node.getChildByName("nodeLayout").active = true;
            this.labelRewardPrice.string = inviteRewardData.strName;
        }
    },
    initPlayHeader: function () {
        let self = this;
        let inviteGiftBagState = GlobalVar.me().shareData.getInviteGiftBagState() + 1;
        if (inviteGiftBagState >= GlobalVar.tblApi.getLength("TblFuliInvite")){
            self.initRecvReward();
            return;
        }
        let platformApi = GlobalVar.getPlatformApi();
        if (platformApi){
            platformApi.getInviteUserList("fuli_invite" + inviteGiftBagState, function(data){
                console.log("get invite data:", data);
                self.curInviteCount = data.total;
                self.inviteTicket = data.ticket;
                self.maxInviteCount = GlobalVar.tblApi.getDataBySingleKey("TblFuliInvite", GlobalVar.me().shareData.getInviteGiftBagState() + 1).nCond;
                for (let i = 0; i< data.total; i++){
                    if (i >= 3){
                        break;
                    }
                    if (data.list[i].avatar == ""){
                        let index = i;
                        GlobalVar.resManager().loadRes(ResMapping.ResType.SpriteFrame, 'cdnRes/common/common_default_head_img', function (frame) {
                            if (!self.nodeInvitedPeople[index]) return;
                            self.nodeInvitedPeople[index].spriteFrame = frame;
                        });
                    }else{
                        let url = data.list[i].avatar + "?a=a.png";
                        let index = i;
                        if (!self.nodeInvitedPeople[index]) return;
                        cc.loader.load(url, function (err, tex) {
                            if (err) {
                                cc.error("LoadURLSpriteFrame err." + url);
                                return;
                            }
                            let spriteFrame = new cc.SpriteFrame(tex);
                            self.nodeInvitedPeople[index].spriteFrame = spriteFrame;
                        })
                    }
                    self.nodeInvitedPeople[i].node.parent.getChildByName("spritePlus").active = false;
                }
                let leftNeed = self.maxInviteCount - self.curInviteCount;
                leftNeed = leftNeed>0?leftNeed:0;
                self.labelLeftTip.string = i18n.t('label.4000331').replace("%count", leftNeed);
                if (leftNeed == 0){
                    self.initRecvReward();
                }
                self.initRecvRewardFinish = true;
            });
        }
    },

    initRecvReward: function () {
        this.btnShare.interactable = true;
        if (GlobalVar.me().shareData.getInviteGiftBagState() >= GlobalVar.tblApi.getLength("TblFuliInvite")){
            this.btnShare.node.getComponent("ButtonObject").setText(i18n.t("label.4000333"));
            this.btnShare.node.getChildByName("spriteShare").active = false;
            this.btnShare.interactable = false;
        }else{
            this.btnShare.node.getComponent("ButtonObject").setText(i18n.t("label.4000332"));
            this.btnShare.node.getChildByName("spriteShare").active = false;
        }
    },

    resetRecvReward: function () {
        this.btnShare.interactable = true;
        this.btnShare.node.getComponent("ButtonObject").setText(i18n.t("label.4000335"));
        this.btnShare.node.getChildByName("spriteShare").active = true;
        for (let i = 0; i< this.nodeInvitedPeople.length; i++){
            this.nodeInvitedPeople[i].spriteFrame = "";
            this.nodeInvitedPeople[i].node.parent.getChildByName("spritePlus").active = true;
        }
    },

    onBtnShare: function () {
        if (this.maxInviteCount == null || !this.initRecvRewardFinish){
            return;
        }
        if (this.curInviteCount >= this.maxInviteCount){
            GlobalVar.handlerManager().shareHandler.sendInviteGiftBagReq(this.inviteTicket)
        }else{
            let platformApi = GlobalVar.getPlatformApi();
            if (platformApi){
                let param = "";
                param += "&from_serverid=" + GlobalVar.me().loginData.getLoginReqDataServerID();
                param += "&from_openid=" + GlobalVar.me().loginData.getLoginReqDataAccount();
                param += "&from_btn=" + "fuli_invite" + (GlobalVar.me().shareData.getInviteGiftBagState() + 1);
                platformApi.shareNormal(137, null, null, null, null, param);
            }
        }
    },

    getInviteRewardData: function (event) {
        if (event.ErrCode != GameServerProto.PTERR_SUCCESS){
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        CommonWnd.showTreasureExploit(event.Item);
        this.initItemShow();
        this.resetRecvReward();
        this.curInviteCount = null;
        this.inviteTicket = null;
        this.maxInviteCount = null;
        this.initRecvRewardFinish = false;
        this.initPlayHeader();
        // this.initRecvReward();
    },

    onBtnClose: function(){
        this.close();
    },

    enter: function (isRefresh) {
        if (isRefresh) {
            this._super(true);
            this.initItemShow();
            this.initPlayHeader();
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

    onDestroy: function () {

    },

});