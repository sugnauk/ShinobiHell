'use strict';
// ===== RELIC SYNERGIES: certain pairs of relics combine into something more =====
// Picking a relic that completes a pair announces the synergy; the guide's RELICS tab lists every synergy you have formed.
const SYN=[
 {k:'plasma',n:'PLASMA',a:'fire',b:'shock',d:'FIRE OIL + STATIC SEAL: +25% DAMAGE TO BURNING OR SHOCKED FOES'},
 {k:'permafrost',n:'PERMAFROST',a:'frost',b:'frostlocket',d:'FROST CHARM + FROST LOCKET: FROZEN FOES TAKE +40% DAMAGE'},
 {k:'sunmoon',n:'SUN AND MOON',a:'crit',b:'flare',d:'CRITICAL EYE + AMATERASU EYE: +10% CRIT'},
 {k:'sanguine',n:'SANGUINE',a:'blood',b:'vamp',d:'BLOOD MIST + BLOOD PACT: EVERY HIT HEALS 2% MORE OF ITS DAMAGE'},
 {k:'wraith',n:'WRAITHWALK',a:'shadow',b:'ghost',d:'SHADOW STEP + PHANTOM: -'+cdPct(COOLDOWN.wraith)+' DASH COOLDOWN, +4% DODGE'},
 {k:'bells',n:'THOUSAND BELLS',a:'templebell',b:'echobell',d:'TEMPLE BELL + ECHO BELL: -'+cdPct(COOLDOWN.bells)+' COOLDOWNS'},
 {k:'balance',n:'BALANCED BLADE',a:'glass',b:'iron',d:'GLASS CANNON + IRON BODY: GLASS CANNON NO LONGER COSTS HEALTH'},
 {k:'needles',n:'NEEDLE STORM',a:'wave',b:'pierce',d:'TWIN TALISMAN + PIERCING SEAL: +1 PIERCE, +10% CAST SPEED'},
 {k:'aegis',n:'AEGIS',a:'orbpearl',b:'guardseal',d:'ORBITING PEARL + GUARDIAN SEAL: +3 DEFENCE'},
 {k:'merchant',n:'MERCHANT\'S LUCK',a:'magnet',b:'gourd',d:'GOLD MAGNET + POTION SATCHEL: +25% GOLD'},
 {k:'dragonsoul',n:'DRAGON SOUL',a:'epow',b:'ecd',d:'DRAGON SCALE + SOUL EATER: +25% ULTIMATE DAMAGE'},
 {k:'raijin',n:'RAIJIN\'S CALL',a:'stormcharm',b:'storm',d:'STORM TALISMAN + THUNDER DRUM: +20% DAMAGE TO SHOCKED FOES, +6% CRIT'}];
const synOn=k=>{const s=SYN.find(x=>x.k===k);return !!(s&&R&&R.inv&&R.inv[s.a]&&R.inv[s.b]);};
meta.syn=meta.syn||{};
{const _cs=calcStats;calcStats=function(){const s=_cs();if(!R||!R.inv)return s;
 if(synOn('sunmoon'))s.crit+=.10;if(synOn('raijin'))s.crit+=.06;
 if(synOn('wraith')){s.dashCd*=1-COOLDOWN.wraith;s.dodge=(s.dodge||0)+.04;}
 if(synOn('bells'))s.cdr*=1-COOLDOWN.bells;
 if(synOn('balance')&&R.inv.glass)s.maxhp=Math.round(s.maxhp/Math.pow(.75,relicPower('glass')));
 if(synOn('needles')){s.pierce=(s.pierce||0)+1;s.aspd*=1.1;}
 if(synOn('aegis'))s.def+=3;
 if(synOn('merchant'))s.sen=(s.sen||1)*1.25;
 return s;};}
{const _he=hurtE;hurtE=function(e,dmg,pd,o){if(e&&R&&R.inv&&!e.dead&&!e.prop){const st=e.st||{};
  if(synOn('plasma')&&(st.burn>0||st.shock>0))dmg*=1.25;
  if(synOn('permafrost')&&st.frozen>0)dmg*=1.4;
  if(synOn('raijin')&&st.shock>0)dmg*=1.2;
  if(synOn('dragonsoul')&&typeof castSrc!=='undefined'&&castSrc==='e')dmg*=1.25;
  if(synOn('sanguine')&&P&&S)P.hp=Math.min(S.maxhp,P.hp+dmg*.02);}
 return _he.call(this,e,dmg,pd,o);};}
// a relic that completes a pair announces the synergy
{const _ai=applyItem;applyItem=function(id){const before=SYN.filter(s=>synOn(s.k)).map(s=>s.k);const r=_ai.apply(this,arguments);
 for(const s of SYN)if(synOn(s.k)&&!before.includes(s.k)){meta.syn[s.k]=1;saveMeta();setToast('SYNERGY: '+s.n+' - '+s.d.split(': ')[1],'#ffd040',4);sfx('rare');if(P)fxRing(P.x,P.y,36,'#ffd040',.5);S=calcStats();}
 return r;};}
// the guide: synergies at the end of the RELICS tab (formed ones are revealed)
{const _ge=guideEntries;guideEntries=function(tab){const L=_ge(tab);if(tab!==2)return L;
 return L.concat(SYN.map(s=>{const u=!!meta.syn[s.k];return {n:'SYNERGY: '+s.n,u,col:'#ffd040',L:u?[s.d,'HOLD BOTH RELICS IN THE SAME RUN']:['PAIR TWO RELICS TO DISCOVER THIS SYNERGY']};}));};}
// the boss reward cards flag a relic that would complete a synergy with one you already hold
{const _rc=renderChoose;renderChoose=function(){_rc.apply(this,arguments);if(!chooseOpts||!R)return;const cw=92,gap=8,x0=Math.round((W-(3*cw+2*gap))/2);
 chooseOpts.forEach((it,i)=>{if(!it)return;const s=SYN.find(s=>!synOn(s.k)&&((s.a===it.id&&R.inv[s.b])||(s.b===it.id&&R.inv[s.a])));if(!s)return;const x=x0+i*(cw+gap),y=44+92+3;
  ctx.fillStyle='#2a2010';ctx.fillRect(x,y,cw,10);ctx.fillStyle=Math.floor(time*3)%2?'#ffd040':'#fff0a0';ctx.fillRect(x,y,cw,1);const t='SYNERGY: '+s.n;txt(t.slice(0,22),x+Math.round((cw-txtW(t.slice(0,22)))/2),y+3,'#ffd040');});};}
