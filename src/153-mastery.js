'use strict';
// SHINOBIDUNGEONS - hero mastery. Every hero earns mastery from its runs (a point per kill, 80 per stage reached, 600 for a
// win) and levels up to 50. Levels unlock that hero's two other starting weapons from its family (III and VI) and five
// palettes (II ember, IV jade, V moon, VII shadow, VIII gold), and level X crowns it a MASTER. Pick them on character
// select: Q/E changes the starting weapon, Z/C the look.
meta.mastery=meta.mastery||{};meta.heroPick=meta.heroPick||{};
const MXP=[0,300,800,1600,3000,5000,8000,12000,17000,25000];
for(let i=10;i<50;i++)MXP.push(MXP[i-1]+8500+(i-10)*520);
const mLevel=k=>{const x=meta.mastery[k]||0;let l=1;for(let i=0;i<MXP.length;i++)if(x>=MXP[i])l=i+1;return l;};
const MPAL=[{n:'CLASSIC',lv:1,f:''},{n:'EMBER',lv:2,f:'hue-rotate(-35deg) saturate(1.4)'},{n:'JADE',lv:4,f:'hue-rotate(120deg) saturate(1.1)'},
 {n:'MOON',lv:5,f:'hue-rotate(200deg) saturate(.6) brightness(1.18)'},{n:'SHADOW',lv:7,f:'grayscale(.7) brightness(.72) contrast(1.25)'},{n:'GOLD',lv:8,f:'sepia(1) saturate(2.6) hue-rotate(-12deg) brightness(1.08)'}];
MPAL.push(
 {n:'SIGNATURE',lv:10,f:'contrast(1.25) saturate(1.3)',fx:1},
 {n:'LACQUER',lv:20,f:'hue-rotate(-55deg) contrast(1.25) saturate(1.6)',fx:1},
 {n:'SPIRIT',lv:30,f:'hue-rotate(70deg) saturate(.65) brightness(1.24)',fx:2},
 {n:'PHANTOM',lv:40,f:'hue-rotate(185deg) contrast(1.3)',fx:3},
 {n:'PRESTIGE',lv:50,f:'sepia(.85) saturate(2.5) brightness(1.22)',fx:4}
);
const MWPNLV=[1,3,6];
const hPick=k=>meta.heroPick[k]||(meta.heroPick[k]={pal:0,wpn:0});
// ---- the look: the hero's sheet with the chosen palette
{const PALC={};const _hs=heroSpr;heroSpr=function(cls,st,back){const s=_hs.apply(this,arguments);const pi=(meta.heroPick[cls]||{}).pal|0;if(!pi||!s||!s.c||!MPAL[pi])return s;
 const key=cls+st+(back?'b':'')+'|'+pi;if(PALC[key])return PALC[key];const c=document.createElement('canvas');c.width=s.c.width;c.height=s.c.height;const g=c.getContext('2d');g.filter=MPAL[pi].f;g.drawImage(s.c,0,0);
 return PALC[key]=Object.assign({},s,{c,_av:null});};}
// ---- the starting weapon
{const _sr=startRun;startRun=function(){const r=_sr.apply(this,arguments);try{if(R&&!R.training&&!R.rush&&R.eq&&R.eq.wpn&&R.eq.wpn.starter){const k=CLS().k,w=hPick(k).wpn|0,fam=WFAM[k]||[];
  if(w>0&&fam[w]&&mLevel(k)>=MWPNLV[w]){R.eq.wpn.wt=fam[w];R.eq.wpn.name='T0 '+fam[w];syncLMB();S=calcStats();P.hp=S.maxhp;}}}catch(_){}return r;};}
// ---- earning mastery
{const _fr=finishRun;finishRun=function(win){let gain=0,k=null,lv0=0;try{if(R&&!R.training&&!R.test&&!R.rush){k=CLS().k;lv0=mLevel(k);gain=(R.kills||0)+(R.di||0)*80+(win?600:0)+(R.masteryRooms||0)*12+(R.masteryBosses||0)*45+(R.techniqueXP||0);meta.mastery[k]=(meta.mastery[k]||0)+gain;}}catch(_){}
 const r=_fr.apply(this,arguments);if(deadInfo&&k){deadInfo.mxp=gain;deadInfo.mlv=mLevel(k);deadInfo.mup=mLevel(k)>lv0;saveMeta();}return r;};}
{const _re=renderEnd;renderEnd=function(){_re.apply(this,arguments);const d=deadInfo;if(!d||!d.mxp)return;const s='MASTERY +'+d.mxp+'  (LEVEL '+d.mlv+(d.mup?' - LEVEL UP!':'')+')';txt(s,W-8-txtW(s),4,d.mup&&Math.floor(time*4)%2?'#fff':'#ffd040');};}
// ---- character select: the mastery plate, and Q/E, Z/C
{const _sk=selectKey;selectKey=function(c){if(!selLock&&selTab===0&&!isLocked(selIdx)){const k=CLASSES[selIdx].k,p=hPick(k),lv=mLevel(k),fam=WFAM[k]||[];
  if(c==='KeyQ'||c==='KeyE'){const d=c==='KeyE'?1:-1;for(let i=1;i<=3;i++){const w=((p.wpn+d*i)%3+3)%3;if(fam[w]&&lv>=MWPNLV[w]){p.wpn=w;break;}}saveMeta();sfx('coin');return;}
  if(c==='KeyZ'||c==='KeyC'){const d=c==='KeyC'?1:-1;for(let i=1;i<=MPAL.length;i++){const q=((p.pal+d*i)%MPAL.length+MPAL.length)%MPAL.length;if(lv>=MPAL[q].lv){p.pal=q;break;}}saveMeta();sfx('coin');return;}}
 return _sk.apply(this,arguments);};}
{const _rs=renderSelect;renderSelect=function(){_rs.apply(this,arguments);if(selTab!==0)return;const C=CLASSES[selIdx];if(!C||isLocked(selIdx))return;const k=C.k,lv=mLevel(k),xp=meta.mastery[k]||0,p=hPick(k),fam=WFAM[k]||[];
 const X=MM.PX+6,Y=8+128+40,w=96;const nx=lv<50?MXP[lv]:null,px=MXP[lv-1];
 txt('MASTERY '+lv,X,Y,lv>=50?'#ffd040':'#e0c080');if(lv>=50)txt('MASTER',X+w-txtW('MASTER'),Y,Math.floor(time*3)%2?'#fff':'#ffd040');
 ctx.fillStyle='#2a2030';ctx.fillRect(X,Y+9,w,3);ctx.fillStyle='#ffd040';ctx.fillRect(X,Y+9,Math.round(w*(nx?clamp((xp-px)/(nx-px),0,1):1)),3);
 txt('Q/E  '+(fam[p.wpn]||WSIG[k]),X,Y+16,'#ddd');txt(nx?xp+' / '+nx+' XP':xp+' XP',X,Y+24,'#777');
 const nextPal=MPAL.find(q=>q.lv>lv);txt('Z/C  '+(MPAL[p.pal]||MPAL[0]).n,X,Y+33,'#ddd');if(nextPal)txt('NEXT LOOK: LV '+nextPal.lv,X+20,Y+41,'#777');};}
