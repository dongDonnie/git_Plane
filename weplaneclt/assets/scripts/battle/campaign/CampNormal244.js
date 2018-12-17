var CampNormal244 = module.exports;

CampNormal244.data = {
    maps:[
        ["tk-a","tk-a","tk-a"],
        ["tk-b","tk-c","tk-b"],
        ["tk-d-ditu","tk-e-ditu","tk-f-bossditu"],
    ],
    monsterWaves:[
        {wave:{groups:[1299,26,834,882],wait:0,delay:[2,2.5,3,4]},maps:{mapIndex:[0,1],mapSpeed:[400,500],mapScale:[1,1],mapLoop:[1,1]}},
        {wave:{groups:[1300,841,842],wait:0,delay:[0,0,2]}},{wave:{groups:[1303,43],wait:0,delay:[0,1,2]}}, 
    
        
        {wave:{groups:[861,1077,1078],wait:0,delay:[0,1,2]}},     {wave:{groups:[1301,45],wait:0,delay:[0,1,2]}},{wave:{groups:[1300,841,842],wait:0,delay:[0,0,2]}},
        {wave:{groups:[1304],wait:0,delay:[0],anime:1,isBOSS:1},maps:{mapIndex:[0,2],mapSpeed:[400,800],mapScale:[1,1],mapLoop:[0,0]}},
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
                {wave:{index:5,step:8}},
            ],
            effect:[
                {extra:{open:-1,delay:1.4}},
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