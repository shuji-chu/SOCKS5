const tiktokData = {
    title: 'TikTok 教程',
    subtitle: '邮箱登入 · Cookie登入 · 防封解疑',
    cookie: [
        {
            title: 'Cookie 登录前必看',
            content: `
                <div class="p-4 space-y-4">
                    <ul class="text-[13px] text-slate-600 space-y-3 list-disc list-inside leading-relaxed">
                        <li>TikTok Cookie 登录方式主要用于 <b>电脑端 Chrome 浏览器</b>，手机端不适用本教程。</li>
                        <li>Cookie 属于账号登录凭证，<b>必须完整使用，不要拆分</b>，也不要发送给无关人员。</li>
                        <li>登录时建议保持设备、IP 和网络环境稳定，不要短时间内频繁切换地区、设备或重复导入。</li>
                    </ul>
                </div>
            `
        },
        {
            title: '图文教程：Cookie 登录 5 步走',
            content: `
                <div class="p-4 space-y-5">
                    <div class="bg-slate-50 border border-slate-100 p-3 rounded-lg mb-2">
                        <p class="text-[13px] font-bold text-slate-800 mb-1">先查看 TikTok 账号卡密</p>
                        <p class="text-[13px] text-slate-600 leading-relaxed">购买 TikTok Cookie 账号后，请先查看系统发货内容，找到对应账号的 Cookie 数据。</p>
                        <p class="text-[12px] text-slate-500 mt-2">常见 Cookie 卡密格式：<br>账号 —— 密码 —— 邮箱 —— 邮箱密码 —— Token —— Cookie 数据</p>
                        <p class="text-[12px] text-amber-600 font-bold mt-2">Cookie 登录重点：Cookie 通常是一段较长的数据，需要完整复制并导入，不要只复制其中一部分。</p>
                    </div>

                    <div class="flex gap-3">
                        <div class="step-num">1</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">打开 TikTok 网页版</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">在电脑端打开 Google Chrome 浏览器，进入 TikTok 官方网页版。不需要先输入账号密码，先停留在 TikTok 网站页面即可。</p>
                        </div>
                    </div>
                    
                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">2</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">安装 Chrome Cookie 插件</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">打开 Chrome 应用商店，安装用于导入 Cookie 的浏览器扩展插件。插件安装完成后，可以在 Chrome 浏览器右上角的扩展程序 中找到。</p>
                        </div>
                    </div>

                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">3</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">在 TikTok 页面打开 Cookie 插件</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed mb-2">保持当前浏览器停留在 TikTok 网页，然后点击 Chrome 右上角的扩展程序，打开刚才安装的 Cookie 插件。</p>
                            <p class="text-[13px] text-red-500 leading-relaxed"><b>注意：</b>需要在 TikTok 网站页面中打开插件并导入 Cookie，不要在其他网站页面操作。</p>
                        </div>
                    </div>

                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">4</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">导入完整 Cookie</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed mb-2">返回购买账号后的卡密，找到对应账号的完整 Cookie 数据。完整复制 Cookie，然后按照插件页面提示进行导入并保存。</p>
                            <div class="bg-blue-50 text-blue-800 text-[12px] p-2 rounded border border-blue-100 mb-2">
                                操作流程：<br>复制完整 Cookie → 打开插件 → 导入 Cookie → 保存 → 刷新 TikTok
                            </div>
                            <p class="text-[13px] text-slate-600 leading-relaxed"><b>Cookie 必须完整复制。</b>如果漏掉部分字段、只复制其中一段或复制了其他卡密内容，都可能导致登录失败。</p>
                        </div>
                    </div>

                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">5</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">刷新 TikTok 页面，完成登录</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">Cookie 导入并保存成功后，刷新当前 TikTok 网页。如果 Cookie 当前有效，页面会直接进入对应 TikTok 账号，即代表 Cookie 登录完成。</p>
                        </div>
                    </div>
                </div>
            `
        },
        {
            title: 'Cookie 导入后没有登录怎么办？',
            content: `
                <div class="p-4">
                    <ul class="text-[13px] text-slate-600 space-y-3 leading-relaxed">
                        <li>1. 检查 Cookie 是否完整复制，避免漏字符或夹带其他卡密内容。</li>
                        <li>2. 确认是在 TikTok 网页中打开插件并导入 Cookie。</li>
                        <li>3. 导入完成后刷新页面，必要时关闭 TikTok 页面后重新打开。</li>
                        <li>4. 如果浏览器中原本登录了其他 TikTok 账号，可以先清理 TikTok 站点缓存后再重新导入。</li>
                        <li>5. 如果页面出现频繁登录、验证异常等提示，不要连续重复导入，可更换稳定网络或等待一段时间后再尝试。</li>
                    </ul>
                </div>
            `
        },
        {
            title: 'Cookie 使用重要说明',
            content: `
                <div class="p-4">
                    <ul class="text-[13px] text-slate-600 space-y-3 leading-relaxed list-disc list-inside">
                        <li>Cookie 属于账号登录凭证，请勿发送给无关人员。</li>
                        <li>Cookie 必须完整导入，不要拆分或只复制部分字段。</li>
                        <li>Cookie 登录主要适用于电脑端 Chrome 浏览器，手机端不支持本教程方式。</li>
                        <li>如果账号登录状态变化、Cookie 失效或平台重新验证登录状态，原 Cookie 可能无法继续使用。</li>
                        <li>登录成功后建议保持设备和网络稳定，不要马上频繁切换 IP、地区或设备。</li>
                    </ul>
                    <div class="alert-box mt-4">
                        <b>TikTok Cookie 登录完成：</b><br>Cookie 导入成功并刷新页面后，能够正常进入对应 TikTok 账号，即代表登录完成。
                    </div>
                </div>
            `
        }
    ],
    email: [
        {
            title: '邮箱登入教程',
            content: `
                <div class="p-4 text-center text-slate-500 text-[13px]">
                    正在整理中，敬请期待...
                </div>
            `
        }
    ],
    changeInfo: [
        {
            title: '换绑邮箱及修改密码',
            content: `
                <div class="p-4 text-center text-slate-500 text-[13px]">
                    正在整理中，敬请期待...
                </div>
            `
        }
    ],
    frequentError: [
        {
            title: '频繁及密码错误解决',
            content: `
                <div class="p-4 text-center text-slate-500 text-[13px]">
                    正在整理中，敬请期待...
                </div>
            `
        }
    ]
};
