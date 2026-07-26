import { NextRequest, NextResponse } from 'next/server';
import { adminRoute, applyOrder, parseStringArray, readJson } from '../../../../../lib/admin-api';
import { prisma } from '../../../../../lib/db';

/** Body: `{ ids: [...] }` — the full list in the order it should render. */
export const PUT = adminRoute(async (request: NextRequest) => {
  const body = await readJson(request);
  await applyOrder('experience', parseStringArray(body.ids));
  const experiences = await prisma.experience.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  });
  return NextResponse.json({ experiences });
});
