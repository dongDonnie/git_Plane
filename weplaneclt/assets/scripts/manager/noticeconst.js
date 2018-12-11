var NoticeConst = cc.Class({
    statics : {
        /// Controller层消息通知
        /// </summary>
        START_UP: "StartUp",                       //启动框架
        DISPATCH_MESSAGE: "DispatchMessage",       //派发信息

        /// <summary>
        /// View层消息通知
        /// </summary>
        UPDATE_MESSAGE: "UpdateMessage",           //更新消息
        UPDATE_EXTRACT: "UpdateExtract",           //更新解包
        UPDATE_DOWNLOAD: "UpdateDownload",         //更新下载
        UPDATE_PROGRESS: "UpdateProgress",         //更新进度
    }
});

module.exports = NoticeConst;
