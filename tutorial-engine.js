// 全自动教程渲染引擎
// 自动给文本生成占位图，自动预留视频教程卡片
function renderAutoTutorial(sections, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = '';

    // 自动生成的视频/图文占位卡片
    const mediaHeader = `
        <div class="bg-slate-100 rounded-xl p-4 mb-4 text-center">
            <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm text-blue-500">
                <svg class="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
            </div>
            <p class="text-[13px] font-bold text-slate-700">视频教程与图文演示</p>
            <p class="text-[11px] text-slate-400 mt-1">点击下方展开对应步骤查看</p>
        </div>
    `;

    sections.forEach((sec, index) => {
        // 自动生成占位图 (基于 placehold.co，纯白底蓝字，极其干净)
        const placeholderImg = `
            <div class="my-4">
                <img src="https://placehold.co/600x350/ffffff/3b82f6?text=${encodeURIComponent(sec.title)}&font=Roboto" class="w-full rounded-lg border border-slate-100 shadow-sm" alt="${sec.title}">
                <p class="text-[11px] text-slate-400 text-center mt-2">点击图片可放大查看</p>
            </div>
        `;

        html += `
            <div class="card overflow-hidden mb-3">
                <button class="w-full text-left p-4 text-[15px] font-bold text-slate-800 flex justify-between items-center bg-white border-b border-slate-100" onclick="toggleAutoAccordion('auto-acc-${index}', this)">
                    <span class="flex items-center gap-2">
                        <span class="w-5 h-5 rounded bg-blue-50 text-blue-600 text-[12px] flex items-center justify-center">${index + 1}</span>
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
