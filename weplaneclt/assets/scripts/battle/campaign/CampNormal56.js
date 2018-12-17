var CampNormal56 = module.exports;

CampNormal56.data = {
    maps:[
        ["xingkong","xingkong","xingkong"],
        ["kjznb-tongdao","kjznb-tongdao","kjznb-tongdao"],
    ],
    monsterWaves:[
        {wave:{groups:[40,41,222,225],wait:0,delay:[2,2,2,2]},maps:{mapIndex:[0,1],mapSpeed:[400,500],mapScale:[1,1],mapLoop:[1,1]}},
        {wave:{groups:[34,35,39,394],wait:0,delay:[0,0,2,4]}},
        {wave:{groups:[395,1078],wait:0,delay:[0,0]}},
        {wave:{groups:[1433,1075],wait:0,delay:[0,0.5]}},
        {wave:{groups:[1434,1070],wait:0,delay:[0,0]}},
        {wave:{groups:[1435,45],wait:0,delay:[0,0]}}, {wave:{groups:[34,35,39,394],wait:0,delay:[0,0,2,4]}},
        {wave:{groups:[34,396,40,41],wait:0,delay:[0,2,4,4]}},
        {wave:{groups:[400],wait:0,delay:[0]}},
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
                {wave:{index:2,step:6}},
            ],
            effect:[
                {extra:{open:-1,delay:2.8}},
            ],
        },
        {
            eventKey:0,
            checkTime:1,
            condition:[
                {wave:{index:8,step:6}},
            ],
            effect:[
                {extra:{open:-2}},
            ],
        },
    ],
}