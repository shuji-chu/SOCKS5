# TGX Account (SOCKS5) 项目说明

## 一句话总结
本项目是一个正在开发中的“TGX Account”一体化网站前端，主要业务涵盖：海外账号售卖、流量引流、节点代理服务以及订单/账号查询。

## 项目状态
- **开发中**：目前为纯前端静态页面原型。
- **技术栈**：原生 HTML5、JavaScript，UI 样式依赖 Tailwind CSS (CDN 引入)。
- **架构**：单页应用 (SPA)，基于 Hash 路由切换页面。

## 目录结构
- `index.html`：外层重定向入口，自动跳转至 `src/index.html`。
- `src/index.html`：网站主框架，包含顶部导航栏（Home、Products、Query、Nodes）及页面容器。
- `src/api-data.js`：业务数据文件，硬编码了当前提供的服务与商品信息（目前包含了大量手机号、银行卡、身份证等实名验证 API 的文档和定价）。
- `src/` 其他资源：包含 css、js、assets（Logo、图片）等。

## 核心业务模块
1. **Home（首页/引流）**：展示平台定位，提供引流入口。
2. **Products（商品售卖）**：展示 `api-data.js` 中配置的海外账号及各类 API 接口服务。
3. **Query（查询系统）**：提供用户查询已购账号、API 密钥或订单状态的入口。
4. **Nodes（节点代理）**：提供 SOCKS5 / 其他代理节点的获取与使用展示。

## 运行预览
直接用浏览器打开根目录的 `index.html` 即可查看当前开发进度（会重定向到 src 下）。
