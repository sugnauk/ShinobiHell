'use strict';
// HELL OF THE EMPEROR - dungeon themes (part of the former game.js; files load in numeric order, see index.html)
// ---------- dungeon themes ----------
const DUN=[
 {name:'WHISPERING BAMBOO',fl:['#3e4b2e','#465634'],sp:'#2f3b22',wt:'#15180f',wf:'#4a4f3c',we:'#7a8260',cloth:'#6a5a3a',dark:'#4a3d28',acc:'#a03030',pool:['ashigaru','archer','ashigaru','samurai']},
 {name:'IRON CELLARS',fl:['#2e2e36','#34343c'],sp:'#22222a',wt:'#101014',wf:'#4a4a56',we:'#74748a',cloth:'#5a5a64',dark:'#3a3a44',acc:'#8a6a30',pool:['ashigaru','samurai','archer','brute']},
 {name:'CRANE CASTLE',fl:['#7a6a4a','#85754f'],sp:'#5e5038',wt:'#1a1210',wf:'#4a3228',we:'#8a6a4a',cloth:'#7a3a3a',dark:'#4a2020',acc:'#d0a040',pool:['samurai','archer','ninja','samurai']},
 {name:'BURNING ESTATE',fl:['#4a2a22','#53302a'],sp:'#3a1e18',wt:'#140a08',wf:'#6a3420',we:'#e08030',cloth:'#8a4020',dark:'#5a2810',acc:'#f0a030',pool:['ninja','samurai','monk','archer']},
 {name:'MISTY RICE MARSH',fl:['#2c4a44','#32524b'],sp:'#1e3a34',wt:'#0c1614',wf:'#2e5a52',we:'#5aa090',cloth:'#3a6a5a',dark:'#244a40',acc:'#a0d0c0',pool:['brute','ninja','archer','monk']},
 {name:'THOUSAND BELL TEMPLE',fl:['#7a4a2a','#845230'],sp:'#5e3820',wt:'#1a0e08',wf:'#8a2a24',we:'#d05040',cloth:'#c0a040',dark:'#806020',acc:'#e8e0c0',pool:['monk','samurai','brute','monk']},
 {name:'FROSTPEAK SHRINE',fl:['#8a9ab0','#94a4ba'],sp:'#6a7a90',wt:'#202838',wf:'#5a6a85',we:'#b8c8e0',cloth:'#5a6a8a',dark:'#3a4a6a',acc:'#e0e8f8',pool:['samurai','ninja','brute','archer']},
 {name:'JADE PALACE',fl:['#a8b6c4','#b2c0ce'],sp:'#8896a8',wt:'#283244',wf:'#6a7c96',we:'#e0eaf8',cloth:'#7a8aaa',dark:'#506080',acc:'#f0f0ff',pool:['ninja','monk','samurai','archer']},
 {name:'SPIRIT CAVERNS',fl:['#3a2a4a','#42304e'],sp:'#2a1c38',wt:'#0e0814',wf:'#4a2a5a',we:'#8a5aa0',cloth:'#6a3a7a',dark:'#3a1a4a',acc:'#c060e0',pool:['brute','monk','ninja','samurai']},
 {name:'CRIMSON PAGODA',fl:['#5a1e28','#64222e'],sp:'#46141c',wt:'#0c0608',wf:'#8a2a34',we:'#e0b040',cloth:'#8a2030',dark:'#4a0e18',acc:'#e0b040',pool:['samurai','brute','monk','ninja','archer']},
];
const ROMAN=['I','II','III','IV','V','VI','VII','VIII','IX','X'];
// environments: floor texture, liquid (1 water slows, 2 lava burns, 3 poison burns, 4 ice, 5 blood slows), liquid colours [deep, mid, shine], wall dressing
const ENV=[
 {k:'grass',liq:1,amt:.05,lc:['#1e4a66','#2e6a8a','#9ad0f0'],wall:'bamboo'},
 {k:'stone',liq:1,amt:.03,lc:['#141c26','#1e2a38','#6a8aa8']},
 {k:'planks',liq:1,amt:.015,lc:['#1a2a3a','#28405a','#8ab0d0'],wall:'shoji',fl:['#8a8a4e','#929254'],sp:'#6a6a3a'},
 {k:'ember',liq:2,amt:.04,lc:['#a02808','#e05010','#ffd060']},
 {k:'swamp',liq:1,amt:.22,lc:['#1e4a48','#2e6a62','#a8e8c8'],wall:'hedge',fl:['#34452a','#3b4d2e'],sp:'#26341e'},
 {k:'temple',liq:1,amt:.03,lc:['#1a3a5a','#2a5a80','#a0d8f8'],wall:'lacquer',roof:['#2e4a40','#4a6a5a'],fl:['#9a9282','#a29a8a'],sp:'#7a7262'},
 {k:'snow',liq:4,amt:.06,lc:['#7aa8d0','#a8d0f0','#ffffff'],wall:'snow'},
 {k:'marble',liq:1,amt:.08,lc:['#2a6a9a','#4a90c0','#e0f4ff'],wall:'palace',fl:['#7a9a8a','#82a292'],sp:'#5a7a6a'},
 {k:'cave',liq:3,amt:.06,lc:['#3a1a50','#6a2a8a','#d080ff']},
 {k:'blood',liq:5,amt:.06,lc:['#3a0810','#6a1020','#e04050'],wall:'lacquer',roof:['#1a1418','#3a2a2e']},
];
const liqAt=(x,y)=>{if(!map||!map.liq)return 0;const tx=(x/T)|0,ty=(y/T)|0;if(tx<0||ty<0||tx>=MW||ty>=MH)return 0;return map.liq[ty*MW+tx];};
ENV.forEach((e,i)=>{if(e.fl)DUN[i].fl=e.fl;if(e.sp)DUN[i].sp=e.sp;});
