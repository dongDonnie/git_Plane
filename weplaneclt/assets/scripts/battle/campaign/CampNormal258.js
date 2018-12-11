var CampNormal258 = module.exports;

CampNormal258.data = {
    maps:[
        ["bfc-a","bfc-a","bfc-a"],
        ["tk-b","tk-c","tk-d-ditu"],
        ["tk-e-ditu","tk-e-ditu","tk-e-ditu"],
    ],
    monsterWaves:[
        {wave:{groups:[40,408,800,30],wait:0,delay:[2,2,3,3]},maps:{mapIndex:[0,1],mapSpeed:[400,600],mapScale:[1,1],mapLoop:[1,0]}},
        {wave:{groups:[409,792,794,16,18],wait:0,delay:[0,1,1,2,2]}},
        {wave:{groups:[411,42,1182,1216,14],wait:0,delay:[0,0.5,1.5,1.5,2]}},
        {wave:{groups:[410,1207,1107,800],wait:0,delay:[0,0,1,2]},maps:{mapIndex:[0,2],mapSpeed:[400,600],mapScale:[1,1],mapLoop:[1,1]}},
      
        {wave:{groups:[412,690],wait:0,delay:[0,1]}},  {wave:{groups:[1437,795,798,1069],wait:0,delay:[0,0,0,1]}},
        {wave:{groups:[1438,792,794,796,798,800],wait:0,delay:[0,0.8,1.6,2.4,3,3.5]}},
    ],
    monsterExtra:[23,24,25,1313,1314,1315,1316,1317],
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
                {wave:{index:2,step:8}},
            ],
            effect:[
                {extra:{open:-1,delay:1.1}},
            ],
        },
        {
            eventKey:0,
            checkTime:1,
            condition:[
                {wave:{index:3,step:6}},
            ],
            effect:[
                {extra:{open:-2}},
            ],
        },
    ],
}