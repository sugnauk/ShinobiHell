'use strict';
// ===== INVENTORY, PAGE 2: everything you have collected this run =====
// Two tabs in the inventory: GEAR (the equipment screen) and RELICS & SCROLLS - every relic with its stack count, the
// weapon's enchant stacks, and each ability slot with its spell and the scroll add-ons on it. Hover a row to read it.
// Switch with a click on the tabs, Q / E or the arrow keys.
let invPage=0,invRows=[];
const INVTABS=[{n:'GEAR',x:70},{n:'RELICS & SCROLLS',x:110}];
function invTabAt(){if(mouse.y<INVY+1||mouse.y>INVY+11)return -1;return INVTABS.findIndex((t,i)=>mouse.x>=INVX+t.x-3&&mouse.x<=INVX+t.x+txtW(t.n)+3);}
function drawInvTabs(){INVTABS.forEach((t,i)=>{const on=i===invPage,x=INVX+t.x,w=txtW(t.n)+6;ctx.fillStyle=on?'#3a2a3a':'#1a1420';ctx.fillRect(x-3,INVY+2,w,9);if(on){ctx.fillStyle='#d02030';ctx.fillRect(x-3,INVY+10,w,1);}txt(t.n,x,INVY+4,on?'#fff':'#776');});}
function drawInvList(){const w=W-INVX*2,h=H-INVY*2-4;panel(INVX,INVY,w,h,'INVENTORY');drawInvTabs();invRows=[];
 const row=(x,y,wd,tip,col)=>{invRows.push({x,y,w:wd,tip,col});};
 const hov=()=>invRows.find(r=>mouse.x>=r.x&&mouse.x<r.x+r.w&&mouse.y>=r.y-1&&mouse.y<r.y+8);
 // ---- relics
 const X1=INVX+8,Y0=INVY+18,ids=Object.keys(R.inv||{}).filter(k=>R.inv[k]>0&&ITEMBY[k]);
 txt('RELICS '+ids.reduce((a,k)=>a+R.inv[k],0),X1,Y0,'#887');
 if(!ids.length)txt('NONE YET',X1,Y0+10,'#555');
 const per=14,colW=72;ids.forEach((k,i)=>{const it=ITEMBY[k],x=X1+((i/per)|0)*colW,y=Y0+10+(i%per)*7;if(i>=per*2){if(i===per*2)txt('+'+(ids.length-i)+' MORE',X1+colW,Y0+10+per*7,'#776');return;}
  relicBox(x,y-1,k,6);const n=it.name.slice(0,R.inv[k]>1?10:13)+(R.inv[k]>1?' x'+R.inv[k]:'');txt(n,x+10,y,fxCol(k));row(x,y,colW-4,it.name+': '+it.d,fxCol(k));});
 // ---- enchants on the weapon
 const X2=INVX+158;txt('ENCHANTS '+(R.ench||[]).length+'/'+ENCHMAX,X2,Y0,'#887');
 const ec={};for(const e of R.ench||[])ec[e]=(ec[e]||0)+1;const eks=Object.keys(ec);
 if(!eks.length)txt('NONE YET',X2,Y0+10,'#555');
 eks.forEach((k,i)=>{const E=ENCH.find(x=>x.k===k);if(!E)return;const y=Y0+10+i*8;ctx.fillStyle=E.c;ctx.fillRect(X2,y,5,5);txt(fxLabel(E.n,Math.min(5,ec[k])),X2+8,y,E.c);row(X2,y,140,fxLabel(E.n,Math.min(5,ec[k]))+': '+E.d+' (STACKS '+ec[k]+')',E.c);});
 // ---- scrolls: each ability slot, its spell, the add-ons on it
 const Y2=Y0+14+Math.max(1,eks.length)*8;txt('SCROLLS AND ABILITIES',X2,Y2,'#887');
 let y=Y2+10;for(const k of SLOTS){const sp=SPELLS[k][P.lo[k]];if(!sp)continue;const leg=P.lo[k]===3,lock=P.lock&&P.lock[k];
  txt((SLOTKEY[k]+'   ').slice(0,4),X2,y,'#777');txt(sp.n.slice(0,17)+(leg?' *':''),X2+16,y,lock?'#555':leg?'#ffd040':sp.c||'#ddd');row(X2,y,140,(leg?'LEGENDARY: ':'')+sp.n+' - '+sp.d,leg?'#ffd040':sp.c);
  const A=[];for(const a in (R.addon&&R.addon[k])||{}){const D=SCROLL_ADDONS.find(x=>x.k===a);if(D)A.push([fxLabel(D.n,Math.min(5,R.addon[k][a])),D.c||'#93d6de']);}
  if(P.emp&&P.emp[k])A.push(['EMPOWERED','#ff9040']);
  y+=8;for(const [n,c] of A){if(y>INVY+h-14)break;txt('+ '+n.slice(0,30),X2+16,y,c);row(X2+16,y,124,n,c);y+=7;}
  if(y>INVY+h-14)break;}
 // ---- the hovered row's description along the bottom
 const r=hov();if(r){ctx.fillStyle='rgba(255,255,255,.08)';ctx.fillRect(r.x-1,r.y-1,r.w,8);const L=wrapTxt(r.tip,74);ctx.fillStyle='#120e18';ctx.fillRect(INVX+2,INVY+h-22,w-4,20);ctx.fillStyle='#2e2638';ctx.fillRect(INVX+6,INVY+h-23,w-12,1);L.slice(0,2).forEach((l,i)=>txt(l,INVX+8,INVY+h-19+i*8,r.col||'#ddd'));}
 else txt('HOVER A ROW TO READ IT',INVX+8,INVY+h-12,'#555');
 ctxt('TAB / ESC CLOSE      Q / E SWITCH PAGE',INVY+h+3,'#777');}
{const _di=drawInv;drawInv=function(){if(invPage===1){drawInvList();return;}_di.apply(this,arguments);drawInvTabs();};}
{const _ic=invClick;invClick=function(btn){const t=invTabAt();if(t>=0){invPage=t;sfx('coin');return;}if(invPage===1)return;return _ic.apply(this,arguments);};}
// Q / E / arrows switch the page while the inventory is open (checked before the inventory swallows keys)
addEventListener('keydown',e=>{if(typeof mode==='undefined'||mode!=='play'||!invOpen)return;if(['KeyQ','KeyE','ArrowLeft','ArrowRight'].includes(e.code)){invPage=1-invPage;sfx('coin');}},true);
