'use strict';
// HELL OF THE EMPEROR - the story campaign and stage order (part of the former game.js; files load in numeric order, see index.html)
// ===== THE CAMPAIGN: invade the palace and end the corrupt emperor =====
// The route runs from the forest and marshes, under the hills and through the burning town, over the pass,
// through the walls, temple, dungeons and keep, the royal gardens and the inner palace to the throne room.
function storyCampaign(){
 // two new stages, each with its own guardian
 DUN.push({name:'THE OUTER WALLS',fl:['#4a4a52','#52525a'],sp:'#3a3a42',wt:'#141418',wf:'#5a5a66',we:'#9a9aaa',cloth:'#5a5a64',dark:'#3a3a44',acc:'#c03030',
   pool:['ashigaru','ashigaru','archer','archer','samurai','shielder','shielder','sniper','bandit','jailer','boar','centipede','centipede']},
  {name:'THE ROYAL GARDENS',fl:['#4a6a3a','#527440'],sp:'#3a5a2e',wt:'#141a10',wf:'#e8e4dc',we:'#ffffff',cloth:'#7a8aaa',dark:'#506080',acc:'#f0a0c0',
   pool:['ninja','ninja','monk','samurai','archer','crane','crane','kitsune','kitsune','assassin','priest','monkey']});
 ENV.push({k:'stone',liq:1,amt:.07,lc:['#141c26','#1e2a38','#6a8aa8']},{k:'grass',liq:1,amt:.07,lc:['#1e4a66','#2e6a8a','#9ad0f0'],wall:'palace'});
 const tiger=BOSS[4],moth=BOSS[3];
 // the war elephant: a wide armoured siege beast that does little but charge - bigger hitbox, heavier hits
 const charge=o=>CH(Object.assign({w:.75,sp:250,dur:1,dmg:30,rec:.7,dmin:30,pd:30,peril:true},o)),stomp=o=>SM(Object.assign({w:.9,rad:52,dmg:28,peril:true,rec:.8},o));
 BOSS.push(Object.assign({},tiger,{name:'THE WAR ELEPHANT',r:18,spd:(tiger.spd||40)*.85,pal:basePal('#7a7a84','#4a4a54','#c02020','#3a3a44','#9a9aa4'),
   k1:[charge({wt:3}),stomp({wt:1})],k2:[charge({wt:3,sp:280}),charge({wt:2,sp:300,dur:.8}),stomp({wt:1,rad:58})],k3:[charge({wt:4,sp:320,dur:1.1}),stomp({wt:2,rad:64,dmg:32})]}),
  Object.assign({},moth,{name:'TAMAMO, THE ILLUSIONIST',pal:basePal('#e8823a','#8a3a10','#fff0e0','#5a2a10'),k2:moth.k2.concat([SU({types:['kitsune','kitsune'],cnt:2,wt:2})])}));
 BLOOK.push({bw:11,skin:'#9a9a90',ar:'#7a7a72',ad:'#4a4a44',ac:'#3e8a5a',lg:'#5a5a54',head:'ape',wpn:'fists',back:null,big:1,fur:'#b0b0a8'},
  {bw:6,skin:'#f0d8c0',ar:'#e8823a',ad:'#8a3a10',ac:'#fff0e0',lg:'#5a2a10',head:'bun',wpn:'daggers',back:'wings',w1:'#ff9040',w2:'#fff0d0'});
 BSTYLE.push({c:'#a8b0a0',t:['WAR DRUMS','SIEGE BREAKER','RAMPAGE'],ph:[
   [{pat:'wall',cnt:11,sp:58,st:'big',col:'#a8b0a0'},{pat:'rain',cnt:4,col:'#3e8a5a',rad:18}],
   [{pat:'web',cnt:10,rings:2,sp:52,col:'#c8d0c0'},{pat:'wall',cnt:13,sp:62,st:'bounce',bn:1,col:'#a8b0a0'},{pat:'rain',cnt:5,col:'#3e8a5a',rad:18}],
   [{pat:'web',cnt:12,rings:3,sp:56,col:'#c8d0c0'},{pat:'orbitring',cnt:10,ow:2.4,orv:30,col:'#3e8a5a'},{pat:'gapring',cnt:24,gw:.42,sp:60,st:'big',col:'#a8b0a0'}]]},
  {c:'#ff9040',t:['FOX-FIRE','NINE TAILS','ILLUSORY BLAZE'],ph:[
   [{pat:'orbitring',cnt:8,ow:3,orv:30,col:'#ff9040'},{cnt:5,spread:1,sp:60,st:'seek',turn:1.6,seekT:1.8,col:'#ffb060'}],
   [{pat:'orbitring',cnt:9,ow:-3,orv:34,col:'#ff9040'},{pat:'spiral',arms:9,spin:.4,sp:62,st:'wave',col:'#fff0d0',burst:6,gap:.1},{pat:'lance',cnt:3,spread:.5,sp:220,col:'#ffd060'}],
   [{pat:'orbitring',cnt:12,ow:3.4,orv:36,col:'#ff9040'},{cnt:7,spread:1.4,sp:64,st:'seek',turn:2,seekT:2,col:'#ffb060'},{pat:'spiral',arms:9,spin:.45,sp:66,col:'#fff0d0',burst:9,gap:.09}]]});
 // the story order (old index of each stage) and its new names and story lines
 const ORDER=[0,4,8,3,6,10,5,1,2,11,7,9];
 const NAMES=['WHISPERING FOREST','MISTY RICE MARSH','SMUGGLERS CAVERNS','BURNING CASTLE TOWN','FROSTPEAK PASS','THE OUTER WALLS','THOUSAND BELL TEMPLE','IRON CELLARS','CRANE CASTLE','THE ROYAL GARDENS','JADE PALACE','THE THRONE ROOM'];
 const STORY=['THE MARCH ON THE CASTLE BEGINS UNDER THE BAMBOO','THE MARSHES GUARD THE CASTLE FLANK','SECRET TUNNELS RUN BENEATH THE HILLS','THE TOWN AT THE CASTLE FEET IS ABLAZE','THE COLD MOUNTAIN ROAD TO THE GATES',
  'BREACH THE RAMPARTS','THE CASTLE SHRINE GROUNDS','THE DUNGEONS BENEATH THE KEEP','THE HALLS OF THE KEEP','THE EMPEROR\'S PRIVATE GARDENS','THE GRAND INNER PALACE','THE EMPEROR AWAITS. END THIS'];
 const re=a=>{const c=ORDER.map(i=>a[i]);a.length=0;a.push(...c);};
 re(DUN);re(ENV);re(BOSS);re(BLOOK);re(BSTYLE);
 DUN.forEach((d,i)=>{d.name=NAMES[i];d.story=STORY[i];});
 BOSS[11].name='THE CORRUPT EMPEROR';
 // guardians get tougher by their place in the march, not by who they are
 const HP=[520,700,820,950,1100,1250,1350,1500,1650,1800,2100,2800];BOSS.forEach((b,i)=>b.hp=HP[i]);
 // hitboxes follow the body: the wide spider and elephant are much easier to hit (and to get trampled by)
 const BR={'ITOHIME, THE WIRE WEAVER':14,'THE JADE SERPENT':11,'THE WAR ELEPHANT':18,'TAMAMO, THE ILLUSIONIST':10};BOSS.forEach(b=>{if(BR[b.name])b.r=BR[b.name];});
 while(BMODES.length<DUN.length)BMODES.push(['dashes','blink','circle','chase']);
 BMODES[5]=['stampede','stampede','chase']; // the war elephant (outer walls) lives to charge
 ROMAN.push('XI','XII');}
// a boss's movement-mode shots are tinted with its own colour so every fight has one visual language
const bShot=(e,o)=>enemyShoot(e,Object.assign({sp:62,dmg:10,pd:8,col:'#f8c',cnt:1},o,e.boss?{col:bsty(e).c}:{}),Math.atan2(P.y-e.y,P.x-e.x));
// fire one of the boss's signature barrages (bursts are queued and fired over the next frames)
function bossBarrage(e,cfg){if(e.danmakuCast)return;bossPressure(e);const o=Object.assign({sp:62,dmg:9+2*e.phase,pd:8,cnt:1},cfg),n=o.burst||1;e.brq=e.brq||[];
 for(let i=0;i<n;i++)e.brq.push({t:i*(o.gap||.1),o});}
function tickBarrage(e,dt){if(!e.brq||!e.brq.length)return;for(const b of e.brq){b.t-=dt;if(b.t<=0){b.done=true;enemyShoot(e,b.o,Math.atan2(P.y-e.y,P.x-e.x));}}e.brq=e.brq.filter(b=>!b.done);}
// how close a boss gets when it hunts or walks toward you: near enough to pressure, never on top of you
const bossGap=e=>e.r+34;
function bossContact(e){if(P.iv<=0&&P.dash<=0&&Math.hypot(P.x-e.x,P.y-e.y)<e.r+6)hitPlayer(16*e.dm,e.x,e.y,{src:e,pd:20});}
function bossModes(e,dt,d,a){
 // constant background pressure
 // the boss's own signature barrages for this phase, faster each phase
 tickBarrage(e,dt);
 e.bgT=(e.bgT==null?1.5:e.bgT)-dt;if(e.bgT<=0&&!e.act){e.bgT=e.phase>=3?.6:e.phase===2?.8:1;const L=bsty(e).ph[Math.min(2,e.phase-1)];bossBarrage(e,L[(e.bgN=(e.bgN||0)+1)%L.length]);}
 e.modeT=(e.modeT==null?5:e.modeT)-dt;
 if(!e.mode){if(e.modeT>0||e.act)return false;const K=BKIT[e.name],k=pick((K&&K.modes)||BMODES[e.di]||['chase']);e.mode={k,t:0,n:0,ph:0,tt:0};txtFx(e.x,e.y,(K&&K.modeName&&K.modeName[k])||{chase:'HUNTING!',circle:'CIRCLING',dashes:'RUSH!',blink:'VANISH',stampede:'STAMPEDE!'}[k]||'','#f55');}
 const m=e.mode,sp=e.spd;m.t+=dt;m.tt-=dt;
 const end=()=>{e.mode=null;e.modeT=rnd(6,9)*(e.phase>=2?.75:1)*(e.enraged?.7:1)*((BKIT[e.name]&&BKIT[e.name].modeGap)||1);e.cd=.6;e.tele=0;return true;};
 if(BMODEFN[m.k])return BMODEFN[m.k](e,dt,d,a,m,end);
 if(m.k==='chase'){if(m.t>4.5)return end();const s=sp*2.1*(e.phase>=2?1.15:1),gap=bossGap(e);
  // hound you from just behind: close the distance fast, but stop short instead of standing on you
  if(d>gap){const v=Math.min(s,(d-gap)/dt);move(e,Math.cos(a)*v*dt,Math.sin(a)*v*dt,e.r);}
  else if(d<gap*.75){move(e,-Math.cos(a)*sp*dt,-Math.sin(a)*sp*dt,e.r);}
  else{const sa=a+Math.PI/2*e.sdir;move(e,Math.cos(sa)*sp*.8*dt,Math.sin(sa)*sp*.8*dt,e.r);}
  bossContact(e);
  if(m.tt<=0){m.tt=.22;projs.push(mkProj('e',e.x,e.y,a+Math.PI+rnd(-.6,.6),12,9*e.dm,{own:e,col:'#f64',r:3,life:2.6,pd:6}));if((m.n=(m.n+1))%3===0)bShot(e,{cnt:3,spread:.35,sp:95,col:'#f84'});}return true;}
 if(m.k==='circle'){if(m.t>5.5)return end();m.ang=(m.ang==null?Math.atan2(e.y-P.y,e.x-P.x):m.ang)+dt*(1.5+.3*e.phase)*e.sdir;const tx=P.x+Math.cos(m.ang)*85,ty=P.y+Math.sin(m.ang)*85,da=Math.atan2(ty-e.y,tx-e.x),dd=Math.hypot(tx-e.x,ty-e.y),s=Math.min(dd/dt,sp*3);
  move(e,Math.cos(da)*s*dt,Math.sin(da)*s*dt,e.r);if(m.tt<=0){m.tt=.3;bShot(e,{sp:110,col:'#fd4',st:'accel',cap:200});m.n++;if(m.n%4===0)bShot(e,{pat:'gapring',cnt:18,gw:.45,sp:55,col:'#f8c'});}return true;}
 if(m.k==='dashes'){const N=3+e.phase;if(m.n>=N)return end();
  if(m.ph===0){if(m.ph0==null){m.ph0=1;m.tt=.42-.05*e.phase;m.da=a;}e.tele=1;if(m.tt<=0){m.ph=1;m.tt=.26;m.ph0=null;e.tele=0;sfx('dash');}return true;}
  else{const s=400;move(e,Math.cos(m.da)*s*dt,Math.sin(m.da)*s*dt,e.r);bossContact(e);if(Math.random()<dt*30)projs.push(mkProj('e',e.x,e.y,m.da+Math.PI/2*(Math.random()<.5?1:-1),30,8*e.dm,{own:e,col:'#f64',r:2,life:1.6,pd:5}));
   if(m.tt<=0){m.ph=0;m.n++;bShot(e,{pat:'flower',cnt:12+e.phase*2,sp:58,col:'#f8c'});shake=Math.max(shake,3);}return true;}}
 // stampede (the war elephant): a long red-line telegraph, then a heavy charge across the arena that only stops at a
 // wall or after 1.4s. Hitting a wall sends out a shockwave ring and a shower of rubble. More charges each phase.
 if(m.k==='stampede'){const N=3+e.phase;if(m.n>=N)return end();
  if(m.ph===0){if(m.ph0==null){m.ph0=1;m.tt=.75-.08*e.phase;m.da=a;sfx('boss');txtFx(e.x,e.y-14,'TRUMPET!','#f84');}e.tele=2;m.da=m.da+(Math.atan2(P.y-e.y,P.x-e.x)-m.da)*Math.min(1,dt*1.2); // tracks you a little while winding up
   if(m.tt<=0){m.ph=1;m.tt=1.4;m.ph0=null;e.tele=0;sfx('dash');}return true;}
  const s=260+e.phase*35,ox=e.x,oy=e.y;move(e,Math.cos(m.da)*s*dt,Math.sin(m.da)*s*dt,e.r);bossContact(e);
  if(Math.random()<dt*40)particles.push({x:e.x-Math.cos(m.da)*e.r+rnd(-6,6),y:e.y-Math.sin(m.da)*e.r+rnd(-4,4),vx:-Math.cos(m.da)*30,vy:-Math.sin(m.da)*30-10,t:.5,col:'#9a8a70'});
  const wall=Math.hypot(e.x-ox,e.y-oy)<s*dt*.35;
  if(wall||m.tt<=0){if(wall){shake=Math.max(shake,8);sfx('break');fxRing(e.x,e.y,50,'#c8b890',.4);bShot(e,{pat:'gapring',cnt:16+e.phase*4,gw:.5,sp:60,st:'big',col:'#c8b890'});
     for(let i=0;i<3+e.phase*2;i++){const an=Math.random()*TAU,rr=rnd(20,90);dh.push({x:e.x+Math.cos(an)*rr,y:e.y+Math.sin(an)*rr,r:14,t:.9+i*.12,dur:.9+i*.12,dmg:14*e.dm,col:'#c8a060'});}}
   m.ph=0;m.n++;}
  return true;}
 if(m.k==='blink'){const N=3+e.phase;if(m.n>=N)return end();
  if(m.tt<=0){const r=e.room;let tx=e.x,ty=e.y;for(let k=0;k<20;k++){const an=Math.random()*TAU,rr=rnd(60,115),x=P.x+Math.cos(an)*rr,y=P.y+Math.sin(an)*rr;if(!blocked(x,y,e.r)&&x>r.x*T&&x<(r.x+r.w)*T&&y>r.y*T&&y<(r.y+r.h)*T){tx=x;ty=y;break;}}
   spark(e.x,e.y,'#c8f',16,90);e.x=tx;e.y=ty;spark(e.x,e.y,'#c8f',16,90);fxRing(e.x,e.y,24,'#c8f',.3);sfx('dash');m.n++;m.tt=.85-.08*e.phase;
   bShot(e,m.n%2?{pat:'gapring',cnt:20+e.phase*3,gw:.45,sp:60,col:'#c8f'}:{pat:'stream',cnt:6,sp:100,st:'accel',col:'#f8c'});}return true;}
 return end();}
