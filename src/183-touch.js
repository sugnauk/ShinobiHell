'use strict';
// SHINOBIDUNGEONS - play on a phone or tablet. Touch controls switch on at the first touch on the screen and stay off
// otherwise: on a PC nothing here runs, draws or listens beyond a single flag check, so PC performance is untouched.
// (A touchscreen laptop gets them only while you use touch; moving a real mouse hides them again.)
//  LEFT SIDE     a floating stick: put a thumb down anywhere and drag to move (smooth, any direction)
//  RIGHT SIDE    the buttons, large and spread over the whole right side: DASH (biggest, in the corner), then an inner
//                arc of HEAVY (hold to charge, like RMB), Q, E, F and an outer arc of R (the ultimate), POTION and USE
//  TOP RIGHT     PAUSE, BAG and SWAP weapon
//  AUTO-AIM and AUTO-ATTACK  always on: the aim rests on the nearest foe, every ability fires at it, and the basic
//                attack fires on its own whenever a foe is in reach (no aim stick to hold)
//  TIPS          the buttons stay up during a tip; the ones it asks for pulse, and tapping one does it (tapping
//                anywhere else closes the tip)
//  The ability bar along the bottom is hidden on touch: the buttons show the same cooldowns
//  MENUS         taps act as clicks everywhere outside a fight: menus, the bag, the shop, reward cards, the pause menu
// The fullscreen button is available in menus and during play. Portrait play shows a notice to turn the device.
let TOUCH=false,TOUCHAT=-9;const TCH={stick:null,aim:null,btn:new Map(),aimDir:null};
const touchActive=()=>TOUCH&&mode==='play'&&!paused&&!invOpen&&P&&!(P.dying>0);
const smallTouchScreen=()=>Math.min(innerWidth,innerHeight)<520;
// Near on a phone uses a 240px camera instead of 252px, about 5% larger at the same screen size.
{const base=viewH;viewH=function(){const height=base();
 return TOUCH&&mode==='play'&&smallTouchScreen()&&height===VIEWHS[0]?240:height;
};}
// the buttons, placed from the bottom-right corner; r is the touch radius in game pixels
const TOUCHLAY={cx:-40,cy:-38,inR:80,outR:142,dash:24,ab:18,ult:21,small:14};
function touchButtons(){const L=TOUCHLAY,cx=W+L.cx,cy=H+L.cy,ring=(ang,rad)=>[cx+Math.cos(ang*Math.PI/180)*rad,cy+Math.sin(ang*Math.PI/180)*rad];
 const at=(ang,rad,o)=>{const [x,y]=ring(ang,rad);return Object.assign({x,y},o);};
 return [{id:'dash',l:'DASH',x:cx,y:cy,r:L.dash,key:()=>KB.dash,col:'#9cdfff',act:'dash'},
  at(180,L.inR,{id:'heavy',l:'RMB',slot:'h',r:L.ab,hold:'rdown',col:'#ffd080'}),
  at(214,L.inR,{id:'q',l:'Q',slot:'q',r:L.ab,key:()=>KB.q,aimFirst:1,act:'q'}),
  at(248,L.inR,{id:'w',l:'E',slot:'w',r:L.ab,key:()=>KB.w,aimFirst:1,act:'w'}),
  at(276,L.inR,{id:'f',l:'F',slot:'f',r:L.ab,key:()=>KB.f,aimFirst:1,act:'f'}),
  at(190,L.outR,{id:'e',l:'R',slot:'e',r:L.ult,key:()=>KB.e,aimFirst:1,col:'#ffd040',act:'e'}),
  at(224,L.outR,{id:'heal',l:'POT',r:L.small,key:()=>KB.heal,col:'#ff7070',act:'heal'}),
  at(254,L.outR,{id:'use',l:'USE',r:L.small,key:()=>KB.use,col:'#c8f0a0',act:'use'}),
  {id:'pause',l:'II',x:W-14,y:14,r:10,key:()=>'Escape',top:1},
  {id:'pack',l:'BAG',x:W-38,y:14,r:10,key:()=>KB.pack,top:1,act:'pack'},
  {id:'swap',l:'SWAP',x:W-64,y:14,r:10,key:()=>KB.swap,top:1}];}
const toCanvas=t=>{const r=cv.getBoundingClientRect();return {x:(t.clientX-r.left)/r.width*W,y:(t.clientY-r.top)/r.height*H};};
function touchHit(p,pad){for(const b of touchButtons())if(Math.hypot(p.x-b.x,p.y-b.y)<=b.r+(pad||3))return b;return null;}
function touchAimAt(e){mouse.x=W/2+sx(e.x,e.y)-sx(P.x,P.y);mouse.y=H/2+6+sy(e.x,e.y)-sy(P.x,P.y);P.aim=angTo(P,e);}
function touchPress(b){if(b.aimFirst&&!TCH.aim){const e=touchTarget(TOUCHAIM);if(e)touchAimAt(e);}
 if(b.hold==='rdown'){mouse.rdown=true;return;}const k=b.key();if(!k)return;keys[k]=true;onKey(k);}
function touchRelease(b){if(b.hold==='rdown'){mouse.rdown=false;return;}const k=b.key();if(k)keys[k]=false;}
function touchOn(){if(TOUCH)return;TOUCH=true;cv.style.touchAction='none';document.body.style.touchAction='none';
 cv.style.cursor='none';
 // a closer default zoom suits a small screen (only if you never picked one yourself)
 if(meta&&meta.opt&&meta.opt.zoom==null&&smallTouchScreen())meta.opt.zoom=0;
 setView(VIEWWIDE);updateTouchDisplay();}
addEventListener('touchstart',e=>{TOUCHAT=performance.now();touchOn();
 if(touchDisplay.contains(e.target))return;
 if(mode==='master'&&e.changedTouches.length){
  e.preventDefault();const p=toCanvas(e.changedTouches[0]);mouse.x=p.x;mouse.y=p.y;masterClick();return;
 }
 if(!touchActive()){
  // outside a fight: taps work as clicks; the top buttons still work in the bag and the pause menu
  if(mode==='play'&&TIPHOLD&&!paused&&!invOpen){e.preventDefault();onKey('Enter');return;}
  if(mode==='play'&&(invOpen||paused)){for(const t of e.changedTouches){const b=touchHit(toCanvas(t));if(b&&b.top){e.preventDefault();touchPress(b);touchRelease(b);return;}}}
  return;}
 e.preventDefault();
 if(TIPHOLD){for(const t of e.changedTouches){const b=touchHit(toCanvas(t),6);if(b&&!b.top){TCH.btn.set(t.identifier,b);touchPress(b);return;}}onKey('Enter');return;}
 for(const t of e.changedTouches){const p=toCanvas(t),b=touchHit(p,6);
  if(b){TCH.btn.set(t.identifier,b);touchPress(b);continue;}
  // the move stick: anywhere left of the buttons
  if(p.x<W*.62&&!TCH.stick)TCH.stick={id:t.identifier,ox:p.x,oy:p.y,x:p.x,y:p.y};}},{passive:false});
addEventListener('touchmove',e=>{if(!TOUCH||!touchActive()||touchDisplay.contains(e.target))return;e.preventDefault();
 for(const t of e.changedTouches){const p=toCanvas(t);for(const s of [TCH.stick,TCH.aim])if(s&&s.id===t.identifier){s.x=p.x;s.y=p.y;}}},{passive:false});
const touchEnd=e=>{if(!TOUCH||touchDisplay.contains(e.target))return;if(touchActive())e.preventDefault();
 for(const t of e.changedTouches){const b=TCH.btn.get(t.identifier);if(b){touchRelease(b);TCH.btn.delete(t.identifier);}
  if(TCH.stick&&TCH.stick.id===t.identifier)TCH.stick=null;
}};
addEventListener('touchend',touchEnd,{passive:false});addEventListener('touchcancel',touchEnd,{passive:false});
// a real mouse moving (not one the browser made up from a tap) hands control back to the PC
addEventListener('mousemove',()=>{if(TOUCH&&performance.now()-TOUCHAT>1500){TOUCH=false;TCH.stick=TCH.aim=null;TCH.btn.clear();setView(VIEWWIDE);updateTouchDisplay();}});
// movement: the stick gives a smooth direction instead of the eight of the keys
{const _mv=moveVec;moveVec=function(){const s=TOUCH&&touchActive()&&TCH.stick;if(!s)return _mv.apply(this,arguments);
 let dx=s.x-s.ox,dy=s.y-s.oy;const l=Math.hypot(dx,dy);if(l<4)return [0,0];if(l>22){s.ox=s.x-dx/l*22;s.oy=s.y-dy/l*22;}const k=Math.min(1,l/16);dx=dx/l*k;dy=dy/l*k;
 // the same screen-to-world turn the keys use
 return unrot((dx+dy)*.7071,(dy-dx)*.7071);};}
// A tapped ability can aim past melee reach. Auto-fire uses the equipped basic's own reach, never more than TOUCHCAP:
// weapons with very long reach (bows, guns, needles: ~170px) are trimmed so auto-aim never snipes from off the edge of the
// action, while every basic still fires at the distance it is played at. A basic not in the table below learns its reach
// from its first shot (speed x life of the shot it fires).
const TOUCHAIM=130,TOUCHCAP=150,TOUCH_REACH={};
const TOUCH_BASICS={
 0:()=>215*.55*(1+S.rangeM)+9,1:()=>220*.3*(1+S.rangeM)+2,
 4:()=>(P.combo===1&&R.time-P.lastSw<.75?40:32)*(1.12+S.rangeM*.5),8:()=>48*(1.12+S.rangeM*.5),9:()=>40*(1.12+S.rangeM*.5),
 13:()=>62*(1.12+S.rangeM*.5)+16,14:()=>38*AZ(),17:()=>70*(1.12+S.rangeM*.5)+16,
 [SUMO_KIT.m]:()=>250*.13*(1+S.rangeM*.4)+5,
 [CLASSES.find(c=>c.k==='kagura').kit.m]:()=>P.flowBoost>R.time?44:36,
 [CLASSES.find(c=>c.k==='bellwarden').kit.m]:()=>37};
function touchTarget(range,edge=false){let best=null,bd=Infinity;for(const e of enemies){if(!kitFoe(e))continue;
 const d=Math.hypot(e.x-P.x,e.y-P.y);if(d>=bd||d>range+(edge?e.r:0))continue;
 const x=sx(e.x,e.y),y=sy(e.x,e.y);if(x>=0&&x<W&&y>=0&&y<H&&los(P.x,P.y,e.x,e.y)){bd=d;best=e;}}return best;}
{const _fire=wantFire;wantFire=function(){return TOUCH?mouse.down:_fire();};}
{const _u=update;update=function(dt){if(touchActive()&&!TIPHOLD){const reach=Math.min(TOUCHCAP,TOUCH_BASICS[P.lo.m]?.()??TOUCH_REACH[P.lo.m]??TOUCHAIM),
  t=touchTarget(mouse.rdown?TOUCHAIM:reach,!mouse.rdown);if(t)touchAimAt(t);mouse.down=!!t&&!mouse.rdown;}
 else if(TOUCH&&mode==='play')mouse.down=false;return _u.apply(this,arguments);};}
{const _hs=hoverSlot;hoverSlot=function(){if(TOUCH)return null;return _hs.apply(this,arguments);};}
// drawing: sticks and buttons, faint so they never hide the fight; a button dims and counts down while it recharges
function touchDraw(){if(!TOUCH||mode!=='play'||!P)return;const top=paused||invOpen,ask=TIPHOLD&&TIPHOLD.A?TIPHOLD.A.k||[]:[];
 for(const b of touchButtons()){if(top&&!b.top)continue;
  const cd=b.slot?slotCd(b.slot):b.id==='dash'?P.dashCd||0:0,held=[...TCH.btn.values()].includes(b)||(b.hold==='rdown'&&mouse.rdown),col=b.col||'#e8e8f0',asked=b.act&&ask.includes(b.act);
  ctx.globalAlpha=held?.55:.32;ctx.fillStyle='#000';ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,TAU);ctx.fill();
  ctx.globalAlpha=cd>0?.4:held?1:.8;ctx.strokeStyle=col;ctx.lineWidth=held?2:1;ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,TAU);ctx.stroke();ctx.lineWidth=1;
  // the cooldown sweeps round the rim
  if(cd>0&&b.slot){const mx=b.slot==='h'?spellCd('h'):spellCd(b.slot);ctx.globalAlpha=.85;ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();ctx.arc(b.x,b.y,b.r-2,-Math.PI/2,-Math.PI/2+TAU*(1-Math.min(1,cd/(mx||1))));ctx.stroke();ctx.lineWidth=1;}
  if(b.slot==='h'&&P.hCh>0){ctx.globalAlpha=.9;ctx.strokeStyle='#ffd040';ctx.lineWidth=2;ctx.beginPath();ctx.arc(b.x,b.y,b.r-2,-Math.PI/2,-Math.PI/2+TAU*Math.min(1,P.hCh/HCHARGE));ctx.stroke();ctx.lineWidth=1;}
  if(asked){const pu=.5+.5*Math.sin(time*10);ctx.globalAlpha=.6+.4*pu;ctx.strokeStyle='#ffffff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(b.x,b.y,b.r+3+2*pu,0,TAU);ctx.stroke();ctx.lineWidth=1;}
  const s=cd>.05&&b.slot?String(Math.ceil(cd)):b.l,big=b.r>=16&&s.length<=4;ctx.globalAlpha=cd>0?.55:1;txt(s,Math.round(b.x-txtW(s,big?2:1)/2),Math.round(b.y-(big?6:3)),cd>0?'#aaa':col,big?2:1);
  if(b.id==='heal'&&R)txt(String(R.pots),Math.round(b.x+b.r-6),Math.round(b.y+b.r-8),'#fff');}
 ctx.globalAlpha=1;if(top||TIPHOLD)return;
 const s=TCH.stick;if(s){ctx.globalAlpha=.3;ctx.strokeStyle='#ffffff';ctx.beginPath();ctx.arc(s.ox,s.oy,22,0,TAU);ctx.stroke();
  const dx=s.x-s.ox,dy=s.y-s.oy,l=Math.hypot(dx,dy)||1,m=Math.min(l,22);ctx.globalAlpha=.55;ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(s.ox+dx/l*m,s.oy+dy/l*m,8,0,TAU);ctx.fill();}
 ctx.globalAlpha=1;}
// the ability bar, potion and enchants along the bottom right are hidden on touch: the buttons stand in their place
{const _h=drawHUD;drawHUD=function(){if(!TOUCH||mode!=='play')return _h.apply(this,arguments);const x0=slotX(0)-28,y0=H-50;
 ctx.save();ctx.beginPath();ctx.rect(0,0,W,H);ctx.rect(x0,y0,W-x0,H-y0);ctx.clip('evenodd');try{return _h.apply(this,arguments);}finally{ctx.restore();}};}
// held upright, ask for landscape
function touchPortrait(){if(!TOUCH||innerWidth>=innerHeight)return;ctx.fillStyle='rgba(6,4,12,.92)';ctx.fillRect(0,0,W,H);
 const a='TURN YOUR DEVICE',b2='SHINOBIDUNGEONS PLAYS IN LANDSCAPE';txt(a,Math.round(W/2-txtW(a,2)/2),Math.round(H/2-14),'#ffd040',2);txt(b2,Math.round(W/2-txtW(b2)/2),Math.round(H/2+6),'#ddd');}
{const _r=render;render=function(){const r=_r.apply(this,arguments);if(TOUCH){try{touchDraw();touchPortrait();}catch(_){}}return r;};}
// ---- all touch: no cursor at all on a touchscreen, and real full screen (no browser bars) ----
{const _dc=drawCursor;drawCursor=function(){if(TOUCH)return;return _dc.apply(this,arguments);};}
const isIOS=/iP(hone|od|ad)/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const touchDisplay=document.getElementById('touch-display'),fullscreenButton=document.getElementById('touch-fullscreen');
const fullscreenHelp=document.getElementById('fullscreen-help'),coarseTouch=matchMedia('(pointer: coarse)');
let touchDisplayMode;
function updateTouchDisplay(){touchDisplayMode=mode;
 const active=Boolean(fullscreenElement()),standalone=matchMedia('(display-mode: standalone)').matches||
  matchMedia('(display-mode: fullscreen)').matches||navigator.standalone===true;
 touchDisplay.hidden=!(TOUCH||coarseTouch.matches)||(standalone&&!active);
 const label=active?'Exit fullscreen':'Enter fullscreen';
 fullscreenButton.title=label;fullscreenButton.setAttribute('aria-label',label);
 fullscreenButton.setAttribute('aria-pressed',String(active));
 const bounds=cv.getBoundingClientRect();
 touchDisplay.style.setProperty('--display-top',(mode==='play'?Math.max(8,bounds.top+34*bounds.height/H):8)+'px');
}
fullscreenButton.addEventListener('click',async()=>{
 if(!fullscreenHelp.hidden){fullscreenHelp.hidden=true;return;}
 const entering=!fullscreenElement();
 if(await goFullscreen(entering)){
  if(entering&&screen.orientation?.lock)try{await screen.orientation.lock('landscape');}catch(_){}
  updateTouchDisplay();return;
 }
 fullscreenHelp.textContent=isIOS&&entering?
  'In Safari, tap Share → Add to Home Screen, then launch ShinobiDungeons from its icon for fullscreen.':
  'Fullscreen is unavailable here. Try opening the game directly in your browser.';
 fullscreenHelp.hidden=false;
});
touchDisplay.addEventListener('mousedown',e=>e.stopPropagation());
for(const event of ['fullscreenchange','webkitfullscreenchange'])document.addEventListener(event,()=>{fullscreenHelp.hidden=true;updateTouchDisplay();});
coarseTouch.addEventListener?.('change',updateTouchDisplay);
addEventListener('resize',updateTouchDisplay);
{const base=render;render=function(){if(mode!==touchDisplayMode)updateTouchDisplay();return base.apply(this,arguments);};}
// shrine offerings take a tap: each offering row and LEAVE are buttons (the screen used to want the 1-4 keys)
cv.addEventListener('mousedown',e=>{if(mode!=='event'||!evOpts||e.button!==0)return;const x=mouse.x,y=mouse.y;
 for(let i=0;i<evOpts.length;i++){const y0=54+i*30;if(x>=24&&x<=296&&y>=y0&&y<=y0+24){pickEvent(i);mouse.down=false;return;}}
 if(y>=144&&y<=162){pickEvent(3);mouse.down=false;}});
{const _re=renderEvent;renderEvent=function(){_re.apply(this,arguments);if(!TOUCH)return;ctx.fillStyle='#000';ctx.fillRect(0,36,W,10);ctxt('ONE OFFERING ONLY - TAP ONE, OR TAP LEAVE',40,'#888');};}
// learn a basic's reach from the shot it fires
{const _cb=castBolt;castBolt=function(){const n0=projs.length;const r=_cb.apply(this,arguments);try{if(P&&TOUCH_BASICS[P.lo.m]==null)for(let i=n0;i<projs.length;i++){const q=projs[i];if(q.from!=='p')continue;const sp=Math.hypot(q.vx,q.vy),L=sp*(q.life||0);if(L>20){TOUCH_REACH[P.lo.m]=Math.max(TOUCH_REACH[P.lo.m]||0,L*.92);break;}}}catch(_){}return r;};}
