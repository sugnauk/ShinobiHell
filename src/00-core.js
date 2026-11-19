'use strict';
// HELL OF THE EMPEROR - utils and the pixel font (part of the former game.js; files load in numeric order, see index.html)
/* HELL OF THE EMPEROR - 8-bit arcade roguelite: storm the palace and end the corrupt emperor. Single file, no dependencies. */
// W,H: the game's pixel resolution. Menus use 320x180; while fighting the camera zooms out to 448x252 to show the bigger rooms.
let W=320,H=180;const T=16,MW=140,MH=116,TAU=Math.PI*2,WH=10;
const cv=document.getElementById('c'),ctx=cv.getContext('2d');
cv.width=W;cv.height=H;
// the wide view (play, and the newer menus) fills the window: its height is the zoom (more pixels = zoomed further out)
// and its width follows the window's shape, so there are no black bars. Narrow menus stay 320x180, scaled to fit.
let VIEWWIDE=false;const VIEWHS=[252,300,348];
const viewH=()=>{try{return VIEWHS[(typeof meta!=='undefined'&&meta.opt&&meta.opt.zoom!=null)?meta.opt.zoom:1]||300;}catch(_){return 300;}};
function viewDims(wide){if(!wide)return [320,180];const h=viewH(),a=innerWidth/Math.max(1,innerHeight),w=Math.round(clamp(h*a,h*1.3,h*2.4)/2)*2;return [w,h];}
function setView(wide){VIEWWIDE=!!wide;const [nw,nh]=viewDims(wide);if(nw===W&&nh===H)return;W=nw;H=nh;cv.width=W;cv.height=H;fit();}
function fit(){const s=Math.min(innerWidth/W,innerHeight/H);const w=Math.round(W*s),h=Math.round(H*s);cv.style.width=w+'px';cv.style.height=h+'px';cv.style.left=Math.floor((innerWidth-w)/2)+'px';cv.style.top=Math.floor((innerHeight-h)/2)+'px';}
addEventListener('resize',()=>{const v=VIEWWIDE;W=0;setView(v);fit();});fit();

// the game's version, shown on the title screen. Bump it with every change that reaches main.
const GAME_VERSION='0.8.7';

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

// ---------- pixel font: 5 rows tall, proportional width ----------
// same chunky look as before, but letters that were cramped at 3 columns (M W N Q) get room, round letters are
// actually round, and punctuation is narrow, so lines stay about the same length. Each glyph is rows of '#'.
const FONT=(()=>{const F={
 A:['.#.','#.#','###','#.#','#.#'],B:['##.','#.#','##.','#.#','##.'],C:['.##','#..','#..','#..','.##'],D:['##.','#.#','#.#','#.#','##.'],
 E:['###','#..','##.','#..','###'],F:['###','#..','##.','#..','#..'],G:['.##.','#...','#.##','#..#','.##.'],H:['#.#','#.#','###','#.#','#.#'],
 I:['###','.#.','.#.','.#.','###'],J:['..#','..#','..#','#.#','.#.'],K:['#..#','#.#.','##..','#.#.','#..#'],L:['#..','#..','#..','#..','###'],
 M:['#...#','##.##','#.#.#','#...#','#...#'],N:['#..#','##.#','#.##','#..#','#..#'],O:['.##.','#..#','#..#','#..#','.##.'],P:['##.','#.#','##.','#..','#..'],
 Q:['.##.','#..#','#..#','#.#.','.#.#'],R:['##.','#.#','##.','#.#','#.#'],S:['.##','#..','.#.','..#','##.'],T:['###','.#.','.#.','.#.','.#.'],
 U:['#.#','#.#','#.#','#.#','###'],V:['#.#','#.#','#.#','.#.','.#.'],W:['#...#','#...#','#.#.#','##.##','#...#'],X:['#.#','#.#','.#.','#.#','#.#'],
 Y:['#.#','#.#','.#.','.#.','.#.'],Z:['###','..#','.#.','#..','###'],
 '0':['###','#.#','#.#','#.#','###'],'1':['.#.','##.','.#.','.#.','###'],'2':['##.','..#','.#.','#..','###'],'3':['##.','..#','.#.','..#','##.'],
 '4':['#.#','#.#','###','..#','..#'],'5':['###','#..','##.','..#','##.'],'6':['.##','#..','###','#.#','###'],'7':['###','..#','.#.','.#.','.#.'],
 '8':['###','#.#','###','#.#','###'],'9':['###','#.#','###','..#','##.'],
 ' ':['..','..','..','..','..'],'.':['.','.','.','.','#'],',':['..','..','..','.#','#.'],'!':['#','#','#','.','#'],':':['.','#','.','#','.'],';':['..','.#','..','.#','#.'],
 "'":['#','#','.','.','.'],'-':['...','...','###','...','...'],'+':['...','.#.','###','.#.','...'],'/':['..#','..#','.#.','#..','#..'],'\\':['#..','#..','.#.','..#','..#'],
 '%':['#.#','..#','.#.','#..','#.#'],'?':['##.','..#','.#.','...','.#.'],'(':['.#','#.','#.','#.','.#'],')':['#.','.#','.#','.#','#.'],
 '[':['##','#.','#.','#.','##'],']':['##','.#','.#','.#','##'],'*':['...','#.#','.#.','#.#','...'],'>':['#..','.#.','..#','.#.','#..'],'<':['..#','.#.','#..','.#.','..#'],
 '=':['...','###','...','###','...'],'^':['.#.','#.#','...','...','...'],'`':['#.','.#','..','..','..'],'#':['#.#','###','#.#','###','#.#'],'&':['.#.','#.#','.#.','#.#','.##'],
 '_':['...','...','...','...','###'],'"':['#.#','#.#','...','...','...']};F.x=F['*'];return F;})();
const glyphW=ch=>{const g=FONT[ch];return g?g[0].length:3;};
function glyph(g,x,y,sc){for(let r=0;r<5;r++){const row=g[r];for(let c=0;c<row.length;c++)if(row[c]==='#')ctx.fillRect(x+c*sc,y+r*sc,sc,sc);}}
// legible text: every glyph gets a full dark outline (not just a drop shadow), dark colours are lifted so they
// read on dark floors, and outlined glyphs are cached as tiny images so drawing stays cheap
const GLC={},LCOL={};
function readCol(c){if(LCOL[c])return LCOL[c];let v=c;if(typeof c==='string'&&c[0]==='#'&&(c.length===4||c.length===7)){
 const h=c.length===4?c.slice(1).split('').map(z=>z+z).join(''):c.slice(1),r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16),L=(.299*r+.587*g+.114*b)/255;
 if(L<.5)v=shade('#'+h,Math.min(.6,(.5-L)*1.4));}return LCOL[c]=v;}
function glyphImg(ch,col,sc,ol){const k=ch+col+sc+(ol?'o':'');if(GLC[k])return GLC[k];const g=FONT[ch];if(!g)return null;const gw=g[0].length;
 const c=mk(gw*sc+3,5*sc+3,x=>{const px=(dx,dy,cc)=>{x.fillStyle=cc;for(let r=0;r<5;r++)for(let q=0;q<gw;q++)if(g[r][q]==='#')x.fillRect(1+q*sc+dx,1+r*sc+dy,sc,sc);};
  if(ol){for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,-1],[-1,1],[1,1]])px(dx,dy,'#0a0610');px(1,1,'#0a0610');}px(0,0,col);});
 return GLC[k]=c;}
function txt(s,x,y,col,sc,shadow){col=readCol(col||'#fff');sc=sc||1;if(shadow===undefined)shadow=true;s=String(s).toUpperCase();
 let cx=Math.round(x)-1;const cy=Math.round(y)-1;for(const ch of s){const im=ch===' '?null:glyphImg(ch,col,sc,shadow);if(im)ctx.drawImage(im,cx,cy);cx+=(glyphW(ch)+1)*sc;}}
const txtW=(s,sc)=>{sc=sc||1;let w=0;for(const ch of String(s).toUpperCase())w+=(glyphW(ch)+1)*sc;return Math.max(0,w-sc);};
const ctxt=(s,y,col,sc)=>txt(s,Math.round((W-txtW(s,sc))/2),y,col,sc);
function bar(x,y,w,h,f,col,bg){ctx.fillStyle='#000';ctx.fillRect(x-1,y-1,w+2,h+2);ctx.fillStyle=bg||'#3a1a1a';ctx.fillRect(x,y,w,h);ctx.fillStyle=col;ctx.fillRect(x,y,Math.round(w*clamp(f,0,1)),h);}
function disc(x,y,r,col){ctx.fillStyle=col;r=Math.round(r);x=Math.round(x);y=Math.round(y);for(let j=-r;j<=r;j++){const w=Math.floor(Math.sqrt(r*r-j*j));ctx.fillRect(x-w,y+j,w*2+1,1);}}
function circ(x,y,r,col){ctx.fillStyle=col;const n=Math.max(12,Math.floor(r*2.4));for(let i=0;i<n;i++){const a=i/n*TAU;ctx.fillRect(Math.round(x+Math.cos(a)*r),Math.round(y+Math.sin(a)*r),1,1);}}
function line(x0,y0,a,r0,r1,col){ctx.fillStyle=col;for(let r=r0;r<=r1;r++)ctx.fillRect(Math.round(x0+Math.cos(a)*r),Math.round(y0+Math.sin(a)*r),1,1);}
