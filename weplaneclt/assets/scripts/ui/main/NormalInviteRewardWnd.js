const GlobalVar = require("globalvar");
const WindowManager = require("windowmgr");
const WndTypeDefine = require("wndtypedefine");
const RootBase = require("RootBase");
const i18n = require('LanguageData');
const GameServerProto = require("GameServerProto");

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
        }
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_INVITE_REWARD_WND;
        this.animeStartParam(0, 0);

        this.initItemShow();

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
            WindowManager.getInstance().popView();
        } else if (name == "Enter") {
            this._super("Enter");
            this.registerEvent();
        }
    },

    registerEvent: function () {
        // GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_ARENA_CHALLENGE_COUNT_FREE_GET_DATA, this.getArenaChallengeCountFreeGetData, this);
        // GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_ARENA_CHALLENGE_COUNT_BUY_DATA, this.getArenaChallengeCountBuyData, this);
    },

    initItemShow: function (data) {
        let itemDatas = [
            { ItemID: 1, Count: 100000},
            { ItemID: 3, Count: 300},
            { ItemID: 4, Count: 100},
        ]
        for (let i = 0; i < 3; i++){
            this.node.getChildByName("nodeItemReward").getChildByName("ItemObject" + (i+1)).getComponent("ItemObject").updateItem(itemDatas[i].ItemID, itemDatas[i].Count);
            this.node.getChildByName("nodeItemReward").getChildByName("ItemObject" + (i+1)).getComponent("ItemObject").setClick(true, 2);
        }
    },
    initPlayHeader: function () {
        let self = this;
        let platformApi = GlobalVar.getPlatformApi();
        if (platformApi){
            platformApi.getInviteUserList("fuli_invite", function(data){
                self.curInviteCount = data.total;
                self.inviteTicket = data.ticket;
                self.maxInviteCount = GlobalVar.tblApi.getDataBySingleKey('TblParam', GameServerProto.PTPARAM_FULI_SHARE_INVITE_COUNT_LIMIT).dValue;
                for (let i = 0; i< data.total; i++){
                    if (i >= 3){
                        break;
                    }
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
        if (GlobalVar.me().shareData.getInviteGiftBagState()){
            this.btnShare.node.getComponent("ButtonObject").setText("label.4000333");
            this.btnShare.node.getChildByName("spriteShare").active = false;
            this.btnShare.interactable = false;
        }else{
            this.btnShare.node.getComponent("ButtonObject").setText("label.4000332");
            this.btnShare.node.getChildByName("spriteShare").active = false;
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
                param += "&from_btn=" + "fuli_invite";
                platformApi.shareNormal(137, null, null, null, null, param);
            }
        }
    },

    onBtnClose: function(){
        this.close();
    },

    enter: function (isRefresh) {
        if (isRefresh) {
            this._super(true);
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