'use strict';
const fullscreenElement=()=>document.fullscreenElement||document.webkitFullscreenElement;
async function goFullscreen(on){try{
 const d=document,el=d.documentElement;
 if(on&&!fullscreenElement()){
  if(d.fullscreenEnabled&&el.requestFullscreen)await el.requestFullscreen({navigationUI:'hide'});
  else if(d.webkitFullscreenEnabled&&el.webkitRequestFullscreen)await el.webkitRequestFullscreen();
  else return false;
 }else if(!on&&fullscreenElement()){
  const exit=d.fullscreenElement?d.exitFullscreen:d.webkitExitFullscreen;
  if(!exit)return false;
  await exit.call(d);
 }
 return true;
 }catch(_){return false;}}
// A desktop keyboard or mouse can enter fullscreen on its first interaction.
{let asked=false;const first=e=>{if(asked||e.target?.closest?.('#touch-display')||matchMedia('(pointer: coarse)').matches)return;
 asked=true;if(!meta||!meta.opt||meta.opt.fs!==0)goFullscreen(true);};
 addEventListener('keydown',first,{capture:true});addEventListener('mousedown',first,{capture:true});}
function fitFullscreen(){resizeView();}
document.addEventListener('fullscreenchange',fitFullscreen);
document.addEventListener('webkitfullscreenchange',fitFullscreen);
