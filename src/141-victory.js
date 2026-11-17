'use strict';
// SHINOBIDUNGEONS - the victory screen: its own layout, played as a short celebration instead of a stats sheet.
//  - dawn breaks over the taken castle: the sky warms, the sun rises behind the keep, rays turn, petals fall,
//    and fireworks burst overhead
//  - your hero, in final form, bounces up onto a lit pedestal and strikes victory poses
//  - VICTORY crashes in letter by letter, then the run's numbers count up one by one with a tick each
//  - a RANK (S / A / B / C) stamps down with a flash and a firework volley
//  - the jade you earned flies from the hero into a counter that rolls up; a new warrior, if any, is announced
// ENTER skips to the end of the show; ENTER again goes on to character select.

let VIC=null;
{const _fr=finishRun;finishRun=function(win){const sc=R&&R.score||0,asc=R&&R.asc||0;const r=_fr.apply(this,arguments);
 if(win&&deadInfo){deadInfo.score=sc;deadInfo.asc=asc;VIC={t0:time,parts:[],last:time,fw:0,ticks:{},stamped:false,coins:[],shown:0};}return r;};}
function vicGrade(d){let p=0;const m=(d.time||0)/60;p+=m<30?3:m<45?2:m<60?1:0;if((d.pf||0)>=50)p++;if((d.db||0)>=30)p++;if((d.combo||0)>=100)p++;p+=Math.min(3,d.asc||0);
 return p>=6?['S','#ffd040']:p>=4?['A','#ff8a40']:p>=2?['B','#80c0ff']:['C','#c0c0c0'];}
// a little screen-space particle system for fireworks, petals and coins
function vicBurst(x,y,col,n){VIC.parts.push({x,y,vx:0,vy:0,g:0,t:.15,col:'#fff',k:'flash'});for(let i=0;i<n;i++){const a=Math.random()*TAU,s=rnd(20,70);VIC.parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,g:30,t:rnd(.7,1.2),col:Math.random()<.25?'#fff':col,k:'spark'});}}
const VSEQ={title:.3,sub:1.2,stats:1.7,row:.38,rank:4.1,jade:4.9,unlock:5.9,done:6.6};
function renderVictory(){const d=deadInfo;if(!d||!VIC){renderEnd();return;}
 const t=time-VIC.t0,dt=Math.min(.05,Math.max(0,time-VIC.last));VIC.last=time;const C=d.cls||CLS();
 // ---- the sky: night warming to dawn, the sun rising behind the keep
 const k=clamp(t/3,0,1);for(let y=0;y<H;y+=2){const f=y/H,c1=[[20,14,40],[60,30,70]],c2=[[255,150,90],[255,210,140]];
  const a=[0,1,2].map(i=>Math.round(c1[0][i]+(c2[0][i]-c1[0][i])*k*f*1.1+(c1[1][i]-c1[0][i])*f*(1-k)));ctx.fillStyle='rgb('+a.map(v=>clamp(v,0,255)).join(',')+')';ctx.fillRect(0,y,W,2);}
 const sunY=Math.round(H*.78-k*H*.32),cx=Math.round(W/2);
 // rays
 ctx.globalAlpha=.10+.06*k;for(let i=0;i<14;i++){const a=i/14*TAU+t*.12;ctx.fillStyle=i%2?'#fff2c0':'#ffd080';ctx.beginPath();ctx.moveTo(cx,sunY);ctx.lineTo(cx+Math.cos(a)*W,sunY+Math.sin(a)*W);ctx.lineTo(cx+Math.cos(a+.12)*W,sunY+Math.sin(a+.12)*W);ctx.fill();}ctx.globalAlpha=1;
 disc(cx,sunY,24,'#ffcf70');disc(cx,sunY,20,'#ffe6a0');disc(cx,sunY,15,'#fff6d8');
 // the castle silhouette, flying our banner
 {const by=H-34;ctx.fillStyle='#1a1018';ctx.fillRect(0,by+16,W,H-by-16);const roof=(x,y,w)=>{for(let j=0;j<3;j++)ctx.fillRect(x-w/2-3+j,y+j,w+6-j*2,1);};
  ctx.fillRect(cx-90,by+4,180,14);roof(cx,by+1,184);ctx.fillRect(cx-60,by-10,120,12);roof(cx,by-13,124);ctx.fillRect(cx-34,by-24,68,12);roof(cx,by-27,72);ctx.fillRect(cx-14,by-36,28,10);roof(cx,by-39,32);
  ctx.fillRect(cx,by-56,1,18);const wv=Math.round(Math.sin(t*6)*1);ctx.fillStyle='#d02030';ctx.fillRect(cx+1,by-56+wv,12,7);ctx.fillStyle='#fff';ctx.fillRect(cx+5,by-54+wv,4,3);
  for(const [x,y] of [[-60,-4],[-30,-4],[0,-4],[30,-4],[60,-4],[-20,-18],[20,-18],[0,-31]]){ctx.fillStyle=Math.sin(t*3+x)>-.5?'#ffd070':'#c08030';ctx.fillRect(cx+x,by+y,2,2);}}
 // ---- particles: fireworks, petals, coins
 VIC.fw-=dt;if(t>.5&&VIC.fw<=0){VIC.fw=rnd(.25,.6);vicBurst(rnd(30,W-30),rnd(18,H*.45),pick(['#ffd040','#ff6060','#80d0ff','#c080ff','#80ff90']),26);sfx('coin');}
 if(Math.random()<.5)VIC.parts.push({x:rnd(0,W),y:-4,vx:rnd(6,18),vy:rnd(14,26),g:0,t:9,col:pick(['#f8b8d0','#fde0ea','#f0a0c0']),k:'petal',ph:Math.random()*6});
 for(let i=VIC.parts.length-1;i>=0;i--){const q=VIC.parts[i];q.t-=dt;q.vy+=(q.g||0)*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;if(q.t<=0||q.y>H+4){VIC.parts.splice(i,1);continue;}
  ctx.globalAlpha=q.k==='spark'?Math.min(1,q.t*1.5):1;ctx.fillStyle=q.col;if(q.k==='petal'){ctx.fillRect(Math.round(q.x),Math.round(q.y),2,1);ctx.fillRect(Math.round(q.x)+(Math.sin(time*4+q.ph)>0?1:0),Math.round(q.y)+1,1,1);}else if(q.k==='flash'){disc(Math.round(q.x),Math.round(q.y),Math.round(8*q.t/.15)+2,q.col);}else ctx.fillRect(Math.round(q.x),Math.round(q.y),2,2);}ctx.globalAlpha=1;
 // ---- the hero, bouncing up onto a pedestal
 {const fy=H-44,e=clamp(t/.8,0,1),bounce=e<1?Math.round(Math.abs(Math.sin(e*Math.PI*2.5))*(1-e)*30):0,rise=Math.round((1-Math.min(1,e*1.4))*60);
  glowDisc(cx,fy-36,52,C.col,1);ctx.fillStyle='#2a1e28';for(let y=0;y<8;y++){const w=Math.round(34*Math.sqrt(1-((y-3.5)/4.2)**2));ctx.fillRect(cx-w,fy-3+y,w*2,1);}
  ctx.fillStyle='#e0b040';for(let i=0;i<20;i++){const a=i/20*TAU+t;ctx.fillRect(Math.round(cx+Math.cos(a)*30),Math.round(fy+Math.sin(a)*3),1,1);}
  const sp=heroSpr(C.k,9),SC=4,ph=t%2.4,fr=ph<1.6?(WIZ.cast||WIZ.idle)[Math.floor(time*6)%2]:ph<2?(WIZ.ult||WIZ.idle)[0]:WIZ.idle[Math.floor(time*2.5)%2];
  ctx.drawImage(sp.c,fr*sp.fw,0,sp.fw,sp.fh,Math.round(cx-sp.fw*SC/2),fy-sp.fh*SC+2-bounce+rise,sp.fw*SC,sp.fh*SC);
  if(!VIC.landed&&e>=1){VIC.landed=1;vicBurst(cx,fy-40,C.col,40);}}
 // ---- VICTORY, letter by letter
 {const s='VICTORY',SC=5,w=txtW(s,SC);let x=Math.round((W-w)/2);for(let i=0;i<s.length;i++){const ch=s[i],lt=t-VSEQ.title-i*.08;if(lt<0)break;
   const drop=lt<.18?Math.round((1-lt/.18)*-40):lt<.3?Math.round(Math.sin((lt-.18)/.12*Math.PI)*-4):0,wob=Math.round(Math.sin(time*3+i*.6)*1.5);
   if(!VIC.ticks['L'+i]&&lt>=.18){VIC.ticks['L'+i]=1;sfx('hit');}
   txt(ch,x+2,8+drop+wob+2,'#5a2a08',SC);txt(ch,x,8+drop+wob,Math.floor(time*8+i)%7===0?'#fff6c0':'#ffd040',SC);x+=txtW(ch,SC)+SC;}}
 if(t>VSEQ.sub){const s='THE CORRUPT EMPEROR IS DEAD. THE CASTLE IS YOURS.',n=Math.floor((t-VSEQ.sub)*40);ctxt(s.slice(0,n),46,'#fff');}
 // ---- left: the run, counted up row by row
 const rows=[['TIME',Math.floor(d.time||0),v=>Math.floor(v/60)+'M '+String(Math.floor(v%60)).padStart(2,'0')+'S','#fff'],['FOES SLAIN',d.kills||0,null,'#ff8080'],['DEATHBLOWS',d.db||0,null,'#ffd040'],
  ['PERFECT DODGES',d.pf||0,null,'#80d0ff'],['BEST COMBO',d.combo||0,null,'#ff8a40'],['SCORE',d.score||0,null,'#fff8c0']];
 {const pin=t-VSEQ.stats+.2;if(pin>0){const x=10-Math.round(Math.max(0,1-pin/.25)*150),y0=62;ctx.fillStyle='rgba(14,8,20,.8)';ctx.fillRect(x-4,y0-6,128,rows.length*14+10);ctx.fillStyle='#ffd040';ctx.fillRect(x-4,y0-6,128,1);
  rows.forEach(([n,v,f,col],i)=>{const rt=t-VSEQ.stats-i*VSEQ.row;if(rt<0)return;const p=clamp(rt/.45,0,1),cur=Math.round(v*(1-(1-p)**3)),pop=rt<.12?1:0;
   if(!VIC.ticks['r'+i]){VIC.ticks['r'+i]=1;sfx('coin');}if(p<1&&Math.floor(time*30)%3===0)sfx('coin');
   const y=y0+i*14;txt(n,x,y,'#bbb');const s=f?f(cur):String(cur);txt(s,x+120-txtW(s,1+pop)-4,y-pop*2,col,1+pop);});}}
 // ---- right: the rank stamp, the jade, the new warrior
 {const pin2=t-VSEQ.rank+.2;if(pin2>0){const x=W-138+Math.round(Math.max(0,1-pin2/.25)*150),y0=62;ctx.fillStyle='rgba(14,8,20,.8)';ctx.fillRect(x,y0-6,128,104);ctx.fillStyle='#ffd040';ctx.fillRect(x,y0-6,128,1);txt('RANK',x+6,y0,'#bbb');
  const [g,gc]=vicGrade(d),rt=t-VSEQ.rank;
  if(rt>=0){const sc=rt<.25?Math.round(12-rt/.25*7):5,s=g;if(!VIC.stamped){VIC.stamped=1;sfx('rare');flashT=.25;shake=10;for(let i=0;i<4;i++)vicBurst(rnd(40,W-40),rnd(20,90),gc,30);}
   const gx=x+64-Math.round(txtW(s,sc)/2),gy=y0+22-Math.round((sc-5)*3);txt(s,gx+2,gy+2,'#3a1a08',sc);txt(s,gx,gy,Math.floor(time*6)%5===0?'#fff':gc,sc);
   if(rt>.25){const tl={S:'LEGENDARY',A:'MASTERFUL',B:'SKILLED',C:'VICTORIOUS'}[g];txt(tl,x+64-Math.round(txtW(tl)/2),y0+52,gc);ctx.globalAlpha=.5+.3*Math.sin(time*5);ctx.strokeStyle=gc;ctx.strokeRect(x+40.5,y0+14.5,48,34);ctx.globalAlpha=1;}}
  const jt=t-VSEQ.jade;if(jt>=0){const total=d.sen||0,p=clamp(jt/.9,0,1),cur=Math.round(total*p);
   if(!VIC.jadeOn){VIC.jadeOn=1;for(let i=0;i<24;i++)VIC.coins.push({x:cx+rnd(-10,10),y:H-90+rnd(-10,10),tx:x+20,ty:y0+66,t:-i*.03});}
   hudJade(x+8,y0+62);txt('JADE',x+20,y0+63,JADEC);const s='+'+cur;txt(s,x+122-txtW(s,2),y0+60,p<1?'#fff':JADEC,2);
   if(p<1&&Math.floor(time*20)%2===0)sfx('coin');}
  for(let i=VIC.coins.length-1;i>=0;i--){const c=VIC.coins[i];c.t+=dt;if(c.t<0)continue;const f=clamp(c.t/.6,0,1),e=f*f;const X=c.x+(c.tx-c.x)*e,Y=c.y+(c.ty-c.y)*e-Math.sin(f*Math.PI)*40;
   ctx.fillStyle='#14101a';ctx.fillRect(Math.round(X)-2,Math.round(Y)-2,5,5);ctx.fillStyle=JADEC;ctx.fillRect(Math.round(X)-1,Math.round(Y)-1,3,3);if(f>=1)VIC.coins.splice(i,1);}
  if(d.unlock&&t>=VSEQ.unlock){const ut=t-VSEQ.unlock,sl=Math.round(Math.max(0,1-ut/.3)*60),y=y0+82;if(!VIC.ticks.u){VIC.ticks.u=1;sfx('pickup');}
   {const hs=heroSpr(d.unlock.k,0);ctx.drawImage(hs.c,WIZ.idle[Math.floor(time*2.5)%2]*hs.fw,0,hs.fw,hs.fw?hs.fh:0,x+100+sl,y-8,hs.fw,hs.fh);}txt('NEW WARRIOR!',x+6+sl,y,Math.floor(time*6)%2?'#fff':'#ffd040');txt(d.unlock.n,x+6+sl,y+9,d.unlock.col||'#fff');}}}
 // ---- bottom: ascension unlocked, and the prompt
 if(t>=VSEQ.done){if((d.asc||0)>=0&&meta.ascMax&&t<VSEQ.done+3)ctxt('ASCENSION '+meta.ascMax+' AWAITS',H-20,'#ff80c0');if(Math.floor(time*2)%2===0)ctxt('PRESS ENTER',H-10,'#fff');}
 else ctxt('ENTER: SKIP',H-10,'#ffffff80');}
// draw it instead of the death-style sheet; ENTER first finishes the show, then moves on
{const _r=render;render=function(){if(mode==='win'&&VIC){setView(true);ctx.imageSmoothingEnabled=false;renderVictory();drawCursor();return;}return _r();};}
{const _ok=onKey;onKey=function(c){if(mode==='win'&&VIC&&(c==='Enter'||c==='Space')&&time-VIC.t0<VSEQ.done){VIC.t0=time-VSEQ.done-.01;VIC.ticks={};for(let i=0;i<7;i++)VIC.ticks['L'+i]=1;for(let i=0;i<6;i++)VIC.ticks['r'+i]=1;VIC.ticks.u=1;VIC.stamped=1;VIC.jadeOn=1;return;}
 if(mode==='win'&&(c==='Enter'||c==='Space'))VIC=null;return _ok.apply(this,arguments);};}
