(function(){
'use strict';
var currentScript=document.currentScript;
var assetRoot=currentScript&&currentScript.src?new URL('../',currentScript.src):new URL('./',window.location.href);
function asset(path){return new URL(path,assetRoot).href;}

/* Remove legacy video layers; the shared stylesheet now renders the light blue-white motion background. */
document.querySelectorAll('#global-bg-video,#global-bg-overlay').forEach(function(node){
 if(node&&node.parentNode)node.parentNode.removeChild(node);
});

var logoPath=asset('assets/logo.png');
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