'use strict';
// HELL OF THE EMPEROR - attack builders and foe types (part of the former game.js; files load in numeric order, see index.html)
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
function getSpr(type,di){if(type==='wisp')return wispSprite();if(DUMMYSPR[type])return DUMMYSPR[type];if(ANIM[type])return ANIM[type];const k=type+di;
 if(sprCache[k])return sprCache[k];const pal=typePal(type,DUN[di]);
 return sprCache[k]=FOESPR[type]?foeSprite(type,pal):humanoid(pal,ET[type].hat,type==='brute'||!!ET[type].horns,ET[type].sc||1);}
