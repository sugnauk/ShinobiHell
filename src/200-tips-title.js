'use strict';
// SHINOBIDUNGEONS - tips and the title screen.
//  - ABILITIES: a tip early in the first fight of a run says it plainly: use your abilities as often as you can. Every
//    ability tooltip ends with the same advice.
//  - BOSS RUSH LAG: the main menu's boss rush panel rebuilt every guardian's full posed sheet on every frame (the posed
//    art is drawn from code, so bossSheet() is expensive). Each guardian's sheet is now built once and kept.
//  - TITLE: the text is rewritten for the game as it is now: the march, the heroes, the stages beyond the throne, one
//    clear prompt, and a footer that cycles through useful tips.
// ---- ability use ----
TIPACT.abil2=TIPACT.abil;
{let fightT=0;const _u=update;update=function(dt){_u.apply(this,arguments);if(!R||R.training||R.rush||mode!=='play'||!P||meta.tips.abil2)return;
 const fighting=enemies.some(e=>!e.dead&&e.awake&&!e.prop&&Math.hypot(e.x-P.x,e.y-P.y)<170);
 if(fighting){fightT+=dt;if(fightT>3)tip('abil2',['USE YOUR ABILITIES - OFTEN','Q, '+KN('w')+', '+KN('f')+' AND '+KN('e')+' ARE YOUR STRONGEST ATTACKS AND RECHARGE QUICKLY. USE EACH ONE THE MOMENT IT IS READY: AN ABILITY WAITING ON THE BAR IS DAMAGE YOU ARE NOT DOING.']);}else fightT=0;};}
{const _si=spellInfo;spellInfo=function(k){const out=_si.apply(this,arguments);if('hqwfe'.includes(k))out.push({s:k==='e'?'USE IT IN EVERY BIG FIGHT: IT WILL BE READY AGAIN SOON.':'USE IT EVERY TIME IT IS READY. COOLDOWNS ARE SHORT.',c:'#ffd080'});return out;};}
// ---- boss rush menu lag: build each guardian's sheet once ----
const BSHEETC={};
{const _bs=bossSheet;bossSheet=function(i){const b=BOSS[i];if(!b)return _bs.apply(this,arguments);const key=i+'|'+b.name+'|'+(ARTHURT?1:0)+'|'+(typeof PRO_ON!=='undefined'&&PRO_ON?1:0);
 return BSHEETC[key]||(BSHEETC[key]=_bs.apply(this,arguments));};}
// ---- the title screen ----
const TITLE_TIPS=['USE YOUR ABILITIES THE MOMENT THEY ARE READY','DASH THROUGH BULLETS: YOU CANNOT BE HIT WHILE DASHING',
 'FILL A FOE\'S STUN BAR, THEN PUNISH THE STUN','GUARDIANS YOU HAVE BEATEN RETURN AS ECHOES IN LATER DUNGEONS',
 'GRAZE BULLETS FOR SCORE: CLOSE IS GOOD, TOUCHING IS NOT','K OPENS THE GUIDE: EVERY FOE, RELIC AND GUARDIAN YOU HAVE MET',
 'EVERY HERO HAS A CHALLENGE THAT UNLOCKS THE NEXT','BEAT THE EMPEROR, THEN DESCEND - IF YOU DARE'];
renderTitle=function(){
 bg();ctxt('SHINOBI',6,'#e0b040',2);
 {const fl=Math.floor(time*8)%9===0;ctxt('DUNGEONS',19,fl?'#ff6040':'#e02838',5);}
 ctx.fillStyle='#e0b040';ctx.fillRect(Math.round(W/2-100),48,200,1);ctx.fillStyle='#a02030';ctx.fillRect(Math.round(W/2-70),50,140,1);
 ctxt(CLASSES.length+' HEROES. THREE PROLOGUES. TWELVE STAGES TO THE EMPEROR\'S THRONE.',55,'#ddd');
 ctxt('BEYOND IT: STARFALL, ECLIPSE, AND AN ABYSS WITH NO FLOOR.',64,'#a898c8');
 if(Math.floor(time*2)%2===0)ctxt('- PRESS ENTER OR CLICK TO BEGIN -',76,'#fff');
 {const s=savedRun();if(s){ctxt('C  CONTINUE YOUR RUN: '+ROMAN[s.R.di]+'. '+DUN[s.R.di].name,87,'#8cf');ctxt('O  OPTIONS',96,'#999');}else ctxt('O  OPTIONS',87,'#999');}
 const t=TITLE_TIPS[Math.floor(time/4)%TITLE_TIPS.length];ctxt('TIP: '+t,H-9,'#c8a0ff');
 txt('V'+GAME_VERSION,W-4-txtW('V'+GAME_VERSION),H-9,'#666');
 txt('T: TEST',4,H-9,'#3a3446');};
