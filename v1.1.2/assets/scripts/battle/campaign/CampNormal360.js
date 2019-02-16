var CampNormal360 = module.exports;

CampNormal360.data = {
    maps:[
        ["shamo","shamo","shamo"],
    ],
    monsterWaves:[
        {wave:{groups:[430,14,24],wait:0,delay:[2,3,3,3.5,3.5,5]},maps:{mapIndex:[0],mapSpeed:[500],mapScale:[1],mapLoop:[1]}},
        {wave:{groups:[432,45,19],wait:0,delay:[0,0,0.5,1,1.5]}}, 
         {wave:{groups:[434,37],wait:0,delay:[0,0,1,1]}},
       
        {wave:{groups:[434,37],wait:0,delay:[0,0,1,1]}},
        {wave:{groups:[435,36,37],wait:0,delay:[0,0,1,1]}}, {wave:{groups:[433,414,19,25],wait:0,delay:[0,0,0.5,1,1.5]}},
        {wave:{groups:[431,45,25],wait:0,delay:[0,0,0.5,1,1.5]}},
         {wave:{groups:[433,414,19,25],wait:0,delay:[0,0,0.5,1,1.5]}},
        {wave:{groups:[334],wait:0,delay:[0],anime:1,isBOSS:1},maps:{mapIndex:[0],mapSpeed:[500],mapScale:[1],mapLoop:[0]}},
    ],
    monsterExtra:[23,24,25,1313,1314,1315,1316,1317],

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
                {wave:{index:7,step:8}},
            ],
            effect:[
                {extra:{open:-1,delay:1.2}},
            ],
        },
        {
            eventKey:0,
            checkTime:1,
            condition:[
                {wave:{index:8,step:5}},
            ],
            effect:[
                {extra:{open:-2}},
            ],
        },
    ],
}