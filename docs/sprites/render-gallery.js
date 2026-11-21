const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('file://'+process.cwd()+'/index.html');await p.waitForTimeout(400);
const res=await p.evaluate(()=>{
 const roman=['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII'];
 const groups=[['PROLOGUES',PROS.map((x,i)=>[x.boss.name,'PROLOGUE '+roman[i]])],
  ['STAGES I - XII',BOSS.slice(0,12).map((b,i)=>[b.name,'STAGE '+roman[i]])],
  ['LATE GAME AND CHAPTER II',BOSS.slice(12, CAMPAIGN_END+1+LATE.length).flatMap((b,i)=>{
   const di=12+i,roads=DESCENT_ROADS[di];
   return roads?roads.map((road,k)=>[road.def.t.BOSS.name,'STAGE '+romanOf(di+1)+' '+(k?'B':'A')]):[[b.name,'STAGE '+romanOf(di+1)]];
  })],
  ['MINI-BOSSES AND LAIRS',[['THE MOTH QUEEN','MINI-BOSS'],['TSUCHIGUMO, EARTH SPIDER','LAIR III'],['THE HITOBASHIRA','LAIR V'],['KUROGANE ON FOOT','XI, ON FOOT'],[SHARDSMITH,'LAIR XVII']]]];
 const Z=2,CW=210,CH=196,COLS=6,HDR=28,TOP=40;let rows=0;for(const [,L] of groups)rows+=Math.ceil(L.length/COLS);
 const c=document.createElement('canvas');c.width=CW*COLS+20;c.height=TOP+groups.length*HDR+rows*CH+10;const g=c.getContext('2d');g.imageSmoothingEnabled=false;
 g.fillStyle='#1a1820';g.fillRect(0,0,c.width,c.height);g.font='bold 18px monospace';g.fillStyle='#f0d8a0';g.fillText('SHINOBIDUNGEONS - EVERY GUARDIAN (FIRST FORM | SECOND FORM)',10,26);
 let y=TOP;const miss=[];
 for(const [title,L] of groups){g.font='bold 14px monospace';g.fillStyle='#c8a0ff';g.fillText(title,10,y+18);y+=HDR;
  L.forEach(([n,tag],i)=>{const x=10+(i%COLS)*CW,yy=y+Math.floor(i/COLS)*CH;g.fillStyle='#24222c';g.fillRect(x+2,yy+2,CW-6,CH-6);
   const S=[0,1].map(h=>{ARTHURT=!!h;try{return bossArt(n);}catch(e){return null;}finally{ARTHURT=false;}});
   if(!S[0]){miss.push(n);return;}
   const s0=S[0],sc=Math.min(Z,(CW/2-8)/s0.fw,(CH-44)/s0.fh);S.forEach((s,k)=>{if(!s)return;const w=s.fw*sc,h=s.fh*sc;g.drawImage(s.c,0,0,s.fw,s.fh,x+6+k*(CW/2-2)+(CW/2-8-w)/2,yy+CH-38-h,w,h);});
   g.font='10px monospace';g.fillStyle='#8a86a0';g.fillText(tag,x+8,yy+16);g.fillStyle='#fff';const nm=n.split(',');g.font='bold 11px monospace';g.fillText(nm[0].slice(0,26),x+8,yy+CH-22);if(nm[1]){g.font='10px monospace';g.fillStyle='#bbb';g.fillText(nm[1].trim().slice(0,28),x+8,yy+CH-10);}});
  y+=Math.ceil(L.length/COLS)*CH;}
 const bossUrl=c.toDataURL();
 // heroes: every class at its first, middle and final forms
 const st=[0,5,9],HZ=4,HW=96,HH=140,hc=document.createElement('canvas');hc.width=CLASSES.length*HW*1+20;hc.height=0;
 const hcols=7,hrows=Math.ceil(CLASSES.length/hcols),cw=3*20*HZ+30,ch=24*HZ+50;hc.width=hcols*cw+20;hc.height=40+hrows*ch;const h=hc.getContext('2d');h.imageSmoothingEnabled=false;
 h.fillStyle='#1a1820';h.fillRect(0,0,hc.width,hc.height);h.font='bold 18px monospace';h.fillStyle='#f0d8a0';h.fillText('SHINOBIDUNGEONS - EVERY HERO (FIRST | MIDDLE | FINAL FORM)',10,26);
 CLASSES.forEach((C,i)=>{const x=10+(i%hcols)*cw,yy=40+Math.floor(i/hcols)*ch;h.fillStyle='#24222c';h.fillRect(x+2,yy+2,cw-6,ch-6);
  st.forEach((s,k)=>{let sp;try{sp=heroSpr(C.k,s,false);}catch(e){sp=null;}if(!sp)return;h.drawImage(sp.c,0,0,sp.fw,sp.fh,x+8+k*20*HZ,yy+8,sp.fw*HZ,sp.fh*HZ);});
  h.font='bold 12px monospace';h.fillStyle='#fff';h.fillText((C.n||C.k).toUpperCase(),x+8,yy+ch-14);});
 return {bossUrl,heroUrl:hc.toDataURL(),miss};});
const fs=require('fs');fs.writeFileSync('docs/sprites/all_guardians.png',Buffer.from(res.bossUrl.split(',')[1],'base64'));fs.writeFileSync('docs/sprites/all_heroes.png',Buffer.from(res.heroUrl.split(',')[1],'base64'));
console.log('missing:',res.miss,errs.join('|')||'no errors');await b.close();})();
