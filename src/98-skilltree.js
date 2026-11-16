'use strict';
// HELL OF THE EMPEROR - the TEMPLE SKILL TREE: a grid of ~240 nodes around a free root, split into eight themed regions (War,
// Blade, Spirit, Arcane, Body, Shadow, Fortune, Hunt). Small nodes are small stat increases, notables give two stats, and
// sixteen KEYSTONES (big nodes that change how you play) can each be reached from several sides. You can buy any node next
// to one you own. The original sixteen ranked nodes keep their keys (meta.up), so ranks already bought carry over.
const STB=[
 {n:'WAR',c:'#ff5050',old:['atk','crit','bossd','wrath'],st:[{pow:.03},{crit:.02},{boss:.04}],ks:[['BERSERKER','+25% DAMAGE WHILE BELOW HALF HEALTH'],['EXECUTIONER','+40% DAMAGE TO FOES BELOW 25% HEALTH']]},
 {n:'BLADE',c:'#e8eef6',st:[{near:.05},{aspd:.03},{def:1}],ks:[['IAIDO MASTER','+25% DAMAGE TO FOES CLOSE TO YOU. BLADES CUT 3 MORE BULLETS A SECOND'],['BLADE DANCE','YOUR DASH SLASHES EVERYTHING AROUND YOU']]},
 {n:'SPIRIT',c:'#40c0ff',old:['emb','swift','dashm','flow'],st:[{cdr:.025},{spd:.025},{dash:.05}],ks:[['MOMENTUM','UNHIT FOR 2S: +20% DAMAGE AND +10% SPEED'],['TIME WEAVER','-20% COOLDOWNS, BUT +25% DASH COOLDOWN']]},
 {n:'ARCANE',c:'#c080ff',st:[{abil:.05},{cdr:.02},{range:.06}],ks:[['OVERCHANNEL','+30% ABILITY DAMAGE, -10% BASIC ATTACK DAMAGE'],['ECHO MIND','ABILITIES HAVE A 20% CHANCE TO REFUND HALF THEIR COOLDOWN']]},
 {n:'BODY',c:'#50e060',old:['vit','pos','iron','res'],st:[{hp:.04},{def:1},{regen:.002}],ks:[['COLOSSUS','+30% MAX HP, -8% MOVE SPEED'],['UNDYING','ONCE PER STAGE A KILLING BLOW LEAVES YOU AT 1 HP']]},
 {n:'SHADOW',c:'#9a7aff',st:[{dodge:.012},{spd:.02},{graze:1}],ks:[['GHOST STEP','+10% DODGE, -15% DASH COOLDOWN'],['GRAZE MASTER','EVERY GRAZE HEALS 0.4% HP']]},
 {n:'FORTUNE',c:'#ffd040',old:['sen','purse','belt','heir'],st:[{gold:.06},{pot:.05},{luck:1}],ks:[['MIDAS','+40% GOLD'],['TREASURE HUNTER','GEAR DROPS ROLL ONE QUALITY HIGHER 15% OF THE TIME']]},
 {n:'HUNT',c:'#80ff80',st:[{range:.06},{crit:.02},{pow:.02}],ks:[['EAGLE EYE','+25% RANGE, +8% CRIT'],['MARKED PREY','YOUR FIRST HIT ON EACH FOE DEALS DOUBLE DAMAGE']]}];
const STAT_TXT={pow:v=>'+'+Math.round(v*100)+'% POWER',crit:v=>'+'+Math.round(v*100)+'% CRIT',boss:v=>'+'+Math.round(v*100)+'% DAMAGE TO BOSSES AND ELITES',near:v=>'+'+Math.round(v*100)+'% DAMAGE TO FOES CLOSE TO YOU',
 aspd:v=>'+'+Math.round(v*100)+'% ATTACK SPEED',def:v=>'+'+v+' DEFENCE',cdr:v=>'-'+(v*100).toFixed(1).replace('.0','')+'% COOLDOWNS',spd:v=>'+'+(v*100).toFixed(1).replace('.0','')+'% MOVE SPEED',dash:v=>'-'+Math.round(v*100)+'% DASH COOLDOWN',
 abil:v=>'+'+Math.round(v*100)+'% ABILITY DAMAGE',range:v=>'+'+Math.round(v*100)+'% RANGE',hp:v=>'+'+Math.round(v*100)+'% MAX HP',regen:v=>'REGENERATE '+(v*100).toFixed(1)+'% HP/S',dodge:v=>'+'+(v*100).toFixed(1).replace('.0','')+'% DODGE',
 graze:v=>'GRAZES COOL ABILITIES '+(.05*v).toFixed(2)+'S MORE',gold:v=>'+'+Math.round(v*100)+'% GOLD',pot:v=>'POTIONS HEAL +'+Math.round(v*100)+'%',luck:v=>'+'+4*v+'% CHANCE OF BETTER GEAR'};
const SKT={nodes:[],byK:{},adj:{},cam:{x:0,y:0},sel:'root'};
// THE GRID: an oval of cells around the temple gate. Each cell belongs to the branch its direction points at, so the eight
// branches are regions that touch each other. Links run along the grid; about a quarter are cut to make a maze of paths
// with many loops. Keystones (big) keep every side linked, so there are up to four ways into each. Notables (medium)
// give two stats at once. The original sixteen ranked nodes sit on the first steps of the four main axes.
const STG={dx:20,dy:18,RX:10.5,RY:7.5};
const NOTA=[['VETERAN','WARLORD'],['STEEL WIND','THOUSAND CUTS'],['CLEAR MIND','FLOWING WATER'],['RUNE SCRIBE','STAR READER'],['IRON LUNG','MOUNTAIN'],['NIGHT WALKER','SMOKE'],['LUCKY CAT','MERCHANT'],['TRACKER','APEX']];
(function buildTree(){const add=n=>{SKT.nodes.push(n);SKT.byK[n.k]=n;SKT.adj[n.k]=SKT.adj[n.k]||[];return n;},link=(a,b)=>{if(SKT.adj[a.k].includes(b.k))return;SKT.adj[a.k].push(b.k);SKT.adj[b.k].push(a.k);};
 const cell={},key=(gx,gy)=>gx+','+gy,inside=(gx,gy)=>(gx/STG.RX)**2+(gy/STG.RY)**2<=1;
 const brOf=(gx,gy)=>{const a=Math.atan2(gy,gx/1.35);return ((Math.round((a+Math.PI/2)/(Math.PI/4))%8)+8)%8;};
 const put=(gx,gy,n)=>{n.gx=gx;n.gy=gy;n.x=gx*STG.dx;n.y=gy*STG.dy;cell[key(gx,gy)]=add(n);return n;};
 put(0,0,{k:'root',n:'TEMPLE GATE',d:'WHERE EVERY PATH BEGINS',max:1,free:1,c:'#ffffff',big:1});
 const axis=b=>{const a=b*Math.PI/4-Math.PI/2;return [Math.cos(a),Math.sin(a)];};
 const at=(b,r,off)=>{const [ux,uy]=axis(b),a=Math.atan2(uy,ux)+(off||0);return [Math.round(Math.cos(a)*r*1.35),Math.round(Math.sin(a)*r)];};
 STB.forEach((B,b)=>{
  // the original ranked nodes: three steps out along the axis, the fourth beside the second
  if(B.old){const [ux,uy]=axis(b),sx=Math.round(ux),sy=Math.round(uy);[[1,0],[2,0],[3,0],[2,1]].forEach(([d,o],i)=>{const o2=TNODE[B.old[i]],gx=sx*d+(o?-sy:0),gy=sy*d+(o?sx:0);
    put(gx,gy,{k:o2.k,n:o2.n,d:o2.d,base:o2.base,max:o2.max,c:B.c,b,old:1});});}
  // two keystones per branch, inner and outer
  [[4.2,0],[6.5,0]].forEach(([r,o],i)=>{const [gx,gy]=at(b,r,o);if(cell[key(gx,gy)])return;const [nm,d]=B.ks[i];put(gx,gy,{k:'kst_'+nm.replace(/[^A-Z]/g,''),n:nm,d,eff:{['ks:'+nm]:1},cost:i?700:320,max:1,c:B.c,b,big:1});});
  // two notables per branch, off to each side between the keystones
  [[5.6,.32],[5.6,-.32]].forEach(([r,o],i)=>{const [gx,gy]=at(b,r,o);if(cell[key(gx,gy)])return;const e={},e1=B.st[i%3],e2=B.st[(i+1)%3];for(const k in e1)e[k]=(e[k]||0)+e1[k]*2;for(const k in e2)e[k]=(e[k]||0)+e2[k]*2;
   put(gx,gy,{k:'ntb_'+b+'_'+i,n:NOTA[b][i],eff:e,cost:180,max:1,c:B.c,b,mid:1});});});
 // every other cell in the oval is a small node of the branch it points at
 const nearSp=(gx,gy)=>[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>{const m=cell[key(gx+a,gy+b)];return m&&(m.big||m.mid||m.free||m.old);});
 for(let gy=-Math.floor(STG.RY);gy<=Math.floor(STG.RY);gy++)for(let gx=-Math.floor(STG.RX);gx<=Math.floor(STG.RX);gx++){if(!inside(gx,gy)||cell[key(gx,gy)])continue;if(!nearSp(gx,gy)&&hash(gx*41+9,gy*29+3)<.14)continue;
  const b=brOf(gx,gy),B=STB[b],d=Math.hypot(gx/1.35,gy),h=hash(gx*7+31,gy*13+7),e=B.st[(Math.floor(h*3))%3],sc=d>5.5?1.5:1,eff={};for(const k in e)eff[k]=['def','graze','luck'].includes(k)?Math.max(1,Math.round(e[k]*sc)):e[k]*sc;
  put(gx,gy,{k:'g_'+gx+'_'+gy,n:B.n+' '+ROMAN[Math.min(11,Math.floor(d))],eff,cost:Math.round(18+d*d*5),max:1,c:B.c,b});}
 // grid links, a quarter cut (never next to the gate, a keystone, a notable or a ranked node)
 const special=n=>n.big||n.mid||n.old||n.free;
 for(const n of SKT.nodes)for(const [ox,oy] of [[1,0],[0,1]]){const m=cell[key(n.gx+ox,n.gy+oy)];if(!m)continue;if(!special(n)&&!special(m)&&hash(n.gx*17+ox*5+3,n.gy*23+oy*7+11)<.4)continue;link(n,m);}
 // make sure everything can be reached from the gate: reconnect any island to its nearest reachable neighbour
 for(let pass=0;pass<20;pass++){const seen=new Set(['root']),q=['root'];while(q.length){const k=q.pop();for(const m of SKT.adj[k])if(!seen.has(m)){seen.add(m);q.push(m);}}
  const lost=SKT.nodes.filter(n=>!seen.has(n.k));if(!lost.length)break;
  for(const n of lost){for(const [ox,oy] of [[1,0],[-1,0],[0,1],[0,-1]]){const m=cell[key(n.gx+ox,n.gy+oy)];if(m&&seen.has(m.k)){link(n,m);break;}}}}
 for(const n of SKT.nodes)if(!n.d)n.d=Object.keys(n.eff).map(k=>STAT_TXT[k]?STAT_TXT[k](n.eff[k]):k).join(', ');
 // nodes bought on the old layout that no longer exist are refunded
 try{const old=/^(st|ks|sd|sd2|br)_/;let g=0;for(const k in (meta.up||{})){if(SKT.byK[k]||TNODE[k]||!old.test(k))continue;const m=k.split('_'),i=+m[2]||0;
   g+=k.startsWith('ks_')?(i===5?300:650):k.startsWith('sd2_')?150:k.startsWith('sd_')?30+i*14:k.startsWith('br_')?60+i*16:22+i*14;delete meta.up[k];}
  if(g){meta.sen+=g;saveMeta();setTimeout(()=>setToast('THE SKILL TREE WAS REBUILT: '+g+' GOLD REFUNDED','#ffd040',5),500);}}catch(e){}})();
const stLv=k=>k==='root'?1:upLv(k),stOpen=n=>n.free||SKT.adj[n.k].some(k=>stLv(k)>0),stCost=n=>n.old?n.base*(upLv(n.k)+1):n.cost;
function stBuy(n){const lv=stLv(n.k);if(lv>=n.max){sfx('block');return;}if(!stOpen(n)){sfx('block');setToast('LOCKED: BUY A NODE NEXT TO IT FIRST','#c55',2);return;}
 const c=stCost(n);if(meta.sen<c){sfx('block');return;}meta.sen-=c;meta.up[n.k]=lv+1;saveMeta();sfx(n.big?'rare':'pickup');}
// totals of every owned node's effects (keystones count as 'ks:NAME')
let STOT=null,STOTkey='';
function stTot(){const key=JSON.stringify(meta.up);if(STOT&&key===STOTkey)return STOT;const t={};for(const n of SKT.nodes){if(!n.eff)continue;const lv=stLv(n.k);if(!lv)continue;for(const k in n.eff)t[k]=(t[k]||0)+n.eff[k]*lv;}STOTkey=key;return STOT=t;}
const KS=nm=>!!stTot()['ks:'+nm];

// ---------------------------------------------------------------- effects
{const _cs=calcStats;calcStats=function(){const s=_cs(),t=stTot();
  s.atk*=1+(t.pow||0);s.crit+=t.crit||0;s.aspd*=1+(t.aspd||0);s.cdr*=Math.max(.4,1-(t.cdr||0));s.spd*=1+(t.spd||0);s.dashCd*=Math.max(.4,1-(t.dash||0));s.rangeM+=t.range||0;s.maxhp=Math.round(s.maxhp*(1+(t.hp||0)));s.def+=t.def||0;s.dodge=(s.dodge||0)+(t.dodge||0);s.sen*=1+(t.gold||0);
  if(KS('COLOSSUS')){s.maxhp=Math.round(s.maxhp*1.3);s.spd*=.92;}if(KS('TIME WEAVER')){s.cdr*=.8;s.dashCd*=1.25;}if(KS('GHOST STEP')){s.dodge+=.1;s.dashCd*=.85;}if(KS('MIDAS'))s.sen*=1.4;if(KS('EAGLE EYE')){s.rangeM+=.25;s.crit+=.08;}
  if(KS('MOMENTUM')&&R&&R.time-(STS.lastHit||0)>2)s.spd*=1.1;return s;};}
const STS={lastHit:-9,cds:{}};
{const _he=hurtE;hurtE=function(e,dmg,pd,o){if(e&&P&&R&&!e.prop&&!e.dead){const t=stTot();o=o||{};
  if(e.boss||e.elite)dmg*=1+(t.boss||0);const close=Math.hypot(e.x-P.x,e.y-P.y)<60;if(close)dmg*=1+(t.near||0)+(KS('IAIDO MASTER')?.25:0);
  const ability=castSrc&&castSrc!=='m';if(ability)dmg*=1+(t.abil||0)+(KS('OVERCHANNEL')?.3:0);else if(castSrc==='m'&&KS('OVERCHANNEL'))dmg*=.9;
  if(KS('BERSERKER')&&P.hp<S.maxhp*.5)dmg*=1.25;if(KS('EXECUTIONER')&&e.hp<e.maxhp*.25)dmg*=1.4;if(KS('MOMENTUM')&&R.time-STS.lastHit>2)dmg*=1.2;
  if(KS('MARKED PREY')&&!e.stMarked){e.stMarked=1;dmg*=2;}}return _he(e,dmg,pd,o);};}
{const _hp=hitPlayer;hitPlayer=function(raw,a,b,o){const r=_hp(raw,a,b,o);if(r==='hit'&&R){if(STS.lastHit!==R.time&&KS('MOMENTUM'))S=calcStats();STS.lastHit=R.time;}return r;};}
// undying: once a stage, the blow that would kill you leaves you at 1 HP
{const _die=die;die=function(){if(P&&R&&KS('UNDYING')&&R.undying!==R.di&&!(P.dying>0)){R.undying=R.di;P.hp=1;P.iv=1.5;setToast('UNDYING','#50e060',2);fxRing(P.x,P.y,50,'#50e060',.5);sfx('heal');return;}return _die();};}
{const _g=graze;graze=function(q){_g(q);const t=stTot();if(t.graze)for(const k of ['q','f','e','rmb'])if(P.ab[k]>0)P.ab[k]=Math.max(0,P.ab[k]-.05*t.graze);if(KS('GRAZE MASTER'))P.hp=Math.min(S.maxhp,P.hp+S.maxhp*.004);};}
{const _ug=useGourd;useGourd=function(){const n=R.pots;_ug();const t=stTot();if(t.pot&&R.pots<n)P.hp=Math.min(S.maxhp,P.hp+S.maxhp*t.pot);};}
{const _td=tryDash;tryDash=function(){const was=P.dash>0;_td();if(!was&&P.dash>0&&KS('BLADE DANCE')){fx.push({k:'slash',x:P.x,y:P.y,a:P.aim,arc:TAU,r:45,t:.2,dur:.2,col:'#e8eef6'});for(const e of enemies)if(!e.dead&&!e.air&&!e.prop&&Math.hypot(e.x-P.x,e.y-P.y)<45+e.r)hurtE(e,S.atk*1.5,25,{slash:true});sfx('slash');}};}
{const _mg=mkGear;mkGear=function(slot,tier,rare,q){if(!rare&&q==null&&R){const t=stTot(),up=.04*(t.luck||0)+(KS('TREASURE HUNTER')?.15:0);if(up&&Math.random()<up)q=Math.min(3,rollQ(R.di,0)+1);}return _mg(slot,tier,rare,q);};}
{const _uw=updWorld;updWorld=function(dt){_uw(dt);if(!P||!R||mode!=='play')return;const t=stTot();if(t.regen)P.hp=Math.min(S.maxhp,P.hp+S.maxhp*t.regen*dt);
  // echo mind: when an ability goes on cooldown there is a 20% chance half of it comes straight back
  if(KS('ECHO MIND'))for(const k of ['q','f','e','rmb','h']){const v=P.ab[k]||0,pv=STS.cds[k]||0;if(v>pv+.5&&Math.random()<.2){P.ab[k]=v/2;txtFx(P.x,P.y-12,'ECHO','#c080ff');}STS.cds[k]=P.ab[k];}
  if(KS('MOMENTUM')&&R.time-STS.lastHit>2&&!STS.mom){STS.mom=1;S=calcStats();}else if(STS.mom&&R.time-STS.lastHit<=2){STS.mom=0;S=calcStats();}};}

// ---------------------------------------------------------------- the tree screen
const stView={x0:6,y0:20,w:308,h:116};
SKT.zoom=1;SKT.zt=1; // Z or the mouse wheel: the whole grid at once
const stScr=n=>[Math.round(stView.x0+stView.w/2+(n.x-SKT.cam.x)*SKT.zoom),Math.round(stView.y0+stView.h/2+(n.y-SKT.cam.y)*SKT.zoom)];
const stR=n=>Math.max(1,Math.round((n.big?(n.free?6:8):n.mid?5:2)*(SKT.zoom<1?.55:1))); // half-size of each node's square
function stNodeAt(mx,my){let best=null,bd=10;for(const n of SKT.nodes){const [x,y]=stScr(n);const d=Math.max(Math.abs(mx-x),Math.abs(my-y))-stR(n);if(d<bd&&y>stView.y0&&y<stView.y0+stView.h){bd=d;best=n;}}return bd<=4?best:null;}
function stClick(){const n=stNodeAt(mouse.x,mouse.y);if(!n)return;if(SKT.zt<1){SKT.sel=n.k;SKT.zt=1;sfx('coin');return;}if(SKT.sel===n.k)stBuy(n);else{SKT.sel=n.k;sfx('coin');}}
renderUpgrades=function(){const sel=SKT.byK[SKT.sel]||SKT.byK.root;SKT.zoom+=(SKT.zt-SKT.zoom)*.25;if(Math.abs(SKT.zt-SKT.zoom)<.01)SKT.zoom=SKT.zt;const tx=SKT.zt<1?0:sel.x,ty=SKT.zt<1?0:sel.y;SKT.cam.x+=(tx-SKT.cam.x)*.18;SKT.cam.y+=(ty-SKT.cam.y)*.18;
 txt('TEMPLE SKILL TREE',8,6,'#d02030',1);{const own=SKT.nodes.filter(n=>stLv(n.k)>0).length;txt(own+'/'+SKT.nodes.length+' NODES',8,13,'#777');}
 {hudCoin(W-8-txtW(String(meta.sen))-10,6);const s=String(meta.sen);txt(s,W-8-txtW(s),7,'#fc4');}
 // legend
 {let x=96;for(const [lab,r,c] of [['STAT',2,'#aaa'],['NOTABLE',4,'#ddd'],['KEYSTONE',5,'#fff']]){ctx.fillStyle=c;ctx.fillRect(x,10-r,r*2+1,r*2+1);ctx.fillStyle='#14101a';if(r>2)ctx.fillRect(x+1,11-r,r*2-1,r*2-1);ctx.fillStyle=c;if(r>2)ctx.fillRect(x+2,12-r,r*2-3,r*2-3);txt(lab,x+r*2+4,7,'#888');x+=txtW(lab)+r*2+12;}}
 if(mouse.x!==selMX||mouse.y!==selMY){const h=stNodeAt(mouse.x,mouse.y);if(h)SKT.sel=h.k;selMX=mouse.x;selMY=mouse.y;}
 ctx.save();ctx.beginPath();ctx.rect(stView.x0,stView.y0,stView.w,stView.h);ctx.clip();ctx.fillStyle='rgba(10,6,14,.94)';ctx.fillRect(stView.x0,stView.y0,stView.w,stView.h);
 // branch regions: each cell tinted with its branch colour
 for(const n of SKT.nodes){if(n.b==null||n.b<0)continue;const [x,y]=stScr(n);if(x<-20||x>W+20||y<stView.y0-20||y>stView.y0+stView.h+20)continue;ctx.globalAlpha=.06;ctx.fillStyle=n.c;ctx.fillRect(Math.round(x-STG.dx*SKT.zoom/2),Math.round(y-STG.dy*SKT.zoom/2),Math.ceil(STG.dx*SKT.zoom),Math.ceil(STG.dy*SKT.zoom));}ctx.globalAlpha=1;
 // links: straight grid lines, lit when both ends are owned, dim when one is
 for(const n of SKT.nodes)for(const k of SKT.adj[n.k]){const m=SKT.byK[k];if(m.gx<n.gx||(m.gx===n.gx&&m.gy<n.gy))continue;const [x0,y0]=stScr(n),[x1,y1]=stScr(m);if(Math.max(x0,x1)<0||Math.min(x0,x1)>W||Math.max(y0,y1)<stView.y0||Math.min(y0,y1)>stView.y0+stView.h)continue;
  const a=stLv(n.k)>0,b2=stLv(k)>0,c=a&&b2?(n.b!=null&&n.b>=0?n.c:m.c):a||b2?'#6a5e78':'#2e2638';ctx.fillStyle=c;
  if(y0===y1)ctx.fillRect(Math.min(x0,x1),y0,Math.abs(x1-x0),a&&b2?2:1);else ctx.fillRect(x0,Math.min(y0,y1),a&&b2?2:1,Math.abs(y1-y0));}
 // branch names in their regions
 STB.forEach((B,b)=>{const a=b*Math.PI/4-Math.PI/2,[x,y]=stScr({x:Math.cos(a)*9.6*1.35*STG.dx,y:Math.sin(a)*8.2*STG.dy});const ly=SKT.zoom<.8?clamp(y-2,stView.y0+3,stView.y0+stView.h-9):y-2;txt(B.n,x-Math.round(txtW(B.n)/2),ly,shade(B.c,-.15));});
 // nodes
 for(const n of SKT.nodes){const [x,y]=stScr(n);if(x<-12||x>W+12||y<stView.y0-12||y>stView.y0+stView.h+12)continue;const lv=stLv(n.k),open=stOpen(n),can=open&&lv<n.max&&meta.sen>=stCost(n),r=stR(n),full=lv>=n.max;
  ctx.fillStyle='#07040a';ctx.fillRect(x-r-1,y-r-1,r*2+3,r*2+3);
  if(n.big||n.mid){ // framed: an outer ring in the branch colour, the core lit once owned
   ctx.fillStyle=full?n.c:open?shade(n.c,-.35):'#3a3044';ctx.fillRect(x-r,y-r,r*2+1,r*2+1);ctx.fillStyle='#14101a';ctx.fillRect(x-r+1,y-r+1,r*2-1,r*2-1);
   ctx.fillStyle=full?n.c:open?'#3a3044':'#1e1826';ctx.fillRect(x-r+2,y-r+2,r*2-3,r*2-3);
   if(n.big&&!n.free&&SKT.zoom>.8){ctx.fillStyle=full?'#fff':'#14101a';ctx.fillRect(x-1,y-4,3,9);ctx.fillRect(x-4,y-1,9,3);ctx.fillStyle=full?n.c:'#5a4e68';ctx.fillRect(x,y,1,1);} // a keystone's cross
   if(full&&n.big){ctx.globalAlpha=.25+.15*Math.sin(time*3);ctx.fillStyle=n.c;ctx.fillRect(x-r-3,y-r-3,r*2+7,r*2+7);ctx.globalAlpha=1;}}
  else{ctx.fillStyle=full?n.c:lv?shade(n.c,-.25):open?'#4a3e58':'#241c2c';ctx.fillRect(x-r,y-r,r*2+1,r*2+1);
   if(n.old&&n.max>1&&lv>0&&lv<n.max){ctx.fillStyle='#14101a';ctx.fillRect(x-r,y-r,r*2+1,r*2+1);ctx.fillStyle=n.c;ctx.fillRect(x-r,y+r+1-Math.max(1,Math.round((r*2+1)*lv/n.max)),r*2+1,Math.max(1,Math.round((r*2+1)*lv/n.max)));}}
  if(can&&Math.floor(time*3)%2){ctx.fillStyle='#ffd040';ctx.fillRect(x-r-1,y-r-2,r*2+3,1);ctx.fillRect(x-r-1,y+r+2,r*2+3,1);}
  if(n.k===SKT.sel){const R2=r+3;ctx.fillStyle='#fff';ctx.fillRect(x-R2,y-R2,3,1);ctx.fillRect(x-R2,y-R2,1,3);ctx.fillRect(x+R2-2,y-R2,3,1);ctx.fillRect(x+R2,y-R2,1,3);ctx.fillRect(x-R2,y+R2,3,1);ctx.fillRect(x-R2,y+R2-2,1,3);ctx.fillRect(x+R2-2,y+R2,3,1);ctx.fillRect(x+R2,y+R2-2,1,3);}}
 if(SKT.zoom>.8)
 // the whole grid in miniature, top-right: owned nodes lit, keystones as bigger dots, the view as a frame
 {const k=.11,ox=stView.x0+stView.w-30,oy=stView.y0+20;ctx.fillStyle='rgba(6,3,10,.9)';ctx.fillRect(ox-28,oy-17,57,34);
  for(const n of SKT.nodes){ctx.fillStyle=stLv(n.k)>0?n.c:n.big?'#5a4e68':'#2e2638';const s2=n.big?2:1;ctx.fillRect(Math.round(ox+n.x*k),Math.round(oy+n.y*k),s2,s2);}
  ctx.fillStyle='rgba(255,255,255,.5)';const fx0=Math.round(ox+(SKT.cam.x-stView.w/2)*k),fy0=Math.round(oy+(SKT.cam.y-stView.h/2)*k),fw=Math.round(stView.w*k),fh=Math.round(stView.h*k);
  ctx.fillRect(fx0,fy0,fw,1);ctx.fillRect(fx0,fy0+fh,fw,1);ctx.fillRect(fx0,fy0,1,fh);ctx.fillRect(fx0+fw,fy0,1,fh);}
 ctx.restore();ctx.fillStyle='#3a2e44';ctx.fillRect(stView.x0,stView.y0+stView.h,stView.w,1);
 // details
 const n=sel,lv=stLv(n.k),mx=lv>=n.max,open=stOpen(n),ways=SKT.adj[n.k].length;ctx.fillStyle='rgba(20,12,26,.95)';ctx.fillRect(6,138,W-12,32);ctx.fillStyle=n.c;ctx.fillRect(6,138,2,32);
 const kind=n.free?'':n.big?'  KEYSTONE':n.mid?'  NOTABLE':'';txt(n.n+(n.max>1?'  '+lv+'/'+n.max:'')+kind,12,141,n.c);
 const words=n.d.split(' ');let line='',ly=150;for(const w of words){if(txtW(line+w)>W-30){txt(line,12,ly,'#ddd');ly+=8;line='';}line+=w+' ';}txt(line,12,ly,'#ddd');
 if(n.big&&!n.free)txt(ways+' PATHS LEAD HERE',12,ly+8,'#888');
 const s=mx?'OWNED':!open?'LOCKED':stCost(n)+' GOLD';txt(s,W-12-txtW(s),141,mx?'#6f6':!open?'#c55':meta.sen>=stCost(n)?'#fc4':'#666');
 ctxt((SKT.zt<1?'OVERVIEW: CLICK A NODE OR Z TO ZOOM IN':'WASD MOVE   ENTER BUY   Z OVERVIEW')+'   '+(treeFrom==='hub'?'ESC BACK':'TAB CHARACTERS   ESC BACK'),H-7,'#666');};
// arrow keys: step to the grid neighbour in that direction (linked first), or the nearest node that way
function stMove(dx,dy){const s=SKT.byK[SKT.sel];for(const k of SKT.adj[s.k]){const m=SKT.byK[k];if(m.gx-s.gx===dx&&m.gy-s.gy===dy){SKT.sel=k;sfx('coin');return;}}
 let best=null,bs=1e9;for(const n of SKT.nodes){if(n===s)continue;const vx=n.gx-s.gx,vy=n.gy-s.gy,d=Math.hypot(vx,vy),dot=(vx*dx+vy*dy)/d;if(dot<.7)continue;const sc=d*(2-dot);if(sc<bs){bs=sc;best=n;}}if(best){SKT.sel=best.k;sfx('coin');}}
upgradesKey=function(c){if(c==='KeyZ'){SKT.zt=SKT.zt<1?1:.42;sfx('coin');return;}if(c==='ArrowUp'||c==='KeyW')stMove(0,-1);else if(c==='ArrowDown'||c==='KeyS')stMove(0,1);else if(c==='ArrowLeft'||c==='KeyA')stMove(-1,0);else if(c==='ArrowRight'||c==='KeyD')stMove(1,0);
 else if(c==='Enter'||c==='Space')stBuy(SKT.byK[SKT.sel]);else if(c==='Escape'||c==='Tab'){if(treeFrom==='hub'){mode='hub';selTab=0;}else selTab=0;sfx('coin');}};
// the hub's summary: affordable nodes and progress per branch
function skillHubSummary(row){const avail=SKT.nodes.filter(n=>stOpen(n)&&stLv(n.k)<n.max&&meta.sen>=stCost(n)).length;
 row(2,117,'TEMPLE SKILL TREE',avail?avail+' NODE'+(avail>1?'S':'')+' AFFORDABLE':'ENTER TO VIEW',avail?'#ffd040':'#ddd');
 STB.forEach((B,b)=>{const x=20+b*36,ns=SKT.nodes.filter(n=>n.b===b),own=ns.filter(n=>stLv(n.k)>0).length;txt(B.n.slice(0,6),x,130,B.c);ctx.fillStyle='#2a2034';ctx.fillRect(x,139,30,3);ctx.fillStyle=B.c;ctx.fillRect(x,139,Math.round(30*own/ns.length),3);txt(own+'/'+ns.length,x,146,'#888');});
 const ks=SKT.nodes.filter(n=>n.big&&n.k!=='root'&&stLv(n.k)>0).map(n=>n.n);txt(ks.length?('KEYSTONES: '+ks.join(', ')).slice(0,70):'KEYSTONES: NONE YET',20,156,'#aaa');}

// the mouse wheel on the tree: zoom out to the whole grid, or back in
cv.addEventListener('wheel',e=>{if(mode==='select'&&selTab===1){SKT.zt=e.deltaY>0?.42:1;e.preventDefault();}},{passive:false});
