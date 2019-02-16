var CampNormal315 = module.exports;

CampNormal315.data = {
    maps:[
        ["cx-a","cx-b","cx-c"],
        ["cx-c","cx-c","cx-c"],
    ],
    monsterWaves:[
        {wave:{groups:[866,837,836],wait:0,delay:[0.3,1.5,1.5]},maps:{mapIndex:[0],mapSpeed:[800],mapScale:[1],mapLoop:[0]}},
        {wave:{groups:[868,831,39],wait:0,delay:[0,2,3]},maps:{mapIndex:[1],mapSpeed:[800],mapScale:[1],mapLoop:[1]}},
        {wave:{groups:[869,44,45],wait:0,delay:[0,1.5,2]}},
        {wave:{groups:[1391,996],wait:0,delay:[0,0]}},
        {wave:{groups:[1393,562,554],wait:0,delay:[0,0,2]}},
        {wave:{groups:[870,842],wait:0,delay:[0,0]}},
        {wave:{groups:[1019,993,995],wait:0,delay:[0,0,1]}},
        {wave:{groups:[871,556,557],wait:0,delay:[0,1,1]}},
      
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
        {
            eventKey:0,
            checkTime:1,
            condition:[
                {wave:{index:0,step:8}},
            ],
            effect:[
                {extra:{open:-1,delay:1.4}},
            ],
        },
        {
            eventKey:0,
            checkTime:1,
            condition:[
                {wave:{index:1,step:4}},
            ],
            effect:[
                {extra:{open:-2}},
            ],
        },
    ],
}