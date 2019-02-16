const WndTypeDefine = require("wndtypedefine");
const RootBase = require("RootBase");
const GlobalVar = require('globalvar')
const EventMsgID = require("eventmsgid");
const GlobalFunc = require('GlobalFunctions')
const ResMapping = require("resmapping");
const weChatAPI = require("weChatAPI");
const StoreageData = require("storagedata");
const GameServerProto = require("GameServerProto");

const TYPE_RANKING_QUEST = 0, TYPE_RANKING_ENDLESS = 1;
const POWER_RANKING = 0, QUEST_RANKING = 1, ENDLESS_RANKING = 2, FRIENDS_RANKING = 3, WORLD_RANKING = 4;
const MAX_PAGE_COUNT = 40;


cc.Class({
    extends: RootBase,

    properties: {
        spriteRankTypeList: {
            default: [],
            type: [cc.Sprite]
        },
        spriteRankingContent: {
            default: null,
            type: cc.Sprite,
        },
        curRankingType: 0,
        rankingDataBgModel: {
            default: null,
            type: cc.Node,
        },
        rankingDataContent: {
            default: null,
            type: cc.Node,
        },
        pageIndex: {
            default: 1,
            visible: false
        },
        pageCount: {
            default: 0,
            visivle: false
        },
        texture2D: {
            default: null,
            visible: false,
        },
        nodeMyWorldRanking: {
            default: null,
            type: cc.Node,
        },
        btnWorldRankiong: {
            default: null,
            type: cc.Button,
        },
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_RANKINGLIST_VIEW;
        this.animeStartParam(0);
        if (GlobalFunc.isAllScreen() && !this.fixViewComplete) {
            this.fixViewComplete = true;
            this.fixView();
        }
        this.texture2D = new cc.Texture2D();
        this.spriteRankingContent.node.anchorX = 0.5;
        this.spriteRankingContent.node.x = 0;
        this.spriteRankingContent.node.width = 640;

        this.pageIndex = 1;
        this.lastPage = 1;
    },

    animeStartParam(num) {
        this.node.opacity = num;
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            if (this.btnAuthorize){
                this.btnAuthorize.destroy();
                this.btnAuthorize = null;
            }
            this.nodeMyWorldRanking.active = false;
            this.spriteRankingContent.node.active = false;
            this.rankingDataContent.active = false;

            // this.setRankingType(TYPE_RANKING_ENDLESS);
        } else if (name == "Enter") {
            this._super("Enter");
            GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_RANK_WORLD_DATA, this.getRankWorldData, this);
            this.showRanking();
            this.createAuthorizeBtn(this.btnWorldRankiong.node);
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
        bottomWidget.bottom += 80;
        bottomWidget.updateAlignment();

        let centerWidget = this.node.getChildByName("nodeCenter").getComponent(cc.Widget);
        centerWidget.bottom += 80;
        centerWidget.updateAlignment();
    },

    setPageCount: function (pageCount) {
        this.pageCount = pageCount;

        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            // console.log("not in wechat, return");
            return;
        }
    },
    
    setRankingType: function (rankingType) {
        this.rankingType = rankingType;
        if (typeof rankingType == "undefined") {
            rankingType = TYPE_RANKING_ENDLESS;
        }
        if (rankingType == TYPE_RANKING_QUEST) {
            this.spriteRankTypeList[POWER_RANKING].node.active = true;
            this.spriteRankTypeList[QUEST_RANKING].node.active = true;
            this.spriteRankTypeList[ENDLESS_RANKING].node.active = true;
            this.spriteRankTypeList[FRIENDS_RANKING].node.active = false;
            this.spriteRankTypeList[WORLD_RANKING].node.active = false;
            
            this.curRankingType = POWER_RANKING;
        } else if (rankingType == TYPE_RANKING_ENDLESS) {
            this.spriteRankTypeList[POWER_RANKING].node.active = false;
            this.spriteRankTypeList[QUEST_RANKING].node.active = false;
            this.spriteRankTypeList[ENDLESS_RANKING].node.active = false;
            this.spriteRankTypeList[FRIENDS_RANKING].node.active = !GlobalVar.isWanbaPlat;
            this.spriteRankTypeList[WORLD_RANKING].node.active = true;

            this.curRankingType = null;
            if (GlobalVar.isWanbaPlat){
                this.spriteRankTypeList[WORLD_RANKING].node.x = this.spriteRankTypeList[FRIENDS_RANKING].node.x;
                this.onBtnRankingType(null, WORLD_RANKING);
            }else{
                this.onBtnRankingType(null, FRIENDS_RANKING);
            }
        }
    },

    showRanking: function () {
        this.addRankingDataBg();
        this.sendGetRankingListReq(this.pageIndex, this.pageCount);
    },

    addRankingDataBg: function () {
        this.rankingDataContent.getComponent(cc.Widget).updateAlignment();
        let contentHeight = this.rankingDataContent.height;
        let modelHeight = this.rankingDataBgModel.height;
        let top = 20, space = 20;
        let dataCount = Math.floor((contentHeight - top + space) / (modelHeight + space));
        this.setPageCount(dataCount);
    },

    onBtnRankingType: function (event, type) {
        type = parseInt(type);
        if (this.curRankingType === type) {
            return;
        } else {
            this.curRankingType = type;
            this.pageIndex = 1;
            for (let i = 0; i < this.spriteRankTypeList.length; i++) {
                if (i === type) {
                    this.spriteRankTypeList[i].setFrame(1)
                    this.sendGetRankingListReq(this.pageIndex, this.pageCount);
                } else {
                    this.spriteRankTypeList[i].setFrame(0);
                }
            }
        }
    },

    onBtnChangePage: function (event, changeType) {
        changeType = parseInt(changeType)
        this.sendChangeRankingPageReq(changeType)
    },

    sendGetRankingListReq: function (pageIndex, pageCount) {
        console.log("ranking page:", pageIndex);
        let platformApi = GlobalVar.getPlatformApi();
        if (!platformApi){
            return;
        }

        switch (this.curRankingType) {
            case POWER_RANKING:

                break;
            case QUEST_RANKING:

                break;
            case ENDLESS_RANKING:

                break;
            case FRIENDS_RANKING:
                if (cc.sys.platform == cc.sys.WECHAT_GAME){
                    this.nodeMyWorldRanking.active = false;
                    this.spriteRankingContent.node.active = true;
                    this.rankingDataContent.active = false;
                    let self = this;

                    // 传递openid给子域
                    let openDataContext = wx.getOpenDataContext();
                    let ON_MSG_SET_MY_OPENID = 5;
                    openDataContext.postMessage({
                        id: ON_MSG_SET_MY_OPENID,
                        openID: GlobalVar.me().loginData.getLoginReqDataAccount(),
                    });

                    let sharedCanvas = openDataContext.canvas;
                    sharedCanvas.width = 640;
                    sharedCanvas.height = this.rankingDataContent.height + 400;
                    platformApi.requestEndlessFriendRanking(pageIndex - 1, pageCount);
                    console.log("绘制微信排行榜")
                    this.schedule(function () {
                        self.texture2D.initWithElement(sharedCanvas);
                        self.texture2D.handleLoadedTexture();
                        let sf = new cc.SpriteFrame(self.texture2D);
                        // console.log(sf);
                        self.spriteRankingContent.spriteFrame = sf;
                    }, 0.3, 5);
                }else{
                    for (let i = 0; i< this.pageCount; i++){
                        if (this.rankingDataContent.children[i]){
                            this.rankingDataContent.children[i].active = false;
                        }
                    }
                    this.nodeMyWorldRanking.active = false;
                    platformApi.requestEndlessFriendRanking(pageIndex, pageCount, this.setRankingData.bind(this));
                }
                break;
            case WORLD_RANKING:
                this.spriteRankingContent.node.active = false;
                this.rankingDataContent.active = true;
                let msg = {
                    Type: GameServerProto.PT_RANKTYPE_ENDLESS
                }
                GlobalVar.handlerManager().endlessHandler.sendMsg(GameServerProto.GMID_RANK_REQ, msg);
                // platformApi.requestEndlessWorldRanking(GlobalVar.me().loginData.getLoginReqDataServerID(), GlobalVar.me().roleID, pageIndex, pageCount, this.setRankingData.bind(this));
                break;
            default:
                // console.log("error, please check rankingListView");
                break;
        }

        // console.log("send getRankingList req success");
    },

    getRankWorldData: function () {
        let data = GlobalVar.me().endlessData.rankWorldData;
        let rankData = {};
        rankData.list = [];
        rankData.my = data.OK.MySelf;
        let firstIndex = (this.pageIndex - 1) * this.pageCount;
        for (let i = firstIndex; i < firstIndex + this.pageCount && i < data.OK.Members.length; i++) {
            rankData.list.push(data.OK.Members[i]);
        }
        this.setRankingData(rankData);
    },

    setRankingData: function (data) {
        console.log("get the world rankingList data:", data);
        let rankDatas = [];
        for (let i = 0; i<data.list.length; i++){
            if (data.list[i].EndlessMaxScore > 0 || data.list[i].score > 0){
                rankDatas.push(data.list[i]);
            }
        }
        if (rankDatas.length == 0){
            console.log("该页没有数据！lastPage:", this.lastPage, "  pageindex:", this.pageIndex);
            this.pageIndex = this.lastPage;
            return;
        }
        for (let i = 0; i < rankDatas.length; i++) {
            let model = null;
            if (this.rankingDataContent.children[i]){
                model = this.rankingDataContent.children[i];
            }else{
                model = cc.instantiate(this.rankingDataBgModel)
                this.rankingDataContent.addChild(model);
            }
            model.x = 0;
            model.active = true;
            // model.x = (-1000);
            this.updateRank(model, rankDatas[i]);
            // model.runAction(cc.sequence(cc.delayTime(0.05 * i), cc.moveBy(0.15, 1100, 0), cc.moveBy(0.05, -100, 0)));
        }

        if (rankDatas.length < this.pageCount){
            for (let i = rankDatas.length; i< this.pageCount; i++){
                if (this.rankingDataContent.children[i]){
                    this.rankingDataContent.children[i].active = false;
                }
            }
        }
        if (data.my.rank != 0){
            this.updateRank(this.node.getChildByName("nodeBottom").getChildByName("spritePlayerBg").getChildByName("nodeWorldMyRank"), data.my);
            this.nodeMyWorldRanking.active = true;
        }
    },

    updateRank: function (model, data) {
        if (this.curRankingType == WORLD_RANKING) {
            data.role_name = data.RoleName;
            data.score = data.EndlessMaxScore;
            data.avatar = data.Avatar;
            data.rank = data.Rank + 1;
        }
        model.getChildByName("labelName").getComponent(cc.Label).string = GlobalFunc.interceptStr(data['role_name'], 12, "...");
        model.getChildByName("labelScore").getComponent(cc.Label).string = data['score'];
        let score = parseInt(data['score']);
        if (score > 999999) {
            score = Math.floor(score / 10000);
            score += "万";
        }
        model.getChildByName("labelScore").getComponent(cc.Label).string = score;

        // 玩家所在服务器
        model.getChildByName("labelServer").string = "";
        let serverID = data.ServerID;
        if (serverID){
            let serverList = StoreageData.getLocalServerListData().serverList;
            for (let i in serverList){
                if (serverList[i].server_id == serverID){
                    model.getChildByName("labelServer").string = serverList[i].name;
                }
            }
        }

        // 玩家头像
        let spriteHeader = model.getChildByName("spriteAvatar");
        if (data.avatar == ""){
            let path = "cdnRes/common/common_default_head_img";
            GlobalVar.resManager().loadRes(ResMapping.ResType.SpriteFrame, path, function (frame) {
                spriteHeader.getComponent(cc.Sprite).spriteFrame = frame;
            });
        }else{
            if ((window && window["wywGameId"]=="5469")){
                let path = "cdnRes/common/common_default_head_img";
                GlobalVar.resManager().loadRes(ResMapping.ResType.SpriteFrame, path, function (frame) {
                    spriteHeader.getComponent(cc.Sprite).spriteFrame = frame;

                    let url1 = "http://mwxsdk.phonecoolgame.com/avatar.php?s=" + encodeURIComponent(data.avatar) + "?a=a.png";
                    cc.loader.load({url:url1, type: 'png'}, function (err, tex) {
                        if (err) {
                            // cc.error("LoadURLSpriteFrame err.aaaa" + url1);
                        }
                        let spriteFrame = new cc.SpriteFrame(tex);
                        spriteHeader.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                    }); 
                });
            }else{
                let url = data.avatar + "?a=a.png";
                cc.loader.load(url, function (err, tex) {
                    if (err) {
                        cc.error("LoadURLSpriteFrame err.aaaa" + url);
                    }
                    let spriteFrame = new cc.SpriteFrame(tex);
                    spriteHeader.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                }); 
            }
        }

        //玩家排名
        let rank = data.rank;
        let spriteRank = model.getChildByName("spriteRank");
        let labelRank = model.getChildByName("labelRank");
        if (rank >= 1 && rank <=3){
            labelRank.active = false;
            spriteRank.active = true;
            let path = "cdnRes/ranking/ranking_frame_" + rank;
            GlobalVar.resManager().loadRes(ResMapping.ResType.SpriteFrame, path, function (frame) {
                spriteRank.getComponent(cc.Sprite).spriteFrame = frame;
            });
        }else{
            spriteRank.active = false
            labelRank.active = true;
            labelRank.getComponent(cc.Label).string = rank;
        }
    },

    sendChangeRankingPageReq: function (changeType) {
        let platformApi = GlobalVar.getPlatformApi();
        if (!platformApi) {
            return;
        }

        let PREVIOUS_PAGE = 0, NEXT_PAGE = 1;
        let curPage = this.pageIndex;
        switch (changeType) {
            case PREVIOUS_PAGE:
                curPage -= 1;
                break;
            case NEXT_PAGE:
                curPage += 1;
                break;
            default:
                // console.log("error, please check rankingListView");
                break;
        }

        if (this.curRankingType == FRIENDS_RANKING && (cc.sys.platform == cc.sys.WECHAT_GAME)){
            // 微信拉下一页排行和其他的平台不一样
            if (curPage > this.pageIndex){
                platformApi.requestEndlessFriendRankingNext();
            }else{
                platformApi.requestEndlessFriendRankingBefore();
            }
            let self = this;
            let openDataContext = wx.getOpenDataContext();
            let sharedCanvas = openDataContext.canvas;
            this.schedule(function () {
                self.texture2D.initWithElement(sharedCanvas);
                self.texture2D.handleLoadedTexture();
                let sf = new cc.SpriteFrame(self.texture2D);
                // console.log(sf);
                self.spriteRankingContent.spriteFrame = sf;
            }, 0.3, 5);

            return;
        }

        if (curPage < 1) {
            curPage = 1;
        }
        if (curPage > MAX_PAGE_COUNT){
            curPage = MAX_PAGE_COUNT;
        }
        if (curPage != this.pageIndex) {
            this.lastPage = this.pageIndex;
            this.pageIndex = curPage;
            if (GlobalVar.isQQPlayPlat || GlobalVar.isWanbaPlat){
                // 如果是玩一玩或者玩吧，获取下一页的方式和拉星系排行不一样
                this.sendGetRankingListReq(curPage, this.pageCount)
            }else{
                this.getRankWorldData();
            }
            // this.sendGetRankingListReq(curPage, this.pageCount)
        }

        // console.log("send changePage req success");
    },

    close: function () {
        this.spriteRankingContent.spriteFrame = "";
        this.rankingDataContent.removeAllChildren();
        this._super();
    },

    createAuthorizeBtn(btnNode) {
        if (cc.sys.platform != cc.sys.WECHAT_GAME){
            return;
        }
        let self = this;
        let createBtn = function(){
            let btnSize = cc.size(btnNode.width,btnNode.height);
            let frameSize = cc.view.getFrameSize();
            // console.log("winSize: ",winSize);
            // console.log("frameSize: ",frameSize);
            //适配不同机型来创建微信授权按钮
            let worldPos = btnNode.parent.convertToWorldSpaceAR(btnNode.position);
            let viewPos = self.node.convertToNodeSpaceAR(worldPos);

            let left = (cc.winSize.width*0.5+viewPos.x-btnSize.width*0.5)/cc.winSize.width*frameSize.width;
            let top = (cc.winSize.height*0.5-viewPos.y-btnSize.height*0.5)/cc.winSize.height*frameSize.height;
            let width = btnSize.width/cc.winSize.width*frameSize.width;
            let height = btnSize.height/cc.winSize.height*frameSize.height;
            console.log("button pos: ",cc.v3(left,top));
            console.log("button size: ",cc.size(width,height));
        
    
            self.btnAuthorize = wx.createUserInfoButton({
                type: 'text',
                text: '',
                style: {
                    left: left,
                    top: top,
                    width: width,
                    height: height,
                    lineHeight: 0,
                    backgroundColor: '',
                    color: '#ffffff',
                    textAlign: 'center',
                    fontSize: 16,
                    borderRadius: 4
                }
            })
        
            self.btnAuthorize.onTap((uinfo) => {
                // console.log("onTap uinfo: ",uinfo);
                if (uinfo.userInfo) {
                    // console.log("wxLogin auth success");
                    wx.showToast({title:"授权成功"});
                    weChatAPI.getUserInfo(function(userInfo){
                        if (GlobalVar.me().roleID == GlobalVar.me().roleName){
                            GlobalVar.me().roleName = userInfo.nickName;
                            GlobalVar.me().loginData.setLoginReqDataAvatar(userInfo.avatarUrl);
                            GlobalVar.handlerManager().mainHandler.sendReNameReq(GlobalVar.me().roleID, userInfo.nickName, userInfo.avatarUrl);
                        }
                    })
                    if (self.btnAuthorize){
                        self.btnAuthorize.destroy();
                        self.btnAuthorize = null;
                    }
                }else {
                    // console.log("wxLogin auth fail");
                    // wx.showToast({title:"授权失败"});
                    // self.onPlayerInfoBtnClick();
                }
                
                self.onBtnRankingType(null, WORLD_RANKING)
            });
        }
        if (GlobalVar.me().loginData.getLoginReqDataAvatar() != "" && GlobalVar.me().loginData.getLoginReqDataAvatar() != null){
            return;
        }

        weChatAPI.getSetting("userInfo", null, function(){
            createBtn();
        })
    },

});