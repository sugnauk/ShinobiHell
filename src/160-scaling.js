'use strict';
// SHINOBIDUNGEONS - a stacked build still has to respect a guardian.
// A run that hoards relics, enchants, elixirs and skill-tree points ended up shredding guardians and taking single-digit
// hits: flat defence plus Iron Body could cut every hit to a third, and guardian health never looked at your power.
//  1. Armour has a floor: whatever you stack, a hit always does at least half its damage (it was a third).
//  2. Guardians always hurt: a hit from a guardian or anything it summons does at least 4% of your max health
//     (bullets) or 8% (blows, charges, hazards), scaled by difficulty. Wards, shields, dodges and dashes still stop it.
//  3. Guardians rise to your strength: when a guardian wakes it compares your power to what a well-equipped hero has
//     at that stage; for every 10% you are above it, it gains 6% health (up to double). A blank hero meets the guardian
//     as it always was. The prologue and the training trials are left alone.
const ARMOUR_FLOOR=.5,GUARD_BULLET=.04,GUARD_BLOW=.08;
{const _hp=hitPlayer;hitPlayer=function(raw,x,y,o){if(!P||!R||R.training)return _hp.apply(this,arguments);o=o||{};const hp0=P.hp,stag=P.stag>0,nt=texts.length;
 const r=_hp.apply(this,arguments);const lost=hp0-P.hp;if(!(lost>0)||P.dying)return r;
 const rawS=raw*(1+.25*(R.curse||0))*DF().dmg*(stag?1.4:1)*(o.peril?1.5:1);let floor=rawS*ARMOUR_FLOOR;
 const src=o.src,guard=src&&(src.boss||(src.bossOwned&&src.bossOwned.boss)||(boss&&src.room===boss.room&&!boss.dead&&boss.awake));
 if(guard&&!(PRO_ON))floor=Math.max(floor,S.maxhp*(o.bullet?GUARD_BULLET:GUARD_BLOW)*DF().dmg);
 if(lost<floor){const extra=floor-lost;P.hp-=extra;
  for(let i=texts.length-1;i>=nt;i--)if(/^\d+$/.test(texts[i].s)){texts[i].s=String(Math.round(floor));break;}
  if(P.hp<=0&&!P.dying){P.deathCause=P.deathCause||(o.bullet?'ENEMY PROJECTILE':o.peril?'ARENA HAZARD':'ENEMY ATTACK');die();if(!P.dying)P.deathCause=null;}}
 return r;};}
// what a well-equipped hero's power is on reaching each stage's guardian (measured with the balance bench)
const EXPATK=di=>26+2.6*di;
function guardianScale(e){if(e._scaled||!S||!R||R.training||PRO_ON||e.r7)return;e._scaled=1;const ratio=S.atk/EXPATK(e.di||0);
 const k=clamp(1+.6*(ratio-1),1,2);if(k<=1.02)return;e.maxhp*=k;e.hp*=k;e.scaleK=k;
 if(e.guards)for(const g of e.guards){g.maxhp*=k;g.hp*=k;}
 setToast(e.name.split(',')[0]+' RISES TO YOUR STRENGTH  (+'+Math.round((k-1)*100)+'% HEALTH)','#ff9040',3);}
{const _u=update;update=function(dt){_u.apply(this,arguments);if(mode!=='play'||!boss||boss.dead||!boss.awake||boss._scaled)return;if(typeof introT!=='undefined'&&introT>0)return;guardianScale(boss);};}
