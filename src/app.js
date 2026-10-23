const tg = window.Telegram?.WebApp;
const safew = window.SafeW || window.SafeWApp;
const API_HOST = 'https://api.lynli.me/s5api/api/v1';

let currentUser = localStorage.getItem('socks5_email') || null;
let currentToken = localStorage.getItem('socks5_token') || null;

async function checkAuthAndRedirect() {
    if (currentToken) return;
    let platform = null, openId = null, nickname = "用户";
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('platform') && urlParams.has('uid')) {
        platform = urlParams.get('platform'); openId = urlParams.get('uid');
    }
    if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
        platform = 'tg'; openId = tg.initDataUnsafe.user.id; nickname = tg.initDataUnsafe.user.first_name;
    } else if (safew && safew.user) {
        platform = 'safew'; openId = safew.user.id; nickname = safew.user.name;
    }
    if (platform && openId) {
        try {
            const res = await fetch(`${API_HOST}/auth/sso-login`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ platform, open_id: String(openId), nickname })
            });
            const data = await res.json();
            if (res.ok && data.data) {
                localStorage.setItem('socks5_email', data.data.email);
                localStorage.setItem('socks5_token', data.data.token);
                window.location.href = '/index.html'; 
                return;
            }
        } catch (e) { console.error(e); }
    }
    const currentPath = window.location.pathname;
    if (!currentPath.includes('login.html') && !currentPath.includes('register.html') && !currentPath.includes('pay.html')) {
        window.location.href = '/login.html';
    }
}

async function buyProduct(productId, productName, price) {
    if (!currentToken) { window.location.href = '/login.html'; return; }
    try {
        const res = await fetch(`${API_HOST}/order/create`, {
            method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': currentToken },
            body: JSON.stringify({ product_id: productId, product_name: productName, price: price })
        });
        const data = await res.json();
        if (res.ok && data.data) { window.location.href = data.data.pay_url; }
        else { alert('创建订单失败'); }
    } catch(e) { alert('网络错误'); }
}

function logout() {
    localStorage.removeItem('socks5_email'); localStorage.removeItem('socks5_token');
    window.location.href = '/login.html';
}
document.addEventListener('DOMContentLoaded', () => { checkAuthAndRedirect(); });
