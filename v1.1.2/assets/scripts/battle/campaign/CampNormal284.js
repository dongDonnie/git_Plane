var CampNormal284 = module.exports;

CampNormal284.data = {

maps:[
    ["tk-e-ditu","tk-e-ditu","tk-e-ditu"],
    ["tk-e-ditu","tk-e-ditu","tk-f-bossditu"],
],
monsterWaves:[
    {wave:{groups:[1099,1066,1067],wait:0,delay:[2,3,4,5]},maps:{mapIndex:[0],mapSpeed:[600],mapScale:[1],mapLoop:[1]}},
    {wave:{groups:[1104,555],wait:0,delay:[0,1,2,4,4.5,5]}}, {wave:{groups:[1100,1073],wait:0,delay:[0,1,2,4,4.5,5]}},        {wave:{groups:[1102,559,560],wait:0,delay:[0,1,1,4,4.5,5]}},
    {wave:{groups:[1101,836,839],wait:0,delay:[0,1,2,4,4.5,5]}},

 
    {wave:{groups:[1103,554],wait:0,delay:[0,1,2,4,4.5,5]}},
    {wave:{groups:[78],wait:0,delay:[0],anime:1,isBOSS:1},maps:{mapIndex:[1],mapSpeed:[600],mapScale:[1],mapLoop:[0]}},
],
monsterExtra:[311,312,313,23,24,25,1313,1314,1315,1316,1317,36,39,40,42,45,47,48,50,51,52,573,830,831,832,833,834,836,839,1066,1067,1069,1070,1072,1073,1074,1075,1077,1078],

totalHint:[
    {
        checkTime:-1,
        condition:[
            {interval:14},
        ],
        effect:[
            {drop:10000},
        ]
    },
    {
        eventKey:0,
        checkTime:1,
        condition:[
            {wave:{index:0,step:4}},
        ],
        effect:[
            {extra:{open:-1,delay:2.8}},
        ],
    },
    {
        eventKey:0,
        checkTime:1,
        condition:[
            {wave:{index:5,step:6}},
        ],
        effect:[
            {extra:{open:-2}},
        ],
    },
    {
        eventKey:0,
        checkTime:1,
        condition:[
            {wave:{index:5,step:8}},
        ],
        effect:[
            {extra:{open:-1,delay:1.2}},
        ],
    },
    {
        eventKey:0,
        checkTime:1,
        condition:[
            {wave:{index:6,step:5}},
        ],
        effect:[
            {extra:{open:-2}},
        ],
    },
],
}