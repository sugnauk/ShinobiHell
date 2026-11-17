'use strict';
// SHINOBIDUNGEONS - extras (separate from the requested changes):
//  2. The province map: the march from the bamboo forest to the throne room, drawn as a campaign map with the castle in
//     the corner. It slides in for a few seconds as each stage begins (with the road you just took drawn in), and the
//     main menu's NEW RUN panel shows how far you have ever pushed.

// (the guardian defeat sequence that started here was approved and moved into the main changes: src/142-bossfall.js)

// ---------- 2. the province map ----------
// each stage's place on the map (0..1), and a tiny icon for it
const PMAP=[[.05,.86],[.16,.76],[.27,.88],[.36,.72],[.27,.5],[.45,.44],[.56,.56],[.68,.64],[.74,.4],[.6,.24],[.8,.18],[.93,.07]];
const PICON=['tree','reed','cave','fire','peak','wall','bell','chain','keep','bloom','jade','crown'];
function pmIcon(k,x,y,c){const P=(a,b,w,h,col)=>{ctx.fillStyle=col||c;ctx.fillRect(x+a,y+b,w,h);};
 switch(k){case 'tree':P(-1,-4,3,4);P(-3,-2,7,2);P(0,0,1,3,'#6a4a2a');break;case 'reed':for(const a of [-2,0,2])P(a,-4+Math.abs(a),1,6);break;
  case 'cave':P(-3,-2,7,5);P(-1,0,3,3,'#0a0810');break;case 'fire':P(-1,-4,2,2,'#ffd040');P(-2,-2,4,4);break;case 'peak':for(let i=0;i<4;i++)P(-i,-3+i,i*2+1,1);P(0,-3,1,1,'#fff');break;
  case 'wall':P(-3,-2,7,4);for(const a of [-3,-1,1,3])P(a,-3,1,1);break;case 'bell':P(-1,-3,3,1);P(-2,-2,5,3);P(0,1,1,1);break;case 'chain':for(const a of [-3,0,3])P(a-1,-1,2,2);break;
  case 'keep':P(-3,0,7,3);P(-2,-2,5,2);P(-1,-4,3,2);P(-4,-2,9,1,'#5a6a7a');break;case 'bloom':P(-1,-3,3,3,'#f0a0c0');P(0,0,1,3,'#6a4a2a');break;
  case 'jade':P(-2,-2,5,5,'#3e9a6a');P(-1,-1,3,3,'#8ae0b0');break;case 'crown':P(-3,-1,7,3,'#e0b040');for(const a of [-3,0,3])P(a,-3,1,2,'#e0b040');break;}}
function drawProvinceMap(x0,y0,w,h,cur,reached,anim){
 ctx.fillStyle='#120e16';ctx.fillRect(x0,y0,w,h);ctx.fillStyle='#2e2440';ctx.fillRect(x0,y0,w,1);ctx.fillRect(x0,y0+h-1,w,1);ctx.fillRect(x0,y0,1,h);ctx.fillRect(x0+w-1,y0,1,h);
 const at=i=>[Math.round(x0+6+PMAP[i][0]*(w-12)),Math.round(y0+8+PMAP[i][1]*(h-16))];
 // terrain: a river, hills, and the castle walls enclosing the last stages
 ctx.fillStyle='#1c2a3a';for(let t=0;t<1;t+=.01){const X=x0+6+t*(w-12),Y=y0+h*.7+Math.sin(t*9)*h*.06-t*h*.35;ctx.fillRect(Math.round(X),Math.round(Y),2,1);}
 for(const [hx,hy] of [[.2,.42],[.3,.4],[.36,.46]]){const X=x0+hx*w,Y=y0+hy*h;for(let i=0;i<5;i++){ctx.fillStyle='#2a2634';ctx.fillRect(Math.round(X-i),Math.round(Y+i),i*2+1,1);}}
 {const cx=x0+w*.49,cy=y0+3,cw=w*.5,ch=h*.72;ctx.fillStyle='#3a3048';ctx.fillRect(Math.round(cx),Math.round(cy+ch),Math.round(cw),1);ctx.fillRect(Math.round(cx),Math.round(cy),1,Math.round(ch));
  for(let i=0;i<cw;i+=6)ctx.fillRect(Math.round(cx+i),Math.round(cy+ch-1),2,1);txt('THE CASTLE',Math.round(cx+3),Math.round(cy+ch-8),'#4a405a');}
 // the road: walked in red, ahead dotted
 for(let i=0;i<11;i++){const [ax,ay]=at(i),[bx,by]=at(i+1),done=i<cur||(i<reached&&cur<0),n=Math.max(Math.abs(bx-ax),Math.abs(by-ay));
  const lim=anim!=null&&i===cur-1?Math.round(n*anim):n;for(let j=0;j<=n;j++){if(!done&&j%3)continue;if(i===cur-1&&j>lim)continue;ctx.fillStyle=done?'#d02030':'#3a3048';ctx.fillRect(Math.round(ax+(bx-ax)*j/n),Math.round(ay+(by-ay)*j/n),done?2:1,done?2:1);}}
 // the stages
 for(let i=0;i<12;i++){const [X,Y]=at(i),beaten=cur>=0?i<cur:i<reached,here=i===cur,seen=here||beaten||i<=reached;
  if(here){ctx.globalAlpha=.4+.3*Math.sin(time*5);disc(X,Y,6,'#ffd040');ctx.globalAlpha=1;}
  pmIcon(PICON[i],X,Y,seen?(here?'#ffe080':beaten?'#c8b8a8':'#8a7a9a'):'#3a3048');
  if(beaten){ctx.fillStyle='#d02030';ctx.fillRect(X+3,Y+2,3,3);ctx.fillStyle='#fff';ctx.fillRect(X+4,Y+3,1,1);}}
 if(cur>=0){const [X,Y]=at(cur),s=ROMAN[cur]+'. '+DUN[cur].name,tx=clamp(X-Math.round(txtW(s)/2),x0+3,x0+w-3-txtW(s));txt(s,tx,Math.min(y0+h-8,Y+6),'#ffe080');}}
// at the start of each stage the map slides in, the road from the last stage drawing itself
{const _ld=loadDungeon;loadDungeon=function(di){const r=_ld.apply(this,arguments);try{if(R&&!R.training&&!R.rush)R.mapCard={t:time,di};}catch(_){}return r;};}
{const _rp=renderPlay;renderPlay=function(){_rp.apply(this,arguments);const M=R&&R.mapCard;if(!M||R.training||boss&&boss.awake)return;const k=time-M.t;if(k>4.2){R.mapCard=null;return;}
 const a=Math.min(1,k/.35,(4.2-k)/.5),w=170,h=96,x=Math.round(W-w-8+(1-a)*40),y=44;ctx.globalAlpha=a;drawProvinceMap(x,y,w,h,M.di,M.di,clamp((k-.3)/1.2,0,1));
 txt('THE MARCH ON THE CASTLE',x+4,y-8,'#bbb');ctx.globalAlpha=1;};}
// the main menu's NEW RUN panel: how far you have ever pushed
{const _rm=renderMenu;renderMenu=function(){_rm.apply(this,arguments);try{const L=mmItems(),it=L[clamp(mmSel,0,L.length-1)];if(it.k!=='new')return;
 const X=MM.PX,Wd=W-X-6,w=Wd-16,h=H-8-160-6,x=X+8,y=160;drawProvinceMap(x,y,w,h,-1,(meta.reached||0));txt('THE MARCH - FURTHEST '+(ROMAN[meta.reached||0]||ROMAN[0]),x+4,y+h-9,'#888');}catch(_){}};}
