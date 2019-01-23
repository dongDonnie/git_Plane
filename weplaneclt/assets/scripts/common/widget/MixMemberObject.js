const UIBase = require("uibase");
const GameServerProto = require("GameServerProto");
const GlobalVar = require('globalvar')
const WndTypeDefine = require("wndtypedefine");
const EventMsgID = require("eventmsgid");
const CommonWnd = require("CommonWnd");
const WindowManager = require("windowmgr");
const i18n = require('LanguageData');
const weChatAPI = require("weChatAPI");
const GlobalFunc = require('GlobalFunctions');

cc.Class({
    extends: UIBase,

    properties: {
        nodeItemObject: {
            default: null,
            type: cc.Node,
        },
        labelName: {
            default: null,
            type: cc.Label
        },
        labelCombat: {
            default: null,
            type: cc.Label
        },
        btnSelect: {
            default: null,
            type: cc.Node,
        },
        btnDischarge: {
            default: null,
            type: cc.Node,
        },
    },

    onLoad () {},

    updateMemberInfo: function (seatIdx, memberId) {
        this.memberId = memberId;
        this.seatIdx = seatIdx;

        let itemObj = this.nodeItemObject.getComponent("ItemObject");
        itemObj.updateItem(memberId);
        itemObj.setSpritePieceVisible(false);
        itemObj.setClick(false);

        let member = GlobalVar.me().memberData.getMemberByID(memberId);
        this.labelCombat.string = member.Combat;

        let id = member.MemberID;
        let quality = member.Quality;
        let fighterData = GlobalVar.tblApi.getDataBySingleKey('TblMember', id);
        let key = id + '_' + quality;
        let qualityData = GlobalVar.tblApi.getDataBySingleKey('TblMemberQuality', key);
        this.labelName.string = fighterData.strName + ' ' + qualityData.strQualityDisplay;
        this.labelName.node.color = GlobalFunc.getCCColorByQuality(quality);

        let mixMemberId = GlobalVar.me().memberData.getMixMemberIDByIndex(this.seatIdx);
        if (mixMemberId === memberId) {  // 已上阵
            this.btnSelect.active = false;
            this.btnDischarge.active = true;
        } else {            
            this.btnSelect.active = true;
            this.btnDischarge.active = false;
        }
    },

    onSelectBtnClick: function () {
        let conf = GlobalVar.me().memberData.getStandingByFighterConf();
        let confEdit = JSON.parse(JSON.stringify(conf));
        confEdit['MixMember' + (this.seatIdx + 1) + 'ID'] = this.memberId;
        GlobalVar.handlerManager().memberHandler.sendStandingByReq(confEdit.ChuZhanMemberID, confEdit.MixMember1ID, confEdit.MixMember2ID, confEdit.MixMember3ID, confEdit.MixMember4ID, confEdit.MysteryID);
    },

    onDisChargeBtnClick: function () {
        let conf = GlobalVar.me().memberData.getStandingByFighterConf();
        let confEdit = JSON.parse(JSON.stringify(conf));
        confEdit['MixMember' + (this.seatIdx + 1) + 'ID'] = 0;
        GlobalVar.handlerManager().memberHandler.sendStandingByReq(confEdit.ChuZhanMemberID, confEdit.MixMember1ID, confEdit.MixMember2ID, confEdit.MixMember3ID, confEdit.MixMember4ID, confEdit.MysteryID);
    }
});
