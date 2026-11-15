'use strict';
// HELL OF THE EMPEROR - run and dungeon setup (part of the former game.js; files load in numeric order, see index.html)
// ---------- run / dungeon setup ----------
function startRun(start,resume){
 if(!resume)clearRun(); // a new run replaces any saved one
 if(!meta.tut3){meta.tut3=true;saveMeta();} // the training grounds replace the old auto tutorial pages
 R={di:start,inv:{},eq:{wpn:{t:'gear',slot:'wpn',tier:0,rare:false,wt:WSIG[CLS().k],name:'T0 '+WSIG[CLS().k],starter:true},arm:null,ring:null},pack:[],pots:1,asc:meta.asc||0,sen:0,kills:0,time:0,start,deathblows:0,perfect:0};
 S=calcStats();
 P={x:0,y:0,hp:S.maxhp,pos:0,pdelay:0,guard:false,ward:0,ab:{q:0,rmb:0,e:0,h:0,f:0},atkCd:0,dash:0,dashCd:0,dx:0,dy:0,iv:0,stag:0,flash:0,gourd:S.gourdMax,rez:1+meta.up.res,aim:0,mik:0,face:1,lo:Object.assign({},CLS().kit),emp:{},aegis:0,evo:0,evoT:0,storm:0,stormT:0,stormA:0,hot:0,hotAmt:0,haste:0};
 for(let i=0;i<start*2;i++){const it=randItem(['rez']);R.inv[it.id]=(R.inv[it.id]||0)+1;}
 // starting gifts from the skill tree: WAR CHEST gold, POTION BELT potions, HEIRLOOM relics
 R.sen+=40*upLv('purse');R.pots=Math.min(POTMAX,R.pots+upLv('belt'));for(let i=0;i<upLv('heir');i++){const it=randItem(['rez'],1);R.inv[it.id]=(R.inv[it.id]||0)+1;}
 S=calcStats();P.hp=S.maxhp;P.gourd=S.gourdMax;
 if(resume)return;
 if(start===0&&(!meta.trained||trainNext)){trainNext=false;loadTraining();}else loadDungeon(start);mode='play';paused=false;
}
let trainNext=false;
function loadDungeon(di){
 R.di=di;const th=DUN[di];map=genMap(di);map.th=th;map.mc={};
 const BK=BOSS[di]&&BKIT[BOSS[di].name];if(BK&&BK.shape&&map.bossRoom){BK.shape(map,map.bossRoom);rebuildVis(map);} // each boss reshapes its own arena
 mapCanvas=map.mc[camRot]=renderMap(th);
 enemies=[];projs=[];pickups=[];fx=[];particles=[];texts=[];props=[];traps=[];hz=[];dh=[];zones=[];freezeT=0;portal=null;boss=null;
 const sr=map.startRoom;P.x=(sr.x+sr.w/2)*T;P.y=(sr.y+sr.h/2)*T;
 P.iv=1;P.stag=0;P.ward=0;P.dash=0;P.pos=0;P.storm=0;P.hot=0;P.haste=0;
 P.hp=Math.min(S.maxhp,P.hp+S.maxhp*(di===R.start?0:.15)); // only a small rest between dungeons
 for(const r of map.rooms){
  if(r.k==='start')continue;
  if(r.k==='boss'){boss=mkBoss(di,(r.x+r.w/2)*T,(r.y+r.h/2)*T,r);enemies.push(boss);if(BK&&BK.populate)BK.populate(boss,r);continue;}
  populateRoom(r,di);
 }
 decos=genDecos(di);ambient=[];
 setToast(ROMAN[di]+'. '+th.name+(th.story?' - '+th.story:''),'#fff',4);
 if(di>0)txtFx(P.x,P.y,'SPELLS RANK UP: '+(di+1),'#fd4');
 saveRun(); // checkpoint: quitting now lets you continue from the start of this stage
}
function mkEnemy(type,x,y,room,di){
const t=ET[type],hm=2.6*(1+.6*di)*(1+.15*((R&&R.asc)||0))*DF().hp*(1+.3*((R&&R.cz&&R.cz.greed)||0));
 return {type,t,x,y,room,hp:t.hp*hm,maxhp:t.hp*hm,posture:0,maxPosture:t.pos*(1+.12*di),spd:t.spd,r:t.r,dm:1+.17*di,awake:false,cd:rnd(.3,1),act:null,stag:0,stun:0,pdelay:0,flash:0,kx:0,ky:0,tele:0,st:null,di,sdir:Math.random()<.5?1:-1,wob:Math.random()*6,boss:false,z:0,iv:0,shield:!!t.shield,slow:1,zs:1,rcd:0,fa:0};
}
let BOSSHP=20;
// a disengaged boss goes home, heals fully and forgets the fight (phase, enrage, attack timers, its bullets)
function bossReset(e){
 Object.assign(e,{hp:e.maxhp,posture:0,phase:1,kit:e.b.k1,lastPh:undefined,act:null,tele:0,stag:0,stun:0,storm:0,mode:null,modeT:null,brq:[],bgT:null,bgN:0,stN:0,
  enraged:false,fightT:0,awake:false,x:e.hx,y:e.hy,kx:0,ky:0,outT:0,iv:0,dot:null,st:null,cd:1.2,dm:e.dm0,t:Object.assign({},e.t0)});
 for(const q of projs)if(q.from==='e')q.dead=true;
 // scripted bosses also reset their event, minions and arena (banners regrow, eggs re-lay, the squad regroups)
 {const K=BKIT[e.name];if(K){if(e.ev&&e.ev.mins)for(const m of e.ev.mins)m.dead=true;e.ev=null;e.desp=0;e.lastPh=1;if(K.reset)K.reset(e);}}
 setToast(e.name+' RETURNS TO ITS POST','#aaa',2.5);fxRing(e.x,e.y,40,'#aaa',.4);}
function mkBoss(di,x,y,room){
 const b=BOSS[di],sc=b.sc||2,bh=b.hp*BOSSHP*(1+.15*((R&&R.asc)||0))*DF().hp;
 return {type:'boss',t:{wl:16,cdMin:.6,cdMax:1.2},t0:{wl:16,cdMin:.6,cdMax:1.2},hx:x,hy:y,dm0:1+.14*di,x,y,room,boss:true,name:b.name,b,hp:bh,maxhp:bh,posture:0,maxPosture:420+di*55,spd:b.spd,r:b.r||(sc===3?13:9),dm:1+.14*di,awake:false,cd:1.2,act:null,stag:0,stun:0,pdelay:0,flash:0,kx:0,ky:0,tele:0,dot:null,di,phase:1,pref:b.pref,kit:b.k1,iv:0,z:0,sdir:1,wob:0,spr:BOSSSPR[di]||(BOSSSPR[di]=bossSheet(di))};
}
function setToast(s,c,t){toast={s,c:c||'#fff',t:t||2};}
