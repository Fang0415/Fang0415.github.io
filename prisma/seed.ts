/**
 * Imports the checked-in Markdown posts and the static persona data in
 * src/lib/site.ts into Postgres, so a fresh install opens the admin console
 * on the same content the site already renders instead of an empty shell.
 *
 * Idempotent: everything upserts on its natural key, so re-running it after
 * editing a Markdown file syncs that file and leaves admin-created rows alone.
 *
 *   npm run seed
 */
import 'dotenv/config';
import { PrismaClient, ProjectStatus, PublishStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { EXPERIENCES, PROFILE, PROJECTS } from '../src/lib/site.ts';
import { getAllPosts, sortedPosts } from '../src/lib/posts.ts';

const connectionString = process.env.DATABASE_URL
  || 'postgresql://fang_blog:fang_blog@127.0.0.1:5432/fang_blog?schema=public';
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

const statusFromSite: Record<string, ProjectStatus> = {
  active: ProjectStatus.ACTIVE,
  building: ProjectStatus.BUILDING,
  shipped: ProjectStatus.SHIPPED,
  archived: ProjectStatus.ARCHIVED,
};

// The hero string shipped before the 2026-07 copy refresh. If the row still
// carries it verbatim, the admin never edited it, so reseeding may upgrade it
// to the current default; a customized hero is left alone.
const oldHero = "There's still so much I don't know, so I keep looking.";

async function seedProfile() {
  const existing = await prisma.siteProfile.findUnique({ where: { id: 'default' } });
  if (!existing) {
    await prisma.siteProfile.create({ data: { id: 'default', ...PROFILE } });
    console.log('· 站点信息已创建');
    return;
  }
  // Only backfill what is still empty. A row created before the About-page
  // columns existed should pick up the defaults; anything the admin has already
  // written stays untouched.
  const backfill = {
    ...(existing.hero === oldHero ? { hero: PROFILE.hero } : {}),
    ...(existing.aboutIntro ? {} : { aboutIntro: PROFILE.aboutIntro }),
    ...(existing.focus.length ? {} : { focus: PROFILE.focus }),
    ...(existing.tools.length ? {} : { tools: PROFILE.tools }),
    ...(existing.now.length ? {} : { now: PROFILE.now }),
    ...(existing.background.length ? {} : { background: PROFILE.background }),
  };
  if (Object.keys(backfill).length) {
    await prisma.siteProfile.update({ where: { id: 'default' }, data: backfill });
  }
  console.log(`· 站点信息已就绪${Object.keys(backfill).length ? '（补齐了关于页字段）' : ''}`);
}

async function seedProjects() {
  for (const [index, project] of PROJECTS.entries()) {
    const data = {
      title: project.title,
      summary: project.description,
      content: project.highlights?.length ? project.highlights.map((h) => `- ${h}`).join('\n') : null,
      category: project.category,
      stack: project.stack,
      repoUrl: project.repo && project.repo !== '#' ? project.repo : null,
      demoUrl: project.demo && project.demo !== '#' ? project.demo : null,
      status: statusFromSite[project.status] ?? ProjectStatus.BUILDING,
      sortOrder: (index + 1) * 10,
    };
    await prisma.project.upsert({
      where: { slug: project.id },
      update: data,
      create: { slug: project.id, ...data },
    });
  }
  console.log(`· 项目 ${PROJECTS.length} 条`);
}

async function seedExperiences() {
  for (const [index, experience] of EXPERIENCES.entries()) {
    const data = {
      company: experience.company,
      role: experience.role,
      period: experience.period,
      summary: experience.summary,
      highlights: experience.highlights,
      stack: experience.stack,
      sortOrder: (index + 1) * 10,
    };
    await prisma.experience.upsert({
      where: { slug: experience.id },
      update: data,
      create: { slug: experience.id, ...data },
    });
  }
  console.log(`· 经历 ${EXPERIENCES.length} 条`);
}

async function seedPosts() {
  const posts = sortedPosts(getAllPosts());
  for (const post of posts) {
    const data = {
      title: post.data.title,
      description: post.data.description,
      content: post.body,
      tags: post.data.tags,
      status: post.data.draft ? PublishStatus.DRAFT : PublishStatus.PUBLISHED,
      publishedAt: post.data.draft ? null : post.data.pubDate,
    };
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: data,
      create: { slug: post.slug, ...data },
    });
  }
  console.log(`· 文章 ${posts.length} 篇`);
}

async function main() {
  await seedProfile();
  await seedProjects();
  await seedExperiences();
  await seedPosts();
  console.log('种子数据导入完成。');
}

main()
  .catch((error) => {
    console.error('种子数据导入失败：', error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
