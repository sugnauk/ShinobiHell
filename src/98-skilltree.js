'use strict';
// HELL OF THE EMPEROR - the TEMPLE SKILL TREE: a grid of ~240 nodes around a free root, split into eight themed regions (War,
// Blade, Spirit, Arcane, Body, Shadow, Fortune, Hunt). Small nodes are small stat increases, notables give two stats, and
// sixteen KEYSTONES (big nodes that change how you play) can each be reached from several sides. You can buy any node next
// to one you own. The original sixteen ranked nodes keep their keys (meta.up), so ranks already bought carry over.
const TEMPLE_KEYSTONE={berserker:.06,executioner:.10,iaido:.06,momentumPower:.05,momentumSpeed:.025,
 timeDash:.05,overchannel:.11,overchannelBasic:.025,colossus:.20,colossusSpeed:.02,ghostDodge:.025,
 grazeHeal:.001,midas:.10,treasure:.11,eagleRange:.06,eagleCrit:.01,marked:.20};
const TEMPLE_LUCK=.01;
const STB=[
 {n:'WAR',c:'#ff5050',old:['atk','crit','bossd','wrath'],st:[{pow:.0075},{crit:.005},{boss:.01}],ks:[
  ['BERSERKER','+'+cdPct(TEMPLE_KEYSTONE.berserker)+' DAMAGE WHILE BELOW HALF HEALTH'],
  ['EXECUTIONER','+'+cdPct(TEMPLE_KEYSTONE.executioner)+' DAMAGE TO FOES BELOW 25% HEALTH']]},
 {n:'BLADE',c:'#e8eef6',st:[{near:.0125},{aspd:.0075},{def:.25}],ks:[
  ['IAIDO MASTER','+'+cdPct(TEMPLE_KEYSTONE.iaido)+' DAMAGE TO FOES CLOSE TO YOU'],['BLADE DANCE','YOUR DASH DEALS LIGHT DAMAGE TO NEARBY FOES']]},
 {n:'SPIRIT',c:'#40c0ff',old:['emb','swift','dashm','flow'],st:[{cdr:.0025},{spd:.006},{dash:.006}],ks:[
  ['MOMENTUM','UNHIT FOR 2S: +'+cdPct(TEMPLE_KEYSTONE.momentumPower)+' DAMAGE AND +'+cdPct(TEMPLE_KEYSTONE.momentumSpeed)+' SPEED'],
  ['TIME WEAVER','-'+cdPct(COOLDOWN.timeWeaver)+' COOLDOWNS, BUT +'+cdPct(TEMPLE_KEYSTONE.timeDash)+' DASH COOLDOWN']]},
 {n:'ARCANE',c:'#c080ff',st:[{abil:.0125},{cdr:.002},{range:.015}],ks:[
  ['OVERCHANNEL','+'+cdPct(TEMPLE_KEYSTONE.overchannel)+' ABILITY DAMAGE, -'+cdPct(TEMPLE_KEYSTONE.overchannelBasic)+' BASIC ATTACK DAMAGE'],
  ['ECHO MIND','ABILITIES HAVE A '+cdPct(COOLDOWN.echoChance)+' CHANCE TO REFUND '+cdPct(COOLDOWN.echoRefund)+' OF THEIR COOLDOWN']]},
 {n:'BODY',c:'#50e060',old:['vit','pos','iron','res'],st:[{hp:.0175},{def:.25},{regen:.0004}],ks:[
  ['COLOSSUS','+'+cdPct(TEMPLE_KEYSTONE.colossus)+' MAX HP, -'+cdPct(TEMPLE_KEYSTONE.colossusSpeed)+' MOVE SPEED'],
  ['UNDYING','START EACH RUN WITH ONE EXTRA REVIVE']]},
 {n:'SHADOW',c:'#9a7aff',st:[{dodge:.003},{spd:.005},{graze:1}],ks:[
  ['GHOST STEP','+'+cdPct(TEMPLE_KEYSTONE.ghostDodge)+' DODGE, -'+cdPct(COOLDOWN.ghostStep)+' DASH COOLDOWN'],
  ['GRAZE MASTER','EVERY GRAZE HEALS '+cdPct(TEMPLE_KEYSTONE.grazeHeal)+' MAX HP']]},
 {n:'FORTUNE',c:'#ffd040',old:['sen','purse','belt','heir'],st:[{gold:.015},{pot:.01},{luck:1}],ks:[
  ['MIDAS','+'+cdPct(TEMPLE_KEYSTONE.midas)+' GOLD'],
  ['TREASURE HUNTER','+'+cdPct(TEMPLE_KEYSTONE.treasure)+' CHANCE TO UPGRADE GEAR IN ORDINARY LOOT BAGS BY ONE QUALITY TIER']]},
 {n:'HUNT',c:'#80ff80',st:[{range:.015},{crit:.005},{pow:.005}],ks:[
  ['EAGLE EYE','+'+cdPct(TEMPLE_KEYSTONE.eagleRange)+' RANGE, +'+cdPct(TEMPLE_KEYSTONE.eagleCrit)+' CRIT'],
  ['MARKED PREY','YOUR FIRST HIT ON EACH FOE DEALS +'+cdPct(TEMPLE_KEYSTONE.marked)+' DAMAGE']]}];
const STAT_TXT={pow:v=>'+'+cdPct(v)+' POWER',crit:v=>'+'+cdPct(v)+' CRIT',boss:v=>'+'+cdPct(v)+' DAMAGE TO BOSSES AND ELITES',near:v=>'+'+cdPct(v)+' DAMAGE TO FOES CLOSE TO YOU',
 aspd:v=>'+'+cdPct(v)+' ATTACK SPEED',def:v=>'+'+v+' DEFENCE',cdr:v=>'-'+cdPct(v)+' COOLDOWNS',spd:v=>'+'+cdPct(v)+' MOVE SPEED',dash:v=>'-'+cdPct(v)+' DASH COOLDOWN',
 abil:v=>'+'+cdPct(v)+' ABILITY DAMAGE',range:v=>'+'+cdPct(v)+' RANGE',hp:v=>'+'+cdPct(v)+' MAX HP',regen:v=>'REGENERATE '+cdPct(v)+' HP/S',dodge:v=>'+'+cdPct(v)+' DODGE',
 graze:v=>'GRAZES COOL ABILITIES '+Math.round(COOLDOWN.grazeNode*v*10000)/10+'MS MORE',gold:v=>'+'+cdPct(v)+' GOLD',pot:v=>'POTIONS RESTORE '+cdPct(v)+' MORE MAX HP',luck:v=>'+'+cdPct(TEMPLE_LUCK*v)+' CHANCE OF BETTER GEAR IN ORDINARY LOOT BAGS'};
// Keystones are the only nodes with ranks (I-III). Ranks II and III each add this bonus on top of the keystone itself.
const KSRANK={'BERSERKER':{pow:.0125},'EXECUTIONER':{crit:.01},'IAIDO MASTER':{near:.02},'BLADE DANCE':{aspd:.0125},'MOMENTUM':{spd:.01},'TIME WEAVER':{cdr:.004},
 'OVERCHANNEL':{abil:.02},'ECHO MIND':{cdr:.003},'COLOSSUS':{hp:.015},'UNDYING':{def:.25},'GHOST STEP':{dodge:.005},'GRAZE MASTER':{graze:1},
 'MIDAS':{gold:.025},'TREASURE HUNTER':{luck:1},'EAGLE EYE':{range:.015},'MARKED PREY':{crit:.0075}};
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
 put(0,0,{k:'root',n:'TEMPLE GATE',d:'UNSPENT RUN GOLD BECOMES JADE. LEARN CONNECTED SKILLS OR PIN A KEYSTONE TO PLAN A BUILD.',max:1,free:1,c:'#ffffff',big:1});
 const axis=b=>{const a=b*Math.PI/4-Math.PI/2;return [Math.cos(a),Math.sin(a)];};
 const at=(b,r,off)=>{const [ux,uy]=axis(b),a=Math.atan2(uy,ux)+(off||0);return [Math.round(Math.cos(a)*r*1.35),Math.round(Math.sin(a)*r)];};
 STB.forEach((B,b)=>{
  // the original ranked nodes: three steps out along the axis, the fourth beside the second
  if(B.old){const [ux,uy]=axis(b),sx=Math.round(ux),sy=Math.round(uy);[[1,0],[2,0],[3,0],[2,1]].forEach(([d,o],i)=>{const o2=TNODE[B.old[i]],gx=sx*d+(o?-sy:0),gy=sy*d+(o?sx:0);
    put(gx,gy,{k:o2.k,n:o2.n,d:o2.d.replace(' PER RANK',''),base:o2.base,max:1,c:B.c,b,old:1});});}
  // two keystones per branch, inner and outer
  [[4.2,0],[6.5,0]].forEach(([r,o],i)=>{const [gx,gy]=at(b,r,o);if(cell[key(gx,gy)])return;const [nm,d]=B.ks[i];put(gx,gy,{k:'kst_'+nm.replace(/[^A-Z]/g,''),n:nm,d,eff:{['ks:'+nm]:1},rk:KSRANK[nm],cost:i?700:320,max:3,c:B.c,b,big:1});});
  // two notables per branch, off to each side between the keystones
  [[5.6,.32],[5.6,-.32]].forEach(([r,o],i)=>{const [gx,gy]=at(b,r,o);if(cell[key(gx,gy)])return;const e={},e1=B.st[i%3],e2=B.st[(i+1)%3];for(const k in e1)e[k]=(e[k]||0)+e1[k]*2;for(const k in e2)e[k]=(e[k]||0)+e2[k]*2;
   put(gx,gy,{k:'ntb_'+b+'_'+i,n:NOTA[b][i],eff:e,cost:180,max:1,c:B.c,b,mid:1});});});
 // every other cell in the oval is a small node of the branch it points at
 const nearSp=(gx,gy)=>[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>{const m=cell[key(gx+a,gy+b)];return m&&(m.big||m.mid||m.free||m.old);});
 for(let gy=-Math.floor(STG.RY);gy<=Math.floor(STG.RY);gy++)for(let gx=-Math.floor(STG.RX);gx<=Math.floor(STG.RX);gx++){if(!inside(gx,gy)||cell[key(gx,gy)])continue;if(!nearSp(gx,gy)&&hash(gx*41+9,gy*29+3)<.14)continue;
  const b=brOf(gx,gy),B=STB[b],d=Math.hypot(gx/1.35,gy),h=hash(gx*7+31,gy*13+7),e=B.st[(Math.floor(h*3))%3],sc=d>5.5?1.5:1,eff={};for(const k in e)eff[k]=e[k]*(['def','graze','luck'].includes(k)?Math.round(sc):sc);
  put(gx,gy,{k:'g_'+gx+'_'+gy,n:B.n+' '+ROMAN[Math.min(11,Math.floor(d))],eff,cost:Math.round(18+d*d*5),max:1,c:B.c,b});}
 // grid links, a quarter cut (never next to the gate, a keystone, a notable or a ranked node)
 const special=n=>n.big||n.mid||n.old||n.free;
 for(const n of SKT.nodes)for(const [ox,oy] of [[1,0],[0,1]]){const m=cell[key(n.gx+ox,n.gy+oy)];if(!m)continue;if(!special(n)&&!special(m)&&hash(n.gx*17+ox*5+3,n.gy*23+oy*7+11)<.4)continue;link(n,m);}
 // make sure everything can be reached from the gate: reconnect any island to its nearest reachable neighbour
 for(let pass=0;pass<20;pass++){const seen=new Set(['root']),q=['root'];while(q.length){const k=q.pop();for(const m of SKT.adj[k])if(!seen.has(m)){seen.add(m);q.push(m);}}
  const lost=SKT.nodes.filter(n=>!seen.has(n.k));if(!lost.length)break;
  for(const n of lost){for(const [ox,oy] of [[1,0],[-1,0],[0,1],[0,-1]]){const m=cell[key(n.gx+ox,n.gy+oy)];if(m&&seen.has(m.k)){link(n,m);break;}}}}
 for(const n of SKT.nodes)if(!n.d)n.d=Object.keys(n.eff).map(k=>STAT_TXT[k]?STAT_TXT[k](n.eff[k]):k).join(', ');
 for(const n of SKT.nodes)if(n.big&&n.rk)n.d+='. RANKS II AND III: '+Object.keys(n.rk).map(k=>STAT_TXT[k](n.rk[k])).join(', ')+' EACH';
 // the old ranked nodes are single-rank now: ranks bought beyond the first come back as jade
 try{let g=0;for(const n of SKT.nodes){if(!n.old)continue;const lv=upLv(n.k);if(lv>1){for(let i=1;i<lv;i++)g+=n.base*(i+1);meta.up[n.k]=1;}}
  if(g){meta.sen+=g;saveMeta();setTimeout(()=>setToast('ONLY KEYSTONES HAVE RANKS NOW: '+g+' JADE REFUNDED','#ffd040',5),900);}}catch(e){}
 // nodes bought on the old layout that no longer exist are refunded
 try{const old=/^(st|ks|sd|sd2|br)_/;let g=0;for(const k in (meta.up||{})){if(SKT.byK[k]||TNODE[k]||!old.test(k))continue;const m=k.split('_'),i=+m[2]||0;
   g+=k.startsWith('ks_')?(i===5?300:650):k.startsWith('sd2_')?150:k.startsWith('sd_')?30+i*14:k.startsWith('br_')?60+i*16:22+i*14;delete meta.up[k];}
  if(g){meta.sen+=g;saveMeta();setTimeout(()=>setToast('THE SKILL TREE WAS REBUILT: '+g+' JADE REFUNDED','#ffd040',5),500);}}catch(e){}})();
const stLv=k=>k==='root'?1:upLv(k),stOpen=n=>n.free||SKT.adj[n.k].some(k=>stLv(k)>0),stCost=n=>n.old?n.base*(upLv(n.k)+1):n.big&&!n.free?Math.round(n.cost*(1+.6*upLv(n.k))):n.cost; // keystones are the only nodes with ranks; each rank costs more
function stBuy(n){
 const lv=stLv(n.k),cost=stCost(n);
 if(lv>=n.max||!stOpen(n)||meta.sen<cost){
  stUI.notice={key:n.k,t:time,text:lv>=n.max?'ALREADY LEARNED':!stOpen(n)?'FOLLOW A LINK FIRST':'SHORT '+(cost-meta.sen)+' JADE'};
  sfx('block');return;
 }
 meta.sen-=cost;meta.up[n.k]=lv+1;
 stUI.notice=null;
 SKT.unlock={key:n.k,t:time,cost};
 if(stGoal()===n){delete meta.templeGoal;SKT.unlock.goal=true;}
 saveMeta();
 sfx(n.big?'rare':n.mid?'heal':'pickup');
}
// totals of every owned node's effects (keystones count as 'ks:NAME')
let STOT=null,STOTkey='';
function stTot(){const key=JSON.stringify(meta.up);if(STOT&&key===STOTkey)return STOT;const t={};for(const n of SKT.nodes){if(!n.eff)continue;const lv=stLv(n.k);if(!lv)continue;for(const k in n.eff)t[k]=(t[k]||0)+n.eff[k]*lv;if(n.rk&&lv>1)for(const k in n.rk)t[k]=(t[k]||0)+n.rk[k]*(lv-1);}STOTkey=key;return STOT=t;}
const KS=nm=>!!stTot()['ks:'+nm];
function templeLootQuality(quality,maxQuality){
 if(quality>=maxQuality)return quality;
 const chance=TEMPLE_LUCK*(stTot().luck||0)+(KS('TREASURE HUNTER')?TEMPLE_KEYSTONE.treasure:0);
 return chance>0&&Math.random()<chance?quality+1:quality;
}

// ---------------------------------------------------------------- effects
{const _cs=calcStats;calcStats=function(){const s=_cs(),t=stTot();
  const K=TEMPLE_KEYSTONE;
  s.atk*=1+(t.pow||0);s.crit+=t.crit||0;s.aspd*=1+(t.aspd||0);s.cdr*=Math.max(.4,1-(t.cdr||0));s.spd*=1+(t.spd||0);s.dashCd*=Math.max(.4,1-(t.dash||0));s.rangeM+=t.range||0;s.maxhp=Math.round(s.maxhp*(1+(t.hp||0)));s.def+=t.def||0;s.dodge=(s.dodge||0)+(t.dodge||0);s.sen*=1+(t.gold||0);
  if(KS('COLOSSUS')){s.maxhp=Math.round(s.maxhp*(1+K.colossus));s.spd*=1-K.colossusSpeed;}
  if(KS('TIME WEAVER')){s.cdr*=1-COOLDOWN.timeWeaver;s.dashCd*=1+K.timeDash;}
  if(KS('GHOST STEP')){s.dodge+=K.ghostDodge;s.dashCd*=1-COOLDOWN.ghostStep;}
  if(KS('MIDAS'))s.sen*=1+K.midas;
  if(KS('EAGLE EYE')){s.rangeM+=K.eagleRange;s.crit+=K.eagleCrit;}
  s.grazeRefund=COOLDOWN.graze+COOLDOWN.grazeNode*(t.graze||0);
  if(KS('MOMENTUM')&&R&&R.time-STS.lastHit>2)s.spd*=1+K.momentumSpeed;return s;};}
const STS={lastHit:-9};
{const _he=hurtE;hurtE=function(e,dmg,pd,o){if(e&&P&&R&&!e.prop&&!e.dead){const t=stTot(),K=TEMPLE_KEYSTONE;
  if(e.boss||e.elite)dmg*=1+(t.boss||0);const close=Math.hypot(e.x-P.x,e.y-P.y)<60;if(close)dmg*=1+(t.near||0)+(KS('IAIDO MASTER')?K.iaido:0);
  const ability=castSrc&&castSrc!=='m';if(ability)dmg*=1+(t.abil||0)+(KS('OVERCHANNEL')?K.overchannel:0);else if(castSrc==='m'&&KS('OVERCHANNEL'))dmg*=1-K.overchannelBasic;
  if(KS('BERSERKER')&&P.hp<S.maxhp*.5)dmg*=1+K.berserker;
  if(KS('EXECUTIONER')&&e.hp<e.maxhp*.25)dmg*=1+K.executioner;
  if(KS('MOMENTUM')&&R.time-STS.lastHit>2)dmg*=1+K.momentumPower;
  if(KS('MARKED PREY')&&!e.stMarked){e.stMarked=1;dmg*=1+K.marked;}}return _he(e,dmg,pd,o);};}
{const _hp=hitPlayer;hitPlayer=function(raw,a,b,o){const r=_hp(raw,a,b,o);if(r==='hit'&&R){if(STS.lastHit!==R.time&&KS('MOMENTUM'))S=calcStats();STS.lastHit=R.time;}return r;};}
{const _g=graze;graze=function(q){_g(q);if(KS('GRAZE MASTER'))P.hp=Math.min(S.maxhp,P.hp+S.maxhp*TEMPLE_KEYSTONE.grazeHeal);};}
{const _ug=useGourd;useGourd=function(){
  const before=R.pots;_ug();
  if(R.pots<before){
   const bonus=(stTot().pot||0)+TEMPLE_LEGACY.belt*upLv('belt');
   P.hp=Math.min(S.maxhp,P.hp+S.maxhp*bonus);
  }
 };}
{const _td=tryDash;tryDash=function(){const was=P.dash>0;_td();if(!was&&P.dash>0&&KS('BLADE DANCE')){const r=32;
  fx.push({k:'slash',x:P.x,y:P.y,a:P.aim,arc:TAU,r,t:.2,dur:.2,col:'#e8eef6'});
  for(const e of enemies)if(!e.dead&&!e.air&&!e.prop&&Math.hypot(e.x-P.x,e.y-P.y)<r+e.r)hurtE(e,S.atk*.5,8,{slash:true});
  sfx('slash');}};}
{const _uw=updWorld;updWorld=function(dt){_uw(dt);if(!P||!R||mode!=='play')return;const t=stTot();if(t.regen)P.hp=Math.min(S.maxhp,P.hp+S.maxhp*t.regen*dt);
  // Echo Mind refunds a fraction when a new ability cooldown starts.
  if(KS('ECHO MIND')){
   const cds=P.echoCds??={};
   for(const k of ['q','f','e','rmb','h']){const v=P.ab[k]||0,pv=cds[k]||0;if(v>pv+.5&&Math.random()<COOLDOWN.echoChance){P.ab[k]=v*(1-COOLDOWN.echoRefund);txtFx(P.x,P.y-12,'ECHO','#c080ff');}cds[k]=P.ab[k];}
  }
  if(KS('MOMENTUM')&&R.time-STS.lastHit>2&&!STS.mom){STS.mom=1;S=calcStats();}else if(STS.mom&&R.time-STS.lastHit<=2){STS.mom=0;S=calcStats();}};}

// ---------------------------------------------------------------- the tree screen
const stView={x:6,y:36,w:210,h:118};
const stBuyBox={x:226,y:137,w:82,h:13};
const stMapZoom=.6,stDetailZoom=1.55;
const stUI={zoom:stDetailZoom,target:stDetailZoom,x:0,y:0,press:null,notice:null,catalog:false,routes:new Map()};
const stMotion=()=>!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const stIn=(x,y,r)=>x>=r.x&&x<r.x+r.w&&y>=r.y&&y<r.y+r.h;
const stScreen=(x,y)=>[Math.round(stView.x+(stView.w>>1)+(x-SKT.cam.x)*stUI.zoom),Math.round(stView.y+(stView.h>>1)+(y-SKT.cam.y)*stUI.zoom)];
// the layout follows the screen size: map on the left, details on the right, buttons along the bottom
let SDX=220,SDH=120;
function stLayout(){SDX=W-100;SDH=H-36-30;stView.x=6;stView.y=36;stView.w=SDX-12;stView.h=H-36-30;
 stBuyBox.x=SDX+6;stBuyBox.y=35+SDH-17;const by=H-23;stOverviewBox.y=stCatalogBox.y=stNextBox.y=by;stPinBox.x=SDX;stPinBox.y=by;}
const stRadius=n=>stUI.zoom<.65?n.big?3:n.mid?2:1:n.big?9:n.mid?6:n.old?5:3;
const stAffordable=n=>stLv(n.k)<n.max&&stOpen(n)&&meta.sen>=stCost(n);
const stActive=()=>mode==='select'&&selTab===1;
const stOverview=()=>stUI.target===stMapZoom;
const stTab=b=>({x:6+39*b,y:21,w:35,h:11});
const stOverviewBox={x:6,y:157,w:49,h:11},stCatalogBox={x:58,y:157,w:62,h:11};
const stNextBox={x:123,y:157,w:93,h:11},stPinBox={x:220,y:157,w:94,h:11};
const stKeystones=STB.map((_,b)=>SKT.nodes.filter(n=>n.b===b&&n.big));
const stGoal=()=>SKT.byK[meta.templeGoal];
const stCanPin=n=>n.big&&!n.free&&stLv(n.k)===0;
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
function stJump(n){stUI.catalog=false;stSelect(n);stZoom(false);}
function stCatalogToggle(){
 stUI.catalog=!stUI.catalog;
 const sel=SKT.byK[SKT.sel];
 if(!stUI.catalog){stJump(sel);return;}
 stSelect(sel.big&&!sel.free?sel:stGoal()||stKeystones[sel.b??0][0],false);
}
function stPin(n){
 if(!stCanPin(n)){sfx('block');return;}
 if(stGoal()===n)delete meta.templeGoal;
 else meta.templeGoal=n.k;
 saveMeta();
 sfx(stGoal()?'tool':'coin');
}
function stCatalogSlot(b,i){return {x:11+51*(b%4)+23*i,y:53+56*Math.floor(b/4),w:21,h:34};}
function stCatalogMove(dx,dy){
 const n=SKT.byK[SKT.sel],b=n.b??0,i=stKeystones[b].indexOf(n);
 const col=clamp((b%4)*2+Math.max(0,i)+dx,0,7),row=clamp(Math.floor(b/4)+dy,0,1);
 stSelect(stKeystones[row*4+Math.floor(col/2)][col%2],false);
}
function stBranch(b){
 const ns=SKT.nodes.filter(n=>n.b===b);
 stJump(ns.find(stAffordable)||ns.find(n=>n.big)||ns[0]);
}
function stNext(){
 const goal=stGoal();
 if(goal){
  const next=stRoute(goal).next;
  if(next)stJump(next);else stJump(goal);
  return;
 }
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
 if(stIn(x,y,stOverviewBox)){stUI.catalog=false;stZoom(!stOverview());return;}
 if(stIn(x,y,stCatalogBox)){stCatalogToggle();return;}
 if(stIn(x,y,stPinBox)){
  const n=SKT.byK[SKT.sel];
  if(stCanPin(n))stPin(n);else if(stGoal())stJump(stGoal());
  return;
 }
 if(stIn(x,y,stNextBox)){stNext();return;}
 const branch=STB.findIndex((_,b)=>stIn(x,y,stTab(b)));
 if(branch>=0){
  if(stUI.catalog)stSelect(stKeystones[branch][0],false);else stBranch(branch);
  return;
 }
 if(stUI.catalog){
  stKeystones.forEach((ns,b)=>ns.forEach((n,i)=>{if(stIn(x,y,stCatalogSlot(b,i)))stSelect(n,false);}));
  return;
 }
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
 if(!stActive()||stUI.catalog||!e.deltaY||stUI.press)return;
 e.preventDefault();setMouse(e);
 if(e.deltaY>0&&!stOverview())stZoom(true);
 else if(e.deltaY<0&&stOverview()){const n=stNodeAt(mouse.x,mouse.y);if(n)stSelect(n);stZoom(false);}
},{passive:false});

// Find the cheapest route in Jade. Break ties by the number of purchases.
function stRoute(n){
 if(stUI.routeVersion!==SKT.unlock){stUI.routes.clear();stUI.routeVersion=SKT.unlock;}
 if(stUI.routes.has(n.k))return stUI.routes.get(n.k);
 const costOf=k=>stLv(k)>0?0:stCost(SKT.byK[k]);
 const first={key:n.k,cost:costOf(n.k),steps:0,previous:null};
 const paths=new Map([[n.k,first]]),queue=[first],edges=new Map();
 const route={edges,cost:0,next:null};
 while(queue.length){
  queue.sort((a,b)=>b.cost-a.cost||b.steps-a.steps);
  const p=queue.pop();
  if(paths.get(p.key)!==p)continue;
  if(stLv(p.key)>0){
   for(let x=p;x.previous;x=x.previous)edges.set(x.previous.key,x.key);
   route.cost=p.cost;route.next=p.previous?SKT.byK[p.previous.key]:null;
   break;
  }
  for(const key of SKT.adj[p.key]){
   const cost=p.cost+costOf(key),steps=p.steps+1,old=paths.get(key);
   if(old&&(old.cost<cost||(old.cost===cost&&old.steps<=steps)))continue;
   const next={key,cost,steps,previous:p};
   paths.set(key,next);queue.push(next);
  }
 }
 stUI.routes.set(n.k,route);
 return route;
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
function stSeal(x,y,r,col,glow){
 const edge=glow?'#ffe7a4':shade(col,-.43);
 stGem(x,y,r,edge,shade(col,-.83));
 for(const side of [-1,1]){
  const tip=x+side*(r+5);
  stFill(Math.min(tip,x+side*(r+24)),y,20,1,shade(col,-.61));
  stGem(tip,y,2,edge,'#19121e');
  for(let i=0;i<3;i++)stFill(tip+side*(5+i*4),y-3+i%2*6,2,1,shade(col,-.45-i*.1));
 }
}
function stDrawNode(n,x,y,selected,hover,route,goal){
 const r=stRadius(n),owned=stLv(n.k)>0,ready=stAffordable(n),col=n.free?'#efe3b9':stRGB[n.b];
 const edge=owned?col:ready?'#e9c77c':route?'#a28e61':shade(col,-.67);
 const inner=owned?shade(col,-.73):ready?'#463326':'#1c1724';
 if(stUI.zoom<.65){
  stGem(x,y,r,edge,owned?col:inner);
  if(n.big)stFill(x,y,1,1,ready?'#fff1ae':owned?'#fff5d2':shade(col,-.26));
 }else if(n.big||n.mid||n.old){
  if(n.big){
   stGem(x,y,r+3,shade(edge,-.34),'#100b15');
   stGem(x,y,r+1,edge,inner);
   const corner=owned||ready?col:shade(col,-.53);
   for(const side of [-1,1]){
    stFill(x+side*(r+2),y-1,1,3,corner);
    stFill(x-1,y+side*(r+2),3,1,corner);
   }
  }else stPanel(x-r,y-r,2*r+1,2*r+1,inner,edge);
  const art=stArt(n,owned||ready);
  ctx.drawImage(art,x-(art.width>>1),y-(art.height>>1));
  if(n.old&&owned)stFill(x-r,y+r,Math.ceil((2*r+1)*stLv(n.k)/n.max),1,col);
 }else{
  stGem(x,y,r,edge,inner);
  if(owned||ready)stFill(x,y-1,1,2,owned?col:'#ffe6a0');
  if(selected||hover){
   stGem(x,y,5,edge,inner);
   const art=stArt(n,true);
   ctx.drawImage(art,x-3,y-3);
  }
 }
 if(goal){
  const d=r+3;
  stFill(x-1,y-d,3,1,'#ffe09e');stFill(x,y-d-1,1,3,'#ffe09e');
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
 if(age>=.8||!stMotion()||!meta.opt.flash)return;
 const [x,y]=stScreen(n.x,n.y),col=n.big?'#ffe69e':n.c;
 ctx.globalAlpha=1-age/.8;
 circ(x,y,stRadius(n)+2+age*(n.big?48:30),col);
 if(n.big)circ(x,y,stRadius(n)+1+age*31,n.c);
 for(let i=0;i<(n.big?16:8);i++){
  const a=i*2.4,r=stRadius(n)+3+age*(22+i%4*7);
  stFill(Math.round(x+Math.cos(a)*r),Math.round(y+Math.sin(a)*r),i%3===0?2:1,1,i%2?col:'#fff1c2');
 }
 ctx.globalAlpha=1;
}
function stDrawMap(sel,hover,route,plan){
 const goal=stGoal();
 const v=stView;
 stPanel(v.x-1,v.y-1,v.w+2,v.h+2,'#0f0b15','#4a3949');
 ctx.save();ctx.beginPath();ctx.rect(v.x,v.y,v.w,v.h);ctx.clip();
 ctx.drawImage(stMapPaper(),v.x,v.y);
 for(const n of SKT.nodes){
  const [x,y]=stScreen(n.x,n.y);
  if(x<v.x-24||x>v.x+v.w+24||y<v.y-24||y>v.y+v.h+24)continue;
  const col=n.free?'#28212c':shade(stRGB[n.b],stUI.zoom<.65?-.84:-.89);
  const halfW=Math.floor(STG.dx*stUI.zoom/2),halfH=Math.floor(STG.dy*stUI.zoom/2);
  stFill(x-halfW+1,y-halfH+1,halfW*2-1,halfH*2-1,col);
 }
 for(const n of SKT.nodes)for(const k of SKT.adj[n.k]){
  if(k<=n.k)continue;
  const m=SKT.byK[k],[x,y]=stScreen(n.x,n.y),[mx,my]=stScreen(m.x,m.y);
  if(Math.max(x,mx)<v.x||Math.min(x,mx)>=v.x+v.w||Math.max(y,my)<v.y||Math.min(y,my)>=v.y+v.h)continue;
  const linked=stLv(n.k)>0&&stLv(k)>0,onRoute=route.edges.get(k)===n.k||route.edges.get(n.k)===k;
  const planned=plan&&(plan.edges.get(k)===n.k||plan.edges.get(n.k)===k);
  const col=linked?(n.free?m.c:n.c):planned?'#e9c46f':onRoute?'#a4c6cb':stLv(n.k)||stLv(k)?'#856c75':'#413347';
  const thick=(linked||onRoute||planned)&&stUI.zoom>.65?2:1;
  stFill(Math.min(x,mx),Math.min(y,my),y===my?Math.abs(x-mx):thick,x===mx?Math.abs(y-my):thick,col);
  const unlock=SKT.unlock,age=unlock?time-unlock.t:1;
  if(linked&&age<.46&&stMotion()&&meta.opt.flash&&(unlock.key===k||unlock.key===n.k)){
   const f=clamp(age/.46,0,1),t=unlock.key===k?f:1-f;
   const dx=Math.round(x+(mx-x)*t),dy=Math.round(y+(my-y)*t);
   stFill(dx-1,dy-1,3,3,'#fff3b9');
  }
 }
 for(const n of SKT.nodes){
  const [x,y]=stScreen(n.x,n.y);
  if(x<v.x-16||x>=v.x+v.w+16||y<v.y-16||y>=v.y+v.h+16)continue;
  stDrawNode(n,x,y,n===sel,n===hover,route.edges.has(n.k)||!!plan?.edges.has(n.k),n===goal);
 }
 stBurst();
 ctx.restore();
}
// Ink flecks and wave lines stay behind the graph at both scales.
let stPaper=null;
function stMapPaper(){
 if(stPaper&&stPaper.width===stView.w&&stPaper.height===stView.h)return stPaper;
 return stPaper=mk(stView.w,stView.h,g=>{
  g.fillStyle='#100d17';g.fillRect(0,0,stView.w,stView.h);
  for(let y=0;y<stView.h;y++)for(let x=0;x<stView.w;x++){
   const h=hash(x+91,y-42),wave=(y+Math.round(3*Math.sin(x/16)))%16===0;
   if(h>.96||wave&&h>.52){g.fillStyle=h>.99?'#302535':'#1c1523';g.fillRect(x,y,1,1);}
  }
 });
}
function stDrawCatalog(sel){
 const v=stView;
 stPanel(v.x-1,v.y-1,v.w+2,v.h+2,'#100d17','#645045');
 ctx.drawImage(stMapPaper(),v.x,v.y);
 stKeystones.forEach((ns,b)=>{
  const col=stRGB[b],x=10+51*(b%4),y=40+56*Math.floor(b/4);
  stPanel(x-1,y,48,51,shade(col,-.88),shade(col,-.60));
  stCenter(STB[b].n,x,46,y+4,col);
  ns.forEach((n,i)=>{
   const box=stCatalogSlot(b,i),owned=stLv(n.k)>0,ready=stAffordable(n),pinned=n===stGoal();
   const outline=n===sel?'#f9dd9b':pinned?'#c8a55c':owned||ready?col:shade(col,-.64);
   stPanel(box.x,box.y,box.w,box.h,owned||n===sel?shade(col,-.76):'#19131f',outline);
   ctx.drawImage(stArt(n,true),box.x+5,box.y+5);
   stGem(box.x+10,box.y+24,owned?3:2,ready?'#ffe09f':outline,owned?col:'#151018');
   if(pinned)stFill(box.x+8,box.y+30,5,1,'#ffe09f');
  });
 });
}
function stDetails(n,route){
 const lv=stLv(n.k),ready=stAffordable(n),col=n.free?'#efe3b9':stRGB[n.b],full=lv>=n.max,open=stOpen(n);
 stPanel(SDX,35,94,SDH,'#17111e','#4a3949');
 stFill((SDX+1),36,92,1,col);
 const art=stArt(n,true),crest=n.big?13:10;
 const glow=SKT.unlock?.key===n.k&&time-SKT.unlock.t<.8;
 stFill((SDX+1),37,92,27,shade(col,-.89));
 stFill((SDX+1),63,92,1,shade(col,-.60));
 stSeal((SDX+47),50,crest,col,glow);
 const smooth=ctx.imageSmoothingEnabled;
 ctx.imageSmoothingEnabled=false;
 ctx.drawImage(art,(SDX+47)-art.width,50-art.height,art.width*2,art.height*2);
 ctx.imageSmoothingEnabled=smooth;
 const kind=n.free?'TEMPLE':n.big?'KEYSTONE':n.mid?'NOTABLE':'PASSIVE';
 stCenter(n.free?kind:STB[n.b].n+' / '+kind,(SDX+1),92,66,col);
 const y=stWrap(n.n,(SDX+6),76,82,'#fff0cf',7);
 stWrap(n.d,(SDX+6),y+3,82,'#dad0d9');
 const unlock=SKT.unlock,justBought=unlock&&unlock.key===n.k&&time-unlock.t<1.3;
 const notice=stUI.notice,denied=notice?.key===n.k&&time-notice.t<1.2;
 const status=denied?notice.text:justBought?(unlock.goal?'GOAL REACHED':'LEARNED  -'+unlock.cost):!open?route.edges.size+' TO LEARN / '+route.cost+' JADE':n.max>1&&lv?'RANK '+ROMAN[lv-1]+' / '+ROMAN[n.max-1]:full?'ACTIVE':ready?'READY TO UNLOCK':'NEED '+(stCost(n)-meta.sen)+' MORE';
 stCenter(status,(SDX+1),92,35+SDH-30,denied?'#ef9c97':justBought||ready?'#f3d795':'#bdadbd');
 stButton(stBuyBox,full?n.free?'STARTING POINT':'MASTERED':!open?'LOCKED':(lv?'RANK UP ':'UNLOCK ')+stCost(n),ready);
 const goal=stGoal();
 if(stCanPin(n))stButton(stPinBox,n===goal?'P / CLEAR GOAL':'P / PIN KEYSTONE');
 else if(goal)stButton(stPinBox,'VIEW PINNED GOAL');
 else if(n.old&&!full&&!ready&&open)stCenter('NEED '+(stCost(n)-meta.sen)+' MORE JADE',SDX,94,stPinBox.y+3,'#d5ba83');

}
renderUpgrades=function(){
 stLayout();
 const n=SKT.byK[SKT.sel];
 const motion=stMotion();
 SKT.cam.x+=(stUI.x-SKT.cam.x)*(motion?.22:1);SKT.cam.y+=(stUI.y-SKT.cam.y)*(motion?.22:1);
 stUI.zoom+=(stUI.target-stUI.zoom)*(motion?.28:1);
 const hover=stUI.catalog||stUI.press?.drag?null:stNodeAt(mouse.x,mouse.y);
 const route=stRoute(n),goal=stGoal(),plan=goal?stRoute(goal):null;
 stFill(0,0,W,H,'#0c0910');
 txt(stUI.catalog?'TEMPLE KEYSTONES':'TEMPLE SKILL TREE',6,5,'#f0d499',2);
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
 if(stUI.catalog)stDrawCatalog(n);else stDrawMap(n,hover,route,plan);
 stDetails(n,route);
 const unlock=SKT.unlock,learned=unlock&&SKT.byK[unlock.key];
 if(learned?.big&&time-unlock.t<1.7){
  const name=learned.n+' LEARNED',width=txtW(name)+14,x=stView.x+(stView.w>>1)-Math.floor(width/2),y=stView.y+stView.h-16;
  stPanel(x,y,width,11,'#251b23','#e6bf73');
  stCenter(name,x,width,y+3,'#ffebba');
 }
 stButton(stOverviewBox,!stUI.catalog&&stOverview()?'ZOOM IN':'OVERVIEW');
 stButton(stCatalogBox,stUI.catalog?'V / TREE':'V / KEYSTONES');
 const count=SKT.nodes.filter(stAffordable).length;
 stButton(stNextBox,goal?'N / NEXT ON ROUTE':count?'NEXT READY ('+count+')':'NONE AFFORDABLE',!!goal||count>0);
 let hint='DRAG PAN   ARROWS MOVE   ENTER BUY   ESC BACK';
 if(stIn(mouse.x,mouse.y,stNextBox)&&goal)hint=goal.n+' / '+plan.cost+' JADE LEFT';
 else if(stUI.catalog)hint='CHOOSE A KEYSTONE   P TO PIN   V TO RETURN';
 else if(hover&&hover!==n)hint=hover.n+' / CLICK TO INSPECT';
 else if(stOverview())hint='CLICK TO ZOOM IN   1-8 BRANCHES   HOME GATE';
 else if(stIn(mouse.x,mouse.y,stNextBox))hint='N / JUMP TO THE NEXT AFFORDABLE SKILL';
 else if(goal)hint='PINNED '+goal.n+' / '+plan.cost+' JADE LEFT';
 ctxt(hint,H-9,'#afa0b3');
};
function stMove(dx,dy){
 if(stUI.catalog){stCatalogMove(dx,dy);return;}
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
 if(c==='KeyZ'){stUI.catalog=false;stZoom(!stOverview());return;}
 if(c==='KeyV'){stCatalogToggle();return;}
 if(c==='KeyP'){stPin(SKT.byK[SKT.sel]);return;}
 if(c==='Home'){stJump(SKT.byK.root);return;}
 if(c==='KeyN'){stNext();return;}
 if(/^Digit[1-8]$/.test(c)){
  const b=Number(c.slice(-1))-1;
  if(stUI.catalog)stSelect(stKeystones[b][0],false);else stBranch(b);
  return;
 }
 if(c==='ArrowUp'||c==='KeyW')stMove(0,-1);
 else if(c==='ArrowDown'||c==='KeyS')stMove(0,1);
 else if(c==='ArrowLeft'||c==='KeyA')stMove(-1,0);
 else if(c==='ArrowRight'||c==='KeyD')stMove(1,0);
 else if(c==='Enter'||c==='Space')stBuy(SKT.byK[SKT.sel]);
 else if(c==='Escape'&&stUI.catalog){stCatalogToggle();}
 else if(c==='Escape'||c==='Tab'){stUI.press=null;stUI.catalog=false;if(treeFrom==='hub')mode='hub';selTab=0;sfx('coin');}
};

// the hub's summary: affordable nodes and progress per branch
function skillHubSummary(row){const avail=SKT.nodes.filter(n=>stOpen(n)&&stLv(n.k)<n.max&&meta.sen>=stCost(n)).length;
 row(2,117,'TEMPLE SKILL TREE',avail?avail+' NODE'+(avail>1?'S':'')+' AFFORDABLE':'ENTER TO VIEW',avail?'#ffd040':'#ddd');
 STB.forEach((B,b)=>{const x=20+b*36,ns=SKT.nodes.filter(n=>n.b===b),own=ns.filter(n=>stLv(n.k)>0).length;txt(B.n.slice(0,6),x,130,B.c);ctx.fillStyle='#2a2034';ctx.fillRect(x,139,30,3);ctx.fillStyle=B.c;ctx.fillRect(x,139,Math.round(30*own/ns.length),3);txt(own+'/'+ns.length,x,146,'#888');});
 const goal=stGoal();
 if(goal){txt('PINNED '+goal.n+' / '+stRoute(goal).cost+' JADE LEFT',20,156,'#e6c785');return;}
 const ks=SKT.nodes.filter(n=>n.big&&!n.free&&stLv(n.k)>0);
 txt(ks.length+' / '+stKeystones.flat().length+' KEYSTONES LEARNED',20,156,'#aaa');
}

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
const stStatArt={
 pow:['......w','.....ww','....ww.','.y.ww..','..yy...','..dy...','.dd.y..'],
 crit:['...w...','.aa.aa.','.a.r.a.','w.rwr.w','.a.r.a.','.aa.aa.','...w...'],
 boss:['.w...w.','.wa.aw.','..www..','.wrrrw.','wrdrdrw','.wrrrw.','..www..'],
 near:['w.....w','.w...w.','..w.w..','...r...','..w.w..','.w...w.','w.....w'],
 aspd:['..w...w','...w.w.','w...w..','.w.w...','..w....','.y.y...','o.o....'],
 def:['.wwwww.','waaWaad','waWWWad','waaWaad','.aaaad.','..aad..','...d...'],
 cdr:['.yyyyy.','..yby..','...y...','...w...','...y...','..yby..','.yyyyy.'],
 spd:['....aw.','...aww.','..aww..','waaw...','.aaww..','..aaaw.','.......'],
 dash:['....w..','...ww..','..ww...','.wwwww.','...ww..','..ww...','..w....'],
 abil:['...w...','..waw..','.waaaw.','waaWaaw','.waaaw.','..waw..','...w...'],
 range:['...w...','wwwwww.','...w.w.','...ww..','...w...','.......','w.w.w..'],
 hp:['.rr.rr.','rrrrrrr','rrwrrrr','rrrrrrr','.rrrrr.','..rrr..','...r...'],
 regen:['...a...','...a...','...a...','aaaaaaa','...a...','...a...','...a...'],
 dodge:['...w...','..www..','.wwwww.','w.w.w.w','www.www','.wwwww.','..w.w..'],
 graze:['.....a.','....awa','.....a.','.......','w......','.w.....','..www..'],
 gold:['..ooo..','.oylyo.','oyllyyo','oylyyyo','oyyyyyo','.oyyyo.','..ooo..'],
 pot:['..ooo..','..lwl..','...w...','..wyw..','.wryrw.','.wrrrw.','..www..'],
 luck:['..yy...','..yy...','yy..yy.','yyyyyy.','..yy...','..y.y..','....y..']
};
const stStampsCache={};
function stArt(n,lit){
 if(n.big)return ksIcon(n.n,n.c,lit);
 const stat=!n.mid&&n.eff?Object.keys(n.eff)[0]:null;
 const k=[n.b,stat,lit].join(':');
 if(stStampsCache[k])return stStampsCache[k];
 return stStampsCache[k]=mk(7,7,g=>{
  const pixels=stStatArt[stat]||stStamps[n.b];
  pixels.forEach((row,y)=>{
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
