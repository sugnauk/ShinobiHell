'use strict';
// SHINOBIDUNGEONS - no forced tutorial. A new player's first run starts straight away; the first stage's tips teach as
// they play (they pause the game). The very first card is the controls. The tutorial is still on the main menu (now
// called TUTORIAL, marked NEW until you have played it), and the death screen points a new player to it.
TIPACT.controls={k:['use'],hold:['use'],say:'PRESS {use} OR ENTER TO BEGIN'};
{const _ld=loadDungeon;loadDungeon=function(){const r=_ld.apply(this,arguments);try{if(R&&R.tipStage&&!R.training)tip('controls',['THE CONTROLS',
  [KN('up'),KN('left'),KN('down'),KN('right')].join('')+': MOVE.  MOUSE: AIM.  LMB: ATTACK.  HOLD RMB: HEAVY ATTACK',
  KN('dash')+': DASH - NOTHING CAN HIT YOU MID-DASH.  '+[KN('q'),KN('w'),KN('f'),KN('e')].join(' ')+': ABILITIES',
  KN('heal')+': DRINK A POTION.  '+KN('use')+': INTERACT.  '+KN('pack')+': YOUR PACK.  K: THE GUIDE']);}catch(_){}return r;};}
// the death screen: a new player who has not played the tutorial is pointed to it
{const _dt=deathTip;deathTip=function(){const t=_dt.apply(this,arguments);return meta.trained?t:'NEW TO THE MARCH? THE TUTORIAL ON THE MAIN MENU TEACHES THE BASICS IN A MINUTE. '+t;};}
// finishing (or skipping) the tutorial takes you back to the main menu, with NEW RUN selected
{const _ft=finishTraining;finishTraining=function(){if(!(R&&R.training))return _ft.apply(this,arguments);
 R.training=null;if(P)P.lock=null;meta.trained=true;saveMeta();props=[];dh=[];projs=[];if(typeof TIPHOLD!=='undefined'){TIPHOLD=null;}
 mode='menu';paused=false;try{const L=mmItems();mmSel=Math.max(0,L.findIndex(x=>x.k==='new'));}catch(_){mmSel=0;}sfx('pickup');setToast('TUTORIAL COMPLETE','#80ff90',2.5);};}
// the low-health tip never drinks a potion for you: C or ENTER only closes it, and drinking stays your call
TIPACT.pot={k:['heal'],hold:['heal'],say:'PRESS {heal} OR ENTER TO CONTINUE'};
