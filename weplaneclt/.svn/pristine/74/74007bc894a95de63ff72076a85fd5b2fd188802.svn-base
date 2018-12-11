const Defines = require('BattleDefines')
const CoreObject = require('CoreObject')
const RemoteSprite = require("RemoteSprite")

cc.Class({
    extends: CoreObject,

    properties: {
        pic: {
            default: null,
            type: RemoteSprite
        }
    },

    initBuff: function (id) {

        if (id == Defines.Assist.WEAPON_UP) {
            this.pic.getComponent("RemoteSprite").loadFrameFromLocalRes("cdnRes/battle/battle_buff_1");
        } else if (id == Defines.Assist.SUPER) {
            this.pic.getComponent("RemoteSprite").loadFrameFromLocalRes("cdnRes/battle/battle_buff_5");
        } else if (id == Defines.Assist.PROTECT) {
            this.pic.getComponent("RemoteSprite").loadFrameFromLocalRes("cdnRes/battle/battle_buff_3");
        } else if (id == Defines.Assist.HP) {
            this.pic.getComponent("RemoteSprite").loadFrameFromLocalRes("cdnRes/battle/battle_buff_2");
        } else {
            this.pic.getComponent("RemoteSprite").loadFrameFromLocalRes("cdnRes/battle/battle_buff_4");
        }

        this.node.zIndex=(id);
        this.collider.size = this.node.getContentSize();
        return 1;
    },

});