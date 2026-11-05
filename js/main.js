(function () {
  'use strict';

  const API = window.S5Api;
  const UI = window.SOSKS5UI;
  const $ = (selector, root) => (root || document).querySelector(selector);
  const $$ = (selector, root) => Array.from((root || document).querySelectorAll(selector));
  const esc = (value) => String(value == null ? '' : value).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeUiMessage = (value) => String(value == null ? '操作未完成' : value)
    .replace(/Bearer\s+\S+/gi, '[凭据已隐藏]').replace(/\b(access[_-]?token|refresh[_-]?token|api[_-]?key|secret|password|authorization)\s*[:=]\s*["']?[^,\s"';&]+/gi,'$1=[凭据已隐藏]').replace(/(?:\b[0-9a-f]{1,4}:){2,}[0-9a-f:.]{1,}/gi,'[IP地址已隐藏]')
    .replace(/https?:\/\/[^\s"'<>]+/gi, '[链接已隐藏]')
    .replace(/\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}(?::\d+)?\b/gi, '[地址已隐藏]')
    .replace(/\b(?:\d{1,3}\.){3}\d{1,3}(?::\d+)?\b/g, '[地址已隐藏]')
    .replace(/(?:^|\n)\s*at\s+[^\n]+/g, '')
    .replace(/\s{2,}/g, ' ').trim().slice(0, 240) || '操作未完成，请稍后重试。';
  const toast = (message) => UI && UI.toast ? UI.toast(safeUiMessage(message)) : undefined;
  const unwrap = (response) => API.unwrap(response);
  const listFrom = (value) => Array.isArray(value) ? value : (value && (value.list || value.items || value.products || value.plans || value.data || value.rows)) || [];
  const money = (value, alreadyYuan) => {
    if (value === null || value === undefined || value === '') return '询价';
    const n = Number(value);
    if (!Number.isFinite(n) || n < 0) return '询价';
    return '¥' + (alreadyYuan ? n : n / 100).toFixed(2);
  };
  const fmtCount = (n) => (Number(n) || 0).toLocaleString('zh-CN');
  const GB = 1024 * 1024 * 1024;
  const toBytes = (n) => {
    const value = Number(n);
    return Number.isFinite(value) && value > 0 ? value : 0;
  };
  const traffic = (bytes) => (toBytes(bytes) / GB).toFixed(2) + ' GB';
  const dateValue = (value) => {
    if (!value) return null;
    const n = Number(value);
    const d = new Date(Number.isFinite(n) && n > 0 ? (n < 1e12 ? n * 1000 : n) : value);
    return Number.isNaN(d.getTime()) ? null : d;
  };
  const thisMonth = (value) => {
    const d = dateValue(value), now = new Date();
    return !!d && d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  };
  const currentPath = location.pathname.split('/').pop() || 'index.html';

  function requireApi() {
    if (!API || typeof API.request !== 'function') {
      toast('API 模块未加载，请刷新页面');
      return false;
    }
    return true;
  }
  function setBusy(container, message) {
    if (container) container.innerHTML = '<div class="live-state" role="status">' + esc(message || '正在加载真实数据…') + '</div>';
  }
  function emptyState(message) {
    return '<div class="live-state">' + esc(message) + '</div>';
  }
  function productErrorState() {
    return '<div class="s5-product-error" role="alert"><div class="s5-product-error-icon"><img src="./assets/icons/network.svg" alt="" aria-hidden="true"></div><strong>商品暂时无法加载</strong><p>商品服务暂时没有响应，请检查网络后重新加载。</p><button type="button" onclick="location.reload()">重新加载</button></div>';
  }
  (function injectProductErrorStyles(){if(document.getElementById('s5-product-error-styles'))return;const st=document.createElement('style');st.id='s5-product-error-styles';st.textContent='.s5-product-error{grid-column:1/-1;max-width:620px;width:100%;margin:22px auto;padding:30px 22px;text-align:center;border:1px solid rgba(71,145,220,.2);border-radius:22px;background:linear-gradient(145deg,rgba(255,255,255,.96),rgba(238,247,255,.94));color:#334b66;box-shadow:0 18px 48px rgba(44,117,190,.12),0 0 28px rgba(86,169,255,.1);backdrop-filter:blur(22px)}.s5-product-error-icon{display:grid;place-items:center;width:68px;height:68px;margin:0 auto 15px;border:1px solid rgba(0,85,255,.13);border-radius:20px;background:linear-gradient(145deg,#f5faff,#e6f2ff)}.s5-product-error-icon img{width:36px;height:36px}.s5-product-error strong{display:block;color:#0A192F;font-size:19px;font-weight:900}.s5-product-error p{margin:8px auto 18px;color:#4a6078;font-size:13px}.s5-product-error button{min-width:190px;min-height:48px;border:0;border-radius:13px;background:linear-gradient(110deg,#087bff,#0055d9 58%,#1746c8);color:#fff;font-weight:900;box-shadow:0 10px 24px rgba(0,85,255,.22)}';document.head.appendChild(st);})();

  function productIconPath(item,type){return type==='node'?'./assets/images/nodes.svg':'./assets/images/placeholder.svg';}
  function imageUrl(item, fallback) {
    const url = item && (item.image_url || item.image || item.cover_url || item.thumbnail || item.oss_url || item.picture || item.img);
    return url && /^https?:\/\//i.test(String(url)) ? String(url) : (fallback || './assets/images/placeholder.svg');
  }
  function productName(item) {
    return item.name || item.title || item.product_name || item.plan_name || ('商品 #' + (item.id == null ? '' : item.id));
  }
  function productDescription(item) {
    return item.detail_description || item.description_zh || item.description || item.content || item.introduction || item.details || '暂无商品说明';
  }
  function priceUnitIsYuan(item) {
    return ['yuan','cny','rmb','元'].includes(String(item.price_unit || item.currency_unit || item.unit || '').trim().toLowerCase());
  }
  function clonePrice(item) {
    const yuan = item.price_yuan ?? item.premium_yuan ?? item.unit_price_yuan ?? item.amount_yuan;
    if (yuan !== null && yuan !== undefined && yuan !== '') return money(yuan, true);
    const raw = item.price_cents ?? item.premium_cents ?? item.price_amount ?? item.price ?? item.amount ?? item.sale_price;
    if (raw === null || raw === undefined || raw === '') return '询价';
    return money(raw, priceUnitIsYuan(item));
  }
  function planPrice(item) {
    const keys = ['month_price','quarter_price','half_year_price','year_price','two_year_price','three_year_price','onetime_price','reset_price'];
    const unitIsYuan = priceUnitIsYuan(item);
    const prices = keys.map((key) => {
      const yuan = item[key + '_yuan'];
      const raw = yuan !== null && yuan !== undefined && yuan !== '' ? yuan : item[key];
      if (raw === null || raw === undefined || raw === '') return null;
      const n = Number(raw);
      if (!Number.isFinite(n) || n < 0) return null;
      return yuan !== null && yuan !== undefined && yuan !== '' ? n : (unitIsYuan ? n : n / 100);
    }).filter((value) => value !== null);
    if (prices.length) return money(Math.min.apply(null, prices), true);
    return clonePrice(item);
  }
  function card(item,type){
    const title=productName(item),description=productDescription(item);
    const fallbackImage=productIconPath(item,type),image=imageUrl(item,fallbackImage);
    const price=type==='node'?planPrice(item):clonePrice(item);
    const tag=type==='node'?(item.protocol||item.node_protocol||'全球高速节点'):(item.region_name||item.region||'服务器资源');
    const action=type==='node'?'<button class="button button-small" type="button" data-product-id="'+esc(item.id)+'">查看套餐</button>':'<a class="button button-small" href="./shop.html?category=服务器">查看服务器</a>';
    return '<article class="product-card live-product-card"><img class="product-photo" src="'+esc(image)+'" alt="'+esc(title)+'" loading="lazy" onerror="this.onerror=null;this.src=\''+esc(fallbackImage)+'\'"><div class="product-info"><span class="product-tag">'+esc(tag)+'</span><h3>'+esc(title)+'</h3><p>'+esc(description)+'</p><div class="product-buy"><strong>'+esc(price)+'</strong>'+action+'</div></div></article>';
  }
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
    const regionName=regionOf(value,region);
    const rowContainers=['items','plans','nodes','skus','sku_list','skuList','sku_items','skuItems','products','list','rows','records','children','regions','groups','sku','sku_data','skuData','product_list','productList','node_list','nodeList'];
    const nestedData=value.data&&typeof value.data==='object'&&rowContainers.some(key=>value.data[key]&&typeof value.data[key]==='object');
    const hasRows=rowContainers.some(key=>value[key]&&typeof value[key]==='object')||!!nestedData;
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
  
  const HOME_STATIC_URLS={
    nodes:['https://api.lynli.me/static/qian/nodes.json','https://raw.githubusercontent.com/shuji-chu/qian/socks5-data/nodes.json'],
    servers:['https://api.lynli.me/static/qian/servers.json','https://raw.githubusercontent.com/shuji-chu/qian/socks5-data/servers.json']
  };
  async function fetchHomeStatic(kind){
    const urls=HOME_STATIC_URLS[kind]||[];let lastError=null;
    for(const url of urls){
      const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),5000);
      try{
        const response=await fetch(url,{method:'GET',mode:'cors',credentials:'omit',cache:'no-store',headers:{Accept:'application/json'},signal:controller.signal});
        if(!response.ok)throw new Error('HTTP '+response.status);
        const payload=await response.json(),rows=Array.isArray(payload)?payload:listFrom(unwrap(payload));
        if(!Array.isArray(rows)||!rows.length)throw new Error('静态目录为空或格式不正确');
        return rows;
      }catch(error){lastError=error}finally{clearTimeout(timeout)}
    }
    throw lastError||new Error('静态目录不可用');
  }
  function catalogAllowed(row,kind){
    if(!row||typeof row!=='object'||row.visible===false||row.is_visible===false||row.enabled===false)return false;
    const category=[row.category,row.product_type,row.product_category,row.service_type,row.type,row.kind].filter(Boolean).join(' ').toLowerCase();
    const name=[row.name,row.title,row.product_name,row.sku_name].filter(Boolean).join(' ').toLowerCase();
    if(/account|accounts|账号|帐号|facebook|instagram|tiktok|telegram|gmail|outlook|whatsapp|discord|reddit/.test(category+' '+name))return false;
    if(/traffic|引流|接码|短信|验证码|查询|查号|群发|推广|growth|sms|lookup|verification/.test(category))return false;
    if(kind==='servers')return true;
    const protocol=[row.protocol,row.node_protocol,row.protocol_name].filter(Boolean).join(' ').toLowerCase();
    return /node|proxy|vpn|节点|订阅|vless|vmess|hysteria|trojan|shadowsocks|socks5|wireguard|tuic/.test(category+' '+protocol+' '+name)||!!row.protocol||!!row.node_protocol;
  }
  async function fetchCatalog(){
    const results=await Promise.allSettled([
      fetchHomeStatic('nodes').catch(()=>API&&typeof API.getPlans==='function'?API.getPlans():Promise.reject(new Error('节点目录 API 不可用'))),
      fetchHomeStatic('servers').catch(()=>API&&typeof API.getServers==='function'?API.getServers():Promise.reject(new Error('服务器目录 API 不可用')))
    ]);
    const nodePayload=results[0].status==='fulfilled'?unwrap(results[0].value):[];
    const serverPayload=results[1].status==='fulfilled'?unwrap(results[1].value):[];
    const nodes=groupedNodeRows(nodePayload).filter(row=>catalogAllowed(row,'nodes'));
    const servers=listFrom(serverPayload).filter(row=>catalogAllowed(row,'servers'));
    if(!nodes.length&&results[0].status==='rejected')toast('节点商品加载失败：'+results[0].reason.message);
    if(!servers.length&&results[1].status==='rejected')toast('服务器商品加载失败：'+results[1].reason.message);
    return {nodes,servers};
  }
  async function loadHome(){
    const section=$$('.content-section').find(s=>/精选数字商品/.test(s.textContent));
    if(section){
      const grid=$('.product-grid',section);setBusy(grid,'正在加载节点与服务器商品…');
      try{
        const catalog=await fetchCatalog();
        const featured=catalog.nodes.map(item=>({item,type:'node'})).concat(catalog.servers.map(item=>({item,type:'server'})))
          .map((entry,index)=>{
            const p=entry.item,weightRaw=p.sort_weight??p.sortWeight??p.weight,salesRaw=p.sales??p.sold_count??p.total_sales??p.buy_count;
            const stockRaw=p.stock??p.available_stock??p.inventory??p.quantity,orderRaw=p.sort??p.sort_order??p.display_order;
            const weight=weightRaw!=null&&weightRaw!==''&&Number.isFinite(Number(weightRaw))?Number(weightRaw):null;
            const sales=salesRaw!=null&&salesRaw!==''&&Number.isFinite(Number(salesRaw))?Number(salesRaw):0;
            const stock=stockRaw!=null&&stockRaw!==''&&Number.isFinite(Number(stockRaw))?Number(stockRaw):0;
            const order=orderRaw!=null&&orderRaw!==''&&Number.isFinite(Number(orderRaw))?Number(orderRaw):Number.MAX_SAFE_INTEGER;
            return {...entry,_rank:weight===null?sales:weight,_salesRank:sales,_orderRank:order,_stockRank:stock,_sourceIndex:index};
          }).sort((x,y)=>y._rank-x._rank||y._salesRank-x._salesRank||x._orderRank-y._orderRank||y._stockRank-x._stockRank||x._sourceIndex-y._sourceIndex).slice(0,50);
        grid.innerHTML=featured.length?featured.map(entry=>card(entry.item,entry.type)).join(''):emptyState('当前暂无可展示商品');
      }catch(error){grid.innerHTML=productErrorState();toast(error.message||'商品加载失败')}
    }
    const announcement=$('.announcement');
    if(announcement){
      try{const notices=listFrom(unwrap(await API.getNotices()));if(!notices.length){announcement.hidden=true;return}
        const track=$('.announcement-track span',announcement);if(track)track.textContent=notices.map(n=>[n.title,n.content].filter(Boolean).join('：')).join('　 ·　 ');announcement.hidden=false;
      }catch(error){announcement.hidden=true;toast('公告加载失败：'+error.message)}
    }
    const blindbox=$('.blindbox-wrap');if(blindbox)blindbox.remove();
  }

  async function loadShop(){
    const root=$('main');if(!root)return;
    root.innerHTML='<section class="shop-hero"><span class="eyebrow">LIVE DIGITAL MARKETPLACE</span><h1>全球节点与服务器<br><em>实时商品目录</em></h1><p>商品名称、图片和价格通过正式服务接口加载。</p><div class="shop-tabs"><a class="button button-small" href="#nodes">全球高速节点</a><a class="button button-small button-ghost" href="#servers">服务器资源</a></div></section><section id="nodes" class="content-section"><div class="section-heading"><div><span class="eyebrow">GLOBAL NETWORK</span><h2>全球高速节点服务</h2></div></div><div id="live-nodes" class="product-grid shop-product-grid"></div></section><section id="servers" class="content-section"><div class="section-heading"><div><span class="eyebrow">SERVER INFRASTRUCTURE</span><h2>服务器资源</h2></div></div><div id="live-servers" class="product-grid shop-product-grid"></div></section>';
    const nodes=$('#live-nodes'),servers=$('#live-servers');setBusy(nodes,'正在加载节点套餐…');setBusy(servers,'正在加载服务器资源…');
    const catalog=await fetchCatalog();
    nodes.innerHTML=catalog.nodes.length?catalog.nodes.map(p=>card(p,'node')).join(''):emptyState('服务端当前没有可展示的节点套餐');
    servers.innerHTML=catalog.servers.length?catalog.servers.map(p=>card(p,'server')).join(''):emptyState('服务端当前没有可展示的服务器资源');
  }

  async function loadUser() {
    const main = $('main');
    if (!main) return;
    if (!API.readToken()) { location.href = './login.html?redirect=user.html'; return; }
    main.innerHTML = '<div class="page-title"><div><span class="eyebrow">YOUR SPACE</span><h1>个人中心</h1><p>账户资料与订阅信息。</p></div></div><section class="profile-card"><div class="avatar" id="profile-avatar">S</div><div class="profile-main"><span class="eyebrow">ACCOUNT</span><h2 id="profile-name">正在加载…</h2><p id="profile-email">—</p><div class="short-id">用户短 ID <b id="profile-short-id">—</b><button class="text-button" id="copy-short-id" type="button">复制 ID</button></div></div></section><section class="metric-grid"><article class="metric-card"><span>账户余额</span><strong id="account-balance">—</strong><small>服务端账户信息</small></article><article class="metric-card"><span>剩余流量</span><strong id="traffic-left">—</strong><small id="traffic-total">总流量：—</small></article><article class="metric-card"><span>订阅到期</span><strong id="account-expiry">—</strong><small>以服务端返回为准</small></article></section><section class="panel"><div class="panel-heading"><div><span class="eyebrow">SUBSCRIPTION</span><h2>我的订阅</h2><p>订阅链接来自后端，切勿公开分享。</p></div></div><div id="subscription-content"></div></section>';
    try {
      const [infoResponse, subResponse] = await Promise.all([API.getUserInfo(), API.getSubscription()]);
      const info = unwrap(infoResponse) || {};
      const sub = unwrap(subResponse) || {};
      const user = info.user || info;
      const shortId = String(user.short_id || info.short_id || info.shortId || sub.short_id || '');
      const name = user.nickname || info.nickname || user.email || info.email || '已登录用户';
      $('#profile-avatar').textContent = String(name).slice(0,1).toUpperCase();
      $('#profile-name').textContent = name;
      $('#profile-email').textContent = user.email || info.email || '—';
      $('#profile-short-id').textContent = shortId || '—';
      $('#copy-short-id').addEventListener('click', () => shortId && UI.copy(shortId));
      $('#account-balance').textContent = money(info.balance || 0, false);
      const total = toBytes(sub.transfer_enable || info.transferEnable || info.transfer_enable);
      const used = toBytes(sub.u) + toBytes(sub.d);
      $('#traffic-left').textContent = traffic(Math.max(0,total-used));
      $('#traffic-total').textContent = '总流量：' + traffic(total);
      const expiry = dateValue(sub.expired_at || info.expiredAt || info.expired_at);
      $('#account-expiry').textContent = expiry ? expiry.toLocaleDateString('zh-CN') : '未设置';
      const subscribeUrl = String(sub && (sub.subscribe_url || sub.subscribeUrl || sub.url) || '');
      const subscriptionContent = $('#subscription-content');
      subscriptionContent.innerHTML = subscribeUrl ? '<div class="subscription-card"><div class="sub-copy"><b>个人订阅链接</b><span class="break-all">' + esc(subscribeUrl) + '</span></div><button class="button button-small" id="copy-subscription" type="button">复制订阅链接</button></div>' : emptyState('服务端未返回订阅链接');
      const copySub = $('#copy-subscription');
      if (copySub) copySub.addEventListener('click', () => UI.copy(subscribeUrl));
    } catch (error) {
      if (/401|unauth|登录|token/i.test(error.message || '')) {
        API.clearSession();
        location.href = './login.html?redirect=user.html';
        return;
      }
      toast('账户信息加载失败：' + error.message);
      $('#subscription-content').innerHTML = emptyState('订阅信息暂时无法获取');
    }
  }

  function addGlobalNavigation() {
    if (!document.body) return;
    if (!$('.home-bottom-nav,.bottom-nav,.mobile-tabbar')) {
      const active = currentPath === 'shop.html' ? 'shop' : currentPath === 'user.html' ? 'user' : 'home';
      const tab = document.createElement('nav');
      tab.className = 'mobile-tabbar';
      tab.setAttribute('aria-label','底部导航');
      tab.innerHTML = '<a class="' + (active === 'home' ? 'active' : '') + '" href="./index.html"><img src="./assets/icons/home.svg" alt="" aria-hidden="true"><small>首页</small></a><a class="' + (active === 'shop' ? 'active' : '') + '" href="./shop.html"><img src="./assets/icons/shop.svg" alt="" aria-hidden="true"><small>商城</small></a><a class="' + (active === 'user' ? 'active' : '') + '" href="./user.html"><img src="./assets/icons/user.svg" alt="" aria-hidden="true"><small>我的</small></a>';
      document.body.appendChild(tab);
    }
    if (!$('.floating-support')) {
      const support = document.createElement('a');
      support.className = 'floating-support';
      support.href = 'https://t.me/qingtian_Boss';
      support.target = '_blank'; support.rel = 'noopener noreferrer';
      support.innerHTML = '<img src="./assets/icons/support.svg" alt="" aria-hidden="true"><small>客服</small>';
      support.setAttribute('aria-label','联系在线客服');
      document.body.appendChild(support);
    }
  }
  function installStyles() {
    if ($('#s5-live-styles')) return;
    const style = document.createElement('style');
    style.id = 's5-live-styles';
    style.textContent = '.live-state{grid-column:1/-1;padding:24px 16px;text-align:center;color:var(--muted,#8ca4bf);border:1px solid var(--line,rgba(132,190,230,.17));border-radius:14px;background:rgba(255,255,255,.88)}.live-product-card .product-photo{object-fit:cover}.break-all{overflow-wrap:anywhere;word-break:break-word}.bot-entry{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}.bot-status{color:var(--muted,#8ca4bf)}.mobile-tabbar{display:none}.floating-support{position:fixed;right:16px;bottom:24px;z-index:80;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;width:54px;height:54px;border:1px solid rgba(115,234,255,.4);border-radius:50%;background:rgba(255,255,255,.96);color:#0055FF;box-shadow:0 8px 28px #0005;font-size:20px}.floating-support small{font-size:10px}.announcement[hidden]{display:none!important}@media(max-width:650px){body{padding-bottom:76px}.mobile-tabbar{position:fixed;left:0;right:0;bottom:0;z-index:70;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));justify-content:stretch;align-items:center;padding:7px 8px calc(7px + env(safe-area-inset-bottom));min-height:68px;background:rgba(5,13,28,.96);border-top:1px solid var(--line,rgba(132,190,230,.17));backdrop-filter:blur(18px)}.mobile-tabbar a{display:flex;min-width:0;flex-direction:column;align-items:center;justify-content:center;gap:3px;color:var(--muted,#8ca4bf);font-size:10px}.mobile-tabbar a img{display:block;width:22px;height:22px;object-fit:contain}.floating-support img{width:22px;height:22px;object-fit:contain}.mobile-tabbar a small{font-size:10px}.mobile-tabbar a.active{color:var(--cyan,#73eaff)}.floating-support{bottom:calc(82px + env(safe-area-inset-bottom));right:12px;width:48px;height:48px}.bot-entry{align-items:flex-start;flex-direction:column}.site-footer{padding-bottom:88px!important}}';
    document.head.appendChild(style);
  }

  function installCinematicBackground() {
    // Disabled: the shared blue-white CSS theme owns the page background.
  }

  function loadLogin() {
    const form = $('#login-form');
    if (!form || !API) return;
    if (API.readToken()) {
      const existingRedirect = new URLSearchParams(location.search).get('redirect');
      location.replace(existingRedirect === 'shop.html' ? './shop.html' : existingRedirect === 'index.html' ? './index.html' : './user.html');
      return;
    }
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = $('#login-email').value.trim();
      const password = $('#login-password').value;
      const button = $('#login-submit');
      if (!email || !password) { toast('请输入邮箱和密码'); return; }
      button.disabled = true;
      button.textContent = '正在登录…';
      try {
        const response = await API.request('/passport/auth/login', {method:'POST',body:JSON.stringify({email,password})});
        const data = unwrap(response) || {};
        const token = data.token || data.auth_data || data.access_token;
        if (!token) throw new Error(data.message || data.msg || '登录接口未返回 Token');
        API.saveToken(token);
        const redirect = new URLSearchParams(location.search).get('redirect');
        location.replace(redirect === 'shop.html' ? './shop.html' : redirect === 'index.html' ? './index.html' : './user.html');
      } catch (error) {
        toast('登录失败：' + (error.message || '请稍后重试'));
        button.disabled = false;
        button.textContent = '登录';
      }
    });
  }

  async function boot() {
    installStyles();
    if (!API) { toast('API 模块未加载'); return; }
    addGlobalNavigation();
    if (currentPath === 'index.html') return loadHome();
    if (currentPath === 'shop.html') return loadShop().catch((error) => toast('商城加载失败：' + error.message));
    if (currentPath === 'user.html') return loadUser();
    if (currentPath === 'login.html') return loadLogin();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();