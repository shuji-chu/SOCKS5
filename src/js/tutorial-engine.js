function tutorialNotice(message){var n=document.getElementById('tutorialNotice');if(!n){n=document.createElement('div');n.id='tutorialNotice';n.setAttribute('role','status');n.style.cssText='position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:100001;max-width:calc(100vw - 32px);padding:12px 16px;border-radius:12px;background:#142b43;color:#fff;box-shadow:0 12px 36px #0005';document.body.appendChild(n)}n.textContent=String(message).slice(0,200);n.hidden=false;clearTimeout(window.__tutorialNoticeTimer);window.__tutorialNoticeTimer=setTimeout(function(){n.hidden=true},4000)};
// 教程渲染：只展示真实图文内容，不伪造视频，也不提供规避平台风控的步骤。
function renderAutoTutorial(sections, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const safeNotice = '<div class="alert-box mb-4"><b>账号安全与使用边界：</b>请通过平台官方页面登录并遵守平台规则。不要向客服、AI、陌生网站或浏览器扩展提交密码、Cookie、Token、验证码、2FA 密钥、恢复码或接码链接。教程不保证账号存活、解封、换绑成功或规避风控；商品权限与售后以当前 SKU 订单页明确说明为准。</div>';
    const safeSections = (Array.isArray(sections) ? sections : []).map(function(sec) {
        const title = String(sec && sec.title || '使用说明');
        const riskyTitle = /(养号|防封|住宅\\s*IP|双\\s*ISP|Cookie|Token|接码|换绑|解绑|刷机|SMS\\s*Fee|绕过风控|解锁)/i.test(title);
        let body = String(sec && sec.content || '');
        // 移除要求把完整卡密交给 AI 的交互块，以及已知第三方在线 2FA 工具入口。
        body = body.replace(/<div[^>]*class=["'][^"']*ai-prompt-box[^"']*["'][^>]*>[\\s\\S]*?<\\/div>\\s*<\\/div>/gi, '<p class="text-amber-700">为保护账号安全，请勿将完整卡密提交给 AI 或第三方。请仅在官方页面完成登录和验证。</p>');
        body = body.replace(/<a\\b[^>]*href=["']https?:\\/\\/(?:www\\.)?2fa\\.(?:vip|run)[^"']*["'][^>]*>[\\s\\S]*?<\\/a>/gi, '<span class="text-amber-700">请使用可信的本地身份验证器；不要把密钥粘贴到第三方网站。</span>');
        if (riskyTitle) {
            body = '<div class="p-4 text-[13px] text-slate-600 leading-relaxed space-y-2"><p>此类操作因账号安全、平台规则或商品权限差异，不提供 Cookie/Token 导入、接码代验证、批量养号、规避风控、解绑换绑或刷机解限步骤。</p><p>请仅使用平台官方登录和安全设置。是否包含邮箱、手机号控制权或修改权限，以当前 SKU 的交付清单为准；未明确写出的能力视为未确认。</p><p>遇到验证或限制提示时按平台官方流程处理，并通过订单售后提交脱敏截图。</p></div>';
        }
        return {title:title,content:body};
    });
    let html = safeNotice;
    safeSections.forEach(function(sec,index) {
        html += `
            <div class="card overflow-hidden mb-3 border border-slate-100">
                <button class="w-full text-left p-4 text-[15px] font-bold text-slate-800 flex justify-between items-center bg-white" onclick="toggleAutoAccordion('auto-acc-${index}', this)">
                    <span class="flex items-center gap-2">
                        <span class="w-5 h-5 rounded bg-blue-50 text-blue-600 text-[12px] flex items-center justify-center border border-blue-100">${index + 1}</span>
                        ${sec.title.replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
                    </span>
                    <svg class="w-4 h-4 text-slate-400 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <div id="auto-acc-${index}" class="max-h-0 overflow-hidden transition-all duration-300 bg-white border-t border-slate-100">
                    <div class="p-4 text-[14px] text-slate-600 leading-relaxed">${sec.content}</div>
                </div>
            </div>`;
    });
    container.innerHTML = html;
    const firstBtn = container.querySelector('button');
    if (firstBtn) toggleAutoAccordion('auto-acc-0', firstBtn);
}
function toggleAutoAccordion(id, btn) {
    const content = document.getElementById(id);
    if (!content || !btn) return;
    const icon = btn.querySelector('svg');
    if (content.style.maxHeight && content.style.maxHeight !== '0px') {
        content.style.maxHeight = '0px';
        if (icon) icon.classList.remove('rotate-180');
    } else {
        content.style.maxHeight = content.scrollHeight + 'px';
        if (icon) icon.classList.add('rotate-180');
    }
}
