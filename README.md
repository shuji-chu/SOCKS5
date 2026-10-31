# S5 | 综合数字商业平台

SOSKS5 是一个采用冰蓝纯白视觉规范的综合数字商业平台前端，围绕全球高速节点、海外账号资源与引流服务三条业务线组织页面。当前仓库以原生 HTML、CSS、JavaScript 构建，无需安装前端框架或依赖包。

## 技术栈

- **HTML5**：多页面静态站点结构。
- **CSS3**：冰蓝纯白 UI、响应式布局、页面与组件样式。
- **原生 JavaScript**：轻量交互与提示，无需构建工具。
- **SVG 本地资源**：品牌 Logo、商品插画、占位图和通用图标。
- **GitHub Actions + GitHub Pages**：推送到 `main` 后自动部署根目录站点。

## 三大业务线

1. **全球高速节点服务**：节点套餐和网络服务展示，入口位于商城的“全球高速节点”区域。
2. **海外账号资源商城**：账号类商品的分类和展示入口。
3. **一键引流机器人矩阵**：机器人推广、引流工具和分销展示入口。

> 说明：商品目录由独立静态 JSON 提供；登录、订单、支付配置、用户资料与分销统计依赖远程 API。静态目录存在不代表库存、支付、交付或资金结算已经通过生产验收。

## 项目目录

```text
SOCKS5/
├── .github/
│   └── workflows/
│       └── deploy.yml       # 推送 main 后自动部署 GitHub Pages
├── assets/
│   ├── images/
│   │   ├── logo.svg         # 本地品牌 Logo
│   │   ├── placeholder.svg  # 默认占位插画
│   │   ├── accounts.svg     # 账号商城插画
│   │   ├── nodes.svg        # 全球节点插画
│   │   └── automation.svg   # 引流自动化插画
│   └── icons/
│       ├── arrow-up-right.svg
│       └── network.svg
├── css/
│   ├── global.css           # 全局基础样式
│   ├── components.css       # 通用组件样式
│   └── pages.css            # 页面样式
├── js/
│   ├── api.js               # 保留的旧 API 集成模块
│   ├── ui.js                # 通用交互
│   └── main.js              # 页面入口交互
├── index.html               # 首页
├── shop.html                # 账号与节点商城
├── promo.html               # 引流机器人 / 分销中心
├── user.html                # 个人中心
├── login.html               # 独立登录页
├── .gitignore
├── LICENSE
└── README.md
```

## 本地运行

### 方式一：Python 简易服务器

在仓库根目录执行：

```bash
python -m http.server 8080
```

然后打开 <http://localhost:8080/>。

### 方式二：直接打开

也可以直接打开根目录的 `index.html`。若浏览器对本地文件资源或脚本有限制，建议使用方式一。

## HTML 资源路径规范

页面位于仓库根目录时，请使用相对根目录的路径：

- CSS：`./css/global.css`、`./css/components.css`、`./css/pages.css`
- JavaScript：`./js/ui.js`、`./js/main.js`
- 图片：`./assets/images/logo.svg`、`./assets/images/placeholder.svg`
- 图标：`./assets/icons/network.svg`

例如：

```html
<img src="./assets/images/accounts.svg" alt="账号商城插画">
<img src="./assets/icons/network.svg" alt="" aria-hidden="true">
```

请避免以 `/assets/...` 开头的绝对路径：项目发布在 GitHub Pages 的项目子路径下时，这种路径可能指向错误位置。

## 自动部署到 GitHub Pages

工作流文件：`.github/workflows/deploy.yml`

1. 确认仓库默认分支为 `main`，推送到该分支会触发部署。
2. 在 GitHub 仓库打开 **Settings → Pages**。
3. 在 **Build and deployment → Source** 中选择 **GitHub Actions**。
4. 打开 **Actions** 查看部署结果；也可手动运行 “Deploy static site to GitHub Pages”。

工作流会把仓库根目录作为静态站点发布目录。不要把密钥、Token、真实用户资料或本地环境文件提交到仓库。

## 开源协议

本项目采用 MIT License，详见根目录的 `LICENSE` 文件。


## 真实数据接口

页面请求统一由 `js/api.js` 发出，`js/main.js` 负责页面渲染：

- `GET /api/v1/user/info`：登录用户资料、短 ID、余额字段。
- `GET /api/v1/user/plan/fetch`：节点套餐。
- `GET /api/v1/user/cloned_products`：海外账号商品（需要后端实现并返回商品数组）。
- `GET /api/v1/user/getSubscribe`：订阅链接与流量字段。
- `GET /api/v1/user/invite/fetch`、`GET /api/v1/user/invite/customers`：邀请统计与当前用户邀请客户。
- `GET /api/v1/user/referrals/leaderboard`：若后端部署该路由，则展示真实排行榜；路由不可用时页面显示真实邀请客户明细。
- `GET /api/v1/user/bot/status`：TG 机器人绑定状态与入口。
- `GET /api/v1/user/notices`：公告。

当前后端源码中 `/user/cloned_products` 与 `/user/referrals/leaderboard` 尚未找到对应路由；用户信息接口的 `balance` 字段也返回固定的 `0`。这些数据必须由后端补齐后，前端才能显示真实账号商品、全站排行榜和真实余额。前端不会用静态假数据填补这些缺口。


## 营业前 P0 放行条件

**当前状态：未获准正式开放真实付费交易。** 前端代码修复不等于支付服务端、数据库、支付商户账户或真实交付已经验收。

本仓库当前已知的前端保护措施（修复分支 `fix/p0-commerce-launch-blockers-20261031`）：

- 节点演示端点不再进入旧版结算流程；真实节点资源未接入时，节点购买会被阻断。
- 商品价格缺失、无效或为 0 时，不显示为可正常购买的有效价格，也不允许创建订单。
- 结算只提交 SKU、周期、支付方式和增值服务代码；不再把浏览器计算的金额作为订单金额提交，金额必须由服务端重新计算。
- 支付通道中的演示、测试、沙盒及禁用方式不会被当作正式支付方式。
- 前端仅展示 HTTPS 支付链接，不把接口原始响应中的潜在敏感字段直接显示给客户。

### 仍须由后端/运营侧完成的 P0 验收

1. 订单金额必须由服务端根据 SKU、周期、库存、优惠及增值服务重新计算；拒绝客户端篡改金额。
2. 支付回调必须验证渠道签名、商户号、订单号、金额、币种和支付状态；回调必须幂等，重复通知不能重复发货或重复入账。
3. 只有服务端确认支付成功后才能扣库存、发放商品/节点/订阅，并且交付失败必须可重试、可追踪。
4. 必须验证订单状态查询、超时关闭、退款/撤销、支付金额不一致和并发重复下单。
5. 余额、佣金比例（全站 15%）、可提现金额及提现审核必须以服务端账本为准，不能以浏览器显示值作为结算依据。
6. 必须完成生产支付商户配置、HTTPS 回调地址、密钥保管、数据库备份与恢复演练、异常告警和售后流程。
7. 使用真实测试账户完成端到端验收，并保留订单号、支付渠道流水号、交付记录和服务端日志作为证据。

本仓库未包含可供本次提交验证的完整后端源码、生产数据库和支付商户后台，因此上述服务端项目目前均标记为**待验收**，不得将本次前端提交解释为“已完成支付闭环”或“可以正式营业”。
