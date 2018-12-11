
const GlobalVar = require("globalvar");
const ResMapping = require("resmapping");
var self = null;

var FloatMsg = cc.Class({
    ctor: function() {
        this.count = 0;
        this.tipsNode = null;
        this.tipsLabel = null;
    },

    show:function(text) {
        this.parentNode = cc.find("Canvas/MsgLayer");

        self = this;
        
        if (self.count == 0 ) {            
            self.count ++;
            GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, "cdnRes/prefab/com_text_tip.prefab",function(perfab) {
                self.tipsNode = cc.instantiate(perfab);
                self.parentNode.addChild(self.tipsNode);            
                self.tipsNode.setScale(1,0);

                self.tipsLabel = cc.find("label_text",self.tipsNode);
                self.tipsLabel.getComponent(cc.Label).string = text;
                
                self.tipsNode.runAction(self.getAction());
            });
        }
        else {
            self.tipsLabel.getComponent(cc.Label).string = text;

            self.tipsNode.stopActionByTag(1);
            self.tipsNode.runAction(self.getAction());
        }        
    },

    getAction:function() {        
        let scaleAction01 = cc.scaleTo(0.1,1,1);
        let delayAction = cc.delayTime(2);
        let scaleAction02 = cc.scaleTo(0.1,1,0);
        let sequence = cc.sequence(scaleAction01,delayAction,scaleAction02,cc.callFunc(function(target){                   
            target.destroy();
            self.count --;
        }));
        sequence.setTag(1);

        return sequence;
    },
});
