'use strict';
// SHINOBIDUNGEONS - more frames for the human guardians. Each had three (two breathing frames and one attack); now they
// also stride when they walk, wind up before an attack, follow through after it, raise their hands to cast and through a
// phase change, and flinch when hurt. The new poses are built from each guardian's own arm positions, so their weapons
// (fan, staff, gun, scepter...) move with their hands.

// legs: a stride offset for every guardian drawn with the shared leg (feet apart, the back heel lifted)
{const _H=HUM;HUM=function(p,Q){const K=_H(p,Q);if(Q&&Q.stride){const lg=K.leg,s0=Q.stride;K.leg=function(hx,hy,kx,ky,fx,fy,...r){const side=hx<36?-1:1,s=s0*side;return lg.call(this,hx,hy,kx+s*2,ky-(s>0?1:0),fx+s*4,fy-(s>0?2:0),...r);};}return K;};}

// each guardian's resting arms: [shoulder, elbow, hand] for the far (left) and near (right) arm
const GARMS={
 'ITOHIME, THE WIRE WEAVER':[[[28,29],[25,38],[32,42]],[[44,29],[47,38],[40,42]]],
 'LADY HOTARU':[[[29,28],[24,38],[22,44]],[[43,28],[48,38],[47,46]]],
 'TAMAMO, THE ILLUSIONIST':[[[29,28],[25,37],[29,44]],[[43,28],[48,37],[44,44]]],
 'TETSUO THE GUNSMITH':[[[27,29],[23,39],[25,49]],[[45,29],[50,37],[46,40]]],
 'THE THOUSAND-BELL ABBOT':[[[26,27],[21,38],[22,48]],[[46,27],[52,36],[56,40]]],
 'ONIKUMA, THE JAILER':[[[20,28],[16,40],[19,50]],[[52,28],[57,38],[54,46]]],
 'KAGE, THE SHINOBI MASTER':[[[29,27],[25,37],[28,44]],[[43,27],[48,36],[45,44]]]};
const P2=(a,dx,dy)=>[a[0]+dx,a[1]+dy];
function guardianPoses(name){const D=BART[name];if(!D||!D.posed||D.posed.pick||Object.keys(D.posed.anim||{}).length)return;
 const PS=D.posed,P=PS.poses,A=GARMS[name],atk=P.atk||{};
 const add=(k,q)=>{if(!P[k])P[k]=q;};
 // walking: two stride frames with a bob (arms swing a little, opposite to the legs)
 if(A){const [f,n]=A;
  add('walk1',{stride:1,b:0,far:[f[0],P2(f[1],2,0),P2(f[2],3,-1)],near:[n[0],P2(n[1],-2,0),P2(n[2],-3,1)]});
  add('walk2',{stride:-1,b:1,far:[f[0],P2(f[1],-2,0),P2(f[2],-3,1)],near:[n[0],P2(n[1],2,0),P2(n[2],3,-1)]});
  // wind-up: the weapon arm drawn back and up, the body sinking
  add('wind',Object.assign({},atk,{b:1,near:[n[0],P2(n[0],-6,-4),P2(n[0],-11,-12)],far:[f[0],P2(f[1],4,-2),P2(f[2],7,-4)]}));
  // follow-through: the weapon arm swept down across the body
  add('follow',Object.assign({},atk,{b:1,near:[n[0],P2(n[0],8,8),P2(n[0],16,18)],far:[f[0],P2(f[1],-3,2),P2(f[2],-5,3)]}));
  // casting / roaring: both hands raised high
  add('cast',Object.assign({},atk,{b:0,far:[f[0],P2(f[0],-7,-6),P2(f[0],-9,-16)],near:[n[0],P2(n[0],7,-6),P2(n[0],9,-16)]}));
  // flinch: thrown back, arms flung out
  add('hurt',{dx:-2,b:1,far:[f[0],P2(f[0],-8,4),P2(f[0],-14,8)],near:[n[0],P2(n[0],8,4),P2(n[0],14,8)]});}
 else{add('walk1',{b:0,dx:1});add('walk2',{b:1,dx:-1});add('wind',Object.assign({},atk,{b:1,dx:-1}));add('follow',Object.assign({},atk,{dx:1}));add('cast',Object.assign({},atk,{b:0}));add('hurt',{dx:-2,b:1});}
 PS.roar='cast';
 PS.pick=(e,idx)=>{const has=k=>idx[k]!=null;
  if(e.phx)return has('cast')?idx.cast:null;
  const a=e.A;
  if(!a&&time-(e._hitT||-9)<.12&&has('hurt'))return idx.hurt;
  if(a){const t=(a.t||0)*(e.spdK||1);if((e.tele>0||t<.28)&&has('wind'))return idx.wind;if(t<.55)return 2;
   if(has('follow'))return Math.floor((t-.55)/.3)%2?2:idx.follow;return 2;}
  if((e.storm>0||e.EV)&&has('cast'))return Math.floor(time*3)%3?idx.cast:2;
  if((e._spd||0)>8&&has('walk1'))return Math.floor((e._wf||0)*2)%2?idx.walk1:idx.walk2;
  return null;};}
for(const n of Object.keys(GARMS).concat(['THE CORRUPT EMPEROR']))try{guardianPoses(n);}catch(err){console.warn('poses',n,err);}
// the Emperor's scepter rises with his hands as he casts
try{const P=BART['THE CORRUPT EMPEROR'].posed.poses;P.cast=Object.assign({},P.atk,{shaku:[[46,30],[52,4]]});P.wind=Object.assign({},P.atk,{b:1,shaku:[[44,38],[34,20]]});P.follow=Object.assign({},P.atk,{shaku:[[46,40],[62,44]]});}catch(_){}
// Lord Kurogane's horse gallops whenever it moves, not only while he attacks
try{const PS=BART['LORD KUROGANE'].posed;if(!PS.pick)PS.pick=(e,idx)=>{if(e.phx||e.A||e.storm>0)return null;if((e._spd||0)>10)return Math.floor((e._wf||0)*3)%2?2:1;return null;};}catch(_){}
// only the attack frame itself fires: no muzzle flash on the wind-up, follow-through, cast or hurt frames
for(const n of Object.keys(GARMS)){try{const P=BART[n].posed.poses;for(const k of ['wind','follow','cast','hurt','walk1','walk2'])if(P[k])delete P[k].flash;}catch(_){}}
// Tetsuo: wind-up = shouldering the gun to aim, follow-through = the recoil kicking the barrel up
try{const P=BART['TETSUO THE GUNSMITH'].posed.poses;
 P.wind={b:1,far:[[27,29],[29,37],[32,40]],near:[[45,29],[47,36],[50,36]]};
 P.follow={dx:-1,far:[[27,29],[28,35],[32,35]],near:[[45,29],[47,32],[51,28]]};
 P.cast={far:[[27,29],[28,36],[30,39]],near:[[45,29],[48,33],[52,30]],flash:1};}catch(_){}
