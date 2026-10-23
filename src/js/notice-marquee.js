document.addEventListener('DOMContentLoaded', () => {
    // 1. 注入全局公告弹窗
    if (!document.getElementById('notice-modal')) {
        const modalHtml = `
            <div id="notice-modal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[99999] hidden items-center justify-center px-4">
                <div class="bg-white rounded-2xl w-full max-w-[340px] p-5 shadow-xl transform scale-95 transition-transform duration-200" id="notice-modal-inner">
                    <h3 class="text-[17px] font-bold text-slate-800 mb-3 text-center">平台公告</h3>
                    <div class="text-[13px] text-slate-600 mb-5 leading-relaxed max-h-[50vh] overflow-y-auto">
                        <p class="mb-2">⚠️ <b>订单卡密仅保留 30 天：</b><br>逾期系统自动清除且无法恢复，请及时备份！</p>
                        <p class="mb-2">⚠️ <b>【防诈骗提醒】：</b><br>符合售后政策的补号、换号均无需额外付费！请勿通过第三方小程序、私人账户或陌生链接付款，谨防假冒客服诈骗。</p>
                        <p class="mb-2">目前所有支付渠道均不作为客服沟通入口，也无法通过支付渠道回复相关信息。如有订单问题、售后需求或其他问题，请直接通过平台在线客服联系处理，请勿在付款备注或支付页面留言等待回复。</p>
                        <p class="mb-2">客服不接受任何私下转账，请勿添加私人 TG 或向个人账户付款，谨防骗子冒充客服，所有充值、下单及售后操作请通过官方平台完成。</p>
                    </div>
                    <button onclick="window.closeNoticeModal()" class="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl text-[15px] active:opacity-80 transition-colors">我知道了</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    // 2. 强行寻找右上角，如果没有红点，给他造一个
    // 寻找 header 里面最右边的元素
    const headers = document.querySelectorAll('header');
    if (headers.length > 0) {
        const header = headers[0];
        const lastChild = header.lastElementChild;
        
        // 如果最后一个元素不是我们注入的铃铛
        if (lastChild && !lastChild.classList.contains('global-bell-container')) {
            // 造一个带红点的铃铛容器
            const bellHtml = `
                <div class="global-bell-container relative cursor-pointer p-1 active:opacity-60 ml-2" onclick="window.openNoticeModal(event)">
                    <svg class="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                    <span id="global-bell-dot" class="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm" style="display: none;"></span>
                </div>
            `;
            header.insertAdjacentHTML('beforeend', bellHtml);
        }
    }

    // 3. 检查已读状态
    const bellDot = document.getElementById('global-bell-dot');
    if (localStorage.getItem('notice_read') === 'true') {
        if (bellDot) bellDot.style.display = 'none';
    } else {
        if (bellDot) bellDot.style.display = 'block';
    }
});

window.openNoticeModal = function(e) {
    if (e) e.stopPropagation();
    const modal = document.getElementById('notice-modal');
    const inner = document.getElementById('notice-modal-inner');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => {
        inner.classList.replace('scale-95', 'scale-100');
    }, 10);
    
    // 标记已读
    localStorage.setItem('notice_read', 'true');
    const bellDot = document.getElementById('global-bell-dot');
    if (bellDot) bellDot.style.display = 'none';
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
