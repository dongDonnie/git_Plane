var CampNormal233 = module.exports;

CampNormal233.data = {
    maps:[
        ["tk-a","tk-a","tk-a"],
        ["tk-c","tk-c","tk-c"],
    ],
    monsterWaves:[
        {wave:{groups:[1108,1277,1278],wait:0,delay:[1,2,3,4]},maps:{mapIndex:[0,1],mapSpeed:[200,500],mapScale:[1,1],mapLoop:[1,1]}},
        {wave:{groups:[1111],wait:0,delay:[0,0,2]}},{wave:{groups:[1109,1077],wait:0,delay:[0,0,2]}},
        {wave:{groups:[1110,1066],wait:0,delay:[0,0,2]}},    {wave:{groups:[1112,1067],wait:0,delay:[0,0,2]}},
     
        {wave:{groups:[1111],wait:0,delay:[0,0,2]}},
        {wave:{groups:[1113,882],wait:0,delay:[0,0,2]}},  {wave:{groups:[1109,1077],wait:0,delay:[0,0,2]}},
        {wave:{groups:[1114],wait:0,delay:[0,0,2]}},
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