// Run from the repo root: node docs/chapter2/fight-bot.js samurai,archer NEB_I [touch]   - fights a stage's guardian through Test Mode and reports length, damage by source, warning checks.
// Fights run in Test Mode with epic gear, 16 relics, final form, and god mode off.
// The bot walks out of every warning shape with the real keys, keeps its preferred range, fires at the guardian and
// uses its abilities; it does not weave through loose bullets. Damage taken is counted, the bot is topped up at 25%.
const {chromium}=require('playwright');const _x=0,heroes=(process.argv[2]||'samurai,archer').split(','),stages=process.argv[3]||'ECL_I,FERRY_STAGE,NEB_I',touch=process.argv[4]==='touch',seed=Number(process.env.FIGHT_SEED??412892);
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:640,height:360}});const errs=[];p.on('pageerror',e=>errs.push(String(e.stack).slice(0,300)));
await p.goto('file://'+process.cwd()+'/index.html');await p.waitForTimeout(400);
const out=await p.evaluate(([heroes,stages,touch,seed])=>{meta.trained=true;meta.tut3=true;meta.opt.tips=0;meta.unlocked=99;meta.opt.autoFire=0;const res=[],random=Math.random;
 const keyFor=(wx,wy)=>{if(touch)TCH.stick=null;let best=null,bd=-9;const set=k=>{for(const K of [KB.right,KB.left,KB.up,KB.down])keys[K]=false;if(k[0]>0)keys[KB.right]=true;if(k[0]<0)keys[KB.left]=true;if(k[1]>0)keys[KB.down]=true;if(k[1]<0)keys[KB.up]=true;};
  for(const k of [[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]]){set(k);const [mx,my]=moveVec();const d=mx*wx+my*wy;if(d>bd){bd=d;best=k;}}if(!touch)set(best);else{set([0,0]);TCH.stick={ox:0,oy:0,x:best[0]*22,y:best[1]*22};}};
 const stop=()=>{if(touch)TCH.stick=null;for(const K of [KB.right,KB.left,KB.up,KB.down])keys[K]=false;};
 for(const sn of stages.split(','))for(const hk of heroes){
  let state=seed>>>0;Math.random=()=>{let n=state=(state+0x6D2B79F5)>>>0;
   n=Math.imul(n^(n>>>15),n|1);n^=n+Math.imul(n^(n>>>7),n|61);return ((n^(n>>>14))>>>0)/4294967296;};
  const [stage,road]=sn.split(':');const di=isNaN(+stage)?eval(stage):+stage;
  Object.assign(TEST,{stage:di,road,cls:CLASSES.findIndex(c=>c.k===hk),start:1,god:0,gear:2,power:16,ngp:0});testStart();if(touch)TOUCH=true;
  for(const e of enemies)if(!e.boss&&!e.bossOwned)e.dead=true;enemies=enemies.filter(e=>!e.dead);
  for(let i=0;i<300;i++)update(1/60);const e=boss;const r={stage:ROMAN[di]+' '+(e?e.name:'?'),hero:hk};if(!e){res.push(r);continue;}
  const SRC={};const _hp=hitPlayer;hitPlayer=function(raw,x,y,o){const h0=P.hp;const r=_hp.apply(this,arguments);const d=h0-P.hp;if(d>0){const k=o&&o.bullet?'bullets':(o&&o.peril)?'warning shapes':'contact/other';const m=BMK.find(m=>m.fired&&m.t>-.05&&inShape(m,P.x,P.y));const kk=m?(m.neb?'bloom':m.k==='cone'?'sweep':m.k):k;SRC[kk]=(SRC[kk]||0)+Math.round(d/S.maxhp*100);}return r;};
  const A=arenaOf(e);let t=0,taken=0,lowest=1,mires=0,warnOut=0,minEsc=9,half=-1,ev=-1;const seen=new Set();
  const melee=['samurai','sumo','lancer','kagura','bellwarden','shinobi'].includes(hk);
  while(t<300&&!e.dead){let dx=0,dy=0;
   // Headless updates skip renderPlay, which normally moves the camera for the touch targeting check.
   cam.x=Math.round(isoX(P.x,P.y)-W/2);cam.y=Math.round(isoY(P.x,P.y)-(H/2+6));
   for(const m of BMK){if(m.fired)continue;if(!seen.has(m)){seen.add(m);if(m.glassLine){
     const dx=Math.cos(m.a),dy=Math.sin(m.a),pad=m.w/2;
     for(let j=0;j<=12;j++){
      const x=m.x+dx*m.len*j/12,y=m.y+dy*m.len*j/12;
      if(!glassFence(A,x,y,pad)){warnOut++;break;}
     }
     minEsc=Math.min(minEsc,m.dur-(pad+4)/(78*(CLS().spd||1)));
    }
    if(m.k==='c'){
     // The approach can have its own panes. Only warnings cast by the guardian must fit the boss room.
     const approachPane=m.glassPlate&&!m.src;
     if(!approachPane&&(m.x-m.r<A.x0-2||m.x+m.r>A.x1+2||m.y-m.r<A.y0-2||m.y+m.r>A.y1+2))warnOut++;
     if(m.lacquer||m.glassPlate)for(let i=0;i<16;i++){
      const a=i/16*TAU;
      if(solid(m.x+Math.cos(a)*m.r,m.y+Math.sin(a)*m.r)){warnOut++;break;}
     }
     const mg=m.t-(m.lacquer?.24:0)-(m.r+(m.lacquer||m.glassPlate?4:0))/((m.lacquer||m.glassPlate?78*(CLS().spd||1):90)*(m.neb?.55:1));
     if(m.t>m.dur-.05&&mg<minEsc){minEsc=mg;window.WORST={r:m.r,t:+m.t.toFixed(2),neb:!!m.neb,dmg:m.dmg,col:m.col,inSilt:typeof nebSoftAt!=="undefined"&&nebSoftAt(P.x,P.y)};}
    }}
    const near=inShape(m,P.x,P.y)||(m.k==='c'&&Math.hypot(P.x-m.x,P.y-m.y)<m.r+10)||(m.k==='cone'&&inShape(Object.assign({},m,{r:m.r+10,arc:m.arc+.4}),P.x,P.y));
    if(near){if(m.k==='l'){const s=Math.sign(-(P.x-m.x)*Math.sin(m.a)+(P.y-m.y)*Math.cos(m.a))||1;dx+=-Math.sin(m.a)*s;dy+=Math.cos(m.a)*s;}else{const a=Math.atan2(P.y-m.y,P.x-m.x);dx+=Math.cos(a);dy+=Math.sin(a);}}}
   // loose shots heading this way: step aside from the nearest few
   {let n=0;for(const q of projs){if(q.from!=='e'||q.dead)continue;const rx=P.x-q.x,ry=P.y-q.y,dd=Math.hypot(rx,ry);if(dd>40||dd<1)continue;const v=Math.hypot(q.vx,q.vy)||1;if((q.vx*rx+q.vy*ry)/v<dd*.5)continue;
     const side=Math.sign(q.vx*ry-q.vy*rx)||1;dx+=-q.vy/v*side*(40-dd)/40*1.5;dy+=q.vx/v*side*(40-dd)/40*1.5;if(++n>5)break;}}
   const d=Math.hypot(e.x-P.x,e.y-P.y);
   if(Math.hypot(dx,dy)<.3){const want=melee?26:e.name===LAC.name?76:(touch?90:110);if(d>want+10){dx=e.x-P.x;dy=e.y-P.y;}else if(d<want-20){dx=P.x-e.x;dy=P.y-e.y;}else{dx=-(e.y-P.y);dy=e.x-P.x;}
    if(!melee&&e.name===LAC.name&&projectileCover(e,P.x,P.y)){
     const wx=(P.y-e.y)/(d||1),wy=(e.x-P.x)/(d||1);
     const steps=[28,-28,56,-56,84,-84];
     const open=steps.find(step=>!blocked(P.x+wx*step,P.y+wy*step,4)&&
      !projectileCover(e,P.x+wx*step,P.y+wy*step));
     if(open){dx=wx*Math.sign(open);dy=wy*Math.sign(open);}
    }
    if(typeof NEB!=='undefined'&&e.name===NEB.name&&e.half&&!melee&&BMK.some(m=>m.k==='l'&&!m.fired)){const mound=NEB.pools.filter(q=>q.hard).sort((a,b)=>Math.hypot(a.x-P.x,a.y-P.y)-Math.hypot(b.x-P.x,b.y-P.y))[0];
     if(mound){const ux=mound.x-e.x,uy=mound.y-e.y,l=Math.hypot(ux,uy)||1;dx=mound.x+ux/l*20-P.x;dy=mound.y+uy/l*20-P.y;}}}
   // stay inside the arena
   if(P.x<A.x0+12)dx+=1;if(P.x>A.x1-12)dx-=1;if(P.y<A.y0+12)dy+=1;if(P.y>A.y1-12)dy-=1;
   if(e.di===RURI_I&&(P.x<A.x0||P.x>A.x1||P.y<A.y0||P.y>A.y1)){dx=A.cx-P.x;dy=A.cy-P.y;}
   const l=Math.hypot(dx,dy);if(l>.1)keyFor(dx/l,dy/l);else stop();
   if(!touch){touchAimAt(e);mouse.down=true;}
   if(Math.floor(t*60)%45===0){try{
    if(touch)for(const btn of touchButtons().filter(b=>['q','w','f','e'].includes(b.slot)&&
     (b.slot!=='e'||e.hp<e.maxhp*.6))){touchPress(btn);touchRelease(btn);}
    else{castChain();castWard();castF();if(e.hp<e.maxhp*.6)castUlt();}
   }catch(_){}}
   const hp0=P.hp;update(1/60);t+=1/60;if(P.hp<hp0)taken+=hp0-P.hp;lowest=Math.min(lowest,P.hp/S.maxhp);if(P.hp<S.maxhp*.25)P.hp=S.maxhp;
   if(e.mireT>0&&!e._m){e._m=1;mires++;}if(!(e.mireT>0))e._m=0;if(e.half&&half<0)half=Math.round(t);if(e.EV&&ev<0)ev=Math.round(t);}
  hitPlayer=_hp;r.bySource=SRC;stop();mouse.down=false;TOUCH=false;
  Object.assign(r,{touch,bossHpLeft:Math.round(Math.max(0,e.hp)/e.maxhp*100)+"%",won:!!e.dead,secs:Math.round(t),dmgTaken:Math.round(taken/S.maxhp*100)+'% max hp',deaths:Math.floor(taken/S.maxhp),half,ev,mires,warnOut,minEscapeMargin:+minEsc.toFixed(2),worst:window.WORST});window.WORST=null;res.push(r);}
 Math.random=random;return res;},[heroes,stages,touch,seed]);
for(const r of out)console.log(JSON.stringify(r));console.log(errs.slice(0,5).join('\n')||'no errors');await b.close();})();
