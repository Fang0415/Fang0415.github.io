import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { Prisma, ProjectStatus, PublishStatus } from '@prisma/client';
import { isAdminAuthenticated } from './admin-auth';
import { prisma } from './db';

export function toPublishStatus(value: unknown): PublishStatus {
  if (value === 'PUBLISHED') return PublishStatus.PUBLISHED;
  if (value === 'ARCHIVED') return PublishStatus.ARCHIVED;
  return PublishStatus.DRAFT;
}

export function toProjectStatus(value: unknown): ProjectStatus {
  if (value === 'IN_PROGRESS') return ProjectStatus.IN_PROGRESS;
  if (value === 'COMPLETED') return ProjectStatus.COMPLETED;
  if (value === 'PUBLISHED') return ProjectStatus.PUBLISHED;
  return ProjectStatus.PLANNING;
}

export async function ensureAdminResponse() {
  if (await isAdminAuthenticated()) return null;
  return NextResponse.json({ error: '登录状态已失效，请重新登录' }, { status: 401 });
}

/**
 * Every admin handler is wrapped in this. Without it a duplicate slug or a
 * stopped database surfaces as an opaque 500 and the dashboard just says
 * "保存失败" — the two cases need very different reactions from the operator.
 */
export function adminRoute<Args extends unknown[]>(
  handler: (...args: Args) => Promise<NextResponse>,
) {
  return async (...args: Args): Promise<NextResponse> => {
    const unauthorized = await ensureAdminResponse();
    if (unauthorized) return unauthorized;
    try {
      return await handler(...args);
    } catch (error) {
      return errorResponse(error);
    }
  };
}

export class HttpError extends Error {
  constructor(readonly status: number, message: string) {
    super(message);
  }
}

export function errorResponse(error: unknown): NextResponse {
  if (error instanceof HttpError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002 unique violation, P2025 record not found, P2003 FK violation.
    if (error.code === 'P2002') {
      const target = (error.meta?.target as string[] | undefined)?.join('、') ?? '字段';
      return NextResponse.json({ error: `${target} 已存在，请换一个` }, { status: 409 });
    }
    if (error.code === 'P2025') {
      return NextResponse.json({ error: '记录不存在或已被删除' }, { status: 404 });
    }
    if (error.code === 'P2003') {
      return NextResponse.json({ error: '关联的记录不存在' }, { status: 400 });
    }
  }
  if (isDatabaseUnreachable(error)) {
    return NextResponse.json({ error: '数据库连接失败，请检查 DATABASE_URL 与 Postgres 服务' }, { status: 503 });
  }
  console.error('[admin-api]', error);
  return NextResponse.json({ error: '服务端错误，请查看服务日志' }, { status: 500 });
}

export function isDatabaseUnreachable(error: unknown) {
  if (error instanceof Prisma.PrismaClientInitializationError) return true;
  const code = (error as { code?: string } | null)?.code;
  return code === 'ECONNREFUSED' || code === 'ENOTFOUND' || code === '57P03';
}

export async function readJson(request: Request): Promise<Record<string, unknown>> {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new HttpError(400, '请求体必须是 JSON 对象');
  }
  return body as Record<string, unknown>;
}

export function requiredString(body: Record<string, unknown>, field: string, label: string) {
  const value = String(body[field] ?? '').trim();
  if (!value) throw new HttpError(400, `${label}不能为空`);
  return value;
}

/** `undefined` means "field absent from the PATCH body", i.e. leave it alone. */
export function optionalString(body: Record<string, unknown>, field: string) {
  if (body[field] === undefined) return undefined;
  return String(body[field] ?? '').trim();
}

export function optionalNullableString(body: Record<string, unknown>, field: string) {
  if (body[field] === undefined) return undefined;
  const value = String(body[field] ?? '').trim();
  return value || null;
}

export function optionalBoolean(body: Record<string, unknown>, field: string) {
  if (body[field] === undefined) return undefined;
  return body[field] === true || body[field] === 'true';
}

export function optionalInt(body: Record<string, unknown>, field: string) {
  if (body[field] === undefined) return undefined;
  const value = Number(body[field]);
  if (!Number.isFinite(value)) throw new HttpError(400, `${field} 必须是数字`);
  return Math.trunc(value);
}

export function parseStringArray(value: unknown) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value === 'string') {
    return value.split(/[,，\n]/).map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

export function optionalStringArray(body: Record<string, unknown>, field: string) {
  if (body[field] === undefined) return undefined;
  return parseStringArray(body[field]);
}

export interface LocalizedTextInput extends Record<string, string> {
  zh: string;
  en: string;
}

export interface LocalizedListInput extends Record<string, string[]> {
  zh: string[];
  en: string[];
}

export function parseLocalizedText(value: unknown): LocalizedTextInput {
  if (typeof value === 'string') {
    const text = value.trim();
    return { zh: text, en: text };
  }
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { zh: '', en: '' };
  const record = value as Record<string, unknown>;
  return {
    zh: String(record.zh ?? '').trim(),
    en: String(record.en ?? '').trim(),
  };
}

export function requiredLocalizedText(body: Record<string, unknown>, field: string, label: string) {
  const value = parseLocalizedText(body[field]);
  if (!value.zh && !value.en) throw new HttpError(400, `${label}不能为空`);
  return value;
}

export function optionalLocalizedText(body: Record<string, unknown>, field: string) {
  if (body[field] === undefined) return undefined;
  return parseLocalizedText(body[field]);
}

export function parseLocalizedLines(value: unknown): LocalizedListInput {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { zh: [], en: [] };
  const record = value as Record<string, unknown>;
  return {
    zh: optionalLines({ value: record.zh }, 'value') ?? [],
    en: optionalLines({ value: record.en }, 'value') ?? [],
  };
}

export function optionalLocalizedLines(body: Record<string, unknown>, field: string) {
  if (body[field] === undefined) return undefined;
  return parseLocalizedLines(body[field]);
}

/**
 * Newline-only variant of {@link optionalStringArray}. Prose entries — an
 * Profile bullet, a highlight — routinely contain commas, so splitting on
 * them would tear one sentence into several list items.
 */
export function optionalLines(body: Record<string, unknown>, field: string) {
  const value = body[field];
  if (value === undefined) return undefined;
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  return String(value ?? '').split('\n').map((line) => line.trim()).filter(Boolean);
}

export function optionalUrl(body: Record<string, unknown>, field: string, label: string) {
  const value = optionalNullableString(body, field);
  if (value === undefined || value === null) return value;
  if (!/^(https?:\/\/|\/|#)/.test(value)) {
    throw new HttpError(400, `${label}需要以 http(s):// 或 / 开头`);
  }
  return value;
}

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9一-龥]+/g, '-')
    .replace(/^-+|-+$/g, '')
    || crypto.randomUUID();
}

type SluggedModel = 'post' | 'project' | 'experience';

/**
 * Appends -2, -3 … until the slug is free. Two posts called "周报" should both
 * save rather than the second one bouncing off a unique constraint.
 */
export async function uniqueSlug(model: SluggedModel, base: string, ignoreId?: string) {
  const root = slugify(base);
  // Prisma's generated delegates are model-specific, so a union of three of
  // them has no shared call signature. The narrow shape below is the only part
  // this helper touches; the cast goes through `unknown` because the delegate
  // types deliberately refuse structural comparison.
  const delegate = prisma[model] as unknown as {
    findFirst(args: {
      where: { slug: string; id?: { not: string } };
      select: { id: true };
    }): Promise<{ id: string } | null>;
  };

  for (let attempt = 0; attempt < 50; attempt += 1) {
    const candidate = attempt === 0 ? root : `${root}-${attempt + 1}`;
    const clash = await delegate.findFirst({
      where: ignoreId ? { slug: candidate, id: { not: ignoreId } } : { slug: candidate },
      select: { id: true },
    });
    if (!clash) return candidate;
  }
  return `${root}-${crypto.randomUUID().slice(0, 8)}`;
}

type OrderedModel = 'project' | 'experience';

/** Highest sortOrder + 10, so new rows land at the end with room to reorder. */
export async function nextSortOrder(model: OrderedModel) {
  const delegate = prisma[model] as unknown as {
    findFirst(args: {
      orderBy: { sortOrder: 'desc' };
      select: { sortOrder: true };
    }): Promise<{ sortOrder: number } | null>;
  };
  const last = await delegate.findFirst({ orderBy: { sortOrder: 'desc' }, select: { sortOrder: true } });
  return (last?.sortOrder ?? 0) + 10;
}

/**
 * Persists an explicit id order as sortOrder 10, 20, 30 … in one transaction so
 * a half-applied reorder can never leave the list in a mixed state.
 */
export async function applyOrder(model: OrderedModel, ids: string[]) {
  if (!ids.length) throw new HttpError(400, '排序列表不能为空');
  const delegate = prisma[model] as unknown as {
    update(args: { where: { id: string }; data: { sortOrder: number } }): Prisma.PrismaPromise<unknown>;
  };
  await prisma.$transaction(
    ids.map((id, index) => delegate.update({ where: { id }, data: { sortOrder: (index + 1) * 10 } })),
  );
}
