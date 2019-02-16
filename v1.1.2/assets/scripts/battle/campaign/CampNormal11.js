var CampNormal11 = module.exports;

CampNormal11.data = {
    maps:[
        ["cx-a","cx-a","cx-b"],
        ["cx-c","cx-c","cx-c"],
    ],
    monsterWaves:[
        {wave:{groups:[1019,42],wait:0,delay:[0.8,2]},maps:{mapIndex:[1],mapSpeed:[600],mapScale:[1],mapLoop:[1]}},
        {wave:{groups:[809,44,999],wait:0,delay:[0,1.5,2.3]}},
        {wave:{groups:[811,34],wait:0,delay:[0,1.5,3]}},
        {wave:{groups:[1418],wait:0,delay:[0.1]}},
        {wave:{groups:[1390,1077,1078],wait:0,delay:[0,1,2.5]}},
        {wave:{groups:[815,39],wait:0,delay:[0,1.5]}},
        {wave:{groups:[1376,43,46],wait:0,delay:[0,0,2]}},
    ],
    monsterExtra:[311,312,313,314,315,316,317,1308],

    totalHint:[
        {
            checkTime:-1,
            condition:[
                {interval:15},
            ],
            effect:[
                {drop:10000},
            ]
        },
       
    ],
}