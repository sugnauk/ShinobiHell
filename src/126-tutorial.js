'use strict';
// ===== MASTER KAITO'S TRIALS: the tutorial, rebuilt to be played rather than read =====
// Built on how good tutorials keep players engaged: learn by doing, one idea per trial, a goal you can see filling up,
// short text (two lines at most), a mentor with a voice who reacts to you, satisfying feedback on every success, a mix of
// pace (precision, survival, a horde, a treasure, a real fight), and a reward at the end. The same mechanics as before
// (every key and system is still taught); the trials around them are new. N still skips.
const OLDL=LESSONS.slice();
const TRAIN_MASTER={say:'',sayT:0,quip:0};
function kaitoSay(s,t){TRAIN_MASTER.say=s;TRAIN_MASTER.sayT=t||3.2;}
const PRAISE=['FINE WORK!','THAT IS MY STUDENT!','SHARP!','HA! AGAIN, BUT FASTER.','THE EMPEROR SHOULD WORRY.','CLEAN. VERY CLEAN.'];
const IDLE=['THE DUMMIES WILL NOT DEFEAT THEMSELVES.','I HAVE SEEN SNAILS TRAIN FASTER.','DO NOT MAKE ME FETCH MY STAFF.','THE TEA IS GETTING COLD...'];
const tRandSpot=(min,max)=>{for(let k=0;k<30;k++){const a=Math.random()*TAU,d=rnd(min,max),x=P.x+Math.cos(a)*d,y=P.y+Math.sin(a)*d,r=tRoom();if(x>(r.x+2)*T&&x<(r.x+r.w-2)*T&&y>(r.y+2)*T&&y<(r.y+r.h-2)*T&&!blocked(x,y,6))return {x,y};}return tAt(.6,.5);};
function tTarget(x,y,o){const e=mkEnemy('dummy',x,y,tRoom(),0);e.awake=true;Object.assign(e,o||{});enemies.push(e);spark(x,y,'#ffe060',10,60);fxRing(x,y,16,'#ffe060',.3);return e;}
// count the training dummies of a kind that have just died
function tKills(T,key,fn){T[key]=T[key]||[];let n=0;for(const e of T[key])if(e.dead&&!e.counted){e.counted=1;n++;if(fn)fn(e);}return n;}
LESSONS.length=0;
LESSONS.push(
 {t:'TARGET PRACTICE',l:()=>['WALK '+[kN('up'),kN('left'),kN('down'),kN('right')].join('')+', AIM WITH THE MOUSE, LMB ATTACKS.','SMASH THE TALISMAN TARGETS AS THEY APPEAR.'],unlock:['m'],need:8,
  say:'WELCOME, STUDENT. SHOW ME THOSE HANDS ARE NOT JUST FOR RICE.',
  go:()=>{R.training.tg=[];},
  tick:(dt,T)=>{T.c+=tKills(T,'tg',e=>{T.streak=(T.streak||0)+1;txtFx(e.x,e.y-12,T.streak>2?T.streak+' IN A ROW!':'HIT!','#ffe060',1);sfx('coin');});
   if(T.c<8&&!T.tg.some(e=>!e.dead)){const s=tRandSpot(50,110);T.tg.push(tTarget(s.x,s.y));}}},
 Object.assign({},OLDL[1],{t:'CRACK THE ARMOUR',l:()=>['HOLD RMB TO CHARGE '+spName('h')+', RELEASE TO STRIKE.','FILL ITS YELLOW STUN BAR. A STUNNED FOE TAKES +50%.'],say:'THAT ONE IS ARMOURED. HIT IT HARDER, NOT MORE OFTEN.'}),
 Object.assign({},OLDL[2],{t:'DANCE THROUGH THE STORM',l:()=>[kN('dash')+' DASHES - NOTHING CAN HIT YOU MID-DASH.','DASH JUST AS A SHOT ARRIVES: A PERFECT DODGE.'],say:'THE TURRET WILL SPIT. WAIT... WAIT... NOW! DASH THROUGH IT.'}),
 {t:'THE STRAW HORDE',l:()=>[kN('q')+' '+spName('q')+'  '+kN('w')+' '+spName('w')+'  '+kN('f')+' '+spName('f')+'  '+kN('e')+' '+spName('e'),'USE ALL FOUR ABILITIES AND CUT DOWN 6 OF THE HORDE.'],unlock:['q','w','f','e'],
  say:'A STRAW ARMY MARCHES ON US! UNLEASH EVERYTHING YOU HAVE!',
  go:()=>{const t=enemies.find(e=>e.type==='turret');if(t)t.tRate=99;R.training.slots=new Set();R.training.hd=[];R.training.hk=0;R.training.ht=0;},
  tick:(dt,T)=>{T.hk+=tKills(T,'hd',e=>{txtFx(e.x,e.y-12,'SHRED!','#ffb060',.8);});T.ht-=dt;
   if(T.ht<=0&&T.hd.filter(e=>!e.dead).length<5){T.ht=.9;const r=tRoom(),y=(r.y+3+Math.random()*(r.h-6))*T,x=(r.x+r.w-2)*T;T.hd.push(tTarget(x,y,{horde:1}));}
   for(const e of T.hd)if(!e.dead){const a=Math.atan2(P.y-e.y,P.x-e.x);move(e,Math.cos(a)*22*dt,Math.sin(a)*22*dt,5);e.wob=(e.wob||0)+dt*6;}},
  done:T=>T.slots&&T.slots.size>=4&&T.hk>=6},
 Object.assign({},OLDL[4],{t:'HEALING: A SIP OF COURAGE',l:()=>[kN('heal')+' DRINKS AN HP POTION (+35%).','YOU CARRY 3 AT MOST, SO SAVE THEM. DRINK ONE NOW.'],say:'YOU LOOK TERRIBLE. DRINK. AND DO NOT TELL ANYONE I HELPED.'}),
 {t:'THE GOLDEN DUMMY',l:()=>['BREAK THE GOLDEN DUMMY. STAND ON THE BAG IT DROPS:','1-6 TAKES ONE ITEM, G TAKES ALL. THEN OPEN THE PACK ('+kN('pack')+').'],
  say:'THAT DUMMY IS STUFFED WITH TREASURE. I CHECKED.',
  go:()=>{tClear();const p=tAt(.6,.5);R.training.gd=[tTarget(p.x,p.y,{gold:1,hp:30,maxhp:30})];},
  tick:(dt,T)=>{tKills(T,'gd',e=>{const p={x:e.x,y:e.y};pickups.push({x:p.x,y:p.y,k:'bag',tier:6,items:[mkGear('wpn',1,false,2),{t:'ench',k:'fire'},{t:'scroll'},{t:'hp'}],t:0,z:2,vz:110});
    for(let i=0;i<12;i++)dropPickup(p.x,p.y,'sen',2);sfx('rare');fxRing(p.x,p.y,40,'#ffd040',.6);spark(p.x,p.y,'#ffd040',30,120);txtFx(p.x,p.y-16,'JACKPOT!','#ffd040',2);T.opened=1;});},
  done:T=>T.opened&&!pickups.some(k=>k.k==='bag')&&T.ev&&T.ev.pack},
 Object.assign({},OLDL[6],{t:'WEATHER THE STORM',l:()=>['DURING A BOSS EVENT IT CANNOT BE HURT.','STAY OUT OF THE RED CIRCLES UNTIL THE BAR EMPTIES.'],say:'WHEN A GUARDIAN RAGES, YOU DO NOT FIGHT. YOU SURVIVE.'}),
 Object.assign({},OLDL[7],{t:'MAKE AN OFFERING',l:()=>['SHRINES TRADE GIFTS: FOX GAMBLES, CRANE HEALS, OX TRADES BLOOD.','CURSE ALTARS (RED SKULL) GIVE POWER WITH A PRICE. PRAY HERE.'],say:'BOW TO THE CRANE. SHE IS KINDER THAN I AM.'}),
 {t:'SPAR WITH THE MASTER\'S SHADOW',l:()=>['EVERYTHING AT ONCE: A REAL FOE.','DODGE, STRIKE, STUN, UNLEASH. DEFEAT THE SHADOW.'],unlock:['m','h','q','w','f','e','d'],
  say:'NOW FACE MY SHADOW. IT FIGHTS LIKE ME - WHEN I WAS YOUNG AND HANDSOME.',
  go:()=>{tClear();const p=tAt(.7,.5);const e=mkEnemy('samurai',p.x,p.y,tRoom(),0);Object.assign(e,{awake:true,label:'MASTER\'S SHADOW',labelC:'#c8a0ff',spar:1});e.hp=e.maxhp=e.maxhp*1.4;enemies.push(e);R.training.sp=[e];fxRing(p.x,p.y,40,'#c8a0ff',.6);sfx('boss');},
  tick:(dt,T)=>{T.c+=tKills(T,'sp');},need:1},
 Object.assign({},OLDL[8],{t:'THE ROAD AHEAD',l:()=>['K OPENS THE GUIDE, O THE OPTIONS. THE MINIMAP MARKS SHRINES,','SHOPS, SPRINGS AND THE BOSS. G AT THE PORTAL BEGINS YOUR JOURNEY.'],
  say:'YOU ARE READY. MORE OR LESS. GO, AND COME BACK ALIVE.',
  go:()=>{OLDL[8].go&&OLDL[8].go();const T=R.training,sec=T.total||0,stars=sec<160?3:sec<260?2:1;T.stars=stars;
   if(!meta.trialsReward){meta.trialsReward=1;meta.sen=(meta.sen||0)+50;saveMeta();T.paid=1;}}}));
// the master speaks when each trial begins, cheers when it is cleared, and needles you if you stand about
{const _nl=nextLesson;nextLesson=function(){_nl.apply(this,arguments);const T=R.training,L=T&&LESSONS[T.i];if(L&&L.say)kaitoSay(L.say,4.2);};}
{const _ut=updTraining;updTraining=function(dt){const T=R.training;if(T){T.total=(T.total||0)+dt;}const was=T&&T.wait;_ut.apply(this,arguments);
  if(!R.training)return;if(T.wait>0&&!(was>0)){kaitoSay(pick(PRAISE),1.6);T.stamp=1.1;sfx('rare');for(let i=0;i<20;i++)particles.push({x:P.x+rnd(-20,20),y:P.y+rnd(-10,10),vx:rnd(-40,40),vy:rnd(-70,-20),t:.8,col:pick(['#ffe060','#ffffff','#80ff90'])});}
  if(T.stamp>0)T.stamp-=dt;TRAIN_MASTER.sayT-=dt;
  const moving=keys[KB.up]||keys[KB.down]||keys[KB.left]||keys[KB.right]||mouse.down||mouse.rdown;TRAIN_MASTER.quip=moving?0:TRAIN_MASTER.quip+dt;
  if(TRAIN_MASTER.quip>9&&TRAIN_MASTER.sayT<=0){TRAIN_MASTER.quip=0;kaitoSay(pick(IDLE),3);}};}
// the golden dummy and the horde look the part
{const _de=drawEnemy;drawEnemy=function(e){if(!e.gold&&!e.horde)return _de.apply(this,arguments);const X=sx(e.x,e.y),Y=sy(e.x,e.y);
  if(e.gold){ctx.globalAlpha=.3+.15*Math.sin(time*6);wdisc(e.x,e.y,12,'#ffd040');ctx.globalAlpha=1;}_de.apply(this,arguments);
  if(e.gold){if(Math.random()<.3)particles.push({x:e.x+rnd(-6,6),y:e.y+rnd(-4,4),vx:0,vy:-20,t:.5,col:'#ffe060'});ctx.fillStyle='#ffd040';ctx.fillRect(X-1,Y-30+Math.round(Math.sin(time*4)*2),3,3);}
  if(e.horde){ctx.fillStyle='#c8a040';ctx.fillRect(X-4,Y-27,9,2);ctx.fillRect(X-2,Y-29,5,2);}};}
// ---- the screen: the master and his bubble in the yard, the trial at the top, a stamp when you clear it
drawTraining=function(){const T=R.training;if(!T)return;const L=LESSONS[T.i];if(!L)return;
 // Master Kaito, watching from the corner of the yard
 const rib=4+24+L.l().length*8+6; // keep the bubble clear of the trial ribbon and the minimap
 const mp=tAt(.1,.18),MX=sx(mp.x,mp.y),MY=sy(mp.x,mp.y),onS=MX>10&&MX<W-10&&MY>rib+30&&MY<H-30;
 if(MX>-30&&MX<W+30&&MY>-10&&MY<H+50){shadow(MX,MY,14);drawSpr({...heroSpr('wizard',9),sc:1},MX,MY,false,WIZ.idle[Math.floor(time*2.5)%2],MX>W/2);}
 if(TRAIN_MASTER.sayT>0&&TRAIN_MASTER.say){const lines=wrapTxt(TRAIN_MASTER.say,30),w=Math.max(txtW('MASTER KAITO')+8,...lines.map(s=>txtW(s)))+8,h=lines.length*8+14;
  let bx,by;if(onS){bx=clamp(MX-w/2,4,W-w-4);by=clamp(MY-34-h,rib+(bx+w>W-140?136-rib:0),H-h-40);}else{bx=6;by=rib+40;}
  ctx.fillStyle='#14101a';ctx.fillRect(bx-1,by-1,w+2,h+2);ctx.fillStyle='#f4ecd8';ctx.fillRect(bx,by,w,h);
  if(onS&&MY>by+h){ctx.fillRect(Math.round(clamp(MX,bx+3,bx+w-4))-1,by+h,3,2);ctx.fillRect(Math.round(clamp(MX,bx+3,bx+w-4)),by+h+2,1,2);}
  txt('MASTER KAITO',bx+4,by+3,'#a04030');lines.forEach((s,i)=>txt(s,bx+4,by+12+i*8,'#3a2a3a',1,false));}
 for(const m of trainMarks){const X=sx(m.x,m.y);ctx.globalAlpha=.4+.3*Math.sin(time*5);wdisc(m.x,m.y,10,'#ffe060');ctx.globalAlpha=1;wcirc(m.x,m.y,10+Math.sin(time*5)*2,'#fff');}
 // the trial ribbon at the top
 const head='TRIAL '+(T.i+1)+'/'+LESSONS.length,title=L.t,lines=L.l(),w=Math.min(W-16,Math.max(txtW(head)+txtW(title)*2+30,...lines.map(s=>txtW(s)+12))),x=Math.round((W-w)/2),y=4,h=24+lines.length*8;
 ctx.fillStyle='rgba(10,6,14,.9)';ctx.fillRect(x,y,w,h);ctx.fillStyle='#ffd040';ctx.fillRect(x,y,w,1);ctx.fillRect(x,y+h-1,w,1);
 txt(head,x+5,y+4,'#a08a60');txt(title,x+12+txtW(head),y+2,'#ffe060',2);
 lines.forEach((s,i)=>txt(s,x+6,y+18+i*8,'#e8e0d0'));
 // progress: pips for counts, a bar for timers, ticks for the four abilities
 let prog='';if(L.need&&L.need>1){for(let i=0;i<L.need;i++){ctx.fillStyle=i<T.c?'#ffe060':'#3a3044';ctx.fillRect(x+w-8-(L.need-i)*6,y+5,4,4);}}
 else if(L.timer){prog=Math.max(0,Math.ceil(L.timer-T.t))+'S';}
 else if(T.slots&&L.t==='THE STRAW HORDE'){['q','w','f','e'].forEach((k,i)=>{const on=T.slots.has(k);ctx.fillStyle=on?'#80ff90':'#3a3044';ctx.fillRect(x+w-60+i*7,y+5,5,5);});prog=Math.min(6,T.hk||0)+'/6';}
 if(prog)txt(prog,x+w-5-txtW(prog)-(L.t==='THE STRAW HORDE'?34:0),y+4,'#c8c0b0');
 if(L.survBar&&T.wait<=0){const f=1-Math.min(1,T.t/L.timer);bar(Math.round(W/2-60),y+h+3,120,3,f,'#ffd040','#2a1a2a');}
 // the stamp when a trial is cleared
 if(T.stamp>0){const k=1-T.stamp/1.1,sc=k<.15?3-k*6:2,a=Math.min(1,T.stamp*2);ctx.globalAlpha=a;const s='CLEARED!';txt(s,Math.round(W/2-txtW(s)*sc/2),Math.round(H/2-30),'#80ff90',Math.max(2,Math.round(sc)));ctx.globalAlpha=1;}
 // the result at the end
 if(L.t==='THE ROAD AHEAD'&&T.stars){const s='TRIALS COMPLETE IN '+Math.floor((T.total||0)/60)+':'+String(Math.floor((T.total||0)%60)).padStart(2,'0');txt(s,Math.round(W/2-txtW(s)/2),y+h+6,'#ffe060');
  for(let i=0;i<3;i++){const on=i<T.stars,cx=W/2-14+i*14,cy=y+h+20;ctx.fillStyle=on?'#ffd040':'#3a3044';ctx.fillRect(cx-1,cy-4,3,9);ctx.fillRect(cx-4,cy-1,9,3);ctx.fillRect(cx-2,cy-2,5,5);}
  if(T.paid){const r='+50 JADE FOR THE TEMPLE';txt(r,Math.round(W/2-txtW(r)/2),y+h+30,'#80ff90');}}
 txt('N: SKIP THE TRIALS',4,H-30,'#666');};
// in Master Kaito's trials nothing hurts: bullets (and blows) still hit you, with the flash and the sound so you learn
// what a hit feels like, but your health and posture are left as they were and no damage number appears
{const _hp=hitPlayer;hitPlayer=function(){if(!(R&&R.training&&P))return _hp.apply(this,arguments);const hp=P.hp,pos=P.pos,stag=P.stag,nt=texts.length;
 const r=_hp.apply(this,arguments);P.hp=hp;P.pos=pos;P.stag=stag;for(let i=nt;i<texts.length;i++)if(/^\d+$/.test(texts[i].s)){texts[i].s='HIT';texts[i].col='#ffb0b0';}return r;};}
