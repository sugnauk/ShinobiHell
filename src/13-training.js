'use strict';
// HELL OF THE EMPEROR - player actions, training grounds (part of the former game.js; files load in numeric order, see index.html)
// ---------- player actions ----------
function tryDash(){const p=P;if(p.dashCd>0||p.dash>0||p.stag>0)return;const [mx,my]=moveVec();const a=mx||my?Math.atan2(my,mx):p.aim;p.dx=Math.cos(a);p.dy=Math.sin(a);p.dash=.16;p.dashCd=S.dashCd;p.iv=Math.max(p.iv,S.dashIv);p.guard=false;sfx('dash');perfectDodge();p.dashCd=Math.max(p.dashCd,S.dashIv*2.5);{const now=R.time;p.dashRow=(p.lastDashT!=null&&now-p.lastDashT<S.dashCd+.7)?(p.dashRow||1)+1:1;p.lastDashT=now;if(p.dashRow>=DASHROW&&!inCombat()&&!frontierNear()){if(!p.oocRun)txtFx(p.x,p.y,'SWIFT!','#8cf');p.oocRun=true;p.sprintK=1;}}if(S.mikiri)p.mik=1.5;spark(p.x,p.y+4,'#aab',5,30);}
// ================= TRAINING GROUNDS: one lesson per ability before the first dungeon =================
const DUMMYSPR={};
(()=>{const mkS=(w,h,fn)=>{const fr=mk(w+2,h+2,g=>{const R=(x,y,ww,hh,c)=>{g.fillStyle=c;g.fillRect(x+1,y+1,ww,hh);};fn(R);});const c=outlined(fr);return {c,wc:whiteOf(c),fw:w+2,fh:h+2,frames:1,sc:1,ok:true};};
 DUMMYSPR.dummy=mkS(16,24,R=>{R(7,14,2,10,'#6a4a2a');R(1,8,14,2,'#6a4a2a');R(4,6,8,11,'#d8b860');R(4,6,8,1,'#f0d080');R(5,0,6,6,'#d8b860');R(6,2,1,1,'#3a2a1a');R(9,2,1,1,'#3a2a1a');R(5,9,6,6,'#c02818');R(6,10,4,4,'#f0e8d0');R(7,11,2,2,'#c02818');R(4,16,8,1,'#a08040');R(3,22,10,2,'#5a3a1a');});
 DUMMYSPR.turret=mkS(14,20,R=>{R(1,16,12,4,'#5a5a64');R(3,4,8,12,'#7a7a86');R(3,4,2,12,'#9a9aa6');R(2,2,10,3,'#5a5a64');R(5,7,4,4,'#14101a');R(6,8,2,2,'#c060ff');R(4,0,6,2,'#5a5a64');});})();
Object.assign(ET,{dummy:{n:'TRAINING DUMMY',hp:14,spd:0,pos:30,r:6,ai:'dummy',rng:0,wl:0,atks:[]},turret:{n:'SPIRIT TURRET',hp:9999,spd:0,pos:9999,r:6,ai:'turret',rng:0,wl:0,atks:[]}});
let trainMarks=[];
function loadTraining(){
 R.di=0;R.training={i:-1,c:0,t:0,wait:0,good:0};const th=DUN[0];
 // one open courtyard
 const t=new Uint8Array(MW*MH),rx=Math.floor(MW/2-15),ry=Math.floor(MH/2-11),rw=30,rh=22;for(let j=ry;j<ry+rh;j++)for(let i=rx;i<rx+rw;i++)t[j*MW+i]=1;
 const vis=new Uint8Array(MW*MH);for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const i=y*MW+x;if(t[i])continue;let near=false;for(let j=-1;j<=1&&!near;j++)for(let k=-1;k<=1;k++){const xx=x+k,yy=y+j;if(xx>=0&&yy>=0&&xx<MW&&yy<MH&&t[yy*MW+xx]){near=true;break;}}if(near)vis[i]=(y+1<MH&&t[i+MW])?2:1;}
 const room={x:rx,y:ry,w:rw,h:rh,k:'start',type:'training'};
 map={t,vis,rooms:[room],liq:new Uint8Array(MW*MH),liqList:[],env:ENV[0],expl:new Uint8Array(MW*MH).fill(1),startRoom:room,bossRoom:room,train:1,th,mc:{}};mapCanvas=map.mc[camRot]=renderMap(th);
 enemies=[];projs=[];pickups=[];fx=[];particles=[];texts=[];props=[];traps=[];hz=[];dh=[];zones=[];freezeT=0;portal=null;boss=null;trainMarks=[];
 P.x=(rx+5)*T;P.y=(ry+rh/2)*T;P.iv=1;P.hp=S.maxhp;P.gourd=S.gourdMax;P.lock={m:1,h:1,q:1,w:1,f:1,e:1,d:1};
 decos=genDecos(0).filter(o=>Math.hypot(o.x-P.x,o.y-P.y)>60);ambient=[];nextLesson();}
const tRoom=()=>map.rooms[0],tAt=(fx,fy)=>{const r=tRoom();return {x:(r.x+r.w*fx)*T,y:(r.y+r.h*fy)*T};};
function tSpawn(type,fx,fy,o){const p=tAt(fx,fy),e=mkEnemy(type,p.x,p.y,tRoom(),0);e.awake=true;Object.assign(e,o||{});enemies.push(e);spark(p.x,p.y,'#fff',8,50);return e;}
const spName=k=>SPELLS[k][P.lo[k]].n,spDesc=k=>SPELLS[k][P.lo[k]].d;
const kN=k=>keyName(KB[k]);
// ten lessons, each teaching one or two related things. Every lesson still names the keys and what they do.
// a turret placed a set distance from you, so its shots always reach you
const tTurret=(rate,pat)=>{let t=enemies.find(e=>e.type==='turret'&&!e.dead);if(!t)t=tSpawn('turret',.5,.5);const r=tRoom(),x=clamp(P.x+130,(r.x+2)*T,(r.x+r.w-2)*T),y=clamp(P.y,(r.y+2)*T,(r.y+r.h-2)*T);t.x=x;t.y=y;t.tRate=rate;t.tt=.6;t.tPat=pat;return t;};
const tClear=keep=>{for(const e of enemies)if(!(keep&&e.type===keep))e.dead=true;if(!keep)for(const q of projs)if(q.from==='e')q.dead=true;};
const LESSONS=[
 {t:'MOVE AND ATTACK',l:()=>[[kN('up'),kN('left'),kN('down'),kN('right')].join('')+' TO WALK, THE MOUSE TO AIM.','LMB: '+spName('m')+'. DESTROY THE 3 DUMMIES.'],unlock:['m'],go:()=>{tSpawn('dummy',.5,.38);tSpawn('dummy',.56,.5);tSpawn('dummy',.5,.62);},need:3,ev:'kill'},
 {t:'HEAVY ATTACK AND STUN',l:()=>['HOLD RMB TO CHARGE '+spName('h')+', RELEASE TO STRIKE.','EVERY HIT FILLS A FOE\'S YELLOW STUN BAR. A FULL BAR STUNS','THEM: +50% DAMAGE. STUN THE ARMOURED DUMMY.'],unlock:['h'],go:()=>{tClear();tSpawn('dummy',.55,.5,{hp:99999,maxhp:99999,maxPosture:60,r:8});},need:1,ev:'break'},
 {t:'DASH AND PERFECT DODGE',l:()=>[kN('dash')+' DASHES. YOU CANNOT BE HIT WHILE DASHING.','DASH JUST AS A SHOT REACHES YOU FOR A PERFECT DODGE: NEARBY','BULLETS SHATTER. REFUNDS UP TO 0.08S ON DASH AND 0.10S ON Q, E AND F.','YOUR NEXT ATTACK IS EMPOWERED. DO ONE PERFECT DODGE.'],unlock:['d'],
  go:()=>{tClear();tTurret(.75,{cnt:1,spread:.12,sp:70,dmg:3,pd:2,col:'#fd4'});},need:1,ev:'perfect',
  // keep the turret in range, whatever you do
  tick:(dt,T)=>{const t=enemies.find(e=>e.type==='turret'&&!e.dead);if(t&&Math.hypot(t.x-P.x,t.y-P.y)>170)tTurret(.75,t.tPat);}},
 {t:'ABILITIES',l:()=>[kN('q')+': '+spName('q')+'   '+kN('w')+': '+spName('w')+'   '+kN('f')+': '+spName('f'),kN('e')+': '+spName('e')+' - YOUR ULTIMATE. KILLS CUT ITS COOLDOWN.','EACH ABILITY HAS A COOLDOWN. USE ALL FOUR ('+(R.training&&R.training.slots?R.training.slots.size:0)+'/4).'],
  unlock:['q','w','f','e'],go:()=>{const t=enemies.find(e=>e.type==='turret');if(t)t.tRate=99;for(let i=0;i<4;i++)tSpawn('dummy',.55+(i%2)*.08,.4+(i>>1)*.2);R.training.slots=new Set();},
  done:T=>T.slots&&T.slots.size>=4},
 {t:'HEALING ('+'POTIONS)',l:()=>[kN('heal')+' DRINKS AN HP POTION (+35%). THEY ARE RARE: YOU','CARRY 3 AT MOST. DRINK ONE NOW.'],go:()=>{tClear();P.hp=Math.round(S.maxhp*.45);R.pots=Math.max(R.pots,1);},need:1,ev:'heal'},
 {t:'LOOT',l:()=>['FOES DROP BAGS: STAND ON ONE, 1-6 TAKES AN ITEM, G TAKES ALL.','ENCHANTS ADD AN ON-HIT EFFECT TO EVERY ABILITY AND STACK.','LEGENDARY SCROLLS: CHOOSE 1 OF 3 TO EMPOWER A SLOT.','TAKE EVERYTHING, THEN OPEN YOUR BACKPACK ('+kN('pack')+').'],
  go:()=>{const p=tAt(.55,.5);pickups.push({x:p.x,y:p.y,k:'bag',tier:6,items:[mkGear('wpn',1,false,2),{t:'ench',k:'fire'},{t:'scroll'},{t:'hp'}],t:0,z:2,vz:110});},
  done:T=>!pickups.some(k=>k.k==='bag')&&T.ev&&T.ev.pack},
 {t:'BOSS EVENTS',l:()=>['WHEN A BOSS STARTS AN EVENT IT CANNOT BE HURT. RED CIRCLES','BURST - STAY OUT, DODGE UNTIL THE BAR EMPTIES, THEN STRIKE.'],
  go:()=>{tClear('turret');tTurret(.8,{pat:'gapring',cnt:18,gw:.6,sp:38,dmg:3,pd:2,col:'#ffd040'});},
  tick:(dt,T)=>{T.rn=(T.rn||0)-dt;if(T.rn<=0){T.rn=.9;for(let i=0;i<2;i++){const a=Math.random()*TAU,d=rnd(8,34);dh.push({x:P.x+Math.cos(a)*d,y:P.y+Math.sin(a)*d,r:13,t:1.1,dur:1.1,dmg:4,col:'#f55'});}}},timer:7,survBar:1},
 {t:'SHRINES AND CURSES',l:()=>['SHRINES: FOX GAMBLES, CRANE HEALS, OX TRADES BLOOD, MOON HARE','GUIDES. CURSE ALTARS GIVE A DRAWBACK AND A REWARD. MAKE AN OFFERING.'],
  go:()=>{tClear();dh=[];const p=tAt(.6,.5);props.push({k:'altar',x:p.x,y:p.y,room:tRoom(),col:GODS.crane.c,god:'crane'});},need:1,ev:'offer'},
 {t:'READY',l:()=>['K: THE GUIDE (EVERYTHING YOU HAVE MET). O: OPTIONS.','THE MINIMAP MARKS SHOPS, SHRINES, WELLS AND THE BOSS.','G AT THE PORTAL ENTERS THE FIRST STAGE.'],go:()=>{props=[];const p=tAt(.85,.5);portal={x:p.x,y:p.y,t:0,pending:false};tClear();},done:()=>false}];
function nextLesson(){const T=R.training;T.i++;T.c=0;T.t=0;T.ev={};const L=LESSONS[T.i];if(!L)return;for(const u of L.unlock||[])delete P.lock[u];for(const k of L.unlock||[])if('qwfe'.includes(k))P.ab[k==='w'?'rmb':k]=0;if(L.go)L.go();sfx('pickup');}
function trainEv(k,a){const T=R&&R.training;if(!T||T.wait>0)return;T.ev=T.ev||{};T.ev[k]=1;const L=LESSONS[T.i];if(!L)return;
 // the abilities lesson counts each of the four once, and gives the cooldown straight back so you can keep trying
 if(k==='cast'&&T.slots&&'qwfe'.includes(a)){T.slots.add(a);P.ab[a==='w'?'rmb':a]=Math.min(P.ab[a==='w'?'rmb':a]||0,.4);}
 if(L.ev!==k)return;if(L.slot&&a!==L.slot)return;T.c++;}
function updTraining(dt){const T=R.training;if(!T)return;const L=LESSONS[T.i];if(!L)return;T.t+=dt;P.hp=Math.max(P.hp,L.t.startsWith('HEALING')?1:S.maxhp*.3);if(L.tick&&T.wait<=0)L.tick(dt,T);
 for(const e of enemies)if(e.type==='dummy'&&!e.dead)e.hp=Math.min(e.hp,e.maxhp);
 if(T.wait>0){T.wait-=dt;if(T.wait<=0)nextLesson();return;}
 const ok=L.done?L.done(T):L.timer?T.t>=L.timer:T.c>=(L.need||1);
 if(ok){T.wait=1;T.good=1;txtFx(P.x,P.y-8,'GOOD!','#6f6',2);sfx('win');}}
function drawTrainingMarks(){
 for(const m of trainMarks){const X=sx(m.x,m.y),Y=sy(m.x,m.y);ctx.globalAlpha=.4+.3*Math.sin(time*5);wdisc(m.x,m.y,10,'#ffe060');ctx.globalAlpha=1;wcirc(m.x,m.y,10+Math.sin(time*5)*2,'#fff');ctx.fillStyle='#ffe060';ctx.fillRect(X-1,Y-26+Math.round(Math.sin(time*6)*3),3,8);}
}
function drawTraining(){const T=R.training;if(!T)return;const L=LESSONS[T.i];if(!L)return;
 const lines=L.l(),w=Math.min(W-130,Math.max(150,...lines.map(s=>txtW(s)+10))),h=16+lines.length*8,x=4,y=(L.t==='LOOT'&&nearBag())?66:H-34-h;
 ctx.fillStyle='rgba(8,6,12,.88)';ctx.fillRect(x,y,w,h);ctx.fillStyle='#ffe060';ctx.fillRect(x,y,w,1);ctx.fillRect(x,y+h-1,w,1);
 txt('TRAINING '+(T.i+1)+'/'+LESSONS.length+'  '+L.t,x+5,y+4,'#ffe060');lines.forEach((s,i)=>txt(s,x+5,y+13+i*8,'#ddd'));
 const prog=L.timer?Math.min(L.timer,T.t).toFixed(0)+'/'+L.timer+'S':L.need?T.c+'/'+L.need:'';if(prog)txt(prog,x+w-5-txtW(prog),y+4,'#aaa');
 if(T.wait>0){ctx.fillStyle='rgba(80,255,120,.12)';ctx.fillRect(x,y,w,h);}
 if(L.survBar&&T.wait<=0){const f=1-Math.min(1,T.t/L.timer);bar(Math.round(W/2-60),36,120,3,f,'#ffd040','#2a1a2a');ctxt('SURVIVE '+Math.ceil(L.timer-T.t),43,'#ffd040');}
 txt('N: SKIP TRAINING',4,H-8,'#666');}
function finishTraining(){R.training=null;P.lock=null;
 // training-only power (the practice scroll, enchant and shrine blessing) does not carry into the real run
 P.lo=Object.assign({},CLS().kit);P.emp={};R.addon={};R.bless={};R.cz={};R.curse=0;R.cnames=[];if(R.eq.wpn)R.eq.wpn.ench=[];syncLMB();S=calcStats();props=[];dh=[];meta.trained=true;saveMeta();P.hp=S.maxhp;R.pots=1;R.eq.wpn=R.eq.wpn&&!R.eq.wpn.starter&&R.eq.wpn.tier<=1?R.eq.wpn:R.eq.wpn;loadDungeon(0);sfx('pickup');}
// no gourd: C drinks one of your (rare) HP potions
const POTMAX=3,POTHEAL=.35;
function useGourd(){const p=P;if(p.hp>=S.maxhp||p.stag>0)return;if(R.pots<=0){txtFx(p.x,p.y,'NO POTIONS','#888');return;}R.pots--;p.hp=Math.min(S.maxhp,p.hp+S.maxhp*POTHEAL);sfx('heal');txtFx(p.x,p.y,'+HP','#50e060');spark(p.x,p.y,'#50e060',10,50);}
{const ug=useGourd;useGourd=function(){const h=P.hp;ug();if(P.hp>h)trainEv('heal');};}
