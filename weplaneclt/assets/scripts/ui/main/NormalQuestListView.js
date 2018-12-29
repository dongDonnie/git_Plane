const WndTypeDefine = require("wndtypedefine");
const RootBase = require("RootBase");
const GlobalVar = require('globalvar')
const EventMsgID = require("eventmsgid");
const CommonWnd = require("CommonWnd");
const GlobalFunc = require('GlobalFunctions');
const GameServerProto = require("GameServerProto");
const i18n = require('LanguageData');
const CampPlanetPosData = require('CampPlanetPosData');
const BattleManager = require('BattleManager');
const config = require("config");
const Guide = require('Guide');
const WindowManager = require("windowmgr");

cc.Class({
    extends: RootBase,

    properties: {
        nodeMaps: {
            default: null,
            type: cc.Node,
        },
        nodeMapModel: {
            default: null,
            type: cc.Node,
        },
        progReward: {
            default: null,
            type: cc.ProgressBar,
        },
        labelStarCount: {
            default: null,
            type: cc.Label,
        },
        nodeSpriteLine: {
            default: [],
            type: [cc.Node],
        },
        nodeSeletedAnime: {
            default: null,
            type: cc.Node,
        },
        nodePlanetModel: {
            default: null,
            type: cc.Node,
        },
        chapterMapList: {
            default: [],
            visible: false,
        },
        curChapterIndex: {
            default: -1,
            visible: false,
        },
        chapterType: {
            default: GameServerProto.PT_CAMPTYPE_MAIN,
            visible: false,
        },
        chapterHotPoint: {
            default: null,
            type: cc.Node
        }
    },

    onLoad: function () {
        this._super();
        i18n.init('zh');
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_QUESTLIST_VIEW;
        this.animeStartParam(0);
        if (GlobalFunc.isAllScreen() && !this.fixViewComplete) {
            this.fixViewComplete = true;
            this.fixView();
        }
        this.force = false;
        this.isFirstIn = true;
        this.curChapterIndex = -1;
        this.clickedChapter = false;
        this.needShowRecommondWnd = false;
        this.needShowTestPlayFinishWnd = false;
    },

    setForce: function (force) {
        this.force = force;
    },

    animeStartParam(num) {
        this.node.opacity = num;

        if (num == 0 || num == 255){
            this.node.getChildByName("nodeCenter").active = false;
            this.node.getChildByName("nodeTop").active = false;
            this.node.getChildByName("nodeBottom").active = false;
        }
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            this.unRegisterEvents();
            if (this.deleteMode) {
                let uiNode = cc.find("Canvas/UINode");
                BattleManager.getInstance().quitOutSide();
                BattleManager.getInstance().startOutside(uiNode.getChildByName('UIMain').getChildByName('nodeBottom').getChildByName('planeNode'), GlobalVar.me().memberData.getStandingByFighterID(), true);
            }
            this.canUpdate = false;
            if (!config.NEED_GUIDE) {
                cc.find('Canvas/GuideNode').active = false;
            }
        } else if (name == "Enter") {
            this._super("Enter")
            if (!this.clickedChapter){
                this.canClickPlanet = true;
                BattleManager.getInstance().quitOutSide();
                this.registerEvents();        // 注册监听
                // if (this.isFirstIn){
                    // this.isFirstIn = false;
                this.initQuestListViewData();
                // }
            }else{
                this.clickedChapter = false;
            }
            
            this.node.getChildByName("nodeCenter").active = true;
            this.node.getChildByName("nodeTop").active = true;
            this.node.getChildByName("nodeBottom").active = true;

            if (false && this.needShowTestPlayFinishWnd && !config.NEED_GUIDE && GlobalVar.getShareSwitch()){
                CommonWnd.showShareTestPlayFinishWnd();
            }
            else if (false && this.needShowRecommondWnd && !config.NEED_GUIDE && GlobalVar.getShareSwitch()){
                CommonWnd.showRecommandWnd();
            }
            this.needShowTestPlayFinishWnd = false;
            this.needShowRecommondWnd = false;
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
        bottomWidget.bottom += 65;
        bottomWidget.updateAlignment();

        // let nodeCenter = this.node.getChildByName("nodeCenter");
        // let centerWidget = nodeCenter.getComponent(cc.Widget);
        // centerWidget.bottom += 65;
        // centerWidget.updateAlignment();
        // let nodeMapModel = this.node.getChildByName("nodeMapModel");
        // nodeMapModel.height = 825;
        // nodeMapModel.getChildByName("labelChapterName").getComponent(cc.Widget).updateAlignment();
        // nodeMapModel.getChildByName("spriteUnderLine").getComponent(cc.Widget).updateAlignment();
        // this.nodeMaps.height = 825;
        // this.nodeMaps.y += 100;
    },

    needShowRecommond: function () {
        this.needShowRecommondWnd = !GlobalVar.me().shareData.getShareRecommandState();
    },
    needShowTestPlayFinish: function () {
        this.needShowTestPlayFinishWnd = !!GlobalVar.me().shareData.testPlayMemberID;
    },

    registerEvents: function () {
        this.nodeMaps.on(cc.Node.EventType.TOUCH_END, this.mapTouchEnd, this);
        this.nodeMaps.on(cc.Node.EventType.TOUCH_CANCEL, this.mapTouchEnd, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_CHAPTER_SELECT, this.changeQuest, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_CHAPTER_REWARD, this.getChapterReward, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_REGET_CHAPTER_DATA, this.initQuestListViewData, this);
    },

    unRegisterEvents: function () {
        GlobalVar.eventManager().removeListenerWithTarget(this);
        this.nodeMaps.targetOff(this);
    },

    mapTouchEnd: function (event) {
        let touch = event.touch;
        let deltaMove = touch.getLocation().sub(touch.getStartLocation());
        let disX = deltaMove.x;

        let curMap = this.getQuestNodeByIndex(this.curChapterIndex);
        if (!curMap) return;

        if (disX > curMap.width / 4) {
            this.changeQuest(this.curChapterIndex - 1)
        } else if (disX < -curMap.width / 4) {
            this.changeQuest(this.curChapterIndex + 1);
        }
    },

    initQuestListViewData: function () {
        this.force = typeof this.force !== 'undefined' ? this.force : false;

        let curChapterID = GlobalVar.me().campData.getLastChapterID(this.chapterType);
        this.getNodeByName('lblCp').getComponent(cc.Label).string = GlobalVar.me().getCombatPoint();

        if (!curChapterID || this.force) {
            // console.log("curMapIndex error");
            this.force = false;
            this.sendGetCampInfoMsg(this.chapterType)
            return;
        }

        let oldLastChapterID = GlobalVar.me().oldLastChapterID;
        let defaultCurChapterID = GlobalVar.me().defaultCurChapterID;
        if (oldLastChapterID && curChapterID == oldLastChapterID) {
            curChapterID = defaultCurChapterID;
        }

        if (this.curChapterIndex == -1){
            this.curChapterIndex = curChapterID - 1;
        }
        this.initQuestView();
        if (config.NEED_GUIDE) {
            this.changeQuest(0);
        }
    },

    initChapterHotPoint: function (index) {
        let boxarr = GlobalVar.me().campData.getBoxArrayData();
        this.chapterHotPoint.active = false;
        for (let j = 0; j < boxarr.length; j++) {
            if (boxarr[j].ChapterID != index) {
                this.chapterHotPoint.active = true;
                break;
            }
        }
        // if (boxarr.length != 0)
        //     this.chapterHotPoint.active = true;
    },

    initQuestView: function (index) {
        index = typeof index !== 'undefined' ? index : this.curChapterIndex;
        if (index == -1) {
            // console.log("error, index can not be '-1'")
            return;
        }

        let curMap = this.getQuestNodeByIndex(this.curChapterIndex);
        if (!curMap) return;
        curMap.opacity = 255;
        curMap.setScale(1);
    },

    getQuestNodeByIndex: function (index) {
        index = typeof index !== 'undefined' ? index : this.curChapterIndex;
        if (index == -1 || index == 30) {
            // console.log("error, index can not be '-1'")
            return;
        }
        if (!this.chapterMapList[index]) {
            this.createQuestNode(index);
        }else{
            this.refreshMap(index);
        }

        return this.chapterMapList[index];
    },

    createQuestNode: function (index) {

        let chapterDataList = GlobalVar.tblApi.getDataBySingleKey('TblChapter', this.chapterType);
        let campaignList = chapterDataList[index].oVecCampaigns;

        let playerChapterData = GlobalVar.me().campData.getChapterData(this.chapterType, index + 1);
        if (!playerChapterData) {
            //章节锁wOpenLv data.wOpenLv > GlobalVar.me().level
            if (chapterDataList[index].wOpenLv > GlobalVar.me().level){
                GlobalVar.comMsg.showMsg(i18n.t('label.4000263').replace("%d", chapterDataList[index].wOpenLv));
            }else{
                GlobalVar.comMsg.showMsg(i18n.t('label.4000262'));;
            }

            return;
        }

        let nodeMap = cc.instantiate(this.nodeMapModel);        //创建地图节点
        nodeMap.getChildByName("labelChapterName").getComponent(cc.Label).string = i18n.t('label.4000234').replace('%d', chapterDataList[index].byChapterID) + " " + chapterDataList[index].strChapterName;
        let lastPlanet = null;                                  //设置变量保存上一个关卡，不存在时则为null
        nodeMap.opacity = 1;
        nodeMap.setScale(0);
        nodeMap.y = -370;
        nodeMap.planetList = [];   // 保存该地图的关卡
        nodeMap.planetPosList = [];
        nodeMap.lineList = [];     // 保存该地图关卡间的连线

        for (let i = 0; i < campaignList.length; i++) {

            let campData = playerChapterData[i];

            let planet = cc.instantiate(this.nodePlanetModel);   //初始化关卡图标
            // planet.setScale(1);
            let planetData = GlobalVar.tblApi.getDataBySingleKey('TblCampaign', campaignList[i]);
            this.updatePlanet(planet, campData, planetData, index)
            nodeMap.addChild(planet);
            planet.name = 'spritePlanetModel' + i;
            nodeMap.planetList.push(planet);
            nodeMap.planetPosList.push(planet.position);
            if (!!lastPlanet) {   //当存在上一个关卡时，创建连线
                let posLast = lastPlanet.getPosition();
                let posCur = planet.getPosition();

                let disX = posCur.x - posLast.x;
                let disY = posCur.y - posLast.y;
                let disZ = Math.sqrt(Math.pow(disX, 2) + Math.pow(disY, 2));

                let line = cc.instantiate(this.nodeSpriteLine[campData ? 1 : 0]);

                line.angle=-Math.atan2(disX, disY) / Math.PI * 180;//计算两个关卡间的偏转角度
                
                line.height = disZ;
                line.anchorY = 0;
                line.active = true;
                line.position = posLast;

                nodeMap.addChild(line);
                nodeMap.lineList.push(line);
                line.setSiblingIndex(0);    //设置连线在父节点内的顺序为最底下，让关卡显示在线条之上
            }
            lastPlanet = planet;

            let lastCampign = GlobalVar.me().campData.getLastCampaignID(this.chapterType);
            if (lastCampign == campaignList[i]) {
                let anime = cc.instantiate(this.nodeSeletedAnime);
                anime.getChildByName("spriteCircleAnime1").runAction(cc.repeatForever(cc.rotateBy(4, 360)));
                anime.getChildByName("spriteCircleAnime2").runAction(cc.repeatForever(cc.rotateBy(4, -360)));
                anime.getChildByName("spriteCircleAnime3").runAction(cc.repeatForever(cc.rotateBy(4, 360)))
                anime.setPosition(0, 0);
                anime.setScale(planet.width * 1.6 / anime.width);
                //console.log("动画缩放尺寸=", planet.width * 1.8 / anime.width)
                planet.addChild(anime);
                planet.anime = anime;
            }
        }


        this.initChapterProgress(index);
        this.initChapterReward(index);
        this.nodeMaps.addChild(nodeMap);
        nodeMap.getComponent(cc.Widget).updateAlignment();
        this.chapterMapList[index] = nodeMap;
    },

    refreshMap: function (index) {
        let curMap = this.chapterMapList[index];

        //删除连线重新创建
        for (let i = 0; i<curMap.lineList; i++){
            curMap.lineList[i].destroy();
        }
        curMap.lineList.splice(0);

        //刷新关卡外观
        let playerChapterData = GlobalVar.me().campData.getChapterData(this.chapterType, index + 1);
        for (let i = 0; i<curMap.planetList.length; i++){
            let planet = curMap.planetList[i];
            let campData = playerChapterData[i];
            this.updatePlanet(planet, campData);
        }
        this.initChapterProgress(index);
        this.initChapterReward(index);
    },

    initChapterProgress: function (index) {
        let starCount = GlobalVar.me().campData.getChapterStarCount(this.chapterType, index + 1);
        this.labelStarCount.string = starCount;
        // if (starCount >= 30) {
        //     this.labelStarCount.node.color = cc.Color.GREEN;
        // } else {
        //     this.labelStarCount.node.color = cc.color(113, 126, 189);
        // }

        let AfterPersent = starCount / 30;
        let curPersent = this.progReward.progress;

        if (cc.game.renderType != cc.game.RENDER_TYPE_WEBGL) {
            this.progReward.progress = AfterPersent;
        } else {
            this.progReward.node.runAction(cc.progressLoading(0.5 * Math.abs(curPersent - AfterPersent), curPersent, AfterPersent));
        }

    },

    initChapterReward: function (index) {
        //初始化宝箱显示
        let MAX_REWARD = 3
        let nodeBottom = this.node.getChildByName("nodeBottom");
        let starCount = GlobalVar.me().campData.getChapterStarCount(this.chapterType, index + 1);
        for (let i = 1; i <= MAX_REWARD; i++) {
            let campType = this.chapterType;
            let chapterId = index + 1;
            let pos = i;
            if (GlobalVar.me().campData.isChapterRewardReceived(campType, chapterId, pos)) {
                nodeBottom.getChildByName("chapterRewardBox" + i).getComponent("RemoteSprite").setFrame(2)
                nodeBottom.getChildByName("chapterRewardBox" + i).getChildByName("spriteHot").active = false;
            } else if (starCount / 10 >= i) {
                nodeBottom.getChildByName("chapterRewardBox" + i).getComponent("RemoteSprite").setFrame(1)
                nodeBottom.getChildByName("chapterRewardBox" + i).getChildByName("spriteHot").active = true;
            } else {
                nodeBottom.getChildByName("chapterRewardBox" + i).getComponent("RemoteSprite").setFrame(0)
                nodeBottom.getChildByName("chapterRewardBox" + i).getChildByName("spriteHot").active = false;
            }
        }

        this.initChapterHotPoint(index+1);
    },

    changeQuest: function (nextIndex) {
        if (nextIndex == this.curChapterIndex) return;

        let curMap = this.getQuestNodeByIndex(this.curChapterIndex);
        let nextMap = this.getQuestNodeByIndex(nextIndex);
        if (!curMap || !nextMap) return;

        let anchorX = (this.curChapterIndex > nextIndex ? 1 : 0)
        curMap.anchorX = anchorX;
        curMap.x=(anchorX == 0 ? -320 : 320);
        nextMap.anchorX = anchorX == 0 ? 1 : 0;
        nextMap.x=(anchorX == 0 ? 320 : -320);
        for (let i = 0; i < curMap.planetList.length; i++) {
            curMap.planetList[i].x=(curMap.planetPosList[i].x + (anchorX == 0 ? 0 : -640))

        }
        for (let i = 0; i < curMap.lineList.length; i++) {
            curMap.lineList[i].position = curMap.planetList[i].position;
        }

        for (let i = 0; i < nextMap.planetList.length; i++) {
            nextMap.planetList[i].x=(nextMap.planetPosList[i].x + (anchorX == 0 ? -640 : 0))

        }
        for (let i = 0; i < nextMap.lineList.length; i++) {
            nextMap.lineList[i].position = nextMap.planetList[i].position;
        }

        this.curChapterIndex = nextIndex;

        let self = this;
        let interval = 0.4 * curMap.scale;
        curMap.stopAllActions();
        curMap.runAction(cc.spawn(cc.scaleTo(interval, 0), cc.fadeOut(interval)));
        nextMap.stopAllActions();
        nextMap.runAction(cc.sequence(cc.spawn(cc.scaleTo(interval, 1), cc.fadeIn(interval)), cc.callFunc(() => {
            let index = self.chapterMapList.indexOf(nextMap);
            for (let i = 0; i < self.chapterMapList.length; i++) {
                if (!!self.chapterMapList[i]) {
                    if (i != index) {
                        // self.nodeMaps.removeChild(self.chapterMapList[i]);
                        self.chapterMapList[i].destroy();
                        self.chapterMapList[i] = null;
                    }
                }
            }
        })));
    },

    updatePlanet(planet, data, planetData, index) {
        planet.data = data;
        if (data) {
            planet.getComponent(cc.Button).interactable = true;
            planet.getChildByName("nodeStar").opacity = 255;
            let stars = planet.getChildByName("nodeStar").children;
            for (let i = 0; i < stars.length; i++) {
                let IN_ACTIVE = 0, ACTIVE = 1;
                if (i + 1 <= data.Star) {
                    stars[i].getComponent("RemoteSprite").setFrame(ACTIVE);
                } else {
                    stars[i].getComponent("RemoteSprite").setFrame(IN_ACTIVE);
                }
            }
        } else if (!data) {
            //关卡锁
            planet.getComponent(cc.Button).interactable = false;
            planet.getChildByName("nodeStar").opacity = 0;
        }

        // 关卡数字颜色开关
        planet.getChildByName("labelQuestNumber").color = planet.getComponent(cc.Button).interactable?cc.color(255, 255, 255):cc.color(160, 160, 160);
        if (!planetData){
            return;
        }

        planet.getComponent("RemoteSprite").setFrame(planetData.wIconID - 1);
        let campaignIndex = (planetData.wCampaignID - 1) % 10 + 1;
        planet.getChildByName("labelQuestNumber").getComponent(cc.Label).string = planetData.wIconID==1?campaignIndex:"";

        let planetPosData = CampPlanetPosData;
        let chapterIndex = index % 9 + 1;
        //console.log("chapterIndex:", chapterIndex);
        let planetPos = planetPosData[chapterIndex][campaignIndex - 1]


        let disY = (this.nodeMapModel.height - 740) / 2;
        planet.setPosition(new cc.Vec2(planetPos.x, planetPos.y + disY));

        planet.planetData = planetData;
    },

    onBtnChapterList: function () {
        this.clickedChapter = true;
        CommonWnd.showChapterListView(this.chapterType, this.curChapterIndex);
        // this.node.active = false;
        this.canUpdate = false;
    },

    onBtnPlanet(event) {
        if (!this.canClickPlanet){
            return;
        }        

        let planet = event.target;
        // CommonWnd.showQuestInfoWnd(planet.data, planet.planetData);
        let chapterID = planet.planetData.byChapterID;
        let campaignIndex = ((planet.planetData.wCampaignID -1) % 10) + 1;
        
        let testPlayMemberID = -1;
        if (chapterID == 1 && campaignIndex == 7){
            testPlayMemberID = 740;
        }else if (chapterID == 1 && campaignIndex == 10){
            testPlayMemberID = 760;
        }else if (campaignIndex == 10){
            let totalMemberData = GlobalVar.tblApi.getData('TblMember');
            let ids = [];
            for (let i in totalMemberData){
                if (totalMemberData[i].byGetType == 1 && totalMemberData[i].stPingJia.byStarNum >= 3){
                    ids.push(parseInt(i));
                }
            }
    
            for (let i = 0; i<ids.length;i++){
                let memberData = GlobalVar.me().memberData.getMemberByID(ids[i]);
                if (memberData || GlobalVar.me().memberData.unLockHotFlag[ids[i]]){
                    ids.splice(i, 1);
                    i -= 1;
                }
            }

            let randomID = ids[parseInt(Math.random() * ids.length)] || -1;
            testPlayMemberID = randomID;
        }

        if (false && testPlayMemberID != -1){
            CommonWnd.showShareMemberTestPlayWnd(testPlayMemberID, function () {
                CommonWnd.showQuestInfoWnd(planet.data, planet.planetData);
            });
        }else{
            CommonWnd.showQuestInfoWnd(planet.data, planet.planetData);
        }
    },

    onBtnChapterRewardBox: function (event, index) {
        let str = "oVecChest" + index;
        let chapterData = GlobalVar.tblApi.getDataBySingleKey('TblChapter', this.chapterType)[this.curChapterIndex];

        let condition = false;
        let curStarsCount = GlobalVar.me().campData.getChapterStarCount(this.chapterType, this.curChapterIndex + 1);
        let goalStarsCount = chapterData.oVecReward[index - 1].wStars
        // console.log("curStarsCount = ", curStarsCount, "  goalStarsCount = ", goalStarsCount);
        if (curStarsCount >= goalStarsCount) {
            condition = true;
        }



        let campType = this.chapterType;
        let chapterId = this.curChapterIndex + 1;
        let pos = parseInt(index);

        // 判断关卡宝箱是否已领取
        let confirmText = "领取";
        if (GlobalVar.me().campData.isChapterRewardReceived(campType, chapterId, pos)) {
            condition = false;
            confirmText = "已领取"
        }

        let confirm = function () {
            GlobalVar.handlerManager().campHandler.sendGetCampChapterRewardReq(campType, chapterId, pos - 1);
        };

        CommonWnd.showRewardBoxWnd(null, i18n.t('label.4000240'), condition, chapterData[str], null, confirm, null, confirmText);
    },


    sendGetCampInfoMsg: function (type) {
        GlobalVar.handlerManager().campHandler.sendGetCampBagReq(type);
    },

    getChapterReward: function (event) {
        if (event.ErrCode && event.ErrCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        this.initChapterHotPoint(this.curChapterIndex+1);

        CommonWnd.showTreasureExploit(event.OK.Item);
        let nodeBottom = this.node.getChildByName("nodeBottom");
        nodeBottom.getChildByName("chapterRewardBox" + (event.OK.Pos + 1)).getComponent("RemoteSprite").setFrame(2)
        
        nodeBottom.getChildByName("chapterRewardBox" + (event.OK.Pos + 1)).getChildByName("spriteHot").active = false;
        // GlobalVar.comMsg.showMsg(i18n.t('label.4000242'));
    },

    onDestroy: function () {
        GlobalVar.eventManager().removeListenerWithTarget(this);
    },

    update: function (dt) {
        if (config.NEED_GUIDE) return;
        if (!this.canUpdate) {
            this.canUpdate = true;
            this.curTime = (new Date()).getTime();
            cc.find('Canvas/GuideNode').active = false;
            return;
        }
        let curChapterID = GlobalVar.me().campData.getLastChapterID(this.chapterType);
        if (curChapterID == 1) {
            let windView = WindowManager.getInstance().getTopViewTypeName();
            let nowTime = (new Date()).getTime();
            if (windView != this.typeName) {
                this.curTime = nowTime;
                return;
            }
            if (nowTime - this.curTime > 3000) {
                this.curTime = nowTime;
                Guide.getInstance().showFinger();
            }
            if (cc.find('Canvas/GuideNode').active) {
                this.curTime = nowTime;
            }
        }
    },
});