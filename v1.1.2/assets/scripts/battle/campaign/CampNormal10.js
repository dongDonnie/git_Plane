var CampNormal10 = module.exports;

CampNormal10.data = {
    maps:[
        ["bfc-boss-01","bfc-boss-01","bfc-boss-01"],
    ],
    monsterWaves:[
        {wave:{groups:[803,765,771,774,35,42,43,27],wait:0,delay:[0.5,0.5,2,2.5,3.5,4.5,5,5.2]},maps:{mapIndex:[0],mapSpeed:[500],mapScale:[1],mapLoop:[1]}},
        {wave:{groups:[103],wait:0,delay:[0],anime:1,isBOSS:1}},
    ],
    monsterExtra:[23,24,25,1313,1314,1315,1316,1317],

    totalHint:[
        {
            checkTime:-1,
            condition:[
                {interval:12},
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
                {wave:{index:1,step:5}},
            ],
            effect:[
                {extra:{open:-2}},
            ],
        },

    ],
}