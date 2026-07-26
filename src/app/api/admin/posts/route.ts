import { NextRequest, NextResponse } from 'next/server';
import { PublishStatus } from '@prisma/client';
import {
  adminRoute,
  optionalBoolean,
  parseStringArray,
  readJson,
  requiredString,
  toPublishStatus,
  uniqueSlug,
} from '../../../../lib/admin-api';
import { prisma } from '../../../../lib/db';

export const GET = adminRoute(async () => {
  const posts = await prisma.post.findMany({
    orderBy: [{ updatedAt: 'desc' }],
    include: { coverAsset: true },
  });
  return NextResponse.json({ posts });
});

export const POST = adminRoute(async (request: NextRequest) => {
  const body = await readJson(request);
  const title = requiredString(body, 'title', '标题');
  const status = toPublishStatus(body.status);

  const post = await prisma.post.create({
    data: {
      title,
      slug: await uniqueSlug('post', String(body.slug || title)),
      description: String(body.description ?? '').trim(),
      content: String(body.content ?? ''),
      tags: parseStringArray(body.tags),
      coverAssetId: body.coverAssetId ? String(body.coverAssetId) : null,
      featured: optionalBoolean(body, 'featured') ?? false,
      status,
      publishedAt: status === PublishStatus.PUBLISHED ? new Date() : null,
    },
    include: { coverAsset: true },
  });

  return NextResponse.json({ post }, { status: 201 });
});
