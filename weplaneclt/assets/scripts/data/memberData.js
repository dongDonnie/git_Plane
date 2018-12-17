const GlobalVar = require('globalvar');
const EventMsgID = require("eventmsgid");
const GameServerProto = require("GameServerProto");

const EquipType = {
    E_MAIN_WEAPON: 1,
    E_AUX_WEAPON: 2,
    E_ARMOR: 3,
    E_SHIELD: 4,
    E_ZHUANGJIA: 5,
    E_JIJIA: 6,
    E_ET_COUNT: 6,
};

const SmelterPanelType = {
    E_PT_EQUIP_SPLIT: 0,
    E_PT_EQUIP_REBIRTH: 1,
    E_PT_GUAZAI_SPLIT: 2,
    E_PT_GUAZAI_REBIRTH: 3,
    E_PT_PLANE_REBIRTH: 4,
};

const EquipStatus = {
    E_ES_NONE: 0,
    E_ES_EQUIPED: 1,
    E_ES_CAN_LEVELUP: 2,
    E_ES_CAN_QUALITY_UP: 3,
    E_ES_CAN_UPGRADE: 4,
    E_ES_CAN_EQUIP: 5,
    E_ES_CAN_STAR: 6,
    E_ES_COUNT: 7,
};

const DriveType = {
    E_STANDBY: -1,
    E_CORE: 0,
    E_DRIVE_1: 1,
    E_DRIVE_2: 2,
    E_DRIVE_3: 3,
    E_DRIVE_4: 4,
};

var memberData = cc.Class({
    ctor: function () {
        this.memberData = [];
        this.memberProps = [];
        this.standingbyData = {};
        this.totalHotFlag = {};
        this.unLockHotFlag = {};
        this.qualityUpHotFlag = {};
        this.levelUpHotFlag = {};
        this.memberLevel = 0;
        this.memberQuality = 0;
        this.isLevelUp = false;
        this.isQualityUp = false;
        this.showCombatLate = false;
        this.oneTimeChuZhanMemberID = 0;
        this.assistFighterID=0;
    },

    setMemberData: function (data) {
        this.memberData = data;

        this.updateHotPoint();
        this.calcAllMemberProp();
    },

    updateHotPoint: function () {
        let memberTblData = GlobalVar.tblApi.getData('TblMember');
        for (let i in memberTblData) {
            this.unLockHotFlag[i] = false;
            this.qualityUpHotFlag[i] = false;
            this.levelUpHotFlag[i] = false;
            let memberData = this.getMemberByID(i);
            if (!memberData) {
                let unLockPieceID = memberTblData[i].wGetPieceID;
                let unLockPieceCount = memberTblData[i].nGetPieceNumber;
                let count = GlobalVar.me().bagData.getItemCountById(unLockPieceID);
                if (count >= unLockPieceCount) {
                    this.unLockHotFlag[i] = true;
                }
            } else {
                let qualityUpData = GlobalVar.tblApi.getDataByMultiKey('TblMemberQuality', i, memberData.Quality);
                let qualityUpPieceID = qualityUpData.wQualityUpPiece;
                let qualityUpPieceCount = qualityUpData.nQualityUpNumber;
                let count = GlobalVar.me().bagData.getItemCountById(qualityUpPieceID);
                if (count >= qualityUpPieceCount) {
                    this.qualityUpHotFlag[i] = true;
                }
                if (qualityUpData.wQualityUpLevel > GlobalVar.me().level || memberData.Quality == 520) {
                    this.qualityUpHotFlag[i] = false;
                }

                let levelUpNeedExp = this.getMemberLevelUpNeedExpByMemberID(i) - memberData.Exp;
                let levelLimit = GlobalVar.me().level * 2;
                let canProvideExp = 0
                for (let j = 501; j <= 504; j++) {
                    let expItemCount = GlobalVar.me().bagData.getItemCountById(j);
                    let expItemValue = GlobalVar.tblApi.getDataBySingleKey('TblItem', j).nResult;
                    canProvideExp += expItemCount * expItemValue;
                }
                this.levelUpHotFlag[i] = canProvideExp >= levelUpNeedExp && memberData.Level < levelLimit;
            }
            this.totalHotFlag[i] = this.unLockHotFlag[i] || this.qualityUpHotFlag[i] || this.levelUpHotFlag[i];
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_MEMBER_FLAG_CHANGE);
    },

    getHotPointData: function () {
        let flag = false;
        for (let i in this.totalHotFlag) {
            flag = flag || this.totalHotFlag[i];
        }
        return flag;
    },

    setStandingByData: function (data) {
        this.standingbyData = data;
    },

    pushMemberData: function (data) {
        this.memberData.push(data);

        this.memberProps.push(this.calcMemberPropByMemberID(data.MemberID));
    },

    changeMemberData: function (data) {
        let index = this.getMemberIndexByID(data.MemberID);
        this.memberProps[index] = this.calcMemberPropByMemberID(data.MemberID);
        this.memberData[index] = data;
        this.updateHotPoint();
    },

    getMemberByID: function (id) {
        for (let i = 0; i < this.memberData.length; i++) {
            if (this.memberData[i].MemberID == id) {
                return this.memberData[i];
            }
        }
        return null;
    },

    // getMemberPropByID: function (id) {
    //     let memberProp = {};
    //     let memberData = this.getMemberByID(id);
    //     let levelData = GlobalVar.tblApi.getDataBySingleKey('TblMemberLevel', memberData.MemberID);

    // },

    getMemberIndexByID: function (id) {
        for (let i = 0; i < this.memberData.length; i++) {
            if (this.memberData[i].MemberID == id) {
                return i;
            }
        }
        return -1;
    },

    setOneTimeChuZhanMemberID: function (id) {
        this.oneTimeChuZhanMemberID = typeof id !== 'undefined' ? id : 0;
    },

    getOneTimeChuZhanMemberID:function(){
        return this.oneTimeChuZhanMemberID;
    },

    getStandingByFighterID: function () {
        if (this.oneTimeChuZhanMemberID != 0) {
            return this.oneTimeChuZhanMemberID;
        }
        return this.standingbyData.ChuZhanConf.ChuZhanMemberID;
    },

    getStandingByFighterConf: function () {
        return this.standingbyData.ChuZhanConf;
    },

    setAssistFighterID:function(id){
        this.assistFighterID=typeof id !== 'undefined' ? id : 0;
    },

    getAssistFighterID:function(){
        return this.assistFighterID;
    },

    saveActiveData: function (msg) {
        if (msg.data.ErrCode == 0) {
            this.pushMemberData(msg.data.OK.Member);
            GlobalVar.me().bagData.updateItemDataByGMDT_ITEM_CHANGE(msg.data.OK.ItemChange);
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_MEMBER_ACTIVE_NTF, msg);
    },

    saveStandingByData: function (msg) {
        this.standingbyData.ChuZhanConf.ChuZhanMemberID = msg.data.Conf.ChuZhanMemberID;
        this.standingbyData.ChuZhanConf.MixMember1ID = msg.data.Conf.MixMember1ID;
        this.standingbyData.ChuZhanConf.MixMember2ID = msg.data.Conf.MixMember2ID;
        this.standingbyData.ChuZhanConf.MixMember3ID = msg.data.Conf.MixMember3ID;
        this.standingbyData.ChuZhanConf.MixMember4ID = msg.data.Conf.MixMember4ID;
        this.standingbyData.ChuZhanConf.MysteryID = msg.data.Conf.MysteryID;
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_MEMBER_STANDINGBY_NTF, msg);
    },

    saveLevelUpData: function (msg) {
        if (msg.data.ErrCode == 0) {
            var data = msg.data.OK.Member;
            // let index = this.getMemberByID(data.MemberID);
            this.memberLevel = this.getMemberByID(data.MemberID).Level;
            if (this.memberLevel < data.Level)
                this.isLevelUp = true;
            this.changeMemberData(data);
            GlobalVar.me().bagData.updateItemDataByGMDT_ITEM_CHANGE(msg.data.OK.ItemChange);
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_MEMBER_LEVELUP_NTF, msg);
    },

    saveQualityUpData: function (msg) {
        if (msg.data.ErrCode == 0) {
            var data = msg.data.OK.Member;
            // let index = this.getMemberByID(data.MemberID);
            this.memberQuality = this.getMemberByID(data.MemberID).Quality;
            if (this.memberQuality < data.Quality) {
                this.isQualityUp = true;
                this.showCombatLate = true;
            }
            this.changeMemberData(data);
            GlobalVar.me().bagData.updateItemDataByGMDT_ITEM_CHANGE(msg.data.OK.ItemChange);
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_MEMBER_QUALITYUP_NTF, msg);
    },

    calcAllMemberProp: function () {
        for (let i = 0; i < this.memberData.length; i++) {
            this.memberProps[i] = this.calcMemberPropByMemberID(this.memberData[i].MemberID);
        }
    },

    calcMemberPropByMemberID: function (memberID) {
        let memberData = this.getMemberByID(memberID);
        let allProps = {};

        let qualityData = GlobalVar.tblApi.getDataByMultiKey('TblMemberQuality', memberData.MemberID, memberData.Quality);
        let propQuaMemberData = qualityData.oVecPropAll;
        for (let i = 0; i < propQuaMemberData.length; i++) {
            // addPropValue(propQuaMemberData[i]);
            let prop = propQuaMemberData[i];
            allProps[prop.wPropID] = (allProps[prop.wPropID] || 0) + prop.nAddValue;
        }

        let levelData = GlobalVar.tblApi.getDataBySingleKey('TblMemberLevel', memberData.MemberID);
        ///////////////新的计算方式
        let index = 0;
        if (memberData.Level > levelData[index].wLevelMax) {
            index = 1;
        }
        let planePower = levelData[index].wPropVar1 * memberData.Level + levelData[index].wPropVar2;
        allProps[GameServerProto.PTPROP_HP] = (allProps[GameServerProto.PTPROP_HP] || 0) + Math.round(planePower / 6);
        allProps[GameServerProto.PTPROP_Attack] = (allProps[GameServerProto.PTPROP_Attack] || 0) + Math.round(planePower / 30);
        allProps[GameServerProto.PTPROP_Defence] = (allProps[GameServerProto.PTPROP_Defence] || 0) + Math.round(planePower / 30);

        return allProps;
    },
    getMemberLevelUpNeedExpByMemberID: function (memberID) {
        let memberData = this.getMemberByID(memberID);

        let levelData = GlobalVar.tblApi.getDataBySingleKey('TblMemberLevel', memberData.MemberID);
        let index = 0;
        if (memberData.Level > levelData[index].wLevelMax) {
            index = 1;
        }
        let levelUpNeedExp = parseInt(Math.pow(memberData.Level, levelData[index].dUpNeedExpVar1)) + memberData.Level * levelData[index].wUpNeedExpVar2 + levelData[index].wUpNeedExpVar3;

        let str = levelUpNeedExp + "";
        let cut = str.length - 2;
        if (cut < 1) {
            cut = 1;
        }
        if (cut > 4) {
            cut = 4;
        }
        levelUpNeedExp = (parseInt(levelUpNeedExp / Math.pow(10, cut)) + 1) * Math.pow(10, cut);

        return levelUpNeedExp;
    },

    getMemberPropByMemberID: function (memberID) {
        let memberIndex = this.getMemberIndexByID(memberID)
        return this.memberProps[memberIndex];
    },

    getIsLevelUp: function () {
        if (this.isLevelUp) {
            this.isLevelUp = false;
            return true;
        }
        return false
    },

    getIsQualityUp: function () {
        if (this.isQualityUp) {
            this.isQualityUp = false;
            return true;
        }
        return false
    },

    getShowCombatLate: function () {
        if (this.showCombatLate) {
            this.showCombatLate = false
            return true;
        }
        return false
    },
});

module.exports = memberData;