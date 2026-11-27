'use strict';
// Cut-glass cores, shaded edges and a readable silhouette at 2× scene resolution.
const SHOT_FORMS={
 arrow:'arrow',bigarrow:'arrow',spear:'spear',yaribolt:'spear',lance:'spear',needle:'needle',silk:'needle',
 kunai:'knife',blade:'knife',bone:'bone',chainlink:'ring',shackle:'ring',note:'note',
 shuri:'star',shuriken:'star',bstar:'star',petal:'petal',feather:'feather',crane:'crane',fox:'fox',
 charm:'paper',talisman:'paper',drum:'drum',bomb:'mine',ember:'flame',venom:'venom',
 cutter:'crescent',sickle:'crescent',naginata:'crescent',petalfan:'fan',hook:'hook',palm:'palm',
 rider:'arrow',bcomet:'comet',bgrain:'grain',bead:'orb',borb:'orb',orb:'orb',ball:'orb',void:'orb',wisp:'flame',
 bshard:'gem',mirrorbolt:'gem',scale:'gem',pellet:'grain',slug:'comet',salt:'gem',ink:'grain',
 magatama:'gem',ofuda:'paper',musket:'comet',slashwave:'crescent',stone:'gem',slime:'venom',skullfire:'flame',
 droplet:'comet',fireball:'flame',icefang:'knife',sonic:'ring',stinger:'needle',bubble:'ring'
};
const SHOT_STYLES={accel:'grain',curve:'grain',wave:'gem',boom:'star',split:'split',mine:'mine',
 star:'star',big:'orb',lance:'needle',seek:'comet',bounce:'ring',orbit:'orb',zig:'gem'};
const SHOT_STATIC=new Set(['orb','gem','ring','split','mine','drum','flame','venom','paper','note']);
const SHOT_ART=new Map();
function shotSprite(form,c,r,bearing,beat){
 const key=[form,c,r,bearing,beat].join('/');
 if(SHOT_ART.has(key))return SHOT_ART.get(key);
 if(SHOT_ART.size>=720)SHOT_ART.delete(SHOT_ART.keys().next().value);
 if(/^#[0-9a-f]{3}$/i.test(c))c=c.replace(/[0-9a-f]/gi,n=>n+n);
 const shadow=shade(c,-.42),light=shade(c,.48),gleam='#fff4db',dark='#19131f';
 const art=mk(64,64,g=>{
  g.translate(32,32);g.scale(2,2);g.rotate(bearing*Math.PI/12);
  const {poly,line,ink}=heroPainter(g);
  const facets=(points,mid,shine)=>{
   poly(points,c);
   poly(mid,shadow,false);
   poly(shine,light,false);
  };
  if(form==='arrow'||form==='spear'||form==='needle'){
   const L=form==='spear'?9:form==='needle'?6:7,wide=form==='needle'?1.25:2.3;
   line([[-L,0],[L-2,0]],2.4,dark);
   line([[-L,0],[L-2,0]],.9,form==='needle'?light:'#c39c6a');
   facets([[L,0],[L-3,-wide],[L-2,0],[L-3,wide]],[[L,0],[L-2,0],[L-3,wide]],
    [[L-.5,0],[L-3,-wide],[L-2,-.2]]);
   if(form==='arrow')poly([[-L+2,0],[-L-1,-2],[-L,-.2],[-L-1,2]],c);
   ink(L-2,-.6,1,1,gleam);return;
  }
  if(form==='crescent'){
   poly([[-3,-r-5],[1,-r-3],[4,-r],[5,0],[4,r],[1,r+3],[-3,r+5],[0,r],[2,0],[0,-r]],c);
   line([[-2,-r-4],[2,-r-1],[4,0],[2,r+1],[-2,r+4]],1,light);return;
  }
  if(form==='web'){
   for(let i=0;i<4;i++){const a=i*Math.PI/4;line([[-Math.sin(a)*r,-Math.cos(a)*r],[Math.sin(a)*r,Math.cos(a)*r]],1,light);}
   ink(-.6,-.7,1.2,1.4,gleam);return;
  }
  if(form==='star'||form==='split'){
   const n=form==='star'?4:3,length=Math.max(3.5,r+1);
   const pts=Array.from({length:n*2},(_,i)=>{const a=i*Math.PI/n,z=i%2?length*.43:length;return [Math.cos(a)*z,Math.sin(a)*z];});
   poly(pts,c);for(let i=0;i<n;i++){
    const a=i*2*Math.PI/n;line([[0,0],[Math.cos(a)*length,Math.sin(a)*length]],.7,light);
   }
  }else if(form==='ring'){
   const R=Math.max(2.7,r);
   for(let i=0;i<8;i++){const a=i*Math.PI/4,b=(i+1)*Math.PI/4;
    const p=(angle,d)=>[Math.cos(angle)*d,Math.sin(angle)*d];
    poly([p(a,R+1),p(b,R+1),p(b,R-1),p(a,R-1)],i>=4?light:c,false);
   }
   line([[-R,0],[-R*.7,-R*.7],[0,-R],[R*.7,-R*.7],[R,0]],.65,gleam);
   ink(-.65,-.65,1.3,1.3,gleam);return;
  }else if(form==='grain'||form==='comet'||form==='knife'||form==='hook'||form==='bone'){
   const L=form==='grain'?r+2:r+4,W=Math.max(1.6,r*.65);
   facets([[-L,0],[-L*.22,-W],[L*.48,-W],[L,0],[L*.38,W],[-L*.2,W]],
    [[-L,0],[L,0],[L*.38,W],[-L*.2,W]],
    [[-L*.22,-W],[L*.48,-W],[L,0],[0,-.3]]);
   if(form==='hook')line([[-L+1,0],[-L+1,3],[-L+4,3]],1,light);
   if(form==='knife')line([[-L+2,-W],[-L+2,W]],1,'#bc9064');
   if(form==='bone')for(const x of [-L+1,L-1])ink(x,-W-.5,1.5,W*2+1,gleam);
  }else if(form==='paper'||form==='note'){
   poly([[-r*.75,-r-1],[r*.75,-r],[r*.75,r],[-r*.75,r+1]],'#f0dfba');
   line([[0,-r+.5],[0,r-.5]],1.25,c);ink(-r*.6,r-1,r*1.1,.7,shadow);return;
  }else if(form==='fan'||form==='feather'||form==='petal'||form==='crane'||form==='palm'||form==='fox'){
   facets([[-r-1,0],[-r*.55,-r*.7],[r*.3,-r],[r+2,0],[r*.3,r],[-r*.55,r*.7]],
    [[-r-1,0],[r+2,0],[r*.3,r],[-r*.55,r*.7]],
    [[-r*.55,-r*.7],[r*.3,-r],[r+2,0],[0,-.8]]);
   if(form==='crane'||form==='fox')poly([[-r*.9,0],[-r-1,-r*.9],[1,-r*.6],[r,0]],light);
   if(form==='fan')for(const y of [-r*.6,r*.6])line([[-r,0],[r*.4,y]],.75,gleam);
   if(form==='palm')for(let i=-1;i<=1;i++)ink(r*.45,i*r*.55,1.15,.65,gleam);
  }else if(form==='flame'||form==='venom'){
   facets([[-r,-r*.25],[-r*.55,-r*.73],[-r*.25,-r*.1],[.5,-r-1],[r,-r*.45],[r,r*.45],[0,r],[-r*.7,r*.5]],
    [[-r,r*.1],[0,r*.5],[r,-r*.45],[r,r*.45],[0,r],[-r*.7,r*.5]],
    [[-.6,-r*.55],[r*.35,-r*.34],[r*.25,r*.35],[-r*.55,r*.35]]);
  }else if(form==='mine'||form==='drum'){
   facets([[-r,-r*.6],[-r*.5,-r],[r*.5,-r],[r,-r*.6],[r,r*.7],[r*.5,r],[-r*.5,r],[-r,r*.7]],
    [[-r,.1],[r,.1],[r,r*.7],[r*.5,r],[-r*.5,r],[-r,r*.7]],
    [[-r,-r*.6],[-r*.5,-r],[r*.5,-r],[r,-r*.6]]);
   line([[-r+.5,0],[r-.5,0]],.75,light);if(beat)ink(-.7,-1,1.5,1.5,gleam);return;
  }else{
   const pts=form==='gem'?[[0,-r],[r,0],[0,r],[-r,0]]:[[-r,-r*.45],[-r*.45,-r],[r*.47,-r],[r,-r*.4],[r,r*.48],[r*.44,r],[-r*.52,r],[-r,r*.45]];
   facets(pts,[[0,0],[r,-r*.38],[r*.44,r],[-r*.52,r],[-r,r*.45]],
    [[-r*.69,-r*.25],[-r*.28,-r*.72],[r*.35,-r*.65],[0,0]]);
  }
  ink(-.6,-.7,1.2,1.4,gleam);
 });
 SHOT_ART.set(key,art);return art;
}

function drawShotArt(q){
 const X=sx(q.x,q.y),Y=sy(q.x,q.y)-7,waiting=q.st==='lance'&&q.wait>0,pad=waiting?146:34;
 const view=sceneBounds;
 if(q.dead||X<view.left-pad||X>view.right+pad||Y<view.top-pad||Y>view.bottom+pad)return;
 const color=q.col||'#ef9673',form=q.spr==='silk'&&q.stuck?'web':SHOT_FORMS[q.spr]||(q.arrow?'arrow':q.crescent?'crescent':SHOT_STYLES[q.st]||'orb');
 const r=Math.max(q.from==='e'?2.2:1.6,Math.round((q.r||2)*2)/2);
 const [vx,vy]=scrVec(waiting?q.lvx:q.vx,waiting?q.lvy:q.vy);
 let bearing=SHOT_STATIC.has(form)?0:Math.round(Math.atan2(vy||0,vx||0)*12/Math.PI);
 if(q.st==='boom'||form==='star')bearing=(Math.floor(time*20)+bearing)%24;
 if(waiting){
  const len=Math.hypot(vx,vy)||1;
  ctx.save();ctx.globalAlpha*=Math.floor(time*16)%2?.6:.32;ctx.fillStyle=color;
  for(let d=5;d<140;d+=3)ctx.fillRect(Math.round(X+vx/len*d),Math.round(Y+vy/len*d),1,1);
  ctx.restore();
 }
 const beat=form==='mine'||form==='drum'?Math.floor(time*(q.fuse<.4?16:5))%2:0;
 if(q.st==='mine')circ(X,Y+3,Math.max(4,8-(q.fuse||0)*3),color);
 if(q.rare){
  ctx.save();ctx.globalAlpha*=.23;disc(X,Y,r+2,color);ctx.restore();
 }
 const art=shotSprite(form,color,r,bearing,beat);
 ctx.fillStyle='rgba(21,15,24,.32)';ctx.fillRect(X-1,Y+7,3,1);
 ctx.drawImage(art,Math.round(X)-16,Math.round(Y)-16,32,32);
}
