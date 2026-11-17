'use strict';
// ===== THE CAMPFIRE BETWEEN STAGES, rebuilt =====
// The old fire was five flickering bars over two flat glow discs. Now: a ground you stand on, lit by a soft flickering
// pool; a ring of stones; crossed logs with bark and glowing embers; a flame drawn column by column from dark red edges
// through orange and yellow to a white-hot core, its tongues flickering on their own; sparks that rise, drift and cool;
// wisps of smoke; and a tripod with a kettle steaming over it.
function campFire(t){const fx=160,fy=131,flick=.5+.5*Math.sin(t*11)*Math.sin(t*7.3+1);
 // the light on the ground: stacked flattened ellipses, flickering
 for(const [r,a] of [[72,.07],[56,.08],[40,.1],[26,.12]]){ctx.globalAlpha=a+flick*.03;ctx.fillStyle='#f08a3a';ctx.beginPath();ctx.ellipse(fx,fy+2,r+flick*3,(r+flick*3)*.28,0,0,TAU);ctx.fill();}
 ctx.globalAlpha=1;
 // a soft warm glow in the air above the fire
 for(const [r,a] of [[46,.05],[30,.07],[18,.09]]){ctx.globalAlpha=a+flick*.02;ctx.fillStyle='#ffae5a';ctx.beginPath();ctx.ellipse(fx,fy-14,r,r*.8,0,0,TAU);ctx.fill();}
 ctx.globalAlpha=1;
 // the tripod and kettle (behind the flames)
 ctx.fillStyle='#2a1c14';for(const [x0,x1] of [[fx-15,fx-1],[fx+15,fx+1]]){for(let i=0;i<=38;i++){const k=i/38;ctx.fillRect(Math.round(x0+(x1-x0)*k),Math.round(fy+2-38*k),2,1);}}
 ctx.fillRect(fx,fy-38,1,10);
 const kx=fx,ky=fy-25;ctx.fillStyle='#14101a';ctx.fillRect(kx-6,ky-2,13,9);ctx.fillRect(kx-5,ky-3,11,11);
 ctx.fillStyle='#3a3440';ctx.fillRect(kx-5,ky-2,11,8);ctx.fillStyle='#5a5466';ctx.fillRect(kx-5,ky-2,4,6);ctx.fillStyle='#2a2430';ctx.fillRect(kx+3,ky-1,2,6);
 ctx.fillStyle='#7a7488';ctx.fillRect(kx-4,ky-3,9,1);ctx.fillStyle='#14101a';ctx.fillRect(kx-1,ky-5,3,2);
 ctx.fillStyle='#ffb060';ctx.globalAlpha=.55;ctx.fillRect(kx-5,ky+5,11,1);ctx.globalAlpha=1; // firelight on its belly
 for(let i=0;i<4;i++){const k=((t*.5+i/4)%1),x=kx+3+Math.round(Math.sin(t*2+i)*2+k*6),y=Math.round(ky-5-k*16);ctx.globalAlpha=(1-k)*.5;ctx.fillStyle='#d8d4e0';ctx.fillRect(x,y,2,1);}ctx.globalAlpha=1;
 // the stone ring
 const stones=[[-13,1],[-9,3],[-4,4],[1,4],[6,4],[11,3],[14,0],[-12,-2],[12,-2]];
 for(const [dx,dy] of stones){ctx.fillStyle='#14101a';ctx.fillRect(fx+dx-2,fy+dy-2,5,4);ctx.fillStyle='#5a5262';ctx.fillRect(fx+dx-1,fy+dy-1,3,2);ctx.fillStyle='#8a8296';ctx.fillRect(fx+dx-1,fy+dy-1,2,1);ctx.fillStyle='#c08050';ctx.globalAlpha=.4+flick*.2;ctx.fillRect(fx+dx-1,fy+dy-1,3,1);ctx.globalAlpha=1;}
 // logs: two crossed, one behind; bark and glowing ends
 const log=(x0,y0,x1,y1)=>{const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0));for(let i=0;i<=n;i++){const k=i/n,x=Math.round(x0+(x1-x0)*k),y=Math.round(y0+(y1-y0)*k);ctx.fillStyle='#14101a';ctx.fillRect(x-1,y-2,3,5);}
  for(let i=0;i<=n;i++){const k=i/n,x=Math.round(x0+(x1-x0)*k),y=Math.round(y0+(y1-y0)*k);ctx.fillStyle='#5a3a24';ctx.fillRect(x,y-1,1,3);ctx.fillStyle='#8a5a34';ctx.fillRect(x,y-1,1,1);if(i%3===0){ctx.fillStyle='#3a2416';ctx.fillRect(x,y+1,1,1);}}
  for(const [x,y] of [[x0,y0],[x1,y1]]){ctx.fillStyle='#c09060';ctx.fillRect(Math.round(x)-1,Math.round(y)-1,2,2);}};
 log(fx-11,fy-1,fx+10,fy+2);log(fx-10,fy+2,fx+11,fy-1);
 // embers glowing in the logs
 for(let i=0;i<9;i++){const x=fx-8+((i*7)%17),y=fy-1+((i*3)%4),on=Math.sin(t*6+i*2.1)>-.2;ctx.fillStyle=on?(i%2?'#ff7020':'#ffb040'):'#a03010';ctx.fillRect(x,y,1,1);}
 // the flame: column by column, layered from the outside in
 const hAt=(x)=>{const e=1-(x/9.5)**2;if(e<=0)return 0;return (17+5*flick)*e*(.72+.28*Math.sin(t*13+x*1.7)*Math.sin(t*5.1+x*.9))+ (Math.abs(x)<3?3*Math.sin(t*9+x):0);};
 for(let x=-9;x<=9;x++){const h=hAt(x),bx=fx+x,by=fy-1;if(h<=0)continue;
  const lay=[[1,'#b0201a'],[.78,'#ff6a1e'],[.55,'#ffa834'],[.32,'#ffe070'],[.15,'#fff8d8']];
  for(const [k,c] of lay){const hh=Math.round(h*k);if(hh<1)continue;const w=Math.abs(x)>9.5*k+1?0:1;if(!w)continue;ctx.fillStyle=c;ctx.fillRect(bx,by-hh,1,hh);}}
 // tongues that break off the top
 for(let i=0;i<4;i++){const k=((t*1.6+i*.27)%1),x=fx+Math.round(Math.sin(i*2.3+t*3)*4),y=Math.round(fy-16-k*10-flick*3);ctx.fillStyle=k<.4?'#ffa834':k<.75?'#ff6a1e':'#b0201a';ctx.fillRect(x,y,1,2-(k>.6?1:0));}
 // sparks rising, drifting and cooling
 for(let i=0;i<16;i++){const k=((t*.45+i/16)%1),sw=Math.sin(t*1.7+i*1.3)*k*12,x=Math.round(fx+(i%5-2)*2+sw),y=Math.round(fy-12-k*58);
  ctx.globalAlpha=1-k*.8;ctx.fillStyle=k<.3?'#fff2b0':k<.6?'#ffb040':'#d04a20';ctx.fillRect(x,y,k<.2&&i%3===0?2:1,1);}
 ctx.globalAlpha=1;
 // smoke wisps
 for(let i=0;i<6;i++){const k=((t*.18+i/6)%1),x=Math.round(fx+Math.sin(t*.7+i)*6+k*14),y=Math.round(fy-26-k*50),r=2+Math.round(k*5);ctx.globalAlpha=(1-k)*.13;ctx.fillStyle='#b8b0c4';ctx.beginPath();ctx.ellipse(x,y,r,r*.7,0,0,TAU);ctx.fill();}
 ctx.globalAlpha=1;return flick;}
// the camp scene, with the new fire and the firelight on the two figures
masterCamp=function(t,accent){
 const g=ctx.createLinearGradient(0,33,0,136);g.addColorStop(0,'#100c1f');g.addColorStop(1,'#342132');ctx.fillStyle=g;ctx.fillRect(0,32,W,107);
 for(let i=0;i<55;i++){const h=hash(i,CS.next),x=Math.floor(hash(i,9)*W),y=34+Math.floor(hash(i,37)*59),tw=Math.sin(t*2+i)>.6;ctx.fillStyle=h>.81||tw?'#b1a1b5':'#51425b';ctx.fillRect(x,y,h>.96?2:1,1);}
 disc(255,57,13,'#e4c99b');disc(260,53,12,'#1b1025');
 for(let layer=0;layer<3;layer++)for(let x=0;x<W;x++){const y=88+layer*13+Math.round(Math.sin(x*.024+layer)*9+Math.sin(x*.064-layer)*5);ctx.fillStyle=['#291b31','#201726','#16121e'][layer];ctx.fillRect(x,y,1,139-y);}
 const palace=220;ctx.fillStyle='#130f1b';ctx.fillRect(palace,81,46,28);
 for(let i=0;i<3;i++){const w=34-i*8,y=80-i*8,x=palace+24-w/2;ctx.fillRect(x+4,y-7,w-8,7);ctx.fillRect(x,y,w,2);ctx.fillStyle=accent;ctx.fillRect(palace+23,y-4,2,2);ctx.fillStyle='#130f1b';}
 for(const x of [8,14,26,296,306,315]){ctx.fillStyle='#121a18';ctx.fillRect(x,34,2,104);for(let y=40;y<134;y+=14)ctx.fillRect(x-2,y,6,1);}
 // the ground they sit on
 ctx.fillStyle='#1c1520';ctx.fillRect(0,126,W,13);ctx.fillStyle='#241a28';for(let x=0;x<W;x+=7)ctx.fillRect(x+(x*13)%5,127+((x*7)%9),3,1);
 const flick=campFire(t);
 shadow(91,134,29);shadow(226,134,29);
 drawSpr({...heroSpr('wizard',9),sc:2},91,134,false,WIZ.idle[Math.floor(time*2.5)%2],false);
 const elapsed=time-CS.pageAt,change=CS.step===1,form=change&&elapsed<.32?CS.from:P.evo||0;
 const hero={...heroSpr(CLS().k,form),sc:2},frame=WIZ.idle[Math.floor(time*2.5)%2];
 drawSpr(hero,226,134,false,frame,true);
 if(change){const k=clamp(elapsed/1.4,0,1);
  if(meta.opt.flash&&k<.8){ctx.globalAlpha=(1-k)*.55;drawSpr(hero,226,134,true,frame,true);ctx.globalAlpha=1;}
  if(k<1)for(let i=0;i<17;i++){const a=i/17*TAU+elapsed*1.4,r=8+k*38;ctx.fillStyle=i%3?'#e6ac71':'#fff5bd';ctx.fillRect(Math.round(226+Math.cos(a)*r),Math.round(114+Math.sin(a)*r*.42-k*18),1,2);}}};
