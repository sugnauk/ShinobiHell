'use strict';
// SHINOBIDUNGEONS - coming back from the dead. A revive still happens on its own, but it is now an event: the world
// freezes for a moment and darkens, your hero falls, their spirit rises out of the body, a pillar of golden light comes
// down and draws it back, and they rise to their feet with a burst of light and a REVIVED banner - then the world
// moves again (with the revive's usual push-back and cleared bullets).
const REV_DUR=1.7;let REV=null;const revNow=()=>performance.now()/1000;
{const _die=die;die=function(){if(REV){if(P)P.hp=Math.max(P.hp,1);return;} // already coming back: nothing else happens
 if(P&&!(P.dying>0)&&P.rez>0&&!(R&&R.training)){
  REV={t0:revNow(),x:P.x,y:P.y,face:P.face||1,go:_die};P.hp=Math.max(P.hp,1);P.iv=Math.max(P.iv||0,REV_DUR+.5);
  if(typeof TIPHOLD!=='undefined')TIPHOLD=null;tone(110,.6,'sine',.08,-40);return;}
 return _die.apply(this,arguments);};}
// the world stands still through it; when it ends the revive itself happens
{const _u=update;update=function(dt){if(REV&&mode==='play'){const k=revNow()-REV.t0;
  if(k>=REV_DUR){const go=REV.go;REV=null;P.hp=0;go();sfx('heal');shake=Math.max(shake,8);return _u.apply(this,arguments);}
  if(k>1.15&&!REV.rose){REV.rose=1;sfx('rare');}return;}
 return _u.apply(this,arguments);};}
{const _ok=onKey;onKey=function(c){if(REV&&mode==='play'&&c!=='Escape')return;return _ok.apply(this,arguments);};}
// the hero is drawn by the sequence while it runs
{const _dp=drawPlayer;drawPlayer=function(){if(REV)return;return _dp.apply(this,arguments);};}
{const _rp=renderPlay;renderPlay=function(){_rp.apply(this,arguments);if(!REV||mode!=='play')return;
 const k=revNow()-REV.t0,X=Math.round(sx(REV.x,REV.y)),Y=Math.round(sy(REV.x,REV.y))+3,s=heroSpr(CLS().k,P.evo||0,false),flip=REV.face<0,h=s.fh*(s.sc||1),cl=x=>Math.max(0,Math.min(1,x));
 // the world darkens
 ctx.fillStyle='#06040c';ctx.globalAlpha=.55*cl(k/.3)*(k>1.4?cl((REV_DUR-k)/.3):1);fillVisibleView();ctx.globalAlpha=1;
 ctx.save();scaleSceneLayer();
 // the body: falls, lies still, then rises
 const fall=k<.35?cl(k/.35):k<1.2?1:1-cl((k-1.2)/.35),ang=fall*Math.PI/2*(flip?-1:1);
 shadow(X,Y-2,7);ctx.save();ctx.translate(X,Y);ctx.rotate(ang);ctx.globalAlpha=k<1.2?.75:1;drawSpr(s,0,0,false,WIZ.idle[0],flip);ctx.restore();ctx.globalAlpha=1;
 // the spirit rises out of it, hangs, and is drawn back down by the light
 if(k>.35&&k<1.35){const up=k<.8?cl((k-.35)/.45):k<1.05?1:1-cl((k-1.05)/.3),a=(k<.5?cl((k-.35)/.15):1)*(k>1.25?cl((1.35-k)/.1):1);
  ctx.globalAlpha=.55*a;drawSpr(s,X+Math.round(Math.sin(k*6)*1.5),Y-Math.round(up*20)-Math.round(h*.15),true,WIZ.idle[Math.floor(k*4)%2],flip);ctx.globalAlpha=1;
  if(Math.random()<.5)particles.push({x:REV.x+rnd(-6,6),y:REV.y+rnd(-4,4),vx:rnd(-4,4),vy:-rnd(14,24),t:.6,col:Math.random()<.5?'#c8d8ff':'#ffffff'});}
 // the pillar of golden light comes down onto the body
 if(k>.8){const d=cl((k-.8)/.25),fade=k>1.35?cl((REV_DUR-k)/.35):1,top=Math.round(-10),bot=Math.round(Y),len=Math.round((bot-top)*d);
  ctx.globalAlpha=.35*fade;ctx.fillStyle='#ffd040';ctx.fillRect(X-8,top,17,len);ctx.globalAlpha=.6*fade;ctx.fillStyle='#fff6c0';ctx.fillRect(X-3,top,7,len);ctx.globalAlpha=.9*fade;ctx.fillStyle='#ffffff';ctx.fillRect(X-1,top,3,len);ctx.globalAlpha=1;
  if(d>=1){ctx.strokeStyle='#ffd040';ctx.globalAlpha=.7*fade;ctx.beginPath();ctx.ellipse(X,Y-1,10+Math.sin(k*20)*2,4,0,0,TAU);ctx.stroke();ctx.globalAlpha=1;}}
 // risen: a burst of light and the banner
 if(k>1.2){const r=cl((k-1.2)/.4);ctx.strokeStyle='#ffffff';ctx.globalAlpha=1-r;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(X,Y-h/2,8+r*60,(8+r*60)*.6,0,0,TAU);ctx.stroke();ctx.lineWidth=1;ctx.globalAlpha=1;}
 ctx.restore();
 if(k>1.2){
  const s2='REVIVED',sc=2,a=cl((k-1.2)/.15);ctx.globalAlpha=a;txt(s2,Math.round(W/2-txtW(s2,sc)/2),Math.round(H*.3),'#ffd040',sc);const n=P.rez-1,s3=n>0?n+' REVIVE'+(n>1?'S':'')+' LEFT':'NO REVIVES LEFT';txt(s3,Math.round(W/2-txtW(s3)/2),Math.round(H*.3)+16,n>0?'#fff6c0':'#ff8080');ctx.globalAlpha=1;}};}
{const _ld=loadDungeon;loadDungeon=function(){REV=null;return _ld.apply(this,arguments);};}
