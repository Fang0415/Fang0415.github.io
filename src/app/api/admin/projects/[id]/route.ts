import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import {
  HttpError,
  adminRoute,
  optionalBoolean,
  optionalInt,
  optionalLocalizedLines,
  optionalLocalizedText,
  optionalString,
  optionalStringArray,
  optionalUrl,
  readJson,
  toProjectStatus,
  uniqueSlug,
} from '../../../../../lib/admin-api';
import { prisma } from '../../../../../lib/db';

interface Params {
  id: string;
}

type Ctx = { params: Promise<Params> };

export const GET = adminRoute(async (_request: NextRequest, { params }: Ctx) => {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id }, include: { coverAsset: true } });
  if (!project) throw new HttpError(404, '项目不存在');
  return NextResponse.json({ project });
});

export const PATCH = adminRoute(async (request: NextRequest, { params }: Ctx) => {
  const { id } = await params;
  const body = await readJson(request);

  const title = optionalLocalizedText(body, 'title');
  if (title !== undefined && !title.zh && !title.en) throw new HttpError(400, '项目名称不能为空');
  const slugSource = optionalString(body, 'slug') || title?.en || title?.zh;
  const content = optionalLocalizedText(body, 'content');

  const project = await prisma.project.update({
    where: { id },
    data: {
      title,
      slug: slugSource === undefined ? undefined : await uniqueSlug('project', slugSource, id),
      summary: optionalLocalizedText(body, 'summary'),
      content: content === undefined
        ? undefined
        : (content.zh || content.en ? content : Prisma.DbNull),
      highlights: optionalLocalizedLines(body, 'highlights'),
      category: optionalString(body, 'category'),
      tags: optionalStringArray(body, 'tags'),
      githubUrl: optionalUrl(body, 'githubUrl', 'GitHub 地址'),
      demoUrl: optionalUrl(body, 'demoUrl', '演示地址'),
      coverAssetId: body.coverAssetId === undefined ? undefined : (String(body.coverAssetId) || null),
      status: body.status === undefined ? undefined : toProjectStatus(body.status),
      featured: optionalBoolean(body, 'featured'),
      visible: optionalBoolean(body, 'visible'),
      sortOrder: optionalInt(body, 'sortOrder'),
    },
    include: { coverAsset: true },
  });

  return NextResponse.json({ project });
});

export const DELETE = adminRoute(async (_request: NextRequest, { params }: Ctx) => {
  const { id } = await params;
  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ ok: true });
});
