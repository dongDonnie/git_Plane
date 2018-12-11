var CampNormal14 = module.exports;

CampNormal14.data = {
    maps:[
        ["bfc-a","bfc-a","bfc-a"],
        ["bfc-b-01hebing","bfc-b-01hebing","bfc-b-01hebing"],
        ["bfc-c-01xianjie","bfc-c-01xianjie","bfc-c-01xianjie"],
    ],
    monsterWaves:[
        {wave:{groups:[857,837],wait:0,delay:[0.3,1.5]},maps:{mapIndex:[0,1],mapSpeed:[400,800],mapScale:[1,1],mapLoop:[1,1]}},
        {wave:{groups:[827,834,775],wait:0,delay:[0.2,1.5,2]}},
        {wave:{groups:[859,554,555],wait:0,delay:[0,1,2.4]}},
        {wave:{groups:[824,826],wait:0,delay:[0,2.4]}},
        {wave:{groups:[860,833,773],wait:0,delay:[0,1,2]}},
        {wave:{groups:[1391,774,776],wait:0,delay:[0,1,2]}},
        {wave:{groups:[861,546],wait:0,delay:[0,1.5]}},
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