const CoreObject = require('CoreObject')
const GlobalVar = require("globalvar")
const RemoteSprite = require("RemoteSprite")

cc.Class({
    extends: CoreObject,

    properties: {
        pic: {
            default: null,
            type: RemoteSprite
        }
    },

    initBullet: function (id) {

        let item = GlobalVar.tblApi.getDataBySingleKey('TblBattleBullet', id);
        if (!!item) {
            this.pic.getComponent("RemoteSprite").loadFrameFromLocalRes("cdnRes/bullets/" + item.strName);
            let size=this.node.getContentSize();
            size.width*=0.7;
            size.height*=0.7;
            this.collider.size = size;//this.node.getContentSize();
            return item.dScale;
        }

        return 1;
    },
});