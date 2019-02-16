const GlobalVar = require('globalvar');
const EventMsgID = require("eventmsgid");
const GameServerProto = require("GameServerProto");

//不进背包的道具
const GOLD_ID = 1;
const DIAMOND_ID = 3;

var self = null;
var BagData = cc.Class({
    ctor: function () {
        self = this;
        self.token = "";
        self.itemData = {};
        self.totalHotFlag;
        self.canUseItemHotFlag = [];
    },

    setData: function (data) {
        this.itemData = data;
        //cc.log(this.itemData.Items.length)
        this.updateHotPoint();
    },

    updateHotPoint: function () {
        if (this.canUseItemHotFlag.length > this.itemData.Items.length) {
            this.canUseItemHotFlag.splice(this.itemData.Items.length, this.canUseItemHotFlag.length - this.itemData.Items.length);
        }
        this.totalHotFlag = false;
        for (let i = 0; i < this.itemData.Items.length; i++) {
            this.canUseItemHotFlag[i] = false;
            let item = this.itemData.Items[i];
            if (item.Type == GameServerProto.PT_ITEMTYPE_CHEST || item.Type == GameServerProto.PT_ITEMTYPE_DROPPACKAGE || item.Type == GameServerProto.PT_ITEMTYPE_SPECIAL_DROPPACKAGE) {
                this.canUseItemHotFlag[i] = true;
            }
            this.totalHotFlag = this.totalHotFlag || this.canUseItemHotFlag[i];
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_THEBAG_FLAG_CHANGE);
    },

    getHotPointData: function () {
        return this.totalHotFlag;
    },

    getData: function () {
        return this.itemData;
    },

    saveBagUnlock: function (msg) {
        if (msg.data.ErrCode == GameServerProto.PTERR_SUCCESS) {
            this.itemData.Unlock = msg.data.Unlock;
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_BAG_UNLOCK_NTF, msg);
    },

    saveItemSell: function (msg) {
        this.updateItemDataByGMDT_ITEM_CHANGE(msg.data.ItemChange);
        GlobalVar.me().setGold(msg.data.GoldCur);
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_ITEM_SELL_NTF, msg);
    },

    updateItemDataByGMDT_ITEM_CHANGE: function (itemChange) {
        if (!itemChange.Items) return;
        for (let i = 0; i < itemChange.Items.length; i++) {
            let changeItem = itemChange.Items[i];
            if (changeItem.Type == GameServerProto.PT_ITEMTYPE_VALUE) {
                continue;
            }
            let j = 0;

            let index = -1;
            for (; j < self.itemData.Items.length; j++) {
                let item = self.itemData.Items[j];
                if (item.Slot == changeItem.Slot) {
                    self.itemData.Items[j] = changeItem;
                    index = j;
                    break;
                }
            }
            if (changeItem.Count == 0) {
                self.itemData.Items.splice(index, 1);
            }
            if (j == self.itemData.Items.length && changeItem.Count !== 0) {
                self.itemData.Items.push(changeItem);
            }
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_BAG_ADDITEM_NTF, itemChange);
        this.updateHotPoint();
        GlobalVar.me().guazaiData.updateHotPoint();
        GlobalVar.me().leaderData.updateHotPoint();
        GlobalVar.me().memberData.updateHotPoint();
    },

    getItemById: function (id) {
        for (let i = 0; i < self.itemData.Items.length; i++) {
            if (self.itemData.Items[i].ItemID == id) {
                return self.itemData.Items[i];
            }
        }
        return null;
    },

    getItemsById:function(id){
        let newArr = [];
        for (let i = 0; i < self.itemData.Items.length; i++) {
            if (self.itemData.Items[i].ItemID == id) {
                newArr.push(self.itemData.Items[i]);
            }
        }
        return newArr;
    },

    getItemsByType: function (type) {
        let newArr = [];
        for (let i = 0; i < self.itemData.Items.length; i++) {
            if (self.itemData.Items[i].Type == type) {
                newArr.push(self.itemData.Items[i]);
            }
        }
        return newArr;
    },

    getItemCountById: function (id) {
        var count = 0;
        switch (id) {
            case GOLD_ID:
                return GlobalVar.me().gold;
            case DIAMOND_ID:
                return GlobalVar.me().diamond;
            default:
                break;
        }

        for (let i = 0; i < self.itemData.Items.length; i++) {
            if (self.itemData.Items[i].ItemID == id)
                count += self.itemData.Items[i].Count;
        }
        return count;
    },

    getItemBySlot: function (slot) {
        for (let i = 0; i < self.itemData.Items.length; i++) {
            if (self.itemData.Items[i].Slot == slot) {
                return self.itemData.Items[i];
            }
        }
        return null;
    },
    getItemIndexBySlot: function (slot) {
        for (let i = 0; i < self.itemData.Items.length; i++) {
            if (self.itemData.Items[i].Slot == slot) {
                return i;
            }
        }
        return null;
    },

    updateItem: function (item) {
        for (let i = 0; i < self.itemData.Items.length; i++) {
            if (self.itemData.Items[i].Slot == item.Slot) {
                self.itemData.Items[i] = item;
                break;
            }
        }
    },

    useItemById: function (id, count) {
        if (id == 0 || count == 0)
            return false;
        var totalCount = this.getItemCountById(id);
        if (count > totalCount)
            return false;
        var cost = count;
        var costList = [];
        for (let i = 0; i < self.itemData.Items.length; i++) {
            if (self.itemData.Items[i].ItemID == id)
                costList.push(i);
        }

        function compare(a, b) {
            if (self.itemData.Items[a].Count > self.itemData.Items[b].Count)
                return 1;
            else
                return -1;
        }
        costList.sort(compare);
        var idx = 0;
        while (cost) {
            if (cost < self.itemData.Items[costList[idx]].Count) {
                self.itemData.Items[costList[idx]].Count -= cost;
                return true;
            } else if (cost == self.itemData.Items[costList[idx]].Count) {
                self.itemData.Items.splice(costList[idx], 1);
                return true;
            } else {
                cost -= self.itemData.Items[costList[idx]].Count;
                self.itemData.Items.splice(costList[idx], 1);
                idx++;
                if (idx >= costList.length)
                    break;
            }
        }
    },

    checkBagRedPoint: function (itemArray) { //itemArray是一个GMDT_ITEM数组
        for (let i = 0; i < itemArray.length; i++) {
            if (itemArray[i].Type == GameServerProto.PT_ITEMTYPE_CHEST || itemArray[i].Type == GameServerProto.PT_ITEMTYPE_DROPPACKAGE)
                return true;
        }
        return false;
    },

    getGuazaiSlotById: function (id) { //获取所有给定id的挂载在背包内的位置
        let slotArray = [];
        for (let i = 0; i < self.itemData.Items.length; i++) {
            if (self.itemData.Items[i].ItemID == id)
                slotArray.push(self.itemData.Items[i].Slot);
        }
        return slotArray;
    },

    getGuazaiQualityUpMaterialCount: function (id) {
        let slotArray = this.getGuazaiSlotById(id);
        let count = 0;
        for (let i = 0; i < slotArray.length; i++) {
            let guazaiData = GlobalVar.me().bagData.getItemBySlot(slotArray[i]);
            if (guazaiData.GuaZai.Level <= 5) {
                count += 1;
            }
        }
        return count;
    },

    getGuazaiQualityUpMaterialSlot: function (id) {
        let slotArray = this.getGuazaiSlotById(id);
        let materialSlotArray = [];
        for (let i = 0; i < slotArray.length; i++) {
            let guazaiData = GlobalVar.me().bagData.getItemBySlot(slotArray[i]);
            if (guazaiData.GuaZai.Level <= 5) {
                materialSlotArray.push(slotArray[i]);
            }
        }
        return materialSlotArray;
    },

    getItemVecByType: function (type) {
        let itemArray = [];
        for (let i = 0; i < self.itemData.Items.length; i++) {
            if (self.itemData.Items[i].Type == type)
                itemArray.push(self.itemData.Items[i]);
        }
        return itemArray;
    },

    setDataByItem: function (item) { //穿脱挂载
        // this.itemData.Items[item.Slot] = item;
        let index = self.getItemIndexBySlot(item.Slot);
        if (item.ItemID == 0) {
            self.itemData.Items.splice(index, 1);
        } else {
            self.itemData.Items[index] = item;
        }

        this.updateHotPoint();
    },

    saveItemChange: function (ack) {
        if (ack.ErrCode == GameServerProto.PTERR_SUCCESS) {
            this.updateItemDataByGMDT_ITEM_CHANGE(ack.Items);
        }
    },

    saveItemUseData: function (data) {
        // console.log("data = ", data);
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS) {
            self.updateItemDataByGMDT_ITEM_CHANGE(data.ItemChange);
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_ITEM_USE_RESULT, data);
    },

    saveMemberEquipPuton: function (data, slot) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS) {
            let itemC = {};
            itemC.Items = [];
            if (slot != -1) {
                let item = {}
                item.Count = 0;
                item.ItemID = data.OK.OnEquip.ItemID;
                item.Slot = slot;
                item.Type = data.OK.OnEquip.Type;
                itemC.Items.push(item);
            }
            let off = data.OK.OffEquip;
            if (off.Count != 0) {
                itemC.Items.push(off);
            }
            this.updateItemDataByGMDT_ITEM_CHANGE(itemC);
        }
    },
});

module.exports = BagData;