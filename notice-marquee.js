document.addEventListener('DOMContentLoaded', () => {
    // 防止重复注入
    if (document.getElementById('global-marquee')) return;

    const marqueeHtml = `
        <div id="global-marquee" style="position: fixed; top: 0; left: 0; right: 0; background: #fef3c7; border-bottom: 1px solid #fde68a; z-index: 99998; overflow: hidden; height: 32px; display: flex; align-items: center;">
            <marquee scrollamount="4" style="color: #b45309; font-size: 12px; font-weight: bold; width: 100%;">
                ⚠️ 订单卡密仅保留 30 天，逾期系统自动清除且无法恢复，请及时备份！
                ⚠️【防诈骗提醒】符合售后政策的补号、换号均无需额外付费！请勿通过第三方小程序、私人账户或陌生链接付款，谨防假冒客服诈骗。
                目前所有支付渠道均不作为客服沟通入口，请直接通过平台在线客服联系处理，请勿添加私人 TG 或向个人账户付款，所有充值、下单及售后操作请通过官方平台完成。
            </marquee>
        </div>
        <style>
            /* 给 body 加一点顶部内边距，防止挡住原本的 Header */
            body { padding-top: 32px !important; }
            /* 如果原本有 sticky 的 header，调整它的 top 值 */
            header.sticky { top: 32px !important; }
        </style>
    `;
    document.body.insertAdjacentHTML('afterbegin', marqueeHtml);
});
