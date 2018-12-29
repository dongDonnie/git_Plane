const GlobalVar = require("globalvar")
const WindowManager = require("windowmgr");
const WndTypeDefine = require("wndtypedefine");
const RootBase = require("RootBase");
const GlobalFunc = require('GlobalFunctions');
const CommonWnd = require("CommonWnd");
const i18n = require('LanguageData');
const weChatAPI = require("weChatAPI");
////###



cc.Class({
    extends: RootBase,

    properties: {
        main: {
            default: null,
            type: cc.Button
        },
        itemPrefab:{
            default:null,
            type:cc.Prefab
        },
        getwayPrefab:{
            default:null,
            type:cc.Prefab
        },
        labelTitle: {
            default: null,
            type: cc.Label
        },
        btnClose:{
            default:null,
            type:cc.Button
        },
        nodeIcon:{
            default:null,
            type:cc.Node
        },
        labelIconName: {
            default: null,
            type: cc.Label
        },
        labelItemDescription: {
            default: null,
            type: cc.Label
        },
        labelNumber:{
            default:null,
            type:cc.Label
        },
        btnSell:{
            default:null,
            type:cc.Button
        },
        labelItemAttribute:{
            default:null,
            type:cc.Label
        },
        scrollviewGetWay:{
            default:null,
            type:cc.ScrollView
        },
        getwayStack:{
            default:[],
            visible:false,
        },
        itemID:{
            default:0,
            visible:false,
        },
        slot:{
            default:-1,
            visible:false,
        },
        sellMode:{
            default:false,
            visible:false,
        },
    },

    onLoad () {
        this._super();
        i18n.init('zh');
        this.typeName=WndTypeDefine.WindowType.E_DT_NORMALITEMGETWAY;
        this.animeStartParam(0, 0);
        this.canClose = true;
        this.isFirstIn = true;
    },

    animeStartParam(paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            if (GlobalVar.getBannerSwitch()){
                weChatAPI.hideBannerAd();
            }
            if(this.sellMode){
                this.sellMode=false;
                var param=this.slot;
                // WindowManager.getInstance().popView(true,function(){
                //     GlobalVar.handlerManager.bagHandler.sendItemSellReq(param,1);
                // });
                WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_SELLITEM_WND,function (wnd, name, type){
                    wnd.getComponent(type).updateInfo(param);
                });
            }else{
                WindowManager.getInstance().popView(false,null,false);
            }
        } else if (name == "Enter") {
            this._super("Enter");
            if (GlobalVar.getBannerSwitch() && !GlobalVar.getNeedGuide()){
                weChatAPI.showBannerAd();
            }
            let itemData=GlobalVar.tblApi.getDataBySingleKey('TblItem', this.itemID);
            if (!itemData){
                GlobalVar.comMsg.showMsg("道具信息错误");
                return;
            }
            this.initGetWay(itemData.oVecItemOutput);
        }
    },

    updateInfo: function (id,num,level,slot) {
        id = typeof id !== 'undefined' ? id : 1;
        slot = typeof slot !== 'undefined' ? slot : -1;
        this.itemID=id;
        let item=this.addItem(id);
        let itemData=item.getComponent("ItemObject").updateItem(id);
        this.setName(itemData.strName,itemData.wQuality);
        this.setDescription(itemData.strItemDesc);
        this.setLabelNumberData(num);
        // this.clearGetWay();
        this.slot=slot;
        if(slot==-1){
            this.setBtnSellVisible(false);
        }
    },

    addItem:function(id){
        this.nodeIcon.removeAllChildren();
        let item=cc.instantiate(this.itemPrefab);
        this.nodeIcon.addChild(item);
        return item;
    },

    clearGetWay:function(){
        for (let i = this.getwayStack.length-1; i >=0 ; i--) {
            this.getwayStack[i].destroy();
            this.getwayStack.pop();
        }
    },

    initGetWay: function (way) {
        // this.clearGetWay();
        this.scrollviewGetWay.loopScroll.releaseViewItems();
        let self = this;
        // for (let i = 0; i < way.length; i++) {
        //     let getway = this.addGetWay();
        //     getway.getComponent("GetWayObject").updateGetWay(way[i].wSystemID, way[i].nParam1, way[i].nParam2);
        //     getway.getComponent("GetWayObject").setJumpCallback(function () {
        //         self.close();
        //     },)
        //     this.getwayStack.push(getway);
        // }
        if (this.isFirstIn){
            this.isFirstIn = false;
            this.scrollviewGetWay.loopScroll.setGapDisY(5);
            this.scrollviewGetWay.loopScroll.setCreateModel(this.getwayPrefab);
            this.scrollviewGetWay.loopScroll.registerCompleteFunc(function(){
                self.canClose = true;
            })
        }
        this.scrollviewGetWay.loopScroll.setTotalNum(way.length);
        this.scrollviewGetWay.loopScroll.registerUpdateItemFunc(function(getway, index){
            getway.getComponent("GetWayObject").updateGetWay(way[index].wSystemID, way[index].nParam1, way[index].nParam2);
            getway.getComponent("GetWayObject").setJumpCallback(function () {
                self.close();
            },)
        });
        this.scrollviewGetWay.loopScroll.resetView();


        if(way.length==0){
            let getway = this.addGetWay();
            getway.getComponent("GetWayObject").updateGetWay();
            this.getwayStack.push(getway);
        }
        this.scrollviewGetWay.scrollToTop();
    },

    addGetWay: function () {
        let getway = cc.instantiate(this.getwayPrefab);
        this.scrollviewGetWay.content.addChild(getway);
        return getway;
    },

    sellSelf:function(){
        if(this.slot!=-1){
            let itemData = GlobalVar.tblApi.getDataBySingleKey('TblItem', this.itemID);
            if (itemData != null) {
                if(itemData.bySellType!=1 || itemData.nSellPrice==0){
                    CommonWnd.showMessage(null, CommonWnd.oneConfirm, i18n.t('label.4000216'), i18n.t('label.4000219'));
                }else{
                    this.sellMode=true; 
                    this.close();
                }
            }
        }
    },
    
    setTitle: function (text) {
        this.labelTitle.string = text;
    },

    setName: function (text,quality) {
        this.labelIconName.string = text;
        this.labelIconName.node.color=GlobalFunc.getCCColorByQuality(quality);
    },

    setSubTitle: function (text) {
        this.labelItemAttribute.string = text;
    },

    setDescription: function (text) {
        this.labelItemDescription.string = text;
    },

    setLabelNumberData:function(text){
        this.labelNumber.string=text;
    },

    setBtnSellVisible:function(visible){
        visible = typeof visible !== 'undefined' ? visible : true;
        this.btnSell.node.active = visible;
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
        if (!this.canClose){
            return;
        }
        this.scrollviewGetWay.loopScroll.releaseViewItems();
        this._super();
    },

});
