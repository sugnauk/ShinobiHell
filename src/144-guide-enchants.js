'use strict';
// SHINOBIDUNGEONS - the guide explains weapon enchants properly, in their own ENCHANTS tab, grouped by category:
//  ELEMENTAL (flame, frost, storm, venom) - status effects that build up on foes
//  FORCE     (blast, gale)               - spread damage and break guard
//  SUSTAIN   (leech)                     - keep you alive
//  COMBINATIONS                          - the reactions when two elements meet on one foe (overload, steam, superconduct)
// Each entry gives what it does, the numbers per stack, and what it combines with. The enchant entries leave the POWERS
// tab so they are not listed twice.
const ENCH_CATS=[
 {n:'ELEMENTAL',c:'#ff8a40',d:['STATUS EFFECTS THAT BUILD UP ON FOES.','TWO DIFFERENT ELEMENTS ON ONE FOE SET OFF A REACTION (SEE COMBINATIONS).'],
  ks:{fire:['BURNS THE FOE FOR 3S: DAMAGE EVERY SECOND (3 + 25% OF YOUR POWER).','CHANCE: 35% PER STACK, PER ABILITY HIT.','COMBOS: + STORM = OVERLOAD. + FROST = STEAM.'],
   frost:['CHILLS THE FOE FOR 3S. THREE CHILLS FREEZE IT SOLID (1.8S, 0.9S FOR GUARDIANS).','FROZEN FOES CANNOT ATTACK OR MOVE.','CHANCE: 30% PER STACK, PER ABILITY HIT.','COMBOS: + FLAME = STEAM. + STORM = SUPERCONDUCT.'],
   shock:['SHOCKS THE FOE FOR 2S AND ARCS TO FOES NEARBY.','CHANCE: 20% PER STACK, PER ABILITY HIT.','COMBOS: + FLAME = OVERLOAD. + FROST = SUPERCONDUCT.'],
   poison:['POISONS EVERY FOE YOUR ABILITIES HIT, EVERY TIME: 4S OF DAMAGE OVER TIME.','REPEATED HITS STACK THE POISON HIGHER (UP TO 4 + 120% OF YOUR POWER PER SECOND).','ONE STACK IS ENOUGH: IT ALWAYS APPLIES. GREAT AGAINST GUARDIANS.']}},
 {n:'FORCE',c:'#ffd040',d:['SPREAD YOUR DAMAGE AND BREAK GUARD. BEST IN CROWDS.'],
  ks:{blast:['EVERY ABILITY HIT SPLASHES 30% OF ITS DAMAGE ONTO FOES AROUND THE TARGET (PER STACK).','THE SPLASH DOES NOT SPLASH AGAIN.','TURNS SINGLE-TARGET ABILITIES INTO CROWD CLEARERS.'],
   gale:['ABILITY HITS SHOVE FOES AWAY FROM YOU AND DEAL +50% STUN (PER STACK).','FILLS THE YELLOW STUN BAR FASTER: STUNNED FOES TAKE +50% DAMAGE.','GUARDIANS ARE NOT SHOVED, BUT STILL TAKE THE EXTRA STUN.']}},
 {n:'SUSTAIN',c:'#50e060',d:['KEEP YOURSELF ALIVE THROUGH LONG FIGHTS.'],
  ks:{leech:['ABILITY HITS HEAL YOU FOR 2% OF THE DAMAGE THEY DEAL (PER STACK).','PAIRS WELL WITH BLAST: EVERY SPLASHED FOE HEALS YOU TOO.']}}];
const ENCH_REACT=[['OVERLOAD','#ffd040',['FLAME MEETS STORM.','AN EXPLOSION AROUND THE FOE: 160% OF YOUR POWER TO EVERYTHING NEARBY.','CLEARS BOTH EFFECTS.']],
 ['STEAM','#dde4ee',['FLAME MEETS FROST.','A CLOUD OF STEAM: 130% OF YOUR POWER AROUND THE FOE. NEARBY FOES ARE STUNNED 1.4S AND BLINDED (THEIR SHOTS GO WILD).']],
 ['SUPERCONDUCT','#88eeff',['STORM MEETS FROST.','A SURGE: 110% OF YOUR POWER AROUND THE FOE AND A HUGE STUN HIT THAT BREAKS GUARD.','THE BEST WAY TO STAGGER A GUARDIAN.']]];
const ENCH_RULES=['ENCHANTS ARE BOUND TO YOUR WEAPON. SWAP WEAPONS AND THEY STAY ON THE OLD ONE.','THEY TRIGGER ON ABILITY HITS: RMB, Q, E, F AND R. NOT ON YOUR BASIC LMB ATTACK.',
 'DUPLICATES STACK (II, III...): MORE STACKS, STRONGER EFFECT. YOU CAN HOLD UP TO '+ENCHMAX+' IN TOTAL.','FIND THEM IN BAGS AND CHESTS, OR BUY THEM FROM THE TRADER.'];
{const at=GTABS.indexOf('CHRONICLE'),ix=at<0?(GTABS.indexOf('TRIALS')<0?GTABS.length:GTABS.indexOf('TRIALS')):at;GTABS.splice(ix,0,'ENCHANTS');
 if(typeof GTABC!=='undefined')GTABC.splice(ix,0,'#ff8a40');if(typeof GTSUB!=='undefined')GTSUB.splice(ix,0,'ENCHANT');
 const _ge=guideEntries;guideEntries=function(tab){
  if(GTABS[tab]==='POWERS')return _ge(tab).filter(e=>!/^ENCHANT /.test(e.n));
  if(GTABS[tab]!=='ENCHANTS')return _ge(tab);
  const g=meta.guide||{},has=k=>!!(g.n&&g.n[k]),L=[];
  L.push({n:'HOW ENCHANTS WORK',u:true,col:'#ffffff',L:ENCH_RULES});
  for(const C of ENCH_CATS){L.push({n:'== '+C.n+' ==',u:true,col:C.c,L:C.d.concat(['IN THIS GROUP: '+Object.keys(C.ks).map(k=>ENCH.find(e=>e.k===k).n).join(', ')])});
   for(const k in C.ks){const E=ENCH.find(e=>e.k===k);if(!E)continue;const u=has(k);
    L.push({n:'  '+E.n,u,col:E.c||C.c,L:u?['CATEGORY: '+C.n].concat(C.ks[k]):['FIND THE '+E.n+' ENCHANT TO LEARN ABOUT IT ('+C.n+')']});}}
  L.push({n:'== COMBINATIONS ==',u:true,col:'#c080ff',L:['TWO ELEMENTS ON THE SAME FOE REACT. EACH FOE CAN REACT ONCE EVERY 0.8S.','MIX FLAME, FROST AND STORM ON ONE WEAPON TO TRIGGER THEM OFTEN.']});
  for(const [n,c,l] of ENCH_REACT)L.push({n:'  '+n,u:true,col:c,L:l});
  return L;};}
