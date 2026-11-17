'use strict';
// SHINOBIDUNGEONS - no automatic pickup from bags. Walking onto a bag opens it and shows what is inside, but nothing is
// taken until you choose: G takes everything, 1-6 take one item. (Before, potions, stat elixirs and gear for empty
// slots were grabbed the moment you stepped on the bag.) Coins still fly to you as before.
let LB_TAKE=false;
{const _lb=lootBag;lootBag=function(b){if(LB_TAKE)return _lb.apply(this,arguments);
 // reveal only: the bag pops open with its sparkle, the codex learns any rare gear inside
 if(!b.opened){for(const it of b.items)if(it.t==='gear'&&it.rare)codexAdd('gear',it.name);b.opened=true;b.pop=.25;spark(b.x,b.y,BAGCOL[b.tier],b.tier===4?40:10,b.tier===4?140:60);
  if(b.tier===4){spark(b.x,b.y,'#fff',16,100);fxRing(b.x,b.y,34,'#ffd040',.5);fxRing(b.x,b.y,20,'#fff',.3);sfx('rare');hitstop=Math.max(hitstop,.06);}}
 if(!b.items.length)b.dead=true;};}
// taking a stat elixir on purpose (the old code only ever took them automatically)
function takeStat(b,i){const it=b.items[i];if(!it||it.t!=='stat')return;const st=STATS.find(s=>s.k===it.s);G('t',it.s);
 if(meta.stats[it.s]<STATMAX){meta.stats[it.s]++;saveMeta();S=calcStats();setToast(st.n+' +1  ('+meta.stats[it.s]+'/'+STATMAX+')',st.c,2.5);}else{R.sen+=40;txtFx(P.x,P.y,st.n+' MAXED +40 GOLD','#fc4');}
 b.items.splice(i,1);sfx('pickup');if(!b.items.length)b.dead=true;}
{const _ti=takeItem;takeItem=function(b,i){const it=b&&b.items[i];if(it&&it.t==='stat'){takeStat(b,i);return;}return _ti.apply(this,arguments);};}
{const _ta=takeAll;takeAll=function(b){if(b)for(let i=b.items.length-1;i>=0;i--)if(b.items[i].t==='stat')takeStat(b,i);if(!b||b.dead||!b.items.length)return;return _ta.apply(this,arguments);};}
