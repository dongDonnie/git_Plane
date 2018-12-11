const UIBase = require("uibase");
const GlobalVar = require("globalvar")
const CommonDefine = require("define");
const ResMapping = require("resmapping");
const ResManager = require("ResManager");
const WindowManager = require("windowmgr");
const WndTypeDefine = require("wndtypedefine");
const i18n = require('LanguageData');
const GameServerProto = require("GameServerProto");

var ItemObject = cc.Class({
    extends: UIBase,

    ctor: function () {

    },

    properties: {
        nodeObject: {
            default: null,
            type: cc.Node
        },
        spriteItemIcon: {
            default: null,
            type: cc.Sprite
        },
        spriteNumber: {
            default: null,
            type: cc.Sprite
        },
        spriteEdge: {
            default: null,
            type: cc.Sprite
        },
        spritePiece: {
            default: null,
            type: cc.Sprite,
        },
        spriteQualityIcon: {
            default: null,
            type: cc.Sprite
        },
        spriteChoosing: {
            default: null,
            type: cc.Sprite
        },
        spriteHotPoint: {
            default: null,
            type: cc.Sprite
        },
        spriteLevelBg: {
            default: null,
            type: cc.Sprite
        },
        labelLevel: {
            default: null,
            type: cc.Label
        },
        spriteQualityNumberBg: {
            default: null,
            type: cc.Sprite
        },
        labelQualityNumber: {
            default: null,
            type: cc.Label
        },
        labelNumber: {
            default: null,
            type: cc.Label
        },
        richtextNumber: {
            default: null,
            type: cc.RichText
        },
        nodeAdd: {
            default: null,
            type: cc.Node
        },
        itemID: {
            default: 0,
            visible: false,
        },
        itemData: {
            default: null,
            visible: false,
        },
        btnCallBackType: {
            default: -1,
            visible: false,
        },
        btnCallBackFun: {
            default: null,
            visible: false,
        },
        closeTarget: {
            default: null,
            visible: false,
        },
        slot: {
            default: -1,
            visible: false,
        },
    },

    onLoad: function () {
        i18n.init('zh');
        //this.node.on("touchstart", this.onTouchStart, this);
        //this.node.on("touchend", this.onTouchEnd, this);
    },

    onTouchStart: function(){

    },
    onTouchEnd: function(){

    },

    updateItem: function (id, num, level, hotpoint) {
        this.setAllVisible(false);
        this.itemID = id;
        this.itemLevel = level || 0;
        this.itemData = GlobalVar.tblApi.getDataBySingleKey('TblItem', id);
        if (this.itemData == null) {
            this.itemData = GlobalVar.tblApi.getDataBySingleKey('TblItem', 1);
        }
        this.setSpriteItemIconData(this.itemData.wIcon);
        this.setSpritePieceData(this.itemData.byType);
        this.setSpriteEdgeData(this.itemData.wQuality);
        // this.setSpriteQualityIconData(this.itemData.wQuality);
        this.setLabelQualityNumberData(this.itemData.strName);
        this.setLabelNumberData(num);
        this.setLabelLevelData(level);
        this.setClick(this.nodeObject.getComponent(cc.Button).interactable);
        this.setSpriteHotPointData(hotpoint);
        //this.setSpriteChoosingVisible();
        //this.setNodeAddVisible();
        return this.itemData;
    },

    setClick: function (enableBtn, btnCallBackType, btnCallBackFun, closeTarget) {
        enableBtn = typeof enableBtn !== 'undefined' ? enableBtn : false;
        this.nodeObject.getComponent(cc.Button).interactable = enableBtn;
        this.nodeObject.getComponent("ButtonObject").setEventState(enableBtn);
        this.btnCallBackType = typeof btnCallBackType !== 'undefined' ? btnCallBackType : -1;
        if (!!btnCallBackFun) {
            this.btnCallBackFun = btnCallBackFun;
        }
        if (!!closeTarget) {
            this.closeTarget = closeTarget;
        }
    },

    setSlot: function (data) {
        this.slot = typeof data !== 'undefined' ? data : -1;
    },
    getSlot: function () {
        return this.slot;
    },

    scaleItem: function (width, height) {
        width = typeof width !== 'undefined' ? width : this.node.width;
        height = typeof height !== 'undefined' ? height : this.node.height;

        this.node.setScale(width / this.node.width, height / this.node.height);
    },

    clickItem: function () {
        var self = this;
        cc.log('itemID: ', this.itemID);
        // cc.log(this.btnCallBackType);
        if (this.btnCallBackType == 0) {
            WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMALITEMINFO, function (wnd, name, type) {
                wnd.getComponent(type).updateInfo(self.itemID, self.itemData.wQuality, self.itemLevel, self.getLabelNumberData(), self.getSlot());
                wnd.getComponent(type).setTitle("道具详情");
            });
        } else if (this.btnCallBackType == 1) {
            let itemCount = GlobalVar.me().bagData.getItemCountById(this.itemID);
            WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMALITEMGETWAY, function (wnd, name, type) {
                // wnd.getComponent(type).updateInfo(self.itemID, self.getLabelNumberData(), 0, self.getSlot());
                wnd.getComponent(type).updateInfo(self.itemID, itemCount, self.itemLevel, self.getSlot());
            });
        } else if (this.btnCallBackType == 2) {
            WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMALITEMINFO, function (wnd, name, type) {
                wnd.getComponent(type).updateInfo(self.itemID, self.itemData.wQuality, self.itemLevel, self.getLabelNumberData(), self.getSlot(), true);
                wnd.getComponent(type).setTitle("道具详情");
            })
        } else if (this.btnCallBackType == 10) {
            this.setSpriteChoosingState();
        } else if (this.btnCallBackType == this.itemData.byType + 100) {
            if (!!this.btnCallBackFun) {
                this.btnCallBackFun(this.slot);
            }
            if (!!this.closeTarget) {
                this.closeTarget();
            }
        }else{

        }
    },

    setSpriteItemIconData: function (icon,color) {
        this.setSpriteItemIconVisible(true);
        //let path = 'cdnRes/itemicon/'+icon;
        if(this.itemData!=null){
            let path='';
            if(this.itemData.byType!=53){
                path = 'cdnRes/itemicon/'+this.itemData.byType+'/'+icon;
            }else{
                if(this.itemData.byColor!=6){
                    path='cdnRes/itemicon/'+this.itemData.byType+'/'+this.itemData.byColor+'/'+icon;
                }else{
                    path='cdnRes/itemicon/'+this.itemData.byType+'/5/'+icon;
                }
            }
            if(path!=''){
                this.spriteItemIcon.getComponent("RemoteSprite").loadFrameFromLocalRes(path);
            }
        }else{
            if(typeof color !=='undefined'){
                let path='cdnRes/itemicon/53/'+(color+1)+'/'+icon;
                this.spriteItemIcon.getComponent("RemoteSprite").loadFrameFromLocalRes(path);
            }
        }
    },
    setSpriteItemIconVisible: function (visible) {
        visible = typeof visible !== 'undefined' ? visible : true;
        this.spriteItemIcon.node.active = visible;
    },

    setSpriteEdgeData: function (edge) {
        let index = Math.floor(edge / 100);
        if (index > 5 || index < 0) {
            index = 0;
        }

        this.setSpriteEdgeVisible(true);
        this.spriteEdge.getComponent("RemoteSprite").setFrame(index);
    },
    setSpriteEdgeVisible: function (visible) {
        visible = typeof visible !== 'undefined' ? visible : true;
        this.spriteEdge.node.active = visible;
    },

    setSpritePieceData: function (type) {
        if (type == 30) {
            this.setSpritePieceVisible(true);
        } else {
            this.setSpritePieceVisible(false);
        }
    },
    setSpritePieceVisible: function (visible) {
        visible = typeof visible !== 'undefined' ? visible : true;
        this.spritePiece.node.active = visible;
    },

    setSpriteQualityIconData: function (quality) {
        let iconNum = quality - Math.floor(quality / 100) * 100;
        let index = -1;
        switch (iconNum) {
            case 0:
                index = -1;
                break
            case 1:
            case 2:
                index = 0;
                break;
            case 3:
            case 4:
                index = 1;
                break;
            case 5:
            case 6:
                index = 2;
                break;
            case 7:
            case 8:
                index = 3;
                break;
            case 9:
            case 10:
                index = 4;
                break;
            case 11:
            case 12:
                index = 5;
                break;
            default:
                index = -1;
                break;
        }
        if (index != -1) {
            this.setSpriteQualityIconVisible(true);
            //this.spriteQualityIcon.spriteFrame = this.spriteQualityList[index];
        } else {
            this.setSpriteQualityIconVisible(false);
        }

    },
    setSpriteQualityIconVisible: function (visible) {
        visible = typeof visible !== 'undefined' ? visible : true;
        this.spriteQualityIcon.node.active = visible;
    },

    setSpriteHotPointData: function (type) {
        type = typeof type !== 'undefined' ? type : -1;

        if (type != 0 && type != 1) {
            this.setSpriteHotPointVisible(false);
        } else {
            this.setSpriteHotPointVisible(true);
            //this.spriteHotPoint.spriteFrame = this.spritePointList[index];
            this.spriteHotPoint.setFrame(type);
        }

        this.spriteHotPoint.node.stopAllActions();
        if (type == 0){
            this.spriteHotPoint.node.runAction(cc.repeatForever(cc.sequence(cc.fadeOut(1), cc.fadeIn(1))));
        } else {
            this.spriteHotPoint.node.opacity = 255;
        }
    },
    setSpriteHotPointVisible: function (visible) {
        visible = typeof visible !== 'undefined' ? visible : true;
        this.spriteHotPoint.node.active = visible;
    },

    setSpriteLevelBgVisible: function (visible) {
        visible = typeof visible !== 'undefined' ? visible : true;
        if (this.spriteLevelBg){
            this.spriteLevelBg.node.active = visible;
        }
    },

    setLabelLevelData: function (level) {
        level = typeof level !== 'undefined' ? level : 0;
        level = level.toString().replace(/[^0-9]/ig,"");;
        if (level != 0) {
            this.setLabelLevelDataVisible(true);
            this.setSpriteLevelBgVisible(true);
            // this.labelLevel.string = "Lv." + level;
            this.labelLevel.string = i18n.t('label.level').replace('%d', level);
        } else {
            this.setLabelLevelDataVisible(false);
            this.setSpriteLevelBgVisible(false);
        }
    },
    setLabelLevelDataVisible: function (visible) {
        visible = typeof visible !== 'undefined' ? visible : true;
        this.labelLevel.node.active = visible;
    },

    setLabelQualityNumberData: function (strName) {
        let index = strName.lastIndexOf('+');
        if (index != -1) {
            this.setLabelQualityNumberVisible(true);
            this.labelQualityNumber.string = strName.substr(index);
        } else {
            this.setLabelQualityNumberVisible(false);
        }
    },
    setLabelQualityNumberVisible: function (visible) {
        visible = typeof visible !== 'undefined' ? visible : true;
        this.labelQualityNumber.node.active = visible;
        this.spriteQualityNumberBg.node.active = visible;
    },

    setLabelNumberData: function (num, canOverLap) {
        if (this.itemData == null || typeof num === 'undefined' || num == -1/* || this.itemData.byType == GameServerProto.PT_ITEMTYPE_GUAZAI || this.itemData.byType == GameServerProto.PT_ITEMTYPE_MEMBER_EQUIP*/) {
            this.setLabelNumberVisible(false);
            this.labelNumber.string = 0;
        } else {
            this.setLabelNumberVisible(true);
            if (this.itemID == 2){
                num = num*10000;
            }
            if (this.itemData.byType != GameServerProto.PT_ITEMTYPE_VALUE && num > this.itemData.wOverlap && !canOverLap) {
                this.labelNumber.string = this.itemData.wOverlap;
            } else {
                if (num > 99999){
                    num = Math.floor(num / 10000);
                    num += "万";
                }
                this.labelNumber.string = num;
            }
        }
    },
    setLabelNumberVisible: function (visible) {
        visible = typeof visible !== 'undefined' ? visible : true;
        this.labelNumber.node.active = visible;
        this.spriteNumber.node.active = visible;
    },
    getLabelNumberData: function () {
        return this.labelNumber.string;
    },

    setRichtextNumber: function (front, back) {
        front = typeof front !== 'undefined' ? front : 0;
        back = typeof back !== 'undefined' ? back : 0;
        if (this.itemData == null) {
            this.setRichtextNumberVisible(false);
        } else {
            this.setLabelNumberVisible(false);
            this.setRichtextNumberVisible(true);
            if (front < back) {
                let str = "<color=#FF492B>" + front + "</c><color=#FFFFFF>/" + back + "</color>";
                this.richtextNumber.string = str;
            } else {
                let str = "<color=#00FF00>" + front + "</c><color=#FFFFFF>/" + back + "</color>";
                this.richtextNumber.string = str;
            }
        }
    },
    setRichtextNumberVisible: function (visible) {
        visible = typeof visible !== 'undefined' ? visible : true;
        this.richtextNumber.node.active = visible;
        this.spriteNumber.node.active = visible;
    },

    setSpriteChoosingVisible: function (visible) {
        visible = typeof visible !== 'undefined' ? visible : false;
        //this.spriteChoosing.node.active = visible;
        this.spriteChoosing.enabled = visible;
    },
    setSpriteChoosingState: function () {
        if (this.spriteChoosing.enabled) {
            this.spriteChoosing.enabled = false;
        } else {
            this.spriteChoosing.enabled = true;
        }
    },
    getSpriteChoosingState: function () {
        return this.spriteChoosing.enabled;
    },

    setNodeAddVisible: function (visible) {
        visible = typeof visible !== 'undefined' ? visible : false;
        this.nodeAdd.active = visible;
    },

    setShaderState: function (state) {
        state = typeof state !== 'undefined' ? state : false;
        if (state) {
            this.setNodeAddVisible(true);
            this.nodeAdd.getChildByName("spriteGrayBack").active = true;
            this.nodeAdd.getChildByName("spriteAdd").active = false;
        } else {
            this.nodeAdd.getChildByName("spriteGrayBack").active = false;
            this.setNodeAddVisible(false);
        }
    },

    setAllVisible: function (isVisible) {
        this.setSpritePieceVisible(isVisible);
        this.setSpriteQualityIconVisible(isVisible);
        this.setSpriteHotPointVisible(isVisible);
        this.setLabelLevelDataVisible(isVisible);
        this.setLabelQualityNumberVisible(isVisible);
        this.setSpriteLevelBgVisible(isVisible);
        this.setLabelNumberVisible(isVisible);
        this.setRichtextNumberVisible(isVisible);
        this.setSpriteChoosingVisible(isVisible);
        this.setNodeAddVisible(isVisible);
    },
});