'use strict';
// SHINOBIDUNGEONS - a stacked build still has to respect a guardian.
// A run that hoards relics, enchants, elixirs and skill-tree points ended up shredding guardians and taking single-digit
// hits: flat defence plus Iron Body could cut every hit to a third.
//  1. Armour has a floor: whatever you stack, a hit always does at least half its damage (it was a third).
//  2. Guardians always hurt: a hit from a guardian or anything it summons does at least 4% of your max health
//     (bullets) or 8% (blows, charges, hazards), scaled by difficulty. Wards, shields, dodges and dashes still stop it.
// Guardian health is NOT scaled to your power: a god run should still shred them. Only the damage you take is kept honest.
const ARMOUR_FLOOR=.5,GUARD_BULLET=.04,GUARD_BLOW=.08;
{const _hp=hitPlayer;hitPlayer=function(raw,x,y,o){if(!P||!R||R.training)return _hp.apply(this,arguments);o=o||{};const shield0=P.ironBellyShield||0,hp0=P.hp,stag=P.stag>0,nt=texts.length;
 const r=_hp.apply(this,arguments);const lost=hp0-P.hp;if(!(lost>0)||P.dying)return r;
 const rawS=raw*(1+.25*(R.curse||0))*DF().dmg*(stag?1.4:1)*(o.peril?1.5:1);let floor=rawS*ARMOUR_FLOOR;
 const src=o.src,guard=src&&(src.boss||(src.bossOwned&&src.bossOwned.boss)||(boss&&src.room===boss.room&&!boss.dead&&boss.awake));
 if(guard&&!(PRO_ON))floor=Math.max(floor,S.maxhp*(o.bullet?GUARD_BULLET:GUARD_BLOW)*DF().dmg);
 floor-=shield0-(P.ironBellyShield||0);
 if(lost<floor){const extra=floor-lost;P.hp-=extra;
  for(let i=texts.length-1;i>=nt;i--)if(/^\d+$/.test(texts[i].s)){texts[i].s=String(Math.round(floor));break;}
  if(P.hp<=0&&!P.dying){P.deathCause=P.deathCause||(o.bullet?'ENEMY PROJECTILE':o.peril?'ARENA HAZARD':'ENEMY ATTACK');die();if(!P.dying)P.deathCause=null;}}
 return r;};}
