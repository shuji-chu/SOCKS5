const redditData = {
    title: 'Reddit 登录教程',
    subtitle: '卡密解析 · 换绑邮箱 · 邮箱验证',
    sections: [
        {
            title: '登录前：先看懂卡密',
            content: `
                <div class="p-4 space-y-4">
                    <p class="text-[13px] text-slate-600 leading-relaxed">Reddit 商品发货后，卡密中可能包含 <b>Reddit 用户名、登录密码、绑定邮箱、邮箱密码</b> 等信息。不同商品包含的字段可能不同，请以实际发货内容为准。</p>
                    
                    <div class="bg-white p-3 rounded border border-slate-200">
                        <p class="text-[12px] font-bold text-slate-800 mb-1">卡密示例：</p>
                        <p class="font-mono text-[11px] text-slate-500 break-all leading-relaxed">reddit_username----RedditPassword----oldmail@example.com----EmailPassword</p>
                    </div>

                    <div class="space-y-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <p class="text-[13px] font-bold text-slate-700 mb-2">这条卡密拆开后是：</p>
                        <p class="text-[13px] text-slate-600"><b>Reddit 用户名：</b>reddit_username</p>
                        <p class="text-[13px] text-slate-600"><b>Reddit 登录密码：</b>RedditPassword</p>
                        <p class="text-[13px] text-slate-600"><b>当前绑定邮箱：</b>oldmail@example.com</p>
                        <p class="text-[13px] text-slate-600"><b>邮箱密码：</b>EmailPassword</p>
                    </div>

                    <div class="alert-box mt-2 text-[12px]">
                        注意：不同批次商品的卡密格式可能不同。如果商品没有提供邮箱或邮箱密码，请以实际发货内容为准，不需要强行寻找不存在的字段。
                    </div>
                </div>
            `
        },
        {
            title: '看不懂卡密？让 AI 帮你解析',
            content: `
                <div class="p-4">
                    <p class="text-[13px] text-slate-600 leading-relaxed mb-3">直接把完整卡密复制给 AI，再附上下面这段指令即可。</p>
                    <div class="ai-prompt-box relative">
                        <button class="copy-btn" onclick="copyAIPrompt(this, 'ai-prompt-reddit')">复制指令</button>
                        <div id="ai-prompt-reddit" class="text-[11px] leading-relaxed text-slate-300">
请帮我解析下面这条 Reddit 商品卡密，不要修改、补全或猜测不存在的信息。

卡密中可能包含 Reddit 用户名、登录密码、绑定邮箱、邮箱密码以及其他附加信息。

请根据内容特征判断，不要只按照固定位置判断；带 @ 的内容通常是邮箱；不同商品字段可能不同，没有出现的字段不要自行补充；无法确定的字段请写“无法确定”，不要猜测。

请按照以下格式输出：
Reddit用户名：
登录密码：
绑定邮箱：
邮箱密码：
其他信息：

我的完整卡密：
【粘贴完整卡密】
                        </div>
                    </div>
                </div>
            `
        },
        {
            title: '图文教程：登录与换绑邮箱步骤',
            content: `
                <div class="p-4 space-y-5">
                    <div class="flex gap-3">
                        <div class="step-num">1</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">购买 Reddit 卡密</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">购买 Reddit 商品后，先在订单中查看并复制账号卡密。</p>
                        </div>
                    </div>
                    
                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">2</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">打开 Reddit 并输入账号密码</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">打开 Reddit 登录页面，将卡密中的 Reddit 用户名和登录密码填写到对应位置并完成登录。</p>
                        </div>
                    </div>

                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">3</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">进入 Reddit 设置页面</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">登录成功后，打开账号菜单并进入 Settings / 设置，找到账号相关设置。</p>
                        </div>
                    </div>

                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">4</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">找到邮箱设置并修改</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">在账号设置中找到 Email address / 邮箱地址，点击修改邮箱，并按照页面提示继续操作。</p>
                        </div>
                    </div>

                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">5</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">填写自己的新邮箱</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">输入你准备长期使用的新邮箱地址，并按照 Reddit 页面提示提交修改。</p>
                        </div>
                    </div>

                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">6</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">完成邮箱验证</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">根据 Reddit 页面提示前往新邮箱完成验证。验证成功后，新的邮箱即可作为该 Reddit 账号的绑定邮箱。</p>
                        </div>
                    </div>
                </div>
            `
        }
    ]
};
