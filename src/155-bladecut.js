'use strict';
// SHINOBIDUNGEONS - blades no longer cut bullets by default. A melee swing used to cut up to five enemy shots; now that is
// a very rare legendary scroll card, BULLET CLEAVER ("ALL YOUR BLADE STRIKES CUT ENEMY BULLETS"), offered only to the
// melee heroes on about one legendary scroll in fifteen. Abilities that say they cut shots in their own text (Whirlwind,
// full-charge shots, the Lancer's parry) keep doing so.
SCROLL_ADDONS.push({k:'cutter',n:'BULLET CLEAVER: ALL YOUR BLADE STRIKES CUT ENEMY BULLETS',tier:4,c:'#ffe060'});
const hasCutter=()=>!!(R&&R.addon&&Object.values(R.addon).some(a=>a&&a.cutter));
{const _bc=bladeCut;bladeCut=function(){if(!hasCutter())return;return _bc.apply(this,arguments);};}
{const _ro=rollScrollOpts;rollScrollOpts=function(){const o=_ro.apply(this,arguments);try{if(MELEE()&&!hasCutter()&&Math.random()<.07&&o.length){const i=o.findIndex(x=>x.kind==='add');if(i>=0)o[i]={kind:'add',k:o[i].k,a:'cutter'};}}catch(_){}return o;};}
