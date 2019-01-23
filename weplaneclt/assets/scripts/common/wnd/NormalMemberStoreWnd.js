const WindowManager = require("windowmgr");
const GlobalVar = require("globalvar");
const EventMsgId = require("eventmsgid");
const GameServerProto = require("GameServerProto");
const GlobalFunctions = require("GlobalFunctions");
const RootBase = require("RootBase");
const CommonWnd = require("CommonWnd");
const i18n = require('LanguageData');


cc.Class({
    extends: RootBase,

    properties: {
        toggles: {
            default: [],
            type: cc.Node
        },
        funcPanel: {
            default: [],
            type: cc.Node
        },
        itemPrefab: {
            default: [],
            type: cc.Node
        },
        pieceNums: {
            default: [],
            type: cc.Label
        },
        lblTime: cc.Label,
        lblFreshTime:cc.Label,

    },

    ctor: function () {
        
    },

    onLoad: function () {
        this._super();
        this.animeStartParam(0, 0);
    },

    animeStartParam(paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;
    },

    enter: function (isRefresh) {
        this.setFreshTime();
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
        if (!!this.scheduleHandler) {
            GlobalVar.gameTimer().delTimer(this.scheduleHandler);
            this.scheduleHandler = null;
        }
    },

    onDestroy:  function () {
        if (!!this.scheduleHandler) {
            GlobalVar.gameTimer().delTimer(this.scheduleHandler);
            this.scheduleHandler = null;
        }
    },

    close: function () {
        if (!!this.scheduleHandler) {
            GlobalVar.gameTimer().delTimer(this.scheduleHandler);
            this.scheduleHandler = null;
        }
        this.funcPanel[0].parent.active = false;
        this.funcPanel[0].getChildByName('scrollView').getComponent('loopscrollview').releaseViewItems();
        this._super();
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            GlobalVar.eventManager().removeListenerWithTarget(this);
            WindowManager.getInstance().popView(false, null, true,true);
            this.releaseConstData();
        } else if (name == "Enter") {
            this._super("Enter");
            this.registerEvents();
            this.curIndex = -1;
            this.isClickIn = true;
            this.changePanel(null, 0);
            this.getConstData();
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

    registerEvents: function(){
        GlobalVar.eventManager().addEventListener(EventMsgId.EVENT_MEMBER_PIECE_DATA, this.memberPieceBack, this);
        GlobalVar.eventManager().addEventListener(EventMsgId.EVENT_MEMBER_STORE_DATA, this.memberStoreData, this);
        GlobalVar.eventManager().addEventListener(EventMsgId.EVENT_MEMBER_STORE_FRESH, this.memberStoreFresh, this);
        GlobalVar.eventManager().addEventListener(EventMsgId.EVENT_MEMBER_PIECE_CRYSTAL_NTF, this.memberPieceCrystalNtf, this);
        GlobalVar.handlerManager().memberHandler.sendMemberPieceDataReq();
    },

    memberPieceCrystalNtf: function () {
        let pieceCrystal = GlobalVar.me().memberData.memberPieceCrystal;
        this.pieceNums[0].string = pieceCrystal;
        this.pieceNums[1].string = pieceCrystal;
    },

    memberStoreFresh: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS) {
            this.storeDatas.Items[data.ID].State = data.State;
            this.freshStorePanel();

            let itemdata = this.storeDatas.Items[data.ID];
            let item = {
                ItemID: itemdata.ItemID,
                Count: itemdata.Count,
            }
            CommonWnd.showTreasureExploit([item]);
        } else if (data.ErrCode == GameServerProto.PTERR_PIECE_CRYSTAL_LACK){
            // GlobalVar.comMsg.errorWarning(data.ErrCode);
            let self = this;
            CommonWnd.showMessage(null, CommonWnd.oneConfirm, i18n.t('label.4000216'), i18n.t('label.4000270'), null, function () {
                self.changePanel(null, 1);
            })
        }
    },

    getStoreData: function () {
        let msg = {
            Type: GameServerProto.PT_STORE_MEMBER,
        };
        GlobalVar.handlerManager().storeHandler.sendReq(GameServerProto.GMID_STORE_DATA_REQ, msg);
    },

    memberStoreData: function (data) {
        if (!!data.Expires) {
            this.Expires = data.Expires;
        }
        this.storeDatas = data;
        this.freshStorePanel();
    },

    memberPieceBack: function (data) {
        if (data.ErrCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(data.ErrCode);
        } else {
            this.piecesData = data.Piece;
            this.memberPieceCrystalNtf()
            if (this.isClickIn) {
                this.isClickIn = false;
            } else {
                this.freshBreakPanel();
            }

            if (data.PieceCryStalChg && data.PieceCryStalChg > 0) {
                let tip = i18n.t('label.4000269').replace('%d', data.PieceCryStalChg);
                GlobalVar.comMsg.showMsg(tip);
            }
        }
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

    updateStorePanel: function (grid, index) {
        grid.active = true;
        let itemdata = this.storeDatas.Items[index];
        this.setIcon(grid.getChildByName('nodeShopGoods'), itemdata.ItemID, itemdata.Count);
        grid.getChildByName('lblShopGoods').getComponent(cc.Label).string = this.TblItem[itemdata.ItemID].strName;
        grid.getChildByName('lblShopGoods').color = GlobalFunctions.getCCColorByQuality(this.TblItem[itemdata.ItemID].wQuality);
        grid.getChildByName('lblCostCount').getComponent(cc.Label).string = itemdata.Cost;
        grid.getChildByName('btno_Buy').getComponent(cc.Button).clickEvents[0].customEventData = index;
        if (itemdata.State == 1) {
            grid.getChildByName('btno_Buy').active = true;
            grid.getChildByName('spriteAlreadBuy').active = false;
        } else {
            grid.getChildByName('btno_Buy').active = false;
            grid.getChildByName('spriteAlreadBuy').active = true;
        }
    },

    updateBreakPanel: function (grid, index) {
        grid.active = true;
        let item = this.piecesData[index];
        this.setIcon(grid, item.ItemID, item.Count);
        let mem = this.TblMemberPieceCrystal[item.ItemID];
        grid.getChildByName('lblCostCount').getComponent(cc.Label).string = mem.nCrystal;
        grid.getChildByName('lblItemName').getComponent(cc.Label).string = this.TblItem[item.ItemID].strName;
        grid.getChildByName('lblItemName').color = GlobalFunctions.getCCColorByQuality(this.TblItem[item.ItemID].wQuality);
        grid.getChildByName('btnoBreak').getComponent(cc.Button).clickEvents[0].customEventData = item;
    },

    freshStorePanel: function () {
        let scrollNode = this.funcPanel[0].getChildByName('scrollView');
        let updateCallback = this.updateStorePanel.bind(this);
        this.initScroll(scrollNode, this.itemPrefab[0], updateCallback, 6, 2, 10, 10);

        this.lblFreshTime.string = "今日已刷新" + this.storeDatas.RefreshTimes + "次";
        let lblRefreshCostCount = this.lblFreshTime.node.getChildByName('lblRefreshCostCount').getComponent(cc.Label);
        let nodeRefreshCostIcon = this.lblFreshTime.node.getChildByName('nodeRefreshCostIcon').getComponent("RemoteSprite");
        
        let refreshPlan = GlobalVar.me().storeData.getRefreshCostPlan();
        let refreshCardCount = GlobalVar.me().bagData.getItemCountById(refreshPlan.oVecCost1[0].wItemID);
        if (GlobalVar.me().bagData.getItemCountById(refreshPlan.oVecCost1[0].wItemID) > 0) {
            lblRefreshCostCount.string = refreshCardCount + "/" + refreshPlan.oVecCost1[0].nCount;
            nodeRefreshCostIcon.setFrame(0);
        }
        else {
            lblRefreshCostCount.string = refreshPlan.oVecCost2[0].nCount;
            nodeRefreshCostIcon.setFrame(1);
        }
    },

    setFreshTime: function () {
        let self = this;
        let updateFresh =  function () {
            let leftTime = self.Expires - GlobalVar.me().serverTime;
            if (leftTime <= 0) {
                self.getStoreData();
            }
            var hours = parseInt(leftTime / 3600);
            leftTime = leftTime % 3600;
            var mins = parseInt(leftTime / 60) % 60;
            var secs = parseInt(leftTime % 60);
            self.lblTime.string = (hours < 10 ? "0" + hours : hours) + ":" + (mins < 10 ? "0" + mins : mins) + ":" + (secs < 10 ? "0" + secs : secs);
        }
        if (!!this.scheduleHandler) {
            GlobalVar.gameTimer().delTimer(this.scheduleHandler);
            this.scheduleHandler = null;
        }
        this.scheduleHandler = GlobalVar.gameTimer().startTimer(function () {
            updateFresh();
        }, 1);
    },

    freshBreakPanel: function () {
        let scrollNode = this.funcPanel[1].getChildByName('scrollView');
        let updateCallback = this.updateBreakPanel.bind(this);
        this.initScroll(scrollNode, this.itemPrefab[1], updateCallback, this.piecesData.length, 1);
    },

    changePanel: function (event, customData) {
        if (this.curIndex == customData) return;
        this.curIndex = customData;

        for (let i = 0; i < this.toggles.length; i++){
            this.toggles[i].getComponent('RemoteSprite').setFrame(0);
            this.funcPanel[i].active = false;
        }
        this.toggles[customData].getComponent('RemoteSprite').setFrame(1);
        this.funcPanel[customData].active = true;
        this.funcPanel[0].parent.active = true;
        if (customData == 0) {
            this.getStoreData();
        } else if (customData == 1) {
            GlobalVar.handlerManager().memberHandler.sendMemberPieceDataReq();
        }
    },

    initScroll: function (scrollNode, itemPrefab, updateItem, counts, colNum, disY = 10, gaptop = 10) {
        let self = this;
        let scroll = scrollNode.getComponent(cc.ScrollView);
        scroll.loopScroll.releaseViewItems();
        scroll.loopScroll.setTotalNum(counts);
        scroll.loopScroll.setColNum(colNum);
        scroll.loopScroll.setGapDisX(10);
        scroll.loopScroll.setGapDisY(disY);
        scroll.loopScroll.gapTop = gaptop;
        scroll.loopScroll.setCreateModel(itemPrefab);
        // scroll.loopScroll.setPlayAni(function (item, index,targetX,targetY,callback) {
        //     self.playAnimations(item, index, targetX, targetY, colNum,callback);
        // });
        scroll.loopScroll.registerUpdateItemFunc(function (grid, index) {
            updateItem(grid, index);
        });
        scroll.loopScroll.registerCompleteFunc();
        scroll.loopScroll.resetView();
    },

    playAnimations: function (item, index, targetX, targetY, colNum, callback) {
        item.stopAllActions();
        if (colNum == 1) {
            item.setPosition(-700, targetY);
            item.runAction(cc.sequence(cc.delayTime(index * 0.1), cc.moveTo(0.3, targetX, targetY)));
        } else if (colNum == 2) {
            if (index % 2 == 0) {
                item.setPosition(-700, targetY);
            } else {
                item.setPosition(700, targetY);
            }
            item.runAction(cc.sequence(cc.delayTime(Math.floor(index / 2) * 0.1), cc.moveTo(0.3, targetX, targetY)));
        } else {
            item.setPosition(targetX, targetY);
        }
        callback && callback();
    },

    onBtnBuyGoods: function (event, customData) {
        let msg = {
            Type: GameServerProto.PT_STORE_MEMBER,
            Expires: this.Expires,
            ID : customData,
        }
        GlobalVar.handlerManager().storeHandler.sendReq(GameServerProto.GMID_STORE_BUY_REQ, msg);
    },

    onBtnBreak: function (event, customData) {
        CommonWnd.showNormalPieceWnd(customData, 0);
    },

    onBtnFresh: function () {
        let refreshLimitTimes = GlobalVar.tblApi.getDataBySingleKey('TblVipRight', GlobalVar.me().vipLevel).wStoreRefreshLimit;

        if (this.storeDatas.RefreshTimes >= refreshLimitTimes) {
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
        let msg = {
            Type: GameServerProto.PT_STORE_MEMBER
        }
        GlobalVar.handlerManager().storeHandler.sendReq(GameServerProto.GMID_STORE_REFRESH_REQ, msg);
    },

});