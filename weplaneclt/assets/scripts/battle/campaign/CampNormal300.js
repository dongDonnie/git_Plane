var CampNormal300 = module.exports;

CampNormal300.data = {
    maps:[
        ["bfc-a","bfc-a","bfc-a"],
        ["bfc-b-01hebing","bfc-b-01hebing","bfc-b-01hebing"],
        ["bfc-c-01xianjie","bfc-c-01xianjie","bfc-c-01xianjie"],
    ],
    monsterWaves:[
        {wave:{groups:[88],wait:0,delay:[0.3,1.5]},maps:{mapIndex:[0,1],mapSpeed:[400,800],mapScale:[1,1],mapLoop:[1,1]}},
        {wave:{groups:[89],wait:0,delay:[0.2,1.5,2]}},
        {wave:{groups:[90],wait:0,delay:[0,1,2.4]}},
        {wave:{groups:[91],wait:0,delay:[0,2.4]}},      
        {wave:{groups:[92],wait:0,delay:[0,1,2]}},
        {wave:{groups:[93],wait:0,delay:[0,1,2]}},
        {wave:{groups:[94],wait:0,delay:[0,1.5]}},
        {wave:{groups:[96],wait:0,delay:[0,1.5]}},
        {wave:{groups:[98],wait:0,delay:[0,1.5]}},
        {wave:{groups:[103],wait:0,delay:[0,1.5]}},
    ],
    monsterExtra:[311,312,313,314,315,316,317],

    totalHint:[
        {
            checkTime:-1,
            condition:[
                {interval:15},
            ],
            effect:[
                {drop:10000},
            ]
        },
        
    ],
}