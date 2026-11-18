'use strict';
// SHINOBIDUNGEONS - tips stop the clock. A one-time tip used to slide up over the middle of the screen while the fight
// carried on behind it, so you could be shot while reading it. Now, when a tip appears, the game freezes (bullets hang
// in the air), a compact card sits at the top of the screen, and play resumes the moment you do what it suggests:
// press C to drink, dash, use an ability, take the bag... and that press also does the action. ENTER always works as
// "got it", and ESC still opens the pause menu.
const TIPACT={
 start:{k:['up','down','left','right'],say:'MOVE TO BEGIN'},
 pot:{k:['heal'],say:'PRESS {heal} TO DRINK'},
 hit:{k:['dash'],say:'PRESS {dash} TO DASH AWAY'},
 abil:{k:['q','w','f','e'],say:'PRESS {q} {w} {f} OR {e}'},
 boss:{k:['dash','up','down','left','right'],say:'MOVE OR DASH TO FIGHT'},
 event:{k:['dash','up','down','left','right'],say:'MOVE OR DASH TO SURVIVE'},
 elite:{k:['q','w','f','e'],mouse:1,say:'ATTACK TO FIGHT IT'},
 stun:{k:['q','w','f','e'],mouse:1,say:'ATTACK NOW'},
 bag:{k:['use','pack'],digits:1,say:'PRESS {use} TO TAKE IT ALL'},
 shop:{k:['use','up','down','left','right'],hold:['use'],say:'PRESS {use} OR MOVE TO CONTINUE'},
 shrine:{k:['use','up','down','left','right'],hold:['use'],say:'PRESS {use} OR MOVE TO CONTINUE'},
 curse:{k:['use','up','down','left','right'],hold:['use'],say:'PRESS {use} OR MOVE TO CONTINUE'}};
// hold: keys that only close the tip - they are not passed on, so closing the shop tip never buys anything, and closing
// the curse tip never accepts the curse
let TIPHOLD=null;const TIPQ=[];
const tipNow=()=>performance.now()/1000;
const tipSay=s=>s.replace(/\{(\w+)\}/g,(_,k)=>keyName(KB[k]));
tip=function(id,lines){if(OPT().tips===0||meta.tips[id]||!R||R.training)return;meta.tips[id]=1;saveMeta();
 const A=TIPACT[id]||{k:[],say:''};const h={id,lines,A,t0:tipNow()};if(TIPHOLD)TIPQ.push(h);else{TIPHOLD=h;sfx('tool');}};
function tipRelease(){TIPHOLD=null;mouse.down=false;if(TIPQ.length){TIPHOLD=TIPQ.shift();TIPHOLD.t0=tipNow();}}
// the world stands still while a tip is up (menus, the pause screen and the inventory are unaffected)
{const _u=update;update=function(dt){if(TIPHOLD&&mode==='play'&&!paused){const TH=TIPHOLD,age=tipNow()-TH.t0;
  // a key you are already holding (moving when the tip appears) also lets you carry on - the browser sends no new key
  // press for a held key, so without this the game would sit frozen until you let go and pressed it again
  const held=age>.6&&(TH.A.k||[]).some(k=>!(TH.A.hold||[]).includes(k)&&keys[KB[k]]);
  if((TH.A.mouse&&mouse.down&&age>.35)||held){tipRelease();}else return;}return _u.apply(this,arguments);};}
// the key it asks for releases it - and still does its job
{const _ok=onKey;onKey=function(c){const TH=TIPHOLD;if(TH&&mode==='play'&&!paused&&!invOpen){
  if(c==='Escape')return _ok.apply(this,arguments);
  if(tipNow()-TH.t0<.35)return; // a key already held down when the tip appeared doesn't skip it by accident
  const ok=c==='Enter'||TH.A.k.some(k=>KB[k]===c)||(TH.A.digits&&/^Digit[1-6]$/.test(c));if(!ok)return;
  tipRelease();if(c==='Enter'||(TH.A.hold&&TH.A.hold.some(k=>KB[k]===c)))return;}
 return _ok.apply(this,arguments);};}
// the card: at the top of the screen, out of the fight's way, with the action blinking
{const _rp=renderPlay;renderPlay=function(){_rp.apply(this,arguments);const TH=TIPHOLD;if(!TH||mode!=='play'||paused)return;const k=tipNow()-TH.t0;
 const L=TH.lines,act=tipSay(TH.A.say||''),w=Math.min(W-20,Math.max(...L.map(l=>txtW(l)),txtW(act)+20,120)+20),h=L.length*9+26,x=Math.round((W-w)/2),y=40-Math.round(Math.max(0,1-k/.2)*14);
 ctx.globalAlpha=Math.min(1,k/.15);ctx.fillStyle='rgba(12,8,20,.95)';ctx.fillRect(x,y,w,h);ctx.fillStyle='#ffd040';ctx.fillRect(x,y,w,1);ctx.fillRect(x,y+h-1,w,1);ctx.fillRect(x,y,2,h);
 txt('TIP - PAUSED',x+w-txtW('TIP - PAUSED')-5,y+3,'#ffd040');L.forEach((l,i)=>txt(l,x+8,y+6+i*9,i?'#ddd':'#fff'));
 const bl=Math.floor(k*3)%2,ay=y+h-11;if(act){ctx.fillStyle=bl?'#ffd040':'#c8a030';ctx.fillRect(x+6,ay-2,txtW(act)+8,10);txt(act,x+10,ay,'#14101a');}
 const g='ENTER: GOT IT';txt(g,x+w-txtW(g)-6,ay,'#888');ctx.globalAlpha=1;};}
// dying, leaving or a new stage clears anything still up
{const _ld=loadDungeon;loadDungeon=function(){TIPHOLD=null;TIPQ.length=0;return _ld.apply(this,arguments);};}
{const _fr=finishRun;finishRun=function(){TIPHOLD=null;TIPQ.length=0;return _fr.apply(this,arguments);};}
