'use strict';
// SHINOBIDUNGEONS - the WIZARD kit performed (see ANIMATION_AUDIT.md; core in 191). Amber runes and void violet.
//  RMB VOID ORB       a staff thrust that pushes out a small black hole: a dark core inside a turning violet disc
//  Q   CHAIN LIGHTNING the staff jolts forward and a forked bolt crackles from foe to foe, flickering as it holds
//  E   SPIRIT WARD    a gyroscope of three tilted rune rings turns round him; every shot thrown back flashes the rings
//                     and sends a ripple out from where it struck
//  F   FROST NOVA     ice sweeps over the floor and lifts solid crystals, then flakes apart at the blast's edge
//  R   DRAGON DESCENT a sigil of turning rings opens in the sky over the target, a thread of light drops from it, and
//                     a pillar of golden fire slams down the full width of the blast, leaving a scorched ring
Object.assign(ABTUNE,{void:{push:.26},zap:{pose:.26,hold:.25,flick:.04},ward:{rings:3,rad:15,spin:2.2,flash:.18},nova:{spread:.17,shatter:.39,dur:.69,crust:1.2},descent:{sky:70,pillar:.28,scorch:1.6}});
for(const n of ['VOID ORB','CHAIN LIGHTNING','SPIRIT WARD','FROST NOVA'])ABX_OWN.add(n);
Object.assign(AB_ANIM,{'VOID ORB':['voidpush',ABTUNE.void.push],'CHAIN LIGHTNING':['zap',ABTUNE.zap.pose],'SPIRIT WARD':['wardplant',.4],'FROST NOVA':['frostplant',.4]});
const isWiz=()=>P&&CLS().k==='wizard';
{const _pa=abPoseAt;abPoseAt=function(H){const u=clamp((time-H.t0)/H.dur,0,1),d=H.dir,o={u,back:false,frame:null,flip:d<0,dx:0,dy:0,sx:1,sy:1,skew:0,rot:0,alpha:1};
 switch(H.k){
  // staff drawn back, then thrust forward; the body rocks back as the orb leaves
  case 'voidpush':{if(u<.3){const k2=abEase(u/.3);o.frame=6;o.skew=-.12*d*k2;o.dx=-Math.round(k2)*d;}else{const k2=1-abEase((u-.3)/.7);o.frame=7;o.skew=.16*d*k2;o.dx=Math.round(2*k2)*d;o.sy=1-.04*k2;}break;}
  // staff out, the whole body jolting with the current
  case 'zap':{o.frame=7;const k2=1-u;o.dx=Math.round(Math.sin(time*90)*1.5*k2)+Math.round(-k2)*d;o.skew=-.1*d*k2;o.sy=1+.04*Math.sin(time*70)*k2;break;}
  // the staff planted, arms raised as the tablets rise
  case 'wardplant':{o.frame=u<.5?8:9;const k2=Math.sin(u*Math.PI);o.sy=1-.06*k2;o.dy=0;break;}
  // The blast lands on cast. Brace low, then let the body settle as the ice spreads.
  case 'frostplant':{const press=1-abEase(u);o.frame=u<.55?9:8;o.sy=1-.22*press;o.sx=1+.08*press;o.skew=.12*d*press;break;}
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
// ---- E SPIRIT WARD: a gyroscope of rune rings (replaces the plain bubble) ----
const RUNES=[[1,0,1,0,1,0,1,1,1],[1,1,1,0,1,0,0,1,0],[1,0,0,1,1,1,0,0,1],[0,1,0,1,1,1,0,1,0],[1,1,0,0,1,0,0,1,1],[1,0,1,1,0,1,1,1,1]];
function wardRings(front){const p=P,W2=ABTUNE.ward,X=sx(p.x,p.y),Y=sy(p.x,p.y)-11,fl=p.wardRefT&&time-p.wardRefT<W2.flash;
 for(let j=0;j<W2.rings;j++){const tilt=.55+j*.55,yaw=time*(j%2?-1:1)*(.6+.3*j),col=fl?'#ffffff':j===1?'#c8a0ff':'#ffd060';
  for(let i=0;i<24;i++){const a=i/24*TAU+time*W2.spin*(j===1?-1:1),x3=Math.cos(a)*W2.rad,y3=Math.sin(a)*W2.rad*Math.cos(tilt),z3=Math.sin(a)*W2.rad*Math.sin(tilt);
   const rx=x3*Math.cos(yaw)-z3*Math.sin(yaw),rz=x3*Math.sin(yaw)+z3*Math.cos(yaw);if((rz>0)!==front)continue;
   const gx=Math.round(X+rx),gy=Math.round(Y+y3*.8+rz*.25);ctx.globalAlpha=front?.95:.35;ctx.fillStyle=col;
   // every fourth point carries a rune; the rest are the faint line of the ring
   if(i%4===0){const R2=RUNES[(i/4+j*2)%RUNES.length];for(let k=0;k<9;k++)if(R2[k])ctx.fillRect(gx-1+k%3,gy-1+((k/3)|0),1,1);}else{ctx.globalAlpha*=.6;ctx.fillRect(gx,gy,1,1);}}}
 if(front&&p.wardRip&&time-p.wardRip.t<.3){const k=(time-p.wardRip.t)/.3;ctx.globalAlpha=1-k;ctx.strokeStyle='#ffd060';ctx.beginPath();ctx.ellipse(X+Math.cos(p.wardRip.a)*W2.rad,Y+Math.sin(p.wardRip.a)*W2.rad*.5,2+k*9,1+k*5,0,0,TAU);ctx.stroke();}
 ctx.globalAlpha=1;}
{const _dp=drawPlayer;drawPlayer=function(){const p=P;if(!p||!(p.ward>0)||!isWiz())return _dp.apply(this,arguments);
 const w=p.ward;wardRings(false);p.ward=0;try{_dp.apply(this,arguments);}finally{p.ward=w;}wardRings(true);};}
{const _hp=hitPlayer;hitPlayer=function(raw,x,y,o){const w=P&&P.ward>0;const r=_hp.apply(this,arguments);if(w&&isWiz()&&r==='dodge'){P.wardRefT=time;P.wardRip={t:time,a:Math.atan2((y||P.y)-P.y,(x||P.x)-P.x)};}return r;};}
// ---- F FROST NOVA: a low frost front and solid ice facets ----
function frostFacet(x,y,h,w,lean){h=Math.round(h);if(h<2)return;
 const tip=x+lean,shoulder=y-Math.round(h*.4);
 ctx.fillStyle='#224c68';ctx.beginPath();ctx.moveTo(x-w-1,y);ctx.lineTo(x-w,shoulder);ctx.lineTo(tip,y-h-1);ctx.lineTo(x+w+1,y-2);ctx.lineTo(x+1,y+2);ctx.fill();
 ctx.fillStyle='#67b6d7';ctx.beginPath();ctx.moveTo(x-w,y-1);ctx.lineTo(tip,y-h);ctx.lineTo(x+w,y-2);ctx.lineTo(x+1,y+1);ctx.fill();
 ctx.fillStyle='#c8f3ff';ctx.beginPath();ctx.moveTo(x-w,y-1);ctx.lineTo(tip,y-h);ctx.lineTo(x+1,y);ctx.fill();}
function drawFrostNova(z){const N=ABTUNE.nova,spread=abEase(z.age/N.spread),r=z.r*(.17+.83*spread),
 melt=abEase((z.age-N.shatter)/(N.dur-N.shatter)),fade=1-melt;
 ctx.save();ctx.globalAlpha=.22*fade;wdisc(z.x,z.y,r,'#64c6ea');
 ctx.globalAlpha=.42*fade;wcirc(z.x,z.y,r,'#96dcef');
 for(const c of z.crystals){const grow=abEase((z.age-c.start)/.105),x=sx(c.x,c.y),y=sy(c.x,c.y);if(!grow)continue;
  ctx.globalAlpha=fade;frostFacet(x,y,c.h*grow*(1-melt),c.w,c.lean);
  if(melt>0){const u=Math.sqrt(melt),chipY=y-Math.round(c.h*(.55+u*.45)-melt*melt*12),chipX=x+Math.round(c.lean*(1+u*2));
   ctx.fillStyle='#d4f7ff';ctx.fillRect(chipX,chipY,2,2);}}
 ctx.restore();}
{const _cf=castF;castF=function(){if(!isWiz()||P.lo.f!==0)return _cf.apply(this,arguments);
 const n0=fx.length,before=P.ab.f,x=P.x,y=P.y,reach=66*AZ(),near=enemies.filter(e=>!e.dead&&!e.air&&!(e.iv>0)&&Math.hypot(e.x-x,e.y-y)<reach+e.r&&los(x,y,e.x,e.y));
 const result=_cf.apply(this,arguments);if(P.ab.f===before)return result;
 for(let i=fx.length-1;i>=n0;i--)if(fx[i].k==='ring')fx.splice(i,1);
 const N=ABTUNE.nova,crystals=[];
 for(let i=0;i<36;i++){const a=i/36*TAU,outer=i%3!==1,r=reach*(outer?.91:.59),cx=x+Math.cos(a)*r,cy=y+Math.sin(a)*r;
  if(!los(x,y,cx,cy))continue;
  crystals.push({x:cx,y:cy,start:N.spread*(r/reach)*.73,h:outer?8+(i%5)*3:5+i%4,w:outer?3+i%2:2,lean:i%2?3:-3});}
 crystals.sort((a,b)=>dep(a.x,a.y)-dep(b.x,b.y));
 kitZone({x,y,r:reach,t:N.dur,crystals,ground:drawFrostNova});
 for(const e of near)topFx({dur:N.crust,e,draw(o,k){const e=o.e;if(e.dead){o.dead=1;return;}
  const x=sx(e.x,e.y),y=sy(e.x,e.y)+1,fade=1-abEase((k-.7)/.3),grow=abEase(k*15);
  ctx.globalAlpha=.83*fade;frostFacet(x-4,y,9*grow,2,-2);frostFacet(x+4,y+1,13*grow,2,2);}});
 return result;};}
// ---- R DRAGON DESCENT: a sigil opens in the sky and a pillar of golden fire comes down through it ----
{const _df=drawFx;drawFx=function(f){if(f.wizd)return;return _df.apply(this,arguments);};}
{const _cu=castUlt;castUlt=function(){const n0=fx.length;const r=_cu.apply(this,arguments);
 if(isWiz()&&P.lo.e===0)for(let i=n0;i<fx.length;i++){const f=fx[i];if(f.k!=='ult'||f.wait||f.wizd)continue;f.wizd=1;const T0=f.dur,D=ABTUNE.descent;
  topFx({dur:T0+D.scorch,f,draw(o,k){const t=time-o.t0,u=Math.min(1,t/T0),X=sx(f.x,f.y),Yg=sy(f.x,f.y),Ys=Yg-D.sky,rr=f.r;
   // the ground: the blast's exact reach, filling as it comes
   const ring=(y0,rad,sc,col,al,n,rot)=>{ctx.globalAlpha=al;ctx.fillStyle=col;for(let j=0;j<n;j++){const a=j/n*TAU+rot;ctx.fillRect(Math.round(X+Math.cos(a)*rad),Math.round(y0+Math.sin(a)*rad*sc),2,1);}};
   if(t<T0){ctx.globalAlpha=.12+.18*u;ctx.fillStyle='#ffb040';ctx.beginPath();ctx.ellipse(X,Yg,rr*1.05*u,rr*.55*u,0,0,TAU);ctx.fill();ring(Yg,rr*1.05,.52,'#ffd060',.8,40,time*.6);
    // the sky sigil: three counter-turning rings with rune ticks, growing
    for(let j=0;j<3;j++)ring(Ys,(10+j*9)*Math.min(1,u*1.6),.35,j===1?'#fff0b0':'#ffd060',.9,14+j*8,time*(j%2?-1.4:1.1));
    // a thread of light, thickening, motes falling down it
    if(u>.45){const th=Math.round(1+(u-.45)*6);ctx.globalAlpha=.5+.5*u;ctx.fillStyle='#fff0b0';ctx.fillRect(X-(th>>1),Ys,th,Yg-Ys);if(Math.random()<.5)particles.push({x:f.x+rnd(-4,4),y:f.y+rnd(-4,4),vx:0,vy:20,t:.3,col:'#ffd060'});}}
   else{const t2=t-T0;
    // the pillar: full width, white-hot core, then gone, leaving a scorched ring that cools
    if(t2<D.pillar){const k2=t2/D.pillar,w=rr*(1-k2*.4);ctx.globalAlpha=1-k2;ctx.fillStyle='#ff9a30';ctx.fillRect(X-w,Ys-40,w*2,Yg-Ys+40);ctx.fillStyle='#fff0b0';ctx.fillRect(X-w*.55,Ys-40,w*1.1,Yg-Ys+40);ctx.fillStyle='#ffffff';ctx.fillRect(X-w*.2,Ys-40,w*.4,Yg-Ys+40);}
    const c=Math.max(0,1-t2/D.scorch);ctx.globalAlpha=.45*c;ctx.fillStyle='#1a0e08';ctx.beginPath();ctx.ellipse(X,Yg,rr,rr*.52,0,0,TAU);ctx.fill();ring(Yg,rr,.52,'#ff7a30',.8*c,30,0);}
   ctx.globalAlpha=1;}});}
 return r;};}
