// var DoTweenManager = require('dotweenmanager2').getInstance();
// var DoTweenType = require('dotweendefine2').DoTweenType;

// var self = null; // WARNING: 可能以后会造成问题
cc.Class({
    extends: cc.Component,

    properties: {

        itemDataCount: {
            default: 0,
            visible: false
        },

        createInterval: {
            default: 0,
            visible: false,
        },
        pageMaxCount: {
            default: 0,
            visible: false,
        },
        startCreateIndex: {
            default: 0,
            visible: false,
        },
        curItemIndex: {
            default: 0,
            visible: false,
        },

        _createModel: null,
        _createItemFunc: null,
        _updateItemFunc: null,
        _completeFunc: null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // item对象池
        this.itemLoop = new cc.NodePool();

        // 当前显示的items
        this.itemList = new Array();

        // console.log('scroll view be initialized >>>');

        // this.initialize();

        // self = this;
        this.node.getComponent(cc.ScrollView).loopScroll = this;
        this.scrollView = this.node.getComponent(cc.ScrollView);
        this.scrollView.enabled = false;
        this.content = this.scrollView.content;
        this.scrollView.enabled = false;
        this.nodeBlock = new cc.Node();
        this.nodeBlock.width = this.scrollView.node.width;
        this.nodeBlock.height = this.scrollView.node.height;
        this.nodeBlock.addComponent(cc.BlockInputEvents);
        this.scrollView.node.addChild(this.nodeBlock);

        // 根据滚动方向调整content锚点
        if (this.scrollView.vertical) {
            this.content.anchorX = 0.5;
            this.content.anchorY = 1;
        } else {
            this.content.anchorX = 0;
            this.content.anchorY = 0.5;
        }

        // 参数设置
        this.initParameter();

        // 监听scrollview事件
        // this.scrollView.node.on('scroll-began', this.scrollBegan, this);
        // this.scrollView.node.on('scroll-ended', this.scrollEnd, this);
    },

    start() {

    },

    /**
     * 初始化参数
     */
    initParameter() {
        this.firstIndex = 0;
        this.initNum = 0; // 调整content大小用
        this.curItemIndex = 0;
        this.startCreateIndex = 0;
        this.itemRowCount = 1; // 行列数
        this.itemColCount = 1;

        this.gapDisX = 10;
        this.gapDisY = 10;

        this.isScrolling = false;
        this.sollValidate = false;

        // cc.log('content onload pos: ' + this.content.getPosition());
        // cc.log('item start pos: ' + this.startPos);
        this.startUpdate = false;

        this.intervalIndex = -1;
    },

    /**
     * 注册创建item回调方法
     * @param {Function} func 
     */
    registerCreateItemFunc(func) {
        this._createItemFunc = func;
    },

    /**
     * 注册更新item回调方法
     * @param {Function} func 
     */
    registerUpdateItemFunc(func) {
        this._updateItemFunc = func;
    },

    /**
     * 注册执行完毕后的回调方法
     * @param {Function} interval 
     */
    registerCompleteFunc(func) {
        this._completeFunc = func;
    },

    setCreateModel(model) {
        if (model.__classname__ == "cc.Prefab") {
            this._createModel = model.data;
        } else {
            this._createModel = model;
        }
    },
    saveCreatedModel(array) {
        for (let i = 0; i < array.length;) {
            this.itemLoop.put(array[i]);
        }
    },

    /**
     * 创建prefabs的间隔
     * @param {number} interval 
     */
    setCreateInterval(interval) {
        this.createInterval = interval
    },

    /**
     * 设置列表item数量
     * @param {Number} count 
     */
    setTotalNum(count) {
        this.itemDataCount = count;
    },

    /**
     * 设置列item数量
     * @param {Number} count
     */
    setRowNum(count) {
        this.itemRowCount = count;
    },
    setColNum(count) {
        this.itemColCount = count;
    },
    /**
     * 设置item间隔
     * @param {disX} disX 
     */
    setGapDisX(disX) {
        this.gapDisX = disX;
    },
    setGapDisY(disY) {
        this.gapDisY = disY;
    },

    /**
     * 设置起始创建索引
     * @param {Number} startIndex
     */
    setStartIndex(startIndex) {
        this.startCreateIndex = startIndex;
    },

    /**
     * 重置scrollview, 更新列表item
     */
    resetView() {
        if (this.itemDataCount < 0) return;

        this.startUpdate = false;
        for (let i = 0; i < this.itemList.length; i++) {
            this.itemLoop.put(this.itemList[i]);
        }
        this.itemList = [];

        this.isScrolling = false;

        this.sollValidate = false;
        // this.scrollView.enabled = true;
        // this.blockInputPanel.active = false;
        this.initialize();
    },

    /**
     * 滚动到最前面
     */
    moveToFront(time) {
        time = !!!time ? 0.5 : time;
        this.isScrolling = true;
        if (this.scrollView.vertical) {
            this.scrollView.scrollToTop(time);
        } else {
            this.scrollView.scrollToLeft(time);
        }
    },

    /**
     * 滚动到最后面
     */
    moveToEnd(time) {
        time = !!!time ? 0.5 : time;
        this.isScrolling = true;
        if (this.scrollView.vertical) {
            this.scrollView.scrollToBottom(time);
        } else {
            this.scrollView.scrollToRight(time);
        }
    },

    /**
     * 滚动到指定item
     * @param {Number} index item index
     * @param {Number} time 滚动时间
     */
    moveTo(index, time) {
        if (this.itemList.length <= 0) return;

        time = !!!time ? 0 : time;
        this.isScrolling = true;

        let item = this.itemList[0];
        if (this.scrollView.vertical) {
            let y = (item.height + this.gapDisY) * (Math.ceil(index / this.itemColCount));
            this.scrollView.scrollToOffset(cc.v3(time, y));
        } else {
            let x = (item.width + this.gapDisX) * (Math.ceil(index / this.itemRowCount));
            this.scrollView.scrollToOffset(cc.v3(x, time));
        }

    },

    /**
     * 调用回调方法生成item
     */
    createItem() {
        // let item = this._createItemFunc();
        let item = null;
        if (this.itemLoop.size() > 0) {
            item = this.itemLoop.get();
        } else {
            item = cc.instantiate(this._createModel);
            item.active = true;
            item.opacity = 255;
        }
        return item;
    },

    /**
     * 初始化item并更新显示的内容
     * @param {Node} item 
     * @param {Number} index item的序号
     */
    initItem(item, index) {
        item.dataIndex = index;
        if (index < this.itemDataCount) {
            this._updateItemFunc(item, index);
        }
    },

    /**
     * 更新所有item的显示
     */
    refreshViewItem() {
        if (this.itemList.length > 0) {
            this.itemList.forEach(item => {
                this._updateItemFunc(item, item.dataIndex);
            });
        }
        if (!!this._completeFunc) {
            this._completeFunc();
        }
    },

    /**
     * 释放所有子节点
     */
    releaseViewItems() {
        if (this.itemDataCount < 0) return;

        for (let i = 0; i < this.itemList.length; i++) {
            this.itemLoop.put(this.itemList[i]);
        }
        this.itemList = [];

        if (this.intervalIndex != -1) {
            clearInterval(this.intervalIndex);
        }
    },

    update(dt) {
        if (this.startUpdate) {
            this.updateTimer += dt;
            if (this.updateTimer < this.updateInterval) return;
            this.updateTimer = 0;

            this.newValidate();
        }
    },

    initialize() {

        this.updateTimer = 0;
        this.updateInterval = 0.1;
        this.lastContentPosY = 0;
        this.curItemIndex = 0;
        this.bufferZone = this.scrollView.vertical ? this._createModel.height + this.gapDisY : this._createModel.width + this.gapDisX;

        let rowNeedCount = this.itemRowCount;
        let colNeedCount = this.itemColCount;
        if (this.scrollView.horizontal) {
            colNeedCount = Math.ceil(this.scrollView.node.width / (this._createModel.width + this.gapDisX)) + 1;
            this.content.width = (this._createModel.width + this.gapDisX) * Math.ceil(this.itemDataCount / this.itemRowCount);
        } else {
            this.content.width = this._createModel.width;
        }
        if (this.scrollView.vertical) {
            rowNeedCount = Math.ceil(this.scrollView.node.height / (this._createModel.height + this.gapDisY)) + 1;
            this.content.height = (this._createModel.height + this.gapDisY) * Math.ceil(this.itemDataCount / this.itemColCount);
        } else {
            this.content.height = this._createModel.height;
        }

        this.pageMaxCount = rowNeedCount * colNeedCount;

        this.createItems();
        this.intervalIndex = setInterval(this.createItems.bind(this), this.createInterval);
    },

    createItems() {
        let initNum = this.itemDataCount > this.pageMaxCount ? this.pageMaxCount : this.itemDataCount;
        let scorllToIndex = this.startCreateIndex;
        if (this.startCreateIndex + initNum > this.itemDataCount) {
            this.startCreateIndex = this.itemDataCount - initNum;
        }
        let curCreIndex = this.startCreateIndex + this.curItemIndex;

        let self = this;
        if (this.curItemIndex < initNum) {
            let item = this.createItem();
            if (this.curItemIndex == 0) {
                let y = (item.height + this.gapDisY) * (Math.ceil(scorllToIndex / this.itemColCount));
                this.scrollView.scrollToOffset(new cc.Vec2(0, y));
            }
            this.content.addChild(item);
            let posX = this.scrollView.vertical ? (Math.floor(curCreIndex % this.itemColCount) - (this.itemColCount - 1) / 2) * (this._createModel.width + this.gapDisX) : item.width * (0.5 + Math.floor(curCreIndex / this.itemColCount)) + this.gapDisX * (Math.ceil((curCreIndex + 1) / this.itemColCount) - 1) + (this.gapLeft || 10);
            let posY = this.scrollView.vertical ? -item.height * (0.5 + Math.floor(curCreIndex / this.itemColCount)) - this.gapDisY * (Math.ceil((curCreIndex + 1) / this.itemColCount) - 1) - (this.gapTop || 10) : (Math.floor(curCreIndex % this.itemColCount) - (this.itemColCount - 1) / 2) * (this._createModel.height + this.gapDisY);
            // let posX = (Math.floor(curCreIndex % this.itemColCount) - (this.itemColCount - 1) / 2) * (this._createModel.width + this.gapDisX);
            // let posY = -item.height * (0.5 + Math.floor(curCreIndex / this.itemColCount)) - this.gapDisY * (Math.ceil((curCreIndex + 1) / this.itemColCount) - 1) - (this.gapTop || 10);
            item.position = new cc.Vec2(posX, posY);
            this.initItem(item, curCreIndex);
            this.itemList.push(item);
            this.curItemIndex += 1;
            //setTimeout(this.createItems.bind(this), this.createInterval);
        } else {
            if(!cc.isValid(this.scrollView) && this.intervalIndex != -1){
                cc.error('loop is already release');
                clearInterval(this.intervalIndex);
                return;
            }

            this.scrollView.enabled = true;
            this.scrollView.node.removeChild(this.nodeBlock);
            this.nodeBlock = null;
            if (this.itemList.length <= 0) return;

            if (this.intervalIndex != -1) {
                clearInterval(this.intervalIndex);
            }

            this.curItemIndex = 0;

            this.scrollView.enabled = true;
            this.startUpdate = true;
            if (!!this._completeFunc) {
                this._completeFunc();
            }
        }
    },

    getPositionInView(item) {
        let worldPos = item.parent.convertToWorldSpaceAR(item.position);
        let viewPos = this.scrollView.node.convertToNodeSpaceAR(worldPos);
        return viewPos;
    },

    newValidate() {
        if (this.itemList.length <= 0) return;

        let buffer = this.bufferZone;
        // if (this.scrollView.vertical) {
        //     this.content.anchorX = 0.5;
        //     this.content.anchorY = 1;
        // } else {
        //     this.content.anchorX = 0;
        //     this.content.anchorY = 0.5;
        // }
        if (this.scrollView.vertical) {
            if (this.lastContentPosY == this.content.y) return;
            let isDown = this.content.y < this.lastContentPosY;
            let offset = (this.itemList[0].height + this.gapDisY) * (Math.ceil(this.itemList.length / this.itemColCount));

            for (let i = 0; i < this.itemList.length; ++i) {
                let item = this.itemList[i];
                let viewPos = this.getPositionInView(item);
                if (isDown) {
                    // if (viewPos.y < -buffer - item.height - this.gapDisY) {
                    if (viewPos.y < -offset / 2) {
                        let afterIndex = item.dataIndex - this.itemList.length
                        if (afterIndex < 0 || afterIndex >= this.itemDataCount) continue;

                        item.y = (item.y + offset);
                        this.initItem(item, item.dataIndex - this.itemList.length);
                    }
                } else {
                    // if (viewPos.y > buffer + item.height + this.gapDisY) {
                    if (viewPos.y > offset / 2) {
                        let afterIndex = item.dataIndex + this.itemList.length
                        if (afterIndex < 0 || afterIndex >= this.itemDataCount) continue;

                        item.y = (item.y - offset);
                        this.initItem(item, item.dataIndex + this.itemList.length);
                    }
                }
            }

            this.lastContentPosY = this.content.y;
        } else if (this.scrollView.horizontal) {
            if (this.lastContentPosX == this.content.x) return;
            let isLeft = this.content.x < this.lastContentPosX;
            let offset = (this.itemList[0].width + this.gapDisX) * (Math.ceil(this.itemList.length / this.itemColCount));

            for (let i = 0; i < this.itemList.length; ++i) {
                let item = this.itemList[i];
                let viewPos = this.getPositionInView(item);
                if (isLeft) {
                    if (viewPos.x < -offset / 2) {
                        let afterIndex = item.dataIndex + this.itemList.length
                        if (afterIndex < 0 || afterIndex >= this.itemDataCount) continue;

                        item.x = (item.x + offset);
                        this.initItem(item, item.dataIndex + this.itemList.length);
                    }
                } else {
                    if (viewPos.x > offset / 2) {
                        let afterIndex = item.dataIndex - this.itemList.length
                        if (afterIndex < 0 || afterIndex >= this.itemDataCount) continue;

                        item.x = (item.x - offset);
                        this.initItem(item, item.dataIndex - this.itemList.length);
                    }
                }
            }

            this.lastContentPosX = this.content.x;
        }
    }
});