
const RootBase = require("RootBase");
const WindowManager = require("windowmgr");
const GlobalVar = require('globalvar')
const WndTypeDefine = require("wndtypedefine");
const EventMsgID = require("eventmsgid");
const GameServerProto = require("GameServerProto");
const i18n = require('LanguageData');
const weChatAPI = require("weChatAPI");
const CommonWnd = require("CommonWnd")
cc.Class({
    extends: RootBase,

    properties: {
        rechargeScroll: {
            default: null,
            type: cc.ScrollView,
        },
        rechargeModel: {
            default: null,
            type: cc.Node,
        },
        rechargeList: [],
        labelVocherCount: {
            default: null,
            type: cc.Label,
        },
    },

    onLoad: function () {
        this._super();
        i18n.init('zh');
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_RECHARGE_WND;

        this.content = this.rechargeScroll.content;
        
        this.animeStartParam(0, 0);
        this.isFirstIn = true;

        if (GlobalVar.me().getVoucher() == 0){
            this.node.getChildByName("btnExchange").active = false;
        }else{
            this.node.getChildByName("btnExchange").active = true;
        }
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
            this.canClose = false;
            if (this.isFirstIn){
                this.addPrefabsText();
                this.isFirstIn = false;
            }else{
                this.rechargeScroll.loopScroll.resetView();
            }
            this.labelVocherCount.string = GlobalVar.me().getVoucher();
            if (GlobalVar.me().getVoucher() > 0) {
                CommonWnd.showExDiamondWnd();
            }
            GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_VOUCHER_RESULT, this.resetVocherCount, this);
            GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_RECHARGE_RESULT, this.showRechargeResult, this);
            this.rechargeScroll.scrollToTop();
        }
    },

    resetVocherCount: function () {
        if (GlobalVar.me().getVoucher() == 0){
            this.node.getChildByName("btnExchange").active = false;
        }else{
            this.node.getChildByName("btnExchange").active = true;
        }
        this.labelVocherCount.string = GlobalVar.me().getVoucher();
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

    addPrefabsText: function () {
        let rechargeDataList = GlobalVar.tblApi.getData('TblRecharge');
        let showData = []
        for (let i in rechargeDataList) { // 遍历表，用表中数据初始化加成列表
            let rechargeData = rechargeDataList[i];
            if (rechargeData.byType == GameServerProto.PT_RCG_TYPE_AMS){
                continue;
            }
            showData.push(rechargeData);
        }
        // for (let i = 1; i <= length; i++) { // 遍历表，用表中数据初始化加成列表
        //     let recgargeData = rechargeDataList[i]
        //     if (!recgargeData) {
        //         length +=1;
        //         continue;
        //     }
        //     let recharge = null;
        //     if( i === 1){
        //         recharge = this.rechargeModel;
        //     }else{
        //         recharge = cc.instantiate(this.rechargeModel);
        //         this.content.addChild(recharge);
        //     }
            
        //     this.updateRecharge(recharge, recgargeData);
        //     this.rechargeList[recgargeData.wID] = recharge;
        // }

        let self = this;
        this.rechargeScroll.loopScroll.setTotalNum(showData.length);
        this.rechargeScroll.loopScroll.setCreateInterval(0);
        this.rechargeScroll.loopScroll.setCreateModel(this.rechargeModel);
        this.rechargeScroll.loopScroll.saveCreatedModel(this.content.children);
        this.rechargeScroll.loopScroll.registerUpdateItemFunc(function(recharge, index){
            self.updateRecharge(recharge, showData[index]);
        });
        this.rechargeScroll.loopScroll.registerCompleteFunc(function(){
            self.canClose = true;
        })
        this.rechargeScroll.loopScroll.resetView();

        this.rechargeScroll.scrollToTop();
    },

    updateRecharge: function(recharge, data){
        recharge.data = data;
        recharge.opacity = 255;
        let rechargeCount = GlobalVar.me().rechargeData.getRechargeCountByRechargeID(data.wID);
        let strTitle = data.strTitle;
        let strTip = data.strTip;
        if (data.byType == GameServerProto.PT_RCG_TYPE_NORMAL && rechargeCount == 0){
            strTitle += "(首充双倍)";
        }

        if (data.byType == GameServerProto.PT_RCG_HUIKUI_BUY_MONTHCARD){
            let leftDay = GlobalVar.me().rechargeData.getTimeCardLeftDayByID(data.wID);
            // let drawToday = GlobalVar.me().rechargeData.getTimeCardDrawToday(data.wID);
            if (leftDay > 0){
                strTip = "剩余%d天".replace("%d", leftDay);
                // if (drawToday == 0){
                //     strTip += "，今日钻石尚未领取"
                // }
            }
            if (leftDay <= 3){
                recharge.getChildByName("node").getChildByName("btnRecharge").getComponent(cc.Button).interactable = true;
            }else{
                recharge.getChildByName("node").getChildByName("btnRecharge").getComponent(cc.Button).interactable = false;
            }
        }else{
            recharge.getChildByName("node").getChildByName("btnRecharge").getComponent(cc.Button).interactable = true;
        }
        recharge.getChildByName("labelTitle").getComponent(cc.Label).string = strTitle;
        recharge.getChildByName("labelDesc").getComponent(cc.Label).string = strTip;
        recharge.getChildByName("node").getChildByName("labelPrice").getComponent(cc.Label).string = i18n.t('label.4000243').replace('%d', data.dMoneyCost);
        // let item = recharge.getChildByName("iconItemObject").getComponent("ItemObject")
        // item.updateItem(data.wIconID);
        recharge.getChildByName("spriteIcon").getComponent("RemoteSprite").setFrame(data.wIconID - 1);
        // item.updateItem(4);
        // recharge.x = -1000;
        recharge.x = 0;
    },

    onRechargeIconClick: function(event){
        // let item = event.target;
        // let recharge = item.parent;
        // WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMALITEMINFO, function (wnd, name, type){
        //     wnd.getComponent(type).updateBoxInfo(self.itemID, self.itemData.wQuality, 0, "充值详情");
        // });
    },

    onBuyButtonClick: function(event){
        let btnBuy = event.target;
        let recharge = btnBuy.parent.parent;
        if (cc.sys.platform === cc.sys.WECHAT_GAME){
            let amount = recharge.data.dMoneyCost;
            let productID = recharge.data.wID;
            let productName = recharge.data.strTitle;
            if (GlobalVar.isAndroid){
                weChatAPI.androidPayment(amount, productID, productName, GlobalVar.me().loginData.getLoginReqDataServerID(), function(data){
                    // console.log("米大师虚拟支付接口执行完毕!!!", data);
                    // data.bill_no //订单号，有效期是 48 小时
                    // data.balance	//预扣后的余额
                    // data.used_gen_balance //本次扣的赠送币的余额
                })
            }else if (GlobalVar.isIOS){
                weChatAPI.iosPayment(amount, productID, productName, GlobalVar.me().loginData.getLoginReqDataServerID(), function(data){
                    // console.log("米大师虚拟支付接口执行完毕!!!", data);
                    // data.bill_no //订单号，有效期是 48 小时
                    // data.balance	//预扣后的余额
                    // data.used_gen_balance //本次扣的赠送币的余额
                })
            }

        }else{
            GlobalVar.handlerManager().rechargeHandler.sendRcgReq(recharge.data.wID);
        }

    },

    showRechargeResult: function(event){
        if (event.ErrCode && event.ErrCode != GameServerProto.PTERR_SUCCESS){
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        if (GlobalVar.me().getVoucher() == 0){
            this.node.getChildByName("btnExchange").active = false;
        }else{
            this.node.getChildByName("btnExchange").active = true;
        }
        this.labelVocherCount.string = GlobalVar.me().getVoucher();
        CommonWnd.showExDiamondWnd();
        // GlobalVar.comMsg.showMsg("充值成功");
        this.rechargeScroll.loopScroll.refreshViewItem();
    },

    onBtnExchange: function (event) {
        CommonWnd.showExDiamondWnd();
    },


    close: function () {
        if(this.canClose){
            this.rechargeScroll.loopScroll.releaseViewItems();
            this._super();
        }
    },
});
