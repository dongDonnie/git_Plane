const GlobalVar = require("globalvar")
const WndTypeDefine = require("wndtypedefine");
const RootBase = require("RootBase");
const EventMsgID = require("eventmsgid");
const CommonWnd = require("CommonWnd");
const GlobalFunc = require('GlobalFunctions');
const i18n = require('LanguageData');
const ResMapping = require("resmapping");
const GameServerProto = require("GameServerProto");

cc.Class({
    extends: RootBase,

    properties: {
        chapterScorll: {
            default: null,
            type: cc.ScrollView,
        },
        nodeChapterModel: {
            default: null,
            type: cc.Node,
        },
        chapterType: {
            default: -1,
            visible: false,
        },
    },

    onLoad: function () {
        this._super();
        i18n.init('zh');
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_CHAPTER_VIEW;
        if (GlobalFunc.isAllScreen() && !this.fixViewComplete) {
            this.fixViewComplete = true;
            this.fixView();
        }
        this.isFirstIn = true;
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");

            this.chapterScorll.loopScroll.releaseViewItems();
        } else if (name == "Enter") {
            this._super("Enter");

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
        let centerWidget = this.node.getChildByName("nodeCenter").getComponent(cc.Widget);
        centerWidget.bottom += 65;
        centerWidget.updateAlignment();
    },

    initChapterViewWithType: function (chapterType, curMapIndex) {
        let self = this;

        this.boxarr = GlobalVar.me().campData.getBoxArrayData();
        this.chapterType = chapterType;
        let chapterDataList = GlobalVar.tblApi.getDataBySingleKey('TblChapter', this.chapterType);
        let startIndex = curMapIndex + 1<6?0:(Math.floor(curMapIndex / 3) - 1)*3
        if (startIndex >= chapterDataList.length - 6){
            startIndex = chapterDataList.length - 9;
        }
        if (this.isFirstIn){
            this.isFirstIn = false;
            this.lastChapterID = GlobalVar.me().campData.getLastChapterID(this.chapterType)
            this.chapterScorll.loopScroll.setTotalNum(chapterDataList.length);
            this.chapterScorll.loopScroll.setColNum(3);
            this.chapterScorll.loopScroll.setGapDisX(25);
            this.chapterScorll.loopScroll.setStartIndex(startIndex);
            this.chapterScorll.loopScroll.setCreateModel(self.nodeChapterModel);
            this.chapterScorll.loopScroll.saveCreatedModel(this.chapterScorll.content.children);
            this.chapterScorll.loopScroll.registerUpdateItemFunc(function(chapter, index){
                self.updateChapter(chapter, chapterDataList[index]);
            });
            this.chapterScorll.loopScroll.registerCompleteFunc(function(){
                self.canClose = true;
            })
            this.chapterScorll.loopScroll.resetView();
        }else {
            // this.chapterScorll.loopScroll.initParameter();
            this.chapterScorll.loopScroll.setStartIndex(startIndex);
            this.chapterScorll.loopScroll.resetView();
            this.chapterScorll.loopScroll.moveTo(startIndex);
        }


    },

    updateChapter: function (chapter, data) {
        chapter.data = data;
        // chapter.active = true;
        chapter.opacity = 255;
        // chapter.scale = 0;
        if (data.byChapterID > this.lastChapterID){
            chapter.getComponent("RemoteSprite").setFrame(0);
            chapter.getChildByName("spriteStar").getComponent("RemoteSprite").setFrame(0);
            chapter.getChildByName("spriteChapterBg").color = cc.Color.GRAY;
            chapter.getChildByName("labelChapterTitle").color = cc.color(194, 200, 211);
            chapter.getChildByName("labelChapterName").color = cc.color(162, 169, 180);
            chapter.getChildByName("labelStarCount").color = cc.color(87, 94, 99);
            // chapter.color = cc.Color.GRAY;
        }else{
            chapter.getComponent("RemoteSprite").setFrame(1);
            chapter.getChildByName("spriteStar").getComponent("RemoteSprite").setFrame(1);
            chapter.getChildByName("spriteChapterBg").color = cc.Color.WHITE;
            chapter.getChildByName("labelChapterTitle").color = cc.color(151, 169, 252);
            chapter.getChildByName("labelChapterName").color = cc.color(121, 139, 204);
            chapter.getChildByName("labelStarCount").color = cc.color(65, 72, 119);
            // chapter.color = cc.Color.WHITE;
        }
        
        chapter.getChildByName("labelChapterTitle").getComponent(cc.Label).string = i18n.t('label.4000234').replace('%d', data.byChapterID);
        chapter.getChildByName("labelChapterName").getComponent(cc.Label).string = data.strChapterName;
        let curStarsCount = GlobalVar.me().campData.getChapterStarCount(this.chapterType, data.byChapterID);
        chapter.getChildByName("labelStarCount").getComponent(cc.Label).string = (curStarsCount + "/30");
        let path = "cdnRes/chapterBg/chapter_bkg_" + data.byChapterID;
        GlobalVar.resManager().loadRes(ResMapping.ResType.SpriteFrame, path, function (frame) {
            chapter.getChildByName("spriteChapterBg").getComponent("RemoteSprite").spriteFrame = frame;
        });
        // chapter.runAction(cc.sequence(cc.scaleTo(0.1, 1.1), cc.scaleTo(0.05, 1)));

        chapter.getChildByName('spriteHot').active = false;
        for (let j = 0; j < this.boxarr.length; j++) {
            if (this.boxarr[j].ChapterID == data.byChapterID) {
                chapter.getChildByName('spriteHot').active = true;
            }
        }
    },

    onChapterBtnClick: function (event) {
        if (event.target.data.wOpenLv > GlobalVar.me().level){
            GlobalVar.comMsg.showMsg(i18n.t('label.4000263').replace("%d", event.target.data.wOpenLv));
        }else if (event.target.data.byChapterID > this.lastChapterID){
            GlobalVar.comMsg.showMsg(i18n.t('label.4000262'));
        }else{
            GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_CHAPTER_SELECT, event.target.data.byChapterID - 1);
            this.close();
        }
    },

    onBtnClose: function(event){
        if(!!this.canClose){
            this.close();
        }
    },
    
    close: function () {
        this._super();
    },
});