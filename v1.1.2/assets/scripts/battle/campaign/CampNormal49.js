var CampNormal49 = module.exports;

CampNormal49.data = {
    maps:[
        ["tkz","tkz","tkz"],
        ["kjznb-tongdao","kjznb-tongdao","kjznb-tongdao"],
    ],
    monsterWaves:[
        {wave:{groups:[1371,34,35,1278],wait:0,delay:[1.8,2.5,3,4]},maps:{mapIndex:[0,1],mapSpeed:[200,400],mapScale:[1,1],mapLoop:[1,1]}},
        {wave:{groups:[1072,52,1277],wait:0,delay:[0,0.5,1]}},
        {wave:{groups:[1373,51],wait:0,delay:[0,0.6]}},
        {wave:{groups:[1374,303],wait:0,delay:[0,0]}},
        {wave:{groups:[1375,1066],wait:0,delay:[0,0]}},
        {wave:{groups:[1376,1067],wait:0,delay:[0,0]}},
        {wave:{groups:[1377,28,31],wait:0,delay:[0,0,1]}},
        
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
                {wave:{index:0,step:8}},
            ],
            effect:[
                {extra:{open:-1,delay:2.6}},
            ],
        },
        {
            eventKey:0,
            checkTime:1,
            condition:[
                {wave:{index:6,step:8}},
            ],
            effect:[
                {extra:{open:-2}},
            ],
        },
        
    ],
}