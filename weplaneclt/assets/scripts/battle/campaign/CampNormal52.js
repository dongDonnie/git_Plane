var CampNormal52 = module.exports;

CampNormal52.data = {
    maps:[
        ["bfc-a","bfc-a","bfc-a"],
        ["tk-b","tk-b","tk-b"],
        ["tk-d-ditu","tk-e-ditu","tk-f-bossditu"],
    ],
    monsterWaves:[
        {wave:{groups:[1013],wait:0,delay:[0]},maps:{mapIndex:[0,1],mapSpeed:[400,800],mapScale:[1,1],mapLoop:[1,1]}},
        {wave:{groups:[368,30,33],wait:0,delay:[0,0.5,1.5]}},
        {wave:{groups:[369,33],wait:0,delay:[0,1]}},
        {wave:{groups:[370,47,48],wait:0,delay:[0,0.5,0.5]}},
        {wave:{groups:[371],wait:0,delay:[0]}},
        {wave:{groups:[82],wait:0,delay:[0],anime:1,isBOSS:1},maps:{mapIndex:[0,2],mapSpeed:[400,800],mapScale:[1,1],mapLoop:[0,0]}},
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
                {wave:{index:4,step:8}},
            ],
            effect:[
                {extra:{open:-1,delay:1.1}},
            ],
        },
        {
            eventKey:0,
            checkTime:1,
            condition:[
                {wave:{index:5,step:4}},
            ],
            effect:[
                {extra:{open:-2}},
            ],
        },
        
    ],
}