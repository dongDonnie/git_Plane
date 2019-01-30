const WindowManager = require("windowmgr");
const WndTypeDefine = require("wndtypedefine");
const GlobalVar = require("globalvar");
const GameServerProto = require("GameServerProto");
module.exports = {

    onlyClose: 0,
    oneConfirm: 1,
    bothConfirmAndCancel: 2,
    shareOnly: 3,
    videoOnly: 4,

    showMessage: function (callback, mode, title, rstrMsg, pFunCloseCallback, pFunConfirmCallback, pFunCancelCallback, confirmName, cancelName) {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_COMMON_WND, function (wnd, name, type) {
            wnd.getComponent(WndTypeDefine.WindowType.E_DT_COMMON_WND).setContent(mode, name, type, title, rstrMsg, pFunCloseCallback, pFunConfirmCallback, pFunCancelCallback, "", confirmName, cancelName);
            if (callback) {
                callback(wnd, name, type);
            }
        });
    },

    showTreasureTipWnd: function (title, text, drawMode, ticketsEnough, diamondEnough, pFunCloseCallback, pFunConfirmCallback, pFunCancelCallback) {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_TREASURE_TIP_WND, function (wnd, name, type) {
            wnd.getComponent(type).initTreasureTipWnd(title, text, drawMode, ticketsEnough, diamondEnough, pFunCloseCallback, pFunConfirmCallback, pFunCancelCallback)
        })
    },
    showCutTimeWnd: function () {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_CUT_TIME_WND)
    },

    showDrawBoxPreview: function (itemMustIDVec, itemProbIDVec, callback) {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMALDRAW_PREVIEW_WND, function (wnd, name, type) {
            wnd.getComponent(type).setItemShowVec(itemMustIDVec, itemProbIDVec);
            if (callback) {
                callback(wnd, name, type);
            }
        })
    },

    showRewardBoxWnd: function (callback, mode, title, condition, vecItems, pFunConfirmCallback, confirmName, pFunCloseCallback) {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_REWARD_BOX_WND, function (wnd, name, type) {
            wnd.getComponent(WndTypeDefine.WindowType.E_DT_NORMAL_REWARD_BOX_WND).initPanel(mode, title, condition, vecItems, pFunConfirmCallback, confirmName, pFunCloseCallback);
            if (callback) {
                callback(wnd, name, type);
            }
        });
    },

    showResetQuestTimesWnd: function (campData, tblData) {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_QUEST_RESET_WND, function (wnd, name, type) {
            wnd.getComponent(type).initQuestResetWnd(campData, tblData);
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
    showImprovementView: function () {
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

    showGuazaiChip: function () {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_GUAZAICHIP_WND);
    },

    showBuySpWnd: function () {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_BUY_SP_WND, function (wnd, name, type) {
            wnd.getComponent(type).initBuySpWnd();
        });
    },

    showBuyJinhuaWnd: function () {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_BUY_JINHUA_WND, function (wnd, name, type) {
            wnd.getComponent(type).refreshJinHuaWndUI();
        });
    },

    showPlayerInfoWnd: function () {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_PLAYERINFO_WND);
    },

    showSettingWnd: function () {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMALSETTING, function (wnd, name, type) {
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

    showNoticeWnd: function (callback) {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMALNOTICE_VIEW, function () {
            callback && callback();
        });
    },

    showMailWnd: function () {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMALMAIL_VIEW);
    },

    showEndlessView: function () {
        if (WindowManager.getInstance().findViewIndex(WndTypeDefine.WindowType.E_DT_NORMALROOT_WND) != -1) {
            WindowManager.getInstance().popToRoot(false, function () {
                WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_ENDLESS_CHALLENGE_VIEW);
            })
        } else {
            WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_ENDLESS_CHALLENGE_VIEW);
        }
    },
    showEndlessModeSelectWnd: function (choosingCallback) {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_ENDLESS_MODE_SELECT_WND, function (wnd, name, type) {
            wnd.getComponent(type).setChoosingCallback(choosingCallback);
        });
    },

    showRechargeWnd: function () {
        if (GlobalVar.srcSwitch()) {
            return;
        }
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_RECHARGE_WND);
    },

    showRichTreasureWnd: function () {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_RICHTREASURE_WND);
    },

    showBatchUseWnd: function (useItemID, packItemsData) {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_BATCH_USE_WND, function (wnd, name, type) {
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
        } else {
            WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_QUESTLIST_VIEW, function (wnd, name, type) {
                wnd.getComponent(type).setForce(force);
            });
        }
    },

    showChapterListView: function (chapterType, curMapIndex) {
        WindowManager.getInstance().insertView(WndTypeDefine.WindowType.E_DT_NORMAL_CHAPTER_VIEW, WndTypeDefine.WindowType.E_DT_NORMALROOT_WND, function (wnd, name, type) {
            wnd.getComponent(type).initChapterViewWithType(chapterType, curMapIndex);
        }, true, false)
    },

    showTreasureExploit: function (items, mode, callback) {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMALTREASUREEXPLOIT, function (wnd, name, type) {
            wnd.getComponent(type).init(items, mode);
            callback && callback();
        });
    },

    showPlayerLevelUpWnd: function (levelUpData) {
        // WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMALTREASUREEXPLOIT, function(wnd, name, type){
        //     wnd.getComponent(type).initLevelUpWnd(levelUpData);
        // }, true, "levelUp");
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_LEVEL_UP_WND, function (wnd, name, type) {
            wnd.getComponent(type).initLevelUpWnd(levelUpData);
        })
    },
    showGetNewRareItemWnd: function (item, mode, showType, callback) {
        // WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMALTREASUREEXPLOIT, function(wnd, name, type){
        //     wnd.getComponent(type).initNewRareItemWnd(item, mode);
        // }, true, "newRareItem");
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_GET_NEW_ITEM_WND, function (wnd, name, type) {
            wnd.getComponent(type).initNewRareItemWnd(item, mode, showType, callback);
        })
    },

    showDailyMissionWnd: function (index) {
        if (WindowManager.getInstance().findViewIndex(WndTypeDefine.WindowType.E_DT_NORMAL_DAILY_MISSION_WND) == -1) {
            WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_DAILY_MISSION_WND, function (wnd, name, type) {
                wnd.getComponent(type).setDefaultTab(index);
            });
        }
    },

    showActiveWnd: function () {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_ACTIVE_WND);
    },

    showEquipQualityUpWnd: function (beforeItemID, afterItemID, equipNamebefore, equipName, equipColorBefore, equipColor, callback) {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_EQUIP_QUALITY_UP_WND, function (wnd, name, type) {
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

    showNormalFreeGetWnd: function (errCode, completeCallback, shareCallback, purchaseCallback, closeCallback, isActive) {
        if (errCode == GameServerProto.PTERR_DIAMOND_LACK) {
            let curTime = GlobalVar.me().shareData.getFreeDiamondCount();
            let maxTime = GlobalVar.tblApi.getDataBySingleKey('TblParam', GameServerProto.PTPARAM_RCG_FREE_DIAMOND_COUNT_MAX).dValue;
            if (GlobalVar.getShareSwitch() && curTime < maxTime) {
                this.showNormalDiamondTreasureWnd();
                completeCallback && completeCallback();
                return;
            } else if (!GlobalVar.srcSwitch()) {
                this.showRechargeWnd();
                completeCallback && completeCallback();
                return;
            } else if (!isActive) {
                GlobalVar.comMsg.errorWarning(errCode);
            } else if (isActive) {
                GlobalVar.comMsg.errorWarning(GameServerProto.PTERR_RCG_FREE_DIAMOND_LACK);
            }
            completeCallback && completeCallback();
        } else if (errCode == GameServerProto.PTERR_GOLD_LACK) {
            if (GlobalVar.getShareSwitch()) {
                WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_FREE_GET_WND, function (wnd, name, type) {
                    wnd.getComponent(type).initFreeGetWnd(errCode, completeCallback, shareCallback, purchaseCallback, closeCallback, isActive);
                });
            } else {
                this.showRichTreasureWnd();
                completeCallback && completeCallback();
            }
        }

        // if (!GlobalVar.getShareSwitch()){
        //     if (errCode == GameServerProto.PTERR_GOLD_LACK){
        //         this.showRichTreasureWnd();
        //         completeCallback && completeCallback();
        //         return;
        //     }
        //     if (errCode == GameServerProto.PTERR_DIAMOND_LACK && !GlobalVar.srcSwitch()){
        //         this.showRechargeWnd();
        //         completeCallback && completeCallback();
        //         return;
        //     }
        // }

        // WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_FREE_GET_WND, function(wnd, name, type) {
        //     wnd.getComponent(type).initFreeGetWnd(errCode, completeCallback, shareCallback, purchaseCallback, closeCallback, isActive);
        // });
    },

    showNormalDiamondTreasureWnd: function () {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_DIAMOND_TREASURE_WND, function (wnd, name, type) {

        });
    },

    showRecommandWnd: function () {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_RECOMMAND_WND);
    },
    showShareDailyWnd: function (callback) {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_SHAREDIALY_WND, function () {
            callback && callback();
        });
    },
    showSuperRewardWnd: function () {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_SUPER_REWARD_WND);
    },
    showShareMemberTestPlayWnd: function (testPlayMemberID, callback, closeCallback) {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_SHARETESTPLAY_WND, function (wnd, name, type) {
            wnd.getComponent(type).setTestPlayMemberID(testPlayMemberID);
            wnd.getComponent(type).setCallback(callback, closeCallback);
        });
    },
    showShareTestPlayFinishWnd: function () {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_SHARETESTPLAYFINISH_WND);
    },

    showBuyPowerPointWnd: function () {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_BUY_POWER_POIN_WND);
    },
    showSignWnd: function () {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_SIGN_WND);
    },

    showCombatSuppressWnd: function (curCombat, needCombat, confirmCallback, cancelCallback) {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_COMBAT_SUPPRESS_WND, function (wnd, name, type) {
            wnd.getComponent(type).initParam(curCombat, needCombat, confirmCallback, cancelCallback);
        });
    },

    showAdExp: function () {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_AD_EXP_WND);
    },

    showAdTask: function () {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_AD_TASK_WND);
    },

    showArenaMainWnd: function () {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_ARENA_MAIN_WND);
    },
    showArenaReportWnd: function () {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_ARENA_REPORT_WND);
    },
    showArenaRankingWnd: function () {
        // WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_ARENA_RANKING_WND);
        WindowManager.getInstance().insertView(WndTypeDefine.WindowType.E_DT_NORMAL_ARENA_RANKING_WND, WndTypeDefine.WindowType.E_DT_NORMALROOT_WND, function (wnd, name, type) {
            // wnd.getComponent(type).setRankingType(TYPE_RANKING_ENDLESS);
        }, true, false);
    },
    showArenaStoreWnd: function () {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_ARENA_STORE_WND);
    },

    showArenaRewardWnd: function () {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_ARENA_REWARD_WND);
    },

    showArenaPlayTipWnd: function () {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_ARENA_PLAY_TIP_WND);
    },

    showArenaGetFreeTicketWnd: function () {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_ARENA_GET_FREE_TICKET_WND);
    },

    showFollowRewardWnd: function (data) {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_FOLLOW_REWARD_WND);
    },

    showMemberStoreWnd: function () {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_MEMBER_STORE_WND);
    },

    showNormalPieceWnd: function (item, mode) {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_PIECE_WND, function (wnd, name, type) {
            wnd.getComponent(type).initPanel(item, mode);
        });
    },

    showBoxRewardWnd: function (data) {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_BOX_REWARD_WND);
    },

    showNormalMixDriveTechWnd: function (data) {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_MIXDRIVE_TECH_WND);
    },

    showNormalMixDriveListWnd: function (data) {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_MIXDRIVE_LIST_WND, function (wnd, name, type) {
            wnd.getComponent(type).initView(data);
        });
    },

    showNormalMixLevelUpWnd: function (mixLevelData) {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_MIXLEVEL_UP_WND, function (wnd, name, type) {
            wnd.getComponent(type).initMixLevelUpWnd(mixLevelData);
        });
    },

    showInviteRewardWnd: function (callback) {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_INVITE_REWARD_WND, function () {
            callback && callback();
        });
    },

    showSpecialActiveWnd: function (amsType) {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_SPECIAL_ACTIVE_WND, function (wnd, name, type) {
            wnd.getComponent(type).setAcitveType(amsType);
        })
    },

    showTreasuryRankWnd: function () {
        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_TREASURY_RANK_WND);
    },
};