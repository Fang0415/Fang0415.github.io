import { Prisma, ProjectStatus, PublishStatus } from '@prisma/client';
import {
  categoryForTags,
  getAllPosts,
  getPostBySlug,
  isoDate,
  markdownToHtml,
  readTimeFor,
  sortedPosts,
  toMeta,
  type BlogPost,
  type PostMeta,
} from './posts';
import { prisma } from './db';
import { PROJECTS, type Project } from './site';

type DbPost = Prisma.PostGetPayload<{ include: { coverAsset: true } }>;
type DbProject = Prisma.ProjectGetPayload<{ include: { coverAsset: true } }>;

function fallbackPostMetas(): PostMeta[] {
  return sortedPosts(getAllPosts()).map(toMeta);
}

function dbPostToBlogPost(post: DbPost): BlogPost {
  const pubDate = post.publishedAt ?? post.updatedAt;
  return {
    slug: post.slug,
    body: post.content,
    html: markdownToHtml(post.content),
    data: {
      title: post.title,
      description: post.description,
      pubDate,
      updatedDate: post.updatedAt,
      tags: post.tags,
      draft: post.status !== PublishStatus.PUBLISHED,
    },
  };
}

function dbPostToMeta(post: DbPost): PostMeta {
  const { category, color } = categoryForTags(post.tags);
  const date = isoDate(post.publishedAt ?? post.updatedAt);
  return {
    title: post.title,
    excerpt: post.description,
    date,
    isoDate: date,
    category,
    categoryColor: color,
    readTime: readTimeFor(post.content),
    href: `/blog/${post.slug}/`,
  };
}

function dbStatusToProjectStatus(status: ProjectStatus): Project['status'] {
  if (status === ProjectStatus.ACTIVE) return 'active';
  if (status === ProjectStatus.SHIPPED) return 'shipped';
  if (status === ProjectStatus.ARCHIVED) return 'archived';
  return 'building';
}

function dbProjectToProject(project: DbProject): Project {
  return {
    id: project.slug,
    title: project.title,
    status: dbStatusToProjectStatus(project.status),
    category: project.category,
    description: project.summary,
    stack: project.stack,
    repo: project.repoUrl ?? undefined,
    demo: project.demoUrl ?? undefined,
  };
}

export async function getPublishedPostMetas(): Promise<PostMeta[]> {
  try {
    const posts = await prisma.post.findMany({
      where: { status: PublishStatus.PUBLISHED },
      orderBy: [{ publishedAt: 'desc' }, { updatedAt: 'desc' }],
      include: { coverAsset: true },
    });
    return posts.length ? posts.map(dbPostToMeta) : fallbackPostMetas();
  } catch {
    return fallbackPostMetas();
  }
}

export async function getPublishedPostBySlug(slug: string): Promise<BlogPost | undefined> {
  try {
    const post = await prisma.post.findFirst({
      where: { slug, status: PublishStatus.PUBLISHED },
      include: { coverAsset: true },
    });
    if (post) return dbPostToBlogPost(post);
  } catch {
    // Fall through to Markdown content below.
  }
  return getPostBySlug(slug);
}

export async function getVisibleProjects(): Promise<Project[]> {
  try {
    const projects = await prisma.project.findMany({
      where: { status: { not: ProjectStatus.ARCHIVED } },
      orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
      include: { coverAsset: true },
    });
    return projects.length ? projects.map(dbProjectToProject) : PROJECTS;
  } catch {
    return PROJECTS;
  }
}
