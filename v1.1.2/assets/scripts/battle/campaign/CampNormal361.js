var CampNormal361 = module.exports;

CampNormal361.data = {
    maps:[
        ["bfc-a","bfc-a","bfc-a"],
        ["bfc-b-01hebing","bfc-b-01hebing","bfc-b-01hebing"],
    ],
    monsterWaves:[
        {wave:{groups:[1412,19,25],wait:0,delay:[0.2,1.3,1.7]},maps:{mapIndex:[0,1],mapSpeed:[300,600],mapScale:[1,1],mapLoop:[1,1]}},
        {wave:{groups:[1413,34,37],wait:0,delay:[0.1,0.5,2.5,3]}},
        {wave:{groups:[1419,44,45],wait:0,delay:[0,1.5,1.5]}},
       
        {wave:{groups:[1418],wait:0,delay:[0.1,0.7,1.3,1.9]}},
        {wave:{groups:[1414,50],wait:0,delay:[0,0.8]}}, {wave:{groups:[1416],wait:0,delay:[0.1,0.5,2,2.4,3.2]}},
        {wave:{groups:[1417,44,45],wait:0,delay:[0,1.5,1.5]}},
        {wave:{groups:[1415,25,19],wait:0,delay:[0.1,0.8,1.8,3]}},
        {wave:{groups:[1413,34,37],wait:0,delay:[0.1,0.5,2.5,3]}},
        {wave:{groups:[1419,44,45],wait:0,delay:[0,1.5,1.5]}},
        {wave:{groups:[1420,44,45],wait:0,delay:[0,1.5,1.5]}},
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
                {extra:{open:-1,delay:2.8}},
            ],
        },
        {
            eventKey:0,
            checkTime:1,
            condition:[
                {wave:{index:10,step:6}},
            ],
            effect:[
                {extra:{open:-2}},
            ],
        },
    ],
}