const GlobalVar = require("globalvar")
const WndTypeDefine = require("wndtypedefine");
const RootBase = require("RootBase");
const EventMsgID = require("eventmsgid");
const GlobalFunc = require('GlobalFunctions');
const i18n = require('LanguageData');
const GameServerProto = require("GameServerProto");
const CommonWnd = require("CommonWnd");
const WindowManager = require("windowmgr");

const endPosX = 11;
const startPosX = 800;
const moveT = 0.25;

const system_name = ['endless', 'arena', 'explore'];

cc.Class({
    extends: RootBase,

    properties: {
        content: cc.Node,
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_CHALLENGE_WND;
        if (GlobalFunc.isAllScreen() && !this.fixViewComplete) {
            this.fixViewComplete = true;
            this.fixView();
        }
    },

    onEnable: function () {
        this.node.opacity = 0;
        this.setDefaultPosX();
        this.refreshLock();
    },

    animeStartParam: function (paramOpacity) {
        this.node.opacity = paramOpacity;
        this.setDefaultPosX();
        if (paramOpacity === 0) {
            this.moveAction();
        }
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");

            // if (!this.deleteMode && this.escapeType === subType.endless) {
            //     this.node.opacity = 0;
            //     CommonWnd.showEndlessView();
            // }
            WindowManager.getInstance().popView();
        } else if (name == "Enter") {
            this._super("Enter");
            // this.deleteMode = false;
        }
    },

    moveAction: function () {
        let self = this;
        self.actionOver = false;
        for (let i = 0; i < this.content.children.length; i++) {
            let node = this.content.children[i];
            let moveToPosX = endPosX;
            if (i % 2 === 0) {
                moveToPosX = -endPosX;
            }
            node.runAction(cc.sequence(cc.moveTo(moveT, moveToPosX, node.y), cc.callFunc(function () {
                if (i === self.content.children.length - 1) {
                    self.actionOver = true;
                }
            })));
        }
    },

    setDefaultPosX: function () {
        for (let i = 0; i < this.content.children.length; i++) {
            let node = this.content.children[i];
            if (i % 2 === 0) {
                node.x = -startPosX;
            } else {
                node.x = startPosX;
            }
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

    onEndlessModeBtnClick: function (event) {
        // let endlessSystemData = GlobalVar.tblApi.getDataBySingleKey('TblSystem', GameServerProto.PT_SYSTEM_ENDLESS);
        // if (GlobalVar.me().level < endlessSystemData.wOpenLevel) {
        //     GlobalVar.comMsg.showMsg(i18n.t('label.4000258').replace("%d", endlessSystemData.wOpenLevel).replace("%d", endlessSystemData.strName));
        //     return;
        // }

        // this.escapeType = subType.endless;
        // this.animePlay(0);
        CommonWnd.showEndlessView();
    },

    onArenaBtnClicked: function (event) {
        // let arenaSystemData = GlobalVar.tblApi.getDataBySingleKey('TblSystem', GameServerProto.PT_SYSTEM_ARENA);
        // if (GlobalVar.me().level < arenaSystemData.wOpenLevel) {
        //     GlobalVar.comMsg.showMsg(i18n.t('label.4000258').replace("%d", arenaSystemData.wOpenLevel).replace("%d", arenaSystemData.strName));
        //     return;
        // }

        GlobalVar.handlerManager().arenaHandler.sendArenaOpenReq();
    },

    onExploreBtnClicked: function () {
        CommonWnd.showSpaceExploreWnd();
    },

    refreshLock: function () {
        for (let i = 0; i < system_name.length; i++) {
            let name = system_name[i];
            let openLevel = 0;
            switch (name) {
                case 'endless':
                    openLevel = GlobalVar.tblApi.getDataBySingleKey('TblSystem', GameServerProto.PT_SYSTEM_ENDLESS).wOpenLevel;
                    break;
                case 'arena':
                    openLevel = GlobalVar.tblApi.getDataBySingleKey('TblSystem', GameServerProto.PT_SYSTEM_ARENA).wOpenLevel;
                    break;
                case 'explore':
                    openLevel = GlobalVar.tblApi.getDataBySingleKey('TblSystem', GameServerProto.PT_SYSTEM_EXPLORE).wOpenLevel;
                    break;
            }
            let node = this.seekNodeByName(this.content, name);
            this.refreshLockNode(openLevel, node);
        }
    },

    refreshLockNode: function (openLevel, node) {
        let nowLevel = GlobalVar.me().getLevel();
        let lockNode = this.seekNodeByName(node, 'lockNode');
        if (nowLevel < openLevel) {
            lockNode.active = true;
            this.seekNodeByName(node, 'level').getComponent(cc.Label).string = openLevel + '级开启';
        } else {
            lockNode.active = false;
        }
    },

    onBtnClose: function (event) {
        this.close();
    },

    close: function () {
        this._super();
    },
});