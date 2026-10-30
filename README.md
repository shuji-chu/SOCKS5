# S5 | 综合数字商业平台

SOSKS5 是一个采用深空视觉风格的综合数字商业平台前端，围绕全球高速节点、海外账号资源与引流机器人三条业务线组织页面。当前仓库以原生 HTML、CSS、JavaScript 构建，无需安装前端框架或依赖包。

## 技术栈

- **HTML5**：多页面静态站点结构。
- **CSS3**：深空 UI、响应式布局、页面与组件样式。
- **原生 JavaScript**：轻量交互与提示，无需构建工具。
- **SVG 本地资源**：品牌 Logo、商品插画、占位图和通用图标。
- **GitHub Actions + GitHub Pages**：推送到 `main` 后自动部署根目录站点。

## 三大业务线

1. **全球高速节点服务**：节点套餐和网络服务展示，入口位于商城的“全球高速节点”区域。
2. **海外账号资源商城**：账号类商品的分类和展示入口。
3. **一键引流机器人矩阵**：机器人推广、引流工具和分销展示入口。

> 说明：当前商品、价格、库存、订单、用户资料与推广数据均为静态演示内容。真实购买、账户和机器人功能需要后端接口接入。

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
