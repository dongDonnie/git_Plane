const RootBase = require("RootBase");
const WindowManager = require("windowmgr");
const GlobalVar = require('globalvar')
const WndTypeDefine = require("wndtypedefine");
const GlobalFunc = require('GlobalFunctions');
const PlaneEntity = require('PlaneEntity');

const AUDIO_QUALITY_UP2 = 'cdnRes/audio/main/effect/shengjie2'
cc.Class({
    extends: RootBase,

    properties: {
        nodePlane: {
            default: null,
            type: cc.Node,
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
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_PLANE_QUALITY_UP_WND;

        this.animeStartParam(0);

        if (GlobalFunc.isAllScreen() && !this.fixViewComplete) {
            this.fixViewComplete = true;
            this.fixView();
        }
    },

    fixView: function () {
        this.spineEffect.node.y -= 75;
    },

    setDefaultEquipt: function (qualityDataCur, qualityData, callback) {
        this.nodePlane.removeAllChildren();
        this.addValue.getChildByName('labelAddValuebefore').getComponent(cc.Label).string = qualityDataCur.strQualityDisplay;
        this.addValue.getChildByName('labelAddValue').getComponent(cc.Label).string = qualityData.strQualityDisplay;
        this.addValue.getChildByName('labelAddValuebefore').color = GlobalFunc.getCCColorByQuality(qualityDataCur.wQuality);
        this.addValue.getChildByName('labelAddValue').color = GlobalFunc.getCCColorByQuality(qualityData.wQuality);
        this.callbackFunc = callback;

        let planeEntity = new PlaneEntity();
        planeEntity.newPart('Fighter/Fighter_' + qualityData.wMemberID, 1, 'PlaneObject', 3, 0, 0);
        planeEntity.setPosition(0, 0);
        this.nodePlane.addChild(planeEntity);
    },

    animeStartParam: function (param) {
        this.node.opacity = param;
    },

    animePlayCallBack: function (name) {
        if (name == "Escape") {
            this._super("Escape");
            this.nodePlane.removeAllChildren();
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
            this.spineEffect.node.active = false;
            this.initEquipQualityUpWnd();
        }
    },

    initEquipQualityUpWnd: function () {
        this.canClose = false;

        let self = this;
       
        self.playQualityUpAnime();
    },

    playQualityUpAnime: function () {
        let self = this;
        let effect0 = this.spineEffect;
        let effect1 = this.effectFrontNode.getComponent(dragonBones.ArmatureDisplay);
        let effect2 = this.effectBackNode.getComponent(dragonBones.ArmatureDisplay);
        let originNode = this.seekNodeByName(cc.find('Canvas'), 'nodeItemQ');
        GlobalFunc.converToOtherNodeSpaceAR(originNode, this.spineEffect.node);
        effect0.node.active = true;
        effect0.node.opacity = 0;
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
                GlobalFunc.playDragonBonesAnimation(effect2.node, effect2Finish);

                self.scheduleOnce(() => {
                    self.showTextAnime();
                }, 1.8);
            })
            let seq = cc.sequence(cc.scaleTo(0.7, 0.5), callfunc, cc.scaleTo(0.25, 2), cc.scaleTo(0.2, 1.2))
            self.nodePlane.runAction(seq);
        };
        effect0.node.runAction(cc.sequence(cc.delayTime(0.02), cc.fadeIn(0)));
        GlobalFunc.playSpineAnimation(effect0.node, effect0Finish)
    },

    showTextAnime: function () {
        this.spriteContinue.node.active = true;
        this.spriteContinue.node.runAction(cc.repeatForever(cc.sequence(cc.fadeIn(0.7), cc.fadeOut(0.7))));
        GlobalFunc.stopDragonBonesAnimation(this.effectBackNode);
        GlobalVar.soundManager().playEffect(AUDIO_QUALITY_UP2);
        let self = this;
        
        this.labelTip.active = true;
        this.labelTip.scale = 0;
        this.labelTip.runAction(cc.spawn(cc.scaleTo(0.2, 1), cc.moveBy(0.2, 0, 250)));
        this.addValue.active = true;
        this.addValue.scale = 0;
        this.addValue.runAction(cc.sequence(cc.spawn(cc.scaleTo(0.2, 1), cc.moveBy(0.2, 0, -95)), cc.callFunc(()=>{
            self.canClose = true;
        })));
    },

    onTouchMain: function () {
        if (this.canClose){
            this.callbackFunc();
            GlobalVar.me().propData.getShowCombatLate();
            this.close();
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