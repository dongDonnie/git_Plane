const UIBase = require("uibase");
const WndTypeDefine = require("wndtypedefine");
const GlobalVar = require("globalvar");
const CommonDefine = require("define");
const SceneDefines = require("scenedefines");
const BattleManager = require('BattleManager');
const EventMsgID = require("eventmsgid");
const ResMapping = require('resmapping');
const CommonWnd = require("CommonWnd");
const GameServerProto = require("GameServerProto");
const WindowManager = require("windowmgr");
const i18n = require('LanguageData');
const weChatAPI = require("weChatAPI");
const GlobalFunc = require('GlobalFunctions');
const config = require("config");

var UIMain = cc.Class({
    extends: UIBase,

    properties: {
        edbxGMCMD: {
            default: null,
            type: cc.EditBox
        },
    },

    onLoad: function () {
        i18n.init('zh');
        this.initUIMain();
        this.registerEvent();
        this.checkFlagSetHotPoint();
        this.getVoucher();
        this.updateExpBar();
        this.judgeLevelUp();
        this.setMode();

        if (!GlobalFunc.isAllScreen() && !this.fixViewComplete) {
            this.fixViewComplete = true;
            this.fixView();
        }
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            this.checkInvite();
            this.reportMaterialClick();
            weChatAPI.getShareConfig();
            weChatAPI.setWithShareTicket(true);
            weChatAPI.getMaterials(function (data) {
                console.log("Materials:", data);   
            });
            
            if (GlobalVar.me().loginData.getLoginReqDataServerID()) {
                weChatAPI.reportServerLogin(GlobalVar.me().loginData.getLoginReqDataAccount(), GlobalVar.me().loginData.getLoginReqDataServerID(), GlobalVar.me().serverTime * 100);
            }
        }

        if (!GlobalVar.srcSwitch()){
            let nodeFeed = this.getNodeByName("btnoRecharge");
            nodeFeed.active = true;
            let nodefirst = this.getNodeByName("btnoFirstCharge");
            nodefirst.active = true;
        }
    },

    fixView: function () {
        let bottomWidget = this.node.getChildByName("nodeBottom").getComponent(cc.Widget);
        bottomWidget.bottom = -0.5 * this.getNodeByName("spriteBottom").getContentSize().height;
        bottomWidget.updateAlignment();

        let topWidget = this.node.getChildByName("imgTopBg").getComponent(cc.Widget);
        topWidget.top = -1 * this.getNodeByName("spriteTop").getContentSize().height;
        topWidget.updateAlignment();

        this.getNodeByName("planeNode").getComponent(cc.Widget).updateAlignment();

        let planetWidget=this.getNodeByName('imgPlanet').getComponent(cc.Widget);
        planetWidget.top=250;
        planetWidget.updateAlignment();
    },

    start: function () {
        BattleManager.getInstance().quitOutSide();
        BattleManager.getInstance().startOutside(this.getNodeByName("planeNode"),GlobalVar.me().memberData.getStandingByFighterID(),true);
        require('Guide').getInstance().enter();
        this.showNotice();

        
        GlobalVar.handlerManager().campHandler.sendGetCampBagReq(GameServerProto.PT_CAMPTYPE_MAIN);

    },

    update:function(dt){
        
    },

    registerEvent: function () {
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GOLD_NTF, this.updateGold, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_DIAMOND_NTF, this.updateDiamond, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_SPCHANGE_NTF, this.updateSp, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_COMBATPOINT_CHANGE_NTF, this.updateCombatPoint, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_LEVELUP_NTF, this.showPlayerLevelUpWnd, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_NEWTASK_REWARD, this.setNewTaskDesc, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_LOGIN_DATA_NTF, this.onLoginDataEvent, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GETDAILY_DATA, this.dailyMsgRecv, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GETACTIVE_LIST, this.activeMsgRecv, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_RICHTREASURE_RESULT, this.richTreasureMsgRecv, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_RETURNTO_LOGINSCENE, this.quitBattlePlane, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_RCGBAG_RESULT, this.rcgbagRecv, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_EXPCHANGE_NTF, this.updateExpBar, this);

        //RENAME
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_RENAME_ACK, this.getReNameData, this);
        
        //hotpoint
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_SET_MAIL_FLAG, this.setMailFlag, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_DAILY_FLAG_CHANGE, this.setDailyFlag, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_ACTIVE_FLAG_CHANGE, this.setActiveFlag, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_STORE_NORMAL_FLAG_CHANGE, this.setNormalStoreFlag, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GUAZAI_FLAG_CHANGE, this.setGuazaiFlag, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_EQUIPT_FLAG_CHANGE, this.setEquiptFlag, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_MEMBER_FLAG_CHANGE, this.setMemberFlag, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_THEBAG_FLAG_CHANGE, this.setBagFlag, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_FULICZ_FLAG_CHANGE, this.setFuliFlag, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_CAMP_FLAG_CHANGE,this.setCampFlag,this);
    },

    checkFlagSetHotPoint: function(){
        let flags = GlobalVar.me().statFlags;

        this.setActiveFlag();
        this.setDailyFlag();
        this.setNormalStoreFlag();
        this.setGuazaiFlag();
        this.setEquiptFlag();
        this.setMemberFlag();
        this.setBagFlag();
        this.setFuliFlag();


        // 邮件要先获取邮件信息才可以判断是否有红点
        this.setMailFlag();

    },

    judgeLevelUp: function () {
        if(!config.NEED_GUIDE)
            GlobalVar.me().getLevelUpData();
    },

    updateExpBar: function () {
        let level = GlobalVar.me().getLevel();
        let levelUpData = GlobalVar.tblApi.getDataBySingleKey('TblLevel', level);
        let levelUpNeedExp = levelUpData.dwExp;
        let exp = GlobalVar.me().getExp();
        let percent = exp / levelUpNeedExp;
        this.getNodeByName('ExpProgress').getComponent(cc.Sprite).fillRange = percent;
    },

    showNotice: function () {
        if(config.NEED_GUIDE){
            return;
        }

        if (!GlobalVar.me().alreadedShowNotice){
            let noticeCount = GlobalVar.me().noticeData.getNoticeCount();
            if(noticeCount == -1){
                //先去拉取公告
                GlobalVar.handlerManager().noticeHandler.sendGetNoticeReq();
                return;
            }
            
            GlobalVar.me().alreadedShowNotice = true;
            if (noticeCount > 0){
                CommonWnd.showNoticeWnd();
            }
        }
    },

    getVoucher: function () {
        GlobalVar.handlerManager().rechargeHandler.sendRcgBagReq();
    },

    setGuazaiFlag: function(event){
        //挂载的红点
        let flag = GlobalVar.me().guazaiData.getHotPointData();
        this.setFlagByNodeName("btnoGuazai", flag);
    },
    setEquiptFlag: function(event) {
        let flag = GlobalVar.me().leaderData.getHotPointData();
        this.setFlagByNodeName("btnoEquipment", flag);
    },
    setMemberFlag: function(event){
        let flag = GlobalVar.me().memberData.getHotPointData();
        this.setFlagByNodeName("btnoPlane", flag);
    },
    setBagFlag: function(event) {
        let flag = GlobalVar.me().bagData.getHotPointData();
        this.setFlagByNodeName("btnoBag", flag);
    },
    setMailFlag: function(event){
        let notReadMailCount = GlobalVar.me().mailData.getNotReadMailCont();
        if(notReadMailCount == -1){
            // 邮件要先获取邮件信息才可以判断是否有红点
            GlobalVar.handlerManager().mailHandler.sendGetMailListReq(GameServerProto.PT_MAIL_TYPE_SYS);
            return;
        }
        let flags = GlobalVar.me().statFlags;
        flags.MailStateFlag = notReadMailCount;
        this.setFlagByNodeName("btnoMail", flags.MailStateFlag);
    },
    setDailyFlag: function(event){
        let flags = GlobalVar.me().statFlags;
        this.setFlagByNodeName("btnoDaily", flags.DailyFlag);
    },
    setActiveFlag: function(event){
        let flags = GlobalVar.me().statFlags;
        this.setFlagByNodeName("btnoActivity", flags.AMSFlag);
    },
    setNormalStoreFlag: function(event){
        let flags = GlobalVar.me().statFlags;
        this.setFlagByNodeName("btnoStore", flags.StoreNormalFlag);
    },
    setFuliFlag: function(event){
        let flags = GlobalVar.me().statFlags;
        this.setFlagByNodeName("btnoFirstCharge", flags.FuLiCZFlag);
    },

    setCampFlag: function (data) {
        this.setFlagByNodeName("btnoCharpter", data.length > 0);
    },

    setFlagByNodeName(nodeName, flag){
        let node = this.getNodeByName(nodeName);
        if (!!node){
            let spriteHot = node.getChildByName("spriteHot");
            if(!!spriteHot){
                spriteHot.active = !!flag;
            }else{
                console.log("spriteHot is not exits");
            }
        }else{
            console.log(nodeName + "is not exits");
        }
        // this.getNodeByName(nodeName).getChildByName("spriteHot").active = !!flag;
    },

    quitBattlePlane: function () {
        BattleManager.getInstance().quitOutSide();
        GlobalVar.sceneManager().gotoScene(SceneDefines.LOGIN_STATE);
    },

    initUIMain: function () {
        this.setGold(GlobalVar.me().getGold());
        this.setDiamond(GlobalVar.me().getDiamond());

        this.setEnergy(GlobalVar.me().getSpData(), GlobalVar.me().getVipLevel());

        this.setRollName(GlobalVar.me().getRoleName() || "");
        this.setPlayerLevel(GlobalVar.me().getLevel() || 0);
        this.setPlayerCombat(GlobalVar.me().getCombatPoint() || 0);
        this.setPlayerAvatar(GlobalVar.me().loginData.getLoginReqDataAvatar());

        this.setNewTaskDesc(GlobalVar.me().dailyData.getNewTaskData(), GameServerProto.PT_NEW_TASK_TYPE_CAMP);
    },

    getReNameData: function (data) {
        if (data.ErrCode != GameServerProto.PTERR_SUCCESS){
            GlobalVar.comMsg.errorWarning(data.ErrCode);
            return;
        }

        this.setPlayerAvatar(GlobalVar.me().loginData.getLoginReqDataAvatar());
        this.setRollName(GlobalVar.me().getRoleName() || "");
    },

    checkInvite: function () {
        weChatAPI.judgeInvite();
    },
    reportMaterialClick: function () {
        // weChatAPI.reportClickMaterial();

        let onShowFunc = function (res) {
            if (res.query.materialID >= 0){
                weChatAPI.reportClickMaterial(res.query.materialID);
            }
        };
        weChatAPI.setOnShowListener(onShowFunc);
    },

    showPlayerLevelUpWnd: function (event) {
        CommonWnd.showPlayerLevelUpWnd(event);
        this.setPlayerLevel(event.LevelCur);
    },

    updateGold: function () {
        this.setGold(GlobalVar.me().getGold());
    },

    updateDiamond: function () {
        this.setDiamond(GlobalVar.me().getDiamond());
    },
    updateSp: function () {
        this.setEnergy(GlobalVar.me().getSpData(), GlobalVar.me().getVipLevel());
    },
    updateCombatPoint: function (data) {
        this.setPlayerCombat(GlobalVar.me().getCombatPoint() || 0);
        if (data.combatUpflag) {
            GlobalVar.comMsg.showCombatPoint(data.delta, data.combatPoint, data.lastCombatPoint);
        }
    },

    setGold: function (num) {
        num = typeof num !== 'undefined' ? num : 0;
        let imgTopBg = this.node.getChildByName("imgTopBg");
        let lblGold = imgTopBg.getChildByName("nodeGold").getChildByName("lblGold").getComponent(cc.Label);
        if (num > 999999) {
            if (num > 999999999) {
                num = 999999999;
            }
            num = Math.floor(num / 10000);
            num += ";<";
            if (!lblGold.node.oldPos) {
                lblGold.node.oldPos = lblGold.node.position;
            }
            lblGold.node.x=(lblGold.node.oldPos.x + 13);
        } else {
            if (lblGold.node.oldPos) {
                lblGold.node.x=(lblGold.node.oldPos.x);
            }
        }
        lblGold.string = num;
    },

    setDiamond: function (num) {
        num = typeof num !== 'undefined' ? num : 0;
        let imgTopBg = this.node.getChildByName("imgTopBg");
        let lblDiamond = imgTopBg.getChildByName("nodeDiamond").getChildByName("lblDiamond").getComponent(cc.Label);
        if (num > 999999) {
            if (num > 999999999) {
                num = 999999999;
            }
            num = Math.floor(num / 10000);
            num += ";<";
            if (!lblDiamond.node.oldPos) {
                lblDiamond.node.oldPos = lblDiamond.node.position;
            }
            lblDiamond.node.x=(lblDiamond.node.oldPos.x + 13);
        } else {
            if (lblDiamond.node.oldPos) {
                lblDiamond.node.x=(lblDiamond.node.oldPos.x);
            }
        }
        lblDiamond.string = num;
    },

    setEnergy: function (spData, vipLevel) {
        spData.Sp = typeof spData.Sp !== 'undefined' ? spData.Sp : 0;
        let imgTopBg = this.node.getChildByName("imgTopBg");
        let lblSp = imgTopBg.getChildByName("nodeSp").getChildByName("lblSp").getComponent(cc.Label);
        // this.labelAtlasEnergy.string = cur + "/" + max;
        let spLimit = GlobalVar.tblApi.getDataBySingleKey("TblSpVip", vipLevel).wSpLimit;
        lblSp.string = (spData.Sp > 9999 ? 9999 : spData.Sp) + "/" + spLimit;
    },

    setPlayerCombat: function (combatPoint) {
        combatPoint = typeof combatPoint !== 'undefined' ? combatPoint : 0;
        let imgTopBg = this.node.getChildByName("imgTopBg");
        let lblCp = imgTopBg.getChildByName("lblCp").getComponent(cc.Label);
        lblCp.string = combatPoint;
    },

    setRollName: function (rollName) {
        var interceptStr = function (str, lens, strEnd) {
            if (str == null)
                return '';
            if (strEnd == undefined) strEnd = '';
            let len = 0;
            for (let i = 0; i < str.length; i++) {
                let c = str.charCodeAt(i);
                if (c >= 0 && c <= 128)
                    len++;
                else
                    len += 2;
                if (len > lens)
                    return str.substr(0, i) + strEnd;
            }
            return str;
        };
        let imgTopBg = this.node.getChildByName("imgTopBg");
        let lblName = imgTopBg.getChildByName("nodeUserInfo").getChildByName("lblName").getComponent(cc.Label);
        lblName.string = interceptStr(rollName, 6, '...');
    },

    setPlayerLevel: function (level) {
        let imgTopBg = this.node.getChildByName("imgTopBg");
        let lblLv = imgTopBg.getChildByName("nodeUserInfo").getChildByName("lblLv").getComponent(cc.Label);
        lblLv.string = i18n.t('label.4000229') + level;

        // let lblNameNode = imgTopBg.getChildByName("lblName")
        // lblLv.node.getComponent(cc.Widget).left = lblNameNode.width + 10;
        // lblLv.node.getComponent(cc.Widget).updateAlignment();
    },

    setPlayerAvatar: function (url) {
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            return;
        }
        if (url == ""){
            return;
        }
        let imgTopBg = this.node.getChildByName("imgTopBg");
        let spriteAvatarImg = imgTopBg.getChildByName("spriteAvatarImg");

        url = url + "?aaa=aa.png";
        cc.loader.load(url, function (err, tex) {
            if (err) {
                // cc.error("LoadURLSpriteFrame err." + url);
            }
            let spriteFrame = new cc.SpriteFrame(tex);
            spriteAvatarImg.getComponent("RemoteSprite").spriteFrame = spriteFrame;
        })
    },

    setNewTaskDesc: function (newTask, mode){
        if(!newTask){
            newTask = GlobalVar.me().dailyData.getNewTaskData();
        }else if(mode != 1){
            newTask = newTask.NewTaskBag;
        }
        if (newTask) {
            let taskData = GlobalVar.tblApi.getDataBySingleKey('TblNewTask', newTask.TaskID);
            if (taskData) {
                let btnoTask = this.node.getChildByName("nodeBottom").getChildByName("btnoTask")
                btnoTask.getChildByName("labelTaskName").getComponent(cc.Label).string = taskData.strName;
                let maxRate = taskData.nVar;
                let curRate = newTask.Var;
                if (curRate > maxRate){
                    curRate = maxRate;
                }
                btnoTask.getChildByName("labelTaskRate").getComponent(cc.Label).string = "(" + curRate + "/" + maxRate + ")";

                this.setFlagByNodeName("btnoTask", curRate == maxRate);
            }
        }
    },

    onDestroy: function () {
        if (this.btnAuthorize){
            this.btnAuthorize.destroy();
            this.btnAuthorize = null;
        }
        GlobalVar.eventManager().removeListenerWithTarget(this);
    },

    onEndlessClick: function (event) {
        BattleManager.getInstance().isEndlessFlag = true;
        GlobalVar.sceneManager().gotoScene(SceneDefines.BATTLE_STATE);
    },

    onEditorClick: function (event) {
        BattleManager.getInstance().quitOutSide();
        BattleManager.getInstance().isEditorFlag = true;
        BattleManager.getInstance().setCampName('CampEditor');
        GlobalVar.sceneManager().gotoScene(SceneDefines.BATTLE_STATE);
    },

    onPlaneClick: function (event) {
        CommonWnd.showNormalPlane();
    },

    onEquipClick: function (event) {
        CommonWnd.showImprovementView();
    },

    onClasscialClick: function (event) {
        BattleManager.getInstance().quitOutSide();
        BattleManager.getInstance().isShowFlag = true;
        BattleManager.getInstance().setCampName('CampDemo');
        GlobalVar.sceneManager().gotoScene(SceneDefines.BATTLE_STATE);
    },

    onLoginDataEvent: function (evt, data) {
        // cc.log("recv event " + evt);
        // console.log("recv event " + evt);
    },

    onTestBtnClicked: function (event) {
        // GlobalVar.comMsg.showMsg("中间弹出消息测试成功");
    },
    onTest2BtnClicked: function (event) {
        // GlobalVar.comMsg.pushMsg("推送消息测试成功");
    },
    onTest3BtnClicked: function (event) {
        var itemArray = [];
        for (let i = 0; i < 3; i++) {
            var item = {
                ItemID: i + 1,
                Count: i + 10,
            }
            itemArray.push(item);
        }
        GlobalVar.comMsg.pushItem(itemArray);
    },
    onTest4BtnClicked: function (event) {
        GlobalVar.comMsg.showCombatPoint(6666666, 11111);
    },
    onTest5BtnClicked: function (event) {
        GlobalVar.comMsg.showAttrUpdateMsg([111, 222, 333]);
    },
    onSettingBtnClicked: function (event) {
        CommonWnd.showSettingWnd();
    },

    onDailyBtnClick: function (event) {
        GlobalVar.handlerManager().dailyHandler.sendGetDailyDataReq();
    },
    dailyMsgRecv: function (errCode){
        if (errCode != GameServerProto.PTERR_SUCCESS){
            GlobalVar.comMsg.errorWarning(errCode);
            return;
        }
        CommonWnd.showDailyMissionWnd();
    },

    rcgbagRecv: function (data) {
        CommonWnd.showRechargeWnd();
    },

    richTreasureMsgRecv: function (data) {
        if (data.ErrCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(data.ErrCode);
            return;
        }
        CommonWnd.showRichTreasureWnd();
    },

    onNewTaskBtnClick: function (event) {
        let TAB_NEWTASK = 0;
        CommonWnd.showDailyMissionWnd(TAB_NEWTASK);
    },
    onRankingBtnClicked: function (event) {
        CommonWnd.showRankingView();
    },
    onMailBtnClick: function (event) {
        CommonWnd.showMailWnd();
        // let data = {
        //     combatUpflag: true,
        //     delta: 20000,
        //     combatPoint: 120000,
        //     lastCombatPoint: 100000
        // }
        // GlobalVar.comMsg.showCombatPoint(data.delta, data.combatPoint, data.lastCombatPoint);
    },
    onEndlessModeBtnClick: function (event) {
        let endlessSystemData = GlobalVar.tblApi.getDataBySingleKey('TblSystem', GameServerProto.PT_SYSTEM_ENDLESS);
        if (GlobalVar.me().level < endlessSystemData.wOpenLevel){
            GlobalVar.comMsg.showMsg(i18n.t('label.4000258').replace("%d", endlessSystemData.wOpenLevel).replace("%d", endlessSystemData.strName));
            return;
        }
        
        CommonWnd.showEndlessView();
    },
    onPlayerInfoBtnClick: function (event) {
        CommonWnd.showPlayerInfoWnd();
    },
    onBuySpBtnClick: function (event) {
        CommonWnd.showBuySpWnd();
    },

    onRechargeBtnClick: function (event) {
        // GlobalVar.handlerManager().rechargeHandler.sendRcgBagReq();
        CommonWnd.showRechargeWnd();
    },

    onRichTreasureBtnClick: function (event) {
        // CommonWnd.showRichTreasureWnd();
        GlobalVar.handlerManager().drawHandler.sendTreasureData();
    },

    onFeedbackBtnClick: function (event) {
        CommonWnd.showFeedbackWnd();
    },

    onRechargeBtnClick: function (event) {
        CommonWnd.showRechargeWnd();
    },

    onQuestListBtnClick: function (event) {
        CommonWnd.showQuestList();
    },
    onActiveBtnClick: function (event){
        // GlobalVar.comMsg.showMsg("未完成");
        // return;
        GlobalVar.handlerManager().activeHandler.sendGetActiveListReq(GameServerProto.PT_AMS_ACT_TYPE_NORMAL, 0);
    },
    activeMsgRecv: function (errCode){
        if (errCode != GameServerProto.PTERR_SUCCESS){
            GlobalVar.comMsg.errorWarning(errCode);
            return;
        }
        CommonWnd.showActiveWnd();
    },

    onItemBagBtnClick: function (event) {
        CommonWnd.showItemBag(-1, null, null, null, 1);
    },

    onGMIDSend: function () {
        if (this.edbxGMCMD.string == "") return;
        var param = this.edbxGMCMD.string.split(" ");
        // cc.log(param);
        let msg = {
            Params: [],
        };
        // msg.Params.Param=param;
        for (let i = 0; i < param.length; i++) {
            let p = {
                Param: param[i]
            };
            msg.Params.push(p);
        }
        GlobalVar.handlerManager().gmCmdHandler.sendReq(GameServerProto.GMID_GMCMD_REQ, msg);
    },

    onTreasuryBtnTouched: function () {
        CommonWnd.showDrawView();
    },

    onStoreBtnTouched: function () {
        let systemData = GlobalVar.tblApi.getDataBySingleKey('TblSystem', GameServerProto.PT_SYSTEM_STORE);
        if (systemData && GlobalVar.me().level < systemData.wOpenLevel) {
            GlobalVar.comMsg.showMsg(i18n.t('label.4000258').replace("%d", systemData.wOpenLevel || 0).replace("%d", systemData.strName));
            return;
        }
        CommonWnd.showStoreWithParam(1);
    },

    onLimitStoreBtnTouched: function () {
        let systemData = GlobalVar.tblApi.getDataBySingleKey('TblSystem', GameServerProto.PT_SYSTEM_FULI_GIFT);
        if (systemData && GlobalVar.me().level < systemData.wOpenLevel) {
            GlobalVar.comMsg.showMsg(i18n.t('label.4000258').replace("%d", systemData.wOpenLevel || 0).replace("%d", systemData.strName));
            return;
        }
        CommonWnd.showLimitStoreWithParam(1);
    },

    onGuazaiBtnTouched: function (event) {
        CommonWnd.showGuazai();
    },
    onBtnNewRateItemClick: function (event) {
        CommonWnd.showGetNewRareItemWnd(null, 0);
    },

    onBtnMoreGame: function (event){
        if (cc.sys.platform != cc.sys.WECHAT_GAME) return;
        // const appid = "wx845a2f34af2f4235";
        // var parm = "pages/main/main";
        // let gender = 0;
        // weChatAPI.getUserInfo(function(userInfo){
        //     gender = userInfo.gender;
        // })
        // parm = parm.indexOf('?') > 0 ? parm : parm +'?';
        // parm = parm.indexOf('gender') > 0 ? parm : parm + '&gender='+ gender;

        // weChatAPI.navigateToMiniProgram(appid, parm);
        weChatAPI.requestGetMoreFunInfo(function (data) {
            console.log("moreInfo:", data);
            let moreGameInfo = data.moreInfoList;
            if (moreGameInfo.length == 0){
                return;
            }
            let randomNum = parseInt(moreGameInfo.length * Math.random());
            let navigateData = moreGameInfo[randomNum];
            let appid = navigateData.key;
            let parm = navigateData.parm;
            let gender = 0;
            weChatAPI.getUserInfo(function(userInfo){
                gender = userInfo.gender;
                parm = parm.indexOf('?') > 0 ? parm : parm +'?';
                parm = parm.indexOf('gender') > 0 ? parm : parm + '&gender='+ gender;
                weChatAPI.navigateToMiniProgram(appid, parm);
            }, function () {
                parm = parm.indexOf('?') > 0 ? parm : parm +'?';
                parm = parm.indexOf('gender') > 0 ? parm : parm + '&gender='+ gender;
                weChatAPI.navigateToMiniProgram(appid, parm);
            });
        });
    },

    skipGuide: function () {
        config.NEED_GUIDE = false;
        cc.find('Canvas/GuideNode').active = false;
    },

    setMode: function () {
        if (!config.GM_SWITCH) {
            this.edbxGMCMD.node.active = false;
            this.getNodeByName('btnSendGM').active = false;
            this.getNodeByName('btnoBattleDemo').active = false;
            this.getNodeByName('btnoBattleEditor').active = false;
            cc.find('Canvas/GuideNode/skip').active = false;
        }
    },
});