

const GlobalVar = require('globalvar');
const EventMsgID = require("eventmsgid");
const GameServerProto = require("GameServerProto");

var self = null;
var GuazaiData = cc.Class({
    ctor: function () {
        self = this;
        self.guazaiData = {};
        self.guazaiSelectPos = 0;  //挂载界面选择的位置
        self.guazaiWear = {};   //身上穿的挂载
        self.heChengGetItem = [];
        self.totalHotFlag = [false, false, false, false];
        self.wearHotFlag = [false, false, false, false];
        self.qualityUpHotFlag = [false, false, false, false];
        self.levelUpHotFlag = [false, false, false, false];
        self.composeHotFlag = [false, false, false, false];
    },

    setData: function (data) {     //原UpdateMountBag，传入的参数是GMDT_GUAZAI_BAG
        self.guazaiData = data;
        for (let i = 0; i < self.guazaiData.GuaZais.length; i++) {
            let item = self.guazaiData.GuaZais[i];
            self.guazaiWear[item.Slot] = item;
        }
        self.updateHotPoint();
    },

    getHechengGetItem: function () {
        let data = [];
        for (let i = 0; i < self.heChengGetItem.length; i++) {
            data[i] = self.heChengGetItem[i];
        }
        self.heChengGetItem = [];
        return data;
    },

    updateHotPoint: function () {
        let bagGuazaiData = GlobalVar.me().bagData.getItemsByType(GameServerProto.PT_ITEMTYPE_GUAZAI);
        // for (let i = 0; i < self.guazaiData.GuaZais.length; i++) {
        // for (let i in self.guazaiWear) {
        for (let i = 1; i <= 4; i++) {
            if (!self.guazaiWear[i]) {
                for (let j = 0; j < bagGuazaiData.length; j++) {
                    let guazaiData = GlobalVar.tblApi.getDataBySingleKey('TblGuaZai', bagGuazaiData[j].ItemID);
                    if (guazaiData.byPosition == i) {
                        self.wearHotFlag[i - 1] = guazaiData.byPosition == i;
                        self.totalHotFlag[i - 1] = self.wearHotFlag[i - 1];
                        break;
                    }
                }
                continue;
            }
            let wearData = GlobalVar.tblApi.getDataBySingleKey('TblGuaZai', self.guazaiWear[i].ItemID);
            let maxQuality = wearData.wQuality;
            let position = wearData.byPosition;
            for (let j = 0; j < bagGuazaiData.length; j++) {
                let guazaiData = GlobalVar.tblApi.getDataBySingleKey('TblGuaZai', bagGuazaiData[j].ItemID);
                if (guazaiData.byPosition == position) {
                    if (guazaiData.wQuality > maxQuality) {
                        maxQuality = guazaiData.wQuality;
                    }
                }
            }
            self.wearHotFlag[position - 1] = maxQuality > wearData.wQuality;

            let canQualityUp = true;
            if (wearData.oVecQualityUpNeed.length == 0) {
                canQualityUp = false;
            }
            for (let j = 0; j < wearData.oVecQualityUpNeed.length; j++) {
                let haveCount = GlobalVar.me().bagData.getGuazaiQualityUpMaterialCount(wearData.oVecQualityUpNeed[j].wItemID);
                let needCount = wearData.oVecQualityUpNeed[j].nCount;
                canQualityUp = haveCount >= needCount;
                if (!canQualityUp) break;
            }
            self.qualityUpHotFlag[position - 1] = canQualityUp;

            let levelLimit = GlobalVar.me().level * 2;
            let levelUpNeedExp = GlobalVar.tblApi.getDataByMultiKey('TblGuaZaiLevel', position, self.guazaiWear[i].GuaZai.Level).nUpNeedEXP - self.guazaiWear[i].GuaZai.Exp;

            let canProvideExp = 0
            for (let j = 23; j <= 27; j++) {
                let expItemCount = GlobalVar.me().bagData.getItemCountById(j);
                let expItemValue = GlobalVar.tblApi.getDataBySingleKey('TblItem', j).nResult;
                canProvideExp += expItemCount * expItemValue;
            }
            self.levelUpHotFlag[position - 1] = levelUpNeedExp > 0 && canProvideExp >= levelUpNeedExp && self.guazaiWear[i].GuaZai.Level < levelLimit;

            self.totalHotFlag[position - 1] = self.wearHotFlag[position - 1] || self.qualityUpHotFlag[position - 1] || self.levelUpHotFlag[position - 1];

            self.updateComposeHotPointData();
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GUAZAI_FLAG_CHANGE);
    },

    getHotPointData: function () {
        let flag = false;
        for (let i = 0; i < self.totalHotFlag.length; i++) {
            flag = flag || self.totalHotFlag[i];
        }
        flag = flag || self.getComposeHotPoint();
        return flag;
    },

    getComposeHotPoint: function () {
        for (let i = 0; i < self.composeHotFlag.length; i++) {
            if (self.composeHotFlag[i]) {
                return true;
            }
        }
        return false;
    },

    getComposeHotPointByPos: function (pos) { // 0,1,2,3
        return self.composeHotFlag[pos];
    },

    updateComposeHotPointData: function () {
        if (!self.composeTblData) {
            this.initComposeTblData();
        }
        self.composeHotFlag = [false, false, false, false];
        for (let i = 0; i < self.composeHotFlag.length; i++) {
            for (let j = 0; j < self.composeTblData[i].length; j++) {
                let tblData = self.composeTblData[i][j];
                let nowChipCount = GlobalVar.me().bagData.getItemCountById(tblData.stItem.wItemID);
                let needChipCount = tblData.stItem.nCount;
                let nowResCount = GlobalVar.me().bagData.getItemCountById(tblData.stSpecialItem.wItemID);
                let needResCount = tblData.stSpecialItem.nCount;
                if (nowChipCount >= needChipCount && nowResCount >= needResCount) {
                    self.composeHotFlag[i] = true;
                    break;
                }
            }
        }
    },

    initComposeTblData: function () {
        self.composeTblData = [[], [], [], []];
        let tabObj = GlobalVar.tblApi.getData('TblGuaZaiCom');
        for (let key in tabObj) {
            let data = tabObj[key];
            let pos = data.byTab - 1;
            if (pos >= 0 && pos < self.composeTblData.length) {
                self.composeTblData[pos].push(data);
            }
        }
    },

    updateGuazaiItem(item) {     //item为GMDT_ITEM类型
        var guazaiNew = GlobalVar.tblApi.getDataBySingleKey("TblGuaZai", item.ItemID);
        if (self.guazaiData.GuaZais.length <= 0)
            self.guazaiData.GuaZais.push(item);
        else {
            var hasGuazai = false;
            for (let i = 0; i < self.guazaiData.GuaZais.length; i++) {
                var guazaiOld = GlobalVar.tblApi.getDataBySingleKey("TblGuaZai", self.guazaiData.GuaZais.ItemID);
                if (guazaiOld.byPosition == guazaiNew.byPosition) {
                    self.guazaiData.GuaZais[i] = item;
                    hasGuazai = true;
                    break;
                }
            }
            if (!hasGuazai)
                self.guazaiData.GuaZais.push(item);
        }
    },

    // getPropsByItem: function (item) {
    //     var vecProps = [];
    //     var guazai = GlobalVar.tblApi.getDataBySingleKey('TblGuaZai', item.ItemID);
    //     for (let i = 0; i < guazai.oVecProperty.length; i++) {
    //         var prop = {};
    //         prop.ID = guazai.oVecProperty[i].wPropID;
    //         prop.Value = guazai.oVecProperty[i].nAddValue;
    //         vecProps.push(prop);
    //     }

    //     var guazaiLvl = GlobalVar.tblApi.getDataByMultiKey('TblGuaZaiLevel', guazai.byPosition, item.GuaZai.Level);
    //     for (let i = 0; i < guazai.oVecAdvanProp.length; i++) {
    //         var prop = {};
    //         prop.ID = guazai.oVecAdvanProp[i].wPropID;
    //         prop.Value = guazai.oVecAdvanProp[i].nAddValue * guazaiLvl.dPropCoe;
    //         vecProps.push(prop);
    //     }

    //     for (let i = 0; i < item.GuaZai.StarProps.length; i++) {
    //         var prop = {};
    //         prop.ID = item.GuaZai.StarProps[i].wPropID;
    //         prop.Value = item.GuaZai.StarProps[i].nAddValue * guazaiLvl.dPropCoe;
    //         vecProps.push(prop);
    //     }

    //     return vecProps;
    // },

    getPropsAchieve: function () {
        var mapAchieve = self.checkGuazaiAchieve();
        var vecProps = [];
        var mapItems = GlobalVar.tblApi.getData('TblGuaZaiJingTong');
        var count = 0;
        for (var i in mapItems) {
            count = 0;
            for (var j in mapAchieve) {
                if (j >= mapItems[i].wNeedQual)
                    count += mapItems[j];
            }
            if (count >= mapItems[i].byNeedNum) {
                for (k = 0; k < mapItems[i].oVecEffect; k++) {
                    var prop = {};
                    prop.ID = mapItems[i].oVecEffect[k].wPropID;
                    prop.Value = mapItems[i].oVecEffect[k].nAddValue;
                    vecProps.push(prop);
                }
            }
        }
        return vecProps;
    },

    checkGuazaiAchieve: function () {
        var mapAchieve = {};             //map<UINT16, UINT8>
        for (let i = 0; i < self.guazaiData.GuaZais.length; i++) {
            var guazai = GlobalVar.tblApi.getDataBySingleKey('TblGuaZai', self.guazaiData.GuaZais[i].ItemID);
            if (!mapAchieve[guazai.wQuality])
                mapAchieve[guazai.wQuality] = 1;
            else
                mapAchieve[guazai.wQuality]++;
        }
        return mapAchieve;
    },

    // getProps: function () {
    //     var vecProps = [];
    //     for (let i = 0; i < self.guazaiData.GuaZais.length; i++) {
    //         var vecPropGet = self.getPropsByItem(self.guazaiData.GuaZais[i]);
    //         for (j = 0; j < vecPropGet.length; j++)
    //             vecProps.push(vecPropGet[j]);
    //     }
    //     return vecProps;
    // },

    // getStarUpPropsBySlot: function (slot) {
    //     var vecProps = [];
    //     for (let i = 0; i < self.guazaiData.GuaZais.length; i++) {
    //         if (self.guazaiData.GuaZais[i].Slot == slot){
    //             var guazai = self.guazaiData.GuaZais[i];
    //             for(j=0;j<guazai.GuaZai.StarProps.length;j++){
    //                 var prop={};
    //                 prop.ID=guazai.GuaZai.StarProps[j].ID;
    //                 prop.Value=guazai.GuaZai.StarProps[j].Value;
    //                 vecProps.push(prop);
    //             }
    //             return vecProps;
    //         }
    //     }
    //     return null;
    // },

    // getGuazaiPropsMap:function(){
    //     return GlobalVar.me.propData.getPropValuesMap(self.getProps());
    // },

    // getPropsByPos:function(pos){
    //     for(i=0;i<self.guazaiData.GuaZais.length; i++){
    //         var guazai=GlobalVar.tblApi.getDataBySingleKey('TblGuaZai',self.guazaiData.GuaZais[i].ItemID);
    //         if(guazai.byPosition==pos)
    //         return self.getPropsByItem(self.guazaiData.GuaZais[i]);
    //     }
    //     return null;
    // },

    getGuazaiBySlot: function (slot) {
        return this.guazaiWear[slot];
    },

    getCurPosGuazai: function () {
        if (this.guazaiSelectPos == 0)
            return null;
        else
            return this.guazaiWear[this.guazaiSelectPos];
    },

    savePutOnData: function (msg) {
        if (msg.data.ErrCode == 0) {
            let ack = msg.data;
            GlobalVar.me().bagData.setDataByItem(ack.OffGuaZai);
            self.guazaiWear[ack.OnGuaZai.Slot] = ack.OnGuaZai;
            self.updateHotPoint();
            GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GUAZAI_DIRTY_NTF, msg.data);
        }
        else
            GlobalVar.comMsg.errorWarning(msg.data.ErrCode);
    },

    saveLvUpData: function (msg) {
        if (msg.data.ErrCode == 0) {
            let event = {
                levelUpFlag: self.guazaiWear[msg.data.GuaZai.Slot].GuaZai.Level < msg.data.GuaZai.GuaZai.Level,
            }
            self.guazaiWear[msg.data.GuaZai.Slot] = msg.data.GuaZai;
            self.updateHotPoint();
            GlobalVar.me().bagData.updateItemDataByGMDT_ITEM_CHANGE(msg.data.ItemChange);
            GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GUAZAI_LEVEL_UP, event);
            GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GUAZAI_DIRTY_NTF, msg.data);
        }
        else
            GlobalVar.comMsg.errorWarning(msg.data.ErrCode);
    },

    saveQaUpData: function (msg) {
        if (msg.data.ErrCode == 0) {
            self.guazaiWear[msg.data.GuaZai.Slot] = msg.data.GuaZai;
            self.updateHotPoint();
            GlobalVar.me().bagData.updateItemDataByGMDT_ITEM_CHANGE(msg.data.ItemChange);
            GlobalVar.me().setGold(msg.data.Gold);
            GlobalVar.me().setDiamond(msg.data.Diamond);
            GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GUAZAI_QUALITY_UP);
            GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GUAZAI_DIRTY_NTF, msg.data);
        }
        else
            GlobalVar.comMsg.errorWarning(msg.data.ErrCode);
    },

    saveCpsData: function (msg) {
        if (msg.data.ErrCode == 0) {
            GlobalVar.me().bagData.updateItemDataByGMDT_ITEM_CHANGE(msg.data.ItemChange);
            self.heChengGetItem = msg.data.GetItems;
            GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GUAZAI_DIRTY_NTF, msg.data);
            GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GUAZAI_SMELTER_NTF, msg.data);
        }
        else
            GlobalVar.comMsg.errorWarning(msg.data.ErrCode);
    },

    saveRebirthData: function (msg) {
        if (msg.data.ErrCode == 0) {
            if (msg.data.IsShow == 0) {
                GlobalVar.me().bagData.updateItemDataByGMDT_ITEM_CHANGE(msg.data.ItemChange);
                GlobalVar.me().setDiamond(msg.data.Diamond);
            }
            // GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GUAZAI_DIRTY_NTF, msg.data);
            GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GUAZAI_REBIRTH_ACK, msg.data);
        }
        else
            GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GUAZAI_REBIRTH_ACK, msg.data);
    },

    saveComposeData: function (msg) {
        if (msg.data.ErrCode == GameServerProto.PTERR_SUCCESS) {
            GlobalVar.me().bagData.updateItemDataByGMDT_ITEM_CHANGE(msg.data.ItemChange);
            self.updateHotPoint();
            GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GUAZAI_DIRTY_NTF, msg.data);
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GUAZAI_COMPOSE_ACK, msg.data);
    },
});

module.exports = GuazaiData;