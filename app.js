const API_BASE = '/api/v1/passport/auth';
const ORDER_API = '/api/v1/user/order';

let currentUser = localStorage.getItem('socks5_email') || null;
let currentToken = localStorage.getItem('socks5_token') || null;

// 购买拦截
function buyProduct(productId, productName, price) {
    if (!currentUser) {
        window.location.href = '/login.html';
        return;
    }
    // 这里写真实的调起支付逻辑
    alert(`正在创建订单：${productName}\n金额：¥${price}`);
}

// 退出
function logout() {
    localStorage.removeItem('socks5_email'); 
    localStorage.removeItem('socks5_token');
    window.location.href = '/index.html';
}
