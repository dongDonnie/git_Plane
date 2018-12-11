/**
 * 处理与公告相关的信息，讲其转换为数据
 */

const GlobalVar = require('globalvar');
const EventMsgID = require("eventmsgid");
const GameServerProto = require("GameServerProto");

var self = null;
var leaderData = cc.Class({

    properties: {
        data: null,
    },

    ctor: function () {
        self = this;
        self.token = "";
        self.data = {};
        self.leaderEquipProp = {};
        self.totalHotFlag = [false, false, false, false, false, false];
        self.levelUpHotFlag = [false, false, false, false, false, false];
        self.qualityUpHotFlag = [false, false, false, false, false, false];
        self.showCombatLate = false;
    },

    setData: function (data) {
        if (!data) {
            return;
        }
        for (let key in data) {
            self.data[key] = data[key];
        }
        self.updateHotPoint();
        self.calcLeaderEquipsProp();
    },
    updateHotPoint: function(){
        let equipData = self.getLeaderEquips();
        for (let i = 0; i< equipData.length; i++){
            let level = equipData[i].Level;
            let pos = equipData[i].Pos;
            let leaderEquipData = GlobalVar.tblApi.getDataByMultiKey("TblLeaderEquip", equipData[i].Pos, equipData[i].Quality);

            // 装备升升阶红点
            let equipUpCost = leaderEquipData.oVecUpCost;
            let canUpQuility = true; //是否可以升阶
            if (equipUpCost.length == 0 || equipUpCost[0].wItemID == 0){
                canUpQuility = false;
            }
            for (let i = 0; i < equipUpCost.length; i++) {
                let itemCount = GlobalVar.me().bagData.getItemCountById(equipUpCost[i].wItemID);
                if (itemCount < equipUpCost[i].nCount) {
                    canUpQuility = false;
                }
                if (!canUpQuility){
                    break;
                }
            }
            self.qualityUpHotFlag[i] = canUpQuility
            // 装备可以升级的标识
            let canUpLevel = false; //是否可以升级
            let levelLimit = GlobalVar.me().level*2;
            let levelUpData = GlobalVar.tblApi.getDataBySingleKey('TblLeaderEquipLevel', level);
            let levelUpNeedGold = levelUpData.oVecGoldCost[pos - 1];
            if (level < levelLimit && GlobalVar.me().gold >= levelUpNeedGold){
                canUpLevel = true;
            }
            self.levelUpHotFlag[i] = canUpLevel;

            self.totalHotFlag[i] = canUpQuility || canUpLevel;
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_EQUIPT_FLAG_CHANGE);
    },

    getHotPointData: function () {
        let flag = false;
        for (let i = 0; i< self.totalHotFlag.length; i++){
            flag = flag || self.totalHotFlag[i];
        }
        return flag;
    },

    getLeaderEquips: function () {
        if (self.data.EquipBag) {
            return self.data.EquipBag.Equips;
        }
    },

    saveLeaderEquipLevelUpData: function (msg) {
        if (msg.data.ErrCode == GameServerProto.PTERR_SUCCESS) {
            let equipData = msg.data.Equip;
            self.data.EquipBag.Equips[equipData.Pos - 1] = equipData;
            self.updateHotPoint();
            
            self.calcLeaderEquipsProp();
        }
        //  else {
        //     GlobalVar.comMsg.errorWarning(msg.data.ErrCode);
        // }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_LEADEREQUIP_LEVELUP, msg.data);
    },

    saveLeaderEquipQualityUpData: function (msg) {
        if (msg.data.ErrCode == GameServerProto.PTERR_SUCCESS) {
            let equipData = msg.data.Equip;
            self.data.EquipBag.Equips[equipData.Pos - 1] = equipData;
            self.updateHotPoint();
            self.calcLeaderEquipsProp();
            self.showCombatLate = true;
        }
        // else {
        //     GlobalVar.comMsg.errorWarning(msg.data.ErrCode);
        // }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_LEADEREQUIP_QUALITYUP, msg.data);
    },

    calcLeaderEquipsProp: function () {
        let equips = self.getLeaderEquips();
        
        let allProps = {};

        for (let i = 0; i < equips.length; i++) {
            let leaderEquipData = GlobalVar.tblApi.getDataByMultiKey("TblLeaderEquip", equips[i].Pos, equips[i].Quality);
            let propQuaData = leaderEquipData.oVecProp;
            for (let i = 0; i < propQuaData.length; i++) {
                let prop = propQuaData[i];
                allProps[prop.wPropID] = (allProps[prop.wPropID] || 0) + prop.nAddValue;
            }

            let levelUpData = GlobalVar.tblApi.getDataBySingleKey('TblLeaderEquipLevel', equips[i].Level);
            let propLevelData = levelUpData.oVecProp[equips[i].Pos - 1]
            allProps[propLevelData.wPropID] = (allProps[propLevelData.wPropID] || 0) + propLevelData.nAddValue;
            // addPropValue(propLevelData);
            // for (let i = 0; i < propLevelData.length; i++) {
                // addPropValue(propLevelData[i]);
            // }
        }
        self.leaderEquipProp = allProps;
    },

    getLeaderEquipsProp: function (data) {
        return self.leaderEquipProp;
    },

    getShowCombatLate: function () {
        if (self.showCombatLate) {
            self.showCombatLate = false
            return true;
        }
        return false
    },
});

module.exports = leaderData;