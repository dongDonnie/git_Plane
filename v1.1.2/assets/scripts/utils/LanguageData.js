module.exports = {

    t: function (str) {
        let index = str.lastIndexOf('.');
        let key = str.substring(0, index);
        let value = str.substring(index + 1, str.length);
        if (key == 'label') {
            return this.label[value];
        } else {
            return this.endlessModeText[value];
        }
    },

    label: {
        4000000: '请保持网络连接畅通',
        4000001: '服务器维护中',
        4000002: '请选择服务器',
        4000003: '正在从基地下载战斗数据，请保持网络连接畅通',
        4000004: '战斗数据下载成功',
        4000005: '系统重启中......',
        4000006: '服务器繁忙，请稍等并确保网络连接正常',
        4000211: "不能出售0个道具！",
        4000212: '商城',
        4000213: '花费钻石可以购买！',
        hello: '你好！',
        level: '%d级',
        4000214: '购买',
        4000215: '是否花费%d钻石增加20个背包格子？',
        4000216: '提示',
        4000217: '背包格子已达到最大',
        4000218: '出售成功，获得%d金币',
        4000219: '不能出售',
        4000220: '购买成功',
        4000221: '钻石不足',
        4000222: '出售%s将获得金币%d',
        4000223: '道具不足',
        4000224: '成功激活',
        4000225: '活动产出',
        4000226: '请关注相关活动',
        4000227: '金币不足',
        4000228: '购买次数达到上限',
        4000229: '等级',
        4000230: '购买体力',
        4000231: '购买体力成功',
        4000232: '金币',
        4000233: '钻石',
        4000234: '第%d章',
        4000235: '升阶所需材料不足',
        4000236: '暴击，装备等级提升%d级',
        4000237: '升级成功，等级提升%d级',
        4000238: '装备升阶成功',
        4000239: '重置关卡次数',
        4000240: '关卡宝箱',
        4000241: '领取',
        4000242: '领取成功',
        4000243: '%d元',
        4000244: '获得',
        4000245: '确认购买 ',
        4000246: '您的道具不足',
        4000247: '需要消耗寻宝券',
        4000248: '需要购买寻宝券',
        4000249: '分享获得',
        4000250: '关卡重置：今日已重置%cur次，剩余%max次',
        4000251: '剩余关卡挑战次数不为0，还不能重置',
        4000252: '分享还可免费获得%d次',
        4000253: '使用',
        4000254: '使用%d次',
        4000255: '点金奖励',
        4000256: '升级%d次',
        4000257: '升阶需要玩家等级达到%d级,当前%d级',
        4000258: '等级达到%d级开启%d',
        4000259: '分数达到%d宝箱升级为',
        4000260: '当前军衔',
        4000261: '达到%d万分',
        4000262: '需要先通关前置章节',
        4000263: '%d级开启新章节',
        4000264: '获得军衔宝箱，是否前往背包打开？',
        4000265: '%level级开启',
        4000266: '去提升',
        4000267: '强制挑战',
        4000268: '战力不足关卡推荐战力\n是否去提升再来挑战？',
        4000269: '恭喜您获得%d晶体',
        4000270: '结晶不足，是否去分解？',
        4000271: '合体可上阵多架战机，确认分解？',

        4000301: '金币不足',
        4000302: '免费获得%d金币',
        4000303: '免费获得%d钻石',
        4000304: '分享到群',
        4000305: '去购买',
        4000306: '今日剩余%left/%max次',
        4000307: '已分享%cur/%max次',
        4000308: '分享成功',
        4000309: '分享失败',
        4000310: '分享失败，请换个群再试试',
        4000311: '点击刚刚分享到微信群的链接领取奖励',
        4000312: '分享还可免费获得%d次',
        4000313: '今日免费次数已用尽',
        4000314: '获得冲锋宝箱，可在仓库打开',
        4000315: '分享成功，火力支援数量+1',
        4000316: '请分享到群试试哦',
        4000317: '分享到群后\n点击群内链接即可获取奖励',
        4000318: '今日可开采%cur/%max次',
        4000319: '贵族%level直接领取',
        4000320: '分享失败，请分享到群试试哦',
        4000321: '当前没有可观看的视频',
        4000322: '已有宝箱处于恢复中，暂不可购买',
        4000323: '%hourh%minm后免费',
        4000324: '%minm%secs后免费',
        4000325: '当前可免费寻宝',
        4000326: '%hour:%min:%sec后免费',
        4000327: '恢复一个宝箱%left/%max',
        4000328: '观看视频',
        4000329: '分享到群即可领取奖励',
        4000330: '观看视频即可领取奖励',
        4000331: '还需邀请%count位新玩家',
        4000332: '领取奖励',
        4000333: '已领取',
        4000334: '暂时无视频可看',
        4000335: '  分享到群邀请',
        4000336: '免费领取',
        4000337: '分享失败，请分享到不同群',
        4000338: '分享到群获得',
        4000339: '观看视频获得',
        4000340: '视频还可免费获得%d次',


        4000401: '今日还可参与%d次',
        4000402: '每日可参与%d次',
        4000403: '该活动还可参与%d次',

        4000501: '查看特权',
        4000502: '充值',
        4000503: '贵族%level特权',
        4000504: '%left成为',
        4000505: '贵族%level',
        4000506: '充值满%count元可开启贵族%level特权',
        4000507: '已达到最高贵族等级',

        4000601: '未达到连续签到要求',
        4000602: '连续签到奖励已经领取过了',

        4000701: '今天的宝箱获得次数已达上限',
        4000702: '恭喜获得%count%name',
        4000703: '您点的太慢啦，宝箱已经逃走了',

        //火力对决
        4001001: '(免费次数 %free）',
        4001002: '进攻',
        4001003: '防守',
        4001004: '胜利',
        4001005: '战胜',
        4001006: '失败',
        4001007: '战败',
        4001008: '上升',
        4001009: '下降',
        4001010: '接受了您的挑战',
        4001011: '挑战了您',
        4001012: '【%tag】%time，%other%action，您%result2了，排名%change了%gap名',
        4001013: '达到%rank名',
        4001014: '今日还可购买%times次',
        4001015: '当前已达购买上限，升级贵族可提高购买次数，是否前去充值？',
        4001016: '今日已刷新%times次',
        4001017: '%rank名的奖励',
        4001018: '第%rank名',
        4001019: '第%minRank-%maxRank名',
        4001020: '第%minRank名之后',
        4001021: '排名再提升%gap名后可获得奖励',
        4001022: '当前已达购买上限，升级贵族可提高\n购买次数上限，是否前去充值？',

        //浩瀚宝库和神秘金库
        4002001: '每充值%price元可以获得一次领取次数，累计充值可以获得额外领取次数',
        4002002: '必得以下道具，总价值%value钻',
        4002003: '剩余%times次',
        4002004: '领取%times次',
        4002005: '充值%price元',
        4002006: '价值%value钻',
        4002007: '积分达到%value以上可上榜',

    },
    endlessModeText: {
        0: "新手",
        1: "前哨",
        2: "队长",
        3: "先锋",
        4: "精英",
        5: "王牌",
        6: "统帅",
        7: "将军",
        8: "指挥官",
    },
};