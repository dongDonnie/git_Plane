
const RootBase = require("RootBase");
const WindowManager = require("windowmgr");
const GlobalVar = require('globalvar')
const WndTypeDefine = require("wndtypedefine");
const EventMsgID = require("eventmsgid");
const GameServerProto = require("GameServerProto");
const i18n = require('LanguageData');
const weChatAPI = require("weChatAPI");
const CommonWnd = require("CommonWnd")

const PAGE_RECHARGE = 0;
const PAGE_VIPRIGHT = 1;

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
        itemPrefab: {
            default: null,
            type: cc.Prefab,
        },
        btnRecvVipReward: {
            default: null,
            type: cc.Button,
        },
        btnOperate: {
            default: null,
            type: cc.Button,
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
            this.node.getChildByName("nodeExchange").getChildByName("btnExchange").active = false;
        }else{
            this.node.getChildByName("nodeExchange").getChildByName("btnExchange").active = true;
        }
        this.curMode = PAGE_RECHARGE;
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
            this.curMode = PAGE_RECHARGE;
            this.rechargeScroll.node.active = true;
            this.node.getChildByName("nodeExchange").active = true;
            this.node.getChildByName("nodeVipDesc").active = false;

            GlobalVar.eventManager().removeListenerWithTarget(this);
            WindowManager.getInstance().popView(false, null, false, false);
        } else if (name == "Enter") {
            this._super("Enter");
            if (GlobalVar.getBannerSwitch()){
                weChatAPI.justHideBanner();
            }
            this.initRechargeWnd();
            this.registerEvent();
        }
    },

    registerEvent: function () {
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_VOUCHER_RESULT, this.resetVocherCount, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_RECHARGE_RESULT, this.showRechargeResult, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_VIP_PACKAGEDATA, this.recvVipPackageData, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_VIP_REWARD_FLAG_CHANGE, this.setVipPackageFlag, this);
    },

    initRechargeWnd: function () {
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

        this.rechargeScroll.scrollToTop();

        this.initVipNode();
        this.setVipPackageFlag();
    },

    initVipNode: function () {
        let nodeVip = this.node.getChildByName("nodeVip");
        let nodeRecharge = nodeVip.getChildByName("nodeRecharge");
        let vipLevel = GlobalVar.me().vipLevel;
        let vipData = GlobalVar.tblApi.getDataBySingleKey('TblVipRight', vipLevel + 1);
        if (!vipData){
            vipData = GlobalVar.tblApi.getDataBySingleKey('TblVipRight', vipLevel);
            nodeRecharge.getChildByName("labelUpLevelTip").getComponent(cc.Label).string = "";
            nodeRecharge.getChildByName("labelUpLevel").getComponent(cc.Label).string = i18n.t('label.4000507');
            nodeRecharge.getChildByName("label").active = false;
            nodeRecharge.getChildByName("spriteIcon").active = false;
        }else{
            nodeRecharge.getChildByName("labelUpLevelTip").getComponent(cc.Label).string = i18n.t('label.4000504').replace("%left", vipData.nRecharge - GlobalVar.me().diamondCz);
            nodeRecharge.getChildByName("labelUpLevel").getComponent(cc.Label).string = "贵族" + (vipLevel + 1);
        }
        nodeVip.getChildByName("labelVipLevel").getComponent(cc.Label).string = vipLevel;
        this.btnOperate.node.getComponent("ButtonObject").setText(i18n.t('label.4000501'));

        nodeVip.getChildByName("labelRate").getComponent(cc.Label).string = GlobalVar.me().diamondCz + "/" + vipData.nRecharge;
        nodeVip.getChildByName("progressBarLevel").getComponent(cc.ProgressBar).progress = (GlobalVar.me().diamondCz / vipData.nRecharge) > 1?1:(GlobalVar.me().diamondCz / vipData.nRecharge);
    },

    resetVocherCount: function () {
        if (GlobalVar.me().getVoucher() == 0){
            this.node.getChildByName("nodeExchange").getChildByName("btnExchange").active = false;
        }else{
            this.node.getChildByName("nodeExchange").getChildByName("btnExchange").active = true;
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
            recharge.getChildByName("nodeTitle").getChildByName("spriteFirstTime").active = true;
        }else{
            recharge.getChildByName("nodeTitle").getChildByName("spriteFirstTime").active = false;
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
        recharge.getChildByName("nodeTitle").getChildByName("labelTitle").getComponent(cc.Label).string = strTitle;
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
        } else if (window && window["wywGameId"]=="5469"){

        } else{
            GlobalVar.handlerManager().rechargeHandler.sendRcgReq(recharge.data.wID);
        }

    },

    showRechargeResult: function(event){
        if (event.ErrCode && event.ErrCode != GameServerProto.PTERR_SUCCESS){
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        if (GlobalVar.me().getVoucher() == 0){
            this.node.getChildByName("nodeExchange").getChildByName("btnExchange").active = false;
        }else{
            this.node.getChildByName("nodeExchange").getChildByName("btnExchange").active = true;
        }
        this.labelVocherCount.string = GlobalVar.me().getVoucher();
        CommonWnd.showExDiamondWnd();
        this.rechargeScroll.loopScroll.refreshViewItem();
        this.initVipNode();
    },

    recvVipPackageData: function(event){
        if (event.ErrCode && event.ErrCode != GameServerProto.PTERR_SUCCESS){
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }

        this.refreshVipWnd(this.curShowVipLevel);

        CommonWnd.showTreasureExploit(event.OK.Item);
    },
    setVipPackageFlag: function (event) {
        this.btnOperate.node.getChildByName("spriteHot").active = GlobalVar.me().rechargeData.getCanGetRewardHotFlag();
    },

    onBtnRecvVipPackage: function (event) {
        // GlobalVar.comMsg.showMsg("功能未完成，也需要配完表");
        // return;
        GlobalVar.handlerManager().rechargeHandler.sendVipPackageGetReq(this.curShowVipLevel);
    },

    onBtnExchange: function (event) {
        CommonWnd.showExDiamondWnd();
    },

    onBtnOperate: function (event) {
        if (this.curMode == PAGE_RECHARGE){
            this.curMode = PAGE_VIPRIGHT;
            this.rechargeScroll.node.active = false;
            this.node.getChildByName("nodeExchange").active = false;
            this.node.getChildByName("nodeVipDesc").active = true;
            this.refreshVipWnd(GlobalVar.me().vipLevel);
            this.curShowVipLevel = GlobalVar.me().vipLevel;
            (this.curShowVipLevel == 0) && (this.curShowVipLevel = 1);
            this.btnOperate.node.getComponent("ButtonObject").setText(i18n.t('label.4000502'));
            this.btnOperate.node.getChildByName("spriteHot").active = false;
        }else if (this.curMode == PAGE_VIPRIGHT){
            this.curMode = PAGE_RECHARGE;
            this.rechargeScroll.node.active = true;
            this.node.getChildByName("nodeExchange").active = true;
            this.node.getChildByName("nodeVipDesc").active = false;
            this.btnOperate.node.getComponent("ButtonObject").setText(i18n.t('label.4000501'));
            this.btnOperate.node.getChildByName("spriteHot").active = GlobalVar.me().rechargeData.getCanGetRewardHotFlag();
        }
    },

    refreshVipWnd: function (level) {
        let nodeVipDesc = this.node.getChildByName("nodeVipDesc");
        let vipLevel = level == 0?1:level;
        let vipData = GlobalVar.tblApi.getDataBySingleKey('TblVipRight', vipLevel);

        nodeVipDesc.getChildByName("btnLast").active = vipLevel > 1;
        nodeVipDesc.getChildByName("btnNext").active = vipLevel < GlobalVar.tblApi.getLength('TblVipRight') - 1;

        nodeVipDesc.getChildByName("labelVip").getComponent(cc.Label).string = i18n.t('label.4000503').replace("%level", vipLevel);
        let vipRightScorll = nodeVipDesc.getChildByName("scrollVipRight").getComponent(cc.ScrollView);

        vipRightScorll.scrollToTop();
        let labelVipRightDesc = vipRightScorll.content.getChildByName("labelVipRightDesc");
        let vipRight = vipData.oVecRight;
        labelVipRightDesc.getComponent(cc.Label).string = ""
        for (let i = 0; i < vipRight.length; i++){
            labelVipRightDesc.getComponent(cc.Label).string += vipRight[i] + "\n";
        }

        nodeVipDesc.getChildByName("nodeGetItem").removeAllChildren();
        let vipReward = vipData.oVecItem;
        for (let i = 0; i<vipReward.length; i++){
            let item = cc.instantiate(this.itemPrefab);
            item.getComponent("ItemObject").updateItem(vipReward[i].wItemID, vipReward[i].nCount);
            item.getComponent("ItemObject").setLabelNumberData(vipReward[i].nCount, true);
            nodeVipDesc.getChildByName("nodeGetItem").addChild(item);
            item.getComponent("ItemObject").setClick(true, 2);
        }

        let vipPackage = GlobalVar.me().rechargeData.getVipPackageData();
        if (vipPackage.indexOf(vipLevel) != -1){
            nodeVipDesc.getChildByName("btnRecv").active = false;
            nodeVipDesc.getChildByName("spriteAlreadRecv").active = true;
        }else{
            nodeVipDesc.getChildByName("btnRecv").active = true;
            nodeVipDesc.getChildByName("btnRecv").getComponent(cc.Button).interactable = GlobalVar.me().vipLevel >= vipLevel;
            nodeVipDesc.getChildByName("btnRecv").getChildByName("spriteHot").active =  GlobalVar.me().vipLevel >= vipLevel;
            nodeVipDesc.getChildByName("spriteAlreadRecv").active = false; 
        }
        nodeVipDesc.getChildByName("btnLast").getChildByName("spriteHot").active = false;
        nodeVipDesc.getChildByName("btnNext").getChildByName("spriteHot").active = false;
        for (let i = 1; i < vipLevel && i <= GlobalVar.me().vipLevel; i++){
            if (vipPackage.indexOf(i) == -1){
                nodeVipDesc.getChildByName("btnLast").getChildByName("spriteHot").active = true;
                break;
            }
        }
        for (let i = vipLevel + 1; i <= GlobalVar.me().vipLevel; i++){
            if (vipPackage.indexOf(i) == -1){
                nodeVipDesc.getChildByName("btnNext").getChildByName("spriteHot").active = true;
                break;
            }
        }
    },

    onBtnChangeVipDesc: function (event, index) {
        let opera = parseInt(index);
        if (opera == 1 && this.curShowVipLevel < GlobalVar.tblApi.getLength('TblVipRight') - 1){
            this.curShowVipLevel += opera;
        }else if (opera == -1 && this.curShowVipLevel > 1){
            this.curShowVipLevel += opera;
        }
        this.refreshVipWnd(this.curShowVipLevel);
    },

    close: function () {
        if(this.canClose){
            this.rechargeScroll.loopScroll.releaseViewItems();
            this.node.getChildByName("nodeVipDesc").active = false;
            this._super();
        }
    },
});
