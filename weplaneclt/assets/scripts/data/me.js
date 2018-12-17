var self = null;
const GlobalVar = require('globalvar')
const EventMsgID = require("eventmsgid");

var Me = cc.Class({

    statics: {
        instance: null,
        getInstance: function () {
            if (Me.instance == null) {
                Me.instance = new Me();
            }
            return Me.instance;
        },destroyInstance: function() {
            if (Me.instance != null) {
                delete Me.instance;
                Me.instance = null;
            }
        }
    },

    ctor: function () {
        self = this;
        self._datas = {};
        self._initDatas();
        GlobalVar.gameTimer().startTimer(function () {
            self.updateServerTime();
        }, 1);

        self._registerEvent();
    },

    clearData: function (){
        for(let i in self._datas){
            self._datas[i] = null;
        }
        self._datas = {};
        self.loginData = null;
        self.userData = null;
        self.storeData = null;
        self.bagData = null;
        self.memberData = null;
        self.guazaiData = null;
        self.propData = null;
        self.limitStoreData = null;
        self.drawData = null;
        self.mailData = null;
        self.noticeData = null;
        self.endlessData = null;
        self.leaderData = null;
        self.spData = null;
        self.rechargeData = null;
        self.feedbackData = null;
        self.campData = null;
        self.dailyData = null;
        self.activeData = null;

        self.level = null;
        self.roleID = null;
        self.roleName = null;
        self.exp = null;
        self.gold = null;
        self.diamond = null;
        self.diamondCz = null;
        self.voucher = null;
        self.endlessRankID = null;
        self.vipExp = null;
        self.vipLevel = null;
        self.creatTime = null;
        self.avatar = null;
        self.combatPoint = null;
        self.icon = null;
        self.statFlags = null;
        self.oldLastChapterID = null;
        self.defaultCurChapterID = null;
        self.isKickedOut = false;
    },

    _createData: function (dataClass) {
        var __class = require(dataClass);
        var data = new __class;
        self._datas[dataClass] = data;
        return data;
    },

    _registerEvent: function(){
        
    },

    _initDatas: function () {
        self.loginData = self._createData("logindata");
        self.userData = self._createData("userdata");
        self.storeData = self._createData("StoreData");
        self.bagData = self._createData("bagdata");
        self.memberData = self._createData("memberData");
        self.guazaiData = self._createData("GuazaiData");
        self.propData = self._createData("PropData");
        self.limitStoreData = self._createData("LimitStoreData");
        self.drawData = self._createData("DrawData");
        self.mailData = self._createData("MailData");
        self.noticeData = self._createData("NoticeData");
        self.endlessData = self._createData("EndlessData");
        self.leaderData = self._createData("LeaderData");
        self.spData = self._createData("SpData");
        self.rechargeData = self._createData("RechargeData");
        self.feedbackData = self._createData("FeedbackData");
        self.campData = self._createData("CampData");
        self.dailyData = self._createData("DailyData");
        self.activeData = self._createData("ActiveData");
        self.mainData = self._createData("MainData");
        self.shareData = self._createData("ShareData");
    },

    setMyselfData: function (playerData) {
        self.level = playerData.Level;
        self.roleID = playerData.RoleID;
        self.roleName = playerData.RoleName;
        self.exp = playerData.Exp;
        self.gold = playerData.Gold;
        self.diamond = playerData.Diamond;
        self.diamondCz = playerData.DiamondCZ;
        self.endlessRankID = playerData.EndlessRankID;
        self.vipExp = playerData.VIPExp;
        self.vipLevel = playerData.VIPLevel;
        self.creatTime = playerData.CreatTime;
        if (playerData.Avatar != ""){
            self.loginData.setLoginReqDataAvatar(playerData.Avatar);
        }
        self.avatar = playerData.Avatar;
        self.combatPoint = playerData.CombatPoint;
        self.icon = playerData.Icon;
        self.statFlags = playerData.StatFlags;
        self.oldLastChapterID = null;
        self.defaultCurChapterID = null;
        self.isKickedOut = false;
    },

    getGold: function () {
        return self.gold;
    },
    setGold: function (gold) {
        self.gold = gold;
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GOLD_NTF);
        self.guazaiData.updateHotPoint();
        self.leaderData.updateHotPoint();
    },
    getVoucher: function () {
        return self.voucher;
    },
    setVoucher: function (voucher) {
        self.voucher = voucher;
        // GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_DIAMOND_NTF);
    },
    getDiamond: function () {
        return self.diamond;
    },
    setDiamond: function (diamond) {
        self.diamond = diamond;
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_DIAMOND_NTF);
    },
    getSpData: function () {
        return self.spData.getData();
    },
    setCombatPoint: function (combatPoint) {
        let combatUpflag = combatPoint > self.combatPoint;
        let data = {
            combatUpflag: combatUpflag,
            delta: combatPoint - self.combatPoint,
            combatPoint: combatPoint,
            lastCombatPoint: self.combatPoint
        }
        self.combatPoint = combatPoint;
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_COMBATPOINT_CHANGE_NTF, data);
    },
    getCombatPoint: function () {
        return self.combatPoint;
    },
    getRoleName: function () {
        return self.roleName;
    },
    setLevelUpData: function (levelUpData) {
        self.setGold(levelUpData.GoldCur);
        self.level = levelUpData.LevelCur;
        self.spData.data.Sp = levelUpData.SpCur;
        
        GlobalVar.me().guazaiData.updateHotPoint();
        GlobalVar.me().leaderData.updateHotPoint();
        GlobalVar.me().memberData.updateHotPoint();

        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_SPCHANGE_NTF);
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_LEVELUP_NTF, levelUpData);

        this.levelUpData = levelUpData;
        this.levelUpFlag = true;
    },
    getLevelUpData: function () {
        if (this.levelUpFlag && this.levelUpData) {
            this.setLevelUpData(this.levelUpData);
        }
        // this.levelUpFlag = false;
        // this.levelUpData = null;
    },
    setLevelUpFlag: function () {
        this.levelUpFlag = false;
        this.levelUpData = null;
    },
    getLevel: function () {
        return self.level;
    },
    setExpChange: function (exp) {
        self.exp = exp;
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_EXPCHANGE_NTF);
    },
    getExp: function () {
        return self.exp;
    },
    getVipLevel: function () {
        return self.vipLevel;
    },

    updatePlayerDataByGMDT_PLAYER: function (playerData) {
        self.setMyselfData(playerData);

        self.spData.setData(playerData.SpBag);
        self.bagData.setData(playerData.ItemBag);
        self.memberData.setMemberData(playerData.MemberBag.Members);
        self.memberData.setStandingByData(playerData.ChuZhanBag);
        self.guazaiData.setData(playerData.GuaZaiBag);
        self.leaderData.setData(playerData.Leader);
        self.dailyData.setNewTaskData(playerData.NewTaskBag);
        self.shareData.setData(playerData.ShareBag);

        self.propData.setData(playerData.PropBag); //这个放在最后调用
    },

    updatePlayerSp: function (curSp) {
        self.spData.data.Sp = curSp;
        //通知体力改变
        let data = {
            ErrCode: 0,
        };
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_SPCHANGE_NTF);
    },

    updateServerTime: function () {
        self.serverTime++;
    },

    setServerTime: function (t) {
        self.serverTime = t;
    }
});

module.exports = Me;
