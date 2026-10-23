const appleData = {
    title: '苹果 Apple ID 教程',
    subtitle: '仅在App Store登录 · 严禁设置登录',
    sections: [
        {
            title: '卡密格式说明与安全警告',
            content: `
                <div class="p-4 space-y-4">
                    <div class="bg-slate-50 border border-slate-200 p-3 rounded-lg">
                        <p class="text-[13px] font-bold text-slate-800 mb-1">账号格式：</p>
                        <p class="text-[14px] font-mono text-blue-600">账号----密码</p>
                    </div>
                    
                    <div class="danger-box text-[14px]">
                        <b>⚠️ 重要安全提醒：</b><br><br>
                        在完全修改账号资料前，<b>严禁在系统设置（Settings）中登录</b>。请务必仅在 <b>App Store（应用商店）</b> 登录，以确保设备安全。
                    </div>
                </div>
            `
        },
        {
            title: '图文教程：App Store 登录步骤',
            content: `
                <div class="p-4 space-y-5">
                    <div class="flex gap-3">
                        <div class="step-num">1</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">打开 App Store 商店</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">打开手机上的 App Store 应用。</p>
                        </div>
                    </div>
                    
                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">2</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">点击右上角头像</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">点击 App Store 右上角的头像图标。</p>
                        </div>
                    </div>

                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">3</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">退出旧账号</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">若已有账号，滑至最底部点击「退出登录」。</p>
                        </div>
                    </div>

                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">4</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">输入新账号登录</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">输入购买的账号与密码进行登录。</p>
                        </div>
                    </div>

                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">5</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">处理双重认证提醒</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">当弹出双重认证提醒时，点击「其他选项」→「不升级」即可完成登录。</p>
                        </div>
                    </div>
                </div>
            `
        },
        {
            title: '售后说明',
            content: `
                <div class="p-4">
                    <div class="alert-box text-[13px]">
                        以商品说明为售后标准｜已登封禁账号不在售后范围。<br>
                        购买后 <b>24 小时内</b> 可售后。
                    </div>
                </div>
            `
        }
    ]
};
