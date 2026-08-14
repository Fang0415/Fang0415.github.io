import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import {
  adminRoute,
  nextSortOrder,
  optionalBoolean,
  optionalInt,
  optionalLocalizedLines,
  optionalLocalizedText,
  optionalUrl,
  parseStringArray,
  readJson,
  requiredLocalizedText,
  toProjectStatus,
  uniqueSlug,
} from '../../../../lib/admin-api';
import { prisma } from '../../../../lib/db';

export const GET = adminRoute(async () => {
  const projects = await prisma.project.findMany({
    orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
    include: { coverAsset: true },
  });
  return NextResponse.json({ projects });
});

export const POST = adminRoute(async (request: NextRequest) => {
  const body = await readJson(request);
  const title = requiredLocalizedText(body, 'title', '项目名称');
  const summary = optionalLocalizedText(body, 'summary') ?? { zh: '', en: '' };
  const content = optionalLocalizedText(body, 'content');

  const project = await prisma.project.create({
    data: {
      title,
      slug: await uniqueSlug('project', String(body.slug || title.en || title.zh)),
      summary,
      content: content && (content.zh || content.en) ? content : Prisma.DbNull,
      highlights: optionalLocalizedLines(body, 'highlights') ?? { zh: [], en: [] },
      category: String(body.category ?? '').trim() || '未分类',
      tags: parseStringArray(body.tags),
      githubUrl: optionalUrl(body, 'githubUrl', 'GitHub 地址') ?? null,
      demoUrl: optionalUrl(body, 'demoUrl', '演示地址') ?? null,
      coverAssetId: body.coverAssetId ? String(body.coverAssetId) : null,
      status: toProjectStatus(body.status),
      featured: optionalBoolean(body, 'featured') ?? false,
      visible: optionalBoolean(body, 'visible') ?? true,
      sortOrder: optionalInt(body, 'sortOrder') ?? await nextSortOrder('project'),
    },
    include: { coverAsset: true },
  });

  return NextResponse.json({ project }, { status: 201 });
});
