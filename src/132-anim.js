'use strict';
// SHINOBIDUNGEONS - an animation layer over every sprite sheet (foes, guardians and the hero).
// Pixel-crisp variants of any frame are built on demand and cached: a SHEAR (the top leans while the feet stay planted)
// and a SQUASH/STRETCH (rows dropped or doubled). With those:
//  foes      walk only when they move (cadence follows their speed), stand still otherwise; lean back and tremble while
//            winding up, lunge into the strike, settle in recovery; recoil when they fire; squash when hit; rise out of
//            the ground when they spawn; and topple over and fade when they die.
//  guardians bob and kick up dust as they stride, and squash when hit.
//  the hero  leans into a run, kicks up dust on each step, stretches through a dash, lands with a squash and recoils
//            when hurt.

// ---------- variants ----------
const AV_PAD=6;
function animVariant(s,white,frame,shear,rows){
 const fr=s.frames>1?(frame%s.frames):0,key=(white?'w':'c')+fr+'|'+shear+'|'+rows;s._av=s._av||{};if(s._av[key])return s._av[key];
 const src=white?s.wc:s.c,fw=s.fw,fh=s.fh,oh=Math.max(4,fh-rows),out=mk(fw+AV_PAD*2,oh,()=>{}),g=out.getContext('2d');
 // map each output row to a source row: squash drops rows from the body (never the feet), stretch repeats them
 for(let y=0;y<oh;y++){const sy0=rows>=0?Math.min(fh-1,Math.floor(y*fh/oh)):Math.min(fh-1,Math.floor(y*fh/oh));
  const k=1-y/(oh-1),off=Math.round(shear*k*k*.6+shear*k*.4); // the top leans the most, the feet stay put
  g.drawImage(src,fr*fw,sy0,fw,1,AV_PAD+off,y,fw,1);}
 return s._av[key]={c:out,w:fw+AV_PAD*2,h:oh};}
// the drawing hook: while a foe, a guardian or the hero is being drawn, CUR says how to pose its sprite
let CUR=null;
{const _ds=drawSpr;drawSpr=function(s,x,feetY,white,frame,flip){const C=CUR;
 if(!C||!s||!s.c||(C.s&&C.s!==s))return _ds.apply(this,arguments);
 const fr=C.frame!=null?C.frame:frame,shear=C.shear|0,rows=C.rows|0,yo=C.yo|0;
 if(!shear&&!rows&&!C.rise){return _ds.call(this,s,x,feetY+yo,white,fr,flip);}
 const v=animVariant(s,white,fr,shear,rows),sc=s.sc||1,w=v.w*sc,h=v.h*sc,dx=Math.round(x-w/2),dy=Math.round(feetY+yo-h);
 if(C.rise!=null){ctx.save();ctx.beginPath();ctx.rect(dx-4,dy-40,w+8,Math.round(feetY+yo)-(dy-40));ctx.clip();}
 const ry=C.rise!=null?Math.round((1-C.rise)*h):0;
 if(flip){ctx.save();ctx.translate(dx+w,dy+ry);ctx.scale(-1,1);ctx.drawImage(v.c,0,0,v.w,v.h,0,0,w,h);ctx.restore();}
 else ctx.drawImage(v.c,0,0,v.w,v.h,dx,dy+ry,w,h);
 if(C.rise!=null)ctx.restore();};}

// ---------- foes and guardians ----------
const dust=(x,y,n,col)=>{for(let i=0;i<n;i++)particles.push({x:x+rnd(-4,4),y:y+rnd(-2,2),vx:rnd(-18,18),vy:rnd(-14,4),t:rnd(.25,.45),col:col||'#9a8e86'});};
{const _mk=mkEnemy;mkEnemy=function(){const e=_mk.apply(this,arguments);if(e){e._born=time;e._wf=0;}return e;};}
{const _es=enemyShoot;enemyShoot=function(e){if(e)e._shotT=time;return _es.apply(this,arguments);};}
{const _de=drawEnemy;drawEnemy=function(e){
 if(e.ghost||e.prop||(e.boss&&e.air&&e.z>60))return _de.apply(this,arguments);
 // how fast it is really moving (smoothed), and whether it just took a hit
 const dt=Math.min(.1,Math.max(0,time-(e._lt??time)));e._lt=time;
 if(e._lx!=null&&dt>0){const v=Math.hypot(e.x-e._lx,e.y-e._ly)/dt;e._spd=(e._spd||0)*.75+Math.min(200,v)*.25;}e._lx=e.x;e._ly=e.y;
 if(e._lhp!=null&&e.hp<e._lhp-.01)e._hitT=time;e._lhp=e.hp;
 const s=sprOf(e),moving=(e._spd||0)>5&&!(e.st&&e.st.frozen>0)&&!(e.stag>0),C={s};
 const big=s.fh*(s.sc||1)>40;
 if(e.boss){
  // guardians keep their own poses; they get a stride bob with dust, and a hit squash
  if(moving&&!e.storm){e._wf=(e._wf||0)+dt*(2+e._spd*.04);const st=Math.floor(e._wf*2);C.yo=st%2?-1:0;if(st!==e._ls){e._ls=st;if(st%2===0)dust(e.x,e.y+3,3);}}
  if(time-(e._hitT||-9)<.08)C.rows=big?3:1;
 }else{
  // the walk cycle runs only while moving
  if(moving){e._wf=(e._wf||0)+dt*(3+e._spd*.09);C.frame=Math.floor(e._wf);const st=C.frame;if(st!==e._ls){e._ls=st;if(st%2===0&&Math.random()<.5)dust(e.x,e.y+2,1);}}
  else{C.frame=0;C.yo=Math.sin(time*2.6+(e.wob||0)*3)>.7?-1:0;}// standing: a slow breath
  const a=e.act;
  if(a){const w=a.w||.5;
   if(a.ph===0){const p=Math.min(1,a.t/w);C.shear=-Math.round(Math.min(1,p*1.6)*(big?3:2));if(p>.72)C.yo=(C.yo|0)+(Math.floor(time*30)%2?0:-1);C.frame=0;} // wind up: lean back, tremble
   else if(a.ph===1){C.shear=a.t<.1?(big?4:3):2;C.frame=1;}                                                                 // strike: lunge in
   else C.shear=1;}                                                                                                            // recover
  if(time-(e._shotT||-9)<.1)C.shear=-2;                                                                                         // recoil from a shot
  if(time-(e._hitT||-9)<.09){C.rows=2;C.shear=0;}                                                                               // flinch
  if(e._born!=null&&time-e._born<.35&&e.awake){C.rise=clamp((time-e._born)/.35,0,1);if(!e._rd){e._rd=1;dust(e.x,e.y,6,'#6a5e58');}}
 }
 CUR=C;try{_de.apply(this,arguments);}finally{CUR=null;}
 // a muzzle flash at the front as it fires
 if(!e.boss&&time-(e._shotT||-9)<.06){const a=angTo(e,P),fx2=e.x+Math.cos(a)*(e.r+3),fy2=e.y+Math.sin(a)*(e.r+3),X=sx(fx2,fy2),Y=sy(fx2,fy2)-Math.round(s.fh*(s.sc||1)*.45);ctx.fillStyle='#fff6c0';ctx.fillRect(X-1,Y-1,3,3);ctx.fillStyle='#ffb040';ctx.fillRect(X-2,Y,1,1);ctx.fillRect(X+2,Y,1,1);ctx.fillRect(X,Y-2,1,1);ctx.fillRect(X,Y+2,1,1);}};}

// ---------- deaths: the body flashes, topples away from you and fades into the ground ----------
const CORPSES=[];
{const _ke=killE;killE=function(e){const was=e&&!e.dead&&!e.prop&&!e.boss&&!(R&&R.training&&e.type==='dummy');let snap=null;
 if(was){try{const s=sprOf(e);if(s&&s.c&&s.fw)snap={s,x:e.x,y:e.y,z:e.z||0,flip:(!!s.animal)&&sx(P.x,P.y)<sx(e.x,e.y),away:sx(P.x,P.y)<sx(e.x,e.y)?1:-1,t:time,fr:e._ls||0};}catch(_){}}
 const r=_ke.apply(this,arguments);if(snap&&e.dead){CORPSES.push(snap);if(CORPSES.length>40)CORPSES.shift();}return r;};}
function drawCorpses(){for(let i=CORPSES.length-1;i>=0;i--){const c=CORPSES[i],k=(time-c.t)/.55;if(k>=1||k<0){CORPSES.splice(i,1);continue;}
 const s=c.s,X=sx(c.x,c.y),Y=sy(c.x,c.y)+Math.min(6,Math.round(s.fh*.25))+2-c.z;
 // the topple leans away from you; flip turns the lean around, so lean against the facing
 const lean=Math.round(Math.min(1,k*2.2)*Math.min(10,s.fw*.5))*(c.flip?1:-1)*(c.away>0?-1:1)*-1,rows=Math.round(Math.min(.55,k*1.1)*s.fh);
 ctx.globalAlpha=k<.5?1:1-(k-.5)*2;CUR={s,frame:c.fr,shear:lean,rows};try{drawSpr(s,X,Y+Math.round(k*3),k<.08,c.fr,c.flip);}finally{CUR=null;}ctx.globalAlpha=1;
 if(k<.05)dust(c.x,c.y,4,'#8a7e76');}}
{const _dp=drawPortal;drawPortal=function(){drawCorpses();return _dp.apply(this,arguments);};}

// ---------- the hero ----------
{const _dp=drawPlayer;let lhp=null,hurtAt=-9,wasDash=false,landAt=-9,lastStep=-1;drawPlayer=function(){const p=P;if(!p||p.dying>0)return _dp.apply(this,arguments);
 if(lhp!=null&&p.hp<lhp-.01)hurtAt=time;lhp=p.hp;
 const dashing=p.dash>0;if(wasDash&&!dashing)landAt=time;wasDash=dashing;
 const C={};
 if(dashing)C.shear=3;                                             // stretch forward through the dash
 else if(time-landAt<.09)C.rows=2;                                 // land with a squash
 else if(p.mv&&!(p.animT>0))C.shear=1;                             // lean into the run
 if(time-hurtAt<.12){C.shear=-3;C.rows=1;}                          // knocked back
 if(p.mv&&!dashing){const st=Math.floor(time*10);if(st!==lastStep&&st%2===0){lastStep=st;dust(p.x-(p.dx||0)*3,p.y+2,1,'#8a807a');}}
 if(!C.shear&&!C.rows)return _dp.apply(this,arguments);
 CUR=C;try{_dp.apply(this,arguments);}finally{CUR=null;}};}
