var CampNormal290 = module.exports;

CampNormal290.data = {
    maps:[
        ["xingkong","xingkong","xingkong"],
        ["tk-b","tk-c","tk-b"],
        ["tk-d-ditu","tk-e-ditu","tk-f-bossditu"],
    ],
    monsterWaves:[
        {wave:{groups:[1252,45,44],wait:0,delay:[1,2,3]},maps:{mapIndex:[0,1],mapSpeed:[400,600],mapScale:[1,1],mapLoop:[1,1]}},
        {wave:{groups:[1256],wait:0,delay:[0,0,2]}},  {wave:{groups:[1255,43,50],wait:0,delay:[0,0,2]}},   {wave:{groups:[1253,1254],wait:0,delay:[0,2]}},
    
       
        {wave:{groups:[105],wait:0,delay:[0],anime:1,isBOSS:1},maps:{mapIndex:[0,2],mapSpeed:[400,600],mapScale:[1,1],mapLoop:[0,0]}},
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
                {wave:{index:3,step:6}},
            ],
            effect:[
                {extra:{open:-2}},
            ],
        },
        {
            eventKey:0,
            checkTime:1,
            condition:[
                {wave:{index:3,step:8}},
            ],
            effect:[
                {extra:{open:-1,delay:1.4}},
            ],
        },
        {
            eventKey:0,
            checkTime:1,
            condition:[
                {wave:{index:4,step:5}},
            ],
            effect:[
                {extra:{open:-2}},
            ],
        },
    ],
}