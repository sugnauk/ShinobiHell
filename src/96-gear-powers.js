'use strict';
// HELL OF THE EMPEROR - gear abilities. Weapons, armour and rings can carry an ABILITY that changes how you play:
//  RARE gear rolls one MINOR ability, EPIC gear one MAJOR ability, and every LEGENDARY has its own signature ability at
//  double strength. A few rare relics grant abilities too. Abilities of the same kind stack.
// g.pw = [{k, l}] on gear (k = ability, l = level). PWL(k) sums the levels you have equipped / carry.
const GPW={
 // ---- minor (rare and up) ----
 kindle:{n:'KINDLING',t:0,slot:'wpn ring',d:l=>'KILLS LEAVE A PATCH OF FIRE'+(l>1?' (BIGGER)':'')},
 reach:{n:'LONG REACH',t:0,slot:'wpn',d:l=>'+'+20*l+'% RANGE'},
 thorns:{n:'THORNS',t:0,slot:'arm',d:l=>'WHEN HIT, '+6*l+' NEEDLES FLY OUT'},
 mend:{n:'MENDING',t:0,slot:'arm',d:l=>'HEAL '+(.6*l).toFixed(1)+'% HP/S IF UNHIT FOR 3S'},
 quick:{n:'QUICKSILVER',t:0,slot:'arm ring',d:l=>'KILLS GIVE '+(1.5*l)+'S OF HASTE'},
 grazer:{n:'GRAZE HUNGER',t:0,slot:'ring',d:l=>'EVERY 8 GRAZES HEAL '+2*l+'%'},
 bounty:{n:'BOUNTY',t:0,slot:'ring',d:l=>'+'+2*l+' GOLD PER KILL'},
 focus:{n:'FOCUS',t:0,slot:'ring',d:l=>'-'+cdPct(1-Math.pow(1-COOLDOWN.gearFocus,l))+' COOLDOWNS'},
 ward:{n:'WARDING',t:0,slot:'arm',d:l=>10*l+'% CHANCE TO SHRUG OFF A BULLET'},
 // ---- major (epic and up) ----
 firetrail:{n:'FIRE TRAIL',t:1,slot:'arm',d:l=>'WALKING LEAVES A TRAIL OF FIRE'+(l>1?' (HOTTER)':'')},
 frostnova:{n:'FROST NOVA',t:1,slot:'arm',d:l=>'WHEN HIT: A FREEZING BLAST CLEARS NEARBY BULLETS ('+Math.round(8/l)+'S)'},
 orbits:{n:'SPIRIT ORBS',t:1,slot:'ring',d:l=>(1+l)+' ORBS CIRCLE YOU, BLOCK BULLETS, BURN FOES'},
 chain:{n:'CHAIN LIGHTNING',t:1,slot:'wpn',d:l=>'HITS ARC TO 2 FOES FOR '+25*l+'%'},
 meteor:{n:'METEOR',t:1,slot:'wpn',d:l=>'EVERY 6S YOUR NEXT HIT CALLS A METEOR'+(l>1?' (HUGE)':'')},
 vamp:{n:'BLOODTHIRST',t:1,slot:'ring',d:l=>'KILLS HEAL '+3*l+'% HP'},
 mirror:{n:'MIRROR STEP',t:1,slot:'ring',d:l=>'BULLETS YOU DASH THROUGH TURN ON YOUR FOES'},
 guardian:{n:'GUARDIAN',t:1,slot:'arm',d:l=>'EVERY '+Math.round(12/l)+'S GAIN A SHIELD OF 15% HP'},
 echo:{n:'ECHO STRIKE',t:1,slot:'wpn',d:l=>20*l+'% CHANCE A HIT STRIKES AGAIN'},
 blink:{n:'THUNDER STEP',t:1,slot:'ring',d:l=>'DASHING LEAVES A LIGHTNING BLAST'},
 storm:{n:'STORMCALLER',t:1,slot:'wpn',d:l=>'EVERY 4TH HIT CALLS DOWN LIGHTNING'},
 miasma:{n:'MIASMA',t:1,slot:'arm',d:l=>'WHEN HIT, LEAVE A POISON CLOUD'}};
const GPWK=Object.keys(GPW);
// new named legendaries, each built around a signature ability
RARE.push(
 {slot:'wpn',wt:'STAFF',n:'FLAMEHEART STAFF',fx:{fire:1},d:'EVERY ATTACK MAY BURN',pw:[['meteor',2],['kindle',1]]},
 {slot:'wpn',wt:'YARI',n:"RAIJIN'S SPEAR",fx:{shock:1},d:'HITS SHOCK',pw:[['chain',2]]},
 {slot:'wpn',wt:'TANEGASHIMA',n:'HOWLING TANEGASHIMA',fx:{crit:2},d:'+16% CRIT',pw:[['echo',2],['reach',1]]},
 {slot:'wpn',wt:'YUMI',n:'SEVEN STARS BOW',fx:{aspd:2},d:'+24% CAST SPEED',pw:[['storm',2]]},
 {slot:'wpn',wt:'KUNAI',n:'GHOSTLIGHT KUNAI',fx:{ghost:2},d:'12% DODGE',pw:[['echo',2]]},
 {slot:'wpn',wt:'ODACHI',n:'DEMON-EATER ODACHI',fx:{vamp:1,crit:1},d:'+8% CRIT. HITS HEAL 2%',pw:[['chain',1],['storm',1]]},
 {slot:'arm',n:'PHOENIX MANTLE',fx:{phoenix:1},d:'YOUR REVIVES ERUPT IN FIRE',pw:[['firetrail',2],['mend',1]]},
 {slot:'arm',n:'GLACIER LAMELLAR',fx:{iron:2},d:'-16% DAMAGE TAKEN',pw:[['frostnova',2],['ward',1]]},
 {slot:'arm',n:'SPIRIT SHROUD',fx:{ghost:2},d:'12% DODGE',pw:[['guardian',2]]},
 {slot:'arm',n:'THORNED HAORI',fx:{thorn:1},d:'WARD SHOCKWAVE',pw:[['thorns',2],['miasma',2]]},
 {slot:'ring',n:'RING OF NINE MOONS',fx:{emb:1},d:'-'+cdPct(COOLDOWN.charm)+' COOLDOWNS',pw:[['orbits',2]]},
 {slot:'ring',n:'MIRROR OF YATA',fx:{pierce:1},d:'SPELLS PIERCE',pw:[['mirror',2],['grazer',1]]},
 {slot:'ring',n:'BLOODMOON RING',fx:{vamp:1},d:'LIFESTEAL',pw:[['vamp',2],['bounty',1]]},
 {slot:'ring',n:'THUNDER EYE',fx:{shock:1},d:'SPELLS SHOCK',pw:[['blink',2],['quick',1]]});
// the original legendaries get a signature ability as well
{const SIG={'PLAGUE LOTUS STAFF':[['miasma',1],['kindle',1]],'MOONLIT WAND':[['focus',2]],'KESTREL ROD':[['storm',1]],'VOIDGLASS STAFF':[['meteor',2]],'CRIMSON MOON KATANA':[['echo',2]],
  'THUNDERCLAP NAGINATA':[['chain',2]],'SHINOBI GARB':[['mirror',1],['quick',1]],'CRANE CASTLE ARMOUR':[['guardian',1],['ward',2]],'HIGH PRIEST VESTMENT':[['mend',2]],'BLOOD ROBE':[['firetrail',1],['vamp',1]],
  'RING OF ECHOES':[['echo',1]],'FROSTBOUND BAND':[['frostnova',1]],'STORM SIGNET':[['blink',1],['storm',1]],'RING OF GREED':[['bounty',2]]};for(const r of RARE)if(SIG[r.n]&&!r.pw)r.pw=SIG[r.n];}
Object.assign(LEGLOOK,{'FLAMEHEART STAFF':['#8a3010','#ffb040',4],"RAIJIN'S SPEAR":['#c0c8d4','#80e0ff',2],'HOWLING TANEGASHIMA':['#3a3a44','#ff6040',2],'SEVEN STARS BOW':['#2a2a4a','#ffe080',2],'GHOSTLIGHT KUNAI':['#d8e0ff','#80ffd0',1],'DEMON-EATER ODACHI':['#2a1a1a','#ff2040',2],
 'PHOENIX MANTLE':['#c03010','#ffd040'],'GLACIER LAMELLAR':['#a8d0f0','#ffffff'],'SPIRIT SHROUD':['#e8e8f8','#a0a0ff'],'THORNED HAORI':['#3a6a2a','#a0ff40'],
 'RING OF NINE MOONS':['#d8e0ff','#ffe080'],'MIRROR OF YATA':['#e0b040','#ffffff'],'BLOODMOON RING':['#5a0a10','#ff2040'],'THUNDER EYE':['#3a3a5a','#80e0ff']});
// rolling abilities on new gear
const pwFor=(slot,tier)=>GPWK.filter(k=>GPW[k].t===tier&&GPW[k].slot.split(' ').includes(slot));
{const _mg=mkGear;mkGear=function(slot,tier,rare,q){const g=_mg(slot,tier,rare,q);if(!g)return g;
  if(g.rare){const r=RARE.find(x=>x.n===g.name);g.pw=(r&&r.pw||[]).map(([k,l])=>({k,l}));}
  else if(g.q>=3){g.pw=[{k:pick(pwFor(g.slot,1)),l:1}];if(Math.random()<.4)g.pw.push({k:pick(pwFor(g.slot,0)),l:1});}
  else if(g.q===2){g.pw=[{k:pick(pwFor(g.slot,0)),l:1}];}
  return g;};}
{const _gl=gearLines;gearLines=function(g){const L=_gl(g);for(const p of g.pw||[]){const P2=GPW[p.k];if(P2)L.push((P2.t?'* ':'+ ')+P2.n+(p.l>1?' II':'')+': '+P2.d(p.l));}return L;};}
// relics that grant an ability
const PWRELIC=[{id:'embersandal',name:'EMBER SANDALS',pw:'firetrail',g:'E',mo:'flame',fx:'fire'},{id:'stormcharm',name:'STORM TALISMAN',pw:'storm',g:'S',mo:'bolt',fx:'storm'},
 {id:'orbpearl',name:'ORBITING PEARL',pw:'orbits',g:'O',mo:'orb',fx:'guard'},{id:'thorncharm',name:'THORN CHARM',pw:'thorns',g:'T',mo:'caltrop',fx:'guard'},
 {id:'mirrorshard',name:'MIRROR SHARD',pw:'mirror',g:'M',mo:'mirror',fx:'control'},{id:'frostlocket',name:'FROST LOCKET',pw:'frostnova',g:'F',mo:'snow',fx:'frost'},
 {id:'guardseal',name:'GUARDIAN SEAL',pw:'guardian',g:'G',mo:'shield',fx:'guard'},{id:'echobell',name:'ECHO BELL',pw:'echo',g:'B',mo:'bell',fx:'dmg'}];
for(const r of PWRELIC){ITEMS.push({id:r.id,name:r.name,d:GPW[r.pw].d(1),g:r.g,r:2,pwRelic:r.pw});ITEMBY[r.id]=ITEMS[ITEMS.length-1];FXK[r.id]=r.fx;RELICMO[r.id]=r.mo;}
// equipped ability levels
function PWL(k){if(!R)return 0;let n=0;if(R.eq)for(const s of ['wpn','arm','ring']){const g=R.eq[s];if(g&&g.pw)for(const p of g.pw)if(p.k===k)n+=p.l;}
 if(R.inv)for(const r of PWRELIC)if(r.pw===k&&R.inv[r.id])n+=relicPower(r.id);return n;}

// ---------------------------------------------------------------- the abilities at work
const GPS={hits:0,meteorT:0,lastHit:-9,novaT:0,guardT:0,trailT:0,orbA:0,orbs:[],echoQ:[],lastChain:0};
{const _cs=calcStats;calcStats=function(){const s=_cs();if(R){s.rangeM+=.2*PWL('reach');s.cdr*=Math.pow(1-COOLDOWN.gearFocus,PWL('focus'));}return s;};}
// on hit
{const _he=hurtE;hurtE=function(e,dmg,pd,o){const alive=e&&!e.dead,h0=e?e.hp:0;const r=_he(e,dmg,pd,o);o=o||{};
  if(!R||!P||!alive||o.gp||e.prop||e.hp>=h0)return r;GPS.hits++;
  const basic=(o.src??castSrc)==='m',power=basic?S.weaponAtk:S.atk;
  const effect={gp:1,nost:true,el:'shock',src:basic?'m':undefined};
  const ch=PWL('chain');if(ch&&R.time-GPS.lastChain>.12){GPS.lastChain=R.time;let n=0;for(const f of enemies){if(n>=2)break;if(f===e||f.dead||f.air||f.prop||Math.hypot(f.x-e.x,f.y-e.y)>80)continue;n++;fx.push({k:'bolt',pts:[{x:e.x,y:e.y},{x:f.x,y:f.y}],t:.15,dur:.15});hurtE(f,dmg*.25*ch,5,effect);}}
  const ec=PWL('echo');if(ec&&Math.random()<.2*ec)GPS.echoQ.push({e,dmg:dmg*.5,t:.14});
  const st=PWL('storm');if(st&&GPS.hits%4===0){fx.push({k:'bolt',pts:[{x:e.x,y:e.y-60},{x:e.x,y:e.y}],t:.2,dur:.2});hurtE(e,power*1.6*st,20,effect);sfx('shoot');}
  const mt=PWL('meteor');if(mt&&GPS.meteorT<=0){GPS.meteorT=6;fx.push({k:'ult',x:e.x,y:e.y,wait:.35,t:.35,dur:.35,r:30+12*mt,col:'#ff8030',dm:power*4*mt,met:1,done:false});txtFx(e.x,e.y-14,'METEOR','#ff8030');}
  return r;};}
// on kill
{const _k=killE;killE=function(e){const was=e&&!e.dead;_k(e);if(!was||!e.dead||e.prop||!R||!P)return;
  const kd=PWL('kindle');if(kd)zones.push({k:'pfire',x:e.x,y:e.y,r:16+6*kd,t:3,tk:0,dm:S.atk*.4*kd});
  const qk=PWL('quick');if(qk)P.haste=Math.max(P.haste||0,1.5*qk);
  const bt=PWL('bounty');if(bt)R.sen+=2*bt;
  const vp=PWL('vamp');if(vp)P.hp=Math.min(S.maxhp,P.hp+S.maxhp*.03*vp);};}
// when you are hit
{const _hp=hitPlayer;hitPlayer=function(raw,sx2,sy2,o){o=o||{};const wd=PWL('ward');if(wd&&o.bullet&&P.iv<=0&&P.dash<=0&&Math.random()<.1*wd){spark(P.x,P.y,'#c8d0ff',6,50);txtFx(P.x,P.y-10,'WARDED','#c8d0ff');return 'dodge';}
  const r=_hp(raw,sx2,sy2,o);if(r!=='hit')return r;GPS.lastHit=R.time;
  const th=PWL('thorns');if(th)for(let i=0;i<6*th;i++){const a=i/(6*th)*TAU;projs.push(mkProj('p',P.x,P.y,a,220,S.atk*.6,{r:2,col:'#a0ff60',life:.5,pd:4}));}
  const fn=PWL('frostnova');if(fn&&GPS.novaT<=0){GPS.novaT=8/fn;const R0=60+15*fn;fxRing(P.x,P.y,R0,'#a8e0ff',.4);sfx('block');for(const q of projs)if(q.from==='e'&&!q.peril&&Math.hypot(q.x-P.x,q.y-P.y)<R0)q.dead=true;
   for(const e of enemies)if(!e.dead&&!e.air&&!e.prop&&Math.hypot(e.x-P.x,e.y-P.y)<R0+e.r){for(let i=0;i<3;i++)applyStatus(e,'chill');}}
  const mi=PWL('miasma');if(mi)zones.push({k:'calt',x:P.x,y:P.y,r:34+8*mi,t:4,tk:0,dm:S.atk*.25*mi});
  return r;};}
// on dash
{const _td=tryDash;tryDash=function(){const was=P.dash>0,x0=P.x,y0=P.y;_td();if(was||!(P.dash>0))return;const bl=PWL('blink');
  if(bl){fx.push({k:'bolt',pts:[{x:x0,y:y0-40},{x:x0,y:y0}],t:.2,dur:.2});fxRing(x0,y0,40,'#80e0ff',.3);for(const e of enemies)if(!e.dead&&!e.air&&!e.prop&&Math.hypot(e.x-x0,e.y-y0)<40+e.r)hurtE(e,S.atk*1.5*bl,25,{gp:1,nost:true,el:'shock'});}};}
// grazing
{const _g=graze;graze=function(q){_g(q);const gz=PWL('grazer');if(gz&&R.grazes%8===0){P.hp=Math.min(S.maxhp,P.hp+S.maxhp*.02*gz);spark(P.x,P.y,'#80ff80',5,30);}};}
// every frame
{const _uw=updWorld;updWorld=function(dt){_uw(dt);if(!P||!R||mode!=='play')return;const p=P;
  if(GPS.meteorT>0)GPS.meteorT-=dt;if(GPS.novaT>0)GPS.novaT-=dt;
  for(const q of GPS.echoQ){q.t-=dt;if(q.t<=0){q.done=1;if(!q.e.dead){hurtE(q.e,q.dmg,4,{gp:1,nost:true});spark(q.e.x,q.e.y,'#ffffff',4,40);}}}GPS.echoQ=GPS.echoQ.filter(q=>!q.done);
  const ft=PWL('firetrail');if(ft&&p.mv){GPS.trailT-=dt;if(GPS.trailT<=0){GPS.trailT=.18;zones.push({k:'pfire',x:p.x,y:p.y,r:10+2*ft,t:2,tk:0,dm:S.atk*.25*ft});}}
  const md=PWL('mend');if(md&&R.time-GPS.lastHit>3)p.hp=Math.min(S.maxhp,p.hp+S.maxhp*.006*md*dt);
  const gd=PWL('guardian');if(gd){GPS.guardT-=dt;if(GPS.guardT<=0){GPS.guardT=12/gd;p.shieldHp=Math.max(p.shieldHp||0,S.maxhp*.15);p.shieldT=8;fxRing(p.x,p.y,16,'#a0a0ff',.3);}}
  // spirit orbs: circle you, each blocks one bullet (then reforms in 2.5s) and burns foes it passes
  const ob=PWL('orbits');if(ob){const n=1+ob;while(GPS.orbs.length<n)GPS.orbs.push({cd:0});GPS.orbs.length=n;GPS.orbA+=dt*2.6;
   GPS.orbs.forEach((o,i)=>{const a=GPS.orbA+i/n*TAU;o.x=p.x+Math.cos(a)*26;o.y=p.y+Math.sin(a)*26;if(o.cd>0){o.cd-=dt;return;}
    for(const q of projs)if(q.from==='e'&&!q.peril&&!q.dead&&Math.hypot(q.x-o.x,q.y-o.y)<q.r+5){q.dead=true;o.cd=2.5;spark(o.x,o.y,'#c0e0ff',6,40);break;}
    o.tk=(o.tk||0)-dt;if(o.tk<=0){o.tk=.3;for(const e of enemies)if(!e.dead&&!e.air&&!e.prop&&Math.hypot(e.x-o.x,e.y-o.y)<e.r+7)hurtE(e,S.atk*.4*ob,4,{gp:1,nost:true,el:'burn'});}});}
  else GPS.orbs.length=0;
  // mirror step: bullets you slip through while dashing turn around as yours
  const mr=PWL('mirror');if(mr&&p.dash>0)for(const q of projs)if(q.from==='e'&&!q.peril&&!q.dead&&Math.hypot(q.x-p.x,q.y-p.y)<14){const vx=q.vx,vy=q.vy,l=Math.hypot(vx,vy)||1,s=l*1.3;q.from='p';q.vx=-vx/l*s;q.vy=-vy/l*s;q.dmg=S.atk*.5*mr;q.col='#ffd040';q.hit=new Set();q.life=1;q.st=null;q.pierce=0;}};}
{const _dp=drawPlayer;drawPlayer=function(){_dp();for(const o of GPS.orbs){if(o.x==null)continue;const X=sx(o.x,o.y),Y=sy(o.x,o.y)-8;if(o.cd>0){ctx.globalAlpha=.3;circ(X,Y,2,'#c0e0ff');ctx.globalAlpha=1;continue;}disc(X,Y,2,'#c0e0ff');ctx.fillStyle='#fff';ctx.fillRect(X,Y-1,1,1);}};}
// player fire patches (kindling, fire trail): burn foes standing in them
CZ.pfire=(z,dt,tick)=>{if(tick){z.tk=.35;for(const e of enemies)if(!e.dead&&!e.air&&!e.prop&&Math.hypot(e.x-z.x,e.y-z.y)<z.r+e.r){hurtE(e,z.dm,2,{gp:1,nost:true});if(Math.random()<.3)applyStatus(e,'burn');}}};
CZD.pfire=z=>{ctx.globalAlpha=Math.min(.35,z.t*.2);wdisc(z.x,z.y,z.r,'#ff6020');ctx.globalAlpha=1;if(Math.random()<.5){const a=Math.random()*TAU,r=Math.random()*z.r,x=z.x+Math.cos(a)*r,y=z.y+Math.sin(a)*r;particles.push({x,y,vx:0,vy:-25,t:.35,col:Math.random()<.5?'#ffd060':'#ff6020'});}};
