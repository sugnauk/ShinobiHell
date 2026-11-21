'use strict';
const SHOPX=1.25; // shop prices (raised 25% in 0.6.2)
// HELL OF THE EMPEROR - rooms, props, shop, shrines, traps (part of the former game.js; files load in numeric order, see index.html)
// ---------- rooms, props, shop, shrines, traps ----------
const ROOMCOL={treasure:'#fd4',shop:'#4cf',shrine:'#c6f',rest:'#6f6',elite:'#f84',trap:'#f44',altar:'#f33',ambush:'#f66',challenge:'#fc4'};
const ROOMORDER=['combat','elite','treasure','shop','ambush','rest','challenge','shrine','altar','elite','trap','combat','combat'];
function spotIn(r){let x,y,tries=0;do{x=ri(r.x+1,r.x+r.w-2);y=ri(r.y+1,r.y+r.h-2);tries++;}while((!map.t[y*MW+x]||(map.liq[y*MW+x]&&tries<30))&&tries<40);return {x:x*T+8,y:y*T+8};}
// ---- the shop: one relic purchase per stage, plus gear, enchants and potions ----
const SHOPLINES=['WELCOME, TRAVELLER','FINE WARES FOR A FINE WARRIOR','GOLD SPEAKS LOUDER THAN STEEL','EVERYTHING HERE HAS A STORY','MIND THE BOSS AHEAD - BUY WISELY'];
const relicShopOpen=()=>R.relicShopDepth!==relicTradeDepth()&&relicTradeAvailable(0,2,['rez']);
function stockRelics(c,r,di){
 props=props.filter(p=>p.room!==r||!p.relicStand);
 if(!relicShopOpen())return;
 const it=randItem(['rez'],0,2);
 props.push({k:'pedestal',relicStand:true,x:c.x,y:c.y+10,room:r,item:it.id,price:Math.round(SHOPX*[35,60,100][it.r]*(1+.15*di)),name:it.name});
}
function roomCenter(r){return {x:(r.x+(r.w>>1))*T+8,y:(r.y+(r.h>>1))*T+8};}
function dressBossApproach(r){
 const y=(r.y+r.h/2)*T,x=(r.x+r.w-.55)*T;
 for(const side of [-1,1])props.push({k:'doorpost',x,y:y+side*26,used:true,room:r,gate:'boss'});
 props.push({k:'entrancePlaque',x:x-25,y:y-22,used:true,room:r,gate:'boss'});
}
function dressShopEntrance(r){
 const index=map.rooms.indexOf(r),c=roomCenter(r);
 let best=null,score=Infinity;
 for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++){
  const i=y*MW+x;
  if(!map.t[i]||map.liq[i]||map.roomOf[i]!==index)continue;
  const exits=[[1,0],[-1,0],[0,1],[0,-1]].filter(([dx,dy])=>{
   const nx=x+dx,ny=y+dy,v=ny*MW+nx;
   return nx>0&&ny>0&&nx<MW-1&&ny<MH-1&&map.t[v]&&!map.liq[v]&&map.roomOf[v]<0;
  });
  for(const [dx,dy] of exits){
   const wx=(x+.5)*T,wy=(y+.5)*T,d=Math.hypot(wx-c.x,wy-c.y);
   if(d<score){score=d;best={x:wx,y:wy,dx,dy};}
  }
 }
 if(!best)return;
 const {x,y,dx,dy}=best;
 for(const side of [-1,1]){
  const wx=x-dy*side*14,wy=y+dx*side*14;
  if(!solid(wx,wy))props.push({k:'doorpost',x:wx,y:wy,used:true,room:r,gate:'shop'});
 }
 props.push({k:'entrancePlaque',x,y,used:true,room:r,gate:'shop'});
}
function populateRoom(r,di){
 const th=DUN[di],c=roomCenter(r);
 const addE=(n,awake)=>{for(let k=0;k<n;k++){const s=spotIn(r),e=mkEnemy(pick(th.pool),s.x,s.y,r,di);if(awake)e.awake=true;enemies.push(e);}};
 switch(r.type){
  case 'elite':enemies.push(mkElite(pick(th.pool.filter(t=>t!=='wisp')),c.x,c.y,r,di));addE(ri(2,3));break;
  case 'treasure':props.push({k:'chest',x:c.x,y:c.y,room:r});addE(ri(1,2));break;
  case 'altar':{const ck=pick(Object.keys(CURSES));props.push({k:'altar',x:c.x,y:c.y,room:r,col:CURSES[ck].c,curse:true,ck});addE(ri(1,2));break;}
  case 'ambush':r.ev={k:'ambush',state:0};addE(2);break;
  case 'challenge':r.ev={k:'challenge',state:0};props.push({k:'gong',x:c.x,y:c.y,room:r});break;
  case 'shop':{dressShopEntrance(r);props.push({k:'merchant',x:c.x,y:c.y-22,room:r,line:pick(SHOPLINES)});stockRelics(c,r,di);
   // second row: a weapon from your family, an enchant, a potion, and a reroll stand
   {const g=mkGear('wpn',tierFor(di,1),false,Math.random()<.35?3:2);props.push({k:'pedestal',x:c.x-39,y:c.y+38,room:r,gear:g,price:Math.round(SHOPX*(g.q===3?180:g.q===2?110:60)*(1+.2*di)),name:g.name});}
   if(!prologueLoot()){const en=mkEnch();props.push({k:'pedestal',x:c.x-13,y:c.y+38,room:r,ench:en,price:Math.round(SHOPX*90*(1+.2*di)),name:'ENCHANT '+ENCH.find(x=>x.k===en.k).n});}
   props.push({k:'pedestal',x:c.x+13,y:c.y+38,room:r,heal:true,price:Math.round(SHOPX*60*(1+.2*di)),name:'HP POTION'});
   if(relicShopOpen())props.push({k:'pedestal',x:c.x+39,y:c.y+38,room:r,reroll:true,price:Math.round(SHOPX*25*(1+.2*di)),name:'REROLL THE RELIC'});break;}
  case 'shrine':{const gk=pick(Object.keys(GODS));props.push({k:'altar',x:c.x,y:c.y,room:r,col:GODS[gk].c,god:gk});break;}
  case 'rest':props.push({k:'spring',x:c.x,y:c.y,room:r});break;
  case 'trap':{const n=ri(20,30)+di*2;for(let k=0;k<n;k++){const tx=ri(r.x+1,r.x+r.w-2),ty=ri(r.y+1,r.y+r.h-2);if(map.t[ty*MW+tx]&&!traps.some(t=>t.tx===tx&&t.ty===ty))traps.push({tx,ty,ph:((tx+ty)%3)*1.07});}addE(ri(2,3));break;}
  default:addE(ri(4,6)+Math.floor(di/3)+(r.w*r.h>250?1:0));if(R.asc&&Math.random()<.12*R.asc){const s=spotIn(r);enemies.push(mkElite(pick(th.pool.filter(t=>t!=='wisp')),s.x,s.y,r,di));}
 }
}
function trapState(t){const c=(time+t.ph)%3.2;return c<2?0:c<2.6?1:2;}
function nearProp(){if(!P)return null;let best=null,bd=22;for(const p of props){if(p.used||p.sold||p.k==='merchant')continue;const d=dist(p,P);if(d<bd){bd=d;best=p;}}return best;}
function interact(){
 {const b=nearBag();if(b&&b.items.length){takeAll(b);return;}}
 if(portal&&!portal.pending&&dist(portal,P)<20){if(R.training){finishTraining();return;}if(R.di>=DUN.length-1)finishRun(true);else openMaster();return;}
 const p=nearProp();if(!p)return;
 if(p.k==='chest'){
  p.used=true;p.openedAt=time;sfx('pickup');
  const items=Math.random()<RELIC_CHEST_CHANCE?[{t:'relic',id:randItem(['rez'],0,2).id}]:bagContents(1,false);
  if(!prologueLoot()){
   if(Math.random()<.35)items.push(mkEnch());
   if(Math.random()<.40)items.push({t:'scroll',regular:true});
  }
  pickups.push({x:p.x,y:p.y+6,k:'bag',tier:10,items,t:0,z:2,vx:0,vy:0,vz:75});
  for(let i=0;i<5;i++)dropPickup(p.x,p.y,'sen',Math.round(rnd(3,6)*(1+R.di*.3)*S.sen));
  if(Math.random()<.22){setToast('AMBUSH!','#f55',2);for(let i=0;i<3+Math.floor(R.di/3);i++){const a=i/4*TAU,x=p.x+Math.cos(a)*40,y=p.y+Math.sin(a)*40;if(blocked(x,y,6))continue;const e=mkEnemy(pick(DUN[R.di].pool),x,y,p.room,R.di);e.awake=true;enemies.push(e);spark(x,y,'#f55',8,60);}}
 }else if(p.k==='spring'){p.used=true;P.hp=Math.min(S.maxhp,P.hp+S.maxhp*.35);sfx('heal');setToast('THE SPRING RESTORES YOU','#6f6',2);fxRing(P.x,P.y,24,'#6f6',.4);}
 else if(p.k==='pedestal'){if((p.relicStand||p.reroll)&&!relicShopOpen())return;
  if(p.relicStand&&relicMaxed(p.item)){setToast('RELIC MAXED - REROLL THE STOCK','#ffd040',2);return;}
  if(p.heal&&R.pots>=POTMAX){txtFx(P.x,P.y,'POTIONS FULL','#888');sfx('block');return;}if(R.sen<p.price){txtFx(P.x,P.y,'NOT ENOUGH GOLD','#c55');sfx('block');return;}R.sen-=p.price;sfx('pickup');
  if(p.reroll){const c=roomCenter(p.room);stockRelics(c,p.room,R.di);p.price=Math.round(p.price*1.6);fxRing(c.x,c.y+10,40,'#ffd040',.4);setToast('FRESH STOCK!','#ffd040',1.5);return;}
  p.sold=true;
  if(p.heal){R.pots++;setToast('BOUGHT AN HP POTION','#50e060',2);}
  else if(p.gear){pickups.push({x:p.x,y:p.y+14,k:'bag',tier:2,items:[p.gear],vx:0,vy:0,t:0,z:2,vz:80});setToast('BOUGHT '+p.gear.name+' - IT IS IN THE BAG','#ddd',2.5);}
  else if(p.ench){if(!applyEnch(p.ench)){p.sold=false;R.sen+=p.price;}}
  else if(p.lairKey){R.keys=(R.keys||0)+1;setToast('BOUGHT A LAIR KEY - IT OPENS A SEALED DOOR','#e0b040',3);}
  else{
   if(p.relicStand){R.relicShopDepth=relicTradeDepth();for(const stand of props)if(stand.relicStand||stand.reroll)stand.sold=true;}
   applyItem(p.item);
  }}
 else if(p.k==='altar'){if(p.curse)takeCurse(p);else openShrine(p);}
 else if(p.k==='gong'){const r=p.room;if(r.ev&&r.ev.state===0){p.used=true;startChallenge(r);}}

}
// spirit shrines: each belongs to one animal spirit with its own colour, temperament and three offerings
const bless=(k,n)=>{R.bless=R.bless||{};R.bless[k]=(R.bless[k]||0)+n;S=calcStats();};
const shrineRelicOpen=()=>R.relicShrineDepth!==relicTradeDepth();
const claimShrineRelic=()=>{R.relicShrineDepth=relicTradeDepth();};
const GODS={
 fox:{n:'SHRINE OF THE FOX',sub:'THE TRICKSTER LOVES A WAGER',c:'#ff9040',O:[
  {t:'WAGER 40 GOLD',d:'50% CHANCE OF A RELIC. ONE RELIC OFFERING PER STAGE',ok:()=>shrineRelicOpen()&&R.sen>=40&&relicTradeAvailable(0,2,['rez']),fn:()=>{claimShrineRelic();R.sen-=40;if(Math.random()<.5)setToast('THE FOX LAUGHS AND KEEPS YOUR GOLD','#c55',2.5);else applyItem(randItem(['rez'],0,2).id);}},
  {t:'DOUBLE OR NOTHING',d:'50%: DOUBLE YOUR GOLD. 50%: LOSE HALF',ok:()=>R.sen>=20,fn:()=>{if(Math.random()<.5){R.sen*=2;setToast('THE FOX PAYS OUT - GOLD DOUBLED','#ffd040',2.5);}else{R.sen=Math.floor(R.sen/2);setToast('THE FOX TAKES HALF','#c55',2.5);}}},
  {t:'FOXFIRE TRICK',d:'TRADE YOUR WEAPON FOR A RANDOM ONE A TIER HIGHER',ok:()=>!!R.eq.wpn,fn:()=>{const w=R.eq.wpn,g=mkGear('wpn',Math.min(14,(w.tier||0)+2),false,Math.random()<.3?3:2);R.eq.wpn=g;S=calcStats();P.hp=Math.min(S.maxhp,P.hp);spark(P.x,P.y,'#ff9040',24,90);setToast('THE FOX TAKES YOUR '+w.name+'. YOU NOW WIELD '+g.name,'#ff9040',3.5);}}]},
 crane:{n:'SHRINE OF THE CRANE',sub:'THE HEALER OF A THOUSAND YEARS',c:'#70e090',O:[
  {t:'PRAY FOR MENDING',d:'HEAL 40% HP',ok:()=>P.hp<S.maxhp,fn:()=>{P.hp=Math.min(S.maxhp,P.hp+S.maxhp*.4);setToast('THE CRANE MENDS YOUR WOUNDS','#6f6',2);}},
  {t:'LONG LIFE',d:'+25 MAX HP FOR THE REST OF THE RUN',ok:()=>true,fn:()=>{bless('hp',25);P.hp+=25;setToast('YOU FEEL HARDIER','#6f6',2);}},
  {t:'PURIFICATION',d:'LIFT ONE OF YOUR CURSES',ok:()=>curseCount()>0,fn:()=>{const k=(R.cnames||[]).pop()||'frail';if(k==='frail')R.curse=Math.max(0,(R.curse||0)-1);else if(R.cz&&R.cz[k])R.cz[k]--;if(k==='fog')R.fog=-1;S=calcStats();setToast((CURSES[k]?CURSES[k].n:'A CURSE')+' IS LIFTED','#fff',2.5);}}]},
 ox:{n:'SHRINE OF THE OX',sub:'IT DEMANDS BLOOD FOR STRENGTH',c:'#ff4040',O:[
  {t:'BLOOD OFFERING',d:'LOSE 30% HP. GAIN A RARE RELIC',ok:()=>shrineRelicOpen()&&P.hp>S.maxhp*.35&&relicTradeAvailable(2,2,['rez']),fn:()=>{claimShrineRelic();P.hp-=S.maxhp*.3;applyItem(randItem(['rez'],2,2).id);}},
  {t:'BLOOD PACT',d:'-15 MAX HP, +4 POWER FOR THE RUN',ok:()=>S.maxhp>60,fn:()=>{bless('hp',-15);bless('atk',4);P.hp=Math.min(P.hp,S.maxhp);setToast('THE OX GRANTS YOU ITS STRENGTH','#ff4040',2.5);}},
  {t:'OFFER A REVIVE',d:'LOSE 1 REVIVE. GAIN A LEGENDARY RELIC',ok:()=>shrineRelicOpen()&&P.rez>0&&relicTradeAvailable(3,3,['rez','phoenix']),fn:()=>{claimShrineRelic();P.rez--;applyItem(randItem(['rez','phoenix'],3).id);}}]},
 moon:{n:'SHRINE OF THE MOON HARE',sub:'IT SEES ALL PATHS',c:'#90b0ff',O:[
  {t:'MOONLIT PATHS',d:'REVEAL THE WHOLE MAP OF THIS STAGE',ok:()=>R.fog!==R.di,fn:()=>{for(let i=0;i<map.expl.length;i++)if(map.t[i])map.expl[i]=1;setToast('THE MOON SHOWS YOU THE WAY','#90b0ff',2.5);}},
  {t:'STILL WATER',d:'-'+cdPct(COOLDOWN.stillWater)+' ABILITY COOLDOWNS FOR THE RUN. COSTS 50 GOLD',ok:()=>R.sen>=50,fn:()=>{R.sen-=50;bless('cdr',1);setToast('YOUR MIND GROWS STILL','#90b0ff',2.5);}},
  {t:'RICE CAKE',d:'REFILL YOUR POTIONS. COSTS 60 GOLD',ok:()=>R.sen>=60&&R.pots<POTMAX,fn:()=>{R.sen-=60;R.pots=POTMAX;setToast('POTIONS REFILLED','#6f6',2);}}]},
};
// ---- room events: cursed altar, sealed ambush, timed gong challenge ----
// what one curse does (each one stacks, and lasts the rest of the run)
const CURSE_INFO=[{s:'CURSE OF FRAILTY: YOU TAKE +25% DAMAGE',c:'#ff5050'},{s:'BLOOD PRICE: YOU DEAL +30% DAMAGE',c:'#ff8a30'},{s:'REWARD: YOUR NEXT KILL DROPS A RARE BAG',c:'#ffd040'},{s:'LASTS ALL RUN AND STACKS WITH OTHER CURSES',c:'#aaa'}];
// every cursed altar holds ONE specific curse: its own drawback, its own payoff, its own look. All stack and last the run
const CURSES={
 frail:{n:'CURSE OF FRAILTY',c:'#ff5050',sk:'#c03030',L:[{s:'YOU TAKE +25% DAMAGE',c:'#ff5050'},{s:'YOU DEAL +30% DAMAGE',c:'#ff8a30'},{s:'YOUR NEXT KILL DROPS A RARE BAG',c:'#ffd040'}],
  fn:p=>{R.curse=(R.curse||0)+1;R.bonusBag=rewardBag();}},
 glass:{n:'GLASS BONES',c:'#9ad8ff',sk:'#4080c0',L:[{s:'MAX HP -20%',c:'#ff5050'},{s:'+15% CRIT CHANCE',c:'#ff8a30'},{s:'A POTION RISES FROM THE ALTAR NOW',c:'#ffd040'}],
  fn:p=>{R.cz.glass=(R.cz.glass||0)+1;dropPickup(p.x,p.y+14,'pot',1);}},
 greed:{n:'GOLDEN GREED',c:'#ffd040',sk:'#a08020',L:[{s:'ALL FOES HAVE +30% HP',c:'#ff5050'},{s:'+60% GOLD FROM EVERYTHING',c:'#ffd040'},{s:'A PURSE OF GOLD SPILLS OUT NOW',c:'#ffd040'}],
  fn:p=>{R.cz.greed=(R.cz.greed||0)+1;for(let i=0;i<8;i++)dropPickup(p.x,p.y,'sen',Math.round(rnd(5,9)*(1+R.di*.3)));}},
 fog:{n:'BLINDING FOG',c:'#b8b0c8',sk:'#6a6478',L:[{s:'YOUR MAP IS LOST FOR THIS STAGE',c:'#ff5050'},{s:'AN EPIC BAG DROPS RIGHT NOW',c:'#ffd040'},{s:'THE FOG LIFTS AT THE NEXT STAGE',c:'#aaa'}],
  fn:p=>{R.fog=R.di;R.cz.fog=(R.cz.fog||0)+1;dropBag(p.x,p.y+14,goodBag());}},
 frenzy:{n:'RESTLESS FRENZY',c:'#40e0e0',sk:'#208080',L:[{s:'DASH RECHARGES 40% SLOWER',c:'#ff5050'},{s:'+25% ATTACK SPEED',c:'#40e0e0'},{s:'-'+cdPct(COOLDOWN.frenzy)+' ABILITY COOLDOWNS',c:'#40e0e0'}],
  fn:p=>{R.cz.frenzy=(R.cz.frenzy||0)+1;}},
 hunted:{n:'THE HUNTED',c:'#c070ff',sk:'#6a2a9a',L:[{s:'AN ELITE STALKER WAKES IN THIS ROOM',c:'#ff5050'},{s:'IT DROPS A ROYAL-GRADE BAG',c:'#ffd040'},{s:'+10% DAMAGE FOR THE REST OF THE RUN',c:'#ff8a30'}],
  fn:p=>{R.cz.hunted=(R.cz.hunted||0)+1;const pool=DUN[R.di].pool,e=mkElite(pick(pool),p.x,p.y-40,p.room,R.di);e.hp*=1.5;e.maxhp*=1.5;e.dm*=1.15;e.awake=true;e.dropBag=rewardBag();enemies.push(e);spark(e.x,e.y,'#c070ff',20,90);}},
};
const curseCount=()=>(R.curse||0)+Object.values(R.cz||{}).reduce((a,b)=>a+b,0);
function takeCurse(p){const C=CURSES[p.ck||'frail'];R.cz=R.cz||{};p.used=true;C.fn(p);R.cnames=(R.cnames||[]);R.cnames.push(p.ck||'frail');S=calcStats();sfx('boss');impact(p.x,p.y,C.c,5,true);fxRing(p.x,p.y,40,C.c,.5);
 setToast('CURSED: '+C.n+' - '+C.L[0].s+', '+C.L[1].s,C.c,4);G('c',p.ck||'frail');}
function roomSpawn(r,n){for(let i=0;i<n;i++){const s=spotIn(r);if(Math.hypot(s.x-P.x,s.y-P.y)<40)continue;const e=mkEnemy(pick(DUN[R.di].pool),s.x,s.y,r,R.di);e.awake=true;enemies.push(e);spark(s.x,s.y,'#f55',10,70);fxRing(s.x,s.y,12,'#f55',.3);}}
function startChallenge(r){r.ev.state=1;r.ev.t=30;sfx('boss');impact(P.x,P.y,'#fc4',5);setToast('CHALLENGE: CLEAR THE ROOM IN 30S','#fc4',2.5);roomSpawn(r,7+R.di);}
const inRoom=(r,x,y,m)=>x>(r.x+m)*T&&x<(r.x+r.w-m)*T&&y>(r.y+m)*T&&y<(r.y+r.h-m)*T;
// a room counts as complete once you've been inside it and nothing is left to do there:
// no foes alive, its event finished, and its spring, chest or gong used. Completing it reveals the whole room on the map
function roomComplete(r){
 if(r===map.bossRoom||r.type==='shop')return false;
 if(enemies.some(e=>!e.dead&&e.room===r))return false;
 if(r.ev&&r.ev.state!==2)return false;
 for(const p of props)if(p.room===r&&!p.used&&(p.k==='spring'||p.k==='chest'||p.k==='gong'))return false;
 return true;}
function revealRoom(r){for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++){const i=y*MW+x;if(map.t[i])map.expl[i]=1;}}
function updRoomDone(dt){
 if(map.train)return;R._rc=(R._rc||0)-dt;if(R._rc>0)return;R._rc=.25;
 for(const r of map.rooms){if(r.done)continue;
  if(!r.visited){if(inRoom(r,P.x,P.y,0)){r.visited=true;r.hadFoes=enemies.some(e=>!e.dead&&e.room===r);}else continue;}
  if(!roomComplete(r))continue;
  r.done=true;revealRoom(r);
  if(r.hadFoes&&!R.training&&!R.test&&!R.rush)R.masteryRooms=(R.masteryRooms||0)+1;
  if(r.hadFoes||r.ev||props.some(p=>p.room===r&&p.used&&p.k!=='doorpost'&&p.k!=='entrancePlaque'))txtFx(P.x,P.y-14,'ROOM COMPLETE','#7fe08a');}}
function updRoomEvents(dt){
 updRoomDone(dt);
 for(const r of map.rooms){const ev=r.ev;if(!ev||ev.state>=2)continue;
  const alive=enemies.filter(e=>!e.dead&&e.room===r).length;
  if(ev.k==='ambush'){
   if(ev.state===0&&inRoom(r,P.x,P.y,2.5)){ev.state=1;ev.wave=0;sfx('boss');shake=Math.max(shake,6);setToast('AMBUSH! THE ROOM IS SEALED','#f55',2.5);roomSpawn(r,4+Math.floor(R.di/2));}
   else if(ev.state===1){P.x=clamp(P.x,r.x*T+6,(r.x+r.w)*T-6);P.y=clamp(P.y,r.y*T+6,(r.y+r.h)*T-6);
    if(alive===0){ev.wave++;if(ev.wave<2){setToast('WAVE '+(ev.wave+1)+'/2','#f55',1.5);roomSpawn(r,5+Math.floor(R.di/2));}else{ev.state=2;sfx('win');setToast('AMBUSH SURVIVED','#6f6',2);R.sen+=15+R.di*4;}}}}
  else if(ev.k==='challenge'&&ev.state===1){ev.t-=dt;
   if(alive===0){ev.state=2;sfx('win');setToast('CHALLENGE COMPLETE!','#fc4',2.5);R.sen+=20+R.di*5;}
   else if(ev.t<=0){ev.state=2;sfx('hurt');setToast('CHALLENGE FAILED','#f66',2);}}
 }
}
function drawRoomEvents(){
 for(const r of map.rooms){const ev=r.ev;if(!ev||ev.state!==1||ev.k!=='ambush')continue;const x0=r.x*T,y0=r.y*T,x1=(r.x+r.w)*T,y1=(r.y+r.h)*T,c=Math.floor(time*6)%2?'#f33':'#a11';
  const pts=[[x0,y0],[x1,y0],[x1,y1],[x0,y1],[x0,y0]];for(let i=0;i<4;i++){const a=pts[i],b=pts[i+1];sline(sx(a[0],a[1]),sy(a[0],a[1])-1,sx(b[0],b[1]),sy(b[0],b[1])-1,c);sline(sx(a[0],a[1]),sy(a[0],a[1])-6,sx(b[0],b[1]),sy(b[0],b[1])-6,c);}}
 const ch=map.rooms.find(r=>r.ev&&r.ev.k==='challenge'&&r.ev.state===1);if(ch){const t=Math.max(0,ch.ev.t);ctxt('CHALLENGE '+t.toFixed(1)+'S   FOES LEFT '+enemies.filter(e=>!e.dead&&e.room===ch).length,H-60,t<8&&Math.floor(time*4)%2?'#f66':'#fc4');}
}
function openShrine(p){const gd=GODS[p.god]||GODS.crane;
 evOpts=gd===GODS.ox&&prologueLoot()?[{...gd.O[0],d:'LOSE 30% HP. GAIN AN UNCOMMON RELIC'},gd.O[1]]:gd.O;
 evProp=p;evGod=gd;mode='event';sfx('boss');G('g',p.god||'crane');}
let evGod=null;
function pickEvent(i){if(!evOpts)return;if(i>=3){mode='play';evOpts=null;return;}const o=evOpts[i];if(!o)return;if(!o.ok()){sfx('block');return;}o.fn();evProp.used=true;sfx('pickup');mode='play';evOpts=null;trainEv('offer');}
function renderEvent(){
 renderPlay();ctx.fillStyle='rgba(0,0,0,.78)';ctx.fillRect(0,0,W,H);
 const gd=evGod||GODS.crane,gc=gd.c;
 ctxt(gd.n,14,gc,2);ctxt(gd.sub,30,'#ccc');ctxt('ONE OFFERING ONLY - PRESS 1 2 3, OR 4 / ESC TO LEAVE',40,'#888');
 evOpts.forEach((o,i)=>{const y=54+i*30,ok=o.ok();ctx.fillStyle=ok?'#1a1420':'#100a14';ctx.fillRect(24,y,272,24);ctx.fillStyle=ok?gc:'#555';ctx.fillRect(24,y,2,24);ctx.fillRect(24,y,272,1);txt((i+1)+'. '+o.t,32,y+5,ok?'#fff':'#777');txt(o.d,32,y+14,ok?shade(gc,-.15):'#666');});
 txt('4. LEAVE',32,150,'#aaa');
}
