import { NextRequest, NextResponse } from 'next/server';
import { PublishStatus } from '@prisma/client';
import { ensureAdminResponse, parseStringArray, slugify } from '../../../../lib/admin-api';
import { prisma } from '../../../../lib/db';

export async function GET() {
  const unauthorized = await ensureAdminResponse();
  if (unauthorized) return unauthorized;

  const posts = await prisma.post.findMany({
    orderBy: [{ updatedAt: 'desc' }],
    include: { coverAsset: true },
  });
  return NextResponse.json({ posts });
}

export async function POST(request: NextRequest) {
  const unauthorized = await ensureAdminResponse();
  if (unauthorized) return unauthorized;

  const body = await request.json();
  const title = String(body.title || '').trim();
  if (!title) return NextResponse.json({ error: '标题不能为空' }, { status: 400 });

  const status = body.status === 'PUBLISHED' ? PublishStatus.PUBLISHED : PublishStatus.DRAFT;
  const post = await prisma.post.create({
    data: {
      title,
      slug: slugify(String(body.slug || title)),
      description: String(body.description || ''),
      content: String(body.content || ''),
      tags: parseStringArray(body.tags),
      coverAssetId: body.coverAssetId || null,
      status,
      publishedAt: status === PublishStatus.PUBLISHED ? new Date() : null,
    },
    include: { coverAsset: true },
  });

  return NextResponse.json({ post }, { status: 201 });
}
