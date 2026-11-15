'use strict';
/* SHINOBI DUNGEONS - 8-bit Sekiro-flavoured roguelite. Single file, no dependencies. */
// W,H: the game's pixel resolution. Menus use 320x180; while fighting the camera zooms out to 384x216 to show the bigger rooms.
let W=320,H=180;const T=16,MW=140,MH=116,TAU=Math.PI*2,WH=10;
const cv=document.getElementById('c'),ctx=cv.getContext('2d');
cv.width=W;cv.height=H;
function setView(wide){const nw=wide?384:320,nh=wide?216:180;if(nw===W)return;W=nw;H=nh;cv.width=W;cv.height=H;fit();}
function fit(){const s=Math.max(1,Math.floor(Math.min(innerWidth/W,innerHeight/H)));cv.style.width=W*s+'px';cv.style.height=H*s+'px';cv.style.left=Math.floor((innerWidth-W*s)/2)+'px';cv.style.top=Math.floor((innerHeight-H*s)/2)+'px';}
addEventListener('resize',fit);fit();

// ---------- utils ----------
const rnd=(a,b)=>a+Math.random()*(b-a),ri=(a,b)=>Math.floor(rnd(a,b+1)),pick=a=>a[Math.floor(Math.random()*a.length)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const angTo=(a,b)=>Math.atan2(b.y-a.y,b.x-a.x);
const angDiff=(a,b)=>{let d=(a-b)%TAU;if(d>Math.PI)d-=TAU;if(d<-Math.PI)d+=TAU;return d;};
function hash(x,y){let h=(x*374761393+y*668265263)|0;h=Math.imul(h^(h>>>13),1274126177);return ((h^(h>>>16))>>>0)/4294967295;}
function wpick(a){let s=0;for(const x of a)s+=x.wt||1;let r=Math.random()*s;for(const x of a){r-=x.wt||1;if(r<=0)return x;}return a[a.length-1];}
function shade(hex,f){const n=parseInt(hex.slice(1),16);let r=n>>16,g=(n>>8)&255,b=n&255;const m=v=>clamp(Math.round(f>0?v+(255-v)*f:v*(1+f)),0,255);return '#'+((1<<24)|(m(r)<<16)|(m(g)<<8)|m(b)).toString(16).slice(1);}
// isometric projection: world (x,y) -> iso space; sx/sy give on-screen pixels relative to the camera
// ---- camera rotation: the world is turned in 90-degree steps before the iso projection ----
// u = RA*x+RB*y+RC, v = RD*x+RE*y+RF  (a pure rotation + offset so the map stays in positive space)
let camRot=0,RA=1,RB=0,RC=0,RD=0,RE=1,RF=0,VOFF=MH*T,RMH=MH;
function setRotCoef(r){camRot=((r%4)+4)%4;
 [[1,0,0,0,1,0],[0,-1,MH*T,1,0,0],[-1,0,MW*T,0,-1,MH*T],[0,1,0,-1,0,MW*T]][camRot].forEach((v,i)=>{if(i===0)RA=v;else if(i===1)RB=v;else if(i===2)RC=v;else if(i===3)RD=v;else if(i===4)RE=v;else RF=v;});
 RMH=camRot&1?MW:MH;VOFF=RMH*T;}
const ru=(x,y)=>RA*x+RB*y+RC,rv=(x,y)=>RD*x+RE*y+RF;
const dep=(x,y)=>ru(x,y)+rv(x,y); // draw-order depth (bigger = nearer the camera)
// camera pitch: ISOK is how tall a tile is relative to its width (0.5 = classic 2:1 isometric; higher = more top-down)
const ISOK=11/16,HY=11,TILEH=22; // HY = half a tile's screen height, TILEH = its full height (16 px wide halves)
const dHalf=j=>Math.round(16*(1-(Math.abs(j+.5-HY)-.5)/HY)); // half-width of the diamond on screen row j
const isoX=(x,y)=>ru(x,y)-rv(x,y)+VOFF,isoY=(x,y)=>(ru(x,y)+rv(x,y))*ISOK;
const sx=(x,y)=>Math.round(isoX(x,y)-cam.x),sy=(x,y)=>Math.round(isoY(x,y)-cam.y);
// world vector -> screen vector, and screen-frame (u,v) vector -> world vector
const scrVec=(vx,vy)=>{const u=RA*vx+RB*vy,v=RD*vx+RE*vy;return [u-v,(u+v)*ISOK];};
const unrot=(du,dv)=>[RA*du+RD*dv,RB*du+RE*dv];
// tile (x,y) -> its tile position in the rotated grid, and back
const tileR=(tx,ty)=>{const cx=tx*T+T/2,cy=ty*T+T/2;return [Math.floor(ru(cx,cy)/T),Math.floor(rv(cx,cy)/T)];};
const tileW=(tu,tv)=>{const U=tu*T+T/2-RC,V=tv*T+T/2-RF;return [Math.floor((RA*U+RD*V)/T),Math.floor((RB*U+RE*V)/T)];};
const floorAtR=(tu,tv)=>{const [x,y]=tileW(tu,tv);return x>=0&&y>=0&&x<MW&&y<MH&&map.t[y*MW+x];};

// ---------- tiny 3x5 pixel font ----------
const FONT={'0':[7,5,5,5,7],'1':[2,6,2,2,7],'2':[7,1,7,4,7],'3':[7,1,7,1,7],'4':[5,5,7,1,1],'5':[7,4,7,1,7],'6':[7,4,7,5,7],'7':[7,1,2,2,2],'8':[7,5,7,5,7],'9':[7,5,7,1,7],
A:[2,5,7,5,5],B:[6,5,6,5,6],C:[3,4,4,4,3],D:[6,5,5,5,6],E:[7,4,6,4,7],F:[7,4,6,4,4],G:[3,4,5,5,3],H:[5,5,7,5,5],I:[7,2,2,2,7],J:[1,1,1,5,2],K:[5,5,6,5,5],L:[4,4,4,4,7],M:[5,7,7,5,5],N:[6,5,5,5,5],O:[2,5,5,5,2],P:[6,5,6,4,4],Q:[2,5,5,6,3],R:[6,5,6,5,5],S:[3,4,2,1,6],T:[7,2,2,2,2],U:[5,5,5,5,7],V:[5,5,5,5,2],W:[5,5,7,7,5],X:[5,5,2,5,5],Y:[5,5,2,2,2],Z:[7,1,2,4,7],
'.':[0,0,0,0,2],',':[0,0,0,2,4],'!':[2,2,2,0,2],':':[0,2,0,2,0],'-':[0,0,7,0,0],'+':[0,2,7,2,0],'/':[1,1,2,4,4],'%':[5,1,2,4,5],'?':[6,1,2,0,2],"'":[2,2,0,0,0],'(':[1,2,2,2,1],')':[4,2,2,2,4],'*':[0,5,2,5,0],'>':[4,2,1,2,4],'<':[1,2,4,2,1],'=':[0,7,0,7,0],'x':[0,5,2,5,0]};
function glyph(g,x,y,sc){for(let r=0;r<5;r++){const row=g[r];for(let c=0;c<3;c++)if(row&(4>>c))ctx.fillRect(x+c*sc,y+r*sc,sc,sc);}}
// legible text: every glyph gets a full dark outline (not just a drop shadow), dark colours are lifted so they
// read on dark floors, and outlined glyphs are cached as tiny images so drawing stays cheap
const GLC={},LCOL={};
function readCol(c){if(LCOL[c])return LCOL[c];let v=c;if(typeof c==='string'&&c[0]==='#'&&(c.length===4||c.length===7)){
 const h=c.length===4?c.slice(1).split('').map(z=>z+z).join(''):c.slice(1),r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16),L=(.299*r+.587*g+.114*b)/255;
 if(L<.5)v=shade('#'+h,Math.min(.6,(.5-L)*1.4));}return LCOL[c]=v;}
function glyphImg(ch,col,sc,ol){const k=ch+col+sc+(ol?'o':'');if(GLC[k])return GLC[k];const g=FONT[ch];if(!g)return null;
 const c=mk(3*sc+2,5*sc+2,x=>{const px=(dx,dy,cc)=>{x.fillStyle=cc;for(let r=0;r<5;r++)for(let q=0;q<3;q++)if(g[r]&(4>>q))x.fillRect(1+q*sc+dx,1+r*sc+dy,sc,sc);};
  if(ol){for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,-1],[-1,1],[1,1]])px(dx,dy,'#0a0610');px(1,1,'#0a0610');}px(0,0,col);});
 return GLC[k]=c;}
function txt(s,x,y,col,sc,shadow){col=readCol(col||'#fff');sc=sc||1;if(shadow===undefined)shadow=true;s=String(s).toUpperCase();
 let cx=Math.round(x)-1;const cy=Math.round(y)-1;for(const ch of s){const im=glyphImg(ch,col,sc,shadow);if(im)ctx.drawImage(im,cx,cy);cx+=4*sc;}}
const txtW=(s,sc)=>String(s).length*4*(sc||1)-(sc||1);
const ctxt=(s,y,col,sc)=>txt(s,Math.round((W-txtW(s,sc))/2),y,col,sc);
function bar(x,y,w,h,f,col,bg){ctx.fillStyle='#000';ctx.fillRect(x-1,y-1,w+2,h+2);ctx.fillStyle=bg||'#3a1a1a';ctx.fillRect(x,y,w,h);ctx.fillStyle=col;ctx.fillRect(x,y,Math.round(w*clamp(f,0,1)),h);}
function disc(x,y,r,col){ctx.fillStyle=col;r=Math.round(r);x=Math.round(x);y=Math.round(y);for(let j=-r;j<=r;j++){const w=Math.floor(Math.sqrt(r*r-j*j));ctx.fillRect(x-w,y+j,w*2+1,1);}}
function circ(x,y,r,col){ctx.fillStyle=col;const n=Math.max(12,Math.floor(r*2.4));for(let i=0;i<n;i++){const a=i/n*TAU;ctx.fillRect(Math.round(x+Math.cos(a)*r),Math.round(y+Math.sin(a)*r),1,1);}}
function line(x0,y0,a,r0,r1,col){ctx.fillStyle=col;for(let r=r0;r<=r1;r++)ctx.fillRect(Math.round(x0+Math.cos(a)*r),Math.round(y0+Math.sin(a)*r),1,1);}

// ---------- audio ----------
let AC=null,muted=false;
// ---- procedural chiptune: a looping tune per environment, faster with drums during boss fights ----
const MUSENV={grass:{r:57,s:[0,2,4,7,9],b:108,w:'square'},stone:{r:52,s:[0,2,3,5,7,8,10],b:100,w:'square'},planks:{r:55,s:[0,2,4,5,7,9,11],b:116,w:'triangle'},
 ember:{r:50,s:[0,1,4,5,7,8,10],b:132,w:'sawtooth'},swamp:{r:48,s:[0,3,5,6,7,10],b:92,w:'triangle'},temple:{r:57,s:[0,1,5,7,8],b:96,w:'triangle'},
 snow:{r:62,s:[0,2,4,7,9],b:100,w:'triangle'},marble:{r:60,s:[0,2,4,6,7,9,11],b:110,w:'square'},cave:{r:45,s:[0,1,3,5,6,8,10],b:88,w:'square'},blood:{r:47,s:[0,1,3,5,7,8,11],b:140,w:'sawtooth'}};
const mf=n=>440*Math.pow(2,(n-69)/12);
let mus={di:-1,song:null,step:0,next:0,gain:null};
function mkSong(di,env){let sd=di*977+13;const rr=()=>{sd=(sd*16807)%2147483647;return sd/2147483647;};const E=MUSENV[env]||MUSENV.stone,sc=E.s,deg=d=>E.r+sc[((d%sc.length)+sc.length)%sc.length]+12*Math.floor(d/sc.length);
 const prog=[0,[3,4,5][Math.floor(rr()*3)],[2,5][Math.floor(rr()*2)],4],mel=[],bass=[];let m=sc.length+2;
 for(let bar=0;bar<4;bar++)for(let s=0;s<8;s++){const ch=prog[bar];bass.push(s%2===0?deg(ch)-12:null);
  if(rr()<.28&&s%2)mel.push(null);else{m+=Math.floor(rr()*5)-2;if(s===0)m=ch+sc.length+(rr()<.5?0:2);m=clamp(m,sc.length-1,sc.length*2+3);mel.push(deg(m)+12);}}
 return {E,mel,bass};}
function musicTick(){
 if(!AC||mode!=='play'||muted||!map||!map.env)return;
 if(!mus.gain){mus.gain=AC.createGain();mus.gain.gain.value=.55;mus.gain.connect(AC.destination);}
 if(mus.di!==R.di){mus.di=R.di;mus.song=mkSong(R.di,map.env.k);mus.step=0;mus.next=AC.currentTime+.3;}
 const sg=mus.song,bossOn=boss&&boss.awake&&!boss.dead,spb=60/(sg.E.b*(bossOn?1.18:1))/2;
 if(mus.next<AC.currentTime-.2)mus.next=AC.currentTime+.05;
 if(paused||invOpen)return;
 while(mus.next<AC.currentTime+.15){const i=mus.step%32,t=mus.next,n=sg.mel[i],b=sg.bass[i];
  const note=(f,d,type,v)=>{const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f,t);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(mus.gain);o.start(t);o.stop(t+d+.02);};
  if(n)note(mf(n),spb*.9,sg.E.w,sg.E.w==='sawtooth'?.012:.018);
  if(b)note(mf(b),spb*1.8,'triangle',.05);
  if(i%2===1)note(5000+((i*733)%2000),.02,'square',.004);
  if(bossOn&&i%4===0)note(90,.12,'sine',.08);
  if(bossOn&&i%8===4)note(180,.06,'square',.02);
  mus.step++;mus.next+=spb;}
}
function tone(f,d,type,v,sl,delay){if(muted)return;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();const t=AC.currentTime+(delay||0),o=AC.createOscillator(),g=AC.createGain();o.type=type||'square';o.frequency.setValueAtTime(f,t);if(sl)o.frequency.exponentialRampToValueAtTime(Math.max(30,f+sl),t+d);g.gain.setValueAtTime(v||.05,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+d);}catch(e){}}
const SFX={slash:()=>tone(420,.09,'sawtooth',.04,-300),hit:()=>tone(170,.07,'square',.06,-100),deflect:()=>{tone(1500,.12,'square',.06,-500);tone(2200,.09,'triangle',.05,-900,.02);},block:()=>tone(500,.07,'square',.05,-250),hurt:()=>tone(130,.25,'sawtooth',.09,-80),kill:()=>tone(240,.14,'square',.05,-170),break:()=>{tone(320,.3,'sawtooth',.07,-220);tone(90,.4,'square',.07);},pickup:()=>{tone(660,.06,'square',.04);tone(990,.08,'square',.04,0,.06);},dash:()=>tone(250,.1,'triangle',.05,200),tool:()=>tone(700,.1,'square',.05,300),heal:()=>{tone(520,.1,'triangle',.06,200);tone(780,.15,'triangle',.06,200,.1);},boss:()=>{tone(80,.6,'sawtooth',.1,-30);tone(60,.8,'square',.08,-20,.1);},shoot:()=>tone(600,.06,'square',.03,-300),coin:()=>tone(1200,.04,'square',.025),beat:()=>{tone(70,.09,'sine',.12,-20);tone(60,.1,'sine',.1,-20,.14);},graze:()=>tone(1800,.03,'triangle',.02,400),rare:()=>{[784,988,1175,1568,1976].forEach((f,i)=>tone(f,.22,'triangle',.06,0,i*.07));tone(2637,.4,'square',.025,-400,.38);},win:()=>{[523,659,784,1046].forEach((f,i)=>tone(f,.25,'square',.06,0,i*.15));}};
const sfx=n=>{SFX[n]&&SFX[n]();};

// ---------- sprites (code-drawn, optional PNG override from assets/) ----------
function mk(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'));return c;}
function whiteOf(c){return mk(c.width,c.height,g=>{g.drawImage(c,0,0);g.globalCompositeOperation='source-in';g.fillStyle='#fff';g.fillRect(0,0,c.width,c.height);});}
const HATS={kasa:['..oooooo..','.ohhhhhho.','ohhhhhhhho'],hair:['...oooo...','..ohhhho..','.ohhhhhho.'],hood:['..oooooo..','.ohhhhhho.','.ohhhhhho.'],bald:['..oooooo..','.osssssso.','.osssssso.']};
const FACE=['.osssssso.','.osksskso.','..oooooo..'],FACEH=['.ohhhhhho.','.ohehheho.','..oooooo..'];
const BODY=['.occaacco.','occcccccco','ocdccccdco','ocdccccdco','oaaaaaaaao','.occddcco.','.ocd..dco.','.ooo..ooo.'];
function humanoid(p,hat,horns,sc){
 const face=hat==='hood'?FACEH:FACE,rows=[...HATS[hat],...face,...BODY];
 const c=mk(10,16,g=>{rows.forEach((r,y)=>{for(let x=0;x<10;x++){const ch=r[x];if(!ch||ch==='.'||!p[ch])continue;g.fillStyle=p[ch];g.fillRect(x,y+2,1,1);}});
  if(horns){g.fillStyle=p.a;g.fillRect(1,0,1,3);g.fillRect(8,0,1,3);g.fillRect(2,1,1,1);g.fillRect(7,1,1,1);}});
 return {c,wc:whiteOf(c),fw:10,fh:16,frames:1,sc:sc||1};
}
const SKIN='#e0b080';
const basePal=(c,d,a,h,s)=>({o:'#14101a',k:'#14101a',e:'#e04040',s:s||SKIN,c,d,a,h});
const OV={};
function loadOverride(key,file,fw,fh){const im=new Image();im.onload=()=>{OV[key]={c:im,wc:whiteOf(im),fw,fh,frames:Math.max(1,Math.floor(im.width/fw)),sc:1,ok:true};};im.onerror=()=>{};im.src='assets/'+file;}
// ---- the wizard: a small 20x24 code-drawn sheet with an animation per action ----
// frames: 0-1 idle, 2-5 walk, 6 attack wind-up, 7 attack release, 8-9 casting, 10 ultimate, 11 dash
const WIZ={idle:[0,1],walk:[2,3,4,5],atk:[6,7],cast:[8,9],ult:[10,10],dash:[11,11]};
// evolution stages: 0 apprentice (hood, stick), 1 adept (cap, small orb), 2 mage (pointed hat, short beard), 3 master (the full wizard)
const WIZEVO=[{n:'APPRENTICE',hat:'hood',beard:0,orb:0,C:{hat:'#5a4028',hatL:'#7a5a3a',band:'#5a4028',robe:'#7a5a3a',robeS:'#5a4028',trim:'#6a4a2e',orb:'#b07a40',orbL:'#c8945a',boot:'#3a2a1e'}},
 {n:'NOVICE',hat:'hood',beard:0,orb:0,C:{hat:'#3e4260',hatL:'#5a5e80',band:'#3e4260',robe:'#5a5e7a',robeS:'#3e4260',trim:'#8a8ea8',orb:'#60c8ff',orbL:'#e0f6ff'}},
 {n:'INITIATE',hat:'cap',beard:0,orb:1,C:{hat:'#1e5a5a',hatL:'#3a8a80',band:'#a0d0c8',robe:'#2e7a70',robeS:'#1e5a5a',trim:'#a0d0c8',orb:'#60f0d0',orbL:'#e0fff6'}},
 {n:'ADEPT',hat:'cap',beard:0,orb:1,C:{hat:'#1e3e70',hatL:'#3a5a9a',band:'#c8c8d0',robe:'#2e5a9a',robeS:'#1e3e70',trim:'#c8c8d0',orb:'#60c8ff',orbL:'#e0f6ff'}},
 {n:'CONJURER',hat:'pointed',beard:0,orb:1,C:{hat:'#6a1a2a',hatL:'#9a3a4a',band:'#e8c050',robe:'#8a2a3a',robeS:'#5a1a24',trim:'#e8c050'}},
 {n:'MAGE',hat:'pointed',beard:1,orb:1,C:{hat:'#3a1e60',hatL:'#5a3a8a',beard:'#6a4a30',beardS:'#4a3220'}},
 {n:'SORCERER',hat:'pointed',beard:1,orb:1,C:{hat:'#14303a',hatL:'#2a5060',band:'#e8c050',robe:'#1e3e48',robeS:'#122830',beard:'#8a8a90',beardS:'#6a6a70',orb:'#c060ff',orbL:'#f0d0ff'}},
 {n:'ARCHMAGE',hat:'pointed',beard:2,orb:1,C:{hat:'#1a2a6a',hatL:'#34489a',robe:'#24348a',robeS:'#16205a',beard:'#a8a8b4',beardS:'#80808c'}},
 {n:'ELDER',hat:'pointed',beard:2,orb:1,C:{hat:'#3a1a5a',hatL:'#5a3a8a',robe:'#4a2a7a',robeS:'#30184e'}},
 {n:'MASTER WIZARD',hat:'pointed',beard:2,orb:1,C:{}}];
function buildWiz(stage){return buildHero(WIZEVO[stage],stage>=9);}
// generic hero sheet: robe body + a hat style + a weapon. Used by every character class and evolution stage.
// back=true draws the same pose seen from behind (walking away from the camera): no face, back of the head/hood
function buildHero(EV,star,back){const stage=star?9:0;
 const FW=20,FH=24,N=12,C=Object.assign({o:'#14101a',hat:'#2e3a8a',hatL:'#4656b4',band:'#e8c050',skin:'#e0b080',beard:'#eceef6',beardS:'#b8bccc',robe:'#5a2e9a',robeS:'#3e1e70',trim:'#e8c050',staff:'#8a5a2a',staffL:'#b07a40',orb:'#ff8a30',orbL:'#ffe080',boot:'#2a2236'},EV.C);
 const sheet=mk(FW*N,FH,()=>{}),sg=sheet.getContext('2d');
 for(let f=0;f<N;f++){
  const fr=mk(FW,FH,g=>{
   const R=(x,y,w,h,c)=>{g.fillStyle=C[c]||c;g.fillRect(x,y,w,h);};
   const walk=f>=2&&f<=5,bob=(f===1||f===3||f===5)?1:0,lean=f===11?2:0,up=(f===8||f===9||f===10);
   // staff placement per pose
   let sx=15,sy=5,horiz=false;if(f===6){sx=4;sy=7;}if(f===7){sx=17;sy=5;}if(up){sx=15;sy=1;}if(f===10){sx=10;sy=0;}if(f===11)horiz=true;
   // boots
   if(walk){const o=[[6,13],[7,12],[8,11],[7,12]][f-2];R(o[0],22,3,2,'boot');R(o[1]-1,22,3,2,'boot');}
   else if(f===11){R(4,21,3,2,'boot');R(9,22,3,2,'boot');}
   else{R(7,22,3,2,'boot');R(11,22,3,2,'boot');}
   // robe: a flared cone with gold hem
   for(let y=13;y<=21;y++){const hw=Math.round(3+(y-13)*.45),x0=10-hw-lean*(y>17?1:0);R(x0,y+bob*(y<18?1:0),hw*2+(lean&&y>17?1:0),1,'robe');R(x0,y+bob*(y<18?1:0),1,1,'robeS');}
   R(6,21,9,1,'trim');if(!back){R(10,14+bob,1,7,'robeS');R(8,13+bob,5,1,'trim');}else{R(8,13+bob,5,1,'robeS');R(7,16+bob,7,1,'robeS');}
   if(f===11){R(2,18,3,2,'robe');R(1,20,3,1,'robeS');} // trailing robe while dashing
   // staff
   const WP=EV.wpn||'staff';
   if(WP!=='staff'){ // weapons drawn as a line from the hand at a per-pose angle
    const hand=f===6?[5,14]:f===7?[16,15]:up?[15,9]:f===11?[15,14]:[sx,16],ang=f===6?-2.4:f===7?-.15:up?-1.57:f===11?0:-1.1,L=(x,y,len,a,c)=>{for(let i=0;i<len;i++)R(Math.round(x+Math.cos(a)*i),Math.round(y+Math.sin(a)*i),1,1,c);};
    const [hx0,hy0]=hand;
    if(WP==='katana'||WP==='bokken'){L(hx0,hy0,3,ang+Math.PI,'#3a2a2a');L(hx0,hy0,11,ang,WP==='bokken'?'#a07a48':'#e8eef6');R(hx0,hy0,1,1,EV.C.trim||'#e0b040');if(WP==='katana')L(hx0+Math.round(Math.cos(ang+1.57)),hy0+Math.round(Math.sin(ang+1.57)),9,ang,'#a8b0c0');}
    else if(WP==='bow'){const ba=f===7?0:-.2;for(let j=-6;j<=6;j++)R(Math.round(hx0+1+Math.cos(ba)*2*Math.cos(j/6*1.3)),hy0+j,1,1,'#7a4a22');R(hx0,hy0-6,1,13,'#e8e8f0');if(f===7||f===6)L(hx0-5,hy0,7,0,'#d8c8a0');}
    else if(WP==='kunai'){L(hx0,hy0,4,ang,'#d0d8e0');R(hx0,hy0,1,1,'#c02030');R(4,15,2,1,'#d0d8e0');}
    else if(WP==='gohei'){L(hx0,hy0,9,ang,'#c8a060');const tx=Math.round(hx0+Math.cos(ang)*8),ty=Math.round(hy0+Math.sin(ang)*8);R(tx,ty,1,1,'#fff');R(tx-1,ty+1,2,1,'#fff');R(tx,ty+2,2,1,'#fff');R(tx-1,ty+3,2,1,'#fff');R(tx+1,ty+1,1,1,'#e03040');}}
   else if(horiz){R(3,15,15,1,'staff');R(3,14,1,1,'staffL');R(17,13,3,3,'orb');R(17,13,1,1,'orbL');}
   else{R(sx,sy+3,1,22-sy-3,'staff');R(sx,sy+3,1,2,'staffL');if(EV.orb){R(sx-1,sy,3,3,'orb');R(sx-1,sy,1,1,'orbL');}else{R(sx,sy+1,1,2,'orb');}if(EV.orb&&(f===7||up)){R(sx-2,sy+1,1,1,'orbL');R(sx+2,sy+1,1,1,'orbL');R(sx,sy-2,1,1,'orbL');}}
   // sleeves / hands
   const by=bob;
   if(up){R(5,9+by,3,4,'robe');R(5,8+by,2,1,'skin');R(13,9+by,3,4,'robe');R(14,8+by,2,1,'skin');R(5,12+by,3,1,'trim');R(13,12+by,3,1,'trim');}
   else if(f===7){R(12,14+by,5,3,'robe');R(16,14+by,1,2,'skin');R(12,16+by,5,1,'trim');}
   else if(f===6){R(11,15+by,3,4,'robe');R(12,15+by,1,2,'skin');}
   else if(f===11){R(12,14,4,2,'robe');R(15,14,1,1,'skin');}
   else{R(12,14+by,3,4,'robe');R(sx-1,16+by,2,2,'skin');R(12,17+by,3,1,'trim');R(6,14+by,2,5,'robeS');}
   // head: face, eye and a long white beard
   const hy=bob+(f===11?1:0),hx=lean;
   if(back){ // back of the head: hair (white for the old masters), or the cloth of a hood/mask
    const hc=EV.hat==='hood'||EV.hat==='mask'?'hat':EV.beard?'beard':'#2a2228';R(8+hx,10+hy,5,4,hc);R(8+hx,13+hy,5,1,EV.hat==='hood'||EV.hat==='mask'?'hatL':'#3a3038');
    if(EV.beard===2){R(9+hx,14+hy,3,2,'beard');}}
   else{R(8+hx,10+hy,5,EV.beard?3:4,'skin');R(11+hx,11+hy,1,1,'o');if(!EV.beard)R(10+hx,13+hy,2,1,'#c08060');}
   if(!back&&EV.beard===1){R(8+hx,12+hy,5,2,'beard');R(9+hx,14+hy,3,1,'beard');R(8+hx,13+hy,1,1,'beardS');}
   if(!back&&EV.beard===2){R(8+hx,12+hy,5,2,'beard');R(9+hx,14+hy,4,2,'beard');R(10+hx,16+hy,2,1,'beard');R(8+hx,13+hy,1,1,'beardS');}
   // pointed hat with a bent tip, gold band and star
   const tx=f===11?-3:f===10?1:0;
   if(EV.hat==='hood'){R(7+hx,8+hy,7,2,'hat');R(6+hx,9+hy,2,6,'hat');R(13+hx,9+hy,1,4,'hat');R(5+hx-(tx<0?2:0),10+hy,2,3,'hat');R(8+hx,8+hy,3,1,'hatL');}
   else if(EV.hat==='kasa'){R(3+hx,9+hy,15,1,'hat');R(5+hx,8+hy,11,1,'hat');R(7+hx,7+hy,7,1,'hatL');R(9+hx,6+hy,3,1,'hatL');R(4+hx,9+hy,2,1,'hatL');}
   else if(EV.hat==='kabuto'){R(6+hx,7+hy,9,3,'hat');R(5+hx,9+hy,2,4,'hat');R(14+hx,9+hy,1,4,'hat');R(7+hx,6+hy,7,1,'hatL');R(7+hx,9+hy,7,1,'band');if(EV.crest){R(8+hx,3+hy,1,4,'band');R(12+hx,3+hy,1,4,'band');R(9+hx,5+hy,3,1,'band');}}
   else if(EV.hat==='mask'){R(7+hx,8+hy,7,3,'hat');R(6+hx,9+hy,2,6,'hat');R(13+hx,9+hy,1,5,'hat');R(8+hx,12+hy,5,2,'hat');if(back){R(8+hx,11+hy,5,1,'hat');R(9+hx,11+hy,3,1,'band');}else{R(8+hx,11+hy,5,1,'skin');R(11+hx,11+hy,1,1,'o');}R(4+hx-(f===11?3:0),11+hy+(f===11?0:1),3,1,'band');R(3+hx-(f===11?4:0),12+hy+(f===11?0:1),2,1,'band');}
   else if(EV.hat==='eboshi'){R(8+hx,3+hy,5,7,'hat');R(9+hx,1+hy,4,2,'hat');R(8+hx,4+hy,1,5,'hatL');R(7+hx,9+hy,7,1,'band');}
   else if(EV.hat==='cap'){R(6+hx,9+hy,9,1,'hat');R(7+hx,8+hy,7,1,'band');R(7+hx,6+hy,7,2,'hat');R(8+hx,5+hy,5,1,'hat');R(10+hx+Math.round(tx/2),4+hy,3,1,'hatL');R(8+hx,6+hy,1,2,'hatL');}
   else{R(5+hx,9+hy,11,1,'hat');R(6+hx,8+hy,9,1,'hat');R(7+hx,7+hy,7,1,'band');
   R(7+hx,5+hy,6,2,'hat');R(8+hx,3+hy,4,2,'hat');R(9+hx+Math.round(tx/3),2+hy,3,1,'hat');R(10+hx+Math.round(tx/2),1+hy,2,1,'hat');R(12+hx+tx,0+hy,2,1,'hatL');
   R(8+hx,5+hy,1,2,'hatL');R(9+hx,3+hy,1,2,'hatL');if(stage>=9)R(11+hx,5+hy,1,1,'band');}
  });
  // 1px dark outline around everything
  const d=fr.getContext('2d').getImageData(0,0,FW,FH),o=mk(FW,FH,()=>{}),og=o.getContext('2d');og.fillStyle=C.o;
  for(let y=0;y<FH;y++)for(let x=0;x<FW;x++){if(d.data[(y*FW+x)*4+3])continue;let n=false;for(const [ax,ay] of [[1,0],[-1,0],[0,1],[0,-1]]){const X=x+ax,Y=y+ay;if(X>=0&&Y>=0&&X<FW&&Y<FH&&d.data[(Y*FW+X)*4+3]){n=true;break;}}if(n)og.fillRect(x,y,1,1);}
  sg.drawImage(o,f*FW,0);sg.drawImage(fr,f*FW,0);
 }
 return {c:sheet,wc:whiteOf(sheet),fw:FW,fh:FH,frames:N,sc:1,ok:true};
}
const WIZSPR=WIZEVO.map((_,i)=>buildWiz(i));
// power from everything you've picked up this run; the wizard evolves at each threshold
// one evolution after every boss
function evolve(){const st=Math.min(WIZEVO.length-1,(P.evo||0)+1);if(st===(P.evo||0))return;P.evo=st;P.evoT=1.2;P.hp=Math.min(S.maxhp,P.hp+S.maxhp*.25);
 impact(P.x,P.y,'#ffe060',8,true);fxRing(P.x,P.y,40,'#ffe060',.6);fxRing(P.x,P.y,24,'#fff',.4);spark(P.x,P.y,'#fff',30,120);sfx('rare');txtFx(P.x,P.y-6,'EVOLVED: '+WIZEVO[st].n,'#ffe060',2);}
// ---- the travelling merchant: 26x32, 2 frames (breathing, lantern sway) ----
const MERCH=(()=>{const FW=28,FH=34,sheet=mk(FW*2,FH,()=>{}),sg=sheet.getContext('2d');
 for(let f=0;f<2;f++){const fr=mk(FW,FH,g=>{const R=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h);};const b=f;
  // backpack frame stacked with goods
  R(2,6,8,22,'#6a4a2a');R(2,6,8,1,'#8a6a3a');R(3,8,6,5,'#c8a060');R(4,9,4,1,'#8a6a3a');R(3,14,3,4,'#3a6aa0');R(6,14,3,4,'#a03030');R(3,19,6,3,'#e8dcc0');R(4,20,4,1,'#a08060');R(2,23,8,1,'#5a3a1a');R(5,3,2,4,'#c8a060');R(4,2,4,1,'#e04030');
  // body: apron over a green kimono
  R(9,15+b,12,13,'#3e6a4a');R(9,15+b,2,13,'#2e5038');R(11,18+b,8,10,'#d8ccb0');R(11,18+b,8,1,'#b8a888');R(14,21+b,2,2,'#e0b040');
  R(10,28,4,4,'#2a2a30');R(16,28,4,4,'#2a2a30');R(9,31,5,2,'#14101a');R(16,31,5,2,'#14101a');
  // arms; one holds a lantern that sways
  R(20,17+b,3,6,'#3e6a4a');R(20,22+b,3,2,'#e0b080');const lx=22+(f?1:0);R(lx,24+b,1,2,'#3a3a3a');R(lx-2,26+b,5,5,'#c02818');R(lx-1,27+b,3,3,'#ffd060');R(lx-2,26+b,5,1,'#3a3a3a');R(lx-2,30+b,5,1,'#3a3a3a');
  R(8,17+b,2,6,'#3e6a4a');R(8,22+b,2,2,'#e0b080');
  // head: round face, moustache, little smile
  R(11,8+b,8,8,'#e0b080');R(12,11+b,1,1,'#14101a');R(17,11+b,1,1,'#14101a');R(12,13+b,6,1,'#5a3a22');R(11,13+b,1,2,'#5a3a22');R(18,13+b,1,2,'#5a3a22');R(14,14+b,2,1,'#c06050');R(10,11+b,1,2,'#e0b080');R(19,11+b,1,2,'#e0b080');
  // big straw hat
  for(let i=0;i<5;i++)R(15-2-i*2,4+i+b,5+i*4,1,i%2?'#c8a050':'#d8b860');R(5,9+b,20,1,'#a88438');R(13,3+b,4,1,'#e0c070');R(9,8+b,12,1,'#8a2a20');
 });sg.drawImage(outlined(fr),f*FW,0);}
 return {c:sheet,wc:whiteOf(sheet),fw:FW,fh:FH,frames:2,sc:1,ok:true};})();
// ---- loot bags: 0 burlap sack, 1 velvet pouch, 2 royal gold bag (bigger, jewelled) ----
const BAGSPR=(()=>{
 const PAL=[
  {w:12,h:13,b:'#a0763e',l:'#c8995a',d:'#6e4e26',t:'#e0c890',t2:'#8a6a3a'},
  {w:12,h:13,b:'#3e8a3a',l:'#6aba5a',d:'#24561e',t:'#a07a48',t2:'#5a3a1a'},
  {w:12,h:14,b:'#2e6ac8',l:'#6aa8f0',d:'#1a3e80',t:'#d8dce4',t2:'#8a92a0'},
  {w:12,h:14,b:'#7a34c0',l:'#a668ea',d:'#4a1c80',t:'#f0c848',t2:'#a07820'},
  {w:16,h:18,b:'#f0b828',l:'#fff0a0',d:'#b07810',t:'#d02838',t2:'#801020'},
  // new good bags: enchanter pouch (teal), scholar case (crimson), war chest (silver)
  {w:13,h:14,b:'#1a9a8a',l:'#5ad8c8',d:'#0e5a52',t:'#e0f0ff',t2:'#80a0b0'},
  {w:13,h:14,b:'#a82030',l:'#e05060',d:'#601018',t:'#f0e0b0',t2:'#c89a50'},
  {w:14,h:15,b:'#9aa4b4',l:'#e0e8f4',d:'#5a6474',t:'#ffd040',t2:'#a07820'},
  // more good bags: shogun trophy (boss, red-gold), jade casket (green), monk's bundle (saffron), assassin kit (violet)
  {w:15,h:16,b:'#a82020',l:'#e05040',d:'#601010',t:'#ffd040',t2:'#a07820'},
  {w:12,h:13,b:'#2e8a5a',l:'#6ad89a',d:'#185a38',t:'#e0f0e0',t2:'#80a090'},
  {w:12,h:13,b:'#d89030',l:'#f8c060',d:'#8a5a18',t:'#a02020',t2:'#601010'},
  {w:12,h:13,b:'#3a2a5a',l:'#6a4a9a',d:'#1a1030',t:'#c02040',t2:'#601020'}];
 const out=PAL.map((p,tier)=>{
  const W2=p.w+2,H2=p.h+2,fr=mk(W2,H2,g=>{
   const R=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x+1,y+1,w,h);};
   const cx=p.w/2,top=4,bt=p.h-1,ry=(bt-top)/2,cy=top+ry,rx=p.w/2-.8;
   // body: an ellipse that sags wider toward the bottom, flat base
   for(let y=top;y<=bt;y++){const dy=(y+.5-cy)/ry,k=dy>0?dy*.55:dy,hw=Math.max(2,Math.round(rx*Math.sqrt(Math.max(0,1-k*k)))),x0=Math.round(cx-hw);
    R(x0,y,hw*2,1,p.b);R(x0,y,1,1,p.l);R(x0+hw*2-2,y,2,1,p.d);if(y===bt)R(x0,y,hw*2,1,p.d);}
   R(Math.round(cx-rx*.55),top+2,2,3,p.l);R(Math.round(cx-rx*.55)+2,top+2,1,1,p.l);
   // gathered neck, ruffled top and the tie
   R(cx-2,2,4,2,p.b);R(cx+1,2,1,2,p.d);R(cx-3,0,6,2,p.b);R(cx-3,0,1,1,p.l);R(cx-1,0,1,1,p.d);R(cx+1,0,1,1,p.d);R(cx+2,1,1,1,p.d);
   R(cx-3,3,6,1,p.t);R(cx-3,3,1,1,p.t2);R(cx+2,4,1,2,p.t);R(cx+3,5,1,1,p.t2);
   const dk=[0,0,1,1,2,1,1,2,2,1,0,1][tier];
   if(dk===0){ // stitched patch and coarse weave
    R(cx+1,bt-5,3,3,p.t2);R(cx+1,bt-5,1,1,p.l);R(cx+3,bt-3,1,1,p.l);
    for(let i=0;i<7;i++)R(Math.round(cx-3+((i*5)%7)),top+3+((i*3)%(bt-top-3)),1,1,p.d);}
   else if(dk===1){ // star clasp and stitching
    R(cx-1,cy,3,1,p.t);R(cx,cy-1,1,3,p.t);R(cx,cy,1,1,'#fff');
    for(let x=Math.round(cx-rx)+2;x<cx+rx-2;x+=2)R(x,bt-2,1,1,'#d0c8e8');}
   else{ // crimson cord with tassels, embroidered hem, ruby centre and side gems
    R(cx+3,4,1,4,p.t);R(cx+3,8,1,1,p.t2);R(cx-4,4,1,3,p.t);R(cx-4,7,1,1,p.t2);
    R(2,bt-3,p.w-4,1,p.t);R(2,bt-2,p.w-4,1,p.d);for(let x=3;x<p.w-3;x+=2)R(x,bt-3,1,1,p.l);
    R(cx-1,cy-2,2,1,p.t);R(cx-2,cy-1,4,2,p.t);R(cx-1,cy+1,2,1,p.t2);R(cx-1,cy-1,1,1,'#ffd0d8');R(cx+1,cy,1,1,p.t2);
    R(cx-3,cy-3,1,1,p.l);R(cx+2,cy-3,1,1,p.l);R(cx-4,cy,1,1,p.l);R(cx+3,cy,1,1,p.l);R(cx-3,cy+3,1,1,p.l);R(cx+2,cy+3,1,1,p.l);
    R(3,cy,2,2,'#3a8cf0');R(3,cy,1,1,'#bfe6ff');R(p.w-5,cy,2,2,'#30c060');R(p.w-5,cy,1,1,'#c0ffd0');}
  });
  const d=fr.getContext('2d').getImageData(0,0,W2,H2),c=mk(W2,H2,g=>{g.fillStyle='#14101a';
   for(let y=0;y<H2;y++)for(let x=0;x<W2;x++){if(d.data[(y*W2+x)*4+3])continue;for(const [ax,ay] of [[1,0],[-1,0],[0,1],[0,-1]]){const X=x+ax,Y=y+ay;if(X>=0&&Y>=0&&X<W2&&Y<H2&&d.data[(Y*W2+X)*4+3]){g.fillRect(x,y,1,1);break;}}}
   g.drawImage(fr,0,0);});
  return {c,wc:whiteOf(c),w:W2,h:H2};
 });
 // the royal (legendary) bag is hand-pixelled: clean gold sack, red drawstring, one red gem
 const ROW=['......LGGD......','.....LGGGGD.....','......DGGD......','.....RRRRRr.....','......DGGD.Rr...','.....LGGGGD.R...','....LGGGGGGD.r..','...LGGGGGGGGD...',
  '..LGGGGRGGGGGD..','..LGGGWRRGGGGD..','.LGGGRRRRrGGGGD.','.LGGGGRRrGGGGGD.','.LGGGGGrGGGGGGD.','.LGGGGGGGGGGGGD.','.LLGGGGGGGGGGDD.','..DGGGGGGGGGDD..','...DDDDDDDDDD...','................'];
 // white silk with golden-yellow cord and gem
 const RC={G:'#f4f0e6',L:'#ffffff',D:'#c8c0ae',R:'#ffd040',r:'#c8901c',W:'#fffbe0'};
 const fr=mk(18,20,g=>ROW.forEach((row,y)=>{for(let x=0;x<row.length;x++){const c=RC[row[x]];if(c){g.fillStyle=c;g.fillRect(x+1,y+1,1,1);}}})),oc=outlined(fr);
 out[4]={c:oc,wc:whiteOf(oc),w:18,h:20};
 return out;
})();
// ---- set dressing: code-drawn plants and props per environment, depth-sorted with everything else ----
function outlined(fr){const W2=fr.width,H2=fr.height,d=fr.getContext('2d').getImageData(0,0,W2,H2);return mk(W2,H2,g=>{g.fillStyle='#14101a';
 for(let y=0;y<H2;y++)for(let x=0;x<W2;x++){if(d.data[(y*W2+x)*4+3])continue;for(const [ax,ay] of [[1,0],[-1,0],[0,1],[0,-1]]){const X=x+ax,Y=y+ay;if(X>=0&&Y>=0&&X<W2&&Y<H2&&d.data[(Y*W2+X)*4+3]){g.fillRect(x,y,1,1);break;}}}g.drawImage(fr,0,0);});}
const DECOSPR={};
function defDeco(k,w,h,fn,o){const fr=mk(w+2,h+2,g=>{const R=(x,y,ww,hh,c)=>{g.fillStyle=c;g.fillRect(x+1,y+1,ww,hh);};fn(R,w,h);});DECOSPR[k]=Object.assign({c:outlined(fr),w:w+2,h:h+2},o||{});}
(()=>{
 const blob=(R,cx,cy,rx,ry,c)=>{for(let y=-ry;y<=ry;y++){const hw=Math.round(rx*Math.sqrt(1-(y/ry)**2));R(cx-hw,cy+y,hw*2+1,1,c);}};
 defDeco('bush',14,9,(R)=>{blob(R,7,5,6,4,'#2e6a2a');blob(R,6,4,4,3,'#3e8a36');R(3,3,2,1,'#5aaa4a');R(9,2,2,1,'#5aaa4a');R(4,6,1,1,'#f4d040');R(10,5,1,1,'#f06080');R(7,7,1,1,'#f4d040');},{big:0});
 defDeco('tallgrass',9,10,(R)=>{const c=['#3a7a2a','#4e9a3a','#2e5a22'];for(let i=0;i<5;i++){const x=1+i*2,h=5+((i*7)%5);R(x,10-h,1,h,c[i%3]);R(x+(i%2?1:-1),10-h-1,1,1,c[(i+1)%3]);}},{big:0});
 defDeco('bamboo',7,30,(R)=>{for(const [x,h,c] of [[1,30,'#5a9a3a'],[4,24,'#4a8a2e']]){R(x,30-h,2,h,c);R(x,30-h,1,h,'#7aba5a');for(let y=30-h+3;y<30;y+=6)R(x,y,2,1,'#2e5a1a');}R(0,4,3,1,'#6aaa4a');R(5,9,2,1,'#6aaa4a');R(3,2,2,1,'#6aaa4a');},{big:1});
 defDeco('lantern',9,16,(R)=>{R(1,14,7,2,'#6a6a72');R(3,8,3,6,'#7a7a84');R(0,6,9,2,'#5a5a64');R(2,3,5,3,'#7a7a84');R(3,4,3,2,'#ffd070');R(1,1,7,2,'#5a5a64');R(4,0,1,1,'#5a5a64');},{big:1,glow:{c:'#ffb040',y:-11,r:7}});
 defDeco('rock',10,6,(R)=>{blob(R,5,3,4,2,'#6a6a70');R(2,2,3,1,'#8a8a92');R(6,4,3,1,'#4a4a52');},{big:0});
 defDeco('pine',17,28,(R)=>{R(7,24,3,4,'#5a3a22');for(let t=0;t<3;t++){const y=4+t*7,hw=3+t*2;for(let j=0;j<8;j++){const w2=Math.round(hw*(j/7));R(8-w2,y+j,w2*2+1,1,'#1e4a32');}R(8-hw,y+7,hw*2+1,1,'#f0f6ff');R(8-Math.round(hw*.5),y+3,3,1,'#e0ecf8');}R(7,0,3,5,'#1e4a32');R(7,0,3,1,'#fff');},{big:1});
 defDeco('maple',21,26,(R)=>{R(9,16,3,10,'#5a3420');R(7,23,2,3,'#5a3420');R(12,22,2,4,'#4a2a18');blob(R,10,9,9,7,'#b02818');blob(R,7,7,5,4,'#d84020');blob(R,14,10,5,4,'#e86030');R(5,5,2,1,'#f8a050');R(13,6,2,1,'#f8a050');R(9,12,1,1,'#f8c060');},{big:1});
 defDeco('deadtree',16,26,(R)=>{R(7,6,3,20,'#4a3e34');R(7,6,1,20,'#6a5a4a');R(3,10,4,1,'#4a3e34');R(2,8,1,3,'#4a3e34');R(10,4,4,1,'#4a3e34');R(13,1,1,4,'#4a3e34');R(9,14,5,1,'#4a3e34');R(14,12,1,3,'#4a3e34');R(7,2,1,4,'#4a3e34');R(5,24,7,2,'#3a2e24');},{big:1});
 defDeco('reeds',11,15,(R)=>{for(let i=0;i<5;i++){const x=1+i*2,h=9+((i*5)%5);R(x,15-h,1,h,'#5a7a3a');if(i%2===0){R(x,15-h-3,1,3,'#6a3a1a');R(x,15-h-4,1,1,'#8a5a2a');}}R(0,13,3,1,'#4a6a2a');R(8,12,3,1,'#4a6a2a');},{big:0});
 defDeco('mushroom',13,14,(R)=>{R(5,7,3,7,'#e0d0b8');R(5,7,1,7,'#fff');blob(R,6,5,6,4,'#8a2ab0');R(1,6,11,1,'#5a1a7a');R(3,3,2,1,'#f0c0ff');R(8,2,2,2,'#f0c0ff');R(5,5,1,1,'#f0c0ff');},{big:0,glow:{c:'#c060ff',y:-8,r:6,dim:1}});
 defDeco('crystal',11,15,(R)=>{const sh=(x,h,w,c,l)=>{for(let j=0;j<h;j++){const ww=Math.max(1,Math.round(w*Math.min(1,(j+1)/3)));R(x-(ww>>1),15-h+j,ww,1,c);}R(x,15-h+1,1,h-2,l);};sh(5,14,3,'#6a3aa8','#d0a0ff');sh(2,8,2,'#4a2a88','#a080e0');sh(8,10,2,'#5a30a0','#c090ff');},{big:0,glow:{c:'#b070ff',y:-8,r:9}});
 defDeco('stalag',9,14,(R)=>{for(let j=0;j<14;j++){const w=Math.max(1,Math.round(j*.55));R(4-(w>>1),j,w,1,j%4===0?'#4a4048':'#5e5460');}R(3,4,1,6,'#7a7080');},{big:1});
 defDeco('pillar',11,22,(R)=>{R(0,19,11,3,'#5a5a64');R(1,4,9,15,'#7a7a86');R(1,4,2,15,'#9a9aa6');R(8,4,2,15,'#5e5e6a');R(1,3,3,1,'#7a7a86');R(5,2,2,2,'#7a7a86');R(8,4,2,1,'#14101a');R(4,8,1,6,'#5e5e6a');},{big:1});
 defDeco('column',11,32,(R)=>{R(0,29,11,3,'#c8d0dc');R(0,0,11,3,'#c8d0dc');R(1,3,9,26,'#e8eef6');for(let x=2;x<9;x+=2)R(x,4,1,24,'#b8c2d0');R(0,2,11,1,'#a0aab8');R(0,29,11,1,'#a0aab8');},{big:1});
 defDeco('urn',9,13,(R)=>{blob(R,4,9,4,3,'#c8d0dc');R(2,6,5,1,'#a0aab8');R(3,5,3,1,'#c8d0dc');blob(R,4,3,3,2,'#3e8a36');R(2,1,1,1,'#f06080');R(6,2,1,1,'#f4d040');},{big:0});
 defDeco('statue',11,22,(R)=>{R(1,18,9,4,'#a0aab8');R(2,9,7,9,'#c8d0dc');R(3,4,5,5,'#c8d0dc');R(2,2,2,3,'#c8d0dc');R(7,2,2,3,'#c8d0dc');R(4,6,1,1,'#5a6a80');R(6,6,1,1,'#5a6a80');R(8,10,3,3,'#c8d0dc');R(2,9,1,9,'#e8eef6');},{big:1});
 defDeco('barrel',8,10,(R)=>{R(0,1,8,9,'#8a5a2a');R(0,1,2,9,'#a8743a');R(0,3,8,1,'#4a4a52');R(0,7,8,1,'#4a4a52');R(1,0,6,1,'#6a4220');},{big:0});
 defDeco('crate',10,9,(R)=>{R(0,0,10,9,'#a07038');R(0,0,10,1,'#c8904a');R(0,0,1,9,'#6a4820');R(9,0,1,9,'#6a4820');R(0,8,10,1,'#6a4820');R(1,1,1,1,'#6a4820');R(2,2,1,1,'#6a4820');R(3,3,4,3,'#8a5e2e');R(7,6,1,1,'#6a4820');R(8,7,1,1,'#6a4820');},{big:0});
 defDeco('plantern',7,22,(R)=>{R(3,0,1,22,'#3a2a1a');R(1,1,5,1,'#3a2a1a');R(0,3,7,8,'#d02a20');R(0,3,7,1,'#1a1010');R(0,10,7,1,'#1a1010');R(1,5,1,4,'#f06040');R(3,4,1,6,'#a01a10');},{big:1,glow:{c:'#ff5030',y:-15,r:8}});
 defDeco('brazier',11,12,(R)=>{R(4,6,3,6,'#3a3a42');R(2,11,7,1,'#3a3a42');R(0,3,11,3,'#5a5a64');R(1,6,9,1,'#3a3a42');R(1,2,9,1,'#ff8a30');},{big:0,fire:{y:-11,s:3},glow:{c:'#ff8a30',y:-12,r:10}});
 defDeco('torch',5,15,(R)=>{R(2,4,1,11,'#5a3a22');R(1,3,3,2,'#3a3a42');},{big:0,fire:{y:-15,s:2},glow:{c:'#ffa040',y:-15,r:8}});
 defDeco('charred',16,24,(R)=>{R(7,6,3,18,'#2a2220');R(7,6,1,18,'#4a3a30');R(3,10,4,1,'#2a2220');R(2,8,1,3,'#2a2220');R(10,4,4,1,'#2a2220');R(13,1,1,4,'#2a2220');R(8,12,1,1,'#ff8a30');R(9,18,1,1,'#ff6020');R(3,9,1,1,'#ff6020');},{big:1});
 defDeco('vent',12,4,(R)=>{R(0,1,12,3,'#2a1a14');R(2,2,8,1,'#ff6020');R(4,1,3,1,'#ffb040');},{big:0,flat:1,smoke:'#ff8a30',glow:{c:'#ff5010',y:-2,r:7}});
 defDeco('bones',12,6,(R)=>{R(0,4,8,1,'#d8d0c0');R(0,3,1,3,'#d8d0c0');R(7,3,1,3,'#d8d0c0');R(5,0,5,4,'#e8e0d0');R(6,1,1,1,'#14101a');R(8,1,1,1,'#14101a');R(6,3,3,1,'#14101a');R(9,5,3,1,'#c8c0b0');},{big:0});
 defDeco('spikes',11,8,(R)=>{R(0,7,11,1,'#3a3a42');for(let i=0;i<4;i++){const x=1+i*3;R(x,1,1,6,'#8a8a96');R(x,0,1,1,'#e8e8f0');R(x,4,1,3,'#8a1020');}},{big:0});
 defDeco('banner',8,26,(R)=>{R(1,0,1,26,'#3a2a1a');R(0,1,8,1,'#3a2a1a');R(2,2,6,14,'#8a1020');R(2,2,6,1,'#e0b040');R(4,6,2,4,'#e0b040');R(2,16,2,2,'#8a1020');R(6,16,2,2,'#8a1020');},{big:1});
 defDeco('candles',9,8,(R)=>{R(0,4,2,4,'#a01020');R(3,2,2,6,'#c01828');R(6,5,2,3,'#a01020');R(0,7,9,1,'#5a0a14');},{big:0,flames:[[1,-9],[4,-11],[7,-8]],glow:{c:'#ff6040',y:-8,r:7}});
 defDeco('iceshard',9,13,(R)=>{const sh=(x,h,w)=>{for(let j=0;j<h;j++){const ww=Math.max(1,Math.round(w*Math.min(1,(j+1)/3)));R(x-(ww>>1),13-h+j,ww,1,'#a8d0f0');}R(x,13-h+1,1,h-2,'#ffffff');};sh(4,12,3);sh(1,6,2);sh(7,8,2);},{big:0,glow:{c:'#bfe6ff',y:-6,r:5,dim:1}});
 defDeco('lily',10,4,(R)=>{blob(R,5,2,4,1,'#3e8a36');R(4,1,2,1,'#f0a0c0');R(5,0,1,1,'#fff');},{big:0,flat:1});
 // ---- East Asian set pieces ----
 defDeco('sakura',21,26,(R)=>{R(9,16,3,10,'#4a2a20');R(9,16,1,10,'#6a4030');R(7,23,2,3,'#4a2a20');R(12,21,2,5,'#3a2018');R(6,14,3,1,'#4a2a20');R(12,13,4,1,'#4a2a20');
  blob(R,10,9,9,7,'#e888aa');blob(R,7,7,5,4,'#f8b0c8');blob(R,14,10,5,4,'#f4a0c0');blob(R,11,5,4,3,'#fcc8d8');
  for(const [x,y] of [[4,6],[8,3],[13,4],[16,8],[6,11],[11,12],[15,13],[3,10]])R(x,y,1,1,'#fde8f0');for(const [x,y] of [[5,12],[12,14],[17,11],[9,8]])R(x,y,1,1,'#c06088');},{big:1});
 defDeco('torii',24,26,(R)=>{for(const x of [4,17]){R(x,6,3,18,'#c02818');R(x,6,1,18,'#e85038');R(x-1,23,5,3,'#1a1414');}
  R(1,1,22,2,'#1a1414');R(0,0,2,2,'#1a1414');R(22,0,2,2,'#1a1414');R(2,3,20,1,'#c02818');R(2,8,20,2,'#c02818');R(2,8,20,1,'#e85038');R(11,3,2,5,'#1a1414');R(11,4,2,2,'#e0b040');},{big:1});
 defDeco('pagoda',19,36,(R)=>{R(2,33,15,3,'#5a5a62');R(2,33,15,1,'#7a7a82');R(9,0,1,7,'#e0b040');R(8,2,3,1,'#e0b040');R(8,4,3,1,'#e0b040');
  [[6,2],[13,3],[20,4],[27,5]].forEach(([y,hw])=>{const wl=Math.max(1,hw-1);R(9-wl,y+1,wl*2+1,6,'#a02418');R(9-wl,y+1,1,6,'#c84030');R(9,y+3,1,2,'#ffd070');
   R(9-hw-2,y,hw*2+5,2,'#2a3238');R(9-hw-1,y,hw*2+3,1,'#4a5a62');R(9-hw-3,y-1,1,1,'#2a3238');R(9+hw+3,y-1,1,1,'#2a3238');});},{big:1,glow:{c:'#ffc060',y:-14,r:6,dim:1}});
 defDeco('jizo',9,13,(R)=>{R(1,10,7,3,'#5a5a62');R(2,5,5,6,'#8a8a92');R(2,5,1,6,'#a2a2aa');R(3,1,3,4,'#9a9aa2');R(3,1,1,4,'#b4b4bc');R(2,5,5,3,'#c02818');R(3,8,3,1,'#c02818');R(2,5,5,1,'#e04030');R(3,3,1,1,'#5a5a62');R(5,3,1,1,'#5a5a62');R(4,11,1,1,'#3e8a36');},{big:0});
 defDeco('komainu',11,14,(R)=>{R(0,11,11,3,'#6a6a72');R(0,11,11,1,'#8a8a92');R(2,6,6,5,'#a8a8b0');R(2,6,1,5,'#c4c4cc');R(5,1,5,6,'#b8b8c0');R(4,1,2,6,'#7e7e86');R(4,2,1,4,'#6a6a72');R(7,3,1,1,'#2a2a32');R(8,5,2,1,'#2a2a32');R(1,4,2,2,'#7e7e86');R(0,3,1,1,'#7e7e86');R(9,6,1,1,'#3e8a5a');},{big:0});
 defDeco('rpillar',9,30,(R)=>{R(0,27,9,3,'#2a2a30');R(1,3,7,24,'#b02018');R(1,3,2,24,'#d84030');R(6,3,2,24,'#801410');R(1,6,7,1,'#e0b040');R(1,24,7,1,'#e0b040');R(0,0,9,3,'#2a2a30');R(0,2,9,1,'#e0b040');},{big:1});
 defDeco('taru',10,11,(R)=>{R(1,0,8,2,'#8a5a2a');R(0,2,10,9,'#c8b088');R(0,2,2,9,'#e0c8a0');R(8,2,2,9,'#a89068');R(0,3,10,1,'#6a4a2a');R(0,9,10,1,'#6a4a2a');R(3,5,4,3,'#c02818');R(4,6,2,1,'#fff');},{big:0});
 defDeco('ricebale',12,8,(R)=>{blob(R,6,4,5,3,'#c8b070');blob(R,5,3,3,2,'#e0c888');R(3,1,1,7,'#7a5a2a');R(8,1,1,7,'#7a5a2a');R(0,4,1,1,'#a89050');R(11,4,1,1,'#a89050');},{big:0});
 defDeco('taiko',12,12,(R)=>{R(2,9,1,3,'#3a2a1a');R(9,9,1,3,'#3a2a1a');R(1,11,10,1,'#3a2a1a');blob(R,6,5,5,5,'#8a3a1a');blob(R,6,5,4,4,'#e8d8b0');R(4,3,2,2,'#c02818');R(6,5,2,2,'#c02818');R(4,6,2,1,'#c02818');for(const [x,y] of [[1,5],[11,5],[6,0],[6,10]])R(x,y,1,1,'#e0b040');},{big:0});
 defDeco('incense',11,12,(R)=>{R(2,10,1,2,'#5a4020');R(8,10,1,2,'#5a4020');R(2,6,7,4,'#7a5a2a');R(2,6,2,4,'#9a7a3a');R(1,5,9,1,'#b08a40');R(3,3,5,2,'#a07a3a');R(5,1,1,2,'#a07a3a');R(4,2,1,1,'#ff8040');R(6,2,1,1,'#ff8040');},{big:0,smoke:'#c8c0d8',glow:{c:'#ff9040',y:-9,r:4,dim:1}});
 defDeco('bell',13,24,(R)=>{R(0,2,2,22,'#5a3a20');R(11,2,2,22,'#5a3a20');R(0,2,1,22,'#7a5a30');R(0,0,13,2,'#2a2a30');R(0,0,13,1,'#4a4a52');R(6,2,1,2,'#3a3a42');
  R(4,4,5,2,'#4a7a5a');R(3,6,7,8,'#3e6a4e');R(3,6,2,8,'#6a9a7a');R(2,14,9,1,'#2e5a3e');R(5,9,3,2,'#2e5a3e');},{big:1});
 defDeco('bonsai',13,14,(R)=>{R(3,11,7,3,'#2e3a5a');R(3,11,7,1,'#4a5a7a');R(6,6,1,5,'#5a3a22');R(4,7,2,1,'#5a3a22');R(7,5,2,1,'#5a3a22');blob(R,3,5,3,2,'#2e6a32');blob(R,9,4,3,2,'#2e6a32');blob(R,6,2,3,2,'#3e8a3e');R(5,1,2,1,'#5aaa4a');R(8,3,2,1,'#5aaa4a');},{big:0});
 // ---- special-room set pieces ----
 defDeco('stall',28,26,(R)=>{R(0,2,28,3,'#2a3038');R(1,1,26,1,'#4a5260');R(0,5,28,1,'#14101a');R(2,6,2,20,'#5a3a20');R(24,6,2,20,'#5a3a20');
  for(let i=0;i<3;i++){R(5+i*6,6,5,8,'#2a3a7a');R(5+i*6,6,5,1,'#1a2450');R(7+i*6,9,1,2,'#fff');}
  R(3,18,22,3,'#8a5a2a');R(3,18,22,1,'#a87a40');R(3,21,22,5,'#6a4220');R(5,16,3,2,'#c02818');R(10,15,4,3,'#e0c890');R(17,16,2,2,'#3e8a3e');R(21,16,2,2,'#e0b040');
  R(0,6,2,3,'#d02a20');R(26,6,2,3,'#d02a20');},{big:1,glow:{c:'#ffb040',y:-18,r:10,dim:1}});
 defDeco('shishi',14,12,(R)=>{R(1,8,12,4,'#6a6a72');R(2,8,10,1,'#8a8a92');R(3,9,8,2,'#2e6a8a');R(4,9,3,1,'#9ad0f0');R(9,2,2,7,'#5a9a3a');R(9,2,1,7,'#7aba5a');R(5,3,5,2,'#5a9a3a');R(5,3,5,1,'#7aba5a');R(6,5,1,3,'#9ad0f0');},{big:0});
 defDeco('coins',10,6,(R)=>{blob(R,5,4,4,2,'#c8a040');blob(R,4,3,2,1,'#e0c050');R(3,2,2,1,'#fff0a0');R(6,4,1,1,'#fff0a0');R(8,4,1,1,'#a07820');},{big:0,glow:{c:'#ffd040',y:-3,r:5,dim:1}});
 defDeco('skullpile',12,8,(R)=>{R(1,5,10,3,'#c8c0b0');R(2,2,4,4,'#e8e0d0');R(6,1,4,4,'#e8e0d0');R(3,3,1,1,'#14101a');R(5,3,1,1,'#14101a');R(7,2,1,1,'#14101a');R(9,2,1,1,'#14101a');R(4,5,1,1,'#14101a');R(8,4,1,1,'#14101a');},{big:0});
 defDeco('blacktorii',24,26,(R)=>{for(const x of [4,17]){R(x,6,3,18,'#2a1a1e');R(x,6,1,18,'#4a2a30');R(x-1,23,5,3,'#14101a');}
  R(1,1,22,2,'#14101a');R(0,0,2,2,'#14101a');R(22,0,2,2,'#14101a');R(2,3,20,1,'#6a0a14');R(2,8,20,2,'#2a1a1e');R(2,8,20,1,'#6a0a14');R(11,3,2,5,'#14101a');R(11,4,2,2,'#f33');},{big:1,glow:{c:'#f33',y:-20,r:6,dim:1}});
 defDeco('koi',10,5,(R)=>{R(1,2,6,2,'#f07020');R(2,1,4,1,'#f07020');R(3,2,2,1,'#ffffff');R(5,1,1,1,'#ffffff');R(7,2,1,1,'#f07020');R(8,1,2,1,'#f8a040');R(8,4,2,1,'#f8a040');R(1,2,1,1,'#14101a');},{big:0,flat:1,swim:1});
})();
const ENVDECO={grass:[['bush',3],['tallgrass',4],['bamboo',4],['lantern',2],['sakura',2],['jizo',1],['rock',1]],stone:[['pillar',2],['torch',2],['bones',2],['rock',2],['jizo',1]],
 planks:[['taru',3],['ricebale',3],['plantern',2],['banner',1],['bonsai',1],['taiko',1]],ember:[['brazier',2],['charred',3],['vent',3],['rock',1],['plantern',1]],
 swamp:[['reeds',5],['deadtree',2],['mushroom',1],['tallgrass',2],['jizo',1],['lantern',1]],
 temple:[['maple',3],['lantern',3],['incense',2],['jizo',2],['bell',1],['pagoda',1],['candles',1]],snow:[['pine',4],['iceshard',2],['rock',2],['lantern',1],['torii',1],['jizo',1]],
 marble:[['rpillar',3],['sakura',2],['bonsai',2],['komainu',1],['plantern',1],['urn',1]],
 cave:[['crystal',4],['mushroom',3],['stalag',3],['jizo',1]],blood:[['bones',3],['spikes',2],['banner',2],['candles',2],['rpillar',1],['torii',1]]};
let decos=[],ambient=[];
function genDecos(di){const env=map.env,L=ENVDECO[env.k]||[],tot=L.reduce((a,b)=>a+b[1],0),out=[];if(!L.length)return out;
 // special rooms use their own prop sets instead of the dungeon's
 const SPECDECO={rest:[['lantern',3],['bamboo',3],['bush',2],['shishi',1]],shop:[['taru',3],['ricebale',2],['plantern',2],['banner',1]],
  shrine:[['incense',2],['jizo',3],['candles',2],['lantern',1]],altar:[['bones',3],['candles',3],['skullpile',2],['deadtree',1]],treasure:[['coins',4],['urn',1],['plantern',1]]};
 const pickD=(big,LL)=>{LL=LL||L;const tt=LL.reduce((a,b)=>a+b[1],0);for(let t=0;t<8;t++){let r=Math.random()*tt;for(const [k,w] of LL){if((r-=w)<0){if(big==null||!!DECOSPR[k].big===big)return k;break;}}}return LL[0][0];};
 const wallN=(x,y)=>!map.t[y*MW+x+1]||!map.t[y*MW+x-1]||!map.t[(y+1)*MW+x]||!map.t[(y-1)*MW+x];
 for(const r of map.rooms){const n=Math.round(r.w*r.h/(r.k==='boss'?40:16)),cx=r.x+(r.w>>1),cy=r.y+(r.h>>1),LL=SPECDECO[r.type];
  for(let i=0,tr=0;i<n&&tr<n*6;tr++){const x=ri(r.x+1,r.x+r.w-2),y=ri(r.y+1,r.y+r.h-2),j=y*MW+x;if(!map.t[j]||map.liq[j])continue;if(Math.abs(x-cx)<(LL?7:3)&&Math.abs(y-cy)<(LL?7:3))continue;
   const edge=wallN(x,y);if(r.k==='boss'&&!edge)continue;const k=pickD(edge?null:false,LL),wx=x*T+rnd(3,13),wy=y*T+rnd(3,13);
   if(props.some(p=>Math.hypot(p.x-wx,p.y-wy)<24)||out.some(o=>Math.hypot(o.x-wx,o.y-wy)<10))continue;out.push({k,x:wx,y:wy,f:Math.random()<.5,ph:Math.random()*6});i++;}}
 // fixed set pieces that give each special room its identity
 for(const r of map.rooms){if(!SPECDECO[r.type])continue;const c=roomCenter(r),put=(k,dx,dy,f)=>{const x=c.x+dx,y=c.y+dy;if(!solid(x,y))out.push({k,x,y,f:!!f,ph:Math.random()*6});};
  if(r.type==='shop')put('stall',0,-40);
  else if(r.type==='shrine'){put('torii',0,-46);put('jizo',-30,-12);put('jizo',30,-12,1);put('incense',-16,22);put('incense',16,22);}
  else if(r.type==='altar'){put('blacktorii',0,-46);put('skullpile',-24,16);put('skullpile',24,16,1);put('candles',-34,-8);put('candles',34,-8);}
  else if(r.type==='treasure'){put('komainu',-32,-4);put('komainu',32,-4,1);put('coins',-16,18);put('coins',16,18);put('coins',0,-22);}
  else if(r.type==='rest'){for(let i=0;i<4;i++){const a=Math.PI/4+i*Math.PI/2;put('lantern',Math.cos(a)*108,Math.sin(a)*108);}put('shishi',44,-34);}}
 // hallways: lanterns/torches along the walls so the passages between arenas read as places too
 {const HL={grass:'lantern',stone:'torch',planks:'plantern',ember:'brazier',swamp:'lantern',temple:'lantern',snow:'lantern',marble:'plantern',cave:'crystal',blood:'candles'}[env.k]||'torch';
  const inRoom=(x,y)=>map.rooms.some(r=>x>=r.x-1&&x<r.x+r.w+1&&y>=r.y-1&&y<r.y+r.h+1);
  for(let y=1;y<MH-1;y++)for(let x=1;x<MW-1;x++){const j=y*MW+x;if(!map.t[j]||map.liq[j]||!wallN(x,y)||inRoom(x,y)||hash(x*7,y*3)>.08)continue;
   const wx=x*T+8,wy=y*T+8;if(out.some(o=>Math.hypot(o.x-wx,o.y-wy)<40))continue;out.push({k:HL,x:wx,y:wy,f:hash(x,y)<.5,ph:Math.random()*6});}}
 // themed boss arena: a ring of the environment's signature props around the fight
 {const AR={grass:['bamboo','sakura'],stone:['pillar','torch'],planks:['banner','plantern'],ember:['brazier','charred'],swamp:['deadtree','lantern'],temple:['maple','lantern'],snow:['pine','lantern'],marble:['rpillar','komainu'],cave:['crystal','stalag'],blood:['rpillar','candles']}[env.k];
  const br=map.bossRoom;if(AR&&br&&!map.train){const cx=(br.x+br.w/2)*T,cy=(br.y+br.h/2)*T,rr=br.w*T*.44;for(let i=0;i<16;i++){const a=i/16*TAU,x=cx+Math.cos(a)*rr,y=cy+Math.sin(a)*rr;if(solid(x,y)||map.liq[((y/T)|0)*MW+((x/T)|0)])continue;out.push({k:AR[i%2],x,y,f:Math.cos(a)<0,ph:Math.random()*6});}}}
 if(env.k==='swamp'||env.k==='grass')for(const i of map.liqList)if(Math.random()<.08){const x=i%MW,y=(i/MW)|0;out.push({k:'lily',x:x*T+8,y:y*T+8,f:false,ph:Math.random()*6,onliq:1});}
 // koi drifting in the garden ponds
 if(env.k==='grass'||env.k==='temple'||env.k==='marble')for(const i of map.liqList)if(Math.random()<.06){const x=i%MW,y=(i/MW)|0;out.push({k:'koi',x:x*T+8,y:y*T+8,f:Math.random()<.5,ph:Math.random()*6,onliq:1});}
 return out;}
function drawDeco(o){const s=DECOSPR[o.k],X=sx(o.x,o.y),Y=sy(o.x,o.y);if(X<-30||X>W+30||Y<-10||Y>H+40)return;
 if(o.onliq){const sw=s.swim?Math.round(Math.sin(time*.5+o.ph)*6):0;
  if(s.swim&&(Math.cos(time*.5+o.ph)<0)!==o.f){ctx.save();ctx.translate(X+sw,0);ctx.scale(-1,1);ctx.drawImage(s.c,Math.round(-s.w/2),Math.round(Y-s.h/2));ctx.restore();return;}
  ctx.drawImage(s.c,Math.round(X-s.w/2+sw),Math.round(Y-s.h/2+(s.swim?0:Math.sin(time*1.5+o.ph))));return;}
 if(!s.flat){ctx.fillStyle='rgba(0,0,0,.28)';ctx.fillRect(X-Math.round(s.w/3),Y-1,Math.round(s.w/1.5),2);}
 const sway=s.big&&(o.k==='bamboo'||o.k==='maple'||o.k==='reeds')?0:0;
 if(o.f){ctx.save();ctx.translate(X,0);ctx.scale(-1,1);ctx.drawImage(s.c,Math.round(-s.w/2),Math.round(Y-s.h+1+(s.flat?s.h/2:0)));ctx.restore();}else ctx.drawImage(s.c,Math.round(X-s.w/2+sway),Math.round(Y-s.h+1+(s.flat?s.h/2:0)));
 if(s.glow){const p=s.glow.dim?.15:.22;ctx.globalAlpha=p+.08*Math.sin(time*3+o.ph);disc(X,Y+s.glow.y,s.glow.r,s.glow.c);ctx.globalAlpha=1;}
 const fl=(fx,fy,sz)=>{const f=Math.floor(time*10+o.ph)%3;ctx.fillStyle='#ff6020';ctx.fillRect(fx-sz+1,fy-sz-f%2,sz*2-1,sz+1);ctx.fillStyle='#ffd040';ctx.fillRect(fx-sz+2,fy-sz+1-f%2,Math.max(1,sz*2-3),sz-1);ctx.fillStyle='#fff';ctx.fillRect(fx,fy-1,1,1);};
 if(s.fire)fl(X,Y+s.fire.y,s.fire.s);if(s.flames)for(const [fx,fy] of s.flames)fl(X-s.w/2+fx+1,Y+fy,1);
 if(s.smoke&&Math.random()<.08)particles.push({x:o.x+rnd(-3,3),y:o.y+rnd(-3,3),vx:rnd(-4,4),vy:rnd(-4,4),t:.6,col:s.smoke});}
// ambient weather/life particles per environment
const AMB={grass:{k:'leaf',n:16,c:'#f8b8d0',c2:'#fde0ea'},swamp:{k:'fly',n:22,c:'#b0ff70'},ember:{k:'rise',n:30,c:'#ff8a30'},snow:{k:'fall',n:60,c:'#ffffff'},temple:{k:'leaf',n:18,c:'#e05a20'},
 cave:{k:'rise',n:20,c:'#c080ff'},blood:{k:'fall',n:30,c:'#6a5a5a'},stone:{k:'mote',n:14,c:'#a0a0b0'},planks:{k:'mote',n:14,c:'#d8c090'},marble:{k:'leaf',n:20,c:'#f8b8d0',c2:'#fde0ea'}};
function updAmbient(dt){const A=AMB[map.env.k];if(!A)return;while(ambient.length<A.n)ambient.push({x:P.x+rnd(-180,180),y:P.y+rnd(-180,180),h:A.k==='fall'||A.k==='leaf'?rnd(0,90):rnd(0,30),t:rnd(2,6),ph:Math.random()*6});
 for(const a of ambient){a.t-=dt;if(A.k==='fly'){a.x+=Math.sin(time*.9+a.ph)*10*dt;a.y+=Math.cos(time*.7+a.ph*1.3)*10*dt;a.h=8+Math.sin(time*1.3+a.ph)*5;}
  else if(A.k==='rise'){a.h+=14*dt;a.x+=Math.sin(time*2+a.ph)*6*dt;}else if(A.k==='fall'){a.h-=18*dt;a.x+=Math.sin(time+a.ph)*8*dt;}else if(A.k==='leaf'){a.h-=12*dt;a.x+=Math.sin(time*2+a.ph)*16*dt;}else{a.h+=Math.sin(time+a.ph)*2*dt;a.x+=3*dt;}
  if(a.h<0||a.h>110||Math.hypot(a.x-P.x,a.y-P.y)>230)a.t=0;}
 ambient=ambient.filter(a=>a.t>0);}
function drawAmbient(){const A=AMB[map.env.k];if(!A)return;for(const a of ambient){const X=sx(a.x,a.y),Y=sy(a.x,a.y)-a.h|0;if(X<0||X>W||Y<0||Y>H)continue;ctx.globalAlpha=Math.min(1,a.t);
  if(A.k==='fly'){const on=Math.sin(time*3+a.ph*2)>.2;if(on){ctx.globalAlpha=.25;disc(X,Y,2,A.c);ctx.globalAlpha=1;ctx.fillStyle=A.c;ctx.fillRect(X,Y,1,1);}}
  else if(A.k==='leaf'){ctx.fillStyle=Math.floor(a.ph*3)%2?A.c:(A.c2||'#f0a040');ctx.fillRect(X,Y,2,1);ctx.fillRect(X+(Math.sin(time*4+a.ph)>0?1:0),Y+1,1,1);}
  else{ctx.fillStyle=A.c;ctx.fillRect(X,Y,1,A.k==='fall'&&map.env.k==='snow'?1:1);}ctx.globalAlpha=1;}}
['ashigaru','archer','samurai','ninja','monk'].forEach(t=>loadOverride(t,'e_'+t+'.png',32,32));
loadOverride('brute','e_brute.png',48,48);
// boss PNG overrides retired: bosses use the code-drawn sheets in bossSheet()

// ---------- dungeon themes ----------
const DUN=[
 {name:'WHISPERING BAMBOO',fl:['#3e4b2e','#465634'],sp:'#2f3b22',wt:'#15180f',wf:'#4a4f3c',we:'#7a8260',cloth:'#6a5a3a',dark:'#4a3d28',acc:'#a03030',pool:['ashigaru','archer','ashigaru','samurai']},
 {name:'IRON CELLARS',fl:['#2e2e36','#34343c'],sp:'#22222a',wt:'#101014',wf:'#4a4a56',we:'#74748a',cloth:'#5a5a64',dark:'#3a3a44',acc:'#8a6a30',pool:['ashigaru','samurai','archer','brute']},
 {name:'CRANE CASTLE',fl:['#7a6a4a','#85754f'],sp:'#5e5038',wt:'#1a1210',wf:'#4a3228',we:'#8a6a4a',cloth:'#7a3a3a',dark:'#4a2020',acc:'#d0a040',pool:['samurai','archer','ninja','samurai']},
 {name:'BURNING ESTATE',fl:['#4a2a22','#53302a'],sp:'#3a1e18',wt:'#140a08',wf:'#6a3420',we:'#e08030',cloth:'#8a4020',dark:'#5a2810',acc:'#f0a030',pool:['ninja','samurai','monk','archer']},
 {name:'MISTY RICE MARSH',fl:['#2c4a44','#32524b'],sp:'#1e3a34',wt:'#0c1614',wf:'#2e5a52',we:'#5aa090',cloth:'#3a6a5a',dark:'#244a40',acc:'#a0d0c0',pool:['brute','ninja','archer','monk']},
 {name:'THOUSAND BELL TEMPLE',fl:['#7a4a2a','#845230'],sp:'#5e3820',wt:'#1a0e08',wf:'#8a2a24',we:'#d05040',cloth:'#c0a040',dark:'#806020',acc:'#e8e0c0',pool:['monk','samurai','brute','monk']},
 {name:'FROSTPEAK SHRINE',fl:['#8a9ab0','#94a4ba'],sp:'#6a7a90',wt:'#202838',wf:'#5a6a85',we:'#b8c8e0',cloth:'#5a6a8a',dark:'#3a4a6a',acc:'#e0e8f8',pool:['samurai','ninja','brute','archer']},
 {name:'JADE PALACE',fl:['#a8b6c4','#b2c0ce'],sp:'#8896a8',wt:'#283244',wf:'#6a7c96',we:'#e0eaf8',cloth:'#7a8aaa',dark:'#506080',acc:'#f0f0ff',pool:['ninja','monk','samurai','archer']},
 {name:'SPIRIT CAVERNS',fl:['#3a2a4a','#42304e'],sp:'#2a1c38',wt:'#0e0814',wf:'#4a2a5a',we:'#8a5aa0',cloth:'#6a3a7a',dark:'#3a1a4a',acc:'#c060e0',pool:['brute','monk','ninja','samurai']},
 {name:'CRIMSON PAGODA',fl:['#5a1e28','#64222e'],sp:'#46141c',wt:'#0c0608',wf:'#8a2a34',we:'#e0b040',cloth:'#8a2030',dark:'#4a0e18',acc:'#e0b040',pool:['samurai','brute','monk','ninja','archer']},
];
const ROMAN=['I','II','III','IV','V','VI','VII','VIII','IX','X'];
// environments: floor texture, liquid (1 water slows, 2 lava burns, 3 poison burns, 4 ice, 5 blood slows), liquid colours [deep, mid, shine], wall dressing
const ENV=[
 {k:'grass',liq:1,amt:.05,lc:['#1e4a66','#2e6a8a','#9ad0f0'],wall:'bamboo'},
 {k:'stone',liq:1,amt:.03,lc:['#141c26','#1e2a38','#6a8aa8']},
 {k:'planks',liq:1,amt:.015,lc:['#1a2a3a','#28405a','#8ab0d0'],wall:'shoji',fl:['#8a8a4e','#929254'],sp:'#6a6a3a'},
 {k:'ember',liq:2,amt:.04,lc:['#a02808','#e05010','#ffd060']},
 {k:'swamp',liq:1,amt:.22,lc:['#1e4a48','#2e6a62','#a8e8c8'],wall:'hedge',fl:['#34452a','#3b4d2e'],sp:'#26341e'},
 {k:'temple',liq:1,amt:.03,lc:['#1a3a5a','#2a5a80','#a0d8f8'],wall:'lacquer',roof:['#2e4a40','#4a6a5a'],fl:['#9a9282','#a29a8a'],sp:'#7a7262'},
 {k:'snow',liq:4,amt:.06,lc:['#7aa8d0','#a8d0f0','#ffffff'],wall:'snow'},
 {k:'marble',liq:1,amt:.08,lc:['#2a6a9a','#4a90c0','#e0f4ff'],wall:'palace',fl:['#7a9a8a','#82a292'],sp:'#5a7a6a'},
 {k:'cave',liq:3,amt:.06,lc:['#3a1a50','#6a2a8a','#d080ff']},
 {k:'blood',liq:5,amt:.06,lc:['#3a0810','#6a1020','#e04050'],wall:'lacquer',roof:['#1a1418','#3a2a2e']},
];
const liqAt=(x,y)=>{if(!map||!map.liq)return 0;const tx=(x/T)|0,ty=(y/T)|0;if(tx<0||ty<0||tx>=MW||ty>=MH)return 0;return map.liq[ty*MW+tx];};
ENV.forEach((e,i)=>{if(e.fl)DUN[i].fl=e.fl;if(e.sp)DUN[i].sp=e.sp;});

// ---------- attack builders ----------
const mkA=(base)=>(o)=>Object.assign({wt:1},base,o);
const SL=mkA({n:'slash',w:.55,w2:.3,hits:1,range:34,arc:130,dmg:20,rec:.5,pd:25,peril:false});
const TH=mkA({n:'thrust',w:.5,dist:70,sp:200,dmg:20,rec:.5,pd:25,peril:false});
const SM=mkA({n:'slam',w:.8,rad:40,dmg:28,rec:.7,pd:0,peril:false});
const SH=mkA({n:'shoot',w:.6,cnt:1,spread:0,sp:90,dmg:12,reps:1,gap:.2,rec:.6,ring:false,col:'#d44',pd:14,arrow:false});
const CH=mkA({n:'charge',w:.7,sp:210,dur:.7,dmg:26,rec:.7,peril:false,dmin:50,pd:25});
const LP=mkA({n:'leap',w:.6,air:.55,rad:34,dmg:26,rec:.7,peril:true,dmin:40});
const SU=mkA({n:'summon',w:.9,cnt:2,types:['ashigaru'],rec:.8});

const ET={
 ashigaru:{hp:40,spd:36,pos:40,r:5,hat:'kasa',ai:'melee',rng:44,wl:14,atks:[TH({w:.55,dist:44,sp:150,dmg:13,rec:.5,pd:18})]},
 archer:{hp:26,spd:30,pos:28,r:5,hat:'kasa',ai:'ranged',keep:85,rng:140,wl:8,atks:[SH({w:.65,sp:95,dmg:10,rec:.5,pd:14,col:'#c9a050',arrow:true})]},
 samurai:{hp:62,spd:40,pos:60,r:5,hat:'hair',ai:'melee',rng:26,wl:12,atks:[SL({w:.5,w2:.3,hits:2,range:26,arc:120,dmg:15,rec:.6,pd:20})]},
 ninja:{hp:32,spd:62,pos:30,r:5,hat:'hood',ai:'dasher',rng:70,wl:8,atks:[TH({w:.35,dist:62,sp:230,dmg:11,rec:.45,pd:14})]},
 monk:{hp:44,spd:26,pos:40,r:5,hat:'bald',ai:'ranged',keep:70,rng:120,wl:6,atks:[SH({w:.7,cnt:3,spread:.5,sp:70,dmg:9,rec:.7,pd:12,col:'#c8f'})]},
 brute:{hp:150,spd:22,pos:100,r:8,hat:'kasa',sc:2,ai:'melee',rng:30,wl:18,cdMin:1,cdMax:2,atks:[SM({w:.9,rad:30,dmg:26,peril:true,rec:.8}),SL({w:.7,range:30,arc:140,dmg:20,rec:.6,pd:30})]},
};
function typePal(type,th){
 if(ET[type]&&ET[type].pal)return ET[type].pal;
 switch(type){
  case 'ashigaru':return basePal(th.cloth,th.dark,th.acc,'#8a7a4a');
  case 'archer':return basePal(th.dark,'#2a2a2a',th.acc,'#6a5a3a');
  case 'samurai':return basePal(shade(th.cloth,-.2),shade(th.dark,-.2),'#c8c8d0','#1a1a22');
  case 'ninja':return basePal('#2a2a3a','#1a1a26',th.acc,'#2a2a3a');
  case 'monk':return basePal('#b89a40','#7a6020','#e8e0c0','#7a6020');
  case 'shielder':return basePal('#7a7a88','#4a4a58','#c8c8d0','#5a5a68');
  case 'shaman':return basePal('#5a2a7a','#3a1a5a','#c080ff','#2a1a3a');
  case 'sniper':return basePal(th.dark,'#1a1a1a','#f04040','#2a2a2a');
  case 'assassin':return basePal('#3a1a3a','#1a0a1a','#cc88ff','#2a1a2a');
  default:return basePal(shade(th.cloth,-.1),shade(th.dark,-.3),'#707078','#3a3a3a');
 }
}
const sprCache={};
function getSpr(type,di){if(type==='wisp')return wispSprite();if(DUMMYSPR[type])return DUMMYSPR[type];if(ANIM[type])return ANIM[type];const k=type+di;return sprCache[k]||(sprCache[k]=humanoid(typePal(type,DUN[di]),ET[type].hat,type==='brute'||!!ET[type].horns,ET[type].sc||1));}

const BOSS=[
 {name:'GYOUBU ONIWA',hp:520,hat:'kasa',horns:1,pal:basePal('#8a2a24','#5a1a18','#d0a040','#3a1a18'),pref:34,spd:42,
  k1:[SL({hits:2,w:.6,dmg:16,wt:3}),CH({wt:2,dmg:22}),TH({dist:60,dmg:18,wt:2})],
  k2:[SL({hits:3,w:.5,w2:.25,dmg:16,wt:3}),CH({wt:2,dmg:24}),SM({peril:true,wt:2,rad:36}),TH({wt:1})]},
 {name:'CHAINED OGRE',hp:760,hat:'bald',sc:3,pal:basePal('#6a6a70','#3a3a42','#a0a0a8','#3a3a42','#a89888'),pref:30,spd:30,
  k1:[SM({peril:true,wt:3,rad:48,w:1,dmg:26}),SL({w:.7,dmg:22,range:42,arc:150,wt:3}),SH({ring:true,cnt:8,sp:60,dmg:10,wt:2})],
  k2:[SM({peril:true,wt:3,rad:52,w:.9,dmg:28}),SL({w:.6,hits:2,dmg:22,range:42,arc:150,wt:3}),SH({ring:true,cnt:10,reps:2,gap:.4,sp:60,dmg:10,wt:2}),LP({wt:2,rad:44})]},
 {name:'GENICHIRO ASHINA',hp:820,hat:'hair',pal:basePal('#2a4a8a','#1a2a5a','#e8e8f0','#ddddee'),pref:80,spd:44,
  k1:[SH({cnt:1,reps:3,gap:.25,sp:140,dmg:14,wt:3,dmin:60,col:'#cde',arrow:true}),TH({dist:90,sp:260,wt:2}),SL({hits:2,wt:2})],
  k2:[SH({cnt:1,reps:4,gap:.2,sp:150,dmg:14,wt:2,col:'#cde',arrow:true}),SH({ring:true,cnt:12,sp:80,dmg:14,wt:2,col:'#ff8'}),SL({hits:3,w:.45,w2:.22,wt:3}),TH({dist:100,sp:280,wt:2})]},
 {name:'LADY BUTTERFLY',hp:900,hat:'hair',pal:basePal('#6a2a8a','#3a1a5a','#f0a0e0','#2a1030'),pref:40,spd:50,
  k1:[LP({wt:2,peril:false}),SL({hits:3,w:.45,w2:.2,range:30,dmg:12,wt:3}),SH({cnt:5,spread:.9,sp:80,dmg:10,wt:2,col:'#c8f'})],
  k2:[LP({wt:2,w:.45}),SL({hits:3,w:.4,w2:.18,range:32,dmg:13,wt:3}),SH({cnt:7,spread:1.1,sp:90,dmg:10,wt:2,col:'#c8f'}),SU({types:['ninja'],cnt:2,wt:2})]},
 {name:'GUARDIAN APE',hp:1300,hat:'bald',sc:3,pal:basePal('#7a7a80','#4a4a52','#c8c0b0','#4a4a52','#9a8a7a'),pref:34,spd:36,
  k1:[CH({wt:2,dmg:30,peril:true}),SM({peril:true,wt:2,rad:50}),SL({wt:3,range:44,arc:160,dmg:26,hits:2}),LP({wt:2,rad:46})],
  k2:[CH({wt:2,dmg:32,peril:true,dur:1}),SM({peril:true,wt:2,rad:54,w:.7}),SL({wt:3,range:46,arc:170,dmg:26,hits:3,w:.5,w2:.25}),LP({wt:2,rad:50}),SH({ring:true,cnt:10,sp:70,dmg:12,wt:1,col:'#a98'})]},
 {name:'CORRUPTED MONK',hp:1100,hat:'bald',horns:0,pal:basePal('#e8e0c0','#b89a40','#d8b040','#e8e0c0'),pref:70,spd:34,
  k1:[SH({cnt:5,spread:.6,sp:75,wt:3,col:'#e8e0ff'}),SH({ring:true,cnt:10,sp:55,wt:2,col:'#e8e0ff'}),SU({types:['monk'],cnt:2,wt:1}),SL({wt:2,dmax:50})],
  k2:[SH({cnt:7,spread:.8,sp:85,wt:3,col:'#e8e0ff'}),SH({ring:true,cnt:14,reps:3,gap:.4,sp:50,wt:2,col:'#e8e0ff'}),SU({types:['monk','monk','ninja'],cnt:3,wt:1}),SL({wt:2,dmax:50,hits:2})]},
 {name:'ARMORED WARRIOR',hp:1500,hat:'kasa',horns:1,pal:basePal('#5a6068','#383c44','#b0b8c0','#2a2c30'),pref:36,spd:34,
  k1:[SL({hits:2,w:.7,dmg:28,range:40,wt:3}),SM({peril:true,wt:2,dmg:30}),TH({dist:80,wt:2,dmg:26}),CH({wt:2,dmg:30})],
  k2:[SL({hits:3,w:.55,w2:.3,dmg:28,range:42,wt:3}),SM({peril:true,wt:2,dmg:32,w:.65}),TH({dist:90,wt:2,dmg:28}),CH({wt:2,dmg:32})]},
 {name:'OWL, FATHER OF SHINOBI',hp:1400,hat:'hood',pal:basePal('#1a3a2a','#0e2418','#80d080','#1a3a2a'),pref:50,spd:56,
  k1:[TH({dist:100,sp:320,w:.3,dmg:16,wt:3}),SH({cnt:3,spread:.5,sp:130,dmg:10,wt:3,col:'#9f9'}),SU({types:['ninja'],cnt:3,wt:1}),LP({wt:2,w:.45,peril:false})],
  k2:[TH({dist:110,sp:340,w:.25,dmg:18,wt:3}),SH({cnt:5,spread:.7,sp:140,dmg:11,wt:3,col:'#9f9'}),SU({types:['ninja'],cnt:3,wt:1}),LP({wt:2,w:.4,peril:false}),SL({hits:3,w:.35,w2:.15,wt:2,dmg:16})]},
 {name:'DEMON OF HATRED',hp:1900,hat:'bald',horns:1,sc:3,pal:basePal('#4a0e10','#2a0608','#ff5020','#2a0608','#a03030'),pref:36,spd:38,
  k1:[SM({peril:true,rad:54,wt:2,dmg:34}),SH({ring:true,cnt:12,reps:2,gap:.35,sp:70,dmg:14,col:'#f60',wt:3}),LP({wt:2,rad:48}),CH({peril:true,wt:2,dur:.9,dmg:34}),SL({hits:2,wt:2,range:44,dmg:28})],
  k2:[SM({peril:true,rad:60,wt:2,dmg:36,w:.7}),SH({ring:true,cnt:16,reps:3,gap:.3,sp:75,dmg:14,col:'#f60',wt:3}),LP({wt:2,rad:52,w:.45}),CH({peril:true,wt:2,dur:1,dmg:36}),SL({hits:3,wt:2,range:46,dmg:28,w:.45,w2:.22})]},
 {name:'ISSHIN, SWORD SAINT',hp:2600,hat:'hair',pal:basePal('#e8e8f0','#8a8a98','#d0a030','#f0f0f8'),pref:34,spd:52,
  k1:[SL({hits:3,w:.45,w2:.22,dmg:20,wt:3}),TH({dist:110,sp:300,w:.35,wt:2,dmg:22}),SH({cnt:1,reps:4,gap:.2,sp:150,col:'#fff',wt:2,dmin:60,dmg:16,arrow:true}),CH({wt:1})],
  k2:[SL({hits:3,w:.4,w2:.2,dmg:22,wt:3}),TH({dist:120,sp:320,w:.3,wt:2,dmg:24}),SH({ring:true,cnt:12,reps:2,gap:.3,sp:90,dmg:16,col:'#ffe',wt:2}),SM({peril:true,wt:2,rad:48,w:.7,dmg:34}),CH({wt:1,dmg:28})],
  k3:[SL({hits:4,w:.35,w2:.16,dmg:24,wt:3}),TH({dist:130,sp:360,w:.25,wt:2,dmg:26}),SH({ring:true,cnt:16,reps:3,gap:.25,sp:100,dmg:18,col:'#ffe',wt:3}),SM({peril:true,wt:2,rad:56,w:.6,dmg:38}),LP({wt:2,w:.4,rad:44,dmg:30})]},
];

// ---------- items & tools ----------
const ITEMS=[
 {id:'atk',name:'SPIRIT POWER',d:'+3 SPELL POWER',g:'A',r:0},{id:'aspd',name:'QUICK HANDS',d:'+12% CAST SPEED',g:'S',r:0},
 {id:'range',name:'FAR SIGHT',d:'+BOLT RANGE',g:'L',r:0},{id:'hp',name:'VITALITY BEAD',d:'+20 MAX HP',g:'V',r:0},
 {id:'pos',name:'POSTURE BEAD',d:'+15 POSTURE',g:'P',r:0},{id:'spd',name:'LIGHT FOOT',d:'+8% MOVE SPEED',g:'F',r:0},
 {id:'parry',name:'WARD SEAL',d:'+WARD DURATION',g:'D',r:1},{id:'crit',name:'CRITICAL EYE',d:'+8% CRIT',g:'C',r:0},
 {id:'blood',name:'BLOOD MIST',d:'HEAL 3 ON KILL',g:'B',r:1},{id:'fire',name:'FIRE OIL',d:'EVERY ATTACK MAY BURN (LMB TOO)',g:'O',r:1},
 {id:'poison',name:'POISON MIST',d:'EVERY ATTACK POISONS (LMB TOO)',g:'X',r:1},{id:'shadow',name:'SHADOW STEP',d:'FASTER DASH',g:'H',r:1},
 {id:'emb',name:'FOCUS CHARM',d:'-10% COOLDOWNS',g:'E',r:0},{id:'thorn',name:'REPRISAL',d:'WARD SHOCKWAVE',g:'R',r:2},
 {id:'wave',name:'TWIN TALISMAN',d:'+1 SIDE BOLT',g:'W',r:2},{id:'gourd',name:'POTION SATCHEL',d:'+1 HP POTION NOW',g:'G',r:1},
 {id:'rez',name:'RESURRECTION',d:'+1 REVIVE',g:'Z',r:2},{id:'magnet',name:'GOLD MAGNET',d:'+GOLD +PICKUP',g:'M',r:1},
 {id:'hunger',name:'DEATHBLOW HUNGER',d:'DEATHBLOW HEALS',g:'U',r:2},{id:'mikiri',name:'PHASE STRIKE',d:'DASH->NEXT BOLT +60%',g:'K',r:2},
 {id:'iron',name:'IRON BODY',d:'-8% DAMAGE TAKEN',g:'I',r:1},{id:'ghost',name:'PHANTOM',d:'6% DODGE',g:'N',r:1},
];
const RCOL=['#9ab','#6c6','#c6f'],ITEMBY={};ITEMS.forEach(i=>ITEMBY[i.id]=i);
// rarity weights: common 12, uncommon 6, rare 3, legendary 1. minR filters out lower rarities.
function randItem(excl,minR){const RW=[12,6,3,1],pool=[];for(const it of ITEMS){if(excl&&excl.includes(it.id))continue;if(minR&&it.r<minR)continue;for(let k=0;k<RW[it.r];k++)pool.push(it);}return pick(pool.length?pool:ITEMS);}

// ---------- mage abilities ----------
const ULT_CD=32,WARD_CD=7,CHAIN_CD=4.5;

// ---------- meta progression ----------
const UPG=[{k:'vit',name:'VITALITY',d:'+12 MAX HP',base:30,max:10},{k:'atk',name:'MIGHT',d:'+2 SPELL POWER',base:40,max:10},{k:'pos',name:'RESOLVE',d:'+10 POSTURE',base:30,max:10},{k:'emb',name:'FOCUS',d:'-4% COOLDOWNS',base:35,max:8},{k:'sen',name:'GREED',d:'+10% GOLD',base:50,max:8},{k:'res',name:'DIVINE RICE',d:'+1 RESURRECTION',base:300,max:2}];
function loadMeta(){let m=null;try{m=JSON.parse(localStorage.getItem('shinobiDungeons1'));}catch(e){}if(!m||!m.up)m={sen:0,reached:0,runs:0,wins:0,up:{vit:0,atk:0,pos:0,emb:0,sen:0,res:0}};if(!m.loadout)m.loadout={};for(const k of 'mhqwfe')if(m.loadout[k]==null)m.loadout[k]=0;if(!m.stats)m.stats={att:0,def:0,spd:0,dex:0,vit:0,wis:0};if(!m.codex)m.codex={sp:{},gear:{}};if(m.asc==null){m.asc=0;m.ascMax=0;}
 // characters: 2 to start, one more after each finished run (older saves get credit for runs already played)
 if(m.unlocked==null)m.unlocked=Math.min(5,2+(m.runs||0));if((m.cls||0)>=m.unlocked)m.cls=0;return m;}
let meta=loadMeta();function saveMeta(){try{localStorage.setItem('shinobiDungeons1',JSON.stringify(meta));}catch(e){}}

// ---------- global state ----------
let mode='title',paused=false,R=null,S=null,P=null,map=null,mapCanvas=null,enemies=[],projs=[],pickups=[],fx=[],particles=[],texts=[],cam={x:0,y:0};
let shake=0,hitstop=0,time=0,boss=null,portal=null,chooseOpts=null,toast={t:0,s:'',c:'#fff'},hubSel=0,hubStart=0,flashT=0,deadInfo=null,tutPage=0,tutPending=null;
let props=[],traps=[],hz=[],dh=[],zones=[],freezeT=0,evOpts=null,evProp=null;
const keys={},mouse={x:W/2,y:H/2,down:false,rdown:false};

function calcStats(){
 const u=meta.up,inv=R.inv,G=gearStats(),n=id=>(inv[id]||0)+(G.fx[id]||0);
 const cu=R.curse||0,ms=meta.stats,st=k=>(ms[k]||0)+(G.st[k]||0);
 return {pierce:n('pierce'),frost:n('frost'),shock:n('shock'),qpow:n('qpow'),epow:n('epow'),ecd:n('ecd'),vamp:n('vamp'),echo:n('echo'),phoenix:n('phoenix'),flare:n('flare'),storm:n('storm'),
  st:{att:st('att'),def:st('def'),spd:st('spd'),dex:st('dex'),vit:st('vit'),wis:st('wis')},def:st('def')+G.def,
  atk:(14+u.atk*2+n('atk')*3+st('att')+G.atk)*(1+.4*n('glass'))*(1+.3*cu),aspd:1+n('aspd')*.12+st('dex')*.02,rangeM:.12*n('range'),maxhp:Math.round((100+u.vit*12+n('hp')*20+st('vit')*5+G.hp)*Math.pow(.75,n('glass'))),maxpos:100+u.pos*10+n('pos')*15,spd:78*(1+n('spd')*.08+st('spd')*.01),wardDur:2.2+.3*n('parry'),cdr:Math.pow(.9,n('emb'))*(1-.04*u.emb)*Math.max(.5,1-.01*st('wis')),crit:.05+n('crit')*.08,kills:n('blood')*3,burn:n('fire'),poison:n('poison'),dashCd:Math.max(.4,.9*Math.pow(.85,n('shadow'))),dashIv:.22+.03*n('shadow'),wave:n('wave'),gourdMax:3+n('gourd'),dr:Math.pow(.92,n('iron')),dodge:n('ghost')*.06,magnet:30+n('magnet')*14,sen:1+u.sen*.1+n('magnet')*.15,thorn:n('thorn'),dbHeal:n('hunger')*.15,mikiri:n('mikiri')};
}

// ---------- input ----------
addEventListener('keydown',e=>{if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Tab'].includes(e.code))e.preventDefault();if(e.repeat)return;keys[e.code]=true;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();}catch(_){}onKey(e.code);});
addEventListener('keyup',e=>{keys[e.code]=false;});
addEventListener('blur',()=>{for(const k in keys)keys[k]=false;mouse.down=mouse.rdown=false;if(mode==='play')paused=true;});
function setMouse(e){const r=cv.getBoundingClientRect();mouse.x=(e.clientX-r.left)/r.width*W;mouse.y=(e.clientY-r.top)/r.height*H;}
cv.addEventListener('mousemove',setMouse);
cv.addEventListener('mousedown',e=>{setMouse(e);if(mode==='play'&&invOpen){invClick(e.button);return;}if(e.button===0){mouse.down=true;if(mode==='choose')clickChoose();else if(mode==='scroll')clickScroll();else if(mode==='select')selClick();else if(mode==='title'||mode==='dead'||mode==='win'||mode==='tut')onKey('Enter');}if(e.button===2)mouse.rdown=true;});
addEventListener('mouseup',e=>{if(e.button===0)mouse.down=false;if(e.button===2)mouse.rdown=false;});
cv.addEventListener('contextmenu',e=>e.preventDefault());

// turn the camera 90 degrees (, and .). The floor is re-baked once per angle and cached for this map.
function rotateCam(d){setRotCoef(camRot+d);if(map&&map.th){map.mc={};mapCanvas=map.mc[camRot]=renderMap(map.th);} // only the current angle is kept (the floor image is big)
 sfx('tool');setToast('CAMERA '+['N','E','S','W'][camRot],'#aaa',.8);}
function onKey(c){
 if(c==='KeyM'){muted=!muted;return;}
 if((c==='Comma'||c==='Period')&&mode==='play'&&!paused&&!invOpen){rotateCam(c==='Period'?1:-1);return;}
 if(mode==='title'){if(c==='Enter'||c==='Space')openSelect('title');return;}
 if(mode==='select'){selectKey(c);return;}
 if(mode==='tut'){tutKey(c);return;}
 if(mode==='hub'){hubKey(c);return;}
 if(mode==='play'){if(c==='KeyN'&&R&&R.training&&!paused){finishTraining();return;}if(invOpen){if(c==='Tab'||c==='KeyI'||c==='Escape')closeInv();return;}if((c==='Tab'||c==='KeyI')&&!paused){invOpen=true;invHover=-1;sfx('tool');trainEv('pack');return;}if(c==='KeyX'&&!paused){quickSwap();return;}if(/^Digit[1-6]$/.test(c)&&!paused){const b=nearBag();if(b){takeItem(b,+c.slice(5)-1);return;}}if(c==='Escape'||c==='KeyP'){paused=!paused;return;}if(paused){if(c==='Enter'){paused=false;}return;}if(c==='Space')tryDash();else if(c==='KeyQ')castChain();else if(c==='KeyE')castWard();else if(c==='KeyF')castF();else if(c==='KeyR')castUlt();else if(c==='KeyC')useGourd();else if(c==='KeyG')interact();return;}
 if(mode==='choose'){if(c==='Digit1'||c==='Digit2'||c==='Digit3')pickChoice(+c.slice(5)-1);return;}
 if(mode==='scroll'){if(/^Digit[1-3]$/.test(c))pickScroll(+c.slice(5)-1);return;}
 if(mode==='event'){if(/^Digit[1-4]$/.test(c))pickEvent(+c.slice(5)-1);else if(c==='Escape')pickEvent(3);return;}
 if(mode==='dead'||mode==='win'){if(c==='Enter'||c==='Space'){openSelect('end');}} // after a run: back to character select (with upgrades)
}
function hubKey(c){
 const n=UPG.length+2;
 // the character is locked in on the select screen; row 1 is display-only and skipped
 if(c==='KeyT'){tutPending=null;tutPage=0;mode='tut';return;}
 if(c==='KeyY'){trainNext=true;startRun(0);return;}
 if(c==='KeyK'){codexOpen=!codexOpen;return;}if(codexOpen){if(c==='Escape')codexOpen=false;return;}
 if(c==='KeyQ'||c==='KeyE'){meta.asc=clamp((meta.asc||0)+(c==='KeyE'?1:-1),0,meta.ascMax||0);saveMeta();sfx('coin');return;}
 if(c==='Escape'){mode='title';return;}
 if(c==='ArrowUp'||c==='KeyW'){hubSel=(hubSel+n-1)%n;if(hubSel===1)hubSel=0;}
 else if(c==='ArrowDown'||c==='KeyS'){hubSel=(hubSel+1)%n;if(hubSel===1)hubSel=2;}
 else if(hubSel===0&&(c==='ArrowLeft'||c==='KeyA'))hubStart=Math.max(0,hubStart-1);
 else if(hubSel===0&&(c==='ArrowRight'||c==='KeyD'))hubStart=Math.min(meta.reached,hubStart+1);
 else if(c==='Enter'||c==='Space'){if(hubSel===0)startRun(hubStart);else if(hubSel>=2)buyUpg(UPG[hubSel-2]);}
}
function upgCost(u){return u.base*(meta.up[u.k]+1);}
function buyUpg(u){const lv=meta.up[u.k];if(lv>=u.max){return;}const c=upgCost(u);if(meta.sen>=c){meta.sen-=c;meta.up[u.k]++;saveMeta();sfx('pickup');}else sfx('block');}

// ---------- map generation ----------
function genMap(di){
 const t=new Uint8Array(MW*MH),rooms=[];
 const carve=(x,y,w,h)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)if(i>0&&j>0&&i<MW-1&&j<MH-1)t[j*MW+i]=1;};
 const hit=(a,b,m)=>a.x-m<b.x+b.w&&a.x+a.w+m>b.x&&a.y-m<b.y+b.h&&a.y+a.h+m>b.y;
 // big arenas: rooms are ~1.5x the old size, the boss arena 32x32
 // rooms grow as a winding chain from the start: each new room sits just 3-6 tiles from the one it grows off,
 // so hallways stay short while the rooms themselves are big arenas. The east strip is kept for the boss.
 rooms.push({x:3,y:ri(30,MH-44),w:14,h:14,k:'start'});
 const want=7+Math.floor(di*.4)+ri(0,2);
 const free=(r,boss)=>r.x>=2&&r.y>=2&&r.y+r.h<=MH-2&&r.x+r.w<=(boss?MW-2:MW-40)&&!rooms.some(o=>hit(r,o,2));
 for(let tr=0;tr<5000&&rooms.length<want+1;tr++){
  const par=rooms[Math.max(0,rooms.length-1-ri(0,2))]; // mostly grow off the newest rooms (a chain with short side branches)
  const big=Math.random()<.4,w=big?ri(25,32):ri(17,24),h=big?ri(22,29):ri(16,22),gap=ri(3,6),d=wpick([{d:0,wt:5},{d:1,wt:2},{d:2,wt:2},{d:3,wt:.5}]).d;
  let x,y;if(d===0||d===3){x=d===0?par.x+par.w+gap:par.x-gap-w;y=par.y+ri(-Math.floor(h/2),Math.floor(par.h/2));}
  else{x=par.x+ri(-Math.floor(w/2),Math.floor(par.w/2));y=d===1?par.y-gap-h:par.y+par.h+gap;}
  const r={x,y,w,h,k:'room'};if(free(r))rooms.push(r);}
 {const last=rooms.reduce((a,b)=>b.x+b.w>a.x+a.w?b:a);let placed=false;
  for(let tr=0;tr<300&&!placed;tr++){const r={x:MW-35,y:clamp(Math.round(last.y+last.h/2-16)+ri(-6,6),2,MH-34),w:32,h:32,k:'boss'};if(free(r,true)){rooms.push(r);placed=true;}}
  if(!placed)rooms.push({x:MW-35,y:clamp(Math.round(last.y+last.h/2-16),2,MH-34),w:32,h:32,k:'boss'});}
 // assign room types (shuffled so specials land in different places every run)
 const mids=rooms.filter(r=>r.k==='room');for(let i=mids.length-1;i>0;i--){const j=ri(0,i);[mids[i],mids[j]]=[mids[j],mids[i]];}
 mids.forEach((r,i)=>r.type=ROOMORDER[i]||'combat');
 // the shop sits in one of the last rooms before the boss: swap it into a room among the closest to the boss room
 {const br=rooms.find(r=>r.k==='boss'),bd=r=>Math.hypot(r.x+r.w/2-br.x-br.w/2,r.y+r.h/2-br.y-br.h/2),sh=mids.find(r=>r.type==='shop');
  if(sh){const near=[...mids].sort((a,b)=>bd(a)-bd(b)).slice(0,2),tg=pick(near);if(tg!==sh){const t=tg.type;tg.type='shop';sh.type=t;}}}
 const set=(i,j,v)=>{if(i>0&&j>0&&i<MW-1&&j<MH-1)t[j*MW+i]=v;};
 // room shapes: specials stay simple with an open centre, fights get varied arenas
 const SHAPES=['rect','round','round','cross','cave','cave','cave','hall','ring','octa'];
 for(const r of rooms){
  r.shape=r.k==='start'?'octa':r.k==='boss'?'arena':['combat','elite','trap'].includes(r.type)?pick(r.type==='elite'?['round','cross','cave','hall','octa']:SHAPES):pick(['rect','round','octa']);
  const w=r.w,h=r.h,mx=r.x+(w-1)/2,my=r.y+(h-1)/2;
  for(let j=r.y;j<r.y+h;j++)for(let i=r.x;i<r.x+w;i++){
   const nx=(i-mx)/(w/2),ny=(j-my)/(h/2);let ok=true;
   switch(r.shape){
    case 'round':ok=nx*nx+ny*ny<=1.08;break;
    case 'cave':{const a=Math.atan2(ny,nx),rr=.82+.22*Math.sin(a*3+r.x)+.12*Math.sin(a*5+r.y)+.1*(hash(i,j)-.5);ok=Math.hypot(nx,ny)<=rr;break;}
    case 'cross':ok=Math.abs(nx)<=.42||Math.abs(ny)<=.42;break;
    case 'octa':case 'arena':ok=Math.abs(nx)+Math.abs(ny)<=1.45;break;
   }
   if(ok)set(i,j,1);
  }
  if(r.shape==='ring'&&w>=12&&h>=12)for(let j=r.y+5;j<r.y+h-5;j++)for(let i=r.x+5;i<r.x+w-5;i++)set(i,j,0);
  if(r.shape==='hall'){for(let i=r.x+2;i<r.x+w-2;i+=3){set(i,r.y+2,0);set(i,r.y+h-3,0);}}
  if(r.shape==='cross'||r.shape==='cave'){set(Math.round(mx),Math.round(my),1);}
  if(r.shape==='rect'&&['combat','trap'].includes(r.type)&&w>=9&&h>=9){const np=ri(1,3);for(let k=0;k<np;k++){const px=ri(r.x+2,r.x+w-4),py=ri(r.y+2,r.y+h-4);if(Math.abs(px-(r.x+(w>>1)))<2&&Math.abs(py-(r.y+(h>>1)))<2)continue;for(let jj=0;jj<2;jj++)for(let ii=0;ii<2;ii++)set(px+ii,py+jj,0);}}
  if(r.k==='boss'){const c=[[6,6],[w-8,6],[6,h-8],[w-8,h-8]];for(const [px,py] of c)for(let jj=0;jj<2;jj++)for(let ii=0;ii<2;ii++)set(r.x+px+ii,r.y+py+jj,0);}
  // organic outlines: round alcoves and bulges around the edge so rooms are not perfect boxes (the boss arena stays clean)
  if(r.k!=='boss'){const nb=Math.round((w+h)/5);for(let k=0;k<nb;k++){const side=ri(0,3),f=Math.random();
   const ex=side<2?r.x+f*w:(side===2?r.x:r.x+w-1),ey=side<2?(side===0?r.y:r.y+h-1):r.y+f*h,rad=rnd(1.6,3.2);
   for(let jj=Math.floor(ey-rad);jj<=ey+rad;jj++)for(let ii=Math.floor(ex-rad);ii<=ex+rad;ii++)if((ii-ex)**2+(jj-ey)**2<=rad*rad)set(ii,jj,1);}}
 }
 rooms.sort((a,b)=>(a.x+a.w/2)-(b.x+b.w/2));
 const cx=r=>r.x+(r.w>>1),cy=r=>r.y+(r.h>>1),rd=(a,b)=>Math.hypot(cx(a)-cx(b),cy(a)-cy(b));
 // corridors: L-shaped with a random bend order and width, with a jog in the middle of long runs
 const seg=(x0,y0,x1,y1,wd)=>{const o=wd>>1;if(y0===y1)carve(Math.min(x0,x1)-o,y0-o,Math.abs(x1-x0)+wd,wd);else carve(x0-o,Math.min(y0,y1)-o,wd,Math.abs(y1-y0)+wd);};
 // winding passages: a round brush walks toward the target room, swaying side to side as it goes (wide enough to keep dodging)
 const brush=(x,y,wd)=>{const rr=wd/2;for(let j=Math.floor(y-rr);j<=y+rr;j++)for(let i=Math.floor(x-rr);i<=x+rr;i++)if((i-x)**2+(j-y)**2<=rr*rr+.5)set(i,j,1);};
 const link=(a,b)=>{let x=cx(a),y=cy(a),n=0,drift=0;const bx=cx(b),by=cy(b),wd=Math.random()<.5?4:3;
  while((x!==bx||y!==by)&&n<900){n++;if(Math.random()<.12)drift=ri(-1,1);
   const ddx=bx-x,ddy=by-y;
   if(ddx&&(!ddy||Math.abs(ddx)>Math.abs(ddy)*(.5+Math.random()))){x+=Math.sign(ddx);if(drift&&ddy&&Math.random()<.35)y+=drift;}
   else{y+=Math.sign(ddy);if(drift&&ddx&&Math.random()<.35)x+=drift;}
   x=clamp(x,2,MW-3);y=clamp(y,2,MH-3);brush(x,y,wd);}
  brush(bx,by,wd);};
 // tree: each room links to its nearest room further left; the boss room gets exactly one way in
 const links=new Set();
 for(let i=1;i<rooms.length;i++){let best=0,bd=1e9;for(let j=0;j<i;j++){const d=rd(rooms[i],rooms[j]);if(d<bd){bd=d;best=j;}}link(rooms[best],rooms[i]);links.add(best+'-'+i);}
 // a few loops so the dungeon is not a single line
 const nb=rooms.length-1;let loops=ri(2,3);for(let tr=0;tr<60&&loops>0;tr++){const i=ri(1,nb-1),j=ri(1,nb-1);if(i===j||links.has(Math.min(i,j)+'-'+Math.max(i,j))||rd(rooms[i],rooms[j])>44)continue;links.add(Math.min(i,j)+'-'+Math.max(i,j));link(rooms[i],rooms[j]);loops--;}
 // smoothing: fill sharp inside corners so rooms and passages flow into each other
 for(let pass=0;pass<2;pass++){const c=t.slice();for(let j=2;j<MH-2;j++)for(let i=2;i<MW-2;i++){if(c[j*MW+i])continue;let nn=0;for(let b=-1;b<=1;b++)for(let a=-1;a<=1;a++)if((a||b)&&c[(j+b)*MW+i+a])nn++;if(nn>=5)t[j*MW+i]=1;}}
 // at least one monster room before any treasure: every room linked to the start is a fight, so specials sit deeper in
 // (checked on the real floor: walk out from the start and every room you can enter first must be a fight)
 {const inR=(r,x,y)=>x>=r.x&&x<r.x+r.w&&y>=r.y&&y<r.y+r.h,s=rooms.find(r=>r.k==='start'),seen=new Uint8Array(MW*MH),first=new Set();
  const st=(s.y+(s.h>>1))*MW+s.x+(s.w>>1),q=[st];seen[st]=1;
  while(q.length){const i=q.pop(),x=i%MW,y=(i/MW)|0,r=rooms.find(o=>o!==s&&inR(o,x,y));if(r){first.add(r);continue;}
   for(const d of [1,-1,MW,-MW]){const j=i+d;if(t[j]&&!seen[j]){seen[j]=1;q.push(j);}}}
  const isFight=k=>['combat','elite','ambush','trap'].includes(k);
  for(const r of first){if(r.k!=='room'||isFight(r.type))continue;
   const sw=rooms.find(o=>o.k==='room'&&!first.has(o)&&o.type==='combat');if(sw){const k=r.type;r.type='combat';sw.type=k;}else r.type='combat';}}
 // reopen room centres that corridors or shapes may have closed
 for(const r of rooms)if(r.shape!=='ring')set(cx(r),cy(r),1);
 // liquid pools (water, lava, poison...) inside rooms, kept away from room centres
 const env=ENV[di],liq=new Uint8Array(MW*MH);
 if(env.liq)for(const r of rooms){if(r.k==='start')continue;const n=Math.round(r.w*r.h*env.amt/6)+(Math.random()<env.amt*4?1:0);
  for(let b=0;b<n;b++){const bx=ri(r.x+1,r.x+r.w-2),by=ri(r.y+1,r.y+r.h-2),rx=rnd(1.2,r.k==='boss'?2.2:3.4),ry=rnd(1.2,r.k==='boss'?2.2:3.4);
   for(let j=Math.floor(by-ry);j<=by+ry;j++)for(let i=Math.floor(bx-rx);i<=bx+rx;i++){if(i<1||j<1||i>=MW-1||j>=MH-1||!t[j*MW+i])continue;const d=((i-bx)/rx)**2+((j-by)/ry)**2;if(d>1+.3*(hash(i,j)-.5))continue;if(Math.abs(i-cx(r))<=2&&Math.abs(j-cy(r))<=2)continue;liq[j*MW+i]=env.liq;}}}
 // swamps also flood parts of corridors
 if(env.k==='swamp')for(let j=1;j<MH-1;j++)for(let i=1;i<MW-1;i++)if(t[j*MW+i]&&!rooms.some(r=>i>=r.x&&i<r.x+r.w&&j>=r.y&&j<r.y+r.h)&&Math.sin(i*.35)+Math.cos(j*.4)>1.1)liq[j*MW+i]=1;
 // which room each tile belongs to (special rooms get their own floors and props)
 const roomOf=new Int8Array(MW*MH).fill(-1);rooms.forEach((r,ri2)=>{for(let j=r.y;j<r.y+r.h;j++)for(let i=r.x;i<r.x+r.w;i++)if(t[j*MW+i])roomOf[j*MW+i]=ri2;});
 const vis=new Uint8Array(MW*MH);
 for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const i=y*MW+x;if(t[i])continue;let near=false;for(let j=-1;j<=1&&!near;j++)for(let k=-1;k<=1;k++){const xx=x+k,yy=y+j;if(xx>=0&&yy>=0&&xx<MW&&yy<MH&&t[yy*MW+xx]){near=true;break;}}if(near)vis[i]=(y+1<MH&&t[i+MW])?2:1;}
 const liqList=[];for(let i=0;i<MW*MH;i++)if(liq[i])liqList.push(i);
 return {t,vis,rooms,liq,liqList,env,roomOf,expl:new Uint8Array(MW*MH),startRoom:rooms.find(r=>r.k==='start'),bossRoom:rooms.find(r=>r.k==='boss')};
}
// ---- environment texturing (baked into the floor canvas) ----
const P1=(g,c,x,y,w,h)=>{g.fillStyle=c;g.fillRect(x,y,w||1,h||1);};
function isoLn(g,c,x,y,n,dx){g.fillStyle=c;for(let i=0;i<n;i++)g.fillRect(x+i*2*dx,y+Math.round(i*2*ISOK),2,1);} // a line along an iso axis (follows the camera pitch)
function drawLiquidTile(g,X,Y,x0,y0,lq,h,tu,tv){
 // neighbour checks run in the rotated grid so banks sit on the correct screen edges at every camera angle
 const L=map.env.lc,at=(i,j)=>{const [a,b]=tileW(i,j);return a>=0&&b>=0&&a<MW&&b<MH&&map.liq[b*MW+a];},x=tu,y=tv;
 // flat liquid fill so neighbouring tiles merge into one pool, with soft wave bands
 for(let j=0;j<TILEH;j++){const half=dHalf(j);P1(g,L[1],X-half,Y+j,half*2,1);}
 for(let k=0;k<3;k++){const wy=Y+3+k*4+((h*5)|0)%2,wx=X-8+((hash(x+k,y)*12)|0);P1(g,L[0],wx,wy,6+k*2,1);}
 if(h>.3&&h<.5){P1(g,L[2],X-2+((h*30)|0)%6,Y+5,3,1);P1(g,L[2],X-1+((h*30)|0)%6,Y+6,1,1);}
 // banks where the pool meets ground
 const bank=lq===2?'#3a1a10':lq===4?'#c8e0f0':'#2a2418';
 if(!at(x-1,y)){isoLn(g,bank,X-2,Y,8,-1);isoLn(g,bank,X-2,Y+1,8,-1);}
 if(!at(x,y-1)){isoLn(g,bank,X,Y,8,1);isoLn(g,bank,X,Y+1,8,1);}
 if(!at(x+1,y))isoLn(g,L[2],X+14,Y+HY,8,-1);
 if(!at(x,y+1))isoLn(g,L[2],X-16,Y+HY,8,1);
 if(lq===1||lq===5){if(h>.55&&h<.62)P1(g,L[2],X-4,Y+6,4,1);if(h<.12)P1(g,L[2],X+3,Y+9,3,1);}
 if(lq===2){if(h<.4)P1(g,'#ffd060',X-3+((h*40)|0)%6,Y+7,2,1);if(h>.85)P1(g,'#ff8020',X-6,Y+5,5,2);}
 if(lq===3&&h>.8){P1(g,L[2],X-2,Y+6,2,2);}
 if(lq===4){isoLn(g,'#ffffff',X-6,Y+5,3,1);if(h>.6)isoLn(g,'#e0f0ff',X+2,Y+8,3,-1);}
 // lily pads in the swamp
 if(map.env.k==='swamp'&&lq===1&&h>.78){const ox=((h*91)|0)%10-5;P1(g,'#14101a',X+ox-3,Y+6,7,4);P1(g,'#4a8a3a',X+ox-2,Y+7,5,2);P1(g,'#6aaa4a',X+ox-1,Y+7,2,1);if(h>.95)P1(g,'#f8a0c0',X+ox,Y+6,2,1);}
}
function floorDeco(g,X,Y,x,y,h,th){
 const k=map.env.k,h2=hash(x+57,y+13),cx=X-6+((h*997)|0)%12,cy=Y+5+((h*571)|0)%6;
 const nearLiq=map.liq[(y)*MW+x+1]||map.liq[(y+1)*MW+x]||map.liq[y*MW+x-1]||map.liq[(y-1)*MW+x];
 const tuft=(c,c2)=>{P1(g,c,cx,cy,1,2);P1(g,c,cx+2,cy-1,1,3);P1(g,c2||c,cx+4,cy,1,2);};
 const reeds=()=>{for(let i=0;i<3;i++){const rx=X-5+i*4+((h2*7)|0)%3,hh=4+((h*13+i*5)|0)%4;P1(g,'#5a7a2a',rx,Y+10-hh,1,hh);P1(g,'#7a4a20',rx,Y+9-hh,1,2);}};
 switch(k){
  case 'grass':
   if(h<.5)tuft('#5a7a34','#6a8a40');if(h>.93)P1(g,pick(['#f0e070','#f0f0f0','#e05050','#c080f0']),cx,cy,2,1);
   if(h2<.06){P1(g,'#14101a',X-3,Y+6,7,4);P1(g,'#7a7a6a',X-2,Y+6,5,3);P1(g,'#9a9a88',X-1,Y+6,2,1);}
   if(nearLiq&&h2>.5)reeds();break;
  case 'swamp':
   if(h<.35)P1(g,'#2a3420',cx-2,cy,6,2);if(h>.4&&h<.7)tuft('#4a6a2a','#5a7a30');
   if(nearLiq&&h2>.35)reeds();if(h2<.05){P1(g,'#3a2a1a',X-4,Y+7,8,2);P1(g,'#5a4a30',X-3,Y+7,6,1);}
   if(h>.96){P1(g,'#d8d0a0',cx,cy-2,1,2);P1(g,'#c84040',cx-1,cy-3,3,1);}break;
  case 'stone':
   isoLn(g,shade(th.fl[0],-.25),X-8,Y+4,8,1);if(h<.25)isoLn(g,shade(th.fl[0],-.25),X+6,Y+5,4,-1);
   if(h>.9)P1(g,'#14101a',cx,cy,3,1),P1(g,'#14101a',cx+2,cy+1,2,1);
   if(h2<.1)P1(g,'#3a4a2a',cx-1,cy,4,1);break;
  case 'temple': // raked gravel garden (karesansui), the odd fallen maple leaf and a few garden stones
   for(let i=1;i<4;i++)isoLn(g,shade(th.fl[0],-.14),X-16+4*i,Y+HY-Math.round(4*i*ISOK),8,1);
   if(h2<.25)P1(g,pick(['#e07020','#c03020','#f0a030']),cx,cy,2,1);
   if(h>.97){P1(g,'#14101a',X-4,Y+5,9,5);P1(g,'#5a5a62',X-3,Y+5,7,4);P1(g,'#7a7a82',X-2,Y+5,3,1);P1(g,'#3e6a32',X-3,Y+8,3,1);}break;
  case 'planks': // tatami: straw weave inside dark cloth borders, mats two tiles long
   for(let i=1;i<4;i++)isoLn(g,shade(th.fl[0],.07),X-16+4*i,Y+HY-Math.round(4*i*ISOK),8,1);
   isoLn(g,'#2e3a1e',X-16,Y+HY,8,1);if(x%2===0)isoLn(g,'#2e3a1e',X,Y,8,1);
   if(h>.96)P1(g,'#5a5a30',cx,cy,2,1);break;
  case 'ember':
   if(h<.35)P1(g,'#2a1410',cx-2,cy,6,2);if(h>.9){isoLn(g,'#f06020',cx-4,cy,3,1);P1(g,'#ffc040',cx,cy+1,1,1);}
   if(h2<.04){P1(g,'#14101a',X-4,Y+6,8,3);P1(g,'#3a2418',X-3,Y+6,6,2);}break;
  case 'snow':
   if(h<.4)P1(g,'#ffffff',cx,cy,2,1);if(h2<.15)P1(g,'#b8c8e0',cx-3,cy+2,3,1);
   if(h2>.96){P1(g,'#14101a',X-3,Y+6,7,4);P1(g,'#6a7a90',X-2,Y+6,5,3);P1(g,'#ffffff',X-2,Y+5,5,1);}break;
  case 'marble': // jade tiles with a gold lattice every other tile, sakura petals
   if(x%2===0)isoLn(g,'#c8a040',X-16,Y+HY,8,1);if(y%2===0)isoLn(g,'#c8a040',X,Y,8,1);
   if(h<.2)isoLn(g,shade(th.fl[0],.2),cx-4,cy,3,1);if(h2<.14)P1(g,'#f8b8d0',cx,cy,2,1);break;
  case 'cave':
   if(h<.4)P1(g,th.sp,cx,cy,2,1);
   if(h2>.94){const c=pick(['#c040e0','#e04060','#40c0a0']);P1(g,'#14101a',cx-2,cy-3,5,5);P1(g,'#d8d0c0',cx,cy-1,1,3);P1(g,c,cx-1,cy-2,3,1);P1(g,shade(c,.4),cx,cy-2,1,1);}break;
  case 'blood':
   if(h<.3)P1(g,'#3a0a10',cx-2,cy,5,2);if(h2>.95){P1(g,'#e8e0d0',cx,cy,4,1);P1(g,'#e8e0d0',cx,cy-1,1,1);P1(g,'#e8e0d0',cx+3,cy+1,1,1);}break;
 }
}
// ---- special-room floors: each event room is tiled in its own style ----
function diaIn(g,X,Y,ins,col){g.fillStyle=col;for(let j=ins;j<TILEH-ins;j++){const half=dHalf(j)-ins*2;if(half>0)g.fillRect(X-half,Y+j,half*2,1);}}
const SPECFLOOR={
 rest:{fl:['#34503a','#3a5840'],deco:(g,X,Y,x,y,h,r)=>{const d=Math.hypot(x-(r.x+(r.w>>1)),y-(r.y+(r.h>>1)));
  if(Math.abs(d-5.5)<.7){diaIn(g,X,Y,3,'#5a5a52');diaIn(g,X,Y,5,'#7a7a72');P1(g,'#9a9a90',X-2,Y+5,3,1);}
  else{if(h<.3)P1(g,'#c8c8b8',X-3+((h*40)|0)%6,Y+7,2,1);if(h>.82){P1(g,'#5a8a3a',X-4,Y+8,1,2);P1(g,'#6aa046',X-2,Y+7,1,3);P1(g,'#5a8a3a',X,Y+8,1,2);}}}},
 shop:{fl:['#6e4a2c','#77512f'],deco:(g,X,Y,x,y,h,r)=>{for(let i=1;i<4;i++)isoLn(g,'#5a3a20',X-16+4*i,Y+HY-Math.round(4*i*ISOK),8,1);
  if(Math.abs(x-(r.x+(r.w>>1)))<=1&&Math.abs(y-(r.y+(r.h>>1)))<=Math.floor(r.h/2)-2){diaIn(g,X,Y,1,'#e0b040');diaIn(g,X,Y,2,'#8a1a20');if(h>.5)P1(g,'#b03030',X-2,Y+7,4,1);}}},
 shrine:{fl:['#2e2440','#352a4a'],deco:(g,X,Y,x,y,h,r)=>{const d=Math.hypot(x-(r.x+(r.w>>1)),y-(r.y+(r.h>>1)));
  if(Math.abs(d-4.5)<.7){P1(g,'#c6f',X-3,Y+6,1,3);P1(g,'#c6f',X-3,Y+6,4,1);P1(g,'#c6f',X+1,Y+8,1,2);P1(g,'#e8c8ff',X-1,Y+7,1,1);}
  else if(h>.9)P1(g,'#8a6ab0',X+((h*30)|0)%8-4,Y+6,1,1);isoLn(g,'#241a34',X-8,Y+4,8,1);}},
 altar:{fl:['#3a1418','#43181d'],deco:(g,X,Y,x,y,h,r)=>{const d=Math.hypot(x-(r.x+(r.w>>1)),y-(r.y+(r.h>>1)));
  if(Math.abs(d-4)<.6){P1(g,'#f33',X-4,Y+7,8,1);P1(g,'#ff8080',X-1,Y+7,2,1);}
  if(h<.3){isoLn(g,'#1a0608',X-6,Y+5,4,1);isoLn(g,'#1a0608',X+2,Y+7,3,-1);}if(h>.93)P1(g,'#6a0a14',X-2,Y+6,4,2);}},
 treasure:{fl:['#5a4a2a','#65532f'],deco:(g,X,Y,x,y,h)=>{if(x%2===0)isoLn(g,'#c8a040',X-16,Y+HY,8,1);if(y%2===0)isoLn(g,'#c8a040',X,Y,8,1);if(h>.9){P1(g,'#ffe080',X-1,Y+6,2,1);P1(g,'#fff',X-1,Y+6,1,1);}}}};
// Pre-renders the floor as 32x16 diamonds into one big canvas, and builds wall-cube sprites (drawn depth-sorted at runtime).
function renderMap(th){
 const FW=(MW+MH)*16,FH=(MW+MH)*HY+TILEH+WH,edges=th.fl.map(c=>shade(c,-.14));
 const floor=mk(FW,FH,g=>{
  g.fillStyle='#07060a';g.fillRect(0,0,FW,FH);
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){
   if(!map.t[y*MW+x])continue;
   // place the tile by its position in the rotated grid (the camera angle)
   const [tu,tv]=tileR(x,y),X=(tu-tv+RMH)*16,Y=(tu+tv)*HY,ci=(x+y)&1,h=hash(x,y),lq=map.liq[y*MW+x];
   if(lq){drawLiquidTile(g,X,Y,x,y,lq,h,tu,tv);continue;}
   const rm=map.roomOf&&map.roomOf[y*MW+x]>=0?map.rooms[map.roomOf[y*MW+x]]:null,SF=rm&&SPECFLOOR[rm.type];
   const fl=SF?SF.fl:th.fl,ed=SF?SF.fl.map(c=>shade(c,-.18)):edges;
   for(let j=0;j<TILEH;j++){const half=dHalf(j);g.fillStyle=ed[ci];g.fillRect(X-half,Y+j,half*2,1);if(j>0&&j<TILEH-1&&half>2){g.fillStyle=fl[ci];g.fillRect(X-half+2,Y+j,half*2-4,1);}}
   if(SF)SF.deco(g,X,Y,x,y,h,rm);else floorDeco(g,X,Y,x,y,h,th);
   g.fillStyle='rgba(0,0,0,.3)';
   if(!floorAtR(tu-1,tv))for(let j=0;j<HY;j++)g.fillRect(X-Math.round((j+1)/ISOK),Y+j,6,2);
   if(!floorAtR(tu,tv-1))for(let j=0;j<HY;j++)g.fillRect(X+Math.round((j+1)/ISOK)-6,Y+j,6,2);
  }
 });
 const top=shade(th.wf,.12),lf=th.wf,rf=shade(th.wf,-.32),ln=shade(th.wf,-.5),ed=th.we,hw=Math.floor(WH/2),walls=[];
 // faceY(x): the screen row where the top diamond's lower edge meets the wall face, at column x
 const faceY=x=>HY+Math.floor((x<16?x:31-x)*ISOK);
 for(let mask=0;mask<4;mask++)for(let v=0;v<2;v++)walls.push(mk(32,TILEH+WH,g=>{
  for(let x=0;x<32;x++){
   const j=faceY(x),left=x<16,vis=left?(mask&1):(mask&2);if(!vis)continue;
   g.fillStyle=left?lf:rf;g.fillRect(x,j+1,1,WH);
   g.fillStyle=ln;g.fillRect(x,j+1+hw,1,1);g.fillRect(x,j+WH,1,1);
   if((x+(v?4:0))%8===0)g.fillRect(x,j+2,1,hw-1);
   if((x+(v?0:4))%8===0)g.fillRect(x,j+2+hw,1,hw-2);
  }
  for(let j=0;j<TILEH;j++){const half=dHalf(j);g.fillStyle=top;g.fillRect(16-half,j,half*2,1);g.fillStyle=ed;g.fillRect(16-half,j,1,1);g.fillRect(16+half-1,j,1,1);}
  g.fillStyle=ed;g.fillRect(14,0,4,1);
  if(v){g.fillStyle='rgba(255,255,255,.07)';g.fillRect(10,6,5,2);g.fillRect(18,9,3,1);}
  const wd=map.env.wall;
  if(wd==='hedge'){ // leafy tops and vines down the faces
   const lv=['#2e4a22','#3e5e2a','#56782f'];
   for(let j=1;j<TILEH-1;j++){const half=dHalf(j);for(let x=16-half+1;x<16+half-1;x++){const hh=hash(x*3+v*7,j*5+mask);if(hh<.55){g.fillStyle=lv[hh<.2?0:hh<.42?1:2];g.fillRect(x,j,1,1);}}}
   for(let x=0;x<32;x+=3){const left=x<16,vis=left?(mask&1):(mask&2);if(!vis)continue;const j=faceY(x),len=2+((hash(x,v+mask)*6)|0);g.fillStyle=lv[1];g.fillRect(x,j+1,1,len);g.fillStyle=lv[2];g.fillRect(x,j+1,1,1);}
  }else if(wd==='snow'){
   for(let j=0;j<TILEH;j++){const half=dHalf(j);g.fillStyle=j===0||j===TILEH-1?'#c8d8ea':'#eef4fb';g.fillRect(16-half+1,j,half*2-2,1);}
   for(let x=1;x<31;x+=2){const left=x<16,vis=left?(mask&1):(mask&2);if(!vis)continue;const j=faceY(x);g.fillStyle='#eef4fb';g.fillRect(x,j+1,1,1+((hash(x,mask+v)*3)|0));}
   g.fillStyle='#fff';g.fillRect(12,5,6,2);
  }else if(wd){
   // helpers: every visible face column (x, its top row j, which face), and every inner pixel of the top diamond
   const face=fn=>{for(let x=0;x<32;x++){const left=x<16,vis=left?(mask&1):(mask&2);if(!vis)continue;fn(x,faceY(x),left);}};
   const topD=fn=>{for(let j=1;j<TILEH-1;j++){const half=dHalf(j);for(let x=16-half+1;x<16+half-1;x++)fn(x,j);}};
   const px=(c,x,y,h)=>{g.fillStyle=c;g.fillRect(x,y,1,h||1);};
   const roof=(a,b)=>{topD((x,j)=>px(((x>>1)+j+v)%3===0?a:b,x,j));px(a,14,0);px(a,15,0);px(a,16,0);px(a,17,0);};
   if(wd==='bamboo'){ // bamboo fence: green poles with dark nodes, leafy tops
    face((x,j,left)=>{const pole=(x>>1)%2,c=left?(pole?'#5a8a30':'#4e7a2a'):(pole?'#3e6222':'#34561e');px(c,x,j+1,WH);if(x%2===0)px(left?'#7aa84a':'#4a7230',x,j+1,WH);
     px('#22381a',x,j+3+((x>>1)%3));px('#22381a',x,j+7+((x>>1)%2));});
    topD((x,j)=>{const hh=hash(x*3+v*7,j*5+mask);px(hh<.5?'#24401c':hh<.85?'#2e4a22':hh<.97?'#3e6a2a':'#7aa04a',x,j);});
   }else if(wd==='shoji'){ // castle: paper screens in dark wooden frames under a grey tiled roof
    face((x,j,left)=>{px(left?'#e8e0c8':'#c4bca4',x,j+1,WH);if(x%5===0)px('#3a2418',x,j+1,WH);px('#3a2418',x,j+1);px('#3a2418',x,j+1+hw);px('#2a1810',x,j+WH);});
    roof('#2a3038','#4a5260');
   }else if(wd==='lacquer'){ // shrine walls: red lacquer, gold trim, posts, glazed roof tiles
    const rf=map.env.roof||['#2a3038','#4a5260'];
    face((x,j,left)=>{px(left?'#a01c18':'#701210',x,j+1,WH);px('#e0b040',x,j+1);px('#1a0a0a',x,j+WH);if(x%8===0)px('#2a1010',x,j+2,WH-2);});
    roof(rf[0],rf[1]);
   }else if(wd==='palace'){ // palace: white plaster, red band, golden roof tiles
    face((x,j,left)=>{px(left?'#e8e4dc':'#b8b4ac',x,j+1,WH);px('#b02018',x,j+1,2);px('#e0b040',x,j+3);if(x%8===0)px('#8a1010',x,j+4,WH-4);});
    roof('#8a6420','#b08a34');
   }
  }
 }));
 return {floor,walls,FW,FH};
}
const solid=(x,y)=>{if(x<0||y<0)return true;const tx=(x/T)|0,ty=(y/T)|0;if(tx>=MW||ty>=MH)return true;return !map.t[ty*MW+tx];};
const blocked=(x,y,r)=>solid(x-r,y-r)||solid(x+r,y-r)||solid(x-r,y+r)||solid(x+r,y+r);
function move(e,dx,dy,r){if(!blocked(e.x+dx,e.y,r))e.x+=dx;if(!blocked(e.x,e.y+dy,r))e.y+=dy;}

// ---------- run / dungeon setup ----------
function startRun(start){
 if(!meta.tut3){meta.tut3=true;saveMeta();} // the training grounds replace the old auto tutorial pages
 R={di:start,inv:{},eq:{wpn:{t:'gear',slot:'wpn',tier:0,rare:false,wt:WSIG[CLS().k],name:'T0 '+WSIG[CLS().k],starter:true},arm:null,ring:null},pack:[],pots:1,asc:meta.asc||0,sen:0,kills:0,time:0,start,deathblows:0,perfect:0};
 S=calcStats();
 P={x:0,y:0,hp:S.maxhp,pos:0,pdelay:0,guard:false,ward:0,ab:{q:0,rmb:0,e:0,h:0,f:0},atkCd:0,dash:0,dashCd:0,dx:0,dy:0,iv:0,stag:0,flash:0,gourd:S.gourdMax,rez:1+meta.up.res,aim:0,mik:0,face:1,lo:Object.assign({},CLS().kit),emp:{},aegis:0,evo:0,evoT:0,storm:0,stormT:0,stormA:0,hot:0,hotAmt:0,haste:0};
 for(let i=0;i<start*2;i++){const it=randItem(['rez']);R.inv[it.id]=(R.inv[it.id]||0)+1;}
 S=calcStats();P.hp=S.maxhp;P.gourd=S.gourdMax;
 if(start===0&&(!meta.trained||trainNext)){trainNext=false;loadTraining();}else loadDungeon(start);mode='play';paused=false;
}
let trainNext=false;
function loadDungeon(di){
 R.di=di;const th=DUN[di];map=genMap(di);map.th=th;map.mc={};mapCanvas=map.mc[camRot]=renderMap(th);
 enemies=[];projs=[];pickups=[];fx=[];particles=[];texts=[];props=[];traps=[];hz=[];dh=[];zones=[];freezeT=0;portal=null;boss=null;
 const sr=map.startRoom;P.x=(sr.x+sr.w/2)*T;P.y=(sr.y+sr.h/2)*T;
 P.iv=1;P.stag=0;P.ward=0;P.dash=0;P.pos=0;P.storm=0;P.hot=0;P.haste=0;
 P.hp=Math.min(S.maxhp,P.hp+S.maxhp*(di===R.start?0:.15)); // only a small rest between dungeons
 for(const r of map.rooms){
  if(r.k==='start')continue;
  if(r.k==='boss'){boss=mkBoss(di,(r.x+r.w/2)*T,(r.y+r.h/2)*T,r);enemies.push(boss);continue;}
  populateRoom(r,di);
 }
 decos=genDecos(di);ambient=[];
 setToast(ROMAN[di]+'. '+th.name,'#fff',3);
 if(di>0)txtFx(P.x,P.y,'SPELLS RANK UP: '+(di+1),'#fd4');
}
function mkEnemy(type,x,y,room,di){
const t=ET[type],hm=2.6*(1+.6*di)*(1+.15*((R&&R.asc)||0));
 return {type,t,x,y,room,hp:t.hp*hm,maxhp:t.hp*hm,posture:0,maxPosture:t.pos*(1+.12*di),spd:t.spd,r:t.r,dm:1+.17*di,awake:false,cd:rnd(.3,1),act:null,stag:0,stun:0,pdelay:0,flash:0,kx:0,ky:0,tele:0,st:null,di,sdir:Math.random()<.5?1:-1,wob:Math.random()*6,boss:false,z:0,iv:0,shield:!!t.shield,slow:1,zs:1,rcd:0,fa:0};
}
let BOSSHP=20;
// a disengaged boss goes home, heals fully and forgets the fight (phase, enrage, attack timers, its bullets)
function bossReset(e){
 Object.assign(e,{hp:e.maxhp,posture:0,phase:1,kit:e.b.k1,lastPh:undefined,act:null,tele:0,stag:0,stun:0,storm:0,mode:null,modeT:null,brq:[],bgT:null,bgN:0,stN:0,
  enraged:false,fightT:0,awake:false,x:e.hx,y:e.hy,kx:0,ky:0,outT:0,iv:0,dot:null,st:null,cd:1.2,dm:e.dm0,t:Object.assign({},e.t0)});
 for(const q of projs)if(q.from==='e')q.dead=true;
 setToast(e.name+' RETURNS TO ITS POST','#aaa',2.5);fxRing(e.x,e.y,40,'#aaa',.4);}
function mkBoss(di,x,y,room){
 const b=BOSS[di],sc=b.sc||2;
 return {type:'boss',t:{wl:16,cdMin:.6,cdMax:1.2},t0:{wl:16,cdMin:.6,cdMax:1.2},hx:x,hy:y,dm0:1+.14*di,x,y,room,boss:true,name:b.name,b,hp:b.hp*BOSSHP*(1+.15*((R&&R.asc)||0)),maxhp:b.hp*BOSSHP*(1+.15*((R&&R.asc)||0)),posture:0,maxPosture:420+di*55,spd:b.spd,r:sc===3?13:9,dm:1+.14*di,awake:false,cd:1.2,act:null,stag:0,stun:0,pdelay:0,flash:0,kx:0,ky:0,tele:0,dot:null,di,phase:1,pref:b.pref,kit:b.k1,iv:0,z:0,sdir:1,wob:0,spr:BOSSSPR[di]||(BOSSSPR[di]=bossSheet(di))};
}
function setToast(s,c,t){toast={s,c:c||'#fff',t:t||2};}

// ---------- effects ----------
function spark(x,y,col,n,sp){for(let i=0;i<(n||6);i++){const a=Math.random()*TAU,s=rnd(.3,1)*(sp||70);particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,t:rnd(.2,.5),col});}}
function txtFx(x,y,s,col,sc){texts.push({x,y,s:String(s),col:col||'#fff',t:.9,sc:sc||1});}
// shared "this hit hard" feedback: shake, a brief freeze-frame, a screen flash and debris
let flashCol='#fff';
function impact(x,y,col,pow,flash){shake=Math.max(shake,pow);hitstop=Math.max(hitstop,Math.min(.09,pow*.008));if(flash){flashT=Math.max(flashT,.12);flashCol=col;}
 for(let i=0;i<pow*2;i++){const a=Math.random()*TAU,s=rnd(40,60+pow*14);particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,t:rnd(.25,.6),col:i%3?col:'#fff'});}}
function fxRing(x,y,max,col,dur){fx.push({k:'ring',x,y,max,t:dur||.3,dur:dur||.3,col});}

// ---------- projectiles ----------
// enemy bullets hit this many times harder than their listed damage (melee and contact hits are unchanged)
const ESHOT_DMG=2.5;
// the player's bullet hitbox: a round core in screen pixels (smaller while focusing with SHIFT)
const HITR=2.5,HITR_FOCUS=1.5;
const scrDist=q=>{const s=scrVec(q.x-P.x,q.y-P.y);return Math.hypot(s[0],s[1]);};
function mkProj(from,x,y,a,sp,dmg,o){if(from==='e'&&R&&R.asc)sp*=1+.06*R.asc;return Object.assign({from,x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,r:3,dmg,life:3,col:'#d44',pd:12,pierce:0,hit:new Set(),own:null,peril:false,arrow:false},o||{});}
// bullet styles: how a shot moves after it leaves the gun
function styleOf(a){const s=a.st;if(!s)return {};
 switch(s){case 'wave':return {st:s,wt:0,wa:a.wa||60,wf:a.wf||7};case 'accel':return {st:s,acc:a.acc||1.6,cap:a.cap||220};case 'curve':return {st:s,curve:a.curve||1.2};
  case 'boom':return {st:s,bt:0,bT:a.bT||1.6,life:a.bT?a.bT*1.05:1.7};case 'split':return {st:s,splitT:a.splitT||.9,r:5};case 'mine':return {st:s,fuse:a.fuse||1.3,r:4,life:4};case 'big':return {st:s,r:6};case 'star':return {st:s,r:3};}return {st:s};}
function enemyShoot(e,a,ang){if(e.blind>0)return;
 // regular enemies fire ~50% more bullets per volley (more bullet hell)
 const n=e.boss?a.cnt:Math.round(a.cnt*1.5*(a.ring||a.pat==='gapring'||a.pat==='flower'||a.pat==='wall'?1.3:a.pat?1.15:1)+(!a.pat&&!a.ring&&a.cnt>1?1:0)+(a.cnt===1&&!a.pat?1:0)),dm=a.dmg*e.dm,base=Object.assign({own:e,col:a.col,pd:a.pd,r:a.r||3,arrow:a.arrow},styleOf(a));
 const fire=(an,sp,o,x,y)=>{const q=mkProj('e',x==null?e.x:x,y==null?e.y:y,an,sp==null?a.sp:sp,dm,Object.assign({},base,o||{}));if(q.st==='boom'){q.bd=an;q.bs=sp==null?a.sp:sp;}projs.push(q);return q;};
 if(a.pat){const pa=Math.atan2(P.y-e.y,P.x-e.x);e._rep=(e._rep||0)+1;
  switch(a.pat){
   case 'gapring':{const gA=pa+((e._rep%3)-1)*.8,gW=a.gw||.45;for(let i=0;i<n;i++){const an=i/n*TAU+(e._rep*.13);if(Math.abs(angDiff(an,gA))<gW)continue;fire(an);}break;}
   case 'spiral':{e._spi=(e._spi||Math.random()*TAU)+(a.spin||.3);const arms=a.arms||3;for(let i=0;i<arms;i++)fire(e._spi+i/arms*TAU);break;}
   case 'wall':{const px=-Math.sin(pa),py=Math.cos(pa),hole=ri(1,n-3);for(let i=0;i<n;i++){if(i===hole||i===hole+1)continue;const o=(i-(n-1)/2)*9;fire(pa,null,null,e.x+px*o,e.y+py*o);}break;}
   case 'flower':{const off=e._rep*.2;for(let i=0;i<n;i++)fire(off+i/n*TAU,a.sp*(i%2?.6:1));break;}
   case 'stream':{for(let i=0;i<n;i++)fire(pa,a.sp*(.55+i*.12));break;}
   case 'cross':{const off=(e._rep%2)*Math.PI/4+(a.rot||0)*e._rep;for(let i=0;i<(a.dirs||4);i++)for(let j=0;j<n;j++)fire(off+i/(a.dirs||4)*TAU,a.sp*(.7+j*.15));break;}
   case 'mines':{for(let i=0;i<n;i++){const an=Math.random()*TAU,r=rnd(30,75);const x=P.x+Math.cos(an)*r,y=P.y+Math.sin(an)*r;if(solid(x,y))continue;const q=fire(0,0,null,x,y);q.vx=0;q.vy=0;spark(x,y,a.col,4,30);}break;}
   case 'curtain':{for(let i=0;i<n;i++){fire(pa+(i/(n-1)-.5)*1.4,a.sp,{curve:(i%2?1:-1)*(a.curve||.9),st:'curve'});}break;}
  }
  sfx('shoot');return;}
 if(a.ring){if(a.spin){a._sp=(a._sp||Math.random()*TAU)+a.spin;}const off=a.spin?a._sp:Math.random()*TAU;for(let i=0;i<n;i++)fire(off+i/n*TAU);}
 else for(let i=0;i<n;i++){const o=n===1?0:(i/(n-1)-.5)*a.spread*2;fire(ang+o,null,{r:a.arrow?2:(base.r||3)});}
 sfx('shoot');
}

// ---------- combat ----------
function wake(e){if(e.awake)return;e.awake=true;if(!e.boss)for(const o of enemies)if(o.room===e.room&&!o.boss)o.awake=true;}
function checkBreak(e){if(e.stag<=0&&e.posture>=e.maxPosture){e.stag=e.boss?3:3.5;e.act=null;e.tele=0;e.posture=e.maxPosture;e.air=false;e.z=0;txtFx(e.x,e.y,'BREAK!','#fd4');sfx('break');hitstop=.08;shake=Math.max(shake,4);spark(e.x,e.y,'#fd4',14,90);}}
function hurtE(e,dmg,pd,o){
 if(e.dead||e.air||e.iv>0)return;
 o=o||{};
 // which slot did this hit come from? abilities (not LMB) also carry enchants + scroll add-ons
 const src=o.src!==undefined?o.src:castSrc,AF=src&&src!=='m'&&!o.chain&&R?abFx(src):null;
 if(src==='m'&&!o.chain&&P&&P.sig)dmg*=SIGBONUS; // signature weapon bonus
 // deathblows need the Mortal Edge item; without it, staggered foes just take +50% damage
 if(e.stag>0&&o.slash&&S.dblow){deathblow(e);return;}if(e.stag>0)dmg*=1.5;
 let crit=false;if(o.slash&&Math.random()<S.crit+(AF?AF.crit:0)){dmg*=2;crit=true;}
 if(freezeT>0)dmg*=1.4;
 if(S.storm&&e.st&&(e.st.shock>0||e.st.burn>0))dmg*=1+.2*S.storm;
 if(e.st&&e.st.frozen>0&&!o.nost){dmg*=1.5;e.st.frozen=0;txtFx(e.x,e.y,'SHATTER','#cff');spark(e.x,e.y,'#cff',10,80);}
 if(e.elite==='armored')dmg*=.8;
 if(P&&P.rage>0)dmg*=1.3;e.hp-=dmg;
 // run stats: damage per source slot (m h q w f e), everything else (relics, procs, reflects) is 'x'
 if(R){R.dmg=R.dmg||{};const sk=src&&'mhqwfe'.includes(src)?src:'x';R.dmg[sk]=(R.dmg[sk]||0)+Math.max(0,dmg);}e.posture+=pd;e.pdelay=1.8;e.flash=.12;wake(e);
 const big=dmg>=S.atk*1.8;
 if(o.kb&&!e.boss){const km=(e.elite==='armored'?.3:1)*(o.kbm||(big?1.6:1));e.kx+=Math.cos(o.kb)*90*km;e.ky+=Math.sin(o.kb)*90*km;}
 if(big){e.flash=.18;spark(e.x,e.y,crit?'#ff4':'#fff',8,90);}
 // feel of power without screen shake: the foe recoils from the hit, big hits and crits burst, and hits build a combo
 {const ka=o.kb!=null?o.kb:(P?Math.atan2(e.y-P.y,e.x-P.x):0),kp=Math.min(5,1.5+dmg/Math.max(1,S.atk)*1.2);e.kick={a:ka,p:kp,t:.12};}
 if(big||crit)fx.push({k:'burst',x:e.x,y:e.y,t:.16,dur:.16,r:crit?26:18,n:crit?10:7,a0:Math.random(),col:crit?'#ff4':'#fff'});
 if(R&&!o.chain){R.combo=(time-(R.comboAt||-9)<2?(R.combo||0):0)+1;R.comboAt=time;R.bestCombo=Math.max(R.bestCombo||0,R.combo);if(R.combo%25===0){txtFx(P.x,P.y-14,R.combo+' HIT COMBO!','#ffd040',2);fx.push({k:'burst',x:P.x,y:P.y,t:.25,dur:.25,r:34,n:14,a0:0,col:'#ffd040'});}}
 txtFx(e.x,e.y,Math.round(dmg),crit?'#ff4':big?'#ffd080':'#fff',big&&dmg>=S.atk*3?2:1);sfx('hit');spark(e.x,e.y,crit?'#ff4':'#fff',4,50);
 if(o.slash&&!o.nost){
  if(o.el)applyStatus(e,o.el);
  if(S.burn&&Math.random()<.35+.15*S.burn)applyStatus(e,'burn');
  if(S.poison)applyStatus(e,'poison');
  if(S.frost&&Math.random()<.3+.15*S.frost)applyStatus(e,'chill');
  if(S.shock&&Math.random()<.18*S.shock){applyStatus(e,'shock');let nx=null,nd=70;for(const o2 of enemies){if(o2===e||o2.dead||o2.air||!los(e.x,e.y,o2.x,o2.y))continue;const d=dist(o2,e);if(d<nd){nd=d;nx=o2;}}if(nx){fx.push({k:'bolt',pts:[{x:e.x,y:e.y},{x:nx.x,y:nx.y}],t:.15,dur:.15});hurtE(nx,S.atk*.7,8,{nost:true,chain:true});}}
  if(S.vamp)P.hp=Math.min(S.maxhp,P.hp+dmg*.02*S.vamp);
  if(crit&&S.flare){fxRing(e.x,e.y,30,'#fd4',.25);for(const o2 of enemies){if(o2===e||o2.dead||o2.air)continue;if(dist(o2,e)<30+o2.r&&los(e.x,e.y,o2.x,o2.y))hurtE(o2,dmg*.5,10,{nost:true,chain:true});}}
 }
 // ability effects from enchants and scroll add-ons (also on zone/blast ticks, so traps and storms count)
 if(AF){
  if(AF.leech)P.hp=Math.min(S.maxhp,P.hp+dmg*.02*AF.leech);
  if(AF.blast){fxRing(e.x,e.y,26,'#fa4',.18);for(const o2 of enemies){if(o2===e||o2.dead||o2.air||dist(o2,e)>26+o2.r||!los(e.x,e.y,o2.x,o2.y))continue;hurtE(o2,dmg*.3*AF.blast,4,{nost:true,chain:true});}}
  if(AF.gale&&e.hp>0){e.posture+=pd*.5*AF.gale;if(!e.boss&&P){const a=Math.atan2(e.y-P.y,e.x-P.x);e.kx+=Math.cos(a)*70*AF.gale;e.ky+=Math.sin(a)*70*AF.gale;}}
  if(e.hp>0){
   if(AF.burn&&Math.random()<AF.burn)applyStatus(e,'burn');
   if(AF.poison)applyStatus(e,'poison');
   if(AF.chill&&Math.random()<AF.chill)applyStatus(e,'chill');
   if(AF.shock&&Math.random()<AF.shock){applyStatus(e,'shock');let nx=null,nd=70;for(const o2 of enemies){if(o2===e||o2.dead||o2.air||!los(e.x,e.y,o2.x,o2.y))continue;const d=dist(o2,e);if(d<nd){nd=d;nx=o2;}}
    if(nx){fx.push({k:'bolt',pts:[{x:e.x,y:e.y},{x:nx.x,y:nx.y}],t:.15,dur:.15});hurtE(nx,S.atk*.5,6,{nost:true,chain:true});}}
  }
 }
 if(e.hp<=0){killE(e);return;}
 checkBreak(e);
}
function deathblow(e){
 hitstop=.18;shake=Math.max(shake,8);sfx('break');R.deathblows++;
 txtFx(e.x,e.y,'DEATHBLOW','#f33');spark(e.x,e.y,'#f33',24,110);fxRing(e.x,e.y,30,'#f33',.3);
 if(S.dbHeal)P.hp=Math.min(S.maxhp,P.hp+S.maxhp*S.dbHeal);
 if(e.boss){e.hp-=e.maxhp*.03;e.stag=0;e.posture=0;e.pdelay=2.5;e.cd=1.3;if(e.hp<=0)killE(e);}
 else killE(e);
}
function killE(e){
 if(e.dead)return;e.dead=true;R.kills++;R.lastKill={x:e.x,y:e.y};
 // kill punch: a burst of speed-lines; elites and bosses also get a brief slow-motion beat
 fx.push({k:'burst',x:e.x,y:e.y,t:.2,dur:.2,r:e.boss?60:e.elite?40:22,n:e.boss?18:e.elite?14:9,a0:Math.random(),col:e.boss?'#ffd040':e.elite?'#f84':'#fff'});
 if(e.elite||e.boss){slowT=Math.max(slowT,e.boss?.6:.25);hitstop=Math.max(hitstop,.06);}
 if(R.training){trainEv('kill');spark(e.x,e.y,'#d8b860',14,70);return;}deathFx(e);sfx('kill');spark(e.x,e.y,e.boss?'#fd4':'#c33',e.boss?40:12,e.boss?140:80);
 if(S.kills)P.hp=Math.min(S.maxhp,P.hp+S.kills);
 if(!e.boss)P.ab.e=Math.max(0,P.ab.e-1.2*(1+S.ecd));
 if(e.elite==='volatile'){dh.push({x:e.x,y:e.y,r:34,t:.9,dur:.9,dmg:20*e.dm,col:'#f64'});txtFx(e.x,e.y,'VOLATILE!','#f64');}
 dropLoot(e);
 if(e.boss)onBossDead(e);
}
function dropPickup(x,y,k,v,id){const a=Math.random()*TAU,s=rnd(20,50);pickups.push({x,y,k,v,id,vx:Math.cos(a)*s,vy:Math.sin(a)*s,t:0});}
function dropLoot(e){
 const di=R.di,base=Math.round(rnd(2,4)*(1+di*.3)*S.sen*(e.boss?18:1));
 const n=e.boss?10:ri(1,2);for(let i=0;i<n;i++)dropPickup(e.x,e.y,'sen',Math.max(1,Math.round(base/n)));
 if(e.boss){dropBag(e.x+20,e.y+24,Math.random()<.3?GOLDBAG:TROPHY,true);return;} // the white royal bag is a rare boss prize
 // a promised bag (from a curse) drops from the next foe you kill
 if(R.bonusBag!=null){dropBag(e.x,e.y,R.bonusBag);R.bonusBag=null;}
 const LT=LOOT[lootKind(e)],lk=1/(1+.15*(R.asc||0));
 for(let i=0;i<LT.gold;i++)dropPickup(e.x,e.y,'sen',base);
 if(Math.random()<LT.pot)dropPickup(e.x,e.y,'pot',1);
 // bags: only heavies and elites carry them; basic foes never do
 for(const [tier,ch] of LT.bags)if(Math.random()<ch*lk){dropBag(e.x,e.y,tier==='good'?(R.di>=1?goodBag():2):tier);break;}
}
// ---- loot tables: what each kind of foe can drop ----
// basic: gold and the odd potion. heavy (brutes, shield bearers...): more gold, sometimes a plain bag. elite: a good bag.
const LOOT={
 basic:{gold:0,pot:.04,bags:[]},
 heavy:{gold:2,pot:.08,bags:[[2,.06],[1,.14],[0,.3]]},
 elite:{gold:4,pot:.4,bags:[['good',1]]}};
const lootKind=e=>e.elite?'elite':((ET[e.type]&&ET[e.type].hp)||0)>=70?'heavy':'basic';
function onBossDead(e){
 sfx('win');hitstop=.3;shake=10;boss=null;setToast('BOSS DEFEATED','#fd4',3);evolve();
 const ex=[];chooseOpts=[];for(let i=0;i<3;i++){const it=randItem(ex);ex.push(it.id);chooseOpts.push(it);}
 portal={x:e.x,y:e.y,t:0,pending:true};
 // let the evolution play out in full before the reward cards cover the screen
 setTimeout(()=>{if(mode==='play'&&portal&&portal.pending)mode='choose';},2800);
}
function pickChoice(i){if(!chooseOpts||!chooseOpts[i])return;applyItem(chooseOpts[i].id);chooseOpts=null;portal.pending=false;mode='play';sfx('pickup');setToast('PORTAL OPEN','#8cf',3);}
function clickChoose(){if(!chooseOpts)return;const cw=92,gap=8,x0=Math.round((W-(3*cw+2*gap))/2);for(let i=0;i<3;i++){const x=x0+i*(cw+gap);if(mouse.x>=x&&mouse.x<=x+cw&&mouse.y>=44&&mouse.y<=136){pickChoice(i);return;}}}
function applyItem(id){
 R.inv[id]=(R.inv[id]||0)+1;const old=S;S=calcStats();
 if(id==='hp')P.hp+=20;if(id==='gourd')R.pots=Math.min(POTMAX,R.pots+1);if(id==='rez'||id==='phoenix')P.rez++;
 P.hp=Math.min(P.hp,S.maxhp);setToast(fxLabel(ITEMBY[id].name,ITEMBY[id].r+1)+': '+ITEMBY[id].d,fxCol(id),2.5);
}
// ---------- loot bags, potions & gear ----------
// stat potions are permanent (saved), +1 point each, max 20 per stat
const STATS=[{k:'att',n:'ATTACK',c:'#f55',d:'+1 SPELL POWER'},{k:'def',n:'DEFENSE',c:'#ccc',d:'-1 DAMAGE TAKEN'},{k:'spd',n:'SPEED',c:'#6cf',d:'+1% MOVE SPEED'},
 {k:'dex',n:'DEXTERITY',c:'#f9c',d:'+2% CAST SPEED'},{k:'vit',n:'VITALITY',c:'#f84',d:'+5 MAX HP'},{k:'wis',n:'WISDOM',c:'#a8f',d:'-1% COOLDOWNS'}],STATMAX=20;
// 15 material tiers per slot; quality (common..legendary) multiplies the base stats and adds affixes
const GEARN={wpn:['BAMBOO','WILLOW','OAK','CEDAR','IRON','STEEL','SPIRIT','JADE','CORAL','MOON','STORM','PHOENIX','DRAGON','DIVINE','HEAVEN'],
 arm:['LINEN','HEMP','COTTON','SILK','PRIEST','MONK','ONMYO','SPIRIT','JADE','MOON','STORM','PHOENIX','DRAGON','DIVINE','CELESTIAL'],
 ring:['COPPER','TIN','BRONZE','SILVER','GOLD','JADE','PEARL','CORAL','OPAL','MOON','STORM','PHOENIX','DRAGON','DIVINE','HEAVEN']},TMAX=14;
const QUAL=[{n:'COMMON',c:'#c8c8c8',m:1},{n:'UNCOMMON',c:'#5fd35f',m:1.15},{n:'RARE',c:'#4aa0ff',m:1.3},{n:'EPIC',c:'#c060ff',m:1.5},{n:'LEGENDARY',c:'#ffb020',m:1.7}];
const AFX=[{k:'crit',d:'+8% CRIT'},{k:'aspd',d:'+12% CAST SPEED'},{k:'emb',d:'-10% COOLDOWNS'},{k:'vamp',d:'LIFESTEAL 2%'},{k:'qpow',d:'+30% Q POWER'},{k:'epow',d:'+25% R POWER'},{k:'iron',d:'-8% DAMAGE TAKEN'},{k:'ghost',d:'+6% DODGE'},{k:'magnet',d:'+15% GOLD'},{k:'shadow',d:'FASTER DASH'}];
// enchants are run-wide boosts for the abilities (RMB Q E F R) - never the LMB, which comes from your weapon
// ===== HOW THE POWER SYSTEMS DIFFER =====
// WEAPON   decides HOW your LMB attacks (its shape).          GEAR (armour/ring) = plain numbers.
// ENCHANT  an on-hit EFFECT on every ability (RMB Q E F R), chance-based, max 3 at once.
// SCROLL   rewrites ONE ability: replace it, or a guaranteed add-on just for that slot.
// RELIC    a run-wide RULE that touches everything you do.
// ===== EFFECT STYLES: one colour per kind of effect, everywhere it appears =====
// DAMAGE red, HEAL green, FIRE orange, FROST ice, STORM yellow, POISON lime, SPEED cyan, GUARD steel, CONTROL purple, WEALTH gold.
// Strength is a roman numeral: I = a chance / small, up to IV = guaranteed / huge.
const FXCOL={dmg:'#ff5050',heal:'#50e060',fire:'#ff8a30',frost:'#80d0ff',storm:'#ffe040',poison:'#a0ff40',speed:'#40e0e0',guard:'#b0b8d0',control:'#c080ff',wealth:'#ffd040'};
const FXNAME={dmg:'DAMAGE',heal:'HEAL',fire:'FIRE',frost:'FROST',storm:'STORM',poison:'POISON',speed:'SPEED',guard:'GUARD',control:'CONTROL',wealth:'WEALTH'};
const ROM=['I','II','III','IV','V'];
const FXK={fire:'fire',burn:'fire',frost:'frost',chill:'frost',shock:'storm',storm:'storm',poison:'poison',
 crit:'dmg',atk:'dmg',pierce:'dmg',blast:'dmg',qpow:'dmg',epow:'dmg',glass:'dmg',flare:'dmg',wave:'dmg',range:'dmg',emp:'dmg',dblow:'dmg',echo:'dmg',
 vamp:'heal',leech:'heal',blood:'heal',gourd:'heal',rez:'heal',phoenix:'heal',hunger:'heal',hp:'heal',
 aspd:'speed',cd:'speed',emb:'speed',spd:'speed',shadow:'speed',ecd:'speed',mikiri:'speed',
 iron:'guard',ghost:'guard',pos:'guard',parry:'guard',thorn:'guard',def:'guard',gale:'control',magnet:'wealth'};
const fxStyle=k=>FXK[k]||'dmg',fxCol=k=>FXCOL[fxStyle(k)];
const ENCH=[{k:'fire',n:'FLAME',d:'ABILITY HITS MAY BURN'},{k:'frost',n:'FROST',d:'ABILITY HITS MAY CHILL'},{k:'shock',n:'STORM',d:'ABILITY HITS MAY SHOCK + ARC'},
 {k:'poison',n:'VENOM',d:'ABILITY HITS POISON'},{k:'blast',n:'BLAST',d:'ABILITY HITS SPLASH 30% AROUND'},{k:'leech',n:'LEECH',d:'ABILITY HITS HEAL 2% OF DAMAGE'},
 {k:'gale',n:'GALE',d:'ABILITY HITS SHOVE + 50% POSTURE'}];
ENCH.forEach(e=>{e.c=fxCol(e.k);e.tier=1;});
const ENCHMAX=3;
let castSrc=null; // which slot the damage currently being dealt came from ('m' = LMB)
const enchN=k=>R&&R.ench?R.ench.filter(x=>x===k).length:0;
// everything extra an ability slot does: enchant chances (all abilities) + guaranteed scroll add-ons (that slot only)
function abFx(k){const a=(R&&R.addon&&R.addon[k])||{};
 return {burn:.35*enchN('fire')+(a.burn?1:0),chill:.3*enchN('frost')+(a.chill?1:0),shock:.2*enchN('shock')+(a.shock?1:0),poison:enchN('poison')||a.poison?1:0,
  blast:enchN('blast'),leech:enchN('leech'),gale:enchN('gale'),crit:.25*(a.crit||0),pierce:2*(a.pierce||0),cd:a.cd?1:0};}
// rarity is gated by depth: epics from dungeon III, legendaries (named) only in gold bags
function rollQ(di,bias){const w=[Math.max(12,60-6*di),28,8+2.5*di,2+2*di];let r=Math.random()*w.reduce((a,b)=>a+b,0),q=0;for(;q<3;q++){if((r-=w[q])<0)break;}q=clamp(q+(bias||0),0,3);if(di<2)q=Math.min(q,2);if(di<1&&!bias)q=Math.min(q,1);return q;}
const tierFor=(di,b)=>clamp(Math.floor(di*1.35)+ri(0,1)+(b||0),0,TMAX);
function gearVals(g){const t=g.tier,m=QUAL[g.q||0].m;return g.slot==='wpn'?{atk:Math.round((2+t*.9)*m)}:g.slot==='arm'?{hp:Math.round((6+t*4)*m),def:Math.round((1+t*.4)*m)}:{sv:Math.round((2+t*.5)*m)};}
function gearLines(g){const v=gearVals(g),L=['T'+(g.tier+1)+' '+QUAL[g.q||0].n+' '+(g.slot==='wpn'?wtName(g):SLOTNAME[g.slot])];
 if(g.slot==='wpn'){const v=wpnLMB(g),sp=SPELLS.m[v];L.push('LMB: '+sp.n+(g.rare&&v!==3?' (EMPOWERED)':'')+(isSig(g)?' SIGNATURE +25%':''));}
 if(v.atk)L.push('+'+v.atk+' POWER');if(v.hp)L.push('+'+v.hp+' HP  +'+v.def+' DEF');if(v.sv)L.push('+'+v.sv+' '+STATS.find(s=>s.k===g.stat).n);
 if(g.rd)L.push(g.rd);for(const a of g.aff||[])L.push(AFX.find(x=>x.k===a).d);for(const e of g.ench||[]){const E=ENCH.find(x=>x.k===e);L.push('ENCH '+E.n+': '+E.d);}
 const st=setOf(g);if(st)L.push(st+' SET PIECE');return L;}
const RARE=[
 {slot:'wpn',wt:'STAFF',n:'DRAGONROT STAFF',fx:{fire:1,poison:1},d:'EVERY ATTACK BURNS AND POISONS'},{slot:'wpn',wt:'CENSER',n:'MOONLIT WAND',fx:{aspd:3},d:'+36% CAST SPEED'},
 {slot:'wpn',wt:'STAFF',n:'KUSABIMARU ROD',fx:{crit:3},d:'+24% CRIT CHANCE'},{slot:'wpn',wt:'STAFF',n:'MORTAL STAFF',fx:{flare:1,glass:1},d:'CRITS EXPLODE. +40% POWER, -25% HP'},
 {slot:'wpn',wt:'KATANA',n:'CRIMSON MOON KATANA',fx:{crit:2,vamp:1},d:'+16% CRIT. HITS HEAL 2%'},{slot:'wpn',wt:'NAGINATA',n:'THUNDERCLAP NAGINATA',fx:{shock:1,storm:1},d:'HITS SHOCK. +DMG VS SHOCKED'},
 {slot:'arm',n:'SHINOBI GARB',fx:{shadow:2,ghost:2},d:'FASTER DASH, 12% DODGE'},{slot:'arm',n:'ASHINA ARMOUR',fx:{iron:3},d:'-22% DAMAGE TAKEN'},
 {slot:'arm',n:'HIGH PRIEST VESTMENT',fx:{emb:2},d:'-19% COOLDOWNS'},{slot:'arm',n:'BLOOD ROBE',fx:{vamp:2},d:'SPELLS HEAL 4% OF DAMAGE'},
 {slot:'ring',n:'RING OF ECHOES',fx:{echo:1},d:'SPELLS MAY CAST TWICE'},{slot:'ring',n:'FROSTBOUND BAND',fx:{frost:1,pierce:1},d:'SPELLS CHILL AND PIERCE'},
 {slot:'ring',n:'STORM SIGNET',fx:{shock:1,storm:1},d:'SPELLS SHOCK. ARC LIGHTNING'},{slot:'ring',n:'RING OF GREED',fx:{magnet:3,blood:1},d:'+GOLD, HEAL ON KILL'},
];
const SLOTNAME={wpn:'STAFF',arm:'ROBE',ring:'RING'},GEARG={wpn:'/',arm:'V',ring:'O'};
function mkGear(slot,tier,rare,q){
 tier=clamp(tier,0,TMAX);const g={t:'gear',slot,tier,rare:!!rare,q:rare?4:(q==null?rollQ(R?R.di:0,0):q),aff:[],ench:[]};
 if(rare){const opts=RARE.filter(x=>!slot||x.slot===slot),r=pick(opts);Object.assign(g,{slot:r.slot,name:r.n,fx:r.fx,rd:r.d});g.tier=Math.min(TMAX,tier+1);}
 if(g.slot==='wpn')g.wt=rare&&RARE.find(x=>x.n===g.name).wt||rollWT(); // weapon type: decides the LMB attack
 if(!rare)g.name=(g.q>=2?QUAL[g.q].n+' ':'')+GEARN[slot][g.tier]+' '+(g.slot==='wpn'?wtName(g):SLOTNAME[slot]);
 if(g.slot==='ring')g.stat=pick(STATS).k;
 const na=g.rare?1:g.q;const pool=AFX.map(a=>a.k);for(let i=0;i<na&&pool.length;i++)g.aff.push(pool.splice(ri(0,pool.length-1),1)[0]);
 return g;
}
function gearDesc(g){return gearLines(g).join('. ');}
// ---- item icons: every slot x tier x quality gets its own little sprite; legendaries are hand-styled ----
const MATC=['#c8b060','#a89060','#8a6a40','#a0603a','#8a8a96','#c0c8d4','#80c0ff','#40c080','#ff8a80','#d8e0ff','#80a0ff','#ff8040','#e04030','#fff0a0','#ffffff'];
const LEGLOOK={'CRIMSON MOON KATANA':['#c0c8d4','#d02838',2],'THUNDERCLAP NAGINATA':['#8a8a96','#ff6',2],'DRAGONROT STAFF':['#5a8a3a','#c03010',4],'MOONLIT WAND':['#d8e0ff','#8cf',1],'KUSABIMARU ROD':['#c0c8d4','#fff',2],'MORTAL STAFF':['#2a2230','#ff2040',4],
 'SHINOBI GARB':['#2a2a3a','#c8f'],'ASHINA ARMOUR':['#8a6a40','#e0b040'],'HIGH PRIEST VESTMENT':['#e8e0c0','#d02030'],'BLOOD ROBE':['#8a1020','#ff4050'],
 'RING OF ECHOES':['#c0c8d4','#8cf'],'FROSTBOUND BAND':['#a8d0f0','#fff'],'STORM SIGNET':['#e0b040','#ff6'],'RING OF GREED':['#e0b040','#40c080']};
const ICONC={};
function itemIcon(it){const key=it.t==='gear'?it.slot+it.tier+'_'+(it.q||0)+(it.rare?it.name:'')+(it.slot==='wpn'?wtName(it):''):it.t+(it.s||it.k||'');if(ICONC[key])return ICONC[key];
 const fr=mk(12,12,g=>{const R=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h);};
  if(it.t==='gear'){const L=it.rare?LEGLOOK[it.name]:null,q=it.rare?4:(it.q||0),m=L?L[0]:MATC[it.tier],gem=L?L[1]:QUAL[q].c;
   // palette for the pixel maps: m material (tier), M its shadow, g quality accent, w glint, s/S steel, h grip, y gold, r red, p paper
   const PC={m,M:shade(m,-.35),g:gem,w:'#ffffff',s:'#d8e0ea',S:'#8a92a0',h:'#3a2a2a',y:q>=4?'#ffd040':'#c8a040',r:'#d02838',p:'#f0e8d0'};
   const map=rows=>rows.forEach((row,y)=>{for(let x=0;x<row.length;x++){const c=PC[row[x]];if(c)R(x,y,1,1,c);}});
   if(it.slot==='wpn'){map(WICON[wtName(it)]||WICON.STAFF);
    if(q>=2){R(0,11,1,1,gem);} // rare+: accent wrap on the pommel
   }
   else if(it.slot==='arm'){R(3,1,6,2,m);R(2,3,8,8,m);R(1,4,2,4,m);R(9,4,2,4,m);R(5,1,2,4,shade(m,-.35));R(2,10,8,1,gem);R(4,6,4,1,gem);R(3,3,1,7,shade(m,.25));
    if(q>=3){R(1,3,2,2,gem);R(9,3,2,2,gem);R(5,4,2,1,gem);} // epic: shoulder guards and a sash knot
    if(q>=4){R(2,10,8,1,'#ffd040');R(5,5,2,2,'#fff');R(5,6,2,1,'#ffd040');}}
   else{for(const [x,y] of [[3,4],[4,3],[5,3],[6,3],[7,3],[8,4],[9,5],[9,6],[8,8],[7,9],[6,9],[5,9],[4,9],[3,8],[2,6],[2,5],[3,7],[9,7]])R(x,y+1,1,1,m);
    if(q>=3){R(3,0,6,3,gem);R(4,0,2,1,'#fff');R(2,1,1,1,PC.y);R(9,1,1,1,PC.y);}else{R(4,0,4,3,gem);R(5,0,1,1,'#fff');}}
   // epic: violet aura; legendary: golden aura with star glints
   if(q>=3){const d=g.getImageData(0,0,12,12).data,glow=q>=4?'rgba(255,200,60,.55)':'rgba(180,90,255,.5)';g.fillStyle=glow;
    for(let y=0;y<12;y++)for(let x=0;x<12;x++){if(d[(y*12+x)*4+3])continue;let n=false;for(const [ax,ay] of [[1,0],[-1,0],[0,1],[0,-1]]){const X=x+ax,Y=y+ay;if(X>=0&&Y>=0&&X<12&&Y<12&&d[(Y*12+X)*4+3]>200){n=true;break;}}if(n)g.fillRect(x,y,1,1);}
    if(q>=4){R(0,0,1,1,'#fff6c0');R(11,6,1,1,'#fff6c0');R(1,1,1,1,'#ffd040');}}}
  else if(it.t==='hp'||it.t==='stat'){const c=it.t==='hp'?'#e33':STATS.find(s=>s.k===it.s).c;R(5,0,2,2,'#c8a070');R(4,2,4,1,'#ddd');R(3,3,6,8,'#ddd');R(4,5,4,5,c);R(4,5,1,2,'#fff');}
  else if(it.t==='scroll'){R(2,2,8,8,'#f0e0b0');R(1,1,10,2,'#c89a50');R(1,9,10,2,'#c89a50');R(4,4,4,1,'#d02030');R(4,6,3,1,'#d02030');R(5,7,2,1,'#ffe060');}
  else if(it.t==='ench'){const c=ENCH.find(x=>x.k===it.k).c;R(5,0,2,12,c);R(0,5,12,2,c);R(3,3,6,6,c);R(4,4,4,4,'#14101a');R(5,5,2,2,'#fff');}
  else if(it.t==='relic'){R(3,2,6,8,'#e0b040');R(4,3,4,6,'#fff0a0');R(5,0,2,2,'#e0b040');}});
 return ICONC[key]=outlined(fr);}
function drawItemIcon(it,x,y,frame){const q=it&&it.t==='gear'?(it.rare?4:(it.q||0)):0;
 if(frame!==false){let c=it&&it.t==='gear'?QUAL[q].c:it?itemCol(it):'#333';if(q>=3&&Math.floor(time*3)%2)c=shade(c,.35);
  ctx.fillStyle='#14101a';ctx.fillRect(x-1,y-1,16,16);ctx.fillStyle=c;ctx.fillRect(x-1,y-1,16,1);ctx.fillRect(x-1,y+14,16,1);ctx.fillRect(x-1,y-1,1,16);ctx.fillRect(x+14,y-1,1,16);
  ctx.fillStyle=q>=4?'#2a2010':q>=3?'#221630':'#1e1828';ctx.fillRect(x,y,14,14);
  // legendary: a sparkle runs around the frame
  if(q>=4){const k=Math.floor(time*20)%60,side=Math.floor(k/15),o=k%15,P2=[[x-1+o,y-1],[x+14,y-1+o],[x+14-o,y+14],[x-1,y+14-o]][side];ctx.fillStyle='#fff';ctx.fillRect(P2[0],P2[1],1,1);}}
 if(it)ctx.drawImage(itemIcon(it),x+1,y+1);}
// 12x12 weapon icons per type (see the palette in itemIcon)
const WICON={
 STAFF:['........ggg.','.......gwgg.','.......gggm.','......mM....','.....m......','....mM......','...m........','..mM........','.m..........','m...........','............','............'],
 'WAR FAN':['............','.mgmgmgmgm..','mgmgmgmgmgm.','gmgmgmgmgmg.','.mgmgmgmgm..','..mgmgmgm...','...mgmgm....','....mgm.....','.....y......','.....h......','.....h......','............'],
 CENSER:['.....S......','.....S..w...','.....S.w....','....yyy.w...','...ymmmy....','...mgggm....','...mmmmm....','....MMM.....','.....M......','............','............','............'],
 KATANA:['...........w','..........ws','.........ws.','........ws..','.......ws...','......ws....','....yys.....','....yy......','...hg.......','..hh........','.hg.........','h...........'],
 NAGINATA:['..........ss','.........sw.','........sw..','.......yg...','......m.....','.....m......','....m.......','...m........','..M.........','.m..........','M...........','............'],
 ODACHI:['..........ws','.........wsS','........wsS.','.......wsS..','......wsS...','.....wsS....','...yywS.....','...yy.......','..hg........','.hh.........','hg..........','............'],
 YUMI:['....mm......','...m..w.....','..m...w.....','..m...w.....','.m....w.....','.g....w.....','.g....w.....','.m....w.....','..m...w.....','..m...w.....','...m..w.....','....mm......'],
 HANKYU:['............','...mm.......','..m..w......','.m...w......','.m...w......','.g...w......','ysssssssssw.','.m...w......','.m...w......','..m..w......','...mm.......','............'],
 REPEATER:['............','mm........mm','..mm....mm..','....mmmm....','.....hh.....','.....hg.....','.....hh.....','.....hh.....','....hhhh....','.....hh.....','............','............'],
 KUNAI:['...........w','..........ws','.........wsS','........wsS.','.......SsS..','......yS....','.....hy.....','....hh......','...gh.......','..g.g.......','...g........','............'],
 SHURIKEN:['.....w......','.....s......','....sSs.....','....sSs.....','.sssSgSsss..','wsSSg.gSSsw.','.sssSgSsss..','....sSs.....','....sSs.....','.....s......','.....w......','............'],
 KUSARIGAMA:['....sssw....','...s....w...','...s........','...yh.......','....h.......','....h.......','....hg......','.....S.S.S..','......S.S.S.','............','............','............'],
 OFUDA:['...pppppp...','...pprrpp...','...pprrpp...','...pppppp...','...prrrrp...','...pprppp...','...pprrrp...','...pppppp...','...pgggpp...','...pppppp...','....p..p....','............'],
 'SUZU BELL':['....yyy.....','...ygygy....','...yyyyy....','..yyw.yyy...','...yy.yy....','.....h......','.....h......','.....g......','.....h......','.....h......','....rrr.....','............'],
 'SPIRIT MIRROR':['...mmmm.....','..mwwsSm....','.mwwssSSm...','.mwsssSSm...','.msssSSSm...','..msSSSm....','...mmmm.....','.....h......','.....h......','....hgh.....','...hhhhh....','............']};
function mkEnch(){return {t:'ench',k:pick(ENCH).k};}
function applyEnch(it){R.ench=R.ench||[];const E=ENCH.find(x=>x.k===it.k);
 if(R.ench.includes(it.k)){setToast('ALREADY ENCHANTED WITH '+E.n,'#aaa',1.5);return false;}
 let lost='';if(R.ench.length>=ENCHMAX)lost=' (REPLACES '+ENCH.find(x=>x.k===R.ench.shift()).n+')';R.ench.push(it.k);S=calcStats();
 setToast('ENCHANT '+E.n+': '+E.d+lost,E.c,3);sfx('rare');spark(P.x,P.y,E.c,20,80);return true;}
function itemName(it){return it.t==='ench'?'ENCHANT '+ENCH.find(x=>x.k===it.k).n+' I: '+ENCH.find(x=>x.k===it.k).d:it.t==='scroll'?'LEGENDARY SCROLL: CHOOSE 1 OF 3 POWERS':it.t==='hp'?'HP POTION':it.t==='stat'?'POTION OF '+STATS.find(s=>s.k===it.s).n:it.t==='relic'?ITEMBY[it.id].name:it.name;}
function itemCol(it){if(it.t==='gear')return QUAL[it.q||0].c;if(it.t==='ench')return ENCH.find(x=>x.k===it.k).c;return it.t==='scroll'?(Math.floor(time*4)%2?'#ffe060':'#fff'):it.t==='hp'?'#e33':it.t==='stat'?STATS.find(s=>s.k===it.s).c:it.t==='relic'?RCOL[ITEMBY[it.id].r]:it.rare?'#fd4':'#ddd';}
// bag tiers: 0 brown (common), 1 purple (potions/gear), 2 gold (rare gear)
function bagContents(tier,boss){
 const di=R.di,it=[],slot=()=>pick(['wpn','arm','ring']),gear=(b,q)=>mkGear(slot(),tierFor(di,b),false,q==null?rollQ(di,0):q);
 if(tier===1||tier===2){ // green pack / blue satchel: a decent piece of gear plus extras
  it.push(gear(0,rollQ(di,tier-1)));if(Math.random()<.1)it.push({t:'hp'});if(tier===2&&Math.random()<.3)it.push({t:'stat',s:pick(STATS).k});if(Math.random()<.1*tier)it.push(mkEnch());}
 else if(tier===0){ // brown: 1-3 small things
  if(Math.random()<.08)it.push({t:'hp'});if(Math.random()<.45||!it.length)it.push(gear(-1,rollQ(di,-1)));if(di>=1&&Math.random()<.08)it.push(mkEnch());}
 else if(tier===3){ // purple: 2-4 things, better gear
  it.push(gear(0,rollQ(di,1)));if(Math.random()<.45)it.push({t:'stat',s:pick(STATS).k});if(Math.random()<.3)it.push(mkEnch());if(Math.random()<.2)it.push({t:'relic',id:randItem(['rez']).id});if(Math.random()<.15)it.push({t:'hp'});}
 else if(tier===5){ // enchanter pouch: two different enchants, sometimes a scroll
  const a=mkEnch();let b=mkEnch();for(let i=0;i<5&&b.k===a.k;i++)b=mkEnch();it.push(a,b);if(Math.random()<.25)it.push({t:'scroll'});}
 else if(tier===6){ // scholar case: a guaranteed legendary scroll and an elixir
  it.push({t:'scroll'},{t:'stat',s:pick(STATS).k});if(Math.random()<.3)it.push({t:'relic',id:randItem(['rez']).id});}
 else if(tier===7){ // war chest: two epic pieces, one of them a weapon
  it.push(mkGear('wpn',tierFor(di,1),false,3),gear(1,3));}
 else if(tier===8){ // shogun's trophy (the usual boss bag): two epics, maybe a scroll and an enchant, an elixir
  it.push(mkGear('wpn',tierFor(di,1),false,3),gear(1,3),{t:'stat',s:pick(STATS).k});if(Math.random()<.5)it.unshift({t:'scroll'});if(Math.random()<.5)it.push(mkEnch());}
 else if(tier===9){ // jade casket: an epic ring and elixirs
  it.push(mkGear('ring',tierFor(di,1),false,3),{t:'stat',s:pick(STATS).k});if(Math.random()<.4)it.push({t:'stat',s:pick(STATS).k});}
 else if(tier===10){ // monk's bundle: relics, sometimes a potion
  const a=randItem(['rez']);it.push({t:'relic',id:a.id});if(Math.random()<.5)it.push({t:'relic',id:randItem(['rez',a.id]).id});if(Math.random()<.3)it.push({t:'hp'});}
 else if(tier===11){ // assassin kit: an epic weapon of ANY type (off-class finds) and an enchant
  const g=mkGear('wpn',tierFor(di,1),false,3);g.wt=pick(Object.keys(WTYPES));g.name=QUAL[3].n+' '+GEARN.wpn[g.tier]+' '+g.wt;it.push(g,mkEnch());}
 else{ // royal bag (super rare, white): always a named legendary, plus extras
  it.push(mkGear(null,tierFor(di,1),true));
  if(Math.random()<.5)it.push({t:'stat',s:pick(STATS).k});
  if(Math.random()<(boss?.5:.25))it.unshift({t:'scroll'});
  if(boss){it.push(mkGear('wpn',tierFor(di,1),false,Math.min(3,1+rollQ(di,0))),mkEnch(),{t:'hp'},{t:'stat',s:pick(STATS).k});}}
 return it;
}
// bag tiers: 0 sack, 1 pack (green), 2 satchel (blue), 3 pouch (purple), 4 royal bag (gold)
const BAGCOL=['#c8995a','#6ac85a','#5aa0f0','#b070f0','#fff4c0','#5ad8c8','#e05060','#c8d0e0','#e05040','#6ad89a','#f8c060','#9a7ad0'],
 BAGN=['SACK','PACK','SATCHEL','POUCH','ROYAL BAG','ENCHANTER POUCH','SCHOLAR CASE','WAR CHEST',"SHOGUN'S TROPHY",'JADE CASKET',"MONK'S BUNDLE",'ASSASSIN KIT'],GOLDBAG=4,TROPHY=8;
// a random "good" bag (epics, enchants, scrolls, relics). The white royal bag is NOT in this pool: it is super rare.
const goodBag=()=>wpick([{t:3,wt:4},{t:5,wt:2},{t:6,wt:2},{t:7,wt:2},{t:9,wt:2},{t:10,wt:2},{t:11,wt:2}]).t;
// a promised reward bag (curse, challenge): usually a good bag, very rarely the royal one
const rewardBag=()=>Math.random()<.1?GOLDBAG:goodBag();
function dropBag(x,y,tier,boss){const a=Math.random()*TAU,s=rnd(15,35);
 pickups.push({x,y,k:'bag',tier,items:bagContents(tier,boss),vx:Math.cos(a)*s,vy:Math.sin(a)*s,t:0,z:2,vz:[80,90,100,115,150][tier]});
 if(tier===GOLDBAG){sfx('rare');spark(x,y,'#fff6c0',30,120);spark(x,y,'#fff',12,80);fxRing(x,y,30,'#fff6c0',.5);setToast('* ROYAL BAG: A LEGENDARY AWAITS *','#fff6c0',3);}
 else if(tier>=5){spark(x,y,BAGCOL[tier],14,80);fxRing(x,y,20,BAGCOL[tier],.35);}
}
function bagLand(k){const c=BAGCOL[k.tier];spark(k.x,k.y,k.tier===0?'#8a7a60':c,k.tier===4?16:6,k.tier===4?70:40);
 if(k.tier===4){fxRing(k.x,k.y,22,'#ffd040',.4);fxRing(k.x,k.y,12,'#fff',.25);shake=Math.max(shake,3);sfx('coin');}}
const nearBag=()=>{let best=null,bd=14;for(const k of pickups){if(k.k!=='bag'||k.dead)continue;const d=dist(k,P);if(d<bd){bd=d;best=k;}}return best;};
function lootBag(b){ // auto-collect potions/relics, auto-equip into empty slots; better gear waits for G
 if(!b.opened){for(const it of b.items)if(it.t==='gear'&&it.rare)codexAdd('gear',it.name);b.opened=true;b.pop=.25;spark(b.x,b.y,BAGCOL[b.tier],b.tier===4?40:10,b.tier===4?140:60);
  if(b.tier===4){spark(b.x,b.y,'#fff',16,100);fxRing(b.x,b.y,34,'#ffd040',.5);fxRing(b.x,b.y,20,'#fff',.3);sfx('rare');hitstop=Math.max(hitstop,.06);}}
 for(let i=b.items.length-1;i>=0;i--){const it=b.items[i];let took=false;
  if(it.t==='hp'){if(R.pots<POTMAX){R.pots++;took=true;txtFx(P.x,P.y,'+HP POTION','#e33');}}
  else if(it.t==='stat'){const st=STATS.find(s=>s.k===it.s);if(meta.stats[it.s]<STATMAX){meta.stats[it.s]++;saveMeta();S=calcStats();setToast(st.n+' +1  ('+meta.stats[it.s]+'/'+STATMAX+')',st.c,2.5);}else{R.sen+=40;txtFx(P.x,P.y,st.n+' MAXED +40 GOLD','#fc4');}took=true;}
  else if(it.t==='relic'){applyItem(it.id);took=true;}
  else if(it.t==='gear'&&!R.eq[it.slot]){R.eq[it.slot]=it;S=calcStats();setToast('EQUIPPED '+it.name,itemCol(it),2.5);took=true;}
  if(took){b.items.splice(i,1);sfx('pickup');}
 }
 if(!b.items.length)b.dead=true;
}
// ---- bag panel: stand on a bag to see everything inside; 1-6 take one item, G takes all ----
function cmpLine(g){const cur=R.eq[g.slot];if(!cur)return {s:'EMPTY SLOT',c:'#6f6'};const a=gearVals(g),b=gearVals(cur),k=a.atk!=null?'atk':a.hp!=null?'hp':'sv',d=a[k]-b[k];return {s:(d>0?'+':'')+d+(k==='atk'?' POWER':k==='hp'?' HP':' STAT')+' VS NOW',c:d>0?'#6f6':d<0?'#f66':'#aaa'};}
function drawBagPanel(b){const n=Math.min(6,b.items.length);if(!n)return;const w=260,h=15+n*13,x=Math.round((W-w)/2),y=H-32-h;
 ctx.fillStyle='rgba(8,6,12,.92)';ctx.fillRect(x,y,w,h);ctx.fillStyle=BAGCOL[b.tier];ctx.fillRect(x,y,w,1);ctx.fillRect(x,y+h-1,w,1);
 txt(BAGN[b.tier],x+4,y+3,BAGCOL[b.tier]);txt('1-'+n+' TAKE   G ALL',x+w-4-txtW('1-'+n+' TAKE   G ALL'),y+3,'#888');
 for(let i=0;i<n;i++){const it=b.items[i],yy=y+12+i*13;txt((i+1)+'',x+4,yy+3,'#fff');ctx.drawImage(itemIcon(it),x+11,yy);const nm=itemName(it),cat=itemCat(it);txt(nm.length>40?nm.slice(0,39)+'.':nm,x+26,yy,itemCol(it));
  if(it.t==='gear'){txt(gearLines(it).slice(0,2).join('  ').slice(0,40),x+26,yy+7,'#888');const c=cmpLine(it);txt(c.s,x+w-4-txtW(c.s),yy+3,c.c);}
  else txt((cat.n+': '+cat.d).slice(0,52),x+26,yy+7,cat.c);}}
// every pickup belongs to one category with one job, shown wherever it appears
function itemCat(it){
 if(it.t==='gear')return it.slot==='wpn'?{n:'WEAPON',c:'#e8eef6',d:'SETS YOUR LMB ATTACK'}:{n:'GEAR',c:'#aaa',d:'STATS'};
 if(it.t==='ench')return {n:'ENCHANT',c:ENCH.find(x=>x.k===it.k).c,d:'ON-HIT EFFECT FOR ALL ABILITIES'};
 if(it.t==='scroll')return {n:'SCROLL',c:'#ffe060',d:'REWRITES ONE ABILITY'};
 if(it.t==='hp')return {n:'POTION',c:'#e55',d:'HEAL WITH C'};
 if(it.t==='stat')return {n:'ELIXIR',c:'#f9c',d:'PERMANENT STAT, KEPT FOREVER'};
 if(it.t==='relic')return {n:'RELIC',c:'#c6f',d:'RUN-WIDE RULE'};
 return {n:'ITEM',c:'#aaa',d:''};}
function takeItem(b,i){const it=b.items[i];if(!it)return;let ok=true;
 if(it.t==='gear'){const old=R.eq[it.slot];R.eq[it.slot]=it;b.items.splice(i,1);if(old){if(R.pack.length<PACKMAX)R.pack.push(old);else b.items.push(old);}S=calcStats();P.hp=Math.min(S.maxhp,P.hp);setToast('EQUIPPED '+it.name,itemCol(it),2);sfx('pickup');if(it.rare)codexAdd('gear',it.name);}
 else if(it.t==='scroll'){const bb={items:[it]};learnScroll(bb);b.items.splice(i,1);}
 else if(it.t==='ench'){ok=applyEnch(it);if(ok)b.items.splice(i,1);}
 else if(it.t==='hp'){if(R.pots<POTMAX){R.pots++;b.items.splice(i,1);sfx('pickup');}else{P.hp=Math.min(S.maxhp,P.hp+S.maxhp*.2);b.items.splice(i,1);sfx('heal');}}
 else{lootBag(b);}
 if(!b.items.length)b.dead=true;}
function takeAll(b){for(let i=b.items.length-1;i>=0;i--){const it=b.items[i];
  if(it.t==='gear'){if(!R.eq[it.slot])takeItem(b,i);else if(R.pack.length<PACKMAX){R.pack.push(it);b.items.splice(i,1);}}
  else if(it.t==='scroll'||it.t==='ench'||it.t==='hp')takeItem(b,i);}
 sfx('pickup');if(b.items.length)setToast('PACK FULL - SOME ITEMS LEFT','#f66',1.5);if(!b.items.length)b.dead=true;}
// ---- legendary scrolls: choose 1 of 3. REPLACE swaps a slot's whole spell; ADD-ON keeps it and stacks an effect on top ----
// scroll add-ons are guaranteed and only for the chosen slot (unlike enchants, which are chances on every ability)
const ADDONS=[{k:'burn',n:'ALWAYS BURNS',tier:3},{k:'chill',n:'ALWAYS CHILLS',tier:3},{k:'shock',n:'ALWAYS SHOCKS + ARCS',tier:3},{k:'poison',n:'ALWAYS POISONS',tier:3},
 {k:'crit',n:'+25% CRIT CHANCE',tier:3},{k:'pierce',n:'SHOTS PIERCE +2',tier:2},{k:'cd',n:'COOLDOWN -40%',tier:3},{k:'emp',n:'EMPOWERED: +60% POWER -30% COOLDOWN',tier:4}];
ADDONS.forEach(a=>a.c=fxCol(a.k));
const fxLabel=(n,t)=>n+' '+ROM[t-1];
let scrollOpts=null;
function rollScrollOpts(){const slots=[...'hqwfe'],used=new Set();
 const rep=()=>{for(let t=0;t<40;t++){const k=pick(slots);if(used.has(k))continue;const vs=[];for(let v=0;v<SPELLS[k].length;v++)if(v!==P.lo[k])vs.push(v);if(!vs.length)continue;used.add(k);return {kind:'rep',k,v:pick(vs)};}return null;};
 const add=()=>{for(let t=0;t<40;t++){const k=pick(slots);if(used.has(k))continue;const L=ADDONS.filter(a=>!(a.k==='emp'&&P.emp&&P.emp[k]));used.add(k);return {kind:'add',k,a:pick(L).k};}return null;};
 return [rep()||add(),add()||rep(),Math.random()<.5?(rep()||add()):(add()||rep())].filter(Boolean);}
function learnScroll(b){const i=b.items.findIndex(it=>it.t==='scroll');if(i<0)return false;b.items.splice(i,1);if(!b.items.length)b.dead=true;
 scrollOpts=rollScrollOpts();if(scrollOpts.length){mode='scroll';sfx('rare');}return true;}
function pickScroll(i){const o=scrollOpts&&scrollOpts[i];if(!o)return;const k=o.k,cur=SPELLS[k][P.lo[k]];
 if(o.kind==='rep'){P.lo[k]=o.v;if(o.v===3)codexAdd('sp',k);setToast(SLOTKEY[k]+' REPLACED: '+cur.n+' > '+SPELLS[k][o.v].n,'#ff9040',3.5);}
 else if(o.a==='emp'){P.emp=P.emp||{};P.emp[k]=1;setToast(cur.n+' EMPOWERED','#ffe060',3);}
 else{R.addon=R.addon||{};R.addon[k]=R.addon[k]||{};R.addon[k][o.a]=(R.addon[k][o.a]||0)+1;const A=ADDONS.find(a=>a.k===o.a);setToast(cur.n+': '+fxLabel(A.n,A.tier),A.c,3);}
 if(k==='w')P.ab.rmb=0;else P.ab[k]=0;
 scrollOpts=null;mode='play';sfx('rare');impact(P.x,P.y,'#ffe060',6,true);fxRing(P.x,P.y,40,'#ffe060',.5);spark(P.x,P.y,'#fff',20,100);}
const SCARD={w:96,gap:6,y:38,h:126};
function scrollCardX(i){const n=scrollOpts.length;return Math.round((W-(n*SCARD.w+(n-1)*SCARD.gap))/2)+i*(SCARD.w+SCARD.gap);}
function clickScroll(){if(!scrollOpts)return;for(let i=0;i<scrollOpts.length;i++){const x=scrollCardX(i);if(mouse.x>=x&&mouse.x<=x+SCARD.w&&mouse.y>=SCARD.y&&mouse.y<=SCARD.y+SCARD.h){pickScroll(i);return;}}}
function wrapTxt(s,n){const L=[];let c='';for(const w of s.split(' ')){if(c&&(c+' '+w).length>n){L.push(c);c=w;}else c=c?c+' '+w:w;}if(c)L.push(c);return L;}
function renderScroll(){
 renderPlay();ctx.fillStyle='rgba(0,0,0,.8)';ctx.fillRect(0,0,W,H);
 ctxt('LEGENDARY SCROLL',8,'#ffe060',2);ctxt('CHOOSE ONE  (CLICK OR PRESS 1 2 3)',26,'#ccc');
 const {w:cw,y,h}=SCARD;
 scrollOpts.forEach((o,i)=>{const x=scrollCardX(i),rep=o.kind==='rep',tc=rep?'#ff9040':'#6f6',hov=mouse.x>=x&&mouse.x<=x+cw&&mouse.y>=y&&mouse.y<=y+h,cur=SPELLS[o.k][P.lo[o.k]];
  ctx.fillStyle=hov?'#2a1a30':'#160e1a';ctx.fillRect(x,y,cw,h);ctx.fillStyle=tc;ctx.fillRect(x,y,cw,2);ctx.fillRect(x,y+h-1,cw,1);ctx.fillRect(x,y,1,h);ctx.fillRect(x+cw-1,y,1,h);
  txt('['+(i+1)+']',x+4,y+5,'#aaa');const tag=rep?'REPLACE':'ADD-ON';txt(tag,x+cw-4-txtW(tag),y+5,tc);
  ctxt2(SLOTKEY[o.k]+' SLOT',x,cw,y+16,'#fff');
  // the ability's picture: what the slot will be after this choice
  spellBox(x+6,y+12,rep?SPELLS[o.k][o.v]:cur,true);
  if(rep){const nw=SPELLS[o.k][o.v],ow=txtW(cur.n);
   ctxt2(cur.n,x,cw,y+28,'#777');ctx.fillStyle='#c33';ctx.fillRect(Math.round(x+(cw-ow)/2),y+30,ow,1);
   ctxt2('V',x,cw,y+37,tc);ctxt2(nw.n,x,cw,y+46,nw.c);if(nw.rare)ctxt2('LEGENDARY SPELL',x,cw,y+55,'#ffe060');
   wrapTxt(nw.d,22).slice(0,4).forEach((l,j)=>ctxt2(l,x,cw,y+66+j*8,'#ccc'));
   ctxt2('CHANGES THE',x,cw,y+h-20,tc);ctxt2('WHOLE ATTACK',x,cw,y+h-12,tc);}
  else{const A=ADDONS.find(a=>a.k===o.a);
   ctxt2(cur.n,x,cw,y+28,cur.c);ctxt2('+',x,cw,y+38,tc);wrapTxt(fxLabel(A.n,A.tier),22).forEach((l,j)=>ctxt2(l,x,cw,y+47+j*8,A.c));
   wrapTxt(cur.d,22).slice(0,3).forEach((l,j)=>ctxt2(l,x,cw,y+72+j*8,'#888'));
   ctxt2('KEEPS YOUR',x,cw,y+h-20,tc);ctxt2('ATTACK',x,cw,y+h-12,tc);}
 });
}
function swapGear(b){const i=b.items.findIndex(it=>it.t==='gear');if(i<0)return false;const g=b.items[i],old=R.eq[g.slot];b.items.splice(i,1);
 let msg='';if(old){if(R.pack.length<PACKMAX){R.pack.push(old);msg='  ('+old.name+' TO PACK)';}else{b.items.push(old);msg='  (PACK FULL)';}}
 R.eq[g.slot]=g;S=calcStats();P.hp=Math.min(S.maxhp,P.hp);setToast('EQUIPPED '+g.name+msg,itemCol(g),2.5);sfx('pickup');if(!b.items.length)b.dead=true;return true;}
// ---- backpack: carry up to 8 spare pieces of gear for the run ----
const PACKMAX=8;let invOpen=false,invHover=-1;
function closeInv(){invOpen=false;mouse.down=false;mouse.rdown=false;}
function equipFromPack(i){const g=R.pack[i];if(!g)return;const old=R.eq[g.slot];R.eq[g.slot]=g;if(old)R.pack[i]=old;else R.pack.splice(i,1);S=calcStats();P.hp=Math.min(S.maxhp,P.hp);setToast('EQUIPPED '+g.name,itemCol(g),2);sfx('pickup');}
function quickSwap(){const i=R.pack.findIndex(g=>g.slot==='wpn');if(i<0){setToast('NO SPARE WEAPON IN PACK','#aaa',1.5);return;}const g=R.pack.splice(i,1)[0],old=R.eq.wpn;R.eq.wpn=g;if(old)R.pack.push(old);S=calcStats();P.hp=Math.min(S.maxhp,P.hp);setToast('WEAPON: '+g.name,itemCol(g),1.8);sfx('tool');spark(P.x,P.y,itemCol(g),10,60);}
function dropGear(g){pickups.push({x:P.x+rnd(-6,6),y:P.y+rnd(-6,6),k:'bag',tier:g.rare?4:Math.min(3,g.q||0),items:[g],t:0,z:0,vz:0,opened:true,landed:true,seen:true});sfx('tool');}
// layout: 3 equipped slots on the left, a 4x2 pack grid on the right
// layout: panel 300x158; equipped column on the left, 4x2 pack grid on the right, details strip below
const INVX=10,INVY=10,invSlots=()=>{const L=[];['wpn','arm','ring'].forEach((s,i)=>L.push({x:INVX+10,y:INVY+28+i*22,eq:s}));for(let i=0;i<PACKMAX;i++)L.push({x:INVX+196+(i%4)*22,y:INVY+28+((i/4)|0)*22,pi:i});return L;};
function invAt(){return invSlots().findIndex(s=>mouse.x>=s.x-1&&mouse.x<s.x+15&&mouse.y>=s.y-1&&mouse.y<s.y+15);}
function invClick(btn){const k=invAt();if(k<0)return;const s=invSlots()[k];
 if(s.pi!==undefined){const g=R.pack[s.pi];if(!g)return;if(btn===0)equipFromPack(s.pi);else if(btn===2){R.pack.splice(s.pi,1);dropGear(g);setToast('DROPPED '+g.name,'#aaa',1.5);}}
 else{const g=R.eq[s.eq];if(!g)return;if(btn===0){if(R.pack.length>=PACKMAX){setToast('PACK FULL','#f66',1.5);return;}R.pack.push(g);R.eq[s.eq]=null;}else if(btn===2){R.eq[s.eq]=null;dropGear(g);}S=calcStats();P.hp=Math.min(S.maxhp,P.hp);sfx('tool');}}
function panel(x,y,w,h,title,acc){ctx.fillStyle='rgba(0,0,0,.55)';ctx.fillRect(0,0,W,H);ctx.fillStyle='#120e18';ctx.fillRect(x,y,w,h);ctx.fillStyle='#1e1828';ctx.fillRect(x,y,w,12);ctx.fillStyle=acc||'#d02030';ctx.fillRect(x,y,w,1);ctx.fillRect(x,y+h-1,w,1);ctx.fillRect(x,y+12,w,1);if(title)txt(title,x+4,y+4,acc||'#d02030');}
const sep=(x,y,w)=>{ctx.fillStyle='#2e2638';ctx.fillRect(x,y,w,1);};
function drawInv(){
 const w=W-INVX*2,h=H-INVY*2-4;panel(INVX,INVY,w,h,'INVENTORY');txt('PACK '+R.pack.length+'/'+PACKMAX,INVX+w-48,INVY+4,R.pack.length>=PACKMAX?'#f66':'#aaa');
 txt('EQUIPPED',INVX+10,INVY+18,'#887');txt('BACKPACK',INVX+196,INVY+18,'#887');
 const hv=invAt(),SL=invSlots();
 SL.forEach((s,i)=>{const g=s.eq?R.eq[s.eq]:R.pack[s.pi];drawItemIcon(g,s.x,s.y);if(i===hv){ctx.fillStyle='rgba(255,255,255,.18)';ctx.fillRect(s.x,s.y,14,14);}
  if(g&&s.pi!==undefined)txt(g.tier+1,s.x+(g.tier>=9?7:10),s.y+9,'#fff',1);
  if(s.eq){txt(g?g.name.slice(0,26):'NO '+SLOTNAME[s.eq],s.x+20,s.y+1,g?itemCol(g):'#555');if(g)txt(gearLines(g).slice(0,2).join('  ').slice(0,36),s.x+20,s.y+8,'#888');}});
 sep(INVX+6,INVY+96,w-12);
 const s=SL[hv],g=s&&(s.eq?R.eq[s.eq]:R.pack[s.pi]);
 if(g){const L=gearLines(g),cur=s.pi!==undefined?R.eq[g.slot]:null;drawItemIcon(g,INVX+10,INVY+101);txt(g.name,INVX+30,INVY+101,itemCol(g));txt(L[0],INVX+30,INVY+108,'#aaa');
  L.slice(1).forEach((l,i)=>txt(l.slice(0,34),INVX+10+((i/3)|0)*146,INVY+118+(i%3)*8,'#ccc'));
  if(cur){const c=cmpLine(g);txt(c.s,INVX+w-8-txtW(c.s),INVY+101,c.c);}
  txt(s.pi!==undefined?'LMB EQUIP  RMB DROP':'LMB TO PACK  RMB DROP',INVX+w-8-txtW(s.pi!==undefined?'LMB EQUIP  RMB DROP':'LMB TO PACK  RMB DROP'),INVY+108,'#8cf');}
 else{const SLN=setLines();if(SLN.length)SLN.forEach((l,i)=>txt(l.s.slice(0,72),INVX+10,INVY+102+i*8,l.c));else txt('HOVER AN ITEM TO INSPECT IT',INVX+10,INVY+102,'#666');
  txt('POWER '+Math.round(S.atk)+'   HP '+S.maxhp+'   DEF '+S.def+'   CRIT '+Math.round(S.crit*100)+'%',INVX+10,INVY+126,'#aaa');}
 ctxt('TAB / ESC CLOSE      X SWAPS WEAPON      1-6 TAKE FROM BAG',INVY+h+3,'#777');
}
// rare gear sets: wear 2 or 3 pieces of one set for extra powers
const SETS={
 INFERNO:{c:'#f84',items:['DRAGONROT STAFF','BLOOD ROBE','STORM SIGNET'],b2:{qpow:1},d2:'+30% Q POWER',b3:{flare:1,storm:1},d3:'CRITS EXPLODE, +20% VS BURN/SHOCK'},
 MOON:{c:'#8cf',items:['MOONLIT WAND','HIGH PRIEST VESTMENT','RING OF ECHOES'],b2:{emb:1},d2:'-10% COOLDOWNS',b3:{echo:2},d3:'SPELLS ECHO FAR MORE OFTEN'},
 SHINOBI:{c:'#c8f',items:['KUSABIMARU ROD','SHINOBI GARB','FROSTBOUND BAND'],b2:{shadow:1},d2:'FASTER DASH',b3:{crit:2,ghost:1},d3:'+16% CRIT, +6% DODGE'},
 ASHINA:{c:'#fd4',items:['MORTAL STAFF','ASHINA ARMOUR','RING OF GREED'],b2:{iron:1},d2:'-8% DAMAGE TAKEN',b3:{vamp:2,blood:1},d3:'LIFESTEAL, HEAL ON KILL'}};
const setOf=g=>g&&g.rare?Object.keys(SETS).find(k=>SETS[k].items.includes(g.name)):null;
function setCounts(){const c={};for(const s of ['wpn','arm','ring']){const k=setOf(R.eq&&R.eq[s]);if(k)c[k]=(c[k]||0)+1;}return c;}
function setLines(){const c=setCounts(),L=[];for(const k in c){const S2=SETS[k];L.push({s:k+' SET '+c[k]+'/3: '+(c[k]>=3?S2.d2+'. '+S2.d3:c[k]>=2?S2.d2:'NEXT AT 2'),c:c[k]>=2?S2.c:'#777'});}return L;}
function gearStats(){const o={atk:0,hp:0,def:0,fx:{},st:{}};
 {const c=setCounts();for(const k in c){const S2=SETS[k];const add=b=>{for(const f in b)o.fx[f]=(o.fx[f]||0)+b[f];};if(c[k]>=2)add(S2.b2);if(c[k]>=3)add(S2.b3);}}
 for(const s of ['wpn','arm','ring']){const g=R.eq&&R.eq[s];if(!g)continue;const v=gearVals(g);if(v.atk)o.atk+=v.atk;if(v.hp){o.hp+=v.hp;o.def+=v.def;}if(v.sv)o.st[g.stat]=(o.st[g.stat]||0)+v.sv;if(g.fx)for(const k in g.fx)o.fx[k]=(o.fx[k]||0)+g.fx[k];for(const k of (g.aff||[]))o.fx[k]=(o.fx[k]||0)+1;}return o;}
// abilities need line of sight: walls block blasts, cones, chains and zaps
function los(x0,y0,x1,y1){const d=Math.hypot(x1-x0,y1-y0),n=Math.ceil(d/5);for(let i=1;i<n;i++){const t=i/n;if(solid(x0+(x1-x0)*t,y0+(y1-y0)*t))return false;}return true;}
function coneHit(x,y,a,range,arc,fn){for(const e of enemies){if(e.dead||e.air||!los(x,y,e.x,e.y))continue;const d=Math.hypot(e.x-x,e.y-y);if(d>range+e.r)continue;if(d>e.r+4&&Math.abs(angDiff(Math.atan2(e.y-y,e.x-x),a))>arc/2)continue;fn(e);}}
function shockwave(x,y,r,dmg){fxRing(x,y,r,'#fff',.25);for(const e of enemies){if(e.dead||e.air)continue;if(los(x,y,e.x,e.y)&&Math.hypot(e.x-x,e.y-y)<r+e.r)hurtE(e,dmg,20,{kb:Math.atan2(e.y-y,e.x-x)});}}

function hitPlayer(raw,sx,sy,o){
 o=o||{};const p=P;raw*=1+.25*(R.curse||0);
 if(p.iv>0||p.dash>0){if(p.dash>0&&R.training)trainEv('dodge');return 'dodge';}
 // bullets never grant mercy frames, so several can land at once; melee/contact/hazards share a short cooldown
 if(!o.bullet&&p.hurtIv>0)return 'dodge';
 if(p.guardSt>0&&!o.peril){p.guardSt=0;p.iv=.3;sfx('deflect');txtFx(p.x,p.y,'COUNTER','#e0b040');fxRing(p.x,p.y,50,'#e0b040',.3);impact(p.x,p.y,'#e0b040',4);for(const e of enemies)if(!e.dead&&!e.air&&Math.hypot(e.x-p.x,e.y-p.y)<50+e.r&&los(p.x,p.y,e.x,e.y))hurtE(e,S.atk*2*AP()*EMP('w'),40,{slash:true,kb:Math.atan2(e.y-p.y,e.x-p.x)});return 'dodge';}
 if(p.shieldHp>0){const ab=Math.min(p.shieldHp,raw);p.shieldHp-=ab;raw-=ab;spark(p.x,p.y,'#8cf',6,50);if(raw<=0){p.iv=Math.max(p.iv,.15);return 'dodge';}}
 if(S.dodge&&!o.peril&&Math.random()<S.dodge){txtFx(p.x,p.y,'DODGE','#8cf');return 'dodge';}
 if(p.ward>0&&!o.peril){
  sfx('deflect');hitstop=.07;shake=Math.max(shake,3);R.perfect++;
  const wa=Math.atan2(sy-p.y,sx-p.x);spark(p.x+Math.cos(wa)*11,p.y+Math.sin(wa)*11,'#8cf',14,100);
  p.iv=Math.max(p.iv,.1);txtFx(p.x,p.y,'WARDED','#8cf');
  if(o.src&&!o.src.dead){o.src.posture+=(o.pd||20)+S.atk*.6;o.src.pdelay=2;checkBreak(o.src);}
  if(S.thorn)shockwave(p.x,p.y,36,S.atk*S.thorn*.8);
  return 'perfect';
 }
 const dmg=Math.max(raw*.25,raw-S.def)*S.dr*(p.stag>0?1.4:1)*(o.peril?1.5:1);
 p.hp-=dmg;p.combatT=3;p.pos+=raw*.35;p.pdelay=1.4;if(!o.bullet)p.hurtIv=.4;p.flash=.2;shake=Math.max(shake,4);sfx('hurt');hurtT=.45;
 txtFx(p.x,p.y,Math.round(dmg),'#f55');spark(p.x,p.y,'#c22',10,80);
 if(p.pos>=S.maxpos&&p.stag<=0){p.stag=1.2;p.guard=false;p.pos=S.maxpos*.4;txtFx(p.x,p.y,'POSTURE BROKEN','#f84');sfx('break');}
 if(p.hp<=0)die();
 return 'hit';
}
function die(){
 if(P.rez>0){P.rez--;P.hp=S.maxhp*.6;P.iv=2.5;P.stag=0;P.pos=0;sfx('heal');setToast('RESURRECTION','#fd4',2.5);fxRing(P.x,P.y,90,'#fd4',.5);shake=8;
  if(S.phoenix)shockwave(P.x,P.y,110,S.atk*6*S.phoenix);
  for(const e of enemies){if(e.dead||e.boss)continue;const d=dist(e,P);if(d<90){const a=angTo(P,e);e.kx+=Math.cos(a)*220;e.ky+=Math.sin(a)*220;e.act=null;e.stun=1.5;}}
  for(const q of projs)if(q.from==='e')q.dead=true;return;}
 finishRun(false);
}
function finishRun(win){
 R.sen=Math.round(R.sen*(1+.2*(R.asc||0)));meta.sen+=R.sen+(win?200:0);meta.runs++;if(win){meta.wins++;if(R.asc>=meta.ascMax&&meta.ascMax<10){meta.ascMax=R.asc+1;setToast('ASCENSION '+meta.ascMax+' UNLOCKED','#f5a',4);}}meta.reached=Math.max(meta.reached,Math.min(9,R.di));
 let unlock=null;if(!R.training&&meta.unlocked<CLASSES.length){unlock=CLASSES[meta.unlocked];meta.unlocked++;}
 saveMeta();
 deadInfo={win,sen:R.sen+(win?200:0),di:R.di,kills:R.kills,time:R.time,db:R.deathblows,pf:R.perfect,unlock,
  cls:CLS(),dmg:Object.assign({},R.dmg||{}),lo:Object.assign({},P.lo),eq:Object.assign({},R.eq),inv:Object.assign({},R.inv),ench:(R.ench||[]).slice(),addon:JSON.parse(JSON.stringify(R.addon||{})),combo:R.bestCombo||0,evo:P.evo||0};
 mode=win?'win':'dead';if(win)sfx('win');else sfx('hurt');
 hubStart=Math.min(hubStart,meta.reached);
}

// ---------- player actions ----------
function tryDash(){const p=P;if(p.dashCd>0||p.dash>0||p.stag>0)return;const [mx,my]=moveVec();const a=mx||my?Math.atan2(my,mx):p.aim;p.dx=Math.cos(a);p.dy=Math.sin(a);p.dash=.16;p.dashCd=S.dashCd;p.iv=Math.max(p.iv,S.dashIv);p.guard=false;sfx('dash');perfectDodge();{const now=R.time;p.dashRow=(p.lastDashT!=null&&now-p.lastDashT<S.dashCd+.7)?(p.dashRow||1)+1:1;p.lastDashT=now;if(p.dashRow>=DASHROW&&!inCombat()&&!frontierNear()){if(!p.oocRun)txtFx(p.x,p.y,'SWIFT!','#8cf');p.oocRun=true;p.sprintK=1;}}if(S.mikiri)p.mik=1.5;spark(p.x,p.y+4,'#aab',5,30);}
// ================= TRAINING GROUNDS: one lesson per ability before the first dungeon =================
const DUMMYSPR={};
(()=>{const mkS=(w,h,fn)=>{const fr=mk(w+2,h+2,g=>{const R=(x,y,ww,hh,c)=>{g.fillStyle=c;g.fillRect(x+1,y+1,ww,hh);};fn(R);});const c=outlined(fr);return {c,wc:whiteOf(c),fw:w+2,fh:h+2,frames:1,sc:1,ok:true};};
 DUMMYSPR.dummy=mkS(16,24,R=>{R(7,14,2,10,'#6a4a2a');R(1,8,14,2,'#6a4a2a');R(4,6,8,11,'#d8b860');R(4,6,8,1,'#f0d080');R(5,0,6,6,'#d8b860');R(6,2,1,1,'#3a2a1a');R(9,2,1,1,'#3a2a1a');R(5,9,6,6,'#c02818');R(6,10,4,4,'#f0e8d0');R(7,11,2,2,'#c02818');R(4,16,8,1,'#a08040');R(3,22,10,2,'#5a3a1a');});
 DUMMYSPR.turret=mkS(14,20,R=>{R(1,16,12,4,'#5a5a64');R(3,4,8,12,'#7a7a86');R(3,4,2,12,'#9a9aa6');R(2,2,10,3,'#5a5a64');R(5,7,4,4,'#14101a');R(6,8,2,2,'#c060ff');R(4,0,6,2,'#5a5a64');});})();
Object.assign(ET,{dummy:{n:'TRAINING DUMMY',hp:14,spd:0,pos:30,r:6,ai:'dummy',rng:0,wl:0,atks:[]},turret:{n:'SPIRIT TURRET',hp:9999,spd:0,pos:9999,r:6,ai:'turret',rng:0,wl:0,atks:[]}});
let trainMarks=[];
function loadTraining(){
 R.di=0;R.training={i:-1,c:0,t:0,wait:0,good:0};const th=DUN[0];
 // one open courtyard
 const t=new Uint8Array(MW*MH),rx=Math.floor(MW/2-15),ry=Math.floor(MH/2-11),rw=30,rh=22;for(let j=ry;j<ry+rh;j++)for(let i=rx;i<rx+rw;i++)t[j*MW+i]=1;
 const vis=new Uint8Array(MW*MH);for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const i=y*MW+x;if(t[i])continue;let near=false;for(let j=-1;j<=1&&!near;j++)for(let k=-1;k<=1;k++){const xx=x+k,yy=y+j;if(xx>=0&&yy>=0&&xx<MW&&yy<MH&&t[yy*MW+xx]){near=true;break;}}if(near)vis[i]=(y+1<MH&&t[i+MW])?2:1;}
 const room={x:rx,y:ry,w:rw,h:rh,k:'start',type:'training'};
 map={t,vis,rooms:[room],liq:new Uint8Array(MW*MH),liqList:[],env:ENV[0],expl:new Uint8Array(MW*MH).fill(1),startRoom:room,bossRoom:room,train:1,th,mc:{}};mapCanvas=map.mc[camRot]=renderMap(th);
 enemies=[];projs=[];pickups=[];fx=[];particles=[];texts=[];props=[];traps=[];hz=[];dh=[];zones=[];freezeT=0;portal=null;boss=null;trainMarks=[];
 P.x=(rx+5)*T;P.y=(ry+rh/2)*T;P.iv=1;P.hp=S.maxhp;P.gourd=S.gourdMax;P.lock={m:1,h:1,q:1,w:1,f:1,e:1,d:1};
 decos=genDecos(0).filter(o=>Math.hypot(o.x-P.x,o.y-P.y)>60);ambient=[];setToast('TRAINING GROUNDS','#fff',3);nextLesson();}
const tRoom=()=>map.rooms[0],tAt=(fx,fy)=>{const r=tRoom();return {x:(r.x+r.w*fx)*T,y:(r.y+r.h*fy)*T};};
function tSpawn(type,fx,fy,o){const p=tAt(fx,fy),e=mkEnemy(type,p.x,p.y,tRoom(),0);e.awake=true;Object.assign(e,o||{});enemies.push(e);spark(p.x,p.y,'#fff',8,50);return e;}
const spName=k=>SPELLS[k][P.lo[k]].n,spDesc=k=>SPELLS[k][P.lo[k]].d;
const LESSONS=[
 {t:'MOVE',l:()=>['WASD TO WALK. HEAD TO THE GLOWING MARK.'],go:()=>{trainMarks=[tAt(.45,.5)];},done:T=>Math.hypot(P.x-trainMarks[0].x,P.y-trainMarks[0].y)<14},
 {t:'BASIC ATTACK (LMB)',l:()=>[spName('m')+': '+spDesc('m'),'AIM WITH THE MOUSE. DESTROY 3 DUMMIES.'],unlock:'m',go:()=>{tSpawn('dummy',.6,.38);tSpawn('dummy',.64,.5);tSpawn('dummy',.6,.62);},need:3,ev:'kill'},
 {t:'HEAVY ATTACK (RMB)',l:()=>[spName('h')+': '+spDesc('h'),'HOLD RMB TO CHARGE, RELEASE. BREAK 3 DUMMIES.'],unlock:'h',go:()=>{trainMarks=[];tSpawn('dummy',.62,.42);tSpawn('dummy',.62,.58);tSpawn('dummy',.7,.5);},need:3,ev:'kill'},
 {t:'DASH (SPACE)',l:()=>['YOU CANNOT BE HIT WHILE DASHING.','DASH THROUGH 3 BULLETS FROM THE TURRET.'],unlock:'d',go:()=>{tSpawn('turret',.85,.5,{tRate:.9,tPat:{pat:'wall',cnt:9,sp:45,dmg:3,pd:2,col:'#c8f'}});},need:3,ev:'dodge'},
 {t:'FOCUS (HOLD SHIFT)',l:()=>['SHIFT: SLOW MOVE, TINY HITBOX (IN COMBAT).','HOLD SHIFT, WEAVE THROUGH RINGS FOR 6S.'],go:()=>{for(const e of enemies)if(e.type==='turret'){e.tRate=.55;e.tPat={pat:'gapring',cnt:22,gw:.5,sp:40,dmg:3,pd:2,col:'#f8c'};}},timer:6},
 {t:'ABILITY (Q)',l:()=>[spName('q')+': '+spDesc('q'),'USE IT TWICE ON THE DUMMIES.'],unlock:'q',go:()=>{for(const e of enemies)if(e.type==='turret')e.tRate=99;tSpawn('dummy',.6,.4);tSpawn('dummy',.66,.5);tSpawn('dummy',.6,.6);},need:2,ev:'cast',slot:'q',reset:'q'},
 {t:'SUPPORT (E)',l:()=>[spName('w')+': '+spDesc('w'),'USE IT ONCE WHILE THE TURRET FIRES.'],unlock:'w',go:()=>{for(const e of enemies)if(e.type==='turret'){e.tRate=.5;e.tPat={cnt:3,spread:.25,sp:70,dmg:3,pd:2,col:'#c8f'};}},need:1,ev:'cast',slot:'w'},
 {t:'UTILITY (F)',l:()=>[spName('f')+': '+spDesc('f'),'USE IT ONCE NEAR THE DUMMIES.'],unlock:'f',go:()=>{for(const e of enemies)if(e.type==='turret')e.tRate=99;for(let i=0;i<4;i++)tSpawn('dummy',.5+(i%2)*.08,.4+(i>>1)*.2);},need:1,ev:'cast',slot:'f'},
 {t:'ULTIMATE (R)',l:()=>[spName('e')+': '+spDesc('e'),'STRONGEST SPELL. KILLS CUT ITS COOLDOWN.','CAST IT ONCE.'],unlock:'e',go:()=>{for(let i=0;i<5;i++)tSpawn('dummy',.62+(i%3)*.06,.38+(i>>1)*.12);},need:1,ev:'cast',slot:'e'},
 {t:'HEALING (C)',l:()=>['C DRINKS AN HP POTION (+35%). THEY ARE RARE:','CARRY 3 AT MOST. DRINK ONE NOW.'],go:()=>{P.hp=Math.round(S.maxhp*.45);R.pots=Math.max(R.pots,1);},need:1,ev:'heal'},
 {t:'LOOT',l:()=>['FOES DROP BAGS. STAND ON ONE TO SEE INSIDE.','1-6 TAKES AN ITEM, G TAKES EVERYTHING.'],go:()=>{const p=tAt(.55,.5);pickups.push({x:p.x,y:p.y,k:'bag',tier:1,items:[mkGear('wpn',1,false,1),{t:'hp'}],t:0,z:2,vz:110});},done:()=>!pickups.some(k=>k.k==='bag')},
 {t:'BACKPACK (TAB)',l:()=>['TAB OPENS YOUR BACKPACK: SPARE GEAR, SETS.','X SWAPS TO A SPARE WEAPON. OPEN IT NOW.'],need:1,ev:'pack'},
 {t:'READY',l:()=>['BREAK POSTURE (YELLOW BAR): +50% DAMAGE.','G AT THE PORTAL ENTERS THE FIRST DUNGEON.'],go:()=>{const p=tAt(.85,.5);portal={x:p.x,y:p.y,t:0,pending:false};for(const e of enemies)e.dead=true;},done:()=>false}];
function nextLesson(){const T=R.training;T.i++;T.c=0;T.t=0;const L=LESSONS[T.i];if(!L)return;if(L.unlock){delete P.lock[L.unlock];}if(L.unlock==='e'||L.slot)P.ab[L.slot==='w'?'rmb':L.slot]=0;if(L.go)L.go();sfx('pickup');}
function trainEv(k,a){const T=R&&R.training;if(!T||T.wait>0)return;const L=LESSONS[T.i];if(!L||L.ev!==k)return;if(L.slot&&a!==L.slot)return;T.c++;if(k==='cast'&&L.reset)P.ab[L.reset]=Math.min(P.ab[L.reset],.6);}
function updTraining(dt){const T=R.training;if(!T)return;const L=LESSONS[T.i];if(!L)return;T.t+=dt;P.hp=Math.max(P.hp,T.i===9?1:S.maxhp*.3);
 if(L.slot==='e'&&P.ab.e>0&&T.c===0)P.ab.e=0;
 for(const e of enemies)if(e.type==='dummy'&&!e.dead)e.hp=Math.min(e.hp,e.maxhp);
 if(T.wait>0){T.wait-=dt;if(T.wait<=0)nextLesson();return;}
 const ok=L.done?L.done(T):L.timer?T.t>=L.timer:T.c>=(L.need||1);
 if(ok){T.wait=1;T.good=1;txtFx(P.x,P.y-8,'GOOD!','#6f6',2);sfx('win');}}
function drawTraining(){const T=R.training;if(!T)return;const L=LESSONS[T.i];if(!L)return;
 for(const m of trainMarks){const X=sx(m.x,m.y),Y=sy(m.x,m.y);ctx.globalAlpha=.4+.3*Math.sin(time*5);wdisc(m.x,m.y,10,'#ffe060');ctx.globalAlpha=1;wcirc(m.x,m.y,10+Math.sin(time*5)*2,'#fff');ctx.fillStyle='#ffe060';ctx.fillRect(X-1,Y-26+Math.round(Math.sin(time*6)*3),3,8);}
 const lines=L.l(),w=Math.min(192,Math.max(150,...lines.map(s=>txtW(s)+10))),h=16+lines.length*8,x=4,y=(L.t==='LOOT'&&nearBag())?66:H-34-h;
 ctx.fillStyle='rgba(8,6,12,.88)';ctx.fillRect(x,y,w,h);ctx.fillStyle='#ffe060';ctx.fillRect(x,y,w,1);ctx.fillRect(x,y+h-1,w,1);
 txt('TRAINING '+(T.i+1)+'/'+LESSONS.length+'  '+L.t,x+5,y+4,'#ffe060');lines.forEach((s,i)=>txt(s.length>45?s.slice(0,45):s,x+5,y+13+i*8,'#ddd'));
 const prog=L.timer?Math.min(L.timer,T.t).toFixed(0)+'/'+L.timer+'S':L.need?T.c+'/'+L.need:'';if(prog)txt(prog,x+w-5-txtW(prog),y+4,'#aaa');
 if(T.wait>0){ctx.fillStyle='rgba(80,255,120,.12)';ctx.fillRect(x,y,w,h);}
 txt('N: SKIP TRAINING',4,H-8,'#666');}
function finishTraining(){R.training=null;P.lock=null;meta.trained=true;saveMeta();P.hp=S.maxhp;R.pots=1;R.eq.wpn=R.eq.wpn&&!R.eq.wpn.starter&&R.eq.wpn.tier<=1?R.eq.wpn:R.eq.wpn;loadDungeon(0);sfx('pickup');}
// no gourd: C drinks one of your (rare) HP potions
const POTMAX=3,POTHEAL=.35;
function useGourd(){const p=P;if(p.hp>=S.maxhp||p.stag>0)return;if(R.pots<=0){txtFx(p.x,p.y,'NO POTIONS','#888');return;}R.pots--;p.hp=Math.min(S.maxhp,p.hp+S.maxhp*POTHEAL);sfx('heal');txtFx(p.x,p.y,'+HP','#50e060');spark(p.x,p.y,'#50e060',10,50);}
{const ug=useGourd;useGourd=function(){const h=P.hp;ug();if(P.hp>h)trainEv('heal');};}
// ---------- screen <-> world (isometric input) ----------
function screenToWorldDelta(mx,my){const dx=mx-W/2,dy=(my-(H/2+6))/ISOK,w=unrot((dy+dx)/2,(dy-dx)/2);return {x:w[0],y:w[1]};}
const mouseWorld=()=>{const d=screenToWorldDelta(mouse.x,mouse.y);return {x:P.x+d.x,y:P.y+d.y};};
function moveVec(){let mx=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0),my=(keys.KeyS||keys.ArrowDown?1:0)-(keys.KeyW||keys.ArrowUp?1:0);if(!mx&&!my)return [0,0];const l=Math.hypot(mx,my);mx/=l;my/=l;return unrot((mx+my)*.7071,(my-mx)*.7071);} // WASD stays screen-relative at any camera angle

// ---------- spells: 3 choices per slot ----------
const SPELLS={
 m:[{n:'TALISMAN BOLT',g:'T',c:'#ff8a30',d:'FAST FIRE BOLT. RELIABLE DAMAGE'},
    {n:'SPIRIT SHARDS',g:'S',c:'#c8f',d:'SHOTGUN BURST. HUGE UP CLOSE'},
    {n:'HOMING WISP',g:'H',c:'#8fc',d:'SLOW WISPS THAT SEEK TARGETS'},
    {n:'KAMI SEEKERS',g:'>',c:'#ffe060',rare:1,d:'3 GOLDEN SEEKERS THAT PIERCE'}],
 h:[{n:'SPIRIT BLADE',g:'/',c:'#c8f',cd:.55,d:'MELEE ARC. BIG POSTURE, CUTS SHOTS'},
    {n:'VOID ORB',g:'0',c:'#a6f',cd:1.1,d:'SLOW ORB THAT PIERCES EVERYTHING'},
    {n:'FROST LANCE',g:'!',c:'#bef',cd:.8,d:'FAST PIERCING LANCE. CHILLS'},
    {n:'MOONLIT CRESCENT',g:'(',c:'#e0f0ff',cd:.7,rare:1,d:'HUGE SLASH + PIERCING CRESCENT WAVE'}],
 f:[{n:'FROST NOVA',g:'N',c:'#9df',cd:10,d:'BLAST AROUND YOU. FREEZES FOES'},
    {n:'GRAVITY WELL',g:'G',c:'#a6f',cd:12,d:'PULLS FOES IN, THEN DETONATES'},
    {n:'THUNDER TOTEM',g:'Y',c:'#ff6',cd:15,d:'TOTEM ZAPS NEARBY FOES FOR 6S'},
    {n:'BLACK HOLE',g:'V',c:'#c080ff',cd:14,rare:1,d:'DEVOURS SHOTS, DRAGS EVEN BOSSES'}],
 w:[{n:'SPIRIT WARD',g:'W',c:'#8cf',cd:7,d:'REFLECT SHOTS, BLOCK MELEE'},
    {n:'HEALING RITE',g:'+',c:'#6f6',cd:14,d:'HEAL 25% OVER 3S + HASTE'},
    {n:'STILLNESS SEAL',g:'O',c:'#4af',cd:10,d:'ZONE THAT SLOWS AND CHILLS'},
    {n:'DIVINE AEGIS',g:'A',c:'#fff4b0',cd:15,rare:1,d:'INVULNERABLE, HEAL, BLAST FOES AWAY'}],
 q:[{n:'CHAIN LIGHTNING',g:'L',c:'#fff',cd:4.5,d:'ARCS THROUGH 4 FOES. SHOCKS'},
    {n:'FLAME WAVE',g:'F',c:'#f80',cd:5,d:'CONE OF FIRE. BURNS + KNOCKBACK'},
    {n:'KITSUNE STEP',g:'K',c:'#fc6',cd:6,d:'TELEPORT TO CURSOR + BLAST'},
    {n:'HEAVENLY JUDGMENT',g:'J',c:'#ffffa0',cd:7,rare:1,d:'LIGHTNING SMITES 5 FOES NEAR CURSOR'}],
 e:[{n:'DRAGON DESCENT',g:'R',c:'#fd4',cd:32,d:'HUGE DELAYED BLAST AT CURSOR'},
    {n:'TALISMAN STORM',g:'*',c:'#ff8a30',cd:36,d:'4S OF BOLTS SPIRALING OUT'},
    {n:'STOPPED TIME',g:'=',c:'#8cf',cd:44,d:'FREEZE ALL ENEMIES FOR 3.5S'},
    {n:'METEOR RAIN',g:'M',c:'#ff6030',cd:40,rare:1,d:'14 METEORS CRASH DOWN AT CURSOR'}],
};
const SLOTKEY={m:'LMB',h:'RMB',q:'Q',w:'E',f:'F',e:'R'},SLOTS='mhqwfe';
// spell rank grows with each dungeon: abilities +15% power, -3% cooldown, +4% size per rank; basic attacks +6% power
const RK=()=>(R&&R.di)||0,AP=()=>1.25*(1+.1*RK()),BP=()=>1+.04*RK(),AZ=()=>1.12*(1+.03*RK());
const spellCd=k=>SPELLS[k][P.lo[k]].cd*S.cdr*(k==='h'?1:1-.02*RK())*(P.emp&&P.emp[k]?.7:1)*(R&&R.addon&&R.addon[k]&&R.addon[k].cd?.6:1);
const slotCd=k=>k==='m'?P.atkCd:k==='w'?P.ab.rmb:P.ab[k];

// LMB - main spell
function castBolt(){
 const p=P,a=p.aim,v=p.lo.m,mik=(p.mik>0?1.6:1)*BP();p.mik=0;
 const fire=a2=>{
  if(v===0){const n=1+S.wave,dm=S.atk*mik*(n>1?.8:1);for(let i=0;i<n;i++){const off=n===1?0:(i-(n-1)/2)*.24;projs.push(mkProj('p',p.x+Math.cos(a2)*6,p.y+Math.sin(a2)*6,a2+off,215,dm,{r:3,pd:8+S.atk*.3,life:.55*(1+S.rangeM),col:'#ff8a30',pierce:S.pierce,main:true}));}}
  else if(v===1){const n=4+S.wave*2;for(let i=0;i<n;i++){const off=(i/(n-1)-.5)*.75+rnd(-.05,.05);projs.push(mkProj('p',p.x,p.y,a2+off,rnd(210,250),S.atk*.45*mik,{r:2,pd:4+S.atk*.15,life:.3*(1+S.rangeM),col:'#c8f',pierce:S.pierce,main:true}));}}
  else if(v===3){const n=3+S.wave;for(let i=0;i<n;i++){const off=(i-(n-1)/2)*.32;projs.push(mkProj('p',p.x+Math.cos(a2)*6,p.y+Math.sin(a2)*6,a2+off,200,S.atk*.9*mik,{r:3,pd:9+S.atk*.3,life:.9*(1+S.rangeM),col:'#ffe060',pierce:2+S.pierce,main:true,home:true,rare:1}));}}
  else{const n=1+S.wave;for(let i=0;i<n;i++){const off=n===1?0:(i-(n-1)/2)*.5;projs.push(mkProj('p',p.x,p.y,a2+off,125,S.atk*1.15*mik,{r:3,pd:10+S.atk*.3,life:1.5*(1+S.rangeM),col:'#8fc',pierce:S.pierce,main:true,home:true}));}}
 };
 fire(a);if(S.echo&&Math.random()<.15*S.echo)fire(a+.12);
 p.atkCd=(v===0?.3:v===3?.38:.5)/S.aspd;sfx('shoot');spark(p.x+Math.cos(a)*8,p.y+Math.sin(a)*8,SPELLS.m[v].c,3,40);
}
// RMB - second basic attack (hold to repeat)
const HCHARGE=.6; // seconds of holding RMB for a full charge (+50% damage; blades deflect shots)
function castHeavy(){
 const p=P;if(!p||p.ab.h>0||p.stag>0)return;const v=p.lo.h,a=p.aim,bp=BP()*(p.mik>0?1.6:1)*(p.hFull?1.5:1);p.mik=0;p.ab.h=spellCd('h')/S.aspd;
 const fire=a2=>{
  if(v===0){
   const rr=42*(1+S.rangeM*.5);coneHit(p.x,p.y,a2,rr,1.9,e=>hurtE(e,S.atk*1.5*bp,26,{slash:true,kb:Math.atan2(e.y-p.y,e.x-p.x)}));
   if(p.hFull)for(const q of projs)if(q.from==='e'&&!q.peril&&dist(q,p)<rr+4&&Math.abs(angDiff(Math.atan2(q.y-p.y,q.x-p.x),a2))<1){q.dead=true;spark(q.x,q.y,'#c8f',4,50);}
   fx.push({k:'slash',x:p.x,y:p.y,a:a2,arc:1.9,r:rr,t:.16,dur:.16,col:'#c8f'});sfx('dash');
  }else if(v===3){
   const rr=58*(1+S.rangeM*.5);coneHit(p.x,p.y,a2,rr,2.5,e=>hurtE(e,S.atk*2.2*bp,34,{slash:true,kb:Math.atan2(e.y-p.y,e.x-p.x)}));
   if(p.hFull)for(const q of projs)if(q.from==='e'&&!q.peril&&dist(q,p)<rr+4&&Math.abs(angDiff(Math.atan2(q.y-p.y,q.x-p.x),a2))<1.3){q.dead=true;spark(q.x,q.y,'#e0f0ff',4,50);}
   projs.push(mkProj('p',p.x+Math.cos(a2)*8,p.y+Math.sin(a2)*8,a2,240,S.atk*1.6*bp,{r:6,pd:16,life:.55*(1+S.rangeM),col:'#e0f0ff',pierce:99,main:true,crescent:1,cut:p.hFull?1:0}));
   fx.push({k:'slash',x:p.x,y:p.y,a:a2,arc:2.5,r:rr,t:.2,dur:.2,col:'#e0f0ff'});fx.push({k:'slash',x:p.x,y:p.y,a:a2,arc:2.2,r:rr-10,t:.16,dur:.16,col:'#8cf'});sfx('dash');shake=Math.max(shake,3);hitstop=Math.max(hitstop,.03);
  }else if(v===1){projs.push(mkProj('p',p.x+Math.cos(a2)*6,p.y+Math.sin(a2)*6,a2,100,S.atk*2*bp,{r:5,pd:18,life:1.4*(1+S.rangeM),col:'#a6f',pierce:99,main:true}));sfx('tool');}
  else{projs.push(mkProj('p',p.x+Math.cos(a2)*6,p.y+Math.sin(a2)*6,a2,330,S.atk*1.4*bp,{r:2,pd:10,life:.5*(1+S.rangeM),col:'#bef',pierce:3+S.pierce,main:true,el:'chill'}));sfx('shoot');}
 };
 fire(a);if(S.echo&&Math.random()<.15*S.echo)fire(a+.15);
}
// E - support spell
function castWard(){
 const p=P;if(!p||p.ab.rmb>0||p.stag>0)return;const v=p.lo.w,seal=R.inv.parry||0;
 if(v===0){if(p.ward>0)return;p.wardRef=0;p.ward=S.wardDur*(1+.05*RK());p.ab.rmb=spellCd('w')+p.ward;sfx('tool');fxRing(p.x,p.y,24,'#8cf',.3);}
 else if(v===1){p.hot=3;p.hotAmt=S.maxhp*(.25+.05*seal+.015*RK())/3;p.haste=3+.5*seal;p.ab.rmb=spellCd('w');sfx('heal');fxRing(p.x,p.y,20,'#6f6',.4);spark(p.x,p.y,'#6f6',12,50);}
 else if(v===3){const r=90*AZ();p.aegis=2.5*(1+.05*RK());p.iv=Math.max(p.iv,p.aegis);p.hp=Math.min(S.maxhp,p.hp+S.maxhp*.2);p.ab.rmb=spellCd('w');
  impact(p.x,p.y,'#fff4b0',9,true);fxRing(p.x,p.y,r,'#fff4b0',.45);fxRing(p.x,p.y,r*.6,'#fff',.35);spark(p.x,p.y,'#fff4b0',40,170);sfx('rare');txtFx(p.x,p.y,'AEGIS','#fff4b0');
  for(const q of projs)if(q.from==='e'&&!q.peril&&dist(q,p)<r+20)q.dead=true;
  for(const e of enemies){if(e.dead||e.air)continue;if(los(p.x,p.y,e.x,e.y)&&Math.hypot(e.x-p.x,e.y-p.y)<r+e.r){hurtE(e,S.atk*2*AP(),40,{nost:true,kb:Math.atan2(e.y-p.y,e.x-p.x),kbm:2.5});}}}
 else{const mw=mouseWorld();let tx=mw.x,ty=mw.y;const d=Math.hypot(tx-p.x,ty-p.y);if(d>150){tx=p.x+(tx-p.x)/d*150;ty=p.y+(ty-p.y)/d*150;}const r=52*(1+.1*seal)*AZ();zones.push({x:tx,y:ty,r,t:4+.5*seal,tk:0,dm:S.atk*.3*AP()});p.ab.rmb=spellCd('w');sfx('tool');fxRing(tx,ty,r,'#8cf',.3);}
}
// F - utility ability
function castF(){
 const p=P;if(!p||p.ab.f>0||p.stag>0)return;const v=p.lo.f,ap=AP(),az=AZ();p.ab.f=spellCd('f');
 if(v===0){
  const r=66*az;impact(p.x,p.y,'#9df',7,true);sfx('break');fxRing(p.x,p.y,r,'#9df',.4);fxRing(p.x,p.y,r*.6,'#fff',.3);spark(p.x,p.y,'#9df',30,140);
  for(const e of enemies){if(e.dead||e.air)continue;if(los(p.x,p.y,e.x,e.y)&&Math.hypot(e.x-p.x,e.y-p.y)<r+e.r){hurtE(e,S.atk*1.6*ap,22,{nost:true,kb:Math.atan2(e.y-p.y,e.x-p.x)});if(!e.dead){applyStatus(e,'chill');applyStatus(e,'chill');applyStatus(e,'chill');}}}
  for(const q of projs)if(q.from==='e'&&!q.peril&&dist(q,p)<r)q.dead=true;
 }else{
  let tx=p.x,ty=p.y;
  if(v===1||v===3){const mw=mouseWorld();tx=mw.x;ty=mw.y;const d=Math.hypot(tx-p.x,ty-p.y);if(d>150){tx=p.x+(tx-p.x)/d*150;ty=p.y+(ty-p.y)/d*150;}}
  if(v===3){zones.push({k:'grav',hole:1,x:tx,y:ty,r:105*az,t:3.2,dur:3.2,tk:0,dm:S.atk*6*ap});sfx('boss');impact(tx,ty,'#c080ff',5);fxRing(tx,ty,105*az,'#c080ff',.5);return;}
  zones.push(v===1?{k:'grav',x:tx,y:ty,r:62*az,t:2.2,dur:2.2,tk:0,dm:S.atk*3.2*ap}:{k:'totem',x:tx,y:ty,r:105*az,t:6,tk:.2,dm:S.atk*1.3*ap});
  sfx('tool');fxRing(tx,ty,v===1?62*az:20,v===1?'#a6f':'#ff6',.35);
 }
}
// Q - ability
function castChain(){
 const p=P;if(!p||p.ab.q>0||p.stag>0)return;const v=p.lo.q,qm=(1+.3*S.qpow)*AP();
 if(v===3){
  const mw=mouseWorld(),tg=enemies.filter(e=>!e.dead&&!e.air&&dist(e,mw)<130&&los(p.x,p.y,e.x,e.y)).sort((a,b)=>dist(a,mw)-dist(b,mw)).slice(0,5+Math.floor(RK()/4));
  if(!tg.length){txtFx(p.x,p.y,'NO TARGET','#aaa');return;}
  p.ab.q=spellCd('q');sfx('rare');
  tg.forEach((e,i)=>fx.push({k:'strike',x:e.x,y:e.y,tgt:e,wait:i*.09,t:.35,dur:.35,dm:S.atk*3.6*qm,r:22*AZ()}));
  return;}
 if(v===0){
  const mw=mouseWorld();let first=null,bd=1e9;
  for(const e of enemies){if(e.dead||e.air||dist(e,p)>200||!los(p.x,p.y,e.x,e.y))continue;const d=dist(e,mw);if(d<bd){bd=d;first=e;}}
  if(!first){txtFx(p.x,p.y,'NO TARGET','#aaa');return;}
  p.ab.q=spellCd('q');sfx('tool');impact(first.x,first.y,'#cef',4);
  const hit=[first],pts=[{x:p.x,y:p.y},{x:first.x,y:first.y}];let cur=first;
  for(let i=0;i<3+(S.shock?1:0)+Math.floor(RK()/3);i++){let nx=null,nd=80;for(const e of enemies){if(e.dead||e.air||hit.includes(e)||!los(cur.x,cur.y,e.x,e.y))continue;const d=dist(e,cur);if(d<nd){nd=d;nx=e;}}if(!nx)break;hit.push(nx);pts.push({x:nx.x,y:nx.y});cur=nx;}
  fx.push({k:'bolt',pts,t:.25,dur:.25});
  hit.forEach((e,i)=>{hurtE(e,S.atk*2.4*qm*(1-i*.12),28,{slash:true,el:'shock'});if(!e.dead&&!e.boss){e.act=null;e.tele=0;e.stun=Math.max(e.stun||0,.45);}});
 }else if(v===1){
  const a=p.aim;p.ab.q=spellCd('q');sfx('tool');impact(p.x+Math.cos(a)*30,p.y+Math.sin(a)*30,'#f80',5);
  coneHit(p.x,p.y,a,72*AZ(),1.5,e=>hurtE(e,S.atk*2*qm,30,{slash:true,el:'burn',kb:Math.atan2(e.y-p.y,e.x-p.x)}));
  for(const q of projs)if(q.from==='e'&&dist(q,p)<75&&Math.abs(angDiff(Math.atan2(q.y-p.y,q.x-p.x),a))<.75)q.dead=true;
  fx.push({k:'slash',x:p.x,y:p.y,a,arc:1.5,r:64,t:.25,dur:.25,col:'#f80'});fx.push({k:'slash',x:p.x,y:p.y,a,arc:1.3,r:42,t:.2,dur:.2,col:'#fd4'});
  for(let i=0;i<30;i++){const an=a+rnd(-.7,.7),s=rnd(60,170);particles.push({x:p.x,y:p.y,vx:Math.cos(an)*s,vy:Math.sin(an)*s,t:rnd(.2,.5),col:pick(['#f80','#fc4','#f40'])});}
 }else{
  const mw=mouseWorld(),a=Math.atan2(mw.y-p.y,mw.x-p.x),d=Math.min(115,Math.hypot(mw.x-p.x,mw.y-p.y));
  let nx=p.x,ny=p.y;for(let s=0;s<=d;s+=2){const tx=p.x+Math.cos(a)*s,ty=p.y+Math.sin(a)*s;if(blocked(tx,ty,4))break;nx=tx;ny=ty;}
  p.ab.q=spellCd('q');sfx('dash');fxRing(p.x,p.y,20,'#fc6',.3);spark(p.x,p.y,'#fc6',10,60);
  p.x=nx;p.y=ny;p.iv=Math.max(p.iv,.5);if(S.mikiri)p.mik=1.5;
  fxRing(nx,ny,36,'#fc6',.35);spark(nx,ny,'#fc6',14,90);impact(nx,ny,'#fc6',5);
  for(const e of enemies){if(e.dead||e.air)continue;if(los(nx,ny,e.x,e.y)&&Math.hypot(e.x-nx,e.y-ny)<36*AZ()+e.r)hurtE(e,S.atk*1.6*qm,30,{slash:true,el:'burn',kb:Math.atan2(e.y-ny,e.x-nx)});}
 }
}
// R - ultimate
function castUlt(){
 const p=P;if(!p||p.ab.e>0||p.stag>0)return;const v=p.lo.e,ep=(1+.25*S.epow)*(1+.06*RK());p.ab.e=spellCd('e');
 if(v===0){const mw=mouseWorld();let tx=mw.x,ty=mw.y;const d=Math.hypot(tx-p.x,ty-p.y);if(d>170){tx=p.x+(tx-p.x)/d*170;ty=p.y+(ty-p.y)/d*170;}sfx('boss');fx.push({k:'ult',x:tx,y:ty,t:.9,dur:.9,r:58*Math.sqrt(ep),done:false});}
 else if(v===1){p.storm=4*ep;p.stormT=0;p.stormA=p.aim;sfx('boss');setToast('TALISMAN STORM','#ff8a30',1.5);}
 else if(v===3){const mw=mouseWorld();let tx=mw.x,ty=mw.y;const d=Math.hypot(tx-p.x,ty-p.y);if(d>170){tx=p.x+(tx-p.x)/d*170;ty=p.y+(ty-p.y)/d*170;}sfx('boss');setToast('METEOR RAIN','#ff6030',1.5);
  const n=14+Math.floor(RK()/2);for(let i=0;i<n;i++){const a=Math.random()*TAU,rr=Math.sqrt(Math.random())*85;fx.push({k:'ult',x:tx+Math.cos(a)*rr,y:ty+Math.sin(a)*rr,wait:i*.22,t:.6,dur:.6,r:30*Math.sqrt(ep),col:'#ff6030',dm:S.atk*3.2*ep*AP(),done:false,met:1});}}
 else{freezeT=3.5*(1+.15*S.epow);sfx('boss');setToast('TIME STOPS','#8cf',2);for(const e of enemies)if(!e.dead){e.act=null;e.tele=0;e.air=false;e.z=0;}}
}
// ================= CHARACTER CLASSES =================
// spells for the four new classes live at SPELLS[slot][4..7]; the wizard uses variant 0 of every slot
// dm = damage multiplier of POWER, db = which scaling it uses (b basic, a ability, q Q-power, e ultimate)
SPELLS.m.push({n:'KATANA COMBO',g:'/',c:'#e8eef6',d:'3-HIT SLASH COMBO. 3RD HIT CLEAVES',dm:1.25,db:'b',x:'3RD HIT: X2 DAMAGE, WIDER, KNOCKBACK'},
 {n:'QUICK ARROW',g:'>',c:'#e8dcb0',d:'FAST, LONG-RANGE ARROWS',dm:.85,db:'b'},
 {n:'KUNAI',g:'K',c:'#d0d8e0',d:'TWIN KUNAI, VERY FAST',dm:.6,db:'b',dx:' X 2'},
 {n:'PAPER TALISMAN',g:'T',c:'#f0e8d0',d:'HOMING TALISMANS',dm:.95,db:'b'});
SPELLS.h.push({n:'IAI CLEAVE',g:'-',c:'#fff',cd:1,d:'LUNGING LINE SLASH. BIG POSTURE',dm:2.6,db:'b',x:'FULL CHARGE: +50%, DEFLECTS SHOTS'},
 {n:'CHARGED SHOT',g:'!',c:'#ffe080',cd:.9,d:'ARROW THAT PIERCES EVERYTHING',dm:2.4,db:'b',x:'FULL CHARGE: +50%, CUTS SHOTS'},
 {n:'SHURIKEN FAN',g:'*',c:'#c8c8d0',cd:.8,d:'FAN OF 5 SHURIKEN',dm:.75,db:'b',dx:' X 5',x:'FULL CHARGE: 7 SHURIKEN'},
 {n:'SPIRIT FOX',g:'F',c:'#ff9a40',cd:1.4,d:'HOMING FOX, PIERCES 3',dm:1.9,db:'b',x:'FULL CHARGE: TWO FOXES'});
SPELLS.q.push({n:'WHIRLWIND',g:'O',c:'#e8eef6',cd:5,d:'SPIN SLASH: 3 HITS, CUTS SHOTS',dm:1.4,db:'q',dx:' X 3'},
 {n:'ARROW RAIN',g:'R',c:'#e8dcb0',cd:5,d:'VOLLEY AT CURSOR FOR 1.6S',dm:.35,db:'q',dx:' EVERY 0.15S'},
 {n:'SHADOW STEP',g:'S',c:'#9a7aff',cd:4,d:'BLINK BEHIND A FOE AND STAB',dm:3,db:'q'},
 {n:'SHIKIGAMI',g:'B',c:'#f0e8d0',cd:6,d:'2 PAPER SPIRITS FIGHT FOR 7S',dm:.3,db:'q',dx:' EVERY 0.45S EACH'});
SPELLS.w.push({n:'GUARD STANCE',g:'G',c:'#e0b040',cd:6,d:'BLOCK 1.2S. COUNTER-SLASH ON BLOCK',dm:2,db:'a',x:'BLOCKS ANY NON-PERIL HIT'},
 {n:'EVADE ROLL',g:'<',c:'#8f8',cd:4,d:'ROLL AWAY AND LEAVE A SNARE TRAP',dm:3,db:'a',x:'TRAP STUNS FOR 1S'},
 {n:'SMOKE BOMB',g:'%',c:'#aab',cd:10,d:'VANISH: FOES NEARBY GO BLIND',x:'1.2S INVULNERABLE, BLIND 3S'},
 {n:'BARRIER',g:'=',c:'#8cf',cd:12,d:'SHIELD ABSORBS 30% MAX HP FOR 6S'});
SPELLS.f.push({n:'WAR CRY',g:'!',c:'#f84',cd:12,d:'STUN FOES, +30% DAMAGE, HASTE 4S',x:'BOSSES TAKE POSTURE INSTEAD'},
 {n:'HAWK',g:'V',c:'#c8a060',cd:14,d:'HAWK FIRES HOMING FEATHERS 8S',dm:.5,db:'a',dx:' EVERY 0.5S'},
 {n:'CALTROPS',g:'X',c:'#8f4',cd:8,d:'SPIKES: SLOW, POISON, DAMAGE 5S',dm:.2,db:'a',dx:' EVERY 0.35S'},
 {n:'HEALING CIRCLE',g:'+',c:'#6f6',cd:15,d:'HEAL 5%/S INSIDE FOR 5S. HURTS FOES',dm:.25,db:'a'});
SPELLS.e.push({n:'DRAGON CLEAVE',g:'D',c:'#f44',cd:30,d:'DASH THROUGH FOES, THEN EXPLODE',dm:6,db:'e'},
 {n:'ARROW STORM',g:'#',c:'#e8dcb0',cd:34,d:'30 ARROWS RAIN ON THE CURSOR',dm:.8,db:'e',dx:' X 30'},
 {n:'SHADOW CLONES',g:'C',c:'#9a7aff',cd:30,d:'3 CLONES THROW KUNAI FOR 6S',dm:.3,db:'e',dx:' EVERY 0.25S EACH'},
 {n:'DRAGON SPIRIT',g:'D',c:'#6cf',cd:38,d:'A DRAGON TEARS THROUGH THE AIM LINE',dm:2.2,db:'e',dx:' X 9 BLASTS'});
// weapon-type LMB attacks (indices 8-15): each class has a weapon family, and the equipped weapon picks the LMB
SPELLS.m.push(
 {n:'NAGINATA SWEEP',g:'(',c:'#e8eef6',d:'LONG REACH SWEEP IN A WIDE ARC',dm:1.4,db:'b'},
 {n:'ODACHI CLEAVE',g:'/',c:'#ffe080',d:'SLOW, HUGE SLASH. BIG POSTURE DAMAGE',dm:3,db:'b'},
 {n:'HANKYU VOLLEY',g:'^',c:'#e8dcb0',d:'3 ARROWS IN A FAN',dm:.6,db:'b',dx:' X 3'},
 {n:'REPEATER BOLTS',g:'=',c:'#d8c8a0',d:'VERY FAST, LIGHT BOLTS',dm:.45,db:'b'},
 {n:'SHURIKEN',g:'*',c:'#c8c8d0',d:'SPINNING STAR. PIERCES 2 FOES',dm:1,db:'b'},
 {n:'KUSARIGAMA',g:'S',c:'#a0a8b0',d:'CHAIN SICKLE LASH. PULLS FOES IN',dm:1.3,db:'b'},
 {n:'SUZU PULSE',g:'o',c:'#ffe080',d:'BELL RING HITS ALL FOES AROUND YOU',dm:.9,db:'b'},
 {n:'SPIRIT MIRROR',g:'|',c:'#e0f0ff',d:'PIERCING BEAM OF LIGHT',dm:1.3,db:'b'});
// every weapon type and the LMB attack it gives. Any class can wield any type;
// each class mostly finds its own family and gets +25% LMB damage with its SIGNATURE type.
const WTYPES={STAFF:0,'WAR FAN':1,CENSER:2,KATANA:4,NAGINATA:8,ODACHI:9,YUMI:5,HANKYU:10,REPEATER:11,KUNAI:6,SHURIKEN:12,KUSARIGAMA:13,OFUDA:7,'SUZU BELL':14,'SPIRIT MIRROR':15};
const WFAM={wizard:['STAFF','WAR FAN','CENSER'],samurai:['KATANA','NAGINATA','ODACHI'],archer:['YUMI','HANKYU','REPEATER'],
 shinobi:['KATANA','KUNAI','SHURIKEN','KUSARIGAMA'],onmyoji:['OFUDA','SUZU BELL','SPIRIT MIRROR']};
const WSIG={wizard:'STAFF',samurai:'KATANA',archer:'YUMI',shinobi:'KATANA',onmyoji:'OFUDA'},SIGBONUS=1.25;
const LMBRATE={0:.3,1:.5,2:.5,3:.38,4:.3,5:.22,6:.2,7:.3,8:.4,9:.75,10:.3,11:.11,12:.28,13:.38,14:.45,15:.42};
const wfam=()=>WFAM[CLS().k];
function rollWT(){return Math.random()<.75?pick(wfam()):pick(Object.keys(WTYPES));}
const wtName=g=>(g&&typeof g.wt==='string')?g.wt:WSIG[CLS().k];
const isSig=g=>wtName(g)===WSIG[CLS().k];
// legendary weapons: a wizard's legendary staff fires Kami Seekers; every other legendary empowers its attack
function wpnLMB(g){if(!g)return WTYPES[WSIG[CLS().k]];if(g.rare&&CLS().k==='wizard'&&wtName(g)==='STAFF')return 3;return WTYPES[wtName(g)];}
function syncLMB(){if(!P||!R||!R.eq)return;const g=R.eq.wpn;P.lo.m=wpnLMB(g);P.emp=P.emp||{};P.emp.m=g&&g.rare&&P.lo.m!==3?1:0;P.sig=isSig(g);}
const CLASSES=[
 {k:'wizard',n:'WIZARD',col:'#c8f',d:'RANGED SPELLS, ELEMENTAL COMBOS. +20% POWER.',pw:1.2,hp:1,spd:1,dash:1,def:0,kit:{m:0,h:1,q:0,w:0,f:0,e:0}},
 {k:'samurai',n:'SAMURAI',col:'#f55',d:'MELEE BLADES, GUARD COUNTERS. +35% HP, +3 DEF.',hp:1.35,spd:.97,dash:1.1,def:3,kit:{m:4,h:4,q:4,w:4,f:4,e:4}},
 {k:'archer',n:'ARCHER',col:'#8f8',d:'LONG RANGE, TRAPS AND A HAWK. FAST.',hp:.9,spd:1.08,dash:.9,def:0,kit:{m:5,h:5,q:5,w:5,f:5,e:5}},
 {k:'shinobi',n:'SHINOBI',col:'#9a7aff',d:'BLINKS, SMOKE AND POISON. FRAGILE, SWIFT.',hp:.82,spd:1.15,dash:.65,def:0,kit:{m:4,h:6,q:6,w:6,f:6,e:6}},
 {k:'onmyoji',n:'ONMYOJI',col:'#f0e8d0',d:'SUMMONS SPIRITS, SHIELDS AND HEALS.',hp:.95,spd:1,dash:1,def:1,kit:{m:7,h:7,q:7,w:7,f:7,e:7}}];
const CLS=()=>CLASSES[(meta&&meta.cls)||0];
// class stat modifiers + the deathblow item effect, layered on top of the base stat calculation
{const cs0=calcStats;calcStats=function(){const s=cs0(),c=CLS();s.maxhp=Math.round(s.maxhp*c.hp);s.atk*=c.pw||1;s.spd*=c.spd;s.dashCd*=c.dash;s.def+=c.def;s.dblow=(R&&R.inv?(R.inv.dblow||0):0)+(R&&R.eq?(gearStats().fx.dblow||0):0);return s;};}
// ten evolution names and looks per class
const EVONAMES={samurai:['RONIN','FOOTMAN','ASHIGARU','SWORDSMAN','HATAMOTO','SAMURAI','KENSHI','WARLORD','SHOGUN BLADE','SWORD SAINT'],
 archer:['HUNTER','SCOUT','BOWMAN','MARKSMAN','RANGER','SHARPSHOOTER','HAWKEYE','WINDSTRIDER','STORM ARCHER','MASTER ARCHER'],
 shinobi:['THIEF','GENIN','SHADOW','INFILTRATOR','CHUNIN','ASSASSIN','JONIN','SHADOW MASTER','PHANTOM','GRANDMASTER'],
 onmyoji:['ACOLYTE','SCRIBE','DIVINER','EXORCIST','SPIRIT CALLER','ONMYOJI','SAGE','HIGH ONMYOJI','SPIRIT LORD','GRAND ONMYOJI']};
function mixC(a,b,t){const p=s=>[1,3,5].map(i=>parseInt(s.slice(i,i+2),16)),A=p(a),B=p(b);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('');}
function heroEV(cls,st){if(cls==='wizard')return WIZEVO[st];const t=st/9,n=EVONAMES[cls][st];
 if(cls==='samurai')return {n,hat:st<3?'kasa':'kabuto',crest:st>=6,beard:st>=8?1:0,wpn:st<1?'bokken':'katana',C:{hat:st<3?'#c8a050':mixC('#5a4a3a','#8a1818',t),hatL:st<3?'#e0c070':'#c8c8d0',band:st>=4?'#e0b040':'#6a5a4a',robe:mixC('#6a5a4a','#a02020',t),robeS:mixC('#4a3a2a','#5a1010',t),trim:st>=4?'#e0b040':'#3a2a1a',beard:'#3a3a3a',beardS:'#2a2a2a'}};
 if(cls==='archer')return {n,hat:st<6?'hood':'kasa',beard:0,wpn:'bow',C:{hat:mixC('#5a5a3a','#2e6a2a',t),hatL:mixC('#7a7a5a','#4a9a3a',t),band:st>=6?'#c8c8d0':'#4a4a2a',robe:mixC('#6a6a4a','#2e7a3a',t),robeS:mixC('#4a4a2a','#1e4a22',t),trim:st>=5?'#c8c8d0':'#5a4a2a'}};
 if(cls==='shinobi')return {n,hat:'mask',beard:0,wpn:'kunai',C:{hat:mixC('#4a4a52','#1a1628',t),hatL:'#5a5a6a',band:st>=2?mixC('#802020','#e02040',t):'#3a3a42',robe:mixC('#4a4a52','#1e1a30',t),robeS:mixC('#32323a','#100c1c',t),trim:st>=4?'#9a7aff':'#2a2a32'}};
 return {n,hat:st<2?'hood':'eboshi',beard:st>=7?1:0,wpn:'gohei',C:{hat:st<2?'#a8a090':'#1a1a1a',hatL:st<2?'#c8c0b0':'#3a3a3a',band:st>=5?'#8a3ac8':'#a8a090',robe:mixC('#c8c0b0','#f4f4fc',t),robeS:mixC('#a8a090','#c8c8e0',t),trim:st>=3?mixC('#c03030','#8a3ac8',t):'#a8a090',beard:'#2a2a2a',beardS:'#1a1a1a'}};}
const HEROC={};
function heroSpr(cls,st,back){const k=cls+st+(back?'b':'');if(HEROC[k])return HEROC[k];
 if(!back)return HEROC[k]=cls==='wizard'?WIZSPR[st]:buildHero(heroEV(cls,st),false);
 return HEROC[k]=cls==='wizard'?buildHero(WIZEVO[st],st>=9,true):buildHero(heroEV(cls,st),false,true);}
const evoName=st=>heroEV(CLS().k,st).n;
// class ability helpers
const EMP=k=>P&&P.emp&&P.emp[k]?1.6:1;
function setCd(k){if(k==='m')return;if(k==='h')P.ab.h=spellCd('h')/S.aspd;else if(k==='w')P.ab.rmb=spellCd('w');else P.ab[k]=spellCd(k);}
function lineHit(x,y,a,len,wid,fn){for(const e of enemies){if(e.dead||e.air)continue;const dx=e.x-x,dy=e.y-y,al=dx*Math.cos(a)+dy*Math.sin(a),pe=Math.abs(-dx*Math.sin(a)+dy*Math.cos(a));if(al>-6&&al<len+e.r&&pe<wid+e.r&&los(x,y,e.x,e.y))fn(e);}}
function nearestFoe(x,y,r){let best=null,bd=r;for(const e of enemies){if(e.dead||e.air||e.type==='turret')continue;const d=Math.hypot(e.x-x,e.y-y);if(d<bd&&los(x,y,e.x,e.y)){bd=d;best=e;}}return best;}
const pShot=(x,y,a,sp,dmg,o)=>projs.push(mkProj('p',x,y,a,sp,dmg,Object.assign({main:true,pierce:S.pierce,pd:8,life:.6*(1+S.rangeM)},o||{})));
function classCast(k){const p=P,v=p.lo[k],a=p.aim,em=EMP(k),A=S.atk,bp=BP()*(p.mik>0&&(k==='m'||k==='h')?1.6:1)*(k==='h'&&p.hFull?1.5:1),ap=AP(),qm=(1+.3*S.qpow)*ap,ep=(1+.25*S.epow)*(1+.06*RK())*ap,rage=1;
 if(p.stag>0)return;if(k==='m'&&p.atkCd>0)return;if(k==='h'&&p.ab.h>0)return;if(k==='w'&&p.ab.rmb>0)return;if('qfe'.includes(k)&&p.ab[k]>0)return;
 if(k==='m'||k==='h')p.mik=0;
 const mw=mouseWorld(),clampT=(d)=>{let tx=mw.x,ty=mw.y;const dd=Math.hypot(tx-p.x,ty-p.y);if(dd>d){tx=p.x+(tx-p.x)/dd*d;ty=p.y+(ty-p.y)/dd*d;}return {x:tx,y:ty};};
 const cutCone=(r,arc)=>{for(const q of projs)if(q.from==='e'&&!q.peril&&dist(q,p)<r&&Math.abs(angDiff(Math.atan2(q.y-p.y,q.x-p.x),a))<arc){q.dead=true;spark(q.x,q.y,'#fff',3,40);}};
 switch(v*10+'mhqwfe'.indexOf(k)){
  // ---------- SAMURAI ----------
  case 40:{const cont=R.time-(p.lastSw||-9)<.75;p.combo=cont?((p.combo||0)+1)%3:0;p.lastSw=R.time;const fin=p.combo===2,rr=(fin?40:32)*(1+S.rangeM*.4);
   coneHit(p.x,p.y,a,rr,fin?2.6:1.7,e=>hurtE(e,A*(fin?2.5:1.25)*bp*em,fin?24:12,{slash:true,kb:fin?Math.atan2(e.y-p.y,e.x-p.x):undefined}));
   fx.push({k:'slash',x:p.x,y:p.y,a:a+(p.combo===1?.3:-.3),arc:fin?2.6:1.7,r:rr,t:.14,dur:.14,col:fin?'#ffe080':'#e8eef6'});sfx('slash');if(fin)shake=Math.max(shake,2);p.atkCd=(fin?.42:.24)/S.aspd;break;}
  case 41:{let n=0;for(let s=0;s<=30;s+=2){const tx=p.x+Math.cos(a)*s,ty=p.y+Math.sin(a)*s;if(blocked(tx,ty,4))break;n=s;}const x0=p.x,y0=p.y;p.x+=Math.cos(a)*n;p.y+=Math.sin(a)*n;
   lineHit(x0,y0,a,90,14,e=>hurtE(e,A*2.6*bp*em,45,{slash:true,kb:a}));if(p.hFull)for(const q of projs)if(q.from==='e'&&!q.peril){const dx=q.x-x0,dy=q.y-y0,al=dx*Math.cos(a)+dy*Math.sin(a);if(al>0&&al<95&&Math.abs(-dx*Math.sin(a)+dy*Math.cos(a))<16){q.dead=true;spark(q.x,q.y,'#fff',3,40);}}
   fx.push({k:'line',x:x0,y:y0,a,len:95,t:.18,dur:.18,col:p.hFull?'#ffe080':'#fff'});sfx('slash');impact(p.x,p.y,'#fff',3);break;}
  case 42:{zones.push({k:'whirl',x:p.x,y:p.y,r:46*AZ(),t:.62,tk:0,dm:A*1.4*qm*em,n:0});sfx('dash');break;}
  case 43:{p.guardSt=1.2;fxRing(p.x,p.y,18,'#e0b040',.3);sfx('block');break;}
  case 44:{const r=85*AZ();impact(p.x,p.y,'#f84',6,true);fxRing(p.x,p.y,r,'#f84',.45);sfx('boss');p.haste=4;p.rage=5;txtFx(p.x,p.y,'WAR CRY','#f84');
   for(const e of enemies){if(e.dead||e.air||!los(p.x,p.y,e.x,e.y)||Math.hypot(e.x-p.x,e.y-p.y)>r+e.r)continue;if(e.boss){e.posture+=60*em;checkBreak(e);}else{e.act=null;e.tele=0;e.stun=Math.max(e.stun||0,1.2*em);}}break;}
  case 45:{let n=0;for(let s=0;s<=130;s+=3){const tx=p.x+Math.cos(a)*s,ty=p.y+Math.sin(a)*s;if(blocked(tx,ty,4))break;n=s;}const x0=p.x,y0=p.y;p.x+=Math.cos(a)*n;p.y+=Math.sin(a)*n;p.iv=Math.max(p.iv,.6);
   lineHit(x0,y0,a,n,22,e=>hurtE(e,A*6*ep*em,80,{slash:true}));fx.push({k:'line',x:x0,y:y0,a,len:n,t:.35,dur:.35,col:'#f44'});
   fx.push({k:'ult',x:p.x,y:p.y,t:.3,dur:.3,r:50,col:'#f44',dm:A*3*ep*em,met:1,done:false});sfx('boss');impact(p.x,p.y,'#f44',8,true);break;}
  // ---------- ARCHER ----------
  case 50:{const n=1+S.wave;for(let i=0;i<n;i++)pShot(p.x+Math.cos(a)*6,p.y+Math.sin(a)*6,a+(n>1?(i-(n-1)/2)*.15:0),300,A*.85*bp*em*(n>1?.8:1),{r:2,arrow:true,col:'#e8dcb0',life:.75*(1+S.rangeM)});p.atkCd=.22/S.aspd;sfx('shoot');break;}
  case 51:{pShot(p.x+Math.cos(a)*6,p.y+Math.sin(a)*6,a,380,A*2.4*bp*em,{r:3,arrow:true,col:p.hFull?'#fff':'#ffe080',pierce:99,cut:p.hFull?1:0,life:.7*(1+S.rangeM),pd:20});sfx('shoot');if(p.hFull)impact(p.x,p.y,'#ffe080',2);break;}
  case 52:{const t=clampT(160);zones.push({k:'rain',x:t.x,y:t.y,r:42*AZ(),t:1.6,tk:0,dm:A*.35*qm*em});sfx('shoot');break;}
  case 53:{const ra=a+Math.PI;zones.push({k:'trap',x:p.x,y:p.y,r:16,t:10,tk:0,dm:A*3*ap*em});p.dx=Math.cos(ra);p.dy=Math.sin(ra);p.dash=.2;p.iv=Math.max(p.iv,.4);sfx('dash');break;}
  case 54:{zones.push({k:'hawk',x:p.x,y:p.y,r:0,t:8,tk:.3,dm:A*.5*ap*em,ang:0});sfx('rare');break;}
  case 55:{const t=clampT(170);sfx('boss');setToast('ARROW STORM','#e8dcb0',1.2);for(let i=0;i<30;i++){const an=Math.random()*TAU,rr=Math.sqrt(Math.random())*70;fx.push({k:'ult',x:t.x+Math.cos(an)*rr,y:t.y+Math.sin(an)*rr,wait:i*.09,t:.35,dur:.35,r:16,col:'#e8dcb0',dm:A*.8*ep*em,met:1,done:false});}break;}
  // ---------- SHINOBI ----------
  case 60:{for(const o of [-.07,.07])pShot(p.x+Math.cos(a)*5,p.y+Math.sin(a)*5,a+o,290,A*.6*bp*em,{r:2,arrow:true,col:'#d0d8e0'});p.atkCd=.2/S.aspd;sfx('shoot');break;}
  case 61:{const n=p.hFull?7:5;for(let i=0;i<n;i++)pShot(p.x,p.y,a+(i/(n-1)-.5)*.9,210,A*.75*bp*em,{r:2,col:'#c8c8d0',pierce:1+S.pierce,cut:p.hFull?1:0});sfx('shoot');break;}
  case 62:{let tg=null,bd=1e9;for(const e of enemies){if(e.dead||e.air||e.type==='turret'||dist(e,p)>170||!los(p.x,p.y,e.x,e.y))continue;const d=dist(e,mw);if(d<bd){bd=d;tg=e;}}if(!tg){txtFx(p.x,p.y,'NO TARGET','#aaa');return;}
   const ba=Math.atan2(tg.y-p.y,tg.x-p.x);spark(p.x,p.y,'#9a7aff',14,80);let nx=tg.x+Math.cos(ba)*(tg.r+8),ny=tg.y+Math.sin(ba)*(tg.r+8);if(blocked(nx,ny,4)){nx=tg.x-Math.cos(ba)*(tg.r+8);ny=tg.y-Math.sin(ba)*(tg.r+8);}if(!blocked(nx,ny,4)){p.x=nx;p.y=ny;}
   p.iv=Math.max(p.iv,.4);hurtE(tg,A*3*qm*em,40,{slash:true});spark(tg.x,tg.y,'#fff',10,90);impact(tg.x,tg.y,'#9a7aff',4);sfx('dash');break;}
  case 63:{p.iv=Math.max(p.iv,1.2);zones.push({k:'smoke',x:p.x,y:p.y,r:60,t:3,tk:0});for(const e of enemies)if(!e.dead&&Math.hypot(e.x-p.x,e.y-p.y)<100){e.blind=3*em;e.act=null;e.tele=0;}sfx('dash');for(let i=0;i<40;i++){const an=Math.random()*TAU,s=rnd(20,80);particles.push({x:p.x,y:p.y,vx:Math.cos(an)*s,vy:Math.sin(an)*s,t:rnd(.6,1.2),col:pick(['#aab','#889','#ccd'])});}break;}
  case 64:{zones.push({k:'calt',x:p.x,y:p.y,r:36*AZ(),t:5,tk:0,dm:A*.2*ap*em});sfx('tool');break;}
  case 65:{for(let i=0;i<3;i++)zones.push({k:'clone',x:p.x,y:p.y,r:0,t:6,tk:i*.08,dm:A*.3*ep*em,ang:i*TAU/3});sfx('boss');spark(p.x,p.y,'#9a7aff',30,120);break;}
  // ---------- ONMYOJI ----------
  case 70:{pShot(p.x+Math.cos(a)*5,p.y+Math.sin(a)*5,a,170,A*.95*bp*em,{r:3,col:'#f0e8d0',home:true,life:1.1*(1+S.rangeM)});p.atkCd=.3/S.aspd;sfx('shoot');break;}
  case 71:{const n=p.hFull?2:1;for(let i=0;i<n;i++)pShot(p.x,p.y,a+(n>1?(i?.3:-.3):0),130,A*1.9*bp*em,{r:4,col:'#ff9a40',home:true,pierce:3+S.pierce,life:1.6,pd:16});sfx('tool');break;}
  case 72:{for(let i=0;i<2;i++)zones.push({k:'shiki',x:p.x,y:p.y,r:0,t:7,tk:i*.2,dm:A*.3*qm*em,ang:i*Math.PI});sfx('rare');break;}
  case 73:{p.shieldHp=S.maxhp*.3*em;p.shieldT=6;fxRing(p.x,p.y,20,'#8cf',.4);sfx('heal');break;}
  case 74:{zones.push({k:'heal',x:p.x,y:p.y,r:40*AZ(),t:5,tk:0,dm:A*.25*ap*em,hp:S.maxhp*.0125*em});sfx('heal');break;}
  case 75:{sfx('boss');setToast('DRAGON SPIRIT','#6cf',1.2);for(let i=0;i<9;i++){const d=20+i*18,x=p.x+Math.cos(a)*d,y=p.y+Math.sin(a)*d;if(solid(x,y))break;fx.push({k:'ult',x,y,wait:i*.1,t:.3,dur:.3,r:26,col:'#6cf',dm:A*2.2*ep*em,met:1,done:false});}break;}
  // ---------- WEAPON-TYPE LMB ATTACKS ----------
  case 80:{const rr=48*(1+S.rangeM*.4);coneHit(p.x,p.y,a,rr,2.4,e=>hurtE(e,A*1.4*bp*em,14,{slash:true,kb:Math.atan2(e.y-p.y,e.x-p.x)}));
   fx.push({k:'slash',x:p.x,y:p.y,a,arc:2.4,r:rr,t:.16,dur:.16,col:'#e8eef6'});sfx('slash');p.atkCd=LMBRATE[8]/S.aspd;break;}
  case 90:{const rr=40*(1+S.rangeM*.4);coneHit(p.x,p.y,a,rr,2,e=>hurtE(e,A*3*bp*em,40,{slash:true,kb:Math.atan2(e.y-p.y,e.x-p.x)}));
   fx.push({k:'slash',x:p.x,y:p.y,a,arc:2,r:rr,t:.2,dur:.2,col:'#ffe080'});fx.push({k:'slash',x:p.x,y:p.y,a,arc:1.7,r:rr-8,t:.16,dur:.16,col:'#fff'});sfx('slash');shake=Math.max(shake,3);hitstop=Math.max(hitstop,.03);p.atkCd=LMBRATE[9]/S.aspd;break;}
  case 100:{for(let i=-1;i<=1;i++)pShot(p.x+Math.cos(a)*6,p.y+Math.sin(a)*6,a+i*.18,280,A*.6*bp*em,{r:2,arrow:true,col:'#e8dcb0',life:.6*(1+S.rangeM)});p.atkCd=LMBRATE[10]/S.aspd;sfx('shoot');break;}
  case 110:{pShot(p.x+Math.cos(a)*6,p.y+Math.sin(a)*6,a+rnd(-.06,.06),320,A*.45*bp*em,{r:2,arrow:true,col:'#d8c8a0',life:.55*(1+S.rangeM)});p.atkCd=LMBRATE[11]/S.aspd;sfx('shoot');break;}
  case 120:{pShot(p.x+Math.cos(a)*6,p.y+Math.sin(a)*6,a,230,A*bp*em,{r:3,col:'#c8c8d0',pierce:2+S.pierce,life:.7*(1+S.rangeM)});p.atkCd=LMBRATE[12]/S.aspd;sfx('shoot');break;}
  case 130:{const len=62*(1+S.rangeM*.4);lineHit(p.x,p.y,a,len,8,e=>{hurtE(e,A*1.3*bp*em,14,{slash:true});if(!e.boss&&!e.dead){e.kx-=Math.cos(a)*70;e.ky-=Math.sin(a)*70;}});
   fx.push({k:'line',x:p.x,y:p.y,a,len,t:.14,dur:.14,col:'#a0a8b0'});sfx('slash');p.atkCd=LMBRATE[13]/S.aspd;break;}
  case 140:{const r=38*AZ();for(const e of enemies){if(e.dead||e.air||Math.hypot(e.x-p.x,e.y-p.y)>r+e.r||!los(p.x,p.y,e.x,e.y))continue;hurtE(e,A*.9*bp*em,8,{slash:true,kb:Math.atan2(e.y-p.y,e.x-p.x)});}
   fxRing(p.x,p.y,r,'#ffe080',.22);sfx('tool');p.atkCd=LMBRATE[14]/S.aspd;break;}
  case 150:{const len=130*(1+S.rangeM);lineHit(p.x,p.y,a,len,6,e=>hurtE(e,A*1.3*bp*em,10,{slash:true}));
   fx.push({k:'line',x:p.x,y:p.y,a,len,t:.16,dur:.16,col:'#e0f0ff'});sfx('shoot');p.atkCd=LMBRATE[15]/S.aspd;break;}
  default:return;}
 setCd(k);}
// class zones: per-frame behaviour and drawing
const CZ={
 whirl:(z,dt)=>{z.x=P.x;z.y=P.y;if(z.tk<=0&&z.n<3){z.tk=.2;z.n++;for(const e of enemies)if(!e.dead&&!e.air&&Math.hypot(e.x-z.x,e.y-z.y)<z.r+e.r&&los(z.x,z.y,e.x,e.y))hurtE(e,z.dm,14,{slash:true,kb:Math.atan2(e.y-z.y,e.x-z.x)});for(const q of projs)if(q.from==='e'&&!q.peril&&dist(q,z)<z.r){q.dead=true;spark(q.x,q.y,'#fff',2,30);}sfx('slash');}},
 rain:(z)=>{if(z.tk<=0){z.tk=.15;for(const e of enemies)if(!e.dead&&!e.air&&Math.hypot(e.x-z.x,e.y-z.y)<z.r+e.r&&los(z.x,z.y,e.x,e.y))hurtE(e,z.dm,4,{nost:true});const an=Math.random()*TAU,rr=Math.random()*z.r;particles.push({x:z.x+Math.cos(an)*rr,y:z.y+Math.sin(an)*rr,vx:0,vy:0,t:.15,col:'#e8dcb0'});}},
 trap:(z)=>{for(const e of enemies){if(e.dead||e.air||e.type==='turret'||Math.hypot(e.x-z.x,e.y-z.y)>z.r+e.r)continue;z.t=0;fxRing(z.x,z.y,40,'#8f8',.35);impact(z.x,z.y,'#8f8',4);sfx('break');for(const o of enemies)if(!o.dead&&!o.air&&Math.hypot(o.x-z.x,o.y-z.y)<40+o.r&&los(z.x,z.y,o.x,o.y)){hurtE(o,z.dm,30,{nost:true});if(!o.dead&&!o.boss){o.stun=Math.max(o.stun||0,1);o.act=null;}}break;}},
 hawk:(z,dt)=>{z.ang+=dt*3;z.x=P.x+Math.cos(z.ang)*22;z.y=P.y+Math.sin(z.ang)*22;if(z.tk<=0){z.tk=.5;const e=nearestFoe(z.x,z.y,170);if(e)pShot(z.x,z.y,Math.atan2(e.y-z.y,e.x-z.x),200,z.dm,{r:2,col:'#c8a060',home:true,life:1});}},
 calt:(z)=>{for(const e of enemies)if(!e.dead&&!e.air&&Math.hypot(e.x-z.x,e.y-z.y)<z.r+e.r)e.zs=e.boss?.7:.45;if(z.tk<=0){z.tk=.35;for(const e of enemies)if(!e.dead&&!e.air&&Math.hypot(e.x-z.x,e.y-z.y)<z.r+e.r){hurtE(e,z.dm,3,{nost:true});applyStatus(e,'poison');}}},
 smoke:()=>{},
 clone:(z,dt)=>{z.ang+=dt*1.2;z.x=P.x+Math.cos(z.ang)*26;z.y=P.y+Math.sin(z.ang)*26;if(z.tk<=0){z.tk=.25;const e=nearestFoe(z.x,z.y,170);if(e)pShot(z.x,z.y,Math.atan2(e.y-z.y,e.x-z.x),280,z.dm,{r:2,arrow:true,col:'#9a7aff',life:.7});}},
 shiki:(z,dt)=>{z.ang+=dt*2.2;z.x=P.x+Math.cos(z.ang)*22;z.y=P.y+Math.sin(z.ang)*22;if(z.tk<=0){z.tk=.45;const e=nearestFoe(z.x,z.y,170);if(e)pShot(z.x,z.y,Math.atan2(e.y-z.y,e.x-z.x),150,z.dm,{r:2,col:'#f0e8d0',home:true,life:1.2});}},
 heal:(z)=>{if(z.tk<=0){z.tk=.25;if(Math.hypot(P.x-z.x,P.y-z.y)<z.r){P.hp=Math.min(S.maxhp,P.hp+z.hp);particles.push({x:P.x+rnd(-4,4),y:P.y,vx:0,vy:-25,t:.5,col:'#6f6'});}for(const e of enemies)if(!e.dead&&!e.air&&Math.hypot(e.x-z.x,e.y-z.y)<z.r+e.r)hurtE(e,z.dm,2,{nost:true});}}};
const CZD={
 whirl:z=>{const k=1-z.t/.62;for(let i=0;i<3;i++)fxArc(z.x,z.y,z.r-i*6,time*14+i*2,2.2,'#e8eef6');},
 rain:z=>{ctx.globalAlpha=.2;wdisc(z.x,z.y,z.r,'#e8dcb0');ctx.globalAlpha=1;wcirc(z.x,z.y,z.r,'#e8dcb0');for(let i=0;i<5;i++){const an=Math.random()*TAU,rr=Math.random()*z.r,x=z.x+Math.cos(an)*rr,y=z.y+Math.sin(an)*rr;sline(sx(x,y)+3,sy(x,y)-14,sx(x,y),sy(x,y),'#e8dcb0');}},
 trap:z=>{const X=sx(z.x,z.y),Y=sy(z.x,z.y);ctx.fillStyle='#5a4a2a';ctx.fillRect(X-4,Y-1,9,3);ctx.fillStyle=Math.floor(time*3)%2?'#8f8':'#4a8';ctx.fillRect(X-3,Y-2,1,1);ctx.fillRect(X+3,Y-2,1,1);ctx.fillRect(X,Y-1,1,1);},
 hawk:z=>{const X=sx(z.x,z.y),Y=sy(z.x,z.y)-18,w=Math.floor(time*10)%2;ctx.fillStyle='#14101a';ctx.fillRect(X-4,Y-1,9,3);ctx.fillStyle='#8a6a40';ctx.fillRect(X-1,Y-1,3,2);ctx.fillStyle='#c8a060';ctx.fillRect(X-4,Y-(w?1:0),3,1);ctx.fillRect(X+2,Y-(w?1:0),3,1);ctx.fillStyle='#fff';ctx.fillRect(X+1,Y-1,1,1);},
 calt:z=>{ctx.globalAlpha=.25;wdisc(z.x,z.y,z.r,'#4a6a2a');ctx.globalAlpha=1;for(let i=0;i<10;i++){const an=i*2.4,rr=(i*7%10)/10*z.r,x=z.x+Math.cos(an)*rr,y=z.y+Math.sin(an)*rr;ctx.fillStyle='#a0a8b0';ctx.fillRect(sx(x,y),sy(x,y)-1,2,1);ctx.fillRect(sx(x,y),sy(x,y)-2,1,1);}},
 smoke:z=>{ctx.globalAlpha=Math.min(.45,z.t*.25);for(let i=0;i<6;i++){const an=i+time*.5;wdisc(z.x+Math.cos(an)*12,z.y+Math.sin(an)*12,z.r*.6,'#8a8a96');}ctx.globalAlpha=1;},
 clone:z=>{const s=heroSpr(CLS().k,P.evo||0);ctx.globalAlpha=.55;drawSpr(s,sx(z.x,z.y),sy(z.x,z.y)+3,false,0,false);ctx.globalAlpha=1;},
 shiki:z=>{const X=sx(z.x,z.y),Y=sy(z.x,z.y)-14+Math.round(Math.sin(time*6+z.ang)*2);ctx.fillStyle='#14101a';ctx.fillRect(X-4,Y-2,9,4);ctx.fillStyle='#f0e8d0';ctx.fillRect(X-3,Y-1,7,2);ctx.fillStyle='#e03040';ctx.fillRect(X,Y-1,1,2);},
 heal:z=>{ctx.globalAlpha=.18+.08*Math.sin(time*4);wdisc(z.x,z.y,z.r,'#6f6');ctx.globalAlpha=1;wcirc(z.x,z.y,z.r,'#8f8');for(let i=0;i<4;i++){const an=time+i*1.57,x=z.x+Math.cos(an)*z.r*.6,y=z.y+Math.sin(an)*z.r*.6;ctx.fillStyle='#cfc';ctx.fillRect(sx(x,y),sy(x,y)-3,1,3);ctx.fillRect(sx(x,y)-1,sy(x,y)-2,3,1);}}};
function fxArc(x,y,r,a0,arc,col){ctx.fillStyle=col;for(let a=0;a<arc;a+=.12){const aa=a0+a,px=x+Math.cos(aa)*r,py=y+Math.sin(aa)*r;ctx.fillRect(sx(px,py),sy(px,py)-6,1,1);}}
// route each slot to the class version when the class kit uses variant 4+
{const cw=(fn,k)=>function(){if(P&&P.lo[k]>=4)return classCast(k);return fn.apply(this,arguments);};
 castBolt=cw(castBolt,'m');castHeavy=cw(castHeavy,'h');castChain=cw(castChain,'q');castWard=cw(castWard,'w');castF=cw(castF,'f');castUlt=cw(castUlt,'e');}
// play the matching wizard animation whenever a spell actually goes off (its cooldown changes)
const wrapA=(fn,get,k,t)=>function(){const b=P&&get();fn.apply(this,arguments);if(P&&get()!==b){P.animK=k;P.animT=t;P.animD=t;P.combatT=2;}};
castBolt=wrapA(castBolt,()=>P.atkCd,'atk',.16);castHeavy=wrapA(castHeavy,()=>P.ab.h,'atk',.2);
castChain=wrapA(castChain,()=>P.ab.q,'cast',.32);castWard=wrapA(castWard,()=>P.ab.rmb,'cast',.32);castF=wrapA(castF,()=>P.ab.f,'cast',.32);castUlt=wrapA(castUlt,()=>P.ab.e,'ult',.6);
// training: locked slots do nothing; successful casts report to the lesson
const lockW=(fn,k,get)=>function(){if(P&&P.lock&&P.lock[k])return;const b=get&&P&&get();const r=fn.apply(this,arguments);if(get&&P&&R&&R.training&&get()!==b)trainEv('cast',k);return r;};
castBolt=lockW(castBolt,'m');castHeavy=lockW(castHeavy,'h');castChain=lockW(castChain,'q',()=>P.ab.q);castWard=lockW(castWard,'w',()=>P.ab.rmb);castF=lockW(castF,'f',()=>P.ab.f);castUlt=lockW(castUlt,'e',()=>P.ab.e);tryDash=lockW(tryDash,'d');
// tag every shot, zone and blast a cast creates with its slot, so enchants and scroll add-ons only touch abilities (never LMB)
{const srcW=(fn,k)=>function(){if(k==='m')syncLMB();const n0=projs.length,z0=zones.length,f0=fx.length,prev=castSrc;castSrc=k;
  try{return fn.apply(this,arguments);}finally{castSrc=prev;
   const ex=k==='m'?0:abFx(k).pierce||0;
   for(let i=n0;i<projs.length;i++){const q=projs[i];if(q.from==='p'&&q.src==null){q.src=k;q.pierce=(q.pierce||0)+ex;}}
   for(let i=z0;i<zones.length;i++)if(zones[i].src==null)zones[i].src=k;for(let i=f0;i<fx.length;i++)if(fx[i].src==null)fx[i].src=k;}};
 castBolt=srcW(castBolt,'m');castHeavy=srcW(castHeavy,'h');castChain=srcW(castChain,'q');castWard=srcW(castWard,'w');castF=srcW(castF,'f');castUlt=srcW(castUlt,'e');}
// one action at a time: every cast briefly locks out the others, and nothing else fires while RMB is charging
{const LOCK={m:.06,h:.15,q:.3,w:.3,f:.3,e:.4};
 const actW=(fn,k,get)=>function(){if(!P)return;if(P.lockT>0)return;if(k!=='h'&&P.hCh>0)return;
  const b=get();const r=fn.apply(this,arguments);if(get()!==b)P.lockT=LOCK[k];return r;};
 castBolt=actW(castBolt,'m',()=>P.atkCd);castHeavy=actW(castHeavy,'h',()=>P.ab.h);castChain=actW(castChain,'q',()=>P.ab.q);
 castWard=actW(castWard,'w',()=>P.ab.rmb);castF=actW(castF,'f',()=>P.ab.f);castUlt=actW(castUlt,'e',()=>P.ab.e);}
function smite(f){ // Heavenly Judgment: a bolt from the sky on each target
 if(f.tgt&&!f.tgt.dead){f.x=f.tgt.x;f.y=f.tgt.y;}
 impact(f.x,f.y,'#ffffa0',6,true);sfx('deflect');fxRing(f.x,f.y,f.r,'#ffffa0',.3);
 for(const e of enemies){if(e.dead||e.air)continue;if(los(f.x,f.y,e.x,e.y)&&Math.hypot(e.x-f.x,e.y-f.y)<f.r+e.r){hurtE(e,e===f.tgt?f.dm:f.dm*.5,40,{slash:true,el:'shock'});if(!e.dead&&!e.boss){e.act=null;e.tele=0;e.stun=Math.max(e.stun||0,1);}}}
}
function ultBlast(f){
 {const gz=zones.find(z=>z.k==='grav'&&Math.hypot(z.x-f.x,z.y-f.y)<z.r);if(gz&&!f.sing){f.sing=1;f.dm=(f.dm||S.atk*7*(1+.25*S.epow)*AP())*1.5;f.r*=1.3;txtFx(f.x,f.y,'SINGULARITY','#c080ff',2);fxRing(f.x,f.y,f.r*1.6,'#c080ff',.6);}}
 const c=f.col||'#fd4';if(f.met){impact(f.x,f.y,c,6);sfx('hit');sfx('break');}else{impact(f.x,f.y,c,12,true);hitstop=.12;sfx('break');}fxRing(f.x,f.y,f.r*1.2,c,.5);spark(f.x,f.y,c,f.met?20:40,160);spark(f.x,f.y,'#fff',f.met?6:16,110);
 for(const e of enemies){if(e.dead||e.air)continue;if(los(f.x,f.y,e.x,e.y)&&Math.hypot(e.x-f.x,e.y-f.y)<f.r+e.r){hurtE(e,f.dm||S.atk*7*(1+.25*S.epow)*AP(),f.met?60:170,{slash:true,el:'burn'});if(!e.dead&&!e.boss){e.act=null;e.tele=0;e.stun=f.met?.5:1.2;}}}
 for(const q of projs)if(q.from==='e'&&Math.hypot(q.x-f.x,q.y-f.y)<f.r)q.dead=true;
}

// ---------- status effects & reactions ----------
function applyStatus(e,k){
 if(e.dead)return;const st=e.st||(e.st={});
 if(k==='burn'&&(st.chillT>0||st.frozen>0))return react(e,'steam');
 if(k==='chill'&&st.burn>0)return react(e,'steam');
 if(k==='chill'&&st.shock>0)return react(e,'supercon');
 if(k==='shock'&&(st.chillT>0||st.frozen>0))return react(e,'supercon');
 if(k==='burn'){if(st.shock>0)return react(e,'overload');st.burn=3;st.bdps=Math.max(st.bdps||0,3+S.atk*.25);}
 else if(k==='poison'){st.poison=4;st.pdps=Math.min(4+S.atk*1.2,(st.pdps||0)+1.5+S.atk*.12);}
 else if(k==='shock'){if(st.burn>0)return react(e,'overload');st.shock=2;}
 else if(k==='chill'){if(st.frozen>0)return;st.chillT=3;st.chillS=(st.chillS||0)+1;if(st.chillS>=3){st.chillS=0;st.chillT=0;st.frozen=e.boss?.9:1.8;e.act=null;e.tele=0;txtFx(e.x,e.y,'FROZEN','#8cf');sfx('block');}}
}
function react(e,k){
 const st=e.st;
 if(k==='steam'){st.burn=0;st.chillT=0;st.chillS=0;if((e.rcd||0)>0)return;e.rcd=.8;txtFx(e.x,e.y,'STEAM','#dde');fxRing(e.x,e.y,44,'#dde',.4);sfx('dash');
  for(let i=0;i<24;i++){const a=Math.random()*TAU,s=rnd(20,70);particles.push({x:e.x,y:e.y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,t:rnd(.5,1),col:pick(['#fff','#dde','#aab'])});}
  for(const o of enemies){if(o.dead||o.air)continue;if(los(e.x,e.y,o.x,o.y)&&Math.hypot(o.x-e.x,o.y-e.y)<44+o.r){hurtE(o,S.atk*1.3,15,{nost:true});if(!o.dead&&!o.boss){o.act=null;o.tele=0;o.stun=Math.max(o.stun||0,1.4);}if(!o.dead)o.blind=2.5;}}return;}
 if(k==='supercon'){st.shock=0;st.chillT=0;st.chillS=0;if((e.rcd||0)>0)return;e.rcd=.8;txtFx(e.x,e.y,'SUPERCONDUCT','#8ef');fxRing(e.x,e.y,38,'#8ef',.35);spark(e.x,e.y,'#8ef',18,100);impact(e.x,e.y,'#8ef',3);
  for(const o of enemies){if(o.dead||o.air)continue;if(los(e.x,e.y,o.x,o.y)&&Math.hypot(o.x-e.x,o.y-e.y)<38+o.r){hurtE(o,S.atk*1.1,60+S.atk,{nost:true});if(!o.dead){o.zs=.4;checkBreak(o);}}}return;}
 if(k==='overload'){st.burn=0;st.shock=0;if((e.rcd||0)>0)return;e.rcd=.8;txtFx(e.x,e.y,'OVERLOAD','#fd4');fxRing(e.x,e.y,40,'#fd4',.3);spark(e.x,e.y,'#fd4',16,110);shake=Math.max(shake,3);sfx('break');
  for(const o of enemies){if(o.dead||o.air)continue;if(los(e.x,e.y,o.x,o.y)&&Math.hypot(o.x-e.x,o.y-e.y)<40+o.r)hurtE(o,S.atk*1.6,25,{nost:true});}}
}

// ---------- elites ----------
const ELMOD={swift:{n:'SWIFT',c:'#fd4'},armored:{n:'ARMORED',c:'#8af'},volatile:{n:'VOLATILE',c:'#f64'},summoner:{n:'SUMMONER',c:'#c8f'},regen:{n:'REGEN',c:'#6f6'}};
function mkElite(type,x,y,room,di){
 const e=mkEnemy(type,x,y,room,di),m=pick(Object.keys(ELMOD));
 e.elite=m;e.hp=e.maxhp=e.maxhp*2.6;e.maxPosture*=1.6;e.dm*=1.2;
 if(m==='swift')e.spd*=1.5;if(m==='armored')e.hp=e.maxhp=e.maxhp*1.3;if(m==='summoner')e.sumT=4;
 return e;
}

// ---------- extra enemy types ----------
Object.assign(ET,{
 wisp:{hp:16,spd:52,pos:14,r:4,ai:'bomber',rng:24,wl:0,cdMin:.2,cdMax:.4,atks:[SM({w:.55,rad:26,dmg:18,rec:.1,pd:10,sd:true})]},
 shielder:{hp:70,spd:28,pos:80,r:6,hat:'kasa',ai:'melee',rng:28,wl:12,shield:true,atks:[SL({w:.6,range:28,arc:120,dmg:16,rec:.6,pd:25})]},
 shaman:{hp:36,spd:26,pos:30,r:5,hat:'hood',ai:'ranged',keep:95,rng:150,wl:6,cdMin:2.5,cdMax:4,atks:[SU({w:1.1,cnt:2,types:['wisp'],rec:.5,wt:2}),SH({w:.7,cnt:3,spread:.4,sp:70,dmg:9,col:'#c8f',wt:1})]},
 sniper:{hp:26,spd:28,pos:24,r:5,hat:'hair',ai:'ranged',keep:130,rng:200,wl:10,cdMin:2,cdMax:3,atks:[SH({w:1.3,sp:270,dmg:24,col:'#f66',arrow:true,line:true,pd:25,rec:.8})]},
 assassin:{hp:40,spd:58,pos:34,r:5,hat:'hood',ai:'dasher',rng:90,wl:8,cdMin:1.2,cdMax:2,atks:[{n:'blink',w:.5,dmg:18,range:26,arc:140,rec:.6,pd:20,wt:1}]},
});
// ---------- bullet hell pass: every foe throws patterns you have to weave through ----------
(()=>{
 const V=(o)=>SH(Object.assign({w:.55,sp:72,dmg:8,pd:8,rec:.4},o));
 const vol={ashigaru:V({cnt:5,spread:.6,reps:2,gap:.25,col:'#e8a040'}),samurai:V({ring:true,cnt:12,reps:3,gap:.3,sp:60,col:'#f66',spin:.14}),
  ninja:V({cnt:3,spread:.2,reps:5,gap:.1,sp:115,col:'#ccf',arrow:true}),brute:V({ring:true,cnt:16,reps:4,gap:.28,sp:55,dmg:10,col:'#fa4',spin:.1}),
  shielder:V({cnt:7,spread:.75,sp:64,col:'#aaf',reps:2,gap:.35}),assassin:V({cnt:4,spread:.35,reps:3,gap:.14,sp:105,col:'#c8f',arrow:true})};
 for(const k in vol)ET[k].volley=vol[k];
 const up=(a,m)=>{if(a.n!=='shoot')return;if(a.ring)a.cnt=Math.round(a.cnt*m);else if(!a.line){a.cnt+=3;a.spread=Math.max(a.spread,.3);}a.reps=(a.reps||1)+1;a.dmg=Math.round(a.dmg*.8);};
 for(const k of ['archer','monk','shaman','sniper']){ET[k].cdMin=Math.min(ET[k].cdMin||.7,.7);ET[k].cdMax=Math.min(ET[k].cdMax||1.5,1.5);}
 for(const k of ['archer','monk','shaman','sniper'])ET[k].atks.forEach(a=>up(a,1.5));
 ET.sniper.atks[0].gap=.15;
 for(const b of BOSS)for(const ph of ['k1','k2','k3'])if(b[ph]){b[ph].forEach(a=>up(a,1.5));b[ph].push(V({ring:true,cnt:18,reps:5,gap:.22,sp:55,dmg:11,col:'#f8c',spin:.18,wt:2}));}
})();
const POOLADD=[[],['shielder'],['sniper','wisp'],['shaman','assassin'],['shielder','sniper'],['shaman','wisp'],['assassin','shielder','sniper'],['shaman','assassin'],['wisp','shaman','shielder'],['assassin','sniper','shielder','shaman']];
DUN.forEach((d,i)=>d.pool.push(...POOLADD[i]));
// ---- signature enemies: one per environment, with its own look, pattern and (sometimes) a death effect ----
{const V=(o)=>SH(Object.assign({w:.55,sp:72,dmg:8,pd:8,rec:.4},o));
 Object.assign(ET,{
  bandit:{n:'BANDIT',hp:34,spd:56,pos:30,r:5,hat:'hair',ai:'dasher',rng:80,wl:8,cdMin:.8,cdMax:1.5,pal:basePal('#4a6a2a','#2a3a1a','#c0a060','#3a2a1a'),atks:[SH({w:.45,cnt:3,spread:.5,reps:2,gap:.18,sp:120,dmg:9,col:'#e0e0e0',arrow:true})]},
  jailer:{n:'JAILER',hp:110,spd:24,pos:80,r:7,hat:'kasa',sc:1.5,ai:'melee',rng:32,wl:14,pal:basePal('#5a5a64','#2a2a32','#8a8a96','#1a1a22'),atks:[SM({w:.8,rad:34,dmg:24,peril:true,rec:.7})],volley:V({ring:true,cnt:10,reps:3,gap:.4,sp:48,dmg:10,col:'#9aa',spin:.2})},
  bomber:{n:'FIREBOMBER',hp:40,spd:30,pos:30,r:5,hat:'hood',ai:'ranged',keep:100,rng:150,wl:6,cdMin:.9,cdMax:1.6,pal:basePal('#7a4a20','#4a2a10','#ff8a30','#2a1a0a'),atks:[SH({w:.6,cnt:5,spread:.8,sp:62,dmg:11,col:'#ff8a30',reps:2,gap:.3})],death:'boom'},
  imp:{n:'FIRE IMP',hp:22,spd:72,pos:16,r:4,hat:'bald',horns:1,ai:'dasher',rng:60,wl:4,cdMin:.6,cdMax:1.2,pal:basePal('#c03010','#801808','#ffd040','#401008','#ff6030'),atks:[TH({w:.3,dist:60,sp:240,dmg:10,pd:10})],death:'boom'},
  frog:{n:'SWAMP SPITTER',hp:48,spd:34,pos:36,r:6,hat:'bald',ai:'ranged',keep:80,rng:130,wl:8,cdMin:.8,cdMax:1.4,pal:basePal('#4a8a3a','#2a5a22','#e0e060','#1a3a12','#6aaa4a'),atks:[SH({w:.55,cnt:4,spread:.6,sp:68,dmg:9,col:'#8f4',reps:3,gap:.2,el:'poison'}),LP({w:.5,rad:28,dmg:16})],death:'ring'},
  priest:{n:'TEMPLE PRIEST',hp:44,spd:24,pos:36,r:5,hat:'bald',ai:'ranged',keep:90,rng:150,wl:6,cdMin:1,cdMax:1.8,pal:basePal('#e0a020','#8a5010','#fff0c0','#6a3a10'),atks:[SH({w:.7,ring:true,cnt:14,reps:4,gap:.2,sp:58,dmg:9,col:'#fd4',spin:.22})]},
  wraith:{n:'SNOW WRAITH',hp:36,spd:46,pos:28,r:5,hat:'hood',ai:'ranged',keep:110,rng:170,wl:6,cdMin:.9,cdMax:1.5,pal:basePal('#d0e0f0','#8aa0c0','#ffffff','#a0b8d8','#c0d8f0'),atks:[SH({w:.5,cnt:2,spread:.15,reps:4,gap:.12,sp:150,dmg:10,col:'#cff',arrow:true})]},
  guardian:{n:'MARBLE GUARDIAN',hp:140,spd:22,pos:110,r:7,hat:'kasa',sc:1.5,shield:true,ai:'melee',rng:30,wl:16,pal:basePal('#d0d8e0','#8a96a8','#4a90c0','#6a7a90'),atks:[SL({w:.6,range:30,arc:150,dmg:20,rec:.6,pd:30})],volley:V({ring:true,cnt:20,reps:2,gap:.5,sp:52,dmg:10,col:'#9cf',spin:.08})},
  shroom:{n:'SPORELING',hp:30,spd:30,pos:20,r:5,hat:'kasa',ai:'melee',rng:24,wl:6,pal:basePal('#a050d0','#602a80','#f0c0ff','#3a1a4a','#e0d0c0'),atks:[SM({w:.6,rad:24,dmg:14,rec:.5})],death:'ring'},
  blood:{n:'BLOOD MONK',hp:60,spd:40,pos:44,r:5,hat:'bald',ai:'ranged',keep:70,rng:130,wl:8,cdMin:.7,cdMax:1.3,pal:basePal('#8a1020','#4a0810','#ff4050','#2a0408'),atks:[SH({w:.5,cnt:6,spread:1,reps:3,gap:.15,sp:85,dmg:9,col:'#f24'}),CH({w:.5,sp:230,dur:.6,dmg:22})]}});
 ['bandit','jailer','bomber','imp','frog','priest','wraith','guardian','shroom','blood'].forEach((t,i)=>DUN[i].pool.push(t,t));}
// ---- bullet-hell patterns: walls with holes, rings with gaps, spirals, mines, curving curtains ----
{const P2=o=>SH(Object.assign({w:.6,sp:60,dmg:9,pd:8,rec:.5,cnt:1},o));
 ET.ashigaru.volley=P2({pat:'wall',cnt:9,sp:62,col:'#e8a040'});
 ET.samurai.volley=P2({pat:'gapring',cnt:24,reps:3,gap:.45,gw:.4,sp:55,col:'#f66'});
 ET.ninja.volley=P2({pat:'stream',cnt:6,sp:100,st:'accel',col:'#ccf',reps:2,gap:.35});
 ET.brute.volley=P2({pat:'flower',cnt:16,reps:3,gap:.4,sp:50,col:'#fa4',st:'big',r:5});ET.brute.atks.push(P2({pat:'mines',cnt:4,col:'#fa4',st:'mine',fuse:1.4,wt:1}));
 ET.archer.atks.push(P2({pat:'curtain',cnt:6,sp:80,col:'#c9a050',curve:.8,wt:1}));
 ET.monk.atks.push(P2({pat:'spiral',arms:3,spin:.28,reps:10,gap:.1,sp:62,col:'#c8f',st:'wave',wt:1}));
 ET.shaman.atks.push(P2({cnt:3,spread:.5,sp:45,col:'#c8f',st:'split',splitT:1,wt:1}));
 ET.shielder.volley=P2({pat:'wall',cnt:11,sp:55,col:'#aaf',reps:2,gap:.6});
 ET.assassin.volley=P2({cnt:3,spread:.5,sp:120,col:'#c8f',st:'boom',bT:1.4});
 Object.assign(ET.bandit.atks[0],{st:'boom',bT:1.3,arrow:false});
 ET.jailer.volley=P2({pat:'gapring',cnt:20,reps:3,gap:.5,gw:.5,sp:48,col:'#9aa',st:'big',r:4});
 ET.bomber.atks.push(P2({cnt:2,spread:.4,sp:50,col:'#ff8a30',st:'split',splitT:.9,wt:1}));
 ET.frog.atks.push(P2({pat:'mines',cnt:3,col:'#8f4',st:'mine',fuse:1.5,wt:1}));
 ET.priest.atks.push(P2({pat:'flower',cnt:18,reps:4,gap:.3,sp:52,col:'#fd4',wt:1}));
 ET.wraith.atks.push(P2({pat:'stream',cnt:7,sp:90,st:'accel',acc:2,cap:260,col:'#cff',reps:2,gap:.4,wt:1}));
 ET.guardian.volley=P2({pat:'cross',dirs:8,cnt:3,reps:3,gap:.45,sp:55,col:'#9cf',rot:.2});
 ET.shroom.volley=P2({pat:'mines',cnt:2,col:'#d080ff',st:'mine',fuse:1.6});
 ET.blood.atks.push(P2({pat:'curtain',cnt:8,sp:75,col:'#f24',curve:1.1,wt:1}),P2({pat:'spiral',arms:4,spin:.35,reps:8,gap:.1,sp:70,col:'#f46',st:'curve',curve:.6,wt:1}));
 const BP=[[P2({pat:'gapring',cnt:28,reps:3,gap:.4,gw:.38,sp:58,col:'#f8c',wt:2}),P2({pat:'wall',cnt:13,reps:3,gap:.45,sp:60,col:'#fc8',wt:2})],
  [P2({pat:'spiral',arms:5,spin:.22,reps:16,gap:.08,sp:60,col:'#f6c',st:'wave',wt:2}),P2({pat:'cross',dirs:8,cnt:3,reps:4,gap:.35,sp:58,col:'#8ff',rot:.15,wt:2}),P2({pat:'mines',cnt:6,col:'#fa4',st:'mine',fuse:1.3,wt:1})],
  [P2({pat:'curtain',cnt:12,sp:80,col:'#f44',curve:1,reps:3,gap:.4,wt:2}),P2({pat:'flower',cnt:24,reps:5,gap:.25,sp:52,col:'#fd4',wt:2}),P2({cnt:4,spread:.8,sp:48,col:'#c8f',st:'split',splitT:.8,reps:2,gap:.5,wt:1})]];
 for(const b of BOSS)['k1','k2','k3'].forEach((ph,i)=>{if(b[ph])b[ph].push(...BP[i].map(a=>Object.assign({},a)));});}
// ---- animal enemies: one beast per environment, code-drawn 2-frame sprites (facing right) ----
const ANIM={};
function defAnimal(k,w,h,fn){const N=2,sheet=mk(w*N+N*2,h+2,()=>{}),sg=sheet.getContext('2d');
 for(let f=0;f<N;f++){const fr=mk(w+2,h+2,g=>{const R=(x,y,ww,hh,c)=>{g.fillStyle=c;g.fillRect(x+1,y+1,ww,hh);};fn(R,f);});sg.drawImage(outlined(fr),f*(w+2),0);}
 ANIM[k]={c:sheet,wc:whiteOf(sheet),fw:w+2,fh:h+2,frames:N,sc:1,ok:true,animal:1};}
(()=>{
 defAnimal('boar',18,11,(R,f)=>{R(2,3,12,6,'#6a4a32');R(2,3,12,1,'#8a6a4a');R(3,2,8,1,'#4a3220');R(13,4,4,4,'#7a5a3e');R(16,6,2,2,'#c89a8a');R(15,5,1,1,'#14101a');R(16,8,1,2,'#f0e8d0');R(12,2,2,2,'#5a3a26');const l=f?1:0;R(3+l,9,2,2,'#3a2a1a');R(7-l,9,2,2,'#3a2a1a');R(10+l,9,2,2,'#3a2a1a');R(13-l,9,2,2,'#3a2a1a');R(1,4,1,2,'#4a3220');});
 defAnimal('rat',13,7,(R,f)=>{R(2,2,8,4,'#6a6470');R(2,2,8,1,'#8a8492');R(9,3,3,3,'#7a7480');R(12,4,1,1,'#f0a0b0');R(10,3,1,1,'#f03030');R(9,1,2,2,'#c08a9a');const l=f?1:0;R(3+l,6,1,1,'#3a3440');R(8-l,6,1,1,'#3a3440');R(0,3+l,2,1,'#c08a9a');R(0,4-l,1,1,'#c08a9a');});
 defAnimal('tanuki',13,13,(R,f)=>{R(3,5,7,6,'#8a6440');R(4,6,5,4,'#c8a070');R(3,1,7,5,'#8a6440');R(4,3,5,2,'#2a2018');R(5,3,1,1,'#fff');R(7,3,1,1,'#fff');R(3,0,2,2,'#5a3e28');R(8,0,2,2,'#5a3e28');R(6,5,1,1,'#14101a');R(0,7+(f?1:0),3,3,'#6a4a2e');R(0,8,1,1,'#2a2018');const l=f?1:0;R(4,11,2,2-l,'#3a2a1a');R(7,11,2,1+l,'#3a2a1a');R(10,2,2,2,'#3e8a36');});
 defAnimal('salamander',18,7,(R,f)=>{const w=f?1:0;R(4,2,9,3,'#c03010');R(4,2,9,1,'#f06030');R(13,2,4,3,'#d04018');R(15,2,1,1,'#ffd040');R(17,4,1,1,'#ff8a30');R(0,3+w,4,2,'#c03010');R(5,2,1,1,'#ffd040');R(8,2,1,1,'#ffd040');R(11,2,1,1,'#ffd040');R(5,5,2,2-w,'#801808');R(11,5,2,1+w,'#801808');R(5,1+w,1,1,'#ff8a30');});
 defAnimal('toad',14,11,(R,f)=>{const s=f?1:0;R(2,4-s,10,6+s,'#5a8a3a');R(2,4-s,10,1,'#7aaa5a');R(3,2-s,3,3,'#5a8a3a');R(8,2-s,3,3,'#5a8a3a');R(4,2-s,1,1,'#ffd040');R(9,2-s,1,1,'#ffd040');R(4,6,6,3,'#c8d080');R(3,7,1,1,'#3a5a22');R(10,5,1,1,'#3a5a22');R(0,8,3,2,'#4a7a2e');R(11,8,3,2,'#4a7a2e');});
 defAnimal('monkey',12,13,(R,f)=>{R(3,5,6,6,'#8a5a3a');R(3,1,6,5,'#8a5a3a');R(4,2,4,3,'#e8a090');R(5,3,1,1,'#14101a');R(7,3,1,1,'#14101a');R(2,2,1,2,'#e8a090');R(9,2,1,2,'#e8a090');R(4,6,4,4,'#c8906a');R(9,6,2,1,'#8a5a3a');R(10,4+(f?1:0),1,3,'#8a5a3a');R(0,8-(f?1:0),3,1,'#6a4228');R(0,6-(f?1:0),1,2,'#6a4228');const l=f?1:0;R(3,11,2,2-l,'#5a3a22');R(7,11,2,1+l,'#5a3a22');});
 defAnimal('wolf',18,11,(R,f)=>{R(3,3,10,5,'#c8d0dc');R(3,3,10,1,'#f0f4ff');R(3,6,10,2,'#9aa4b4');R(12,1,4,4,'#c8d0dc');R(16,3,2,2,'#c8d0dc');R(17,3,1,1,'#14101a');R(14,2,1,1,'#3a6aa0');R(12,0,1,2,'#9aa4b4');R(14,0,1,1,'#9aa4b4');R(0,3+(f?1:0),3,2,'#e0e6f0');const l=f?1:0;R(4+l,8,1,3,'#8a94a4');R(6-l,8,1,3,'#8a94a4');R(10+l,8,1,3,'#8a94a4');R(12-l,8,1,3,'#8a94a4');});
 defAnimal('crane',14,18,(R,f)=>{R(4,6,7,5,'#f0f4f8');R(3,6,2,4,'#14141c');R(10,2,1,6,'#f0f4f8');R(10,1,3,2,'#f0f4f8');R(11,0,1,1,'#d02030');R(13,2,2,1,'#e0b040');R(11,1,1,1,'#14101a');const l=f?1:0;R(6,11,1,7,'#3a3a3a');R(8,11,1,7-l*2,'#3a3a3a');R(8+l,16-l*2,2,1,'#3a3a3a');if(f){R(1,4,4,2,'#e0e6f0');R(0,3,2,1,'#14141c');}});
 defAnimal('bat',14,9,(R,f)=>{R(5,3,4,4,'#3a2a4a');R(6,2,1,1,'#3a2a4a');R(8,2,1,1,'#3a2a4a');R(6,4,1,1,'#ff4060');R(8,4,1,1,'#ff4060');if(f){R(0,1,5,2,'#4a3a5a');R(9,1,5,2,'#4a3a5a');R(0,3,2,1,'#4a3a5a');R(12,3,2,1,'#4a3a5a');}else{R(1,4,4,3,'#4a3a5a');R(9,4,4,3,'#4a3a5a');R(0,6,2,1,'#4a3a5a');R(12,6,2,1,'#4a3a5a');}});
 defAnimal('raven',14,11,(R,f)=>{R(3,4,8,5,'#1e1a24');R(3,4,8,1,'#3a3444');R(10,2,3,3,'#1e1a24');R(13,3,1,1,'#c8a040');R(11,3,1,1,'#ff3030');R(0,5,3,2,'#14101a');if(f){R(4,1,5,3,'#2a2432');R(5,0,3,1,'#2a2432');}else{R(4,5,5,3,'#2a2432');}R(6,9,1,2,'#6a5a3a');R(8,9,1,2,'#6a5a3a');});
})();
{const P2=o=>SH(Object.assign({w:.55,sp:62,dmg:9,pd:8,rec:.5,cnt:1},o));
 Object.assign(ET,{
  boar:{animal:1,n:'WILD BOAR',hp:70,spd:44,pos:60,r:6,ai:'melee',rng:90,wl:10,cdMin:1,cdMax:1.8,atks:[CH({w:.6,sp:240,dur:.6,dmg:22,dmin:30})],volley:P2({pat:'wall',cnt:7,sp:58,col:'#a08060',st:'big',r:4})},
  rat:{animal:1,n:'GIANT RAT',hp:18,spd:70,pos:12,r:4,ai:'dasher',rng:50,wl:4,cdMin:.6,cdMax:1.1,atks:[TH({w:.3,dist:40,sp:200,dmg:8,pd:8})]},
  tanuki:{animal:1,n:'TANUKI',hp:40,spd:40,pos:30,r:5,ai:'ranged',keep:85,rng:140,wl:6,cdMin:.9,cdMax:1.6,atks:[P2({cnt:3,spread:.6,sp:110,col:'#5aaa4a',st:'boom',bT:1.4}),P2({pat:'mines',cnt:2,col:'#c8a070',st:'mine',fuse:1.4})]},
  salamander:{animal:1,n:'FIRE SALAMANDER',hp:46,spd:38,pos:34,r:5,ai:'ranged',keep:70,rng:120,wl:8,cdMin:.8,cdMax:1.4,atks:[P2({pat:'stream',cnt:8,sp:70,col:'#ff8a30',st:'accel',acc:1.4,cap:200,reps:2,gap:.3}),P2({pat:'curtain',cnt:6,sp:70,col:'#f60',curve:1})],death:'boom'},
  toad:{animal:1,n:'GIANT TOAD',hp:60,spd:28,pos:44,r:6,ai:'ranged',keep:60,rng:120,wl:8,cdMin:1,cdMax:1.8,atks:[LP({w:.5,air:.6,rad:30,dmg:18}),P2({pat:'flower',cnt:14,reps:2,gap:.35,sp:50,col:'#8f4',st:'wave'})],death:'ring'},
  monkey:{animal:1,n:'TEMPLE MACAQUE',hp:34,spd:60,pos:26,r:5,ai:'dasher',rng:90,wl:6,cdMin:.8,cdMax:1.3,atks:[P2({cnt:2,spread:.3,sp:90,col:'#f8a050',st:'curve',curve:1.6,reps:3,gap:.15}),TH({w:.3,dist:60,sp:220,dmg:10})]},
  wolf:{animal:1,n:'SNOW WOLF',hp:44,spd:66,pos:34,r:5,ai:'dasher',rng:80,wl:8,cdMin:.8,cdMax:1.4,atks:[TH({w:.35,dist:80,sp:260,dmg:14,pd:16})],volley:P2({pat:'gapring',cnt:18,reps:2,gap:.4,gw:.45,sp:60,col:'#cff'})},
  crane:{animal:1,n:'WHITE CRANE',hp:50,spd:42,pos:36,r:5,ai:'ranged',keep:100,rng:150,wl:6,cdMin:1,cdMax:1.7,atks:[P2({pat:'wall',cnt:11,sp:64,col:'#e8eef6',st:'wave',wa:40}),P2({pat:'cross',dirs:6,cnt:2,reps:3,gap:.35,sp:58,col:'#9cf',rot:.25})]},
  bat:{animal:1,n:'CAVE BAT',hp:20,spd:64,pos:14,r:4,ai:'dasher',rng:70,wl:4,cdMin:.7,cdMax:1.2,fly:1,atks:[P2({cnt:3,spread:.4,sp:80,col:'#d080ff',st:'wave',wa:50,reps:2,gap:.2})]},
  raven:{animal:1,n:'CORPSE RAVEN',hp:30,spd:58,pos:22,r:4,ai:'ranged',keep:90,rng:150,wl:6,fly:1,cdMin:.7,cdMax:1.2,atks:[P2({pat:'stream',cnt:5,sp:85,col:'#f24',st:'accel',reps:3,gap:.2}),P2({pat:'spiral',arms:3,spin:.3,reps:8,gap:.1,sp:60,col:'#a02030'})]}});
 ['boar','rat','tanuki','salamander','toad','monkey','wolf','crane','bat','raven'].forEach((t,i)=>DUN[i].pool.push(t,t));}
function deathFx(e){const k=e.t&&e.t.death;if(!k||e.boss)return;
 if(k==='boom')dh.push({x:e.x,y:e.y,r:26,t:.45,dmg:14*e.dm,col:'#ff8a30'});
 else if(k==='ring'){const n=10,c=e.type==='frog'?'#8f4':'#d080ff';for(let i=0;i<n;i++){const a=i/n*TAU;projs.push(mkProj('e',e.x,e.y,a,55,8*e.dm,{col:c,own:null}));}}}
['wisp','shielder','shaman','sniper','assassin'].forEach(t=>loadOverride(t,'e_'+t+'.png',32,32));
let wispSpr=null;
function wispSprite(){
 if(wispSpr)return wispSpr;
 const rows=['...oooo...','..owwwwo..','.owwyywwo.','owwkyykwwo','owwyyyywwo','.owwwwwwo.','.owwwwwwo.','..owowwo..','..o.oo.o..'],pal={o:'#3a1008',w:'#ff8a30',y:'#ffe080',k:'#14101a'};
 const c=mk(10,14,g=>{rows.forEach((r,y)=>{for(let x=0;x<10;x++){const ch=r[x];if(!ch||ch==='.')continue;g.fillStyle=pal[ch];g.fillRect(x,y+3,1,1);}});});
 return (wispSpr={c,wc:whiteOf(c),fw:10,fh:14,frames:1,sc:1});
}

// ---------- boss sprites: code-drawn 40x50 figures, frames 0-1 idle (breathing), 2 attack ----------
// each boss is dressed in its dungeon's colours (grass, stone, castle wood, embers, swamp, autumn temple, snow, marble, crystal cave, blood)
const BLOOK=[
 {bw:7,skin:'#e0b080',ar:'#4a6a2a',ad:'#2a3a1a',ac:'#c8a040',lg:'#2a2a18',head:'kabuto',wpn:'spear',back:'banner',bn:'#3e7a2a'},
 {bw:11,skin:'#8a8a94',ar:'#4a4a52',ad:'#2a2a30',ac:'#a0a0a8',lg:'#6a6a74',head:'bald',wpn:'club',back:'chains',big:1},
 {bw:7,skin:'#e0b080',ar:'#7a3a20',ad:'#4a2010',ac:'#e0c070',lg:'#2a1a10',head:'hair',wpn:'bow',back:'cape',cape:'#4a2414'},
 {bw:6,skin:'#e8c8b0',ar:'#8a2a10',ad:'#4a1008',ac:'#ffb040',lg:'#2a0a04',head:'bun',wpn:'daggers',back:'wings',w1:'#ff6020',w2:'#ffc060'},
 {bw:11,skin:'#3a3a28',ar:'#6a7a4a',ad:'#3a4a2a',ac:'#a8b878',lg:'#4a5a34',head:'ape',wpn:'fists',back:null,big:1,fur:'#7a8a5a'},
 {bw:7,skin:'#d8d0c0',ar:'#e8d8b0',ad:'#b8a070',ac:'#c03020',lg:'#c8bca0',head:'veil',wpn:'naginata',back:'cape',cape:'#c04020'},
 {bw:9,skin:'#c8c8d0',ar:'#a8c0d8',ad:'#5a7090',ac:'#ffffff',lg:'#4a6080',head:'helm',wpn:'greatsword',back:'cape',cape:'#2a4a7a'},
 {bw:7,skin:'#c8b090',ar:'#c8ccd4',ad:'#8a92a0',ac:'#4a90c0',lg:'#6a7280',head:'owl',wpn:'blades',back:'feathers',f1:'#e0e4ec',f2:'#a8b0bc'},
 {bw:11,skin:'#2a1040',ar:'#3a1a5a',ad:'#1a0830',ac:'#d080ff',lg:'#20103a',head:'demon',wpn:'claws',back:'flames',big:1,fl1:'#c060ff',fl2:'#ff80e0'},
 {bw:7,skin:'#e0b890',ar:'#3a0a14',ad:'#1a0408',ac:'#e04050',lg:'#1e0a10',head:'long',wpn:'katana',back:'spear'}];function bossSheet(i){const o=BLOOK[i],FW=44,FH=52,N=3,sheet=mk(FW*N,FH,()=>{}),sg=sheet.getContext('2d');
 for(let f=0;f<N;f++){const fr=mk(FW,FH,g=>{const R=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),w,h);};
  const cx=22,bw=o.bw,br=f===1?1:0,big=o.big,ty=(big?20:18)+br,atk=f===2,ar=o.ar,ad=o.ad,ac=o.ac;
  // back pieces
  if(o.back==='banner'){R(cx-bw-2,2,1,ty+12,'#3a2a1a');R(cx-bw-8,3,6,12,o.bn||'#c02820');R(cx-bw-7,6,4,3,'#e0b040');}
  if(o.back==='wings'){g.globalAlpha=.75;for(const s of [-1,1]){for(let j=0;j<12;j++){const w=Math.round(10*Math.sin(j/11*Math.PI));R(s<0?cx-6-w:cx+6,ty-4+j,w,1,j%3?(o.w1||'#c060e0'):(o.w2||'#f0a0e0'));}}g.globalAlpha=1;}
  if(o.back==='feathers'){for(let j=0;j<20;j++){const w=bw+3+(j>>2);R(cx-w,ty+j,w*2,1,j%4===0?(o.f1||'#6a7a6a'):(o.f2||'#3e4a3e'));}}
  if(o.back==='flames'){const fl=f*2;for(let k=0;k<7;k++){const h=8+((k*5+fl)%7);R(cx-12+k*4,ty-h+2,3,h,k%2?(o.fl1||'#ff6020'):(o.fl2||'#ffb030'));}}
  if(o.back==='spear'){for(let j=0;j<40;j++)R(cx+bw-2-j*.4,2+j,1,1,'#5a3a22');R(cx+bw-3,1,2,4,'#c8c8d0');}
  if(o.back==='cape'){for(let j=0;j<22;j++)R(cx-bw-1-(j>>3),ty+2+j,bw*2+2+(j>>2),1,o.cape);}
  if(o.back==='chains'){for(let j=0;j<6;j++){R(cx-bw-4+j,ty+14+j*2,2,1,'#8a8a96');R(cx+bw+2-j,ty+14+j*2,2,1,'#8a8a96');}}
  // legs and skirt
  const ly=ty+(big?16:14);R(cx-bw+1,ly+6,bw-1,FH-ly-8,o.lg);R(cx+1,ly+6,bw-1,FH-ly-8,o.lg);R(cx-bw,FH-3,bw,3,'#1a1418');R(cx+1,FH-3,bw,3,'#1a1418');
  for(let j=0;j<8;j++){const w=bw+1+(j>>1);R(cx-w,ly+j,w*2,1,j%3===2?ad:ar);}R(cx-1,ly,2,8,ad);
  // torso and belt
  R(cx-bw,ty,bw*2,ly-ty,ar);R(cx-bw,ty,2,ly-ty,shade(ar,.2));R(cx+bw-2,ty,2,ly-ty,ad);R(cx-bw,ly-2,bw*2,2,ac);
  if(!big){R(cx-2,ty+2,4,ly-ty-5,ad);R(cx-1,ty+3,2,2,ac);}else{R(cx-bw+2,ty+3,bw*2-4,3,shade(ar,.12));R(cx-bw+3,ty+8,bw*2-6,2,ad);}
  // shoulders
  R(cx-bw-3,ty-1,5,5,ac);R(cx+bw-2,ty-1,5,5,ac);R(cx-bw-3,ty+3,5,1,ad);R(cx+bw-2,ty+3,5,1,ad);
  // arms: left hangs, right holds weapon
  R(cx-bw-3,ty+4,3,10,big?o.skin:ar);R(cx-bw-3,ty+13,3,3,o.skin);
  const hx=atk?cx+bw+5:cx+bw+1,hy=atk?ty+4:ty+12;R(cx+bw,ty+4,3,atk?4:9,big?o.skin:ar);R(hx,hy,3,3,o.skin);if(atk)R(cx+bw+2,ty+4,4,3,big?o.skin:ar);
  // weapon
  const W=o.wpn;
  if(W==='spear'||W==='naginata'){if(atk){for(let j=0;j<22;j++)R(hx-6+j,hy+2-j*.35,1,1,'#5a3a22');R(hx+15,hy-7,6,2,'#d8dce4');if(W==='naginata')R(hx+18,hy-9,3,2,'#d8dce4');}else{R(hx+1,4,1,FH-8,'#5a3a22');R(hx,0,3,5,'#d8dce4');if(W==='naginata')R(hx+2,0,2,3,'#fff');}}
  else if(W==='club'){if(atk){for(let j=0;j<14;j++)R(hx+j,hy-j*.5,3,3,'#6a4a2a');R(hx+12,hy-9,5,5,'#4a3220');}else{R(hx,hy-14,4,16,'#6a4a2a');R(hx-1,hy-17,6,5,'#4a3220');}}
  else if(W==='bow'){const bx=atk?hx+3:hx+1;for(let j=-11;j<=11;j++)R(bx+Math.round(3*Math.cos(j/11*1.4)),hy+j,1,1,'#5a3a22');R(bx,hy-11,1,22,'#e8e8f0');if(atk)R(hx-6,hy,9,1,'#c8c8d0');}
  else if(W==='daggers'||W==='blades'){if(atk){R(hx+3,hy-1,8,1,'#e8eef6');R(cx-bw-6,ty+12,6,1,'#e8eef6');}else{R(hx+1,hy-6,1,6,'#e8eef6');R(cx-bw-2,ty+16,1,6,'#e8eef6');}}
  else if(W==='fists'){R(hx-1,hy-1,5,5,o.skin);if(atk)R(hx+3,hy,2,3,shade(o.skin,.3));}
  else if(W==='greatsword'){if(atk){for(let j=0;j<20;j++)R(hx+j,hy-j*.25,2,3,'#c8d0d8');R(hx-2,hy-1,2,5,'#3a3a42');}else{R(hx+1,hy-24,3,24,'#c8d0d8');R(hx+2,hy-24,1,24,'#fff');R(hx-1,hy,7,2,'#3a3a42');}}
  else if(W==='claws'){for(let k=0;k<3;k++)R(hx+3+(atk?3:0),hy-1+k*2,atk?5:3,1,'#ffb030');}
  else if(W==='katana'){if(atk){for(let j=0;j<18;j++)R(hx+j,hy+1-j*.6,1,1,j<3?'#3a3a42':'#f0f4ff');}else{for(let j=0;j<16;j++)R(hx+1+j*.15,hy-15+j,1,1,'#f0f4ff');R(hx,hy,3,2,'#3a3a42');}}
  // head
  const hx0=cx-4,hy0=ty-(big?8:10);
  if(o.head==='ape'){R(cx-6,hy0-1,12,10,o.fur||'#d8c8b0');R(cx-4,hy0+2,8,6,o.skin);R(cx-3,hy0+3,2,1,'#ffd040');R(cx+1,hy0+3,2,1,'#ffd040');R(cx-2,hy0+6,4,1,'#2a1a14');}
  else if(o.head==='demon'){R(cx-5,hy0,10,9,o.skin);R(cx-3,hy0+3,2,2,'#ff6020');R(cx+1,hy0+3,2,2,'#ff6020');R(cx-7,hy0-4,2,6,'#d8d0c0');R(cx+5,hy0-4,2,6,'#d8d0c0');R(cx-8,hy0-6,2,3,'#d8d0c0');R(cx+6,hy0-6,2,3,'#d8d0c0');R(cx-2,hy0+7,4,1,'#ffb030');}
  else{R(hx0,hy0+2,8,8,o.skin);R(hx0+2,hy0+5,1,1,'#14101a');R(hx0+5,hy0+5,1,1,'#14101a');
   if(o.head==='kabuto'){R(hx0-2,hy0,12,4,ad);R(hx0-1,hy0+1,10,1,ar);R(hx0+1,hy0-4,1,4,ac);R(hx0+6,hy0-4,1,4,ac);R(hx0,hy0-5,2,1,ac);R(hx0+6,hy0-5,2,1,ac);R(hx0+2,hy0+8,4,2,'#2a1a14');}
   else if(o.head==='bald'){R(hx0,hy0+1,8,3,o.skin);R(hx0+1,hy0+8,6,2,'#3a3a40');}
   else if(o.head==='hair'){R(hx0-1,hy0,10,4,'#1a1418');R(hx0+3,hy0-3,3,3,'#1a1418');R(hx0-1,hy0+4,2,4,'#1a1418');}
   else if(o.head==='bun'){R(hx0-1,hy0,10,4,'#d8d8e0');R(hx0+2,hy0-3,4,3,'#d8d8e0');R(hx0+5,hy0-3,3,1,'#c060e0');}
   else if(o.head==='veil'){R(hx0-1,hy0,10,11,'#f0ece0');R(hx0+1,hy0+3,6,3,'#d0b890');R(hx0+2,hy0+4,1,1,'#14101a');R(hx0+5,hy0+4,1,1,'#14101a');R(hx0-2,hy0-1,12,2,'#d0a030');}
   else if(o.head==='helm'){R(hx0-1,hy0,10,10,'#8a929c');R(hx0+1,hy0+4,6,1,'#14101a');R(hx0+3,hy0+2,2,6,'#6a727c');R(hx0+3,hy0-5,2,5,'#a02028');}
   else if(o.head==='owl'){R(hx0-2,hy0-1,12,11,o.f2||'#6a6a5a');R(hx0,hy0+2,8,6,'#d8d0b0');R(hx0+1,hy0+3,2,2,'#ffd040');R(hx0+5,hy0+3,2,2,'#ffd040');R(hx0+3,hy0+5,2,2,'#c89040');R(hx0-2,hy0-3,3,3,'#6a6a5a');R(hx0+7,hy0-3,3,3,'#6a6a5a');}
   else if(o.head==='long'){R(hx0-1,hy0,10,3,'#f0f0f8');R(hx0-2,hy0+2,2,14,'#f0f0f8');R(hx0+8,hy0+2,2,10,'#e0e0e8');R(hx0+1,hy0+8,6,4,'#f0f0f8');R(hx0+3,hy0-2,2,2,'#f0f0f8');}}
 });
 sg.drawImage(outlined(fr),f*FW,0);}
 return {c:sheet,wc:whiteOf(sheet),fw:FW,fh:FH,frames:N,sc:o.big?1.3:1.1,ok:true,bossSpr:1};}
const BOSSSPR=[];
// ---- boss movement phases: chase you down, orbit and pepper you, dash across the room, blink around ----
const BMODES=[['chase','dashes'],['chase','circle'],['circle','blink'],['blink','dashes'],['chase','dashes'],['circle','blink'],['chase','dashes'],['blink','dashes','circle'],['chase','circle','dashes'],['dashes','blink','circle','chase']];
// ---- every boss has its own bullet language: a colour, signature bullet styles, and a named barrage set per phase ----
// burst:n,gap:s repeats a pattern n times (spirals); damage climbs each phase
const BSTYLE=[
 {c:'#e04030',t:['WAR DRUMS','CAVALRY CHARGE','LAST STAND'],ph:[
  [{pat:'wall',cnt:11,sp:80,arrow:true,col:'#d0a040'},{pat:'gapring',cnt:18,gw:.5,col:'#e04030'}],
  [{pat:'wall',cnt:13,sp:90,arrow:true,col:'#d0a040'},{pat:'stream',cnt:6,sp:110,st:'accel',arrow:true,col:'#ffd060'},{pat:'gapring',cnt:22,gw:.45,col:'#e04030'}],
  [{pat:'cross',dirs:6,cnt:3,sp:70,st:'boom',bT:1.4,col:'#ff6040',rot:.2},{pat:'wall',cnt:15,sp:95,arrow:true,col:'#d0a040'},{pat:'curtain',cnt:9,sp:85,col:'#ffd060'}]]},
 {c:'#a0a0a8',t:['CHAIN SWING','BOULDER HAIL','UNCHAINED'],ph:[
  [{pat:'flower',cnt:12,sp:45,st:'big',col:'#a0a0a8'},{pat:'mines',cnt:4,st:'mine',fuse:1.2,col:'#c8b8a0'}],
  [{pat:'gapring',cnt:16,gw:.5,sp:50,st:'big',col:'#a0a0a8'},{pat:'stream',cnt:4,sp:70,st:'split',splitT:.8,col:'#c8b8a0'},{pat:'mines',cnt:6,st:'mine',col:'#c8b8a0'}],
  [{pat:'flower',cnt:16,sp:50,st:'split',splitT:1,col:'#c8b8a0'},{pat:'gapring',cnt:20,gw:.45,sp:55,st:'big',col:'#a0a0a8'},{pat:'mines',cnt:8,st:'mine',col:'#c8b8a0'}]]},
 {c:'#cde',t:['ARROW VOLLEY','LIGHTNING','STORM GENERAL'],ph:[
  [{pat:'stream',cnt:5,sp:120,arrow:true,col:'#cde'},{pat:'curtain',cnt:9,sp:90,arrow:true,col:'#cde',curve:.8}],
  [{pat:'cross',dirs:4,cnt:4,sp:90,st:'accel',col:'#ff6'},{pat:'curtain',cnt:11,sp:95,arrow:true,col:'#cde'},{pat:'stream',cnt:6,sp:130,arrow:true,col:'#cde'}],
  [{pat:'cross',dirs:8,cnt:3,sp:95,st:'accel',col:'#ff6',rot:.25},{pat:'wall',cnt:15,sp:110,arrow:true,col:'#cde'},{pat:'gapring',cnt:26,gw:.4,sp:75,col:'#ff6'}]]},
 {c:'#f0a0e0',t:['DANCING WINGS','PHANTOM SWARM','ILLUSION'],ph:[
  [{pat:'flower',cnt:14,sp:55,st:'wave',wa:50,wf:6,col:'#f0a0e0'},{pat:'curtain',cnt:9,sp:70,col:'#c8f',curve:1.2}],
  [{pat:'spiral',arms:5,spin:.5,sp:60,st:'wave',col:'#f0a0e0',burst:6,gap:.12},{pat:'flower',cnt:18,sp:55,st:'wave',col:'#c8f'},{pat:'curtain',cnt:11,sp:75,col:'#f0a0e0',curve:1.4}],
  [{pat:'flower',cnt:16,sp:60,st:'split',splitT:.9,col:'#f0a0e0'},{pat:'spiral',arms:6,spin:.55,sp:65,st:'wave',col:'#c8f',burst:8,gap:.1},{pat:'gapring',cnt:24,gw:.45,sp:60,col:'#fff0ff'}]]},
 {c:'#a98',t:['ROCK THROW','POISON FRENZY','HEADLESS FURY'],ph:[
  [{pat:'stream',cnt:3,sp:80,st:'boom',bT:1.6,r:5,col:'#a98'},{pat:'gapring',cnt:16,gw:.5,sp:55,st:'big',col:'#a98'}],
  [{pat:'mines',cnt:6,st:'mine',col:'#8f4'},{pat:'cross',dirs:4,cnt:3,sp:75,st:'boom',bT:1.5,col:'#a98'},{pat:'flower',cnt:16,sp:55,col:'#8f4'}],
  [{pat:'spiral',arms:4,spin:.45,sp:70,st:'boom',bT:1.4,col:'#c8c0b0',burst:6,gap:.12},{pat:'mines',cnt:8,st:'mine',col:'#8f4'},{pat:'gapring',cnt:22,gw:.42,sp:65,st:'big',col:'#a98'}]]},
 {c:'#d8b040',t:['PRAYER BEADS','THOUSAND HANDS','NIRVANA'],ph:[
  [{pat:'gapring',cnt:20,gw:.5,sp:45,st:'curve',curve:.6,col:'#e8e0ff'},{pat:'spiral',arms:4,spin:.35,sp:55,col:'#d8b040',burst:6,gap:.12}],
  [{pat:'flower',cnt:18,sp:50,st:'split',splitT:1.1,col:'#d8b040'},{pat:'gapring',cnt:24,gw:.45,sp:50,st:'curve',curve:-.7,col:'#e8e0ff'},{pat:'spiral',arms:5,spin:.4,sp:60,col:'#d8b040',burst:8,gap:.1}],
  [{pat:'spiral',arms:6,spin:.3,sp:60,col:'#e8e0ff',burst:10,gap:.09},{pat:'wall',cnt:15,sp:70,col:'#d8b040'},{pat:'flower',cnt:20,sp:55,st:'split',col:'#e8e0ff'}]]},
 {c:'#b0b8c0',t:['IRON WALL','SIEGE','UNBREAKABLE'],ph:[
  [{pat:'wall',cnt:9,sp:55,st:'big',col:'#b0b8c0'},{pat:'stream',cnt:5,sp:70,st:'accel',cap:260,col:'#e0e8f0'}],
  [{pat:'wall',cnt:11,sp:60,st:'big',col:'#b0b8c0'},{pat:'cross',dirs:4,cnt:4,sp:70,st:'accel',col:'#e0e8f0'},{pat:'stream',cnt:6,sp:75,st:'accel',cap:280,col:'#ffd060'}],
  [{pat:'cross',dirs:8,cnt:3,sp:70,st:'big',col:'#b0b8c0',rot:.2},{pat:'wall',cnt:13,sp:70,st:'big',col:'#b0b8c0'},{pat:'gapring',cnt:22,gw:.42,sp:65,st:'accel',col:'#ffd060'}]]},
 {c:'#9f9',t:['SHADOW KUNAI','SMOKE AND MIRRORS','FATHER OF SHADOWS'],ph:[
  [{pat:'stream',cnt:4,sp:150,arrow:true,col:'#9f9'},{pat:'mines',cnt:5,st:'mine',col:'#9f9'}],
  [{pat:'curtain',cnt:11,sp:110,arrow:true,col:'#9f9',curve:1},{pat:'mines',cnt:7,st:'mine',col:'#9f9'},{pat:'stream',cnt:6,sp:160,arrow:true,col:'#cfc'}],
  [{pat:'spiral',arms:4,spin:.6,sp:120,arrow:true,col:'#9f9',burst:8,gap:.08},{pat:'mines',cnt:10,st:'mine',col:'#9f9'},{pat:'wall',cnt:13,sp:120,arrow:true,col:'#cfc'}]]},
 {c:'#f60',t:['HELLFIRE','BURNING HATRED','INFERNO'],ph:[
  [{pat:'gapring',cnt:20,gw:.45,sp:50,st:'accel',cap:200,col:'#f60'},{pat:'stream',cnt:4,sp:70,st:'split',splitT:.8,col:'#ff5020'}],
  [{pat:'flower',cnt:20,sp:50,st:'accel',col:'#f60'},{pat:'mines',cnt:7,st:'mine',col:'#ff5020'},{pat:'spiral',arms:5,spin:.45,sp:60,col:'#ffa040',burst:8,gap:.1}],
  [{pat:'spiral',arms:6,spin:.4,sp:65,st:'accel',col:'#f60',burst:10,gap:.09},{pat:'flower',cnt:18,sp:55,st:'split',col:'#ff5020'},{pat:'cross',dirs:6,cnt:3,sp:70,st:'boom',bT:1.5,col:'#ffa040'}]]},
 {c:'#ffe',t:['WIND BLADE','SPEAR OF HEAVEN','SWORD SAINT'],ph:[
  [{pat:'curtain',cnt:9,sp:110,arrow:true,col:'#fff',curve:.7},{pat:'gapring',cnt:22,gw:.42,sp:70,st:'wave',col:'#ffe'}],
  [{pat:'cross',dirs:6,cnt:4,sp:100,arrow:true,col:'#ffe',rot:.3},{pat:'wall',cnt:15,sp:100,arrow:true,col:'#fff'},{pat:'spiral',arms:5,spin:.5,sp:80,col:'#d0a030',burst:8,gap:.09}],
  [{pat:'spiral',arms:7,spin:.45,sp:85,col:'#ffe',burst:12,gap:.08},{pat:'gapring',cnt:28,gw:.38,sp:80,st:'accel',col:'#d0a030'},{pat:'curtain',cnt:13,sp:120,arrow:true,col:'#fff',curve:1}]]}];
const bsty=e=>BSTYLE[e.di]||BSTYLE[0];
// a boss's movement-mode shots are tinted with its own colour so every fight has one visual language
const bShot=(e,o)=>enemyShoot(e,Object.assign({sp:62,dmg:10,pd:8,col:'#f8c',cnt:1},o,e.boss?{col:bsty(e).c}:{}),Math.atan2(P.y-e.y,P.x-e.x));
// fire one of the boss's signature barrages (bursts are queued and fired over the next frames)
function bossBarrage(e,cfg){const o=Object.assign({sp:62,dmg:9+2*e.phase,pd:8,cnt:1},cfg),n=o.burst||1;e.brq=e.brq||[];
 for(let i=0;i<n;i++)e.brq.push({t:i*(o.gap||.1),o});}
function tickBarrage(e,dt){if(!e.brq||!e.brq.length)return;for(const b of e.brq){b.t-=dt;if(b.t<=0){b.done=true;enemyShoot(e,b.o,Math.atan2(P.y-e.y,P.x-e.x));}}e.brq=e.brq.filter(b=>!b.done);}
// how close a boss gets when it hunts or walks toward you: near enough to pressure, never on top of you
const bossGap=e=>e.r+34;
function bossContact(e){if(P.iv<=0&&P.dash<=0&&Math.hypot(P.x-e.x,P.y-e.y)<e.r+6)hitPlayer(16*e.dm,e.x,e.y,{src:e,pd:20});}
function bossModes(e,dt,d,a){
 // constant background pressure
 // the boss's own signature barrages for this phase, faster each phase
 tickBarrage(e,dt);
 e.bgT=(e.bgT==null?1.5:e.bgT)-dt;if(e.bgT<=0&&!e.act){e.bgT=e.phase>=3?.6:e.phase===2?.8:1;const L=bsty(e).ph[Math.min(2,e.phase-1)];bossBarrage(e,L[(e.bgN=(e.bgN||0)+1)%L.length]);}
 e.modeT=(e.modeT==null?5:e.modeT)-dt;
 if(!e.mode){if(e.modeT>0||e.act)return false;const k=pick(BMODES[e.di]||['chase']);e.mode={k,t:0,n:0,ph:0,tt:0};txtFx(e.x,e.y,{chase:'HUNTING!',circle:'CIRCLING',dashes:'RUSH!',blink:'VANISH'}[k],'#f55');}
 const m=e.mode,sp=e.spd;m.t+=dt;m.tt-=dt;
 const end=()=>{e.mode=null;e.modeT=rnd(6,9)*(e.phase>=2?.75:1)*(e.enraged?.7:1);e.cd=.6;e.tele=0;return true;};
 if(m.k==='chase'){if(m.t>4.5)return end();const s=sp*2.1*(e.phase>=2?1.15:1),gap=bossGap(e);
  // hound you from just behind: close the distance fast, but stop short instead of standing on you
  if(d>gap){const v=Math.min(s,(d-gap)/dt);move(e,Math.cos(a)*v*dt,Math.sin(a)*v*dt,e.r);}
  else if(d<gap*.75){move(e,-Math.cos(a)*sp*dt,-Math.sin(a)*sp*dt,e.r);}
  else{const sa=a+Math.PI/2*e.sdir;move(e,Math.cos(sa)*sp*.8*dt,Math.sin(sa)*sp*.8*dt,e.r);}
  bossContact(e);
  if(m.tt<=0){m.tt=.22;projs.push(mkProj('e',e.x,e.y,a+Math.PI+rnd(-.6,.6),12,9*e.dm,{own:e,col:'#f64',r:3,life:2.6,pd:6}));if((m.n=(m.n+1))%3===0)bShot(e,{cnt:3,spread:.35,sp:95,col:'#f84'});}return true;}
 if(m.k==='circle'){if(m.t>5.5)return end();m.ang=(m.ang==null?Math.atan2(e.y-P.y,e.x-P.x):m.ang)+dt*(1.5+.3*e.phase)*e.sdir;const tx=P.x+Math.cos(m.ang)*85,ty=P.y+Math.sin(m.ang)*85,da=Math.atan2(ty-e.y,tx-e.x),dd=Math.hypot(tx-e.x,ty-e.y),s=Math.min(dd/dt,sp*3);
  move(e,Math.cos(da)*s*dt,Math.sin(da)*s*dt,e.r);if(m.tt<=0){m.tt=.3;bShot(e,{sp:110,col:'#fd4',st:'accel',cap:200});m.n++;if(m.n%4===0)bShot(e,{pat:'gapring',cnt:18,gw:.45,sp:55,col:'#f8c'});}return true;}
 if(m.k==='dashes'){const N=3+e.phase;if(m.n>=N)return end();
  if(m.ph===0){if(m.ph0==null){m.ph0=1;m.tt=.42-.05*e.phase;m.da=a;}e.tele=1;if(m.tt<=0){m.ph=1;m.tt=.26;m.ph0=null;e.tele=0;sfx('dash');}return true;}
  else{const s=400;move(e,Math.cos(m.da)*s*dt,Math.sin(m.da)*s*dt,e.r);bossContact(e);if(Math.random()<dt*30)projs.push(mkProj('e',e.x,e.y,m.da+Math.PI/2*(Math.random()<.5?1:-1),30,8*e.dm,{own:e,col:'#f64',r:2,life:1.6,pd:5}));
   if(m.tt<=0){m.ph=0;m.n++;bShot(e,{pat:'flower',cnt:12+e.phase*2,sp:58,col:'#f8c'});shake=Math.max(shake,3);}return true;}}
 if(m.k==='blink'){const N=3+e.phase;if(m.n>=N)return end();
  if(m.tt<=0){const r=e.room;let tx=e.x,ty=e.y;for(let k=0;k<20;k++){const an=Math.random()*TAU,rr=rnd(60,115),x=P.x+Math.cos(an)*rr,y=P.y+Math.sin(an)*rr;if(!blocked(x,y,e.r)&&x>r.x*T&&x<(r.x+r.w)*T&&y>r.y*T&&y<(r.y+r.h)*T){tx=x;ty=y;break;}}
   spark(e.x,e.y,'#c8f',16,90);e.x=tx;e.y=ty;spark(e.x,e.y,'#c8f',16,90);fxRing(e.x,e.y,24,'#c8f',.3);sfx('dash');m.n++;m.tt=.85-.08*e.phase;
   bShot(e,m.n%2?{pat:'gapring',cnt:20+e.phase*3,gw:.45,sp:60,col:'#c8f'}:{pat:'stream',cnt:6,sp:100,st:'accel',col:'#f8c'});}return true;}
 return end();}
// ---------- boss mechanics ----------
const ST=mkA({n:'storm',w:.7,cnt:5,rad:22,dmg:22,delay:.9,spread:70,col:'#f55'});
(function(){
 const add=(i,ph,a)=>BOSS[i][ph].push(a),each=(i,fn)=>[...BOSS[i].k1,...BOSS[i].k2,...(BOSS[i].k3||[])].forEach(fn);
 each(0,a=>{if(a.n==='charge')a.trail='#f60';});
 each(1,a=>{if(a.n==='slam')a.rocks=8;});
 add(2,'k1',ST({cnt:3,col:'#ff8',wt:1,dmg:18}));add(2,'k2',ST({cnt:6,col:'#ff8',wt:2,dmg:20}));
 add(3,'k2',ST({cnt:5,col:'#c8f',wt:1,dmg:14,rad:18}));
 each(4,a=>{if(a.n==='slam')a.rocks=6;});add(4,'k2',SU({types:['wisp','wisp','wisp'],cnt:3,wt:1}));
 add(5,'k1',ST({cnt:4,col:'#e8e0ff',wt:1,dmg:16}));add(5,'k2',ST({cnt:7,col:'#e8e0ff',wt:2,dmg:18}));
 each(6,a=>{if(a.n==='slam')a.rocks=10;});add(6,'k2',SU({types:['shielder','shielder'],cnt:2,wt:1}));
 add(7,'k1',SU({types:['assassin'],cnt:2,wt:1}));add(7,'k2',ST({cnt:6,col:'#9f9',wt:2,dmg:18,rad:18}));
 each(8,a=>{if(a.n==='charge')a.trail='#f40';if(a.n==='slam')a.rocks=10;});add(8,'k2',ST({cnt:8,col:'#f60',wt:2,dmg:24,rad:24}));
 add(9,'k2',ST({cnt:6,col:'#ffe',wt:2,dmg:24}));add(9,'k3',ST({cnt:10,col:'#ffe',wt:3,dmg:26,spread:90}));
})();

// quicker boss wind-ups: charges, thrusts and slashes come out much faster
for(const b of BOSS)for(const ph of ['k1','k2','k3'])if(b[ph])for(const a of b[ph]){if(a.n==='charge'){a.w*=.5;a.sp*=1.35;}else if(a.n==='thrust'){a.w*=.65;a.sp=(a.sp||200)*1.2;}else if(a.n==='slash')a.w*=.75;else if(a.n==='leap')a.w*=.75;else if(a.n==='slam')a.w*=.8;}
for(const k in ET)for(const a of ET[k].atks||[])if(a.n==='charge')a.w*=.7;
// ---------- extra items (incl. legendaries) ----------
ITEMS.push(
 {id:'dblow',name:'MORTAL EDGE',d:'HITS ON BROKEN POSTURE ARE DEATHBLOWS',g:'M',r:2},
 {id:'pierce',name:'PIERCING SEAL',d:'ALL YOUR SHOTS PIERCE +1',g:'J',r:1},
 {id:'frost',name:'FROST CHARM',d:'EVERY ATTACK MAY CHILL. 3 = FREEZE',g:'Y',r:1},
 {id:'shock',name:'STATIC SEAL',d:'EVERY HIT MAY SHOCK AND ARC',g:'Q',r:1},
 {id:'qpow',name:'ARCANE FOCUS',d:'+30% Q DAMAGE',g:'1',r:0},
 {id:'epow',name:'DRAGON SCALE',d:'+25% ULTIMATE POWER',g:'2',r:1},
 {id:'ecd',name:'SOUL EATER',d:'KILLS CHARGE ULT MORE',g:'3',r:1},
 {id:'vamp',name:'BLOOD PACT',d:'EVERY HIT HEALS 2% OF DAMAGE',g:'4',r:1},
 {id:'glass',name:'GLASS CANNON',d:'+40% POWER, -25% HP',g:'5',r:2},
 {id:'storm',name:'THUNDER DRUM',d:'+20% DMG TO BURNING/SHOCKED',g:'9',r:2},
 {id:'echo',name:'ECHO SEAL',d:'15% CHANCE TO CAST TWICE',g:'6',r:3},
 {id:'phoenix',name:'PHOENIX FEATHER',d:'+1 REVIVE. REVIVING EXPLODES',g:'7',r:3},
 {id:'flare',name:'AMATERASU EYE',d:'CRITS EXPLODE',g:'8',r:3},
);
ITEMS.forEach(i=>ITEMBY[i.id]=i);RCOL.push('#fd4');

// ---------- rooms, props, shop, shrines, traps ----------
const ROOMCOL={treasure:'#fd4',shop:'#4cf',shrine:'#c6f',rest:'#6f6',elite:'#f84',trap:'#f44',altar:'#f33',ambush:'#f66',challenge:'#fc4'};
const ROOMORDER=['combat','elite','treasure','shop','ambush','rest','challenge','shrine','altar','elite','trap','combat','combat'];
function spotIn(r){let x,y,tries=0;do{x=ri(r.x+1,r.x+r.w-2);y=ri(r.y+1,r.y+r.h-2);tries++;}while((!map.t[y*MW+x]||(map.liq[y*MW+x]&&tries<30))&&tries<40);return {x:x*T+8,y:y*T+8};}
function roomCenter(r){return {x:(r.x+(r.w>>1))*T+8,y:(r.y+(r.h>>1))*T+8};}
function populateRoom(r,di){
 const th=DUN[di],c=roomCenter(r);
 const addE=(n,awake)=>{for(let k=0;k<n;k++){const s=spotIn(r),e=mkEnemy(pick(th.pool),s.x,s.y,r,di);if(awake)e.awake=true;enemies.push(e);}};
 switch(r.type){
  case 'elite':enemies.push(mkElite(pick(th.pool.filter(t=>t!=='wisp')),c.x,c.y,r,di));addE(ri(2,3));break;
  case 'treasure':props.push({k:'chest',x:c.x,y:c.y,room:r});addE(ri(1,2));break;
  case 'altar':props.push({k:'altar',x:c.x,y:c.y,room:r,col:'#f33',curse:true});addE(ri(1,2));break;
  case 'ambush':r.ev={k:'ambush',state:0};addE(2);break;
  case 'challenge':r.ev={k:'challenge',state:0};props.push({k:'gong',x:c.x,y:c.y,room:r});break;
  case 'shop':{props.push({k:'merchant',x:c.x,y:c.y-22,room:r});const ex=['rez'];for(let i=0;i<3;i++){const it=randItem(ex);ex.push(it.id);props.push({k:'pedestal',x:c.x-26+i*26,y:c.y+8,room:r,item:it.id,price:Math.round([35,60,100,170][it.r]*(1+.15*di)),name:it.name});}
   props.push({k:'pedestal',x:c.x,y:c.y+34,room:r,heal:true,price:Math.round(60*(1+.2*di)),name:'HP POTION'});break;}
  case 'shrine':props.push({k:'altar',x:c.x,y:c.y,room:r,col:'#c6f'});break;
  case 'rest':props.push({k:'spring',x:c.x,y:c.y,room:r});break;
  case 'trap':{const n=ri(20,30)+di*2;for(let k=0;k<n;k++){const tx=ri(r.x+1,r.x+r.w-2),ty=ri(r.y+1,r.y+r.h-2);if(map.t[ty*MW+tx]&&!traps.some(t=>t.tx===tx&&t.ty===ty))traps.push({tx,ty,ph:((tx+ty)%3)*1.07});}addE(ri(2,3));break;}
  default:addE(ri(4,6)+Math.floor(di/3)+(r.w*r.h>250?1:0));if(R.asc&&Math.random()<.12*R.asc){const s=spotIn(r);enemies.push(mkElite(pick(th.pool.filter(t=>t!=='wisp')),s.x,s.y,r,di));}
 }
}
function trapState(t){const c=(time+t.ph)%3.2;return c<2?0:c<2.6?1:2;}
function nearProp(){if(!P)return null;let best=null,bd=22;for(const p of props){if(p.used||p.sold||p.k==='merchant')continue;const d=dist(p,P);if(d<bd){bd=d;best=p;}}return best;}
function interact(){
 {const b=nearBag();if(b&&b.items.length){takeAll(b);return;}}
 if(portal&&!portal.pending&&dist(portal,P)<20){if(R.training){finishTraining();return;}if(R.di>=9)finishRun(true);else{loadDungeon(R.di+1);sfx('pickup');}return;}
 const p=nearProp();if(!p)return;
 if(p.k==='chest'){
  p.used=true;sfx('pickup');dropPickup(p.x,p.y+6,'item',0,randItem(['rez'],Math.random()<.5?1:0).id);
  for(let i=0;i<5;i++)dropPickup(p.x,p.y,'sen',Math.round(rnd(3,6)*(1+R.di*.3)*S.sen));
  if(Math.random()<.22){setToast('AMBUSH!','#f55',2);for(let i=0;i<3+Math.floor(R.di/3);i++){const a=i/4*TAU,x=p.x+Math.cos(a)*40,y=p.y+Math.sin(a)*40;if(blocked(x,y,6))continue;const e=mkEnemy(pick(DUN[R.di].pool),x,y,p.room,R.di);e.awake=true;enemies.push(e);spark(x,y,'#f55',8,60);}}
 }else if(p.k==='spring'){p.used=true;P.hp=Math.min(S.maxhp,P.hp+S.maxhp*.35);sfx('heal');setToast('THE SPRING RESTORES YOU','#6f6',2);fxRing(P.x,P.y,24,'#6f6',.4);}
 else if(p.k==='pedestal'){if(p.heal&&R.pots>=POTMAX){txtFx(P.x,P.y,'POTIONS FULL','#888');sfx('block');return;}if(R.sen<p.price){txtFx(P.x,P.y,'NOT ENOUGH GOLD','#c55');sfx('block');return;}R.sen-=p.price;p.sold=true;sfx('pickup');if(p.heal){R.pots++;setToast('BOUGHT AN HP POTION','#50e060',2);}else applyItem(p.item);}
 else if(p.k==='altar'){if(p.curse)takeCurse(p);else openShrine(p);}
 else if(p.k==='gong'){const r=p.room;if(r.ev&&r.ev.state===0){p.used=true;startChallenge(r);}}
}
const SHRINES={
 blood:{t:'BLOOD OFFERING',d:'LOSE 30% HP. GAIN A RARE ITEM',ok:()=>P.hp>S.maxhp*.35,fn:()=>{P.hp-=S.maxhp*.3;applyItem(randItem(['rez'],2).id);}},
 gamble:{t:'WAGER 40 GOLD',d:'RANDOM ITEM. 25% CHANCE OF NOTHING',ok:()=>R.sen>=40,fn:()=>{R.sen-=40;if(Math.random()<.25)setToast('THE SPIRITS TAKE YOUR GOLD','#c55',2);else applyItem(randItem(['rez']).id);}},
 curse:{t:'ACCEPT A CURSE',d:'DEAL +30% DAMAGE, TAKE +25%. STACKS',ok:()=>true,fn:()=>{R.curse=(R.curse||0)+1;S=calcStats();setToast('CURSED: POWER SURGES','#c6f',2.5);}},
 prayer:{t:'PRAY',d:'HEAL 30% HP',ok:()=>true,fn:()=>{P.hp=Math.min(S.maxhp,P.hp+S.maxhp*.3);setToast('YOUR PRAYER IS ANSWERED','#6f6',2);}},
 sacrifice:{t:'OFFER A REVIVE',d:'LOSE 1 REVIVE. GAIN A LEGENDARY',ok:()=>P.rez>0,fn:()=>{P.rez--;applyItem(randItem(['rez','phoenix'],3).id);}},
};
// ---- room events: cursed altar, sealed ambush, timed gong challenge ----
// what one curse does (each one stacks, and lasts the rest of the run)
const CURSE_INFO=[{s:'CURSE OF FRAILTY: YOU TAKE +25% DAMAGE',c:'#ff5050'},{s:'BLOOD PRICE: YOU DEAL +30% DAMAGE',c:'#ff8a30'},{s:'REWARD: YOUR NEXT KILL DROPS A RARE BAG',c:'#ffd040'},{s:'LASTS ALL RUN AND STACKS WITH OTHER CURSES',c:'#aaa'}];
function takeCurse(p){p.used=true;R.curse=(R.curse||0)+1;S=calcStats();sfx('boss');impact(p.x,p.y,'#c6f',5,true);
 setToast('CURSED X'+R.curse+': TAKE +'+25*R.curse+'% DAMAGE, DEAL +'+30*R.curse+'%. NEXT KILL DROPS A RARE BAG','#c6f',4);R.bonusBag=rewardBag();}
function roomSpawn(r,n){for(let i=0;i<n;i++){const s=spotIn(r);if(Math.hypot(s.x-P.x,s.y-P.y)<40)continue;const e=mkEnemy(pick(DUN[R.di].pool),s.x,s.y,r,R.di);e.awake=true;enemies.push(e);spark(s.x,s.y,'#f55',10,70);fxRing(s.x,s.y,12,'#f55',.3);}}
function startChallenge(r){r.ev.state=1;r.ev.t=30;sfx('boss');impact(P.x,P.y,'#fc4',5);setToast('CHALLENGE: CLEAR THE ROOM IN 30S','#fc4',2.5);roomSpawn(r,7+R.di);}
const inRoom=(r,x,y,m)=>x>(r.x+m)*T&&x<(r.x+r.w-m)*T&&y>(r.y+m)*T&&y<(r.y+r.h-m)*T;
function updRoomEvents(dt){
 for(const r of map.rooms){const ev=r.ev;if(!ev||ev.state>=2)continue;
  const alive=enemies.filter(e=>!e.dead&&e.room===r).length;
  if(ev.k==='ambush'){
   if(ev.state===0&&inRoom(r,P.x,P.y,2.5)){ev.state=1;ev.wave=0;sfx('boss');shake=Math.max(shake,6);setToast('AMBUSH! THE ROOM IS SEALED','#f55',2.5);roomSpawn(r,4+Math.floor(R.di/2));}
   else if(ev.state===1){P.x=clamp(P.x,r.x*T+6,(r.x+r.w)*T-6);P.y=clamp(P.y,r.y*T+6,(r.y+r.h)*T-6);
    if(alive===0){ev.wave++;if(ev.wave<2){setToast('WAVE '+(ev.wave+1)+'/2','#f55',1.5);roomSpawn(r,5+Math.floor(R.di/2));}else{ev.state=2;sfx('win');setToast('AMBUSH SURVIVED','#6f6',2);const c=R.lastKill||roomCenter(r);dropBag(c.x,c.y,goodBag());}}}}
  else if(ev.k==='challenge'&&ev.state===1){ev.t-=dt;
   if(alive===0){ev.state=2;sfx('win');setToast('CHALLENGE COMPLETE!','#fc4',2.5);{const c=R.lastKill||{x:P.x,y:P.y-10};dropBag(c.x,c.y,rewardBag());}R.sen+=20+R.di*5;}
   else if(ev.t<=0){ev.state=2;sfx('hurt');setToast('CHALLENGE FAILED','#f66',2);}}
 }
}
function drawRoomEvents(){
 for(const r of map.rooms){const ev=r.ev;if(!ev||ev.state!==1||ev.k!=='ambush')continue;const x0=r.x*T,y0=r.y*T,x1=(r.x+r.w)*T,y1=(r.y+r.h)*T,c=Math.floor(time*6)%2?'#f33':'#a11';
  const pts=[[x0,y0],[x1,y0],[x1,y1],[x0,y1],[x0,y0]];for(let i=0;i<4;i++){const a=pts[i],b=pts[i+1];sline(sx(a[0],a[1]),sy(a[0],a[1])-1,sx(b[0],b[1]),sy(b[0],b[1])-1,c);sline(sx(a[0],a[1]),sy(a[0],a[1])-6,sx(b[0],b[1]),sy(b[0],b[1])-6,c);}}
 const ch=map.rooms.find(r=>r.ev&&r.ev.k==='challenge'&&r.ev.state===1);if(ch){const t=Math.max(0,ch.ev.t);ctxt('CHALLENGE '+t.toFixed(1)+'S   FOES LEFT '+enemies.filter(e=>!e.dead&&e.room===ch).length,H-60,t<8&&Math.floor(time*4)%2?'#f66':'#fc4');}
}
function openShrine(p){const ks=Object.keys(SHRINES),sel=[];while(sel.length<3){const k=pick(ks);if(!sel.includes(k))sel.push(k);}evOpts=sel.map(k=>SHRINES[k]);evProp=p;mode='event';sfx('boss');}
function pickEvent(i){if(!evOpts)return;if(i>=3){mode='play';evOpts=null;return;}const o=evOpts[i];if(!o)return;if(!o.ok()){sfx('block');return;}o.fn();evProp.used=true;sfx('pickup');mode='play';evOpts=null;}
function renderEvent(){
 renderPlay();ctx.fillStyle='rgba(0,0,0,.78)';ctx.fillRect(0,0,W,H);
 ctxt('SPIRIT SHRINE',18,'#c6f',2);ctxt('MAKE AN OFFERING - PRESS 1 2 3, OR 4 / ESC TO LEAVE',38,'#aaa');
 evOpts.forEach((o,i)=>{const y=54+i*30,ok=o.ok();ctx.fillStyle=ok?'#1e1226':'#120a16';ctx.fillRect(24,y,272,24);ctx.fillStyle=ok?'#c6f':'#555';ctx.fillRect(24,y,2,24);txt((i+1)+'. '+o.t,32,y+5,ok?'#fff':'#777');txt(o.d,32,y+14,ok?'#c9c':'#666');});
 txt('4. LEAVE',32,150,'#aaa');
}

// ---------- world simulation: zones, hazards, delayed strikes, traps, buffs ----------
function updWorld(dt){
 const p=P;
 if(freezeT>0)freezeT-=dt;
 if(p.hot>0){p.hot-=dt;p.hp=Math.min(S.maxhp,p.hp+p.hotAmt*dt);}
 if(p.haste>0)p.haste-=dt;if(p.guardSt>0)p.guardSt-=dt;if(p.rage>0)p.rage-=dt;if(p.shieldT>0){p.shieldT-=dt;if(p.shieldT<=0)p.shieldHp=0;}
 if(p.storm>0){p.storm-=dt;p.stormT-=dt;if(p.stormT<=0){p.stormT=.12;p.stormA+=.42;const dm=S.atk*.65*(1+.25*S.epow)*AP();for(let i=0;i<6;i++){const a=p.stormA+i*TAU/6;projs.push(mkProj('p',p.x,p.y,a,190,dm,{r:3,pd:6,life:.7,col:'#ff8a30',pierce:1+(abFx('e').pierce||0),main:true,src:'e'}));}sfx('shoot');}}
 for(const z of zones){castSrc=z.src||null;z.t-=dt;z.tk-=dt;const tick=z.tk<=0;if(z.k&&CZ[z.k]){CZ[z.k](z,dt,tick);continue;}
  if(z.k==='grav'){ // pull non-bosses toward the centre, detonate on expiry
   if(tick)z.tk=.3;
   for(const e of enemies){if(e.dead||e.air)continue;const d=Math.hypot(e.x-z.x,e.y-z.y);if(d<z.r+e.r&&los(z.x,z.y,e.x,e.y)){e.zs=z.hole?.3:.5;const pull=e.boss?(z.hole?28:0):(z.hole?130:80);if(pull&&d>4){const a=Math.atan2(z.y-e.y,z.x-e.x);move(e,Math.cos(a)*pull*dt,Math.sin(a)*pull*dt,e.r);}if(tick)hurtE(e,z.dm*.06,z.hole?6:2,{nost:true});}}
   if(z.hole){for(const q of projs)if(q.from==='e'&&!q.peril&&Math.hypot(q.x-z.x,q.y-z.y)<z.r){const a=Math.atan2(z.y-q.y,z.x-q.x);q.vx+=Math.cos(a)*400*dt;q.vy+=Math.sin(a)*400*dt;if(Math.hypot(q.x-z.x,q.y-z.y)<10){q.dead=true;spark(z.x,z.y,'#c080ff',2,30);}}
    if(Math.random()<dt*20){const a=Math.random()*TAU;particles.push({x:z.x+Math.cos(a)*z.r,y:z.y+Math.sin(a)*z.r,vx:-Math.cos(a)*z.r*1.6,vy:-Math.sin(a)*z.r*1.6,t:.55,col:pick(['#c080ff','#fff','#529'])});}}
   if(z.t<=0&&z.hole){impact(z.x,z.y,'#c080ff',12,true);hitstop=Math.max(hitstop,.1);sfx('break');sfx('boss');}
   if(z.t<=0){shake=Math.max(shake,8);hitstop=Math.max(hitstop,.06);sfx('break');fxRing(z.x,z.y,z.r,'#a6f',.4);fxRing(z.x,z.y,z.r*.5,'#fff',.3);spark(z.x,z.y,'#a6f',30,140);for(const e of enemies){if(e.dead||e.air)continue;if(los(z.x,z.y,e.x,e.y)&&Math.hypot(e.x-z.x,e.y-z.y)<z.r+e.r)hurtE(e,z.dm,45,{slash:true,kb:Math.atan2(e.y-z.y,e.x-z.x)});}}
   continue;
  }
  if(z.k==='totem'){ // zap the nearest foe in range
   if(tick){z.tk=.45;let best=null,bd=z.r;for(const e of enemies){if(e.dead||e.air||!los(z.x,z.y,e.x,e.y))continue;const d=Math.hypot(e.x-z.x,e.y-z.y);if(d<bd){bd=d;best=e;}}
    if(best){fx.push({k:'bolt',pts:[{x:z.x,y:z.y-1},{x:best.x,y:best.y}],t:.15,dur:.15});hurtE(best,z.dm,10,{slash:true,el:'shock'});sfx('shoot');}}
   continue;
  }
  if(tick)z.tk=.35;for(const e of enemies){if(e.dead||e.air)continue;if(los(z.x,z.y,e.x,e.y)&&Math.hypot(e.x-z.x,e.y-z.y)<z.r+e.r){e.zs=e.boss?.6:.35;if(tick){hurtE(e,z.dm||S.atk*.3,3,{nost:true});if(Math.random()<.35)applyStatus(e,'chill');}}}}
 castSrc=null;zones=zones.filter(z=>z.t>0);
 if(freezeT<=0){for(const d of dh){d.t-=dt;if(d.t<=0){d.dead=true;fxRing(d.x,d.y,d.r,d.col||'#f55',.25);spark(d.x,d.y,d.col||'#f55',8,70);shake=Math.max(shake,2);if(Math.hypot(P.x-d.x,P.y-d.y)<d.r+3)hitPlayer(d.dmg,d.x,d.y,{peril:true});}}dh=dh.filter(d=>!d.dead);}
 for(const h of hz){h.t-=dt;if(Math.hypot(P.x-h.x,P.y-h.y)<h.r+3)hitPlayer(h.dps*.5,h.x,h.y,{peril:true});}
 hz=hz.filter(h=>h.t>0);
 {const lq=liqAt(P.x,P.y);if((lq===2||lq===3)&&P.dash<=0&&P.iv<=0){const r=hitPlayer(lq===2?7+R.di:4+R.di*.6,P.x,P.y,{peril:true});if(r!=='dodge'){txtFx(P.x,P.y,lq===2?'BURNING':'POISON',lq===2?'#f80':'#c6f');P.iv=.6;}}}
 if(traps.length){const ptx=P.x/T|0,pty=P.y/T|0;for(const t of traps)if(t.tx===ptx&&t.ty===pty&&trapState(t)===2){hitPlayer(10*(1+.15*R.di),P.x,P.y,{peril:true});break;}}
}
// ---------- enemy AI ----------
function steer(e,ang,sp,dt){sp*=(e.slow||1);const offs=[0,.7*e.sdir,-.7*e.sdir,1.4*e.sdir,-1.4*e.sdir];for(const o of offs){const a=ang+o,nx=Math.cos(a)*sp*dt,ny=Math.sin(a)*sp*dt;if(!blocked(e.x+nx,e.y+ny,e.r)){e.x+=nx;e.y+=ny;return true;}}e.sdir*=-1;return false;}
function startAct(e,a){e.act=Object.assign({},a,{t:0,ph:0,hit:0,ang:angTo(e,P),did:false,moved:0});}
function endAct(e){e.act=null;e.tele=0;e.cd=e.boss?rnd(e.t.cdMin||.6,e.t.cdMax||1.2):rnd(e.t.cdMin||.7,e.t.cdMax||1.5)*.5;}
function stepAct(e,dt){
 const a=e.act;a.t+=dt;
 switch(a.n){
  case 'slash':
   if(a.ph===0){e.tele=a.peril?2:1;if(a.t<a.w*.75)a.ang=angTo(e,P);if(a.t>=a.w){a.ph=1;a.t=0;a.hit++;e.tele=0;
     move(e,Math.cos(a.ang)*6,Math.sin(a.ang)*6,e.r);
     fx.push({k:'slash',x:e.x,y:e.y,a:a.ang,arc:a.arc*Math.PI/180,r:a.range,t:.15,dur:.15,col:a.peril?'#f44':'#fb8'});
     if(dist(e,P)<a.range+5&&Math.abs(angDiff(angTo(e,P),a.ang))<a.arc*Math.PI/360)hitPlayer(a.dmg*e.dm,e.x,e.y,{src:e,peril:a.peril,pd:a.pd});}}
   else if(a.ph===1){if(a.hit<a.hits){if(a.t>=(a.w2||.3)*.6){a.ph=0;a.t=0;a.w=a.w2||.3;}}else if(a.t>=a.rec)endAct(e);}
   break;
  case 'thrust':
   if(a.ph===0){e.tele=a.peril?2:1;if(a.t<a.w*.75)a.ang=angTo(e,P);if(a.t>=a.w){a.ph=1;a.t=0;e.tele=0;}}
   else if(a.ph===1){const mv=a.sp*dt*(e.slow||1),ox=e.x,oy=e.y;move(e,Math.cos(a.ang)*mv,Math.sin(a.ang)*mv,e.r);a.moved+=mv;
     if(!a.did&&dist(e,P)<e.r+6){a.did=true;hitPlayer(a.dmg*e.dm,e.x,e.y,{src:e,peril:a.peril,pd:a.pd});}
     if(a.moved>=a.dist||(Math.abs(e.x-ox)<.01&&Math.abs(e.y-oy)<.01)){a.ph=2;a.t=0;}}
   else if(a.t>=a.rec)endAct(e);
   break;
  case 'slam':
   if(a.ph===0){e.tele=a.peril?2:1;if(a.t>=a.w){a.ph=1;a.t=0;e.tele=0;fxRing(e.x,e.y,a.rad,a.peril?'#f44':'#fb8',.3);shake=Math.max(shake,4);spark(e.x,e.y,'#a98',10,80);
     if(dist(e,P)<a.rad)hitPlayer(a.dmg*e.dm,e.x,e.y,{src:e,peril:a.peril,pd:a.pd});
     if(a.rocks)for(let i=0;i<a.rocks;i++)projs.push(mkProj('e',e.x,e.y,i/a.rocks*TAU+rnd(0,.3),65,a.dmg*.45*e.dm,{own:e,col:'#a98',pd:10,r:3}));
     if(a.sd)killE(e);}}
   else if(a.t>=a.rec)endAct(e);
   break;
  case 'shoot':
   if(a.ph===0){e.tele=1;if(a.line&&a.t<a.w*.75)a.ang=angTo(e,P);if(a.t>=a.w){a.ph=1;a.t=0;a.rep=1;e.tele=0;enemyShoot(e,a,a.line?a.ang:angTo(e,P));}}
   else if(a.rep<a.reps){if(a.t>=a.gap){a.t=0;a.rep++;enemyShoot(e,a,angTo(e,P));}}
   else if(a.t>=a.rec)endAct(e);
   break;
  case 'charge':
   if(a.ph===0){e.tele=a.peril?2:1;if(a.t<a.w*.8)a.ang=angTo(e,P);if(a.t>=a.w){a.ph=1;a.t=0;e.tele=0;}}
   else if(a.ph===1){const mv=a.sp*dt*(e.slow||1),ox=e.x,oy=e.y;move(e,Math.cos(a.ang)*mv,Math.sin(a.ang)*mv,e.r);
     if(a.trail){a.tr=(a.tr||0)+mv;if(a.tr>=12){a.tr=0;hz.push({x:e.x,y:e.y,r:9,t:3.5,dps:12*e.dm,col:a.trail});}}
     if(!a.did&&dist(e,P)<e.r+7){a.did=true;hitPlayer(a.dmg*e.dm,e.x,e.y,{src:e,peril:a.peril,pd:a.pd});}
     const stuck=Math.abs(e.x-ox)<.01&&Math.abs(e.y-oy)<.01;
     if(a.t>=a.dur||stuck){if(stuck){e.posture+=20;shake=Math.max(shake,4);spark(e.x,e.y,'#aaa',8,60);}a.ph=2;a.t=0;}}
   else if(a.t>=a.rec)endAct(e);
   break;
  case 'leap':
   if(a.ph===0){e.tele=1;if(a.t<a.w*.6){a.tx=P.x;a.ty=P.y;}if(a.t>=a.w){a.ph=1;a.t=0;a.sx=e.x;a.sy=e.y;e.air=true;e.tele=0;if(a.tx===undefined){a.tx=P.x;a.ty=P.y;}}}
   else if(a.ph===1){const k=Math.min(1,a.t/a.air),nx=a.sx+(a.tx-a.sx)*k,ny=a.sy+(a.ty-a.sy)*k;if(!blocked(nx,ny,e.r)){e.x=nx;e.y=ny;}e.z=Math.sin(k*Math.PI)*26;
     if(k>=1){e.air=false;e.z=0;fxRing(e.x,e.y,a.rad,a.peril?'#f44':'#fb8',.3);shake=Math.max(shake,6);spark(e.x,e.y,'#a98',12,90);if(dist(e,P)<a.rad)hitPlayer(a.dmg*e.dm,e.x,e.y,{src:e,peril:a.peril,pd:a.pd||0});a.ph=2;a.t=0;}}
   else if(a.t>=a.rec)endAct(e);
   break;
  case 'summon':
   if(a.ph===0){e.tele=1;if(a.t>=a.w){a.ph=1;a.t=0;e.tele=0;const alive=enemies.filter(o=>!o.dead&&!o.boss).length;if(alive<8){for(let i=0;i<a.cnt;i++){const ty=a.types[i%a.types.length],an=i/a.cnt*TAU,x=e.x+Math.cos(an)*26,y=e.y+Math.sin(an)*26;if(blocked(x,y,5))continue;const m=mkEnemy(ty,x,y,e.room,R.di);m.awake=true;enemies.push(m);spark(x,y,'#c8f',8,60);}}sfx('boss');}}
   else if(a.t>=a.rec)endAct(e);
   break;
  case 'storm': // delayed ground strikes around the player
   if(a.ph===0){e.tele=1;if(a.t>=a.w){a.ph=1;a.t=0;e.tele=0;for(let i=0;i<a.cnt;i++){const an=Math.random()*TAU,r=i===0?0:rnd(15,a.spread),dl=a.delay+i*.08;dh.push({x:P.x+Math.cos(an)*r,y:P.y+Math.sin(an)*r,r:a.rad,t:dl,dur:dl,dmg:a.dmg*e.dm,col:a.col});}sfx('tool');}}
   else if(a.t>=a.rec)endAct(e);
   break;
  case 'blink': // teleport behind the player, short pause, then slash
   if(a.ph===0){e.tele=1;if(a.t>=a.w){e.tele=0;const an=angTo(P,e)+Math.PI+rnd(-.6,.6),nx=P.x+Math.cos(an)*16,ny=P.y+Math.sin(an)*16;if(!blocked(nx,ny,e.r)){spark(e.x,e.y,'#c8f',8,60);e.x=nx;e.y=ny;spark(nx,ny,'#c8f',8,60);}a.ang=angTo(e,P);a.ph=1;a.t=0;}}
   else if(a.ph===1){if(a.t>=.2){a.ph=2;a.t=0;fx.push({k:'slash',x:e.x,y:e.y,a:a.ang,arc:a.arc*Math.PI/180,r:a.range,t:.15,dur:.15,col:'#c8f'});if(dist(e,P)<a.range+5)hitPlayer(a.dmg*e.dm,e.x,e.y,{src:e,pd:a.pd});}}
   else if(a.t>=a.rec)endAct(e);
   break;
 }
}
function pickAtk(e,d){const list=e.boss?e.kit:e.t.atks;const ok=list.filter(k=>d>=(k.dmin||0)&&d<=(k.dmax||999));return wpick(ok.length?ok:list);}
function updEnemy(e,dt){
 e.flash=Math.max(0,e.flash-dt);e.iv=Math.max(0,e.iv-dt);if(e.kick)e.kick.t-=dt;if(e.blind>0)e.blind-=dt;e.rcd=Math.max(0,(e.rcd||0)-dt);
 if(e.st){const st=e.st;let dps=0;
  if(st.burn>0){st.burn-=dt;dps+=st.bdps*(st.poison>0?1.5:1);if(Math.random()<dt*12)particles.push({x:e.x+rnd(-3,3),y:e.y+rnd(-3,3),vx:0,vy:-25,t:.3,col:'#f80'});}else st.bdps=0;
  if(st.poison>0){st.poison-=dt;dps+=st.pdps*(st.burn>0?1.5:1);if(Math.random()<dt*8)particles.push({x:e.x+rnd(-3,3),y:e.y+rnd(-3,3),vx:0,vy:-15,t:.4,col:'#8c4'});}else st.pdps=0;
  if(st.shock>0){st.shock-=dt;if(Math.random()<dt*6)particles.push({x:e.x+rnd(-4,4),y:e.y+rnd(-4,4),vx:rnd(-30,30),vy:rnd(-30,30),t:.15,col:'#ff4'});}
  if(st.chillT>0){st.chillT-=dt;if(st.chillT<=0)st.chillS=0;}
  if(dps>0){e.hp-=dps*dt;if(e.hp<=0){killE(e);return;}}
  if(st.frozen>0){st.frozen-=dt;return;}
 }
 e.slow=Math.min(e.zs||1,(e.st&&e.st.chillT>0)?.85-.15*e.st.chillS:1);e.zs=1;{const lq=liqAt(e.x,e.y);if(lq===1||lq===5)e.slow*=.78;}
 if(e.kx||e.ky){move(e,e.kx*dt,e.ky*dt,e.r);const f=Math.exp(-9*dt);e.kx*=f;e.ky*=f;if(Math.abs(e.kx)<2)e.kx=0;if(Math.abs(e.ky)<2)e.ky=0;}
 if(e.stag>0){e.stag-=dt;if(e.stag<=0){e.posture=0;}return;}
 if(e.stun>0){e.stun-=dt;return;}
 e.pdelay-=dt;if(e.pdelay<=0)e.posture=Math.max(0,e.posture-e.maxPosture*.22*dt);
 const d=dist(e,P);
 if(!e.awake){if(e.boss){const r=e.room;if(P.x>r.x*T&&P.x<(r.x+r.w)*T&&P.y>r.y*T&&P.y<(r.y+r.h)*T){e.awake=true;sfx('boss');introT=INTRO;introE=e;}}else if(d<110)wake(e);if(!e.awake)return;}
 if(e.boss){
  // leave the arena for 1.5s and the boss disengages: it returns to its post fully healed and the fight starts over
  {const r=e.room,m=8,inR=P.x>r.x*T-m&&P.x<(r.x+r.w)*T+m&&P.y>r.y*T-m&&P.y<(r.y+r.h)*T+m;
   if(!inR&&!e.dying){e.outT=(e.outT||0)+dt;if(e.outT>1.5){bossReset(e);return;}}else e.outT=0;}
  const f=e.hp/e.maxhp;
  // three phases for every boss (2 at 60% HP, 3 at 30%), each named and with its own barrage set
  const BT=bsty(e).t,bc=bsty(e).c;
  if(e.phase===1&&f<.6){e.phase=2;e.kit=e.b.k2;e.act=null;e.tele=0;e.iv=.9;e.posture=0;txtFx(e.x,e.y,BT[1],bc,2);fxRing(e.x,e.y,70,bc,.5);shake=8;sfx('boss');}
  else if(e.phase===2&&f<.3){e.phase=3;e.kit=e.b.k3||e.b.k2;e.act=null;e.tele=0;e.iv=.9;e.posture=0;txtFx(e.x,e.y,BT[2],bc,2);fxRing(e.x,e.y,80,bc,.5);shake=10;sfx('boss');}
  // each new phase: a shielded storm of the boss's own patterns, then faster attacks
  if(e.phase!==e.lastPh){if(e.lastPh){e.storm=3.2;e.iv=3.2;e.stT=0;e.t=Object.assign({},e.t,e.phase===2?{cdMin:.45,cdMax:.95}:{cdMin:.32,cdMax:.7});setToast('PHASE '+e.phase+': '+BT[e.phase-1],bc,2.5);}e.lastPh=e.phase;}
  if(e.storm>0){e.storm-=dt;e.stT-=dt;e.act=null;e.tele=0;e.kx=e.ky=0;tickBarrage(e,dt);
   if(e.stT<=0){e.stT=.5;const L=bsty(e).ph[Math.min(2,e.phase-1)];bossBarrage(e,L[(e.stN=(e.stN||0)+1)%L.length]);}
   if(Math.random()<dt*20)spark(e.x,e.y,bc,2,40);return;}
  // enrage after two and a half minutes
  e.fightT=(e.fightT||0)+dt;if(e.fightT>150&&!e.enraged){e.enraged=true;e.dm*=1.3;e.t=Object.assign({},e.t,{cdMin:e.t.cdMin*.7,cdMax:e.t.cdMax*.7});setToast(e.name+' IS ENRAGED','#f33',3);}
 }
 e.cd-=dt;
 if(e.shield)e.fa=angTo(e,P);
 if(e.elite==='regen')e.hp=Math.min(e.maxhp,e.hp+e.maxhp*.025*dt);
 if(e.elite==='summoner'){e.sumT-=dt;if(e.sumT<=0&&!e.act){e.sumT=6;if(enemies.filter(o=>!o.dead).length<40)for(let i=0;i<2;i++){const an=rnd(0,TAU),x=e.x+Math.cos(an)*22,y=e.y+Math.sin(an)*22;if(blocked(x,y,4))continue;const m=mkEnemy('wisp',x,y,e.room,R.di);m.awake=true;enemies.push(m);spark(x,y,'#c8f',8,60);}}}
 if(e.act){stepAct(e,dt);return;}
 const a=angTo(e,P),t=e.t;
 if(t.ai==='dummy'){e.kx=e.ky=0;return;}
 if(t.ai==='turret'){e.kx=e.ky=0;e.tt=(e.tt==null?1:e.tt)-dt;if(e.tt<=0&&e.tPat){e.tt=e.tRate||1;enemyShoot(e,Object.assign({},e.tPat),a);}return;}
 if(e.boss){
  if(bossModes(e,dt,d,a))return;
  if(e.cd<=0){startAct(e,pickAtk(e,d));return;}
  const pref=Math.max(e.pref,bossGap(e));
  if(d>pref)steer(e,a,e.spd,dt);else if(d<pref*.75)steer(e,a+Math.PI,e.spd*.7,dt);else steer(e,a+Math.PI/2*e.sdir,e.spd*.6,dt);
  return;
 }
 if(t.volley&&!e.boss){e.vcd=(e.vcd==null?rnd(.2,1):e.vcd)-dt;if(e.cd<=0&&e.vcd<=0&&d>t.rng*.5&&d<175){e.vcd=rnd(.75,1.4);startAct(e,t.volley);return;}}
 if(!e.boss&&!t.volley&&t.ai!=='bomber'){e.pcd=(e.pcd==null?rnd(.3,1.2):e.pcd)-dt;if(e.pcd<=0&&d<170){e.pcd=rnd(1.6,2.6);const k=(e.pk=(e.pk||0)+1)%3;enemyShoot(e,k===0?{pat:'gapring',cnt:12+e.di,gw:.5,sp:55,dmg:8,pd:6,col:'#f9a'}:k===1?{cnt:3,spread:.3,sp:90,dmg:8,pd:6,col:'#fc8'}:{pat:'spiral',arms:3,spin:.5,sp:60,dmg:8,pd:6,col:'#c9f'},a);}}
 if(t.ai==='melee'){if(e.cd<=0&&d<=t.rng){startAct(e,pickAtk(e,d));return;}if(d>t.rng*.7)steer(e,a,e.spd,dt);else steer(e,a+Math.PI/2*e.sdir,e.spd*.5,dt);}
 else if(t.ai==='ranged'){if(e.cd<=0&&d<t.rng){startAct(e,pickAtk(e,d));return;}if(d<t.keep-15)steer(e,a+Math.PI,e.spd,dt);else if(d>t.keep+25)steer(e,a,e.spd,dt);else steer(e,a+Math.PI/2*e.sdir,e.spd*.6,dt);}
 else if(t.ai==='bomber'){if(e.cd<=0&&d<=t.rng){startAct(e,pickAtk(e,d));return;}steer(e,a+Math.sin(time*7+e.wob)*.4,e.spd,dt);}
 else{if(e.cd<=0&&d<t.rng){startAct(e,pickAtk(e,d));return;}steer(e,a+Math.sin(time*5+e.wob)*.6,e.spd,dt);}
}

// ---------- update ----------
function updPlayer(dt){
 const p=P;{const d=screenToWorldDelta(mouse.x,mouse.y);p.aim=Math.atan2(d.y,d.x);p.face=mouse.x<W/2?-1:1;}
 for(const k of ['atkCd','dashCd','iv','flash','mik','ward','hurtIv','lockT'])p[k]=Math.max(0,(p[k]||0)-dt);
 for(const k of ['q','rmb','e','h','f'])p.ab[k]=Math.max(0,p.ab[k]-dt);
 p.pdelay-=dt;if(p.pdelay<=0)p.pos=Math.max(0,p.pos-S.maxpos*.25*dt);
 if(p.stag>0){p.stag-=dt;if(p.stag<=0)p.pos=Math.min(p.pos,S.maxpos*.3);}
 if(p.animT>0)p.animT-=dt;
 const lq=liqAt(p.x,p.y);
 const shf=!!(keys.ShiftLeft||keys.ShiftRight),cmb=inCombat();if(p.combatT>0)p.combatT-=dt;p.focus=shf&&cmb;if(cmb&&p.oocRun){p.oocRun=false;}const [mx,my]=moveVec();p.sprintK=clamp((p.sprintK||0)+(p.oocRun?dt*4:-dt*8),0,1);if(p.sprintK>.5&&(mx||my)&&Math.random()<dt*14)particles.push({x:p.x-(mx||0)*4+rnd(-2,2),y:p.y-(my||0)*4+rnd(-2,2),vx:-(mx||0)*20,vy:-(my||0)*20,t:.35,col:'#9a9488'});const spd=S.spd*(p.focus?.45:1)*(1+.75*p.sprintK)*(p.haste>0?1.3:1)*(lq===1||lq===5?.72:lq===3?.85:1);p.mv=!!(mx||my);p.mvx=mx;p.mvy=my;
 if(p.mv&&(lq===1||lq===5)&&Math.random()<dt*8)particles.push({x:p.x+rnd(-3,3),y:p.y+rnd(-3,3),vx:0,vy:0,t:.3,col:map.env.lc[2]});
 if(p.dash>0){p.dash-=dt;move(p,p.dx*185*dt,p.dy*185*dt,4);}
 else if(p.stag<=0){move(p,mx*spd*dt,my*spd*dt,4);if(mouse.down&&p.atkCd<=0&&!hoverSlot())castBolt();if(mouse.rdown&&p.ab.h<=0&&(p.hCh>0||!(p.lockT>0))){p.hCh=(p.hCh||0)+dt;}else if(!mouse.rdown&&p.hCh>0){p.hFull=p.hCh>=HCHARGE;castHeavy();p.hCh=0;p.hFull=false;}}
}
function updPickups(dt){
 for(const k of pickups){
  k.t+=dt;if(k.vx||k.vy){const nx=k.x+k.vx*dt,ny=k.y+k.vy*dt;if(!solid(nx,ny)){k.x=nx;k.y=ny;}const f=Math.exp(-6*dt);k.vx*=f;k.vy*=f;if(Math.abs(k.vx)<1)k.vx=0;if(Math.abs(k.vy)<1)k.vy=0;}
  const d=dist(k,P),mag=(k.k!=='item'&&k.k!=='bag');
  if(k.k==='bag'){if(k.vz!==undefined&&(k.vz||k.z>0)){k.vz-=420*dt;k.z+=k.vz*dt;if(k.z<=0){k.z=0;if(k.vz<-60){k.vz=-k.vz*.35;if(!k.landed){k.landed=true;bagLand(k);}}else k.vz=0;}}
   if(k.pop>0)k.pop-=dt;if(k.z>0)continue;
   if(d<12&&k.t>.3&&!k.seen){k.seen=true;lootBag(k);}else if(d>16)k.seen=false;continue;}
  if(mag&&k.t>.35&&d<S.magnet){const a=angTo(k,P),s=140;k.x+=Math.cos(a)*s*dt;k.y+=Math.sin(a)*s*dt;}
  if(d<9&&k.t>.2){
   if(k.k==='sen'){R.sen+=k.v;sfx('coin');}
   else if(k.k==='heart'){P.hp=Math.min(S.maxhp,P.hp+k.v);txtFx(P.x,P.y,'+'+k.v,'#6f6');sfx('pickup');}
   else if(k.k==='pot'){if(R.pots<POTMAX){R.pots++;txtFx(P.x,P.y,'+HP POTION','#50e060');}else{P.hp=Math.min(S.maxhp,P.hp+S.maxhp*.15);txtFx(P.x,P.y,'+HP','#50e060');}sfx('pickup');}
   else if(k.k==='gourd'){R.pots=Math.min(POTMAX,R.pots+1);sfx('pickup');}
   else if(k.k==='item'){applyItem(k.id);sfx('pickup');}
   k.dead=true;
  }
 }
 pickups=pickups.filter(k=>!k.dead);
}
// near miss: brushing past an enemy shot shaves ability cooldowns and pays a little sen
// dashing just as a shot is about to hit: slow-motion, dash refund, nearby shots shatter, next attack empowered
// out of combat = nothing awake nearby, no enemy shots close, no recent hits or casts, no room event running
const DASHROW=3; // dashes in a row needed to trigger the out-of-combat speed boost
function frontierNear(){const px=P.x/T|0,py=P.y/T|0;for(let j=-12;j<=12;j++)for(let i=-12;i<=12;i++){const x=px+i,y=py+j;if(x<0||y<0||x>=MW||y>=MH||i*i+j*j>144)continue;const k=y*MW+x;if(map.t[k]&&!map.expl[k])return true;}return false;}
function inCombat(){if(!P)return false;if(P.combatT>0)return true;if(boss&&boss.awake&&!boss.dead)return true;
 for(const e of enemies)if(!e.dead&&e.awake&&Math.abs(e.x-P.x)+Math.abs(e.y-P.y)<260)return true;
 for(const q of projs)if(q.from==='e'&&Math.abs(q.x-P.x)+Math.abs(q.y-P.y)<200)return true;
 return map.rooms.some(r=>r.ev&&r.ev.state===1);}
function perfectDodge(){let hit=false;for(const q of projs){if(q.from!=='e'||q.dead)continue;const dx=P.x-q.x,dy=P.y-q.y,d=Math.hypot(dx,dy);if(d<q.r+16&&(q.vx*dx+q.vy*dy>0||d<q.r+7)){hit=true;break;}}
 if(!hit)return;trainEv('dodge');P.dashCd=0;P.iv=Math.max(P.iv,.45);P.mik=1.5;R.pdodge=(R.pdodge||0)+1;
 for(const q of projs)if(q.from==='e'&&!q.peril&&Math.hypot(q.x-P.x,q.y-P.y)<30){q.dead=true;spark(q.x,q.y,'#cef',3,40);}
 for(const k of ['q','f','rmb'])if(P.ab[k]>0)P.ab[k]=Math.max(0,P.ab[k]-.6);
 txtFx(P.x,P.y,'PERFECT DODGE','#cef');fxRing(P.x,P.y,30,'#cef',.35);flashT=Math.max(flashT,.08);flashCol='#cef';sfx('deflect');}
function graze(q){R.grazes=(R.grazes||0)+1;for(const k of ['q','f','e','rmb'])if(P.ab[k]>0)P.ab[k]=Math.max(0,P.ab[k]-.15);if(R.grazes%5===0)R.sen+=1;
 particles.push({x:(q.x+P.x)/2,y:(q.y+P.y)/2,vx:0,vy:-20,t:.3,col:'#fff'});if(grazeCd<=0){grazeCd=.08;sfx('graze');}if(R.grazes%25===0)txtFx(P.x,P.y,'GRAZE X'+R.grazes,'#cef');}
function splitShot(q){for(let i=0;i<6;i++){const a=i/6*TAU+Math.random()*.5;projs.push(mkProj('e',q.x,q.y,a,62,q.dmg*.6,{own:q.own,col:q.col,r:2,pd:6,st:'star'}));}spark(q.x,q.y,q.col,6,50);}
function stepStyle(q,dt){
 switch(q.st){
  case 'wave':{q.wt+=dt;const sp=Math.hypot(q.vx,q.vy)||1,ux=q.vx/sp,uy=q.vy/sp,w=Math.cos(q.wt*q.wf)*q.wa*dt*q.wf*.25;q.x+=-uy*w;q.y+=ux*w;break;}
  case 'accel':{const sp=Math.hypot(q.vx,q.vy);if(sp<q.cap){const k=1+q.acc*dt;q.vx*=k;q.vy*=k;}break;}
  case 'curve':{const c=Math.cos(q.curve*dt),s=Math.sin(q.curve*dt),vx=q.vx*c-q.vy*s;q.vy=q.vx*s+q.vy*c;q.vx=vx;break;}
  case 'boom':{q.bt+=dt;const f=Math.cos(Math.PI*Math.min(1,q.bt/q.bT));q.vx=Math.cos(q.bd)*q.bs*f;q.vy=Math.sin(q.bd)*q.bs*f;break;}
  case 'split':{q.splitT-=dt;if(q.splitT<=0){splitShot(q);q.dead=true;}break;}
  case 'mine':{q.fuse-=dt;if(q.fuse<=0){for(let i=0;i<8;i++)projs.push(mkProj('e',q.x,q.y,i/8*TAU+.2,58,q.dmg,{own:q.own,col:q.col,r:3,pd:8}));spark(q.x,q.y,q.col,10,70);q.dead=true;}break;}
 }}
function updProjs(dt){
 for(const q of projs){
  if(q.from==='e'&&freezeT>0)continue;
  if(q.cut){for(const o of projs)if(o.from==='e'&&!o.peril&&!o.dead&&Math.hypot(o.x-q.x,o.y-q.y)<q.r+o.r+3){o.dead=true;spark(o.x,o.y,q.col,3,40);}}
  if(q.rare&&Math.random()<dt*40)particles.push({x:q.x,y:q.y,vx:rnd(-10,10),vy:rnd(-10,10),t:.25,col:q.col});
  if(q.home){let tg=null,bd=q.rare?150:110;for(const e of enemies){if(e.dead||e.air)continue;const d=dist(e,q);if(d<bd){bd=d;tg=e;}}if(tg){const cur=Math.atan2(q.vy,q.vx),df=clamp(angDiff(angTo(q,tg),cur),-5*dt,5*dt),sp=Math.hypot(q.vx,q.vy);q.vx=Math.cos(cur+df)*sp;q.vy=Math.sin(cur+df)*sp;}}
  if(q.st)stepStyle(q,dt);if(q.dead)continue;
  q.x+=q.vx*dt;q.y+=q.vy*dt;q.life-=dt;
  if(q.life<=0){if(q.st==='split')splitShot(q);q.dead=true;continue;}
  if(solid(q.x,q.y)){q.dead=true;spark(q.x,q.y,q.col,3,30);continue;}
  if(q.from==='e'){
   // bullets test against a small round core measured on SCREEN, exactly where the core dot is drawn,
   // so hats, staffs and bows never count and what you see is what hits you
   const sd=scrDist(q),hr=P.focus?HITR_FOCUS:HITR;
   if(!q.grazed&&sd<q.r+(P.focus?12:10)&&sd>=q.r+hr&&P.iv<=0&&P.dash<=0){q.grazed=true;graze(q);}
   if(sd<q.r+hr){const res=hitPlayer(q.dmg*ESHOT_DMG,q.x,q.y,{src:q.own,pd:q.pd,peril:q.peril,bullet:true});
    if(res==='perfect'&&(P.wardRef=(P.wardRef||0)+1)>6){q.dead=true;}else if(res==='perfect'){q.from='p';const o=q.own;const a=o&&!o.dead?angTo(q,o):Math.atan2(-q.vy,-q.vx);const sp=Math.hypot(q.vx,q.vy)*1.5;q.vx=Math.cos(a)*sp;q.vy=Math.sin(a)*sp;q.dmg=q.dmg*.6+S.atk*.8;q.pd=30;q.pierce=0;q.hit=new Set();q.life=2;q.col='#fff';}
    else if(res!=='dodge')q.dead=true;}
  }else{
   for(const e of enemies){if(e.dead||e.air||q.hit.has(e))continue;if(dist(q,e)<q.r+e.r){q.hit.add(e);let dm=q.dmg,pd=q.pd;if(e.shield&&e.stag<=0&&Math.abs(angDiff(angTo(e,q),e.fa||0))<1.1){dm*=.15;pd*=1.5;spark(q.x,q.y,'#aaf',4,50);}hurtE(e,dm,pd,{slash:!!q.main,kb:Math.atan2(q.vy,q.vx),el:q.el,src:q.src||null});if(--q.pierce<0){q.dead=true;break;}}}
  }
 }
 projs=projs.filter(q=>!q.dead);
}
function updPlay(dt){
 R.time+=dt;if(R.training)updTraining(dt);if(P.evoT>0)P.evoT-=dt;updPlayer(dt);updWorld(dt);updRoomEvents(dt);updAmbient(dt);
 if(freezeT<=0)for(const e of enemies){if(e.dead)continue;if(!e.boss&&dist(e,P)>300)continue;updEnemy(e,dt);}
 for(let i=0;i<enemies.length;i++){const a=enemies[i];if(a.dead||!a.awake||a.air)continue;for(let j=i+1;j<enemies.length;j++){const b=enemies[j];if(b.dead||!b.awake||b.air)continue;const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy),m=a.r+b.r;if(d>0&&d<m){const push=(m-d)*.5;if(!a.act){move(a,-dx/d*push,-dy/d*push,a.r);}if(!b.act){move(b,dx/d*push,dy/d*push,b.r);}}}}
 enemies=enemies.filter(e=>!e.dead);
 updProjs(dt);updPickups(dt);
 if(flashT>0)flashT-=dt;if(P.aegis>0)P.aegis-=dt;
 for(const f of fx){if(f.wait>0){f.wait-=dt;continue;}f.t-=dt;castSrc=f.src||null;if(f.k==='ult'&&f.t<=0&&!f.done){f.done=true;ultBlast(f);}if(f.k==='strike'&&!f.done){f.done=true;smite(f);}}castSrc=null;fx=fx.filter(f=>f.t>0||f.wait>0);
 for(const q of particles){q.t-=dt;q.x+=q.vx*dt;q.y+=q.vy*dt;const f=Math.exp(-5*dt);q.vx*=f;q.vy*=f;}particles=particles.filter(q=>q.t>0);
 for(const t of texts)t.t-=dt;texts=texts.filter(t=>t.t>0);
 toast.t-=dt;
 if(portal)portal.t+=dt;
 // revealing new floor counts as exploring: the out-of-combat speed boost only works on ground you've already seen
 {const px=P.x/T|0,py=P.y/T|0;let nw=0;for(let j=-11;j<=11;j++)for(let i=-11;i<=11;i++){const x=px+i,y=py+j;if(x>=0&&y>=0&&x<MW&&y<MH&&i*i+j*j<=121){const k=y*MW+x;if(!map.expl[k]){map.expl[k]=1;if(map.t[k])nw++;}}}if(nw>0&&P.oocRun&&R.time>.5){P.oocRun=false;txtFx(P.x,P.y,'EXPLORING','#aaa');}}
 shake=Math.max(0,shake-dt*20);
 if(hurtT>0)hurtT-=dt;if(P.hp<S.maxhp*.25&&P.hp>0){beatT-=dt;if(beatT<=0){beatT=.85;sfx('beat');lowPulse=.3;}}if(lowPulse>0)lowPulse-=dt;
 if(grazeCd>0)grazeCd-=dt;
}
let slowT=0,hurtT=0,beatT=0,lowPulse=0,introT=0,introE=null,grazeCd=0;const INTRO=2.6;
function update(dt){
 time+=dt;musicTick();
 if(mode==='play'){if(paused||invOpen)return;if(introT>0){introT-=dt;return;}if(slowT>0){slowT-=dt;dt*=.35;}if(hitstop>0){hitstop-=dt;return;}updPlay(dt);}
 else if(mode==='choose'){for(const t of texts){t.t-=dt;}}
}

// ---------- rendering ----------
function drawSpr(s,x,feetY,white,frame,flip){
 const fw=s.fw,fh=s.fh,sc=s.sc,src=white?s.wc:s.c,fr=s.frames>1?(frame%s.frames):0;
 const dx=Math.round(x-fw*sc/2),dy=Math.round(feetY-fh*sc);
 if(flip){ctx.save();ctx.translate(dx+fw*sc,dy);ctx.scale(-1,1);ctx.drawImage(src,fr*fw,0,fw,fh,0,0,fw*sc,fh*sc);ctx.restore();}
 else ctx.drawImage(src,fr*fw,0,fw,fh,dx,dy,fw*sc,fh*sc);
}
// ---------- isometric projection ----------
// Simulation runs in flat world coords (x,y). Drawing projects: iso.x = x-y, iso.y = (x+y)/2  (2:1 diamond tiles 32x16)
function wdisc(x,y,r,col){const cx=sx(x,y),cy=sy(x,y),rx=Math.max(1,Math.round(r*1.414)),ry=Math.max(1,Math.round(r*.707));ctx.fillStyle=col;for(let j=-ry;j<=ry;j++){const w=Math.floor(rx*Math.sqrt(Math.max(0,1-(j*j)/(ry*ry))));ctx.fillRect(cx-w,cy+j,w*2+1,1);}}
function wcirc(x,y,r,col){ctx.fillStyle=col;const n=Math.max(16,Math.floor(r*3));for(let i=0;i<n;i++){const a=i/n*TAU,wx=x+Math.cos(a)*r,wy=y+Math.sin(a)*r;ctx.fillRect(sx(wx,wy),sy(wx,wy),1,1);}}
function wline(x0,y0,a,r0,r1,col,lift){ctx.fillStyle=col;const l=lift||0;for(let r=r0;r<=r1;r+=.5){const x=x0+Math.cos(a)*r,y=y0+Math.sin(a)*r;ctx.fillRect(sx(x,y),sy(x,y)-l,1,1);}}
function sline(x0,y0,x1,y1,col){ctx.fillStyle=col;const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0))|0;for(let i=0;i<=n;i++){const t=n?i/n:0;ctx.fillRect(Math.round(x0+(x1-x0)*t),Math.round(y0+(y1-y0)*t),1,1);}}
function tdiamond(tx,ty,col){const X=sx(tx*T,ty*T),Y=sy(tx*T,ty*T);ctx.fillStyle=col;for(let j=0;j<TILEH;j++){const half=dHalf(j);ctx.fillRect(X-half,Y+j,half*2,1);}}
function shadow(x,y,w){ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(Math.round(x-w/2),Math.round(y),w,2);}
function sprOf(e){const key=e.boss?'boss'+e.di:e.type;const o=OV[key];return (o&&o.ok)?o:(e.boss?e.spr:getSpr(e.type,e.di));}
function drawEnemy(e){
 // recoil: the sprite jerks back along the hit direction for a moment
 let kx=0,ky=0;if(e.kick&&e.kick.t>0){const k=e.kick.t/.12,v=scrVec(Math.cos(e.kick.a),Math.sin(e.kick.a));kx=Math.round(v[0]*e.kick.p*k);ky=Math.round(v[1]*e.kick.p*k);}
 const s=sprOf(e),X=sx(e.x,e.y)+kx,Y=sy(e.x,e.y)+ky+Math.min(6,Math.round(e.r*.6))+2,H0=s.fh*s.sc;let frame=Math.floor(time*4+e.wob);
 shadow(X,Y-2,Math.round(e.r*2+6));
 if(e.elite){ctx.globalAlpha=.7;wcirc(e.x,e.y,e.r+3+Math.sin(time*6),ELMOD[e.elite].c);ctx.globalAlpha=1;}
 const blink=e.tele>0&&Math.floor(time*16)%2===0;
 const flip=(!!s.animal||!!s.bossSpr)&&sx(P.x,P.y)<X;if(s.bossSpr)frame=e.act||e.storm>0?2:Math.floor(time*2.5)%2;const fy=e.t&&e.t.fly?Math.round(6+Math.sin(time*5+e.wob)*2):0;drawSpr(s,X,Y-e.z-fy,e.flash>0||blink,frame,flip);
 if(e.mode&&e.mode.k==='dashes'&&e.mode.ph===0&&e.mode.da!=null){ctx.fillStyle=Math.floor(time*16)%2?'rgba(255,60,60,.9)':'rgba(255,200,80,.9)';for(let r=8;r<115;r+=3){const x=e.x+Math.cos(e.mode.da)*r,y=e.y+Math.sin(e.mode.da)*r;ctx.fillRect(sx(x,y)-1,sy(x,y),3,1);}}
 if(e.mode&&e.mode.k==='chase'){ctx.globalAlpha=.4+.2*Math.sin(time*12);wcirc(e.x,e.y,e.r+6,'#f33');ctx.globalAlpha=1;}
 if(e.st&&e.st.frozen>0){ctx.globalAlpha=.55;drawSpr(s,X,Y-e.z,true,frame,false);ctx.globalAlpha=.3;ctx.fillStyle='#8cf';ctx.fillRect(X-Math.round(s.fw*s.sc/2),Y-H0,s.fw*s.sc,H0);ctx.globalAlpha=1;}
 if(e.awake&&!e.stag&&!e.air&&(!s.ok||e.act)&&e.t.wl){const a=e.act?e.act.ang:angTo(e,P);wline(e.x,e.y,a,4,4+e.t.wl*(e.boss?1.3:1),e.boss?'#eee':'#cbd',Math.round(H0*.35));}
 if(e.shield){const fa=e.fa||0;ctx.fillStyle='#9ab';for(let k=-4;k<=4;k++){const a=fa+k*.2,wx=e.x+Math.cos(a)*(e.r+4),wy=e.y+Math.sin(a)*(e.r+4);ctx.fillRect(sx(wx,wy),sy(wx,wy)-Math.round(H0*.3),2,3);}}
 if(e.act&&e.act.ph===0&&e.tele>0)txt('!',X-1,Y-H0-8,e.tele===2?'#f33':'#fc4',e.tele===2?2:1);
 if(e.stag>0){for(let i=0;i<3;i++){const a=time*6+i*2.1;ctx.fillStyle='#fd4';ctx.fillRect(Math.round(X+Math.cos(a)*7),Math.round(Y-H0+4+Math.sin(a)*2),2,2);}}
 if(!e.boss&&(e.hp<e.maxhp||e.posture>0||e.elite)){
  const w=e.elite?18:12,x=X-(w>>1),y=Y-H0-6;ctx.fillStyle='#000';ctx.fillRect(x-1,y-1,w+2,e.posture>0?6:4);ctx.fillStyle='#a22';ctx.fillRect(x,y,Math.round(w*Math.max(0,e.hp)/e.maxhp),2);
  if(e.posture>0){ctx.fillStyle='#fd4';ctx.fillRect(x,y+3,Math.round(w*Math.min(1,e.posture/e.maxPosture)),1);}
  if(e.elite)txt(ELMOD[e.elite].n,X-Math.round(txtW(ELMOD[e.elite].n)/2),y-7,ELMOD[e.elite].c);
  if(e.st){let k=0;for(const [key,c] of [['burn','#f80'],['poison','#8c4'],['chillT','#8cf'],['shock','#ff4']])if(e.st[key]>0){ctx.fillStyle=c;ctx.fillRect(x+k*4,y-3,3,2);k++;}}
 }
}
let merchantSpr=null;
function drawPlayer(){
 // walking up the screen (away from the camera) shows the back-view sheet
 const p=P,away=p.mv&&scrVec(p.mvx||0,p.mvy||0)[1]<-.15&&!(p.dash>0);
 const s=heroSpr(CLS().k,p.evo||0,away),X=sx(p.x,p.y),Y=sy(p.x,p.y)+3;
 // pick the animation: dash > spell pose > walk > idle
 const st=p.dash>0?'dash':p.animT>0?p.animK:p.mv?'walk':'idle',seq=WIZ[st];
 const fr=st==='walk'?seq[Math.floor(time*10)%4]:st==='idle'?seq[Math.floor(time*2.5)%2]:st==='atk'?seq[p.animT>p.animD*.45?1:0]:st==='cast'?seq[Math.floor(time*14)%2]:seq[0];
 const flip=st==='dash'?scrVec(p.dx,p.dy)[0]<0:p.face<0;
 shadow(X,Y-2,7);
 if(st==='dash'){for(let i=1;i<=3;i++){ctx.globalAlpha=.32-i*.08;const bx=sx(p.x-p.dx*i*6,p.y-p.dy*i*6),by=sy(p.x-p.dx*i*6,p.y-p.dy*i*6)+3;drawSpr(s,bx,by,true,fr,flip);}ctx.globalAlpha=1;}
 p.liqv=liqAt(p.x,p.y);
 if(p.iv>0&&p.dash>0){ctx.globalAlpha=.7;}
 else if((p.iv>0||p.hurtIv>0)&&p.flash<=0&&Math.floor(time*20)%2===0)ctx.globalAlpha=.45;
 // aim spark orbiting the wizard: behind the body when aiming "up" the screen
 const a=p.aim,twx=p.x+Math.cos(a)*11,twy=p.y+Math.sin(a)*11,ttx=sx(twx,twy),tty=sy(twx,twy)-8;
 const tal=()=>{const al=ctx.globalAlpha;ctx.globalAlpha=1;ctx.fillStyle='#14101a';ctx.fillRect(ttx-1,tty-1,3,3);ctx.fillStyle=Math.floor(time*8)%2?'#ffe080':'#ff8a30';ctx.fillRect(ttx,tty,1,1);ctx.globalAlpha=al;};
 const behind=twx+twy<p.x+p.y;
 if(behind)tal();
 // standing in liquid hides the boots
 const wet=p.liqv&&p.liqv!==4&&st!=='dash';
 if(wet){ctx.save();ctx.beginPath();ctx.rect(X-12,Y-30,24,28);ctx.clip();}
 drawSpr(s,X,Y,p.flash>0,fr,flip);
 if(wet){ctx.restore();ctx.fillStyle=map.env.lc[2];ctx.globalAlpha=.7;ctx.fillRect(X-5,Y-2,10,1);ctx.globalAlpha=1;}
 ctx.globalAlpha=1;
 if(!behind)tal();
 // casting glow around the staff orb
 if(st==='cast'||st==='ult'||(st==='atk'&&fr===7)){const ox=X+(flip?-1:1)*(st==='ult'?0:5),oy=Y-(st==='ult'?23:st==='atk'?18:22);const col=st==='ult'?'#fd4':SPELLS[p.animK==='atk'?'m':'q'][0].c;ctx.globalAlpha=.35+.25*Math.sin(time*30);disc(ox,oy,st==='ult'?6:4,st==='ult'?'#fd4':'#ffb050');ctx.globalAlpha=1;ctx.fillStyle='#fff';ctx.fillRect(ox,oy,1,1);
  if(st==='ult'){circ(X,Y-12,14+Math.sin(time*20)*2,'#fd4');for(let i=0;i<6;i++){const an=time*6+i*TAU/6;ctx.fillStyle='#fd4';ctx.fillRect(Math.round(X+Math.cos(an)*12),Math.round(Y-12+Math.sin(an)*6),1,2);}}}
 if(p.evoT>0){ctx.globalAlpha=Math.min(.6,p.evoT*.5);disc(X,Y-11,10+Math.round((1.2-p.evoT)*14),'#ffe060');ctx.globalAlpha=1;}
 if(p.aegis>0){const pulse=Math.sin(time*10)*1.5;ctx.globalAlpha=.2;disc(X,Y-11,14,'#fff4b0');ctx.globalAlpha=1;circ(X,Y-11,14+pulse,'#fff4b0');circ(X,Y-11,10-pulse,'#fff');for(let i=0;i<6;i++){const an=-time*3+i*TAU/6;ctx.fillStyle=i%2?'#fff':'#fd4';ctx.fillRect(Math.round(X+Math.cos(an)*15),Math.round(Y-11+Math.sin(an)*15),2,2);}}
 if(p.ward>0){const pulse=Math.sin(time*14)*1.2;ctx.globalAlpha=.16;wdisc(p.x,p.y,11,'#8cf');disc(X,Y-11,12,'#8cf');ctx.globalAlpha=1;wcirc(p.x,p.y,11+pulse,'#8cf');circ(X,Y-11,12+pulse,'#8cf');for(let i=0;i<4;i++){const an=time*4+i*TAU/4;ctx.fillStyle='#fff';ctx.fillRect(Math.round(X+Math.cos(an)*12),Math.round(Y-11+Math.sin(an)*12),2,2);}}
 if(p.haste>0){ctx.fillStyle='#8f8';for(let i=0;i<3;i++)ctx.fillRect(X-6+((time*40+i*9)%12),Y-4-i*5,2,1);}
 if(p.stag>0){for(let i=0;i<3;i++){const an=time*7+i*2.1;ctx.fillStyle='#fd4';ctx.fillRect(Math.round(X+Math.cos(an)*7),Math.round(Y-27+Math.sin(an)*2),2,2);}}
}
function drawTele(e){
 const a=e.act;if(!a||a.ph!==0||!e.awake)return;
 const col=a.peril?'rgba(255,40,40,':'rgba(255,200,80,';
 if(a.n==='slam'){const k=a.t/a.w;ctx.globalAlpha=.25;wdisc(e.x,e.y,a.rad*Math.min(1,k),a.peril?'#f22':'#fa4');ctx.globalAlpha=1;wcirc(e.x,e.y,a.rad,a.peril?'#f55':'#fb6');}
 else if(a.n==='leap'&&a.tx!==undefined){ctx.globalAlpha=.25;wdisc(a.tx,a.ty,a.rad,'#f22');ctx.globalAlpha=1;wcirc(a.tx,a.ty,a.rad,'#f55');}
 else if(a.n==='thrust'||a.n==='charge'){const len=a.n==='thrust'?a.dist:a.sp*a.dur;ctx.fillStyle=col+'.55)';for(let r=8;r<len;r+=3){const x=e.x+Math.cos(a.ang)*r,y=e.y+Math.sin(a.ang)*r;ctx.fillRect(sx(x,y),sy(x,y),1,1);}}
 else if(a.n==='slash'){const st=a.ang-a.arc*Math.PI/360,en=a.ang+a.arc*Math.PI/360;ctx.fillStyle=col+'.5)';for(let s=st;s<=en;s+=.1){const x=e.x+Math.cos(s)*a.range,y=e.y+Math.sin(s)*a.range;ctx.fillRect(sx(x,y),sy(x,y),1,1);}}
 else if(a.n==='shoot'&&a.line){ctx.fillStyle='rgba(255,60,60,.7)';for(let r=10;r<220;r+=3){const x=e.x+Math.cos(a.ang)*r,y=e.y+Math.sin(a.ang)*r;ctx.fillRect(sx(x,y),sy(x,y)-6,1,1);}}
 else if(a.n==='blink'){wcirc(e.x,e.y,10,'#c8f');}
}
// boss arena: a rune circle in the dungeon's accent colour that flares red while the fight is on
function drawArena(){if(!map||map.train||!map.bossRoom)return;const br=map.bossRoom,cx=(br.x+br.w/2)*T,cy=(br.y+br.h/2)*T,X=sx(cx,cy),Y=sy(cx,cy);if(X<-200||X>W+200||Y<-120||Y>H+120)return;
 const live=boss&&boss.awake&&!boss.dead,c=live?'#ff4040':map.env.lc[2];
 ctx.globalAlpha=live?.55:.3;wcirc(cx,cy,br.w*T*.36,c);wcirc(cx,cy,br.w*T*.36-4,c);wcirc(cx,cy,br.w*T*.2,c);
 for(let i=0;i<12;i++){const a=i/12*TAU+time*.15,rr=br.w*T*.36-2,x=cx+Math.cos(a)*rr,y=cy+Math.sin(a)*rr;ctx.fillStyle=c;ctx.fillRect(sx(x,y)-1,sy(x,y)-1,3,3);}
 for(let i=0;i<6;i++){const a=i/6*TAU-time*.25,x1=cx+Math.cos(a)*br.w*T*.2,y1=cy+Math.sin(a)*br.w*T*.2,x2=cx+Math.cos(a+TAU/3)*br.w*T*.2,y2=cy+Math.sin(a+TAU/3)*br.w*T*.2;sline(sx(x1,y1),sy(x1,y1),sx(x2,y2),sy(x2,y2),c);}
 ctx.globalAlpha=1;}
function drawGround(){
 drawArena();
 for(const t of traps){const st=trapState(t);if(st===0){tdiamond(t.tx,t.ty,'rgba(0,0,0,.28)');}else if(st===1){tdiamond(t.tx,t.ty,Math.floor(time*10)%2?'rgba(255,200,60,.55)':'rgba(255,120,40,.4)');}else{tdiamond(t.tx,t.ty,'rgba(255,40,40,.7)');const X=sx(t.tx*T+8,t.ty*T+8),Y=sy(t.tx*T+8,t.ty*T+8);ctx.fillStyle='#fff';for(let k=-6;k<=6;k+=4)ctx.fillRect(X+k,Y-5,2,5);}}
 for(const z of zones){
  if(z.k&&CZD[z.k]){CZD[z.k](z);continue;}
  if(z.k==='grav'&&z.hole){const pr=1-Math.max(0,z.t)/z.dur;ctx.globalAlpha=.3+.2*pr;wdisc(z.x,z.y,z.r,'#1a0830');ctx.globalAlpha=.5;wdisc(z.x,z.y,z.r*.35,'#000');ctx.globalAlpha=1;wcirc(z.x,z.y,z.r,'#c080ff');wcirc(z.x,z.y,z.r*.35+Math.sin(time*12)*1.5,'#fff');
   for(let i=0;i<14;i++){const a=-time*5+i*TAU/14,rr=z.r*(1-((time*.9+i/14)%1)),wx=z.x+Math.cos(a)*rr,wy=z.y+Math.sin(a)*rr;ctx.fillStyle=i%3?'#c080ff':'#fff';ctx.fillRect(sx(wx,wy),sy(wx,wy),2,1);}continue;}
  if(z.k==='grav'){const pr=1-Math.max(0,z.t)/2.2;ctx.globalAlpha=.18+.15*pr;wdisc(z.x,z.y,z.r,'#529');ctx.globalAlpha=1;wcirc(z.x,z.y,z.r,'#a6f');wcirc(z.x,z.y,z.r*(1-pr),'#fff');for(let i=0;i<6;i++){const a=-time*4+i*1.05,rr=z.r*(.3+.6*((time*.8+i/6)%1)),wx=z.x+Math.cos(a)*rr,wy=z.y+Math.sin(a)*rr;ctx.fillStyle='#c8f';ctx.fillRect(sx(wx,wy),sy(wx,wy),2,1);}continue;}
  if(z.k==='totem'){ctx.globalAlpha=.08;wdisc(z.x,z.y,z.r,'#ff6');ctx.globalAlpha=1;const X=sx(z.x,z.y),Y=sy(z.x,z.y);ctx.fillStyle='#000';ctx.fillRect(X-3,Y-15,6,16);ctx.fillStyle='#8a5a2a';ctx.fillRect(X-2,Y-14,4,14);ctx.fillStyle='#c8283c';ctx.fillRect(X-2,Y-11,4,2);ctx.fillStyle=Math.floor(time*8)%2?'#ff6':'#fff';ctx.fillRect(X-1,Y-17,2,2);continue;}
  ctx.globalAlpha=.2;wdisc(z.x,z.y,z.r,'#8cf');ctx.globalAlpha=1;wcirc(z.x,z.y,z.r,'#8cf');wcirc(z.x,z.y,z.r*.6,'#4af');for(let i=0;i<5;i++){const a=time*1.5+i*1.26,wx=z.x+Math.cos(a)*z.r*.8,wy=z.y+Math.sin(a)*z.r*.8;ctx.fillStyle='#fff';ctx.fillRect(sx(wx,wy),sy(wx,wy),2,1);}}
 for(const h of hz){ctx.globalAlpha=.25+.15*Math.sin(time*12+h.x);wdisc(h.x,h.y,h.r,h.col||'#f60');ctx.globalAlpha=1;if(Math.random()<.3){ctx.fillStyle='#fd4';const wx=h.x+rnd(-h.r,h.r)*.6,wy=h.y+rnd(-h.r,h.r)*.6;ctx.fillRect(sx(wx,wy),sy(wx,wy)-rnd(1,6)|0,1,2);}}
 for(const d of dh){const k=1-d.t/d.dur;ctx.globalAlpha=.22;wdisc(d.x,d.y,d.r*Math.min(1,k*1.1),d.col||'#f22');ctx.globalAlpha=1;wcirc(d.x,d.y,d.r,d.col||'#f55');}
 for(const e of enemies)if(!e.dead&&e.act&&e.act.ph===0)drawTele(e);
}
function drawProp(p){
 const X=sx(p.x,p.y),Y=sy(p.x,p.y);
 if(p.k==='chest'){ // red lacquered treasure chest with gold bands; glows until opened, open lid shows the empty gold-lined inside
  shadow(X,Y,22);const o=p.used;
  if(!o){ctx.globalAlpha=.18+.08*Math.sin(time*3);disc(X,Y-8,15,'#ffd040');ctx.globalAlpha=1;}
  ctx.fillStyle='#14101a';ctx.fillRect(X-11,Y-(o?21:15),22,o?21:15);
  ctx.fillStyle='#8a1a20';ctx.fillRect(X-10,Y-8,20,7);ctx.fillStyle='#a82830';ctx.fillRect(X-10,Y-8,20,1);
  ctx.fillStyle='#e0b040';ctx.fillRect(X-10,Y-2,20,1);ctx.fillRect(X-7,Y-8,2,7);ctx.fillRect(X+5,Y-8,2,7);
  if(o){ctx.fillStyle='#6a1018';ctx.fillRect(X-10,Y-20,20,6);ctx.fillStyle='#e0b040';ctx.fillRect(X-10,Y-15,20,1);ctx.fillStyle='#3a2a10';ctx.fillRect(X-9,Y-10,18,2);}
  else{ctx.fillStyle='#a82830';ctx.fillRect(X-10,Y-14,20,6);ctx.fillStyle='#c84040';ctx.fillRect(X-10,Y-14,20,1);ctx.fillStyle='#e0b040';ctx.fillRect(X-7,Y-14,2,6);ctx.fillRect(X+5,Y-14,2,6);ctx.fillRect(X-10,Y-9,20,1);
   ctx.fillStyle='#ffe080';ctx.fillRect(X-1,Y-10,3,3);ctx.fillStyle='#14101a';ctx.fillRect(X,Y-9,1,1);
   if(Math.random()<.05)particles.push({x:p.x+rnd(-8,8),y:p.y+rnd(-6,6),vx:0,vy:-12,t:.6,col:'#ffe080'});}}
 else if(p.k==='altar'){ // shrine: a wooden offering table with shide streamers and a violet spirit orb; curse: an obsidian block with a floating red-eyed skull
  shadow(X,Y,20);const cu=p.curse;
  ctx.fillStyle='#14101a';ctx.fillRect(X-10,Y-12,20,12);
  ctx.fillStyle=cu?'#1a1418':'#5a3a20';ctx.fillRect(X-9,Y-11,18,10);ctx.fillStyle=cu?'#3a2a30':'#7a5230';ctx.fillRect(X-9,Y-11,18,2);
  if(cu){ctx.fillStyle='#f33';ctx.fillRect(X-1,Y-8,2,5);ctx.fillRect(X-3,Y-6,6,1);}else{ctx.fillStyle='#a02020';ctx.fillRect(X-7,Y-9,14,4);ctx.fillStyle='#fff';ctx.fillRect(X-5,Y-9,1,3);ctx.fillRect(X+4,Y-9,1,3);ctx.fillRect(X-5,Y-6,2,1);ctx.fillRect(X+3,Y-6,2,1);}
  if(!p.used){const fy=Y-24+Math.round(Math.sin(time*2)*2);ctx.globalAlpha=.3+.2*Math.sin(time*4);disc(X,fy,8,p.col);ctx.globalAlpha=1;
   if(cu){ctx.fillStyle='#14101a';ctx.fillRect(X-4,fy-4,9,9);ctx.fillStyle='#e8e0d0';ctx.fillRect(X-3,fy-3,7,5);ctx.fillRect(X-2,fy+2,5,2);ctx.fillStyle=Math.floor(time*4)%2?'#f33':'#ff8080';ctx.fillRect(X-2,fy-1,2,2);ctx.fillRect(X+1,fy-1,2,2);}
   else{disc(X,fy,3,p.col);ctx.fillStyle='#fff';ctx.fillRect(X-1,fy-1,1,1);}
   if(Math.random()<.08)particles.push({x:p.x+rnd(-16,16),y:p.y+rnd(-12,12),vx:rnd(-3,3),vy:-16,t:.9,col:cu?'#f33':'#c6f'});}}
 else if(p.k==='gong'){shadow(X,Y,14);ctx.fillStyle='#14101a';ctx.fillRect(X-9,Y-22,2,22);ctx.fillRect(X+7,Y-22,2,22);ctx.fillRect(X-10,Y-24,20,3);ctx.fillStyle='#8a3020';ctx.fillRect(X-9,Y-23,18,1);disc(X,Y-12,6,'#14101a');disc(X,Y-12,5,p.used?'#6a5020':'#d8a030');if(!p.used){ctx.fillStyle='#fff0a0';ctx.fillRect(X-2,Y-15,2,2);ctx.globalAlpha=.3+.2*Math.sin(time*4);disc(X,Y-12,8,'#fc4');ctx.globalAlpha=1;}}
 else if(p.k==='spring'){ // stone-rimmed healing pond: green glow and rising motes until used, then it goes still and dark
  const R0=22;wdisc(p.x,p.y,R0+4,'#4a4a44');wdisc(p.x,p.y,R0+2,'#7a7a72');wdisc(p.x,p.y,R0,p.used?'#1e3a4a':'#2a6a8a');wdisc(p.x,p.y,R0-7,p.used?'#24485a':'#3a8aaa');
  if(!p.used){ctx.globalAlpha=.22+.1*Math.sin(time*2);wdisc(p.x,p.y,R0-2,'#6fffb0');ctx.globalAlpha=1;
   for(let i=0;i<6;i++){const a=time*.6+i*TAU/6,x=p.x+Math.cos(a)*R0*.55,y=p.y+Math.sin(a)*R0*.55;ctx.fillStyle='#cfffe8';ctx.fillRect(sx(x,y),sy(x,y)-((time*14+i*5)%14),1,2);}
   if(Math.random()<.1)particles.push({x:p.x+rnd(-14,14),y:p.y+rnd(-14,14),vx:0,vy:-14,t:1,col:'#8fffc0'});}
  const lx=p.x+9,ly=p.y-7;ctx.fillStyle='#3e8a36';ctx.fillRect(sx(lx,ly)-3,sy(lx,ly),6,2);ctx.fillStyle='#f8b0c8';ctx.fillRect(sx(lx,ly)-1,sy(lx,ly)-1,2,1);}
 else if(p.k==='merchant'){shadow(X,Y+3,18);ctx.globalAlpha=.18+.06*Math.sin(time*3);disc(X+9,Y-4,10,'#ffb040');ctx.globalAlpha=1;drawSpr(MERCH,X,Y+4,false,Math.floor(time*1.6)%2,sx(P.x,P.y)<X);if(dist(p,P)<70){const s='WELCOME, TRAVELLER';txt(s,X-Math.round(txtW(s)/2),Y-40,'#e0c070');}}
 else if(p.k==='pedestal'){shadow(X,Y,14);ctx.fillStyle='#14101a';ctx.fillRect(X-6,Y-6,12,6);ctx.fillStyle='#8a8a9a';ctx.fillRect(X-5,Y-5,10,4);if(!p.sold){const bob=Math.round(Math.sin(time*3+p.x)*1.5),it=p.item?ITEMBY[p.item]:null;if(it)iconBox(X-5,Y-19+bob,it.g,RCOL[it.r]);else iconBox(X-5,Y-19+bob,'+','#e44');const aff=R.sen>=p.price;txt(String(p.price),X-Math.round(txtW(String(p.price))/2),Y-26,aff?'#fc4':'#c55');}}
}
function drawFx(f){
 // impact burst: pixel speed-lines radiating from a big hit or a kill
 if(f.k==='burst'){const k=f.t/f.dur,X=sx(f.x,f.y),Y=sy(f.x,f.y)-7,r0=f.r*(1-k)*.6+3,r1=r0+f.r*.55*k+4;ctx.fillStyle=f.col;
  for(let i=0;i<f.n;i++){const a=f.a0+i/f.n*TAU;for(let r=r0;r<r1;r+=1){ctx.fillRect(Math.round(X+Math.cos(a)*r),Math.round(Y+Math.sin(a)*r*.75),1,1);}}
  if(k>.6){ctx.fillStyle='#fff';ctx.globalAlpha=(k-.6)*2.5;disc(X,Y,Math.round(3+f.r*.12),'#fff');ctx.globalAlpha=1;}return;}
 if(f.k==='line'&&!(f.wait>0)){const k=f.t/f.dur,x1=f.x+Math.cos(f.a)*f.len,y1=f.y+Math.sin(f.a)*f.len;ctx.globalAlpha=k;sline(sx(f.x,f.y),sy(f.x,f.y)-7,sx(x1,y1),sy(x1,y1)-7,f.col);sline(sx(f.x,f.y),sy(f.x,f.y)-6,sx(x1,y1),sy(x1,y1)-6,'#fff');ctx.globalAlpha=1;return;}
 if(f.wait>0){if(f.met||f.k==='strike'){ctx.globalAlpha=.35;wcirc(f.x,f.y,f.r*.6,f.col||'#ffffa0');ctx.globalAlpha=1;}return;}
 if(f.k==='strike'){const k=f.t/f.dur,X=sx(f.x,f.y),Y=sy(f.x,f.y)-4;ctx.globalAlpha=k;let qx=X,qy=Y-120;for(let i=1;i<=10;i++){const tx=X+(i<10?rnd(-5,5):0),ty=Y-120+i*12;sline(qx,qy,tx,ty,'#fff');sline(qx+1,qy,tx+1,ty,'#ffffa0');qx=tx;qy=ty;}ctx.fillStyle='#ffffa0';ctx.globalAlpha=k*.5;ctx.fillRect(X-3,Y-120,7,120);ctx.globalAlpha=1;return;}
 if(f.k==='slash'){const k=1-f.t/f.dur,prog=Math.min(1,k*2.2+.2),a0=f.a-f.arc/2;ctx.globalAlpha=Math.min(1,f.t/f.dur*1.6);ctx.fillStyle=f.col;
  for(let a=0;a<=prog*f.arc;a+=.07){const aa=a0+a;for(let r=f.r-4;r<=f.r;r+=1){const x=f.x+Math.cos(aa)*r,y=f.y+Math.sin(aa)*r;ctx.fillRect(sx(x,y),sy(x,y)-6,1,1);}}ctx.globalAlpha=1;}
 else if(f.k==='ring'){const k=1-f.t/f.dur;ctx.globalAlpha=f.t/f.dur;wcirc(f.x,f.y,f.max*k,f.col);wcirc(f.x,f.y,f.max*k*.85,f.col);ctx.globalAlpha=1;}
 else if(f.k==='bolt'){ctx.globalAlpha=Math.min(1,f.t/f.dur*1.5);for(let i=0;i<f.pts.length-1;i++){const a=f.pts[i],b=f.pts[i+1],ax=sx(a.x,a.y),ay=sy(a.x,a.y)-8,bx=sx(b.x,b.y),by=sy(b.x,b.y)-8,n=Math.max(1,Math.ceil(Math.hypot(bx-ax,by-ay)/6));let qx=ax,qy=ay;for(let k=1;k<=n;k++){const tx=ax+(bx-ax)*k/n+(k<n?rnd(-3,3):0),ty=ay+(by-ay)*k/n+(k<n?rnd(-3,3):0);sline(qx,qy,tx,ty,k%2?'#fff':'#8cf');qx=tx;qy=ty;}}ctx.globalAlpha=1;}
 else if(f.k==='ult'){const k=1-f.t/f.dur,X=sx(f.x,f.y),Y=sy(f.x,f.y);ctx.globalAlpha=.2+.2*k;wdisc(f.x,f.y,f.r*Math.min(1,k*1.2),f.col||'#fc4');ctx.globalAlpha=1;wcirc(f.x,f.y,f.r,f.col||'#fd4');wcirc(f.x,f.y,Math.max(1,f.r*k),'#fff');for(let i=0;i<6;i++){const a=time*3+i*1.05,wx=f.x+Math.cos(a)*f.r*.7,wy=f.y+Math.sin(a)*f.r*.7;ctx.fillStyle='#fd4';ctx.fillRect(sx(wx,wy),sy(wx,wy),2,2);}if(f.t<.25){ctx.globalAlpha=.6;ctx.fillStyle='#fff';ctx.fillRect(X-2,Y-90,4,90);ctx.globalAlpha=1;}}
}
function drawProj(q){
 const X=sx(q.x,q.y),Y=sy(q.x,q.y)-7;
 ctx.fillStyle='rgba(0,0,0,.3)';ctx.fillRect(X-1,Y+7,3,1);
 if(q.arrow){const [vx,vy]=scrVec(q.vx,q.vy),l=Math.hypot(vx,vy)||1,ux=vx/l,uy=vy/l;sline(X-ux*5,Y-uy*5,X+ux*3,Y+uy*3,q.col);ctx.fillStyle='#fff';ctx.fillRect(Math.round(X+ux*3),Math.round(Y+uy*3),1,1);}
 else if(q.crescent){const [vx,vy]=scrVec(q.vx,q.vy),l=Math.hypot(vx,vy)||1,ux=vx/l,uy=vy/l,px=-uy,py=ux;
  for(let i=-7;i<=7;i++){const bend=(1-(i/7)**2)*4,cx=X+px*i+ux*bend,cy=Y+py*i*.8+uy*bend;ctx.fillStyle=Math.abs(i)<5?'#fff':q.col;ctx.fillRect(Math.round(cx),Math.round(cy),2,1);ctx.fillStyle='#8cf';ctx.fillRect(Math.round(cx-ux*2),Math.round(cy-uy*2),1,1);}}
 else if(q.st&&q.from==='e'){const [vx,vy]=scrVec(q.vx,q.vy),l=Math.hypot(vx,vy)||1,ux=vx/l,uy=vy/l;
  switch(q.st){
   case 'accel':case 'curve':for(let i=-2;i<=2;i++){ctx.fillStyle=Math.abs(i)<2?'#fff':q.col;ctx.fillRect(Math.round(X+ux*i*1.5),Math.round(Y+uy*i*1.5),2,2);}ctx.fillStyle=q.col;ctx.fillRect(Math.round(X-ux*5),Math.round(Y-uy*5),1,1);break; // rice grain
   case 'wave':ctx.fillStyle=q.col;ctx.fillRect(X-1,Y-3,3,7);ctx.fillRect(X-3,Y-1,7,3);ctx.fillStyle='#fff';ctx.fillRect(X,Y-1,1,3);break; // diamond
   case 'boom':{const a=time*18;for(let i=0;i<4;i++){const c=Math.cos(a+i*Math.PI/2),s=Math.sin(a+i*Math.PI/2);sline(X,Y,X+c*4,Y+s*4,q.col);}ctx.fillStyle='#fff';ctx.fillRect(X,Y,1,1);break;} // shuriken
   case 'split':circ(X,Y,q.r,q.col);disc(X,Y,q.r-2,'#fff');ctx.globalAlpha=.4;disc(X,Y,q.r+1,q.col);ctx.globalAlpha=1;break;
   case 'mine':{const bl=q.fuse<.4?Math.floor(time*20)%2:Math.floor(time*6)%2;circ(X,Y+3,8-q.fuse*3|0,q.col);disc(X,Y,3,bl?'#fff':q.col);ctx.fillStyle='#14101a';ctx.fillRect(X-1,Y,3,1);ctx.fillRect(X,Y-1,1,3);break;}
   case 'star':ctx.fillStyle=q.col;ctx.fillRect(X-2,Y,5,1);ctx.fillRect(X,Y-2,1,5);ctx.fillStyle='#fff';ctx.fillRect(X,Y,1,1);break;
   case 'big':disc(X,Y,q.r,q.col);circ(X,Y,q.r,'#fff');ctx.fillStyle='#fff';ctx.fillRect(X-1,Y-2,2,1);break;
   default:disc(X,Y,q.r,q.col);}}
 else if(q.rare){ctx.globalAlpha=.35;disc(X,Y,q.r+2,q.col);ctx.globalAlpha=1;disc(X,Y,q.r,q.col);ctx.fillStyle='#fff';ctx.fillRect(X-1,Y,3,1);ctx.fillRect(X,Y-1,1,3);}
 else{disc(X,Y,q.r,q.col);ctx.fillStyle='#fff';ctx.fillRect(X,Y,1,1);}
}
function drawPickup(k){
 const X=sx(k.x,k.y),Y=sy(k.x,k.y),bob=Math.round(Math.sin(time*4+k.x)*1.5);
 if(k.k==='sen'){ // spinning gold coin with a square hole
  const sp=Math.abs(Math.cos(time*4+k.x)),hw=Math.max(0,Math.round(1.5*sp)),cy=Y-3+bob;ctx.fillStyle='#14101a';ctx.fillRect(X-hw-1,cy-2,hw*2+3,5);
  ctx.fillStyle='#b8861c';ctx.fillRect(X-hw,cy-1,hw*2+1,3);ctx.fillStyle='#ffd040';ctx.fillRect(X-hw,cy-1,hw*2+1,2);
  ctx.fillStyle='#fff6c0';ctx.fillRect(X-hw,cy-1,1,1);}
 else if(k.k==='heart'){disc(X,Y-4+bob,3,'#e33');ctx.fillStyle='#fcc';ctx.fillRect(X-1,Y-5+bob,1,1);}
 else if(k.k==='pot'){const y0=Y-9+bob; // a little red HP flask with a cork
  ctx.fillStyle='#14101a';ctx.fillRect(X-3,y0+2,7,7);ctx.fillRect(X-2,y0,5,3);ctx.fillStyle='#c8a070';ctx.fillRect(X-1,y0,3,1);ctx.fillStyle='#ddd';ctx.fillRect(X-1,y0+1,3,2);
  ctx.fillStyle='#e33';ctx.fillRect(X-2,y0+3,5,5);ctx.fillStyle='#ff8080';ctx.fillRect(X-2,y0+3,1,2);ctx.globalAlpha=.25+.15*Math.sin(time*4);disc(X,y0+5,5,'#f44');ctx.globalAlpha=1;}
 else if(k.k==='gourd'){disc(X,Y-4+bob,3,'#6c4');ctx.fillStyle='#240';ctx.fillRect(X,Y-8+bob,1,2);}
 else if(k.k==='bag')drawBag(k,X,Y);
 else if(k.k==='item'){const it=ITEMBY[k.id];ctx.globalAlpha=.3+.2*Math.sin(time*5);wdisc(k.x,k.y,6,RCOL[it.r]);ctx.globalAlpha=1;iconBox(X-5,Y-17+bob,it.g,RCOL[it.r]);}
}
const BAGTMP=mk(24,24,()=>{});
function twinkle(x,y,s,col){x=Math.round(x);y=Math.round(y);ctx.fillStyle=col;ctx.fillRect(x-s,y,s*2+1,1);ctx.fillRect(x,y-s,1,s*2+1);ctx.fillStyle='#fff';ctx.fillRect(x,y,1,1);}
function drawBag(k,X,Y){
 const sp=BAGSPR[k.tier],z=Math.round(k.z||0),c=BAGCOL[k.tier],T=time+k.x*.13,rare=k.tier===4,grounded=!z;
 const hov=rare&&grounded?Math.round(Math.sin(T*2.5)*1.5)-2:0,pop=k.pop>0?Math.round(Math.sin(k.pop*12)*1):0;
 const bx=Math.round(X-sp.w/2),by=Math.round(Y-sp.h-z+hov+1)-pop,mx=X,my=by+sp.h*.55;
 // the special bags (enchanter, scholar, war chest) send up a thin beam in their colour
 if(k.tier>=5){ctx.globalAlpha=.16+.06*Math.sin(T*3);ctx.fillStyle=c;ctx.fillRect(X-2,Y-60,5,60);ctx.globalAlpha=1;}
 if(rare){
  // pillar of light reaching up from the bag, visible from across the room
  const pa=.18+.08*Math.sin(T*3);ctx.globalAlpha=pa;ctx.fillStyle='#ffd040';ctx.fillRect(X-4,Y-90,9,90);ctx.globalAlpha=pa*1.6;ctx.fillStyle='#fff6c0';ctx.fillRect(X-1,Y-90,3,90);ctx.globalAlpha=1;
  // ground glow + an expanding ripple
  ctx.globalAlpha=.3+.12*Math.sin(T*4);wdisc(k.x,k.y,13,'#ffb020');ctx.globalAlpha=.35;wdisc(k.x,k.y,7,'#fff0a0');
  const rp=(T*.8)%1;ctx.globalAlpha=.6*(1-rp);wcirc(k.x,k.y,6+rp*16,'#ffd040');ctx.globalAlpha=1;
  // crisp pixel twinkles orbiting the bag (no blurry vector rays)
  for(let i=0;i<4;i++){const a=T*.9+i*TAU/4,tx=Math.round(mx+Math.cos(a)*12),ty=Math.round(my+Math.sin(a)*8),on=Math.sin(T*5+i*1.7)>0;
   ctx.fillStyle=on?'#fff6c0':'#ffd040';ctx.fillRect(tx,ty,1,1);if(on){ctx.fillRect(tx-1,ty,3,1);ctx.fillRect(tx,ty-1,1,3);}}
  // golden motes rising
  for(let i=0;i<6;i++){const ph=(T*.55+i/6)%1,ox=Math.sin(i*2.7+T)*7;ctx.globalAlpha=1-ph;ctx.fillStyle=i%2?'#fff':'#ffd040';ctx.fillRect(Math.round(X+ox),Math.round(Y-4-ph*34),1,1+(i%3===0?1:0));}ctx.globalAlpha=1;
 }else if(k.tier>=1&&grounded){
  ctx.globalAlpha=.12+.05*k.tier+.08*Math.sin(T*4);wdisc(k.x,k.y,6+k.tier,c);ctx.globalAlpha=1;
  for(let i=0;i<k.tier-1;i++){const ph=(T*.5+i/2)%1;ctx.globalAlpha=1-ph;ctx.fillStyle=c;ctx.fillRect(Math.round(X-3+i*6),Math.round(Y-3-ph*18),1,1);}ctx.globalAlpha=1;
 }
 // shadow shrinks as it flies
 const sw=Math.max(3,Math.round(sp.w/2-2-z/6));ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(X-sw,Y-1,sw*2,2);
 ctx.drawImage(sp.c,bx,by);
 if(rare){const sh=(T*.9)%2.2;if(sh<1){ // a shine sweep across the gold cloth (masked to the sprite)
   const g=BAGTMP.getContext('2d');g.clearRect(0,0,24,24);g.drawImage(sp.c,0,0);g.globalCompositeOperation='source-atop';g.fillStyle='rgba(255,255,255,.7)';const sx0=-4+sh*(sp.w+10);
   for(let j=0;j<sp.h;j++)g.fillRect(Math.round(sx0-j*.5),j,2,1);g.globalCompositeOperation='source-over';ctx.drawImage(BAGTMP,bx,by);}
  // sparkles orbiting the bag
  for(let i=0;i<3;i++){const a=T*2+i*TAU/3,ox=Math.cos(a)*11,oy=Math.sin(a)*4,s=(Math.floor(T*6+i)%3===0)?2:1;twinkle(mx+ox,my+oy,s,'#ffe070');}
  if(Math.floor(T*5)%4===0)twinkle(bx+sp.w/2,by+sp.h*.55,2,'#ffd0d8');
 }else if(k.tier>=2&&Math.floor(T*4)%5===0)twinkle(bx+sp.w-3,by+3,1,'#fff');
}
// ---- ability icons: an 11x11 pixel picture of what each spell does, drawn in the spell's colour ----
// '#' spell colour (auto-lit on top, shaded underneath), w white, y gold, s steel, k dark, n wood, p paper, g green
const SPMOTIF={
 bolt:['......###..','.....###...','....###....','...###.....','..#######..','.....###...','....###....','...###.....','..##.......','.#.........','...........'],
 flame:['.....#.....','....##.....','....###.#..','...####.##.','..#####.##.','..##yy####.','.##yyyy###.','.##ywwy###.','.##yyyy##..','..##yy##...','...####....'],
 snow:['.....#.....','...#.#.#...','....###....','.#...#...#.','..#..#..#..','#####w#####','..#..#..#..','.#...#...#.','....###....','...#.#.#...','.....#.....'],
 venom:['.....#.....','.....#.....','....###....','....###....','...#####...','..###w###..','..##w####..','..#######..','...#####...','....###.#..','........#..'],
 plant:['........w..','.......www.','........w..','..##.......','.####..##..','.#####.###.','..####n###.','....##n##..','......n....','......n....','....nnnn...'],
 shield:['.#########.','.####w####.','.####w####.','.##wwwww##.','.####w####.','.####w####.','..###w###..','..#######..','...#####...','....###....','.....#.....'],
 sword:['#........sw','.#......sw.','..#....sw..','..#...sw...','..#..sw....','..#.sw.....','..#yy......','..yy#......','.##..#.....','##.........','...........'],
 arrow:['........###','.........##','........#.#','.......#...','......#....','.....#.....','....#......','...#.......','w.#........','.w.........','w.w........'],
 arrowrain:['w...w...w..','.#...#...#.','.#...#...#.','.#...#...#.','.#...#...#.','###.###.###','.#...#...#.','...........','w...w...w..','.#...#...#.','###.###.###'],
 talisman:['...ppppp...','...p###p...','...pp#pp...','...p###p...','...pp#pp...','...p#p#p...','...ppppp...','...p#p#p...','...ppppp...','....p.p....','....p.p....'],
 wisp:['...###.....','..#####....','.##w#w##...','.#######...','.#######...','..######...','...#####...','....####...','.....###...','......##...','.......#...'],
 shards:['#....#....#','.#...#...#.','..#..w..#..','...#.#.#...','....###....','#####w#####','....###....','...#.#.#...','..#..#..#..','.#...#...#.','#....#....#'],
 vortex:['...#####...','.##.....##.','.#..###..#.','#..#...#..#','#.#..k..#.#','#.#.kkk.#.#','#.#..k..#..','#..#....#..','.#..####...','.##........','...####....'],
 dash:['...........','.#...#.....','.##..##....','..##..##...','...##..##..','....##..##.','...##..##..','..##..##...','.##..##....','.#...#.....','...........'],
 smoke:['...........','....###....','..#######..','.####w####.','.#########.','###########','#####w#####','.#########.','..##.###.#.','...........','...........'],
 clones:['...........','.#...#...#.','###.###.###','.#...#...#.','###.###.###','###.###.###','.#.#.#.#.#.','.#.#.#.#.#.','...........','...........','...........'],
 dragon:['.##........','..###......','..#####....','.###w####..','##########.','#########yy','.####.#.#.#','..####.....','...####....','....###....','......##...'],
 hourglass:['.yyyyyyyyy.','..#######..','...#####...','....###....','.....#.....','.....#.....','....#w#....','...##w##...','..###w###..','.yyyyyyyyy.','...........'],
 hawk:['...........','#.........#','##.......##','.###...###.','..###y###..','...#####...','....###....','....#.#....','...........','...........','...........'],
 totem:['....###....','...#w#w#...','...#####...','....###....','...#####...','...#w#w#...','....###....','....###....','...#####...','..#######..','...........'],
 bell:['.....y.....','....###....','...#####...','...#####...','..##w####..','..##w####..','.#########.','###########','.....y.....','...........','...........'],
 mirror:['...#####...','..#wwsss#..','.#wssssss#.','.#sssssss#.','.#ssssss##.','..#sssss#..','...#####...','.....#.....','.....#.....','....###....','...#####...'],
 whirl:['..#######..','.#.......#.','...#####...','..#.....#..','....###....','...#...#...','.....#.....','....#......','.....#.....','...........','...........'],
 shout:['...........','......#....','..##...#...','.####...#..','#####w..#..','####ww..#..','#####w..#..','.####...#..','..##...#...','......#....','...........'],
 crescent:['...####....','.####......','.##........','###........','##.........','##.........','##.........','###........','.##........','.####......','...####....'],
 shuriken:['.....#.....','.....#.....','....###....','....###....','..#.#w#.#..','#####k#####','..#.#w#.#..','....###....','....###....','.....#.....','.....#.....'],
 kunai:['.........w#','........w#.','.......w#..','......w#...','.....w#....','....##.....','...yy......','..##.......','.#.#.......','.#.#.......','..#........'],
 sickle:['...####....','..#....#...','.#......#..','.#......n..','........n..','........n..','.......y...','......#.#..','.....#.#...','....#.#....','...........'],
 meteor:['#..........','.#.#.......','..#.#......','...#.##....','....####...','....#yyy#..','....#ywy##.','.....#yyy#.','......####.','...........','...........'],
 caltrop:['...........','..#.....#..','.###...###.','..#.....#..','....#......','...###.....','....#...#..','#......###.','##......#..','#..........','...........'],
 orb:['...#####...','.#########.','.#ww######.','##w########','###########','###########','###########','.#########.','.#########.','...#####...','...........']};
const SPRULES=[[/CRY/,'shout'],[/TOTEM/,'totem'],[/DRAGON/,'dragon'],[/LIGHTNING|THUNDER|JUDG|STATIC/,'bolt'],[/METEOR/,'meteor'],[/FLAME|FIRE|DESCENT|INFERNO|SPIRIT FOX/,'flame'],
 [/FROST|ICE|NOVA|STILL/,'snow'],[/CALTROP/,'caltrop'],[/VENOM|POISON/,'venom'],[/HEAL|RITE|MEND/,'plant'],[/WARD|AEGIS|SHIELD|GUARD|COUNTER|BARRIER/,'shield'],
 [/TALISMAN|PAPER|OFUDA/,'talisman'],[/ARROW RAIN|ARROW STORM/,'arrowrain'],[/ARROW|SHOT|VOLLEY|BOLTS|HANKYU/,'arrow'],[/CRESCENT|MOON/,'crescent'],
 [/SHURIKEN/,'shuriken'],[/KUNAI/,'kunai'],[/KUSARI/,'sickle'],[/WHIRL/,'whirl'],[/KATANA|BLADE|CLEAVE|IAI|ODACHI|NAGINATA|SWEEP|COMBO|SLASH/,'sword'],
 [/WISP|SEEKER|SHIKI/,'wisp'],[/SHARD/,'shards'],[/VOID|GRAVITY|BLACK HOLE|WELL/,'vortex'],[/STEP|KITSUNE|ROLL|EVADE|DASH/,'dash'],[/SMOKE/,'smoke'],
 [/CLONE/,'clones'],[/TIME/,'hourglass'],[/HAWK/,'hawk'],[/BELL|SUZU/,'bell'],[/MIRROR/,'mirror']];
const SPICO={},SPACC={w:'#ffffff',y:'#ffd040',s:'#c8d0dc',k:'#14101a',n:'#7a5a2a',p:'#f0e8d0',g:'#66ee66'};
function spellIcon(sp){const key=sp.n+sp.c;if(SPICO[key])return SPICO[key];
 const m=SPMOTIF[(SPRULES.find(r=>r[0].test(sp.n))||[0,'orb'])[1]],c=sp.c,at=(x,y)=>y>=0&&y<11&&x>=0&&x<11&&m[y][x]==='#';
 return SPICO[key]=mk(11,11,g=>{for(let y=0;y<11;y++)for(let x=0;x<11;x++){const ch=m[y][x];if(ch==='.')continue;
  g.fillStyle=ch==='#'?(!at(x,y-1)?shade(c,.35):!at(x,y+1)?shade(c,-.4):c):SPACC[ch]||c;g.fillRect(x,y,1,1);}});}
// a 13x13 spell slot: coloured frame, dark well, the ability's icon (dimmed while on cooldown)
function spellBox(x,y,sp,ready){ctx.fillStyle='#000';ctx.fillRect(x-1,y-1,15,15);ctx.fillStyle=ready?sp.c:'#555';ctx.fillRect(x,y,13,13);ctx.fillStyle='#14101a';ctx.fillRect(x+1,y+1,11,11);
 if(!ready)ctx.globalAlpha=.4;ctx.drawImage(spellIcon(sp),x+1,y+1);ctx.globalAlpha=1;}
function iconBox(x,y,g,col){ctx.fillStyle='#000';ctx.fillRect(x-1,y-1,11,11);ctx.fillStyle=col;ctx.fillRect(x,y,9,9);ctx.fillStyle='#14101a';ctx.fillRect(x+1,y+1,7,7);const gl=FONT[g]||FONT['?'];ctx.fillStyle=col;glyph(gl,x+3,y+2,1);}
function drawPortal(){
 // big torii gate with a swirling vortex, a light pillar and a bouncing arrow
 const p=portal;if(!p||p.pending)return;const X=sx(p.x,p.y),Y=sy(p.x,p.y),t=p.t;
 ctx.globalAlpha=.22+.1*Math.sin(t*4);wdisc(p.x,p.y,22,'#8cf');ctx.globalAlpha=1;wcirc(p.x,p.y,18+Math.sin(t*5)*2,'#8cf');wcirc(p.x,p.y,24,'#4af');
 ctx.globalAlpha=.18;ctx.fillStyle='#bdf';ctx.fillRect(X-9,0,18,Y);ctx.globalAlpha=.3;ctx.fillRect(X-4,0,8,Y);ctx.globalAlpha=1;
 const OL='#14101a',RD='#d02030',DK='#7a1020';
 // vortex inside the gate
 for(let r=11;r>0;r-=2){ctx.fillStyle=r%4===1?'#fff':r%4===3?'#8cf':'#3a6af0';ctx.globalAlpha=.85;const w=r,h=Math.round(r*17/11);ctx.fillRect(X-w,Y-17-h,w*2,h*2);} // fills the gate from the lower beam to the ground
 ctx.globalAlpha=1;
 for(let i=0;i<14;i++){const a=t*4+i*.9,rr=(i*2.3+t*14)%12;ctx.fillStyle=i%2?'#fff':'#bdf';ctx.fillRect(Math.round(X+Math.cos(a)*rr),Math.round(Y-17+Math.sin(a)*rr*1.4),1,1);}
 // pillars + beams
 ctx.fillStyle=OL;ctx.fillRect(X-16,Y-42,5,43);ctx.fillRect(X+11,Y-42,5,43);ctx.fillRect(X-22,Y-47,44,6);ctx.fillRect(X-18,Y-38,36,4);
 ctx.fillStyle=RD;ctx.fillRect(X-15,Y-41,3,41);ctx.fillRect(X+12,Y-41,3,41);ctx.fillRect(X-17,Y-37,34,2);ctx.fillStyle='#1a1a24';ctx.fillRect(X-21,Y-46,42,4);ctx.fillStyle=RD;ctx.fillRect(X-20,Y-43,40,1);
 ctx.fillStyle=DK;ctx.fillRect(X-13,Y-41,1,41);ctx.fillRect(X+14,Y-41,1,41);ctx.fillStyle='#e8c050';ctx.fillRect(X-1,Y-42,2,4);
 for(let i=0;i<26;i++){const off=(t*34+i*11)%60,x=X+Math.sin(t*3+i)*10;ctx.fillStyle=i%2?'#8cf':'#fff';ctx.fillRect(Math.round(x),Math.round(Y-off),1,2);}
 const by=Math.round(Y-62+Math.sin(t*5)*3);ctx.fillStyle=OL;ctx.fillRect(X-4,by-1,9,4);ctx.fillRect(X-2,by+3,5,3);ctx.fillStyle='#fd4';ctx.fillRect(X-3,by,7,2);ctx.fillRect(X-1,by+2,3,2);ctx.fillRect(X,by+4,1,1);
 txt('PORTAL',X-11,by-9,'#fff');
}
function drawMinimap(){
 // bird's-eye minimap: straight top-down, turned 45 degrees so up on the map is up on screen
 const k=64/(MW+MH),mw=Math.round((MW+MH)*k),mh=mw,ox=W-mw-3,oy=3,mp=(x,y)=>{const [u,v]=tileR(x,y);return [ox+Math.round((u-v+RMH)*k),oy+Math.round((u+v)*k)];};
 ctx.fillStyle='rgba(0,0,0,.55)';ctx.fillRect(ox-1,oy-1,mw+2,mh+2);
 ctx.fillStyle='rgba(170,170,200,.7)';
 // explored floor, plus the edges where a seen path leads into unexplored floor (pulsing gold = somewhere left to explore)
 const fr=[],un=(x,y)=>x>=0&&y>=0&&x<MW&&y<MH&&map.t[y*MW+x]&&!map.expl[y*MW+x];
 for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)if(map.expl[y*MW+x]&&map.t[y*MW+x]){const q=mp(x,y);ctx.fillRect(q[0],q[1],1,1);if(un(x+1,y)||un(x-1,y)||un(x,y+1)||un(x,y-1))fr.push(q);}
 ctx.fillStyle=Math.floor(time*3)%2?'#ffd040':'#c08a10';for(const q of fr)ctx.fillRect(q[0],q[1],1,1);
 ctx.fillStyle='rgba(170,170,200,.7)';
 for(const r of map.rooms){if(!r.type||r.type==='combat')continue;const cx=r.x+(r.w>>1),cy=r.y+(r.h>>1);if(!map.expl[cy*MW+cx])continue;const q=mp(cx,cy);ctx.fillStyle=ROOMCOL[r.type]||'#fff';ctx.fillRect(q[0]-1,q[1]-1,3,3);}
 const br=map.bossRoom;if(!map.train&&(boss||!portal)){const q=mp(br.x+(br.w>>1),br.y+(br.h>>1));ctx.fillStyle=Math.floor(time*3)%2?'#f33':'#a22';ctx.fillRect(q[0]-1,q[1]-1,3,3);}
 if(portal){const q=mp(portal.x/T|0,portal.y/T|0);ctx.fillStyle='#8cf';ctx.fillRect(q[0]-1,q[1]-1,3,3);}
 const q=mp(P.x/T|0,P.y/T|0);ctx.fillStyle='#fff';ctx.fillRect(q[0]-1,q[1]-1,3,3);
}
const slotX=i=>W-6*20-2+i*20,SLOTY=()=>H-28;
function hoverSlot(){if(mode!=='play'||!P)return null;for(let i=0;i<6;i++){const x=slotX(i),y=SLOTY();if(mouse.x>=x-2&&mouse.x<=x+15&&mouse.y>=y-2&&mouse.y<=y+21)return SLOTS[i];}return null;}
// tooltip lines: live numbers from current stats, items and spell rank
function spellInfo(k){
 const v=P.lo[k],r=Math.round,ap=AP(),bp=BP(),qm=(1+.3*S.qpow)*ap,ep=(1+.25*S.epow),cd=k==='m'?null:spellCd(k)/(k==='h'?S.aspd:1),L=[];
 const A=S.atk;
 if(v>=4){const sp=SPELLS[k][v],em=EMP(k),base=sp.db==='b'?bp:sp.db==='q'?qm:sp.db==='e'?ep*ap*(1+.06*RK()):ap;
  if(em>1)L.push('EMPOWERED: +60% POWER, -30% COOLDOWN');if(sp.dm)L.push('DAMAGE '+r(A*sp.dm*base*em)+(sp.dx||''));if(sp.x)L.push(sp.x);if(k==='h')L.push('HOLD RMB 0.6S FOR A FULL CHARGE');
  if(sp.dm)L.push('FORMULA  POWER '+r(A)+' X '+sp.dm+' X '+(base*em).toFixed(2));if(k==='m')L.push((1/((LMBRATE[v]||.3)/S.aspd)).toFixed(1)+' CASTS/S');
  L.push((cd?'COOLDOWN '+cd.toFixed(1)+'S   ':'')+'CRIT '+r(S.crit*100)+'%');return L;}
 if(v===3)L.push('RARE SCROLL - LASTS THIS RUN');
 if(k==='m'&&v===3){const rate=(1/(.38/S.aspd)).toFixed(1);L.push('DAMAGE '+r(A*.9*bp)+' X '+(3+S.wave)+' SEEKERS, PIERCE '+(2+S.pierce),rate+' CASTS/S','FORMULA  POWER '+r(A)+' X 0.9 X RANK '+bp.toFixed(2));}
 else if(k==='h'&&v===3)L.push('SLASH '+r(A*2.2*bp)+' + WAVE '+r(A*1.6*bp)+' PIERCES ALL','BOTH CUT ENEMY SHOTS');
 else if(k==='q'&&v===3)L.push('SMITES '+(5+Math.floor(RK()/4))+' FOES FOR '+r(A*3.6*qm)+' EACH','SPLASH 50%. STUNS 1S. SHOCKS','FORMULA  POWER '+r(A)+' X 3.6 X '+qm.toFixed(2));
 else if(k==='w'&&v===3)L.push('INVULNERABLE '+(2.5*(1+.05*RK())).toFixed(1)+'S. HEALS '+r(S.maxhp*.2)+' HP','BLAST '+r(A*2*ap)+', CLEARS NEARBY SHOTS');
 else if(k==='f'&&v===3)L.push('PULLS FOES + BOSSES 3.2S, EATS SHOTS','THEN '+r(A*6*ap)+' DAMAGE IN RADIUS '+r(105*AZ()));
 else if(k==='e'&&v===3)L.push((14+Math.floor(RK()/2))+' METEORS OF '+r(A*3.2*ep*AP())+' OVER 3S','FORMULA  POWER '+r(A)+' X 3.2 X '+(ep*AP()).toFixed(2));
 else if(k==='m'){const rate=(1/((v===0?.3:.5)/S.aspd)).toFixed(1);
  if(v===0)L.push('DAMAGE '+r(A*bp*(S.wave?.8:1))+' X '+(1+S.wave)+' BOLTS','POSTURE '+r(8+A*.3)+'  '+rate+' CASTS/S');
  else if(v===1)L.push('DAMAGE '+r(A*.45*bp)+' X '+(4+S.wave*2)+' SHARDS',rate+' CASTS/S');
  else L.push('DAMAGE '+r(A*1.15*bp)+' X '+(1+S.wave)+' WISPS',rate+' CASTS/S');
  L.push('FORMULA  POWER '+r(A)+' X '+[1,.45,1.15][v]+' X RANK '+bp.toFixed(2));}
 else if(k==='h'){const m=[1.5,2,1.4][v];L.push('DAMAGE '+r(A*m*bp)+(v===1?'  PIERCES ALL':v===2?'  PIERCES '+(3+S.pierce):'  POSTURE 26'),'FORMULA  POWER '+r(A)+' X '+m+' X RANK '+bp.toFixed(2));}
 else if(k==='q'){const m=[2.4,2,1.6][v];
  L.push(v===0?'DAMAGE '+r(A*m*qm)+' TO '+(3+(S.shock?1:0)+Math.floor(RK()/3)+1)+' FOES (-12% EACH JUMP)':v===1?'DAMAGE '+r(A*m*qm)+' IN A CONE. BURNS':'DAMAGE '+r(A*m*qm)+' BLAST ON ARRIVAL. BURNS');
  L.push('FORMULA  POWER '+r(A)+' X '+m+' X '+qm.toFixed(2));}
 else if(k==='w'){
  if(v===0)L.push('LASTS '+(S.wardDur*(1+.05*RK())).toFixed(1)+'S. REFLECTS 6 SHOTS AT 60% + '+r(A*.8));
  else if(v===1)L.push('HEALS '+r(S.maxhp*(.25+.05*(R.inv.parry||0)+.015*RK()))+' HP OVER 3S. +30% SPEED');
  else L.push('DAMAGE '+r(A*.3*ap)+' EVERY 0.35S FOR 4S','SLOWS 65% AND CHILLS');}
 else if(k==='f'){
  if(v===0)L.push('DAMAGE '+r(A*1.6*ap)+' IN RADIUS '+r(66*AZ()),'APPLIES 3 CHILL = FREEZE');
  else if(v===1)L.push('PULLS FOR 2.2S, THEN '+r(A*3.2*ap)+' DAMAGE','FORMULA  POWER '+r(A)+' X 3.2 X '+ap.toFixed(2));
  else L.push('ZAPS '+r(A*1.3*ap)+' EVERY 0.45S FOR 6S','ABOUT '+r(A*1.3*ap*13)+' TOTAL. SHOCKS');}
 else{
  if(v===0)L.push('DAMAGE '+r(A*7*ep*ap)+' AFTER 0.9S','FORMULA  POWER '+r(A)+' X 7 X '+(ep*ap).toFixed(2));
  else L.push(...(v===1?[r(4*ep*(1+.06*RK())/.12*6)+' BOLTS OF '+r(A*.65*ep*ap)+' OVER '+(4*ep*(1+.06*RK())).toFixed(1)+'S']:['FREEZES ALL FOES '+(3.5*(1+.15*S.epow)).toFixed(1)+'S','FROZEN FOES TAKE +40% DAMAGE']));
  L.push('KILLS CUT THE COOLDOWN');}
 L.push((cd?'COOLDOWN '+cd.toFixed(1)+'S   ':'')+'CRIT '+r(S.crit*100)+'%');
 return L;
}
function drawTooltip(){
 const k=hoverSlot();if(!k)return;const sp=SPELLS[k][P.lo[k]],L=[SLOTKEY[k]+'  '+sp.n,sp.d,...spellInfo(k)];
 if(RK()>0&&k!=='m'&&k!=='h')L.push('RANK '+(RK()+1)+': +'+Math.round(RK()*10)+'% POWER  -'+RK()*2+'% CD');
 if(k==='m')L.push('FROM YOUR WEAPON: '+(R.eq.wpn?R.eq.wpn.name:'NONE'),'NEW WEAPON TYPES CHANGE THIS ATTACK');
 else{for(const e of R.ench||[]){const E=ENCH.find(x=>x.k===e);L.push({s:'ENCHANT '+fxLabel(E.n,E.tier)+': '+E.d.replace('ABILITY HITS ',''),c:E.c});}
  const ad=R.addon&&R.addon[k];if(ad)for(const a of ADDONS)if(ad[a.k])L.push({s:'SCROLL '+fxLabel(a.n,a.tier),c:a.c});}
 const S2=s=>typeof s==='string'?s:s.s,w=Math.max(...L.map(s=>txtW(S2(s))))+8,h=L.length*8+4,x=Math.max(2,W-2-w),y=H-34-h;
 ctx.fillStyle='rgba(8,6,12,.92)';ctx.fillRect(x,y,w,h);ctx.fillStyle=sp.c;ctx.fillRect(x,y,w,1);ctx.fillRect(x,y+h-1,w,1);
 L.forEach((s,i)=>txt(S2(s),x+4,y+3+i*8,typeof s==='object'?s.c:i===0?sp.c:i===1?'#fff':'#bbb',1,false));
}
function drawHUD(){
 syncLMB();
 bar(6,6,90,8,P.hp/S.maxhp,'#c22','#3a1010');txt(Math.ceil(P.hp)+'/'+S.maxhp,9,8,'#fff');
 bar(6,17,90,5,P.pos/S.maxpos,P.stag>0?'#f84':'#fd4','#3a3010');
 txt('C POTION '+R.pots+'/'+POTMAX,6,26,R.pots?'#50e060':'#666');txt('REZ '+P.rez,76,26,'#fd4');
 {let gx=7;for(const s of ['wpn','arm','ring']){const g=R.eq[s];drawItemIcon(g,gx,48);gx+=18;}txt('TAB '+R.pack.length+'/'+PACKMAX,gx,53,R.pack.length>=PACKMAX?'#f66':'#888');}
 txt('GOLD '+R.sen,6,34,'#fc4');if(P.oocRun)txt('SWIFT',60,34,Math.floor(time*4)%2?'#8cf':'#cef');
 if(R.curse)txt('CURSED X'+R.curse+': +'+25*R.curse+'% HURT +'+30*R.curse+'% DMG',6,42,'#c6f');
 // spell bar: LMB / RMB attacks, Q E F abilities, R ultimate
 [...SLOTS].forEach((k,i)=>{
  const sp=SPELLS[k][P.lo[k]],x=slotX(i),y=SLOTY(),cd=slotCd(k);
  const mx=k==='m'?.5:k==='h'?spellCd('h'):spellCd(k)+(k==='w'&&P.lo.w===0?S.wardDur:0),ready=cd<=0;
  if(P.lock&&P.lock[k]){ctx.fillStyle='#000';ctx.fillRect(x-1,y-1,15,15);ctx.fillStyle='#333';ctx.fillRect(x,y,13,13);ctx.fillStyle='#14101a';ctx.fillRect(x+1,y+1,11,11);ctx.fillStyle='#888';ctx.fillRect(x+4,y+6,5,4);ctx.fillRect(x+5,y+3,1,3);ctx.fillRect(x+7,y+3,1,3);ctx.fillRect(x+5,y+2,3,1);txt(SLOTKEY[k],x+6-Math.round(txtW(SLOTKEY[k])/2),y+15,'#555');return;}
  // the slot shows a picture of what the ability does (lightning, flames, venom, shields...)
  spellBox(x,y,sp,ready);if(sp.rare||(P.emp&&P.emp[k])){ctx.fillStyle=Math.floor(time*3+i)%2?'#ffe060':'#fff';ctx.fillRect(x-2,y-2,2,2);ctx.fillRect(x+13,y-2,2,2);ctx.fillRect(x-2,y+13,2,2);ctx.fillRect(x+13,y+13,2,2);}
  if(!ready&&i>0){ctx.fillStyle='rgba(0,0,0,.55)';ctx.fillRect(x+1,y+1,11,Math.round(11*Math.min(1,cd/mx)));if(i>1)txt(Math.ceil(cd),x+(cd>=10?2:5),y+4,'#fff');}
  if(k==='e'&&ready){ctx.fillStyle=Math.floor(time*4)%2?'#fd4':'#fff';ctx.fillRect(x-1,y-3,15,1);}
  if(i===2){ctx.fillStyle='#555';ctx.fillRect(x-4,y,1,13);}
  txt(SLOTKEY[k],x+6-Math.round(txtW(SLOTKEY[k])/2),y+15,ready?'#ccc':'#777');
  // scroll add-ons on this slot: one coloured pip each
  {const ad=R.addon&&R.addon[k];if(ad){let dx=0;for(const a of ADDONS){if(!ad[a.k])continue;ctx.fillStyle=a.c;ctx.fillRect(x+dx,y+22,2,2);dx+=3;}}}
 });
 // enchants (they power every ability, not the LMB)
 if(R.ench&&R.ench.length){const x0=slotX(5)+13-R.ench.length*14;txt('ENCH',x0-19,H-42,'#888');R.ench.forEach((k,i)=>ctx.drawImage(itemIcon({t:'ench',k}),x0+i*14,H-46));}
 if(RK()>0)txt('RANK '+(RK()+1),slotX(0),H-37,'#fd4');
 // hit combo: grows with every hit, pops on each new hit, fades 2s after the last one
 {const age=time-(R.comboAt||-9);if(R.combo>=5&&age<2){const pop=age<.1?2:1,s=R.combo+' HITS',c=R.combo>=100?'#ff5050':R.combo>=50?'#ffd040':R.combo>=25?'#f84':'#fff';
  ctx.globalAlpha=Math.min(1,(2-age)*2);txt(s,W-6-txtW(s,pop),H/2-20,c,pop);ctx.fillStyle=c;ctx.fillRect(W-6-40,H/2-20+(pop===2?12:7),Math.round(40*(1-age/2)),1);ctx.globalAlpha=1;}}
 if(P.storm>0)ctxt('STORM '+P.storm.toFixed(1),H-52,'#ff8a30');
 if(freezeT>0)ctxt('TIME STOPPED '+freezeT.toFixed(1),H-52,'#8cf');
 const nm=R.training?'TRAINING GROUNDS':ROMAN[R.di]+'. '+DUN[R.di].name;txt(nm,Math.round((W-txtW(nm))/2),4,'#ddd');
 {const ids=Object.keys(R.inv),lim=(boss&&boss.awake&&!boss.dead)?44:222;let ix=6,shown=0;for(const id of ids){if(ix>lim)break;const it=ITEMBY[id];iconBox(ix,H-14,it.g,RCOL[it.r]);if(R.inv[id]>1)txt(R.inv[id],ix+6,H-6,'#fff');ix+=13;shown++;}if(shown<ids.length)txt('+'+(ids.length-shown),ix,H-12,'#aaa');}
 if(P.hCh>0){const k=Math.min(1,P.hCh/HCHARGE);ctx.fillStyle='#14101a';ctx.fillRect(Math.round(W/2-9),H/2+17,18,3);ctx.fillStyle=k>=1?(Math.floor(time*12)%2?'#fff':'#fd4'):'#a89ab8';ctx.fillRect(Math.round(W/2-8),H/2+18,Math.round(16*k),1);}
 if(P.dashCd>0){ctx.fillStyle='#fff';ctx.fillRect(Math.round(W/2-8),H/2+14,Math.round(16*(1-P.dashCd/S.dashCd)),1);}
 if(boss&&boss.awake&&!boss.dead){const w=150,x=Math.round((W-w)/2)-20;txt(boss.name,x+Math.round((w-txtW(boss.name))/2),H-30,'#f77');bar(x,H-22,w,6,boss.hp/boss.maxhp,'#c22','#3a1010');bar(x,H-14,w,3,boss.posture/boss.maxPosture,'#fd4','#3a3010');}
 if(portal&&!portal.pending){const X=sx(portal.x,portal.y),Y=sy(portal.x,portal.y)-20;if(X<8||X>W-8||Y<8||Y>H-8){const a=Math.atan2(Y-H/2,X-W/2),ex=W/2+Math.cos(a)*Math.min(W/2-14,Math.abs((H/2-14)/(Math.sin(a)||1e-3))),ey=H/2+Math.sin(a)*Math.min(H/2-14,Math.abs((W/2-14)/(Math.cos(a)||1e-3)));const cx=clamp(ex,12,W-12),cy=clamp(ey,12,H-12),bl=Math.floor(time*4)%2;
  ctx.fillStyle='#14101a';ctx.fillRect(cx-4,cy-4,9,9);ctx.fillStyle=bl?'#8cf':'#fff';ctx.fillRect(cx-3,cy-3,7,7);ctx.fillStyle='#14101a';ctx.fillRect(Math.round(cx+Math.cos(a)*2),Math.round(cy+Math.sin(a)*2),2,2);txt('PORTAL',clamp(cx-11,2,W-26),clamp(cy+7,2,H-8),'#8cf');}}
 for(const k of pickups){if(k.k!=='bag'||k.tier!==4||k.dead||k.opened)continue;const X=sx(k.x,k.y),Y=sy(k.x,k.y)-8;if(X>=8&&X<=W-8&&Y>=8&&Y<=H-8)continue;
  const a=Math.atan2(Y-H/2,X-W/2),ex=W/2+Math.cos(a)*Math.min(W/2-14,Math.abs((H/2-14)/(Math.sin(a)||1e-3))),ey=H/2+Math.sin(a)*Math.min(H/2-14,Math.abs((W/2-14)/(Math.cos(a)||1e-3)));
  const cx=Math.round(clamp(ex,12,W-12)),cy=Math.round(clamp(ey,12,H-12)),bl=Math.floor(time*5)%2;
  ctx.fillStyle='#14101a';ctx.fillRect(cx-4,cy-4,9,9);ctx.fillStyle=bl?'#ffd040':'#fff';ctx.fillRect(cx-3,cy-3,7,7);ctx.fillStyle='#14101a';ctx.fillRect(Math.round(cx+Math.cos(a)*2),Math.round(cy+Math.sin(a)*2),2,2);txt('RARE',clamp(cx-8,2,W-18),clamp(cy+7,2,H-8),'#ffd040');}
 const nb=nearBag(),np=nearProp();
 if(nb)drawBagPanel(nb);
 else if(portal&&!portal.pending&&dist(portal,P)<20)ctxt(R.di>=9?'G: STEP THROUGH TO FREEDOM':'G: ENTER THE PORTAL',H-44,Math.floor(time*3)%2?'#8cf':'#fff');
 else if(np){const s=np.k==='pedestal'?'G: BUY '+np.name+' - '+np.price+' GOLD':np.k==='chest'?'G: OPEN CHEST':np.k==='spring'?'G: DRINK FROM THE SPRING':np.k==='gong'?'G: STRIKE THE GONG - CHALLENGE FOR A RARE BAG':np.curse?'G: ACCEPT THE CURSE':'G: PRAY AT THE SHRINE';ctxt(s,H-44,'#fff');
  // the curse altar spells out exactly what you are agreeing to
  if(np.curse){const w=196,h=CURSE_INFO.length*9+18,x=Math.round((W-w)/2),y=H-50-h;ctx.fillStyle='rgba(20,8,12,.94)';ctx.fillRect(x,y,w,h);ctx.fillStyle='#f33';ctx.fillRect(x,y,w,1);ctx.fillRect(x,y+h-1,w,1);
   txt('CURSED ALTAR',x+4,y+4,'#f33');{const s2='YOU CARRY '+(R.curse||0);txt(s2,x+w-4-txtW(s2),y+4,'#c6f');}CURSE_INFO.forEach((l,i)=>txt(l.s,x+4,y+14+i*9,l.c));}if(np.k==='pedestal'&&np.item){const it=ITEMBY[np.item];ctxt(FXNAME[fxStyle(it.id)]+' '+ROM[it.r]+': '+it.d,H-36,fxCol(it.id));}}
 drawMinimap();
 if(toast.t>0){ctx.globalAlpha=Math.min(1,toast.t);ctxt(toast.s,24,toast.c,1);ctx.globalAlpha=1;}
 if(P.hp<S.maxhp*.3){ctx.fillStyle='rgba(180,0,0,'+(.12+.06*Math.sin(time*6))+')';ctx.fillRect(0,0,W,H);}
}
function drawWall(o){
 // faces and position come from the wall's place in the rotated grid (camera angle)
 const tx=o.tx,ty=o.ty,[tu,tv]=tileR(tx,ty),mask=(floorAtR(tu,tv+1)?1:0)|(floorAtR(tu+1,tv)?2:0);
 ctx.drawImage(mapCanvas.walls[mask*2+(hash(tx,ty)<.5?0:1)],(tu-tv+RMH)*T-cam.x-16,(tu+tv)*HY-cam.y-WH);
}
// animated shimmer, ripples and bubbles on top of the baked liquid tiles
function drawLiquids(){
 const L=map.env.lc,lq0=map.env.liq;
 for(const i of map.liqList){
  const tx=i%MW,ty=(i/MW)|0,[tu,tv]=tileR(tx,ty),X=(tu-tv+RMH)*16-cam.x,Y=(tu+tv)*HY-cam.y;if(X<-20||X>W+20||Y<-20||Y>H+4)continue;
  const h=hash(tx,ty),ph=time*(lq0===2?1.6:1.1)+h*TAU,s=Math.sin(ph);
  if(lq0===4){if(s>.96){ctx.fillStyle='#fff';ctx.fillRect(X-4+((h*9)|0),Y+6,1,1);}continue;}
  ctx.fillStyle=L[2];ctx.globalAlpha=lq0===2?.55:.35;
  const ox=Math.round(Math.sin(ph*.7)*3);ctx.fillRect(X-5+ox,Y+7+((h*3)|0),4+((s+1)*1.5|0),1);
  if(h>.6){ctx.fillRect(X+2-ox,Y+10,3,1);}
  ctx.globalAlpha=1;
  if((lq0===2||lq0===3)&&s>.92){ctx.fillStyle=L[2];ctx.fillRect(X-1+((h*7)|0)%5,Y+5-((s-.92)*40|0),1,1);}
 }
}
// red screen edges when hurt / low on health
function vignette(col,a){ctx.fillStyle=col;for(let i=0;i<10;i++){ctx.globalAlpha=a*(1-i/10)*.55;ctx.fillRect(0,i*2,W,2);ctx.fillRect(0,H-2-i*2,W,2);ctx.fillRect(i*3,0,3,H);ctx.fillRect(W-3-i*3,0,3,H);}ctx.globalAlpha=1;}
// boss name card with letterbox bars while the camera pans to the boss
function drawIntro(){const el=INTRO-introT,bar=Math.round(22*Math.min(1,el/.3,introT/.3));ctx.fillStyle='#000';ctx.fillRect(0,0,W,bar);ctx.fillRect(0,H-bar,W,bar);
 if(el>.4&&introT>.3){const a=Math.min(1,(el-.4)/.3,(introT-.3)/.3);ctx.globalAlpha=a;const nm=introE.name,sc=txtW(nm,2)>W-20?1:2;
  ctx.fillStyle='rgba(0,0,0,.55)';ctx.fillRect(0,H/2+18,W,30);txt(nm,Math.round((W-txtW(nm,sc))/2),H/2+22,'#f55',sc);
  const sub=ROMAN[R.di]+'. '+DUN[R.di].name+' - GUARDIAN';txt(sub,Math.round((W-txtW(sub))/2),H/2+38,'#ccc');
  const lw=Math.round(Math.min(1,(el-.4)/.5)*120);ctx.fillStyle='#d02030';ctx.fillRect(W/2-lw,H/2+33,lw*2,1);ctx.globalAlpha=1;}}
function renderPlay(){
 ctx.fillStyle='#07060a';ctx.fillRect(0,0,W,H);
 // screen shake is almost gone (at most a 1px nudge on the very biggest moments); power comes from recoil, bursts and freeze-frames instead
 const sk=shake>=10?1:0,shx=sk?Math.round(rnd(-1,1)):0,shy=0;
 let fcx=P.x,fcy=P.y;if(introT>0&&introE){const el=INTRO-introT,f=Math.min(1,el/.5,introT/.5),k=f*f*(3-2*f);fcx=P.x+(introE.x-P.x)*k;fcy=P.y+(introE.y-P.y)*k;}
 cam.x=Math.round(isoX(fcx,fcy)-W/2+shx);cam.y=Math.round(isoY(fcx,fcy)-(H/2+6)+shy);
 const M=mapCanvas;
 {const x0=Math.max(0,cam.x),y0=Math.max(0,cam.y),x1=Math.min(M.FW,cam.x+W),y1=Math.min(M.FH,cam.y+H);if(x1>x0&&y1>y0)ctx.drawImage(M.floor,x0,y0,x1-x0,y1-y0,x0-cam.x,y0-cam.y,x1-x0,y1-y0);}
 drawLiquids();
 drawGround();
 const dr=[],ptx=P.x/T|0,pty=P.y/T|0;
 for(let ty=Math.max(0,pty-15);ty<=Math.min(MH-1,pty+15);ty++)for(let tx=Math.max(0,ptx-15);tx<=Math.min(MW-1,ptx+15);tx++){const i=ty*MW+tx;if(map.t[i]||!map.vis[i])continue;const [tu,tv]=tileR(tx,ty);dr.push({d:(tu+tv+1)*T,wall:1,tx,ty});}
 // draw order follows depth in the rotated view, so walls and sprites overlap correctly at every camera angle
 for(const e of enemies){if(e.dead)continue;const X=sx(e.x,e.y),Y=sy(e.x,e.y);if(X<-60||X>W+60||Y<-80||Y>H+70)continue;dr.push({d:dep(e.x,e.y),e});}
 for(const k of pickups)dr.push({d:dep(k.x,k.y)-3,k});
 for(const p of props)dr.push({d:dep(p.x,p.y),p});
 for(const o of decos){const X=sx(o.x,o.y),Y=sy(o.x,o.y);if(X<-40||X>W+40||Y<-10||Y>H+50)continue;dr.push({d:dep(o.x,o.y)-((DECOSPR[o.k].flat||o.onliq)?60:0),dc:o});}
 dr.push({d:dep(P.x,P.y),pl:1});
 dr.sort((a,b)=>a.d-b.d);
 for(const o of dr){if(o.wall)drawWall(o);else if(o.e)drawEnemy(o.e);else if(o.k)drawPickup(o.k);else if(o.p)drawProp(o.p);else if(o.dc)drawDeco(o.dc);else drawPlayer();}
 drawPortal();
 for(const q of projs)drawProj(q);
 // the hitbox core is always drawn on top of everything: only this dot can be hit by bullets
 // only shown when it matters: while focusing (SHIFT), or fading in as enemy bullets get close
 if(P.hp>0){let near=99;for(const q of projs)if(q.from==='e'){const d=scrDist(q)-q.r;if(d<near)near=d;}
  const a=P.focus?1:clamp((40-near)/25,0,1);
  if(a>0){const X=sx(P.x,P.y),Y=sy(P.x,P.y)-7;ctx.globalAlpha=a;
   if(P.focus){ctx.globalAlpha=.5;circ(X,Y,12,'#cef');ctx.globalAlpha=a;}
   ctx.fillStyle='#14101a';ctx.fillRect(X-2,Y-2,5,5);ctx.fillStyle='#fff';ctx.fillRect(X-1,Y-1,3,3);ctx.fillStyle=P.focus?'#f44':'#ff8080';ctx.fillRect(X,Y,1,1);ctx.globalAlpha=1;}}
 if(slowT>0){ctx.fillStyle='rgba(160,220,255,.08)';ctx.fillRect(0,0,W,H);}
 for(const f of fx)drawFx(f);
 for(const q of particles){ctx.fillStyle=q.col;ctx.fillRect(sx(q.x,q.y),sy(q.x,q.y)-8,1,1);}
 drawAmbient();
 for(const t of texts){ctx.globalAlpha=Math.min(1,t.t*2);txt(t.s,sx(t.x,t.y)-Math.round(txtW(t.s,t.sc)/2),sy(t.x,t.y)-24-(t.sc>1?4:0)-(.9-t.t)*14|0,t.col,t.sc);ctx.globalAlpha=1;}
 if(freezeT>0){ctx.fillStyle='rgba(120,160,255,.14)';ctx.fillRect(0,0,W,H);}
 if(flashT>0){ctx.globalAlpha=Math.min(.35,flashT*3);ctx.fillStyle=flashCol;ctx.fillRect(0,0,W,H);ctx.globalAlpha=1;}
 {const low=P.hp<S.maxhp*.25?.18+lowPulse*.9:0,a=Math.max(hurtT*1.1,low);if(a>0)vignette('#c01010',Math.min(.6,a));}
 if(introT>0&&introE)drawIntro();
 drawRoomEvents();if(R.training)drawTraining();drawHUD();if(invOpen)drawInv();else if(!paused)drawTooltip();
 if(paused){panel(10,6,W-20,H-12,'PAUSED - ESC TO RESUME');
  [['MOVE','WASD','AIM','MOUSE','DASH','SPACE','SHIFT','FOCUS'],['ATTACK','LMB RMB','ABILITY','Q E F','ULT','R','HEAL','C'],['INTERACT','G','BAG ITEM','1-6','PACK','TAB','SWAP WPN','X']].forEach((row,i)=>{for(let j=0;j<4;j++){const x=18+j*74;txt(row[j*2],x,24+i*9,'#888');txt(row[j*2+1],x+34,24+i*9,'#ddd');}});
  sep(16,54,W-32);txt('STATS',20,60,'#d02030');txt('PERMANENT, MAX '+STATMAX,48,60,'#666');
  STATS.forEach((s,i)=>{const b=meta.stats[s.k],r=S.st[s.k]-b;txt(s.n,20,70+i*9,b>=STATMAX?'#fd4':s.c);txt(b+(r?' +'+r:''),82,70+i*9,'#ddd');});
  txt('POWER '+Math.round(S.atk),20,128,'#ddd');txt('HP '+S.maxhp,20,137,'#ddd');txt('DEF '+S.def,20,146,'#ddd');txt('CRIT '+Math.round(S.crit*100)+'%',70,128,'#ddd');txt('CD -'+Math.round((1-S.cdr)*100)+'%',70,137,'#ddd');txt('DODGE '+Math.round(S.dodge*100)+'%',70,146,'#ddd');
  txt('GEAR',130,60,'#d02030');['wpn','arm','ring'].forEach((s,i)=>{const g=R.eq[s],y=70+i*22;drawItemIcon(g,130,y);txt(g?g.name.slice(0,30):'NO '+SLOTNAME[s],148,y+1,g?itemCol(g):'#666');if(g)txt(gearLines(g).slice(0,2).join('  ').slice(0,34),148,y+8,'#888');});
  {const st=P.evo||0;txt('FORM '+(st+1)+'/'+WIZEVO.length+': '+WIZEVO[st].n,130,138,'#ffe060');txt(st<WIZEVO.length-1?'EVOLVES AFTER EACH BOSS':'FINAL FORM',130,146,'#aa9');}
  setLines().slice(0,1).forEach((l,i)=>txt(l.s.slice(0,44),130,154+i*8,l.c));
  ctxt('M MUTE      T IN TEMPLE: TUTORIAL',H-14,'#666');}
}
function bg(){
 const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#10081a');g.addColorStop(.6,'#3a1220');g.addColorStop(1,'#1a0a12');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 disc(240,56,24,'#f0e0b0');disc(246,52,22,'#e0d0a0');ctx.fillStyle='#e8d8a8';
 ctx.fillStyle='#120a14';for(let x=0;x<W;x++){const h=Math.floor(30+14*Math.sin(x*.05)+10*Math.sin(x*.13+1));ctx.fillRect(x,H-h-10,1,h+10);}
 ctx.fillStyle='#8a1a20';ctx.fillRect(60,100,5,60);ctx.fillRect(96,100,5,60);ctx.fillRect(52,96,58,5);ctx.fillRect(56,104,50,3);
 ctx.fillStyle='#0a060c';ctx.fillRect(0,H-12,W,12);
 for(let i=0;i<30;i++){const x=(i*53+time*10)%W,y=(i*37+time*14)%H;ctx.fillStyle='rgba(255,180,200,.5)';ctx.fillRect(Math.round(x),Math.round(y),1,1);}
}
function renderTitle(){
 bg();ctxt('SHINOBI',24,'#d02030',6);ctxt('DUNGEONS',58,'#f0e0b0',3);
 ctxt('TEN DUNGEONS. TEN BOSSES. TWELVE SPELLS.',84,'#aaa');
 if(Math.floor(time*2)%2===0)ctxt('PRESS ENTER OR CLICK',112,'#fff');
 ctxt('WASD MOVE  MOUSE AIM  SPACE DASH  G INTERACT',136,'#888');ctxt('LMB RMB ATTACKS  Q E F ABILITIES  R ULTIMATE',146,'#888');
 ctxt('BREAK POSTURE, THEN PUNISH THE STAGGER',160,'#c88');
}
function renderHub(){
 bg();ctx.fillStyle='rgba(8,4,12,.85)';ctx.fillRect(12,4,296,174);ctx.fillStyle='#d02030';ctx.fillRect(12,4,296,1);ctx.fillRect(12,177,296,1);
 ctxt('DRAGONROT TEMPLE',8,'#d02030',2);
 txt('GOLD '+meta.sen,18,24,'#fc4');{const s='RUNS '+meta.runs+'  WINS '+meta.wins;txt(s,302-txtW(s),24,'#888');}
 txt(meta.ascMax?'ASCENSION '+meta.asc+'/'+meta.ascMax+' (Q/E)':'WIN A RUN TO UNLOCK ASCENSION',18,32,meta.asc?'#f5a':'#666');{const cs=Object.keys(meta.codex.sp).length,cg=Object.keys(meta.codex.gear).length,s='K: CODEX '+(cs+cg)+'/'+(6+RARE.length);txt(s,302-txtW(s),32,'#c9a');}
 sep(16,40,288);
 const row=(i,y,label,right,col)=>{const sel=hubSel===i;if(sel){ctx.fillStyle='rgba(208,32,48,.35)';ctx.fillRect(16,y-2,288,9);}txt((sel?'> ':'  ')+label,18,y,col||'#ddd');if(right)txt(right,302-txtW(right),y,sel?'#fff':'#888');};
 row(0,44,'BEGIN RUN','< '+ROMAN[hubStart]+'. '+DUN[hubStart].name+' >','#fff');
 sep(16,53,288);{const C0=CLS();row(1,56,'CHARACTER',C0.n,C0.col);const sp=heroSpr(C0.k,0);ctx.drawImage(sp.c,0,0,20,24,280,63,20,24);ctx.drawImage(heroSpr(C0.k,9).c,0,0,20,24,258,63,20,24);}
 [...SLOTS].forEach((k,i)=>{const sp=SPELLS[k][CLS().kit[k]];txt((SLOTKEY[k]+'   ').slice(0,4),24,66+i*8,'#888');txt(sp.n,44,66+i*8,sp.c);txt(sp.d.slice(0,32),128,66+i*8,'#777');});
 sep(16,113,288);txt('TEMPLE UPGRADES',18,116,'#d02030');
 UPG.forEach((u,i)=>{const lv=meta.up[u.k],mx=lv>=u.max;row(i+2,125+i*8,(u.name+' '+lv+'/'+u.max+'  '+u.d).slice(0,52),mx?'MAX':upgCost(u)+' GOLD',meta.sen>=upgCost(u)&&!mx?'#ddd':'#666');});
 const tip=hubSel===0&&meta.asc>0?'ASC '+meta.asc+': FOES +'+meta.asc*15+'% HP, FASTER SHOTS. +'+meta.asc*20+'% GOLD':hubSel===0&&hubStart>0?'STARTING DEEPER GRANTS '+hubStart*2+' RANDOM ITEMS':'W/S SELECT  A/D CHANGE  ENTER START  Y TRAINING  T TIPS';
 ctxt(tip,171,'#aaa');
 if(codexOpen)drawCodex();
}
// ---------- character select ----------
// Opens after the title screen and from the temple's CHARACTER row.
let selIdx=0,selFrom='title',selLock=false,selT=0,selMX=-1,selMY=-1;
const SELCARD={w:56,h:64,gap:4,x0:12,y:24};
function openSelect(from){selFrom=from;selIdx=(meta.cls||0)%CLASSES.length;selLock=false;selTab=0;selMX=mouse.x;selMY=mouse.y;mode='select';sfx('pickup');}
// second tab on the select screen: spend sen on permanent temple upgrades between runs
let selTab=0,selUp=0;
const upRowY=i=>36+i*20;
function upRowAt(x,y){for(let i=0;i<UPG.length;i++){const ry=upRowY(i);if(x>=16&&x<=W-16&&y>=ry-3&&y<ry+16)return i;}return -1;}
function renderUpgrades(){
 ctxt('TEMPLE UPGRADES',6,'#d02030',2);{const s='GOLD '+meta.sen;txt(s,W-8-txtW(s),10,'#fc4');}
 if(mouse.x!==selMX||mouse.y!==selMY){const h=upRowAt(mouse.x,mouse.y);if(h>=0)selUp=h;selMX=mouse.x;selMY=mouse.y;}
 UPG.forEach((u,i)=>{const y=upRowY(i),lv=meta.up[u.k],mx=lv>=u.max,cost=upgCost(u),can=!mx&&meta.sen>=cost,sel=i===selUp;
  ctx.fillStyle=sel?'rgba(208,32,48,.3)':'rgba(20,12,26,.85)';ctx.fillRect(16,y-3,W-32,18);if(sel){ctx.fillStyle='#d02030';ctx.fillRect(16,y-3,2,18);}
  txt(u.name,22,y,sel?'#fff':'#ddd');txt(u.d,22,y+8,'#888');
  for(let p=0;p<u.max;p++){ctx.fillStyle=p<lv?'#ffd040':'#3a2e44';ctx.fillRect(120+p*7,y+1,5,5);}
  const s=mx?'MAX':cost+' GOLD';txt(s,W-22-txtW(s),y+4,mx?'#6f6':can?'#fc4':'#666');});
 ctxt('W/S CHOOSE   ENTER OR CLICK BUY   TAB CHARACTERS   ESC BACK',H-7,'#888');}
function upgradesKey(c){
 if(c==='ArrowUp'||c==='KeyW')selUp=(selUp+UPG.length-1)%UPG.length;
 else if(c==='ArrowDown'||c==='KeyS')selUp=(selUp+1)%UPG.length;
 else if(c==='Enter'||c==='Space')buyUpg(UPG[selUp]);
 else if(c==='Escape'||c==='Tab'){selTab=0;sfx('coin');}}
function selCardAt(x,y){const c=SELCARD;for(let i=0;i<CLASSES.length;i++){const cx=c.x0+i*(c.w+c.gap);if(x>=cx&&x<cx+c.w&&y>=c.y-3&&y<c.y+c.h)return i;}return -1;}
const isLocked=i=>i>=(meta.unlocked||2);
const runsToUnlock=i=>i-(meta.unlocked||2)+1;
// dark silhouette of a sprite sheet, for characters you have not unlocked yet
const SILC={};
function silOf(sp,k){return SILC[k]||(SILC[k]=mk(sp.c.width,sp.c.height,g=>{g.drawImage(sp.c,0,0);g.globalCompositeOperation='source-in';g.fillStyle='#07040a';g.fillRect(0,0,sp.c.width,sp.c.height);}));}
function padlock(x,y,col){ctx.fillStyle='#14101a';ctx.fillRect(x-1,y-1,9,11);ctx.fillStyle=col;ctx.fillRect(x+1,y,5,1);ctx.fillRect(x+1,y,1,4);ctx.fillRect(x+5,y,1,4);ctx.fillRect(x,y+4,7,5);ctx.fillStyle='#14101a';ctx.fillRect(x+3,y+5,1,2);}
function selConfirm(){if(selLock)return;if(isLocked(selIdx)){sfx('block');return;}selLock=true;selT=time;meta.cls=selIdx;saveMeta();sfx('pickup');
 setTimeout(()=>{if(mode==='select'){mode='hub';hubSel=0;selLock=false;}},600);}
function selectKey(c){
 if(selLock)return;
 if(selTab===1){upgradesKey(c);return;}
 if(c==='Tab'){selTab=1;sfx('coin');return;}
 if(c==='ArrowLeft'||c==='KeyA'){selIdx=(selIdx+CLASSES.length-1)%CLASSES.length;sfx('coin');}
 else if(c==='ArrowRight'||c==='KeyD'){selIdx=(selIdx+1)%CLASSES.length;sfx('coin');}
 else if(/^Digit[1-9]$/.test(c)){const i=+c.slice(5)-1;if(i<CLASSES.length&&i!==selIdx){selIdx=i;sfx('coin');}}
 else if(c==='Enter'||c==='Space')selConfirm();
 else if(c==='Escape')mode=selFrom==='hub'?'hub':'title';
}
function selClick(){if(selTab===1){const r=upRowAt(mouse.x,mouse.y);if(r>=0){selUp=r;buyUpg(UPG[r]);}return;}
 const h=selCardAt(mouse.x,mouse.y);if(h<0)return;if(h!==selIdx){selIdx=h;sfx('coin');}selConfirm();}
function renderSelect(){
 bg();ctx.fillStyle='rgba(8,4,12,.78)';ctx.fillRect(0,0,W,H);
 if(selTab===1){renderUpgrades();return;}
 // hovering a card selects it (only when the mouse actually moves, so keys still win)
 if(!selLock&&(mouse.x!==selMX||mouse.y!==selMY)){const h=selCardAt(mouse.x,mouse.y);if(h>=0&&h!==selIdx){selIdx=h;sfx('coin');}selMX=mouse.x;selMY=mouse.y;}
 ctxt('CHOOSE YOUR CHARACTER',6,'#d02030',2);
 {const s=Math.min(meta.unlocked||2,CLASSES.length)+'/'+CLASSES.length;txt(s,312-txtW(s),10,'#666');}
 const c=SELCARD,flash=selLock?clamp(1-(time-selT)/.45,0,1):0;
 CLASSES.forEach((C,i)=>{
  const sel=i===selIdx,lk=isLocked(i),col=lk?'#5a5064':C.col,x=c.x0+i*(c.w+c.gap),y=c.y-(sel?3:0),sp=heroSpr(C.k,0);
  ctx.fillStyle=sel?(lk?'#1c1622':'#2a1a30'):(lk?'#0c080e':'#140c18');ctx.fillRect(x,y,c.w,c.h);
  if(sel&&!lk){ctx.fillStyle=C.col;for(let k=0;k<4;k++){ctx.globalAlpha=.05+k*.04;ctx.fillRect(x+1,y+c.h-1-(4-k)*8,c.w-2,8);}ctx.globalAlpha=1;}
  ctx.fillStyle=sel?col:'#3a2e44';ctx.fillRect(x,y,c.w,1);ctx.fillRect(x,y+c.h-1,c.w,1);ctx.fillRect(x,y,1,c.h);ctx.fillRect(x+c.w-1,y,1,c.h);
  if(sel){ctx.fillRect(x,y,c.w,3);if(Math.floor(time*3)%2===0){txt('>',x-5,y+28,col);txt('<',x+c.w+2,y+28,col);}}
  txt(String(i+1),x+3,y+5,sel?'#fff':'#555');
  shadow(x+c.w/2,y+52,sel?20:16);
  const fr=sel&&!lk?WIZ.walk[Math.floor(time*8)%4]:WIZ.idle[Math.floor(time*2.5+i)%2];
  const dx=Math.round(x+c.w/2-sp.fw),dy=y+6;
  if(lk){
   // locked: a dark silhouette with a rim of light and a padlock
   ctx.globalAlpha=sel?.55:.3;ctx.drawImage(sp.wc,fr*sp.fw,0,sp.fw,sp.fh,dx-1,dy,sp.fw*2,sp.fh*2);ctx.drawImage(sp.wc,fr*sp.fw,0,sp.fw,sp.fh,dx+1,dy,sp.fw*2,sp.fh*2);
   ctx.globalAlpha=1;ctx.drawImage(silOf(sp,C.k),fr*sp.fw,0,sp.fw,sp.fh,dx,dy,sp.fw*2,sp.fh*2);
   padlock(x+c.w/2-3,y+24,sel?'#e0c070':'#8a7a50');
   ctxt2('???',x,c.w,y+c.h-9,sel?'#aaa':'#555');
  }else{
   if(!sel)ctx.globalAlpha=.5;
   ctx.drawImage(sp.c,fr*sp.fw,0,sp.fw,sp.fh,dx,dy,sp.fw*2,sp.fh*2);
   if(sel&&flash>0){ctx.globalAlpha=flash;ctx.drawImage(sp.wc,fr*sp.fw,0,sp.fw,sp.fh,dx,dy,sp.fw*2,sp.fh*2);}
   ctx.globalAlpha=1;
   ctxt2(C.n,x,c.w,y+c.h-9,sel?C.col:'#777');
  }
 });
 // detail panel for the highlighted character
 const C=CLASSES[selIdx],py=96;
 ctx.fillStyle='rgba(20,12,26,.92)';ctx.fillRect(8,py-5,304,78);
 if(isLocked(selIdx)){
  ctx.fillStyle='#5a5064';ctx.fillRect(8,py-5,304,1);
  padlock(16,py+1,'#e0c070');txt('LOCKED',28,py,'#aaa',2);
  const n=runsToUnlock(selIdx);
  txt('FINISH '+n+' MORE RUN'+(n>1?'S':'')+' TO UNLOCK THIS CHARACTER.',16,py+18,'#ddd');
  txt('A NEW CHARACTER JOINS AFTER EVERY RUN, WIN OR LOSE.',16,py+30,'#888');
  txt('TRAINING DOES NOT COUNT.',16,py+40,'#666');
  ctx.globalAlpha=.6;const m=heroSpr(C.k,9);ctx.drawImage(silOf(m,C.k+'9'),WIZ.idle[Math.floor(time*2.5)%2]*m.fw,0,m.fw,m.fh,252,py+20,m.fw*2,m.fh*2);ctx.globalAlpha=1;
  ctxt('THIS CHARACTER IS LOCKED',H-7,'#a66');
  return;
 }
 ctx.fillStyle=C.col;ctx.fillRect(8,py-5,304,1);
 txt(C.n,16,py,C.col,2);
 {const s='MASTERS INTO '+heroEV(C.k,9).n;txt(s,304-txtW(s),py+3,'#888');}
 txt(C.d,16,py+14,'#ddd');
 const ST=[['HEALTH',(C.hp-.7)/.7],['SPEED',(C.spd-.9)/.3],['DASH',(1.3-C.dash)/.7],['DEFENSE',(C.def+.5)/4],['POWER',((C.pw||1)-.8)/.5]];
 ST.forEach(([n,f],i)=>{const y=py+26+i*9;txt(n,16,y,'#aaa');bar(56,y,62,4,f,C.col,'#2a2030');});
 txt('STARTS WITH T0 '+WSIG[C.k]+'  SIGNATURE: +25% LMB',16,py+70,'#e0b040');
 txt('STARTING KIT',132,py+24,'#d02030');
 [...SLOTS].forEach((k,i)=>{const s=SPELLS[k][C.kit[k]],y=py+33+i*7;txt(SLOTKEY[k],132,y,'#777');txt(s.n,150,y,s.c);});
 // the fully evolved form, so you can see where the class ends up
 const m=heroSpr(C.k,9);shadow(272,py+66,18);
 ctx.drawImage(m.c,WIZ.idle[Math.floor(time*2.5)%2]*m.fw,0,m.fw,m.fh,252,py+20,m.fw*2,m.fh*2);
 ctxt(selLock?'READY':'A/D CHOOSE   ENTER CONFIRM   TAB UPGRADES ('+meta.sen+' GOLD)   ESC BACK',H-7,selLock?'#fff':'#888');
}
// ---- codex: every rare spell scroll and rare gear piece you have ever found ----
let codexOpen=false;
function drawCodex(){ctx.fillStyle='#06040a';ctx.fillRect(14,6,292,172);ctxt('CODEX',10,'#c9a',2);
 txt('RARE SPELLS',22,30,'#d02030');[...SLOTS].forEach((k,i)=>{const sp=SPELLS[k][3],f=meta.codex.sp[k];txt((SLOTKEY[k]+'   ').slice(0,4)+(f?sp.n:'? ? ?'),22,40+i*8,f?sp.c:'#555');if(f)txt(sp.d.slice(0,34),150,40+i*8,'#999');});
 txt('RARE GEAR',22,94,'#d02030');RARE.forEach((r,i)=>{const f=meta.codex.gear[r.n],st=Object.keys(SETS).find(k=>SETS[k].items.includes(r.n));const x=22+(i%2)*142,y=103+((i/2)|0)*10;if(f)ctx.drawImage(itemIcon({t:'gear',slot:r.slot,tier:10,q:4,rare:true,name:r.n}),x,y-3);txt(f?r.n:'? ? ?',x+14,y,f?SETS[st].c:'#555');});
 ctxt('SETS: 2 PIECES = BONUS, 3 = BIG BONUS.  K CLOSE',168,'#888');}
function codexAdd(kind,key){if(!meta.codex[kind][key]){meta.codex[kind][key]=1;saveMeta();if(P)txtFx(P.x,P.y-10,'NEW CODEX ENTRY','#c9a');}}
function renderEnd(){
 bg();ctx.fillStyle='rgba(0,0,0,.72)';ctx.fillRect(0,0,W,H);const d=deadInfo,C=d.cls||CLS();
 const box=(x,y,w,h,c)=>{ctx.fillStyle='rgba(20,12,26,.92)';ctx.fillRect(x,y,w,h);ctx.fillStyle=c;ctx.fillRect(x,y,w,1);};
 const K=n=>n>=1e6?(n/1e6).toFixed(1)+'M':n>=1e4?Math.round(n/1e3)+'K':n>=1e3?(n/1e3).toFixed(1)+'K':String(Math.round(n));
 ctxt(d.win?'VICTORY':'DEATH',4,d.win?'#fd4':'#c01020',3);
 ctxt(C.n+' ('+heroEV(C.k,d.evo||0).n+')  -  '+(d.win?'ALL DUNGEONS CLEARED':'FELL IN '+ROMAN[d.di]+'. '+DUN[d.di].name),23,'#aaa');
 // run stats
 box(6,32,110,82,'#d02030');txt('RUN',10,35,'#d02030');
 [['GOLD GAINED',d.sen,'#fc4'],['ENEMIES SLAIN',d.kills,'#ddd'],['DEATHBLOWS',d.db,'#ddd'],['PERFECT DODGES',d.pf,'#8cf'],['BEST COMBO',d.combo||0,'#f84'],['TIME',Math.floor(d.time/60)+'M '+Math.floor(d.time%60)+'S','#ddd']]
  .forEach(([n,v,c],i)=>{const y=46+i*10;txt(n,10,y,'#999');const s=String(v);txt(s,112-txtW(s),y,c);});
 // damage dealt by each ability
 const DM=d.dmg||{},keys=['m','h','q','w','f','e','x'],tot=keys.reduce((a,k)=>a+(DM[k]||0),0)||1,mx=Math.max(1,...keys.map(k=>DM[k]||0));
 box(120,32,W-126,82,C.col);txt('DAMAGE BY ABILITY',124,35,C.col);{const s='TOTAL '+K(tot);txt(s,W-10-txtW(s),35,'#fff');}
 keys.forEach((k,i)=>{const y=46+i*9,v=DM[k]||0,sp=k==='x'?null:SPELLS[k][(d.lo||{})[k]]||null,nm=k==='x'?'RELICS + EFFECTS':sp?sp.n:'-',col=k==='x'?'#c6f':sp?sp.c:'#777';
  txt(k==='x'?'*':SLOTKEY[k],124,y,'#777');txt(nm.slice(0,16),142,y,v?col:'#555');
  const bw=Math.round(56*v/mx);ctx.fillStyle='#2a2030';ctx.fillRect(210,y,56,5);ctx.fillStyle=col;ctx.fillRect(210,y,bw,5);
  const s=K(v)+' '+Math.round(v/tot*100)+'%';txt(s,W-10-txtW(s),y,v?'#ddd':'#555');});
 // loadout at the end: gear, enchants, relics and scroll add-ons
 box(6,118,W-12,38,'#888');txt('LOADOUT',10,121,'#aaa');
 let x=10;for(const s of ['wpn','arm','ring']){drawItemIcon(d.eq&&d.eq[s],x,130);x+=18;}
 x+=4;for(const k of d.ench||[]){ctx.drawImage(itemIcon({t:'ench',k}),x,131);x+=14;}
 x+=4;for(const id in d.inv||{}){const it=ITEMBY[id];if(!it||x>W-24)continue;iconBox(x,132,it.g,fxCol(id));if(d.inv[id]>1)txt('X'+d.inv[id],x+1,143,'#fff');x+=13;}
 {const A=[];for(const k in d.addon||{})for(const a of ADDONS)if(d.addon[k][a.k])A.push(SLOTKEY[k]+' '+fxLabel(a.n,a.tier));
  if(A.length)txt(('SCROLLS: '+A.join(', ')).slice(0,Math.floor((W-60)/4)),60,121,'#ffe060');}
 if(d.unlock)ctxt('NEW CHARACTER UNLOCKED: '+d.unlock.n,160,Math.floor(time*4)%2?d.unlock.col:'#fff');
 if(Math.floor(time*2)%2===0)ctxt('PRESS ENTER: CHARACTER SELECT',171,'#fff');
}
function renderChoose(){
 renderPlay();ctx.fillStyle='rgba(0,0,0,.75)';ctx.fillRect(0,0,W,H);
 ctxt('BOSS DEFEATED',12,'#fd4',2);ctxt('CHOOSE A REWARD  (CLICK OR PRESS 1 2 3)',32,'#ccc');
 // the evolution you just earned stays on screen while you pick
 {const s='YOU EVOLVED INTO '+evoName(P.evo||0),sp=heroSpr(CLS().k,P.evo||0),x=Math.round((W-txtW(s))/2);
  ctx.drawImage(sp.c,WIZ.idle[Math.floor(time*2.5)%2]*sp.fw,0,sp.fw,sp.fh,x-26,H-34,sp.fw,sp.fh);txt(s,x,H-22,Math.floor(time*3)%2?'#ffe060':'#fff');}
 const cw=92,gap=8,x0=Math.round((W-(3*cw+2*gap))/2);
 chooseOpts.forEach((it,i)=>{const x=x0+i*(cw+gap),y=44,h=92,hov=mouse.x>=x&&mouse.x<=x+cw&&mouse.y>=y&&mouse.y<=y+h;
  ctx.fillStyle=hov?'#2a1a30':'#160e1a';ctx.fillRect(x,y,cw,h);ctx.fillStyle=RCOL[it.r];ctx.fillRect(x,y,cw,1);ctx.fillRect(x,y+h-1,cw,1);ctx.fillRect(x,y,1,h);ctx.fillRect(x+cw-1,y,1,h);
  ctx.save();ctx.translate(x+cw/2-9,y+14);ctx.scale(2,2);iconBox(0,0,it.g,RCOL[it.r]);ctx.restore();
  txt('['+(i+1)+']',x+cw/2-6,y+4,'#aaa');
  const nm=fxLabel(it.name,it.r+1);ctxt2(nm.length>22?nm.slice(0,22):nm,x,cw,y+44,fxCol(it.id));wrapTxt(it.d,22).slice(0,2).forEach((l,j)=>ctxt2(l,x,cw,y+56+j*8,'#ddd'));ctxt2(FXNAME[fxStyle(it.id)]+' RELIC',x,cw,y+74,fxCol(it.id));ctxt2(['COMMON','UNCOMMON','RARE','LEGENDARY'][it.r],x,cw,y+82,'#777');});
}
function ctxt2(s,x,w,y,c){txt(s,Math.round(x+(w-txtW(s))/2),y,c);}
function render(){
 setView(mode==='play'||mode==='choose'||mode==='scroll'||mode==='event');
 ctx.imageSmoothingEnabled=false;
 if(mode==='title')renderTitle();else if(mode==='select')renderSelect();else if(mode==='tut')renderTut();else if(mode==='hub')renderHub();else if(mode==='play')renderPlay();else if(mode==='choose')renderChoose();else if(mode==='scroll')renderScroll();else if(mode==='event')renderEvent();else renderEnd();
 drawCursor();
}
// one cursor for every screen: crosshair while fighting, an arrow on menus, pause and the backpack
function drawCursor(){const mx=Math.round(mouse.x),my=Math.round(mouse.y);
 if(mode==='play'&&!paused&&!invOpen){ctx.fillStyle='#14101a';ctx.fillRect(mx-4,my-1,9,3);ctx.fillRect(mx-1,my-4,3,9);ctx.fillStyle='#fff';ctx.fillRect(mx-3,my,2,1);ctx.fillRect(mx+2,my,2,1);ctx.fillRect(mx,my-3,1,2);ctx.fillRect(mx,my+2,1,2);return;}
 const A=['1','11','1w1','1ww1','1www1','1wwww1','1www11','1w1w1','11.1w1','....11'];A.forEach((r,y)=>{for(let x=0;x<r.length;x++){const c=r[x];if(c==='.')continue;ctx.fillStyle=c==='1'?'#14101a':'#fff';ctx.fillRect(mx+x,my+y,1,1);}});}

// ---------- tutorial ----------
const TUT=[
 {t:'MOVE AND DASH',c:'#8cf',l:['WASD  MOVE    , .  ROTATE THE CAMERA','MOUSE  AIMS EVERY SPELL AT THE CURSOR','','SPACE  DASH: A QUICK SIDESTEP','YOU CANNOT BE HIT WHILE DASHING','IT RECHARGES IN UNDER A SECOND','','RED ! ATTACKS AND RED CIRCLES ARE PERILOUS.','THEY CANNOT BE WARDED. DASH OUT!']},
 {t:'SIX SPELL SLOTS',c:'#fd4',l:['LMB RMB  BASIC ATTACKS - HOLD TO REPEAT','Q E F    ABILITIES ON COOLDOWNS','R        ULTIMATE - KILLS CHARGE IT','HOVER THE SPELL BAR FOR DAMAGE NUMBERS','','EACH SLOT HAS 3 SPELLS. PICK AT THE TEMPLE.','SPELLS RANK UP WITH EVERY DUNGEON','','C  DRINK A POTION (RARE!)   G  INTERACT']},
 {t:'LOOT BAGS',c:'#b070f0',l:['ENEMIES DROP BAGS WHEN THEY DIE','STAND ON A BAG TO SEE WHAT IS INSIDE','1-6 TAKE/EQUIP AN ITEM   G TAKE ALL TO PACK','GEAR: 15 TIERS, COMMON TO LEGENDARY','RARER GEAR DROPS DEEPER IN THE DUNGEONS','COLOURED BAGS HOLD EPICS, ENCHANTS, SCROLLS','WHITE ROYAL BAG: SUPER RARE, ALWAYS LEGENDARY','STAT ELIXIRS ARE PERMANENT, MAX 20 EACH','TAB BACKPACK (8)  X SWAP WEAPON','G AT THE PORTAL TO ENTER IT']},
 {t:'EFFECT COLOURS',c:'#ff5050',l:[{s:'RED      DAMAGE - CRIT, POWER, PIERCE, BLAST',c:'#ff5050'},{s:'GREEN    HEAL - LEECH, LIFESTEAL, REVIVES',c:'#50e060'},{s:'ORANGE   FIRE - BURNS',c:'#ff8a30'},
  {s:'ICE      FROST - CHILLS, 3 CHILLS FREEZE',c:'#80d0ff'},{s:'YELLOW   STORM - SHOCKS AND ARCS',c:'#ffe040'},{s:'LIME     POISON',c:'#a0ff40'},{s:'CYAN     SPEED - COOLDOWNS, DASH, MOVE',c:'#40e0e0'},
  {s:'STEEL    GUARD - DEFENCE, DODGE, POSTURE',c:'#b0b8d0'},{s:'I - IV   STRENGTH: I IS A CHANCE, IV IS HUGE',c:'#fff'}]},
 {t:'FIVE KINDS OF POWER',c:'#ffe060',l:['WEAPON   SETS HOW YOUR LMB ATTACKS','         (SWEEP, BEAM, VOLLEY, BELL...)','GEAR     ARMOUR AND RINGS: NUMBERS ONLY','ENCHANT  ON-HIT EFFECT FOR EVERY ABILITY','         (RMB Q E F R) - A CHANCE, MAX 3','SCROLL   REWRITES ONE ABILITY: REPLACE IT,','         OR A GUARANTEED ADD-ON','RELIC    A RULE FOR THE WHOLE RUN','         (BOSS REWARDS, SHOPS, SHRINES)']},{t:'DODGING',c:'#8cf',l:['EVERY PATTERN HAS A GAP - FIND IT','SHIFT IN COMBAT: FOCUS - SLOW, TINY HITBOX','DASH 3 TIMES IN A ROW OUT OF COMBAT: SPEED BOOST','DASH THROUGH A SHOT AS IT HITS:','  PERFECT DODGE - NEARBY BULLETS SHATTER','  DASH RESETS, NEXT ATTACK EMPOWERED','GRAZING SHOTS CUTS COOLDOWNS','MINES BLINK BEFORE THEY BURST','SPIRALS AND RINGS ROTATE - MOVE WITH THEM']},
 {t:'POSTURE AND STAGGER',c:'#fd4',l:['EVERY HIT FILLS THE YELLOW POSTURE BAR','A FULL BAR IS A BREAK: THE ENEMY STAGGERS','','STAGGERED ENEMIES TAKE +50% DAMAGE','THE MORTAL EDGE ITEM TURNS HITS ON THEM','INTO DEATHBLOWS (BOSSES LOSE 3% HP)','','SHIELD BEARERS BLOCK SHOTS FROM THE FRONT.','BREAK THEM, FLANK THEM OR USE LIGHTNING']},
 {t:'ELEMENTS',c:'#f80',l:['BURN, POISON, CHILL AND SHOCK STACK ON FOES','','BURN + SHOCK = OVERLOAD: AN EXPLOSION','BURN + POISON = BOTH DEAL 50% MORE','3 CHILLS = FROZEN. HIT A FROZEN FOE TO','SHATTER IT FOR 50% BONUS DAMAGE','','FLAME WAVE BURNS. CHAIN LIGHTNING SHOCKS.','ITEMS CAN ADD ELEMENTS TO EVERY SPELL']},
 {t:'ROOMS AND EVENTS',c:'#c6f',l:['GOLD    TREASURE CHEST (BEWARE AMBUSHES)','BLUE    SHOP - RELICS AND A PRICEY POTION','PURPLE  SHRINE - RISKY OFFERINGS','GREEN   SPRING - A RARE CHANCE TO HEAL','ORANGE  ELITE - A TOUGH FOE WITH A MODIFIER','RED     SPIKE TRAPS - WATCH THE FLOOR','','ROOMS APPEAR ON THE MINIMAP ONCE SEEN']},
 {t:'THE RUN',c:'#6c6',l:['EACH DUNGEON ENDS IN A BOSS','DEFEAT IT, PICK A REWARD, TAKE THE PORTAL','10 DUNGEONS. DIE AND YOU KEEP YOUR GOLD','','EACH BOSS EVOLVES YOU TOWARD MASTER','GOLD LEGENDARIES CAN CHANGE A WHOLE RUN','','ESC PAUSES.  M MUTES.  GOOD LUCK!']},
];
function tutKey(c){
 if(c==='Escape'){tutDone();return;}
 if(c==='Enter'||c==='Space'||c==='ArrowRight'||c==='KeyD'){if(++tutPage>=TUT.length)tutDone();else sfx('pickup');}
 else if(c==='ArrowLeft'||c==='KeyA')tutPage=Math.max(0,tutPage-1);
}
function tutDone(){meta.tut3=true;saveMeta();if(tutPending!==null){const s=tutPending;tutPending=null;startRun(s);}else mode='hub';}
function renderTut(){
 bg();ctx.fillStyle='rgba(0,0,0,.75)';ctx.fillRect(10,8,300,164);
 const p=TUT[tutPage];ctxt('TUTORIAL '+(tutPage+1)+'/'+TUT.length,14,'#888');ctxt(p.t,26,p.c,2);
 p.l.forEach((s,i)=>typeof s==='object'?txt(s.s,24,52+i*11,s.c):txt(s,24,52+i*11,s.startsWith(' ')?'#aaa':'#ddd'));
 ctxt(tutPage<TUT.length-1?'ENTER NEXT  -  ESC SKIP':'ENTER TO BEGIN',158,'#fff');
}

// ---------- loop ----------
let last=performance.now();
function loop(now){const dt=Math.min(.033,(now-last)/1000);last=now;try{update(dt);render();}catch(e){console.error(e);ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);txt('ERROR: '+e.message,4,4,'#f55');}requestAnimationFrame(loop);}
requestAnimationFrame(loop);
// debug hook for testing
window.__dbg={start:d=>{meta.reached=9;meta.tut3=true;startRun(d||0);},state:()=>({mode,enemies:enemies.length,hp:P&&P.hp,boss:!!boss}),killBoss:()=>{if(boss){boss.hp=1;hurtE(boss,5,0,{});}},teleportBoss:()=>{const r=map.bossRoom;P.x=(r.x+2)*T;P.y=(r.y+r.h/2)*T;},god:()=>{P.hp=9999;S.maxhp=9999;}};
