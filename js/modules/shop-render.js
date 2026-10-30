/* SOSKS5 atomic-SKU storefront renderer. One API row = one independent SKU; never merges variants. */
(function(w){'use strict';
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const val=(...xs)=>{for(const x of xs)if(x!==undefined&&x!==null&&String(x).trim()!=='')return x;return null};
const attrs=p=>p._merchantAttrs&&typeof p._merchantAttrs==='object'?p._merchantAttrs:{};
const first=(o,keys)=>{for(const k of keys)if(o[k]!==undefined&&o[k]!==null&&String(o[k]).trim()!=='')return o[k];return null};
const nice=v=>typeof v==='boolean'?(v?'已开启':'未开启'):typeof v==='object'?JSON.stringify(v):String(v);
const asset=u=>{if(!u)return '';u=String(u);const cdn=String(w.SOSKS5_OSS_BASE_URL||'').replace(/\/+$/,'');if(/^https?:\/\//i.test(u)){if(cdn){try{const p=new URL(u),api=new URL('https://web.lynli.me');if(p.hostname===api.hostname)return cdn+p.pathname+p.search+p.hash}catch(_){}}return u}const path=u.startsWith('/')?u:'/'+(u.startsWith('./')?u.slice(2):u);return cdn?cdn+path:u};
function stock(p){const b=val(p.bulk_available_count,p.wholesale_available_count,p.batch_stock,p.bulk_stock,p.wholesale_stock,p.available_batches);return b!==null?'可成批数 '+b:(p._stock==null?'商家未提供':String(p._stock))}
function image(p){const src=p._kind==='账号'?(p._icon||p._image):(p._image||p._icon)||'',initial=esc((p._title||'?').trim().charAt(0).toUpperCase());return '<div class="product-art">'+(src?'<img src="'+esc(src)+'" alt="'+esc(p._title)+'" loading="lazy" decoding="async" onerror="this.hidden=true;this.parentElement.classList.add(\'image-missing\')">':'')+'<span class="product-initial">'+initial+'</span></div>'}
function localIcon(u){if(!u)return './assets/icons/server.svg';const s=String(u).trim();if(s.startsWith('./assets/icons/'))return s.split(/[?#]/)[0];const marker='/assets/icons/';const i=s.indexOf(marker);if(i>=0){const file=s.slice(i+marker.length).split(/[?#]/)[0];if(/^[a-z0-9_.-]+\.svg$/i.test(file))return './assets/icons/'+file}if(s.startsWith('assets/icons/'))return './'+s.split(/[?#]/)[0];return './assets/icons/server.svg'}
function protocols(p){if(p._kind!=='节点')return '';const raw=p.protocols||p.supported_protocols||[p.protocol||p.node_protocol||p.type].filter(Boolean),items=Array.isArray(raw)?raw:String(raw).split(/[,，|]/).filter(Boolean),icons=p.protocol_icons||p.protocol_icon_urls||{};if(!items.length)return '<div class="sku-muted">协议信息：商家未提供</div>';return '<div class="protocol-badges">'+items.map(it=>{const n=typeof it==='object'?(it.name||it.protocol||it.type||'协议'):it,k=String(n).toLowerCase().replace(/[^a-z0-9]/g,''),u=(typeof it==='object'&&(it.icon_url||it.icon))||(icons[n]||icons[k])||p.icon_url||p.protocol_icon_url||p._icon||'';return '<span class="protocol-badge"><img loading="lazy" decoding="async" src="'+esc(localIcon(u))+'" onerror="this.onerror=null;this.src=\'./assets/icons/server.svg\'" alt="" aria-hidden="true">'+esc(n)+'</span>'}).join('')+'</div>'}
function protocolNames(p){
 if(p._kind!=='节点')return [];
 let raw=p.protocols||p.supported_protocols||p.protocol_list||p.protocol||p.node_protocol||p.type||[];
 if(typeof raw==='string')raw=raw.split(/[,，|、;；]+/);
 if(!Array.isArray(raw))raw=[raw];
 const aliases={vless:'VLESS',hysteria:'Hysteria2',hysteria2:'Hysteria2',trojan:'Trojan',vmess:'VMess',shadowsocks:'Shadowsocks',ss:'Shadowsocks',tuic:'TUIC',anytls:'AnyTLS',ssr:'SSR',shadowsocksr:'SSR',mtproto:'MTProto',mtp:'MTProto'};
 return [...new Set(raw.map(x=>typeof x==='object'?(x.name||x.protocol||x.type||x.value||''):x).map(x=>String(x||'').trim()).filter(Boolean).map(x=>aliases[x.toLowerCase().replace(/[^a-z0-9]/g,'')]||x))];
}
function planMetaTags(p){
 if(p._kind!=='节点')return [];
 const tags=[];
 const quota=val(p.traffic_limit,p.bandwidth_quota,p.data_limit,p.quota,p.traffic,p.traffic_quota,p.flow_limit);
 if(quota!=null)tags.push('流量 '+String(quota));
 const periods=[['month_price','月付'],['quarter_price','季付'],['half_year_price','半年付'],['year_price','年付']];
 periods.forEach(([key,label])=>{if(p[key]!==undefined&&p[key]!==null&&p[key]!==''&&Number.isFinite(Number(p[key])))tags.push(label)});
 const cycle=val(p.billing_cycle,p.period,p.pay_period,p.duration_label);
 if(cycle!=null)tags.push(String(cycle));
 return tags;
}
function tagList(p){
 let raw=val(p.tags,p.labels,p.badges,p.features,p.tagline,p.selling_points,attrs(p).tags,attrs(p).labels,attrs(p).features,attrs(p).tagline);
 if(raw==null)return [];
 const parseString=s=>{
  const text=String(s).trim();if(!text)return [];
  if(text[0]==='['||text[0]==='{'){
   try{return JSON.parse(text)}catch(_){return text.replace(/[\\[\\]"]/g,' ').split(/[,，|、;；\\n]+/)}
  }
  return text.split(/[,，|、;；\\n]+/);
 };
 if(typeof raw==='string')raw=parseString(raw);
 if(!Array.isArray(raw)&&raw&&typeof raw==='object')raw=Object.entries(raw).filter(([,v])=>v===true).map(([k])=>k);
 if(!Array.isArray(raw))raw=[raw];
 const out=[];
 for(const item of raw){
  let value=item&&typeof item==='object'?(item.label||item.name||item.title||item.value||''):item;
  if(typeof value==='string'&&(value.trim().startsWith('[')||value.trim().startsWith('{'))){
   const parsed=parseString(value);for(const v of (Array.isArray(parsed)?parsed:[parsed]))if(v!=null&&String(v).trim())out.push(String(v).trim());
  }else if(value!=null&&String(value).trim())out.push(String(value).trim());
 }
 return [...new Set(out.map(x=>x.replace(/[\\[\\]"]/g,' ').trim()).filter(Boolean))].slice(0,8);
}
function skuTitle(p){const a=attrs(p),parts=[val(p.registration_year,p.register_year,a.registration_year,a.register_year,a.created_year),val(p.registration_region,p.register_region,a.registration_region,a.registration_country,a.region,a.country),val(p.two_fa_status,p.two_fa,a.two_fa_status,a.two_fa,a.has_2fa),val(p.device_lock_status,p.device_lock,a.device_lock_status,a.device_lock)];const present=parts.filter(x=>x!==null).length;return present?parts.map((v,i)=>v===null?null:(i===0?'注册 '+v+'年':i===1?'地区 '+v:i===2?'2FA '+nice(v):'设备锁 '+nice(v))).filter(Boolean).join(' · '):''}
function merchantDashboard(p){if(p._kind!=='账号')return '';const a=attrs(p),groups=[['注册年份',['registration_year','register_year','created_year','year']],['注册地区',['registration_region','register_region','registration_country','region','country']],['2FA 状态',['two_fa','two_fa_status','twoFA','two_factor','has_2fa']],['设备锁状态',['device_lock','device_lock_status','deviceLock','device_bound']],['绑卡情况',['card_bound','has_card','payment_card','billing_card','card_status']]];const used=new Set(),rows=groups.map(([label,keys])=>{const k=keys.find(x=>a[x]!==undefined&&a[x]!==null)||keys.find(x=>p[x]!==undefined&&p[x]!==null);if(k)used.add(k);return [label,k?nice(a[k]??p[k]):'商家未提供']});for(const [k,v] of Object.entries(a))if(!used.has(k)&&v!=null&&typeof v!=='object')rows.push([k.replace(/_/g,' '),nice(v)]);return '<section class="archive-panel merchant-dashboard"><div class="archive-head"><div><div class="eyebrow">SKU ATTRIBUTE MATRIX</div><h4>商品属性档案</h4></div><span class="archive-stamp">逐 SKU 展示</span></div><div class="archive-grid">'+rows.map(([k,v])=>'<div class="archive-item"><span>'+esc(k)+'</span><b>'+esc(v)+'</b></div>').join('')+'</div></section>'}
function nodeCapabilities(p){if(p._kind!=='节点')return '';const rows=[['流媒体解锁',val(p.streaming_unlock,p.streaming,p.media_unlock,p.netflix_unlock,p.unlock_services)],['AI 服务',val(p.ai_unlock,p.chatgpt_unlock,p.openai_access,p.chatgpt)],['线路/地区',val(p.region,p.country,p.area,p.location)],['流量规格',val(p.traffic_limit,p.bandwidth_quota,p.data_limit,p.quota)],['当前延迟',val(p.latency_ms,p.latency,p.ping_ms,p.rtt_ms,p.response_time_ms)]];const cards=rows.map(([k,v])=>'<div class="archive-item"><span>'+esc(k)+'</span><b>'+esc(v==null?'未提供':k==='当前延迟'?String(v)+(String(v).includes('ms')?'':' ms'):nice(v))+'</b></div>').join('');return '<section class="archive-panel node-capability-panel"><div class="archive-head"><div><div class="eyebrow">NETWORK CAPABILITIES</div><h4>线路能力矩阵</h4></div><span class="archive-stamp">仅展示接口字段</span></div>'+protocols(p)+'<div class="archive-grid">'+cards+'</div><p class="archive-note">解锁能力与延迟以服务端提供的当前数据为准；未返回的项目不作保证。</p></section>'}
function deliveryPanel(p){const d=val(p.delivery_content,p.delivery_description,p.delivery,p.deliverables,p.delivery_type,p.delivery_method,p._delivery);const text=d==null?'交付方式待商家配置，请以订单交付页实际内容为准。':typeof d==='object'?JSON.stringify(d):String(d);const warranty=val(p.warranty,p.warranty_period,p.after_sales,p.after_sale,p.support_policy,p.guarantee,p._notice);return '<section class="archive-panel"><div class="archive-head"><div><div class="eyebrow">DELIVERY & AFTER-SALES</div><h4>交付内容与售后保障</h4></div><span class="archive-stamp">订单为准</span></div><div class="archive-grid"><div class="archive-item"><span>付款后交付</span><b>'+esc(text)+'</b></div><div class="archive-item"><span>质保 / 售后</span><b>'+esc(warranty==null?'商家未提供具体质保时长，请下单前联系确认。':nice(warranty))+'</b></div></div></section>'}
function tutorialPanel(p){const t=val(p._tutorial,p.tutorial_markdown,p.tutorial_md,p.tutorial,p.guide_markdown,p.guide,p.content_md);if(t)return '<section class="archive-panel"><div class="archive-head"><div><div class="eyebrow">PRODUCT PLAYBOOK</div><h4>本商品专属使用教程</h4></div><span class="archive-stamp">商家提供</span></div><div class="markdown">'+String(w.SOSKS5_RENDER_MARKDOWN?w.SOSKS5_RENDER_MARKDOWN(t):esc(t).replace(/\n/g,'<br>'))+'</div></section>';let steps=p._kind==='节点'?[['导入配置','在订单交付区复制订阅或配置，导入对应客户端。'],['首次连接','选择本商品支持的协议节点，连接后访问服务商允许的网站。'],['排查连接','连接失败时先更新订阅、切换协议节点并检查客户端时间与网络。']]:p._kind==='账号'?[['核对交付信息','收到账号后先核对登录方式、绑定信息和商家列出的 SKU 属性。'],['安全初始化','首次登录后按平台支持的流程更新密码、绑定恢复方式并启用双重验证。'],['妥善保管','不要共享验证码或恢复凭据；遇到登录异常先联系商家售后。']]:[['核对交付','按订单页面说明领取对应文件、兑换码或服务内容。'],['按说明启用','依照商品交付说明完成导入或激活。'],['保留凭证','保存订单号与交付记录，遇到问题通过官方售后渠道反馈。']];return '<section class="archive-panel"><div class="archive-head"><div><div class="eyebrow">PRODUCT PLAYBOOK</div><h4>上手与安全使用指南</h4></div><span class="archive-stamp">通用指引</span></div><p class="archive-note">商家尚未配置此 SKU 的专属教程，以下为通用操作建议，不代表商家承诺或特定平台规则。</p><div class="guide-steps">'+steps.map((x,i)=>'<div class="guide-step"><b>0'+(i+1)+' · '+esc(x[0])+'</b><p>'+esc(x[1])+'</p></div>').join('')+'</div></section>'}

function cleanAccountText(value){
 const raw=typeof value==='string'?value:(value&&typeof value==='object'?JSON.stringify(value):String(value??''));
 return raw.replace(/[\\[\\]"']/g,'').replace(/\\s*[,，|、;；]+\\s*/g,' · ').replace(/\\s+/g,' ').trim();
}
function renderUnifiedItem(p,activeFilter='全部'){
 const title=cleanAccountText(p._title||p.title||p.name||p.product_title||p.display_name||p.sku_title||p.sku_name||p.product_name||p.goods_name||p.item_name||'商品 '+String(p._key||''));
 const protocolTags=protocolNames(p);
 const selectedTag=activeFilter&&activeFilter!=='全部'&&matchesFilter(p,activeFilter)?[activeFilter]:[];
 const tags=[...new Set([...selectedTag,...protocolTags,...planMetaTags(p),cleanAccountText(p._region||p.region_name||p.region||p.country||p.area||''),...tagList(p).map(cleanAccountText)].filter(Boolean))].slice(0,8);
 const src=p._kind==='账号'?(p._icon||p._image):(p._image||p._icon);
 const fallback='./assets/icons/server.svg';
 const brand=p._brandIcon||(/\\bsteam\\b/i.test(title)?'steam':/netflix/i.test(title)?'netflix':/midjourney/i.test(title)?'midjourney':/\\bmail\\b|gmail|outlook/i.test(title)?'mail':'');
 const brandClass=brand?' brand-'+brand:'';
 const brandLabel=brand==='steam'?'S':brand==='netflix'?'N':brand==='midjourney'?'M':brand==='mail'?'✉':esc(title.trim().charAt(0).toUpperCase()||'?');
 const icon=brand?'<span class="sku-brand-mark'+brandClass+'" aria-label="'+esc(brand)+'">'+brandLabel+'</span>':'<img src="'+esc(src||fallback)+'" alt="" loading="lazy" decoding="async" onerror="this.remove()">';
 const price=p._priceProvided?'¥'+Number(p._price).toFixed(2):'询价';
 const stockValue=p._stock;
 const stockNumber=stockValue===null||stockValue===''?null:Number(stockValue);
 const outOfStock=stockNumber!==null&&Number.isFinite(stockNumber)&&stockNumber<=0;
 return '<article class="sku-row sku-clickable'+(outOfStock?' sku-out-of-stock':'')+'" data-sku="'+esc(p._key)+'" '+(outOfStock?'aria-disabled="true" tabindex="-1"':'data-buy-sku="'+esc(p._key)+'" role="button" tabindex="0" aria-label="购买 '+esc(title)+'"')+'>'+
  '<div class="sku-icon">'+icon+'</div>'+
  '<div class="sku-content">'+
   '<div class="sku-title">'+esc(title)+'</div>'+
   (tags.length?'<div class="sku-tags">'+tags.map(x=>'<span>'+esc(x)+'</span>').join('')+'</div>':'')+
   '<div class="sku-bottom"><span class="sku-price">'+price+'</span><span class="sku-stock">库存：'+esc(stock(p))+'</span></div>'+
 
  '</div></article>';
}
function matchesFilter(p,filter){
 if(!filter||filter==='全部')return true;
 const haystack=[p._title,p._desc,p._kind,p._region,p.protocol,p.node_protocol,p.protocols,p.supported_protocols,p.protocol_list,p.product_type,p.product_category,p.category,p.type,p.platform,p.brand,p.provider,p.account_category,p.traffic_platform,p.tags,p.labels,JSON.stringify(p._merchantAttrs||{})].filter(Boolean).map(x=>typeof x==='object'?JSON.stringify(x):String(x)).join(' ').toLowerCase();
 return haystack.includes(String(filter).toLowerCase());
}
function render({root,products,activeKind='节点',searchTerm='',activeFilter='全部',pageInfo={}}){
 if(!root)return;
 const query=String(searchTerm||'').trim().toLowerCase();
 const rows=products.filter(p=>p._kind===activeKind&&matchesFilter(p,activeFilter)&&(!query||[p._title,p._desc,p._kind,p._region,p.tags,p.protocol,p.node_protocol,p.platform,p.brand,p.provider,p.account_category,p.traffic_platform,JSON.stringify(p._merchantAttrs||{})].filter(Boolean).join(' ').toLowerCase().includes(query))).sort((a,b)=>Number(b._premium)-Number(a._premium));
 const page=Math.max(1,Number(pageInfo.page)||1),total=Math.max(0,Number(pageInfo.total)||0),totalPages=Math.max(1,Number(pageInfo.totalPages)||1);
 const count=document.getElementById('resultCount');if(count)count.textContent='共 '+total.toLocaleString()+' 件商品 · 当前筛选 '+rows.length+' 件';
 const pagination=()=>'<nav class="sku-pagination" aria-label="商品分页"><button type="button" data-page="prev" '+(page<=1?'disabled':'')+'>上一页</button><span class="sku-page-number">第 '+page+' / '+totalPages+' 页</span><button type="button" data-page="next" '+(page>=totalPages?'disabled':'')+'>下一页</button></nav>';
 if(!rows.length){root.innerHTML='<div class="empty-space"><div><div class="planet"></div><b>当前筛选暂无商品</b><p>接口已返回 '+total.toLocaleString()+' 件商品总量；可切换“全部”查看当前页商品。</p></div></div>'+pagination();bind();return}
 const visibleRows=pageInfo.serverPaginated?rows.slice(0,15):rows.slice((page-1)*15,page*15);
 root.innerHTML='<div class="sku-list">'+visibleRows.map(p=>renderUnifiedItem(p,activeFilter)).join('')+'</div>'+pagination();
 bind();
 function bind(){
  root.querySelectorAll('[data-open-sku]').forEach(btn=>btn.addEventListener('click',()=>{if(typeof w.openDetail==='function')w.openDetail(btn.dataset.openSku)}));
  root.querySelectorAll('[data-page]').forEach(btn=>btn.addEventListener('click',()=>{if(btn.disabled)return;const next=page+(btn.dataset.page==='next'?1:-1);if(typeof w.loadCatalogPage==='function'){w.loadCatalogPage(next,activeKind);const target=document.getElementById('products');if(target)target.scrollIntoView({behavior:'smooth',block:'start'});}}));
 }
}
w.ShopRender={render,merchantDashboard,productImage:image,stockLabel:stock,protocolBadges:protocols,nodeCapabilities,deliveryPanel,tutorialPanel,tagList};})(window);
