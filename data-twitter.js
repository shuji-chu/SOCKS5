const twitterData = {
    title: 'Twitter / X 登录教程',
    subtitle: 'Android报错解决 · 2FA登录 · 防封必看',
    sections: [
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
            title: '先看懂账号卡密',
            content: `
                <div class="p-4">
                    <p class="text-[13px] text-slate-600 leading-relaxed mb-3">购买 Twitter / X 账号后，请先查看系统发货的账号信息。卡密中通常会包含 <b>账号、密码、2FA、Token</b> 等内容。</p>
                    <div class="bg-slate-50 border border-slate-200 p-3 rounded-lg text-[12px] text-slate-500 mb-4">
                        卡密中的分隔符不一定完全相同，可能使用 <b>:、 ;、 |、 ｜、 ——</b> 或其他符号分隔。
                    </div>
                    <p class="text-[13px] text-slate-600 leading-relaxed">点击图片可放大查看图文教程。</p>
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
                    <div class="alert-box mt-4">
                        完成账号密码和 2FA 验证后即可正常使用账号。登录成功后请注意保存好账号信息，并谨慎进行退出账号、修改密码等操作。
                    </div>
                </div>
            `
        }
    ]
};
