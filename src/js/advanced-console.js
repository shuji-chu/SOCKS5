(function(){
'use strict';
var esc=function(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});};
var $=function(id){return document.getElementById(id);};
var api=function(path,opts){if(!window.S5Api) return Promise.reject(new Error('API 客户端尚未初始化'));return window.S5Api.request(path,opts||{method:'GET'}).then(function(r){return window.S5Api.unwrap(r);});};
var token=function(){return window.S5Api&&window.S5Api.readToken?window.S5Api.readToken():'';};
function linksFrom(text){
 text=String(text||'').trim();
 if(/^[A-Za-z0-9+/=\r\n]+$/.test(text)&&!/(vless|vmess|trojan|ss|hysteria):\/\//i.test(text)){try{text=decodeURIComponent(escape(atob(text.replace(/\s/g,''))));}catch(e){}}
 return Array.from(new Set(text.match(/(?:vless|vmess|trojan|ss|ssr|hysteria2?|tuic|wireguard):\/\/[^\s"'<>]+/g)||[]));
}
function singbox(text){
 var list=linksFrom(text), out=[];
 list.forEach(function(link,i){try{
  if(/^vmess:\/\//i.test(link)){
   var payload=link.slice(8), obj=JSON.parse(decodeURIComponent(escape(atob(payload))));
   var vm={type:'vmess',tag:obj.ps||('vmess-'+(i+1)),server:obj.add,server_port:Number(obj.port),uuid:obj.id,security:obj.scy||'auto'};
   if(!vm.server||!vm.server_port||!vm.uuid)return;
   if(obj.tls==='tls')vm.tls={enabled:true,server_name:obj.sni||obj.host||obj.add};
   if(obj.net==='ws')vm.transport={type:'ws',path:obj.path||'/'};
   out.push(vm);return;
  }
  var u=new URL(link), scheme=u.protocol.replace(':',''), type=scheme==='hysteria2'?'hysteria2':scheme;
  if(!['vless','vmess','trojan','hysteria2','ss'].includes(type))return;
  var item={type:type,tag:decodeURIComponent(u.hash.slice(1)||type+'-'+(i+1)),server:u.hostname,server_port:Number(u.port||0)};
  if(!item.server_port)return;
  if(type==='vless'||type==='vmess')item.uuid=decodeURIComponent(u.username||'');
  if(type==='trojan'||type==='hysteria2')item.password=decodeURIComponent(u.username||'');
  if(u.searchParams.get('security')==='tls'||u.searchParams.get('tls')==='true'||type==='hysteria2')item.tls={enabled:true,server_name:u.searchParams.get('sni')||u.hostname};
  if(u.searchParams.get('type')==='ws')item.transport={type:'ws',path:u.searchParams.get('path')||'/'};
  out.push(item);
 }catch(e){}});
 return out.length?JSON.stringify({outbounds:out.concat([{type:'direct',tag:'direct'}]),route:{final:out[0].tag}},null,2):'';
}
function card(id,title,desc,value,ext){
 var disabled=!value;
 return '<article class="s5-engine-card"><div class="s5-engine-head"><h3>'+esc(title)+'</h3><span>EXPORT</span></div><p>'+esc(desc)+'</p><textarea id="s5-engine-'+id+'" rows="3" readonly>'+esc(value||'')+'</textarea><div class="s5-engine-actions"><button data-s5-copy="s5-engine-'+id+'" '+(disabled?'disabled':'')+'>复制</button><button data-s5-download="s5-engine-'+id+'" data-ext="'+esc(ext)+'" '+(disabled?'disabled':'')+'>下载</button></div>'+(disabled?'<small>后端订阅数据不足，未生成占位内容。</small>':'')+'</article>';
}
function enhanceSubscription(){
 var box=$('s5-subscription-box'); if(!box||box.querySelector('.s5-engine'))return;
 var source=($('s5-config-yaml')||{}).value||'';
 var raw=linksFrom(source), v2=raw.length?btoa(unescape(encodeURIComponent(raw.join('\n')))):'', sb=singbox(source);
 var section=document.createElement('section'); section.className='s5-engine';
 section.innerHTML='<div class="s5-engine-title"><span>SUBSCRIPTION ENGINE</span><h2>高级订阅导出引擎</h2><p>只转换接口返回的订阅数据；无法识别的协议不会伪造节点。</p></div><div class="s5-engine-grid">'+card('clash','Clash 格式','复制或下载后端原始 YAML 配置。',source,'yaml')+card('v2rayn','V2rayN 格式','将解析到的原始节点 URI 编码为 Base64。',v2,'txt')+card('singbox','sing-box 格式','从已识别 URI 转换为 JSON。',sb,'json')+card('raw','原始节点链接','一键复制已识别的全部节点链接。',raw.join('\n'),'txt')+'</div><div class="s5-import"><h3>一键导入 / 自动识别</h3><p>支持粘贴节点 URI、Base64 订阅正文、Clash YAML 或 sing-box JSON。订阅网址本身不能在此伪装成已解析配置。</p><textarea id="s5-import-source" rows="4" placeholder="粘贴订阅正文或节点链接…"></textarea><div class="s5-engine-actions"><button id="s5-import-run">自动识别</button><button id="s5-import-reset">清空</button></div><div id="s5-import-output">等待输入。</div></div>';
 box.appendChild(section);
}
function loadScript(url){return new Promise(function(resolve,reject){var s=document.createElement('script');s.src=url;s.onload=resolve;s.onerror=function(){reject(new Error('地图脚本加载失败'));};document.head.appendChild(s);});}
var countryCoords={'美国':[39.8283,-98.5795],'USA':[39.8283,-98.5795],'US':[39.8283,-98.5795],'日本':[36.2048,138.2529],'Japan':[36.2048,138.2529],'JP':[36.2048,138.2529],'新加坡':[1.3521,103.8198],'Singapore':[1.3521,103.8198],'SG':[1.3521,103.8198],'德国':[51.1657,10.4515],'Germany':[51.1657,10.4515],'DE':[51.1657,10.4515],'英国':[55.3781,-3.436],'United Kingdom':[55.3781,-3.436],'UK':[55.3781,-3.436],'香港':[22.3193,114.1694],'HK':[22.3193,114.1694],'韩国':[35.9078,127.7669],'South Korea':[35.9078,127.7669],'KR':[35.9078,127.7669],'加拿大':[56.1304,-106.3468],'Canada':[56.1304,-106.3468],'CA':[56.1304,-106.3468]};
async function orderMap(){
 if(!token()||!$('app-view'))return;
 var panel=$('s5-real-order-map');
 if(!panel){panel=document.createElement('section');panel.id='s5-real-order-map';panel.className='s5-map-panel';$('app-view').appendChild(panel);}
 panel.innerHTML='<h2>我的节点地图</h2><p>正在读取真实订单；仅标记套餐数据中可识别国家的节点。</p><div id="s5-real-map" style="height:350px"></div><div id="s5-real-map-note">加载订单中…</div>';
 try{
  var orders=await api('/user/order/fetch',{method:'GET'});if(!Array.isArray(orders))orders=orders&&(orders.list||orders.orders)||[];
  var points=[];
  orders.forEach(function(o){var p=o.plan||{};if(p.product_type&&p.product_type!=='node')return;var text=[p.country,p.region,p.name,p.content].filter(Boolean).join(' ');var key=Object.keys(countryCoords).find(function(k){return text.toLowerCase().includes(k.toLowerCase());});if(key)points.push({o:o,p:p,key:key});});
  if(!window.L)await loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js');
  if(!document.querySelector('[data-s5-leaflet-css]')){var l=document.createElement('link');l.rel='stylesheet';l.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';l.setAttribute('data-s5-leaflet-css','1');document.head.appendChild(l);}
  if(window.__s5Map)window.__s5Map.remove();
  var map=L.map('s5-real-map').setView([25,10],2);window.__s5Map=map;L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap'}).addTo(map);
  points.forEach(function(pt){var p=pt.p,o=pt.o,lat=p.latency_ms||p.latency||o.latency_ms,through=p.throughput_mbps||p.throughput||o.throughput_mbps;L.marker(countryCoords[pt.key]).addTo(map).bindPopup('<b>'+esc(p.name||pt.key)+'</b><br>'+esc(pt.key)+'<br>延迟：'+esc(lat==null?'接口未提供':lat+' ms')+'<br>吞吐量：'+esc(through==null?'接口未提供':through+' Mbps'));});
  $('s5-real-map-note').textContent=points.length?'已根据 '+orders.length+' 笔真实订单标记 '+points.length+' 个国家节点。延迟/吞吐量仅在接口返回时展示。':'已读取 '+orders.length+' 笔订单，但没有可识别的国家字段，未生成虚构点位。';
  setTimeout(function(){map.invalidateSize();},100);
 }catch(e){var note=$('s5-real-map-note');if(note)note.textContent='地图暂不可用：'+e.message;}
}
function robotCard(name,status,link){return '<article class="s5-bot-card"><b>'+esc(name)+'</b><p>'+esc(status)+'</p>'+(link?'<a href="'+esc(link)+'" target="_blank" rel="noopener noreferrer">打开机器人 ↗</a>':'')+'</article>';}
async function businessPanel(){
 if(!token()||!$('app-view'))return;
 var box=$('s5-private-ops');if(!box){box=document.createElement('section');box.id='s5-private-ops';box.className='s5-private-ops';if((location.hash||'')==='#/traffic')$('app-view').insertBefore(box,$('app-view').firstChild);else $('app-view').appendChild(box);}
 box.innerHTML='<p>正在读取机器人绑定和分红接口…</p>';
 var results=await Promise.allSettled([api('/user/bot/status',{method:'GET'}),api('/user/withdraw/list',{method:'GET'})]);
 var bot=results[0].status==='fulfilled'?results[0].value:null, money=results[1].status==='fulfilled'?results[1].value:null;
 var user=window.App&&App.state?App.state.user||{}:{},sid=user.short_id||user.shortId||bot&&bot.short_id||'',invite=sid?location.origin+location.pathname+'?invite_code='+encodeURIComponent(sid):'';
 box.innerHTML='<div class="s5-ops-grid"><section class="s5-ops-card"><span>PRIVATE BOT MATRIX</span><h2>机器人矩阵</h2><div class="s5-bot-grid">'+robotCard('SafeW','用户端状态接口未开放','')+robotCard('Mivra',bot?(bot.bound?'已绑定':'尚未绑定'):'状态接口请求失败',bot&&bot.mivra_url||'')+robotCard('晴天','用户端状态接口未开放','')+'</div><p>邀请码：<b>'+esc(sid||'接口未返回')+'</b></p><p>Telegram ID：'+esc(bot&&bot.tg_id||'尚未绑定或接口未返回')+'</p><p>机器人领取流量：'+esc(bot&&bot.traffic_mb!=null?bot.traffic_mb+' MB':'接口未返回')+'</p><p>'+esc(bot&&bot.guide?bot.guide.replace('{short_id}',sid):'绑定方式以机器人端指引为准')+'</p></section><section class="s5-ops-card"><span>INVITE & REWARDS</span><h2>邀请分红</h2><p>5 位邀请码：<b>'+esc(sid||'接口未返回')+'</b></p><p class="s5-break">邀请链接：'+esc(invite||'无法生成')+'</p><button data-s5-copy-value="'+esc(invite)+'" '+(!invite?'disabled':'')+'>复制邀请链接</button><div class="s5-commission-grid"><div><small>可用分红余额</small><strong>'+(money?'¥'+(Number(money.balance||0)/100).toFixed(2):'接口未返回')+'</strong></div><div><small>累计分红</small><strong>'+(money?'¥'+(Number(money.total||0)/100).toFixed(2):'接口未返回')+'</strong></div></div><p>下级人数与每日/月度明细没有对应用户端接口字段，当前不展示虚构统计。</p></section></div>';
}
function copyText(text){if(navigator.clipboard&&window.isSecureContext)return navigator.clipboard.writeText(text);var t=document.createElement('textarea');t.value=text;document.body.appendChild(t);t.select();try{document.execCommand('copy');}finally{t.remove();}return Promise.resolve();}
function bindEvents(){
 document.addEventListener('click',function(e){
  var cp=e.target.closest('[data-s5-copy]');if(cp){var t=$(cp.getAttribute('data-s5-copy'));if(t&&t.value)copyText(t.value).then(function(){if(App.showToast)App.showToast('复制成功');});}
  var dl=e.target.closest('[data-s5-download]');if(dl){var t=$(dl.getAttribute('data-s5-download'));if(t&&t.value){var u=URL.createObjectURL(new Blob([t.value],{type:'text/plain;charset=utf-8'}));var a=document.createElement('a');a.href=u;a.download='sosks5-'+dl.getAttribute('data-s5-download').replace('s5-engine-','')+'.'+dl.getAttribute('data-ext');a.click();URL.revokeObjectURL(u);}}
  var copy=e.target.closest('[data-s5-copy-value]');if(copy){copyText(copy.getAttribute('data-s5-copy-value')||'').then(function(){if(App.showToast)App.showToast('复制成功');});}
  if(e.target.closest('#s5-import-run')){var input=$('s5-import-source'),out=$('s5-import-output'),text=input?input.value.trim():'';if(/^https?:\/\//i.test(text)&&!/\s/.test(text)){out.textContent='已识别为订阅网址，但当前后端没有转换接口；请粘贴订阅正文，避免跨域请求外部地址。';return;}var json=null;try{json=JSON.parse(text);}catch(err){}var found=linksFrom(text);if(found.length)out.innerHTML='<b>识别成功：'+found.length+' 个节点链接</b><pre>'+esc(found.join('\n'))+'</pre><button data-s5-copy-value="'+esc(found.join('\n'))+'">复制节点链接</button>';else if(json&&Array.isArray(json.outbounds))out.textContent='已识别 sing-box JSON，outbounds 数量：'+json.outbounds.length;else if(/proxies:\s*\n|proxy-groups:/i.test(text))out.textContent='已识别 Clash YAML；未发现可安全提取的 URI，原文未被改写。';else out.textContent='未识别该内容。支持常见节点 URI、Base64 订阅正文、Clash YAML 与 sing-box JSON。';}
  if(e.target.closest('#s5-import-reset')){if($('s5-import-source'))$('s5-import-source').value='';if($('s5-import-output'))$('s5-import-output').textContent='等待输入。';}
 });
}
function init(){
 if(!window.App)return;
 var old=App.router.bind(App);
 App.router=function(){old();var hash=location.hash||'#/';setTimeout(function(){if(hash==='#/dashboard'){enhanceSubscription();businessPanel();}if(hash==='#/orders')orderMap();if(hash==='#/traffic')businessPanel();},450);};
 var observer=new MutationObserver(function(){if((location.hash||'')==='#/dashboard')enhanceSubscription();});
 var view=$('app-view');if(view)observer.observe(view,{childList:true,subtree:true});
 bindEvents();
 if((location.hash||'')==='#/dashboard'){enhanceSubscription();businessPanel();}
 if((location.hash||'')==='#/orders')orderMap();
 if((location.hash||'')==='#/traffic')businessPanel();
}
var style=document.createElement('style');style.textContent='.s5-engine{margin-top:24px}.s5-engine-title span,.s5-ops-card>span{font-size:11px;letter-spacing:.18em;color:#64748b;font-weight:800}.s5-engine-title h2,.s5-ops-card h2,.s5-map-panel h2{font-size:22px;font-weight:800;color:#0f172a;margin:6px 0}.s5-engine-title p,.s5-import p,.s5-map-panel>p{font-size:13px;color:#64748b}.s5-engine-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin-top:18px}.s5-engine-card,.s5-import,.s5-ops-card,.s5-map-panel{border:1px solid #e2e8f0;border-radius:18px;background:#fff;padding:18px;margin-top:16px;box-shadow:0 8px 30px #0f172a08}.s5-engine-head{display:flex;justify-content:space-between;gap:8px}.s5-engine-head h3{font-weight:800;color:#0f172a}.s5-engine-head span{font-size:10px;color:#94a3b8}.s5-engine-card p{font-size:12px;color:#64748b;min-height:36px;margin:10px 0}.s5-engine-card textarea,.s5-import textarea{width:100%;border:1px solid #e2e8f0;border-radius:10px;padding:9px;font:11px monospace;overflow-wrap:anywhere}.s5-engine-actions{display:flex;gap:8px;margin-top:10px}.s5-engine-actions button,.s5-ops-card button{border:1px solid #cbd5e1;border-radius:9px;padding:8px 12px;font-size:12px;font-weight:700}.s5-engine-actions button:first-child,.s5-ops-card button{background:#2563eb;color:#fff;border-color:#2563eb}.s5-engine-actions button:disabled,.s5-ops-card button:disabled{opacity:.4}.s5-engine-card small{display:block;color:#b45309;margin-top:8px;font-size:11px}.s5-import h3{font-size:18px;font-weight:800}.s5-import>p,.s5-ops-card>p{margin-top:10px;font-size:13px;color:#64748b}.s5-import pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#f8fafc;padding:10px;border-radius:8px;margin-top:10px}.s5-ops-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.s5-bot-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:14px}.s5-bot-card{border:1px solid #e2e8f0;border-radius:12px;padding:12px;min-width:0}.s5-bot-card p{font-size:12px;color:#64748b;margin:8px 0}.s5-bot-card a{font-size:12px;color:#2563eb}.s5-commission-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:16px}.s5-commission-grid>div{background:#f8fafc;padding:12px;border-radius:10px}.s5-commission-grid small{display:block;color:#64748b}.s5-commission-grid strong{display:block;font-size:19px;margin-top:6px}.s5-break{overflow-wrap:anywhere}@media(max-width:900px){.s5-engine-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.s5-ops-grid{grid-template-columns:1fr}}@media(max-width:520px){.s5-engine-grid{grid-template-columns:1fr}.s5-bot-grid{grid-template-columns:1fr}.s5-engine-card{padding:14px}}';
document.head.appendChild(style);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(init,50);});else setTimeout(init,50);
})();