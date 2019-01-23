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

cc.Class({
    extends: RootBase,

    properties: {
        labelPreLevel: {
            default: null,
            type: cc.Label,
        },
        labelPreStrength: {
            default: null,
            type: cc.Label,
        },
        labelNextLevel: {
            default: null,
            type: cc.Label,
        },
        labelNextStrength: {
            default: null,
            type: cc.Label,
        },
        nodeContent: {
            default: null,
            type: cc.Node,
        },
    },

    onLoad: function () {
        this._super();
        this.animeStartParam(0, 0);
        this.canClose = true;
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
            this.clearView();
            WindowManager.getInstance().popView(false, null, false, false);
        } else if (name == "Enter") {
            this._super("Enter");
            this.initView();
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
        this._super();
    },

    initView: function () {
        let preMixLevel = GlobalVar.me().memberData.getMixLevel();
        let preMasterData = GlobalVar.tblApi.getDataBySingleKey('TblMixMaster', preMixLevel);
        let nextMixLevel = preMixLevel + 1 > 100 ? 100 : preMixLevel + 1;
        let nextMasterData = GlobalVar.tblApi.getDataBySingleKey('TblMixMaster', nextMixLevel);

        this.labelPreLevel.string = preMixLevel + '级合体强度';
        this.labelPreStrength.string = (preMasterData.nCombatConvert / 100).toFixed(2) + '%';
        this.labelNextLevel.string = nextMixLevel + '级合体强度';
        this.labelNextStrength.string = (nextMasterData.nCombatConvert / 100).toFixed(2) + '%';
        
        for (let i = 0; i < 4; i++) {
            let nodeSeat = this.nodeContent.children[i];
            let nodeNone = nodeSeat.getChildByName('nodeNone');
            let nodeItem = nodeSeat.getChildByName('nodeItem');
            
            let mixMemberId = GlobalVar.me().memberData.getMixMemberIDByIndex(i);
            if (mixMemberId) {
                nodeNone.active = false;
                nodeItem.active = true;

                let itemObj = nodeItem.getChildByName('ItemObject').getComponent("ItemObject");
                itemObj.updateItem(mixMemberId);
                itemObj.setSpritePieceVisible(false);
                itemObj.setClick(false);

                let member = GlobalVar.me().memberData.getMemberByID(mixMemberId);

                let id = member.MemberID;
                let quality = member.Quality;
                let fighterData = GlobalVar.tblApi.getDataBySingleKey('TblMember', id);
                let key = id + '_' + quality;
                let qualityData = GlobalVar.tblApi.getDataBySingleKey('TblMemberQuality', key);
                nodeItem.getChildByName('labelName').getComponent(cc.Label).string = fighterData.strName + ' ' + qualityData.strQualityDisplay;
                nodeItem.getChildByName('labelName').color = GlobalFunc.getCCColorByQuality(quality);

                if (nextMasterData['nMix'+(i+1)+'CombatReq'] <= 0) {
                    nodeItem.getChildByName('labelProgress').active = false;
                    nodeSeat.getChildByName('progressActiveBar').getComponent(cc.ProgressBar).progress = 0;
                } else {
                    nodeItem.getChildByName('labelProgress').active = true;
                    nodeItem.getChildByName('labelProgress').getComponent(cc.Label).string = member.Combat + '/' + nextMasterData['nMix'+(i+1)+'CombatReq'];
                    nodeSeat.getChildByName('progressActiveBar').getComponent(cc.ProgressBar).progress = member.Combat / nextMasterData['nMix'+(i+1)+'CombatReq'];
                }
            } else {
                nodeNone.active = true;
                nodeItem.active = false;
                nodeSeat.getChildByName('progressActiveBar').getComponent(cc.ProgressBar).progress = 0;
            }
        }
    },

    clearView: function () {
        for (let i = 0; i < 4; i++) {
            let nodeSeat = this.nodeContent.children[i];
            let nodeNone = nodeSeat.getChildByName('nodeNone');
            let nodeItem = nodeSeat.getChildByName('nodeItem');

            nodeNone.active = true;
            nodeItem.active = false;
            nodeSeat.getChildByName('progressActiveBar').getComponent(cc.ProgressBar).progress = 0;
        }
    }

});
