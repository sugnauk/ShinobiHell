'use strict';
// ===== TEMPLE TRIALS: feats that pay jade, once each =====
// Clear goals between runs (in the guide, TRIALS tab). Lifetime counters live in meta.life; finished trials in meta.trials.
meta.life=meta.life||{kills:0,perfect:0,grazes:0,bosses:0,nohit:0,elites:0,lanterns:0};meta.trials=meta.trials||{};
const TRIALS=[
 {k:'b1',n:'FIRST GUARDIAN',d:'BEAT ANY GUARDIAN',j:60,ok:()=>meta.life.bosses>=1},
 {k:'b6',n:'HALFWAY TO THE THRONE',d:'REACH STAGE VII',j:200,ok:()=>(meta.reached||0)>=6},
 {k:'win',n:'END THE EMPEROR',d:'WIN A RUN',j:500,ok:()=>(meta.wins||0)>=1},
 {k:'nh1',n:'UNTOUCHED',d:'BEAT A GUARDIAN WITHOUT BEING HIT',j:150,ok:()=>meta.life.nohit>=1},
 {k:'nh5',n:'PHANTOM DANCER',d:'BEAT 5 GUARDIANS WITHOUT BEING HIT',j:400,ok:()=>meta.life.nohit>=5},
 {k:'k500',n:'THINNING THE RANKS',d:'DEFEAT 500 FOES',j:120,ok:()=>meta.life.kills>=500},
 {k:'k3000',n:'ONE-PERSON ARMY',d:'DEFEAT 3000 FOES',j:350,ok:()=>meta.life.kills>=3000},
 {k:'pd50',n:'BLADE OF A HAIR',d:'50 PERFECT DODGES',j:120,ok:()=>meta.life.perfect>=50},
 {k:'pd300',n:'WIND THROUGH REEDS',d:'300 PERFECT DODGES',j:300,ok:()=>meta.life.perfect>=300},
 {k:'gz1000',n:'GRAZE ARTIST',d:'GRAZE 1000 BULLETS',j:200,ok:()=>meta.life.grazes>=1000},
 {k:'el25',n:'ELITE HUNTER',d:'DEFEAT 25 ELITES',j:150,ok:()=>meta.life.elites>=25},
 {k:'lan20',n:'LANTERN BREAKER',d:'BREAK 20 SPIRIT LANTERNS',j:100,ok:()=>meta.life.lanterns>=20},
 {k:'ks1',n:'A KEYSTONE',d:'LEARN A KEYSTONE IN THE TEMPLE',j:80,ok:()=>SKT.nodes.some(n=>n.big&&!n.free&&stLv(n.k)>0)},
 {k:'m3',n:'MASTER OF ONE',d:'REACH MASTERY III IN ANY REGION',j:300,ok:()=>STB.some((_,b)=>stTier(b)>=3)},
 {k:'heroes',n:'FULL ROSTER',d:'UNLOCK EVERY HERO',j:250,ok:()=>(meta.unlocked||2)>=CLASSES.length},
 {k:'evo9',n:'FINAL FORM',d:'REACH YOUR FINAL FORM IN A RUN',j:200,ok:()=>!!meta.life.evo9},
 {k:'rush',n:'GAUNTLET',d:'FINISH A BOSS RUSH OF 4 OR MORE GUARDIANS',j:300,ok:()=>meta.rushBest&&meta.rushBest.n>=4}];
function trialsCheck(){let paid=0;for(const t of TRIALS){if(meta.trials[t.k])continue;let ok=false;try{ok=t.ok();}catch(e){}if(!ok)continue;meta.trials[t.k]=1;meta.sen+=t.j;paid+=t.j;
  setToast('TRIAL COMPLETE: '+t.n+'  +'+t.j+' JADE','#5fd08a',4);sfx('rare');}if(paid)saveMeta();}
// counters
{const _ke=killE;killE=function(e){if(e&&!e.dead&&R&&!R.training&&!R.test){meta.life.kills++;if(e.elite)meta.life.elites++;if(e.lantern)meta.life.lanterns++;}return _ke.apply(this,arguments);};}
{const _g=graze;graze=function(q){if(R&&!R.training)meta.life.grazes++;return _g.apply(this,arguments);};}
{const _pd=perfectDodge;perfectDodge=function(){const n=R&&R.perfect;const r=_pd.apply(this,arguments);if(R&&!R.training&&R.perfect>n)meta.life.perfect++;return r;};}
{const _ob=onBossDead;onBossDead=function(e){if(R&&!R.training&&!R.test){meta.life.bosses++;if(!(e.hitsT>0))meta.life.nohit++;}const r=_ob.apply(this,arguments);trialsCheck();return r;};}
{const _ev=evolve;evolve=function(){const r=_ev.apply(this,arguments);if(P&&P.evo>=9){meta.life.evo9=1;trialsCheck();}return r;};}
{const _fr=finishRun;finishRun=function(win){const r=_fr.apply(this,arguments);trialsCheck();return r;};}
{const _sb=stBuy;stBuy=function(n){_sb(n);trialsCheck();};}
setTimeout(trialsCheck,1500);
// the guide gets a TRIALS tab
GTABS.push('TRIALS');if(typeof GTABC!=='undefined')GTABC.push('#5fd08a');if(typeof GTSUB!=='undefined')GTSUB.push('TRIAL');
{const _ge=guideEntries;guideEntries=function(tab){if(tab!==GTABS.length-1)return _ge(tab);
 return TRIALS.map(t=>{const done=!!meta.trials[t.k];return {n:(done?'':'')+t.n,u:true,col:done?'#5fd08a':'#9a8a9a',L:[t.d,'REWARD: '+t.j+' JADE',done?'COMPLETE':'NOT YET']};});};}
