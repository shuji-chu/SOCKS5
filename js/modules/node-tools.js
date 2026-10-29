/* First-party node map and latency tools. No third-party map tiles or speed-test services. */
(function(w){
 'use strict';
 const API='https://web.lynli.me/api/v1';
 const token=()=>localStorage.getItem('sosks5_token')||localStorage.getItem('tgx_token')||'';
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const coords=n=>{
  const lat=Number(n?.lat??n?.latitude??n?.geo_lat??n?.location?.lat);
  const lng=Number(n?.lng??n?.lon??n?.longitude??n?.geo_lng??n?.location?.lng??n?.location?.lon);
  return Number.isFinite(lat)&&Number.isFinite(lng)&&lat>=-90&&lat<=90&&lng>=-180&&lng<=180?{lat,lng}:null;
 };
 function renderMap(n,label='节点物理位置'){
  const p=coords(n);if(!p)return '<section class="node-map-panel"><div class="node-map-head"><b>'+esc(label)+'</b><span class="node-map-state">等待真实坐标</span></div><p class="node-map-empty">当前节点资料未返回有效 lat / lng，暂不绘制虚构位置。请确认节点接口包含经纬度字段。</p></section>';
  const x=((p.lng+180)/360*100).toFixed(3),y=((90-p.lat)/180*100).toFixed(3);
  return '<section class="node-map-panel"><div class="node-map-head"><b>'+esc(label)+'</b><span class="node-map-state"><i></i>真实坐标</span></div><div class="node-map-canvas" role="img" aria-label="节点坐标地图，纬度 '+p.lat.toFixed(5)+'，经度 '+p.lng.toFixed(5)+'"><svg viewBox="0 0 720 340" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><defs><linearGradient id="nodeOcean" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0c2c48"/><stop offset="1" stop-color="#06172b"/></linearGradient><filter id="nodeGlow"><feGaussianBlur stdDeviation="7"/></filter></defs><rect width="720" height="340" rx="18" fill="url(#nodeOcean)"/><g stroke="#55e8ff" stroke-opacity=".13" stroke-width="1" fill="none">'+Array.from({length:11},(_,i)=>'<path d="M'+(i*72)+' 0V340"/>').join('')+Array.from({length:7},(_,i)=>'<path d="M0 '+(i*56.66)+'H720"/>').join('')+'</g><g fill="#1d5571" fill-opacity=".72" stroke="#4e9ab0" stroke-opacity=".45" stroke-width="1.2"><path d="M57 78l25-24 38-7 19 13 33-2 18 21-13 18-30 3-15 18-23 5-10 28-24-9-6-28-19-13z M165 157l22 9 12 29-10 32-19 28-14-11 6-34-11-27z M300 67l28-19 35 5 17 19 34-1 15 18-14 16-31 1-15 21-26-7-17-22-24-4z M342 142l34-12 30 14 12 34-18 42-25 27-22-19-4-39-19-22z M423 74l40-19 57 5 28 18 50-2 31 24-17 24-45 2-24 20-41-5-28 17-35-15-7-29-31-14z M552 208l30-12 36 13 14 25-22 24-38-5-21-21z"/></g><g><circle cx="'+x+'%" cy="'+y+'%" r="18" fill="#55e8ff" opacity=".35" filter="url(#nodeGlow)"/><circle cx="'+x+'%" cy="'+y+'%" r="10" fill="#55e8ff" opacity=".18"><animate attributeName="r" values="8;23;8" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values=".35;0;.35" dur="2s" repeatCount="indefinite"/></circle><circle cx="'+x+'%" cy="'+y+'%" r="5.5" fill="#baf8ff" stroke="#55e8ff" stroke-width="3"/></g><g fill="#83a9c4" font-size="10" font-family="sans-serif"><text x="12" y="18">180°W</text><text x="347" y="18">0°</text><text x="665" y="18">180°E</text><text x="8" y="334">90°S</text><text x="8" y="175">0°</text><text x="8" y="42">90°N</text></g></svg></div><div class="node-map-coords"><span>LAT <b>'+p.lat.toFixed(5)+'</b></span><span>LNG <b>'+p.lng.toFixed(5)+'</b></span></div></section>';
 }
 async function mountMap(root,n,label='节点真实物理位置'){
  if(!root)return;
  const direct=coords(n);if(direct){root.innerHTML=renderMap(n,label);return direct}
  root.innerHTML='<section class="node-map-panel"><div class="node-map-head"><b>'+esc(label)+'</b><span class="node-map-state">正在读取节点坐标…</span></div><p class="node-map-empty">正在请求本站节点地理位置接口。</p></section>';
  const id=n?.node_id??n?.server_id??n?.id??n?.product_id;
  const path=w.SOSKS5_NODE_LOCATION_PATH||'/node/location';
  if(id==null){root.innerHTML=renderMap({},label);return null}
  const headers={Accept:'application/json','Content-Type':'application/json'};if(token())headers.Authorization='Bearer '+token();
  try{
   const r=await fetch(API+path,{method:'POST',headers,body:JSON.stringify({node_id:id,server_id:n?.server_id,product_id:n?.product_id??n?.id,ip:n?.ip??n?.host??n?.server_ip}),signal:AbortSignal.timeout?AbortSignal.timeout(10000):undefined});
   let d={};try{d=await r.json()}catch{}
   if(!r.ok||d.success===false||d.error)throw Error(d.message||d.msg||'节点位置接口未返回成功');
   const data=d.data??d.node??d;const p=coords(data);
   if(!p)throw Error('接口未返回有效 lat / lng 经纬度');
   root.innerHTML=renderMap(data,label);return p;
  }catch(e){root.innerHTML='<section class="node-map-panel"><div class="node-map-head"><b>'+esc(label)+'</b><span class="node-map-state">坐标不可用</span></div><p class="node-map-empty">'+esc(e.message||'无法读取真实节点坐标')+'。未使用 IP 归属地第三方服务，也未绘制模拟位置。</p><button type="button" class="btn" data-node-map-retry>重新读取坐标</button></section>';root.querySelector('[data-node-map-retry]')?.addEventListener('click',()=>mountMap(root,n,label));return null}
 }
 function bindSpeed(button,n){
  if(!button)return;button.addEventListener('click',async()=>{
   if(button.dataset.running==='1')return;button.dataset.running='1';button.disabled=true;const old=button.textContent;button.innerHTML='<span class="node-speed-spin"></span> 正在测试当前节点…';
   const result=document.getElementById(button.dataset.result||'nodeSpeedResult');if(result)result.textContent='正在向当前节点测速…';
   const id=n?.id??n?.node_id??n?.server_id??n?.product_id;
   const headers={Accept:'application/json','Content-Type':'application/json'};if(token())headers.Authorization='Bearer '+token();
   const path=w.SOSKS5_NODE_SPEED_PATH||'/node/ping';let elapsed=0,success=false,message='';
   try{
    const started=performance.now();const r=await fetch(API+path,{method:'POST',headers,body:JSON.stringify({node_id:id,product_id:n?.product_id??n?.id,ip:n?.ip??n?.host??n?.server_ip}),signal:AbortSignal.timeout?AbortSignal.timeout(12000):undefined});elapsed=performance.now()-started;
    let d={};try{d=await r.json()}catch{}
    if(r.ok&&d.success!==false&&!d.error){const data=d.data??d;const ms=Number(data.latency_ms??data.latency??data.ping_ms??data.rtt_ms);const val=Number.isFinite(ms)&&ms>=0?ms:elapsed;success=true;message=val.toFixed(1)+' ms';}
    else message=d.message||d.msg||('测速接口响应 HTTP '+r.status);
   }catch(e){message=e.message||'测速请求失败'}
   if(!success){
    const host=String(n?.ip??n?.host??n?.server_ip??'').trim();
    const target=String(n?.health_url??n?.api_url??'').trim();
    let u;try{u=new URL(target,location.origin)}catch{}
    const isLiteralIp=/^(?:\d{1,3}\.){4}$/.test(host)||host.includes(':');
    const hostMatches=u&&host&&(u.hostname===host||u.hostname===String(n?.domain||''));
    if(target&&u&&/^https?:$/.test(u.protocol)&&hostMatches){
     try{const t=performance.now(),r=await fetch(u.href,{method:'GET',cache:'no-store',mode:'cors',signal:AbortSignal.timeout?AbortSignal.timeout(8000):undefined});const ms=performance.now()-t;if(r.ok){success=true;message=ms.toFixed(1)+' ms（节点 API 响应时间）'}else message='节点 API 返回 HTTP '+r.status}catch(e){message='节点 API 不可达或浏览器跨域策略阻止请求'}
    }else if(!path)message='尚未配置站内节点测速路由';
   }
   if(result){result.textContent=success?'当前节点延迟：'+message:'测速失败：'+message;result.dataset.state=success?'ok':'error'}
   button.disabled=false;button.dataset.running='0';button.textContent=old;
  });
 }
 w.NodeTools={renderMap,mountMap,bindSpeed,coordinates:coords};
})(window);