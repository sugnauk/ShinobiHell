'use strict';
// SHINOBIDUNGEONS - four-frame walk cycles for the humanoid foes. Each sheet used to have two frames (stand, step);
// now it has four: stand, left foot forward, stand, right foot forward, with the body bobbing on each step.
// Frame 0 is still the standing pose and frame 1 a step, so anything that reads those keeps working.

// ---- the 22x28 template foes (92-foe-sprites.js) ----
foe2Sprite=function(type,p){const D=FOE2[type],BW=D.w||22,BH=D.h||28,FW=BW+8,FH=BH+5,N=4,sheet=mk(FW*N,FH,()=>{}),sg=sheet.getContext('2d');
 for(let f=0;f<N;f++){const ls=f===1?1:f===3?-1:0,fr=mk(FW,FH,g=>{g.translate(2,5);const C=k=>p[k]||k,R=(x,y,w,h,c)=>{g.fillStyle=C(c);g.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)));};
   const L=(x0,y0,x1,y1,c)=>{const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0))||1;for(let i=0;i<=n;i++)R(x0+(x1-x0)*i/n,y0+(y1-y0)*i/n,1,1,c);};
   const sh=(k,a)=>shade(C(k),a==null?-.3:a);D.draw({R,L,f:ls?1:0,b:ls?1:0,ls,p,C,sh,cx:Math.floor(BW/2)});});
  sg.drawImage(outlined(fr),f*FW,0);}
 return {c:sheet,wc:whiteOf(sheet),fw:FW,fh:FH,frames:N,sc:D.sc||1,ok:true,animal:true};};
// legs: ls 1 lifts the back (left) foot, ls -1 the other one
f2legs=function(A,o){const {R,sh,cx}=A,lg=o.leg||'d',ft=o.foot||'#2a2026',ls=A.ls!=null?A.ls:(A.f?1:0);
 const l=ls===1?1:0,r=ls===-1?1:0;
 R(cx-4,20,3,6-l,lg);R(cx+1,20,3,6-r,lg);R(cx-4,20,1,6-l,sh(lg));R(cx+1,20,1,5-r,sh(lg,-.15));
 R(cx-5-(r?1:0),26-l,4,2,ft);R(cx+1+(l?1:0),26-r,4,2,ft);R(cx-5-(r?1:0),26-l,4,1,shade(A.C(ft),.25));};

// ---- the original 18x24 foes (05-foe-sprites.js) ----
{const _fs=foeSprite;foeSprite=function(type,p){if(FOE2[type])return foe2Sprite(type,p);const D=FOESPR[type];if(!D)return _fs(type,p);
 const FW=18,FH=24,N=4,sheet=mk(FW*N,FH,()=>{}),sg=sheet.getContext('2d');
 for(let f=0;f<N;f++){const ls=f===1?1:f===3?-1:0,fr=mk(FW,FH,g=>{const C=k=>p[k]||k,R=(x,y,w,h,c)=>{g.fillStyle=C(c);g.fillRect(x,y,w,h);};
   const b=ls?1:0,U=(x,y,w,h,c)=>R(x,y+b,w,h,c);const ctx2={R,U,b,f:b,ls,p,C,sh:k=>shade(C(k),-.3),hi:k=>shade(C(k),.3)};
   if(D.body!==false)foeBody(ctx2,D);D.draw(ctx2);});
  sg.drawImage(outlined(fr),f*FW,0);}
 return {c:sheet,wc:whiteOf(sheet),fw:FW,fh:FH,frames:N,sc:FOESC[type]||1,ok:true,animal:true};};}
// the shared 18x24 body, with the stepping leg chosen by ls (1: left foot lifted, -1: right foot lifted)
foeBody=function({R,U,b,f,ls,sh,hi},o){if(ls==null)ls=f?1:0;
 const lg=o.leg||'d',ft=o.foot||'#2a2026',l=ls===1?1:0,r=ls===-1?1:0;
 if(!o.robe){R(6,19,2,4-l,lg);R(10,19,2,4-r,lg);R(5,22-l,3,2,ft);R(10,22-r,3,2,ft);R(6,19,1,3,sh(lg));}
 else{R(5,22-r,3,2,ft);R(10,22-l,3,2,ft);}
 const bw=o.bulk?10:8,bx=9-bw/2,top=12,bot=o.robe?21:18;
 for(let y=top;y<=bot;y++){const flare=o.robe&&y>17?Math.min(2,y-17):0;U(bx-flare,y,bw+flare*2,1,o.torso||'c');U(bx-flare,y,1,1,sh(o.torso||'c'));}
 if(o.belt!==false)U(bx,16,bw,1,o.belt||'a');
 if(o.arms!==false){const sw=ls===1?1:ls===-1?-1:0; // arms swing against the legs
  U(bx-2,13+sw,2,5,o.sleeve||o.torso||'c');U(bx-2,13+sw,1,5,sh(o.sleeve||o.torso||'c'));U(bx-2,18+sw,2,1,o.hand||'s');
  U(bx+bw,13-sw,2,4,o.sleeve||o.torso||'c');U(bx+bw,17-sw,2,1,o.hand||'s');}
 if(o.head!==false){U(6,6,6,6,o.face||'s');U(11,8,1,1,o.eye||'#14101a');U(9,8,1,1,o.eye2||o.eye||'#14101a');U(6,10,1,2,sh(o.face||'s'));U(10,10,2,1,o.mouth||sh(o.face||'s'));}};
