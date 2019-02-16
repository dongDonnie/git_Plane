var CampNormal316 = module.exports;

CampNormal316.data = {
    maps:[
        ["bfc-a","bfc-a","bfc-a"],
        ["tk-b","tk-b","tk-b"],
    ],
    monsterWaves:[
        {wave:{groups:[889,54],wait:0,delay:[0.8,0.8,0.3]},maps:{mapIndex:[0,1],mapSpeed:[300,500],mapScale:[1,1],mapLoop:[1,1]}},
        {wave:{groups:[890,882],wait:0,delay:[0,0]}},
        {wave:{groups:[899,793,795,563,564],wait:0,delay:[0,0,1,2.5,2.5]}},
        {wave:{groups:[896,763,765,776],wait:0,delay:[0,0,0.5,1.2]}},
        {wave:{groups:[891],wait:0,delay:[0,1.5]}}, 
        {wave:{groups:[890,882],wait:0,delay:[0,0]}},
        {wave:{groups:[1394,42,43],wait:0,delay:[0,1.5,3]}},
        {wave:{groups:[900,18,20,545],wait:0,delay:[0,1,1,2]}},
    ],
    monsterExtra:[311,312,313,314,315,316,317],

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
        
    ],
}