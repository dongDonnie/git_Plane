
const RootBase = require("RootBase");
const WindowManager = require("windowmgr");
const GlobalVar = require('globalvar')
const WndTypeDefine = require("wndtypedefine");
const EventMsgID = require("eventmsgid");
const GameServerProto = require("GameServerProto");
const weChatAPI = require("weChatAPI");

cc.Class({
    extends: RootBase,

    properties: {
        nodeAtt: {
            default: null,
            type: cc.Node,
        },
        labelCombat: {
            default: null,
            type: cc.Label,
        },
        labelRollName: {
            default: null,
            type: cc.Label,
        },
        progressExp: {
            default: null,
            type: cc.ProgressBar,
        },
    },

    onLoad: function () {
        this._super();
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_PLAYERINFO_WND;
        this.animeStartParam(0, 0);

    },

    start:function(){

    },

    animeStartParam(paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            GlobalVar.eventManager().removeListenerWithTarget(this);
            WindowManager.getInstance().popView();
        } else if (name == "Enter") {
            this._super("Enter");
            this.initPlayerInfoWnd();

            //RENAME
            GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_RENAME_ACK, this.getReNameData, this);

            let spriteHeader = this.node.getChildByName("nodeCenter").getChildByName("spriteHeader");
            if (cc.sys.platform === cc.sys.WECHAT_GAME) {
                console.log("GlobalVar.showAuthorization:", GlobalVar.showAuthorization);
                if (GlobalVar.showAuthorization){
                    this.createAuthorizeBtn(spriteHeader);
                }
            }
        }
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

    initPlayerInfoWnd(data) {
        let PlayerInfo = GlobalVar.me().propData.getProps();
        for(let i = 0; i<PlayerInfo.length;i++){
            let value = PlayerInfo[i].Value?PlayerInfo[i].Value:0;
            switch (PlayerInfo[i].ID) {
                case GameServerProto.PTPROP_Attack:
                    this.setPlayerAtk(value);
                    break;
                case GameServerProto.PTPROP_AttackGrowUp:
                    this.setPlayerAtkGrow(value);
                    break;
                case GameServerProto.PTPROP_Defence:
                    this.setPlayerDef(value);
                    break;
                case GameServerProto.PTPROP_DefenceGrowUp:
                    this.setPlayerDefGrow(value);
                    break;
                case GameServerProto.PTPROP_HP:
                    this.setPlayerLife(value);
                    break;
                case GameServerProto.PTPROP_HPGrowUp:
                    this.setPlayerLifeGrow(value);
                    break;
                case GameServerProto.PTPROP_WingManAttack:
                    this.setPlayerWingAtk(value);
                    break;
                case GameServerProto.PTPROP_ThrowingPower:
                    this.setPlayerHurlAtk(value);
                    break;
                case GameServerProto.PTPROP_MissilePower:
                    this.setPlayerRocketAtk(value);
                    break;
                case GameServerProto.PTPROP_AssistAttack:
                    this.setPlayerSubAtk(value);
                    break;
                case GameServerProto.PTPROP_CritRate:
                    this.setPlayerCriRate(value);
                    break;
                case GameServerProto.PTPROP_CritDamage:
                    this.setPlayerCriDamage(value);
                    break;
                case GameServerProto.PTPROP_EndlessAddPer:
                    this.setPlayerScore(value);
                    break;
                default:
                    break;
            }
        }

        this.setPlayerCombat(GlobalVar.me().getCombatPoint() || 0);
        this.setPlayerLevel(GlobalVar.me().getLevel() || 0);
        this.setRollName(GlobalVar.me().getRoleName() || "");
        this.setPlayerAvatar(GlobalVar.me().loginData.getLoginReqDataAvatar());
        
        this.setExpBar(GlobalVar.me().getLevel(), GlobalVar.me().getExp());
    },

    getLabel(name) {
        return this.nodeAtt.getChildByName(name).getComponent(cc.Label);
    },

    setRollName: function(data){
        this.labelRollName.string = data;
    },
    setPlayerCombat: function (data) {
        this.labelCombat.string = data;
    },
    setExpBar: function(level, exp){
        let levelUpData = GlobalVar.tblApi.getDataBySingleKey('TblLevel', level);
        let levelUpNeedExp = levelUpData.dwExp;
        let percent = exp/levelUpNeedExp;
        this.progressExp.node.getChildByName('expValue').getComponent(cc.Label).string = exp + '/' + levelUpNeedExp;
        if (cc.game.renderType != cc.game.RENDER_TYPE_WEBGL){
            this.progressExp.progress = percent;
        }else{
            this.progressExp.node.runAction(cc.progressLoading(0.3, this.progressExp.progress, percent));
        }
    },
    setPlayerAvatar: function (url){
        if (!GlobalVar.isWechatPlat && !GlobalVar.isQQPlayPlat && !GlobalVar.isWanbaPlat){
            return;
        }
        if (url == "") {
            return;
        }

        let nodeCenter = this.node.getChildByName("nodeCenter");
        let spriteHeader = nodeCenter.getChildByName("spriteHeader");
        
        if(GlobalVar.isQQPlayPlat){
            url = "http://mwxsdk.phonecoolgame.com/avatar.php?s=" + encodeURIComponent(url);
        }
        url = url + "?aa=aa.png";
        console.log("avater in playerinfo:", url);
        cc.loader.load({url:url, type: 'png'}, function (err, tex) {
            if (err) {
                // cc.error("LoadURLSpriteFrame err." + url);
            }
            let spriteFrame = new cc.SpriteFrame(tex);
            spriteHeader.getComponent("RemoteSprite").spriteFrame = spriteFrame;
        })
    },
    setPlayerLevel: function (data) {
        this.getLabel("labelLevel").string = data;
    },
    setPlayerLife: function (data) {
        this.getLabel("labelLife").string = data;
    },
    setPlayerAtk: function (data) {
        this.getLabel("labelAtk").string = data;
    },
    setPlayerDef: function (data) {
        this.getLabel("labelDef").string = data;
    },
    setPlayerWingAtk: function (data) {
        this.getLabel("labelWingAtk").string = data;
    },
    setPlayerHurlAtk: function (data) {
        this.getLabel("labelHurlAtk").string = data;
    },
    setPlayerRocketAtk: function (data) {
        this.getLabel("labelRocketAtk").string = data;
    },
    setPlayerSubAtk: function (data) {
        this.getLabel("labelSubAtk").string = data;
    },
    setPlayerCriDamage: function (data) {
        this.getLabel("labelCriDamage").string = data;
    },
    setPlayerCriRate: function (data) {
        this.getLabel("labelCriRate").string = data;
    },
    setPlayerScore: function (data) {
        this.getLabel("labelScore").string = data;
    },
    setPlayerLifeGrow: function (data) {
        this.getLabel("labelLifeGrow").string = data;
    },
    setPlayerAtkGrow: function (data) {
        this.getLabel("labelAtkGrow").string = data;
    },
    setPlayerDefGrow: function (data) {
        this.getLabel("labelDefGrow").string = data;
    },

    close: function () {
        if (this.btnAuthorize){
            this.btnAuthorize.destroy();
            this.btnAuthorize = null;
        }
        this._super();
    },

    getReNameData: function (data) {
        if (data.ErrCode != GameServerProto.PTERR_SUCCESS){
            GlobalVar.comMsg.errorWarning(data.ErrCode);
            return;
        }

        GlobalVar.me().loginData.setLoginReqDataAvatar(data.Avatar);
        GlobalVar.me().roleName = data.RoleName;
        GlobalVar.me().roleID = data.RoleID;
        GlobalVar.me().avatar = data.Avatar;
        this.setPlayerAvatar(GlobalVar.me().loginData.getLoginReqDataAvatar());
        this.setRollName(GlobalVar.me().getRoleName() || "");
        // this.onPlayerInfoBtnClick();
    },


    createAuthorizeBtn(btnNode) {
        let self = this;
        let createBtn = function(){
            let btnSize = cc.size(btnNode.width+20,btnNode.height+20);
            let frameSize = cc.view.getFrameSize();
            // console.log("winSize: ",winSize);
            // console.log("frameSize: ",frameSize);
            //适配不同机型来创建微信授权按钮
            let worldPos = btnNode.parent.convertToWorldSpaceAR(btnNode.position);
            let viewPos = self.node.convertToNodeSpaceAR(worldPos);

            let left = (cc.winSize.width*0.5+viewPos.x-btnSize.width*0.5)/cc.winSize.width*frameSize.width;
            let top = (cc.winSize.height*0.5-viewPos.y-btnSize.height*0.5)/cc.winSize.height*frameSize.height;
            let width = btnSize.width/cc.winSize.width*frameSize.width;
            let height = btnSize.height/cc.winSize.height*frameSize.height;
            console.log("button pos: ",cc.v3(left,top));
            console.log("button size: ",cc.size(width,height));
        
    
            self.btnAuthorize = wx.createUserInfoButton({
                type: 'text',
                text: '同步昵称',
                style: {
                    left: left,
                    top: top,
                    width: width,
                    height: height,
                    lineHeight: 0,
                    backgroundColor: '',
                    color: '#ffffff',
                    textAlign: 'center',
                    fontSize: 16,
                    borderRadius: 4,
                    lineHeight: height,
                }
            })
        
            self.btnAuthorize.onTap((uinfo) => {
                // console.log("onTap uinfo: ",uinfo);
                if (uinfo.userInfo) {
                    // console.log("wxLogin auth success");
                    wx.showToast({title:"授权成功"});
                    weChatAPI.getUserInfo(function(userInfo){
                        if (GlobalVar.me().roleID == GlobalVar.me().roleName){
                            GlobalVar.me().roleName = userInfo.nickName;
                            GlobalVar.me().loginData.setLoginReqDataAvatar(userInfo.avatarUrl);
                            GlobalVar.handlerManager().mainHandler.sendReNameReq(GlobalVar.me().roleID, userInfo.nickName, userInfo.avatarUrl);
                        }
                    })
                }else {
                    // console.log("wxLogin auth fail");
                    // wx.showToast({title:"授权失败"});
                    // self.onPlayerInfoBtnClick();
                }                        
                if (self.btnAuthorize){
                    self.btnAuthorize.destroy();
                    self.btnAuthorize = null;
                }
                GlobalVar.showAuthorization = false;
            });
        }
        if (GlobalVar.me().loginData.getLoginReqDataAvatar() != "" && GlobalVar.me().loginData.getLoginReqDataAvatar() != null){
            return;
        }

        weChatAPI.getSetting("userInfo", null, function(){
            createBtn();
        })
    },

});
