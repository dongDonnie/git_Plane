module.exports = {
    //demo events
    EVENT_DEMO_UPDATE: "event_demo_update",
    //超时
    EVENT_NETWORK_TIMEOUT: "event_network_timeout",
    //网络还活着
    EVENT_NETWORK_ALIVE: "event_network_alive",
    //网络出问题
    EVENT_NETWORK_DEAD: "event_network_dead",
    //login events
    EVENT_LOGIN_UPDATE: "event_login_update",
    //logout events
    EVENT_LOGOUT: "event_logout",
    //登录重试
    EVENT_RETRY_LOGIN: "event_retry_login",
    //EnterGame Notify
    EVENT_ENTERGAME_NTF: "event_entergame_ntf",
    //服务器时间更改
    EVENT_SVRTIME_CHANGE: "event_svrtime_change",
    //跨天触发
    EVENT_DAY_PASS: "event_day_pass",
    //金币发生变化
    EVENT_GOLD_NTF: "event_gold_ntf",
    //钻石发生变化
    EVENT_DIAMOND_NTF: "event_diamond_ntf",
    //按钮播放音效
    EVENT_BUTTON_SOUND_NTF: "event_button_sound_ntf",
    /////
    EVENT_NEED_CREATE_ROLE: "event_need_create_role",
    EVENT_NEED_RELOGIN: "event_need_relogin",
    EVENT_MAINTAIN: "event_maintain",
    EVENT_BAN_USER: "event_ban_user",
    EVENT_TOKEN_EXPIRED: "event_token_expired",
    EVENT_NOT_ALLOWED: "event_not_allowed",
    EVENT_WRONG_VERSION: "event_wrong_version",
    EVENT_SERVER_CROWD: "event_server_crowd",
    EVENT_TOKEN_USER: "event_token_user",
    EVENT_LOGIN_SUCCESS: "event_login_success",
    EVENT_RECV_FLUSH_DATA: "event_recv_flush_data",
    EVENT_ALL_DATA_READY: "event_all_data_ready",
    EVENT_ENTER_GAME: "event_enter_game",
    EVENT_RETURNTO_LOGINSCENE: "event_returnto_loginscene",

    EVENT_GET_DRAW_INFO: "event_get_draw_info",
    EVENT_GET_RICHTREASURE_RESULT: "event_get_richtreasure_result",
    EVENT_GET_TREASURE_MINING_RESULT: "event_get_treasure_mining_result",
    EVENT_GET_TREASURE_MINING_REWARD_RESULT: "event_get_trasure_mining_reward_result",
    EVENT_SET_MAIL_FLAG: "event_set_mail_falg",
    EVENT_REFRESH_MAIL_WND: "event_refresh_mail_wnd",
    EVENT_RECV_MAIL_REWARD: "event_recv_mail_reward",
    EVENT_SHOW_NOTICE_LIST: "event_show_notice_list",
    EVENT_GET_ENDLESS_DATA: "event_get_endless_bag_data",
    EVENT_SHOW_BLESS: "event_show_bless",
    EVENT_ENDLESS_START_BATTLE: "event_endless_start_battle",
    EVENT_ENDLESS_POWER_POINT_CHANGE_NTF: "event_endless_power_point_change_ntf",

    EVENT_SETSTATUS_COUNT: "event_setstatus_count",
    EVENT_SPCHANGE_NTF: "EVENT_SPCHANGE_NTF",
    EVENT_EXPCHANGE_NTF: "event_expchange_ntf",
    EVENT_COMBATPOINT_CHANGE_NTF: "event_combatpoint_change_ntf",
    EVENT_LEVELUP_NTF: "event_levelup_ntf",
    EVENT_BUY_SP_RESULT: "event_buysp_result",
    EVENT_CHAPTER_SELECT: "event_chapter_change",
    EVENT_RECIVE_DRAW_REWARD: "event_recive_draw_reward",
    EVENT_GET_RECHARGE_RESULT: "event_get_recharge_result",
    EVENT_GET_VIP_PACKAGEDATA: "event_get_vip_package_data",
    EVENT_GET_FULI_FEEDBACK_RESULT: "event_get_fuli_feedback_result",
    EVENT_GET_FULI_BUY_RESULT: "event_get_fuli_buy_result",
    EVENT_GET_FULI_SC_RESULT: "event_get_fuli_sc_result",
    EVENT_GET_SWEEP_RESULT: "event_get_sweep_result",
    EVENT_GET_BUY_COUNT_RESULT: "event_get_buy_result",
    EVENT_GET_CHAPTER_REWARD: "event_get_chapter_reward",
    EVENT_REGET_CHAPTER_DATA: "event_reget_chapter_data",
    EVENT_GETDAILY_DATA: "event_get_daily_data",
    EVENT_GETDAILY_REAWRD: "event_get_daily_reward",
    EVENT_GETDAILY_ACTIVE_REWARD: "event_get_daily_active_reward",
    EVENT_ITEM_USE_RESULT: "event_item_use_result",
    EVENT_NEWTASK_REWARD: "event_newtask_reward",
    EVENT_GETACTIVE_LIST: "event_getactive_list",
    EVENT_GETACTIVE_DATA: "event_getactive_data",
    EVENT_ACTIVE_FEN_RESULT: "event_active_fen_result",
    EVENT_ACTIVE_JOIN_RESULT: "event_active_join_result",
    EVENT_GET_RCGBAG_RESULT: "event_get_rcgbag_result",
    EVENT_GET_VOUCHER_RESULT: "event_get_voucher_result",
    EVENT_GET_RENAME_ACK: "event_get_rename_ack",
    EVENT_NEWTASK_NTF: "event_newtask_ntf",

    EVENT_LOGIN_DATA_NTF: "event_login_data_ntf",

    EVENT_STORE_DATA_NTF: "EVENT_STORE_DATA_NTF",
    EVENT_STORE_BUY_NTF: "EVENT_STORE_BUY_NTF",
    EVENT_STORE_REFRESH_NTF: "EVENT_STORE_REFRESH_NTF",
    EVENT_LIMIT_STORE_DATA_NTF: "EVENT_LIMIT_STORE_DATA_NTF",
    EVENT_LIMIT_STORE_BUY_NTF: "EVENT_LIMIT_STORE_BUY_NTF",

    EVENT_BAG_UNLOCK_NTF: "event_bag_unlock_ntf",
    EVENT_ITEM_SELL_NTF: "event_item_sell_ntf",
    EVENT_MEMBER_STANDINGBY_NTF: "event_member_standingby_ntf",
    EVENT_MEMBER_ACTIVE_NTF: "event_member_active_ntf",
    EVENT_MEMBER_STORE_RESULT: "event_member_store_result",

    EVENT_BAG_ADDITEM_NTF: "event_bag_additem_ntf",

    EVENT_GET_SIGN_DATA: 'event_get_sign_data',
    EVENT_GET_SIGN_RESULT: 'event_get_sign_result',
    EVENT_GET_SIGN_HEAP_RESULT: 'event_get_sign_heap_result',

    //更换挂载
    EVENT_GUAZAI_CHANGE_NTF: "EVENT_GUAZAI_CHANGE_NTF",
    EVENT_GUAZAI_LVUP_NTF: "EVENT_GUAZAI_LVUP_NTF",
    EVENT_GUAZAI_DIRTY_NTF: "EVENT_GUAZAI_DIRTY_NTF",
    EVENT_GUAZAI_QUALITY_UP: "event_guazai_quality_up",
    EVENT_GUAZAI_LEVEL_UP: "event_guazai_level_up",
    EVENT_GUAZAI_SMELTER_NTF: "event_guazai_smelter_ntf",
    EVENT_MEMBER_LEVELUP_NTF: "event_member_levelup_ntf",
    EVENT_MEMBER_QUALITYUP_NTF: "event_member_qualityup_ntf",
    EVENT_LEADEREQUIP_LEVELUP: "event_leader_equip_levelup",
    EVENT_LEADEREQUIP_QUALITYUP: "event_leader_equip_qualityup",

    EVENT_CAMP_REVIVE_ACK_RESULT: "event_camp_revive_ack_result",
    EVENT_CAMP_BEGIN_NTF: "event_camp_begin_ntf",
    EVENT_CAMP_RESULT_NTF: "event_camp_result_ntf",
    EVENT_CAMP_DRAWREWARD_NTF: "event_camp_drawreward_ntf",
    EVENT_CAMP_FREEDRAW_NTF: "event_camp_freedraw_ntf",
    EVENT_ENDLESS_RESULT_NTF: "event_endless_result_ntf",
    EVENT_ENDLESS_QH_UP_NTF: "event_endless_qh_up_ntf",
    EVENT_ENDLESS_RANK_UP_NTF: "event_endless_rank_up_ntf",
    EVENT_ENDLESS_USESTATUS_NTF: "event_endlsee_usestatus_ntf",
    EVENT_ENDLESS_GET_BUY_POWERPOINT_DATA: "event_endless_get_buy_powerpoint_data",
    EVENT_GET_ASSIST_SHARE_SUCCESS: "event_get_assist_success",

    EVENT_GUAZAI_REBIRTH_ACK: "EVENT_GUAZAI_REBIRTH_ACK",

    //redPoint
    EVENT_ACTIVE_FLAG_CHANGE: "event_active_flag_change",
    EVENT_ACTIVE_ACT_FLAG_CHANGE: "event_active_act_flag_change",
    EVENT_DAILY_FLAG_CHANGE: "event_daily_flag_change",
    EVENT_STORE_NORMAL_FLAG_CHANGE: "event_store_normal_flag_change",
    EVENT_GUAZAI_FLAG_CHANGE: "event_guazai_flag_change",
    EVENT_EQUIPT_FLAG_CHANGE: "event_equipt_flag_change",
    EVENT_MEMBER_FLAG_CHANGE: "event_member_flag_change",
    EVENT_FULICZ_FLAG_CHANGE: "event_fulicz_flag_change",
    EVENT_THEBAG_FLAG_CHANGE: "event_thebag_flag_change",
    EVENT_CAMP_FLAG_CHANGE: 'event_camp_flag_change',
    EVENT_VIP_REWARD_FLAG_CHANGE: 'event_vip_reward_flag_change',
    EVENT_FREE_DIAMOND_FLAG_CHANGE: 'event_free_diamond_flag_change',
    EVENT_LIMIT_STORE_FLAG_CHANGE: 'event_limit_store_flag_change',
    EVENT_SIGN_FLAG_CHANGE: 'event_sign_flag_change',

    //share
    EVENT_GET_FREE_GOLD: "event_get_free_gold",
    EVENT_GET_FREE_DIAMOND: "event_get_free_diamond",
    EVENT_GET_RECOMMAND_DATA: "event_get_recommand_data",
    EVENT_GET_MEMBERTESTPLAY_DATA: "event_get_member_test_play_data",
    EVENT_GET_SHARE_DAILY_DATA: "event_get_share_daily_data",
    EVENT_ENDLESS_GET_CHARGE_DATA: "event_endless_get_charge_data",
    EVENT_GET_SUPER_REWARD_DATA: "event_get_super_reward_data",
    EVENT_TREASURE_REDUCE_TIME_RESULT: "event_treasure_reduce_time_result",

    //ad
    EVENT_REFRESH_AD_EXP_DATA: "event_refresh_ad_exp_data",
    EVENT_REFRESH_AD_SP_DATA: "event_refresh_ad_sp_data",
    EVENT_REFRESH_AD_TASK_DATA: "event_refresh_ad_task_data",

    //gm
    EVENT_GM_SWITCH_CHANGE: "event_gm_switch_change",

    // superInduce
    EVENT_SUPER_INDUCE_GET: "event_super_induce_get",


    // arena火力对决
    EVENT_GET_ARENA_OPEN_DATA: "event_get_arena_open_data",
    EVENT_GET_ARENA_REPORT_DATA: "event_get_arena_report_data",
    EVENT_GET_ARENA_RANK_TIP_LIST_DATA: "event_get_arena_rank_tip_list_data",
    EVENT_GET_ARENA_LIKE_DATA: "event_get_arena_like_data",
    EVENT_GET_ARENA_CHALLENGE_DATA: "event_get_arena_challenge_data",
    EVENT_GET_ARENA_CHALLENGE_COUNT_BUY_DATA: "event_get_arena_challenge_count_buy_data",
    EVENT_GET_ARENA_POINT_CHANGE_DATA: "event_get_arena_point_change_data",
    EVENT_GET_ARENA_DAY_REWARD_DATA: "event_get_arena_day_reward_data",
    EVENT_GET_ARENA_SAODANG_DATA: "event_get_arena_saodang_data",
    EVENT_GET_ARENA_CHALLENGE_COUNT_FREE_GET_DATA: "event_get_arena_challenge_count_free_get_data",
    EVENT_GET_ARENA_STORE_DATA: "event_get_arena_store_data",
    EVENT_GET_RANK_STORE_DATA: "event_get_rank_store_data",
};