// CGMProp = {  跟GMDT_PROP一致
//     ID,
//     Value,
// }
// PropCoe = {
//     ID,
//     Coe,
// }


////###

const GlobalVar = require('globalvar');
const EventMsgID = require("eventmsgid");
const GameServerProto = require("GameServerProto");



var self = null;
var PropData = cc.Class({
    ctor: function () {
        self = this;
        self.mapProps = {}; //存放各模块的属性数据，比如战机属性，挂载属性map<string,map<prop.ID,prop>>
        self.propData = {};  //propData里存的是角色的各项属性数据
        self.combatPointData = null;
    },

    setData: function (data) {     //data的类型是GMDT_PROP_BAG
        self.propData = data;
        self.initMapProps();
    },

    reset: function () {
        self.mapProps = {};
    },

    initMapProps: function () {        //初始化
        self.mapProps["guazaiProps"] = self.getGuazaiPropsMap();
    },

    getPropMapByName: function (name) {
        if (!!self.mapProps[name])
            return self.mapProps[name];
        return null;
    },

    isAddAttr: function (attrId) {
        switch (attrId) {
            case GameServerProto.PTPROP_HPAddPer:
            case GameServerProto.PTPROP_AttackAddPer:
            case GameServerProto.PTPROP_DefenceAddPer:
                return true;
        }
        return false;
    },

    addPropValue: function (prop) {
        if (!self.mapProp[prop.ID]) {
            self.mapProp[prop.ID] = prop;
            return;
        }
        self.mapProp[prop.ID] += prop.Value;
    },

    addPropValues: function (propArray) {
        for (let i = 0; i < propArray.length; i++)
            self.addPropValue(propArray[i]);
    },

    getGMDT_GMDT_PROP_BAG: function () {
        var bag = { Props: [] };
        for (var i in self.mapProp)
            bag.Props.push(self.mapProp[i]);
        return bag;
    },

    getPropValues: function (vecPropBase, vecPropCoe) {
        var mapProps = {};
        for (base = 0; base < vecPropBase.length; base++) {
            var prop = {};
            prop.ID = vecPropBase[base].ID;
            prop.Value = vecPropBase[base].Value;
            //乘上系数
            if (typeof vecPropCoe !== 'undefined')
                for (let i = 0; i < vecPropCoe; i++) {
                    if (prop.ID == vecPropCoe[i].ID) {
                        prop.Value *= vecPropCoe[i].Coe;
                        break;
                    }
                }
            if (!mapProps[prop.ID])
                mapProps[prop.ID] = prop;
            else
                mapProps[prop.ID] += prop.Value;
        }
        return mapProps;
    },

    getPropValuesMap: function (vecPropValues) {   //map<ID,prop>
        var mapProps = {};
        for (let i = 0; i < vecPropValues.length; i++) {
            if (!mapProps[vecPropValues[i].ID])
                mapProps[vecPropValues[i].ID] = vecPropValues[i];
            else {
                mapProps[vecPropValues[i].ID].Value += vecPropValues[i].Value;
            }
        }
        return mapProps;
    },

    getCombatPointByPropMap: function (mapProps) {
        var critDamage = 0;//爆伤
        var critical = 0;//暴击
        var critRate = 0;//暴击率
        var defense = 0;//防御
        var life = 0;//生命
        var attack = 0;//攻击
        var attackcz = 0;//攻击成长
        var defensecz = 0;//防御成长
        var lifecz = 0;//生命成长
        var petAttack = 0;//僚机攻击
        var activeSkill = 0;//主动技能, 投掷
        var missileDamage = 0;//飞弹伤害
        var assistPet = 0;
        var combatPoint = 0;
        var roleLevel = GlobalVar.me().level;

        for (var i in mapProps) {
            switch (mapProps[i].ID) {
                case GameServerProto.PTPROP_HP:
                    life = mapProps[i].Value;
                    break;

                case GameServerProto.PTPROP_SkillTime:
                    break;

                case GameServerProto.PTPROP_Attack:
                    attack = mapProps[i].Value;
                    break;

                case GameServerProto.PTPROP_Defence:
                    defense = mapProps[i].Value;
                    break;

                case GameServerProto.PTPROP_CritDamage:
                    critDamage = mapProps[i].Value;
                    break;

                case GameServerProto.PTPROP_CritRate:
                    critical = mapProps[i].Value;
                    break;

                case GameServerProto.PTPROP_HPGrowUp:
                    lifecz = mapProps[i].Value;
                    break;

                case GameServerProto.PTPROP_AttackGrowUp:
                    attackcz = mapProps[i].Value;
                    break;

                case GameServerProto.PTPROP_DefenceGrowUp:
                    defensecz = mapProps[i].Value;
                    break;

                case GameServerProto.PTPROP_WingManAttack:
                    petAttack = mapProps[i].Value;
                    break;

                case GameServerProto.PTPROP_ThrowingPower:
                    activeSkill = mapProps[i].Value;
                    break;

                case GameServerProto.PTPROP_MissilePower:
                    missileDamage = mapProps[i].Value;
                    break;

                case GameServerProto.PTPROP_AssistAttack:
                    assistPet = mapProps[i].Value;
                    break;

                default:
                    break;
            }
        }
        critRate = critical / 10000;
        combatPoint = attack * 10.0 + defense * 10.0 + life * 2.0 + attackcz / 10.0 * roleLevel +
            defensecz / 10.0 * roleLevel + lifecz / 50.0 * roleLevel + petAttack * 10.0 + missileDamage * 10.0 + activeSkill * 10.0 +
            assistPet * 10.0 + critDamage * critical / 1000.0;

        return combatPoint;
    },


    //挂载属性数据-----------------------------------------------------------------------------------------------
    getPropsByGuazaiItem: function (item) {
        if (!item)
            return null;
        var mapProps = {};
        var guazai = GlobalVar.tblApi.getDataBySingleKey('TblGuaZai', item.ItemID);
        for (let i = 0; i < guazai.oVecProperty.length; i++) {
            var prop = {};
            prop.ID = guazai.oVecProperty[i].wPropID;
            prop.Value = guazai.oVecProperty[i].nAddValue;
            if (!mapProps[prop.ID])
                mapProps[prop.ID] = prop;
            else
                mapProps[prop.ID].Value += prop.Value;
        }

        var guazaiLvl = GlobalVar.tblApi.getDataByMultiKey('TblGuaZaiLevel', guazai.byPosition, item.GuaZai.Level);
        for (let i = 0; i < guazai.oVecAdvanProp.length; i++) {
            var prop = {};
            prop.ID = guazai.oVecAdvanProp[i].wPropID;
            prop.Value = parseInt(guazai.oVecAdvanProp[i].nAddValue * guazaiLvl.dPropCoe);
            if (!mapProps[prop.ID])
                mapProps[prop.ID] = prop;
            else
                mapProps[prop.ID].Value += prop.Value;
        }

        for (let i = 0; i < item.GuaZai.StarProps.length; i++) {
            var prop = {};
            prop.ID = item.GuaZai.StarProps[i].wPropID;
            prop.Value = item.GuaZai.StarProps[i].nAddValue * guazaiLvl.dPropCoe;
            if (!mapProps[prop.ID])
                mapProps[prop.ID] = prop;
            else
                mapProps[prop.ID].Value += prop.Value;
        }

        return mapProps;
    },

    getGuazaiPropsMap: function () {
        var guazaiPropsMap = {};
        let me = GlobalVar.me();
        for (let i in GlobalVar.me().guazaiData.guazaiWear){
            var item = GlobalVar.me().guazaiData.guazaiWear[i];
            var mapPropGet = self.getPropsByGuazaiItem(item);
            for(var j in mapPropGet) {
                if (!guazaiPropsMap[j]){
                    guazaiPropsMap[j] = mapPropGet[j];
                }else{
                    guazaiPropsMap[j].Value += mapPropGet[j].Value;
                }
            }
        }
        return guazaiPropsMap;


        // for (let i = 0; i < GlobalVar.me().guazaiData.guazaiData.GuaZais.length; i++) {
        //     var item = GlobalVar.me().guazaiData.guazaiData.GuaZais[i];
        //     var mapPropGet = self.getPropsByGuazaiItem(item);
        //     for (var j in mapPropGet) {
        //         if (!guazaiPropsMap[j])
        //             guazaiPropsMap[j] = mapPropGet[j];
        //         else
        //             guazaiPropsMap[j].Value += mapPropGet[j].Value;
        //     }
        // }
        // return guazaiPropsMap;
    },

    getGuazaiStarUpPropsBySlot: function (slot) {
        var vecProps = [];
        for (let i = 0; i < GlobalVar.me().guazaiData.guazaiData.GuaZais.length; i++) {
            var guazai = GlobalVar.me().guazaiData.guazaiData.GuaZais[i];
            if (guazai.Slot == slot) {
                for (j = 0; j < guazai.GuaZai.StarProps.length; j++) {
                    var prop = {};
                    prop.ID = guazai.GuaZai.StarProps[j].ID;
                    prop.Value = guazai.GuaZai.StarProps[j].Value;
                    vecProps.push(prop);
                }
                return vecProps;
            }
        }
        return null;
    },

    getPropsByPos: function (pos) {
        for (let i = 0; i < GlobalVar.me().guazaiData.guazaiData.GuaZais.length; i++) {
            var guazai = GlobalVar.tblApi.getDataBySingleKey('TblGuaZai', GlobalVar.me().guazaiData.guazaiData.GuaZais[i].ItemID);
            if (guazai.byPosition == pos)
                return self.getPropsByGuazaiItem(GlobalVar.me().guazaiData.guazaiData.GuaZais[i]);
        }
        return null;
    },

    getPropValueById: function(ID){
        for(let i = 0; i<self.propData.Props.length;i++){
            if (ID === self.propData.Props[i].ID){
                return self.propData.Props[i].Value;
            }
        }
    },

    getProps: function(){
        return self.propData.Props;
    },

    setPropDataNtf: function(msg){
        if (msg.data && msg.data.CombatPoint) {
            self.combatPointData = msg.data.CombatPoint;
            if (!(GlobalVar.me().memberData.getShowCombatLate() || GlobalVar.me().leaderData.getShowCombatLate())) { 
                GlobalVar.me().setCombatPoint(msg.data.CombatPoint);
            }
        }
        if (msg.data && msg.data.PropBag){
            self.setData(msg.data.PropBag);
        }
    },

    getShowCombatLate: function () {
        self.combatPointData && GlobalVar.me().setCombatPoint(self.combatPointData);
    },

});

module.exports = PropData;
