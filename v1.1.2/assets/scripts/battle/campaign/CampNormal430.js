var CampNormal430 = module.exports;

CampNormal430.data = {
    maps:[
        ["shamo","shamo","shamo"],
    
    ],
    monsterWaves:[
        {wave:{groups:[1051,993,994,882],wait:0,delay:[1,2,4,4]},maps:{mapIndex:[0],mapSpeed:[500],mapScale:[1],mapLoop:[1]}},
        
        {wave:{groups:[1029,42,43,37],wait:0,delay:[0,0.5,2,2.5]}},
        {wave:{groups:[1053,40,41,36,37],wait:0,delay:[0,1,2,3,4]}},
        {wave:{groups:[1052,44,45],wait:0,delay:[0,1,2]}},
        
        {wave:{groups:[1053,40,41,36,37],wait:0,delay:[0,1,2,3,4]}},
        {wave:{groups:[96],wait:0,delay:[0],anime:1,isBOSS:1},maps:{mapIndex:[0],mapSpeed:[500],mapScale:[1],mapLoop:[0]}},
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
                {extra:{open:-1,delay:1.4}},
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