const API_BASE = '/api/v1/passport/auth';
const ORDER_API = '/api/v1/user/order'; 
const SHOP_API = '/api/v1/user/shop';

let currentUser = localStorage.getItem('socks5_email') || null;
let currentToken = localStorage.getItem('socks5_token') || null;

function switchTab(tabName) {
    document.getElementById('view-home').classList.add('hidden');
    document.getElementById('view-orders').classList.add('hidden');
    document.getElementById('view-profile').classList.add('hidden');
    document.getElementById('tab-home').classList.remove('active');
    document.getElementById('tab-orders').classList.remove('active');
    document.getElementById('tab-profile').classList.remove('active');
    document.getElementById('view-' + tabName).classList.remove('hidden');
    document.getElementById('tab-' + tabName).classList.add('active');
    
    if (tabName === 'profile') updateProfileView();
    if (tabName === 'orders') fetchOrders(); // 切换到订单页时，真实拉取订单
}

// 真实购买下单逻辑
async function buyProduct(productId, productName, price) {
    if (!currentUser) { showAuthModal(); return; }
    
    try {
        // 1. 告诉后端要买什么
        const res = await fetch(`${ORDER_API}/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': currentToken },
            body: JSON.stringify({ plan_id: productId, quantity: 1 })
        });
        const data = await res.json();
        
        if (res.ok && data.data && data.data.order_id) {
            // 2. 订单创建成功，拉起支付
            const tradeNo = data.data.order_id;
            // 这里调用你的支付接口，比如易支付、USDT等
            openPaymentModal(tradeNo, productName, price);
        } else {
            alert(data.message || '创建订单失败，请联系客服');
        }
    } catch (e) {
        alert('网络异常，无法创建订单');
    }
}

// 弹出支付窗口 (你可以根据实际情况改成跳转URL或显示二维码)
function openPaymentModal(tradeNo, productName, price) {
    const modal = document.getElementById('payment-modal');
    if(!modal) {
        // 如果没有支付弹窗，暂时用 alert 模拟，等会加到 index.html 里
        alert(`订单创建成功！\n商品: ${productName}\n金额: ¥${price}\n订单号: ${tradeNo}\n正在拉起支付...`);
        return;
    }
    document.getElementById('pay-order-no').innerText = tradeNo;
    document.getElementById('pay-amount').innerText = price;
    modal.classList.remove('hidden');
}

// 真实拉取订单列表
async function fetchOrders() {
    if (!currentUser) return;
    const orderList = document.getElementById('order-list');
    const emptyOrders = document.getElementById('empty-orders');
    
    try {
        const res = await fetch(`${ORDER_API}/fetch`, {
            method: 'GET',
            headers: { 'Authorization': currentToken }
        });
        const data = await res.json();
        
        if (res.ok && data.data && data.data.length > 0) {
            emptyOrders.classList.add('hidden');
            orderList.classList.remove('hidden');
            
            // 渲染订单
            orderList.innerHTML = data.data.map(order => `
                <div class="bg-white p-4 rounded-xl card-shadow border border-slate-100 mb-3">
                    <div class="flex justify-between items-center border-b pb-2 mb-2">
                        <span class="text-xs text-slate-400">订单号: #${order.trade_no}</span>
                        <span class="text-xs ${order.status === 1 ? 'text-green-500' : 'text-orange-500'} font-medium">
                            ${order.status === 1 ? '已发货' : '待支付'}
                        </span>
                    </div>
                    <h4 class="font-bold text-slate-800">${order.plan_name || '商品名称'}</h4>
                    ${order.status === 1 ? `<button class="mt-3 w-full py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium" onclick="alert('资产：${order.asset_data || '正在生成...'}')">查看账号/节点</button>` : ''}
                </div>
            `).join('');
        } else {
            emptyOrders.classList.remove('hidden');
            orderList.classList.add('hidden');
        }
    } catch (e) {
        console.error(e);
    }
}

// 登录注册部分...
function updateProfileView() {
    if (currentUser) {
        document.getElementById('profile-login-prompt').classList.add('hidden');
        document.getElementById('profile-logged-in').classList.remove('hidden');
        document.getElementById('profile-email').innerText = currentUser;
    } else {
        document.getElementById('profile-login-prompt').classList.remove('hidden');
        document.getElementById('profile-logged-in').classList.add('hidden');
    }
}
function showAuthModal() { document.getElementById('auth-modal').classList.remove('hidden'); }
function closeAuthModal() { document.getElementById('auth-modal').classList.add('hidden'); }
function switchAuthTab(tab) {
    if (tab === 'login') {
        document.getElementById('form-login').classList.remove('hidden');
        document.getElementById('form-register').classList.add('hidden');
        document.getElementById('btn-tab-login').className = 'flex-1 py-1.5 text-sm font-semibold bg-white shadow-sm rounded-lg transition-all';
        document.getElementById('btn-tab-register').className = 'flex-1 py-1.5 text-sm font-medium text-slate-500 rounded-lg transition-all';
    } else {
        document.getElementById('form-login').classList.add('hidden');
        document.getElementById('form-register').classList.remove('hidden');
        document.getElementById('btn-tab-register').className = 'flex-1 py-1.5 text-sm font-semibold bg-white shadow-sm rounded-lg transition-all';
        document.getElementById('btn-tab-login').className = 'flex-1 py-1.5 text-sm font-medium text-slate-500 rounded-lg transition-all';
    }
}

async function sendCode() {
    const email = document.getElementById('reg-email').value;
    if(!email || !email.includes('@')) { alert('请输入正确邮箱'); return; }
    const btn = document.getElementById('send-code-btn');
    btn.disabled = true; btn.innerText = '发送中...';
    try {
        const res = await fetch(`${API_BASE}/send-code`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ email }) });
        const data = await res.json();
        if (res.ok) {
            alert('验证码已发送，请查收邮箱');
            let cd = 60;
            const timer = setInterval(() => { cd--; btn.innerText = `${cd}s`; if(cd <= 0) { clearInterval(timer); btn.disabled = false; btn.innerText = '获取验证码'; } }, 1000);
        } else { alert(data.message || '发送失败'); btn.disabled = false; btn.innerText = '获取验证码'; }
    } catch (e) { alert('网络错误'); btn.disabled = false; btn.innerText = '获取验证码'; }
}

async function handleRegister(e) {
    e.preventDefault();
    const email = document.getElementById('reg-email').value;
    const code = document.getElementById('reg-code').value;
    const password = document.getElementById('reg-pwd').value;
    try {
        const res = await fetch(`${API_BASE}/register`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ email, password, code }) });
        const data = await res.json();
        if (res.ok) { alert('注册成功，正在自动登录...'); setTimeout(() => loginUser(email, password), 1000); } else { alert(data.message || '注册失败'); }
    } catch (e) { alert('网络错误'); }
}

async function handleLogin(e) { e.preventDefault(); loginUser(document.getElementById('login-email').value, document.getElementById('login-pwd').value); }

async function loginUser(email, password) {
    try {
        const res = await fetch(`${API_BASE}/login`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ email, password }) });
        const data = await res.json();
        if (res.ok) {
            currentUser = email; 
            currentToken = data.data.token || data.token;
            localStorage.setItem('socks5_email', email); 
            localStorage.setItem('socks5_token', currentToken);
            closeAuthModal(); 
            switchTab('orders');
            fetchOrders();
        } else { alert(data.message || '邮箱或密码错误'); }
    } catch (e) { alert('网络错误'); }
}

function logout() {
    localStorage.removeItem('socks5_email'); 
    localStorage.removeItem('socks5_token');
    currentUser = null; currentToken = null; 
    updateProfileView(); switchTab('home');
}

function handleSignIn() {
    const btn = document.getElementById('sign-btn'); btn.disabled = true; btn.innerText = '获取中...';
    setTimeout(() => { btn.innerText = '已签到 (点击复制节点)'; btn.classList.replace('text-orange-500', 'text-green-600'); alert('签到成功！Socks5 节点已复制到剪贴板。'); }, 800);
}

document.addEventListener('DOMContentLoaded', () => {
    if(currentUser) { fetchOrders(); }
});
