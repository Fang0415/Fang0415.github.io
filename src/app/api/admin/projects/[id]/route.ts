import { NextRequest, NextResponse } from 'next/server';
import {
  HttpError,
  adminRoute,
  optionalInt,
  optionalNullableString,
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

  const title = optionalString(body, 'title');
  if (title !== undefined && !title) throw new HttpError(400, '项目名称不能为空');
  const slugSource = optionalString(body, 'slug') || title;

  const project = await prisma.project.update({
    where: { id },
    data: {
      title,
      slug: slugSource === undefined ? undefined : await uniqueSlug('project', slugSource, id),
      summary: optionalString(body, 'summary'),
      content: optionalNullableString(body, 'content'),
      category: optionalString(body, 'category'),
      stack: optionalStringArray(body, 'stack'),
      repoUrl: optionalUrl(body, 'repoUrl', '仓库地址'),
      demoUrl: optionalUrl(body, 'demoUrl', '演示地址'),
      coverAssetId: body.coverAssetId === undefined ? undefined : (String(body.coverAssetId) || null),
      status: body.status === undefined ? undefined : toProjectStatus(body.status),
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
