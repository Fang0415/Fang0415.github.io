import crypto from 'node:crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'fang_admin_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || 'dev-only-change-me';
}

function sign(value: string) {
  return crypto.createHmac('sha256', getSecret()).update(value).digest('hex');
}

/** Constant-time compare that also hides the length difference. */
function safeEqual(a: string, b: string) {
  const ha = crypto.createHash('sha256').update(a).digest();
  const hb = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export function createAdminToken() {
  const expires = Date.now() + SESSION_TTL_MS;
  const payload = `admin.${expires}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminToken(token?: string) {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const payload = `${parts[0]}.${parts[1]}`;
  if (!safeEqual(sign(payload), parts[2])) return false;
  return Number(parts[1]) > Date.now();
}

export async function isAdminAuthenticated() {
  const store = await cookies();
  return verifyAdminToken(store.get(COOKIE_NAME)?.value);
}

export async function setAdminCookie(token: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export async function clearAdminCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export function isValidAdminPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    // No password configured: allow a well-known one in dev, refuse in prod.
    return process.env.NODE_ENV !== 'production' && password === 'admin';
  }
  return safeEqual(expected, password);
}

/**
 * In-memory login throttle keyed by client IP. A single Next process has
 * nowhere better to keep this, and it turns the admin password from
 * "brute-forceable over the network" into five tries per fifteen minutes.
 */
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 1000 * 60 * 15;
const attempts = new Map<string, { count: number; firstAt: number }>();

export function clientKey(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
}

export function checkLoginRate(key: string) {
  const entry = attempts.get(key);
  if (!entry) return { allowed: true as const };
  if (Date.now() - entry.firstAt > WINDOW_MS) {
    attempts.delete(key);
    return { allowed: true as const };
  }
  if (entry.count < MAX_ATTEMPTS) return { allowed: true as const };
  return {
    allowed: false as const,
    retryInSec: Math.ceil((WINDOW_MS - (Date.now() - entry.firstAt)) / 1000),
  };
}

export function recordLoginFailure(key: string) {
  const entry = attempts.get(key);
  if (!entry || Date.now() - entry.firstAt > WINDOW_MS) {
    attempts.set(key, { count: 1, firstAt: Date.now() });
    return;
  }
  entry.count += 1;
}

export function clearLoginFailures(key: string) {
  attempts.delete(key);
}
