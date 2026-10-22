const discordData = {
    title: 'Discord 教程',
    subtitle: 'Token码登录 · 账号密码登录 · 邮件验证',
    password: [
        {
            title: '账号密码登录前必看',
            content: `
                <div class="p-4 space-y-4">
                    <div class="bg-blue-50 border border-blue-100 p-4 rounded-lg text-[14px] text-blue-800 font-bold">
                        每个 Discord 在新电脑首次用账号密码登录，100% 都需要接邮件验证。
                    </div>
                    <p class="text-[13px] text-slate-600 leading-relaxed mt-2">
                        <b>💡 建议：</b>使用稳定 IP 登录，首次登录后保持在线一段时间。
                    </p>
                </div>
            `
        },
        {
            title: '图文教程：账号密码登录步骤',
            content: `
                <div class="p-4 space-y-5">
                    <div class="flex gap-3">
                        <div class="step-num">1</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">输入账号密码，提示需要邮件确认</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">在 Discord 登录页输入完账号密码，提示新登录位置需要接邮件确认。</p>
                        </div>
                    </div>
                    
                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">2</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">打开邮箱，获取验证邮件</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">打开邮箱所在网页。例如账号 <b>shnfcbtlws@rambler.ru</b>，邮箱网址通常为 @ 后面的 rambler.ru。</p>
                        </div>
                    </div>
                </div>
            `
        }
    ],
    token: [
        {
            title: 'Token 登录前必看',
            content: `
                <div class="p-4 space-y-4">
                    <p class="text-[13px] text-slate-600 leading-relaxed">
                        <b>💡 建议：</b>使用稳定 IP 登录，首次登录后保持在线一段时间。
                    </p>
                    <p class="text-[13px] text-slate-600 leading-relaxed mt-2">
                        本店所有类型账号都支持 Token 登录。
                    </p>
                </div>
            `
        },
        {
            title: '图文教程：Token 码登录步骤',
            content: `
                <div class="p-4 space-y-5">
                    <div class="flex gap-3">
                        <div class="step-num">1</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">安装 Discord Token Login 插件</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed mb-2">进入 Chrome 应用商店搜索 Discord Token Login 插件并安装。</p>
                            <a href="https://chromewebstore.google.com/" target="_blank" class="link-btn">🔗 Discord Token Login 插件</a>
                        </div>
                    </div>
                    
                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">2</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">打开 Discord 登录页面</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">Token 登录必须要在 Discord 登录页面才可以进行。</p>
                        </div>
                    </div>

                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">3</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">找到 Token</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">Token 通常是最后一行 <b>MTAx</b> 开头的一串数据。</p>
                        </div>
                    </div>

                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">4</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">输入 Token，点击 Login</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">将复制的 Token 填入插件，点击 Login 即可完成登录。</p>
                        </div>
                    </div>
                </div>
            `
        },
        {
            title: '卡密格式说明',
            content: `
                <div class="p-4">
                    <div class="alert-box text-[13px]">
                        卡密分隔符号会不一致，有时候是 <b>:</b> 有时候是 <b>;</b> 有时候是 <b>｜</b> 有时候是 <b>——</b>。<br><br>
                        如果看不懂可以复制卡密 + 提示词发送客服，提示词：<b>Discord 账号分卡密</b>。
                    </div>
                </div>
            `
        }
    ]
};
