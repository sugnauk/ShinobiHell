// render boss sheets: rows = bosses x {normal, second form}; frames at 3x, then an in-game-size copy at 1x(scaled 2 for viewing)
const {chromium}=require('playwright');const names=process.argv[2].split('|'),out=process.argv[3]||'bossart.png';
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(String(e.stack).slice(0,300)));
await p.goto('file://'+process.cwd()+'/index.html');await p.waitForTimeout(400);
const url=await p.evaluate((names)=>{const rows=[];for(const n of names)for(const h of [0,1]){ARTHURT=!!h;let s;try{s=bossArt(n);}finally{ARTHURT=false;}rows.push({n,h,s});}
 const Z=3,PAD=8,rh=Math.max(...rows.map(r=>r.s.fh))*Z+PAD,maxF=Math.max(...rows.map(r=>r.s.frames||3)),cw=Math.max(...rows.map(r=>r.s.fw))*Z;
 const c=document.createElement('canvas');c.width=cw*maxF+300;c.height=rh*rows.length;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.fillStyle='#2a3a2a';g.fillRect(0,0,c.width,c.height);
 rows.forEach((r,i)=>{const s=r.s,n=s.frames||Math.round(s.c.width/s.fw);for(let f=0;f<n;f++)g.drawImage(s.c,f*s.fw,0,s.fw,s.fh,f*cw,i*rh,s.fw*Z,s.fh*Z);
  // in-game size (sc), shown at 2x
  const gx=cw*maxF+10,sc=s.sc||1,w=Math.round(s.fw*sc),hh=Math.round(s.fh*sc);const t=document.createElement('canvas');t.width=w;t.height=hh;const tg=t.getContext('2d');tg.imageSmoothingEnabled=false;tg.drawImage(s.c,0,0,s.fw,s.fh,0,0,w,hh);g.drawImage(t,0,0,w,hh,gx,i*rh,w*2,hh*2);
  g.fillStyle='#ff0';g.font='12px monospace';g.fillText(r.n.split(',')[0]+(r.h?' II':''),4,i*rh+12);});
 return c.toDataURL();},names);
require('fs').writeFileSync(out,Buffer.from(url.split(',')[1],'base64'));console.log(errs.join('\n')||'ok');await b.close();})();
