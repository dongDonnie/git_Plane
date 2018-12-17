var CampNormal76 = module.exports;

CampNormal76.data = {
    maps:[
        ["cx-a","cx-a","cx-b"],
        ["cx-c","cx-c","cx-c"],
    ],
    monsterWaves:[
        {wave:{groups:[1008,16,43,42,27],wait:0,delay:[1,2,2,3,4]},maps:{mapIndex:[0],mapSpeed:[600],mapScale:[1],mapLoop:[0]}},
        {wave:{groups:[1009,724,725,720],wait:0,delay:[0,1.5,3,3]}},  {wave:{groups:[1404],wait:0,delay:[0]}},
        {wave:{groups:[1403,720,726,724],wait:0,delay:[0,1.5,3,3]}},
        {wave:{groups:[1012,552,553],wait:0,delay:[0,1.5,3]}},
        {wave:{groups:[1404],wait:0,delay:[0]}},  {wave:{groups:[1403,720,726,724],wait:0,delay:[0,1.5,3,3]}},
        {wave:{groups:[1010,1011,836,837],wait:0,delay:[0.3,1,2,3]},maps:{mapIndex:[1],mapSpeed:[600],mapScale:[1],mapLoop:[1]}},
        {wave:{groups:[1013,546],wait:0,delay:[0,2]}},
    ],
    monsterExtra:[311,312,313,314,315,316,317],

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
                {wave:{index:6,step:8}},
            ],
            effect:[
                {extra:{open:-1,delay:1.2}},
            ],
        },
        {
            eventKey:0,
            checkTime:1,
            condition:[
                {wave:{index:7,step:4}},
            ],
            effect:[
                {extra:{open:-2}},
            ],
        },
    ],
}