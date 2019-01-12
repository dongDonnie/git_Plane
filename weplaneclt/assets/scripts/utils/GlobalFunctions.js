
const StoreageData = require("storagedata");
var gf = module.exports;

gf.LabelColor = {
    White: '255,255,255,255',
    CCWhite: new cc.color(255, 255, 255, 255),
    Green: '125,255,94,255',
    CCGreen: new cc.color(125, 255, 94, 255),
    Blue: '17,203,255,255',
    CCBlue: new cc.color(17, 203, 255, 255),
    Purple: '236,82,255,255',
    CCPurple: new cc.color(236, 82, 255, 255),
    Orange: '251,209,60,255',
    CCOrange: new cc.color(251, 209, 60, 255),
    Red: '255,73,43,255',
    CCRed: new cc.color(255, 73, 43, 255),
    HalfOpacityGrey: '50,50,50,165',
    CCHOGrey: new cc.color(50, 50, 50, 165),
    LightBlue: '178,211,255,255',
    CCLightBlue: new cc.color(178, 211, 255, 255),
    Cyan: '197,234,255,255',
    CCCyan: new cc.color(197, 234, 255, 255),
    Pansy: '117,134,207,255',
    CCPansy: new cc.color(117, 134, 207, 255),
    ShaderCyan: '182,196,205,255',
    CCShaderCyan: new cc.color(182, 196, 205, 255),
    ShaderPansy: '129,136,165,255',
    CCShaderPansy: new cc.color(129, 136, 165, 255),
    CCGuazaiColor1: new cc.color(139, 155, 217, 255),
    CCGuazaiColor2: new cc.color(255, 249, 217, 255),
};

gf.getColorByQuality = function (quality) {
    if (quality < 100) {
        return gf.LabelColor.White;
    } else if (quality < 200) {
        return gf.LabelColor.Green;
    } else if (quality < 300) {
        return gf.LabelColor.Blue;
    } else if (quality < 400) {
        return gf.LabelColor.Purple;
    } else if (quality < 500) {
        return gf.LabelColor.Orange;
    } else {
        return gf.LabelColor.Red;
    }
};

gf.getCCColorByQuality = function (quality) {
    if (quality < 100) {
        return gf.LabelColor.CCWhite;
    } else if (quality < 200) {
        return gf.LabelColor.CCGreen;
    } else if (quality < 300) {
        return gf.LabelColor.CCBlue;
    } else if (quality < 400) {
        return gf.LabelColor.CCPurple;
    } else if (quality < 500) {
        return gf.LabelColor.CCOrange;
    } else {
        return gf.LabelColor.CCRed;
    }
};

gf.getSystemColor = function (index) {
    switch (index) {
        case 0: return gf.LabelColor.CCWhite;
        case 1: return gf.LabelColor.CCGreen;
        case 2: return gf.LabelColor.CCBlue;
        case 3: return gf.LabelColor.CCPurple;
        case 4: return gf.LabelColor.CCOrange;
        case 5: return gf.LabelColor.CCRed;
        case 6: return gf.LabelColor.CCHOGrey;
        case 7: return gf.LabelColor.CCLightBlue;
        case 8: return gf.LabelColor.CCCyan;
        case 9: return gf.LabelColor.CCPansy;
        case 10: return gf.LabelColor.CCShaderCyan;
        case 11: return gf.LabelColor.CCShaderPansy;
        case 12: return gf.LabelColor.CCGuazaiColor1;
        case 13: return gf.LabelColor.CCGuazaiColor2;
        default: return gf.LabelColor.CCWhite;
    }
};

gf.isAllScreen = function () {
    let frameSize = cc.view.getFrameSize();
    if (frameSize.width < frameSize.height) {
        frameSize.width = frameSize.width + frameSize.height;
        frameSize.height = frameSize.width - frameSize.height;
        frameSize.width = frameSize.width - frameSize.height;
    }
    //cc.log("FrameSize: width "+frameSize.width+" height "+frameSize.height);
    let pY = 9;
    let param = frameSize.height / pY;
    let pX = frameSize.width / param;
    if (pX >= 18) {
        return true;
    }
    return false;
};

gf.getShareCanGetGold = function (level) {
    let canGetGold = 2000 + 200000 * level / (level + 40);
    canGetGold = (parseInt(canGetGold / 100) + 1) * 100;
    return canGetGold;
};

gf.interceptStr = function (str, lens, strEnd) {
    if (str == null)
        return '';
    if (strEnd == undefined) strEnd = '';
    let len = 0;
    for (let i = 0; i < str.length; i++) {
        let c = str.charCodeAt(i);
        if (c >= 0 && c <= 128)
            len++;
        else
            len += 2;
        if (len > lens)
            return str.substr(0, i) + strEnd;
    }
    return str;
};

gf.playDragonBonesAnimation = function (node, callback, ani, playtimes) {
    let block = cc.find("Canvas/BlockNode");
    if(cc.isValid(block)){
        block.active = true;
    }
    node.active = true;
    ani = ani == undefined ? 'animation' : ani;
    playtimes = playtimes == undefined ? 1 : playtimes;
    node.getComponent(dragonBones.ArmatureDisplay).playAnimation(ani, playtimes);
    let complete = function (event) {
        if(cc.isValid(block)){
            block.active = false;
        }
        var animationName = event.animationState ? event.animationState.name : "";
        if (animationName == ani && !!callback) {
            callback();
        }
        node.getComponent(dragonBones.ArmatureDisplay).removeEventListener(dragonBones.EventObject.COMPLETE);
    };
    node.getComponent(dragonBones.ArmatureDisplay).addEventListener(dragonBones.EventObject.COMPLETE, complete);
};

gf.stopDragonBonesAnimation = function (node) {
    if (!node.getComponent(dragonBones.ArmatureDisplay)) return;
    node.getComponent(dragonBones.ArmatureDisplay).armature().animation.stop();
};

gf.playSpineAnimation = function (node, callback, isClearTracks, trackIndex, ani, loop) {
    node.active = true;
    isClearTracks = isClearTracks == undefined ? true : isClearTracks;
    trackIndex = trackIndex == undefined ? 0 : trackIndex;
    ani = ani == undefined ? 'animation' : ani;
    loop = loop == undefined ? false : loop;
    if (isClearTracks) {
        node.getComponent(sp.Skeleton).clearTracks();
        node.getComponent(sp.Skeleton).setAnimation(trackIndex, ani, loop);
    }
    node.getComponent(sp.Skeleton).setCompleteListener(trackEntry => {
        var animationName = trackEntry.animation ? trackEntry.animation.name : "";
        if (animationName == ani && !!callback) {
            callback();
        }
    })
};

gf.converToOtherNodeSpaceAR = function (originNode, targetNode) {
    let worldPos = originNode.parent.convertToWorldSpaceAR(originNode);
    var nodePos = targetNode.parent.convertToNodeSpaceAR(worldPos);
    targetNode.setPosition(nodePos);
};

gf.getRandomString = function () {
    let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    let maxPos = chars.length;
    let pwd = '';
    for (var i = 0; i < 32; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
};

gf.iosOrAndr = function () {
    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
        return wx.getSystemInfoSync().platform == 'ios' ? 1 : 2;
    }
    return 2;
};

gf.checkLink = function (link) {
    return (typeof link == "string") && link != "";
};

gf.getGender = function () {
    return 0;
};