const telegramData = {
    title: 'Telegram 教程',
    subtitle: '登录问题解决 · 防封与 Token 保护',
    sections: [
        {
            title: 'Android 登录出现 Attestation Denied 报错怎么办？',
            content: `
                <div class="p-4 space-y-4 text-[13px] text-slate-600 leading-relaxed">
                    <p>如果登录 X（Twitter）输入密码后出现 attestationdenied / attestation denied，一般属于 Android 设备完整性验证失败，通常不是账号密码错误。</p>
                    <div class="bg-blue-50 border border-blue-100 rounded-lg p-4 text-blue-800">
                        <p class="font-bold mb-2">建议解决方法：</p>
                        <p>1. 卸载 X，并清理 X 应用数据。</p>
                        <p>2. 检查并更新 Google Play Store、Google Play Services 和 Android System WebView。</p>
                        <p>3. 通过 Google Play 商店重新下载安装 X。</p>
                        <p>4. 关闭开发者模式和 USB 调试，并保持网络稳定，不要频繁切换 IP 或网络。</p>
                        <p>5. 如果设备存在 Root 或系统环境被修改，建议恢复正常系统环境后再尝试登录。</p>
                    </div>
                </div>
            `
        },
        {
            title: '登录前必看：防封与 Token 保护',
            content: `
                <div class="p-4 text-[13px] text-slate-600 leading-relaxed">
                    <div class="alert-box">
                        Telegram 账号登录后，<b>请勿随意退出账号，也不要直接修改账号密码。</b><br><br>
                        退出账号或修改密码后，账号对应的 Token 可能发生变化或失效，原来的 Token 可能无法继续使用。<br><br>
                        如果只是暂时不需要使用账号，建议直接关闭浏览器或清理对应浏览器缓存，不要主动点击退出登录。
                    </div>
                </div>
            `
        }
    ]
};
