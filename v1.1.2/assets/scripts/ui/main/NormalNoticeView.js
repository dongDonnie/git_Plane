
const RootBase = require("RootBase");
const WindowManager = require("windowmgr");
const GlobalVar = require('globalvar')
const WndTypeDefine = require("wndtypedefine");

cc.Class({
    extends: RootBase,

    properties: {
        noticeScroll: {
            default: null,
            type: cc.ScrollView,
        },
        noticeModel: {
            default: null,
            type: cc.Node,
        },
        isFirstNotice: {
            default: true,
            visible: false,
        }
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMALNOTICE_VIEW;

        this.content = this.noticeScroll.content;

        this.animeStartParam(0, 0);

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
            this.showNoticeList();
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

    showNoticeList: function () {
        let noticeData = GlobalVar.me().noticeData.getNoticeData();
        for (let i = 0; i < noticeData.length; i++) {
            let noticeInfo = noticeData[i];
            this.addNoticeItem(noticeInfo)
        }
    },

    addNoticeItem: function (noticeInfo) {
        let notice = null;
        if(this.isFirstNotice){
            notice = this.noticeModel;
            this.isFirstNotice = false;
        }else{
            notice = cc.instantiate(this.noticeModel);
            this.content.addChild(notice);
        }

        this.updateNotice(notice, noticeInfo);
        this.content.parent.parent.getComponent(cc.ScrollView).scrollToTop();
    },

    updateNotice: function(notice, data){
        notice.data = data;
        notice.opacity = 255;
        notice.getChildByName("labelTitle").getComponent(cc.Label).string = data.Title;
        notice.getChildByName("richText").getComponent(cc.RichText).string = data.Body;
        notice.getComponent(cc.Layout).updateLayout();
    },

    close: function () {
        this.content.removeAllChildren();
        this._super();
    },

});
