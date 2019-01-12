const WindowManager = require("windowmgr");
const WndTypeDefine = require("wndtypedefine");
const RootBase = require("RootBase");
const GlobalVar = require('globalvar')
const EventMsgID = require("eventmsgid");
const CommonWnd = require("CommonWnd");
const GlobalFunc = require('GlobalFunctions');
const i18n = require('LanguageData');
const GameServerProto = require("GameServerProto");
const BattleManager = require('BattleManager');
const weChatAPI = require("weChatAPI");

const AUDIO_SHILIANCHOU = 'cdnRes/audio/main/effect/shilianchou';


cc.Class({
    extends: RootBase,

    properties: {
        spineTreasureBox: {
            default: null,
            type: sp.Skeleton,
        },
        animePlaying: {
            default: false,
            visible: false,
        },
        labelFreeTime: {
            default: null,
            type: cc.Label,
        }
    },

    onLoad: function () {
        this._super();
        i18n.init('zh');
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMALDRAW_VIEW;
        this.animeStartParam(0);
        if (GlobalFunc.isAllScreen() && !this.fixViewComplete) {
            this.fixViewComplete = true;
            this.fixView();
        }

        let nodeBottom = this.node.getChildByName("nodeBottom");
        // if (!GlobalVar.getShareSwitch()){
        if (true) {
            nodeBottom.getChildByName("labelFreeDraw").active = false;
            nodeBottom.getChildByName("btnFreeDraw").active = false;
            nodeBottom.getChildByName("btnTenDraw").x = 150;
            nodeBottom.getChildByName("btnSingleDraw").x = -150;
            nodeBottom.getChildByName("spriteSingleDrawCost").x = -162;
            nodeBottom.getChildByName("labelSingleDrawCost").x = -142;
            nodeBottom.getChildByName("spriteTenDrawCost").x = 135;
            nodeBottom.getChildByName("labelTenDrawCost").x = 155;
            nodeBottom.getChildByName("labelFreeTime").x = -150;
        } else {
            nodeBottom.getChildByName("labelFreeDraw").active = true;
            nodeBottom.getChildByName("btnFreeDraw").active = true;
            nodeBottom.getChildByName("btnTenDraw").x = 200;
            nodeBottom.getChildByName("btnSingleDraw").x = 0;
            nodeBottom.getChildByName("spriteSingleDrawCost").x = -12;
            nodeBottom.getChildByName("labelSingleDrawCost").x = 8;
            nodeBottom.getChildByName("spriteTenDrawCost").x = 185;
            nodeBottom.getChildByName("labelTenDrawCost").x = 205;
            nodeBottom.getChildByName("labelFreeTime").x = 0;
        }

        this.countDownTimerID = -1;

        this.isFirstIn = true;
    },

    animeStartParam(num) {
        this.node.opacity = num;
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");

            if (this.countDownTimerID != -1) {
                GlobalVar.gameTimer().delTimer(this.countDownTimerID)
                this.countDownTimerID = -1;
            }

            // this.node.getChildByName("nodeBlock").active = true;
            GlobalVar.eventManager().removeListenerWithTarget(this);
            if (this.deleteMode) {
                if (WindowManager.getInstance().findViewIndex(WndTypeDefine.WindowType.E_DT_GUAZAIMAIN_WND) == -1) {
                    let uiNode = cc.find("Canvas/UINode");
                    BattleManager.getInstance().quitOutSide();
                    BattleManager.getInstance().startOutside(uiNode.getChildByName('UIMain').getChildByName('nodeBottom').getChildByName('planeNode'), GlobalVar.me().memberData.getStandingByFighterID(), true);
                }
            }
        } else if (name == "Enter") {
            this._super("Enter")
            this.registerEvent();
            this.initNormalDrawWnd();
        }
    },

    registerEvent: function () {
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_TREASURE_MINING_RESULT, this.showDrawItemInfo, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_RECIVE_DRAW_REWARD, this.playBoxCloseAnime, this);
    },

    initNormalDrawWnd: function () {
        if (WindowManager.getInstance().findViewIndex(WndTypeDefine.WindowType.E_DT_GUAZAIMAIN_WND) == -1) {
            BattleManager.getInstance().quitOutSide();
        }
        if (this.isFirstIn) {
            this.isFirstIn = false;
            this.initSpine();
        }

        let oneFreeCount = GlobalVar.me().drawData.getOneFreeCount();
        let oneFreeMax = GlobalVar.tblApi.getDataBySingleKey('TblParam', GameServerProto.PTPARAM_TREASURE_ONE_FREE_MAX).dValue;
        this.node.getChildByName("nodeBottom").getChildByName("labelFreeDraw").getComponent(cc.Label).string = oneFreeCount + "/" + oneFreeMax;

        // this.node.getChildByName("nodeBlock").active = false;        
        let normalRootWnd = WindowManager.getInstance().findViewInWndNode(WndTypeDefine.WindowType.E_DT_NORMALROOT_WND);
        if (normalRootWnd) {
            this.normalRootReturnBtn = normalRootWnd.getComponent(WndTypeDefine.WindowType.E_DT_NORMALROOT_WND).btnReturn;
        }


        this.setCountDown();
    },

    setCountDown: function () {
        if (this.countDownTimerID == -1) {
            let self = this;
            this.countDownTimerID = GlobalVar.gameTimer().startTimer(function () {
                self.showFreeDrawTime();
            }, 1);
            this.showFreeDrawTime();
        }
    },

    showFreeDrawTime: function () {
        let nextFreeTime = GlobalVar.me().drawData.getNextFreeTime();
        if (nextFreeTime <= GlobalVar.me().serverTime) {
            // this.labelFreeTime.active = false;
            this.labelFreeTime.string = i18n.t('label.4000325');
            this.labelFreeTime.node.y = 20;
            this.node.getChildByName("nodeBottom").getChildByName("spriteSingleDrawCost").active = false;
            this.node.getChildByName("nodeBottom").getChildByName("labelSingleDrawCost").active = false;
        } else {
            let leftTime = nextFreeTime - GlobalVar.me().serverTime;
            let hour = parseInt(leftTime / 3600);
            let min = parseInt((leftTime - hour * 3600) / 60);
            let sec = parseInt(leftTime - hour * 3600 - min * 60);
            if (hour) {
                this.labelFreeTime.string = i18n.t('label.4000323').replace('%hour', hour).replace('%min', min);
            } else {
                this.labelFreeTime.string = i18n.t('label.4000324').replace('%min', min).replace('%sec', sec);
            }
            this.labelFreeTime.node.y = -90;
            this.node.getChildByName("nodeBottom").getChildByName("spriteSingleDrawCost").active = true;
            this.node.getChildByName("nodeBottom").getChildByName("labelSingleDrawCost").active = true;
            // this.labelFreeTime.string = i18n.t('label.4000326').replace('%hour', hour).replace('%min', min).replace('%sec', sec);
        }
    },

    enter: function (isRefresh) {
        this.showFreeDrawTime();
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

    onBtnReturn: function () {
        if (this.animePlaying) {
            return;
        }
        this.close();
    },

    fixView: function () {
        // console.log("fix the allscreen");
        let bottomWidget = this.node.getChildByName("nodeBottom").getComponent(cc.Widget);
        bottomWidget.bottom += 60;
        bottomWidget.updateAlignment();
        let centerWidget = this.node.getChildByName("nodeCenter").getComponent(cc.Widget);
        centerWidget.top += 150;
        centerWidget.updateAlignment();
        let bgWidget = this.node.getChildByName("spriteDrawBg").getComponent(cc.Widget);
        bgWidget.top = 0;
        bgWidget.updateAlignment();
    },

    initSpine: function () {
        // this.spineTreasureBox.setMix('animation', 'animation2', 0.2);
        // this.spineTreasureBox.setMix('animation', 'animation3', 0.2);
        // this.spineTreasureBox.setMix('animation', 'animation4', 0.2);
        // this.spineTreasureBox.setMix('animation2', 'animation3', 0.2);
        // this.spineTreasureBox.setMix('animation2', 'animation4', 0.2);
        // this.spineTreasureBox.setMix('animation3', 'animation4', 0.2);
        this.spineTreasureBox.clearTracks();
        this.spineTreasureBox.setAnimation(0, "animation", true);
        let self = this;
        this.spineTreasureBox.setEndListener(trackEntry => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            if (animationName == "animation2") {
                if (self.showDrawItemWnd) {
                    self.showDrawItemWnd();
                    self.showDrawItemWnd = null;
                }
            }
        });
    },

    showDrawItemInfo(event) {
        let self = this;
        if (event.ErrCode && event.ErrCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            // let normalRootView = WindowManager.getInstance().getCeilingView();
            // let btnReturn = normalRootView.getComponent(WindowManager.getInstance().getCeilingViewTypeName()).btnReturn;
            if (this.normalRootReturnBtn) {
                this.normalRootReturnBtn.interactable = true;
            }
            this.animePlaying = false;
        } else {
            if (event.Type != GameServerProto.PT_TREASURE_WARM && event.Type != GameServerProto.PT_TREASURE_HOT) {
                return;
            }
            this.showFreeDrawTime();
            // 播放音效
            GlobalVar.soundManager().playEffect(AUDIO_SHILIANCHOU);

            let oneFreeCount = GlobalVar.me().drawData.getOneFreeCount();
            let oneFreeMax = GlobalVar.tblApi.getDataBySingleKey('TblParam', GameServerProto.PTPARAM_TREASURE_ONE_FREE_MAX).dValue;
            self.node.getChildByName("nodeBottom").getChildByName("labelFreeDraw").getComponent(cc.Label).string = oneFreeCount + "/" + oneFreeMax;


            let items = event.Item;
            let MODE_DRAW = 1
            this.playTreasureBoxAnime(0);
            this.showDrawItemWnd = function () {

                // let normalRootView = WindowManager.getInstance().getCeilingView();
                // let btnReturn = normalRootView.getComponent(WindowManager.getInstance().getCeilingViewTypeName()).btnReturn;
                if (self.normalRootReturnBtn) {
                    self.normalRootReturnBtn.interactable = true;
                }
                self.animePlaying = false;

                WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMALTREASUREEXPLOIT, function (wnd, type, name) {
                    wnd.getComponent(type).init(items, MODE_DRAW);

                    // self.animePlaying = false;
                });
            }
        }
    },

    playTreasureBoxAnime: function (trackNumber) {
        let block = cc.find("Canvas/BlockNode");
        if (cc.isValid(block)) {
            block.active = true;
        }
        this.spineTreasureBox.setCompleteListener((trackEntry, loopCount) => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            if (animationName === 'animation2') {
                if (cc.isValid(block)) {
                    block.active = false;
                }
            }
        });
        this.spineTreasureBox.setAnimation(0, 'animation2', false);
        this.spineTreasureBox.addAnimation(0, 'animation3', true, 0);
    },

    playBoxCloseAnime: function (event) {
        let block = cc.find("Canvas/BlockNode");
        if (cc.isValid(block)) {
            block.active = true;
        }
        this.spineTreasureBox.setCompleteListener((trackEntry, loopCount) => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            if (animationName === 'animation4') {
                if (cc.isValid(block)) {
                    block.active = false;
                }
            }
        });
        this.spineTreasureBox.setAnimation(0, 'animation4', false);
        this.spineTreasureBox.addAnimation(0, 'animation', true, 0);
    },

    onBtnPreviewBox: function () {
        if (this.animePlaying) {
            return;
        }
        // console.log("预览宝箱");
        let showItemData = GlobalVar.tblApi.getDataBySingleKey("TblTreasure", GameServerProto.PT_TREASURE_HOT).oVecShowDropItem;

        let itemMustIDVec = [],
            itemProbIDVec = [];
        for (let i = 0; i < showItemData.length; i++) {
            if (showItemData[i].nCount == 1) {
                itemMustIDVec.push(showItemData[i].wItemID);
            } else {
                itemProbIDVec.push(showItemData[i].wItemID);
            }
        }

        CommonWnd.showDrawBoxPreview(itemMustIDVec, itemProbIDVec);
    },

    onBtnDraw: function (event, count) {
        if (this.animePlaying || count == 0) {
            return;
        }

        // let normalRootView = WindowManager.getInstance().getCeilingView();
        // let btnReturn = normalRootView.getComponent(WindowManager.getInstance().getCeilingViewTypeName()).btnReturn;
        if (this.normalRootReturnBtn) {
            this.normalRootReturnBtn.interactable = false;
        }
        this.animePlaying = true;
        let self = this;
        let funCancle = function () {
            self.animePlaying = false;
            if (self.normalRootReturnBtn) {
                self.normalRootReturnBtn.interactable = true;
            }
        };
        let funClose = funCancle;

        count = parseInt(count);
        let SINGLE_DRAW = 1,
            TEN_DRAW = 10,
            TICKET_ICON_ID = 75,
            SINGLE_DRAW_DIAMOND_COST = 188,
            TEN_DRAW_DIAMOND_COST = 1680;
        let funConfirm = null,
            diamondCost = 0,
            ticketsEnough = false;
        let ticketsCost = count;
        ticketsEnough = GlobalVar.me().bagData.getItemCountById(TICKET_ICON_ID) > ticketsCost;

        if (count == SINGLE_DRAW) {
            let nextFreeTime = GlobalVar.me().drawData.getNextFreeTime();
            if (nextFreeTime <= GlobalVar.me().serverTime) {
                GlobalVar.handlerManager().drawHandler.sendSingleDrawReq(1);
                return;
            }
            funConfirm = function () {
                GlobalVar.handlerManager().drawHandler.sendSingleDrawReq(0);
            };
            diamondCost = SINGLE_DRAW_DIAMOND_COST;
        } else if (count == TEN_DRAW) {
            funConfirm = function () {
                GlobalVar.handlerManager().drawHandler.sendTenDrawReq(0);
            };
            diamondCost = TEN_DRAW_DIAMOND_COST;
        }

        let diamondEnough = GlobalVar.me().diamond >= diamondCost;
        if (!diamondEnough) {
            funConfirm = function () {
                CommonWnd.showNormalFreeGetWnd(GameServerProto.PTERR_DIAMOND_LACK, funCancle);
                funCancle();
            };
        }

        let title = ticketsEnough ? i18n.t('label.4000245') : i18n.t('label.4000246')
        let text = ticketsEnough ? i18n.t('label.4000247') : i18n.t('label.4000248')
        CommonWnd.showTreasureTipWnd(title, text, count, ticketsEnough, diamondEnough, funCancle, funConfirm, funClose);
    },

    onDestroy: function () {
        GlobalVar.eventManager().removeListenerWithTarget(this);
        if (this.countDownTimerID != -1) {
            GlobalVar.gameTimer().delTimer(this.countDownTimerID)
            this.countDownTimerID = -1;
        }
    },

    // onBtnFreeDraw: function (event) {
    //     if (this.animePlaying) {
    //         return;
    //     }
    //     if (cc.sys.platform !== cc.sys.WECHAT_GAME && !(window && window["wywGameId"]=="5496")){
    //         return;
    //     }

    //     let oneFreeCount = GlobalVar.me().drawData.getOneFreeCount();
    //     let oneFreeMax = GlobalVar.tblApi.getDataBySingleKey('TblParam', GameServerProto.PTPARAM_TREASURE_ONE_FREE_MAX).dValue;
    //     if (oneFreeCount >= oneFreeMax){
    //         return;
    //     }

    //     if (this.normalRootReturnBtn){
    //         this.normalRootReturnBtn.interactable = false;
    //     }
    //     this.animePlaying = true;

    //     let self = this;

    //     if (GlobalVar.getVideoAdSwitch()){
    //     // if (false){
    //         weChatAPI.showRewardedVideoAd(function () {
    //             GlobalVar.handlerManager().drawHandler.sendSingleDrawReq(1);
    //         }, function () {
    //             weChatAPI.shareNeedClick(104, function () {
    //                 GlobalVar.handlerManager().drawHandler.sendSingleDrawReq(1);
    //             });
    //         }, function () {
    //             self.animePlaying = false;
    //             if (self.normalRootReturnBtn){
    //                 self.normalRootReturnBtn.interactable = true;
    //             }
    //         })
    //     }else if (GlobalVar.getShareSwitch()){
    //     // }else if (true){
    //         weChatAPI.shareNeedClick(104, function () {
    //             GlobalVar.handlerManager().drawHandler.sendSingleDrawReq(1);
    //         }, function () {
    //             self.animePlaying = false;
    //             if (self.normalRootReturnBtn){
    //                 self.normalRootReturnBtn.interactable = true;
    //             }
    //         });
    //     }else{
    //         self.animePlaying = false;
    //         if (self.normalRootReturnBtn){
    //             self.normalRootReturnBtn.interactable = true;
    //         }
    //     }
    //     // weChatAPI.shareNeedClick(104, function () {
    //     //     GlobalVar.handlerManager().drawHandler.sendSingleDrawReq(1);
    //     // });
    // },

});