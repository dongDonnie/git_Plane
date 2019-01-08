var CampNormal354 = module.exports;

CampNormal354.data = {


maps:[
    ["tk-e-ditu","tk-e-ditu","tk-e-ditu"],
    ["tk-e-ditu","tk-e-ditu","tk-f-bossditu"],
],
monsterWaves:[
    {wave:{groups:[387,37],wait:0,delay:[2,3.5]},maps:{mapIndex:[0],mapSpeed:[600],mapScale:[1],mapLoop:[1]}},
    {wave:{groups:[389,17],wait:0,delay:[0,0]}},
    
    {wave:{groups:[388,114,27],wait:0,delay:[0,0,0]}}, 
    {wave:{groups:[389,17],wait:0,delay:[0,0]}},
    {wave:{groups:[390,18],wait:0,delay:[0,0]}},
    {wave:{groups:[99],wait:0,delay:[0],anime:1,isBOSS:1},maps:{mapIndex:[1],mapSpeed:[600],mapScale:[1],mapLoop:[0]}},
],
monsterExtra:[23,24,25,559,560,552,1308,1309,1310,1311,1312,23,24,25,559,560,552,1308,1309,1310,1311,1312],

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
            {extra:{open:-1,delay:1}},
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