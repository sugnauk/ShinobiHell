'use strict';
// SHINOBIDUNGEONS - abilities that feel powerful, and a fuller soundscape.
//  ABILITIES: every cast gets its own burst of light and its own layered sound, on top of what the ability already does:
//   Q   a crackling zap: a bright ring at your hands, short rays and sparks
//   E   a chiming seal that spins up around you
//   F   a double shockwave across the ground, kicking up dust
//   R   the ultimate: a white flash, long rays of light, three shockwave rings one after another, a heavy shake, a boom
//   RMB a heavy release: a cone of rays in the aim direction and a thump
//  Big ability hits land with an impact ring and sparks.
//  SOUNDS: footsteps, bags and chests opening, the temple bell as a stage begins, a taiko and gong as a guardian is
//  introduced, a gong at every phase change.

// ---------- a small synth for the new sounds ----------
const SX={};
function sxOut(){if(!AC)return null;if(!SX.bus){SX.bus=AC.createGain();SX.bus.connect(AC.destination);}SX.bus.gain.value=(typeof sfxVol==='function'?sfxVol():1)*(muted?0:1);return SX.bus;}
function sxTone(t,f,d,type,v,f2){const o=sxOut();if(!o)return;const s=AC.createOscillator(),g=AC.createGain();s.type=type||'sine';s.frequency.setValueAtTime(f,t);if(f2)s.frequency.exponentialRampToValueAtTime(Math.max(20,f2),t+d);
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.006);g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(g);g.connect(o);s.start(t);s.stop(t+d+.05);}
function sxNoise(t,d,v,fq,type,q){const o=sxOut();if(!o||typeof noiseBuf!=='function')return;const s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();s.buffer=noiseBuf();s.loop=d>.3;
 f.type=type||'bandpass';f.frequency.value=fq;if(q)f.Q.value=q;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(f);f.connect(g);g.connect(o);s.start(t);s.stop(t+d+.05);}
const SND={
 zap:()=>{const t=AC.currentTime;sxNoise(t,.18,.09,4000,'highpass');sxTone(t,1400,.16,'square',.035,220);sxTone(t+.03,900,.12,'sawtooth',.02,160);},
 ward:()=>{const t=AC.currentTime;[0,4,7,12].forEach((s,i)=>sxTone(t+i*.04,880*Math.pow(2,s/12),.9,'sine',.04));sxNoise(t,.5,.015,6000,'highpass');},
 nova:()=>{const t=AC.currentTime;sxTone(t,180,.45,'sine',.12,45);sxNoise(t,.5,.08,700,'lowpass');sxNoise(t+.02,.35,.04,5000,'highpass');},
 ult:()=>{const t=AC.currentTime;sxTone(t,90,1.2,'sine',.16,30);sxTone(t,60,1.4,'triangle',.12,28);sxNoise(t,1.1,.12,500,'lowpass');sxNoise(t,.6,.05,5000,'highpass');sxTone(t,300,.5,'sawtooth',.03,1200);},
 heavy:()=>{const t=AC.currentTime;sxTone(t,140,.25,'sine',.1,50);sxNoise(t,.2,.06,1200);},
 step:()=>{const t=AC.currentTime;sxNoise(t,.05,.012+Math.random()*.006,350+Math.random()*200,'lowpass');},
 bag:()=>{const t=AC.currentTime;[0,7,12].forEach((s,i)=>sxTone(t+i*.06,660*Math.pow(2,s/12),.25,'triangle',.035));},
 chest:()=>{const t=AC.currentTime;sxNoise(t,.15,.05,900);sxTone(t+.05,180,.2,'square',.03,120);[0,4,7,11,12].forEach((s,i)=>sxTone(t+.15+i*.07,523*Math.pow(2,s/12),.4,'triangle',.035));},
 bell:()=>{const t=AC.currentTime;for(const [h,a] of [[1,.07],[2.76,.03],[5.4,.015],[.5,.04]])sxTone(t,220*h,3.5,'sine',a);},
 taiko:()=>{const t=AC.currentTime;for(const d of [0,.32,.5]){sxTone(t+d,110,.5,'sine',.2,40);sxNoise(t+d,.12,.06,300,'lowpass');}},
 gong:()=>{const t=AC.currentTime;for(const [f,a] of [[98,.09],[147,.05],[196,.04],[263,.03],[311,.02]])sxTone(t,f,3,'sine',a,f*.97);sxNoise(t,1.2,.03,1500,'bandpass',.7);},
 impact:()=>{const t=AC.currentTime;sxTone(t,220,.12,'square',.03,70);sxNoise(t,.08,.04,2500);}};
const snd=k=>{try{if(AC&&!muted&&SND[k])SND[k]();}catch(_){}};

// ---------- the light show: rings, rays and seals in the world ----------
const JUICE=[];
function juice(o){o.t0=time;JUICE.push(o);if(JUICE.length>60)JUICE.shift();}
function drawJuice(){for(let i=JUICE.length-1;i>=0;i--){const j=JUICE[i],k=(time-j.t0-(j.delay||0))/j.dur;if(k>=1){JUICE.splice(i,1);continue;}if(k<0)continue;
 const X=sx(j.x,j.y),Y=sy(j.x,j.y)-(j.h||8),a=1-k;ctx.globalAlpha=a;
 if(j.k==='ring'){const r=j.r0+(j.r-j.r0)*(1-(1-k)*(1-k));wcirc(j.x,j.y,r,j.col);if(j.thick)wcirc(j.x,j.y,r+1,j.col);if(j.white)wcirc(j.x,j.y,r-1,'#fff');}
 else if(j.k==='rays'){const n=j.n,L=j.len*(.3+.7*Math.min(1,k*3));ctx.fillStyle=j.col;for(let m=0;m<n;m++){const an=(j.a0||0)+(j.cone?(m/(n-1)-.5)*j.cone:m/n*TAU),c=Math.cos(an),s=Math.sin(an)*.6;
   for(let d=j.in||6;d<L;d+=2){ctx.fillRect(Math.round(X+c*d),Math.round(Y+s*d),d<L*.5?2:1,1);}}}
 else if(j.k==='seal'){const r=j.r*(k<.2?k/.2:1),rot=time*6;ctx.fillStyle=j.col;for(let m=0;m<24;m++){const an=m/24*TAU+rot;ctx.fillRect(Math.round(X+Math.cos(an)*r),Math.round(Y+Math.sin(an)*r*.55),2,1);}
  for(let m=0;m<6;m++){const an=m/6*TAU-rot*.6,x1=X+Math.cos(an)*r*.65,y1=Y+Math.sin(an)*r*.36,x2=X+Math.cos(an+2.1)*r*.65,y2=Y+Math.sin(an+2.1)*r*.36;sline(x1,y1,x2,y2,'#fff');}}
 ctx.globalAlpha=1;}}
{const _dp=drawPortal;drawPortal=function(){drawJuice();return _dp.apply(this,arguments);};}

// ---------- every cast: detect it by the cooldown starting, then the show ----------
function castShow(k){const p=P,col=(SPELLS[k]&&SPELLS[k][p.lo[k]]&&SPELLS[k][p.lo[k]].c)||'#fff',a=p.aim||0,hx=p.x+Math.cos(a)*8,hy=p.y+Math.sin(a)*8;
 if(k==='q'){juice({k:'ring',x:hx,y:hy,r0:2,r:18,dur:.25,col,white:1});juice({k:'rays',x:hx,y:hy,n:8,len:22,dur:.18,col:'#fff'});spark(hx,hy,col,12,90);shake=Math.max(shake,3);snd('zap');}
 else if(k==='w'){juice({k:'seal',x:p.x,y:p.y,r:24,dur:.7,col});juice({k:'ring',x:p.x,y:p.y,r0:6,r:32,dur:.35,col,thick:1});snd('ward');}
 else if(k==='f'){juice({k:'ring',x:p.x,y:p.y,r0:4,r:56,dur:.35,col,thick:1,white:1,h:0});juice({k:'ring',x:p.x,y:p.y,r0:4,r:78,dur:.5,col,delay:.08,h:0});
  for(let i=0;i<18;i++){const an=i/18*TAU;particles.push({x:p.x+Math.cos(an)*10,y:p.y+Math.sin(an)*10,vx:Math.cos(an)*90,vy:Math.sin(an)*90,t:.35,col:i%2?'#c8c0b8':col});}shake=Math.max(shake,4);snd('nova');}
 else if(k==='e'){flashT=Math.max(flashT,.22);flashCol=col;juice({k:'rays',x:p.x,y:p.y,n:16,len:90,dur:.5,col:'#fff',in:10});juice({k:'seal',x:p.x,y:p.y,r:40,dur:.9,col});
  for(let i=0;i<3;i++)juice({k:'ring',x:p.x,y:p.y,r0:6,r:60+i*40,dur:.6,col,thick:1,white:!i,delay:i*.12,h:0});spark(p.x,p.y,col,40,180);spark(p.x,p.y,'#fff',20,120);
  shake=Math.max(shake,10);hitstop=Math.max(hitstop,.05);snd('ult');}
 else if(k==='h'){juice({k:'rays',x:hx,y:hy,n:7,len:46,dur:.22,col,cone:.9,a0:Math.atan2(Math.sin(a)*.6,Math.cos(a))});juice({k:'ring',x:hx,y:hy,r0:2,r:22,dur:.22,col:'#fff'});shake=Math.max(shake,4);snd('heavy');}}
for(const [nm,k] of [['castChain','q'],['castWard','w'],['castF','f'],['castUlt','e'],['castHeavy','h']]){const f=globalThis[nm];if(typeof f!=='function')continue;
 globalThis[nm]=function(){const before=P?slotCd(k):0;const r=f.apply(this,arguments);try{if(P&&slotCd(k)>before+.05&&mode==='play')castShow(k);}catch(_){}return r;};}
// big ability hits land with an impact ring (a few per frame at most)
{let lastF=-1,n=0;const _h=hurtE;hurtE=function(e,dmg,pd,o){const r=_h.apply(this,arguments);try{const src=(o&&o.src!==undefined)?o.src:castSrc;
  if(src&&src!=='m'&&P&&dmg>S.atk*1.8&&!(o&&o.chain)){const f=Math.floor(time*60);if(f!==lastF){lastF=f;n=0;}if(n<4){n++;const col=(SPELLS[src]&&SPELLS[src][P.lo[src]]&&SPELLS[src][P.lo[src]].c)||'#fff';
   juice({k:'ring',x:e.x,y:e.y,r0:2,r:14+Math.min(16,dmg/S.atk*2),dur:.2,col,white:1});spark(e.x,e.y,col,8,100);if(n===1&&Math.random()<.5)snd('impact');}}}catch(_){}return r;};}

// ---------- sounds for the rest of the game ----------
{let stepT=0;const _u=update;update=function(dt){const was=introT>0;_u.apply(this,arguments);if(mode!=='play'||!P)return;
 if(!was&&introT>0&&introE&&!introE.camOnly){snd('taiko');setTimeout(()=>snd('gong'),550);}
 if(P.mv&&!(P.dash>0)&&!paused){stepT-=dt;if(stepT<=0){stepT=.27;snd('step');}}else stepT=.05;};}
{const _lb=lootBag;lootBag=function(b){const was=b&&b.opened;const r=_lb.apply(this,arguments);if(b&&!was&&b.opened)snd('bag');return r;};}
{const _in=interact;interact=function(){const p=nearProp(),was=p&&p.k==='chest'&&!p.used;const r=_in.apply(this,arguments);if(was&&p.used)snd('chest');return r;};}
{const _ld=loadDungeon;loadDungeon=function(){const r=_ld.apply(this,arguments);setTimeout(()=>snd('bell'),300);return r;};}
{const _dh=doHalf;doHalf=function(e){const was=e&&e.phx;const r=_dh.apply(this,arguments);if(e&&!was&&e.phx)snd('gong');return r;};}
