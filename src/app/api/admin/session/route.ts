import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '../../../../lib/admin-auth';
import { prisma } from '../../../../lib/db';
import { isDatabaseUnreachable } from '../../../../lib/admin-api';
import { hasStorageConfig } from '../../../../lib/storage';

/**
 * Lets the dashboard tell "session expired" apart from "Postgres is down"
 * before it fires off four parallel loads and shows four identical failures.
 */
export async function GET() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ authenticated: false, database: 'unknown' }, { status: 401 });
  }

  let database: 'up' | 'down' = 'up';
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    if (!isDatabaseUnreachable(error)) console.error('[session] db check failed', error);
    database = 'down';
  }

  return NextResponse.json({ authenticated: true, database, storage: hasStorageConfig() });
}
