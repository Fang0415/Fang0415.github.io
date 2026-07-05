import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const fallbackDatabaseUrl = 'postgresql://fang_blog:fang_blog@127.0.0.1:5432/fang_blog?schema=public';
const connectionString = process.env.DATABASE_URL || fallbackDatabaseUrl;
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const adapter = new PrismaPg({ connectionString });

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
