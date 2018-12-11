var CampNormal194 = module.exports;

CampNormal194.data = {
    maps:[
        ["fg_fight_bg_0","fg_fight_bg_0","fg_fight_bg_0"],
    ],
    monsterWaves:[
        {wave:{groups:[1288,38,36],wait:0,delay:[2,3,3]},maps:{mapIndex:[0],mapSpeed:[500],mapScale:[1],mapLoop:[1]}},
        {wave:{groups:[1289,725,42],wait:0,delay:[0,1,2.5]}},
        {wave:{groups:[1292,374,556,557],wait:0,delay:[0,1,1,1]}},
       
        {wave:{groups:[1291,882,726,722,725],wait:0,delay:[0,2,2,3.5,4]}},
        {wave:{groups:[27,1290,720,725,724],wait:0,delay:[0,0,2,3,5]}},
        {wave:{groups:[1293,640],wait:0,delay:[0,1,1,1]}},
        {wave:{groups:[1294],wait:0,delay:[0,1,1,1]}},

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
                {extra:{open:-1,delay:3}},
            ],
        },
        {
            eventKey:0,
            checkTime:1,
            condition:[
                {wave:{index:6,step:8}},
            ],
            effect:[
                {extra:{open:-2}},
            ],
        },
    ],
}