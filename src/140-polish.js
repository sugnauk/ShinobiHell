'use strict';
// SHINOBIDUNGEONS - polish (a separate batch from the requested changes):
//  1. The end of a run shows the march: the death and victory screens draw the province map with the road you took
//     and where it ended ("THE MARCH HALTED AT VI. THE OUTER WALLS").
//  2. The guide gets a CHRONICLE tab: the story of the invasion, one entry per stage, unlocked as you reach it, with
//     the map showing where that stage lies.
//  3. The indoor halls feel lived-in: dust drifts through the lamplight in the cellars, keep, palace and throne room.

// ---------- 1. the march on the end screens ----------
{const _sv=setView;setView=function(w){if(mode==='dead'||mode==='win')w=true;return _sv(w);};}
{const _re=renderEnd;renderEnd=function(){_re.apply(this,arguments);const d=deadInfo;if(!d)return;
 const w=Math.min(250,W-16),h=56,x=Math.round((W-w)/2),y=H-h-4;
 drawProvinceMap(x,y,w,h,d.win?-1:d.di,d.win?12:d.di);
 const s=d.win?'THE MARCH IS COMPLETE. THE CASTLE IS TAKEN':'THE MARCH HALTED AT '+ROMAN[d.di]+'. '+DUN[d.di].name;txt(s,Math.round((W-txtW(s))/2),y-9,d.win?'#ffd040':'#c8a8a8');};}

// ---------- 2. the chronicle ----------
{const at=GTABS.indexOf('TRIALS'),ix=at<0?GTABS.length:at;GTABS.splice(ix,0,'CHRONICLE');if(typeof GTABC!=='undefined')GTABC.splice(ix,0,'#e0b040');if(typeof GTSUB!=='undefined')GTSUB.splice(ix,0,'CHAPTER');
 const _ge=guideEntries;guideEntries=function(tab){if(GTABS[tab]!=='CHRONICLE')return _ge(tab);const reached=Math.max(meta.reached||0,R&&!R.training?R.di:0);
  return DUN.map((D,i)=>{const u=i<=reached;return {n:ROMAN[i]+'. '+D.name,u,col:u?'#e0b040':'#555',chron:i,L:u?[D.tale||D.story||'','GUARDIAN: '+(BOSS[i]?BOSS[i].name:'?')]:['MARCH FURTHER TO WRITE THIS CHAPTER']};});};}
// the chronicle's detail card shows where the chapter lies on the map
{const _rg=renderGuide;renderGuide=function(){_rg.apply(this,arguments);if(GTABS[guideTab]!=='CHRONICLE')return;const L=guideEntries(guideTab),e=L[guideSel];if(!e||!e.u)return;
 const X=GG.LX+GG.LW+8,Wd=W-X-6,Hd=gRows()*GG.RH+8,w=Wd-16,h=70,x=X+8,y=GG.LY+Hd-h-6;drawProvinceMap(x,y,w,h,e.chron,e.chron);};}

// ---------- 3. dust in the lamplight, indoors ----------
{const motes=[];const _da=drawAmbient;drawAmbient=function(){_da.apply(this,arguments);if(!R||!map||map.train||typeof INDOOR==='undefined'||!INDOOR.has(R.di))return;
 while(motes.length<26)motes.push({x:Math.random()*W,y:Math.random()*H,vx:rnd(-3,3),vy:rnd(-4,-1),ph:Math.random()*6});
 const dt=1/60;for(const m of motes){m.x+=m.vx*dt+Math.sin(time*.7+m.ph)*.05;m.y+=m.vy*dt;if(m.y<-4||m.x<-4||m.x>W+4){m.x=Math.random()*W;m.y=H+2;}
  const a=.25+.25*Math.sin(time*1.5+m.ph);ctx.globalAlpha=a;ctx.fillStyle=R.di===11?'#ffb0a0':'#fff0c8';ctx.fillRect(Math.round(m.x),Math.round(m.y),1,1);}ctx.globalAlpha=1;};}
