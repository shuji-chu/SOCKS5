document.addEventListener('DOMContentLoaded', () => {
    // 防止重复注入
    if (document.getElementById('ai-fab-global')) return;

    const widgetHtml = `
        <!-- AI 智能客服悬浮球 (全站全局唯一) -->
        <div id="ai-fab-global" onclick="window.openGlobalAiChat()" 
             style="position: fixed; right: 16px; bottom: 80px; width: 56px; height: 56px; flex-shrink: 0; border-radius: 50%; z-index: 999999; box-shadow: 0 10px 15px -3px rgba(37,99,235,0.4);"
             class="bg-blue-600 flex items-center justify-center cursor-pointer active:scale-90 transition-transform">
            <svg style="width: 28px; height: 28px; flex-shrink: 0;" class="text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
        </div>

        <!-- AI 聊天弹窗 -->
        <div id="ai-chat-modal-global" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[9999999] hidden justify-end flex-col" onclick="window.closeGlobalAiChat(event)">
            <div class="bg-white w-full h-[85vh] rounded-t-3xl flex flex-col transform translate-y-full transition-transform duration-300" id="ai-chat-panel-global" onclick="event.stopPropagation()">
                <div class="flex justify-between items-center p-4 border-b border-slate-100">
                    <div class="flex items-center gap-2">
                        <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        </div>
                        <div>
                            <h3 class="text-[15px] font-bold text-slate-800">AI 智能客服</h3>
                            <p class="text-[11px] text-green-500">在线 | 秒级响应</p>
                        </div>
                    </div>
                    <button onclick="window.closeGlobalAiChat()" class="text-slate-400 p-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                </div>
                
                <div id="chat-messages-global" class="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
                    <div class="flex gap-2">
                        <div class="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center"><svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg></div>
                        <div class="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm text-[13px] text-slate-700 leading-relaxed">
                            您好，我是 SOCKS5 智能助理。请问有什么可以帮您？<br><br>
                            <div class="flex flex-col gap-2 mt-2">
                                <button onclick="window.askGlobalQuestion('如何对接API？')" class="text-left text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">如何对接API？</button>
                                <button onclick="window.askGlobalQuestion('提现多久到账？')" class="text-left text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">提现多久到账？</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="p-3 border-t border-slate-100 bg-white flex gap-2 pb-safe">
                    <input type="text" id="chat-input-global" onkeypress="window.handleGlobalChatEnter(event)" class="flex-1 bg-slate-100 border-none rounded-full px-4 py-2.5 text-[14px] outline-none" placeholder="请输入您的问题...">
                    <button onclick="window.sendGlobalChatMessage()" class="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center active:scale-95">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', widgetHtml);

    window.openGlobalAiChat = function() {
        const modal = document.getElementById('ai-chat-modal-global');
        const panel = document.getElementById('ai-chat-panel-global');
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        setTimeout(() => { panel.classList.remove('translate-y-full'); }, 10);
        setTimeout(() => {
            const msgs = document.getElementById('chat-messages-global');
            msgs.scrollTop = msgs.scrollHeight;
        }, 300);
    };

    window.closeGlobalAiChat = function(e) {
        if(e && e.target !== e.currentTarget && e.target.tagName !== 'BUTTON' && e.target.tagName !== 'svg') return;
        const panel = document.getElementById('ai-chat-panel-global');
        panel.classList.add('translate-y-full');
        setTimeout(() => {
            const modal = document.getElementById('ai-chat-modal-global');
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }, 300);
    };

    window.handleGlobalChatEnter = function(e) { if (e.key === 'Enter') window.sendGlobalChatMessage(); };
    window.askGlobalQuestion = function(q) { document.getElementById('chat-input-global').value = q; window.sendGlobalChatMessage(); };

    window.sendGlobalChatMessage = function() {
        const input = document.getElementById('chat-input-global');
        const msg = input.value.trim();
        if (!msg) return;
        window.appendGlobalChatMessage('user', msg);
        input.value = '';
        
        setTimeout(() => {
            let reply = "您好，关于您的问题，可以查阅对应的开发者文档，或联系官方客服。";
            if (msg.includes('API')) reply = "对接 API 请前往【开发者控制台】获取您的专属密钥（sk_live_xxx）。每个接口独立密钥，请求头加上 Authorization: Bearer YOUR_API_KEY 即可调用。";
            if (msg.includes('提现')) reply = "提现需在【佣金管理】中申请，最低 15 USDT。请务必填写真实的 TRC20 地址或支付宝账号，财务人工审核后会在 24 小时内打款。";
            window.appendGlobalChatMessage('ai', reply);
        }, 800);
    };

    window.appendGlobalChatMessage = function(role, text) {
        const msgs = document.getElementById('chat-messages-global');
        const isAi = role === 'ai';
        const html = `
            <div class="flex gap-2 ${isAi ? '' : 'flex-row-reverse'}">
                <div class="w-8 h-8 rounded-full ${isAi ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-600'} flex-shrink-0 flex items-center justify-center">
                    ${isAi ? '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>' : '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>'}
                </div>
                <div class="bg-${isAi ? 'white' : 'blue-600'} p-3 rounded-2xl ${isAi ? 'rounded-tl-sm text-slate-700' : 'rounded-tr-sm text-white'} shadow-sm text-[13px] leading-relaxed max-w-[80%]">
                    ${text}
                </div>
            </div>
        `;
        msgs.insertAdjacentHTML('beforeend', html);
        msgs.scrollTop = msgs.scrollHeight;
    };
});
