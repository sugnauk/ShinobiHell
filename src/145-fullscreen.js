'use strict';
// SHINOBIDUNGEONS - full screen: the game asks the browser for full screen on your first key press or click (browsers
// only allow it after you interact), unless you turned FULLSCREEN off in the display settings.
function goFullscreen(on){try{const d=document;if(on){if(!d.fullscreenElement&&d.documentElement.requestFullscreen)d.documentElement.requestFullscreen().catch(()=>{});}
 else if(d.fullscreenElement&&d.exitFullscreen)d.exitFullscreen().catch(()=>{});}catch(_){}}
{let asked=false;const first=()=>{if(asked)return;asked=true;if(!meta||!meta.opt||meta.opt.fs!==0)goFullscreen(true);};
 addEventListener('keydown',first,{capture:true});addEventListener('mousedown',first,{capture:true});}
document.addEventListener('fullscreenchange',()=>{const v=VIEWWIDE;W=0;setView(v);fit();});
