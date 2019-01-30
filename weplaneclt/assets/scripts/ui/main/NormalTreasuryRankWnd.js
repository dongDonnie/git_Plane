const WndTypeDefine = require("wndtypedefine");
const RootBase = require("RootBase");
const GlobalVar = require('globalvar')
const EventMsgID = require("eventmsgid");
const GlobalFunc = require('GlobalFunctions');
const GameServerProto = require("GameServerProto");
const i18n = require('LanguageData');

cc.Class({
    extends: RootBase,

    properties: {
        labelMyRank: {
            default: null,
            type: cc.Label,
        },
        labelMyScore: {
            default: null,
            type: cc.Label,
        },
        toggles: {
            default: [],
            type: cc.Node
        },
        nodeModels: {
            default: [],
            type: cc.Node,
        },
        panelScroll: {
            default: [],
            type: cc.ScrollView,
        },
        itemPrefabs: {
            default: null,
            type: cc.Prefab
        }
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_TREASURY_RANK_WND;
        this.animeStartParam(0);
        if (GlobalFunc.isAllScreen() && !this.fixViewComplete) {
            this.fixViewComplete = true;
            this.fixView();
        }
        
    },

    animeStartParam(num) {
        this.node.opacity = num;
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            GlobalVar.eventManager().removeListenerWithTarget(this);
        } else if (name == "Enter") {
            this._super("Enter");
            this.curPanel = -1;
            this.firstInRank = true;
            this.firstInAward = true;
            this.registerEvent();
            this.initTreasuryRankWnd();
        }
    },

    registerEvent: function () {
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_ACTIVE_RANK_RESULT, this.initTreasuryRankWnd, this);
    },

    initTreasuryRankWnd: function () {
        this.rankData = GlobalVar.me().activeData.rankResultData;
        let act = GlobalVar.me().activeData.getActiveListDataByType(GameServerProto.PT_AMS_ACT_TYPE_TREASURY);
        if (!this.rankData) {
            GlobalVar.handlerManager().activeHandler.sendActiveRankReq(act.Actid, act.Type);
            return;
        }
        this.labelMyRank.string = this.rankData.MyMember.Rank;
        this.labelMyScore.string = this.rankData.MyMember.Integral;
        this.clickToggle(null, 0);
    },

    updateRankPanel: function (model, index) {
        model.active = true;
        let data = this.rankData.Members[index];
        if (data.Rank > 3 || data.Rank < 1) {
            model.getChildByName("spriteRank").getComponent("RemoteSprite").setFrame(0);
            model.getChildByName("spriteRank").getChildByName("labelRank").getComponent(cc.Label).string = data.Rank;
            model.getChildByName("spriteRank").getChildByName("labelRank").active = true;
        } else {
            model.getChildByName("spriteRank").getComponent("RemoteSprite").setFrame(data.Rank);
            model.getChildByName("spriteRank").getChildByName("labelRank").active = false;
        }

        if (data.RoleID == GlobalVar.me().roleID) {
            model.getChildByName("spriteBg").active = false;
            model.getChildByName("spriteBgSelect").active = true;
        } else {
            model.getChildByName("spriteBg").active = true;
            model.getChildByName("spriteBgSelect").active = false;
        }

        model.getChildByName("labelPlayerName").getComponent(cc.Label).string = GlobalFunc.interceptStrNew(data.RoleName, 6, "...");
        model.getChildByName("labelPlayerCombat").getComponent(cc.Label).string = data.CombatPoint;

        if (data.Avatar != "") {
            cc.loader.load({
                url: data.Avatar,
                type: 'png'
            }, function (err, tex) {
                if (err) {
                    cc.error("LoadURLSpriteFrame err." + data.Avatar);
                }
                let spriteFrame = new cc.SpriteFrame(tex);
                model.getChildByName("head").getComponent("RemoteSprite").spriteFrame = spriteFrame;
            })
        }
    },

    updateAwardPanel: function (model, index) {
        model.active = true;
        let data = this.awardData[index];
        if (data.Up <= 3) {
            model.getChildByName("spriteRank").getComponent("RemoteSprite").setFrame(data.Up);
            model.getChildByName("labelRankInterval").getComponent(cc.Label).string = '';
        } else {
            model.getChildByName("spriteRank").getComponent("RemoteSprite").setFrame(0);
            let label = model.getChildByName("labelRankInterval").getComponent(cc.Label);
            label.string = i18n.t('label.4001019').replace("%minRank", data.Up).replace("%maxRank", data.Down);
        }

        let layout = model.getChildByName("nodeRewardList");
        for (let i = 0; i < data.Items.length; i++) {
            let itemObj = null;
            if (!layout.children[i]) {
                itemObj = cc.instantiate(this.itemPrefabs);
                layout.addChild(itemObj);
            } else {
                itemObj = layout.children[i];
                itemObj.active = true;
            }
            if (itemObj) {
                itemObj.getComponent("ItemObject").updateItem(data.Items[i].ItemID, data.Items[i].Count);
                itemObj.getComponent("ItemObject").setClick(true, 2);
            }
        }
        for (let i = data.Items.length; i < layout.childCount; i++) {
            if (layout.children[i]) {
                layout.children[i].active = false;
            }
        }
    },

    initRankLoop: function () {
        let scroll = this.panelScroll[0];
        let updateItem = this.updateRankPanel.bind(this);
        this.initScroll(scroll, this.nodeModels[0], updateItem, this.rankData.Members.length);
    },

    initAwardLoop: function () {
        let act = GlobalVar.me().activeData.getActiveListDataByType(GameServerProto.PT_AMS_ACT_TYPE_TREASURY);
        let data = GlobalVar.me().activeData.getActiveDataByActID(act.Actid);
        let scroll = this.panelScroll[1];
        let updateItem = this.updateAwardPanel.bind(this);
        this.awardData = data.Act.OpCfg.RankCfg;
        this.initScroll(scroll, this.nodeModels[1], updateItem, this.awardData.length);
    },

    initScroll: function (scroll, itemPrefab, updateItem, counts) {
        let self = this;
        scroll.loopScroll.releaseViewItems();
        scroll.loopScroll.setTotalNum(counts);
        scroll.loopScroll.setCreateModel(itemPrefab);
        scroll.loopScroll.registerUpdateItemFunc(function (grid, index) {
            updateItem(grid, index);
        });
        scroll.loopScroll.resetView();
        scroll.scrollToTop();
    },

    clickToggle: function (event, customData) {
        if (this.curPanel == customData) {
            return;
        }
        if (0 == customData) {
            this.curPanel = 0;
            this.chooseToggle(true);
            if (this.firstInRank) {
                this.firstInRank = false;
                this.initRankLoop();
            }
        } else if(1 == customData){
            this.curPanel = 1;
            this.chooseToggle(false, true);
            if (this.firstInAward) {
                this.firstInAward = false;
                this.initAwardLoop();
            }
        }
    },

    chooseToggle: function (t1 = false, t2 = false) {
        this.panelScroll[0].node.active = t1;
        this.panelScroll[1].node.active = t2;
        this.toggles[0].getComponent('RemoteSprite').setFrame(t1 ? 1 : 0);
        this.toggles[1].getComponent('RemoteSprite').setFrame(t2 ? 1 : 0);
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

    fixView: function () {
        let bottomWidget = this.node.getChildByName("nodeBottom").getComponent(cc.Widget);
        bottomWidget.bottom += 40;
        bottomWidget.updateAlignment();

        let centerWidget = this.node.getChildByName("nodeCenter").getComponent(cc.Widget);
        centerWidget.bottom += 60;
        centerWidget.updateAlignment();
    },

    close: function () {
        this.chooseToggle(true, false);
        this._super()
    },

    onDestroy: function () {
        GlobalVar.eventManager().removeListenerWithTarget(this);
    },
});