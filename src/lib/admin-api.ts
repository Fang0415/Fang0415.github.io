import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from './admin-auth';

export async function ensureAdminResponse() {
  if (await isAdminAuthenticated()) return null;
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export function parseStringArray(value: unknown) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === 'string') {
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
    || crypto.randomUUID();
}
