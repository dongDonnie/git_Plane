const GlobalVar = require("globalvar");
const ResMapping = require("resmapping");
const UIBase = require("uibase");
const WndTypeDefine = require("wndtypedefine");
const CommonDefine = require("define");
const GameServerProto = require("GameServerProto");


const MSG_WND_PUSH_CP_DELAY = 0.4;

var self = null;
var pushMsgNodeArray = [];
var pushItemNodeArray = [];
var deltaCP = 0;
var pushCPDelay = 0;

var ComMsg = cc.Class({
    extends: UIBase,
    ctor: function () {
        this.scheduleHandler = null;
        this.showCount = 0;
        this.showCombatPointCount = 0;
        this.showAttrUpdateCount = 0;
        this.comMsgNode = null;
        this.showMsgNode = null;
        this.pushMsgNode = null;
        this.showMsgLbl = null;
        this.pushMsgLbl = null;
        this.showMsgImgBg = null;
        this.pushMsgImgBg = null;
        this.pushMsgCrit = null;

        this.pushItemNode = null;
        this.pushItemLayout = null;

        this.showCombatPointNode = null;
        this.showCombatPointLbl = null;
        this.showCombatPointDeltaLbl = null;
        this.showCombatPointImgBg = null;

        this.showAttrUpdateMsgNode = null;
        this.showAttrUpdateLblArray = [];

        this.dirty = true;
        this.curAction = null;
        this.curNode = null;
    },

    onLoad: function () {
        // cc.log("123456");
    },

    setNodeActiveFalse: function () {
        self.pushMsgNode = cc.find("PushMsgNode", self.comMsgNode);
        self.showMsgNode = cc.find("TextMsgNode", self.comMsgNode);
        self.pushItemNode = cc.find("PushItemNode", self.comMsgNode);
        self.showCombatPointNode = cc.find("CombatPointNode", self.comMsgNode);
        self.showAttrUpdateMsgNode = cc.find("ShowAttrUpdateMsgNode", self.comMsgNode);
        self.showCombatPointNode.active = false;
        self.pushItemNode.active = false;
        self.pushMsgNode.active = false;
        self.showMsgNode.active = false;
        self.showAttrUpdateMsgNode.active = false;
    },

    showMsg: function (text) {
        if (GlobalVar.me().isKickedOut) {
            return;
        }

        self = this;
        if (self.dirty || !self.comMsgNode) {
            self.dirty = false;
            GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, "cdnRes/prefab/Common/ComMsgNode.prefab", function (prefab) {
                if (prefab == null) {
                    return;
                }
                let parentNode = cc.find("Canvas/MsgNode");
                self.comMsgNode = cc.instantiate(prefab);
                parentNode.addChild(self.comMsgNode);
                self.setNodeActiveFalse();
                self.showMsgNode.active = true;
                self.showMsgImgBg = cc.find("TextMsgBg", self.showMsgNode);
                self.showMsgLbl = cc.find("TextMsgLbl", self.showMsgNode);
                self.showMsgLbl.getComponent(cc.Label).string = text;
                let winSize = cc.winSize;
                let goldPosY = winSize.height / (1 + 0.618) - winSize.height * 0.5;
                self.showMsgNode.y = goldPosY;
                // self.showMsgImgBg.setScale((1 + self.showMsgLbl.getContentSize().width / 640 * 1.1), 1);
                self.showMsgNode.runAction(self.getBlinkAction());
            });
        } else {
            try {
                if (self.showMsgNode.getNumberOfRunningActions() != 0) {
                    if (self.curAction) {
                        self.showMsgNode.stopAction(self.curAction);
                    }
                }

                self.showMsgLbl.getComponent(cc.Label).string = text;
                self.showMsgNode.opacity = (255);
                self.showMsgNode.runAction(cc.sequence(cc.scaleTo(0.01, 1, 0), cc.scaleTo(0.1, 1, 1)));
                self.showMsgNode.runAction(self.getBlinkAction());
            } catch (error) {
                self.comMsgNode = null;
                self.dirty = true;
                self.curAction = null;
                console.log("ComMsg showMsg: ", error);
            }
        }
    },

    pushMsg: function (count, crit) {
        self = this;
        self.msgPush();
        GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, "cdnRes/prefab/Common/ComMsgNode.prefab", function (prefab) {
            if (prefab == null) {
                return;
            }
            let parentNode = cc.find("Canvas/MsgNode");
            self.comMsgNode = cc.instantiate(prefab);
            parentNode.addChild(self.comMsgNode);
            self.setNodeActiveFalse();
            self.pushMsgNode.active = true;
            self.pushMsgImgBg = cc.find("CritImg", self.pushMsgNode);
            self.pushMsgLbl = cc.find("PushMsgLbl", self.pushMsgNode);
            self.pushMsgCrit = cc.find("CritImg", self.pushMsgNode);
            self.pushMsgLbl.getComponent(cc.RichText).string = '获得<color=#e6ab33>金币' + count + '</color>';
            if (crit > 1) {
                self.pushMsgLbl.x = -100;
                self.pushMsgCrit.getComponent("RemoteSprite").setFrame(crit - 2);
            } else {
                self.pushMsgCrit.active = false;
            }
            pushMsgNodeArray.push(self.pushMsgNode);
            if (pushMsgNodeArray.length > 4) {
                pushMsgNodeArray[0].parent.destroy();
                pushMsgNodeArray.splice(0, 1);
            }
            self.pushMsgNode.runAction(self.getFadeAction());
        });

    },

    pushItem: function (itemArray) {
        self = this;
        self.itemPush();
        var positionArray = [],
            count = 0;
        if (itemArray.length % 2 == 1) {
            positionArray.push(cc.v3(0, 0));
            for (i = 1; i < itemArray.length; i = i + 2) {
                var pos = count * 100 + 100;
                positionArray.push(cc.v3(pos, 0));
                positionArray.push(cc.v3(-pos, 0));
                count++;
            }
        } else {
            for (let i = 0; i < itemArray.length; i = i + 2) {
                var pos = count * 100 + 50;
                positionArray.push(cc.v3(pos, 0));
                positionArray.push(cc.v3(-pos, 0));
                count++;
            }
        }
        var compare = function (obj1, obj2) {
            if (obj1.x > obj2.x)
                return -1;
            else if (obj1.x < obj2.x)
                return 1;
            else
                return 0;
        }
        positionArray.sort(compare);

        GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, "cdnRes/prefab/Common/ComMsgNode.prefab", function (prefab) {
            if (prefab == null) {
                return;
            }
            let parentNode = cc.find("Canvas/MsgNode");
            self.comMsgNode = cc.instantiate(prefab);
            parentNode.addChild(self.comMsgNode);
            self.setNodeActiveFalse();
            self.pushItemNode.active = true;
            self.pushItemLayout = cc.find("ItemObjectLayout", self.pushItemNode);
            GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, "cdnRes/prefab/Common/ItemObject.prefab", function (itemobject) {
                if (itemobject == null) {
                    return;
                }
                for (let i = 0; i < itemArray.length; i++) {
                    var itemnode = cc.instantiate(itemobject);
                    itemnode.getComponent("ItemObject").updateItem(itemArray[i].ItemID, itemArray[i].Count);
                    //itemnode.setPosition(i * 100, 0);
                    itemnode.setPosition(positionArray[i].x, positionArray[i].y);
                    self.pushItemNode.addChild(itemnode);
                }
                pushItemNodeArray.push(self.pushItemNode);
                self.pushItemNode.runAction(self.getItemFadeAction());
            });
        });
    },

    msgPush: function () {
        if (pushMsgNodeArray.length == 0)
            return;
        for (let i = 0; i < pushMsgNodeArray.length; i++) {
            pushMsgNodeArray[i].runAction(cc.moveTo(0.16, cc.v3(pushMsgNodeArray[i].x, pushMsgNodeArray[i].y + self.pushMsgImgBg.height - 20)));
        }
    },

    itemPush: function () {
        if (pushItemNodeArray == 0)
            return;
        for (let i = 0; i < pushItemNodeArray.length; i++) {
            pushItemNodeArray[i].runAction(cc.moveTo(0.16, cc.v3(pushItemNodeArray[i].x, pushItemNodeArray[i].y + 150)));
        }
    },

    getBlinkAction: function () {
        // let self = this;
        let fadeTo = cc.fadeTo(1, 0); // 0.8
        let delayAction = cc.delayTime(1.0); // 0.5
        let sequence = cc.sequence(delayAction, fadeTo, cc.callFunc(function (target) {
            target.parent.destroy();
            self.dirty = true;
            self.curAction = null;
            self.comMsgNode = null;
        }));
        this.curAction = sequence;
        return sequence;
    },

    getFadeAction: function () {
        // let self = this;
        let fadeOut = cc.fadeOut(0.5);
        let moveAction = cc.moveTo(0.16, self.pushMsgNode.getPosition().add(cc.v3(0, self.pushMsgImgBg.getContentSize().height + 10)));
        let sequence = cc.sequence(moveAction, cc.delayTime(1.4), fadeOut, cc.callFunc(function (target) {
            target.parent.destroy();
            pushMsgNodeArray.splice(0, 1);
            self.curAction = null;
        }));
        this.curAction = sequence;
        return sequence;
    },

    getItemFadeAction: function () {
        // let self = this;
        let fadeOut = cc.fadeOut(0.5);
        let sequence = cc.sequence(cc.delayTime(1.4), fadeOut, cc.callFunc(function (target) {
            // cc.log(target);
            target.parent.destroy();
            pushItemNodeArray.splice(0, 1);
            self.curAction = null;
        }));
        this.curAction = sequence;
        return sequence;
    },

    showCombatPoint: function (delta, combatPoint, lastCombatPoint) {
        if (GlobalVar.me().isKickedOut) {
            return;
        }
        self = this;
        if (self.showCombatPointCount == 0) {
            self.showCombatPointCount++;
            GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, "cdnRes/prefab/Common/ComMsgNode.prefab", function (prefab) {
                if (prefab == null) {
                    return;
                }
                let parentNode = cc.find("Canvas/MsgNode");
                self.comMsgNode = cc.instantiate(prefab);
                parentNode.addChild(self.comMsgNode);
                self.setNodeActiveFalse();
                self.showCombatPointNode.active = true;
                self.showCombatPointLbl = cc.find("CombatPointLbl", self.showCombatPointNode);
                self.showCombatPointDeltaLbl = cc.find("CombatPointDeltaLbl", self.showCombatPointNode);
                self.showCombatPointImgBg = cc.find("CombatPointImgBg", self.showCombatPointNode);
                let winSize = cc.winSize;
                let goldPosY = winSize.height / (1 + 0.618) - winSize.height * 0.4;
                self.comMsgNode.y = goldPosY;
                self.curPoint = lastCombatPoint;
                self.curDelta = 0;
                self.showCombatPointImgBg.setScale(0, 1);
                self.showCombatPointImgBg.runAction(cc.sequence(cc.fadeIn(0.032), cc.scaleTo(0.128, 1)));
                self.showCombatPointLbl.opacity = (0);
                self.showCombatPointLbl.getComponent(cc.Label).string = lastCombatPoint;
                self.showCombatPointLbl.runAction(cc.sequence(cc.delayTime(0.24), cc.fadeIn(0.032)));
                self.showCombatPointDeltaLbl.opacity = (0);
                self.showCombatPointDeltaLbl.getComponent(cc.Label).string = "/" + 0;
                self.showCombatPointDeltaLbl.runAction(cc.sequence(cc.delayTime(0.24), cc.fadeIn(0.032)));
                self.scheduleHandler = GlobalVar.gameTimer().startTimer(function () {
                    self.addCombatPoint(0.016, delta, combatPoint);
                }, 0.016, 0.5);
            });
        }
    },

    addCombatPoint: function (dt, delta, combatPoint) {
        self.curPoint += delta / (dt * 1200);
        self.curDelta += delta / (dt * 1200);
        self.showCombatPointLbl.getComponent(cc.Label).string = parseInt(self.curPoint);
        self.showCombatPointDeltaLbl.getComponent(cc.Label).string = "/" + parseInt(self.curDelta);
        if (self.curDelta >= delta) {
            GlobalVar.gameTimer().delTimer(self.scheduleHandler);
            self.showCombatPointLbl.getComponent(cc.Label).string = combatPoint;
            self.showCombatPointDeltaLbl.getComponent(cc.Label).string = "/" + delta;
            self.showCombatPointLbl.runAction(cc.sequence(cc.delayTime(0.5), cc.fadeOut(0.016)));
            self.showCombatPointDeltaLbl.runAction(cc.sequence(cc.delayTime(0.5), cc.fadeOut(0.016)));
            self.showCombatPointImgBg.runAction(cc.sequence(cc.delayTime(0.8), cc.scaleTo(0.128, 0, 1), cc.fadeOut(0.016), cc.callFunc(function (target) {
                self.showCombatPointCount--;
                target.parent.parent.removeFromParent();
            })));
        }
    },

    showAttrUpdateMsg: function (attrArray, type, delayTime) {
        type = type ? type : 0;
        delayTime = delayTime ? delayTime : 0.1;
        self = this;
        if (self.showAttrUpdateCount === 0) {
            self.showAttrUpdateCount++;
            GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, "cdnRes/prefab/Common/ComMsgNode.prefab", function (prefab) {
                if (prefab == null) {
                    return;
                }
                let parentNode = cc.find("Canvas/MsgNode");
                self.comMsgNode = cc.instantiate(prefab);
                parentNode.addChild(self.comMsgNode);
                self.setNodeActiveFalse();
                self.showAttrUpdateMsgNode.active = true;
                self.getAttrUpdateAction(attrArray, type, delayTime);
            });
        } else {
            while (1) {
                var child = self.curNode;
                if (!!child) {
                    child.removeFromParent();
                    child.destroy();
                } else {
                    break;
                }
            }
            self.getAttrUpdateAction(attrArray, type, delayTime);
        }
    },

    getAttrUpdateAction: function (attrArray, type, delayTime) {
        var positionArray = [];
        var isUpper = false,
            upCount = 1,
            downCount = 0;
        for (let i = 0; i < attrArray.length + 1; i++) {
            if (isUpper) {
                var height = 100 + (45 * upCount++);
                positionArray.push(cc.v3(0, height));
            } else {
                var height = 100 + (-45 * downCount++);
                positionArray.push(cc.v3(0, height));
            }
            isUpper = !isUpper;
        }
        var compare = function (obj1, obj2) {
            if (obj1.y > obj2.y)
                return -1;
            else if (obj1.y < obj2.y)
                return 1;
            else
                return 0;
        }
        positionArray.sort(compare);

        /*根据模式选取图片*/
        var imgNode = new cc.Node("imgNode");
        this.curNode = imgNode;
        let imgType = imgNode.addComponent(cc.Sprite);
        self.showAttrUpdateMsgNode.addChild(imgNode);
        switch (type) {
            case 0:
                imgType.spriteFrame = GlobalVar.resManager().loadRes(ResMapping.ResType.SpriteFrame, "ui/textures/common/msg/shengji.png",
                    function (img) {
                        imgType.spriteFrame = img;
                    });
                break;
            case 1:
                imgType.spriteFrame = GlobalVar.resManager().loadRes(ResMapping.ResType.SpriteFrame, "ui/textures/common/msg/jinjie.png",
                    function (img) {
                        imgType.spriteFrame = img;
                    });
                break;
            default:
                break;
        }

        imgNode.setPosition(positionArray[0]);
        //var sequence = cc.sequence(cc.delayTime(delayTime), cc.scaleTo(0.08, 1.3), cc.scaleTo(0.12, 1.0), cc.delayTime(0.8), cc.fadeOut(0.32), cc.removeSelf(), null);
        imgNode.runAction(cc.sequence(cc.delayTime(delayTime), cc.scaleTo(0.08, 1.3), cc.scaleTo(0.12, 1.0),
            cc.delayTime(0.8), cc.fadeOut(0.32), cc.callFunc(function (target) {
                target.destroy();
                self.showAttrUpdateCount--;
            })));
        for (let i = 0; i < attrArray.length; i++) {
            var attrNode = new cc.Node("Node" + i);
            attrNode.addComponent(cc.Label);
            this.curNode = attrNode;
            self.showAttrUpdateMsgNode.addChild(attrNode);
            self.showAttrUpdateMsgNode.getChildByName("Node" + i).getComponent(cc.Label).string = attrArray[i];
            self.showAttrUpdateMsgNode.getChildByName("Node" + i).setPosition(positionArray[i + 1].x, positionArray[i + 1].y);
            self.showAttrUpdateMsgNode.getChildByName("Node" + i).runAction(cc.sequence(cc.delayTime(delayTime), cc.scaleTo(0.08, 1.3),
                cc.scaleTo(0.12, 1.0), cc.delayTime(0.8), cc.fadeOut(0.32), cc.removeSelf()));
        }
    },

    errorWarning: function (errCode) {
        let errMsg = GlobalVar.tblApi.getDataBySingleKey('TblErrString', errCode);
        if (errMsg) {
            this.showMsg(errMsg.strString);
        } else {
            console.log("errCode:" + errCode + " string can not find");
        }
    },
});