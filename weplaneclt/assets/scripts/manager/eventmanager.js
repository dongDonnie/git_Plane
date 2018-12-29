var EventManager = cc.Class({
    ctor: function () {
        this.listenerList = {};
    },

    statics: {
        instance: null,
        getInstance: function () {
            if (EventManager.instance == null) {
                EventManager.instance = new EventManager();
            }
            return EventManager.instance;
        },
        destroyInstance() {
            if (EventManager.instance != null) {
                delete EventManager.instance;
                EventManager.instance = null;
            }
        }
    },

    addEventListener: function (event, fun, target) {
        if (event == null) {
            cc.error('invalid eventName');
            return;
        }
        if (fun == null){
            cc.error('invalid fun');
            return;
        }
        if (target == null){
            cc.error('invalid  target');
            return;
        }
        var obj = this.listenerList[event];
        if (obj == null) {
            this.listenerList[event] = [];
            this.listenerList[event].push({ target, fun });
        }
        else {
            for (let i = 0; i < obj.length; i++) {
                if (obj[i].target.uuid == target.uuid) {
                    return;
                }
            }
            this.listenerList[event].push({ target, fun });
        }
    },

    removeListener: function (event, target) {
        if (event == null || target == null) {
            cc.error('invalid param');
            return;
        }
        var obj = this.listenerList[event];
        if (obj != null) {
            for (let i = 0; i < obj.length; i++) {
                if (obj[i].target.uuid == target.uuid) {
                    this.listenerList[event].splice(i, 1);
                    i--;
                }
            }
            if (this.listenerList[event].length == 0) {
                delete this.listenerList[event];
            }
        }
    },

    dispatchEvent: function (event, args) {
        if (event == null) {
            cc.error('invalid param');
            return;
        }
        var obj = this.listenerList[event];
        if (obj != null) {
            for (let i = 0; i < obj.length; i++) {
                if (obj[i].fun != null && obj[i].target != null) {
                    obj[i].fun.call(obj[i].target, args);
                }
            }
        }
    },

    removeListenerWithTarget: function (target) {
        if (target == null) {
            cc.error('invalid param');
            return;
        }
        for (let key in this.listenerList) {
            let objArray = this.listenerList[key];
            for (let i = 0; i < objArray.length; i++) {
                let obj = objArray[i];
                if (obj.target.uuid == target.uuid) {
                    objArray.splice(i, 1);
                    break;
                }
            }
            if (objArray.length == 0) {
                delete this.listenerList[key];
            }
        }
    },
})

module.exports = EventManager;
