
let MessageID = {
        ON_MSG_SET_PAGE_COUNT : 0,   //设置一页显示多少行数据
        ON_MSG_GET_FRIEND_RANK_OPEN : 1, // 微信 好友排行
        ON_MSG_GET_FRIEND_RANK_NEXT : 2, // 下一页
        ON_MSG_GET_FRIEND_RANK_BEFORE : 3, // 上一页
        ON_MSG_DRAW_FRIEND_AVATAR_BY_SCORE: 4, // 根据分数，绘制分数接近的下一个好友头像
        ON_MSG_SET_MY_OPENID: 5, //传递自己的openid 
        ON_MSG_DEFAULT_BEYOUND_SETTING: 6, // 设置超越为初始设置
        ON_MSG_RESET_RANK_GET_DATA: 7,

}
module.exports = MessageID;