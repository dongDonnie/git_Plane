const GlobalVar = require("globalvar")
const EventMsgID = require("eventmsgid");
const WindowManager = require("windowmgr");
const WndTypeDefine = require("wndtypedefine");
const RootBase = require("RootBase");
const GlobalFunc = require('GlobalFunctions')
const CommonWnd = require("CommonWnd");
const i18n = require('LanguageData');
const GameServerProto = require("GameServerProto");
////###

const ITEM_SELL_TYPE_NORMAL = 1;
const ITEM_SELL_TYPE_FORBIDEN = 2;
const ITEM_SELL_TYPE_CONFIRM = 3;


cc.Class({
    extends: RootBase,

    properties: {
        main: {
            default: null,
            type: cc.Button
        },
        itemPrefab: {
            default: null,
            type: cc.Prefab
        },
        labelTitle: {
            default: null,
            type: cc.Label
        },
        btnClose: {
            default: null,
            type: cc.Button
        },
        labelIconName: {
            default: null,
            type: cc.Label
        },
        nodeIcon: {
            default: null,
            type: cc.Node
        },
        labelTypeTag: {
            default: null,
            type: cc.Label
        },
        labelTypeIcon: {
            default: null,
            type: cc.Label
        },
        labelNumber: {
            default: null,
            type: cc.Label
        },
        btnSell: {
            default: null,
            type: cc.Button
        },
        labelItemAttribute: {
            default: null,
            type: cc.Label
        },
        labelItemDescription: {
            default: null,
            type: cc.Label
        },
        btnConfirm: {
            default: null,
            type: cc.Button
        },
        btnUseOne: {
            default: null,
            type: cc.Button,
        },
        btnUseMore: {
            default: null,
            type: cc.Button,
        },

        itemID: {
            default: 0,
            visible: false,
        },
        slot: {
            default: -1,
            visible: false,
        },
        sellMode: {
            default: false,
            visible: false,
        },
    },

    onLoad() {
        this._super();
        i18n.init('zh');
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMALITEMINFO;
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
            if (this.sellMode) {
                this.sellMode = false;
                var param = this.slot;
                // WindowManager.getInstance().popView(false, function () {
                //     GlobalVar.handlerManager().bagHandler.sendItemSellReq(param, 1);
                // });
                WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_SELLITEM_WND, function (wnd, name, type) {
                    wnd.getComponent(type).updateInfo(param);
                });
            } else {
                WindowManager.getInstance().popView(false, null, false, false);
            }
        } else if (name == "Enter") {
            this._super("Enter");
            GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_ITEM_USE_RESULT, this.getUseItemResult, this);
        }
    },

    updateInfo: function (id, quality, level, num, slot, notInBag) {
        this.itemID = id;
        let item = this.addItem(id);
        let itemData = item.getComponent("ItemObject").updateItem(id, -1, level);
        this.itemData = itemData;
        this.setName(itemData.strName, quality);
        this.setTypeIcon(itemData.byType);
        this.setDescription(itemData.strItemDesc);
        if (!!notInBag) {
            this.node.getChildByName("nodeTips").getChildByName("spriteNumberBg").active = false;
            this.node.getChildByName("nodeTips").getChildByName("btnSell").active = false;
            this.node.getChildByName("nodeTips").getComponent(cc.Widget).horizontalCenter = 50;

            this.node.getChildByName("btnUseMore").active = false;
            this.node.getChildByName("btnUseOne").active = false;
            this.btnConfirm.node.active = true;
        } else {
            this.node.getChildByName("nodeTips").getChildByName("spriteNumberBg").active = true;
            this.node.getChildByName("nodeTips").getChildByName("btnSell").active = true;
            this.node.getChildByName("nodeTips").getComponent(cc.Widget).horizontalCenter = 0;
            this.setLabelNumberData(num);
            this.refreshBtn();
        }
        this.slot = slot;


        this.node.height = 520;
        this.labelTitle.getComponent(cc.Widget).updateAlignment();
        this.btnConfirm.getComponent(cc.Widget).updateAlignment();
        this.btnClose.getComponent(cc.Widget).updateAlignment();
        this.node.getChildByName("nodeTips").getComponent(cc.Widget).updateAlignment();


        this.node.getChildByName("nodeTips").active = true;
        this.node.getChildByName("spriteTips").active = true;
        let nodeBoxTips = this.node.getChildByName("nodeBoxTips");
        let spriteBoxTips = this.node.getChildByName("spriteBoxTips");
        spriteBoxTips.active = false;
        nodeBoxTips.active = false;

        if (slot == -1) {
            this.btnSell.interactable = false;
        }
    },

    refreshBtn: function () {
        let itemData = this.itemData;
        if (itemData.bySellType == ITEM_SELL_TYPE_FORBIDEN) {
            this.btnSell.interactable = false;
        }else{
            this.btnSell.interactable = true;
        }

        if (itemData.byType == GameServerProto.PT_ITEMTYPE_CHEST || itemData.byType == GameServerProto.PT_ITEMTYPE_DROPPACKAGE) {
            this.btnConfirm.node.active = false;

            let itemCount = GlobalVar.me().bagData.getItemCountById(this.itemID);
            if (itemCount) {
                this.btnSell.interactable = false;

                if (itemCount == 1) {
                    this.node.getChildByName("btnUseMore").active = true;
                    this.node.getChildByName("btnUseOne").active = false;
                    this.node.getChildByName("btnUseMore").getComponent(cc.Button).clickEvents[0].customEventData = itemCount;
                    this.node.getChildByName("btnUseMore").getComponent("ButtonObject").setText(i18n.t('label.4000253'));
                    this.node.getChildByName("btnUseMore").x = 0;
                } else if (itemCount > 1) {
                    let charArr = ["一", "二", "三", "四", "五"];
                    this.node.getChildByName("btnUseMore").x = 135;
                    this.node.getChildByName("btnUseOne").active = true;
                    this.node.getChildByName("btnUseMore").getComponent(cc.Button).clickEvents[0].customEventData = itemCount;

                    if (itemCount >= 5) {
                        itemCount = 5;
                    }
                    this.node.getChildByName("btnUseMore").getComponent(cc.Button).clickEvents[0].customEventData = itemCount;
                    this.node.getChildByName("btnUseMore").getComponent("ButtonObject").setText(i18n.t('label.4000254').replace("%d", charArr[itemCount - 1]));
                    this.node.getChildByName("btnUseMore").active = true;
                }
            }
        }else{
            this.node.getChildByName("btnUseMore").active = false;
            this.node.getChildByName("btnUseOne").active = false;
            this.btnConfirm.node.active = true;
        }
    },

    getUseItemResult: function (event) {
        if (event.ErrCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }

        let itemCount = GlobalVar.me().bagData.getItemCountById(this.itemID);
        if (itemCount) {
            this.setLabelNumberData(itemCount);
            this.refreshBtn();
        }

        let batch = false;
        for (let i = 0; i < event.GetItem.length; i++) {
            if (event.GetItem[i].ItemID == 0) {
                batch = true;
            }
        }
        if (batch) {
            let backUseWndNode = WindowManager.getInstance().findViewInWndNode(WndTypeDefine.WindowType.E_DT_NORMAL_BATCH_USE_WND)
            if (backUseWndNode) {
                backUseWndNode.getComponent(WndTypeDefine.WindowType.E_DT_NORMAL_BATCH_USE_WND).resetWnd();
                backUseWndNode.getComponent(WndTypeDefine.WindowType.E_DT_NORMAL_BATCH_USE_WND).setResultData(this.itemID, event.GetItem);
                backUseWndNode.getComponent(WndTypeDefine.WindowType.E_DT_NORMAL_BATCH_USE_WND).initBatchUseWnd();
            } else {
                CommonWnd.showBatchUseWnd(this.itemID, event.GetItem);
            }
        } else {
            CommonWnd.showTreasureExploit(event.GetItem);
        }
    },

    updateBoxInfo: function (id, quality, level, title, boxData) {
        this.itemID = id;
        let item = cc.instantiate(this.itemPrefab);
        let itemData = item.getComponent("ItemObject").updateItem(id, -1, level);

        this.node.height = 450;
        this.labelTitle.getComponent(cc.Widget).updateAlignment();
        this.btnConfirm.getComponent(cc.Widget).updateAlignment();
        this.btnClose.getComponent(cc.Widget).updateAlignment();
        this.node.getChildByName("nodeTips").active = false;
        this.node.getChildByName("spriteTips").active = false;
        let nodeBoxTips = this.node.getChildByName("nodeBoxTips");
        let spriteBoxTips = this.node.getChildByName("spriteBoxTips");
        nodeBoxTips.active = true;
        nodeBoxTips.getChildByName("nodeIcon").removeAllChildren();
        nodeBoxTips.getChildByName("nodeIcon").addChild(item);
        nodeBoxTips.getChildByName("labelIconName").getComponent(cc.Label).string = boxData.strName;
        nodeBoxTips.getChildByName("labelIconName").color = GlobalFunc.getCCColorByQuality(quality);
        this.node.getChildByName("btnUseMore").active = false;
        this.node.getChildByName("btnUseOne").active = false;
        this.btnConfirm.node.active = true;

        let rewardItemId = boxData.oVecItems[0].wItemID
        let rewardItemData = GlobalVar.tblApi.getDataBySingleKey('TblItem', rewardItemId)
        spriteBoxTips.active = true;
        spriteBoxTips.getChildByName("labelItemDescription").getComponent(cc.Label).string = rewardItemData.strItemDesc;

        this.setTitle(title);
    },

    addItem: function (id) {
        this.nodeIcon.removeAllChildren();
        let item = cc.instantiate(this.itemPrefab);
        this.nodeIcon.addChild(item);
        return item;
    },

    sellSelf: function () {
        if (this.slot != -1) {
            //let itemData = GlobalVar.tblApi.getDataBySingleKey('TblItem', this.itemID);
            //if (itemData == null) {
            //itemData = GlobalVar.tblApi.getDataBySingleKey('TblItem', 1);
            //}
            //if(itemData.bySellType!=1 || itemData.nSellPrice==0){
            //CommonWnd.showMessage(null, CommonWnd.oneConfirm, i18n.t('label.4000216'), i18n.t('label.4000219'));
            //}else{
            //var self=this;
            //let str=i18n.t('label.4000222').replace('%s',itemData.strName);
            //str=str.replace('%d',itemData.nSellPrice);
            //CommonWnd.showMessage(null, CommonWnd.bothConfirmAndCancel, i18n.t('label.4000216'), str,null,function(){
            //GlobalVar.handlerManager.bagHandler.sendItemSellReq(self.slot,1);
            //self.close();
            //},null);
            this.sellMode = true;
            this.close();
            //}
        }
    },

    onBtnUseItemClick: function (event, times) {
        // console.log("use item " + times + " times!!!");

        if (this.itemID) {
            let itemData = GlobalVar.me().bagData.getItemById(this.itemID);
            GlobalVar.handlerManager().bagHandler.sendItemUseReq(itemData.Slot, times, itemData.Type);
        }
    },

    setTitle: function (text) {
        this.labelTitle.string = text;
    },

    setName: function (text, quality) {
        this.labelIconName.string = text;
        this.labelIconName.node.color = GlobalFunc.getCCColorByQuality(quality);
    },

    setTypeTag: function (text) {
        this.labelTypeTag.string = text;
    },

    setTypeIcon: function (text) {
        let type = GlobalVar.tblApi.getDataBySingleKey('TblItemType', text);
        if (type != null) {
            this.labelTypeTag.node.active = true;
            this.labelTypeIcon.node.active = true;
            this.labelTypeIcon.string = type.strTypeName;
        } else {
            this.labelTypeTag.node.active = false;
            this.labelTypeIcon.node.active = false;
        }
    },

    setLevel: function (text) {
        text = typeof text !== 'undefined' ? text : 0;
        if (text == 0) {
            this.spriteIconLevel.node.active = false;
            this.labelAtlasLevel.node.active = false;
        } else {
            this.spriteIconLevel.node.active = true;
            this.labelAtlasLevel.node.active = true;
            this.labelAtlasLevel.string = text;
        }
    },

    setSubTitle: function (text) {
        this.labelItemAttribute.string = text;
    },

    setDescription: function (text) {
        this.labelItemDescription.string = text;
    },
    setLabelNumberData: function (text) {
        if (parseInt(text) > 99999){
            text = Math.floor(text/10000) + "万";
        }
        this.labelNumber.string = text;
    },

    enter: function (isRefresh) {
        if (isRefresh) {
            this._super(true);
        } else {
            this._super(false);
            if (this.itemID) {
                let itemCount = GlobalVar.me().bagData.getItemCountById(this.itemID);
                if (itemCount == 0) {
                    this.close();
                }
            }
        }
    },

    escape: function (isRefresh) {
        if (isRefresh) {
            this._super(true);
        } else {
            this._super(false);
        }
    },

});
