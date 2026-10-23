// 模拟数据
const MOCK_PRODUCTS = [
    { id: 1, title: 'Telegram [US] +1 API Login (30d)', price: 1.35, stock: 100, category: 'Telegram' },
    { id: 2, title: 'ChatGPT Plus Shared Account (1m)', price: 8.00, stock: 50, category: 'AI Tools' },
    { id: 3, title: 'Gmail Aged 2020 - Bulk Available', price: 2.50, stock: 0, category: 'Email' },
    { id: 4, title: 'Apple ID [UK] Region Payment Attached', price: 4.20, stock: 20, category: 'Apple' }
];

const App = {
    state: {
        user: JSON.parse(localStorage.getItem('tgx_user')) || null,
        cart: JSON.parse(localStorage.getItem('tgx_cart')) || [],
    },

    init() {
        if (!this.state.user) this.state.user = { username: 'Guest', balance: 0 };
        this.renderNav();
        window.addEventListener('hashchange', () => this.router());
        this.router();
    },

    // 路由系统
    router() {
        const hash = window.location.hash || '#/';
        const view = document.getElementById('app-view');
        
        if (hash === '#/' || hash === '') {
            view.innerHTML = this.views.home();
        } else if (hash === '#/cart') {
            view.innerHTML = this.views.cart();
        } else if (hash === '#/checkout') {
            view.innerHTML = this.views.checkout();
        } else if (hash === '#/dashboard' || hash === '#/orders') {
            view.innerHTML = this.views.dashboard();
        } else {
            view.innerHTML = `<div class="text-center py-20"><h1 class="text-4xl text-white font-bold mb-4">404 Not Found</h1><a href="#/" class="text-primary">Back Home</a></div>`;
        }
        this.toggleDrawer(false);
    },

    // 页面视图模板
    views: {
        home() {
            const grid = MOCK_PRODUCTS.map(p => {
                const soldOut = p.stock <= 0;
                return `
                <div class="bg-darkcard rounded-xl border border-gray-800 p-5 flex flex-col justify-between shadow-lg">
                    <div>
                        <div class="flex justify-between items-start mb-3">
                            <div class="w-10 h-10 rounded-lg bg-darkbg border border-gray-700 flex items-center justify-center text-primary text-xl font-bold">${p.category[0]}</div>
                            <span class="text-xs bg-primary/20 text-primary px-2 py-1 rounded border border-primary/30">${p.category}</span>
                        </div>
                        <h3 class="text-sm font-bold text-white line-clamp-2">${p.title}</h3>
                    </div>
                    <div class="mt-4 pt-4 border-t border-gray-800">
                        <div class="flex justify-between text-xs text-gray-400 mb-3">
                            <span>Stock: <strong class="${soldOut ? 'text-red-500' : 'text-green-500'}">${p.stock}</strong></span>
                            <span>12h Warranty</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <div class="text-xl font-bold text-white">$${p.price.toFixed(2)}</div>
                            <button onclick="App.addToCart(${p.id})" class="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition disabled:opacity-50" ${soldOut ? 'disabled' : ''}>
                                ${soldOut ? 'Sold Out' : 'Add to Cart'}
                            </button>
                        </div>
                    </div>
                </div>`;
            }).join('');
            
            return `
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-white mb-2">Hot Products</h1>
                <p class="text-gray-500 text-sm">Instant delivery of global social media accounts.</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">${grid}</div>`;
        },

        cart() {
            if (!this.state.user || this.state.user.username === 'Guest') {
                setTimeout(() => this.openModal('login'), 100);
                return `<div class="text-center py-20">Please sign in to view cart.</div>`;
            }
            if (this.state.cart.length === 0) {
                return `<div class="text-center py-20"><h2 class="text-2xl text-white mb-4">Your cart is empty</h2><a href="#/" class="bg-primary text-white px-6 py-2 rounded-lg">Browse Products</a></div>`;
            }

            const items = this.state.cart.map(item => `
                <div class="bg-darkcard rounded-xl p-4 border border-gray-800 flex items-center justify-between mb-4">
                    <div class="flex-1">
                        <h3 class="text-white font-bold text-sm">${item.title}</h3>
                        <p class="text-xs text-gray-500 mt-1">Qty: ${item.qty} | $${item.price}</p>
                    </div>
                    <div class="font-bold text-white w-20 text-right">$${(item.price * item.qty).toFixed(2)}</div>
                    <button onclick="App.removeFromCart(${item.id})" class="ml-4 text-red-500 text-sm hover:underline">Remove</button>
                </div>
            `).join('');

            const total = this.state.cart.reduce((s, i) => s + (i.price * i.qty), 0);

            return `
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2">
                    <h1 class="text-2xl font-bold text-white mb-6">Shopping Cart</h1>
                    ${items}
                </div>
                <div>
                    <div class="bg-darkcard rounded-xl p-6 border border-gray-800">
                        <div class="flex justify-between font-bold text-white text-lg mb-6 border-b border-gray-800 pb-4">
                            <span>Total</span><span>$${total.toFixed(2)}</span>
                        </div>
                        <a href="#/checkout" class="block text-center w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-blue-600">Proceed to Checkout</a>
                    </div>
                </div>
            </div>`;
        },

        checkout() {
            const total = this.state.cart.reduce((s, i) => s + (i.price * i.qty), 0);
            return `
            <h1 class="text-2xl font-bold text-white mb-6">Checkout</h1>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="bg-darkcard rounded-xl p-6 border border-gray-800">
                    <h2 class="text-lg text-white font-bold mb-4">Order Summary</h2>
                    ${this.state.cart.map(i => `<div class="flex justify-between text-sm mb-2"><span>${i.title} x${i.qty}</span><span>$${(i.price*i.qty).toFixed(2)}</span></div>`).join('')}
                    <div class="flex justify-between font-bold text-white text-xl mt-4 pt-4 border-t border-gray-800">
                        <span>Total</span><span>$${total.toFixed(2)}</span>
                    </div>
                </div>
                <div class="bg-darkcard rounded-xl p-6 border border-gray-800">
                    <h2 class="text-lg text-white font-bold mb-4">Payment Method</h2>
                    <label class="block bg-darkbg p-4 rounded-lg border border-primary mb-4 cursor-pointer">
                        <div class="flex items-center gap-3">
                            <input type="radio" checked class="text-primary focus:ring-0">
                            <div>
                                <div class="text-white font-bold">Wallet Balance</div>
                                <div class="text-sm text-gray-400">Available: $${this.state.user.balance.toFixed(2)}</div>
                            </div>
                        </div>
                    </label>
                    <button onclick="App.pay()" class="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-blue-600">Place Order</button>
                </div>
            </div>`;
        },

        dashboard() {
            return `
            <h1 class="text-2xl font-bold text-white mb-6">User Dashboard</h1>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-darkcard p-6 rounded-xl border border-gray-800">
                    <h3 class="text-gray-400 text-sm mb-1">Wallet Balance</h3>
                    <div class="text-2xl font-bold text-green-400">$${this.state.user.balance.toFixed(2)}</div>
                </div>
                <div class="bg-darkcard p-6 rounded-xl border border-gray-800">
                    <h3 class="text-gray-400 text-sm mb-1">Total Orders</h3>
                    <div class="text-2xl font-bold text-white">0</div>
                </div>
            </div>`;
        }
    },

    // 导航栏渲染
    renderNav() {
        const navArea = document.getElementById('nav-user-area');
        if (this.state.user.username !== 'Guest') {
            navArea.innerHTML = `
                <a href="#/cart" class="text-white hover:text-primary mr-4">Cart (${this.state.cart.length})</a>
                <button onclick="App.toggleDrawer()" class="flex items-center gap-2">
                    <div class="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold">${this.state.user.username[0].toUpperCase()}</div>
                </button>
            `;
            document.getElementById('drawer-username').innerText = this.state.user.username;
            document.getElementById('drawer-balance').innerText = `$${this.state.user.balance.toFixed(2)}`;
        } else {
            navArea.innerHTML = `
                <button onclick="App.openModal('login')" class="text-white text-sm hover:text-primary mr-4">Sign In</button>
                <button onclick="App.openModal('register')" class="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold">Register</button>
            `;
        }
    },

    // 抽屉控制
    toggleDrawer(force) {
        const drawer = document.getElementById('user-drawer');
        if (force === false) drawer.classList.add('hidden');
        else drawer.classList.toggle('hidden');
    },

    // 弹窗控制
    openModal(type) {
        document.getElementById('modal-overlay').classList.remove('hidden');
        const content = document.getElementById('modal-content');
        
        if (type === 'login') {
            content.innerHTML = `
                <h2 class="text-xl font-bold text-white mb-4">Sign In</h2>
                <input type="text" id="login-user" placeholder="Username" class="w-full bg-darkbg border border-gray-700 rounded-lg p-3 text-white mb-3">
                <input type="password" id="login-pass" placeholder="Password" class="w-full bg-darkbg border border-gray-700 rounded-lg p-3 text-white mb-4">
                <button onclick="App.doLogin()" class="w-full bg-primary text-white font-bold py-2.5 rounded-lg mb-2">Sign In</button>
                <p class="text-center text-xs text-gray-400">Don't have an account? <a href="#" onclick="App.openModal('register')" class="text-primary">Register</a></p>
            `;
        } else {
            content.innerHTML = `
                <h2 class="text-xl font-bold text-white mb-4">Register</h2>
                <input type="text" placeholder="Username" class="w-full bg-darkbg border border-gray-700 rounded-lg p-3 text-white mb-3">
                <input type="email" placeholder="Email" class="w-full bg-darkbg border border-gray-700 rounded-lg p-3 text-white mb-3">
                <input type="password" placeholder="Password" class="w-full bg-darkbg border border-gray-700 rounded-lg p-3 text-white mb-4">
                <button onclick="App.doRegister()" class="w-full bg-primary text-white font-bold py-2.5 rounded-lg mb-2">Register</button>
                <p class="text-center text-xs text-gray-400">Already have an account? <a href="#" onclick="App.openModal('login')" class="text-primary">Sign In</a></p>
            `;
        }
    },

    closeModal() {
        document.getElementById('modal-overlay').classList.add('hidden');
    },

    // 模拟业务动作
    doLogin() {
        this.state.user = { username: document.getElementById('login-user').value || 'User', balance: 150.00 };
        localStorage.setItem('tgx_user', JSON.stringify(this.state.user));
        this.closeModal();
        this.renderNav();
        this.showToast('Logged in successfully');
        this.router(); // 刷新视图
    },

    doRegister() {
        this.state.user = { username: 'NewUser', balance: 0.00 };
        localStorage.setItem('tgx_user', JSON.stringify(this.state.user));
        this.closeModal();
        this.renderNav();
        this.showToast('Registration successful');
        this.router();
    },

    logout() {
        localStorage.removeItem('tgx_user');
        this.state.user = { username: 'Guest', balance: 0 };
        this.renderNav();
        this.toggleDrawer(false);
        window.location.hash = '#/';
        this.router();
    },

    addToCart(id) {
        if (this.state.user.username === 'Guest') return this.openModal('login');
        const p = MOCK_PRODUCTS.find(x => x.id === id);
        const item = this.state.cart.find(x => x.id === id);
        if (item) item.qty++;
        else this.state.cart.push({ ...p, qty: 1 });
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

    pay() {
        const total = this.state.cart.reduce((s, i) => s + (i.price * i.qty), 0);
        if (this.state.user.balance < total) return this.showToast('Insufficient balance', 'bg-red-600');
        this.state.user.balance -= total;
        this.state.cart = [];
        localStorage.setItem('tgx_user', JSON.stringify(this.state.user));
        localStorage.setItem('tgx_cart', JSON.stringify(this.state.cart));
        this.showToast('Payment Successful!');
        this.renderNav();
        setTimeout(() => window.location.hash = '#/dashboard', 1000);
    },

    showToast(msg, bg = 'bg-green-600') {
        const t = document.getElementById('toast');
        t.innerText = msg;
        t.className = `fixed bottom-10 left-1/2 -translate-x-1/2 z-[110] px-6 py-3 rounded-lg shadow-xl text-white font-bold ${bg}`;
        t.classList.remove('hidden');
        setTimeout(() => t.classList.add('hidden'), 3000);
    }
};

// 启动应用
window.onload = () => App.init();
