const instagramData = {
    title: 'Instagram 教程 & 养号',
    subtitle: '2FA登录 · Cookie登录 · IP防封指南',
    cookie: [
        {
            title: 'Cookie 登录前必看',
            content: `
                <div class="p-4 space-y-4">
                    <ul class="text-[13px] text-slate-600 space-y-3 list-disc list-inside leading-relaxed">
                        <li>Instagram Cookie 登录方式主要用于 <b>电脑端 Chrome 浏览器</b>，手机端暂不支持通过本教程方式登录。</li>
                        <li>Cookie 属于账号登录凭证，请妥善保存，不要将 Cookie 发送给无关人员。</li>
                        <li>如果 Cookie 已失效、账号已退出登录或登录状态被平台重置，可能无法继续使用原 Cookie 登录。</li>
                    </ul>
                </div>
            `
        },
        {
            title: '图文教程：Cookie 登录步骤',
            content: `
                <div class="p-4 space-y-5">
                    <div class="flex gap-3">
                        <div class="step-num">1</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">查看卡密找到 Cookie</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">购买 Instagram Cookie 账号后，请先查看系统发货内容，找到账号对应的 Cookie。</p>
                            <p class="text-[13px] text-slate-500 mt-2 bg-slate-50 p-2 rounded">不同批次账号的卡密格式可能不同。Cookie 通常是一段较长的登录数据，请注意不要和账号、密码、邮箱、2FA 等其他字段混淆。</p>
                        </div>
                    </div>
                    
                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">2</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">打开 Instagram 网页版</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">在电脑端打开 Google Chrome 浏览器，进入 Instagram 官方网页版。不需要先输入账号密码，先停留在 Instagram 登录页面即可。</p>
                        </div>
                    </div>

                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">3</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">安装 Cookie 插件</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">打开 Chrome 应用商店，安装你使用的 Cookie 管理 / 导入插件。安装完成后，可以在 Chrome 浏览器右上角的扩展程序中找到。</p>
                        </div>
                    </div>

                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">4</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">导入账号 Cookie</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed mb-2">保持当前页面停留在 Instagram 网页版，点击浏览器右上角的扩展程序，打开 Cookie 插件（注意要在 Instagram 网站页面中打开）。</p>
                            <p class="text-[13px] text-slate-600 leading-relaxed">从购买账号后的卡密中复制对应的 Cookie 数据，按插件页面提示导入。<br><b>简单流程：复制 Cookie → 打开插件 → 导入 → 刷新 Instagram。</b></p>
                        </div>
                    </div>

                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">5</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">刷新页面，完成登录</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">Cookie 导入成功后，刷新 Instagram 网页。如果 Cookie 当前有效，页面会直接进入对应 Instagram 账号，即代表 Cookie 登录完成。</p>
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
                        <li>1. 确认 Cookie 是否完整复制，没有漏字符或多复制其他卡密内容。</li>
                        <li>2. 确认是在 Instagram 网页中打开 Cookie 插件并导入。</li>
                        <li>3. 导入后刷新页面，必要时关闭 Instagram 页面后重新打开。</li>
                        <li>4. 如果浏览器中原本登录了其他 Instagram 账号，可以先清理当前站点缓存，再重新导入。</li>
                        <li>5. 如果仍无法登录，Cookie 可能已经失效，请根据订单售后规则联系客服检查。</li>
                    </ul>
                </div>
            `
        }
    ],
    twoFactor: [
        {
            title: 'Instagram 登录前注意',
            content: `
                <div class="p-4">
                    <div class="alert-box">
                        近期 Instagram 风控加强后，部分账号登录时即使密码正确，也可能出现 “密码错误 / 登录失败”。这种情况不一定代表账号密码被修改。<br><br>
                        常见原因包括：陌生设备、IP 或网络变化，以及短时间内重复登录。<br><br>
                        建议依次尝试：<b>清除缓存 → 重新打开 → 更换浏览器 → 更换 IP / 网络 → 更换设备。</b>如果已经连续失败多次，请先停止尝试，等待一段时间后再登录。<br><br>
                        <b>不要连续重复输入密码、频繁切换 IP 或反复获取验证码，否则可能加重平台限制。</b>
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
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">查看卡密</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">购买 Instagram 账号后，请先查看系统发货的卡密。常见信息包括：账号、密码、2FA。</p>
                            <p class="text-[12px] text-slate-500 mt-1">卡密分隔符不一定完全相同，可能使用 :、 ;、 |、 ｜、 —— 等符号。</p>
                        </div>
                    </div>
                    
                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">2</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">输入账号和密码</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">打开 Instagram App 或网页版，按正常登录步骤输入购买账号后的账号和密码。</p>
                        </div>
                    </div>

                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">3</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">打开 2FA 网站获取验证码</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed mb-2">如果跳转到身份验证器 / Authentication App 页面，说明开启了 2FA。需要的不是卡密里的 2FA 密钥本身，而是生成的六位动态验证码。</p>
                            <a href="https://2fa.run/" target="_blank" class="link-btn">🔗 https://2fa.run/</a>
                            <p class="text-[13px] text-slate-600 leading-relaxed mt-2">将卡密中的 2FA 密钥粘贴到网站中，页面生成的六位数动态验证码就是登录需要的。</p>
                        </div>
                    </div>

                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">4</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">输入六位验证码并完成登录</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">复制六位验证码，返回 Instagram 身份验证页面填写，点击下一步，验证通过即可进入账号。</p>
                        </div>
                    </div>
                </div>
            `
        },
        {
            title: '卡密与 2FA 说明',
            content: `
                <div class="p-4">
                    <ul class="text-[13px] text-slate-600 space-y-3 list-disc list-inside leading-relaxed">
                        <li>卡密中的 2FA 是用于生成动态验证码的密钥，不是直接填写到登录页面的六位验证码。</li>
                        <li>六位验证码会定时刷新，如果过期，回到 2FA 网站获取新的验证码即可。</li>
                        <li>卡密分隔符可能使用 :、 ;、 |、 ｜、 —— 等不同格式。</li>
                        <li>如果看不懂卡密格式，可以直接复制完整卡密发送给客服，并发送提示词：<b>Instagram 账号分卡密</b>。</li>
                    </ul>
                </div>
            `
        }
    ],
    changePasswordWarning: [
        {
            title: '无法立即更改密码 / 2FA / 邮箱',
            content: `
                <div class="p-4">
                    <div class="danger-box text-[14px]">
                        <b>大多数 Facebook / Instagram 无法立即更改密码 / 2FA / 邮箱 / 踢除旧设备（执行操作 WhatsApp）。</b><br><br>
                        建议养号周期 <b>30-45 天</b>；不保证这个问题！购买前请考虑！
                    </div>
                </div>
            `
        }
    ],
    overseasIP: [
        {
            title: '海外 IP 登录核心原则',
            content: `
                <div class="p-4">
                    <p class="text-[13px] text-slate-600 leading-relaxed mb-3">在 Instagram 上使用海外 IP 登录，尤其是进行工作室式的批量操作，需要注意大量细节，否则极易触发风控导致封号。</p>
                    <div class="bg-blue-50 border border-blue-100 rounded-lg p-4 text-[13px] text-blue-800 leading-relaxed font-bold">
                        核心原则：环境、IP、行为的三位一体。你的目标不是"能用"，而是让 Instagram 认为你就是一个在当地正常生活的真实用户。任何一方面的不匹配都会带来风险。
                    </div>
                </div>
            `
        },
        {
            title: '一、IP 地址的选择与使用（重中之重）',
            content: `
                <div class="p-4 space-y-4">
                    <p class="text-[13px] text-slate-600 leading-relaxed">这是最关键的一环，IP 的质量直接决定了账号的生死。</p>
                    <div>
                        <p class="text-[14px] font-bold text-slate-800 mb-1">IP 类型：首选住宅 IP，其次是移动 IP</p>
                        <p class="text-[13px] text-slate-600 leading-relaxed">住宅 IP：来自真实家庭宽带运营商的 IP（如 Comcast、Spectrum 等）。这是最安全、最逼真的选择。</p>
                        <p class="text-[13px] text-slate-600 leading-relaxed">4G/5G 移动 IP：来自移动数据网络的 IP，同样非常优质。</p>
                        <p class="text-[13px] text-red-500 leading-relaxed mt-1">绝对避免：数据中心 IP。这类 IP 段非常容易被 Instagram 识别和标记，新号注册或老号登录几乎会立刻被限制。</p>
                    </div>
                    <div class="border-t border-slate-100 pt-3">
                        <p class="text-[14px] font-bold text-slate-800 mb-1">IP 的纯净度与关联风险</p>
                        <p class="text-[13px] text-slate-600 leading-relaxed">独享 IP：一个 Instagram 账号最好固定使用一个独享的住宅 IP。共享 IP 可能被其他滥用者污染，连累你的账号。</p>
                        <p class="text-[13px] text-slate-600 leading-relaxed">IP 地理位置固定：确保 IP 的地理位置（国家、城市）是固定的。切忌今天美国纽约，明天英国伦敦。IP 的频繁跨国跳跃是高风险行为。</p>
                        <p class="text-[13px] text-slate-600 leading-relaxed">IP 的"黑历史"：使用前，最好通过工具检查 IP 是否已被标记为滥用或进入黑名单。选择信誉良好的代理服务商。</p>
                    </div>
                </div>
            `
        },
        {
            title: '二、浏览器环境的匹配与隔离',
            content: `
                <div class="p-4 space-y-4">
                    <p class="text-[13px] text-slate-600 leading-relaxed">IP 只是地址，浏览器环境则是你的"设备"。</p>
                    <div>
                        <p class="text-[14px] font-bold text-slate-800 mb-1">1. 使用指纹浏览器</p>
                        <p class="text-[13px] text-slate-600 leading-relaxed">工具：AdsPower、Multilogin、Dolphin Anty 等。它们为每个账号创建独立的、防关联的浏览器环境。</p>
                        <p class="text-[13px] text-slate-600 leading-relaxed mt-1">配置时必须确保以下要素与你的 IP 所在地完全匹配：时区、语言、地区/位置（在浏览器权限中设置）。</p>
                        <p class="text-[13px] text-slate-600 leading-relaxed mt-1">设备模拟：优先模拟移动设备（如 iPhone 13、Samsung Galaxy S22），因为 Instagram 是移动端优先的应用。设置对应的分辨率。</p>
                    </div>
                    <div class="border-t border-slate-100 pt-3">
                        <p class="text-[14px] font-bold text-slate-800 mb-1">2. 环境的纯洁性</p>
                        <p class="text-[13px] text-slate-600 leading-relaxed">每次登录前，确保使用的是同一个浏览器配置文件。不要在多个不同环境或设备之间频繁切换登录同一个账号。</p>
                        <p class="text-[13px] text-slate-600 leading-relaxed">清除环境中的任何异常插件或可能暴露自动化脚本的痕迹。</p>
                    </div>
                </div>
            `
        },
        {
            title: '三、账号本身的状态与操作行为',
            content: `
                <div class="p-4 space-y-4">
                    <div>
                        <p class="text-[14px] font-bold text-slate-800 mb-1">1. 账号注册地与 IP 地匹配</p>
                        <p class="text-[13px] text-slate-600 leading-relaxed">新号：最好直接用目标国家的 IP 和环境进行注册。例如，你想做美国市场，就用美国住宅 IP 和美国环境注册。</p>
                        <p class="text-[13px] text-slate-600 leading-relaxed mt-1">老号：如果老号原本在中国使用，突然切换到美国 IP 登录，这本身就是一个风险点。需要模拟"旅行"——切换后不要立即进行敏感操作，先像正常游客一样浏览几天。如果收到"是否是你本人在登录"的提示，如实确认。</p>
                    </div>
                    <div class="border-t border-slate-100 pt-3">
                        <p class="text-[14px] font-bold text-slate-800 mb-1">2. 登录后的行为模式</p>
                        <p class="text-[13px] text-slate-600 leading-relaxed">切勿立即操作：使用新 IP 登录后，不要马上开始关注、点赞或发帖。先浏览！</p>
                        <p class="text-[13px] text-slate-600 leading-relaxed mt-1">模拟真人节奏：浏览首页、看看 Stories、刷刷 Reels，持续 10-15 分钟。让系统适应你的"新位置"。</p>
                        <p class="text-[13px] text-slate-600 leading-relaxed mt-1">渐进式增加互动：在确认环境稳定后，再缓慢地、随机地进行点赞、关注等操作。避免规律性的、机器人的行为模式。</p>
                    </div>
                    <div class="border-t border-slate-100 pt-3">
                        <p class="text-[14px] font-bold text-slate-800 mb-1">3. 双重验证</p>
                        <p class="text-[13px] text-slate-600 leading-relaxed">如果账号开启了双重验证，确保你能在切换 IP 后接收到验证码（通过邮箱或备用手机号）。使用海外 IP 登录可能会触发安全验证。</p>
                    </div>
                </div>
            `
        },
        {
            title: '安全登录检查清单',
            content: `
                <div class="p-4">
                    <div class="alert-box">
                        稳定性、一致性和真实性是避免封号的关键。确保 IP 固定纯净 → 浏览器环境匹配 → 登录后先浏览养号 → 渐进式操作。
                    </div>
                </div>
            `
        }
    ]
};
