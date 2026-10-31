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

  function productIconPath(item, type) {
    const name = [item && item.account_category, item && item.platform, item && item.name, item && item.title, item && item.product_name, item && item.product_type].filter(Boolean).join(' ').toLowerCase();
    const icons = [
      [/facebook|脸书|fb账号/, 'platform-facebook.svg'],
      [/instagram|ins账号/, 'platform-instagram.svg'],
      [/tiktok|抖音海外|tik tok/, 'platform-tiktok.svg'],
      [/twitter|(^|[^a-z])x账号|推特/, 'platform-x.svg'],
      [/telegram|电报|tg账号/, 'platform-telegram.svg'],
      [/google|gmail|谷歌/, 'platform-google.svg'],
      [/whatsapp|wa账号/, 'platform-whatsapp.svg'],
      [/discord/, 'platform-discord.svg'],
      [/youtube|油管/, 'platform-youtube.svg'],
      [/reddit/, 'platform-reddit.svg']
    ];
    const match = icons.find(([pattern]) => pattern.test(name));
    return match ? './assets/images/' + match[1] : (type === 'node' ? './assets/images/nodes.svg' : './assets/images/accounts.svg');
  }
  function accountCategoryName(item) {
    const name = [item && item.account_category,item && item.platform,item && item.name,item && item.title,item && item.product_name].filter(Boolean).join(' ').toLowerCase();
    const entries = [[/facebook|脸书|fb账号/,'Facebook'],[/instagram|ins账号/,'Instagram'],[/tiktok|tik tok|抖音海外/,'TikTok'],[/twitter|推特|x账号/,'X / Twitter'],[/telegram|电报|tg账号/,'Telegram'],[/google|gmail|谷歌/,'Google / Gmail'],[/whatsapp|wa账号/,'WhatsApp'],[/discord/,'Discord'],[/youtube|油管/,'YouTube'],[/reddit/,'Reddit']];
    const found = entries.find(([pattern]) => pattern.test(name));
    return found ? found[1] : '海外账号资源';
  }
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
    const yuan = item.price_yuan ?? item.unit_price_yuan ?? item.amount_yuan;
    if (yuan !== null && yuan !== undefined && yuan !== '') return money(yuan, true);
    const raw = item.price_cents ?? item.price_amount ?? item.price ?? item.amount ?? item.sale_price;
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
  function card(item, type) {
    const title = productName(item);
    const description = productDescription(item);
    const fallbackImage = productIconPath(item, type);
    const image = imageUrl(item, fallbackImage);
    const price = type === 'node' ? planPrice(item) : clonePrice(item);
    const tag = type === 'node' ? (item.protocol || item.node_protocol || '全球高速节点') : accountCategoryName(item);
    const detail = item.id != null ? ' data-product-id="' + esc(item.id) + '"' : '';
    return '<article class="product-card live-product-card"><img class="product-photo" src="' + esc(image) + '" alt="' + esc(title) + '" loading="lazy" onerror="this.onerror=null;this.src=\''+esc(fallbackImage)+'\'"><div class="product-info"><span class="product-tag">' + tag + '</span><h3>' + esc(title) + '</h3><p>' + esc(description) + '</p><div class="product-buy"><strong>' + esc(price) + '</strong>' + (type === 'node' ? '<button class="button button-small" type="button"' + detail + '>查看套餐</button>' : '<a class="button button-small" href="' + esc(item.detail_url || item.url || 'https://t.me/qingtian_Boss') + '" target="_blank" rel="noopener noreferrer">咨询购买</a>') + '</div></div></article>';
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
  
  const HOME_STATIC_URLS = {
    nodes: ['https://api.lynli.me/static/qian/nodes.json', 'https://raw.githubusercontent.com/shuji-chu/qian/main/nodes.json'],
    accounts: ['https://api.lynli.me/static/qian/accounts.json', 'https://raw.githubusercontent.com/shuji-chu/qian/main/accounts.json']
  };
  async function fetchHomeStatic(kind) {
    const urls = HOME_STATIC_URLS[kind] || [];
    let lastError = null;
    for (const url of urls) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      try {
        const response = await fetch(url, {method:'GET', mode:'cors', credentials:'omit', cache:'no-store', headers:{Accept:'application/json'}, signal:controller.signal});
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const payload = await response.json();
        const rows = Array.isArray(payload) ? payload : listFrom(unwrap(payload));
        if (!Array.isArray(rows)) throw new Error('商品数据不是数组');
        if (!rows.length) throw new Error('静态目录返回空数组');
        if (rows.length) {
          console.info('[S5 home catalog] loaded', kind, rows.length, url);
          return rows;
        }
        lastError = new Error('静态目录暂时为空');
      } catch (error) {
        lastError = error;
        console.error('[S5 home catalog] 请求失败，正在尝试备用源', {kind, url, name:error&&error.name, message:error&&error.message, stack:error&&error.stack});
      } finally {
        clearTimeout(timeout);
      }
    }
    throw lastError || new Error('静态目录不可用');
  }

  async function fetchCatalog() {
    const staticResults = await Promise.allSettled([fetchHomeStatic('nodes'), fetchHomeStatic('accounts')]);
    const staticNodes = staticResults[0].status === 'fulfilled' ? staticResults[0].value : null;
    const staticAccounts = staticResults[1].status === 'fulfilled' ? staticResults[1].value : null;
    const needLiveNodes = !staticNodes || !staticNodes.length;
    const needLiveAccounts = !staticAccounts || !staticAccounts.length;
    const results = await Promise.allSettled([
      needLiveNodes ? (API && typeof API.getPlans === 'function' ? API.getPlans() : Promise.reject(new Error('API module unavailable'))) : Promise.resolve([]),
      needLiveAccounts ? (API && typeof API.getAccounts === 'function' ? API.getAccounts() : Promise.reject(new Error('账号目录 API unavailable'))) : Promise.resolve([]),
      (async()=>{const base=String(window.SOSKS5_PUBLIC_API_BASE||'https://api.lynli.me').replace(/\/+$/,'');const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),1200);let response;try{response=await fetch(base+'/api/v1/public/catalog/account-overrides',{headers:{Accept:'application/json'},signal:controller.signal})}finally{clearTimeout(timer)}if(!response.ok)throw Error('catalog overrides unavailable');return response.json()})()
    ]);
    const nodesResponse = staticNodes && staticNodes.length ? staticNodes : (results[0].status === 'fulfilled' ? unwrap(results[0].value) : []);
    const accountResponse = staticAccounts && staticAccounts.length ? staticAccounts : (results[1].status === 'fulfilled' ? unwrap(results[1].value) : []);
    if (needLiveNodes && results[0].status === 'rejected') toast('节点商品加载失败：' + results[0].reason.message);
    if (needLiveAccounts && results[1].status === 'rejected') { console.error('[S5 home catalog] 账号目录回退失败', results[1].reason); toast('账号商品加载失败：' + results[1].reason.message); }
    const plans = groupedNodeRows(nodesResponse);
    const isSocialAccount = (p) => /facebook|脸书|instagram|tiktok|twitter|推特|telegram|电报|whatsapp|google|gmail|youtube|油管|discord|reddit|snapchat|linkedin|outlook|apple id|meta account|threads|steam|netflix/.test([p.name,p.title,p.content,p.description,p.type,p.product_type,p.product_category,p.platform,p.brand].join(' ').toLowerCase());
    const isAccountPlan = (p) => {
      const kind = String(p.product_type || p.product_category || p.service_type || p.type || '').toLowerCase();
      const words = [p.name,p.title,p.content,p.description,p.protocol,p.node_protocol].join(' ').toLowerCase();
      if (/node|nodes|proxy|节点|代理|订阅|vless|vmess|hysteria|trojan|shadowsocks|socks5|wireguard|tuic/.test(kind + ' ' + words)) return false;
      return kind === 'account' || kind === 'accounts' || /账号|account/.test(kind) || isSocialAccount(p);
    };
    const nodes = staticNodes && staticNodes.length ? plans : plans.filter((p) => {
      if (isAccountPlan(p)) return false;
      const kind = String(p.product_type || p.product_category || p.service_type || '').toLowerCase();
      const words = [p.name,p.title,p.content,p.description,p.type,p.protocol,p.node_protocol].join(' ').toLowerCase();
      return kind === 'node' || kind === 'nodes' || kind === 'proxy' || /节点|proxy|vpn|订阅|vless|vmess|hysteria|trojan|shadowsocks|socks5|wireguard|tuic|network/.test(words);
    });
    const overridePayload = results[2].status === 'fulfilled' ? results[2].value : [];
    const overrideRows = listFrom(unwrap(overridePayload));
    const overrideMap = new Map(overrideRows.filter((item) => item && item.id != null).map((item) => [String(item.id), item]));
    const allowedAccount = (item) => !/接码|短信|验证码|查询|查号|流量包|流量|引流|traffic|sms|verification|lookup|query/i.test([item.category,item.product_type,item.product_category,item.type,item.name,item.title,item.product_name].filter(Boolean).join(' '));
    const combined = listFrom(accountResponse).filter(allowedAccount).concat(plans.filter(isAccountPlan).filter(allowedAccount)).map((item) => Object.assign({}, item, overrideMap.get(String(item.id)) || {}));
    const seen = new Set();
    const accounts = combined.filter((item) => {
      const key = item.id != null ? 'id:' + String(item.id) : 'name:' + String(item.name || item.title || item.product_name || '');
      if (seen.has(key)) return false;
      seen.add(key); return true;
    }).map((item) => Object.assign({}, item, {category: '账号服务', product_type: 'account', account_category: item.account_category || item.platform || accountCategoryName(item)}));
    console.info('[S5 home catalog] ready', {nodes:nodes.length, accounts:accounts.length, source:{nodes:staticNodes&&staticNodes.length?'static':'api',accounts:staticAccounts&&staticAccounts.length?'static':'api'}});
    return {nodes, accounts};
  }
  async function loadHome() {
    const productSection = $$('.content-section').find((section) => /精选数字商品/.test(section.textContent));
    if (productSection) {
      const grid = $('.product-grid', productSection);
      setBusy(grid, '正在加载精选商品…');
      try {
        const catalog = await fetchCatalog();
        const featured = catalog.accounts.map((item) => ({item,type:'account'}))
          .concat(catalog.nodes.map((item) => ({item,type:'node'})))
          .map((entry,index) => {
            const p = entry.item;
            const weightRaw = p.sort_weight ?? p.sortWeight ?? p.weight;
            const salesRaw = p.sales ?? p.sold_count ?? p.total_sales ?? p.buy_count ?? p.orders_count ?? p.purchase_count;
            const stockRaw = p.stock ?? p.available_stock ?? p.inventory ?? p.quantity;
            const orderRaw = p.sort ?? p.sort_order ?? p.display_order;
            const weight = weightRaw !== null && weightRaw !== undefined && weightRaw !== '' && Number.isFinite(Number(weightRaw)) ? Number(weightRaw) : null;
            const sales = salesRaw !== null && salesRaw !== undefined && salesRaw !== '' && Number.isFinite(Number(salesRaw)) ? Number(salesRaw) : 0;
            const stock = stockRaw !== null && stockRaw !== undefined && stockRaw !== '' && Number.isFinite(Number(stockRaw)) ? Number(stockRaw) : 0;
            const order = orderRaw !== null && orderRaw !== undefined && orderRaw !== '' && Number.isFinite(Number(orderRaw)) ? Number(orderRaw) : Number.MAX_SAFE_INTEGER;
            const hot = p.hot === true || p.is_hot === true || p.featured === true ? 1 : 0;
            return {...entry, _rank:weight === null ? sales : weight, _salesRank:sales, _hotRank:hot, _orderRank:order, _stockRank:stock, _sourceIndex:index};
          })
          .sort((a,b) => b._rank-a._rank || b._salesRank-a._salesRank || b._hotRank-a._hotRank || a._orderRank-b._orderRank || b._stockRank-a._stockRank || a._sourceIndex-b._sourceIndex)
          .slice(0, 50);
        grid.innerHTML = featured.length ? featured.map((entry) => card(entry.item, entry.type)).join('') : emptyState('当前暂无可展示商品');
      } catch (error) {
        grid.innerHTML = productErrorState();
        toast(error.message || '商品加载失败');
      }
    }
    const announcement = $('.announcement');
    if (announcement) {
      try {
        const notices = listFrom(unwrap(await API.getNotices()));
        if (!notices.length) { announcement.hidden = true; return; }
        const track = $('.announcement-track span', announcement);
        if (track) track.textContent = notices.map((n) => [n.title,n.content].filter(Boolean).join('：')).join('　 ·　 ');
        announcement.hidden = false;
      } catch (error) {
        announcement.hidden = true;
        toast('公告加载失败：' + error.message);
      }
    }
    const blindbox = $('.blindbox-wrap');
    if (blindbox) blindbox.remove();
  }

  async function loadShop() {
    const main = $('main');
    if (!main) return;
    main.innerHTML = '<section class="shop-hero"><span class="eyebrow">LIVE DIGITAL MARKETPLACE</span><h1>海外账号资源与全球节点<br><em>实时商品目录</em></h1><p>商品名称、图片和价格通过服务端接口加载。</p><div class="shop-tabs"><a class="button button-small" href="#accounts">海外账号资源</a><a class="button button-small button-ghost" href="#nodes">全球高速节点</a></div></section><section id="accounts" class="content-section"><div class="section-heading"><div><span class="eyebrow">OVERSEAS ACCOUNTS</span><h2>海外账号资源商城</h2></div></div><div id="live-accounts" class="product-grid shop-product-grid"></div></section><section id="nodes" class="content-section"><div class="section-heading"><div><span class="eyebrow">GLOBAL NETWORK</span><h2>全球高速节点服务</h2></div></div><div id="live-nodes" class="product-grid shop-product-grid"></div></section>';
    const accounts = $('#live-accounts'), nodes = $('#live-nodes');
    setBusy(accounts, '正在加载账号商品…'); setBusy(nodes, '正在加载节点套餐…');
    const catalog = await fetchCatalog();
    accounts.innerHTML = catalog.accounts.length ? catalog.accounts.map((p) => card(p,'account')).join('') : emptyState('服务端当前没有可展示的账号商品');
    nodes.innerHTML = catalog.nodes.length ? catalog.nodes.map((p) => card(p,'node')).join('') : emptyState('服务端当前没有可展示的节点套餐');
  }

  async function loadPromo() {
    const main = $('main');
    if (!main) return;
    main.innerHTML = '<div class="page-title"><div><span class="eyebrow">INVITE · GROW · EARN</span><h1>引流分销中心</h1><p>邀请链接、推广数据与机器人绑定状态来自后端。</p></div></div><section class="profile-card promo-hero"><div class="profile-main"><span class="eyebrow">YOUR INVITATION LINK</span><h2>专属邀请入口</h2><p id="invite-note">正在读取账户信息…</p><div class="invite-field"><span id="invite-url" class="break-all">加载中…</span><button id="copy-invite" class="button button-small" type="button">复制邀请链接</button></div></div><div class="profile-decoration">↗</div></section><section class="metric-grid" id="promo-metrics"><article class="metric-card"><span>本月邀请</span><strong>—</strong></article><article class="metric-card"><span>有效注册用户</span><strong>—</strong></article><article class="metric-card"><span>累计预估奖励</span><strong>—</strong></article></section><section class="panel"><div class="panel-heading"><div><span class="eyebrow">TELEGRAM BOT</span><h2>绑定 TG 机器人</h2><p id="bot-guide">正在读取机器人绑定入口…</p></div></div><div id="bot-entry" class="bot-entry"></div></section><section class="panel"><div class="panel-heading"><div><span class="eyebrow">YOUR INVITED USERS</span><h2>真实邀请客户明细</h2><p>按实际邀请用户的贡献金额排序。后端目前未提供独立的全站排行榜接口。</p></div></div><div class="table-scroll"><table class="rank-table"><thead><tr><th>用户</th><th>注册时间</th><th>已消费</th><th>预估佣金</th></tr></thead><tbody id="invite-customer-rows"></tbody></table></div></section>';
    if (!API.readToken()) { location.href = './login.html?redirect=promo.html'; return; }
    const inviteUrlNode = $('#invite-url');
    try {
      const [infoResponse, statsResponse, customersResponse, botResponse] = await Promise.all([
        API.getUserInfo(), API.getInviteStats(), API.getInviteCustomers(), API.getBotStatus()
      ]);
      const leaderboardResult = await Promise.allSettled([API.getReferralLeaderboard({period:'month',limit:10})]);
      const info = unwrap(infoResponse) || {};
      const user = info.user || info.profile || info.account || info.member || info;
      const shortId = String(user.short_id || user.shortId || info.short_id || info.shortId || '').trim();
      if (!/^\d{5}$/.test(shortId)) throw new Error('用户接口未返回 5 位 short_id');
      const inviteUrl = location.origin + '/login.html?mode=register&short_id=' + encodeURIComponent(shortId);
      inviteUrlNode.textContent = inviteUrl;
      $('#invite-note').textContent = '当前账户邀请码：' + shortId;
      $('#copy-invite').addEventListener('click', () => UI.copy(inviteUrl));
      const stats = unwrap(statsResponse) || {};
      const customers = listFrom(unwrap(customersResponse));
      const monthCustomers = customers.filter((c) => thisMonth(c.created_at || c.createdAt));
      const activeCustomers = customers;
      const commissionCents = customers.reduce((sum,c) => sum + Number(c.commission || 0), 0);
      const metricCards = $$('#promo-metrics .metric-card');
      metricCards[0].querySelector('strong').textContent = fmtCount(monthCustomers.length);
      metricCards[1].querySelector('strong').textContent = fmtCount(activeCustomers.length);
      metricCards[2].querySelector('strong').textContent = money(commissionCents, false);
      metricCards[0].querySelector('span').textContent = '本月邀请注册';
      metricCards[1].querySelector('span').textContent = '有效注册用户';
      metricCards[2].querySelector('span').textContent = '累计预估佣金';
      const bot = unwrap(botResponse) || {};
      const botUrl = bot.mivra_url || '';
      $('#bot-guide').textContent = bot.guide ? String(bot.guide).replaceAll('{short_id}',shortId) : '打开机器人后发送“绑定 ' + shortId + '”完成绑定。';
      $('#bot-entry').innerHTML = botUrl ? '<p class="bot-status">' + (bot.bound ? '已绑定 Telegram 账号' : '尚未绑定 Telegram 账号') + '</p><a class="button" href="' + esc(botUrl) + '" target="_blank" rel="noopener noreferrer">打开机器人并绑定</a>' : emptyState('后端暂未配置机器人入口，请联系管理员');
      const tbody = $('#invite-customer-rows');
      const leaderboardResponse = leaderboardResult[0].status === 'fulfilled' ? unwrap(leaderboardResult[0].value) : null;
      const leaderboardRows = listFrom(leaderboardResponse);
      if (leaderboardRows.length) {
        const panelTitle = $('.panel .panel-heading h2')[1];
        if (panelTitle) panelTitle.textContent = '本月推广排行榜';
        const headers = $('.rank-table thead th');
        if (headers.length === 4) {
          headers[0].textContent = '排名';
          headers[1].textContent = '推广用户';
          headers[2].textContent = '邀请人数';
          headers[3].textContent = '预估奖励';
        }
        tbody.innerHTML = leaderboardRows.slice(0,10).map((row,index) => {
          const name = row.nickname || row.username || row.name || ('用户 ' + (row.short_id || row.shortId || ''));
          const count = row.invite_count ?? row.invites ?? row.count ?? row.total_invites ?? row.total ?? 0;
          const reward = row.reward_yuan != null ? money(row.reward_yuan,true) : money(row.commission ?? row.reward ?? row.amount ?? 0,false);
          return '<tr><td><span class="rank-medal">' + String(index+1).padStart(2,'0') + '</span></td><td><b>' + esc(name) + '</b><small>' + esc(row.short_id || row.shortId || '') + '</small></td><td>' + esc(fmtCount(count)) + '</td><td>' + esc(reward) + '</td></tr>';
        }).join('');
      } else {
        const sorted = customers.slice().sort((a,b) => Number(b.commission || 0) - Number(a.commission || 0));
        tbody.innerHTML = sorted.length ? sorted.map((c) => {
          const date = dateValue(c.created_at || c.createdAt);
          return '<tr><td>' + esc(c.nickname || ('用户 ' + (c.short_id || ''))) + '<small>' + esc(c.short_id || '') + '</small></td><td>' + (date ? esc(date.toLocaleDateString('zh-CN')) : '—') + '</td><td>' + esc(money(c.charge || 0,false)) + '</td><td>' + esc(money(c.commission || 0,false)) + '</td></tr>';
        }).join('') : '<tr><td colspan="4">' + esc('暂无邀请客户数据') + '</td></tr>';
      }
    } catch (error) {
      if (/401|unauth|登录|token/i.test(error.message || '')) {
        API.clearSession();
        location.href = './login.html?redirect=promo.html';
        return;
      }
      toast('引流数据加载失败：' + error.message);
      if (inviteUrlNode) inviteUrlNode.textContent = '暂时无法获取邀请链接';
      $('#bot-entry').innerHTML = emptyState('机器人信息暂时无法获取');
      $('#invite-customer-rows').innerHTML = '<tr><td colspan="4">邀请数据暂时无法获取</td></tr>';
    }
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
      location.replace(existingRedirect === 'promo.html' ? './promo.html' : existingRedirect === 'shop.html' ? './shop.html' : './user.html');
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
        location.replace(redirect === 'promo.html' ? './promo.html' : redirect === 'shop.html' ? './shop.html' : redirect === 'index.html' ? './index.html' : './user.html');
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
    if (currentPath === 'promo.html') return loadPromo();
    if (currentPath === 'user.html') return loadUser();
    if (currentPath === 'login.html') return loadLogin();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();