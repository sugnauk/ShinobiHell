'use strict';
// HELL OF THE EMPEROR - extra items and legendaries (part of the former game.js; files load in numeric order, see index.html)
// ---------- extra items (incl. legendaries) ----------
ITEMS.push(
 {id:'dblow',name:'EXECUTIONER MARK',d:'HITS ON STUNNED FOES ARE DEATHBLOWS',g:'M',r:2},
 {id:'pierce',name:'PIERCING SEAL',d:'ALL YOUR SHOTS PIERCE +1',g:'J',r:1},
 {id:'frost',name:'FROST CHARM',d:'EVERY ATTACK MAY CHILL. 3 = FREEZE',g:'Y',r:1},
 {id:'shock',name:'STATIC SEAL',d:'EVERY HIT MAY SHOCK AND ARC',g:'Q',r:1},
 {id:'qpow',name:'ARCANE FOCUS',d:'+30% Q DAMAGE',g:'1',r:0},
 {id:'epow',name:'DRAGON SCALE',d:'+25% ULTIMATE POWER',g:'2',r:1},
 {id:'ecd',name:'SOUL EATER',d:'KILLS CHARGE ULT MORE',g:'3',r:1},
 {id:'vamp',name:'BLOOD PACT',d:'EVERY HIT HEALS 2% OF DAMAGE',g:'4',r:1},
 {id:'glass',name:'GLASS CANNON',d:'+40% POWER, -25% HP',g:'5',r:2},
 {id:'storm',name:'THUNDER DRUM',d:'+20% DMG TO BURNING/SHOCKED',g:'9',r:2},
 {id:'echo',name:'ECHO SEAL',d:'15% CHANCE TO CAST TWICE',g:'6',r:3},
 {id:'phoenix',name:'PHOENIX FEATHER',d:'+1 REVIVE. REVIVING EXPLODES',g:'7',r:3},
 {id:'flare',name:'AMATERASU EYE',d:'CRITS EXPLODE',g:'8',r:3},
);
ITEMS.forEach(i=>ITEMBY[i.id]=i);RCOL.push('#fd4');
