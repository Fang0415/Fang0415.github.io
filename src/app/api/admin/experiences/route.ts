import { NextRequest, NextResponse } from 'next/server';
import {
  adminRoute,
  nextSortOrder,
  optionalBoolean,
  optionalInt,
  parseStringArray,
  readJson,
  requiredString,
  uniqueSlug,
} from '../../../../lib/admin-api';
import { prisma } from '../../../../lib/db';

export const GET = adminRoute(async () => {
  const experiences = await prisma.experience.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  });
  return NextResponse.json({ experiences });
});

export const POST = adminRoute(async (request: NextRequest) => {
  const body = await readJson(request);
  const company = requiredString(body, 'company', '机构名称');
  const role = requiredString(body, 'role', '角色');

  const experience = await prisma.experience.create({
    data: {
      slug: await uniqueSlug('experience', String(body.slug || company)),
      company,
      role,
      period: String(body.period ?? '').trim(),
      summary: String(body.summary ?? '').trim(),
      highlights: parseStringArray(body.highlights),
      stack: parseStringArray(body.stack),
      visible: optionalBoolean(body, 'visible') ?? true,
      sortOrder: optionalInt(body, 'sortOrder') ?? await nextSortOrder('experience'),
    },
  });

  return NextResponse.json({ experience }, { status: 201 });
});
