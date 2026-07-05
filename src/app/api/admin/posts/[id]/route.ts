import { NextRequest, NextResponse } from 'next/server';
import { PublishStatus } from '@prisma/client';
import { ensureAdminResponse, parseStringArray, slugify } from '../../../../../lib/admin-api';
import { prisma } from '../../../../../lib/db';

interface Params {
  id: string;
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<Params> }) {
  const unauthorized = await ensureAdminResponse();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const body = await request.json();
  const status = body.status === undefined
    ? undefined
    : body.status === 'PUBLISHED'
      ? PublishStatus.PUBLISHED
      : body.status === 'ARCHIVED'
        ? PublishStatus.ARCHIVED
        : PublishStatus.DRAFT;

  const post = await prisma.post.update({
    where: { id },
    data: {
      title: body.title === undefined ? undefined : String(body.title),
      slug: body.slug === undefined ? undefined : slugify(String(body.slug)),
      description: body.description === undefined ? undefined : String(body.description),
      content: body.content === undefined ? undefined : String(body.content),
      tags: body.tags === undefined ? undefined : parseStringArray(body.tags),
      coverAssetId: body.coverAssetId === undefined ? undefined : (body.coverAssetId || null),
      status,
      publishedAt: status === undefined
        ? undefined
        : status === PublishStatus.PUBLISHED
          ? (body.publishedAt ? new Date(body.publishedAt) : new Date())
          : null,
    },
    include: { coverAsset: true },
  });

  return NextResponse.json({ post });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<Params> }) {
  const unauthorized = await ensureAdminResponse();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  await prisma.post.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
