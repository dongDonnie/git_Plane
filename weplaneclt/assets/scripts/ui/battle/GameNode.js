const BattleManager = require('BattleManager')
const Defines = require('BattleDefines')
const HeroManager = require('HeroManager')

cc.Class({
    extends: cc.Component,

    properties: {
        

    },

    onLoad () {
    },

    start () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoved, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    },

    update (dt) {

    },

    onTouchBegan: function(event) {
        HeroManager.getInstance().onTouchBegan(event);
    },

    onTouchMoved: function(event) {
        HeroManager.getInstance().onTouchMoved(event);
    },

    onTouchEnd: function(event) {
        HeroManager.getInstance().onTouchEnd(event);
    },

    onTouchCancel: function(event) {
        HeroManager.getInstance().onTouchCancel(event);
    },
});
