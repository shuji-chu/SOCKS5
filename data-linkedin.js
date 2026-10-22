const linkedinData = {
    title: 'LinkedIn 登录教程',
    subtitle: '卡密解析 · 2FA验证 · 图文步骤',
    sections: [
        {
            title: '登录前：先看懂卡密',
            content: `
                <div class="p-4 space-y-4">
                    <p class="text-[13px] text-slate-600 leading-relaxed">LinkedIn 商品卡密通常包含 <b>登录邮箱、登录密码、2FA密钥</b> 等信息，不同商品字段可能不同，请以实际发货内容为准。</p>
                    
                    <div class="space-y-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <p class="text-[13px] font-bold text-slate-700 mb-2">卡密拆分：</p>
                        <p class="text-[13px] text-slate-600"><b>第1段：</b>LinkedIn登录邮箱</p>
                        <p class="text-[13px] text-slate-600"><b>第2段：</b>LinkedIn登录密码</p>
                        <p class="text-[13px] text-slate-600"><b>第3段：</b>2FA密钥（用于生成6位动态验证码）</p>
                    </div>

                    <div class="alert-box mt-2 text-[12px]">
                        <b>2FA说明：</b>2FA密钥不是验证码，需要通过验证器生成当前6位动态验证码。
                    </div>
                </div>
            `
        },
        {
            title: 'AI 卡密解析指令',
            content: `
                <div class="p-4">
                    <div class="ai-prompt-box relative">
                        <button class="copy-btn" onclick="copyAIPrompt(this, 'ai-prompt-linkedin')">复制指令</button>
                        <div id="ai-prompt-linkedin" class="text-[11px] leading-relaxed text-slate-300">
请帮我解析下面这条 LinkedIn 商品卡密，不要修改、补全或猜测不存在的信息。

请按照以下格式输出：
LinkedIn登录邮箱：
LinkedIn登录密码：
2FA密钥：
其他附加信息：

我的完整卡密：
【粘贴完整卡密】
                        </div>
                    </div>
                </div>
            `
        },
        {
            title: '图文教程：登录步骤',
            content: `
                <div class="p-4 space-y-5">
                    <div class="flex gap-3">
                        <div class="step-num">1</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">查看订单卡密</h4>
                        </div>
                    </div>
                    
                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">2</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">输入账号和密码</h4>
                        </div>
                    </div>

                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">3</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">完成安全验证</h4>
                        </div>
                    </div>

                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">4</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">进入 2FA 验证</h4>
                        </div>
                    </div>

                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">5</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">填写验证码</h4>
                        </div>
                    </div>

                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">6</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">登录成功</h4>
                        </div>
                    </div>
                </div>
            `
        }
    ]
};
