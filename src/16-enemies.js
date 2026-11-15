'use strict';
// HELL OF THE EMPEROR - status effects, elites, extra foes, bullet patterns (part of the former game.js; files load in numeric order, see index.html)
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
 // ---- more animals ----
 defAnimal('hornet',13,9,(R,f)=>{R(3,4,6,3,'#ffd040');R(4,4,1,3,'#14101a');R(6,4,1,3,'#14101a');R(9,3,3,3,'#2a2018');R(11,4,1,1,'#ff3030');R(1,5,2,1,'#c8a020');R(0,5,1,1,'#14101a');
  if(f){R(4,1,4,2,'#d0f0ff');R(5,0,2,1,'#d0f0ff');}else{R(3,2,5,1,'#d0f0ff');}R(4,7,1,2,'#2a2018');R(7,7,1,2,'#2a2018');});
 defAnimal('viper',17,8,(R,f)=>{const s=f?1:0;R(0,4-s,3,2,'#2e7a4a');R(3,3+s,3,2,'#3e9a5a');R(6,4-s,3,2,'#2e7a4a');R(9,3+s,3,2,'#3e9a5a');R(12,2,4,3,'#2e7a4a');R(12,2,4,1,'#6ad08a');R(14,2,1,1,'#ffd040');R(16,4,1,1,'#f03040');for(let x=1;x<12;x+=3)R(x,4,1,1,'#d0e060');});
 defAnimal('kitsune',15,12,(R,f)=>{R(4,4,7,5,'#e8823a');R(5,6,5,3,'#fff0e0');R(10,2,4,4,'#e8823a');R(11,1,1,2,'#e8823a');R(13,1,1,2,'#e8823a');R(12,3,1,1,'#14101a');R(14,4,1,1,'#14101a');R(11,4,2,1,'#fff0e0');
  const t=f?1:0;R(0,2+t,4,2,'#e8823a');R(0,1+t,1,1,'#fff');R(1,5-t,3,2,'#e8823a');R(0,5-t,1,1,'#fff');const l=f?1:0;R(5,9,1,3-l,'#a85a20');R(9,9,1,2+l,'#a85a20');});
 defAnimal('centipede',20,7,(R,f)=>{for(let i=0;i<6;i++){const x=i*3,c=i%2?'#a03018':'#c04020';R(x,2,3,3,c);R(x,2,3,1,'#e06040');const l=(i+(f?1:0))%2;R(x+1,5,1,2-l,'#5a1a0a');R(x+1,0+l,1,2-l,'#5a1a0a');}R(18,2,2,3,'#3a1008');R(19,1,1,1,'#ffd040');R(19,5,1,1,'#ffd040');});
 defAnimal('crab',15,10,(R,f)=>{R(4,3,7,4,'#3a6aa0');R(4,3,7,1,'#6aa0d0');R(6,2,1,1,'#14101a');R(8,2,1,1,'#14101a');const c=f?1:0;R(0,1+c,3,3,'#3a6aa0');R(0,1+c,2,1,'#6aa0d0');R(12,1+c,3,3,'#3a6aa0');R(13,1+c,2,1,'#6aa0d0');R(3,4,1,1,'#3a6aa0');R(11,4,1,1,'#3a6aa0');
  for(const x of [4,6,8,10])R(x,7,1,2+(x/2+c)%2,'#24486a');});
 defAnimal('stag',17,16,(R,f)=>{R(3,7,10,5,'#8a5a32');R(3,7,10,1,'#a87a4a');R(4,10,8,1,'#f0e0c8');R(12,4,3,4,'#8a5a32');R(15,6,2,2,'#a87a4a');R(14,5,1,1,'#14101a');
  R(12,1,1,3,'#e0d0a0');R(11,0,1,2,'#e0d0a0');R(13,0,1,1,'#e0d0a0');R(14,2,1,2,'#e0d0a0');R(15,0,1,2,'#e0d0a0');R(1,7,2,2,'#f0e0c8');const l=f?1:0;
  R(4+l,12,1,4,'#5a3a1a');R(6-l,12,1,4,'#5a3a1a');R(10+l,12,1,4,'#5a3a1a');R(12-l,12,1,4,'#5a3a1a');});
 defAnimal('owl',13,13,(R,f)=>{R(3,3,7,8,'#7a5a3a');R(4,5,5,5,'#c8a878');R(3,1,2,2,'#5a3a22');R(8,1,2,2,'#5a3a22');R(4,3,2,2,'#ffd040');R(7,3,2,2,'#ffd040');R(5,4,1,1,'#14101a');R(8,4,1,1,'#14101a');R(6,5,1,2,'#e0a030');
  if(f){R(0,4,3,4,'#5a3a22');R(10,4,3,4,'#5a3a22');}else{R(1,5,2,5,'#5a3a22');R(10,5,2,5,'#5a3a22');}R(5,11,1,2,'#e0a030');R(7,11,1,2,'#e0a030');});
 defAnimal('beetle',15,10,(R,f)=>{R(2,3,9,6,'#1e5a3a');R(2,3,9,1,'#4ab07a');R(6,3,1,6,'#123a26');R(11,4,2,3,'#14281e');R(13,2,1,3,'#2a4a3a');R(14,1,1,2,'#2a4a3a');R(12,4,1,1,'#ff3030');R(4,4,1,1,'#8af0b0');const l=f?1:0;
  for(const x of [3,6,9])R(x+l,9,1,1,'#0e2018');});
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
 ['boar','rat','tanuki','salamander','toad','monkey','wolf','crane','bat','raven'].forEach((t,i)=>DUN[i].pool.push(t,t));
 // more beasts, each built around a different shot type (lances, zigzags, homing, orbit rings, bounces, webs, venom rain)
 Object.assign(ET,{
  hornet:{animal:1,n:'GIANT HORNET',hp:16,spd:72,pos:12,r:4,ai:'dasher',rng:80,wl:4,fly:1,cdMin:.6,cdMax:1.1,desc:'DARTS IN AND FIRES LANCE STINGERS. WATCH FOR THE AIM LINE',atks:[P2({pat:'lance',cnt:2,spread:.25,sp:210,col:'#ffd040',wait:.4})]},
  viper:{animal:1,n:'JADE VIPER',hp:32,spd:48,pos:24,r:4,ai:'ranged',keep:80,rng:130,wl:6,cdMin:.8,cdMax:1.4,desc:'SPITS ZIGZAG VENOM AND CALLS VENOM RAIN (RED CIRCLES)',atks:[P2({cnt:3,spread:.35,sp:70,col:'#a0ff40',st:'zig'}),P2({pat:'rain',cnt:3,col:'#8f4',rad:16})]},
  kitsune:{animal:1,n:'KITSUNE',hp:40,spd:56,pos:30,r:5,ai:'dasher',rng:110,wl:6,cdMin:.9,cdMax:1.5,desc:'BLINKS AROUND. FOX-FIRE ORBITS THEN SPIRALS OUT, FLAMES SEEK YOU',atks:[P2({pat:'orbitring',cnt:6,col:'#ff9040',ow:3,orv:30}),P2({cnt:2,spread:.5,sp:70,col:'#ffb060',st:'seek',turn:1.8,seekT:1.8})]},
  centipede:{animal:1,n:'GIANT CENTIPEDE',hp:75,spd:40,pos:60,r:6,ai:'melee',rng:90,wl:10,cdMin:1,cdMax:1.7,desc:'CHARGES IN STRAIGHT LINES AND SPRAYS ZIGZAG WALLS',atks:[CH({w:.55,sp:230,dur:.6,dmg:20,dmin:30})],volley:P2({pat:'wall',cnt:9,sp:60,col:'#e06040',st:'zig'})},
  crab:{animal:1,n:'RIVER CRAB',hp:55,spd:30,pos:50,r:6,ai:'ranged',keep:70,rng:120,wl:8,cdMin:1,cdMax:1.7,desc:'BLOWS BUBBLES THAT BOUNCE OFF WALLS TWICE',atks:[P2({cnt:5,spread:.9,sp:65,col:'#80c0ff',st:'bounce',bn:2})]},
  stag:{animal:1,n:'GHOST STAG',hp:80,spd:46,pos:64,r:6,ai:'melee',rng:100,wl:10,cdMin:1,cdMax:1.8,desc:'CHARGES WITH ITS ANTLERS AND BURSTS WEBS OF LIGHT',atks:[CH({w:.6,sp:250,dur:.6,dmg:24,dmin:30})],volley:P2({pat:'web',cnt:8,rings:2,sp:52,col:'#e0d0a0'})},
  owl:{animal:1,n:'HORNED OWL',hp:34,spd:46,pos:26,r:5,ai:'ranged',keep:110,rng:160,wl:6,fly:1,cdMin:.9,cdMax:1.5,desc:'HOMING FEATHERS AND A SNIPING LANCE',atks:[P2({cnt:3,spread:.6,sp:60,col:'#d8c8a0',st:'seek',turn:2.2,seekT:2}),P2({pat:'lance',cnt:1,sp:230,col:'#fff',wait:.55})]},
  beetle:{animal:1,n:'RHINO BEETLE',hp:90,spd:26,pos:80,r:6,ai:'melee',rng:40,wl:12,cdMin:1.2,cdMax:2,desc:'SLOW AND ARMOURED. SLAMS, THEN RINGS OF ORBITING SHELLS',atks:[SM({w:.8,rad:34,dmg:24,peril:true})],volley:P2({pat:'orbitring',cnt:8,col:'#6ad89a',ow:2,orv:26})}});
 [['hornet'],['centipede'],['owl'],['beetle'],['crab'],['kitsune'],['stag'],['viper'],['centipede'],['kitsune']].forEach((l,i)=>l.forEach(t=>DUN[i].pool.push(t,t)));}
function deathFx(e){const k=e.t&&e.t.death;if(!k||e.boss)return;
 if(k==='boom')dh.push({x:e.x,y:e.y,r:26,t:.45,dmg:14*e.dm,col:'#ff8a30'});
 else if(k==='ring'){const n=10,c=e.type==='frog'?'#8f4':'#d080ff';for(let i=0;i<n;i++){const a=i/n*TAU;projs.push(mkProj('e',e.x,e.y,a,55,8*e.dm,{col:c,own:null}));}}}
['wisp','shielder','shaman','sniper','assassin'].forEach(t=>ovIf(t,'e_'+t+'.png',32,32));
let wispSpr=null;
function wispSprite(){
 if(wispSpr)return wispSpr;
 const rows=['...oooo...','..owwwwo..','.owwyywwo.','owwkyykwwo','owwyyyywwo','.owwwwwwo.','.owwwwwwo.','..owowwo..','..o.oo.o..'],pal={o:'#3a1008',w:'#ff8a30',y:'#ffe080',k:'#14101a'};
 const c=mk(10,14,g=>{rows.forEach((r,y)=>{for(let x=0;x<10;x++){const ch=r[x];if(!ch||ch==='.')continue;g.fillStyle=pal[ch];g.fillRect(x,y+3,1,1);}});});
 return (wispSpr={c,wc:whiteOf(c),fw:10,fh:14,frames:1,sc:1});
}
