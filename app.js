// 自动嗅探不同的平台环境
const tg = window.Telegram?.WebApp;
const safew = window.SafeW || window.SafeWApp; // 假设 SafeW 的注入名，如果有不同可以后续调整

let currentUser = localStorage.getItem('socks5_email') || null;
let currentToken = localStorage.getItem('socks5_token') || null;

async function checkAuthAndRedirect() {
    // 1. 已登录直接放行
    if (currentToken) return;

    let platform = null;
    let openId = null;
    let nickname = "用户";

    // 2. 嗅探 URL 参数 (适用于 Mivra 机器人，或者任何直接传参的链接)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('platform') && urlParams.has('uid')) {
        platform = urlParams.get('platform');
        openId = urlParams.get('uid');
    }

    // 3. 嗅探 Telegram 环境
    if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
        platform = 'tg';
        openId = tg.initDataUnsafe.user.id;
        nickname = tg.initDataUnsafe.user.first_name;
    }
    // 4. 嗅探 SafeW 环境 (如果 SafeW 有注入对象)
    else if (safew && safew.user) {
        platform = 'safew';
        openId = safew.user.id; // 或者 safew.user.uid
        nickname = safew.user.name || 'SafeW用户';
    }

    // 5. 如果成功抓到了平台和用户 ID，发起静默授权
    if (platform && openId) {
        console.log(`✅ 检测到 ${platform} 环境，正在静默授权... ID: ${openId}`);
        try {
            // 请求你后端的统一授权接口
            const res = await fetch('/api/v1/passport/auth/sso-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ platform, open_id: String(openId), nickname })
            });
            const data = await res.json();
            
            if (res.ok && data.data) {
                // 授权成功，保存 token 并跳转商城
                localStorage.setItem('socks5_email', data.data.email);
                localStorage.setItem('socks5_token', data.data.token);
                window.location.href = '/index.html'; 
                return;
            }
        } catch (e) {
            console.error("自动授权异常", e);
        }
    }

    // 6. 兜底：如果什么环境都没检测到，跳转登录页
    const currentPath = window.location.pathname;
    if (!currentPath.includes('login.html') && !currentPath.includes('register.html')) {
        window.location.href = '/login.html';
    }
}

function logout() {
    localStorage.removeItem('socks5_email'); 
    localStorage.removeItem('socks5_token');
    window.location.href = '/login.html';
}

function buyProduct(productId, productName, price) {
    if (!currentToken) { window.location.href = '/login.html'; return; }
    alert(`正在创建订单：${productName}\n金额：¥${price}`);
}

document.addEventListener('DOMContentLoaded', () => {
    checkAuthAndRedirect();
});
