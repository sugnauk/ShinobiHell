'use strict';
// SHINOBIDUNGEONS - every blink takes a breath. Blinks used to happen the instant the key went down, which read as a
// glitch rather than a move. Now each one has a short wind-up: the hero pinches into shadow for a moment (a little
// cloud of their colour gathers), and only then does the blink land; the cooldown starts when it lands. A second press
// during the wind-up does nothing.
//  SHADOW STEP (shinobi Q, and its no-target blink), KITSUNE STEP (wizard Q), BLOOD MIRROR (Chimiko E): 0.14s wind-up
//  LOTUS DANCE (Kagura R): a beat of 0.18s between blinks instead of 0.12s (in 179)
const BLINKS={'SHADOW STEP':{d:.14,col:'#9a7aff'},'KITSUNE STEP':{d:.14,col:'#ffcc66'},'BLOOD MIRROR':{d:.14,col:'#f65c76'}};
let blinkGo=0;
function blinkGate(k,fire){const p=P;if(!p||blinkGo)return false;const sp=SPELLS[k]&&SPELLS[k][p.lo[k]],B=sp&&BLINKS[sp.n];if(!B)return false;
 if(p.blinkWait)return true;if(slotCd(k)>0||p.stag>0||mode!=='play')return false;
 p.blinkWait={k,at:R.time+B.d,fire};p.iv=Math.max(p.iv||0,B.d+.05);
 ABPOSE={k:'blink',dur:B.d*2,p:1,t0:time,dir:scrVec(Math.cos(p.aim||0),Math.sin(p.aim||0))[0]<0?-1:1};
 for(let i=0;i<8;i++){const a=i/8*TAU;particles.push({x:p.x+Math.cos(a)*12,y:p.y+Math.sin(a)*12,vx:-Math.cos(a)*60,vy:-Math.sin(a)*60,t:B.d,col:i%2?B.col:'#14101a'});}
 return true;}
{const _cc=classCast;classCast=function(k){if(blinkGate(k,()=>classCast(k)))return;return _cc.apply(this,arguments);};}
{const _cq=castChain;castChain=function(){if(P&&CLS().k==='wizard'&&blinkGate('q',()=>castChain()))return;return _cq.apply(this,arguments);};}
{const _u=update;update=function(dt){_u.apply(this,arguments);const w=P&&P.blinkWait;if(!w||R.time<w.at)return;P.blinkWait=null;if(P.dying>0||mode!=='play')return;blinkGo=1;try{w.fire();}finally{blinkGo=0;}};}
{const _ld=loadDungeon;loadDungeon=function(){if(P)P.blinkWait=null;return _ld.apply(this,arguments);};}
