'use strict';
// HELL OF THE EMPEROR - the TEMPLE SKILL TREE. A web of ~110 nodes around a free root: eight themed branches (War, Blade,
// Spirit, Arcane, Body, Shadow, Fortune, Hunt), each a winding path with side forks, two KEYSTONES (big nodes that change how
// you play) and bridges to its neighbours, so there are many routes. Small nodes are small stat increases. You can buy any
// node next to one you own. The original sixteen nodes keep their keys (meta.up), so ranks already bought carry over.
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
(function buildTree(){const add=n=>{SKT.nodes.push(n);SKT.byK[n.k]=n;SKT.adj[n.k]=SKT.adj[n.k]||[];return n;},link=(a,b)=>{SKT.adj[a.k].push(b.k);SKT.adj[b.k].push(a.k);};
 const root=add({k:'root',n:'TEMPLE GATE',d:'WHERE EVERY PATH BEGINS',x:0,y:0,max:1,free:1,c:'#ffffff',big:1});
 const ring=[];
 STB.forEach((B,b)=>{const a=b*Math.PI/4-Math.PI/2,ux=Math.cos(a),uy=Math.sin(a),px=-uy,py=ux;let prev=root;ring[b]={};
  for(let i=1;i<=9;i++){const r=26+i*28,zig=(i%2?1:-1)*7,x=ux*r+px*zig,y=uy*r*.62+py*zig*.62;let n;
   if(B.old&&i<=4){const o=TNODE[B.old[i-1]];n=add({k:o.k,n:o.n,d:o.d,base:o.base,max:o.max,x,y,c:B.c,b,old:1});}
   else if(i===5||i===9){const [nm,d]=B.ks[i===5?0:1];n=add({k:'ks_'+b+'_'+i,n:nm,d,eff:{['ks:'+nm]:1},cost:i===5?300:650,max:1,x,y,c:B.c,b,big:1});}
   else{const e=B.st[(i+b)%3];n=add({k:'st_'+b+'_'+i,n:B.n+' '+ROMAN[i-1],eff:e,cost:22+i*14,max:1,x,y,c:B.c,b});}
   link(prev,n);prev=n;ring[b][i]=n;
   // side forks: a short spur off the path
   if(i===2||i===4||i===7){const sd=i===4?-1:1,s=add({k:'sd_'+b+'_'+i,n:B.n+' SPUR',eff:B.st[(i+b+1)%3],cost:30+i*14,max:1,x:x+px*26*sd,y:y+py*26*sd*.62,c:B.c,b});link(n,s);
    if(i===7){const s2=add({k:'sd2_'+b,n:B.n+' SPUR II',eff:B.st[(b+2)%3],cost:150,max:1,x:x+px*46*sd+ux*12,y:(y+py*46*sd*.62)+uy*8,c:B.c,b});link(s,s2);}}}});
 // bridges between neighbouring branches at depth 3 and 7: loops, so there is always another way round
 STB.forEach((B,b)=>{const nb=(b+1)%8,C=STB[nb];for(const i of [3,7]){const p=ring[b][i],q=ring[nb][i],e1=B.st[0],e2=C.st[0],eff={};for(const k in e1)eff[k]=(eff[k]||0)+e1[k]*.6;for(const k in e2)eff[k]=(eff[k]||0)+(typeof e2[k]==='number'&&k!=='def'&&k!=='graze'&&k!=='luck'?e2[k]*.6:e2[k]);
   for(const k in eff)if(k==='def'||k==='graze'||k==='luck')eff[k]=Math.max(1,Math.round(eff[k]));
   const n=add({k:'br_'+b+'_'+i,n:B.n+'-'+C.n+' BRIDGE',eff,cost:60+i*16,max:1,x:(p.x+q.x)/2,y:(p.y+q.y)/2,c:mixC(B.c,C.c,.5),b:-1});link(p,n);link(n,q);}});
 for(const n of SKT.nodes)if(!n.d)n.d=Object.keys(n.eff).map(k=>STAT_TXT[k]?STAT_TXT[k](n.eff[k]):k).join(', ');})();
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
const stScr=n=>[Math.round(stView.x0+stView.w/2+n.x-SKT.cam.x),Math.round(stView.y0+stView.h/2+n.y-SKT.cam.y)];
function stNodeAt(mx,my){let best=null,bd=8;for(const n of SKT.nodes){const [x,y]=stScr(n);const d=Math.hypot(mx-x,my-y);if(d<bd&&y>stView.y0&&y<stView.y0+stView.h){bd=d;best=n;}}return best;}
function stClick(){const n=stNodeAt(mouse.x,mouse.y);if(!n)return;if(SKT.sel===n.k)stBuy(n);else{SKT.sel=n.k;sfx('coin');}}
renderUpgrades=function(){const sel=SKT.byK[SKT.sel]||SKT.byK.root;SKT.cam.x+=(sel.x-SKT.cam.x)*.18;SKT.cam.y+=(sel.y-SKT.cam.y)*.18;
 ctxt('TEMPLE SKILL TREE',4,'#d02030',2);{const s='GOLD '+meta.sen;txt(s,W-8-txtW(s),8,'#fc4');const own=SKT.nodes.filter(n=>stLv(n.k)>0).length;txt('NODES '+own+'/'+SKT.nodes.length,8,8,'#888');}
 if(mouse.x!==selMX||mouse.y!==selMY){const h=stNodeAt(mouse.x,mouse.y);if(h)SKT.sel=h.k;selMX=mouse.x;selMY=mouse.y;}
 ctx.save();ctx.beginPath();ctx.rect(stView.x0,stView.y0,stView.w,stView.h);ctx.clip();ctx.fillStyle='rgba(12,8,16,.9)';ctx.fillRect(stView.x0,stView.y0,stView.w,stView.h);
 // branch names at the outer ends
 STB.forEach((B,b)=>{const a=b*Math.PI/4-Math.PI/2,r=26+10*28+12,[x,y]=stScr({x:Math.cos(a)*r,y:Math.sin(a)*r*.62});txt(B.n,x-Math.round(txtW(B.n)/2),y-2,shade(B.c,-.2));});
 // links: bright where both ends are owned, dim where one is, dark otherwise
 for(const n of SKT.nodes)for(const k of SKT.adj[n.k]){if(k<n.k)continue;const m=SKT.byK[k],[x0,y0]=stScr(n),[x1,y1]=stScr(m),a=stLv(n.k)>0,b2=stLv(k)>0;sline(x0,y0,x1,y1,a&&b2?(n.b>=0?n.c:m.c):a||b2?'#5a4e68':'#2a2234');}
 for(const n of SKT.nodes){const [x,y]=stScr(n);if(x<-10||x>W+10||y<10||y>stView.y0+stView.h+10)continue;const lv=stLv(n.k),open=stOpen(n),can=open&&lv<n.max&&meta.sen>=stCost(n),r=n.big?4:2;
  ctx.fillStyle='#14101a';ctx.fillRect(x-r-1,y-r-1,r*2+3,r*2+3);ctx.fillStyle=lv>=n.max?n.c:lv?shade(n.c,-.25):open?'#3a3044':'#1e1826';ctx.fillRect(x-r,y-r,r*2+1,r*2+1);
  if(n.old&&n.max>1&&lv>0&&lv<n.max){ctx.fillStyle='#14101a';ctx.fillRect(x-r+1,y-r+1,r*2-1,r*2-1);ctx.fillStyle=n.c;ctx.fillRect(x-r+1,y+r-Math.round((r*2-1)*lv/n.max),r*2-1,Math.round((r*2-1)*lv/n.max));}
  if(n.big&&lv){ctx.fillStyle='#fff';ctx.fillRect(x,y,1,1);}
  if(can&&Math.floor(time*3)%2){ctx.fillStyle='#ffd040';ctx.fillRect(x-r-1,y-r-1,r*2+3,1);ctx.fillRect(x-r-1,y+r+1,r*2+3,1);}
  if(n.k===SKT.sel){ctx.fillStyle='#fff';ctx.fillRect(x-r-3,y-r-3,r*2+7,1);ctx.fillRect(x-r-3,y+r+3,r*2+7,1);ctx.fillRect(x-r-3,y-r-3,1,r*2+7);ctx.fillRect(x+r+3,y-r-3,1,r*2+7);}}
 // the whole web in miniature, top-right: owned nodes lit, the view as a frame
 {const k=.12,ox=stView.x0+stView.w-50,oy=stView.y0+30;ctx.fillStyle='rgba(8,4,12,.85)';ctx.fillRect(ox-46,oy-28,92,56);
  for(const n of SKT.nodes){ctx.fillStyle=stLv(n.k)>0?n.c:'#3a3044';ctx.fillRect(Math.round(ox+n.x*k),Math.round(oy+n.y*k),1,1);}
  ctx.fillStyle='rgba(255,255,255,.5)';const fx0=Math.round(ox+(SKT.cam.x-stView.w/2)*k),fy0=Math.round(oy+(SKT.cam.y-stView.h/2)*k),fw=Math.round(stView.w*k),fh=Math.round(stView.h*k);
  ctx.fillRect(fx0,fy0,fw,1);ctx.fillRect(fx0,fy0+fh,fw,1);ctx.fillRect(fx0,fy0,1,fh);ctx.fillRect(fx0+fw,fy0,1,fh);}
 ctx.restore();
 // details
 const n=sel,lv=stLv(n.k),mx=lv>=n.max,open=stOpen(n);ctx.fillStyle='rgba(20,12,26,.95)';ctx.fillRect(6,138,W-12,32);ctx.fillStyle=n.c;ctx.fillRect(6,138,2,32);
 txt(n.n+(n.max>1?'  '+lv+'/'+n.max:'')+(n.big&&n.k!=='root'?'  KEYSTONE':''),12,141,n.c);
 const words=n.d.split(' ');let line='',ly=150;for(const w of words){if(txtW(line+w)>W-30){txt(line,12,ly,'#ddd');ly+=8;line='';}line+=w+' ';}txt(line,12,ly,'#ddd');
 const s=mx?'OWNED':!open?'LOCKED':stCost(n)+' GOLD';txt(s,W-12-txtW(s),141,mx?'#6f6':!open?'#c55':meta.sen>=stCost(n)?'#fc4':'#666');
 ctxt('ARROWS MOVE   ENTER BUY   '+(treeFrom==='hub'?'ESC BACK':'TAB CHARACTERS   ESC BACK'),H-7,'#666');};
// arrow keys: jump to the nearest node in that direction (a linked one if there is one)
function stMove(dx,dy){const s=SKT.byK[SKT.sel];let best=null,bs=1e9;for(const n of SKT.nodes){if(n===s)continue;const vx=n.x-s.x,vy=n.y-s.y,d=Math.hypot(vx,vy);if(d<1)continue;const dot=(vx*dx+vy*dy)/d;if(dot<.5)continue;
  const sc=d*(2-dot)*(SKT.adj[s.k].includes(n.k)?.6:1);if(sc<bs){bs=sc;best=n;}}if(best){SKT.sel=best.k;sfx('coin');}}
upgradesKey=function(c){if(c==='ArrowUp'||c==='KeyW')stMove(0,-1);else if(c==='ArrowDown'||c==='KeyS')stMove(0,1);else if(c==='ArrowLeft'||c==='KeyA')stMove(-1,0);else if(c==='ArrowRight'||c==='KeyD')stMove(1,0);
 else if(c==='Enter'||c==='Space')stBuy(SKT.byK[SKT.sel]);else if(c==='Escape'||c==='Tab'){if(treeFrom==='hub'){mode='hub';selTab=0;}else selTab=0;sfx('coin');}};
// the hub's summary: affordable nodes and progress per branch
function skillHubSummary(row){const avail=SKT.nodes.filter(n=>stOpen(n)&&stLv(n.k)<n.max&&meta.sen>=stCost(n)).length;
 row(2,117,'TEMPLE SKILL TREE',avail?avail+' NODE'+(avail>1?'S':'')+' AFFORDABLE':'ENTER TO VIEW',avail?'#ffd040':'#ddd');
 STB.forEach((B,b)=>{const x=20+b*36,ns=SKT.nodes.filter(n=>n.b===b),own=ns.filter(n=>stLv(n.k)>0).length;txt(B.n.slice(0,6),x,130,B.c);ctx.fillStyle='#2a2034';ctx.fillRect(x,139,30,3);ctx.fillStyle=B.c;ctx.fillRect(x,139,Math.round(30*own/ns.length),3);txt(own+'/'+ns.length,x,146,'#888');});
 const ks=SKT.nodes.filter(n=>n.big&&n.k!=='root'&&stLv(n.k)>0).map(n=>n.n);txt(ks.length?('KEYSTONES: '+ks.join(', ')).slice(0,70):'KEYSTONES: NONE YET',20,156,'#aaa');}
