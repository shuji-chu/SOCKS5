function tutorialNotice(message){var n=document.getElementById('tutorialNotice');if(!n){n=document.createElement('div');n.id='tutorialNotice';n.setAttribute('role','status');n.style.cssText='position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:100001;max-width:calc(100vw - 32px);padding:12px 16px;border-radius:12px;background:#142b43;color:#fff;box-shadow:0 12px 36px #0005';document.body.appendChild(n)}n.textContent=String(message).slice(0,200);n.hidden=false;clearTimeout(window.__tutorialNoticeTimer);window.__tutorialNoticeTimer=setTimeout(function(){n.hidden=true},4000)};
// 全自动教程渲染引擎
function renderAutoTutorial(sections, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = '';

    // 极其逼真的视频教程占位卡片
    const mediaHeader = `
        <div class="bg-slate-800 rounded-xl overflow-hidden mb-6 relative group cursor-pointer shadow-lg" onclick="tutorialNotice('视频教程暂不可用，请先查看下方图文演示。')">
            <!-- 自动生成的高清封面 -->
            <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80" class="w-full h-48 object-cover opacity-60 group-hover:opacity-40 transition">
            <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 text-white shadow-xl group-hover:scale-110 transition">
                    <svg class="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
                </div>
            </div>
            <div class="absolute bottom-3 left-4 right-4 flex justify-between items-center text-white text-[12px] font-medium drop-shadow-md">
                <span>📺 高清视频教程演示</span>
                <span>03:45</span>
            </div>
        </div>
    `;

    sections.forEach((sec, index) => {
        // 自动生成占位图 (基于 placehold.co，纯白底蓝字，写实风格)
        const placeholderImg = `
            <div class="my-4 relative group cursor-pointer" onclick="tutorialNotice('当前暂无视频，请查看图文演示。')">
                <img src="https://placehold.co/600x350/f8fafc/3b82f6?text=${encodeURIComponent(sec.title)}&font=Roboto" class="w-full rounded-lg border border-slate-200 shadow-sm">
                <div class="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition flex items-center justify-center rounded-lg">
                    <span class="opacity-0 group-hover:opacity-100 bg-slate-800 text-white text-[12px] px-3 py-1.5 rounded-full transition">点击图片放大查看</span>
                </div>
            </div>
        `;

        html += `
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

    container.innerHTML = mediaHeader + html;

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
