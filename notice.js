document.addEventListener('DOMContentLoaded', () => {
    // 1. 注入公告弹窗
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

    // 2. 智能寻找页面右上角的铃铛
    // 我们查找所有包含铃铛 SVG 路径的父容器（不管是 a 还是 div）
    const allSvgs = document.querySelectorAll('svg');
    allSvgs.forEach(svg => {
        // 通过 path 的 d 属性特征来识别是不是铃铛
        const isBell = svg.innerHTML.includes('M15 17h5l-1.405-1.405');
        if (isBell) {
            const container = svg.closest('.relative') || svg.parentElement;
            if (container) {
                container.style.cursor = 'pointer';
                container.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // 弹出公告
                    const modal = document.getElementById('notice-modal');
                    modal.classList.remove('hidden');
                    modal.classList.add('flex');
                    setTimeout(() => {
                        document.getElementById('notice-modal-inner').classList.replace('scale-95', 'scale-100');
                    }, 10);
                    
                    // 标记已读并隐藏所有红点
                    localStorage.setItem('notice_read', 'true');
                    const dots = document.querySelectorAll('.bg-red-500.rounded-full');
                    dots.forEach(dot => dot.style.display = 'none');
                };
            }
        }
    });

    // 初始化检查已读状态，如果已读，隐藏所有红点
    if (localStorage.getItem('notice_read') === 'true') {
        const dots = document.querySelectorAll('.bg-red-500.rounded-full');
        dots.forEach(dot => dot.style.display = 'none');
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
