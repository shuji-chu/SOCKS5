document.addEventListener('DOMContentLoaded', () => {
    // 核心逻辑：只在首页和我的页面展示
    const path = window.location.pathname;
    const allowedPages = ['/', '/index.html', '/profile.html'];
    
    // 如果不是首页或我的页，直接终止，不注入任何东西
    if (!allowedPages.includes(path) && !path.endsWith('index.html') && !path.endsWith('profile.html')) {
        return;
    }

    // 以下是原有的公告弹窗逻辑
    if (!document.getElementById('notice-modal')) {
        const modalHtml = `
            <div id="notice-modal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[99999] hidden items-center justify-center px-4">
                <div class="bg-white rounded-2xl w-full max-w-[340px] p-5 shadow-xl transform scale-95 transition-transform duration-200" id="notice-modal-inner">
                    <h3 class="text-[17px] font-bold text-slate-800 mb-3 text-center">系统公告</h3>
                    <div class="text-[14px] text-slate-600 mb-5 leading-relaxed max-h-[50vh] overflow-y-auto">
                        <p class="mb-2"><b>📢 平台最新动态：</b></p>
                        <p class="mb-2">1. 接码系统已完成升级，新增全球 60+ 国家号码支持，极速回码。</p>
                        <p class="mb-2">2. 开发者 API 网关新增 IP 白名单与防刷机制，请及时前往控制台配置。</p>
                        <p class="mb-2">3. 节点系统底层已完成 Lynli Panel 版本迭代，支持一键导入与自动切换。</p>
                        <p class="text-slate-400 mt-4 text-[12px]">发布时间：2026-10-22</p>
                    </div>
                    <button onclick="window.closeNoticeModal()" class="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl text-[15px] active:opacity-80 transition-colors">我知道了</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    const allSvgs = document.querySelectorAll('svg');
    allSvgs.forEach(svg => {
        const isBell = svg.innerHTML.includes('M15 17h5l-1.405-1.405');
        if (isBell) {
            const container = svg.closest('.relative') || svg.parentElement;
            if (container) {
                container.style.cursor = 'pointer';
                container.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const modal = document.getElementById('notice-modal');
                    modal.classList.remove('hidden');
                    modal.classList.add('flex');
                    setTimeout(() => {
                        document.getElementById('notice-modal-inner').classList.replace('scale-95', 'scale-100');
                    }, 10);
                    localStorage.setItem('notice_read', 'true');
                    document.querySelectorAll('.bg-red-500.rounded-full').forEach(dot => dot.style.display = 'none');
                };
            }
        }
    });

    if (localStorage.getItem('notice_read') === 'true') {
        document.querySelectorAll('.bg-red-500.rounded-full').forEach(dot => dot.style.display = 'none');
    }
});

window.closeNoticeModal = function() {
    const modal = document.getElementById('notice-modal');
    const inner = document.getElementById('notice-modal-inner');
    if(inner) inner.classList.replace('scale-100', 'scale-95');
    setTimeout(() => {
        if(modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    }, 200);
};
