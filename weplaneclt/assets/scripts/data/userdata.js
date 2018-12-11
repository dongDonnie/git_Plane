var self = null;
var UserData = cc.Class({
    ctor: function() {
        self = this;

        self.id = 0;
        self.name = "";
        self.lv = 0;
        self.playerData=null;
    },

    setBaseData: function(user) {
        self.id = user.id;
        self.name = user.name;
        self.lv = user.lv;
    },

    getPlayerName:function() {
        return self.name;
    },

    setPlayerData: function(data) { 
        self.id=data.data.Player.RoleID;
        self.playerData=data;
    },
});

module.exports = UserData;
