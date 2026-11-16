'use strict';
// Each signature specifies a beat count, spacing, and its own projectile geometry.
// The shared aimed follow-up occupies the player's line and leads sustained lateral movement.
const danmaku=(name,beats,interval,fire)=>({name,beats,interval,fire});
const dShot=(e,o,a,speed,opts={})=>bsh(e,o.x,o.y,a,speed,8,{life:3.8,r:2,col:BC.fix2,...opts});
const dRing=(e,o,count,speed,off,opts)=>{for(let i=0;i<count;i++)dShot(e,o,off+i*TAU/count,speed,opts);};
const dFan=(e,o,a,count,spread,speed,opts)=>{
 for(let i=0;i<count;i++)dShot(e,o,a+(i/(count-1)-.5)*spread,speed,opts);
};
const dOffset=(o,a,r)=>({x:o.x+Math.cos(a)*r,y:o.y+Math.sin(a)*r});
function dPoint(e,o,a,r){
 const p=dOffset(o,a,r);
 return freeSpot(e,p.x,p.y,4);
}
function dTell(e,o,col=BC.fix2,r=15,t=.5){
 mark({k:'c',x:o.x,y:o.y,r,t,col,quiet:true,src:e});
}
function dWall(e,o,a,count,spacing,gap,speed,opts){
 for(let i=0;i<count;i++){
  if(i===gap)continue;
  dShot(e,dOffset(o,a+Math.PI/2,(i-(count-1)/2)*spacing),a,speed,opts);
 }
}
const dShade={spr:'shuriken',col:'#c8bfd8'};
const dGold={spr:'bead',col:'#ffe0a1'};
const dSilk={spr:'silk',col:'#e0ece2'};
const dLance={spr:'spear',col:'#d0dcf9'};
const dVoid={spr:'scale',col:BC.cor2};

const BOSS_DANMAKU={
 'AKAGANE, THE RED OX':[
  danmaku('WAR DRUM TATTOO',4,.34,(e,s,i)=>{
   // Alternating heavy and light drum circles catch a dodge made on every first beat.
   dRing(e,s.o,i%2?18:12,54+i*12,s.a+i*.19,{spr:'drum',col:'#eab86b',r:i%2?2:4});
  }),
  danmaku('FALLING STANDARDS',3,.43,(e,s,i)=>{
   // Three planted standards take turns covering their neighbours with crossfire.
   const a=s.a+(i-1)*1.16,o=dPoint(e,s.p,a+Math.PI,102);
   dTell(e,o,'#ef845b',17,.35);
   for(let arm=0;arm<4;arm++)for(const offset of [-.23,0,.23]){
    const direction=a+arm*Math.PI/2+offset;
    dShot(e,o,direction,0,{st:'hang',wait:.35,ha:direction,csp:71,col:'#ffd3a1'});
   }
  })
 ],
 'THE WHITE TIGER':[
  danmaku('REED SCISSORS',3,.29,(e,s,i)=>{
   // Opposing crescents turn inward around the player instead of leaving a side lane.
   for(const dir of [-1,1]){
    const o=dPoint(e,s.o,s.a+dir*1.22,53+i*11),a=aimAt(o)+dir*.26;
    dFan(e,o,a,5,.94,78+i*8,{spr:'blade',st:'curve',curve:-dir*.65,col:'#98e1d8'});
   }
  }),
  danmaku('PAWPRINT AMBUSH',4,.36,(e,s,i)=>{
   const o=dPoint(e,s.p,s.a+Math.PI/2,(i-1.5)*47);
   dTell(e,o,'#a5dfcf',13,.62);
   // Small fixed pawprints erupt in the order they were placed.
   for(let j=0;j<8;j++){
    const a=s.a+j*TAU/8+i*.23;
    dShot(e,o,a,0,{st:'hang',wait:.62,ha:a,csp:67,spr:'blade',col:'#addfd9'});
   }
  })
 ],
 'TSUCHIGUMO, EARTH SPIDER':[
  danmaku('THE SILK LOOM',3,.4,(e,s,i)=>{
   // Opposite looms leave temporary strands that change the next dodge lane.
   const a=s.a+i*TAU/3,o=dPoint(e,s.p,a,108);
   for(let j=-3;j<=3;j++){
    const to=dOffset(s.p,a+Math.PI/2,j*22);
    dShot(e,o,aimAt(o,to.x,to.y),91,{...dSilk,st:'stick',sd:72+Math.abs(j)*12,life:2.5});
   }
  }),
  danmaku('VENOM BROOD',3,.28,(e,s,i)=>{
   // A sparse brood becomes dense only when each pod splits downstream.
   dRing(e,s.o,6,52+i*8,s.a+i*.34,{st:'split',splitT:.68+i*.18,col:BC.haz,spr:'venom',r:3});
  })
 ],
 'LADY HOTARU':[
  danmaku('PAPER WINDMILL',5,.23,(e,s,i)=>{
   const a=s.a+i*.47;
   for(let arm=0;arm<4;arm++)dFan(e,s.o,a+arm*Math.PI/2,3,.27,69+i*5,{spr:'charm',st:'wave',wa:21,wf:7,col:'#ffe1b5'});
  }),
  danmaku('FIREFLY BLOOM',4,.27,(e,s,i)=>{
   // Successive rings curve in opposite directions, braiding the gaps.
   dRing(e,s.o,13,54+i*6,s.a+i*.24,{spr:'ember',st:'curve',curve:(i%2?1:-1)*(.52+i*.11),col:'#ffb073'});
  })
 ],
 'THE RONIN SEVEN':[
  danmaku('SEVEN STANCES',4,.29,(e,s,i)=>{
   for(let j=0;j<7;j++){
    const a=s.a+j*TAU/7,o=dPoint(e,s.o,a,22+i*9);
    dShot(e,o,a+i*.14,78,{spr:'blade',col:R7[j].c});
    dShot(e,o,a-i*.17-.35,107,{spr:'blade',col:R7[j].c});
   }
  }),
  danmaku('DRAW AND COUNTERDRAW',4,.31,(e,s,i)=>{
   // Staggered sword cuts from whichever ronin are actually in the arena.
   const members=R7K.active(e).filter(m=>!m.dead);
   const o=members[i%members.length]||s.o,a=aimAt(o);
   dWall(e,o,a+i*.09,6,12,i%6,111,{spr:'blade',col:'#ffd1e6',life:2.1});
   dFan(e,o,a+Math.PI,3,1.14,64,{spr:'blade',col:'#bbd8f3'});
  })
 ],
 'TETSUO THE GUNSMITH':[
  danmaku('RICOCHET BATTERY',3,.39,(e,s,i)=>{
   const o=e.cannons?.[i%e.cannons.length]||s.o;
   dFan(e,o,aimAt(o),5,1.48,103,{spr:'ball',st:'bounce',bn:2,r:4,life:4.7,col:'#c0c6d2'});
  }),
  danmaku('SLOW MATCH FIELD',3,.45,(e,s,i)=>{
   // Visible mines detonate in a checkerboard cadence across the previous player position.
   for(let j=-1;j<=1;j++){
    const o=dPoint(e,dOffset(s.p,s.a+Math.PI/2,j*49),s.a,(i-1)*52);
    if(dist(o,P)<28)continue;
    const fuse=.85+i*.35+j*.15;
    dTell(e,o,'#ffbb71',11,fuse);
    dShot(e,o,0,0,{st:'mine',fuse,col:'#ffd09a',spr:'ball',r:3});
   }
  })
 ],
 'THE THOUSAND-BELL ABBOT':[
  danmaku('SYNCOPATED PEALS',4,.39,(e,s,i)=>{
   const o=e.bells?.[(s.turn+i*2)%e.bells.length]||s.o;
   dRing(e,o,i%2?14:20,i%2?103:55,s.a+i*.42,{...dGold,r:i%2?2:3});
  }),
  danmaku('INWARD TOLL',3,.42,(e,s,i)=>{
   // A collapsing circle with gaps on opposite sides, rotated with each toll.
   for(let j=0;j<16;j++){
    if((j+i*2)%8<2)continue;
    const a=s.a+j*TAU/16,o=dPoint(e,s.p,a,113-i*11);
    dShot(e,o,a+Math.PI,83+i*5,{...dGold,life:2.6});
   }
  })
 ],
 'ONIKUMA, THE JAILER':[
  danmaku('RETURNING CHAINS',3,.34,(e,s,i)=>{
   // Heavy spokes come back along their original angles after the outbound sweep.
   dRing(e,s.o,9,115,s.a+i*.31,{st:'boom',bT:1.7,spr:'chainlink',r:3,col:'#b4bed2',life:3.1});
  }),
  danmaku('LOCKDOWN ZIPPER',4,.32,(e,s,i)=>{
   const a=s.a+Math.PI/2*(i%2),o=dPoint(e,s.p,a+Math.PI,115);
   dTell(e,o,'#c6b3ab',12,.48);
   for(let j=-4;j<=4;j++){
    if(j===(i%3-1)*2)continue;
    dShot(e,dPoint(e,o,a+Math.PI/2,j*17),a,110,{st:'lance',wait:.22+Math.abs(j)*.1,spr:'shackle',col:'#dfccab'});
   }
  })
 ],
 'KAGE, THE SHINOBI MASTER':[
  danmaku('SHADOW RELAY',4,.32,(e,s,i)=>{
   const o=dPoint(e,s.p,s.a+i*1.8,104);
   dTell(e,o,'#c1adf2',12,.33);
   dFan(e,o,aimAt(o),5,.72,102,{...dShade,st:'zig',zT:.28,zA:.34});
  }),
  danmaku('CROSSED KUNAI SEALS',3,.38,(e,s,i)=>{
   // Delayed parallel blades form two crossing diagonals, fired in alternating order.
   for(const dir of [-1,1]){
    const a=s.a+dir*Math.PI/4,o=dPoint(e,s.p,a+Math.PI,102);
    for(let j=-3;j<=3;j++){
     if(j===dir*(i-1))continue;
     dShot(e,dPoint(e,o,a+Math.PI/2,j*17),a,152,{st:'lance',wait:.42+(j*dir+3)*.045,spr:'kunai',col:'#eee3ff'});
    }
   }
  })
 ],
 'THE NINE-TAILED KITSUNE':[
  danmaku('NINE TAIL WEAVE',5,.24,(e,s,i)=>{
   // Nine drifting tails follow sine-wave paths with two alternating amplitudes.
   for(let j=0;j<9;j++)dShot(e,s.o,s.a+j*TAU/9+i*.17,61+i*5,{st:'wave',wa:j%2?34:17,wf:6,spr:'wisp',col:'#e0b7ff'});
  }),
  danmaku('MOON MIRAGE',3,.46,(e,s,i)=>{
   const base=s.a+i*TAU/3;
   for(let j=0;j<3;j++){
    const o=dPoint(e,s.p,base+j*TAU/3,105),a=aimAt(o);
    if(j===0){dTell(e,o,'#ffe2a8');dFan(e,o,a,5,.9,68,{st:'seek',turn:.7,seekT:.9,spr:'wisp',col:'#ffc990'});}
    else for(let k=-2;k<=2;k++)fakeShot(e,o.x,o.y,a+k*.21,68,{col:'#c2a9ff',life:2.2});
   }
  })
 ],
 'LORD KUROGANE':[
  danmaku('CAVALRY ECHELON',4,.31,(e,s,i)=>{
   // An oblique formation advances in three ranks with a flank that changes sides.
   const a=s.a+.58*(i%2?1:-1),o=dPoint(e,s.p,a+Math.PI,122-i*7);
   dWall(e,o,a,8,21,i%2?5:2,101+i*10,{spr:'rider',r:4,col:'#c9b584',life:2.5});
  }),
  danmaku('LANCE PARADE',4,.33,(e,s,i)=>{
   const a=s.a+i*Math.PI/2,o=dPoint(e,s.p,a+Math.PI,108);
   for(let j=-2;j<=2;j++){
    const lanc=dPoint(e,o,a+Math.PI/2,j*23);
    dShot(e,lanc,a,160,{...dLance,st:'lance',wait:.33+(2-Math.abs(j))*.12,life:2.3});
    dShot(e,lanc,a+Math.PI,57,{spr:'blade',col:'#e0bd84'});
   }
  })
 ],
 'THE CORRUPT EMPEROR':[
  danmaku('IMPERIAL SEAL',4,.32,(e,s,i)=>{
   // Each side of a square fires inward in clockwise order, leaving a shifting break.
   const a=Math.PI/4+i*Math.PI/2,o=dPoint(e,s.p,a+Math.PI,118);
   for(let j=-4;j<=4;j++){
    if(j===i-2)continue;
    const p=dPoint(e,o,a+Math.PI/2,j*22);
    dShot(e,p,a,65,{...dVoid,st:'accel',acc:1.05,cap:156,life:3.4});
   }
  }),
  danmaku('VOID PARALLAX',4,.32,(e,s,i)=>{
   // Counter-rotating rings occupy different depths and speeds.
   const a=s.a+i*.23;
   dRing(e,s.o,11,75+i*5,a,{...dVoid,st:'curve',curve:.72});
   dRing(e,s.o,11,52+i*5,a+.15,{...dVoid,st:'curve',curve:-.93,col:'#f49bde'});
  })
 ]
};

function danmakuOrigin(e){
 // A squad or airborne boss can still mount a survival volley from a visible floor source.
 const member=e.r7&&R7K.active(e).find(m=>!m.dead);
 const a=member||e;
 if(!a.ghost&&!a.air&&!a.hid&&dist(a,P)>34&&!blocked(a.x,a.y,4))return {x:a.x,y:a.y};
 return dPoint(e,P,aimAt(e)+Math.PI+(e.danmakuTurn||0)*.61,100);
}
function tickDanmaku(e,dt){
 const patterns=BOSS_DANMAKU[e.name];
 if(!patterns||e.dead||!e.kitOn)return;
 const event=e.EV,survival=!!(event&&e.EVdef?.survival);
 const sheltered=e.stag>0||e.recover>0||e.downT>0||e.stunT>0||(!survival&&(e.air||e.hid));
 if(e.danmakuContext!==event){
  e.danmakuContext=event;e.danmakuCast=null;e.danmakuClock=survival?1.15:2.3;
 }
 if(sheltered||(event&&!survival)||(survival&&e.storm<1.2)){e.danmakuCast=null;return;}
 const density=BHK(),cap=Math.round((survival?245:185)*density);
 const hasSpace=()=>eShots()<cap-30;
 let cast=e.danmakuCast;
 if(!cast){
  e.danmakuClock=(e.danmakuClock??2.3)-dt;
  if(e.danmakuClock>0||!hasSpace())return;
  const turn=e.danmakuTurn||0,pattern=patterns[turn%2],o=danmakuOrigin(e);
  cast=e.danmakuCast={pattern,turn,o,p:{x:P.x,y:P.y},a:aimAt(o),i:0,next:.60};
  e.danmakuTurn=turn+1;
  dTell(e,o);sfx('tool');
  // Searchable tells use the same names shown in the guide.
  say(e,pattern.name,'#ffe5ab',.78);
 }
 cast.next-=dt;
 if(cast.next>0)return;
 const {pattern,o}=cast;
 if(cast.i===pattern.beats){
  if(hasSpace()){
   // Fire late enough to catch a player streaming sideways through the first wave.
   const a=aimAt(o),travelLead=clamp(dist(o,P)*.43,18,64);
   const lead=aimAt(o,P.x+(P.mvx||0)*travelLead,P.y+(P.mvy||0)*travelLead);
   dRing(e,o,survival?16:12,66,a+cast.turn*.29);
   dShot(e,o,a,124,{col:BC.aim});
   if(Math.abs(angDiff(lead,a))>.07)dShot(e,o,lead,118,{col:BC.aim2});
  }
  e.danmakuCast=null;e.danmakuClock=(survival?1.15:3.1)/Math.sqrt(density);
  return;
 }
 if(!hasSpace()){cast.next=.2;return;}
 pattern.fire(e,cast,cast.i++);
 cast.next=cast.i===pattern.beats?.34:pattern.interval/Math.sqrt(density);
}

{const base=bossKitTick;bossKitTick=function(e,dt,d){
 const result=base(e,dt,d);
 if(result)tickDanmaku(e,dt);
 return result;
};}
for(const [name,patterns] of Object.entries(BOSS_DANMAKU)){
 const kit=BKIT[name];
 kit.guide=[...(kit.guide||[]),...patterns.map(p=>'SIGNATURE: '+p.name)];
}
