'use strict';
// Each depth keeps its existing numbered slot. A route contains the chosen road IDs in depth order.
const DESCENT_ROADS={
 [NEB_I]:[{id:'nebariA',def:LATE[NEB_I-CAMPAIGN_END-1],reward:'SLOW FOES ON CONTACT'},
  {id:'nebariB',def:LAC_STAGE,reward:'PERFECT DODGE POWERS HEAVY HITS'}]
};
MASTER_LINES[FERRY_STAGE]="THE BLACK LAKE HAS DRAINED THROUGH THE FERRYMAN'S GATE. ONE ROAD ENTERS THE SILT CELLARS. THE OTHER RUNS THROUGH THE PALACE LACQUER WORKS.";
const roadOffset=di=>di-FERRY_STAGE-1;
function descentRoad(di,id){
 const roads=DESCENT_ROADS[di];
 return roads?.find(road=>road.id===id)||roads?.[0];
}
function installDescentRoad(di,road){
 if(!road||BOSS[di]?.name===road.def.t.BOSS.name)return;
 lateInstall(road.def,di);
 delete HURTSPR[di];
}
// Register the branch reward once while restoring the default road for older saves and normal stage previews.
installDescentRoad(NEB_I,descentRoad(NEB_I,'nebariB'));
installDescentRoad(NEB_I,descentRoad(NEB_I,'nebariA'));
{const base=loadDungeon;loadDungeon=function(di,roadId){
 const road=descentRoad(di,roadId??R?.route?.[roadOffset(di)]);
 if(road){
  installDescentRoad(di,road);
  if(!R.test&&!R.rush){R.route??=[];R.route[roadOffset(di)]=road.id;}
 }
 const r=base.call(this,di);
 lacquerRooms();
 return r;
};}
{const base=saveRun;saveRun=function(){
 if(R)R.lateLayout=LATE_LAYOUT;
 return base.apply(this,arguments);
};}
{const base=onBossDead;onBossDead=function(e){
 const road=DESCENT_ROADS[e.di]?.find(r=>r.def.t.BOSS.name===e.name);
 if(road&&R&&!R.test&&!R.rush&&!R.training){
  R.roadClears??=[];
  if(!R.roadClears.includes(road.id))R.roadClears.push(road.id);
 }
 return base.apply(this,arguments);
};}
{const base=openMaster;openMaster=function(){
 const r=base.apply(this,arguments);
 if(CS&&DESCENT_ROADS[CS.next])CS.roadPick=0;
 return r;
};}
const choosingDescentRoad=()=>CS?.step===2&&DESCENT_ROADS[CS.next];
function enterDescentRoad(i){
 const road=choosingDescentRoad()?.[i];
 if(!road||time-CS.pageAt<.18)return;
 const next=CS.next;CS=null;mode='play';loadDungeon(next,road.id);sfx('pickup');
}
{const base=advanceMaster;advanceMaster=function(){
 if(choosingDescentRoad())return enterDescentRoad(CS.roadPick);
 return base.apply(this,arguments);
};}
{const base=masterKey;masterKey=function(key){
 if(choosingDescentRoad()){
  if(['ArrowLeft','KeyA','ArrowRight','KeyD','Tab'].includes(key)){CS.roadPick^=1;sfx('coin');return;}
  if(key==='Digit1'||key==='Digit2'){enterDescentRoad(key==='Digit1'?0:1);return;}
 }
 return base.apply(this,arguments);
};}
function roadCard(i){const width=Math.floor((W-30)/2);return {x:10+i*(width+10),y:78,w:width,h:H-101};}
{const base=masterClick;masterClick=function(){
 const roads=choosingDescentRoad();
 if(roads)for(let i=0;i<roads.length;i++){
  const {x,y,w,h}=roadCard(i);
  if(mouse.x>=x&&mouse.x<x+w&&mouse.y>=y&&mouse.y<y+h){enterDescentRoad(i);return;}
 }
 return base.apply(this,arguments);
};}
{const base=renderMaster;renderMaster=function(){
 const roads=choosingDescentRoad();
 if(!roads)return base.apply(this,arguments);
 ctx.fillStyle='#130f19';ctx.fillRect(0,0,W,H);
 const prior=ROMAN[R.di]+'. '+DUN[R.di].name;
 txt(prior,11,7,'#d5b48f');
 masterJourney('#ffd69d');
 masterCamp(time-CS.t0,'#ba8874');
 ctx.fillStyle='#14101c';ctx.fillRect(0,52,W,H-52);
 ctxt('CHOOSE THE ROAD INTO '+roads[0].def.t.ROMAN,59,'#ffe4b8');
 roads.forEach((road,i)=>{
  const {x,y,w,h}=roadCard(i),t=road.def.t,sel=CS.roadPick===i,c=shade(t.DUN.acc,.27);
  ctx.fillStyle=sel?c:'#615165';ctx.fillRect(x,y,w,h);
  ctx.fillStyle=sel?'#30222f':'#241b29';ctx.fillRect(x+1,y+1,w-2,h-2);
  txt((i+1)+'. '+t.DUN.name,x+6,y+8,'#ffe4b8');
  wrapTxt(t.BOSS.name,32).slice(0,2).forEach((l,j)=>txt(l,x+6,y+21+j*8,'#ebdce8'));
  ctx.fillStyle='#664855';ctx.fillRect(x+6,y+40,w-12,1);
  txt(t.BOSSRELIC.name,x+6,y+48,c);
  wrapTxt(road.reward,30).slice(0,2).forEach((l,j)=>txt(l,x+6,y+60+j*8,'#e6ccd3'));
 });
 ctxt(TOUCH?'TAP A ROAD':'LEFT / RIGHT    ENTER TO DESCEND',H-14,'#d9bac4');
};}
{const base=masterJourney;masterJourney=function(accent){
 base.apply(this,arguments);
 const n=Math.min(DUN.length,Math.max(CAMPAIGN_END+1,CS.next+2));
 for(const [di,roads] of Object.entries(DESCENT_ROADS)){
  if(+di>=n||+di>CS.next)continue;
  const chosen=R.route?.[roadOffset(+di)],x=21+Math.round((W-42)*di/(n-1));
  for(let i=0;i<roads.length;i++){
   const on=roads[i].id===chosen,y=19+i*12;
   ctx.fillStyle=on?'#e8b782':'#59475a';ctx.fillRect(x-1,Math.min(y,25),2,Math.abs(25-y));
   disc(x,y,on?3:2,on?'#ffce91':'#67546c');
  }
 }
};}
