var CampNormal364 = module.exports;

CampNormal364.data = {
    maps:[
        ["cx-c","cx-d","cx-c"],
        ["cx-d","cx-c","cx-e-bossditu"],
    ],
    monsterWaves:[
        {wave:{groups:[618,44,45],wait:0,delay:[0.3,1,2.5]},maps:{mapIndex:[0],mapSpeed:[500],mapScale:[1],mapLoop:[1]}},
        {wave:{groups:[620,29,32],wait:0,delay:[0,1,2.4]}}, {wave:{groups:[619,40,41],wait:0,delay:[0.2,1,2.6]}},
        {wave:{groups:[621,546],wait:0,delay:[0,2.4]}},
       
        {wave:{groups:[620,29,32],wait:0,delay:[0,1,2.4]}},
        {wave:{groups:[622,543],wait:0,delay:[0,2.4]},maps:{mapIndex:[1],mapSpeed:[500],mapScale:[1],mapLoop:[0]}},
        {wave:{groups:[614],wait:0,delay:[0,0],anime:1,isBOSS:1}},
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
                {extra:{open:-1,delay:1.4}},
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