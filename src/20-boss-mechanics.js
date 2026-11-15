'use strict';
// HELL OF THE EMPEROR - boss attack tweaks (part of the former game.js; files load in numeric order, see index.html)
// ---------- boss mechanics ----------
const ST=mkA({n:'storm',w:.7,cnt:5,rad:22,dmg:22,delay:.9,spread:70,col:'#f55'});
(function(){
 const add=(i,ph,a)=>BOSS[i][ph].push(a),each=(i,fn)=>[...BOSS[i].k1,...BOSS[i].k2,...(BOSS[i].k3||[])].forEach(fn);
 each(0,a=>{if(a.n==='charge')a.trail='#f60';});
 each(1,a=>{if(a.n==='slam')a.rocks=8;});
 add(2,'k1',ST({cnt:3,col:'#ff8',wt:1,dmg:18}));add(2,'k2',ST({cnt:6,col:'#ff8',wt:2,dmg:20}));
 add(3,'k2',ST({cnt:5,col:'#c8f',wt:1,dmg:14,rad:18}));
 each(4,a=>{if(a.n==='slam')a.rocks=6;});add(4,'k2',SU({types:['wisp','wisp','wisp'],cnt:3,wt:1}));
 add(5,'k1',ST({cnt:4,col:'#e8e0ff',wt:1,dmg:16}));add(5,'k2',ST({cnt:7,col:'#e8e0ff',wt:2,dmg:18}));
 each(6,a=>{if(a.n==='slam')a.rocks=10;});add(6,'k2',SU({types:['shielder','shielder'],cnt:2,wt:1}));
 add(7,'k1',SU({types:['assassin'],cnt:2,wt:1}));add(7,'k2',ST({cnt:6,col:'#9f9',wt:2,dmg:18,rad:18}));
 each(8,a=>{if(a.n==='charge')a.trail='#f40';if(a.n==='slam')a.rocks=10;});add(8,'k2',ST({cnt:8,col:'#f60',wt:2,dmg:24,rad:24}));
 add(9,'k2',ST({cnt:6,col:'#ffe',wt:2,dmg:24}));add(9,'k3',ST({cnt:10,col:'#ffe',wt:3,dmg:26,spread:90}));
})();
// reorder into the story campaign only after every per-boss tweak above has been applied to the right boss
storyCampaign();

// quicker boss wind-ups: charges, thrusts and slashes come out much faster
for(const b of BOSS)for(const ph of ['k1','k2','k3'])if(b[ph])for(const a of b[ph]){if(a.n==='charge'){a.w*=.5;a.sp*=1.35;}else if(a.n==='thrust'){a.w*=.65;a.sp=(a.sp||200)*1.2;}else if(a.n==='slash')a.w*=.75;else if(a.n==='leap')a.w*=.75;else if(a.n==='slam')a.w*=.8;}
for(const k in ET)for(const a of ET[k].atks||[])if(a.n==='charge')a.w*=.7;
