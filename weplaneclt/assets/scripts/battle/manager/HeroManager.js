const Defines = require('BattleDefines');
const GlobalVar = require('globalvar');
const PlaneEntity = require('PlaneEntity');
const WingmanEntity = require('WingmanEntity');
const FriendEntity = require('FriendEntity');
const BattleManager = require('BattleManager');

const HeroManager = cc.Class({
    statics: {
        instance: null,
        getInstance: function () {
            if (HeroManager.instance == null) {
                HeroManager.instance = new HeroManager();
            }
            return HeroManager.instance;
        },
        destroyInstance() {
            if (HeroManager.instance != null) {
                delete HeroManager.instance;
                HeroManager.instance = null;
            }
        }
    },

    ctor() {
        this.planeEntity = null;
        //this.partEntity = {};
        this.wingmanEntity = [];
        this.assistEntity = [];
        this.friendEntity = null;
        this.BomberEntity = [];
        this.friendOpen = false;
        this.bomberOpen = false;
        this.showType = 0;
        this.full = false;
        this.controllable = false;
        this.prepareToEnd = false;
        this.delayLevel = 0;
    },

    start(mgr) {

    },

    release() {
        if (!this.planeEntity) {
            this.planeEntity.destroy();
            this.planeEntity = null;
        }
        for (let i = 0; i < 2; i++) {
            if (typeof this.assistEntity[i] !== 'undefined') {
                this.assistEntity[i].destroy();
            }
            if (typeof this.wingmanEntity[i] !== 'undefined') {
                this.wingmanEntity[i].destroy();
            }
        }
        this.assistEntity.splice(0, this.assistEntity.length);
        this.wingmanEntity.splice(0, this.wingmanEntity.length);
        if (!this.friendEntity) {
            this.friendEntity.destroy();
            this.friendEntity = null;
        }
        for (let j = 0; j < 3; j++) {
            if (typeof this.BomberEntity[j] !== 'undefined') {
                this.BomberEntity[j].destroy();
            }
        }
        this.BomberEntity.splice(0, this.BomberEntity.length);
    },

    createPlane(displayNode, mode, id, props, full) {
        this.showType = typeof mode !== 'undefined' ? mode : 0;
        this.full = typeof full !== 'undefined' ? full : false;
        this.member = typeof id !== 'undefined' ? id : GlobalVar.me().memberData.getStandingByFighterID();
        this.displayNode = displayNode;
        this.props = props;
        this.newHero(this.member, this.displayNode, this.props, this.full);
    },

    revive() {
        this.createPlane(this.displayNode, this.showType, this.member, this.props, this.full);
    },

    update(dt) {
        if (!this.planeEntity) {
            return;
        }

        if (BattleManager.getInstance().isDemo) {
            this.planeEntity.update(dt);
            for (let i = 0; i < 2; i++) {
                if (typeof this.assistEntity[i] !== 'undefined') {
                    this.assistEntity[i].update(dt);
                }
                if (typeof this.wingmanEntity[i] !== 'undefined') {
                    this.wingmanEntity[i].update(dt);
                }
            }
        }

        if (BattleManager.getInstance().gameState == Defines.GameResult.RUNNING) {
            this.planeEntity.update(dt);
            for (let i = 0; i < 2; i++) {
                if (typeof this.assistEntity[i] !== 'undefined') {
                    this.assistEntity[i].update(dt);
                }
                if (typeof this.wingmanEntity[i] !== 'undefined') {
                    this.wingmanEntity[i].update(dt);
                }
            }
            if (this.friendEntity != null && this.friendOpen) {
                this.friendEntity.update(dt);
            }
            if (this.bomberOpen) {
                for (let j = 0; j < 3; j++) {
                    if (typeof this.BomberEntity[j] !== 'undefined') {
                        let pos = this.BomberEntity[j].getPosition();
                        pos.y += 20;
                        this.BomberEntity[j].setPosition(pos.x, pos.y);
                        if (pos.y % 100 == 0 && j == 1) {
                            let func = require('BulletMapping').getSolution(100015);
                            if (!!func) {
                                func(this.planeEntity, [975], pos.y);
                            }
                        }
                        if (pos.y >= cc.winSize.height) {
                            this.bomberOpen = false;
                        }
                    }
                }
                if (!this.bomberOpen) {
                    for (let j = 0; j < 3; j++) {
                        this.BomberEntity[j].destroy();
                    }
                    this.BomberEntity.splice(0, this.BomberEntity.length);
                }
            }
        } else if (BattleManager.getInstance().gameState == Defines.GameResult.SUCCESS || BattleManager.getInstance().gameState == Defines.GameResult.FLYOUT ||
            BattleManager.getInstance().gameState == Defines.GameResult.COUNT || BattleManager.getInstance().gameState == Defines.GameResult.START ||
            BattleManager.getInstance().gameState == Defines.GameResult.READY || BattleManager.getInstance().gameState == Defines.GameResult.RESTART ||
            BattleManager.getInstance().gameState == Defines.GameResult.DASHSTART || BattleManager.getInstance().gameState == Defines.GameResult.DASH ||
            BattleManager.getInstance().gameState == Defines.GameResult.DASHEND || BattleManager.getInstance().gameState == Defines.GameResult.SHOW) {

            if (BattleManager.getInstance().gameState == Defines.GameResult.DASHSTART ||
                BattleManager.getInstance().gameState == Defines.GameResult.DASH ||
                BattleManager.getInstance().gameState == Defines.GameResult.DASHEND) {
                this.planeEntity.updateDashTime(dt);
            }
            for (let i = 0; i < 2; i++) {
                if (typeof this.assistEntity[i] !== 'undefined') {
                    this.assistEntity[i].chaseFighter(dt);
                }
                if (typeof this.wingmanEntity[i] !== 'undefined') {
                    this.wingmanEntity[i].chaseFighter(dt);
                }
            }

        }
    },

    newHero(member, displayNode, props) {

        if (this.planeEntity != null) {
            this.planeEntity.destroy();
            this.planeEntity = null;
        }
        for (let i = 0; i < 2; i++) {
            if (this.assistEntity[i] != null) {
                this.assistEntity[i].destroy();
                this.assistEntity[i] = null;
            }
            if (this.wingmanEntity[i] != null) {
                this.wingmanEntity[i].destroy();
                this.wingmanEntity[i] = null;
            }
        }

        this.planeEntity = new PlaneEntity();
        this.planeEntity.newPart('Fighter/Fighter_' + member, Defines.ObjectType.OBJ_HERO, 'PlaneObject', this.showType, 0, 0);
        // if (BattleManager.getInstance().isDemo == false) {
        //     if (typeof props !== 'undefined' && props != null) {
        //         this.planeEntity.setProp(member, props);
        //     }
        // }
        displayNode.addChild(this.planeEntity, Defines.Z.FIGHTER);

        if (this.full) {
            for (let index in GlobalVar.me().guazaiData.guazaiWear) {
                let wear = GlobalVar.me().guazaiData.getGuazaiBySlot(index);
                if (typeof wear === 'undefined') {
                    continue;
                }

                let guazaiProp = GlobalVar.me().propData.getPropsByGuazaiItem(wear);
                let id = wear.ItemID;
                let data = GlobalVar.tblApi.getDataBySingleKey("TblGuaZai", id);
                switch (index) {
                    case "1":
                        let wingLeft = new WingmanEntity();
                        wingLeft.newPart('Wingman/' + data.strModel, Defines.ObjectType.OBJ_WINGMAN, 'WingmanObject', this.showType, -1, 0);
                        let s1 = [data.wSkillID, data.wSkillID, data.wSkillID, data.wSkillID + 1];
                        wingLeft.setSkillIDs(s1);
                        displayNode.addChild(wingLeft, Defines.Z.WINGMAN);
                        this.wingmanEntity.push(wingLeft);

                        let wingRight = new WingmanEntity();
                        wingRight.newPart('Wingman/' + data.strModel, Defines.ObjectType.OBJ_WINGMAN, 'WingmanObject', this.showType, 1, 0);
                        let s2 = [data.wSkillID + 2, data.wSkillID + 2, data.wSkillID + 2, data.wSkillID + 3];
                        wingRight.setSkillIDs(s2);
                        displayNode.addChild(wingRight, Defines.Z.WINGMAN);
                        this.wingmanEntity.push(wingRight);

                        if (!!props) {
                            props[Defines.PropName.PetAttack] = guazaiProp[Defines.PropName.PetAttack];
                        }

                        break;
                    case "2":
                        this.planeEntity.setSuperSkill(data.wSkillID);
                        if (!!props) {
                            props[Defines.PropName.SkillAttack] = guazaiProp[Defines.PropName.SkillAttack];
                        }
                        break;
                    case "3":
                        this.planeEntity.setMissle(true, data.wSkillID);
                        if (!!props) {
                            props[Defines.PropName.MissileAttack] = guazaiProp[Defines.PropName.MissileAttack];
                        }
                        break;
                    case "4":
                        let assistLeft = new WingmanEntity();
                        assistLeft.newPart(data.strModel, Defines.ObjectType.OBJ_ASSIST, '', this.showType, -1, 1);
                        let s3 = [data.wSkillID];
                        assistLeft.setSkillIDs(s3);
                        displayNode.addChild(assistLeft, Defines.Z.ASSIST);
                        this.assistEntity.push(assistLeft);
                        assistLeft.setScale(-0.6, 0.6);

                        let assistRight = new WingmanEntity();
                        assistRight.newPart(data.strModel, Defines.ObjectType.OBJ_ASSIST, '', this.showType, 1, 1);
                        let s4 = [data.wSkillID + 1];
                        assistRight.setSkillIDs(s4);
                        displayNode.addChild(assistRight, Defines.Z.ASSIST);
                        this.assistEntity.push(assistRight);
                        assistRight.setScale(0.6, 0.6);

                        if (!!props) {
                            props[Defines.PropName.AssistAttack] = guazaiProp[Defines.PropName.AssistAttack];
                        }
                        break;
                }
            }
        }

        if (BattleManager.getInstance().isDemo == false) {
            if (typeof props !== 'undefined' && props != null) {
                this.planeEntity.setProp(member, props);
            }
        }
        //this.planeEntity.setPosition(cc.v3(sz.width / 2, 0.2 * sz.height));

        if (BattleManager.getInstance().isDemo == false) {
            this.flyIntoScreen();

            if (BattleManager.getInstance().isEndlessFlag) {
                let createFriend = false;
                if (BattleManager.getInstance().battleMsg.BattleBlessStatusID == 2) {
                    BattleManager.getInstance().damagePlus = 1.05;
                }
                if (BattleManager.getInstance().battleMsg.BattleBlessStatusID == 3) {
                    createFriend = true;
                } else {
                    for (let status of BattleManager.getInstance().battleMsg.BattleStatus) {
                        if (status.StatusID == 2) {
                            BattleManager.getInstance().damagePlus = 1.05;
                        }
                        if (status.StatusID == 3) {
                            //this.newFriend(member, displayNode, props, Defines.FRIENDDURATION, 2);
                            createFriend = true;
                        }
                    }
                }
                if (createFriend && this.friendEntity == null) {
                    this.newFriend(member, displayNode, props, Defines.FRIENDDURATION, 2);
                }
            }
        } else {
            let sz = displayNode.getContentSize();
            this.planeEntity.setPosition(cc.v3(0.5 * sz.width, 0.29 * sz.height));
            if (typeof this.assistEntity[0] !== 'undefined') {
                this.assistEntity[0].setPosition(cc.v3(0.5 * sz.width - 110, 0.34 * sz.height));
            }
            if (typeof this.wingmanEntity[0] !== 'undefined') {
                this.wingmanEntity[0].setPosition(cc.v3(0.5 * sz.width - 110, 0.19 * sz.height));
            }
            if (typeof this.assistEntity[1] !== 'undefined') {
                this.assistEntity[1].setPosition(cc.v3(0.5 * sz.width + 110, 0.34 * sz.height));
            }
            if (typeof this.wingmanEntity[1] !== 'undefined') {
                this.wingmanEntity[1].setPosition(cc.v3(0.5 * sz.width + 110, 0.19 * sz.height));
            }
        }
    },

    newFriend: function (member, displayNode, props, duration, skillLevel) {
        if (this.friendEntity != null) {
            return;
        }
        this.friendEntity = new FriendEntity();
        let assistID = GlobalVar.me().memberData.getAssistFighterID();
        if (assistID == 0) {
            assistID = member;
        }
        this.friendEntity.newPart('Fighter/Fighter_' + assistID, Defines.ObjectType.OBJ_HERO, 'PlaneObject', 0, 0, 0);

        if (typeof props !== 'undefined' && props != null) {
            this.friendEntity.setProp(member, props);
        }

        this.friendEntity.setDuration(duration);
        this.friendEntity.setSkillLevel(skillLevel);

        displayNode.addChild(this.friendEntity, Defines.Z.FIGHTER);

        if (BattleManager.getInstance().isDemo == false) {
            var self = this;
            var callback = function () {
                self.friendOpen = true;
            }
            this.friendEntity.flyIntoScreen(callback);
        }
    },

    callAssist: function () {
        this.bomberOpen = true;
        for (let i = 0; i < 3; i++) {
            if (this.planeEntity == null || !cc.isValid(this.planeEntity)) {
                break;
            }
            let bomber = new PlaneEntity();
            let assistID = GlobalVar.me().memberData.getAssistFighterID();
            if (assistID == 0) {
                let index = this.planeEntity.objectName.lastIndexOf('_');
                assistID = this.planeEntity.objectName.substring(index + 1, this.planeEntity.objectName.length);
            }
            bomber.newPart('Fighter/Fighter_' + assistID, Defines.ObjectType.OBJ_HERO, 'PlaneObject', 3, 0, 0);
            bomber.setPosition(i * 180 + 140, 0);
            BattleManager.getInstance().displayContainer.addChild(bomber, Defines.Z.BOMBER);
            this.BomberEntity.push(bomber);
        }
    },

    openShader: function (open) {
        this.planeEntity.openShader(open);
        for (let i = 0; i < 2; i++) {
            if (typeof this.assistEntity[i] !== 'undefined') {
                this.assistEntity[i].openShader(open);
            }
            if (typeof this.wingmanEntity[i] !== 'undefined') {
                this.wingmanEntity[i].openShader(open);
            }
        }
    },

    flyIntoScreen: function () {
        var self = this;
        self.controllable = false;
        var callback = function () {
            self.controllable = true;
            self.planeEntity.getPart().transform();
            if (BattleManager.getInstance().gameState == Defines.GameResult.START) {
                BattleManager.getInstance().gameState = Defines.GameResult.READY;
            } else if (BattleManager.getInstance().gameState == Defines.GameResult.RESTART) {
                BattleManager.getInstance().gameState = Defines.GameResult.RUNNING;
            }
        }
        this.planeEntity.flyIntoScreen(callback);
    },

    flyOutOffScreen: function () {
        var self = this;
        self.controllable = false;
        var callback = function () {
            BattleManager.getInstance().result = 1;
            BattleManager.getInstance().gameState = Defines.GameResult.END;
        }
        if (this.planeEntity.state == 2) {
            this.planeEntity.getPart().crazyEnd();
            if (typeof this.wingmanEntity[0] !== 'undefined') {
                this.wingmanEntity[0].getPart().crazyEnd();
            }
            if (typeof this.wingmanEntity[1] !== 'undefined') {
                this.wingmanEntity[1].getPart().crazyEnd();
            }
        }

        GlobalVar.soundManager().playEffect('cdnRes/audio/battle/effect/leave_battle');
        this.planeEntity.flyOutOffScreen(callback);
    },

    selfDestroy: function () {
        require('AIInterface').eliminateBulletByOwner(this.planeEntity, false, false);
        var self = this;
        self.controllable = false;
        var callback = function () {
            if (BattleManager.getInstance().isEndlessFlag) {
                if (Defines.REVIVECOUNTENDLESS - GlobalVar.me().campData.getBattleDieCount() > 0) {
                    BattleManager.getInstance().gameState = Defines.GameResult.DEADDELAY;
                } else {
                    BattleManager.getInstance().result = 2;
                    BattleManager.getInstance().gameState = Defines.GameResult.END;
                }
            } else {
                if (Defines.REVIVECOUNTCAMPAIGN - GlobalVar.me().campData.getBattleDieCount() > 0) {
                    BattleManager.getInstance().gameState = Defines.GameResult.DEADDELAY;
                } else {
                    BattleManager.getInstance().result = 0;
                    BattleManager.getInstance().gameState = Defines.GameResult.END;
                }
            }
        }
        this.planeEntity.selfDestroy(callback);
        for (let i = 0; i < 2; i++) {
            if (typeof this.wingmanEntity[i] !== 'undefined') {
                this.wingmanEntity[i].selfDestroy();
            }
            if (typeof this.assistEntity[i] !== 'undefined') {
                this.assistEntity[i].selfDestroy();
            }
        }
        this.wingmanEntity.splice(0, this.wingmanEntity.length);
        this.assistEntity.splice(0, this.assistEntity.length);
    },

    openDash: function (open) {
        open = typeof open !== 'undefined' ? open : false;
        if(open==-2 || !open){
            this.skillDelayLevelUp();
        }
        this.planeEntity.addDashTime(open);
    },

    skillLevelUp: function (level) {
        if (!BattleManager.getInstance().isDemo) {
            if (level == 1) {
                this.planeEntity.showGetBuffEffect(Defines.Assist.WEAPON_UP);
            } else {
                this.planeEntity.showGetBuffEffect(Defines.Assist.SUPER);
            }
        }
        if (BattleManager.getInstance().gameState == Defines.GameResult.RUNNING ||
            BattleManager.getInstance().isDemo) {
            this.planeEntity.skillLevelUp(level);
            if (typeof this.wingmanEntity[0] !== 'undefined') {
                this.wingmanEntity[0].skillLevelUp(level);
            }
            if (typeof this.wingmanEntity[1] !== 'undefined') {
                this.wingmanEntity[1].skillLevelUp(level);
            }
        }
        if (BattleManager.getInstance().gameState == Defines.GameResult.DASHSTART ||
            BattleManager.getInstance().gameState == Defines.GameResult.DASH ||
            BattleManager.getInstance().gameState == Defines.GameResult.DASHEND) {
            this.delayLevel += level;
        }
    },

    skillDelayLevelUp: function () {
        if (BattleManager.getInstance().gameState == Defines.GameResult.RUNNING ||
            BattleManager.getInstance().isDemo) {
            this.planeEntity.skillLevelUp(this.delayLevel);
            if (typeof this.wingmanEntity[0] !== 'undefined') {
                this.wingmanEntity[0].skillLevelUp(this.delayLevel);
            }
            if (typeof this.wingmanEntity[1] !== 'undefined') {
                this.wingmanEntity[1].skillLevelUp(this.delayLevel);
            }
            this.delayLevel = 0;
        }
    },

    skillLevelDown: function (level) {
        this.planeEntity.skillLevelDown(level);
        if (typeof this.wingmanEntity[0] !== 'undefined') {
            this.wingmanEntity[0].skillLevelDown(level);
        }
        if (typeof this.wingmanEntity[1] !== 'undefined') {
            this.wingmanEntity[1].skillLevelDown(level);
        }
    },

    pauseEntity() {
        if (this.planeEntity != null) {
            this.planeEntity.pauseAction();
        }
        for (let i = 0; i < 2; i++) {
            if (typeof this.wingmanEntity[i] !== 'undefined') {
                this.wingmanEntity[i].pauseAction();
            }
        }
        if (!!this.friendEntity) {
            this.friendEntity.pauseAction();
        }
    },

    resumeEntity() {
        if (this.planeEntity != null) {
            this.planeEntity.resumeAction();
        }
        for (let i = 0; i < 2; i++) {
            if (typeof this.wingmanEntity[i] !== 'undefined') {
                this.wingmanEntity[i].resumeAction();
            }
        }
        if (!!this.friendEntity) {
            this.friendEntity.resumeAction();
        }
    },

    onTouchBegan: function (event) {
        // this.planeEntity.setPosition(this.planeEntity.getPosition() + event.getDelta());
    },

    onTouchMoved: function (event) {

        //var touch = event.touch;

        if (!this.controllable) {
            return;
        }

        if (BattleManager.getInstance().gameState != Defines.GameResult.RUNNING &&
            BattleManager.getInstance().gameState != Defines.GameResult.DASHSTART &&
            BattleManager.getInstance().gameState != Defines.GameResult.DASH &&
            BattleManager.getInstance().gameState != Defines.GameResult.DASHEND) {
            return;
        }

        let pos = this.planeEntity.getPosition();
        pos.x = pos.x + event.getDelta().x;
        pos.y = pos.y + event.getDelta().y;

        pos.y = Math.min(Math.max(pos.y, 5), cc.winSize.height - 5);
        pos.x = Math.min(Math.max(pos.x, 5), cc.winSize.width - 5);

        let v = pos.sub(this.planeEntity.getPosition())

        this.planeEntity.setPosition(pos);

    },

    onTouchEnd: function (event) {
        // this.planeEntity.setPosition(this.planeEntity.getPosition() + event.getDelta());
    },

    onTouchCancel: function (event) {
        // this.planeEntity.setPosition(this.planeEntity.getPosition() + event.getDelta());
    },
});

module.exports = HeroManager;