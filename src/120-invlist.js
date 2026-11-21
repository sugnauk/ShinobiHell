'use strict';
// ===== THE INVENTORY, rebuilt =====
// Built on a few modern inventory principles:
//  - ONE DETAIL CARD in a fixed place: whatever you point at (or select with the keys) is described in full on the right,
//    so the eye always knows where to look; the grid itself stays clean.
//  - GLANCEABLE STATE: rarity-coloured frames, tier badges, green/red arrows on pack items that are better/worse than what
//    you wear, NEW markers on items you have not looked at yet, a pack capacity bar.
//  - LIVE PREVIEW: pointing at a pack item shows every stat as it would be if you equipped it (+/- in green/red).
//  - SAFE, CONTEXTUAL ACTIONS: the footer always says what LMB / RMB / keys will do to the thing under the cursor; dropping
//    or selling asks for a second press.
//  - FULL KEYBOARD PLAY: arrows move the selection, ENTER equips, X drops, S sorts the pack, Q / E change tab.
//  - TABS FOR EVERYTHING YOU OWN: GEAR (paper doll, pack, stats, sets), RELICS (an icon grid with stack counts) and SPELLS
//    (each ability with its scroll add-ons, the weapon's enchants).
let invPage=0,invSel=0,invArm=null,invRows=[];
const IX=6;let IY=6,IW=W-12,IH=H-16;
const INVTABS=[{n:'GEAR'},{n:'RELICS'},{n:'SPELLS'}];
const INV_SLOTS=()=>{const L=[{x:IX+14,y:IY+46,eq:'wpn'},{x:IX+88,y:IY+30,eq:'arm'},{x:IX+88,y:IY+58,eq:'ring'}];
 for(let i=0;i<PACKMAX;i++)L.push({x:IX+122+(i%4)*21,y:IY+32+((i/4)|0)*22,pi:i});return L;};
const slotItem=s=>s?(s.eq?R.eq[s.eq]:R.pack[s.pi]):null;
const relicCount=()=>Object.keys(R.inv||{}).reduce((a,k)=>a+(ITEMBY[k]&&R.inv[k]>0?R.inv[k]:0),0);
const tabRects=()=>{let x=IX+52;return INVTABS.map((t,i)=>{const n=t.n+(i===1?' '+relicCount():''),w=txtW(n)+8,r={x,y:IY+1,w,h:10,n};x+=w+3;return r;});};
invAt=function(){if(invPage!==0)return -1;return INV_SLOTS().findIndex(s=>mouse.x>=s.x-2&&mouse.x<s.x+16&&mouse.y>=s.y-2&&mouse.y<s.y+16);};
// ---- stats with a different item in a slot (the live preview), cached per item
let invPrevK=null,invPrevS=null;
function statsWith(slot,g){if(invPrevK===g&&invPrevS)return invPrevS;const old=R.eq[slot],oe=R.ench;R.eq[slot]=g;if(slot==='wpn')R.ench=g?(g.ench||[]):[];let s;try{s=calcStats();}finally{R.eq[slot]=old;R.ench=oe;}invPrevK=g;invPrevS=s;return s;}
const STATROWS=[['POWER',s=>Math.round(s.atk),''],['MAX HP',s=>s.maxhp,''],['DEFENCE',s=>s.def,''],['CRIT',s=>Math.round((s.crit||0)*100),'%'],['CAST SPEED',s=>Math.round((s.aspd||1)*100),'%'],['COOLDOWNS',s=>-Math.round((1-(s.cdr||1))*100),'%'],['MOVE SPEED',s=>Math.round(s.spd||0),'']];
// is a pack item better than what is worn in its slot? (+1 better, -1 worse, 0 same)
function upgradeOf(g){const cur=R.eq[g.slot];if(!cur)return 1;const a=gearVals(g),b=gearVals(cur),k=a.atk!=null?'atk':a.hp!=null?'hp':'sv';const d=(a[k]||0)-(b[k]||0)+(g.q||0)-(cur.q||0)+(g.rare?3:0)-(cur.rare?3:0);return d>0?1:d<0?-1:0;}
// ---- drawing helpers
function ipanel(x,y,w,h,title,col){ctx.fillStyle='#16111e';ctx.fillRect(x,y,w,h);ctx.fillStyle='#241c30';ctx.fillRect(x,y,w,1);ctx.fillRect(x,y,1,h);ctx.fillStyle='#0a080e';ctx.fillRect(x,y+h-1,w,1);ctx.fillRect(x+w-1,y,1,h);if(title)txt(title,x+4,y+3,col||'#8a7a8a');}
function arrowUp(x,y,c){ctx.fillStyle=c;ctx.fillRect(x+2,y,1,1);ctx.fillRect(x+1,y+1,3,1);ctx.fillRect(x,y+2,5,1);}
function arrowDn(x,y,c){ctx.fillStyle=c;ctx.fillRect(x,y,5,1);ctx.fillRect(x+1,y+1,3,1);ctx.fillRect(x+2,y+2,1,1);}
function cornerBox(x,y,w,h,c){ctx.fillStyle=c;for(const [a,b,dx,dy] of [[x,y,1,1],[x+w-1,y,-1,1],[x,y+h-1,1,-1],[x+w-1,y+h-1,-1,-1]]){ctx.fillRect(Math.min(a,a+dx*3),b,4,1);ctx.fillRect(a,Math.min(b,b+dy*3),1,4);}}
function slotFrame(s,g,sel,hov){drawItemIcon(g,s.x,s.y);
 if(!g&&s.eq){ctx.globalAlpha=.35;txt(GEARG[s.eq],s.x+5,s.y+4,'#887');ctx.globalAlpha=1;}
 if(sel||hov)cornerBox(s.x-3,s.y-3,20,20,sel?'#ffffff':'#ffd070');
 if(g&&s.pi!==undefined){txt(g.tier+1,s.x+(g.tier>=9?8:11),s.y+9,'#fff');const u=upgradeOf(g);if(u>0)arrowUp(s.x,s.y+1,'#5fe06a');else if(u<0)arrowDn(s.x,s.y+1,'#e05a5a');
  if(!g._seen){ctx.fillStyle=Math.floor(time*3)%2?'#ffd040':'#fff6c0';ctx.fillRect(s.x+11,s.y,3,3);}}}
// ---- the detail card (right column)
function detailCard(x,y,w,h,g,s){ipanel(x,y,w,h);if(!g){txt(s&&s.eq?'EMPTY '+SLOTNAME[s.eq]+' SLOT':'POINT AT AN ITEM',x+5,y+5,'#666');txt(s&&s.eq?'EQUIP ONE FROM YOUR PACK':'TO SEE IT HERE',x+5,y+13,'#555');return;}
 const col=itemCol(g),L=gearLines(g);ctx.fillStyle=col;ctx.fillRect(x,y,w,1);drawItemIcon(g,x+5,y+5);
 wrapTxt(g.name,Math.floor((w-26)/4)).slice(0,2).forEach((l,i)=>txt(l,x+23,y+5+i*7,col));
 txt(L[0],x+5,y+23,'#998');let yy=y+33;
 for(const l of L.slice(1)){for(const p of wrapTxt(l,Math.floor((w-10)/4))){if(yy>y+h-24)break;txt(p,x+5,yy,/SET PIECE/.test(l)?((SETS[setOf(g)]||{}).c||'#ddd'):/^ENCH/.test(l)?'#c8a0ff':/^LMB/.test(l)?'#8cf':'#ddd');yy+=7;}yy+=1;}
 const worn=s&&s.eq;txt(worn?'EQUIPPED':(inShop()?'SELLS FOR '+sellPrice(g):'IN YOUR PACK'),x+5,y+h-11,worn?'#5fe06a':inShop()?'#ffd040':'#776');
 if(!worn){const c=cmpLine(g);txt(c.s.replace(' VS NOW',''),x+w-5-txtW(c.s.replace(' VS NOW','')),y+h-11,c.c);}}
// ---- the GEAR tab
function drawGearTab(){const SL=INV_SLOTS(),hv=invAt();if(hv>=0)invSel=hv;invSel=clamp(invSel,0,SL.length-1);const sel=invSel,s=SL[sel],g=slotItem(s);
 ipanel(IX+4,IY+14,106,66,'EQUIPPED');{const C=CLS(),sp=heroSpr(C.k,P.evo||0),f=WIZ.idle[Math.floor(time*2.5)%2];ctx.fillStyle='#0e0b14';ctx.fillRect(IX+36,IY+26,44,50);
  ctx.globalAlpha=.3;ctx.fillStyle=R.eq.wpn?itemCol(R.eq.wpn):'#444';ctx.fillRect(IX+38,IY+72,40,3);ctx.globalAlpha=1;ctx.drawImage(sp.c,f*sp.fw,0,sp.fw,sp.fh,IX+58-sp.fw,IY+74-sp.fh*2,sp.fw*2,sp.fh*2);}
 for(const k of ['wpn','arm','ring']){const i=SL.findIndex(q=>q.eq===k),q=SL[i];slotFrame(q,R.eq[k],i===sel,i===hv);txt(SLOTNAME[k],q.x+7-Math.round(txtW(SLOTNAME[k])/2),q.y+17,'#665');}
 ipanel(IX+114,IY+14,96,66,'PACK');{const n=R.pack.length,bw=36;txt(n+'/'+PACKMAX,IX+142,IY+17,n>=PACKMAX?'#f66':'#887');ctx.fillStyle='#0a080e';ctx.fillRect(IX+168,IY+18,bw,3);ctx.fillStyle=n>=PACKMAX?'#e05a5a':'#7a6a9a';ctx.fillRect(IX+168,IY+18,Math.round(bw*n/PACKMAX),3);}
 SL.forEach((q,i)=>{if(q.pi!==undefined)slotFrame(q,R.pack[q.pi],i===sel,i===hv);});
 ipanel(IX+4,IY+82,106,IH-84,'STATS');const prev=g&&s.pi!==undefined?statsWith(g.slot,g):null;
 STATROWS.forEach(([n,f,u],i)=>{const y=IY+92+i*8,v=f(S);txt(n,IX+8,y,'#998');const vs=v+u;txt(vs,IX+76-txtW(vs),y,'#eee');
  if(prev){const d=f(prev)-v;if(d){const ds=(d>0?'+':'')+d+u,good=n==='COOLDOWNS'?d<0:d>0;txt(ds,IX+106-txtW(ds),y,good?'#5fe06a':'#e05a5a');}}});
 if(prev)txt('IF EQUIPPED',IX+66,IY+85,'#5a6a5a');
 ipanel(IX+114,IY+82,96,IH-84,'SET BONUSES');{const SLN=setLines();if(!SLN.length){txt('WEAR 2-3 RARE PIECES',IX+118,IY+93,'#555');txt('OF ONE SET FOR POWERS',IX+118,IY+100,'#555');}
  else{let y=IY+93;for(const l of SLN)for(const p of wrapTxt(l.s,22)){if(y>IY+IH-10)break;txt(p,IX+118,y,l.c);y+=7;}}}
 detailCard(IX+214,IY+14,IW-218,IH-16,g,s);
 if(g&&s.pi!==undefined&&hv===sel)g._seen=1;
 const P1=!g?'':s.pi!==undefined?'LMB/ENTER EQUIP':'LMB/ENTER UNEQUIP',P2=!g?'':inShop()?(invArm===g?'RMB AGAIN: SELL':'RMB/X SELL'):(invArm===g?'RMB/X AGAIN: DROP':'RMB/X DROP');
 return [P1,P2,'S SORT'].filter(Boolean).join('   ');}
// ---- the RELICS tab: an icon grid, rarest first, stack counts, one card
function drawRelicTab(){invRows=[];const ids=Object.keys(R.inv||{}).filter(k=>R.inv[k]>0&&ITEMBY[k]).sort((a,b)=>(ITEMBY[b].r||0)-(ITEMBY[a].r||0)||ITEMBY[a].name.localeCompare(ITEMBY[b].name));
 const RW=IW-218-4;ipanel(IX+4,IY+14,206,IH-16,relicCount()+' RELICS, '+ids.length+' KINDS');
 if(!ids.length){txt('NO RELICS YET',IX+10,IY+28,'#555');txt('BOSSES, CHESTS AND SHRINES GIVE THEM',IX+10,IY+36,'#555');}
 const per=11;ids.forEach((k,i)=>{const x=IX+10+(i%per)*18,y=IY+26+((i/per)|0)*18;relicBox(x,y,k,13);if(R.inv[k]>1){const n='x'+R.inv[k];ctx.fillStyle='#0a080e';ctx.fillRect(x+13-txtW(n),y+8,txtW(n)+2,6);txt(n,x+14-txtW(n),y+9,'#fff');}
  invRows.push({x:x-1,y:y-1,w:16,h:16,k});});
 const hv=invRows.find(r=>mouse.x>=r.x&&mouse.x<r.x+r.w&&mouse.y>=r.y&&mouse.y<r.y+r.h);if(hv)invSel=invRows.indexOf(hv);const sr=invRows.length?invRows[clamp(invSel,0,invRows.length-1)]:null;
 if(sr)cornerBox(sr.x-1,sr.y-1,18,18,'#ffd070');
 const x=IX+214,y=IY+14,w=IW-218,h=IH-16;ipanel(x,y,w,h);
 if(sr){const it=ITEMBY[sr.k],c=fxCol(sr.k);ctx.fillStyle=c;ctx.fillRect(x,y,w,1);relicBox(x+5,y+6,sr.k,13);wrapTxt(it.name,Math.floor((w-26)/4)).slice(0,2).forEach((l,i)=>txt(l,x+23,y+6+i*7,c));
  txt(['COMMON','UNCOMMON','RARE','LEGENDARY'][it.r||0]+' RELIC',x+5,y+24,'#998');let yy=y+34;for(const p of wrapTxt(it.d,Math.floor((w-10)/4))){txt(p,x+5,yy,'#ddd');yy+=7;}
  txt('HELD '+R.inv[sr.k]+' | EFFECT '+cdPct(relicPower(sr.k)),x+5,y+h-19,'#aaa');
  txt(relicLimit(sr.k)===1?'SINGLE COPY':'STACKS: 100% / 150% / 175%',x+5,y+h-10,'#887');}
 else txt('POINT AT A RELIC',x+5,y+5,'#666');
 return 'ARROWS MOVE';}
// ---- the SPELLS tab: abilities with their scrolls, and the weapon's enchants
function drawSpellTab(){invRows=[];ipanel(IX+4,IY+14,206,IH-16,'ABILITIES AND SCROLLS');let y=IY+26;
 for(const k of SLOTS){const sp=SPELLS[k][P.lo[k]];if(!sp)continue;const leg=P.lo[k]===3,lock=P.lock&&P.lock[k];
  ctx.fillStyle='#0a080e';ctx.fillRect(IX+9,y-2,13,13);try{ctx.drawImage(spellIcon(sp),IX+10,y-1);}catch(e){}txt((SLOTKEY[k]+'   ').slice(0,4),IX+26,y+2,'#776');
  txt(sp.n,IX+44,y,lock?'#555':leg?'#ffd040':sp.c||'#ddd');if(leg)txt('LEGENDARY',IX+48+txtW(sp.n),y,'#a08020');
  invRows.push({x:IX+8,y:y-2,w:200,h:12,tip:[sp.n,(leg?'LEGENDARY SCROLL SPELL. ':'')+sp.d],c:leg?'#ffd040':(sp.c||'#ddd')});
  const A=[];for(const a in (R.addon&&R.addon[k])||{}){const D=SCROLL_ADDONS.find(x=>x.k===a);if(D)A.push([fxLabel(D.n,Math.min(5,R.addon[k][a])),D.c||'#93d6de']);}
  if(P.emp&&P.emp[k])A.push(['EMPOWERED','#ff9040']);
  let cx=IX+44;for(const [n,c] of A){const w=txtW(n)+4;if(cx+w>IX+208)break;ctx.fillStyle='#0a080e';ctx.fillRect(cx,y+7,w,7);ctx.fillStyle=c;ctx.fillRect(cx,y+7,1,7);txt(n,cx+2,y+8,c);invRows.push({x:cx,y:y+7,w,h:7,tip:[n,'SCROLL ADD-ON ON '+sp.n],c});cx+=w+2;}
  y+=A.length?17:13;}
 y+=2;txt('WEAPON ENCHANTS '+(R.ench||[]).length+'/'+ENCHMAX,IX+8,y,'#8a7a8a');y+=9;const ec={};for(const e of R.ench||[])ec[e]=(ec[e]||0)+1;
 if(!Object.keys(ec).length)txt('NONE YET: ENCHANTS GO ON YOUR WEAPON',IX+10,y,'#555');
 let ex=IX+10;for(const k in ec){const E=ENCH.find(x=>x.k===k);if(!E)continue;ctx.drawImage(itemIcon({t:'ench',k}),ex,y-2);const n=fxLabel(E.n,Math.min(5,ec[k]));txt(n,ex+15,y+1,E.c);invRows.push({x:ex,y:y-2,w:txtW(n)+16,h:13,tip:[n,E.d+'. STACKS: '+ec[k]],c:E.c});ex+=txtW(n)+22;if(ex>IX+180){ex=IX+10;y+=14;}}
 const hv=invRows.find(r=>mouse.x>=r.x&&mouse.x<r.x+r.w&&mouse.y>=r.y&&mouse.y<r.y+r.h);const x=IX+214,yy=IY+14,w=IW-218,h=IH-16;ipanel(x,yy,w,h);
 if(hv){ctx.fillStyle='rgba(255,255,255,.07)';ctx.fillRect(hv.x,hv.y,hv.w,hv.h);ctx.fillStyle=hv.c;ctx.fillRect(x,yy,w,1);let ly=yy+6;for(const p of wrapTxt(hv.tip[0],Math.floor((w-10)/4))){txt(p,x+5,ly,hv.c);ly+=7;}ly+=4;for(const p of wrapTxt(hv.tip[1],Math.floor((w-10)/4))){txt(p,x+5,ly,'#ddd');ly+=7;}}
 else{txt('POINT AT AN ABILITY,',x+5,yy+6,'#666');txt('A SCROLL OR AN ENCHANT',x+5,yy+13,'#666');}
 return '';}
// ---- the whole screen
drawInv=function(){IY=TOUCH?touchHudRowBottom():6;IW=W-12;IH=H-IY-10;ctx.fillStyle='rgba(4,2,8,.72)';ctx.fillRect(0,0,W,H);ctx.fillStyle='#100c16';ctx.fillRect(IX,IY,IW,IH);ctx.fillStyle='#d02030';ctx.fillRect(IX,IY,IW,1);ctx.fillRect(IX,IY+IH-1,IW,1);
 txt('INVENTORY',IX+5,IY+3,'#d02030');
 tabRects().forEach((r,i)=>{const on=i===invPage;ctx.fillStyle=on?'#3a2434':'#1a1420';ctx.fillRect(r.x,r.y,r.w,r.h);if(on){ctx.fillStyle='#d02030';ctx.fillRect(r.x,r.y+r.h-1,r.w,1);}txt(r.n,r.x+4,r.y+2,on?'#fff':'#887');});
 {const g='GOLD '+R.sen;txt(g,IX+IW-5-txtW(g),IY+3,'#ffd040');}
 const hint=invPage===0?drawGearTab():invPage===1?drawRelicTab():drawSpellTab();
 ctxt([hint,'Q/E TAB','TAB CLOSE'].filter(Boolean).join('   '),IY+IH+2,'#8a7a8a');};
// ---- mouse: tabs, equip / unequip, drop or sell with a confirming second press
function invDoDrop(s,g){if(invArm!==g){invArm=g;sfx('block');return;}invArm=null;
 if(s.pi!==undefined)R.pack.splice(s.pi,1);else R.eq[s.eq]=null;if(inShop())sellGear(g);else{dropGear(g);setToast('DROPPED '+g.name,'#aaa',1.5);}if(s.eq==='wpn')syncLMB();S=calcStats();P.hp=Math.min(S.maxhp,P.hp);invPrevK=null;}
function invDoUse(s,g){if(!g)return;if(s.pi!==undefined){equipFromPack(s.pi);if(g.slot==='wpn')syncLMB();S=calcStats();}else{if(R.pack.length>=PACKMAX){setToast('PACK FULL','#f66',1.5);sfx('block');return;}R.pack.push(g);R.eq[s.eq]=null;if(s.eq==='wpn')syncLMB();S=calcStats();P.hp=Math.min(S.maxhp,P.hp);sfx('tool');}invPrevK=null;invArm=null;}
invClick=function(btn){const t=tabRects().findIndex(r=>mouse.x>=r.x&&mouse.x<r.x+r.w&&mouse.y>=r.y&&mouse.y<r.y+r.h);if(t>=0){invPage=t;invSel=0;sfx('coin');return;}
 if(invPage!==0)return;const k=invAt();if(k<0)return;const s=INV_SLOTS()[k],g=slotItem(s);invSel=k;if(!g)return;if(btn===0)invDoUse(s,g);else if(btn===2)invDoDrop(s,g);};
// ---- keys (captured before the game swallows them while the inventory is open)
function invSort(){const ord={wpn:0,arm:1,ring:2};R.pack.sort((a,b)=>(ord[a.slot]-ord[b.slot])||((b.rare?5:b.q||0)-(a.rare?5:a.q||0))||(b.tier-a.tier));sfx('tool');setToast('PACK SORTED','#aaa',1);}
addEventListener('keydown',e=>{if(typeof mode==='undefined'||mode!=='play'||!invOpen)return;const c=e.code;
 if(c==='KeyQ'||c==='KeyE'){invPage=(invPage+(c==='KeyE'?1:2))%3;invSel=0;invArm=null;sfx('coin');return;}
 if(invPage===0){const SL=INV_SLOTS(),n=SL.length;
  // arrows walk the doll (columns 0-1) and the 4x2 pack (columns 2-5) as one grid
  const pos=i=>i<3?[[0,0],[1,0],[1,1]][i]:[2+((i-3)%4),((i-3)/4)|0],at=(x,y)=>x===0?0:x===1?(y?2:1):3+Math.min(3,x-2)+Math.min(1,y)*4;
  const [x,y]=pos(invSel);let nx=x,ny=y;if(c==='ArrowLeft'||c==='KeyA')nx=Math.max(0,x-1);if(c==='ArrowRight'||c==='KeyD')nx=Math.min(5,x+1);if(c==='ArrowUp'||c==='KeyW')ny=0;if(c==='ArrowDown')ny=1;
  if(nx!==x||ny!==y){invSel=clamp(at(nx,ny),0,n-1);invArm=null;sfx('coin');return;}
  const s=SL[invSel],g=slotItem(s);if((c==='Enter'||c==='Space')&&g)invDoUse(s,g);if(c==='KeyX'&&g)invDoDrop(s,g);if(c==='KeyS')invSort();}
 else if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(c)){const d=c==='ArrowRight'?1:c==='ArrowLeft'?-1:c==='ArrowDown'?11:-11;invSel=clamp(invSel+d,0,Math.max(0,invRows.length-1));}},true);
{const _ci=closeInv;closeInv=function(){invArm=null;invPrevK=null;return _ci.apply(this,arguments);};}
