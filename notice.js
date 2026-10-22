document.addEventListener('DOMContentLoaded', () => {
    // 1. 动态注入磨砂玻璃公告弹窗
    const modalHtml = `
        <div id="notice-modal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] hidden items-center justify-center px-4">
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

    // 2. 智能识别右上角的红点（不需要改 HTML 结构）
    // 我们通过查找 class 包含特定红点样式的元素来定位铃铛
    const dot = document.querySelector('.bg-red-500.rounded-full.border-white');
    
    if (dot) {
        const container = dot.parentElement;
        
        // 点击容器（铃铛图标区域）触发弹窗
        container.onclick = () => {
            document.getElementById('notice-modal').classList.remove('hidden');
            document.getElementById('notice-modal').classList.add('flex');
            setTimeout(() => {
                document.getElementById('notice-modal-inner').classList.replace('scale-95', 'scale-100');
            }, 10);
            
            // 核心逻辑：点击后，存入本地缓存标记为已读，并立刻隐藏红点
            localStorage.setItem('notice_read', 'true');
            dot.style.display = 'none';
        };
        
        // 页面加载时检查：如果之前已经点过，直接隐藏红点
        if (localStorage.getItem('notice_read') === 'true') {
            dot.style.display = 'none';
        }
    }
});

// 挂载到 window，供 onclick 调用
window.closeNoticeModal = function() {
    const modal = document.getElementById('notice-modal');
    const inner = document.getElementById('notice-modal-inner');
    inner.classList.replace('scale-100', 'scale-95');
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }, 200);
};
