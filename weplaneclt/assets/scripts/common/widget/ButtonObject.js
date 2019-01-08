let audio = cc.Enum({
    confirm: 0,
    cancel: 1,
    closed: 2,
    back: 3,
    pop: 4,
    open: 5,
    check: 6,
    switch: 7,
    none: 8,
});

let audioNames = {
    0: 'cdnRes/audio/main/effect/btnoClick',
    1: 'cdnRes/audio/clips/sound_cancel',
    2: 'cdnRes/audio/main/effect/click_close',
    3: 'cdnRes/audio/clips/sound_back',
    4: 'cdnRes/audio/clips/sound_pop',
    5: 'cdnRes/audio/main/effect/openView',
    6: 'cdnRes/audio/clips/sound_check',
    7: 'cdnRes/audio/main/effect/button_click',
    8: '',
};

let colorType = cc.Enum({
    White: 0,
    Green: 1,
    Blue: 2,
    Purple: 3,
    Orange: 4,
    Red: 5,
    LightBlue: 6,
    LightYellow: 7,
});

const GlobalVar = require("globalvar");
const Guide = require("Guide");
const config = require("config");
var ButtonObject = cc.Class({
    extends: cc.Component,

    statics: {
        isPress: null,
    },

    editor: {
        requireComponent: cc.Button,
        menu: 'i18n:MAIN_MENU.component.ui/ButtonObject'
    },

    properties: {
        audioType: {
            default: audio.switch,
            type: audio,
        },
        fontColor: {
            default: colorType.White,
            type: colorType,
            notify: function () {
                this.setColor();
            }
        },
        textLabel: {
            default: '确定',
            notify: function () {
                this.setLable();
            }
        },
        _fontSize: 30,
        fontSize: {
            get: function () {
                return this._fontSize;
            },
            set: function (value) {
                this._fontSize = value;
                this.changeFontSize();
            }
        },
        _showShadow: true,
        showShadow: {
            get: function () {
                return this._showShadow;
            },
            set: function (value) {
                this._showShadow = !!value;
                this.showFontShadow();
            },
            animatable: true,
        },
        btnState: {
            default: true,
            visible: false,
        },
    },

    onLoad: function () {
        this.node.on('touchstart', this.onTouchStart, this);
        this.node.on('touchend', this.onTouchEnd, this);
        this.node.on('touchcancel', this.onTouchCancel, this);
        //this.setLable();
        //this.changeFontSize();
        //this.setColor();

        //this.showFontShadow();
    },

    onTouchStart: function (event) {
        if (!ButtonObject.isPress) {
            this.playAudio();
            ButtonObject.isPress = event.target;
        }
    },
    onTouchEnd: function (event) {
        if (!!ButtonObject.isPress) {
            if (cc.isValid(event.target)) {
                if (ButtonObject.isPress.uuid != event.target.uuid) {
                    event.target.getComponent(cc.Button)._pressed = false;
                } else {
                    ButtonObject.isPress = null;
                }
            } else {
                ButtonObject.isPress = null;
            }
        } else {
            if (cc.isValid(event.target)) {
                event.target.getComponent(cc.Button)._pressed = false;
            }else{
                ButtonObject.isPress = null;
            }
        }

        if (config.NEED_GUIDE) {
            Guide.getInstance().clickBtn(event.currentTarget.name);
        }
    },
    onTouchCancel: function (event) {
        ButtonObject.isPress = null;
    },

    setEventState: function (open) {
        this.btnState = typeof open !== 'undefine' ? open : true;
    },

    playAudio: function (event) {
        if (!this.btnState || (this.audioType == audio.none)) {
            return;
        }
        let name = audioNames[this.audioType];
        GlobalVar.soundManager().playEffect(name);
    },

    getColor: function (index) {
        switch (index) {
            case 0:
                return new cc.color(255, 255, 255);
            case 1:
                return new cc.color(125, 255, 94);
            case 2:
                return new cc.color(17, 203, 255);
            case 3:
                return new cc.color(236, 82, 255);
            case 4:
                return new cc.color(251, 209, 60);
            case 5:
                return new cc.color(255, 73, 43);
            case 6:
                return new cc.color(203, 252, 255);
            case 7:
                return new cc.color(255, 249, 214);
            default:
                return new cc.color(255, 255, 255);
        }
    },

    setColor: function () {
        if (!!this.node.getChildByName("labelName")) {
            this.node.getChildByName("labelName").color = this.getColor(this.fontColor);
        }
    },

    setLable: function () {
        if (!!this.node.getChildByName("labelName")) {
            this.node.getChildByName("labelName").getComponent(cc.Label).string = this.textLabel;
        }
        if (!!this.node.getChildByName("labelShadow")) {
            this.node.getChildByName("labelShadow").getComponent(cc.Label).string = this.textLabel;
        }
    },

    setText: function (text) {
        if (typeof text !== 'undefined') {
            this.textLabel = text;
        }
    },

    setEnabled: function (enabled) {
        enabled = typeof enabled !== 'undefined' ? enabled : true;
        this.node.getComponent(cc.Button).interactable = enabled;
    },

    changeFontSize: function () {
        if (!!this.node.getChildByName("labelName")) {
            let labelName = this.node.getChildByName("labelName").getComponent(cc.Label);
            labelName.fontSize = this._fontSize;
            labelName.lineHeight = this._fontSize;
        }
        if (!!this.node.getChildByName("labelShadow")) {
            let labelShadow = this.node.getChildByName("labelShadow").getComponent(cc.Label);
            labelShadow.fontSize = this._fontSize;
            labelShadow.lineHeight = this._fontSize;
        }
    },

    showFontShadow: function () {
        if (!!this.node.getChildByName("labelShadow")) {
            this.node.getChildByName("labelShadow").active = this._showShadow;
        }
    }

});