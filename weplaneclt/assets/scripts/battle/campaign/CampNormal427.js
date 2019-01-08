var CampNormal427 = module.exports;

CampNormal427.data = {
    maps:[
        ["shamo","shamo","shamo"],
    ],
    monsterWaves:[
        {wave:{groups:[708,38,39,42,43,882],wait:0,delay:[1,2.5,3,3.5,5,6]},maps:{mapIndex:[0],mapSpeed:[600],mapScale:[1],mapLoop:[1]}},
        {wave:{groups:[716,552,553],wait:0,delay:[0,0,2]}},  
       
        {wave:{groups:[715,831,830,836,837],wait:0,delay:[0,2,2,4,4]}},
        {wave:{groups:[51,882,1340,834,841],wait:0,delay:[0,0,2,2,4]}},  
        {wave:{groups:[716,552,553],wait:0,delay:[0,0,2]}}, 
        {wave:{groups:[80],wait:0,delay:[0],anime:1,isBOSS:1}},
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
        {
            eventKey:0,
            checkTime:1,
            condition:[
                {wave:{index:4,step:8}},
            ],
            effect:[
                {extra:{open:-1,delay:1.2}},
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