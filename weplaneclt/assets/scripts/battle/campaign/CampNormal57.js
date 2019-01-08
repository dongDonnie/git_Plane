var CampNormal57 = module.exports;

CampNormal57.data = {
    maps:[
        ["tk-a","tk-a","tk-a"],
        ["tk-b","tk-c","tk-b"],
        ["tk-d-ditu","tk-e-ditu","tk-f-bossditu"],
    ],
    monsterWaves:[
        {wave:{groups:[36,397],wait:0,delay:[1,2]},maps:{mapIndex:[0,1],mapSpeed:[400,500],mapScale:[1,1],mapLoop:[1,1]}},
        {wave:{groups:[42,398,27],wait:0,delay:[0,2,4]}},
        {wave:{groups:[405,113,116],wait:0,delay:[0,1,2]}}, 
        {wave:{groups:[402,403],wait:0,delay:[0,2]}},{wave:{groups:[42,398,27],wait:0,delay:[0,2,4]}},
        {wave:{groups:[86,44,45],wait:0,delay:[0,2,2],anime:1,isBOSS:1},maps:{mapIndex:[0,2],mapSpeed:[400,500],mapScale:[1,1],mapLoop:[0,0]}},
    ],
    monsterExtra:[23,24,25,1313,1314,1315,1316,1317,23,24,25,1313,1314,1315,1316,1317],

    totalHint:[
        {
            checkTime:-1,
            condition:[
                {interval:16},
            ],
            effect:[
                {drop:10000},
            ]
        },
        
        {
            eventKey:0,
            checkTime:1,
            condition:[
                {wave:{index:4,step:8}},
            ],
            effect:[
                {extra:{open:-1,delay:1.2}},
            ],
        },
        {
            eventKey:0,
            checkTime:1,
            condition:[
                {wave:{index:5,step:5}},
            ],
            effect:[
                {extra:{open:-2}},
            ],
        },
    ],
}