var CampNormal35 = module.exports;

CampNormal35.data = {
    maps:[
        ["chengshixunhuan","chengshixunhuan","chengshixunhuan"],
        ["bfc-c-01xianjie","bfc-c-01xianjie","bfc-c-01xianjie"],
    ],
    monsterWaves:[
        {wave:{groups:[679,27],wait:0,delay:[0.5,1]},maps:{mapIndex:[0],mapSpeed:[400],mapScale:[1],mapLoop:[1]}},
        {wave:{groups:[680,52],wait:0,delay:[0,0.5]}},
        {wave:{groups:[681,51],wait:0,delay:[0,0.6]},maps:{mapIndex:[0],mapSpeed:[800],mapScale:[1.2],mapLoop:[1]}},
        {wave:{groups:[682,303],wait:0,delay:[0,0]}},
        {wave:{groups:[683,573],wait:0,delay:[0,0]}},
        {wave:{groups:[684,693],wait:0,delay:[0,0]},maps:{mapIndex:[0],mapSpeed:[500],mapScale:[1],mapLoop:[1]}},
        {wave:{groups:[694,693,28,31],wait:0,delay:[0,0,1,1.5]}},
        {wave:{groups:[686,694],wait:0,delay:[0,0.5]}},
        {wave:{groups:[687,688,302],wait:0,delay:[0,0,2]}},
        {wave:{groups:[689,19,25],wait:0,delay:[0,0.5,1]}},
        {wave:{groups:[690,303],wait:0,delay:[0,0.8]}},
        {wave:{groups:[85],wait:0,delay:[0],anime:1,isBOSS:1}},
    ],
    monsterExtra:[311,312,31,1277,24,25,1313,1314,1315,1316,1317,36,39,40,42,45,47,48,50,51,52,573,830,831,832,833,834,836,839,1066,1067,1069,1070,1072,1073,1074,1075,1077,1078],

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
                {wave:{index:1,step:8}},
            ],
            effect:[
                {extra:{open:-1,delay:1.4}},
            ],
        },
        {
            eventKey:0,
            checkTime:1,
            condition:[
                {wave:{index:2,step:6}},
            ],
            effect:[
                {extra:{open:-2}},
            ],
        },
        {
            eventKey:0,
            checkTime:1,
            condition:[
                {wave:{index:4,step:8}},
            ],
            effect:[
                {extra:{open:-1,delay:1.4}},
            ],
        },
        {
            eventKey:0,
            checkTime:1,
            condition:[
                {wave:{index:5,step:6}},
            ],
            effect:[
                {extra:{open:-2}},
            ],
        },
        {
            eventKey:0,
            checkTime:1,
            condition:[
                {wave:{index:10,step:8}},
            ],
            effect:[
                {extra:{open:-1,delay:1.4}},
            ],
        },
        {
            eventKey:0,
            checkTime:1,
            condition:[
                {wave:{index:11,step:5}},
            ],
            effect:[
                {extra:{open:-2}},
            ],
        },
    ],
}