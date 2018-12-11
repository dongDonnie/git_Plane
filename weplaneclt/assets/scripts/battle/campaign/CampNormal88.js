var CampNormal88 = module.exports;

CampNormal88.data = {
    maps:[
        ["fg_fight_bg_0","fg_fight_bg_0","fg_fight_bg_0"],
    ],
    monsterWaves:[
        {wave:{groups:[1154,1166,1221],wait:0,delay:[1.8,2.5,3]},maps:{mapIndex:[0],mapSpeed:[500],mapScale:[1],mapLoop:[1]}},
        {wave:{groups:[793,795,797,1222],wait:0,delay:[0,0,0.5,1]}},
        {wave:{groups:[792,798,800,1223],wait:0,delay:[0,1,2,2]}},
        {wave:{groups:[799,797,795,793,791],wait:0,delay:[0,1,2,3,4]}},
        {wave:{groups:[1153,1155,1164,1166,794,796],wait:0,delay:[0,0,1,1,1,1]}},
        {wave:{groups:[792,793,795,797,798],wait:0,delay:[0,1,2,3,4]}},
        {wave:{groups:[1206,1216,795,793,791,1225,1226],wait:0,delay:[0,1,2,3,4,5,6]}},
        {wave:{groups:[1206,1216,794,796],wait:0,delay:[0,0,1,1]}},
        {wave:{groups:[1153,1155,1157,1159,793,800,797],wait:0,delay:[0,0,0,0,0,0,0]}},
       
        {wave:{groups:[1173,1174,1175,1176,1177,1227],wait:0,delay:[0,0,0,0,0,2]}},
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
                {wave:{index:0,step:6}},
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