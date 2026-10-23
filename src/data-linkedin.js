const linkedinData = {
    title: 'Linkedin登录教程',
    subtitle: '建议先观看上方视频教程。 下方整理了卡密解析、2FA说明以及完整图片登录步骤。',
    sections: [
        {
            title: '视频教程与卡密说明',
            content: `
                <div class="p-4 space-y-4">
                    <div class="bg-slate-100 rounded-lg p-4 text-center mb-4">
                        <p class="text-[13px] font-bold text-slate-500">视频教程</p>
                        <p class="text-[12px] text-slate-400 mt-1">点击图片可放大查看</p>
                    </div>

                    <h3 class="text-[15px] font-bold text-slate-800 mb-2">登录前：先看懂卡密</h3>
                    <p class="text-[13px] text-slate-600 leading-relaxed">LinkedIn商品卡密通常包含登录邮箱、登录密码、2FA密钥等信息，不同商品字段可能不同，请以实际发货内容为准。</p>
                    
                    <div class="space-y-2 mt-4 bg-slate-50 p-3 rounded border border-slate-100">
                        <p class="text-[13px] font-bold text-slate-700">卡密拆分</p>
                        <p class="text-[13px] text-slate-600">第1段：LinkedIn登录邮箱</p>
                        <p class="text-[13px] text-slate-600">第2段：LinkedIn登录密码</p>
                        <p class="text-[13px] text-slate-600">第3段：2FA密钥（用于生成6位动态验证码）</p>
                    </div>

                    <div class="alert-box mt-4 text-[13px]">
                        2FA说明：2FA密钥不是验证码，需要通过验证器生成当前6位动态验证码。
                    </div>
                </div>
            `
        },
        {
            title: 'AI卡密解析指令',
            content: `
                <div class="p-4">
                    <div class="ai-prompt-box relative">
                        <button class="copy-btn" onclick="copyAIPrompt(this, 'ai-prompt-linkedin')">复制指令</button>
                        <div id="ai-prompt-linkedin" class="text-[12px] leading-relaxed text-slate-300">
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
            title: '完整图文教程步骤',
            content: `
                <div class="p-4 space-y-5">
                    <p class="text-[13px] font-bold text-slate-800 mb-2">下方为完整 LinkedIn 登录图片教程，点击图片可放大查看。</p>

                    <div class="flex gap-3">
                        <div class="step-num">1</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">STEP 1：查看订单卡密</h4>
                        </div>
                    </div>
                    
                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">2</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">STEP 2：输入账号和密码</h4>
                        </div>
                    </div>

                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">3</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">STEP 3：完成安全验证</h4>
                        </div>
                    </div>

                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">4</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">STEP 4：进入2FA验证</h4>
                        </div>
                    </div>

                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">5</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">STEP 5：填写验证码</h4>
                        </div>
                    </div>

                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">6</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">STEP 6：登录成功</h4>
                        </div>
                    </div>

                    <div class="mt-6 pt-4 border-t border-slate-100 text-[13px] text-slate-500">
                        <p class="mt-4 text-slate-800 font-bold">联系方式</p>
                        <p>官网入口</p>
                        <p>Telegram客服</p>
                    </div>
                </div>
            `
        }
    ]
};
