const GlobalVar = require("globalvar");
const GameServerProto = require("GameServerProto");
const WindowManager = require("windowmgr");
const GlobalFunc = require('GlobalFunctions');
const WndTypeDefine = require("wndtypedefine");

cc.Class({
    extends: cc.Component,

    properties: {
        itemObject: cc.Node,
        itemName: cc.Label,
        countLabel: cc.Label,
        resLabel: cc.Label,
        spriteHot: cc.Node,
    },

    onLoad: function () {
        this._data = null;
    },

    show: function (info) {
        this._data = info;
        this.refresh();
    },

    refresh: function () {
        this.itemObject.getComponent('ItemObject').updateItem(this._data.wYuanShiID);
        let chipItemInfo = GlobalVar.tblApi.getDataBySingleKey('TblItem', this._data.stItem.wItemID);
        this.itemName.node.color = GlobalFunc.getCCColorByQuality(chipItemInfo.wQuality);
        this.itemName.string = chipItemInfo.strName;
        let chipCount = GlobalVar.me().bagData.getItemCountById(this._data.stItem.wItemID);
        this.countLabel.string = chipCount + '/' + this._data.stItem.nCount;
        this.resLabel.string = this._data.stSpecialItem.nCount;

        let nowResCount = GlobalVar.me().bagData.getItemCountById(this._data.stSpecialItem.wItemID);
        if (chipCount >= this._data.stItem.nCount && nowResCount >= this._data.stSpecialItem.nCount) {
            this.spriteHot.active = true;
        } else {
            this.spriteHot.active = false;
        }
    },

    onCompose: function () {
        if (this.checkCondition()) {
            GlobalVar.handlerManager().memberHandler.sendYuanShiComposeReq(this._data.wYuanShiID);
        };
    },

    checkCondition: function () {
        let self = this;
        let nowChipCount = GlobalVar.me().bagData.getItemCountById(this._data.stItem.wItemID);
        let needChipCount = this._data.stItem.nCount;
        if (nowChipCount < needChipCount) {
            WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMALITEMGETWAY, function (wnd, name, type) {
                wnd.getComponent(type).updateInfo(self._data.stItem.wItemID, nowChipCount);
                wnd.getComponent(type).setTitle('原石碎片不足');
            });
            return false;
        }

        let nowResCount = GlobalVar.me().bagData.getItemCountById(this._data.stSpecialItem.wItemID);
        let needResCount = this._data.stSpecialItem.nCount;
        if (nowResCount < needResCount) {
            WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMALITEMGETWAY, function (wnd, name, type) {
                wnd.getComponent(type).updateInfo(self._data.stSpecialItem.wItemID, nowResCount);
                wnd.getComponent(type).setTitle('原石精华不足');
            });
            return false;
        }
        return true;
    },

});
