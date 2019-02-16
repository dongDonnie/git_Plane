const WindowManager = require("windowmgr");
const GlobalVar = require("globalvar");
const EventMsgId = require("eventmsgid");
const GameServerProto = require("GameServerProto");
const GlobalFunctions = require("GlobalFunctions");
const RootBase = require("RootBase");
const CommonWnd = require("CommonWnd");
const i18n = require('LanguageData');


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
        /*lblItemName1: {
            default: null,
            type: cc.Label
        },
        lblItemName2: {
            default: null,
            type: cc.Label
        },
        nodeItemIcon1: {
            default: null,
            type: cc.Node
        },
        nodeItemIcon2: {
            default: null,
            type: cc.Node
        },
        btnBuy1: {
            default: null,
            type: cc.Button
        },
        btnBuy2: {
            default: null,
            type: cc.Button
        },
        lblCostCount1: {
            default: null,
            type: cc.Label
        },
        lblCostCount2: {
            default: null,
            type: cc.Label
        },*/
        btnClose: {
            default: null,
            type: cc.Button,
        },
        pnlMain: {
            default: null,
            type: cc.Layout
        },
        nodeGoods: {
            default: null,
            type: cc.Node
        },
        imgBg: {
            default: null,
            type: cc.Sprite
        },
        lblRefresh: {
            default: null,
            type: cc.Label
        },
        lblRefreshTime: {
            default: null,
            type: cc.Label
        },
        lblTime: {
            default: null,
            type: cc.Label
        },
        nodeRefreshCostIcon: {
            default: null,
            type: cc.Node
        },
        lblRefreshCostNum: {
            default: null,
            type: cc.Label
        },

        dirty: true,
        refreshTimes: 0,
        time: 0,
        serverTime: 0,
        //refreshCost: {},
        itemArray: [],
        describe: "",
        msgId: 0,
        hasData: false,
        type: 1,
        countTime: -1,
        refreshComplete: false,
        nodeRefreshCompleteNum: 0,
    },

    ctor: function () {
        self = this;
        this.scheduleHandler = null;
    },

    touchMain: function () {
        // cc.log("touchMain");
    },

    onLoad: function () {
        this._super();
        self.lblRefreshTime.node.active = false;
        this.itemNodeArray = []; //保存需要运动的那几个节点
        this.animeStartParam(0, 0);
        this.refreshComplete = true;
        this.firstEnter = true;
    },

    animeStartParam(paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;
    },

    setStoreType: function (param) {
        this.storeType = param;
    },

    onStoreDataGet: function (data) {
        this.refreshTimes = data.refreshTimes;
        this.time = data.time;
        this.serverTime = data.serverTime;
        this.itemArray = data.itemArray;
        this.refreshCost = data.refreshCost;
        this.drity = true;
        this.describe = data.describe;
        this.msgId = data.msgId;
        this.type = data.type;
        this.hasData = true; //确保有数据过后才开始初始化窗口
        // this.firstEnter = true;
        self = this;
        this.refreshComplete = false;
        this.updateWndSize();
        let refreshLimitTimes = GlobalVar.tblApi.getDataBySingleKey('TblVipRight', GlobalVar.me().vipLevel).wStoreRefreshLimit;
        this.node.getChildByName("imgBg").getChildByName("lblLeftTimes").getComponent(cc.Label).string = this.refreshTimes + '/' + refreshLimitTimes;
    },

    updateWndSize: function (i) {
        // if (i == 0 && this.firstEnter) {
        if (this.firstEnter) {
            this.pnlMain.node.removeAllChildren();
            this.firstEnter = false;
        }

        if (this.refreshComplete) {
            return;
        }
        // this.refreshComplete = true;
        //this.updateItem(this.nodeGoods, this.itemArray[0], this.itemArray[1]);
        // let node = this.pnlMain.node.children[i / 2];  //由于一个大节点包含左右两个物品节点
        // if (!node) {
        //     node = cc.instantiate(this.nodeGoods);
        //     node.getChildByName("ShopGoods1").getChildByName("btno_Buy1").newTag = i;
        //     node.getChildByName("ShopGoods2").getChildByName("btno_Buy2").newTag = i + 1;
        //     this.pnlMain.node.addChild(node);
        // }
        // this.updateItem(node, this.itemArray[i], this.itemArray[i + 1]);

        for (let i = 0; i < 4; i++) {
            let node = this.pnlMain.node.children[i];
            if (!node) {
                node = cc.instantiate(this.nodeGoods);
                node.getChildByName("ShopGoods1").getChildByName("btno_Buy1").newTag = i * 2;
                node.getChildByName("ShopGoods2").getChildByName("btno_Buy2").newTag = i * 2 + 1;
                this.pnlMain.node.addChild(node);
            }
            this.updateItem(node, this.itemArray[i * 2], this.itemArray[i * 2 + 1], i);
        }

        let self = this;
        for (let i = 0; i < this.pnlMain.node.children.length; i++) {
            let node = this.pnlMain.node.children[i];
            let node1 = node.getChildByName("ShopGoods1");
            let node2 = node.getChildByName("ShopGoods2");
            node1.active = true;
            node2.active = true;
            node1.x = -1000;
            node2.x = 1000;
            node1.runAction(cc.sequence(cc.delayTime(i * 0.1), cc.moveBy(0.3, 852.5, 0), cc.callFunc(function (target) {
                target.x = -147.5;
            })));
            node2.runAction(cc.sequence(cc.delayTime(i * 0.1), cc.moveBy(0.3, -852.5, 0), cc.callFunc(function (target) {
                target.x = 147.5;
                if (i == 3) {
                    self.refreshComplete = true;
                }
            })));
        }


        // this.imgBg.node.height = this.itemArray.length / 2 * 165 + 200;
        // this.lblTitle.getComponent(cc.Widget).updateAlignment();
        // this.btnClose.getComponent(cc.Widget).updateAlignment();
        // this.lblRefreshCostNum.getComponent(cc.Widget).updateAlignment();
        // this.lblRefreshTime.getComponent(cc.Widget).updateAlignment();
        // this.lblRefresh.getComponent(cc.Widget).updateAlignment();
        // this.lblTime.getComponent(cc.Widget).updateAlignment();
        // this.lblTitle.getComponent(cc.Widget).updateAlignment();
        // this.imgBg.node.getChildByName("btnoRefresh").getComponent(cc.Widget).updateAlignment();
    },

    updateItem: function (node, item1, item2, index) { //更新icon
        // console.log(item1);
        var node1 = node.getChildByName("ShopGoods1");
        var itemLeft = GlobalVar.tblApi.getDataBySingleKey('TblItem', item1.itemId);
        this.setString(node1.getChildByName("lblShopGoods1").getComponent(cc.Label), itemLeft.strName);
        node1.getChildByName("lblShopGoods1").color = GlobalFunctions.getCCColorByQuality(itemLeft.wQuality);
        this.setString(node1.getChildByName("lblCostCount1").getComponent(cc.Label), item1.costNum);
        this.setIcon(node1.getChildByName("nodeShopGoods1"), itemLeft.wItemID, item1.num);
        this.setIcon(node1.getChildByName("nodeCostIcon1"), item1.costId);
        node1.getChildByName("nodeCostIcon1").getChildByName("ItemObject").getComponent("ItemObject").setSpriteEdgeVisible(false);
        if (item1.state == 0) {
            node1.getChildByName("btno_Buy1").active = false;
            node1.getChildByName("spriteAlreadBuy").active = true;
            node1.getChildByName("nodeCostIcon1").active = false;
            node1.getChildByName("lblCostCount1").active = false;
        } else {
            node1.getChildByName("btno_Buy1").getChildByName("spriteVideo").active = false;
            node1.getChildByName("btno_Buy1").getChildByName("spriteShare").active = false;
            if (item1.costType == GameServerProto.PT_MONEY_FREE) {
                node1.getChildByName("nodeCostIcon1").active = false;
                node1.getChildByName("lblCostCount1").active = false;
                if (GlobalVar.getShareSwitch() && (GlobalVar.isWechatPlat || GlobalVar.isQQPlayPlat || GlobalVar.isDebug)) {
                    node1.getChildByName("btno_Buy1").getChildByName("spriteVideo").active = true;
                    node1.getChildByName("btno_Buy1").getComponent("ButtonObject").setText("  " + i18n.t('label.4000336'));
                } if (GlobalVar.getShareSwitch() && GlobalVar.isWanbaPlat){
                    node1.getChildByName("btno_Buy1").getChildByName("spriteShare").active = true;
                    node1.getChildByName("btno_Buy1").getComponent("ButtonObject").setText("  " + i18n.t('label.4000336'));
                } else {
                    node1.getChildByName("btno_Buy1").getComponent("ButtonObject").setText(i18n.t('label.4000241'));
                }
            } else {
                node1.getChildByName("btno_Buy1").getComponent("ButtonObject").setText(i18n.t('label.4000214'));
                node1.getChildByName("nodeCostIcon1").active = true;
                node1.getChildByName("lblCostCount1").active = true;
            }

            node1.getChildByName("btno_Buy1").active = true;
            node1.getChildByName("spriteAlreadBuy").active = false;
        }
        node1.getChildByName("btno_Buy1").getComponent(cc.Button).clickEvents[0].customEventData = item1.costType;
        var node2 = node.getChildByName("ShopGoods2");
        var itemRight = GlobalVar.tblApi.getDataBySingleKey('TblItem', item2.itemId);
        this.setString(node2.getChildByName("lblShopGoods2").getComponent(cc.Label), itemRight.strName);
        node2.getChildByName("lblShopGoods2").color = GlobalFunctions.getCCColorByQuality(itemRight.wQuality);
        this.setString(node2.getChildByName("lblCostCount2").getComponent(cc.Label), item2.costNum);
        this.setIcon(node2.getChildByName("nodeShopGoods2"), itemRight.wItemID, item2.num);
        this.setIcon(node2.getChildByName("nodeCostIcon2"), item2.costId);
        node2.getChildByName("nodeCostIcon2").getChildByName("ItemObject").getComponent("ItemObject").setSpriteEdgeVisible(false);
        if (item2.state == 0) {
            node2.getChildByName("btno_Buy2").active = false;
            node2.getChildByName("spriteAlreadBuy").active = true;
            node2.getChildByName("nodeCostIcon2").active = false;
            node2.getChildByName("lblCostCount2").active = false;
        } else {
            node2.getChildByName("btno_Buy2").getChildByName("spriteVideo").active = false;
            node2.getChildByName("btno_Buy2").getChildByName("spriteShare").active = false;
            if (item2.costType == GameServerProto.PT_MONEY_FREE) {
                node2.getChildByName("nodeCostIcon2").active = false;
                node2.getChildByName("lblCostCount2").active = false;
                if (GlobalVar.getShareSwitch() && (GlobalVar.isWechatPlat || GlobalVar.isQQPlayPlat || GlobalVar.isDebug)) {
                    node2.getChildByName("btno_Buy2").getChildByName("spriteVideo").active = true;
                    node2.getChildByName("btno_Buy2").getComponent("ButtonObject").setText("  " + i18n.t('label.4000336'));
                } if (GlobalVar.getShareSwitch() && GlobalVar.isWanbaPlat){
                    node2.getChildByName("btno_Buy2").getChildByName("spriteShare").active = true;
                    node2.getChildByName("btno_Buy2").getComponent("ButtonObject").setText("  " + i18n.t('label.4000336'));
                } else {
                    node2.getChildByName("btno_Buy2").getComponent("ButtonObject").setText(i18n.t('label.4000241'));
                }
            } else {
                node2.getChildByName("btno_Buy2").getComponent("ButtonObject").setText(i18n.t('label.4000214'));
                node2.getChildByName("nodeCostIcon2").active = true;
                node2.getChildByName("lblCostCount2").active = true;
            }

            node2.getChildByName("btno_Buy2").active = true;
            node2.getChildByName("spriteAlreadBuy").active = false;
        }
        node2.getChildByName("btno_Buy2").getComponent(cc.Button).clickEvents[0].customEventData = item2.costType;
        // node1.x = -1000;
        // node2.x = 1000;
        // node1.x = -147.5;
        // node2.x = 147.5
        // node1.runAction(cc.sequence(cc.delayTime(index *0.3), cc.moveBy(0.2, 852.5, 0), cc.callFunc(function (target) {
        //     target.x = -147.5;
        // })));
        // moveNode(node1, 850, 852.5);

        // node2.stopAllActions();
        // node2.x = 1000;
        // node2.runAction(cc.sequence(cc.delayTime(index *0.3), cc.moveBy(0.2, -852.5, 0), cc.callFunc(function (target) {
        //     target.x = 147.5;
        // })));
        this.itemNodeArray.push(node1);
        this.itemNodeArray.push(node2);
    },

    pop: function () {
        // this.dirty = false;
        // for (let i = 0; i < this.itemNodeArray.length; i++) {    //停掉所有动作
        //     this.itemNodeArray[i].stopAllActions();
        // }
        this.close();
    },

    onDestroy: function () {
        if (cc.isValid(this.scheduleHandler)) {
            clearInterval(this.scheduleHandler);
            this.scheduleHandler = null;
        }
        GlobalVar.eventManager().removeListenerWithTarget(this);
    },

    enter: function (isRefresh) {
        this.scheduleHandler = setInterval(this.updateRefreshTime.bind(this), 1000);

        if (isRefresh) {
            this._super(true);
        } else {
            this._super(false);
        }

    },

    escape: function (isRefresh) {
        if (cc.isValid(this.scheduleHandler)) {
            clearInterval(this.scheduleHandler);
            this.scheduleHandler = null;
        }

        if (isRefresh) {
            this._super(true);
        } else {
            this._super(false);
        }
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            GlobalVar.eventManager().removeListenerWithTarget(this);
            WindowManager.getInstance().popView(false, null, false);
        } else if (name == "Enter") {
            this._super("Enter");
            this.registerEvents();
            this.requestStoreData();

            for (let i = 0; i < this.pnlMain.node.children.length; i++) {
                let node = this.pnlMain.node.children[i];
                let node1 = node.getChildByName("ShopGoods1");
                let node2 = node.getChildByName("ShopGoods2");
                node1.active = false;
                node2.active = false;
            }
            this.refreshComplete = false;
        }
    },

    requestStoreData: function () {
        let msg = {
            Type: this.storeType,
        };
        GlobalVar.handlerManager().storeHandler.sendReq(GameServerProto.GMID_STORE_DATA_REQ, msg);
    },

    registerEvents: function () {

        GlobalVar.eventManager().addEventListener(EventMsgId.EVENT_STORE_DATA_NTF, this.onStoreDataGet, this);
        GlobalVar.eventManager().addEventListener(EventMsgId.EVENT_STORE_BUY_NTF, this.onStoreBuyDataGet, this);
        GlobalVar.eventManager().addEventListener(EventMsgId.EVENT_STORE_REFRESH_NTF, this.onStoreRefreshDataGet, this);
    },

    update: function (dt) {
        if (!this.dirty)
            return;
        if (!this.hasData)
            return;
        // this.refreshComplete = true;
        // if (this.countTime / 10 <= this.itemArray.length - 1) {
        // this.countTime++;
        // this.refreshComplete = false;
        // }
        //this.lblRefresh.node.color=LabelColor.CCBlue;
        // if (this.countTime % 20 == 0)
        // this.updateWndSize(this.countTime / 10);
        // this.setRefreshTime();
        // this.lblRefreshTime.string = "今日已刷新" + this.refreshTimes + "次";
        var refreshPlan = GlobalVar.me().storeData.getRefreshCostPlan();
        let refreshCardCount = GlobalVar.me().bagData.getItemCountById(refreshPlan.oVecCost1[0].wItemID);
        if (GlobalVar.me().bagData.getItemCountById(refreshPlan.oVecCost1[0].wItemID) > 0) {
            this.setString(this.lblRefreshCostNum, refreshCardCount + "/" + refreshPlan.oVecCost1[0].nCount);
            this.setIcon(this.nodeRefreshCostIcon, refreshPlan.oVecCost1[0].wItemID);
        } else {
            this.setString(this.lblRefreshCostNum, refreshPlan.oVecCost2[0].nCount);
            this.setIcon(this.nodeRefreshCostIcon, refreshPlan.oVecCost2[0].wItemID);
        }
        this.nodeRefreshCostIcon.getChildByName("ItemObject").getComponent("ItemObject").setSpriteEdgeVisible(false);

        // if(this.itemNodeArray[0].x<-147.5){
        //     this.itemNodeArray[0].x+=10;
        //     if(this.itemNodeArray[0].x>-147.5){
        //         this.itemNodeArray[0].x=-147.5;
        //     }
        // }
        this.updateNodePos();
        // for (let i = 0; i < this.itemNodeArray.length; i++) {
        //     if (i % 2 == 0) {
        //         console.log(this.itemNodeArray[i].x);
        //     }
        // }
    },

    setString: function (lbl, text) {
        lbl.string = text;
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

    updateRefreshTime: function (dt) {
        if (!this.hasData)
            return;
        this.serverTime++;
        this.setRefreshTime();
    },

    setRefreshTime: function () {
        if (GlobalVar.networkManager().connectError) {
            return;
        }
        var leftTime = this.time - this.serverTime;
        // if (leftTime < 0)
        if (leftTime < 0 && this.refreshComplete) {
            this.requestStoreData();
            this.hasData = false;
            this.refreshComplete = false;
        }
        var hours = parseInt(leftTime / 3600);
        leftTime = leftTime % 3600;
        var mins = parseInt(leftTime / 60) % 60;
        var secs = leftTime % 60;
        this.lblTime.string = (hours < 10 ? "0" + hours : hours) + ":" + (mins < 10 ? "0" + mins : mins) + ":" + (secs < 10 ? "0" + secs : secs);
    },

    onBtnBuyTouchedCallback(event, Type) {
        var req;
        var msg = {};
        switch (self.msgId) {
            case GameServerProto.GMID_STORE_DATA_ACK:
                req = GameServerProto.GMID_STORE_BUY_REQ;
                msg.Type = GameServerProto.PT_STORE_NORMAL;
                msg.Expires = self.time;
                msg.ID = event.target.newTag;
                break;
            default:
                break;
        }

        let platformApi = GlobalVar.getPlatformApi();
        if (!platformApi || !GlobalVar.getShareSwitch() || Type != GameServerProto.PT_MONEY_FREE) {
            GlobalVar.handlerManager().storeHandler.sendReq(req, msg);
        } else if (platformApi && (GlobalVar.isWechatPlat || GlobalVar.isQQPlayPlat)) {
            platformApi.showRewardedVideoAd(235, function () {
                GlobalVar.handlerManager().storeHandler.sendReq(req, msg);
            }, null, false);
        } else if (platformApi && GlobalVar.isWanbaPlat) {
            platformApi.shareNormal(135, function () {
                GlobalVar.handlerManager().storeHandler.sendReq(req, msg);
            })
        }
    },

    onStoreBuyDataGet: function (data) {
        this.itemArray[data.id].state = 0;
        let item = {
            ItemID: this.itemArray[data.id].itemId,
            Count: this.itemArray[data.id].num,
        }
        this.updateItemState();
        CommonWnd.showTreasureExploit([item]);
    },

    updateItemState: function () {
        for (let i = 0; i < this.itemArray.length; i++) {
            if (this.itemArray[i].state == 0) {
                if (i % 2 == 0) {
                    this.itemNodeArray[i].getChildByName("btno_Buy1").active = false;
                } else {
                    this.itemNodeArray[i].getChildByName("btno_Buy2").active = false;
                }
                this.itemNodeArray[i].getChildByName("spriteAlreadBuy").active = true;
            } else {
                if (i % 2 == 0) {
                    this.itemNodeArray[i].getChildByName("btno_Buy1").active = true;
                } else {
                    this.itemNodeArray[i].getChildByName("btno_Buy2").active = true;
                }
                this.itemNodeArray[i].getChildByName("spriteAlreadBuy").active = false;
            }
        }
    },

    onRefreshBtnTouched: function () {
        if (!this.refreshComplete)
            return;
        let refreshLimitTimes = GlobalVar.tblApi.getDataBySingleKey('TblVipRight', GlobalVar.me().vipLevel).wStoreRefreshLimit;

        if (self.refreshTimes >= refreshLimitTimes) {
            GlobalVar.comMsg.showMsg("今日刷新次数用尽(" + refreshLimitTimes + "次)");
            return;
        }
        var refreshPlan = GlobalVar.me().storeData.getRefreshCostPlan();
        if (GlobalVar.me().bagData.getItemCountById(refreshPlan.oVecCost1[0].wItemID) < refreshPlan.oVecCost1[0].nCount) {
            if (GlobalVar.me().bagData.getItemCountById(refreshPlan.oVecCost2[0].wItemID) < refreshPlan.oVecCost2[0].nCount) {
                // GlobalVar.comMsg.showMsg("钻石不足");
                CommonWnd.showNormalFreeGetWnd(GameServerProto.PTERR_DIAMOND_LACK);
                return;
            }
        }
        var req = GameServerProto.GMID_STORE_REFRESH_REQ;
        var msg = {
            Type: 1
        };
        GlobalVar.handlerManager().storeHandler.sendReq(req, msg);
    },

    onStoreRefreshDataGet: function (data) {
        self.itemArray = data.itemArray;
        self.refreshTimes = data.refreshTimes;
        self.itemNodeArray = [];
        this.runRefreshAnime();
        this.refreshComplete = false;
        this.updateWndSize();

        let refreshLimitTimes = GlobalVar.tblApi.getDataBySingleKey('TblVipRight', GlobalVar.me().vipLevel).wStoreRefreshLimit;
        this.node.getChildByName("imgBg").getChildByName("lblLeftTimes").getComponent(cc.Label).string = this.refreshTimes + '/' + refreshLimitTimes;
    },

    runRefreshAnime: function () {
        // self.nodeRefreshCompleteNum = 0;
        // for (let i = 0; i < self.pnlMain.node.children.length; i++) {
        // let node = self.pnlMain.node.children[i];
        // let node1 = node.getChildByName("ShopGoods1");
        // let node2 = node.getChildByName("ShopGoods2");
        // node1.stopAllActions();
        // node1.x = -147.5;
        // node1.runAction(cc.sequence(cc.delayTime(0.2 * i), cc.moveBy(0.2, -852.5, 0), cc.callFunc(function (target) {
        //     self.nodeRefreshCompleteNum++;
        //     if (self.nodeRefreshCompleteNum >= 8) {   //8个节点动作全部完成，开始刷新和下一步动作
        //         self.dirty = true;
        //         self.countTime = -1;
        //     }
        // })));
        // node2.stopAllActions();
        // node2.x = 147.5;
        // node2.runAction(cc.sequence(cc.delayTime(0.2 * i), cc.moveBy(0.2, 852.5, 0), cc.callFunc(function () {
        //     self.nodeRefreshCompleteNum++;
        //     if (self.nodeRefreshCompleteNum >= 8) {
        //         self.dirty = true;
        //         self.countTime = -1;
        //     }
        // })));
        // self.countTime = -1;
        // }
        self.dirty = true;
    },

    moveNode: function () {
        if (this.itemNodeArray[0].x > -147.5)
            return;
        this.itemNodeArray[0].x += 10;
        setTimeout(this.moveNode.bind(this), 16);
    },

    updateNodePos: function () {
        let length = parseInt(this.countTime / 20 + 1) * 2;
        length = length < this.itemNodeArray.length ? length : this.itemNodeArray.length;
        if (length == 0)
            return;
        for (let i = 0; i < length; i++) {
            if (i % 2 == 0) {
                if (this.itemNodeArray[i].x + 30 <= -147.5)
                    this.itemNodeArray[i].x += 30;
                else
                    this.itemNodeArray[i].x = -147.5;
            } else {
                if (this.itemNodeArray[i].x - 30 >= 147.5)
                    this.itemNodeArray[i].x -= 30;
                else
                    this.itemNodeArray[i].x = 147.5;
            }
        }
    },

    close: function () {
        if (!this.refreshComplete) {
            return;
        }
        for (let i = 0; i < this.pnlMain.node.children.length; i++) {
            let node = this.pnlMain.node.children[i];
            let node1 = node.getChildByName("ShopGoods1");
            let node2 = node.getChildByName("ShopGoods2");
            node1.active = false;
            node2.active = false;
        }
        this._super();
    },

});

// var moveNode = function (node, time, distance) {
//     if (time >= 0) {
//         console.log(node.x);
//         node.x += 1;
//         setTimeout(moveNode(node, time-1, distance), 100);
//     }
// }