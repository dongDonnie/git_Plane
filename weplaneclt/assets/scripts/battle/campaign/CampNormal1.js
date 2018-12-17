var CampNormal1 = module.exports;

CampNormal1.data = {
    maps:[
        ["bfc-a","bfc-a","bfc-a"],
        ["bfc-b-01hebing","bfc-b-01hebing","bfc-b-01hebing"],
    ],
    monsterWaves:[
        {wave:{groups:[565,566,573,635],wait:0,delay:[0.3,0.3,0.5,2.5]},maps:{mapIndex:[0,1],mapSpeed:[250,500],mapScale:[1,1],mapLoop:[1,1]}},
        {wave:{groups:[552,553,635,575,636,576],wait:0,delay:[0,0,0,2.5,3,3.5]}},
        {wave:{groups:[559,560,637],wait:0,delay:[0,0,0.2]}},
        {wave:{groups:[639,637,640,638],wait:0,delay:[0,1.5,3.2,3.6]}},
        {wave:{groups:[641,559,560],wait:0,delay:[0,0.5,0.5]}},
        {wave:{groups:[646],wait:0,delay:[0],anime:1}},
    ],
    monsterExtra:[23,24,25,559,560,552,1308,1309,1310,1311,1312,23,24,25,559,560,552,1308,1309,1310,1311,1312],
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
                {wave:{index:4,step:8}},
            ],
            effect:[
                {extra:{open:-1,delay:1}},
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