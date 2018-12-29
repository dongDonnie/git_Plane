var self = null;
cc.Class({
    extends: cc.Component,

    editor: {
        requireComponent: cc.Mask,
    },

    properties: {
        itemTemplate: cc.Node,
        content: cc.Node,
        spaceingX: 0,
        spaceingY: 0,
    },

    onLoad() {
        self = self;
        
        self.items = [];
        self.initialize();
        self.updateTimer = 0;
        self.updateInterval = 0.2;
        self.lastContentPosY = 0;
    },

    initialize: function () {
        self.content.height = self.totalCount * (self.itemTemplate.height + self.spacing) + self.spacing;
        for (let i = 0; i < self.spawnCount; ++i) {
            let item = cc.instantiate(self.itemTemplate);
            self.content.addChild(item);
            item.setPosition(0, -item.height * (0.5 + i) - self.spacing * (i + 1));
            item.getComponent('Item').updateItem(i, i);
            self.items.push(item);
        }
    },


    update: function (dt) {

    },
});
