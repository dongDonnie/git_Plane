var HandlerBase = require("handlerbase")
var GlobalVar = require('globalvar')
var EventMsgID = require("eventmsgid")
var GameServerProto = require("GameServerProto");
const CommonWnd = require("CommonWnd");

var self = null;
cc.Class({
    extends: HandlerBase,

    ctor: function() {
        self = this;
    },

    initHandler: function(handlerMgr) {
        this.handlerMgr = handlerMgr;
        // handlerMgr.setKey(GameServerProto.GMID_GIFT_CARD_ACK,GameServerProto.GMID_GIFT_CARD_REQ);

        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_GIFT_CARD_ACK, self._recvGiftCardAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_ROLE_RENAME_ACK, self._recvReNameAck, self);
    },

    _recvGiftCardAck: function(msgId, msg){
        if (typeof msg != "object"){
            return;
        }

        // console.log("接收到的GiftCardAck消息！！！！！！！！！！！！！！！！！！！！！！！！！！", msg);
        ////因为现在还没有MainData数据落地，所以现在先临时直接使用State来判断激活码的问题///////////////
        ////因为现在还没有MainData数据落地，所以现在先临时直接使用State来判断激活码的问题///////////////
        ////因为现在还没有MainData数据落地，所以现在先临时直接使用State来判断激活码的问题///////////////

        let recSuccess = false;
        if (msg.data.ErrCode === 0){
            let status = msg.data.OK.Status;
            switch (status) {
                case 0:
                    GlobalVar.comMsg.showMsg("领取成功");
                    recSuccess = true;
                    break;
                case 1:
                    GlobalVar.comMsg.showMsg("缺少参数");
                    break;
                case 2:
                    GlobalVar.comMsg.showMsg("参数错误");
                    break;
                case 3:
                    GlobalVar.comMsg.showMsg("签名错误");
                    break;
                case 4:
                    GlobalVar.comMsg.showMsg("激活码错误");
                    break;
                case 5:
                    GlobalVar.comMsg.showMsg("激活码已过期");
                    break;
                case 6:
                    GlobalVar.comMsg.showMsg("该渠道不可使用");
                    break;
                case 7:
                    GlobalVar.comMsg.showMsg("该服务器不可使用");
                    break;
                case 11:
                    GlobalVar.comMsg.showMsg("激活码已使用");
                    break;
                case 12:
                    GlobalVar.comMsg.showMsg("激活码已使用");
                    break;
                case 16:
                    GlobalVar.comMsg.showMsg("您已领取过此类码奖励");
                    break;
                default:
                    break;
            }
        }
        else{
            GlobalVar.comMsg.showMsg("激活码错误");
        }
        ////因为现在还没有MainData数据落地，所以现在先临时直接使用State来判断激活码的问题///////////////
        ////因为现在还没有MainData数据落地，所以现在先临时直接使用State来判断激活码的问题///////////////
        ////因为现在还没有MainData数据落地，所以现在先临时直接使用State来判断激活码的问题////////////////////

        if (recSuccess){
            CommonWnd.showTreasureExploit(msg.data.OK.RewardItem);
            GlobalVar.me().bagData.updateItemDataByGMDT_ITEM_CHANGE(msg.data.OK.RewardItem);
        }
    },

    sendGiftCardSeq: function(giftCode){

        let msg = {
            Code : giftCode,
        };

        // console.log("发送GiftCard消息，激活码为:" + giftCode);
        
        self.sendMsg(GameServerProto.GMID_GIFT_CARD_REQ, msg);
    },    
    
    sendReNameReq: function (roleID, roleName, avatar) {
        let msg = {
            RoleID: roleID,
            RoleName: roleName,
            Avatar: avatar,
        };

        self.sendMsg(GameServerProto.GMID_ROLE_RENAME_REQ, msg);
    },

    _recvReNameAck: function (msgId, msg) {
        if (typeof msg!= "object"){
            return;
        }

        GlobalVar.me().mainData.setReNameData(msg.data);
    },

});
