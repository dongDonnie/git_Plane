var CampNormal9 = module.exports;

CampNormal9.data = {
    maps:[
        ["bfc-a","bfc-a","bfc-a"],
        ["tk-b","tk-b","tk-b"],
    ],
    monsterWaves:[
        {wave:{groups:[761,795,777,775],wait:0,delay:[0.3,1.2,2.4,3.2]},maps:{mapIndex:[0,1],mapSpeed:[400,600],mapScale:[1,1.2],mapLoop:[1,1]}},
        {wave:{groups:[761,794,772,796,778],wait:0,delay:[0.1,1.2,1.4,1.8,2.5]}},
        {wave:{groups:[764,795,772,764],wait:0,delay:[0.1,1.2,1.5,1.9]}},
        {wave:{groups:[771,419,765,416,779,765,773,762],wait:0,delay:[0.1,0.4,1,2,2.6,3.2,3.4,3.6]}},
        {wave:{groups:[792,795,798,794,797,764,762,775],wait:0,delay:[0.1,0.9,1.8,2.7,2.7,3,3.3,3.6]}},
        {wave:{groups:[794,798,792,795,797,792,766,761,778,766,762,778],wait:0,delay:[0.1,0.1,0.1,1.5,1.5,1.5,1.5,2.2,2.9,3.7,4.3,4.4]}},

    ],
    monsterExtra:[311,312,313,314,315,316,317],

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
       
    ],
}