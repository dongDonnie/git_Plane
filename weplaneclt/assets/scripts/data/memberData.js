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
        this.mixDriveHotFlag = false;
        this.memberLevel = 0;
        this.memberQuality = 0;
        this.isLevelUp = false;
        this.isQualityUp = false;
        this.showCombatLate = false;
        this.oneTimeChuZhanMemberID = 0;
        this.assistFighterID = 0;
        this.memberPieceCrystal = 0;
        this.memberEquipSelectSlotInBag = -1;
        this.roughComposeHotFlag = [false, false, false];
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
        this.updateMixDriveHotPoint();
        this.updateRoughComposeHotPoint();
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_MEMBER_FLAG_CHANGE);
    },

    updateMixDriveHotPoint: function () {
        let mixOpenData = GlobalVar.tblApi.getData('TblMix');
        let restMemberNum = this.getRestMemberIDList().length;
        this.mixDriveHotFlag = false;
        for (let i = 0; i < 4; i++) {
            if (GlobalVar.me().level >= mixOpenData[i + 1].wLevelReq) {
                let mixMemberId = this.getMixMemberIDByIndex(i);
                if (!mixMemberId && restMemberNum > 0) {
                    this.mixDriveHotFlag = true;
                    break;
                }
            }
        }
    },

    getHotPointData: function () {
        let flag = false;
        for (let i in this.totalHotFlag) {
            flag = flag || this.totalHotFlag[i];
        }
        return flag;
    },

    getStandingByFighterHotPointData: function () {
        let flag = false;
        for (let i in this.unLockHotFlag) {
            flag = flag || this.unLockHotFlag[i];
        }
        let standingByFighterID = this.getStandingByFighterID();
        flag = flag || this.qualityUpHotFlag[standingByFighterID];
        flag = flag || this.levelUpHotFlag[standingByFighterID];
        flag = flag || this.mixDriveHotFlag;
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

    getOneTimeChuZhanMemberID: function () {
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

    setAssistFighterID: function (id) {
        this.assistFighterID = typeof id !== 'undefined' ? id : 0;
    },

    getAssistFighterID: function () {
        return this.assistFighterID;
    },

    saveMemberEquipQualityUp: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS) {

        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_MEMBER_EQUIP_QUALITYUP_NTF, data);
    },

    saveMemberEquipLevelUp: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS) {
            GlobalVar.me().setXingBi(data.OK.XingBi);
            let memberData = this.getMemberByID(data.OK.MemberID);
            if (!!memberData) {
                for (let key in memberData.Equips) {
                    if (memberData.Equips[key].Slot == data.OK.Equip.Slot) {
                        memberData.Equips[key] = data.OK.Equip;
                        break;
                    }
                }
            }
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_MEMBER_EQUIP_LEVELUP_NTF, data);
    },

    saveMemberEquipPuton: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS) {
            let memberData = this.getMemberByID(data.OK.MemberID);
            if (!!memberData) {
                let isEmpty = true;
                for (let key in memberData.Equips) {
                    if (memberData.Equips[key].Slot == data.OK.OnEquip.Slot) {
                        memberData.Equips[key] = data.OK.OnEquip;
                        isEmpty = false;
                        break;
                    }
                }
                if (isEmpty) {
                    memberData.Equips.push(data.OK.OnEquip);
                }
            }
        }
        this.memberEquipSelectSlotInBag = -1;
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_MEMBER_EQUIP_PUTON_NTF, data);
    },

    saveMemberPieceCrystal: function (msgId, msg) { //msgId: GameServerProto.GMID_MEMBER_PIECE_CRYSTAL_NTF
        this.memberPieceCrystal = msg.data.PieceCrystal;
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_MEMBER_PIECE_CRYSTAL_NTF);
    },

    saveRefreshData: function (msgId, msg) { //msgId: GameServerProto.GMID_STORE_REFRESH_ACK
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_MEMBER_STORE_DATA, msg.data);
    },

    saveBuyData: function (msgId, msg) { //msgId: GameServerProto.GMID_STORE_BUY_ACK
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_MEMBER_STORE_FRESH, msg.data);
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_MEMBER_PIECE_CHANGE_NTF);
    },

    saveMemberStoreData: function (msg) { //msgId: GameServerProto.GMID_STORE_DATA_ACK
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_MEMBER_STORE_DATA, msg.data);
    },

    savePieceBreakData: function (msgId, msg) { //msgId: GameServerProto.GMID_MEMBER_PIECE_BREAK_ACK
        if (msg.data.ErrCode == GameServerProto.PTERR_SUCCESS) {
            this.memberPieceCrystal = msg.data.PieceCryStal;
            GlobalVar.me().bagData.updateItemDataByGMDT_ITEM_CHANGE(msg.data.ItemChange);
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_MEMBER_PIECE_DATA, msg.data);
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_MEMBER_PIECE_CHANGE_NTF);
    },

    saveMemberPieceData: function (msg) { //msgId: GameServerProto.GMID_MEMBER_PIECE_DATA_ACK
        if (msg.data.ErrCode == GameServerProto.PTERR_SUCCESS) {
            this.memberPieceCrystal = msg.data.PieceCryStal;
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_MEMBER_PIECE_DATA, msg.data);
    },

    saveActiveData: function (msg) {
        if (msg.data.ErrCode == 0) {
            this.pushMemberData(msg.data.OK.Member);
            GlobalVar.me().bagData.updateItemDataByGMDT_ITEM_CHANGE(msg.data.OK.ItemChange);
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_MEMBER_ACTIVE_NTF, msg);
    },

    saveStandingByData: function (msg) {
        if (msg.data.ErrCode == 0) {
            this.standingbyData.ChuZhanConf.ChuZhanMemberID = msg.data.Conf.ChuZhanMemberID;
            this.standingbyData.ChuZhanConf.MixMember1ID = msg.data.Conf.MixMember1ID;
            this.standingbyData.ChuZhanConf.MixMember2ID = msg.data.Conf.MixMember2ID;
            this.standingbyData.ChuZhanConf.MixMember3ID = msg.data.Conf.MixMember3ID;
            this.standingbyData.ChuZhanConf.MixMember4ID = msg.data.Conf.MixMember4ID;
            this.standingbyData.ChuZhanConf.MysteryID = msg.data.Conf.MysteryID;
            this.updateHotPoint();
        }
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
                if (this.getStandingByFighterID() == data.MemberID) {
                    this.showCombatLate = true;
                }
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

    setMixDriveData: function (data) {
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_MIXDRIVE_DATA);
    },

    setMixDriveLevelNtf: function (data) {
        this.standingbyData.Level = data.MixLevel;
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_MIXDRIVE_LEVEL_NTF, data);
    },

    getMixLevel: function () {
        return this.standingbyData.Level;
    },

    // idx: 0~3
    getMixMemberIDByIndex: function (idx) {
        return this.standingbyData.ChuZhanConf['MixMember' + (idx + 1) + 'ID'];
    },

    getRestMemberIDList: function () {
        let list = [];
        for (let i = 0; i < this.memberData.length; i++) {
            if (this.memberData[i].MemberID == this.standingbyData.ChuZhanConf.ChuZhanMemberID) continue;
            if (this.memberData[i].MemberID == this.standingbyData.ChuZhanConf.MixMember1ID) continue;
            if (this.memberData[i].MemberID == this.standingbyData.ChuZhanConf.MixMember2ID) continue;
            if (this.memberData[i].MemberID == this.standingbyData.ChuZhanConf.MixMember3ID) continue;
            if (this.memberData[i].MemberID == this.standingbyData.ChuZhanConf.MixMember4ID) continue;
            list.push(this.memberData[i].MemberID);
        }
        return list;
    },

    isMemberInMix: function (memberID) {
        for (let i = 0; i < 4; i++) {
            if (this.getMixMemberIDByIndex(i) == memberID) return i;
        }
        return -1;
    },

    getMixDriveHotFlag: function () {
        return this.mixDriveHotFlag;
    },

    saveRoughComposeData: function (msg) {
        if (msg.ErrCode == 0) {
            this.updateRoughComposeHotPoint();
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_YUANSHI_COMPOSE_ACK, msg);
    },

    getRoughComposeHotFlagByPos: function (pos) {
        return this.roughComposeHotFlag[pos];
    },

    getRoughComposeHotPoint: function () {
        for (let i = 0; i < this.roughComposeHotFlag.length; i++) {
            if (this.roughComposeHotFlag[i]) {
                return true;
            }
        }
        return false;
    },

    updateRoughComposeHotPoint: function () {
        this.roughComposeHotFlag = [false, false, false];
        let tabObj = GlobalVar.tblApi.getData('TblYuanShiCompose');
        for (let key in tabObj) {
            let data = tabObj[key];
            let pos = data.byTab - 1;
            if (!this.roughComposeHotFlag[pos]) {
                let nowChipCount = GlobalVar.me().bagData.getItemCountById(data.stItem.wItemID);
                let needChipCount = data.stItem.nCount;
                let nowResCount = GlobalVar.me().bagData.getItemCountById(data.stSpecialItem.wItemID);
                let needResCount = data.stSpecialItem.nCount;
                if (nowChipCount >= needChipCount && nowResCount >= needResCount) {
                    this.roughComposeHotFlag[pos] = true;
                }
            }
        }
    },


    setMasteryLevelUpAck: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS) {
            let member = this.getMemberByID(data.MemberID);
            for (let i = 0; i < member.Special.length; i++) {
                if (member.Special[i].ID == data.SpecialID) {
                    member.Special[i].Level = data.SpecialLevel;
                    break;
                }
            }
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_MEMBER_SPECIAL_LEVELUP_ACK, data);
    },

    setMasteryQualityUpAck: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS) {
            let member = this.getMemberByID(data.MemberID);
            for (let i = 0; i < member.Special.length; i++) {
                if (member.Special[i].ID == data.SpecialID) {
                    member.Special[i].Quality = data.SpecialQuality;
                    break;
                }
            }
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_MEMBER_SPECIAL_LEVELUP_ACK, data);
    },

    setRebirthAck: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS) {
            GlobalVar.me().setDiamond(data.Diamond);
            GlobalVar.me().setGold(data.Gold);
            GlobalVar.me().bagData.updateItemDataByGMDT_ITEM_CHANGE(data.ItemChange);
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_MEMBER_REBIRTH_ACK, data);
    },
});

module.exports = memberData;