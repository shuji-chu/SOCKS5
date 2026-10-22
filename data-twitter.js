const twitterData = {
    title: 'Twitter / X 教程',
    subtitle: '2FA登录 · Token登录 · 防封必看',
    twoFactor: [
        {
            title: 'Android 登录出现 Attestation Denied 报错怎么办？',
            content: `
                <div class="p-4 space-y-4">
                    <p class="text-[13px] text-slate-600 leading-relaxed">如果登录 X（Twitter）输入密码后出现 attestationdenied / attestation denied，一般属于 Android 设备完整性验证失败，通常不是账号密码错误。</p>
                    <div class="bg-blue-50 border border-blue-100 rounded-lg p-4 text-[13px] text-blue-800 leading-relaxed">
                        <p class="font-bold mb-2">建议解决方法：</p>
                        <p>1. 卸载 X，并清理 X 应用数据。</p>
                        <p>2. 检查并更新 Google Play Store、Google Play Services 和 Android System WebView。</p>
                        <p>3. 通过 Google Play 商店重新下载安装 X。</p>
                        <p>4. 关闭开发者模式和 USB 调试，并保持网络稳定，不要频繁切换 IP 或网络。</p>
                        <p>5. 如果设备存在 Root 或系统环境被修改，建议恢复正常系统环境后再尝试登录。</p>
                    </div>
                    <p class="text-[13px] text-slate-600 leading-relaxed">如果以上方法处理后仍然出现该报错，通常说明当前设备环境仍未通过完整性验证，建议更换 Google 服务正常、系统环境完整的设备后重新登录。</p>
                </div>
            `
        },
        {
            title: '登录前必看：防封与 Token 保护',
            content: `
                <div class="p-4">
                    <div class="alert-box">
                        Twitter / X 账号登录后，<b>请勿随意退出账号，也不要直接修改账号密码。</b><br><br>
                        退出账号或修改密码后，账号对应的 Token 可能发生变化或失效，原来的 Token 可能无法继续使用。<br><br>
                        如果只是暂时不需要使用账号，建议直接关闭浏览器或清理对应浏览器缓存，不要主动点击 Twitter / X 的退出登录。
                    </div>
                </div>
            `
        },
        {
            title: '图文教程：2FA 登录步骤',
            content: `
                <div class="p-4 space-y-5">
                    <div class="flex gap-3">
                        <div class="step-num">1</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">输入账号密码</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">打开 Twitter / X 官网，正常输入购买账号后获得的账号和密码进行登录。</p>
                            <p class="text-[13px] text-slate-600 leading-relaxed mt-2">输入账号密码后，如果页面提示输入两步验证码 / Authentication Code，说明当前账号开启了二步验证，需要继续获取 2FA 验证码。</p>
                        </div>
                    </div>
                    
                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">2</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">使用 2FA 获取验证码</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed mb-2">从发货卡密中找到账号对应的 2FA 密钥。然后打开 2FA 验证网站：</p>
                            <a href="https://2fa.run/" target="_blank" class="link-btn">🔗 https://2fa.run/</a>
                            <p class="text-[13px] text-slate-600 leading-relaxed mt-2">将卡密中的 2FA 密钥复制到网站中，即可生成当前登录需要的验证码。</p>
                            <p class="text-[12px] text-amber-600 bg-amber-50 p-2 rounded mt-2 border border-amber-100">注意区分 2FA 和 Token。两者用途不同，不要把 Token 当成 2FA 填入验证码页面。</p>
                        </div>
                    </div>

                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">3</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">输入 2FA 验证码</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">将 2FA 网站生成的验证码复制下来，返回 Twitter / X 登录页面。将验证码填写到 Code / Authentication Code 输入框中，然后继续下一步。</p>
                            <p class="text-[13px] text-slate-600 leading-relaxed mt-2 text-red-500">2FA 验证码会定时刷新。如果当前验证码已经失效，重新生成一个新的验证码再填写即可。</p>
                        </div>
                    </div>

                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">4</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">登录完成</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">完成账号密码和 2FA 验证后，即可正常进入 Twitter / X 账号。</p>
                        </div>
                    </div>
                </div>
            `
        },
        {
            title: '卡密与登录重要说明',
            content: `
                <div class="p-4">
                    <ul class="text-[13px] text-slate-600 space-y-3 list-disc list-inside leading-relaxed">
                        <li>卡密中的分隔符并不固定，可能是 <b>:、 ;、 |、 ｜、 ——</b> 等格式。</li>
                        <li>请注意分辨 <b>账号、密码、2FA 和 Token</b>，不同数据的用途不同。</li>
                        <li>退出账号或修改密码可能导致 Token 改变或失效，登录成功后请谨慎操作。</li>
                        <li>如果看不懂卡密格式，可以直接复制完整卡密发送给客服，并发送提示词：<b>推特账号分卡密</b>。</li>
                    </ul>
                </div>
            `
        }
    ],
    token: [
        {
            title: 'Token 登录前必看',
            content: `
                <div class="p-4">
                    <div class="alert-box">
                        Twitter / X 账号通过 Token 登录后，<b>请勿主动退出账号，也不要直接修改账号密码。</b><br><br>
                        登出账号或修改密码后，账号对应的 Token 可能发生变化或失效，原来的 Token 可能无法继续使用。<br><br>
                        如果只是暂时不需要使用账号，建议直接关闭浏览器。如需清除当前登录环境，建议清理浏览器缓存，不要主动点击 Twitter / X 的“退出登录”。
                    </div>
                </div>
            `
        },
        {
            title: '先看懂 Twitter / X 卡密信息',
            content: `
                <div class="p-4 space-y-4">
                    <p class="text-[13px] text-slate-600 leading-relaxed">Twitter / X 不同批次账号的发货格式可能不同，卡密分隔符常见有 <b>冒号 :、 ----、 ——</b> 等格式。</p>
                    <p class="text-[13px] text-slate-600 leading-relaxed">使用 Token 登录时，<b>不需要逐项解析整条卡密，主要找到 Token / auth_token 即可。</b></p>
                    
                    <div class="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-3">
                        <div>
                            <p class="text-[13px] font-bold text-slate-800">常见格式 1：冒号多字段</p>
                            <p class="text-[12px] text-slate-500 break-all font-mono mt-1">账号:密码:邮箱:邮箱密码:手机号:注册时间:日期:…:地区:状态:Token码:ct0令牌码</p>
                            <p class="text-[12px] text-slate-500 mt-1">中间可能包含日期、国家地区（例如 DE）、true / false 状态等字段。通常重点查看后面的 Token 和 ct0 字段。</p>
                        </div>
                        <div class="border-t border-slate-200 pt-2">
                            <p class="text-[13px] font-bold text-slate-800">常见格式 2</p>
                            <p class="text-[12px] text-slate-500 break-all font-mono mt-1">账号 —— 密码 —— 2FA —— Token码 —— ct0令牌 —— 邮箱 —— 邮箱密码</p>
                        </div>
                        <div class="border-t border-slate-200 pt-2">
                            <p class="text-[13px] font-bold text-slate-800">常见格式 3：无 ct0 令牌</p>
                            <p class="text-[12px] text-slate-500 break-all font-mono mt-1">账号 —— 密码 —— 邮箱 —— 邮箱密码 —— 2FA —— Token码</p>
                        </div>
                        <div class="border-t border-slate-200 pt-2">
                            <p class="text-[13px] font-bold text-slate-800">常见格式 4</p>
                            <p class="text-[12px] text-slate-500 break-all font-mono mt-1">账号:密码:Token码:2FA登录网址:2FA码:邮箱:邮箱密码:Cookie码</p>
                        </div>
                    </div>

                    <div class="bg-blue-50 text-blue-800 text-[13px] p-3 rounded-lg border border-blue-100">
                        <b>Token 登录重点：</b>一般先找到卡密中的 Token / auth_token 并使用该字段登录。如果卡密同时提供 ct0，请注意 ct0 与 auth_token 是两个不同字段；如果插件提供对应的 ct0 输入位置，再按照插件要求填写。
                    </div>

                    <div class="alert-box text-[12px]">
                        如果完全看不懂卡密格式，可以直接复制完整卡密发送给客服，并发送提示词：<b>推特账号分卡密</b>
                    </div>
                </div>
            `
        },
        {
            title: '图文教程：Token 登录步骤',
            content: `
                <div class="p-4 space-y-5">
                    <div class="flex gap-3">
                        <div class="step-num">1</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">安装 Twitter Token Login 插件</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed mb-2">此方式用于通过账号 Token（auth_token）在电脑端快速登录 Twitter / X 账号，无需再次输入账号密码。</p>
                            <p class="text-[13px] font-bold text-slate-700">插件名称：Twitter Token Login</p>
                            <a href="https://chromewebstore.google.com/" target="_blank" class="link-btn mt-2">Chrome 商店安装插件</a>
                            <p class="text-[13px] text-slate-600 leading-relaxed mt-2">建议使用最新版 Google Chrome 浏览器。安装完成后，可以点击浏览器右上角的“扩展程序”图标找到插件。</p>
                        </div>
                    </div>
                    
                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">2</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">打开 Twitter / X，输入 Token</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed mb-2">安装插件后，打开 Twitter / X 官网，点击浏览器右上角的 Twitter Token Login 插件。</p>
                            <p class="text-[13px] text-slate-600 leading-relaxed mb-2">从购买账号后的卡密中找到 Token / auth_token，复制后填写到插件中。</p>
                            <div class="bg-slate-50 text-slate-600 text-[12px] p-2 rounded border border-slate-200">
                                简单理解：<br>找到 Token / auth_token → 复制 → 填入插件 → 登录
                            </div>
                            <p class="text-[13px] text-slate-600 leading-relaxed mt-2">有些账号会同时提供 2FA、Token、ct0、Cookie 等多种数据，请注意分辨，<b>不要把 2FA 当成 Token 使用。</b></p>
                        </div>
                    </div>

                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">3</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">自动跳转并完成登录</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">Token 填写正确后，插件会自动处理登录状态并跳转到 Twitter / X。</p>
                            <p class="text-[13px] text-slate-600 leading-relaxed mt-2">成功进入 Twitter / X 首页后，即代表 Token 登录完成。</p>
                        </div>
                    </div>
                </div>
            `
        },
        {
            title: '插件跳转失败怎么办？',
            content: `
                <div class="p-4">
                    <p class="text-[13px] text-slate-600 leading-relaxed mb-3">如果输入 Token 后没有成功跳转，或者页面一直停留在登录状态，建议先清理浏览器缓存，再重新按照教程操作一次。</p>
                    <div class="bg-slate-100 p-3 rounded-lg text-[12px] font-mono text-slate-600">
                        Chrome 清理缓存地址：<br>
                        chrome://settings/clearBrowserData
                    </div>
                    <p class="text-[13px] text-slate-600 leading-relaxed mt-3">清理完成后重新打开 Twitter / X，再使用插件重新填写 Token。</p>
                </div>
            `
        },
        {
            title: 'Token 使用重要说明',
            content: `
                <div class="p-4">
                    <ul class="text-[13px] text-slate-600 space-y-3 list-disc list-inside leading-relaxed">
                        <li>Token 属于账号登录凭证，请勿发送给无关人员。</li>
                        <li>主动退出账号或修改密码后，Token 可能发生变化或失效。</li>
                        <li>如果只是暂时不使用账号，建议关闭浏览器，不要主动点击 Twitter / X 的退出登录。</li>
                        <li>有些卡密同时包含 2FA、Token、ct0、Cookie 等字段，请注意分辨。</li>
                        <li>auth_token 和 ct0 属于不同字段。如果插件有分别填写 auth_token 和 ct0 的位置，请按照插件对应字段填写。</li>
                        <li>卡密分隔符可能使用 :、 ;、 |、 —— 等不同格式。</li>
                        <li>如果无法判断卡密中的 Token，可以将完整卡密发送给客服，并发送提示词：<b>推特账号分卡密</b>。</li>
                    </ul>
                    <div class="alert-box mt-4">
                        成功进入 Twitter / X 首页后，即代表 Token 登录完成。后续使用过程中请尽量保持设备和浏览器环境稳定，并谨慎进行退出账号、修改密码等操作。
                    </div>
                </div>
            `
        }
    ]
};
