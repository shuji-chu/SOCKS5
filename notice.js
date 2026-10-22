document.addEventListener('DOMContentLoaded', () => {
    // 1. 强行注入弹窗
    if (!document.getElementById('notice-modal')) {
        const modalHtml = `
            <div id="notice-modal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[99999] hidden items-center justify-center px-4">
                <div class="bg-white rounded-2xl w-full max-w-[340px] p-5 shadow-xl transform scale-95 transition-transform duration-200" id="notice-modal-inner">
                    <h3 class="text-[17px] font-bold text-slate-800 mb-3 text-center">平台公告</h3>
                    <div class="text-[13px] text-slate-600 mb-5 leading-relaxed max-h-[50vh] overflow-y-auto">
                        <p class="mb-2">⚠️ <b>订单卡密仅保留 30 天：</b><br>逾期系统自动清除且无法恢复，请及时备份！</p>
                        <p class="mb-2">⚠️ <b>【防诈骗提醒】：</b><br>符合售后政策的补号、换号均无需额外付费！请勿通过第三方小程序、私人账户或陌生链接付款，谨防假冒客服诈骗。</p>
                        <p class="mb-2">目前所有支付渠道均不作为客服沟通入口，请直接通过平台在线客服联系处理，请勿在付款备注或支付页面留言。</p>
                        <p class="mb-2">客服不接受任何私下转账，请勿添加私人 TG 或向个人账户付款，所有操作请通过官方平台完成。</p>
                    </div>
                    <button onclick="window.closeNoticeModal()" class="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl text-[15px] active:opacity-80 transition-colors">我知道了</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    // 2. 暴力扫描右上角区域，强行绑定点击
    // 不管原来的图标是带红点、不带红点，只要在 header 里，统统绑定
    const headers = document.querySelectorAll('header');
    if (headers.length > 0) {
        const header = headers[0];
        // 查找所有可能是图标的容器（通常是 relative 或者是 div/a 标签）
        const icons = header.querySelectorAll('.relative, .bell-icon');
        
        let hasBound = false;
        icons.forEach(icon => {
            // 排除掉已经是返回按钮或者文字的元素，尽量找带 svg 的
            if (icon.querySelector('svg') || icon.innerText === '') {
                icon.style.cursor = 'pointer';
                icon.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.openNoticeModal();
                };
                hasBound = true;
                
                // 如果用户没读过，强制显示红点
                let dot = icon.querySelector('.bg-red-500');
                if (!dot) {
                    dot = document.createElement('span');
                    dot.className = 'absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm';
                    icon.appendChild(dot);
                }
                // 检查本地存储
                if (localStorage.getItem('notice_read') === 'true') {
                    dot.style.display = 'none';
                } else {
                    dot.style.display = 'block';
                }
            }
        });

        // 如果页面里根本没有图标（比如某些子页），直接在 header 最右边造一个
        if (!hasBound) {
            const bellHtml = `
                <div class="relative cursor-pointer p-1 active:opacity-60 ml-2" onclick="window.openNoticeModal(event)">
                    <svg class="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                    <span class="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm"></span>
                </div>
            `;
            header.insertAdjacentHTML('beforeend', bellHtml);
            if (localStorage.getItem('notice_read') === 'true') {
                const newDot = header.lastElementChild.querySelector('.bg-red-500');
                if (newDot) newDot.style.display = 'none';
            }
        }
    }
});

window.openNoticeModal = function(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    const modal = document.getElementById('notice-modal');
    const inner = document.getElementById('notice-modal-inner');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => { inner.classList.replace('scale-95', 'scale-100'); }, 10);
    
    localStorage.setItem('notice_read', 'true');
    document.querySelectorAll('.bg-red-500.rounded-full').forEach(dot => dot.style.display = 'none');
};

window.closeNoticeModal = function() {
    const modal = document.getElementById('notice-modal');
    const inner = document.getElementById('notice-modal-inner');
    inner.classList.replace('scale-100', 'scale-95');
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }, 200);
};
