'use strict';
// SHINOBIDUNGEONS - a theme for every guardian. Each has its own two-bar melody (scale degrees on eighth notes, null =
// rest), written to its character; the piano plays it through the fight (doubled in octaves from phase two, harmonised
// in phase three) and announces it at the guardian's introduction.
const BMOTIF=[
 [0,0,2,null,4,3,2,null, 0,0,2,4,5,4,null,null],      // I   Akagane: a stamping war march
 [4,null,3,2,null,0,null,null, 4,5,4,3,2,null,0,null], // II  Kusakari: a stalking figure that slips away
 [0,2,0,3,0,4,3,2, 0,2,0,3,5,4,3,null],                 // III Itohime: a spider's weaving ostinato
 [4,null,5,4,2,null,null,null, 2,null,4,2,0,null,null,null],// IV Hotaru: a flickering lantern sigh
 [0,0,0,null,0,2,4,null, 7,6,5,4,3,2,0,null],           // V   The Ronin Seven: seven strikes, then a falling line
 [0,null,0,null,4,null,4,null, 5,4,3,2,0,null,0,null],  // VI  Tetsuo: steady gun-drill
 [0,null,null,4,null,null,7,null, 6,null,4,null,2,null,null,null],// VII The Abbot: tolling bell intervals
 [0,1,0,1,0,null,null,null, 3,2,1,0,null,0,null,null], // VIII Onikuma: grinding chains
 [7,null,null,null,6,null,null,4, null,null,3,2,null,0,null,null],// IX Kage: a sparse line from the dark
 [2,4,5,7,5,4,2,null, 2,4,5,7,9,7,5,null],             // X   Tamamo: a beguiling rise
 [0,4,7,null,7,null,7,6, 4,null,4,5,7,null,null,null], // XI  Kurogane: a cavalry fanfare
 [7,6,5,4,3,2,1,0, 0,null,4,null,7,null,12,null]];     // XII The Emperor: a descent, then the crown
// the theme announces itself as the guardian is introduced
{const _u=update;let was=false;update=function(dt){const w=introT>0&&introE&&!introE.camOnly;_u.apply(this,arguments);
 if(w&&!was&&R&&!R.training&&AC&&typeof piano==='function'&&PN.bus){const mo=BMOTIF[R.di],st=(typeof PSTAGE!=='undefined'&&PSTAGE[R.di])||['in',48,80],sc=PSC[['hira','in','min','kumoi'][R.di%4]],N=sc.length,root=st[1]-7,deg=d=>root+sc[((d%N)+N)%N]+12*Math.floor(d/N);
  const t0=AC.currentTime+.75,sp=.2;mo.slice(0,8).forEach((d,i)=>{if(d!=null){piano(t0+i*sp,deg(d+N*2),.7,.9);piano(t0+i*sp,deg(d+N),.5,.9);}});}
 was=w;};}
