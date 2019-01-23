const GlobalVar = require("globalvar");
const ResMapping = require("resmapping");
const SceneDefines = require("scenedefines");
const WndTypeDefine = require("wndtypedefine");

var WindowManager = cc.Class({
    extends: cc.Component,
    ctor: function () {
        this.vectorViewStack = [];
        this.mapViewData = {};
        this.addMask = false;
        this.openLog = false;
        this.pushName = '';
        this.pushArray = [];
        this.revertViewStack = [];
    },
    clearWindowMgr: function () {
        this.vectorViewStack = [];
        this.mapViewData = {};
        this.addMask = false;
        this.openLog = false;
        this.pushName = '';
        this.pushArray = [];
        this.revertViewStack = [];
    },

    statics: {
        instance: null,
        getInstance: function () {
            if (WindowManager.instance == null) {
                WindowManager.instance = new WindowManager();
            }
            return WindowManager.instance;
        },
        destroyInstance() {
            if (WindowManager.instance != null) {
                delete WindowManager.instance;
                WindowManager.instance = null;
            }
        }
    },

    preLoadView: function (obj, type) {
        let index = type.lastIndexOf('/');
        let typeName = type.substring(index + 1);
        if (!cc.isValid(this.mapViewData[typeName])) {
            this.mapViewData[typeName] = cc.instantiate(obj);
        }
    },

    releaseView: function () {
        for (let key in this.mapViewData) {
            if (cc.isValid(this.mapViewData[key])) {
                this.mapViewData[key].destroy();
            }
        }
    },

    resetView: function () {
        for (let i = 0; i < this.vectorViewStack.length; i++) {
            if (cc.isValid(this.mapViewData[this.vectorViewStack[i]])) {
                this.mapViewData[this.vectorViewStack[i]].unRegisterEvents();
                this.mapViewData[this.vectorViewStack[i]].removeFromParent(false);
                this.mapViewData[this.vectorViewStack[i]].zIndex = 0;
            }
        }
        this.vectorViewStack.splice(0, this.vectorViewStack.length);
    },

    pushView: function (type, callback, needUpMask, skipCheck, param) {
        needUpMask = typeof needUpMask !== 'undefined' ? needUpMask : true;
        skipCheck = typeof skipCheck !== 'undefined' ? skipCheck : false;

        var typeName = type;

        if (param) {
            typeName = type + "_" + param;
        }

        if (this.findViewIndex(typeName) != -1) {
            this.showLog("this view is already push");
            return;
        }

        if (this.pushName != '' && !skipCheck &&
            typeName != WndTypeDefine.WindowType.E_DT_MASKBACK_WND &&
            typeName != WndTypeDefine.WindowType.E_DT_ROOTBACK_WND &&
            typeName != WndTypeDefine.WindowType.E_DT_NORMALROOT_WND) {
            this.showLog("window manager is pushing");
            for (let value of this.pushArray) {
                if (typeName == value.typeName) {
                    return;
                }
            }
            let view = {};
            view.typeName = typeName;
            view.callback = callback;
            view.needUpMask = needUpMask;
            view.skipCheck = skipCheck;
            view.param = param;
            this.pushArray.push(view);
            return;
        }

        if (typeName != WndTypeDefine.WindowType.E_DT_MASKBACK_WND &&
            typeName != WndTypeDefine.WindowType.E_DT_ROOTBACK_WND &&
            typeName != WndTypeDefine.WindowType.E_DT_NORMALROOT_WND) {
            this.pushName = typeName;
            this.showLog("push name is " + this.pushName);
        }

        let block = cc.find("Canvas/BlockNode");
        block.active = true;

        if (this.findViewInStack(WndTypeDefine.WindowType.E_DT_MASKBACK_WND) != "") {
            if (needUpMask) {
                this.mapViewData[WndTypeDefine.WindowType.E_DT_MASKBACK_WND].getComponent(WndTypeDefine.WindowType.E_DT_MASKBACK_WND).enter(true);
                this.setRevertViewStack();
                this.upViewToCeiling(WndTypeDefine.WindowType.E_DT_MASKBACK_WND);
                this.showLog("up maskback");
            }
        } else {
            this.addMaskBack(WndTypeDefine.WindowType.E_DT_MASKBACK_WND, type, callback, param);
            return;
        }

        this.showLog("PushView: typeName = " + typeName);

        if (!cc.isValid(this.mapViewData[typeName])) {
            var self = this;
            GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, "cdnRes/prefab/Windows/" + type, function (prefab) {
                if (prefab != null) {
                    self.mapViewData[typeName] = cc.instantiate(prefab);
                    self.addView(type, true, true, callback, param);
                    console.log('pushview: ', self.vectorViewStack);
                    self.showLog("PushView: resmanager loadres success, push success!");
                } else {
                    self.showLog("PushView: push view failed!");
                    self.revertStack();
                    GlobalVar.comMsg.showMsg('请保持网络连接畅通');
                }
            });
        } else {
            this.addView(type, true, true, callback, param);
            console.log('pushview: ', this.vectorViewStack);
            this.showLog("PushView: windowmanager has this view, push success!");
        }
    },

    addView: function (type, needRefresh, needRefreshCeilingView, callback, param, insertIndex) {
        insertIndex = typeof insertIndex !== 'undefined' ? insertIndex : -1;
        let typeName = type;

        if (param) {
            typeName = type + "_" + param;
        }

        this.showLog("AddView: typeName = " + typeName);

        let ceilingView = this.getCeilingView();
        let ceilingViewType = this.getCeilingViewType();
        let zOrder = 100;

        if (ceilingView != null) {
            ceilingView.getComponent(ceilingViewType).escape(needRefreshCeilingView);
            zOrder = ceilingView.zIndex + 1;
        }

        if (insertIndex != -1) {
            this.showLog("AddView: InsertMode");
            zOrder = this.mapViewData[this.vectorViewStack[insertIndex]].zIndex;
            for (let j = this.vectorViewStack.length - 1; j >= insertIndex; j--) {
                var z = this.mapViewData[this.vectorViewStack[j]].zIndex;
                this.mapViewData[this.vectorViewStack[j]].zIndex = z + 1;
                this.showLog("AddView: typeName = " + this.vectorViewStack[j] + "; z = " + (z + 1) + ";");
            }
            this.vectorViewStack.splice(insertIndex, 0, typeName);
        } else {
            this.vectorViewStack.push(typeName);
        }

        //cc.director.getScene().addChild(this.mapViewData[type], zOrder);
        if (GlobalVar.sceneManager().getCurrentSceneType() == SceneDefines.MAIN_STATE) {
            let wndNode = cc.find("Canvas/WndNode");
            if (wndNode != null) {
                wndNode.addChild(this.mapViewData[typeName], zOrder, typeName);
                // if (wndNode.getChildByName(typeName) != this.mapViewData[typeName]){
                //     wndNode.addChild(this.mapViewData[typeName], zOrder, typeName);
                // }else{
                //     this.mapViewData[typeName].active = true;
                //     this.mapViewData[typeName].zIndex=zOrder;
                //     // this.upViewToCeiling(typeName, needRefresh, needRefreshCeilingView);
                // }
                this.optimizeView();
                if (callback) {
                    callback(this.mapViewData[typeName], typeName, type);
                }
                //if (needRefresh) {
                this.mapViewData[typeName].getComponent(type).enter(needRefresh);
                //}

                this.showLog("Addview: add " + typeName + " success!");

                if (this.pushName == typeName) {
                    if (this.pushArray.length != 0) {
                        let view = this.pushArray.shift();
                        this.pushName = '';
                        this.pushView(view.typeName, view.callback, view.needUpMask, view.skipCheck, view.param);
                    } else {
                        this.pushName = '';
                    }
                }
            }
        } else {
            this.showLog("AddView: addview can not find wndnode!");
        }
    },

    addMaskBack: function (type, nextTpye, callback, param) {
        if (this.addMask == false) {
            this.addMask = true;
        } else {
            return;
        }
        var self = this;
        if (cc.isValid(self.mapViewData[type])) {
            let ceilingView = self.getCeilingView();
            let ceilingViewType = self.getCeilingViewType();
            let zOrder = 100;
            if (ceilingView != null) {
                ceilingView.getComponent(ceilingViewType).escape(false);
                zOrder = ceilingView.zIndex + 1;
            }
            // self.mapViewData[type].zIndex=(zOrder)
            let wndNode = cc.find("Canvas/WndNode");
            wndNode.addChild(self.mapViewData[type], zOrder);
            self.vectorViewStack.push(type);
            self.addMask = false;
            this.mapViewData[type].getComponent(type).enter(true);
            self.pushView(nextTpye, callback, true, true, param);
            return;
        }
        GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, "cdnRes/prefab/Windows/" + type, function (prefab) {
            if (prefab != null) {
                self.mapViewData[type] = cc.instantiate(prefab);

                if (GlobalVar.sceneManager().getCurrentSceneType() == SceneDefines.MAIN_STATE) {
                    let wndNode = cc.find("Canvas/WndNode");

                    if (wndNode != null) {
                        let ceilingView = self.getCeilingView();
                        let ceilingViewType = self.getCeilingViewType();
                        let zOrder = 100;
                        if (ceilingView != null) {
                            ceilingView.getComponent(ceilingViewType).escape(false);
                            zOrder = ceilingView.zIndex + 1;
                        }
                        wndNode.addChild(self.mapViewData[type], zOrder);
                        self.vectorViewStack.push(type);
                        self.addMask = false;
                        self.mapViewData[type].getComponent(type).enter(true);
                        self.pushView(nextTpye, callback, true, true, param);
                        self.showLog("AddMaskBack: MackBack was created!");
                    } else {
                        self.showLog("AddMaskBack: WndNode was not founded!");
                    }

                } else {
                    self.showLog("AddMaskBack: CurrentScene is not MainScene");
                }

            } else {
                self.showLog("AddMaskBack: MackBack error!");
                GlobalVar.comMsg.showMsg('请保持网络连接畅通');
            }
        });
    },

    popView: function (needKeepView, callback, needRefresh, needRefreshCeilingView) {
        needKeepView = typeof needKeepView !== 'undefined' ? needKeepView : false;
        needRefresh = typeof needRefresh !== 'undefined' ? needRefresh : true;
        needRefreshCeilingView = typeof needRefreshCeilingView !== 'undefined' ? needRefreshCeilingView : true;

        let ceilingView = this.getCeilingView();

        if (ceilingView != null) {
            let ceilingViewType = this.getCeilingViewType();
            let ceilingViewName = this.getCeilingViewTypeName();
            ceilingView.getComponent(ceilingViewType).escape(needRefreshCeilingView);
            this.mapViewData[ceilingViewName].removeFromParent(false);
            this.mapViewData[ceilingViewName].zIndex = 0;

            // if (!needKeepView && ceilingViewName != WndTypeDefine.WindowType.E_DT_MASKBACK_WND
            //   && ceilingViewName != WndTypeDefine.WindowType.E_DT_NORMALROOT_WND && ceilingViewName != WndTypeDefine.WindowType.E_DT_ROOTBACK_WND) {
            //     this.mapViewData[ceilingViewName].destroy();
            //     this.mapViewData[ceilingViewName] = null;
            // } else {
            //     this.mapViewData[ceilingViewName].active = false;
            // }

            this.vectorViewStack.pop();

            if (this.vectorViewStack.length > 1 && this.getCeilingViewType() == WndTypeDefine.WindowType.E_DT_MASKBACK_WND) {
                if (this.vectorViewStack[this.vectorViewStack.length - 2] == WndTypeDefine.WindowType.E_DT_NORMALROOT_WND) {
                    let index = this.findViewIndex(WndTypeDefine.WindowType.E_DT_ROOTBACK_WND);
                    this.downViewToIndex(WndTypeDefine.WindowType.E_DT_MASKBACK_WND, index);
                } else {
                    this.upViewToCeiling(this.vectorViewStack[this.vectorViewStack.length - 2], needRefresh, needRefreshCeilingView);
                }
            } else {
                //if (needRefresh) {
                ceilingView = this.getCeilingView();
                if (ceilingView != null) {
                    ceilingView.getComponent(this.getCeilingViewType()).enter(needRefresh);
                }
                //}
                this.optimizeView();
            }
            if (callback) {
                callback();
            }
        } else {
            this.showLog("PopView: ceilingView is null!");
        }
    },

    insertView: function (type, targetTypeName, callback, needRefresh, needRefreshCeilingView, param) {
        needRefresh = typeof needRefresh !== 'undefined' ? needRefresh : false;
        needRefreshCeilingView = typeof needRefreshCeilingView !== 'undefined' ? needRefreshCeilingView : false;
        var index = -1;
        var typeName = type;

        if (param) {
            typeName = type + "_" + param;
        }
        this.showLog("InsertView: typeName = " + typeName);

        index = this.findViewIndex(typeName);
        if (index != -1) {
            this.showLog("InsertView: view is already existed in Stack");
            return;
        }
        index = -1;
        index = this.findViewIndex(targetTypeName);

        if (index == -1) {
            this.showLog("InsertView: target is not found, change PushView");
            this.pushView(type, callback, param);
            return;
        } else {
            this.showLog("InsertView: index = " + index);
        }

        let block = cc.find("Canvas/BlockNode");
        block.active = true;

        if (!cc.isValid(this.mapViewData[typeName])) {
            this.setRevertViewStack();
            var self = this;
            GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, "cdnRes/prefab/Windows/" + type, function (prefab) {
                if (prefab != null) {
                    self.mapViewData[typeName] = cc.instantiate(prefab);
                    self.addView(type, needRefresh, needRefreshCeilingView, callback, param, index);
                    self.showLog("InsertView: resmanager loadres success, insert success!");
                } else {
                    self.showLog("InsertView: insert failed!");
                    self.revertStack();
                    GlobalVar.comMsg.showMsg('请保持网络连接畅通');
                }
            });
        } else {
            this.addView(type, needRefresh, needRefreshCeilingView, callback, param, index);
            this.showLog("InsertView: windowmanager has this view, insert success!");
        }
    },

    deleteView: function (type, needRefreshCeilingView, needKeepView, param) {
        needRefreshCeilingView = typeof needRefreshCeilingView !== 'undefined' ? needRefreshCeilingView : true;
        needKeepView = typeof needKeepView !== 'undefined' ? needKeepView : false;

        let index = -1;
        let typeName = type;

        if (param) {
            typeName = type + "_" + param;
        }

        this.showLog("DeleteView: typeName = " + typeName);

        index = this.findViewIndex(typeName);

        if (index == -1) {
            this.showLog("DeleteView: " + typeName + " is not exist in Stack");
            return;
        } else {
            this.showLog("DeleteView: index = " + index);
        }

        let dView = this.mapViewData[this.vectorViewStack[index]];
        if (dView != null) {
            dView.getComponent(type).escape(true);
            this.mapViewData[typeName].removeFromParent(false);
            this.mapViewData[typeName].zIndex = 0;
            // if (!needKeepView && typeName != WndTypeDefine.WindowType.E_DT_MASKBACK_WND
            //     && typeName != WndTypeDefine.WindowType.E_DT_NORMALROOT_WND && typeName != WndTypeDefine.WindowType.E_DT_ROOTBACK_WND) {
            //     this.mapViewData[typeName].destroy();
            //     this.mapViewData[typeName] = null;
            // } else {
            //     this.mapViewData[typeName].active = false;
            // }

            this.vectorViewStack.splice(index, 1);

            if (this.vectorViewStack.length > 1 && this.getCeilingViewTypeName() == WndTypeDefine.WindowType.E_DT_MASKBACK_WND) {
                this.upViewToCeiling(this.vectorViewStack[this.vectorViewStack.length - 2]);
            } else {
                //if (needRefreshCeilingView) {
                var ceilingView = this.getCeilingView();
                if (ceilingView != null) {
                    this.optimizeView();
                    ceilingView.getComponent(this.getCeilingViewType()).enter(needRefreshCeilingView);
                }
                //}
            }
        } else {
            this.showLog("DeleteView: " + typeName + " is not exist in Data");
        }
    },

    pauseView: function () {
        if (GlobalVar.sceneManager().getCurrentSceneType() == SceneDefines.MAIN_STATE) {
            this.record = '';
            for (let i = 0; i < this.vectorViewStack.length; i++) {
                if (this.vectorViewStack[i] == WndTypeDefine.WindowType.E_DT_ENDLESS_CHALLENGE_VIEW) {
                    this.record = WndTypeDefine.WindowType.E_DT_ENDLESS_CHALLENGE_VIEW;
                } else if (this.vectorViewStack[i] == WndTypeDefine.WindowType.E_DT_NORMAL_QUESTLIST_VIEW) {
                    this.record = WndTypeDefine.WindowType.E_DT_NORMAL_QUESTLIST_VIEW;
                } else if (this.vectorViewStack[i] == WndTypeDefine.WindowType.E_DT_NORMAL_ARENA_MAIN_WND) {
                    this.record = WndTypeDefine.WindowType.E_DT_NORMAL_ARENA_MAIN_WND;
                }
            }
            this.vectorViewStack.splice(0, this.vectorViewStack.length);
        }
    },

    resumeView: function () {
        if (GlobalVar.sceneManager().getCurrentSceneType() == SceneDefines.MAIN_STATE) {
            if (typeof this.record !== 'undefined') {
                if (this.record != '') {
                    if (this.record == WndTypeDefine.WindowType.E_DT_ENDLESS_CHALLENGE_VIEW) {
                        this.pushView(WndTypeDefine.WindowType.E_DT_ENDLESS_CHALLENGE_VIEW, function (wnd, type, name) {
                            wnd.getComponent(type).judgeHaveRewardBox();
                        });
                    } else if (this.record == WndTypeDefine.WindowType.E_DT_NORMAL_QUESTLIST_VIEW) {
                        this.pushView(WndTypeDefine.WindowType.E_DT_NORMAL_QUESTLIST_VIEW, function (wnd, type, name) {
                            // wnd.getComponent(type).initQuestListViewData(true);
                            wnd.getComponent(type).setForce(true);
                            wnd.getComponent(type).needShowRecommond();
                            wnd.getComponent(type).needShowTestPlayFinish();
                        });
                    } else if (this.record == WndTypeDefine.WindowType.E_DT_NORMAL_ARENA_MAIN_WND) {
                        GlobalVar.handlerManager().arenaHandler.sendArenaOpenReq();
                    } else if (this.record == WndTypeDefine.WindowType.E_DT_NORMALIMPROVEMENT_WND) {
                        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMALIMPROVEMENT_WND, function (wnd, name, type) {
                            wnd.getComponent(type).selectEquipment(null, 1);
                        }, true, false);
                    } else {
                        this.pushView(this.record);
                    }
                }
                this.record = '';
            }
        }
    },

    changeRecordView: function (record) {
        this.record = typeof record !== 'undefined' ? record : '';
    },

    clearRecordView: function () {
        this.record = '';
    },

    setRevertViewStack: function () {
        this.revertViewStack.splice(0, this.revertViewStack.length);
        for (let i = 0; i < this.vectorViewStack.length; i++) {
            let viewData = {};
            viewData.name = this.vectorViewStack[i];
            viewData.z = this.mapViewData[this.vectorViewStack[i]].zIndex;
            this.revertViewStack.push(viewData);
        }
    },

    revertStack: function () {
        this.pushName = '';
        this.pushArray.splice(0, this.pushArray.length);
        let topType = this.getCeilingViewType();
        if (topType == WndTypeDefine.WindowType.E_DT_MASKBACK_WND && this.vectorViewStack.length == 1 && this.revertViewStack.length == this.vectorViewStack.length) {
            this.popView(false);
        } else if (this.revertViewStack.length > 0 && this.revertViewStack.length == this.vectorViewStack.length) {
            this.vectorViewStack.splice(0, this.vectorViewStack.length);
            for (let i = 0; i < this.revertViewStack.length; i++) {
                this.vectorViewStack.push(this.revertViewStack[i].name);
                if (cc.isValid(this.mapViewData[this.revertViewStack[i].name])) {
                    this.mapViewData[this.revertViewStack[i].name].zIndex = this.revertViewStack[i].z;
                }
            }
            let topView = this.getTopView();
            if (topView != null) {
                topView.getComponent(this.getTopViewType()).enter(true);
            }
        }
        let block = cc.find("Canvas/BlockNode");
        block.active = false;
    },

    upViewToCeiling: function (typeName, needRefresh, needRefreshCeilingView) {
        needRefresh = typeof needRefresh !== 'undefined' ? needRefresh : false;
        needRefreshCeilingView = typeof needRefreshCeilingView !== 'undefined' ? needRefreshCeilingView : false;
        var index = -1;
        index = this.findViewIndex(typeName);

        this.showLog("upViewToCeiling: name = " + typeName + "; index = " + index + ";");

        if (index != -1 && index != this.vectorViewStack.length - 1) {
            var ceilingView = this.getCeilingView();
            var targetZOrder = ceilingView.zIndex;
            ceilingView.getComponent(this.getCeilingViewType()).escape(needRefreshCeilingView);

            this.mapViewData[typeName].enabled = true;
            this.mapViewData[typeName].zIndex = targetZOrder;

            for (let i = index + 1; i <= this.vectorViewStack.length - 1; i++) {
                let view = this.mapViewData[this.vectorViewStack[i]];
                view.zIndex = view.zIndex - 1;
                this.showLog("upViewToCeiling : typeName = " + this.vectorViewStack[i] + "; z = " + view.zIndex + ";");
            }

            this.vectorViewStack.splice(index, 1);
            this.vectorViewStack.push(typeName);

            ceilingView = this.getCeilingView();
            if (ceilingView != null) {
                this.optimizeView();
                ceilingView.getComponent(this.getCeilingViewType()).enter(needRefresh);
            }

        }
    },

    downViewToIndex: function (typeName, insertIndex) {
        var index = -1;
        index = this.findViewIndex(typeName);

        this.showLog("downViewToFloor: name = " + typeName + "; index = " + index + ";");

        if (index != -1 && index != 0) {
            let floorView = this.getFloorView();
            let targetZOrder = floorView.zIndex;
            floorView.getComponent(this.getFloorViewType()).escape(false);

            this.mapViewData[typeName].zIndex = targetZOrder;

            for (let i = insertIndex; i < index; i++) {
                var view = this.mapViewData[this.vectorViewStack[i]];
                view.zIndex = view.zIndex + 1;
                this.showLog("downViewToFloor : typeName = " + this.vectorViewStack[i] + "; z = " + view.zIndex + ";");
            }

            this.vectorViewStack.splice(index, 1);
            this.vectorViewStack.splice(insertIndex, 0, typeName);

            if (this.getCeilingViewType() == WndTypeDefine.WindowType.E_DT_MASKBACK_WND && this.vectorViewStack.length > 1) {
                this.upViewToCeiling(this.vectorViewStack[this.vectorViewStack.length - 2]);
            }

            let ceilingView = this.getCeilingView();
            if (ceilingView != null) {
                this.optimizeView();
                ceilingView.getComponent(this.getCeilingViewType()).enter(false);
            }
        }
    },

    downViewToFloor: function (typeName) {
        let index = -1;
        index = this.findViewIndex(typeName);

        this.showLog("downViewToFloor: name = " + typeName + "; index = " + index + ";");

        if (index != -1 && index != 0) {
            let floorView = this.getFloorView();
            let targetZOrder = floorView.zIndex;
            floorView.getComponent(this.getFloorViewType()).escape(false);

            this.mapViewData[typeName].zIndex = targetZOrder;

            for (let i = 0; i < index; i++) {
                var view = this.mapViewData[this.vectorViewStack[i]];
                view.zIndex = view.zIndex + 1;
                this.showLog("downViewToFloor : typeName = " + this.vectorViewStack[i] + "; z = " + view.zIndex + ";");
            }

            this.vectorViewStack.splice(index, 1);
            this.vectorViewStack.splice(0, 0, typeName);

            if (this.getCeilingViewType() == WndTypeDefine.WindowType.E_DT_MASKBACK_WND && this.vectorViewStack.length > 1) {
                this.upViewToCeiling(this.vectorViewStack[this.vectorViewStack.length - 2]);
            }

            let ceilingView = this.getCeilingView();
            if (ceilingView != null) {
                this.optimizeView();
                ceilingView.getComponent(this.getCeilingViewType()).enter(false);
            }
        }
    },

    popToRoot: function (needKeepMask, callback) {
        needKeepMask = typeof needKeepMask !== 'undefined' ? needKeepMask : false;
        // if (needKeepMask) {
        //     var index = -1;
        //     index = this.findViewIndex(WndTypeDefine.WindowType.E_DT_MASKBACK_WND);
        //     this.vectorViewStack.splice(index, 1);
        // }

        while (this.vectorViewStack.length > 0) {
            let ceilingView = this.getCeilingView();
            if (!!ceilingView && !!ceilingView.getComponent(this.getCeilingViewType()).animeStartParam) {
                ceilingView.getComponent(this.getCeilingViewType()).animeStartParam(0, 0);
            }
            ceilingView.getComponent(this.getCeilingViewType()).unRegisterEvents();

            this.popView(false, null, false);
            this.showLog("poptoroot count :" + this.vectorViewStack.length);
        }

        // if (needKeepMask) {
        //     this.vectorViewStack.push(WndTypeDefine.WindowType.E_DT_MASKBACK_WND);
        //     this.optimizeView();
        // }

        if (!!callback) {
            callback();
        }
    },

    popToTargetView: function (targetType, needKeepView, needRefresh, needRefreshCeilingView, callback, param) {
        needKeepView = typeof needKeepView !== 'undefined' ? needKeepView : false;
        needRefresh = typeof needRefresh !== 'undefined' ? needRefresh : false;
        needRefreshCeilingView = typeof needRefreshCeilingView !== 'undefined' ? needRefreshCeilingView : false;
        let index = -1;
        let typeName = targetType;

        if (param) {
            typeName = targetType + "_" + param;
        }

        this.showLog("popToTargetView: typeName = " + typeName);

        index = this.findViewIndex(typeName);
        if (this.findViewInStack(typeName) != "") {
            this.downViewToFloor(WndTypeDefine.WindowType.E_DT_MASKBACK_WND);

            index = this.findViewIndex(typeName);
            this.showLog("PopToTargetView: index = " + index);

            for (let i = this.vectorViewStack.length - 1; i > index; i--) {
                this.showLog("PopToTargetView: pop " + this.vectorViewStack[i]);
                this.popView(needKeepView, null, needRefresh, needRefreshCeilingView);
            }

            if (this.getCeilingViewType() != WndTypeDefine.WindowType.E_DT_NORMALROOT_WND) {
                let ceilingViewName = this.getCeilingViewTypeName();
                this.upViewToCeiling(WndTypeDefine.WindowType.E_DT_MASKBACK_WND);
                this.upViewToCeiling(ceilingViewName);
            }

            if (callback) {
                callback(this.getTopView(), this.getTopViewType());
            }
        } else {
            this.showLog("PopToTargetView: " + typeName + " is not exist in Stack");
        }
    },

    findViewInStack: function (typeName) {
        var len = this.vectorViewStack.length;
        if (len > 0) {
            for (let i = len - 1; i >= 0; i--) {
                if (this.vectorViewStack[i] == typeName) {
                    return this.vectorViewStack[i];
                }
            }
        }
        return "";
    },

    findViewIndex: function (typeName) {
        var len = this.vectorViewStack.length;
        if (len > 0) {
            for (let i = len - 1; i >= 0; i--) {
                if (this.vectorViewStack[i] == typeName) {
                    return i;
                }
            }
        }
        return -1;
    },

    findViewInWndNode: function (typeName) {
        var name = this.findViewInStack(typeName);
        if (name != "") {
            return this.mapViewData[name];
        }
        return null;
    },

    hideView: function (typeName) {
        var name = this.findViewInStack(typeName);
        if (name != "") {
            this.mapViewData[name].actiev = false;
            // cc.find("Canvas/WndNode/" + name).active = false;
        }
    },

    showView: function (typeName) {
        var name = this.findViewInStack(typeName);
        if (name != "") {
            cc.find("Canvas/WndNode/" + name).active = true;
        }
    },

    getTopView: function () {
        if (this.getCeilingViewType() == WndTypeDefine.WindowType.E_DT_NORMALROOT_WND) {
            var len = this.vectorViewStack.length;
            if (len > 1) {
                return this.mapViewData[this.vectorViewStack[len - 2]];
            }
        }
        return this.getCeilingView();
    },

    getTopViewTypeName: function () {
        if (this.getCeilingViewType() == WndTypeDefine.WindowType.E_DT_NORMALROOT_WND) {
            var len = this.vectorViewStack.length;
            if (len > 1) {
                return this.vectorViewStack[len - 2];
            }
        }
        return this.getCeilingViewTypeName();
    },

    getTopViewType: function () {
        var str = "";
        var len = this.vectorViewStack.length;
        if (len > 0) {
            if (this.getCeilingViewType() == WndTypeDefine.WindowType.E_DT_NORMALROOT_WND) {
                str = this.vectorViewStack[len - 2];
            } else {
                str = this.vectorViewStack[len - 1];
            }
            var index = str.lastIndexOf('_');
            if (index != -1) {
                return str.substr(0, index);
            } else {
                return str;
            }
        }
        return "";
    },

    getCeilingView: function () {
        var len = this.vectorViewStack.length;
        if (len > 0) {
            return this.mapViewData[this.vectorViewStack[len - 1]];
        }
        return null;
    },

    getFloorView: function () {
        var len = this.vectorViewStack.length;
        if (len > 0) {
            return this.mapViewData[this.vectorViewStack[0]];
        }
        return null;
    },

    getCeilingViewTypeName: function () {
        var len = this.vectorViewStack.length;
        if (len > 0) {
            return this.vectorViewStack[len - 1];
        }
        return "";
    },

    getFloorViewTypeName: function () {
        var len = this.vectorViewStack.length;
        if (len > 0) {
            return this.vectorViewStack[0];
        }
        return "";
    },

    getCeilingViewType: function () {
        var len = this.vectorViewStack.length;
        if (len > 0) {
            var str = this.vectorViewStack[len - 1];
            var index = str.lastIndexOf('_');
            if (index != -1) {
                return str.substr(0, index);
            } else {
                return str;
            }
        }
        return "";
    },

    getFloorViewType: function () {
        var len = this.vectorViewStack.length;
        if (len > 0) {
            var str = this.vectorViewStack[0];
            var index = str.lastIndexOf('_');
            if (index != -1) {
                return str.substr(0, index);
            } else {
                return str;
            }
        }
        return "";
    },

    optimizeView: function () {
        for (let i = this.vectorViewStack.length - 1; i >= 0; i--) {
            this.mapViewData[this.vectorViewStack[i]].active = true;
            // this.showLog("OptimizeView: index = " + i + "&& VIEW: " + this.vectorViewStack[i]);
        }
        if (this.vectorViewStack.length > 0) {
            let topType = this.getCeilingViewType();
            if (topType == WndTypeDefine.WindowType.E_DT_MASKBACK_WND && this.vectorViewStack.length == 1) {
                this.popView(false);
            } else {
                let actullayHideIndex = this.findViewIndex(WndTypeDefine.WindowType.E_DT_ROOTBACK_WND);
                let normalRootIndex = this.findViewIndex(WndTypeDefine.WindowType.E_DT_NORMALROOT_WND);
                if (actullayHideIndex != -1 && normalRootIndex != -1) {
                    for (let i = actullayHideIndex - 1; i >= 0; i--) {
                        this.mapViewData[this.vectorViewStack[i]].active = false;
                        this.showLog("OptimizeView: " + this.vectorViewStack[i] + " index:" + i + " is invisible!");
                    }
                    for (let i = normalRootIndex - 2; i > actullayHideIndex; i--) {
                        this.mapViewData[this.vectorViewStack[i]].active = false;
                        this.showLog("OptimizeView: " + this.vectorViewStack[i] + " index:" + i + " is invisible!");
                    }
                }

                // for (let i=this.vectorViewStack.length-1; i >= (normalRootIndex != -1 ? normalRootIndex + 1 : 0); i--) {
                //     if (this.vectorViewStack[i] == WndTypeDefine.WindowType.E_DT_MASKBACK_WND ||
                //         this.vectorViewStack[i] == WndTypeDefine.WindowType.E_DT_ROOTBACK_WND) {
                //         continue;
                //     }
                //     let size = this.mapViewData[this.vectorViewStack[i]].getContentSize();
                //     if (topSize.width >= size.width && topSize.height >= size.height) {
                //         this.mapViewData[this.vectorViewStack[i]].active = false;
                //         this.showLog("OptimizeView: " + this.vectorViewStack[i] + " index:" + i + " is invisible!");
                //     }
                //     //this.showLog("ceilingViewSize.width = " + topSize.width + "; ceilingViewSize.height=" + topSize.height + ";");
                //     //this.showLog("size.width = " + size.width + "; size.height = " + size.height + ";");
                // }
                if (topType != WndTypeDefine.WindowType.E_DT_MASKBACK_WND &&
                    topType != WndTypeDefine.WindowType.E_DT_ROOTBACK_WND &&
                    topType != WndTypeDefine.WindowType.E_DT_NORMALROOT_WND) {
                    let topSize = this.mapViewData[topType].getContentSize();
                    for (let i = this.vectorViewStack.length - 1; i > 0; i--) {
                        if (this.vectorViewStack[i] == WndTypeDefine.WindowType.E_DT_MASKBACK_WND ||
                            this.vectorViewStack[i] == WndTypeDefine.WindowType.E_DT_ROOTBACK_WND ||
                            this.vectorViewStack[i] == WndTypeDefine.WindowType.E_DT_NORMALROOT_WND) {
                            continue;
                        }
                        let size = this.mapViewData[this.vectorViewStack[i]].getContentSize();
                        if (topSize.height > size.height + 20) {
                            this.mapViewData[this.vectorViewStack[i]].active = false;
                        }
                        // cc.log(topType + "  ceilingViewSize.width = " + topSize.width + "; ceilingViewSize.height=" + topSize.height + ";");
                        // cc.log(this.vectorViewStack[i] + "  size.width = " + size.width + "; size.height = " + size.height + ";");
                    }
                }

                if (topType == WndTypeDefine.WindowType.E_DT_MASKBACK_WND) {
                    return;
                }
                if (topType == WndTypeDefine.WindowType.E_DT_NORMALTREASUREEXPLOIT ||
                    topType == WndTypeDefine.WindowType.E_DT_NORMAL_LEVEL_UP_WND ||
                    topType == WndTypeDefine.WindowType.E_DT_NORMAL_GET_NEW_ITEM_WND) {
                    this.mapViewData[topType].active = true;

                    let i = this.vectorViewStack.length - 2 > 0 ? this.vectorViewStack.length - 2 : 0;
                    for (let j = i; j > 0; j--) {
                        if (this.vectorViewStack[j]) {
                            if (this.vectorViewStack[j] == WndTypeDefine.WindowType.E_DT_NORMALTREASUREEXPLOIT ||
                                this.vectorViewStack[j] == WndTypeDefine.WindowType.E_DT_NORMAL_LEVEL_UP_WND ||
                                this.vectorViewStack[j] == WndTypeDefine.WindowType.E_DT_NORMAL_GET_NEW_ITEM_WND) {
                                this.mapViewData[this.vectorViewStack[j]].active = false;
                            }
                        }
                    }
                }
            }
        }



    },

    showLog: function (str) {
        if (this.openLog) {
            cc.log(str);
        }
    },
});