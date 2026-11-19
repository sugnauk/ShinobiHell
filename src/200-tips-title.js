'use strict';
// SHINOBIDUNGEONS - tips and the title screen.
//  - ABILITIES: a tip early in the first fight of a run says it plainly: use your abilities as often as you can. Every
//    ability tooltip ends with the same advice.
//  - BOSS RUSH LAG: the main menu's boss rush panel rebuilt every guardian's full posed sheet on every frame (the posed
//    art is drawn from code, so bossSheet() is expensive). Each guardian's sheet is now built once and kept.
//  - TITLE: the text is rewritten for the game as it is now: the march, the heroes, the stages beyond the throne, one
//    clear prompt, and a footer that cycles through useful tips.
// ---- ability use ----
TIPACT.abil2=TIPACT.abil;
{let fightT=0;const _u=update;update=function(dt){_u.apply(this,arguments);if(!R||R.training||R.rush||mode!=='play'||!P||meta.tips.abil2)return;
 const fighting=enemies.some(e=>!e.dead&&e.awake&&!e.prop&&Math.hypot(e.x-P.x,e.y-P.y)<170);
 if(fighting){fightT+=dt;if(fightT>3)tip('abil2',['USE YOUR ABILITIES - OFTEN','Q, '+KN('w')+', '+KN('f')+' AND '+KN('e')+' ARE YOUR STRONGEST ATTACKS AND RECHARGE QUICKLY. USE EACH ONE THE MOMENT IT IS READY: AN ABILITY WAITING ON THE BAR IS DAMAGE YOU ARE NOT DOING.']);}else fightT=0;};}
{const _si=spellInfo;spellInfo=function(k){const out=_si.apply(this,arguments);if('hqwfe'.includes(k))out.push({s:k==='e'?'USE IT IN EVERY BIG FIGHT: IT WILL BE READY AGAIN SOON.':'USE IT EVERY TIME IT IS READY. COOLDOWNS ARE SHORT.',c:'#ffd080'});return out;};}
// ---- boss rush menu lag: build each guardian's sheet once ----
const BSHEETC={};
{const _bs=bossSheet;bossSheet=function(i){const b=BOSS[i];if(!b)return _bs.apply(this,arguments);const key=i+'|'+b.name+'|'+(ARTHURT?1:0)+'|'+(typeof PRO_ON!=='undefined'&&PRO_ON?1:0);
 return BSHEETC[key]||(BSHEETC[key]=_bs.apply(this,arguments));};}
// ---- the title screen: the logo, one line that changes every visit, and the prompt ----
const TITLE_LINES=['AKAGANE STILL BLAMES THE BAMBOO.','THE EMPEROR\'S TAXES ARE THE REAL FINAL BOSS.','THE RONIN SEVEN WERE EIGHT. DON\'T ASK.',
 'TETSUO HAS TO RELOAD. YOU DON\'T.','HOSHIYOMI SAW YOU COMING. HE LOST ANYWAY.','NOW WITH MORE BULLETS THAN STRICTLY NECESSARY.',
 'DASHING THROUGH BULLETS IS NOT A CRIME. YET.','YOUR ABILITIES ARE NOT DECORATIONS. USE THEM.','TAMAMO SAYS THIS SCREEN IS AN ILLUSION.',
 'THE ABYSS HAS NO FLOOR. WE CHECKED.','KAGE IS BEHIND YOU. NO, THE OTHER BEHIND.','THE ABBOT RINGS. THE BULLETS ANSWER.',
 'SUMO DOES NOT DODGE. SUMO IS DODGED.','ONIKUMA\'S CHAINS ARE LONGER THAN THIS SENTENCE.','NO SHINOBI WERE HARMED. MANY WERE RESPAWNED.',
 'GETSUREI KEEPS THE SUN IN A MIRROR. RUDE.','THE MOTH QUEEN WOULD LIKE HER LANTERN BACK.','THE GUARDIANS YOU BEAT REMEMBER YOU.',
 'TWELVE STAGES TO THE THRONE. THEN IT GETS WEIRD.','ITOHIME WOVE THIS LINE. STEP AROUND IT.','KUROGANE\'S HORSE HAS SEEN THINGS.',
 'THE EMPEROR HAS A THRONE. YOU HAVE A DASH.'];
let titleLine=Math.floor(Math.random()*TITLE_LINES.length),titleWas=null;
// the logo, drawn once from the game's own pixel font with a proper treatment
function logoGlyphs(s,sc,gap){const cols=[];for(const ch of s){const g=FONT[ch];if(!g){cols.push(null);continue;}cols.push(g);}let w=0;for(const g of cols)w+=(g?g[0].length:3)*sc+gap;return {cols,w:w-gap};}
function logoText(g,s,x0,y0,sc,gap,fill,ol,sh){const {cols}=logoGlyphs(s,sc,gap);const blocks=[];let x=x0;for(const gl of cols){if(gl){for(let r=0;r<5;r++)for(let q=0;q<gl[0].length;q++)if(gl[r][q]==='#')blocks.push([x+q*sc,y0+r*sc,r]);x+=gl[0].length*sc+gap;}else x+=3*sc+gap;}
 // drop shadow, then a thick outline, then the fill with a highlight and a shaded edge per block
 g.fillStyle=sh;for(const [bx,by] of blocks)g.fillRect(bx+3,by+4,sc,sc);g.fillStyle=ol;for(const [bx,by] of blocks)g.fillRect(bx-2,by-2,sc+4,sc+4);
 const has=new Set(blocks.map(([bx,by])=>bx+','+by)),at=(x,y)=>has.has(x+','+y);
 for(const [bx,by,r] of blocks){g.fillStyle=fill[r];g.fillRect(bx,by,sc,sc);}
 // light only on the top edges of each letter, shade only on its right and bottom edges, so letters read as solid shapes
 for(const [bx,by] of blocks){if(!at(bx,by-sc)){g.fillStyle=fill[5];g.fillRect(bx,by,sc,Math.max(1,sc>>2));}if(!at(bx+sc,by)){g.fillStyle=fill[6];g.fillRect(bx+sc-Math.max(1,sc>>2),by,Math.max(1,sc>>2),sc);}if(!at(bx,by+sc)){g.fillStyle=fill[6];g.fillRect(bx,by+sc-Math.max(1,sc>>2),sc,Math.max(1,sc>>2));}}return blocks;}
const LOGO=(()=>{const W2=300,H2=74,c=mk(W2,H2,()=>{}),g=c.getContext('2d');
 const big=logoGlyphs('DUNGEONS',6,6),bx=Math.round((W2-big.w)/2),by=22;
 const blocks=logoText(g,'DUNGEONS',bx,by,6,6,['#ff7a5a','#ff4a3a','#e02838','#b81a2c','#8a1020','#ffc0a0','#5a0a18'],'#0a0610','#2a0a20');
 const sm=logoGlyphs('SHINOBI',2,4),sx2=Math.round((W2-sm.w)/2);logoText(g,'SHINOBI',sx2,6,2,4,['#fff0b0','#ffe080','#e0b040','#c89020','#a07018','#ffffff','#6a4a10'],'#0a0610','#1a0a14');
 // gold rules with diamond ends either side of SHINOBI
 for(const s of [-1,1]){const x1=s<0?sx2-8:sx2+sm.w+8,x2=s<0?x1-46:x1+46;g.fillStyle='#e0b040';g.fillRect(Math.min(x1,x2),10,Math.abs(x2-x1),1);g.fillRect(x2-1,9,3,3);g.fillStyle='#fff0b0';g.fillRect(x2,10,1,1);}
 // the katana underneath: wrapped grip, gold guard, a long blade with its edge line
 const ky=by+36,kx0=bx-10,kx1=bx+big.w+14;g.fillStyle='#0a0610';g.fillRect(kx0-1,ky-2,kx1-kx0+3,6);
 for(let x=kx0;x<kx0+34;x++){g.fillStyle=(x>>1)%2?'#3a2a4a':'#1a1424';g.fillRect(x,ky-1,1,4);if((x-kx0)%4===0){g.fillStyle='#c8b8e0';g.fillRect(x,ky,1,2);}}
 g.fillStyle='#e0b040';g.fillRect(kx0+34,ky-3,4,8);g.fillStyle='#fff0b0';g.fillRect(kx0+34,ky-3,1,8);
 for(let x=kx0+38;x<kx1;x++){const t=(x-kx0-38)/(kx1-kx0-38),h=x>kx1-8?Math.max(1,Math.round((kx1-x)/3)):3;g.fillStyle='#b8c0d0';g.fillRect(x,ky-1,1,h);g.fillStyle='#ffffff';g.fillRect(x,ky-1,1,1);if(h>2){g.fillStyle='#6a7080';g.fillRect(x,ky+1,1,1);}}
 // a red seal stamp with the kanji for shinobi
 const KAN=['..xxxxxx..','.....x.x..','..x..x.x..','...x.x.x..','....x..x..','...x..xx..','..........','.x.xx.x.x.','x..x..x..x','x...xx...x'],stx=bx+big.w+6,sty=by-14;
 g.fillStyle='#0a0610';g.fillRect(stx-1,sty-1,16,16);g.fillStyle='#c02030';g.fillRect(stx,sty,14,14);g.fillStyle='#e04050';g.fillRect(stx,sty,14,1);
 g.fillStyle='#fff0e0';for(let r=0;r<10;r++)for(let q=0;q<10;q++)if(KAN[r][q]==='x')g.fillRect(stx+2+q,sty+2+r,1,1);
 return {c,w:W2,h:H2,blocks,bx,by,sc:6};})();
// the sheen sweeping across the big letters every few seconds
const LOGOSH=mk(LOGO.w,LOGO.h,()=>{});
function drawLogo(x,y){ctx.drawImage(LOGO.c,x,y);const k=(time%4.5)/1.1;if(k>1)return;const g=LOGOSH.getContext('2d');g.clearRect(0,0,LOGO.w,LOGO.h);
 g.fillStyle='#ffffff';for(const [bx,by] of LOGO.blocks)g.fillRect(bx,by,LOGO.sc,LOGO.sc);g.globalCompositeOperation='source-in';const sx0=-40+k*(LOGO.w+80);
 const gr=g.createLinearGradient(sx0-14,0,sx0+14,0);gr.addColorStop(0,'rgba(255,255,255,0)');gr.addColorStop(.5,'rgba(255,255,255,.75)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,LOGO.w,LOGO.h);g.globalCompositeOperation='source-over';
 ctx.drawImage(LOGOSH,x,y);}
renderTitle=function(){
 if(titleWas!=='title'){titleLine=(titleLine+1+Math.floor(Math.random()*(TITLE_LINES.length-1)))%TITLE_LINES.length;}titleWas='title';
 bg();const lx=Math.round((W-LOGO.w)/2);drawLogo(lx,2);
 ctxt(TITLE_LINES[titleLine],LOGO.h+6,'#b8a8d0');
 if(Math.floor(time*2)%2===0)ctxt(typeof TOUCH!=='undefined'&&TOUCH?'- TAP TO BEGIN -':'- PRESS ENTER -',LOGO.h+20,'#fff');
 txt('V'+GAME_VERSION,W-4-txtW('V'+GAME_VERSION),H-9,'#4a4458');};
// a new line next time the title shows
{const _r=render;render=function(){if(mode!=='title')titleWas=mode;return _r.apply(this,arguments);};}
