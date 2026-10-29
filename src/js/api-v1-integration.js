(function () {
  'use strict';

  // API host can be overridden before this file loads:
  // window.SOSKS5_API_BASE = 'https://your-api-host.example';
  const API_BASE = String(window.SOSKS5_API_BASE || 'https://web.lynli.me').replace(/\/+$/, '');
  const TOKEN_KEYS = ['sosks5_token', 'tgx_token'];
  const USER_KEYS = ['sosks5_user', 'tgx_user'];
  const PAYMENT_IDS = Object.assign({ alipay: 'alipay', usdt: 'usdt' }, window.SOSKS5_PAYMENT_IDS || {});
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
    const response = await fetch(API_BASE + '/api/v1' + path, Object.assign({}, opts, { headers }));
    let body;
    try { body = await response.json(); } catch (_) { body = {}; }
    if (!response.ok) throw new Error((body && (body.message || body.msg || body.error)) || ('请求失败 HTTP ' + response.status));
    if (body && (body.error || (body.status === 'fail'))) throw new Error(body.message || body.msg || body.error || '接口请求失败');
    return body;
  }

  function normalizePlan(raw) {
    const p = Object.assign({}, raw || {});
    p.id = p.id;
    p.title = p.name || p.title || ('套餐 #' + p.id);
    p.name = p.name || p.title;
    p.description = p.content || p.description || p.description_text || '查看套餐规格、有效期和服务说明。';
    const kind = [p.name, p.content, p.tags, p.category, p.type].flat().join(' ').toLowerCase();
    p.category = p.category || (/node|proxy|节点|代理|订阅|vpn|网络/.test(kind) ? '节点服务' : /traffic|引流|增长|推广|群发|机器人|growth/.test(kind) ? '引流服务' : '账号服务');
    const periods = periodOptions(p);
    const prices = periods.map(x => x.price).filter(x => Number.isFinite(x) && x >= 0);
    p.price = prices.length ? Math.min.apply(null, prices) : Number(p.price || p.sale_price || 0);
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
    const periodHtml = periods.map((p, i) => '<option value="' + esc(p.value) + '"' + (i === 0 ? ' selected' : '') + '>' + esc(p.label) + ' · ' + esc((p.price / 100).toFixed(2)) + '</option>').join('');
    showModal('确认购买 · ' + (plan.name || plan.title || '套餐'), '<form id="s5-purchase-form"><label class="block text-sm font-semibold mb-2">套餐周期</label><select id="s5-period" class="w-full rounded-xl border border-slate-200 p-3 mb-4">' + periodHtml + '</select><label class="block text-sm font-semibold mb-2">支付方式</label><div class="grid grid-cols-2 gap-3 mb-5"><label class="flex items-center gap-2 rounded-xl border border-slate-200 p-3 cursor-pointer"><input type="radio" name="s5-payment" value="alipay" checked><span>支付宝</span></label><label class="flex items-center gap-2 rounded-xl border border-slate-200 p-3 cursor-pointer"><input type="radio" name="s5-payment" value="usdt"><span>USDT</span></label></div><button id="s5-create-order" class="w-full rounded-xl bg-blue-600 py-3 font-bold text-white" type="submit">确认支付</button><p class="mt-3 text-xs text-slate-400">订单与支付结果以服务器返回为准。</p></form>');
    $('s5-purchase-form').addEventListener('submit', async (event) => {
      event.preventDefault();
      const button = $('s5-create-order');
      button.disabled = true;
      button.textContent = '正在创建订单…';
      try {
        const paymentChoice = document.querySelector('input[name="s5-payment"]:checked').value;
        const period = $('s5-period').value;
        const orderResponse = await request('/user/order/save', {
          method: 'POST',
          body: JSON.stringify({ plan_id: plan.id, period, payment: PAYMENT_IDS[paymentChoice] })
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

  function install() {
    if (!window.App) return;
    const originalFetchMe = App.fetchMe && App.fetchMe.bind(App);
    App.api = async function (path, opts) {
      const cleanPath = String(path || '');
      if (cleanPath.indexOf('/api/v1/') === 0) return request(cleanPath.replace('/api/v1', ''), opts);
      return request(cleanPath.charAt(0) === '/' ? cleanPath : '/' + cleanPath, opts);
    };
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

    const originalRouter = App.router.bind(App);
    App.router = function () {
      originalRouter();
      if (location.hash === '#/dashboard') setTimeout(addSubscriptionPanel, 0);
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