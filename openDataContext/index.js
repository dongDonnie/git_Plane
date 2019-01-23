let MSG = require('./messageId');
let pageItemNum = 6;
let curPage = 0;
let dataName = 0;
let rowSpace = 120;
let startHieght = 20;
let myOpenID = "";
let beyoundFriendScoreGap = 2000;
let isGetData = false;
let friendsDataList = new Array();
let beyoundStartRank = -1;
let alreadDraw = false;


wx.onMessage(data => {
    // console.log("on message:", data);
    switch (data.id) {
        case MSG.ON_MSG_SET_PAGE_COUNT:
            pageItemNum = data.count;
            curPage = data.pageIndex;
            break;
        case MSG.ON_MSG_GET_FRIEND_RANK_OPEN:
            if (!isGetData) {
                queryFriendsData(() => {
                    drawFriendsPage(curPage);
                    isGetData = true;
                });
                console.log("拉取新的排行榜数据")
            } else {
                drawFriendsPage(curPage);
            }
            break;
        case MSG.ON_MSG_GET_FRIEND_RANK_NEXT:
            drawFriendsPage(curPage + 1);
            break;
        case MSG.ON_MSG_GET_FRIEND_RANK_BEFORE:
            drawFriendsPage(curPage - 1);
            break;
        case MSG.ON_MSG_DRAW_FRIEND_AVATAR_BY_SCORE:
            beyoundFriendScoreGap = beyoundFriendScoreGap;
            if (!isGetData) {
                queryFriendsData(() => {
                    isGetData = true;
                    if (data.isFirst){
                        beyoundStartRank = friendsDataList.length-1;
                    }
                    drawFriendAvatar(data.myScore);
                });
            }else{
                if (data.isFirst){
                    beyoundStartRank = friendsDataList.length-1;
                }
                drawFriendAvatar(data.myScore);
            }
            break;
        case MSG.ON_MSG_SET_MY_OPENID:
            myOpenID = data.openID;
            console.log("myOpenID:", myOpenID);
            break;
        case MSG.ON_MSG_DEFAULT_BEYOUND_SETTING:
            beyoundStartRank = friendsDataList.length-1;
            break;
        case MSG.ON_MSG_RESET_RANK_GET_DATA:
            isGetData = false;
            break;
        default:
            break;
    }
});

function getAvatar(avatarUrl) {
    // return avatarUrl.substring(0, avatarUrl.length - 1) + '64';
    if (avatarUrl == ""){
        avatarUrl = 'src/myOpenDataContext/image/head_img.png'
    }
    return avatarUrl;
};

function queryFriendsData(callback) {
    getFriendsGameData(data => {
        console.log('friends game data:', data);
        friendsDataList = getRankList(data);
        console.log('friendsDataList game data:', friendsDataList);
        if (callback && typeof callback == 'function') {
            callback();
        }
    });
};

// 获取好友用户数据
function getFriendsGameData(callback) {
    let _keyList = ['score'];
    wx.getFriendCloudStorage({
        keyList: _keyList,
        success: res => {
            // console.log('get friend data success:', res);
            if (callback && typeof callback == 'function') {
                callback(res.data);
            }
        },
        fail: res => {
            // console.log('get friend data fail:', res);
        }
    });
};

function drawFriendsPage(pageIndex) {
    let _pageNum = pageItemNum;

    let pageNum = Math.ceil(friendsDataList.length / _pageNum);
    console.log("friendsDataList", friendsDataList);
    console.log("_pageNum:", _pageNum, "pageNum:", pageNum, "pageIndex:", pageIndex);
    if (pageIndex <= pageNum - 1 && pageIndex >= 0) {
        let sharedCanvas = wx.getSharedCanvas();
        // console.log("sharedCanvas width and height", sharedCanvas.width, sharedCanvas.height);
        let context = sharedCanvas.getContext('2d');

        context.clearRect(0, 0, sharedCanvas.width, sharedCanvas.height);
        // context.fillStyle = '#0000';
        // context.fillRect(0, 0, sharedCanvas.width, sharedCanvas.height);


        let firstIndex = pageIndex * _pageNum;
        for (let i = firstIndex; i < firstIndex + _pageNum && i < friendsDataList.length; i++) {
            let friendsData = friendsDataList[i];
            drawRankItem(friendsData, i + 1, i - firstIndex);
        }

        drawMyRankItem();

        curPage = pageIndex;
    } else {
        console.warn('no page');
    }
};

function drawMyRankItem() {

    let myRank = 0;
    for (let i = 0; i < friendsDataList.length; i++) {
        if (friendsDataList[i].openid == myOpenID) {
            myRank = i + 1;
        }
    }
    if (myRank == 0) {
        return;
    }

    let sharedCanvas = wx.getSharedCanvas();
    let context = sharedCanvas.getContext('2d');
    let name = friendsDataList[myRank - 1].nickname;
    let avatarUrl = friendsDataList[myRank - 1].avatarUrl;
    let score = friendsDataList[myRank - 1].score;
    let myrankHeight = sharedCanvas.height - 325;
    // myrankHeight = 500;
    console.log("myrankHeight:", myrankHeight);
    // 画背景
    // context.drawImage(bg, 25, 4 + myrankHeight + startHieght, bg.width, bg.height);
    // console.log(sharedCanvas);
    // context.drawImage(bg, 25, 4 + myrankHeight + startHieght, sharedCanvas.width, bg.height);


    // 画排行  全部在背景加载完毕后再添加
    if (myRank >= 1 && myRank <= 3) {
        let img = wx.createImage();
        img.src = 'src/myOpenDataContext/image/rank_frame_' + myRank + '.png';
        img.onload = function () {
            context.drawImage(img, 42, 24 + myrankHeight + startHieght, img.width, img.height);
        }
    }
    else {
        context.fillStyle = '#fff';
        context.textAlign = 'right';
        context.font = '30px sans-serif';
        context.fillText(myRank, 110, 62 + myrankHeight + startHieght);
    }

    // 显示玩家微信头像url
    let avatar64 = getAvatar(avatarUrl);
    if (!!avatar64) {
        let icon = wx.createImage();
        icon.src = avatar64;
        icon.onload = function () {
            context.drawImage(icon, 125, 20 + myrankHeight + startHieght, 70, 70);
        }
    } else {
        let icon = wx.createImage();
        icon.src = 'src/myOpenDataContext/image/head_img.png';
        icon.onload = function () {
            context.drawImage(icon, 125, 20 + myrankHeight + startHieght, 70, 70);
        }
    }

    context.fillStyle = "#4fbbff"
    context.font = '24px sans-serif';
    context.textAlign = 'left';
    context.fillText(name, 200, 62 + myrankHeight + startHieght);

    context.fillStyle = '#FFA847';
    context.font = '26px sans-serif';
    context.textAlign = 'left';
    context.fillText("得分", 400, 61 + myrankHeight + startHieght);
    // 画分数
    context.fillStyle = '#FDF5AD';
    context.font = '24px sans-serif';
    context.textAlign = 'left';
    score = parseInt(score);
    if (score > 999999) {
        score = Math.floor(score / 10000);
        score += "万";
    }
    context.fillText(score, 460, 61 + myrankHeight + startHieght);


};

function drawRankItem(data, rank, index) {
    // console.log("current draw user data:", data);
    let sharedCanvas = wx.getSharedCanvas();
    let context = sharedCanvas.getContext('2d');
    let name = data.nickname;
    let avatarUrl = data.avatarUrl;
    let score = data.score;

    context.fillStyle = '#fff';
    context.textAlign = 'start';
    context.font = '30px sans-serif';


    // 画背景
    let bg = wx.createImage();
    bg.src = 'src/myOpenDataContext/image/ranking_bg.png';
    bg.onload = function () {
        context.drawImage(bg, 25, 4 + rowSpace * index + startHieght, bg.width, bg.height);
        // console.log(sharedCanvas);
        // context.drawImage(bg, 25, 4 + rowSpace * index + startHieght, sharedCanvas.width, bg.height);


        // 画排行  全部在背景加载完毕后再添加
        if (rank >= 1 && rank <= 3) {
            let img = wx.createImage();
            img.src = 'src/myOpenDataContext/image/rank_frame_' + rank + '.png';
            img.onload = function () {
                context.drawImage(img, 42, 24 + rowSpace * index + startHieght, img.width, img.height);
            }
        }
        else {
            context.fillStyle = '#fff';
            context.textAlign = 'start';
            context.font = '30px sans-serif';
            context.fillText(rank, 60, 62 + rowSpace * index + startHieght);
        }

        // 显示玩家微信头像url
        let avatar64 = getAvatar(avatarUrl);
        if (!!avatar64) {
            let icon = wx.createImage();
            icon.src = avatar64;
            icon.onload = function () {
                context.drawImage(icon, 125, 20 + rowSpace * index + startHieght, 70, 70);
            }
        } else {
            let icon = wx.createImage();
            icon.src = 'src/myOpenDataContext/image/head_img.png';
            icon.onload = function () {
                context.drawImage(icon, 125, 20 + rowSpace * index + startHieght, 70, 70);
            }
        }

        context.fillStyle = "#4fbbff"
        context.font = '24px sans-serif';
        context.fillText(name, 200, 62 + rowSpace * index + startHieght);

        context.fillStyle = '#FFA847';
        context.font = '26px sans-serif';
        context.textAlign = 'left';
        context.fillText("得分", 400, 61 + rowSpace * index + startHieght);
        // 画分数
        context.fillStyle = '#FDF5AD';
        context.font = '24px sans-serif';
        context.textAlign = 'left';
        context.fillText(score, 460, 61 + rowSpace * index + startHieght);

    }
};

function getRankList(rawData) {
    let result = new Array();
    for (let i = 0; i < rawData.length; i++) {
        let data = rawData[i];
        let userData = {
            nickname: '',
            avatarUrl: '',
            score: null,
            openid: '',
        };
        userData.nickname = data.nickname;
        userData.avatarUrl = data.avatarUrl;
        userData.openid = data.openid;
        // let timestamp = null;

        data.KVDataList.forEach(KVData => {
            // if (KVData.key == 'timestamp') {
            //     timestamp = KVData.value;
            // }
            // console.log("KVData", KVData)
            if (KVData.key == 'score') {
                let data = JSON.parse(KVData.value);
                if (data.wxgame && data.wxgame.score) {
                    userData.score = parseInt(data.wxgame.score);
                }
            }
        });

        if (!userData.score) continue;


        // 判断时间戳
        // console.log('get time stamp:', timestamp);
        // if (!timestamp) continue;
        // console.log('is week time:', isWeekTime(timestamp));
        // if (!isWeekTime(timestamp)) continue;

        // 放入有序数组
        if (result.length == 0) {
            result.push(userData);
            continue;
        }

        let index = -1;
        for (let j = 0; j < result.length; j++) {
            if (userData.score > result[j].score) {
                index = j;
                break;
            }
        }
        if (index == -1) {
            index = result.length;
        }
        result.splice(index, 0, userData);
    }

    return result;
};

function drawFriendAvatar(score) {
    let sharedCanvas = wx.getSharedCanvas();
    let context = sharedCanvas.getContext('2d');
    if (score < 0) {
        console.log("score error:", score);
        return;
    }

    let friendData = friendsDataList[beyoundStartRank]
    if (!friendData){
        console.log("friendData error, beyoundStartRank:", beyoundStartRank);
        context.fillStyle = 'rgba(255, 255, 255, 0)';
        context.fillRect(0, 0, 120, 160);
        context.clearRect(0, 0, sharedCanvas.width, sharedCanvas.height);
        return;
    }

    // console.log("scoreGap:", beyoundFriendScoreGap, "  next data: ", friendData);
    let isBeyound = false;
    let drawBeyound = false;
    if (score < friendData.score){
        // if ((score + beyoundFriendScoreGap >= friendData.score) && !alreadDraw){
        // if (!alreadDraw){
            // 即將超越
            // console.log("即將超越");
            alreadDraw = true;
            drawBeyound = true;
        // }
    }else {
        // 已超越
        // console.log("已超越");
        isBeyound = true;
        beyoundStartRank -= 1;
        alreadDraw = false;
        drawBeyound = true;
        drawFriendAvatar(score);
        return;
    }

    // context.fillStyle = '#fff';
    // context.fillStyle = 'rgba(255, 255, 255, 0)';
    context.textAlign = 'start';
    if (drawBeyound){
    // if (true){
        context.fillStyle = 'rgba(255, 255, 255, 0)';
        context.fillRect(0, 0, 120, 160);
        context.clearRect(0, 0, sharedCanvas.width, sharedCanvas.height);
        console.log("绘制的好友数据：", friendData);
        let bg = wx.createImage();
        bg.src = 'src/myOpenDataContext/image/battle_friend_bg.png';
        bg.onload = function () {
            // console.log("背景OK");
            context.drawImage(bg, 0, 0, bg.width, bg.height);
    
            let avatar = wx.createImage();
            avatar.src = getAvatar(friendData.avatarUrl);;
            // console.log("avatarUrl:", friendData.avatarUrl);
            avatar.onload = function () {
                // console.log("头像OK");
                context.drawImage(avatar, 25, 9, 86, 86);
    
                let typeSprite = wx.createImage();
                if (isBeyound){
                    typeSprite.src = 'src/myOpenDataContext/image/battle_friend_byond_alread.png';
                }else{
                    typeSprite.src = 'src/myOpenDataContext/image/battle_friend_byond.png';
                }
    
                typeSprite.onload = function () {
                    // console.log("超越类型OK");
                    context.drawImage(typeSprite, 18, 80, typeSprite.width, typeSprite.height);
                }
            }
        }
        let scoreBg = wx.createImage();
        scoreBg.src = 'src/myOpenDataContext/image/battle_friend_score_bg.png';
        scoreBg.onload = function () {
            context.drawImage(scoreBg, 0, 100, 120, 40);

            // 画分数
            context.fillStyle = '#C6E3FC';
            context.font = '20px sans-serif';
            context.textAlign = 'left';
            context.fillText("分数", 4, 125);

            context.fillStyle = '#FFFFFF';
            context.font = '18px sans-serif';
            context.textAlign = 'right';
            let friendScore = friendData.score;
            if (parseInt(friendScore) > 99999){
                friendScore = parseInt(friendScore/10000) + "万";
            }
            context.fillText(friendScore, 115, 125);
        }
    }
};