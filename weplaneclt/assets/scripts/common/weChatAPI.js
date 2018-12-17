const ResManager = require("ResManager");
const GlobalVar = require('globalvar')
const md5 = require("md5");
const StoreageData = require("storagedata");
const i18n = require('LanguageData');

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
const ADUNIT_ID = "adunit-ba7f540156b29839";

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
const URL_GET_AD_FRAME = "https://cpgc.phonecoolgame.com/adc/getAdFrame?appid=%d&sex=%d";
const URL_GET_BANNER_AD_INFO = "https://cpgc.phonecoolgame.com/adc/getBannerAdInfo?appid=%d";
const URL_GET_LIKE_INFO = "https://cpgc.phonecoolgame.com/adc/getLikeInfo?appid=%d&sex=%d";
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
    },
    shareMessageFlag: false,

    _Materials: null,

    _onHideTime: 0,
    _onShowTime: 0,
    _shareNeedClickTime: 0,

    _rewardedVideoAd: null,
    _videoAdSuccessCallback: null,
    _videoAdCancelCallback: null,

    getShareSuccess: function () {
        let shareSuccess = false;
        let showTime = this.getOnShowTime();
        let hideTime = this.getOnHideTime();
        let shareTimeGap = showTime - hideTime;
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
            setting.shareTimes++;
            StoreageData.setTotalShareTimes();
            setting.shareLowestGap = setting.shareDefaultGap;
        }

        return shareSuccess;
    },

    getShareConfig: function () {
        let self = this;
        let setting = this.shareSetting;
        this.request(URL_SHARE_CONFIG, null, function (data) {
            setting.shareDefaultGap = parseInt(data.shareMinTime);
            setting.shareFailProb = parseInt(data.sharefailprob);
            setting.shareFailReduceGap = parseInt(data.shareReduceTime);
            setting.shareGap = parseInt(data.shareBaseTime);
            setting.shareLowestGap = parseInt(data.shareLowerTime);
            setting.shareNeedDiffGroup = !!parseInt(data.shareNeedDiffGroup)
            setting.shareFailTimes = [3, 5, 7];
            setting.shareFailTimes.push(parseInt(data.shareValue));
            setting.shareTimes = StoreageData.getTotalShareTimes();
            console.log("get share config success, new config:", setting);
        }, null, GET_METHOD, GET_HEADER);
    },

    requestShareOpenState: function (version, successCallback) {
        let url = URL_SHARE_SWITCH.replace("%d", version);
        this.request(url, null, function (data) {
            if (!!successCallback) {
                successCallback(data.showyd);
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
            // console.log("wryyyyyyyyyyyyyyyyyyy")
            wx.login({
                success: function (res) {
                    if (res.code) { //用wx.login返回的Code作为登陆所需参数，向服务器请求登陆
                        let loginData = {
                            game_id: GAME_ID,
                            code: res.code,
                            channel_id: channelID,
                        };
                        // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@")
                        self.request(URL_LOGIN, loginData, function (data) {
                            // 向服务器请求登陆，保存服务器传过来的openid和ticket;
                            if (data.ret !== 0) return;
                            // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                            // wx.setStorageSync('openid', data.data.user_id);
                            // wx.setStorageSync('ticket', data.data.ticket);
                            let user_id = data.data.user_id;
                            let ticket = data.data.ticket;
                            self.getUserInfo(function (userInfo) {
                                // 从微信侧获得玩家的头像地址
                                self.showLog(userInfo);
                                // console.log("获取用户数据成功");
                                let avatarUrl = userInfo.avatarUrl
                                if (!!successCallback) {
                                    successCallback(user_id, ticket, avatarUrl);
                                }
                            }, function (res) {
                                // console.log("请求登陆失败");
                                if (!!successCallback) {
                                    successCallback(user_id, ticket, "");
                                }
                            });
                        });
                    } else {
                        self.showLog('get login code failed！');
                    }
                },
                fail: function () {
                    self.showLog('login error!');
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

    showToast: function (tips) {
        // wx.showToast({  
        //     title: tips
        // })
        tips && GlobalVar.comMsg.showMsg(tips);
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
    shareNormal: function (index, successCallback, failCallback, successTips, failTips) {
        // 普通分享，判断模拟点击
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            return;
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

        let CC_GMAE_ONSHOW_OPEN = this.shareSetting.share;
        if (this.wxBversionLess(this.shareVersion)) {
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
                self.showToast(failTips || i18n.t('label.4000310'));
                failCallback && failCallback();
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

    shareNeedClick: function (index, successCallback, failCallback, strTips, successTips, failTips) {
        // 需要玩家自己点进来的分享
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            return;
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
                    console.log("非点击群内小卡片进入");
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
                            self.showToast(failTips || i18n.t('label.4000310'));
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
            } else if (!alreadShowTips && strTips) {
                self.showToast(strTips);
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
            wx.onShow(showFunc);
        }
    },
    setOffShowListener: function (offFunc) {
        if (cc.sys.platform === cc.sys.WECHAT_GAME && !!offFunc) {
            wx.offShow(offFunc);
        }
    },

    setOnHideListener: function (hideFunc) {
        if (cc.sys.platform === cc.sys.WECHAT_GAME && !!hideFunc) {
            wx.onHide(hideFunc);
        }
    },
    setOffHideListener: function (offFunc) {
        if (cc.sys.platform === cc.sys.WECHAT_GAME && !!offFunc) {
            wx.offHide(offFunc);
        }
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
        console.log("launcinfo", launchInfo);
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
                // console.log("发送消息:", inviteData);
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
        let materials = this._Materials[index];
        let ranNum = Math.floor(Math.random() * materials.length);
        return materials[ranNum];
    },

    reportShareMaterial: function (materialID, successCallback) {
        // 上报分享的文案
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            return;
        }
        let self = this;
        let url = URL_REPORT_SHARE.replace("%d", APP_ID).replace("%d", materialID);
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

    getServerList: function (version, userID, successCallback, notFirst) {
        notFirst = notFirst || false;
        let url = URL_SERVER_LIST.replace("%d", version).replace("%d", userID);
        let self = this;
        this.request(url, null, function (data) {
            self.showLog("getServerList success:", data);
            StoreageData.setLocalServerListData(data);
            if (!!successCallback) {
                successCallback(data);
            }
        }, function (data) {
            self.showLog("getServerList fail:", data);
            if (notFirst) {
                let localData = StoreageData.getLocalServerListData();
                if (localData) {
                    !!successCallback && successCallback(localData);
                } else {
                    self.getServerList(version, userID, successCallback, true);
                }
            } else {
                self.getServerList(version, userID, successCallback, true);
            }
        }, GET_METHOD, GET_HEADER);
    },

    getMyServer: function (version, userID, successCallback) {
        let url = URL_GET_MY_SERVER.replace("%d", version).replace("%d", userID);
        let self = this;
        this.request(url, null, function (data) {
            successCallback && successCallback(data);
        }, null, GET_METHOD, GET_HEADER);
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
        this._rewardedVideoAd = wx.createRewardedVideoAd({
            adUnitId: ADUNIT_ID
        });
        let self = this;
        this._rewardedVideoAd.onClose(res => {
            // 用户点击了【关闭广告】按钮
            // 小于 2.1.0 的基础库版本，res 是一个 undefined
            if (res && res.isEnded || res === undefined) {
                console.log("看广告成功，获得奖励");
                self._videoAdSuccessCallback && self._videoAdSuccessCallback();
            } else {
                // 播放中途退出
                console.log("退出广告播放，无奖励");
                self._videoAdCancelCallback && self._videoAdCancelCallback();
            }
            self._videoAdSuccessCallback = null
            self._videoAdCancelCallback = null;
        })
    },

    showRewardedVideoAd: function (successCallback, failCallback, cancelCallback) {
        let videoAd = this._rewardedVideoAd;
        this._videoAdSuccessCallback = successCallback;
        this._videoAdCancelCallback = cancelCallback;
        videoAd.load()
            .then(() => videoAd.show())
            .catch(err => {
                console.log("拉取广告失败：", err.errMsg);
                failCallback && failCallback();
            });
    },

    //download
    //urlStack: [],

    pushURL: function (ResType, remoteUrl, callback, forceDownload) {
        let self = this;
        // if (cc.sys.platform === cc.sys.WECHAT_GAME) {
        //     let index = {
        //         type: ResType,
        //         url: remoteUrl,
        //         cb: callback,
        //         fd: forceDownload
        //     };
        //     this.urlStack.push(index);
        // } else {
        self.showLog("The platform is not WECHAT_GAME");
        // }
        this.loadUrl(ResType, remoteUrl, callback, forceDownload);
    },

    activeLoad: function () {
        cc.log("stack run");
        let self = this;
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            let index = this.urlStack.shift();
            if (typeof index !== 'undefined') {
                this.loadUrl(index.type, index.url, index.cb, index.fd);
            } else {
                cc.log("stack is empty");
            }
        } else {
            self.showLog("The platform is not WECHAT_GAME");
        }
    },

    loadUrl: function (ResType, remoteUrl, callback, forceDownload) {
        let self = this;
        self.showLog("loadURL");
        forceDownload = typeof forceDownload !== 'undefined' ? forceDownload : false;
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            if (forceDownload) {
                self.showLog("forceDownload");
                this.downloadFile(remoteUrl, function (filePath) {
                    self.resManagerLoad(ResType, filePath, callback);
                });
            } else {
                self.showLog("not forceDownload");
                this.getSaveFile(remoteUrl, function (filePath) {
                    if (filePath != "") {
                        self.showLog("file is existed");
                        self.resManagerLoad(ResType, filePath, callback);
                    } else {
                        self.showLog("download file");
                        self.downloadFile(remoteUrl, function (filePath) {
                            self.resManagerLoad(ResType, filePath, callback);
                        });
                    }
                });
            }
        } else {
            self.showLog("The platform is not WECHAT_GAME");
        }
    },

    resManagerLoad: function (ResType, filePath, callback) {
        let self = this;
        ResManager.getInstance().loadRes(ResType, filePath, function (file) {
            if (!!callback) {
                callback(file);
            }
            //self.activeLoad();
        });
    },

    downloadFile: function (remoteUrl, callback) {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            let self = this;
            wx.downloadFile({
                url: remoteUrl,
                success: res => {
                    if (res.statusCode === 200) {
                        self.showLog("tempFile:" + res.tempFilePath);
                        self.setSaveFile(remoteUrl, res.tempFilePath, callback);
                    }
                },
                fail: res => {
                    self.showLog("failed to download file: " + remoteUrl);
                }
            });
        }
    },

    setSaveFile: function (remoteUrl, filePath, callback) {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            let self = this;
            wx.saveFile({
                tempFilePath: filePath,
                success: res => {
                    self.showLog("saveFile:" + res.savedFilePath);
                    let localFile = cc.sys.localStorage.getItem('localFileMap');
                    self.showLog(localFile);
                    let map = {};
                    if (localFile != "") {
                        map = JSON.parse(localFile);
                    }
                    map[remoteUrl] = res.savedFilePath;
                    cc.sys.localStorage.setItem('localFileMap', JSON.stringify(map));
                    //cc.sys.localStorage.setItem(remoteUrl,res.savedFilePath)
                    if (!!callback) {
                        callback(res.savedFilePath);
                    }
                },
                fail: res => {
                    self.showLog("failed to save file: " + filePath);
                }
            });
        }
    },

    getSaveFile: function (remoteUrl, callback) {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            let self = this;
            wx.getSavedFileList({
                success: res => {
                    let localFile = cc.sys.localStorage.getItem('localFileMap');
                    self.showLog(localFile);
                    var file = "";
                    if (localFile != "") {
                        var map = JSON.parse(localFile);
                        for (let i = 0; i < res.fileList.length; i++) {
                            if (res.fileList[i].filePath == map[remoteUrl]) {
                                file = map[remoteUrl];
                                break;
                            }
                            // if(cc.sys.localStorage.getItem(remoteUrl)==res.fileList[i].filePath){
                            //     file=res.fileList[i].filePath;
                            //     break;
                            // }
                        }
                    }
                    if (!!callback) {
                        callback(file);
                    }
                },
                fail: res => {
                    self.showLog("failed to get file: " + remoteUrl);
                }
            })
        }
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
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            this.showLog('platform is not wechat, can not shock device');
            return;
        } else {
            wx.vibrateShort({
                success: res => {
                    self.showLog('short shock success');
                },
                fail: res => {
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
                success: res => {
                    self.showLog('device keep success');
                },
                fail: res => {
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
                                fail: function (res) {
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
            fail: function (res) {
                // cc.warn('Failed to list all saved files: ' + res ? res.errMsg : 'unknown error');
                if (!!callback) {
                    callback();
                }
            }
        });
    },

    loadingClearCache: function (callback) {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            let self = this;
            console.log('clear cache');
            wx.showLoading({
                title: '正在清理旧版本',
                mask: true,
                complete() {
                    self.wxApiCleanAllAssets(function () {
                        StoreageData.setClearCache(false);
                        wx.hideLoading();
                        if(!!callback){
                            callback();
                        }else{
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
                    success(res) {
                        if (res.confirm) {
                            updateManager.applyUpdate();
                        }
                    }
                })
            })
        }
    },
};