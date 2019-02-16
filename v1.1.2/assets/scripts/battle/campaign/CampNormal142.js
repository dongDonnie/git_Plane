var CampNormal142 = module.exports;

CampNormal142.data = {
    maps:[
        ["fg_fight_bg_0","fg_fight_bg_0","fg_fight_bg_0"],
        ["kjznb-tongdao","kjznb-tongdao","kjznb-tongdao"],
    ],
    monsterWaves:[
        {wave:{groups:[1265,1277,1278,552,553],wait:0,delay:[2,3,3,5,5]},maps:{mapIndex:[0,1],mapSpeed:[250,700],mapScale:[1,1],mapLoop:[1,1]}},
        {wave:{groups:[1265,1269,1270,1271,1272,1280,24],wait:0,delay:[0,1,1,1,1,1,1]}}, {wave:{groups:[1407,1073,1074],wait:0,delay:[0,1,2,5]}},
        {wave:{groups:[1283,17,24],wait:0,delay:[0,0,1]}},
        {wave:{groups:[1406,554,555],wait:0,delay:[0,1,2,5]}},
        {wave:{groups:[1282,40],wait:0,delay:[0,1,4,5]}},
        {wave:{groups:[1283,17,24],wait:0,delay:[0,0,1]}},
        {wave:{groups:[1407,1073,1074],wait:0,delay:[0,1,2,5]}},
        {wave:{groups:[1284],wait:0,delay:[0]}},
    ],

    monsterExtra:[311,312,313,314,315,316,317,14,17,19,20,22,25,27,28,30,35,36,39,40,42,45,47,48,50,51,52,573,830,831,832,833,834,836,839,1066,1067,1069,1070,1072,1073,1074,1075,1077,1078],

    totalHint:[
        {
            checkTime:-1,
            condition:[
                {interval:18},
            ],
            effect:[
                {drop:10000},
            ]
        },
        {
            eventKey:0,
            checkTime:1,
            condition:[
                {wave:{index:0,step:4}},
            ],
            effect:[
                {extra:{open:-1,delay:2.8}},
            ],
        },
        {
            eventKey:0,
            checkTime:1,
            condition:[
                {wave:{index:8,step:8}},
            ],
            effect:[
                {extra:{open:-2}},
            ],
        },
    ],
}