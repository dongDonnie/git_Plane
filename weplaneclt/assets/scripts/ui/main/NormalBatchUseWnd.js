
const RootBase = require("RootBase");
const WindowManager = require("windowmgr");
const GlobalVar = require('globalvar')
const WndTypeDefine = require("wndtypedefine");
const EventMsgID = require("eventmsgid");
const GameServerProto = require("GameServerProto");

cc.Class({
    extends: RootBase,

    properties: {
        resultScroll: {
            default: null,
            type: cc.ScrollView,
        },
        nodeModel: {
            default: null,
            type: cc.Node,
        },
        itemPrefab: {
            default: null,
            type: cc.Prefab,
        },
        btnContinue: {
            default: null,
            type: cc.Button
        }
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_BATCH_USE_WND;

        this.content = this.resultScroll.content;

        this.animeStartParam(0, 0);
        this.allItemsData = null;

        this.canContinueUse = false;
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
        } else if (name == "Enter") {
            this._super("Enter");
            this.registerEvent();
            this.initBatchUseWnd();
        }
    },
    registerEvent: function () {

    },

    setResultData: function (useItemID, packItemsData) {
        this.useItemID = useItemID;
        this.allItemsData = this.unpackItemsData(packItemsData);
    },

    unpackItemsData: function (packItemsData){
        let arr = [];
        let subArr = [];
        for (let i = 0; i< packItemsData.length; i++){
            if (packItemsData[i].ItemID != 0){
                subArr.push(packItemsData[i])
            }else{
                arr.push(subArr);
                subArr = [];
            }
        }
        arr.push(subArr);
        return arr;
    },

    resetWnd: function(){
        for(let i = 0; i< this.content.children.length; i++){
            this.content.children[i].active = false;
        }
    },

    initBatchUseWnd: function(){
        if (!this.allItemsData || !this.useItemID){
            return;
        }

        this.closing = false;
        let itemCount = GlobalVar.me().bagData.getItemCountById(this.useItemID);
        this.node.getChildByName("labelLeft").getComponent(cc.Label).string = itemCount;
        this.node.getChildByName("labelLeft").active = true;
        if (itemCount == 0) {
            this.btnContinue.interactable = false;
        } else {
            this.btnContinue.interactable = true;
        }
        this.canContinueUse = false;
        this.updateItemGet(0);
    },

    updateItemGet: function(index){
        let self = this;
        let model = this.content.children[index];
        let data = this.allItemsData[index];

        if (!data){
            this.canContinueUse = true;
            return;
        }
        if (!model){
            model = cc.instantiate(this.nodeModel);
            model.getChildByName("labelTimes").getComponent(cc.Label).string = "第" + (index + 1) + "次使用获得";
            model.x = 0;
            this.content.addChild(model);
        }


        let addItems = function(){
            let content = model.getChildByName("scrollview").getComponent(cc.ScrollView).content;
            let lastIndex = 0;
            for (let i = 0; i <data.length;i++){
                lastIndex = i;
                if (!content.children[i]){
                    let item = cc.instantiate(self.itemPrefab);
                    content.addChild(item);
                }
                content.children[i].active = true;
                content.children[i].getComponent("ItemObject").updateItem(data[i].ItemID, data[i].Count);
            }

            if (lastIndex < content.children.length - 1){
                for(let i = lastIndex + 1; i< content.children.length; i++){
                    content.children[i].active = false;
                }
            }
        }



        model.active = true;
        model.x = - 1000;
        model.runAction(
            cc.sequence(
            cc.callFunc(()=>{
                if (!self.closing){
                    addItems();
                }
        }), cc.moveBy(0.2, 1100, 0), 
            cc.moveBy(0.1, -100, 0),
            cc.delayTime(0.017), 
            cc.callFunc(()=>{
                if (!self.closing){
                    self.updateItemGet(index + 1);
                }
        })));
    },

    onBtnContinueUse: function (){
        if (!this.canContinueUse){
            return;
        }
        if (this.useItemID){
            let itemCount = GlobalVar.me().bagData.getItemCountById(this.useItemID);
            if (itemCount){
                itemCount = itemCount>5?5:itemCount;
                let itemData = GlobalVar.me().bagData.getItemById(this.useItemID);
                GlobalVar.handlerManager().bagHandler.sendItemUseReq(itemData.Slot, itemCount, itemData.Type);
            }
        }
    },

    onBtnClose: function () {
        if (!this.canContinueUse) {
            return;
        }
        this.closing = true;
        this.resetWnd();
        this.close();
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

    close: function () {
        for(let i = 0; i< this.content.children.length; i++){
            this.content.children[i].active = false;
        }
        this._super();
    },
});
