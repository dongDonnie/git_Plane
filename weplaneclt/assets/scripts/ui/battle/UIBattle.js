const Defines = require('BattleDefines');
const UIBase = require("uibase");
const EventMsgID = require("eventmsgid");
const BattleManager = require('BattleManager');
const GlobalFunc = require('GlobalFunctions');
const GlobalVar = require("globalvar");
const config = require('config');
const Guide = require('Guide');
const weChatAPI = require("weChatAPI");
const StoreageData = require("storagedata");
const i18n = require('LanguageData');
const base64 = require("base64");

var UIBattle = cc.Class({
    extends: UIBase,

    ctor: function () {
        this.heroManager = require('HeroManager').getInstance();
        this.battleManager = require('BattleManager').getInstance();

        this.mainUI = null;
        this.playerHp = null;

        this.currentCD = 5;
        this.timeCD = 5;

        this.assistCurrentCD = 120;
        this.assistTimeCD = 120;

        this.curScore = 0;
        this.plusScore = 0;
        this.startScore = 0;
        this.targetScore = 0;

        this.bossHpBind = null;
        this.hpBarSingleMax = 10000000;
        this.hpBarMax = this.hpBarSingleMax;
        this.hpBarNow = 0;
        this.hpBarNum = 0;
        this.theLastHp = 0;
        this.curHp = 0;
        this.bossHpRecord = 0;

        this.scoreShowMode = 0;

        this.skillBtnShow = false;
        this.assistBtnShow = false;
        this.assistBtnStatus = 0;
        this.assistBtnStatusCount = 0;

        this.comboKill = 0;

        this.beyoudUpdateTimes = 0;
        this.isFirtTimeGetBeyoundData = true;
        this.texture2D = new cc.Texture2D();
    },

    properties: {
        nodeTop: {
            default: [],
            type: cc.Node
        },
        barHp: {
            default: [],
            type: cc.ProgressBar
        },
        barBossHp: {
            default: null,
            type: cc.ProgressBar
        },
        barSkillCD: {
            default: null,
            type: cc.ProgressBar
        },
        barAssistCD: {
            default: null,
            type: cc.ProgressBar
        },
        btnoAssist: {
            default: null,
            type: cc.Node
        },
        nodeBeyoundFriend: {
            default: null,
            type: cc.Node,
        },
    },

    onLoad: function () {
        this.initView();

        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_ENDLESS_USESTATUS_NTF, this._onAssistClick, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_ASSIST_SHARE_SUCCESS, this._onGetAssistSuccess, this);

        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            let openDataContext = wx.getOpenDataContext();
            let sharedCanvas = openDataContext.canvas;
            sharedCanvas.width = 120;
            sharedCanvas.height = 140;
        }
    },

    start() {
        setTimeout(function () {
            Guide.getInstance().enterBattle();
        }, 600);
    },

    update(dt) {
        if (config.NEED_GUIDE) {
            Guide.getInstance().update(dt);
        }
        if (this.battleManager.gameState != Defines.GameResult.RUNNING &&
            this.battleManager.gameState != Defines.GameResult.DASHSTART &&
            this.battleManager.gameState != Defines.GameResult.DASH &&
            this.battleManager.gameState != Defines.GameResult.DASHEND) {
            return;
        }
        this.updateSkillCD();
        this.updateAssistCD();
        this.updateScore();
        this.updatePlayerHp();
        this.updateBossHpBar();
        this.updateCombo();
        this.updateChestCount();

        this.updateBeyoundNode();
    },

    onDestroy() {
        GlobalVar.eventManager().removeListenerWithTarget(this);
    },

    initView: function () {
        if (this.battleManager.isEndlessFlag) {
            this.nodeTop[0].active = true;
            this.nodeTop[1].active = false;
            this.mainUI = this.nodeTop[0];
            this.playerHp = this.barHp[0];
            let score = GlobalVar.me().endlessData.getWeekMaxScore();
            this.setTopScore(typeof score !== 'undefined' ? score : 0);
        } else {
            this.nodeTop[0].active = false;
            this.nodeTop[1].active = true;
            this.mainUI = this.nodeTop[1];
            this.playerHp = this.barHp[1];
        }
        if (GlobalFunc.isAllScreen()) {
            let topWidget0 = this.nodeTop[0].getComponent(cc.Widget);
            topWidget0.top = 70;
            topWidget0.updateAlignment();
            let topWidget1 = this.nodeTop[1].getComponent(cc.Widget);
            topWidget1.top = 70;
            topWidget1.updateAlignment();
            let barWidget = this.node.getChildByName("spriteBossBarBg").getComponent(cc.Widget);
            barWidget.top += 50;
            barWidget.updateAlignment();
        } else {
            let topWidget = this.node.getChildByName("spriteTop").getComponent(cc.Widget);
            topWidget.top = -this.node.getChildByName("spriteTop").height;
            topWidget.updateAlignment();
        }

        if (typeof GlobalVar.me().guazaiData.getGuazaiBySlot(2) !== 'undefined' && !this.battleManager.isArenaFlag) {
            this.barSkillCD.node.active = true;
            this.skillBtnShow = true;
        } else {
            this.barSkillCD.node.active = false;
            this.skillBtnShow = false;
        }


        if (BattleManager.getInstance().isEndlessFlag) {
            let hasAssist = false;
            if (BattleManager.getInstance().battleMsg.BagBlessStatusID == 4) {
                hasAssist = true;
                this.assistBtnStatus = 4;
                this.assistBtnStatusCount++;
            }
            let numberBg = this.barAssistCD.node.getChildByName('numberBg');
            numberBg.active = false;
            for (let status of BattleManager.getInstance().battleMsg.BagStatus) {
                if (status.StatusID == 4) {
                    hasAssist = true;
                    this.assistBtnStatus = 4;
                    this.assistBtnStatusCount = status.StatusCount;
                    let labelcount = numberBg.getChildByName('labelCount').getComponent(cc.Label);
                    labelcount.string = this.assistBtnStatusCount;
                    // labelcount.node.active = !!this.assistBtnStatusCount;
                    numberBg.active = !!this.assistBtnStatusCount;
                    // setTimeout(() => {
                    //     numberBg.width = labelcount.node.width + 3;
                    // }, 30);
                    break;
                }
            }
            this.barAssistCD.node.active = true;
            this.assistBtnShow = true;
            // if (hasAssist && this.assistBtnStatus>0) {
            //     this.barAssistCD.node.active = true;
            //     this.assistBtnShow = true;
            // } else {
            //     this.barAssistCD.node.active = false;
            //     this.assistBtnShow = false;
            // }
        }

        this.showBossHpBar();
    },

    moveSkillBtn: function () {
        if (this.barSkillCD.node.active && this.skillBtnShow) {
            this.skillBtnShow = false;
            this.barSkillCD.node.runAction(cc.moveBy(0.1, cc.v3(125, 0)));
        }
    },

    moveAssistBtn: function () {
        if (this.barAssistCD.node.active && this.assistBtnShow) {
            this.assistBtnShow = false;
            this.barAssistCD.node.runAction(cc.moveBy(0.1, cc.v3(125, 0)));
        }
    },

    setTopScore: function (num) {
        num = typeof num !== 'undefined' ? num : 0;
        if (num > 999999) {
            num = parseInt(num / 10000) + ";<";
        }
        this.getNodeByName("labelTopScoreNum").getComponent(cc.Label).string = num;
    },

    updateScore: function () {
        if (this.battleManager.isEndlessFlag) {
            let score = Number(base64.decode(this.battleManager.endlessScore));
            if (score != this.targetScore && this.plusScore == 0) {
                if (this.scoreShowMode == 1) {
                    this.targetScore = Math.floor(score / 10000);
                } else {
                    this.targetScore = score;
                }
                if (score >= 1000000 && this.scoreShowMode == 0) {
                    this.startScore = this.targetScore = this.curScore = Math.floor(score / 10000);
                    this.mainUI.getChildByName("labelScore").getComponent(cc.Label).string = this.curScore + ';<';
                    this.scoreShowMode = 1;
                }
            }

            if (this.startScore != this.targetScore) {
                this.plusScore = Math.ceil((this.targetScore - this.startScore) / (1 / Defines.BATTLE_FRAME_SECOND));
                if (this.targetScore - this.startScore <= Math.ceil((this.targetScore) / 100)) {
                    this.plusScore = this.targetScore - this.startScore;
                }
                this.startScore = this.targetScore;
            }

            if (this.plusScore != 0) {
                this.curScore += this.plusScore;
                if (this.curScore >= this.targetScore) {
                    this.curScore = this.targetScore;
                    this.plusScore = 0;
                }
                if (this.scoreShowMode == 1) {
                    this.mainUI.getChildByName("labelScore").getComponent(cc.Label).string = this.curScore + ';<';
                } else {
                    this.mainUI.getChildByName("labelScore").getComponent(cc.Label).string = this.curScore;
                }
            }
        }
    },

    updatePlayerHp: function () {
        if (this.playerHp && this.heroManager.planeEntity) {
            if (this.heroManager.planeEntity.maxHp != 0) {
                this.playerHp.getComponent(cc.ProgressBar).progress = this.heroManager.planeEntity.hp / this.heroManager.planeEntity.maxHp;
            } else {
                this.playerHp.getComponent(cc.ProgressBar).progress = 1;
            }
        }
    },

    updateSkillCD: function () {
        if (this.barSkillCD.progress != 0) {
            this.currentCD -= Defines.BATTLE_FRAME_SECOND;
            let percent = this.currentCD / this.timeCD;
            this.barSkillCD.progress = percent > 0 ? percent : 0;
        }
    },

    updateAssistCD: function () {
        if (this.barAssistCD.progress != 0) {
            this.assistCurrentCD -= Defines.BATTLE_FRAME_SECOND;
            let percent = this.assistCurrentCD / this.assistTimeCD;
            this.barAssistCD.progress = percent > 0 ? percent : 0;
        }
    },

    updateCombo: function () {
        let combo = this.getNodeByName("spriteCombo");
        if (this.battleManager.comboKill > 0) {
            combo.active = true;
            if (this.comboKill != this.battleManager.comboKill) {
                let combo_1 = combo.getChildByName('labelCombo0');
                let combo_2 = combo.getChildByName('labelCombo1');
                let combo_3 = combo.getChildByName('labelCombo2');
                if (this.battleManager.comboKill < 10) {
                    combo_1.active = true;
                    combo_2.active = false;
                    combo_3.active = false;
                    if (combo_1.getComponent(cc.Label).string != this.battleManager.comboKill) {
                        combo_1.getComponent(cc.Label).string = this.battleManager.comboKill;
                        combo_1.getComponent(cc.Animation).play();
                    }
                } else if (this.battleManager.comboKill >= 10 && this.battleManager.comboKill < 100) {
                    combo_1.active = true;
                    combo_2.active = true;
                    combo_3.active = false;
                    if (combo_1.getComponent(cc.Label).string != Math.floor(this.battleManager.comboKill / 10)) {
                        combo_1.getComponent(cc.Label).string = Math.floor(this.battleManager.comboKill / 10);
                        combo_1.getComponent(cc.Animation).play();
                    }
                    if (combo_2.getComponent(cc.Label).string != Math.floor(this.battleManager.comboKill % 10)) {
                        combo_2.getComponent(cc.Label).string = Math.floor(this.battleManager.comboKill % 10)
                        combo_2.getComponent(cc.Animation).play();
                    }
                } else if (this.battleManager.comboKill >= 100 && this.battleManager.comboKill < 1000) {
                    combo_1.active = true;
                    combo_2.active = true;
                    combo_3.active = true;
                    if (combo_1.getComponent(cc.Label).string != Math.floor(this.battleManager.comboKill / 100)) {
                        combo_1.getComponent(cc.Label).string = Math.floor(this.battleManager.comboKill / 100);
                        combo_1.getComponent(cc.Animation).play();
                    }
                    if (combo_2.getComponent(cc.Label).string != Math.floor(this.battleManager.comboKill / 10 % 10)) {
                        combo_2.getComponent(cc.Label).string = Math.floor(this.battleManager.comboKill / 10 % 10);
                        combo_2.getComponent(cc.Animation).play();
                    }
                    if (combo_3.getComponent(cc.Label).string != Math.floor(this.battleManager.comboKill % 10)) {
                        combo_3.getComponent(cc.Label).string = Math.floor(this.battleManager.comboKill % 10);
                        combo_3.getComponent(cc.Animation).play();
                    }
                }
                this.comboKill = this.battleManager.comboKill;
            }
        } else {
            this.comboKill = 0;
            combo.active = false;
        }
    },

    updateChestCount: function () {
        this.getNodeByName("labelChestCount").getComponent(cc.Label).string = BattleManager.getInstance().endlessGetChsetCount;
    },

    showBossHpBar: function (show) {
        show = typeof show !== 'undefined' ? show : false;
        this.getNodeByName("spriteBossBarBg").active = show;
    },
    setBossHpBar: function (entity) {
        if (typeof entity !== 'undefined') {
            this.bossHpBind = entity;
            if (this.bossHpBind != null) {
                this.showBossHpBar(true);
                this.setBossHpBarProgress();
            } else {
                this.showBossHpBar(false);
            }
        }
    },
    setBossHpBarProgress: function () {
        if (this.bossHpBind != null) {
            this.getNodeByName("labelBossLevel").getComponent(cc.Label).string = "Lv." + this.bossHpBind.lv;
            this.getNodeByName("labelBossName").getComponent(cc.Label).string = this.bossHpBind.tbl.strMonsterName != "" ? this.bossHpBind.tbl.strMonsterName : this.bossHpBind.tbl.strName;

            if (this.bossHpBind.tbl.byMultiBlood != 0) {
                this.hpBarSingleMax = Math.ceil(this.bossHpBind.maxHp / this.bossHpBind.tbl.byMultiBlood);
            } else {
                this.hpBarSingleMax = this.bossHpBind.maxHp;
            }

            let count = this.bossHpBind.tbl.byMultiBlood != 0 ? this.bossHpBind.tbl.byMultiBlood : Math.round(this.bossHpBind.maxHp / this.hpBarSingleMax);
            this.theLastHp = this.bossHpBind.maxHp - Math.floor(count - 1) * this.hpBarSingleMax;
            this.hpBarNum = Math.ceil(count);
            this.getNodeByName("labelBossHpData").getComponent(cc.Label).string = this.hpBarNum;
            if (this.hpBarNum > 1) {
                this.hpBarMax = this.hpBarSingleMax;
                let barBg = this.barBossHp.node.getChildByName('barBg');
                barBg.active = true;
                barBg.getComponent("RemoteSprite").setFrame((this.hpBarNum - 2) % 6);
            } else {
                this.hpBarMax = this.theLastHp;
            }
            this.barBossHp.node.getChildByName('bar').getComponent("RemoteSprite").setFrame((this.hpBarNum - 1) % 6);

            this.hpBarNow = this.hpBarMax;
            this.curHp = this.hpBarMax;
            this.bossHpRecord = this.bossHpBind.hp;
        }
    },
    updateBossHpBar: function () {
        if (this.bossHpBind != null) {
            let minus = this.bossHpRecord - this.bossHpBind.hp;
            this.curHp -= minus;
            this.bossHpRecord = this.bossHpBind.hp;

            let lostHp = this.bossHpBind.maxHp - this.bossHpBind.hp;
            this.hpBarNow = this.hpBarMax - (lostHp / this.hpBarSingleMax - Math.floor(lostHp / this.hpBarSingleMax)) * this.hpBarSingleMax;
            this.hpBarNow = this.hpBarNow > 0 ? this.hpBarNow : 0;

            this.barBossHp.getComponent(cc.ProgressBar).progress = this.hpBarNow / this.hpBarMax;

            if (this.curHp <= 0) {
                this.hpBarNum--;
                this.hpBarNum = this.hpBarNum >= 0 ? this.hpBarNum : 0;
                this.getNodeByName("labelBossHpData").getComponent(cc.Label).string = this.hpBarNum;
                if (this.hpBarNum > 1) {
                    this.hpBarMax = this.hpBarSingleMax;
                    let barBg = this.barBossHp.node.getChildByName('barBg');
                    barBg.getComponent("RemoteSprite").setFrame((this.hpBarNum - 2) % 6);
                } else {
                    this.barBossHp.node.getChildByName('barBg').active = false;
                    this.hpBarMax = this.theLastHp;
                }
                this.barBossHp.node.getChildByName('bar').getComponent("RemoteSprite").setFrame((this.hpBarNum - 1) % 6);
                this.curHp = this.hpBarMax;
            }

            if (this.bossHpBind.hp == 0) {
                this.setBossHpBar(null);
            }
        }
    },

    onPauseClick: function () {
        if (this.battleManager.gameState == Defines.GameResult.RUNNING ||
            this.battleManager.gameState == Defines.GameResult.DASH ||
            this.battleManager.gameState == Defines.GameResult.DASHSTART ||
            this.battleManager.gameState == Defines.GameResult.DASHEND) {
            this.battleManager.gameState = Defines.GameResult.INTERRUPT;
        }
    },

    onSkillClick() {
        if (this.battleManager.gameState == Defines.GameResult.RUNNING && !this.battleManager.bossAppear) {
            if (this.barSkillCD.progress == 0) {
                let cd = require('AIInterface').useSuperSkill();
                if (cd != -1) {
                    this.currentCD = cd;
                    this.timeCD = cd;
                    this.barSkillCD.progress = 1;
                }
            }
        }
    },

    onAssistClick() {
        if (this.battleManager.gameState == Defines.GameResult.RUNNING && !this.battleManager.bossAppear) {
            if (this.barAssistCD.progress != 0) {
                return;
            }
            this.btnoAssist.getChildByName('dangerous').active = false;
            if (this.assistBtnStatusCount > 0 && this.assistBtnStatus > 0) {
                GlobalVar.handlerManager().endlessHandler.sendEndlessUseStatusReq(this.assistBtnStatus)
            } else if (this.assistBtnStatusCount == 0 && GlobalVar.getShareSwitch() && GlobalVar.getShareControl() == 1) {
                if (StoreageData.getBattleAssitTimes() >= 5) {
                    GlobalVar.comMsg.showMsg(i18n.t('label.4000313'));
                    return;
                }

                if (this.battleManager.gameState == Defines.GameResult.RUNNING ||
                    this.battleManager.gameState == Defines.GameResult.DASH ||
                    this.battleManager.gameState == Defines.GameResult.DASHSTART ||
                    this.battleManager.gameState == Defines.GameResult.DASHEND) {
                    this.battleManager.gameState = Defines.GameResult.GETASSIST;
                }
            }
        }
    },

    _onAssistClick(data) {
        if (data.ErrCode == 0) {
            if (data.OK.BagStatus.StatusID == 4) {
                this.assistBtnStatusCount = data.OK.BagStatus.StatusCount;
                let numberBg = this.barAssistCD.node.getChildByName('numberBg');
                let labelcount = numberBg.getChildByName('labelCount').getComponent(cc.Label);
                labelcount.string = this.assistBtnStatusCount;
                // labelcount.node.active = !!this.assistBtnStatusCount;
                numberBg.active = !!this.assistBtnStatusCount;
                // setTimeout(() => {
                //     numberBg.width = labelcount.node.width + 3;
                // }, 30);
                this.heroManager.callAssist();
                this.assistCurrentCD = Defines.ASSISTCD;
                this.assistTimeCD = Defines.ASSISTCD;
                this.barAssistCD.progress = 1;
            }
        }
    },

    _onGetAssistSuccess(event) {
        this.heroManager.callAssist();
        this.assistCurrentCD = Defines.ASSISTCD;
        this.assistTimeCD = Defines.ASSISTCD;
        this.barAssistCD.progress = 1;
        StoreageData.setBattleAssitTimes();
    },

    updateBeyoundNode() {
        if (cc.sys.platform != cc.sys.WECHAT_GAME) {
            return;
        }

        if (!this.battleManager.isEndlessFlag) {
            return;
        }

        if (this.battleManager.gameState != Defines.GameResult.RUNNING) {
            return;
        }

        let openDataContext = wx.getOpenDataContext();
        let sharedCanvas = openDataContext.canvas;
        let self = this;
        if (this.beyoudUpdateTimes == 0) {
            weChatAPI.requestBeyoudRank(Number(base64.decode(this.battleManager.endlessScore)), this.isFirtTimeGetBeyoundData);
            this.isFirtTimeGetBeyoundData = false;
        } else if (this.beyoudUpdateTimes == 100) {
            this.beyoudUpdateTimes = -1;
            // this.nodeBeyoundFriend.getComponent(cc.Sprite).spriteFrame = "";
            // sharedCanvas.width = 120;
            // sharedCanvas.height = 104;
        } else if (this.beyoudUpdateTimes <= 50) {
            if ((this.beyoudUpdateTimes % 10 == 0) && this.beyoudUpdateTimes > 10) {
                this.texture2D.initWithElement(sharedCanvas);
                this.texture2D.handleLoadedTexture();
                let sf = new cc.SpriteFrame(this.texture2D);
                this.nodeBeyoundFriend.getComponent(cc.Sprite).spriteFrame = sf;
            }
            if (this.nodeBeyoundFriend.x < -260) {
                this.nodeBeyoundFriend.x += 2.4;
            }
            // this.nodeBeyoundFriend.x += 2.4;
        } else if (this.beyoudUpdateTimes >= 150) {
            // this.nodeBeyoundFriend.x -= 2.4;
        }
        this.beyoudUpdateTimes++;
    },
});