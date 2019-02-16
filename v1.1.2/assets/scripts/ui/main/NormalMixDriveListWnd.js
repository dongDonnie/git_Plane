const RootBase = require("RootBase");
const WindowManager = require("windowmgr");
const GlobalVar = require('globalvar')
const WndTypeDefine = require("wndtypedefine");
const EventMsgID = require("eventmsgid");
const GameServerProto = require("GameServerProto");
const CommonWnd = require("CommonWnd");
const i18n = require('LanguageData');
const GlobalFunc = require('GlobalFunctions');
const weChatAPI = require("weChatAPI");

const TitleIndexList = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ'];

cc.Class({
    extends: RootBase,

    properties: {
        labelTitle: {
            default: null,
            type: cc.Label,
        },
        memberScroll: {
            default: null,
            type: cc.ScrollView,
        },
        memberModel: {
            default: null,
            type: cc.Node,
        },
    },

    onLoad: function () {
        this._super();
        this.animeStartParam(0, 0);
        this.canClose = true;
        this.isFirstIn = true;

    },

    onDestroy: function () {
        GlobalVar.eventManager().removeListenerWithTarget(this);
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

            GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_MEMBER_STANDINGBY_NTF, this.onBtnClose, this);
            this.initMemberListWnd();
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
    
    onBtnClose: function () {
        this.canClose && this.close();
    },

    close: function () {
        this.memberScroll.loopScroll.releaseViewItems();
        this._super();
    },

    initView: function (index) {
        this.index = index;
        this.labelTitle.string = '第' + TitleIndexList[this.index] + '驱动位';
        this.initData();
    },

    initData: function () {
        let mixMemberId = GlobalVar.me().memberData.getMixMemberIDByIndex(this.index);
        this.mixMemberList = GlobalVar.me().memberData.getRestMemberIDList();
        mixMemberId && this.mixMemberList.unshift(mixMemberId);
    },

    initMemberListWnd: function () {
        if (this.mixMemberList && this.mixMemberList.length > 0) {
            let self = this;
            self.canClose = false;
            if (this.isFirstIn) {
                this.isFirstIn = false;
                this.memberScroll.loopScroll.setTotalNum(this.mixMemberList.length);
                this.memberScroll.loopScroll.setCreateModel(this.memberModel);
                this.memberScroll.loopScroll.saveCreatedModel(this.memberScroll.content.children);
                this.memberScroll.loopScroll.registerUpdateItemFunc(function (item, index) {
                    item.getComponent("MixMemberObject").updateMemberInfo(self.index, self.mixMemberList[index]);
                });
                this.memberScroll.loopScroll.registerCompleteFunc(function () {
                    self.canClose = true;
                });
                this.memberScroll.loopScroll.resetView();
            } else {
                this.memberScroll.scrollToTop(0);
                this.memberScroll.loopScroll.setTotalNum(this.mixMemberList.length);
                this.memberScroll.loopScroll.registerUpdateItemFunc(function (item, index) {
                    item.getComponent("MixMemberObject").updateMemberInfo(self.index, self.mixMemberList[index]);
                });
                this.memberScroll.loopScroll.initParameter();
                this.memberScroll.loopScroll.resetView();
            }
        }
    }
});
