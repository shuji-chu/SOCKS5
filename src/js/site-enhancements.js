(() => {
'use strict';
const legalKey='sosks5_legal_accepted_v1';
const promos=[
 {title:'账号、节点、引流，一站式管理',desc:'浏览商品与服务说明，购买前请确认商品详情及适用范围。',label:'立即查看 →',href:'#/products'},
 {title:'新手先看教程，减少操作问题',desc:'注册登录、购买交付、节点配置、卡密兑换与账号安全指南。',label:'查看教程 →',href:'#/tutorials'},
 {title:'需要协助？官方客服为你指引',desc:'请通过官方 Telegram 或邮箱联系；不要向任何人提供密码或验证码。',label:'联系支持 →',href:'https://t.me/qingtian_Boss'},
 {title:'开发者接入与业务 API',desc:'查看公开业务接口文档、鉴权方式、请求参数与错误码。',label:'打开 API →',href:'./docs/'}
];
let promoIndex=0,promoTimer=null;
function rotatePromo(){const p=promos[promoIndex];const title=document.getElementById('s5-promo-title'),desc=document.getElementById('s5-promo-desc'),link=document.getElementById('s5-promo-link');if(!title||!desc||!link)return;title.textContent=p.title;desc.textContent=p.desc;link.textContent=p.label;link.href=p.href;const wrap=document.getElementById('s5-promo');if(wrap)wrap.dataset.slide=String(promoIndex);}
function legal(){if(localStorage.getItem(legalKey)==='yes')return;const overlay=document.createElement('div');overlay.className='s5-legal-overlay';overlay.innerHTML=`<section class="s5-legal-box" role="dialog" aria-modal="true" aria-labelledby="s5-legal-title"><h2 id="s5-legal-title">欢迎使用 SOSKS5｜用户协议与隐私说明</h2><p>请在使用本站前阅读以下说明。点击“同意并继续”表示你已阅读并接受本提示；具体服务规则以订单页及后续正式协议为准。</p>
<h3>一、服务范围与账号资格</h3><p>本站提供数字商品信息展示、账号相关商品、节点服务、引流资源、教程与订单支持。用户须遵守所在地法律法规及第三方平台规则，仅能将购买的商品和服务用于合法用途。不得用于欺诈、骚扰、未经授权访问、绕过安全限制或侵犯他人权益。</p>
<h3>二、订单、价格与交付</h3><p>商品名称、规格、库存、有效期、适用地区与价格以商品详情和提交订单时显示内容为准。数字商品具有特殊属性，购买前请确认规格。付款状态以本站服务端核验结果为准；如页面未明确显示支付成功或交付完成，请勿重复付款，并联系官方客服提供订单号。不得仅凭用户上传的付款截图认定到账。</p>
<h3>三、支付与退款</h3><p>本站计划支持支付宝与 USDT 两类支付方式，实际可用通道以结算页为准。只有服务端收到可信支付回调并验证金额、币种、订单号和签名后，才能自动确认订单及开通服务。区块链转账须核对网络、地址和金额；错误网络或地址造成的损失可能无法追回。退款与售后依商品类型、交付状态及适用法律处理。</p>
<h3>四、用户责任与账号安全</h3><p>用户应妥善保管登录凭据、邮箱、验证码及卡密，不得将验证码或密码告知客服或其他人。请遵循平台正常使用流程，不得通过异常自动化、垃圾信息或违规操作损害服务稳定性。账号可用性还可能受第三方政策、地区和风控影响，本站不承诺第三方永久提供服务。</p>
<h3>五、隐私与数据处理</h3><p>为提供注册、登录、订单、支付核验、售后和安全防护，服务可能处理必要的账号标识、昵称、联系邮箱、订单记录、支付状态、设备/日志信息及用户主动提交的内容。我们仅应在提供服务、履行法律义务、防止欺诈和解决争议所需范围内处理数据，并采取合理访问控制。请勿上传身份证件、支付密码、私钥或其他非必要敏感资料。数据保存期限、删除请求和跨境处理方式应以正式隐私政策及适用法律为准。</p>
<h3>六、引流内容与第三方链接</h3><p>用户发布的链接、广告、评论和资源由发布者负责。本站可对涉嫌违法、欺诈、侵权、垃圾信息或安全风险的内容进行限制或移除。第三方网站、应用、支付机构及网络服务有其独立条款与隐私政策，访问前请自行核验。</p>
<h3>七、AI 客服说明</h3><p>AI 客服用于提供本站商品分类、购买流程、节点配置、教程、订单排查和常见问题指引。AI 回复可能不完整或存在错误；涉及退款、支付确认、账号交付、账户安全或争议时，以后台订单记录和人工客服核验为准。请勿向 AI 输入密码、验证码、私钥或完整支付凭据。</p>
<h3>八、风险提示、责任与更新</h3><p>网络环境、第三方服务、数字商品和链上转账均可能存在风险。本站会努力维护服务，但无法保证网络永不中断或第三方平台不变更规则。协议可能因业务和法律要求更新；重大变化应通过站内公告提示。若不同意，请停止使用本站并联系支持处理未完成订单。</p>
<h3>九、联系我们</h3><p>Telegram 客服：@qingtian_Boss；邮箱：boss@lynli.me。请提供订单号及必要的非敏感信息，勿发送密码、验证码或私钥。</p>
<div class="s5-legal-actions"><button class="s5-legal-close" id="s5-legal-leave">暂不同意</button><button class="s5-legal-accept" id="s5-legal-accept">同意并继续</button></div></section>`;
document.body.appendChild(overlay);overlay.querySelector('#s5-legal-accept').onclick=()=>{localStorage.setItem(legalKey,'yes');overlay.remove()};overlay.querySelector('#s5-legal-leave').onclick=()=>{overlay.remove();const note=document.createElement('div');note.className='fixed bottom-4 left-4 right-4 z-[121] rounded-xl bg-slate-900 text-white p-4 text-sm';note.textContent='你尚未同意用户协议；使用本站服务前请先阅读并同意相关条款。';document.body.appendChild(note);setTimeout(()=>note.remove(),5000)};
}
function addFooterLinks(){const main=document.getElementById('app-view');if(!main||document.getElementById('s5-footer-links'))return;const f=document.createElement('footer');f.id='s5-footer-links';f.style.cssText='display:flex;gap:12px;flex-wrap:wrap;justify-content:center;padding:26px 10px;color:#6b829c;font-size:12px';f.innerHTML='<a href="#/tutorials">使用教程</a><a href="./docs/">开发者 API</a><a href="#s5-privacy" data-legal-open>隐私政策</a><a href="#s5-terms" data-legal-open>用户协议</a><a href="https://t.me/qingtian_Boss" target="_blank" rel="noopener">Telegram 客服 @qingtian_Boss</a><a href="mailto:boss@lynli.me">boss@lynli.me</a>';main.after(f);f.querySelectorAll('[data-legal-open]').forEach(a=>a.onclick=e=>{e.preventDefault();localStorage.removeItem(legalKey);legal()})}
function tutorialView(){return `<section class="s5-tutorial-page"><div class="text-xs tracking-widest text-sky-300 mb-3">SOSKS5 HELP CENTER</div><h1>教程中心</h1><p>请先确认商品详情、适用范围和第三方服务规则，再进行购买或配置。</p>
<h2 id="register">1. 注册与登录教程</h2><ol><li>从网站顶部进入注册/登录，使用你能正常访问的邮箱并完成验证。</li><li>使用强且唯一的密码；不要把验证码、密码或恢复码发给任何人。</li><li>若登录失败，先检查邮箱拼写、网络、验证码时效；仍无法登录请联系官方客服。</li></ol>
<h2 id="buy">2. 购买、订单与交付教程</h2><ol><li>进入账号商城，查看商品图标、分类、规格、库存、有效期和售后规则。</li><li>提交订单后，在结算页选择当前实际开放的支付方式；务必核对金额、订单号和 USDT 网络。</li><li>等待服务端核验支付状态及订单交付状态；不要重复付款。若订单长时间未更新，联系支持并提供订单号。</li></ol>
<h2 id="account">3. 账号首次使用教程</h2><ol><li>按商品说明使用对应平台的官方登录入口；不要通过来路不明的链接输入凭据。</li><li>确认账号交付内容与订单一致后，按平台允许的流程完成必要安全设置。</li><li>不要用于垃圾信息、欺诈、冒充他人、绕过平台安全措施或违反平台服务条款的行为。</li></ol>
<h2 id="health">4. 账号维护与安全指南</h2><p>使用稳定的设备和正常网络，启用平台提供的安全保护，保留订单凭证。避免频繁异常操作和共享敏感凭据；不要使用脚本或手段规避第三方平台的安全检测。账号可用性受第三方规则与风控影响。</p>
<h2 id="nodes">5. 节点配置与连接排查</h2><ol><li>进入节点中心，确认节点协议、到期时间、设备数量与使用限制。</li><li>仅使用商品说明中支持的客户端与导入方式；导入订阅或配置后检查系统代理和 DNS 设置。</li><li>若无法连接，先切换网络、更新客户端并检查订阅是否过期；勿公开分享个人订阅链接。</li></ol>
<h2 id="sms">6. 接码服务使用教程</h2><p>购买前确认国家/地区、平台支持、号码时效与服务限制。仅用于你有权使用的账号及合法用途；不要用接码进行欺诈、批量骚扰或规避平台限制。一次性号码可能无法长期接收短信。</p>
<h2 id="keys">7. 卡密兑换与查询教程</h2><ol><li>在对应商品或订单页找到官方兑换入口，按提示输入卡密。</li><li>确认兑换结果后保存订单号；不要把未使用卡密公开或发给陌生人。</li><li>提示无效、已使用或过期时，核对字符与商品类型后联系支持，不要反复向不明页面提交。</li></ol>
<h2 id="refund">8. 售后与退款</h2><p>请先查看商品页的售后规则，再准备订单号、问题描述和必要截图（遮盖邮箱、支付账户及其他敏感信息）。支付到账与退款结果以后台核验为准。</p>
<h2>9. 联系客服与隐私</h2><p>Telegram：<a href="https://t.me/qingtian_Boss" target="_blank" rel="noopener">@qingtian_Boss</a>；邮箱：<a href="mailto:boss@lynli.me">boss@lynli.me</a>。本站不会要求你提供密码、验证码或 USDT 私钥。</p>
<a class="s5-primary-btn mt-5" href="#/products">返回账号商城 →</a></section>`}
document.addEventListener('DOMContentLoaded',()=>{
 const nav=document.querySelector('#navbar .hidden.md\\:flex.items-center');if(nav){nav.querySelectorAll('a').forEach(a=>{const t=a.textContent.trim();if(t==='首页'||t==='Home')a.textContent='首页';if(t==='账号商城'||t==='Products')a.textContent='账号商城';if(t==='订单查询'||t==='Query')a.textContent='订单查询';if(t==='节点中心'||t==='Nodes')a.textContent='节点中心';});}
 if(window.App&&App.views){App.views.tutorials=tutorialView;const original=App.router.bind(App);App.router=function(){const hash=location.hash||'#/';if(hash.startsWith('#/tutorials')){const v=document.getElementById('app-view');if(v)v.innerHTML=tutorialView();if(this.toggleDrawer)this.toggleDrawer(false);return}original();};}
 rotatePromo();promoTimer=setInterval(()=>{promoIndex=(promoIndex+1)%promos.length;rotatePromo()},5500);
 const observer=new MutationObserver(()=>{rotatePromo();addFooterLinks()});const main=document.getElementById('app-view');if(main)observer.observe(main,{childList:true,subtree:false});
 addFooterLinks();setTimeout(legal,900);
});
})();