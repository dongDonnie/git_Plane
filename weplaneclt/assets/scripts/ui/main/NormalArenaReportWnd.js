
const RootBase = require("RootBase");
const WindowManager = require("windowmgr");
const GlobalVar = require('globalvar')
const WndTypeDefine = require("wndtypedefine");
const i18n = require('LanguageData');

cc.Class({
    extends: RootBase,

    properties: {
        reportScorll: {
            default: null,
            type: cc.ScrollView,
        },
        nodeReportModel: {
            default: null,
            type: cc.Node,
        },
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_ARENA_REPORT_WND;
        this.animeStartParam(0, 0);
        // this.reportScorll.loopScroll.releaseViewItems();
    },

    animeStartParam(paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            GlobalVar.eventManager().removeListenerWithTarget(this);
            WindowManager.getInstance().popView(false, null, false, false);
        } else if (name == "Enter") {
            this._super("Enter");
            this.initReportWnd();
        }
    },

    initReportWnd: function () {
        let self = this;
        let reportData = GlobalVar.me().arenaData.getArenaReportData().reverse();
        this.reportScorll.loopScroll.setTotalNum(reportData.length);
        this.reportScorll.loopScroll.setCreateModel(this.nodeReportModel);
        this.reportScorll.loopScroll.registerUpdateItemFunc(function(report, index){
            self.updateReport(report, reportData[index]);
        });
        this.reportScorll.loopScroll.resetView();
    },

    updateReport: function (report, data) {
        let str = i18n.t('label.4001012');
        if (data.ReportTag == 1){ //进攻
            str = str.replace("%tag", i18n.t('label.4001002'));
            str = str.replace('%action', i18n.t('label.4001010'));
        }else if (data.ReportTag == 2){ //防守
            str = str.replace("%tag", i18n.t('label.4001003'));
            str = str.replace('%action', i18n.t('label.4001011'));
        }

        if (data.ChallengeResult == 1){ //胜利
            // str = str.replace("%result", i18n.t('label.4001004'));
            str = str.replace("%result2", i18n.t('label.4001005'));
            str = str.replace("%change", i18n.t('label.4001008'));
        }else if (data.ChallengeResult == 2){ //战败
            // str = str.replace("%result", i18n.t('label.4001006'));
            str = str.replace("%result2", i18n.t('label.4001007'));
            str = str.replace("%change", i18n.t('label.4001009'));
        }

        let time = GlobalVar.me().serverTime - data.Time;
        var day = Math.floor(time / 86400);
        var hour = Math.floor(time % 86400 / 3600);
        var minute = Math.floor(time % 86400 % 3600 / 60);
        var second = Math.floor(time % 86400 % 3600 % 60);
        if (day !== 0) {
            str = str.replace("%time",  day + "天前");
        } else if (hour !== 0) {
            str = str.replace("%time",  hour + "小时前");
        } else if (minute !== 0) {
            str = str.replace("%time",  minute + "分钟前");
        } else {
            str = str.replace("%time",  second + "秒前");
        }
        str = str.replace("%other", data.RoleName).replace("%gap", Math.abs(parseInt(data.RankingNew - data.RankingOld)));

        report.getChildByName("labelText").getComponent(cc.Label).string = str;
        report.x = 0;
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

    close: function () {
        this.reportScorll.loopScroll.releaseViewItems();
        this._super();
    },

});
