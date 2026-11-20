'use strict';
// HELL OF THE EMPEROR - effects, projectiles, combat, deaths (part of the former game.js; files load in numeric order, see index.html)
// ---------- effects ----------
function spark(x,y,col,n,sp){for(let i=0;i<(n||6);i++){const a=Math.random()*TAU,s=rnd(.3,1)*(sp||70);particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,t:rnd(.2,.5),col});}}
function txtFx(x,y,s,col,sc){if(typeof s==='number'&&!meta.opt.dmgNum)return;texts.push({x,y,s:String(s),col:col||'#fff',t:.9,sc:sc||1});}
// shared "this hit hard" feedback: shake, a brief freeze-frame, a screen flash and debris
let flashCol='#fff';
function impact(x,y,col,pow,flash){shake=Math.max(shake,pow);hitstop=Math.max(hitstop,Math.min(.09,pow*.008));if(flash){flashT=Math.max(flashT,.12);flashCol=col;}
 for(let i=0;i<pow*2;i++){const a=Math.random()*TAU,s=rnd(40,60+pow*14);particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,t:rnd(.25,.6),col:i%3?col:'#fff'});}}
function fxRing(x,y,max,col,dur){fx.push({k:'ring',x,y,max,t:dur||.3,dur:dur||.3,col});}

// ---------- projectiles ----------
// enemy bullets hit this many times harder than their listed damage (melee and contact hits are unchanged)
const ESHOT_DMG=2.5;
// the player's bullet hitbox: a round core in screen pixels (HITR_FOCUS is unused since focus mode was removed)
const HITR=2.5,HITR_FOCUS=1.5;
const scrDist=q=>{const s=scrVec(q.x-P.x,q.y-P.y);return Math.hypot(s[0],s[1]);};
function mkProj(from,x,y,a,sp,dmg,o){if(from==='e'&&R&&R.asc)sp*=1+.06*R.asc;return Object.assign({from,x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,r:3,dmg,life:3,col:'#d44',pd:12,pierce:0,hit:new Set(),own:null,peril:false,arrow:false},o||{});}
// bullet styles: how a shot moves after it leaves the gun
function styleOf(a){const s=a.st;if(!s)return {};
 switch(s){case 'wave':return {st:s,wt:0,wa:a.wa||60,wf:a.wf||7};case 'accel':return {st:s,acc:a.acc||1.6,cap:a.cap||220};case 'curve':return {st:s,curve:a.curve||1.2};
  case 'boom':return {st:s,bt:0,bT:a.bT||1.6,life:a.bT?a.bT*1.05:1.7};case 'split':return {st:s,splitT:a.splitT||.9,r:5};case 'mine':return {st:s,fuse:a.fuse||1.3,r:4,life:4};case 'big':return {st:s,r:6};case 'star':return {st:s,r:3};
  case 'bounce':return {st:s,bn:a.bn||2,life:4};case 'seek':return {st:s,turn:a.turn||1.6,seekT:a.seekT||1.6,life:4};
  case 'orbit':return {st:s,ow:a.ow||2.6,orv:a.orv||28,life:a.life||3.2};case 'zig':return {st:s,zT:a.zT||.28,zA:a.zA||.8,zt:0,zs:1,zfirst:1};
  case 'lance':return {st:s,wait:a.wait||.45,life:2.6,r:2};
  case 'stick':return {st:s,sd:a.sd||90,life:a.life||4};}return {st:s};}
function enemyShoot(e,a,ang){if(e.blind>0)return;
 // regular enemies fire ~50% more bullets per volley (more bullet hell)
 const n=e.boss?a.cnt:Math.round(a.cnt*1.5*(a.ring||a.pat==='gapring'||a.pat==='flower'||a.pat==='wall'?1.3:a.pat?1.15:1)+(!a.pat&&!a.ring&&a.cnt>1?1:0)+(a.cnt===1&&!a.pat?1:0)),dm=a.dmg*e.dm,base=Object.assign({own:e,col:a.col,pd:a.pd,r:a.r||3,arrow:a.arrow,spr:a.spr,pool:a.pool},styleOf(a));
 const fire=(an,sp,o,x,y)=>{const q=mkProj('e',x==null?e.x:x,y==null?e.y:y,an,sp==null?a.sp:sp,dm,Object.assign({},base,o||{}));if(q.st==='boom'){q.bd=an;q.bs=sp==null?a.sp:sp;}
  if(q.st==='orbit'){q.ox=q.x;q.oy=q.y;q.oa=an;q.or=6;}if(q.st==='lance'){q.lvx=q.vx;q.lvy=q.vy;q.vx=q.vy=0;}projs.push(q);return q;};
 if(a.pat){const pa=Math.atan2(P.y-e.y,P.x-e.x);e._rep=(e._rep||0)+1;
  switch(a.pat){
   case 'gapring':{const gA=pa+((e._rep%3)-1)*.8,gW=a.gw||.45;for(let i=0;i<n;i++){const an=i/n*TAU+(e._rep*.13);if(Math.abs(angDiff(an,gA))<gW)continue;fire(an);}break;}
   case 'spiral':{e._spi=(e._spi||Math.random()*TAU)+(a.spin||.3);const arms=a.arms||3;for(let i=0;i<arms;i++)fire(e._spi+i/arms*TAU);break;}
   case 'wall':{const px=-Math.sin(pa),py=Math.cos(pa),hole=ri(1,n-3);for(let i=0;i<n;i++){if(i===hole||i===hole+1)continue;const o=(i-(n-1)/2)*9;fire(pa,null,null,e.x+px*o,e.y+py*o);}break;}
   case 'flower':{const off=e._rep*.2;for(let i=0;i<n;i++)fire(off+i/n*TAU,a.sp*(i%2?.6:1));break;}
   case 'stream':{for(let i=0;i<n;i++)fire(pa,a.sp*(.55+i*.12));break;}
   case 'cross':{const off=(e._rep%2)*Math.PI/4+(a.rot||0)*e._rep;for(let i=0;i<(a.dirs||4);i++)for(let j=0;j<n;j++)fire(off+i/(a.dirs||4)*TAU,a.sp*(.7+j*.15));break;}
   case 'mines':{for(let i=0;i<n;i++){const an=Math.random()*TAU,r=rnd(30,75);const x=P.x+Math.cos(an)*r,y=P.y+Math.sin(an)*r;if(solid(x,y))continue;const q=fire(0,0,null,x,y);q.vx=0;q.vy=0;spark(x,y,a.col,4,30);}break;}
   case 'curtain':{for(let i=0;i<n;i++){fire(pa+(i/(n-1)-.5)*1.4,a.sp,{curve:(i%2?1:-1)*(a.curve||.9),st:'curve'});}break;}
   // web: rings of bullets lined up on spokes, expanding like a spider web
   case 'web':{const off=e._rep*.15,rg=a.rings||2;for(let r=0;r<rg;r++)for(let i=0;i<n;i++)fire(off+i/n*TAU,a.sp*(.55+.3*r));break;}
   // rain: telegraphed strikes around you (red circles), then they burst
   case 'rain':{for(let i=0;i<n;i++){const an=Math.random()*TAU,rr=rnd(10,70),x=P.x+Math.cos(an)*rr,y=P.y+Math.sin(an)*rr;if(solid(x,y))continue;dh.push({x,y,r:a.rad||16,t:.9+i*.12,dur:.9+i*.12,dmg:dm*2,col:a.col});}break;}
   // lance: aimed needles that pause with an aim line, then strike fast
   case 'lance':{for(let i=0;i<n;i++)fire(pa+(n>1?(i/(n-1)-.5)*(a.spread||.5):0),a.sp,{st:'lance',wait:(a.wait||.45)+i*.08,life:2.6,r:2});break;}
   // orbit ring: bullets circle the shooter and spiral outward
   case 'orbitring':{for(let i=0;i<n;i++)fire(i/n*TAU+e._rep*.3,0,{st:'orbit',ow:(a.ow||2.6)*(e._rep%2?-1:1),orv:a.orv||28,life:a.life||3.2});break;}
  }
  sfx('shoot');return;}
 if(a.ring){if(a.spin){a._sp=(a._sp||Math.random()*TAU)+a.spin;}const off=a.spin?a._sp:Math.random()*TAU;for(let i=0;i<n;i++)fire(off+i/n*TAU);}
 else for(let i=0;i<n;i++){const o=n===1?0:(i/(n-1)-.5)*a.spread*2;fire(ang+o,null,{r:a.arrow?2:(base.r||3)});}
 sfx('shoot');
}

// ---------- combat ----------
function wake(e){if(e.awake)return;e.awake=true;if(!e.boss)for(const o of enemies)if(o.room===e.room&&!o.boss)o.awake=true;}
function checkBreak(e){if(e.stag<=0&&e.posture>=e.maxPosture){e.stag=e.boss?3:3.5;e.act=null;e.tele=0;e.posture=e.maxPosture;e.air=false;e.z=0;txtFx(e.x,e.y,'STUNNED!','#fd4');sfx('break');trainEv('break');hitstop=.08;shake=Math.max(shake,4);spark(e.x,e.y,'#fd4',14,90);}}
function hurtE(e,dmg,pd,o){
 if(e.dead||e.air||e.iv>0)return;
 o=o||{};
 // which slot did this hit come from? abilities (not LMB) also carry enchants + scroll add-ons
 const src=o.src!==undefined?o.src:castSrc,AF=src&&src!=='m'&&!o.chain&&R?abFx(src):null;
 if(src==='m'&&!o.chain&&P&&P.sig)dmg*=SIGBONUS; // signature weapon bonus
 // deathblows need the Mortal Edge item; without it, staggered foes just take +50% damage
 if(e.stag>0&&o.slash&&S.dblow){deathblow(e);return;}if(e.stag>0)dmg*=1.5;
 let crit=false;if(o.slash&&Math.random()<S.crit+(AF?AF.crit:0)){dmg*=2;crit=true;}
 if(crit&&src==='m'&&!o.chain&&CLS().k==='shinobi')e.shadowMark=R.time+4;
 if(freezeT>0)dmg*=1.4;
 if(S.storm&&e.st&&(e.st.shock>0||e.st.burn>0))dmg*=1+.2*S.storm;
 if(e.st&&e.st.frozen>0&&!o.nost){dmg*=1.5;e.st.frozen=0;txtFx(e.x,e.y,'SHATTER','#cff');spark(e.x,e.y,'#cff',10,80);}
 if(e.elite==='armored')dmg*=.8;
 if((e.boss||e.elite)&&upLv('bossd'))dmg*=1+.08*upLv('bossd'); // SLAYER (skill tree)
 if(e.boss&&BKIT[e.name]&&BKIT[e.name].dmgMod)dmg*=BKIT[e.name].dmgMod(e); // arena effects (war banners, dazzled by lanterns...)
 if(P&&P.rage>0)dmg*=1.3;
 const ironPower=R&&P&&P.ironBellyUntil>R.time&&!o.foe?1+P.ironBellyPower:1;
 const preIronDamage=dmg;
 dmg*=ironPower;e.hp-=dmg;
 // run stats: damage per source slot (m h q w f e), everything else (relics, procs, reflects) is 'x'
 if(R){R.dmg=R.dmg||{};const sk=src&&'mhqwfe'.includes(src)?src:'x';R.dmg[sk]=(R.dmg[sk]||0)+Math.max(0,dmg);}e.posture+=pd;e.pdelay=1.8;e.flash=.12;wake(e);
 const big=dmg>=S.atk*1.8;
 if(o.kb!=null&&!e.boss){const km=(e.elite==='armored'?.3:1)*(o.kbm||(big?1.6:1));e.kx+=Math.cos(o.kb)*90*km;e.ky+=Math.sin(o.kb)*90*km;}
 if(big){e.flash=.18;spark(e.x,e.y,crit?'#ff4':'#fff',8,90);}
 // feel of power without screen shake: the foe recoils from the hit, big hits and crits burst, and hits build a combo
 {const ka=o.kb!=null?o.kb:(P?Math.atan2(e.y-P.y,e.x-P.x):0),kp=Math.min(5,1.5+dmg/Math.max(1,S.atk)*1.2);e.kick={a:ka,p:kp,t:.12};}
 if(big||crit)fx.push({k:'burst',x:e.x,y:e.y,t:.16,dur:.16,r:crit?26:18,n:crit?10:7,a0:Math.random(),col:crit?'#ff4':'#fff'});
 if(R&&!o.chain){R.combo=(time-(R.comboAt||-9)<2?(R.combo||0):0)+1;R.comboAt=time;R.bestCombo=Math.max(R.bestCombo||0,R.combo);if(R.combo%25===0){txtFx(P.x,P.y-14,R.combo+' HIT COMBO!','#ffd040',2);fx.push({k:'burst',x:P.x,y:P.y,t:.25,dur:.25,r:34,n:14,a0:0,col:'#ffd040'});}}
 txtFx(e.x,e.y,Math.round(dmg),crit?'#ff4':big?'#ffd080':'#fff',big&&dmg>=S.atk*3?2:1);if(!o.impactCue)sfx('hit');spark(e.x,e.y,crit?'#ff4':'#fff',4,50);
 if(o.slash&&!o.nost){
  if(o.el)applyStatus(e,o.el);
  if(S.burn&&Math.random()<.35+.15*S.burn)applyStatus(e,'burn');
  if(S.poison)applyStatus(e,'poison');
  if(S.frost&&Math.random()<.3+.15*S.frost)applyStatus(e,'chill');
  if(S.shock&&Math.random()<.18*S.shock){applyStatus(e,'shock');let nx=null,nd=70;for(const o2 of enemies){if(o2===e||o2.dead||o2.air||!los(e.x,e.y,o2.x,o2.y))continue;const d=dist(o2,e);if(d<nd){nd=d;nx=o2;}}if(nx){fx.push({k:'bolt',pts:[{x:e.x,y:e.y},{x:nx.x,y:nx.y}],t:.15,dur:.15});hurtE(nx,S.atk*.7,8,{nost:true,chain:true});}}
  if(S.vamp)P.hp=Math.min(S.maxhp,P.hp+dmg*.02*S.vamp);
  if(crit&&S.flare){fxRing(e.x,e.y,30,'#fd4',.25);for(const o2 of enemies){if(o2===e||o2.dead||o2.air)continue;if(dist(o2,e)<30+o2.r&&los(e.x,e.y,o2.x,o2.y))hurtE(o2,preIronDamage*.5,10,{nost:true,chain:true});}}
 }
 // ability effects from enchants and scroll add-ons (also on zone/blast ticks, so traps and storms count)
 if(AF){
  if(AF.leech)P.hp=Math.min(S.maxhp,P.hp+dmg*.02*AF.leech);
  if(AF.blast){fxRing(e.x,e.y,26,'#fa4',.18);for(const o2 of enemies){if(o2===e||o2.dead||o2.air||dist(o2,e)>26+o2.r||!los(e.x,e.y,o2.x,o2.y))continue;hurtE(o2,preIronDamage*.3*AF.blast,4,{nost:true,chain:true});}}
  if(AF.gale&&e.hp>0){e.posture+=pd*.5*AF.gale;if(!e.boss&&P){const a=Math.atan2(e.y-P.y,e.x-P.x);e.kx+=Math.cos(a)*70*AF.gale;e.ky+=Math.sin(a)*70*AF.gale;}}
  if(e.hp>0){
   if(AF.burn&&Math.random()<AF.burn)applyStatus(e,'burn');
   if(AF.poison)applyStatus(e,'poison');
   if(AF.chill&&Math.random()<AF.chill)applyStatus(e,'chill');
   if(AF.shock&&Math.random()<AF.shock){applyStatus(e,'shock');let nx=null,nd=70;for(const o2 of enemies){if(o2===e||o2.dead||o2.air||!los(e.x,e.y,o2.x,o2.y))continue;const d=dist(o2,e);if(d<nd){nd=d;nx=o2;}}
    if(nx){fx.push({k:'bolt',pts:[{x:e.x,y:e.y},{x:nx.x,y:nx.y}],t:.15,dur:.15});hurtE(nx,S.atk*.5,6,{nost:true,chain:true});}}
  }
 }
 if(e.hp<=0){killE(e);return;}
 checkBreak(e);
}
function deathblow(e){
 hitstop=.18;shake=Math.max(shake,8);sfx('break');R.deathblows++;
 txtFx(e.x,e.y,'DEATHBLOW','#f33');spark(e.x,e.y,'#f33',24,110);fxRing(e.x,e.y,30,'#f33',.3);
 if(S.dbHeal)P.hp=Math.min(S.maxhp,P.hp+S.maxhp*S.dbHeal);
 if(e.boss&&!(e.iv>0)){e.hp-=e.maxhp*.03;e.stag=0;e.posture=0;e.pdelay=2.5;e.cd=1.3;if(e.hp<=0)killE(e);}
 else killE(e);
}
function killE(e){
 if(e.dead)return;
 // arena props (banners, egg sacs...) just break: no loot, no kill count
 if(e.prop){e.dead=true;spark(e.x,e.y,e.propCol||'#c8a060',14,70);sfx('break');if(e.onBreak)e.onBreak(e);return;}
 e.dead=true;R.kills++;if(e.boss&&!R.training&&!R.test&&!R.rush)R.masteryBosses=(R.masteryBosses||0)+1;R.lastKill={x:e.x,y:e.y};G('e',e.boss?'boss'+e.di:e.type);
 // kill punch: a burst of speed-lines; elites and bosses also get a brief slow-motion beat
 fx.push({k:'burst',x:e.x,y:e.y,t:.2,dur:.2,r:e.boss?60:e.elite?40:22,n:e.boss?18:e.elite?14:9,a0:Math.random(),col:e.boss?'#ffd040':e.elite?'#f84':'#fff'});
 if(e.elite||e.boss){slowT=Math.max(slowT,e.boss?.6:.25);hitstop=Math.max(hitstop,.06);}
 if(R.training){trainEv('kill');spark(e.x,e.y,'#d8b860',14,70);return;}deathFx(e);sfx('kill');spark(e.x,e.y,e.boss?'#fd4':'#c33',e.boss?40:12,e.boss?140:80);
 if(S.kills)P.hp=Math.min(S.maxhp,P.hp+S.kills);
 if(!e.boss)P.ab.e=Math.max(0,P.ab.e-1.2*(1+S.ecd));
 if(e.elite==='volatile'){dh.push({x:e.x,y:e.y,r:34,t:.9,dur:.9,dmg:20*e.dm,col:'#f64'});txtFx(e.x,e.y,'VOLATILE!','#f64');}
 dropLoot(e);
 if(e.boss)onBossDead(e);
}
function dropPickup(x,y,k,v,id){const a=Math.random()*TAU,s=rnd(20,50);pickups.push({x,y,k,v,id,vx:Math.cos(a)*s,vy:Math.sin(a)*s,t:0});}
function dropLoot(e){
 const di=R.di,base=Math.round(rnd(2,4)*(1+di*.3)*S.sen*(e.boss?18:1));
 const n=e.boss?10:ri(1,2);for(let i=0;i<n;i++)dropPickup(e.x,e.y,'sen',Math.max(1,Math.round(base/n)));
 if(e.boss){dropBag(e.x+20,e.y+24,Math.random()<.14?GOLDBAG:TROPHY,true);return;} // the white royal bag is a rare boss prize
 // a promised bag (from a curse) drops from the next foe you kill
 if(R.bonusBag!=null){dropBag(e.x,e.y,R.bonusBag);R.bonusBag=null;}
 if(e.dropBag!=null)dropBag(e.x+8,e.y,e.dropBag);
 const LT=LOOT[lootKind(e)],lk=1/(1+.15*(R.asc||0));
 for(let i=0;i<LT.gold;i++)dropPickup(e.x,e.y,'sen',base);
 if(Math.random()<LT.pot)dropPickup(e.x,e.y,'pot',1);
 // bags: only heavies and elites carry them; basic foes never do
 for(const [tier,ch] of LT.bags)if(Math.random()<ch*lk){dropBag(e.x,e.y,tier==='good'?(R.di>=1?goodBag():2):tier);break;}
}
// ---- loot tables: what each kind of foe can drop ----
// basic: gold and the odd potion. heavy (brutes, shield bearers...): more gold, sometimes a plain bag. elite: a good bag.
const LOOT={
 basic:{gold:0,pot:.04,bags:[]},
 heavy:{gold:2,pot:.08,bags:[[2,.06],[1,.14],[0,.3]]},
 elite:{gold:4,pot:.4,bags:[['good',1]]}};
const lootKind=e=>e.elite?'elite':((ET[e.type]&&ET[e.type].hp)||0)>=70?'heavy':'basic';
function onBossDead(e){
 // the evolution now happens in the master cutscene after the portal, not here
 sfx('win');hitstop=.3;shake=10;boss=null;setToast('BOSS DEFEATED','#fd4',3);R.evoPending=(P.evo||0)<WIZEVO.length-1;
 const ex=[];chooseOpts=[];for(let i=0;i<3;i++){const it=randItem(ex);ex.push(it.id);chooseOpts.push(it);}
 portal={x:e.x,y:e.y,t:0,pending:true};
 // let the evolution play out in full before the reward cards cover the screen
 setTimeout(()=>{if(mode==='play'&&portal&&portal.pending)mode='choose';},1400);
}
function pickChoice(i){if(!chooseOpts||!chooseOpts[i])return;applyItem(chooseOpts[i].id);chooseOpts=null;portal.pending=false;mode='play';sfx('pickup');setToast('PORTAL OPEN','#8cf',3);}
function clickChoose(){if(!chooseOpts)return;const cw=92,gap=8,x0=Math.round((W-(3*cw+2*gap))/2);for(let i=0;i<3;i++){const x=x0+i*(cw+gap);if(mouse.x>=x&&mouse.x<=x+cw&&mouse.y>=44&&mouse.y<=136){pickChoice(i);return;}}}
function applyItem(id){
 R.inv[id]=(R.inv[id]||0)+1;G('r',id);const old=S;S=calcStats();
 if(id==='hp')P.hp+=20;if(id==='gourd')R.pots=Math.min(POTMAX,R.pots+1);if(id==='rez'||id==='phoenix')P.rez++;
 P.hp=Math.min(P.hp,S.maxhp);setToast(fxLabel(ITEMBY[id].name,ITEMBY[id].r+1)+': '+ITEMBY[id].d,fxCol(id),2.5);
}
