// Run from the repo root: node docs/chapter2/render-concept-sheet.js  (Playwright + Chromium). Rebuilds concept_sheet.png from guardian-concepts.js.
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(String(e.stack).slice(0,300)));
await p.goto('file://'+process.cwd()+'/index.html');await p.waitForTimeout(400);await p.addScriptTag({path:'docs/chapter2/guardian-concepts.js'});
const url=await p.evaluate(()=>{
 const frame=(C,two)=>{ARTHURT=two;try{const c=mk(72,76,g=>{C.draw({R:(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(x,y,w,h);},f:0},{});});return outlined(c);}finally{ARTHURT=false;}};
 const sil=c=>mk(c.width,c.height,g=>{g.drawImage(c,0,0);g.globalCompositeOperation='source-in';g.fillStyle='#000';g.fillRect(0,0,c.width,c.height);});
 const CW=640,CH=330,G=['NEBARI','KANE','SUMI','MUKURO'],STAGE={NEBARI:'XVI - THE SILT CELLARS',KANE:'XIX - THE BELL FOUNDRY',SUMI:'XVIII - THE INK ARCHIVE',MUKURO:'XX - THE HOLLOW THRONE'};
 const c=document.createElement('canvas');c.width=CW*2+30;c.height=60+G.length*CH;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.fillStyle='#16141c';g.fillRect(0,0,c.width,c.height);
 g.font='bold 20px monospace';g.fillStyle='#f0d8a0';g.fillText('CHAPTER II GUARDIANS - CONCEPT SHEET (TWO DIRECTIONS EACH)',12,28);g.font='12px monospace';g.fillStyle='#a8a4b8';g.fillText('LARGE: FIRST FORM (3X)   |   SECOND FORM SKETCH (2X)   |   AT ACTUAL GAMEPLAY SIZE: SILHOUETTE AND COLOUR ON THE FLOOR',12,48);
 const wrap=(s,x,y,w)=>{const W=s.split(' ');let l='';for(const t of W){if(g.measureText(l+t).width>w){g.fillText(l,x,y);y+=14;l='';}l+=t+' ';}g.fillText(l,x,y);};
 G.forEach((nm,row)=>{const L=CONCEPTS.filter(k=>k.g===nm);L.forEach((C,col)=>{const x=12+col*(CW+6),y=60+row*CH;g.fillStyle='#22202a';g.fillRect(x,y,CW,CH-10);
  const f1=frame(C,false),f2=frame(C,true);g.drawImage(f1,0,0,72,76,x+8,y+40,216,228);g.drawImage(f2,0,0,72,76,x+232,y+116,144,152);
  // gameplay size on a floor swatch
  g.fillStyle="#2c2a30";g.fillRect(x+390,y+204,236,104);for(let i=0;i<8;i++){g.fillStyle=i%2?"#302e36":"#28262e";g.fillRect(x+390+i*30,y+204,30,104);}
  const sc=1.1;g.drawImage(sil(f1),0,0,72,76,x+402,y+218,Math.round(72*sc),Math.round(76*sc));g.drawImage(f1,0,0,72,76,x+482,y+218,Math.round(72*sc),Math.round(76*sc));g.drawImage(f2,0,0,72,76,x+552,y+228,Math.round(72*.9),Math.round(76*.9));
  g.font='bold 15px monospace';g.fillStyle='#ffd870';g.fillText(nm+' - DIRECTION '+C.dir+': '+C.title,x+10,y+20);g.font='11px monospace';g.fillStyle='#8a86a0';g.fillText(STAGE[nm],x+10,y+34);
  g.fillStyle='#d8d4e0';g.font='11px monospace';wrap(C.desc,x+390,y+56,240);g.fillStyle='#8a86a0';g.fillText('SECOND FORM',x+232,y+112);g.fillText("GAMEPLAY SIZE",x+394,y+200);});});
 return c.toDataURL();});
require('fs').writeFileSync('docs/chapter2/concept_sheet.png',Buffer.from(url.split(',')[1],'base64'));console.log(errs.join('\n')||'ok');await b.close();})();
