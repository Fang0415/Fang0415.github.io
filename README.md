# Fang Blog

个人技术博客与工程项目档案。当前项目已从 GitHub Pages 静态站点调整为自有服务器部署的 Next.js 全栈应用，支持文章、项目和资源的基础后台管理。

## 技术栈

- Next.js App Router
- React
- TypeScript
- PostgreSQL + Prisma
- MinIO（S3 兼容对象存储）
- CSS design tokens in `src/app/globals.css`

## 本地开发

```bash
npm install
cp .env.example .env
docker compose up -d
npm run prisma:migrate
npm run dev
```

默认访问地址：

- 站点：http://127.0.0.1:3000/
- 管理后台：http://127.0.0.1:3000/admin/
- MinIO 控制台：http://127.0.0.1:9001/

`.env.example` 里的本地默认值可以直接配合 `docker-compose.yml` 使用。生产环境必须修改 `ADMIN_PASSWORD` 和 `ADMIN_SESSION_SECRET`。

## 内容管理

后台目前提供最基础的能力：

- 文章：创建、编辑、发布、归档、删除
- 项目：创建、编辑、排序、状态管理、删除
- 资源：上传文件到 MinIO，数据库保存资源元数据和公开 URL

公开页面读取策略：

- 如果数据库里有已发布文章或可见项目，优先展示后台数据。
- 如果数据库不可用或还没有后台数据，回退到现有 Markdown 文章和 `src/lib/site.ts` 中的静态项目数据。

## 资源存储

文件本体存放在 MinIO bucket，数据库只保存元数据：

- `Asset.key`：对象存储 key
- `Asset.bucket`：bucket 名称
- `Asset.publicUrl`：公开访问 URL
- `Post.coverAssetId` / `Project.coverAssetId`：封面资源关联

本地 `minio-init` 容器会自动创建 `fang-blog` bucket，并设置匿名只读下载。生产环境可以继续用 MinIO，也可以迁移到其他 S3 兼容服务；只要保持环境变量一致，业务代码不用大改。

## 常用命令

```bash
npm run dev              # 本地开发
npm run build            # Prisma generate + Next build
npm run start            # 生产模式启动 Next 服务
npm run prisma:migrate   # 本地创建并应用迁移
npm run prisma:deploy    # 生产环境应用已有迁移
npm run studio           # 打开 Prisma Studio
```

## 自有服务器部署

推荐结构：

1. 服务器安装 Node.js、PostgreSQL、MinIO、Nginx。
2. 拉取项目代码并安装依赖。
3. 写入生产 `.env`。
4. 执行数据库迁移和构建。
5. 用 systemd、PM2 或 Docker 运行 `npm run start`。
6. 用 Nginx 反向代理到 `127.0.0.1:3000`，参考 `deploy/nginx.conf`。

示例流程：

```bash
npm ci
npm run prisma:deploy
npm run build
npm run start
```

生产环境还需要：

- 将域名 DNS 解析到服务器。
- 配置 HTTPS 证书，例如 Certbot 或 Caddy。
- 设置 MinIO bucket 的访问策略，或把 `NEXT_PUBLIC_ASSET_BASE_URL` 指向 CDN/对象存储公开域名。
- 定期备份 PostgreSQL 和 MinIO 数据目录。

## 主要文件

- `src/app/admin/`：后台页面
- `src/app/api/admin/`：后台 API
- `src/lib/storage.ts`：MinIO/S3 上传逻辑
- `src/lib/db.ts`：Prisma Client
- `src/lib/managed-content.ts`：公开页的数据读取与回退策略
- `prisma/schema.prisma`：数据模型
- `docker-compose.yml`：本地 PostgreSQL + MinIO
- `deploy/nginx.conf`：Next 服务反向代理示例
- `DESIGN.md`：视觉规范

## 不要提交

- `node_modules`
- `.next`
- `dist`
- `.env` 和 `.env.*`
- API Key、Token、密码、Cookie、私人配置、手机号、住址等隐私文件
