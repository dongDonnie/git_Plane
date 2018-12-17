var CampNormal287 = module.exports;

CampNormal287.data = {
    maps:[
        ["shamo","shamo","shamo"],
        ["bfc-c-01xianjie","bfc-c-01xianjie","bfc-c-01xianjie"],
    ],
    monsterWaves:[
        {wave:{groups:[1140,1066,1067],wait:0,delay:[1.5,2,2.5]},maps:{mapIndex:[0,1],mapSpeed:[180,400],mapScale:[1,1],mapLoop:[1,1]}},
        {wave:{groups:[1141,841,792],wait:0,delay:[0,1.5,1.5]}},     {wave:{groups:[1143,794,797],wait:0,delay:[0,1,2]}},    {wave:{groups:[1146,800],wait:0,delay:[0,1.5,2,3,3,3]}},
        {wave:{groups:[1145,1154,1165,1156],wait:0,delay:[0,1.2,1.2,1.2]}},
        {wave:{groups:[1143,794,797],wait:0,delay:[0,1,2]}},
      
        {wave:{groups:[1142,800],wait:0,delay:[0,1,2,3,3,3]}},  {wave:{groups:[1141,841,792],wait:0,delay:[0,1.5,1.5]}},   
        {wave:{groups:[91],wait:0,delay:[0,1,2,3],anime:1,isBOSS:1}},
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
                {wave:{index:0,step:6}},
            ],
            effect:[
                {extra:{open:-1,delay:2.8}},
            ],
        },
        {
            eventKey:0,
            checkTime:1,
            condition:[
                {wave:{index:7,step:6}},
            ],
            effect:[
                {extra:{open:-2}},
            ],
        },
        {
            eventKey:0,
            checkTime:1,
            condition:[
                {wave:{index:7,step:8}},
            ],
            effect:[
                {extra:{open:-1,delay:1.4}},
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