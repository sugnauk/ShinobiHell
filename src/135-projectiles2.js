'use strict';
// SHINOBIDUNGEONS - more projectile sprites, handed out to the foes that shoot. Every one is solid and outlined so it
// reads against any floor. Each is drawn facing its flight direction (ux,uy) on screen; q.col tints where it makes sense.
{const O='#14101a';
 const P=(x,y,c,w,h)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),w||1,h||1);};
 // a rotated rectangle of pixels: along the flight axis from a0 to a1, across from b0 to b1
 const band=(X,Y,ux,uy,a0,a1,b0,b1,c)=>{const px=-uy,py=ux;for(let a=a0;a<=a1;a++)for(let b=b0;b<=b1;b++)P(X+ux*a+px*b,Y+uy*a+py*b,c);};
 const ball=(X,Y,r,c,hl)=>{disc(X,Y,r+1,O);disc(X,Y,r,c);if(hl)P(X-Math.round(r/2),Y-Math.round(r/2),hl);};
 Object.assign(PSPR,{
  // a comma-shaped jewel that spins
  magatama:(X,Y,ux,uy,q)=>{const a=time*10+(q.x||0),cx=Math.cos(a),cy=Math.sin(a);ball(X,Y,3,q.col||'#c8f','#fff');for(let i=1;i<=3;i++){const t=a+i*.7;P(X+Math.cos(t)*(3+i*.6)-1,Y+Math.sin(t)*(2+i*.6)-1,O,2,2);P(X+Math.cos(t)*(3+i*.6),Y+Math.sin(t)*(3+i*.6),q.col||'#c8f');}},
  // a paper talisman with a red seal
  ofuda:(X,Y,ux,uy,q)=>{band(X,Y,ux,uy,-4,4,-2,2,O);band(X,Y,ux,uy,-3,3,-1,1,'#f4ecd0');band(X,Y,ux,uy,-1,1,0,0,'#d02030');band(X,Y,ux,uy,-3,-3,-1,1,q.col||'#fd4');},
  // a lead musket ball trailing smoke
  musket:(X,Y,ux,uy,q)=>{for(let i=3;i>=1;i--){ctx.globalAlpha=.5-i*.12;disc(X-ux*i*3,Y-uy*i*3,1+(i>1?1:0),'#c8c0c0');}ctx.globalAlpha=1;ball(X,Y,2,'#8a8a98','#fff');},
  // a thrown blade-wave
  slashwave:(X,Y,ux,uy,q)=>{const px=-uy,py=ux;for(let i=-4;i<=4;i++){const bend=(1-(i/4)**2)*3,x=X+px*i+ux*bend,y=Y+py*i+uy*bend;P(x-1,y-1,O,3,3);}for(let i=-4;i<=4;i++){const bend=(1-(i/4)**2)*3;P(X+px*i+ux*bend,Y+py*i+uy*bend,Math.abs(i)<3?'#fff':(q.col||'#f66'));}},
  // a thrown stone
  stone:(X,Y,ux,uy,q)=>{P(X-2,Y-2,O,5,5);P(X-1,Y-3,O,3,1);P(X-1,Y-1,'#8a8478',3,3);P(X-1,Y-2,'#a8a294',2,1);P(X+1,Y,'#5a5448',1,1);},
  // a round bomb with a lit fuse
  bomb:(X,Y,ux,uy,q)=>{ball(X,Y,3,'#2a2830','#6a6878');P(X+1,Y-5,'#8a6a40',1,2);const f=Math.floor(time*20)%2;P(X+1-f,Y-6-f,f?'#fff':'#ffd040',1+f,1+f);if(Math.random()<.3)particles.push({x:q.x,y:q.y,vx:rnd(-10,10),vy:-20,t:.2,col:'#ffb040'});},
  // a blob of slime with a drip
  slime:(X,Y,ux,uy,q)=>{const c=q.col||'#8f4';ball(X,Y,3,c,'#efffd0');P(X-ux*5-1,Y-uy*5-1,O,3,3);P(X-ux*5,Y-uy*5,c);},
  // a ghost flame with a skull face
  skullfire:(X,Y,ux,uy,q)=>{const c=q.col||'#cff';for(let i=4;i>=1;i--){const w=Math.floor(Math.sin(time*20+i)*1);P(X-ux*i*2+w-1,Y-uy*i*2-1,i>2?shade(c,-.4):c,3-(i>2?1:0),3-(i>2?1:0));}P(X-3,Y-3,O,7,7);P(X-2,Y-2,'#f0f8ff',5,4);P(X-1,Y+2,'#f0f8ff',3,1);P(X-1,Y-1,O,1,2);P(X+1,Y-1,O,1,2);},
  // a drop of blood or acid
  droplet:(X,Y,ux,uy,q)=>{const c=q.col||'#f24';ball(X,Y,2,c,'#fff');band(X,Y,ux,uy,-5,-3,0,0,O);band(X,Y,ux,uy,-4,-3,0,0,c);},
  // a fireball with a flickering tail
  fireball:(X,Y,ux,uy,q)=>{for(let i=4;i>=1;i--){const j=Math.floor(Math.sin(time*25+i*2));P(X-ux*i*2+j,Y-uy*i*2,i>2?'#a02010':'#ff8a30',2,2);}ball(X,Y,3,'#ff8a30');disc(X,Y,2,'#ffd040');P(X,Y,'#fff');},
  // an ice fang: a long diamond
  icefang:(X,Y,ux,uy,q)=>{const c=q.col||'#9cf';for(let a=-4;a<=4;a++){const w=a>=0?Math.round((4-a)/2):Math.round((4+a)/3);band(X,Y,ux,uy,a,a,-w-1,w+1,O);}for(let a=-3;a<=3;a++){const w=a>=0?Math.round((4-a)/2.4):Math.round((4+a)/3.4);band(X,Y,ux,uy,a,a,-w,w,a>1?'#fff':c);}},
  // a feather: a shaft with vanes
  feather:(X,Y,ux,uy,q)=>{const c=q.col||'#e8eef6';band(X,Y,ux,uy,-4,4,-2,2,O);band(X,Y,ux,uy,-3,3,-1,1,c);band(X,Y,ux,uy,-3,4,0,0,shade(c,-.45));P(X+ux*4,Y+uy*4,'#fff');},
  // sound rings
  sonic:(X,Y,ux,uy,q)=>{const c=q.col||'#d080ff',px=-uy,py=ux;for(const [o,r] of [[0,4],[-3,3]])for(let i=-r;i<=r;i++){const bend=(1-(i/r)**2)*2,x=X+ux*(o+bend)+px*i,y=Y+uy*(o+bend)+py*i;P(x-1,y-1,O,3,3);}
   for(const [o,r] of [[0,4],[-3,3]])for(let i=-r;i<=r;i++){const bend=(1-(i/r)**2)*2;P(X+ux*(o+bend)+px*i,Y+uy*(o+bend)+py*i,o?c:'#fff');}},
  // a striped stinger dart
  stinger:(X,Y,ux,uy,q)=>{band(X,Y,ux,uy,-4,3,-2,2,O);for(let a=-3;a<=2;a++)band(X,Y,ux,uy,a,a,-1,1,a%2?'#2a2018':(q.col||'#ffd040'));band(X,Y,ux,uy,3,4,0,0,'#fff');},
  // a bubble
  bubble:(X,Y,ux,uy,q)=>{disc(X,Y,4,O);disc(X,Y,3,q.col||'#80c0ff');disc(X,Y,2,shade(q.col||'#80c0ff',.45));P(X-2,Y-2,'#fff',2,1);P(X-2,Y-1,'#fff');}});}

// who throws what: shots with a plain (or purely motion) style get the foe's own sprite; mines, splitters, boomerangs,
// big orbs and lances keep their behaviour-specific look so you can still read what they will do
const FOESHOT={archer:'arrow',ashigaru:'arrow',monk:'magatama',shaman:'ofuda',priest:'ofuda',sniper:'musket',ninja:'kunai',samurai:'slashwave',shielder:'stone',
 bomber:'bomb',frog:'slime',toad:'slime',wraith:'skullfire',blood:'droplet',salamander:'fireball',imp:'fireball',monkey:'stone',wolf:'icefang',guardian:'icefang',
 crane:'feather',raven:'feather',owl:'feather',bat:'sonic',hornet:'stinger',viper:'venom',centipede:'venom',kitsune:'wisp',crab:'bubble',beetle:'droplet',stag:'stone',
 assassin:'kunai',bandit:'kunai'};
const KEEPST=new Set(['mine','split','boom','big','lance','orbit','seek']);
{const _es=enemyShoot;enemyShoot=function(e,a,ang){if(e&&!e.boss&&a&&!a.spr&&!KEEPST.has(a.st)){const s=FOESHOT[e.type];if(s&&PSPR[s])a=Object.assign({},a,{spr:s});}return _es.call(this,e,a,ang);};}
