---
title: "把 Next.js 静态博客部署到自有服务器"
description: "一个简短的部署清单：本地构建 Next.js，把 out 同步到服务器，并用 Nginx 托管静态站点。"
pubDate: 2026-06-15
tags: ["Next.js", "Nginx", "部署"]
---

Next.js 可以静态导出，所以部署到自有服务器并不复杂。核心路径是：安装依赖，构建站点，把 `out` 同步到服务器目录，最后让 Nginx 托管这些静态文件。

站点地址不应该写死在代码里，最好通过环境变量传入：

```js
export default defineConfig({
  site: process.env.SITE_URL,
});
```

一个最小部署流程可以是：

```bash
npm run build
rsync -az --delete out/ deploy@example.com:/var/www/fang-blog/
```

Nginx 只需要把站点目录作为 `root`，并让普通路径直接查找静态文件：

```nginx
location / {
  try_files $uri $uri/ =404;
}
```

需要额外注意的是域名解析、HTTPS 证书和文件权限。部署脚本可以简单，但这些基础设施决定了站点是否能稳定访问。
