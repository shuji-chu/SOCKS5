// S5 晴天社区服务界面
const API_BASE = '/api';
const S5_ICON = (name) => new URL('../../assets/icons/' + name + '.svg', document.currentScript.src).href;

const App = {
    state: {
        token: localStorage.getItem('sosks5_token') || null,
        user: JSON.parse(localStorage.getItem('sosks5_user')) || null,
        cart: JSON.parse(localStorage.getItem('sosks5_cart')) || [],
        pendingCheckout: JSON.parse(localStorage.getItem('sosks5_pending_checkout') || 'null'),
        isPlacingOrder: false,
        products: [],
        nodes: []
    },

    init() {
        this.renderNav();
        window.addEventListener('hashchange', () => this.router());
        this.loadProducts();
        this.loadNodes();
        this.router();
        if (this.state.token) this.fetchMe();
    },

    // ---------- API ----------
    async api(path, opts = {}) {
        const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
        if (this.state.token) headers['Authorization'] = 'Bearer ' + this.state.token;
        const res = await fetch(API_BASE + path, { ...opts, headers });
        return res.json();
    },

    async fetchMe() {
        try {
            const r = await this.api('/auth/me');
            if (r.ok) {
                this.state.user = r.user;
                localStorage.setItem('sosks5_user', JSON.stringify(r.user));
                this.renderNav();
            } else {
                this.logout();
            }
        } catch (e) { /* ignore */ }
    },

    async loadProducts() {
        try {
            const r = await this.api('/products');
            if (r.ok) this.state.products = r.data;
            this.router();
        } catch (e) { /* ignore */ }
    },

    async loadNodes() {
        try {
            const r = await this.api('/nodes');
            if (r.ok) this.state.nodes = r.data;
        } catch (e) { /* ignore */ }
    },

    // ---------- Router ----------
    router() {
        const hash = window.location.hash || '#/';
        const view = document.getElementById('app-view');
        let html = '';
        if (hash === '#/' || hash === '') html = this.views.home();
        else if (hash === '#/products') html = this.views.products();
        else if (hash === '#/cart') html = this.views.cart();
        else if (hash === '#/checkout') html = this.views.checkout();
        else if (hash === '#/orders') { html = this.views.orders(); setTimeout(() => this.loadOrders(), 50); }
        else if (hash === '#/dashboard') html = this.views.dashboard();
        else if (hash === '#/wallet') html = this.views.wallet();
        else if (hash === '#/query') html = this.views.query();
        else if (hash === '#/nodes') html = this.views.nodes();
        else if (hash === '#/traffic') html = this.views.traffic();
        else html = `<div class="text-center py-20"><h1 class="text-4xl text-slate-900 font-bold mb-4">404 Not Found</h1><a href="#/" class="text-primary">Back Home</a></div>`;
        view.innerHTML = html;
        this.toggleDrawer(false);
    },

    // ---------- Views ----------
    views: {
        home() {
            const demoProducts = [
              {icon:'gift',tone:'cyan',title:'全球社媒账号精选',desc:'多平台数字账号 · 适用范围清晰',price:'¥ 18.00',tag:'热销推荐'},
              {icon:'network',tone:'violet',title:'高速专线体验包',desc:'稳定连接 · 多端使用指引',price:'¥ 12.00',tag:'人气套餐'},
              {icon:'shop',tone:'blue',title:'数字工具入门套装',desc:'精选工具与使用说明',price:'¥ 25.00',tag:'精选好物'},
              {icon:'support',tone:'gold',title:'增长资源体验包',desc:'推广素材 · 新手使用指南',price:'¥ 9.90',tag:'限时体验'}
            ];
            return `
            <section class="s5-hero">
              <div class="s5-hero-stars"></div><div class="s5-planet"></div>
              <div class="s5-hero-copy"><div class="s5-eyebrow">全球数字服务枢纽</div><h1>S5</h1><h2>探索无界网络，极速全球节点</h2><p>安全、稳定、专业的一站式数字商品与网络服务平台</p>
                <div class="s5-hero-tags"><span>全球数字服务</span><span>订单清晰可查</span><span>安全可靠的服务体验</span></div>
                <div class="s5-hero-actions"><a href="#/products" class="s5-primary-btn">探索账号商城 →</a><a href="#/nodes" class="s5-ghost-btn">浏览节点中心</a></div></div>
              <div class="s5-astronaut" aria-label="漂浮宇航员动画"><div class="s5-orbit"></div><div class="s5-astronaut-body" aria-hidden="true"></div></div>
              <div class="s5-hero-contact"><b>在线业务支持</b><span>客服：晴天社区官方</span><span>在线服务：官方客服入口</span><span>服务时间：每日在线</span></div><div class="s5-slider-dots"><i></i><i></i><i></i></div>
            </section>
            <section class="s5-announcement"><span class="s5-live-dot"></span><b>平台公告</b><div class="s5-marquee"><span>欢迎来到 晴天社区数字服务空间　·　下单前请仔细阅读商品说明　·　如需帮助可联系在线客服　·　感谢你的支持</span></div><a href="#/notices">查看公告 →</a></section>
            <section class="s5-categories s5-business-grid">
              <a href="#/products" class="s5-category"><span><img src="${S5_ICON('shop')}" alt="" aria-hidden="true"></span><b>账号商城</b><small>社交平台 · 邮箱服务 · 数字工具</small><em>探索商品 ↗</em></a>
              <a href="#/nodes" class="s5-category"><span><img src="${S5_ICON('network')}" alt="" aria-hidden="true"></span><b>节点中心</b><small>高速节点 · 订阅服务 · 使用指引</small><em>浏览节点 ↗</em></a>
              <a href="#/traffic" class="s5-category"><span><img src="${S5_ICON('support')}" alt="" aria-hidden="true"></span><b>引流分销</b><small>邀请好友 · 推广奖励 · 排行榜</small><em>查看推广 ↗</em></a>
            </section>
            <section class="s5-blindbox"><div class="s5-blind-orb"><img src="${S5_ICON('gift')}" alt="" aria-hidden="true"></div><div class="s5-blind-copy"><span class="s5-mini-kicker">每日福利 · 惊喜盲盒</span><h2>今天的好运，等你开启</h2><p>每日惊喜主题卡片，静态展示示例。实际奖品与活动规则以后续公告为准。</p></div><a href="#/products" class="s5-blind-button">探索惊喜 <span>↗</span></a></section>
            <div class="s5-section-head"><div><h2>热销商品</h2><p>精选数字服务与体验套餐 · 当前为界面展示示例</p></div><a href="#/products">查看全部 →</a></div>
            <div class="s5-showcase-grid">${demoProducts.map((p,i)=>`<article class="s5-showcase-card"><div class="s5-showcase-image ${p.tone}"><span class="s5-product-badge">${p.tag}</span><div class="s5-product-art"><img src="${S5_ICON(p.icon)}" alt="" aria-hidden="true"></div><div class="s5-image-grid"></div></div><div class="s5-showcase-body"><div class="s5-showcase-kind">精选数字服务 · 0${i+1}</div><h3>${p.title}</h3><p>${p.desc}</p><div class="s5-showcase-foot"><strong>${p.price}</strong><a href="#/products" class="s5-buy-btn">查看详情</a></div></div></article>`).join('')}</div>
            <section class="s5-home-bottom"><div><span class="s5-mini-kicker">为每一次连接做好准备</span><h2>从探索到使用，一切清晰简单</h2><p>浏览商品、查看订阅、管理订单，轻松进入你的数字服务空间。</p></div><a href="#/dashboard" class="s5-primary-btn">进入用户中心 →</a></section>`;
        },

        traffic() {
            return `
            <main class="s5-static-page s5-referral-page"><div class="s5-page-heading"><div><span class="s5-mini-kicker">邀请计划 · 推广中心</span><h1>分享好服务，收获更多可能</h1><p>邀请好友体验平台服务，查看你的推广资料与本月榜单。</p></div><span class="s5-status-pill"><i></i> 推广中心</span></div>
            <section class="s5-referral-hero"><div class="s5-referral-copy"><span class="s5-mini-kicker">专属邀请链接</span><h2>让每一次分享都有价值</h2><p>将你的专属链接分享给朋友，帮助他们快速找到所需服务。</p><div class="s5-copy-field"><span>晴天社区官方邀请链接示例</span><button type="button" onclick="App.showToast('演示链接已复制')">复制链接</button></div><small>示例链接仅用于展示界面，不会产生真实推广记录。</small></div><div class="s5-referral-symbol"><div class="s5-referral-ring">↗</div><span>邀请同行 · 一起探索</span></div></section>
            <div class="s5-referral-two"><section class="s5-panel s5-poster-panel"><div class="s5-panel-head"><div><h2>专属邀请海报</h2><p>适合分享至社交平台的视觉预览</p></div><span class="s5-poster-label">预览</span></div><div class="s5-poster"><div class="s5-poster-stars"></div><div class="s5-poster-brand"><img src="${S5_ICON('gift')}" alt="" aria-hidden="true"> S5</div><div class="s5-poster-orbit">S</div><span class="s5-mini-kicker">探索无界 · 连接未来</span><h3>你的数字服务<br>从这里开始</h3><p>扫码加入 · 体验专属服务空间</p><div class="s5-poster-code">58317</div><small>专属邀请编号</small></div><button type="button" class="s5-outline-wide" onclick="App.showToast('海报为静态预览')">查看海报样式</button></section>
            <section class="s5-panel"><div class="s5-panel-head"><div><h2>本月推广概览</h2><p>静态示例数据</p></div></div><div class="s5-referral-stats"><div><span>累计邀请</span><b>28</b><small>位访客</small></div><div><span>有效转化</span><b>12</b><small>次体验</small></div><div><span>预计奖励</span><b>¥ 96</b><small>示例金额</small></div></div><div class="s5-referral-note">以上均为静态排版示例，不代表真实账户数据。</div></section></div>
            <section class="s5-panel"><div class="s5-panel-head"><div><h2>本月推广排行榜</h2><p>看看大家的分享表现</p></div><span class="s5-month-chip">2026 年 10 月</span></div><div class="s5-table-wrap"><table class="s5-rank-table"><thead><tr><th>排名</th><th>推广用户</th><th>有效邀请</th><th>本月奖励</th><th>等级</th></tr></thead><tbody><tr><td><span class="s5-rank-medal gold">01</span></td><td><b>星云漫游者</b><small>ID：51824</small></td><td>128</td><td>¥ 860.00</td><td><span class="s5-rank-tag">星耀</span></td></tr><tr><td><span class="s5-rank-medal silver">02</span></td><td><b>蓝色彗星</b><small>ID：47291</small></td><td>96</td><td>¥ 620.00</td><td><span class="s5-rank-tag">星耀</span></td></tr><tr><td><span class="s5-rank-medal bronze">03</span></td><td><b>深空旅客</b><small>ID：58317</small></td><td>74</td><td>¥ 480.00</td><td><span class="s5-rank-tag">星轨</span></td></tr><tr><td><span class="s5-rank-medal">04</span></td><td><b>流光拾荒者</b><small>ID：31968</small></td><td>51</td><td>¥ 320.00</td><td><span class="s5-rank-tag">星轨</span></td></tr></tbody></table></div></section></main>`;
        },

        products() {
            const cats = {};
            App.state.products.forEach(p => { (cats[p.category] = cats[p.category] || []).push(p); });
            const sections = Object.keys(cats).map(c => `
                <h2 class="text-xl font-bold text-slate-900 mt-8 mb-4">${c}</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">${cats[c].map(p => App.productCard(p)).join('')}</div>
            `).join('');
            return `<h1 class="text-2xl font-bold text-slate-900 mb-2">All Products</h1><p class="text-gray-500 text-sm mb-4">Instant delivery of global digital accounts & proxy nodes.</p>${sections}`;
        },

        cart() {
            if (!App.state.user) {
                setTimeout(() => App.openModal('login'), 100);
                return `<div class="text-center py-20 text-gray-500"><h2 class="text-xl font-bold text-slate-900 mb-3">请先登录</h2><p>登录后即可查看和管理购物车。</p><button type="button" onclick="App.openModal('login')" class="mt-5 bg-primary text-white px-6 py-3 rounded-xl">立即登录</button></div>`;
            }
            if (!App.state.cart.length) {
                return `<div class="text-center py-20"><div class="text-4xl mb-4">🛒</div><h2 class="text-2xl text-slate-900 mb-4">购物车还是空的</h2><a href="#/products" class="bg-primary text-white px-6 py-3 rounded-xl">浏览商品</a></div>`;
            }
            const items = App.state.cart.map(item => {
                const qty = Math.max(1, Number(item.qty) || 1);
                const stock = Math.max(0, Number(item.stock) || 0);
                const price = Number(item.price) || 0;
                const invalid = qty > stock || stock <= 0;
                return `
                <article class="bg-white rounded-xl p-4 border border-gray-200 flex flex-wrap sm:flex-nowrap items-center gap-4 mb-3 shadow-sm">
                    <div class="min-w-0 flex-1">
                        <h3 class="text-slate-900 font-bold text-sm break-words">${App.escapeHtml(item.title || '商品')}</h3>
                        <p class="text-xs text-gray-500 mt-1">单价：¥${price.toFixed(2)} · 库存：${stock}</p>
                        ${invalid ? '<p class="text-xs text-red-600 mt-1">库存不足，请调整数量或移除商品</p>' : ''}
                    </div>
                    <div class="flex items-center gap-2">
                        <button type="button" aria-label="减少数量" onclick="App.updateCartQty(${Number(item.id)}, -1)" class="w-10 h-10 rounded-lg border border-gray-200 text-slate-700" ${qty <= 1 ? 'disabled' : ''}>−</button>
                        <span class="min-w-7 text-center font-semibold">${qty}</span>
                        <button type="button" aria-label="增加数量" onclick="App.updateCartQty(${Number(item.id)}, 1)" class="w-10 h-10 rounded-lg border border-gray-200 text-slate-700" ${qty >= stock ? 'disabled' : ''}>＋</button>
                    </div>
                    <strong class="w-24 text-right text-slate-900">¥${(price * qty).toFixed(2)}</strong>
                    <button type="button" onclick="App.removeFromCart(${Number(item.id)})" class="px-3 py-2 text-sm text-red-600">移除</button>
                </article>`;
            }).join('');
            const total = App.cartTotal();
            const hasInvalid = App.state.cart.some(i => Number(i.qty) > Number(i.stock) || Number(i.stock) <= 0);
            return `
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <section class="lg:col-span-2">
                    <div class="flex items-center justify-between mb-5"><h1 class="text-2xl font-bold text-slate-900">我的购物车</h1><a href="#/products" class="text-primary text-sm">继续购物</a></div>
                    ${items}
                </section>
                <aside>
                    <div class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm lg:sticky lg:top-24">
                        <h2 class="text-lg font-bold text-slate-900 mb-5">订单摘要</h2>
                        <div class="flex justify-between text-sm mb-3"><span>商品数量</span><span>${App.state.cart.reduce((n,i)=>n+(Number(i.qty)||0),0)} 件</span></div>
                        <div class="flex justify-between font-bold text-slate-900 text-xl border-t border-gray-100 pt-4 mb-5"><span>合计</span><span>¥${total.toFixed(2)}</span></div>
                        <button type="button" onclick="location.hash='#/checkout'" ${hasInvalid ? 'disabled' : ''} class="w-full bg-primary text-white font-bold py-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed">前往结算</button>
                        ${hasInvalid ? '<p class="text-xs text-red-600 mt-3">请先处理库存不足的商品。</p>' : ''}
                    </div>
                </aside>
            </div>`;
        },

        checkout() {
            if (!App.state.user) {
                setTimeout(() => App.openModal('login'), 100);
                return `<div class="text-center py-20 text-gray-500">请先登录后再结算。</div>`;
            }
            if (!App.state.cart.length) return `<div class="text-center py-20"><h2 class="text-xl font-bold mb-4">购物车为空</h2><a href="#/products" class="text-primary">返回商品列表</a></div>`;
            const total = App.cartTotal();
            const invalid = App.state.cart.some(i => !Number.isFinite(Number(i.price)) || Number(i.price) < 0 || Number(i.qty) < 1 || Number(i.qty) > Number(i.stock) || Number(i.stock) <= 0);
            const pending = App.state.pendingCheckout;
            return `
            <div class="max-w-5xl mx-auto">
                <div class="flex items-center justify-between mb-6"><h1 class="text-2xl font-bold text-slate-900">确认订单</h1><a href="#/cart" class="text-primary text-sm">返回购物车修改</a></div>
                ${pending ? `<div class="rounded-xl border border-amber-200 bg-amber-50 p-4 mb-5 text-sm text-amber-800"><b>已有一笔订单请求正在确认中。</b><p class="mt-1">为避免重复下单，系统暂时锁定再次提交。请先到订单记录核实该笔订单状态。</p><a href="#/orders" class="inline-block mt-2 font-bold underline">查看我的订单</a><button type="button" onclick="App.clearPendingCheckout()" class="block mt-3 text-xs underline">已确认没有生成订单，解除提交锁</button></div>` : ''}
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <section class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <h2 class="text-lg font-bold text-slate-900 mb-4">商品清单</h2>
                        ${App.state.cart.map(i => `<div class="flex justify-between gap-4 text-sm py-2 border-b border-gray-100"><span class="min-w-0">${App.escapeHtml(i.title || '商品')} × ${Number(i.qty)||1}</span><b class="whitespace-nowrap">¥${((Number(i.price)||0)*(Number(i.qty)||1)).toFixed(2)}</b></div>`).join('')}
                        <div class="flex justify-between font-bold text-slate-900 text-xl mt-5"><span>应付金额</span><span>¥${total.toFixed(2)}</span></div>
                    </section>
                    <section class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <h2 class="text-lg font-bold text-slate-900 mb-4">支付与备注</h2>
                        <p class="text-sm text-slate-600 mb-4">订单将提交至平台订单服务。支付是否完成以服务器返回的订单状态为准。</p>
                        <label for="checkout-notes" class="block text-sm text-gray-600 mb-2">订单备注（选填）</label>
                        <textarea id="checkout-notes" maxlength="200" rows="3" class="w-full border border-gray-200 rounded-xl p-3 text-slate-800" placeholder="填写订单备注，最多 200 字"></textarea>
                        <button id="place-order-button" type="button" onclick="App.placeOrder()" ${invalid || pending ? 'disabled' : ''} class="w-full mt-5 bg-primary text-white font-bold py-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed">${pending ? '订单确认中' : '提交订单'}</button>
                        ${invalid ? '<p class="text-xs text-red-600 mt-3">购物车商品库存或数量异常，请返回购物车调整。</p>' : ''}
                        <p class="text-xs text-gray-400 mt-3">提交成功不等于支付成功；未收到服务端明确的已支付状态前，购物车商品会保留。</p>
                    </section>
                </div>
            </div>`;
        },

        orders() {
            return `
            <h1 class="text-2xl font-bold text-slate-900 mb-6">My Orders</h1>
            <div id="orders-list" class="space-y-3"><div class="text-center py-10 text-gray-400">Loading...</div></div>`;
        },

        dashboard() {
            return `
            <main class="s5-static-page">
              <div class="s5-page-heading"><div><span class="s5-mini-kicker">个人空间 · 用户中心</span><h1>欢迎回来，星际旅人</h1><p>这里汇总你的账户资料、订阅服务与近期订单。</p></div><span class="s5-status-pill"><i></i> 账户状态：正常</span></div>
              <section class="s5-profile-card"><div class="s5-avatar">星</div><div class="s5-profile-copy"><span class="s5-mini-kicker">会员账户</span><h2>星际访客 <span class="s5-level">普通会员</span></h2><p>邮箱：visitor@example.com</p><div class="s5-short-id">专属编号 <b>58317</b><button type="button" onclick="App.showToast('演示编号：58317')">复制编号</button></div></div><div class="s5-profile-decoration"><img src="${S5_ICON('gift')}" alt="" aria-hidden="true"></div></section>
              <div class="s5-metric-grid"><article class="s5-metric-card"><span>账户余额</span><strong>¥ 128.00</strong><small>可用于购买服务</small><i>￥</i></article><article class="s5-metric-card"><span>可用流量</span><strong>86.4 <em>GB</em></strong><small>本周期剩余流量</small><i><img src="${S5_ICON('network')}" alt="" aria-hidden="true"></i></article><article class="s5-metric-card"><span>剩余有效期</span><strong>23 <em>天</em></strong><small>订阅服务有效期</small><i><img src="${S5_ICON('support')}" alt="" aria-hidden="true"></i></article></div>
              <section class="s5-panel"><div class="s5-panel-head"><div><h2>我的订阅</h2><p>管理常用客户端配置与订阅地址</p></div><span class="s5-status-pill"><i></i> 服务运行中</span></div><div class="s5-subscription-card"><div class="s5-sub-icon"><img src="${S5_ICON('network')}" alt="" aria-hidden="true"></div><div class="s5-sub-main"><b>全球网络加速 · 月度套餐</b><span>下次到期：2026-11-21 · 剩余 23 天</span><code>https://subscribe.example.com/demo/58317</code></div><span class="s5-sub-state">有效</span></div><div class="s5-sub-actions"><button type="button" onclick="App.showToast('演示界面：Clash 订阅地址')">Clash 订阅</button><button type="button" onclick="App.showToast('演示界面：V2Ray 订阅地址')">V2Ray 订阅</button><button type="button" onclick="App.showToast('演示界面：配置已准备就绪')">导出配置</button></div></section>
              <section class="s5-panel"><div class="s5-panel-head"><div><h2>我的订单</h2><p>查看购买记录与服务状态</p></div><a href="#/orders">全部订单 →</a></div><div class="s5-empty-state"><div class="s5-empty-icon"><img src="${S5_ICON('shop')}" alt="" aria-hidden="true"></div><b>这里暂时还没有订单</b><p>探索精选服务，找到适合你的数字商品。</p><a href="#/products" class="s5-primary-btn">浏览商品</a></div></section>
            </main>`;
        },

        wallet() {
            const u = App.state.user;
            return `
            <h1 class="text-2xl font-bold text-slate-900 mb-6">Wallet</h1>
            <div class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm max-w-md">
                <h3 class="text-gray-500 text-sm mb-1">Available Balance</h3>
                <div class="text-3xl font-bold text-green-600 mb-6">$${(u ? u.balance : 0).toFixed(2)}</div>
                <p class="text-xs text-gray-400">Deposit & affiliate commission withdrawals coming soon.</p>
            </div>`;
        },

        query() {
            return `
            <div class="max-w-md mx-auto">
                <h1 class="text-2xl font-bold text-slate-900 mb-2">Order / Node Query</h1>
                <p class="text-sm text-gray-500 mb-6">Enter your order number, card key or API key to view delivery details and node subscriptions.</p>
                <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Credential</label>
                    <input type="text" id="query-input" placeholder="Order No. / Card Key / API Key" class="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition mb-4">
                    <button onclick="App.doQuery()" class="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition">Query Now</button>
                </div>
                <div id="query-result" class="hidden mt-6 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"></div>
            </div>`;
        },

        nodes() {
            const list = App.state.nodes.length ? App.state.nodes.map(n => `
                <div class="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                    <div class="flex justify-between items-start mb-2">
                        <h3 class="font-bold text-slate-900">${n.name}</h3>
                        <span class="text-xs text-gray-400">${n.node_type.toUpperCase()}</span>
                    </div>
                    <div class="text-xs text-gray-500 font-mono mb-3">${n.server}:${n.port}</div>
                    <div class="flex items-center justify-between">
                        <button onclick="App.copyNode('${n.sub_url}')" class="text-primary text-xs font-bold hover:underline">Copy Sub Link</button>
                        <button onclick="App.copyNode('tg://proxy?server=${n.server}&port=${n.port}&secret=${n.secret}')" class="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-700">Copy tg://</button>
                    </div>
                </div>`).join('') : '<div class="text-center py-10 text-gray-400 col-span-full">No nodes yet</div>';
            return `
            <h1 class="text-2xl font-bold text-slate-900 mb-6">Proxy Nodes</h1>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">${list}</div>`;
        }
    },

    productCard(p) {
        const soldOut = p.stock <= 0;
        const tags = (p.tags || []).map(t => `<span class="text-[10px] bg-blue-50 text-primary px-1.5 py-0.5 rounded border border-blue-100">${t}</span>`).join('');
        const categoryText = String(p.category || p.title || '商品').toLowerCase();
        const icon = /node|proxy|节点|代理|v2ray|ss/.test(categoryText) ? 'network' : /email|邮箱|gmail|outlook|sms|接码|phone|手机/.test(categoryText) ? 'support' : /key|卡密|兑换/.test(categoryText) ? 'gift' : 'shop';
        return `
        <div class="s5-product-card bg-white rounded-xl border border-gray-200 p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition">
            <div>
                <div class="flex justify-between items-start mb-3">
                    <div class="s5-product-icon"><img src="${S5_ICON(icon)}" alt="" aria-hidden="true"></div>
                    <span class="text-xs bg-blue-50 text-primary px-2 py-1 rounded border border-blue-100">${p.category}</span>
                </div>
                <h3 class="text-sm font-bold text-slate-900 line-clamp-2">${p.title}</h3>
                <div class="flex flex-wrap gap-1 mt-2">${tags}</div>
            </div>
            <div class="mt-4 pt-4 border-t border-gray-100">
                <div class="flex justify-between text-xs text-gray-500 mb-3">
                    <span>Stock: <strong class="${soldOut ? 'text-red-500' : 'text-green-600'}">${p.stock}</strong></span>
                    <span>${p.warranty_hours}h Warranty</span>
                </div>
                <div class="flex justify-between items-center">
                    <div class="text-xl font-bold text-slate-900">$${p.price.toFixed(2)}</div>
                    <button onclick="App.addToCart(${p.id}, '${p.title.replace(/'/g, "\\'")}', ${p.price}, ${p.stock})" class="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition disabled:opacity-50" ${soldOut ? 'disabled' : ''}>
                        ${soldOut ? 'Sold Out' : 'Buy Now'}
                    </button>
                </div>
            </div>
        </div>`;
    },

    // ---------- Nav ----------
    renderNav() {
        const navArea = document.getElementById('nav-user-area');
        if (!navArea) return;
        if (this.state.user) {
            navArea.innerHTML = `
                <a href="#/cart" class="text-slate-700 hover:text-primary mr-3 text-sm">Cart (${this.state.cart.length})</a>
                <button onclick="App.toggleDrawer()" class="flex items-center gap-2">
                    <img src="${this.state.user.avatar_url || this.state.user.avatar || './assets/sok.png'}" alt="Avatar" class="w-9 h-9 rounded-full object-cover border border-blue-200">
                    <span class="text-sm font-medium text-slate-900 hidden sm:block">${this.state.user.nickname || this.state.user.username || 'User'}</span>
                </button>`;
            const du = document.getElementById('drawer-username');
            const db = document.getElementById('drawer-balance');
            if (du) du.innerText = this.state.user.nickname || this.state.user.username || 'User';
            if (db) db.innerText = `$${(this.state.user.balance || 0).toFixed(2)}`;
        } else {
            navArea.innerHTML = `
                <button onclick="App.openModal('login')" class="text-slate-700 text-sm hover:text-primary mr-4">登录</button>
                <button onclick="App.openModal('register')" class="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700">注册</button>`;
        }
    },

    toggleDrawer(force) {
        const drawer = document.getElementById('user-drawer');
        if (drawer) {
            if (force === false) drawer.classList.add('hidden');
            else drawer.classList.toggle('hidden');
        }
    },

    // ---------- Modals ----------
    openModal(type) {
        document.getElementById('modal-overlay').classList.remove('hidden');
        const content = document.getElementById('modal-content');
        if (type === 'login') {
            content.innerHTML = `
                <h2 class="text-xl font-bold text-slate-900 mb-4">登录</h2>
                <input type="email" id="login-email" placeholder="请输入邮箱地址" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-slate-900 mb-3 focus:outline-none focus:border-primary">
                <input type="password" id="login-pass" placeholder="请输入密码" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-slate-900 mb-4 focus:outline-none focus:border-primary">
                <button onclick="App.doLogin()" class="w-full bg-primary text-white font-bold py-2.5 rounded-lg mb-2 hover:bg-blue-700">登录</button>
                <p class="text-center text-xs text-gray-400">没有账号？ <a href="#" onclick="App.openModal('register')" class="text-primary">Register</a></p>`;
        } else {
            content.innerHTML = `
                <h2 class="text-xl font-bold text-slate-900 mb-4">注册</h2>
                <input type="email" id="reg-email" placeholder="请输入邮箱地址" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-slate-900 mb-3 focus:outline-none focus:border-primary">
                <div class="flex gap-2 mb-3">
                    <input type="text" id="reg-code" placeholder="请输入邮箱验证码" class="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-primary">
                    <button onclick="App.sendCode()" id="btn-send-code" class="px-4 bg-gray-100 text-slate-600 text-sm font-bold rounded-lg hover:bg-gray-200 transition whitespace-nowrap">获取验证码</button>
                </div>
                <input type="password" id="reg-pass" placeholder="请输入密码（至少 6 位）" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-slate-900 mb-4 focus:outline-none focus:border-primary">
                <button onclick="App.doRegister()" class="w-full bg-primary text-white font-bold py-2.5 rounded-lg mb-2 hover:bg-blue-700">注册</button>
                <p class="text-center text-xs text-gray-400">已有账号？ <a href="#" onclick="App.openModal('login')" class="text-primary">登录</a></p>`;
        }
    },

    closeModal() {
        document.getElementById('modal-overlay').classList.add('hidden');
    },

    // ---------- Auth Actions ----------
    async sendCode() {
        const email = document.getElementById('reg-email').value.trim();
        if (!email || !email.includes('@')) return this.showToast('请输入有效邮箱地址', 'bg-red-600');
        const btn = document.getElementById('btn-send-code');
        btn.disabled = true; btn.innerText = '正在发送…';
        try {
            const r = await this.api('/auth/send-code', { method: 'POST', body: JSON.stringify({ email }) });
            this.showToast(r.message || '验证码已发送', r.ok ? 'bg-green-600' : 'bg-red-600');
            if (r.ok) {
                let cd = 60;
                const t = setInterval(() => { cd--; btn.innerText = `${cd}s`; if (cd <= 0) { clearInterval(t); btn.disabled = false; btn.innerText = '获取验证码'; } }, 1000);
            } else { btn.disabled = false; btn.innerText = '获取验证码'; }
        } catch (e) {
            this.showToast('Network error', 'bg-red-600');
            btn.disabled = false; btn.innerText = '获取验证码';
        }
    },

    async doRegister() {
        const email = document.getElementById('reg-email').value.trim();
        const code = document.getElementById('reg-code').value.trim();
        const password = document.getElementById('reg-pass').value;
        if (!email || !code || !password) return this.showToast('Please fill in all fields', 'bg-red-600');
        try {
            const r = await this.api('/auth/register', { method: 'POST', body: JSON.stringify({ email, code, password }) });
            if (r.ok) {
                this.state.token = r.token;
                this.state.user = r.user;
                localStorage.setItem('sosks5_token', r.token);
                localStorage.setItem('sosks5_user', JSON.stringify(r.user));
                this.closeModal();
                this.renderNav();
                this.showToast('Registration successful!');
                this.router();
            } else {
                this.showToast(r.message || 'Registration failed', 'bg-red-600');
            }
        } catch (e) {
            this.showToast('Network error', 'bg-red-600');
        }
    },

    async doLogin() {
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-pass').value;
        if (!email || !password) return this.showToast('Please enter email and password', 'bg-red-600');
        try {
            const r = await this.api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
            if (r.ok) {
                this.state.token = r.token;
                this.state.user = r.user;
                localStorage.setItem('sosks5_token', r.token);
                localStorage.setItem('sosks5_user', JSON.stringify(r.user));
                this.closeModal();
                this.renderNav();
                this.showToast('Logged in successfully!');
                this.router();
            } else {
                this.showToast(r.message || 'Invalid email or password', 'bg-red-600');
            }
        } catch (e) {
            this.showToast('Network error', 'bg-red-600');
        }
    },

    logout() {
        localStorage.removeItem('sosks5_token');
        localStorage.removeItem('sosks5_user');
        this.state.token = null;
        this.state.user = null;
        this.renderNav();
        this.toggleDrawer(false);
        window.location.hash = '#/';
        this.router();
    },

    // ---------- Cart & Orders ----------
    addToCart(id, title, price, stock) {
        if (!this.state.user) return this.openModal('login');
        const item = this.state.cart.find(x => x.id === id);
        if (item) {
            if (item.qty + 1 > stock) return this.showToast('Not enough stock', 'bg-red-600');
            item.qty++;
        } else {
            this.state.cart.push({ id, title, price, stock, qty: 1 });
        }
        localStorage.setItem('sosks5_cart', JSON.stringify(this.state.cart));
        this.renderNav();
        this.showToast('Added to cart');
    },

    removeFromCart(id) {
        this.state.cart = this.state.cart.filter(x => x.id !== id);
        localStorage.setItem('sosks5_cart', JSON.stringify(this.state.cart));
        this.renderNav();
        this.router();
    },

    escapeHtml(value) {
        return String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
    },

    cartTotal() {
        return this.state.cart.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.qty) || 0), 0);
    },

    updateCartQty(id, delta) {
        const item = this.state.cart.find(x => Number(x.id) === Number(id));
        if (!item) return;
        const next = (Number(item.qty) || 1) + Number(delta || 0);
        const stock = Number(item.stock) || 0;
        if (next < 1) return;
        if (next > stock) return this.showToast('库存不足，无法增加数量', 'bg-red-600');
        item.qty = next;
        localStorage.setItem('sosks5_cart', JSON.stringify(this.state.cart));
        this.renderNav();
        this.router();
    },

    clearPendingCheckout() {
        if (!window.confirm('只有在订单列表确认没有生成该订单时，才可以解除提交锁。确定继续吗？')) return;
        this.state.pendingCheckout = null;
        localStorage.removeItem('sosks5_pending_checkout');
        this.router();
    },

    async placeOrder() {
        if (!this.state.token || !this.state.user) {
            this.openModal('login');
            return;
        }
        if (!this.state.cart.length) return this.showToast('购物车为空', 'bg-red-600');
        if (this.state.pendingCheckout) return this.showToast('已有订单请求待核实，请先查看订单记录', 'bg-red-600');
        if (this.state.isPlacingOrder) return;
        const invalid = this.state.cart.some(i => !Number.isFinite(Number(i.id)) || !Number.isFinite(Number(i.price)) || Number(i.price) < 0 || !Number.isInteger(Number(i.qty)) || Number(i.qty) < 1 || Number(i.qty) > Number(i.stock) || Number(i.stock) <= 0);
        if (invalid) return this.showToast('商品库存或数量异常，请返回购物车检查', 'bg-red-600');
        this.state.isPlacingOrder = true;
        const button = document.getElementById('place-order-button');
        if (button) { button.disabled = true; button.textContent = '正在提交订单…'; }
        const items = this.state.cart.map(i => ({ product_id: i.id, qty: Number(i.qty) }));
        const notes = (document.getElementById('checkout-notes')?.value || '').trim().slice(0, 200);
        try {
            const r = await this.api('/orders', { method: 'POST', body: JSON.stringify({ items, notes }) });
            if (!r || r.ok !== true) throw new Error((r && r.message) || '订单提交失败，请稍后重试');
            const data = r.data || r.order || {};
            const paymentStatus = String(data.payment_status || data.pay_status || r.payment_status || '').toLowerCase();
            const orderStatus = String(data.status || '').toLowerCase();
            const status = paymentStatus || orderStatus || 'pending';
            const paid = ['paid','completed','complete','delivered','已支付','已完成'].includes(paymentStatus) || ['paid','completed','complete','delivered','已支付','已完成'].includes(orderStatus);
            const orderNo = data.order_no || data.orderNo || data.trade_no || data.id || r.order_no || r.orderNo || '';
            const paymentUrl = data.payment_url || data.pay_url || data.checkout_url || r.payment_url || r.pay_url || '';
            if (paid) {
                this.state.cart = [];
                localStorage.setItem('sosks5_cart', '[]');
                this.renderNav();
                this.showToast('服务器已确认支付成功', 'bg-green-600');
                setTimeout(() => { window.location.hash = '#/orders'; this.router(); }, 900);
                return;
            }
            this.state.pendingCheckout = { orderNo: String(orderNo || ''), createdAt: Date.now(), status: status || 'pending' };
            localStorage.setItem('sosks5_pending_checkout', JSON.stringify(this.state.pendingCheckout));
            this.router();
            if (paymentUrl) {
                const safeUrl = String(paymentUrl);
                if (/^https:\/\//i.test(safeUrl)) {
                    const note = document.createElement('div');
                    note.className = 'fixed inset-x-4 bottom-20 z-50 mx-auto max-w-md rounded-xl border border-blue-200 bg-white p-4 shadow-xl';
                    note.innerHTML = '<p class="font-bold text-slate-900 mb-2">订单已创建，等待支付</p><a class="block rounded-lg bg-blue-600 p-3 text-center font-bold text-white" target="_blank" rel="noopener noreferrer" href="' + this.escapeHtml(safeUrl) + '">打开支付页面</a>';
                    document.body.appendChild(note);
                }
            }
            this.showToast(orderNo ? '订单已创建，请完成支付或核实订单状态' : '订单请求已提交，请到订单列表核实状态', 'bg-green-600');
        } catch (e) {
            this.showToast(e.message || '网络异常，订单状态未确认', 'bg-red-600');
            if (button) { button.disabled = false; button.textContent = '重试提交'; }
        } finally {
            this.state.isPlacingOrder = false;
        }
    },

    async loadOrders() {
        const box = document.getElementById('orders-list');
        if (!box) return;
        if (!this.state.user) return this.openModal('login');
        try {
            const r = await this.api('/orders');
            if (!r.ok || !r.data.length) {
                box.innerHTML = '<div class="text-center py-10 text-gray-400">No orders yet</div>';
                return;
            }
            box.innerHTML = r.data.map(o => `
                <div class="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center justify-between">
                    <div>
                        <div class="font-bold text-slate-900 text-sm">${o.order_no}</div>
                        <div class="text-xs text-gray-500 mt-1">${o.created_at} · $${o.total.toFixed(2)}</div>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="text-xs bg-green-50 text-green-700 px-2 py-1 rounded border border-green-100">${o.status}</span>
                        <button onclick="App.viewOrder(${o.id})" class="text-primary text-sm font-bold hover:underline">View</button>
                    </div>
                </div>`).join('');
        } catch (e) {
            box.innerHTML = '<div class="text-center py-10 text-gray-400">Failed to load orders</div>';
        }
    },

    async viewOrder(id) {
        try {
            const r = await this.api('/orders/' + id);
            if (!r.ok) return this.showToast(r.message, 'bg-red-600');
            const o = r.data;
            const box = document.getElementById('orders-list');
            if (!box) return;
            box.innerHTML = `
                <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <div class="flex justify-between items-center mb-4">
                        <div>
                            <div class="font-bold text-slate-900">${o.order_no}</div>
                            <div class="text-xs text-gray-500 mt-1">${o.created_at}</div>
                        </div>
                        <span class="text-xs bg-green-50 text-green-700 px-2 py-1 rounded border border-green-100">${o.status}</span>
                    </div>
                    <h3 class="font-bold text-slate-900 mb-2">Delivered Credentials</h3>
                    <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs font-mono text-slate-800 whitespace-pre-wrap mb-4">${o.credentials || 'No credentials'}</div>
                    <button onclick="App.copyText('${o.credentials.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')}')" class="bg-primary text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-blue-700">Copy All</button>
                    <button onclick="App.closeOrderView()" class="ml-2 bg-gray-100 text-gray-600 text-sm font-bold px-4 py-2 rounded-lg hover:bg-gray-200">Back</button>
                </div>`;
        } catch (e) {
            this.showToast('Network error', 'bg-red-600');
        }
    },

    closeOrderView() { this.router(); },

    // ---------- Query & Nodes ----------
    async doQuery() {
        const val = document.getElementById('query-input').value.trim();
        if (!val) return this.showToast('Please enter a credential', 'bg-red-600');
        const btn = event.target;
        btn.innerText = 'Querying...'; btn.disabled = true;
        try {
            const r = await this.api('/query', { method: 'POST', body: JSON.stringify({ credential: val }) });
            const box = document.getElementById('query-result');
            box.classList.remove('hidden');
            if (r.ok && r.data) {
                const d = r.data;
                if (d.type === 'order') {
                    box.innerHTML = `
                        <h3 class="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-gray-100">Query Result — Order</h3>
                        <div class="flex justify-between border-b border-gray-50 pb-2"><span class="text-gray-500">Order No.</span><span class="font-mono text-slate-900">${d.order_no}</span></div>
                        <div class="flex justify-between border-b border-gray-50 pb-2 pt-2"><span class="text-gray-500">Status</span><span class="font-medium text-green-600">${d.status}</span></div>
                        <div class="flex justify-between border-b border-gray-50 pb-2 pt-2"><span class="text-gray-500">Total</span><span class="font-medium text-slate-900">$${d.total.toFixed(2)}</span></div>
                        <div class="pt-3"><span class="text-gray-500 block mb-2">Credentials</span><div class="bg-gray-50 p-3 rounded font-mono text-xs text-slate-800 whitespace-pre-wrap">${d.credentials}</div></div>`;
                } else {
                    box.innerHTML = `
                        <h3 class="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-gray-100">Query Result — Node</h3>
                        <div class="flex justify-between border-b border-gray-50 pb-2"><span class="text-gray-500">Node</span><span class="font-mono text-slate-900">${d.name}</span></div>
                        <div class="flex justify-between border-b border-gray-50 pb-2 pt-2"><span class="text-gray-500">Server</span><span class="font-mono text-slate-900">${d.server}:${d.port}</span></div>
                        <div class="pt-3"><span class="text-gray-500 block mb-2">Sub Link</span><div class="bg-gray-50 p-3 rounded font-mono text-xs text-slate-800 break-all">${d.sub_url || ('tg://proxy?server=' + d.server + '&port=' + d.port + '&secret=' + d.secret)}</div></div>`;
                }
            } else {
                box.innerHTML = `<div class="text-sm text-gray-500">${r.message || 'No result found'}</div>`;
            }
        } catch (e) {
            this.showToast('Network error', 'bg-red-600');
        }
        btn.innerText = 'Query Now'; btn.disabled = false;
    },

    copyNode(text) {
        this.copyText(text);
    },

    copyText(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => this.showToast('Copied!')).catch(() => this.fallbackCopy(text));
        } else {
            this.fallbackCopy(text);
        }
    },

    fallbackCopy(text) {
        const ta = document.createElement('textarea');
        ta.value = text; document.body.appendChild(ta); ta.select();
        document.execCommand('copy'); document.body.removeChild(ta);
        this.showToast('Copied!');
    },

    showToast(msg, bg = 'bg-green-600') {
        const t = document.getElementById('toast');
        if (!t) return;
        t.innerText = msg;
        t.className = `fixed bottom-10 left-1/2 -translate-x-1/2 z-[110] px-6 py-3 rounded-lg shadow-xl text-white font-bold ${bg}`;
        t.classList.remove('hidden');
        setTimeout(() => t.classList.add('hidden'), 3000);
    }
};

// load orders when on orders view
document.addEventListener('DOMContentLoaded', () => {
    window.onload = () => App.init();
});
