const GlobalVar = require("globalvar");
const RootBase = require("RootBase");
const WindowManager = require("windowmgr");
const WndTypeDefine = require("wndtypedefine");
const GameServerProto = require("GameServerProto");
const GlobalFunctions = require("GlobalFunctions");
const CommonWnd = require("CommonWnd");
const i18n = require('LanguageData');

var self = null;

cc.Class({
    extends: RootBase,

    properties: {
        nodeIcon: cc.Node,
        itemName: cc.Label,
        itemCount: cc.Label,
        spriteTips: [cc.Node],
        lblCountNum: [cc.Label],
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_PIECE_WND;

        this.animeStartParam(0, 0);

    },

    animeStartParam(paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            GlobalVar.eventManager().removeListenerWithTarget(this);
            WindowManager.getInstance().popView(false, null, false, false);
            this.releaseConstData();
        } else if (name == "Enter") {
            this._super("Enter");
            
        }
    },

    releaseConstData: function () {
        this.TblMemberPieceCrystal = null;
        this.TblItem = null;
    },

    getConstData: function () {
        this.TblMemberPieceCrystal = GlobalVar.tblApi.getData('TblMemberPieceCrystal');
        this.TblItem = GlobalVar.tblApi.getData('TblItem');
    },

    enter: function (isRefresh) {
        if (isRefresh) {
            this._super(true);
        } else {
            this._super(false);
        }
    },

    escape: function (isRefresh) {
        if (isRefresh) {
            this._super(true);
        } else {
            this._super(false);
        }
    },

    confirm: function () {
        let self = this;
        if (this.mode == 0) {
            let num = parseInt(this.lblCountNum[this.mode].string);
            let msg = {
                ItemID: this.itemId,
                Count: num,
            }
            CommonWnd.showMessage(null, CommonWnd.oneConfirm, i18n.t('label.4000216'), i18n.t('label.4000271'), null, function () {
                GlobalVar.handlerManager().memberHandler.sendPieceBreakReq(GameServerProto.GMID_MEMBER_PIECE_BREAK_REQ, msg);
                self.close()
            })
        } else if (this.mode == 1) {
            
        } else {
            
        }
        // this.close();
    },

    cancel: function () {
        if (this.cancelCallback)
            this.cancelCallback();
        this.close();
    },

    setIcon: function (node, itemId, num) {
        let item = node.getChildByName("ItemObject");
        if (!item) {
            item = cc.instantiate(this.itemPrefab);
            node.addChild(item);
        }
        item.getComponent("ItemObject").updateItem(itemId);
        if (num)
            item.getComponent("ItemObject").setLabelNumberData(num);

        item.getComponent("ItemObject").setClick(true, 2)
    },

    initPanel: function (item, mode) {
        this.getConstData();
        this.itemId = item.ItemID;
        this.setIcon(this.nodeIcon, item.ItemID, 0);
        this.itemName.string = this.TblItem[item.ItemID].strName;
        this.itemName.node.color = GlobalFunctions.getCCColorByQuality(this.TblItem[item.ItemID].wQuality);
        this.itemCount.string = item.Count;
        this.mode = mode;
        this.lblCountNum[mode].string = 1;
        if (mode == 0) {
            this.spriteTips[0].active = true;
            this.spriteTips[1].active = false;
            this.maxCount = item.Count;
            this.onePrice = this.TblMemberPieceCrystal[item.ItemID].nCrystal;
            let nodeTotalPiece = this.spriteTips[0].getChildByName('nodeTotalPiece');
            nodeTotalPiece.getChildByName('lblPieceNum').getComponent(cc.Label).string = this.onePrice;
            let nodeOnePiece = this.spriteTips[0].getChildByName('nodeOnePiece');
            nodeOnePiece.getChildByName('lblPieceOne').getComponent(cc.Label).string = this.onePrice;
        } else if (mode == 1) {
            
        } else {
            
        }
    },

    onBtnPlusTouched: function () {
        var num = parseInt(this.lblCountNum[this.mode].string);
        if (num >= this.maxCount)
            return;
        num++;

        let nodeTotalPiece = this.spriteTips[this.mode].getChildByName('nodeTotalPiece');
        nodeTotalPiece.getChildByName('lblPieceNum').getComponent(cc.Label).string = this.onePrice * num;
        this.lblCountNum[this.mode].string = num;
    },

    onBtnPlusTenTouched: function () {
        var num = parseInt(this.lblCountNum[this.mode].string);
        if (num >= this.maxCount)
            return;
        num += 10;
        if (num >= this.maxCount)
            num = this.maxCount;
        
        let nodeTotalPiece = this.spriteTips[this.mode].getChildByName('nodeTotalPiece');
        nodeTotalPiece.getChildByName('lblPieceNum').getComponent(cc.Label).string = this.onePrice * num;
        this.lblCountNum[this.mode].string = num;
    },

    onBtnPlusMaxTouched: function () {
        var num = parseInt(this.lblCountNum[this.mode].string);
        if (num >= this.maxCount)
            return;
        num = this.maxCount;

        let nodeTotalPiece = this.spriteTips[this.mode].getChildByName('nodeTotalPiece');
        nodeTotalPiece.getChildByName('lblPieceNum').getComponent(cc.Label).string = this.onePrice * num;
        this.lblCountNum[this.mode].string = num;
    },

    onBtnMinusTouched: function () {
        this.dirty = true;
        var num = parseInt(this.lblCountNum[this.mode].string);
        if (num <= 1)
            return;
        num--;
        let nodeTotalPiece = this.spriteTips[this.mode].getChildByName('nodeTotalPiece');
        nodeTotalPiece.getChildByName('lblPieceNum').getComponent(cc.Label).string = this.onePrice * num;
        this.lblCountNum[this.mode].string = num;
    },

    onBtnMinusTenTouched: function () {
        this.dirty = true;
        var num = parseInt(this.lblCountNum[this.mode].string);
        if (num <= 1)
            return;
        num -= 10;
        if (num <= 1)
            num = 1;
        let nodeTotalPiece = this.spriteTips[this.mode].getChildByName('nodeTotalPiece');
        nodeTotalPiece.getChildByName('lblPieceNum').getComponent(cc.Label).string = this.onePrice * num;
        this.lblCountNum[this.mode].string = num;
    },


});
