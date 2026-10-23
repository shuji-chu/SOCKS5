// TGXAccount SPA - real API backend
const API_BASE = '/api';

const App = {
    state: {
        token: localStorage.getItem('tgx_token') || null,
        user: JSON.parse(localStorage.getItem('tgx_user')) || null,
        cart: JSON.parse(localStorage.getItem('tgx_cart')) || [],
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
                localStorage.setItem('tgx_user', JSON.stringify(r.user));
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
        else html = `<div class="text-center py-20"><h1 class="text-4xl text-slate-900 font-bold mb-4">404 Not Found</h1><a href="#/" class="text-primary">Back Home</a></div>`;
        view.innerHTML = html;
        this.toggleDrawer(false);
    },

    // ---------- Views ----------
    views: {
        home() {
            const featured = App.state.products.slice(0, 8);
            const cards = featured.length ? featured.map(p => App.productCard(p)).join('') : '<div class="text-center py-10 text-gray-400 col-span-4">Loading products...</div>';
            return `
            <div class="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-400 text-white p-8 mb-8 shadow-lg">
                <h1 class="text-3xl font-bold mb-2">Global Social Media Accounts Store</h1>
                <p class="text-blue-100 text-sm mb-4">Telegram · Threads · ChatGPT · Apple ID · Gmail · Steam — instant digital delivery</p>
                <div class="flex flex-wrap gap-2 text-xs">
                    <span class="bg-white/20 rounded-full px-3 py-1">3+ Years Secure</span>
                    <span class="bg-white/20 rounded-full px-3 py-1">Instant Delivery</span>
                    <span class="bg-white/20 rounded-full px-3 py-1">12h Warranty</span>
                    <span class="bg-white/20 rounded-full px-3 py-1">30,000+ Users</span>
                </div>
            </div>
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-2xl font-bold text-slate-900">Hot Products</h1>
                <a href="#/products" class="text-primary text-sm font-medium hover:underline">View All →</a>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">${cards}</div>
            <div class="mt-10 rounded-2xl bg-white border border-gray-200 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h2 class="text-lg font-bold text-slate-900">TGX Affiliate Program</h2>
                    <p class="text-sm text-gray-500 mt-1">Invite friends, earn <span class="text-primary font-bold">5% commission</span> on all their orders. Auto-tracked, withdraw anytime.</p>
                </div>
                <a href="#/dashboard" class="bg-primary hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition shrink-0">Join Now</a>
            </div>`;
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
                return `<div class="text-center py-20 text-gray-500">Please sign in to view your cart.</div>`;
            }
            if (App.state.cart.length === 0) {
                return `<div class="text-center py-20"><h2 class="text-2xl text-slate-900 mb-4">Your cart is empty</h2><a href="#/products" class="bg-primary text-white px-6 py-2 rounded-lg">Browse Products</a></div>`;
            }
            const items = App.state.cart.map(item => `
                <div class="bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-between mb-4 shadow-sm">
                    <div class="flex-1">
                        <h3 class="text-slate-900 font-bold text-sm">${item.title}</h3>
                        <p class="text-xs text-gray-500 mt-1">Qty: ${item.qty} | $${item.price.toFixed(2)}</p>
                    </div>
                    <div class="font-bold text-slate-900 w-20 text-right">$${(item.price * item.qty).toFixed(2)}</div>
                    <button onclick="App.removeFromCart(${item.id})" class="ml-4 text-red-500 text-sm hover:underline">Remove</button>
                </div>`).join('');
            const total = App.state.cart.reduce((s, i) => s + (i.price * i.qty), 0);
            return `
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2">
                    <h1 class="text-2xl font-bold text-slate-900 mb-6">Shopping Cart</h1>
                    ${items}
                </div>
                <div>
                    <div class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div class="flex justify-between font-bold text-slate-900 text-lg mb-6 border-b border-gray-100 pb-4">
                            <span>Total</span><span>$${total.toFixed(2)}</span>
                        </div>
                        <a href="#/checkout" class="block text-center w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-blue-700">Proceed to Checkout</a>
                    </div>
                </div>
            </div>`;
        },

        checkout() {
            const total = App.state.cart.reduce((s, i) => s + (i.price * i.qty), 0);
            return `
            <h1 class="text-2xl font-bold text-slate-900 mb-6">Checkout</h1>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h2 class="text-lg text-slate-900 font-bold mb-4">Order Summary</h2>
                    ${App.state.cart.map(i => `<div class="flex justify-between text-sm mb-2"><span>${i.title} x${i.qty}</span><span>$${(i.price * i.qty).toFixed(2)}</span></div>`).join('')}
                    <div class="flex justify-between font-bold text-slate-900 text-xl mt-4 pt-4 border-t border-gray-100">
                        <span>Total</span><span>$${total.toFixed(2)}</span>
                    </div>
                </div>
                <div class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h2 class="text-lg text-slate-900 font-bold mb-4">Payment Method</h2>
                    <label class="block bg-gray-50 p-4 rounded-lg border border-primary mb-4 cursor-pointer">
                        <div class="flex items-center gap-3">
                            <input type="radio" checked class="text-primary focus:ring-0">
                            <div>
                                <div class="text-slate-900 font-bold">Wallet Balance</div>
                                <div class="text-sm text-gray-500">Available: $${(App.state.user ? App.state.user.balance : 0).toFixed(2)}</div>
                            </div>
                        </div>
                    </label>
                    <button onclick="App.placeOrder()" class="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-blue-700">Place Order</button>
                    <p class="text-xs text-gray-400 mt-3 text-center">Virtual goods only. Credentials auto-delivered after payment.</p>
                </div>
            </div>`;
        },

        orders() {
            return `
            <h1 class="text-2xl font-bold text-slate-900 mb-6">My Orders</h1>
            <div id="orders-list" class="space-y-3"><div class="text-center py-10 text-gray-400">Loading...</div></div>`;
        },

        dashboard() {
            const u = App.state.user;
            return `
            <h1 class="text-2xl font-bold text-slate-900 mb-6">User Dashboard</h1>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 class="text-gray-500 text-sm mb-1">Wallet Balance</h3>
                    <div class="text-2xl font-bold text-green-600">$${(u ? u.balance : 0).toFixed(2)}</div>
                </div>
                <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 class="text-gray-500 text-sm mb-1">Email</h3>
                    <div class="text-lg font-bold text-slate-900 truncate">${u ? u.email : '-'}</div>
                </div>
                <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 class="text-gray-500 text-sm mb-1">Member Since</h3>
                    <div class="text-lg font-bold text-slate-900">${u ? (u.created_at || '-').slice(0, 10) : '-'}</div>
                </div>
            </div>
            <div class="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                <a href="#/orders" class="bg-primary text-white text-center py-3 rounded-lg font-bold text-sm hover:bg-blue-700">My Orders</a>
                <a href="#/wallet" class="bg-white border border-gray-200 text-center py-3 rounded-lg font-bold text-sm text-slate-900 hover:bg-gray-50">Wallet</a>
                <a href="#/query" class="bg-white border border-gray-200 text-center py-3 rounded-lg font-bold text-sm text-slate-900 hover:bg-gray-50">Query</a>
                <a href="#/nodes" class="bg-white border border-gray-200 text-center py-3 rounded-lg font-bold text-sm text-slate-900 hover:bg-gray-50">Nodes</a>
            </div>`;
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
        return `
        <div class="bg-white rounded-xl border border-gray-200 p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition">
            <div>
                <div class="flex justify-between items-start mb-3">
                    <div class="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-primary text-xl font-bold">${p.category[0]}</div>
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
                    <div class="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold">${this.state.user.username[0].toUpperCase()}</div>
                    <span class="text-sm font-medium text-slate-900 hidden sm:block">${this.state.user.username}</span>
                </button>`;
            const du = document.getElementById('drawer-username');
            const db = document.getElementById('drawer-balance');
            if (du) du.innerText = this.state.user.username;
            if (db) db.innerText = `$${(this.state.user.balance || 0).toFixed(2)}`;
        } else {
            navArea.innerHTML = `
                <button onclick="App.openModal('login')" class="text-slate-700 text-sm hover:text-primary mr-4">Sign In</button>
                <button onclick="App.openModal('register')" class="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700">Register</button>`;
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
                <h2 class="text-xl font-bold text-slate-900 mb-4">Sign In</h2>
                <input type="email" id="login-email" placeholder="Email" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-slate-900 mb-3 focus:outline-none focus:border-primary">
                <input type="password" id="login-pass" placeholder="Password" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-slate-900 mb-4 focus:outline-none focus:border-primary">
                <button onclick="App.doLogin()" class="w-full bg-primary text-white font-bold py-2.5 rounded-lg mb-2 hover:bg-blue-700">Sign In</button>
                <p class="text-center text-xs text-gray-400">Don't have an account? <a href="#" onclick="App.openModal('register')" class="text-primary">Register</a></p>`;
        } else {
            content.innerHTML = `
                <h2 class="text-xl font-bold text-slate-900 mb-4">Register</h2>
                <input type="email" id="reg-email" placeholder="Email" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-slate-900 mb-3 focus:outline-none focus:border-primary">
                <div class="flex gap-2 mb-3">
                    <input type="text" id="reg-code" placeholder="6-digit code" class="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-primary">
                    <button onclick="App.sendCode()" id="btn-send-code" class="px-4 bg-gray-100 text-slate-600 text-sm font-bold rounded-lg hover:bg-gray-200 transition whitespace-nowrap">Get Code</button>
                </div>
                <input type="password" id="reg-pass" placeholder="Password (min 6 chars)" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-slate-900 mb-4 focus:outline-none focus:border-primary">
                <button onclick="App.doRegister()" class="w-full bg-primary text-white font-bold py-2.5 rounded-lg mb-2 hover:bg-blue-700">Register</button>
                <p class="text-center text-xs text-gray-400">Already have an account? <a href="#" onclick="App.openModal('login')" class="text-primary">Sign In</a></p>`;
        }
    },

    closeModal() {
        document.getElementById('modal-overlay').classList.add('hidden');
    },

    // ---------- Auth Actions ----------
    async sendCode() {
        const email = document.getElementById('reg-email').value.trim();
        if (!email || !email.includes('@')) return this.showToast('Please enter a valid email', 'bg-red-600');
        const btn = document.getElementById('btn-send-code');
        btn.disabled = true; btn.innerText = 'Sending...';
        try {
            const r = await this.api('/auth/send-code', { method: 'POST', body: JSON.stringify({ email }) });
            this.showToast(r.message || 'Code sent', r.ok ? 'bg-green-600' : 'bg-red-600');
            if (r.ok) {
                let cd = 60;
                const t = setInterval(() => { cd--; btn.innerText = `${cd}s`; if (cd <= 0) { clearInterval(t); btn.disabled = false; btn.innerText = 'Get Code'; } }, 1000);
            } else { btn.disabled = false; btn.innerText = 'Get Code'; }
        } catch (e) {
            this.showToast('Network error', 'bg-red-600');
            btn.disabled = false; btn.innerText = 'Get Code';
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
                localStorage.setItem('tgx_token', r.token);
                localStorage.setItem('tgx_user', JSON.stringify(r.user));
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
                localStorage.setItem('tgx_token', r.token);
                localStorage.setItem('tgx_user', JSON.stringify(r.user));
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
        localStorage.removeItem('tgx_token');
        localStorage.removeItem('tgx_user');
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
        localStorage.setItem('tgx_cart', JSON.stringify(this.state.cart));
        this.renderNav();
        this.showToast('Added to cart');
    },

    removeFromCart(id) {
        this.state.cart = this.state.cart.filter(x => x.id !== id);
        localStorage.setItem('tgx_cart', JSON.stringify(this.state.cart));
        this.renderNav();
        this.router();
    },

    async placeOrder() {
        const items = this.state.cart.map(i => ({ product_id: i.id, qty: i.qty }));
        if (!items.length) return this.showToast('Cart is empty', 'bg-red-600');
        try {
            const r = await this.api('/orders', { method: 'POST', body: JSON.stringify({ items }) });
            if (r.ok) {
                this.state.cart = [];
                localStorage.setItem('tgx_cart', '[]');
                this.renderNav();
                this.showToast('Payment successful! Credentials delivered.');
                setTimeout(() => { window.location.hash = '#/orders'; this.router(); }, 1000);
            } else {
                this.showToast(r.message || 'Order failed', 'bg-red-600');
            }
        } catch (e) {
            this.showToast('Network error', 'bg-red-600');
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
