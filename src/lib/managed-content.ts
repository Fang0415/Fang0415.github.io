import { Prisma, ProjectStatus, PublishStatus } from '@prisma/client';
import {
  categoryForTags,
  firstParagraphFor,
  getAllPosts,
  getPostBySlug,
  isoDate,
  readTimeFor,
  renderMarkdown,
  sortedPosts,
  toMeta,
  type BlogPost,
  type PostMeta,
} from './posts';
import { prisma } from './db';
import {
  EXPERIENCES,
  PROFILE,
  PROJECTS,
  type Experience,
  type LocalizedList,
  type LocalizedText,
  type Project,
} from './site';

type DbPost = Prisma.PostGetPayload<{ include: { coverAsset: true } }>;
type DbProject = Prisma.ProjectGetPayload<{ include: { coverAsset: true } }>;

function fallbackPostMetas(): PostMeta[] {
  return sortedPosts(getAllPosts()).map(toMeta);
}

function dbPostToBlogPost(post: DbPost): BlogPost {
  const pubDate = post.publishedAt ?? post.updatedAt;
  const { html, toc } = renderMarkdown(post.content);
  return {
    slug: post.slug,
    body: post.content,
    html,
    toc,
    data: {
      title: post.title,
      description: post.description,
      pubDate,
      updatedDate: post.updatedAt,
      tags: post.tags,
      draft: post.status !== PublishStatus.PUBLISHED,
      coverUrl: post.coverAsset?.publicUrl ?? undefined,
      coverAlt: post.coverAsset?.filename ?? undefined,
    },
  };
}

function dbPostToMeta(post: DbPost): PostMeta {
  const { category, color } = categoryForTags(post.tags);
  const date = isoDate(post.publishedAt ?? post.updatedAt);
  return {
    title: post.title,
    excerpt: post.description,
    preview: firstParagraphFor(post.content, post.description),
    date,
    isoDate: date,
    category,
    categoryColor: color,
    readTime: readTimeFor(post.content),
    href: `/blog/${post.slug}/`,
    coverUrl: post.coverAsset?.publicUrl ?? undefined,
  };
}

function dbStatusToProjectStatus(status: ProjectStatus): Project['status'] {
  if (status === ProjectStatus.IN_PROGRESS) return 'in_progress';
  if (status === ProjectStatus.COMPLETED) return 'completed';
  if (status === ProjectStatus.PUBLISHED) return 'published';
  return 'planning';
}

function jsonRecord(value: Prisma.JsonValue | null): Record<string, Prisma.JsonValue> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, Prisma.JsonValue>
    : {};
}

function dbLocalizedText(value: Prisma.JsonValue | null): LocalizedText {
  if (typeof value === 'string') return { zh: value, en: value };
  const record = jsonRecord(value);
  const zh = typeof record.zh === 'string' ? record.zh : '';
  const en = typeof record.en === 'string' ? record.en : '';
  return { zh, en };
}

function dbLocalizedList(value: Prisma.JsonValue | null): LocalizedList {
  const record = jsonRecord(value);
  const values = (locale: 'zh' | 'en') => Array.isArray(record[locale])
    ? record[locale].map(String).map((item) => item.trim()).filter(Boolean)
    : [];
  return { zh: values('zh'), en: values('en') };
}

function dbProjectToProject(project: DbProject): Project {
  return {
    id: project.slug,
    title: dbLocalizedText(project.title),
    status: dbStatusToProjectStatus(project.status),
    category: project.category,
    summary: dbLocalizedText(project.summary),
    highlights: dbLocalizedList(project.highlights),
    tags: project.tags,
    github: project.githubUrl ?? undefined,
    demo: project.demoUrl ?? undefined,
    content: project.content ? dbLocalizedText(project.content) : undefined,
    coverUrl: project.coverAsset?.publicUrl ?? undefined,
    coverAlt: project.coverAsset?.filename ?? undefined,
    featured: project.featured,
    visible: project.visible,
    updatedAt: isoDate(project.updatedAt),
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
      where: { visible: true },
      orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { updatedAt: 'desc' }],
      include: { coverAsset: true },
    });
    return projects.map(dbProjectToProject);
  } catch {
    return PROJECTS.filter((project) => project.visible);
  }
}

/**
 * Detail-page lookup deliberately permits a hidden project by direct URL so
 * the admin preview action keeps working before publication.
 */
export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  try {
    const project = await prisma.project.findUnique({
      where: { slug },
      include: { coverAsset: true },
    });
    if (project) return dbProjectToProject(project);
    return undefined;
  } catch {
    // Fall through to the checked-in defaults below.
  }
  return PROJECTS.find((project) => project.id === slug);
}

/** Every publicly visible project slug for the sitemap. */
export async function getAllProjects(): Promise<Project[]> {
  try {
    const projects = await prisma.project.findMany({
      where: { visible: true },
      orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
      include: { coverAsset: true },
    });
    return projects.map(dbProjectToProject);
  } catch {
    return PROJECTS;
  }
}

/**
 * The previous / next article in publication order. Read from the same list the
 * blog index renders, so the two can never disagree about ordering.
 */
export async function getPostNeighbours(slug: string): Promise<{
  prev?: PostMeta;
  next?: PostMeta;
}> {
  const posts = await getPublishedPostMetas();
  const index = posts.findIndex((post) => post.href === `/blog/${slug}/`);
  if (index === -1) return {};
  return {
    // `posts` is newest-first, so the *newer* neighbour sits at a lower index.
    next: posts[index - 1],
    prev: posts[index + 1],
  };
}

export async function getVisibleExperiences(): Promise<Experience[]> {
  try {
    const experiences = await prisma.experience.findMany({
      where: { visible: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
    if (!experiences.length) return EXPERIENCES;
    return experiences.map((experience) => ({
      id: experience.slug,
      company: experience.company,
      role: experience.role,
      period: experience.period,
      summary: experience.summary,
      highlights: experience.highlights,
      stack: experience.stack,
    }));
  } catch {
    return EXPERIENCES;
  }
}

/**
 * The persona strings. An empty database — or a database that is simply not
 * running — falls back to the checked-in defaults, so the marketing pages
 * never render blank.
 */
export async function getSiteProfile(): Promise<typeof PROFILE> {
  try {
    const profile = await prisma.siteProfile.findUnique({
      where: { id: 'default' },
      include: { avatarAsset: true },
    });
    if (!profile) return PROFILE;
    return {
      name: profile.name,
      wordmark: profile.wordmark,
      mark: profile.mark,
      role: profile.role,
      location: profile.location,
      hero: profile.hero,
      lead: profile.lead,
      email: profile.email,
      github: profile.github,
      wechat: profile.wechat,
      qq: PROFILE.qq,
      reddit: PROFILE.reddit,
      avatarUrl: profile.avatarAsset?.publicUrl ?? PROFILE.avatarUrl,
      // A row saved before these columns existed has empty arrays; falling back
      // to the defaults keeps the About page from rendering empty sections.
      aboutIntro: profile.aboutIntro || PROFILE.aboutIntro,
      focus: profile.focus.length ? profile.focus : PROFILE.focus,
      tools: profile.tools.length ? profile.tools : PROFILE.tools,
      now: profile.now.length ? profile.now : PROFILE.now,
      background: profile.background.length ? profile.background : PROFILE.background,
    };
  } catch {
    return PROFILE;
  }
}
