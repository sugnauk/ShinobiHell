'use strict';
// SHINOBIDUNGEONS - a readable skill tree. Every small node shows what it gives: a 9x9 stat icon in that stat's own
// colour (power is a red sword, health a green heart, gold a coin...), on a tile edged with its branch colour. Hovering any
// node shows a tooltip with its name, effect and cost; a legend of the stats sits under the map.

// one colour per stat, so the same upgrade looks the same in every branch
const STATC={pow:'#ff5a4a',crit:'#ffd84a',boss:'#ff9a3a',near:'#e8eef6',aspd:'#7ae0ff',def:'#9ab0d0',cdr:'#5aa8ff',spd:'#5ae0a0',dash:'#40d8d0',
 abil:'#c080ff',range:'#b8f060',hp:'#50e060',regen:'#ff8ac8',dodge:'#a990ff',graze:'#d8b8ff',gold:'#ffd040',pot:'#ff6080',luck:'#40e090'};
const STATN={pow:'POWER',crit:'CRIT',boss:'BOSS DMG',near:'CLOSE DMG',aspd:'ATK SPEED',def:'DEFENCE',cdr:'COOLDOWN',spd:'MOVE SPD',dash:'DASH',abil:'ABILITY DMG',
 range:'RANGE',hp:'MAX HP',regen:'REGEN',dodge:'DODGE',graze:'GRAZE',gold:'GOLD',pot:'POTIONS',luck:'LUCK'};
// 9x9 icons: a = the stat colour, l = lighter, d = darker, w = white, k = near black
const STATICON={
 pow:  ['.......lw','......lwl','.....lwl.','....lwl..','.d.lwl...','..dwl....','..kd.....','.kk.d....','kk.......'],
 crit: ['....l....','....a....','.l..a..l.','..aaaaa..','laaawaaal','..aaaaa..','.l..a..l.','....a....','....l....'],
 boss: ['.l.....l.','.al...la.','.aaaaaaa.','.awakawa.','.aaaaaaa.','..akkka..','..aaaaa..','..a.a.a..','.........'],
 near: ['l.......l','.a.....a.','..a...a..','...a.a...','....w....','...a.a...','..a...a..','.a.....a.','l.......l'],
 aspd: ['....llll.','...a....l','..a......','.aaaa.a..','.....aa..','....aaa..','...a.....','..a......','.a.......'],
 def:  ['.ddddddd.','dllllllad','dlawwwaad','dlaawaaad','dlaawaaad','.dlaaaad.','..dlaad..','...dad...','....d....'],
 cdr:  ['.aaaaaaa.','..alllda.','...ald...','....w....','...ald...','..al.da..','.aallldaa','.aaaaaaa.','.........'],
 spd:  ['......ll.','.....laa.','....laa..','lll.aa...','..aaaaal.','...aa....','..aa.....','.aa......','.l.......'],
 dash: ['.....l...','....aa...','...aaa...','..aaaaal.','.laaaaa..','...aaa...','...aa....','...a.....','.........'],
 abil: ['....l....','...lal...','..laaal..','.laawaal.','laawwwaal','.laawaal.','..laaal..','...lal...','....l....'],
 range:['....a....','...aaa...','..a.a.a..','....a....','....a....','..l.a.l..','...lal...','....l....','..k.k.k..'],
 hp:   ['.aa...aa.','alla.alla','alwaaaaad','alaaaaaad','.aaaaaad.','..aaaad..','...aad...','....d....','.........'],
 regen:['....l....','...lal...','...aaa...','.llaaall.','laaawaaal','.ddaaadd.','...aaa...','...dad...','....d....'],
 dodge:['...l.....','..lal....','.laaal...','..lal.ll.','...l.lal.','....laaal','.....lal.','......l..','.........'],
 graze:['......l..','.....lal.','......l..','.........','..aaa....','.a...a...','a..w..a..','.a...a...','..aaa....'],
 gold: ['..ddddd..','.dllllld.','dllaaalld','dlaawaald','dlaaaaald','dlaawaald','dllaaalld','.dddaddd.','..ddddd..'],
 pot:  ['...kkk...','...lwl...','....a....','...lal...','..laaal..','.laawaal.','.laaaaad.','..ddddd..','.........'],
 luck: ['..ll.ll..','.laa.aal.','.aaa.aaa.','..aawaa..','.aaa.aaa.','.daa.aad.','..dd.dd..','....l....','.....l...']};
const SICON={};
function statIcon(st,lit){const k=st+(lit?1:0);if(SICON[k])return SICON[k];const A=STATICON[st];if(!A)return null;const c=STATC[st]||'#ccc';
 return SICON[k]=mk(9,9,g=>{A.forEach((row,y)=>{for(let x=0;x<9;x++){const ch=row[x];if(ch==='.')continue;let col=ch==='a'?c:ch==='l'?shade(c,.45):ch==='d'?shade(c,-.45):ch==='w'?'#fffbe8':'#14101a';
  if(!lit)col=shade(col,-.55);g.fillStyle=col;g.fillRect(x,y,1,1);}});});}
const nodeStat=n=>n.eff?Object.keys(n.eff).find(k=>!k.startsWith('ks:'))||null:null;

// small and notable nodes: a stat tile; keystones and the gate keep their art. The overview colours dots by stat too.
{const _dn=stDrawNode;stDrawNode=function(n,x,y,selected,hover,route,goal){
 const st=nodeStat(n);if(n.big||n.old||n.free||!st)return _dn.apply(this,arguments);
 const owned=stLv(n.k)>0,ready=stAffordable(n),bc=stRGB[n.b],sc=STATC[st]||bc;
 if(stUI.zoom<.65){const r=n.mid?2:1;stGem(x,y,r,owned?sc:ready?'#e9c77c':shade(sc,-.55),owned?sc:shade(sc,-.7));
  if(selected||hover){stFill(x-3,y-3,7,1,'#fff0c6');stFill(x-3,y+3,7,1,'#fff0c6');}return;}
 const r=n.mid?7:5;
 // tile: branch-coloured frame, dark plate, the icon (dim until it is yours or affordable)
 stFill(x-r-1,y-r-1,2*r+3,2*r+3,'#0b0810');
 stFill(x-r,y-r,2*r+1,2*r+1,owned?bc:ready?'#e9c77c':route?'#a28e61':shade(bc,-.6));
 stFill(x-r+1,y-r+1,2*r-1,2*r-1,owned?shade(sc,-.62):ready?'#3a2a20':'#17121e');
 const ic=statIcon(st,owned||ready||selected||hover);if(ic)ctx.drawImage(ic,x-4,y-4);
 if(n.mid){const s2=Object.keys(n.eff)[1];if(s2){const ic2=statIcon(s2,owned||ready);if(ic2){ctx.save();ctx.beginPath();ctx.rect(x+1,y+1,6,6);ctx.clip();ctx.drawImage(ic2,x+1,y+1);ctx.restore();}}
  for(const [dx,dy] of [[-r,-r],[r,-r],[-r,r],[r,r]])stFill(x+dx,y+dy,1,1,owned||ready?'#ffe6a0':shade(bc,-.3));}
 if(owned){stFill(x+r-2,y+r-2,3,3,'#0b0810');stFill(x+r-1,y+r-1,2,2,'#80ff90');}
 else if(ready&&Math.floor(time*3)%2)stFill(x-r,y-r,2*r+1,1,'#fff1ae');
 if(goal){const d=r+3;stFill(x-1,y-d,3,1,'#ffe09e');stFill(x,y-d-1,1,3,'#ffe09e');}
 if(selected||hover){const d=r+2,c=selected?'#fff0c6':'#b8a8ba';for(const sx of [-1,1])for(const sy of [-1,1]){stFill(x+sx*d-(sx>0?2:0),y+sy*d,3,1,c);stFill(x+sx*d,y+sy*d-(sy>0?2:0),1,3,c);}}};}
// hit-testing matches the bigger tiles
{const _na=stNodeAt;stNodeAt=function(x,y){if(!stIn(x,y,stView))return null;if(stUI.zoom<.65)return _na.apply(this,arguments);let best=null,bd=1e9;
 for(const n of SKT.nodes){const [nx,ny]=stScreen(n.x,n.y),r=n.big?10:n.mid?8:6;if(Math.abs(x-nx)<=r&&Math.abs(y-ny)<=r){const d=Math.hypot(x-nx,y-ny);if(d<bd){bd=d;best=n;}}}return best;};}
// the details panel shows the stat icon big for small nodes
{const _sa=stArt;stArt=function(n,lit){const st=nodeStat(n);if(!n.big&&!n.old&&!n.free&&st){const ic=statIcon(st,true);if(ic)return ic;}return _sa.apply(this,arguments);};}

// tooltip and legend, drawn over the map
{const _ru=renderUpgrades;renderUpgrades=function(){_ru.apply(this,arguments);if(stUI.catalog)return;
 // legend: the stats this branch's small nodes give, under the map
 const n=SKT.byK[SKT.sel],b=n&&n.b!=null?n.b:0;
 const hov=stUI.press?.drag?null:stNodeAt(mouse.x,mouse.y);
 if(hov&&!hov.free){const lines=wrapTxt(hov.d||'',30),cost=stLv(hov.k)>=hov.max?'LEARNED':'COST '+stCost(hov),w=Math.max(txtW(hov.n),...lines.map(l=>txtW(l)),txtW(cost))+12,h=22+lines.length*8;
  let tx=mouse.x+10,ty=mouse.y+8;if(tx+w>stView.x+stView.w)tx=mouse.x-w-6;if(ty+h>stView.y+stView.h)ty=mouse.y-h-4;
  const st=nodeStat(hov),col=st&&!hov.big?STATC[st]:stRGB[hov.b];
  ctx.fillStyle='#0b0810';ctx.fillRect(tx-1,ty-1,w+2,h+2);ctx.fillStyle='#1a1322';ctx.fillRect(tx,ty,w,h);ctx.fillStyle=col;ctx.fillRect(tx,ty,w,1);
  txt(hov.n,tx+5,ty+4,'#fff0cf');lines.forEach((l,i)=>txt(l,tx+5,ty+13+i*8,col));txt(cost,tx+5,ty+14+lines.length*8,stAffordable(hov)?'#f3d795':'#9a8aa0');}
 // the legend
 {const B=STB[b];if(!B||!B.st)return;let x=stView.x+4;const y=stView.y+stView.h-12;ctx.fillStyle='rgba(11,8,16,.85)';ctx.fillRect(stView.x,y-2,stView.w,12);
  txt(B.n+' GIVES',x,y+1,stRGB[b]);x+=txtW(B.n+' GIVES')+6;
  for(const e of B.st){const k=Object.keys(e)[0],ic=statIcon(k,true);if(ic)ctx.drawImage(ic,x,y-1);txt(STATN[k]||k,x+11,y+1,STATC[k]);x+=txtW(STATN[k]||k)+18;}}};}
