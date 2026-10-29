(function () {
  'use strict';

  const API = window.S5Api;
  const UI = window.SOSKS5UI;
  const $ = (selector, root) => (root || document).querySelector(selector);
  const $$ = (selector, root) => Array.from((root || document).querySelectorAll(selector));
  const esc = (value) => String(value == null ? '' : value).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const toast = (message) => UI && UI.toast ? UI.toast(message) : console.warn('[SOSKS5]', message);
  const unwrap = (response) => API.unwrap(response);
  const listFrom = (value) => Array.isArray(value) ? value : (value && (value.list || value.items || value.products || value.plans || value.data || value.rows)) || [];
  const money = (value, alreadyYuan) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return '¥0.00';
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
  function clonePrice(item) {
    if (item.price_yuan != null) return money(item.price_yuan, true);
    const raw = item.price_cents ?? item.price_amount ?? item.price ?? item.amount ?? item.sale_price ?? 0;
    return money(raw, false);
  }
  function planPrice(item) {
    const prices = ['month_price','quarter_price','half_year_price','year_price','two_year_price','three_year_price','onetime_price','reset_price']
      .map((key) => item[key]).filter((value) => value !== null && value !== '' && value !== undefined && Number.isFinite(Number(value)) && Number(value) >= 0);
    if (prices.length) return money(Math.min.apply(null, prices), false);
    if (item.price_yuan != null) return money(item.price_yuan, true);
    return money(item.price ?? item.sale_price ?? 0, false);
  }
  function card(item, type) {
    const title = productName(item);
    const description = productDescription(item);
    const image = imageUrl(item, type === 'node' ? './assets/images/nodes.svg' : './assets/images/accounts.svg');
    const price = type === 'node' ? planPrice(item) : clonePrice(item);
    const tag = type === 'node' ? '全球高速节点' : '海外账号资源';
    const detail = item.id != null ? ' data-product-id="' + esc(item.id) + '"' : '';
    return '<article class="product-card live-product-card"><img class="product-photo" src="' + esc(image) + '" alt="' + esc(title) + '" loading="lazy" onerror="this.onerror=null;this.src=\'./assets/images/placeholder.svg\'"><div class="product-info"><span class="product-tag">' + tag + '</span><h3>' + esc(title) + '</h3><p>' + esc(description) + '</p><div class="product-buy"><strong>' + esc(price) + '</strong>' + (type === 'node' ? '<button class="button button-small" type="button"' + detail + '>查看套餐</button>' : '<a class="button button-small" href="' + esc(item.detail_url || item.url || 'https://t.me/qingtian_Boss') + '" target="_blank" rel="noopener noreferrer">咨询购买</a>') + '</div></div></article>';
  }
  async function fetchCatalog() {
    if (!requireApi()) return {nodes: [], accounts: []};
    const results = await Promise.allSettled([API.getPlans(), API.getClonedProducts()]);
    const nodesResponse = results[0].status === 'fulfilled' ? unwrap(results[0].value) : [];
    const accountResponse = results[1].status === 'fulfilled' ? unwrap(results[1].value) : [];
    if (results[0].status === 'rejected') toast('节点商品加载失败：' + results[0].reason.message);
    if (results[1].status === 'rejected') toast('账号商品加载失败：' + results[1].reason.message);
    const plans = listFrom(nodesResponse);
    const nodes = plans.filter((p) => {
      const kind = String(p.product_type || p.product_category || p.service_type || '').toLowerCase();
      const words = [p.name,p.title,p.content,p.description,p.type].join(' ').toLowerCase();
      return kind === 'node' || kind === 'nodes' || kind === 'proxy' || /节点|proxy|vpn|订阅|vless|vmess|hysteria|trojan|network/.test(words);
    });
    return {nodes, accounts: listFrom(accountResponse)};
  }

  async function loadHome() {
    const productSection = $$('.content-section').find((section) => /精选数字商品/.test(section.textContent));
    if (productSection) {
      const grid = $('.product-grid', productSection);
      setBusy(grid, '正在加载精选商品…');
      try {
        const catalog = await fetchCatalog();
        const featured = catalog.accounts.slice(0, 3).map((p) => ({item:p,type:'account'}))
          .concat(catalog.nodes.slice(0, 3).map((p) => ({item:p,type:'node'}))).slice(0, 3);
        grid.innerHTML = featured.length ? featured.map((entry) => card(entry.item, entry.type)).join('') : emptyState('当前暂无可展示商品');
      } catch (error) {
        grid.innerHTML = emptyState('商品暂时无法加载，请稍后重试');
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
      const user = info.user || info;
      const shortId = String(user.short_id || info.short_id || info.shortId || '');
      if (!shortId) throw new Error('用户接口未返回 short_id');
      const inviteUrl = 'https://sosks5.com/invite/' + encodeURIComponent(shortId);
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
      const subscribeUrl = sub.subscribe_url || sub.subscribeUrl || sub.url || '';
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
    if (!document.body || $('.mobile-tabbar')) return;
    const active = currentPath === 'shop.html' ? 'shop' : currentPath === 'user.html' ? 'user' : currentPath === 'promo.html' ? 'promo' : 'home';
    const tab = document.createElement('nav');
    tab.className = 'mobile-tabbar';
    tab.setAttribute('aria-label','底部导航');
    tab.innerHTML = '<a class="' + (active === 'home' ? 'active' : '') + '" href="./index.html"><span>⌂</span><small>首页</small></a><a class="' + (active === 'shop' ? 'active' : '') + '" href="./shop.html"><span>▦</span><small>商城</small></a><a class="' + (active === 'promo' ? 'active' : '') + '" href="./promo.html"><span>✧</span><small>引流</small></a><a class="' + (active === 'user' ? 'active' : '') + '" href="./user.html"><span>◉</span><small>我的</small></a>';
    document.body.appendChild(tab);
    const support = document.createElement('a');
    support.className = 'floating-support';
    support.href = 'https://t.me/qingtian_Boss';
    support.target = '_blank'; support.rel = 'noopener noreferrer';
    support.innerHTML = '<span aria-hidden="true">✉</span><small>客服</small>';
    support.setAttribute('aria-label','联系在线客服');
    document.body.appendChild(support);
  }
  function installStyles() {
    installCinematicBackground();
    if ($('#s5-live-styles')) return;
    const style = document.createElement('style');
    style.id = 's5-live-styles';
    style.textContent = '.live-state{grid-column:1/-1;padding:24px 16px;text-align:center;color:var(--muted,#8ca4bf);border:1px solid var(--line,rgba(132,190,230,.17));border-radius:14px;background:rgba(11,23,41,.65)}.live-product-card .product-photo{object-fit:cover}.break-all{overflow-wrap:anywhere;word-break:break-word}.bot-entry{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}.bot-status{color:var(--muted,#8ca4bf)}.mobile-tabbar{display:none}.floating-support{position:fixed;right:16px;bottom:24px;z-index:80;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;width:54px;height:54px;border:1px solid rgba(115,234,255,.4);border-radius:50%;background:#0b2038;color:#73eaff;box-shadow:0 8px 28px #0005;font-size:20px}.floating-support small{font-size:10px}.announcement[hidden]{display:none!important}@media(max-width:650px){body{padding-bottom:76px}.mobile-tabbar{position:fixed;left:0;right:0;bottom:0;z-index:70;display:flex;justify-content:space-around;align-items:center;padding:7px 8px calc(7px + env(safe-area-inset-bottom));min-height:62px;background:rgba(5,13,28,.96);border-top:1px solid var(--line,rgba(132,190,230,.17));backdrop-filter:blur(18px)}.mobile-tabbar a{display:flex;min-width:64px;flex-direction:column;align-items:center;gap:2px;color:var(--muted,#8ca4bf);font-size:19px}.mobile-tabbar a small{font-size:10px}.mobile-tabbar a.active{color:var(--cyan,#73eaff)}.floating-support{bottom:calc(82px + env(safe-area-inset-bottom));right:12px;width:48px;height:48px}.bot-entry{align-items:flex-start;flex-direction:column}.site-footer{padding-bottom:88px!important}}';
    document.head.appendChild(style);
  }

  function installCinematicBackground() {
    if (!document.body || document.getElementById('s5-cinematic-bg')) return;
    const video = document.createElement('video');
    video.id = 's5-cinematic-bg';
    video.setAttribute('autoplay', '');
    video.setAttribute('muted', '');
    video.setAttribute('loop', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('aria-hidden', 'true');
    video.preload = 'metadata';
    video.muted = true;
    video.defaultMuted = true;
    video.src = 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4';
    video.addEventListener('error', () => video.classList.add('video-fallback'), { once: true });
    document.body.prepend(video);
    const style = document.createElement('style');
    style.id = 's5-cinematic-background-style';
    style.textContent = '#s5-cinematic-bg{position:fixed;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;z-index:-2;pointer-events:none;opacity:.34;background:#061326}body:before{content:"";position:fixed;inset:0;z-index:-1;pointer-events:none;background:linear-gradient(180deg,rgba(3,12,29,.76),rgba(4,15,34,.88)),radial-gradient(ellipse at 70% 0%,rgba(24,93,160,.2),transparent 55%)}#s5-cinematic-bg.video-fallback{display:none}body{isolation:isolate}.site-header,.site-footer{background-color:rgba(5,13,28,.72)!important;backdrop-filter:blur(16px)}.panel,.product-card,.business-card,.announcement{backdrop-filter:blur(14px)}@media(max-width:650px){#s5-cinematic-bg{opacity:.22}body:before{background:linear-gradient(180deg,rgba(3,12,29,.82),rgba(4,15,34,.92))}}@media(prefers-reduced-motion:reduce){#s5-cinematic-bg{display:none}}';
    document.head.appendChild(style);
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = navigator.connection && navigator.connection.saveData;
    if (reduce || saveData) { video.removeAttribute('autoplay'); video.pause(); video.style.display = 'none'; return; }
    const play = () => video.play().catch(() => video.classList.add('video-fallback'));
    if (document.visibilityState === 'visible') play();
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && !reduce && !saveData) play();
      else video.pause();
    });
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