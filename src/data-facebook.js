const facebookData = {
    title: 'Facebook 教程',
    subtitle: '2FA登录 · Cookie登录 · 解锁 · 账号黑话',
    mobile: [
        {
            title: '登录前：先看懂卡密',
            content: `
                <div class="p-4">
                    <p class="text-[13px] text-slate-600 leading-relaxed mb-3">Facebook 商品发货后，卡密中可能包含 <b>UID、密码、2FA、Cookie、Token、绑定邮箱、邮箱密码</b> 以及其他附加信息。</p>
                    <div class="bg-white p-3 rounded border border-slate-200 mb-4">
                        <p class="text-[12px] font-bold text-slate-800 mb-1">卡密示例：</p>
                        <p class="font-mono text-[11px] text-slate-500 break-all leading-relaxed">61582002028701|@#12kjnabscD|QJZT3NGU74Y7HNCWP4ZB5M22MYGZ7ES6|c_user=...|EAAAA...|8jre0jdghlelri4@hotmail.com|yf2q</p>
                    </div>
                    <div class="space-y-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <p class="text-[13px] font-bold text-slate-700 mb-2">卡密拆解：</p>
                        <p class="text-[13px] text-slate-600"><b>登录账号 / UID：</b>61582002028701</p>
                        <p class="text-[13px] text-slate-600"><b>Facebook 密码：</b>@#12kjnabscD</p>
                        <p class="text-[13px] text-slate-600"><b>2FA 密钥 (部分商品才有)：</b>QJZT3NGU74Y7HNCWP4ZB5M22MYGZ7ES6</p>
                        <p class="text-[13px] text-slate-600"><b>绑定邮箱：</b>8jre0jdghlelri4@hotmail.com</p>
                        <p class="text-[13px] text-slate-600"><b>Cookie：</b>c_user=...; xs=...; fr=...; datr=...;</p>
                        <p class="text-[13px] text-slate-600"><b>Token：</b>EAAAAUaZA8jlABRGG84t2Q3mEVmPCSe9...</p>
                        <p class="text-[13px] text-slate-600"><b>邮箱密码：</b>yf2q</p>
                    </div>
                    <div class="alert-box mt-4"><b>注意：</b>不要直接按照分隔符数量拆卡密。Cookie 自身也会包含 ;、=、| 等字符，需要结合内容特征判断。</div>
                </div>
            `
        },
        {
            title: '图文教程：手机端 2FA 登录',
            content: `
                <div class="p-4 space-y-5">
                    <div class="flex gap-3">
                        <div class="step-num">1</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">输入账号密码</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">打开 Facebook 登录页面，将卡密中的 UID 和密码输入对应位置。</p>
                        </div>
                    </div>
                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">2</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">选择身份验证方式</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">如果登录后直接出现身份验证应用 / 2FA 验证码，并且卡密中包含 2FA，可以直接进入下一步。如果出现其他设备确认界面，请点击 <b>「试试其他方式」</b>。</p>
                        </div>
                    </div>
                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">3</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">获取 2FA 验证码</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed mb-2">如果卡密中包含 2FA 密钥，可以打开 2FA 工具获取当前的 6 位动态验证码。</p>
                            <a href="https://2fa.run/" target="_blank" class="link-btn">🔗 2FA 工具网页版</a>
                        </div>
                    </div>
                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">4</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">登录成功</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">如果弹出要求确认真人使用的界面，并不代表账号被封禁。点击 Dismiss 后即可继续正常使用。</p>
                        </div>
                    </div>
                </div>
            `
        }
    ],
    cookie: [
        {
            title: '登录前：看懂最新卡密格式',
            content: `
                <div class="p-4">
                    <p class="text-[13px] text-slate-600 leading-relaxed mb-3">最新版卡密包含诸多字段，<b>本教程只需用到 Cookie，且必须复制全部 Cookie！</b></p>
                    <div class="space-y-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <p class="text-[13px] font-bold text-slate-700 mb-2">卡密拆解：</p>
                        <p class="text-[13px] text-slate-600"><b>账号：</b>61585874986880</p>
                        <p class="text-[13px] text-slate-600"><b>密码：</b>lI3E0#9y8d@3Z</p>
                        <p class="text-[13px] text-slate-600"><b>2FA 链接：</b>https://2fa.web-ai.top/?key=...</p>
                        <p class="text-[13px] text-slate-600"><b>手机号：</b>6285138441863</p>
                        <p class="text-[13px] text-slate-600"><b>邮箱账号：</b>hllisahqtq3@rambler.ru</p>
                        <p class="text-[13px] text-slate-600"><b>邮箱密码：</b>9703761EqYhS3Z</p>
                        <p class="text-[13px] text-slate-600"><b>国家代码：</b>RU</p>
                        <p class="text-[13px] text-red-500 font-bold mt-2"><b>Cookie：</b>[JSON 格式的 Cookie 数据]</p>
                    </div>
                </div>
            `
        },
        {
            title: '图文教程：电脑端 Cookie 登录',
            content: `
                <div class="p-4 space-y-5">
                    <div class="flex gap-3">
                        <div class="step-num">1</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">安装 Cookie Editor 插件</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed mb-2">建议使用电脑端 Chrome 浏览器，并安装插件。</p>
                            <div class="flex gap-2 flex-wrap">
                                <a href="https://www.google.cn/chrome/" target="_blank" class="link-btn">🌐 Chrome 下载</a>
                                <a href="https://chromewebstore.google.com/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm" target="_blank" class="link-btn">🔗 Cookie 插件</a>
                            </div>
                        </div>
                    </div>
                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">2</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">清理旧数据</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">打开 Facebook 网页，将当前页面的 Cookie 全部清理。</p>
                        </div>
                    </div>
                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">3</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">导入完整 Cookie</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">复制卡密中那一长串的 [JSON格式的Cookie]。在插件里选择 Import，粘贴并保存。<b>千万不要只复制一部分。</b></p>
                        </div>
                    </div>
                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">4</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">刷新页面</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">刷新 Facebook 页面，直接进入首页即为成功。</p>
                        </div>
                    </div>
                </div>
            `
        }
    ],
    unlock: [
        {
            title: '账号被锁？开始解锁申诉',
            content: `
                <div class="p-4 space-y-5">
                    <p class="text-[13px] text-slate-600 leading-relaxed">如果你的账号出现被锁定的提示，不要慌，按以下步骤申诉：</p>
                    <div class="flex gap-3">
                        <div class="step-num">1</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">点击开始解锁</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">出现锁定提示时，点击页面上的“开始解锁”。</p>
                        </div>
                    </div>
                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">2</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">点击继续</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">点击“继续”，进入下一步。</p>
                        </div>
                    </div>
                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">3</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">确认邮箱，获取验证码</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">确认卡密中的邮箱无误，点击“获取验证码”。</p>
                        </div>
                    </div>
                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">4</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">登录邮箱获取验证码</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed mb-2">去登录卡密中的邮箱获取验证码。</p>
                            <div class="alert-box text-[12px]"><b>注意：</b>如果提示“手机号频繁”，换一个手机号即可。最后一步可以跳过，也可以填自己的邮箱。</div>
                        </div>
                    </div>
                    <div class="flex gap-3 border-t border-slate-100 pt-4">
                        <div class="step-num">5</div>
                        <div>
                            <h4 class="text-[14px] font-bold text-slate-800 mb-1">填入验证码，解锁完成</h4>
                            <p class="text-[13px] text-slate-600 leading-relaxed">把从邮箱获取的验证码填入第三步的页面，即可解锁成功。</p>
                        </div>
                    </div>
                </div>
            `
        }
    ],
    terms: [
        {
            title: '一、个人号类目',
            content: `
                <div class="p-4 text-[13px] text-slate-600 leading-relaxed space-y-4">
                    <p><b>二解号（956）：</b>广告投放权限挂了一次，然后申诉回来的个人账号（956 是指二解号的简称）</p>
                    <p><b>三解号（902）：</b>广告投放权限挂了二次，然后申诉回来的个人账号（902 是指三解号的简称）</p>
                    <p><b>耐用号：</b>注册时间较长的个人账号</p>
                    <p><b>小黑号：</b>活跃度很低，好友数量在 0-30 左右，没有加双重验证，格式一般是账号+密码+cookie</p>
                    <p><b>大黑号：</b>活跃度较高，好友数量在 30 以上，没有加双重验证，格式一般是账号+密码+cookie</p>
                    <p><b>专业号：</b>带有公共主页的个人账号</p>
                    <p><b>小白号：</b>刚注册不久的个人账号，里面什么资源和内容都没有</p>
                    <p><b>老白号：</b>注册时间在 2-3 个月左右的账号</p>
                    <p><b>商城号：</b>带有 Marketplace 的账号，可以直接在 Marketplace 下单，无需跳转第三方</p>
                    <p><b>申诉号：</b>可以使用于申诉公共主页等其他资产的个人账号</p>
                    <p><b>有缘号：</b>使用于交友聊天的账号</p>
                    <p><b>CC号：</b>带 Facebook 官方客服的账号，可以联系官方客服申诉资产或咨询支付限额等问题</p>
                    <p><b>本土号：</b>指定国家的账号，信息内容和注册地址都是当地的个人账号</p>
                    <p><b>账单号：</b>个人号里面的个人户是带支付记录的</p>
                    <p><b>余额户：</b>个人号里面的个人户是带有一定余额</p>
                    <p><b>预充值号：</b>个人号里面的个人户是可以进行充值的</p>
                    <p><b>鱼号：</b>格式只有 cookie，没有账号密码，通过某种技术钓鱼获取</p>
                </div>
            `
        },
        {
            title: '二、公共主页类目',
            content: `
                <div class="p-4 text-[13px] text-slate-600 leading-relaxed space-y-4">
                    <p><b>新主页：</b>注册时间比较短，一般在一年以内，粉丝数量在 0-99 随机，一般都是没有粉丝或者很少</p>
                    <p><b>老主页：</b>注册时间在 1 年以上的，粉丝数量在 0-99 随机</p>
                    <p><b>百粉主页：</b>注册时间在 1 年以上的，粉丝数量在 100-999 之间</p>
                    <p><b>千粉主页：</b>注册时间在 1 年以上的，粉丝数量在 1000-9999 之间</p>
                    <p><b>万粉主页：</b>注册时间在 1 年以上的，粉丝数量在 10000 以上</p>
                    <p><b>五星主页：</b>评分是满分，五星是最高评分，一般都是做实体生意或者有产品的网店生意</p>
                    <p><b>申诉主页：</b>挂了一次，然后申诉回来的主页</p>
                    <p><b>蓝V主页：</b>主页认证了企业或者个人的身份，有一个打钩的蓝色 V 图标</p>
                    <p><b>速推主页：</b>直播的时候可以速推，可以花钱推广在线直播</p>
                </div>
            `
        },
        {
            title: '三、广告账号类目',
            content: `
                <div class="p-4 text-[13px] text-slate-600 leading-relaxed space-y-4">
                    <div>
                        <p class="font-bold text-slate-800 mb-2">1. 个人户</p>
                        <p>普通个人户限额 25-50</p>
                        <p>普通个人户限额 250</p>
                        <p>普通个人户限额 1500</p>
                        <p>普通个人户不限额</p>
                        <p>账单户限额 25-50</p>
                        <p>账单户限额 250</p>
                        <p>账单户限额 1500</p>
                        <p>账单户不限额</p>
                        <p>余额户：广告账户是预充值模式，广告账户带一定余额</p>
                    </div>
                    <div>
                        <p class="font-bold text-slate-800 mb-2 mt-4">2. 国内户（目前分为两种）</p>
                        <p><b>电商户：</b>日限额 450 刀，限制主页、限制域名，跑广告只能使用下户提交的主页进行投放，域名也需要使用下户提交的域名。</p>
                        <p><b>游戏户：</b>日限额 1000 刀，不限域名、限制主页，游戏户的日限额可以联系 Facebook 进行解限。</p>
                        <p><b>国内三不限：</b>不限域名、不限主页、不限额，需要使用经销商 BM（PABM）绑定广告账户，通过国内的主体申请下来。</p>
                    </div>
                    <div>
                        <p class="font-bold text-slate-800 mb-2 mt-4">3. BM 户</p>
                        <p class="mb-2">广告账户由 BM 创建而来，额度有限额 250、1500、不限额这种，有的 BM 有限制创建广告数量：</p>
                        <p><b>BM1：</b>限额 250/1500/不限额，BM 可创建广告数量 1 个</p>
                        <p><b>BM5：</b>限额 250/1500，BM 可创建广告数量 5 个</p>
                        <p><b>BM10：</b>限额 250/1500，BM 可创建广告数量 10 个</p>
                        <p><b>BM100：</b>限额 250/1500，BM 可创建广告数量 100 个</p>
                        <p><b>BM2500：</b>限额 250/1500，BM 可创建广告数量 2500 个</p>
                        <p class="mt-1">以此类推。市面上的玩法就是拿那种空的不限额 BM5，往这个 BM 去拉账单号，变成不限额的。</p>
                    </div>
                    <div>
                        <p class="font-bold text-slate-800 mb-2 mt-4">4. 海外户</p>
                        <p>海外户是海外代理商通过使用当地的企业主体申请下来的广告账户（不限域名、不限消耗、不限主页），处理问题时效会相对较久一点，需要和外国佬倒时差处理问题。</p>
                    </div>
                </div>
            `
        },
        {
            title: '四、BM 类目',
            content: `
                <div class="p-4 text-[13px] text-slate-600 leading-relaxed space-y-4">
                    <p><b>新 BM：</b>创建时间比较短，一般在一年以内</p>
                    <p><b>老 BM：</b>创建时间比较长，时间一般都是一年以上</p>
                    <p><b>企业认证 BM：</b>BM 的企业信息认证了主体的</p>
                    <p><b>经销商 BM（PABM）：</b>由国内主体通过一代申请下来的</p>
                    <p><b>像素 BM：</b>可共享像素 BM</p>
                    
                    <p class="font-bold text-slate-800 mt-6 mb-2">各账号类型定义详解</p>
                    
                    <div>
                        <p class="font-bold text-slate-700 mb-1">1. BM 户</p>
                        <p>① BM1、3、5、10...：指 BM（商务管理中心），数字代表 BM 可创建的广告账户数量上限，目前比较多的有 2500 个，以前还有上限 70000 个账户的 BM。</p>
                        <p>② BM250、350、500、1500...：指 BM 中的广告账户额度，初次建立的 BM 广告账户大多为 $50。</p>
                        <p>③ BM 半限额、不限额：半限额指日限额 $250 或 $350 等，不限额大多数能花到 $5000。</p>
                        <p>④ 不死 BM：经过特殊方法使 BM 受限，但广告功能正常使用，属于 bug，但目前方法已失效。</p>
                        <p>⑤ 企业认证 BM：指通过企业认证后的 BM，权重相对高些，在 BM 设置中的"安全中心"可以开始认证。</p>
                    </div>
                    <div class="mt-4">
                        <p class="font-bold text-slate-700 mb-1">2. 代理商账号、代理户、企业户</p>
                        <p>国内户：通过国内代理开的账户，需要提交公司信息。</p>
                    </div>
                </div>
            `
        }
    ]
};
