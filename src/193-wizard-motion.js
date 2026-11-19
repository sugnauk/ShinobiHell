'use strict';
// SHINOBIDUNGEONS - the WIZARD kit performed (see ANIMATION_AUDIT.md; core in 191). Amber runes and void violet.
//  RMB VOID ORB       a staff thrust that pushes out a small black hole: a dark core inside a turning violet disc
//  Q   CHAIN LIGHTNING the staff jolts forward and a forked bolt crackles from foe to foe, flickering as it holds
//  E   SPIRIT WARD    four rune tablets orbit him like a turning shield; a tablet flares when it throws a shot back
//  F   FROST NOVA     the staff slams down and a ring of ice spikes bursts out to the blast's edge, then shatters
//  R   DRAGON DESCENT a rune circle opens on the target and a golden dragon's claw falls out of the sky onto it
Object.assign(ABTUNE,{void:{push:.26},zap:{pose:.26,hold:.25,flick:.04},ward:{plates:4,rad:15,spin:2.4},nova:{front:.15,hold:.3,shatter:.15,spikes:22},descent:{fall:.9}});
for(const n of ['VOID ORB','CHAIN LIGHTNING','SPIRIT WARD','FROST NOVA'])ABX_OWN.add(n);
Object.assign(AB_ANIM,{'VOID ORB':['voidpush',ABTUNE.void.push],'CHAIN LIGHTNING':['zap',ABTUNE.zap.pose],'SPIRIT WARD':['wardplant',.4]});
const isWiz=()=>P&&CLS().k==='wizard';
{const _pa=abPoseAt;abPoseAt=function(H){const u=clamp((time-H.t0)/H.dur,0,1),d=H.dir,o={u,back:false,frame:null,flip:d<0,dx:0,dy:0,sx:1,sy:1,skew:0,rot:0,alpha:1};
 switch(H.k){
  // staff drawn back, then thrust forward; the body rocks back as the orb leaves
  case 'voidpush':{if(u<.3){const k2=abEase(u/.3);o.frame=6;o.skew=-.12*d*k2;o.dx=-Math.round(k2)*d;}else{const k2=1-abEase((u-.3)/.7);o.frame=7;o.skew=.16*d*k2;o.dx=Math.round(2*k2)*d;o.sy=1-.04*k2;}break;}
  // staff out, the whole body jolting with the current
  case 'zap':{o.frame=7;const k2=1-u;o.dx=Math.round(Math.sin(time*90)*1.5*k2)+Math.round(-k2)*d;o.skew=-.1*d*k2;o.sy=1+.04*Math.sin(time*70)*k2;break;}
  // the staff planted, arms raised as the tablets rise
  case 'wardplant':{o.frame=u<.5?8:9;const k2=Math.sin(u*Math.PI);o.sy=1-.06*k2;o.dy=0;break;}
  default:return _pa.apply(this,arguments);}
 return o;};}
// ---- RMB VOID ORB: a small black hole ----
PSPR.void=(X,Y,ux,uy,q)=>{const t=time*5+q.x*.05;
 ctx.globalAlpha=.35;ctx.fillStyle='#6a2aa0';ctx.beginPath();ctx.ellipse(X,Y,9,4,0,0,TAU);ctx.fill();ctx.globalAlpha=1;
 // the accretion disc turning round it
 for(let i=0;i<14;i++){const a=t+i/14*TAU,px=X+Math.cos(a)*8,py=Y+Math.sin(a)*3;ctx.fillStyle=i%3?'#a66cff':'#e8d0ff';ctx.fillRect(Math.round(px),Math.round(py),i%3?1:2,1);}
 ctx.fillStyle='#14101a';ctx.beginPath();ctx.arc(X,Y,4,0,TAU);ctx.fill();ctx.fillStyle='#000';ctx.fillRect(X-2,Y-2,4,4);ctx.fillStyle='#c8a0ff';ctx.fillRect(X-3,Y-1,1,2);
 // motes drawn in
 if(Math.random()<.35){const a=Math.random()*TAU,r=14;particles.push({x:q.x+Math.cos(a)*r,y:q.y+Math.sin(a)*r,vx:-Math.cos(a)*r*3,vy:-Math.sin(a)*r*3,t:.25,col:'#a66cff'});}};
{const _ch=castHeavy;castHeavy=function(){const n0=projs.length;const r=_ch.apply(this,arguments);if(isWiz()&&P.lo.h===1)for(let i=n0;i<projs.length;i++){const q=projs[i];if(q.from==='p'&&q.col==='#a6f')q.spr='void';}return r;};}
// ---- Q CHAIN LIGHTNING: a forked bolt that holds and flickers ----
function abxBolt(pts,o){const Z=ABTUNE.zap;topFx({dur:Z.hold+.12,pts,seed:0,draw(o2,k){const fade=k<.75?1:1-(k-.75)/.25;if(Math.floor((time-o2.t0)/Z.flick)!==o2.seed){o2.seed=Math.floor((time-o2.t0)/Z.flick);o2.path=null;}
  if(!o2.path){o2.path=[];for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1],ax=sx(a.x,a.y),ay=sy(a.x,a.y)-8,bx=sx(b.x,b.y),by=sy(b.x,b.y)-8,L=Math.hypot(bx-ax,by-ay),n=Math.max(2,Math.ceil(L/7)),nx=-(by-ay)/(L||1),ny=(bx-ax)/(L||1);
    const seg=[[ax,ay]];for(let k2=1;k2<n;k2++){const f=k2/n,j=(Math.random()-.5)*7;seg.push([ax+(bx-ax)*f+nx*j,ay+(by-ay)*f+ny*j]);}seg.push([bx,by]);o2.path.push(seg);
    // a fork or two splitting off the main stroke
    for(let fk=0;fk<2;fk++){const s0=seg[1+Math.floor(Math.random()*(seg.length-2))];if(!s0)continue;const fa=Math.atan2(by-ay,bx-ax)+(Math.random()<.5?-1:1)*(.6+Math.random()*.5),fl=6+Math.random()*8;o2.path.push([s0,[s0[0]+Math.cos(fa)*fl*.5+(Math.random()-.5)*3,s0[1]+Math.sin(fa)*fl*.5],[s0[0]+Math.cos(fa)*fl,s0[1]+Math.sin(fa)*fl]]);}}}
  for(const [w,c,al] of [[3,'#5fb8ff',.55],[1,'#ffffff',1]]){ctx.globalAlpha=al*fade;ctx.strokeStyle=c;ctx.lineWidth=w;for(const seg of o2.path){ctx.beginPath();seg.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();}}ctx.lineWidth=1;
  // a white burst where it strikes each foe
  for(let i=1;i<pts.length;i++){const X=sx(pts[i].x,pts[i].y),Y=sy(pts[i].x,pts[i].y)-8;ctx.globalAlpha=fade;ctx.fillStyle='#ffffff';ctx.fillRect(X-1,Y-1,3,3);ctx.fillStyle='#9fd8ff';ctx.fillRect(X-3,Y,1,1);ctx.fillRect(X+3,Y,1,1);ctx.fillRect(X,Y-3,1,1);ctx.fillRect(X,Y+3,1,1);}}});}
{const _cq=castChain;castChain=function(){const n0=fx.length;const r=_cq.apply(this,arguments);if(isWiz()&&P.lo.q===0){for(let i=fx.length-1;i>=n0;i--)if(fx[i].k==='bolt'){abxBolt(fx[i].pts);fx.splice(i,1);}}return r;};}
// ---- E SPIRIT WARD: four rune tablets orbiting as a shield (replaces the plain bubble) ----
{const _dp=drawPlayer;drawPlayer=function(){const p=P;if(!p||!(p.ward>0)||!isWiz())return _dp.apply(this,arguments);
 const w=p.ward;const draw=(front)=>{const W=ABTUNE.ward,X=sx(p.x,p.y),Y=sy(p.x,p.y)-11;for(let i=0;i<W.plates;i++){const a=time*W.spin+i/W.plates*TAU,s=Math.sin(a);if((s>0)!==front)continue;
   const px=Math.round(X+Math.cos(a)*W.rad),py=Math.round(Y+s*W.rad*.45),flare=p.wardRefT&&time-p.wardRefT<.15&&i===(p.wardRefI||0),wid=Math.max(1,Math.round(4*Math.abs(Math.cos(a))+1));
   ctx.globalAlpha=front?1:.6;ctx.fillStyle='#14101a';ctx.fillRect(px-wid,py-5,wid*2+1,10);ctx.fillStyle=flare?'#ffffff':'#8cf';ctx.fillRect(px-wid+1,py-4,wid*2-1,8);if(wid>2){ctx.fillStyle=flare?'#8cf':'#ffe080';ctx.fillRect(px-1,py-3,3,1);ctx.fillRect(px,py-2,1,4);ctx.fillRect(px-1,py+1,3,1);}}ctx.globalAlpha=1;};
 draw(false);p.ward=0;try{_dp.apply(this,arguments);}finally{p.ward=w;}draw(true);};}
// a tablet flares when the ward throws a shot back
{const _hp=hitPlayer;hitPlayer=function(raw,x,y,o){const w=P&&P.ward>0;const r=_hp.apply(this,arguments);if(w&&isWiz()&&r==='dodge'){P.wardRefT=time;P.wardRefI=((P.wardRefI||0)+1)%ABTUNE.ward.plates;}return r;};}
// ---- F FROST NOVA: ice spikes burst out to the blast radius, hold, then shatter ----
{const _cf=castF;castF=function(){const n0=fx.length,before=P&&P.ab.f;const r=_cf.apply(this,arguments);
 if(isWiz()&&P.lo.f===0&&P.ab.f!==before){for(let i=fx.length-1;i>=n0;i--)if(fx[i].k==='ring')fx.splice(i,1);
  const N=ABTUNE.nova,R0=66*AZ(),cx=P.x,cy=P.y,sp=[];for(let i=0;i<N.spikes;i++){const a=i/N.spikes*TAU+Math.random()*.2,r=R0*(.35+.65*((i*7)%10)/10);sp.push([a,r,6+Math.random()*6]);}
  for(let i=0;i<10;i++){const a=i/10*TAU+.3;sp.push([a,R0,9+Math.random()*4]);}
  topFx({dur:N.front+N.hold+N.shatter,draw(o,k){const t=time-o.t0;for(const [a,r,h0] of sp){const at=N.front*r/R0;if(t<at)continue;const g=Math.min(1,(t-at)/.06),sh=t>N.front+N.hold?1-(t-N.front-N.hold)/N.shatter:1,h=Math.round(h0*g*Math.max(0,sh)),x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r,X=Math.round(sx(x,y)),Y=Math.round(sy(x,y));
    if(h<1){if(sh<1&&Math.random()<.05)particles.push({x,y,vx:rnd(-30,30),vy:rnd(-40,-10),t:.3,col:'#e8f8ff'});continue;}
    ctx.fillStyle='#14101a';ctx.fillRect(X-2,Y-h-1,5,h+1);ctx.fillStyle='#9df';ctx.fillRect(X-1,Y-h,3,h);ctx.fillStyle='#e8f8ff';ctx.fillRect(X-1,Y-h,1,h);ctx.fillStyle='#ffffff';ctx.fillRect(X,Y-h,1,1);}}});}return r;};}
// ---- R DRAGON DESCENT: a golden dragon's claw falls out of the sky onto the blast ----
{const _cu=castUlt;castUlt=function(){const n0=fx.length;const r=_cu.apply(this,arguments);
 if(isWiz()&&P.lo.e===0)for(let i=n0;i<fx.length;i++){const f=fx[i];if(f.k!=='ult'||f.wait)continue;const T0=f.dur;
  topFx({dur:T0+.25,f,draw(o,k){const t=time-o.t0,u=Math.min(1,t/T0),X=sx(f.x,f.y),Yg=sy(f.x,f.y),Y=Yg-Math.round(150*(1-u*u))-6,s=2;
    if(t>T0){ctx.globalAlpha=1-(t-T0)/.25;}
    const R=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(X+x*s),Math.round(Y+y*s),w*s,h*s);};
    // scaled wrist and three talons reaching down (gold, dark outline)
    R(-5,-22,10,14,'#14101a');R(-4,-22,8,13,'#c89020');R(-4,-22,3,13,'#ffd060');for(let yy=-20;yy<-10;yy+=3)R(-3,yy,6,1,'#a07018');
    for(const [ox,len] of [[-6,7],[0,9],[6,7]]){R(ox-2,-10,4,len,'#14101a');R(ox-1,-10,2,len-1,'#e0b040');R(ox-1,-10+len-2,2,2,'#ffffff');}
    if(u<1){ctx.globalAlpha=.3;ctx.fillStyle='#ffd060';for(let j=1;j<5;j++)ctx.fillRect(X-1,Y-50-j*12,3,8);}ctx.globalAlpha=1;}});}
 return r;};}
