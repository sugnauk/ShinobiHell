'use strict';
// HELL OF THE EMPEROR - sound effects and procedural music (part of the former game.js; files load in numeric order, see index.html)
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
// ---- boss music: every guardian has its own theme (scale, tempo, riff), and it escalates with each phase ----
// phase 1: bass riff + drums + lead.  phase 2: faster, adds a counter-arpeggio.  phase 3: faster again, key shifts up,
// double-time hats.  survival phases: drums drop to a heartbeat under a tense drone and tremolo.  enraged: everything up a step.
const BSCALES={phrygian:[0,1,3,5,7,8,10],hira:[0,2,3,7,8],insen:[0,1,5,7,10],harm:[0,2,3,5,7,8,11],kumoi:[0,2,3,7,9],dorian:[0,2,3,5,7,9,10]};
const BMUSIC=[ // per boss (story order): scale, root, tempo, lead wave
 {s:'hira',r:45,b:132,w:'square'},{s:'phrygian',r:43,b:140,w:'sawtooth'},{s:'insen',r:41,b:128,w:'square'},{s:'kumoi',r:47,b:136,w:'triangle'},
 {s:'dorian',r:44,b:124,w:'square'},{s:'harm',r:42,b:138,w:'sawtooth'},{s:'insen',r:46,b:120,w:'triangle'},{s:'phrygian',r:40,b:144,w:'square'},
 {s:'hira',r:43,b:150,w:'sawtooth'},{s:'kumoi',r:45,b:142,w:'square'},{s:'harm',r:44,b:148,w:'sawtooth'},{s:'phrygian',r:38,b:156,w:'sawtooth'}];
function mkBossSong(di){let sd=di*7919+101;const rr=()=>{sd=(sd*16807)%2147483647;return sd/2147483647;};
 const M=BMUSIC[di]||BMUSIC[0],sc=BSCALES[M.s],deg=d=>M.r+sc[((d%sc.length)+sc.length)%sc.length]+12*Math.floor(d/sc.length);
 // a driving 16-step bass riff that repeats every bar, with the last bar of four lifted for tension
 const riff=[];for(let s=0;s<16;s++)riff.push(s%4===0?0:rr()<.55?[0,0,1,2,sc.length-1,-1][Math.floor(rr()*6)]:null);riff[0]=0;riff[8]=rr()<.5?0:sc.length-3;
 const prog=[0,0,[1,2,3][Math.floor(rr()*3)],[sc.length-1,sc.length-2][Math.floor(rr()*2)]];
 const mel=[],arp=[];let m=sc.length+2;
 for(let bar=0;bar<4;bar++)for(let s=0;s<16;s++){
  if(s%2&&rr()<.45)mel.push(null);else{m+=Math.floor(rr()*5)-2;if(s===0)m=sc.length+prog[bar]+(rr()<.5?0:2);m=clamp(m,sc.length,sc.length*2+4);mel.push(s%8===6&&rr()<.4?null:deg(m)+12);}
  arp.push(deg(prog[bar]+[0,2,4,2][s%4]+sc.length)+12);}
 return {M,deg,riff,prog,mel,arp};}
let NOISE=null;function noiseBuf(){if(NOISE)return NOISE;const b=AC.createBuffer(1,AC.sampleRate*.3,AC.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return NOISE=b;}
function musicTick(){
 if(!AC||muted)return;
 if(!mus.gain){mus.gain=AC.createGain();mus.gain.gain.value=musVol();mus.gain.connect(AC.destination);}
 if(mode!=='play'||!map||!map.env||!R){mus.next=AC.currentTime+.1;return;}
 const bossOn=!!(boss&&boss.awake&&!boss.dead&&!R.training);
 // which track: the stage's ambient tune, the boss theme, or silence after a victory until the portal is taken
 const want=bossOn?'boss'+R.di:portal?'quiet':'env'+R.di;
 if(mus.key!==want){const fromBoss=mus.key&&mus.key.startsWith('boss');mus.key=want;mus.step=0;mus.next=AC.currentTime+(bossOn?.05:.4);
  if(bossOn){mus.bsong=mkBossSong(R.di);mus.lastPh=0;}else mus.song=mkSong(R.di,map.env.k);
  if(fromBoss&&!bossOn){const g=mus.gain.gain,t=AC.currentTime;g.cancelScheduledValues(t);g.setValueAtTime(g.value,t);g.linearRampToValueAtTime(.0001,t+.6);g.linearRampToValueAtTime(musVol(),t+3);}}
 if(mus.next<AC.currentTime-.2)mus.next=AC.currentTime+.05;
 if(paused||invOpen||(P&&P.dying>0))return;
 const out=mus.gain;
 const note=(t,f,d,type,v)=>{const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f,t);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(out);o.start(t);o.stop(t+d+.02);};
 const hit=(t,d,v,fq,hp)=>{const s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();s.buffer=noiseBuf();f.type=hp?'highpass':'bandpass';f.frequency.value=fq;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(f);f.connect(g);g.connect(out);s.start(t);s.stop(t+d+.02);};
 const kick=(t,v)=>{const o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(45,t+.12);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+.18);o.connect(g);g.connect(out);o.start(t);o.stop(t+.2);};
 if(want==='quiet')return;
 if(!bossOn){ // ambient stage tune
  const sg=mus.song,spb=60/sg.E.b/2;
  while(mus.next<AC.currentTime+.15){const i=mus.step%32,t=mus.next,n=sg.mel[i],b=sg.bass[i];
   if(n)note(t,mf(n),spb*.9,sg.E.w,sg.E.w==='sawtooth'?.012:.018);
   if(b)note(t,mf(b),spb*1.8,'triangle',.05);
   if(i%2===1)note(t,5000+((i*733)%2000),.02,'square',.004);
   mus.step++;mus.next+=spb;}
  return;}
 // ---- boss theme ----
 const B=mus.bsong,M=B.M,ph=boss.phase||1,surv=boss.storm>0,enr=boss.enraged?1:0;
 if(ph!==mus.lastPh){ // a phase change lands with a crash and a rising sweep
  if(mus.lastPh){const t=AC.currentTime+.02;hit(t,1.2,.09,3000,true);const o=AC.createOscillator(),g=AC.createGain();o.type='sawtooth';o.frequency.setValueAtTime(80,t);o.frequency.exponentialRampToValueAtTime(900,t+.9);g.gain.setValueAtTime(.03,t);g.gain.exponentialRampToValueAtTime(.0001,t+1);o.connect(g);g.connect(out);o.start(t);o.stop(t+1.05);}
  mus.lastPh=ph;}
 const bpm=M.b*(1+.08*(ph-1)+.06*enr)*(surv?.85:1),sp=60/bpm/4,key=(ph>=3?2:0)+enr; // 16th notes; phase 3 lifts the key
 while(mus.next<AC.currentTime+.15){const st=mus.step,i=st%16,bar=Math.floor(st/16)%4,t=mus.next,j=st%64,up=f=>f*Math.pow(2,key/12);
  if(surv){ // survival: a heartbeat, a low drone and a shimmering tremolo - no melody, all tension
   if(i===0||i===3)kick(t,i?.07:.11);
   if(i===0)note(t,up(mf(B.deg(0))),sp*16,'sawtooth',.018);
   if(i%2===0)note(t,up(mf(B.deg(B.prog[bar])+24)),sp*.9,'triangle',.008+.004*(i%4===0));
   if(i===8&&bar%2)hit(t,.4,.025,6000,true);}
  else{
   // drums: kick on the beat (four on the floor from phase 2), snare on 2 and 4, hats on 8ths (16ths in phase 3)
   if(i%4===0&&(ph>=2||i%8===0))kick(t,.12);if(ph===1&&i===10)kick(t,.08);
   if(i===4||i===12)hit(t,.12,.06,1800);
   if(ph>=3?true:i%2===0)hit(t,.03,i%4===2?.02:.012,8000,true);
   if(i===15&&bar===3)hit(t,.08,.05,1800); // fill into the next loop
   // bass riff (octave jump in the lifted bar)
   const rb=B.riff[i];if(rb!=null)note(t,up(mf(B.deg(rb+B.prog[bar]))-0)*(bar===3&&i>=8?2:1),sp*1.6,'sawtooth',.03);
   // lead melody on 8ths
   if(i%2===0){const n=B.mel[(bar*16+i)];if(n)note(t,up(mf(n)),sp*1.8,M.w,M.w==='sawtooth'?.014:.02);}
   // phase 2+: counter arpeggio an octave up
   if(ph>=2){note(t,up(mf(B.arp[bar*16+i]+12)),sp*.8,'square',.007);}
   // phase 3: stabbed power chords on the downbeats
   if(ph>=3&&i%8===0){for(const iv of [0,7,12])note(t,up(mf(B.deg(B.prog[bar])+12+iv)),sp*3,'sawtooth',.008);}}
  mus.step++;mus.next+=sp;}
}
function tone(f,d,type,v,sl,delay){if(muted)return;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();const t=AC.currentTime+(delay||0),o=AC.createOscillator(),g=AC.createGain();o.type=type||'square';o.frequency.setValueAtTime(f,t);if(sl)o.frequency.exponentialRampToValueAtTime(Math.max(30,f+sl),t+d);const sv=(v||.05)*sfxVol();if(sv<.0002)return;g.gain.setValueAtTime(sv,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+d);}catch(e){}}
const SFX={slash:()=>tone(420,.09,'sawtooth',.04,-300),hit:()=>tone(170,.07,'square',.06,-100),deflect:()=>{tone(1500,.12,'square',.06,-500);tone(2200,.09,'triangle',.05,-900,.02);},block:()=>tone(500,.07,'square',.05,-250),hurt:()=>tone(130,.25,'sawtooth',.09,-80),kill:()=>tone(240,.14,'square',.05,-170),break:()=>{tone(320,.3,'sawtooth',.07,-220);tone(90,.4,'square',.07);},pickup:()=>{tone(660,.06,'square',.04);tone(990,.08,'square',.04,0,.06);},dash:()=>tone(250,.1,'triangle',.05,200),tool:()=>tone(700,.1,'square',.05,300),heal:()=>{tone(520,.1,'triangle',.06,200);tone(780,.15,'triangle',.06,200,.1);},boss:()=>{tone(80,.6,'sawtooth',.1,-30);tone(60,.8,'square',.08,-20,.1);},shoot:()=>tone(600,.06,'square',.03,-300),coin:()=>tone(1200,.04,'square',.025),beat:()=>{tone(70,.09,'sine',.12,-20);tone(60,.1,'sine',.1,-20,.14);},graze:()=>tone(1800,.03,'triangle',.02,400),rare:()=>{[784,988,1175,1568,1976].forEach((f,i)=>tone(f,.22,'triangle',.06,0,i*.07));tone(2637,.4,'square',.025,-400,.38);},win:()=>{[523,659,784,1046].forEach((f,i)=>tone(f,.25,'square',.06,0,i*.15));}};
const sfx=n=>{SFX[n]&&SFX[n]();};
