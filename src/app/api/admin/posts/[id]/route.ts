import { NextRequest, NextResponse } from 'next/server';
import { PublishStatus } from '@prisma/client';
import {
  HttpError,
  adminRoute,
  optionalBoolean,
  optionalString,
  optionalStringArray,
  readJson,
  toPublishStatus,
  uniqueSlug,
} from '../../../../../lib/admin-api';
import { prisma } from '../../../../../lib/db';

interface Params {
  id: string;
}

type Ctx = { params: Promise<Params> };

export const GET = adminRoute(async (_request: NextRequest, { params }: Ctx) => {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id }, include: { coverAsset: true } });
  if (!post) throw new HttpError(404, '文章不存在');
  return NextResponse.json({ post });
});

export const PATCH = adminRoute(async (request: NextRequest, { params }: Ctx) => {
  const { id } = await params;
  const body = await readJson(request);

  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) throw new HttpError(404, '文章不存在');

  const title = optionalString(body, 'title');
  if (title !== undefined && !title) throw new HttpError(400, '标题不能为空');

  const status = body.status === undefined ? undefined : toPublishStatus(body.status);
  const nextStatus = status ?? existing.status;
  const slugSource = optionalString(body, 'slug') || title;

  const post = await prisma.post.update({
    where: { id },
    data: {
      title,
      slug: slugSource === undefined ? undefined : await uniqueSlug('post', slugSource, id),
      description: optionalString(body, 'description'),
      content: body.content === undefined ? undefined : String(body.content),
      tags: optionalStringArray(body, 'tags'),
      coverAssetId: body.coverAssetId === undefined ? undefined : (String(body.coverAssetId) || null),
      featured: optionalBoolean(body, 'featured'),
      status,
      // Keep the original publish date across edits: re-saving a typo fix
      // should not bump the post back to the top of the blog index.
      publishedAt: nextStatus !== PublishStatus.PUBLISHED
        ? null
        : body.publishedAt
          ? new Date(String(body.publishedAt))
          : existing.publishedAt ?? new Date(),
    },
    include: { coverAsset: true },
  });

  return NextResponse.json({ post });
});

export const DELETE = adminRoute(async (_request: NextRequest, { params }: Ctx) => {
  const { id } = await params;
  await prisma.post.delete({ where: { id } });
  return NextResponse.json({ ok: true });
});
