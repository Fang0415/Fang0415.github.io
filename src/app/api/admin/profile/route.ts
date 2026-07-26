import { NextRequest, NextResponse } from 'next/server';
import { adminRoute, optionalLines, optionalString, optionalStringArray, readJson } from '../../../../lib/admin-api';
import { prisma } from '../../../../lib/db';
import { PROFILE } from '../../../../lib/site';

const PROFILE_ID = 'default';

export const GET = adminRoute(async () => {
  const profile = await prisma.siteProfile.findUnique({
    where: { id: PROFILE_ID },
    include: { avatarAsset: true },
  });
  // Before the first save there is no row; hand back the static defaults so the
  // form opens pre-filled instead of blank.
  return NextResponse.json({ profile: profile ?? { id: PROFILE_ID, ...PROFILE, avatarAssetId: null } });
});

export const PUT = adminRoute(async (request: NextRequest) => {
  const body = await readJson(request);
  const fields = {
    name: optionalString(body, 'name'),
    wordmark: optionalString(body, 'wordmark'),
    mark: optionalString(body, 'mark'),
    role: optionalString(body, 'role'),
    location: optionalString(body, 'location'),
    hero: optionalString(body, 'hero'),
    lead: optionalString(body, 'lead'),
    email: optionalString(body, 'email'),
    github: optionalString(body, 'github'),
    wechat: optionalString(body, 'wechat'),
    aboutIntro: optionalString(body, 'aboutIntro'),
    // One entry per line: these read as prose and contain commas.
    focus: optionalLines(body, 'focus'),
    tools: optionalStringArray(body, 'tools'),
    now: optionalLines(body, 'now'),
    background: optionalLines(body, 'background'),
  };
  const avatarAssetId = body.avatarAssetId === undefined
    ? undefined
    : (String(body.avatarAssetId) || null);

  const profile = await prisma.siteProfile.upsert({
    where: { id: PROFILE_ID },
    update: { ...fields, avatarAssetId },
    create: {
      id: PROFILE_ID,
      ...PROFILE,
      ...Object.fromEntries(Object.entries(fields).filter(([, value]) => value !== undefined)),
      avatarAssetId: avatarAssetId ?? null,
    },
    include: { avatarAsset: true },
  });

  return NextResponse.json({ profile });
});
