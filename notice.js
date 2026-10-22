document.addEventListener('DOMContentLoaded', () => {
    // 注入弹窗
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

    // 智能寻找右上角的图标区域
    // 无论是首页还是我的页，右上角肯定是一个 icon，我们直接抓取包含 svg 的 relative 容器
    const relativeContainers = document.querySelectorAll('.relative');
    let foundBell = false;

    relativeContainers.forEach(container => {
        // 如果容器里含有 SVG（铃铛），并且不是底部导航，我们就当作是公告图标
        if (container.querySelector('svg') && !container.closest('nav') && !container.closest('.bottom-tab')) {
            foundBell = true;
            container.style.cursor = 'pointer';
            
            // 绑定点击事件
            container.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // 弹窗
                const modal = document.getElementById('notice-modal');
                modal.classList.remove('hidden');
                modal.classList.add('flex');
                setTimeout(() => {
                    document.getElementById('notice-modal-inner').classList.replace('scale-95', 'scale-100');
                }, 10);
                
                // 标记已读，隐藏红点
                localStorage.setItem('notice_read', 'true');
                const dot = container.querySelector('.bg-red-500');
                if (dot) dot.style.display = 'none';
            };
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
