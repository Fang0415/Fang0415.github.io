---
title: "把 Astro 博客部署到 GitHub Pages"
description: "一个简短的部署清单：用 GitHub Actions 构建 Astro，并把 dist 发布到 GitHub Pages。"
pubDate: 2026-06-15
tags: ["Astro", "GitHub Pages", "部署"]
---

GitHub Pages 很适合静态技术博客。它的部署路径足够明确：安装依赖，构建站点，上传 `dist`，最后让 Pages 托管构建产物。

如果是用户站点，例如 `Fang0415.github.io`，Astro 可以使用根路径：

```js
export default defineConfig({
  site: "https://Fang0415.github.io",
});
```

如果是普通项目仓库，就需要添加 `base`：

```js
export default defineConfig({
  site: "https://Fang0415.github.io",
  base: "/fan-blog",
});
```

常见问题是：本地路由和部署后的子路径不一致。用户站点通常最省心，普通项目仓库则要认真处理 `base`。
