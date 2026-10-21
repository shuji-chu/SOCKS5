// 引入 TG WebApp 实例
const tg = window.Telegram?.WebApp;

let currentUser = localStorage.getItem('socks5_email') || null;
let currentToken = localStorage.getItem('socks5_token') || null;

// 全局路由拦截器 (在每个页面加载前调用)
async function checkAuthAndRedirect() {
    // 1. 如果本地已经有 Token，说明已登录，放行
    if (currentToken) return;

    // 2. 检查是否在 Telegram 机器人内嵌环境
    if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
        // 在机器人里，拿到 TG 用户信息，静默去你服务器换取 Token
        const tgUser = tg.initDataUnsafe.user;
        const tgId = tgUser.id;
        const tgName = tgUser.username || tgUser.first_name || "TG_User";

        console.log("检测到 Telegram 环境，正在自动授权...", tgId);

        try {
            // ⚠️ 这里需要你后端配合，我会在下面解释
            // 调用你的 lynli-api 网关的 TG 专用登录接口
            const res = await fetch('/api/v1/passport/auth/tg-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tg_id: tgId, username: tgName })
            });
            const data = await res.json();
            
            if (res.ok && data.data) {
                // 授权成功，保存信息
                localStorage.setItem('socks5_email', data.data.email || `${tgId}@tg.user`);
                localStorage.setItem('socks5_token', data.data.token);
                window.location.reload(); // 刷新页面，进入商城
                return;
            }
        } catch (e) {
            console.error("TG 自动授权失败，可能需要后端支持", e);
            // 如果后端还没写好接口，这里做个妥协：先允许他用假身份体验
            // localStorage.setItem('socks5_email', `${tgId}@tg.user`);
            // localStorage.setItem('socks5_token', 'mock_tg_token');
            // window.location.reload();
        }
    }

    // 3. 如果既没 Token，也不在 TG 环境里，且当前不在登录页/注册页，强制跳转到登录页
    const currentPath = window.location.pathname;
    if (!currentPath.includes('login.html') && !currentPath.includes('register.html')) {
        window.location.href = '/login.html';
    }
}

// 退出登录
function logout() {
    localStorage.removeItem('socks5_email'); 
    localStorage.removeItem('socks5_token');
    window.location.href = '/login.html';
}

// 购买逻辑
function buyProduct(productId, productName, price) {
    if (!currentToken) { window.location.href = '/login.html'; return; }
    alert(`正在创建订单：${productName}\n金额：¥${price}`);
}

// 页面加载时自动执行拦截
document.addEventListener('DOMContentLoaded', () => {
    checkAuthAndRedirect();
});
