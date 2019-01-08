var CampNormal50 = module.exports;

CampNormal50.data = {
    maps:[
        ["tk-a","tk-a","tk-a"],
    ],
    monsterWaves:[
        {wave:{groups:[2000,2001,2002,2003,2004,2005],wait:0,delay:[3,9,12.5,18,22,26]},maps:{mapIndex:[0],mapSpeed:[100],mapScale:[1],mapLoop:[1]}},
        {wave:{groups:[89],wait:0,delay:[0],anime:1,isBOSS:1}},
    ],
    monsterExtra:[311,312,313,314,315,316,317,14,17,19,20,22,25,27,28,30,35,36,39,40,42,45,47,48,50,51,52,573,830,831,832,833,834,836,839,1066,1067,1069,1070,1072,1073,1074,1075,1077,1078],

    totalHint:[
        {
            checkTime:-1,
            condition:[
                {interval:13},
            ],
            effect:[
                {drop:10000},
            ]
        },
        {
            eventKey:0,
            checkTime:1,
            condition:[
                {wave:{index:0,step:6}},
            ],
            effect:[
                {extra:{open:-1,delay:2}},
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