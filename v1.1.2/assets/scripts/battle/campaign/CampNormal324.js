var CampNormal324 = module.exports;

CampNormal324.data = {
maps:[
    ["chengshixunhuan","chengshixunhuan","chengshixunhuan"],
],
monsterWaves:[
    {wave:{groups:[984,308,309],wait:0,delay:[0.2,1,2]},maps:{mapIndex:[0],mapSpeed:[600],mapScale:[1],mapLoop:[1]}},
  
    {wave:{groups:[982,882,793,833,795],wait:0,delay:[0,1,2,2,3,3]}},  
    {wave:{groups:[983,419,312,420,414],wait:0,delay:[0,1,2,3,4,5]}},
    {wave:{groups:[979,331,693,694],wait:0,delay:[0,1,2,2]}},  
    {wave:{groups:[983,419,312,420,414],wait:0,delay:[0,1,2,3,4,5]}},
    {wave:{groups:[982,882,793,833,795],wait:0,delay:[0,1,2,2,3,3]}},
    {wave:{groups:[980,981,792,796,793],wait:0,delay:[0,1,2,3,4]}},
    {wave:{groups:[81],wait:0,delay:[0],anime:1,isBOSS:1}},
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