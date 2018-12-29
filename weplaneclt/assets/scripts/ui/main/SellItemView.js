const GlobalVar = require("globalvar")
const WindowManager = require("windowmgr");
const WndTypeDefine = require("wndtypedefine");
const RootBase = require("RootBase");
const GlobalFunc = require('GlobalFunctions')
const CommonWnd = require("CommonWnd");
const i18n = require('LanguageData');
const weChatAPI = require("weChatAPI");
cc.Class({
    extends: RootBase,

    properties: {
        itemPrefab:{
            default:null,
            type:cc.Prefab
        },
        labelTitle: {
            default: null,
            type: cc.Label
        },
        labelName: {
            default: null,
            type: cc.Label
        },
        nodeIcon:{
            default:null,
            type:cc.Node
        },
        labelNumber:{
            default:null,
            type:cc.Label
        },
        labelGetNumber:{
            default:null,
            type:cc.Label
        },
        labelPriceNumber:{
            default:null,
            type:cc.Label
        },
        labelCountsNumber: {
            default: null,
            type: cc.Label
        },
        slot:{
            default:-1,
            visible:false,
        },
        count:{
            default:1,
            visible:false,
        },
        sellConfirm:{
            default:false,
            visible:false,
        },
    },

    onLoad () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_SELLITEM_WND;
        this.animeStartParam(0, 0);
    },

    animeStartParam(paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            if (GlobalVar.getBannerSwitch()){
                weChatAPI.justShowBanner();
            }
            if(this.sellConfirm){
                this.sellConfirm=false;
                var self=this;
                WindowManager.getInstance().popToTargetView(WndTypeDefine.WindowType.E_DT_NORMALROOT_WND,false,false,false,function(wnd,type){
                    if(type==WndTypeDefine.WindowType.E_DT_NORMALBAG){
                        wnd.getComponent(type).sellItem(self.slot,self.count);
                    }
                });
            }else{
                WindowManager.getInstance().popView();
            }
        } else if (name == "Enter") {
            this._super("Enter");
            if (GlobalVar.getBannerSwitch()){
                weChatAPI.justHideBanner();
            }
            this.count = 1;
            this.setLabelCountsNumber(this.count);
            let item=GlobalVar.me().bagData.getItemBySlot(this.slot);
            let itemData = GlobalVar.tblApi.getDataBySingleKey('TblItem', item.ItemID);
            this.setLabelGetNumber(this.count*itemData.nSellPrice);
        }
    },

    updateInfo: function (slot) {
        this.slot=slot;
        this.count = 0;
        let item=GlobalVar.me().bagData.getItemBySlot(slot);
        let itemData=this.addItem(item.ItemID).getComponent("ItemObject").updateItem(item.ItemID);

        this.setName(itemData.strName,itemData.wQuality);
        this.setLabelNumberData(item.Count);
        this.setLabelCountsNumber(0);
        this.setLabelGetNumber(0);
        this.setLabelPriceNumber(itemData.nSellPrice);
    },

    addItem:function(id){
        this.nodeIcon.removeAllChildren();
        let item=cc.instantiate(this.itemPrefab);
        this.nodeIcon.addChild(item);
        return item;
    },

    setSellCounts(event,data){
        let item=GlobalVar.me().bagData.getItemBySlot(this.slot);
        if(data=="+1"){
            this.count+=1;
        }else if(data=="-1"){
            this.count-=1;
        }else if(data=="+10"){
            this.count+=10;
        }else if(data=="-10"){
            this.count-=10;
        }else if(data=="max"){
            this.count=item.Count;
        }
        if(this.count<0){
            this.count=0;
        }else if(this.count>item.Count){
            this.count=item.Count;
        }
        this.setLabelCountsNumber(this.count);
        let itemData = GlobalVar.tblApi.getDataBySingleKey('TblItem', item.ItemID);
        this.setLabelGetNumber(this.count*itemData.nSellPrice);
    },

    sellSelf:function(){
        if(this.slot!=-1 && this.count>0){
            this.sellConfirm=true;
            this.close();
        }else{
            CommonWnd.showMessage(null, CommonWnd.oneConfirm, i18n.t('label.4000216'), i18n.t('label.4000219'));
        }
    },
    
    setTitle: function (text) {
        this.labelTitle.string = text;
    },

    setName: function (text,quality) {
        this.labelName.string = text;
        this.labelName.node.color=GlobalFunc.getCCColorByQuality(quality);
    },

    setLabelNumberData:function(text){
        this.labelNumber.string=text;
    },

    setLabelCountsNumber:function(text){
        this.labelCountsNumber.string=text;
    },

    setLabelGetNumber:function(text){
        this.labelGetNumber.string=text;
    },

    setLabelPriceNumber:function(text){
        this.labelPriceNumber.string=text;
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

});
