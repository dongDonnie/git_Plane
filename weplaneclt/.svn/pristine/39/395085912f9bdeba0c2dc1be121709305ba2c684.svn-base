const ResMapping = require("resmapping");
const ResManager = require("ResManager");
const WindowManager = require("windowmgr");
const WndTypeDefine = require("wndtypedefine");
const GlobalVar = require("globalvar");
const GameServerProto = require("GameServerProto");
const GlobalFunc = require('GlobalFunctions')
module.exports = {

    onlyClose: 0,
    oneConfirm: 1,
    bothConfirmAndCancel: 2,

    showMessage: function (callback, mode, title, rstrMsg, pFunCloseCallback, pFunConfirmCallback, pFunCancelCallback, confirmName, cancelName) {
        let windowMgr = WindowManager.getInstance();
        windowMgr.pushView(WndTypeDefine.WindowType.E_DT_COMMON_WND, function (wnd, name, type) {
            wnd.getComponent(WndTypeDefine.WindowType.E_DT_COMMON_WND).setContent(mode, name, type, title, rstrMsg, pFunCloseCallback, pFunConfirmCallback, pFunCancelCallback, "", confirmName, cancelName);
            if (callback) {
                callback(wnd, name, type);
            }
        });
    },

    showMessageWithPrefab: function (callback, mode, prefabName, title, rstrMsg, pFunCloseCallback, pFunConfirmCallback, pFunCancelCallback, confirmName, cancelName) {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_COMMON_WND, function (wnd, name, type) {
            wnd.getComponent(WndTypeDefine.WindowType.E_DT_COMMON_WND).setContent(mode, name, type, title, rstrMsg, pFunCloseCallback, pFunConfirmCallback, pFunCancelCallback, prefabName, confirmName, cancelName);
            if (callback) {
                callback(wnd, name, type);
            }
        });
    },

    showDrawConfirmWnd: function (callback, title, rstrMsg, drawMode, ticketsEnough, diamondEnough, pFunCloseCallback, pFunConfirmCallback, pFunCancelCallback, confirmName, cancelName) {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_COMMON_WND, function (wnd, name, type) {
            wnd.getComponent(WndTypeDefine.WindowType.E_DT_COMMON_WND).setDrawConfirmContent(name, type, title, rstrMsg, drawMode, ticketsEnough, diamondEnough, pFunCloseCallback, pFunConfirmCallback, pFunCancelCallback, confirmName, cancelName);
            if (callback) {
                callback(wnd, name, type);
            }
        });
    },

    showDrawBoxPreview: function (callback, title, itemMustIDVec, itemProbIDVec, pFunCloseCallback, pFunConfirmCallback, pFunCancelCallback){
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_COMMON_WND, function (wnd, name, type) {
            wnd.getComponent(type).setDrawBoxPreviewContent(name, type, title, pFunCloseCallback, pFunConfirmCallback, pFunCancelCallback);
            wnd.getComponent(type).setItemShowVec(itemMustIDVec, itemProbIDVec);
            if (callback) {
                callback(wnd, name, type);
            }
        });
    },

    showBuySpConfirmWnd: function (callback, title, pFunCloseCallback, pFunConfirmCallback, pFunCancelCallback, confirmName, cancelName) {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_COMMON_WND, function (wnd, name, type) {
            wnd.getComponent(WndTypeDefine.WindowType.E_DT_COMMON_WND).setBuySpContent(name, type, title, pFunCloseCallback, pFunConfirmCallback, pFunCancelCallback, confirmName, cancelName);
            if (callback) {
                callback(wnd, name, type);
            }
        });
    },

    showRewardBoxWnd: function (callback, title, condition, vecItems, pFunCloseCallback, pFunConfirmCallback, pFunCancelCallback, confirmName, cancelName) {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_COMMON_WND, function (wnd, name, type) {
            wnd.getComponent(WndTypeDefine.WindowType.E_DT_COMMON_WND).setItemBoxContent(name, type, title, condition, vecItems, pFunCloseCallback, pFunConfirmCallback, pFunCancelCallback, confirmName, cancelName);
            if (callback) {
                callback(wnd, name, type);
            }
        });
    },

    showResetQuestTimesWnd: function(callback, title, resetDesc, diamondCost, pFunCloseCallback, pFunConfirmCallback, pFunCancelCallback, confirmName, cancelName){
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_COMMON_WND, function (wnd, name, type) {
            wnd.getComponent(WndTypeDefine.WindowType.E_DT_COMMON_WND).setResetQuestContent(name, type, title, resetDesc, diamondCost, pFunCloseCallback, pFunConfirmCallback, pFunCancelCallback, confirmName, cancelName);
            if (callback) {
                callback(wnd, name, type);
            }
        });
    },

    showPurchaseWnd: function (getItem, canBuyCount, costItemArray, titleString, describeString, confirmCallback, cancelCallback, setCostNumCallback) {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_PURCHASE_WND, function (wnd, name, type) {
            wnd.getComponent(WndTypeDefine.WindowType.E_DT_NORMAL_PURCHASE_WND).setParam(getItem, canBuyCount, costItemArray, titleString, describeString, confirmCallback, cancelCallback, setCostNumCallback);
        }); 
    },

    showStoreWithParam: function (storeType) {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_STORE_WND,
            function (wnd, name, type) {
                wnd.getComponent(WndTypeDefine.WindowType.E_DT_NORMAL_STORE_WND).setStoreType(storeType);
            });
    },

    showLimitStoreWithParam: function (storeType) {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_LIMIT_STORE_WND,
            function (wnd, name, type) {
                wnd.getComponent(WndTypeDefine.WindowType.E_DT_LIMIT_STORE_WND).setStoreType(storeType);
            });
    },

    showItemBag: function (showType, selectCallback, choosingCallback, target, openType) {
        openType = typeof openType !== 'undefined' ? openType : -1;
        if (WindowManager.getInstance().findViewIndex(WndTypeDefine.WindowType.E_DT_NORMALROOT_WND) != -1) {
            if (openType == 1) {
                WindowManager.getInstance().insertView(WndTypeDefine.WindowType.E_DT_NORMALBAG, WndTypeDefine.WindowType.E_DT_NORMALROOT_WND, function (wnd, name, type) {
                    wnd.getComponent(type).openType = openType;
                    wnd.getComponent(type).chooseModeByOpenType(openType);
                    if (!!target) {
                        wnd.getComponent(type).setShowType(showType, selectCallback.bind(target));
                        wnd.getComponent(type).setGridCallback(choosingCallback.bind(target));
                    } else {
                        wnd.getComponent(type).setShowType(showType, selectCallback);
                        wnd.getComponent(type).setGridCallback(choosingCallback);
                    }
                }, true, false);
            } else {
                WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMALBAG, function (wnd, name, type) {
                    wnd.getComponent(type).openType = openType;
                    wnd.getComponent(type).chooseModeByOpenType(openType);
                    if (!!target) {
                        wnd.getComponent(type).setShowType(showType, selectCallback.bind(target));
                        wnd.getComponent(type).setGridCallback(choosingCallback.bind(target));
                    } else {
                        wnd.getComponent(type).setShowType(showType, selectCallback);
                        wnd.getComponent(type).setGridCallback(choosingCallback);
                    }
                });
            }
        } else {
            WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMALBAG, function (wnd, name, type) {
                wnd.getComponent(type).openType = openType;
                wnd.getComponent(type).chooseModeByOpenType(openType);
                if (!!target) {
                    wnd.getComponent(type).setShowType(showType, selectCallback.bind(target));
                    wnd.getComponent(type).setGridCallback(choosingCallback.bind(target));
                } else {
                    wnd.getComponent(type).setShowType(showType, selectCallback);
                    wnd.getComponent(type).setGridCallback(choosingCallback);
                }
            });
        }
    },

    showItemGetWay: function (id, count, slot) {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMALITEMGETWAY, function (wnd, name, type) {
            wnd.getComponent(type).updateInfo(id, count, 0, slot);
        });
    },

    showNormalPlane: function () {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMALPLANE_WND);
    },

    showNormalEquipment: function (memberID) {
        if (WindowManager.getInstance().findViewIndex(WndTypeDefine.WindowType.E_DT_NORMALROOT_WND) != -1) {
            WindowManager.getInstance().insertView(WndTypeDefine.WindowType.E_DT_NORMALEQUIPMENT_WND, WndTypeDefine.WindowType.E_DT_NORMALROOT_WND, function (wnd, name, type) {
                let member = GlobalVar.me().memberData.getMemberByID(memberID);
                wnd.getComponent(type).updataFighter(member.MemberID, member.Quality, member.Level);
            }, true, false);
        } else {
            WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMALEQUIPMENT_WND, function (wnd, name, type) {
                let member = GlobalVar.me().memberData.getMemberByID(memberID);
                wnd.getComponent(type).updataFighter(member.MemberID, member.Quality, member.Level);
            });
        }
    },
    showImprovementView: function(){
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMALIMPROVEMENT_WND, function (wnd, name, type) {
            wnd.getComponent(type).selectEquipment(null, 1);
        }, true, false);
    },

    showSelectExpTab: function (choosingCallback, choosingCallbackTarget) {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_SELECTEXPVIEW_WND, function (wnd, name, type) {
            if (typeof choosingCallbackTarget !== 'undefined') {
                wnd.getComponent(type).setChoosingCallback(choosingCallback.bind(choosingCallbackTarget));
            } else {
                wnd.getComponent(type).setChoosingCallback(choosingCallback);
            }
        });
    },

    showGuazai: function () {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_GUAZAIMAIN_WND);
    },

    showGuazaiAdvance: function (item) {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_GUAZAIADVANCE_WND, function (wnd, name, type) {
            wnd.getComponent(type).setParam(item);
        });
    },

    showGuazaiSmelter: function () {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_GUAZAISMELTER_WND);
    },

    showBuySpWnd: function (shareCallBack, purchaseCallback, closeCallback) {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_BUY_SP_WND, function (wnd, name, type) {
            wnd.getComponent(type).initBuySpWnd(shareCallBack, purchaseCallback, closeCallback);
        });
    },

    showPlayerInfoWnd: function () {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_PLAYERINFO_WND);
    },

    showSettingWnd: function () {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMALSETTING, function (wnd, name, type){
        });
    },

    showRankingView: function (rankingType) {
        WindowManager.getInstance().insertView(WndTypeDefine.WindowType.E_DT_RANKINGLIST_VIEW, WndTypeDefine.WindowType.E_DT_NORMALROOT_WND, function (wnd, name, type) {
            wnd.getComponent(type).setRankingType(rankingType);
        }, true, false);
    },

    showDrawView: function () {
        if (WindowManager.getInstance().findViewIndex(WndTypeDefine.WindowType.E_DT_NORMALROOT_WND) != -1) {
            WindowManager.getInstance().popToRoot(false, function () {
                WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMALDRAW_VIEW);
            })
            // WindowManager.getInstance().insertView(WndTypeDefine.WindowType.E_DT_NORMALDRAW_VIEW, WndTypeDefine.WindowType.E_DT_NORMALROOT_WND);
        } else {
            WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMALDRAW_VIEW);
        }
    },

    showNoticeWnd: function () {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMALNOTICE_VIEW);
    },

    showMailWnd: function () {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMALMAIL_VIEW);
    },

    showEndlessView: function () {
        if (WindowManager.getInstance().findViewIndex(WndTypeDefine.WindowType.E_DT_NORMALROOT_WND) != -1) {
            WindowManager.getInstance().popToRoot(false, function () {
                WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_ENDLESS_CHALLENGE_VIEW);
            })
        }else{
            WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_ENDLESS_CHALLENGE_VIEW);
        }
    },
    showEndlessModeSelectWnd: function (choosingCallback) {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_ENDLESS_MODE_SELECT_WND, function (wnd, name, type) {
            wnd.getComponent(type).setChoosingCallback(choosingCallback);
        });
    },

    showRechargeWnd: function () {
        if (GlobalVar.srcSwitch()){
            return;
        }
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_RECHARGE_WND);
    },

    showRichTreasureWnd: function () {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_RICHTREASURE_WND);
    },

    showBatchUseWnd: function (useItemID, packItemsData) {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_BATCH_USE_WND, function(wnd, name, type){
            wnd.getComponent(type).setResultData(useItemID, packItemsData);
        });
    },

    showFeedbackWnd: function () {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_FEEDBACK_WND);
    },

    showQuestInfoWnd: function (data, tblData) {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_QUESTINFO_WND, function (wnd, name, type) {
            wnd.getComponent(type).initQuestInfoWithData(data, tblData);
        });
    },

    showSweepWnd: function (count, data, tblData) {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_SWEEP_WND, function (wnd, name, type) {
            wnd.getComponent(type).setSweepCampInfo(data, tblData);
            wnd.getComponent(type).setSweepTimes(count);
        });
    },

    showQuestList: function (force, chapterIndex, campaignIndex) {
        if (WindowManager.getInstance().findViewIndex(WndTypeDefine.WindowType.E_DT_NORMALROOT_WND) != -1) {
            WindowManager.getInstance().popToRoot(false, function () {
                WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_QUESTLIST_VIEW, function (wnd, name, type) {
                    wnd.getComponent(type).setForce(force);
                });
            })
        }else{
            WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_QUESTLIST_VIEW, function (wnd, name, type) {
                wnd.getComponent(type).setForce(force);
            });
        }
    },

    showChapterListView: function(chapterType, curMapIndex) {
        WindowManager.getInstance().insertView(WndTypeDefine.WindowType.E_DT_NORMAL_CHAPTER_VIEW, WndTypeDefine.WindowType.E_DT_NORMALROOT_WND, function (wnd, name, type) {
            wnd.getComponent(type).initChapterViewWithType(chapterType, curMapIndex);
        }, true, false)
    },

    showTreasureExploit: function(items, mode, callback){
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMALTREASUREEXPLOIT, function(wnd,name,type){
            wnd.getComponent(type).init(items, mode);
            callback && callback();
        });
    },

    showPlayerLevelUpWnd: function(levelUpData){
        // WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMALTREASUREEXPLOIT, function(wnd, name, type){
        //     wnd.getComponent(type).initLevelUpWnd(levelUpData);
        // }, true, "levelUp");
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_LEVEL_UP_WND, function(wnd, name, type){
            wnd.getComponent(type).initLevelUpWnd(levelUpData);
        })
    },
    showGetNewRareItemWnd: function (item, mode, showType, callback){
        // WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMALTREASUREEXPLOIT, function(wnd, name, type){
        //     wnd.getComponent(type).initNewRareItemWnd(item, mode);
        // }, true, "newRareItem");
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_GET_NEW_ITEM_WND, function(wnd, name, type){
            wnd.getComponent(type).initNewRareItemWnd(item, mode, showType, callback);
        })
    },

    showDailyMissionWnd: function(index){
        if (WindowManager.getInstance().findViewIndex(WndTypeDefine.WindowType.E_DT_NORMAL_DAILY_MISSION_WND) == -1){
            WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_DAILY_MISSION_WND, function(wnd, name, type){
                wnd.getComponent(type).setDefaultTab(index);
            });
        }
    },

    showActiveWnd: function (){
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_ACTIVE_WND);
    },

    showEquipQualityUpWnd: function (beforeItemID, afterItemID, equipNamebefore, equipName, equipColorBefore, equipColor, callback){
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_EQUIP_QUALITY_UP_WND, function(wnd, name, type) {
            wnd.getComponent(type).setDefaultEquipt(beforeItemID, afterItemID, equipNamebefore, equipName, equipColorBefore, equipColor, callback);
        });
    },

    showPlaneQualityUpWnd: function (qualityDataCur, qualityData, callback) {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_PLANE_QUALITY_UP_WND, function (wnd, name, type) {
            wnd.getComponent(type).setDefaultEquipt(qualityDataCur, qualityData, callback);
        });
    },

    showExDiamondWnd: function () {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_EXDIAMOND_WND);
    },

    showNormalFreeGetWnd: function (errCode, shareCallback, purchaseCallback, closeCallback) {
        if (GlobalVar.srcSwitch() && !GlobalVar.getShareSwitch() && errCode == GameServerProto.PTERR_DIAMOND_LACK){
            GlobalVar.comMsg.errorWarning(errCode);
            closeCallback && closeCallback();
            return;
        }
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_FREE_GET_WND, function(wnd, name, type) {
            wnd.getComponent(type).initFreeGetWnd(errCode, shareCallback, purchaseCallback, closeCallback);
        });
    },
};