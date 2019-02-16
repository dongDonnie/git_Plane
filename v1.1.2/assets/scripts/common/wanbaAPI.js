const GlobalVar = require('globalvar')
const md5 = require("md5");
const StoreageData = require("storagedata");
const i18n = require('LanguageData');
const GlobalFunc = require('GlobalFunctions');
const GameServerProto = require("GameServerProto");
const httpHelper = require('httpHelper');
// const urlParams = cc.isValid(urlParams)?urlParams:null;

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
// const URL_GET_PAYINFO = "https://cpgc.phonecoolgame.com/appPay/getAppPayInfo?payid=%d";
const URL_GET_MATERIALS = "https://cpgc.phonecoolgame.com/material/getMaterials?appid=%d";
// const URL_REPORT_SHARE = "https://cpgc.phonecoolgame.com/material/reportShare?appid=%d&materialID=%d";
// const URL_REPORT_CLICK = "https://cpgc.phonecoolgame.com/material/reportClick?appid=%d&materialID=%d";
// const URL_REPORT_VIDEO_START = "https://cpgc.phonecoolgame.com/material/reportVideoStart?appid=" + APP_ID + "&videoPointID=%d";
// const URL_REPORT_VIDEO_END = "https://cpgc.phonecoolgame.com/material/reportVideoEnd?appid=" + APP_ID + "&videoPointID=%d";
// const URL_GET_MORE_INFO = "https://cpgc.phonecoolgame.com/adc/getMoreInfo?appid=%d&ptform=%d";
const URL_SERVER_LIST = "https://wepup.phonecoolgame.com/json.php?_c=server&_f=plist&opid=%d&gameopid=" + GAME_OP_ID + "&ver=%d&userid=%d";
const URL_REPROT_SERVER_LOGIN = "https://wepup.phonecoolgame.com/json.php?_c=server&_f=in&userid=%d&server_id=%d&time=%d&sign=%sign";
const KEY_REPROT_SERVER_LOGIN = "$time.$userid.vs8$skv_sadid5dCasACFmCfe@45@aU2!";
const URL_ENDLESS_WORLD_RANKING = "https://wepup.phonecoolgame.com/json.php?_c=sort&_f=endlessList&server_id=%d&role_id=%d&page=%d&pagenum=%d";
const URL_GETIOS_RECHARGE_LOCKSTATE = "https://wepup.phonecoolgame.com/json.php?_c=check&_f=p&l=%d&c=%d&ct=%d";
const URL_SHARE_CONFIG = "https://cpgc.phonecoolgame.com/app/getCommonConfig?appid=" + APP_ID;
const URL_SHARE_SWITCH = "https://cpgc.phonecoolgame.com/app/getInfo?appid=" + APP_ID + "&version=%d";
const URL_GET_LAUNCH_NOTICE = "https://wepup.phonecoolgame.com/json.php?_c=start&_f=slist&opid=%d";

const URL_GET_MY_SERVER = "https://wepup.phonecoolgame.com/json.php?_c=server&_f=my&opid=%d&gameopid=" + GAME_OP_ID + "&ver=%d&userid=%d";

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
        console.log("本次分享切回界面耗时：", shareTimeGap/1000 , "秒");
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
            (data.videoMax >=0) && (setting.todayVideoMax = data.videoMax);
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
        if (typeof urlParams == "undefined" || (urlParams && typeof urlParams["opid"] == "undefined")) {
            setTimeout(() => {
                self.login(successCallback);
            }, 500);
            return;
        }
        
        GlobalVar.handlerManager().loginHandler.loginWithSdk(successCallback);
    },

    request: function (url, data, successCallback, failCallback, method = DEFAULT_METHOD) {
        let self = this;
        if (method == "POST"){
            httpHelper.httpPost(url, data, function (res) {
                if (res === -1){
                    console.log("get fail data:", res);
                    console.log("request from " + url + " failed!");
                    if (failCallback) {
                        failCallback(res);
                    }
                }else{
                    // if (res.statusCode == 200) {
                        console.log("get success data:", res);
                        console.log("request from " + url + " success!");
                        if (successCallback) {
                            successCallback(res);
                        }
                    // }
                }
            })
        }else if (method == "GET"){
            console.log("getgetgetget");
            httpHelper.httpGet(url, function (res) {
                console.log("get response:", res);
                if (res.status === 401){
                    console.log("get fail data:", res);
                    console.log("request from " + url + " failed!");
                    if (failCallback) {
                        failCallback(res);
                    }
                }else{
                    // if (res.statusCode == 200) {
                    console.log("get success data:", res);
                    console.log("request from " + url + " success!");
                    if (successCallback) {
                        successCallback(res);
                    }
                    // }
                }
            })
        }
    },

    showToast: function (tips, useDialog = false, showCancel = false, confirmText, cancelText, confirmCallback, cancelCallback) {
        if (!useDialog) {
            tips && GlobalVar.comMsg.showMsg(tips);
        } else {
            if (tips) {
                mqq.invoke("ui", "showDialog", {
                    text: tips,
                    needOkBtn: true,
                    needCancelBtn: showCancel,
                    okBtnText: confirmText || "确定",
                    cancelBtnText: cancelText || "取消",
                },function(result){
                    if (result.button == 0){
                        confirmCallback && confirmCallback();
                    }else{
                        cancelCallback && cancelCallback();
                    }
                });
            }
        }
    },

    //share
    shareNormal: function (index, successCallback, failCallback, successTips, failTips, inviteParam) {
        // 普通分享，判断模拟点击
        let block = cc.find("Canvas/BlockNode");
        if (cc.isValid(block)) {
            console.log("禁止点击1秒");
            block.active = true;
            setTimeout(function () {
                block.active = false;
            }, 1000);
        }

        mqq.invoke('ui','setOnShareHandler',function(type){
            mqq.invoke('ui','shareMessage',{
                title: '王牌机战H5',
                desc: '超经典飞行射击游戏，王牌出击等你来战！',
                share_type: type,
                share_url: window.OPEN_DATA.shareurl,
                image_url: "https://cdn.phonecoolgame.com/wxgame/hezi/back/wpjz-003.jpg",
                back: true
            },function(result){
                console.log("分享结果：",result);
                if (result.retCode == 0){
                    alert('分享成功');
                    successCallback && successCallback();
                }else{
                    failCallback && failCallback();
                }
            });
        });
        // 手Q的showShareMenu不需要传递参数，第三方平台的需要，文档建议所有的都加参数，但不知道第三方平台会不会执行两次。。
        // mqq.ui.showShareMenu();
        mqq.ui.showShareMenu({
            title: '王牌机战H5',
            desc: '超经典飞行射击游戏，王牌出击等你来战！',
            share_url: window.OPEN_DATA.shareurl,
            image_url: "https://cdn.phonecoolgame.com/wxgame/hezi/back/wpjz-003.jpg",
        }, function (result) {
            console.log("分享结果：",result);
            if (result.retCode == 0){
                alert('分享成功');
                successCallback && successCallback();
            }else{
                failCallback && failCallback();
            }
        });
    },

    shareNeedClick: function (index, successCallback, failCallback, strTips, successTips, failTips, notShareInGropTips) {
        // 需要玩家自己点进来的分享

        let block = cc.find("Canvas/BlockNode");
        if (cc.isValid(block)) {
            console.log("禁止点击1秒");
            block.active = true;
            setTimeout(function () {
                block.active = false;
            }, 1000);
        }

        mqq.invoke('ui','setOnShareHandler',function(type){
            mqq.invoke('ui','shareMessage',{
                title: '王牌机战H5',
                desc: '超经典飞行射击游戏，王牌出击等你来战！',
                share_type: type,
                share_url: window.OPEN_DATA.shareurl,
                image_url: "https://cdn.phonecoolgame.com/wxgame/hezi/back/wpjz-003.jpg",
                back: true
            },function(result){
                console.log("分享结果：",result);
                if (result.retCode == 0){
                    successCallback && successCallback();
                }else{
                    failCallback && failCallback();
                }
            });
        });

        // 手Q的showShareMenu不需要传递参数，第三方平台的需要，文档建议所有的都加参数，但不知道第三方平台会不会执行两次。。
        // mqq.ui.showShareMenu();
        mqq.ui.showShareMenu({
            title: '王牌机战H5',
            desc: '超经典飞行射击游戏，王牌出击等你来战！',
            share_url: window.OPEN_DATA.shareurl,
            image_url: "https://cdn.phonecoolgame.com/wxgame/hezi/back/wpjz-003.jpg",
        }, function (result) {
            console.log("分享结果：",result);
            if (result.retCode == 0){
                successCallback && successCallback();
            }else{
                failCallback && failCallback();
            }
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
        for (let i in this._onShowListener){
            wx.offShow(this._onShowListener[i]);
        }
        this._onShowListener = [];
        for (let i in this._onHideListener){
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

    androidPayment: function (amount, productID, productName) {
        // 支付

        let payInfo = {
            money: amount * 100, // 转换成以分为单位
            cmgePlayerId: urlParams["cmgePlayerId"],
            serverID: GlobalVar.me().loginData.getLoginReqDataServerID(),
            roleID: GlobalVar.me().roleID,
            subject: productName,
            itemID: productID,
            roleName: GlobalVar.me().roleName,
            serverName: GlobalVar.me().loginData.getLoginReqDataServerName(),
        }
        sdkPayOrder(payInfo);
    },

    createRoll: function (successCallback) {
        GlobalVar.handlerManager().loginHandler.createRoleWithSdk(successCallback);
    },

    judgeInvite: function (successCallback) {
        // if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
        //     return;
        // }
        // let self = this;
        // let launchInfo = wx.getLaunchOptionsSync();
        // // self.showLog("launcinfo", launchInfo);
        // console.log("判断邀请！", launchInfo);
        // if (launchInfo) {
        //     // 判断启动参数, 启动参数有form_serverid、from_openid、和from_btn
        //     // 就是点了别人的邀请进来的，上报邀请信息
        //     // if (launchInfo.shareTicket) {
        //     //     GlobalVar.me().shareTicket = launchInfo.shareTicket;
        //     // }
        //     if (launchInfo.query['from_serverid'] && launchInfo.query['from_openid'] && launchInfo.query['from_btn']) {
        //         let inviteData = {
        //             game_id: GAME_ID,
        //             openid: GlobalVar.me().loginData.getLoginReqDataAccount(),
        //             avatar: GlobalVar.me().loginData.getLoginReqDataAvatar(),
        //             from_serverid: launchInfo.query['from_serverid'],
        //             from_openid: launchInfo.query['from_openid'],
        //             from_btn: launchInfo.query['from_btn'],
        //         };
        //         console.log("向服务器上报邀请消息:", inviteData);
        //         self.request(URL_INVITE, inviteData, function (data) {
        //             if (data.ret !== 0) return;
        //             if (!!successCallback) {
        //                 successCallback(data.data);
        //             }
        //         });
        //     }
        // }
    },

    // getInviteUserList: function (btn, successCallback) {
    //     // 向服务器请求邀请成功的用户信息
    //     if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
    //         return;
    //     }
    //     let self = this;
    //     let inviteListData = {
    //         game_id: GAME_ID,
    //         openid: GlobalVar.me().loginData.getLoginReqDataAccount(),
    //         server_id: GlobalVar.me().loginData.getLoginReqDataServerID(),
    //         btn: btn,
    //     };
    //     // console.log("邀请列表的请求数据", inviteListData);
    //     self.request(URL_INVITE_LIST, inviteListData, function (data) {
    //         if (data.ret !== 0) return;
    //         if (!!successCallback) {
    //             successCallback(data.data);
    //         }
    //     });
    // },

    getMaterials: function (successCallback) {
        // 获取分享文案
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            return;
        }
        let self = this;
        let url = URL_GET_MATERIALS.replace("%d", APP_ID);
        this._defaultMaterial = [
            {
                cdnurl: "https://cdn.phonecoolgame.com/wxgame/hezi/back/wpjz-003.jpg",
                content: "超经典飞行射击游戏，王牌出击等你来战！",
                materialID: "138",
            },
        ]
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

    // reportShareMaterial: function (materialID, successCallback, needReportUid = true) {
    //     // 上报分享的文案
    //     if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
    //         return;
    //     }
    //     let self = this;
    //     let url = URL_REPORT_SHARE.replace("%d", APP_ID).replace("%d", materialID);
    //     if (needReportUid) {
    //         url = url + "&uid=" + GlobalVar.me().loginData.getLoginReqDataAccount();
    //     }
    //     self.request(url, null, function (data) {
    //         if (data.ecode !== 0) {
    //             self.showLog("reportShare error, ecode = ", data.ecode);
    //             return;
    //         }
    //         self.showLog("reportShare success, materialID = ", materialID);
    //         if (!!successCallback) {
    //             successCallback(data.data);
    //         }
    //     }, null, GET_METHOD, GET_HEADER)
    // },
    // reportClickMaterial: function (materialID, successCallback, needReportUid = true) {
    //     // 上报被点击的文案
    //     if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
    //         return;
    //     }
    //     let self = this;
    //     let url = URL_REPORT_CLICK.replace("%d", APP_ID).replace("%d", materialID);
    //     if (needReportUid) {
    //         url = url + "&uid=" + GlobalVar.me().loginData.getLoginReqDataAccount();
    //     }
    //     self.request(url, null, function (data) {
    //         if (data.ecode !== 0) {
    //             self.showLog("reportClick error, ecode = ", data.ecode);
    //             return;
    //         }
    //         self.showLog("reportClick success, materialID = ", materialID);
    //         if (!!successCallback) {
    //             successCallback(data.data);
    //         }
    //     }, null, GET_METHOD, GET_HEADER)
    // },
    // reportVideoStart: function (videoPointID, needReportUid = false) {
    //     if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
    //         return;
    //     }
    //     let self = this;
    //     let url = URL_REPORT_VIDEO_START.replace("%d", videoPointID);
    //     if (needReportUid) {
    //         url = url + "&uid=" + GlobalVar.me().loginData.getLoginReqDataAccount();
    //     }
    //     self.request(url, null, function (data) {
    //         if (data.ecode !== 0) {
    //             console.log("videoPoint:" + videoPointID + " start report fail: ecode =", data.ecode);
    //             return;
    //         }
    //         console.log("videoPoint:" + videoPointID + " start report success")
    //     }, null, GET_METHOD, GET_HEADER);
    // },
    // reportVideoEnd: function (videoPointID, needReportUid = false) {
    //     if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
    //         return;
    //     }
    //     let self = this;
    //     let url = URL_REPORT_VIDEO_END.replace("%d", videoPointID);
    //     if (needReportUid) {
    //         url = url + "&uid=" + GlobalVar.me().loginData.getLoginReqDataAccount();
    //     }
    //     self.request(url, null, function (data) {
    //         if (data.ecode !== 0) {
    //             console.log("videoPoint:" + videoPointID + " end report fail: ecode =", data.ecode);
    //             return;
    //         }
    //         console.log("videoPoint:" + videoPointID + " end report success")
    //     }, null, GET_METHOD, GET_HEADER);
    // },

    getServerList: function (version, userID, successCallback, notFirst) {
        notFirst = notFirst || false;
        let url = URL_SERVER_LIST.replace("%d", urlParams["opid"]).replace("%d", version).replace("%d", userID);
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
        let url = URL_GET_MY_SERVER.replace("%d", urlParams["opid"]).replace("%d", version).replace("%d", userID);
        let self = this;
        this.request(url, null, function (data) {
            successCallback && successCallback(data);
        }, function (data) {
            failCallback && failCallback(data);
        }, GET_METHOD, GET_HEADER);
    },

    getLaunchNotice: function (successCallback) {
        let url = URL_GET_LAUNCH_NOTICE.replace("%d", urlParams["opid"]);
        this.request(url, null, function (data) {
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

    requestEndlessFriendRanking: function (pageIndex, pageCount, callback) {
        if (pageIndex < 0 || pageCount < 1 || !pageIndex || !pageCount){
            console.log("???");
            return;
        }
        let self = this;
        console.log("key:", "key1", "  start:", (pageIndex - 1) * pageCount, "  pageCount:", pageCount)
        cmgeH5GameSDK.WanBaGetGamebarRanklist("key1", (pageIndex - 1) * pageCount, pageCount, function (data) {
            if (data.errorCode == 0){
                let rankData = {};
                rankData.list = [];
                rankData.my = {
                    score: data.selfrank_top_score || 0,
                    avatar: GlobalVar.me().loginData.getLoginReqDataAvatar() || "",
                    role_name: GlobalVar.me().roleName,
                    rank: data.selfrank||0,
                };
                for (let i = 0; i < data.ranklist.length; i++) {
                    rankData.list.push({
                        score: data.ranklist[i].topscore || 0,
                        avatar: data.ranklist[i].avatar || "",
                        role_name: data.ranklist[i].nick || "",
                        rank: data.ranklist[i].rank,
                    });
                }
                callback && callback(rankData);
            }else{
                console.log("获取排行榜失败，失败原因为：", data.errorMessage);
            }
        });
    },
    resetRankingData: function () {
        // let openDataContext = wx.getOpenDataContext();
        // let ON_MSG_RESET_RANK_GET_DATA = 7;
        // openDataContext.postMessage({
        //     id: ON_MSG_RESET_RANK_GET_DATA
        // });
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

    createRewardedVideoAd: function () {

    },

    /**
     * @param {number} videoPointID 上报的视频点ID
     * @param {Function} successCallback 完整看完视频的奖励回调
     * @param {Function} cancelCallback 取消看视频的回调，可以用来执行解除窗口锁之类的逻辑，同时转为分享时，也会成为分享的失败回调
     * @param {boolean} needTurnToShare 视频失败是否要转到分享
     * @param {boolean} needTodayLimit 是否有当日限制
     */
    showRewardedVideoAd: function (videoPointID, successCallback, cancelCallback, needTurnToShare = true, needTodayLimit = false) {
        mqq.invoke('ui','setOnShareHandler',function(type){
            mqq.invoke('ui','shareMessage',{
                title: '王牌机战H5',
                desc: '超经典飞行射击游戏，王牌出击等你来战！',
                share_type: type,
                share_url: window.OPEN_DATA.shareurl,
                image_url: "https://cdn.phonecoolgame.com/wxgame/hezi/back/wpjz-003.jpg",
                back: true
            },function(result){
                console.log("分享结果：",result);
                if (result.retCode == 0){
                    alert('分享成功');
                    successCallback && successCallback();
                }else{
                    cancelCallback && cancelCallback();
                }
            });
        });

        // 手Q的showShareMenu不需要传递参数，第三方平台的需要，文档建议所有的都加参数，但不知道第三方平台会不会执行两次。。
        // mqq.ui.showShareMenu();
        mqq.ui.showShareMenu({
            title: '王牌机战H5',
            desc: '超经典飞行射击游戏，王牌出击等你来战！',
            share_url: window.OPEN_DATA.shareurl,
            image_url: "https://cdn.phonecoolgame.com/wxgame/hezi/back/wpjz-003.jpg",
        }, function (result) {
            console.log("分享结果：",result);
            if (result.retCode == 0){
                alert('分享成功');
                successCallback && successCallback();
            }else{
                cancelCallback && cancelCallback();
            }
        });
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
        if (cc.isValid(urlParams) && urlParams["channelUID"]=="wanba"){
            cmgeH5GameSDK.WanBaSetAchievement(keyName, data, function () {
                console.log("上报无尽分数成功！");
            })
        }
    },

    deviceShock: function () {
        var self = this;
        if (StoreageData.getVibrateSwitch() == 'off') {
            //this.showLog('platform is not wechat, can not shock device');
            return;
        } else {
            mqq.sensor.vibrate(function(param){
                alert("vibrate time: " + param.time);
            })
        }
    },

    deviceKeepScreenOn: function () {
        // var self = this;
        // if (urlParams && urlParams["channelUID"]=="wanba") {
        //     cmgeH5GameSDK.setScreenStatus(1);
        // }
    },

    getNetWorkStatus: function (callback) {
        if (mqq.device.getNetworkType){
            mqq.device.getNetworkType(function(result){
                callback(result);
            });
        }else{
            callback(1);
        }
    },
};