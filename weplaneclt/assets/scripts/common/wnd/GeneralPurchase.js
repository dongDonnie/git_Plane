const GlobalVar = require("globalvar");
const RootBase = require("RootBase");
const WindowManager = require("windowmgr");
const ResMapping = require("resmapping");
const ResManager = require("ResManager");
const WndTypeDefine = require("wndtypedefine");
const weChatAPI = require("weChatAPI");

var self = null;

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
        lblTitle: {
            default: null,
            type: cc.Label
        },
        btnClose: {
            default: null,
            type: cc.Button
        },
        lblGetIconName: {
            default: null,
            type: cc.Label
        },
        nodeGetIcon: {
            default: null,
            type: cc.Node
        },
        btnConfirm: {
            default: null,
            type: cc.Button
        },
        btnCancel: {
            default: null,
            type: cc.Button
        },
        lblConfirm: {
            default: null,
            type: cc.Label
        },
        lblCancel: {
            default: null,
            type: cc.Label
        },
        lblDescribe: {
            default: null,
            type: cc.Label
        },
        lblCountName: {
            default: null,
            type: cc.Label
        },
        lblCountNum: {
            default: null,
            type: cc.Label
        },
        lblCostName: {
            default: null,
            type: cc.Label
        },
        lblCostNum: {
            default: null,
            type: cc.Label
        },
        lblCostName1: {
            default: null,
            type: cc.Label
        },
        nodeCostIcon1: {
            default: null,
            type: cc.Node
        },
        lblCostName2: {
            default: null,
            type: cc.Label
        },
        nodeCostIcon2: {
            default: null,
            type: cc.Node
        },
        btnPlus: {
            default: null,
            type: cc.Button
        },
        btnMinus: {
            default: null,
            type: cc.Button
        },
        sliderCount: {
            default: null,
            type: cc.Slider
        },
        pbCount: {
            default: null,
            type: cc.ProgressBar
        },
        nodeCostMini: {
            default: null,
            type: cc.Node
        },
        dirty: true,
        maxCount: 10,
        price: [],
        confirmCallback: null,
        cancelCallback: null,
        setCostNumCallback: null,  //有些物品每次单价不一样，所以不能用通用函数，callback里返回出要设定的数值
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_PURCHASE_WND;
        
        // this.sliderCount.progress = parseInt(parseInt(this.lblCountNum.string) / this.maxCount);
        // this.pbCount.progress = this.sliderCount.progress;

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
            let self = this;
            WindowManager.getInstance().popView(false, function () {
                if (self.clickConfirm && self.confirmCallback){
                    self.confirmCallback(parseInt(self.lblCountNum.string));
                    self.confirmCallback = null;                    
                }
                self.setString(self.lblCountNum, 1);
            }, false, false);
        } else if (name == "Enter") {
            this._super("Enter");
            this.clickConfirm = false;
            this.setString(this.lblCountNum, 1);
        }
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

    setString: function (lbl, text) {
        lbl.string = text;
    },

    setIcon: function (node, itemId, itemNum, mode) {
        itemNum = itemNum || 0;
        if (node.children.length == 0){
            let item = cc.instantiate(this.itemPrefab);
            item.getComponent("ItemObject").updateItem(itemId, itemNum);
            if (mode == 1) {
                item.getComponent("ItemObject").setSpriteEdgeVisible(false);
            }
            node.addChild(item);
        }else{
            node.children[0].getComponent("ItemObject").updateItem(itemId, itemNum);
            if (mode == 1) {
                node.children[0].getComponent("ItemObject").setSpriteEdgeVisible(false);
            }
        }
    },

    confirm: function () {
        this.clickConfirm = true;
        this.close();
    },

    cancel: function () {
        if (this.cancelCallback)
            this.cancelCallback();
        this.close();
    },

    onBtnPlusTouched: function () {
        this.dirty = true;
        var num = parseInt(this.lblCountNum.string);
        if (num >= this.maxCount)
            return;
        num++;
        if (this.price.length == 1)
            this.lblCostNum.string = num * this.price[0];

        // this.sliderCount.progress = num / this.maxCount;
        // this.pbCount.progress = this.sliderCount.progress;
        this.lblCountNum.string = num.toString();
    },

    onBtnPlusTenTouched: function () {
        this.dirty = true;
        var num = parseInt(this.lblCountNum.string);
        if (num >= this.maxCount)
            return;
        num += 10;
        if (num >= this.maxCount)
            num = this.maxCount;
        
        if (this.price.length == 1)
            this.lblCostNum.string = num * this.price[0];

        // this.sliderCount.progress = num / this.maxCount;
        // this.pbCount.progress = this.sliderCount.progress;
        this.lblCountNum.string = num.toString();
    },

    onBtnPlusMaxTouched: function () {
        this.dirty = true;
        var num = parseInt(this.lblCountNum.string);
        if (num >= this.maxCount)
            return;
        num = this.maxCount;

        if (this.price.length == 1)
            this.lblCostNum.string = num * this.price[0];

        // this.sliderCount.progress = num / this.maxCount;
        // this.pbCount.progress = this.sliderCount.progress;
        this.lblCountNum.string = num.toString();
    },

    onBtnMinusTouched: function () {
        this.dirty = true;
        var num = parseInt(this.lblCountNum.string);
        if (num <= 1)
            return;
        num--;
        if (this.price.length == 1)
            this.lblCostNum.string = num * this.price[0];

        // this.sliderCount.progress = num / this.maxCount;
        // this.pbCount.progress = this.sliderCount.progress;
        this.lblCountNum.string = num.toString();
    },

    onBtnMinusTenTouched: function () {
        this.dirty = true;
        var num = parseInt(this.lblCountNum.string);
        if (num <= 1)
            return;
        num -= 10;
        if (num <= 1)
            num = 1;
        if (this.price.length == 1)
            this.lblCostNum.string = num * this.price[0];

        // this.sliderCount.progress = num / this.maxCount;
        // this.pbCount.progress = this.sliderCount.progress;
        this.lblCountNum.string = num.toString();
    },

    onSliderMoved: function () {
        var chooseCount = parseInt(this.sliderCount.progress * this.maxCount);
        if (chooseCount <= 0)
            chooseCount = 1;
        this.lblCountNum.string = chooseCount.toString();
        this.pbCount.progress = chooseCount / this.maxCount;
    },

    setParam: function (getItem, canBuyCount, costItemArray, titleString, describeString, confirmCallback, cancelCallback, setCostNumCallback) {   //costItemArray=[{id,num}];
        this.setString(this.lblTitle, titleString);
        this.setString(this.lblDescribe, describeString);
        this.maxCount = canBuyCount;
        this.setIcon(this.nodeGetIcon, getItem[0].id, getItem[0].num);
        var item = GlobalVar.tblApi.getDataBySingleKey('TblItem', getItem[0].id);
        this.setString(this.lblGetIconName, item.strName);
        if (costItemArray.length == 1) {
            this.nodeCostIcon1.active = false;
            this.nodeCostIcon2.active = false;
            this.lblCostName1.node.active = false;
            this.lblCostName2.node.active = false;

            this.price.push(costItemArray[0].num);
            this.setIcon(this.nodeCostMini, costItemArray[0].id, -1, 1);
        }
        else {
            this.setIcon(this.nodeCostIcon1, costItemArray[0].id);
            this.price.push(costItemArray[0].num);
            this.setIcon(this.nodeCostIcon2, costItemArray[1].id);
            this.price.push(costItemArray[1].num);
            /*设置三种物品的名字*/
            this.nodeCostMini.active = false;
        }
        this.confirmCallback = confirmCallback ? confirmCallback : null;
        this.cancelCallback = cancelCallback ? cancelCallback : null;
        this.setCostNumCallback = setCostNumCallback ? setCostNumCallback : null;
        this.dirty = true;
    },

    update: function (dt) {
        if (!this.dirty)
            return;
        this.dirty = false;

        // var num = parseInt(this.lblCountNum.string);
        // this.sliderCount.progress = num / this.maxCount;
        // this.pbCount.progress = this.sliderCount.progress;

        if (this.setCostNumCallback)
            this.lblCostNum.string = this.setCostNumCallback(parseInt(this.lblCountNum.string));
    },
});
