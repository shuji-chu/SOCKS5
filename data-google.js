const googleData = {
    title: 'Google 谷歌教程',
    subtitle: '辅助邮箱 · 2FA验证 · 原始接码',
    sections: [
        {
            title: '登录前：先看懂卡密',
            content: `
                <div class="p-4 space-y-4">
                    <p class="text-[13px] text-slate-600 leading-relaxed">Google / Gmail 商品发货后，卡密通常会包含 <b>Google 邮箱、登录密码、辅助邮箱、2FA 密钥、原始手机号接码链接</b> 等信息。不同商品或批次的字段可能略有不同，请以实际发货内容为准。</p>
                    
                    <div class="bg-white p-3 rounded border border-slate-200">
                        <p class="text-[12px] font-bold text-slate-800 mb-1">卡密示例：</p>
                        <p class="font-mono text-[11px] text-slate-500 break-all leading-relaxed">example.account@gmail.com----GooglePwd123----backup3147@examplemail.com----JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP----https://example.com/GetCodeSMS?token=xxxxxxxxxxxxxxxx</p>
                    </div>

                    <div class="space-y-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <p class="text-[13px] font-bold text-slate-700 mb-2">这条卡密拆开后是：</p>
                        <p class="text-[13px] text-slate-600"><b>Google 邮箱：</b>example.account@gmail.com</p>
                        <p class="text-[13px] text-slate-600"><b>登录密码：</b>GooglePwd123</p>
                        <p class="text-[13px] text-slate-600"><b>辅助 / 恢复邮箱：</b>backup3147@examplemail.com</p>
                        <p class="text-[13px] text-slate-600"><b>2FA 密钥：</b>JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP</p>
                        <p class="text-[13px] text-slate-600"><b>原始手机号接码链接：</b>https://example.com/GetCodeSMS?token=...</p>
                    </div>

                    <div class="alert-box mt-2 text-[12px]">
                        注意：不同批次卡密的分隔符可能不同，不要只按照符号数量判断。其中带 @ 的通常是邮箱；约 32 位的大写字母数字组合通常是 2FA 密钥；以 http:// 或 https:// 开头并带 GetCodeSMS / token 的通常是原始手机号接码链接。
                    </div>
                </div>
            `
        },
        {
            title: '看不懂卡密？让 AI 帮你解析',
            content: `
                <div class="p-4">
                    <p class="text-[13px] text-slate-600 leading-relaxed mb-3">直接复制完整卡密给 AI，并附上下面这段指令即可。</p>
                    <div class="ai-prompt-box relative">
                        <button class="copy-btn" onclick="copyAIPrompt(this)">复制指令</button>
                        <div id="ai-prompt-text-google" class="text-[11px] leading-relaxed text-slate-300">
请帮我解析下面这条 Google / Gmail 商品卡密，不要修改、补全或猜测不存在的信息。

卡密中可能包含 Google 邮箱、登录密码、辅助/恢复邮箱、2FA 密钥、原始手机号接码链接以及其他附加信息。

请根据内容特征判断，不要只按照固定位置或分隔符数量判断：
· 带 @ 且属于 gmail.com 的内容优先判断为 Google 登录邮箱；
· 登录邮箱后的短字符串通常是 Google 登录密码；
· 另一个带 @ 的邮箱通常是辅助 / 恢复邮箱；
· 约 32 位的大写字母和数字组合通常是 2FA 密钥；
· 以 http:// 或 https:// 开头，并包含 GetCodeSMS、token 等内容的链接优先判断为原始手机号接码链接；
· 不同商品字段可能不同，没有出现的字段不要自行补充；
· 无法确定的内容请写“无法确定”，不要猜测。

请按照以下格式输出：
Google邮箱：
登录密码：
辅助/恢复邮箱：
2FA：
原始手机号接码链接：
其他信息：

我的完整卡密：
【粘贴完整卡密】
                        </div>
                    </div>
                </div>
            `
        },
        {
            title: '完整图文登录步骤（8 步）',
            content: `
                <div class="p-4 space-y-5">
                    <div class="flex gap-3">
                        <div class="step-num">1</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">打开 Google 登录页，输入邮箱</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">在 Chrome 或 Google 登录页面中，输入卡密里的 Google 邮箱，然后点击下一步。</p>
                        </div>
                    </div>
                    
                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">2</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">输入 Google 登录密码</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">填写卡密中的 Google 登录密码，确认无误后继续下一步。</p>
                        </div>
                    </div>

                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">3</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">出现 2FA 验证时，使用卡密中的 2FA</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">如果 Google 要求输入身份验证器验证码，请复制卡密中的 2FA 密钥，用于生成当前 6 位动态验证码。</p>
                        </div>
                    </div>

                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">4</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">打开 2FA 工具获取验证码</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed mb-2">将 2FA 密钥粘贴到 2FA 工具中，获取当前的 6 位动态验证码，然后返回 Google 验证页面填写。</p>
                            <a href="https://2fa.vip/index.html" target="_blank" class="link-btn">🔗 2FA 工具网页版</a>
                        </div>
                    </div>

                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">5</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">如果出现手机号验证</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">部分账号登录过程中还会出现手机验证码。出现下图页面时，按照页面提示发送验证码。</p>
                        </div>
                    </div>

                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">6</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">返回卡密，打开原始手机号接码链接</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed mb-2">回到订单卡密，找到最后面的原始手机号接码链接。链接通常以 http / https 开头，并带有 GetCodeSMS、token 等参数。打开该链接查看 Google 发送的短信验证码。</p>
                            <p class="text-[12px] text-slate-500 bg-slate-50 p-2 rounded">原始手机号接码链接通常是一次性辅助验证信息。如果商品说明中没有提供该链接，则以实际卡密和页面验证方式为准。</p>
                        </div>
                    </div>

                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">7</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">填写短信验证码</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">从接码链接获取验证码后，返回 Google 页面填写验证码并继续。如果验证码已经过期，请以接码页面最新收到的验证码为准。</p>
                        </div>
                    </div>

                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">8</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">登录成功</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">验证完成并正常进入 Google / Chrome 账号页面，即代表本次登录成功。Google 不同版本的页面可能略有差异，只要已经正常进入账号即可。</p>
                        </div>
                    </div>
                </div>
            `
        }
    ]
};
