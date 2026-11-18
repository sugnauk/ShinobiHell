'use strict';
// SHINOBIDUNGEONS - friendlier for new players, without taking anything away from the existing game:
//  1. APPRENTICE difficulty below Story: 40% damage taken, foes with 60% health, slower foe bullets, an extra revive.
//  2. TIPS: a short hint the first time something new happens (low health, a stunned foe, a guardian's warning, a bag,
//     an unused ability, a hit...). Each shows once; TIPS can be turned off in settings.
//  3. DANGER WARNINGS (settings): BOLD adds a pulsing ring around every foe winding up an attack, sized to its reach,
//     and makes ground dangers stand out.
//  5. The death screen teaches: what killed you, plus one tip about it.
//  6. SUGGESTIONS: a star marks a good pick for your hero on the reward cards and in the shop.
//  7. The main menu recommends Master Kaito's Trials until you have finished them once.

// ---------- 1. APPRENTICE ----------
DIFFS.unshift({n:'APPRENTICE',d:'40% DAMAGE, FOES HAVE 60% HP, SLOWER FOE BULLETS, +1 REVIVE',dmg:.4,hp:.6,bh:.55,bs:.8,rez:1,c:'#7fd0ff'});
if(!meta.opt.diffV){meta.opt.diff=(meta.opt.diff==null?1:meta.opt.diff)+1;meta.opt.diffV=2;saveMeta();} // keep everyone's old choice
{const _mp=mkProj;mkProj=function(from){const q=_mp.apply(this,arguments);const s=DF().bs;if(from==='e'&&s&&q){q.vx*=s;q.vy*=s;}return q;};}
{const _sr=startRun;startRun=function(){const r=_sr.apply(this,arguments);if(P&&DF().rez&&R&&!R.training)P.rez+=DF().rez;return r;};}

// ---------- 2. tips, once each ----------
meta.tips=meta.tips||{};
const TIP={cur:null,t:0,q:[]};
function tip(id,lines){if(OPT().tips===0||meta.tips[id]||!R||R.training)return;meta.tips[id]=1;saveMeta();TIP.q.push(lines);}
const KN=k=>keyName(KB[k]);
function drawTip(){if(!TIP.cur&&TIP.q.length){TIP.cur=TIP.q.shift();TIP.t=time;sfx('tool');}if(!TIP.cur)return;const k=time-TIP.t;if(k>6.5){TIP.cur=null;return;}
 const L=TIP.cur,w=Math.max(...L.map(l=>txtW(l)))+20,h=L.length*9+12,x=Math.round((W-w)/2),y=H-62-h+Math.round(Math.max(0,1-k/.25)*20);
 ctx.globalAlpha=Math.min(1,k/.2,(6.5-k)/.4);ctx.fillStyle='rgba(12,8,20,.92)';ctx.fillRect(x,y,w,h);ctx.fillStyle='#ffd040';ctx.fillRect(x,y,w,1);ctx.fillRect(x,y,2,h);
 txt('TIP',x+w-txtW('TIP')-4,y+3,'#ffd040');L.forEach((l,i)=>txt(l,x+8,y+6+i*9,i?'#ddd':'#fff'));ctx.globalAlpha=1;}
{const _rp=renderPlay;renderPlay=function(){_rp.apply(this,arguments);if(!paused)drawTip();};}
{let fightT=0,lastHp=null;const _u=update;update=function(dt){_u.apply(this,arguments);if(mode!=='play'||!P||!R||R.training||paused)return;
 if(P.hp<S.maxhp*.35&&R.pots>0)tip('pot',['LOW ON HEALTH!','PRESS '+KN('heal')+' TO DRINK A POTION']);
 if(lastHp!=null&&P.hp<lastHp-.5)tip('hit',['YOU WERE HIT','ONLY THE SMALL WHITE DOT AT YOUR CENTRE CAN BE HIT.','DASH ('+KN('dash')+') THROUGH BULLETS: YOU ARE UNTOUCHABLE MID-DASH']);lastHp=P.hp;
 const fighting=enemies.some(e=>!e.dead&&e.awake&&!e.prop&&Math.hypot(e.x-P.x,e.y-P.y)<160);
 if(fighting){fightT+=dt;if(fightT>14&&P.ab&&['q','f','e'].every(k=>(P.ab[k]||0)<=0))tip('abil',['YOUR ABILITIES ARE READY','Q, '+KN('w')+', '+KN('f')+' AND '+KN('e')+' HIT HARD. USE THEM WHENEVER THEY ARE READY']);}else fightT=0;
 if(boss&&boss.awake&&!boss.dead&&introT<=0)tip('boss',['A GUARDIAN!','A ! OVER IT MEANS AN ATTACK IS COMING. RED ON THE GROUND','MEANS DANGER. DASH OUT OF IT, OR THROUGH BULLETS']);
 if(enemies.some(e=>!e.dead&&e.elite&&e.awake&&Math.hypot(e.x-P.x,e.y-P.y)<140))tip('elite',['AN ELITE FOE','ITS NAME ABOVE IT SAYS WHAT EXTRA POWER IT HAS']);
 const b=nearBag();if(b&&b.items.length)tip('bag',['A LOOT BAG',KN('use')+' TAKES EVERYTHING. 1-6 TAKES ONE ITEM. '+KN('pack')+' OPENS YOUR PACK']);
 if(props.some(p=>p.k==='pedestal'&&!p.sold&&Math.hypot(p.x-P.x,p.y-P.y)<40))tip('shop',['THE TRADER','WALK UP TO AN ITEM AND PRESS '+KN('use')+' TO BUY IT.','GOLD LEFT AT THE END OF A RUN BECOMES JADE FOR THE SKILL TREE']);
 if(props.some(p=>p.k==='altar'&&p.god&&!p.used&&Math.hypot(p.x-P.x,p.y-P.y)<40))tip('shrine',['A SHRINE','PRESS '+KN('use')+' TO MAKE AN OFFERING: TRADE GOLD OR HEALTH FOR A BLESSING']);};}
{const _cb=checkBreak;checkBreak=function(e){const was=e&&e.stag>0;const r=_cb.apply(this,arguments);if(e&&!was&&e.stag>0)tip('stun',['STUNNED!','A FULL YELLOW BAR STUNS A FOE. STUNNED FOES TAKE +50% DAMAGE: HIT THEM NOW']);return r;};}
{const _ld=loadDungeon;loadDungeon=function(di){const r=_ld.apply(this,arguments);if(di===0)setTimeout(()=>tip('start',['THE MARCH BEGINS','CLEAR ROOMS, GRAB LOOT, AND FIND THE GUARDIAN (RED ON THE MINIMAP).','K OPENS THE GUIDE AT ANY TIME']),2500);return r;};}

// ---------- 3. bold danger warnings ----------
function drawBoldDanger(){if(!OPT().bold)return;const pulse=.5+.5*Math.sin(time*14);
 for(const e of enemies){if(e.dead||!e.act||e.act.ph!==0||e.prop)continue;const a=e.act,r=a.range||a.rad||(a.n==='charge'||a.n==='thrust'?a.dist||40:e.r+16);
  ctx.globalAlpha=.25+.35*pulse;wcirc(e.x,e.y,Math.min(160,r),'#ff3030');wcirc(e.x,e.y,Math.min(160,r)+1,'#ffb0a0');ctx.globalAlpha=1;
  if(a.n==='charge'||a.n==='thrust'){ctx.fillStyle='rgba(255,60,60,.6)';for(let d=8;d<(a.dist||80)+20;d+=4){const x=e.x+Math.cos(a.ang)*d,y=e.y+Math.sin(a.ang)*d;ctx.fillRect(sx(x,y)-1,sy(x,y),3,2);}}}
 for(const d of dh){ctx.globalAlpha=.3+.4*pulse;wcirc(d.x,d.y,d.r,'#ffffff');wcirc(d.x,d.y,d.r-1,d.col||'#f22');ctx.globalAlpha=1;}}
{const _dp=drawPortal;drawPortal=function(){drawBoldDanger();return _dp.apply(this,arguments);};}

// ---------- 5. the death screen teaches ----------
const DEATHTIPS={
 'AKAGANE':'AKAGANE SHOUTS EVERY ORDER. WHEN HE LOWERS HIS HORNS TO CHARGE, DASH SIDEWAYS',
 'KUSAKARI':'KUSAKARI HIDES IN THE REEDS. STAY OUT OF THE TALL GRASS AND WATCH FOR THE GLINT',
 'ITOHIME':'ITOHIME\'S WIRES CUT IN STRAIGHT LINES. STEP BETWEEN THEM, NEVER ALONG THEM',
 'HOTARU':'SNUFF LADY HOTARU\'S CHARM-LANTERNS TO DROP HER BARRIER',
 'RONIN':'THE RONIN SEVEN FIGHT A FEW AT A TIME. KEEP MOVING SO THEY CANNOT SURROUND YOU',
 'TETSUO':'TETSUO\'S GUNS NEED TO RELOAD. ATTACK IN THE PAUSE AFTER A VOLLEY',
 'ABBOT':'SILENCE THE ABBOT\'S BELLS. THEIR RINGS OF SOUND HAVE GAPS: STAND IN THEM',
 'ONIKUMA':'ONIKUMA\'S CHAINS SWING WIDE. GET CLOSE WHILE HE WINDS UP, NOT FAR',
 'KAGE':'KAGE VANISHES IN THE DARK. KEEP THE TORCHES LIT TO SEE HIM',
 'TAMAMO':'TAMAMO CASTS ILLUSIONS. THE REAL ONE CASTS A SHADOW',
 'KUROGANE':'LORD KUROGANE\'S STANDARD-BEARERS HALVE HIS DAMAGE TAKEN. CUT THEM DOWN FIRST',
 'EMPEROR':'THE EMPEROR IS UNTOUCHABLE WHILE HIS GUARDS STAND. FELL THEM FIRST',
 'PROJECTILE':'ONLY THE WHITE DOT AT YOUR CENTRE CAN BE HIT. DASH THROUGH BULLETS: YOU ARE UNTOUCHABLE MID-DASH',
 'HAZARD':'RED CIRCLES ON THE GROUND EXPLODE A MOMENT LATER. STEP OUT BEFORE THEY FILL',
 'ATTACK':'A ! ABOVE A FOE MEANS IT IS ABOUT TO STRIKE. DASH AWAY OR BEHIND IT'};
function deathTip(cause){const c=(cause||'').toUpperCase();for(const k in DEATHTIPS)if(c.includes(k))return DEATHTIPS[k];
 if(c.includes('TRAP'))return 'SPIKE TRAPS FLASH BEFORE THEY RISE. WAIT FOR THEM TO DROP, THEN CROSS';return 'DRINK POTIONS EARLY ('+KN('heal')+'), AND USE YOUR ABILITIES OFTEN. TRY APPRENTICE DIFFICULTY IN SETTINGS IF YOU NEED IT';}
{const _re=renderEnd;renderEnd=function(){_re.apply(this,arguments);const d=deadInfo;if(!d||d.win)return;
 const t=deathTip(d.cause),L=wrapTxt('TIP: '+t,Math.floor((W-40)/4.6));const y=H-56-4-24-L.length*8;ctx.fillStyle='rgba(30,14,10,.92)';ctx.fillRect(14,y-2,W-28,L.length*8+4);ctx.fillStyle='#ffd040';ctx.fillRect(14,y-2,W-28,1);
 L.forEach((l,i)=>ctxt(l,y+i*8,'#ffd890'));};}

// ---------- 6. suggestions: a star on a good pick for your hero ----------
const NP_MELEE=new Set(['samurai','shinobi','lancer']);
function relicScore(it){const st=fxStyle(it.id),k=CLS().k,melee=NP_MELEE.has(k);let s=(it.r||0)*2;
 const pref=melee?{guard:3,heal:3,dmg:2,speed:1}:{dmg:3,speed:2,heal:1,guard:1};s+=pref[st]||1;if(P&&P.hp<S.maxhp*.5&&st==='heal')s+=3;if(R&&R.inv&&R.inv[it.id])s+=1;return s;}
const suggOn=()=>OPT().sugg!==0&&R&&!R.training;
{const _rc=renderChoose;renderChoose=function(){_rc.apply(this,arguments);if(!suggOn()||!chooseOpts||!chooseOpts.length)return;
 let best=0;chooseOpts.forEach((it,i)=>{if(relicScore(it)>relicScore(chooseOpts[best]))best=i;});
 const cw=92,gap=8,x0=Math.round((W-(3*cw+2*gap))/2),x=x0+best*(cw+gap),y=44,pul=Math.floor(time*3)%2;
 txt('* SUGGESTED',x+cw/2-Math.round(txtW('* SUGGESTED')/2),y+94,pul?'#ffd040':'#fff');ctx.fillStyle='#ffd040';ctx.fillRect(x-2,y-2,cw+4,1);ctx.fillRect(x-2,y+93,cw+4,1);};}
// in the shop: the best relic you can afford gets a star over its stand
{const _dpr=drawProp;drawProp=function(p){_dpr.apply(this,arguments);if(!suggOn()||p.k!=='pedestal'||!p.relicStand||p.sold||!p.item)return;
 const stands=props.filter(q=>q.room===p.room&&q.relicStand&&!q.sold&&q.item&&R.sen>=q.price);if(!stands.length||!stands.includes(p))return;
 const best=stands.reduce((a,b)=>relicScore(ITEMBY[b.item]||{id:b.item,r:0})>relicScore(ITEMBY[a.item]||{id:a.item,r:0})?b:a);if(best!==p)return;
 const X=sx(p.x,p.y),Y=sy(p.x,p.y)-40+Math.round(Math.sin(time*4)*2);txt('*',X-2,Y,Math.floor(time*3)%2?'#ffd040':'#fff',2);};}

// ---------- 7. the main menu recommends the trials until they are done ----------
{const _mi=mmItems;mmItems=function(){const L=_mi.apply(this,arguments);if(!meta.trialsReward){const t=L.find(x=>x.k==='train');if(t)t.r='* NEW';}return L;};}
{let did=false;const _rm=renderMenu;renderMenu=function(){if(!did){did=true;if(!meta.trialsReward&&!(meta.runs>0)){const L=mmItems();const i=L.findIndex(x=>x.k==='train');if(i>=0)mmSel=i;}}return _rm.apply(this,arguments);};}
