const UIBase = require("uibase");
cc.Class({
    extends: UIBase,

    properties: {
        spriteFighterRank: {
            default: null,
            type: cc.Sprite
        },
        spriteFighter: {
            default: null,
            type: cc.Sprite
        },
        spriteState: {
            default: null,
            type: cc.Sprite
        },
        memberID: {
            default: 0,
            visible: false,
        },
    },

    onLoad: function () {

    },

    init: function (memberID, quality, state) {
        this.setFighter(memberID);
        this.setQuality(quality);
        this.setState(state);
    },

    setQuality: function (quality) {
        
        let index = typeof quality !== 'undefined' ? (Math.floor(quality / 100) < 0 ? 0 : Math.floor(quality / 100)) : 0;
        this.spriteFighterRank.getComponent("RemoteSprite").setFrame(index);
    },

    setFighter: function (memberID) {
        memberID = typeof memberID !== 'undefined' ? memberID : 710;
        this.memberID = memberID;
        let index = 0;
        switch (memberID) {
            case 710:
                index = 0;
                break;
            case 720:
                index = 1;
                break;
            case 730:
                index = 2;
                break;
            case 740:
                index = 3;
                break;
            case 750:
                index = 4;
                break;
            case 760:
                index = 5;
                break;
            case 770:
                index = 6;
                break;
            case 780:
                index = 7;
                break;
            case 790:
                index = 8;
                break;
            case 1810:
                index = 9;
                break;
            case 1820:
                index = 10;
                break;
            default:
                index = 0;
                break;
        }
        this.spriteFighter.getComponent("RemoteSprite").setFrame(index);
    },

    setState: function (state) {
        state = typeof state !== 'undefined' ? state : -1;
        if (state == 0) {
            this.spriteState.node.active = true;
            this.spriteState.getComponent("RemoteSprite").setFrame(0);
        } else if (state == 1) {
            this.spriteState.node.active = true;
            this.spriteState.getComponent("RemoteSprite").setFrame(1);
        } else {
            this.spriteState.node.active = false;
        }
    },

    setHotFlag: function (flag) {
        this.node.getChildByName("spriteHot").active = !!flag;
    },

});