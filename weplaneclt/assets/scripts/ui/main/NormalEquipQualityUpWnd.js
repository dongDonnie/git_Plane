const RootBase = require("RootBase");
const WindowManager = require("windowmgr");
const GlobalVar = require('globalvar')
const WndTypeDefine = require("wndtypedefine");
const EventMsgID = require("eventmsgid");
const ResMapping = require("resmapping");
const GameServerProto = require("GameServerProto");
const ShaderUtils = require("ShaderUtils");
const GlobalFunc = require('GlobalFunctions');
const config = require('config');

cc.Class({
    extends: RootBase,

    properties: {
        spriteEquip: {
            default: null,
            type: cc.Sprite,
        },
        effectFrontNode: {
            default: null,
            type: cc.Node,
        },
        effectBackNode: {
            default: null,
            type: cc.Node,
        },
        spineEffect: {
            default: null,
            type:sp.Skeleton
        },
        spriteContinue: {
            default: null,
            type: cc.Sprite,
        },
        labelTip: {
            default: null,
            type: cc.Node,
        },
        addValue: {
            default: null,
            type: cc.Node,
        },
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_EQUIP_QUALITY_UP_WND;
        this.beforeIcon = 0;
        this.afterIcon = 0;
        this.animeStartParam(0);

        if (GlobalFunc.isAllScreen() && !this.fixViewComplete) {
            this.fixViewComplete = true;
            this.fixView();
        }
    },

    fixView: function () {
        this.spineEffect.node.y -= 75;
    },

    update: function (dt) {
        let time = (Date.now() - this.shaderStartTime) / 1000;
        // ShaderUtils.setShader(this.spriteEquip, "white", time);
    },

    setDefaultEquipt: function (beforeIcon, afterIcon, equipNameBefore, equipName, equipColorBefore, equipColor, callback) {
        this.beforeIcon = beforeIcon;
        this.afterIcon = afterIcon;
        this.addValue.getChildByName('labelAddValuebefore').getComponent(cc.Label).string = equipNameBefore;
        this.addValue.getChildByName('labelAddValue').getComponent(cc.Label).string = equipName;
        this.addValue.getChildByName('labelAddValuebefore').color = GlobalFunc.getSystemColor(equipColorBefore);
        this.addValue.getChildByName('labelAddValue').color = GlobalFunc.getSystemColor(equipColor);
        this.callbackFunc = callback;
    },

    animeStartParam: function (param) {
        this.node.opacity = param;
    },

    animePlayCallBack: function (name) {
        if (name == "Escape") {
            this._super("Escape");
            GlobalVar.eventManager().removeListenerWithTarget(this);
            this.spriteEquip.spriteFrame = "";
            this.effectBackNode.active = false;
            this.spriteContinue.node.stopAllActions();
            this.spriteContinue.node.active = false;        
            this.labelTip.active = false;
            this.labelTip.y -= 250;
            this.addValue.active = false;
            this.addValue.y += 95;
            WindowManager.getInstance().popView();
        } else if (name == "Enter") {
            this._super("Enter");
            if (config.NEED_GUIDE) {
                require('Guide').getInstance().guideNode.active = false;
            }
            this.registerEvent();
            this.initEquipQualityUpWnd();
        }
    },

    registerEvent: function () {
        // GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_SHOW_MAIL_LIST, this.showMailList, this);
        // GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_SET_MAIL_READSTATUS, this.setMailReadStatus, this);
        // GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_NEW_MAIL, this.addNewMail, this);
        // GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_DELETE_MAIL, this.deleteMail, this);
    },

    initEquipQualityUpWnd: function () {
        if (this.beforeIcon == 0) {
            GlobalVar.eventManager().removeListenerWithTarget(this);
            WindowManager.getInstance().popView();
            return;
        }
        this.canClose = false;

        let self = this;
        let index = self.beforeIcon / 10 % 10 + 1;
        GlobalVar.resManager().loadRes(ResMapping.ResType.SpriteFrame, 'cdnRes/itemiconBig/' + index + '/' + this.beforeIcon, function (frame) {
            self.spriteEquip.spriteFrame = frame;
            self.playQualityUpAnime();
        });
    },

    playQualityUpAnime: function () {
        let self = this;
        let effect0 = this.spineEffect;
        let effect1 = this.effectFrontNode.getComponent(dragonBones.ArmatureDisplay);
        let effect2 = this.effectBackNode.getComponent(dragonBones.ArmatureDisplay);
        effect0.node.active = true;
        // effect0.clearTracks();
        // effect0.setAnimation(0, "animation", false);
        let effect1Finish = function () {
            effect1.node.active = false;
            self.shaderStartTime = Date.now();
        };
        let effect2Finish = function () {
            self.callbackFunc();
            self.close();
        };
        let effect0Finish = function () {
            effect0.node.active = false;
            GlobalFunc.playDragonBonesAnimation(effect1.node, effect1Finish);
            let callfunc = cc.callFunc(() => {
                let index = self.afterIcon / 10 % 10 + 1;
                GlobalVar.resManager().loadRes(ResMapping.ResType.SpriteFrame, 'cdnRes/itemiconBig/' + index + '/' + self.afterIcon, function (frame) {
                    self.spriteEquip.spriteFrame = frame;
                    GlobalFunc.playDragonBonesAnimation(effect2.node, effect2Finish);

                    self.scheduleOnce(() => {
                        self.showTextAnime();
                    }, 1.8);
                });
            })
            let seq = cc.sequence(cc.scaleTo(0.7, 0.5), callfunc, cc.scaleTo(0.25, 2), cc.scaleTo(0.2, 1))
            self.spriteEquip.node.runAction(seq);
        };
        
        GlobalFunc.playSpineAnimation(effect0.node, effect0Finish , false)
        // effect0.setCompleteListener(trackEntry => {
        //     var animationName = trackEntry.animation ? trackEntry.animation.name : "";
        //     if (animationName == "animation") {
        //         effect0.node.active = false;
        //         effect1.node.active = true;
        //         effect1.playAnimation("animation", 1);
        //         self.spriteEquip.node.runAction(cc.sequence(cc.scaleTo(0.7, 0.5), cc.callFunc(() => {
        //             let index = self.afterIcon / 10 % 10 + 1;
        //             GlobalVar.resManager().loadRes(ResMapping.ResType.SpriteFrame, 'cdnRes/itemiconBig/' + index + '/' + self.afterIcon, function (frame) {
        //                 self.spriteEquip.spriteFrame = frame;
        //                 effect2.node.active = true;
        //                 effect2.playAnimation("animation", 1);

        //                 self.scheduleOnce(() => {
        //                     self.showTextAnime();
        //                 }, 1.8);
        //             });
        //         }), cc.scaleTo(0.25, 2), cc.scaleTo(0.2, 1)));
        //     }
        // });
        // // effect1.setAnimation(0, "animation", false);
        // effect1.addEventListener(dragonBones.EventObject.COMPLETE, event => {
        //     var animationName = event.animationState ? event.animationState.name : "";
        //     if (animationName == "animation") {
        //         effect1.node.active = false;
        //         self.shaderStartTime = Date.now();
        //     }
        // });

        

        // effect2.addEventListener(dragonBones.EventObject.COMPLETE, event => {
        //     var animationName = event.animationState ? event.animationState.name : "";
        //     if (animationName == "animation") {
        //         self.callbackFunc();
        //         self.close();
        //     }
        // });
    },

    showTextAnime: function () {
        this.spriteContinue.node.active = true;
        this.spriteContinue.node.runAction(cc.repeatForever(cc.sequence(cc.fadeIn(0.7), cc.fadeOut(0.7))));
        // this.effectBackNode.stopAnimation();
        this.effectBackNode.getComponent(dragonBones.ArmatureDisplay).armature().animation.stop();
        
        let self = this;
        
        this.labelTip.active = true;
        this.labelTip.scale = 0;
        this.labelTip.runAction(cc.spawn(cc.scaleTo(0.2, 1), cc.moveBy(0.2, 0, 250)));
        this.addValue.active = true;
        this.addValue.scale = 0;
        this.addValue.runAction(cc.sequence(cc.spawn(cc.scaleTo(0.2, 1), cc.moveBy(0.2, 0, -95)), cc.callFunc(()=>{
            self.canClose = true;
        })));

        // if (GlobalVar.me().level == 3){
        //     let self = this;
        //     this.scheduleOnce(()=>{
        //         self.onTouchMain();
        //     }, 0.5);
        // }
    },

    onTouchMain: function () {
        if (this.canClose){
            this.callbackFunc();
            GlobalVar.me().propData.getShowCombatLate();
            this.close();
            if (config.NEED_GUIDE) {
                require('Guide').getInstance().doNextStep();
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

});