'use strict';
// SHINOBIDUNGEONS - VETERAN: every run a hero wins makes that hero's next marches a little harder (and better paid).
// Veteran level = the hero's wins, up to V. Each level: foes and guardians +8% health, their hits +5% damage, and +10%
// jade at the end of the run. It is per hero: a fresh hero always starts at the game as designed. It does not apply to
// the prologue, training, the daily challenge or boss rush. Your power is never looked at: a god run stays a god run.
const VETMAX=5,VET_HP=.08,VET_DMG=.05,VET_JADE=.1;
const vetLevel=k=>Math.min(VETMAX,((meta.cst&&meta.cst[k])||{}).wins||0);
const vetDesc=v=>'FOES +'+Math.round(v*VET_HP*100)+'% HEALTH, +'+Math.round(v*VET_DMG*100)+'% DAMAGE  /  +'+Math.round(v*VET_JADE*100)+'% JADE';
let VETPEND=0,RUSHING=false;
const vetNow=()=>(typeof PRO_ON!=='undefined'&&PRO_ON)?0:(R&&R.vet!=null?R.vet:VETPEND); // never in the prologue
if(typeof startRush==='function'){const _sr=startRush;startRush=function(){RUSHING=true;try{return _sr.apply(this,arguments);}finally{RUSHING=false;}};}
{const _st=startRun;startRun=function(di,cont){const skip=trainNext||RUSHING||(typeof DPEND!=='undefined'&&DPEND);
 VETPEND=cont?((()=>{try{const sv=savedRun();return (sv&&sv.R&&sv.R.vet)||0;}catch(_){return 0;}})()):skip?0:vetLevel(CLASSES[meta.cls]?CLASSES[meta.cls].k:'');let r;try{r=_st.apply(this,arguments);}finally{const v=VETPEND;VETPEND=0;if(R&&!cont)R.vet=v;}
 if(R&&R.vet)setTimeout(()=>{if(mode==='play')setToast('VETERAN '+ROMAN[R.vet-1]+' - '+vetDesc(R.vet),'#ff9040',3.5);},1200);return r;};}
{const _mk=mkEnemy;mkEnemy=function(){const e=_mk.apply(this,arguments);const v=vetNow();if(e&&v&&!(R&&R.training)){e.hp*=1+v*VET_HP;e.maxhp*=1+v*VET_HP;}return e;};}
{const _mb=mkBoss;mkBoss=function(){const b=_mb.apply(this,arguments);const v=vetNow();if(b&&v){b.hp*=1+v*VET_HP;b.maxhp*=1+v*VET_HP;}return b;};}
{const _hp=hitPlayer;hitPlayer=function(raw){const v=vetNow();if(v&&R&&!R.training){const a=[...arguments];a[0]=raw*(1+v*VET_DMG);return _hp.apply(this,a);}return _hp.apply(this,arguments);};}
// better paid: more jade (counted from the run's gold) when the run ends, win or lose
{const _fr=finishRun;finishRun=function(win){if(R&&R.vet&&!(R.pro&&!win)&&!R._vetPaid){R._vetPaid=1;R.sen=Math.round((R.sen||0)*(1+R.vet*VET_JADE));}return _fr.apply(this,arguments);};}
// character select: the hero's veteran level under its mastery plate
{const _rs=renderSelect;renderSelect=function(){_rs.apply(this,arguments);if(selTab!==0)return;const C=CLASSES[selIdx];if(!C||isLocked(selIdx))return;const v=vetLevel(C.k),X=MM.PX+6,Y=8+128+40+52;
 if(!v){txt('VETERAN: WIN A RUN TO RAISE THE STAKES',X,Y,'#666');return;}txt('VETERAN '+ROMAN[v-1]+(v>=VETMAX?' (MAX)':''),X,Y,'#ff9040');txt(vetDesc(v),X,Y+8,'#aaa');};}
// in-run: a small mark under the stage name
{const _h=drawHUD;drawHUD=function(){_h.apply(this,arguments);if(mode!=='play'||!R||!R.vet)return;const s='VETERAN '+ROMAN[R.vet-1];txt(s,W-txtW(s)-6,H-56,'#ff9040');};}
