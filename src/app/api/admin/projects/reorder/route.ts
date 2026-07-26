import { NextRequest, NextResponse } from 'next/server';
import { adminRoute, applyOrder, parseStringArray, readJson } from '../../../../../lib/admin-api';
import { prisma } from '../../../../../lib/db';

/** Body: `{ ids: [...] }` — the full list in the order it should render. */
export const PUT = adminRoute(async (request: NextRequest) => {
  const body = await readJson(request);
  await applyOrder('project', parseStringArray(body.ids));
  const projects = await prisma.project.findMany({
    orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
    include: { coverAsset: true },
  });
  return NextResponse.json({ projects });
});
