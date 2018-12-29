
// "myOpenDataContext": "src/myOpenDataContext"
let MSG = require('./messageId');
const pageItemNum = 5;
const pageItemNun2 = 3;
let curPage = 0;
let dataName = 0;
let friendsDataList = new Array();
let friendsDataList2 = new Array();

wx.onMessage(data => {
    console.log('on message:', data);
    if (data.id == 1) {
        queryFriendsData(() => {
            curPage = 0;
            drawFriendsPage(curPage);
        });
    } else if (data.id == 20) {
        queryGroupData(data.shareTicket, () => {
            curPage = 0;
            drawFriendsPage(curPage);
        });
    } else if (data.id == 2 || data.id == 21) {
        drawFriendsPage(curPage + 1);
    } else if (data.id == 3 || data.id == 22) {
        drawFriendsPage(curPage - 1);
    } else if (data.id == 4 || data.id == 23) {
        console.log('friend rank closed');
        curPage = 0;
        friendsDataList = [];
    } else if (data.id == 5) {
        console.log('post friend info');
    } else if (data.id == 30) {
        console.log('get next friend info');
        queryFriendsData(() => {
            getAbjacentPeople(data.openid, 1);
        });
    } else if (data.id == 31) {
        console.log('get abjacent to the people info');
        queryFriendsData(() => {
            getAbjacentPeople(data.openid, 3);
        });
    } else if (data.id == MSG.MessageID.ON_MSG_GET_DOUBLE_FRIEND_RANK_OPEN) {
        dataName = data.dataName;
        queryFriendsData2(() => {
            curPage = 0;
            drawFriendsPage(curPage, 1);
        });
    } else if (data.id == MSG.MessageID.ON_MSG_GET_DOUBLE_GROUP_RANK_OPEN) {
        dataName = data.dataName;
        console.log(data);
        queryGroupData2(data.shareTicket, () => {
            curPage = 0;
            drawFriendsPage(curPage, 1);
        });
    } else if (data.id == MSG.MessageID.ON_MSG_GET_DOUBLE_FRIEND_RANK_NEXT || data.id == MSG.MessageID.ON_MSG_GET_DOUBLE_GROUP_RANK_NEXT) {
        drawFriendsPage(curPage + 1, 1);
    } else if (data.id == MSG.MessageID.ON_MSG_GET_DOUBLE_FRIEND_RANK_BEFORE || data.id == MSG.MessageID.ON_MSG_GET_DOUBLE_GROUP_RANK_BEFORE) {
        drawFriendsPage(curPage - 1, 1);
    } else if (data.id == MSG.MessageID.ON_MSG_GET_DOUBLE_FRIEND_RANK_CLOSE || data.id == MSG.MessageID.ON_MSG_GET_DOUBLE_GROUP_RANK_CLOSE) {
        curPage = 0;
        friendsDataList = [];
        friendsDataList2 = [];
    }
});

// function randomNum (min, max) {
//     var range = max - min;
//     var rand = Math.random();
//     var num = min + Math.round(rand * range);
//     return num;
// };

function getAbjacentPeople(openid, index) {
    let list = [];
    let _index = 0;
    if (index > 1) {
        _index = Math.floor((index - 1) / 2);
    }
    for (let i = 0; i < friendsDataList.length; i++) {
        if (friendsDataList[i].openid == openid) {
            if (index === 1) {
                if (i - 1 >= 0) {
                    list.push(friendsDataList[i - 1]);
                } else {
                    list.push(friendsDataList[i]);
                }
            } else {
                let z = i - _index;
                if (z < 0) {
                    z = 0;
                }
                for (let j = z; j <= i + _index; j++) {
                    if (friendsDataList[j]) {
                        list.push(friendsDataList[j]);
                    } else {
                        break;
                    }
                }
            }
            break;
        }
    }
    console.log("getAbjacentPeople", list);
    drawAbjacentPeople(list);
};

function drawAbjacentPeople(list) {
    let sharedCanvas = wx.getSharedCanvas();
    let context = sharedCanvas.getContext('2d');
    console.log("wryyyyyyyyyy",context);
    // context.fillStyle = 'white';
    context.fillRect(0, 0, 600, 600);
    let offset = 0;
    let width = 200;
    for (let i = 0; i < list.length; i++) {
        drawNextPeople(context, list[i], width, i);
        // drawNextPeople(context, list[i], width,i+1);
        // drawNextPeople(context, list[i], width,i+2);
    }
};

function drawNextPeople(context, peopleInfo, width, index) {

    console.log(peopleInfo)
    context.fillStyle = '#333333';
    context.textAlign = 'start';
    context.font = '30px sans-serif';
    // 显示玩家微信头像url
    let avatar64 = getAvatar(peopleInfo.avatarUrl);
    if (!!avatar64) {
        let icon = wx.createImage();
        icon.src = avatar64;
        icon.onload = function () {
            context.drawImage(icon, index * width + 50, 100, 100, 200);
        }
    }
    context.font = '28px sans-serif';
    context.textAlign = 'center';
    context.fillText(peopleInfo.nickname, index * width + width / 2, 400);

    // // 遮挡名字过长部分
    // context.fillStyle = 'white';
    // context.fillRect(index * width, 400, width, width*2);
    // 画分数
    context.fillStyle = '#F44A6C';
    context.font = '50px sans-serif';
    context.textAlign = 'center';
    context.fillText(peopleInfo.score + index, index * width + width / 2, 500);

};
function queryFriendsData(callback) {
    getFriendsGameData(data => {
        console.log('friends game data:', data);
        friendsDataList = getRankList(data);
        if (callback && typeof callback == 'function') {
            callback();
        }
    });
};

function queryGroupData(shareTicket, callback) {
    getGroupGameData(shareTicket, data => {
        console.log('group game data:', data);
        friendsDataList = getRankList(data);
        if (callback && typeof callback == 'function') {
            callback();
        }
    });
};
function queryFriendsData2(callback) {
    getFriendsGameData(data => {
        console.log('friends game data:', data);
        friendsDataList = getRankList(data);
        friendsDataList2 = getRankList(data, 1);
        if (callback && typeof callback == 'function') {
            callback();
        }
    }, 1);
};

function queryGroupData2(shareTicket, callback) {
    getGroupGameData(shareTicket, data => {
        console.log('group game data:', data);
        friendsDataList = getRankList(data);
        friendsDataList2 = getRankList(data, 1);
        if (callback && typeof callback == 'function') {
            callback();
        }
    }, 1);
};


function drawFriendsPage(pageIndex, isDouble = 0) {
    console.log('rank list: ', friendsDataList, friendsDataList2);
    console.log('page index: ', pageIndex);
    let _pageNum = pageItemNum;
    if (isDouble) {
        _pageNum = pageItemNun2;
    }
    let pageNum = Math.ceil(friendsDataList.length / _pageNum);
    if (pageIndex <= pageNum - 1 && pageIndex >= 0) {
        let sharedCanvas = wx.getSharedCanvas();
        let context = sharedCanvas.getContext('2d');
        console.log("wryyyyyyyyyy",context);
        if (isDouble) {
            // context.canvas.width = 1100;
            // context.canvas.height = 700;
            // context.fillStyle = 'white';
            context.fillRect(0, 0, 1100, 700);
        } else {
            // context.canvas.width = 620;
            // context.canvas.height = 650;
            // context.fillStyle = 'white';
            context.fillRect(0, 0, 640, 960);
        }

        // ctx.clearRect(0, 0, sharedCanvas.width, sharedCanvas.height);

        let firstIndex = pageIndex * _pageNum;
        for (let i = firstIndex; i < firstIndex + _pageNum && i < friendsDataList.length; i++) {

            if (isDouble) {
                let friendsData = friendsDataList[i];
                drawRankItem2(context, friendsData, i + 1, i - firstIndex);
                friendsData = friendsDataList2[i];
                if (friendsData) {
                    drawRankItem2(context, friendsData, i + 1, i - firstIndex, 1);
                }
            } else {
                let friendsData = friendsDataList[i];
                drawRankItem(context, friendsData, i + 1, i - firstIndex);
            }
        }

        curPage = pageIndex;
    } else {
        console.warn('no page');
    }
};

function getRankList(rawData, isDouble = 0) {
    let result = new Array();
    for (let i = 0; i < rawData.length; i++) {
        let data = rawData[i];
        let userData = {
            nickname: '',
            avatarUrl: '',
            score: null,
            openid: '',
            isVip: false
        };
        if (isDouble) {
            userData[dataName] = 0;
        }

        userData.nickname = data.nickname;
        userData.avatarUrl = data.avatarUrl;
        userData.openid = data.openid;
        // let timestamp = null;

        data.KVDataList.forEach(KVData => {
            // if (KVData.key == 'timestamp') {
            //     timestamp = KVData.value;
            // }
            if (KVData.key == 'score') {
                userData.score = parseInt(KVData.value);
            }
            if (KVData.key == 'isVip') {
                userData.isVip = parseInt(KVData.value);
                // console.log('>>> userdata is vip:', userData.isVip, typeof userData.isVip);
            }
            if (isDouble) {
                if (KVData.key == dataName) {
                    userData[dataName] = parseInt(KVData.value);
                    // console.log('>>> userdata is vip:', userData.isVip, typeof userData.isVip);
                }
            }
        });

        if (!userData.score) continue;
        if (isDouble) {
            if (!userData[dataName]) continue;
        }


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
            if (isDouble) {
                if (userData[dataName] > result[j][dataName]) {
                    index = j;
                    break;
                }
            } else {
                if (userData.score > result[j].score) {
                    index = j;
                    break;
                }
            }

        }
        if (index == -1) {
            index = result.length;
        }
        result.splice(index, 0, userData);
    }

    return result;
};

function drawRankItem(ctx, data, rank, index, isDouble = 0) {
    let name = data.nickname;
    let avatarUrl = data.avatarUrl;
    let score = data.score;
    let isVip = data.isVip;

    ctx.fillStyle = '#333333';
    ctx.textAlign = 'start';
    ctx.font = '30px sans-serif';

    let num = 0;
    // 画排行
    ctx.fillText(rank, 30 + num, 75 + 104 * index);

    if (rank >= 1 && rank <= 3) {
        let img = wx.createImage();
        img.src = 'src/myOpenDataContext/image/avatar_frame_' + rank + '.png';
        img.onload = function () {
            // console.log('img be loaded:', img);42 54
            ctx.drawImage(img, 84 + num, 12 + 104 * index, img.width, img.height);
        }
    }

    // 显示玩家微信头像url
    let avatar64 = getAvatar(avatarUrl);
    if (!!avatar64) {
        let icon = wx.createImage();
        icon.src = avatar64;
        icon.onload = function () {
            ctx.drawImage(icon, 85 + num, 30 + 104 * index, 64, 64);
        }
    }

    if (isVip) {
        ctx.fillStyle = 'red';
    }
    ctx.font = '28px sans-serif';
    ctx.fillText(name, 170 + num, 75 + 104 * index);

    // 遮挡名字过长部分
    // ctx.fillStyle = 'white';
    ctx.fillRect(370 + num, 30 + 104 * index, 250, 64);
    // ctx.clearRect(450, 30 + 104 * index, 250, 64);

    // 画vip标志
    if (isVip) {
        let vipIcon = wx.createImage();
        vipIcon.src = 'src/myOpenDataContext/image/vip.png';
        vipIcon.onload = function () {
            ctx.drawImage(vipIcon, 378 + num, 35 + 104 * index, vipIcon.width, vipIcon.height);
        }
    }

    // 画分数
    ctx.fillStyle = '#F44A6C';
    ctx.font = '34px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(score, 570 + num, 75 + 104 * index);

    // 画下划线
    ctx.strokeStyle = "#EBEBEB";
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (rank > 3) {
        ctx.moveTo(70 + num, 115 + 104 * index);
        ctx.lineTo(600 + num, 115 + 104 * index);
    } else {
        ctx.moveTo(70 + num, 110 + 104 * index);
        ctx.lineTo(600 + num, 110 + 104 * index);
    }
    ctx.stroke();
};

function drawRankItem2(ctx, data, rank, index, isDouble = 0) {
    let name = data.nickname;
    let avatarUrl = data.avatarUrl;
    let score = 0;
    if (isDouble) {
        score = data[dataName];
    } else {
        score = data.score;
    }
    let isVip = data.isVip;

    ctx.fillStyle = '#333333';
    ctx.textAlign = 'start';
    ctx.font = '30px sans-serif';

    let num = 0;
    if (isDouble) {
        num += 550
    }
    // 画排行
    ctx.fillText(rank, 15 + num, 75 + 104 * index);

    if (rank >= 1 && rank <= 3) {
        let img = wx.createImage();
        img.src = 'src/myOpenDataContext/image/avatar_frame_' + rank + '.png';
        img.onload = function () {
            // console.log('img be loaded:', img);42 54
            ctx.drawImage(img, 60 + num, 12 + 104 * index, img.width, img.height);
        }
    }

    // 显示玩家微信头像url
    let avatar64 = getAvatar(avatarUrl);
    if (!!avatar64) {
        let icon = wx.createImage();
        icon.src = avatar64;
        icon.onload = function () {
            ctx.drawImage(icon, 60 + num, 30 + 104 * index, 64, 64);
        }
    }

    if (isVip) {
        ctx.fillStyle = 'red';
    }
    ctx.font = '24rpx sans-serif';
    ctx.fillText(name, 150 + num, 75 + 104 * index);

    // 遮挡名字过长部分
    // ctx.fillStyle = 'white';
    ctx.fillRect(420 + num, 30 + 104 * index, 250, 64);
    // ctx.clearRect(450, 30 + 104 * index, 250, 64);

    // 画vip标志
    if (isVip) {
        let vipIcon = wx.createImage();
        vipIcon.src = 'src/myOpenDataContext/image/vip.png';
        vipIcon.onload = function () {
            ctx.drawImage(vipIcon, 200 + num, 35 + 104 * index, vipIcon.width, vipIcon.height);
        }
    }

    // 画分数
    ctx.fillStyle = '#F44A6C';
    ctx.font = '34px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(score, 480 + num, 75 + 104 * index);

    // 画下划线
    ctx.strokeStyle = "#EBEBEB";
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (rank > 3) {
        ctx.moveTo(120 + num, 115 + 104 * index);
        ctx.lineTo(450 + num, 115 + 104 * index);
    } else {
        ctx.moveTo(120 + num, 110 + 104 * index);
        ctx.lineTo(450 + num, 110 + 104 * index);
    }
    ctx.stroke();
};
// 获取好友用户数据
function getFriendsGameData(callback, isDouble = 0) {
    let _keyList = ['score', 'timestamp', 'isVip'];
    if (isDouble) {
        _keyList.push(dataName);
    }
    wx.getFriendCloudStorage({
        keyList: _keyList,
        success: res => {
            console.log('get friend data success:', res);
            if (callback && typeof callback == 'function') {
                callback(res.data);
            }
        },
        fail: res => {
            console.log('get friend data fail:', res);
        }
    });
};


// 获取群好友用户数据
function getGroupGameData(_shareTicket, callback, isDouble = 0) {
    let _keyList = ['score', 'timestamp', 'isVip'];
    if (isDouble) {
        _keyList.push(dataName);
    }
    wx.getGroupCloudStorage({
        shareTicket: _shareTicket,
        keyList: _keyList,
        success: res => {
            console.log('get group data success:', res);
            if (callback && typeof callback == 'function') {
                callback(res.data);
            }
        },
        fail: res => {
            console.log('get group data fail:', res);
        }
    });
};

// utils
// function checkTimestamp (timestamp) {
//     let dateTime = new Date();
//     dateTime.setTime(timestamp);
//     let weekDay = dateTime.getDay();
//     let day = dateTime.getDate();
// };

function getAvatar(avatarUrl) {
    // return avatarUrl.substring(0, avatarUrl.length - 1) + '64';
    return avatarUrl;
};

function isWeekTime(_time) {
    _time = _time || 0;
    var now = getTimestamp();
    var weekTime = now - (now - 316800) % 604800;
    var _weekTime = _time - (_time - 316800) % 604800;
    if (_time && _weekTime === weekTime) {
        return true;
    }
    return false;
};

function getTimestamp() {
    var d = new Date();
    d.setDate(d.getDate());
    var timestamp = Date.parse(d);
    var now = timestamp / 1000;
    return now;
};