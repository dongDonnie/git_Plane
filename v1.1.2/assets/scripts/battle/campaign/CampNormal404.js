var CampNormal404 = module.exports;

CampNormal404.data = {
    maps:[
        ["fg_fight_bg_0","fg_fight_bg_0","fg_fight_bg_0"],
        ["kjznb-tongdao","kjznb-tongdao","kjznb-tongdao"],
    ],
    monsterWaves:[
        {wave:{groups:[41,378,40],wait:0,delay:[0.5,2.5,4.5]},maps:{mapIndex:[0,1],mapSpeed:[250,500],mapScale:[1,1],mapLoop:[1,1]}},
        {wave:{groups:[38,379,40,193],wait:0,delay:[0,0,2,5]}},   
        {wave:{groups:[382],wait:0,delay:[0]}},
        {wave:{groups:[381],wait:0,delay:[0.5]}},
        {wave:{groups:[41,380,14,15,16,17],wait:0,delay:[0,0,2,4,6,6]}},
        
        {wave:{groups:[382],wait:0,delay:[0]}},
        {wave:{groups:[302],wait:0,delay:[0]}},
        {wave:{groups:[381],wait:0,delay:[0.5]}},
        {wave:{groups:[301,383],wait:0,delay:[0,3]}},
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
                {wave:{index:8,step:8}},
            ],
            effect:[
                {extra:{open:-2}},
            ],
        },
        
    ],
}