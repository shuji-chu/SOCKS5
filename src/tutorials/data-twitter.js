const twitterData = {
    title: 'Twitter / X 教程',
    subtitle: '2FA登录 · Token登录 · 养号防封',
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
    ],
    warmup: [
        {
            title: '核心原则：模仿真人，减少异常',
            content: `
                <div class="p-4">
                    <p class="text-[13px] text-slate-600 leading-relaxed">Twitter 的封号机制主要检测异常行为和关联风险，你的目标就是让账号行为看起来像一个真实的普通用户。</p>
                </div>
            `
        },
        {
            title: '一、账号注册与初始化阶段（打好基础）',
            content: `
                <div class="p-4 space-y-4">
                    <p class="text-[14px] font-bold text-slate-800">1. 干净的注册环境（最重要的防线）</p>
                    <ul class="text-[13px] text-slate-600 space-y-2 leading-relaxed pl-1">
                        <li>✅ <b>使用指纹浏览器：</b>为每个账号使用独立的指纹浏览器配置文件（如 AdsPower、Multilogin、Dolphin Anty），隔离 Cookie、Canvas 指纹、IP 地址等。</li>
                        <li>✅ <b>使用优质代理 IP：</b></li>
                        <ul class="pl-4 text-slate-500">
                            <li>🟡 绝对不要用数据中心 IP！非常容易被识别和封禁。</li>
                            <li>🟡 使用住宅 IP 或 4G/5G 移动 IP，这是最安全的选择。</li>
                        </ul>
                        <li>✅ <b>IP 独享 & 固定：</b>一个账号永远绑定一个固定的住宅 IP，每次登录都使用同一个 IP。</li>
                        <li>✅ <b>清理环境：</b>注册前确保浏览器环境是"干净"的，没有其他 Twitter 账号的残留痕迹。</li>
                    </ul>

                    <p class="text-[14px] font-bold text-slate-800 mt-6">2. 完整的账号信息</p>
                    <ul class="text-[13px] text-slate-600 space-y-2 leading-relaxed pl-1">
                        <li>✅ 使用真人头像，不要用默认的蛋形头像。</li>
                        <li>✅ 填写合理的用户名、姓名和简介，让账号看起来有血有肉。</li>
                        <li>✅ <b>验证邮箱和手机号：</b></li>
                        <ul class="pl-4 text-slate-500">
                            <li>🟡 使用独立的真实邮箱（Gmail、Outlook 等），避免使用临时邮箱。</li>
                            <li>🟡 手机验证尽量使用实体手机卡或可靠的虚拟手机号（非 VOIP 号码更安全）。</li>
                        </ul>
                    </ul>

                    <p class="text-[14px] font-bold text-slate-800 mt-6">3. "养号"期（Warm-Up / 孵化期）</p>
                    <ul class="text-[13px] text-slate-600 space-y-2 leading-relaxed pl-1">
                        <li>🟡 新账号切勿立即进行大量操作！这是被封的最常见原因。</li>
                        <li>✅ 第一周：像真人一样浏览，关注几个官方大号，看看热门推文，随机点赞 1-2 个。</li>
                        <li>✅ 模拟真人行为：每次使用时间不要太短，行为要有随机性，不要像机器人一样规律。</li>
                        <li>✅ 养号周期：建议至少养号 5-7 天，再开始逐步增加互动和发帖。</li>
                    </ul>
                </div>
            `
        },
        {
            title: '二、日常操作与行为规范（长期生存）',
            content: `
                <div class="p-4 space-y-4">
                    <p class="text-[14px] font-bold text-slate-800">1. 操作频率与节奏</p>
                    <ul class="text-[13px] text-slate-600 space-y-2 leading-relaxed pl-1">
                        <li>✅ 遵循"慢开始"原则，即使过了养号期也要缓慢增加每日操作量。</li>
                        <li>✅ <b>操作上限参考：</b></li>
                        <ul class="pl-4 text-slate-500">
                            <li>🟡 新号每日关注：不超过 10-15 人</li>
                            <li>🟡 每日点赞：不超过 30-50 个</li>
                            <li>🟡 每日转发：不超过 10-15 次</li>
                        </ul>
                        <li>✅ 每日总互动量（关注+点赞+转发+回复）控制在 150 次以内，分散在一天的不同时间段。</li>
                        <li>🟡 避免重复性操作：不要连续、快速地执行同一动作（例如 1 分钟内关注 20 个人）。</li>
                    </ul>

                    <p class="text-[14px] font-bold text-slate-800 mt-6">2. 内容策略</p>
                    <ul class="text-[13px] text-slate-600 space-y-2 leading-relaxed pl-1">
                        <li>🟡 禁止发布违规内容：垃圾链接、色情、暴力、仇恨言论、大量重复内容等。</li>
                        <li>🟡 不要滥用话题标签：每条推文使用 1-3 个相关标签即可，不要堆砌不相关的热门标签。</li>
                        <li>🟡 不要大量发送含链接的推文，尤其是短链或可疑链接。</li>
                        <li>✅ 原创为王：多发原创文字、图片、视频，少做"转发机器人"。</li>
                    </ul>

                    <p class="text-[14px] font-bold text-slate-800 mt-6">3. 社交互动</p>
                    <ul class="text-[13px] text-slate-600 space-y-2 leading-relaxed pl-1">
                        <li>🟡 关注/取消关注的比率：不要短时间内大量关注再取消，Twitter 会检测这种行为。</li>
                        <li>🟡 谨慎发送私信：新号不要主动给陌生人发私信，尤其不能发链接或营销信息，这是高风险行为。</li>
                    </ul>
                </div>
            `
        },
        {
            title: '三、技术与环境安全（防关联）',
            content: `
                <div class="p-4 space-y-4">
                    <p class="text-[14px] font-bold text-slate-800">1. 环境隔离</p>
                    <ul class="text-[13px] text-slate-600 space-y-2 leading-relaxed pl-1">
                        <li>✅ 坚持使用指纹浏览器，永远不要在同一台电脑的同一个浏览器上登录多个 Twitter 账号。</li>
                        <li>✅ IP 地址恒定：确保每个账号始终通过其绑定的固定住宅 IP 访问，IP 频繁变动或地理位置跳跃是危险信号。</li>
                    </ul>

                    <p class="text-[14px] font-bold text-slate-800 mt-6">2. Cookie 管理</p>
                    <ul class="text-[13px] text-slate-600 space-y-2 leading-relaxed pl-1">
                        <li>🟡 通过 auth_token 登录后，尽量在同一个浏览器环境中持续使用。不要频繁导出、导入 Cookie 在不同 IP 或环境间切换，会导致会话异常。</li>
                    </ul>

                    <p class="text-[14px] font-bold text-slate-800 mt-6">3. 避免使用未授权的第三方应用</p>
                    <ul class="text-[13px] text-slate-600 space-y-2 leading-relaxed pl-1">
                        <li>🟡 尽量不要用要求提供 Twitter 账号密码的第三方客户端或自动化工具。</li>
                        <li>✅ 如果必须使用，请只授权给信誉良好、使用 Twitter 官方 API 的应用，并定期检查已授权的应用列表。</li>
                    </ul>
                </div>
            `
        },
        {
            title: '四、特殊情况处理',
            content: `
                <div class="p-4 space-y-4">
                    <p class="text-[14px] font-bold text-slate-800">1. 账号被限流（Shadow Ban）</p>
                    <ul class="text-[13px] text-slate-600 space-y-2 leading-relaxed pl-1">
                        <li>🟡 表现：你的推文不会出现在搜索结果或话题中，只有粉丝能看到。</li>
                        <li>✅ 应对：立即停止所有主动操作（尤其是关注、点赞），回归"真人浏览模式"几天，通常可以恢复。</li>
                    </ul>

                    <p class="text-[14px] font-bold text-slate-800 mt-6">2. 收到账号锁定或验证挑战</p>
                    <ul class="text-[13px] text-slate-600 space-y-2 leading-relaxed pl-1">
                        <li>🟡 立即按要求操作，通常是验证邮箱或手机号。</li>
                        <li>🟡 对于简单的验证挑战，直接完成验证比写申诉邮件更快。</li>
                        <li>✅ 如果必须申诉，态度要诚恳，说明可能无意中违反了规定，并承诺遵守社区规则。</li>
                    </ul>
                </div>
            `
        },
        {
            title: '防封清单总结',
            content: `
                <div class="p-4">
                    <ul class="text-[13px] text-slate-600 space-y-3 leading-relaxed">
                        <li>✅ <b>环境：</b>是否为每个账号配置了独立的指纹浏览器环境 + 固定的住宅 IP？</li>
                        <li>✅ <b>信息：</b>账号资料是否完整、像真人？</li>
                        <li>✅ <b>养号：</b>新账号是否进行了至少 5-7 天的温和养号？</li>
                        <li>🟡 <b>行为：</b>日常操作频率是否在安全阈值内，且行为随机、像真人？</li>
                        <li>✅ <b>内容：</b>发布的内容是否以原创为主，避免垃圾和违规信息？</li>
                        <li>✅ <b>稳定：</b>是否避免了频繁切换登录环境和 IP 地址？</li>
                    </ul>
                    <div class="alert-box mt-4">
                        遵循以上规则，你的 Twitter 账号安全性将会得到极大的提升。记住，<b>"慢"就是"快"</b>，稳健运营才能长久。
                    </div>
                </div>
            `
        }
    ]
};
