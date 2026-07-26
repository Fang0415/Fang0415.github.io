import { NextRequest, NextResponse } from 'next/server';
import {
  adminRoute,
  nextSortOrder,
  optionalInt,
  optionalUrl,
  parseStringArray,
  readJson,
  requiredString,
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
  const title = requiredString(body, 'title', '项目名称');

  const project = await prisma.project.create({
    data: {
      title,
      slug: await uniqueSlug('project', String(body.slug || title)),
      summary: String(body.summary ?? '').trim(),
      content: body.content ? String(body.content) : null,
      category: String(body.category ?? '').trim() || '未分类',
      stack: parseStringArray(body.stack),
      repoUrl: optionalUrl(body, 'repoUrl', '仓库地址') ?? null,
      demoUrl: optionalUrl(body, 'demoUrl', '演示地址') ?? null,
      coverAssetId: body.coverAssetId ? String(body.coverAssetId) : null,
      status: toProjectStatus(body.status),
      sortOrder: optionalInt(body, 'sortOrder') ?? await nextSortOrder('project'),
    },
    include: { coverAsset: true },
  });

  return NextResponse.json({ project }, { status: 201 });
});
