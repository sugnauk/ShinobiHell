'use strict';
// SHINOBIDUNGEONS - story encounters. The Emperor's purge has filled the province with prisoners. On most stages one of
// them is held in a cage in a fight room (the Iron Cellars hold two). Clear the room, break the cage (G) and they join
// your cause: each gives something at once, sits with you and Master Kaito at the campfire between stages, and helps
// for the rest of the run.
//  HANZO THE SMITH     - reforges your weapon at the next campfire: +5 power for the rest of the run
//  OYUKI THE HEALER    - restores 25% max HP on rescue and at each campfire
//  GENJI THE PEDDLER   - gives you 30 gold; every shop after this is 10% cheaper
//  AYA THE SCOUT       - from the next stage on, every stage's map is revealed when you arrive
//  TAKEDA THE RONIN    - fights at your side for the rest of the run
const ALLY_HEAL=.25,ALLY_GOLD=30,ALLY_SHOP_DISCOUNT=.10;
const ALLIES={
 smith:{n:'HANZO THE SMITH',c:'#ff9a50',cls:'samurai',f:'grayscale(.6) sepia(.5) brightness(.9)',st:[2,5,7],
  free:'THEY CHAINED ME TO THEIR FORGES TO MAKE BLADES FOR THE EMPEROR. FIND ME AT YOUR FIRE - I WILL MAKE ONE FOR YOU.',
  camp:'GIVE ME YOUR BLADE. ...THERE. IT WILL CUT TRUER NOW.',gift:'+5 POWER',now:null},
 healer:{n:'OYUKI THE HEALER',c:'#70e090',cls:'onmyoji',f:'hue-rotate(110deg) saturate(.8)',st:[1,3,6],
  free:'THE TEMPLE SENT ME TO TEND THE VILLAGES. THE EMPEROR SENT ME HERE. LET ME MEND YOU.',
  camp:'SIT. YOUR WOUNDS FIRST, THEN THE MARCH. I WILL BE AT EVERY FIRE.',gift:'HEALS '+cdPct(ALLY_HEAL)+' MAX HP AT CAMPFIRES',now:'heal'},
 peddler:{n:'GENJI THE PEDDLER',c:'#ffd040',cls:null,f:'',st:[0,3,7],
  free:'MY CARAVAN WAS SEIZED FOR "TAXES". TAKE THIS - AND TELL THE TRADERS GENJI SENT YOU.',
  camp:'I HAVE SENT WORD AHEAD. EVERY TRADER ON THE ROAD WILL GIVE YOU A FAIR PRICE.',gift:'SHOPS '+cdPct(ALLY_SHOP_DISCOUNT)+' CHEAPER',now:'gold'},
 scout:{n:'AYA THE SCOUT',c:'#80c0ff',cls:'archer',f:'hue-rotate(-40deg) saturate(.7)',st:[0,4,9],
  free:'I WAS MAPPING THEIR PATROLS WHEN THEY CAUGHT ME. I WILL GO AHEAD OF YOU NOW.',
  camp:'I HAVE WALKED THE NEXT STAGE ALREADY. HERE - EVERY ROOM, EVERY DOOR.',gift:'MAPS REVEALED',now:null},
 ronin:{n:'TAKEDA THE RONIN',c:'#e04050',cls:'samurai',f:'hue-rotate(160deg) saturate(.7) brightness(.85)',st:[5,7,8],
  free:'I SERVED THE OLD LORD OF THESE WALLS. HIS SWORD IS YOURS UNTIL THE EMPEROR FALLS.',
  camp:'I WILL WALK BESIDE YOU. KEEP THEM OFF MY LEFT AND I WILL KEEP THEM OFF YOURS.',gift:'FIGHTS AT YOUR SIDE',now:null},
 villager:{n:'WATCHTOWER PRISONER',c:'#b6d08b',cls:null,st:[],
  free:'YOU BROKE THE LOCK! TAKE THIS MEDICINE. I CAN FIND MY WAY BACK TO THE VILLAGE.',gift:'+1 HP POTION'}};
const ALLYK=Object.keys(ALLIES);
const allyHas=k=>!!(R&&R.allies&&R.allies.includes(k));
// ---------- the captive's look: a tinted hero sheet or the trader sprite ----------
const ALLYSPR={};
function allySpr(k){if(ALLYSPR[k])return ALLYSPR[k];const A=ALLIES[k];if(!A.cls)return ALLYSPR[k]=MERCH;
 const s=heroSpr(A.cls,0),c=document.createElement('canvas');c.width=s.c.width;c.height=s.c.height;const g=c.getContext('2d');g.filter=A.f||'none';g.drawImage(s.c,0,0);
 return ALLYSPR[k]=Object.assign({},s,{c,_av:null});}
const allyFrame=(k,t)=>ALLIES[k].cls?WIZ.idle[Math.floor(t*2.5)%2]:Math.floor(t*1.6)%2;
// ---------- placing the cages ----------
{const _ld=loadDungeon;loadDungeon=function(di){const r=_ld.apply(this,arguments);try{if(R&&!R.training&&!R.rush&&map&&!map.train)placeCaptives(di);if(allyHas('scout')&&R.scoutFrom!=null&&di>=R.scoutFrom)revealAll();spawnRonin();}catch(e){console.error(e);}return r;};}
function placeCaptives(di){R.allies=R.allies||[];
 // The prologues share Stage I's index. Use a local rescue instead of the campaign recruit pool.
 const pro=prologueLoot();
 if(pro&&(R.pro!==3||R.proRescued))return;
 const want=pro?['villager']:ALLYK.filter(k=>!R.allies.includes(k)&&ALLIES[k].st.includes(di));if(!want.length)return;
 const n=pro?1:DUN[di].name==='IRON CELLARS'?2:(Math.random()<.65?1:0);if(!n)return;
 const rooms=map.rooms.filter(r=>r.k==='room'&&r!==map.bossRoom&&['combat','elite','trap'].includes(r.type)&&enemies.some(e=>!e.dead&&e.room===r));
 for(let i=0;i<n&&want.length&&rooms.length;i++){const k=want.splice(ri(0,want.length-1),1)[0],r=rooms.splice(ri(0,rooms.length-1),1)[0];
  let c=roomCenter(r);if(blocked(c.x,c.y,10)){for(let t=0;t<30;t++){const s=spotIn(r);if(!blocked(s.x,s.y,10)){c=s;break;}}}
  props.push({k:'cage',x:c.x,y:c.y,room:r,ally:k});}}
const cageLocked=p=>!!(p&&p.k==='cage'&&!p.used&&enemies.some(e=>!e.dead&&e.room===p.room));
// ---------- freeing them ----------
{const _in=interact;interact=function(){const b=typeof nearBag==='function'?nearBag():null;const p=(!b||!b.items||!b.items.length)?nearProp():null;
 if(!p||p.k!=='cage')return _in.apply(this,arguments);
 if(cageLocked(p)){txtFx(P.x,P.y,'DEFEAT THE GUARDS FIRST','#c55');sfx('block');return;}
 freeAlly(p);};}
function healFromAlly(fraction){
 P.hp=Math.min(S.maxhp,P.hp+S.maxhp*fraction);fxRing(P.x,P.y,24,'#6f6',.4);sfx('heal');
}
function freeAlly(p){
 if(p.used)return;
 const k=p.ally,A=ALLIES[k];p.used=true;p.freedAt=time;
 sfx('break');sfx('rare');shake=Math.max(shake,4);spark(p.x,p.y,'#c8a060',18,90);spark(p.x,p.y-10,A.c,16,70);fxRing(p.x,p.y,22,A.c,.5);
 if(k==='villager'){
  if(R.proRescued)return;
  R.proRescued=true;
  if(R.pots<POTMAX){R.pots++;setToast(A.gift,A.c,3.5);}
  else{healFromAlly(POTHEAL);setToast('PRISONER FREED - MEDICINE RESTORES HEALTH',A.c,3.5);}
  return;
 }
 R.allies=R.allies||[];if(!R.allies.includes(k))R.allies.push(k);
 R.allyNew=R.allyNew||[];R.allyNew.push(k);
 if(A.now==='heal')healFromAlly(ALLY_HEAL);
 if(A.now==='gold')dropPickup(p.x,p.y,'sen',ALLY_GOLD);
 if(k==='scout')R.scoutFrom=R.di+1;
 if(k==='ronin'){R.roninFrom=R.di;spawnRonin(p.x,p.y);}
 setToast(A.n+' JOINS YOUR CAUSE - '+A.gift,A.c,3.5);
}
// ---------- the cage, the captive, and what they say ----------
{const _ik=imarkKind;imarkKind=function(p){if(p&&p.k==='cage')return p.used||cageLocked(p)?null:'cage';return _ik.apply(this,arguments);};
 IMARK.cage={c:p=>ALLIES[p.ally].c,ico:'cage'};}
{const _dp=drawProp;drawProp=function(p){if(p.k==='ronin')return drawRonin(p);if(p.k!=='cage')return _dp.apply(this,arguments);
 const X=sx(p.x,p.y),Y=sy(p.x,p.y),A=ALLIES[p.ally],O='#14101a',up=p.used?clamp((time-p.freedAt)/1.2,0,1):0;
 shadow(X,Y+3,16);
 // the captive: kneeling (drawn a little low) until freed, then standing, waving, and fading away to your camp
 if(up<1){const s=allySpr(p.ally);ctx.globalAlpha=p.used?Math.max(0,1-(time-p.freedAt-2.4)/.8):1;if(ctx.globalAlpha>0)drawSpr(s,X,Y+(p.used?2:6),false,allyFrame(p.ally,time),sx(P.x,P.y)<X);ctx.globalAlpha=1;}
 else if(time-p.freedAt<3.2){const s=allySpr(p.ally);ctx.globalAlpha=Math.max(0,1-(time-p.freedAt-2.4)/.8);drawSpr(s,X,Y+2,false,allyFrame(p.ally,time),sx(P.x,P.y)<X);ctx.globalAlpha=1;}
 // the cage: a wooden frame and bars, bound with rope; once broken, the bars lie scattered
 if(!p.used){ctx.fillStyle=O;ctx.fillRect(X-13,Y-34,27,3);ctx.fillRect(X-13,Y+2,27,3);
  for(let i=0;i<6;i++){const x=X-12+i*5;ctx.fillStyle=O;ctx.fillRect(x-1,Y-32,3,35);ctx.fillStyle=i%2?'#6a4428':'#7e5432';ctx.fillRect(x,Y-32,1,35);}
  ctx.fillStyle='#8a5a34';ctx.fillRect(X-12,Y-33,25,1);ctx.fillRect(X-12,Y+3,25,1);ctx.fillStyle='#c8a868';ctx.fillRect(X-12,Y-14,25,1);
  ctx.fillStyle=O;ctx.fillRect(X-2,Y-17,5,7);ctx.fillStyle='#f4ecd0';ctx.fillRect(X-1,Y-16,3,5);ctx.fillStyle=Math.floor(time*3)%2?'#ff3030':'#c01010';ctx.fillRect(X,Y-15,1,3);}
 else for(let i=0;i<6;i++){const a=hash(i,p.x|0)*TAU,d=10+hash(i,7)*10,x=Math.round(X+Math.cos(a)*d),y=Math.round(Y+Math.sin(a)*d*.5);ctx.fillStyle=O;ctx.fillRect(x-4,y-1,9,3);ctx.fillStyle='#6a4428';ctx.fillRect(x-3,y,7,1);}
 // their words
 if(!p.used&&dist(p,P)<90){const s=cageLocked(p)?'HELP! THEY HOLD ME HERE!':'PLEASE... BREAK THE LOCK!';txt(s,X-Math.round(txtW(s)/2),Y-46,A.c);}
 if(p.used&&time-p.freedAt<3.2){const L=wrapTxt(A.free,44);L.slice(0,3).forEach((l,i)=>txt(l,X-Math.round(txtW(l)/2),Y-60+i*8,'#fff'));txt(A.n,X-Math.round(txtW(A.n)/2),Y-68,A.c);}};}
{const _ic=imarkIcon;imarkIcon=function(kind,x,y,c){if(kind!=='cage')return _ic.apply(this,arguments);const O='#14101a';ctx.fillStyle=O;ctx.fillRect(x-4,y-4,9,9);ctx.fillStyle=c;for(let i=0;i<4;i++)ctx.fillRect(x-3+i*2,y-3,1,7);ctx.fillRect(x-3,y-3,7,1);ctx.fillRect(x-3,y+3,7,1);};}
// the prompt at the bottom of the screen
{const _hud=drawHUD;drawHUD=function(){_hud.apply(this,arguments);if(mode!=='play'||!P)return;const b=typeof nearBag==='function'?nearBag():null;if(b)return;const p=nearProp();if(!p||p.k!=='cage')return;
 const A=ALLIES[p.ally],s=cageLocked(p)?'LOCKED - DEFEAT EVERY GUARD IN THE ROOM':'G: FREE '+A.n+' ('+A.gift+')';ctx.fillStyle='#100d18';ctx.fillRect(Math.round((W-txtW(s))/2)-3,H-46,txtW(s)+6,9);ctxt(s,H-44,A.c);};}
// ---------- the gifts ----------
// peddler: every shop is cheaper
{const _pr=populateRoom;populateRoom=function(r,di){const n0=props.length;_pr.apply(this,arguments);if(r.type==='shop'&&allyHas('peddler'))for(let i=n0;i<props.length;i++){const p=props[i];if(p.k==='pedestal'&&p.price&&!p.relicStand)p.price=Math.round(p.price*(1-ALLY_SHOP_DISCOUNT));}
 if(r.type==='shop'&&allyHas('peddler'))for(const p of props)if(p.k==='merchant'&&p.room===r)p.line='GENJI SENT YOU? A FRIEND\'S PRICE, THEN.';};}
{const _st=stockRelics;stockRelics=function(c,r,di){const o=_st.apply(this,arguments);if(allyHas('peddler'))for(const p of props){if(p.room===r&&p.k==='pedestal'&&p.relicStand&&p.price&&!p._gd){p.price=Math.round(p.price*(1-ALLY_SHOP_DISCOUNT));p._gd=1;}}return o;};}
// scout: the stage map
function revealAll(){if(!map||!map.expl)return;for(let i=0;i<map.expl.length;i++)if(map.t[i])map.expl[i]=1;}
// ---------- TAKEDA THE RONIN: an ally who fights beside you ----------
function spawnRonin(x,y){if(!allyHas('ronin')||!P||props.some(p=>p.k==='ronin'))return;props.push({k:'ronin',used:true,x:x||P.x-14,y:y||P.y+6,cd:.6,sw:0,fx:1,tgt:null,walk:0});}
const RONIN_RANGE=150;
{const _u=update;update=function(dt){_u.apply(this,arguments);if(mode!=='play'||!P)return;const rn=props.find(p=>p.k==='ronin');if(!rn)return;
 rn.cd-=dt;rn.sw=Math.max(0,rn.sw-dt);
 // pick the nearest awake foe near you, else stay at your shoulder
 let tg=null,bd=RONIN_RANGE;for(const e of enemies){if(e.dead||e.air||!e.awake||e.prop)continue;const d=Math.hypot(e.x-P.x,e.y-P.y);if(d<bd){bd=d;tg=e;}}
 const goal=tg?{x:tg.x,y:tg.y}:{x:P.x-18*Math.cos(P.ang||0),y:P.y-18*Math.sin(P.ang||0)},dx=goal.x-rn.x,dy=goal.y-rn.y,d=Math.hypot(dx,dy);
 if(d>(tg?(tg.r||6)+10:14)){const sp=(tg?92:Math.min(140,60+d*1.5))*dt,nx=rn.x+dx/d*sp,ny=rn.y+dy/d*sp;if(!blocked(nx,rn.y,4))rn.x=nx;if(!blocked(rn.x,ny,4))rn.y=ny;rn.walk+=dt;}
 if(Math.abs(dx)>2)rn.fx=dx<0?-1:1;
 if(Math.hypot(rn.x-P.x,rn.y-P.y)>260){rn.x=P.x-12;rn.y=P.y+8;spark(rn.x,rn.y,'#e04050',8,50);}
 // the cut: a wide arc that hurts everything in front of him
 if(tg&&d<(tg.r||6)+16&&rn.cd<=0){rn.cd=.75;rn.sw=.22;const a=Math.atan2(dy,dx);rn.ang=a;sfx('slash');
  for(const e of enemies){if(e.dead||e.air)continue;const ex=e.x-rn.x,ey=e.y-rn.y,ed=Math.hypot(ex,ey);if(ed>(e.r||6)+22)continue;let da=Math.atan2(ey,ex)-a;da=Math.atan2(Math.sin(da),Math.cos(da));if(Math.abs(da)>1.2)continue;
   hurtE(e,S.atk*(e.boss?.35:.7),6,{chain:true,src:'x',kb:a});}
  spark(rn.x+Math.cos(a)*14,rn.y+Math.sin(a)*14,'#ffe0e0',6,80);}};}
function drawRonin(p){const X=sx(p.x,p.y),Y=sy(p.x,p.y),s=allySpr('ronin');shadow(X,Y+3,12);
 const fr=p.sw>0?(WIZ.atk?WIZ.atk[0]:WIZ.idle[0]):(p.walk>0&&Math.hypot(p.x-P.x,p.y-P.y)>16&&WIZ.walk?WIZ.walk[Math.floor(time*8)%WIZ.walk.length]:WIZ.idle[Math.floor(time*2.5)%2]);
 drawSpr(s,X,Y+2,false,fr,p.fx<0);
 if(p.sw>0){const a=p.ang||0,k=1-p.sw/.22;ctx.strokeStyle='#ffe8e8';ctx.globalAlpha=.8*(1-k);ctx.lineWidth=2;ctx.beginPath();ctx.arc(X,Y-8,16,a-1.1+k*.4,a+1.1+k*.4);ctx.stroke();ctx.globalAlpha=1;ctx.lineWidth=1;}
 txt('TAKEDA',X-Math.round(txtW('TAKEDA')/2),Y-30,'#e04050');}
// ---------- the campfire: your allies sit with you and give their gifts ----------
const ALLYSEAT=[[126,134],[196,134],[50,134],[264,134],[22,134]];
{const _om=openMaster;openMaster=function(){const r=_om.apply(this,arguments);if(!CS)return r;const L=[];
 for(const k of (R.allyNew||[]))L.push({k,s:ALLIES[k].camp});R.allyNew=[];
 if(allyHas('smith')&&!R.smithDone){R.smithDone=1;bless('atk',5);if(!L.some(x=>x.k==='smith'))L.push({k:'smith',s:ALLIES.smith.camp});}
 if(allyHas('healer')){healFromAlly(ALLY_HEAL);if(!L.some(x=>x.k==='healer'))L.push({k:'healer',s:'REST. I HAVE TREATED YOUR WOUNDS.'});}
 CS.ally=L;CS.allyAt=time;return r;};}
{const _am=advanceMaster;advanceMaster=function(){if(CS&&CS.ally&&CS.ally.length){if(time-CS.allyAt<.25)return;CS.ally.shift();CS.allyAt=time;CS.pageAt=time;CS.t0=time;CS.revealed=false;sfx('pickup');return;}return _am.apply(this,arguments);};}
{const _mc=masterCamp;masterCamp=function(t,accent){_mc.apply(this,arguments);if(!R||!R.allies)return;
 R.allies.forEach((k,i)=>{
  const [x,y]=ALLYSEAT[i]||ALLYSEAT[0],s=allySpr(k),peddler=k==='peddler',scale=peddler?1:(s.sc||1)*1.6;
  shadow(x,y,peddler?12:18);
  drawSpr({...s,sc:scale},x,y,false,allyFrame(k,time+i*.37),x>160);
  if(CS?.ally?.[0]?.k===k){ctx.fillStyle=ALLIES[k].c;ctx.fillRect(x-1,y-(peddler?40:62)+Math.round(Math.sin(time*5)*2),3,3);}
 });};}
{const _rm=renderMaster;renderMaster=function(){_rm.apply(this,arguments);if(!CS||!CS.ally||!CS.ally.length)return;const it=CS.ally[0],A=ALLIES[it.k],y=139;
 ctx.fillStyle='#17121d';ctx.fillRect(11,y+1,W-22,26);const t=time-CS.allyAt,sh=wrapTxt(it.s.slice(0,Math.floor(t*52)+1),70);
 txt(A.n,16,y+4,A.c);txt(A.gift,W-16-txtW(A.gift),y+4,'#ffd040');sh.slice(0,2).forEach((l,i)=>txt(l,16,y+12+i*7,'#e1d2cb'));};}
// ---------- the guide and the end of the run ----------
{const _re=renderEnd;renderEnd=function(){_re.apply(this,arguments);if(!R||!R.allies||!R.allies.length)return;const s='ALLIES FREED: '+R.allies.map(k=>ALLIES[k].n.split(' ')[0]).join(', ');txt(s,8,H-10,'#c8a060');};}
