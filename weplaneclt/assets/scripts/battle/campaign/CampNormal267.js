var CampNormal267 = module.exports;

CampNormal267.data = {
    maps:[
        ["cx-d","cx-c","cx-d"],
        ["cx-c","cx-d","cx-e-bossditu"],
    ],
    monsterWaves:[
        {wave:{groups:[905,559,560],wait:0,delay:[0.2,2.5,2.5]},maps:{mapIndex:[0],mapSpeed:[800],mapScale:[1],mapLoop:[1]}},
 
        
        {wave:{groups:[908,314],wait:0,delay:[0,1]}},   {wave:{groups:[907,26],wait:0,delay:[0,0]}},    {wave:{groups:[906,693,694],wait:0,delay:[0,0.5,1]}},
        {wave:{groups:[83],wait:0,delay:[0],anime:1,isBOSS:1},maps:{mapIndex:[1],mapSpeed:[600],mapScale:[1],mapLoop:[0]}},
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
                {wave:{index:3,step:8}},
            ],
            effect:[
                {extra:{open:-1,delay:1.4}},
            ],
        },
        {
            eventKey:0,
            checkTime:1,
            condition:[
                {wave:{index:4,step:3}},
            ],
            effect:[
                {extra:{open:-2}},
            ],
        },
    ],
}