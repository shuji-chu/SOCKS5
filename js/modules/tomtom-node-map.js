(function(){
  'use strict';
  const TOMTOM_KEY='6eWTRIV0sPdlS8D4KBrMgYXxItM6skOz';
  function initNodeMap(){
    const container=document.getElementById('node-world-map');
    if(!container||container.dataset.initialized==='1')return;
    if(!window.tt||!window.tt.Map){container.textContent='地图加载中断，请刷新页面重试。';return;}
    container.dataset.initialized='1';
    try{
      const map=new tt.Map({
        key:TOMTOM_KEY,
        container:'node-world-map',
        center:[103.8198,1.3521],
        zoom:1.25,
        style:'https://api.tomtom.com/style/1/style/22.2.1-*/?map=2/basic_street-light',
        language:'zh-CN'
      });
      map.addControl(new tt.NavigationControl(),'top-right');
      map.on('load',function(){
        const points=[
          {name:'新加坡节点',coordinates:[103.8198,1.3521],color:'#55e8ff'},
          {name:'美国 · 旧金山节点',coordinates:[-122.4194,37.7749],color:'#ffd27c'}
        ];
        points.forEach(function(point){
          const popup=new tt.Popup({offset:24}).setText(point.name);
          new tt.Marker({color:point.color}).setLngLat(point.coordinates).setPopup(popup).addTo(map);
        });
      });
      window.S5_NODE_MAP=map;
    }catch(error){
      container.dataset.initialized='0';
      container.textContent='地图暂时无法显示，请稍后刷新。';
      console.error('[S5 TomTom map]',error);
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initNodeMap,{once:true});
  else initNodeMap();
})();