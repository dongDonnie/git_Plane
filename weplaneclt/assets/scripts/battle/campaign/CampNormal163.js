var CampNormal163 = module.exports;

CampNormal163.data = {
    maps:[
        ["cx-b","cx-c","cx-c"],
        ["cx-c","cx-d","cx-c"],
        ["cx-d","cx-c","cx-e-bossditu"],
    ],
    monsterWaves:[
        {wave:{groups:[847,44,45],wait:0,delay:[0.3,1,2.5]},maps:{mapIndex:[0,1],mapSpeed:[400,800],mapScale:[1,1],mapLoop:[1,1]}},
        {wave:{groups:[851],wait:0,delay:[0]}},
        {wave:{groups:[848,849,41],wait:0,delay:[0.2,1,2.6]}},
        {wave:{groups:[850,29,32],wait:0,delay:[0,1,2.4]}},
       
        {wave:{groups:[852],wait:0,delay:[0],anime:1,isBOSS:1},maps:{mapIndex:[0,2],mapSpeed:[400,500],mapScale:[1,1],mapLoop:[1,0]}},
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
                {wave:{index:4,step:5}},
            ],
            effect:[
                {extra:{open:-2}},
            ],
        },
    ],
    
}