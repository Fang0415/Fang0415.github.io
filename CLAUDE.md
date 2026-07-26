# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目定位

Fang Blog 是一个 Next.js 15 App Router 个人技术博客兼项目档案。公开页面展示文章、项目、经历；后台提供文章 / 项目 / 经历 / 站点信息 / 资源的基础管理。内容优先走 PostgreSQL + Prisma，数据库不可用时自动回退到 `src/lib/site.ts` 和 `src/content/blog` 里的静态数据。

## 常用命令

```bash
# 本地开发
npm install
cp .env.example .env
docker compose up -d          # 启动 PostgreSQL + MinIO
npm run prisma:migrate        # 创建并应用迁移
npm run seed                  # 把 Markdown 文章和 site.ts 数据导入数据库（幂等）
npm run dev                   # http://127.0.0.1:3000

# 后台地址：http://127.0.0.1:3000/admin/
# 本地若未设 ADMIN_PASSWORD，默认密码为 admin
# MinIO 控制台：http://127.0.0.1:9001/

# 构建与部署
npm run build                 # prisma generate + next build
npm run start                 # 生产模式启动 Next 服务
npm run prisma:deploy         # 生产环境应用已有迁移
npm run studio                # 打开 Prisma Studio
```

没有测试脚本；项目以功能验证为主。

## 高层架构

### 1. Next.js App Router + React Server Components

- 公开页面（`src/app/(page|blog|projects|about)`）多为 Server Component，直接调用 `src/lib/managed-content.ts` 读取数据。
- 全局 `layout.tsx` 渲染 `Navbar`、`MobileMenu`、`Footer`、`RevealManager`，并通过 `getSiteProfile()` 注入站点信息。
- 后台页面在 `src/app/admin/`；后台 API 在 `src/app/api/admin/*`。
- `next.config.mjs` 支持 `BASE_PATH` 和 `NEXT_PUBLIC_ASSET_BASE_URL`；`trailingSlash: true`，所有内部链接要带尾斜杠。

### 2. 数据层：DB 优先，静态兜底

`src/lib/managed-content.ts` 是公开页读取内容的统一入口：

- 优先查 Prisma（PostgreSQL）。
- 若表为空或数据库连不上，回退到 `src/lib/site.ts` 中的 `PROJECTS`/`EXPERIENCES`/`PROFILE`，以及 `src/lib/posts.ts` 读取的 `src/content/blog/*.md`。

因此：

- 修改 `src/content/blog` 或 `src/lib/site.ts` 后，要执行 `npm run seed` 才能同步到数据库，否则线上/有 DB 时不会生效。
- 文章详情页优先展示 DB 里的 `Post.content`，渲染时实时生成 HTML。

### 3. Markdown 渲染管线

`src/lib/posts.ts` 中的 `renderMarkdown()` 是核心：

- 使用 `markdown-it` 解析 Markdown。
- 数学公式：`$...$` 行内、`$$...$$` 块级，先 stash 成 `{{{MATH_N}}}` 占位，渲染后再用 KaTeX 替换，避免被 markdown 语法破坏。
- 代码块：由 `highlight.js` 高亮，输出 `<pre class="hljs">`。主题 CSS 在 `public/highlight.js/styles/github.min.css`。
- Obsidian callout：`> [!tip]`、`> [!note]` 等会被替换为 `<div class="callout callout--{kind}">`，统一使用向日葵 SVG 图标。样式在 `src/app/globals.css`。
- TOC：提取 h1/h2/h3，生成锚点 ID；文章页 `ArticleToc.tsx` 在左侧显示。

Katex CSS 和字体自托管在 `public/katex/`；若新增 KaTeX 版本，记得把 `node_modules/katex/dist/fonts/*` 复制到 `public/katex/fonts/`。

### 4. 资源存储：MinIO / S3 兼容

- `src/lib/storage.ts` 封装 AWS S3 SDK，连接 `MINIO_ENDPOINT`。
- 文件上传后对象存储在 bucket，数据库 `Asset` 表只保存元数据（key、bucket、publicUrl、尺寸等）。
- 公开 URL 由 `NEXT_PUBLIC_ASSET_BASE_URL` 拼接；Next.js `images.remotePatterns` 也读取该变量。
- 批量导入脚本 `scripts/import-notes.mjs` 会把文章引用的 SVG 上传到 MinIO，并把 Markdown 里的相对路径替换为公开 URL。

### 5. 后台与认证

- 登录页 `src/app/admin/login/page.tsx`，登录 API 在 `src/app/api/admin/login/route.ts`。
- `src/lib/admin-auth.ts`：基于 HMAC 的 signed cookie、7 天有效期、按 IP 的登录频率限制。
- 后台 API 统一用 `src/lib/admin-api.ts` 中的 `adminRoute()` 包装，处理认证、Prisma 唯一约束 / 外键 / 连接错误，返回中文错误信息。
- 浏览器端请求走 `src/lib/admin-client.ts` 的 `api()`，401 自动跳转登录页。

## 重要约定

- **不用 Tailwind**。样式全部基于 `src/app/globals.css` 里的 CSS 变量和局部 class；设计规范见 `DESIGN.md`。
- **中文正文阅读字体**：`LXGW WenKai`（霞鹜文楷），通过 `@chinese-fonts/lxgwwenkai` 引入；基础字体栈是 Nunito + 系统黑体。
- **slug 唯一性**：`src/lib/admin-api.ts` 提供 `uniqueSlug()`，保存时会自动追加 `-2`、`-3` 避免冲突。
- **排序**：`Project` 和 `Experience` 用 `sortOrder` 字段，间隔 10，拖拽排序后通过 `applyOrder()` 整体重写。
- **文章无持久化 HTML**：`Post` 表只存 `content`，每次读取调用 `renderMarkdown()` 生成 HTML 和 TOC。
- **开发陷阱**：Next.js dev server 偶尔会因为旧 `.next` 缓存导致客户端 JS 404、导航滚动动效失效。处理方式是杀掉 `next-server` 进程、`rm -rf .next`、重新 `npm run dev`。

## 关键文件速查

| 路径 | 作用 |
|------|------|
| `src/lib/managed-content.ts` | 公开页统一数据入口，DB 优先 + 静态兜底 |
| `src/lib/posts.ts` | Markdown 渲染、TOC、KaTeX、callout、代码高亮 |
| `src/lib/site.ts` | 静态站点人设、项目、经历默认值 |
| `src/lib/storage.ts` | MinIO/S3 上传、删除、签名 URL |
| `src/lib/admin-auth.ts` | 后台登录态与频率限制 |
| `src/lib/admin-api.ts` | 后台 API 包装器与输入校验工具 |
| `src/lib/admin-client.ts` | 浏览器端请求封装 |
| `src/app/globals.css` | 全局设计 token 与组件样式 |
| `src/app/layout.tsx` | 根布局，注入字体与全局组件 |
| `prisma/schema.prisma` | Post / Project / Experience / SiteProfile / Asset 模型 |
| `docker-compose.yml` | 本地 PostgreSQL + MinIO |
| `scripts/import-notes.mjs` | 批量导入 Markdown + 上传 SVG 到 MinIO |
| `scripts/update-descriptions.mjs` | 批量更新已导入文章的 description |
| `prisma/seed.ts` | 把本地 Markdown/site.ts 数据同步进数据库 |
