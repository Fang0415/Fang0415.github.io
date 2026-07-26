import { NextRequest, NextResponse } from 'next/server';
import {
  HttpError,
  adminRoute,
  optionalBoolean,
  optionalInt,
  optionalString,
  optionalStringArray,
  readJson,
  uniqueSlug,
} from '../../../../../lib/admin-api';
import { prisma } from '../../../../../lib/db';

interface Params {
  id: string;
}

type Ctx = { params: Promise<Params> };

export const PATCH = adminRoute(async (request: NextRequest, { params }: Ctx) => {
  const { id } = await params;
  const body = await readJson(request);

  const company = optionalString(body, 'company');
  if (company !== undefined && !company) throw new HttpError(400, '机构名称不能为空');
  const role = optionalString(body, 'role');
  if (role !== undefined && !role) throw new HttpError(400, '角色不能为空');
  const slugSource = optionalString(body, 'slug') || company;

  const experience = await prisma.experience.update({
    where: { id },
    data: {
      slug: slugSource === undefined ? undefined : await uniqueSlug('experience', slugSource, id),
      company,
      role,
      period: optionalString(body, 'period'),
      summary: optionalString(body, 'summary'),
      highlights: optionalStringArray(body, 'highlights'),
      stack: optionalStringArray(body, 'stack'),
      visible: optionalBoolean(body, 'visible'),
      sortOrder: optionalInt(body, 'sortOrder'),
    },
  });

  return NextResponse.json({ experience });
});

export const DELETE = adminRoute(async (_request: NextRequest, { params }: Ctx) => {
  const { id } = await params;
  await prisma.experience.delete({ where: { id } });
  return NextResponse.json({ ok: true });
});
