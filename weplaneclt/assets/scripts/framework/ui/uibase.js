var GlobalVar = require("globalvar");
const ResMapping = require("resmapping");

var UIBase = cc.Class({
    extends: cc.Component,
    ctor:function() {
        //this.node = null;
        this.fixViewComplete = false;
        
    },

    onCtor:function(subClass,node) {
        //this.node =  node;

    },

    onLoad: function () {
        let node = new cc.Node("nodeBlock");
        node.addComponent(cc.BlockInputEvents);
        node.width = cc.winSize.width;
        node.height = cc.winSize.height;
        this.node.addChild(node);
        this.nodeBlock = node.getComponent(cc.BlockInputEvents);
        this.nodeBlock.enabled = false;
    },
    
    properties: {
        fixViewComplete: {
            default: false,
            visible: false,
        },
    },

    unRegisterEvents:function(){
        GlobalVar.eventManager().removeListenerWithTarget(this);
    },

    onDestroy: function () {
        GlobalVar.eventManager().removeListenerWithTarget(this);
    },

    // 创建一个node
    instantiateNode:function(perfab) {
        var newNode = cc.instantiate(perfab);
        return newNode;
    },

    //更改父节点
    changeParentNode:function(newParentNode) {
        this.node.removeFromParent(false);
        newParentNode.addChild(this.node);
    },

    //添加到父节点
    setParentNode:function(parentNode) {
        if (parentNode != null) {
            parentNode.addChild(this.node);
        }	
    }, 

    ///////UI便捷读取封装
    seekNodeByName: function(root, name) {
        if (!root) {
            return null;
        }
        if (root.name === name) {
            return root;
        }
        var arrayRootChildren = root.children;
        var length = arrayRootChildren.length;
        for (var i=0; i < length; i++)
        {
            var child = arrayRootChildren[i];
            var res = this.seekNodeByName(child, name);     //子节点递归寻找
            if (res != null)
            {
                return res;
            }
        }
        return null;
    },

    getNodeByName: function(name) {
        if (typeof name != "string" || this.node == null)
            return null;

        return this.seekNodeByName(this.node, name);
    },

    getButtonByName: function(name) {
        return this.getNodeByName(name).getComponent(cc.Button);
    },

    getLabelByName: function(name) {
        return this.getNodeByName(name).getComponent(cc.Label);
    },

    getRichTextByName: function(name) {
        return this.getNodeByName(name).getComponent(cc.RichText);
    },

    getSpriteByName: function(name) {
        return this.getNodeByName(name).getComponent(cc.Sprite);
    },

    getEditBoxByName: function(name) {
        return this.getNodeByName(name).getComponent(cc.EditBox);
    },

    getPageViewByName: function(name) {
        return this.getNodeByName(name).getComponent(cc.PageView);
    },

    getProgressBarByName: function(name) {
        return this.getNodeByName(name).getComponent(cc.ProgressBar);
    },

    getScrollViewByName: function(name) {
        return this.getNodeByName(name).getComponent(cc.ScrollView);
    },

    getWidgetByName: function(name) {
        return this.getNodeByName(name).getComponent(cc.WidgetName);
    },

    getToggleByName: function(name) {
        return this.getNodeByName(name).getComponent(cc.Toggle);
    },

    getTabBtnViewByName: function(name) {
        return this.getNodeByName(name).getComponent('tabbtnview');
    },

    getUILoopScrollViewByName: function(name) {
        return this.getNodeByName(name).getComponent('uiloopscrollview');
    },

    getUIPageViewByName: function(name) {
        return this.getNodeByName(name).getComponent('uipageview');
    },

    setSpriteByName: function(spriteName, frameName, cb) {
        // var spriteCompo = this.getSpriteByName(spriteName);
        // var _textureFilename = spriteCompo.spriteFrame._textureFilename;
        // var splits = _textureFilename.split('/');
        // var filepath = 'ui/textures/' + splits[splits.length-2] + '/' + frameName + '.png';
        // GlobalVar.resManager().loadRes(ResMapping.ResType.SpriteFrame, filepath, function(spriteFrame) {
        //     spriteCompo.spriteFrame = spriteFrame;
        //     if (!!cb) cb();
        // });
    },
});