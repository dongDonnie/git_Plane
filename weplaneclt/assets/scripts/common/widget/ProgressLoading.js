var ProgressLoading = cc.Class({
    extends: cc.ActionInterval,

    // ctor: function (duration, from, to, callback) {
    //     cc.ActionInterval.prototype.ctor.call(this);

    //     this._now = 0;
    //     this._from = 0;
    //     this._to = 0;
    //     this._progressBarCallBack = null;

    //     this.initWithDuration(duration, from, to, callback);
    // },

    // initWithDuration: function (duration, from, to, callback) {
    //     if (cc.ActionInterval.prototype.initWithDuration.call(this, duration)) {
    //         this._now = 0;
    //         this._from = from;
    //         this._to = to;
    //         if (!!callback) {
    //             this._progressBarCallBack = callback;
    //         }

    //         return true;
    //     }
    //     return false;
    // },

    // clone: function () {
    //     var action = new ProgressLoading();
    //     this._cloneDecoration(action);
    //     action.initWithDuration(this._duration, this._from, this._to, this._progressBarCallBack);
    //     return action;
    // },

    // startWithTarget: function (target) {
    //     cc.ActionInterval.prototype.startWithTarget.call(this, target);
    // },

    initWithDuration: function (duration, from, to, callback,loadingCallBack) {
        this._super(duration);
        this._now = 0;
        this._from = from;
        this._to = to;
        if (!!callback) {
            this._progressBarCallBack = callback;
        }
        if(!!loadingCallBack){
            this._progressBarLoadingCallBack=loadingCallBack;
        }
    },

    update: function (dt) {
        dt = this._computeEaseTime(dt);
        if (this.target.getComponent(cc.ProgressBar)) {
            this._now = this._from + (this._to - this._from) * dt

            if (this._now >= 1) {
                this._now = 1;
                if (this._progressBarCallBack != null) {
                    this._progressBarCallBack();
                }
            } else if (this._now < 0) {
                this._now = 0;
                if (this._progressBarCallBack != null) {
                    this._progressBarCallBack();
                }
            }
            if(!!this._progressBarLoadingCallBack){
                this._progressBarLoadingCallBack(this._now);
            }
            this.target.getComponent(cc.ProgressBar).progress = this._now;

        }
    },
});

cc.progressLoading = function (duration, from, to, callback,loadingCallBack) {
    var action = new ProgressLoading(duration);
    action.initWithDuration(duration, from, to, callback,loadingCallBack);
    return action;
};