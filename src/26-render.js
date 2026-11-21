'use strict';
// HELL OF THE EMPEROR - rendering and HUD (part of the former game.js; files load in numeric order, see index.html)
// ---------- rendering ----------
function drawSpr(s,x,feetY,white,frame,flip){
 const fw=s.fw,fh=s.fh,sc=s.sc,src=white?s.wc:s.c,fr=s.frames>1?(frame%s.frames):0;
 const dx=Math.round(x-fw*sc/2),dy=Math.round(feetY-fh*sc);
 if(flip){ctx.save();ctx.translate(dx+fw*sc,dy);ctx.scale(-1,1);ctx.drawImage(src,fr*fw,0,fw,fh,0,0,fw*sc,fh*sc);ctx.restore();}
 else ctx.drawImage(src,fr*fw,0,fw,fh,dx,dy,fw*sc,fh*sc);
}
// ---------- isometric projection ----------
// Simulation runs in flat world coords (x,y). Drawing projects: iso.x = x-y, iso.y = (x+y)/2  (2:1 diamond tiles 32x16)
function wdisc(x,y,r,col){const cx=sx(x,y),cy=sy(x,y),rx=Math.max(1,Math.round(r*1.414)),ry=Math.max(1,Math.round(r*.707));ctx.fillStyle=col;for(let j=-ry;j<=ry;j++){const w=Math.floor(rx*Math.sqrt(Math.max(0,1-(j*j)/(ry*ry))));ctx.fillRect(cx-w,cy+j,w*2+1,1);}}
function wcirc(x,y,r,col){ctx.fillStyle=col;const n=Math.max(16,Math.floor(r*3));for(let i=0;i<n;i++){const a=i/n*TAU,wx=x+Math.cos(a)*r,wy=y+Math.sin(a)*r;ctx.fillRect(sx(wx,wy),sy(wx,wy),1,1);}}
function wline(x0,y0,a,r0,r1,col,lift){ctx.fillStyle=col;const l=lift||0;for(let r=r0;r<=r1;r+=.5){const x=x0+Math.cos(a)*r,y=y0+Math.sin(a)*r;ctx.fillRect(sx(x,y),sy(x,y)-l,1,1);}}
function sline(x0,y0,x1,y1,col){ctx.fillStyle=col;const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0))|0;for(let i=0;i<=n;i++){const t=n?i/n:0;ctx.fillRect(Math.round(x0+(x1-x0)*t),Math.round(y0+(y1-y0)*t),1,1);}}
function tdiamond(tx,ty,col){const X=sx(tx*T,ty*T),Y=sy(tx*T,ty*T);ctx.fillStyle=col;for(let j=0;j<TILEH;j++){const half=dHalf(j);ctx.fillRect(X-half,Y+j,half*2,1);}}
function shadow(x,y,w){ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(Math.round(x-w/2),Math.round(y),w,2);}
function sprOf(e){if(e.sprOv)return e.sprOv;const key=e.boss?'boss'+e.di:e.type;const o=OV[key];return (o&&o.ok)?o:(e.boss?(e.spr2&&e.hp<e.maxhp*.5?e.spr2:e.spr):getSpr(e.type,e.di));}
function drawEnemy(e){
 if(e.ghost)return; // a squad's invisible coordinator
 if(e.boss&&e.awake){ // boss state visuals: a guard bubble during minion events, a burning aura below a quarter health
  if(e.ev&&e.ev.mins&&e.ev.mins.some(m=>!m.dead)){ctx.globalAlpha=.35+.15*Math.sin(time*6);wcirc(e.x,e.y,e.r+8,'#80c0ff');wcirc(e.x,e.y,e.r+10,'#ffffff');ctx.globalAlpha=1;}
  if(e.hp<e.maxhp*.25){ctx.globalAlpha=.25+.15*Math.sin(time*10);wdisc(e.x,e.y,e.r+5,bsty(e).c);ctx.globalAlpha=1;if(Math.random()<.4)particles.push({x:e.x+rnd(-e.r,e.r),y:e.y+rnd(-4,4),vx:0,vy:-30,t:.4,col:bsty(e).c});}
  if(e.air&&e.z>60){const X=sx(e.x,e.y),Y=sy(e.x,e.y);ctx.globalAlpha=.5;wdisc(e.x,e.y,e.r+4,'#000');ctx.globalAlpha=1;if(e.ceil)wcirc(e.x,e.y,e.r+4+Math.sin(time*14)*2,'#ff4040');return;}}
 // recoil: the sprite jerks back along the hit direction for a moment
 let kx=0,ky=0,settle=0;if(e.kick&&e.kick.t>0){const k=e.kick.t/(e.kick.dur||.12),v=scrVec(Math.cos(e.kick.a),Math.sin(e.kick.a));kx=Math.round(v[0]*e.kick.p*k);ky=Math.round(v[1]*e.kick.p*k);settle=Math.round((e.kick.drop||0)*k*k);}
 const s=sprOf(e),X=sx(e.x,e.y)+kx,Y=sy(e.x,e.y)+ky+Math.min(6,Math.round(e.r*.6))+2,H0=s.fh*s.sc;let frame=Math.floor(time*4+e.wob);
 shadow(X,Y-2,Math.round(e.r*2+6));
 if(e.elite){ctx.globalAlpha=.7;wcirc(e.x,e.y,e.r+3+Math.sin(time*6),ELMOD[e.elite].c);ctx.globalAlpha=1;}
 const blink=e.tele>0&&Math.floor(time*16)%2===0;
 const flip=(!!s.animal||!!s.bossSpr)&&sx(P.x,P.y)<X;if(s.bossSpr)frame=s.pick?s.pick(e):(e.act||e.storm>0?2:Math.floor(time*2.5)%2);const fy=e.t&&e.t.fly?Math.round(6+Math.sin(time*5+e.wob)*2):0;
 if(settle){ctx.save();const foot=Y-e.z-fy;ctx.translate(X,foot);ctx.scale(1+settle*.025,1-settle*.045);drawSpr(s,0,0,e.flash>0||blink,frame,flip);ctx.restore();}
 else drawSpr(s,X,Y-e.z-fy,e.flash>0||blink,frame,flip);
 if(e.mode&&((e.mode.k==='dashes'||e.mode.k==='stampede')&&e.mode.ph===0||e.mode.k==='cavalry'&&e.mode.ph===1)&&e.mode.da!=null){const wide=e.mode.k==='stampede'||e.mode.k==='cavalry';ctx.fillStyle=Math.floor(time*16)%2?'rgba(255,60,60,.9)':'rgba(255,200,80,.9)';
  if(wide)for(const off of [-e.r,e.r])for(let r=8;r<300;r+=4){const x=e.x+Math.cos(e.mode.da)*r-Math.sin(e.mode.da)*off,y=e.y+Math.sin(e.mode.da)*r+Math.cos(e.mode.da)*off;ctx.fillRect(sx(x,y)-1,sy(x,y),2,1);}
  for(let r=8;r<(wide?300:115);r+=3){const x=e.x+Math.cos(e.mode.da)*r,y=e.y+Math.sin(e.mode.da)*r;ctx.fillRect(sx(x,y)-1,sy(x,y),3,1);}}
 if(e.mode&&e.mode.k==='chase'){ctx.globalAlpha=.4+.2*Math.sin(time*12);wcirc(e.x,e.y,e.r+6,'#f33');ctx.globalAlpha=1;}
 if(e.st&&e.st.frozen>0){ctx.globalAlpha=.55;drawSpr(s,X,Y-e.z,true,frame,false);ctx.globalAlpha=.3;ctx.fillStyle='#8cf';ctx.fillRect(X-Math.round(s.fw*s.sc/2),Y-H0,s.fw*s.sc,H0);ctx.globalAlpha=1;}
 if(e.awake&&!e.stag&&!e.air&&(!s.ok||e.act)&&e.t.wl){const a=e.act?e.act.ang:angTo(e,P);wline(e.x,e.y,a,4,4+e.t.wl*(e.boss?1.3:1),e.boss?'#eee':'#cbd',Math.round(H0*.35));}
 if(e.shield){const fa=e.fa||0;ctx.fillStyle='#9ab';for(let k=-4;k<=4;k++){const a=fa+k*.2,wx=e.x+Math.cos(a)*(e.r+4),wy=e.y+Math.sin(a)*(e.r+4);ctx.fillRect(sx(wx,wy),sy(wx,wy)-Math.round(H0*.3),2,3);}}
 if(e.act&&e.act.ph===0&&e.tele>0)txt('!',X-1,Y-H0-8,e.tele===2?'#f33':'#fc4',e.tele===2?2:1);
 if(e.stag>0){for(let i=0;i<3;i++){const a=time*6+i*2.1;ctx.fillStyle='#fd4';ctx.fillRect(Math.round(X+Math.cos(a)*7),Math.round(Y-H0+4+Math.sin(a)*2),2,2);}}
 if(!e.boss&&(e.hp<e.maxhp||e.posture>0||e.elite||e.label)&&!e.prop||e.prop&&e.hp<e.maxhp){
  const w=e.elite||e.label?20:12,x=X-(w>>1),y=Y-H0-6;ctx.fillStyle='#000';ctx.fillRect(x-1,y-1,w+2,e.posture>0?6:4);ctx.fillStyle=e.label?'#e04040':'#a22';ctx.fillRect(x,y,Math.round(w*Math.max(0,e.hp)/e.maxhp),2);
  if(e.posture>0){ctx.fillStyle='#fd4';ctx.fillRect(x,y+3,Math.round(w*Math.min(1,e.posture/e.maxPosture)),1);}
  if(e.label)txt(e.label,X-Math.round(txtW(e.label)/2),y-7,e.labelC||'#fff');
  else if(e.elite)txt(ELMOD[e.elite].n,X-Math.round(txtW(ELMOD[e.elite].n)/2),y-7,ELMOD[e.elite].c);
  if(e.st){let k=0;for(const [key,c] of [['burn','#f80'],['poison','#8c4'],['chillT','#8cf'],['shock','#ff4']])if(e.st[key]>0){ctx.fillStyle=c;ctx.fillRect(x+k*4,y-3,3,2);k++;}}
 }
}
let merchantSpr=null;
function drawPlayer(){
 if(P.dying>0){drawDeathBody();return;}
 // walking up the screen (away from the camera) shows the back-view sheet
 const p=P,away=p.mv&&scrVec(p.mvx||0,p.mvy||0)[1]<-.15&&!(p.dash>0);
 const s=heroSpr(CLS().k,p.evo||0,away),X=sx(p.x,p.y),Y=sy(p.x,p.y)+3;
 // pick the animation: dash > spell pose > walk > idle
 const st=p.dash>0?'dash':p.animT>0?p.animK:p.mv?'walk':'idle',seq=WIZ[st];
 // attack: wind-up, strike, follow-through across the animation; idle: every few seconds the class flourish (frame 15)
 const ap=p.animD?1-p.animT/p.animD:1;
 const fr=st==='walk'?seq[Math.floor(time*10)%4]:st==='idle'?(Math.floor(time*2.5)%10>=8?15:seq[Math.floor(time*2.5)%2]):st==='atk'?seq[ap<.3?0:ap<.7?1:2]:st==='cast'?seq[Math.floor(time*14)%2]:seq[0];
 const flip=st==='dash'?scrVec(p.dx,p.dy)[0]<0:p.face<0;
 shadow(X,Y-2,7);
 if(st==='dash'){for(let i=1;i<=3;i++){ctx.globalAlpha=.32-i*.08;const bx=sx(p.x-p.dx*i*6,p.y-p.dy*i*6),by=sy(p.x-p.dx*i*6,p.y-p.dy*i*6)+3;drawSpr(s,bx,by,true,fr,flip);}ctx.globalAlpha=1;}
 p.liqv=liqAt(p.x,p.y);
 if(p.iv>0&&p.dash>0){ctx.globalAlpha=.7;}
 else if((p.iv>0||p.hurtIv>0)&&p.flash<=0&&Math.floor(time*20)%2===0)ctx.globalAlpha=.45;
 // aim spark orbiting the wizard: behind the body when aiming "up" the screen
 const a=p.aim,twx=p.x+Math.cos(a)*11,twy=p.y+Math.sin(a)*11,ttx=sx(twx,twy),tty=sy(twx,twy)-8;
 const tal=()=>{const al=ctx.globalAlpha;ctx.globalAlpha=1;ctx.fillStyle='#14101a';ctx.fillRect(ttx-1,tty-1,3,3);ctx.fillStyle=Math.floor(time*8)%2?'#ffe080':'#ff8a30';ctx.fillRect(ttx,tty,1,1);ctx.globalAlpha=al;};
 const behind=twx+twy<p.x+p.y;
 if(behind)tal();
 // standing in liquid hides the boots
 const wet=p.liqv&&p.liqv!==4&&st!=='dash';
 if(wet){ctx.save();ctx.beginPath();ctx.rect(X-12,Y-30,24,28);ctx.clip();}
 drawSpr(s,X,Y,p.flash>0,fr,flip);
 if(wet){ctx.restore();ctx.fillStyle=map.env.lc[2];ctx.globalAlpha=.7;ctx.fillRect(X-5,Y-2,10,1);ctx.globalAlpha=1;}
 ctx.globalAlpha=1;
 if(!behind)tal();
 // casting glow around the staff orb
 const ult=st==='ult'&&SPELLS.e[p.lo.e]?.n;
 if((ult&&ult!=='SHADOW CLONES'&&ult!=='SIEGEBREAKER')||(st==='cast'&&CLS().k!=='archer')||(st==='atk'&&fr===13&&CLS().k==='wizard')){const ox=X+(flip?-1:1)*(st==='ult'?0:5),oy=Y-(st==='ult'?23:st==='atk'?18:22);ctx.globalAlpha=.35+.25*Math.sin(time*30);disc(ox,oy,st==='ult'?6:4,st==='ult'?'#fd4':'#ffb050');ctx.globalAlpha=1;ctx.fillStyle='#fff';ctx.fillRect(ox,oy,1,1);
  if(st==='ult'){circ(X,Y-12,14+Math.sin(time*20)*2,'#fd4');for(let i=0;i<6;i++){const an=time*6+i*TAU/6;ctx.fillStyle='#fd4';ctx.fillRect(Math.round(X+Math.cos(an)*12),Math.round(Y-12+Math.sin(an)*6),1,2);}}}
 if(p.evoT>0){ctx.globalAlpha=Math.min(.6,p.evoT*.5);disc(X,Y-11,10+Math.round((1.2-p.evoT)*14),'#ffe060');ctx.globalAlpha=1;}
 if(p.aegis>0){const pulse=Math.sin(time*10)*1.5;ctx.globalAlpha=.2;disc(X,Y-11,14,'#fff4b0');ctx.globalAlpha=1;circ(X,Y-11,14+pulse,'#fff4b0');circ(X,Y-11,10-pulse,'#fff');for(let i=0;i<6;i++){const an=-time*3+i*TAU/6;ctx.fillStyle=i%2?'#fff':'#fd4';ctx.fillRect(Math.round(X+Math.cos(an)*15),Math.round(Y-11+Math.sin(an)*15),2,2);}}
 if(p.ward>0){const pulse=Math.sin(time*14)*1.2;ctx.globalAlpha=.16;wdisc(p.x,p.y,11,'#8cf');disc(X,Y-11,12,'#8cf');ctx.globalAlpha=1;wcirc(p.x,p.y,11+pulse,'#8cf');circ(X,Y-11,12+pulse,'#8cf');for(let i=0;i<4;i++){const an=time*4+i*TAU/4;ctx.fillStyle='#fff';ctx.fillRect(Math.round(X+Math.cos(an)*12),Math.round(Y-11+Math.sin(an)*12),2,2);}}
 if(p.haste>0){ctx.fillStyle='#8f8';for(let i=0;i<3;i++)ctx.fillRect(X-6+((time*40+i*9)%12),Y-4-i*5,2,1);}
 if(p.stag>0){for(let i=0;i<3;i++){const an=time*7+i*2.1;ctx.fillStyle='#fd4';ctx.fillRect(Math.round(X+Math.cos(an)*7),Math.round(Y-27+Math.sin(an)*2),2,2);}}
}
function drawTele(e){
 const a=e.act;if(!a||a.ph!==0||!e.awake)return;
 const col=a.peril?'rgba(255,40,40,':'rgba(255,200,80,';
 if(a.n==='slam'){const k=a.t/a.w;ctx.globalAlpha=.25;wdisc(e.x,e.y,a.rad*Math.min(1,k),a.peril?'#f22':'#fa4');ctx.globalAlpha=1;wcirc(e.x,e.y,a.rad,a.peril?'#f55':'#fb6');}
 else if(a.n==='leap'&&a.tx!==undefined){ctx.globalAlpha=.25;wdisc(a.tx,a.ty,a.rad,'#f22');ctx.globalAlpha=1;wcirc(a.tx,a.ty,a.rad,'#f55');}
 else if(a.n==='thrust'||a.n==='charge'){const len=a.n==='thrust'?a.dist:a.sp*a.dur;ctx.fillStyle=col+'.55)';for(let r=8;r<len;r+=3){const x=e.x+Math.cos(a.ang)*r,y=e.y+Math.sin(a.ang)*r;ctx.fillRect(sx(x,y),sy(x,y),1,1);}}
 else if(a.n==='slash'){const st=a.ang-a.arc*Math.PI/360,en=a.ang+a.arc*Math.PI/360;ctx.fillStyle=col+'.5)';for(let s=st;s<=en;s+=.1){const x=e.x+Math.cos(s)*a.range,y=e.y+Math.sin(s)*a.range;ctx.fillRect(sx(x,y),sy(x,y),1,1);}}
 else if(a.n==='shoot'&&a.line){ctx.fillStyle='rgba(255,60,60,.7)';for(let r=10;r<220;r+=3){const x=e.x+Math.cos(a.ang)*r,y=e.y+Math.sin(a.ang)*r;ctx.fillRect(sx(x,y),sy(x,y)-6,1,1);}}
 else if(a.n==='blink'){wcirc(e.x,e.y,10,'#c8f');}
}
// boss arena: a rune circle in the dungeon's accent colour that flares red while the fight is on
function drawArena(){if(!map||map.train||!map.bossRoom)return;const br=map.bossRoom,cx=(br.x+br.w/2)*T,cy=(br.y+br.h/2)*T,X=sx(cx,cy),Y=sy(cx,cy);if(X<-200||X>W+200||Y<-120||Y>H+120)return;
 const live=boss&&boss.awake&&!boss.dead,c=live?'#ff4040':map.env.lc[2];
 ctx.globalAlpha=live?.55:.3;wcirc(cx,cy,br.w*T*.36,c);wcirc(cx,cy,br.w*T*.36-4,c);wcirc(cx,cy,br.w*T*.2,c);
 for(let i=0;i<12;i++){const a=i/12*TAU+time*.15,rr=br.w*T*.36-2,x=cx+Math.cos(a)*rr,y=cy+Math.sin(a)*rr;ctx.fillStyle=c;ctx.fillRect(sx(x,y)-1,sy(x,y)-1,3,3);}
 for(let i=0;i<6;i++){const a=i/6*TAU-time*.25,x1=cx+Math.cos(a)*br.w*T*.2,y1=cy+Math.sin(a)*br.w*T*.2,x2=cx+Math.cos(a+TAU/3)*br.w*T*.2,y2=cy+Math.sin(a+TAU/3)*br.w*T*.2;sline(sx(x1,y1),sy(x1,y1),sx(x2,y2),sy(x2,y2),c);}
 ctx.globalAlpha=1;}
function drawGround(){
 drawArena();drawBossFloor();
 for(const t of traps){const st=trapState(t);if(st===0){tdiamond(t.tx,t.ty,'rgba(0,0,0,.28)');}else if(st===1){tdiamond(t.tx,t.ty,Math.floor(time*10)%2?'rgba(255,200,60,.55)':'rgba(255,120,40,.4)');}else{tdiamond(t.tx,t.ty,'rgba(255,40,40,.7)');const X=sx(t.tx*T+8,t.ty*T+8),Y=sy(t.tx*T+8,t.ty*T+8);ctx.fillStyle='#fff';for(let k=-6;k<=6;k+=4)ctx.fillRect(X+k,Y-5,2,5);}}
 for(const z of zones){
  if(z.k&&CZD[z.k]){CZD[z.k](z);continue;}
  if(z.k==='grav'&&z.hole){const pr=1-Math.max(0,z.t)/z.dur;ctx.globalAlpha=.3+.2*pr;wdisc(z.x,z.y,z.r,'#1a0830');ctx.globalAlpha=.5;wdisc(z.x,z.y,z.r*.35,'#000');ctx.globalAlpha=1;wcirc(z.x,z.y,z.r,'#c080ff');wcirc(z.x,z.y,z.r*.35+Math.sin(time*12)*1.5,'#fff');
   for(let i=0;i<14;i++){const a=-time*5+i*TAU/14,rr=z.r*(1-((time*.9+i/14)%1)),wx=z.x+Math.cos(a)*rr,wy=z.y+Math.sin(a)*rr;ctx.fillStyle=i%3?'#c080ff':'#fff';ctx.fillRect(sx(wx,wy),sy(wx,wy),2,1);}continue;}
  if(z.k==='grav'){const pr=1-Math.max(0,z.t)/2.2;ctx.globalAlpha=.18+.15*pr;wdisc(z.x,z.y,z.r,'#529');ctx.globalAlpha=1;wcirc(z.x,z.y,z.r,'#a6f');wcirc(z.x,z.y,z.r*(1-pr),'#fff');for(let i=0;i<6;i++){const a=-time*4+i*1.05,rr=z.r*(.3+.6*((time*.8+i/6)%1)),wx=z.x+Math.cos(a)*rr,wy=z.y+Math.sin(a)*rr;ctx.fillStyle='#c8f';ctx.fillRect(sx(wx,wy),sy(wx,wy),2,1);}continue;}
  if(z.k==='totem'){ctx.globalAlpha=.08;wdisc(z.x,z.y,z.r,'#ff6');ctx.globalAlpha=1;const X=sx(z.x,z.y),Y=sy(z.x,z.y);ctx.fillStyle='#000';ctx.fillRect(X-3,Y-15,6,16);ctx.fillStyle='#8a5a2a';ctx.fillRect(X-2,Y-14,4,14);ctx.fillStyle='#c8283c';ctx.fillRect(X-2,Y-11,4,2);ctx.fillStyle=Math.floor(time*8)%2?'#ff6':'#fff';ctx.fillRect(X-1,Y-17,2,2);continue;}
  ctx.globalAlpha=.2;wdisc(z.x,z.y,z.r,'#8cf');ctx.globalAlpha=1;wcirc(z.x,z.y,z.r,'#8cf');wcirc(z.x,z.y,z.r*.6,'#4af');for(let i=0;i<5;i++){const a=time*1.5+i*1.26,wx=z.x+Math.cos(a)*z.r*.8,wy=z.y+Math.sin(a)*z.r*.8;ctx.fillStyle='#fff';ctx.fillRect(sx(wx,wy),sy(wx,wy),2,1);}}
 for(const h of hz){ctx.globalAlpha=.25+.15*Math.sin(time*12+h.x);wdisc(h.x,h.y,h.r,h.col||'#f60');ctx.globalAlpha=1;if(Math.random()<.3){ctx.fillStyle='#fd4';const wx=h.x+rnd(-h.r,h.r)*.6,wy=h.y+rnd(-h.r,h.r)*.6;ctx.fillRect(sx(wx,wy),sy(wx,wy)-rnd(1,6)|0,1,2);}}
 for(const d of dh){const k=1-d.t/d.dur;ctx.globalAlpha=.22;wdisc(d.x,d.y,d.r*Math.min(1,k*1.1),d.col||'#f22');ctx.globalAlpha=1;wcirc(d.x,d.y,d.r,d.col||'#f55');}
 for(const e of enemies)if(!e.dead&&e.act&&e.act.ph===0)drawTele(e);
}
// Lacquered tansu chest. Pixel-rasterized faces keep the angled boards crisp on the game canvas.
const CHEST_ART=Array.from({length:4},(_,frame)=>outlined(mk(36,31,g=>{
 const px=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h);};
 const face=(points,c)=>{
  const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);
  g.fillStyle=c;
  for(let y=Math.min(...ys);y<Math.max(...ys);y++){
   const crossings=[];
   for(let i=0;i<points.length;i++){
    const [x0,y0]=points[i],[x1,y1]=points[(i+1)%points.length];
    if((y0>y+.5)!==(y1>y+.5))crossings.push(x0+(y+.5-y0)/(y1-y0)*(x1-x0));
   }
   crossings.sort((a,b)=>a-b);
   for(let i=0;i+1<crossings.length;i+=2){
    const x=Math.ceil(crossings[i]-.5),right=Math.ceil(crossings[i+1]-.5);
    g.fillRect(x,y,right-x,1);
   }
  }
 };
 const amber=frame?'#ba8548':'#ecb65b',brass='#925432',shade='#641f28';
 // Feet, tapered end panel and recessed front board.
 px(7,25,4,4,'#5e3335');px(23,25,4,4,'#5e3335');px(30,20,3,4,'#492530');
 face([[26,17],[33,13],[33,23],[26,28]],shade);
 face([[4,17],[26,17],[26,28],[4,28]],'#a63538');
 px(5,19,20,1,'#d05a4a');px(6,21,18,5,'#842831');px(7,22,16,1,'#a53636');px(5,27,21,1,'#63212c');
 face([[26,25],[33,20],[33,22],[26,27]],brass);
 px(7,18,2,9,brass);px(8,18,1,8,amber);px(22,18,2,9,brass);px(22,18,1,8,amber);
 px(5,26,4,1,amber);px(22,26,4,1,amber);
 face([[4,17],[12,12],[33,12],[26,17]],'#c19359');
 face([[7,16],[13,13],[30,13],[24,16]],'#2c1822');
 if(!frame){
  face([[4,14],[11,9],[32,9],[26,14]],'#d95547');
  face([[26,14],[32,9],[33,13],[26,18]],'#8b3034');
  px(4,14,22,4,'#b6403c');px(5,17,21,1,amber);
  face([[7,14],[14,9],[16,9],[9,14]],amber);
  face([[22,14],[29,9],[31,9],[24,14]],amber);
  px(8,14,1,3,amber);px(22,14,1,3,amber);
  px(13,16,5,5,brass);px(14,16,3,4,'#ffe08d');px(15,17,1,2,'#452731');
 }else{
  const lift=[0,3,7,10][frame],rise=[0,3,5,6][frame];
  face([[11-rise,11-lift],[31-rise,11-lift],[33,12],[12,12]],'#883038');
  face([[12-rise,12-lift],[31-rise,12-lift],[31,11],[13,11]],'#542533');
  px(12-rise,11-lift,19,1,amber);
  if(frame>1){
   face([[13-rise,13-lift],[15-rise,13-lift],[15,11],[13,11]],brass);
   face([[27-rise,13-lift],[29-rise,13-lift],[29,11],[27,11]],brass);
  }
  px(13,17,5,3,brass);px(14,17,3,1,'#c49862');
 }
})));
function drawChest(p,X,Y){
 const age=p.openedAt==null?1:time-p.openedAt;
 const frame=p.used?Math.min(3,1+Math.floor(Math.max(0,age)/.065)):0;
 shadow(X+1,Y,28);
 ctx.drawImage(CHEST_ART[frame],Math.round(X-17),Math.round(Y-29));
 if(!p.used){
  // A tiny glint on the clasp, timed per chest so multiple chests don't blink in sync.
  const glint=(time+hash(Math.floor(p.x),Math.floor(p.y))*2)%3.1;
  if(glint<.27){
   ctx.fillStyle='#fff3bd';ctx.fillRect(Math.round(X-4),Math.round(Y-14),5,1);
   ctx.fillRect(Math.round(X-2),Math.round(Y-16),1,5);
  }
 }
}
function drawProp(p){
 if(p.k==='doorpost'||p.k==='entrancePlaque'){drawEntrance(p,sx(p.x,p.y),sy(p.x,p.y));return;}
 const X=sx(p.x,p.y),Y=sy(p.x,p.y);
 if(p.k==='chest')drawChest(p,X,Y);
 else if(p.k==='altar'){ // shrine: a wooden offering table with shide streamers and a violet spirit orb; curse: an obsidian block with a floating red-eyed skull
  shadow(X,Y,20);const cu=p.curse;
  ctx.fillStyle='#14101a';ctx.fillRect(X-10,Y-12,20,12);
  ctx.fillStyle=cu?'#1a1418':'#5a3a20';ctx.fillRect(X-9,Y-11,18,10);ctx.fillStyle=cu?'#3a2a30':'#7a5230';ctx.fillRect(X-9,Y-11,18,2);
  const R1=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(X+x,Y+y,w,h);};
  if(cu){const C=CURSES[p.ck||'frail'];R1(-1,-8,2,5,C.c);R1(-3,-6,6,1,C.c);
   // each curse gets a carved sigil on the block's corners
   if(p.ck==='glass'){R1(-8,-9,2,2,'#c8ecff');R1(6,-9,2,2,'#c8ecff');R1(-7,-4,1,2,'#9ad8ff');R1(6,-4,1,2,'#9ad8ff');}
   else if(p.ck==='greed'){R1(-8,-8,3,3,'#ffd040');R1(5,-8,3,3,'#ffd040');R1(-7,-7,1,1,'#a08020');R1(6,-7,1,1,'#a08020');}
   else if(p.ck==='fog'){R1(-9,-12,18,2,'rgba(184,176,200,.5)');R1(-6,-14,12,2,'rgba(184,176,200,.35)');}
   else if(p.ck==='frenzy'){R1(-8,-9,1,4,'#40e0e0');R1(-7,-7,1,1,'#40e0e0');R1(7,-9,1,4,'#40e0e0');R1(6,-7,1,1,'#40e0e0');}
   else if(p.ck==='hunted'){R1(-8,-9,3,1,'#c070ff');R1(-7,-8,1,3,'#c070ff');R1(5,-9,3,1,'#c070ff');R1(6,-8,1,3,'#c070ff');}}
  else{const g=p.god||'crane';
   if(g==='fox'){R1(-7,-9,14,4,'#c05020');R1(-6,-10,2,2,'#ff9040');R1(4,-10,2,2,'#ff9040');R1(-4,-8,1,1,'#fff');R1(3,-8,1,1,'#fff');R1(-1,-6,2,1,'#14101a');}
   else if(g==='crane'){R1(-7,-9,14,4,'#f0f0e8');R1(-1,-9,2,1,'#d02030');R1(-5,-7,4,1,'#14101a');R1(1,-7,4,1,'#14101a');}
   else if(g==='ox'){R1(-7,-9,14,4,'#701818');R1(-9,-11,3,1,'#e8e0d0');R1(6,-11,3,1,'#e8e0d0');R1(-9,-10,1,2,'#e8e0d0');R1(8,-10,1,2,'#e8e0d0');R1(-2,-7,4,1,'#ff4040');}
   else{R1(-7,-9,14,4,'#203060');R1(-2,-9,4,4,'#e0e8ff');R1(-1,-9,3,3,'#203060');R1(3,-8,1,1,'#fff');R1(-5,-6,1,1,'#fff');}}
  if(!p.used){const fy=Y-24+Math.round(Math.sin(time*2)*2);ctx.globalAlpha=.3+.2*Math.sin(time*4);disc(X,fy,8,p.col);ctx.globalAlpha=1;
   if(cu){const C=CURSES[p.ck||'frail'];ctx.fillStyle='#14101a';ctx.fillRect(X-4,fy-4,9,9);ctx.fillStyle='#e8e0d0';ctx.fillRect(X-3,fy-3,7,5);ctx.fillRect(X-2,fy+2,5,2);ctx.fillStyle=Math.floor(time*4)%2?C.c:C.sk;ctx.fillRect(X-2,fy-1,2,2);ctx.fillRect(X+1,fy-1,2,2);}
   else{disc(X,fy,3,p.col);ctx.fillStyle='#fff';ctx.fillRect(X-1,fy-1,1,1);}
   if(Math.random()<.08)particles.push({x:p.x+rnd(-16,16),y:p.y+rnd(-12,12),vx:rnd(-3,3),vy:-16,t:.9,col:p.col});}}
 else if(p.k==='gong'){shadow(X,Y,14);ctx.fillStyle='#14101a';ctx.fillRect(X-9,Y-22,2,22);ctx.fillRect(X+7,Y-22,2,22);ctx.fillRect(X-10,Y-24,20,3);ctx.fillStyle='#8a3020';ctx.fillRect(X-9,Y-23,18,1);disc(X,Y-12,6,'#14101a');disc(X,Y-12,5,p.used?'#6a5020':'#d8a030');if(!p.used){ctx.fillStyle='#fff0a0';ctx.fillRect(X-2,Y-15,2,2);ctx.globalAlpha=.3+.2*Math.sin(time*4);disc(X,Y-12,8,'#fc4');ctx.globalAlpha=1;}}
 else if(p.k==='spring'){ // stone-rimmed healing pond: green glow and rising motes until used, then it goes still and dark
  const R0=22;wdisc(p.x,p.y,R0+4,'#4a4a44');wdisc(p.x,p.y,R0+2,'#7a7a72');wdisc(p.x,p.y,R0,p.used?'#1e3a4a':'#2a6a8a');wdisc(p.x,p.y,R0-7,p.used?'#24485a':'#3a8aaa');
  if(!p.used){ctx.globalAlpha=.22+.1*Math.sin(time*2);wdisc(p.x,p.y,R0-2,'#6fffb0');ctx.globalAlpha=1;
   for(let i=0;i<6;i++){const a=time*.6+i*TAU/6,x=p.x+Math.cos(a)*R0*.55,y=p.y+Math.sin(a)*R0*.55;ctx.fillStyle='#cfffe8';ctx.fillRect(sx(x,y),sy(x,y)-((time*14+i*5)%14),1,2);}
   if(Math.random()<.1)particles.push({x:p.x+rnd(-14,14),y:p.y+rnd(-14,14),vx:0,vy:-14,t:1,col:'#8fffc0'});}
  const lx=p.x+9,ly=p.y-7;ctx.fillStyle='#3e8a36';ctx.fillRect(sx(lx,ly)-3,sy(lx,ly),6,2);ctx.fillStyle='#f8b0c8';ctx.fillRect(sx(lx,ly)-1,sy(lx,ly)-1,2,1);}
 else if(p.k==='merchant'){shadow(X,Y+3,18);ctx.globalAlpha=.18+.06*Math.sin(time*3);disc(X+9,Y-4,10,'#ffb040');ctx.globalAlpha=1;drawSpr(MERCH,X,Y+4,false,Math.floor(time*1.6)%2,sx(P.x,P.y)<X);if(dist(p,P)<70){const s=p.line||'WELCOME, TRAVELLER';txt(s,X-Math.round(txtW(s)/2),Y-40,'#e0c070');}}
 else if(p.k==='pedestal'){ // lacquered display stand with a red cloth; the ware floats above in a glow of its colour, with a gold price tag
  shadow(X,Y,16);ctx.fillStyle='#14101a';ctx.fillRect(X-8,Y-8,16,8);ctx.fillStyle='#3a2414';ctx.fillRect(X-7,Y-5,14,5);ctx.fillStyle='#5a3a20';ctx.fillRect(X-7,Y-5,14,1);
  ctx.fillStyle='#a01c18';ctx.fillRect(X-8,Y-8,16,3);ctx.fillStyle='#e0b040';ctx.fillRect(X-8,Y-6,16,1);
  if(!p.sold){const bob=Math.round(Math.sin(time*3+p.x)*1.5),it=p.item?ITEMBY[p.item]:null,gc=it?fxCol(it.id):p.gear?QUAL[p.gear.q].c:p.ench?ENCH.find(x=>x.k===p.ench.k).c:p.reroll?'#ffd040':'#e33',iy=Y-23+bob;
   ctx.globalAlpha=.22+.1*Math.sin(time*3+p.x);disc(X,iy+6,9,gc);ctx.globalAlpha=1;
   if(it)relicBox(X-6,iy,it.id);else if(p.gear)drawItemIcon(p.gear,X-7,iy-1);else if(p.ench){drawItemIcon(p.ench,X-7,iy-1);}
   else if(p.reroll){relicBox(X-6,iy,'echo');ctx.fillStyle='#ffd040';ctx.fillRect(X-3,iy+5,7,1);}
   else if(p.lairKey){ctx.fillStyle='#14101a';ctx.fillRect(X-7,iy+3,15,7);ctx.fillRect(X-6,iy+1,6,10);ctx.fillStyle='#e0b040';ctx.fillRect(X-5,iy+2,4,8);ctx.fillRect(X-1,iy+5,8,2);ctx.fillRect(X+4,iy+7,1,2);ctx.fillRect(X+6,iy+7,1,2);ctx.fillStyle='#14101a';ctx.fillRect(X-4,iy+4,2,4);ctx.fillStyle='#fff6c0';ctx.fillRect(X-5,iy+2,1,1);}
   else{ctx.fillStyle='#000';ctx.fillRect(X-7,iy-1,15,15);ctx.fillStyle='#e33';ctx.fillRect(X-6,iy,13,13);ctx.fillStyle='#14101a';ctx.fillRect(X-5,iy+1,11,11);ctx.fillStyle='#ddd';ctx.fillRect(X-1,iy+2,3,2);ctx.fillStyle='#e33';ctx.fillRect(X-3,iy+4,7,6);ctx.fillStyle='#ff8080';ctx.fillRect(X-2,iy+5,1,3);}
   const aff=R.sen>=p.price,s=String(p.price),tw=txtW(s)+6;ctx.fillStyle='#14101a';ctx.fillRect(X-Math.round(tw/2),iy-10,tw,8);ctx.fillStyle='#e0b040';ctx.fillRect(X-Math.round(tw/2),iy-10,2,8);
   txt(s,X-Math.round(tw/2)+4,iy-9,aff?'#fc4':'#c55');}}
}
function drawFx(f){
 // impact burst: pixel speed-lines radiating from a big hit or a kill
 if(f.k==='burst'){const k=f.t/f.dur,X=sx(f.x,f.y),Y=sy(f.x,f.y)-7,r0=f.r*(1-k)*.6+3,r1=r0+f.r*.55*k+4;ctx.fillStyle=f.col;
  for(let i=0;i<f.n;i++){const a=f.a0+i/f.n*TAU;for(let r=r0;r<r1;r+=1){ctx.fillRect(Math.round(X+Math.cos(a)*r),Math.round(Y+Math.sin(a)*r*.75),1,1);}}
  if(k>.6){ctx.fillStyle='#fff';ctx.globalAlpha=(k-.6)*2.5;disc(X,Y,Math.round(3+f.r*.12),'#fff');ctx.globalAlpha=1;}return;}
 if(f.k==='line'&&!(f.wait>0)){const k=f.t/f.dur,x1=f.x+Math.cos(f.a)*f.len,y1=f.y+Math.sin(f.a)*f.len;ctx.globalAlpha=k;sline(sx(f.x,f.y),sy(f.x,f.y)-7,sx(x1,y1),sy(x1,y1)-7,f.col);sline(sx(f.x,f.y),sy(f.x,f.y)-6,sx(x1,y1),sy(x1,y1)-6,'#fff');ctx.globalAlpha=1;return;}
 if(f.wait>0){if(f.met||f.k==='strike'){ctx.globalAlpha=.35;wcirc(f.x,f.y,f.r*.6,f.col||'#ffffa0');ctx.globalAlpha=1;}return;}
 if(f.k==='strike'){const k=f.t/f.dur,X=sx(f.x,f.y),Y=sy(f.x,f.y)-4;ctx.globalAlpha=k;let qx=X,qy=Y-120;for(let i=1;i<=10;i++){const tx=X+(i<10?rnd(-5,5):0),ty=Y-120+i*12;sline(qx,qy,tx,ty,'#fff');sline(qx+1,qy,tx+1,ty,'#ffffa0');qx=tx;qy=ty;}ctx.fillStyle='#ffffa0';ctx.globalAlpha=k*.5;ctx.fillRect(X-3,Y-120,7,120);ctx.globalAlpha=1;return;}
 if(f.k==='slash'){const k=1-f.t/f.dur,prog=Math.min(1,k*2.2+.2),a0=f.a-f.arc/2;ctx.globalAlpha=Math.min(1,f.t/f.dur*1.6);ctx.fillStyle=f.col;
  for(let a=0;a<=prog*f.arc;a+=.07){const aa=a0+a;for(let r=f.r-4;r<=f.r;r+=1){const x=f.x+Math.cos(aa)*r,y=f.y+Math.sin(aa)*r;ctx.fillRect(sx(x,y),sy(x,y)-6,1,1);}}ctx.globalAlpha=1;}
 else if(f.k==='ring'){const k=1-f.t/f.dur;ctx.globalAlpha=f.t/f.dur;wcirc(f.x,f.y,f.max*k,f.col);wcirc(f.x,f.y,f.max*k*.85,f.col);ctx.globalAlpha=1;}
 else if(f.k==='bolt'){ctx.globalAlpha=Math.min(1,f.t/f.dur*1.5);for(let i=0;i<f.pts.length-1;i++){const a=f.pts[i],b=f.pts[i+1],ax=sx(a.x,a.y),ay=sy(a.x,a.y)-8,bx=sx(b.x,b.y),by=sy(b.x,b.y)-8,n=Math.max(1,Math.ceil(Math.hypot(bx-ax,by-ay)/6));let qx=ax,qy=ay;for(let k=1;k<=n;k++){const tx=ax+(bx-ax)*k/n+(k<n?rnd(-3,3):0),ty=ay+(by-ay)*k/n+(k<n?rnd(-3,3):0);sline(qx,qy,tx,ty,k%2?'#fff':'#8cf');qx=tx;qy=ty;}}ctx.globalAlpha=1;}
 else if(f.k==='ult'){const k=1-f.t/f.dur,X=sx(f.x,f.y),Y=sy(f.x,f.y);ctx.globalAlpha=.2+.2*k;wdisc(f.x,f.y,f.r*Math.min(1,k*1.2),f.col||'#fc4');ctx.globalAlpha=1;wcirc(f.x,f.y,f.r,f.col||'#fd4');wcirc(f.x,f.y,Math.max(1,f.r*k),'#fff');for(let i=0;i<6;i++){const a=time*3+i*1.05,wx=f.x+Math.cos(a)*f.r*.7,wy=f.y+Math.sin(a)*f.r*.7;ctx.fillStyle='#fd4';ctx.fillRect(sx(wx,wy),sy(wx,wy),2,2);}if(f.t<.25){ctx.globalAlpha=.6;ctx.fillStyle='#fff';ctx.fillRect(X-2,Y-90,4,90);ctx.globalAlpha=1;}}
}
// ---- boss projectile sprites: each boss fires its own kind of bullet ----
const PSPR={
 arrow(X,Y,ux,uy,q){for(let i=-5;i<=3;i++){ctx.fillStyle=i>1?'#e8eef6':'#6a4428';ctx.fillRect(Math.round(X+ux*i),Math.round(Y+uy*i),1,1);}ctx.fillStyle='#ffffff';ctx.fillRect(Math.round(X+ux*4),Math.round(Y+uy*4),1,1);
  ctx.fillStyle=q.col||'#d02030';const tx=X-ux*5,ty=Y-uy*5;ctx.fillRect(Math.round(tx-uy*1.5),Math.round(ty+ux*1.5),1,1);ctx.fillRect(Math.round(tx+uy*1.5),Math.round(ty-ux*1.5),1,1);},
 naginata(X,Y,ux,uy,q){const px=-uy,py=ux;for(let i=-9;i<=9;i++){const bend=(1-(i/9)**2)*5,cx=X+px*i+ux*bend,cy=Y+py*i*.8+uy*bend;ctx.fillStyle=Math.abs(i)<6?'#ffffff':q.col;ctx.fillRect(Math.round(cx),Math.round(cy),2,1);ctx.fillStyle=q.col;ctx.fillRect(Math.round(cx-ux*2),Math.round(cy-uy*2),1,1);}},
 drum(X,Y,ux,uy,q){const beat=Math.floor(time*4+q.x*.05)%2,g=q.col||'#e0b040'; // a little taiko drum: lacquered barrel, gold bands and studs, a drumhead that flashes on the beat
  ctx.fillStyle='#14101a';ctx.fillRect(X-5,Y-4,11,9);ctx.fillRect(X-4,Y-5,9,11);
  ctx.fillStyle='#a02818';ctx.fillRect(X-4,Y-2,9,6);ctx.fillStyle='#d03a24';ctx.fillRect(X-4,Y-2,3,6);ctx.fillStyle='#6a140c';ctx.fillRect(X+3,Y-2,2,6);
  ctx.fillStyle=g;ctx.fillRect(X-4,Y-1,9,1);ctx.fillRect(X-4,Y+3,9,1);ctx.fillStyle='#fff6c0';ctx.fillRect(X-3,Y-1,1,1);ctx.fillRect(X,Y+3,1,1);ctx.fillRect(X+3,Y-1,1,1);
  ctx.fillStyle=beat?'#ffffff':'#f0e0b8';ctx.fillRect(X-3,Y-4,7,2);ctx.fillRect(X-4,Y-3,9,1);ctx.fillStyle=beat?'#ffd060':'#c8a878';ctx.fillRect(X-1,Y-4,3,1);},
 silk(X,Y,ux,uy,q){if(q.stuck){ctx.fillStyle='#e8e8f0';ctx.fillRect(X-3,Y,7,1);ctx.fillRect(X,Y-3,1,7);ctx.fillStyle='#a0a0b0';ctx.fillRect(X-2,Y-2,1,1);ctx.fillRect(X+2,Y+2,1,1);ctx.fillRect(X-2,Y+2,1,1);ctx.fillRect(X+2,Y-2,1,1);ctx.fillStyle='#fff';ctx.fillRect(X,Y,1,1);}
  else{for(let i=-4;i<=1;i++){ctx.fillStyle=i>-1?'#ffffff':'#c8c8d8';ctx.fillRect(Math.round(X+ux*i),Math.round(Y+uy*i),1,1);}}},
 venom(X,Y,ux,uy,q){disc(X,Y,4,'#3a8a20');disc(X,Y,3,'#70d040');ctx.fillStyle='#d8ff90';ctx.fillRect(X-2,Y-2,2,1);ctx.fillStyle='#3a8a20';ctx.fillRect(X,Y+4+(Math.floor(time*6)%2),1,2);},
 ember(X,Y,ux,uy,q){const fl=Math.floor(time*14+q.x)%2;ctx.fillStyle='#c02010';ctx.fillRect(X-2,Y-1,5,4);ctx.fillStyle='#ff8020';ctx.fillRect(X-1,Y-2-fl,3,4);ctx.fillStyle='#ffe060';ctx.fillRect(X,Y-1,1,2);ctx.fillStyle='#fff';ctx.fillRect(X,Y,1,1);},
 charm(X,Y,ux,uy,q){const h=Math.floor(time*8+q.x)%2;ctx.fillStyle='#f8f4e8';if(h)ctx.fillRect(X-1,Y-3,3,6);else ctx.fillRect(X-3,Y-1,6,3);ctx.fillStyle='#d02030';if(h)ctx.fillRect(X,Y-2,1,4);else ctx.fillRect(X-2,Y,4,1);},
 bomb(X,Y,ux,uy,q){disc(X,Y,3,'#2a2a30');ctx.fillStyle='#6a6a70';ctx.fillRect(X-1,Y-2,1,1);ctx.fillStyle=Math.floor(time*12)%2?'#ffe060':'#ff6020';ctx.fillRect(X+2,Y-4,1,2);},
 spear(X,Y,ux,uy,q){for(let i=-6;i<=2;i++){ctx.fillStyle=i>0?'#e8eef6':'#7a5a3a';ctx.fillRect(Math.round(X+ux*i),Math.round(Y+uy*i),1,1);}ctx.fillStyle=q.col;ctx.fillRect(Math.round(X+ux*3),Math.round(Y+uy*3),1,1);},
};
function drawProj(q){
 const X=sx(q.x,q.y),Y=sy(q.x,q.y)-7,pad=q.st==='lance'&&q.wait>0?144:32;
 if(q.dead||X<-pad||X>W+pad||Y<-pad||Y>H+pad)return;
 ctx.fillStyle='rgba(0,0,0,.3)';ctx.fillRect(X-1,Y+7,3,1);
 if(q.spr&&PSPR[q.spr]){const [vx,vy]=q.vx||q.vy?scrVec(q.vx,q.vy):[1,0],l=Math.hypot(vx,vy)||1;
  if(q.st==='lance'&&q.wait>0){const lv=scrVec(q.lvx,q.lvy),ll=Math.hypot(lv[0],lv[1])||1;ctx.globalAlpha=Math.floor(time*16)%2?.55:.3;ctx.fillStyle=q.col;for(let r=4;r<140;r+=3)ctx.fillRect(Math.round(X+lv[0]/ll*r),Math.round(Y+lv[1]/ll*r),1,1);ctx.globalAlpha=1;PSPR[q.spr](X,Y,lv[0]/ll,lv[1]/ll,q);return;}
  PSPR[q.spr](X,Y,vx/l,vy/l,q);return;}
 if(q.arrow){const [vx,vy]=scrVec(q.vx,q.vy),l=Math.hypot(vx,vy)||1,ux=vx/l,uy=vy/l;sline(X-ux*5,Y-uy*5,X+ux*3,Y+uy*3,q.col);ctx.fillStyle='#fff';ctx.fillRect(Math.round(X+ux*3),Math.round(Y+uy*3),1,1);}
 else if(q.crescent){const [vx,vy]=scrVec(q.vx,q.vy),l=Math.hypot(vx,vy)||1,ux=vx/l,uy=vy/l,px=-uy,py=ux;
  for(let i=-7;i<=7;i++){const bend=(1-(i/7)**2)*4,cx=X+px*i+ux*bend,cy=Y+py*i*.8+uy*bend;ctx.fillStyle=Math.abs(i)<5?'#fff':q.col;ctx.fillRect(Math.round(cx),Math.round(cy),2,1);ctx.fillStyle='#8cf';ctx.fillRect(Math.round(cx-ux*2),Math.round(cy-uy*2),1,1);}}
 else if(q.st&&q.from==='e'){const [vx,vy]=scrVec(q.vx,q.vy),l=Math.hypot(vx,vy)||1,ux=vx/l,uy=vy/l;
  switch(q.st){
   case 'accel':case 'curve':for(let i=-2;i<=2;i++){ctx.fillStyle=Math.abs(i)<2?'#fff':q.col;ctx.fillRect(Math.round(X+ux*i*1.5),Math.round(Y+uy*i*1.5),2,2);}ctx.fillStyle=q.col;ctx.fillRect(Math.round(X-ux*5),Math.round(Y-uy*5),1,1);break; // rice grain
   case 'wave':ctx.fillStyle=q.col;ctx.fillRect(X-1,Y-3,3,7);ctx.fillRect(X-3,Y-1,7,3);ctx.fillStyle='#fff';ctx.fillRect(X,Y-1,1,3);break; // diamond
   case 'boom':{const a=time*18;for(let i=0;i<4;i++){const c=Math.cos(a+i*Math.PI/2),s=Math.sin(a+i*Math.PI/2);sline(X,Y,X+c*4,Y+s*4,q.col);}ctx.fillStyle='#fff';ctx.fillRect(X,Y,1,1);break;} // shuriken
   case 'split':circ(X,Y,q.r,q.col);disc(X,Y,q.r-2,'#fff');ctx.globalAlpha=.4;disc(X,Y,q.r+1,q.col);ctx.globalAlpha=1;break;
   case 'mine':{const bl=q.fuse<.4?Math.floor(time*20)%2:Math.floor(time*6)%2;circ(X,Y+3,8-q.fuse*3|0,q.col);disc(X,Y,3,bl?'#fff':q.col);ctx.fillStyle='#14101a';ctx.fillRect(X-1,Y,3,1);ctx.fillRect(X,Y-1,1,3);break;}
   case 'star':ctx.fillStyle=q.col;ctx.fillRect(X-2,Y,5,1);ctx.fillRect(X,Y-2,1,5);ctx.fillStyle='#fff';ctx.fillRect(X,Y,1,1);break;
   case 'big':{const r=Math.max(3,Math.round(q.r)); // a heavy shaded orb (no glow, so it reads steady as it flies)
    disc(X,Y,r+1,'#14101a');disc(X,Y,r,shade(q.col,.45));disc(X,Y,r-1,shade(q.col,-.28));disc(X-1,Y-1,r-2,q.col);disc(X-Math.round(r*.4),Y-Math.round(r*.4),Math.max(1,Math.round(r*.3)),shade(q.col,.55));ctx.fillStyle='#fff';ctx.fillRect(X-Math.round(r*.45),Y-Math.round(r*.55),1,1);break;}
   // lance: while waiting it shows a thin aim line along its path, then it is a bright needle
   case 'lance':{const lv=q.wait>0?scrVec(q.lvx,q.lvy):[vx,vy],ll=Math.hypot(lv[0],lv[1])||1,lx=lv[0]/ll,ly=lv[1]/ll;
    if(q.wait>0){ctx.globalAlpha=Math.floor(time*16)%2?.55:.3;ctx.fillStyle=q.col;for(let r=4;r<140;r+=3)ctx.fillRect(Math.round(X+lx*r),Math.round(Y+ly*r),1,1);ctx.globalAlpha=1;}
    for(let i=-3;i<=3;i++){ctx.fillStyle=Math.abs(i)<2?'#fff':q.col;ctx.fillRect(Math.round(X+lx*i*1.5),Math.round(Y+ly*i*1.5),1,1);}break;}
   case 'seek':{ctx.fillStyle=q.col;ctx.fillRect(Math.round(X-ux*3)-1,Math.round(Y-uy*3)-1,3,3);ctx.fillStyle='#fff';ctx.fillRect(Math.round(X+ux*2),Math.round(Y+uy*2),1,1);ctx.fillRect(X,Y,1,1);break;} // homing arrowhead
   case 'bounce':circ(X,Y,q.r+1,q.col);ctx.fillStyle='#fff';ctx.fillRect(X-1,Y-1,2,2);break; // hollow ring
   case 'orbit':{const a=time*10;ctx.fillStyle=q.col;ctx.fillRect(X-2,Y-2,5,5);ctx.fillStyle='#fff';ctx.fillRect(Math.round(X+Math.cos(a)*2),Math.round(Y+Math.sin(a)*2),1,1);ctx.fillRect(X,Y,1,1);break;} // spinning orb
   case 'zig':ctx.fillStyle=q.col;ctx.fillRect(X-1,Y-2,3,5);ctx.fillRect(X-2,Y-1,5,3);ctx.fillStyle='#fff';ctx.fillRect(X,Y,1,1);break; // crystal
   default:disc(X,Y,q.r,q.col);}}
 else if(q.rare){ctx.globalAlpha=.35;disc(X,Y,q.r+2,q.col);ctx.globalAlpha=1;disc(X,Y,q.r,q.col);ctx.fillStyle='#fff';ctx.fillRect(X-1,Y,3,1);ctx.fillRect(X,Y-1,1,3);}
 else{disc(X,Y,q.r,q.col);ctx.fillStyle='#fff';ctx.fillRect(X,Y,1,1);}
}
function drawPickup(k){
 const X=sx(k.x,k.y),Y=sy(k.x,k.y),bob=Math.round(Math.sin(time*4+k.x)*1.5);
 if(k.k==='sen'){ // spinning gold coin with a square hole
  // oval koban coin: stamped gold, spinning, with the odd glint
  const sp=Math.abs(Math.cos(time*3+k.x)),hw=Math.round(2*sp),cy=Y-4+bob;
  ctx.fillStyle='#14101a';ctx.fillRect(X-hw-1,cy-2,hw*2+3,5);ctx.fillRect(X-hw,cy-3,hw*2+1,7);
  ctx.fillStyle='#c8941e';ctx.fillRect(X-hw,cy-2,hw*2+1,5);ctx.fillStyle='#f0c040';ctx.fillRect(X-hw,cy-2,hw*2+1,3);
  if(hw>=1){ctx.fillStyle='#a0700c';ctx.fillRect(X-hw+1,cy-1,Math.max(1,hw*2-1),1);ctx.fillRect(X-hw+1,cy+1,Math.max(1,hw*2-1),1);}
  ctx.fillStyle='#fff3a0';ctx.fillRect(X-hw,cy-2,1,2);
  if((time*2+k.x*.37)%3<.15){ctx.fillStyle='#fff';ctx.fillRect(X+hw,cy-4,1,3);ctx.fillRect(X+hw-1,cy-3,3,1);}}
 else if(k.k==='heart'){disc(X,Y-4+bob,3,'#e33');ctx.fillStyle='#fcc';ctx.fillRect(X-1,Y-5+bob,1,1);}
 else if(k.k==='pot'){const y0=Y-9+bob; // a little red HP flask with a cork
  ctx.fillStyle='#14101a';ctx.fillRect(X-3,y0+2,7,7);ctx.fillRect(X-2,y0,5,3);ctx.fillStyle='#c8a070';ctx.fillRect(X-1,y0,3,1);ctx.fillStyle='#ddd';ctx.fillRect(X-1,y0+1,3,2);
  ctx.fillStyle='#e33';ctx.fillRect(X-2,y0+3,5,5);ctx.fillStyle='#ff8080';ctx.fillRect(X-2,y0+3,1,2);ctx.globalAlpha=.25+.15*Math.sin(time*4);disc(X,y0+5,5,'#f44');ctx.globalAlpha=1;}
 else if(k.k==='gourd'){disc(X,Y-4+bob,3,'#6c4');ctx.fillStyle='#240';ctx.fillRect(X,Y-8+bob,1,2);}
 else if(k.k==='bag')drawBag(k,X,Y);
 else if(k.k==='item'){const it=ITEMBY[k.id];ctx.globalAlpha=.3+.2*Math.sin(time*5);wdisc(k.x,k.y,6,RCOL[it.r]);ctx.globalAlpha=1;relicBox(X-6,Y-19+bob,k.id);}
}
const BAGTMP=mk(24,24,()=>{});
function twinkle(x,y,s,col){x=Math.round(x);y=Math.round(y);ctx.fillStyle=col;ctx.fillRect(x-s,y,s*2+1,1);ctx.fillRect(x,y-s,1,s*2+1);ctx.fillStyle='#fff';ctx.fillRect(x,y,1,1);}
function drawBag(k,X,Y){
 const sp=BAGSPR[k.tier],z=Math.round(k.z||0),c=BAGCOL[k.tier],T=time+k.x*.13,rare=k.tier===4,grounded=!z;
 const hov=rare&&grounded?Math.round(Math.sin(T*2.5)*1.5)-2:0,pop=k.pop>0?Math.round(Math.sin(k.pop*12)*1):0;
 const bx=Math.round(X-sp.w/2),by=Math.round(Y-sp.h-z+hov+1)-pop,mx=X,my=by+sp.h*.55;
 // the special bags (enchanter, scholar, war chest) send up a thin beam in their colour
 if(k.tier>=5){ctx.globalAlpha=.16+.06*Math.sin(T*3);ctx.fillStyle=c;ctx.fillRect(X-2,Y-60,5,60);ctx.globalAlpha=1;}
 if(rare){
  // pillar of light reaching up from the bag, visible from across the room
  const pa=.18+.08*Math.sin(T*3);ctx.globalAlpha=pa;ctx.fillStyle='#ffd040';ctx.fillRect(X-4,Y-90,9,90);ctx.globalAlpha=pa*1.6;ctx.fillStyle='#fff6c0';ctx.fillRect(X-1,Y-90,3,90);ctx.globalAlpha=1;
  // ground glow + an expanding ripple
  ctx.globalAlpha=.3+.12*Math.sin(T*4);wdisc(k.x,k.y,13,'#ffb020');ctx.globalAlpha=.35;wdisc(k.x,k.y,7,'#fff0a0');
  const rp=(T*.8)%1;ctx.globalAlpha=.6*(1-rp);wcirc(k.x,k.y,6+rp*16,'#ffd040');ctx.globalAlpha=1;
  // crisp pixel twinkles orbiting the bag (no blurry vector rays)
  for(let i=0;i<4;i++){const a=T*.9+i*TAU/4,tx=Math.round(mx+Math.cos(a)*12),ty=Math.round(my+Math.sin(a)*8),on=Math.sin(T*5+i*1.7)>0;
   ctx.fillStyle=on?'#fff6c0':'#ffd040';ctx.fillRect(tx,ty,1,1);if(on){ctx.fillRect(tx-1,ty,3,1);ctx.fillRect(tx,ty-1,1,3);}}
  // golden motes rising
  for(let i=0;i<6;i++){const ph=(T*.55+i/6)%1,ox=Math.sin(i*2.7+T)*7;ctx.globalAlpha=1-ph;ctx.fillStyle=i%2?'#fff':'#ffd040';ctx.fillRect(Math.round(X+ox),Math.round(Y-4-ph*34),1,1+(i%3===0?1:0));}ctx.globalAlpha=1;
 }else if(k.tier>=1&&grounded){
  ctx.globalAlpha=.12+.05*k.tier+.08*Math.sin(T*4);wdisc(k.x,k.y,6+k.tier,c);ctx.globalAlpha=1;
  for(let i=0;i<k.tier-1;i++){const ph=(T*.5+i/2)%1;ctx.globalAlpha=1-ph;ctx.fillStyle=c;ctx.fillRect(Math.round(X-3+i*6),Math.round(Y-3-ph*18),1,1);}ctx.globalAlpha=1;
 }
 // shadow shrinks as it flies
 const sw=Math.max(3,Math.round(sp.w/2-2-z/6));ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(X-sw,Y-1,sw*2,2);
 ctx.drawImage(sp.c,bx,by);
 if(rare){const sh=(T*.9)%2.2;if(sh<1){ // a shine sweep across the gold cloth (masked to the sprite)
   const g=BAGTMP.getContext('2d');g.clearRect(0,0,24,24);g.drawImage(sp.c,0,0);g.globalCompositeOperation='source-atop';g.fillStyle='rgba(255,255,255,.7)';const sx0=-4+sh*(sp.w+10);
   for(let j=0;j<sp.h;j++)g.fillRect(Math.round(sx0-j*.5),j,2,1);g.globalCompositeOperation='source-over';ctx.drawImage(BAGTMP,bx,by);}
  // sparkles orbiting the bag
  for(let i=0;i<3;i++){const a=T*2+i*TAU/3,ox=Math.cos(a)*11,oy=Math.sin(a)*4,s=(Math.floor(T*6+i)%3===0)?2:1;twinkle(mx+ox,my+oy,s,'#ffe070');}
  if(Math.floor(T*5)%4===0)twinkle(bx+sp.w/2,by+sp.h*.55,2,'#ffd0d8');
 }else if(k.tier>=2&&Math.floor(T*4)%5===0)twinkle(bx+sp.w-3,by+3,1,'#fff');
}
// ---- ability icons: an 11x11 pixel picture of what each spell does, drawn in the spell's colour ----
// '#' spell colour (auto-lit on top, shaded underneath), w white, y gold, s steel, k dark, n wood, p paper, g green
const SPMOTIF={
 bolt:['......###..','.....###...','....###....','...###.....','..#######..','.....###...','....###....','...###.....','..##.......','.#.........','...........'],
 flame:['.....#.....','....##.....','....###.#..','...####.##.','..#####.##.','..##yy####.','.##yyyy###.','.##ywwy###.','.##yyyy##..','..##yy##...','...####....'],
 snow:['.....#.....','...#.#.#...','....###....','.#...#...#.','..#..#..#..','#####w#####','..#..#..#..','.#...#...#.','....###....','...#.#.#...','.....#.....'],
 venom:['.....#.....','.....#.....','....###....','....###....','...#####...','..###w###..','..##w####..','..#######..','...#####...','....###.#..','........#..'],
 plant:['........w..','.......www.','........w..','..##.......','.####..##..','.#####.###.','..####n###.','....##n##..','......n....','......n....','....nnnn...'],
 shield:['.#########.','.####w####.','.####w####.','.##wwwww##.','.####w####.','.####w####.','..###w###..','..#######..','...#####...','....###....','.....#.....'],
 sword:['#........sw','.#......sw.','..#....sw..','..#...sw...','..#..sw....','..#.sw.....','..#yy......','..yy#......','.##..#.....','##.........','...........'],
 arrow:['........###','.........##','........#.#','.......#...','......#....','.....#.....','....#......','...#.......','w.#........','.w.........','w.w........'],
 arrowrain:['w...w...w..','.#...#...#.','.#...#...#.','.#...#...#.','.#...#...#.','###.###.###','.#...#...#.','...........','w...w...w..','.#...#...#.','###.###.###'],
 talisman:['...ppppp...','...p###p...','...pp#pp...','...p###p...','...pp#pp...','...p#p#p...','...ppppp...','...p#p#p...','...ppppp...','....p.p....','....p.p....'],
 wisp:['...###.....','..#####....','.##w#w##...','.#######...','.#######...','..######...','...#####...','....####...','.....###...','......##...','.......#...'],
 shards:['#....#....#','.#...#...#.','..#..w..#..','...#.#.#...','....###....','#####w#####','....###....','...#.#.#...','..#..#..#..','.#...#...#.','#....#....#'],
 vortex:['...#####...','.##.....##.','.#..###..#.','#..#...#..#','#.#..k..#.#','#.#.kkk.#.#','#.#..k..#..','#..#....#..','.#..####...','.##........','...####....'],
 dash:['...........','.#...#.....','.##..##....','..##..##...','...##..##..','....##..##.','...##..##..','..##..##...','.##..##....','.#...#.....','...........'],
 smoke:['...........','....###....','..#######..','.####w####.','.#########.','###########','#####w#####','.#########.','..##.###.#.','...........','...........'],
 clones:['...........','.#...#...#.','###.###.###','.#...#...#.','###.###.###','###.###.###','.#.#.#.#.#.','.#.#.#.#.#.','...........','...........','...........'],
 dragon:['.##........','..###......','..#####....','.###w####..','##########.','#########yy','.####.#.#.#','..####.....','...####....','....###....','......##...'],
 hourglass:['.yyyyyyyyy.','..#######..','...#####...','....###....','.....#.....','.....#.....','....#w#....','...##w##...','..###w###..','.yyyyyyyyy.','...........'],
 hawk:['...........','#.........#','##.......##','.###...###.','..###y###..','...#####...','....###....','....#.#....','...........','...........','...........'],
 totem:['....###....','...#w#w#...','...#####...','....###....','...#####...','...#w#w#...','....###....','....###....','...#####...','..#######..','...........'],
 bell:['.....y.....','....###....','...#####...','...#####...','..##w####..','..##w####..','.#########.','###########','.....y.....','...........','...........'],
 mirror:['...#####...','..#wwsss#..','.#wssssss#.','.#sssssss#.','.#ssssss##.','..#sssss#..','...#####...','.....#.....','.....#.....','....###....','...#####...'],
 whirl:['..#######..','.#.......#.','...#####...','..#.....#..','....###....','...#...#...','.....#.....','....#......','.....#.....','...........','...........'],
 shout:['...........','......#....','..##...#...','.####...#..','#####w..#..','####ww..#..','#####w..#..','.####...#..','..##...#...','......#....','...........'],
 crescent:['...####....','.####......','.##........','###........','##.........','##.........','##.........','###........','.##........','.####......','...####....'],
 shuriken:['.....#.....','.....#.....','....###....','....###....','..#.#w#.#..','#####k#####','..#.#w#.#..','....###....','....###....','.....#.....','.....#.....'],
 kunai:['.........w#','........w#.','.......w#..','......w#...','.....w#....','....##.....','...yy......','..##.......','.#.#.......','.#.#.......','..#........'],
 sickle:['...####....','..#....#...','.#......#..','.#......n..','........n..','........n..','.......y...','......#.#..','.....#.#...','....#.#....','...........'],
 meteor:['#..........','.#.#.......','..#.#......','...#.##....','....####...','....#yyy#..','....#ywy##.','.....#yyy#.','......####.','...........','...........'],
 caltrop:['...........','..#.....#..','.###...###.','..#.....#..','....#......','...###.....','....#...#..','#......###.','##......#..','#..........','...........'],
 orb:['...#####...','.#########.','.#ww######.','##w########','###########','###########','###########','.#########.','.#########.','...#####...','...........']};
const SPRULES=[[/CRY/,'shout'],[/TOTEM/,'totem'],[/DRAGON/,'dragon'],[/LIGHTNING|THUNDER|JUDG|STATIC/,'bolt'],[/METEOR/,'meteor'],[/FLAME|FIRE|DESCENT|INFERNO|SPIRIT FOX/,'flame'],
 [/FROST|ICE|NOVA|STILL/,'snow'],[/CALTROP/,'caltrop'],[/VENOM|POISON/,'venom'],[/HEAL|RITE|MEND/,'plant'],[/WARD|AEGIS|SHIELD|GUARD|COUNTER|BARRIER/,'shield'],
 [/TALISMAN|PAPER|OFUDA/,'talisman'],[/ARROW RAIN|ARROW STORM/,'arrowrain'],[/ARROW|SHOT|VOLLEY|BOLTS|HANKYU/,'arrow'],[/CRESCENT|MOON/,'crescent'],
 [/SHURIKEN/,'shuriken'],[/KUNAI/,'kunai'],[/KUSARI/,'sickle'],[/WHIRL/,'whirl'],[/KATANA|BLADE|CLEAVE|IAI|ODACHI|NAGINATA|SWEEP|COMBO|SLASH/,'sword'],
 [/WISP|SEEKER|SHIKI/,'wisp'],[/SHARD/,'shards'],[/VOID|GRAVITY|BLACK HOLE|WELL/,'vortex'],[/STEP|KITSUNE|ROLL|EVADE|DASH/,'dash'],[/SMOKE/,'smoke'],
 [/CLONE/,'clones'],[/TIME/,'hourglass'],[/HAWK/,'hawk'],[/BELL|SUZU/,'bell'],[/MIRROR/,'mirror']];
const SPICO={},SPACC={w:'#ffffff',y:'#ffd040',s:'#c8d0dc',k:'#14101a',n:'#7a5a2a',p:'#f0e8d0',g:'#66ee66'};
function motifIcon(mo,c){const key=mo+c;if(SPICO[key])return SPICO[key];
 const m=SPMOTIF[mo]||SPMOTIF.orb,at=(x,y)=>y>=0&&y<11&&x>=0&&x<11&&m[y][x]==='#';
 return SPICO[key]=mk(11,11,g=>{for(let y=0;y<11;y++)for(let x=0;x<11;x++){const ch=m[y][x];if(ch==='.')continue;
  g.fillStyle=ch==='#'?(!at(x,y-1)?shade(c,.35):!at(x,y+1)?shade(c,-.4):c):SPACC[ch]||c;g.fillRect(x,y,1,1);}});}
function spellIcon(sp){return motifIcon((SPRULES.find(r=>r[0].test(sp.n))||[0,'orb'])[1],sp.c);}
// relics get pictures too (shown in the shop, boss rewards, the HUD and the run summary), coloured by effect style
const RELICMO={atk:'sword',aspd:'dash',range:'arrow',hp:'plant',pos:'shield',spd:'dash',parry:'shield',crit:'shards',blood:'venom',fire:'flame',poison:'venom',shadow:'smoke',emb:'hourglass',
 thorn:'caltrop',wave:'talisman',gourd:'plant',rez:'wisp',magnet:'orb',hunger:'dragon',mikiri:'dash',iron:'shield',ghost:'wisp',dblow:'sword',pierce:'arrow',frost:'snow',shock:'bolt',
 qpow:'bolt',epow:'dragon',ecd:'hourglass',vamp:'venom',glass:'shards',storm:'bolt',echo:'bell',phoenix:'flame',flare:'meteor'};
const relicIcon=id=>motifIcon(RELICMO[id]||'orb',fxCol(id));
function relicBox(x,y,id,size){const s=size||13;ctx.fillStyle='#000';ctx.fillRect(x-1,y-1,s+2,s+2);ctx.fillStyle=fxCol(id);ctx.fillRect(x,y,s,s);ctx.fillStyle='#14101a';ctx.fillRect(x+1,y+1,s-2,s-2);
 const ic=relicIcon(id);if(s>=13)ctx.drawImage(ic,x+1+((s-13)>>1),y+1+((s-13)>>1));else ctx.drawImage(ic,0,0,11,11,x+1,y+1,s-2,s-2);}
// a 13x13 spell slot: coloured frame, dark well, the ability's icon (dimmed while on cooldown)
function spellBox(x,y,sp,ready){ctx.fillStyle='#000';ctx.fillRect(x-1,y-1,15,15);ctx.fillStyle=ready?sp.c:'#555';ctx.fillRect(x,y,13,13);ctx.fillStyle='#14101a';ctx.fillRect(x+1,y+1,11,11);
 if(!ready)ctx.globalAlpha=.4;ctx.drawImage(spellIcon(sp),x+1,y+1);ctx.globalAlpha=1;}
function iconBox(x,y,g,col){ctx.fillStyle='#000';ctx.fillRect(x-1,y-1,11,11);ctx.fillStyle=col;ctx.fillRect(x,y,9,9);ctx.fillStyle='#14101a';ctx.fillRect(x+1,y+1,7,7);const gl=FONT[g]||FONT['?'];ctx.fillStyle=col;glyph(gl,x+3,y+2,1);}
function drawPortal(){
 // big torii gate with a swirling vortex, a light pillar and a bouncing arrow
 const p=portal;if(!p||p.pending)return;const X=sx(p.x,p.y),Y=sy(p.x,p.y),t=p.t;
 ctx.globalAlpha=.22+.1*Math.sin(t*4);wdisc(p.x,p.y,22,'#8cf');ctx.globalAlpha=1;wcirc(p.x,p.y,18+Math.sin(t*5)*2,'#8cf');wcirc(p.x,p.y,24,'#4af');
 ctx.globalAlpha=.18;ctx.fillStyle='#bdf';ctx.fillRect(X-9,0,18,Y);ctx.globalAlpha=.3;ctx.fillRect(X-4,0,8,Y);ctx.globalAlpha=1;
 const OL='#14101a',RD='#d02030',DK='#7a1020';
 // vortex inside the gate
 for(let r=11;r>0;r-=2){ctx.fillStyle=r%4===1?'#fff':r%4===3?'#8cf':'#3a6af0';ctx.globalAlpha=.85;const w=r,h=Math.round(r*17/11);ctx.fillRect(X-w,Y-17-h,w*2,h*2);} // fills the gate from the lower beam to the ground
 ctx.globalAlpha=1;
 for(let i=0;i<14;i++){const a=t*4+i*.9,rr=(i*2.3+t*14)%12;ctx.fillStyle=i%2?'#fff':'#bdf';ctx.fillRect(Math.round(X+Math.cos(a)*rr),Math.round(Y-17+Math.sin(a)*rr*1.4),1,1);}
 // pillars + beams
 ctx.fillStyle=OL;ctx.fillRect(X-16,Y-42,5,43);ctx.fillRect(X+11,Y-42,5,43);ctx.fillRect(X-22,Y-47,44,6);ctx.fillRect(X-18,Y-38,36,4);
 ctx.fillStyle=RD;ctx.fillRect(X-15,Y-41,3,41);ctx.fillRect(X+12,Y-41,3,41);ctx.fillRect(X-17,Y-37,34,2);ctx.fillStyle='#1a1a24';ctx.fillRect(X-21,Y-46,42,4);ctx.fillStyle=RD;ctx.fillRect(X-20,Y-43,40,1);
 ctx.fillStyle=DK;ctx.fillRect(X-13,Y-41,1,41);ctx.fillRect(X+14,Y-41,1,41);ctx.fillStyle='#e8c050';ctx.fillRect(X-1,Y-42,2,4);
 for(let i=0;i<26;i++){const off=(t*34+i*11)%60,x=X+Math.sin(t*3+i)*10;ctx.fillStyle=i%2?'#8cf':'#fff';ctx.fillRect(Math.round(x),Math.round(Y-off),1,2);}
 const by=Math.round(Y-62+Math.sin(t*5)*3);ctx.fillStyle=OL;ctx.fillRect(X-4,by-1,9,4);ctx.fillRect(X-2,by+3,5,3);ctx.fillStyle='#fd4';ctx.fillRect(X-3,by,7,2);ctx.fillRect(X-1,by+2,3,2);ctx.fillRect(X,by+4,1,1);
 txt('PORTAL',X-11,by-9,'#fff');
}
function drawMinimap(){
 // bird's-eye minimap: straight top-down, turned 45 degrees so up on the map is up on screen
 const k=64/(MW+MH),mw=Math.round((MW+MH)*k),mh=mw,ox=W-mw-3,oy=3,mp=(x,y)=>{const [u,v]=tileR(x,y);return [ox+Math.round((u-v+RMH)*k),oy+Math.round((u+v)*k)];};
 ctx.fillStyle='rgba(0,0,0,.55)';ctx.fillRect(ox-1,oy-1,mw+2,mh+2);
 if(R.fog===R.di){ctx.fillStyle='rgba(150,140,170,.25)';for(let i=0;i<14;i++){const a=time*.3+i;ctx.fillRect(ox+((i*23+Math.round(time*6))%(mw-10)),oy+(i*11)%(mh-4),10,3);}txt('FOG',ox+mw/2-5,oy+mh/2-2,'#b8b0c8');const q=[ox+mw/2,oy+mh/2];return;}
 // a quiet, mostly grey map: explored floor grey, finished rooms a lighter grey. Colour is kept for what you look for:
 // the unexplored edges (a pulsing gold glow), you, the boss and the portal.
 ctx.fillStyle='rgba(120,120,130,.75)';
 const fr=[],un=(x,y)=>x>=0&&y>=0&&x<MW&&y<MH&&map.t[y*MW+x]&&!map.expl[y*MW+x];
 for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)if(map.expl[y*MW+x]&&map.t[y*MW+x]){const q=mp(x,y);ctx.fillRect(q[0],q[1],1,1);if(un(x+1,y)||un(x-1,y)||un(x,y+1)||un(x,y-1))fr.push(q);}
 ctx.fillStyle='rgba(200,200,210,.8)';
 for(const r of map.rooms){if(!r.done)continue;for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++)if(map.t[y*MW+x]&&map.expl[y*MW+x]){const q=mp(x,y);ctx.fillRect(q[0],q[1],1,1);}}
 // unexplored edges: a soft halo and a bright core, pulsing, so the way on is obvious at a glance
 {const k2=.5+.5*Math.sin(time*5);ctx.fillStyle='rgba(255,190,40,'+(.1+.15*k2)+')';for(const q of fr){ctx.fillRect(q[0]-1,q[1],3,1);ctx.fillRect(q[0],q[1]-1,1,3);}ctx.fillStyle=k2>.5?'#fff0a0':'#ffc030';for(const q of fr)ctx.fillRect(q[0],q[1],1,1);}
 // shops, challenges, curse altars and wells: small grey shapes (done ones fade)
 for(const r of map.rooms){if(!['shop','challenge','altar','rest'].includes(r.type))continue;const cx=r.x+(r.w>>1),cy=r.y+(r.h>>1);if(!map.expl[cy*MW+cx])continue;const q=mp(cx,cy);
  ctx.globalAlpha=r.done?.35:.95;ctx.fillStyle='#e8e8f0';
  if(r.type==='shop'){ctx.fillRect(q[0]-1,q[1]-1,3,3);ctx.fillStyle='#14101a';ctx.fillRect(q[0],q[1],1,1);}
  else if(r.type==='challenge'){ctx.fillRect(q[0],q[1]-1,1,3);ctx.fillRect(q[0]-1,q[1],3,1);}
  else if(r.type==='altar'){ctx.fillRect(q[0]-1,q[1]-1,1,1);ctx.fillRect(q[0]+1,q[1]-1,1,1);ctx.fillRect(q[0],q[1],1,1);ctx.fillRect(q[0]-1,q[1]+1,1,1);ctx.fillRect(q[0]+1,q[1]+1,1,1);}
  else{ctx.fillRect(q[0]-1,q[1],3,1);ctx.fillRect(q[0],q[1]+1,1,1);}
  ctx.globalAlpha=1;}
 const br=map.bossRoom;if(!map.train&&(boss||!portal)){const q=mp(br.x+(br.w>>1),br.y+(br.h>>1));ctx.fillStyle=Math.floor(time*3)%2?'#f33':'#a22';ctx.fillRect(q[0]-1,q[1]-1,3,3);}
 if(portal){const q=mp(portal.x/T|0,portal.y/T|0);ctx.fillStyle='#8cf';ctx.fillRect(q[0]-1,q[1]-1,3,3);}
 const q=mp(P.x/T|0,P.y/T|0);ctx.fillStyle='#fff';ctx.fillRect(q[0]-1,q[1]-1,3,3);
}
const slotX=i=>W-6*20-2+i*20,SLOTY=()=>H-28;
function hoverSlot(){if(mode!=='play'||!P)return null;for(let i=0;i<6;i++){const x=slotX(i),y=SLOTY();if(mouse.x>=x-2&&mouse.x<=x+15&&mouse.y>=y-2&&mouse.y<=y+21)return SLOTS[i];}return null;}
// tooltip lines: live numbers from current stats, items and spell rank
function spellInfo(k){
 const v=P.lo[k],r=Math.round,ap=AP(),bp=BP(),qm=(1+.3*S.qpow)*ap,ep=(1+.25*S.epow),cd=k==='m'?null:spellCd(k)/(k==='h'?S.aspd:1),L=[];
 const A=S.atk;
 if(v>=4){const sp=SPELLS[k][v],em=EMP(k),base=sp.db==='b'?bp:sp.db==='q'?qm:sp.db==='e'?ep*ap*(1+.06*RK()):ap;
  if(em>1)L.push('EMPOWERED: +60% POWER, -'+cdPct(COOLDOWN.empowered)+' COOLDOWN');if(sp.dm)L.push('DAMAGE '+r(A*sp.dm*base*em)+(sp.dx||''));if(sp.x)L.push(sp.x);if(k==='h')L.push('HOLD RMB 0.6S FOR A FULL CHARGE');
  if(sp.dm)L.push('FORMULA  POWER '+r(A)+' X '+sp.dm+' X '+(base*em).toFixed(2));if(k==='m')L.push((1/((LMBRATE[v]||.3)/S.aspd)).toFixed(1)+' CASTS/S');
  L.push((cd?'COOLDOWN '+cd.toFixed(1)+'S   ':'')+'CRIT '+r(S.crit*100)+'%');return L;}
 if(v===3)L.push('RARE SCROLL - LASTS THIS RUN');
 if(k==='m'&&v===3){const rate=(1/(.38/S.aspd)).toFixed(1);L.push('DAMAGE '+r(A*.9*bp)+' X '+(3+S.wave)+' SEEKERS, PIERCE '+(2+S.pierce),rate+' CASTS/S','FORMULA  POWER '+r(A)+' X 0.9 X RANK '+bp.toFixed(2));}
 else if(k==='h'&&v===3)L.push('SLASH '+r(A*2.2*bp)+' + WAVE '+r(A*1.6*bp)+' PIERCES ALL','BOTH CUT ENEMY SHOTS');
 else if(k==='q'&&v===3)L.push('SMITES '+(5+Math.floor(RK()/4))+' FOES FOR '+r(A*3.6*qm)+' EACH','SPLASH 50%. STUNS 1S. SHOCKS','FORMULA  POWER '+r(A)+' X 3.6 X '+qm.toFixed(2));
 else if(k==='w'&&v===3)L.push('INVULNERABLE '+(2.5*(1+.05*RK())).toFixed(1)+'S. HEALS '+r(S.maxhp*.2)+' HP','BLAST '+r(A*2*ap)+', CLEARS NEARBY SHOTS');
 else if(k==='f'&&v===3)L.push('PULLS FOES + BOSSES 3.2S, EATS SHOTS','THEN '+r(A*6*ap)+' DAMAGE IN RADIUS '+r(105*AZ()));
 else if(k==='e'&&v===3)L.push((14+Math.floor(RK()/2))+' METEORS OF '+r(A*3.2*ep*AP())+' OVER 3S','FORMULA  POWER '+r(A)+' X 3.2 X '+(ep*AP()).toFixed(2));
 else if(k==='m'){const rate=(1/((v===0?.3:.5)/S.aspd)).toFixed(1);
  if(v===0)L.push('DAMAGE '+r(A*bp*(S.wave?.8:1))+' X '+(1+S.wave)+' BOLTS','STUN '+r(8+A*.3)+'  '+rate+' CASTS/S');
  else if(v===1)L.push('DAMAGE '+r(A*.45*bp)+' X '+(4+S.wave*2)+' SHARDS',rate+' CASTS/S');
  else L.push('DAMAGE '+r(A*1.15*bp)+' X '+(1+S.wave)+' WISPS',rate+' CASTS/S');
  L.push('FORMULA  POWER '+r(A)+' X '+[1,.45,1.15][v]+' X RANK '+bp.toFixed(2));}
 else if(k==='h'){const m=[1.5,2,1.4][v];L.push('DAMAGE '+r(A*m*bp)+(v===1?'  PIERCES ALL':v===2?'  PIERCES '+(3+S.pierce):'  STUN 26'),'FORMULA  POWER '+r(A)+' X '+m+' X RANK '+bp.toFixed(2));}
 else if(k==='q'){const m=[2.4,2,1.6][v];
  L.push(v===0?'DAMAGE '+r(A*m*qm)+' TO '+(3+(S.shock?1:0)+Math.floor(RK()/3)+1)+' FOES (-12% EACH JUMP)':v===1?'DAMAGE '+r(A*m*qm)+' IN A CONE. BURNS':'DAMAGE '+r(A*m*qm)+' BLAST ON ARRIVAL. BURNS');
  L.push('FORMULA  POWER '+r(A)+' X '+m+' X '+qm.toFixed(2));}
 else if(k==='w'){
  if(v===0)L.push('LASTS '+(S.wardDur*(1+.05*RK())).toFixed(1)+'S. REFLECTS 6 SHOTS AT 60% + '+r(A*.8));
  else if(v===1)L.push('HEALS '+r(S.maxhp*(.25+.05*(R.inv.parry||0)+.015*RK()))+' HP OVER 3S. +30% SPEED');
  else L.push('DAMAGE '+r(A*.3*ap)+' EVERY 0.35S FOR 4S','SLOWS 65% AND CHILLS');}
 else if(k==='f'){
  if(v===0)L.push('DAMAGE '+r(A*1.6*ap)+' IN RADIUS '+r(66*AZ()),'APPLIES 3 CHILL = FREEZE');
  else if(v===1)L.push('PULLS FOR 2.2S, THEN '+r(A*3.2*ap)+' DAMAGE','FORMULA  POWER '+r(A)+' X 3.2 X '+ap.toFixed(2));
  else L.push('ZAPS '+r(A*1.3*ap)+' EVERY 0.45S FOR 6S','ABOUT '+r(A*1.3*ap*13)+' TOTAL. SHOCKS');}
 else{
  if(v===0)L.push('DAMAGE '+r(A*7*ep*ap)+' AFTER 0.9S','FORMULA  POWER '+r(A)+' X 7 X '+(ep*ap).toFixed(2));
  else L.push(...(v===1?[r(4*ep*(1+.06*RK())/.12*6)+' BOLTS OF '+r(A*.65*ep*ap)+' OVER '+(4*ep*(1+.06*RK())).toFixed(1)+'S']:['FREEZES ALL FOES '+(3.5*(1+.15*S.epow)).toFixed(1)+'S','FROZEN FOES TAKE +40% DAMAGE']));
  L.push('KILLS CUT THE COOLDOWN');}
 L.push((cd?'COOLDOWN '+cd.toFixed(1)+'S   ':'')+'CRIT '+r(S.crit*100)+'%');
 return L;
}
function drawTooltip(){
 const k=hoverSlot();if(!k)return;const sp=SPELLS[k][P.lo[k]],L=[SLOTKEY[k]+'  '+sp.n,sp.d,...spellInfo(k)];
 if(RK()>0&&k!=='m'&&k!=='h')L.push('RANK '+(RK()+1)+': +'+Math.round(RK()*10)+'% POWER  -'+RK()*2+'% CD');
 if(k==='m')L.push('FROM YOUR WEAPON: '+(R.eq.wpn?R.eq.wpn.name:'NONE'),'NEW WEAPON TYPES CHANGE THIS ATTACK');
 else{for(const e of [...new Set(R.ench||[])]){const E=ENCH.find(x=>x.k===e),n=R.ench.filter(x=>x===e).length;L.push({s:'ENCHANT '+fxLabel(E.n,Math.min(5,n))+': '+E.d.replace('ABILITY HITS ',''),c:E.c});}
  const ad=R.addon&&R.addon[k];if(ad)for(const a of SCROLL_ADDONS)if(ad[a.k])L.push({s:'SCROLL '+fxLabel(a.n,a.tier),c:a.c});}
 const S2=s=>typeof s==='string'?s:s.s,w=Math.max(...L.map(s=>txtW(S2(s))))+8,h=L.length*8+4,x=Math.max(2,W-2-w),y=H-34-h;
 ctx.fillStyle='rgba(8,6,12,.92)';ctx.fillRect(x,y,w,h);ctx.fillStyle=sp.c;ctx.fillRect(x,y,w,1);ctx.fillRect(x,y+h-1,w,1);
 L.forEach((s,i)=>txt(S2(s),x+4,y+3+i*8,typeof s==='object'?s.c:i===0?sp.c:i===1?'#fff':'#bbb',1,false));
}
// a gold coin and a revive (a blue spirit flame) for the counters along the bottom
function hudCoin(x,y){ctx.fillStyle='#7a5a10';ctx.fillRect(x+1,y,5,7);ctx.fillRect(x,y+1,7,5);ctx.fillStyle='#e0b040';ctx.fillRect(x+1,y+1,5,5);ctx.fillStyle='#fff0a0';ctx.fillRect(x+2,y+1,2,1);ctx.fillRect(x+1,y+2,1,2);ctx.fillStyle='#7a5a10';ctx.fillRect(x+3,y+2,1,3);}
// JADE: the temple's currency for the skill tree (unspent gold turns into jade when a run ends). A green magatama.
const JADEC='#5fd08a';
function hudJade(x,y){ctx.fillStyle='#1e5a3a';ctx.fillRect(x+1,y,4,1);ctx.fillRect(x,y+1,6,3);ctx.fillRect(x+1,y+4,5,1);ctx.fillRect(x+3,y+5,3,1);ctx.fillRect(x+4,y+6,1,1);
 ctx.fillStyle='#5fd08a';ctx.fillRect(x+1,y+1,4,3);ctx.fillRect(x+2,y+4,3,1);ctx.fillStyle='#c8ffd8';ctx.fillRect(x+1,y+1,1,1);ctx.fillStyle='#1e5a3a';ctx.fillRect(x+2,y+2,1,1);}
function hudRevive(x,y){const f=Math.floor(time*6)%2;ctx.fillStyle='#2a6aa0';ctx.fillRect(x+1,y+3,5,4);ctx.fillRect(x+2,y+1,3,2);ctx.fillRect(x+3-f,y,1,1);ctx.fillStyle='#8cf';ctx.fillRect(x+2,y+3,3,3);ctx.fillRect(x+3,y+2,1,1);ctx.fillStyle='#fff';ctx.fillRect(x+3,y+4,1,2);}
const bossBarBox=()=>({x:Math.round((W-180)/2),y:14,w:180});
function drawHUD(){
 syncLMB();
 // Bottom centre: player health and posture. Gold and revives sit in the left corner.
 {const y=H-16,w=116,x=Math.round((W-w)/2);
  bar(x,y,w,8,P.hp/S.maxhp,'#c73445','#351420');
  if(P.ironBellyUntil>R.time){
   const shieldWidth=Math.max(0,Math.min(w,Math.round(w*P.ironBellyShield/S.maxhp)));
   if(shieldWidth>0){
    const shieldX=Math.min(w-shieldWidth,Math.round(w*P.hp/S.maxhp));
    ctx.fillStyle='#8cf';ctx.fillRect(x+shieldX,y+6,shieldWidth,2);
   }
   if(P.ironBellyPower>0)ctxt('IRON BELLY +'+Math.round(P.ironBellyPower*100)+'% DMG',y-9,'#ffd090');
  }
  ctxt('HP '+Math.ceil(P.hp)+' / '+S.maxhp,y+2,'#fff');
  bar(x,y+10,w,3,P.pos/S.maxpos,P.stag>0?'#f84':'#fd4','#3a3010');
  hudCoin(7,y);txt(String(R.sen),16,y+1,'#fc4');hudRevive(7,y+8);txt('X'+P.rez,16,y+9,P.rez>0?'#bfe8ff':'#777');}
 // HP potions live in the ability bar: C is effectively your heal ability
 {const x=slotX(0)-24,y=SLOTY(),has=R.pots>0;ctx.fillStyle='#000';ctx.fillRect(x-1,y-1,15,15);ctx.fillStyle=has?'#e33':'#555';ctx.fillRect(x,y,13,13);ctx.fillStyle='#14101a';ctx.fillRect(x+1,y+1,11,11);
  if(!has)ctx.globalAlpha=.4;ctx.fillStyle='#c8a070';ctx.fillRect(x+5,y+2,3,1);ctx.fillStyle='#ddd';ctx.fillRect(x+5,y+3,3,2);ctx.fillStyle='#e33';ctx.fillRect(x+3,y+5,7,6);ctx.fillRect(x+4,y+4,5,1);ctx.fillStyle='#ff8080';ctx.fillRect(x+4,y+6,1,3);ctx.globalAlpha=1;
  txt(String(R.pots),x+10,y+8,has?'#fff':'#888');txt('C',x+5,y+15,has?'#ccc':'#777');
  for(let i=0;i<POTMAX;i++){ctx.fillStyle=i<R.pots?'#e33':'#3a2030';ctx.fillRect(x+1+i*4,y+22,3,2);}}
 // top left: your gear, then your relics, then curses
 {let gx=6;for(const s of ['wpn','arm','ring']){const g=R.eq[s];drawItemIcon(g,gx,6);gx+=18;}txt('TAB '+R.pack.length+'/'+PACKMAX,gx,11,R.pack.length>=PACKMAX?'#f66':'#888');if(P.oocRun)txt('SWIFT',gx+38,11,Math.floor(time*4)%2?'#8cf':'#cef');}
 {const ids=Object.keys(R.inv),per=11;let shown=0;ids.forEach((id,i)=>{if(i>=per*2)return;const ix=6+(i%per)*13,iy=24+((i/per)|0)*13;relicBox(ix,iy,id,11);if(R.inv[id]>1)txt(R.inv[id],ix+7,iy+8,'#fff');shown++;});if(shown<ids.length)txt('+'+(ids.length-shown),6+per*13,37,'#aaa');}
 if(curseCount()){const cn={};for(const k of (R.cnames||[]))cn[k]=(cn[k]||0)+1;if(R.curse&&!cn.frail)cn.frail=R.curse;const cy=Object.keys(R.inv).length>11?52:Object.keys(R.inv).length?39:26;let cx=6;txt('CURSES',cx,cy,'#c6f');cx+=28;
  for(const k in cn){const C=CURSES[k];if(!C)continue;const s=C.n.split(' ').pop()+(cn[k]>1?' '+ROM[Math.min(4,cn[k])]:'');txt(s,cx,cy,C.c);cx+=txtW(s)+6;}}
 // spell bar: LMB / RMB attacks, Q E F abilities, R ultimate
 [...SLOTS].forEach((k,i)=>{
  const sp=SPELLS[k][P.lo[k]],x=slotX(i),y=SLOTY(),cd=slotCd(k);
  const mx=k==='m'?.5:k==='h'?spellCd('h'):spellCd(k)+(k==='w'&&P.lo.w===0?S.wardDur:0),ready=cd<=0;
  if(P.lock&&P.lock[k]){ctx.fillStyle='#000';ctx.fillRect(x-1,y-1,15,15);ctx.fillStyle='#333';ctx.fillRect(x,y,13,13);ctx.fillStyle='#14101a';ctx.fillRect(x+1,y+1,11,11);ctx.fillStyle='#888';ctx.fillRect(x+4,y+6,5,4);ctx.fillRect(x+5,y+3,1,3);ctx.fillRect(x+7,y+3,1,3);ctx.fillRect(x+5,y+2,3,1);txt(SLOTKEY[k],x+6-Math.round(txtW(SLOTKEY[k])/2),y+15,'#555');return;}
  // the slot shows a picture of what the ability does (lightning, flames, venom, shields...)
  spellBox(x,y,sp,ready);if(sp.rare||(P.emp&&P.emp[k])){ctx.fillStyle=Math.floor(time*3+i)%2?'#ffe060':'#fff';ctx.fillRect(x-2,y-2,2,2);ctx.fillRect(x+13,y-2,2,2);ctx.fillRect(x-2,y+13,2,2);ctx.fillRect(x+13,y+13,2,2);}
  if(!ready&&i>0){ctx.fillStyle='rgba(0,0,0,.55)';ctx.fillRect(x+1,y+1,11,Math.round(11*Math.min(1,cd/mx)));if(i>1)txt(Math.ceil(cd),x+(cd>=10?2:5),y+4,'#fff');}
  if(k==='e'&&ready){ctx.fillStyle=Math.floor(time*4)%2?'#fd4':'#fff';ctx.fillRect(x-1,y-3,15,1);}
  if(i===2){ctx.fillStyle='#555';ctx.fillRect(x-4,y,1,13);}
  txt(SLOTKEY[k],x+6-Math.round(txtW(SLOTKEY[k])/2),y+15,ready?'#ccc':'#777');
  // scroll add-ons on this slot: one coloured pip each
  {const ad=R.addon&&R.addon[k];if(ad){let dx=0;for(const a of ADDONS){if(!ad[a.k])continue;ctx.fillStyle=a.c;ctx.fillRect(x+dx,y+22,2,2);dx+=3;}}}
 });
 // enchants (they power every ability, not the LMB)
 // enchants, grouped: one icon per kind with its stack count
 if(R.ench&&R.ench.length){const ks=[...new Set(R.ench)],x0=slotX(5)+13-ks.length*14;txt('ENCH',x0-19,H-42,'#888');ks.forEach((k,i)=>{ctx.drawImage(itemIcon({t:'ench',k}),x0+i*14,H-46);const n=R.ench.filter(x=>x===k).length;if(n>1)txt(ROM[Math.min(4,n-1)],x0+i*14+7,H-40,'#fff');});}
 if(RK()>0)txt('RANK '+(RK()+1),slotX(0),H-37,'#fd4');
 // hit combo: grows with every hit, pops on each new hit, fades 2s after the last one
 {const age=time-(R.comboAt||-9);if(R.combo>=5&&age<2){const pop=age<.1?2:1,s=R.combo+' HITS',c=R.combo>=100?'#ff5050':R.combo>=50?'#ffd040':R.combo>=25?'#f84':'#fff';
  ctx.globalAlpha=Math.min(1,(2-age)*2);txt(s,W-6-txtW(s,pop),H/2-20,c,pop);ctx.fillStyle=c;ctx.fillRect(W-6-40,H/2-20+(pop===2?12:7),Math.round(40*(1-age/2)),1);ctx.globalAlpha=1;}}
 if(P.storm>0)ctxt('STORM '+P.storm.toFixed(1),H-52,'#ff8a30');
 if(freezeT>0)ctxt('TIME STOPPED '+freezeT.toFixed(1),H-52,'#8cf');
 if((!boss?.awake||boss.dead)&&!R.training)ctxt(R.training?'TRAINING GROUNDS':ROMAN[R.di]+'. '+DUN[R.di].name,4,'#ddd');

 if(P.hCh>0){const k=Math.min(1,P.hCh/HCHARGE);ctx.fillStyle='#14101a';ctx.fillRect(Math.round(W/2-9),H/2+17,18,3);ctx.fillStyle=k>=1?(Math.floor(time*12)%2?'#fff':'#fd4'):'#a89ab8';ctx.fillRect(Math.round(W/2-8),H/2+18,Math.round(16*k),1);}
 if(P.dashCd>0){ctx.fillStyle='#fff';ctx.fillRect(Math.round(W/2-8),H/2+14,Math.round(16*(1-P.dashCd/S.dashCd)),1);}
 // survival phase: big countdown while the boss is invulnerable
 if(boss&&boss.awake&&!boss.dead&&boss.storm>0){const survival=!!(boss.EV&&boss.EVdef?.survival),c=survival?'#8fe0ff':bsty(boss).c,s=(survival?'SURVIVE  ':'EVENT  ')+Math.ceil(boss.storm);txt(s,Math.round((W-txtW(s,2))/2),32,Math.floor(time*4)%2?c:'#fff',2);
  bar(Math.round(W/2-60),46,120,3,boss.storm/(boss.stormMax||8),c,'#2a1a2a');ctxt(boss.EV?.hint||(survival?'BOSS INVULNERABLE - KEEP MOVING':boss.EVdef?.hint||'THE BOSS CANNOT BE HURT - DODGE!'),52,survival?c:'#ddd');}
 // minion event: how many of the guard are left before the shield breaks
 if(boss&&boss.awake&&!boss.dead&&boss.ev&&boss.ev.mins.length){const n=boss.ev.mins.filter(m=>!m.dead).length;if(n){const c=bsty(boss).c,s=boss.ev.name;txt(s,Math.round((W-txtW(s,2))/2),boss.storm>0?62:32,c,2);ctxt('SHIELDED - DEFEAT THE GUARD: '+n+' LEFT',boss.storm>0?78:48,Math.floor(time*3)%2?'#fff':'#9cf');}}
 // arena mechanics the player can use
 if(boss&&boss.awake&&!boss.dead&&!boss.ev){const K=BKIT[boss.name];
  if(boss.banners){const n=boss.banners.filter(b=>!b.dead).length;if(n)ctxt('WAR BANNERS STANDING: '+n+'  (EACH CUTS HIS DAMAGE TAKEN 12%)',H-40,'#e0b040');}
  if(boss.dazzle>0)ctxt('DAZZLED! +35% DAMAGE',H-40,'#ffe080');
  if(boss.eggs&&boss.eggs.some(g=>!g.dead))ctxt('EGG SACS: '+boss.eggs.filter(g=>!g.dead).length+'  (THEY HATCH - BREAK THEM)',H-40,'#e8e0c8');}
 if(boss&&boss.awake&&!boss.dead){const {x,y,w}=bossBarBox();
  ctxt(boss.name,y-9,'#ffb7a4');bar(x,y,w,6,boss.hp/boss.maxhp,'#c73445','#351420');
  if(boss.members){let mx=x;for(const m of boss.members){txt(m.ronin,mx,y+9,m.dead?'#666':m.labelC);if(m.dead){ctx.fillStyle='#c22';ctx.fillRect(mx-1,y+11,txtW(m.ronin)+2,1);}mx+=txtW(m.ronin)+8;}}
  else bar(x,y+8,w,2,boss.posture/boss.maxPosture,'#fd4','#3a3010');}
 if(portal&&!portal.pending){const X=sx(portal.x,portal.y),Y=sy(portal.x,portal.y)-20;if(X<8||X>W-8||Y<8||Y>H-8){const a=Math.atan2(Y-H/2,X-W/2),ex=W/2+Math.cos(a)*Math.min(W/2-14,Math.abs((H/2-14)/(Math.sin(a)||1e-3))),ey=H/2+Math.sin(a)*Math.min(H/2-14,Math.abs((W/2-14)/(Math.cos(a)||1e-3)));const cx=clamp(ex,12,W-12),cy=clamp(ey,12,H-12),bl=Math.floor(time*4)%2;
  ctx.fillStyle='#14101a';ctx.fillRect(cx-4,cy-4,9,9);ctx.fillStyle=bl?'#8cf':'#fff';ctx.fillRect(cx-3,cy-3,7,7);ctx.fillStyle='#14101a';ctx.fillRect(Math.round(cx+Math.cos(a)*2),Math.round(cy+Math.sin(a)*2),2,2);txt('PORTAL',clamp(cx-11,2,W-26),clamp(cy+7,2,H-8),'#8cf');}}
 for(const k of pickups){if(k.k!=='bag'||k.tier!==4||k.dead||k.opened)continue;const X=sx(k.x,k.y),Y=sy(k.x,k.y)-8;if(X>=8&&X<=W-8&&Y>=8&&Y<=H-8)continue;
  const a=Math.atan2(Y-H/2,X-W/2),ex=W/2+Math.cos(a)*Math.min(W/2-14,Math.abs((H/2-14)/(Math.sin(a)||1e-3))),ey=H/2+Math.sin(a)*Math.min(H/2-14,Math.abs((W/2-14)/(Math.cos(a)||1e-3)));
  const cx=Math.round(clamp(ex,12,W-12)),cy=Math.round(clamp(ey,12,H-12)),bl=Math.floor(time*5)%2;
  ctx.fillStyle='#14101a';ctx.fillRect(cx-4,cy-4,9,9);ctx.fillStyle=bl?'#ffd040':'#fff';ctx.fillRect(cx-3,cy-3,7,7);ctx.fillStyle='#14101a';ctx.fillRect(Math.round(cx+Math.cos(a)*2),Math.round(cy+Math.sin(a)*2),2,2);txt('RARE',clamp(cx-8,2,W-18),clamp(cy+7,2,H-8),'#ffd040');}
 const nb=nearBag(),np=nearProp();
 if(nb)drawBagPanel(nb);
 else if(portal&&!portal.pending&&dist(portal,P)<20)ctxt(R.di>=DUN.length-1?'G: THE EMPEROR IS DEAD - LEAVE THE PALACE':'G: ENTER THE PORTAL',H-44,Math.floor(time*3)%2?'#8cf':'#fff');
 else if(np?.k==='lairdoor'&&np.L.free)ctxt((TOUCH?'USE':'G')+': ENTER '+np.L.title+' (OPTIONAL)',H-44,'#fff');
 else if(np){const s=np.k==='pedestal'?'G: BUY '+np.name+' - '+np.price+' GOLD':np.k==='chest'?(chestLocked(np)?'SEALED - DEFEAT EVERY FOE IN THE ROOM':'G: OPEN CHEST'):np.k==='spring'?'G: DRINK FROM THE SPRING':np.k==='gong'?'G: STRIKE THE GONG - CHALLENGE FOR A RARE BAG':np.k==='lairdoor'?((R.keys||0)>0?'G: UNLOCK '+np.L.title:'SEALED: '+np.L.title+' - NEEDS A LAIR KEY'):np.curse?'G: ACCEPT '+CURSES[np.ck||'frail'].n:np.k==='blantern'?(np.lit>0?'THE LANTERN BURNS':np.cd>0?'THE LANTERN IS COOLING':'G: LIGHT THE LANTERN - LURE HER IN'):'G: MAKE AN OFFERING';ctxt(s,H-44,'#fff');
  // the curse altar spells out exactly what you are agreeing to
  if(np.curse){const C=CURSES[np.ck||'frail'],Ls=C.L.concat([{s:'LASTS ALL RUN AND STACKS',c:'#888'}]),w=196,h=Ls.length*9+18,x=Math.round((W-w)/2),y=H-50-h;ctx.fillStyle='rgba(20,8,12,.94)';ctx.fillRect(x,y,w,h);ctx.fillStyle=C.c;ctx.fillRect(x,y,w,1);ctx.fillRect(x,y+h-1,w,1);
   txt(C.n,x+4,y+4,C.c);{const s2='YOU CARRY '+curseCount();txt(s2,x+w-4-txtW(s2),y+4,'#c6f');}Ls.forEach((l,i)=>txt(l.s,x+4,y+14+i*9,l.c));}
  else if(np.k==='altar'&&np.god){const D=GODS[np.god];ctxt(D.n+' - '+D.sub,H-54,D.c);}if(np.k==='pedestal'){const it=np.item?ITEMBY[np.item]:null;
   if(it)ctxt(FXNAME[fxStyle(it.id)]+' RELIC '+ROM[it.r]+': '+it.d,H-36,fxCol(it.id));
   else if(np.gear)ctxt(gearLines(np.gear).slice(1,3).join('  '),H-36,QUAL[np.gear.q].c);
   else if(np.ench){const E=ENCH.find(x=>x.k===np.ench.k);ctxt('ENCHANT: '+E.d,H-36,E.c);}
   else if(np.reroll)ctxt('SWAPS THE 3 RELICS FOR NEW ONES. PRICE RISES EACH TIME',H-36,'#ffd040');
   else ctxt('HP POTION: DRINK WITH C TO HEAL 35%',H-36,'#50e060');}}
 drawMinimap();
 if(toast.t>0){ctx.globalAlpha=Math.min(1,toast.t);ctxt(toast.s,24,toast.c,1);ctx.globalAlpha=1;}
 if(P.hp<S.maxhp*.3){ctx.fillStyle='rgba(180,0,0,'+(.12+.06*Math.sin(time*6))+')';ctx.fillRect(0,0,W,H);}
}
function sceneTiles(M){
 if(M.scene)return M.scene;
 const walls=[],liquids=[];
 for(let ty=0;ty<MH;ty++)for(let tx=0;tx<MW;tx++){
  const i=ty*MW+tx,wall=!map.t[i]&&map.vis[i];
  if(!wall&&!map.liq[i])continue;
  const [u,v]=tileR(tx,ty),row=u+v,x=(u-v+RMH)*T,y=row*HY,h=hash(tx,ty);
  if(wall){
   const mask=(floorAtR(u,v+1)?1:0)|(floorAtR(u+1,v)?2:0);
   (walls[row]??=[]).push({wall:true,d:(row+1)*T,x,y,sprite:M.walls[mask*2+(h<.5?0:1)]});
  }else (liquids[row]??=[]).push({x,y,h});
 }
 return M.scene={walls,liquids};
}
function visibleTileRows(rows,top,bottom,visit){
 const first=Math.max(0,Math.ceil((cam.y-top)/HY)),end=Math.min(rows.length-1,Math.floor((cam.y+H+bottom)/HY));
 for(let i=first;i<=end;i++)if(rows[i])for(const o of rows[i])visit(o);
}
function drawEntrance(p,X,Y){
 const boss=p.gate==='boss',edge=boss?'#a84843':'#578b76',glow=boss?'#f4b472':'#b8e6ad';
 const px=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(X+x,Y+y,w,h);};
 if(p.k==='doorpost'){
  shadow(X,Y,13);
  px(-5,-4,10,4,'#27232b');px(-4,-5,8,2,'#72605c');
  px(-2,-27,4,23,'#352631');px(-2,-25,1,19,edge);
  px(-5,-27,10,3,'#2b222d');px(-7,-28,14,1,edge);
  px(-4,-23,8,8,'#211b28');px(-3,-22,6,6,edge);
  px(-2,-21,4,4,glow);px(-1,-20,2,2,'#fff0bd');
  px(-1,-16,2,2,glow);
 }else{
  shadow(X,Y,14);px(-2,-15,3,15,'#402f32');
  px(-12,-22,24,10,'#241b27');px(-11,-21,22,8,edge);px(-10,-20,20,6,'#272330');
  const label=boss?'BOSS':'SHOP';
  txt(label,X-Math.round(txtW(label)/2),Y-19,glow);
 }
}
function drawWall(o){ctx.drawImage(o.sprite,o.x-cam.x-16,o.y-cam.y-WH);}
function drawLiquids(rows){
 const L=map.env.lc,lq0=map.env.liq;
 visibleTileRows(rows,20,4,({x,y,h})=>{
  const X=x-cam.x,Y=y-cam.y;if(X<-20||X>W+20)return;
 const ph=time*(lq0===2?1.6:1.1)+h*TAU,s=Math.sin(ph);
  if(lq0===4){if(s>.96){ctx.fillStyle='#fff';ctx.fillRect(X-4+((h*9)|0),Y+6,1,1);}return;}
  ctx.fillStyle=L[2];ctx.globalAlpha=lq0===2?.55:.35;
  const ox=Math.round(Math.sin(ph*.7)*3);ctx.fillRect(X-5+ox,Y+7+((h*3)|0),4+((s+1)*1.5|0),1);
  if(h>.6){ctx.fillRect(X+2-ox,Y+10,3,1);}
  ctx.globalAlpha=1;
  if((lq0===2||lq0===3)&&s>.92){ctx.fillStyle=L[2];ctx.fillRect(X-1+((h*7)|0)%5,Y+5-((s-.92)*40|0),1,1);}
 });
}
// red screen edges when hurt / low on health
function vignette(col,a){ctx.fillStyle=col;for(let i=0;i<10;i++){ctx.globalAlpha=a*(1-i/10)*.55;ctx.fillRect(0,i*2,W,2);ctx.fillRect(0,H-2-i*2,W,2);ctx.fillRect(i*3,0,3,H);ctx.fillRect(W-3-i*3,0,3,H);}ctx.globalAlpha=1;}
// boss name card with letterbox bars while the camera pans to the boss
function drawIntro(){const el=INTRO-introT,bar=Math.round(22*Math.min(1,el/.3,introT/.3));ctx.fillStyle='#000';ctx.fillRect(0,0,W,bar);ctx.fillRect(0,H-bar,W,bar);
 if(el>.4&&introT>.3){const a=Math.min(1,(el-.4)/.3,(introT-.3)/.3);ctx.globalAlpha=a;const nm=introE.name,sc=txtW(nm,2)>W-20?1:2;
  ctx.fillStyle='rgba(0,0,0,.55)';ctx.fillRect(0,H/2+18,W,30);txt(nm,Math.round((W-txtW(nm,sc))/2),H/2+22,'#f55',sc);
  const sub=ROMAN[R.di]+'. '+DUN[R.di].name+' - GUARDIAN';txt(sub,Math.round((W-txtW(sub))/2),H/2+38,'#ccc');
  const lw=Math.round(Math.min(1,(el-.4)/.5)*120);ctx.fillStyle='#d02030';ctx.fillRect(W/2-lw,H/2+33,lw*2,1);ctx.globalAlpha=1;}}
function renderPlay(){
 ctx.fillStyle='#07060a';ctx.fillRect(0,0,W,H);
 // screen shake is almost gone (at most a 1px nudge on the very biggest moments); power comes from recoil, bursts and freeze-frames instead
 const sk=shake>=10&&OPT().shake?1:0,shx=sk?Math.round(rnd(-1,1)):0;
 let fcx=P.x,fcy=P.y;if(introT>0&&introE){const el=INTRO-introT,f=Math.min(1,el/.5,introT/.5),k=f*f*(3-2*f);fcx=P.x+(introE.x-P.x)*k;fcy=P.y+(introE.y-P.y)*k;}
 // Keep pixel-art placement on the logical grid and scroll the whole scene in backing-pixel steps.
 const scrollX=isoX(fcx,fcy)-W/2+shx,scrollY=isoY(fcx,fcy)-(H/2+6);
 const snap=v=>Math.round(v*viewScale)/viewScale,viewX=snap(scrollX),viewY=snap(scrollY);
 cam.x=Math.round(scrollX);cam.y=Math.round(scrollY);
 const px=isoX(P.x,P.y),py=isoY(P.x,P.y),playerDX=snap(px)-Math.round(px),playerDY=snap(py)-Math.round(py);
 ctx.save();
 try{
 ctx.translate(cam.x-viewX,cam.y-viewY);
 const M=mapCanvas;
 {const x0=Math.max(0,Math.floor(viewX)),y0=Math.max(0,Math.floor(viewY)),x1=Math.min(M.FW,Math.ceil(viewX+W)),y1=Math.min(M.FH,Math.ceil(viewY+H));if(x1>x0&&y1>y0)ctx.drawImage(M.floor,x0,y0,x1-x0,y1-y0,x0-cam.x,y0-cam.y,x1-x0,y1-y0);}
 const tiles=sceneTiles(M);
 drawLiquids(tiles.liquids);
 drawGround();
 const dr=[];
 visibleTileRows(tiles.walls,30,WH+16,o=>{if(o.x>=cam.x-32&&o.x<=cam.x+W+32)dr.push(o);});
 // draw order follows depth in the rotated view, so walls and sprites overlap correctly at every camera angle
 for(const e of enemies){if(e.dead)continue;const X=sx(e.x,e.y),Y=sy(e.x,e.y);if(X<-60||X>W+60||Y<-80||Y>H+70)continue;dr.push({d:dep(e.x,e.y),e});}
 const onScreen=(o,pad)=>{
  const x=sx(o.x,o.y),y=sy(o.x,o.y);
  return x>=-pad&&x<=W+pad&&y>=-pad&&y<=H+pad;
 };
 for(const k of pickups)if(!k.dead&&onScreen(k,65))dr.push({d:dep(k.x,k.y)-3,k});
 for(const p of props)if(onScreen(p,72))dr.push({d:dep(p.x,p.y),p});
 for(const o of decos){const X=sx(o.x,o.y),Y=sy(o.x,o.y);if(X<-40||X>W+40||Y<-10||Y>H+50)continue;dr.push({d:dep(o.x,o.y)-((DECOSPR[o.k].flat||o.onliq)?60:0),dc:o});}
 dr.push({d:dep(P.x,P.y),pl:1});
 dr.sort((a,b)=>a.d-b.d);
 for(const o of dr){if(o.wall)drawWall(o);else if(o.e)drawEnemy(o.e);else if(o.k)drawPickup(o.k);else if(o.p)drawProp(o.p);else if(o.dc)drawDeco(o.dc);else{
  ctx.save();try{ctx.translate(playerDX,playerDY);drawPlayer();}finally{ctx.restore();}
 }}
 drawPortal();
 for(const q of projs)drawProj(q);
 // the hitbox core is always drawn on top of everything: only this dot can be hit by bullets
 // only shown when it matters: while focusing (SHIFT), or fading in as enemy bullets get close
 if(P.hp>0){let near=99;for(const q of projs)if(q.from==='e'){const d=scrDist(q)-q.r;if(d<near)near=d;}
  const a=P.focus?1:clamp((40-near)/25,0,1);
  if(a>0){const X=sx(P.x,P.y),Y=sy(P.x,P.y)-7;ctx.translate(playerDX,playerDY);ctx.globalAlpha=a;
   if(P.focus){ctx.globalAlpha=.5;circ(X,Y,12,'#cef');ctx.globalAlpha=a;}
   ctx.fillStyle='#14101a';ctx.fillRect(X-2,Y-2,5,5);ctx.fillStyle='#fff';ctx.fillRect(X-1,Y-1,3,3);ctx.fillStyle=P.focus?'#f44':'#ff8080';ctx.fillRect(X,Y,1,1);ctx.globalAlpha=1;ctx.translate(-playerDX,-playerDY);}}
 if(slowT>0||ultSlow>0){ctx.fillStyle='rgba(160,220,255,.08)';ctx.fillRect(viewX-cam.x,viewY-cam.y,W,H);}
 for(const f of fx)drawFx(f);
 for(const q of particles){ctx.fillStyle=q.col;ctx.fillRect(sx(q.x,q.y),sy(q.x,q.y)-8,1,1);}
 drawAmbient();
 for(const t of texts){ctx.globalAlpha=Math.min(1,t.t*2);txt(t.s,sx(t.x,t.y)-Math.round(txtW(t.s,t.sc)/2),sy(t.x,t.y)-24-(t.sc>1?4:0)-(.9-t.t)*14|0,t.col,t.sc);ctx.globalAlpha=1;}
 }finally{ctx.restore();}
 if(freezeT>0){ctx.fillStyle='rgba(120,160,255,.14)';ctx.fillRect(0,0,W,H);}
 if(flashT>0&&OPT().flash){ctx.globalAlpha=Math.min(.35,flashT*3);ctx.fillStyle=flashCol;ctx.fillRect(0,0,W,H);ctx.globalAlpha=1;}
 {const low=P.hp<S.maxhp*.25?.18+lowPulse*.9:0,a=Math.max(hurtT*1.1,low);if(a>0)vignette('#c01010',Math.min(.6,a));}
 if(introT>0&&introE)drawIntro();
 if(P.dying>0){drawDeathOverlay();return;}
 drawRoomEvents();if(R.training)drawTraining();if(!paused)drawHUD();if(invOpen)drawInv();else if(!paused)drawTooltip();
 if(paused)drawPause(); // src/102-menus.js
}
// the shared menu backdrop: the emperor's palace on its hill under a sky turned violet by his corruption,
// a pale moon, the far ridges, embers of the burning town drifting up
function bg(){
 const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0c0614');g.addColorStop(.55,'#2a0e30');g.addColorStop(.85,'#4a1426');g.addColorStop(1,'#140810');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 // corrupted aurora bands behind the palace
 for(let i=0;i<3;i++){ctx.fillStyle=['rgba(160,64,255,.10)','rgba(64,200,140,.08)','rgba(160,64,255,.07)'][i];for(let x=0;x<W;x+=2){const y=34+i*12+Math.round(8*Math.sin(x*.03+time*.4+i*2));ctx.fillRect(x,y,2,6);}}
 disc(40,78,16,'#e8e0d0');disc(44,75,14,'#d0c8c0');ctx.fillStyle='rgba(160,64,255,.25)';ctx.fillRect(28,82,24,2);
 // far ridges then the near hill
 ctx.fillStyle='#1a0c22';for(let x=0;x<W;x++){const h=Math.floor(34+12*Math.sin(x*.045)+8*Math.sin(x*.12+1));ctx.fillRect(x,H-h-14,1,h+14);}
 ctx.fillStyle='#10060f';for(let x=0;x<W;x++){const d=(x-W/2)/(W/2),h=Math.floor(46-30*d*d);ctx.fillRect(x,H-h,1,h);}
 // the palace: tiered roofs with upswept eaves, a central tower, lit windows, a jade glow at the top
 const px=Math.round(W/2),py=H-24,roof=(cx,y,w)=>{for(let j=0;j<3;j++)ctx.fillRect(cx-w/2-3+j,y+j,w+6-j*2,1);ctx.fillRect(cx-w/2-4,y-1,2,1);ctx.fillRect(cx+w/2+2,y-1,2,1);};
 ctx.fillStyle='#0a040a';ctx.fillRect(px-56,py-6,112,8);roof(px,py-9,118);ctx.fillRect(px-40,py-21,80,12);roof(px,py-24,88);ctx.fillRect(px-24,py-35,48,11);roof(px,py-38,56);ctx.fillRect(px-11,py-47,22,9);roof(px,py-50,28);ctx.fillRect(px-1,py-57,2,7);
 ctx.fillRect(px-74,py-16,12,18);roof(px-68,py-19,14);ctx.fillRect(px+62,py-16,12,18);roof(px+68,py-19,14);
 for(const [x,y] of [[-32,-18],[-21,-18],[-10,-18],[9,-18],[20,-18],[31,-18],[-14,-32],[-3,-32],[8,-32],[-1,-45],[-69,-10],[67,-10]]){ctx.fillStyle=Math.sin(time*2+x)>-.6?'#ffb040':'#c07020';ctx.fillRect(px+x,py+y,2,2);}
 ctx.globalAlpha=.35+.15*Math.sin(time*2);disc(px,py-59,4,'#40e0a0');ctx.globalAlpha=1;ctx.fillStyle='#80ffd0';ctx.fillRect(px,py-60,1,2);
 ctx.fillStyle='#0a060c';ctx.fillRect(0,H-12,W,12);
 // embers drifting up from the burning town below
 for(let i=0;i<30;i++){const x=(i*53+Math.sin(time+i)*6)%W,y=H-((i*37+time*12)%H);ctx.fillStyle=i%3?'rgba(255,150,60,.55)':'rgba(190,120,255,.5)';ctx.fillRect(Math.round(x),Math.round(y),1,1);}
}
function renderTitle(){
 // arcade-cabinet logo: a gold banner line, the big crimson EMPEROR with a hot flicker, gold rules either side
 bg();ctxt('SHINOBI',6,'#e0b040',2);
 {const fl=Math.floor(time*8)%9===0;ctxt('DUNGEONS',19,fl?'#ff6040':'#e02838',5);}
 ctx.fillStyle='#e0b040';ctx.fillRect(Math.round(W/2-100),48,200,1);ctx.fillStyle='#a02030';ctx.fillRect(Math.round(W/2-70),50,140,1);
 ctxt('STORM THE PALACE. TWELVE STAGES. END THE CORRUPT EMPEROR.',55,'#ccc');
 // text sits in the sky band above the palace; a dark plate keeps it readable over the aurora
 if(Math.floor(time*2)%2===0)ctxt('- PRESS START -',70,'#fff');ctxt('ENTER OR CLICK',H-20,'#777');
 {const s=savedRun();ctxt(s?'C: CONTINUE RUN - '+ROMAN[s.R.di]+'. '+DUN[s.R.di].name:'O: OPTIONS',81,s?'#8cf':'#999');if(s)ctxt('O: OPTIONS',92,'#999');}
 ctxt('FILL THE STUN BAR, THEN PUNISH THE STUN',H-9,'#c8a0ff');
 // the build: tells you at a glance whether the browser is running the latest code
 txt('V'+GAME_VERSION,W-4-txtW('V'+GAME_VERSION),H-9,'#666');
}
function renderHub(){
 bg();ctx.fillStyle='rgba(8,4,12,.85)';ctx.fillRect(12,4,296,174);ctx.fillStyle='#d02030';ctx.fillRect(12,4,296,1);ctx.fillRect(12,177,296,1);
 ctxt('HALL OF LANTERNS',8,'#d02030',2);
 hudJade(18,23);txt('JADE '+meta.sen,27,24,JADEC);{const s='RUNS '+meta.runs+'  WINS '+meta.wins;txt(s,302-txtW(s),24,'#888');}
 txt(meta.ascMax?'ASCENSION '+meta.asc+'/'+meta.ascMax+' (Q/E)':'WIN A RUN TO UNLOCK ASCENSION',18,32,meta.asc?'#f5a':'#666');{const g=meta.guide||{},n=Object.values(g).reduce((a,o)=>a+Object.keys(o).length,0),s='K: GUIDE ('+n+' FOUND)';txt(s,302-txtW(s),32,'#8cf');}
 sep(16,40,288);
 const row=(i,y,label,right,col)=>{const sel=hubSel===i;if(sel){ctx.fillStyle='rgba(208,32,48,.35)';ctx.fillRect(16,y-2,288,9);}txt((sel?'> ':'  ')+label,18,y,col||'#ddd');if(right)txt(right,302-txtW(right),y,sel?'#fff':'#888');};
 row(0,44,'BEGIN RUN',ROMAN[0]+'. '+DUN[0].name,'#fff');
 sep(16,53,288);{const C0=CLS();row(1,56,'CHARACTER',C0.n,C0.col);const sp=heroSpr(C0.k,0);ctx.drawImage(sp.c,0,0,20,24,280,63,20,24);ctx.drawImage(heroSpr(C0.k,9).c,0,0,20,24,258,63,20,24);}
 [...SLOTS].forEach((k,i)=>{const sp=SPELLS[k][CLS().kit[k]];txt((SLOTKEY[k]+'   ').slice(0,4),24,66+i*8,'#888');txt(sp.n,44,66+i*8,sp.c);txt((sp.d0||sp.d).slice(0,32),128,66+i*8,'#777');});
 sep(16,113,288);
 skillHubSummary(row); // the temple skill tree (src/98-skilltree.js)
 const tip=hubSel===0&&meta.asc>0?'ASC '+meta.asc+': FOES +'+meta.asc*15+'% HP, FASTER SHOTS. +'+meta.asc*20+'% GOLD':savedRun()?'C CONTINUE SAVED RUN  O OPTIONS  Y TRAINING':'W/S SELECT  ENTER START  O OPTIONS  Y TRAIN  B BOSS RUSH';
 ctxt(tip,171,'#aaa');
 if(codexOpen)drawCodex();
}
