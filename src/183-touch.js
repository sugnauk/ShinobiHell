'use strict';
// SHINOBIDUNGEONS - play on a phone or tablet. Touch controls switch on at the first touch on the screen and stay off
// otherwise: on a PC nothing here runs, draws or listens beyond a single flag check, so PC performance is untouched.
// (A touchscreen laptop gets them only while you use touch; moving a real mouse hides them again.)
//  LEFT SIDE     a floating stick: put a thumb down anywhere and drag to move (smooth, any direction)
//  RIGHT SIDE    dash in the corner, an inner arc of heavy (hold to charge) and three abilities,
//                and an outer arc of ultimate, potion and use. Ability sprites follow the equipped loadout.
//  TOP RIGHT     PAUSE, BAG and SWAP weapon
//  AUTO-AIM and AUTO-ATTACK  aim at a nearby foe or follow the last walking direction. Basics fire only at foes.
//  TIPS          the buttons stay up during a tip; the ones it asks for pulse, and tapping one does it (tapping
//                anywhere else closes the tip)
//  The ability bar along the bottom is hidden on touch: the buttons show the same cooldowns
//  MENUS         taps act as clicks everywhere outside a fight: menus, the bag, the shop, reward cards, the pause menu
// The fullscreen button is available in menus and during play. Portrait play shows a notice to turn the device.
let TOUCH=false,TOUCHAT=-9;const TCH={stick:null,aim:null,btn:new Map(),walkAngle:null};
const touchActive=()=>TOUCH&&mode==='play'&&!paused&&!invOpen&&P&&!(P.dying>0);
const smallTouchScreen=()=>Math.min(innerWidth,innerHeight)<520;
// Near on a phone uses a 240px camera instead of 252px, about 5% larger at the same screen size.
{const base=viewH;viewH=function(){const height=base();
 return TOUCH&&mode==='play'&&smallTouchScreen()&&height===VIEWHS[0]?240:height;
};}
// the buttons, placed from the bottom-right corner; r is the touch radius in game pixels
const TOUCHLAY={cx:-40,cy:-38,inR:80,outR:142,dash:24,ab:18,ult:21,small:14};
const TOUCH_TOP={right:17,y:16,r:11,step:29,fullscreen:44,gap:6};
const touchPixelScale=()=>safeViewRect.height/H||1;
const touchFullscreenSize=()=>touchDisplay.hidden?0:Math.ceil(TOUCH_TOP.fullscreen/touchPixelScale());
const touchHudRowBottom=()=>Math.max(34,2*TOUCH_TOP.gap+touchFullscreenSize());
function touchButtons(){const L=TOUCHLAY,cx=W+L.cx,cy=H+L.cy,ring=(ang,rad)=>[cx+Math.cos(ang*Math.PI/180)*rad,cy+Math.sin(ang*Math.PI/180)*rad];
 const at=(ang,rad,o)=>{const [x,y]=ring(ang,rad);return Object.assign({x,y},o);};
 const row=TOUCH_TOP,fullscreen=touchFullscreenSize(),right=W-row.right-(fullscreen?fullscreen+row.gap:0);
 const top=(i,id,l,key)=>({id,l,key,x:right-i*row.step,y:row.y,r:row.r,top:1,act:id});
 return [{id:'dash',x:cx,y:cy,r:L.dash,key:()=>KB.dash,col:'#9cdfff',act:'dash'},
  at(180,L.inR,{id:'heavy',slot:'h',r:L.ab,hold:'rdown'}),
  at(214,L.inR,{id:'q',slot:'q',r:L.ab,key:()=>KB.q,act:'q'}),
  at(248,L.inR,{id:'w',slot:'w',r:L.ab,key:()=>KB.w,act:'w'}),
  at(276,L.inR,{id:'f',slot:'f',r:L.ab,key:()=>KB.f,act:'f'}),
  at(190,L.outR,{id:'e',slot:'e',r:L.ult,key:()=>KB.e,col:'#ffd040',act:'e'}),
  at(224,L.outR,{id:'heal',r:L.small,key:()=>KB.heal,col:'#ff7070',act:'heal'}),
  at(254,L.outR,{id:'use',l:'USE',r:L.small,key:()=>KB.use,col:'#c8f0a0',act:'use'}),
  top(0,'pause','II',()=>'Escape'),top(1,'pack',invOpen?'X':'BAG',()=>KB.pack),top(2,'swap','SWAP',()=>KB.swap)];}
const toCanvas=t=>{const r=safeViewRect;return {x:(t.clientX-r.left)/r.width*W,y:(t.clientY-r.top)/r.height*H};};
function touchHit(p,pad){for(const b of touchButtons())if(Math.hypot(p.x-b.x,p.y-b.y)<=b.r+(b.top?3:pad||3))return b;return null;}
function touchAimAt(point){
 const dx=point.x-P.x,dy=point.y-P.y,[x,y]=scrVec(dx,dy);
 mouse.x=W/2+x*sceneZoom;mouse.y=H/2+6+y*sceneZoom;
 P.aim=Math.atan2(dy,dx);
}
function touchAimAlongWalk(){
 const a=TCH.walkAngle??P.aim;
 const reach=Math.max(1,rayLen(P.x,P.y,a,TOUCHAIM));
 touchAimAt({x:P.x+Math.cos(a)*reach,y:P.y+Math.sin(a)*reach});
}
function touchAimAbility(){
 if(TCH.aim)return;
 if(TCH.stick)moveVec();
 const target=touchTarget(TOUCHAIM);
 if(target)touchAimAt(target);
 else touchAimAlongWalk();
}
function touchPress(b){if(b.slot||b.id==='dash')touchAimAbility();
 if(b.hold==='rdown'){mouse.rdown=true;return;}const k=b.key();if(!k)return;keys[k]=true;onKey(k);}
function touchRelease(b){if(b.hold==='rdown'){mouse.rdown=false;return;}const k=b.key();if(k)keys[k]=false;}
function touchOn(){if(TOUCH)return;TOUCH=true;TCH.walkAngle=null;cv.style.touchAction='none';document.body.style.touchAction='none';
 cv.style.cursor='none';
 // a closer default zoom suits a small screen (only if you never picked one yourself)
 if(meta&&meta.opt&&meta.opt.zoom==null&&smallTouchScreen())meta.opt.zoom=0;
 resizeView();}
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
 for(const t of e.changedTouches){const p=toCanvas(t);
  if(p.x<0||p.x>W||p.y<0||p.y>H)continue;
  const b=touchHit(p,6);
  if(b){TCH.btn.set(t.identifier,b);touchPress(b);continue;}
  // the move stick: anywhere left of the buttons
  if(p.x<W*.62&&!TCH.stick)TCH.stick={id:t.identifier,ox:p.x,oy:p.y,x:p.x,y:p.y};}},{passive:false});
addEventListener('touchmove',e=>{if(!TOUCH||!touchActive()||touchDisplay.contains(e.target))return;e.preventDefault();
 for(const t of e.changedTouches){const p=toCanvas(t);for(const s of [TCH.stick,TCH.aim])if(s&&s.id===t.identifier){s.x=p.x;s.y=p.y;}}},{passive:false});
const touchEnd=e=>{if(!TOUCH||touchDisplay.contains(e.target))return;if(touchActive())e.preventDefault();
 for(const t of e.changedTouches){const b=TCH.btn.get(t.identifier);if(b){touchRelease(b);TCH.btn.delete(t.identifier);}
  if(TCH.stick&&TCH.stick.id===t.identifier){moveVec();TCH.stick=null;}
}};
addEventListener('touchend',touchEnd,{passive:false});addEventListener('touchcancel',touchEnd,{passive:false});
// a real mouse moving (not one the browser made up from a tap) hands control back to the PC
addEventListener('mousemove',()=>{if(TOUCH&&performance.now()-TOUCHAT>1500){TOUCH=false;TCH.stick=TCH.aim=null;TCH.btn.clear();resizeView();}});
// movement: the stick gives a smooth direction instead of the eight of the keys
{const _mv=moveVec;moveVec=function(){const s=TOUCH&&touchActive()&&TCH.stick;if(!s)return _mv.apply(this,arguments);
 let dx=s.x-s.ox,dy=s.y-s.oy;const l=Math.hypot(dx,dy);if(l<4)return [0,0];if(l>22){s.ox=s.x-dx/l*22;s.oy=s.y-dy/l*22;}const k=Math.min(1,l/16);dx=dx/l*k;dy=dy/l*k;
 // the same screen-to-world turn the keys use
 const direction=unrot((dx+dy)*.7071,(dy-dx)*.7071);
 TCH.walkAngle=Math.atan2(direction[1],direction[0]);
 return direction;};}
{const base=startRun;startRun=function(){TCH.walkAngle=null;return base.apply(this,arguments);};}
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
function touchTarget(range,edge=false){let best=null,bd=Infinity;const view=sceneBounds;for(const e of enemies){if(!kitFoe(e))continue;
 const d=Math.hypot(e.x-P.x,e.y-P.y);if(d>=bd||d>range+(edge?e.r:0))continue;
 const x=sx(e.x,e.y),y=sy(e.x,e.y);if(x>=view.left&&x<view.right&&y>=view.top&&y<view.bottom&&los(P.x,P.y,e.x,e.y)){bd=d;best=e;}}return best;}
{const _fire=wantFire;wantFire=function(){return TOUCH?mouse.down:_fire();};}
{const base=castHeavy;castHeavy=function(){if(touchActive())touchAimAbility();return base.apply(this,arguments);};}
{const _u=update;update=function(dt){if(touchActive()&&!TIPHOLD){
  if(TCH.stick)moveVec();
  const heavy=mouse.rdown||P.hCh>0,charging=heavy||!!ULT;
  const reach=charging?TOUCHAIM:Math.min(TOUCHCAP,TOUCH_BASICS[P.lo.m]?.()??TOUCH_REACH[P.lo.m]??TOUCHAIM);
  const target=touchTarget(reach,!charging);
  if(!TCH.aim){if(target)touchAimAt(target);else touchAimAlongWalk();}
  mouse.down=!!target&&!charging;}
 else if(TOUCH&&mode==='play')mouse.down=false;return _u.apply(this,arguments);};}
{const _hs=hoverSlot;hoverSlot=function(){if(TOUCH)return null;return _hs.apply(this,arguments);};}
// drawing: sticks and buttons, faint so they never hide the fight; a button dims and counts down while it recharges
function touchBadge(b,label){
 const w=txtW(label),x=Math.round(b.x+b.r*.72-w),y=Math.round(b.y+b.r*.48);
 ctx.globalAlpha=1;ctx.fillStyle='#14101a';ctx.fillRect(x-2,y-2,w+4,9);txt(label,x,y,'#fff');
}
function touchDraw(){if(!TOUCH||mode!=='play'||!P)return;const top=paused||invOpen,ask=TIPHOLD&&TIPHOLD.A?TIPHOLD.A.k||[]:[];
 for(const b of touchButtons()){if(top&&!b.top)continue;
  const dash=b.id==='dash',heal=b.id==='heal',spell=b.slot&&SPELLS[b.slot][P.lo[b.slot]],col=b.col||spell?.c||'#e8e8f0';
  const cd=b.slot?slotCd(b.slot):dash?P.dashCd||0:0,locked=P.lock?.[dash?'d':b.slot],dim=locked||cd>0||(heal&&R.pots===0);
  const held=[...TCH.btn.values()].some(t=>t.id===b.id)||(b.hold==='rdown'&&mouse.rdown),asked=b.act&&ask.includes(b.act);
  ctx.globalAlpha=held?.65:.46;ctx.fillStyle='#000';ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,TAU);ctx.fill();
  ctx.globalAlpha=dim?.4:held?1:.8;ctx.strokeStyle=col;ctx.lineWidth=held?2:1;ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,TAU);ctx.stroke();ctx.lineWidth=1;
  // the cooldown sweeps round the rim
  if(cd>0){const mx=dash?S.dashCd:spellCd(b.slot);ctx.globalAlpha=.85;ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();ctx.arc(b.x,b.y,b.r-2,-Math.PI/2,-Math.PI/2+TAU*(1-Math.min(1,cd/(mx||1))));ctx.stroke();ctx.lineWidth=1;}
  if(b.slot==='h'&&P.hCh>0){ctx.globalAlpha=.9;ctx.strokeStyle='#ffd040';ctx.lineWidth=2;ctx.beginPath();ctx.arc(b.x,b.y,b.r-2,-Math.PI/2,-Math.PI/2+TAU*Math.min(1,P.hCh/HCHARGE));ctx.stroke();ctx.lineWidth=1;}
  if(asked){const pu=.5+.5*Math.sin(time*10);ctx.globalAlpha=.6+.4*pu;ctx.strokeStyle='#ffffff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(b.x,b.y,b.r+3+2*pu,0,TAU);ctx.stroke();ctx.lineWidth=1;}
  const icon=spell?spellIcon(spell):dash?motifIcon('dash',col):heal?itemIcon({t:'hp'}):null;
  if(icon){const scale=heal?1:2,w=icon.width*scale,h=icon.height*scale;
   ctx.globalAlpha=dim?.5:1;drawFacetedIcon(icon,Math.round(b.x-w/2),Math.round(b.y-h/2),w,h);
   ctx.globalAlpha=1;
   if(locked)padlock(Math.round(b.x+b.r*.45),Math.round(b.y+b.r*.35),'#aaa');
   else if(heal)touchBadge(b,String(R.pots));
   else if(cd>.05&&b.slot)touchBadge(b,String(Math.ceil(cd)));
  }else if(b.l){const pack=b.id==='pack'&&!invOpen;
   ctx.globalAlpha=1;txt(b.l,Math.round(b.x-txtW(b.l)/2),Math.round(b.y-(pack?6:3)),col);
   if(pack){const count=R.pack.length+'/'+PACKMAX;txt(count,Math.round(b.x-txtW(count)/2),b.y+1,R.pack.length>=PACKMAX?'#f66':'#aaa');}
  }}
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
{const _r=render;render=function(){const r=_r.apply(this,arguments);if(TOUCH){try{drawInView(()=>{touchDraw();touchPortrait();});}catch(_){}}return r;};}
// ---- all touch: no cursor at all on a touchscreen, and real full screen (no browser bars) ----
{const _dc=drawCursor;drawCursor=function(){if(TOUCH)return;return _dc.apply(this,arguments);};}
const isIOS=/iP(hone|od|ad)/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const touchDisplay=document.getElementById('touch-display'),fullscreenButton=document.getElementById('touch-fullscreen');
const fullscreenHelp=document.getElementById('fullscreen-help'),coarseTouch=matchMedia('(pointer: coarse)');
const usesTouchViewport=()=>TOUCH||coarseTouch.matches;
const touchInsets={top:0,right:0,bottom:0,left:0};
function readTouchInsets(){
 const style=getComputedStyle(document.documentElement);
 for(const edge in touchInsets)touchInsets[edge]=parseFloat(style.getPropertyValue('--safe-'+edge))||0;
}
function touchViewportArea(){
 const viewport=window.visualViewport;
 return {x:viewport?.offsetLeft||0,y:viewport?.offsetTop||0,w:viewport?.width||innerWidth,h:viewport?.height||innerHeight};
}
{const base=viewArea;viewArea=function(){
 if(!usesTouchViewport())return base();
 const viewport=touchViewportArea(),{top,right,bottom,left}=touchInsets;
 return {x:viewport.x+left,y:viewport.y+top,w:Math.max(1,viewport.w-left-right),h:Math.max(1,viewport.h-top-bottom)};
};}
worldBleedArea=function(){
 if(!usesTouchViewport()||!usesWorldView())return null;
 const area=touchViewportArea();
 return area.w>area.h?area:null;
};
viewSceneZoom=()=>viewBleeds&&smallTouchScreen()?1.12:1;
{const base=resizeView;resizeView=function(){if(usesTouchViewport())readTouchInsets();base();};}
let touchDisplayMode;
function updateTouchDisplay(){touchDisplayMode=mode;
 const active=Boolean(fullscreenElement()),standalone=matchMedia('(display-mode: standalone)').matches||
  matchMedia('(display-mode: fullscreen)').matches||navigator.standalone===true;
 touchDisplay.hidden=!usesTouchViewport()||(standalone&&!active);
 const label=active?'Exit fullscreen':'Enter fullscreen';
 fullscreenButton.title=label;fullscreenButton.setAttribute('aria-label',label);
 fullscreenButton.setAttribute('aria-pressed',String(active));
 const area=viewArea(),landscape=area.w>=area.h;
 if(mode==='play'&&TOUCH&&landscape){
  const bounds=safeViewRect,padding=TOUCH_TOP.gap*touchPixelScale();
  touchDisplay.style.setProperty('--display-top',(bounds.top+padding)+'px');
  touchDisplay.style.setProperty('--display-right',(innerWidth-bounds.right+padding)+'px');
 }else{
  touchDisplay.style.setProperty('--display-top',(area.y+8)+'px');
  touchDisplay.style.setProperty('--display-right',(innerWidth-area.x-area.w+8)+'px');
 }
}
{const base=fit;fit=function(){base();updateTouchDisplay();};}
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
coarseTouch.addEventListener?.('change',()=>resizeView());
for(const event of ['resize','scroll'])window.visualViewport?.addEventListener(event,()=>{if(usesTouchViewport())resizeView();});
{const base=render;render=function(){const result=base.apply(this,arguments);if(mode!==touchDisplayMode)updateTouchDisplay();return result;};}
if(usesTouchViewport())resizeView();
// shrine offerings take a tap: each offering row and LEAVE are buttons (the screen used to want the 1-4 keys)
cv.addEventListener('mousedown',e=>{if(mode!=='event'||!evOpts||e.button!==0)return;const x=mouse.x,y=mouse.y;
 for(let i=0;i<evOpts.length;i++){const y0=54+i*30;if(x>=24&&x<=296&&y>=y0&&y<=y0+24){pickEvent(i);mouse.down=false;return;}}
 if(y>=144&&y<=162){pickEvent(3);mouse.down=false;}});
{const _re=renderEvent;renderEvent=function(){_re.apply(this,arguments);if(!TOUCH)return;ctx.fillStyle='#000';ctx.fillRect(0,36,W,10);ctxt('ONE OFFERING ONLY - TAP ONE, OR TAP LEAVE',40,'#888');};}
// learn a basic's reach from the shot it fires
{const _cb=castBolt;castBolt=function(){const n0=projs.length;const r=_cb.apply(this,arguments);try{if(P&&TOUCH_BASICS[P.lo.m]==null)for(let i=n0;i<projs.length;i++){const q=projs[i];if(q.from!=='p')continue;const sp=Math.hypot(q.vx,q.vy),L=sp*(q.life||0);if(L>20){TOUCH_REACH[P.lo.m]=Math.max(TOUCH_REACH[P.lo.m]||0,L*.92);break;}}}catch(_){}return r;};}
