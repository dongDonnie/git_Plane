const GlobalVar = require("globalvar");
const config = require("config");
const BattleManager = require('BattleManager');
const Defines = require('BattleDefines');

var self = null;
var buttonArray = [
    '',
    '',
    'btnoCharpter',
    'spritePlanetModel0',
    'btnStartBattle',
    '',
    '',
    '',
    'button',
    'btnoGuazai',
    'nodeTouzhi',//10
    'ItemObject',
    'button',
    'btnoCharpter',
    'spritePlanetModel1',
    'btnStartBattle',//15
    'btnoSkill',
    'button',
    'btnoEquipment',
    'btnLevelUpOne',
    'btnoAdvance',//20
    'btnQualityUp',
    'button',
    'btnoCharpter',
    'spritePlanetModel2',
    'btnStartBattle',//25
    '',
    'button',
    'btnoPlane',
    'btnoAdvance',
    'btnoLevelUp',//30
    'button',
    'button',
    'btnoCharpter',
    'spritePlanetModel3',
    'btnStartBattle',//35
    '',
    '',
    'btnoEndless',
    '',
    ''
];
var labelArray = [
    '亲爱的指挥官,我是娜娜,欢迎来到我们的世界,请激活您的第一架战机',
    '',
    '点击闯关,让我们开始第一次旅程',
    '点击第一关,让敌人看看我们的实力!',
    '',
    '滑动战机,可进行移动',//5
    '战斗中会掉落这些道具',
    '子弹只有击中中心点时战机的生命值才会减少',
    '点击返回,我们去装备投掷炸弹',
    '获得了新的投掷炸弹，点击挂载',
    '',//10
    '点击装备投掷炸弹',
    '',
    '已经装备了投掷炸弹,让我们继续冒险',
    '',
    '',
    '释放【投掷】炸弹,可以清除全屏子弹,产生巨大威力',//16
    '现在去强化装备',
    '',
    '',
    '现在去升阶吧',
    '',
    '强化成功，让我们开始下一场战斗',//22
    '',
    '',
    '',
    '',
    '现在，我们去升级战机',//27
    '',
    '',
    '',
    '战机升级成功，战力提升，现在去完成最后的考验。',//31
    '',
    '',
    '',
    '',
    '',
    '你已经成功通过了考验,是一名合格的指挥官了,加油,暴风要塞的未来就靠你了!',//37
    '无尽征战已开启，亲爱的指挥官，请迎接你的挑战吧！',
    '',
    '',
    '',
    '',
    ''
];
var dialoguePosArray = [-200, 0, 0, 150, 0, 50, -200, -200, 0, 0, 0, -200];

const guide = cc.Class({
    extends: cc.Component,
    statics: {
        instance: null,
        getInstance: function () {
            if (guide.instance == null) {
                guide.instance = new guide();
            }
            return guide.instance;
        },
        destroyInstance() {
            if (guide.instance != null) {
                delete guide.instance;
                guide.instance = null;
            }
        }
    },

    ctor: function () {
        self = this;
        self.id = 0;
        self.step = 0;
        self.mapLoop = false;
        self.watchBlt = false;
    },

    enter: function () {
        var level = GlobalVar.me().getLevel();
        // config.NEED_GUIDE = false;
        if (level > 1 && self.id == 0)
            config.NEED_GUIDE = false;
        if (config.NEED_GUIDE) {
            this.enterMain();
        }
    },

    enterMain: function () {
        self.getSprite(0);
        this.unscheduleAllCallbacks();
        if (self.id == 1 && self.step != 38) {
            self.watchBlt = false;
            self.step = 8;
        }
        self.id++;
        self.doNextStep();
    },

    getSprite: function (scenetype) {
        if (scenetype == 1) {
            self.introductionSprite = cc.find('Canvas/GuideNode/Introductions');
        }
        self.continueSprite = cc.find('Canvas/GuideNode/continue');
        self.continueSprite.runAction(cc.repeatForever(cc.sequence(cc.fadeIn(0.7), cc.fadeOut(0.7))));
        self.guideNode = cc.find('Canvas/GuideNode');
        self.maskSprite = cc.find('Canvas/GuideNode/GuideMask');
        self.fighterSprite = cc.find('Canvas/GuideNode/fighter');
        self.fingerSprite = cc.find('Canvas/GuideNode/finger');
        self.dialogueSprite = cc.find('Canvas/GuideNode/dialogue');
    },

    enterBattle: function () {
        this.unscheduleAllCallbacks();
        self.getSprite(1);
        if (self.step == 5) {
            BattleManager.getInstance().gameState = Defines.GameResult.PAUSE;
            self.mapLoop = true;
            self.doNextStep();
        } else if (self.step == 16) {
            self.btnoSkill = self.seekNodeByName("btnoSkill");
            self.btnoSkill.active = false;
            self.scheduleOnce(() => {
                BattleManager.getInstance().gameState = Defines.GameResult.PAUSE;
                self.doNextStep();
            }, 4);
        } else if (self.step == 26 || self.step == 36) {
            self.guideNode.active = false;
            self.step++;
        }
    },

    escape: function () {
        //var GuideNode = cc.find('Canvas/GuideNode');
        //self.window.destroy();
        // self.btnClone.destroy();
    },

    doNextStep: function () {
        self.initNode();
        setTimeout(() => {
            cc.log(self.step);
            self.showBtn();
        }, 100);
    },

    clickBtn: function (clickBtnName) {
        if (!config.NEED_GUIDE)
            return;
        var scenetype = GlobalVar.sceneManager().getCurrentSceneType();
        if (scenetype != 4 && scenetype != 5) return;
        if (clickBtnName == 'btnoPause') {
            cc.director.getScheduler().pauseTarget(self);
            return;
        } else if (clickBtnName == 'btnRecv' || clickBtnName == 'btnEnd') {
            return;
        } else if (clickBtnName == 'btnoContinue') {
            setTimeout(() => {
                cc.director.getScheduler().resumeTarget(self);
            }, 3000);
            return;
        } else if ((clickBtnName == 'ItemObject' && self.step != 11) || clickBtnName == 'btnoSkill' || clickBtnName =='btnoAssist') return;

        var cbtn = cc.find('Canvas/GuideNode/btnClone');
        self.fingerSprite.active = false;
        if (!!cbtn) {
            setTimeout(() => {
                cbtn.removeFromParent();
            }, 10);
        }
        if (self.step == 5 || self.step == 16 || self.step == 26 || self.step == 36) {
            return;
        } else if (self.step == 6) {
            BattleManager.getInstance().gameState = Defines.GameResult.RUNNING;
            self.mapLoop = false;
            self.scheduleOnce(() => {
                BattleManager.getInstance().gameState = Defines.GameResult.PAUSE;
                self.doNextStep();
            }, 5);
            return;
        } else if (self.step == 7) {
            BattleManager.getInstance().gameState = Defines.GameResult.RUNNING;
            self.scheduleOnce(() => {
                self.watchBlt = true;
            }, 2);
            return;
        } else if (self.step == 8) {
            BattleManager.getInstance().gameState = Defines.GameResult.RUNNING;
            return;
        } else if (self.step == 17 && scenetype == 5) {
            self.guideNode.active = false;
            BattleManager.getInstance().gameState = Defines.GameResult.RUNNING;
            self.btnoSkill.active = true;
            self.btnoSkill.x = -257.5;
            cc.find('Canvas/UINode/UIBattle').getComponent('UIBattle').onSkillClick();
            return;
        } else if (self.step == 20) {
            self.maskSprite.opacity = 0;
            setTimeout(() => {
                self.maskSprite.opacity = 80;
                self.doNextStep();
            }, 3000);
            return;
        } else if (self.step == 22) {
            self.maskSprite.opacity = 0;
            return;
        } else if (self.step == 31) {
            self.seekNodeByName('NormalEquipment').getComponent('NormalEquipment').levelUp();
            setTimeout(() => {
                self.doNextStep();
            }, 800);
            return;
        }

        if (self.step == 39) {
            self.guideNode.active = false;
            config.NEED_GUIDE = false;
            require("CommonWnd").showEndlessView();
            return;
        }
        self.doNextStep();
    },

    showLabel: function () {
        if (!self.dialogueSprite) return;
        var text = self.dialogueSprite.getChildByName('text');
        if (!text) return;
        var step = self.step;
        text.getComponent(cc.Label).string = labelArray[step];
        self.dialogueSprite.y = step < 12 ? dialoguePosArray[step] : 0;

        self.dialogueSprite.active = labelArray[step] != '';
        self.dialogueSprite.runAction(cc.sequence(cc.delayTime(0.5), cc.fadeIn(0.5)));
    },

    showSprite: function () {
        if (!self.fighterSprite || !self.fingerSprite) return;
        self.fingerSprite.zIndex = 100;
        var step = self.step;

        var touchStart = function () {
            self.guideNode.active = false;
            self.clickBtn();
        }
        
        //maskSprite
        if (step == 1) {
            self.maskSprite.active = false;
        } else if (step == 5) {
            self.maskSprite.active = true;
            self.maskSprite.opacity = 0;
        } else {
            self.maskSprite.active = true;
            self.maskSprite.opacity = 80;
        }
        if (step == 5 || step == 6 || step == 7) {
            self.maskSprite.once('touchend', touchStart, self);
        }

        //fighterSprite
        if (step == 0) {
            self.fighterSprite.active = true;
            self.fighterSprite.getComponent('PlaneObject').setDisPlayLoop(2);
        } else if (step == 5) {
            setTimeout(() => {
                self.fighterSprite.active = true;
                self.fingerSprite.active = true;
                self.fingerSprite.opacity = 255;
            }, 1000);
        } else if (step == 7) {
            self.fighterSprite.active = true;
            self.fighterSprite.children[0].active = true;
            self.fighterSprite.children[1].active = false;
            self.fighterSprite.children[2].active = false;
            self.fighterSprite.scale = 2;
        } else {
            self.fighterSprite.active = false;
        }

        //fingerSprite
        if (step == 5) {
            self.fingerSprite.getComponent(cc.Animation).play('animeFinger2');
        } else {
            self.fingerSprite.getComponent(cc.Animation).play();
        }

        //continueSprite
        if (step == 6 || step == 7 || step == 37) {
            self.continueSprite.active = true;
        } else {
            self.continueSprite.active = false;
        }

        //introductionSprite
        if (step == 6) {
            self.introductionSprite.opacity = 0;
            self.introductionSprite.active = true;
            self.introductionSprite.runAction(cc.sequence(cc.delayTime(0.5), cc.fadeIn(0.5)));
        }

        //else
        if (step == 16) {
            self.btnClone.once('touchend', touchStart, self);
        }

        if (step == 37) {
            var over = function () {
                self.guideNode.active = false;
                config.NEED_GUIDE = false;
            }
            self.maskSprite.once('touchend', over, self);
        }
    },

    showBtn: function () {
        var step = self.step;
        self.cloneBtn(buttonArray[step]);

        if (step == 0) {
            var RecvCallback = function () {
                require("windowmgr").getInstance().popView(false, null, false);
            }
            var callback = function () {
                require("CommonWnd").showGetNewRareItemWnd(710, 0, 3, RecvCallback);
                self.cloneBtn('btnRecv');
            }
            cc.find('Canvas/GuideNode/fighter/btn_active').once('touchend', callback, this);
        }
    },

    cloneBtn: function (nodename) {
        if (self.step == 0 || self.step == 5 || self.step == 6 || self.step == 7 || self.step == 37) {
            self.showLabel();
            self.showSprite();
            self.step++;
        }
        if (nodename == '') return;
        var btn = self.seekNodeByName(nodename);
        if (btn == null) {
            setTimeout(() => {
                self.cloneBtn(nodename);
            }, 300);
            return;
        }

        self.showLabel();
        self.showSprite();

        self.btnClone = cc.instantiate(btn);
        self.guideNode.addChild(self.btnClone);
        self.btnClone.name = 'btnClone';
        self.btnClone.active = false;

        setTimeout(() => {
            self.btnClone.active = true;
            var pos0 = btn.parent.convertToWorldSpaceAR(btn);
            var pos1 = self.guideNode.convertToNodeSpaceAR(pos0);
            self.btnClone.setPosition(pos1);
            self.fingerSprite.setPosition(pos1);
            if (nodename == 'btnoSkill') {
                self.fingerSprite.setPosition(cc.v3(-257.5, pos1.y));
                self.btnClone.runAction(cc.sequence(cc.moveTo(0, cc.v3(-382.5, pos1.y)), cc.moveTo(0.2, cc.v3(-257.5, pos1.y))));
            }
            self.fingerSprite.opacity = 0;
            // if (self.step != 2)
                self.fingerSprite.active = true;
            self.fingerSprite.runAction(cc.sequence(cc.delayTime(0.2), cc.fadeIn(0.3)));
        }, 300);

        for (const key in btn) {
            if (!self.btnClone.hasOwnProperty(key) && btn.hasOwnProperty(key)) {
                self.btnClone[key] = btn[key];
            }
        }

        if (nodename.indexOf('spritePlanetModel') != -1) {
            var anime = self.seekNodeByName(self.btnClone, 'nodeSeletedAnimeModel');
            if (anime) {
                anime.getChildByName("spriteCircleAnime1").runAction(cc.repeatForever(cc.rotateBy(4, 360)));
                anime.getChildByName("spriteCircleAnime2").runAction(cc.repeatForever(cc.rotateBy(4, -360)));
                anime.getChildByName("spriteCircleAnime3").runAction(cc.repeatForever(cc.rotateBy(4, 360)));
            }
        }

        if (self.step == 11) {
            let path = 'cdnRes/itemicon/53/2/32100';
            self.btnClone.getChildByName('spriteItemIcon').getComponent("RemoteSprite").loadFrameFromLocalRes(path);
        }

        self.step++;
    },

    showQuit: function (target) {
        if (config.NEED_GUIDE) {
            target.node.getChildByName('btnoGiveUp').active = false;
            cc.director.getScheduler().pauseTarget(self);
        }
    },

    showRecv: function (target) {
        if (config.NEED_GUIDE) {
            this.seekNodeByName(target.node, 'btnRecv').active = true;
            this.seekNodeByName(target.node, 'btnRecvNew').active = false;
            this.seekNodeByName(target.node, 'btnRecvAll').active = false;
            this.seekNodeByName(target.node, 'label').active = false;
        }
    },

    guideToEndless: function () {
        require("windowmgr").getInstance().popToRoot();
        config.NEED_GUIDE = true;
        self.step = 38;
        this.enterMain();
    },

    initNode: function () {
        self.guideNode.active = true;
        self.maskSprite.active = true;
        self.fighterSprite.active = false;
        self.dialogueSprite.active = false;
        self.dialogueSprite.opacity = 0;
        self.fingerSprite.active = false;
        self.fingerSprite.opacity = 0;
        if (!!self.introductionSprite) {
            self.introductionSprite.active = false;
        }
        if (!!this.seekNodeByName('MaskBack'))
            this.seekNodeByName("MaskBack").active = false;
    },

    seekNodeByName: function (root, name) {
        if (!root) {
            return null;
        }
        if (typeof name == 'undefined') {
            name = root;
            root = cc.find('Canvas');
        }
        if (root.name === name) {
            return root;
        }
        var arrayRootChildren = root.children;
        var length = arrayRootChildren.length;
        for (var i = 0; i < length; i++) {
            var child = arrayRootChildren[i];
            var res = self.seekNodeByName(child, name);
            if (res != null) {
                return res;
            }
        }
        return null;
    },

    update: function (dt) {
        if (self.mapLoop) {
            BattleManager.getInstance().managers[Defines.MgrType.SCENARIO].battleCampaignMode.mapUpdate(Defines.BATTLE_FRAME_SECOND);
        }
        if (self.watchBlt) {
            if (BattleManager.getInstance().managers[Defines.MgrType.ENTITY].entityMonBltList.length > 0) {
                self.watchBlt = false;
                self.scheduleOnce(() => {
                    if (BattleManager.getInstance().gameState == Defines.GameResult.RUNNING) {
                        BattleManager.getInstance().gameState = Defines.GameResult.PAUSE;
                        self.doNextStep();
                    }
                }, 0.5)
            }
        }
    },

});
