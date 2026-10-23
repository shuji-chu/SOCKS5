// 初始化全局状态
document.addEventListener('alpine:init', () => {
    Alpine.store('app', {
        // 1. 鉴权与用户状态
        isLoggedIn: !!localStorage.getItem('tgx_token'),
        user: { username: 'Guest', balance: 0, email: '' },
        
        // 2. 购物车状态 (持久化到 localStorage 模拟后端)
        cart: JSON.parse(localStorage.getItem('tgx_cart') || '[]'),
        
        // 3. 全局 UI 状态
        isLoginModalOpen: false,
        isRegisterModalOpen: false,
        isLoading: false,
        toast: { show: false, message: '', type: 'success' },

        init() {
            if (this.isLoggedIn) {
                // 模拟拉取用户信息
                this.user = { username: 'ProUser', balance: 150.00, email: 'test@tgx.com' };
            }
        },

        // --- 路由守卫 ---
        requireAuth(redirectUrl) {
            if (!this.isLoggedIn) {
                this.isLoginModalOpen = true;
                // 保存当前想去的页面，登录后跳转
                sessionStorage.setItem('redirect_after_login', redirectUrl);
                return false;
            }
            return true;
        },

        // --- 购物车逻辑 ---
        addToCart(sku) {
            const existing = this.cart.find(item => item.id === sku.id);
            if (existing) {
                if (existing.qty + 1 > sku.stock) return this.showToast('Not enough stock', 'error');
                existing.qty += 1;
            } else {
                this.cart.push({ ...sku, qty: 1 });
            }
            this.saveCart();
            this.showToast('Added to cart', 'success');
        },

        removeFromCart(skuId) {
            this.cart = this.cart.filter(item => item.id !== skuId);
            this.saveCart();
        },

        saveCart() {
            localStorage.setItem('tgx_cart', JSON.stringify(this.cart));
        },

        get cartTotal() {
            return this.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        },

        // --- 钱包支付模拟 ---
        payWithWallet() {
            if (this.user.balance < this.cartTotal) {
                return this.showToast('Insufficient wallet balance', 'error');
            }
            this.isLoading = true;
            setTimeout(() => {
                this.user.balance -= this.cartTotal;
                this.cart = [];
                this.saveCart();
                this.isLoading = false;
                this.showToast('Payment Successful! Credentials ready.', 'success');
                setTimeout(() => window.location.href = './orders.html', 1500);
            }, 1000);
        },

        // --- 全局提示 ---
        showToast(msg, type = 'success') {
            this.toast = { show: true, message: msg, type };
            setTimeout(() => { this.toast.show = false; }, 3000);
        },

        logout() {
            localStorage.removeItem('tgx_token');
            this.isLoggedIn = false;
            this.user = { username: 'Guest', balance: 0 };
            window.location.href = './index.html';
        }
    });
});
