'use strict';
// SHINOBIDUNGEONS - a piano score instead of the chiptune. Everything is synthesised in the browser:
//  - the piano: a few slightly inharmonic partials per note, each decaying at its own rate, a soft hammer knock, the
//    attack brightening with velocity; all through a hall reverb and a gentle compressor
//  - the menus: a slow nocturne
//  - each stage: its own key and Japanese scale, a left hand of broken chords and a right-hand melody; it grows
//    denser and louder as foes close in on you (calm -> uneasy -> fighting) and settles again when the room is clear
//  - guardians: a driving left-hand octave ostinato, hammered chords and the melody doubled in octaves; phase two adds
//    rushing arpeggios, phase three lifts the key and hammers clusters, survival phases become a trembling tremolo,
//    and an enraged guardian pushes the tempo
//  - victory: a rising fanfare, then a bright loop; defeat: a slow falling lament
const PN={bus:null,rev:null,dry:null,voices:0,key:null,step:0,next:0,song:null,int:0,lastPh:0,once:{}};
function pianoInit(){if(PN.bus||!AC)return;const c=AC.createDynamicsCompressor();c.threshold.value=-18;c.ratio.value=3;c.attack.value=.01;c.release.value=.25;c.connect(AC.destination);
 PN.bus=AC.createGain();PN.bus.gain.value=musVol()*1.6;
 // a hall: a decaying stereo noise impulse
 const len=Math.floor(AC.sampleRate*2.6),ir=AC.createBuffer(2,len,AC.sampleRate);for(let ch=0;ch<2;ch++){const d=ir.getChannelData(ch);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3.2);}
 PN.rev=AC.createConvolver();PN.rev.buffer=ir;const wet=AC.createGain();wet.gain.value=.32;PN.dry=AC.createGain();PN.dry.gain.value=.85;
 PN.bus.connect(PN.dry);PN.dry.connect(c);PN.bus.connect(PN.rev);PN.rev.connect(wet);wet.connect(c);mus.gain=PN.bus;}
const PPART=[[1,1,1],[2,.42,1.6],[3,.22,2.4],[4,.12,3.4],[5,.06,4.4]];
function piano(t,midi,vel,dur){if(!PN.bus||PN.voices>56||muted)return;const f=440*Math.pow(2,(midi-69)/12),v=clamp(vel,0,1),low=midi<48?1.25:1,len=Math.min(4.5,(dur||1)*(midi<60?2.6:1.8));
 PN.voices++;setTimeout(()=>PN.voices--,len*1000+60);
 const n=midi>84?3:v>.6?5:4;
 for(let i=0;i<n;i++){const [h,a,k]=PPART[i];const o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.setValueAtTime(f*h*Math.sqrt(1+.00035*h*h),t);
  const amp=a*v*.11*low*(i?(.55+v*.6):1);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(amp,t+.004);g.gain.exponentialRampToValueAtTime(amp*.35,t+.08+ .1/k);g.gain.exponentialRampToValueAtTime(.0001,t+len/k*1.4+.05);
  o.connect(g);g.connect(PN.bus);o.start(t);o.stop(t+len/k*1.4+.1);}
 // the hammer
 if(v>.35&&typeof noiseBuf==='function'){const s=AC.createBufferSource(),bp=AC.createBiquadFilter(),g=AC.createGain();s.buffer=noiseBuf();bp.type='bandpass';bp.frequency.value=Math.min(8000,f*3);bp.Q.value=1.2;
  g.gain.setValueAtTime(.02*v,t);g.gain.exponentialRampToValueAtTime(.0001,t+.03);s.connect(bp);bp.connect(g);g.connect(PN.bus);s.start(t);s.stop(t+.05);}}
const PCH=(t,notes,vel,dur,spread)=>notes.forEach((m,i)=>piano(t+(spread||0)*i,m,vel*(1-i*.05),dur));
// ---- the songs ----
const PSC={in:[0,1,5,7,8],yo:[0,2,5,7,9],hira:[0,2,3,7,8],min:[0,2,3,5,7,8,10],kumoi:[0,2,3,7,9],dor:[0,2,3,5,7,9,10],ryu:[0,2,4,6,7,9,11],maj:[0,2,4,5,7,9,11]};
const PSTAGE=[['yo',50,78],['in',48,70],['hira',45,72],['min',47,84],['yo',52,74],['dor',46,86],['in',49,68],['hira',44,76],['kumoi',47,80],['ryu',53,72],['min',50,82],['in',45,88]];
function pSong(seed,scale,root,bpm){let sd=seed*7919+77;const rr=()=>{sd=(sd*16807)%2147483647;return sd/2147483647;};const sc=PSC[scale],N=sc.length,deg=d=>root+sc[((d%N)+N)%N]+12*Math.floor(d/N);
 const prog=[0,[3,4,5][Math.floor(rr()*3)%N],[1,2][Math.floor(rr()*2)],[N-1,N-2][Math.floor(rr()*2)]].map(x=>x%N);
 const mel=[];let m=N*2+2;for(let bar=0;bar<8;bar++)for(let s=0;s<8;s++){if(s%2&&rr()<.45){mel.push(null);continue;}m+=Math.floor(rr()*5)-2;if(s===0)m=N*2+prog[bar%4]+(rr()<.5?0:2);m=clamp(m,N*2-1,N*3+3);mel.push(rr()<.12?null:deg(m));}
 return {sc,N,deg,prog,mel,bpm,root,riff:[0,null,0,1,null,0,2,null,0,null,0,N-1,null,0,1,2].map((x,i)=>x==null?null:x+(i%4===0?0:(rr()<.3?1:0)))};}
const chordOf=(S,d,oct)=>[S.deg(d)+12*(oct||0),S.deg(d+2)+12*(oct||0),S.deg(d+4)+12*(oct||0)];
// how threatened you are: awake foes near you, smoothed
function pThreat(){if(!P||!enemies)return 0;let n=0;for(const e of enemies){if(e.dead||!e.awake||e.prop||e.boss)continue;if(Math.hypot(e.x-P.x,e.y-P.y)<170)n++;}return clamp(n/5,0,1);}
musicTick=function(){
 if(!AC||muted)return;pianoInit();if(!PN.bus)return;PN.bus.gain.value=musVol()*(PN.key&&PN.key.startsWith('boss')?1.15:1.6);
 if(PN.next<AC.currentTime-.25)PN.next=AC.currentTime+.05;
 const playing=mode==='play'&&map&&R,bossOn=playing&&!!(boss&&boss.awake&&!boss.dead&&!R.training);
 const want=mode==='win'?'win':mode==='dead'?'dead':playing?(bossOn?'boss'+R.di:portal?'quiet':(R.training?'stage0':'stage'+R.di)):'menu';
 if(PN.key!==want){PN.key=want;PN.step=0;PN.next=AC.currentTime+.12;PN.lastPh=0;
  if(want==='menu')PN.song=pSong(3,'in',50,62);else if(want==='win')PN.song=pSong(9,'maj',52,96);else if(want==='dead')PN.song=pSong(5,'min',45,52);
  else if(want.startsWith('boss')){const M=(typeof BMUSIC!=='undefined'&&BMUSIC[R.di])||{b:140},st=PSTAGE[R.di]||PSTAGE[0];PN.song=pSong(R.di*31+5,['hira','in','min','kumoi'][R.di%4],st[1]-7,M.b);}
  else if(want.startsWith('stage')){const st=PSTAGE[R.training?0:R.di]||PSTAGE[0];PN.song=pSong((R.training?0:R.di)+1,st[0],st[1],st[2]);}}
 if(want==='quiet'||paused&&playing||invOpen||(P&&P.dying>0&&playing))return;
 const S=PN.song;if(!S)return;
 // ---- victory: a fanfare, then a bright, lilting loop
 if(want==='win'){const sp=60/S.bpm/2;while(PN.next<AC.currentTime+.2){const st=PN.step,t=PN.next;
   if(st<16){const fan=[0,2,4,7,4,7,9,11,12,null,11,12,14,null,null,null][st];if(fan!=null){piano(t,S.root+12+[0,2,4,5,7,9,11,12,14,16,17,19,21,23,24][fan]||S.root+24,.85,.8);if(st%4===0)PCH(t,[S.root-12,S.root,S.root+7],.7,1.6);}}
   else{const i=(st-16)%32,bar=Math.floor((st-16)/8)%4;if(i%8===0)PCH(t,[S.deg(S.prog[bar])-12,...chordOf(S,S.prog[bar])],.5,1.4,.02);else if(i%2===0)piano(t,chordOf(S,S.prog[bar],1)[(i/2)%3],.32,.6);
    const n=S.mel[(st-16)%64];if(n&&i%2===0)piano(t,n+12,.5,.7);}
   PN.step++;PN.next+=sp;}return;}
 // ---- defeat: a slow falling lament, played once
 if(want==='dead'){const sp=60/S.bpm;while(PN.next<AC.currentTime+.2&&PN.step<20){const st=PN.step,t=PN.next;const line=[7,6,5,4,3,2,1,0];
   if(st%2===0&&st<16)piano(t,S.deg(line[st/2]+S.N*2),.45,2.2);if(st%4===0&&st<20)PCH(t,[S.deg(S.prog[(st/4)%4])-12,S.deg(S.prog[(st/4)%4]+2)-12],.35,2.6);
   PN.step++;PN.next+=sp;}return;}
 // ---- guardians
 if(want.startsWith('boss')){const ph=boss.phase||1,surv=boss.storm>0,enr=boss.enraged||boss.enr?1:0,key=(ph>=3?2:0)+enr;
  if(ph!==PN.lastPh){if(PN.lastPh){const t=AC.currentTime+.03;PCH(t,[S.root-12,S.root-5,S.root,S.root+1,S.root+6],1,3);}PN.lastPh=ph;}
  const bpm=S.bpm*(1+.07*(ph-1)+.08*enr)*(surv?.9:1),sp=60/bpm/4;
  while(PN.next<AC.currentTime+.18){const st=PN.step,i=st%16,bar=Math.floor(st/16)%4,t=PN.next,K=x=>x+key,ch=S.prog[bar];
   if(surv){ // a trembling tremolo low down, the melody's first notes held high above it
    piano(t,K(S.deg(ch)-12+(i%2?S.N>5?1:2:0)),.32+.25*(i/16),.25);if(i===0)piano(t,K(S.deg(ch+S.N*2)),.6,2.5);if(i===8&&bar%2)piano(t,K(S.deg(ch+S.N*2+1)),.5,1.5);}
   else{
    // left hand: octave ostinato on the riff
    const r=S.riff[i];if(r!=null){const b=K(S.deg(ch+r)-12);piano(t,b,.62+(i%4===0?.2:0),.35);if(i%4===0)piano(t,b-12,.55,.5);}
    // hammered chords on the downbeats (and the backbeat from phase two)
    if(i===0||(ph>=2&&i===8))PCH(t,chordOf(S,ch,0).map(K),.8,1.2,.006);
    // right hand: the melody on 8ths, doubled an octave up from phase two
    // right hand: the guardian's own theme (BMOTIF), else the generated melody; phase 3 harmonises it a third up
    if(i%2===0){const mo=typeof BMOTIF!=='undefined'&&BMOTIF[R.di];let n=null;if(mo){const d=mo[((bar%2)*8+i/2)];if(d!=null)n=S.deg(d+S.N*2+(bar>=2&&ph>=2?1:0));}else n=S.mel[(bar*8+i/2)%64];
     if(n){piano(t,K(n),.62,.5);if(ph>=2)piano(t,K(n+12),.45,.4);if(ph>=3&&mo)piano(t,K(S.deg((mo[((bar%2)*8+i/2)]||0)+S.N*2+2)),.38,.4);}}
    // phase two: rushing arpeggios up high
    if(ph>=2&&i%2===1)piano(t,K(chordOf(S,ch,2)[(i>>1)%3]),.3,.22);
    // phase three: clusters on every beat
    if(ph>=3&&i%4===0)PCH(t,[K(S.deg(ch)+24),K(S.deg(ch)+25),K(S.deg(ch+1)+24)],.55,.4);
    // a low taiko-like thud under the beat from phase two keeps the drive
    if(ph>=2&&i%4===0){const o=AC.createOscillator(),g=AC.createGain();o.frequency.setValueAtTime(110,t);o.frequency.exponentialRampToValueAtTime(40,t+.15);g.gain.setValueAtTime(.12,t);g.gain.exponentialRampToValueAtTime(.0001,t+.25);o.connect(g);g.connect(PN.bus);o.start(t);o.stop(t+.3);}}
   PN.step++;PN.next+=sp;}return;}
 // ---- menus and stages: broken chords and a melody, more urgent as foes close in
 const thr=want==='menu'?0:pThreat();PN.int+=(thr-PN.int)*.02;const I=PN.int,sp=60/(S.bpm*(1+.25*I))/2;
 while(PN.next<AC.currentTime+.2){const st=PN.step,i=st%8,bar=Math.floor(st/8)%4,t=PN.next,ch=S.prog[bar],c=chordOf(S,ch,0);
  // left hand: the bass on the bar, then the chord broken upward (rolling 16ths when the fight is on)
  if(i===0)piano(t,S.deg(ch)-12,.42+.25*I,2.4);
  if(i>0){const k=[0,1,2,1,2,0,1,2][i];piano(t,c[k],.22+.18*I,1);if(I>.55)piano(t+sp/2,c[(k+1)%3]+12,.18+.15*I,.5);}
  // right hand: the melody (sparser when calm), doubled in octaves when fighting
  const n=S.mel[st%64];if(n&&(i%2===0||I>.3)&&(I>.15||(st*7)%5!==0)){piano(t,n,.36+.3*I,1.1);if(I>.7)piano(t,n-12,.3,.8);}
  // fighting: a low accent on the beat
  if(I>.45&&i%4===0)piano(t,S.deg(ch)-24,.4*I,.6);
  PN.step++;PN.next+=sp;}};
// music in the menus needs the audio context: make it on the first key or click
{const wake=()=>{try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();}catch(_){}};addEventListener('keydown',wake,{capture:true});addEventListener('mousedown',wake,{capture:true});}
// the main loop only ticks music while playing; tick it everywhere
{const _r=render;render=function(){const r=_r.apply(this,arguments);if(mode!=='play')try{musicTick();}catch(_){}return r;};}
