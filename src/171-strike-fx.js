'use strict';
// SHINOBIDUNGEONS - straight-line strikes are drawn as what they are. Every line attack (a thrust, a slash, a chain, a
// beam, a cannon shot) used to draw the same thin line. Damage and hitboxes are unchanged; only the look:
//  SPEAR   (Yari Thrust, Spiral Lunge)  a shaft and gleaming spearhead shoot out to the tip, flash, and snap back
//  PHANTOM (Thousand Thrusts)           spectral spears stab out one after another, and a fan of phantom spears
//                                       hovers behind the lancer for the whole flurry
//  BLADE   (Iai Cleave, Dragon Cleave)  a thick, tapered cut of light that splits apart in the air, shedding sparks
//  CHAIN   (Kusarigama)                 chain links lash out with the sickle blade on the end, then snap back
//  BEAM    (Spirit Mirror)              a glowing beam that thins away, with a mirror flash where it starts
//  BLAST   (Siegebreaker)               a cannonball tearing down a trail of fire and smoke, shock rings along it
const STRIKE_STYLE={'IAI CLEAVE':'blade','DRAGON CLEAVE':'blade','KUSARIGAMA':'chain','SPIRIT MIRROR':'beam','YARI THRUST':'spear','SPIRAL LUNGE':'spear'};
// tag the lines each ability makes with its style
{const _cc=classCast;classCast=function(k){const n0=fx.length;const r=_cc.apply(this,arguments);try{const sp=P&&SPELLS[k][P.lo[k]],st=sp&&STRIKE_STYLE[sp.n];
 if(st)for(let i=n0;i<fx.length;i++)if(fx[i].k==='line'&&!fx[i].style){fx[i].style=st;fx[i].dur=Math.max(fx[i].dur,st==='blade'?.3:.22);fx[i].t=fx[i].dur;}}catch(_){}return r;};}
{const _fl=CZ.flurry;CZ.flurry=function(z){const n0=fx.length;const r=_fl.apply(this,arguments);for(let i=n0;i<fx.length;i++)if(fx[i].k==='line'&&!fx[i].style){fx[i].style='phantom';fx[i].dur=fx[i].t=.2;}return r;};}
if(CZ.siege){const _sg=CZ.siege;CZ.siege=function(z){const n0=fx.length;const r=_sg.apply(this,arguments);let first=true;
 for(let i=n0;i<fx.length;i++)if(fx[i].k==='line'&&!fx[i].style){fx[i].style=first&&false?'':'skip';}
 // one blast down the middle replaces the five lines
 const L=fx.slice(n0).filter(f=>f.k==='line');if(L.length){const m=L[Math.floor(L.length/2)];m.style='blast';m.dur=m.t=.42;}return r;};}
// ---- drawing
const stE=t=>t<0?0:t>1?1:1-(1-t)*(1-t);
function strikeEnds(f){const x1=f.x+Math.cos(f.a)*f.len,y1=f.y+Math.sin(f.a)*f.len,S={x:sx(f.x,f.y),y:sy(f.x,f.y)-7},E={x:sx(x1,y1),y:sy(x1,y1)-7};
 const dx=E.x-S.x,dy=E.y-S.y,L=Math.hypot(dx,dy)||1;return {S,E,ux:dx/L,uy:dy/L,L};}
const sp1=(x,y,c,w,h)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(x-(w||1)/2),Math.round(y-(h||1)/2),w||1,h||1);};
function sStar(x,y,r,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x-r),Math.round(y),r*2+1,1);ctx.fillRect(Math.round(x),Math.round(y-r),1,r*2+1);ctx.fillStyle='#fff';ctx.fillRect(Math.round(x)-1,Math.round(y)-1,3,3);}
function drawSpear(S,ux,uy,len,col,ghost){const nx=-uy,ny=ux,tx=S.x+ux*len,ty=S.y+uy*len,sh=ghost?'rgba(200,230,255,.7)':'#6a4428';
 // shaft
 ctx.strokeStyle=ghost?'rgba(120,180,255,.5)':'#14101a';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(S.x,S.y);ctx.lineTo(tx-ux*5,ty-uy*5);ctx.stroke();
 ctx.strokeStyle=sh;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(S.x,S.y);ctx.lineTo(tx-ux*5,ty-uy*5);ctx.stroke();
 // the spearhead: a leaf blade with a bright edge
 ctx.fillStyle=ghost?'rgba(220,240,255,.9)':'#14101a';ctx.beginPath();ctx.moveTo(tx+ux*3,ty+uy*3);ctx.lineTo(tx-ux*6+nx*3.5,ty-uy*6+ny*3.5);ctx.lineTo(tx-ux*8,ty-uy*8);ctx.lineTo(tx-ux*6-nx*3.5,ty-uy*6-ny*3.5);ctx.closePath();ctx.fill();
 ctx.fillStyle=ghost?'#ffffff':'#d8e0ec';ctx.beginPath();ctx.moveTo(tx+ux*2,ty+uy*2);ctx.lineTo(tx-ux*5+nx*2.2,ty-uy*5+ny*2.2);ctx.lineTo(tx-ux*7,ty-uy*7);ctx.lineTo(tx-ux*5-nx*2.2,ty-uy*5-ny*2.2);ctx.closePath();ctx.fill();
 if(!ghost){ctx.fillStyle=col||'#c8e0ff';ctx.fillRect(Math.round(tx-ux*8)-1,Math.round(ty-uy*8)-1,2,2);}ctx.lineWidth=1;}
{const _df=drawFx;drawFx=function(f){if(!(f&&f.k==='line'&&f.style))return _df.apply(this,arguments);if(f.style==='skip'||f.wait>0)return;
 const k=1-f.t/f.dur,{S,E,ux,uy,L}=strikeEnds(f),nx=-uy,ny=ux,col=f.col||'#fff';ctx.save();
 switch(f.style){
  case 'spear':{const ext=k<.35?stE(k/.35):k<.7?1:1-stE((k-.7)/.3)*.6;ctx.globalAlpha=k<.7?1:1-(k-.7)/.3*.8;
   for(let i=1;i<=3;i++){ctx.globalAlpha*=.9;ctx.strokeStyle='rgba(255,255,255,.35)';ctx.beginPath();const o=(i-2)*3;ctx.moveTo(S.x+nx*o+ux*L*ext*.3,S.y+ny*o+uy*L*ext*.3);ctx.lineTo(S.x+nx*o+ux*L*ext*.8,S.y+ny*o+uy*L*ext*.8);ctx.stroke();}
   // a spear of normal length whose tip drives out to the full reach
   const tip=Math.max(12,L*ext),SL=Math.min(tip,46),st={x:S.x+ux*(tip-SL),y:S.y+uy*(tip-SL)};ctx.globalAlpha=k<.7?1:1-(k-.7)/.3*.8;drawSpear(st,ux,uy,SL,col,false);if(k>.3&&k<.55)sStar(S.x+ux*L,S.y+uy*L,4,col);break;}
  case 'phantom':{const p=stE(k),len=Math.min(58,L*.55),start=L*.2+p*(L-len*.5);
   ctx.globalAlpha=(1-k)*.45;drawSpear({x:S.x+ux*(start-14)-ux*len,y:S.y+uy*(start-14)-uy*len},ux,uy,len,col,true);
   ctx.globalAlpha=1-k*.7;drawSpear({x:S.x+ux*start-ux*len,y:S.y+uy*start-uy*len},ux,uy,len,col,true);if(k>.5)sStar(S.x+ux*Math.min(L,start+4),S.y+uy*Math.min(L,start+4),3,'#c8e0ff');break;}
  case 'blade':{const ap=Math.min(1,k/.15),split=stE(Math.max(0,(k-.2)/.8))*5,al=1-Math.max(0,(k-.3)/.7);ctx.globalAlpha=al;
   for(const s of split?[-1,1]:[0]){ctx.beginPath();const n=14;for(let i=0;i<=n;i++){const t=i/n*ap,w=Math.sin(t*Math.PI)*4.5*(1-k*.5),x=S.x+ux*L*t+nx*(w+split*s),y=S.y+uy*L*t+ny*(w+split*s);i?ctx.lineTo(x,y):ctx.moveTo(x,y);}
    for(let i=n;i>=0;i--){const t=i/n*ap,w=Math.sin(t*Math.PI)*4.5*(1-k*.5),x=S.x+ux*L*t-nx*(w-split*s)+(s?nx*split*s*0:0),y=S.y+uy*L*t-ny*(w-split*s);ctx.lineTo(x,y);}ctx.closePath();
    ctx.fillStyle=col;ctx.fill();ctx.globalAlpha=al*.95;ctx.strokeStyle='#ffffff';ctx.stroke();ctx.globalAlpha=al;}
   ctx.strokeStyle='#ffffff';ctx.beginPath();ctx.moveTo(S.x,S.y);ctx.lineTo(S.x+ux*L*ap,S.y+uy*L*ap);ctx.stroke();
   if(Math.random()<.5){const t=Math.random()*ap;sp1(S.x+ux*L*t+nx*rnd(-6,6),S.y+uy*L*t+ny*rnd(-6,6),Math.random()<.5?'#fff':col,2,1);}break;}
  case 'chain':{const ext=k<.4?stE(k/.4):1-stE((k-.4)/.6),len=L*ext;for(let d=0,i=0;d<len-4;d+=4,i++){const x=S.x+ux*d,y=S.y+uy*d;ctx.fillStyle='#14101a';ctx.fillRect(Math.round(x)-2,Math.round(y)-2,4,4);ctx.fillStyle=i%2?'#a0a8b0':'#d0d6de';ctx.fillRect(Math.round(x)-1,Math.round(y)-(i%2?1:0),i%2?2:3,i%2?2:1);}
   const tx=S.x+ux*len,ty=S.y+uy*len,ang=Math.atan2(uy,ux);ctx.strokeStyle='#14101a';ctx.lineWidth=3;ctx.beginPath();ctx.arc(tx,ty,5,ang-1.6,ang+.9);ctx.stroke();ctx.strokeStyle='#e8eef6';ctx.lineWidth=1;ctx.beginPath();ctx.arc(tx,ty,5,ang-1.6,ang+.9);ctx.stroke();break;}
  case 'beam':{const w=Math.max(1,6*(1-k));ctx.globalAlpha=.45*(1-k);ctx.strokeStyle=col;ctx.lineWidth=w+4;ctx.beginPath();ctx.moveTo(S.x,S.y);ctx.lineTo(E.x,E.y);ctx.stroke();
   ctx.globalAlpha=1-k*.7;ctx.strokeStyle='#ffffff';ctx.lineWidth=Math.max(1,w*.5);ctx.beginPath();ctx.moveTo(S.x,S.y);ctx.lineTo(E.x,E.y);ctx.stroke();ctx.lineWidth=1;
   if(k<.4){ctx.globalAlpha=1-k/.4;sStar(S.x,S.y,5,col);}break;}
  case 'blast':{const p=stE(Math.min(1,k/.5)),hx=S.x+ux*L*p,hy=S.y+uy*L*p;
   for(let d=0;d<L*p;d+=3){const x=S.x+ux*d,y=S.y+uy*d,age=(L*p-d)/L,w=Math.max(1,7*(1-age)*(1-k*.6));ctx.globalAlpha=Math.max(0,.55-age*.5)*(1-k*.6);ctx.fillStyle=age<.25?'#ffb050':'#6a6070';ctx.fillRect(Math.round(x-w/2),Math.round(y-w/2),Math.ceil(w),Math.ceil(w));}
   for(let i=1;i<=4;i++){const d=L*i/5;if(d>L*p)break;const rr=4+(p*L-d)*.12;ctx.globalAlpha=Math.max(0,.6-(p*L-d)/L)*(1-k);ctx.strokeStyle='#ffd090';ctx.beginPath();ctx.ellipse(S.x+ux*d,S.y+uy*d,rr*.5,rr,Math.atan2(uy,ux),0,TAU);ctx.stroke();}
   if(k<.55){ctx.globalAlpha=1;ctx.fillStyle='#14101a';ctx.beginPath();ctx.arc(hx,hy,4,0,TAU);ctx.fill();ctx.fillStyle='#5a5466';ctx.fillRect(Math.round(hx)-2,Math.round(hy)-2,2,2);ctx.fillStyle='#ffb050';ctx.fillRect(Math.round(hx-ux*5)-1,Math.round(hy-uy*5)-1,3,3);}break;}}
 ctx.restore();};}
// the phantom spears waiting either side of the lancer through Thousand Thrusts
{const _dp=drawPortal;drawPortal=function(){_dp.apply(this,arguments);if(!P)return;const z=zones.find(q=>q.k==='flurry'&&q.t>0);if(!z)return;
 const a=P.aim,v=scrVec(Math.cos(a),Math.sin(a)),ua=Math.atan2(v[1],v[0]),ux=Math.cos(ua),uy=Math.sin(ua),X=sx(P.x,P.y),Y=sy(P.x,P.y)-10;
 // stacked in two columns, one either side of him, all pointing along the aim
 for(let i=0;i<6;i++){const sd=i<3?-1:1,j=i%3,bx=X+sd*16-ux*4,by=Y-8+j*6,len=24+Math.sin(time*20+i*1.7)*3;
  ctx.globalAlpha=.55+.25*Math.sin(time*16+i);drawSpear({x:bx-ux*6,y:by-uy*6},ux,uy,len,'#c8e0ff',true);}ctx.globalAlpha=1;};}
