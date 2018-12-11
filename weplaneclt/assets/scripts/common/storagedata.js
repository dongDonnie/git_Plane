

var StoredData = module.exports;
const GameServerProto = require("GameServerProto");
const GlobalVar = require('globalvar')
StoredData.Type = {};
StoredData.setItem = null;

StoredData.setItem = function (key, value) {
    if (cc.sys.platform == cc.sys.WECHAT_GAME){
        try {
            wx.setStorageSync(key, value)
        } catch (e) { 
            console.log("微信本地存储失败");
        }
    }else{
        cc.sys.localStorage.setItem(key, value);
    }
},

StoredData.getItem = function (key) {
    if (cc.sys.platform == cc.sys.WECHAT_GAME){
        try {
            let value = wx.getStorageSync(key);
            if (value) {
              return value;
            }
        } catch (e) {
            console.log("微信本地取值失败");
            return null;
        }
    }else{
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
    if (localData){
        endlessModeData = JSON.parse(localData);
    }
    if(!endlessModeData){
        endlessModeData = {};
    }
    endlessModeData[GlobalVar.me().roleID] = index;

    StoredData.setItem(StoredData.Type.EndlessMode, JSON.stringify(endlessModeData));
}

StoredData.getEndlessMode = function (){
    let endlessModeData = null;
    let localData = StoredData.getItem(StoredData.Type.EndlessMode);
    if (localData){
        endlessModeData = JSON.parse(localData);
    }
    if(!endlessModeData){
        endlessModeData = {};
        endlessModeData[GlobalVar.me().roleID] = 0;
    }else if (!endlessModeData[GlobalVar.me().roleID]){
        endlessModeData[GlobalVar.me().roleID] = 0;
    }

    StoredData.setItem(StoredData.Type.EndlessMode, JSON.stringify(endlessModeData));
    return endlessModeData[GlobalVar.me().roleID];
}

StoredData.setShareTimesWithKey = function (key, saveType, endTime) {
    // saveType 标记是每日清除还是活动后清除
    let shareTimesData = null;
    let localData = StoredData.getItem(StoredData.Type.ShareTimes);
    if (localData){
        shareTimesData = JSON.parse(localData);
    }
    // let shareTimesData = JSON.parse(StoredData.getItem(StoredData.Type.ShareTimes) || "{}");
    if (!shareTimesData){
        shareTimesData = {};
    }
    let timesData = shareTimesData[key];
    let curTime = GlobalVar.me().serverTime;
    if (!timesData || saveType != timesData.saveType){
        timesData = {};
        timesData.timeStamp = curTime;
        timesData.times = 0;
        timesData.endTime = endTime;
        timesData.saveType = saveType;
    }else if (timesData.saveType == GameServerProto.PT_AMS_ACT_LIMIT_DAILY){
        let a = parseInt((curTime - 5 * 3600) / (3600 * 24));
        let b = parseInt((timesData.timeStamp - 5 * 3600)/ (3600 * 24));
        if (a > b){
            timesData.timeStamp = curTime;
            timesData.times = 0;
            timesData.saveType = saveType;
            timesData.endTime = endTime;
        }
    }else if (timesData.saveType == GameServerProto.PT_AMS_ACT_LIMIT_LONG){
        if (curTime > timesData.endTime){
            timesData.endTime = endTime;
            timesData.times = 0;
            timesData.saveType = saveType;
        }
    }
    timesData.times += 1;
    shareTimesData[key] = timesData;
    console.log("保存分享次数到本地：", shareTimesData);
    StoredData.setItem(StoredData.Type.ShareTimes, JSON.stringify(shareTimesData));
    return timesData.times;
};

StoredData.getShareTimesWithKey = function (key, saveType, endTime) {
    let shareTimesData = null;
    let localData = StoredData.getItem(StoredData.Type.ShareTimes);
    if (localData){
        shareTimesData = JSON.parse(localData);
    }

    // let shareTimesData = JSON.parse(StoredData.getItem(StoredData.Type.ShareTimes) || "{}");
    console.log("从本地获取分享次数数据:", shareTimesData);
    if (!shareTimesData){
        shareTimesData = {};
    }
    let timesData = shareTimesData[key];
    let timesReset = false;

    let curTime = GlobalVar.me().serverTime;
    if (!timesData || saveType != timesData.saveType){
        timesData = {};
        timesData.timeStamp = curTime;
        timesData.times = 0;
        timesData.endTime = endTime;
        timesData.saveType = saveType;
    }else if (timesData.saveType == GameServerProto.PT_AMS_ACT_LIMIT_DAILY){
        let a = parseInt((curTime - 5 * 3600) / (3600 * 24));
        let b = parseInt((timesData.timeStamp - 5 * 3600)/ (3600 * 24));
        if (a > b){
            timesData.timeStamp = curTime;
            timesData.times = 0;
            timesData.saveType = saveType;
            timesData.endTime = endTime;
        }
    }else if (timesData.saveType == GameServerProto.PT_AMS_ACT_LIMIT_LONG){
        if (curTime > timesData.endTime){
            timesData.timeStamp = curTime;
            timesData.endTime = endTime;
            timesData.times = 0;
            timesData.saveType = saveType;
        }
    }
    shareTimesData[key] = timesData;
    
    StoredData.setItem(StoredData.Type.ShareTimes, JSON.stringify(shareTimesData));
    return timesData.times;
};

StoredData.setTotalShareTimes = function () {
    let totalTimesData = null;
    let localData = StoredData.getItem(StoredData.Type.TotalShareTimes);
    if (localData){
        totalTimesData = JSON.parse(localData);
    }
    // let totalTimesData = JSON.parse(StoredData.getItem(StoredData.Type.TotalShareTimes) || "{}" );
    if (totalTimesData){
        let curTime = GlobalVar.me().serverTime;
        let a = parseInt((curTime - 5 * 3600) / (3600 * 24));
        let b = parseInt((totalTimesData.timeStamp - 5 * 3600)/ (3600 * 24));
        if (a > b){
            totalTimesData = {};
            totalTimesData.timeStamp = curTime;
            totalTimesData.times = 0;
        }
    }else{
        totalTimesData = {};
        totalTimesData.timeStamp = GlobalVar.me().serverTime;
        totalTimesData.times = 0
    }
    totalTimesData.times += 1;

    console.log("保存总分享次数到本地:", totalTimesData);
    StoredData.setItem(StoredData.Type.TotalShareTimes, JSON.stringify(totalTimesData));
};
StoredData.getTotalShareTimes = function () {
    let totalTimesData = null;
    let localData = StoredData.getItem(StoredData.Type.TotalShareTimes);
    if (localData){
        totalTimesData = JSON.parse(localData);
    }
    // let totalTimesData = JSON.parse(StoredData.getItem(StoredData.Type.TotalShareTimes) || "{}");

    console.log("从本地获取总分享次数:", totalTimesData);
    if (totalTimesData){
        let curTime = GlobalVar.me().serverTime;
        let a = parseInt((curTime - 5 * 3600) / (3600 * 24));
        let b = parseInt((totalTimesData.timeStamp - 5 * 3600)/ (3600 * 24));
        if (a > b){
            totalTimesData.timeStamp = curTime;
            totalTimesData.times = 0;
        }
    }else {
        totalTimesData = {};
        totalTimesData.timeStamp = GlobalVar.me().serverTime;
        totalTimesData.times = 0;
    }

    console.log("判断后的分享数据:", totalTimesData);
    StoredData.setItem(StoredData.Type.TotalShareTimes, JSON.stringify(totalTimesData));
    return totalTimesData.times;
};

StoredData.setBattleAssitTimes = function () {
    let assitTimesData = null;
    let localData = StoredData.getItem(StoredData.Type.BattleAssitTimes);
    if (localData){
        assitTimesData = JSON.parse(localData);
    }
    if (assitTimesData){
        let curTime = GlobalVar.me().serverTime;
        let a = parseInt((curTime - 5 * 3600) / (3600 * 24));
        let b = parseInt((assitTimesData.timeStamp - 5 * 3600)/ (3600 * 24));
        if (a > b){
            assitTimesData = {};
            assitTimesData.timeStamp = curTime;
            assitTimesData.times = 0;
        }
    }else{
        assitTimesData = {};
        assitTimesData.timeStamp = GlobalVar.me().serverTime;
        assitTimesData.times = 0
    }
    assitTimesData.times += 1;

    console.log("保存空中支援的已免费获得次数:", assitTimesData);
    StoredData.setItem(StoredData.Type.BattleAssitTimes, JSON.stringify(assitTimesData));
};

StoredData.getBattleAssitTimes = function () {
    let assitTimesData = null;
    let localData = StoredData.getItem(StoredData.Type.BattleAssitTimes);
    if (localData){
        assitTimesData = JSON.parse(localData);
    };
    if (assitTimesData){
        let curTime = GlobalVar.me().serverTime;
        let a = parseInt((curTime - 5 * 3600) / (3600 * 24));
        let b = parseInt((assitTimesData.timeStamp - 5 * 3600) / (3600 * 24));
        if (a > b){
            assitTimesData.timeStamp = curTime;
            assitTimesData.times = 0;
        }
    }else{
        assitTimesData = {};
        assitTimesData.timeStamp = GlobalVar.me().serverTime;
        assitTimesData.times = 0;
    }
    console.log("获得空中支援的已免费获得次数:", assitTimesData);
    StoredData.setItem(StoredData.Type.BattleAssitTimes, JSON.stringify(assitTimesData));
    return assitTimesData.times;
};

StoredData.setLocalServerListData = function (serverListData) {
    console.log("保存服务器列表数据到本地:", serverListData);
    let str = JSON.stringify(serverListData);
    StoredData.setItem(StoredData.Type.ServerListData, str);
},

StoredData.getLocalServerListData = function () {
    let serverData = null;
    let localData = StoredData.getItem(StoredData.Type.ServerListData);
    if (localData){
        serverData = JSON.parse(localData);
    }
    console.log("从本地获取服务器列表信息:", serverData);
    return serverData;
};
