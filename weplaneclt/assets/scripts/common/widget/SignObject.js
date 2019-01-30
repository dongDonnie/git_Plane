const UIBase = require("uibase");
const GlobalVar = require('globalvar')

const DayLabel = ['一', '二', '三', '四', '五', '六', '七'];
cc.Class({
    extends: UIBase,

    properties: {
        btnRecv: {
            default: null,
            type: cc.Button,
        },
        btnResign: {
            default: null,
            type: cc.Button,
        },
        btnBan: {
            default: null,
            type: cc.Button,
        },
        spriteRecvd: {
            default: null,
            type: cc.Node,
        },
        labelDayNum: {
            default: null,
            type: cc.Label,
        },
        nodeItems: {
            default: null,
            type: cc.Node,
        },
        data: {
            default: null,
            visible: false,
        },
    },

    onLoad () {

    },

    updateDayInfo: function (data) {
        this.data = data;
        this.node.opacity = 255;

        this.labelDayNum.string = '第' + DayLabel[data.byDay - 1]+ '天';
        this.updateItemInfo();
        this.updateButton();
    },

    updateItemInfo: function () {
        let len = this.data.oVecReward.length;
        len > 3 && (len = 3);
        for (let i = 0; i < len; i++) {
            let rewardData = this.data.oVecReward[i];
            let itemObj = this.nodeItems.children[i];
            itemObj.active = true;
            itemObj.getComponent("ItemObject").updateItem(rewardData.wItemID, rewardData.nCount);
            itemObj.getComponent("ItemObject").setClick(true, 2);
        }
    },

    updateButton: function () {
        let today = GlobalVar.me().signData.getToday();
        if (GlobalVar.me().signData.isDaySigned(this.data.byDay)) {  // 已领取
            this.btnRecv.node.active = false;
            this.btnResign.node.active = false;
            this.btnBan.node.active = false;
            this.spriteRecvd.active = true;
        } else if (this.data.byDay < today) {  // 补签
            this.btnRecv.node.active = false;
            this.btnResign.node.active = true;
            this.btnBan.node.active = false;
            this.spriteRecvd.active = false;
            if (this.meetVipCondition(this.data.byVIPLevel)) {
                this.btnResign.node.getChildByName('common_ad_icon').active = false;
                this.btnResign.getComponent('ButtonObject').textLabel = '补签';
            } else {
                this.btnResign.node.getChildByName('common_ad_icon').active = true;
                this.btnResign.getComponent('ButtonObject').textLabel = '  补签';
            }
        } else if (this.data.byDay == today) {  // 领取
            this.btnRecv.node.active = true;
            this.btnResign.node.active = false;
            this.btnBan.node.active = false;
            this.spriteRecvd.active = false;
        } else {  // 未完成
            this.btnRecv.node.active = false;
            this.btnResign.node.active = false;
            this.btnBan.node.active = true;
            this.spriteRecvd.active = false;
        }
    },

    onSignBtnClick: function (event) {
        let self = this;
        let platformApi = GlobalVar.getPlatformApi();
        let doubleFlag = GlobalVar.me().signData.getDoubleFlag();
        doubleFlag = doubleFlag ? 1 : 0;
        console.log("doubleFlag:", doubleFlag);
        if (platformApi) {
            if (this.meetVipCondition(this.data.byVIPLevel)) {  // 满足vip玩家获得双倍奖励
                // GlobalVar.handlerManager().signHandler.sendSignReq(this.data.byDay, 1);
                GlobalVar.handlerManager().signHandler.sendSignReq(this.data.byDay);
            } else {
                if (doubleFlag && GlobalVar.getShareControl() == 1) {
                    platformApi.shareNormal(127, function () {
                        GlobalVar.handlerManager().signHandler.sendSignReq(self.data.byDay, 1);
                    });
                } else {
                    GlobalVar.handlerManager().signHandler.sendSignReq(self.data.byDay);
                }
            }
        } else {
            GlobalVar.handlerManager().signHandler.sendSignReq(this.data.byDay, doubleFlag);
        }
    },

    onResignBtnClick: function (event) {
        let self = this;
        let platformApi = GlobalVar.getPlatformApi();
        if (platformApi) {
            if (this.meetVipCondition(this.data.byVIPLevel)) {
                GlobalVar.handlerManager().signHandler.sendSignReq(this.data.byDay);
            } else {
                platformApi.showRewardedVideoAd(227, function () {
                    GlobalVar.handlerManager().signHandler.sendSignReq(self.data.byDay);
                });
            }
        } else {
            GlobalVar.handlerManager().signHandler.sendSignReq(this.data.byDay);
        }
    },

    meetVipCondition: function (cond) {
        return GlobalVar.me().vipLevel >= cond;
    }

    // update (dt) {},
});
