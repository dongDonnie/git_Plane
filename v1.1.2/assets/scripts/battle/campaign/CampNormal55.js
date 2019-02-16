var CampNormal55 = module.exports;

CampNormal55.data = {
    maps:[
        ["bfc-a","bfc-a","bfc-a"],
        ["bfc-b-01hebing","bfc-b-01hebing","bfc-b-01hebing"],
        ["bfc-c-01xianjie","bfc-c-01xianjie","bfc-c-01xianjie"],
    ],
    monsterWaves:[
        {wave:{groups:[608,27,609,573],wait:0,delay:[0.3,1,2.5,4.5]},maps:{mapIndex:[0,1],mapSpeed:[400,800],mapScale:[1,1],mapLoop:[1,1]}},
        {wave:{groups:[610,563,564],wait:0,delay:[0.2,1,2.6]}},
        {wave:{groups:[611,554,555],wait:0,delay:[0,1,2.4]}},
        {wave:{groups:[612,375],wait:0,delay:[0,2.4]}},
        {wave:{groups:[1444,40,41],wait:0,delay:[0,1,2]}},
        {wave:{groups:[613,587,590],wait:0,delay:[0,1,2.4]}},
        {wave:{groups:[615,543],wait:0,delay:[0,1.5]}},  {wave:{groups:[611,554,555],wait:0,delay:[0,1,2.4]}},
        {wave:{groups:[1445],wait:0,delay:[0,2.4]}},
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
                {wave:{index:1,step:6}},
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