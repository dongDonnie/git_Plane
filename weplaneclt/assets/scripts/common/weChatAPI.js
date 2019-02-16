const GlobalVar = require('globalvar')
const md5 = require("md5");
const StoreageData = require("storagedata");
const i18n = require('LanguageData');
const GlobalFunc = require('GlobalFunctions');
const CommonWnd = require("CommonWnd");
const SceneDefines = require("scenedefines");
const GameServerProto = require("GameServerProto");

const GAME_ID = 7002;
const APP_ID = "wxa60dbd8655a13c00";
const OP_ID = 9000;
const GAME_OP_ID = 5;
const DEFAULT_METHOD = "POST";
const GET_METHOD = "GET";
const DEFAULT_HEADER = {
    'content-type': 'application/x-www-form-urlencoded'
};
const GET_HEADER = {
    'content-type': 'application/x-www-form-urlencoded'
};
const OPENLOG = false;
const VIDEOUNIT_ID = "adunit-ba7f540156b29839";
const BANNERUNIT_ID = "adunit-038a09ed24b46354";
const BANNERUNIT_ID_LIST = [
    "adunit-038a09ed24b46354",
    "adunit-b45a3dc79d07f7b2",
    "adunit-797165613e57d67a",
];

const URL_LOGIN = "https://mwxsdk.phonecoolgame.com/login.php";
const URL_SHARE = "https://mwxsdk.phonecoolgame.com/share.php";
const URL_INVITE = "https://mwxsdk.phonecoolgame.com/invite.php";
const URL_INVITE_LIST = "https://mwxsdk.phonecoolgame.com/invite_list.php";
const URL_SHARE_TOTAL = "https://mwxsdk.phonecoolgame.com/share_total.php";
const URL_ANDROID_PAY = "https://mwxsdk.phonecoolgame.com/pay.php";
const URL_IOS_PAY = "https://mwxsdk.phonecoolgame.com/ipay.php";
const URL_GET_PAYINFO = "https://cpgc.phonecoolgame.com/appPay/getAppPayInfo?payid=%d";
const URL_GET_MATERIALS = "https://cpgc.phonecoolgame.com/material/getMaterials?appid=%d";
const URL_REPORT_SHARE = "https://cpgc.phonecoolgame.com/material/reportShare?appid=%d&materialID=%d";
const URL_REPORT_CLICK = "https://cpgc.phonecoolgame.com/material/reportClick?appid=%d&materialID=%d";
const URL_REPORT_VIDEO_START = "https://cpgc.phonecoolgame.com/material/reportVideoStart?appid=" + APP_ID + "&videoPointID=%d";
const URL_REPORT_VIDEO_END = "https://cpgc.phonecoolgame.com/material/reportVideoEnd?appid=" + APP_ID + "&videoPointID=%d";
const URL_GET_MORE_INFO = "https://cpgc.phonecoolgame.com/adc/getMoreInfo?appid=%d&ptform=%d";
const URL_SERVER_LIST = "https://wepup.phonecoolgame.com/json.php?_c=server&_f=plist&opid=" + OP_ID + "&gameopid=" + GAME_OP_ID + "&ver=%d&userid=%d";
const URL_REPROT_SERVER_LOGIN = "https://wepup.phonecoolgame.com/json.php?_c=server&_f=in&userid=%d&server_id=%d&time=%d&sign=%sign";
const KEY_REPROT_SERVER_LOGIN = "$time.$userid.vs8$skv_sadid5dCasACFmCfe@45@aU2!";
const URL_ENDLESS_WORLD_RANKING = "https://wepup.phonecoolgame.com/json.php?_c=sort&_f=endlessList&server_id=%d&role_id=%d&page=%d&pagenum=%d";
const URL_GETIOS_RECHARGE_LOCKSTATE = "https://wepup.phonecoolgame.com/json.php?_c=check&_f=p&l=%d&c=%d&ct=%d";
const URL_SHARE_CONFIG = "https://cpgc.phonecoolgame.com/app/getCommonConfig?appid=" + APP_ID;
const URL_SHARE_SWITCH = "https://cpgc.phonecoolgame.com/app/getInfo?appid=" + APP_ID + "&version=%d";
const URL_GET_LAUNCH_NOTICE = "https://wepup.phonecoolgame.com/json.php?_c=start&_f=slist&opid=" + OP_ID;

const URL_GET_MY_SERVER = "https://wepup.phonecoolgame.com/json.php?_c=server&_f=my&opid=" + OP_ID + "&gameopid=" + GAME_OP_ID + "&ver=%d&userid=%d";

const URL_GET_ADC_Frame = "https://cpgc.phonecoolgame.com/adc/getAdFrame";
const URL_GET_ADC_EXP = "https://cpgc.phonecoolgame.com/adc/getAdexpInfo";
const URL_GET_ADC_Task = "https://cpgc.phonecoolgame.com/adc/getTaskWallInfo";
const URL_GET_ADC_Task_COMPLETE = "https://cpgc.phonecoolgame.com/adc/completeTask";
const URL_GET_ADC_Task_LIST = "https://cpgc.phonecoolgame.com/adc/getTaskList";

module.exports = {

    //hide,show 时的时间记录
    shareVersion: "2.3.0",
    shareSetting: {
        share: 1, // 模拟分享是否开启
        shareDefaultGap: 2000,
        shareFailReduceGap: 500, // 分享失败后减少的时间
        shareLowestGap: 1500, // 分享所需的最短间隔
        shareGap: 3000, // 分享时间间隔大于sharegap(ms)，分享成功，提供回调
        shareTimes: 0, // 分享次数
        shareFailProb: 50,
        shareFailTimes: [3, 5, 7],
        shareGapGrowInterval: 200, // 达到增加分享间隔时，增加的分享间隔
        shareGapGrowStartTimes: 5, // 增加分享时间间隔的起始分享次数
        shareNeedDiffGroup: true,
        shareNeedClickLoseEffect: 30000,
        superBannerProb: 0,
        // 超级诱导每日上限，默认为Param表配的值
        superBannerMax: 0,
        vpnaFlag: 0,
        heziFlag: 0,
        todayVideoMax: 999,
    },
    shareMessageFlag: false,

    _Materials: null,
    _defaultMaterial: null,

    _onHideTime: 0,
    _onShowTime: 0,
    _shareNeedClickTime: 0,
    _onShowListener: [],
    _onHideListener: [],

    _currentVideoPointID: 0,
    _rewardedVideoAd: null,
    _videoAdSuccessCallback: null,
    _videoAdCancelCallback: null,
    // _videoAdFailCallback: null,

    _bannerAd: null,
    _bannerCount: 0,
    _bannerTimeCount: 0,
    _bannerExchangeTime: 120,

    _bannerAdList: [],
    _bannerTimeCounts: {},
    _alternateIndex: 0,
    _bannerShowState: false,

    getShareSuccess: function () {
        let shareSuccess = false;
        let showTime = this.getOnShowTime();
        let hideTime = this.getOnHideTime();
        let shareTimeGap = showTime - hideTime;
        console.log("本次分享切回界面耗时：", shareTimeGap / 1000, "秒");
        let setting = this.shareSetting;
        if (this.shareMessageFlag) {
            this.shareMessageFlag = false;
            console.log("shareSetting:", setting);
            console.log("shareTimeGap:", shareTimeGap);
            if (shareTimeGap < setting.shareGap) {
                if (setting.shareGap < setting.shareLowestGap) {
                    shareSuccess = true;
                } else {
                    setting.shareGap -= setting.shareFailReduceGap;
                    if (setting.shareGap < setting.shareLowestGap) {
                        setting.shareGap = setting.shareLowestGap;
                    }
                }
            } else {
                for (let i = 0; i < setting.shareFailTimes.length; i++) {
                    if (setting.shareFailTimes.indexOf(setting.shareTimes) != -1) {
                        let ranNum = parseInt(Math.random() * 100) + 1;
                        if (ranNum > setting.shareFailProb) {
                            shareSuccess = true;
                        } else {
                            console.log("因概率的分享限制而分享失败, shareTimes:", setting.shareTimes, "  ranNum:", ranNum, "  shareFailTimes:", setting.shareFailTimes);
                            break;
                        }
                    } else {
                        shareSuccess = true;
                    }
                }
            }
        }

        if (shareSuccess) {
            // setting.shareTimes++;
            StoreageData.setTotalShareTimes();
            setting.shareLowestGap = setting.shareDefaultGap;
            setting.shareGap = setting.shareLowestGap;
        }
        setting.shareTimes++;

        return shareSuccess;
    },

    getShareConfig: function () {
        let self = this;
        let setting = this.shareSetting;
        setting.superBannerMax = GlobalVar.tblApi.getDataBySingleKey('TblParam', GameServerProto.PTPARAM_FULI_GC_SUPER_INDUCE_MAX_COUNT).dValue
        this.request(URL_SHARE_CONFIG, null, function (data) {
            (data.shareMinTime >= 0) && (setting.shareDefaultGap = parseInt(data.shareMinTime));
            (data.sharefailprob >= 0) && (setting.shareFailProb = parseInt(data.sharefailprob));
            data.shareReduceTime && (setting.shareFailReduceGap = parseInt(data.shareReduceTime));
            (data.shareBaseTime >= 0) && (setting.shareGap = parseInt(data.shareBaseTime));
            (data.shareLowerTime >= 0) && (setting.shareLowestGap = parseInt(data.shareLowerTime));
            setting.shareNeedDiffGroup = !!parseInt(data.shareNeedDiffGroup);
            setting.shareFailTimes = [3, 5, 7];
            data.shareValue && setting.shareFailTimes.push(parseInt(data.shareValue));
            setting.shareTimes = StoreageData.getTotalShareTimes();
            data.bannerRefreshTime && (self._bannerExchangeTime = parseInt(data.bannerRefreshTime));
            console.log("bannerRefreshTime:", self._bannerExchangeTime);
            console.log("get share config success, new config:", setting);
            setting.superBannerProb = data.superBannerProb;
            setting.superBannerMax = data.superBannerMax;
            setting.vpnaFlag = data.vpnaFlag;
            setting.heziFlag = data.heziFlag;
            (data.videoMax >= 0) && (setting.todayVideoMax = data.videoMax);
        }, null, GET_METHOD, GET_HEADER);
    },

    requestShareOpenState: function (version, successCallback) {
        let url = URL_SHARE_SWITCH.replace("%d", version);
        this.request(url, null, function (data) {
            if (!!successCallback) {
                successCallback(data);
            }
        }, null, GET_METHOD, GET_HEADER);
    },

    showLog: function () {
        if (OPENLOG) {
            for (let i = 0; i < arguments.length; i++) {
                console.log(arguments[i]);
            }
        }
    },
    //login
    login: function (successCallback) {
        let self = this;
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            let launchInfo = wx.getLaunchOptionsSync();
            let channelID = "fkw001";
            if (launchInfo.query.from) {
                channelID = launchInfo.query.from;
            } else if (launchInfo.scene == 1007 || launchInfo.scene == 1008 || launchInfo.scene == 1044 || launchInfo.scene == 1096) {
                channelID = "share";
            }
            wx.login({
                success: function (res) {
                    if (res.code) { //用wx.login返回的Code作为登陆所需参数，向服务器请求登陆
                        let loginData = {
                            game_id: GAME_ID,
                            code: res.code,
                            channel_id: channelID,
                        };
                        self.request(URL_LOGIN, loginData, function (data) {
                            // 向服务器请求登陆，保存服务器传过来的openid和ticket;
                            if (data.ret !== 0) {
                                self.showToast("网络链接异常, 是否重试", true, false, "确认", null, function () {
                                    self.login(successCallback);
                                }, function () {
                                    cc.game.end();
                                })
                                return;
                            }
                            // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                            // wx.setStorageSync('openid', data.data.user_id);
                            // wx.setStorageSync('ticket', data.data.ticket);
                            let user_id = data.data.user_id;
                            let ticket = data.data.ticket;
                            let cityFlag = data.data.cityFlag;
                            self.getUserInfo(function (userInfo) {
                                // 从微信侧获得玩家的头像地址
                                self.showLog(userInfo);
                                // console.log("获取用户数据成功");
                                let avatarUrl = userInfo.avatarUrl
                                if (!!successCallback) {
                                    successCallback(user_id, ticket, avatarUrl, cityFlag);
                                }
                            }, function (res) {
                                // console.log("请求登陆失败");
                                if (!!successCallback) {
                                    successCallback(user_id, ticket, "", cityFlag);
                                }
                            });
                        }, function (data) {
                            self.showToast("网络链接异常, 是否重试", true, false, "确认", null, function () {
                                self.login(successCallback);
                            }, function () {
                                cc.game.end();
                            })
                        });
                    } else {
                        self.showLog('get login code failed！');
                        self.showToast("网络链接异常, 是否重试", true, false, "确认", null, function () {
                            self.login(successCallback);
                        }, function () {
                            cc.game.end();
                        })
                    }
                },
                fail: function () {
                    self.showLog('login error!');
                    self.showToast("网络链接异常, 是否重试", true, false, "确认", null, function () {
                        self.login(successCallback);
                    }, function () {
                        cc.game.end();
                    })
                }
            });
        }
    },

    getSetting: function (scopeName, successCallback, failCallback) {
        wx.getSetting({
            success: function (res) {
                if (res.authSetting['scope.' + scopeName]) {
                    if (!!successCallback) {
                        successCallback();
                    }
                } else {
                    if (!!failCallback) {
                        failCallback();
                    }
                }
            }
        })
    },

    request: function (url, data, successCallback, failCallback, method = DEFAULT_METHOD, header = DEFAULT_HEADER) {
        let self = this;
        wx.request({
            url: url,
            data: data,
            method: method,
            header: header,
            // 向url发起请求
            success: function (res) {
                console.log("request from " + url + " success!");
                console.log("get success data:", res.data);
                self.showLog("request from " + url + " success!");
                self.showLog("get success data:", res.data);
                if (res.data && res.statusCode == 200) {
                    if (successCallback) {
                        successCallback(res.data);
                    }
                }
            },
            fail: function (res) {
                console.log("request from " + url + " failed!");
                console.log("get fail data:", res);
                self.showLog("request from " + url + " failed!");
                self.showLog("get fail data:", res);
                if (failCallback) {
                    failCallback(res);
                }
            },
        })
    },

    authorize: function (scopeName, successCallback, failCallback) {
        let self = this;
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.authorize({
                scope: scopeName,
                success: function (res) {
                    self.showLog("authorize success: ", res);
                    if (!!successCallback) {
                        successCallback(res);
                    }
                },
                fail: function (res) {
                    self.showLog("authorize fail: ", res);
                    if (!!failCallback) {
                        failCallback(res);
                    }
                }
            });
        }
    },

    showToast: function (tips, useWXToast = false, showCancel = false, confirmText, cancelText, confirmCallback, cancelCallback) {
        if (!useWXToast) {
            tips && GlobalVar.comMsg.showMsg(tips);
        } else {
            if (tips) {
                wx.showModal({
                    title: '提示',
                    content: tips,
                    showCancel: showCancel,
                    confirmText: confirmText || "确定",
                    cancelText: cancelText || "取消",
                    success: function (res) {
                        if (res.confirm) {
                            confirmCallback && confirmCallback();
                        } else if (res.cancel) {
                            cancelCallback && cancelCallback();
                        }
                    },
                })
            }
        }
    },

    getUserInfo: function (successCallback, failCallback) {
        // 从微信侧获取用户的信息
        let self = this;
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.getUserInfo({
                success: function (res) {
                    self.showLog("getUserInfo success:", res);
                    if (successCallback) {
                        successCallback(res.userInfo);
                    }
                },
                fail: function (res) {
                    self.showLog("getUserInfo fail:", res);
                    if (failCallback) {
                        failCallback(res);
                    }
                }
            });
        }
    },

    //share
    shareNormal: function (index, successCallback, failCallback, successTips, failTips, inviteParam) {
        // 普通分享，判断模拟点击
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            return;
        }


        if (!inviteParam && GlobalVar.getShareControl() == 6) {
            this.showRewardedVideoAd(index + 100, successCallback, failCallback);
            return;
        }

        let block = cc.find("Canvas/BlockNode");
        if (cc.isValid(block)) {
            console.log("禁止点击1秒");
            block.active = true;
            setTimeout(function () {
                block.active = false;
            }, 1000);
        }

        let material = this.getRandomMaterial(index);
        if (!material) {
            console.log("material not found");
            material = this.getRandomMaterial(0);
            if (!material) {
                return;
            }
        }
        this.reportShareMaterial(material.materialID);
        this.shareMessageFlag = true;
        let self = this;
        let str = "materialID=" + material.materialID;
        str += "&from_openid=" + GlobalVar.me().loginData.getLoginReqDataAccount();
        if (inviteParam) {
            str += inviteParam;
            wx.shareAppMessage({
                title: material.content,
                imageUrl: material.cdnurl,
                query: str,
            });
            return;
        }

        let CC_GMAE_ONSHOW_OPEN = this.shareSetting.share;
        let shareVersion = this.shareVersion;
        if (this.wxBversionLess(shareVersion)) {
            CC_GMAE_ONSHOW_OPEN = 0;
        }

        let onHideFunc = function () {
            self.setOnHideTime(new Date().getTime());
        };
        let onShowFunc = function () {
            self.setOnShowTime(new Date().getTime());

            let shareSuccess = self.getShareSuccess();
            if (!CC_GMAE_ONSHOW_OPEN || shareSuccess) {
                if (!!successCallback) {
                    successCallback();
                    self.showToast(successTips || i18n.t('label.4000308'));
                }
            } else {
                // self.showToast(failTips || i18n.t('label.4000310'));
                failCallback && failCallback();
                // if (GlobalVar.sceneManager().getCurrentSceneType() == SceneDefines.BATTLE_STATE) {
                self.showToast(failTips || i18n.t('label.4000337'), true, true, "分享", "取消", function () {
                    self.shareNormal(index, successCallback, failCallback, successTips, failTips)
                });
                // } else {
                //     CommonWnd.showMessage(null, CommonWnd.shareOnly, i18n.t('label.4000216'), i18n.t('label.4000310'), null, function () {
                //         self.shareNormal(index, successCallback, failCallback, successTips, failTips)
                //     }, null, "  " + i18n.t('label.4000304'));
                // }
            }
            self.setOffShowListener(onShowFunc);
            self.setOffHideListener(onHideFunc);
        };
        this.setOnHideListener(onHideFunc);
        this.setOnShowListener(onShowFunc);
        wx.shareAppMessage({
            title: material.content,
            imageUrl: material.cdnurl,
            query: str,
        });
    },

    shareNeedClick: function (index, successCallback, failCallback, strTips, successTips, failTips, notShareInGropTips) {
        // 需要玩家自己点进来的分享
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            return;
        }

        if (GlobalVar.getShareControl() == 6) {
            this.showRewardedVideoAd(index + 100, successCallback, failCallback);
            return;
        }

        let block = cc.find("Canvas/BlockNode");
        if (cc.isValid(block)) {
            console.log("禁止点击1秒");
            block.active = true;
            setTimeout(function () {
                block.active = false;
            }, 1000);
        }

        let material = this.getRandomMaterial(index);
        if (!material) {
            console.log("material not found");
            material = this.getRandomMaterial(0);
            if (!material) {
                return;
            }
        }
        this.reportShareMaterial(material.materialID);

        let str = "materialID=" + material.materialID;
        str += "&from_openid=" + GlobalVar.me().loginData.getLoginReqDataAccount();
        let self = this;
        if (this.getShareNeedClickTime() != 0 && this.curShowFunc) {
            this.setOffShowListener(this.curShowFunc);
            this.curShowFunc = null;
        }
        let alreadShowTips = false;
        let onShowFunc = function (res) {
            let time = self.getShareNeedClickTime();
            if (res.query['share_time'] == time) {
                if (!res.shareTicket) {
                    console.log("沒有分享到群");
                    self.showToast(notShareInGropTips || i18n.t('label.4000320'), true, true, "分享", "取消", function () {
                        self.shareNeedClick(index, successCallback, failCallback, strTips, successTips, failTips, notShareInGropTips)
                    });
                    self.setOffShowListener(onShowFunc);
                    return;
                }
                self.getShareInfo(res.shareTicket, function (groupInfo) {
                    let shareData = {
                        game_id: GAME_ID,
                        openid: GlobalVar.me().loginData.getLoginReqDataAccount(),
                        encryptedData: groupInfo.encryptedData,
                        iv: groupInfo.iv,
                    }
                    self.request(URL_SHARE, shareData, function (data) {
                        let needDiffGroup = self.shareSetting.shareNeedDiffGroup;
                        if (needDiffGroup && !parseInt(data.data.diffGId)) {
                            self.setOffShowListener(onShowFunc);
                            self.curShowFunc = null;
                            failCallback && failCallback();
                            self.showToast(failTips || i18n.t('label.4000310'), true, false, "知道了", null, function () {
                                self.shareNeedClick(index, successCallback, failCallback, strTips, successTips, failTips, notShareInGropTips)
                            });
                        }
                        if (!needDiffGroup || (data.ret == 0 && !!parseInt(data.data.diffGId))) {
                            if (!!successCallback) {
                                successCallback();
                                self.showToast(successTips || i18n.t('label.4000308'));
                                self.setShareNeedClickTime(0);
                                self.setOffShowListener(onShowFunc);
                                self.curShowFunc = null;
                            }
                        } else {
                            console.log("server ret = ", data.ret);
                        }
                    })
                })
            } else if (!alreadShowTips) {
                self.showToast(strTips || i18n.t('label.4000311'), true);
                alreadShowTips = true;
            }
        };
        this.curShowFunc = onShowFunc;

        let curTime = new Date().getTime();
        this.setShareNeedClickTime(curTime);
        str += "&share_time=" + curTime;

        this.setOnShowListener(onShowFunc);

        wx.shareAppMessage({
            title: material.content,
            imageUrl: material.cdnurl,
            query: str,
        });
    },

    shareInvite: function (index, param) {
        // 邀请分享
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            return;
        }

        let material = this.getRandomMaterial(index);
        if (!material) {
            console.log("material not found");
            return;
        }

        let str = "materialID=" + material.materialID;
        // 若有param传来，则拼接字符串，作为query分享出去
        // 这样别人通过分享打开游戏时就会带query作为启动参数
        // 就可以通过启动参数判断玩家被谁所邀请
        if (param) {
            str += "&from_serverid=" + param.fromServerID || "";
            str += "&from_openid=" + param.fromOpenID || "";
            str += "&from_btn=" + param.fromBtn || "";
            this.showLog("分享str=", str);
        }

        wx.shareAppMessage({
            title: material.content,
            imageUrl: material.cdnurl,
            query: str,
        });
    },

    setOnShowListener: function (showFunc) {
        if (cc.sys.platform === cc.sys.WECHAT_GAME && !!showFunc) {
            this._onShowListener.push(showFunc);
            wx.onShow(showFunc);
        }
    },
    setOffShowListener: function (offFunc) {
        if (cc.sys.platform === cc.sys.WECHAT_GAME && !!offFunc) {
            let index = this._onShowListener.indexOf(offFunc);
            if (index > -1) {
                this._onShowListener.splice(index, 1);
            }
            wx.offShow(offFunc);
        }
    },

    setOnHideListener: function (hideFunc) {
        if (cc.sys.platform === cc.sys.WECHAT_GAME && !!hideFunc) {
            this._onHideListener.push(hideFunc);
            wx.onHide(hideFunc);
        }
    },
    setOffHideListener: function (offFunc) {
        if (cc.sys.platform === cc.sys.WECHAT_GAME && !!offFunc) {
            let index = this._onHideListener.indexOf(offFunc);
            if (index > -1) {
                this._onHideListener.splice(index, 1);
            }
            wx.offHide(offFunc);
        }
    },
    removeAllShowHideListener: function () {
        for (let i in this._onShowListener) {
            wx.offShow(this._onShowListener[i]);
        }
        this._onShowListener = [];
        for (let i in this._onHideListener) {
            wx.offHide(this._onHideListener[i]);
        }
        this._onHideListener = [];
    },

    setOnHideTime: function (time) {
        this._onHideTime = time;
        console.log("record hideTime:", time);
    },
    getOnHideTime: function () {
        let time = this._onHideTime;
        this._onHideTime = 0;
        console.log("get hideTime:", time);
        return time;
    },
    setOnShowTime: function (time) {
        this._onShowTime = time;
        console.log("record showTime:", time);
    },
    getOnShowTime: function () {
        let time = this._onShowTime;
        this._onShowTime = 0;
        console.log("get showTime:", time);
        return time;
    },
    setShareNeedClickTime: function (time) {
        this._shareNeedClickTime = time;
    },
    getShareNeedClickTime: function () {
        return this._shareNeedClickTime;
    },

    getShareInfo: function (shareTicket, successCallback, failCallback) {
        // 获取群信息
        let self = this;
        wx.getShareInfo({
            shareTicket: shareTicket,
            success: res => {
                GlobalVar.me().shareTicket = shareTicket;
                self.showLog("getShareInfo success:", res);
                console.log("getShareInfo success:", res);
                if (!!successCallback) {
                    successCallback(res);
                }
            },
            fail: res => {
                self.showLog("getShareInfo fail:", res);
                console.log("getShareInfo fail:", res);
                if (!!failCallback) {
                    failCallback(res);
                }
            }
        });
    },

    setWithShareTicket: function (onOff, successCallback, failCallback) {
        // 开启或关闭分享到群时，时候回传shareTicket
        let self = this;
        wx.updateShareMenu({
            withShareTicket: onOff,
            success: res => {
                self.showLog("showMenu success :", res);
                if (!!successCallback) {
                    successCallback(res);
                }
            },
            fail: res => {
                self.showLog("showMenuFail :", res);
                if (!!failCallback) {
                    failCallback(res || "");
                }
            }
        });
    },

    androidPayment: function (amount, productID, productName, serverID, successCallback, failCallback) {
        // 支付
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            return;
        }
        let self = this;
        let payData = {
            game_id: GAME_ID,
            openid: GlobalVar.me().loginData.getLoginReqDataAccount(),
            game_role_id: GlobalVar.me().roleID,
            amount: amount,
            product_id: productID,
            product_name: productName,
            server_id: serverID,
        }
        self.request(URL_ANDROID_PAY, payData, function (data) {
            // 支付向服务器请求
            if (data.ret == 0) {
                if (successCallback) {
                    successCallback(data.data);
                }
            } else if (data.ret == 1) {
                self.showLog("amout = ", amount, "  productName = ", productName)
                // 当服务器返回-1时，会回传数据供调用微信单的米大师支付充值虚拟货币
                wx.requestMidasPayment({
                    mode: "game",
                    env: data.data.payenv,
                    offerId: data.data.payid,
                    currencyType: "CNY",
                    platform: "android",
                    buyQuantity: amount * 10,
                    zoneId: "1",
                    success: res => {
                        self.showLog("requestMidasPayment success:", res);
                        // 如果米大师充值成功，则再次调用支付来付款
                        self.androidPayment(amount, productID, productName, serverID, successCallback, failCallback);
                    },
                    fail: res => {
                        self.showLog("requestMidasPayment fail:", res);
                    },
                })
            } else if (data.ret == 2) {
                self.showLog("balance_lack, errMsg:", data);
            }
        }, function (data) {
            self.showLog("fail")
            if (failCallback) {
                failCallback(data);
            }
        })
    },

    iosPayment: function (amount, productID, productName, serverID, successCallback, failCallback) {
        // 支付
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            return;
        }
        let self = this;
        let payData = {
            game_id: GAME_ID,
            openid: GlobalVar.me().loginData.getLoginReqDataAccount(),
            game_role_id: GlobalVar.me().roleID,
            amount: amount,
            product_id: productID,
            product_name: productName,
            server_id: serverID,
        }
        self.request(URL_IOS_PAY, payData, function (data) {
            if (data.ret == 0) {
                console.log("requestData", data.data);
                let payid = data.data.payid;
                self.getPayInfo(payid, function (payInfo) {
                    if (payInfo.length > 0) {
                        console.log("payInfo", payInfo);
                        let index = Math.floor(Math.random() * payInfo.length);
                        console.log("appid:", payInfo[index].appid, "  path:", payInfo[index].path, "  index:", index);
                        self.navigateToMiniProgram(payInfo[index].appid, payInfo[index].path, data.data, function (data) {
                            if (!!successCallback) {
                                successCallback(data);
                            }
                        })
                    } else {
                        return;
                    }
                })
            } else if (data.ret == -1) {
                self.showLog("errmsg:", data.msg);
            }
        })
    },

    getPayInfo: function (payID, successCallback) {
        // 获取跳转信息
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            return;
        }
        let self = this;
        let url = URL_GET_PAYINFO.replace("%d", payID);
        self.request(url, null, function (payInfo) {
            if (!!successCallback) {
                successCallback(payInfo);
            }
        }, null, GET_METHOD, GET_HEADER);
    },

    // 跳转到小程序
    navigateToMiniProgram: function (appId, path, extraData, successCallback, failCallback, completeCallback, envVersion) {
        wx.navigateToMiniProgram({
            appId: appId,
            path: path,
            extraData: extraData,
            envVersion: envVersion || "release",
            success: successCallback,
            fail: failCallback,
            complete: completeCallback
        })
    },

    createRoll: function (successCallback) {
        let self = this;
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            self.getUserInfo(function (userInfo) {
                if (!!userInfo) {
                    if (!!successCallback) {
                        successCallback(userInfo.nickName, userInfo.avatarUrl);
                    }
                }
            }, function () {
                if (!!successCallback) {
                    successCallback("", "");
                }
            });
        }
    },

    judgeInvite: function (successCallback) {
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            return;
        }
        let self = this;
        let launchInfo = wx.getLaunchOptionsSync();
        // self.showLog("launcinfo", launchInfo);
        console.log("判断邀请！", launchInfo);
        if (launchInfo) {
            // 判断启动参数, 启动参数有form_serverid、from_openid、和from_btn
            // 就是点了别人的邀请进来的，上报邀请信息
            // if (launchInfo.shareTicket) {
            //     GlobalVar.me().shareTicket = launchInfo.shareTicket;
            // }
            if (launchInfo.query['from_serverid'] && launchInfo.query['from_openid'] && launchInfo.query['from_btn']) {
                let inviteData = {
                    game_id: GAME_ID,
                    openid: GlobalVar.me().loginData.getLoginReqDataAccount(),
                    avatar: GlobalVar.me().loginData.getLoginReqDataAvatar(),
                    from_serverid: launchInfo.query['from_serverid'],
                    from_openid: launchInfo.query['from_openid'],
                    from_btn: launchInfo.query['from_btn'],
                };
                console.log("向服务器上报邀请消息:", inviteData);
                self.request(URL_INVITE, inviteData, function (data) {
                    if (data.ret !== 0) return;
                    if (!!successCallback) {
                        successCallback(data.data);
                    }
                });
            }
        }
    },

    getInviteUserList: function (btn, successCallback) {
        // 向服务器请求邀请成功的用户信息
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            return;
        }
        let self = this;
        let inviteListData = {
            game_id: GAME_ID,
            openid: GlobalVar.me().loginData.getLoginReqDataAccount(),
            server_id: GlobalVar.me().loginData.getLoginReqDataServerID(),
            btn: btn,
        };
        // console.log("邀请列表的请求数据", inviteListData);
        self.request(URL_INVITE_LIST, inviteListData, function (data) {
            if (data.ret !== 0) return;
            if (!!successCallback) {
                successCallback(data.data);
            }
        });
    },

    getAlreadyShareTimes: function (successCallback) {
        // 获取总分享次数
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            return;
        }
        let self = this;
        let shareTotalData = {
            game_id: GAME_ID,
            openid: GlobalVar.me().loginData.getLoginReqDataAccount(),
        };
        self.request(URL_SHARE_TOTAL, shareTotalData, function (data) {
            if (data.ret !== 0) return;
            if (!!successCallback) {
                successCallback(data.data);
            }
        });
    },

    getMaterials: function (successCallback) {
        // 获取分享文案
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            return;
        }
        let self = this;
        let url = URL_GET_MATERIALS.replace("%d", APP_ID);
        this._defaultMaterial = [{
                cdnurl: "https://cdn.phonecoolgame.com/wxgame/hezi/back/wpjz-003.jpg",
                content: "超经典飞行射击游戏，王牌出击等你来战！",
                materialID: "138",
            }, ],
            self.request(url, null, function (data) {
                if (data.ecode !== 0) {
                    self.showLog("getMaterials error, ecode = ", data.ecode);
                    return;
                }
                self._Materials = data.data;
                if (!!successCallback) {
                    successCallback(data.data);
                }
            }, null, GET_METHOD, GET_HEADER);
    },
    getRandomMaterial: function (index) {
        if (typeof index != "number") {
            console.log("文案编号不是数字");
        }
        let materials = (this._Materials && this._Materials[index]) || this._defaultMaterial;
        let ranNum = Math.floor(Math.random() * materials.length);
        return materials[ranNum] || materials[0];
    },

    reportShareMaterial: function (materialID, successCallback, needReportUid = true) {
        // 上报分享的文案
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            return;
        }
        let self = this;
        let url = URL_REPORT_SHARE.replace("%d", APP_ID).replace("%d", materialID);
        if (needReportUid) {
            url = url + "&uid=" + GlobalVar.me().loginData.getLoginReqDataAccount();
        }
        self.request(url, null, function (data) {
            if (data.ecode !== 0) {
                self.showLog("reportShare error, ecode = ", data.ecode);
                return;
            }
            self.showLog("reportShare success, materialID = ", materialID);
            if (!!successCallback) {
                successCallback(data.data);
            }
        }, null, GET_METHOD, GET_HEADER)
    },
    reportClickMaterial: function (materialID, successCallback, needReportUid = true) {
        // 上报被点击的文案
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            return;
        }
        let self = this;
        let url = URL_REPORT_CLICK.replace("%d", APP_ID).replace("%d", materialID);
        if (needReportUid) {
            url = url + "&uid=" + GlobalVar.me().loginData.getLoginReqDataAccount();
        }
        self.request(url, null, function (data) {
            if (data.ecode !== 0) {
                self.showLog("reportClick error, ecode = ", data.ecode);
                return;
            }
            self.showLog("reportClick success, materialID = ", materialID);
            if (!!successCallback) {
                successCallback(data.data);
            }
        }, null, GET_METHOD, GET_HEADER)
    },
    reportVideoStart: function (videoPointID, needReportUid = false) {
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            return;
        }
        let self = this;
        let url = URL_REPORT_VIDEO_START.replace("%d", videoPointID);
        if (needReportUid) {
            url = url + "&uid=" + GlobalVar.me().loginData.getLoginReqDataAccount();
        }
        self.request(url, null, function (data) {
            if (data.ecode !== 0) {
                console.log("videoPoint:" + videoPointID + " start report fail: ecode =", data.ecode);
                return;
            }
            console.log("videoPoint:" + videoPointID + " start report success")
        }, null, GET_METHOD, GET_HEADER);
    },
    reportVideoEnd: function (videoPointID, needReportUid = false) {
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            return;
        }
        let self = this;
        let url = URL_REPORT_VIDEO_END.replace("%d", videoPointID);
        if (needReportUid) {
            url = url + "&uid=" + GlobalVar.me().loginData.getLoginReqDataAccount();
        }
        self.request(url, null, function (data) {
            if (data.ecode !== 0) {
                console.log("videoPoint:" + videoPointID + " end report fail: ecode =", data.ecode);
                return;
            }
            console.log("videoPoint:" + videoPointID + " end report success")
        }, null, GET_METHOD, GET_HEADER);
    },

    getServerList: function (version, userID, successCallback, notFirst) {
        notFirst = notFirst || false;
        let url = URL_SERVER_LIST.replace("%d", version).replace("%d", userID);
        let self = this;
        this.request(url, null, function (data) {
            console.log("getServerList success:", data);
            StoreageData.setLocalServerListData(data);
            if (!!successCallback) {
                successCallback(data);
            }
        }, function (data) {
            console.log("getServerList fail:", data);
            if (notFirst) {
                let localData = StoreageData.getLocalServerListData();
                if (localData) {
                    !!successCallback && successCallback(localData);
                } else {
                    GlobalVar.comMsg.showMsg("拉取服务器失败，请检查网络");
                    self.getServerList(version, userID, successCallback, true);
                }
            } else {
                GlobalVar.comMsg.showMsg("拉取服务器失败，请检查网络");
                self.getServerList(version, userID, successCallback, true);
            }
        }, GET_METHOD, GET_HEADER);
    },

    getMyServer: function (version, userID, successCallback, failCallback) {
        let url = URL_GET_MY_SERVER.replace("%d", version).replace("%d", userID);
        let self = this;
        this.request(url, null, function (data) {
            successCallback && successCallback(data);
        }, function (data) {
            failCallback && failCallback(data);
        }, GET_METHOD, GET_HEADER);
    },

    getLaunchNotice: function (successCallback) {
        this.request(URL_GET_LAUNCH_NOTICE, null, function (data) {
            successCallback && successCallback(data);
        })
    },

    reportServerLogin: function (userID, serverID, time) {
        let self = this;
        self.showLog("userID = ", userID, "  serverID = ", serverID, " time = ", time);
        let sign = md5.MD5(KEY_REPROT_SERVER_LOGIN.replace("$time.", time).replace("$userid.", userID));
        self.showLog("md5加密后的sign:", sign);
        let url = URL_REPROT_SERVER_LOGIN.replace("%d", userID).replace("%d", serverID).replace("%d", time).replace("%sign", sign);
        self.showLog("连接后的请求url:", url);
        this.request(url, null, function (data) {
            self.showLog("reportServerLogin success:", data);
        }, function (data) {
            self.showLog("reportServerLogin fail:", data);
        });
    },

    requestEndlessWorldRanking: function (serverID, roleID, pageIndex, pageCount, successCallback, failCallback) {
        let self = this;
        let url = URL_ENDLESS_WORLD_RANKING.replace("%d", serverID).replace("%d", roleID).replace("%d", pageIndex).replace("%d", pageCount);
        this.request(url, null, function (data) {
            if (data.ret !== 0) {
                self.showLog("getEndless error, ecode = ", data.ret);
                return;
            }
            if (!!successCallback) {
                successCallback(data.data);
            }
        }, null, GET_METHOD, GET_HEADER);
    },
    requestEndlessFriendRanking: function (pageIndex, pageCount) {
        let openDataContext = wx.getOpenDataContext();
        let SET_PAGE_COUNT = 0;
        openDataContext.postMessage({
            id: SET_PAGE_COUNT,
            count: pageCount,
            pageIndex: pageIndex,
        });

        let GET_FRIENDS_RANKLIST = 1;
        openDataContext.postMessage({
            id: GET_FRIENDS_RANKLIST,
        });
    },
    requestEndlessFriendRankingNext: function () {
        let openDataContext = wx.getOpenDataContext();
        let GET_FRIEND_RANK_NEXT = 2;
        openDataContext.postMessage({
            id: GET_FRIEND_RANK_NEXT,
        });
    },
    requestEndlessFriendRankingBefore: function () {
        let openDataContext = wx.getOpenDataContext();
        let GET_FRIEND_RANK_BEFORE = 3;
        openDataContext.postMessage({
            id: GET_FRIEND_RANK_BEFORE,
        });
    },
    requestBeyoudRank: function (myScore, isFirst) {
        let openDataContext = wx.getOpenDataContext();
        let ON_MSG_DRAW_FRIEND_AVATAR_BY_SCORE = 4;
        openDataContext.postMessage({
            id: ON_MSG_DRAW_FRIEND_AVATAR_BY_SCORE,
            beyoundGap: myScore / 10,
            myScore: myScore,
            isFirst: isFirst,
        });
    },
    resetRankingData: function () {
        let openDataContext = wx.getOpenDataContext();
        let ON_MSG_RESET_RANK_GET_DATA = 7;
        openDataContext.postMessage({
            id: ON_MSG_RESET_RANK_GET_DATA
        });
    },

    requestIosRechageLockState: function (level, combatPoint, createTime, successCallback) {
        let self = this;
        let lockState = true;
        let url = URL_GETIOS_RECHARGE_LOCKSTATE.replace("%d", level).replace("%d", combatPoint).replace("%d", createTime);
        this.request(url, null, function (data) {
            console.log("获得ios支付锁状态ret：", data.ret);
            if (data.ret == 0) {
                lockState = false;
            }
            if (!!successCallback) {
                successCallback(lockState);
            }
        }, null, GET_METHOD, GET_HEADER);

        return lockState;
    },

    requestGetMoreFunInfo: function (successCallback) {
        let url = URL_GET_MORE_INFO.replace("%d", APP_ID).replace("%d", GlobalVar.isIOS ? 1 : 0);
        this.request(url, null, function (data) {
            if (!!successCallback) {
                successCallback(data);
            }
        });
    },

    wxBversionLess: function (version) {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            let bVersion = wx.getSystemInfoSync().SDKVersion;
            var vs2vn = (version) => {
                return parseInt(version.split(".").join("").slice(0, 3));
            }
            return vs2vn(bVersion) < vs2vn(version);
        }
        return true;
    },

    createRewardedVideoAd: function () {
        if (this.wxBversionLess("2.0.4")) {
            StoreageData.setShareTimesWithKey("rewardedVideoLimit", 99);
            return;
        }
        if (this._rewardedVideoAd) {
            console.log("视频组件已存在，无需重新创建");
            return;
        }
        this._rewardedVideoAd = wx.createRewardedVideoAd({
            adUnitId: VIDEOUNIT_ID
        });
        StoreageData.cleanShareTimesWithKey("rewardedVideoLimit", 99);
        let self = this;
        this._rewardedVideoAd.onClose(res => {
            // 用户点击了【关闭广告】按钮
            // 小于 2.1.0 的基础库版本，res 是一个 undefined
            StoreageData.cleanShareTimesWithKey("rewardedVideoLimit", 99);
            GlobalVar.soundManager().resumeBGM();
            if (res && res.isEnded || res === undefined) {
                console.log("看广告成功，获得奖励");
                // StoreageData.setShareTimesWithKey("todayVideoPlayTimes", 99);
                self._videoAdSuccessCallback && self._videoAdSuccessCallback();
                self.reportVideoEnd(self._currentVideoPointID);
            } else {
                // 播放中途退出
                console.log("退出广告播放，无奖励");
                self.showToast("完整看完视频才能获得奖励" || i18n.t('label.4000310'), true, false, "知道了");
                self._videoAdCancelCallback && self._videoAdCancelCallback();
            }
            self._videoAdSuccessCallback = null
            self._videoAdCancelCallback = null;
        })
        this._rewardedVideoAd.onError(res => {
            StoreageData.setShareTimesWithKey("rewardedVideoLimit", 99);
            console.log("广告组件拉取广告异常, errCode:", res.errCode, "  errMsg:", res.errMsg);
        })
        this._rewardedVideoAd.load().catch(err => {
            console.log("(create onload catch)拉取广告失败：", err);
            StoreageData.setShareTimesWithKey("rewardedVideoLimit", 99);
        });;
    },

    /**
     * @param {number} videoPointID 上报的视频点ID
     * @param {Function} successCallback 完整看完视频的奖励回调
     * @param {Function} cancelCallback 取消看视频的回调，可以用来执行解除窗口锁之类的逻辑，同时转为分享时，也会成为分享的失败回调
     * @param {boolean} needTurnToShare 视频失败是否要转到分享
     * @param {boolean} needTodayLimit 是否有当日限制
     */
    showRewardedVideoAd: function (videoPointID, successCallback, cancelCallback, needTurnToShare = true, needTodayLimit = false) {
        if (cc.sys.platform != cc.sys.WECHAT_GAME) {
            return;
        }
        let self = this;
        let turnToShare = function () {
            if (needTurnToShare && GlobalVar.getShareControl() == 1) {
                self.shareNormal(videoPointID - 100, successCallback, cancelCallback);
            } else {
                console.log("安全模式或不转为分享的情况下无法转为分享");
                cancelCallback && cancelCallback();
                GlobalVar.comMsg.showMsg(i18n.t('label.4000321'));
            }
        }

        if (this.wxBversionLess("2.0.4")) {
            console.log("版本库低于2.0.4，没有创建视频组件");
            turnToShare();
            return;
        }
        if (!this._rewardedVideoAd) {
            StoreageData.setShareTimesWithKey("rewardedVideoLimit", 99)
            console.log("视频组件未创建成功");
            turnToShare();
            return;
        }
        if (!!StoreageData.getShareTimesWithKey("rewardedVideoLimit", 99)) {
            console.log("因为拉取视频失败而认为今日视频已达到上限");
            turnToShare();
            return;
        }

        if (needTodayLimit && StoreageData.getShareTimesWithKey("todayVideoPlayTimes", 99) >= this.shareSetting.todayVideoMax) {
            console.log("今日视频次数已达配置上限，转为分享");
            turnToShare();
            return;
        }

        let block = cc.find("Canvas/BlockNode");
        if (cc.isValid(block)) {
            console.log("禁止点击3秒");
            block.active = true;
            setTimeout(function () {
                block.active = false;
            }, 3000);
        }

        let videoAd = this._rewardedVideoAd;

        this._videoAdSuccessCallback = function () {
            successCallback && successCallback();
            needTodayLimit && StoreageData.setShareTimesWithKey("todayVideoPlayTimes", 99);
            needTodayLimit && console.log("特定点视频观看次数:", StoreageData.getShareTimesWithKey("todayVideoPlayTimes", 99));
        }
        this._videoAdCancelCallback = cancelCallback;
        videoAd.load()
            .then(() => {
                self.reportVideoStart(videoPointID);
                self._currentVideoPointID = videoPointID;
                GlobalVar.soundManager().pauseBGM();
                videoAd.show().catch(err => {
                    console.log("拉取广告失败：", err);
                    StoreageData.setShareTimesWithKey("rewardedVideoLimit", 99);
                    turnToShare();
                });;
            })
            .catch(err => {
                console.log("(onload catch)拉取广告失败：", err);
                StoreageData.setShareTimesWithKey("rewardedVideoLimit", 99);
            });
    },

    canShowRewardVideo: function (needDayLimit = false) {
        if (!GlobalVar.getVideoAdSwitch() ||
            StoreageData.getShareTimesWithKey("rewardedVideoLimit", 99) ||
            (needDayLimit && StoreageData.getShareTimesWithKey("todayVideoPlayTimes", 99) >= this.shareSetting.todayVideoMax)) {
            return false;
        }
        return true;
    },
    canShowShare: function () {
        if (GlobalVar.getShareControl() == 1) {
            return true;
        }
        return false;
    },

    createBannerAd: function (id) {
        let systemInfo = wx.getSystemInfoSync();
        let banner = wx.createBannerAd({
            adUnitId: id,
            style: {
                left: 0,
                top: systemInfo.screenHeight,
                width: systemInfo.screenWidth,
            }
        })
        banner.onResize(function () {
            banner.style.top = systemInfo.screenHeight - banner.style.realHeight - ((GlobalVar.isIOS && GlobalFunc.isAllScreen()) ? 30 : 0);
        });
        banner.onError(res => {
            console.log("Banner广告组件拉取广告异常:", res);
        })
        return banner;
    },

    createBannerAdList: function () {
        if (this.wxBversionLess("2.0.4")) {
            console.log("版本库低于2.0.4，不能创建Banner组件");
            GlobalVar.bannerOpen = false;
            return;
        }
        if (this._bannerAdList.length > 0) {
            return;
        }
        let arrBannerIDList = BANNERUNIT_ID_LIST;
        // let systemInfo = wx.getSystemInfoSync();
        for (let i = 0; i < arrBannerIDList.length; i++) {
            let pBanner = this.createBannerAd(arrBannerIDList[i]);
            // wx.createBannerAd({
            //     adUnitId: arrBannerIDList[i],
            //     style: {
            //         left: 0,
            //         top: systemInfo.screenHeight,
            //         width: systemInfo.screenWidth,
            //     }
            // });
            // pBanner.onResize(function () {
            //     pBanner.style.top = systemInfo.screenHeight - pBanner.style.realHeight - ((GlobalVar.isIOS && GlobalFunc.isAllScreen()) ? 30 : 0);
            // });
            // pBanner.onError(res => {
            //     console.log("Banner广告组件拉取广告异常:", res);
            // })
            this._bannerAdList.push(pBanner);
            this._bannerTimeCounts[pBanner.adUnitId] = 0;
        }
        this._bannerAdList.sort(function (a, b) {
            return Math.random() - 0.5;
        })
    },

    showBannerAdNew: function (onResizeCallback) {
        if (this.wxBversionLess("2.0.4")) {
            console.log("版本库低于2.0.4，不能创建Banner组件");
            GlobalVar.bannerOpen = false;
            return;
        }
        if (this._bannerAdList.length == 0) {
            console.log("没有创建成功的banner");
            return;
        }
        if (this._bannerShowState) {
            return;
        }
        this._bannerShowState = true;
        if (this._alternateIndex >= this._bannerAdList.length) {
            this._alternateIndex = 0;
            this._bannerAdList.sort(function (a, b) {
                return Math.random() - 0.5;
            })
        }

        let pBanner = this._bannerAdList[this._alternateIndex];

        StoreageData.setLastBannerShowTime();
        pBanner.show().catch(err => {
            console.log("banner展示出现异常:", err)
            StoreageData.resetLastBannerShowTime()
        });
        console.log("show banner:", pBanner.adUnitId);
        onResizeCallback && onResizeCallback(pBanner.style.realHeight + ((GlobalVar.isIOS && GlobalFunc.isAllScreen()) ? 30 : 0));
    },

    hideBannerAdNew: function () {
        if (this._bannerAdList.length == 0) {
            console.log("没有创建成功的banner");
            return;
        }
        if (!this._bannerShowState) {
            return;
        }
        let pBanner = this._bannerAdList[this._alternateIndex];
        pBanner.hide();
        let showTime = StoreageData.getBannerTimeCount();
        this._bannerTimeCounts[pBanner.adUnitId] += showTime;
        console.log("banner" + pBanner.adUnitId + "总展示时间：", this._bannerTimeCounts[pBanner.adUnitId]);

        if (this._bannerTimeCounts[pBanner.adUnitId] >= this._bannerExchangeTime) {
            this._bannerAdList[this._alternateIndex] = this.createBannerAd(pBanner.adUnitId);
            this._bannerTimeCounts[pBanner.adUnitId] = 0;
            pBanner.destroy();
            pBanner = this._bannerAdList[this._alternateIndex];
            console.log("刷新banner:", pBanner.adUnitId);
        }

        this._alternateIndex++;
        this._bannerShowState = false;
    },

    submitUserData: function (keyName, data, successCallback, failCallback) {
        let self = this;
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            self.showLog("not in wechat");
            return;
        }

        let value = {};
        value.wxgame = {};
        value.wxgame[keyName] = data;
        value = JSON.stringify(value);

        let _kvData = new Array();
        _kvData.push({
            key: keyName,
            value: value,
        });
        // _kvData.push({ key: 'score', value: score }, { key: 'timestamp', value: time });
        self.showLog("_kvData = ", _kvData);
        wx.setUserCloudStorage({
            KVDataList: _kvData,
            success: res => {
                self.showLog("update socre success:", res);
                return true;
            },
            fail: res => {
                // do something
                self.showLog("update score fail:", res);
                return false;
            }
        })
    },

    getUserCloudStorage: function (keyName, successCallback, failCallback) {
        let self = this;
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            self.showLog("not in wechat");
            return;
        }
    },

    deviceShock: function () {
        var self = this;
        if (cc.sys.platform !== cc.sys.WECHAT_GAME || StoreageData.getVibrateSwitch() == 'off') {
            //this.showLog('platform is not wechat, can not shock device');
            return;
        } else {
            wx.vibrateShort({
                success: function () {
                    self.showLog('short shock success');
                },
                fail: function () {
                    self.showLog("short shock fail");
                }
            })
        }
    },

    deviceKeepScreenOn: function () {
        var self = this;
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            this.showLog('platform is not wechat, device keep failed');
            return;
        } else {
            wx.setKeepScreenOn({
                keepScreenOn: true,
                success: function () {
                    self.showLog('device keep success');
                },
                fail: function () {
                    self.showLog("device keep failed");
                }
            })
        }
    },

    setFramesPerSecond: function (fps) {
        fps = typeof fps !== 'undefined' ? fps : 60;
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.setPreferredFramesPerSecond(60);
        }
    },

    netWorkStatusChange: function (callback) {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.onNetworkStatusChange(function (res) {
                console.log(res.isConnected);
                console.log(res.networkType);
                //GlobalVar.networkManager().checkConnection();
                if (!!callback) {
                    callback();
                }
            })
        }
    },

    getNetWorkStatus: function (callback) {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.getNetworkType({
                success: function (res) {
                    let networkType = res.networkType;
                    if (!!callback) {
                        callback(networkType);
                    }
                },
                fail: function () {
                    if (!!callback) {
                        callback('none');
                    }
                }
            })
        } else {
            if (!!callback) {
                callback('none');
            }
        }
    },

    feedBack: function (left, top, width, height) {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            if (!this.checkWeChatAPI(0, '2.1.2')) {
                return;
            }

            let feedbackButton = wx.createFeedbackButton({
                type: 'text',
                text: '',
                style: {
                    left: left,
                    top: top,
                    width: width,
                    height: height,
                    lineHeight: 0,
                    backgroundColor: '#333333',
                    color: '#ffffff',
                    textAlign: 'center',
                    fontSize: 16,
                    borderRadius: 4
                }
            })
            return feedbackButton;
        }
        return null;
    },

    assetsCacheCount: 0,
    wxApiCleanAllAssets: function (callback) {
        let self = this;
        self.showLog("cleanAllAssets Start");
        var fs = wx.getFileSystemManager();
        fs.getSavedFileList({
            success: function (res) {
                var list = res.fileList;
                if (list) {
                    self.assetsCacheCount = list.length;
                    if (self.assetsCacheCount > 0) {
                        for (var i = 0; i < list.length; i++) {
                            var path = list[i].filePath;
                            fs.unlink({
                                filePath: list[i].filePath,
                                success: function () {
                                    // cc.log('Removed local file ' + path + ' successfully!');
                                    self.assetsCacheCount--;
                                    if (self.assetsCacheCount == 0 && !!callback) {
                                        callback();
                                    }
                                },
                                fail: function () {
                                    // cc.warn('Failed to remove file(' + path + '): ' + res ? res.errMsg : 'unknown error');
                                    self.assetsCacheCount--;
                                    if (self.assetsCacheCount == 0 && !!callback) {
                                        callback();
                                    }
                                }
                            });
                        }
                    } else {
                        if (!!callback) {
                            callback();
                        }
                    }
                }
            },
            fail: function () {
                // cc.warn('Failed to list all saved files: ' + res ? res.errMsg : 'unknown error');
                if (!!callback) {
                    callback();
                }
            }
        });
    },

    loadingClearCache: function (callback, showTitle) {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            let self = this;
            console.log('clear cache');
            wx.showLoading({
                title: showTitle || '正在清理旧版本',
                mask: true,
                complete() {
                    self.wxApiCleanAllAssets(function () {
                        StoreageData.setClearCache(false);
                        wx.hideLoading();
                        if (!!callback) {
                            callback();
                        } else {
                            if (!self.checkWeChatAPI(0, '1.9.90')) {
                                return;
                            }
                            let updateManager = wx.getUpdateManager();
                            updateManager.applyUpdate();
                        }
                    })
                }
            })
        }
    },

    updateVersion: function () {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            let self = this;

            if (!this.checkWeChatAPI(0, '1.9.90')) {
                return;
            }

            let updateManager = wx.getUpdateManager();

            updateManager.onCheckForUpdate(function (res) {
                // 请求完新版本信息的回调
                console.log(res.hasUpdate);
            })

            updateManager.onUpdateReady(function () {
                // 新版本下载成功
                console.log('update success');
                wx.showModal({
                    title: '更新提示',
                    content: '新版本已经准备好，是否重启应用？',
                    showCancel: false,
                    success(res) {
                        if (res.confirm) {
                            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                            self.loadingClearCache();
                        } else if (res.cancel) {
                            StoreageData.setClearCache(true);
                        }
                    }
                })
            })

            updateManager.onUpdateFailed(function () {
                // 新版本下载失败
                console.log('update failed');
                wx.showModal({
                    title: '更新提示',
                    content: '新版本下载失败，请检查当前网络设置',
                    showCancel: false,
                    success(res) {
                        if (res.confirm) {
                            updateManager.applyUpdate();
                        }
                    }
                })
            })
        }
    },

    compareVersion: function (v1, v2) {
        v1 = v1.split('.')
        v2 = v2.split('.')
        const len = Math.max(v1.length, v2.length)

        while (v1.length < len) {
            v1.push('0')
        }
        while (v2.length < len) {
            v2.push('0')
        }

        for (let i = 0; i < len; i++) {
            const num1 = parseInt(v1[i])
            const num2 = parseInt(v2[i])

            if (num1 > num2) {
                return 1
            } else if (num1 < num2) {
                return -1
            }
        }
        return 0
    },

    checkWeChatAPI: function (type, api) {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            let version = wx.getSystemInfoSync().SDKVersion;
            if (this.compareVersion(version, '1.1.1') < 0) {
                wx.showModal({
                    title: '提示',
                    content: '当前微信版本过低，请升级到最新微信版本'
                });
                return false;
            }
            let complete = true;
            switch (type) {
                case 0:
                    if (this.compareVersion(version, api) >= 0) {
                        complete = true;
                    } else {
                        complete = false;
                    }
                    break;
                    // case 1:
                    //     if (wx.canIUse(api)) {
                    //         complete = true;
                    //     } else {
                    //         complete = false;
                    //     }
                    //     break;
                default:
                    complete = false;
                    break;
            }
            if (complete) {
                return true;
            } else {
                wx.showModal({
                    title: '提示',
                    content: '当前微信版本过低，请升级到最新微信版本'
                });
                return false;
            }
        }
        return false;
    },

    pullAdcInfo: function (url, successCallback, failCallback) {
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) return;
        let data = {
            appid: APP_ID,
            logintype: "wx",
            noncestr: GlobalFunc.getRandomString(),
            sex: 0,
            ptform: GlobalFunc.iosOrAndr(),
        }
        this.request(url, data, successCallback, failCallback, 'POST');
    },

    pullAdcExpInfo: function (successCallback, failCallback) {
        this.pullAdcInfo(URL_GET_ADC_EXP, successCallback, failCallback);
    },

    pullAdcFrameInfo: function (successCallback, failCallback) {
        this.pullAdcInfo(URL_GET_ADC_Frame, successCallback, failCallback);
    },

    pullAdcTaskInfo: function (successCallback, failCallback) {
        let data = {
            appid: APP_ID
        }
        this.request(URL_GET_ADC_Task, data, successCallback, failCallback);
    },

    pullAdcTaskCompleteList: function (successCallback, failCallback) {
        let userID = GlobalVar.me().loginData.getLoginReqDataAccount();
        let data = {
            appid: APP_ID,
            uid: userID,
        }
        this.request(URL_GET_ADC_Task_LIST, data, successCallback, failCallback);
    },

    pushAdcTaskCompleteInfo: function (taskId, successCallback, failCallback) {
        let userID = GlobalVar.me().loginData.getLoginReqDataAccount();
        let data = {
            srcid: APP_ID,
            suid: userID,
            tskid: taskId,
        }
        this.request(URL_GET_ADC_Task_COMPLETE, data, successCallback, failCallback);
    },

    taskGoToMiniProgram: function (appid, parm, tskid, successCB, failCB, completeCB) {
        let userID = GlobalVar.me().loginData.getLoginReqDataAccount();
        parm = parm.indexOf('gender') > 0 ? parm : parm + '&gender=' + GlobalFunc.getGender();
        parm = parm.indexOf('tskid') > 0 ? parm : parm + '&tskid=' + tskid;
        parm = parm.indexOf('suid') > 0 ? parm : parm + '&suid=' + userID;
        parm = parm.indexOf('srcid') > 0 ? parm : parm + '&srcid=' + APP_ID;
        if (appid && !this.wxBversionLess("2.2.0")) {
            this.navigateToMiniProgram(appid, parm, null, successCB, failCB, completeCB);
        }
    },

    previewUrlImage: function (url, successCB, failCB, completeCB) {
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) return;
        let temp = [url];
        wx.previewImage({
            // current: this.data.imgalist, // 当前显示图片的http链接    
            urls: temp, // 需要预览的图片http链接列表   
            success: successCB,
            fail: failCB,
            complete: completeCB,
        })
    },
};