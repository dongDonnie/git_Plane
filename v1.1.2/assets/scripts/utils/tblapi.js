var TblApi = cc.Class({

    ctor: function () {
        this.map = {};
    },

    init: function (cb) {
        var self = this;
        cc.loader.loadRes("data/tblall", function (err, res) {
            // console.log("load tblall.json start, current time:", new Date().getTime());
            if (err) {
                console.error(err);
                if (!!cb) cb(false);
            } else {
                var tbldata = JSON.parse(JSON.stringify(res.json));
                // console.log("go through tblall to save data, current time:", new Date().getTime());
                for (var o in tbldata) {
                    //console.info('[tbl] ' + o + ".tbl load.");
                    self.map[o] = {};
                    self.map[o].data = tbldata[o];
                    self.map[o].length = 0;

                    for (var l in self.map[o].data) {
                        self.map[o].length++;
                    }
                }

                if (!!cb) cb(true);
            }
            // console.log("load tblall.json end, current time:", new Date().getTime());
        });
    },

    getLength: function (tblName) {
        if (!!this.map[tblName]) {
            return this.map[tblName].length;
        }
        return null;
    },

    getDataBySingleKey: function (tblName, key) {
        if (!!this.map[tblName]) {
            if (!!this.map[tblName].data[key]) {
                return this.map[tblName].data[key];
            }
        }
        return null;
    },

    getDataBySetKey: function (tblName, setKey) {
        if (!!this.map[tblName]) {
            if (!!this.map[tblName].data[setKey]) {
                return this.map[tblName].data[setKey];
            }
        }
        return null;
    },

    getDataByMultiKey: function (tblName, key1, key2) {
        if (!!this.map[tblName]) {
            var key = key1 + '_' + key2;
            if (!!this.map[tblName].data[key]) {
                return this.map[tblName].data[key];
            }
        }
        return null;
    },

    getData: function (tblName) {
        if (!!this.map[tblName]) {
            if (!!this.map[tblName].data) {
                return this.map[tblName].data;
            }
        }
        return null;
    }
});