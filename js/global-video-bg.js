(function(){
'use strict';
var video=document.getElementById('global-bg-video');
if(!video){video=document.createElement('video');video.id='global-bg-video';video.autoplay=true;video.muted=true;video.loop=true;video.playsInline=true;video.setAttribute('autoplay','');video.setAttribute('muted','');video.setAttribute('loop','');video.setAttribute('playsinline','');video.setAttribute('aria-hidden','true');video.setAttribute('preload','metadata');document.body.prepend(video);}
var overlay=document.getElementById('global-bg-overlay');
if(!overlay){overlay=document.createElement('div');overlay.id='global-bg-overlay';overlay.setAttribute('aria-hidden','true');document.body.insertBefore(overlay,video.nextSibling);}
function applySource(){var mobile=window.innerWidth<=768;var src=mobile?'/assets/mobile-bg.mp4':'/assets/pc-bg.mp4';if(video.dataset.activeSrc!==src){video.dataset.activeSrc=src;video.innerHTML='';var source=document.createElement('source');source.src=src;source.type='video/mp4';video.appendChild(source);video.load();var p=video.play();if(p&&p.catch)p.catch(function(){});}}
video.addEventListener('error',function(){document.documentElement.style.backgroundColor='#E0F7FA';document.body.style.backgroundColor='#E0F7FA';});
applySource();
var resizeTimer;window.addEventListener('resize',function(){clearTimeout(resizeTimer);resizeTimer=setTimeout(applySource,150);},{passive:true});
document.querySelectorAll('link[rel~="icon"],link[rel="apple-touch-icon"]').forEach(function(link){link.href='/assets/logo.png';link.type='image/png';});
document.querySelectorAll('img').forEach(function(img){var src=img.getAttribute('src')||'';if(/(?:assets\/images\/logo\.svg|assets\/logo\.svg|logo\.svg)$/i.test(src)){img.src='/assets/logo.png';img.alt='晴天社区 Logo';}});
document.querySelectorAll('.brand-mark').forEach(function(mark){var img=document.createElement('img');img.src='/assets/logo.png';img.alt='晴天社区 Logo';img.className='brand-logo-local';mark.replaceWith(img);});
document.querySelectorAll('.s5-header-brand').forEach(function(link){link.setAttribute('aria-label','晴天社区首页');});
document.querySelectorAll('.footer-brandline strong').forEach(function(label){label.textContent=label.textContent.replace(/\s*[·•|]\s*S5/gi,'').trim();});
})();