'use strict';
// HELL OF THE EMPEROR - loot bags, gear, power systems (part of the former game.js; files load in numeric order, see index.html)
// ---------- loot bags, potions & gear ----------
// the six stats: a hero's base stats (balance) plus bonuses from relics, enchants and rings (see 177-stats.js).
// The old stat potions (elixirs) are gone.
const STATS=[{k:'att',n:'ATTACK',c:'#f55',d:'+1 SPELL POWER'},{k:'def',n:'DEFENSE',c:'#ccc',d:'-1 DAMAGE TAKEN'},{k:'spd',n:'SPEED',c:'#6cf',d:'+1% MOVE SPEED'},
 {k:'dex',n:'DEXTERITY',c:'#f9c',d:'+2% CAST SPEED'},{k:'vit',n:'VITALITY',c:'#f84',d:'+5 MAX HP'},{k:'wis',n:'WISDOM',c:'#a8f',d:'-1% COOLDOWNS'}],STATMAX=20;
// 15 material tiers per slot; quality (common..legendary) multiplies the base stats and adds affixes
const GEARN={wpn:['BAMBOO','WILLOW','OAK','CEDAR','IRON','STEEL','SPIRIT','JADE','CORAL','MOON','STORM','PHOENIX','DRAGON','DIVINE','HEAVEN'],
 arm:['LINEN','HEMP','COTTON','SILK','PRIEST','MONK','ONMYO','SPIRIT','JADE','MOON','STORM','PHOENIX','DRAGON','DIVINE','CELESTIAL'],
 ring:['COPPER','TIN','BRONZE','SILVER','GOLD','JADE','PEARL','CORAL','OPAL','MOON','STORM','PHOENIX','DRAGON','DIVINE','HEAVEN']},TMAX=14;
const QUAL=[{n:'COMMON',c:'#c8c8c8',m:1},{n:'UNCOMMON',c:'#5fd35f',m:1.15},{n:'RARE',c:'#4aa0ff',m:1.3},{n:'EPIC',c:'#c060ff',m:1.5},{n:'LEGENDARY',c:'#ffb020',m:1.7}];
const AFX=[{k:'crit',d:'+8% CRIT'},{k:'aspd',d:'+12% CAST SPEED'},{k:'emb',d:'-10% COOLDOWNS'},{k:'vamp',d:'LIFESTEAL 2%'},{k:'qpow',d:'+30% Q POWER'},{k:'epow',d:'+25% R POWER'},{k:'iron',d:'-8% DAMAGE TAKEN'},{k:'ghost',d:'+6% DODGE'},{k:'magnet',d:'+15% GOLD'},{k:'shadow',d:'FASTER DASH'}];
// enchants are run-wide boosts for the abilities (RMB Q E F R) - never the LMB, which comes from your weapon
// ===== HOW THE POWER SYSTEMS DIFFER =====
// WEAPON   decides HOW your LMB attacks (its shape).          GEAR (armour/ring) = plain numbers.
// ENCHANT  an on-hit EFFECT on every ability (RMB Q E F R), chance-based, max 3 at once.
// SCROLL   rewrites ONE ability: replace it, or a guaranteed add-on just for that slot.
// RELIC    a run-wide RULE that touches everything you do.
// ===== EFFECT STYLES: one colour per kind of effect, everywhere it appears =====
// DAMAGE red, HEAL green, FIRE orange, FROST ice, STORM yellow, POISON lime, SPEED cyan, GUARD steel, CONTROL purple, WEALTH gold.
// Strength is a roman numeral: I = a chance / small, up to IV = guaranteed / huge.
const FXCOL={dmg:'#ff5050',heal:'#50e060',fire:'#ff8a30',frost:'#80d0ff',storm:'#ffe040',poison:'#a0ff40',speed:'#40e0e0',guard:'#b0b8d0',control:'#c080ff',wealth:'#ffd040'};
const FXNAME={dmg:'DAMAGE',heal:'HEAL',fire:'FIRE',frost:'FROST',storm:'STORM',poison:'POISON',speed:'SPEED',guard:'GUARD',control:'CONTROL',wealth:'WEALTH'};
const ROM=['I','II','III','IV','V'];
const FXK={fire:'fire',burn:'fire',frost:'frost',chill:'frost',shock:'storm',storm:'storm',poison:'poison',
 crit:'dmg',atk:'dmg',pierce:'dmg',blast:'dmg',qpow:'dmg',epow:'dmg',glass:'dmg',flare:'dmg',wave:'dmg',range:'dmg',emp:'dmg',dblow:'dmg',echo:'dmg',
 vamp:'heal',leech:'heal',blood:'heal',gourd:'heal',rez:'heal',phoenix:'heal',hunger:'heal',hp:'heal',
 aspd:'speed',cd:'speed',emb:'speed',spd:'speed',shadow:'speed',ecd:'speed',mikiri:'speed',
 iron:'guard',ghost:'guard',pos:'guard',parry:'guard',thorn:'guard',def:'guard',gale:'control',magnet:'wealth'};
const fxStyle=k=>FXK[k]||'dmg',fxCol=k=>FXCOL[fxStyle(k)];
const ENCH=[{k:'fire',n:'FLAME',d:'ABILITY HITS MAY BURN'},{k:'frost',n:'FROST',d:'ABILITY HITS MAY CHILL'},{k:'shock',n:'STORM',d:'ABILITY HITS MAY SHOCK + ARC'},
 {k:'poison',n:'VENOM',d:'ABILITY HITS POISON'},{k:'blast',n:'BLAST',d:'ABILITY HITS SPLASH 30% AROUND'},{k:'leech',n:'LEECH',d:'ABILITY HITS HEAL 2% OF DAMAGE'},
 {k:'gale',n:'GALE',d:'ABILITY HITS SHOVE + 50% STUN'}];
ENCH.forEach(e=>{e.c=fxCol(e.k);e.tier=1;});
const ENCHMAX=5; // total enchant stacks you can hold (duplicates stack)
let castSrc=null; // which slot the damage currently being dealt came from ('m' = LMB)
const enchN=k=>R&&R.ench?R.ench.filter(x=>x===k).length:0;
// everything extra an ability slot does: enchant chances (all abilities) + guaranteed scroll add-ons (that slot only)
function abFx(k){const a=(R&&R.addon&&R.addon[k])||{};
 return {burn:.35*enchN('fire')+(a.burn?1:0),chill:.3*enchN('frost')+(a.chill?1:0),shock:.2*enchN('shock')+(a.shock?1:0),poison:enchN('poison')||a.poison?1:0,
  blast:enchN('blast'),leech:enchN('leech'),gale:enchN('gale'),crit:.25*(a.crit||0)+(a.edge?.08:0),pierce:2*(a.pierce||0),cd:a.cd?1:0};}
// rarity is gated by depth: epics from dungeon III, legendaries (named) only in gold bags
function rollQ(di,bias){const w=[Math.max(12,60-6*di),28,8+2.5*di,2+2*di];let r=Math.random()*w.reduce((a,b)=>a+b,0),q=0;for(;q<3;q++){if((r-=w[q])<0)break;}q=clamp(q+(bias||0),0,3);if(di<2)q=Math.min(q,2);if(di<1&&!bias)q=Math.min(q,1);return q;}
const tierFor=(di,b)=>clamp(Math.floor(di*1.35)+ri(0,1)+(b||0),0,TMAX);
function gearVals(g){const t=g.tier,m=QUAL[g.q||0].m;return g.slot==='wpn'?{atk:Math.round((2+t*.9)*m)}:g.slot==='arm'?{hp:Math.round((6+t*4)*m),def:Math.round((1+t*.4)*m)}:{sv:Math.round((2+t*.5)*m)};}
function gearLines(g){const v=gearVals(g),L=['T'+(g.tier+1)+' '+QUAL[g.q||0].n+' '+(g.slot==='wpn'?wtName(g):SLOTNAME[g.slot])];
 if(g.slot==='wpn'){const v=wpnLMB(g),sp=SPELLS.m[v];L.push('LMB: '+sp.n+(g.rare&&v!==3?' (EMPOWERED)':'')+(isSig(g)?' SIGNATURE +25%':''));}
 if(v.atk)L.push('+'+v.atk+' POWER');if(v.hp)L.push('+'+v.hp+' HP  +'+v.def+' DEF');if(v.sv)L.push('+'+v.sv+' '+STATS.find(s=>s.k===g.stat).n);
 if(g.rd)L.push(g.rd);for(const a of g.aff||[])L.push(AFX.find(x=>x.k===a).d);for(const e of g.ench||[]){const E=ENCH.find(x=>x.k===e);L.push('ENCH '+E.n+': '+E.d);}
 const st=setOf(g);if(st)L.push(st+' SET PIECE');return L;}
const RARE=[
 {slot:'wpn',wt:'STAFF',n:'PLAGUE LOTUS STAFF',fx:{fire:1,poison:1},d:'EVERY ATTACK BURNS AND POISONS'},{slot:'wpn',wt:'CENSER',n:'MOONLIT WAND',fx:{aspd:3},d:'+36% CAST SPEED'},
 {slot:'wpn',wt:'STAFF',n:'KESTREL ROD',fx:{crit:3},d:'+24% CRIT CHANCE'},{slot:'wpn',wt:'STAFF',n:'VOIDGLASS STAFF',fx:{flare:1,glass:1},d:'CRITS EXPLODE. +40% POWER, -25% HP'},
 {slot:'wpn',wt:'KATANA',n:'CRIMSON MOON KATANA',fx:{crit:2,vamp:1},d:'+16% CRIT. HITS HEAL 2%'},{slot:'wpn',wt:'NAGINATA',n:'THUNDERCLAP NAGINATA',fx:{shock:1,storm:1},d:'HITS SHOCK. +DMG VS SHOCKED'},
 {slot:'arm',n:'SHINOBI GARB',fx:{shadow:2,ghost:2},d:'FASTER DASH, 12% DODGE'},{slot:'arm',n:'CRANE CASTLE ARMOUR',fx:{iron:3},d:'-22% DAMAGE TAKEN'},
 {slot:'arm',n:'HIGH PRIEST VESTMENT',fx:{emb:2},d:'-19% COOLDOWNS'},{slot:'arm',n:'BLOOD ROBE',fx:{vamp:2},d:'SPELLS HEAL 4% OF DAMAGE'},
 {slot:'ring',n:'RING OF ECHOES',fx:{echo:1},d:'SPELLS MAY CAST TWICE'},{slot:'ring',n:'FROSTBOUND BAND',fx:{frost:1,pierce:1},d:'SPELLS CHILL AND PIERCE'},
 {slot:'ring',n:'STORM SIGNET',fx:{shock:1,storm:1},d:'SPELLS SHOCK. ARC LIGHTNING'},{slot:'ring',n:'RING OF GREED',fx:{magnet:3,blood:1},d:'+GOLD, HEAL ON KILL'},
];
const SLOTNAME={wpn:'STAFF',arm:'ROBE',ring:'RING'},GEARG={wpn:'/',arm:'V',ring:'O'};
function mkGear(slot,tier,rare,q){
 tier=clamp(tier,0,TMAX);const g={t:'gear',slot,tier,rare:!!rare,q:rare?4:(q==null?rollQ(R?R.di:0,0):q),aff:[],ench:[]};
 if(rare){const opts=RARE.filter(x=>!slot||x.slot===slot),r=pick(opts);Object.assign(g,{slot:r.slot,name:r.n,fx:r.fx,rd:r.d});g.tier=Math.min(TMAX,tier+1);}
 if(g.slot==='wpn')g.wt=rare&&RARE.find(x=>x.n===g.name).wt||rollWT(); // weapon type: decides the LMB attack
 if(!rare)g.name=(g.q>=2?QUAL[g.q].n+' ':'')+GEARN[slot][g.tier]+' '+(g.slot==='wpn'?wtName(g):SLOTNAME[slot]);
 if(g.slot==='ring')g.stat=pick(STATS).k;
 const na=g.rare?1:g.q;const pool=AFX.map(a=>a.k);for(let i=0;i<na&&pool.length;i++)g.aff.push(pool.splice(ri(0,pool.length-1),1)[0]);
 return g;
}
function gearDesc(g){return gearLines(g).join('. ');}
// ---- item icons: every slot x tier x quality gets its own little sprite; legendaries are hand-styled ----
const MATC=['#c8b060','#a89060','#8a6a40','#a0603a','#8a8a96','#c0c8d4','#80c0ff','#40c080','#ff8a80','#d8e0ff','#80a0ff','#ff8040','#e04030','#fff0a0','#ffffff'];
const LEGLOOK={'CRIMSON MOON KATANA':['#c0c8d4','#d02838',2],'THUNDERCLAP NAGINATA':['#8a8a96','#ff6',2],'PLAGUE LOTUS STAFF':['#5a8a3a','#c03010',4],'MOONLIT WAND':['#d8e0ff','#8cf',1],'KESTREL ROD':['#c0c8d4','#fff',2],'VOIDGLASS STAFF':['#2a2230','#ff2040',4],
 'SHINOBI GARB':['#2a2a3a','#c8f'],'CRANE CASTLE ARMOUR':['#8a6a40','#e0b040'],'HIGH PRIEST VESTMENT':['#e8e0c0','#d02030'],'BLOOD ROBE':['#8a1020','#ff4050'],
 'RING OF ECHOES':['#c0c8d4','#8cf'],'FROSTBOUND BAND':['#a8d0f0','#fff'],'STORM SIGNET':['#e0b040','#ff6'],'RING OF GREED':['#e0b040','#40c080']};
const ICONC={};
function itemIcon(it){const key=it.t==='gear'?it.slot+it.tier+'_'+(it.q||0)+(it.rare?it.name:'')+(it.slot==='wpn'?wtName(it):''):it.t+(it.s||it.k||(it.regular?'regular':''));if(ICONC[key])return ICONC[key];
 const fr=mk(12,12,g=>{const R=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h);};
  if(it.t==='gear'){const L=it.rare?LEGLOOK[it.name]:null,q=it.rare?4:(it.q||0),m=L?L[0]:MATC[it.tier],gem=L?L[1]:QUAL[q].c;
   // palette for the pixel maps: m material (tier), M its shadow, g quality accent, w glint, s/S steel, h grip, y gold, r red, p paper
   const PC={m,M:shade(m,-.35),g:gem,w:'#ffffff',s:'#d8e0ea',S:'#8a92a0',h:'#3a2a2a',y:q>=4?'#ffd040':'#c8a040',r:'#d02838',p:'#f0e8d0'};
   const map=rows=>rows.forEach((row,y)=>{for(let x=0;x<row.length;x++){const c=PC[row[x]];if(c)R(x,y,1,1,c);}});
   if(it.slot==='wpn'){map(WICON[wtName(it)]||WICON.STAFF);
    if(q>=2){R(0,11,1,1,gem);} // rare+: accent wrap on the pommel
   }
   else if(it.slot==='arm'){R(3,1,6,2,m);R(2,3,8,8,m);R(1,4,2,4,m);R(9,4,2,4,m);R(5,1,2,4,shade(m,-.35));R(2,10,8,1,gem);R(4,6,4,1,gem);R(3,3,1,7,shade(m,.25));
    if(q>=3){R(1,3,2,2,gem);R(9,3,2,2,gem);R(5,4,2,1,gem);} // epic: shoulder guards and a sash knot
    if(q>=4){R(2,10,8,1,'#ffd040');R(5,5,2,2,'#fff');R(5,6,2,1,'#ffd040');}}
   else{for(const [x,y] of [[3,4],[4,3],[5,3],[6,3],[7,3],[8,4],[9,5],[9,6],[8,8],[7,9],[6,9],[5,9],[4,9],[3,8],[2,6],[2,5],[3,7],[9,7]])R(x,y+1,1,1,m);
    if(q>=3){R(3,0,6,3,gem);R(4,0,2,1,'#fff');R(2,1,1,1,PC.y);R(9,1,1,1,PC.y);}else{R(4,0,4,3,gem);R(5,0,1,1,'#fff');}}
   // epic: violet aura; legendary: golden aura with star glints
   if(q>=3){const d=g.getImageData(0,0,12,12).data,glow=q>=4?'rgba(255,200,60,.55)':'rgba(180,90,255,.5)';g.fillStyle=glow;
    for(let y=0;y<12;y++)for(let x=0;x<12;x++){if(d[(y*12+x)*4+3])continue;let n=false;for(const [ax,ay] of [[1,0],[-1,0],[0,1],[0,-1]]){const X=x+ax,Y=y+ay;if(X>=0&&Y>=0&&X<12&&Y<12&&d[(Y*12+X)*4+3]>200){n=true;break;}}if(n)g.fillRect(x,y,1,1);}
    if(q>=4){R(0,0,1,1,'#fff6c0');R(11,6,1,1,'#fff6c0');R(1,1,1,1,'#ffd040');}}}
  else if(it.t==='hp'||it.t==='stat'){const c=it.t==='hp'?'#e33':STATS.find(s=>s.k===it.s).c;R(5,0,2,2,'#c8a070');R(4,2,4,1,'#ddd');R(3,3,6,8,'#ddd');R(4,5,4,5,c);R(4,5,1,2,'#fff');}
  else if(it.t==='scroll'){R(2,2,8,8,'#f0e0b0');const ribbon=it.regular?'#579a9f':'#c89a50',ink=it.regular?'#34656d':'#d02030';R(1,1,10,2,ribbon);R(1,9,10,2,ribbon);R(4,4,4,1,ink);R(4,6,3,1,ink);R(5,7,2,1,it.regular?'#8bced7':'#ffe060');}
  else if(it.t==='ench'){const c=ENCH.find(x=>x.k===it.k).c;R(5,0,2,12,c);R(0,5,12,2,c);R(3,3,6,6,c);R(4,4,4,4,'#14101a');R(5,5,2,2,'#fff');}
  else if(it.t==='relic'){R(3,2,6,8,'#e0b040');R(4,3,4,6,'#fff0a0');R(5,0,2,2,'#e0b040');}});
 return ICONC[key]=outlined(fr);}
function drawItemIcon(it,x,y,frame){const q=it&&it.t==='gear'?(it.rare?4:(it.q||0)):0;
 if(frame!==false){let c=it&&it.t==='gear'?QUAL[q].c:it?itemCol(it):'#333';if(q>=3&&Math.floor(time*3)%2)c=shade(c,.35);
  ctx.fillStyle='#14101a';ctx.fillRect(x-1,y-1,16,16);ctx.fillStyle=c;ctx.fillRect(x-1,y-1,16,1);ctx.fillRect(x-1,y+14,16,1);ctx.fillRect(x-1,y-1,1,16);ctx.fillRect(x+14,y-1,1,16);
  ctx.fillStyle=q>=4?'#2a2010':q>=3?'#221630':'#1e1828';ctx.fillRect(x,y,14,14);
  // legendary: a sparkle runs around the frame
  if(q>=4){const k=Math.floor(time*20)%60,side=Math.floor(k/15),o=k%15,P2=[[x-1+o,y-1],[x+14,y-1+o],[x+14-o,y+14],[x-1,y+14-o]][side];ctx.fillStyle='#fff';ctx.fillRect(P2[0],P2[1],1,1);}}
 if(it)ctx.drawImage(itemIcon(it),x+1,y+1);}
// 12x12 weapon icons per type (see the palette in itemIcon)
const WICON={
 STAFF:['........ggg.','.......gwgg.','.......gggm.','......mM....','.....m......','....mM......','...m........','..mM........','.m..........','m...........','............','............'],
 'SHADOW KATANA':['..........Ss','.........Ss.','........Ss..','.......Ss...','......Ss....','.....Ss.....','....gs......','...ygg......','...h........','..gh........','.h..........','h...........'],
 'HAND WRAPS':['............','...pppppp...','..pppppppp..','..pprrrppp..','..pppppppp..','..pprrrppp..','...pppppp...','...rppppr...','...prrrpp...','...pppppp...','............','............'],
 'PUPPET ROD':['....wwwww...','....g...g...','....g...g...','.....m..g...','.....m......','.....M......','.....m......','.....m......','.....M......','.....m......','............','............'],
 'GALE FAN':['............','..sSsss.....','.sgggggss...','sggggggggs..','.gggggggs...','..gggggs....','...gggs.....','....gs......','....y.......','....h.......','....h.......','............'],
 'RITUAL FANS':['............','..rr...rr...','.rrrr.rrrr..','rrgrrrrrgrr.','.rrr..rrr...','..r....r....','..y....y....','..h....h....','..h....h....','............','............','............'],
 'RITUAL BRUSH':['..........rr','.........rpr','........rp..','.......mr...','......m.....','.....m......','....m.......','...m........','..m.........','.m..........','g...........','............'],
 'TEMPLE BELL':['............','.....hh.....','.....hg.....','....yyy.....','...yyyyy....','...yywyy....','...yywyy....','..ySSSSyy...','..ggggggg...','.....y......','.....y......','............'],
 'WAR FAN':['............','.mgmgmgmgm..','mgmgmgmgmgm.','gmgmgmgmgmg.','.mgmgmgmgm..','..mgmgmgm...','...mgmgm....','....mgm.....','.....y......','.....h......','.....h......','............'],
 CENSER:['.....S......','.....S..w...','.....S.w....','....yyy.w...','...ymmmy....','...mgggm....','...mmmmm....','....MMM.....','.....M......','............','............','............'],
 KATANA:['...........w','..........ws','.........ws.','........ws..','.......ws...','......ws....','....yys.....','....yy......','...hg.......','..hh........','.hg.........','h...........'],
 NAGINATA:['..........ss','.........sw.','........sw..','.......yg...','......m.....','.....m......','....m.......','...m........','..M.........','.m..........','M...........','............'],
 ODACHI:['..........ws','.........wsS','........wsS.','.......wsS..','......wsS...','.....wsS....','...yywS.....','...yy.......','..hg........','.hh.........','hg..........','............'],
 YUMI:['....mm......','...m..w.....','..m...w.....','..m...w.....','.m....w.....','.g....w.....','.g....w.....','.m....w.....','..m...w.....','..m...w.....','...m..w.....','....mm......'],
 HANKYU:['............','...mm.......','..m..w......','.m...w......','.m...w......','.g...w......','ysssssssssw.','.m...w......','.m...w......','..m..w......','...mm.......','............'],
 REPEATER:['............','mm........mm','..mm....mm..','....mmmm....','.....hh.....','.....hg.....','.....hh.....','.....hh.....','....hhhh....','.....hh.....','............','............'],
 KUNAI:['...........w','..........ws','.........wsS','........wsS.','.......SsS..','......yS....','.....hy.....','....hh......','...gh.......','..g.g.......','...g........','............'],
 SHURIKEN:['.....w......','.....s......','....sSs.....','....sSs.....','.sssSgSsss..','wsSSg.gSSsw.','.sssSgSsss..','....sSs.....','....sSs.....','.....s......','.....w......','............'],
 KUSARIGAMA:['....sssw....','...s....w...','...s........','...yh.......','....h.......','....h.......','....hg......','.....S.S.S..','......S.S.S.','............','............','............'],
 OFUDA:['...pppppp...','...pprrpp...','...pprrpp...','...pppppp...','...prrrrp...','...pprppp...','...pprrrp...','...pppppp...','...pgggpp...','...pppppp...','....p..p....','............'],
 'SUZU BELL':['....yyy.....','...ygygy....','...yyyyy....','..yyw.yyy...','...yy.yy....','.....h......','.....h......','.....g......','.....h......','.....h......','....rrr.....','............'],
 'SPIRIT MIRROR':['...mmmm.....','..mwwsSm....','.mwwssSSm...','.mwsssSSm...','.msssSSSm...','..msSSSm....','...mmmm.....','.....h......','.....h......','....hgh.....','...hhhhh....','............']};
function mkEnch(){return {t:'ench',k:pick(ENCH).k};}
function applyEnch(it){syncLMB();if(!R.eq.wpn){setToast('EQUIP A WEAPON TO ENCHANT IT','#aaa',2);return false;}const E=ENCH.find(x=>x.k===it.k);
 // enchants stack: a second FLAME is FLAME II (more chance), and so on. 5 enchants in total; a 6th replaces the oldest
 G('n',it.k);let lost='';if(R.ench.length>=ENCHMAX)lost=' (REPLACES '+ENCH.find(x=>x.k===R.ench.shift()).n+')';R.ench.push(it.k);S=calcStats();
 const st=R.ench.filter(x=>x===it.k).length;setToast(R.eq.wpn.name+' ENCHANTED: '+fxLabel(E.n,Math.min(5,st))+lost,E.c,3);sfx('rare');spark(P.x,P.y,E.c,20,80);trainEv('ench');return true;}
function itemName(it){return it.t==='ench'?'ENCHANT '+ENCH.find(x=>x.k===it.k).n+' I: '+ENCH.find(x=>x.k===it.k).d:it.t==='scroll'?(it.regular?'TECHNIQUE SCROLL':'LEGENDARY SCROLL'):it.t==='hp'?'HP POTION':it.t==='stat'?'POTION OF '+STATS.find(s=>s.k===it.s).n:it.t==='relic'?ITEMBY[it.id].name:it.name;}
function itemCol(it){if(it.t==='gear')return QUAL[it.q||0].c;if(it.t==='ench')return ENCH.find(x=>x.k===it.k).c;return it.t==='scroll'?(it.regular?'#93d6de':Math.floor(time*4)%2?'#ffe060':'#fff'):it.t==='hp'?'#e33':it.t==='stat'?STATS.find(s=>s.k===it.s).c:it.t==='relic'?RCOL[ITEMBY[it.id].r]:it.rare?'#fd4':'#ddd';}
// bag tiers: 0 brown (common), 1 purple (potions/gear), 2 gold (rare gear)
function bagContents(tier,boss){
 const di=R.di,it=[],slot=()=>pick(['wpn','arm','ring']),gear=(b,q)=>mkGear(slot(),tierFor(di,b),false,q==null?rollQ(di,0):q);
 if(tier===1||tier===2){ // green pack / blue satchel: a decent piece of gear plus extras
  it.push(gear(0,rollQ(di,tier-1)));if(Math.random()<.1)it.push({t:'hp'});if(tier===2&&Math.random()<.3)it.push(statSwap());if(Math.random()<.1*tier)it.push(mkEnch());if(tier===2&&Math.random()<.14)it.push({t:'scroll',regular:true});}
 else if(tier===0){ // brown: 1-3 small things
  if(Math.random()<.08)it.push({t:'hp'});if(Math.random()<.45||!it.length)it.push(gear(-1,rollQ(di,-1)));if(di>=1&&Math.random()<.08)it.push(mkEnch());}
 else if(tier===3){ // purple: 2-4 things, better gear
  it.push(gear(0,rollQ(di,1)));if(Math.random()<.45)it.push(statSwap());if(Math.random()<.3)it.push(mkEnch());if(Math.random()<.2)it.push({t:'relic',id:randItem(['rez']).id});if(Math.random()<.15)it.push({t:'hp'});}
 else if(tier===5){ // enchanter pouch: two different enchants, sometimes a scroll
  const a=mkEnch();let b=mkEnch();for(let i=0;i<5&&b.k===a.k;i++)b=mkEnch();it.push(a,b);if(Math.random()<.04)it.push({t:'scroll'});}
 else if(tier===6){ // scholar case: a guaranteed legendary scroll and an elixir
  it.push({t:'scroll'},statSwap());if(Math.random()<.3)it.push({t:'relic',id:randItem(['rez']).id});}
 else if(tier===7){ // war chest: two epic pieces, one of them a weapon
  it.push(mkGear('wpn',tierFor(di,1),false,3),gear(1,3));}
 else if(tier===8){ // shogun's trophy (the usual boss bag): two epics, maybe a scroll and an enchant, an elixir
  it.push(mkGear('wpn',tierFor(di,1),false,3),gear(1,3),statSwap());if(Math.random()<.07)it.unshift({t:'scroll'});if(Math.random()<.5)it.push(mkEnch());if(!it.some(o=>o.t==='scroll')&&Math.random()<.45)it.push({t:'scroll',regular:true});}
 else if(tier===9){ // jade casket: an epic ring and elixirs
  it.push(mkGear('ring',tierFor(di,1),false,3),statSwap());if(Math.random()<.4)it.push(statSwap());}
 else if(tier===10){ // monk's bundle: relics, sometimes a potion
  const a=randItem(['rez']);it.push({t:'relic',id:a.id});if(Math.random()<.5)it.push({t:'relic',id:randItem(['rez',a.id]).id});if(Math.random()<.3)it.push({t:'hp'});}
 else if(tier===11){ // assassin kit: an epic weapon of ANY type (off-class finds) and an enchant
  const g=mkGear('wpn',tierFor(di,1),false,3);g.wt=pick(Object.keys(WTYPES));g.name=QUAL[3].n+' '+GEARN.wpn[g.tier]+' '+g.wt;it.push(g,mkEnch());}
 else{ // royal bag (super rare, white): always a named legendary, plus extras
  it.push(mkGear(null,tierFor(di,1),true));
  if(Math.random()<.5)it.push(statSwap());
  if(Math.random()<(boss?.2:.08))it.unshift({t:'scroll'});
  if(boss){it.push(mkGear('wpn',tierFor(di,1),false,Math.min(3,1+rollQ(di,0))),mkEnch(),{t:'hp'},statSwap());}}
 return it;
}
// bag tiers: 0 sack, 1 pack (green), 2 satchel (blue), 3 pouch (purple), 4 royal bag (gold)
const BAGCOL=['#c8995a','#6ac85a','#5aa0f0','#b070f0','#fff4c0','#5ad8c8','#e05060','#c8d0e0','#e05040','#6ad89a','#f8c060','#9a7ad0'],
 BAGN=['SACK','PACK','SATCHEL','POUCH','ROYAL BAG','ENCHANTER POUCH','SCHOLAR CASE','WAR CHEST',"SHOGUN'S TROPHY",'JADE CASKET',"MONK'S BUNDLE",'ASSASSIN KIT'],GOLDBAG=4,TROPHY=8;
// a random "good" bag (epics, enchants, scrolls, relics). The white royal bag is NOT in this pool: it is super rare.
// the scholar case (a guaranteed legendary scroll) is the rarest of these
const goodBag=()=>wpick([{t:3,wt:5},{t:5,wt:2},{t:6,wt:.15},{t:7,wt:2},{t:9,wt:2},{t:10,wt:2},{t:11,wt:2}]).t;
// a promised reward bag (curse, challenge): usually a good bag, very rarely the royal one
const rewardBag=()=>Math.random()<.07?GOLDBAG:goodBag();
function dropBag(x,y,tier,boss){const a=Math.random()*TAU,s=rnd(15,35);
 pickups.push({x,y,k:'bag',tier,items:bagContents(tier,boss),vx:Math.cos(a)*s,vy:Math.sin(a)*s,t:0,z:2,vz:[80,90,100,115,150][tier]||115});
 if(tier===GOLDBAG){sfx('rare');spark(x,y,'#fff6c0',30,120);spark(x,y,'#fff',12,80);fxRing(x,y,30,'#fff6c0',.5);setToast('* ROYAL BAG: A LEGENDARY AWAITS *','#fff6c0',3);}
 else if(tier>=5){spark(x,y,BAGCOL[tier],14,80);fxRing(x,y,20,BAGCOL[tier],.35);}
}
function bagLand(k){const c=BAGCOL[k.tier];spark(k.x,k.y,k.tier===0?'#8a7a60':c,k.tier===4?16:6,k.tier===4?70:40);
 if(k.tier===4){fxRing(k.x,k.y,22,'#ffd040',.4);fxRing(k.x,k.y,12,'#fff',.25);shake=Math.max(shake,3);sfx('coin');}}
const nearBag=()=>{let best=null,bd=14;for(const k of pickups){if(k.k!=='bag'||k.dead)continue;const d=dist(k,P);if(d<bd){bd=d;best=k;}}return best;};
function lootBag(b){ // potions, elixirs and empty gear slots are automatic; build choices wait for input
 if(!b.opened){for(const it of b.items)if(it.t==='gear'&&it.rare)codexAdd('gear',it.name);b.opened=true;b.pop=.25;spark(b.x,b.y,BAGCOL[b.tier],b.tier===4?40:10,b.tier===4?140:60);
  if(b.tier===4){spark(b.x,b.y,'#fff',16,100);fxRing(b.x,b.y,34,'#ffd040',.5);fxRing(b.x,b.y,20,'#fff',.3);sfx('rare');hitstop=Math.max(hitstop,.06);}}
 for(let i=b.items.length-1;i>=0;i--){const it=b.items[i];let took=false;
  if(it.t==='hp'){if(R.pots<POTMAX){R.pots++;took=true;txtFx(P.x,P.y,'+HP POTION','#e33');}}
  else if(it.t==='stat'){const st=STATS.find(s=>s.k===it.s);G('t',it.s);if(meta.stats[it.s]<STATMAX){meta.stats[it.s]++;saveMeta();S=calcStats();setToast(st.n+' +1  ('+meta.stats[it.s]+'/'+STATMAX+')',st.c,2.5);}else{R.sen+=40;txtFx(P.x,P.y,st.n+' MAXED +40 GOLD','#fc4');}took=true;}
  else if(it.t==='gear'&&!R.eq[it.slot]){R.eq[it.slot]=it;S=calcStats();setToast('EQUIPPED '+it.name,itemCol(it),2.5);took=true;}
  if(took){b.items.splice(i,1);sfx('pickup');}
 }
 if(!b.items.length)b.dead=true;
}
// ---- bag panel: stand on a bag to see everything inside; 1-6 take one item, G takes all ----
function cmpLine(g){const cur=R.eq[g.slot];if(!cur)return {s:'EMPTY SLOT',c:'#6f6'};const a=gearVals(g),b=gearVals(cur),k=a.atk!=null?'atk':a.hp!=null?'hp':'sv',d=a[k]-b[k];return {s:(d>0?'+':'')+d+(k==='atk'?' POWER':k==='hp'?' HP':' STAT')+' VS NOW',c:d>0?'#6f6':d<0?'#f66':'#aaa'};}
function drawBagPanel(b){const n=Math.min(6,b.items.length);if(!n)return;G('b',b.tier);const w=260,h=15+n*13,x=Math.round((W-w)/2),y=H-32-h;
 ctx.fillStyle='rgba(8,6,12,.92)';ctx.fillRect(x,y,w,h);ctx.fillStyle=BAGCOL[b.tier];ctx.fillRect(x,y,w,1);ctx.fillRect(x,y+h-1,w,1);
 txt(BAGN[b.tier],x+4,y+3,BAGCOL[b.tier]);txt('1-'+n+' TAKE   G ALL',x+w-4-txtW('1-'+n+' TAKE   G ALL'),y+3,'#888');
 for(let i=0;i<n;i++){const it=b.items[i],yy=y+12+i*13;txt((i+1)+'',x+4,yy+3,'#fff');ctx.drawImage(itemIcon(it),x+11,yy);const nm=itemName(it),cat=itemCat(it);txt(nm.length>40?nm.slice(0,39)+'.':nm,x+26,yy,itemCol(it));
  if(it.t==='gear'){txt(gearLines(it).slice(0,2).join('  ').slice(0,40),x+26,yy+7,'#888');const c=cmpLine(it);txt(c.s,x+w-4-txtW(c.s),yy+3,c.c);}
  else txt((cat.n+': '+cat.d).slice(0,52),x+26,yy+7,cat.c);}}
// every pickup belongs to one category with one job, shown wherever it appears
function itemCat(it){
 if(it.t==='gear')return it.slot==='wpn'?{n:'WEAPON',c:'#e8eef6',d:'SETS YOUR LMB ATTACK'}:{n:'GEAR',c:'#aaa',d:'STATS'};
 if(it.t==='ench')return {n:'ENCHANT',c:ENCH.find(x=>x.k===it.k).c,d:'ON-HIT EFFECT FOR ALL ABILITIES'};
 if(it.t==='scroll')return it.regular?{n:'TECHNIQUE',c:'#93d6de',d:'IMPROVES ONE ABILITY'}:{n:'LEGENDARY',c:'#ffe060',d:'EMPOWERS ONE ABILITY'};
 if(it.t==='hp')return {n:'POTION',c:'#e55',d:'HEAL WITH C'};
 if(it.t==='stat')return {n:'ELIXIR',c:'#f9c',d:'NO LONGER FOUND'};
 if(it.t==='relic')return {n:'RELIC',c:'#c6f',d:'RUN-WIDE RULE'};
 return {n:'ITEM',c:'#aaa',d:''};}
function takeItem(b,i){const it=b.items[i];if(!it)return;
 if(it.t==='gear'){const old=R.eq[it.slot];R.eq[it.slot]=it;b.items.splice(i,1);if(old){if(R.pack.length<PACKMAX)R.pack.push(old);else b.items.push(old);}syncLMB();S=calcStats();P.hp=Math.min(S.maxhp,P.hp);
  setToast('EQUIPPED '+it.name+(it.slot==='wpn'&&old&&old.ench&&old.ench.length?' - '+old.ench.length+' ENCHANTS STAY ON YOUR OLD WEAPON':''),itemCol(it),2.5);sfx('pickup');if(it.rare)codexAdd('gear',it.name);}
 else if(it.t==='scroll')learnScroll(b,i);
 else if(it.t==='ench'||it.t==='relic')openLootConfirm(b,it);
 else if(it.t==='hp'){if(R.pots<POTMAX){R.pots++;b.items.splice(i,1);sfx('pickup');}else{P.hp=Math.min(S.maxhp,P.hp+S.maxhp*.2);b.items.splice(i,1);sfx('heal');}}
 else{lootBag(b);}
 if(!b.items.length)b.dead=true;}
function takeAll(b){
 let next=null;
 for(let i=b.items.length-1;i>=0;i--){
  const it=b.items[i];
  if(it.t==='gear'){
   if(!R.eq[it.slot])takeItem(b,i);else if(R.pack.length<PACKMAX){R.pack.push(it);b.items.splice(i,1);}
  }else if(it.t==='hp')takeItem(b,i);
  else if(it.t==='scroll'||it.t==='ench'||it.t==='relic')next=it;
 }
 if(next)takeItem(b,b.items.indexOf(next));
 else if(b.items.length)setToast('PACK FULL - SOME ITEMS LEFT','#f66',1.5);
 if(!b.items.length)b.dead=true;
}
let lootConfirm=null;
function openLootConfirm(b,it){lootConfirm={b,it};mode='lootConfirm';sfx('tool');}
function finishLootConfirm(accept){
 if(!lootConfirm)return;
 const {b,it}=lootConfirm,i=b.items.indexOf(it);
 if(accept&&i>=0&&!b.dead){
  if(it.t==='ench'&&!applyEnch(it))return;
  if(it.t==='relic'){applyItem(it.id);sfx('pickup');}
  b.items.splice(i,1);if(!b.items.length)b.dead=true;
 }
 lootConfirm=null;mode='play';
}
function lootConfirmKey(c){
 if(c==='Enter'||c==='Space')finishLootConfirm(true);
 else if(c==='Escape')finishLootConfirm(false);
}
function lootConfirmButtons(){
 const x=Math.round(W/2-112),y=Math.round(H/2+28);
 return [{x,y,w:107,label:'ENTER  ACCEPT'},{x:x+117,y,w:107,label:'ESC  LEAVE'}];
}
function clickLootConfirm(){
 lootConfirmButtons().forEach(({x,y,w},i)=>{
  if(mouse.x>=x&&mouse.x<x+w&&mouse.y>=y&&mouse.y<y+17)finishLootConfirm(i===0);
 });
}
function renderLootConfirm(){
 renderPlay();
 if(!lootConfirm)return;
 const {it}=lootConfirm,ench=it.t==='ench',o=ench?ENCH.find(e=>e.k===it.k):ITEMBY[it.id];
 const title=ench?o.n:o.name,col=itemCol(it),x=Math.round(W/2-122),y=Math.round(H/2-54);
 ctx.fillStyle='rgba(4,3,8,.70)';ctx.fillRect(0,0,W,H);
 ctx.fillStyle='#211824';ctx.fillRect(x,y,244,112);
 ctx.fillStyle='#110e18';ctx.fillRect(x+1,y+1,242,110);
 ctx.fillStyle=col;ctx.fillRect(x,y,244,2);
 ctx.drawImage(itemIcon(it),x+12,y+14,24,24);
 txt(ench?'ENCHANT':'RELIC',x+46,y+12,col);txt(title,x+46,y+24,'#fff0d5');
 wrapTxt(o.d,49).forEach((line,i)=>txt(line,x+12,y+45+i*8,'#ddd'));
 if(ench&&R.ench.length>=ENCHMAX){
  const old=ENCH.find(e=>e.k===R.ench[0]);
  if(old)txt('REPLACES OLDEST ENCHANT: '+old.n,x+12,y+68,'#ffa487');
 }else if(ench)txt('APPLIES TO YOUR EQUIPPED WEAPON',x+12,y+68,'#b9a2ba');
 for(const {x:bx,y:by,w,label} of lootConfirmButtons()){
  const hover=mouse.x>=bx&&mouse.x<bx+w&&mouse.y>=by&&mouse.y<by+17;
  ctx.fillStyle=hover?'#605141':'#352838';ctx.fillRect(bx,by,w,17);
  ctxt2(label,bx,w,by+6,hover?'#fff3d1':'#e2cedf');
 }
}
// ---- legendary scrolls: choose 1 of 3. REPLACE swaps a slot's whole spell; ADD-ON keeps it and stacks an effect on top ----
// scroll add-ons are guaranteed and only for the chosen slot (unlike enchants, which are chances on every ability)
const ADDONS=[{k:'burn',n:'ALWAYS BURNS',tier:3},{k:'chill',n:'ALWAYS CHILLS',tier:3},{k:'shock',n:'ALWAYS SHOCKS + ARCS',tier:3},{k:'poison',n:'ALWAYS POISONS',tier:3},
 {k:'crit',n:'+25% CRIT CHANCE',tier:3},{k:'pierce',n:'SHOTS PIERCE +2',tier:2},{k:'cd',n:'COOLDOWN -40%',tier:3},{k:'emp',n:'EMPOWERED: +60% POWER -30% COOLDOWN',tier:4}];
const TECHNIQUES=[
 {k:'focus',n:'+10% ABILITY POWER',tier:1,c:'#93d6de'},
 {k:'tempo',n:'12% SHORTER COOLDOWN',tier:1,c:'#93d6de'},
 {k:'edge',n:'+8% CRIT CHANCE',tier:1,c:'#93d6de'}
];
ADDONS.forEach(a=>a.c=fxCol(a.k));
const SCROLL_ADDONS=[...ADDONS,...TECHNIQUES];
const fxLabel=(n,t)=>n+' '+ROM[t-1];
let scrollOpts=null,scrollSource=null;
function rollScrollOpts(){const slots=[...'hqwfe'].filter(k=>!P.lock?.[k]),used=new Set();if(!slots.length)return [];
 // a replacement is rare and always an upgrade: only the slot's LEGENDARY spell (never a sidegrade), on at most one card,
 // and only on about a quarter of legendary scrolls; the rest offer add-ons that keep the ability as it is
 const rep=()=>{if(Math.random()>.25)return null;for(let t=0;t<40;t++){const k=pick(slots);if(used.has(k)||P.lo[k]===3||!SPELLS[k][3])continue;used.add(k);return {kind:'rep',k,v:3};}return null;};
 const add=()=>{for(let t=0;t<40;t++){const k=pick(slots);if(used.has(k))continue;const L=ADDONS.filter(a=>!(a.k==='emp'&&P.emp&&P.emp[k]));used.add(k);return {kind:'add',k,a:pick(L).k};}return null;};
 const r=rep(),o=[add(),add(),add()].filter(Boolean);if(r)o.splice(ri(0,o.length),0,r);return o.slice(0,3);}
function rollTechniques(){
 const slots=[...'hqwfe'].filter(k=>!P.lock?.[k]),pool=[];
 for(const k of slots)for(const a of TECHNIQUES)if(!R.addon?.[k]?.[a.k])pool.push({kind:'add',k,a:a.k});
 const choices=[];
 while(pool.length&&choices.length<3){
  const option=pool.splice(ri(0,pool.length-1),1)[0];
  choices.push(option);
  if(pool.some(o=>o.k!==option.k))for(let i=pool.length-1;i>=0;i--)if(pool[i].k===option.k)pool.splice(i,1);
 }
 return choices;
}
function learnScroll(b,i){
 const it=b.items[i];
 if(it?.t!=='scroll')return false;
 const valid=o=>!P.lock?.[o.k]&&(o.kind==='rep'?P.lo[o.k]!==o.v:it.regular?!R.addon?.[o.k]?.[o.a]:o.a!=='emp'||!P.emp?.[o.k]);
 scrollOpts=(it.choices||[]).filter(valid);
 if(!scrollOpts.length)scrollOpts=(it.regular?rollTechniques():rollScrollOpts()).filter(valid);
 it.choices=scrollOpts;
 if(!scrollOpts.length){setToast(it.regular?'ALL TECHNIQUES LEARNED':'NO AVAILABLE ABILITY SLOTS','#93d6de',2);return false;}
 scrollSource={b,it};mode='scroll';sfx(it.regular?'tool':'rare');return true;
}
function closeScroll(){scrollOpts=null;scrollSource=null;mode='play';}
function pickScroll(i){
 const o=scrollOpts?.[i];
 if(!o||!scrollSource)return;
 const {b,it}=scrollSource,index=b.items.indexOf(it);
 if(index<0||b.dead){closeScroll();return;}
 const k=o.k,cur=SPELLS[k][P.lo[k]],regular=it.regular,col=regular?'#93d6de':'#ffe060';
 b.items.splice(index,1);if(!b.items.length)b.dead=true;
 G('s',regular?'technique':'scroll');
 if(!regular){
  P.emp=P.emp||{};P.emp[k]=1;flashT=Math.max(flashT,.18);flashCol=col;hitstop=Math.max(hitstop,.08);
  txtFx(P.x,P.y-16,'EMPOWERED!',col,2);
 }
 if(o.kind==='rep'){
  P.lo[k]=o.v;if(o.v===3)codexAdd('sp',k);P.asc=P.asc||{};P.asc[k]=1;setToast(SLOTKEY[k]+' BECOMES '+SPELLS[k][o.v].n+' (+30% POWER)','#ffe060',3.5);
 }else if(o.a==='emp')setToast(cur.n+' EMPOWERED',col,3);
 else{
  R.addon=R.addon||{};R.addon[k]=R.addon[k]||{};R.addon[k][o.a]=(R.addon[k][o.a]||0)+1;
  const a=SCROLL_ADDONS.find(a=>a.k===o.a);setToast(cur.n+': '+a.n,a.c,3);
 }
 if(!regular){if(k==='w')P.ab.rmb=0;else P.ab[k]=0;}
 closeScroll();trainEv('scroll');sfx(regular?'pickup':'rare');
 fxRing(P.x,P.y,regular?24:40,col,.5);spark(P.x,P.y,col,regular?8:20,100);
}
const SCARD={w:96,gap:6,y:38,h:126};
function scrollCardX(i){const n=scrollOpts.length;return Math.round((W-(n*SCARD.w+(n-1)*SCARD.gap))/2)+i*(SCARD.w+SCARD.gap);}
function clickScroll(){if(!scrollOpts)return;for(let i=0;i<scrollOpts.length;i++){const x=scrollCardX(i);if(mouse.x>=x&&mouse.x<=x+SCARD.w&&mouse.y>=SCARD.y&&mouse.y<=SCARD.y+SCARD.h){pickScroll(i);return;}}}
function wrapTxt(s,n){const L=[];let c='';for(const w of s.split(' ')){if(c&&(c+' '+w).length>n){L.push(c);c=w;}else c=c?c+' '+w:w;}if(c)L.push(c);return L;}
function renderScroll(){
 renderPlay();ctx.fillStyle='rgba(0,0,0,.8)';ctx.fillRect(0,0,W,H);
 const regular=scrollSource?.it.regular;
 ctxt(regular?'TECHNIQUE SCROLL':'LEGENDARY SCROLL',8,regular?'#93d6de':'#ffe060',2);
 ctxt('CHOOSE ONE  (1-'+scrollOpts.length+')   ESC LEAVE',26,'#ccc');
 const {w:cw,y,h}=SCARD;
 scrollOpts.forEach((o,i)=>{const x=scrollCardX(i),rep=o.kind==='rep',tc=rep?'#ff9040':'#6f6',hov=mouse.x>=x&&mouse.x<=x+cw&&mouse.y>=y&&mouse.y<=y+h,cur=SPELLS[o.k][P.lo[o.k]];
  ctx.fillStyle=hov?'#2a1a30':'#160e1a';ctx.fillRect(x,y,cw,h);ctx.fillStyle=tc;ctx.fillRect(x,y,cw,2);ctx.fillRect(x,y+h-1,cw,1);ctx.fillRect(x,y,1,h);ctx.fillRect(x+cw-1,y,1,h);
  txt('['+(i+1)+']',x+4,y+5,'#aaa');const tag=rep?'REPLACE':'ADD-ON';txt(tag,x+cw-4-txtW(tag),y+5,tc);
  ctxt2(SLOTKEY[o.k]+' SLOT',x,cw,y+16,'#fff');
  // the ability's picture: what the slot will be after this choice
  spellBox(x+6,y+12,rep?SPELLS[o.k][o.v]:cur,true);
  if(rep){const nw=SPELLS[o.k][o.v],ow=txtW(cur.n);
   ctxt2(cur.n,x,cw,y+28,'#777');ctx.fillStyle='#c33';ctx.fillRect(Math.round(x+(cw-ow)/2),y+30,ow,1);
   ctxt2('V',x,cw,y+37,tc);ctxt2(nw.n,x,cw,y+46,nw.c);if(nw.rare)ctxt2('LEGENDARY SPELL',x,cw,y+55,'#ffe060');
   wrapTxt(nw.d,22).slice(0,3).forEach((l,j)=>ctxt2(l,x,cw,y+66+j*8,'#ccc'));
   ctxt2('+ EMPOWERED',x,cw,y+h-38,'#ffe060');ctxt2('+30% POWER',x,cw,y+h-30,'#ffe060');ctxt2('CHANGES THE',x,cw,y+h-20,tc);ctxt2('WHOLE ABILITY',x,cw,y+h-12,tc);}
  else{const A=SCROLL_ADDONS.find(a=>a.k===o.a);
   ctxt2(cur.n,x,cw,y+28,cur.c);ctxt2('+',x,cw,y+38,tc);wrapTxt(regular?A.n:fxLabel(A.n,A.tier),22).forEach((l,j)=>ctxt2(l,x,cw,y+47+j*8,A.c));
   wrapTxt(cur.d,22).slice(0,3).forEach((l,j)=>ctxt2(l,x,cw,y+72+j*8,'#888'));
   if(!regular&&o.a!=='emp')ctxt2('+ EMPOWERED',x,cw,y+h-12,'#ffe060');}
 });
}
function swapGear(b){const i=b.items.findIndex(it=>it.t==='gear');if(i<0)return false;const g=b.items[i],old=R.eq[g.slot];b.items.splice(i,1);
 let msg='';if(old){if(R.pack.length<PACKMAX){R.pack.push(old);msg='  ('+old.name+' TO PACK)';}else{b.items.push(old);msg='  (PACK FULL)';}}
 R.eq[g.slot]=g;S=calcStats();P.hp=Math.min(S.maxhp,P.hp);setToast('EQUIPPED '+g.name+msg,itemCol(g),2.5);sfx('pickup');if(!b.items.length)b.dead=true;return true;}
// ---- backpack: carry up to 8 spare pieces of gear for the run ----
const PACKMAX=8;let invOpen=false,invHover=-1;
function closeInv(){invOpen=false;mouse.down=false;mouse.rdown=false;}
function equipFromPack(i){const g=R.pack[i];if(!g)return;const old=R.eq[g.slot];R.eq[g.slot]=g;if(old)R.pack[i]=old;else R.pack.splice(i,1);S=calcStats();P.hp=Math.min(S.maxhp,P.hp);setToast('EQUIPPED '+g.name,itemCol(g),2);sfx('pickup');}
function quickSwap(){const i=R.pack.findIndex(g=>g.slot==='wpn');if(i<0){setToast('NO SPARE WEAPON IN PACK','#aaa',1.5);return;}const g=R.pack.splice(i,1)[0],old=R.eq.wpn;R.eq.wpn=g;if(old)R.pack.push(old);S=calcStats();P.hp=Math.min(S.maxhp,P.hp);setToast('WEAPON: '+g.name,itemCol(g),1.8);sfx('tool');spark(P.x,P.y,itemCol(g),10,60);}
function dropGear(g){pickups.push({x:P.x+rnd(-6,6),y:P.y+rnd(-6,6),k:'bag',tier:g.rare?4:Math.min(3,g.q||0),items:[g],t:0,z:0,vz:0,opened:true,landed:true,seen:true});sfx('tool');}
// layout: 3 equipped slots on the left, a 4x2 pack grid on the right
// layout: panel 300x158; equipped column on the left, 4x2 pack grid on the right, details strip below
const INVX=10,INVY=10,invSlots=()=>{const L=[];['wpn','arm','ring'].forEach((s,i)=>L.push({x:INVX+10,y:INVY+28+i*22,eq:s}));for(let i=0;i<PACKMAX;i++)L.push({x:INVX+196+(i%4)*22,y:INVY+28+((i/4)|0)*22,pi:i});return L;};
function invAt(){return invSlots().findIndex(s=>mouse.x>=s.x-1&&mouse.x<s.x+15&&mouse.y>=s.y-1&&mouse.y<s.y+15);}
// selling: inside a trader's shop, RMB on an item sells it for a small price (about a fifth of what the trader would ask)
function inShop(){if(!map||!map.roomOf||!P)return false;const ri=map.roomOf[(P.y/T|0)*MW+(P.x/T|0)];return ri>=0&&map.rooms[ri]&&map.rooms[ri].type==='shop';}
function sellPrice(g){return Math.round((6+3*(g.tier||0))*[1,1.4,2,3,5][g.q||0]*(g.rare?2:1)*(1+.1*((R&&R.di)||0)));}
function sellGear(g){const v=sellPrice(g);R.sen+=v;txtFx(P.x,P.y-10,'+'+v+' GOLD','#ffd040');setToast('SOLD '+g.name+' FOR '+v+' GOLD','#ffd040',1.8);sfx('coin');}
function invClick(btn){const k=invAt();if(k<0)return;const s=invSlots()[k];
 if(btn===2&&inShop()){const g=s.pi!==undefined?R.pack[s.pi]:R.eq[s.eq];if(!g)return;if(s.pi!==undefined)R.pack.splice(s.pi,1);else R.eq[s.eq]=null;sellGear(g);S=calcStats();P.hp=Math.min(S.maxhp,P.hp);return;}
 if(s.pi!==undefined){const g=R.pack[s.pi];if(!g)return;if(btn===0)equipFromPack(s.pi);else if(btn===2){R.pack.splice(s.pi,1);dropGear(g);setToast('DROPPED '+g.name,'#aaa',1.5);}}
 else{const g=R.eq[s.eq];if(!g)return;if(btn===0){if(R.pack.length>=PACKMAX){setToast('PACK FULL','#f66',1.5);return;}R.pack.push(g);R.eq[s.eq]=null;}else if(btn===2){R.eq[s.eq]=null;dropGear(g);}S=calcStats();P.hp=Math.min(S.maxhp,P.hp);sfx('tool');}}
function panel(x,y,w,h,title,acc){ctx.fillStyle='rgba(0,0,0,.55)';ctx.fillRect(0,0,W,H);ctx.fillStyle='#120e18';ctx.fillRect(x,y,w,h);ctx.fillStyle='#1e1828';ctx.fillRect(x,y,w,12);ctx.fillStyle=acc||'#d02030';ctx.fillRect(x,y,w,1);ctx.fillRect(x,y+h-1,w,1);ctx.fillRect(x,y+12,w,1);if(title)txt(title,x+4,y+4,acc||'#d02030');}
const sep=(x,y,w)=>{ctx.fillStyle='#2e2638';ctx.fillRect(x,y,w,1);};
function drawInv(){
 const w=W-INVX*2,h=H-INVY*2-4;panel(INVX,INVY,w,h,'INVENTORY');txt('PACK '+R.pack.length+'/'+PACKMAX,INVX+w-48,INVY+4,R.pack.length>=PACKMAX?'#f66':'#aaa');
 txt('EQUIPPED',INVX+10,INVY+18,'#887');txt('BACKPACK',INVX+196,INVY+18,'#887');
 const hv=invAt(),SL=invSlots();
 SL.forEach((s,i)=>{const g=s.eq?R.eq[s.eq]:R.pack[s.pi];drawItemIcon(g,s.x,s.y);if(i===hv){ctx.fillStyle='rgba(255,255,255,.18)';ctx.fillRect(s.x,s.y,14,14);}
  if(g&&s.pi!==undefined)txt(g.tier+1,s.x+(g.tier>=9?7:10),s.y+9,'#fff',1);
  if(s.eq){txt(g?g.name.slice(0,26):'NO '+SLOTNAME[s.eq],s.x+20,s.y+1,g?itemCol(g):'#555');if(g)txt(gearLines(g).slice(0,2).join('  ').slice(0,36),s.x+20,s.y+8,'#888');}});
 sep(INVX+6,INVY+96,w-12);
 const s=SL[hv],g=s&&(s.eq?R.eq[s.eq]:R.pack[s.pi]);
 if(g){const L=gearLines(g),cur=s.pi!==undefined?R.eq[g.slot]:null;drawItemIcon(g,INVX+10,INVY+101);txt(g.name,INVX+30,INVY+101,itemCol(g));txt(L[0],INVX+30,INVY+108,'#aaa');
  L.slice(1).forEach((l,i)=>txt(l.slice(0,34),INVX+10+((i/3)|0)*146,INVY+118+(i%3)*8,'#ccc'));
  if(cur){const c=cmpLine(g);txt(c.s,INVX+w-8-txtW(c.s),INVY+101,c.c);}
  {const hint=(s.pi!==undefined?'LMB EQUIP  ':'LMB TO PACK  ')+(inShop()?'RMB SELL +'+sellPrice(g):'RMB DROP');txt(hint,INVX+w-8-txtW(hint),INVY+108,inShop()?'#ffd040':'#8cf');}}
 else{const SLN=setLines();if(SLN.length)SLN.forEach((l,i)=>txt(l.s.slice(0,72),INVX+10,INVY+102+i*8,l.c));else txt('HOVER AN ITEM TO INSPECT IT',INVX+10,INVY+102,'#666');
  txt('POWER '+Math.round(S.atk)+'   HP '+S.maxhp+'   DEF '+S.def+'   CRIT '+Math.round(S.crit*100)+'%',INVX+10,INVY+126,'#aaa');}
 ctxt(inShop()?'IN THE SHOP: RMB AN ITEM TO SELL IT TO THE TRADER':'TAB / ESC CLOSE      X SWAPS WEAPON      1-6 TAKE FROM BAG',INVY+h+3,inShop()?'#ffd040':'#777');
}
// rare gear sets: wear 2 or 3 pieces of one set for extra powers
const SETS={
 INFERNO:{c:'#f84',items:['PLAGUE LOTUS STAFF','BLOOD ROBE','STORM SIGNET'],b2:{qpow:1},d2:'+30% Q POWER',b3:{flare:1,storm:1},d3:'CRITS EXPLODE, +20% VS BURN/SHOCK'},
 MOON:{c:'#8cf',items:['MOONLIT WAND','HIGH PRIEST VESTMENT','RING OF ECHOES'],b2:{emb:1},d2:'-10% COOLDOWNS',b3:{echo:2},d3:'SPELLS ECHO FAR MORE OFTEN'},
 SHINOBI:{c:'#c8f',items:['KESTREL ROD','SHINOBI GARB','FROSTBOUND BAND'],b2:{shadow:1},d2:'FASTER DASH',b3:{crit:2,ghost:1},d3:'+16% CRIT, +6% DODGE'},
 CRANE:{c:'#fd4',items:['VOIDGLASS STAFF','CRANE CASTLE ARMOUR','RING OF GREED'],b2:{iron:1},d2:'-8% DAMAGE TAKEN',b3:{vamp:2,blood:1},d3:'LIFESTEAL, HEAL ON KILL'}};
const setOf=g=>g&&g.rare?Object.keys(SETS).find(k=>SETS[k].items.includes(g.name)):null;
function setCounts(){const c={};for(const s of ['wpn','arm','ring']){const k=setOf(R.eq&&R.eq[s]);if(k)c[k]=(c[k]||0)+1;}return c;}
function setLines(){const c=setCounts(),L=[];for(const k in c){const S2=SETS[k];L.push({s:k+' SET '+c[k]+'/3: '+(c[k]>=3?S2.d2+'. '+S2.d3:c[k]>=2?S2.d2:'NEXT AT 2'),c:c[k]>=2?S2.c:'#777'});}return L;}
function gearStats(){const o={atk:0,hp:0,def:0,fx:{},st:{}};
 {const c=setCounts();for(const k in c){const S2=SETS[k];const add=b=>{for(const f in b)o.fx[f]=(o.fx[f]||0)+b[f];};if(c[k]>=2)add(S2.b2);if(c[k]>=3)add(S2.b3);}}
 for(const s of ['wpn','arm','ring']){const g=R.eq&&R.eq[s];if(!g)continue;const v=gearVals(g);if(v.atk)o.atk+=v.atk;if(v.hp){o.hp+=v.hp;o.def+=v.def;}if(v.sv)o.st[g.stat]=(o.st[g.stat]||0)+v.sv;if(g.fx)for(const k in g.fx)o.fx[k]=(o.fx[k]||0)+g.fx[k];for(const k of (g.aff||[]))o.fx[k]=(o.fx[k]||0)+1;}return o;}
// abilities need line of sight: walls block blasts, cones, chains and zaps
function los(x0,y0,x1,y1){const d=Math.hypot(x1-x0,y1-y0),n=Math.ceil(d/5);for(let i=1;i<n;i++){const t=i/n;if(solid(x0+(x1-x0)*t,y0+(y1-y0)*t))return false;}return true;}
function coneHit(x,y,a,range,arc,fn){for(const e of enemies){if(e.dead||e.air||!los(x,y,e.x,e.y))continue;const d=Math.hypot(e.x-x,e.y-y);if(d>range+e.r)continue;if(d>e.r+4&&Math.abs(angDiff(Math.atan2(e.y-y,e.x-x),a))>arc/2)continue;fn(e);}}
function shockwave(x,y,r,dmg){fxRing(x,y,r,'#fff',.25);for(const e of enemies){if(e.dead||e.air)continue;if(los(x,y,e.x,e.y)&&Math.hypot(e.x-x,e.y-y)<r+e.r)hurtE(e,dmg,20,{kb:Math.atan2(e.y-y,e.x-x)});}}

const classDamageTaken=()=>CLS().k==='sumo'&&P.evo>=9?.78:(CLS().incomingDamage??1);

function hitPlayer(raw,sx,sy,o){
 o=o||{};const p=P;raw*=(1+.25*(R.curse||0))*DF().dmg*classDamageTaken();
 if(p.iv>0||p.dash>0){if(p.dash>0&&R.training)trainEv('dodge');return 'dodge';}
 // bullets never grant mercy frames, so several can land at once; melee/contact/hazards share a short cooldown
 if(!o.bullet&&p.hurtIv>0)return 'dodge';
 if(p.guardSt>0&&!o.peril){p.guardSt=0;p.iv=.3;sfx('deflect');txtFx(p.x,p.y,'COUNTER','#e0b040');fxRing(p.x,p.y,50,'#e0b040',.3);impact(p.x,p.y,'#e0b040',4);for(const e of enemies)if(!e.dead&&!e.air&&Math.hypot(e.x-p.x,e.y-p.y)<50+e.r&&los(p.x,p.y,e.x,e.y))hurtE(e,S.atk*2*AP()*EMP('w'),40,{slash:true,kb:Math.atan2(e.y-p.y,e.x-p.x)});return 'dodge';}
 const shieldKeys=p.ironBellyUntil>R.time?['ironBellyShield','shieldHp']:['shieldHp'];
 for(const key of shieldKeys){
  if(!(p[key]>0))continue;
  const absorbed=Math.min(p[key],raw);
  p[key]-=absorbed;raw-=absorbed;spark(p.x,p.y,'#8cf',6,50);
  if(raw<=0){p.iv=Math.max(p.iv,.15);return 'dodge';}
 }
 if(S.dodge&&!o.peril&&Math.random()<S.dodge){txtFx(p.x,p.y,'DODGE','#8cf');return 'dodge';}
 if(p.ward>0&&!o.peril){
  sfx('deflect');hitstop=.07;shake=Math.max(shake,3);R.perfect++;
  const wa=Math.atan2(sy-p.y,sx-p.x);spark(p.x+Math.cos(wa)*11,p.y+Math.sin(wa)*11,'#8cf',14,100);
  p.iv=Math.max(p.iv,.1);txtFx(p.x,p.y,'WARDED','#8cf');
  if(o.src&&!o.src.dead){o.src.posture+=(o.pd||20)+S.atk*.6;o.src.pdelay=2;checkBreak(o.src);}
  if(S.thorn)shockwave(p.x,p.y,36,S.atk*S.thorn*.8);
  return 'perfect';
 }
 const dmg=Math.max(raw*.6,raw-S.def)*Math.max(.55,S.dr)*(p.stag>0?1.4:1)*(o.peril?1.5:1);
 p.hp-=dmg;p.combatT=3;p.pos+=raw*.35;p.pdelay=1.4;if(!o.bullet)p.hurtIv=.4;p.flash=.2;shake=Math.max(shake,4);sfx('hurt');hurtT=.45;
 txtFx(p.x,p.y,Math.round(dmg),'#f55');spark(p.x,p.y,'#c22',10,80);
 if(p.pos>=S.maxpos&&p.stag<=0){p.stag=1.2;p.guard=false;p.pos=S.maxpos*.4;txtFx(p.x,p.y,'STUNNED','#f84');sfx('break');}
 if(p.hp<=0&&!p.dying){
  const source=o.src?.d?.id||o.src?.name||o.src?.t?.n||o.src?.bossOwned?.name;
  p.deathCause=o.cause||(source?(o.bullet?source+' PROJECTILE':source):o.bullet?'ENEMY PROJECTILE':o.peril?'ARENA HAZARD':'ENEMY ATTACK');
  die();
  if(!p.dying)p.deathCause=null;
 }
 return 'hit';
}
function die(){
 if(P.dying>0)return;
 if(P.rez>0){P.rez--;P.hp=S.maxhp*.6;P.iv=2.5;P.stag=0;P.pos=0;sfx('heal');setToast('RESURRECTION','#fd4',2.5);fxRing(P.x,P.y,90,'#fd4',.5);shake=8;
  if(S.phoenix)shockwave(P.x,P.y,110,S.atk*6*S.phoenix);
  for(const e of enemies){if(e.dead||e.boss)continue;const d=dist(e,P);if(d<90){const a=angTo(P,e);e.kx+=Math.cos(a)*220;e.ky+=Math.sin(a)*220;e.act=null;e.stun=1.5;}}
  for(const q of projs)if(q.from==='e')q.dead=true;return;}
 startDeath();
}
// ---- player death: time stops, you stagger and fall, your spirit rises, then the summary ----
const DEATHT=3.2;
function startDeath(){const p=P;p.dying=DEATHT;p.hp=0;p.dash=0;p.animT=0;p.mv=false;mouse.down=mouse.rdown=false;invOpen=false;
 sfx('hurt');tone(220,1.4,'sawtooth',.07,-180,.15);tone(110,1.8,'triangle',.08,-60,.3);
 flashT=.25;flashCol='#fff';spark(p.x,p.y,'#c22',26,120);fxRing(p.x,p.y,30,'#fff',.35);txtFx(p.x,p.y-10,'DEFEATED','#f55',2);}
function updDeath(dt){const p=P,e0=DEATHT-p.dying;p.dying-=dt;const e1=DEATHT-p.dying;
 if(e0<1.25&&e1>=1.25){ // the body hits the floor: dust, then the spirit leaves it
  spark(p.x,p.y,'#9a9488',14,60);tone(70,.3,'sine',.12,-20);}
 if(e0<1.6&&e1>=1.6){for(let i=0;i<30;i++){const a=i/30*TAU;particles.push({x:p.x,y:p.y-6,vx:Math.cos(a)*50,vy:Math.sin(a)*50-20,t:rnd(.6,1.2),col:i%3?'#c8d8ff':'#fff'});}fxRing(p.x,p.y,46,'#c8d8ff',.6);[880,660,440,330].forEach((f,i)=>tone(f,.5,'triangle',.04,0,i*.18));}
 if(e1>1.6&&Math.random()<dt*20)particles.push({x:p.x+rnd(-4,4),y:p.y-6-(e1-1.6)*30,vx:rnd(-6,6),vy:-14,t:.8,col:'#c8d8ff'});
 if(flashT>0)flashT-=dt;
 for(const q of particles){q.t-=dt;q.x+=q.vx*dt;q.y+=q.vy*dt;const f=Math.exp(-5*dt);q.vx*=f;q.vy*=f;}particles=particles.filter(q=>q.t>0);
 for(const t of texts)t.t-=dt*.6;texts=texts.filter(t=>t.t>0);
 if(p.dying<=0){p.dying=0;finishRun(false);}}
function drawDeathBody(){const p=P,e=DEATHT-p.dying,X=sx(p.x,p.y),Y=sy(p.x,p.y)+3,s=heroSpr(CLS().k,p.evo||0,false),flip=p.face<0;
 shadow(X,Y-2,7);
 const fall=clamp((e-.55)/.7,0,1),k=fall*fall,ang=(flip?-1:1)*k*Math.PI/2,jit=e<.55?Math.round(Math.sin(e*60)*1.5):0;
 ctx.save();ctx.translate(X+jit,Y);ctx.rotate(ang);
 if(e>1.6){ctx.globalAlpha=Math.max(.35,1-(e-1.6));}
 drawSpr(s,0,0,e<.55&&Math.floor(e*16)%2===0,0,flip);ctx.restore();ctx.globalAlpha=1;
 // the spirit: a pale copy of you drifting upward and fading
 if(e>1.6){const u=e-1.6;ctx.globalAlpha=Math.max(0,.7-u*.45);drawSpr(s,X,Y-6-u*26,true,0,flip);ctx.globalAlpha=1;}}
function drawDeathOverlay(){const e=DEATHT-P.dying,d=clamp(e/DEATHT,0,1);
 ctx.fillStyle='rgba(10,0,4,'+(d*.55).toFixed(3)+')';ctx.fillRect(0,0,W,H);vignette('#600010',Math.min(.75,d*.9));
 if(e>1.7){const a=clamp((e-1.7)/.6,0,1);ctx.globalAlpha=a;ctxt('YOU HAVE FALLEN',28,'#d02030',3);ctxt(ROMAN[R.di]+'. '+DUN[R.di].name,52,'#aaa');if(P.deathCause)ctxt('KILLED BY '+P.deathCause,64,'#f39a8b');ctx.globalAlpha=1;}}
function finishRun(win){
 clearRun();
 R.sen=Math.round(R.sen*(1+.2*(R.asc||0)));meta.sen+=R.sen+(win?200:0);meta.runs++;if(win){meta.wins++;if(R.asc>=meta.ascMax&&meta.ascMax<10){meta.ascMax=R.asc+1;setToast('ASCENSION '+meta.ascMax+' UNLOCKED','#f5a',4);}}meta.reached=Math.max(meta.reached,Math.min(DUN.length-1,R.di));
 let unlock=null; // heroes now unlock through their own challenges (185-unlocks.js), not one per run
 saveMeta();
 deadInfo={win,cause:win?null:P.deathCause,sen:R.sen+(win?200:0),di:R.di,kills:R.kills,time:R.time,db:R.deathblows,pf:R.perfect,unlock,
  cls:CLS(),dmg:Object.assign({},R.dmg||{}),lo:Object.assign({},P.lo),eq:Object.assign({},R.eq),inv:Object.assign({},R.inv),ench:(R.ench||[]).slice(),addon:JSON.parse(JSON.stringify(R.addon||{})),combo:R.bestCombo||0,evo:P.evo||0};
 mode=win?'win':'dead';if(win)sfx('win');else sfx('hurt');
 hubStart=Math.min(hubStart,meta.reached);
}
