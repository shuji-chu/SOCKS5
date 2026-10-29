(function () {
  'use strict';

  // API host can be overridden before this file loads:
  // window.SOSKS5_API_BASE = 'https://your-api-host.example';
  const API_BASE = String(window.SOSKS5_API_BASE || 'https://web.lynli.me').replace(/\/+$/, '');
  const TOKEN_KEYS = ['sosks5_token', 'tgx_token'];
  const USER_KEYS = ['sosks5_user', 'tgx_user'];
  let paymentChannels = [];
  const $ = (id) => document.getElementById(id);
  const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const readToken = () => localStorage.getItem('sosks5_token') || localStorage.getItem('tgx_token') || '';
  const unwrap = (r) => r && r.data !== undefined ? r.data : r;
  const isSuccess = (r) => !!r && (r.status === 'success' || r.success === true || r.code === 200 || r.code === 0 || r.data !== undefined || r.ok === true);
  const money = (n) => {
    const v = Number(n);
    return Number.isFinite(v) ? (v / 100).toFixed(2) : '0.00';
  };

  async function request(path, options) {
    const opts = options || {};
    const headers = Object.assign({ Accept: 'application/json', 'Content-Type': 'application/json' }, opts.headers || {});
    const token = readToken();
    if (token) headers.Authorization = 'Bearer ' + token;
    let response;
    try {
      response = await fetch(API_BASE + '/api/v1' + path, Object.assign({}, opts, { headers }));
    } catch (error) {
      throw new Error('接口请求失败，可能是跨域或后端未启动：' + (error && error.message ? error.message : '网络连接失败'));
    }
    let body;
    try { body = await response.json(); } catch (_) { body = {}; }
    if (!response.ok) throw new Error((body && body.message) || ('HTTP ' + response.status + (body && body.msg ? '：' + body.msg : '')));
    if (body && body.status === 'fail') throw new Error(body.message !== undefined ? String(body.message) : '接口返回 status: fail');
    if (body && body.error) throw new Error(body.message !== undefined ? String(body.message) : String(body.error));
    return body;
  }

  function normalizeChannels(config) {
    const d = unwrap(config) || {};
    const candidates = d.payment_methods || d.payments || d.payment || d.pay_method || d.payments_list || d.methods || [];
    const list = Array.isArray(candidates) ? candidates : Object.keys(candidates || {}).map((key) => {
      const v = candidates[key];
      return typeof v === 'object' ? Object.assign({ key }, v) : { key, value: v, name: key };
    });
    paymentChannels = list.map((item) => {
      if (typeof item === 'string') return { value: item, label: item.toLowerCase().includes('usdt') ? 'USDT' : item.toLowerCase().includes('ali') ? '支付宝' : item, enabled: true };
      const key = item.key || item.type || item.name || item.code || item.method || item.value || item.id;
      const label = item.label || item.title || item.name || (String(key).toLowerCase().includes('usdt') ? 'USDT' : String(key).toLowerCase().includes('ali') ? '支付宝' : String(key));
      return { value: item.value !== undefined ? item.value : (item.code !== undefined ? item.code : (item.id !== undefined ? item.id : key)), key: key, label: label, enabled: item.enabled !== false && item.status !== 0 && item.status !== 'disabled' };
    }).filter((x) => x.enabled && x.value !== undefined && x.value !== null && x.value !== '');
    return paymentChannels;
  }

  async function loadConfig() {
    try {
      const config = await request('/config', { method: 'GET' });
      normalizeChannels(config);
    } catch (error) {
      paymentChannels = [];
      console.error('[SOSKS5] /config failed:', error);
      // Do not invent payment IDs; disable checkout choices until backend config is available.
    }
    return paymentChannels;
  }

  function normalizePlan(raw) {
    const p = Object.assign({}, raw || {});
    p.id = p.id;
    p.title = p.name || p.title || ('套餐 #' + p.id);
    p.name = p.name || p.title;
    p.description = p.content || p.description || p.description_text || '查看套餐规格、有效期和服务说明。';
    const kind = [p.name, p.content, p.tags, p.category, p.product_type, p.type].flat().join(' ').toLowerCase();
    p.protocol = p.protocol || p.node_protocol || '';
    p.protocols = Array.isArray(p.protocols) ? p.protocols : (p.protocol ? [p.protocol] : []);
    const productKind = String(p.product_type || p.product_category || p.service_type || '').toLowerCase();
    p.category = p.category || (/traffic|引流|增长|推广|群发|机器人|growth/.test(productKind + ' ' + kind) ? '引流服务' : /node|proxy|节点|代理|订阅|vpn|网络/.test(productKind + ' ' + kind) ? '节点服务' : '账号服务');
    const periods = periodOptions(p);
    const prices = periods.map(x => x.price).filter(x => Number.isFinite(x) && x >= 0);
    p.price = prices.length ? Math.min.apply(null, prices) / 100 : Number(p.price || p.sale_price || 0);
    p.stock = p.stock === undefined ? (p.available === false ? 0 : 1) : Number(p.stock);
    p._rawPlan = raw;
    return p;
  }

  function periodOptions(plan) {
    const keys = [
      ['month_price', '月付', 'month_price'],
      ['quarter_price', '季付', 'quarter_price'],
      ['half_year_price', '半年付', 'half_year_price'],
      ['year_price', '年付', 'year_price'],
      ['two_year_price', '两年付', 'two_year_price'],
      ['three_year_price', '三年付', 'three_year_price'],
      ['onetime_price', '一次性', 'onetime_price'],
      ['reset_price', '重置流量', 'reset_price']
    ];
    const out = keys.filter(([key]) => plan && plan[key] !== null && plan[key] !== undefined && plan[key] !== '' && Number(plan[key]) >= 0)
      .map(([key, label, value]) => ({ key, label, value, price: Number(plan[key]) }));
    if (!out.length && plan && plan.price !== undefined) out.push({ key: 'month_price', label: '默认套餐', value: 'month_price', price: Number(plan.price) });
    return out;
  }

  function showError(message) {
    if (window.App && typeof App.showToast === 'function') App.showToast(message || '操作失败', 'bg-red-600');
    else window.alert(message || '操作失败');
  }

  function showModal(title, html) {
    const overlay = $('modal-overlay');
    const content = $('modal-content');
    if (!overlay || !content) return;
    content.innerHTML = '<h2 class="text-xl font-bold text-slate-900 mb-4">' + esc(title) + '</h2>' + html;
    overlay.classList.remove('hidden');
  }

  function saveToken(token) {
    TOKEN_KEYS.forEach((key) => localStorage.setItem(key, token));
    if (window.App) App.state.token = token;
  }

  function saveUser(user) {
    const u = Object.assign({}, user || {});
    // API balance is in cents; UI balance is displayed in currency units.
    if (u.balance !== undefined) u.balance = Number(u.balance) / 100;
    USER_KEYS.forEach((key) => localStorage.setItem(key, JSON.stringify(u)));
    if (window.App) App.state.user = u;
    return u;
  }

  async function fetchUserInfo() {
    if (!readToken()) return null;
    const response = await request('/user/info', { method: 'GET' });
    const data = unwrap(response);
    if (!data || !data.email) throw new Error('登录状态无效，请重新登录');
    const user = saveUser(data);
    if (window.App) App.renderNav();
    return user;
  }

  function setUserNav() {
    if (!window.App) return;
    App.renderNav();
    const area = $('nav-user-area');
    if (area && App.state.user) {
      const email = App.state.user.email || App.state.user.username || '已登录';
      area.querySelectorAll('span').forEach((span) => {
        if (span.textContent.trim() === (App.state.user.nickname || App.state.user.username || 'User')) {
          span.textContent = email;
          span.classList.remove('hidden');
        }
      });
      const balance = Number(App.state.user.balance || 0);
      let info = area.querySelector('[data-s5-user-balance]');
      if (!info) {
        info = document.createElement('span');
        info.setAttribute('data-s5-user-balance', '1');
        info.className = 'text-xs font-semibold text-emerald-600 whitespace-nowrap';
        area.insertBefore(info, area.firstChild);
      }
      info.textContent = '余额 ¥' + balance.toFixed(2);
    }
  }

  function renderSubscription(data) {
    const box = $('s5-subscription-box');
    if (!box) return;
    const url = data && (data.subscribe_url || data.subscribeUrl || data.url) || '';
    const yaml = data && (data.config_yaml || data.yaml || data.config) || '';
    box.innerHTML = '<div class="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">' +
      '<div class="mb-4"><h2 class="text-lg font-bold text-slate-900">我的订阅</h2><p class="text-sm text-slate-500 mt-1">请勿公开分享您的个人订阅链接或配置内容。</p></div>' +
      '<label class="block text-xs font-semibold text-slate-500 mb-2">订阅链接</label><div class="flex gap-2 mb-5"><textarea id="s5-subscribe-url" readonly class="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-mono break-all" rows="2">' + esc(url) + '</textarea><button type="button" data-copy-target="s5-subscribe-url" class="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white">复制链接</button></div>' +
      '<label class="block text-xs font-semibold text-slate-500 mb-2">配置 YAML</label><textarea id="s5-config-yaml" readonly class="w-full rounded-xl border border-slate-200 bg-slate-950 p-4 text-xs leading-6 text-emerald-200 font-mono" rows="10">' + esc(yaml) + '</textarea><div class="mt-3 flex justify-end"><button type="button" data-copy-target="s5-config-yaml" class="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700">一键复制配置</button></div></div>';
  }

  async function loadSubscription() {
    const box = $('s5-subscription-box');
    if (!box) return;
    if (!readToken()) {
      box.innerHTML = '<div class="mt-8 rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500">登录后可查看订阅链接与配置。</div>';
      return;
    }
    box.innerHTML = '<div class="mt-8 rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500">正在加载订阅信息…</div>';
    try {
      const data = unwrap(await request('/user/getSubscribe', { method: 'GET' }));
      renderSubscription(data || {});
    } catch (e) {
      box.innerHTML = '<div class="mt-8 rounded-xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">' + esc(e.message) + '</div>';
    }
  }

  function addSubscriptionPanel() {
    const view = $('app-view');
    if (!view || location.hash !== '#/dashboard') return;
    if (!$('s5-subscription-box')) {
      const box = document.createElement('div');
      box.id = 's5-subscription-box';
      view.appendChild(box);
    }
    loadSubscription();
  }

  function protocolOptions(plan) {
    const supported = ['VLESS', 'VMess', 'Hysteria2', 'TROJAN'];
    const provided = (plan.protocols || []).map(x => String(x).toUpperCase());
    const options = provided.length ? supported.filter(x => provided.includes(x.toUpperCase())) : supported;
    const current = String(plan.protocol || '').toUpperCase();
    return options.map(x => '<option value="' + esc(x.toLowerCase()) + '"' + (current === x.toUpperCase() ? ' selected' : '') + '>' + esc(x) + '</option>').join('');
  }

  function openPurchase(plan) {
    if (!readToken()) {
      showModal('登录后购买', '<p class="text-sm text-slate-500 mb-4">请先登录后再继续购买。</p><button type="button" id="s5-purchase-login" class="w-full rounded-xl bg-blue-600 py-3 font-bold text-white">前往登录</button>');
      $('s5-purchase-login').onclick = () => { if (window.App) App.openModal('login'); };
      return;
    }
    const periods = periodOptions(plan._rawPlan || plan);
    if (!periods.length) {
      showError('该套餐没有可购买的周期价格');
      return;
    }
    if (!paymentChannels.length) {
      showError('暂时无法获取支付通道配置，请稍后重试。');
      loadConfig();
      return;
    }
    const periodHtml = periods.map((p, i) => '<option value="' + esc(p.value) + '"' + (i === 0 ? ' selected' : '') + '>' + esc(p.label) + ' · ' + esc((p.price / 100).toFixed(2)) + '</option>').join('');
    const paymentHtml = paymentChannels.map((p, i) => '<label class="flex items-center gap-2 rounded-xl border border-slate-200 p-3 cursor-pointer"><input type="radio" name="s5-payment" value="' + esc(i) + '"' + (i === 0 ? ' checked' : '') + '><span>' + esc(p.label) + '</span></label>').join('');
    showModal('确认购买 · ' + (plan.name || plan.title || '套餐'), '<form id="s5-purchase-form"><label class="block text-sm font-semibold mb-2">套餐周期</label><select id="s5-period" class="w-full rounded-xl border border-slate-200 p-3 mb-4">' + periodHtml + '</select><label class="block text-sm font-semibold mb-2">开通协议</label><select id="s5-protocol" name="protocol" class="w-full rounded-xl border border-slate-200 p-3 mb-4">' + protocolOptions(plan) + '</select><label class="block text-sm font-semibold mb-2">支付方式</label><div class="grid grid-cols-2 gap-3 mb-5">' + paymentHtml + '</div><button id="s5-create-order" class="w-full rounded-xl bg-blue-600 py-3 font-bold text-white" type="submit">确认支付</button><p class="mt-3 text-xs text-slate-400">支付方式来自服务器配置。</p></form>');
    $('s5-purchase-form').addEventListener('submit', async (event) => {
      event.preventDefault();
      const button = $('s5-create-order');
      button.disabled = true;
      button.textContent = '正在创建订单…';
      try {
        const paymentIndex = Number(document.querySelector('input[name="s5-payment"]:checked').value);
        const paymentChoice = paymentChannels[paymentIndex];
        if (!paymentChoice) throw new Error('请选择有效支付方式');
        const period = $('s5-period').value;
        const orderResponse = await request('/user/order/save', {
          method: 'POST',
          body: JSON.stringify({ plan_id: plan.id, period, payment: paymentChoice.value, protocol: $('s5-protocol').value })
        });
        const order = unwrap(orderResponse) || {};
        const tradeNo = order.trade_no || order.tradeNo || order.order_no || order.orderNo;
        if (!tradeNo) throw new Error(order.message || '订单已提交，但接口没有返回 trade_no');
        button.textContent = '正在获取支付方式…';
        const checkoutResponse = await request('/user/order/checkout', {
          method: 'POST',
          body: JSON.stringify({ trade_no: tradeNo })
        });
        const checkout = unwrap(checkoutResponse) || {};
        const payUrl = checkout.url || checkout.pay_url || checkout.payment_url || checkout.checkout_url || '';
        const qr = checkout.qrcode || checkout.qr_code || checkout.qrCode || checkout.qr_url || '';
        const html = '<div class="rounded-xl border border-slate-200 bg-slate-50 p-4"><p class="text-sm text-slate-500 mb-1">订单号</p><p class="font-mono font-bold text-slate-900 break-all">' + esc(tradeNo) + '</p></div>' +
          (qr ? '<div class="mt-4 text-center"><p class="mb-2 text-sm font-semibold">扫码支付</p><img alt="支付二维码" class="mx-auto max-h-64 rounded-xl border border-slate-200 bg-white p-2" src="' + esc(/^https?:\/\//i.test(qr) ? qr : '') + '"><p class="mt-2 break-all text-xs text-slate-500">' + esc(qr) + '</p></div>' : '') +
          (payUrl ? '<a class="mt-4 block w-full rounded-xl bg-blue-600 py-3 text-center font-bold text-white" href="' + esc(payUrl) + '" target="_blank" rel="noopener noreferrer">打开支付页面</a>' : '<p class="mt-4 text-sm text-amber-700">服务器已返回结账结果，但未识别到支付链接。请查看下方原始返回。</p>') +
          '<details class="mt-4"><summary class="cursor-pointer text-xs text-slate-500">支付接口返回</summary><pre class="mt-2 overflow-auto rounded-lg bg-slate-950 p-3 text-xs text-emerald-200">' + esc(JSON.stringify(checkout, null, 2)) + '</pre></details>';
        showModal('订单已创建', html);
      } catch (e) {
        showError(e.message || '创建订单失败');
        button.disabled = false;
        button.textContent = '重试';
      }
    });
  }

  async function loadClonedProducts() {
    const box = $('s5-cloned-products');
    if (!box) return;
    try {
      const response = await request('/user/cloned_products', { method: 'GET' });
      const data = unwrap(response);
      const products = Array.isArray(data) ? data : (data && (data.list || data.products || data.data)) || [];
      box.innerHTML = '<h2>克隆商城</h2><div class="s5-clone-grid">' + (products.length ? products.map((p) => '<article class="s5-clone-card">' + (p.image_url ? '<img loading="lazy" src="' + esc(p.image_url) + '" alt="' + esc(p.name || '商品') + '">' : '') + '<h3>' + esc(p.name || '未命名商品') + '</h3><p>' + esc(p.description || '') + '</p><strong>¥' + (Number(p.price || 0) / 100).toFixed(2) + '</strong></article>').join('') : '<p>暂无克隆商品。</p>') + '</div>';
    } catch (error) {
      box.innerHTML = '<h2>克隆商城</h2><div class="s5-clone-grid"><div class="s5-skeleton">商品服务暂不可用</div><div class="s5-skeleton">商品服务暂不可用</div><div class="s5-skeleton">商品服务暂不可用</div></div><p class="s5-clone-error">' + esc(error.message) + '</p>';
    }
  }

  function install() {
    if (!window.App) return;
    const originalFetchMe = App.fetchMe && App.fetchMe.bind(App);
    App.fetchMe = async function () {
      try { await fetchUserInfo(); setUserNav(); }
      catch (e) { TOKEN_KEYS.forEach((key) => localStorage.removeItem(key)); USER_KEYS.forEach((key) => localStorage.removeItem(key)); this.state.token = null; this.state.user = null; this.renderNav(); }
    };
    App.loadProducts = async function () {
      try {
        const response = await request('/user/plan/fetch', { method: 'GET' });
        const data = unwrap(response);
        const plans = Array.isArray(data) ? data : (data && (data.list || data.plans || data.data)) || [];
        this.state.products = plans.map(normalizePlan);
        this.router();
      } catch (e) {
        console.error('[SOSKS5] plan/fetch failed:', e);
        this.state.products = [];
        this.router();
      }
    };
    App.doLogin = async function () {
      const email = $('login-email') && $('login-email').value.trim();
      const password = $('login-pass') && $('login-pass').value;
      if (!email || !password) return showError('请输入邮箱和密码');
      const button = document.querySelector('#modal-content button[onclick="App.doLogin()"]');
      if (button) { button.disabled = true; button.textContent = '登录中…'; }
      try {
        const response = await request('/passport/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
        const data = unwrap(response) || {};
        const token = data.token || data.auth_data || data.access_token;
        if (!token) throw new Error(data.message || '登录接口未返回 token');
        saveToken(token);
        try { await fetchUserInfo(); } catch (_) { if (data.user) saveUser(data.user); }
        if (window.App) { App.closeModal(); setUserNav(); App.router(); }
        if (typeof App.showToast === 'function') App.showToast('登录成功');
      } catch (e) {
        showError(e.message || '登录失败');
        if (button) { button.disabled = false; button.textContent = 'Sign In'; }
      }
    };

    const oldDashboard = App.views.dashboard;
    App.views.dashboard = function () {
      const original = oldDashboard.call(this);
      return original + '<div id="s5-subscription-box"></div>';
    };


  function renderPlanPage(kind) {
    const all = (App.state.products || []).map(normalizePlan);
    const matches = all.filter((p) => {
      const text = [p.category, p.title, p.name, p.description, p.product_type].join(' ').toLowerCase();
      const productKind = String(p.product_type || p.product_category || '').toLowerCase();
      if (kind === 'nodes') return productKind === 'node' || /node|proxy|节点|代理|订阅|vpn|网络/.test(text);
      if (kind === 'traffic') return productKind === 'traffic' || /traffic|引流|增长|推广|群发|机器人|growth/.test(text);
      return productKind !== 'node' && productKind !== 'traffic' && !/node|proxy|节点|代理|订阅|vpn|网络|traffic|引流|增长|推广|群发|机器人|growth/.test(text);
    });
    const title = kind === 'nodes' ? '节点中心' : kind === 'traffic' ? '引流系统' : '账号商城';
    const subtitle = kind === 'nodes' ? '节点套餐与网络服务' : kind === 'traffic' ? '引流与增长服务套餐' : '账号与数字服务套餐';
    const cards = matches.length ? matches.map((p) => {
      const periods = periodOptions(p._rawPlan || p);
      const price = periods.length ? Math.min.apply(null, periods.map((x) => x.price)) / 100 : Number(p.price || 0);
      const sold = Number(p.stock) <= 0;
      return '<article class="s5-glass-card s5-product-card"><div class="s5-product-top"><div class="s5-product-symbol">◈</div><span class="s5-product-category">' + esc(p.category || title) + '</span></div><h3>' + esc(p.name || p.title) + '</h3><p class="s5-product-desc">' + esc(p.content || p.description || '套餐规格与有效期以服务端信息为准。') + '</p><div class="s5-product-bottom"><div><small>起售价</small><strong>¥' + price.toFixed(2) + '</strong></div><button type="button" class="s5-small-cta" data-product-id="' + esc(p.id) + '"' + (sold ? ' disabled' : '') + '>' + (sold ? '暂不可购' : '立即购买') + '</button></div></article>';
    }).join('') : '<div class="s5-empty-state">该分类暂无可购买套餐。套餐目录由服务端实时提供，请稍后刷新。</div>';
    const docs = '<footer class="s5-developer-docs"><a href="#" aria-label="开发者文档">开发者文档（即将上线）</a></footer>';
    const clonePanel = kind === 'traffic' ? '<section id="s5-cloned-products" class="s5-clone-products"><h2>克隆商城</h2><div class="s5-clone-grid"><div class="s5-skeleton">正在加载商品…</div><div class="s5-skeleton">正在加载商品…</div><div class="s5-skeleton">正在加载商品…</div></div></section>' : '';
    return '<section class="s5-subpage-hero"><div class="s5-subpage-copy"><span class="s5-section-label">LIVE SERVICE CATALOG</span><h1>' + title + '</h1><p>' + subtitle + ' · 套餐、价格与可购买状态来自实时接口。</p></div></section><section class="s5-subpage-content"><div class="s5-section-heading"><div><span class="s5-section-label">AVAILABLE PLANS</span><h2>' + title + '套餐</h2><p>下单前请确认套餐周期、价格与支付方式。</p></div></div><div class="s5-product-grid">' + cards + '</div></section>' + clonePanel + docs;
  }

    const originalRouter = App.router.bind(App);
    App.router = function () {
      originalRouter();
      const hash = location.hash || '#/';
      if (hash === '#/products' || hash === '#/nodes' || hash === '#/traffic') {
        const kind = hash === '#/nodes' ? 'nodes' : hash === '#/traffic' ? 'traffic' : 'products';
        const view = $('app-view');
        if (view) view.innerHTML = renderPlanPage(kind);
      }
      if (hash === '#/dashboard') setTimeout(addSubscriptionPanel, 0);
      if (hash === '#/traffic') setTimeout(loadClonedProducts, 0);
    };

    // Purchase buttons from the redesigned product cards take over the legacy cart flow.
    document.addEventListener('click', function (event) {
      const button = event.target.closest('[data-product-id]');
      if (button) {
        event.preventDefault();
        event.stopImmediatePropagation();
        const id = decodeURIComponent(button.getAttribute('data-product-id') || '');
        const plan = (App.state.products || []).find((item) => String(item.id) === String(id));
        if (plan) openPurchase(plan);
      }
      const copyButton = event.target.closest('[data-copy-target]');
      if (copyButton) {
        const target = $(copyButton.getAttribute('data-copy-target'));
        if (target) {
          target.select();
          const text = target.value;
          if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(() => App.showToast('复制成功')).catch(() => fallbackCopy(text));
          else fallbackCopy(text);
        }
      }
    }, true);

    function fallbackCopy(text) {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); App.showToast('复制成功'); } catch (_) { showError('复制失败，请手动复制'); }
      ta.remove();
    }

    // Load payment-channel configuration before purchases; also verify session.
    loadConfig();
    // Restore and verify session on every page load.
    if (readToken()) fetchUserInfo().then(setUserNav).catch(() => {
      TOKEN_KEYS.forEach((key) => localStorage.removeItem(key));
      USER_KEYS.forEach((key) => localStorage.removeItem(key));
      App.state.token = null; App.state.user = null; App.renderNav();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(install, 0));
  } else {
    setTimeout(install, 0);
  }
})();