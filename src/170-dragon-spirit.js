'use strict';
// SHINOBIDUNGEONS - DRAGON SPIRIT (the onmyoji's ultimate) is a dragon. A spirit dragon's head - antlers, glowing eye,
// snapping jaws and trailing whiskers, shedding motes behind it - bursts from the onmyoji and swims along the aim line,
// weaving as it goes, right over the blasts it calls down, then fades away.
// It is drawn under the bullets, so it never hides a shot.
const DRAGONS=[];
const DRG={len:170,dur:1.05,segs:22,gap:6.5,col:'#6cf',lite:'#c8f4ff',dark:'#1e5a8a',ink:'#0c1a2a',gold:'#ffd060'};
{const _cs=castShow;castShow=function(k){const r=_cs.apply(this,arguments);try{if(k==='e'&&P&&SPELLS.e[P.lo.e]&&SPELLS.e[P.lo.e].n==='DRAGON SPIRIT'){
 let len=DRG.len;for(let s=10;s<=DRG.len;s+=4){const x=P.x+Math.cos(P.aim)*s,y=P.y+Math.sin(P.aim)*s;if(solid(x,y)){len=s;break;}}
 DRAGONS.push({x0:P.x,y0:P.y,a:P.aim,len:Math.max(60,len),t0:time});}}catch(_){}return r;};}
// a point on the dragon's path: d along the aim line, weaving side to side, flying above the ground
function drgAt(D,d,ph){const ca=Math.cos(D.a),sa=Math.sin(D.a),w=Math.sin(d*.07-ph)*7*Math.min(1,d/30);
 const x=D.x0+ca*d-sa*w,y=D.y0+sa*d+ca*w;return {x:sx(x,y),y:sy(x,y)-14-Math.sin(d*.05)*3,wx:x,wy:y};}
function drawDragon(D){const k=(time-D.t0)/DRG.dur;if(k>1.35)return false;
 const head=Math.min(1,k)*D.len,fade=k>1?1-(k-1)/.35:1,ph=time*9;ctx.globalAlpha=.9*fade;
 // head, facing along the path
 const h=drgAt(D,head,ph),hb=drgAt(D,Math.max(0,head-6),ph),fx=Math.sign(h.x-hb.x)||(Math.cos(D.a)>=0?1:-1),X=Math.round(h.x),Y=Math.round(h.y);
 const Z=2,R=(x,y,w,hh,c)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(fx>0?X+x*Z:X-(x+w)*Z),Math.round(Y+y*Z),Math.ceil(w*Z),Math.ceil(hh*Z));};
 const INK='#06080e',HIDE='#1a2c58',HIDE2='#2a4a8a',JAW='#122244',BONE='#ece4cc',BONE2='#b8a888',gape=1+Math.round((Math.sin(time*14)+1)*1.4);
 // a cold aura behind it
 ctx.save();ctx.globalAlpha*=.28;ctx.fillStyle='#4ab8ff';ctx.beginPath();ctx.ellipse(X+fx*6,Y-2,26,16,0,0,TAU);ctx.fill();ctx.restore();
 // the spiked mane
 for(const [x,y] of [[-10,-6],[-12,-3],[-11,0],[-9,3]]){R(x-1,y-1,4,4,INK);R(x,y,3,2,HIDE2);R(x-1,y,1,1,BONE);}
 // swept-back horns
 R(-3,-11,3,6,INK);R(-2,-10,2,5,BONE);R(-5,-13,3,3,INK);R(-4,-12,2,2,BONE);R(-7,-14,2,2,BONE2);
 R(1,-10,3,5,INK);R(2,-9,1,4,BONE);R(0,-12,2,3,BONE2);
 // the skull
 R(-7,-8,16,11,INK);R(-6,-7,14,9,HIDE);R(-6,-7,14,2,HIDE2);for(let x=-5;x<7;x+=3)R(x,-4,1,1,JAW);
 // the brow, slanting down over a glowing red eye
 R(0,-7,7,2,INK);R(1,-6,5,1,'#0c1428');
 ctx.save();ctx.globalAlpha*=.5;R(1,-6,5,4,'#ff2020');ctx.restore();R(2,-5,3,2,'#ff3030');R(3,-5,1,1,'#ffffff');
 // the upper jaw and snout, a flaring nostril
 R(8,-6,9,6,INK);R(8,-5,8,4,HIDE);R(8,-5,8,1,HIDE2);R(14,-5,1,1,'#ff5060');
 // the open mouth: a glowing throat, fangs above and below
 R(7,0,9,gape+1,'#3a0008');R(8,0,6,gape,'#ff3040');
 for(const x of [8,10,12,14])R(x,0,1,2,BONE);
 R(6,1+gape,10,4,INK);R(7,1+gape,8,2,JAW);for(const x of [9,11,13])R(x,gape,1,2,BONE);
 // cold fire breathing out of the jaws
 if(Math.random()<.3){const mx=h.wx+Math.cos(D.a)*10,my=h.wy+Math.sin(D.a)*10;particles.push({x:mx,y:my,vx:Math.cos(D.a)*rnd(40,80)+rnd(-10,10),vy:Math.sin(D.a)*rnd(40,80)+rnd(-10,10),t:.3,col:Math.random()<.5?'#6cf':'#e8f8ff'});}
 // whiskers flowing out from the jaws, red at the tips
 ctx.lineWidth=1;for(const s2 of [-1,1]){const sx0=X+fx*24,sy0=Y+(s2<0?-8:6);ctx.strokeStyle=DRG.lite;ctx.beginPath();ctx.moveTo(sx0,sy0);
  const ex=X+fx*(2+Math.sin(ph)*3),ey=Y+s2*24+Math.sin(ph+1)*3;ctx.quadraticCurveTo(X+fx*20,Y+s2*20,ex,ey);ctx.stroke();ctx.fillStyle='#ff4050';ctx.fillRect(Math.round(ex)-1,Math.round(ey)-1,2,2);}
 // a few motes shed from the body
 if(k<1&&Math.random()<.2)particles.push({x:h.wx,y:h.wy,vx:rnd(-12,12),vy:rnd(-20,-6),t:.45,col:Math.random()<.5?DRG.col:DRG.lite});
 ctx.globalAlpha=1;return true;}
// drawn after the sprites and before the bullets
{const _dp=drawPortal;drawPortal=function(){_dp.apply(this,arguments);for(let i=DRAGONS.length-1;i>=0;i--)if(!drawDragon(DRAGONS[i]))DRAGONS.splice(i,1);};}
{const _ld=loadDungeon;loadDungeon=function(){DRAGONS.length=0;return _ld.apply(this,arguments);};}
