const UIBase = require("uibase");
const GlobalVar = require("globalvar");
const SceneDefines = require("scenedefines");
const BulletMapping = require('BulletMapping');
const MM = require('MonsterMapping');

var UIBattleEditor = cc.Class({
    extends: UIBase,

    onLoad:function() {
        this.initView();
    },

    initView:function () {
        this.edtSolution = this.getEditBoxByName('Solution_ID');
        this.edtTime = this.getEditBoxByName('Time_ID');
        this.lblButton = this.getLabelByName('Label_T');
        this.edtBulletIds = this.getEditBoxByName('Bullet_ID');
        this.edtMIds = this.getEditBoxByName('MSolution_ID');
        this.edtPos = this.getEditBoxByName('Pos');
        this.edtSkill = this.getEditBoxByName('Skills');
    },

    onPauseClick:function() {
        GlobalVar.sceneManager().gotoScene(SceneDefines.MAIN_STATE);
    },

    onSolutionClick: function() {
        let val = this.edtSolution.string;
        let func = BulletMapping.getSolution(val);
        let str = this.edtBulletIds.string;
        if (str == '') {
            str = '1';
        }
        let arrBlts = str.split('|');
        func(require('HeroManager').getInstance().planeEntity, arrBlts, 1);
    },

    onTimeClick: function() {
        if (this.lblButton.string == '开启') {
            this.lblButton.string = '关闭';

            this.node.runAction(cc.repeatForever(cc.sequence(cc.delayTime(Number(this.edtTime.string)), cc.callFunc(this.onBulletCallback.bind(this)))));
        } else {
            this.lblButton.string = '开启';
            this.node.stopAllActions();
        }

    },

    onBulletCallback: function() {
        this.onSolutionClick();
    },

    monsterClick: function() {
        let mid = this.edtMIds.string;
        let pos = this.edtPos.string;
        let skill = this.edtSkill.string;

        let func = MM.getSolution(Number(mid));
        if (func) {
            let v = pos.split(',');
            let s = skill.split('|');
            let ss = [];
            for (let i of s) {
                ss.push(Number(i));
            }
            let info = {};
            info.mId = 19;
            info.lv = 10;
            info.pos = cc.v3(Number(v[0]), Number(v[1]));
            info.uId = 1;

            func(info, info.pos, ss);
        }
    },
 
    testbuff:function(){
        
        // this.solution = require('BulletSolutions');
        // this.solution.solution_crystal(5, cc.v3(320,640));
    }
});