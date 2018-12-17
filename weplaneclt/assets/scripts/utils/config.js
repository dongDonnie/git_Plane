var Config = function() {

};

//版本号
Config.version        = "v1.0.1";
Config.loadFromRemote = false;

//门服务器配置
Config.gateHostAdress = "192.168.2.251";
Config.gatePort       = 9908;

//设计分辨率
Config.CONFIG_SCREEN_WIDTH  = 640;
Config.CONFIG_SCREEN_HEIGHT = 1136;

//LANG隐藏VIP
Config.HIDE_VIP = false;

//大区公告
Config.SERVER_URL_GONGGAO = "http://ysup.phonecoolgame.com/json.php?_c=svrnotice&_f=nlist&opid=%s&svrid=%s";

//是否需要新手引导
Config.NEED_GUIDE = true;

//是否开启GM命令
Config.GM_SWITCH = true;

//是否隐藏vip (根据login s2c的值会自动设置)
Config.HIDE_VIP = false;

//是否拉取服务器列表
Config.USE_REMOTE_SERVERLIST = false;

//是否从服务器获取资源

module.exports = Config;
