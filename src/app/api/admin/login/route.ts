import { NextRequest, NextResponse } from 'next/server';
import {
  checkLoginRate,
  clearLoginFailures,
  clientKey,
  createAdminToken,
  isValidAdminPassword,
  recordLoginFailure,
  setAdminCookie,
} from '../../../../lib/admin-auth';

export async function POST(request: NextRequest) {
  const key = clientKey(request);
  const rate = checkLoginRate(key);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: `尝试次数过多，请在 ${Math.ceil(rate.retryInSec / 60)} 分钟后重试` },
      { status: 429, headers: { 'Retry-After': String(rate.retryInSec) } },
    );
  }

  const body = await request.json().catch(() => ({}));
  const password = String(body.password || '');

  if (!isValidAdminPassword(password)) {
    recordLoginFailure(key);
    return NextResponse.json({ error: '密码错误' }, { status: 401 });
  }

  clearLoginFailures(key);
  await setAdminCookie(createAdminToken());
  return NextResponse.json({ ok: true });
}
