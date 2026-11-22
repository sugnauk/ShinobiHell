'use strict';
// Master Kaito: the same traveller at the campfire and the final guardian at his mountaintop temple.
const KAITO={name:'MASTER KAITO, KEEPER OF THE FIRST FLAME',ember:'#ff9860',gold:'#f6ce82',ash:'#a8beca'};
const kaitoArms=[[[27,29],[22,37],[26,44]],[[44,29],[48,37],[47,43]]];
const kaitoArt=hiArt((H,Q)=>{
 const {by,two}=H;
 const rust=two?'#463139':'#994832',shadeRed=two?'#291f2d':'#562a2c',redLight=two?'#75505a':'#c97d54';
 const silk=two?'#b3aeb5':'#e9d9ad',gold=two?'#e9ad64':'#ba975c',skin='#bd8368',lit='#e2af85';
 const navy='#252632',blue='#3c4353',silver='#e4ded0',grey='#827981';
 const far=(Q.far||kaitoArms[0]).map(H.pt),near=(Q.near||kaitoArms[1]).map(H.pt);
 // Long haori tails, split hakama and wrapped calves.
 H.poly([[49,61+by],[91,62+by],[105+(Q.stride||0)*3,133],[82,137],[69,121],[54,138],[38,133]],shadeRed);
 H.poly([[49,66+by],[63,71+by],[60,115],[48,132],[42,131]],rust);
 H.poly([[84,69+by],[91,70+by],[100,131],[86,132],[79,113]],rust);
 for(const [x,y,u,v] of [[46,90,42,127],[55,86,53,123],[91,92,96,128],[84,98,87,126]])H.ln(x,y,u,v,1.5,redLight);
 HIP.legs(H,Q,71,95,(pts)=>{
  HIP.leg(H,...pts,navy,blue,'#5a4036',14);
  const [x,y]=pts[2];
  H.ln(x-5,y-15,x+4,y-14,2,'#837874');H.ln(x-5,y-11,x+4,y-10,2,'#ada398');
  H.ln(x-8,y-4,x+8,y-4,2,'#c89861');
 });
 H.poly([[55,76],[87,76],[96,119],[82,125],[70,115],[58,126],[47,120]],navy);
 H.poly([[55,82],[66,87],[63,116],[52,119]],blue);
 H.poly([[76,85],[83,82],[90,116],[82,120]],'#343745');
 for(const [x,u] of [[58,53],[65,62],[78,80],[86,91]])H.ln(x,91,u,116,1.7,'#5a5260');
 // The folded haori, lined collar, stitched shoulder seams and an ember clasp.
 H.limb(far,15,shadeRed,rust);
 H.poly([[56,48+by],[66,43+by],[83,44+by],[96,55+by],[89,82],[85,94],[54,94],[46,61+by]],rust);
 H.poly([[52,50+by],[65,46+by],[64,70+by],[55,86],[49,80],[47,60+by]],redLight);
 H.poly([[85,47+by],[96,55+by],[88,82],[82,91],[76,87],[83,62+by]],shadeRed);
 H.poly([[60,45+by],[69,48+by],[80,62+by],[74,81],[63,68+by],[56,53+by]],silk);
 H.ln(84,46+by,69,74+by,6,shadeRed);
 H.ln(83,47+by,68,75+by,2,gold);
 for(const [x,y] of [[53,55],[51,60],[51,66],[88,54],[89,60],[87,66]])H.rect(x,y+by,2,2,gold);
 H.poly([[55,79],[88,79],[88,89],[53,89]],'#2b222e');
 H.ln(55,81,87,82,2,gold);H.ln(55,87,86,87,1.5,redLight);
 H.ell(74,84,5,5,shadeRed,1);H.ell(74,84,3.4,3.4,two?KAITO.ember:gold,0);
 H.ln(74,89,81,102,3,redLight);H.ln(78,89,85,99,1.5,gold);
 H.limb(near,15,rust,redLight);
 for(const arm of [far,near]){
  const [x,y]=arm[2];H.ell(x-2,y-3,6,5,navy);H.ln(x-6,y-4,x+3,y-4,2,gold);
  HIP.hand(H,x,y,skin);
 }
 // Silver topknot. After the blackout his tie comes loose and the fire picks out his scar.
 if(two){
  H.poly([[60,23+by],[54,35+by],[46,48+by],[48,60+by],[58,53+by],[66,37+by]],grey);
  H.ln(60,25+by,48,56+by,2,silver);
  H.poly([[74,22+by],[81,24+by],[84,43+by],[89,54+by],[82,52+by],[74,40+by]],silver);
 }else{
  H.ell(62,14+by,8,6,grey);H.ell(61,12+by,6,4,silver);H.rect(61,18+by,9,2,gold);
 }
 H.ell(69,30+by,12,15,grey);
 H.poly([[61,28+by],[68,23+by],[79,25+by],[80,32+by],[84,36+by],[79,38+by],[77,44+by],[69,47+by],[61,40+by]],skin);
 H.poly([[65,29+by],[72,27+by],[79,28+by],[80,34+by],[75,38+by],[65,34+by]],lit,0);
 H.poly([[57,29+by],[60,21+by],[66,17+by],[76,19+by],[81,23+by],[73,23+by],[65,27+by],[62,35+by]],silver);
 H.ln(61,23+by,72,19+by,2,'#fff3d9');H.ln(59,29+by,62,23+by,2,grey);
 H.ln(70,30+by,79,29+by,2,'#443239');H.rect(76,31+by,3,2,two?'#ffbc75':'#242030');
 H.ln(75,32+by,72,40+by,1.4,'#8b5350');
 H.ln(69,40+by,76,38+by,2.3,silver);H.ln(72,44+by,77,43+by,1.7,grey);
 // The practice blade, a raised palm or the curved bow describes the next attack at a glance.
 const [x,y]=near[2];
 if(Q.form==='bow'){
  const high=[x+7,y-29],low=[x+8,y+30];
  H.limb([high,[x+21,y-16],[x+23,y],[x+22,y+15],low],4,gold,'#eed29b');
  H.ln(...high,far[2][0],far[2][1],1.3,silk);H.ln(far[2][0],far[2][1],...low,1.3,silk);
  H.ln(far[2][0],far[2][1],x+28,y,2,two?KAITO.ember:silver);
 }else if(Q.form==='palm'){
  H.ell(x,y,7,7,lit);for(let i=0;i<4;i++)H.ln(x-5+i*3,y-2,x-4+i*3,y-11+(i%3),2.5,lit);
  H.ln(x-4,y+1,x+3,y-2,1.5,'#a86850');
 }else{
  const a=Q.angle??-1.20,dx=Math.cos(a),dy=Math.sin(a),len=Q.blade||49;
  H.limb([[x-dx*14,y-dy*14],[x+dx*len,y+dy*len]],6,'#775038',gold);
  H.ln(x+dx*6,y+dy*6,x+dx*(len-1),y+dy*(len-1),1.5,two?KAITO.ember:'#dbc294');
  H.ln(x-dy*6,y+dx*6,x+dy*6,y-dx*6,3,'#4f3332');HIP.hand(H,x,y,skin);
 }
});
const kaitoPoses={
 idle0:{},idle1:{b:1},atk:{angle:-.16,blade:41,legs:'lunge',near:[[44,29],[52,34],[49,40]]},
 palmWind:{form:'palm',near:[[44,29],[44,23],[45,18]]},
 palmStrike:{form:'palm',legs:'lunge',near:[[44,29],[54,29],[61,29]]},
 bowWind:{form:'bow',far:[[27,29],[31,30],[35,30]],near:[[44,29],[48,31],[51,32]]},
 bowStrike:{form:'bow',far:[[27,29],[30,29],[30,32]],near:[[44,29],[49,29],[54,31]]},
 swordWind:{angle:-2.18,near:[[44,29],[50,24],[48,22]]},
 follow:{angle:.6,blade:37,legs:'lunge',near:[[44,29],[50,33],[53,39]]},
 recovery:{b:2,angle:.5,near:[[44,29],[45,37],[42,46]]},
 cast:{form:'palm',near:[[44,29],[51,25],[53,21]]}
};
humBoss(KAITO.name,kaitoArt,kaitoPoses,{sc:.86});
hiPoses(KAITO.name,kaitoArms);
{
 const posed=BART[KAITO.name].posed,base=posed.pick;
 posed.pick=(e,idx)=>{
  const stance=e.A?.stance;
  if(stance==='recovery')return idx.recovery;
  if(stance==='palm')return e.tele?idx.palmWind:idx.palmStrike;
  if(stance==='bow')return e.tele?idx.bowWind:idx.bowStrike;
  if(stance==='sword')return e.tele?idx.swordWind:idx.atk;
  return base(e,idx);
 };
}
let kaitoCampSheet;
function drawKaito(x,y,scale,flip=false){
 if(!kaitoCampSheet)kaitoCampSheet=bossArt(KAITO.name);
 drawSpr({...kaitoCampSheet,sc:.46*scale},x,y,false,Math.floor(time*2.5)%2,flip);
}

// Three disciplines share the brazier rule: the unlit lane gives you space to move.
const KAITO_TEMPLE={
 base:FERRY_STAGE,remix:false,indoor:false,
 story:'MASTER KAITO WAITS AT THE FIRE ABOVE THE ABYSS',
 tale:'THE FIRE KAITO CARRIED THROUGH THE PROVINCE WAS LIT HERE. AT THE LAST BRAZIER, HE ASKS HIS STUDENT TO SHOW HIM WHAT THE JOURNEY TAUGHT.',
 scn:{gr:['#242431','#312b37'],seal:'tomoe',wall:'temple',out:'garden'},
 scatter:[['shimerock',3],['susuki',3]],
 t:{
  DUN:{name:'THE TEMPLE OF THE FIRST FLAME',fl:['#39313a','#443945'],sp:'#282332',wt:'#211c29',wf:'#40313a',we:'#af7d69',cloth:'#a45540',dark:'#23202e',acc:KAITO.ember,
   pool:['warden','herald','samurai','orbiter','archer','seer']},
  ENV:{k:'temple',liq:0,amt:0,lc:['#211927','#392a32','#ff985d'],wall:'temple',fl:['#39313a','#443945'],sp:'#282332'},
  STAGEDECO:[['susuki',3],['shimerock',3],['offering',2]],
  DECO_GROUPS:[[['offering',-16,0],['shimerock',0,6],['offering',16,0]]],
  FLOORART:FLOORART[CAMPAIGN_END],MOOD:['#291c36',.27],PSTAGE:['hira',45,61],
  BMUSIC:{s:'insen',r:43,b:115,w:'triangle'},BMOTIF:[0,2,5,7,null,5,2,0,null,7,9,7,5,2,0,null],
  TRAILS:{n:'FIRST FLAME',c:KAITO.ember,c2:KAITO.gold},
  BOSS_HPT:17.5,POOLADD:[],PMAP:[.95,.04],BOSSRELIC:null,
  MASTER_LINES:'KAITO SETS HIS BOKKEN BY THE FIRE. YOU HAVE EARNED YOUR REST. IF YOU STILL WISH TO DESCEND, THE ABYSS IS OPEN.',
  BOSS:{name:KAITO.name,hp:2850,hat:'none',pref:90,spd:43,r:11,k1:[],k2:[],pal:basePal('#864838','#472b30',KAITO.ember,'#282331')},
  BSTYLE:{c:KAITO.ember,t:['THREE DISCIPLINES','THE FIRE GOES OUT','THE LAST EMBER'],ph:[[{pat:'gapring',cnt:16,sp:53}],[{pat:'aimedring',cnt:20,sp:58}]]},
  BMODES:['circle','chase']
 }
};
const KAITO_I=lateAdd(KAITO_TEMPLE);
ROMAN[KAITO_I]=romanOf(KAITO_I+1);
const KAITO_APPROACH='BEYOND THE GLASS, A SINGLE BRAZIER BURNS. YOUR MASTER WAITS AT THE TEMPLE WHERE HE LIT THE FIRST FLAME.';
MASTER_LINES[RURI_I]=KAITO_APPROACH;
for(const road of DESCENT_ROADS[RURI_I])road.def.t.MASTER_LINES=KAITO_APPROACH;

const KAITO_FORMS=['palm','bow','sword'];
const KAITO_COLORS={palm:'#ff9c58',bow:'#f6ce82',sword:'#b6d6f0'};
const KAITO_NAMES={palm:'PALM - EMBER RING',bow:'BOW - FIND THE UNLIT LANE',sword:'SWORD - STEP OFF THE CUT'};
function kaitoBowCue(A,y,dir,gap=46){
 return {arena:A,y:clamp(y,A.cy-60,A.cy+60),dir,gap};
}
function kaitoFireRow(e,row){
 const {arena:A,y:gapY,dir,gap}=row,sp=91;
 for(let y=A.y0+12;y<=A.y1-12;y+=14){
  if(Math.abs(y-gapY)<gap/2+3)continue;
  const x=ferryBank(A,y,dir,6),far=ferryBank(A,y,-dir,6);
  if(x==null||far==null||dir*(far-x)<30)continue;
  bsh(e,x,y,dir>0?0:Math.PI,sp,6,{r:2,col:KAITO.gold,spr:'arrow',
   life:Math.abs(far-x)/(sp*(1+.06*(R.asc||0)))});
 }
 sfx('shoot');
}
function kaitoCue(e,sequence,form,second){
 const A=arenaOf(e),col=KAITO_COLORS[form],lead=1.05;
 sequence.stance=form;e.tele=2;
 setToast(KAITO_NAMES[form],col,1.2);
 if(form==='palm'){
  const p=latePoint(A,P.x,P.y,26);
  if(!blocked(p.x,p.y,27))mark({k:'c',x:p.x,y:p.y,r:24,t:lead,dmg:11*e.dm,col,src:e,lateCheck:true});
  sequence.release=()=>{
   const a=aimAt(e);
   bring(e,e.x,e.y,21,56,6,{col,r:3,life:3.6},a+.12,a,.49);
   snd('taiko');
  };
 }else if(form==='bow'){
  sequence.row=kaitoBowCue(A,P.y+(second?24:0),second?-1:1);
  sequence.release=()=>kaitoFireRow(e,sequence.row);
 }else{
  const p=latePoint(A,P.x,P.y,18),a=aimAt(e)+(second?-.65:.22),w=15;
  const back=lateLine(A,p.x,p.y,a+Math.PI,w,70),front=lateLine(A,p.x,p.y,a,w,70);
  if(front+back>20)mark({k:'l',x:p.x-Math.cos(a)*back,y:p.y-Math.sin(a)*back,a,len:front+back,w,t:lead,
   dmg:13*e.dm,col,src:e,lateCheck:true,on:()=>sfx('slash')});
  sequence.release=()=>lateFan(e,{a:aimAt(e),n:9,step:.15,gap:.23,sp:75,col,life:2.1});
 }
 sfx('tool');
}
function kaitoRelease(e,A){
 e.tele=0;A.release?.();A.release=null;A.row=null;
}
const KAITO_ATTACK={
 n:'THREE DISCIPLINES',wt:1,gap:.65,run(e,A){
  if(at(A,0)){
   const n=e.kaitoTurn++%KAITO_FORMS.length;
   A.first=KAITO_FORMS[n];A.second=e.half?KAITO_FORMS[(n+1)%KAITO_FORMS.length]:null;
   kaitoCue(e,A,A.first,false);
  }
  if(at(A,1.05))kaitoRelease(e,A);
  if(A.second&&at(A,1.49))kaitoCue(e,A,A.second,true);
  if(A.second&&at(A,2.54))kaitoRelease(e,A);
  const rest=A.second?2.85:1.37;
  if(at(A,rest)){
   e.tele=0;A.stance='recovery';
   setToast('KAITO LOWERS HIS GUARD',KAITO.gold,1.4);
  }
  return A.t>rest+1.5;
 },end(e,A){A.row=null;}
};
function kaitoBrazier(x,y,active){
 if(active){
  ctx.globalAlpha=.18;wdisc(x,y,28,KAITO.ember);
  ctx.globalAlpha=.22;wdisc(x,y,16,KAITO.gold);
  ctx.globalAlpha=1;
 }
 const X=sx(x,y),Y=sy(x,y);
 ctx.fillStyle='#201521';ctx.fillRect(X-5,Y-8,11,5);ctx.fillRect(X-2,Y-4,5,5);
 ctx.fillStyle=active?'#b57749':'#616276';ctx.fillRect(X-4,Y-8,9,2);ctx.fillRect(X-3,Y,7,1);
 if(active){
  const h=7+Math.round(Math.sin(time*13+x)*1.4);
  ctx.fillStyle='#b54031';ctx.fillRect(X-3,Y-8-h,7,h);
  ctx.fillStyle='#ff9b51';ctx.fillRect(X-2,Y-8-h,5,h-1);
  ctx.fillStyle='#ffe3a0';ctx.fillRect(X,Y-11,2,3);
 }
}
function kaitoLane(row){
 const {arena:A,y,gap}=row;
 ctx.save();worldXf();ctx.globalAlpha=.20;ctx.fillStyle='#f3dac0';
 for(let v=y-gap/2;v<y+gap/2;v+=3){
  const lo=ferryBank(A,v,1,5),hi=ferryBank(A,v,-1,5);
  if(lo!=null&&hi!=null)ctx.fillRect(lo,v,Math.max(0,hi-lo),3);
 }
 ctx.restore();
}
function kaitoFloor(e){
 const A=arenaOf(e),recovering=e.A?.stance==='recovery',dark=e.half&&!recovering;
 if(dark){
  ctx.save();ctx.fillStyle='rgba(14,10,25,.53)';fillVisibleView(sceneBounds);ctx.restore();
 }
 const row=e.A?.row;
 for(const d of [-1,0,1]){
  const y=(row?.y??A.cy)+d*46,x=(row?ferryBank(A,y,row.dir,13):A.cx+80);
  if(x!=null&&!blocked(x,y,10))kaitoBrazier(x,y,row?d!==0:!dark);
 }
 if(row)kaitoLane(row);
}
BKIT[KAITO.name]={
 director:bossDirector,pref:92,noContact:true,gap:.65,halfName:'FIRST FLAME OUT - THE DISCIPLINES LINK',
 init(e){
  e.kaitoTurn=0;
  // The lit guard takes the edge off distant fire while he prepares a form.
  e.onHurt=()=>e.tele&&dist(P,e)>86?.35:1;
 },
 atks:[KAITO_ATTACK], floor:kaitoFloor,
 move(e,dt,d,a){defaultMove(e,dt,d,a,BKIT[KAITO.name]);},
 guide:['KAITO KEEPS THE FIRST FLAME AT HIS MOUNTAINTOP TEMPLE.',
  'PALM: LEAVE THE EMBER CIRCLE. BOW: FIND THE UNLIT LANE. SWORD: STEP SIDEWAYS OFF THE CUT.',
  'DISTANT SHOTS DEAL LESS DURING HIS WIND-UPS. STRIKE WHEN HE LOWERS HIS GUARD.',
  'AT HALF HEALTH HE SNUFFS THE FLAME AND LINKS TWO DIFFERENT FORMS.'],
 hud:e=>e.A?.stance==='recovery'?'GUARD LOWERED - STRIKE':e.half?'THE FIRST FLAME IS OUT - WATCH HIS STANCE':'PALM, BOW, SWORD - WATCH HIS STANCE'
};
// The first room teaches the unlit lane. The last rehearses it with enemies present.
{const base=loadDungeon;loadDungeon=function(di){
 const r=base.apply(this,arguments);
 if(di!==KAITO_I||R.test||R.rush)return r;
 const rooms=map.rooms.filter(r=>r.k==='room'&&r.type==='combat'&&r.w>=9&&r.h>=9).sort((a,b)=>a.ord-b.ord);
 if(rooms.length){
  const first=rooms[0];
  enemies=enemies.filter(e=>e.room!==first);
  map.flameLessons=[first,...rooms.slice(1).slice(-1)].map(room=>({room,t:null,dm:1.3}));
 }
 return r;
};}
{const base=updPlay;updPlay=function(dt){
 const r=base.apply(this,arguments);
 if(!map?.flameLessons||R.test||R.rush||freezeT>0)return r;
 for(const lesson of map.flameLessons){
  if(lesson.t===null&&inRoom(lesson.room,P.x,P.y,1.5)){
   const A=arenaOf(lesson);lesson.row=kaitoBowCue(A,A.cy,1);
   lesson.t=1.6;
   setToast('FOLLOW THE UNLIT LANE',KAITO.gold,2);
  }
  if(lesson.t>0){
   lesson.t-=dt;
   if(lesson.t<=0)kaitoFireRow(lesson,lesson.row);
  }
 }
 return r;
};}
{const base=drawGround;drawGround=function(){
 base.apply(this,arguments);
 for(const lesson of map?.flameLessons||[]){
  if(!(lesson.t>0))continue;
  const {arena:A,y,dir}=lesson.row;
  kaitoLane(lesson.row);
  for(const d of [-1,0,1]){
   const v=y+d*26,x=ferryBank(A,v,dir,9);
   if(x!=null)kaitoBrazier(x,v,d!==0);
  }
 }
};}
lateStagesReady=true;
