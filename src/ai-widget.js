document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('ai-fab-global')) return;

    // 悬浮球保持蓝色
    const fabHtml = `
        <div id="ai-fab-global" onclick="window.openGlobalAiChat()" 
             style="position: fixed; right: 16px; bottom: 80px; width: 56px; height: 56px; flex-shrink: 0; border-radius: 50%; z-index: 999999; box-shadow: 0 10px 15px -3px rgba(37,99,235,0.4);"
             class="bg-blue-600 flex items-center justify-center cursor-pointer active:scale-90 transition-transform">
            <svg style="width: 28px; height: 28px; flex-shrink: 0;" class="text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', fabHtml);

    // 弹窗 UI (完全仿照大号商绿色风格)
    const modalHtml = `
        <div id="ai-chat-modal-global" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[9999999] hidden justify-end flex-col" onclick="window.closeGlobalAiChat(event)">
            <div class="bg-[#f4f5f7] w-full h-[90vh] rounded-t-2xl flex flex-col transform translate-y-full transition-transform duration-300" id="ai-chat-panel-global" onclick="event.stopPropagation()">
                
                <!-- 顶部绿色 Header -->
                <div class="bg-[#48b067] text-white p-4 rounded-t-2xl relative">
                    <button onclick="window.closeGlobalAiChat()" class="absolute right-3 top-3 bg-white text-[#48b067] rounded p-1 shadow-sm">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                    <div class="flex items-center gap-2 mb-1">
                        <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                        </div>
                        <div>
                            <h3 class="text-[16px] font-bold">在线客服 (工作时间: 10:00---22:00)</h3>
                            <p class="text-[11px] text-white/80 mt-0.5">客服通常在 6 分钟内回复</p>
                        </div>
                    </div>
                </div>
                
                <!-- 聊天记录区 -->
                <div id="chat-messages-global" class="flex-1 p-3 overflow-y-auto space-y-4">
                    
                    <!-- 机器人欢迎语 (长文本) -->
                    <div class="flex gap-2">
                        <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex-shrink-0 flex items-center justify-center font-bold text-[14px]">大</div>
                        <div class="bg-white p-3 rounded-xl rounded-tl-sm shadow-sm text-[13px] text-slate-700 leading-relaxed max-w-[85%]">
                            <p class="font-bold mb-2">请发送订单号或卡密信息并描述遇到的问题以提供高效售后。</p>
                            <p>1：本站7*24小时自助购买，自动发货。</p>
                            <p>2：购买金额小于1元或过大请注册会员充值后购买。</p>
                            <p>3：下单后在网站的右上方有“订单查询”查找卡密信息。</p>
                            <p>4：卡密格式和教程在每个商品的详情。</p>
                            <p class="text-red-500 font-bold">5：本站不会主动联系任何人，主动联系的都是骗子。</p>
                            <p>6：售后时间：订单时间开始24小时内。</p>
                            <p>7：服务时间是：10:00-22:00点 夜间信息会在第二天10点回复。</p>
                        </div>
                    </div>
                </div>

                <!-- 底部输入框 -->
                <div class="bg-white p-3 border-t border-slate-200 flex gap-2 items-center pb-safe">
                    <input type="text" id="chat-input-global" onkeypress="window.handleGlobalChatEnter(event)" class="flex-1 bg-slate-100 border-none rounded-md px-3 py-2.5 text-[14px] outline-none" placeholder="输入您的问题...">
                    <button class="text-slate-400 p-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                    </button>
                    <button onclick="window.sendGlobalChatMessage()" class="bg-slate-200 text-slate-500 rounded px-4 py-2 text-[14px] font-bold active:bg-slate-300">
                        发送
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

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

    window.sendGlobalChatMessage = function() {
        const input = document.getElementById('chat-input-global');
        const msg = input.value.trim();
        if (!msg) return;
        window.appendGlobalChatMessage('user', msg);
        input.value = '';
        
        // 模拟人工回复
        setTimeout(() => {
            let reply = "您好，客服已收到您的消息。如果是订单问题，请直接发送您的订单号或卡密，我们会尽快为您核实。";
            if (msg.includes('API')) reply = "对接 API 请前往【开发者控制台】获取您的专属密钥。详细文档请访问帮助中心。";
            if (msg.includes('充值') || msg.includes('支付')) reply = "本站支持支付宝和 USDT。若金额较小，请先注册并充值余额后再购买。";
            window.appendGlobalChatMessage('ai', reply);
        }, 1200);
    };

    window.appendGlobalChatMessage = function(role, text) {
        const msgs = document.getElementById('chat-messages-global');
        const isAi = role === 'ai';
        const html = `
            <div class="flex gap-2 ${isAi ? '' : 'flex-row-reverse'}">
                <div class="w-8 h-8 rounded-full ${isAi ? 'bg-blue-100 text-blue-600' : 'bg-slate-300 text-slate-600'} flex-shrink-0 flex items-center justify-center font-bold text-[14px]">
                    ${isAi ? '大' : '我'}
                </div>
                <div class="bg-${isAi ? 'white' : '#95ec69'} p-3 rounded-xl ${isAi ? 'rounded-tl-sm text-slate-700' : 'rounded-tr-sm text-black'} shadow-sm text-[14px] leading-relaxed max-w-[80%]">
                    ${text}
                </div>
            </div>
        `;
        msgs.insertAdjacentHTML('beforeend', html);
        msgs.scrollTop = msgs.scrollHeight;
    };
});
