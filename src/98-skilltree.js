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
  if(g){meta.sen+=g;saveMeta();setTimeout(()=>setToast('THE SKILL TREE WAS REBUILT: '+g+' JADE REFUNDED','#ffd040',5),500);}}catch(e){}})();
const stLv=k=>k==='root'?1:upLv(k),stOpen=n=>n.free||SKT.adj[n.k].some(k=>stLv(k)>0),stCost=n=>n.old?n.base*(upLv(n.k)+1):n.cost;
function stBuy(n){
 const lv=stLv(n.k),cost=stCost(n);
 if(lv>=n.max||!stOpen(n)||meta.sen<cost){sfx('block');return;}
 meta.sen-=cost;meta.up[n.k]=lv+1;saveMeta();
 SKT.unlock={key:n.k,t:time,cost};
 sfx(n.big?'rare':n.mid?'heal':'pickup');
}
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
const stView={x:6,y:36,w:210,h:118};
const stBuyBox={x:226,y:137,w:82,h:13};
const stMapZoom=.40,stDetailZoom=1.2;
const stUI={zoom:stDetailZoom,target:stDetailZoom,x:0,y:0,press:null,route:null};
const stIn=(x,y,r)=>x>=r.x&&x<r.x+r.w&&y>=r.y&&y<r.y+r.h;
const stScreen=(x,y)=>[Math.round(111+(x-SKT.cam.x)*stUI.zoom),Math.round(95+(y-SKT.cam.y)*stUI.zoom)];
const stRadius=n=>stUI.zoom<.65?n.big?3:n.mid?2:1:n.big?9:n.mid?6:n.old?5:3;
const stAffordable=n=>stLv(n.k)<n.max&&stOpen(n)&&meta.sen>=stCost(n);
const stActive=()=>mode==='select'&&selTab===1;
const stOverview=()=>stUI.target===stMapZoom;
const stTab=b=>({x:6+39*b,y:21,w:35,h:11});
const stOverviewBox={x:6,y:157,w:49,h:11},stGateBox={x:58,y:157,w:43,h:11},stNextBox={x:104,y:157,w:112,h:11};
const stRGB=['#ee6460','#d6e2f1','#64d0f9','#c593fa','#72d893','#a990eb','#f0cc67','#a3df83'];

function stSelect(n,focus=true){
 if(SKT.sel!==n.k)sfx('coin');
 SKT.sel=n.k;
 if(focus){stUI.x=n.x;stUI.y=n.y;}
}
function stZoom(overview){
 stUI.target=overview?stMapZoom:stDetailZoom;
 const n=SKT.byK[overview?'root':SKT.sel];
 stUI.x=n.x;stUI.y=n.y;
}
function stJump(n){stSelect(n);stZoom(false);}
function stBranch(b){
 const ns=SKT.nodes.filter(n=>n.b===b);
 stJump(ns.find(stAffordable)||ns.find(n=>n.big)||ns[0]);
}
function stNext(){
 const i=SKT.nodes.findIndex(n=>n.k===SKT.sel);
 const ns=SKT.nodes.slice(i+1).concat(SKT.nodes.slice(0,i+1));
 const n=ns.find(stAffordable);
 if(n)stJump(n);else sfx('block');
}
function stNodeAt(x,y){
 if(!stIn(x,y,stView))return null;
 let best=null,score=Infinity;
 for(const n of SKT.nodes){
  const [nx,ny]=stScreen(n.x,n.y);
  if(!stIn(nx,ny,stView))continue;
  const d=Math.hypot(x-nx,y-ny);
  if(d<=stRadius(n)+2&&d<score){score=d;best=n;}
 }
 return best;
}
function stClick(){
 const {x,y}=mouse;
 if(stIn(x,y,stBuyBox)){stBuy(SKT.byK[SKT.sel]);return;}
 if(stIn(x,y,stOverviewBox)){stZoom(!stOverview());return;}
 if(stIn(x,y,stGateBox)){stJump(SKT.byK.root);return;}
 if(stIn(x,y,stNextBox)){stNext();return;}
 const branch=STB.findIndex((_,b)=>stIn(x,y,stTab(b)));
 if(branch>=0){stBranch(branch);return;}
 if(stIn(x,y,stView))stUI.press={x,y,camX:SKT.cam.x,camY:SKT.cam.y,node:stNodeAt(x,y),drag:false};
}
addEventListener('mousemove',e=>{
 const p=stUI.press;
 if(!p||!stActive()||stOverview())return;
 setMouse(e);
 const dx=mouse.x-p.x,dy=mouse.y-p.y;
 if(!p.drag&&Math.hypot(dx,dy)<3)return;
 p.drag=true;
 stUI.x=SKT.cam.x=clamp(p.camX-dx/stUI.zoom,-210,210);
 stUI.y=SKT.cam.y=clamp(p.camY-dy/stUI.zoom,-135,135);
});
addEventListener('mouseup',e=>{
 if(e.button!==0)return;
 const p=stUI.press;
 stUI.press=null;
 if(!p||!stActive()||p.drag)return;
 setMouse(e);
 if(!p.node||Math.hypot(mouse.x-p.x,mouse.y-p.y)>=3||!stIn(mouse.x,mouse.y,stView))return;
 if(stOverview())stJump(p.node);else stSelect(p.node,false);
});
addEventListener('blur',()=>{stUI.press=null;});
cv.addEventListener('wheel',e=>{
 if(!stActive()||!e.deltaY)return;
 e.preventDefault();setMouse(e);
 if(e.deltaY>0&&!stOverview())stZoom(true);
 else if(e.deltaY<0&&stOverview()){const n=stNodeAt(mouse.x,mouse.y);if(n)stSelect(n);stZoom(false);}
},{passive:false});

// Shortest connected route from the selected node to any node already owned.
function stRoute(n){
 const saved=stUI.route;
 if(saved&&saved.key===n.k&&saved.unlock===SKT.unlock)return saved;
 const path=new Map([[n.k,null]]),queue=[n.k],edges=new Map();
 const owned=n.free||stLv(n.k)>0;
 for(let i=0;!owned&&i<queue.length;i++){
  const k=queue[i];
  if(stLv(k)>0){
   for(let at=k;path.get(at);at=path.get(at))edges.set(path.get(at),at);
   break;
  }
  for(const next of SKT.adj[k])if(!path.has(next)){path.set(next,k);queue.push(next);}
 }
 const cost=[...edges.keys()].reduce((jade,k)=>jade+stCost(SKT.byK[k]),0);
 return stUI.route={key:n.k,unlock:SKT.unlock,edges,cost};
}

function stFill(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(x,y,w,h);}
function stPanel(x,y,w,h,c,edge){stFill(x,y,w,h,edge);stFill(x+1,y+1,w-2,h-2,c);}
function stCenter(s,x,w,y,c){txt(s,x+Math.floor((w-txtW(s))/2),y,c);}
function stWrap(s,x,y,w,c,step=7){
 let line='';
 for(const word of s.split(' ')){
  const next=line?line+' '+word:word;
  if(line&&txtW(next)>w){txt(line,x,y,c);y+=step;line=word;}
  else line=next;
 }
 if(line)txt(line,x,y,c);
 return y+step;
}
function stButton(box,label,enabled=true){
 const {x,y,w,h}=box,hover=enabled&&stIn(mouse.x,mouse.y,box);
 stPanel(x,y,w,h,hover?'#324239':enabled?'#19251f':'#14101a',hover?'#e8ce86':enabled?'#648b6c':'#413646');
 stCenter(label,x,w,y+Math.floor((h-5)/2),enabled?'#e9dbad':'#a59aaa');
}
function stGem(x,y,r,edge,inner){
 for(let dy=-r;dy<=r;dy++){
  const w=r-Math.abs(dy);
  stFill(x-w,y+dy,w*2+1,1,edge);
  if(w>0)stFill(x-w+1,y+dy,w*2-1,1,inner);
 }
}
function stDrawNode(n,x,y,selected,hover,route){
 const r=stRadius(n),owned=stLv(n.k)>0,ready=stAffordable(n),col=n.free?'#efe3b9':stRGB[n.b];
 const edge=owned?col:ready?'#e9c77c':route?'#a28e61':shade(col,-.67);
 const inner=owned?shade(col,-.73):ready?'#463326':'#1c1724';
 if(stUI.zoom<.65){
  stGem(x,y,r,edge,owned?col:inner);
 }else if(n.big||n.mid||n.old){
  if(n.big)stGem(x,y,r+3,shade(edge,-.55),'#120d18');
  stPanel(x-r,y-r,2*r+1,2*r+1,inner,edge);
  const art=stArt(n,owned||ready);
  ctx.drawImage(art,x-(art.width>>1),y-(art.height>>1));
  if(n.old&&owned)stFill(x-r,y+r,Math.ceil((2*r+1)*stLv(n.k)/n.max),1,col);
 }else{
  stGem(x,y,r,edge,inner);
  if(owned||ready)stFill(x,y-1,1,2,owned?col:'#ffe6a0');
 }
 if(selected||hover){
  const d=r+(n.big&&stUI.zoom>=.65?4:2),c=selected?'#fff0c6':'#b8a8ba';
  for(const sx of [-1,1])for(const sy of [-1,1]){
   stFill(x+sx*d-(sx>0?2:0),y+sy*d,3,1,c);
   stFill(x+sx*d,y+sy*d-(sy>0?2:0),1,3,c);
  }
 }
}
function stBurst(){
 const unlock=SKT.unlock;
 if(!unlock)return;
 const n=SKT.byK[unlock.key],age=time-unlock.t;
 if(age>=.7)return;
 const [x,y]=stScreen(n.x,n.y),col=n.big?'#ffe69e':n.c;
 ctx.globalAlpha=1-age/.7;
 circ(x,y,stRadius(n)+2+age*(n.big?48:30),col);
 if(n.big)circ(x,y,stRadius(n)+1+age*31,n.c);
 for(let i=0;i<(n.big?16:8);i++){
  const a=i*2.4,r=stRadius(n)+3+age*(22+i%4*7);
  stFill(Math.round(x+Math.cos(a)*r),Math.round(y+Math.sin(a)*r),i%3===0?2:1,1,i%2?col:'#fff1c2');
 }
 ctx.globalAlpha=1;
}
function stDrawMap(sel,hover,route){
 const v=stView;
 stPanel(v.x-1,v.y-1,v.w+2,v.h+2,'#0f0b15','#4a3949');
 ctx.save();ctx.beginPath();ctx.rect(v.x,v.y,v.w,v.h);ctx.clip();
 for(const n of SKT.nodes){
  const [x,y]=stScreen(n.x,n.y);
  if(x<v.x-24||x>v.x+v.w+24||y<v.y-24||y>v.y+v.h+24)continue;
  const col=n.free?'#24202a':shade(stRGB[n.b],-.89);
  const halfW=Math.floor(STG.dx*stUI.zoom/2),halfH=Math.floor(STG.dy*stUI.zoom/2);
  stFill(x-halfW+1,y-halfH+1,halfW*2-1,halfH*2-1,col);
 }
 for(const n of SKT.nodes)for(const k of SKT.adj[n.k]){
  if(k<=n.k)continue;
  const m=SKT.byK[k],[x,y]=stScreen(n.x,n.y),[mx,my]=stScreen(m.x,m.y);
  if(Math.max(x,mx)<v.x||Math.min(x,mx)>=v.x+v.w||Math.max(y,my)<v.y||Math.min(y,my)>=v.y+v.h)continue;
  const linked=stLv(n.k)>0&&stLv(k)>0,onRoute=route.edges.get(k)===n.k||route.edges.get(n.k)===k;
  const col=linked?(n.free?m.c:n.c):onRoute?'#e3bf77':stLv(n.k)||stLv(k)?'#856c75':'#413347';
  const thick=(linked||onRoute)&&stUI.zoom>.65?2:1;
  stFill(Math.min(x,mx),Math.min(y,my),y===my?Math.abs(x-mx):thick,x===mx?Math.abs(y-my):thick,col);
 }
 for(const n of SKT.nodes){
  const [x,y]=stScreen(n.x,n.y);
  if(x<v.x-16||x>=v.x+v.w+16||y<v.y-16||y>=v.y+v.h+16)continue;
  stDrawNode(n,x,y,n===sel,n===hover,route.edges.has(n.k));
 }
 stBurst();
 ctx.restore();
}
function stDetails(n,route){
 const lv=stLv(n.k),ready=stAffordable(n),col=n.free?'#efe3b9':stRGB[n.b],full=lv>=n.max,open=stOpen(n);
 stPanel(220,35,94,120,'#17111e','#4a3949');
 stFill(221,36,92,1,col);
 const art=stArt(n,true),crest=n.big?13:10;
 stGem(267,51,crest+1,shade(col,-.55),'#15111c');
 stGem(267,51,crest-2,shade(col,-.35),shade(col,-.83));
 const smooth=ctx.imageSmoothingEnabled;
 ctx.imageSmoothingEnabled=false;
 ctx.drawImage(art,267-art.width,51-art.height,art.width*2,art.height*2);
 ctx.imageSmoothingEnabled=smooth;
 const kind=n.free?'TEMPLE':n.big?'KEYSTONE':n.mid?'NOTABLE':n.old?'RANKED':'PASSIVE';
 stCenter(n.free?kind:STB[n.b].n+' / '+kind,221,92,66,col);
 const y=stWrap(n.n,226,76,82,'#fff0cf',7);
 stWrap(n.d,226,y+3,82,'#dad0d9');
 const unlock=SKT.unlock,justBought=unlock&&unlock.key===n.k&&time-unlock.t<1.3;
 const status=justBought?'UNLOCKED  -'+unlock.cost:!open?route.edges.size+' LINKS TO OWNED':n.old?'RANK '+lv+' / '+n.max:full?'ACTIVE':ready?'READY TO UNLOCK':'NEED '+(stCost(n)-meta.sen)+' MORE';
 stCenter(status,221,92,128,justBought||ready?'#f3d795':'#bdadbd');
 stButton(stBuyBox,full?n.free?'STARTING POINT':'MASTERED':!open?'LOCKED':(lv?'RANK UP ':'UNLOCK ')+stCost(n),ready);
 if(route.cost&&!open)stCenter('ROUTE: '+route.cost+' JADE',220,94,160,'#d5ba83');
 else if(n.old&&!full&&!ready&&open)stCenter('NEED '+(stCost(n)-meta.sen)+' MORE JADE',220,94,160,'#d5ba83');
}
renderUpgrades=function(){
 const n=SKT.byK[SKT.sel];
 SKT.cam.x+=(stUI.x-SKT.cam.x)*.22;SKT.cam.y+=(stUI.y-SKT.cam.y)*.22;
 stUI.zoom+=(stUI.target-stUI.zoom)*.28;
 const hover=stUI.press?.drag?null:stNodeAt(mouse.x,mouse.y),route=stRoute(n);
 stFill(0,0,W,H,'#0c0910');
 txt('TEMPLE SKILL TREE',6,5,'#f0d499',2);
 const owned=SKT.nodes.filter(node=>!node.free&&stLv(node.k)>0).length;
 const balance=String(meta.sen),x=W-7-txtW(balance);
 hudJade(x-10,4);txt(balance,x,5,JADEC);
 const progress=owned+'/'+(SKT.nodes.length-1)+' LEARNED';
 txt(progress,W-7-txtW(progress),13,'#b6a8b8');
 STB.forEach((b,i)=>{
  const box=stTab(i),col=stRGB[i],active=n.b===i;
  stPanel(box.x,box.y,box.w,box.h,active?shade(col,-.77):'#19131f',active||stIn(mouse.x,mouse.y,box)?col:shade(col,-.59));
  stCenter(b.n,box.x,box.w,box.y+3,col);
 });
 stDrawMap(n,hover,route);
 stDetails(n,route);
 stButton(stOverviewBox,stOverview()?'ZOOM IN':'OVERVIEW');
 stButton(stGateBox,'GATE');
 const count=SKT.nodes.filter(stAffordable).length;
 stButton(stNextBox,count?'NEXT AVAILABLE ('+count+')':'NO AFFORDABLE NODES',count>0);
 let hint='DRAG PAN   ARROWS MOVE   ENTER BUY   Z MAP   ESC BACK';
 if(hover&&hover!==n)hint=hover.n+' / CLICK TO INSPECT';
 else if(stOverview())hint='CLICK A NODE TO ZOOM IN   1-8 BRANCHES   ESC BACK';
 else if(stIn(mouse.x,mouse.y,stNextBox))hint='N / JUMP TO THE NEXT AFFORDABLE SKILL';
 else if(stIn(mouse.x,mouse.y,stGateBox))hint='HOME / RETURN TO THE TEMPLE GATE';
 ctxt(hint,172,'#afa0b3');
};
function stMove(dx,dy){
 const n=SKT.byK[SKT.sel];
 const linked=SKT.adj[n.k].map(k=>SKT.byK[k]).find(m=>m.gx-n.gx===dx&&m.gy-n.gy===dy);
 if(linked){stSelect(linked,!stOverview());return;}
 let best=null,score=Infinity;
 for(const m of SKT.nodes){
  const vx=m.gx-n.gx,vy=m.gy-n.gy,d=Math.hypot(vx,vy);
  if(!d)continue;
  const dot=(vx*dx+vy*dy)/d;
  if(dot<.7)continue;
  const s=d*(2-dot);
  if(s<score){score=s;best=m;}
 }
 if(best)stSelect(best,!stOverview());
}
upgradesKey=function(c){
 if(c==='KeyZ'){stZoom(!stOverview());return;}
 if(c==='Home'){stJump(SKT.byK.root);return;}
 if(c==='KeyN'){stNext();return;}
 if(/^Digit[1-8]$/.test(c)){stBranch(Number(c.slice(-1))-1);return;}
 if(c==='ArrowUp'||c==='KeyW')stMove(0,-1);
 else if(c==='ArrowDown'||c==='KeyS')stMove(0,1);
 else if(c==='ArrowLeft'||c==='KeyA')stMove(-1,0);
 else if(c==='ArrowRight'||c==='KeyD')stMove(1,0);
 else if(c==='Enter'||c==='Space')stBuy(SKT.byK[SKT.sel]);
 else if(c==='Escape'||c==='Tab'){stUI.press=null;if(treeFrom==='hub')mode='hub';selTab=0;sfx('coin');}
};

// the hub's summary: affordable nodes and progress per branch
function skillHubSummary(row){const avail=SKT.nodes.filter(n=>stOpen(n)&&stLv(n.k)<n.max&&meta.sen>=stCost(n)).length;
 row(2,117,'TEMPLE SKILL TREE',avail?avail+' NODE'+(avail>1?'S':'')+' AFFORDABLE':'ENTER TO VIEW',avail?'#ffd040':'#ddd');
 STB.forEach((B,b)=>{const x=20+b*36,ns=SKT.nodes.filter(n=>n.b===b),own=ns.filter(n=>stLv(n.k)>0).length;txt(B.n.slice(0,6),x,130,B.c);ctx.fillStyle='#2a2034';ctx.fillRect(x,139,30,3);ctx.fillStyle=B.c;ctx.fillRect(x,139,Math.round(30*own/ns.length),3);txt(own+'/'+ns.length,x,146,'#888');});
 const ks=SKT.nodes.filter(n=>n.big&&n.k!=='root'&&stLv(n.k)>0).map(n=>n.n);txt(ks.length?('KEYSTONES: '+ks.join(', ')).slice(0,70):'KEYSTONES: NONE YET',20,156,'#aaa');}

// ---------------------------------------------------------------- keystone icons: a picture of what each one does
const KSICON={
 'TEMPLE GATE':['rrrrrrrrrrr','.rrrrrrrrr.','..r.....r..','rrrrrrrrrrr','..r.....r..','..r.....r..','..r.....r..','..r.....r..','..r.....r..','.ddd...ddd.','...........'],
 'BERSERKER':['..rr...rr..','.rrrr.rrrr.','rrwrrrrrrrr','rrrrrwrrrrr','rrrrwrrrrrr','.rrrrwrrrr.','..rrrrwrr..','...rrrrr...','....rrr....','.....r.....','...........'],
 'EXECUTIONER':['..kkk......','.kwwwkoo...','kwwwwwkoo..','kwwwwwkoo..','kwwwwwkoo..','.kwwwkoo...','..kkk.oo...','......oo...','......oo...','......oo...','.....oooo..'],
 'IAIDO MASTER':['.........w.','........wk.','.......wk..','......wk...','.....wk....','....wk.....','...yy......','..ry.......','.rd........','rd.........','...........'],
 'BLADE DANCE':['...aaaaa...','.aa.....a..','.a......kw.','a......wk.a','a.....wk..a','a....wk...a','a...yy....a','.a.ry....a.','..rd....aa.','...aaaaa...','...........'],
 'MOMENTUM':['...........','a....a.....','aa...aa....','.aa...aa...','..aa...aa..','...aa...aa.','..aa...aa..','.aa...aa...','aa...aa....','a....a.....','...........'],
 'TIME WEAVER':['yyyyyyyyyyy','.wbbbbbbbw.','..wbbbbbw..','...wbbbw...','....wbw....','.....w.....','....w.w....','...w...w...','..w..b..w..','.w..bbb..w.','yyyyyyyyyyy'],
 'OVERCHANNEL':['.....a.....','.a...a...a.','..a..a..a..','...aawaa...','....www....','aaawwwwwaaa','....www....','...aawaa...','..a..a..a..','.a...a...a.','.....a.....'],
 'ECHO MIND':['...b....w..','..bbb..waw.','.bwwbb..w..','.baabbbb...','bbbaaaabbb.','bawbaabbb..','bawbaaba...','.baababa...','..bbbba....','...b.a.....','....a......'],
 'COLOSSUS':['kkkkkkkkkkk','kaaaawaaaak','kaaaawaaaak','kwwwwwwwwwk','kaaaawaaaak','.kaaawaaak.','.kaaawaaak.','..kaawaak..','...kawak...','....kkk....','.....k.....'],
 'UNDYING':['.....w.....','....wa.....','...waa.a...','...aaaawa..','..aaawaaw..','..aaawaaa..','...aaawa...','....aaa....','.yyyyyyyyy.','..oyyyyyo..','....ooo....'],
 'GHOST STEP':['....waa....','...waaaa...','..waadwaa..','..aaaddaa..','...aaaab...','..aaabb....','aaaab......','...bbb..a..','.bb..aab...','....bb....a','.......bb..'],
 'GRAZE MASTER':['...........','...rrr.....','..rwwwr....','..rwwwr....','..rwwwr....','...rrr.....','.a.......a.','..a.....a..','...aaaaa...','...........','...........'],
 'MIDAS':['...ooooo...','..oylllyo..','..oyyyyyo..','...ooooo...','..oyyyyyo..','..oylllyo..','...ooooo...','..oyyyyyo..','..oylllyo..','...ooooo...','...........'],
 'TREASURE HUNTER':['...........','.ooooooooo.','oyyyyyyyyyo','oyyyyyyyyyo','ooooolooooo','oyyyylyyyyo','oyyyyyyyyyo','oyyyyyyyyyo','ooooooooooo','...........','...........'],
 'EAGLE EYE':['...........','...aaaaa...','.aawwwwwaa.','awwwbbbwwwa','awwbbdbbwwa','awwbdddbwwa','awwbbdbbwwa','awwwbbbwwwa','.aawwwwwaa.','...aaaaa...','...........'],
 'MARKED PREY':['.....r.....','...rrrrr...','..r..r..r..','.r...r...r.','.r.......r.','rrrr.w.rrrr','.r.......r.','.r...r...r.','..r..r..r..','...rrrrr...','.....r.....']};
const KSPAL={w:'#f0f0f0',d:'#2a2030',k:'#8a8a9a',r:'#e03040',y:'#e0b040',l:'#fff0a0',o:'#8a6010',b:'#40a0e0',p:'#c080ff'};
const KSC={};
function ksIcon(name,col,owned){const k=name+col+owned;if(KSC[k])return KSC[k];const A=KSICON[name];if(!A)return null;
 return KSC[k]=mk(11,11,g=>{A.forEach((row,y)=>{for(let x=0;x<11;x++){const ch=row[x];if(ch==='.')continue;let c=ch==='a'?col:KSPAL[ch];if(!owned)c=shade(c,-.45);g.fillStyle=c;g.fillRect(x,y,1,1);}});});}

// Pixel stamps for the eight temples. Small stat nodes use these in the detail panel.
const stStamps=[
 ['......w','.....wr','....wr.','r..wr..','.rrr...','..ry...','.yy.r..'],
 ['...w...','..wwa..','.wwaad.','wwaaadd','.aaadd.','..add..','...d...'],
 ['...w...','..wa...','..wa.w.','.waa.w.','waaaaw.','wbaaab.','.bbbb..'],
 ['...w...','..waw..','.waaaw.','waaWaaw','.waaaw.','..waw..','...w...'],
 ['.wwwww.','waaWaad','waWWWad','waaWaad','.aaaad.','..aad..','...d...'],
 ['....ww.','..waa..','.waa...','.waa...','.waaa..','..waaww','...www.'],
 ['..ooo..','.oylyo.','oyllyyo','oylyyyo','oyyyyyo','.oyyyo.','..ooo..'],
 ['ww.....','waw....','.waw..w','..waw..','...way.','....yaw','..w..ww']
];
const stStampsCache={};
function stArt(n,lit){
 if(n.big)return ksIcon(n.n,n.c,lit);
 const k=n.b+':'+lit;
 if(stStampsCache[k])return stStampsCache[k];
 return stStampsCache[k]=mk(7,7,g=>{
  stStamps[n.b].forEach((row,y)=>{
   for(let x=0;x<7;x++){
    const ch=row[x];
    if(ch==='.')continue;
    const col=ch==='a'?stRGB[n.b]:ch==='W'?'#fff8d4':KSPAL[ch];
    g.fillStyle=lit?col:shade(col,-.51);
    g.fillRect(x,y,1,1);
   }
  });
 });
}
