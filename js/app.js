
const API_ROOT='https://web.lynli.me';
const assetBase=()=>String(window.SOSKS5_OSS_BASE_URL||'').replace(/\/+$/,'');
const localIcon=u=>{if(!u)return '';const s=String(u).trim();if(s.startsWith('./assets/icons/'))return s;if(s.startsWith('/assets/icons/'))return '.'+s;const m=s.match(/assets\/icons\/([a-z0-9_.-]+\.svg)/i);return m?'./assets/icons/'+m[1]:'./assets/icons/network.svg'};
const API_V1='https://web.lynli.me/api/v1';
const requestedCategory=new URLSearchParams(location.search).get('category')||'节点';
let liveProducts=[],activeKind=['节点','账号','引流'].includes(requestedCategory)?requestedCategory:'节点',searchTerm='',activeFilter='全部',paymentMethods=[];
let catalogPage=1,catalogTotal=0,catalogTotalPages=1,catalogLoading=false,catalogRequestId=0;
const catalogAllRowsLoaded={节点:false,账号:false,引流:false};
const CATALOG_PAGE_SIZE=15;
const catalogFacetIcon=(p,kind,label)=>{
 if(kind==='节点')return '';
 const backend=p.platform_icon_url||p.icon_url||p.brand_icon_url||p.brand_logo||p.platform_icon||p.platform_logo||p.logo_url||p.icon?.url||'';
 if(backend)return String(backend);
 const slug=String(label||'').normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g,'');
 return slug?'https://cdn.simpleicons.org/'+encodeURIComponent(slug):'';
};
const NODE_PROTOCOLS=['VLESS','Hysteria2','Trojan','VMess','Shadowsocks','TUIC','AnyTLS','SSR','MTProto'];
const APP_ALIASES=[
 ['Telegram',/telegram/i],['TikTok',/tiktok/i],['Instagram',/instagram/i],['Facebook',/facebook|\bfb\b/i],['Threads',/threads/i],['WhatsApp',/whatsapp/i],['Discord',/discord/i],['Steam',/steam/i],['Netflix',/netflix/i],['Gmail',/gmail|google mail/i],['Outlook',/outlook|hotmail/i],['Yahoo',/yahoo mail/i],['iCloud',/icloud/i],['YouTube',/youtube/i],['X',/(?:^|[^a-z])twitter(?:$|[^a-z])|(?:^|\s)X(?:\s|$)/i],['Reddit',/reddit/i],['Snapchat',/snapchat/i],['Pinterest',/pinterest/i],['LinkedIn',/linkedin/i],['Twitch',/twitch/i],['Spotify',/spotify/i],['Midjourney',/midjourney/i],['Google',/google(?:\s+voice)?/i],['Apple',/apple id/i]
];
function catalogFacet(p,kind){
 if(kind==='节点'){
  const raw=p.protocols||p.supported_protocols||p.protocol||p.node_protocol||p.type||[];
  const values=Array.isArray(raw)?raw:String(raw).split(/[,，|、;；]+/);
  const found=new Set(values.map(v=>String(typeof v==='object'?(v.name||v.protocol||v.type||''):v).trim().toLowerCase().replace(/[^a-z0-9]/g,'')));
  return NODE_PROTOCOLS.filter(name=>found.has(name.toLowerCase().replace(/[^a-z0-9]/g,'')));
 }
 const found=new Map(),add=value=>{
  if(value==null||value==='')return;
  if(Array.isArray(value)){value.forEach(add);return}
  if(typeof value==='object'){add(value.name??value.platform??value.app_name??value.title??value.label??value.value);return}
  String(value).split(/[,，|、;；]+/).map(x=>x.trim()).filter(x=>x&&x.length<=40).forEach(x=>found.set(x.toLowerCase(),x));
 };
 const fields=['platform','platform_name','app','app_name','appName','account_platform','traffic_platform','target_platform','source_platform','social_platform','product_platform','provider','site','website','media_platform','channel_platform'];
 const objects=[p,p._merchantAttrs||{},p.extra_attrs||{},p.extraAttrs||{},p.extra_attributes||{},p.extraAttributes||{},p.attributes||{}];
 objects.forEach(obj=>{if(obj&&typeof obj==='object'&&!Array.isArray(obj))fields.forEach(key=>add(obj[key]))});
 const title=String(p._title||p.title||p.name||p.product_name||p.sku_name||'');
 APP_ALIASES.forEach(([name,pattern])=>{if(pattern.test(title))found.set(name.toLowerCase(),name)});
 // Titles beginning with an app name (e.g. "Telegram [US] +1 Account") are a reliable fallback.
 const leading=title.match(/^\s*([A-Za-z][A-Za-z0-9.+_-]{1,24})(?=\s|\\[|【|：|:)/);
 if(leading&&!/^(high|quality|premium|aged|verified|account|followers|likes|views|traffic|bulk|cheap|highquality)$/i.test(leading[1])){
  const candidate=leading[1],known=APP_ALIASES.find(([name,pattern])=>pattern.test(candidate));
  found.set((known?known[0]:candidate).toLowerCase(),known?known[0]:candidate);
 }
 return [...found.values()];
}
function renderCatalogFilters(){
 const root=document.getElementById('catalogFilters');if(!root)return;
 const facets=new Map();
 if(activeKind==='节点')NODE_PROTOCOLS.forEach(label=>facets.set(label,''));
 else liveProducts.forEach(p=>catalogFacet(p,activeKind).forEach(label=>{if(!facets.has(label))facets.set(label,catalogFacetIcon(p,activeKind,label))}));
 const options=['全部',...Array.from(facets.keys()).sort((a,b)=>a.localeCompare(b))];
 if(!options.includes(activeFilter))activeFilter='全部';
 root.innerHTML=options.map(label=>{
  const icon=label==='全部'?'./assets/icons/shop.svg':facets.get(label);
  const glyph='<span class="catalog-filter-glyph" aria-hidden="true"'+(icon?' hidden':'')+'>'+(label==='全部'?'⌂':escHtml(label.charAt(0).toUpperCase()))+'</span>';
  const image=icon?'<img src="'+escHtml(icon)+'" alt="" aria-hidden="true" loading="lazy" onerror="this.hidden=true;this.nextElementSibling.hidden=false">':'';
  return '<button type="button" class="catalog-filter-pill'+(label===activeFilter?' active':'')+'" data-catalog-filter="'+escHtml(label)+'" aria-pressed="'+String(label===activeFilter)+'">'+image+glyph+'<span class="catalog-filter-label">'+escHtml(label)+'</span></button>';
 }).join('');
}
function catalogEndpoint(kind){return kind==='节点'?'/user/plan/fetch':kind==='账号'?'/account/products':'/user/cloned_products';}
function catalogRows(response,kind){return kind==='节点'?groupedNodeRows(response):listify(response)};
function catalogMeta(response,rows,page){
 const queue=[response],seen=new Set();
 while(queue.length){
  const root=queue.shift();if(!root||typeof root!=='object'||seen.has(root))continue;seen.add(root);
  const pagination=root.pagination||root.meta?.pagination||root.page_info||root.pageInfo||{};
  const total=root.total??root.total_count??root.totalCount??root.total_items??root.totalItems??root.records_total??root.count??pagination.total??root.meta?.total??root.meta?.total_count;
  const pageSize=Number(root.size??root.page_size??root.pageSize??root.per_page??root.perPage??pagination.size??pagination.per_page??root.meta?.page_size)||CATALOG_PAGE_SIZE;
  const pages=root.total_pages??root.totalPages??root.last_page??root.lastPage??pagination.total_pages??pagination.totalPages??pagination.last_page??root.meta?.total_pages??root.meta?.last_page;
  if(total!==undefined&&Number.isFinite(Number(total))){const n=Math.max(0,Number(total));return {total:n,pages:Math.max(1,Number(pages)||Math.ceil(n/pageSize)),hasServerTotal:true,pageSize};}
  for(const key of ['data','result','payload','response','meta'])if(root[key]&&typeof root[key]==='object')queue.push(root[key]);
 }
 const inferred=(page-1)*CATALOG_PAGE_SIZE+rows.length;
 return {total:inferred,pages:rows.length===CATALOG_PAGE_SIZE?page+1:page,hasServerTotal:false,pageSize:CATALOG_PAGE_SIZE};
}
const escHtml=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeModalText=v=>String(v??'').replace(/https?:\/\/[^\s"'<>]+/gi,'[链接已隐藏]').replace(/\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}(?::\d+)?\b/gi,'[地址已隐藏]');
const safeUiMessage=value=>String(value??'操作未完成').replace(/Bearer\s+\S+/gi,'[凭据已隐藏]').replace(/\b(access[_-]?token|refresh[_-]?token|api[_-]?key|secret|password|authorization)\s*[:=]\s*["']?[^,\s"';&]+/gi,'$1=[凭据已隐藏]').replace(/(?:\b[0-9a-f]{1,4}:){2,}[0-9a-f:.]{1,}/gi,'[IP地址已隐藏]').replace(/https?:\/\/[^\s"'<>]+/gi,'[链接已隐藏]').replace(/\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}(?::\d+)?\b/gi,'[地址已隐藏]').replace(/\b(?:\d{1,3}\.){3}\d{1,3}(?::\d+)?\b/g,'[地址已隐藏]').replace(/(?:^|\n)\s*at\s+[^\n]+/g,'').replace(/\s{2,}/g,' ').trim().slice(0,240)||'操作未完成，请稍后重试。';window.safeUiMessage=safeUiMessage;
function lockActionButton(button,label){if(!button||button.dataset.cooldown==='1')return false;button.dataset.cooldown='1';button.disabled=true;let seconds=3;button.textContent=label+' · '+seconds+'s';const timer=setInterval(()=>{seconds--;if(seconds>0){button.textContent=label+' · '+seconds+'s';return}clearInterval(timer);button.dataset.cooldown='0';if(button.dataset.busy!=='1'){button.disabled=false;button.textContent=label}},1000);return true}
function toast(message){
 const el=document.getElementById('toast');if(!el)return;
 el.textContent=safeUiMessage(message);el.hidden=false;
 clearTimeout(window.__shopToastTimer);
 window.__shopToastTimer=setTimeout(()=>{el.hidden=true},3200);
}
const token=()=>localStorage.getItem('sosks5_token')||localStorage.getItem('tgx_token')||'';
function unpack(r){return r&&r.data!==undefined?r.data:r}
function listify(value){
 const queue=[value],seen=new Set(),keys=['items','list','products','plans','nodes','accounts','rows','records','results','data','result','payload'];
 while(queue.length){const d=queue.shift();if(d==null||seen.has(d))continue;if(Array.isArray(d))return d;if(typeof d!=='object')continue;seen.add(d);for(const k of keys){const child=d[k];if(Array.isArray(child))return child;if(child&&typeof child==='object')queue.push(child)}}
 throw Error('商品目录 JSON 结构不正确：未找到商品数组（已检查 data/result/payload/items/list/products/rows）');
}
async function api(path,method='GET',body){const headers={Accept:'application/json','Content-Type':'application/json'};if(token())headers.Authorization='Bearer '+token();let r;try{r=await fetch(API_V1+path,{method,headers,signal:AbortSignal.timeout?AbortSignal.timeout(12000):undefined,...(body!==undefined?{body:JSON.stringify(body)}:{})})}catch(e){throw Error(e.name==='TimeoutError'||e.name==='AbortError'?'请求超时，请检查网络后重试':'网络连接失败，请检查网络后重试')}let d;try{d=await r.json()}catch{throw Error('服务端返回的 JSON 格式不正确，请稍后重试')}const hs=d&&d.http_status!==undefined?Number(d.http_status):null;if(!r.ok||hs!==null&&hs!==200||d?.success===false||d?.status==='fail'||d?.error)throw Error(safeUiMessage(d?.message||d?.msg||d?.detail||d?.error||('请求未成功（HTTP '+(hs!==null&&hs!==200?hs:r.status)+'）')));return d}
function categoryOf(p,source){
 // Endpoint is authoritative; merchant labels vary and must not discard valid rows.
 if(source==='traffic')return '引流';if(source==='account')return '账号';if(source==='node')return '节点';
 const raw=String(p.category||p.product_type||p.product_category||p.type||p.kind||p.tag||'').toLowerCase();
 if(/traffic|flow|引流|流量包|traffic_pack|增长|推广|群发|机器人|growth|接码|短信|验证码|查询|查号|sms|lookup|query/.test(raw))return '引流';
 if(/node|proxy|vpn|节点|线路|订阅|vless|vmess|trojan|hysteria/.test(raw))return '节点';
 if(/account|账号|帐号|chatgpt|telegram|google|gmail|outlook/.test(raw))return '账号';return '其他';
}
function moneyOf(p){let v=p.price_yuan??p.sale_price_yuan??p.price??p.sale_price??p.amount??p.month_price??p.monthly_price??0;v=Number(v);if(!Number.isFinite(v))return 0;const unit=String(p.price_unit||p.currency_unit||p.unit||'').toLowerCase();if(['yuan','cny','元','rmb'].includes(unit)||p.price_yuan!=null||p.sale_price_yuan!=null)return v;return v/100}
function groupedNodeRows(response){
 const root=unpack(response);
 const findGrouped=(value,depth=0)=>{if(!value||typeof value!=='object'||depth>5)return null;if(Object.prototype.hasOwnProperty.call(value,'grouped'))return value.grouped;for(const key of ['data','result','payload','response']){const found=findGrouped(value[key],depth+1);if(found!==null&&found!==undefined)return found;}return null};
 const grouped=findGrouped(root)??root;
 const out=[],seenObjects=new Set();
 const containers=['items','plans','nodes','skus','sku_list','skuList','sku_items','skuItems','products','list','rows','records','children','variants','goods','regions','groups','data','result'];
 const metaKeys=new Set(['total','count','page','page_size','pageSize','current_page','last_page','success','status','message','msg','code','http_status']);
 const isSku=row=>!!row&&typeof row==='object'&&!Array.isArray(row)&&(
  ['sku_id','skuId','product_id','productId','sku_name','skuName','product_name','productName','price','price_cents','price_yuan','sale_price','month_price','monthly_price','protocol','node_protocol','product_type'].some(k=>row[k]!==undefined&&row[k]!==null)||
  ((row.name||row.title)&&(['id','uuid','stock','available_stock','description','content'].some(k=>row[k]!==undefined&&row[k]!==null)))
 );
 const regionOf=(obj,fallback,isGroup=false)=>String(obj.region_name||obj.region||obj.area||obj.country||obj.location||obj.group_name||obj.zone||(isGroup?obj.name:'')||fallback||'');
 const visit=(value,region='',depth=0)=>{
  if(value==null||depth>12)return;
  if(Array.isArray(value)){value.forEach(item=>visit(item,region,depth+1));return;}
  if(typeof value!=='object'||seenObjects.has(value))return;
  seenObjects.add(value);
  const rowContainers=['items','plans','nodes','skus','sku_list','skuList','sku_items','skuItems','products','list','rows','records','children','regions','groups','sku','sku_data','skuData','product_list','productList','node_list','nodeList'];
  const nestedData=value.data&&typeof value.data==='object'&&rowContainers.some(key=>value.data[key]&&typeof value.data[key]==='object');
  const hasRows=rowContainers.some(key=>value[key]&&typeof value[key]==='object')||!!nestedData;
  const regionName=regionOf(value,region,hasRows);
  if(hasRows){for(const key of rowContainers){const child=value[key];if(child&&typeof child==='object')visit(child,regionName||region,depth+1);}if(nestedData)visit(value.data,regionName||region,depth+1);return;}
  if(isSku(value)){out.push({...value,_region:String(value._region||regionName||region||'')});return;}
  let traversed=false;
  for(const key of ['variants','goods','data','result']){const child=value[key];if(child&&typeof child==='object'){visit(child,regionName||region,depth+1);traversed=true;}}
  if(!traversed)for(const [key,child] of Object.entries(value)){if(metaKeys.has(key)||!child||typeof child!=='object')continue;visit(child,regionName||region||key,depth+1);}
 };
 visit(grouped,'',0);
 const unique=new Map();
 out.forEach((row,index)=>{const id=row.sku_id??row.skuId??row.product_id??row.productId??row.id??row.uuid;const key=id!=null?'id:'+String(id):'row:'+String(row._region)+'|'+String(row.sku_name||row.name||row.title||row.product_name||index)+'|'+String(row.price??row.price_yuan??row.month_price??'');if(!unique.has(key))unique.set(key,row);});
 return Array.from(unique.values());
}
function localizeTrafficTitle(value){
 let title=String(value??'');
 const dictionary=[
  [/\bFull\s+Account\b/gi,'全功能账号'],[/\bAged\b/gi,'老号'],[/\bShared\s+Account\b/gi,'共享账号'],
  [/\bBulk\s+Available\b/gi,'大量有货'],[/\bPhone\s+Verified\b/gi,'手机已验证'],
  [/\bLevel\s+(\\d+)\b/gi,'$1级'],[/\\[\s*US\s*\\]/gi,'[美国]'],[/\\[\s*UK\s*\\]/gi,'[英国]'],[/\\[\s*CN\s*\\]/gi,'[中国]'],
  [/\bFull\s+Access\b/gi,'完整权限'],[/\bVerified\b/gi,'已验证'],[/\bUnverified\b/gi,'未验证'],
  [/\bPrivate\b/gi,'独享'],[/\bPremium\b/gi,'高级版'],[/\bInstant\s+Delivery\b/gi,'即时交付'],
  [/\bWith\s+Token\b/gi,'含令牌'],[/\bToken\b/gi,'令牌'],[/\bAvailable\b/gi,'有货'],[/\bIn\s+Stock\b/gi,'有库存']
 ];
 dictionary.forEach(([pattern,replacement])=>{title=title.replace(pattern,replacement)});
 return title.replace(/\s{2,}/g,' ').trim();
}
function normalize(p,i,source){
 const nested=[p.product,p.goods,p.item,p.sku,p.detail].filter(v=>v&&typeof v==='object'&&!Array.isArray(v));
 p=Object.assign({},...nested,p);
 const picture=p.picture;const pictureUrl=typeof picture==='string'?picture:(picture&&typeof picture==='object'?(picture.url||picture.src||picture.image_url||picture.original_url||''):'');
 let icon=p.icon_url||p.brand_icon_url||p.brand_logo||p.platform_icon||p.platform_logo||p.logo_url||p.protocol_icon_url||p.icon?.url||'';
 let image=p.image_url||p.original_image_url||p.product_image_url||p.cover_url||p.image||p.cover||p.thumbnail||p.thumb||p.picture_url||pictureUrl||p.logo||'';
 if(source==='account'){icon=p.icon_url||p.brand_icon_url||p.brand_logo||p.platform_icon||p.platform_logo||p.logo_url||p.icon?.url||icon;image=p.image_url||pictureUrl||p.picture_url||p.original_image_url||p.product_image_url||p.cover_url||p.image||p.cover||p.thumbnail||p.thumb||image;}
 const resolveAsset=u=>{if(!u)return '';u=String(u);if(u.startsWith('data:'))return u;const cdn=assetBase();if(/^https?:\/\//i.test(u)){if(cdn){try{const parsed=new URL(u),apiHost=new URL(API_ROOT).hostname;if(parsed.hostname===apiHost)return cdn+parsed.pathname+parsed.search+parsed.hash}catch(_){}}return u}const path=u.startsWith('/')?u:'/'+(u.startsWith('./')?u.slice(2):u);return cdn?cdn+path:API_ROOT+path};
 if(!icon&&source==='account'){const brand=String(p.platform||p.brand||p.provider||p.email_domain||p.domain||p.name||p.title||p.product_name||'').toLowerCase();if(/gmail|google mail|@gmail|google workspace/.test(brand))icon='https://cdn.simpleicons.org/gmail/EA4335';else if(/outlook|hotmail|live\.com|microsoft/.test(brand))icon='https://cdn.simpleicons.org/microsoftoutlook/0078D4';else if(/yahoo/.test(brand))icon='https://cdn.simpleicons.org/yahoo/6001D2';else if(/icloud|apple/.test(brand))icon='https://cdn.simpleicons.org/icloud/3693F3';else if(/proton/.test(brand))icon='https://cdn.simpleicons.org/protonmail/6D4AFF';}
 let attrs=p.extra_attrs||p.extraAttrs||p.extra_attributes||p.extraAttributes||p.merchant_attrs||p.merchantAttrs||p.attributes||{};
 if(typeof attrs==='string'){try{attrs=JSON.parse(attrs)}catch(_){attrs={}}}
 const merchant=attrs&&typeof attrs==='object'?attrs:{};

 const rawStock=source==='traffic'?(p.available_stock??p.stock_available??p.stock??p.inventory??p.inventory_count??p.stock_count??p.stock_num??p.stock_quantity??p.quantity??p.count??p.num??attrs.available_stock??attrs.stock_available??attrs.stock??attrs.inventory??attrs.inventory_count??attrs.stock_count??attrs.stock_num??attrs.stock_quantity??attrs.quantity??attrs.count??null):(p.available_stock??p.stock_available??p.stock??p.inventory??p.quantity??p.count??attrs.stock??attrs.inventory??null);
 const premium=source==='node'&&(/singapore|新加坡|sgp|\bsg\b/i.test([p._region,p.region,p.country,p.area,p.name,p.title,p.location].filter(Boolean).join(' '))||p.premium===true||p.is_premium===true);
 const firstValue=(obj,keys)=>{for(const key of keys){const value=obj&&obj[key];if(value!==undefined&&value!==null&&value!=='')return value}return null};
 const parseJsonObject=value=>{if(typeof value!=='string')return value&&typeof value==='object'?value:{};try{const parsed=JSON.parse(value);return parsed&&typeof parsed==='object'?parsed:{}}catch(_){return {}}};
 const extraPrice=parseJsonObject(p.extra_attrs??p.extraAttrs??p.extra_attributes??p.extraAttributes??attrs);
 const pricing=parseJsonObject(p.pricing||p.price_info||p.priceInfo||attrs.pricing||attrs.price_info||attrs.priceInfo||extraPrice.pricing||extraPrice.price_info);
 const firstEntry=(obj,keys)=>{for(const key of keys){const value=obj&&obj[key];if(value===undefined||value===null||value==='')continue;if(value===0||typeof value==='string'&&Number(value.trim())===0)continue;if(value&&typeof value==='object'&&!Array.isArray(value)){const nested=value.price_yuan??value.yuan??value.price_cents??value.cents??value.amount??value.value??value.price;if(nested===0||typeof nested==='string'&&Number(nested.trim())===0)continue}return {value,key}}return null};
 const priceKeys=['price_yuan','sale_price_yuan','current_price_yuan','unit_price_yuan','monthly_price_yuan','cost_yuan','amount_yuan','price_cents','sale_price_cents','current_price_cents','unit_price_cents','amount_cents','price_amount_cents','amount_in_cents','cost_cents','price_amount','sale_price','current_price','unit_price','price','amount','cost','price_value','price_num','month_price','monthly_price','retail_price','selling_price','cost_price','final_price'];
 const extraPricing=parseJsonObject(extraPrice.pricing||extraPrice.price_info||extraPrice.priceInfo||extraPrice.price_detail||extraPrice.priceDetail||extraPrice);
 const trafficPriceKeys=['price_yuan','price_cents','cost','amount','price','sale_price','selling_price','unit_price','final_price'];
 const accountPriceKeys=['price_yuan','price','price_cents','sale_price_yuan','sale_price','sale_price_cents','amount_yuan','amount_cents'];
 const foundPrice=(source==='traffic'?(firstEntry(p,trafficPriceKeys)||firstEntry(pricing,trafficPriceKeys)||firstEntry(extraPricing,trafficPriceKeys)||firstEntry(extraPricing.pricing,trafficPriceKeys)||firstEntry(attrs,trafficPriceKeys)):source==='account'?(firstEntry(p,accountPriceKeys)||firstEntry(pricing,accountPriceKeys)||firstEntry(extraPricing,accountPriceKeys)||firstEntry(attrs,accountPriceKeys)):null)||firstEntry(p,priceKeys)||firstEntry(pricing,priceKeys)||firstEntry(extraPricing,priceKeys)||firstEntry(extraPricing.pricing,priceKeys)||firstEntry(parseJsonObject(p.price),['price_yuan','price_cents','amount_cents','amount','value','price'])||firstEntry(parseJsonObject(extraPricing.price),['price_yuan','yuan','price_cents','cents','amount','value','price']);
 const priceSource=foundPrice?foundPrice.value:null;
 const parseMoney=(value,key)=>{
  if(value==null||value==='')return null;
  let unit='';
  if(typeof value==='object'){unit=String(value.unit||value.currency_unit||value.currency||'').toLowerCase();const nested=firstEntry(value,['price_yuan','yuan','price_cents','cents','amount','value','price']);if(!nested)return null;key=nested.key;value=nested.value}
  const raw=String(value).trim(),clean=raw.replace(/,/g,'').replace(/[^0-9.+-]/g,'');
  if(!clean||!/[0-9]/.test(clean))return null;
  const n=Number(clean);if(!Number.isFinite(n)||n<0)return null;
  const declaredUnit=(unit+' '+String(p.price_unit||p.currency_unit||p.unit||p.pricing?.unit||p.pricing?.currency||attrs.price_unit||attrs.currency_unit||'')).toLowerCase();
  if(/yuan|cny|rmb|元/.test(declaredUnit)||/[¥￥]/.test(raw)||/_yuan$/.test(key))return n;
  if(/cent|分|fen/.test(declaredUnit)||/_cents?$/.test(key)||/cents/.test(key))return n/100;
  if(/[.]/.test(clean))return n;
  return n/100;
 };
 const parsedPrice=parseMoney(priceSource,foundPrice?.key||'');
 const priceYuan=parsedPrice==null?0:parsedPrice;
 const priceProvided=parsedPrice!=null&&parsedPrice>0;
 if(!priceProvided)console.warn('[S5 catalog price audit: missing/zero price]',{id:p.sku_id??p.id??p.product_id,title:p.title||p.name||p.product_name,priceField:foundPrice?.key||null,priceValue:priceSource,extra_attrs:extraPrice,rawProduct:p});
 if(i===0)console.info('[S5 catalog first product full JSON]',{source,product:p,parsedExtraAttrs:extraPrice,parsedPricing:pricing,priceField:foundPrice?.key||null,priceRaw:priceSource,priceYuan,priceProvided});
 const rawTitle=String((source==='traffic'?(p.name||p.title||p.product_title||p.productTitle||p.sku_name||p.skuName||p.product_name||p.productName||p.goods_name||p.goodsName||p.item_name||p.itemName||p.display_name||p.displayName||p.label||merchant.name||merchant.title||merchant.product_title||merchant.sku_name||merchant.product_name||''):(p.title||p.name||p.product_title||p.productTitle||p.display_name||p.displayName||p.sku_title||p.skuTitle||p.sku_name||p.product_name||p.productName||p.goods_name||p.goodsName||p.item_name||p.itemName||p.label||p.en_name||p.name_en||p.english_name||p.description_zh||p.description||''))||'商品 '+String(p.sku_id??p.id??p.product_id??i+1));
 const finalTitle=(source==='traffic'||source==='account')?localizeTrafficTitle(rawTitle).replace(/\bShared\b/gi,'共享').replace(/高级版\s+共享/gi,'高级共享账号').replace(/\s*\(\s*1m\s*\)/gi,' (1个月)').replace(/\bSteamGuard\b/gi,'令牌').replace(/\bSteam\s*Guard\b/gi,'令牌'):rawTitle;
 const brandText=(rawTitle+' '+String(p.platform||p.brand||p.provider||'')).toLowerCase();
 const brandIcon=source==='traffic'?(brandText.includes('steam')?'steam':brandText.includes('netflix')?'netflix':brandText.includes('midjourney')?'midjourney':/\bmail\b|gmail|outlook/.test(brandText)?'mail':''):'';
 return {...p,_brandIcon:brandIcon,_key:source+'-'+i+'-'+String(p.sku_id??p.id??p.product_id??p.uuid??'sku'),_source:source,_kind:categoryOf(p,source),_title:finalTitle,_desc:String(p.description_zh||p.chinese_description||p.description_cn||p.description||p.summary||p.content||''),_image:resolveAsset(image),_icon:resolveAsset(icon),_price:Number.isFinite(priceYuan)?priceYuan:0,_priceProvided:priceProvided,_priceCents:Math.round(priceYuan*100),_stock:rawStock,_sales:p.sales??p.sold_count??p.total_sales??p.buy_count,_tutorial:p.tutorial_markdown||p.tutorial_md||p.tutorial||p.guide_markdown||p.guide||p.markdown||p.content_md||'',_delivery:p.delivery_content||p.delivery_description||p.delivery||p.deliverables||p.delivery_type||p.delivery_method||'',_warranty:p.warranty||p.warranty_period||p.after_sales||p.after_sale||p.support_policy||p.guarantee||'',_notice:p.notice||p.notes||p.warning||p.terms||'',_merchantAttrs:merchant,_region:String(p._region||p.region_name||p.region||p.country||p.area||p.location||''),_premium:premium,_period:p.period_name||p.period_label||p.period||p.billing_cycle||''};
}
function markdown(md){const lines=String(md||'暂无教程内容').split(String.fromCharCode(10));let out='',listOpen=false;for(const raw of lines){const line=raw.trim();if(!line){if(listOpen){out+='</ul>';listOpen=false}out+='<p></p>';continue}let level=0;while(level<6&&line[level]==='#')level++;if(level>0&&line[level]===' '){if(listOpen){out+='</ul>';listOpen=false}out+='<h'+level+'>'+inlineMd(line.slice(level+1))+'</h'+level+'>';continue}if(line.startsWith('- ')||line.startsWith('* ')){if(!listOpen){out+='<ul>';listOpen=true}out+='<li>'+inlineMd(line.slice(2))+'</li>';continue}if(listOpen){out+='</ul>';listOpen=false}out+='<p>'+inlineMd(line)+'</p>'}if(listOpen)out+='</ul>';return '<div class="markdown">'+out+'</div>'}
function inlineMd(v){let s=escHtml(safeModalText(v));s=s.split('**').map((x,i)=>i%2?'<strong>'+x+'</strong>':x).join('');s=s.split('`').map((x,i)=>i%2?'<code>'+x+'</code>':x).join('');return s}
window.SOSKS5_RENDER_MARKDOWN=markdown;
function protocolBadges(p){
 if(!p||p._kind!=='节点')return '';
 const raw=p.protocols||p.supported_protocols||[p.protocol||p.node_protocol||p.type].filter(Boolean);
 const items=Array.isArray(raw)?raw:String(raw).split(/[,，|]/);
 const iconMap=p.protocol_icons||p.protocol_icon_urls||{};
 return '<div class="protocol-badges">'+items.map(item=>{const name=typeof item==='object'?(item.name||item.protocol||item.type||'协议'):item;const key=String(name).toLowerCase().replace(/[^a-z0-9]/g,'');const icon=(typeof item==='object'&&(item.icon_url||item.icon))||(typeof iconMap==='object'&&(iconMap[name]||iconMap[key]))||p.icon_url||p.protocol_icon_url||p._icon||'';const iconSrc=icon?resolveAsset(icon):'';return '<span class="protocol-badge">'+(iconSrc?'<img loading="lazy" src="'+escHtml(iconSrc)+'" alt="" onerror="this.hidden=true">':'')+escHtml(name)+'</span>'}).join('')+'</div>';
}
function productImage(p){
 const initial=escHtml((p._title||'?').trim().charAt(0).toUpperCase());
 const src=p._image||p._icon;
 return '<div class="product-art">'+(src?'<img src="'+escHtml(src)+'" alt="'+escHtml(p._title)+'" loading="lazy" onerror="this.parentElement.classList.add(\'image-missing\');this.remove()">':'')+'<span class="product-initial">'+initial+'</span></div>';
}
function stockLabel(p){const single=p._stock??'—';const bulk=p.bulk_available_count??p.wholesale_available_count??p.batch_stock??p.bulk_stock??p.wholesale_stock??p.available_batches??null;return bulk!=null?'可成批数 '+String(bulk):String(single)}
function renderProducts(){
 const root=document.getElementById('products');
 if(window.ShopRender){window.ShopRender.render({root,products:liveProducts,activeKind,searchTerm,activeFilter,pageInfo:{page:catalogPage,size:CATALOG_PAGE_SIZE,total:catalogTotal,totalPages:catalogTotalPages,serverPaginated:activeKind!=='节点'&&!catalogAllRowsLoaded[activeKind]}});return}
 root.innerHTML='<div class="error-state">商品渲染模块未加载，请刷新页面。</div>';
}

async function loadCatalogPage(page=1,kind=activeKind){
 const root=document.getElementById('products');if(!root)return;
 if(kind===activeKind&&catalogAllRowsLoaded[kind]&&page!==1){catalogPage=Math.max(1,Number(page)||1);renderProducts();return}
 const requestId=++catalogRequestId;catalogLoading=true;catalogPage=Math.max(1,Number(page)||1);activeKind=kind;
 root.setAttribute('aria-busy','true');root.innerHTML=Array.from({length:6},()=>'<div class="skeleton-card"><div class="skeleton-cover"></div><div class="skeleton-line" style="width:62%"></div><div class="skeleton-line" style="width:40%"></div></div>').join('');
 const hint=document.getElementById('resultCount');if(hint)hint.textContent='正在同步商品与平台分类…';
 try{
  const endpoint=catalogEndpoint(kind),requestedSize=kind==='节点'?CATALOG_PAGE_SIZE:100;
  const pagedEndpoint=kind==='节点'?endpoint:endpoint+'?page=1&size='+requestedSize;
  const response=await api(pagedEndpoint);if(requestId!==catalogRequestId)return;
  const firstRows=catalogRows(response,kind);let rawRows=firstRows.slice(),meta=catalogMeta(response,firstRows,1),complete=kind==='节点';
  if(kind!=='节点'&&meta.hasServerTotal){
   const pageSize=Math.max(1,Number(meta.pageSize)||requestedSize),totalPages=Math.max(1,Number(meta.pages)||Math.ceil(meta.total/pageSize));
   const pageNumbers=Array.from({length:Math.max(0,totalPages-1)},(_,i)=>i+2);
   for(let offset=0;offset<pageNumbers.length;offset+=4){
    const batch=pageNumbers.slice(offset,offset+4),responses=await Promise.all(batch.map(n=>api(endpoint+'?page='+n+'&size='+pageSize)));
    if(requestId!==catalogRequestId)return;
    responses.forEach((result,index)=>{try{rawRows.push(...catalogRows(result,kind))}catch(e){console.warn('[S5 platform scan] page parse skipped',batch[index],e.message)}});
   }
   complete=rawRows.length>=meta.total;
  }
  const rows=kind==='节点'?rawRows.filter(p=>categoryOf(p,'node')==='节点'):rawRows;
  const sample=firstRows[0]||null,nested=sample&&(sample.product||sample.goods||sample.item||sample.sku)||{};
  console.info('[S5 catalog JSON audit]',{category:kind,request:API_V1+pagedEndpoint,total:meta.total,length:rawRows.length,acceptedLength:rows.length,page:1,size:meta.pageSize,hasServerTotal:meta.hasServerTotal,allPagesLoaded:complete,platformCount:new Set(rows.flatMap(p=>catalogFacet(p,kind).map(x=>x.toLowerCase()))).size,responseKeys:response&&typeof response==='object'?Object.keys(response):[]});
  if(sample)console.info('[S5 catalog first product full JSON]',{category:kind,product:sample,nestedProduct:nested,extra_attrs:sample.extra_attrs??sample.extraAttrs??null,price:sample.price??null,price_cents:sample.price_cents??null});
  liveProducts=rows.map((p,i)=>{const item=normalize(p,i,kind==='节点'?'node':kind==='账号'?'account':'traffic');item._platformFacets=catalogFacet(item,kind);return item});
  catalogAllRowsLoaded[kind]=complete;catalogTotal=meta.hasServerTotal?meta.total:rows.length;
  catalogTotalPages=complete?Math.max(1,Math.ceil(liveProducts.length/CATALOG_PAGE_SIZE)):meta.pages;catalogPage=1;
  const breakdown=document.getElementById('catalogBreakdown');if(breakdown)breakdown.textContent=(complete?'已扫描全部 '+rows.length.toLocaleString()+' 件':'后端总数 '+catalogTotal.toLocaleString()+' 件')+' · 已识别 '+new Set(liveProducts.flatMap(p=>p._platformFacets||[]).map(x=>x.toLowerCase())).size+' 个平台';
  renderCatalogFilters();renderProducts();
 }catch(e){
  if(requestId!==catalogRequestId)return;liveProducts=[];catalogAllRowsLoaded[kind]=false;renderCatalogFilters();
  const breakdown=document.getElementById('catalogBreakdown');if(breakdown)breakdown.textContent='真实商品目录暂不可用';
  if(hint)hint.textContent='加载失败';
  root.innerHTML='<div class="error-state"><div class="symbol"><img src="./assets/icons/network.svg" alt="" aria-hidden="true"></div><b>真实商品目录暂时无法加载</b><p>'+escHtml(safeUiMessage(e.message))+'</p><button class="btn" type="button" onclick="loadCatalogs()">重新加载</button></div>';
 }finally{if(requestId===catalogRequestId){catalogLoading=false;root.removeAttribute('aria-busy')}}
}function loadCatalogs(){catalogPage=1;return loadCatalogPage(1,activeKind)}
window.loadCatalogPage=loadCatalogPage;
document.querySelectorAll('[data-kind]').forEach(b=>{b.className=b.dataset.kind===activeKind?'btn primary':'btn ghost';b.setAttribute('aria-pressed',String(b.dataset.kind===activeKind));b.addEventListener('click',()=>{if(activeKind===b.dataset.kind)return;activeKind=b.dataset.kind;activeFilter='全部';catalogPage=1;document.querySelectorAll('[data-kind]').forEach(x=>{x.className=x.dataset.kind===activeKind?'btn primary':'btn ghost';x.setAttribute('aria-pressed',String(x.dataset.kind===activeKind))});renderCatalogFilters();loadCatalogPage(1,activeKind)})});
const catalogFilterRoot=document.getElementById('catalogFilters');
catalogFilterRoot?.addEventListener('click',e=>{const b=e.target.closest('[data-catalog-filter]');if(!b||!catalogFilterRoot.contains(b))return;activeFilter=b.dataset.catalogFilter||'全部';catalogPage=1;catalogFilterRoot.querySelectorAll('[data-catalog-filter]').forEach(x=>{const selected=x===b;x.classList.toggle('active',selected);x.setAttribute('aria-pressed',String(selected))});renderProducts()});
const productListRoot=document.getElementById('products');
productListRoot?.addEventListener('click',event=>{const card=event.target.closest('[data-buy-sku]');if(!card||!productListRoot.contains(card))return;const product=liveProducts.find(item=>String(item._key)===String(card.dataset.buySku));if(!product)return;if(typeof window.S5_OPEN_PURCHASE!=='function'){console.error('[S5 checkout] purchase modal is unavailable');return}window.S5_OPEN_PURCHASE(product)});
productListRoot?.addEventListener('keydown',event=>{if(event.key!=='Enter'&&event.key!==' ')return;const card=event.target.closest('[data-buy-sku]');if(!card||!productListRoot.contains(card))return;event.preventDefault();const product=liveProducts.find(item=>String(item._key)===String(card.dataset.buySku));if(product&&typeof window.S5_OPEN_PURCHASE==='function')window.S5_OPEN_PURCHASE(product)});

renderCatalogFilters();
function nodeConfigPanel(p){if(!p)return '';const isNode=p._kind==='节点';return '<section class="node-config-panel" id="nodeConfigPanel"><div class="archive-head"><div><div class="eyebrow">OPTIONAL ADD-ONS</div><h4>增值服务（可选）</h4></div><span class="archive-stamp">按月加价</span></div><div class="addon-list"><label class="addon-option" for="addonDomain"><input type="checkbox" id="addonDomain" value="dedicated_domain" aria-controls="addonDomainField"><span class="addon-copy"><b>绑定专属域名</b><small>+¥2.00 / 月</small></span></label><div class="field addon-field" id="addonDomainField" hidden><label for="addonDomainValue">专属域名</label><div style="display:flex;gap:8px;align-items:center"><input class="input" id="addonDomainValue" placeholder="例如 node.example.com" autocomplete="url" inputmode="url" aria-describedby="addonDomainError"><button class="btn ghost" type="button" id="checkAddonDomain">检查解析</button></div><p class="addon-error" id="addonDomainError" role="alert" hidden></p></div><label class="addon-option" for="addonIp"><input type="checkbox" id="addonIp" value="dedicated_ip" aria-controls="addonIpField"><span class="addon-copy"><b>使用独立 IP</b><small>+¥3.00 / 月</small></span></label><div class="field addon-field" id="addonIpField" hidden><label for="addonIpValue">独立 IP 地址</label><input class="input" id="addonIpValue" placeholder="例如 203.0.113.10 或 IPv6" autocomplete="off" inputmode="url" aria-describedby="addonIpError"><p class="addon-error" id="addonIpError" role="alert" hidden></p></div></div><div class="addon-total" aria-live="polite"><span>价格明细</span><div class="price-breakdown"><div><span>基础套餐</span><b id="addonBasePrice">¥0.00</b></div><div><span>专属域名</span><b id="addonDomainPrice">¥0.00</b></div><div><span>独立 IP</span><b id="addonIpPrice">¥0.00</b></div><div class="breakdown-total"><span>每月合计</span><strong id="addonTotal">¥0.00</strong></div></div><small id="addonBreakdown">基础套餐价格 + 已选增值服务</small></div><p class="archive-note">基础套餐价格不变；仅对已勾选的增值服务加价。实际结算金额以服务端为准。</p></section>'+(isNode?'<p class="archive-note">支持协议</p>'+protocolBadges(p):'')}function merchantDashboard(p){return window.ShopRender?window.ShopRender.merchantDashboard(p):'';}

function openDetail(key){const p=liveProducts.find(x=>x._key===key);if(!p)return;document.getElementById('detailTitle').textContent=p._title;if(/\bmtp\b/i.test([p._title,p.protocol,p.node_protocol,p.protocols,p.type,p.product_type].filter(Boolean).join(' '))&&window.MTPGuide)window.MTPGuide.show();const isNode=p._kind==='节点',nodeTools=window.NodeTools;const nodeFeatures=isNode&&nodeTools?'<div id="nodeLocationMap"></div><section class="node-speed-panel"><div><b>内置节点测速</b><p class="muted">仅请求本站节点测速服务或该节点自身 API，不连接第三方测速平台。</p></div><button class="btn" id="testCurrentNode" type="button">测试当前节点延迟</button><p id="nodeSpeedResult" class="node-speed-result" aria-live="polite">尚未开始测速</p></section>':'';const rich=window.ShopRender;const priceLine=p._priceProvided?'基础套餐 ¥'+p._price.toFixed(2)+' <small> / '+escHtml(p._period||'周期以套餐选项为准')+'</small>':'价格待商家配置';document.getElementById('detailContent').innerHTML='<div class="cover" style="border-radius:14px;margin:16px 0;height:200px">'+productImage(p)+'</div><div class="price">'+priceLine+'</div><p>'+escHtml(safeModalText(p._desc||'暂无详细介绍'))+'</p>'+nodeFeatures+(isNode&&rich?rich.nodeCapabilities(p):'')+(isNode?nodeConfigPanel(p):'')+(isNode?'':merchantDashboard(p))+(rich?rich.deliveryPanel(p):'')+(rich?rich.tutorialPanel(p):'<section class="archive-panel"><h4>商品教程</h4><p>商家尚未配置教程。</p></section>')+'<div class="panel" style="margin:12px 0"><b>商品说明 / 售后须知</b><p class="muted">'+escHtml(safeModalText(p._notice||'具体交付与售后以商家订单说明为准。'))+'</p><div class="product-meta"><span>销量 '+escHtml(p._sales??'商家未提供')+'</span><span>库存 '+escHtml(stockLabel(p))+'</span></div></div>'+(window.UsageGuide&&window.UsageGuide.relevant(p)?window.UsageGuide.render():'')+'<button class="btn primary" id="buyNow" style="width:100%" '+(!p._priceProvided?'disabled title="商家尚未提供价格"':'')+'>立即购买</button>';document.getElementById('buyNow').onclick=()=>purchase(p);if(isNode&&nodeTools){nodeTools.mountMap(document.getElementById('nodeLocationMap'),p,'节点真实物理位置');nodeTools.bindSpeed(document.getElementById('testCurrentNode'),p)}wireAddonPanel(p);document.getElementById('detailModal').classList.add('show')}
function closeDetail(){document.getElementById('detailModal').classList.remove('show')}document.getElementById('detailModal').addEventListener('click',e=>{if(e.target.id==='detailModal')closeDetail()});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDetail()});
function selectedAddons(){const domainOn=!!document.getElementById('addonDomain')?.checked,ipOn=!!document.getElementById('addonIp')?.checked;return {addons:[...(domainOn?[{code:'dedicated_domain',name:'绑定专属域名',monthly_price:2.00}]:[]),...(ipOn?[{code:'dedicated_ip',name:'使用独立 IP',monthly_price:3.00}]:[])],domain:domainOn?(document.getElementById('addonDomainValue')?.value.trim()||''):'',ip:ipOn?(document.getElementById('addonIpValue')?.value.trim()||''):'',extra:(domainOn?2:0)+(ipOn?3:0)}}function wireAddonPanel(p){const d=document.getElementById('addonDomain'),i=document.getElementById('addonIp');if(!d||!i)return;const update=()=>{document.getElementById('addonDomainField').hidden=!d.checked;document.getElementById('addonIpField').hidden=!i.checked;refreshAddonPriceSummary(p);validateAddons(false)};d.addEventListener('change',update);i.addEventListener('change',update);document.getElementById('addonDomainValue')?.addEventListener('input',()=>validateAddons(false));document.getElementById('addonIpValue')?.addEventListener('input',()=>validateAddons(false));document.getElementById('checkAddonDomain')?.addEventListener('click',checkAddonDomain);update()}function validateAddons(show=true){const s=selectedAddons(),domainInput=document.getElementById('addonDomainValue'),ipInput=document.getElementById('addonIpValue'),domainError=document.getElementById('addonDomainError'),ipError=document.getElementById('addonIpError');const domainInvalid=!!document.getElementById('addonDomain')?.checked&&!validDomain(s.domain),ipInvalid=!!document.getElementById('addonIp')?.checked&&!(validIPv4(s.ip)||validIPv6(s.ip));if(domainInput)domainInput.setAttribute('aria-invalid',domainInvalid?'true':'false');if(ipInput)ipInput.setAttribute('aria-invalid',ipInvalid?'true':'false');if(domainError){domainError.hidden=!domainInvalid||!show;domainError.textContent=domainInvalid?'请输入有效域名，例如 node.example.com；不要填写协议、端口或路径。':''}if(ipError){ipError.hidden=!ipInvalid||!show;ipError.textContent=ipInvalid?'请输入有效 IPv4 或 IPv6 地址。':''}return !domainInvalid&&!ipInvalid}
async function loadPayments(){const demo=[{value:'alipay',label:'支付宝（演示通道）',demo:true},{value:'usdt',label:'USDT（演示通道）',demo:true}];try{const d=unpack(await api('/config'));const src=d.payment_methods||d.payments||d.payment||d.pay_method||d.methods||[];paymentMethods=(Array.isArray(src)?src:Object.keys(src||{}).map(k=>typeof src[k]==='object'?{key:k,...src[k]}:{key:k,value:src[k]})).map(x=>typeof x==='string'?{value:x,label:x}:{value:x.value??x.code??x.id??x.key??x.name,label:x.label??x.title??x.name??x.key??x.value}).filter(x=>x.value!=null);if(!paymentMethods.length)paymentMethods=demo}catch(e){paymentMethods=demo}}
async function purchase(p){if(!p._priceProvided){toast('该 SKU 尚未配置有效价格，暂不能下单');return}if(!token()){toast('请先登录后再购买');location.href='./login.html?redirect='+encodeURIComponent('./shop.html');return}if(!paymentMethods.length)await loadPayments();if(!paymentMethods.length){toast('暂时无法读取服务器支付方式');return}const root=document.getElementById('detailContent');root.insertAdjacentHTML('beforeend','<div class="field" id="payChoice"><label>支付方式</label><select class="input" id="payMethod">'+paymentMethods.map((m,i)=>'<option value="'+i+'">'+escHtml(m.label)+'</option>').join('')+'</select></div><div class="field"><label>套餐周期</label><select class="input" id="payPeriod">'+periodOptionsFor(p).map(x=>'<option value="'+escHtml(x.value)+'">'+escHtml(x.label)+' · ¥'+x.amount.toFixed(2)+'</option>').join('')+'</select></div><button class="btn primary" id="createOrderBtn" style="width:100%">创建订单并获取支付</button>');const b=document.getElementById('createOrderBtn');document.getElementById('payPeriod').addEventListener('change',()=>refreshAddonPriceSummary(p));const payMethodSelect=document.getElementById('payMethod');const usdtBox=document.createElement('div');usdtBox.id='usdtEquivalent';usdtBox.className='archive-stamp';usdtBox.style.cssText='display:block;margin:12px 0;padding:12px;text-align:center';usdtBox.hidden=true;document.getElementById('payChoice').appendChild(usdtBox);const updateUsdt=()=>{const m=paymentMethods[Number(payMethodSelect.value)];const total=Number((periodOptionsFor(p).find(x=>x.value===document.getElementById('payPeriod').value)?.amount||p._price)+selectedAddons().extra*periodMultiplier(document.getElementById('payPeriod').value));if(window.PaymentDisplay)window.PaymentDisplay.update(usdtBox,m,total)};payMethodSelect.addEventListener('change',updateUsdt);document.getElementById('payPeriod').addEventListener('change',updateUsdt);document.getElementById('addonDomain')?.addEventListener('change',updateUsdt);document.getElementById('addonIp')?.addEventListener('change',updateUsdt);refreshAddonPriceSummary(p);updateUsdt();b.onclick=async()=>{if(!lockActionButton(b,'创建订单并获取支付'))return;b.dataset.busy='1';b.disabled=true;b.textContent='正在创建订单…';try{const method=paymentMethods[Number(document.getElementById('payMethod').value)];if(method?.demo){toast('当前为支付方式预览，真实支付配置未下发；未创建订单');b.dataset.busy='0';if(b.dataset.cooldown!=='1'){b.disabled=false;b.textContent='创建订单并获取支付'}return}const addon=selectedAddons();if(!validateAddons(true)){toast('请检查增值服务填写内容');b.dataset.busy='0';if(b.dataset.cooldown!=='1'){b.disabled=false;b.textContent='创建订单并获取支付'}return}const period=document.getElementById('payPeriod').value;const periodOption=periodOptionsFor(p).find(x=>x.value===period)||periodOptionsFor(p)[0];const months=periodMultiplier(period);const baseAmount=Number(periodOption.amount.toFixed(2));const addonAmount=Number((addon.extra*months).toFixed(2));const totalAmount=Number((baseAmount+addonAmount).toFixed(2));const addonsForOrder=addon.addons.map(x=>({...x,period_months:months,total_price:Number((x.monthly_price*months).toFixed(2))}));const order=unpack(await api('/user/order/save','POST',{plan_id:p.id??p.product_id??p.uuid,package_id:p.id??p.product_id??p.uuid,period,payment:method.value,addons:addonsForOrder,custom_domain:addon.domain,dedicated_ip:addon.ip,base_amount:baseAmount,addon_amount:addonAmount,total_amount:totalAmount,amount:totalAmount}));const trade=typeof order==='string'?order:order.trade_no||order.tradeNo||order.order_no||order.orderNo;if(!trade)throw Error(order.message||order.msg||'订单接口未返回订单号');b.textContent='正在获取支付二维码…';const pay=unpack(await api('/user/order/checkout','POST',{trade_no:trade}));const payUrl=typeof pay==='string'?pay:pay.pay_url||pay.payment_url||pay.checkout_url||pay.url||'';const qr=pay.qrcode||pay.qr_code||pay.qrCode||pay.qr_url||'';document.getElementById('detailContent').innerHTML='<div class="panel"><b>订单已创建</b><p>订单号：'+escHtml(trade)+'</p>'+(qr&&/^https?:\/\//i.test(qr)?'<img loading="lazy" src="'+escHtml(qr)+'" alt="支付二维码" style="display:block;width:220px;height:220px;object-fit:contain;background:white;padding:8px;border-radius:12px;margin:16px auto">':'')+(qr&&!/^https?:\/\//i.test(qr)?'<div id="payQr" style="width:220px;height:220px;background:white;padding:8px;margin:16px auto;border-radius:12px"></div>':'')+(payUrl?'<a class="btn primary" style="display:block;text-align:center" href="'+escHtml(payUrl)+'" target="_blank" rel="noopener noreferrer">打开支付页面</a>':'')+'<p class="muted">支付状态以服务端订单记录为准。</p></div>';if(qr&&!/^https?:\/\//i.test(qr)&&window.QRCode)new QRCode(document.getElementById('payQr'),{text:String(qr),width:204,height:204});else if(qr&&!/^https?:\/\//i.test(qr))document.getElementById('payQr').textContent=String(qr)}catch(e){toast(e.message||'创建订单失败');b.dataset.busy='0';if(b.dataset.cooldown!=='1'){b.disabled=false;b.textContent='重试'}}}}
function periodOptionsFor(p){const keys=[['month_price','月付'],['quarter_price','季付'],['half_year_price','半年付'],['year_price','年付'],['two_year_price','两年付'],['three_year_price','三年付'],['onetime_price','一次性'],['reset_price','流量重置']];const unit=String(p.price_unit||p.currency_unit||p.unit||'').toLowerCase(),yuanUnits=['yuan','cny','元','rmb'].includes(unit);const out=keys.filter(([k])=>p[k]!=null&&p[k]!==''&&Number.isFinite(Number(p[k]))&&Number(p[k])>=0).map(([k,l])=>({value:k,label:l,price:Number(p[k]),amount:Number(((p[k+'_yuan']!=null?Number(p[k+'_yuan']):(yuanUnits?Number(p[k]):Number(p[k])/100))).toFixed(2))}));if(!out.length){const amount=moneyOf(p);out.push({value:p.period||'month_price',label:'默认套餐',price:amount*100,amount})}return out}
function periodMultiplier(period){return ({month_price:1,quarter_price:3,half_year_price:6,year_price:12,two_year_price:24,three_year_price:36,onetime_price:1,reset_price:1})[period]||1}
function refreshAddonPriceSummary(p){const select=document.getElementById('payPeriod'),options=periodOptionsFor(p),chosen=options.find(x=>x.value===(select?.value||options[0]?.value))||options[0];if(!chosen)return;const domainCost=document.getElementById('addonDomain')?.checked?2*periodMultiplier(chosen.value):0,ipCost=document.getElementById('addonIp')?.checked?3*periodMultiplier(chosen.value):0,base=chosen.amount,extra=domainCost+ipCost,total=Number((base+extra).toFixed(2));document.getElementById('addonBasePrice').textContent='¥'+base.toFixed(2);document.getElementById('addonDomainPrice').textContent='¥'+domainCost.toFixed(2);document.getElementById('addonIpPrice').textContent='¥'+ipCost.toFixed(2);document.getElementById('addonTotal').textContent='¥'+total.toFixed(2);document.getElementById('addonBreakdown').textContent='¥'+base.toFixed(2)+' '+chosen.label+'基础套餐 + ¥'+extra.toFixed(2)+' 本周期增值服务';const totalLabel=document.querySelector('.addon-total .breakdown-total span');if(totalLabel)totalLabel.textContent='本周期合计'}
async function checkAddonDomain(){const value=document.getElementById('addonDomainValue')?.value.trim()||'',button=document.getElementById('checkAddonDomain');if(!validDomain(value)){toast('请先输入有效域名，例如 node.example.com');return}if(button){button.disabled=true;button.textContent='检查中…'}try{const d=unpack(await api('/domain/check','POST',{domain:value}));const ok=d.resolved===true||d.exists===true||d.success===true;toast(ok?'域名解析检查通过':'域名尚未解析或未通过服务端检查')}catch(e){toast('域名格式有效，但站内域名检查服务暂不可用：'+safeUiMessage(e.message))}finally{if(button){button.disabled=false;button.textContent='检查解析'}}}
function validDomain(v){if(!v||v.length>253||/[\s:/?#@]/.test(v))return false;const s=v.endsWith('.')?v.slice(0,-1):v;if(!s||s==='localhost')return false;return s.split('.').length>=2&&s.split('.').every(label=>label.length>=1&&label.length<=63&&/^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(label))}function validIPv4(v){const a=v.split('.');return a.length===4&&a.every(x=>/^\d{1,3}$/.test(x)&&Number(x)>=0&&Number(x)<=255&&(x==='0'||!x.startsWith('0')))}function validIPv6(v){if(!v.includes(':')||!/^[0-9a-fA-F:]+$/.test(v)||v.includes(':::'))return false;const parts=v.split('::');if(parts.length>2)return false;const count=x=>x?x.split(':').length:0;return parts.length===2?count(parts[0])+count(parts[1])<8:count(v)===8}document.addEventListener('change',e=>{if(e.target&&e.target.name==='nodeAccessMode'){const domain=document.getElementById('nodeDomainField'),ip=document.getElementById('nodeIpField');if(domain&&ip){domain.hidden=e.target.value!=='domain';ip.hidden=e.target.value!=='ip'}const err=document.getElementById('nodeConfigError');if(err)err.textContent=''}});document.addEventListener('input',e=>{if(e.target&&['nodeDomain','nodeIp'].includes(e.target.id))validateNodeAccess(false)});setTimeout(()=>{loadCatalogs();loadPayments()},0);
