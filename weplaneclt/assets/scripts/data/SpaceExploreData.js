
const GlobalVar = require('globalvar');
const EventMsgID = require("eventmsgid");
const GameServerProto = require("GameServerProto");

var self = null;
var spaceExploreData = cc.Class({

    properties: {
        data: null,
    },

    ctor: function() {
        self = this;
        self.exploreData = {
            AreaID:1,
            Progress:0,
            NaiLi:0,
            RecoverTime:0,
            GemEndTime:0,
            GemTimes:0,
            Chest:[],
            XingBi:0
        }; 
        /********exploreData********/
        /*
            <item name="AreaID" type="UINT8" />
            <item name="Progress" type="UINT16" />
            <item name="NaiLi" type="UINT16" />
            <item name="RecoverTime" type="UINT32" />
            <item name="GemEndTime" type="UINT32" />
            <item name="GemTimes" type="UINT16" />
            <item name="Chest" type="vector" member_type="GMDT_EXPLORE_CHEST" max_count="PT_EXPLORE_CHEST_MAX" />
            <item name="XingBi" type="INT32" />
        */
    },

    setExploreData: function(data){
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            self.exploreData = data.ExploreBag;
            GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_EXPLORE_DATA_GET,data.ItemGet);
        }        
        else {
            GlobalVar.comMsg.errorWarning(data.ErrCode);
        }
    },

    getExploreData: function(){
        return self.exploreData;
    },

    getCurAreaId:function() {
        return self.exploreData.AreaID==null ? 1 : self.exploreData.AreaID;
    },

    getExploreCount:function() {
        return self.exploreData.NaiLi==null ? 1 : self.exploreData.NaiLi;
    },
});

module.exports = spaceExploreData;