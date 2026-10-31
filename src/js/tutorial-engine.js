function tutorialNotice(message){var n=document.getElementById('tutorialNotice');if(!n){n=document.createElement('div');n.id='tutorialNotice';n.setAttribute('role','status');n.style.cssText='position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:100001;max-width:calc(100vw - 32px);padding:12px 16px;border-radius:12px;background:#142b43;color:#fff;box-shadow:0 12px 36px #0005';document.body.appendChild(n)}n.textContent=String(message).slice(0,200);n.hidden=false;clearTimeout(window.__tutorialNoticeTimer);window.__tutorialNoticeTimer=setTimeout(function(){n.hidden=true},4000)};
// 全自动教程渲染引擎
function renderAutoTutorial(sections, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = '';

    // 极其逼真的视频教程占位卡片
    // 不再渲染伪视频封面或虚构时长；当前教程仅展示真实图文内容。
    sections.forEach((sec, index) => {
        // 自动生成占位图 (基于 placehold.co，纯白底蓝字，写实风格)
        const placeholderImg = '';

        html += 
            <div class="card overflow-hidden mb-3 border border-slate-100">
                <button class="w-full text-left p-4 text-[15px] font-bold text-slate-800 flex justify-between items-center bg-white" onclick="toggleAutoAccordion('auto-acc-${index}', this)">
                    <span class="flex items-center gap-2">
                        <span class="w-5 h-5 rounded bg-blue-50 text-blue-600 text-[12px] flex items-center justify-center border border-blue-100">${index + 1}</span>
                        ${sec.title}
                    </span>
                    <svg class="w-4 h-4 text-slate-400 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <div id="auto-acc-${index}" class="max-h-0 overflow-hidden transition-all duration-300 bg-white border-t border-slate-100">
                    <div class="p-4 text-[14px] text-slate-600 leading-relaxed">
                        ${sec.content}
                        ${placeholderImg}
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;

    // 默认展开第一项
    const firstBtn = container.querySelector('button');
    if (firstBtn) toggleAutoAccordion('auto-acc-0', firstBtn);
}

function toggleAutoAccordion(id, btn) {
    const content = document.getElementById(id);
    const icon = btn.querySelector('svg');
    if (content.style.maxHeight && content.style.maxHeight !== '0px') {
        content.style.maxHeight = '0px';
        icon.classList.remove('rotate-180');
    } else {
        content.style.maxHeight = content.scrollHeight + 'px';
        icon.classList.add('rotate-180');
    }
}
