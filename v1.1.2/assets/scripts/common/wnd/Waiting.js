var Waiting = cc.Class({
    extends: cc.Component,

    properties: {
        bg: {
            default: null,
            type: cc.Node
        },
        waiting: {
            default: null,
            type: cc.Node
        }
    },

    onLoad() {
        this.showTime = 0;
    },

    start() {

    },

    update(dt) {
        if (this.showTime <= 2 && this.showTime >= 0 && !this.waiting.active) {
            this.showTime += dt;
        } else if (this.showTime > 2) {
            this.waiting.active = true;
            this.showTime = 0;
        }
    },
});