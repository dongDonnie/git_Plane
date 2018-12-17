var self = null;
cc.Class({
    extends: cc.Component,

    editor: {
        requireComponent: cc.Mask,
    },

    properties: {
        contentNode: cc.Node,
        inertia: false,
        spaceingX: 0,
        spaceingY: 0,
        horizontal: false,
        itemPrefab: cc.Prefab,
        cancelInnerEvent: true,
    },

    onLoad() {
        self = this;
        if (self.horizontal) {
            self.contentNode.anchor = cc.v2(0, 0.5);
            self.contentNode.x = -self.node.width / 2;
        } else {
            self.contentNode.anchor = cc.v2(0.5, 1);
            self.contentNode.y = self.node.height / 2;
        }

        self.node.on('touchstart', self.touchstart);
        self.node.on('touchmove', self.touchmove);
        self.node.on('touchend', self.touchend);
        self.node.on('touchcancel', self.touchcancel);
    },

    touchstart: function (event,data) {
        
    },

    touchmove: function (event,data) {
        
    },

    touchend: function (event,data) {
        
    },

    touchcancel: function (event,data) {
        
    },

    update: function (dt) {
        
    },
});
