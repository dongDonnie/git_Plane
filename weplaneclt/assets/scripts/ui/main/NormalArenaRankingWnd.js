
const WndTypeDefine = require("wndtypedefine");
const RootBase = require("RootBase");
const GlobalVar = require('globalvar')
const EventMsgID = require("eventmsgid");
const GlobalFunc = require('GlobalFunctions');
const GameServerProto = require("GameServerProto");

cc.Class({
    extends: RootBase,

    properties: {
        labelMyRank: {
            default: null,
            type: cc.Label,
        },
        labelMyPoint: {
            default: null,
            type: cc.Label,
        },
        labelMyLike: {
            default: null,
            type: cc.Label
        },
        nodeRankModel: {
            default: null,
            type: cc.Node,
        },
        rankScroll: {
            default: null,
            type: cc.ScrollView,
        },
        labelTodayLimit: {
            default: null,
            type: cc.Label,
        },
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_ARENA_RANKING_WND;
        this.animeStartParam(0);
        if (GlobalFunc.isAllScreen() && !this.fixViewComplete) {
            this.fixViewComplete = true;
            this.fixView();
        }

        this.isFirstIn = true;
        this.initArenaRankingWnd();
    },

    animeStartParam(num) {
        this.node.opacity = num;
        if (num = 0){
            this.node.setA(0);
        }
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            GlobalVar.eventManager().removeListenerWithTarget(this);
        } else if (name == "Enter") {
            this._super("Enter")
            this.registerEvent();
            this.initLoopScroll();
        }
    },

    registerEvent: function () {
        // GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_ARENA_CHALLENGE_DATA, this.getArenaChallengeData, this);
        // GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_ARENA_SAODANG_DATA, this.getArenaSaoDangData, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_ARENA_LIKE_DATA, this.getArenaLikeData, this);
    },

    initArenaRankingWnd: function () {
        let arenaTopListData = GlobalVar.me().arenaData.arenaTopListData;
        this.labelMyRank.string = arenaTopListData.Ranking;
        this.labelMyPoint.string = arenaTopListData.Points;
        this.labelMyLike.string = arenaTopListData.Likes;

        let curTimes = GlobalVar.me().arenaData.getArenaLikeClicks();
        let maxTimes = GlobalVar.me().arenaData.getArenaLikeClicksLimit();
        this.labelTodayLimit.string = (maxTimes - curTimes) + "/" + maxTimes;
    },

    initLoopScroll: function () {
        let self = this;
        let arenaListData = GlobalVar.me().arenaData.getArenaRankTopData();
        this.rankScroll.loopScroll.setTotalNum(arenaListData.length);
        this.rankScroll.loopScroll.setCreateInterval(0);
        this.rankScroll.loopScroll.setCreateModel(this.nodeRankModel);
        this.rankScroll.loopScroll.saveCreatedModel(this.rankScroll.content.children);
        this.rankScroll.loopScroll.registerUpdateItemFunc(function(model, index){
            self.updateRank(model, arenaListData[index]);
            model.getChildByName("btnLike").getComponent(cc.Button).clickEvents[0].customEventData = index;
        });
        this.rankScroll.loopScroll.resetView();
        this.rankScroll.scrollToTop();
    },

    updateRank: function (model, data) {
        if (data.Ranking > 3 || data.Ranking < 1){
            model.getChildByName("spriteRank").getComponent("RemoteSprite").setFrame(0);
            model.getChildByName("spriteRank").getChildByName("labelRank").getComponent(cc.Label).string = data.Ranking;
            model.getChildByName("spriteRank").getChildByName("labelRank").active = true;
        }else{
            model.getChildByName("spriteRank").getComponent("RemoteSprite").setFrame(data.Ranking);
            model.getChildByName("spriteRank").getChildByName("labelRank").active = false;
        }
        if (data.RoleID == GlobalVar.me().roleID){
            model.getChildByName("spriteBg").active = false;
            model.getChildByName("spriteBgSelect").active = true;
        }else{
            model.getChildByName("spriteBg").active = true;
            model.getChildByName("spriteBgSelect").active = false;
        }
        model.getChildByName("labelPlayerName").getComponent(cc.Label).string = GlobalFunc.interceptStr(data.RoleName, 8, "...");
        model.getChildByName("labelPlayerLevel").getComponent(cc.Label).string = "等级" + data.Level;
        model.getChildByName("labelPlayerCombat").getComponent(cc.Label).string = data.CombatPoint;
        model.x = 0;
        if (data.Avatar == ""){
            model.getChildByName("ItemObject").getComponent("ItemObject").updateItem(data.MemberID);
            model.getChildByName("ItemObject").getComponent("ItemObject").setSpriteEdgeData(data.Quality<100?data.Quality * 100:data.Quality);
            model.getChildByName("ItemObject").getComponent("ItemObject").setSpritePieceVisible(false);
        }else{
            model.getChildByName("ItemObject").getComponent("ItemObject").setAllVisible(false);
            
            cc.loader.load({
                url: data.Avatar,
                type: 'png'
            }, function (err, tex) {
                if (err) {
                    cc.error("LoadURLSpriteFrame err." + data.Avatar);
                }
                let spriteFrame = new cc.SpriteFrame(tex);
                model.getChildByName("ItemObject").getChildByName("spriteItemIcon").getComponent("RemoteSprite").spriteFrame = spriteFrame;
            })
        }

        model.getChildByName("labelPlayerLikesCount").getComponent(cc.Label).string = data.Likes;
    },


    btnLikeClick: function (event, index) {
        this.clickIndex = index;
        this.clickModel = event.target.parent;
        let arenaListData = GlobalVar.me().arenaData.getArenaRankTopData();
        GlobalVar.handlerManager().arenaHandler.sendArenaLikeReq(arenaListData[index].RoleID);
    },

    getArenaLikeData: function (event) {
        if (event.ErrCode != GameServerProto.PTERR_SUCCESS){
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        GlobalVar.comMsg.showMsg("点赞成功，获得金币" + event.OK.GoldReward);
        this.initArenaRankingWnd();

        let arenaListData = GlobalVar.me().arenaData.getArenaRankTopData();
        this.clickIndex >= 0 && (arenaListData[this.clickIndex].Likes += 1);
        this.rankScroll.loopScroll.refreshViewItem();

        
        if (this.clickModel){
            let model = this.clickModel;
            this.clickModel = null;
            let like = cc.instantiate(model.getChildByName("nodeSpriteAni"));
            like.parent = model;
            let effect = model.getChildByName("nodeEffect");
            like.active = true;
            like.stopAllActions();
            like.position = model.getChildByName("btnLike").position;
            like.angle = 0;
            like.runAction(cc.sequence(cc.spawn(cc.moveTo(0.4, model.getChildByName("ItemObject").position), cc.rotateBy(0.4, 720)), cc.callFunc(()=>{
                like.active = false;
                effect.active = true;
                GlobalFunc.playSpineAnimation(effect, function () {
                    effect.active = false;
                });
                like.destroy();
            })));
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

    fixView: function () {
        let bottomWidget = this.node.getChildByName("nodeBottom").getComponent(cc.Widget);
        bottomWidget.bottom += 40;
        bottomWidget.updateAlignment();

        let centerWidget = this.node.getChildByName("nodeCenter").getComponent(cc.Widget);
        centerWidget.bottom += 60;
        centerWidget.updateAlignment();
    },

    close: function () {
        this.rankScroll.loopScroll.releaseViewItems();
        this._super()
    },

    onDestroy: function () {
        GlobalVar.eventManager().removeListenerWithTarget(this);
    },
});