const Defines = require('BattleDefines')
cc.Class({
    extends: cc.Node,

    properties: {
        isDead: false,

        selfTimer: [],
        selfTimerHandler: null,
        selfInnerTimerHandler: null,
        activedTimerCount: 0,

        ctrlValue: {
            default: {}
        },

        customer:null,
        lineType:Defines.ObjectType.OBJ_INVALID,
        lineID: 0,
    },

    ctor: function () {
        this.battleManager = require('BattleManager');
        this.init();
    },

    lifeControl: function (state) {
        state = typeof state !== 'undefined' ? state : false;
        this.isDead = state;
    },

    reset: function (state) {
        this.lifeControl(state);
        this.delAllTimer();
        this.selfTimerHandler = null;
        this.selfInnerTimerHandler = null;
    },

    init: function () {

        for (let i = 0; i < Defines.MAX_ENTITY_TIMER; i++) {
            let timer = {
                active: 0,
                delay: 0,
                expire: 0,
                counts: 0,
                firstrun: 0,
            };
            this.selfTimer.push(timer);
        }

        this.reset();
    },

    update: function (dt) {
        this.updateTimer();
    },

    updateTimer: function () {
        if (!this.activedTimerCount) {
            return;
        }

        for (let idx = 0; idx < Defines.MAX_ENTITY_TIMER; idx++) {
            if (this.selfTimer[idx].active) {
                if (this.selfTimer[idx].firstrun != 0) {
                    --this.selfTimer[idx].counts;
                    this.selfTimerHandler(idx);
                    this.selfTimer[idx].firstrun = 0;

                    if (idx >= 40) {
                        this.selfInnerTimerHandler(idx);
                    }

                } else if (this.selfTimer[idx].expire <= this.battleManager.getInstance().currentTime) {

                    --this.selfTimer[idx].counts;
                    if (this.selfTimer[idx].counts <= 0) {
                        this.selfTimer[idx].active = 0;
                        this.activedTimerCount--;
                    }

                    this.selfTimerHandler(idx);

                    if (idx >= 40) {
                        this.selfInnerTimerHandler(idx);
                    }

                    this.selfTimer[idx].expire += this.selfTimer[idx].delay;
                }
            }
        }
    },

    setTimer: function (index, delay, count, firstrun) {
        if (index >= Defines.MAX_ENTITY_TIMER || this.selfTimer[index].active == 1) {
            return;
        }

        let timer = this.selfTimer[index];
        timer.active = 1;
        timer.delay = delay;
        timer.expire = this.battleManager.getInstance().currentTime + delay;
        timer.counts = count;
        if (firstrun == undefined) {
            timer.firstrun = 0;
        } else {
            timer.firstrun = firstrun;
        }

        this.activedTimerCount++;
    },

    setTimerHandler: function (handler) {
        this.selfTimerHandler = handler;
    },

    setInnerTimerHandler(handler) {
        this.selfInnerTimerHandler = handler;
    },

    delTimer: function (index) {
        if (!!this.selfTimer[index].active) {
            this.selfTimer[index].active = 0;
            this.activedTimerCount--;
        }
    },

    delAllTimer: function () {
        for (let i = 0; i < Defines.MAX_ENTITY_TIMER; ++i) {
            this.selfTimer[i].active = 0;
        }

        this.activedTimerCount = 0;
        this.selfTimerHandler = null;
        this.selfInnerTimerHandler = null;
    },

});