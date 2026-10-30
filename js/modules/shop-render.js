/* SOSKS5 atomic-SKU storefront renderer. One API row = one independent SKU; never merges variants. */
(function(w){'use strict';
let pageNavigationLocked=false;
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
 const flatten=value=>{
  if(value==null||value==='')return [];
  if(Array.isArray(value))return value.flatMap(flatten);
  if(typeof value==='object'){
   for(const key of ['name','text','label','title','value','tag','display_name'])if(value[key]!==undefined&&value[key]!==null&&value[key]!=='')return flatten(value[key]);
   return Object.entries(value).filter(([,v])=>v===true).map(([k])=>k);
  }
  if(typeof value==='string'){
   const text=value.trim();if(!text)return [];
   if(text[0]==='['||text[0]==='{'){try{return flatten(JSON.parse(text))}catch(_){}}
   return text.split(/[,，|、;；\\n]+/).map(x=>x.trim()).filter(Boolean);
  }
  return [String(value)];
 };
 return [...new Set(flatten(raw).map(cleanAccountText).filter(Boolean))].slice(0,8);
}
function skuTitle(p){const a=attrs(p),parts=[val(p.registration_year,p.register_year,a.registration_year,a.register_year,a.created_year),val(p.registration_region,p.register_region,a.registration_region,a.registration_country,a.region,a.country),val(p.two_fa_status,p.two_fa,a.two_fa_status,a.two_fa,a.has_2fa),val(p.device_lock_status,p.device_lock,a.device_lock_status,a.device_lock)];const present=parts.filter(x=>x!==null).length;return present?parts.map((v,i)=>v===null?null:(i===0?'注册 '+v+'年':i===1?'地区 '+v:i===2?'2FA '+nice(v):'设备锁 '+nice(v))).filter(Boolean).join(' · '):''}
function merchantDashboard(p){if(p._kind!=='账号')return '';const a=attrs(p),groups=[['注册年份',['registration_year','register_year','created_year','year']],['注册地区',['registration_region','register_region','registration_country','region','country']],['2FA 状态',['two_fa','two_fa_status','twoFA','two_factor','has_2fa']],['设备锁状态',['device_lock','device_lock_status','deviceLock','device_bound']],['绑卡情况',['card_bound','has_card','payment_card','billing_card','card_status']]];const used=new Set(),rows=groups.map(([label,keys])=>{const k=keys.find(x=>a[x]!==undefined&&a[x]!==null)||keys.find(x=>p[x]!==undefined&&p[x]!==null);if(k)used.add(k);return [label,k?nice(a[k]??p[k]):'商家未提供']});for(const [k,v] of Object.entries(a))if(!used.has(k)&&v!=null&&typeof v!=='object')rows.push([k.replace(/_/g,' '),nice(v)]);return '<section class="archive-panel merchant-dashboard"><div class="archive-head"><div><div class="eyebrow">SKU ATTRIBUTE MATRIX</div><h4>商品属性档案</h4></div><span class="archive-stamp">逐 SKU 展示</span></div><div class="archive-grid">'+rows.map(([k,v])=>'<div class="archive-item"><span>'+esc(k)+'</span><b>'+esc(v)+'</b></div>').join('')+'</div></section>'}
function nodeCapabilities(p){if(p._kind!=='节点')return '';const rows=[['流媒体解锁',val(p.streaming_unlock,p.streaming,p.media_unlock,p.netflix_unlock,p.unlock_services)],['AI 服务',val(p.ai_unlock,p.chatgpt_unlock,p.openai_access,p.chatgpt)],['线路/地区',val(p.region,p.country,p.area,p.location)],['流量规格',val(p.traffic_limit,p.bandwidth_quota,p.data_limit,p.quota)],['当前延迟',val(p.latency_ms,p.latency,p.ping_ms,p.rtt_ms,p.response_time_ms)]];const cards=rows.map(([k,v])=>'<div class="archive-item"><span>'+esc(k)+'</span><b>'+esc(v==null?'未提供':k==='当前延迟'?String(v)+(String(v).includes('ms')?'':' ms'):nice(v))+'</b></div>').join('');return '<section class="archive-panel node-capability-panel"><div class="archive-head"><div><div class="eyebrow">NETWORK CAPABILITIES</div><h4>线路能力矩阵</h4></div><span class="archive-stamp">仅展示接口字段</span></div>'+protocols(p)+'<div class="archive-grid">'+cards+'</div><p class="archive-note">解锁能力与延迟以服务端提供的当前数据为准；未返回的项目不作保证。</p></section>'}
function deliveryPanel(p){const d=val(p.delivery_content,p.delivery_description,p.delivery,p.deliverables,p.delivery_type,p.delivery_method,p._delivery);const text=d==null?'交付方式待商家配置，请以订单交付页实际内容为准。':typeof d==='object'?JSON.stringify(d):String(d);const warranty=val(p.warranty,p.warranty_period,p.after_sales,p.after_sale,p.support_policy,p.guarantee,p._notice);return '<section class="archive-panel"><div class="archive-head"><div><div class="eyebrow">DELIVERY & AFTER-SALES</div><h4>交付内容与售后保障</h4></div><span class="archive-stamp">订单为准</span></div><div class="archive-grid"><div class="archive-item"><span>付款后交付</span><b>'+esc(text)+'</b></div><div class="archive-item"><span>质保 / 售后</span><b>'+esc(warranty==null?'商家未提供具体质保时长，请下单前联系确认。':nice(warranty))+'</b></div></div></section>'}
function tutorialPanel(p){const t=val(p._tutorial,p.tutorial_markdown,p.tutorial_md,p.tutorial,p.guide_markdown,p.guide,p.content_md);if(t)return '<section class="archive-panel"><div class="archive-head"><div><div class="eyebrow">PRODUCT PLAYBOOK</div><h4>本商品专属使用教程</h4></div><span class="archive-stamp">商家提供</span></div><div class="markdown">'+String(w.SOSKS5_RENDER_MARKDOWN?w.SOSKS5_RENDER_MARKDOWN(t):esc(t).replace(/\n/g,'<br>'))+'</div></section>';let steps=p._kind==='节点'?[['导入配置','在订单交付区复制订阅或配置，导入对应客户端。'],['首次连接','选择本商品支持的协议节点，连接后访问服务商允许的网站。'],['排查连接','连接失败时先更新订阅、切换协议节点并检查客户端时间与网络。']]:p._kind==='账号'?[['核对交付信息','收到账号后先核对登录方式、绑定信息和商家列出的 SKU 属性。'],['安全初始化','首次登录后按平台支持的流程更新密码、绑定恢复方式并启用双重验证。'],['妥善保管','不要共享验证码或恢复凭据；遇到登录异常先联系商家售后。']]:[['核对交付','按订单页面说明领取对应文件、兑换码或服务内容。'],['按说明启用','依照商品交付说明完成导入或激活。'],['保留凭证','保存订单号与交付记录，遇到问题通过官方售后渠道反馈。']];return '<section class="archive-panel"><div class="archive-head"><div><div class="eyebrow">PRODUCT PLAYBOOK</div><h4>上手与安全使用指南</h4></div><span class="archive-stamp">通用指引</span></div><p class="archive-note">商家尚未配置此 SKU 的专属教程，以下为通用操作建议，不代表商家承诺或特定平台规则。</p><div class="guide-steps">'+steps.map((x,i)=>'<div class="guide-step"><b>0'+(i+1)+' · '+esc(x[0])+'</b><p>'+esc(x[1])+'</p></div>').join('')+'</div></section>'}

function localizeCatalogText(value){
 let text=String(value==null?'':value);
 const countries={"US":"美国","UK":"英国","GB":"英国","IN":"印度","SG":"新加坡","CA":"加拿大","BR":"巴西","RU":"俄罗斯","CN":"中国","JP":"日本","KR":"韩国","HK":"中国香港","TW":"中国台湾","TH":"泰国","VN":"越南","ID":"印度尼西亚","MY":"马来西亚","PH":"菲律宾","AU":"澳大利亚","NZ":"新西兰","DE":"德国","FR":"法国","IT":"意大利","ES":"西班牙","NL":"荷兰","SE":"瑞典","NO":"挪威","FI":"芬兰","PL":"波兰","TR":"土耳其","MX":"墨西哥","AR":"阿根廷","CL":"智利","CO":"哥伦比亚","ZA":"南非","NG":"尼日利亚","EG":"埃及","AE":"阿联酋","SA":"沙特阿拉伯","IL":"以色列","PK":"巴基斯坦","BD":"孟加拉国","LK":"斯里兰卡","NP":"尼泊尔"};
 text=text.replace(/\[\s*([A-Z]{2})\s*\]/gi,(match,code)=>countries[code.toUpperCase()]?'['+countries[code.toUpperCase()]+']':match);
 const rules=[
  [/\b2FA\s*On\b/gi,'已开2FA'],[/\b2FA\s*Off\b/gi,'无2FA'],[/\bRandom\s+Country\b/gi,'随机国家'],
  [/\bBlind\s+Box\b/gi,'盲盒'],[/\bFull\s+Account\b/gi,'全功能号'],[/\bDevice\s+Lock\b/gi,'设备锁'],
  [/\bShared\s+Account\b/gi,'共享账号'],[/\bShared\b/gi,'共享号'],[/\bAged\b/gi,'老号'],
  [/\bVerified\b/gi,'已验证'],[/\bUnverified\b/gi,'未验证'],[/\bPremium\b/gi,'高级版'],
  [/\bInstant\s+Delivery\b/gi,'即时交付'],[/\bFull\s+Access\b/gi,'完整权限'],[/\bPhone\s+Verified\b/gi,'手机已验证'],
  [/\bAvailable\b/gi,'有货'],[/\bIn\s+Stock\b/gi,'有库存'],[/\bWith\s+Token\b/gi,'含令牌'],[/\bToken\b/gi,'令牌']
 ];
 rules.forEach(([pattern,replacement])=>{text=text.replace(pattern,replacement)});
 return text.replace(/\s{2,}/g,' ').trim();
}
function cleanAccountText(value){
 const pick=value=>{
  if(value==null)return '';
  if(Array.isArray(value))return value.map(pick).filter(Boolean).join(' · ');
  if(typeof value==='object'){
   for(const key of ['name','text','label','title','value','display_name','tag'])if(value[key]!==undefined&&value[key]!==null&&value[key]!=='')return pick(value[key]);
   return Object.entries(value).filter(([,v])=>v===true).map(([k])=>k).join(' · ');
  }
  return String(value);
 };
 return localizeCatalogText(pick(value)).replace(/["']/g,'').replace(/\s*[,，|、;；]+\s*/g,' · ').replace(/\s+/g,' ').trim();
}
function renderUnifiedItem(p,activeFilter='全部'){
 const title=cleanAccountText(p._title||p.title||p.name||p.product_title||p.display_name||p.sku_title||p.sku_name||p.product_name||p.goods_name||p.item_name||'商品 '+String(p._key||''));
 const protocolTags=protocolNames(p);
 const selectedTag=activeFilter&&activeFilter!=='全部'&&matchesFilter(p,activeFilter)?[activeFilter]:[];
 const tags=[...new Set([...selectedTag,...protocolTags,...planMetaTags(p),cleanAccountText(p._region||p.region_name||p.region||p.country||p.area||''),...tagList(p).map(cleanAccountText)].filter(Boolean))].slice(0,8);
 const src=p._image||p._icon;
 const fallback='./assets/icons/network.svg';
 const brand=p._brandIcon||(/(^|[^a-z])steam([^a-z]|$)/i.test(title)?'steam':/netflix/i.test(title)?'netflix':/midjourney/i.test(title)?'midjourney':/mail\.ru|mailru/i.test(title)?'mailru':/telegram|电报/i.test(title)?'telegram':/threads/i.test(title)?'threads':/discord/i.test(title)?'discord':/tiktok/i.test(title)?'tiktok':/reddit/i.test(title)?'reddit':/gmail|outlook/i.test(title)?'mail':'generic');
 const brandIcons={telegram:'telegram.svg',threads:'threads.svg',steam:'steam.svg',tiktok:'tiktok.svg',discord:'discord.svg',reddit:'reddit.svg'};
 const brandIcon=brandIcons[brand];
 const icon=brandIcon?'<img class="sku-brand-icon" src="./assets/icons/'+brandIcon+'" alt="'+esc(brand)+'" loading="lazy" decoding="async">':src?'<img src="'+esc(src)+'" alt="'+esc(title)+'" loading="lazy" decoding="async" onerror="this.hidden=true;this.parentElement.classList.add(\'image-missing\')">':'<img src="'+esc(fallback)+'" alt="" loading="lazy" decoding="async" onerror="this.remove()">';
 const price=p._priceProvided?'¥'+Number(p._price).toFixed(2):'询价';
 const stockValue=p._stock;
 const stockNumber=stockValue===null||stockValue===''?null:Number(stockValue);
 const outOfStock=stockNumber!==null&&Number.isFinite(stockNumber)&&stockNumber<=0;
 return '<article class="sku-row sku-clickable'+(outOfStock?' sku-out-of-stock':'')+'" data-sku="'+esc(p._key)+'" '+(outOfStock?'aria-disabled="true" tabindex="-1"':'data-buy-sku="'+esc(p._key)+'" role="button" tabindex="0" aria-label="购买 '+esc(title)+'"')+'>'+
  '<div class="sku-icon">'+icon+'</div>'+
  '<div class="sku-content">'+
   '<div class="sku-title">'+esc(title)+'</div>'+
   (tags.length?'<div class="sku-tags">'+tags.map(x=>'<span style="display:inline-flex;flex:0 0 auto;white-space:nowrap;word-break:keep-all;overflow-wrap:normal">'+esc(x)+'</span>').join('')+'</div>':'')+
   '<div class="sku-bottom"><span class="sku-price">'+price+'</span><span class="sku-stock">库存：'+esc(stock(p))+'</span></div>'+
 
  '</div></article>';
}
function matchesFilter(p,filter){
 if(!filter||filter==='全部')return true;
 const facets=Array.isArray(p._platformFacets)?p._platformFacets:[];
 return facets.some(x=>String(x).toLocaleLowerCase()===String(filter).toLocaleLowerCase());
}
function render({root,products,activeKind='节点',searchTerm='',activeFilter='全部',pageInfo={}}){
 if(!root)return;
 const query=String(searchTerm||'').trim().toLowerCase();
 const rows=products.filter(p=>p._kind===activeKind&&matchesFilter(p,activeFilter)&&(!query||[p._title,p._desc,p._kind,p._region,p.tags,p.protocol,p.node_protocol,p.platform,p.brand,p.provider,p.account_category,p.traffic_platform,JSON.stringify(p._merchantAttrs||{})].filter(Boolean).join(' ').toLowerCase().includes(query))).sort((a,b)=>{
  const weight=p=>{const raw=p.sort_weight??p._sortWeight??p.weight;const n=Number(raw);if(raw!==undefined&&raw!==null&&raw!==''&&Number.isFinite(n))return n;const stock=Number(p._stock??p.stock??p.available_stock??p.inventory??p.quantity??0);return Number.isFinite(stock)?stock:0};
  return weight(b)-weight(a)||Number(b._premium)-Number(a._premium);
 });
 const page=Math.max(1,Number(pageInfo.page)||1),total=Math.max(0,Number(pageInfo.total)||0),totalPages=pageInfo.serverPaginated?Math.max(1,Number(pageInfo.totalPages)||1):Math.max(1,Math.ceil(rows.length/15));
 const count=document.getElementById('resultCount');if(count)count.textContent='共 '+total.toLocaleString()+' 件商品 · 当前筛选 '+rows.length+' 件';
 const pageNumbers=[...new Set([1,page-1,page,page+1,totalPages])].filter(n=>n>=1&&n<=totalPages).sort((a,b)=>a-b);
 const pageButtons=pageNumbers.map((n,index)=>((index>0&&n-pageNumbers[index-1]>1)?'<span class="sku-page-number" aria-hidden="true">…</span>':'')+'<button type="button" data-page="'+n+'" '+(n===page?'aria-current="page" class="active"':'')+'>'+n+'</button>').join('');
 const pagination=()=>'<nav class="sku-pagination" aria-label="商品分页"><button type="button" class="sku-page-prev" data-page="prev" '+(page<=1?'disabled':'')+'>上一页</button>'+pageButtons+'<button type="button" class="sku-page-next" data-page="next" '+(page>=totalPages?'disabled':'')+'>下一页</button></nav>';
 if(!rows.length){root.innerHTML='<div class="empty-space"><div><div class="planet"></div><b>当前筛选暂无商品</b><p>接口已返回 '+total.toLocaleString()+' 件商品总量；可切换“全部”查看当前页商品。</p></div></div>'+pagination();bind();return}
 const visibleRows=pageInfo.serverPaginated?rows.slice(0,15):rows.slice((page-1)*15,page*15);
 root.innerHTML='<div class="sku-list">'+visibleRows.map(p=>renderUnifiedItem(p,activeFilter)).join('')+'</div>'+pagination();
 bind();
 function bind(){
  root.querySelectorAll('[data-open-sku]').forEach(btn=>btn.addEventListener('click',()=>{if(typeof w.openDetail==='function')w.openDetail(btn.dataset.openSku)}));
  root.querySelectorAll('[data-page]').forEach(btn=>btn.addEventListener('click',()=>{
   if(btn.disabled||pageNavigationLocked)return;
   pageNavigationLocked=true;
   root.querySelectorAll('[data-page]').forEach(control=>{control.disabled=true;control.setAttribute('aria-busy','true')});
   const next=btn.dataset.page==='next'?page+1:btn.dataset.page==='prev'?page-1:Number(btn.dataset.page);
   if(typeof w.loadCatalogPage==='function'){
    try{
     const pending=w.loadCatalogPage(next,activeKind);
     Promise.resolve(pending).finally(()=>{pageNavigationLocked=false});
     const target=document.getElementById('products');if(target)target.scrollIntoView({behavior:'smooth',block:'start'});
    }catch(error){pageNavigationLocked=false;throw error}
   }else pageNavigationLocked=false;
  }));
 }
}
w.ShopRender={render,merchantDashboard,productImage:image,stockLabel:stock,protocolBadges:protocols,nodeCapabilities,deliveryPanel,tutorialPanel,tagList};})(window);
