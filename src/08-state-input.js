'use strict';
// HELL OF THE EMPEROR - global state and input (part of the former game.js; files load in numeric order, see index.html)
// ---------- global state ----------
let mode='title',paused=false,R=null,S=null,P=null,map=null,mapCanvas=null,enemies=[],projs=[],pickups=[],fx=[],particles=[],texts=[],cam={x:0,y:0};
let shake=0,hitstop=0,time=0,boss=null,portal=null,chooseOpts=null,toast={t:0,s:'',c:'#fff'},hubSel=0,hubStart=0,flashT=0,deadInfo=null,tutPage=0,tutPending=null;
let props=[],traps=[],hz=[],dh=[],zones=[],freezeT=0,evOpts=null,evProp=null;
const keys={},mouse={x:W/2,y:H/2,down:false,rdown:false};

function calcStats(){
 const u=meta.up,G=gearStats(),n=id=>relicPower(id)+(G.fx[id]||0);
 const cu=R.curse||0,ms=(typeof heroRunStats==='function'?heroRunStats():{}),st=k=>(ms[k]||0)+(G.st[k]||0),cz=R.cz||{},bl=R.bless||{};
 return {pierce:n('pierce'),frost:n('frost'),shock:n('shock'),qpow:n('qpow'),epow:n('epow'),ecd:n('ecd'),vamp:n('vamp'),echo:n('echo'),phoenix:n('phoenix'),flare:n('flare'),storm:n('storm'),
  st:{att:st('att'),def:st('def'),spd:st('spd'),dex:st('dex'),vit:st('vit'),wis:st('wis')},def:st('def')+G.def,
  atk:(14+u.atk*2+n('atk')*3+st('att')+G.atk+(bl.atk||0))*(1+.4*n('glass'))*(1+.3*cu)*(1+.1*(cz.hunted||0)),aspd:1+n('aspd')*.12+st('dex')*.02+.25*(cz.frenzy||0),rangeM:.12*n('range'),maxhp:Math.max(20,Math.round((100+u.vit*12+n('hp')*20+st('vit')*5+G.hp+(bl.hp||0))*Math.pow(.75,n('glass'))*Math.pow(.8,cz.glass||0))),maxpos:100+u.pos*10+n('pos')*15,spd:78*(1+n('spd')*.08+st('spd')*.01),wardDur:2.2+.3*n('parry'),cdr:Math.pow(1-COOLDOWN.charm,n('emb'))*(1-COOLDOWN.focusRank*u.emb)*Math.max(.8,1-COOLDOWN.wisdom*st('wis'))*Math.pow(1-COOLDOWN.frenzy,cz.frenzy||0)*Math.pow(1-COOLDOWN.stillWater,bl.cdr||0),crit:.05+n('crit')*.08+.15*(cz.glass||0),kills:n('blood')*3,burn:n('fire'),poison:n('poison'),dashCd:Math.max(.4,.9*Math.pow(1-COOLDOWN.shadow,n('shadow')))*Math.pow(1.4,cz.frenzy||0),dashIv:.18,wave:n('wave'),gourdMax:3+n('gourd'),dr:Math.pow(.92,n('iron')),dodge:n('ghost')*.06,magnet:30+n('magnet')*14,sen:(1+u.sen*.1+n('magnet')*.15)*(1+.6*(cz.greed||0)),thorn:n('thorn'),dbHeal:n('hunger')*.15,mikiri:n('mikiri')};
}

// ---------- input ----------
addEventListener('keydown',e=>{if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Tab'].includes(e.code))e.preventDefault();if(e.repeat)return;keys[e.code]=true;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();}catch(_){}onKey(e.code);});
addEventListener('keyup',e=>{keys[e.code]=false;});
addEventListener('blur',()=>{for(const k in keys)keys[k]=false;mouse.down=mouse.rdown=false;if(mode==='play')paused=true;});
function setMouse(e){const r=safeViewRect;mouse.x=(e.clientX-r.left)/r.width*W;mouse.y=(e.clientY-r.top)/r.height*H;}
cv.addEventListener('mousemove',setMouse);
cv.addEventListener('mousedown',e=>{setMouse(e);if(mode==='play'&&invOpen){invClick(e.button);return;}if(e.button===0){mouse.down=true;if(mode==='play'&&!paused&&(meta.opt.autoFire|0)===1&&!hoverSlot()){fireOn=!fireOn;txtFx&&P&&txtFx(P.x,P.y-14,fireOn?'AUTO FIRE ON':'AUTO FIRE OFF',fireOn?'#ffd080':'#888');}if(mode==='choose')clickChoose();else if(mode==='master')masterClick();else if(mode==='scroll')clickScroll();else if(mode==='lootConfirm')clickLootConfirm();else if(mode==='select')selClick();else if(mode==='title'||mode==='dead'||mode==='win'||mode==='tut')onKey('Enter');}if(e.button===2)mouse.rdown=true;});
addEventListener('mouseup',e=>{if(e.button===0)mouse.down=false;if(e.button===2)mouse.rdown=false;});
cv.addEventListener('contextmenu',e=>e.preventDefault());

// turn the camera 90 degrees (, and .). The floor is re-baked once per angle and cached for this map.
function rotateCam(d){setRotCoef(camRot+d);if(map&&map.th){map.mc={};mapCanvas=map.mc[camRot]=renderMap(map.th);} // only the current angle is kept (the floor image is big)
 sfx('tool');setToast('CAMERA '+['N','E','S','W'][camRot],'#aaa',.8);trainEv('rot');}
function onKey(c){
 if(c==='KeyM'){muted=!muted;return;}
 if((c==='Comma'||c==='Period')&&mode==='play'&&!paused&&!invOpen){rotateCam(c==='Period'?1:-1);return;}
 if(mode==='options'){optionsKey(c);return;}
 if(mode==='title'){if(c==='Enter'||c==='Space')openSelect('title');else if(c==='KeyC'&&savedRun())continueRun();else if(c==='KeyO')openOptions('title');return;}
 if(mode==='select'){if(c==='KeyK'&&!selLock){openGuide('select');return;}if(c==='KeyO'&&!selLock){openOptions('select');return;}selectKey(c);return;}
 if(mode==='guide'){guideKey(c);return;}
 if(mode==='master'){masterKey(c);return;}
 if(mode==='tut'){tutKey(c);return;}
 if(mode==='hub'){hubKey(c);return;}
 if(mode==='play'){if(P&&P.dying>0)return;if(c==='KeyN'&&R&&R.training&&!paused){finishTraining();return;}if(invOpen){if(c===KB.pack||c==='KeyI'||c==='Escape')closeInv();return;}if((c===KB.pack||c==='KeyI')&&!paused){invOpen=true;invHover=-1;sfx('tool');trainEv('pack');return;}if(c===KB.swap&&!paused){quickSwap();return;}if(/^Digit[1-6]$/.test(c)&&!paused){const b=nearBag();if(b){takeItem(b,+c.slice(5)-1);return;}}if(c==='Escape'||c==='KeyP'){paused=!paused;return;}
  if(paused){pauseKey(c);return;} // the pause menu (src/102-menus.js)
  if(c===KB.dash)tryDash();else if(c===KB.q)castChain();else if(c===KB.w)castWard();else if(c===KB.f)castF();else if(c===KB.e)castUlt();else if(c===KB.heal)useGourd();else if(c===KB.use)interact();return;}
 if(mode==='choose'){if(c==='Digit1'||c==='Digit2'||c==='Digit3')pickChoice(+c.slice(5)-1);return;}
 if(mode==='scroll'){if(/^Digit[1-3]$/.test(c))pickScroll(+c.slice(5)-1);else if(c==='Escape')closeScroll();return;}
 if(mode==='lootConfirm'){lootConfirmKey(c);return;}
 if(mode==='event'){if(/^Digit[1-4]$/.test(c))pickEvent(+c.slice(5)-1);else if(c==='Escape')pickEvent(3);return;}
 if(mode==='dead'||mode==='win'){if(c==='Enter'||c==='Space'){openSelect('end');}} // after a run: back to character select (with upgrades)
}
function hubKey(c){
 const n=3; // rows: begin run, character (display only), skill tree
 // the character is locked in on the select screen; row 1 is display-only and skipped
 if(c==='KeyT'){tutPending=null;tutPage=0;mode='tut';return;}
 if(c==='KeyY'){trainNext=true;startRun(0);return;}
 if(c==='KeyK'){openGuide('hub');return;}
 if(c==='KeyO'){openOptions('hub');return;}
 if(c==='KeyC'&&savedRun()){continueRun();return;}
 if(c==='KeyQ'||c==='KeyE'){meta.asc=clamp((meta.asc||0)+(c==='KeyE'?1:-1),0,meta.ascMax||0);saveMeta();sfx('coin');return;}
 if(c==='Escape'){mode='title';return;}
 if(c==='ArrowUp'||c==='KeyW'){hubSel=(hubSel+n-1)%n;if(hubSel===1)hubSel=0;}
 else if(c==='ArrowDown'||c==='KeyS'){hubSel=(hubSel+1)%n;if(hubSel===1)hubSel=2;}
 // every run starts at stage I (test mode can still start anywhere)
 else if(c==='Enter'||c==='Space'){if(hubSel===0)startRun(0);else if(hubSel===2)openTree('hub');}
}
function upgCost(u){return u.base*(meta.up[u.k]+1);}
function buyUpg(u){const lv=meta.up[u.k];if(lv>=u.max){return;}const c=upgCost(u);if(meta.sen>=c){meta.sen-=c;meta.up[u.k]++;saveMeta();sfx('pickup');}else sfx('block');}
