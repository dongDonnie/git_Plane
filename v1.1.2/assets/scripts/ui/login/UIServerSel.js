const UIBase = require("uibase");
const GlobalVar = require("globalvar");
const EventMsgID = require("eventmsgid");

var UIServerSel = cc.Class({
    extends: UIBase,

    properties: {
        canSelect: {
            default: false,
            visible: false,
        },
        nodeSelectServerWnd: {
            default: null,
            type: cc.Node,
        },
        nodeLaunchNoticeWnd: {
            default: null,
            type: cc.Node,
        },
        clickServerWnd: {
            default: false,
            visible: false,
        },
    },

    onLoad: function () {
        console.log("UIServerSel onLoad!!!!!!");
        GlobalVar.cleanAllMgr();
        let self = this;
        this.canSelect = false;
        GlobalVar.isFirstTimesLoading = false;

        if (GlobalVar.isWanbaPlat){
            this.node.getChildByName("labelGMQQ").active = true;
        }


        let platformApi = GlobalVar.getPlatformApi();
        if (platformApi){
            platformApi.login(function (userData) {
                GlobalVar.me().loginData.setLoginReqDataAccount(userData.user_id);
                GlobalVar.me().loginData.setLoginReqDataSdkTicket(userData.ticket);
                GlobalVar.me().loginData.setLoginReqDataAvatar(userData.avatar);
                GlobalVar.me().loginData.setLoginReqDataCityFlag(userData.cityFlag);
                // console.log("get data for login, userID:" + user_id + " ticket:" + ticket + " avatar:" + avatar);
                platformApi.getServerList(GlobalVar.tblApi.getData('TblVersion')[1].strVersion, GlobalVar.me().loginData.getLoginReqDataAccount(), function (data) {
                    self.serverList = data.serverList;
                    self.userData = data.userData;
                    self.setInitServer();
                });
            })

            platformApi.getLaunchNotice(function (data) {
                self.initLaunchNoticeWnd(data);
            });
        }
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_NEED_CREATE_ROLE, this.createRoll, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_LOGIN_DATA_NTF, this.getLoginData, this);
    },

    getLoginData: function (event) {
        if (event.data.ErrCode !== 0) {
            GlobalVar.networkManager().needReConnected = false;
            this.canSelect = true;
        }
    },


    start: function () {
        GlobalVar.resManager().setPreLoadHero();
    },

    onDestroy: function () {
        // if (!!this.btnAuthorize) {
        // this.btnAuthorize.destroy();
        //this.btnAuthorize = null;
        // }
        GlobalVar.eventManager().removeListenerWithTarget(this);
    },

    setInitServer: function () {
        if (this.serverList.length == 0) {
            GlobalVar.comMsg.showMsg("沒有找到服务器信息");
            return;
        }
        let defaultServerID = null;
        let defaultServerIndex = -1;
        if (this.userData && this.userData.server) {
            if (this.userData.server.length != 0) {
                defaultServerID = this.userData.server[0];
            }
        }
        defaultServerIndex = this.findServerIndexByID(defaultServerID)
        if (!defaultServerID || defaultServerIndex == -1) {
            defaultServerID = this.serverList[0].server_id;
            defaultServerIndex = 0;
        }
        this.selServerIndex = defaultServerIndex;
        let labelServerName = this.node.getChildByName("labelServerName");
        labelServerName.getComponent(cc.Label).string = this.serverList[defaultServerIndex].name;
        this.node.getChildByName("spriteServerState").getComponent("RemoteSprite").setFrame(this.serverList[defaultServerIndex].status - 1);
        this.node.getChildByName("spriteServerState").active = true;

        this.canSelect = true;
        console.log("serverList", this.serverList);
    },

    findServerIndexByID: function (id) {
        if (!id) {
            return -1;
        }
        if (!!this.serverList) {
            for (let i = 0; i < this.serverList.length; i++) {
                if (this.serverList[i].server_id == id) {
                    return i;
                }
            }
        }
        return -1;
    },

    setServer: function (serverID) {
        let serverIndex = this.findServerIndexByID(serverID);
        if (serverIndex != -1) {
            this.selServerIndex = serverIndex;
            let labelServerName = this.node.getChildByName("labelServerName");
            labelServerName.getComponent(cc.Label).string = this.serverList[serverIndex].name;
            this.node.getChildByName("spriteServerState").getComponent("RemoteSprite").setFrame(this.serverList[serverIndex].status - 1);
        }
    },

    onSendBigLogin: function () {
        // console.log("canSelect:", !!this.canSelect);
        if (GlobalVar.networkManager().connectError) {
            this.canSelect = true;
        }
        if (!this.canSelect) return;
        if (GlobalVar.getPlatformApi()){
            this.canSelect = false;
            // console.log("点击登陆按钮")
            let serverData = this.serverList[this.selServerIndex];
            // console.log("serverData :", serverData);
            GlobalVar.me().loginData.setLoginReqDataServerID(serverData.server_id);
            GlobalVar.me().loginData.setLoginReqDataServerName(serverData.name);
            // console.log("连接的服务器地址为：", serverData.socket_domain, "  连接的端口为：", serverData.socket_port);
            GlobalVar.networkManager().connectToServer(serverData.socket_domain, serverData.socket_port, function () {
                if (GlobalVar.isWanbaPlat){
                    GlobalVar.handlerManager().loginHandler.sendLoginReqByWanba(
                        GlobalVar.me().loginData.getLoginReqDataServerID(),
                        GlobalVar.me().loginData.getLoginReqDataAvatar());
                }else{
                    GlobalVar.handlerManager().loginHandler.sendLoginReq(
                        GlobalVar.me().loginData.getLoginReqDataAccount(),
                        GlobalVar.me().loginData.getLoginReqDataSdkTicket(),
                        GlobalVar.me().loginData.getLoginReqDataServerID(),
                        GlobalVar.me().loginData.getLoginReqDataAvatar());
                }
            });
        }
    },

    createRoll: function () {
        let platformApi = GlobalVar.getPlatformApi();
        if (platformApi){
            platformApi.createRoll(function (nickName, avatar) {
                // console.log("发送创建角色消息, nickName:" + nickName + "  avatar:" + avatar);
                GlobalVar.handlerManager().loginHandler.sendCreateRollReq(nickName || "", avatar || "");
                GlobalVar.me().loginData.setLoginReqDataAvatar(avatar);
            })
        }
    },

    onBtnSelectServer: function () {
        // console.log("canSelect:", !!this.canSelect);
        if (!this.canSelect) return;
        // console.log("打开选服界面")
        if ((this.serverList && this.serverList.length == 0) || (!GlobalVar.isWechatPlat && !GlobalVar.isWanbaPlat && !GlobalVar.isQQPlayPlat)) {
            // GlobalVar.comMsg.showMsg("无服务器可以选择");
            // console.log("无服务器可以选择");
            return;
        }
        this.canSelect = true;
        this.nodeSelectServerWnd.active = true;

        // if (!!this.btnAuthorize) {
        // this.btnAuthorize.destroy();
        //self.btnAuthorize = null;
        // }
        this.initSelServerWnd();
    },

    initSelServerWnd: function () {
        this.clickServerWnd = false;
        let serverModel = this.node.getChildByName("nodeSelServerWnd").getChildByName("btnServerModel1");
        let defaultServerID = null;
        let defaultServerIndex = -1;
        defaultServerID = (this.userData.server && this.userData.server[0]) || defaultServerID;
        defaultServerIndex = this.findServerIndexByID(defaultServerID)
        if (!defaultServerID || defaultServerIndex == -1) { //取得默认服务器
            defaultServerID = this.serverList[0].server_id;
            defaultServerIndex = 0;
        }
        for (let i = 0; i< this.userData.server.length; i++){ //删除历史登录服中不存在的服
            let serverIndex = this.findServerIndexByID(this.userData.server[i])
            if (serverIndex == -1){
                this.userData.server.splice(i, 1);
                i -= 1;
            }
        }
        if (this.userData.server.length > 2){
            let nodeSelServerWnd = this.node.getChildByName("nodeSelServerWnd");
            nodeSelServerWnd.getChildByName("spriteUnderBg2").y = 182 - 94;
            nodeSelServerWnd.getChildByName("spriteAllServer").y = 188 - 94;
            nodeSelServerWnd.getChildByName("scrollview").y = -90 - 47
            nodeSelServerWnd.getChildByName("scrollview").height = 400;
            nodeSelServerWnd.getChildByName("scrollview").getChildByName("view").height = 400;
            nodeSelServerWnd.getChildByName("scrollview").getComponent(cc.ScrollView).content.y = 200;
        }
        this.updateServer(serverModel, this.serverList[defaultServerIndex]);
        for (let i = 1; i< this.userData.server.length; i++){
            let serverIndex = this.findServerIndexByID(this.userData.server[i])
            let server = this.node.getChildByName("nodeSelServerWnd").getChildByName("btnServerModel" + (i + 1));
            if (!server){
                server = cc.instantiate(serverModel);
                server.name = "btnServerModel" + (i + 1);
                this.node.getChildByName("nodeSelServerWnd").addChild(server);
            }
            server.x = (i%2) == 0?-147:147;
            server.y = 266 - parseInt(i/2)*94;
            this.updateServer(server, this.serverList[serverIndex]);
        }

        let content = this.node.getChildByName("nodeSelServerWnd").getChildByName("scrollview").getComponent(cc.ScrollView).content;
        content.removeAllChildren();

        for (let i = 0; i < this.serverList.length; i++) {
            let server = cc.instantiate(serverModel);
            this.updateServer(server, this.serverList[i]);
            content.addChild(server);
        }
    },

    updateServer: function (server, data) {
        server.data = data;
        server.getChildByName("labelName").getComponent(cc.Label).string = data.name;
        server.getChildByName("spriteServerState").getComponent("RemoteSprite").setFrame(data.status - 1);
    },

    onBtnServerClick: function (event) {
        // if (!this.clickServerWnd) {
        // this.clickServerWnd = true;
        let server = event.target;
        this.setServer(server.data.server_id);
        var self = this;
        this.nodeSelectServerWnd.active = false;
        
        // }
    },

    initLaunchNoticeWnd: function (noticeData) {
        console.log("启动公告：", noticeData);
        if (noticeData.ret != 0 || noticeData.data.length == 0) {
            return;
        } else {
            let content = this.nodeLaunchNoticeWnd.getChildByName("scrollview").getComponent(cc.ScrollView).content;
            let updateModel = function (model, data) {
                model.getChildByName("spriteTitleBg").getChildByName("labelTitle").getComponent(cc.Label).string = data.title;
                model.getChildByName("richText").getComponent(cc.RichText).string = data.content;
                model.opacity = 255;
            };
            for (let i = 0; i < noticeData.data.length; i++) {
                let model = null;
                if (i == 0) {
                    model = content.children[0];
                } else {
                    model = cc.instantiate(content.children[0]);
                    content.addChild(model);
                }
                updateModel(model, noticeData.data[i]);
            }
            console.log("content:", content);
            // this.nodeLaunchNoticeWnd.scale = 0
            this.nodeLaunchNoticeWnd.active = true;
            // this.nodeLaunchNoticeWnd.runAction(cc.scaleTo(0.3, 1));
        }
    },

    onBtnNotice: function () {
        this.nodeLaunchNoticeWnd.active = true;
    },

    onBtnClose: function () {
        this.nodeSelectServerWnd.active = false;
        this.nodeLaunchNoticeWnd.active = false;

    },

})