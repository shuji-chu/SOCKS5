const API_BASE = '/api/v1/passport/auth';
let currentUser = localStorage.getItem('socks5_email') || null;

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
}

// 四大分类切换逻辑 (优化版)
function switchShopTab(activeType) {
    const types = ['tg', 'node', 'email', 'apple'];
    types.forEach(type => {
        const list = document.getElementById('list-' + type);
        const btn = document.getElementById('btn-shop-' + type);
        if (type === activeType) {
            list.classList.remove('hidden');
            btn.className = 'flex-1 py-1.5 text-[13px] font-bold bg-white text-slate-800 rounded-lg shadow-sm transition-all';
        } else {
            list.classList.add('hidden');
            btn.className = 'flex-1 py-1.5 text-[13px] font-medium text-slate-500 rounded-lg transition-all';
        }
    });
}

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
        document.getElementById('modal-title').innerText = '登录 SOCKS5';
    } else {
        document.getElementById('form-login').classList.add('hidden');
        document.getElementById('form-register').classList.remove('hidden');
        document.getElementById('btn-tab-register').className = 'flex-1 py-1.5 text-sm font-semibold bg-white shadow-sm rounded-lg transition-all';
        document.getElementById('btn-tab-login').className = 'flex-1 py-1.5 text-sm font-medium text-slate-500 rounded-lg transition-all';
        document.getElementById('modal-title').innerText = '注册 SOCKS5';
    }
}
function requireLogin() { if (!currentUser) { showAuthModal(); } else { alert('正在调起支付接口...'); } }

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
            currentUser = email; localStorage.setItem('socks5_email', email); closeAuthModal(); switchTab('orders');
            document.getElementById('empty-orders').classList.add('hidden'); document.getElementById('order-list').classList.remove('hidden');
        } else { alert(data.message || '邮箱或密码错误'); }
    } catch (e) { alert('网络错误'); }
}

function logout() {
    localStorage.removeItem('socks5_email'); currentUser = null; updateProfileView(); switchTab('home');
    document.getElementById('empty-orders').classList.remove('hidden'); document.getElementById('order-list').classList.add('hidden');
}

function handleSignIn() {
    const btn = document.getElementById('sign-btn'); btn.disabled = true; btn.innerText = '获取中...';
    setTimeout(() => { btn.innerText = '已签到 (点击复制节点)'; btn.classList.replace('text-orange-500', 'text-green-600'); alert('签到成功！Socks5 节点已复制到剪贴板。'); }, 800);
}

document.addEventListener('DOMContentLoaded', () => {
    if(currentUser) { document.getElementById('empty-orders').classList.add('hidden'); document.getElementById('order-list').classList.remove('hidden'); }
});
