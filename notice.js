document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 终极公告系统已启动！');

    // 1. 强行注入弹窗内容
    if (!document.getElementById('notice-modal')) {
        const modalHtml = `
            <div id="notice-modal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999999] hidden items-center justify-center px-4">
                <div class="bg-white rounded-2xl w-full max-w-[340px] p-5 shadow-2xl transform scale-95 transition-transform duration-200" id="notice-modal-inner">
                    <h3 class="text-[17px] font-bold text-slate-800 mb-3 text-center">平台公告</h3>
                    <div class="text-[13px] text-slate-600 mb-5 leading-relaxed max-h-[50vh] overflow-y-auto text-left">
                        <p class="mb-2">⚠️ <b>订单卡密仅保留 30 天：</b><br>逾期系统自动清除且无法恢复，请及时备份！</p>
                        <p class="mb-2">⚠️ <b>【防诈骗提醒】：</b><br>符合售后政策的补号、换号均无需额外付费！请勿通过第三方小程序、私人账户或陌生链接付款，谨防假冒客服诈骗。</p>
                        <p class="mb-2">目前所有支付渠道均不作为客服沟通入口，请直接通过平台在线客服联系处理。</p>
                    </div>
                    <button onclick="window.closeNoticeModal()" class="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl text-[15px] active:opacity-80 transition-colors">我知道了</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    // 2. 强行造一个绝对透明的点击遮罩，贴在右上角
    if (!document.getElementById('ghost-notice-btn')) {
        const ghostBtn = document.createElement('div');
        ghostBtn.id = 'ghost-notice-btn';
        // 绝对定位，宽60高60，贴在右上角，层级极高（但略低于弹窗），背景透明
        ghostBtn.style.cssText = 'position: fixed; top: 0; right: 0; width: 60px; height: 60px; z-index: 99999; cursor: pointer;';
        ghostBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            window.openNoticeModal();
        };
        document.body.appendChild(ghostBtn);
    }

    // 3. 处理红点（如果你页面本来有，就接管它，如果没有就不管了，反正透明层能点）
    if (localStorage.getItem('notice_read') !== 'true') {
        const redDots = document.querySelectorAll('.bg-red-500');
        redDots.forEach(dot => dot.style.display = 'block');
    } else {
        const redDots = document.querySelectorAll('.bg-red-500');
        redDots.forEach(dot => dot.style.display = 'none');
    }
});

window.openNoticeModal = function(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    const modal = document.getElementById('notice-modal');
    const inner = document.getElementById('notice-modal-inner');
    if(modal && inner) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        setTimeout(() => { inner.classList.replace('scale-95', 'scale-100'); }, 10);
        
        localStorage.setItem('notice_read', 'true');
        document.querySelectorAll('.bg-red-500').forEach(dot => dot.style.display = 'none');
    }
};

window.closeNoticeModal = function() {
    const modal = document.getElementById('notice-modal');
    const inner = document.getElementById('notice-modal-inner');
    if(modal && inner) {
        inner.classList.replace('scale-100', 'scale-95');
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }, 200);
    }
};
