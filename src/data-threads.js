const threadsData = {
    title: 'Threads 登录教程',
    subtitle: '依赖 Instagram 账号 · 2FA 验证',
    sections: [
        {
            title: 'Threads 登录前注意',
            content: `
                <div class="p-4 space-y-4">
                    <div class="alert-box">
                        Threads 账号与对应的 Instagram 账号关联，<b>请先成功登录 Instagram</b>（详情教程请看：Instagram 登录教程），再进入 Threads。<br><br>
                        如果 Instagram 本身无法正常登录，Threads 也可能无法正常进入，所以请先完成 Instagram 的账号密码及 2FA 验证。<br><br>
                        建议首次登录时保持设备和网络环境稳定，不要短时间内频繁切换 IP、设备或重复尝试登录。
                    </div>
                </div>
            `
        },
        {
            title: '先查看账号卡密',
            content: `
                <div class="p-4">
                    <p class="text-[13px] text-slate-600 leading-relaxed mb-3">Threads 登录使用的是对应的 Instagram 账号，请先查看系统发货的 Instagram 卡密。</p>
                    <p class="text-[13px] text-slate-600 leading-relaxed mb-3">常见信息包括：Instagram 账号、密码、邮箱、2FA。</p>
                    <p class="text-[13px] text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">Threads 不需要另外再找一套独立账号密码，先登录对应 Instagram 账号即可。</p>
                </div>
            `
        },
        {
            title: '图文教程：Threads 登录步骤',
            content: `
                <div class="p-4 space-y-5">
                    <div class="flex gap-3">
                        <div class="step-num">1</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">先登录 Instagram</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">打开 Instagram App 或 Instagram 网页版，输入卡密中的账号和密码进行登录。</p>
                        </div>
                    </div>
                    
                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">2</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">如提示身份验证，先完成 Instagram 2FA</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed mb-2">如果 Instagram 登录过程中提示输入身份验证码 / Authentication Code，说明账号开启了 2FA。</p>
                            <p class="text-[13px] text-slate-600 leading-relaxed mb-2">将卡密中的 2FA 密钥输入到 2fa.run，获取六位数动态验证码后，再返回 Instagram 填写。</p>
                            <a href="https://2fa.run/" target="_blank" class="link-btn">🔗 打开 2FA 验证网站</a>
                            <p class="text-[13px] text-slate-600 leading-relaxed mt-2">简单流程：卡密 2FA → 2fa.run → 六位动态码 → Instagram</p>
                        </div>
                    </div>

                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">3</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">成功进入 Instagram 首页</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">Instagram 登录成功后，先确认已经正常进入对应账号首页。必须先确保 Instagram 本身已经成功登录，再进入下一步打开 Threads。</p>
                        </div>
                    </div>

                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">4</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">从 Instagram 进入 Threads</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">登录 Instagram 后，在账号主页中找到 Threads / 脆 入口并点击。系统会根据当前已登录的 Instagram 账号，进入对应的 Threads 页面。</p>
                        </div>
                    </div>

                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">5</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">Threads 登录完成</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">成功进入对应 Threads 主页后，即代表登录完成。后续即可正常使用 Threads。</p>
                        </div>
                    </div>
                </div>
            `
        },
        {
            title: 'Threads 登录重要说明',
            content: `
                <div class="p-4">
                    <ul class="text-[13px] text-slate-600 space-y-3 leading-relaxed">
                        <li>1. Threads 与对应的 Instagram 账号关联，请优先确保 Instagram 能正常登录。</li>
                        <li>2. 如果 Instagram 要求 2FA，请先完成 Instagram 身份验证。</li>
                        <li>3. 首次登录时不要频繁切换 IP、设备或重复登录，以免触发平台安全验证。</li>
                        <li>4. 如果 Instagram 已正常登录，但 Threads 暂时无法进入，可以关闭页面后重新打开再尝试。</li>
                    </ul>
                    <div class="alert-box mt-4">
                        <b>Threads 登录完成：</b><br>Instagram 成功登录后，从主页进入 Threads，即可进入对应的 Threads 账号。
                    </div>
                </div>
            `
        }
    ]
};
