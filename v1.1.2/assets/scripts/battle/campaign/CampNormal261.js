var CampNormal261 = module.exports;

CampNormal261.data = {
    maps:[
        ["cx-a","cx-a","cx-b"],
        ["cx-c","cx-c","cx-c"],
    ],
    monsterWaves:[
        {wave:{groups:[808,42],wait:0,delay:[0.8,2]},maps:{mapIndex:[0],mapSpeed:[600],mapScale:[1],mapLoop:[0]}},
        {wave:{groups:[809,44,810],wait:0,delay:[0,1.5,3]}},
        {wave:{groups:[811,34],wait:0,delay:[0,1.5,3]},maps:{mapIndex:[1],mapSpeed:[600],mapScale:[1],mapLoop:[1]}},
        {wave:{groups:[814],wait:0,delay:[0.5]}}, {wave:{groups:[1390,1077,1078],wait:0,delay:[0,1,2.5]}},
        {wave:{groups:[815,39],wait:0,delay:[0,1.5]}},
        {wave:{groups:[814],wait:0,delay:[0.5]}},
       
        {wave:{groups:[793,797,87],wait:0,delay:[0,0,2],anime:1}},
    ],
    monsterExtra:[311,312,313,314,315,316,317,1308],

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
                {wave:{index:1,step:8}},
            ],
            effect:[
                {extra:{open:-1,delay:1.4}},
            ],
        },
        {
            eventKey:0,
            checkTime:1,
            condition:[
                {wave:{index:2,step:6}},
            ],
            effect:[
                {extra:{open:-2}},
            ],
        },
        {
            eventKey:0,
            checkTime:1,
            condition:[
                {wave:{index:6,step:8}},
            ],
            effect:[
                {extra:{open:-1,delay:1.4}},
            ],
        },
        {
            eventKey:0,
            checkTime:1,
            condition:[
                {wave:{index:7,step:5}},
            ],
            effect:[
                {extra:{open:-2}},
            ],
        },
    ],
}