let currentUser = localStorage.getItem('socks5_email') || null;
function buyProduct(productId, productName, price) {
    if (!currentUser) { window.location.href = '/login.html'; return; }
    alert(`正在创建订单：${productName}\n金额：¥${price}`);
}
function logout() {
    localStorage.removeItem('socks5_email'); localStorage.removeItem('socks5_token');
    window.location.href = '/login.html';
}
