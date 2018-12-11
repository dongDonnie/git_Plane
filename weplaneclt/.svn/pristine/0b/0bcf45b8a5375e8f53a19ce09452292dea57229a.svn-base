const GlobalVar = require("globalvar")
cc.Class({
    extends: cc.Component,

    ctor: function () {
        this._touchMoved = false;
        this.horizontal = true;
        this.vertical = false;
        this.spaceX = 10;

        this._slideTime = 0;
        this._fScrollTime = 0;
        this._fScrollSpeed = 0;
        this._inertia = false;
        this._scrollToFighter = 0;

        this.PLANE_LIST_SCROLL_DECELERATION = -1000;
        this.PLANE_LIST_ELLIPSE_A = 520;
        this.PLANE_LIST_ELLIPSE_B = 92.5;

        this._poPlaneLeft = 0;
        this._poPlaneRight = 0;
    },

    properties: {
        content: {
            default: null,
            type: cc.Node,
        },
        fighter: {
            default: null,
            type: cc.Node,
        },
        fighterStack: {
            default: [],
            visible: false,
        },
        stackArray: {
            default: [],
            visible: false,
        }
    },

    onLoad: function () {
        // this.node.on("touchstart",this.onTouchBegin,this);
        // this.node.on("touchmove",this.onTouchMove,this);
        // this.node.on("touchend",this.onTouchEnd,this);
        // this.node.on("touchcancel",this.onTouchCancel,this);
        //this.initHangar(10, 7);
    },

    onDisable: function () {
        if (!CC_EDITOR) {
            this.unregisterEvent();
        }
    },

    onEnable: function () {
        if (!CC_EDITOR) {
            this.registerEvent();
        }
    },

    update: function (dt) {
        this._slideTime += dt;
        if (this._inertia) {
            this.UpdateEListMove(dt);
        }
    },

    cleanAllFighter: function () {
        this.fighter.active=true;
        this.content.removeAllChildren();
        this.fighterStack = [];
        this.stackArray = [];

        this._touchMoved = false;
        this.horizontal = true;
        this.vertical = false;
        this.spaceX = 10;

        this._slideTime = 0;
        this._fScrollTime = 0;
        this._fScrollSpeed = 0;
        this._inertia = false;
        this._scrollToFighter = 0;

        this.PLANE_LIST_SCROLL_DECELERATION = -1000;
        this.PLANE_LIST_ELLIPSE_A = 520;
        this.PLANE_LIST_ELLIPSE_B = 92.5;

        this._poPlaneLeft = 0;
        this._poPlaneRight = 0;
    },

    initHangar: function (counts) {
        //this.fighterStack.push(this.fighter);
        this.cleanAllFighter();
        for (let i = 0; i < counts; i++) {
            let fighter = this.addFighter();
            this.fighterStack.push(fighter);
        }
        this.fighter.active=false;
        let center=this.updateFighter();
        this.content.setContentSize(cc.size(this.PLANE_LIST_ELLIPSE_A * 2, this.PLANE_LIST_ELLIPSE_B * 2));
        this.resetPosition(center);
    },

    addFighter: function () {
        let fighter = cc.instantiate(this.fighter);
        this.content.addChild(fighter);
        return fighter;
    },

    updateFighter:function(){
        let center=0;
        let memberData = GlobalVar.tblApi.getData('TblMember');
        let index = 0;
        for(let i in memberData){
            if (memberData[i].byGetType != 1){
                continue;
            }
            let memberID = memberData[i].wMemberID;
            let member=GlobalVar.me().memberData.getMemberByID(memberID);
            if(member!=null){
                let state=-1;
                if(memberID==GlobalVar.me().memberData.getStandingByFighterID()){
                    state=1;
                    center=index;
                }
                this.fighterStack[index].getComponent("FighterObject").init(member.MemberID, member.Quality,state);
            }else{
                this.fighterStack[index].getComponent("FighterObject").init(memberID, 0, 0);
            }
            if(this.fighterStack[index].getChildByName("btnFighter").getComponent(cc.Button).clickEvents.length>0){
                this.fighterStack[index].getChildByName("btnFighter").getComponent(cc.Button).clickEvents[0].customEventData=memberID;
            }
            this.fighterStack[index].getComponent("FighterObject").setHotFlag(GlobalVar.me().memberData.totalHotFlag[memberID]);
            index += 1;
        }
        return center;
    },

    resetPosition: function (center) {
        let num = typeof center !== 'undefined' ? (center < this.fighterStack.length ? center : 0) : 0;
        //let array = new Array();
        let right = Math.floor(this.fighterStack.length / 2);
        while (right-- >= 0) {
            if (++num >= this.fighterStack.length) {
                num = 0;
            }
        }
        let centerIndex = 0;
        for (let i = 0; i < this.fighterStack.length; i++) {
            this.stackArray[i] = num++;
            if (num >= this.fighterStack.length) {
                num = 0;
            }
            if (this.stackArray[i] == center) {
                centerIndex = i;
            }
            //this.fighterStack[i].active = false;
        }

        let nWidth = 640 - 120;
        for (let i = 0; i < 6; ++i) {
            if (i == 0) {
                this._poPlaneLeft = this.stackArray[centerIndex + i - 2];
            } else if (i == 5) {
                this._poPlaneRight = this.stackArray[centerIndex + i - 2];
            }

            let fIconX = (i * nWidth) / 4 - nWidth / 2;
            let fIconY = this._calcEllipseY(fIconX);
            this.fighterStack[this.stackArray[centerIndex + i - 2]].setScale(fIconY / (this.PLANE_LIST_ELLIPSE_B) * 0.9);
            this.fighterStack[this.stackArray[centerIndex + i - 2]].setPosition(new cc.Vec2(fIconX, this.PLANE_LIST_ELLIPSE_B * 2 - fIconY * 2));
            //this.fighterStack[this.stackArray[centerIndex + i - 2]].active = true;
        }

        // let j = 1;
        // for (let i = centerIndex - 3; i >= 0; i--) {
        //     let newPosition = this.fighterStack[this._poPlaneLeft].getPosition();
        //     newPosition.x -= j * (this.fighter.getContentSize().width + this.spaceX);
        //     this.fighterStack[this.stackArray[i]].setPosition(newPosition);
        //     j++;
        // }
        // j = 1;
        // for (let i = centerIndex + 3; i < this.stackArray.length; i++) {
        //     let newPosition = this.fighterStack[this._poPlaneRight].getPosition();
        //     newPosition.x += j * (this.fighter.getContentSize().width + this.spaceX);
        //     this.fighterStack[this.stackArray[i]].setPosition(newPosition);
        //     j++;
        // }
    },

    reloadStack: function (x) {
        if (x > 0) {
            let right = this.fighterStack[this._poPlaneRight];
            let left = this.fighterStack[this._poPlaneLeft];
            let rightMark = -1;
            let leftMark = -1;

            for (let i = 0; i < this.stackArray.length; i++) {
                if (this._poPlaneRight == this.stackArray[i]) {
                    rightMark = i;
                }
                if (this._poPlaneLeft == this.stackArray[i]) {
                    leftMark = i;
                }
            }

            if (right.x > 0.5 * this.node.getContentSize().width + 0.5 * right.getContentSize().width) {
                //right.active = false;

                let newPosition = this.fighterStack[this.stackArray[0]].getPosition();
                newPosition.x -= (this.fighter.getContentSize().width + this.spaceX);
                this.fighterStack[this.stackArray[this.stackArray.length - 1]].setPosition(newPosition);

                let ele = this.stackArray.pop();
                this.stackArray.unshift(ele);
                this._poPlaneRight = this.stackArray[rightMark];
            }

            let leftPrev = this.fighterStack[this.stackArray[leftMark - 1 < 0? this.stackArray.length - 1:leftMark - 1]];
            if (leftPrev.x > -0.5 * this.node.getContentSize().width-this.fighter.getContentSize().width) {
                let fPrevX = leftPrev.x;
                let fPrevY = this._calcEllipseY(fPrevX);
                leftPrev.setPosition(new cc.Vec2(fPrevX, this.PLANE_LIST_ELLIPSE_B * 2 - fPrevY * 2));
                leftPrev.setScale(0.9 * fPrevY / this.PLANE_LIST_ELLIPSE_B);
                this._poPlaneLeft = this.stackArray[leftMark];
                //leftPrev.active = true;
            }
        } else {
            let left = this.fighterStack[this._poPlaneLeft];
            let right = this.fighterStack[this._poPlaneRight];
            let leftMark = -1;
            let rightMark = -1;

            for (let i = 0; i < this.stackArray.length; i++) {
                if (this._poPlaneLeft == this.stackArray[i]) {
                    leftMark = i;
                }
                if (this._poPlaneRight == this.stackArray[i]) {
                    rightMark = i;
                }
            }

            if (left.x < -0.5 * this.node.getContentSize().width - 0.5 * left.getContentSize().width) {
                //left.active = false;

                let newPosition = this.fighterStack[this.stackArray[this.stackArray.length - 1]].getPosition();
                newPosition.x += (this.fighter.getContentSize().width + this.spaceX);
                this.fighterStack[this.stackArray[0]].setPosition(newPosition);

                let ele = this.stackArray.shift();
                this.stackArray.push(ele);
                this._poPlaneLeft = this.stackArray[leftMark];
            }

            let rightPrev = this.fighterStack[this.stackArray[rightMark + 1 > this.stackArray.length - 1? 0:rightMark + 1]];
            if (rightPrev.x < 0.5 * this.node.getContentSize().width+this.fighter.getContentSize().width) {

                let fPrevX = rightPrev.x
                let fPrevY = this._calcEllipseY(fPrevX);
                rightPrev.setPosition(new cc.Vec2(fPrevX, this.PLANE_LIST_ELLIPSE_B * 2 - fPrevY * 2));
                rightPrev.setScale(0.9 * fPrevY / this.PLANE_LIST_ELLIPSE_B);
                this._poPlaneRight = this.stackArray[rightMark];
                //rightPrev.active = true;
            }
        }
    },

    registerEvent: function () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this, true);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoved, this, true);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnded, this, true);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancelled, this, true);
    },

    unregisterEvent: function () {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this, true);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoved, this, true);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnded, this, true);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancelled, this, true);
    },

    onTouchBegan: function (event) {
        //cc.log(event);
        var touch = event.touch;
        if (this.content) {
            this._handlePressLogic(touch);
        }
        this._touchMoved = false;
        this.stopPropagationIfTargetIsMe(event);
    },

    onTouchMoved: function (event) {
        //cc.log(event);
        var touch = event.touch;
        if (this.content) {
            this._handleMoveLogic(touch);
        }

        var deltaMove = touch.getLocation().sub(touch.getStartLocation());
        if (deltaMove.mag() > 7) {
            if (!this._touchMoved && event.target !== this.node) {
                var cancelEvent = new cc.Event.EventTouch(event.getTouches(), event.bubbles);
                cancelEvent.type = cc.Node.EventType.TOUCH_CANCEL;
                cancelEvent.touch = event.touch;
                cancelEvent.simulate = true;
                event.target.dispatchEvent(cancelEvent);
                this._touchMoved = true;
            }
        }
        this.stopPropagationIfTargetIsMe(event);
    },

    onTouchEnded: function (event) {
        //cc.log(event);
        var touch = event.touch;
        if (this.content) {
            this._handleReleaseLogic(touch);
        }
        if (this._touchMoved) {
            event.stopPropagation();
        } else {
            this.stopPropagationIfTargetIsMe(event);
        }
    },

    onTouchCancelled: function (event) {
        //cc.log(event);
        if (!event.simulate) {
            var touch = event.touch;
            if (this.content) {
                this._handleReleaseLogic(touch);
            }
        }
        this.stopPropagationIfTargetIsMe(event);
    },

    stopPropagationIfTargetIsMe: function (event) {
        if (event.eventPhase === cc.Event.AT_TARGET && event.target === this.node) {
            event.stopPropagation();
        }
    },

    _flattenVectorByDirection: function (vector) {
        var result = vector;
        result.x = this.horizontal ? result.x : 0;
        result.y = this.vertical ? result.y : 0;
        return result;
    },

    _calcEllipseY(x) {
        return Math.sqrt((this.PLANE_LIST_ELLIPSE_B * this.PLANE_LIST_ELLIPSE_B - (this.PLANE_LIST_ELLIPSE_B * this.PLANE_LIST_ELLIPSE_B) / (this.PLANE_LIST_ELLIPSE_A * this.PLANE_LIST_ELLIPSE_A) * (x * x)));
    },

    _moveChildren: function (deltaMove) {
        var adjustedMove = this._flattenVectorByDirection(deltaMove);
        for (let i = 0; i < this.fighterStack.length; i++) {
            if (this.fighterStack[i].active) {
                let vPos = this.fighterStack[i].getPosition();
                let newPosition = vPos.add(adjustedMove);
                let fY = this._calcEllipseY(newPosition.x);
                newPosition.y = this.PLANE_LIST_ELLIPSE_B * 2 - fY * 2;
                this.fighterStack[i].setScale(0.9 * fY / this.PLANE_LIST_ELLIPSE_B);
                this.fighterStack[i].setPosition(newPosition);
            }
        }

        this.reloadStack(adjustedMove.x);
    },

    _handlePressLogic: function () {
        this._slideTime = 0;
        this._fScrollSpeed = 0;
        this._fScrollTime = 0;
    },

    _handleMoveLogic: function (touch) {
        var deltaMove = touch.getDelta();
        this._moveChildren(deltaMove);
    },

    _handleReleaseLogic: function (touch) {
        if (this._touchMoved) {
            let moveVec = touch.getLocation().x - touch.getStartLocation().x
            this._fScrollSpeed = Math.min(Math.abs(moveVec) / (this._slideTime), 1000) * (moveVec / Math.abs(moveVec));
            this._inertia = true;
        } else {
            this._fScrollSpeed = 0;
        }
    },

    UpdateEListMove: function (dt) {
        if (Math.abs(this._fScrollSpeed) < 0.1) {
            this._fScrollSpeed = 0;
            this._inertia = false;
            return;
        }
        let lastTime = this._fScrollTime;
        this._fScrollTime += dt;
        let nowSpeed = Math.abs(this._fScrollSpeed) + -1000 * this._fScrollTime;
        if (nowSpeed <= 0) {
            this._fScrollSpeed = 0;
            this._inertia = false;
            return;
        } else {
            let timeParam = lastTime * 2 + dt;
            let offset = (Math.abs(this._fScrollSpeed) + -1000 * timeParam * 0.5) * dt * (this._fScrollSpeed / Math.abs(this._fScrollSpeed));
            this._moveChildren(new cc.Vec2(offset, 0));
        }
    }

});