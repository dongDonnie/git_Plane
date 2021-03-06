var CampNormal270 = module.exports;

CampNormal270.data = {
    maps:[
        ["cx-a","cx-a","cx-a"],
        ["cx-b","cx-c","cx-e-bossditu"],
    ],
    monsterWaves:[
        {wave:{groups:[944,945,836,837,952,953],wait:0,delay:[0.2,1,1.2,1.2,3,3]},maps:{mapIndex:[0],mapSpeed:[600],mapScale:[1],mapLoop:[1]}},
        {wave:{groups:[946,19,25],wait:0,delay:[0,0,0]}},       {wave:{groups:[950,556,557,720],wait:0,delay:[0,1,1,3]}}, 
     
        {wave:{groups:[949,42,43,545],wait:0,delay:[0,1,2,2.5]},maps:{mapIndex:[1],mapSpeed:[600],mapScale:[1],mapLoop:[0]}}, 
        {wave:{groups:[946,19,25],wait:0,delay:[0,0,0]}},  {wave:{groups:[947,948,38,39],wait:0,delay:[0,1,1.5,2]}}, 
        {wave:{groups:[94],wait:0,delay:[0],anime:1,isBOSS:1}},
    ],
    monsterExtra:[23,24,25,559,560,552,1308,1309,1310,1311,1312],

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
                {wave:{index:2,step:8}},
            ],
            effect:[
                {extra:{open:-1,delay:1.1}},
            ],
        },
        {
            eventKey:0,
            checkTime:1,
            condition:[
                {wave:{index:3,step:6}},
            ],
            effect:[
                {extra:{open:-2}},
            ],
        },
    ],
}