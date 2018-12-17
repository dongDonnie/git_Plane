const GlobalVar = require("globalvar");
const config = require("config");
const BattleManager = require('BattleManager');
const Defines = require('BattleDefines');

var self = null;
var buttonArray = [
    'btnoCharpter',
    'spritePlanetModel0',
    'btnStartBattle',
    '',
    '',
    '',
    'button', //6
    'btnoGuazai',
    'nodeTouzhi',
    'ItemObject',
    'button',
    'btnoCharpter',//11
    'spritePlanetModel1',
    'btnStartBattle',
    'btnoSkill',
    'button',//15
    'btnoEquipment',
    'btnLevelUpOne',
    'button',
    'btnoCharpter',
    'spritePlanetModel2',//20
    'btnStartBattle',
    '',
    '',
    'btnoEndless',//24
    '',
    ''
];
var labelArray = [
    '亲爱的指挥官,我是娜娜,欢迎来到王牌机战,点击闯关,让我们开始第一次旅程',
    '点击第一关,让敌人看看我们的实力!',
    '',
    '滑动战机,可进行移动',//3
    '战斗中会掉落这些道具',
    '子弹只有击中中心点时战机的生命值才会减少',
    '点击返回,我们去装备投掷炸弹',
    '获得了新的投掷炸弹，点击挂载',
    '',
    '点击装备投掷炸弹',
    '',
    '已经装备了投掷炸弹,让我们继续冒险',//11
    '',
    '',
    '释放【投掷】炸弹,可以清除全屏子弹,产生巨大威力',//14
    '现在去强化装备',
    '',
    '',
    '强化成功，让我们开始下一场战斗',//18
    '',
    '',
    '',
    '',
    '你已经成功通过了考验,是一名合格的指挥官了,加油,暴风要塞的未来就靠你了!',
    '无尽征战已开启，亲爱的指挥官，请迎接你的挑战吧！',//24
    '',
    '',
    '',
    '',
    ''
];
var dialoguePosArray = [0, 150, 0, 50, -200, -200, 0, 0, 0, -200];

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
        if (level > 1 && self.id == 0)
            config.NEED_GUIDE = false;
        if (config.NEED_GUIDE) {
            this.enterMain();
        }
    },

    enterMain: function () {
        self.getSprite(0);
        this.unscheduleAllCallbacks();
        if (self.id == 1 && self.step != 24) {
            self.watchBlt = false;
            self.step = 6;
        }
        self.id++;
        self.doNextStep();
        self.guideNode.on('touchstart', self.onTouchBg);
    },

    onTouchBg(event) {
        let pos = self.circle.convertToNodeSpaceAR(event.getLocation());
        let w = self.circle.width / 2;
        let h = self.circle.height / 2;

        if (pos.y < h && pos.y > -h && pos.x < w && pos.x > -w) {
            self.guideNode._touchListener.setSwallowTouches(false);
        } else {
            self.guideNode._touchListener.setSwallowTouches(true);
        }
    },

    getSprite: function (scenetype) {
        if (scenetype == 1) {
            self.introductionSprite = cc.find('Canvas/guideNode/Introductions');
        }
        self.continueSprite = cc.find('Canvas/guideNode/continue');
        self.continueSprite.runAction(cc.repeatForever(cc.sequence(cc.fadeIn(0.7), cc.fadeOut(0.7))));
        self.guideNode = cc.find('Canvas/guideNode');
        self.circle = cc.find('Canvas/guideNode/circle');
        self.fighterSprite = cc.find('Canvas/guideNode/fighter');
        self.fingerSprite = cc.find('Canvas/guideNode/finger');
        self.dialogueSprite = cc.find('Canvas/guideNode/dialogue');
    },

    enterBattle: function () {
        this.unscheduleAllCallbacks();
        self.getSprite(1);
        let touchStart =  function () {
            self.guideNode.active = false;
            self.clickBtn();
        }
        if (self.step == 3) {
            BattleManager.getInstance().gameState = Defines.GameResult.PAUSE;
            self.mapLoop = true;
            self.doNextStep();
            self.guideNode.on('touchstart', touchStart);
        } else if (self.step == 14) {
            self.btnoSkill = self.seekNodeByName("btnoSkill");
            self.btnoSkill.active = false;
            self.scheduleOnce(() => {
                BattleManager.getInstance().gameState = Defines.GameResult.PAUSE;
                self.doNextStep();
            }, 4);
        } else if (self.step == 22) {
            self.guideNode.active = false;
            self.step++;
            self.guideNode.on('touchstart', touchStart);
        }
    },

    doNextStep: function () {
        self.initNode();
        setTimeout(() => {
            // console.log('last step: ',self.step);
            self.showBtn();
        }, 100);
    },

    clickBtn: function (clickBtnName) {
        if (!config.NEED_GUIDE)
            return;
        // console.log('click Step: ', self.step);
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
        } else if ((clickBtnName == 'ItemObject' && self.step != 10) || clickBtnName == 'btnoSkill' || clickBtnName =='btnoAssist') return;

        self.fingerSprite.active = false;
        self.setCircleSize('');
        if (self.step == 3 || self.step == 14 || self.step == 22) {
            return;
        } else if (self.step == 4) {
            BattleManager.getInstance().gameState = Defines.GameResult.RUNNING;
            self.mapLoop = false;
            self.scheduleOnce(() => {
                BattleManager.getInstance().gameState = Defines.GameResult.PAUSE;
                self.doNextStep();
            }, 5);
            return;
        } else if (self.step == 5) {
            BattleManager.getInstance().gameState = Defines.GameResult.RUNNING;
            self.scheduleOnce(() => {
                self.watchBlt = true;
            }, 2);
            return;
        } else if (self.step == 6) {
            BattleManager.getInstance().gameState = Defines.GameResult.RUNNING;
            return;
        } else if (self.step == 15 && scenetype == 5) {
            self.guideNode.active = false;
            BattleManager.getInstance().gameState = Defines.GameResult.RUNNING;
            return;
        } else if (self.step == 18) {
            self.circle.getChildByName('mask').opacity = 0;
            setTimeout(() => {
                self.circle.getChildByName('mask').opacity = 120;
                self.doNextStep();
            }, 3000);
            return;
        }

        if (self.step == 25) {
            self.guideNode.active = false;
            config.NEED_GUIDE = false;
            // require("CommonWnd").showEndlessView();
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
        self.dialogueSprite.y = step < 10 ? dialoguePosArray[step] : 0;

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
        
        //mask
        if (step == 3) {
            self.circle.getChildByName('mask').active = true;
            self.circle.getChildByName('mask').opacity = 0;
        } else {
            self.circle.getChildByName('mask').active = true;
            self.circle.getChildByName('mask').opacity = 120;
        }

        //fighterSprite
        if (step == 3) {
            setTimeout(() => {
                self.fighterSprite.active = true;
                self.fingerSprite.active = true;
                self.fingerSprite.opacity = 255;
            }, 1000);
        } else if (step == 5) {
            self.fighterSprite.active = true;
            self.fighterSprite.children[0].active = true;
            self.fighterSprite.children[1].active = false;
            self.fighterSprite.children[2].active = false;
            self.fighterSprite.scale = 2;
        } else {
            self.fighterSprite.active = false;
        }

        //fingerSprite
        if (step == 3) {
            self.fingerSprite.getComponent(cc.Animation).play('animeFinger2');
        } else {
            self.fingerSprite.getComponent(cc.Animation).play();
        }

        //continueSprite
        if (step == 4 || step == 5 || step == 23) {
            self.continueSprite.active = true;
        }

        //introductionSprite
        if (step == 4) {
            self.introductionSprite.opacity = 0;
            self.introductionSprite.active = true;
            self.introductionSprite.runAction(cc.sequence(cc.delayTime(0.5), cc.fadeIn(0.5)));
        }

        //else
        if (step == 14) {
            self.btnoSkill.once('touchend', touchStart, self);
        }

        if (step == 23) {
            var over = function () {
                self.guideNode.active = false;
                config.NEED_GUIDE = false;
            }
            self.guideNode.once('touchend', over, self);
        }
    },

    showBtn: function () {
        var step = self.step;
        self.cloneBtn(buttonArray[step]);
    },

    cloneBtn: function (nodename) {
        if (self.step == 3 || self.step == 4 || self.step == 5 || self.step == 23) {
            self.showLabel();
            self.showSprite();
            self.step++;
            // console.log('current step: ', self.step);
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
        setTimeout(() => {
            var pos0 = btn.parent.convertToWorldSpaceAR(btn);
            var pos1 = self.guideNode.convertToNodeSpaceAR(pos0);
            self.fingerSprite.setPosition(pos1);
            self.fingerSprite.opacity = 0;
            self.fingerSprite.active = true;
            self.fingerSprite.runAction(cc.sequence(cc.delayTime(0.2), cc.fadeIn(0.3)));
            self.setCircleSize(btn, pos1);
            if (nodename == 'btnoSkill') {
                self.fingerSprite.setPosition(cc.v3(-257.5, pos1.y));
                self.btnoSkill.active = true;
                self.btnoSkill.runAction(cc.sequence(cc.moveTo(0, cc.v3(-382.5, pos1.y)), cc.moveTo(0.2, cc.v3(-257.5, pos1.y))));
                self.setCircleSize(btn, cc.v3(-257.5, pos1.y));
            }
        }, 300);

        self.step++;
        // console.log('current step: ', self.step);
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
        self.step = 24;
        this.enterMain();
    },

    showFinger: function () {
        self.getSprite(0);
        if (self.guideNode.active) return;
        self.initNode();
        let chapter = GlobalVar.me().campData.getChapterData(1, 1).length;
        let nodename = 'spritePlanetModel' + (chapter - 1);
        var btn = self.seekNodeByName(nodename);
        if (btn == null) {
            setTimeout(() => {
                self.showFinger(nodename);
            }, 300);
            return;
        }
        var pos0 = btn.parent.convertToWorldSpaceAR(btn);
        var pos1 = self.guideNode.convertToNodeSpaceAR(pos0);
        self.fingerSprite.setPosition(pos1);
        self.fingerSprite.opacity = 0;
        self.fingerSprite.active = true;
        self.fingerSprite.runAction(cc.sequence(cc.delayTime(0.2), cc.fadeIn(0.3)));
        self.fingerSprite.getComponent(cc.Animation).play();
        self.circle.active = false;
        self.guideNode.on('touchstart', () => {
            self.guideNode.active = false;
            self.guideNode._touchListener.setSwallowTouches(false);
        });
    },

    initNode: function () {
        self.guideNode.active = true;
        self.circle.active = true;
        self.fighterSprite.active = false;
        self.dialogueSprite.active = false;
        self.dialogueSprite.opacity = 0;
        self.fingerSprite.active = false;
        self.fingerSprite.opacity = 0;
        self.continueSprite.active = false;
        if (!!self.introductionSprite) {
            self.introductionSprite.active = false;
        }
        self.setCircleSize('');
    },

    setCircleSize: function (button, pos) {
        if (button == '') {
            self.circle.width = 0;
            self.circle.height = 0;
            return;
        }
        let setpos =  function (w,h,p) {
            self.circle.width = w;
            self.circle.height = h;
            self.circle.setPosition(p);
        }
        if (button.name == 'btnoCharpter') {
            setpos(button.width - 50, button.height + 10, cc.v2(pos.x - 20, pos.y));
        } else if (button.name == 'btnoEndless') { 
            setpos(button.width - 50, button.height + 10, cc.v2(pos.x + 20, pos.y));
        } else if (button.name == 'nodeTouzhi') { 
            setpos(114, 114, pos);
        } else if (self.step == 2||self.step==13||self.step ==21) { 
            setpos(button.width + 50, button.height + 50, pos);
        } else {
            setpos(button.width + 20, button.height + 20, pos);
        }
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

