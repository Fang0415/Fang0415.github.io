import { NextRequest, NextResponse } from 'next/server';
import { ProjectStatus } from '@prisma/client';
import { ensureAdminResponse, parseStringArray, slugify } from '../../../../lib/admin-api';
import { prisma } from '../../../../lib/db';

function toProjectStatus(value: unknown) {
  if (value === 'ACTIVE') return ProjectStatus.ACTIVE;
  if (value === 'SHIPPED') return ProjectStatus.SHIPPED;
  if (value === 'ARCHIVED') return ProjectStatus.ARCHIVED;
  return ProjectStatus.BUILDING;
}

export async function GET() {
  const unauthorized = await ensureAdminResponse();
  if (unauthorized) return unauthorized;

  const projects = await prisma.project.findMany({
    orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
    include: { coverAsset: true },
  });
  return NextResponse.json({ projects });
}

export async function POST(request: NextRequest) {
  const unauthorized = await ensureAdminResponse();
  if (unauthorized) return unauthorized;

  const body = await request.json();
  const title = String(body.title || '').trim();
  if (!title) return NextResponse.json({ error: '项目名称不能为空' }, { status: 400 });

  const project = await prisma.project.create({
    data: {
      title,
      slug: slugify(String(body.slug || title)),
      summary: String(body.summary || ''),
      content: body.content ? String(body.content) : null,
      category: String(body.category || '未分类'),
      stack: parseStringArray(body.stack),
      repoUrl: body.repoUrl ? String(body.repoUrl) : null,
      demoUrl: body.demoUrl ? String(body.demoUrl) : null,
      coverAssetId: body.coverAssetId || null,
      status: toProjectStatus(body.status),
      sortOrder: Number(body.sortOrder || 0),
    },
    include: { coverAsset: true },
  });

  return NextResponse.json({ project }, { status: 201 });
}
