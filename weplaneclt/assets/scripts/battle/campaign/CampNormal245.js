var CampNormal245 = module.exports;

CampNormal245.data = {
    maps:[
        ["fg_fight_bg_0","fg_fight_bg_0","fg_fight_bg_0"],
    ],
    monsterWaves:[
        {wave:{groups:[1326,19,25,26],wait:0,delay:[1.5,2,3,3]},maps:{mapIndex:[0],mapSpeed:[600],mapScale:[1],mapLoop:[1]}},
       
        {wave:{groups:[1328,31],wait:0,delay:[0,0]}},        {wave:{groups:[1330],wait:0,delay:[0,1]}},
        {wave:{groups:[1329,27],wait:0,delay:[0,1]}},
        {wave:{groups:[1332],wait:0,delay:[0,1]}},
        {wave:{groups:[1331],wait:0,delay:[0,1]}}, {wave:{groups:[1327,35],wait:0,delay:[0,1]}},
      
        {wave:{groups:[1333],wait:0,delay:[0,1]}},
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
                {wave:{index:7,step:8}},
            ],
            effect:[
                {extra:{open:-2}},
            ],
        },
    ],
}