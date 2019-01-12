

var StoredData = module.exports;
const GameServerProto = require("GameServerProto");
const GlobalVar = require('globalvar')
StoredData.Type = {};
StoredData.setItem = null;

StoredData.setItem = function (key, value) {
    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
        try {
            wx.setStorageSync(key, value)
        } catch (e) {
            console.log("微信本地存储失败:", e);
        }
    } else if (window && window["wywGameId"] == "5469") {
        // try {
        //     BK.localStorage.setItem(key, value);
        // } catch (e){
        //     console.log("玩一玩本地存储失败:", e);
        // }
        cc.sys.localStorage.setItem(key, value);
    } else {
        cc.sys.localStorage.setItem(key, value);
    }
},

    StoredData.getItem = function (key) {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            try {
                let value = wx.getStorageSync(key);
                if (value) {
                    return value;
                }
            } catch (e) {
                console.log("微信本地取值失败:", e);
                return null;
            }
        } else if (window && window["wywGameId"] == "5469") {
            // try {
            //     let value = BK.localStorage.getItem(key);
            //     if (value) {
            //       return value;
            //     }
            // } catch (e) {
            //     console.log("玩一玩本地取值失败:", e);
            //     return null;
            // }
            return cc.sys.localStorage.getItem(key);
        } else {
            return cc.sys.localStorage.getItem(key);
        }
    },

    StoredData.Type.UserName = "username";
StoredData.Type.Password = "password";
StoredData.Type.Version = "version";
StoredData.Type.BgmOnOff = "bgmOnOff";
StoredData.Type.EffectOnOff = "effectOnOff";
StoredData.Type.EndlessMode = "endlessMode";
StoredData.Type.ShareTimes = "shareTiems";
StoredData.Type.TotalShareTimes = "totalShareTimes";
StoredData.Type.ServerListData = "serverListData";
StoredData.Type.BattleAssitTimes = "battleAssitTimes";
StoredData.Type.FuLiShare = "fuLiShare";
StoredData.Type.ClearCache = "clearcache";
StoredData.Type.LastBannerShowTime = "lastBannerCreateTime";
StoredData.Type.ResFileMap = "resFileMap";


StoredData.setClearCache = function (clear) {
    StoredData.setItem(StoredData.Type.ClearCache, typeof clear !== 'undefined' ? clear : false);
};

StoredData.getClearCache = function () {
    return StoredData.getItem(StoredData.Type.ClearCache);
};

StoredData.setUserName = function (username) {
    StoredData.setItem(StoredData.Type.UserName, username);
};

StoredData.getUserName = function () {
    return StoredData.getItem(StoredData.Type.UserName);
};

StoredData.setPassword = function (password) {
    StoredData.setItem(StoredData.Type.Password, password);
};

StoredData.getPassword = function () {
    return StoredData.getItem(StoredData.Type.Password);
};

StoredData.setVersion = function (version) {
    StoredData.setItem(StoredData.Type.Version, version);
};

StoredData.getVersion = function () {
    return StoredData.getItem(StoredData.Type.Version);
};

StoredData.setBgmOnOff = function (onOff) {
    StoredData.setItem(StoredData.Type.BgmOnOff, onOff);
}

StoredData.getBgmOnOff = function () {
    let onOff = StoredData.getItem(StoredData.Type.BgmOnOff);
    return (onOff === "false" ? false : true);
}

StoredData.setEffectOnOff = function (onOff) {
    StoredData.setItem(StoredData.Type.EffectOnOff, onOff);
}

StoredData.getEffectOnOff = function () {
    let onOff = StoredData.getItem(StoredData.Type.EffectOnOff);
    return (onOff === "false" ? false : true);
}

StoredData.setEndlessMode = function (index) {
    let endlessModeData = null;
    let localData = StoredData.getItem(StoredData.Type.EndlessMode);
    if (localData) {
        endlessModeData = JSON.parse(localData);
    }
    if (!endlessModeData) {
        endlessModeData = {};
    }
    endlessModeData[GlobalVar.me().roleID] = index;

    StoredData.setItem(StoredData.Type.EndlessMode, JSON.stringify(endlessModeData));
}
StoredData.getEndlessMode = function () {
    let endlessModeData = null;
    let localData = StoredData.getItem(StoredData.Type.EndlessMode);
    if (localData) {
        endlessModeData = JSON.parse(localData);
    }
    if (!endlessModeData) {
        endlessModeData = {};
        endlessModeData[GlobalVar.me().roleID] = 0;
    } else if (!endlessModeData[GlobalVar.me().roleID]) {
        endlessModeData[GlobalVar.me().roleID] = 0;
    }

    StoredData.setItem(StoredData.Type.EndlessMode, JSON.stringify(endlessModeData));
    return endlessModeData[GlobalVar.me().roleID];
}
StoredData.cleanShareTimesWithKey = function (key, saveType, endTime) {
    let shareTimesData = StoredData.getShareDataWithKey(key, saveType, endTime);
    shareTimesData[key][GlobalVar.me().roleID].times = 0;
    console.log("保存分享次数到本地：", shareTimesData);
    StoredData.setItem(StoredData.Type.ShareTimes, JSON.stringify(shareTimesData));
},
    StoredData.setShareTimesWithKey = function (key, saveType, endTime) {
        let shareTimesData = StoredData.getShareDataWithKey(key, saveType, endTime);
        shareTimesData[key][GlobalVar.me().roleID].times += 1;
        console.log("保存分享次数到本地：", shareTimesData);
        StoredData.setItem(StoredData.Type.ShareTimes, JSON.stringify(shareTimesData));
        return shareTimesData[key][GlobalVar.me().roleID].times;
    };
StoredData.getShareTimesWithKey = function (key, saveType, endTime) {
    let shareTimesData = StoredData.getShareDataWithKey(key, saveType, endTime);
    console.log("从本地获取分享次数数据:", shareTimesData);
    StoredData.setItem(StoredData.Type.ShareTimes, JSON.stringify(shareTimesData));
    return shareTimesData[key][GlobalVar.me().roleID].times;
};
StoredData.getShareDataWithKey = function (key, saveType, endTime) {
    let shareTimesData = null;
    let localData = StoredData.getItem(StoredData.Type.ShareTimes);
    if (localData) {
        shareTimesData = JSON.parse(localData);
    }

    if (!shareTimesData) {
        shareTimesData = {};
    }
    let timesData = shareTimesData[key];
    if (!timesData) {
        shareTimesData[key] = {};
    }
    let roleData = shareTimesData[key][GlobalVar.me().roleID];

    let curTime = GlobalVar.me().serverTime;
    if (!roleData || saveType != roleData.saveType) {
        roleData = {};
        roleData.timeStamp = curTime;
        roleData.times = 0;
        roleData.endTime = endTime;
        roleData.saveType = saveType;
    } else if (roleData.saveType == GameServerProto.PT_AMS_ACT_LIMIT_DAILY) {
        let a = parseInt((curTime - 5 * 3600 + 8 * 3600) / (3600 * 24));
        let b = parseInt((roleData.timeStamp - 5 * 3600 + 8 * 3600) / (3600 * 24));
        if (a > b) {
            roleData.timeStamp = curTime;
            roleData.times = 0;
            roleData.saveType = saveType;
            roleData.endTime = endTime;
        }
    } else if (roleData.saveType == GameServerProto.PT_AMS_ACT_LIMIT_LONG) {
        if (curTime > roleData.endTime) {
            roleData.timeStamp = curTime;
            roleData.endTime = endTime;
            roleData.times = 0;
            roleData.saveType = saveType;
        }
    } else if (roleData.saveType == 0) {

    }
    shareTimesData[key][GlobalVar.me().roleID] = roleData;
    return shareTimesData;
},

    StoredData.setTotalShareTimes = function () {
        let totalTimesData = StoredData.getTotalShareData();
        totalTimesData[GlobalVar.me().roleID].times += 1;
        console.log("保存总分享次数到本地:", totalTimesData);
        StoredData.setItem(StoredData.Type.TotalShareTimes, JSON.stringify(totalTimesData));
    };
StoredData.getTotalShareTimes = function () {
    let totalTimesData = StoredData.getTotalShareData();
    console.log("判断后的分享数据:", totalTimesData);
    StoredData.setItem(StoredData.Type.TotalShareTimes, JSON.stringify(totalTimesData));
    return totalTimesData[GlobalVar.me().roleID].times;
};
StoredData.getTotalShareData = function () {
    let totalTimesData = null;
    let localData = StoredData.getItem(StoredData.Type.TotalShareTimes);
    if (localData) {
        totalTimesData = JSON.parse(localData);
    }
    // let totalTimesData = JSON.parse(StoredData.getItem(StoredData.Type.TotalShareTimes) || "{}");

    console.log("从本地获取总分享次数:", totalTimesData);
    let roleData = null;
    if (totalTimesData) {
        roleData = totalTimesData[GlobalVar.me().roleID];
        if (!roleData) {
            roleData = {};
            roleData.timeStamp = GlobalVar.me().serverTime;
            roleData.times = 0;
        }

        let curTime = GlobalVar.me().serverTime;
        let a = parseInt((curTime - 5 * 3600 + 8 * 3600) / (3600 * 24));
        let b = parseInt((roleData.timeStamp - 5 * 3600 + 8 * 3600) / (3600 * 24));
        if (a > b) {
            roleData.timeStamp = curTime;
            roleData.times = 0;
        }
    } else {
        totalTimesData = {};
        roleData = {};
        roleData.timeStamp = GlobalVar.me().serverTime;
        roleData.times = 0;
    }
    totalTimesData[GlobalVar.me().roleID] = roleData;
    return totalTimesData;
};

StoredData.setBattleAssitTimes = function () {
    let assitTimesData = StoredData.getBattleAssitData();
    assitTimesData[GlobalVar.me().roleID].times += 1;
    console.log("保存空中支援的已免费获得次数:", assitTimesData);
    StoredData.setItem(StoredData.Type.BattleAssitTimes, JSON.stringify(assitTimesData));
};
StoredData.getBattleAssitTimes = function () {
    let assitTimesData = StoredData.getBattleAssitData();
    console.log("获得空中支援的已免费获得次数:", assitTimesData);
    StoredData.setItem(StoredData.Type.BattleAssitTimes, JSON.stringify(assitTimesData));
    return assitTimesData[GlobalVar.me().roleID].times;
};
StoredData.getBattleAssitData = function () {
    let assitTimesData = null;
    let localData = StoredData.getItem(StoredData.Type.BattleAssitTimes);
    if (localData) {
        assitTimesData = JSON.parse(localData);
    };
    let roleData = null;
    if (assitTimesData) {
        roleData = assitTimesData[GlobalVar.me().roleID];
        if (!roleData) {
            roleData = {};
            roleData.timeStamp = GlobalVar.me().serverTime;
            roleData.times = 0;
        }

        let curTime = GlobalVar.me().serverTime;
        let a = parseInt((curTime - 5 * 3600 + 8 * 3600) / (3600 * 24));
        let b = parseInt((roleData.timeStamp - 5 * 3600 + 8 * 3600) / (3600 * 24));
        if (a > b) {
            roleData.timeStamp = curTime;
            roleData.times = 0;
        }
    } else {
        assitTimesData = {};
        roleData = {};
        roleData.timeStamp = GlobalVar.me().serverTime;
        roleData.times = 0;
    }
    assitTimesData[GlobalVar.me().roleID] = roleData;
    return assitTimesData;
};

StoredData.setLocalServerListData = function (serverListData) {
    console.log("保存服务器列表数据到本地:", serverListData);
    let str = JSON.stringify(serverListData);
    StoredData.setItem(StoredData.Type.ServerListData, str);
};
StoredData.getLocalServerListData = function () {
    let serverData = null;
    let localData = StoredData.getItem(StoredData.Type.ServerListData);
    if (localData) {
        serverData = JSON.parse(localData);
    }
    console.log("从本地获取服务器列表信息:", serverData);
    return serverData;
};

StoredData.setLastBannerShowTime = function () {
    let curTime = GlobalVar.me().serverTime;
    StoredData.setItem(StoredData.Type.LastBannerShowTime, curTime);
};
StoredData.resetLastBannerShowTime = function () {
    StoredData.setItem(StoredData.Type.LastBannerShowTime, 0);
}

StoredData.needRefreshBanner = function () {
    let localData = StoredData.getItem(StoredData.Type.LastBannerShowTime);
    if (!localData) {
        return true;
    }
    let curTime = GlobalVar.me().serverTime;
    let lastBannerCreateTime = parseInt(localData);
    if (lastBannerCreateTime != 0 && (curTime - lastBannerCreateTime >= 120)) {
        return true;
    } else {
        return false;
    }
};

StoredData.getBannerTimeCount = function () {
    let localData = StoredData.getItem(StoredData.Type.LastBannerShowTime);
    if (!localData) {
        return 0;
    }
    let curTime = GlobalVar.me().serverTime;
    let lastBannerShowTime = parseInt(localData);
    if (lastBannerShowTime == 0) {
        return 0;
    }
    let timeCount = curTime - lastBannerShowTime;
    StoredData.resetLastBannerShowTime();
    return timeCount > 0 ? timeCount : 0;
};

StoredData.setResFileMap = function (map) {
    StoredData.setItem(StoredData.Type.ResFileMap, map);
};

StoredData.getResFileMap = function () {
    let data = StoredData.getItem(StoredData.Type.ResFileMap);
    if (data) return JSON.parse(data);
};
