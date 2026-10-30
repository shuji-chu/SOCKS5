/* Vanta HALO progressive enhancement with a solid-color fallback */
(()=> {
  const fallback=()=>{document.documentElement.style.backgroundColor='#e0f7fa';document.body.style.backgroundColor='#e0f7fa';const bg=document.getElementById('s5-vanta-bg');if(bg){bg.style.background='#e0f7fa';bg.replaceChildren()}};
  try{
    if(!document.getElementById('s5-vanta-bg')){const bg=document.createElement('div');bg.id='s5-vanta-bg';bg.setAttribute('aria-hidden','true');document.body.prepend(bg)}
    fallback();
    if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const load=(src)=>new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.async=true;s.onload=resolve;s.onerror=()=>reject(new Error('CDN load failed: '+src));document.head.appendChild(s)});
    (async()=>{
      try{
        if(!window.THREE)await load('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js');
        if(!window.VANTA||!window.VANTA.HALO)await load('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.halo.min.js');
        if(!window.THREE||!window.VANTA||!window.VANTA.HALO)throw new Error('WebGL library unavailable');
        const host=document.getElementById('s5-vanta-bg');
        window.__s5VantaEffect=window.VANTA.HALO({
          el:host,mouseControls:true,touchControls:true,gyroControls:false,
          minHeight:200,minWidth:200,baseColor:0xe0f7fa,backgroundColor:0xffffff,
          amplitudeFactor:1,xOffset:0,yOffset:0,size:1.5
        });
        if(!window.__s5VantaEffect)throw new Error('Vanta initialization failed');
        window.addEventListener('pagehide',()=>{try{window.__s5VantaEffect&&window.__s5VantaEffect.destroy()}catch(_){}},{once:true});
      }catch(error){console.warn('[S5] Vanta unavailable; using ice-blue fallback.',error);fallback()}
    })();
  }catch(error){console.warn('[S5] Background fallback activated.',error);fallback()}
})();
