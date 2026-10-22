const telegramData = {
    title: 'Telegram 教程大全',
    subtitle: '短信费解决 · 多客户端支持 · 防封养号',
    sections: [
        {
            title: '登录前：先看懂卡密格式',
            content: `
                <div class="p-4 space-y-4">
                    <p class="text-[13px] text-slate-600 leading-relaxed">购买 Telegram 账号后，系统会发货 <b>手机号码</b> 和对应的 <b>API 接码链接</b>。常见发货格式：</p>
                    <div class="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[12px] font-mono text-slate-600">
                        237678471862 | https://tgapi.uk/9a5b5d2f.../GetHTML?proxy_id=us<br>
                        237678471862-----https://tgapi.uk/9a5b5d2f.../GetHTML?proxy_id=us
                    </div>
                    <p class="text-[13px] text-slate-600 leading-relaxed mt-2">发货格式可以理解为： <b>手机号码 API 接码链接</b>。 中间可能会使用 |、 ----- 等符号进行分隔。</p>
                </div>
            `
        },
        {
            title: '图文教程：Telegram 登录步骤',
            content: `
                <div class="p-4 space-y-5">
                    <div class="flex gap-3">
                        <div class="step-num">1</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">确认手机号码和国家区号</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">发货手机号码中已经包含国家区号，登录时请注意正确区分国家号和电话号码。例如发货号码：27605077772，27 为国家区号，605077772 为电话号码。</p>
                        </div>
                    </div>
                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">2</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">打开 Telegram，输入手机号码</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">打开客户端或网页版，选择使用手机号码登录。输入购买账号后获得的手机号码，点击下一步。建议首次登录时保持网络和设备稳定，不要短时间内频繁切换设备或 IP。</p>
                        </div>
                    </div>
                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">3</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">打开 API 链接获取设备验证码</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed mb-2">输入手机号码后，Telegram 会要求输入设备验证码。这时返回购买账号后的发货信息，找到 API 接码链接。复制完整链接粘贴到浏览器打开，即可查看验证码。（只复制链接本身，不要带上分隔符）</p>
                        </div>
                    </div>
                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">4</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">输入验证码和二步验证密码 (2FA)</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">在 API 页面中找到设备验证码填入 Telegram。如果接下来要求输入二步验证密码（2FA），同样在 API 页面中查看并填入。成功登录后请至少保持一个设备在线，不要退出。</p>
                        </div>
                    </div>
                </div>
            `
        },
        {
            title: '一、Telegram 登录问题解决方法',
            content: `
                <div class="p-4 space-y-4">
                    <p class="text-[13px] text-slate-600 leading-relaxed">如果登录 Telegram 时遇到邮箱验证、短信费用提示或一直收不到验证码，可以参考下面的方法。不同账号的验证流程可能不同，请根据实际提示操作。</p>
                    <div class="flex gap-3">
                        <div class="step-num">1</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">先尝试电脑端登录</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">使用 Telegram 官方 Web 端或电脑桌面客户端登录。如果账号已经在其他设备登录，可以先检查 Telegram 内是否收到了验证码消息。</p>
                            <div class="flex gap-2 mt-2">
                                <a href="https://web.telegram.org/" target="_blank" class="link-btn">🌐 Telegram Web</a>
                                <a href="https://desktop.telegram.org/" target="_blank" class="link-btn">💻 电脑客户端</a>
                            </div>
                        </div>
                    </div>
                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">2</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">更换网络或检查邮箱</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">如果一直收不到验证码，可以尝试：切换 Wi-Fi 和手机流量、重启设备、检查邮箱收件箱和垃圾邮件。避免频繁更换设备、网络或反复请求验证码。</p>
                        </div>
                    </div>
                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">3</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">尝试其他兼容客户端</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">如果最新版 Telegram 一直出现邮箱验证、短信费用或验证码异常，可以尝试使用下方提供的第三方客户端。</p>
                        </div>
                    </div>
                </div>
            `
        },
        {
            title: '二、Telegram 提示短信费用(SMS Fee)怎么办？',
            content: `
                <div class="p-4 space-y-5">
                    <div>
                        <h4 class="text-[14px] font-bold text-slate-800 mb-1">方法一：通过 App Store 付款</h4>
                        <p class="text-[13px] text-slate-600 leading-relaxed">如果填写邮箱后，页面仍然提示短信费用，并且官方登录页面提供 Telegram Premium 购买入口，可以尝试通过 App Store 完成付款，再返回 Telegram 继续登录。</p>
                    </div>
                    <div>
                        <h4 class="text-[14px] font-bold text-slate-800 mb-1">方法二：使用 Apple 礼品卡</h4>
                        <p class="text-[13px] text-slate-600 leading-relaxed mb-2">如果没有合适的付款方式，可以先确认自己的 Apple 账号地区，再考虑购买对应地区的 Apple Gift Card。</p>
                        <ul class="text-[13px] text-slate-500 space-y-1 list-disc list-inside">
                            <li>礼品卡必须与 Apple 账号的商店地区匹配。</li>
                            <li>先确认实际需要支付的金额，2 美元的礼品卡就足够了。</li>
                            <li>礼品卡只是付款方式之一，不保证一定能解决登录问题。</li>
                        </ul>
                    </div>
                    <div class="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <h4 class="text-[14px] font-bold text-blue-800 mb-1">方法三：开通 Telegram Premium (平台实测推荐)</h4>
                        <p class="text-[13px] text-blue-700 leading-relaxed mb-3">如果你已经在电脑端登录，但手机端仍然提示需要付费验证，可以考虑为同一个 Telegram 账号开通 Premium，再尝试手机登录。</p>
                        <a href="/index.html" class="block text-center w-full py-2.5 bg-blue-600 text-white font-bold rounded-lg text-[14px]">前往查看 Telegram Premium 套餐</a>
                    </div>
                    <div class="alert-box">
                        ⚠️ <b>注意：</b>开通 Premium 不保证所有账号都能解除短信验证限制。如果只是要求邮箱验证码，并没有出现付费提示，也不需要盲目购买会员。请以当前登录页面的实际要求为准。
                    </div>
                </div>
            `
        },
        {
            title: '三、第三方 Telegram 客户端合集',
            content: `
                <div class="p-4">
                    <p class="text-[13px] text-slate-600 leading-relaxed mb-2">如果官方客户端无法正常登录，也可以参考以下兼容客户端名单。<br><b>标记说明：</b> ✅ 开源　❌ 闭源 (下载前请确认项目状态、权限及来源)</p>
                    
                    <h5 class="font-bold text-slate-800 text-[13px] mt-4 mb-2"># Android</h5>
                    <div class="client-list">
                        <div class="client-item"><span>Telegram X</span> <span>✅</span></div>
                        <div class="client-item"><span>Nagram</span> <span>✅</span></div>
                        <div class="client-item"><span>Nnngram</span> <span>✅</span></div>
                        <div class="client-item"><span>Nekogram</span> <span>✅</span></div>
                        <div class="client-item"><span>NekogramX</span> <span>✅</span></div>
                        <div class="client-item"><span>Nullgram</span> <span>✅</span></div>
                        <div class="client-item"><span>AyuGram</span> <span>✅</span></div>
                        <div class="client-item"><span>Cherrygram</span> <span>✅</span></div>
                        <div class="client-item"><span>exteraGram</span> <span>✅</span></div>
                        <div class="client-item"><span>Forkgram</span> <span>✅</span></div>
                        <div class="client-item"><span>Telegraher</span> <span>✅</span></div>
                        <div class="client-item"><span>OctoGram</span> <span>✅</span></div>
                        <div class="client-item"><span>Mercurygram</span> <span>✅</span></div>
                        <div class="client-item"><span>moeGramX</span> <span>✅</span></div>
                        <div class="client-item"><span>Plus</span> <span>❌</span></div>
                        <div class="client-item"><span>Turrit</span> <span>❌</span></div>
                        <div class="client-item"><span>MDGram</span> <span>❌</span></div>
                        <div class="client-item"><span>Ninjagram</span> <span>❌</span></div>
                        <div class="client-item"><span>BGram</span> <span>❌</span></div>
                        <div class="client-item"><span>iMe</span> <span>❌</span></div>
                        <div class="client-item"><span>Graph Messenger</span> <span>❌</span></div>
                        <div class="client-item"><span>Nicegram</span> <span>❌</span></div>
                        <div class="client-item"><span>RitMGram</span> <span>❌</span></div>
                        <div class="client-item"><span>HuIugram</span> <span>❌</span></div>
                        <div class="client-item"><span>Aka</span> <span>❌</span></div>
                    </div>

                    <h5 class="font-bold text-slate-800 text-[13px] mt-4 mb-2"># iOS</h5>
                    <div class="client-list">
                        <div class="client-item"><span>Swiftgram</span> <span>✅</span></div>
                        <div class="client-item"><span>Nicegram</span> <span>❌</span></div>
                        <div class="client-item"><span>iMe</span> <span>❌</span></div>
                        <div class="client-item"><span>Revgram</span> <span>❌</span></div>
                        <div class="client-item"><span>Turrit</span> <span>❌</span></div>
                        <div class="client-item"><span>Aka</span> <span>❌</span></div>
                    </div>

                    <h5 class="font-bold text-slate-800 text-[13px] mt-4 mb-2"># Windows</h5>
                    <div class="client-list">
                        <div class="client-item"><span>64Gram</span> <span>✅</span></div>
                        <div class="client-item"><span>Unigram</span> <span>✅</span></div>
                        <div class="client-item"><span>AyuGram</span> <span>✅</span></div>
                        <div class="client-item"><span>Forkgram</span> <span>✅</span></div>
                        <div class="client-item"><span>Kotatogram</span> <span>✅</span></div>
                        <div class="client-item"><span>materialgram</span> <span>✅</span></div>
                        <div class="client-item"><span>iMe</span> <span>❌</span></div>
                    </div>

                    <h5 class="font-bold text-slate-800 text-[13px] mt-4 mb-2"># macOS / Linux / WearOS</h5>
                    <div class="client-list">
                        <div class="client-item"><span>64Gram (mac)</span> <span>✅</span></div>
                        <div class="client-item"><span>Kotatogram (mac)</span> <span>✅</span></div>
                        <div class="client-item"><span>materialgram (mac/Linux)</span> <span>✅</span></div>
                        <div class="client-item"><span>HandyGram (Wear)</span> <span>✅</span></div>
                    </div>
                </div>
            `
        },
        {
            title: '四、Telegram 防封与养号指南',
            content: `
                <div class="p-4 space-y-4">
                    <p class="text-[13px] text-slate-600 leading-relaxed">Telegram 的封号机制主要检测异常行为和关联风险，你的目标就是让账号行为看起来像一个真实的普通用户。</p>
                    <div class="alert-box">
                        <b>核心原则：模仿真人，减少异常。</b><br><br>
                        ✅ 使用指纹浏览器隔离环境，绑定固定的住宅 IP。<br>
                        ✅ 新号切勿立即进行大量操作！建议至少养号 5-7 天。<br>
                        ✅ 操作频率要慢，避免短时间大量关注、点赞或群发。<br>
                        ✅ 严禁发布垃圾链接、色情、暴力等违规内容。
                    </div>
                    <h4 class="text-[14px] font-bold text-slate-800 mt-4">安全登录检查清单</h4>
                    <ul class="text-[13px] text-slate-600 space-y-1 list-disc list-inside">
                        <li>环境：是否为每个账号配置了独立的指纹浏览器 + 固定 IP？</li>
                        <li>信息：账号资料是否完整、像真人？</li>
                        <li>行为：日常操作频率是否在安全阈值内？</li>
                        <li>稳定：是否避免了频繁切换登录环境和 IP？</li>
                    </ul>
                </div>
            `
        }
    ]
};
