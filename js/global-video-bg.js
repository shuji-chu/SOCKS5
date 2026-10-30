(function(){
'use strict';
var currentScript=document.currentScript;
var assetRoot=currentScript&&currentScript.src?new URL('../',currentScript.src):new URL('./',window.location.href);
function asset(path){return new URL(path,assetRoot).href;}
var video=document.getElementById('global-bg-video');
if(!video){
 video=document.createElement('video');
 video.id='global-bg-video';
 video.autoplay=true;video.muted=true;video.loop=true;video.playsInline=true;
 video.setAttribute('autoplay','');video.setAttribute('muted','');video.setAttribute('loop','');
 video.setAttribute('playsinline','');video.setAttribute('webkit-playsinline','');
 video.setAttribute('aria-hidden','true');video.setAttribute('preload','auto');
 video.setAttribute('disablepictureinpicture','');
 document.body.insertBefore(video,document.body.firstChild);
}
var overlay=document.getElementById('global-bg-overlay');
if(!overlay){
 overlay=document.createElement('div');
 overlay.id='global-bg-overlay';overlay.setAttribute('aria-hidden','true');
 document.body.insertBefore(overlay,video.nextSibling);
}
var logoPath=asset('assets/logo.png');
function applySource(){
 var mobile=window.matchMedia?window.matchMedia('(max-width: 768px)').matches:window.innerWidth<=768;
 var src=asset(mobile?'assets/mobile-bg.mp4':'assets/pc-bg.mp4');
 if(video.dataset.activeSrc!==src){
  video.dataset.activeSrc=src;video.innerHTML='';
  var source=document.createElement('source');source.src=src;source.type='video/mp4';
  video.appendChild(source);video.load();
  var playPromise=video.play();
  if(playPromise&&typeof playPromise.catch==='function')playPromise.catch(function(){});
 }
}
video.addEventListener('error',function(){
 document.documentElement.style.backgroundColor='#f8fbff';
 document.body.style.backgroundColor='transparent';
});
applySource();
var resizeTimer;
window.addEventListener('resize',function(){
 clearTimeout(resizeTimer);resizeTimer=setTimeout(applySource,150);
},{passive:true});
document.querySelectorAll('link[rel~="icon"],link[rel="apple-touch-icon"]').forEach(function(link){
 link.href=logoPath;link.type='image/png';
});
document.querySelectorAll('img').forEach(function(img){
 var src=img.getAttribute('src')||'';
 if(/(?:assets\/images\/logo\.svg|assets\/logo\.svg|logo\.svg|logo\.png)$/i.test(src)){
  img.src=logoPath;img.alt='晴天社区 Logo';
 }
});
document.querySelectorAll('.brand-mark').forEach(function(mark){
 var img=document.createElement('img');img.src=logoPath;img.alt='晴天社区 Logo';
 img.className='brand-logo-local';mark.replaceWith(img);
});
document.querySelectorAll('.s5-header-brand').forEach(function(link){
 link.setAttribute('aria-label','晴天社区首页');
});
document.querySelectorAll('.footer-brandline strong').forEach(function(label){
 label.textContent=label.textContent.replace(/\s*[·•|]\s*S5/gi,'').trim();
});
})();