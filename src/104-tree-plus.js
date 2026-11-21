'use strict';
// ===== SKILL TREE: build identity, free experimentation and a clear picture of your build =====
// - BRANCH MASTERY: learning 6, 14 and 24 nodes in one region unlocks three escalating, themed bonuses. Spreading thin still
//   works, but committing to a region (or two) is rewarded, which gives every save a clear build identity.
// - RESPEC (R twice): every jade spent comes back, so trying a different build never costs anything.
// - BUILD (B): every bonus you own added up, plus your keystones and masteries, on one page.
const MASTERY_AT=[6,14,24];
const MASTERY=[
 [['VETERAN',{pow:.05}],['BLOODED',{crit:.05}],['WARMASTER',{boss:.15,pow:.05}]],
 [['STEADY HAND',{near:.08}],['SWORDSAINT',{aspd:.06,def:1}],['EDGE OF HEAVEN',{near:.12,aspd:.06}]],
 [['STILL WATER',{cdr:.025}],['QUICKSILVER',{spd:.05,dash:.04}],['THE VOID',{cdr:.05}]],
 [['SCHOLAR',{abil:.08}],['FAR CASTER',{range:.10}],['ARCHMAGE',{abil:.15,cdr:.02}]],
 [['HARDY',{hp:.08}],['IRONHIDE',{def:2}],['MOUNTAIN HEART',{hp:.12,regen:.003}]],
 [['SHADE',{dodge:.03}],['SWIFT SHADOW',{spd:.05,graze:1}],['PHANTOM',{dodge:.05,dash:.04}]],
 [['THRIFTY',{gold:.10}],['FORTUNATE',{luck:1}],['DRAGON HOARD',{gold:.20,pot:.10}]],
 [['STALKER',{range:.08}],['KEEN EYE',{crit:.04}],['APEX HUNTER',{pow:.08,crit:.04}]]];
const stBranchOwned=b=>SKT.nodes.filter(n=>n.b===b&&stLv(n.k)>0).length;
const stBranchSize=b=>SKT.nodes.filter(n=>n.b===b).length;
const stTier=b=>{const o=stBranchOwned(b);return MASTERY_AT.filter(t=>o>=t).length;};
// mastery bonuses ride on the same totals as the nodes (so calcStats and every effect pick them up)
{const _st=stTot;stTot=function(){const t=_st();if(t._mk!==STOTkey){t._mk=STOTkey;
  STB.forEach((_,b)=>{const tier=stTier(b);for(let i=0;i<tier;i++){const e=MASTERY[b][i][1];for(const k in e)t[k]=(t[k]||0)+e[k];}});}return t;};}
// a mastery tier reached by a purchase is announced
{const _b=stBuy;stBuy=function(n){const b=n.b,before=b!=null&&b>=0?stTier(b):0;_b(n);if(b!=null&&b>=0){const after=stTier(b);if(after>before){const [nm]=MASTERY[b][after-1];
  setToast(STB[b].n+' MASTERY '+ROMAN[after-1]+': '+nm,STB[b].c,3.5);sfx('rare');STOT=null;}}};}

// ---------- respec ----------
function stSpent(){let s=0;for(const n of SKT.nodes){if(n.free)continue;const lv=stLv(n.k);if(!lv)continue;if(n.old){for(let i=0;i<lv;i++)s+=n.base*(i+1);}else if(n.big){for(let i=0;i<lv;i++)s+=Math.round(n.cost*(1+.6*i));}else s+=n.cost;}return s;}
function stRespec(){const g=stSpent();if(!g){stUI.notice={key:SKT.sel,t:time,text:'NOTHING TO REFUND'};sfx('block');return;}
 if(!(stUI.respecT&&time-stUI.respecT<3)){stUI.respecT=time;sfx('tool');return;}
 stUI.respecT=0;for(const n of SKT.nodes)if(!n.free)delete meta.up[n.k];meta.sen+=g;STOT=null;saveMeta();S&&R&&(S=calcStats());
 stSelect(SKT.byK.root);setToast('THE TEMPLE RETURNS '+g+' JADE. CHOOSE A NEW PATH','#5fd08a',3.5);sfx('rare');}

// ---------- the build page ----------
let stBuild=false;
function stDrawBuild(){
 const X=6,Y=36,Wd=210,Hd=118;ctx.fillStyle='#120d18';ctx.fillRect(X,Y,Wd,Hd);ctx.fillStyle='#e6bf73';ctx.fillRect(X,Y,Wd,1);
 txt('YOUR BUILD',X+5,Y+4,'#f0d499');{const s='SPENT '+stSpent()+' JADE';txt(s,X+Wd-5-txtW(s),Y+4,'#8a7a8a');}
 // masteries: one row per region with its three tiers
 STB.forEach((B,b)=>{const y=Y+15+b*9,o=stBranchOwned(b),tier=stTier(b);txt(B.n,X+5,y,stRGB[b]);
  for(let i=0;i<3;i++){const on=i<tier;ctx.fillStyle=on?stRGB[b]:'#2e2638';ctx.fillRect(X+44+i*7,y,5,5);}
  txt(o+'/'+stBranchSize(b),X+68,y,'#887');const nx=tier<3?MASTERY[b][tier][0]+' AT '+MASTERY_AT[tier]:'MASTERED';txt(nx.slice(0,25),X+92,y,tier<3?'#6a5e6a':stRGB[b]);});
 // totals and keystones
 const t=stTot(),lines=Object.keys(t).filter(k=>STAT_TXT[k]&&t[k]).map(k=>STAT_TXT[k](Math.round(t[k]*1000)/1000));
 const ks=SKT.nodes.filter(n=>n.big&&!n.free&&stLv(n.k)>0).map(n=>n.n);
 const all=wrapTxt(lines.join('.  ')+(ks.length?'.  KEYSTONES: '+ks.join(', '):''),50),pages=Math.max(1,Math.ceil(all.length/2)),pg=Math.floor(time/3)%pages;
 txt('BONUSES',X+5,Y+90,'#e6bf73');if(pages>1)txt((pg+1)+'/'+pages,X+Wd-18,Y+90,'#776');
 if(!lines.length&&!ks.length)txt('NOTHING LEARNED YET',X+5,Y+99,'#666');
 all.slice(pg*2,pg*2+2).forEach((l,i)=>txt(l,X+5,Y+99+i*8,'#ddd'));}

{const _ru=renderUpgrades;renderUpgrades=function(){_ru();
 // mastery pips under each region tab
 STB.forEach((_,b)=>{const box=stTab(b),tier=stTier(b);for(let i=0;i<3;i++){ctx.fillStyle=i<tier?stRGB[b]:'#2a2232';ctx.fillRect(box.x+box.w/2-7+i*5,box.y+box.h+1,4,2);}});
 if(stBuild)stDrawBuild();
 // respec confirmation
 if(stUI.respecT&&time-stUI.respecT<3){const s='PRESS R AGAIN TO REFUND '+stSpent()+' JADE';const w=txtW(s)+10,x=111-Math.floor(w/2);ctx.fillStyle='#2a1018';ctx.fillRect(x,126,w,11);ctx.fillStyle='#e06070';ctx.fillRect(x,126,w,1);txt(s,x+5,129,'#ffd0d0');}
 // the two new keys in the footer
 txt('B BUILD   R RESPEC',150,13,'#8a7a8a');};}
{const _uk=upgradesKey;upgradesKey=function(c){if(c==='KeyB'){stBuild=!stBuild;sfx('coin');return;}if(c==='KeyR'){stRespec();return;}if(stBuild&&c==='Escape'){stBuild=false;return;}return _uk(c);};}

// the temple's summary shows the mastery tier of each region as pips
{const _hs=skillHubSummary;skillHubSummary=function(row){_hs(row);STB.forEach((_,b)=>{const x=20+b*36,tier=stTier(b);for(let i=0;i<3;i++){ctx.fillStyle=i<tier?STB[b].c:'#2a2034';ctx.fillRect(x+20+i*5,147,4,3);}});};}

// ---------- what a node does to your totals: "POWER +19% > +22%" under its description ----------
{const _sd=stDetails;stDetails=function(n,route){_sd(n,route);if(!n.eff||stLv(n.k)>=n.max)return;const t=stTot(),ks=Object.keys(n.eff).filter(k=>STAT_TXT[k]);if(!ks.length)return;
 const k=ks[0],now=t[k]||0,next=now+n.eff[k],fmt=v=>STAT_TXT[k](Math.round(v*1000)/1000);
 const a=fmt(now).split(' ')[0],b=fmt(next).split(' ')[0],s='NOW '+(now?a:'0')+' > '+b;stCenter(s,221,92,119,'#8fd8a8');};}

// keystone ranks: three pips under each keystone on the map
{const _ru2=renderUpgrades;renderUpgrades=function(){_ru2.apply(this,arguments);if(stUI.catalog||stBuild)return;ctx.save();ctx.beginPath();ctx.rect(stView.x,stView.y,stView.w,stView.h);ctx.clip();
 for(const n of SKT.nodes){if(!n.big||n.free)continue;const [x,y]=stScreen(n.x,n.y),r=stRadius(n);if(x<stView.x-10||x>stView.x+stView.w+10||y<stView.y-10||y>stView.y+stView.h+10)continue;const lv=stLv(n.k);
  for(let i=0;i<n.max;i++){ctx.fillStyle='#07040a';ctx.fillRect(x-8+i*6,y+r+2,5,4);ctx.fillStyle=i<lv?stRGB[n.b]:'#3a3044';ctx.fillRect(x-7+i*6,y+r+3,3,2);}}
 ctx.restore();};}
