import { NextRequest, NextResponse } from 'next/server';
import { ProjectStatus } from '@prisma/client';
import { ensureAdminResponse, parseStringArray, slugify } from '../../../../../lib/admin-api';
import { prisma } from '../../../../../lib/db';

interface Params {
  id: string;
}

function toProjectStatus(value: unknown) {
  if (value === 'ACTIVE') return ProjectStatus.ACTIVE;
  if (value === 'SHIPPED') return ProjectStatus.SHIPPED;
  if (value === 'ARCHIVED') return ProjectStatus.ARCHIVED;
  return ProjectStatus.BUILDING;
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<Params> }) {
  const unauthorized = await ensureAdminResponse();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const body = await request.json();
  const project = await prisma.project.update({
    where: { id },
    data: {
      title: body.title === undefined ? undefined : String(body.title),
      slug: body.slug === undefined ? undefined : slugify(String(body.slug)),
      summary: body.summary === undefined ? undefined : String(body.summary),
      content: body.content === undefined ? undefined : (body.content ? String(body.content) : null),
      category: body.category === undefined ? undefined : String(body.category),
      stack: body.stack === undefined ? undefined : parseStringArray(body.stack),
      repoUrl: body.repoUrl === undefined ? undefined : (body.repoUrl ? String(body.repoUrl) : null),
      demoUrl: body.demoUrl === undefined ? undefined : (body.demoUrl ? String(body.demoUrl) : null),
      coverAssetId: body.coverAssetId === undefined ? undefined : (body.coverAssetId || null),
      status: body.status === undefined ? undefined : toProjectStatus(body.status),
      sortOrder: body.sortOrder === undefined ? undefined : Number(body.sortOrder || 0),
    },
    include: { coverAsset: true },
  });

  return NextResponse.json({ project });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<Params> }) {
  const unauthorized = await ensureAdminResponse();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
