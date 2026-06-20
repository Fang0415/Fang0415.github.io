# Fang Blog

个人技术杂志 + 工程项目档案。这个站点使用 Astro、Tailwind CSS、Markdown/MDX 和 GitHub Pages 构建，用来记录 RAG、AI Agent、后端工程、开发工具链与网络基础设施笔记。

## 技术栈

- Astro
- Tailwind CSS
- Astro Content Collections
- Markdown / MDX
- GitHub Actions
- GitHub Pages

## 本地启动

```bash
npm install
npm run dev
npm run build
npm run preview
```

## 内容编辑

- 新增文章：编辑 `src/content/blog/`
- 修改首页：编辑 `src/pages/index.astro`
- 修改文章列表：编辑 `src/pages/blog/index.astro`
- 修改文章详情：编辑 `src/layouts/PostLayout.astro` 和 `src/styles/global.css`
- 修改导航：编辑 `src/components/Header.astro`
- 修改项目展示：编辑 `src/pages/projects/index.astro` 和 `src/components/ProjectCard.astro`
- 修改整体视觉：优先编辑 `DESIGN.md`、`tailwind.config.mjs`、`src/styles/global.css`

## 新增文章

在 `src/content/blog/` 下创建 `.md` 或 `.mdx` 文件，并添加 frontmatter：

```yaml
---
title: Article title
description: Short summary
pubDate: 2026-06-21
tags: [RAG, Python]
---
```

文件名会成为文章 slug，例如 `rag-notes.md` 对应 `/blog/rag-notes/`。

## 设计文件

- `DESIGN.md`：最高优先级视觉规范，使用 WIRED 式技术杂志方向，强调白底、强黑白对比、编辑感排版和清晰阅读层级。
- `docs/design-reference-linear.md`：局部工程感参考，只用于项目卡片、技术栈标签、代码块、hover 状态和少量紫色 accent。
- `docs/layout-reference.md`：记录成熟技术博客、开发者主页和产品博客的信息结构参考。

## GitHub Pages 部署

`.github/workflows/deploy.yml` 会在 `main` 分支 push 后自动安装依赖、构建站点、上传 `dist` 并部署到 GitHub Pages。

默认配置适用于 `Fang0415.github.io` 仓库：

```js
export default defineConfig({
  site: 'https://Fang0415.github.io',
});
```

如果仓库不是 `username.github.io`，而是普通项目仓库，例如 `fan-blog`，需要配置：

```js
export default defineConfig({
  site: 'https://Fang0415.github.io',
  base: '/fan-blog',
});
```

## 自定义域名

在 GitHub Pages 设置中绑定域名。如果需要随构建发布 `CNAME`，可在 `public/CNAME` 中写入域名，例如：

```text
blog.example.com
```

## 不要提交

- `node_modules`
- `dist`
- `.astro`
- `.env` 和 `.env.*`
- API Key、Token、密码、Cookie、私人配置、手机号、住址等隐私文件
