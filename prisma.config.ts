import 'dotenv/config';
import { defineConfig } from 'prisma/config';

const fallbackDatabaseUrl = 'postgresql://fang_blog:fang_blog@127.0.0.1:5432/fang_blog?schema=public';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL || fallbackDatabaseUrl,
  },
});
