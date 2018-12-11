var CampNormal7 = module.exports;

CampNormal7.data = {
    maps:[
        ["fg_fight_bg_0","fg_fight_bg_0","fg_fight_bg_0"],
    ],
    monsterWaves:[
        {wave:{groups:[28,719,720],wait:0,delay:[0.3,1.5,2.5]},maps:{mapIndex:[0],mapSpeed:[600],mapScale:[1],mapLoop:[1]}},
        {wave:{groups:[31,721,722],wait:0,delay:[0,1,2]}},
        {wave:{groups:[729,725,724,726,720,35],wait:0,delay:[0,0.9,1.8,2.7,3.5,4]}},
        {wave:{groups:[722,724,721,722,729,725,34],wait:0,delay:[0,0.5,1.5,2.5,3.5,4.5,4.5]}},
        {wave:{groups:[722,724,722,731,722,28],wait:0,delay:[0,1,2,3.2,4.2,4.2]}},
        {wave:{groups:[103],wait:0,delay:[0],anime:1,isBOSS:1}},
    ],
    monsterExtra:[23,24,25,559,560,552,1308,1309,1310,1311,1312],

    totalHint:[
        {
            checkTime:-1,
            condition:[
                {interval:12},
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