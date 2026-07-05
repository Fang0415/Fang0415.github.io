import { NextRequest, NextResponse } from 'next/server';
import { createAdminToken, isValidAdminPassword, setAdminCookie } from '../../../../lib/admin-auth';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const password = String(body.password || '');

  if (!isValidAdminPassword(password)) {
    return NextResponse.json({ error: '密码错误' }, { status: 401 });
  }

  await setAdminCookie(createAdminToken());
  return NextResponse.json({ ok: true });
}
