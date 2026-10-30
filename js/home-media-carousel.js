/* Homepage media carousel: timed autoplay only, no manual slide interaction. */
(()=> {
  'use strict';
  const root=document.getElementById('homeMediaCarousel');
  if(!root)return;
  const stage=root.querySelector('#mediaCarouselStage');
  const caption=root.querySelector('#mediaCarouselCaption');
  const pagination=root.querySelector('#mediaCarouselPagination');
  // Replace this local demo array with the backend response when its endpoint is ready.
  const carouselData=[
    {type:'image',src:'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=85',link:'./shop.html',text:'探索全球高速节点，连接更广阔的数字世界'},
    {type:'video',src:'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',link:'./developer.html',text:'了解晴天社区服务能力与开发者接入指南'},
    {type:'gif',src:'https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif',link:'./blog.html',text:'关注社区动态，发现更多精选内容'}
  ];
  let current=0,timer=null;
  const safeUrl=value=>{try{const u=new URL(value,location.href);return ['http:','https:'].includes(u.protocol)?u.href:null}catch(_){return null}};
  const render=()=>{
    const item=carouselData[current];
    if(!item)return;
    const link=safeUrl(item.link);
    const mediaUrl=safeUrl(item.src);
    if(!link||!mediaUrl){caption.textContent=String(item.text||'晴天社区精选内容');return}
    const slide=document.createElement('a');
    slide.className='media-carousel-slide is-active';
    slide.href=link;slide.target='_blank';slide.rel='noopener noreferrer';
    slide.setAttribute('aria-label',String(item.text||'打开精选内容'));
    slide.addEventListener('click',event=>{
      event.preventDefault();
      window.open(link,'_blank','noopener,noreferrer');
    });
    if(item.type==='video'){
      const video=document.createElement('video');
      video.src=mediaUrl;video.autoplay=true;video.muted=true;video.loop=true;video.playsInline=true;
      video.setAttribute('autoplay','');video.setAttribute('muted','');video.setAttribute('loop','');video.setAttribute('playsinline','');
      video.preload='metadata';slide.appendChild(video);
      const play=video.play();if(play&&typeof play.catch==='function')play.catch(()=>{});
    }else{
      const img=document.createElement('img');
      img.src=mediaUrl;img.alt=String(item.text||'晴天社区轮播内容');img.loading='eager';img.draggable=false;
      slide.appendChild(img);
    }
    stage.replaceChildren(slide);
    caption.textContent=String(item.text||'晴天社区精选内容');
    Array.from(pagination.children).forEach((dot,index)=>dot.classList.toggle('is-active',index===current));
  };
  carouselData.forEach((_,index)=>{const dot=document.createElement('span');if(index===0)dot.className='is-active';pagination.appendChild(dot)});
  render();
  if(carouselData.length>1)timer=window.setInterval(()=>{current=(current+1)%carouselData.length;render()},3000);
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&timer){clearInterval(timer);timer=null}else if(!document.hidden&&!timer&&carouselData.length>1)timer=window.setInterval(()=>{current=(current+1)%carouselData.length;render()},3000)});
  window.addEventListener('pagehide',()=>{if(timer)clearInterval(timer)},{once:true});
})();
