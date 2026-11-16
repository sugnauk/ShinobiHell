'use strict';
// HELL OF THE EMPEROR - detailed 8-bit item icons (12x12). Weapons per type, armour in four looks by tier (kimono robe,
// lamellar do, crested haori, o-yoroi great armour), rings from plain bands to ornate gem rings coloured by their stat.
// Every gear icon gets light from the top-left and shadow on the bottom-right, a quality aura, and a corner pip for an ability.
// palette letters: m material (tier), M its shadow, g quality / legendary accent, w glint, s/S steel, h grip, y gold, r red, p paper, k black
Object.assign(WICON,{
 TANEGASHIMA:['............','..........ss','.........sSk','........sSk.','.......sSk..','......yyk...','.....hhy....','....hhh.....','...hhgh.....','..hhh..r....','.hhh....r...','hh..........'],
 YARI:['..........ww','.........wsS','........wsS.','.......yS...','......mg....','.....m......','....m.......','...m........','..m.........','.m..........','m...........','............'],
 KATANA:['...........w','..........ws','.........wsS','........wsS.','.......wsS..','......wsS...','....yyS.....','....yy......','...hgh......','..hgh.......','.hgh........','h...........']});
const ARMICON=[
 // kimono robe (tiers 1-4)
 ['...M....M...','..MmgggmM...','.MmmmggmmM..','MmmmmgmmmmM.','MmMmmgmmMmM.','mm.Mmgmm.mm.','...Myyyym...','...Mmmgmm...','...Mmmgmm...','..Mmmmgmmm..','..Mmmmgmmm..','..MMMMMMMM..'],
 // lamellar do (tiers 5-8)
 ['..yy....yy..','.MmmM..MmmM.','.mmmmmmmmmm.','.mMMMMMMMMm.','.mmmmmmmmmm.','.mMMMMMMMMm.','..mmmmmmmm..','..yyyggyyy..','..MmmmmmmM..','..mMmMmMmm..','..MmMmMmMm..','..M.M..M.M..'],
 // crested haori jacket (tiers 9-12)
 ['...m....m...','..mmM..Mmm..','.mmmmMMmmmm.','mmmmmmmmmmmm','mm.mmggmm.mm','mm.mgwwgm.mm','...mmggmm...','...mmmmmm...','...mmmmmm...','...mmmmmm...','...MMMMMM...','............'],
 // o-yoroi great armour with a horned helm (tiers 13-15)
 ['.y........y.','..y.MMMM.y..','...MmmmmM...','..yyyyyyyy..','.MmMmMmMmMm.','MmmmmggmmmmM','MmMmMgwMmMmM','.mmmmggmmmm.','.yyyyyyyyyy.','..MmMmMmMm..','..mMmMmMmM..','..M.M..M.M..']];
const RINGICON=[
 ['............','............','....mmmm....','...m....M...','..m......M..','..m......M..','..m......M..','..m......M..','...M....M...','....MMMM....','............','............'],
 ['.....w......','....ggg.....','...ygwgy....','...mgggm....','..m.yyy.M...','..m......M..','..m......M..','..m......M..','...M....M...','....MMMM....','............','............'],
 ['....w.w.....','...ygggy....','..yggwggy...','..ymgggmy...','.ymm.y.mMy..','.mm......MM.','.m.y....y.M.','.m........M.','.mm......MM.','..MM.yy.MM..','...MMMMMM...','............']];
function shadeIcon(g){const d=g.getImageData(0,0,12,12),px=d.data,a=(x,y)=>x>=0&&y>=0&&x<12&&y<12?px[(y*12+x)*4+3]:0,src=new Uint8ClampedArray(px);
 for(let y=0;y<12;y++)for(let x=0;x<12;x++){const i=(y*12+x)*4;if(!src[i+3])continue;const lit=!a(x-1,y)||!a(x,y-1),dark=!a(x+1,y)||!a(x,y+1);
  const k=lit&&!dark?1.28:dark&&!lit?.72:1;for(let c=0;c<3;c++)px[i+c]=Math.min(255,src[i+c]*k);}g.putImageData(d,0,0);}
{const _ii=itemIcon;itemIcon=function(it){if(!it||it.t!=='gear')return _ii(it);const pwk=(it.pw||[]).map(p=>p.k).join('');
  const key='g2'+it.slot+it.tier+'_'+(it.q||0)+(it.rare?it.name:'')+(it.slot==='wpn'?wtName(it):'')+(it.slot==='ring'?it.stat:'')+pwk;if(ICONC[key])return ICONC[key];
  const L=it.rare?LEGLOOK[it.name]:null,q=it.rare?4:(it.q||0),m=L?L[0]:MATC[it.tier],gem=L?L[1]:it.slot==='ring'&&it.stat?(STATS.find(s=>s.k===it.stat)||{c:QUAL[q].c}).c:QUAL[q].c;
  const PC={m,M:shade(m,-.35),g:gem,w:'#ffffff',s:'#d8e0ea',S:'#8a92a0',h:'#3a2a2a',y:q>=4?'#ffd040':'#c8a040',r:'#d02838',p:'#f0e8d0',k:'#2a2a30'};
  const fr=mk(12,12,g=>{const R=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h);};const map=rows=>rows.forEach((row,y)=>{for(let x=0;x<row.length;x++){const c=PC[row[x]];if(c)R(x,y,1,1,c);}});
   if(it.slot==='wpn'){map(WICON[wtName(it)]||WICON.STAFF);if(q>=2)R(0,11,1,1,gem);if(wtName(it)==='KATANA'||wtName(it)==='ODACHI'){g.fillStyle='rgba(255,255,255,.7)';for(let i=0;i<4;i++)g.fillRect(9-i,2+i,1,1);}}
   else if(it.slot==='arm')map(ARMICON[Math.min(3,Math.floor(it.tier/4))]);
   else map(RINGICON[it.tier<5?0:it.tier<10?1:2]);
   shadeIcon(g);
   // an ability shows as a small pip in its colour in the bottom-right corner (gold for a major one)
   if(it.pw&&it.pw.length){const major=it.pw.some(p=>GPW[p.k]&&GPW[p.k].t);R(10,10,2,2,'#14101a');R(10,10,1,1,major?'#ffd040':'#80e0ff');}
   if(q>=3){const d=g.getImageData(0,0,12,12).data,glow=q>=4?'rgba(255,200,60,.55)':'rgba(180,90,255,.5)';g.fillStyle=glow;
    for(let y=0;y<12;y++)for(let x=0;x<12;x++){if(d[(y*12+x)*4+3])continue;let n=false;for(const [ax,ay] of [[1,0],[-1,0],[0,1],[0,-1]]){const X=x+ax,Y=y+ay;if(X>=0&&Y>=0&&X<12&&Y<12&&d[(Y*12+X)*4+3]>200){n=true;break;}}if(n)g.fillRect(x,y,1,1);}
    if(q>=4){R(0,0,1,1,'#fff6c0');R(11,6,1,1,'#fff6c0');R(1,1,1,1,'#ffd040');}}});
  return ICONC[key]=outlined(fr);};}
