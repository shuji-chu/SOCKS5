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
    if (!response.ok) throw new Error((body && (body.message || body.msg || body.detail || body.error)) || ('HTTP ' + response.status));
    if (body && (body.status === 'fail' || body.success === false || (typeof body.code === 'number' && body.code !== 200 && body.code !== 0 && body.data === undefined))) throw new Error(String(body.message || body.msg || body.detail || body.error || '请求未成功'));
    if (body && body.error) throw new Error(String(body.message || body.msg || body.error));
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
    p.protocol = p.protocol || p.node_protocol || (/^(vless|vmess|hysteria2|trojan)$/i.test(String(p.type || '')) ? p.type : '');
    p.protocols = Array.isArray(p.protocols) ? p.protocols : (p.protocol ? [p.protocol] : []);
    const productKind = String(p.product_type || p.product_category || p.service_type || '').toLowerCase();
    p.category = p.category || (/traffic|引流|增长|推广|群发|机器人|growth/.test(productKind + ' ' + kind) ? '引流服务' : /node|proxy|节点|代理|订阅|vpn|网络|vless|vmess|hysteria2|trojan/.test(productKind + ' ' + kind) ? '节点服务' : '账号服务');
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
    showModal('确认购买 · ' + (plan.name || plan.title || '套餐'), '<form id="s5-purchase-form"><label class="block text-sm font-semibold mb-2">优惠码（待后端接入）</label><div class="flex gap-2 mb-2"><input id="s5-coupon-code" class="w-full rounded-xl border border-slate-200 p-3" placeholder="输入优惠码（暂不参与计价）"><button type="button" id="s5-coupon-verify" class="rounded-xl border border-slate-300 px-3 text-sm">验证</button></div><p id="s5-coupon-status" class="text-xs text-amber-600 mb-4">优惠码校验接口待后端接入；此处不会修改价格。</p><label class="block text-sm font-semibold mb-2">套餐周期</label><select id="s5-period" class="w-full rounded-xl border border-slate-200 p-3 mb-4">' + periodHtml + '</select><label class="block text-sm font-semibold mb-2">开通协议</label><select id="s5-protocol" name="protocol" class="w-full rounded-xl border border-slate-200 p-3 mb-4">' + protocolOptions(plan) + '</select><label class="block text-sm font-semibold mb-2">支付方式</label><div class="grid grid-cols-2 gap-3 mb-5">' + paymentHtml + '</div><button id="s5-create-order" class="w-full rounded-xl bg-blue-600 py-3 font-bold text-white" type="submit">确认支付</button><p class="mt-3 text-xs text-slate-400">支付方式来自服务器配置。</p></form>');
    $('s5-coupon-verify').addEventListener('click', () => { $('s5-coupon-status').textContent = $('s5-coupon-code').value.trim() ? '待后端接入：优惠码尚未校验，金额未改变。' : '请先输入优惠码；校验接口待后端接入。'; });
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
        const tradeNo = (typeof order === 'string' ? order : '') || order.trade_no || order.tradeNo || order.order_no || order.orderNo;
        if (!tradeNo) throw new Error(order.message || '订单已提交，但接口没有返回 trade_no');
        button.textContent = '正在获取支付方式…';
        const checkoutResponse = await request('/user/order/checkout', {
          method: 'POST',
          body: JSON.stringify({ trade_no: tradeNo })
        });
        const checkout = unwrap(checkoutResponse) || {};
        const payUrl = (typeof checkout === 'string' ? checkout : '') || checkout.url || checkout.pay_url || checkout.payment_url || checkout.checkout_url || '';
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

  function cloneMoney(p) {
    const hasYuanPrice = p.price_yuan != null;
    const raw = Number(hasYuanPrice ? p.price_yuan : (p.price_cents ?? p.price_amount ?? p.price ?? p.amount ?? p.sale_price ?? 0));
    if (!Number.isFinite(raw)) return "价格以客服确认为准";
    const yuan = hasYuanPrice ? raw : raw / 100;
    return "¥" + yuan.toFixed(2);
  }

  function renderCloneModal(p) {
    const title = p.name || p.title || p.product_name || "数字商品";
    const image = p.image_url || p.image || p.cover_url || p.thumbnail || p.oss_url || "";
    const description = p.detail_description || p.details || p.content_zh || p.description_zh || p.chinese_description || p.description_cn || p.content || p.description || p.introduction || "暂未提供详细说明，请联系客服了解商品规格、交付方式与适用范围。";
    showModal("商品详情", '<div class="s5-clone-detail">' +
      (image ? '<img class="s5-clone-detail-image" src="' + esc(image) + '" alt="' + esc(title) + '">' : "") +
      '<h3>' + esc(title) + '</h3><p>' + esc(description) + '</p><div class="s5-clone-detail-price">' + esc(cloneMoney(p)) + '</div>' +
      '<a class="s5-clone-buy" href="https://t.me/qingtian_Boss" target="_blank" rel="noopener noreferrer">立即购买 / 联系客服</a></div>');
  }

  async function loadClonedProducts() {
    const box = $("s5-cloned-products");
    if (!box || box.dataset.loaded === "1") return;
    box.dataset.loaded = "1";
    try {
      box.innerHTML = '<div class="s5-clone-heading"><div><h2>海外精选数字商品</h2><p class="s5-clone-intro">正在同步商品目录，请稍候…</p></div></div><div class="s5-clone-grid"><div class="s5-skeleton">正在加载</div><div class="s5-skeleton">正在加载</div><div class="s5-skeleton">正在加载</div></div>';
      const response = await request("/user/cloned_products", { method: "GET" });
      const data = unwrap(response);
      const products = Array.isArray(data) ? data : (data && (data.list || data.products || data.items || data.data)) || [];
      box._cloneProducts = products;
      box.innerHTML = '<div class="s5-clone-heading"><div><span class="s5-section-label">全球精选</span><h2>海外精选数字商品</h2><p class="s5-clone-intro">精选数字商品 · 中文商品说明 · 价格以商品详情为准</p></div><span class="s5-clone-count">' + products.length + ' 件商品</span></div>' +
        (products.length ? '<div class="s5-clone-grid">' + products.map((p, index) => {
          const title = p.name || p.title || p.product_name || "数字商品 " + (index + 1);
          const image = p.image_url || p.image || p.cover_url || p.thumbnail || p.oss_url || "";
          const desc = p.description_zh || p.chinese_description || p.description_cn || p.summary_zh || p.description || p.summary || "查看商品详情，了解规格、交付方式与适用范围。";
          return '<button type="button" class="s5-clone-card" data-clone-index="' + index + '">' +
            (image ? '<img loading="lazy" src="' + esc(image) + '" alt="' + esc(title) + '" class="s5-clone-image">' : '<span class="s5-clone-image s5-clone-image-empty">全球精选</span>') +
            '<span class="s5-clone-card-body"><span class="s5-clone-name">' + esc(title) + '</span><span class="s5-clone-desc">' + esc(desc) + '</span><span class="s5-clone-card-foot"><strong>' + esc(cloneMoney(p)) + '</strong><span>查看详情 ↗</span></span></span></button>';
        }).join("") + '</div>' : '<div class="s5-clone-empty">当前暂无已发布商品，请稍后再来查看。</div>');
      box.querySelectorAll("[data-clone-index]").forEach((card) => card.addEventListener("click", () => {
        const p = box._cloneProducts[Number(card.getAttribute("data-clone-index"))];
        if (p) renderCloneModal(p);
      }));
    } catch (error) {
      box.dataset.loaded = "0";
      box.innerHTML = '<div class="s5-clone-heading"><div><h2>海外精选数字商品</h2><p class="s5-clone-intro">商品目录暂时无法读取，请稍后重试。</p></div></div><button type="button" class="s5-clone-retry">重新加载</button>';
      box.querySelector(".s5-clone-retry")?.addEventListener("click", loadClonedProducts);
      console.warn("[SOSKS5] cloned_products 请求失败：", error);
    }
  }

  // Growth APIs: contracts agreed for future backend implementation.
  // These functions call real endpoints and deliberately do not fabricate fallback data.
  async function validateCoupon(payload) {
    return request('/user/coupon/validate', { method: 'POST', body: JSON.stringify({
      code: String(payload && payload.code || '').trim(),
      plan_id: Number(payload && payload.plan_id),
      period: String(payload && payload.period || ''),
      ...(payload && payload.protocol ? { protocol: String(payload.protocol) } : {})
    }) });
  }
  async function drawBlindbox() {
    return request('/user/blindbox/draw', { method: 'POST', body: JSON.stringify({}) });
  }
  async function getReferralLeaderboard(options) {
    const opts = options || {};
    const qs = new URLSearchParams();
    qs.set('period', String(opts.period || 'month'));
    qs.set('limit', String(Math.min(10, Math.max(1, Number(opts.limit) || 10))));
    return request('/user/referrals/leaderboard?' + qs.toString(), { method: 'GET' });
  }
  async function getAnnouncements(options) {
    const placement = String(options && options.placement || 'marquee');
    return request('/user/announcements?placement=' + encodeURIComponent(placement), { method: 'GET' });
  }

  window.S5Api = {
    request: request,
    unwrap: unwrap,
    readToken: readToken,
    validateCoupon: validateCoupon,
    drawBlindbox: drawBlindbox,
    getReferralLeaderboard: getReferralLeaderboard,
    getAnnouncements: getAnnouncements
  };

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
    App.sendCode = async function () {
      const email = $('reg-email') && $('reg-email').value.trim();
      if (!email || !email.includes('@')) return showError('请输入有效邮箱');
      const button = $('btn-send-code');
      if (button) { button.disabled = true; button.textContent = '发送中…'; }
      try {
        await request('/passport/auth/send-code', { method: 'POST', body: JSON.stringify({ email }) });
        if (typeof App.showToast === 'function') App.showToast('验证码已发送');
        let seconds = 60;
        if (button) button.textContent = seconds + 's';
        const timer = setInterval(() => {
          seconds--;
          if (button) button.textContent = seconds > 0 ? seconds + 's' : '获取验证码';
          if (seconds <= 0) { clearInterval(timer); if (button) button.disabled = false; }
        }, 1000);
      } catch (e) {
        showError(e.message || '验证码发送失败');
        if (button) { button.disabled = false; button.textContent = '获取验证码'; }
      }
    };

    App.doRegister = async function () {
      const email = $('reg-email') && $('reg-email').value.trim();
      const code = $('reg-code') && $('reg-code').value.trim();
      const password = $('reg-pass') && $('reg-pass').value;
      const params = new URLSearchParams(location.search);
      const inviteCode = (params.get('invite_code') || params.get('invite') || '').trim().toUpperCase();
      if (!email || !code || !password) return showError('请填写邮箱、验证码和密码');
      try {
        const response = await request('/passport/auth/register', { method: 'POST', body: JSON.stringify({ email, code, password, invite_code: inviteCode }) });
        const data = unwrap(response) || {};
        const token = data.token || data.auth_data || data.access_token;
        if (!token) throw new Error('注册接口未返回登录凭证');
        saveToken(token);
        if (data.user) saveUser(data.user);
        try { await fetchUserInfo(); } catch (_) {}
        App.closeModal(); setUserNav(); App.router();
        if (typeof App.showToast === 'function') App.showToast(inviteCode ? '注册成功，已提交邀请码' : '注册成功');
      } catch (e) { showError(e.message || '注册失败'); }
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


    // Premium glassmorphism auth experience. Auth requests remain wired to the real /api/v1 endpoints above.
    (function installAuthExperience() {
      if (!$('s5-auth-style')) {
        const style = document.createElement('style');
        style.id = 's5-auth-style';
        style.textContent = `
          #modal-overlay.s5-auth-overlay{background:radial-gradient(ellipse at 15% 15%,#164e8a66,transparent 42%),rgba(2,8,23,.82);backdrop-filter:blur(16px);padding:18px;overflow:auto}
          #modal-overlay.s5-auth-overlay>div{max-width:960px!important;width:min(960px,100%)!important;padding:0!important;background:transparent!important;border:0!important;box-shadow:none!important;border-radius:28px!important}
          #modal-overlay.s5-auth-overlay>div>button:first-child{z-index:5;top:18px;right:18px;color:#a9c7e8;font-size:28px}
          .s5-auth-shell{display:grid;grid-template-columns:1.02fr .98fr;min-height:600px;overflow:hidden;border:1px solid #8ecaff38;border-radius:28px;background:linear-gradient(135deg,#0a1a31f5,#071326f7);box-shadow:0 35px 110px #0009,0 0 50px #1e8aff22;color:#eaf5ff}
          .s5-auth-visual{position:relative;isolation:isolate;display:flex;flex-direction:column;justify-content:space-between;padding:42px 36px;overflow:hidden;background:radial-gradient(ellipse at 25% 25%,#165c9b77,transparent 42%),linear-gradient(150deg,#0d2b4b,#071426 70%)}
          .s5-auth-visual:before,.s5-auth-visual:after{content:"";position:absolute;inset:-30%;z-index:-1;pointer-events:none;background-image:radial-gradient(2px 2px at 15% 20%,#d9f5ff 50%,transparent 100%),radial-gradient(1px 1px at 68% 25%,#fff 50%,transparent 100%),radial-gradient(2px 2px at 42% 65%,#a6e6ff 50%,transparent 100%),radial-gradient(1px 1px at 85% 78%,#fff 50%,transparent 100%),radial-gradient(1px 1px at 25% 88%,#8bd7ff 50%,transparent 100%);background-size:260px 220px;animation:s5StarDrift 36s linear infinite;opacity:.8}
          .s5-auth-visual:after{filter:blur(1px);opacity:.35;transform:scale(1.35);animation-duration:58s}
          @keyframes s5StarDrift{from{transform:translate3d(0,0,0)}to{transform:translate3d(-70px,45px,0)}}
          .s5-auth-logo{display:flex;align-items:center;gap:12px;font-weight:850;letter-spacing:.5px}.s5-auth-logo-mark{display:grid;place-items:center;width:42px;height:42px;border-radius:14px;background:linear-gradient(135deg,#60d8ff,#3975ff);box-shadow:0 0 32px #37baff55;color:#061326;font-size:21px}
          .s5-auth-kicker{color:#6de2ff;font-size:10px;letter-spacing:3px;font-weight:800}.s5-auth-headline{font-size:clamp(28px,3vw,39px);line-height:1.12;letter-spacing:-1px;font-weight:850;margin:16px 0}.s5-auth-copy{max-width:350px;color:#9db9d8;line-height:1.8;font-size:13px}.s5-auth-orbit{position:absolute;width:270px;height:270px;border:1px solid #64caff35;border-radius:50%;right:-95px;bottom:72px;box-shadow:0 0 60px #268dff18,inset 0 0 60px #268dff12}.s5-auth-orbit:before,.s5-auth-orbit:after{content:"";position:absolute;border:1px solid #64caff28;border-radius:50%;inset:26px}.s5-auth-orbit:after{inset:55px}.s5-auth-side-note{font-size:10px;color:#6485a9;letter-spacing:1.4px}
          .s5-auth-formpane{padding:52px 42px 38px;display:flex;flex-direction:column;justify-content:center;background:linear-gradient(145deg,#0a192bf2,#071222f8);backdrop-filter:blur(22px)}.s5-auth-formpane h2{font-size:27px;font-weight:850;letter-spacing:-.6px;color:#f4f9ff;margin:7px 0}.s5-auth-muted{font-size:12px;line-height:1.7;color:#8da9c8}.s5-auth-field{display:block;margin-top:17px}.s5-auth-field>span{display:block;font-size:11px;color:#b7cce3;font-weight:700;margin-bottom:8px}.s5-auth-input{display:block;width:100%;box-sizing:border-box;border:1px solid #244666;border-radius:12px;background:#071426b8;color:#eff8ff;padding:13px 14px;outline:none;transition:border-color .2s,box-shadow .2s,background .2s;font-size:13px}.s5-auth-input::placeholder{color:#54708f}.s5-auth-input:focus{border-color:#4acbff;background:#081a30;box-shadow:0 0 0 3px #29baff20,0 0 24px #24aaff20}.s5-auth-primary{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;margin-top:23px;border:1px solid #7ce7ff44;border-radius:12px;padding:14px;background:linear-gradient(105deg,#1678d5,#3d65ff 58%,#6b58ed);box-shadow:0 12px 28px #1b72ee30;color:#fff;font-weight:800;transition:filter .2s,transform .2s}.s5-auth-primary:hover{filter:brightness(1.12);transform:translateY(-1px)}.s5-auth-primary:disabled{opacity:.65;cursor:wait;transform:none}.s5-auth-spinner{width:15px;height:15px;border:2px solid #ffffff66;border-top-color:#fff;border-radius:50%;animation:s5AuthSpin .7s linear infinite}@keyframes s5AuthSpin{to{transform:rotate(360deg)}}.s5-auth-switch{text-align:center;margin-top:20px;color:#7e9bbd;font-size:12px}.s5-auth-switch button{color:#65d9ff;font-weight:800;margin-left:5px}.s5-auth-code-row{display:grid;grid-template-columns:1fr auto;gap:8px}.s5-auth-code-btn{align-self:end;min-height:44px;padding:0 12px;border:1px solid #2e6388;border-radius:11px;background:#0d2944;color:#8be7ff;font-size:11px;font-weight:800;white-space:nowrap}.s5-auth-code-btn:disabled{opacity:.5}.s5-auth-consent{display:flex;align-items:flex-start;gap:9px;margin-top:18px;color:#8eaac8;font-size:11px;line-height:1.8}.s5-auth-consent input{margin-top:4px;accent-color:#38bdf8;flex:none;width:14px;height:14px}.s5-auth-consent button{display:inline;color:#72ddff;text-decoration:underline;text-underline-offset:3px}.s5-auth-security{margin-top:22px;color:#567697;font-size:10px;line-height:1.7}.s5-auth-error{margin-top:12px;padding:10px 12px;border:1px solid #f8717140;border-radius:10px;background:#7f1d1d26;color:#fca5a5;font-size:12px}
          #modal-overlay.s5-auth-overlay{padding:clamp(10px,2.8vw,28px);overscroll-behavior:contain;scroll-padding:18px}
          #modal-overlay.s5-auth-overlay>div{width:min(100%,1000px)!important;max-width:1000px!important;margin:auto}
          .s5-auth-shell{position:relative;isolation:isolate;grid-template-columns:minmax(0,1fr) minmax(390px,.96fr);min-height:0;border:1px solid rgba(255,255,255,.1);border-radius:30px;background:linear-gradient(135deg,rgba(10,24,45,.86),rgba(4,12,27,.9));backdrop-filter:blur(28px) saturate(145%);-webkit-backdrop-filter:blur(28px) saturate(145%);box-shadow:0 40px 110px rgba(0,0,0,.58),inset 0 0 35px rgba(0,0,0,.52),0 0 55px rgba(46,120,255,.09)}
          .s5-auth-shell:after{content:"";position:absolute;inset:0;z-index:0;pointer-events:none;border-radius:inherit;opacity:.13;background-image:url("data:image/svg+xml,%3Csvg viewBox=%270%200%20180%20180%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%27.92%27 numOctaves=%273%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27 opacity=%27.22%27/%3E%3C/svg%3E")}
          .s5-auth-visual,.s5-auth-formpane{position:relative;z-index:1}
          .s5-auth-visual{background:radial-gradient(ellipse at 22% 15%,rgba(29,120,230,.25),transparent 45%),linear-gradient(145deg,rgba(8,34,61,.72),rgba(4,14,29,.65))}
          .s5-auth-formpane{padding:clamp(28px,4vw,48px);background:linear-gradient(145deg,rgba(9,22,40,.67),rgba(4,13,27,.76));backdrop-filter:blur(30px);-webkit-backdrop-filter:blur(30px)}
          .s5-auth-formpane h2{font-size:clamp(28px,3vw,34px);line-height:1.18;letter-spacing:-1px;margin:8px 0 6px}
          .s5-auth-tabs{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:4px;padding:4px;margin:0 0 27px;border:1px solid rgba(255,255,255,.08);border-radius:14px;background:rgba(0,5,17,.4)}
          .s5-auth-tabs:before{content:"";position:absolute;top:4px;bottom:4px;left:4px;width:calc(50% - 6px);border:1px solid rgba(124,194,255,.2);border-radius:10px;background:linear-gradient(120deg,rgba(24,125,232,.38),rgba(105,82,237,.3));box-shadow:0 0 22px rgba(42,145,255,.12);transition:transform .28s cubic-bezier(.2,.8,.2,1)}
          .s5-auth-tabs.is-register:before{transform:translateX(calc(100% + 4px))}
          .s5-auth-tab{position:relative;z-index:1;min-height:38px;border-radius:10px;color:#7f9bb9;font-size:12px;font-weight:750;transition:color .2s}
          .s5-auth-tab[aria-selected="true"]{color:#f4f9ff}
          .s5-auth-field{margin-top:15px}.s5-auth-field>span{font-size:11px;letter-spacing:.2px;color:#c0d2e7}
          .s5-auth-input{min-height:48px;border:1px solid rgba(141,190,232,.19);border-radius:13px;background:rgba(1,9,22,.55);padding:13px 14px;color:#f4faff;box-shadow:inset 0 1px 8px rgba(0,0,0,.18);font-size:13px}
          .s5-auth-input:focus{border-color:#00f0ff;background:rgba(2,17,35,.92);box-shadow:0 0 0 3px rgba(0,240,255,.12),0 0 25px rgba(0,190,255,.16),inset 0 1px 8px rgba(0,0,0,.2)}
          .s5-auth-input-wrap{position:relative;display:flex;align-items:center}.s5-auth-input-wrap .s5-auth-input{padding-right:48px}
          .s5-auth-eye{position:absolute;right:8px;top:50%;transform:translateY(-50%);display:grid;place-items:center;width:34px;height:34px;border:1px solid transparent;border-radius:9px;color:#7798b9;background:transparent;transition:color .2s,background .2s}
          .s5-auth-eye:hover,.s5-auth-eye:focus-visible{color:#72eaff;background:rgba(53,154,255,.1);outline:none}.s5-auth-eye svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
          .s5-auth-primary{min-height:49px;border:1px solid rgba(255,255,255,.16);border-radius:13px;background:linear-gradient(110deg,#087edc 0%,#4259f3 54%,#8253ee 100%);box-shadow:0 12px 32px rgba(39,100,245,.28),inset 0 1px rgba(255,255,255,.2);letter-spacing:.2px}
          .s5-auth-primary:hover{filter:brightness(1.13);transform:translateY(-2px);box-shadow:0 16px 38px rgba(39,100,245,.36),inset 0 1px rgba(255,255,255,.22)}
          .s5-auth-consent{gap:10px;margin-top:20px;color:#9bb1cb;font-size:11px}
          .s5-auth-consent input{appearance:none;-webkit-appearance:none;position:relative;width:18px;height:18px;flex:0 0 18px;margin:2px 0 0;border:1px solid rgba(138,180,221,.45);border-radius:6px;background:rgba(2,10,24,.72);cursor:pointer;transition:all .2s}
          .s5-auth-consent input:checked{border-color:#00dfff;background:linear-gradient(135deg,#00c9ff,#5a66ff);box-shadow:0 0 0 3px rgba(0,220,255,.1),0 0 16px rgba(0,220,255,.32)}
          .s5-auth-consent input:checked:after{content:"";position:absolute;left:5px;top:2px;width:5px;height:9px;border:solid #031526;border-width:0 2px 2px 0;transform:rotate(45deg)}
          .s5-auth-consent input:focus-visible{outline:2px solid #00f0ff;outline-offset:3px}.s5-auth-consent button{color:#7be7ff;text-decoration:none;border-bottom:1px solid rgba(123,231,255,.35)}
          .s5-auth-security{margin-top:18px;padding-top:14px;border-top:1px solid rgba(255,255,255,.06);line-height:1.8}
          @media(max-width:700px){#modal-overlay.s5-auth-overlay{align-items:start;padding:8px;padding-top:max(8px,env(safe-area-inset-top));padding-bottom:max(8px,env(safe-area-inset-bottom));height:100vh;height:100dvh;overflow-y:auto}#modal-overlay.s5-auth-overlay>div{width:100%!important;max-width:500px!important;margin:auto}.s5-auth-shell{display:flex;flex-direction:column;min-height:0;border-radius:23px}.s5-auth-visual{min-height:0;padding:16px 20px 13px;gap:14px}.s5-auth-logo-mark{width:34px;height:34px;border-radius:11px}.s5-auth-headline{font-size:23px;margin:7px 0 3px}.s5-auth-copy,.s5-auth-orbit,.s5-auth-side-note{display:none}.s5-auth-formpane{padding:21px 20px 22px}.s5-auth-tabs{margin-bottom:20px}.s5-auth-field{margin-top:13px}.s5-auth-primary{margin-top:18px}.s5-auth-security{margin-top:14px}#modal-overlay.s5-auth-overlay>div>button:first-child{top:12px;right:12px}.s5-auth-code-row{grid-template-columns:minmax(0,1fr) auto}.s5-auth-code-btn{padding:0 9px;font-size:10px}}
          @media(max-height:720px) and (max-width:700px){.s5-auth-visual{padding:12px 18px 8px}.s5-auth-formpane{padding-top:16px;padding-bottom:16px}.s5-auth-field{margin-top:10px}.s5-auth-tabs{margin-bottom:14px}.s5-auth-security{display:none}}
          @media(prefers-reduced-motion:reduce){.s5-auth-tabs:before,.s5-auth-primary,.s5-auth-input{transition:none!important}}
          @media(max-width:700px){#modal-overlay.s5-auth-overlay>div{max-width:480px!important}.s5-auth-shell{grid-template-columns:1fr;min-height:0}.s5-auth-visual{min-height:165px;padding:25px 24px}.s5-auth-headline{font-size:25px;margin:10px 0 6px}.s5-auth-copy{display:none}.s5-auth-orbit{width:160px;height:160px;right:-55px;bottom:-65px}.s5-auth-side-note{display:none}.s5-auth-formpane{padding:28px 24px 25px}.s5-auth-formpane h2{font-size:24px}}
        `;
        document.head.appendChild(style);
      }
      const overlay = $('modal-overlay');
      const closeButton = overlay && overlay.querySelector(':scope > div > button');
      if (closeButton) { closeButton.style.color = '#9dc4e9'; closeButton.style.fontSize = '28px'; }
      App.openModal = function(type) {
        const content = $('modal-content');
        if (!overlay || !content) return;
        overlay.classList.add('s5-auth-overlay');
        overlay.classList.remove('hidden');
        const registering = type === 'register';
        const inviteFromUrl = (new URLSearchParams(location.search).get('short_id') || new URLSearchParams(location.search).get('invite_code') || new URLSearchParams(location.search).get('invite') || '').trim();
        content.innerHTML = '<div class="s5-auth-shell"><section class="s5-auth-visual"><div class="s5-auth-logo"><span class="s5-auth-logo-mark">✦</span><span>SOSKS5 <span style="color:#69dcff">/ ACCESS</span></span></div><div><div class="s5-auth-kicker">SECURE DIGITAL EXPERIENCE</div><div class="s5-auth-headline">' + (registering ? '开启你的<br>数字服务空间' : '欢迎回到<br>深空控制台') + '</div><p class="s5-auth-copy">' + (registering ? '创建账户，连接你的服务、订阅与订单。安全验证由服务器实时处理。' : '登录后继续管理套餐、订单与个人服务。账户状态和登录结果均以服务器响应为准。') + '</p></div><div class="s5-auth-orbit"></div><div class="s5-auth-side-note">ENCRYPTED SESSION · LIVE API</div></section><section class="s5-auth-formpane"><div class="s5-auth-tabs ' + (registering ? 'is-register' : '') + '" role="tablist" aria-label="账户入口"><button type="button" class="s5-auth-tab" role="tab" aria-selected="' + (!registering) + '" onclick="App.openModal(\'login\')">登录</button><button type="button" class="s5-auth-tab" role="tab" aria-selected="' + registering + '" onclick="App.openModal(\'register\')">注册</button></div><div class="s5-auth-kicker">' + (registering ? 'CREATE ACCOUNT' : 'MEMBER SIGN IN') + '</div><h2>' + (registering ? '创建账户' : '登录账户') + '</h2><p class="s5-auth-muted">' + (registering ? '使用邮箱验证码完成注册' : '请输入你的账户凭证以继续') + '</p><div id="s5-auth-error" class="s5-auth-error" hidden></div><form id="s5-auth-form" onsubmit="event.preventDefault();' + (registering ? 'App.doRegister()' : 'App.doLogin()') + '"><label class="s5-auth-field"><span>邮箱地址</span><input class="s5-auth-input" type="email" id="' + (registering ? 'reg-email' : 'login-email') + '" placeholder="name@example.com" autocomplete="email" required></label>' + (registering ? '<label class="s5-auth-field"><span>邮箱验证码</span><div class="s5-auth-code-row"><input class="s5-auth-input" type="text" id="reg-code" placeholder="输入邮箱验证码" autocomplete="one-time-code" required><button type="button" class="s5-auth-code-btn" id="btn-send-code" onclick="App.sendCode()">发送验证码</button></div></label><label class="s5-auth-field"><span>设置密码</span><div class="s5-auth-input-wrap"><input class="s5-auth-input" type="password" id="reg-pass" placeholder="至少 6 位密码" autocomplete="new-password" minlength="6" required><button type="button" class="s5-auth-eye" data-s5-toggle-password="reg-pass" aria-label="显示密码" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg></button></div></label><label class="s5-auth-field"><span>确认密码</span><div class="s5-auth-input-wrap"><input class="s5-auth-input" type="password" id="reg-pass-confirm" placeholder="再次输入密码" autocomplete="new-password" minlength="6" required><button type="button" class="s5-auth-eye" data-s5-toggle-password="reg-pass-confirm" aria-label="显示密码" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg></button></div></label><label class="s5-auth-field"><span>邀请码（选填）</span><input class="s5-auth-input" type="text" id="reg-invite" placeholder="邀请码或 5 位 short_id" value="' + esc(inviteFromUrl) + '" maxlength="64" autocomplete="off"></label>' : '<label class="s5-auth-field"><span>密码</span><div class="s5-auth-input-wrap"><input class="s5-auth-input" type="password" id="login-pass" placeholder="输入账户密码" autocomplete="current-password" required><button type="button" class="s5-auth-eye" data-s5-toggle-password="login-pass" aria-label="显示密码" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg></button></div></label>') + '<label class="s5-auth-consent"><input type="checkbox" id="s5-auth-consent"><span>我已阅读并同意 <button type="button" data-s5-legal>《用户服务协议》</button> 与 <button type="button" data-s5-legal>《隐私政策》</button></span></label><button type="submit" class="s5-auth-primary" id="s5-auth-submit"><span>' + (registering ? '创建账户' : '登录') + '</span></button></form><div class="s5-auth-switch">' + (registering ? '已有账户？' : '还没有账户？') + '<button type="button" onclick="App.openModal(\'' + (registering ? 'login' : 'register') + '\')">' + (registering ? '返回登录' : '立即注册') + '</button></div><div class="s5-auth-security">SECURE AUTHENTICATION · 不会在前端伪造登录状态；所有凭证由真实接口验证。</div></section></div>';
        content.querySelectorAll('[data-s5-toggle-password]').forEach((button) => {
          button.addEventListener('click', () => {
            const input = $(button.getAttribute('data-s5-toggle-password'));
            if (!input) return;
            const visible = input.type === 'password';
            input.type = visible ? 'text' : 'password';
            button.setAttribute('aria-pressed', String(visible));
            button.setAttribute('aria-label', visible ? '隐藏密码' : '显示密码');
            button.innerHTML = visible
              ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.2A10.8 10.8 0 0112 5c6.5 0 10 7 10 7a16 16 0 01-3.2 3.9M6.2 6.2C3.5 8 2 12 2 12s3.5 7 10 7c1.1 0 2.1-.2 3-.5"/></svg>'
              : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>';
          });
        });
        content.querySelectorAll('input').forEach((input) => {
          input.addEventListener('focus', () => {
            window.setTimeout(() => input.scrollIntoView({block:'nearest',behavior:'smooth'}), 180);
          });
        });
      const form = $('s5-auth-form');
        if (form) form.querySelector('input')?.focus({ preventScroll: true });
      };
      App.closeModal = function() {
        if (overlay) { overlay.classList.add('hidden'); overlay.classList.remove('s5-auth-overlay'); }
      };
      function authError(message) {
        const box = $('s5-auth-error');
        if (box) { box.textContent = message || '请求失败'; box.hidden = false; }
        if (typeof App.showToast === 'function') App.showToast(message || '请求失败', 'bg-red-600');
      }
      function busy(button, label, yes) {
        if (!button) return;
        button.disabled = !!yes;
        button.innerHTML = yes ? '<span class="s5-auth-spinner"></span><span>' + esc(label) + '</span>' : '<span>' + esc(label) + '</span>';
      }
      App.sendCode = async function() {
        const email = $('reg-email')?.value.trim() || '';
        const button = $('btn-send-code');
        if (!email || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) return authError('请输入有效邮箱地址');
        if (button && button.disabled) return;
        if (button) { button.disabled = true; button.textContent = '发送中…'; }
        try {
          await request('/passport/auth/send-code', { method: 'POST', body: JSON.stringify({ email }) });
          if (typeof App.showToast === 'function') App.showToast('验证码已发送，请查收邮箱');
          let seconds = 60;
          if (button) button.textContent = seconds + ' 秒后重试';
          const timer = setInterval(() => {
            seconds -= 1;
            if (button) button.textContent = seconds > 0 ? seconds + ' 秒后重试' : '发送验证码';
            if (seconds <= 0) { clearInterval(timer); if (button) button.disabled = false; }
          }, 1000);
        } catch (error) {
          authError(error.message || '验证码发送失败');
          if (button) { button.disabled = false; button.textContent = '发送验证码'; }
        }
      };
      App.doRegister = async function() {
        const email = $('reg-email')?.value.trim() || '';
        const code = $('reg-code')?.value.trim() || '';
        const password = $('reg-pass')?.value || '';
        const confirmPassword = $('reg-pass-confirm')?.value || '';
        const invite = $('reg-invite')?.value.trim() || '';
        if (!email || !code || !password || !confirmPassword) return authError('请完整填写邮箱、验证码和密码');
        if (!$('s5-auth-consent')?.checked) return authError('请先阅读并勾选用户服务协议与隐私政策');
        if (password.length < 6) return authError('密码至少需要 6 位');
        if (password !== confirmPassword) return authError('两次输入的密码不一致');
        if (invite && !/^[A-Za-z0-9_-]{5,64}$/.test(invite)) return authError('邀请码格式不正确');
        const button = $('s5-auth-submit');
        if (button?.disabled) return;
        busy(button, '正在创建账户…', true);
        try {
          const body = { email, code, password };
          if (invite) { body.invite_code = invite; if (/^[A-Za-z0-9]{5}$/.test(invite)) body.short_id = invite; }
          const response = await request('/passport/auth/register', { method: 'POST', body: JSON.stringify(body) });
          const data = unwrap(response) || {};
          const token = data.token || data.auth_data || data.access_token;
          if (token) {
            saveToken(token);
            if (data.user) saveUser(data.user);
            try { await fetchUserInfo(); } catch (_) {}
            App.closeModal(); setUserNav(); App.router();
            if (typeof App.showToast === 'function') App.showToast('注册成功，欢迎加入');
          } else {
            App.openModal('login');
            if ($('login-email')) $('login-email').value = email;
            if (typeof App.showToast === 'function') App.showToast('注册成功，请使用新账户登录');
          }
        } catch (error) {
          authError(error.message || '注册失败');
        } finally { busy(button, '创建账户', false); }
      };
      App.doLogin = async function() {
        const email = $('login-email')?.value.trim() || '';
        const password = $('login-pass')?.value || '';
        if (!email || !password) return authError('请输入邮箱和密码');
        if (!$('s5-auth-consent')?.checked) return authError('请先阅读并勾选用户服务协议与隐私政策');
        const button = $('s5-auth-submit');
        if (button?.disabled) return;
        busy(button, '正在验证账户…', true);
        try {
          const response = await request('/passport/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
          const data = unwrap(response) || {};
          const token = data.token || data.auth_data || data.access_token;
          if (!token) throw new Error(data.message || data.msg || '登录接口未返回 token');
          saveToken(token);
          if (data.user) saveUser(data.user);
          try { await fetchUserInfo(); } catch (_) { if (data.user) saveUser(data.user); }
          App.closeModal(); setUserNav(); App.router();
          if (typeof App.showToast === 'function') App.showToast('登录成功');
          const redirect = new URLSearchParams(location.search).get('redirect');
          if (redirect && redirect.startsWith('#/')) location.hash = redirect;
          else if (location.hash === '#/login' || location.hash === '#/register') location.hash = '#/dashboard';
        } catch (error) {
          authError(error.message || '登录失败');
        } finally { busy(button, '登录', false); }
      };
    })();

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
      if (kind === 'nodes') return productKind === 'node' || /node|proxy|节点|代理|订阅|vpn|网络|vless|vmess|hysteria2|trojan/.test(text);
      if (kind === 'traffic') return productKind === 'traffic' || /traffic|引流|增长|推广|群发|机器人|growth/.test(text);
      return productKind !== 'node' && productKind !== 'traffic' && !/node|proxy|节点|代理|订阅|vpn|网络|vless|vmess|hysteria2|trojan|traffic|引流|增长|推广|群发|机器人|growth/.test(text);
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
    const clonePanel = kind === 'traffic' ? '<section id="s5-cloned-products" class="s5-clone-products"></section>' : '';
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
      if (hash === '#/' || hash === '') { const view = $('app-view'); if (view && !view.querySelector('#s5-cloned-products')) { const panel = document.createElement('section'); panel.id = 's5-cloned-products'; panel.className = 's5-clone-products'; const promo = view.querySelector('#s5-promo'); if (promo) promo.insertAdjacentElement('afterend', panel); else view.appendChild(panel); } setTimeout(loadClonedProducts, 0); }
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